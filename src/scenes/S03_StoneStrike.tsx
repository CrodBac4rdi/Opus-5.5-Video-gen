import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, SPRITES, WEASEL_POINTS, plateToLayer, spriteInfo } from '../assets';
import { CamKey, DioramaCamera, Layer, Plate, Shake, projectPoint, sampleCam, useCam } from '../engine/camera';
import { EASE, H, W, lerp, ramp } from '../engine/core';
import { DataDissolve } from '../fx/DataDissolve';
import { Burst, ParticleField, SpeedLines } from '../fx/particles';
import { Flash, Glow, GroundCracks, LightRays, Post, Shockwave, impactFilter } from '../fx/overlays';
import { FloatText, HUD, StatBar, SystemWindow } from '../hud/hud';
import { weaselPoint, weaselWorldRect } from './weasel';

/* ------------------------------------------------ SH01: the frozen throw */
const ThrowFX: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const hand = plateToLayer('throw', 965, 205);
  const stone = plateToLayer('throw', 1120, 213);
  const ph = projectPoint(cam, hand.x, hand.y, 1, PLATE_OVERSCAN);
  const ps = projectPoint(cam, stone.x, stone.y, 1, PLATE_OVERSCAN);
  const glint = ramp(f, 16, 22) * (1 - ramp(f, 24, 40));
  return (
    <>
      <SpeedLines seed="s03focus" cx={ph.x} cy={ph.y} count={120} inner={0.3} opacity={0.55 * (1 - ramp(f, 30, 54))} />
      <Glow x={ps.x} y={ps.y} r={140 * (0.6 + glint)} color="rgba(255,250,220,1)" opacity={0.5 + glint} />
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: glint }}>
        <g transform={`translate(${ps.x} ${ps.y}) rotate(${f * 4})`}>
          <path d="M0,-90 L10,-10 L90,0 L10,10 L0,90 L-10,10 L-90,0 L-10,-10 Z" fill="#fffbe8" />
        </g>
      </svg>
    </>
  );
};

export const S03SH01Throw: React.FC = () => {
  const sun = plateToLayer('throw', 515, 280);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.5, y: 0.5, zoom: 1.04, rot: 2.5 },
          { f: 12, x: 0.55, y: 0.45, zoom: 1.17, rot: -2, ease: EASE.snap },
          { f: 54, x: 0.58, y: 0.43, zoom: 1.22, rot: -3, ease: EASE.linear },
        ]}
        shakes={[{ from: 0, to: 16, amp: 16, freq: 18, rotAmp: 0.8 }]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="throw" bloom={0.45} />
          <LightRays x={sun.x} y={sun.y} opacity={0.5} seed="s03trays" spin={6} />
        </Layer>
        <Layer depth={1.4}>
          <ParticleField seed="s03wind" kind="petal" count={34} colors={['#ffffff', '#ffeef5']} size={[6, 12]} vel={{ x: [700, 1100], y: [-60, 40] }} sway={10} />
        </Layer>
        <ThrowFX />
      </DioramaCamera>
      <Flash at={0} hold={0} outLen={6} max={0.5} />
      <Post vignette={0.45} grain={0.07} wash="linear-gradient(160deg, #ffcf8a, #ff7b6b)" washOpacity={0.18} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH02: strike -> data dissolve */
const HIT = 14;
const CAM_KEYS: CamKey[] = [
  { f: 0, x: 0.635, y: 0.665, zoom: 1.88 },
  { f: HIT, x: 0.64, y: 0.665, zoom: 1.98, ease: EASE.in },
  { f: 156, x: 0.645, y: 0.63, zoom: 2.18, ease: EASE.inOut },
];
const SHAKES: Shake[] = [{ from: HIT, to: HIT + 30, amp: 34, freq: 20, rotAmp: 1.4, seed: 'hit' }];

/** Cel-shaded stone, drawn in code: flies from the camera into the crystal. */
const Stone: React.FC<{ tx: number; ty: number }> = ({ tx, ty }) => {
  const f = useCurrentFrame();
  if (f > HIT) return null;
  const t = EASE.in(ramp(f, 0, HIT));
  const pos = (k: number) => ({ x: lerp(-180, tx, k), y: lerp(980, ty, k) + Math.sin(k * Math.PI) * -120, s: lerp(3.2, 0.55, k) });
  const ghosts = [0.16, 0.1, 0.05];
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
      {ghosts.map((g, i) => draw(t - g, 0.25 - i * 0.06, `g${i}`))}
      <defs>
        <linearGradient id="trail" gradientUnits="userSpaceOnUse" x1={tail.x} y1={tail.y} x2={head.x} y2={head.y}>
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,250,235,0.85)" />
        </linearGradient>
      </defs>
      <polygon points={`${tail.x},${tail.y} ${head.x + nx * hw},${head.y + ny * hw} ${head.x - nx * hw},${head.y - ny * hw}`} fill="url(#trail)" />
      {draw(t, 1, 'stone')}
    </svg>
  );
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const StrikeHUD: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const rect = weaselWorldRect(380);
  const c = weaselPoint(rect, WEASEL_POINTS.crystal);
  const pc = projectPoint(cam, c.x, c.y, 1, PLATE_OVERSCAN);
  const top = projectPoint(cam, rect.x + rect.w * 0.3, rect.y - 10, 1, PLATE_OVERSCAN);
  return (
    <>
      <div style={{ position: 'absolute', left: top.x - 180, top: top.y - 70, opacity: 1 - ramp(f, HIT + 30, HIT + 40) }}>
        <StatBar label="HP" value={0} from={1} at={HIT + 1} len={8} color={HUD.warn} rgb={HUD.warnRGB} width={300} />
      </div>
      <FloatText text="KRITISCHER TREFFER!" x={pc.x + 150} y={pc.y - 250} at={HIT + 1} color={HUD.gold} size={50} rise={50} dur={48} />
      <FloatText text="−128" x={pc.x + 230} y={pc.y - 60} at={HIT + 2} color="#ffffff" size={84} rise={60} dur={40} />
      <SystemWindow x={110} y={110} w={600} at={104} closeAt={148} title="KAMPF BEENDET">
        <div style={{ fontSize: 36, fontWeight: 600 }}>Schattenwiesel besiegt.</div>
        <div style={{ display: 'flex', gap: 30, marginTop: 10, fontSize: 28, fontWeight: 600 }}>
          <span style={{ color: HUD.gold, textShadow: `0 0 10px ${HUD.gold}` }}>+15 EXP</span>
          <span style={{ color: HUD.sys }}>Daten absorbiert</span>
        </div>
      </SystemWindow>
    </>
  );
};

