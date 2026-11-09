#!/bin/bash
# usage: [IMPL=… REV=… EXTRA=…] run-rev.sh <examkey> <jsrel>
# 환경변수: CODEX_BIN, CODEX_CWD, GEOMETRY_NODE_MODULES (env.sh 참고)
K=$1; JS=$2
source "$(dirname "$0")/env.sh"; cd "$R"
need_codex || exit 1; need_svgm1 || exit 1
IMPL=${IMPL:-.tmp/work/runs/$K/impl}; REV=${REV:-.tmp/work/runs/$K/rev}; mkdir -p $REV
{ prompt_file .tmp/work/prompts/review-common.md; echo; echo "시험지: $JS"; echo "판정표: .tmp/work/triage-20261107/$K.md"; echo "<IMPL> = $IMPL (SUMMARY.md 참고)"; echo "<REV> = $REV"; echo "${EXTRA:-}"; } > $REV/PROMPT.md
"$CODEX_BIN" exec --skip-git-repo-check -C "$CODEX_CWD" --add-dir "$R_WIN" -o $REV/last.txt - < $REV/PROMPT.md > $REV/codex.log 2>&1
echo "rev $K exit=$?"
