import React from 'react';
import { AbsoluteFill, random, staticFile, useCurrentFrame } from 'remotion';
import { MANIFEST } from '../assets';
import { EASE, FPS, H, W, clamp, onTwos, ramp } from '../engine/core';

/* -------------------------------------------------------------- post */
/** Film grain + vignette + optional colour wash. Applied on top of every shot. */
export const Post: React.FC<{ vignette?: number; grain?: number; wash?: string; washBlend?: React.CSSProperties['mixBlendMode']; washOpacity?: number }> = ({
  vignette = 0.55,
  grain = 0.07,
  wash,
  washBlend = 'soft-light',
  washOpacity = 0.35,
}) => {
  const frame = useCurrentFrame();
  const f2 = onTwos(frame);
  const gx = Math.floor(random(`gx${f2}`) * 512);
  const gy = Math.floor(random(`gy${f2}`) * 512);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {wash ? <AbsoluteFill style={{ background: wash, mixBlendMode: washBlend, opacity: washOpacity }} /> : null}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      {grain > 0 ? (
        <AbsoluteFill
          style={{
            backgroundImage: `url(${staticFile(MANIFEST.fx.grain)})`,
            backgroundSize: '512px 512px',
            backgroundPosition: `${gx}px ${gy}px`,
            mixBlendMode: 'overlay',
            opacity: grain,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- light */
/** Volumetric sun rays (irregular conic gradient, slowly rotating, screen-blended). */
export const LightRays: React.FC<{ x: number; y: number; color?: string; opacity?: number; seed?: string; spin?: number; reach?: number }> = ({
  x,
  y,
  color = '255,226,170',
  opacity = 0.5,
  seed = 'rays',
  spin = 2,
  reach = 75,
}) => {
  const frame = useCurrentFrame();
  const stops: string[] = [];
  let a = 0;
  let i = 0;
  while (a < 360) {
    const w = 2 + random(`${seed}w${i}`) * 9;
    const gap = 3 + random(`${seed}g${i}`) * 14;
    const al = (0.25 + random(`${seed}a${i}`) * 0.75).toFixed(3);
    stops.push(`rgba(${color},0) ${a}deg`, `rgba(${color},${al}) ${a + w / 2}deg`, `rgba(${color},0) ${a + w}deg`);
    a += w + gap;
    i++;
  }
  const rot = (frame / FPS) * spin;
  return (
    <AbsoluteFill
      style={{
        background: `conic-gradient(from ${rot}deg at ${x}px ${y}px, ${stops.join(',')})`,
        WebkitMaskImage: `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0) ${reach}%)`,
        maskImage: `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0) ${reach}%)`,
        mixBlendMode: 'screen',
        opacity,
        filter: 'blur(6px)',
      }}
    />
  );
};

export const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number; blend?: React.CSSProperties['mixBlendMode'] }> = ({
  x,
  y,
  r,
  color,
  opacity = 1,
  blend = 'screen',
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
      mixBlendMode: blend,
      opacity,
    }}
  />
);

/* -------------------------------------------------------------- flashes */
export const Flash: React.FC<{ at: number; inLen?: number; hold?: number; outLen?: number; color?: string; max?: number }> = ({
  at,
  inLen = 0,
  hold = 1,
  outLen = 10,
  color = '#ffffff',
  max = 1,
}) => {
  const frame = useCurrentFrame();
  const a = inLen > 0 ? ramp(frame, at - inLen, at, EASE.in) : frame >= at ? 1 : 0;
  const b = 1 - ramp(frame, at + hold, at + hold + outLen, EASE.out);
  const o = Math.min(a, b) * max;
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ background: color, opacity: o }} />;
};

/**
 * Anime "impact frame": for a couple of frames the whole image becomes a
 * stark inverted black/white silhouette. Returns a CSS filter for the shot root.
 */
export const impactFilter = (frame: number, hits: number[]) => {
  for (const h of hits) {
    if (frame === h) return 'grayscale(1) contrast(6) invert(1)';
    if (frame === h + 1) return 'grayscale(1) contrast(5) brightness(1.4)';
    if (frame === h + 2) return 'invert(1) hue-rotate(180deg) saturate(2)';
  }
  return undefined;
};

/* -------------------------------------------------------------- impacts */
export const Shockwave: React.FC<{ x: number; y: number; at: number; color?: string; rings?: number; maxR?: number; squash?: number }> = ({
  x,
  y,
  at,
  color = '#ffffff',
  rings = 3,
  maxR = 700,
  squash = 1,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {Array.from({ length: rings }).map((_, i) => {
        const t = ramp(frame, at + i * 3, at + i * 3 + 18 + i * 6, EASE.out);
        if (t <= 0 || t >= 1) return null;
        const r = maxR * t * (1 - i * 0.18);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={r}
            ry={r * squash}
            fill="none"
            stroke={color}
            strokeWidth={(1 - t) * (26 - i * 6)}
            opacity={(1 - t) * 0.9}
          />
        );
      })}
    </svg>
  );
};

