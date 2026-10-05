import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ramp } from '../engine/core';
import { FONT_HUD } from '../engine/fonts';

export type Line = { text: string; from: number; to: number; speaker?: string; color?: string; thought?: boolean };

/**
 * Dialogue / inner-monologue subtitle (no voice acting yet).
 * Inner monologue is italic, spoken lines carry a coloured speaker tag.
 * Text reveals word-group-wise for a calmer reading rhythm.
 */
export const Subtitle: React.FC<Line> = ({ text, from, to, speaker, color = '#ffd76a', thought }) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, from, from + 10), 1 - ramp(f, to - 10, to));
  if (o <= 0) return null;
  const chars = Math.floor(Math.max(0, f - from) * 1.6);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 84,
        textAlign: 'center',
        fontFamily: FONT_HUD,
        opacity: o,
        transform: `translateY(${(1 - o) * 10}px)`,
      }}
    >
      {speaker ? (
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 6, color, textShadow: '0 0 12px rgba(0,0,0,0.9), 0 2px 3px #000', marginBottom: 6 }}>{speaker}</div>
      ) : null}
      <div
        style={{
          display: 'inline-block',
          maxWidth: 1400,
          fontSize: 46,
          fontWeight: 500,
          fontStyle: thought ? 'italic' : 'normal',
          letterSpacing: 1,
          color: '#f6fbff',
          textShadow: '0 0 18px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.95)',
        }}
      >
        {text.slice(0, chars)}
        <span style={{ opacity: 0 }}>{text.slice(chars)}</span>
      </div>
    </div>
  );
};

export const Subtitles: React.FC<{ lines: Line[] }> = ({ lines }) => (
  <>
    {lines.map((l, i) => (
      <Subtitle key={i} {...l} />
    ))}
  </>
);
