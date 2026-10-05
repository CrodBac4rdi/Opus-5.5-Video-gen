import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, random, staticFile } from 'remotion';
import { FPS, clamp, onTwos } from '../engine/core';
import { FrameCanvas, glowSprite, hexToRgb } from './canvas';

/**
 * "Data-Aufloesung" - the Aethelgard combat doctrine's no-gore defeat effect.
 *
 * The keyed sprite (alpha PNG) is sampled into a grid of data cells. A
 * dissolve front travels outward from `origin` (the impact point). Cells
 * glow white-cyan just before they go, are punched out of the sprite and
 * fly off as additive data cubes / binary glyphs that drift upward.
 * Everything is a pure function of the frame number -> deterministic renders.
 */
export type DataDissolveProps = {
  src: string;
  rect: { x: number; y: number; w: number; h: number };
  start: number;
  duration: number;
  origin: { u: number; v: number };
  cell?: number;
  palette?: string[];
  edgeColor?: string;
  seed?: string;
  resolution?: number;
  hitFlash?: { at: number; len: number };
  /** global brightness/darkening of the intact sprite, 0..1 multiplier */
  shade?: number;
  life?: [number, number];
  glitch?: boolean;
};

type Cell = { cx: number; cy: number; r: number; g: number; b: number; td: number; life: number; r1: number; r2: number; r3: number; r4: number; glyph: string | null };
type Prepared = { sprite: HTMLCanvasElement; tmp: HTMLCanvasElement; cells: Cell[] };

