#!/bin/bash
# usage: [APPLY=0] [DS_TIMEOUT=1800] [DS_CWD_BASE=…] ds-triage-exam.sh <시험지 JS 저장소 상대경로>
# 시험지 하나의 미판정 문항만 DeepSeek(opencode-go/deepseek-v4.1-flash)에 판정시키고(FIGURE/REPLACE/KEEP_EXISTING/EXEMPT/CONTENT),
# 기계 검증(빠진 문항·판정 값·사유·없는 번호)에 통과하면 ledger-upsert.py 로 장부에 넣는다. 그림 플랜·렌더는 하지 않는다.
# 결과: <저장소>/.tmp/work/triage-ds/<시험지 이름>/ (PROMPT.md, INPUT.md, triage.json, ds.log, spec.json …)
# 마지막 줄: "ds-triage <이름> status=<OK|NOTHING|FAIL|LIMIT> pending=N calls=N secs=N" (종료코드 0=OK/NOTHING, 1=FAIL, 3=OpenCode 한도)
# 장부 반영: 검증 통과 때만. 장부에 이미 있는 문항은 바꾸지 않는다. FIGURE/REPLACE 는 OPEN_LAYOUT("plan 대기: …")로 들어간다(pubflow 의 기존 관례).
# 실행 방식은 ds-launch-exam.sh 와 같다: 저장소 밖 빈 cwd, 지시는 표준입력, 시작(init)에서 150초 안에 출력이 없으면 그 실행만 종료하고 최대 3번 재시도.
JS=$1
[ -n "$JS" ] || { echo "usage: ds-triage-exam.sh <시험지 JS 저장소 상대경로>" >&2; exit 2; }
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
R=$(cd "$HERE" && git rev-parse --show-toplevel) || exit 2
cd "$R" || exit 2
[ -f "$JS" ] || { echo "ERROR: 시험지 JS가 없다(저장소 루트 기준): $JS" >&2; exit 2; }
command -v opencode >/dev/null 2>&1 || { echo "ERROR: opencode 가 PATH 에 없다." >&2; exit 2; }
R_WIN=$(pwd -W 2>/dev/null || pwd)
NAME=$(basename "$JS" .js)
OUT=.tmp/work/triage-ds/$NAME
LIB="node $HERE/ds-triage-lib.cjs"
DS_MODEL=${DS_MODEL:-opencode-go/deepseek-v4.1-flash}
TO=${DS_TIMEOUT:-1800}
CWD_BASE=${DS_CWD_BASE:-C:/Users/USER/ds-svg-cwd}
mkdir -p "$OUT" "$CWD_BASE"
T0=$(date +%s); CALLS=0
fin(){ echo "ds-triage $NAME status=$1 pending=${PEND:-0} calls=$CALLS secs=$(( $(date +%s)-T0 ))"; exit "$2"; }

PEND=$($LIB prep "$JS" "$OUT") || fin FAIL 1
[ "$PEND" -gt 0 ] || fin NOTHING 0

# DeepSeek 한 번 호출. $1 = 추가 지시(재시도 때 검증 문제 목록)
call_ds(){
  { sed "s#<OUT>#$R_WIN/$OUT#g" "$HERE/prompts/ds-triage.md"; echo
    echo "시험지: $JS"; echo "<OUT> = $R_WIN/$OUT"; echo "대상 문항 수: $PEND"; echo
    echo "[대상 문항]"; cat "$OUT/INPUT.md"; echo; echo "$1"; } > "$OUT/PROMPT.md"
  local LOG=$OUT/ds.log RC=1 try D SZ0 PID started i WP
  for try in 1 2 3; do
    D=$(mktemp -d "$CWD_BASE/run-XXXXXX"); SZ0=$(stat -c %s "$LOG" 2>/dev/null || echo 0)
    ( cd "$D" && exec timeout "$TO" opencode run --standalone --auto -m "$DS_MODEL" < "$R/$OUT/PROMPT.md" ) >> "$LOG" 2>&1 &
    PID=$!; started=0
    for i in $(seq 1 30); do
      sleep 5
      if [ "$(stat -c %s "$LOG")" -gt "$SZ0" ]; then started=1; break; fi
      kill -0 $PID 2>/dev/null || { started=1; break; }
    done
    if [ $started = 1 ]; then wait $PID; RC=$?; echo "exit $RC" >> "$LOG"; rmdir "$D" 2>/dev/null; break; fi
    echo "ds-triage: try $try stuck at init, restarting" | tee -a "$LOG" >&2
    WP=$(cat /proc/$PID/winpid 2>/dev/null)
    if [ -n "$WP" ]; then taskkill //F //T //PID "$WP" >/dev/null 2>&1; else kill $PID 2>/dev/null; fi
    sleep 2; rmdir "$D" 2>/dev/null
  done
  CALLS=$((CALLS+1)); return $RC
}
limit_hit(){ sed -E 's/\x1b\[[0-9;]*m//g' "$OUT/ds.log" | tail -30 | grep -qiE 'rate.?limit|usage limit|quota|too many requests|status.?429|limit (reached|exceeded)'; }

: > "$OUT/ds.log"; rm -f "$OUT/triage.json"
call_ds ""
if ! V=$($LIB validate "$JS" "$OUT" 2>&1); then
  echo "$V" > "$OUT/validate1.txt"
  limit_hit && fin LIMIT 3
  rm -f "$OUT/triage.json"
  call_ds "[재시도] 직전 출력은 아래 문제로 검증에 실패했다. 대상 문항 전부를 형식대로 다시 써서 $R_WIN/$OUT/triage.json 에 저장한다.
$V"
  if ! V=$($LIB validate "$JS" "$OUT" 2>&1); then echo "$V" > "$OUT/validate2.txt"; limit_hit && fin LIMIT 3; fin FAIL 1; fi
fi
if [ "${APPLY:-1}" = 1 ]; then $LIB apply "$JS" "$OUT" > "$OUT/apply.log" 2>&1 || { cat "$OUT/apply.log" >&2; fin FAIL 1; }; fi
fin OK 0
