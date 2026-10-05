# Aethelgard – KI-Anime-Pipeline

Isekai-Anime im 2D-Action-Stil (Ufotable / MAPPA). KI-Standbilder werden mit Code-VFX, UI und Sound zu einer Animation komponiert („Living Diorama“).

**Aktueller Stand – EP01 v03:** `renders/EP01_v03_full.mp4` (≈ 3:11 min). Die Handlung:

1. Tod in unserer Welt
2. Erwachen in Aethelgard
3. Die erste Lektion: Schattenwiesel, [Analyse]
4. Monolith des Echos
5. Goblin-Spuren
6. Elara-Rettung
7. Level 3 und Quest „Eine sichere Reise“

Zusätzlich in vier TikTok-Teilen à ~40–55 s: `renders/EP01_v03_part1.mp4` … `part4.mp4`.

## Pipeline

| Schritt | Werkzeug |
|---|---|
| 1. Bilder (nur Standbilder, budget-gesichert) | `python3 tools/or_image.py <ASSET_ID>` – Prompts in `production/prompts/ep01_opening.json` |
| 2. Abgeleitete Plates (Retusche im Code, ohne KI) | `python3 tools/derive_plates.py` |
| 3. Aufbereitung (Letterbox-Crop, 2× Upscale, Bloom, Keying, Sprite-Split) | `python3 tools/prep_assets.py` |
| 4. Sound-Platzhalter (prozedural, Ogg Vorbis) | `python3 tools/make_sfx.py` |
| 5. Vorschau | `npm run studio` – Komposition `EP01-Film` oder einzelne Shots |
| 6. Visuelle QA | `node tools/stills.mjs out/qa <frame…>` + `python3 tools/contact_sheet.py out/qa out/sheet.jpg` |
| 7. Render (Segmente pro Teil, Soundtrack, Film, TikTok-Teile) | `tools/render_ep01.sh v03` (nur einzelne Teile neu: `PARTS="2 4" tools/render_ep01.sh v03`) |
| 8. Scene Matrix | `python3 tools/export_matrix.py` → `docs/SCENE_MATRIX_EP01.md` |

Dazu: `npm install` und `pip install numpy pillow scipy requests opencv-python-headless`.

## Code-Struktur (`src/`)

- **`timeline/`**
  - `ep01.shots.json`: Single Source of Truth (Dauern, Teile, Matrix-Spalten)
  - `ep01.ts`: berechnete Startframes + Sound-Cue-Sheet
- **`engine/`**
  - `camera.tsx`: Diorama-Kamera, Parallaxe, Plate→Screen-Projektion
  - `core.ts`: Timing und Easing
  - `fonts.ts`: Schriften laden
- **`fx/`**
  - `DataDissolve.tsx`: Data-Auflösung
  - `particles.tsx`: Feld, Burst, Speedlines, Gras
  - `overlays.tsx`: Impact-Frames, Shockwave, Bodenrisse, Wasser, Lichtstrahlen, Post
  - `subtitle.tsx`: Dialog / innerer Monolog
- **`hud/`**
  - `hud.tsx`: System-Fenster, Typewriter, HP, Target-Lock, Schwachstelle, Tags
  - `quest.tsx`: Entscheidungs-Prompt, Quest/Beziehung, Level-Up, Angriffsbahn, Spieler-Schaden
- **`scenes/`**
  - `DioramaShot.tsx`: generischer, datengetriebener Shot
  - `combat.tsx`: gemeinsamer Treffer-/Auflösungs-Shot für alle Kämpfe
  - `S00`–`S07`: die Szenen

Neue KI-Assets einsetzen:
1. Bild generieren.
2. In `production/raw` als `_final` freigeben.
3. `prep_assets.py` ausführen – Plates und Sprites werden automatisch erkannt.
4. In `src/assets/index.ts` registrieren.
5. Bild-Features per `plateToLayer()` / `spriteUV()` anhand der Rohpixel-Koordinaten verankern.

Regeln & Doktrin: [`docs/PRODUCTION_BIBLE.md`](docs/PRODUCTION_BIBLE.md) · Szenen: [`docs/SCENE_MATRIX_EP01.md`](docs/SCENE_MATRIX_EP01.md)
