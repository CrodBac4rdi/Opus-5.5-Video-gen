import React from 'react';
import { useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, PlateKey, plateToLayer } from '../assets';
import { projectPoint, useCam } from '../engine/camera';
import { EASE, ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';
import { HUD, Tag, TargetLock } from '../hud/hud';
import { ChoicePrompt } from '../hud/quest';
import { DioramaShot } from './DioramaShot';

/** A small cyan Analyse marker (ring + label) pinned to a raw point of the plate. */
export const ScanMarker: React.FC<{ plate: PlateKey; raw: [number, number]; at: number; label: string; sub?: string; side?: 1 | -1; color?: string; rgb?: string }> = ({
  plate,
  raw,
  at,
  label,
  sub,
  side = 1,
  color = HUD.sys,
  rgb = HUD.sysRGB,
}) => {
  const cam = useCam();
  const f = useCurrentFrame();
  if (f < at) return null;
  const l = plateToLayer(plate, raw[0], raw[1]);
  const p = projectPoint(cam, l.x, l.y, 1, PLATE_OVERSCAN);
  const t = ramp(f, at, at + 10, EASE.snap);
  const r = 34 + (1 - t) * 60;
  const lead = ramp(f, at + 6, at + 16, EASE.out);
  const lx = p.x + side * 110 * lead;
  const ly = p.y - 90 * lead;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: t }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', overflow: 'visible', filter: `drop-shadow(0 0 6px ${color})` }}>
        <circle cx={p.x} cy={p.y} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray="14 8" transform={`rotate(${f * 2} ${p.x} ${p.y})`} />
        <circle cx={p.x} cy={p.y} r={4} fill={color} />
        <polyline points={`${p.x + side * r * 0.7},${p.y - r * 0.7} ${lx},${ly} ${lx + side * 60},${ly}`} fill="none" stroke={color} strokeWidth={2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: side > 0 ? lx + 70 : undefined,
          right: side < 0 ? 1920 - (lx - 70) : undefined,
          top: ly - 22,
          fontFamily: FONT_HUD,
          whiteSpace: 'nowrap',
          opacity: lead,
          padding: '6px 14px',
          background: 'rgba(2,14,24,0.72)',
          border: `1px solid rgba(${rgb},0.7)`,
          textAlign: side > 0 ? 'left' : 'right',
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 3, color }}>{label}</div>
        {sub ? <div style={{ fontSize: 19, color: HUD.text }}>{sub}</div> : null}
      </div>
    </div>
  );
};

/* ------------------------------------------------ SH01: fresh tracks */
export const S05SH01Tracks: React.FC = () => (
  <DioramaShot
    id="s05sh01"
    plate="tracks"
    keys={[{ f: 0, x: 0.5, y: 0.66, zoom: 1.18 }, { f: 150, x: 0.5, y: 0.55, zoom: 1.36, ease: EASE.inOut }]}
    bloom={0.35}
    ambient={['dust', 'leaves']}
    rays={{ raw: [560, 100], opacity: 0.35, color: '255,236,180' }}
    lines={[{ text: 'Spuren … ganz frisch.', from: 8, to: 54, thought: true }]}
  >
    <ScanMarker plate="tracks" raw={[500, 650]} at={58} label="[GOBLIN-SPUREN]" sub="frisch · 2 Individuen" />
    <ScanMarker plate="tracks" raw={[987, 503]} at={94} label="[STOFFFETZEN]" sub="Reiseumhang · Händlerware" side={-1} />
  </DioramaShot>
);

/* ------------------------------------------------ SH02: an overturned cart, a scream */
export const S05SH02RoadScream: React.FC = () => (
  <DioramaShot
    id="s05sh02"
    plate="road"
    keys={[{ f: 0, x: 0.38, y: 0.55, zoom: 1.32 }, { f: 150, x: 0.62, y: 0.56, zoom: 1.34, ease: EASE.inOut }]}
    shakes={[{ from: 30, to: 50, amp: 6, freq: 14 }]}
    bloom={0.35}
    ambient={['dust']}
    rays={{ raw: [640, 120], opacity: 0.35, color: '255,236,180' }}
    lines={[{ text: 'Hilfe! Bitte … lasst mich in Ruhe!', from: 30, to: 140, speaker: '???', color: '#9be7a0' }]}
  >
    <ScanMarker plate="road" raw={[990, 460]} at={74} label="[HÄNDLERKARREN]" sub="umgestürzt · Ladung verstreut" side={-1} />
  </DioramaShot>
);