/** Ground cracks + crater at an impact point - the environment shows the force (no wounds). */
export const GroundCracks: React.FC<{ x: number; y: number; at: number; seed?: string; count?: number; length?: number; squash?: number; width?: number }> = ({
  x,
  y,
  at,
  seed = 'crack',
  count = 9,
  length = 360,
  squash = 0.32,
  width = 6,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const grow = ramp(frame, at, at + 7, EASE.snap);
  const glow = 1 - ramp(frame, at + 2, at + 30);
  const crater = ramp(frame, at, at + 4, EASE.snap);

  // jagged, tapered fissure as a filled polygon
  const fissure = (id: string, sx: number, sy: number, ang0: number, len: number, w0: number) => {
    const r = (k: string) => random(`${seed}:${id}:${k}`);
    const n = 12;
    const pts: [number, number][] = [[sx, sy]];
    let ang = ang0;
    let px = sx;
    let py = sy;
    for (let i = 1; i <= n; i++) {
      ang += (r(`j${i}`) - 0.5) * 0.85;
      const step = (len / n) * (0.6 + r(`s${i}`) * 0.8);
      px += Math.cos(ang) * step;
      py += Math.sin(ang) * step * squash;
      pts.push([px, py]);
    }
    const visible = Math.max(2, Math.ceil(pts.length * grow));
    const P = pts.slice(0, visible);
    const left: string[] = [];
    const right: string[] = [];
    P.forEach(([cx, cy], i) => {
      const [nx0, ny0] = P[Math.min(i + 1, P.length - 1)];
      const [px0, py0] = P[Math.max(i - 1, 0)];
      const dx = nx0 - px0;
      const dy = ny0 - py0;
      const dn = Math.hypot(dx, dy) || 1;
      const t = i / (pts.length - 1);
      const w = w0 * Math.pow(1 - t, 0.9) * (0.6 + 0.8 * r(`w${i}`));
      left.push(`${(cx - (dy / dn) * w).toFixed(1)},${(cy + (dx / dn) * w * squash * 2).toFixed(1)}`);
      right.unshift(`${(cx + (dy / dn) * w).toFixed(1)},${(cy - (dx / dn) * w * squash * 2).toFixed(1)}`);
    });
    return { poly: [...left, ...right].join(' '), line: P.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' '), pts };
  };

  const shapes: { poly: string; line: string }[] = [];
  for (let i = 0; i < count; i++) {
    const r = (k: string) => random(`${seed}:${i}:${k}`);
    const ang = (i / count) * Math.PI * 2 + (r('a') - 0.5) * 0.6;
    const len = length * (0.5 + r('l') * 0.5);
    const main = fissure(`m${i}`, x, y, ang, len, width);
    shapes.push(main);
    // one side branch per fissure
    const bi = 3 + Math.floor(r('bi') * 5);
    const [bx, by] = main.pts[bi];
    if (grow > bi / 12) shapes.push(fissure(`b${i}`, bx, by, ang + (r('bs') < 0.5 ? -0.9 : 0.9), len * 0.4, width * 0.55));
  }

  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${seed}-crater`}>
          <stop offset="0%" stopColor="rgba(28,16,8,0.9)" />
          <stop offset="55%" stopColor="rgba(50,30,15,0.55)" />
          <stop offset="100%" stopColor="rgba(60,40,20,0)" />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={length * 0.42 * crater} ry={length * 0.42 * squash * crater} fill={`url(#${seed}-crater)`} />
      <ellipse cx={x} cy={y - 2} rx={length * 0.26 * crater} ry={length * 0.26 * squash * crater} fill="none" stroke="rgba(255,225,190,0.35)" strokeWidth={2} />
      {shapes.map((sh, i) => (
        <g key={i}>
          <polygon points={sh.poly} fill="#1c120a" />
          <polyline points={sh.line} fill="none" stroke={`rgba(160,240,255,${0.9 * glow})`} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
};

/* -------------------------------------------------------------- water */
/** SVG displacement filter: smooth flowing water distortion (noise scrolled via feOffset). */
export const WaterFilter: React.FC<{ id: string; scale: number; freq?: string; drift?: [number, number] }> = ({ id, scale, freq = '0.006 0.022', drift = [0.7, 1.6] }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }}>
      <filter id={id} x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={7} result="n" />
        <feOffset in="n" dx={(frame * drift[0]) % 400} dy={(frame * drift[1]) % 400} result="no" />
        <feDisplacementMap in="SourceGraphic" in2="no" scale={scale} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
};

export const RippleRings: React.FC<{ x: number; y: number; at: number; count?: number; maxR?: number; squash?: number }> = ({ x, y, at, count = 4, maxR = 520, squash = 0.85 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const t = clamp((frame - at - i * 7) / 55, 0, 1);
        if (t <= 0 || t >= 1) return null;
        const r = maxR * EASE.out(t);
        return (
          <g key={i} opacity={(1 - t) * 0.75}>
            <ellipse cx={x} cy={y} rx={r} ry={r * squash} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={3 + (1 - t) * 3} />
            <ellipse cx={x} cy={y} rx={r * 0.96} ry={r * squash * 0.96} fill="none" stroke="rgba(20,40,70,0.55)" strokeWidth={4} />
          </g>
        );
      })}
    </svg>
  );
};

