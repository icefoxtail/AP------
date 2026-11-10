#!/bin/bash
# usage: [OUT=…] [EXTRA="…"] [INPUT_KEYS="k1 k2"] [DS_TIMEOUT=7200] ds-launch-exam.sh <tablekey> <시험지 JS 저장소 상대경로>
# 시험지 하나 전체를 DeepSeek(opencode-go/deepseek-v4.1-flash)에 넣어 모든 문항을 판정하고 FIGURE/REPLACE 문항을 렌더까지 초안으로 만든다.
# DeepSeek은 그림을 볼 수 없다(사용자 결정 2026-11-10: 이 PC에서만 허용). PNG 판단은 다음 단계 Sonnet A(prompts/sonnet-exam-impl.md)가 한다.
# 출력: 기본 .tmp/work/runs/<key>/ds-draft (이미 있으면 ds-draft2, ds-draft3 …). TABLE.md·SUMMARY.md·qNN/ 이 생기고, 끝나면 last.txt, 로그는 ds.log.
# 실행 방식: 저장소 밖의 빈 폴더(DS_CWD_BASE/run-XXXX)에서 `opencode run --standalone --auto -m opencode-go/deepseek-v4.1-flash` 를 띄우고
#   지시는 표준입력(UTF-8)으로 준다. --auto = 명시적으로 거부되지 않은 권한(저장소 절대경로 읽기·쓰기, node 실행)을 자동 승인한다.
#   ~/.config/opencode 설정은 바꾸지 않는다(2026-11-10 확인: opencode v2.1.4 에서 --auto 만으로 외부 절대경로 읽기·쓰기·셸 실행이 된다).
#   --standalone 은 클라이언트와 함께 에이전트가 죽게 해 시간 제한·재시도가 확실하다.
# opencode 가 시작(init)에서 멈추는 일이 있어(2026-11-02) 150초 안에 로그에 첫 출력이 없으면 그 실행만 PID로 종료하고 최대 3번 다시 시도한다.
# 환경변수: DS_TIMEOUT(초, 기본 7200), DS_CWD_BASE(기본 C:/Users/USER/ds-svg-cwd), OUT, EXTRA, INPUT_KEYS, GEOMETRY_NODE_MODULES(env.sh 참고)
K=$1; JS=$2
[ -n "$K" ] && [ -n "$JS" ] || { echo "usage: ds-launch-exam.sh <tablekey> <시험지 JS 저장소 상대경로>" >&2; exit 2; }
source "$(dirname "$0")/env.sh"; source "$(dirname "$0")/exam-common.sh"; cd "$R"
need_svgm1 || exit 1
command -v opencode >/dev/null 2>&1 || { echo "ERROR: opencode 가 PATH 에 없다(이 PC 전용: npm 전역 설치 opencode v2)." >&2; exit 1; }
[ -f "$JS" ] || { echo "ERROR: 시험지 JS가 없다(저장소 루트 기준): $JS" >&2; exit 1; }
[ -n "${GEOMETRY_NODE_MODULES:-}" ] && export GEOMETRY_NODE_MODULES
DS_MODEL=${DS_MODEL:-opencode-go/deepseek-v4.1-flash}
TO=${DS_TIMEOUT:-7200}
CWD_BASE=${DS_CWD_BASE:-C:/Users/USER/ds-svg-cwd}
if [ -z "${OUT:-}" ]; then
  OUT=.tmp/work/runs/$K/ds-draft; i=1
  while [ -e "$OUT" ]; do i=$((i+1)); OUT=.tmp/work/runs/$K/ds-draft$i; done
fi
mkdir -p "$OUT" "$CWD_BASE" ".tmp/work/scratch/ds-$K"
INP=$(exam_inputs "$K")
{
  prompt_file .tmp/work/prompts/ds-exam-draft.md; echo
  echo "시험지: $JS"
  echo "판정표(참고만): .tmp/work/triage-20261107/$K.md"
  echo "입력 초안 폴더(출발점, 상태 무관; 있는 것만): ${INP:-없음}"
  echo "대상 문항: 시험지의 모든 문항"
  echo "<key> = $K"
  echo "<OUT> = $OUT"
  exam_subject "$JS"
  echo
  echo "[기존 해설 그림 분류표] (exam-figs.cjs 자동 계산; NONE=그림 없음, NEW=신형, OLD_SVG/OLD_PNG=구형, MISSING_FILE=참조만 있고 파일 없음)"
  exam_figs "$JS"
  echo
  echo "${EXTRA:-}"
} > "$OUT/PROMPT.md"
LOG="$OUT/ds.log"; : > "$LOG"
T0=$(date +%s)
RC=1
for try in 1 2 3; do
  D=$(mktemp -d "$CWD_BASE/run-XXXXXX")
  SZ0=$(stat -c %s "$LOG")
  ( cd "$D" && exec timeout "$TO" opencode run --standalone --auto -m "$DS_MODEL" < "$R/$OUT/PROMPT.md" ) >> "$LOG" 2>&1 &
  PID=$!
  started=0
  for i in $(seq 1 30); do
    sleep 5
    if [ "$(stat -c %s "$LOG")" -gt "$SZ0" ]; then started=1; break; fi
    kill -0 $PID 2>/dev/null || { started=1; break; }
  done
  if [ $started = 1 ]; then
    wait $PID; RC=$?
    echo "exit $RC" >> "$LOG"
    rmdir "$D" 2>/dev/null
    break
  fi
  echo "ds-launch-exam: try $try stuck at init in $D, restarting" | tee -a "$LOG" >&2
  WP=$(cat /proc/$PID/winpid 2>/dev/null)
  if [ -n "$WP" ]; then taskkill //F //T //PID "$WP" >/dev/null 2>&1; else kill $PID 2>/dev/null; fi
  sleep 2; rmdir "$D" 2>/dev/null
done
# last.txt = ds.log 에서 ANSI 색 코드를 지운 마지막 40줄
sed -E 's/\x1b\[[0-9;]*m//g' "$LOG" | tail -40 > "$OUT/last.txt"
T1=$(date +%s)
echo "ds-draft $K exit=$RC secs=$((T1-T0)) out=$OUT"
