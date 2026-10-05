import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, PlateKey, SPRITES, SpriteKey, spriteInfo } from '../assets';
import { CamKey, DioramaCamera, Layer, Plate, Shake, projectPoint, sampleCam, useCam } from '../engine/camera';
import { EASE, H, W, lerp, ramp } from '../engine/core';
import { DataDissolve } from '../fx/DataDissolve';
import { Burst, SpeedLines } from '../fx/particles';
import { Flash, Glow, GroundCracks, Post, Shockwave, impactFilter } from '../fx/overlays';
import { FloatText, HUD, StatBar, SystemWindow, Tag } from '../hud/hud';

export type Rect = { x: number; y: number; w: number; h: number };
export type UV = { u: number; v: number };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Visual position of a sprite UV point, honouring a horizontal flip. */
export const spritePoint = (r: Rect, p: UV, flip = false) => ({ x: r.x + (flip ? 1 - p.u : p.u) * r.w, y: r.y + p.v * r.h });

/** Keyed sprite as <Img>, optionally mirrored, with a white hit-flash. */
export const SpriteImg: React.FC<{ sprite: SpriteKey; rect: Rect; flip?: boolean; opacity?: number; filter?: string; hitAt?: number; shadow?: boolean }> = ({
  sprite,
  rect,
  flip,
  opacity = 1,
  filter = '',
  hitAt,
  shadow = true,
}) => {
  const f = useCurrentFrame();
  const flash = hitAt !== undefined && f >= hitAt && f < hitAt + 6 ? `brightness(${3 - (f - hitAt) * 0.35}) saturate(0)` : '';
  return (
    <>
      {shadow ? (
        <div
          style={{
            position: 'absolute',
            left: rect.x + rect.w * 0.1,
            top: rect.y + rect.h * 0.9,
            width: rect.w * 0.8,
            height: rect.h * 0.14,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(10,6,0,0.6), rgba(0,0,0,0) 70%)',
            opacity,
          }}
        />
      ) : null}
      <Img
        src={staticFile(spriteInfo(sprite).file)}
        style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, opacity, transform: flip ? 'scaleX(-1)' : undefined, filter: `${filter} ${flash}`.trim() || undefined }}
      />
    </>
  );
};

/** Cel-shaded stone drawn in code: flies from (sx,sy) into the target, arriving at `hit`. */
export const Stone: React.FC<{ tx: number; ty: number; hit: number; from?: [number, number]; startScale?: number; endScale?: number; dur?: number }> = ({
  tx,
  ty,
  hit,
  from = [-180, 980],
  startScale = 3.2,
  endScale = 0.55,
  dur = 14,
}) => {
  const f = useCurrentFrame();
  if (f > hit || f < hit - dur) return null;
  const t = EASE.in(ramp(f, hit - dur, hit));
  const pos = (k: number) => ({ x: lerp(from[0], tx, k), y: lerp(from[1], ty, k) + Math.sin(k * Math.PI) * -120, s: lerp(startScale, endScale, k) });
  const head = pos(t);
  const tail = pos(Math.max(0, t - 0.45));
  const tl = Math.hypot(head.x - tail.x, head.y - tail.y) || 1;
  const nx = -(head.y - tail.y) / tl;
  const ny = (head.x - tail.x) / tl;
  const hw = 26 * head.s;
  const draw = (k: number, o: number, key: string) => {
    const p = pos(clamp01(k));
    return (
      <g key={key} transform={`translate(${p.x} ${p.y}) scale(${p.s}) rotate(${k * 540})`} opacity={o}>
        <path d="M-34,-8 L-18,-30 L14,-34 L36,-12 L30,20 L4,34 L-26,26 Z" fill="#6f6a72" stroke="#16121a" strokeWidth={5} strokeLinejoin="round" />
        <path d="M-34,-8 L-18,-30 L14,-34 L4,-6 L-20,6 Z" fill="#9b96a0" />
        <path d="M4,34 L30,20 L36,-12 L18,8 Z" fill="#4a4550" />
      </g>
    );
  };
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      {[0.16, 0.1, 0.05].map((g, i) => draw(t - g, 0.25 - i * 0.06, `g${i}`))}
      <defs>
        <linearGradient id={`trail${hit}`} gradientUnits="userSpaceOnUse" x1={tail.x} y1={tail.y} x2={head.x} y2={head.y}>
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,250,235,0.85)" />
        </linearGradient>
      </defs>
      <polygon points={`${tail.x},${tail.y} ${head.x + nx * hw},${head.y + ny * hw} ${head.x - nx * hw},${head.y - ny * hw}`} fill={`url(#trail${hit})`} />
      {draw(t, 1, 'stone')}
    </svg>
  );
};

