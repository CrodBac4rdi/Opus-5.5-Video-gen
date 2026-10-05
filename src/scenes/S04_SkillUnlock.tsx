import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, plateToLayer } from '../assets';
import { DioramaCamera, Layer, Plate, projectPoint, useCam } from '../engine/camera';
import { EASE, H, W, onTwos, ramp } from '../engine/core';
import { FONT_HUD, FONT_TITLE } from '../engine/fonts';
import { ParticleField } from '../fx/particles';
import { Flash, Glow, LightRays, Post, Shockwave } from '../fx/overlays';
import { GlitchText, HUD, SystemWindow, Typewriter } from '../hud/hud';
import { DioramaShot } from './DioramaShot';

export const EyeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ filter: `drop-shadow(0 0 10px ${color})` }}>
    <path d="M-44,0 Q0,-38 44,0 Q0,38 -44,0 Z" fill="none" stroke={color} strokeWidth={5} />
    <circle r={15} fill="none" stroke={color} strokeWidth={5} />
    <circle r={6} fill={color} />
    <path d="M-48,-40 L-36,-40 M-48,-40 L-48,-28 M48,40 L36,40 M48,40 L48,28" stroke={color} strokeWidth={4} />
  </svg>
);

/* ------------------------------------------------ SH01: [Skill freigeschaltet: Analyse] */
const SK = { absorb: 46, window: 56, type: 78, close: 186, target: 198 };

const HandFX: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const hand = plateToLayer('hero', 520, 185);
  const eyes = plateToLayer('hero', 688, 88);
  const ph = projectPoint(cam, hand.x, hand.y, 1, PLATE_OVERSCAN);
  const pe = projectPoint(cam, eyes.x, eyes.y, 1, PLATE_OVERSCAN);
  const charge = ramp(f, 4, SK.absorb, EASE.in);
  const burst = 1 - ramp(f, SK.absorb + 2, SK.absorb + 30);
  const eyeGlint = Math.max(ramp(f, 60, 64) * (1 - ramp(f, 68, 90)), ramp(f, SK.target - 4, SK.target) * (1 - ramp(f, SK.target + 20, SK.target + 40)));
  return (
    <>
      <Glow x={ph.x} y={ph.y} r={60 + 160 * charge + (f >= SK.absorb ? 260 * burst : 0)} color={`rgba(${HUD.sysRGB},1)`} opacity={0.4 + 0.6 * Math.max(charge, f >= SK.absorb ? burst : 0)} />
      <Shockwave x={ph.x} y={ph.y} at={SK.absorb} color={HUD.sys} rings={3} maxR={520} squash={0.9} />
      <Glow x={pe.x} y={pe.y} r={70} color={`rgba(${HUD.sysRGB},1)`} opacity={eyeGlint} />
      <Glow x={pe.x} y={pe.y} r={22} color="rgba(255,255,255,1)" opacity={eyeGlint} />
    </>
  );
};

const TargetAcquired: React.FC = () => {
  const f = useCurrentFrame();
  if (f < SK.target) return null;
  const scanX = W * ramp(f, SK.target, SK.target + 22, EASE.inOut);
  return (
    <>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: scanX - 2, width: 4, background: HUD.sys, boxShadow: `0 0 30px 8px rgba(${HUD.sysRGB},0.7)`, opacity: 1 - ramp(f, SK.target + 18, SK.target + 24) }} />
      <div style={{ position: 'absolute', left: 120, top: 120, fontFamily: FONT_HUD, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: HUD.sys, textShadow: `0 0 12px ${HUD.sys}` }}>
        <GlitchText text="[ANALYSE]  NEUES ZIEL ERFASST …" at={SK.target + 4} intensity={0.4} settle={16} />
      </div>
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
          { f: 0, x: 0.42, y: 0.3, zoom: 1.32, pitch: 2 },
          { f: SK.target - 4, x: 0.5, y: 0.3, zoom: 1.08, pitch: 0, ease: EASE.inOut },
          { f: 240, x: 0.76, y: 0.34, zoom: 1.65, pitch: 0, ease: EASE.in },
        ]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="hero" bloom={0.45} />
          <LightRays x={sun.x} y={sun.y} opacity={0.5} seed="s04rays" spin={2} reach={90} />
          <ParticleField
            seed="s04stream"
            kind="cube"
            count={160}
            colors={[HUD.sys, '#b8fbff', HUD.violet, '#ffffff']}
            size={[4, 10]}
            vel={{ x: [60, 180], y: [-80, -20] }}
            sway={40}
            area={{ x: -200, y: 150, w: 1100, h: 900 }}
            attract={{ x: hand.x, y: hand.y, from: 0, to: SK.absorb - 6 }}
            fadeOut={[SK.absorb - 8, SK.absorb]}
          />
          <ParticleField seed="s04gold" kind="mote" count={60} colors={['rgba(255,215,120,0.95)', 'rgba(255,245,210,0.9)']} size={[2, 6]} vel={{ x: [-12, 12], y: [-40, -12] }} fadeIn={[SK.absorb, SK.absorb + 30]} />
        </Layer>
        <HandFX />
      </DioramaCamera>
      <SystemWindow x={1175} y={150} w={690} at={SK.window} closeAt={SK.close} variant="gold" title="SKILL FREIGESCHALTET">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <EyeIcon size={110} color={HUD.gold} />
          <div>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 66, letterSpacing: 4, color: '#fff7dc', textShadow: `0 0 22px rgba(${HUD.goldRGB},0.9)` }}>[ Analyse ]</div>
            <div style={{ fontSize: 22, letterSpacing: 5, color: HUD.gold, fontWeight: 600 }}>EINZIGARTIGER SKILL · RANG ???</div>
          </div>
        </div>
        <div style={{ height: 1.5, margin: '18px 0 14px', background: `linear-gradient(90deg, ${HUD.gold}, transparent)`, width: `${ramp(f, SK.window + 10, SK.window + 24, EASE.out) * 100}%` }} />
        <div style={{ fontSize: 27, fontWeight: 500, lineHeight: 1.35 }}>
          <Typewriter text={'Enthüllt Level, Status und\nSchwachstellen jedes Ziels.'} at={SK.type} cps={24} />
        </div>
      </SystemWindow>
      <TargetAcquired />
      <Flash at={SK.absorb} hold={0} outLen={10} max={0.55} color="#dffcff" />
      <Post vignette={0.45} grain={0.06} wash="linear-gradient(160deg, #ffcf8a, #8a6bff)" washOpacity={0.2} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ S04_SH02: first scan -> the Monolith */
