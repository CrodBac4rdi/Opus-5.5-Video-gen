import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PLATE_OVERSCAN, PlateKey, plateToLayer } from '../assets';
import { CamKey, DioramaCamera, Layer, Plate, Shake } from '../engine/camera';
import { ramp } from '../engine/core';
import { ParticleField } from '../fx/particles';
import { Flash, LightRays, Post } from '../fx/overlays';
import { Line, Subtitles } from '../fx/subtitle';

export type Ambient = 'petals' | 'motes' | 'dust' | 'leaves' | 'cyan' | 'gold';

const AMBIENT: Record<Ambient, React.FC<{ seed: string }>> = {
  petals: ({ seed }) => (
    <ParticleField seed={`${seed}pt`} kind="petal" count={22} colors={['#ffffff', '#fff1f6', '#ffe3ee']} size={[6, 11]} vel={{ x: [25, 70], y: [8, 40] }} sway={30} opacity={[0.7, 1]} />
  ),
  motes: ({ seed }) => (
    <ParticleField seed={`${seed}mt`} kind="mote" count={44} colors={['rgba(255,226,160,0.9)', 'rgba(255,250,220,0.9)']} size={[2, 6]} vel={{ x: [-8, 14], y: [-22, -6] }} sway={24} opacity={[0.3, 0.9]} />
  ),
  dust: ({ seed }) => (
    <ParticleField seed={`${seed}du`} kind="mote" count={50} colors={['rgba(255,236,190,0.8)']} size={[1.5, 3.5]} vel={{ x: [-6, 6], y: [-8, 4] }} sway={14} opacity={[0.2, 0.7]} />
  ),
  leaves: ({ seed }) => (
    <ParticleField seed={`${seed}lv`} kind="petal" count={16} colors={['#5f8f2f', '#8aa83a', '#c9a24a']} size={[7, 12]} vel={{ x: [30, 90], y: [20, 60] }} sway={40} opacity={[0.8, 1]} />
  ),
  cyan: ({ seed }) => (
    <ParticleField seed={`${seed}cy`} kind="mote" count={40} colors={['rgba(94,242,255,0.9)', 'rgba(200,255,255,0.9)']} size={[2, 5]} vel={{ x: [-10, 10], y: [-30, -10] }} opacity={[0.3, 0.9]} />
  ),
  gold: ({ seed }) => (
    <ParticleField seed={`${seed}gd`} kind="mote" count={60} colors={['rgba(255,215,120,0.95)', 'rgba(255,245,210,0.9)']} size={[2, 6]} vel={{ x: [-12, 12], y: [-40, -12] }} />
  ),
};

/**
 * Generic, data-driven Living-Diorama shot: one AI plate, a camera move,
 * ambient particles, light rays, grade, subtitles and optional children
 * (children render inside the camera, so they can use useCam()).
 */
export const DioramaShot: React.FC<{
  id: string;
  plate: PlateKey;
  keys: CamKey[];
  shakes?: Shake[];
  bloom?: number;
  filter?: string;
  ambient?: Ambient[];
  rays?: { raw: [number, number]; opacity?: number; spin?: number; color?: string };
  wash?: string;
  washOpacity?: number;
  vignette?: number;
  lines?: Line[];
  fadeIn?: number;
  fadeOut?: number;
  dur?: number;
  flashIn?: boolean;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
}> = ({ id, plate, keys, shakes, bloom = 0.3, filter, ambient = [], rays, wash, washOpacity = 0.2, vignette = 0.5, lines = [], fadeIn = 0, fadeOut = 0, dur, flashIn, children, overlay }) => {
  const f = useCurrentFrame();
  const sun = rays ? plateToLayer(plate, rays.raw[0], rays.raw[1]) : null;
  const black = Math.max(fadeIn ? 1 - ramp(f, 0, fadeIn) : 0, fadeOut && dur ? ramp(f, dur - fadeOut, dur) : 0);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <DioramaCamera keys={keys} shakes={shakes}>
        <Layer depth={1} clampOv={PLATE_OVERSCAN}>
          <Plate plate={plate} bloom={bloom} filter={filter} />
          {sun ? <LightRays x={sun.x} y={sun.y} opacity={rays?.opacity ?? 0.4} seed={`${id}rays`} spin={rays?.spin ?? 2} color={rays?.color} /> : null}
        </Layer>
        {ambient.length ? (
          <Layer depth={1.3}>
            {ambient.map((a) => {
              const A = AMBIENT[a];
              return <A key={a} seed={id} />;
            })}
          </Layer>
        ) : null}
        {children}
      </DioramaCamera>
      {overlay}
      <Subtitles lines={lines} />
      {flashIn ? <Flash at={0} hold={0} outLen={8} max={0.6} /> : null}
      <Post vignette={vignette} grain={0.06} wash={wash} washOpacity={washOpacity} />
      {black > 0 ? <AbsoluteFill style={{ background: '#000', opacity: black }} /> : null}
    </AbsoluteFill>
  );
};