/** Code-drawn spear thrust from the left edge into the target (cyan energy trail). */
export const SpearThrust: React.FC<{ tx: number; ty: number; hit: number; dur?: number; angle?: number }> = ({ tx, ty, hit, dur = 7, angle = -6 }) => {
  const f = useCurrentFrame();
  if (f < hit - dur || f > hit + 10) return null;
  const t = f <= hit ? EASE.in(ramp(f, hit - dur, hit)) : 1 - ramp(f, hit + 3, hit + 10, EASE.in) * 0.35;
  const a = (angle * Math.PI) / 180;
  const len = 1600;
  const tipX = lerp(-200, tx, t);
  const tipY = lerp(ty - Math.sin(a) * (tx + 200), ty, t);
  const bx = tipX - Math.cos(a) * len;
  const by = tipY - Math.sin(a) * len;
  const o = f > hit + 6 ? 1 - ramp(f, hit + 6, hit + 10) : 1;
  const deg = angle;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
      <defs>
        <linearGradient id={`thr${hit}`} gradientUnits="userSpaceOnUse" x1={bx} y1={by} x2={tipX} y2={tipY}>
          <stop offset="0%" stopColor="rgba(94,242,255,0)" />
          <stop offset="100%" stopColor="rgba(190,255,255,0.9)" />
        </linearGradient>
      </defs>
      <line x1={bx} y1={by} x2={tipX} y2={tipY} stroke={`url(#thr${hit})`} strokeWidth={46} strokeLinecap="round" opacity={0.55} />
      <line x1={bx} y1={by} x2={tipX - Math.cos(a) * 60} y2={tipY - Math.sin(a) * 60} stroke="#5a3a1e" strokeWidth={14} />
      <line x1={bx} y1={by - 4} x2={tipX - Math.cos(a) * 60} y2={tipY - Math.sin(a) * 60 - 4} stroke="#8a6238" strokeWidth={4} />
      <g transform={`translate(${tipX} ${tipY}) rotate(${deg})`}>
        <path d="M0,0 L-70,-16 L-62,0 L-70,16 Z" fill="#d8dee6" stroke="#1d2228" strokeWidth={4} strokeLinejoin="round" />
        <path d="M0,0 L-70,-16 L-62,0 Z" fill="#ffffff" />
      </g>
    </svg>
  );
};

/** Screen-space hit: shockwave, flash glow, sparks and shards. */
export const ImpactBurst: React.FC<{ x: number; y: number; at: number; seed: string; shardColors?: string[]; scale?: number }> = ({
  x,
  y,
  at,
  seed,
  shardColors = ['#d6a6ff', '#a56bff', '#f2e3ff'],
  scale = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <>
      <Shockwave x={x} y={y} at={at} color="#e8fdff" rings={3} maxR={900 * scale} squash={0.8} />
      <Glow x={x} y={y} r={420 * scale * (1 - ramp(f, at, at + 16))} color="rgba(255,255,240,1)" opacity={f >= at ? 1 : 0} />
      <Burst seed={`${seed}spark`} at={at} x={x} y={y} count={Math.round(90 * scale)} kind="spark" colors={['#ffffff', '#fff2b0', '#9ff6ff']} speed={[900 * scale, 2600 * scale]} gravity={1400} drag={2.4} life={[0.25, 0.7]} size={[2, 5]} />
      <Burst seed={`${seed}shard`} at={at} x={x} y={y} count={Math.round(28 * scale)} kind="shard" colors={shardColors} speed={[500 * scale, 1500 * scale]} gravity={1800} drag={1.6} life={[0.5, 1.1]} size={[12, 26]} />
    </>
  );
};

