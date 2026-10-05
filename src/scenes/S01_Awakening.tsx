import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { MANIFEST, PLATE_OVERSCAN, WEASEL_POINTS, plateToLayer } from '../assets';
import { DioramaCamera, Layer, Plate, projectPoint, useCam } from '../engine/camera';
import { EASE, ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';
import { GrassForeground, ParticleField } from '../fx/particles';
import { Eyelids, Flash, Glow, LightRays, Post, RippleRings, WaterFilter } from '../fx/overlays';
import { Subtitles } from '../fx/subtitle';
import { HUD, StatBar, SystemWindow, Tag, Typewriter } from '../hud/hud';
import { DioramaShot } from './DioramaShot';
import { weaselPoint, weaselWorldRect } from './weasel';

/* ------------------------------------------------ SH01: POV - the eyes open on a foreign sky */
export const S01SH01PovSky: React.FC = () => {
  const f = useCurrentFrame();
  const blur = interpolate(f, [0, 56], [18, 0], { extrapolateRight: 'clamp', easing: EASE.out });
  const bright = interpolate(f, [0, 46], [1.9, 1], { extrapolateRight: 'clamp', easing: EASE.out });
  const sun = plateToLayer('skyPov', 320, 156);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera keys={[{ f: 0, x: 0.47, y: 0.46, zoom: 1.26, rot: -3 }, { f: 150, x: 0.42, y: 0.4, zoom: 1.12, rot: 2, ease: EASE.inOut }]}>
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="skyPov" bloom={0.4} filter={`blur(${blur}px) brightness(${bright})`} />
          <LightRays x={sun.x} y={sun.y} opacity={0.45} seed="povrays" reach={85} />
        </Layer>
        <Layer depth={1.4}>
          <ParticleField seed="povpetal" kind="petal" count={20} colors={['#ffffff', '#fff1f6']} size={[7, 13]} vel={{ x: [10, 40], y: [20, 60] }} sway={36} />
        </Layer>
      </DioramaCamera>
      <Eyelids keys={[[0, 0.03], [16, 0.2], [36, 0.7], [46, 0.08], [56, 0.12], [80, 1]]} />
      <Flash at={0} hold={2} outLen={30} color="#ffffff" />
      <Subtitles lines={[{ text: '… wo … bin ich?', from: 86, to: 146, thought: true }]} />
      <Post vignette={0.45} grain={0.06} wash="linear-gradient(160deg, #ffd9a0, #6a8cff)" washOpacity={0.2} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH02: Kaelan in the grass */
export const S01SH02Awakening: React.FC = () => (
  <DioramaShot
    id="s01sh02"
    plate="awakening"
    keys={[{ f: 0, x: 0.7, y: 0.3, zoom: 1.5, rot: -3 }, { f: 180, x: 0.6, y: 0.42, zoom: 1.12, rot: 0, ease: EASE.inOut }]}
    bloom={0.35}
    ambient={['petals', 'motes']}
    rays={{ raw: [90, -40], opacity: 0.4 }}
    wash="linear-gradient(160deg, #ffd9a0, #6a8cff)"
  />
);

/* ------------------------------------------------ SH03: extreme close-up - the sky in his eyes */
const EyeGlints: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const flicker = ramp(f, 66, 72) * (1 - ramp(f, 74, 92));
  return (
    <>
      {[
        [380, 340],
        [933, 340],
      ].map(([x, y]) => {
        const l = plateToLayer('eyes', x, y);
        const p = projectPoint(cam, l.x, l.y, 1, PLATE_OVERSCAN);
        return (
          <React.Fragment key={x}>
            <Glow x={p.x} y={p.y} r={90} color="rgba(255,255,255,0.8)" opacity={0.25 + 0.15 * Math.sin(f * 0.15)} />
            <Glow x={p.x} y={p.y} r={120} color={`rgba(${HUD.sysRGB},1)`} opacity={flicker} />
          </React.Fragment>
        );
      })}
    </>
  );
};

export const S01SH03Eyes: React.FC = () => (
  <DioramaShot id="s01sh03" plate="eyes" keys={[{ f: 0, x: 0.5, y: 0.47, zoom: 1.1 }, { f: 120, x: 0.5, y: 0.46, zoom: 1.2 }]} bloom={0.3} vignette={0.6}>
    <EyeGlints />
  </DioramaShot>
);

/* ------------------------------------------------ SH04: the world of Aethelgard */
export const S01SH04Hilltop: React.FC = () => (
  <DioramaShot
    id="s01sh04"
    plate="hilltop"
    keys={[{ f: 0, x: 0.5, y: 0.47, zoom: 1.28 }, { f: 180, x: 0.5, y: 0.5, zoom: 1.04, ease: EASE.inOut }]}
    bloom={0.4}
    ambient={['petals', 'motes']}
    rays={{ raw: [360, 113], opacity: 0.45 }}
    lines={[{ text: 'Das … ist kein Traum.', from: 70, to: 170, thought: true }]}
    wash="linear-gradient(160deg, #ffd9a0, #6a8cff)"
  />
);

/* ------------------------------------------------ SH05: foreign hands */
export const S01SH05Hands: React.FC = () => (
  <DioramaShot
    id="s01sh05"
    plate="hands"
    keys={[{ f: 0, x: 0.5, y: 0.56, zoom: 1.08 }, { f: 120, x: 0.5, y: 0.5, zoom: 1.2, ease: EASE.inOut }]}
    bloom={0.3}
    ambient={['motes']}
    lines={[{ text: 'Das ist nicht mein Körper.', from: 22, to: 116, thought: true }]}
  />
);

/* ------------------------------------------------ SH06: puddle reflection */
export const S01SH06Puddle: React.FC = () => {
  const f = useCurrentFrame();
  const disp = interpolate(f, [0, 6, 60, 180], [4, 70, 16, 8], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <WaterFilter id="puddle" scale={disp} freq="0.004 0.018" drift={[0.5, 1.1]} />
      <DioramaCamera keys={[{ f: 0, x: 0.5, y: 0.41, zoom: 1.16 }, { f: 180, x: 0.5, y: 0.37, zoom: 1.45, ease: EASE.inOut }]}>
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="puddle" bloom={0.25} filter="url(#puddle) saturate(1.08)" />
        </Layer>
      </DioramaCamera>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(120,170,230,1), rgba(60,90,150,1))', mixBlendMode: 'multiply', opacity: 0.32 }} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(${112 + f * 0.06}deg, transparent 28%, rgba(255,255,255,0.13) 42%, transparent 55%, transparent 70%, rgba(255,255,255,0.07) 78%, transparent 86%)`,
          mixBlendMode: 'screen',
        }}
      />
      <RippleRings x={1210} y={300} at={4} count={4} maxR={620} squash={0.92} />
      <ParticleField seed="s02petal" kind="petal" count={13} colors={['#ffffff', '#fdeef4']} size={[11, 17]} vel={{ x: [3, 9], y: [1, 6] }} sway={6} opacity={[0.85, 1]} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 78% 72% at 50% 46%, rgba(0,0,0,0) 62%, rgba(18,26,12,0.9) 100%)' }} />
      <Subtitles lines={[{ text: '… wessen Gesicht ist das?', from: 56, to: 172, thought: true }]} />
      <Post vignette={0.55} grain={0.06} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH07: [Willkommen, Spieler.] -> status window */
