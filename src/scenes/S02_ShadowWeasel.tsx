import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, WEASEL_POINTS, plateToLayer, spriteInfo, spriteUV } from '../assets';
import { DioramaCamera, Layer, Plate, projectPoint, useCam } from '../engine/camera';
import { EASE, ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';
import { Burst, GrassForeground, ParticleField, SpeedLines } from '../fx/particles';
import { Flash, Glow, Post, impactFilter } from '../fx/overlays';
import { Subtitles } from '../fx/subtitle';
import { FloatText, HUD, StatBar, SystemWindow, Tag, TargetLock, WeakPoint } from '../hud/hud';
import { PlayerDamage } from '../hud/quest';
import { DioramaShot } from './DioramaShot';
import { WeaselSprite, weaselPoint } from './weasel';

/* ------------------------------------------------ SH01: a harmless-looking shadow weasel */
const cuteRect = () => {
  const s = spriteInfo('weaselCute');
  const ground = plateToLayer('meadow', 860, 545);
  const h = 230;
  const w = (h * s.w) / s.h;
  return { x: ground.x - 0.25 * w, y: ground.y - 0.96 * h, w, h };
};

const CuteWeasel: React.FC = () => {
  const f = useCurrentFrame();
  const r = cuteRect();
  const s = spriteInfo('weaselCute');
  const breathe = 1 + 0.018 * Math.sin(f * 0.16);
  const tilt = Math.sin(f * 0.05) * 2.5;
  const eye = spriteUV('weaselCute', 440, 143);
  const ex = r.x + eye.u * r.w;
  const ey = r.y + eye.v * r.h;
  return (
    <>
      <div style={{ position: 'absolute', left: r.x + r.w * 0.05, top: r.y + r.h * 0.9, width: r.w * 0.9, height: r.h * 0.14, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(10,0,20,0.6), rgba(0,0,0,0) 70%)' }} />
      <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, transformOrigin: '30% 100%', transform: `scaleY(${breathe}) rotate(${tilt}deg)` }}>
        <Img src={staticFile(s.file)} style={{ width: '100%', height: '100%' }} />
      </div>
      <Glow x={ex} y={ey} r={14} color="rgba(255,60,90,1)" opacity={0.5 + 0.2 * Math.sin(f * 0.3)} />
    </>
  );
};

const CuteHUD: React.FC = () => {
  const cam = useCam();
  const r = cuteRect();
  const a = projectPoint(cam, r.x, r.y, 1, PLATE_OVERSCAN);
  const b = projectPoint(cam, r.x + r.w * 0.55, r.y + r.h, 1, PLATE_OVERSCAN);
  return (
    <TargetLock x={a.x - 20} y={a.y - 20} w={b.x - a.x + 40} h={b.y - a.y + 40} at={70}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, color: HUD.text, textShadow: '0 2px 6px #000' }}>SCHATTENWIESEL</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: HUD.warn }}>LVL 3</span>
      </div>
      <Tag text="[AGGRESSIV]" at={96} size={28} />
    </TargetLock>
  );
};

export const S02SH01WeaselCute: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <DioramaCamera keys={[{ f: 0, x: 0.6, y: 0.66, zoom: 1.3 }, { f: 180, x: 0.64, y: 0.69, zoom: 1.5, ease: EASE.inOut }]}>
      <Layer depth={1} clampOv={PLATE_OVERSCAN}>
        <Plate plate="meadow" bloom={0.3} />
        <CuteWeasel />
      </Layer>
      <Layer depth={1.6}>
        <GrassForeground seed="cutegrass" count={56} wind={1} blur={5} height={[160, 420]} />
      </Layer>
      <CuteHUD />
    </DioramaCamera>
    <Subtitles lines={[{ text: 'Ein … Wiesel? Sieht doch harmlos aus.', from: 18, to: 92, thought: true }]} />
    <Post vignette={0.5} grain={0.06} wash="linear-gradient(160deg, #ffd9a0, #6a8cff)" washOpacity={0.18} />
  </AbsoluteFill>
);

