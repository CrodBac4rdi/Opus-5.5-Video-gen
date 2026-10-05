#!/usr/bin/env python3
"""Procedural sound placeholders for the EP01 opening (no external audio sources).

Every cue is synthesised with numpy/scipy (oscillators, filtered noise, simple
convolution reverb) and written to public/sfx/<NAME>.ogg (48 kHz stereo, Vorbis q6).
They are deliberately placeholders: the cue names and timings in
src/timeline/ep01_opening.ts are the contract a sound designer replaces 1:1.
"""
import pathlib
import subprocess
import wave

import numpy as np
from scipy import signal

SR = 48000
OUT = pathlib.Path(__file__).resolve().parent.parent / "public/sfx"
rng = np.random.default_rng(1337)


# ---------------------------------------------------------------- primitives
def t(dur):
    return np.arange(int(dur * SR)) / SR


def env(n, a=0.005, d=0.1, s=0.0, r=0.1, sus_t=0.0):
    a_n, d_n, s_n, r_n = int(a * SR), int(d * SR), int(sus_t * SR), int(r * SR)
    e = np.concatenate([np.linspace(0, 1, max(a_n, 1)), np.linspace(1, s, max(d_n, 1)),
                        np.full(s_n, s), np.linspace(s, 0, max(r_n, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def expdecay(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def noise(n):
    return rng.standard_normal(n)


def pink(n):
    b, a = [0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400]
    return signal.lfilter(b, a, noise(n)) * 4


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="high", fs=SR, output="sos"), x)


def sweep_lp(x, f0, f1, steps=64):
    """time-varying low-pass by block processing (cheap filter sweep)"""
    out = np.zeros_like(x)
    blocks = np.array_split(np.arange(len(x)), steps)
    zi = None
    for i, idx in enumerate(blocks):
        f = f0 * (f1 / f0) ** (i / max(steps - 1, 1))
        sos = signal.butter(2, min(f, SR / 2 - 100), btype="low", fs=SR, output="sos")
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        out[idx], zi = signal.sosfilt(sos, x[idx], zi=zi)
    return out


def osc(freq, dur, kind="sine", phase=0.0):
    n = int(dur * SR)
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,)) if np.ndim(freq) else np.full(n, float(freq))
    ph = 2 * np.pi * np.cumsum(f) / SR + phase
    if kind == "sine":
        return np.sin(ph)
    if kind == "saw":
        return 2 * ((ph / (2 * np.pi)) % 1.0) - 1
    if kind == "square":
        return np.sign(np.sin(ph))
    if kind == "tri":
        return 2 * np.abs(2 * ((ph / (2 * np.pi)) % 1.0) - 1) - 1
    raise ValueError(kind)


def bell(freq, dur, decay=0.6, ratio=3.5, index=2.0):
    tt = t(dur)
    mod = np.sin(2 * np.pi * freq * ratio * tt) * index * np.exp(-tt / (decay * 0.5))
    return np.sin(2 * np.pi * freq * tt + mod) * np.exp(-tt / decay)


def reverb(x, seconds=1.8, wet=0.3, predelay=0.01, bright=6000):
    n = int(seconds * SR)
    ir_l = lp(noise(n), bright) * expdecay(n, seconds / 5)
    ir_r = lp(noise(n), bright) * expdecay(n, seconds / 5)
    pd = np.zeros(int(predelay * SR))
    ir_l, ir_r = np.concatenate([pd, ir_l]), np.concatenate([pd, ir_r])
    ir_l /= np.sqrt(np.sum(ir_l ** 2)); ir_r /= np.sqrt(np.sum(ir_r ** 2))
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    tail = len(ir_l)
    dry = np.pad(x, ((0, tail), (0, 0)))
    wl = np.pad(signal.fftconvolve(x[:, 0], ir_l), (0, 1))[: len(dry)]
    wr = np.pad(signal.fftconvolve(x[:, 1], ir_r), (0, 1))[: len(dry)]
    return dry * (1 - wet) + np.stack([wl, wr], 1) * wet


def stereo(x, width=0.0, delay_ms=8):
    if x.ndim == 2:
        return x
    d = int(delay_ms * SR / 1000)
    r = np.concatenate([np.zeros(d), x])[: len(x)]
    return np.stack([x, x * (1 - width) + r * width], 1)


def place(buf, x, at):
    i = int(at * SR)
    x = stereo(x) if x.ndim == 1 else x
    end = min(len(buf), i + len(x))
    buf[i:end] += x[: end - i]
    return buf


def fade(x, fin=0.005, fout=0.05):
    n = len(x)
    e = np.ones(n)
    a, b = int(fin * SR), int(fout * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if b: e[-b:] = np.linspace(1, 0, b)
    return x * (e[:, None] if x.ndim == 2 else e)


def write(name, x, peak_db=-1.0):
    x = stereo(x) if x.ndim == 1 else x
    x = fade(x)
    pk = np.max(np.abs(x)) + 1e-9
    x = x / pk * 10 ** (peak_db / 20)
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = OUT / f"{name}.tmp.wav"
    with wave.open(str(tmp), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    # Ogg Vorbis q6: sample-accurate length (no MP3 priming offset), ~1/10 of WAV size
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-c:a", "libvorbis", "-q:a", "6", str(OUT / f"{name}.ogg")], check=True)
    tmp.unlink()
    print(f"{name:28s} {len(x) / SR:5.2f}s")


# ---------------------------------------------------------------- cues
def heartbeat():
    out = np.zeros((int(1.9 * SR), 2))
    def thump(amp, f0=62):
        tt = t(0.28)
        f = f0 * (1 + 0.8 * np.exp(-tt * 40))
        return osc(f, 0.28) * np.exp(-tt * 14) * amp + lp(noise(len(tt)), 180) * np.exp(-tt * 30) * 0.3 * amp
    for at, amp in [(0.0, 1.0), (0.2, 0.7), (0.95, 0.85), (1.15, 0.55)]:
        place(out, thump(amp), at)
    return reverb(out, 0.9, 0.15)


def flatline():
    tt = t(2.2)
    x = osc(988, 2.2) * 0.6 + osc(1976, 2.2) * 0.08
    x *= np.minimum(1, tt / 0.01) * np.where(tt > 1.7, np.exp(-(tt - 1.7) * 6), 1)
    return reverb(x, 1.2, 0.2)


def glitch(dur=0.55):
    n = int(dur * SR)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        ln = int(rng.uniform(0.012, 0.06) * SR)
        kind = rng.integers(0, 3)
        seg = (osc(rng.uniform(200, 3000), ln / SR, "square") if kind == 0 else
               np.round(noise(ln) * 3) / 3 if kind == 1 else np.zeros(ln))
        x[pos:pos + ln] = seg[: max(0, min(ln, n - pos))] * rng.uniform(0.3, 1)
        pos += ln
    x = np.round(x * 8) / 8
    return stereo(hp(x, 300) * 0.8, 0.6)


def riser(dur=1.4):
    tt = t(dur)
    nz = sweep_lp(noise(len(tt)), 300, 14000) * (tt / dur) ** 2
    tone = osc(200 * (8 ** (tt / dur)), dur, "saw") * (tt / dur) ** 3 * 0.25
    return stereo(nz * 0.6 + lp(tone, 6000), 0.5)


def whiteout_hit():
    tt = t(3.0)
    sub = osc(70 * np.exp(-tt * 1.8) + 28, 3.0) * np.exp(-tt * 1.6)
    nz = lp(noise(len(tt)), 2500) * np.exp(-tt * 7) * 0.6
    shimmer = sum(bell(f, 3.0, 1.4, 2.0, 0.8) for f in (1318, 1975, 2637)) * 0.07
    return reverb(sub + nz + shimmer, 2.6, 0.35)


def meadow_ambience(dur=36.0):
    n = int(dur * SR)
    tt = t(dur)
    wind_l = sweep_lp(pink(n), 400, 900, 128) * (0.6 + 0.4 * np.sin(2 * np.pi * tt / 7.3))
    wind_r = sweep_lp(pink(n), 900, 400, 128) * (0.6 + 0.4 * np.sin(2 * np.pi * tt / 5.9 + 1))
    out = np.stack([wind_l, wind_r], 1) * 0.35
    at = 0.8
    while at < dur - 1:
        ln = rng.uniform(0.06, 0.16)
        tc = t(ln)
        f0, f1 = rng.uniform(2600, 4200), rng.uniform(3200, 5200)
        chirp = osc(f0 + (f1 - f0) * (tc / ln) + 300 * np.sin(2 * np.pi * 38 * tc), ln) * np.sin(np.pi * tc / ln) ** 2
        pan = rng.uniform(0.15, 0.85)
        reps = rng.integers(1, 4)
        for k in range(reps):
            place(out, np.stack([chirp * (1 - pan), chirp * pan], 1) * 0.10, at + k * (ln + 0.05))
        at += rng.uniform(1.2, 3.5)
    return reverb(out, 1.5, 0.25)


def water_drop():
    tt = t(0.12)
    x = osc(500 + 2200 * (tt / 0.12) ** 0.6, 0.12) * np.exp(-tt * 45)
    return reverb(x, 1.2, 0.35, bright=8000)


def ui_open():
    out = np.zeros((int(1.6 * SR), 2))
    swell = sweep_lp(noise(int(0.25 * SR)), 400, 6000) * np.linspace(0, 1, int(0.25 * SR)) ** 2 * 0.25
    place(out, swell, 0.0)
    place(out, bell(1318.5, 1.2, 0.5) * 0.6, 0.22)
    place(out, bell(1975.5, 1.2, 0.5) * 0.45, 0.30)
    place(out, bell(2637.0, 1.0, 0.4) * 0.25, 0.36)
    return reverb(out, 1.6, 0.3)


def ui_typing(dur=1.2, n_ticks=16):
    out = np.zeros((int(dur * SR) + 2400, 2))
    for i in range(n_ticks):
        at = i * dur / n_ticks + rng.uniform(-0.01, 0.01)
        tick = hp(noise(240), 3000) * expdecay(240, 0.0012) + osc(rng.uniform(2200, 2600), 0.005) * expdecay(240, 0.0015)[:240] * 0.5
        place(out, tick * 0.5, max(at, 0))
    return out


def ui_warning():
    out = np.zeros((int(1.0 * SR), 2))
    for at, f in [(0.0, 740), (0.16, 554)]:
        tt = t(0.14)
        tone = lp(osc(f, 0.14, "square"), 3500) * env(len(tt), 0.003, 0.02, 0.7, 0.04, 0.07)
        place(out, tone * 0.5, at)
    return reverb(out, 0.8, 0.2)


def alarm_aggro():
    out = np.zeros((int(1.4 * SR), 2))
    for i in range(4):
        f = 233 if i % 2 == 0 else 196
        tt = t(0.22)
        x = osc(f, 0.22, "saw") + osc(f * 1.007, 0.22, "saw") + osc(f * 2, 0.22, "square") * 0.3
        x = np.tanh(lp(x, 2500) * 2.5) * env(len(tt), 0.004, 0.05, 0.8, 0.05, 0.1)
        place(out, x * 0.45, i * 0.25)
    return reverb(out, 1.0, 0.18)


def growl(dur=1.8):
    tt = t(dur)
    src = bp(noise(len(tt)), 70, 520, 3) * (0.55 + 0.45 * np.sin(2 * np.pi * 24 * tt + 2 * np.sin(2 * np.pi * 3 * tt)))
    src += osc(68 + 10 * np.sin(2 * np.pi * 2.3 * tt), dur, "saw") * 0.25
    src = np.tanh(lp(src, 900) * 3)
    return reverb(src * env(len(tt), 0.25, 0.3, 0.7, 0.5, dur - 1.05), 1.0, 0.2)


def shadow_materialize(dur=1.8):
    tt = t(dur)
    sw = sweep_lp(noise(len(tt)), 150, 3000) * (tt / dur) ** 2.5
    rev = reverb(sw, 1.4, 0.6)[: len(tt)]
    thoom_t = t(1.0)
    thoom = osc(48 * (1 + np.exp(-thoom_t * 12)), 1.0) * np.exp(-thoom_t * 4)
    out = np.zeros((len(tt) + SR, 2))
    place(out, rev * 0.8, 0)
    place(out, thoom * 0.9, dur - 0.08)
    return out


def throw_whoosh():
    tt = t(0.55)
    x = sweep_lp(bp(noise(len(tt)), 300, 7000), 800, 9000, 32) * np.sin(np.pi * np.clip(tt / 0.55, 0, 1)) ** 1.5
    l = x * np.linspace(1, 0.3, len(x)); r = x * np.linspace(0.3, 1, len(x))
    return reverb(np.stack([l, r], 1), 0.8, 0.2)


def impact_crit():
    tt = t(2.6)
    click = hp(noise(len(tt)), 2000) * np.exp(-tt * 120) * 1.2
    sub = osc(95 * np.exp(-tt * 6) + 32, 2.6) * np.exp(-tt * 3.0) * 1.3
    crack = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(3150, 30), (4720, 38), (6230, 45), (2210, 25)]) * 0.25
    body = lp(noise(len(tt)), 1200) * np.exp(-tt * 14) * 0.7
    x = np.tanh((click + sub + crack + body) * 1.4)
    return reverb(x, 2.2, 0.3)


def data_shatter(dur=3.0):
    out = np.zeros((int((dur + 0.5) * SR), 2))
    for i in range(260):
        at = dur * (rng.random() ** 1.8)
        f = rng.uniform(1800, 8500)
        ln = rng.uniform(0.02, 0.12)
        g = osc(f, ln) * np.hanning(int(ln * SR))
        pan = rng.random()
        amp = 0.18 * (1 - at / dur) ** 0.6
        place(out, np.stack([g * (1 - pan), g * pan], 1) * amp, at)
    for i in range(14):
        at = rng.uniform(0, dur * 0.6)
        ln = 0.05
        chirp = osc(np.linspace(rng.uniform(400, 900), rng.uniform(2000, 5000), int(ln * SR)), ln, "square")
        place(out, lp(chirp, 5000) * np.hanning(len(chirp)) * 0.12, at)
    return reverb(out, 2.0, 0.4, bright=9000)


def skill_unlock():
    out = np.zeros((int(3.6 * SR), 2))
    notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]
    for i, f in enumerate(notes):
        place(out, bell(f, 1.6, 0.9, 2.0, 1.2) * 0.35, i * 0.075)
    tt = t(3.0)
    chord = sum(osc(f * d, 3.0, "saw") for f in (261.63, 329.63, 392.0, 523.25) for d in (0.997, 1.003))
    chord = sweep_lp(chord, 600, 5000, 64) * env(len(tt), 0.35, 0.4, 0.6, 1.6, 0.6) * 0.07
    place(out, chord, 0.35)
    sh = hp(noise(len(tt)), 7000) * env(len(tt), 0.3, 0.5, 0.3, 1.5, 0.5) * 0.05
    place(out, sh, 0.35)
    return reverb(out, 2.4, 0.35)


