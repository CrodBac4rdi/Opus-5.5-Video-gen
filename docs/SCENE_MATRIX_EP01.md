# Scene Matrix – EP01 Das Erwachen

> Generated from `src/timeline/ep01.shots.json` by `tools/export_matrix.py` – do not edit by hand.
> 1920×1080 @ 30 fps · total 03:11.00 · 32 shots · 4 parts

## Teile (TikTok, ~1 min)

| Teil | Titel | Zeit | Cliffhanger |
|---|---|---|---|
| 1 | Das Erwachen | 00:00.00–00:51.00 (51 s) | Rote Augen im hohen Gras |
| 2 | Die erste Lektion | 00:51.00–01:37.00 (46 s) | [Analyse] erfasst ein neues Ziel am Horizont |
| 3 | Spuren | 01:37.00–02:16.00 (39 s) | [Eingreifen?]  JA / NEIN |
| 4 | Erste Begegnung | 02:16.00–03:11.00 (55 s) | Neue Quest – und Wolfsgeheul in der Ferne |

## Shots

| Teil | Szene | Shot-ID | Zeit | Story-Zweck | Charakter | Ort | Kamerabewegung | Licht | Audio | Prompt | Benötigte Assets | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | S00 Kalt-Start | `S00_SH01_coldopen_flatline` | 00:00.00–00:06.00 | Hook: Kaelans Tod in unserer Welt (EKG → Nulllinie), das System überträgt eine 'neue Seele' nach Aethelgard. | – (System) | Schwarz / System-Raum | Statisch, Screen-Space-Grafik, Glitch-Jitter | EKG-Grün → Warn-Rot, System-Cyan, Weißblende | sfx_heartbeat, sfx_flatline, sfx_glitch, sfx_riser_whiteout | Code-only | code: S00_ColdOpen | v03 |
| 1 | S01 Erwachen | `S01_SH01_pov_sky` | 00:06.00–00:11.00 | POV: Die Augen öffnen sich – ein fremder Himmel mit schwebenden Inseln. | Kaelan (POV) | Morgenwiese, Blick nach oben | POV, langsamer Drift + Roll, zwei Lidschläge | Überbelichtet → klar, Sonnen-Flare oben links | sfx_whiteout_hit, amb_meadow_wind, mus_pad_awakening | ENV_sky_pov | ENV_sky_pov_v01_final<br>code: Eyelids, petals | v03 |
| 1 | S01 Erwachen | `S01_SH02_awakening_meadow` | 00:11.00–00:17.00 | Erster Blick auf Kaelan im neuen Körper, im Gras liegend. | Kaelan | Morgenwiese (Hang) | Langsamer Pull-back vom Gesicht (1.5 → 1.12), Roll −3 → 0° | Warmes Morgenlicht, Sonnenstrahlen, Bloom | amb_meadow_wind, mus_pad_awakening | S01_SH01_awakening_topdown | S01_SH01_awakening_topdown_v01_final | v03 |
| 1 | S01 Erwachen | `S01_SH03_eyes_ecu` | 00:17.00–00:21.00 | Detail: eisblaue Augen, in denen sich der fremde Himmel spiegelt. | Kaelan | Morgenwiese | Extreme Nah, minimaler Push-in | Weiches Licht, Glanzpunkte | amb_meadow_wind, mus_pad_awakening | S01_SH03_eyes_ecu | S01_SH03_eyes_ecu_v01_final | v03 |
| 1 | S01 Erwachen | `S01_SH04_hilltop_world` | 00:21.00–00:27.00 | Weltaufbau: Kaelan steht auf, die Weite von Aethelgard. | Kaelan (klein, von hinten) | Hügelkuppe, Panorama | Langsamer Pull-back / Pan über das Panorama | Sonnenaufgang, Gegenlicht, Dunst | amb_meadow_wind, mus_pad_awakening | S01_SH04_hilltop_back | S01_SH04_hilltop_back_v01_final | v03 |
| 1 | S01 Erwachen | `S01_SH05_hands` | 00:27.00–00:31.00 | Identitätsbruch I: fremde Hände. „Das … ist nicht mein Körper.“ | Kaelan | Hügelkuppe | Nah, leichter Push auf die Hände | Morgenlicht | amb_meadow_wind, mus_pad_awakening | S01_SH05_hands | S01_SH05_hands_v01_final | v03 |
| 1 | S01 Erwachen | `S01_SH06_puddle_reflection` | 00:31.00–00:37.00 | Identitätsbruch II: Spiegelbild in der Pfütze – silbernes Haar, eisblaue Augen. | Kaelan | Regenpfütze | Push-in auf das Gesicht, Wasser beruhigt sich nach dem Tropfen | Kühle Wasser-Tönung, Himmels-Glanz, Vignette | sfx_water_drop, amb_meadow_wind, mus_pad_awakening | S01_SH02_puddle_reflection v02 | S01_SH02_puddle_reflection_v02_final | v03 |
| 1 | S01 Erwachen | `S01_SH07_system_welcome` | 00:37.00–00:48.00 | Das System erscheint: [Willkommen, Spieler.] – dann Statusfenster: KAELAN LVL 1, HP 23/100, VERLETZT. | Kaelan | Wiese, Hologramm-Fenster | Sehr langsamer Push + 3D-Yaw-Schwenk, UI weltverankert am Licht-Orb | Warmes Gegenlicht, kaltes Cyan vom Interface | sfx_ui_open, sfx_ui_typing, sfx_ui_warning | S01_SH03_system_glow | S01_SH03_system_glow_v01_final<br>UI_Kaelan_portrait | v03 |
| 1 | S01 Erwachen | `S01_SH08_red_eyes_tease` | 00:48.00–00:51.00 | Cliffhanger Teil 1: Rascheln im hohen Gras – zwei rote Augen. | Schattenwiesel (nur Augen) | Lichtung, Bodenhöhe | Langsamer Push in das Gras | Abgedunkelt, kühl, rote Augen-Glows | sfx_rustle, sfx_growl (leise) | ENV_meadow_groundlevel | ENV_meadow_groundlevel_v01_final<br>code: GrassForeground, Glow | v03 |
| 2 | S02 Die erste Lektion | `S02_SH01_weasel_cute` | 00:51.00–00:57.00 | Ein harmlos wirkendes Schattenwiesel – das System warnt trotzdem: [AGGRESSIV]. | Schattenwiesel (niedlich) | Lichtung | Langsamer Dolly-in, Gras-Parallaxe | Morgenlicht | sfx_weasel_squeak, sfx_ui_warning | CREA_ShadowWeasel_cute + ENV_meadow_groundlevel | CREA_ShadowWeasel_cute_v01_final<br>ENV_meadow_groundlevel_v01_final | v03 |
| 2 | S02 Die erste Lektion | `S02_SH02_reach_out` | 00:57.00–01:02.00 | Kaelan ignoriert die Warnung und streckt die Hand aus. „Ganz ruhig, Kleiner …“ | Kaelan | Lichtung | Langsamer Push, Warn-Tag blinkt im Bild | Morgenlicht | amb_meadow_wind, sfx_ui_warning | S02_SH02_reach_out | S02_SH02_reach_out_v01_final | v03 |
| 2 | S02 Die erste Lektion | `S02_SH03_weasel_lunge` | 01:02.00–01:07.00 | Die Lektion: eingefrorener Sprung des Wiesels, Krallen-Funken, HP 23 → 11 (kein Blut). | Kaelan, Schattenwiesel | Lichtung | Living Diorama: Snap-Zoom + Dutch, Bullet-Time-Drift, Shake | Impact-Frames, roter Damage-Rand | sfx_impact_crit, sfx_player_hit, sfx_heartbeat | S02_SH03_weasel_lunge (Refs: Kaelan + Wiesel) | S02_SH03_weasel_lunge_v01_final<br>code: PlayerDamage, Burst | v03 |
| 2 | S02 Die erste Lektion | `S02_SH04_aggro_weakpoint` | 01:07.00–01:14.00 | Ziel-Lock [AGGRESSIV], LVL 3 – und das System markiert die SCHWACHSTELLE (Stirnkristall). | Schattenwiesel | Lichtung (Nah) | Langsamer Push, Shake beim Knurren | Roter Alarm-Puls | mus_tension_pulse, sfx_alarm_aggro, sfx_growl, sfx_scan | CREA_ShadowWeasel_sprite + ENV_meadow_groundlevel | code: TargetLock, Tag, WeakPoint | v03 |
| 2 | S02 Die erste Lektion | `S02_SH05_hand_stone` | 01:14.00–01:17.00 | Insert: Kaelans Hand greift einen Stein. | Kaelan (Hand) | Gras | Extreme Nah, Mikro-Push, Fokus-Speedlines | Bodennah, kontrastreich | sfx_grab | S02_SH05_hand_stone | S02_SH05_hand_stone_v01_final | v03 |
| 2 | S03 Wurf & Data-Auflösung | `S03_SH01_throw_diorama` | 01:17.00–01:21.00 | Der Wurf – eingefrorener Moment, der Stein hängt in der Luft. | Kaelan | Wiese, Gegenlicht | Snap-Zoom + Dutch-Roll, dann langsamer Bullet-Time-Drift | Sonnen-Flare, Glint auf dem Stein | sfx_throw_whoosh | S03_SH01_throw_action | S03_SH01_throw_action_v01_final | v03 |
| 2 | S03 Wurf & Data-Auflösung | `S03_SH02_strike_data_dissolve` | 01:21.00–01:29.00 | Treffer auf den Stirnkristall: Impact-Frames, Bodenrisse – das Wiesel zerfällt in Datenpartikel. | Schattenwiesel | Lichtung (Nah) | Zoom 1.9 → 2.2, Impact-Shake | Weißblitz, Cyan/Violett-Datenglow | sfx_impact_crit, sfx_data_shatter, sfx_ui_open | CREA_ShadowWeasel_sprite + ENV_meadow_groundlevel | code: DataDissolve, combat FX | v03 |
| 2 | S04 Analyse | `S04_SH01_skill_unlock_analyse` | 01:29.00–01:37.00 | Die Daten fließen in Kaelans Hand: [Skill freigeschaltet: Analyse]. Cliffhanger: neues Ziel erfasst. | Kaelan | Hügelkuppe, Monolith am Horizont | Langsamer Pull-back, Kopf im Bild | Goldenes Gegenlicht, Cyan-Glow, Augen-Glint | mus_triumph_pad, sfx_skill_unlock, sfx_scan | S04_SH01_hero_analyse | S04_SH01_hero_analyse_v01_final | v03 |
| 3 | S04 Analyse | `S04_SH02_monolith_scan` | 01:37.00–01:43.00 | Erster Analyse-Scan: [???] Monolith des Echos – LVL ????, KORRUMPIERT, Betreten nicht empfohlen. | – (Monolith) | Horizont | Snap-Zoom auf den Monolithen, Glitch-Jitter | Violette Korruptions-Tönung, Scanlinie | mus_mystery_pad, sfx_scan, sfx_glitch | S04_SH01_hero_analyse (Ausschnitt) | code: SystemWindow corrupt, GlitchText | v03 |
| 3 | S04 Analyse | `S04_SH03_resolve` | 01:43.00–01:49.00 | Kaelan fasst einen Entschluss: „Erst brauche ich Antworten … und Menschen.“ | Kaelan (von hinten) | Hügelkuppe | Langsamer Push auf Kaelan | Morgenlicht wird wärmer | mus_mystery_pad, amb_meadow_wind | S01_SH04_hilltop_back (zweite Einstellung) | S01_SH04_hilltop_back_v01_final | v03 |
| 3 | S05 Spuren | `S05_SH01_goblin_tracks` | 01:49.00–01:54.00 | Am Waldrand: frische Spuren. [Analyse] → [Goblin-Spuren · frisch · 2 Individuen]. | – | Waldweg | Bodennaher Dolly entlang der Spuren | Nachmittagslicht durch Blätter | amb_forest, sfx_scan | S05_SH01_goblin_tracks | S05_SH01_goblin_tracks_v01_final | v03 |
| 3 | S05 Spuren | `S05_SH02_road_scream` | 01:54.00–01:59.00 | Ein umgestürzter Händlerkarren. Aus dem Off: „Hilfe!“ | – (Elara im Off) | Waldstraße | Langsamer Pan über die Straße | Warmes Nachmittagslicht | amb_forest, sfx_scream_sting | ENV_forest_road | ENV_forest_road_v01_final | v03 |
| 3 | S05 Spuren | `S05_SH03_elara_threatened` | 01:59.00–02:07.00 | Elara (Händlerin, LVL 2) wird von zwei Goblins (LVL 5) bedroht – Analyse-Tags. | Elara, 2 Goblins | Waldstraße am Karren | Langsamer Push, leichter Yaw | Nachmittag, Bedrohungs-Tönung | mus_tension_pulse, sfx_goblin_cackle | S05_SH03_elara_threatened (Refs: Elara + Goblins) | S05_SH03_elara_threatened_v01_final<br>code: TargetLock, Tag | v03 |
| 3 | S05 Spuren | `S05_SH04_choice` | 02:07.00–02:16.00 | Quest-Entscheidung: [Eingreifen?] JA / NEIN – Cliffhanger: Cursor springt auf JA. | Kaelan | Hinter den Büschen | Sehr langsamer Push auf die Augen | Sonnenstrahl auf dem Gesicht | sfx_choice_open, sfx_heartbeat, sfx_choice_select, sfx_riser_whiteout | S05_SH04_kaelan_bushes | S05_SH04_kaelan_bushes_v01_final<br>code: ChoicePrompt | v03 |
| 4 | S06 Erste Begegnung | `S06_SH01_stone_distraction` | 02:16.00–02:22.00 | Ein Stein trifft Goblin A – [Abgelenkt]. Er dreht sich weg von Elara. | 2 Goblins | Waldstraße | Medium, Whip-Push zum Treffer | Nachmittag | mus_battle_drums, sfx_throw_whoosh, sfx_bonk, sfx_goblin_cackle | ENV_forest_road + CREA_Goblin_pair_sprite (gesplittet) | CREA_Goblin_pair_sprite_v01_final_A/B<br>code: Stone, Tag | v03 |
| 4 | S06 Erste Begegnung | `S06_SH02_spear_thrust` | 02:22.00–02:26.00 | Kaelan stößt mit dem Speer vom Karren zu – [Eisenspeer · Händlerware]. | Kaelan | Waldstraße | Living Diorama: Snap-Zoom, Speedlines entlang des Speers | Cyan-Glow an der Speerspitze | sfx_spear_thrust | S06_SH02_spear_thrust | S06_SH02_spear_thrust_v01_final | v03 |
| 4 | S06 Erste Begegnung | `S06_SH03_goblinB_strike` | 02:26.00–02:33.00 | Volltreffer auf Goblin Bs Schwachstelle – Impact-Frames, Data-Auflösung. | Goblin B | Waldstraße | Zoom auf Goblin B, Impact-Shake | Weißblitz, Datenglow | sfx_impact_crit, sfx_data_shatter | ENV_forest_road + Goblin B | code: DataDissolve, combat FX | v03 |
| 4 | S06 Erste Begegnung | `S06_SH04_dodge` | 02:33.00–02:39.00 | Goblin A schlägt zu – Analyse zeigt die Angriffsbahn, Kaelan weicht in Bullet-Time aus. | Kaelan, Goblin A | Waldstraße | Bullet-Time-Drift um die eingefrorene Szene | Rote Vorhersage-Bahn, entsättigt | sfx_club_whoosh, sfx_heartbeat, sfx_scan | S06_SH03_dodge (Refs: Kaelan + Goblins) | S06_SH03_dodge_v01_final<br>code: AttackPrediction | v03 |
| 4 | S06 Erste Begegnung | `S06_SH05_goblinA_counter` | 02:39.00–02:44.00 | Konter auf das Gem-Amulett von Goblin A – Data-Auflösung. | Goblin A | Waldstraße | Zoom auf Goblin A, Shake | Weißblitz, Datenglow | sfx_spear_thrust, sfx_impact_crit, sfx_data_shatter | ENV_forest_road + Goblin A | code: DataDissolve, combat FX | v03 |
| 4 | S06 Erste Begegnung | `S06_SH06_levelup` | 02:44.00–02:50.00 | LEVEL UP! 1 → 3. HP vollständig wiederhergestellt. | Kaelan | Waldstraße | Langsamer Kran nach oben | Gold/Cyan-Lichtströme | sfx_levelup, mus_triumph_pad | S06_SH04_levelup | S06_SH04_levelup_v01_final<br>code: LevelUp | v03 |
| 4 | S07 Eine sichere Reise | `S07_SH01_elara_thanks` | 02:50.00–02:57.00 | Elara: „Danke … du hast mich gerettet. Ich bin Elara.“ – [Beziehung: Freundlich]. | Elara | Waldstraße am Karren | Nah, langsamer Push | Warm, schwebende Lichtpartikel | mus_adventure_pad, sfx_quest | S07_SH01_elara_thanks (Ref: Elara) | S07_SH01_elara_thanks_v01_final<br>UI_Elara_portrait<br>code: QuestNotice | v03 |
| 4 | S07 Eine sichere Reise | `S07_SH02_walking_together` | 02:57.00–03:05.00 | Neue Quest: 'Eine sichere Reise' – gemeinsam Richtung Sonnenuntergang, der Monolith am Horizont. | Kaelan, Elara | Straße durch die Hügel | Langsamer Pull-back / Kran | Sonnenuntergang, Gegenlicht | mus_adventure_pad, sfx_quest | S07_SH02_walking_together (Refs: Kaelan + Elara) | S07_SH02_walking_together_v01_final<br>code: QuestNotice | v03 |
| 4 | S07 Eine sichere Reise | `S07_SH03_title_teaser` | 03:05.00–03:11.00 | Titelkarte – „Fortsetzung folgt …“, in der Ferne Wolfsgeheul. | – | Schwarz | Statisch, Licht-Sweep | Gold auf Schwarz | sfx_braam_title, sfx_wolf_howl | Code-only | code: TitleCard | v03 |

