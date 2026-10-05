#!/usr/bin/env python3
"""Budget-guarded OpenRouter text-to-image generator for Aethelgard.

Rules enforced here (see docs/PRODUCTION_BIBLE.md):
  * ONE cost-efficient image model (MODEL). No video, no calibration sweeps.
  * Before every call: live price check of MODEL + live check of the key's
    remaining limit. Refuses if the estimate is above MAX_COST_PER_IMAGE or
    if the call would eat into RESERVE_USD.
  * Every call is appended to production/ledger/openrouter_ledger.jsonl with
    the real cost reported by OpenRouter.
  * Prompts are assembled strictly as
      Identity + Core Traits + Clothing + Pose + Camera + Background (+ Style)
    from production/prompts/ep01_opening.json.

Usage:
  python3 tools/or_image.py <asset_id> [--ref <png> ...] [--seed N] [--dry-run]
  python3 tools/or_image.py --budget
"""
import argparse
import base64
import datetime as dt
import json
import pathlib
import re
import sys

import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROMPTS = ROOT / "production/prompts/ep01_opening.json"
RAW_DIR = ROOT / "production/raw"
LEDGER = ROOT / "production/ledger/openrouter_ledger.jsonl"

API = "https://openrouter.ai/api/v1"
MODEL = "google/gemini-2.5-flash-image"
# Gemini 2.5 Flash Image bills ~1290 output tokens per 1K image.
EST_OUTPUT_TOKENS = 1290
EST_INPUT_TOKENS_PER_REF = 1290
EST_TEXT_TOKENS = 400
MAX_COST_PER_IMAGE = 0.06   # "cheap model" gate
RESERVE_USD = 0.25          # never spend the last 25 cents of the $2 key
SESSION_CAP_USD = 1.60      # hard stop for the whole ledger


def _get(path):
    r = requests.get(f"{API}{path}", timeout=60)
    r.raise_for_status()
    return r.json()["data"]


def key_status():
    return _get("/key")


def ledger_total():
    if not LEDGER.exists():
        return 0.0
    return sum(json.loads(l).get("cost_usd") or 0.0 for l in LEDGER.read_text().splitlines() if l.strip())


def estimate_cost(n_refs):
    models = requests.get(f"{API}/models?output_modalities=image", timeout=60).json()["data"]
    m = next((m for m in models if m["id"] == MODEL), None)
    if m is None:
        sys.exit(f"[guard] model {MODEL} not found in live catalogue")
    p = m["pricing"]
    out_price = float(p.get("image_output") or p.get("completion") or 0)
    in_img = float(p.get("image") or p.get("prompt") or 0)
    in_txt = float(p.get("prompt") or 0)
    est = out_price * EST_OUTPUT_TOKENS + in_img * EST_INPUT_TOKENS_PER_REF * n_refs + in_txt * EST_TEXT_TOKENS
    return est, p


def build_prompt(asset):
    lib = json.loads(PROMPTS.read_text())
    blocks = lib["blocks"]
    spec = lib["assets"][asset]

    def resolve(v):
        # "@kaelan.identity" -> verbatim library block (anti-drift)
        return re.sub(r"@(\w+(?:\.\w+)*)", lambda mt: _lookup(blocks, mt.group(1)), v)

    order = ["identity", "core_traits", "clothing", "pose", "camera", "background"]
    parts = [resolve(spec[k]) for k in order if spec.get(k)]
    if spec.get("refs"):
        parts.insert(0, blocks["ref_note_multi"] if len(spec["refs"]) > 1 else blocks["ref_note"])
    parts.append(resolve(spec.get("style", "@style.anime")))
    return " ".join(p.strip().rstrip(".") + "." for p in parts), spec


def _lookup(blocks, dotted):
    cur = blocks
    for k in dotted.split("."):
        cur = cur[k]
    return cur


def next_version(asset):
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    vs = [int(m.group(1)) for f in [*RAW_DIR.glob(f"{asset}_v*.png"), *RAW_DIR.glob(f"_rejected/{asset}_v*.png")] if (m := re.search(r"_v(\d+)(?:_final)?\.png$", f.name))]
    return max(vs, default=0) + 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("asset", nargs="?")
    ap.add_argument("--ref", action="append", default=[])
    ap.add_argument("--seed", type=int)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--budget", action="store_true")
    a = ap.parse_args()

    ks = key_status()
    if a.budget or not a.asset:
        print(json.dumps({"limit": ks["limit"], "usage": ks["usage"], "remaining": ks["limit_remaining"],
                          "ledger_total": round(ledger_total(), 4)}, indent=2))
        return

    prompt, spec = build_prompt(a.asset)
    refs = a.ref or spec.get("refs", [])
    est, pricing = estimate_cost(len(refs))
    remaining = ks["limit_remaining"]
    spent = ledger_total()
    print(f"[guard] model={MODEL} est=${est:.4f} remaining=${remaining:.4f} ledger=${spent:.4f}")
    print(f"[prompt] ({len(prompt.split())} words) {prompt}")
    if est > MAX_COST_PER_IMAGE:
        sys.exit(f"[guard] REFUSED: estimate ${est:.4f} > cheap-model gate ${MAX_COST_PER_IMAGE}")
    if remaining - est < RESERVE_USD:
        sys.exit(f"[guard] REFUSED: would cut into the ${RESERVE_USD} reserve")
    if spent + est > SESSION_CAP_USD:
        sys.exit(f"[guard] REFUSED: session cap ${SESSION_CAP_USD} reached")
    if a.dry_run:
        return

    content = [{"type": "text", "text": prompt}]
    for r in refs:
        b64 = base64.b64encode((ROOT / r).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    body = {
        "model": MODEL,
        "messages": [{"role": "user", "content": content}],
        "modalities": ["image", "text"],
        "image_config": {"aspect_ratio": spec.get("aspect_ratio", "16:9")},
        "usage": {"include": True},
    }
    if a.seed is not None:
        body["seed"] = a.seed
    r = requests.post(f"{API}/chat/completions", json=body, timeout=300)
    if r.status_code != 200:
        sys.exit(f"[api] HTTP {r.status_code}: {r.text[:800]}")
    js = r.json()
    usage = js.get("usage", {})
    msg = js["choices"][0]["message"]
    imgs = msg.get("images") or []
    version = next_version(a.asset)
    out = None
    if imgs:
        data_url = imgs[0]["image_url"]["url"]
        out = RAW_DIR / f"{a.asset}_v{version:02d}.png"
        out.write_bytes(base64.b64decode(data_url.split(",", 1)[1]))
    entry = {
        "ts": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "asset": a.asset, "version": version if out else None, "model": MODEL,
        "file": str(out.relative_to(ROOT)) if out else None, "refs": refs, "seed": a.seed,
        "cost_usd": usage.get("cost"), "usage": usage, "generation_id": js.get("id"),
        "prompt": prompt, "text_reply": (msg.get("content") or "")[:300],
    }
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    with LEDGER.open("a") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    ks2 = key_status()
    print(f"[done] file={entry['file']} cost=${usage.get('cost')} key_usage=${ks2['usage']:.4f} remaining=${ks2['limit_remaining']:.4f}")
    if not out:
        sys.exit(f"[api] no image returned: {entry['text_reply']}")


if __name__ == "__main__":
    main()
