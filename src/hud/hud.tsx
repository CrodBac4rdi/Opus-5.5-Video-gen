import React from 'react';
import { random, useCurrentFrame } from 'remotion';
import { EASE, blink, clamp, onTwos, ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';

export const HUD = {
  sys: '#5ef2ff',
  sysRGB: '94,242,255',
  warn: '#ff3b5c',
  warnRGB: '255,59,92',
  gold: '#ffd76a',
  goldRGB: '255,215,106',
  violet: '#c08bff',
  violetRGB: '192,139,255',
  text: '#eafcff',
  panel: 'rgba(4, 20, 34, 0.74)',
};

export type HudVariant = 'sys' | 'warn' | 'gold' | 'corrupt';
const VAR = {
  sys: { c: HUD.sys, rgb: HUD.sysRGB, panel: 'rgba(4,22,36,0.76)' },
  warn: { c: HUD.warn, rgb: HUD.warnRGB, panel: 'rgba(40,4,12,0.74)' },
  gold: { c: HUD.gold, rgb: HUD.goldRGB, panel: 'rgba(30,22,4,0.74)' },
  corrupt: { c: HUD.violet, rgb: HUD.violetRGB, panel: 'rgba(22,6,34,0.78)' },
};

/** Glitchy appear: line expands horizontally, then opens vertically, with flicker. */
const useAppear = (at: number, closeAt?: number) => {
  const frame = useCurrentFrame();
  const sx = ramp(frame, at, at + 7, EASE.out);
  const sy = ramp(frame, at + 5, at + 13, EASE.out);
  const flick = frame < at + 16 && random(`fl${at}:${frame}`) < 0.3 ? 0.45 : 1;
  let close = 1;
  if (closeAt !== undefined) close = 1 - ramp(frame, closeAt, closeAt + 8, EASE.in);
  return { sx: sx * (closeAt !== undefined ? Math.max(close, 0.02) : 1), sy: Math.max(sy, 0.02) * close, o: (frame >= at ? 1 : 0) * flick * (close > 0 ? 1 : 0), frame };
};

export const SystemWindow: React.FC<{
  x: number;
  y: number;
  w: number;
  at: number;
  closeAt?: number;
  title?: string;
  variant?: HudVariant;
  scale?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, at, closeAt, title = 'SYSTEM', variant = 'sys', scale = 1, children }) => {
  const { sx, sy, o, frame } = useAppear(at, closeAt);
  if (o <= 0) return null;
  const v = VAR[variant];
  const shimmer = ((frame - at) * 22) % (w * 3);
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div style={{ position: 'absolute', width: 26, height: 26, borderTop: `3px solid ${v.c}`, borderLeft: `3px solid ${v.c}`, transform: `rotate(${rot}deg)`, filter: `drop-shadow(0 0 6px ${v.c})`, ...pos }} />
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        transformOrigin: 'center center',
        transform: `scale(${scale}) scaleX(${sx}) scaleY(${sy})`,
        opacity: o,
        fontFamily: FONT_HUD,
        color: HUD.text,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: `linear-gradient(160deg, ${v.panel}, rgba(2,10,18,0.82))`,
          border: `1.5px solid rgba(${v.rgb},0.85)`,
          boxShadow: `0 0 24px rgba(${v.rgb},0.45), inset 0 0 30px rgba(${v.rgb},0.18)`,
          padding: '18px 28px 22px',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, rgba(${v.rgb},0.06) 0px, rgba(${v.rgb},0.06) 1px, transparent 2px, transparent 4px)` }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: shimmer - w,
            width: w * 0.35,
            background: `linear-gradient(100deg, transparent, rgba(${v.rgb},0.14), transparent)`,
          }}
        />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 12, height: 12, transform: 'rotate(45deg)', background: v.c, boxShadow: `0 0 10px ${v.c}` }} />
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 6, color: v.c, textShadow: `0 0 10px rgba(${v.rgb},0.8)` }}>{title}</div>
          <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, rgba(${v.rgb},0.8), transparent)` }} />
        </div>
        <div style={{ position: 'relative' }}>{children}</div>
      </div>
      {corner({ left: -8, top: -8 }, 0)}
      {corner({ right: -8, top: -8 }, 90)}
      {corner({ right: -8, bottom: -8 }, 180)}
      {corner({ left: -8, bottom: -8 }, 270)}
    </div>
  );
};