def scan():
    tt = t(1.1)
    f = 900 + 700 * np.sin(2 * np.pi * 1.1 * tt)
    x = osc(f, 1.1) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * tt))) * env(len(tt), 0.02, 0.1, 0.8, 0.2, 0.75)
    return reverb(lp(x, 4000) * 0.5, 0.9, 0.25)


def braam(dur=4.0):
    tt = t(dur)
    x = sum(osc(f * d, dur, "saw") for f in (65.41, 98.0, 130.81) for d in (0.995, 1.0, 1.006))
    x = sweep_lp(x, 200, 2400, 64) * env(len(tt), 0.04, 0.6, 0.55, 2.0, 1.2)
    x = np.tanh(x * 0.6)
    sub = osc(32.7, dur) * env(len(tt), 0.02, 0.5, 0.6, 2.0, 1.2) * 0.8
    return reverb(x * 0.5 + sub, 3.0, 0.35)


def pad(chords, seg, bright=1800, detune=(0.994, 1.0, 1.006), amp=0.08):
    total = len(chords) * seg + 2.0
    out = np.zeros((int(total * SR), 2))
    for i, chord in enumerate(chords):
        dur = seg + 1.5
        tt = t(dur)
        x = sum(osc(f * d, dur, "saw", phase=rng.uniform(0, 6)) for f in chord for d in detune)
        x = lp(x, bright) * env(len(tt), 0.9, 0.3, 0.85, 1.2, dur - 2.4) * amp
        place(out, stereo(x, 0.7, 13), i * seg)
    return reverb(out, 2.8, 0.45)


