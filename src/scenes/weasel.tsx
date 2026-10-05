import React from 'react';
import { Img, staticFile } from 'remotion';
import { WEASEL_POINTS, plateToLayer, spriteInfo } from '../assets';
import { Glow } from '../fx/overlays';

export type Rect = { x: number; y: number; w: number; h: number };

/** World placement of the weasel on the dirt patch of the meadow plate (layer px). */
export const weaselWorldRect = (width = 380): Rect => {
  const s = spriteInfo('weasel');
  const ground = plateToLayer('meadow', 860, 545);
  const h = (width * s.h) / s.w;
  return { x: ground.x - width / 2, y: ground.y - WEASEL_POINTS.feetV * h + 6, w: width, h };
};

export const weaselPoint = (r: Rect, p: { u: number; v: number }) => ({ x: r.x + p.u * r.w, y: r.y + p.v * r.h });

/** Keyed sprite + glowing eyes + contact shadow. */
export const WeaselSprite: React.FC<{ rect: Rect; opacity?: number; brightness?: number; eyes?: number; rim?: boolean }> = ({
  rect,
  opacity = 1,
  brightness = 1,
  eyes = 0.8,
  rim = false,
}) => {
  const s = spriteInfo('weasel');
  const e1 = weaselPoint(rect, WEASEL_POINTS.eyeNear);
  const e2 = weaselPoint(rect, WEASEL_POINTS.eyeFar);
  const er = Math.min(rect.w * 0.05, 24);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: rect.x + rect.w * 0.05,
          top: rect.y + rect.h * 0.86,
          width: rect.w * 0.85,
          height: rect.h * 0.22,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(10,0,20,0.7), rgba(0,0,0,0) 70%)',
          opacity,
        }}
      />
      <Img
        src={staticFile(s.file)}
        style={{
          position: 'absolute',
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          opacity,
          filter: `brightness(${brightness})${rim ? ' drop-shadow(0 0 14px rgba(255,40,90,0.55))' : ''}`,
        }}
      />
      {eyes > 0 ? (
        <>
          <Glow x={e1.x} y={e1.y} r={er * 2.4} color="rgba(255,30,60,1)" opacity={eyes} />
          <Glow x={e2.x} y={e2.y} r={er * 1.6} color="rgba(255,30,60,1)" opacity={eyes * 0.8} />
          <Glow x={e1.x} y={e1.y} r={er * 0.7} color="rgba(255,220,220,1)" opacity={eyes} />
        </>
      ) : null}
    </>
  );
};
