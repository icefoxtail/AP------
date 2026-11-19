#!/bin/bash
# usage: [DS_TIMEOUT=7200] [DS_CWD_BASE=…] [NO_PUSH=1] ds-plan-exam.sh <시험지 JS 저장소 상대경로>
# 시험지 하나의 "plan 대기" 문항(장부 OPEN_LAYOUT "plan 대기…" − 이미 plan/판정이 있는 문항)을 DeepSeek(opencode-go/deepseek-v4.1-flash)이 plan으로 쓰고
# 엔진 렌더(ARCHIVE_BOUND)와 PNG 확인까지 하게 한다(지시문 prompts/ds-plan.md). 끝나면 기계 검증(ds-plan-lib.cjs validate):
#   문항마다 plan 파일+렌더 ARCHIVE_BOUND+PNG, 또는 판정(UNSUPPORTED/EXEMPT/CONTENT)+사유, caption/alt 언어 계약, JSON 읽힘, 예상 밖 변경 없음.
# 못 통과한 문항이 있으면 그 문항만 1회 다시 시킨다. 그래도 못 통과한 문항은 plan 파일을 치우고(백업) 장부 그대로 plan 대기로 남긴다.
# 통과한 문항이 하나라도 있으면 그 시험지 plan 폴더만 git add·commit 하고 data/svg-plans-20261117 로 push 한다(NO_PUSH=1 이면 commit 만).
# 마지막 줄: "ds-plan <이름> status=<OK|PARTIAL|NOTHING|FAIL|LIMIT|BUSY> targets=N ok=N bound=N unsupported=N exempt=N content=N bad=N calls=N secs=N [sha=…]"
#   종료코드 0=OK/PARTIAL/NOTHING, 1=FAIL, 3=OpenCode 한도(통과한 문항은 이미 커밋), 4=BUSY(다른 ds-plan 실행 중)
# DeepSeek 은 한 번에 하나만 연다(.tmp/work/ds-plan.lock). 렌더 슬롯은 공장과 공유한다(RENDER_LOCK_DIR 기본 공장 폴더, 없으면 이 저장소의 .tmp/work).
# 실행 방식은 ds-triage-exam.sh 와 같다: 저장소 밖 빈 cwd, 지시는 표준입력(UTF-8), 시작(init)에서 150초 안에 출력이 없으면 그 실행만 종료하고 최대 3번 재시도.
JS=$1
[ -n "$JS" ] || { echo "usage: ds-plan-exam.sh <시험지 JS 저장소 상대경로>" >&2; exit 2; }
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
R=$(cd "$HERE" && git rev-parse --show-toplevel) || exit 2
cd "$R" || exit 2
[ -f "$JS" ] || { echo "ERROR: 시험지 JS가 없다(저장소 루트 기준): $JS" >&2; exit 2; }
command -v opencode >/dev/null 2>&1 || { echo "ERROR: opencode 가 PATH 에 없다." >&2; exit 2; }
[ -f .tmp/work/render.mjs ] && [ -f .tmp/svg-m1/svg2png.cjs ] || { echo "ERROR: .tmp/work 또는 .tmp/svg-m1 이 없다. README.md '새 PC 준비' 1~3을 먼저 한다(restore.sh)." >&2; exit 2; }
[ -d .tmp/apmath-visual-engine/dependencies/node_modules ] || [ -n "${GEOMETRY_NODE_MODULES:-}" ] || echo "WARN: 렌더 의존성(.tmp/apmath-visual-engine/dependencies)이 없다. GEOMETRY_NODE_MODULES 를 지정하거나 junction 을 만든다." >&2
R_WIN=$(pwd -W 2>/dev/null || pwd)
REL=${JS#archive/exams/original/}; REL=${REL%.js}
NAME=$(basename "$JS" .js)
PLANDIR=docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/$REL
BRANCH=${PLAN_BRANCH:-data/svg-plans-20261117}
OUT=.tmp/work/plan-ds/$NAME
LIB="node $HERE/ds-plan-lib.cjs"
DS_MODEL=${DS_MODEL:-opencode-go/deepseek-v4.1-flash}
TO=${DS_TIMEOUT:-7200}
CWD_BASE=${DS_CWD_BASE:-C:/Users/USER/ds-svg-cwd}
FACTORY_LOCKS=C:/Users/USER/Desktop/AP------/.claude/worktrees/agent-afa4a32718edfb280/.tmp/work
if [ -z "${RENDER_LOCK_DIR:-}" ] && [ -d "$FACTORY_LOCKS" ]; then export RENDER_LOCK_DIR=$FACTORY_LOCKS; fi
mkdir -p "$CWD_BASE" .tmp/work
T0=$(date +%s); CALLS=0; SHA=""
cnt(){ node -e "const f=process.argv[1],k=process.argv[2];let n=0;try{for(const x of JSON.parse(require('fs').readFileSync(f,'utf8')).ok){const r=JSON.parse(require('fs').readFileSync(require('path').join(process.argv[3],'q'+x,'result.json'),'utf8'));if(k==='FIGURE'?r.decision==='FIGURE':r.decision===k)n++}}catch{}console.log(n)" "$OUT/validate.json" "$1" "$OUT"; }
fin(){ local ok=0 bad=0 br=0 un=0 ex=0 ct=0
  if [ -f "$OUT/validate.json" ]; then
    ok=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).ok.length)"); bad=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).bad.length)")
    br=$(cnt FIGURE); un=$(cnt UNSUPPORTED); ex=$(cnt EXEMPT); ct=$(cnt CONTENT); fi
  echo "ds-plan $NAME status=$1 targets=${TARGETS:-0} ok=$ok bound=$br unsupported=$un exempt=$ex content=$ct bad=$bad calls=$CALLS secs=$(( $(date +%s)-T0 ))${SHA:+ sha=$SHA}"
  rmdir .tmp/work/ds-plan.lock 2>/dev/null; exit "$2"; }