def tension_pulse(dur=6.5, bpm=132):
    out = np.zeros((int((dur + 1) * SR), 2))
    step = 60 / bpm / 2
    for i in range(int(dur / step)):
        tt = t(step * 0.9)
        x = lp(osc(55, step * 0.9, "saw") + osc(55.3, step * 0.9, "saw"), 300 + 2200 * (i * step / dur) ** 2)
        x *= np.exp(-tt * 9)
        place(out, x * (0.35 + 0.4 * (i * step / dur)), i * step)
        if i % 2 == 1:
            place(out, hp(noise(1200), 6000) * expdecay(1200, 0.006) * 0.12, i * step)
    return reverb(out, 1.3, 0.2)


# ---------------------------------------------------------------- v03 cues
def forest_ambience(dur=32.0):
    n = int(dur * SR)
    tt = t(dur)
    leaves_l = bp(pink(n), 700, 3500) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 6.1) ** 2)
    leaves_r = bp(pink(n), 700, 3500) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 4.7 + 1) ** 2)
    out = np.stack([leaves_l, leaves_r], 1) * 0.12
    at = 0.5
    while at < dur - 1.5:
        # short melodic songbird phrases
        pan = rng.uniform(0.1, 0.9)
        base = rng.uniform(2200, 3600)
        for k in range(rng.integers(3, 7)):
            ln = rng.uniform(0.05, 0.11)
            tc = t(ln)
            f0 = base * rng.choice([1.0, 1.12, 1.26, 1.5])
            note = osc(f0 + 400 * np.sin(2 * np.pi * 30 * tc), ln) * np.sin(np.pi * tc / ln) ** 2
            place(out, np.stack([note * (1 - pan), note * pan], 1) * 0.08, at + k * (ln + 0.04))
        at += rng.uniform(1.5, 4.0)
    return reverb(out, 1.8, 0.3)