/* ------------------------------------------------ SH02: he ignores the warning */
export const S02SH02ReachOut: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <DioramaShot
      id="s02sh02"
      plate="reach"
      keys={[{ f: 0, x: 0.45, y: 0.46, zoom: 1.12 }, { f: 150, x: 0.5, y: 0.45, zoom: 1.24, ease: EASE.inOut }]}
      bloom={0.3}
      ambient={['petals']}
      lines={[{ text: 'Ganz ruhig, Kleiner …', from: 34, to: 128, speaker: 'KAELAN', color: HUD.sys }]}
      overlay={
        <div style={{ position: 'absolute', right: 90, top: 90, opacity: 0.4 + 0.6 * Math.abs(Math.sin(f * 0.2)) }}>
          <Tag text="⚠ [AGGRESSIV]" at={20} size={30} />
        </div>
      }
    />
  );
};

/* ------------------------------------------------ SH03: the lesson - frozen lunge, player damage */
const LUNGE_HIT = 3;
const LungeFX: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const c = plateToLayer('lunge', 560, 205);
  const p = projectPoint(cam, c.x, c.y, 1, PLATE_OVERSCAN);
  const face = plateToLayer('lunge', 427, 233);
  const pf = projectPoint(cam, face.x, face.y, 1, PLATE_OVERSCAN);
  return (
    <>
      <SpeedLines seed="lunge" cx={p.x} cy={p.y} count={130} inner={0.26} opacity={0.6 * (1 - ramp(f, 30, 70))} />
      <Glow x={p.x} y={p.y} r={260 * (1 - ramp(f, LUNGE_HIT, LUNGE_HIT + 14))} color="rgba(255,240,220,1)" opacity={f >= LUNGE_HIT ? 1 : 0} />
      <Burst seed="claw" at={LUNGE_HIT} x={p.x} y={p.y} count={70} kind="spark" colors={['#ffffff', '#ffe7a0', '#c69bff']} speed={[700, 2000]} gravity={1300} drag={2.4} life={[0.25, 0.6]} size={[2, 4]} />
      <Burst seed="clawcloth" at={LUNGE_HIT} x={p.x} y={p.y} count={14} kind="debris" colors={['#1b1b22', '#2c2c36']} speed={[200, 600]} gravity={900} drag={1.4} life={[0.6, 1.1]} size={[6, 12]} />
      <FloatText text="−12" x={pf.x - 40} y={pf.y - 140} at={LUNGE_HIT + 2} color={HUD.warn} size={78} rise={70} dur={50} />
    </>
  );
};

