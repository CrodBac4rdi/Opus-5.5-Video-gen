import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MANIFEST, PLATE_OVERSCAN, SpriteKey, plateToLayer, spriteInfo } from '../assets';
import { DioramaCamera, Layer, Plate, projectPoint, useCam } from '../engine/camera';
import { EASE, ramp } from '../engine/core';
import { Post } from '../fx/overlays';
import { SpeedLines } from '../fx/particles';
import { Subtitles } from '../fx/subtitle';
import { FloatText, HUD, Tag } from '../hud/hud';
import { AttackPrediction, LevelUp, QuestNotice } from '../hud/quest';
import { ImpactBurst, Rect, SpriteImg, Stone, StrikeConfig, StrikeShot, spritePoint } from './combat';
import { DioramaShot } from './DioramaShot';
import { ScanMarker } from './S05_Trail';

/* ------------------------------------------------ goblin placement on the forest road */
// layer px per raw sprite px - both goblins share one scale so they stay proportional
const GOBLIN_SCALE = 0.605;
const goblinRect = (k: SpriteKey, feetRaw: [number, number], bodyU: number, feetV: number): Rect => {
  const s = spriteInfo(k);
  const [x0, y0, x1, y1] = s.rawBox;
  const w = (x1 - x0) * GOBLIN_SCALE;
  const h = (y1 - y0) * GOBLIN_SCALE;
  const feet = plateToLayer('road', feetRaw[0], feetRaw[1]);
  return { x: feet.x - bodyU * w, y: feet.y - feetV * h, w, h };
};
const A_RECT = goblinRect('goblinA', [560, 610], 0.513, 0.985);
// goblin B is drawn looking left - mirrored so it faces Elara at the cart (body centre u 0.41 -> 0.59)
const B_RECT = goblinRect('goblinB', [760, 588], 0.59, 0.978);
const A_GEM = { u: 0.584, v: 0.608 };
const A_HEAD = { u: 0.638, v: 0.36 };
const B_CHEST = { u: 0.409, v: 0.494 };
const ROAD_DEBRIS = ['#8a6a44', '#6b5034', '#a88a5c'];
const ROAD_WASH = 'linear-gradient(180deg, #3a2a10, #0a0604)';

/* ------------------------------------------------ SH01: a stone - [Abgelenkt] */
const D_HIT = 46;
const DistractionFX: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const head = spritePoint(A_RECT, A_HEAD);
  const ph = projectPoint(cam, head.x, head.y, 1, PLATE_OVERSCAN);
  return (
    <>
      <Stone tx={ph.x} ty={ph.y} hit={D_HIT} from={[-120, 260]} startScale={1.1} endScale={0.45} dur={16} />
      <ImpactBurst x={ph.x} y={ph.y} at={D_HIT} seed="bonk" scale={0.35} shardColors={['#9b96a0', '#6f6a72']} />
      <FloatText text="−4" x={ph.x + 60} y={ph.y - 60} at={D_HIT + 2} color="#ffffff" size={60} rise={50} dur={40} />
      <div style={{ position: 'absolute', left: ph.x - 40, top: ph.y - 190, opacity: 1 - ramp(f, 150, 170) }}>
        <Tag text="[ABGELENKT]" at={D_HIT + 8} color={HUD.gold} rgb={HUD.goldRGB} size={28} />
      </div>
    </>
  );
};