def rustle(dur=1.4):
    n = int(dur * SR)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        ln = int(rng.uniform(0.03, 0.12) * SR)
        seg = bp(noise(ln), 1800, 7000) * np.hanning(ln) * rng.uniform(0.3, 1)
        x[pos:pos + ln] += seg[: max(0, min(ln, n - pos))]
        pos += int(ln * rng.uniform(0.4, 1.1))
    return reverb(stereo(x * env(n, 0.05, 0.2, 0.8, 0.4, dur - 0.65), 0.6), 0.8, 0.2)


def weasel_squeak():
    out = np.zeros((int(0.9 * SR), 2))
    for at, f0 in [(0.0, 1900), (0.22, 2300)]:
        tt = t(0.14)
        x = osc(f0 + 700 * (tt / 0.14) + 120 * np.sin(2 * np.pi * 40 * tt), 0.14) * np.sin(np.pi * tt / 0.14) ** 1.5
        place(out, x * 0.5, at)
    return reverb(out, 0.7, 0.2)


def player_hit():
    tt = t(1.4)
    thump = osc(80 * np.exp(-tt * 8) + 40, 1.4) * np.exp(-tt * 7)
    rip = hp(noise(len(tt)), 2500) * np.exp(-tt * 18) * 0.6
    ring = osc(1800, 1.4) * np.exp(-tt * 3) * 0.06 + osc(2400, 1.4) * np.exp(-tt * 3.5) * 0.04
    return reverb(np.tanh((thump + rip + ring) * 1.4), 1.2, 0.25)


