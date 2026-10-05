import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, WEASEL_POINTS, plateToLayer } from '../assets';
import { DioramaCamera, Layer, Plate, projectPoint, useCam } from '../engine/camera';
import { EASE, H, W, ramp } from '../engine/core';
import { ParticleField, SpeedLines } from '../fx/particles';
import { Flash, Glow, LightRays, Post } from '../fx/overlays';
import { StrikeConfig, StrikeShot } from './combat';
import { weaselWorldRect } from './weasel';

/* ------------------------------------------------ SH01: the frozen throw */
const ThrowFX: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const hand = plateToLayer('throw', 965, 205);
  const stone = plateToLayer('throw', 1120, 213);
  const ph = projectPoint(cam, hand.x, hand.y, 1, PLATE_OVERSCAN);
  const ps = projectPoint(cam, stone.x, stone.y, 1, PLATE_OVERSCAN);
  const glint = ramp(f, 30, 38) * (1 - ramp(f, 42, 66));
  return (
    <>
      <SpeedLines seed="s03focus" cx={ph.x} cy={ph.y} count={120} inner={0.3} opacity={0.55 * (1 - ramp(f, 50, 100))} />
      <Glow x={ps.x} y={ps.y} r={140 * (0.6 + glint)} color="rgba(255,250,220,1)" opacity={0.5 + glint} />
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: glint }}>
        <g transform={`translate(${ps.x} ${ps.y}) rotate(${f * 3})`}>
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
          { f: 120, x: 0.59, y: 0.42, zoom: 1.26, rot: -3.5, ease: EASE.linear },
        ]}
        shakes={[{ from: 0, to: 16, amp: 16, freq: 18, rotAmp: 0.8 }]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="throw" bloom={0.45} />
          <LightRays x={sun.x} y={sun.y} opacity={0.5} seed="s03trays" spin={4} />
        </Layer>
        <Layer depth={1.4}>
          <ParticleField seed="s03wind" kind="petal" count={34} colors={['#ffffff', '#ffeef5']} size={[6, 12]} vel={{ x: [500, 800], y: [-60, 40] }} sway={10} />
        </Layer>
        <ThrowFX />
      </DioramaCamera>
      <Flash at={0} hold={0} outLen={6} max={0.5} />
      <Post vignette={0.45} grain={0.07} wash="linear-gradient(160deg, #ffcf8a, #ff7b6b)" washOpacity={0.18} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH02: strike -> data dissolve */
const rect = weaselWorldRect(380);
const WEASEL_STRIKE: StrikeConfig = {
  plate: 'meadow',
  sprite: 'weasel',
  rect,
  weakPoint: WEASEL_POINTS.crystal,
  camKeys: [
    { f: 0, x: 0.635, y: 0.665, zoom: 1.88 },
    { f: 14, x: 0.64, y: 0.665, zoom: 1.98, ease: EASE.in },
    { f: 240, x: 0.645, y: 0.62, zoom: 2.2, ease: EASE.inOut },
  ],
  hit: 14,
  projectile: 'stone',
  dissolve: { start: 22, duration: 120 },
  feet: { x: rect.x + rect.w * 0.3, y: rect.y + rect.h * 0.97 },
  name: 'SCHATTENWIESEL',
  hpMax: 128,
  damage: '−128',
  defeat: { at: 160, closeAt: 226, title: 'KAMPF BEENDET', line: 'Schattenwiesel besiegt.', reward: '+15 EXP' },
};

export const S03SH02Strike: React.FC = () => <StrikeShot c={WEASEL_STRIKE} />;