export const S06SH01Distraction: React.FC = () => {
  const f = useCurrentFrame();
  const turned = f >= D_HIT + 4;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera
        keys={[
          { f: 0, x: 0.47, y: 0.66, zoom: 1.35 },
          { f: D_HIT, x: 0.45, y: 0.66, zoom: 1.42, ease: EASE.inOut },
          { f: D_HIT + 8, x: 0.43, y: 0.64, zoom: 1.6, ease: EASE.snap },
          { f: 180, x: 0.43, y: 0.64, zoom: 1.68 },
        ]}
        shakes={[{ from: D_HIT, to: D_HIT + 18, amp: 12, freq: 16 }]}
      >
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate="road" bloom={0.3} />
          <SpriteImg sprite="goblinB" rect={B_RECT} flip />
          <SpriteImg sprite="goblinA" rect={A_RECT} flip={turned} hitAt={D_HIT} />
        </Layer>
        <DistractionFX />
      </DioramaCamera>
      <Subtitles lines={[{ text: 'Hey! Hier drüben!', from: 70, to: 150, speaker: 'KAELAN', color: HUD.sys }]} />
      <Post vignette={0.5} grain={0.06} wash={ROAD_WASH} washOpacity={0.15} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ SH02: the spear from the cart */
const SpearFocus: React.FC = () => {
  const cam = useCam();
  const f = useCurrentFrame();
  const tip = plateToLayer('thrust', 1173, 309);
  const p = projectPoint(cam, tip.x, tip.y, 1, PLATE_OVERSCAN);
  return <SpeedLines seed="thrust" cx={p.x} cy={p.y} count={130} inner={0.24} opacity={0.6 * (1 - ramp(f, 40, 100))} />;
};

export const S06SH02Thrust: React.FC = () => (
  <DioramaShot
    id="s06sh02"
    plate="thrust"
    keys={[
      { f: 0, x: 0.48, y: 0.45, zoom: 1.04, rot: 2 },
      { f: 10, x: 0.56, y: 0.4, zoom: 1.2, rot: -2, ease: EASE.snap },
      { f: 120, x: 0.6, y: 0.38, zoom: 1.28, rot: -3, ease: EASE.linear },
    ]}
    shakes={[{ from: 0, to: 14, amp: 16, freq: 18, rotAmp: 0.8 }]}
    bloom={0.4}
    flashIn
  >
    <SpearFocus />
    <ScanMarker plate="thrust" raw={[760, 285]} at={22} label="[EISENSPEER]" sub="Händlerware · ATK +6" side={-1} />
  </DioramaShot>
);

/* ------------------------------------------------ SH03: Goblin B - weak point, data dissolve */
const B_STRIKE: StrikeConfig = {
  plate: 'roadNoSpear',
  sprite: 'goblinB',
  rect: B_RECT,
  flip: true,
  weakPoint: B_CHEST,
  camKeys: [
    { f: 0, x: 0.58, y: 0.64, zoom: 1.85 },
    { f: 14, x: 0.585, y: 0.64, zoom: 1.95, ease: EASE.in },
    { f: 210, x: 0.59, y: 0.62, zoom: 2.12, ease: EASE.inOut },
  ],
  hit: 14,
  projectile: 'spear',
  dissolve: { start: 22, duration: 110, palette: ['#7dffb0', '#5ef2ff', '#d9fbff', '#b57bff'] },
  feet: { x: B_RECT.x + B_RECT.w * 0.59, y: B_RECT.y + B_RECT.h * 0.97 },
  crack: 260,
  name: 'GOBLIN · LVL 5',
  hpMax: 60,
  damage: '−60',
  defeat: { at: 140, closeAt: 200, title: 'KAMPF', line: 'Goblin besiegt.', reward: '+40 EXP' },
  shardColors: ['#b8ffb0', '#7dff9a', '#ffffff'],
  wash: ROAD_WASH,
  debris: ROAD_DEBRIS,
};
export const S06SH03GoblinB: React.FC = () => <StrikeShot c={B_STRIKE} />;

/* ------------------------------------------------ SH04: bullet-time dodge */
const DodgeHUD: React.FC = () => {
  const cam = useCam();
  const sh = plateToLayer('dodge', 827, 353);
  const face = plateToLayer('dodge', 600, 153);
  const c = projectPoint(cam, sh.x, sh.y, 1, PLATE_OVERSCAN);
  const p = projectPoint(cam, face.x, face.y, 1, PLATE_OVERSCAN);
  const r = Math.hypot(p.x - c.x, p.y - c.y);
  const aFace = (Math.atan2(p.y - c.y, p.x - c.x) * 180) / Math.PI;
  return (
    <>
      <AttackPrediction at={10} cx={c.x} cy={c.y} r={r} a0={aFace + 125} a1={aFace - 25} labelX={110} labelY={110} />
      <div style={{ position: 'absolute', left: p.x - 260, top: p.y - 150 }}>
        <Tag text="[AUSGEWICHEN]" at={100} color={HUD.sys} rgb={HUD.sysRGB} size={30} />
      </div>
    </>
  );
};

export const S06SH04Dodge: React.FC = () => (
  <DioramaShot
    id="s06sh04"
    plate="dodge"
    keys={[{ f: 0, x: 0.52, y: 0.42, zoom: 1.3, yaw: 3 }, { f: 180, x: 0.5, y: 0.38, zoom: 1.44, yaw: -3, ease: EASE.linear }]}
    bloom={0.3}
    filter="saturate(0.55) brightness(0.92)"
    ambient={['dust']}
    wash="linear-gradient(180deg, #2a6c8a, #0a1a2a)"
    washOpacity={0.3}
    lines={[{ text: 'Zu langsam.', from: 118, to: 176, speaker: 'KAELAN', color: HUD.sys }]}
  >
    <DodgeHUD />
  </DioramaShot>
);

/* ------------------------------------------------ SH05: counter - Goblin A's gem */
const A_STRIKE: StrikeConfig = {
  plate: 'roadNoSpear',
  sprite: 'goblinA',
  rect: A_RECT,
  flip: true,
  weakPoint: A_GEM,
  camKeys: [
    { f: 0, x: 0.4, y: 0.62, zoom: 1.85 },
    { f: 12, x: 0.4, y: 0.62, zoom: 1.95, ease: EASE.in },
    { f: 150, x: 0.4, y: 0.6, zoom: 2.1, ease: EASE.inOut },
  ],
  hit: 12,
  projectile: 'spear',
  dissolve: { start: 18, duration: 96, palette: ['#ff8fa0', '#5ef2ff', '#ffd76a', '#d9fbff'] },
  feet: { x: A_RECT.x + A_RECT.w * 0.49, y: A_RECT.y + A_RECT.h * 0.98 },
  crack: 280,
  name: 'GOBLIN · LVL 5',
  hpMax: 60,
  damage: '−60',
  defeat: { at: 100, closeAt: 146, title: 'KAMPF BEENDET', line: 'Alle Gegner besiegt.', reward: '+80 EXP' },
  shardColors: ['#ff6b6b', '#ff2a4a', '#ffd0d0'],
  wash: ROAD_WASH,
  debris: ROAD_DEBRIS,
};
export const S06SH05GoblinA: React.FC = () => <StrikeShot c={A_STRIKE} />;

/* ------------------------------------------------ SH06: LEVEL UP */
export const S06SH06LevelUp: React.FC = () => (
  <DioramaShot
    id="s06sh06"
    plate="levelup"
    keys={[{ f: 0, x: 0.5, y: 0.44, zoom: 1.32, pitch: 2 }, { f: 180, x: 0.5, y: 0.4, zoom: 1.1, pitch: 0, ease: EASE.inOut }]}
    bloom={0.5}
    ambient={['gold', 'cyan']}
    wash="linear-gradient(160deg, #ffcf8a, #5ef2ff)"
    washOpacity={0.18}
    overlay={
      <>
        <LevelUp align="left" at={16} from={1} to={3} stats={[['HP', 100, 140], ['MP', 50, 70], ['STR', 8, 12], ['AGI', 9, 14]]} />
        <QuestNotice at={116} closeAt={168} y={860} kind="quest" title="SYSTEM" body="HP vollständig wiederhergestellt" portrait={MANIFEST.ui.portrait} />
      </>
    }
  />
);