def grab():
    tt = t(0.45)
    scrape = bp(noise(len(tt)), 400, 3000) * np.exp(-tt * 9)
    click = hp(noise(len(tt)), 3000) * np.exp(-tt * 80)
    return reverb(scrape * 0.7 + click * 0.5, 0.5, 0.15)


def scream_sting():
    tt = t(2.4)
    cluster = sum(osc(f * d, 2.4, "saw") for f in (311.13, 329.63, 466.16, 493.88) for d in (0.996, 1.004))
    x = sweep_lp(cluster, 3000, 600, 48) * env(len(tt), 0.01, 0.3, 0.4, 1.4, 0.6) * 0.12
    swell = sweep_lp(noise(len(tt)), 200, 5000) * np.linspace(1, 0, len(tt)) ** 3 * 0.15
    return reverb(stereo(x + swell, 0.7, 11), 2.0, 0.35)


def goblin_cackle(dur=1.5):
    tt = t(dur)
    f0 = 210 + 40 * np.sin(2 * np.pi * 0.7 * tt) + 25 * np.sign(np.sin(2 * np.pi * 6 * tt))
    src = osc(f0, dur, "saw")
    voice = bp(src, 500, 900) * 1.0 + bp(src, 1100, 1500) * 0.6 + bp(src, 2300, 2900) * 0.25
    gate = np.clip(np.sin(2 * np.pi * 6.2 * tt), 0, 1) ** 0.6
    x = np.tanh(voice * gate * 3) * env(len(tt), 0.02, 0.2, 0.9, 0.3, dur - 0.55)
    return reverb(stereo(x * 0.6, 0.4), 0.9, 0.2)


