import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { MANIFEST, PLATE_OVERSCAN, plateToLayer } from '../assets';
import { DioramaCamera, Layer, Plate, projectPoint, useCam } from '../engine/camera';
import { EASE, ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';
import { ParticleField } from '../fx/particles';
import { Caption, Eyelids, Flash, Glow, LightRays, Post, RippleRings, WaterFilter } from '../fx/overlays';
import { HUD, StatBar, SystemWindow, Tag, Typewriter } from '../hud/hud';

/* ------------------------------------------------ SH01: eyes open */
export const S01SH01Awakening: React.FC = () => {
  const f = useCurrentFrame();
  const blur = interpolate(f, [0, 36], [18, 0], { extrapolateRight: 'clamp', easing: EASE.out });
  const bright = interpolate(f, [0, 30], [1.9, 1], { extrapolateRight: 'clamp', easing: EASE.out });
  const sun = plateToLayer('awakening', 90, -40);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.73, y: 0.27, zoom: 1.75, rot: -5 },
          { f: 90, x: 0.6, y: 0.43, zoom: 1.17, rot: 0, ease: EASE.inOut },
        ]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="awakening" bloom={0.35} filter={`blur(${blur}px) brightness(${bright})`} />
          <LightRays x={sun.x} y={sun.y} opacity={0.42} seed="s01rays" reach={85} />
        </Layer>
        <Layer depth={1.35}>
          <ParticleField seed="s01petal" kind="petal" count={26} colors={['#ffffff', '#fff1f6', '#ffe3ee']} size={[6, 11]} vel={{ x: [30, 80], y: [10, 45] }} sway={30} opacity={[0.75, 1]} />
          <ParticleField seed="s01mote" kind="mote" count={46} colors={['rgba(255,226,160,0.9)', 'rgba(255,250,220,0.9)']} size={[2, 6]} vel={{ x: [-8, 14], y: [-22, -6] }} sway={24} opacity={[0.3, 0.9]} />
        </Layer>
      </DioramaCamera>
      <Eyelids keys={[[0, 0.05], [10, 0.25], [20, 0.75], [27, 0.12], [33, 0.12], [46, 1]]} />
      <Flash at={0} hold={1} outLen={24} color="#ffffff" />
      <Post vignette={0.45} grain={0.06} wash="linear-gradient(160deg, #ffd9a0, #6a8cff)" washOpacity={0.22} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH02: puddle reflection */
export const S01SH02Puddle: React.FC = () => {
  const f = useCurrentFrame();
  const disp = interpolate(f, [0, 6, 40, 90], [4, 70, 16, 9], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <WaterFilter id="puddle" scale={disp} freq="0.004 0.018" />
      <DioramaCamera
        keys={[
          { f: 0, x: 0.5, y: 0.41, zoom: 1.18 },
          { f: 90, x: 0.5, y: 0.37, zoom: 1.42, ease: EASE.inOut },
        ]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="puddle" bloom={0.25} filter="url(#puddle) saturate(1.08)" />
        </Layer>
      </DioramaCamera>
      {/* water body: cool tint, sky sheen, dark muddy rim */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(120,170,230,1), rgba(60,90,150,1))', mixBlendMode: 'multiply', opacity: 0.32 }} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(${112 + f * 0.1}deg, transparent 28%, rgba(255,255,255,0.13) 42%, transparent 55%, transparent 70%, rgba(255,255,255,0.07) 78%, transparent 86%)`,
          mixBlendMode: 'screen',
        }}
      />
      <RippleRings x={1210} y={300} at={4} count={4} maxR={620} squash={0.92} />
      <ParticleField seed="s02petal" kind="petal" count={13} colors={['#ffffff', '#fdeef4']} size={[11, 17]} vel={{ x: [4, 12], y: [2, 8] }} sway={6} opacity={[0.85, 1]} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 78% 72% at 50% 46%, rgba(0,0,0,0) 62%, rgba(18,26,12,0.9) 100%)' }} />
      <Caption text="… wessen Gesicht ist das?" from={30} to={88} />
      <Post vignette={0.55} grain={0.06} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH03: [Willkommen, Spieler] */
const WelcomeHUD: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const orb = plateToLayer('system', 500, 225);
  const p = projectPoint(cam, orb.x, orb.y, 1, PLATE_OVERSCAN);
  const flick = f > 10 ? 0.75 + 0.25 * Math.sin(f * 0.9) * Math.sin(f * 0.37) : 0;
  return (
    <>
      <Glow x={p.x} y={p.y} r={520} color={`rgba(${HUD.sysRGB},0.55)`} opacity={flick} />
      <SystemWindow x={p.x - 330} y={p.y - 175} w={640} at={10} title="SYSTEM">
        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: 1, textShadow: `0 0 14px rgba(${HUD.sysRGB},0.7)` }}>
          <Typewriter text="Willkommen, Spieler." at={18} cps={22} />
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18, opacity: ramp(f, 44, 50), alignItems: 'center' }}>
          <Img
            src={staticFile(MANIFEST.ui.portrait)}
            style={{ width: 84, height: 84, objectFit: 'cover', border: `2px solid ${HUD.sys}`, boxShadow: `0 0 12px ${HUD.sys}`, filter: 'saturate(0.9)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 22, letterSpacing: 4, fontWeight: 600, color: HUD.sys }}>KAELAN · LVL 1</div>
            <StatBar label="HP" value={0.23} from={1} at={52} len={12} color={HUD.warn} rgb={HUD.warnRGB} width={330} blinkLow suffix="23/100" />
            <StatBar label="MP" value={0.8} from={0} at={50} len={12} color={HUD.sys} rgb={HUD.sysRGB} width={330} suffix="40/50" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 18, opacity: ramp(f, 56, 58) }}>
          <div style={{ fontFamily: FONT_HUD, fontSize: 26, letterSpacing: 4, fontWeight: 600 }}>STATUS:</div>
          <Tag text="VERLETZT" at={58} size={26} />
        </div>
      </SystemWindow>
    </>
  );
};

export const S01SH03System: React.FC = () => {
  const sun = plateToLayer('system', 700, 300);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.55, y: 0.46, zoom: 1.1, yaw: 2 },
          { f: 105, x: 0.5, y: 0.43, zoom: 1.2, yaw: -1.5, ease: EASE.inOut },
        ]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="system" bloom={0.3} />
          <LightRays x={sun.x} y={sun.y} opacity={0.25} seed="s03rays" />
        </Layer>
        <Layer depth={1.25}>
          <ParticleField seed="s03mote" kind="mote" count={40} colors={[`rgba(${HUD.sysRGB},0.9)`, 'rgba(200,255,255,0.9)']} size={[2, 5]} vel={{ x: [-10, 10], y: [-26, -8] }} area={{ x: 120, y: 60, w: 900, h: 760 }} fadeIn={[10, 34]} />
        </Layer>
        <WelcomeHUD />
      </DioramaCamera>
      <Post vignette={0.5} grain={0.06} wash="linear-gradient(90deg, #4fd8ff, #ffb36a)" washOpacity={0.2} />
    </AbsoluteFill>
  );
};