const ST = { open: 14, type: 30, close1: 140, open2: 150, hp: 172, status: 214 };

const WelcomeHUD: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const orb = plateToLayer('system', 500, 225);
  const p = projectPoint(cam, orb.x, orb.y, 1, PLATE_OVERSCAN);
  const flick = f > ST.open ? 0.75 + 0.25 * Math.sin(f * 0.9) * Math.sin(f * 0.37) : 0;
  return (
    <>
      <Glow x={p.x} y={p.y} r={520} color={`rgba(${HUD.sysRGB},0.55)`} opacity={flick} />
      <SystemWindow x={p.x - 330} y={p.y - 110} w={640} at={ST.open} closeAt={ST.close1} title="SYSTEM">
        <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: 1, textShadow: `0 0 14px rgba(${HUD.sysRGB},0.7)` }}>
          <Typewriter text="Willkommen, Spieler." at={ST.type} cps={14} />
        </div>
      </SystemWindow>
      <SystemWindow x={p.x - 330} y={p.y - 175} w={640} at={ST.open2} title="STATUS">
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Img src={staticFile(MANIFEST.ui.portrait)} style={{ width: 92, height: 92, objectFit: 'cover', border: `2px solid ${HUD.sys}`, boxShadow: `0 0 12px ${HUD.sys}` }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 24, letterSpacing: 4, fontWeight: 600, color: HUD.sys }}>KAELAN · LVL 1 · KLASSE: ???</div>
            <StatBar label="HP" value={0.23} from={1} at={ST.hp} len={16} color={HUD.warn} rgb={HUD.warnRGB} width={320} blinkLow suffix="23/100" />
            <StatBar label="MP" value={0.8} from={0} at={ST.hp - 4} len={16} color={HUD.sys} rgb={HUD.sysRGB} width={320} suffix="40/50" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 20, opacity: ramp(f, ST.status - 4, ST.status) }}>
          <div style={{ fontFamily: FONT_HUD, fontSize: 26, letterSpacing: 4, fontWeight: 600 }}>ZUSTAND:</div>
          <Tag text="VERLETZT" at={ST.status} size={26} />
        </div>
      </SystemWindow>
    </>
  );
};

