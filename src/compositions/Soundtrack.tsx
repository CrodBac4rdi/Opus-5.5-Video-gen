import React from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';
import { Cue } from '../timeline/ep01_opening';

/** Places every cue of the cue sheet on the timeline, with optional fades. */
export const Soundtrack: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Sequence key={`${c.file}-${i}`} from={c.at} durationInFrames={c.dur} layout="none" name={`♪ ${c.file}`}>
        <Audio
          src={staticFile(`sfx/${c.file}.wav`)}
          volume={(f) => {
            const fin = c.fadeIn ? interpolate(f, [0, c.fadeIn], [0, 1], { extrapolateRight: 'clamp' }) : 1;
            const fout = c.dur && c.fadeOut ? interpolate(f, [c.dur - c.fadeOut, c.dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
            return c.volume * fin * fout;
          }}
        />
      </Sequence>
    ))}
  </>
);
