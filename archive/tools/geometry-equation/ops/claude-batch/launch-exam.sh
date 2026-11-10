#!/bin/bash
# usage: [OUT=…] [EXTRA="…"] [INPUT_KEYS="k1 k2"] launch-exam.sh <tablekey> <시험지 JS 저장소 상대경로>
# 시험지 하나 전체를 루나(effort high)에 넣어 모든 문항을 판정·구현한다(사용자 결정 2026-11-09).
# 출력: 기본 .tmp/work/runs/<key>/exam-impl (이미 있으면 exam-impl2, exam-impl3 …로 새 폴더). TABLE.md·SUMMARY.md·qNN/ 이 생긴다.
# 환경변수: CODEX_BIN, CODEX_CWD, GEOMETRY_NODE_MODULES(env.sh 참고), OUT, EXTRA(지시 덧붙임), INPUT_KEYS(dots 입력 폴더 key 직접 지정)
K=$1; JS=$2
[ -n "$K" ] && [ -n "$JS" ] || { echo "usage: launch-exam.sh <tablekey> <시험지 JS 저장소 상대경로>" >&2; exit 2; }
source "$(dirname "$0")/env.sh"; source "$(dirname "$0")/exam-common.sh"; cd "$R"
{ [ -n "${PROMPT_ONLY:-}" ] || need_codex || exit 1; }; need_svgm1 || exit 1
[ -f "$JS" ] || { echo "ERROR: 시험지 JS가 없다(저장소 루트 기준): $JS" >&2; exit 1; }
if [ -z "${OUT:-}" ]; then
  OUT=.tmp/work/runs/$K/exam-impl; i=1
  while [ -e "$OUT" ]; do i=$((i+1)); OUT=.tmp/work/runs/$K/exam-impl$i; done
fi
mkdir -p "$OUT"
INP=$(exam_inputs "$K")
{
  prompt_file .tmp/work/prompts/exam-impl.md; echo
  echo "시험지: $JS"
  echo "판정표(참고만): .tmp/work/triage-20261107/$K.md"
  echo "입력 초안 폴더(출발점, 상태 무관; 있는 것만): ${INP:-없음}"
  echo "대상 문항: 시험지의 모든 문항"
  echo "<OUT> = $OUT"
  exam_subject "$JS"
  echo
  echo "[기존 해설 그림 분류표] (exam-figs.cjs 자동 계산; NONE=그림 없음, NEW=신형, OLD_SVG/OLD_PNG=구형, MISSING_FILE=참조만 있고 파일 없음)"
  exam_figs "$JS"
  echo
  echo "${EXTRA:-}"
} > "$OUT/PROMPT.md"
# PROMPT_ONLY=1: 지시서만 만들고 Codex는 띄우지 않는다(Sonnet 에이전트가 이 PROMPT.md를 직접 수행, 2026-11-10)
if [ -n "${PROMPT_ONLY:-}" ]; then echo "$OUT/PROMPT.md"; exit 0; fi
"$CODEX_BIN" exec -c model_reasoning_effort="high" --skip-git-repo-check -C "$CODEX_CWD" --add-dir "$R_WIN" -o "$OUT/last.txt" - < "$OUT/PROMPT.md" > "$OUT/codex.log" 2>&1
echo "exam-impl $K exit=$? out=$OUT"
