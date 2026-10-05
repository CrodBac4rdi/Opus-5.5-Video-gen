import React, { useLayoutEffect, useRef } from 'react';
import { useCurrentFrame } from 'remotion';
import { H, W } from '../engine/core';

export type DrawFn = (ctx: CanvasRenderingContext2D, frame: number) => void;

/**
 * Full-frame canvas that is redrawn synchronously for every frame.
 * `resolution` > 1 renders a denser backing store so that layers which are
 * zoomed by the diorama camera stay crisp.
 */
export const FrameCanvas: React.FC<{ draw: DrawFn; resolution?: number; style?: React.CSSProperties; width?: number; height?: number }> = ({
  draw,
  resolution = 1,
  style,
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    draw(ctx, frame);
  });
  return (
    <canvas
      ref={ref}
      width={Math.round(width * resolution)}
      height={Math.round(height * resolution)}
      style={{ position: 'absolute', left: 0, top: 0, width, height, ...style }}
    />
  );
};

const glowCache = new Map<string, HTMLCanvasElement>();

/** Pre-rendered soft glow sprite (radial gradient) - much cheaper than shadowBlur. */
export const glowSprite = (color: string, size = 64) => {
  const key = `${color}|${size}`;
  const hit = glowCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.18, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  glowCache.set(key, c);
  return c;
};

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
