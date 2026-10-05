#!/usr/bin/env python3
"""Exports the Scene Matrix (Markdown) from the single source of truth:
src/timeline/ep01_opening.shots.json + production/prompts/ep01_opening.json.

    python3 tools/export_matrix.py  ->  docs/SCENE_MATRIX_EP01_opening.md
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SHOTS = json.loads((ROOT / "src/timeline/ep01_opening.shots.json").read_text())
LIB = json.loads((ROOT / "production/prompts/ep01_opening.json").read_text())
OUT = ROOT / "docs/SCENE_MATRIX_EP01_opening.md"


def tc(frame, fps):
    s = frame / fps
    return f"{int(s // 60):02d}:{s % 60:05.2f}"


def full_prompt(asset_id):
    blocks = LIB["blocks"]
    spec = LIB["assets"].get(asset_id)
    if not spec:
        return None

    def look(path):
        cur = blocks
        for k in path.split("."):
            cur = cur[k]
        return cur

    res = lambda v: re.sub(r"@([\w.]+)", lambda m: look(m.group(1)), v)
    order = ["identity", "core_traits", "clothing", "pose", "camera", "background"]
    labels = {"identity": "Identität", "core_traits": "Kernmerkmale", "clothing": "Kleidung", "pose": "Pose", "camera": "Kamera", "background": "Hintergrund"}
    return [(labels[k], res(spec[k])) for k in order if spec.get(k)]


def cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def main():
    fps = SHOTS["fps"]
    lines = [
        f"# Scene Matrix – {SHOTS['episode']} {SHOTS['title']}",
        "",
        "> Generated from `src/timeline/ep01_opening.shots.json` by `tools/export_matrix.py` – do not edit by hand.",
        f"> {SHOTS['width']}×{SHOTS['height']} @ {fps} fps · total {tc(max(s['from'] + s['dur'] for s in SHOTS['shots']), fps)}",
        "",
        "| Szene | Shot-ID | Zeit | Story-Zweck | Charakter | Ort | Kamerabewegung | Licht | Audio | Prompt | Benötigte Assets | Status |",
        "|---|---|---|---|---|---|---|---|---|---|---|---|",
    ]
    for s in SHOTS["shots"]:
        t = f"{tc(s['from'], fps)}–{tc(s['from'] + s['dur'], fps)}"
        lines.append("| " + " | ".join(cell(x) for x in [s["scene"], f"`{s['id']}`", t, s["purpose"], s["character"], s["location"], s["camera"], s["light"], s["audio"], s["prompt"], "<br>".join(s["assets"]), s["status"]]) + " |")

    lines += ["", "## Image prompts (Identität + Kernmerkmale + Kleidung + Pose + Kamera + Hintergrund)", ""]
    for asset in LIB["assets"]:
        parts = full_prompt(asset)
        lines.append(f"### `{asset}`")
        if LIB["assets"][asset].get("refs"):
            lines.append(f"*Reference image:* `{LIB['assets'][asset]['refs'][0]}`  ")
        for label, text in parts:
            lines.append(f"- **{label}:** {text}")
        lines.append(f"- **Stil (konstant):** {LIB['blocks']['style']['anime']}")
        lines.append("")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines) + "\n")
    print("wrote", OUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
