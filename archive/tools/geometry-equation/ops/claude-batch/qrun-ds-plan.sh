#!/bin/bash
# usage: qrun-ds-plan.sh <list.txt>  — 목록(한 줄에 시험지 JS 저장소 상대경로; mk-ds-plan-list.cjs 가 만든다)의 시험지를 순서대로 ds-plan-exam.sh 로 한 번에 하나씩 돌린다(동시 실행 없음).
# 결과: 시험지마다 한 줄이 .tmp/work/qrun-ds-plan.log 에 쌓인다(ds-plan … 줄 그대로).
# OpenCode 한도(종료코드 3)에 걸리면 기다리지 않고 멈춘다(사용자 지시 2026-11-19: 한도에 걸리면 그만하고 멈춘다). 다시 하려면 같은 명령으로 다시 띄운다(통과한 문항은 이미 커밋돼 건너뛴다).
# FAIL(1)이면 그 시험지는 plan 폴더를 되돌려 놓았으니 로그만 남기고 다음 시험지로 간다. BUSY(4)(다른 ds-plan 실행 중)면 멈춘다.
# 중단: touch .tmp/work/qrun-ds-plan.stop (진행 중인 시험지는 끝까지, 다음 시험지부터 안 띄운다).
# 이 큐 자체도 하나만 돈다(.tmp/work/qrun-ds-plan.lock).
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
R=$(cd "$HERE" && git rev-parse --show-toplevel) || exit 2
cd "$R" || exit 2
Q=$1; LOG=.tmp/work/qrun-ds-plan.log; STOP=.tmp/work/qrun-ds-plan.stop
[ -f "$Q" ] || { echo "usage: qrun-ds-plan.sh <list.txt>" >&2; exit 2; }
mkdir -p .tmp/work
if ! mkdir .tmp/work/qrun-ds-plan.lock 2>/dev/null; then
  OLD=$(cat .tmp/work/qrun-ds-plan.lock/pid 2>/dev/null)
  if [ -n "$OLD" ] && kill -0 "$OLD" 2>/dev/null; then echo "qrun-ds-plan 이 이미 돌고 있다(pid $OLD)" >&2; exit 4; fi
  rm -rf .tmp/work/qrun-ds-plan.lock; mkdir .tmp/work/qrun-ds-plan.lock || exit 2
fi
echo $$ > .tmp/work/qrun-ds-plan.lock/pid
trap 'rm -f .tmp/work/qrun-ds-plan.lock/pid; rmdir .tmp/work/qrun-ds-plan.lock 2>/dev/null' EXIT
rm -f "$STOP"
while IFS= read -r js; do
  js=${js%$'\r'}; js=${js%%$'\t'*}; [ -n "$js" ] || continue
  [ -f "$STOP" ] && { echo "$(date +%H:%M) STOP file" >> $LOG; break; }
  line=$(bash "$HERE/ds-plan-exam.sh" "$js" 2>&1 </dev/null | tail -1)
  echo "$(date +%H:%M) $line" >> $LOG
  if echo "$line" | grep -q 'status=LIMIT'; then echo "$(date +%H:%M) LIMIT 한도에 걸려 멈춘다($js)" >> $LOG; exit 3; fi
  if echo "$line" | grep -q 'status=BUSY'; then echo "$(date +%H:%M) BUSY 멈춘다" >> $LOG; exit 4; fi
done < "$Q"
echo "$(date +%H:%M) QUEUE_END" >> $LOG