# 동시에 하나만(DeepSeek 인스턴스 1개). 죽은 실행의 잠금은 PID 로 판별해 치운다.
if ! mkdir .tmp/work/ds-plan.lock 2>/dev/null; then
  OLD=$(cat .tmp/work/ds-plan.lock/pid 2>/dev/null)
  if [ -n "$OLD" ] && kill -0 "$OLD" 2>/dev/null; then TARGETS=0; echo "ds-plan $NAME status=BUSY targets=0 ok=0 bound=0 unsupported=0 exempt=0 content=0 bad=0 calls=0 secs=0 (다른 ds-plan 실행 중 pid $OLD)"; exit 4; fi
  rm -rf .tmp/work/ds-plan.lock; mkdir .tmp/work/ds-plan.lock || exit 2
fi
echo $$ > .tmp/work/ds-plan.lock/pid
trap 'rm -f .tmp/work/ds-plan.lock/pid; rmdir .tmp/work/ds-plan.lock 2>/dev/null' EXIT
fin2(){ fin "$@"; }

# 시작 전 plan 폴더가 깨끗해야 한다(남의 변경과 섞지 않는다)
if [ -n "$(git status --porcelain --untracked-files=all -- "$PLANDIR")" ]; then
  echo "ERROR: $PLANDIR 에 커밋 안 된 변경이 있다. 정리한 뒤 다시 한다." >&2; TARGETS=0; fin2 FAIL 1; fi

rm -rf "$OUT"; mkdir -p "$OUT/scratch"
TARGETS=$($LIB prep "$JS" "$OUT") || fin2 FAIL 1
[ "$TARGETS" -gt 0 ] || fin2 NOTHING 0

limit_hit(){ sed -E 's/\x1b\[[0-9;]*m//g' "$OUT/ds.log" | tail -30 | grep -qiE 'rate.?limit|usage limit|quota|too many requests|status.?429|limit (reached|exceeded)'; }