/** Screen-space impact effects that need the projected crystal position. */
const ImpactFX: React.FC = () => {
  const f = useCurrentFrame();
  const rect = weaselWorldRect(380);
  const c = weaselPoint(rect, WEASEL_POINTS.crystal);
  // project with the un-shaken camera at the hit frame, so the burst origin stays locked to the world
  const cam = { ...sampleCam(CAM_KEYS, f), sx: 0, sy: 0, srot: 0 };
  const pc = projectPoint(cam, c.x, c.y, 1, PLATE_OVERSCAN);
  const hitCam = { ...sampleCam(CAM_KEYS, HIT), sx: 0, sy: 0, srot: 0 };
  const ph = projectPoint(hitCam, c.x, c.y, 1, PLATE_OVERSCAN);
  return (
    <>
      <Stone tx={ph.x} ty={ph.y} />
      {f < HIT ? <SpeedLines seed="s03h" cx={ph.x} cy={ph.y} mode="horizontal" count={70} opacity={0.55} /> : null}
      <Shockwave x={pc.x} y={pc.y} at={HIT} color="#e8fdff" rings={3} maxR={900} squash={0.8} />
      <Glow x={pc.x} y={pc.y} r={420 * (1 - ramp(f, HIT, HIT + 16))} color="rgba(255,255,240,1)" opacity={f >= HIT ? 1 : 0} />
      <Burst seed="spark" at={HIT} x={pc.x} y={pc.y} count={90} kind="spark" colors={['#ffffff', '#fff2b0', '#9ff6ff']} speed={[900, 2600]} gravity={1400} drag={2.4} life={[0.25, 0.7]} size={[2, 5]} />
      <Burst seed="shard" at={HIT} x={pc.x} y={pc.y} count={28} kind="shard" colors={['#d6a6ff', '#a56bff', '#f2e3ff']} speed={[500, 1500]} gravity={1800} drag={1.6} life={[0.5, 1.1]} size={[12, 26]} />
    </>
  );
};

export const S03SH02Strike: React.FC = () => {
  const f = useCurrentFrame();
  const rect = weaselWorldRect(380);
  const s = spriteInfo('weasel');
  const feet = { x: rect.x + rect.w * 0.3, y: rect.y + rect.h * 0.97 };
  const tensionOut = ramp(f, HIT, HIT + 4);
  return (
    <AbsoluteFill style={{ background: '#000', filter: impactFilter(f, [HIT]) }}>
      <DioramaCamera keys={CAM_KEYS} shakes={SHAKES}>
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="meadow" bloom={0.25} filter={`blur(1.2px) brightness(${0.84 + 0.16 * tensionOut}) saturate(${0.88 + 0.12 * tensionOut})`} />
          <GroundCracks x={feet.x} y={feet.y} at={HIT} length={300} squash={0.3} width={5} seed="crk" />
          <Burst seed="dust" at={HIT} x={feet.x} y={feet.y} count={34} kind="dust" colors={['rgba(150,110,70,0.8)', 'rgba(120,90,60,0.75)', 'rgba(200,170,130,0.6)']} speed={[120, 520]} angle={[-90, 170]} gravity={140} drag={2.2} life={[0.8, 1.6]} size={[18, 46]} />
          <Burst seed="rock" at={HIT} x={feet.x} y={feet.y - 10} count={22} kind="shard" colors={['#6b5a48', '#8a7660', '#4d3f31']} speed={[250, 750]} angle={[-90, 120]} gravity={1500} drag={1.0} life={[0.5, 1.0]} size={[5, 12]} />
          <Burst seed="grass" at={HIT} x={feet.x} y={feet.y} count={30} kind="debris" colors={['#2f7a2a', '#4c9a35', '#1f5a1d']} speed={[200, 700]} angle={[-90, 150]} gravity={900} drag={1.2} life={[0.6, 1.2]} size={[6, 14]} />
          <DataDissolve
            src={s.file}
            rect={rect}
            start={HIT + 6}
            duration={70}
            origin={WEASEL_POINTS.crystal}
            cell={5}
            palette={['#5ef2ff', '#8ff7ff', '#b57bff', '#d9fbff']}
            resolution={2.4}
            hitFlash={{ at: HIT, len: 8 }}
            seed={SPRITES.weasel}
            life={[0.8, 2.0]}
          />
        </Layer>
        <StrikeHUD />
      </DioramaCamera>
      <ImpactFX />
      <Flash at={HIT + 2} hold={0} outLen={9} max={0.85} />
      <Post vignette={0.5} grain={0.07} wash="linear-gradient(180deg, #2a3e6a, #120a1c)" washOpacity={0.22} />
    </AbsoluteFill>
  );
};
