#!/bin/bash
# usage: [DS_TIMEOUT=7200] [DS_CWD_BASE=…] [NO_PUSH=1] [DS_DRY=1] ds-plan-exam.sh <시험지 JS 저장소 상대경로>
# 시험지 하나의 "plan 대기" 문항(장부 OPEN_LAYOUT "plan 대기…" − 이미 plan/판정이 있는 문항)을 DeepSeek(opencode-go/deepseek-v4.1-flash)이 plan으로 **글로만** 쓰게 한다
# (지시문 prompts/ds-plan.md; 사용자 지시 2026-11-19: 문항마다 렌더·PNG 확인은 너무 느리다. 렌더는 나중에 공장이 일괄로 하고 실패분은 수리로 넘긴다).
# 탐색 없이 답만(2026-11-19 사용자 지시: 문항당 9분 중 거의 전부가 가이드·엔진 소스·plan 폴더를 읽고 grep 하는 탐색이었다):
#   스크립트가 문항마다 문맥 꾸러미(원문·정답·해설, 장부 사유, 같은 subUnitKey 등의 본보기 plan 2~3개, 그 capability 의 가이드 발췌)를 INPUT-<k>.md 로 만들어 한 번에 5문항씩 넣고,
#   DeepSeek 은 도구 없는 agent(ds-plan-writer, opencode-agents/ 에서 ~/.config/opencode/agents 로 설치)로 `=== Q<번호> ===` + JSON 만 답한다. 파일 쓰기는 ds-plan-lib.cjs expand 가 한다.
# 끝나면 기계 검증(ds-plan-lib.cjs validate): 문항마다 plan 파일(JSON·capability·필수 최상위 필드·caption/alt 언어 계약·같은 capability 본보기에 없는 필드 없음)
#   또는 판정(UNSUPPORTED/EXEMPT/CONTENT)+사유, 예상 밖 변경 없음.
# 못 통과한 문항이 있으면 그 문항만(문제 목록·직전 답과 함께) 1회 다시 시킨다. 그래도 못 통과한 문항은 plan 파일을 치우고(백업) 장부 그대로 plan 대기로 남긴다.
# 통과한 문항이 하나라도 있으면 그 시험지 plan 폴더만 git add·commit 하고 data/svg-plans-20261117 로 push 한다(NO_PUSH=1 이면 commit 만).
# 마지막 줄: "ds-plan <이름> status=<OK|PARTIAL|NOTHING|FAIL|LIMIT|BUSY> targets=N ok=N plans=N unsupported=N exempt=N content=N bad=N calls=N secs=N [sha=…]"
#   종료코드 0=OK/PARTIAL/NOTHING, 1=FAIL, 3=OpenCode 한도(통과한 문항은 이미 커밋), 4=BUSY(다른 ds-plan 실행 중)
# DeepSeek 은 한 번에 하나만 연다(.tmp/work/ds-plan.lock). 
# 실행 방식은 ds-triage-exam.sh 와 같다: 저장소 밖 빈 cwd, 지시는 표준입력(UTF-8), 시작(init)에서 DS_INIT_WAIT(기본 150)초 안에 출력(머리 줄 "> <agent> · <model>")이 없으면 그 실행만 종료하고 최대 3번 재시도.
#   DS_AGENT 로 agent 이름을 바꾼다(기본 ds-plan-writer, 빈 값이면 agent 를 지정하지 않는다). DS_CHUNK(기본 5)는 호출 하나에 넣는 문항 수. DS_DRY=1 이면 커밋·push 를 건너뛴다(시험용).
#   답은 호출마다 $OUT/ds-<태그>.log 에 쌓이고(ANSI·CRLF 는 expand 가 걷어낸다) 합친 로그는 $OUT/ds.log.
JS=$1
[ -n "$JS" ] || { echo "usage: ds-plan-exam.sh <시험지 JS 저장소 상대경로>" >&2; exit 2; }
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
R=$(cd "$HERE" && git rev-parse --show-toplevel) || exit 2
cd "$R" || exit 2
[ -f "$JS" ] || { echo "ERROR: 시험지 JS가 없다(저장소 루트 기준): $JS" >&2; exit 2; }
command -v opencode >/dev/null 2>&1 || { echo "ERROR: opencode 가 PATH 에 없다." >&2; exit 2; }
[ -f .tmp/svg-m1/guide/guide-core.md ] || { echo "ERROR: .tmp/svg-m1 가이드가 없다. README.md '새 PC 준비' 2번을 먼저 한다." >&2; exit 2; }
R_WIN=$(pwd -W 2>/dev/null || pwd)
REL=${JS#archive/exams/original/}; REL=${REL%.js}
NAME=$(basename "$JS" .js)
PLANDIR=docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/$REL
BRANCH=${PLAN_BRANCH:-data/svg-plans-20261117}
OUT=.tmp/work/plan-ds/$NAME
LIB="node $HERE/ds-plan-lib.cjs"
DS_MODEL=${DS_MODEL:-opencode-go/deepseek-v4.1-flash}
DS_AGENT=${DS_AGENT-ds-plan-writer}
DS_INIT_WAIT=${DS_INIT_WAIT:-150}
[ -f "$HERE/opencode-agents/${DS_AGENT}.md" ] && [ ! -f "$HOME/.config/opencode/agents/${DS_AGENT}.md" ] && { mkdir -p "$HOME/.config/opencode/agents" && cp "$HERE/opencode-agents/${DS_AGENT}.md" "$HOME/.config/opencode/agents/${DS_AGENT}.md"; }
TO=${DS_TIMEOUT:-7200}
CWD_BASE=${DS_CWD_BASE:-C:/Users/USER/ds-svg-cwd}
mkdir -p "$CWD_BASE" .tmp/work
T0=$(date +%s); CALLS=0; SHA=""
cnt(){ node -e "try{const d=JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).decisions;console.log(Object.values(d).filter(x=>x==='$1').length)}catch{console.log(0)}"; }
fin(){ local ok=0 bad=0 br=0 un=0 ex=0 ct=0
  if [ -f "$OUT/validate.json" ]; then
    ok=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).ok.length)"); bad=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).bad.length)")
    br=$(cnt FIGURE); un=$(cnt UNSUPPORTED); ex=$(cnt EXEMPT); ct=$(cnt CONTENT); fi
  echo "ds-plan $NAME status=$1 targets=${TARGETS:-0} ok=$ok plans=$br unsupported=$un exempt=$ex content=$ct bad=$bad calls=$CALLS secs=$(( $(date +%s)-T0 ))${SHA:+ sha=$SHA}"
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

