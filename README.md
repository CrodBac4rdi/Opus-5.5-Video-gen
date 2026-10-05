# Aethelgard – KI-Anime-Pipeline

Isekai-Anime im 2D-Action-Stil (Ufotable / MAPPA). KI-Standbilder werden mit Code-VFX, UI und Sound zu einer Animation komponiert („Living Diorama“).

**Aktueller Stand:** `renders/EP01_opening_v02.mp4`, die ~33 s lange Eröffnung von Episode 1 (Erwachen → Schattenwiesel → Data-Auflösung → Skill „Analyse“ → Monolith-Teaser → Titel).

## Pipeline

| Schritt | Werkzeug |
|---|---|
| 1. Bilder (nur Standbilder, budget-gesichert) | `python3 tools/or_image.py <ASSET_ID>`; Prompts in `production/prompts/ep01_opening.json` |
| 2. Aufbereitung (2× Upscale, Bloom, Keying) | `python3 tools/prep_assets.py` |
| 3. Sound-Platzhalter (prozedural) | `python3 tools/make_sfx.py` |
| 4. Komposition (Remotion / React) | `npm run studio` (Vorschau); `npx remotion render src/index.ts EP01-Opening out/<name>_master.mp4` → `tools/deliver.sh` (Limiter −1 dBTP, CRF 19) |
| 5. Visuelle QA | `node tools/stills.mjs out/qa <frame…>` + `python3 tools/contact_sheet.py out/qa out/sheet.jpg` |
| 6. Scene Matrix | `python3 tools/export_matrix.py` → `docs/SCENE_MATRIX_EP01_opening.md` |

Dazu: `npm install` und `pip install numpy pillow scipy requests`.

## Code-Struktur (`src/`)

- **`engine/`**
  - `camera.tsx`: Diorama-Kamera, Parallaxe-Layer, Plate→Screen-Projektion
  - `core.ts`: Timing und Easing
  - `fonts.ts`: Schriften laden
- **`fx/`**
  - `DataDissolve.tsx`: Data-Auflösung
  - `particles.tsx`: Feld, Burst, Speedlines, Gras
  - `overlays.tsx`: Impact-Frames, Shockwave, Bodenrisse, Wasser, Lichtstrahlen, Post
- **`hud/hud.tsx`:** System-Interface (Fenster, Typewriter, HP-Balken, Target-Lock, Schwachstelle, Tags, Glitch-Text)
- **`scenes/`:** ein Modul pro Szene. Shot-IDs folgen der Namenskonvention `S##_SH##_*`.
- **`timeline/`:** Shot-Liste (JSON, Single Source of Truth) + Sound-Cue-Sheet

Neue KI-Assets einsetzen:
1. Bild generieren.
2. In `production/raw` als `_final` freigeben.
3. Zu `tools/prep_assets.py` hinzufügen.
4. Per `plateToLayer()` Features (Hand, Augen, Schwachpunkt …) in Code-Koordinaten verankern.

Regeln & Doktrin: [`docs/PRODUCTION_BIBLE.md`](docs/PRODUCTION_BIBLE.md) · Szenen: [`docs/SCENE_MATRIX_EP01_opening.md`](docs/SCENE_MATRIX_EP01_opening.md)
