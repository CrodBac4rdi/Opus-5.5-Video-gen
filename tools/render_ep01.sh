#!/usr/bin/env bash
# Full EP01 render pipeline.
#   1. one muted video segment per part (re-render only what changed: PARTS="2 4")
#   2. the complete soundtrack once (audio-only render)
#   3. full film: concat segments + audio, master limiter -1 dBTP, x264 (capped bitrate)
#   4. ~1 min TikTok parts cut from the film, with intro/outro cards and audio fades
# usage: tools/render_ep01.sh v03 [--skip-video] ; PARTS="1 2 3 4" by default
set -euo pipefail
VER="${1:?version, e.g. v03}"; SKIP_VIDEO="${2:-}"
OUT=out/render_$VER; mkdir -p "$OUT" renders
FPS=30
PARTS="${PARTS:-1 2 3 4}"
ranges=$(node -e '
const d=require("./src/timeline/ep01.shots.json"); let t=0; const r={};
for (const s of d.shots){ r[s.part]=r[s.part]||[t,t]; r[s.part][1]=t+s.dur; t+=s.dur; }
for (const p of Object.keys(r)) console.log(p, r[p][0], r[p][1]);')
echo "$ranges"

if [ "$SKIP_VIDEO" != "--skip-video" ]; then
  for P in $PARTS; do
    read -r _ A B <<<"$(echo "$ranges" | awk -v p="$P" '$1==p')"
    echo "== segment part $P frames $A-$((B-1))"
    npx remotion render src/index.ts EP01-Film "$OUT/seg_p$P.mp4" --frames="$A-$((B-1))" --muted --codec=h264 --crf=16 --pixel-format=yuv420p --log=warn
  done
fi

echo "== soundtrack"
if [ -f "$OUT/soundtrack.wav" ] && [ -z "${FORCE_AUDIO:-}" ]; then echo "(reusing $OUT/soundtrack.wav - FORCE_AUDIO=1 to re-render)"; else
  npx remotion render src/index.ts EP01-Film "$OUT/soundtrack.wav" --codec=wav --log=warn
fi

echo "== part cards"
node tools/part_cards.mjs "$OUT/cards" >/dev/null

echo "== full film"
: > "$OUT/concat.txt"
for P in 1 2 3 4; do echo "file 'seg_p$P.mp4'" >> "$OUT/concat.txt"; done
ffmpeg -v error -y -f concat -safe 0 -i "$OUT/concat.txt" -c copy "$OUT/video.mp4"
FULL=renders/EP01_${VER}_full.mp4
ffmpeg -v error -y -i "$OUT/video.mp4" -i "$OUT/soundtrack.wav" -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 20 -maxrate 3.6M -bufsize 7.2M -tune animation -pix_fmt yuv420p \
  -af "volume=3.5dB,alimiter=limit=0.84:attack=1:release=60:level=false" -c:a aac -b:a 192k -movflags +faststart -shortest "$FULL"

echo "== parts"
while read -r P A B; do
  T0=$(echo "scale=3; $A/$FPS" | bc); DUR=$(echo "scale=3; ($B-$A)/$FPS" | bc)
  OUTRO=$(echo "scale=3; $DUR-2.8" | bc); AOUT=$(echo "scale=3; $DUR-0.6" | bc)
  ffmpeg -v error -y -ss "$T0" -t "$DUR" -i "$FULL" \
    -loop 1 -t "$DUR" -i "$OUT/cards/part${P}_intro.png" -loop 1 -t "$DUR" -i "$OUT/cards/part${P}_outro.png" \
    -filter_complex "[1:v]format=rgba,fade=t=in:st=0.4:d=0.4:alpha=1,fade=t=out:st=3.6:d=0.5:alpha=1[i];[2:v]format=rgba,fade=t=in:st=${OUTRO}:d=0.4:alpha=1[o];[0:v][i]overlay=0:0:shortest=1[v1];[v1][o]overlay=0:0:shortest=1,format=yuv420p[v];[0:a]afade=t=in:st=0:d=0.25,afade=t=out:st=${AOUT}:d=0.6[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 20 -maxrate 4M -bufsize 8M -tune animation -c:a aac -b:a 192k -movflags +faststart \
    "renders/EP01_${VER}_part${P}.mp4"
done <<<"$ranges"

ls -la renders/EP01_${VER}_*
for f in renders/EP01_${VER}_*.mp4; do
  printf "%s  " "$f"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" | tr '\n' ' '
  ffmpeg -nostats -hide_banner -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | tr '\n' ' '; echo
done
