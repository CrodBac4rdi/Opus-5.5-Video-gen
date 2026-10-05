import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { EASE, H, W, onTwos, ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';
import { Flash, Post } from '../fx/overlays';
import { GlitchText, HUD, Typewriter } from '../hud/hud';

/** ECG trace: two heartbeats, then the flatline. x position of the pen over time. */
const penX = (f: number) => 260 + (f - 2) * 26;
const BEAT1 = penX(9);
const BEAT2 = penX(37);

const ecgY = (x: number) => {
  const beat = (bx: number) => {
    const d = x - bx;
    if (d < -60 || d > 90) return 0;
    if (d < -30) return -14 * Math.sin(((d + 60) / 30) * Math.PI); // P wave
    if (d < -12) return 0;
    if (d < -4) return 26 * ((d + 12) / 8); // Q
    if (d < 6) return 26 - 236 * ((d + 4) / 10); // R up
    if (d < 16) return -210 + 290 * ((d - 6) / 10); // S down
    if (d < 26) return 80 - 80 * ((d - 16) / 10);
    if (d < 40) return 0;
    return -24 * Math.sin(((d - 40) / 50) * Math.PI); // T wave
  };
  return beat(BEAT1) + beat(BEAT2);
};

export const S00ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const head = Math.min(penX(f), 1800);
  const flat = f >= 44;
  const ecgFade = 1 - ramp(f, 62, 72);
  const col = flat ? HUD.warn : '#5effc8';
  const pts: string[] = [];
  for (let x = 120; x <= head; x += 4) pts.push(`${x},${H / 2 + ecgY(x)}`);
  const jitter = f >= 56 && f < 66 && random(`co${onTwos(f)}`) < 0.5 ? (random(`cj${f}`) - 0.5) * 30 : 0;
  const pct = Math.round(ramp(f, 72, 87, EASE.inOut) * 100);

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, #04141c 0%, #000 70%)', fontFamily: FONT_HUD }}>
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(0deg, rgba(94,242,255,0.04) 0 1px, transparent 2px 4px)' }} />
      <svg width={W} height={H} style={{ position: 'absolute', opacity: ecgFade, filter: `drop-shadow(0 0 8px ${col}) drop-shadow(0 0 22px ${col})`, transform: `translateX(${jitter}px)` }}>
        <line x1={120} x2={1800} y1={H / 2} y2={H / 2} stroke="rgba(94,242,255,0.08)" strokeWidth={1} />
        <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={head} cy={H / 2 + ecgY(head)} r={7} fill="#fff" />
      </svg>
      {f >= 48 && f < 66 ? (
        <div style={{ position: 'absolute', top: 330, width: '100%', textAlign: 'center', transform: `translateX(${jitter}px)` }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: 18, color: HUD.warn, textShadow: `0 0 26px ${HUD.warn}` }}>
            <GlitchText text="SIGNAL VERLOREN" at={48} intensity={f < 54 ? 0.5 : 0.12} />
          </div>
          <div style={{ marginTop: 300, fontSize: 28, letterSpacing: 8, color: 'rgba(255,90,110,0.9)' }}>VITALZEICHEN: 0</div>
        </div>
      ) : null}
      {f >= 67 ? (
        <div style={{ position: 'absolute', top: 400, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 10, color: HUD.sys, textShadow: `0 0 14px ${HUD.sys}` }}>
            <Typewriter text="[SYSTEM]  NEUE SEELE ERKANNT" at={67} cps={60} cursor={false} />
          </div>
          <div style={{ fontSize: 24, letterSpacing: 6, color: HUD.text, opacity: ramp(f, 70, 74) }}>ÜBERTRAGUNG NACH AETHELGARD … {pct}%</div>
          <div style={{ width: 760, height: 10, border: `1px solid rgba(${HUD.sysRGB},0.7)`, opacity: ramp(f, 70, 74) }}>
            <div style={{ width: `${pct}%`, height: '100%', background: HUD.sys, boxShadow: `0 0 18px ${HUD.sys}` }} />
          </div>
        </div>
      ) : null}
      <Flash at={90} inLen={9} color="#ffffff" />
      <Post vignette={0.7} grain={0.09} />
    </AbsoluteFill>
  );
};
