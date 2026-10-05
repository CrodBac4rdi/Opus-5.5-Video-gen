import React from 'react';
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion';
import { EASE, H, W, blink, ramp } from '../engine/core';
import { FONT_HUD, FONT_TITLE } from '../engine/fonts';
import { HUD, SystemWindow, Typewriter } from './hud';

/** Quest decision: "[Eingreifen?]" with JA / NEIN and a selection cursor that lands on `selectAt`. */
export const ChoicePrompt: React.FC<{
  x: number;
  y: number;
  w: number;
  at: number;
  title: string;
  question: string;
  detail?: React.ReactNode;
  options: [string, string];
  /** frame at which the cursor moves to option 0 and confirms */
  selectAt: number;
}> = ({ x, y, w, at, title, question, detail, options, selectAt }) => {
  const f = useCurrentFrame();
  // cursor hesitates between the options, then commits
  const hover = f < selectAt - 40 ? 1 : f < selectAt - 20 ? (blink(f, 10) ? 1 : 0) : 0;
  const confirmed = f >= selectAt;
  const pulse = confirmed ? 1 - ramp(f, selectAt, selectAt + 18) : 0;
  return (
    <SystemWindow x={x} y={y} w={w} at={at} title={title} variant="gold">
      <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 2, color: '#fff7dc', textShadow: `0 0 18px rgba(${HUD.goldRGB},0.8)` }}>
        <Typewriter text={question} at={at + 12} cps={18} />
      </div>
      {detail ? <div style={{ marginTop: 10, fontSize: 22, color: HUD.text, opacity: ramp(f, at + 36, at + 44) }}>{detail}</div> : null}
      <div style={{ display: 'flex', gap: 26, marginTop: 22, opacity: ramp(f, at + 46, at + 54) }}>
        {options.map((o, i) => {
          const active = i === (confirmed ? 0 : hover);
          return (
            <div
              key={o}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px 0',
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 8,
                color: active ? '#1a1204' : HUD.text,
                background: active ? `rgba(${HUD.goldRGB},${0.85 + 0.15 * pulse})` : 'rgba(0,0,0,0.35)',
                border: `2px solid ${active ? HUD.gold : `rgba(${HUD.goldRGB},0.45)`}`,
                boxShadow: active ? `0 0 ${18 + 40 * pulse}px rgba(${HUD.goldRGB},0.9)` : 'none',
                transform: `scale(${active && confirmed ? 1 + 0.12 * pulse : 1})`,
              }}
            >
              {active ? '▶ ' : ''}
              {o}
            </div>
          );
        })}
      </div>
    </SystemWindow>
  );
};

/** Slide-in notification for quests and relationship changes. */
export const QuestNotice: React.FC<{
  at: number;
  closeAt?: number;
  y?: number;
  kind: 'quest' | 'relation';
  title: string;
  body: React.ReactNode;
  portrait?: string;
}> = ({ at, closeAt, y = 120, kind, title, body, portrait }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const inn = ramp(f, at, at + 14, EASE.out);
  const out = closeAt !== undefined ? ramp(f, closeAt, closeAt + 12, EASE.in) : 0;
  const x = W - 80 - 640 + (1 - inn) * 700 + out * 700;
  const col = kind === 'quest' ? HUD.gold : '#ff9ec7';
  const rgb = kind === 'quest' ? HUD.goldRGB : '255,158,199';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 640,
        display: 'flex',
        gap: 18,
        alignItems: 'center',
        padding: '16px 22px',
        fontFamily: FONT_HUD,
        color: HUD.text,
        background: 'linear-gradient(100deg, rgba(14,10,4,0.86), rgba(4,12,20,0.8))',
        borderLeft: `5px solid ${col}`,
        boxShadow: `0 0 26px rgba(${rgb},0.45)`,
        opacity: 1 - out,
      }}
    >
      {portrait ? (
        <Img src={staticFile(portrait)} style={{ width: 86, height: 86, objectFit: 'cover', border: `2px solid ${col}`, borderRadius: kind === 'relation' ? '50%' : 0 }} />
      ) : (
        <div style={{ width: 70, height: 70, display: 'grid', placeItems: 'center', fontSize: 44, color: col, border: `2px solid ${col}`, transform: 'rotate(45deg)' }}>
          <span style={{ transform: 'rotate(-45deg)' }}>!</span>
        </div>
      )}
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 6, color: col }}>{title}</div>
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 4 }}>{body}</div>
      </div>
    </div>
  );
};

