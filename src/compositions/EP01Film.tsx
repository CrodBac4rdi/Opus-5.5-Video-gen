import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ensureFonts } from '../engine/fonts';
import { S00ColdOpen } from '../scenes/S00_ColdOpen';
import { S01SH01PovSky, S01SH02Awakening, S01SH03Eyes, S01SH04Hilltop, S01SH05Hands, S01SH06Puddle, S01SH07System, S01SH08RedEyes } from '../scenes/S01_Awakening';
import { S02SH01WeaselCute, S02SH02ReachOut, S02SH03Lunge, S02SH04Aggro, S02SH05HandStone } from '../scenes/S02_ShadowWeasel';
import { S03SH01Throw, S03SH02Strike } from '../scenes/S03_StoneStrike';
import { S04SH01Skill, S04SH02Monolith, S04SH03Resolve } from '../scenes/S04_SkillUnlock';
import { S05SH01Tracks, S05SH02RoadScream, S05SH03Threatened, S05SH04Choice } from '../scenes/S05_Trail';
import { S06SH01Distraction, S06SH02Thrust, S06SH03GoblinB, S06SH04Dodge, S06SH05GoblinA, S06SH06LevelUp } from '../scenes/S06_RoadFight';
import { S07SH01Thanks, S07SH02Walking, S07SH03Title } from '../scenes/S07_Quest';
import { CUES, SHOTS, ShotId } from '../timeline/ep01';
import { Soundtrack } from './Soundtrack';

ensureFonts();

/** Shot id (naming convention S##_SH##_desc) -> scene component. */
export const SHOT_COMPONENTS: Record<ShotId, React.FC> = {
  S00_SH01_coldopen_flatline: S00ColdOpen,
  S01_SH01_pov_sky: S01SH01PovSky,
  S01_SH02_awakening_meadow: S01SH02Awakening,
  S01_SH03_eyes_ecu: S01SH03Eyes,
  S01_SH04_hilltop_world: S01SH04Hilltop,
  S01_SH05_hands: S01SH05Hands,
  S01_SH06_puddle_reflection: S01SH06Puddle,
  S01_SH07_system_welcome: S01SH07System,
  S01_SH08_red_eyes_tease: S01SH08RedEyes,
  S02_SH01_weasel_cute: S02SH01WeaselCute,
  S02_SH02_reach_out: S02SH02ReachOut,
  S02_SH03_weasel_lunge: S02SH03Lunge,
  S02_SH04_aggro_weakpoint: S02SH04Aggro,
  S02_SH05_hand_stone: S02SH05HandStone,
  S03_SH01_throw_diorama: S03SH01Throw,
  S03_SH02_strike_data_dissolve: S03SH02Strike,
  S04_SH01_skill_unlock_analyse: S04SH01Skill,
  S04_SH02_monolith_scan: S04SH02Monolith,
  S04_SH03_resolve: S04SH03Resolve,
  S05_SH01_goblin_tracks: S05SH01Tracks,
  S05_SH02_road_scream: S05SH02RoadScream,
  S05_SH03_elara_threatened: S05SH03Threatened,
  S05_SH04_choice: S05SH04Choice,
  S06_SH01_stone_distraction: S06SH01Distraction,
  S06_SH02_spear_thrust: S06SH02Thrust,
  S06_SH03_goblinB_strike: S06SH03GoblinB,
  S06_SH04_dodge: S06SH04Dodge,
  S06_SH05_goblinA_counter: S06SH05GoblinA,
  S06_SH06_levelup: S06SH06LevelUp,
  S07_SH01_elara_thanks: S07SH01Thanks,
  S07_SH02_walking_together: S07SH02Walking,
  S07_SH03_title_teaser: S07SH03Title,
};

export const EP01Film: React.FC<{ muted?: boolean }> = ({ muted }) => (
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
