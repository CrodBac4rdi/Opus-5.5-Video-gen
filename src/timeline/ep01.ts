import data from './ep01.shots.json';

export type ShotId = (typeof data.shots)[number]['id'];
type RawShot = (typeof data.shots)[number];
export type Shot = RawShot & { from: number };

/** Start frames are derived from the durations - re-timing a shot never breaks the rest. */
export const SHOTS: Shot[] = (() => {
  let t = 0;
  return data.shots.map((s) => {
    const shot = { ...s, from: t };
    t += s.dur;
    return shot;
  });
})();

export const TOTAL_FRAMES = SHOTS.reduce((m, s) => Math.max(m, s.from + s.dur), 0);

export const PARTS = data.parts.map((p) => {
  const shots = SHOTS.filter((s) => s.part === p.id);
  const from = shots[0].from;
  const to = shots[shots.length - 1].from + shots[shots.length - 1].dur;
  return { ...p, from, to, dur: to - from };
});

export const shot = (id: ShotId) => {
  const s = SHOTS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown shot ${id}`);
  return s;
};

/** Absolute frame of a moment inside a shot - keeps sound cues glued to picture. */
const at = (id: ShotId, offset: number) => shot(id).from + offset;
/** Frames from the start of shot a (+offset) to the start of shot b (+offset). */
const span = (a: ShotId, b: ShotId, offA = 0, offB = 0) => shot(b).from + offB - (shot(a).from + offA);
const end = (id: ShotId) => shot(id).from + shot(id).dur;

export type Cue = { file: string; at: number; volume: number; dur?: number; fadeIn?: number; fadeOut?: number; loop?: boolean };

/**
 * Sound cue sheet (all placeholders from tools/make_sfx.py).
 * A sound designer replaces files 1:1 - names and sync points stay.
 */
export const CUES: Cue[] = [
  // ---------------------------------------------------------------- Teil 1
  { file: 'sfx_heartbeat', at: at('S00_SH01_coldopen_flatline', 10), volume: 0.9 },
  { file: 'sfx_heartbeat', at: at('S00_SH01_coldopen_flatline', 66), volume: 0.6 },
  { file: 'sfx_flatline', at: at('S00_SH01_coldopen_flatline', 100), volume: 0.42, dur: 70, fadeOut: 10 },
  { file: 'sfx_glitch', at: at('S00_SH01_coldopen_flatline', 108), volume: 0.5 },
  { file: 'sfx_glitch', at: at('S00_SH01_coldopen_flatline', 128), volume: 0.35 },
  { file: 'sfx_riser_whiteout', at: at('S00_SH01_coldopen_flatline', 138), volume: 0.6 },
  { file: 'sfx_whiteout_hit', at: at('S01_SH01_pov_sky', 0), volume: 0.75 },
  { file: 'amb_meadow_wind', loop: true, at: at('S01_SH01_pov_sky', 0), volume: 0.3, dur: span('S01_SH01_pov_sky', 'S04_SH02_monolith_scan'), fadeIn: 30, fadeOut: 20 },
  { file: 'mus_pad_awakening', at: at('S01_SH01_pov_sky', 10), volume: 0.5, dur: span('S01_SH01_pov_sky', 'S01_SH08_red_eyes_tease', 10, 20), fadeIn: 45, fadeOut: 40 },
  { file: 'sfx_water_drop', at: at('S01_SH06_puddle_reflection', 4), volume: 0.75 },
  { file: 'sfx_ui_open', at: at('S01_SH07_system_welcome', 14), volume: 0.7 },
  { file: 'sfx_ui_typing', at: at('S01_SH07_system_welcome', 30), volume: 0.45 },
  { file: 'sfx_ui_open', at: at('S01_SH07_system_welcome', 150), volume: 0.55 },
  { file: 'sfx_ui_warning', at: at('S01_SH07_system_welcome', 214), volume: 0.55 },
  { file: 'sfx_rustle', at: at('S01_SH08_red_eyes_tease', 4), volume: 0.7 },
  { file: 'sfx_growl', at: at('S01_SH08_red_eyes_tease', 40), volume: 0.45 },
  // ---------------------------------------------------------------- Teil 2
  { file: 'mus_curious_pad', at: at('S02_SH01_weasel_cute', 0), volume: 0.42, dur: span('S02_SH01_weasel_cute', 'S02_SH03_weasel_lunge'), fadeIn: 20, fadeOut: 4 },
  { file: 'sfx_weasel_squeak', at: at('S02_SH01_weasel_cute', 40), volume: 0.6 },
  { file: 'sfx_ui_warning', at: at('S02_SH01_weasel_cute', 96), volume: 0.5 },
  { file: 'sfx_ui_warning', at: at('S02_SH02_reach_out', 50), volume: 0.35 },
  { file: 'sfx_weasel_squeak', at: at('S02_SH02_reach_out', 110), volume: 0.45 },
  { file: 'sfx_impact_crit', at: at('S02_SH03_weasel_lunge', 0), volume: 0.75 },
  { file: 'sfx_player_hit', at: at('S02_SH03_weasel_lunge', 2), volume: 0.8 },
  { file: 'sfx_heartbeat', at: at('S02_SH03_weasel_lunge', 60), volume: 0.7 },
  { file: 'mus_tension_pulse', at: at('S02_SH04_aggro_weakpoint', 0), volume: 0.55, dur: span('S02_SH04_aggro_weakpoint', 'S03_SH02_strike_data_dissolve', 0, 14), fadeIn: 10, fadeOut: 3 },
  { file: 'sfx_alarm_aggro', at: at('S02_SH04_aggro_weakpoint', 6), volume: 0.5 },
  { file: 'sfx_growl', at: at('S02_SH04_aggro_weakpoint', 40), volume: 0.6 },
  { file: 'sfx_scan', at: at('S02_SH04_aggro_weakpoint', 80), volume: 0.5 },
  { file: 'sfx_grab', at: at('S02_SH05_hand_stone', 6), volume: 0.8 },
  { file: 'sfx_throw_whoosh', at: at('S03_SH01_throw_diorama', 2), volume: 0.9 },
  { file: 'sfx_throw_whoosh', at: at('S03_SH02_strike_data_dissolve', 0), volume: 0.7 },
  { file: 'sfx_impact_crit', at: at('S03_SH02_strike_data_dissolve', 14), volume: 0.82 },
  { file: 'sfx_data_shatter', at: at('S03_SH02_strike_data_dissolve', 24), volume: 0.75 },
  { file: 'sfx_ui_open', at: at('S03_SH02_strike_data_dissolve', 160), volume: 0.45 },
  { file: 'mus_triumph_pad', at: at('S04_SH01_skill_unlock_analyse', 0), volume: 0.55, dur: shot('S04_SH01_skill_unlock_analyse').dur, fadeIn: 12, fadeOut: 20 },
  { file: 'sfx_skill_unlock', at: at('S04_SH01_skill_unlock_analyse', 50), volume: 0.85 },
  { file: 'sfx_scan', at: at('S04_SH01_skill_unlock_analyse', 200), volume: 0.6 },
  { file: 'sfx_glitch', at: at('S04_SH01_skill_unlock_analyse', 222), volume: 0.5 },
  // ---------------------------------------------------------------- Teil 3
  { file: 'mus_mystery_pad', at: at('S04_SH02_monolith_scan', 0), volume: 0.5, dur: span('S04_SH02_monolith_scan', 'S05_SH01_goblin_tracks', 0, 30), fadeIn: 10, fadeOut: 40 },
  { file: 'sfx_scan', at: at('S04_SH02_monolith_scan', 4), volume: 0.6 },
  { file: 'sfx_glitch', at: at('S04_SH02_monolith_scan', 40), volume: 0.55 },
  { file: 'sfx_glitch', at: at('S04_SH02_monolith_scan', 96), volume: 0.4 },
  { file: 'amb_forest', loop: true, at: at('S05_SH01_goblin_tracks', 0), volume: 0.35, dur: span('S05_SH01_goblin_tracks', 'S07_SH03_title_teaser'), fadeIn: 30, fadeOut: 30 },
  { file: 'sfx_scan', at: at('S05_SH01_goblin_tracks', 40), volume: 0.5 },
  { file: 'sfx_scream_sting', at: at('S05_SH02_road_scream', 30), volume: 0.7 },
  { file: 'mus_tension_pulse', at: at('S05_SH03_elara_threatened', 0), volume: 0.45, dur: span('S05_SH03_elara_threatened', 'S05_SH04_choice', 0, 120), fadeIn: 20, fadeOut: 30 },
  { file: 'sfx_goblin_cackle', at: at('S05_SH03_elara_threatened', 20), volume: 0.6 },
  { file: 'sfx_scan', at: at('S05_SH03_elara_threatened', 60), volume: 0.45 },
  { file: 'sfx_goblin_cackle', at: at('S05_SH03_elara_threatened', 150), volume: 0.5 },
  { file: 'sfx_choice_open', at: at('S05_SH04_choice', 40), volume: 0.7 },
  { file: 'sfx_heartbeat', at: at('S05_SH04_choice', 110), volume: 0.75 },
  { file: 'sfx_heartbeat', at: at('S05_SH04_choice', 166), volume: 0.85 },
  { file: 'sfx_riser_whiteout', at: at('S05_SH04_choice', 205), volume: 0.5 },
  { file: 'sfx_choice_select', at: at('S05_SH04_choice', 236), volume: 0.9 },
  // ---------------------------------------------------------------- Teil 4
  { file: 'mus_battle_drums', at: at('S06_SH01_stone_distraction', 0), volume: 0.55, dur: span('S06_SH01_stone_distraction', 'S06_SH06_levelup'), fadeIn: 6, fadeOut: 10 },
  { file: 'sfx_throw_whoosh', at: at('S06_SH01_stone_distraction', 30), volume: 0.7 },
  { file: 'sfx_bonk', at: at('S06_SH01_stone_distraction', 46), volume: 0.9 },
  { file: 'sfx_goblin_cackle', at: at('S06_SH01_stone_distraction', 70), volume: 0.6 },
  { file: 'sfx_spear_thrust', at: at('S06_SH02_spear_thrust', 4), volume: 0.9 },
  { file: 'sfx_impact_crit', at: at('S06_SH03_goblinB_strike', 14), volume: 0.8 },
  { file: 'sfx_data_shatter', at: at('S06_SH03_goblinB_strike', 24), volume: 0.7 },
  { file: 'sfx_club_whoosh', at: at('S06_SH04_dodge', 6), volume: 0.8 },
  { file: 'sfx_heartbeat', at: at('S06_SH04_dodge', 40), volume: 0.6 },
  { file: 'sfx_scan', at: at('S06_SH04_dodge', 24), volume: 0.45 },
  { file: 'sfx_spear_thrust', at: at('S06_SH05_goblinA_counter', 2), volume: 0.85 },
  { file: 'sfx_impact_crit', at: at('S06_SH05_goblinA_counter', 14), volume: 0.8 },
  { file: 'sfx_data_shatter', at: at('S06_SH05_goblinA_counter', 24), volume: 0.7 },
  { file: 'sfx_levelup', at: at('S06_SH06_levelup', 20), volume: 0.85 },
  { file: 'mus_triumph_pad', at: at('S06_SH06_levelup', 10), volume: 0.45, dur: 170, fadeIn: 20, fadeOut: 30 },
  { file: 'mus_adventure_pad', at: at('S07_SH01_elara_thanks', 0), volume: 0.5, dur: span('S07_SH01_elara_thanks', 'S07_SH03_title_teaser', 0, 10), fadeIn: 30, fadeOut: 20 },
  { file: 'sfx_quest', at: at('S07_SH01_elara_thanks', 130), volume: 0.6 },
  { file: 'sfx_quest', at: at('S07_SH02_walking_together', 60), volume: 0.65 },
  { file: 'sfx_braam_title', at: at('S07_SH03_title_teaser', 0), volume: 0.95 },
  { file: 'sfx_wolf_howl', at: at('S07_SH03_title_teaser', 100), volume: 0.6 },
];

export const FILM_END = end('S07_SH03_title_teaser');