def choice_open():
    out = np.zeros((int(2.0 * SR), 2))
    place(out, sweep_lp(noise(int(0.3 * SR)), 300, 5000) * np.linspace(0, 1, int(0.3 * SR)) ** 2 * 0.2, 0.0)
    for at, f, a in [(0.25, 659.25, 0.5), (0.33, 987.77, 0.4), (0.41, 1318.5, 0.3)]:
        place(out, bell(f, 1.5, 0.8, 2.0, 1.0) * a, at)
    return reverb(out, 1.8, 0.3)


def choice_select():
    out = np.zeros((int(1.2 * SR), 2))
    place(out, hp(noise(400), 2500) * expdecay(400, 0.002) * 0.6, 0.0)
    place(out, bell(1567.98, 1.0, 0.6, 2.0, 1.2) * 0.5, 0.01)
    place(out, bell(2093.0, 1.0, 0.5, 2.0, 1.0) * 0.35, 0.06)
    return reverb(out, 1.2, 0.25)


def bonk():
    tt = t(0.6)
    x = osc(320 * np.exp(-tt * 10) + 160, 0.6) * np.exp(-tt * 14) + hp(noise(len(tt)), 1500) * np.exp(-tt * 70) * 0.8
    return reverb(x, 0.6, 0.15)


def spear_thrust():
    tt = t(1.1)
    whoosh = sweep_lp(bp(noise(len(tt)), 500, 8000), 1200, 9000, 32) * np.sin(np.pi * np.clip(tt / 0.35, 0, 1)) * (tt < 0.35)
    shing = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(3520, 4), (5280, 5), (7040, 6)]) * 0.12 * (tt > 0.18)
    return reverb(stereo(whoosh * 0.7 + shing, 0.5), 1.0, 0.25)


def club_whoosh():
    tt = t(0.9)
    x = sweep_lp(bp(noise(len(tt)), 80, 2000), 300, 2500, 32) * np.sin(np.pi * np.clip(tt / 0.7, 0, 1)) ** 1.2
    l = x * np.linspace(0.3, 1, len(x)); r = x * np.linspace(1, 0.3, len(x))
    return reverb(np.stack([l, r], 1), 0.8, 0.2)


