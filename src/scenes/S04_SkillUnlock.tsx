import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, plateToLayer } from '../assets';
import { DioramaCamera, Layer, Plate, projectPoint, useCam } from '../engine/camera';
import { EASE, H, W, onTwos, ramp } from '../engine/core';
import { FONT_HUD, FONT_TITLE } from '../engine/fonts';
import { ParticleField } from '../fx/particles';
import { Flash, Glow, LightRays, Post, Shockwave } from '../fx/overlays';
import { GlitchText, HUD, SystemWindow, Typewriter } from '../hud/hud';

const EyeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ filter: `drop-shadow(0 0 10px ${color})` }}>
    <path d="M-44,0 Q0,-38 44,0 Q0,38 -44,0 Z" fill="none" stroke={color} strokeWidth={5} />
    <circle r={15} fill="none" stroke={color} strokeWidth={5} />
    <circle r={6} fill={color} />
    <path d="M-48,-40 L-36,-40 M-48,-40 L-48,-28 M48,40 L36,40 M48,40 L48,28" stroke={color} strokeWidth={4} />
  </svg>
);

/* ------------------------------------------------ SH01: [Skill freigeschaltet: Analyse] */
const HandFX: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const hand = plateToLayer('hero', 520, 185);
  const eyes = plateToLayer('hero', 688, 88);
  const ph = projectPoint(cam, hand.x, hand.y, 1, PLATE_OVERSCAN);
  const pe = projectPoint(cam, eyes.x, eyes.y, 1, PLATE_OVERSCAN);
  const charge = ramp(f, 4, 36, EASE.in);
  const burst = 1 - ramp(f, 38, 60);
  const eyeGlint = ramp(f, 44, 48) * (1 - ramp(f, 52, 70));
  return (
    <>
      <Glow x={ph.x} y={ph.y} r={60 + 160 * charge + (f >= 36 ? 260 * burst : 0)} color={`rgba(${HUD.sysRGB},1)`} opacity={0.4 + 0.6 * Math.max(charge, f >= 36 ? burst : 0)} />
      <Shockwave x={ph.x} y={ph.y} at={36} color={HUD.sys} rings={3} maxR={520} squash={0.9} />
      <Glow x={pe.x} y={pe.y} r={70} color={`rgba(${HUD.sysRGB},1)`} opacity={eyeGlint} />
      <Glow x={pe.x} y={pe.y} r={22} color="rgba(255,255,255,1)" opacity={eyeGlint} />
    </>
  );
};

export const S04SH01Skill: React.FC = () => {
  const f = useCurrentFrame();
  const hand = plateToLayer('hero', 520, 185);
  const sun = plateToLayer('hero', 600, 330);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera
        keys={[
          // his head sits at the very top of the plate: keep focus pinned high (the clamp holds the edge)
          { f: 0, x: 0.42, y: 0.3, zoom: 1.32, pitch: 2 },
          { f: 114, x: 0.5, y: 0.3, zoom: 1.06, pitch: 0, ease: EASE.inOut },
        ]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="hero" bloom={0.45} />
          <LightRays x={sun.x} y={sun.y} opacity={0.5} seed="s04rays" spin={3} reach={90} />
          <ParticleField
            seed="s04stream"
            kind="cube"
            count={140}
            colors={[HUD.sys, '#b8fbff', HUD.violet, '#ffffff']}
            size={[4, 10]}
            vel={{ x: [80, 220], y: [-90, -20] }}
            sway={40}
            area={{ x: -200, y: 150, w: 1100, h: 900 }}
            attract={{ x: hand.x, y: hand.y, from: 0, to: 34 }}
            fadeOut={[30, 38]}
          />
          <ParticleField seed="s04gold" kind="mote" count={60} colors={['rgba(255,215,120,0.95)', 'rgba(255,245,210,0.9)']} size={[2, 6]} vel={{ x: [-12, 12], y: [-40, -12] }} fadeIn={[30, 60]} />
        </Layer>
        <HandFX />
      </DioramaCamera>
      <SystemWindow x={1175} y={150} w={690} at={40} variant="gold" title="SKILL FREIGESCHALTET">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <EyeIcon size={110} color={HUD.gold} />
          <div>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 66, letterSpacing: 4, color: '#fff7dc', textShadow: `0 0 22px rgba(${HUD.goldRGB},0.9)` }}>[ Analyse ]</div>
            <div style={{ fontSize: 22, letterSpacing: 5, color: HUD.gold, fontWeight: 600 }}>EINZIGARTIGER SKILL · RANG ???</div>
          </div>
        </div>
        <div style={{ height: 1.5, margin: '18px 0 14px', background: `linear-gradient(90deg, ${HUD.gold}, transparent)`, width: `${ramp(f, 50, 62, EASE.out) * 100}%` }} />
        <div style={{ fontSize: 27, fontWeight: 500, lineHeight: 1.35 }}>
          <Typewriter text={'Enthüllt Level, Status und\nSchwachstellen jedes Ziels.'} at={58} cps={42} />
        </div>
      </SystemWindow>
      <Flash at={36} hold={0} outLen={10} max={0.55} color="#dffcff" />
      <Post vignette={0.45} grain={0.06} wash="linear-gradient(160deg, #ffcf8a, #8a6bff)" washOpacity={0.2} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH02: first scan -> the Monolith */
