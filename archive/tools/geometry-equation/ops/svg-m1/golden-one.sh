#!/bin/bash
# usage: golden-one.sh itemNN  -> renders one golden item and compares figure with the stored SVG
# WT(렌더할 트리)·OUT(결과 폴더)·REFDIR(비교 기준 SVG 폴더)는 환경변수로 바꿔 쓴다. 예: WT=$PWD OUT=/home/user/AP------/.tmp/svg-m1/runs/merge-e38/golden/item05 bash golden-one.sh item05
set -u
H=/home/user/AP------/.tmp/svg-m1
WT=${WT:-/home/user/AP------}
REFDIR=${REFDIR:-$H/golden-out}
OUT=${OUT:-$H/runs/golden-one/$1}
mkdir -p "$OUT"
cd "$WT"
export PYTHONIOENCODING=utf-8
export PYTHONPATH="$WT/.tmp/apmath-visual-engine/dependencies/python"
export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
python3 - "$1" "$OUT" <<'EOF'
import json,sys
m=json.load(open('archive/tools/geometry-equation/ops/golden.manifest.json'))
for it in m['items']:
    if it['dir']==sys.argv[1]:
        json.dump({'sourcePath':it['sourcePath'],'ordinal':it['ordinal']},open(sys.argv[2]+'/item.json','w'))
EOF
timeout 900 node archive/tools/geometry-equation/production/render-plan.mjs --item "$OUT/item.json" --plan "archive/tools/geometry-equation/ops/golden/$1/plan.json" --out "$OUT/out" > "$OUT/render.log" 2>&1
tail -c 400 "$OUT/render.log"; echo
N=${1#item}
REF="$REFDIR/$1-solution.svg"
if [ "$N" = "47" ] || [ "$N" = "48" ]; then REF=/home/user/AP------/.tmp/svg-m1/runs/golden4748/o$N/figure-solution.svg; fi
NEW=$(ls "$OUT"/out/*-solution.svg | head -1)
if cmp -s "$REF" "$NEW"; then echo "$1 BYTE_IDENTICAL"; else echo "$1 DIFFERENT ($REF vs $NEW)"; fi