export const DataDissolve: React.FC<DataDissolveProps> = ({
  src,
  rect,
  start,
  duration,
  origin,
  cell = 7,
  palette = ['#5ef2ff', '#9fe8ff', '#b57bff', '#ffffff'],
  edgeColor = '#d8fbff',
  seed = 'dd',
  resolution = 1.6,
  hitFlash,
  shade = 1,
  life = [0.9, 2.2],
  glitch = true,
}) => {
  const [prep, setPrep] = useState<Prepared | null>(null);
  const [handle] = useState(() => delayRender(`DataDissolve ${src}`));

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const cw = Math.round(rect.w * resolution);
      const ch = Math.round(rect.h * resolution);
      const sprite = document.createElement('canvas');
      sprite.width = cw;
      sprite.height = ch;
      const g = sprite.getContext('2d', { willReadFrequently: true })!;
      g.imageSmoothingQuality = 'high';
      g.drawImage(img, 0, 0, cw, ch);
      const px = g.getImageData(0, 0, cw, ch).data;
      const tmp = document.createElement('canvas');
      tmp.width = cw;
      tmp.height = ch;

      const cells: Cell[] = [];
      const nx = Math.ceil(rect.w / cell);
      const ny = Math.ceil(rect.h / cell);
      const ox = origin.u * rect.w;
      const oy = origin.v * rect.h;
      const maxD = Math.max(Math.hypot(ox, oy), Math.hypot(rect.w - ox, oy), Math.hypot(ox, rect.h - oy), Math.hypot(rect.w - ox, rect.h - oy));
      for (let iy = 0; iy < ny; iy++) {
        for (let ix = 0; ix < nx; ix++) {
          let sr = 0, sg = 0, sb = 0, sa = 0, n = 0, no = 0;
          const x0 = Math.floor(ix * cell * resolution);
          const y0 = Math.floor(iy * cell * resolution);
          const x1 = Math.min(cw, Math.floor((ix + 1) * cell * resolution));
          const y1 = Math.min(ch, Math.floor((iy + 1) * cell * resolution));
          for (let y = y0; y < y1; y += 2) {
            for (let x = x0; x < x1; x += 2) {
              const i = (y * cw + x) * 4;
              const a = px[i + 3];
              sa += a;
              if (a > 20) {
                sr += px[i];
                sg += px[i + 1];
                sb += px[i + 2];
                no++;
              }
              n++;
            }
          }
          const cov = n ? sa / (n * 255) : 0;
          if (cov < 0.22) continue;
          const opaque = Math.max(1, no);
          const cx = (ix + 0.5) * cell;
          const cy = (iy + 0.5) * cell;
          const id = `${seed}:${ix}:${iy}`;
          const r1 = random(`${id}:1`);
          const d = Math.hypot(cx - ox, cy - oy) / maxD;
          const td = start + Math.pow(d, 0.8) * duration * 0.72 + r1 * duration * 0.28;
          const r4 = random(`${id}:4`);
          cells.push({
            cx,
            cy,
            r: sr / opaque,
            g: sg / opaque,
            b: sb / opaque,
            td,
            life: life[0] + (life[1] - life[0]) * random(`${id}:l`),
            r1,
            r2: random(`${id}:2`),
            r3: random(`${id}:3`),
            r4,
            glyph: r4 > 0.93 ? (r4 > 0.965 ? '1' : '0') : null,
          });
        }
      }
      setPrep({ sprite, tmp, cells });
      continueRender(handle);
    };
    img.onerror = (e) => {
      console.error('DataDissolve: could not load', src, e);
      continueRender(handle);
    };
    img.src = staticFile(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pal = palette.map(hexToRgb);
  const edge = hexToRgb(edgeColor);

  return (
    <FrameCanvas
      resolution={resolution}
      draw={(ctx, frame) => {
        if (!prep) return;
        const { sprite, tmp, cells } = prep;
        const tg = tmp.getContext('2d')!;
        tg.setTransform(1, 0, 0, 1, 0, 0);
        tg.globalCompositeOperation = 'source-over';
        tg.clearRect(0, 0, tmp.width, tmp.height);
        tg.drawImage(sprite, 0, 0);
        if (shade < 1) {
          tg.globalCompositeOperation = 'source-atop';
          tg.fillStyle = `rgba(0,0,0,${1 - shade})`;
          tg.fillRect(0, 0, tmp.width, tmp.height);
        }
        if (hitFlash && frame >= hitFlash.at && frame < hitFlash.at + hitFlash.len) {
          const k = 1 - (frame - hitFlash.at) / hitFlash.len;
          tg.globalCompositeOperation = 'source-atop';
          tg.fillStyle = `rgba(255,255,255,${0.95 * k})`;
          tg.fillRect(0, 0, tmp.width, tmp.height);
        }
        // punch dissolved cells out of the intact sprite
        tg.globalCompositeOperation = 'destination-out';
        tg.fillStyle = '#000';
        const s = cell * resolution;
        for (const c of cells) {
          if (frame >= c.td) tg.fillRect((c.cx - cell / 2) * resolution - 0.5, (c.cy - cell / 2) * resolution - 0.5, s + 1, s + 1);
        }

        // draw sprite, glitch-sliced while the front is travelling
        const glitching = glitch && frame >= start && frame < start + duration * 0.7 && random(`${seed}:g:${onTwos(frame)}`) < 0.55;
        if (glitching) {
          const bands = 7;
          for (let i = 0; i < bands; i++) {
            const r = random(`${seed}:b:${onTwos(frame)}:${i}`);
            const y0 = (i / bands) * rect.h;
            const bh = rect.h / bands;
            const dx = r < 0.6 ? (random(`${seed}:dx:${onTwos(frame)}:${i}`) - 0.5) * 34 : 0;
            ctx.drawImage(tmp, 0, y0 * resolution, tmp.width, bh * resolution, rect.x + dx, rect.y + y0, rect.w, bh);
            if (dx !== 0) {
              ctx.globalCompositeOperation = 'lighter';
              ctx.globalAlpha = 0.35;
              ctx.drawImage(tmp, 0, y0 * resolution, tmp.width, bh * resolution, rect.x + dx * 1.8, rect.y + y0, rect.w, bh);
              ctx.globalAlpha = 1;
              ctx.globalCompositeOperation = 'source-over';
            }
          }
        } else {
          ctx.drawImage(tmp, rect.x, rect.y, rect.w, rect.h);
        }

        // burning edge just before a cell dissolves
        ctx.globalCompositeOperation = 'lighter';
        const glowLen = 7;
        for (const c of cells) {
          const dt = c.td - frame;
          if (dt > 0 && dt <= glowLen) {
            const a = 1 - dt / glowLen;
            ctx.fillStyle = `rgba(${edge[0]},${edge[1]},${edge[2]},${0.85 * a})`;
            ctx.fillRect(rect.x + c.cx - cell / 2, rect.y + c.cy - cell / 2, cell, cell);
          }
        }

        // flying data particles
        const ox = rect.x + origin.u * rect.w;
        const oy = rect.y + origin.v * rect.h;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const c of cells) {
          const age = (frame - c.td) / FPS;
          if (age < 0 || age > c.life) continue;
          const k = age / c.life;
          const bx = rect.x + c.cx;
          const by = rect.y + c.cy;
          let dx = bx - ox;
          let dy = by - oy;
          const dn = Math.hypot(dx, dy) || 1;
          dx /= dn;
          dy /= dn;
          const sp = 50 + c.r2 * 230;
          const drag = 2.2;
          const dist = (sp / drag) * (1 - Math.exp(-drag * age));
          const up = (35 + c.r3 * 110) * age + 0.5 * (60 + c.r3 * 90) * age * age;
          const swirl = Math.sin(age * (2.5 + c.r4 * 3) + c.r1 * 6.28) * 14 * age;
          const x = bx + dx * dist + swirl + 20 * age * age;
          const y = by + dy * dist * 0.6 - up;
          const p = pal[Math.floor(c.r1 * pal.length) % pal.length];
          const mix = clamp(k * 2.6, 0, 1);
          const cr = Math.round(c.r + (p[0] - c.r) * mix);
          const cg = Math.round(c.g + (p[1] - c.g) * mix);
          const cb = Math.round(c.b + (p[2] - c.b) * mix);
          const alpha = clamp((1 - k) * 1.15, 0, 1);
          const size = cell * (1.05 - 0.75 * k) * (0.7 + c.r2 * 0.6);
          ctx.globalAlpha = alpha * 0.55;
          const gs = glowSprite(`rgb(${p[0]},${p[1]},${p[2]})`);
          ctx.drawImage(gs, x - size * 2, y - size * 2, size * 4, size * 4);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
          if (c.glyph) {
            ctx.font = `700 ${Math.round(size * 2.2)}px "Chakra Petch", monospace`;
            ctx.fillText(c.glyph, x, y);
          } else {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 4 + age * (c.r4 - 0.5) * 6);
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.restore();
          }
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }}
    />
  );
};