/* ------------------------------------------------ SH03: Elara threatened by two goblins */
const ThreatHUD: React.FC = () => {
  const cam = useCam();
  const box = (x0: number, y0: number, x1: number, y1: number) => {
    const a = plateToLayer('threatened', x0, y0);
    const b = plateToLayer('threatened', x1, y1);
    const pa = projectPoint(cam, a.x, a.y, 1, PLATE_OVERSCAN);
    const pb = projectPoint(cam, b.x, b.y, 1, PLATE_OVERSCAN);
    return { x: pa.x, y: pa.y, w: pb.x - pa.x, h: pb.y - pa.y };
  };
  const g1 = box(170, 230, 470, 760);
  const g2 = box(470, 350, 710, 570);
  const el = box(860, 110, 1150, 640);
  const name = (n: string, lvl: string, col: string) => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
      <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, color: HUD.text, textShadow: '0 2px 6px #000' }}>{n}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: col }}>{lvl}</span>
    </div>
  );
  return (
    <>
      <TargetLock {...g1} at={50}>
        {name('GOBLIN', 'LVL 5', HUD.warn)}
        <div style={{ marginTop: 6 }}>
          <Tag text="[FEINDSELIG]" at={58} size={22} />
        </div>
      </TargetLock>
      <TargetLock {...g2} at={64}>
        {name('GOBLIN', 'LVL 5', HUD.warn)}
      </TargetLock>
      <TargetLock {...el} at={104} color="#7dffb0" rgb="125,255,176" labelPos="left">
        {name('ELARA', 'LVL 2', '#7dffb0')}
        <div style={{ fontSize: 20, color: HUD.text }}>Händlerin · NPC</div>
      </TargetLock>
    </>
  );
};

export const S05SH03Threatened: React.FC = () => (
  <DioramaShot
    id="s05sh03"
    plate="threatened"
    keys={[{ f: 0, x: 0.5, y: 0.5, zoom: 1.1, yaw: 2 }, { f: 240, x: 0.55, y: 0.48, zoom: 1.22, yaw: -1, ease: EASE.inOut }]}
    bloom={0.3}
    ambient={['dust']}
    lines={[{ text: 'Bitte … nicht!', from: 150, to: 230, speaker: 'ELARA', color: '#9be7a0' }]}
    wash="linear-gradient(180deg, #5a2a10, #12060a)"
    washOpacity={0.22}
  >
    <ThreatHUD />
  </DioramaShot>
);

/* ------------------------------------------------ SH04: [Eingreifen?] */
export const S05SH04Choice: React.FC = () => (
  <DioramaShot
    id="s05sh04"
    plate="bushes"
    keys={[{ f: 0, x: 0.6, y: 0.42, zoom: 1.15 }, { f: 270, x: 0.6, y: 0.33, zoom: 1.45, ease: EASE.inOut }]}
    bloom={0.35}
    ambient={['dust']}
    rays={{ raw: [120, 80], opacity: 0.4, color: '255,236,180' }}
    lines={[
      { text: 'Level 1 gegen zwei Goblins …', from: 120, to: 176, thought: true },
      { text: '… aber ich kenne ihre Schwachstellen.', from: 180, to: 262, thought: true },
    ]}
    overlay={
      <ChoicePrompt
        x={1060}
        y={250}
        w={760}
        at={40}
        title="QUEST"
        question="[Eingreifen?]"
        detail={
          <span>
            Gegner: 2× Goblin <span style={{ color: HUD.warn }}>(LVL 5)</span> · Dein Level: <span style={{ color: HUD.warn }}>1</span>
          </span>
        }
        options={['JA', 'NEIN']}
        selectAt={236}
      />
    }
  />
);
