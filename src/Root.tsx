import React from 'react';
import { Composition } from 'remotion';
import { EP01Film, ShotPreview } from './compositions/EP01Film';
import { PartCard } from './compositions/PartCard';
import { FPS, H, W } from './engine/core';
import { SHOTS, ShotId, TOTAL_FRAMES } from './timeline/ep01';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="EP01-Film" component={EP01Film} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ muted: false }} />
    <Composition id="PartCard" component={PartCard} durationInFrames={1} fps={FPS} width={W} height={H} defaultProps={{ part: 1, kind: 'intro' as const }} />
    {/* one preview composition per shot, for fast iteration in the Studio */}
    {SHOTS.map((s) => (
      <Composition key={s.id} id={s.id.replace(/_/g, '-')} component={ShotPreview} durationInFrames={s.dur} fps={FPS} width={W} height={H} defaultProps={{ shotId: s.id as ShotId }} />
    ))}
  </>
);