def levelup():
    out = np.zeros((int(4.0 * SR), 2))
    for i, f in enumerate([261.63, 329.63, 392.0, 523.25]):
        tt = t(0.5 if i < 3 else 2.4)
        stab = sum(osc(f * d, len(tt) / SR, "saw") for d in (0.995, 1.0, 1.005))
        stab = lp(stab, 3500) * env(len(tt), 0.01, 0.15, 0.6, 0.3 if i < 3 else 1.6, 0.05 if i < 3 else 0.5) * 0.12
        place(out, stereo(stab, 0.6, 9), i * 0.14)
    for i, f in enumerate([1046.5, 1318.5, 1567.98, 2093.0]):
        place(out, bell(f, 1.6, 0.9, 2.0, 1.0) * 0.18, 0.42 + i * 0.06)
    sh = hp(noise(int(2.5 * SR)), 7000) * env(int(2.5 * SR), 0.2, 0.5, 0.3, 1.5, 0.3) * 0.05
    place(out, sh, 0.42)
    return reverb(out, 2.2, 0.3)


def quest_chime():
    out = np.zeros((int(2.2 * SR), 2))
    for at, f in [(0.0, 783.99), (0.12, 1174.66), (0.24, 1567.98)]:
        place(out, bell(f, 1.6, 0.9, 3.0, 0.8) * 0.4, at)
    return reverb(out, 2.0, 0.35)


def wolf_howl():
    tt = t(3.4)
    f = 300 + 230 * np.sin(np.pi * np.clip(tt / 1.2, 0, 1) * 0.5) - 80 * np.clip((tt - 1.8) / 1.6, 0, 1)
    f = f + 6 * np.sin(2 * np.pi * 5.5 * tt)
    src = osc(f, 3.4) + 0.3 * osc(2 * f, 3.4) + 0.08 * noise(len(tt))
    x = bp(src, 250, 1400) * env(len(tt), 0.35, 0.4, 0.8, 1.2, 1.4)
    x = lp(x, 2200)
    return reverb(stereo(x * 0.5, 0.5, 17), 3.5, 0.6, predelay=0.04, bright=4000)


def plucks(notes, step, dur, amp=0.25):
    out = np.zeros((int((dur + 2) * SR), 2))
    for i in range(int(dur / step)):
        f = notes[i % len(notes)]
        place(out, bell(f, 0.9, 0.35, 1.0, 0.6) * amp * (0.8 + 0.2 * rng.random()), i * step)
    return out


def curious_pad():
    seq = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880.0, 783.99]
    p = plucks(seq, 0.3, 12.0, 0.18)
    bed = pad([(261.63, 329.63, 392.0), (293.66, 369.99, 440.0), (261.63, 329.63, 392.0), (246.94, 329.63, 392.0)], 3.0, bright=1600, amp=0.04)
    n = max(len(p), len(bed))
    return np.pad(p, ((0, n - len(p)), (0, 0))) + np.pad(bed, ((0, n - len(bed)), (0, 0)))


def mystery_pad():
    tt = t(16.0)
    drone = (osc(55.0, 16.0, "saw") + osc(55.3, 16.0, "saw")) * 0.05
    drone = sweep_lp(drone, 200, 900, 64)
    cl = pad([(220.0, 233.08, 329.63), (207.65, 220.0, 311.13), (220.0, 233.08, 349.23), (196.0, 207.65, 293.66)], 3.8, bright=1200, amp=0.06)
    n = max(len(cl), len(tt))
    return np.pad(stereo(drone, 0.6), ((0, n - len(tt)), (0, 0))) + np.pad(cl, ((0, n - len(cl)), (0, 0)))


def battle_drums(dur=30.0, bpm=138):
    out = np.zeros((int((dur + 2) * SR), 2))
    beat = 60 / bpm
    pattern = [1, 0, 0.6, 0, 1, 0.5, 0.7, 0]
    for i in range(int(dur / (beat / 2))):
        a = pattern[i % len(pattern)]
        at = i * beat / 2
        if a:
            tt = t(0.5)
            taiko = osc(70 * np.exp(-tt * 9) + 45, 0.5) * np.exp(-tt * 9) + lp(noise(len(tt)), 900) * np.exp(-tt * 25) * 0.4
            place(out, taiko * a * 0.6, at)
        if i % 4 == 2:
            place(out, hp(noise(1500), 5000) * expdecay(1500, 0.01) * 0.12, at)
    ost = tension_pulse(dur, bpm)
    n = min(len(out), len(ost))
    out[:n] += ost[:n] * 0.5
    return reverb(out, 1.4, 0.2)


