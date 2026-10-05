# Aethelgard – Production Bible (Technical Direction)

Verbindliche Regeln für jedes Asset, jede Code-Zeile und jede künftige Session. Ergänzt die Story-Bibel (`Aethelgard Story Bible & Lore`).

## 1. Format & Stil
- **Ziel-Look:** Hochwertiger 2D-Action-Anime (Ufotable / MAPPA): scharfe Linien, Cel-Shading mit harten Schatten, stilisierte VFX, extrem dynamische Kamera.
- **Verboten:** „Hyper-Realistic Cinematic“ (getestet & verworfen). Jeder Bild-Prompt trägt den konstanten Stil-Block (`blocks.style.anime`) inkl. *no photorealism / no 3D render*.
- **Prämisse (Isekai):** Kaelan stirbt in unserer Welt und erwacht in Aethelgard in einem fremden Körper (silbernes Haar, taktische Kleidung). Nur er sieht das RPG-System-Interface.

## 2. Ressourcen: OpenRouter
- OpenRouter **ausschließlich für statische Bilder** (Text-to-Image). Keine Video-Modelle, keine Kalibrierungs-Calls über viele Modelle.
- **Ein** kosteneffizientes Modell: `google/gemini-2.5-flash-image` (≈ 0,039 $ / Bild). Wechsel nur, wenn es aus mehreren Gründen nicht genügt.
- `tools/or_image.py` erzwingt vor **jedem** Call:
  - Live-Preis-Check
  - Live-Key-Limit-Check
  - Cheap-Model-Gate (0,06 $/Bild)
  - Reserve (0,25 $)
  - Session-Cap (1,60 $)
- Jeder Call landet mit echten Kosten in `production/ledger/openrouter_ledger.jsonl`.
- Erst Look per Bild fixieren. Jeder Kaelan-Shot bekommt `CHAR_Kaelan_ref_v01_final.png` als Referenzbild (Konsistenz).

## 3. Prompt-Formeln
- **Bild:** `Identität + Kernmerkmale + Kleidung + Pose + Kamera + Hintergrund` (+ konstanter Stil-Block).
  - Identität, Kernmerkmale und Kleidung kommen **wortwörtlich** aus `production/prompts/ep01_opening.json → blocks` (`@kaelan.identity` …). Das verhindert Design-Drift.
- **Ebenfalls im Prompt:** „No text, no UI“. Sämtliche UI und Texte entstehen im Code (scharf, editierbar, übersetzbar).

## 4. Aethelgard-Kampf-Doktrin
| Regel | Umsetzung im Code |
|---|---|
| **Kein Gore.** Feinde bluten nie. | `fx/DataDissolve.tsx`: Sprite zerfällt zu leuchtenden Datenwürfeln und 0/1-Glyphen. |
| **Energie statt Stahl.** Keine komplexen Waffen. | Stein (im Code gezeichnet), Mana-/Daten-Glow, Energie-Effekte. |
| **Konsequenz der Wucht.** Härte über die Umgebung zeigen. | `GroundCracks` (Risse + Krater), `Burst` (Staub, Gestein, Gras), `Shockwave`, Funken, Impact-Frames, Kamera-Shake. |

## 5. „Living Diorama“-Methode
KI-Bilder sind **eingefrorene Action-Posen**. Bewegung entsteht ausschließlich durch:
1. **`engine/camera.tsx`:** Fokus, Zoom, Roll, 3D-Yaw/Pitch und prozeduraler Shake. Layer mit unterschiedlicher Tiefe erzeugen 2,5D-Parallaxe um das Standbild.
2. **Umgebung & Partikel:** Pollen, Blüten, Schattenrauch, Gras im Wind, Lichtstrahlen, Wasser-Displacement.
3. **UI & Glitch:** System-Fenster, Typewriter, Target-Lock, Schwachstellen-Reticle.

`plateToLayer()` rechnet Pixelkoordinaten des Original-KI-Bildes in Layer-Koordinaten um. Dadurch sitzen Code-VFX passgenau auf Bild-Features: Licht-Orb, Hand, Stein, Monolith, Kristall des Wiesels.

## 6. Tempo-Regeln (seit v03)
- Diorama-Shot ≥ 4 s (Insert-Shots ≥ 3 s), Kamerabewegungen langsam und eased – keine Dauer-Zooms.
- UI-Texte bleiben nach dem Fertigtippen ≥ 2,5 s stehen; Typewriter 14–24 Zeichen/s.
- Höchstens ein neuer UI-Block pro ~2 s; Untertitel und UI-Labels zeitlich staffeln.
- Jeder ~1-Min-Teil endet mit einem Cliffhanger (Teile stehen in `ep01.shots.json → parts`).

## 7. Kontinuität & Retusche
- Bildfehler, die nur Kontinuität betreffen (z. B. der aufgehobene Speer liegt noch am Wegrand), werden **im Code** retuschiert (`tools/derive_plates.py`) – kein neuer KI-Call.
- Verworfene Takes wandern nach `production/raw/_rejected/`; der Versionszähler berücksichtigt sie (kein Namens-Doppel).

## 8. Dateiverwaltung & Namenskonvention
- **Schema:** `S##_SH##_<beschreibung>_v##[_final]`, z. B. `S03_SH01_throw_action_v01_final`.
- **Präfixe:**
  - `CHAR_`: Charakter-Referenz
  - `CREA_`: Kreatur
  - `ENV_`: Hintergrund-Plate
  - `UI_`: Interface-Element
  - `FX_`: Effekt-Textur
  - `sfx_` / `mus_` / `amb_`: Audio
- **Ordner:**
  - `production/raw/`: Original-Generierungen (freigegeben = `_final`, verworfen → `_rejected/`)
  - `public/assets/EP01/`: render-fertige Assets, erzeugt nur über `tools/prep_assets.py`
  - `public/sfx/`: Sound-Platzhalter (Ogg Vorbis), erzeugt nur über `tools/make_sfx.py`
  - `src/timeline/*.shots.json`: Single Source of Truth für Timing, Teile und Scene Matrix (`tools/export_matrix.py`)
  - `renders/`: nur die aktuelle Version: `EP01_v##_full.mp4` + `EP01_v##_part{1..4}.mp4` (ältere Versionen bleiben in der Git-Historie)
