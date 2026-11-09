#!/bin/bash
# usage: run-impl.sh <examkey> <jsrel> <q list>
# 환경변수: CODEX_BIN(codex.exe 경로), CODEX_CWD(저장소 밖 빈 폴더), GEOMETRY_NODE_MODULES, OUT, EXTRA
K=$1; JS=$2; QS=$3
source "$(dirname "$0")/env.sh"; cd "$R"
need_codex || exit 1; need_svgm1 || exit 1
OUT=${OUT:-.tmp/work/runs/$K/impl}; mkdir -p $OUT
{ prompt_file .tmp/work/prompts/impl-common.md; echo; echo "시험지: $JS"; echo "판정표: .tmp/work/triage-20261107/$K.md"; echo "입력 초안: .tmp/work/triage-20261107/inputs/$K/root-inputs/"; echo "대상 문항: $QS"; echo "<OUT> = $OUT"; echo "${EXTRA:-}"; } > $OUT/PROMPT.md
"$CODEX_BIN" exec -c model_reasoning_effort="high" --skip-git-repo-check -C "$CODEX_CWD" --add-dir "$R_WIN" -o $OUT/last.txt - < $OUT/PROMPT.md > $OUT/codex.log 2>&1
echo "impl $K exit=$?"