export const S01SH07System: React.FC = () => {
  const sun = plateToLayer('system', 700, 300);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera keys={[{ f: 0, x: 0.55, y: 0.46, zoom: 1.08, yaw: 2 }, { f: 330, x: 0.5, y: 0.43, zoom: 1.22, yaw: -1.5, ease: EASE.inOut }]}>
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="system" bloom={0.3} />
          <LightRays x={sun.x} y={sun.y} opacity={0.25} seed="s03rays" />
        </Layer>
        <Layer depth={1.25}>
          <ParticleField seed="s03mote" kind="mote" count={40} colors={[`rgba(${HUD.sysRGB},0.9)`, 'rgba(200,255,255,0.9)']} size={[2, 5]} vel={{ x: [-10, 10], y: [-26, -8] }} area={{ x: 120, y: 60, w: 900, h: 760 }} fadeIn={[14, 40]} />
        </Layer>
        <WelcomeHUD />
      </DioramaCamera>
      <Post vignette={0.5} grain={0.06} wash="linear-gradient(90deg, #4fd8ff, #ffb36a)" washOpacity={0.2} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH08: cliffhanger - red eyes in the grass */
const RedEyes: React.FC = () => {
  const f = useCurrentFrame();
  const rect = weaselWorldRect(380);
  const e1 = weaselPoint(rect, WEASEL_POINTS.eyeNear);
  const e2 = weaselPoint(rect, WEASEL_POINTS.eyeFar);
  const blinkClosed = f >= 58 && f < 63;
  const o = ramp(f, 28, 40) * (blinkClosed ? 0 : 1);
  return (
    <>
      {[e1, e2].map((e, i) => (
        <React.Fragment key={i}>
          <Glow x={e.x} y={e.y} r={34} color="rgba(255,30,60,1)" opacity={o} />
          <Glow x={e.x} y={e.y} r={9} color="rgba(255,230,230,1)" opacity={o} />
        </React.Fragment>
      ))}
    </>
  );
};

export const S01SH08RedEyes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera keys={[{ f: 0, x: 0.62, y: 0.66, zoom: 1.6 }, { f: 90, x: 0.64, y: 0.67, zoom: 1.9, ease: EASE.in }]}>
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="meadow" filter="brightness(0.5) saturate(0.6) hue-rotate(-15deg)" />
          <RedEyes />
        </Layer>
        <Layer depth={1.6}>
          <GrassForeground seed="s08grass" count={80} wind={2.2} blur={6} height={[260, 620]} color={['#06120a', '#0a1c0f', '#0d2412']} />
        </Layer>
      </DioramaCamera>
      <Post vignette={0.75} grain={0.09} wash="linear-gradient(180deg, #1a0c2a, #000)" washOpacity={0.45} />
      <AbsoluteFill style={{ background: '#000', opacity: ramp(f, 80, 90) }} />
    </AbsoluteFill>
  );
};
