import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, WEASEL_POINTS } from '../assets';
import { DioramaCamera, Layer, Plate } from '../engine/camera';
import { EASE, ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';
import { GrassForeground, ParticleField } from '../fx/particles';
import { Post } from '../fx/overlays';
import { HUD, StatBar, Tag, TargetLock, WeakPoint } from '../hud/hud';
import { WeaselSprite, weaselPoint, weaselWorldRect } from './weasel';

/* ------------------------------------------------ SH01: it comes out of the shadows */
export const S02SH01Emerge: React.FC = () => {
  const f = useCurrentFrame();
  const rect = weaselWorldRect(380);
  const center = { x: rect.x + rect.w * 0.45, y: rect.y + rect.h * 0.55 };
  const body = ramp(f, 26, 50, EASE.inOut);
  const lit = ramp(f, 40, 62, EASE.inOut);
  const eyes = ramp(f, 14, 22) * (0.75 + 0.25 * Math.sin(f * 0.6));
  // glitch-cut entry: the System registers a hostile presence
  const gl = f < 4 ? (random(`s02gl${f}`) - 0.5) * 60 : 0;
  return (
    <AbsoluteFill style={{ background: '#000', transform: `translateX(${gl}px)`, filter: f < 4 ? 'hue-rotate(-40deg) saturate(2) contrast(1.3)' : undefined }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.56, y: 0.57, zoom: 1.08 },
          { f: 84, x: 0.63, y: 0.63, zoom: 1.3, ease: EASE.inOut },
        ]}
        shakes={[{ from: 54, to: 74, amp: 5, freq: 14 }]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="meadow" bloom={0.25} filter={`brightness(${1 - 0.18 * ramp(f, 0, 60)}) saturate(${1 - 0.15 * ramp(f, 0, 60)})`} />
          <ParticleField
            seed="s02smoke"
            kind="smoke"
            count={46}
            colors={['rgba(40,10,60,0.55)', 'rgba(20,4,30,0.6)', 'rgba(90,40,140,0.35)']}
            size={[30, 90]}
            vel={{ x: [-20, 20], y: [-30, -8] }}
            area={{ x: rect.x - 260, y: rect.y - 200, w: rect.w + 520, h: rect.h + 300 }}
            attract={{ x: center.x, y: center.y, from: 2, to: 44 }}
            fadeIn={[0, 10]}
            fadeOut={[48, 70]}
          />
          <WeaselSprite rect={rect} opacity={body} brightness={0.06 + 0.94 * lit} eyes={eyes} />
          <ParticleField
            seed="s02wisp"
            kind="smoke"
            count={14}
            colors={['rgba(50,15,80,0.45)']}
            size={[14, 34]}
            vel={{ x: [-6, 6], y: [-40, -20] }}
            area={{ x: rect.x, y: rect.y - 40, w: rect.w, h: rect.h }}
            fadeIn={[40, 60]}
          />
        </Layer>
        <Layer depth={1.6}>
          <GrassForeground seed="s02grass" count={64} wind={1.2} blur={5} height={[180, 460]} />
        </Layer>
      </DioramaCamera>
      <Post vignette={0.6} grain={0.07} wash="linear-gradient(180deg, #3a1e5c, #0a0510)" washOpacity={0.35 * ramp(f, 0, 50)} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH02: [AGGRESSIV] + weak point */
export const S02SH02Aggro: React.FC = () => {
  const f = useCurrentFrame();
  const rect = { x: 360, y: 372, w: 1560, h: (1560 * 866) / 2476 };
  const crystal = weaselPoint(rect, WEASEL_POINTS.crystal);
  const alarm = 0.5 + 0.5 * Math.sin(f * 0.42);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.5, y: 0.5, zoom: 1.0 },
          { f: 90, x: 0.47, y: 0.5, zoom: 1.08, ease: EASE.inOut },
        ]}
        shakes={[{ from: 26, to: 56, amp: 9, freq: 16, rotAmp: 0.4 }]}
      >
        <Layer depth={0.5}>
          <AbsoluteFill style={{ transform: 'scale(1.7)', transformOrigin: '64% 74%', filter: 'blur(7px) brightness(0.7) saturate(0.85)' }}>
            <Plate plate="meadow" />
          </AbsoluteFill>
        </Layer>
        <Layer depth={1}>
          <ParticleField seed="s02aura" kind="smoke" count={30} colors={['rgba(60,15,90,0.45)', 'rgba(25,5,40,0.5)']} size={[40, 110]} vel={{ x: [-10, 10], y: [-60, -25] }} area={{ x: rect.x, y: rect.y - 80, w: rect.w, h: rect.h + 60 }} />
          <WeaselSprite rect={rect} eyes={0.95} rim />
        </Layer>
      </DioramaCamera>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 45%, rgba(${HUD.warnRGB},${0.18 + 0.32 * alarm}) 100%)` }} />
      <TargetLock x={330} y={500} w={560} h={430} at={6}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: 5, color: HUD.text, textShadow: '0 2px 6px #000' }}>SCHATTENWIESEL</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: HUD.warn, textShadow: `0 0 10px ${HUD.warn}` }}>LVL 3</span>
        </div>
        <StatBar label="HP" value={1} from={0} at={8} len={10} color={HUD.warn} rgb={HUD.warnRGB} width={360} suffix="128/128" />
        <div style={{ marginTop: 14 }}>
          <Tag text="[AGGRESSIV]" at={14} size={30} />
        </div>
      </TargetLock>
      <WeakPoint x={crystal.x} y={crystal.y} at={40} side="right" label="SCHWACHSTELLE" sub="Stirnkristall · krit. Schaden ×10" r={44} />
      <div style={{ position: 'absolute', right: 70, top: 64, fontFamily: FONT_HUD, fontSize: 22, letterSpacing: 6, color: HUD.warn, opacity: ramp(f, 4, 8) * (0.6 + 0.4 * alarm), textShadow: `0 0 10px ${HUD.warn}` }}>
        ▲ FEINDKONTAKT
      </div>
      <Post vignette={0.55} grain={0.07} wash="linear-gradient(180deg, #5a0f22, #10020a)" washOpacity={0.3} />
    </AbsoluteFill>
  );
};
