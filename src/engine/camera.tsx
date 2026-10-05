import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, PlateKey, plateInfo } from '../assets';
import { EASE, H, W, clamp, lerp, noise1D } from './core';

/**
 * "Living Diorama" virtual camera.
 *
 * The AI keyframe is frozen; all motion comes from this camera: focus point
 * (x/y, normalised layer coords), zoom, roll, plus a subtle 3D swing (yaw/pitch)
 * and procedural shake. Layers at different depths receive scaled versions of
 * the same move, which yields 2.5D parallax around the still image.
 */
export type CamKey = {
  f: number;
  x?: number;
  y?: number;
  zoom?: number;
  rot?: number;
  yaw?: number;
  pitch?: number;
  ease?: (t: number) => number;
};

export type CamState = { x: number; y: number; zoom: number; rot: number; yaw: number; pitch: number; sx: number; sy: number; srot: number };

export type Shake = { from: number; to: number; amp: number; freq?: number; decay?: boolean; rotAmp?: number; seed?: string };

const IDENTITY: CamState = { x: 0.5, y: 0.5, zoom: 1, rot: 0, yaw: 0, pitch: 0, sx: 0, sy: 0, srot: 0 };
const PROPS = ['x', 'y', 'zoom', 'rot', 'yaw', 'pitch'] as const;

export const sampleCam = (keys: CamKey[], f: number): CamState => {
  const filled: (CamKey & Record<(typeof PROPS)[number], number>)[] = [];
  let prev: Record<string, number> = { ...IDENTITY };
  for (const k of keys) {
    const cur = { ...prev } as Record<string, number>;
    for (const p of PROPS) if (k[p] !== undefined) cur[p] = k[p] as number;
    filled.push({ ...k, ...(cur as Record<(typeof PROPS)[number], number>) });
    prev = cur;
  }
  const pick = (k: (typeof filled)[number]): CamState => ({ ...IDENTITY, x: k.x, y: k.y, zoom: k.zoom, rot: k.rot, yaw: k.yaw, pitch: k.pitch });
  if (filled.length === 0) return IDENTITY;
  if (f <= filled[0].f) return pick(filled[0]);
  const last = filled[filled.length - 1];
  if (f >= last.f) return pick(last);
  let i = 0;
  while (i < filled.length - 2 && f >= filled[i + 1].f) i++;
  const a = filled[i];
  const b = filled[i + 1];
  const t = (b.ease ?? EASE.inOut)(clamp((f - a.f) / (b.f - a.f), 0, 1));
  const out = { ...IDENTITY };
  for (const p of PROPS) out[p] = lerp(a[p], b[p], t);
  return out;
};

const applyShake = (s: CamState, shakes: Shake[], f: number): CamState => {
  let sx = 0;
  let sy = 0;
  let srot = 0;
  shakes.forEach((sh, i) => {
    if (f < sh.from || f > sh.to) return;
    const k = sh.decay === false ? 1 : 1 - (f - sh.from) / Math.max(1, sh.to - sh.from);
    const fr = (sh.freq ?? 9) / 30;
    const seed = sh.seed ?? `shake${i}`;
    sx += sh.amp * k * noise1D(f * fr * 3, `${seed}x`);
    sy += sh.amp * k * noise1D(f * fr * 3 + 50, `${seed}y`);
    srot += (sh.rotAmp ?? 0) * k * noise1D(f * fr * 2 + 99, `${seed}r`);
  });
  return { ...s, sx, sy, srot };
};

const CameraCtx = createContext<CamState>(IDENTITY);
export const useCam = () => useContext(CameraCtx);

export const DioramaCamera: React.FC<{ keys: CamKey[]; shakes?: Shake[]; children: React.ReactNode }> = ({ keys, shakes = [], children }) => {
  const frame = useCurrentFrame();
  const state = applyShake(sampleCam(keys, frame), shakes, frame);
  return (
    <CameraCtx.Provider value={state}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>{children}</AbsoluteFill>
    </CameraCtx.Provider>
  );
};

const layerParams = (c: CamState, depth: number, clampOv?: number) => {
  const z = 1 + (c.zoom - 1) * depth;
  let fx = 0.5 + (c.x - 0.5) * depth;
  let fy = 0.5 + (c.y - 0.5) * depth;
  if (clampOv !== undefined) {
    const rot = Math.abs(Math.sin(((c.rot + c.srot) * Math.PI) / 180));
    const mx = Math.max(0, (0.5 / z) * (1 + rot * 1.3) - clampOv);
    const my = Math.max(0, (0.5 / z) * (1 + rot * 2.2) - clampOv);
    fx = clamp(fx, mx, 1 - mx);
    fy = clamp(fy, my, 1 - my);
  }
  return { z, fx, fy };
};

/** Projects a layer-space point (px) to screen space for a given depth (ignores yaw/pitch). */
export const projectPoint = (c: CamState, px: number, py: number, depth = 1, clampOv?: number) => {
  const { z, fx, fy } = layerParams(c, depth, clampOv);
  const r = ((c.rot + c.srot) * Math.PI) / 180;
  const dx = (px - fx * W) * z;
  const dy = (py - fy * H) * z;
  return {
    x: W / 2 + c.sx * depth + dx * Math.cos(r) - dy * Math.sin(r),
    y: H / 2 + c.sy * depth + dx * Math.sin(r) + dy * Math.cos(r),
    scale: z,
  };
};

export const Layer: React.FC<{ depth?: number; clampOv?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  depth = 1,
  clampOv,
  style,
  children,
}) => {
  const c = useCam();
  const { z, fx, fy } = layerParams(c, depth, clampOv);
  const transform = [
    `translate(${W / 2 + c.sx * depth}px, ${H / 2 + c.sy * depth}px)`,
    `rotate(${c.rot + c.srot}deg)`,
    `perspective(2200px) rotateY(${c.yaw * depth}deg) rotateX(${c.pitch * depth}deg)`,
    `scale(${z})`,
    `translate(${-fx * W}px, ${-fy * H}px)`,
  ].join(' ');
  return <AbsoluteFill style={{ transformOrigin: '0 0', transform, ...style }}>{children}</AbsoluteFill>;
};

/** An AI-generated diorama plate (+ optional pre-baked bloom) inside a camera layer. */
export const Plate: React.FC<{ plate: PlateKey; bloom?: number; filter?: string; overscan?: number; style?: React.CSSProperties }> = ({
  plate,
  bloom = 0,
  filter,
  overscan = PLATE_OVERSCAN,
  style,
}) => {
  const p = plateInfo(plate);
  const box: React.CSSProperties = {
    position: 'absolute',
    left: -overscan * W,
    top: -overscan * H,
    width: W * (1 + 2 * overscan),
    height: H * (1 + 2 * overscan),
    objectFit: 'cover',
  };
  return (
    <AbsoluteFill style={{ filter, ...style }}>
      <Img src={staticFile(p.file)} style={box} />
      {bloom > 0 ? <Img src={staticFile(p.bloom)} style={{ ...box, mixBlendMode: 'screen', opacity: bloom }} /> : null}
    </AbsoluteFill>
  );
};

/** Plate wrapped in its own clamped layer - the most common diorama setup. */
export const PlateLayer: React.FC<{ plate: PlateKey; bloom?: number; filter?: string; depth?: number }> = ({ plate, bloom, filter, depth = 1 }) => (
  <Layer depth={depth} clampOv={PLATE_OVERSCAN}>
    <Plate plate={plate} bloom={bloom} filter={filter} />
  </Layer>
);
