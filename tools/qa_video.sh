#!/usr/bin/env bash
# Video QA: container info, loudness/peak, and a frame strip every N seconds.
# usage: tools/qa_video.sh renders/EP01_opening_v01.mp4 out/qa_v01
set -euo pipefail
in="$1"; out="${2:-out/qa}"; mkdir -p "$out"
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate,channels -of default=nw=1 "$in"
echo "--- loudness (EBU R128) ---"
ffmpeg -nostats -hide_banner -i "$in" -af ebur128=peak=true -f null - 2>&1 | grep -A12 "Summary:" | grep -E "I:|LRA:|Peak:" || true
echo "--- frames ---"
ffmpeg -v error -y -i "$in" -vf "fps=1/1.5,scale=640:-1" "$out/f%03d.jpg"
ls "$out" | wc -l