## Image prompts (Identität + Kernmerkmale + Kleidung + Pose + Kamera + Hintergrund)

### `CHAR_Kaelan_ref`
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** Character model sheet: on the left a full-body front view standing in a relaxed neutral pose with arms slightly away from the body, on the right a large head-and-shoulders close-up portrait of the same character looking at the viewer with a calm serious expression
- **Kamera:** orthographic eye-level view, even framing, the entire figure visible from hair to boots with margin
- **Hintergrund:** plain flat light grey background, no environment, no ground shadow
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S01_SH01_awakening_topdown`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** lying on his back in the grass with arms loosely spread, eyes just opened, staring up at the sky with a dazed confused expression, a few grass blades and white petals on his jacket
- **Kamera:** top-down overhead shot directly above him, his body placed diagonally across the frame, face in the upper third, medium-wide framing
- **Hintergrund:** a bed of tall emerald grass and tiny white flowers in the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, soft golden sunrise light from the top left
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S01_SH02_puddle_reflection`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
*Note:* v01 rejected: model drew an upside-down body instead of a reflection. v02 = what the reflection looks like (worm's-eye view, sky behind); the water surface is added in code.  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** leaning forward over a puddle and looking straight down into the camera with wide surprised eyes and slightly parted lips, silver hair and the teal scarf hanging down toward the viewer
- **Kamera:** extreme worm's-eye view from directly below, as if seen from the water surface looking up at him, his face large in the center of the frame
- **Hintergrund:** the bright golden-pink sunrise sky of Aethelgard with soft clouds behind his head, a few blades of wet grass framing the edges of the image
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S01_SH03_system_glow`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** standing half-turned toward the left of the frame, right hand raised slightly in astonishment, staring at a floating light source on the left with wide eyes, his face lit by a cool cyan glow
- **Kamera:** cinematic medium close-up from the chest up, character on the right third of the frame, empty space on the left third, slight low angle, shallow depth of field
- **Hintergrund:** the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky softly blurred behind him, warm golden sunrise rim light on his hair from behind, cool cyan light on his face from the left
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `ENV_meadow_groundlevel`
- **Identität:** Background art plate: a quiet clearing in the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky
- **Kernmerkmale:** tall emerald grass framing the left and right edges, a patch of flattened grass and bare earth in the center-right of the frame, scattered moss-covered rocks
- **Pose:** empty scene, no characters, no people, no animals, no creatures
- **Kamera:** low ground-level wide shot, camera just above the grass tips, horizon in the upper third, deep perspective
- **Hintergrund:** distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky with long clouds, warm backlight and light morning haze
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `CREA_ShadowWeasel_sprite`
- **Identität:** Shadow Weasel, a small fox-sized weasel-like anime monster
- **Kernmerkmale:** sleek elongated body made of dark violet-black shadow fur with crisp clean cel-shaded outlines and purple rim highlights, two glowing crimson eyes, bared sharp white fangs, a long bushy tail, a small glowing violet crystal embedded in its forehead
- **Pose:** low crouched aggressive hunting pose, snarling, ready to pounce, facing left
- **Kamera:** three-quarter side view at eye level, the entire body and tail fully visible and centered with generous margin, nothing cropped
- **Hintergrund:** isolated on a plain solid pure white background, no ground, no cast shadow, no environment, no smoke outside the body silhouette
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S03_SH01_throw_action`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** frozen in a dynamic mid-throw action pose, right arm fully extended forward toward the right of the frame having just released a small grey stone, left arm swung back, torso twisted, one knee bent, scarf and silver hair whipping in the wind, fierce determined expression with narrowed ice-blue eyes
- **Kamera:** dramatic low-angle three-quarter view, slight dutch tilt, strong foreshortening on the throwing hand, character facing screen right, full body in frame
- **Hintergrund:** the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, tall grass bending in the wind, flying petals, warm golden backlight with a bright sunrise flare behind him
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S04_SH01_hero_analyse`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** standing tall and calm with a faint confident smile, right hand raised to chest height palm up with small glowing cyan light motes gathering above it, scarf and silver hair blowing in the wind
- **Kamera:** low-angle medium-wide hero shot, character centered, framed from the knees up, sun directly behind him creating a strong golden rim light
- **Hintergrund:** a grassy hilltop in the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, far away on the horizon a colossal dark obelisk-like monolith tower rising into the clouds, dramatic sunrise clouds
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `CHAR_Elara_ref`
- **Identität:** Elara, a 17-year-old anime girl, a young traveling merchant
- **Kernmerkmale:** long chestnut-brown hair tied in a loose side braid over her left shoulder, warm amber eyes, light freckles across her nose, slim build, gentle face
- **Kleidung:** cream linen blouse with rolled sleeves, forest-green hooded travel cloak with a bronze clasp, brown leather satchel with brass buckles worn across her body, brown corset belt, dark brown skirt over leggings, brown leather boots
- **Pose:** Character model sheet: on the left a full-body front view standing in a relaxed neutral pose, on the right a large head-and-shoulders close-up portrait of the same character with a kind, slightly shy smile
- **Kamera:** orthographic eye-level view, even framing, the entire figure visible from hair to boots with margin
- **Hintergrund:** plain flat light grey background, no environment, no ground shadow
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `CREA_Goblin_pair_sprite`
- **Identität:** Two goblins: Goblin, a small hunched anime goblin monster about the height of a child
- **Kernmerkmale:** olive-green skin, long pointed ears, glowing yellow eyes, sharp crooked teeth, ragged patched leather armor, a cracked glowing red gem amulet on its chest
- **Pose:** the left goblin raises a crude wooden club in a threatening stance, the right goblin crouches with clawed hands raised and a nasty grin; both face right; the two goblins stand clearly apart with wide empty space between them, not touching, not overlapping
- **Kamera:** three-quarter side view at eye level, both full bodies completely visible with generous margin, nothing cropped
- **Hintergrund:** isolated on a plain solid pure white background, no ground, no cast shadow, no environment
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `CREA_ShadowWeasel_cute`
- **Identität:** Shadow Weasel, a small fox-sized weasel-like anime monster
- **Kernmerkmale:** sleek elongated body made of dark violet-black shadow fur with crisp clean cel-shaded outlines and purple rim highlights, big round glossy crimson eyes, mouth closed, a small glowing violet crystal embedded in its forehead, a long fluffy tail
- **Pose:** sitting upright on its hind legs like a curious meerkat, head tilted, looking innocent and harmless, facing left
- **Kamera:** side view at eye level, the entire body and tail fully visible and centered with generous margin, nothing cropped
- **Hintergrund:** isolated on a plain solid pure white background, no ground, no cast shadow, no environment
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `ENV_sky_pov`
- **Identität:** Background art plate: point of view looking straight up into the sky while lying in the grass of the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky
- **Kernmerkmale:** tall emerald grass blades and tiny white flowers framing all edges of the image, several giant floating rock islands with long waterfalls high in the sky, a bright sun flare in the upper left, drifting white petals
- **Pose:** empty scene, no characters, no people, no animals
- **Kamera:** extreme low worm's-eye view pointing straight up, wide angle
- **Hintergrund:** vast golden-pink sunrise sky with soft layered clouds
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `ENV_forest_road`
- **Identität:** Background art plate: a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light
- **Kernmerkmale:** an overturned wooden merchant cart with a broken wheel on the right side of the road, spilled crates, red apples and cloth bundles, a simple iron-tipped wooden spear lying in the grass at the left roadside
- **Pose:** empty scene, no characters, no people, no creatures
- **Kamera:** medium-wide shot at eye level, the road crossing the frame horizontally, clear open space in the center of the road
- **Hintergrund:** tall ancient trees, dense bushes on the left side, distant hills, warm afternoon light beams
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S05_SH01_goblin_tracks`
- **Identität:** Background art plate: a muddy forest trail at the edge of a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light
- **Kernmerkmale:** fresh small clawed three-toed footprints pressed into the mud, broken twigs, a torn scrap of green cloth caught on a thorny bush
- **Pose:** empty scene, no characters, no creatures
- **Kamera:** low angle close to the ground following the footprints into the distance, deep perspective
- **Hintergrund:** tall ancient trees, golden afternoon light beams through the leaves, light haze
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S01_SH03_eyes_ecu`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** eyes just opened wide in wonder
- **Kamera:** extreme close-up of his eyes only, framed from the eyebrows to the bridge of the nose, ice-blue irises with the sky and floating islands reflected in them, silver hair strands falling across
- **Hintergrund:** soft blurred green grass around his face
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S01_SH04_hilltop_back`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** standing alone on a grassy hilltop seen from behind, scarf and silver hair blowing in the wind, looking out over the world
- **Kamera:** epic extreme wide shot from behind, he is small in the lower third of the frame
- **Hintergrund:** vast panorama of the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky with a winding river valley, forests and giant floating islands with waterfalls under a sunrise sky
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S01_SH05_hands`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** looking down at his own raised open hands in black fingerless gloves, shocked and disbelieving expression
- **Kamera:** close-up from slightly above and in front, both hands in sharp focus in the foreground, his face visible above them
- **Hintergrund:** the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky softly blurred, warm sunrise light
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S02_SH02_reach_out`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** kneeling on one knee in the grass, extending his right hand gently toward the right of the frame with a soft friendly smile, as if to pet a small animal
- **Kamera:** medium shot from the side at eye level, he is on the left half facing right, empty grass on the right half of the frame
- **Hintergrund:** the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, soft morning light
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S02_SH05_hand_stone`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** his black fingerless-gloved right hand tightly gripping a fist-sized grey stone in the grass, knuckles tense
- **Kamera:** extreme close-up insert shot at ground level, shallow depth of field
- **Hintergrund:** grass blades and tiny white flowers, the blurred dark silhouette of a small creature with glowing red eyes in the background
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S05_SH04_kaelan_bushes`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** crouching hidden behind leafy bushes, determined fierce expression with narrowed ice-blue eyes, a small grey stone in his right hand
- **Kamera:** close-up from a low angle through leaves, foreground leaves softly blurred, his face lit by a sunbeam
- **Hintergrund:** a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S06_SH02_spear_thrust`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** frozen mid-lunge thrusting a simple iron-tipped wooden spear forward toward the right of the frame with both hands, body stretched in a long dynamic stance, scarf and hair whipping back, intense focused eyes, a faint cyan glow trailing along the spear tip
- **Kamera:** dramatic low-angle side view, strong perspective, character facing screen right, full body in frame
- **Hintergrund:** a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light, the overturned cart blurred in the background
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S06_SH04_levelup`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** standing upright on the road holding a simple wooden spear at his side, head slightly raised, eyes closed, calm, bathed in rising streams of golden and cyan light particles
- **Kamera:** medium shot from a low angle, character centered
- **Hintergrund:** a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light, softly blurred trees
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S02_SH03_weasel_lunge`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`, `production/raw/CREA_ShadowWeasel_sprite_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man, and the Shadow Weasel, a small fox-sized weasel-like anime monster
- **Kernmerkmale:** Kaelan: short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build. The weasel: sleek elongated body made of dark violet-black shadow fur with crisp clean cel-shaded outlines and purple rim highlights, two glowing crimson eyes, bared sharp white fangs, a long bushy tail, a small glowing violet crystal embedded in its forehead
- **Kleidung:** Kaelan wears black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** frozen action moment: the Shadow Weasel leaps at Kaelan mid-air from the right with claws extended and fangs bared, Kaelan falls backward onto the grass raising his left forearm to shield himself, one jacket sleeve torn by the claws, shocked expression; no blood, no wounds
- **Kamera:** dynamic low-angle side view with a dutch tilt, both characters fully in frame, motion lines
- **Hintergrund:** the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, flying grass blades and petals
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S05_SH03_elara_threatened`
*Reference images:* `production/raw/CHAR_Elara_ref_v01_final.png`, `production/raw/CREA_Goblin_pair_sprite_v01_final.png`  
- **Identität:** Elara, a 17-year-old anime girl, a young traveling merchant, threatened by two goblins (Goblin, a small hunched anime goblin monster about the height of a child)
- **Kernmerkmale:** Elara: long chestnut-brown hair tied in a loose side braid over her left shoulder, warm amber eyes, light freckles across her nose, slim build, gentle face. The goblins: olive-green skin, long pointed ears, glowing yellow eyes, sharp crooked teeth, ragged patched leather armor, a cracked glowing red gem amulet on its chest
- **Kleidung:** Elara wears cream linen blouse with rolled sleeves, forest-green hooded travel cloak with a bronze clasp, brown leather satchel with brass buckles worn across her body, brown corset belt, dark brown skirt over leggings, brown leather boots
- **Pose:** Elara kneels with her back against an overturned wooden merchant cart, frightened, clutching her satchel; the two goblins advance toward her from the left, one raising a crude wooden club
- **Kamera:** medium-wide shot at eye level, Elara on the right, the goblins in the center-left seen in three-quarter view from behind
- **Hintergrund:** a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light with spilled crates and red apples
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S06_SH03_dodge`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`, `production/raw/CREA_Goblin_pair_sprite_v01_final.png`  
*Note:* v01 rejected: Kaelan was holding the club himself, the goblin was empty-handed.  
- **Identität:** Kaelan, a lean 19-year-old anime young man, fighting a goblin (Goblin, a small hunched anime goblin monster about the height of a child)
- **Kernmerkmale:** Kaelan: short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build. The goblin: olive-green skin, long pointed ears, glowing yellow eyes, sharp crooked teeth, ragged patched leather armor, a cracked glowing red gem amulet on its chest
- **Kleidung:** Kaelan wears black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** frozen bullet-time moment: the GOBLIN on the right swings its crude wooden club with both of its own hands in a wide horizontal arc; Kaelan on the left, holding a simple wooden spear low in one hand, leans far back so the goblin's club passes just above his face; his ice-blue eyes calmly track the club; Kaelan's hands do not touch the club
- **Kamera:** close side view at eye level, Kaelan on the left facing right, the goblin on the right facing left, the club between them, motion streaks along the club's arc
- **Hintergrund:** a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S07_SH01_elara_thanks`
*Reference images:* `production/raw/CHAR_Elara_ref_v01_final.png`  
- **Identität:** Elara, a 17-year-old anime girl, a young traveling merchant
- **Kernmerkmale:** long chestnut-brown hair tied in a loose side braid over her left shoulder, warm amber eyes, light freckles across her nose, slim build, gentle face
- **Kleidung:** cream linen blouse with rolled sleeves, forest-green hooded travel cloak with a bronze clasp, brown leather satchel with brass buckles worn across her body, brown corset belt, dark brown skirt over leggings, brown leather boots
- **Pose:** kneeling beside the overturned cart, looking up with relieved, slightly teary eyes and a warm grateful smile, one hand on her chest
- **Kamera:** close-up from a slight high angle, as seen by the person standing in front of her
- **Hintergrund:** a dirt road along the edge of an ancient sunlit forest in Aethelgard, tall trees, bushes, warm golden afternoon light, floating light motes, soft warm light
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

### `S07_SH02_walking_together`
*Reference images:* `production/raw/CHAR_Kaelan_ref_v01_final.png`, `production/raw/CHAR_Elara_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man, and Elara, a 17-year-old anime girl, a young traveling merchant
- **Kernmerkmale:** Kaelan: short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build. Elara: long chestnut-brown hair tied in a loose side braid over her left shoulder, warm amber eyes, light freckles across her nose, slim build, gentle face
- **Kleidung:** Kaelan wears black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots. Elara wears cream linen blouse with rolled sleeves, forest-green hooded travel cloak with a bronze clasp, brown leather satchel with brass buckles worn across her body, brown corset belt, dark brown skirt over leggings, brown leather boots
- **Pose:** Kaelan and Elara walk side by side along a dirt road away from the camera, Kaelan carries a simple wooden spear over his shoulder, Elara points ahead with a smile
- **Kamera:** wide shot from behind, both characters small in the lower center of the frame
- **Hintergrund:** the road winds through golden hills toward a distant sunset, far away on the horizon a colossal dark obelisk-like monolith tower rises into the clouds
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border, full-bleed image without black letterbox bars

