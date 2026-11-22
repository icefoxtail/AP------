#!/bin/bash
# usage: qrun-ds-triage.sh <list.txt> [동시 수=1]  — 목록 파일(한 줄에 시험지 JS 저장소 상대경로, 학년 순서대로)의 시험지마다 ds-triage-exam.sh 를 돌린다.
# 한 번에 하나(기본) 또는 소수만. 결과는 <저장소>/.tmp/work/qrun-ds-triage.log 에 시험지마다 한 줄(ds-triage … 줄 그대로).
# OpenCode 한도(종료코드 3): 새 시험지를 띄우지 않고 30분 기다렸다가 같은 시험지부터 다시 한다(qrun-ds.sh 관례).
# 이미 판정이 끝난 시험지는 ds-triage-exam.sh 가 NOTHING 으로 바로 끝낸다. 중단: touch .tmp/work/qrun-ds-triage.stop (진행 중인 것은 끝까지).
# 판정은 DeepSeek만 한다(Sonnet 대체 금지).
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
R=$(cd "$HERE" && git rev-parse --show-toplevel) || exit 2
cd "$R" || exit 2
Q=$1; N=${2:-1}; LOG=.tmp/work/qrun-ds-triage.log; STOP=.tmp/work/qrun-ds-triage.stop
[ -f "$Q" ] || { echo "usage: qrun-ds-triage.sh <list.txt> [동시 수]" >&2; exit 2; }
mkdir -p .tmp/work
one(){ local js=$1 line rc
  while :; do
    line=$(bash "$HERE/ds-triage-exam.sh" "$js" 2>&1 </dev/null | tail -1); rc=${PIPESTATUS[0]}
    if echo "$line" | grep -q 'status=LIMIT'; then echo "$(date +%H:%M) LIMIT 30분 대기 $js" >> $LOG; sleep 1800; [ -f $STOP ] && return; continue; fi
    echo "$(date +%H:%M) $line" >> $LOG; return
  done; }
while IFS= read -r js; do
  js=${js%$'\r'}; [ -n "$js" ] || continue
  [ -f $STOP ] && { echo "$(date +%H:%M) STOP file" >> $LOG; break; }
  while [ "$(jobs -rp | wc -l)" -ge "$N" ]; do sleep 10; done
  one "$js" &
done < "$Q"
wait; echo "$(date +%H:%M) QUEUE_EMPTY" >> $LOG