const MS = { snap: 14, window: 24, name: 30, lvl: 52, status: 72, warn: 104 };

const ScanHUD: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const mono = plateToLayer('hero', 1055, 250);
  const pm = projectPoint(cam, mono.x, mono.y, 1, PLATE_OVERSCAN);
  const scanY = H * ramp(f, 4, 26, EASE.inOut);
  return (
    <>
      {f >= 4 && f < 28 ? <div style={{ position: 'absolute', left: 0, right: 0, top: scanY - 2, height: 4, background: HUD.sys, boxShadow: `0 0 30px 8px rgba(${HUD.sysRGB},0.7)` }} /> : null}
      {f >= 16 ? (
        <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, filter: `drop-shadow(0 0 8px ${HUD.violet})` }}>
          <g transform={`translate(${pm.x} ${pm.y})`} opacity={ramp(f, 16, 24)}>
            <rect x={-150} y={-330} width={300} height={760} fill="none" stroke={HUD.violet} strokeWidth={3} strokeDasharray="40 16" strokeDashoffset={-f * 2} />
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
  const glitchOn = f > 30 && random(`mg${onTwos(f, 4)}`) < 0.12;
  const jx = glitchOn ? (random(`mjx${f}`) - 0.5) * 34 : 0;
  return (
    <AbsoluteFill style={{ background: '#000', transform: `translateX(${jx}px)`, filter: glitchOn ? 'hue-rotate(60deg) saturate(1.8) contrast(1.2)' : undefined }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.76, y: 0.34, zoom: 1.65 },
          { f: MS.snap, x: 0.8, y: 0.38, zoom: 2.25, ease: EASE.snap },
          { f: 180, x: 0.805, y: 0.36, zoom: 2.45, ease: EASE.linear },
        ]}
        shakes={[{ from: 12, to: 26, amp: 10, freq: 20 }]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="hero" bloom={0.3} filter={`saturate(${1 - 0.5 * ramp(f, 10, 60)}) brightness(${1 - 0.25 * ramp(f, 10, 60)})`} />
        </Layer>
        <ScanHUD />
      </DioramaCamera>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(120,40,200,0.0) 20%, rgba(60,0,90,0.55) 100%)', opacity: ramp(f, 8, 40) }} />
      <SystemWindow x={110} y={250} w={760} at={MS.window} variant="corrupt" title="ANALYSE">
        <div style={{ fontFamily: FONT_HUD, fontSize: 42, fontWeight: 700, color: '#f2e6ff' }}>
          <GlitchText text="[???] Monolith des Echos" at={MS.name} intensity={0.35} settle={24} />
        </div>
        <div style={{ display: 'flex', gap: 28, marginTop: 12, fontSize: 30, fontWeight: 600 }}>
          <span style={{ color: HUD.violet }}>
            <GlitchText text="LVL ????" at={MS.lvl} intensity={0.5} settle={30} floor={0.12} />
          </span>
          <span style={{ color: HUD.warn }}>
            <GlitchText text="STATUS: KORRUMPIERT" at={MS.status} intensity={0.3} settle={20} />
          </span>
        </div>
        <div style={{ marginTop: 16, fontSize: 26, color: HUD.warn, opacity: ramp(f, MS.warn, MS.warn + 4), textShadow: `0 0 10px ${HUD.warn}` }}>⚠ Warnung: Betreten wird nicht empfohlen.</div>
      </SystemWindow>
      <Post vignette={0.65} grain={0.1} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ S04_SH03: a decision */
export const S04SH03Resolve: React.FC = () => (
  <DioramaShot
    id="s04sh03"
    plate="hilltop"
    keys={[{ f: 0, x: 0.5, y: 0.48, zoom: 1.55 }, { f: 180, x: 0.49, y: 0.46, zoom: 1.36, ease: EASE.inOut }]}
    bloom={0.4}
    ambient={['motes']}
    rays={{ raw: [360, 113], opacity: 0.4 }}
    lines={[
      { text: 'Ein Spiel also …', from: 14, to: 80, thought: true },
      { text: 'Dann brauche ich zuerst Antworten. Und Menschen.', from: 88, to: 176, thought: true },
    ]}
    wash="linear-gradient(160deg, #ffcf8a, #6a8cff)"
    washOpacity={0.22}
  />
);

