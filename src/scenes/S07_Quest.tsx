import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MANIFEST, PLATE_OVERSCAN, plateToLayer } from '../assets';
import { projectPoint, useCam } from '../engine/camera';
import { EASE, ramp } from '../engine/core';
import { FONT_HUD, FONT_TITLE } from '../engine/fonts';
import { ParticleField } from '../fx/particles';
import { Flash, Glow, Post } from '../fx/overlays';
import { HUD } from '../hud/hud';
import { QuestNotice } from '../hud/quest';
import { DioramaShot } from './DioramaShot';

const ELARA = '#9be7a0';

/* ------------------------------------------------ SH01: Elara thanks him */
export const S07SH01Thanks: React.FC = () => (
  <DioramaShot
    id="s07sh01"
    plate="thanks"
    keys={[{ f: 0, x: 0.52, y: 0.36, zoom: 1.3 }, { f: 210, x: 0.52, y: 0.33, zoom: 1.48, ease: EASE.inOut }]}
    bloom={0.4}
    ambient={['motes', 'dust']}
    rays={{ raw: [60, 60], opacity: 0.35, color: '255,236,180' }}
    lines={[
      { text: 'Danke … du hast mich gerettet!', from: 16, to: 86, speaker: 'ELARA', color: ELARA },
      { text: 'Ich bin Elara. Bist du … ein Magier?', from: 94, to: 204, speaker: 'ELARA', color: ELARA },
    ]}
    overlay={
      <QuestNotice
        at={126}
        closeAt={196}
        kind="relation"
        title="BEZIEHUNG VERBESSERT"
        body={
          <span>
            Elara: Neutral → <span style={{ color: '#ff9ec7' }}>Freundlich</span>
          </span>
        }
        portrait={MANIFEST.ui.portraitElara}
      />
    }
  />
);

/* ------------------------------------------------ SH02: a new quest - "Eine sichere Reise" */
const MonolithPulse: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const m = plateToLayer('walking', 790, 130);
  const p = projectPoint(cam, m.x, m.y, 1, PLATE_OVERSCAN);
  return <Glow x={p.x} y={p.y} r={150} color={`rgba(${HUD.violetRGB},1)`} opacity={0.22 + 0.18 * Math.sin(f * 0.08)} />;
};

export const S07SH02Walking: React.FC = () => (
  <DioramaShot
    id="s07sh02"
    plate="walking"
    keys={[{ f: 0, x: 0.48, y: 0.46, zoom: 1.32 }, { f: 240, x: 0.5, y: 0.45, zoom: 1.06, ease: EASE.inOut }]}
    bloom={0.45}
    ambient={['motes']}
    rays={{ raw: [80, 200], opacity: 0.45 }}
    lines={[
      { text: 'Ein Magier? … So etwas in der Art.', from: 18, to: 96, speaker: 'KAELAN', color: HUD.sys },
      { text: 'Dann bring mich in die nächste Stadt.', from: 150, to: 232, speaker: 'KAELAN', color: HUD.sys },
    ]}
    wash="linear-gradient(160deg, #ffb36a, #8a6bff)"
    washOpacity={0.2}
    overlay={
      <QuestNotice
        at={96}
        closeAt={222}
        kind="quest"
        title="NEUE QUEST"
        body={
          <span>
            „Eine sichere Reise“
            <div style={{ fontSize: 20, fontWeight: 500, color: HUD.text, marginTop: 4 }}>Begleite Elara zur nächsten Stadt.</div>
          </span>
        }
      />
    }
  >
    <MonolithPulse />
  </DioramaShot>
);

/* ------------------------------------------------ SH03: title card + teaser */
export const S07SH03Title: React.FC = () => {
  const f = useCurrentFrame();
  const appear = ramp(f, 0, 16, EASE.out);
  const sweep = -40 + ramp(f, 8, 50, EASE.inOut) * 180;
  const tease = ramp(f, 104, 120);
  const out = 1 - ramp(f, 168, 180);
  const wolves: [number, number][] = [
    [520, 860],
    [960, 900],
    [1400, 850],
  ];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, #1a1206 0%, #000 65%)', opacity: out }}>
      <ParticleField seed="title" kind="ember" count={70} colors={['rgba(255,190,90,0.95)', 'rgba(255,230,160,0.9)']} size={[2, 5]} vel={{ x: [-10, 10], y: [-80, -30] }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `translateY(${-60 * tease}px)` }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 22, opacity: ramp(f, 18, 30) }}>
          <div style={{ height: 1.5, width: 220 * ramp(f, 18, 36, EASE.out), background: 'linear-gradient(270deg, #e8b65a, transparent)' }} />
          <div style={{ fontFamily: FONT_HUD, fontWeight: 600, fontSize: 34, letterSpacing: 12, color: '#f3dfb0' }}>EPISODE 1 · DAS ERWACHEN</div>
          <div style={{ height: 1.5, width: 220 * ramp(f, 18, 36, EASE.out), background: 'linear-gradient(90deg, #e8b65a, transparent)' }} />
        </div>
        <div style={{ marginTop: 60, fontFamily: FONT_HUD, fontWeight: 500, fontStyle: 'italic', fontSize: 34, letterSpacing: 6, color: '#d9c7a0', opacity: tease }}>Fortsetzung folgt …</div>
      </AbsoluteFill>
      {wolves.map(([x, y], i) => {
        const o = ramp(f, 112 + i * 8, 124 + i * 8) * (f % 46 < 3 + i ? 0.2 : 1);
        return (
          <React.Fragment key={i}>
            <Glow x={x - 22} y={y} r={22} color="rgba(255,40,60,1)" opacity={o} />
            <Glow x={x + 22} y={y} r={22} color="rgba(255,40,60,1)" opacity={o} />
          </React.Fragment>
        );
      })}
      <Flash at={0} hold={0} outLen={14} max={0.45} color="#ffe6b0" />
      <Post vignette={0.6} grain={0.08} />
    </AbsoluteFill>
  );
};