def adventure_pad():
    bed = pad([(261.63, 329.63, 392.0, 523.25), (196.0, 246.94, 293.66, 392.0), (220.0, 261.63, 329.63, 440.0), (174.61, 220.0, 261.63, 349.23),
               (261.63, 329.63, 392.0, 523.25)], 3.6, bright=2600, amp=0.06)
    arp = plucks([523.25, 659.25, 783.99, 1046.5, 783.99, 659.25], 0.25, 17.0, 0.1)
    n = max(len(bed), len(arp))
    return np.pad(bed, ((0, n - len(bed)), (0, 0))) + np.pad(arp, ((0, n - len(arp)), (0, 0)))


def main():
    write("sfx_heartbeat", heartbeat())
    write("sfx_flatline", flatline(), -6)
    write("sfx_glitch", glitch())
    write("sfx_riser_whiteout", riser())
    write("sfx_whiteout_hit", whiteout_hit())
    write("amb_meadow_wind", meadow_ambience(), -6)
    write("sfx_water_drop", water_drop(), -3)
    write("sfx_ui_open", ui_open(), -2)
    write("sfx_ui_typing", ui_typing(), -8)
    write("sfx_ui_warning", ui_warning(), -4)
    write("sfx_alarm_aggro", alarm_aggro(), -3)
    write("sfx_growl", growl(), -2)
    write("sfx_shadow_materialize", shadow_materialize(), -2)
    write("sfx_throw_whoosh", throw_whoosh(), -2)
    write("sfx_impact_crit", impact_crit(), -0.5)
    write("sfx_data_shatter", data_shatter(), -3)
    write("sfx_skill_unlock", skill_unlock(), -2)
    write("sfx_scan", scan(), -5)
    write("sfx_braam_title", braam(), -1)
    awakening = [(220.0, 261.63, 329.63, 493.88), (174.61, 220.0, 261.63, 392.0), (196.0, 246.94, 293.66, 440.0), (220.0, 261.63, 329.63, 493.88)]
    write("mus_pad_awakening", pad(awakening * 4, 3.3), -6)
    write("mus_tension_pulse", tension_pulse(16.0), -4)
    write("mus_triumph_pad", pad([(130.81, 196.0, 261.63, 329.63, 392.0), (174.61, 220.0, 261.63, 349.23, 440.0),
                                  (196.0, 246.94, 293.66, 392.0, 493.88)], 2.6, bright=3200, amp=0.07), -5)
    # v03 cues
    write("amb_forest", forest_ambience(), -7)
    write("sfx_rustle", rustle(), -4)
    write("sfx_weasel_squeak", weasel_squeak(), -4)
    write("sfx_player_hit", player_hit(), -1)
    write("sfx_grab", grab(), -4)
    write("sfx_scream_sting", scream_sting(), -3)
    write("sfx_goblin_cackle", goblin_cackle(), -3)
    write("sfx_choice_open", choice_open(), -2)
    write("sfx_choice_select", choice_select(), -2)
    write("sfx_bonk", bonk(), -2)
    write("sfx_spear_thrust", spear_thrust(), -2)
    write("sfx_club_whoosh", club_whoosh(), -2)
    write("sfx_levelup", levelup(), -2)
    write("sfx_quest", quest_chime(), -3)
    write("sfx_wolf_howl", wolf_howl(), -3)
    write("mus_curious_pad", curious_pad(), -6)
    write("mus_mystery_pad", mystery_pad(), -5)
    write("mus_battle_drums", battle_drums(), -3)
    write("mus_adventure_pad", adventure_pad(), -5)


if __name__ == "__main__":
    main()
