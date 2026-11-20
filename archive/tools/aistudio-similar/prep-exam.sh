#!/usr/bin/env bash
# Usage: prep-exam.sh <archive path of original JS, e.g. archive/exams/original/high/h2/1final/26_순천고_1학기_기말_고2_대수.js> <outdir>
# Writes <name>.txt (the original JS) and problem figure PNGs (qNN.png, not *-solution*) into <outdir>, prints the file list.
set -e
src="$1"; out="$2"; name=$(basename "$src" .js)
mkdir -p "$out"; rm -f "$out"/*
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
git show "origin/main:$src" > "$out/$name.txt"
grep -oE "assets/images/$name/[^\"' )]+\.(png|jpg)" "$out/$name.txt" | grep -v -i solution | sort -u | while read p; do
  git show "origin/main:archive/$p" > "$out/$(basename "$p")" 2>/dev/null || rm -f "$out/$(basename "$p")"
done
ls "$out" | sed "s#^#$out/#"