/** Ground reaction at the feet - the doctrine's "consequence of force". */
export const GroundReaction: React.FC<{ x: number; y: number; at: number; seed: string; length?: number; dust?: string[]; debris?: string[] }> = ({
  x,
  y,
  at,
  seed,
  length = 300,
  dust = ['rgba(150,110,70,0.8)', 'rgba(120,90,60,0.75)', 'rgba(200,170,130,0.6)'],
  debris = ['#2f7a2a', '#4c9a35', '#1f5a1d'],
}) => (
  <>
    <GroundCracks x={x} y={y} at={at} length={length} squash={0.3} width={5} seed={`${seed}crk`} />
    <Burst seed={`${seed}dust`} at={at} x={x} y={y} count={34} kind="dust" colors={dust} speed={[120, 520]} angle={[-90, 170]} gravity={140} drag={2.2} life={[0.8, 1.6]} size={[18, 46]} />
    <Burst seed={`${seed}rock`} at={at} x={x} y={y - 10} count={22} kind="shard" colors={['#6b5a48', '#8a7660', '#4d3f31']} speed={[250, 750]} angle={[-90, 120]} gravity={1500} drag={1.0} life={[0.5, 1.0]} size={[5, 12]} />
    <Burst seed={`${seed}bits`} at={at} x={x} y={y} count={30} kind="debris" colors={debris} speed={[200, 700]} angle={[-90, 150]} gravity={900} drag={1.2} life={[0.6, 1.2]} size={[6, 14]} />
  </>
);

/**
 * A complete "strike on the weak point -> data dissolve" shot, shared by every
 * fight (weasel, goblins). Everything is configured; nothing is hard-coded.
 */
export type StrikeConfig = {
  plate: PlateKey;
  sprite: SpriteKey;
  rect: Rect;
  flip?: boolean;
  weakPoint: UV;
  camKeys: CamKey[];
  hit: number;
  projectile: 'stone' | 'spear';
  dissolve: { start: number; duration: number; palette?: string[] };
  feet: { x: number; y: number };
  crack?: number;
  name: string;
  hpMax: number;
  damage: string;
  defeat?: { at: number; closeAt: number; title: string; line: string; reward: string };
  others?: { sprite: SpriteKey; rect: Rect; flip?: boolean }[];
  shardColors?: string[];
  wash?: string;
  debris?: string[];
};

const StrikeHUD: React.FC<{ c: StrikeConfig }> = ({ c }) => {
  const cam = useCam();
  const f = useCurrentFrame();
  const wp = spritePoint(c.rect, c.weakPoint, c.flip);
  const pc = projectPoint(cam, wp.x, wp.y, 1, PLATE_OVERSCAN);
  const top = projectPoint(cam, c.rect.x + c.rect.w * 0.5, c.rect.y - 10, 1, PLATE_OVERSCAN);
  return (
    <>
      <div style={{ position: 'absolute', left: top.x - 200, top: top.y - 90, opacity: 1 - ramp(f, c.hit + 34, c.hit + 44) }}>
        <div style={{ fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700, fontSize: 24, letterSpacing: 4, color: '#fff', textShadow: '0 2px 4px #000', marginBottom: 6 }}>{c.name}</div>
        <StatBar label="HP" value={0} from={1} at={c.hit + 1} len={8} color={HUD.warn} rgb={HUD.warnRGB} width={300} suffix={`0/${c.hpMax}`} />
      </div>
      <FloatText text="KRITISCHER TREFFER!" x={pc.x + 150} y={pc.y - 250} at={c.hit + 1} color={HUD.gold} size={50} rise={50} dur={56} />
      <FloatText text={c.damage} x={pc.x + 230} y={pc.y - 60} at={c.hit + 2} color="#ffffff" size={84} rise={60} dur={48} />
      {c.defeat ? (
        <SystemWindow x={110} y={110} w={620} at={c.defeat.at} closeAt={c.defeat.closeAt} title={c.defeat.title}>
          <div style={{ fontSize: 36, fontWeight: 600 }}>{c.defeat.line}</div>
          <div style={{ display: 'flex', gap: 30, marginTop: 10, fontSize: 28, fontWeight: 600 }}>
            <span style={{ color: HUD.gold, textShadow: `0 0 10px ${HUD.gold}` }}>{c.defeat.reward}</span>
            <span style={{ color: HUD.sys }}>Daten absorbiert</span>
          </div>
        </SystemWindow>
      ) : null}
    </>
  );
};