/** Typewriter text with block cursor and RGB-split glitch on fresh characters. */
export const Typewriter: React.FC<{ text: string; at: number; cps?: number; style?: React.CSSProperties; cursor?: boolean; color?: string }> = ({
  text,
  at,
  cps = 26,
  style,
  cursor = true,
  color,
}) => {
  const frame = useCurrentFrame();
  const n = clamp(Math.floor(((frame - at) / 30) * cps), 0, text.length);
  const done = n >= text.length;
  return (
    <span style={{ whiteSpace: 'pre', color, ...style }}>
      {text.slice(0, n)}
      {cursor && frame >= at && (!done || blink(frame, 20)) ? <span style={{ opacity: 0.9 }}>▌</span> : null}
    </span>
  );
};

/** HP / mana bar with chip-damage trail and low-value blinking. */
export const StatBar: React.FC<{
  label: string;
  value: number;
  from?: number;
  at: number;
  len?: number;
  color: string;
  rgb: string;
  width?: number;
  blinkLow?: boolean;
  suffix?: string;
}> = ({ label, value, from = 1, at, len = 14, color, rgb, width = 420, blinkLow, suffix }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, at, at + len, EASE.out);
  const cur = from + (value - from) * t;
  const chip = from + (value - from) * ramp(frame, at + len, at + len + 14, EASE.inOut);
  const lit = blinkLow ? (blink(frame, 14, 0.6) ? 1 : 0.45) : 1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT_HUD }}>
      <div style={{ width: 46, fontWeight: 700, fontSize: 22, letterSpacing: 2, color }}>{label}</div>
      <div style={{ position: 'relative', width, height: 16, background: 'rgba(0,0,0,0.55)', border: `1px solid rgba(${rgb},0.6)`, transform: 'skewX(-18deg)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${chip * 100}%`, background: 'rgba(255,255,255,0.55)' }} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${cur * 100}%`,
            background: `linear-gradient(90deg, rgba(${rgb},0.65), ${color})`,
            boxShadow: `0 0 14px ${color}`,
            opacity: lit,
          }}
        />
      </div>
      {suffix ? <div style={{ fontSize: 20, fontWeight: 600, color: HUD.text, minWidth: 90 }}>{suffix}</div> : null}
    </div>
  );
};

/** Target lock brackets that snap onto a box, with name plate. */
export const TargetLock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  color?: string;
  rgb?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at, color = HUD.warn, rgb = HUD.warnRGB, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = ramp(frame, at, at + 10, EASE.snap);
  const pad = (1 - t) * 160;
  const flick = frame < at + 12 && random(`tl${frame}`) < 0.35 ? 0.3 : 1;
  const L = 46;
  const br = (style: React.CSSProperties) => (
    <div style={{ position: 'absolute', width: L, height: L, borderColor: color, borderStyle: 'solid', borderWidth: 0, filter: `drop-shadow(0 0 8px ${color})`, ...style }} />
  );
  const bx = x - pad;
  const by = y - pad;
  const bw = w + pad * 2;
  const bh = h + pad * 2;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: t * flick }}>
      {br({ left: bx, top: by, borderTopWidth: 4, borderLeftWidth: 4 })}
      {br({ left: bx + bw - L, top: by, borderTopWidth: 4, borderRightWidth: 4 })}
      {br({ left: bx, top: by + bh - L, borderBottomWidth: 4, borderLeftWidth: 4 })}
      {br({ left: bx + bw - L, top: by + bh - L, borderBottomWidth: 4, borderRightWidth: 4 })}
      <div style={{ position: 'absolute', left: bx, top: by, width: bw, height: bh, border: `1px dashed rgba(${rgb},0.35)` }} />
      <div style={{ position: 'absolute', left: bx, top: by - 12, transform: 'translateY(-100%)', fontFamily: FONT_HUD }}>{children}</div>
    </div>
  );
};

