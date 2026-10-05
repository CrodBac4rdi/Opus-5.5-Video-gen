import React from 'react';
import { Composition } from 'remotion';
import { EP01Opening, ShotPreview } from './compositions/EP01Opening';
import { FPS, H, W } from './engine/core';
import { SHOTS, ShotId, TOTAL_FRAMES } from './timeline/ep01_opening';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="EP01-Opening" component={EP01Opening} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ muted: false }} />
    {/* one preview composition per shot, for fast iteration in the Studio */}
    {SHOTS.map((s) => (
      <Composition
        key={s.id}
        id={s.id.replace(/_/g, '-')}
        component={ShotPreview}
        durationInFrames={s.dur}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ shotId: s.id as ShotId }}
      />
    ))}
  </>
);