limit_hit(){ sed -E 's/\x1b\[[0-9;]*m//g' "$1" | tail -30 | grep -qiE 'rate.?limit|usage limit|quota|too many requests|status.?429|limit (reached|exceeded)'; }

# DeepSeek 한 번 호출. $1 = 문맥 꾸러미 파일($OUT 기준 이름), $2 = 로그 태그. 답은 $OUT/ds-<태그>.log 에 쌓인다.
call_ds(){
  local INPUT=$1 TAG=$2 LOG=$OUT/ds-$2.log RC=1 try D SZ0 PID started i WP AGENT_ARGS=()
  [ -n "$DS_AGENT" ] && AGENT_ARGS=(--agent "$DS_AGENT")
  { cat "$HERE/prompts/ds-plan.md"; echo; echo "시험지: $JS"; echo "대상 문항 수: $TARGETS"; echo; cat "$OUT/$INPUT"; } > "$OUT/PROMPT-$TAG.md"
  : > "$LOG"
  for try in 1 2 3; do
    D=$(mktemp -d "$CWD_BASE/run-XXXXXX"); SZ0=$(stat -c %s "$LOG" 2>/dev/null || echo 0)
    ( cd "$D" && exec timeout "$TO" opencode run --standalone -m "$DS_MODEL" "${AGENT_ARGS[@]}" < "$R/$OUT/PROMPT-$TAG.md" ) >> "$LOG" 2>&1 &
    PID=$!; started=0
    for i in $(seq 1 $(( (DS_INIT_WAIT + 4) / 5 ))); do
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
  cat "$LOG" >> "$OUT/ds.log"
  CALLS=$((CALLS+1)); return $RC
}

: > "$OUT/ds.log"
LIMIT=0
# 1차: 묶음(INPUT-<k>.md)마다 한 번씩. 한도에 걸리면 남은 묶음은 부르지 않는다.
K=0
while IFS= read -r _chunk; do
  [ -n "$_chunk" ] || continue
  K=$((K+1))
  call_ds "INPUT-$K.md" "$K"; RC=$?
  $LIB expand "$JS" "$OUT" "$OUT/ds-$K.log" >> "$OUT/expand.log" 2>&1
  if [ $RC -ne 0 ] && limit_hit "$OUT/ds-$K.log"; then LIMIT=1; break; fi
done < "$OUT/chunks.txt"
$LIB validate "$JS" "$OUT" > "$OUT/validate1.txt" 2>&1; VRC=$?
# 2차: 못 통과한 문항만 문제 목록·직전 답과 함께 1회
if [ $VRC -ne 0 ] && [ $LIMIT = 0 ]; then
  NR=$($LIB retry-prep "$JS" "$OUT" 2>> "$OUT/expand.log") || NR=0
  R2=0
  while [ "$R2" -lt "${NR:-0}" ]; do
    R2=$((R2+1))
    call_ds "INPUT-r$R2.md" "r$R2"; RC=$?
    $LIB expand "$JS" "$OUT" "$OUT/ds-r$R2.log" >> "$OUT/expand.log" 2>&1
    if [ $RC -ne 0 ] && limit_hit "$OUT/ds-r$R2.log"; then LIMIT=1; break; fi
  done
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
if [ "${DS_DRY:-0}" = 1 ]; then echo "DS_DRY: 커밋·push 를 건너뛴다(통과: $OKS)" >&2; fin2 OK 0; fi
BADCNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT/validate.json','utf8')).bad.length)")
git add -A -- "$PLANDIR" || fin2 FAIL 1
if git diff --cached --quiet -- "$PLANDIR"; then fin2 FAIL 1; fi
git commit -q -m "docs(svg-plans): ds-plan $NAME plan 대기 $TARGETS문항 중 통과 $(echo $OKS | wc -w)문항 (DeepSeek 글로만 작성, 문맥 꾸러미 입력, 렌더는 공장 일괄)" -- "$PLANDIR" || fin2 FAIL 1
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
