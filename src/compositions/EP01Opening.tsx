import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ensureFonts } from '../engine/fonts';
import { S00ColdOpen } from '../scenes/S00_ColdOpen';
import { S01SH01Awakening, S01SH02Puddle, S01SH03System } from '../scenes/S01_Awakening';
import { S02SH01Emerge, S02SH02Aggro } from '../scenes/S02_ShadowWeasel';
import { S03SH01Throw, S03SH02Strike } from '../scenes/S03_StoneStrike';
import { S04SH01Skill, S04SH02Monolith, S05Title } from '../scenes/S04_SkillUnlock';
import { CUES, SHOTS, ShotId } from '../timeline/ep01_opening';
import { Soundtrack } from './Soundtrack';

ensureFonts();

/** Shot id (naming convention S##_SH##_desc) -> scene component. */
export const SHOT_COMPONENTS: Record<ShotId, React.FC> = {
  S00_SH01_coldopen_flatline: S00ColdOpen,
  S01_SH01_awakening_meadow: S01SH01Awakening,
  S01_SH02_puddle_reflection: S01SH02Puddle,
  S01_SH03_system_welcome: S01SH03System,
  S02_SH01_weasel_emerges: S02SH01Emerge,
  S02_SH02_aggro_warning: S02SH02Aggro,
  S03_SH01_throw_diorama: S03SH01Throw,
  S03_SH02_strike_data_dissolve: S03SH02Strike,
  S04_SH01_skill_unlock_analyse: S04SH01Skill,
  S04_SH02_monolith_scan_teaser: S04SH02Monolith,
  S05_SH01_title_card: S05Title,
};

export const EP01Opening: React.FC<{ muted?: boolean }> = ({ muted }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    {SHOTS.map((s) => {
      const Comp = SHOT_COMPONENTS[s.id as ShotId];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <Comp />
        </Sequence>
      );
    })}
    {muted ? null : <Soundtrack cues={CUES} />}
  </AbsoluteFill>
);

/** Renders a single shot in isolation (Studio previews / per-shot stills). */
export const ShotPreview: React.FC<{ shotId: ShotId }> = ({ shotId }) => {
  const Comp = SHOT_COMPONENTS[shotId];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Comp />
    </AbsoluteFill>
  );
};
