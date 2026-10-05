import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_HUD, FONT_TITLE, ensureFonts } from '../engine/fonts';
import { PARTS } from '../timeline/ep01';

ensureFonts();

/**
 * Transparent overlay cards for the ~1 min TikTok parts (rendered as PNG stills,
 * composited by tools/render_ep01.sh): intro lower-third and "next part" outro.
 */
export const PartCard: React.FC<{ part: number; kind: 'intro' | 'outro' }> = ({ part, kind }) => {
  const p = PARTS.find((x) => x.id === part)!;
  const next = PARTS.find((x) => x.id === part + 1);
  if (kind === 'intro') {
    return (
      <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 0 96px 110px' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, padding: '18px 30px', background: 'linear-gradient(90deg, rgba(4,10,18,0.82), rgba(4,10,18,0))', borderLeft: '5px solid #e8b65a', width: 900 }}>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 44, letterSpacing: 10, color: '#f3dfb0' }}>AETHELGARD</div>
          <div style={{ fontFamily: FONT_HUD, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: '#ffffff' }}>
            TEIL {p.id}/{PARTS.length} · {p.title.toUpperCase()}
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 110px 96px 0' }}>
      <div style={{ padding: '16px 28px', background: 'linear-gradient(270deg, rgba(4,10,18,0.85), rgba(4,10,18,0))', borderRight: '5px solid #5ef2ff', textAlign: 'right', width: 820 }}>
        <div style={{ fontFamily: FONT_HUD, fontWeight: 700, fontSize: 32, letterSpacing: 6, color: '#5ef2ff' }}>{next ? `WEITER IN TEIL ${next.id} →` : 'FORTSETZUNG FOLGT'}</div>
        <div style={{ fontFamily: FONT_HUD, fontWeight: 500, fontSize: 26, letterSpacing: 3, color: '#ffffff' }}>{next ? next.title : 'Episode 2'}</div>
      </div>
    </AbsoluteFill>
  );
};
