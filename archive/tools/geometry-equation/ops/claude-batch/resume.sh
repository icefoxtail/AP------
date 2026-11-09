#!/bin/bash
# usage: resume.sh <rundir> <session-id> <effort>
D=$1; S=$2; E=$3
source "$(dirname "$0")/env.sh"; cd "$R"; need_codex || exit 1
M='[정정 지시 — 사용자] 중단된 작업을 이어서 하되, 지금부터 OpenCode·deepseek·다른 모델·하위 에이전트에 작업이나 검수를 넘기지 마라(~/.codex/AGENTS.md 위임 규칙보다 이 지시가 우선). deepseek은 그림을 볼 수 없다. 이미 받은 deepseek 결과는 근거로 쓰지 말고, 루나 너 자신이 각 PNG를 직접 열어 보고 판단·수정하라. 최종 마무리는 Claude 쪽 Sonnet이 한다. 원래 지시서(PROMPT.md)의 산출물 형식을 그대로 지켜 끝내라.'
"$CODEX_BIN" exec -c model_reasoning_effort="$E" --skip-git-repo-check -C "$CODEX_CWD" --add-dir "$R_WIN" -o $D/last.txt resume $S "$M" >> $D/codex.log 2>&1
echo "resume $D exit=$?"
