import { Easing, interpolate, random } from 'remotion';

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const EASE = {
  inOut: Easing.bezier(0.45, 0, 0.2, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.6, 0, 0.9, 0.4),
  snap: Easing.bezier(0.08, 0.9, 0.2, 1),
  linear: (t: number) => t,
};

/** 0..1 ramp between frames a and b (clamped). */
export const ramp = (f: number, a: number, b: number, ease: (t: number) => number = EASE.linear) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

/** fade in over [a, a+inLen], hold, fade out over [b-outLen, b]. */
export const window01 = (f: number, a: number, b: number, inLen = 6, outLen = 6) =>
  Math.min(ramp(f, a, a + inLen), 1 - ramp(f, b - outLen, b));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** deterministic value in [a, b) */
export const rr = (seed: string | number, a = 0, b = 1) => a + (b - a) * random(seed);

/** smooth deterministic 1D value noise in [-1, 1] */
export const noise1D = (x: number, seed: string) => {
  const i = Math.floor(x);
  const f = x - i;
  const s = f * f * (3 - 2 * f);
  return lerp(random(`${seed}:${i}`), random(`${seed}:${i + 1}`), s) * 2 - 1;
};

/** "animate on twos": holds every value for n frames, the anime way */
export const onTwos = (frame: number, n = 2) => Math.floor(frame / n) * n;

/** blink helper for warning UIs */
export const blink = (frame: number, period = 16, duty = 0.55) => (frame % period) / period < duty;
