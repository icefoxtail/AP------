#!/bin/bash
# usage: full-golden.sh <base-ref> <outdir>  -> renders every golden item on <base-ref> (temp worktree) and on the current checkout, byte-compares.
# Mechanical; run in background. Result: <outdir>/summary.txt (IDENTICAL/DIFFERENT/FAILED per item).
set -u
BASE=$1; OUTD=$2; H=/home/user/AP------/.tmp/svg-m1; ROOT=/home/user/AP------
mkdir -p "$OUTD"
BWT=${BWT:-$ROOT/.tmp/gold-base}
if [ ! -d "$BWT" ]; then git -C $ROOT worktree add -q --detach "$BWT" "$BASE"; else git -C "$BWT" checkout -q --detach "$BASE"; fi
mkdir -p "$BWT/.tmp"; [ -e "$BWT/.tmp/apmath-visual-engine" ] || ln -s $ROOT/.tmp/apmath-visual-engine "$BWT/.tmp/apmath-visual-engine"
ITEMS=${ITEMS:-$(python3 -c "import json;print(' '.join(i['dir'] for i in json.load(open('$ROOT/archive/tools/geometry-equation/ops/golden.manifest.json'))['items']))")}
SUM=${SUM:-summary.txt}
: > "$OUTD/$SUM"
for it in $ITEMS; do
  for side in base new; do
    if [ $side = base ]; then W=$BWT; else W=$ROOT; fi
    O="$OUTD/$side/$it"; rm -rf "$O"; mkdir -p "$O"
    (cd "$W"; python3 -c "
import json,sys
m=json.load(open('archive/tools/geometry-equation/ops/golden.manifest.json'))
for x in m['items']:
    if x['dir']=='$it': json.dump({'sourcePath':x['sourcePath'],'ordinal':x['ordinal']},open('$O/item.json','w'))
" 2>/dev/null
     [ -f "$W/archive/tools/geometry-equation/ops/golden/$it/plan.json" ] && PYTHONIOENCODING=utf-8 PYTHONPATH="$W/.tmp/apmath-visual-engine/dependencies/python" timeout 900 node archive/tools/geometry-equation/production/render-plan.mjs --item "$O/item.json" --plan "archive/tools/geometry-equation/ops/golden/$it/plan.json" --out "$O/out" > "$O/render.log" 2>&1)
  done
  B=$(ls "$OUTD/base/$it"/out/*-solution.svg 2>/dev/null | head -1); N=$(ls "$OUTD/new/$it"/out/*-solution.svg 2>/dev/null | head -1)
  if [ -z "$B" ] && [ -z "$N" ]; then r=BOTH_FAILED_OR_NEW_ITEM; elif [ -z "$B" ]; then r=BASE_FAILED_OR_NEW_ITEM; elif [ -z "$N" ]; then r=NEW_FAILED; elif cmp -s "$B" "$N"; then r=IDENTICAL; else r=DIFFERENT; fi
  echo "$it $r" >> "$OUTD/$SUM"
done
echo DONE >> "$OUTD/$SUM"