/** Rotating weak-point reticle with leader line + label. */
export const WeakPoint: React.FC<{ x: number; y: number; at: number; label?: string; sub?: string; r?: number; side?: 'left' | 'right' | 'down' }> = ({
  x,
  y,
  at,
  label = 'SCHWACHSTELLE',
  sub,
  r = 56,
  side = 'left',
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = ramp(frame, at, at + 12, EASE.snap);
  const rot = (frame - at) * 3;
  const pulse = 1 + 0.08 * Math.sin((frame - at) * 0.35);
  const R = r * (2.2 - 1.2 * t) * pulse;
  const col = HUD.gold;
  const lead = ramp(frame, at + 6, at + 16, EASE.out);
  const dirX = side === 'left' ? -1 : side === 'right' ? 1 : -0.3;
  const dirY = side === 'down' ? 1 : -1;
  const lx = x + dirX * 150 * lead;
  const ly = y + dirY * 150 * lead;
  const ex = lx + dirX * 120 * lead;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: t }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(0 0 6px ${col})` }}>
        <g transform={`translate(${x} ${y})`}>
          <circle r={R} fill="none" stroke={col} strokeWidth={3} strokeDasharray="22 12" transform={`rotate(${rot})`} />
          <circle r={R * 0.62} fill="none" stroke={col} strokeWidth={2} strokeDasharray="6 8" transform={`rotate(${-rot * 1.6})`} />
          {[0, 90, 180, 270].map((a) => (
            <line key={a} x1={0} y1={-R - 14} x2={0} y2={-R + 10} stroke={col} strokeWidth={3} transform={`rotate(${a + rot * 0.3})`} />
          ))}
          <circle r={4} fill={col} />
        </g>
        <polyline points={`${x + dirX * R * 0.75},${y + dirY * R * 0.75} ${lx},${ly} ${ex},${ly}`} fill="none" stroke={col} strokeWidth={2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: side === 'left' || side === 'down' ? undefined : ex + 10,
          right: side === 'left' || side === 'down' ? 1920 - ex + 10 : undefined,
          top: ly - 34,
          fontFamily: FONT_HUD,
          textAlign: side === 'right' ? 'left' : 'right',
          opacity: lead,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: 4, color: col, textShadow: `0 0 12px rgba(${HUD.goldRGB},0.9), 0 2px 4px #000` }}>{label}</div>
        {sub ? <div style={{ fontWeight: 500, fontSize: 20, color: HUD.text, textShadow: '0 2px 4px #000' }}>{sub}</div> : null}
      </div>
    </div>
  );
};

/** Pulsing [TAG] chip, e.g. "[AGGRESSIV]". */
export const Tag: React.FC<{ text: string; at: number; color?: string; rgb?: string; size?: number }> = ({ text, at, color = HUD.warn, rgb = HUD.warnRGB, size = 30 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const pop = ramp(frame, at, at + 6, EASE.snap);
  const pulse = 0.65 + 0.35 * Math.abs(Math.sin((frame - at) * 0.22));
  const jitter = frame < at + 10 ? (random(`tg${frame}`) - 0.5) * 10 : 0;
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: FONT_HUD,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 5,
        color: '#fff',
        padding: '4px 16px',
        background: `rgba(${rgb},${0.28 + 0.3 * pulse})`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 ${18 + 22 * pulse}px rgba(${rgb},${pulse})`,
        textShadow: `0 0 10px ${color}, ${jitter * 0.4}px 0 0 rgba(0,255,255,0.6), ${-jitter * 0.4}px 0 0 rgba(255,0,80,0.6)`,
        transform: `scale(${1.6 - 0.6 * pop}) translateX(${jitter}px)`,
        transformOrigin: 'left center',
        opacity: pop,
      }}
    >
      {text}
    </div>
  );
};

/** Floating damage / reward numbers. */
export const FloatText: React.FC<{ text: string; x: number; y: number; at: number; color?: string; size?: number; rise?: number; dur?: number; weight?: number }> = ({
  text,
  x,
  y,
  at,
  color = '#fff',
  size = 64,
  rise = 90,
  dur = 40,
  weight = 700,
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur) return null;
  const t = (frame - at) / dur;
  const pop = ramp(frame, at, at + 5, EASE.snap);
  const o = 1 - ramp(frame, at + dur * 0.7, at + dur);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - rise * EASE.out(t),
        transform: `translate(-50%, -50%) scale(${1.8 - 0.8 * pop})`,
        fontFamily: FONT_HUD,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: 2,
        color,
        opacity: o,
        whiteSpace: 'nowrap',
        textShadow: `0 0 16px ${color}, 0 3px 0 #000, 0 0 3px #000`,
      }}
    >
      {text}
    </div>
  );
};

/** Glitch text: random slices replaced by noise glyphs, used for corrupted data. */
export const GlitchText: React.FC<{ text: string; at: number; intensity?: number; settle?: number; floor?: number; style?: React.CSSProperties }> = ({
  text,
  at,
  intensity = 0.25,
  settle = 14,
  floor = 0.03,
  style,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const amount = Math.max(floor, intensity * (1 - ramp(frame, at, at + settle)));
  const f2 = onTwos(frame);
  const GLY = '#$%&?!@*/\\<>[]{}=+01ΔΣΞ';
  const out = text
    .split('')
    .map((ch, i) => (ch !== ' ' && random(`gt${f2}:${i}`) < amount ? GLY[Math.floor(random(`gc${f2}:${i}`) * GLY.length)] : ch))
    .join('');
  const dx = (random(`gx${f2}`) - 0.5) * 8;
  return (
    <span style={{ textShadow: `${dx}px 0 0 rgba(255,0,90,0.7), ${-dx}px 0 0 rgba(0,240,255,0.7)`, whiteSpace: 'pre', ...style }}>{out}</span>
  );
};