/* -------------------------------------------------------------- eyelids */
/** POV blink: black eyelids that open (and optionally blink) - "Erwachen". */
export const Eyelids: React.FC<{ keys: [number, number][] }> = ({ keys }) => {
  const frame = useCurrentFrame();
  // keys: [frame, openness 0..1]
  let open = keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [fa, a] = keys[i];
    const [fb, b] = keys[i + 1];
    if (frame >= fa && frame <= fb) open = a + (b - a) * EASE.inOut((frame - fa) / Math.max(1, fb - fa));
    if (frame > fb) open = b;
  }
  if (open >= 0.999) return null;
  const lid = (H / 2) * (1 - open) + 40;
  const curve = 140 * open;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, filter: 'blur(14px)' }}>
      <path d={`M -100 -100 L ${W + 100} -100 L ${W + 100} ${lid - curve} Q ${W / 2} ${lid + curve} -100 ${lid - curve} Z`} fill="#000" />
      <path d={`M -100 ${H + 100} L ${W + 100} ${H + 100} L ${W + 100} ${H - lid + curve} Q ${W / 2} ${H - lid - curve} -100 ${H - lid + curve} Z`} fill="#000" />
    </svg>
  );
};

/* -------------------------------------------------------------- caption */
export const Caption: React.FC<{ text: string; from: number; to: number }> = ({ text, from, to }) => {
  const frame = useCurrentFrame();
  const o = Math.min(ramp(frame, from, from + 8), 1 - ramp(frame, to - 8, to));
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 92,
        textAlign: 'center',
        fontFamily: '"Chakra Petch", sans-serif',
        fontWeight: 500,
        fontStyle: 'italic',
        fontSize: 46,
        letterSpacing: 1,
        color: '#f6fbff',
        opacity: o,
        textShadow: '0 0 18px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.9)',
        transform: `translateY(${(1 - o) * 10}px)`,
      }}
    >
      {text}
    </div>
  );
};