export const S02SH03Lunge: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000', filter: impactFilter(f, [LUNGE_HIT]) }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.5, y: 0.45, zoom: 1.05, rot: 3 },
          { f: 8, x: 0.46, y: 0.38, zoom: 1.24, rot: -2, ease: EASE.snap },
          { f: 150, x: 0.45, y: 0.36, zoom: 1.34, rot: -3.5, ease: EASE.linear },
        ]}
        shakes={[{ from: LUNGE_HIT, to: LUNGE_HIT + 26, amp: 26, freq: 18, rotAmp: 1.2 }]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="lunge" bloom={0.35} />
        </Layer>
        <Layer depth={1.4}>
          <ParticleField seed="lungeleaves" kind="petal" count={26} colors={['#4c9a35', '#2f7a2a', '#ffffff']} size={[6, 11]} vel={{ x: [-500, -900], y: [-80, 60] }} sway={10} />
        </Layer>
        <LungeFX />
      </DioramaCamera>
      <PlayerDamage at={LUNGE_HIT + 1} hpFrom={23} hpTo={11} hpMax={100} />
      <Flash at={LUNGE_HIT + 2} hold={0} outLen={8} max={0.7} color="#ffd0d8" />
      <Subtitles lines={[{ text: '… das System hatte recht.', from: 92, to: 148, thought: true }]} />
      <Post vignette={0.55} grain={0.07} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH04: [AGGRESSIV] + weak point */
export const S02SH04Aggro: React.FC = () => {
  const f = useCurrentFrame();
  const rect = { x: 360, y: 372, w: 1560, h: (1560 * 866) / 2476 };
  const crystal = weaselPoint(rect, WEASEL_POINTS.crystal);
  const alarm = 0.5 + 0.5 * Math.sin(f * 0.3);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera keys={[{ f: 0, x: 0.5, y: 0.5, zoom: 1.0 }, { f: 210, x: 0.47, y: 0.5, zoom: 1.1, ease: EASE.inOut }]} shakes={[{ from: 40, to: 76, amp: 9, freq: 16, rotAmp: 0.4 }]}>
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
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 45%, rgba(${HUD.warnRGB},${0.16 + 0.28 * alarm}) 100%)` }} />
      <TargetLock x={330} y={500} w={560} h={430} at={8}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: 5, color: HUD.text, textShadow: '0 2px 6px #000' }}>SCHATTENWIESEL</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: HUD.warn, textShadow: `0 0 10px ${HUD.warn}` }}>LVL 3</span>
        </div>
        <StatBar label="HP" value={1} from={0} at={10} len={14} color={HUD.warn} rgb={HUD.warnRGB} width={360} suffix="128/128" />
        <div style={{ marginTop: 14 }}>
          <Tag text="[AGGRESSIV]" at={20} size={30} />
        </div>
      </TargetLock>
      <WeakPoint x={crystal.x} y={crystal.y} at={80} side="right" label="SCHWACHSTELLE" sub="Stirnkristall · krit. Schaden ×10" r={44} />
      <SystemWindow x={1180} y={760} w={640} at={124} title="TIPP">
        <div style={{ fontSize: 26, fontWeight: 500 }}>Treffer auf Schwachstellen verursachen kritischen Schaden.</div>
      </SystemWindow>
      <div style={{ position: 'absolute', right: 70, top: 64, fontFamily: FONT_HUD, fontSize: 22, letterSpacing: 6, color: HUD.warn, opacity: ramp(f, 4, 8) * (0.6 + 0.4 * alarm), textShadow: `0 0 10px ${HUD.warn}` }}>
        ▲ FEINDKONTAKT
      </div>
      <Post vignette={0.55} grain={0.07} wash="linear-gradient(180deg, #5a0f22, #10020a)" washOpacity={0.3} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH05: insert - the hand grabs a stone */
const StoneFocus: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const st = plateToLayer('handStone', 560, 513);
  const ps = projectPoint(cam, st.x, st.y, 1, PLATE_OVERSCAN);
  const eyes = plateToLayer('handStone', 933, 227);
  const pe = projectPoint(cam, eyes.x, eyes.y, 1, PLATE_OVERSCAN);
  return (
    <>
      <SpeedLines seed="stone" cx={ps.x} cy={ps.y} count={90} inner={0.32} opacity={0.35 * ramp(f, 4, 10)} color="0,0,0" />
      <Glow x={pe.x} y={pe.y} r={70} color="rgba(255,30,60,1)" opacity={0.55 + 0.25 * Math.sin(f * 0.4)} />
    </>
  );
};

export const S02SH05HandStone: React.FC = () => (
  <DioramaShot id="s02sh05" plate="handStone" keys={[{ f: 0, x: 0.46, y: 0.6, zoom: 1.12 }, { f: 8, x: 0.44, y: 0.62, zoom: 1.24, ease: EASE.snap }, { f: 90, x: 0.43, y: 0.63, zoom: 1.3 }]} bloom={0.2} vignette={0.6}>
    <StoneFocus />
  </DioramaShot>
);
