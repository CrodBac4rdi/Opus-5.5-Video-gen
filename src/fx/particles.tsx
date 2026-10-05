import React from 'react';
import { random } from 'remotion';
import { FPS, H, W, clamp, onTwos } from '../engine/core';
import { FrameCanvas, glowSprite } from './canvas';

/* ------------------------------------------------------------------ */
/* Ambient particle field: pollen motes, petals, embers, shadow smoke  */
/* ------------------------------------------------------------------ */
export type FieldKind = 'mote' | 'petal' | 'ember' | 'smoke' | 'cube';

export type FieldProps = {
  seed: string;
  count: number;
  kind: FieldKind;
  colors: string[];
  size: [number, number];
  /** px per second */
  vel: { x: [number, number]; y: [number, number] };
  sway?: number;
  opacity?: [number, number];
  area?: { x: number; y: number; w: number; h: number };
  fadeIn?: [number, number];
  fadeOut?: [number, number];
  resolution?: number;
  /** optional point all particles are pulled towards (0..1 progress) */
  attract?: { x: number; y: number; from: number; to: number };
};

export const ParticleField: React.FC<FieldProps> = (p) => {
  const { seed, count, kind, colors, size, vel, sway = 20, opacity = [0.4, 1], area = { x: -60, y: -60, w: W + 120, h: H + 120 } } = p;
  return (
    <FrameCanvas
      resolution={p.resolution ?? 1}
      draw={(ctx, frame) => {
        const t = frame / FPS;
        let master = 1;
        if (p.fadeIn) master *= clamp((frame - p.fadeIn[0]) / Math.max(1, p.fadeIn[1] - p.fadeIn[0]), 0, 1);
        if (p.fadeOut) master *= 1 - clamp((frame - p.fadeOut[0]) / Math.max(1, p.fadeOut[1] - p.fadeOut[0]), 0, 1);
        if (master <= 0) return;
        ctx.globalCompositeOperation = kind === 'smoke' || kind === 'petal' ? 'source-over' : 'lighter';
        for (let i = 0; i < count; i++) {
          const r = (k: string) => random(`${seed}:${i}:${k}`);
          const vx = vel.x[0] + (vel.x[1] - vel.x[0]) * r('vx');
          const vy = vel.y[0] + (vel.y[1] - vel.y[0]) * r('vy');
          const ph = r('ph') * Math.PI * 2;
          let x = area.x + ((((r('x') * area.w + vx * t + Math.sin(t * (0.6 + r('sf')) + ph) * sway) % area.w) + area.w) % area.w);
          let y = area.y + ((((r('y') * area.h + vy * t + Math.cos(t * (0.5 + r('sf2')) + ph) * sway * 0.6) % area.h) + area.h) % area.h);
          if (p.attract) {
            const k = clamp((frame - p.attract.from - r('ad') * 10) / (p.attract.to - p.attract.from), 0, 1);
            const e = k * k * (3 - 2 * k);
            x += (p.attract.x - x) * e;
            y += (p.attract.y - y) * e;
          }
          const s = size[0] + (size[1] - size[0]) * r('s');
          const col = colors[Math.floor(r('c') * colors.length)];
          let a = (opacity[0] + (opacity[1] - opacity[0]) * r('o')) * master;
          if (kind === 'mote' || kind === 'ember') a *= 0.65 + 0.35 * Math.sin(t * (2 + r('tw') * 3) + ph);
          if (a <= 0.01) continue;
          ctx.globalAlpha = clamp(a, 0, 1);
          if (kind === 'mote' || kind === 'ember') {
            const g = glowSprite(col);
            ctx.drawImage(g, x - s * 2, y - s * 2, s * 4, s * 4);
          } else if (kind === 'petal') {
            const spin = t * (1.5 + r('sp') * 2.5) + ph;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(spin * 0.7);
            ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(spin)));
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (kind === 'smoke') {
            const grad = ctx.createRadialGradient(x, y, 0, x, y, s);
            grad.addColorStop(0, col);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(x - s, y - s, s * 2, s * 2);
          } else {
            ctx.fillStyle = col;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 4 + t * r('rs'));
            ctx.fillRect(-s / 2, -s / 2, s, s);
            ctx.restore();
          }
        }
        ctx.globalAlpha = 1;
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* One-shot burst: sparks (streaks), dust, grass bits, crystal shards  */
/* ------------------------------------------------------------------ */
export type BurstProps = {
  seed: string;
  at: number;
  x: number;
  y: number;
  count: number;
  kind: 'spark' | 'dust' | 'shard' | 'debris';
  colors: string[];
  speed: [number, number];
  /** emission cone in degrees (centre, spread) */
  angle?: [number, number];
  gravity?: number;
  drag?: number;
  life: [number, number];
  size: [number, number];
  resolution?: number;
};

export const Burst: React.FC<BurstProps> = (p) => (
  <FrameCanvas
    resolution={p.resolution ?? 1}
    draw={(ctx, frame) => {
      const age0 = (frame - p.at) / FPS;
      if (age0 < 0) return;
      const [ac, as] = p.angle ?? [0, 360];
      const g = p.gravity ?? 0;
      const drag = p.drag ?? 1.5;
      ctx.globalCompositeOperation = p.kind === 'spark' || p.kind === 'shard' ? 'lighter' : 'source-over';
      for (let i = 0; i < p.count; i++) {
        const r = (k: string) => random(`${p.seed}:${i}:${k}`);
        const life = p.life[0] + (p.life[1] - p.life[0]) * r('l');
        const age = age0 - r('d') * 0.06;
        if (age < 0 || age > life) continue;
        const ang = ((ac + (r('a') - 0.5) * as) * Math.PI) / 180;
        const sp = p.speed[0] + (p.speed[1] - p.speed[0]) * Math.pow(r('s'), 0.7);
        // integrated velocity with exponential drag
        const dist = (sp / drag) * (1 - Math.exp(-drag * age));
        const x = p.x + Math.cos(ang) * dist;
        const y = p.y + Math.sin(ang) * dist + 0.5 * g * age * age;
        const k = 1 - age / life;
        const sz = p.size[0] + (p.size[1] - p.size[0]) * r('z');
        const col = p.colors[Math.floor(r('c') * p.colors.length)];
        ctx.globalAlpha = clamp(k * 1.2, 0, 1);
        if (p.kind === 'spark') {
          const v = sp * Math.exp(-drag * age);
          const len = clamp(v * 0.045, 4, 120) * (0.5 + k);
          const vx = Math.cos(ang) * v;
          const vy = Math.sin(ang) * v + g * age;
          const n = Math.hypot(vx, vy) || 1;
          ctx.strokeStyle = col;
          ctx.lineWidth = sz * k + 0.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - (vx / n) * len, y - (vy / n) * len);
          ctx.stroke();
        } else if (p.kind === 'dust') {
          const rad = sz * (0.6 + (1 - k) * 1.8);
          const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
          grad.addColorStop(0, col);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.globalAlpha = clamp(k * 0.9, 0, 1);
          ctx.fillStyle = grad;
          ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
        } else {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(age * (r('rs') - 0.5) * 20);
          ctx.fillStyle = col;
          ctx.beginPath();
          if (p.kind === 'shard') {
            ctx.moveTo(0, -sz);
            ctx.lineTo(sz * 0.45, sz * 0.6);
            ctx.lineTo(-sz * 0.4, sz * 0.4);
          } else {
            ctx.rect(-sz / 2, -sz / 5, sz, sz / 2.5);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Anime focus / speed lines (re-randomised on twos)                    */
/* ------------------------------------------------------------------ */
export const SpeedLines: React.FC<{
  seed: string;
  cx: number;
  cy: number;
  count?: number;
  inner?: number;
  color?: string;
  opacity?: number;
  mode?: 'radial' | 'horizontal';
  thickness?: number;
}> = ({ seed, cx, cy, count = 110, inner = 0.42, color = '255,255,255', opacity = 0.8, mode = 'radial', thickness = 1 }) => (
  <FrameCanvas
    draw={(ctx, frame) => {
      if (opacity <= 0) return;
      const f2 = onTwos(frame);
      const R = Math.hypot(W, H);
      for (let i = 0; i < count; i++) {
        const r = (k: string) => random(`${seed}:${f2}:${i}:${k}`);
        const a = r('a') * Math.PI * 2;
        const alpha = opacity * (0.25 + 0.75 * r('o'));
        ctx.fillStyle = `rgba(${color},${alpha})`;
        if (mode === 'radial') {
          const r0 = R * (inner + r('r') * 0.22);
          const w = (2 + r('w') * 10) * thickness;
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          ctx.beginPath();
          ctx.moveTo(cx + ca * r0, cy + sa * r0);
          ctx.lineTo(cx + ca * R - sa * w, cy + sa * R + ca * w);
          ctx.lineTo(cx + ca * R + sa * w, cy + sa * R - ca * w);
          ctx.closePath();
          ctx.fill();
        } else {
          const y = r('y') * H;
          const len = W * (0.25 + r('l') * 0.6);
          const x = r('x') * W * 1.4 - W * 0.2;
          const h = (1 + r('w') * 4) * thickness;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + len, y - h / 2);
          ctx.lineTo(x + len, y + h / 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Procedural foreground grass (wind sway, out-of-focus parallax layer) */
/* ------------------------------------------------------------------ */
export const GrassForeground: React.FC<{ seed: string; count?: number; baseY?: number; height?: [number, number]; color?: string[]; wind?: number; blur?: number }> = ({
  seed,
  count = 70,
  baseY = H + 40,
  height = [140, 420],
  color = ['#0b2414', '#123a1c', '#0f2f18', '#1a4a22'],
  wind = 1,
  blur = 3,
}) => (
  <FrameCanvas
    style={{ filter: `blur(${blur}px)` }}
    draw={(ctx, frame) => {
      const t = frame / FPS;
      for (let i = 0; i < count; i++) {
        const r = (k: string) => random(`${seed}:${i}:${k}`);
        // denser at the edges, open in the centre
        const side = r('side') < 0.5 ? 0 : 1;
        const xn = side === 0 ? Math.pow(r('x'), 1.6) * 0.42 : 1 - Math.pow(r('x'), 1.6) * 0.42;
        const x = -80 + xn * (W + 160);
        const h = height[0] + (height[1] - height[0]) * r('h');
        const w = 6 + r('w') * 14;
        const lean = (r('lean') - 0.5) * 0.6 + (side === 0 ? -0.15 : 0.15);
        const sway = Math.sin(t * (1.4 + r('sf') * 1.2) + r('ph') * 6 + x * 0.004) * 0.12 * wind + Math.sin(t * 0.7 + x * 0.002) * 0.08 * wind;
        const bend = lean + sway;
        const tipX = x + Math.sin(bend) * h;
        const tipY = baseY - Math.cos(bend) * h;
        const cxp = x + Math.sin(bend * 0.5) * h * 0.55;
        const cyp = baseY - h * 0.6;
        ctx.fillStyle = color[Math.floor(r('c') * color.length)];
        ctx.beginPath();
        ctx.moveTo(x - w / 2, baseY);
        ctx.quadraticCurveTo(cxp - w * 0.3, cyp, tipX, tipY);
        ctx.quadraticCurveTo(cxp + w * 0.3, cyp, x + w / 2, baseY);
        ctx.closePath();
        ctx.fill();
      }
    }}
  />
);
