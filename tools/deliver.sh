#!/usr/bin/env bash
# Master -> delivery encode: x264 CRF 19 (slow), AAC 192k, master limiter at -1 dBTP,
# loudness kept around -14..-15 LUFS, faststart for web/social playback.
# usage: tools/deliver.sh out/EP01_opening_v02_master.mp4 renders/EP01_opening_v02.mp4
set -euo pipefail
in="$1"; out="$2"
ffmpeg -v error -y -i "$in" \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -tune animation \
  -af "alimiter=limit=0.84:attack=1:release=60:level=false" \
  -c:a aac -b:a 192k -movflags +faststart "$out"
ffmpeg -nostats -hide_banner -i "$out" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
ls -la "$out"
