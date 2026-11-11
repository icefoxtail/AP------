#!/bin/bash
# usage: pub-loop.sh <manifest> <exam regex> <key1> <key2> ...  — 한 쪽 초과 문항을 빼 가며 게시를 반복
M=$1; RX=$2; shift 2; KEYS=("$@")
git fetch -q origin main; git merge -q --ff-only FETCH_HEAD 2>/dev/null
for i in $(seq 1 12); do
  rm -f .tmp/svg-m1/runs/verify-batch.json; PYTHONUTF8=1 PYTHONIOENCODING=utf-8 python .tmp/svg-m1/pubflow.py --batch $M >.tmp/work/pub/last-pubflow.log 2>&1
  R=$(PYTHONUTF8=1 python -c "
import json,sys;sys.stdout.reconfigure(encoding='utf-8');d=json.load(open('.tmp/svg-m1/runs/verify-batch.json',encoding='utf-8'));print('|'.join(x['status'] for x in d))")
  echo "$R"; [ -n "$R" ] || { echo "STOP: pubflow crashed (see .tmp/work/pub/last-pubflow.log)"; exit 2; }
  IFS='|' read -ra ST <<< "$R"; BADN=0
  for j in "${!ST[@]}"; do
    X=$(echo "${ST[$j]}" | sed -nE 's/^RENDER_ERROR:MEASURED_SOLUTION_CHUNK_EXCEEDS_PAGE:solution-block:([0-9]+):.*/\1/p')
    if [ -n "$X" ]; then bash .tmp/work/pub-exclude.sh "${KEYS[$j]}" $X; BADN=1; elif [ "${ST[$j]}" != "OK" ]; then echo "STOP: ${KEYS[$j]} ${ST[$j]}"; exit 2; fi
  done
  [ $BADN = 0 ] && { echo ALL_OK; exit 0; }
  bash .tmp/work/pub-reset.sh "$RX"
done
exit 3