/** Big LEVEL UP banner with stat increases ticking in. */
export const LevelUp: React.FC<{ at: number; from: number; to: number; stats: [string, number, number][]; align?: 'center' | 'left' }> = ({ at, from, to, stats, align = 'center' }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const pop = ramp(f, at, at + 10, EASE.snap);
  const sweep = ramp(f, at + 4, at + 30, EASE.inOut);
  const lvl = f < at + 24 ? from : f < at + 34 ? from + 1 : to;
  return (
    <AbsoluteFill style={align === 'left' ? { alignItems: 'flex-start', paddingTop: 170, paddingLeft: 110, fontFamily: FONT_HUD } : { alignItems: 'center', paddingTop: 110, fontFamily: FONT_HUD }}>
      <div
        style={{
          fontFamily: FONT_TITLE,
          fontWeight: 800,
          fontSize: align === 'left' ? 100 : 120,
          letterSpacing: 10,
          transform: `scale(${1.6 - 0.6 * pop})`,
          opacity: pop,
          backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep * 140 - 30}%, rgba(255,255,255,1) ${sweep * 140 - 15}%, rgba(255,255,255,0) ${sweep * 140}%), linear-gradient(180deg, #fff6c8, #ffc34a 60%, #c07a12)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          filter: 'drop-shadow(0 0 22px rgba(255,190,80,0.8))',
        }}
      >
        LEVEL UP!
      </div>
      <div style={{ fontSize: 52, fontWeight: 700, color: '#fff', letterSpacing: 6, marginTop: 6, opacity: ramp(f, at + 12, at + 18), textShadow: `0 0 18px ${HUD.gold}` }}>
        LVL {from} <span style={{ color: HUD.gold }}>→</span> {lvl}
      </div>
      <div style={{ display: 'flex', gap: 40, marginTop: 26 }}>
        {stats.map(([name, a, b], i) => {
          const t = ramp(f, at + 40 + i * 8, at + 56 + i * 8, EASE.out);
          return (
            <div key={name} style={{ textAlign: 'center', opacity: ramp(f, at + 36 + i * 8, at + 42 + i * 8), padding: '10px 22px', background: 'rgba(0,0,0,0.45)', border: `1px solid rgba(${HUD.goldRGB},0.6)` }}>
              <div style={{ fontSize: 20, letterSpacing: 6, color: HUD.gold }}>{name}</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: '#fff' }}>{Math.round(a + (b - a) * t)}</div>
              <div style={{ fontSize: 18, color: '#9dffb0' }}>+{b - a}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Analyse attack prediction: red danger arc + "AUSWEICHEN" prompt. */
export const AttackPrediction: React.FC<{ at: number; cx: number; cy: number; r: number; a0: number; a1: number; label?: string; labelX: number; labelY: number }> = ({
  at,
  cx,
  cy,
  r,
  a0,
  a1,
  label = 'ANGRIFFSBAHN ERKANNT',
  labelX,
  labelY,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const grow = ramp(f, at, at + 14, EASE.out);
  const aEnd = a0 + (a1 - a0) * grow;
  const pt = (a: number, rr: number) => `${cx + Math.cos((a * Math.PI) / 180) * rr},${cy + Math.sin((a * Math.PI) / 180) * rr}`;
  const band = 46;
  const outer: string[] = [];
  const inner: string[] = [];
  const step = a1 >= a0 ? 2 : -2;
  for (let a = a0; step > 0 ? a <= aEnd : a >= aEnd; a += step) {
    outer.push(pt(a, r + band / 2));
    inner.unshift(pt(a, r - band / 2));
  }
  const stripes = `repeating-linear-gradient(45deg, rgba(${HUD.warnRGB},0.55) 0 14px, rgba(${HUD.warnRGB},0.15) 14px 28px)`;
  const head = pt(aEnd, r);
  const [hx, hy] = head.split(',').map(Number);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', filter: `drop-shadow(0 0 10px ${HUD.warn})` }}>
        <defs>
          <pattern id="dangerStripe" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="28" fill={`rgba(${HUD.warnRGB},0.55)`} />
          </pattern>
        </defs>
        {outer.length > 1 ? <polygon points={[...outer, ...inner].join(' ')} fill="url(#dangerStripe)" stroke={HUD.warn} strokeWidth={3} /> : null}
        <circle cx={hx} cy={hy} r={16} fill={HUD.warn} opacity={blink(f, 8) ? 1 : 0.4} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: labelX,
          top: labelY,
          fontFamily: FONT_HUD,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 6,
          color: '#fff',
          padding: '6px 16px',
          background: stripes,
          border: `2px solid ${HUD.warn}`,
          opacity: ramp(f, at + 6, at + 10),
          textShadow: '0 2px 4px #000',
        }}
      >
        ⚠ {label}
      </div>
    </AbsoluteFill>
  );
};

/** Player takes damage: red edge pulse, shaking HP bar and a damage number (no blood - doctrine). */
export const PlayerDamage: React.FC<{ at: number; hpFrom: number; hpTo: number; hpMax: number; x?: number; y?: number }> = ({ at, hpFrom, hpTo, hpMax, x = 80, y = 80 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const edge = 1 - ramp(f, at, at + 40);
  const pulse = 0.5 + 0.5 * Math.sin((f - at) * 0.5);
  const t = ramp(f, at + 2, at + 14, EASE.out);
  const hp = Math.round(hpFrom + (hpTo - hpFrom) * t);
  const shake = f < at + 14 ? (random(`pd${f}`) - 0.5) * 18 : 0;
  const lowBlink = hp / hpMax < 0.2 && blink(f, 12) ? 0.45 : 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 40%, rgba(${HUD.warnRGB},${0.25 + 0.45 * edge * pulse}) 100%)` }} />
      <div style={{ position: 'absolute', left: x + shake, top: y, fontFamily: FONT_HUD, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: HUD.warn, letterSpacing: 3 }}>HP</div>
        <div style={{ width: 380, height: 18, border: `1px solid rgba(${HUD.warnRGB},0.8)`, background: 'rgba(0,0,0,0.6)', transform: 'skewX(-18deg)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${(hpFrom / hpMax) * 100 * (1 - ramp(f, at + 14, at + 30)) + (hp / hpMax) * 100 * ramp(f, at + 14, at + 30)}%`, background: 'rgba(255,255,255,0.6)' }} />
          <div style={{ position: 'absolute', inset: 0, width: `${(hp / hpMax) * 100}%`, background: `linear-gradient(90deg, rgba(${HUD.warnRGB},0.6), ${HUD.warn})`, boxShadow: `0 0 14px ${HUD.warn}`, opacity: lowBlink }} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, color: '#fff' }}>
          {hp}/{hpMax}
        </div>
      </div>
    </AbsoluteFill>
  );
};
