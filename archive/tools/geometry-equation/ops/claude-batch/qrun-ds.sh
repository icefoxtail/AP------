#!/bin/bash
# usage: qrun-ds.sh <queue.tsv> <동시 슬롯 수>  — 대기열의 시험지마다 ds-launch-exam.sh(DeepSeek 초안)만 실행한다. 슬롯 = 동시에 도는 시험지 수.
# 다음 단계(Sonnet A: prompts/sonnet-exam-impl.md)는 메인이 ds-draft 폴더를 보고 따로 띄운다.
# SKIP: runs/<key>/ds-draft 또는 exam-impl 이 이미 있으면 건너뛴다. 슬롯 조절: echo 4 > .tmp/work/qrun-ds.slots.
# 중단: touch .tmp/work/qrun-ds.stop (진행 중인 것은 끝까지, 새로 띄우지 않음). 진행: .tmp/work/qrun-ds.log (끝난 시험지는 "DSDONE <key>")
cd "$(dirname "$0")/../.." || exit 1
Q=$1; N=${2:-3}; LOG=.tmp/work/qrun-ds.log
[ -f "$Q" ] || { echo "usage: qrun-ds.sh <queue.tsv> <슬롯>" >&2; exit 2; }
one(){ local k=$1 js=$2
  if [ -e .tmp/work/runs/$k/ds-draft ] || [ -e .tmp/work/runs/$k/exam-impl ]; then echo "$(date +%H:%M) SKIP(이미 있음) $k" >> $LOG; return; fi
  echo "$(date +%H:%M) START $k" >> $LOG
  bash .tmp/work/ds-launch-exam.sh "$k" "$js" >> $LOG 2>&1 </dev/null
  echo "$(date +%H:%M) DSDONE $k" >> $LOG; }
while IFS=$'\t' read -r k js; do
  [ -n "$k" ] || continue
  [ -f .tmp/work/qrun-ds.stop ] && { echo "$(date +%H:%M) STOP file" >> $LOG; break; }
  while N=$(cat .tmp/work/qrun-ds.slots 2>/dev/null || echo $N); [ "$(jobs -rp | wc -l)" -ge "$N" ]; do sleep 30; done
  one "$k" "$js" & sleep 30
done < "$Q"
wait; echo "$(date +%H:%M) QUEUE_EMPTY" >> $LOG
