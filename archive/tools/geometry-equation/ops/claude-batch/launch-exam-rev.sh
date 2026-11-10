#!/bin/bash
# usage: [IMPL=…] [REV=…] [EFFORT=xhigh] [EXTRA="…"] launch-exam-rev.sh <tablekey> <시험지 JS 저장소 상대경로>
# launch-exam.sh 결과를 루나(effort xhigh)가 시험지 전체로 검수한다.
# IMPL 기본 = .tmp/work/runs/<key>/ 의 가장 최신 exam-impl[N]; REV 기본 = 짝이 되는 exam-rev[N] (exam-impl→exam-rev, exam-impl2→exam-rev2).
K=$1; JS=$2
[ -n "$K" ] && [ -n "$JS" ] || { echo "usage: launch-exam-rev.sh <tablekey> <시험지 JS 저장소 상대경로>" >&2; exit 2; }
source "$(dirname "$0")/env.sh"; source "$(dirname "$0")/exam-common.sh"; cd "$R"
{ [ -n "${PROMPT_ONLY:-}" ] || need_codex || exit 1; }; need_svgm1 || exit 1
[ -f "$JS" ] || { echo "ERROR: 시험지 JS가 없다(저장소 루트 기준): $JS" >&2; exit 1; }
if [ -z "${IMPL:-}" ]; then
  L=$(ls -1 ".tmp/work/runs/$K" 2>/dev/null | grep -E '^exam-impl[0-9]*$' | sort -V | tail -1)
  [ -n "$L" ] || { echo "ERROR: .tmp/work/runs/$K 에 exam-impl* 가 없다. 먼저 launch-exam.sh" >&2; exit 1; }
  IMPL=.tmp/work/runs/$K/$L
fi
[ -f "$IMPL/TABLE.md" ] || { echo "ERROR: $IMPL/TABLE.md 가 없다(구현이 끝나지 않았다)." >&2; exit 1; }
[ -f "$IMPL/last.txt" ] || echo "WARN: $IMPL/last.txt 가 없다. 구현 실행이 아직 끝나지 않았을 수 있다." >&2
if [ -z "${REV:-}" ]; then
  SUF=${IMPL##*exam-impl}
  REV=.tmp/work/runs/$K/exam-rev$SUF
  [ -e "$REV/PROMPT.md" ] && { echo "ERROR: $REV 이 이미 있다. REV=… 로 다른 폴더를 지정하거나 먼저 정리한다." >&2; exit 1; }
fi
mkdir -p "$REV"
INP=$(exam_inputs "$K")
{
  prompt_file .tmp/work/prompts/exam-review.md; echo
  echo "시험지: $JS"
  echo "판정표(참고만): .tmp/work/triage-20261107/$K.md"
  echo "입력 초안 폴더(참고; 있는 것만): ${INP:-없음}"
  echo "<IMPL> = $IMPL (TABLE.md·SUMMARY.md 참고)"
  echo "<REV> = $REV"
  exam_subject "$JS"
  echo
  echo "[기존 해설 그림 분류표] (exam-figs.cjs 자동 계산; NONE=그림 없음, NEW=신형, OLD_SVG/OLD_PNG=구형, MISSING_FILE=참조만 있고 파일 없음)"
  exam_figs "$JS"
  echo
  echo "${EXTRA:-}"
} > "$REV/PROMPT.md"
# PROMPT_ONLY=1: 지시서만 만들고 Codex는 띄우지 않는다(Sonnet 에이전트가 이 PROMPT.md를 직접 수행, 2026-11-10)
if [ -n "${PROMPT_ONLY:-}" ]; then echo "$REV/PROMPT.md"; exit 0; fi
"$CODEX_BIN" exec -c model_reasoning_effort="${EFFORT:-xhigh}" --skip-git-repo-check -C "$CODEX_CWD" --add-dir "$R_WIN" -o "$REV/last.txt" - < "$REV/PROMPT.md" > "$REV/codex.log" 2>&1
echo "exam-rev $K exit=$? rev=$REV"
