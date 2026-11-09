#!/bin/bash
# usage: qrun.sh <queue.tsv> <동시 슬롯 수>  — 대기열의 시험지마다 launch-exam → launch-exam-rev 를 이어서 돌린다. 슬롯 = 동시에 도는 시험지 수.
# 슬롯 조절: echo 8 > .tmp/work/qrun.slots. 중단: touch .tmp/work/qrun.stop (진행 중인 것은 끝까지, 새로 띄우지 않음). 진행: .tmp/work/qrun.log
cd "$(dirname "$0")/../.." || exit 1
Q=$1; N=${2:-6}; LOG=.tmp/work/qrun.log
one(){ local k=$1 js=$2
  [ -e .tmp/work/runs/$k/exam-impl ] && { echo "$(date +%H:%M) SKIP(이미 있음) $k" >> $LOG; return; }
  echo "$(date +%H:%M) START $k" >> $LOG
  bash .tmp/work/launch-exam.sh "$k" "$js" >> $LOG 2>&1
  bash .tmp/work/launch-exam-rev.sh "$k" "$js" >> $LOG 2>&1
  echo "$(date +%H:%M) REVDONE $k" >> $LOG; }
while IFS=$'\t' read -r k js; do
  [ -f .tmp/work/qrun.stop ] && { echo "$(date +%H:%M) STOP file" >> $LOG; break; }
  while N=$(cat .tmp/work/qrun.slots 2>/dev/null || echo $N); [ "$(jobs -rp | wc -l)" -ge "$N" ]; do sleep 30; done
  one "$k" "$js" & sleep 30
done < "$Q"
wait; echo "$(date +%H:%M) QUEUE_EMPTY" >> $LOG
