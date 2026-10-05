import data from './ep01_opening.shots.json';

export type ShotId = (typeof data.shots)[number]['id'];
export const SHOTS = data.shots;
export const TOTAL_FRAMES = SHOTS.reduce((m, s) => Math.max(m, s.from + s.dur), 0);

export const shot = (id: ShotId) => {
  const s = SHOTS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown shot ${id}`);
  return s;
};

/** Absolute frame of a moment inside a shot - keeps sound cues glued to picture. */
const at = (id: ShotId, offset: number) => shot(id).from + offset;

export type Cue = { file: string; at: number; volume: number; dur?: number; fadeIn?: number; fadeOut?: number };

/**
 * Sound cue sheet (all placeholders from tools/make_sfx.py).
 * A sound designer replaces files 1:1 - names and sync points stay.
 */
export const CUES: Cue[] = [
  // S00 - cold open
  { file: 'sfx_heartbeat', at: at('S00_SH01_coldopen_flatline', 8), volume: 0.9 },
  { file: 'sfx_flatline', at: at('S00_SH01_coldopen_flatline', 46), volume: 0.42, dur: 44, fadeOut: 6 },
  { file: 'sfx_riser_whiteout', at: at('S00_SH01_coldopen_flatline', 50), volume: 0.6 },
  { file: 'sfx_glitch', at: at('S00_SH01_coldopen_flatline', 56), volume: 0.5 },
  { file: 'sfx_glitch', at: at('S00_SH01_coldopen_flatline', 66), volume: 0.35 },
  // S01 - awakening
  { file: 'sfx_whiteout_hit', at: at('S01_SH01_awakening_meadow', 0), volume: 0.75 },
  { file: 'amb_meadow_wind', at: at('S01_SH01_awakening_meadow', 0), volume: 0.32, dur: shot('S05_SH01_title_card').from - shot('S01_SH01_awakening_meadow').from, fadeIn: 24, fadeOut: 20 },
  { file: 'mus_pad_awakening', at: at('S01_SH01_awakening_meadow', 6), volume: 0.5, dur: shot('S02_SH01_weasel_emerges').from - shot('S01_SH01_awakening_meadow').from + 4, fadeIn: 30, fadeOut: 24 },
  { file: 'sfx_water_drop', at: at('S01_SH02_puddle_reflection', 4), volume: 0.75 },
  { file: 'sfx_ui_open', at: at('S01_SH03_system_welcome', 9), volume: 0.7 },
  { file: 'sfx_ui_typing', at: at('S01_SH03_system_welcome', 18), volume: 0.45 },
  { file: 'sfx_ui_warning', at: at('S01_SH03_system_welcome', 58), volume: 0.55 },
  // S02 - shadow weasel
  { file: 'mus_tension_pulse', at: at('S02_SH01_weasel_emerges', 0), volume: 0.55, dur: shot('S03_SH02_strike_data_dissolve').from + 14 - shot('S02_SH01_weasel_emerges').from, fadeIn: 10, fadeOut: 3 },
  { file: 'sfx_shadow_materialize', at: at('S02_SH01_weasel_emerges', 2), volume: 0.75 },
  { file: 'sfx_growl', at: at('S02_SH01_weasel_emerges', 54), volume: 0.8 },
  { file: 'sfx_alarm_aggro', at: at('S02_SH02_aggro_warning', 4), volume: 0.5 },
  { file: 'sfx_growl', at: at('S02_SH02_aggro_warning', 26), volume: 0.6 },
  { file: 'sfx_scan', at: at('S02_SH02_aggro_warning', 38), volume: 0.5 },
  // S03 - the throw
  { file: 'sfx_throw_whoosh', at: at('S03_SH01_throw_diorama', 2), volume: 0.9 },
  { file: 'sfx_throw_whoosh', at: at('S03_SH02_strike_data_dissolve', 0), volume: 0.7 },
  { file: 'sfx_impact_crit', at: at('S03_SH02_strike_data_dissolve', 14), volume: 0.82 },
  { file: 'sfx_data_shatter', at: at('S03_SH02_strike_data_dissolve', 22), volume: 0.75 },
  { file: 'sfx_ui_open', at: at('S03_SH02_strike_data_dissolve', 104), volume: 0.45 },
  // S04 - skill unlock + teaser
  { file: 'mus_triumph_pad', at: at('S04_SH01_skill_unlock_analyse', 0), volume: 0.55, dur: shot('S04_SH02_monolith_scan_teaser').from + 12 - shot('S04_SH01_skill_unlock_analyse').from, fadeIn: 12, fadeOut: 16 },
  { file: 'sfx_skill_unlock', at: at('S04_SH01_skill_unlock_analyse', 36), volume: 0.85 },
  { file: 'sfx_scan', at: at('S04_SH02_monolith_scan_teaser', 2), volume: 0.6 },
  { file: 'sfx_glitch', at: at('S04_SH02_monolith_scan_teaser', 20), volume: 0.55 },
  { file: 'sfx_glitch', at: at('S04_SH02_monolith_scan_teaser', 38), volume: 0.45 },
  // S05 - title
  { file: 'sfx_braam_title', at: at('S05_SH01_title_card', 0), volume: 0.95 },
];
