# Scene Matrix – EP01 Das Erwachen - Opening

> Generated from `src/timeline/ep01_opening.shots.json` by `tools/export_matrix.py` – do not edit by hand.
> 1920×1080 @ 30 fps · total 00:33.00

| Szene | Shot-ID | Zeit | Story-Zweck | Charakter | Ort | Kamerabewegung | Licht | Audio | Prompt | Benötigte Assets | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S00 Kalt-Start | `S00_SH01_coldopen_flatline` | 00:00.00–00:03.00 | Hook in 3 s: Kaelans Tod in unserer Welt (EKG -> Nulllinie) und das System, das eine 'neue Seele' nach Aethelgard überträgt. | - (nur System) | Schwarz / System-Raum | Statisch, Screen-Space-Grafik; Glitch-Jitter | Schwarz, EKG-Grün -> Warn-Rot, System-Cyan; Weißblende am Ende | sfx_heartbeat, sfx_riser_whiteout, sfx_flatline, sfx_glitch | Code-only (keine KI-Generierung) | code: hud/ECG, GlitchText, Typewriter, Flash | DONE (code) |
| S01 Erwachen | `S01_SH01_awakening_meadow` | 00:03.00–00:06.00 | Kaelan öffnet die Augen in einer fremden Welt; Weltaufbau (schwebende Inseln, Wasserfälle). | Kaelan (neuer Körper) | Morgenwiese von Aethelgard | POV: Lider öffnen sich auf den Himmel (Zoom 1.6, Roll -4°), Lidschlag, dann Kamerafahrt hinunter zu Kaelan im Gras (Zoom 1.16) | Überbelichtet + Unschärfe -> klar; Sonnenstrahlen von oben links; Bloom | sfx_whiteout_hit, amb_meadow_wind, mus_pad_awakening | S01_SH01_awakening_topdown (+ CHAR_Kaelan_ref) | S01_SH01_awakening_topdown_v01_final<br>code: Eyelids, ParticleField petals/motes, LightRays | DONE |
| S01 Erwachen | `S01_SH02_puddle_reflection` | 00:06.00–00:09.00 | Spiegelbild in der Pfütze: das fremde Gesicht (silbernes Haar, eisblaue Augen) - Identitätsbruch. | Kaelan | Regenpfütze auf der Wiese | Push-in auf das Gesicht (1.18 -> 1.42); Wasser-Displacement beruhigt sich nach Tropfen | Kuehle Wasser-Tönung, Himmels-Glanz, starke Vignette (Pfützenrand) | sfx_water_drop, amb_meadow_wind, mus_pad_awakening | S01_SH02_puddle_reflection v02 (worm's-eye = Spiegelbild-Ansicht) | S01_SH02_puddle_reflection_v02_final<br>code: WaterFilter, RippleRings, petals, Caption | DONE (v01 rejected) |
| S01 Erwachen | `S01_SH03_system_welcome` | 00:09.00–00:12.50 | Das System-Interface ploppt auf: [Willkommen, Spieler.] Status: VERLETZT, HP 23/100. | Kaelan | Wiese, Hologramm-Fenster | Langsamer Push + 3D-Yaw-Schwenk (+2 -> -1.5 Grad); UI weltverankert am Licht-Orb | Warmes Gegenlicht, kaltes Cyan vom Interface, flackernd | sfx_ui_open, sfx_ui_typing, sfx_ui_warning | S01_SH03_system_glow (+ CHAR_Kaelan_ref) | S01_SH03_system_glow_v01_final<br>UI_Kaelan_portrait_v01_final<br>code: SystemWindow, Typewriter, StatBar, Tag | DONE |
| S02 Schattenwiesel | `S02_SH01_weasel_emerges` | 00:12.50–00:15.30 | Bedrohung: Ein Schattenwiesel materialisiert sich aus Schatten - zuerst nur rote Augen. | Schattenwiesel | Lichtung, Bodenhöhe | Low-Dolly-in (1.08 -> 1.28) mit Gras-Vordergrund-Parallaxe | Morgenlicht kippt kühl-violett; rote Augen-Glows | mus_tension_pulse, sfx_shadow_materialize, sfx_growl | ENV_meadow_groundlevel + CREA_ShadowWeasel_sprite (gekeyed) | ENV_meadow_groundlevel_v01_final<br>CREA_ShadowWeasel_sprite_v01_final<br>code: GrassForeground, smoke ParticleField, Glow | DONE |
| S02 Schattenwiesel | `S02_SH02_aggro_warning` | 00:15.30–00:18.30 | Rote System-Warnung [AGGRESSIV], Ziel-Lock, Level, und das System markiert die SCHWACHSTELLE (Stirnkristall). | Schattenwiesel | Lichtung (Nah, Hintergrund unscharf) | Nahaufnahme, Push 1.0 -> 1.08, Shake beim Knurren | Roter Alarm-Puls in der Vignette, roter Rim-Glow | sfx_alarm_aggro, sfx_growl, sfx_scan | ENV_meadow_groundlevel + CREA_ShadowWeasel_sprite | code: TargetLock, Tag, StatBar, WeakPoint | DONE |
| S03 Wurf & Data-Auflösung | `S03_SH01_throw_diorama` | 00:18.30–00:20.10 | Kaelan wirft den Stein - eingefrorener Moment (Living Diorama), Stein hängt in der Luft. | Kaelan | Wiese, Gegenlicht | Snap-Zoom 1.04 -> 1.16 + Dutch-Roll, Shake; Fokus-Speedlines auf die Hand | Sonnen-Flare hinter Kaelan, Bloom, Glint auf dem Stein | sfx_throw_whoosh | S03_SH01_throw_action (+ CHAR_Kaelan_ref) | S03_SH01_throw_action_v01_final<br>code: SpeedLines, petal streaks, Glow | DONE |
| S03 Wurf & Data-Auflösung | `S03_SH02_strike_data_dissolve` | 00:20.10–00:25.30 | Treffer auf den Schwachpunkt: Impact-Frames, Funken, Bodenrisse - dann zerfällt das Wiesel in Datenpartikel. Kein Blut. | Schattenwiesel | Lichtung (Nah) | Zoom 1.9 -> 2.15, starker Impact-Shake mit Roll | Weißblitz, invertierte Impact-Frames, Cyan/Violett-Datenglow | sfx_throw_whoosh, sfx_impact_crit, sfx_data_shatter, sfx_ui_open | ENV_meadow_groundlevel + CREA_ShadowWeasel_sprite | code: Stone, DataDissolve, Burst sparks/shards/dust, Shockwave, GroundCracks, FloatText, SystemWindow | DONE |
| S04 Skill freigeschaltet | `S04_SH01_skill_unlock_analyse` | 00:25.30–00:29.10 | Die Datenpartikel fließen in Kaelans Hand: [Skill freigeschaltet: Analyse]. | Kaelan | Hügelkuppe, Monolith am Horizont | Pull-back (1.32 -> 1.06), Fokus oben gepinnt (Kopf im Bild), Pitch 2 -> 0° | Goldenes Gegenlicht + Sonnenstrahlen, Cyan-Glow in der Hand, Augen-Glint | mus_triumph_pad, sfx_skill_unlock | S04_SH01_hero_analyse (+ CHAR_Kaelan_ref) | S04_SH01_hero_analyse_v01_final<br>code: ParticleField attract, Shockwave, SystemWindow gold, LightRays | DONE |
| S04 Skill freigeschaltet | `S04_SH02_monolith_scan_teaser` | 00:29.10–00:30.90 | Cliffhanger: Erster [Analyse]-Scan auf den Monolithen des Echos - LVL ????, KORRUMPIERT. | - (Monolith) | Horizont | Snap-Zoom auf den Monolithen (1.6 -> 2.3), Glitch-Jitter | Violette Korruptions-Tönung, Scanlinie | sfx_scan, sfx_glitch | S04_SH01_hero_analyse (Ausschnitt) | code: SystemWindow corrupt, GlitchText | DONE |
| S05 Titel | `S05_SH01_title_card` | 00:30.90–00:33.00 | Titelkarte AETHELGARD - Episode 1: Das Erwachen. | - | Schwarz | Statisch, Licht-Sweep ueber den Schriftzug | Gold auf Schwarz, Glut-Partikel | sfx_braam_title | Code-only | code: TitleCard | DONE (code) |

## Image prompts (Identität + Kernmerkmale + Kleidung + Pose + Kamera + Hintergrund)

### `CHAR_Kaelan_ref`
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** Character model sheet: on the left a full-body front view standing in a relaxed neutral pose with arms slightly away from the body, on the right a large head-and-shoulders close-up portrait of the same character looking at the viewer with a calm serious expression
- **Kamera:** orthographic eye-level view, even framing, the entire figure visible from hair to boots with margin
- **Hintergrund:** plain flat light grey background, no environment, no ground shadow
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

### `S01_SH01_awakening_topdown`
*Reference image:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** lying on his back in the grass with arms loosely spread, eyes just opened, staring up at the sky with a dazed confused expression, a few grass blades and white petals on his jacket
- **Kamera:** top-down overhead shot directly above him, his body placed diagonally across the frame, face in the upper third, medium-wide framing
- **Hintergrund:** a bed of tall emerald grass and tiny white flowers in the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, soft golden sunrise light from the top left
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

### `S01_SH02_puddle_reflection`
*Reference image:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** leaning forward over a puddle and looking straight down into the camera with wide surprised eyes and slightly parted lips, silver hair and the teal scarf hanging down toward the viewer
- **Kamera:** extreme worm's-eye view from directly below, as if seen from the water surface looking up at him, his face large in the center of the frame
- **Hintergrund:** the bright golden-pink sunrise sky of Aethelgard with soft clouds behind his head, a few blades of wet grass framing the edges of the image
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

### `S01_SH03_system_glow`
*Reference image:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** standing half-turned toward the left of the frame, right hand raised slightly in astonishment, staring at a floating light source on the left with wide eyes, his face lit by a cool cyan glow
- **Kamera:** cinematic medium close-up from the chest up, character on the right third of the frame, empty space on the left third, slight low angle, shallow depth of field
- **Hintergrund:** the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky softly blurred behind him, warm golden sunrise rim light on his hair from behind, cool cyan light on his face from the left
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

### `ENV_meadow_groundlevel`
- **Identität:** Background art plate: a quiet clearing in the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky
- **Kernmerkmale:** tall emerald grass framing the left and right edges, a patch of flattened grass and bare earth in the center-right of the frame, scattered moss-covered rocks
- **Pose:** empty scene, no characters, no people, no animals, no creatures
- **Kamera:** low ground-level wide shot, camera just above the grass tips, horizon in the upper third, deep perspective
- **Hintergrund:** distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky with long clouds, warm backlight and light morning haze
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

### `CREA_ShadowWeasel_sprite`
- **Identität:** Shadow Weasel, a small fox-sized weasel-like anime monster
- **Kernmerkmale:** sleek elongated body made of dark violet-black shadow fur with crisp clean cel-shaded outlines and purple rim highlights, two glowing crimson eyes, bared sharp white fangs, a long bushy tail, a small glowing violet crystal embedded in its forehead
- **Pose:** low crouched aggressive hunting pose, snarling, ready to pounce, facing left
- **Kamera:** three-quarter side view at eye level, the entire body and tail fully visible and centered with generous margin, nothing cropped
- **Hintergrund:** isolated on a plain solid pure white background, no ground, no cast shadow, no environment, no smoke outside the body silhouette
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

### `S03_SH01_throw_action`
*Reference image:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** frozen in a dynamic mid-throw action pose, right arm fully extended forward toward the right of the frame having just released a small grey stone, left arm swung back, torso twisted, one knee bent, scarf and silver hair whipping in the wind, fierce determined expression with narrowed ice-blue eyes
- **Kamera:** dramatic low-angle three-quarter view, slight dutch tilt, strong foreshortening on the throwing hand, character facing screen right, full body in frame
- **Hintergrund:** the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, tall grass bending in the wind, flying petals, warm golden backlight with a bright sunrise flare behind him
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

### `S04_SH01_hero_analyse`
*Reference image:* `production/raw/CHAR_Kaelan_ref_v01_final.png`  
- **Identität:** Kaelan, a lean 19-year-old anime young man
- **Kernmerkmale:** short messy silver-white hair with sharp spiky bangs falling between his eyes, piercing ice-blue eyes, pale skin, sharp jawline, slim athletic build
- **Kleidung:** black high-collar tactical jacket with silver buckles and crossing straps, a tattered dark-teal scarf around his neck, black fingerless gloves, dark grey cargo pants, worn brown combat boots
- **Pose:** standing tall and calm with a faint confident smile, right hand raised to chest height palm up with small glowing cyan light motes gathering above it, scarf and silver hair blowing in the wind
- **Kamera:** low-angle medium-wide hero shot, character centered, framed from the knees up, sun directly behind him creating a strong golden rim light
- **Hintergrund:** a grassy hilltop in the dawn meadow of Aethelgard: rolling hills of tall emerald grass and tiny white flowers, scattered moss-covered rocks, distant blue mountains, giant floating rock islands with waterfalls, golden-pink sunrise sky, far away on the horizon a colossal dark obelisk-like monolith tower rising into the clouds, dramatic sunrise clouds
- **Stil (konstant):** Style: high-end 2D action anime key visual in the style of Ufotable and MAPPA productions, crisp clean black lineart, cel shading with hard-edged two-tone shadows, vibrant saturated colors, hand-painted anime background art, cinematic lighting with soft bloom. Flat 2D anime cel look, not photorealistic, not 3D render, no hyper-realism. No text, no letters, no UI elements, no watermark, no frame border