# DeepSeek 한 번 호출. $1 = 추가 지시(재시도 때 검증 문제 목록)
call_ds(){
  { sed -e "s#<WORKTREE>#$R_WIN#g" -e "s#<PLANDIR>#$R_WIN/$PLANDIR#g" -e "s#<OUT>#$R_WIN/$OUT#g" -e "s#<EXAM>#$R_WIN/$JS#g" "$HERE/prompts/ds-plan.md"; echo
    echo "시험지: $JS"; echo "<PLANDIR> = $R_WIN/$PLANDIR"; echo "<OUT> = $R_WIN/$OUT"; echo "대상 문항 수: $TARGETS"; echo
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
    echo "ds-plan: try $try stuck at init, restarting" | tee -a "$LOG" >&2
    WP=$(cat /proc/$PID/winpid 2>/dev/null)
    if [ -n "$WP" ]; then taskkill //F //T //PID "$WP" >/dev/null 2>&1; else kill $PID 2>/dev/null; fi
    sleep 2; rmdir "$D" 2>/dev/null
  done
  CALLS=$((CALLS+1)); return $RC
}

: > "$OUT/ds.log"
LIMIT=0
call_ds ""; RC=$?
[ $RC -ne 0 ] && limit_hit && LIMIT=1
$LIB validate "$JS" "$OUT" > "$OUT/validate1.txt" 2>&1; VRC=$?
if [ $VRC -ne 0 ] && [ $LIMIT = 0 ]; then
  BADN=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).bad.map(b=>'Q'+b.no).join(', '))")
  call_ds "[재시도] 직전 실행에서 아래 문제로 검증을 통과하지 못한 문항만 다시 한다($BADN). 통과한 문항의 파일은 건드리지 않는다. 각 문항을 고쳐 렌더·PNG 확인 후 result.json 까지 다시 쓴다(plan을 고쳤으면 반드시 다시 렌더). 해결 못 하면 그 문항은 규칙대로 UNSUPPORTED 로 두고 오류 코드와 시도를 쓴다.
$(cat "$OUT/validate1.txt")"
  RC=$?; [ $RC -ne 0 ] && limit_hit && LIMIT=1
  $LIB validate "$JS" "$OUT" > "$OUT/validate2.txt" 2>&1; VRC=$?
fi
[ -f "$OUT/validate.json" ] || { [ $LIMIT = 1 ] && fin2 LIMIT 3; fin2 FAIL 1; }
# 시험지 JS 원문은 바뀌면 안 된다. 바뀌었으면 되돌린다. 그 밖의 plan 폴더 밖 추적 파일 변경은 경고만 한다(같은 작업 트리의 다른 작업일 수 있다).
if ! git diff --quiet -- "$JS"; then echo "WARN: 시험지 JS 가 바뀌어 되돌린다: $JS" >> "$OUT/finalize.log"; git checkout -- "$JS"; fi
git status --porcelain --untracked-files=no | grep -v -F "$PLANDIR" | sed 's/^/WARN: plan 폴더 밖 변경(건드리지 않음): /' >> "$OUT/finalize.log"
OKS=$($LIB finalize "$JS" "$OUT" 2> "$OUT/finalize.log") || { cat "$OUT/finalize.log" >&2; fin2 FAIL 1; }
cat "$OUT/finalize.log" >&2
if [ -z "$OKS" ]; then [ $LIMIT = 1 ] && fin2 LIMIT 3; fin2 FAIL 1; fi

# 통과한 문항이 있으면 이 시험지 plan 폴더만 커밋·push
BADCNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).bad.length)")
git add -A -- "$PLANDIR" || fin2 FAIL 1
if git diff --cached --quiet -- "$PLANDIR"; then fin2 FAIL 1; fi
git commit -q -m "docs(svg-plans): ds-plan $NAME plan 대기 $TARGETS문항 중 통과 $(echo $OKS | wc -w)문항 (DeepSeek 초안, 기계 검증 통과)" -- "$PLANDIR" || fin2 FAIL 1
SHA=$(git rev-parse --short HEAD)
if [ "${NO_PUSH:-0}" != 1 ]; then
  if ! git push -q origin "$BRANCH" 2>"$OUT/push.log"; then
    # 원격이 앞서 있으면 병합(이력을 고쳐 쓰지 않는다)한 뒤 한 번 더
    git fetch -q origin "$BRANCH" 2>>"$OUT/push.log" && git merge -q --no-edit "origin/$BRANCH" >>"$OUT/push.log" 2>&1 && git push -q origin "$BRANCH" 2>>"$OUT/push.log" \
      || { cat "$OUT/push.log" >&2; echo "ERROR: push 실패(커밋 $SHA 은 로컬에 있다)" >&2; fin2 FAIL 1; }
    SHA=$(git rev-parse --short HEAD)
  fi
fi
[ $LIMIT = 1 ] && fin2 LIMIT 3
[ "$BADCNT" -gt 0 ] && fin2 PARTIAL 0
fin2 OK 0