const ScanHUD: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const mono = plateToLayer('hero', 1055, 250);
  const pm = projectPoint(cam, mono.x, mono.y, 1, PLATE_OVERSCAN);
  const scanY = H * ramp(f, 4, 22, EASE.inOut);
  return (
    <>
      {f >= 4 && f < 24 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: scanY - 2, height: 4, background: HUD.sys, boxShadow: `0 0 30px 8px rgba(${HUD.sysRGB},0.7)` }} />
      ) : null}
      {f >= 14 ? (
        <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, filter: `drop-shadow(0 0 8px ${HUD.violet})` }}>
          <g transform={`translate(${pm.x} ${pm.y})`} opacity={ramp(f, 14, 20)}>
            <rect x={-150} y={-330} width={300} height={720} fill="none" stroke={HUD.violet} strokeWidth={3} strokeDasharray="40 16" />
            <line x1={-190} y1={0} x2={-150} y2={0} stroke={HUD.violet} strokeWidth={3} />
            <line x1={150} y1={0} x2={190} y2={0} stroke={HUD.violet} strokeWidth={3} />
          </g>
        </svg>
      ) : null}
    </>
  );
};

export const S04SH02Monolith: React.FC = () => {
  const f = useCurrentFrame();
  const glitchOn = f > 20 && random(`mg${onTwos(f)}`) < 0.28;
  const jx = glitchOn ? (random(`mjx${f}`) - 0.5) * 40 : 0;
  return (
    <AbsoluteFill style={{ background: '#000', transform: `translateX(${jx}px)`, filter: glitchOn ? 'hue-rotate(60deg) saturate(1.8) contrast(1.2)' : undefined }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.72, y: 0.4, zoom: 1.5 },
          { f: 14, x: 0.8, y: 0.38, zoom: 2.25, ease: EASE.snap },
          { f: 54, x: 0.805, y: 0.37, zoom: 2.4, ease: EASE.linear },
        ]}
        shakes={[{ from: 12, to: 24, amp: 10, freq: 20 }]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="hero" bloom={0.3} filter={`saturate(${1 - 0.5 * ramp(f, 10, 40)}) brightness(${1 - 0.25 * ramp(f, 10, 40)})`} />
        </Layer>
        <ScanHUD />
      </DioramaCamera>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(120,40,200,0.0) 20%, rgba(60,0,90,0.55) 100%)', opacity: ramp(f, 8, 30) }} />
      <SystemWindow x={110} y={250} w={720} at={18} variant="corrupt" title="ANALYSE">
        <div style={{ fontFamily: FONT_HUD, fontSize: 40, fontWeight: 700, color: '#f2e6ff' }}>
          <GlitchText text="[???] Monolith des Echos" at={18} intensity={0.18} />
        </div>
        <div style={{ display: 'flex', gap: 28, marginTop: 10, fontSize: 28, fontWeight: 600 }}>
          <span style={{ color: HUD.violet }}>
            <GlitchText text="LVL ????" at={22} intensity={0.35} />
          </span>
          <span style={{ color: HUD.warn }}>
            <GlitchText text="STATUS: KORRUMPIERT" at={26} intensity={0.12} />
          </span>
        </div>
        <div style={{ marginTop: 14, fontSize: 24, color: HUD.warn, opacity: ramp(f, 32, 34), textShadow: `0 0 10px ${HUD.warn}` }}>⚠ Warnung: Betreten wird nicht empfohlen.</div>
      </SystemWindow>
      <Post vignette={0.65} grain={0.1} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ S05: title card */
export const S05Title: React.FC = () => {
  const f = useCurrentFrame();
  const appear = ramp(f, 0, 14, EASE.out);
  const sweep = -40 + ramp(f, 6, 40, EASE.inOut) * 180;
  const out = 1 - ramp(f, 54, 63);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, #1a1206 0%, #000 65%)', opacity: out }}>
      <ParticleField seed="title" kind="ember" count={70} colors={['rgba(255,190,90,0.95)', 'rgba(255,230,160,0.9)']} size={[2, 5]} vel={{ x: [-10, 10], y: [-80, -30] }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: 150,
            letterSpacing: 40 - 22 * appear,
            backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%), linear-gradient(180deg, #fff3c4 0%, #e8b65a 55%, #9a6a22 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: `drop-shadow(0 0 ${24 * appear}px rgba(255,200,100,0.55))`,
            opacity: appear,
            transform: `scale(${1.08 - 0.08 * appear})`,
            marginRight: -18,
          }}
        >
          AETHELGARD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 22, opacity: ramp(f, 16, 26) }}>
          <div style={{ height: 1.5, width: 220 * ramp(f, 16, 32, EASE.out), background: 'linear-gradient(270deg, #e8b65a, transparent)' }} />
          <div style={{ fontFamily: FONT_HUD, fontWeight: 600, fontSize: 34, letterSpacing: 12, color: '#f3dfb0' }}>EPISODE 1 · DAS ERWACHEN</div>
          <div style={{ height: 1.5, width: 220 * ramp(f, 16, 32, EASE.out), background: 'linear-gradient(90deg, #e8b65a, transparent)' }} />
        </div>
      </AbsoluteFill>
      <Flash at={0} hold={0} outLen={14} max={0.45} color="#ffe6b0" />
      <Post vignette={0.6} grain={0.08} />
    </AbsoluteFill>
  );
};