const StrikeFX: React.FC<{ c: StrikeConfig }> = ({ c }) => {
  const f = useCurrentFrame();
  const wp = spritePoint(c.rect, c.weakPoint, c.flip);
  // un-shaken camera: impact origin stays locked to the world point
  const cam = { ...sampleCam(c.camKeys, f), sx: 0, sy: 0, srot: 0 };
  const pc = projectPoint(cam, wp.x, wp.y, 1, PLATE_OVERSCAN);
  const hitCam = { ...sampleCam(c.camKeys, c.hit), sx: 0, sy: 0, srot: 0 };
  const ph = projectPoint(hitCam, wp.x, wp.y, 1, PLATE_OVERSCAN);
  return (
    <>
      {c.projectile === 'stone' ? <Stone tx={ph.x} ty={ph.y} hit={c.hit} /> : <SpearThrust tx={ph.x} ty={ph.y} hit={c.hit} />}
      {f < c.hit ? <SpeedLines seed={`sl${c.sprite}`} cx={ph.x} cy={ph.y} mode="horizontal" count={70} opacity={0.55} /> : null}
      <ImpactBurst x={pc.x} y={pc.y} at={c.hit} seed={c.sprite} shardColors={c.shardColors} />
    </>
  );
};

export const StrikeShot: React.FC<{ c: StrikeConfig }> = ({ c }) => {
  const f = useCurrentFrame();
  const s = spriteInfo(c.sprite);
  const tensionOut = ramp(f, c.hit, c.hit + 4);
  const shakes: Shake[] = [{ from: c.hit, to: c.hit + 30, amp: 34, freq: 20, rotAmp: 1.4, seed: `hit${c.sprite}` }];
  const cx = c.rect.x + c.rect.w / 2;
  return (
    <AbsoluteFill style={{ background: '#000', filter: impactFilter(f, [c.hit]) }}>
      <DioramaCamera keys={c.camKeys} shakes={shakes}>
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate={c.plate} bloom={0.25} filter={`blur(1.2px) brightness(${0.84 + 0.16 * tensionOut}) saturate(${0.88 + 0.12 * tensionOut})`} />
          <GroundReaction x={c.feet.x} y={c.feet.y} at={c.hit} seed={c.sprite} length={c.crack ?? 300} debris={c.debris} />
          {(c.others ?? []).map((o, i) => (
            <SpriteImg key={i} sprite={o.sprite} rect={o.rect} flip={o.flip} />
          ))}
          <AbsoluteFill style={c.flip ? { transformOrigin: `${cx}px 0px`, transform: 'scaleX(-1)' } : undefined}>
            <DataDissolve
              src={s.file}
              rect={c.rect}
              start={c.dissolve.start}
              duration={c.dissolve.duration}
              origin={c.weakPoint}
              cell={5}
              palette={c.dissolve.palette ?? ['#5ef2ff', '#8ff7ff', '#b57bff', '#d9fbff']}
              resolution={2.4}
              hitFlash={{ at: c.hit, len: 8 }}
              seed={SPRITES[c.sprite]}
              life={[0.9, 2.4]}
            />
          </AbsoluteFill>
        </Layer>
        <StrikeHUD c={c} />
      </DioramaCamera>
      <StrikeFX c={c} />
      <Flash at={c.hit + 2} hold={0} outLen={9} max={0.85} />
      <Post vignette={0.5} grain={0.07} wash={c.wash ?? 'linear-gradient(180deg, #2a3e6a, #120a1c)'} washOpacity={0.22} />
    </AbsoluteFill>
  );
};

/** Little helper used by several shots: a pulsing [TAG] anchored to a projected world point. */
export const AnchoredTag: React.FC<{ x: number; y: number; at: number; text: string; color?: string; rgb?: string; size?: number }> = ({ x, y, at, text, color, rgb, size = 26 }) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    <Tag text={text} at={at} color={color} rgb={rgb} size={size} />
  </div>
);
