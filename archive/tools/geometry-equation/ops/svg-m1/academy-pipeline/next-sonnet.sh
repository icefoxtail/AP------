#!/bin/bash
# usage: bash .tmp/work/next-sonnet.sh — QUEUE.txt 첫 줄을 꺼내 dots 초안을 받고 구현 지시서(PROMPT.md)만 만든다. 출력: KEY<TAB>JS<TAB>OUT
cd "$(dirname "$0")/../.."
L=$(head -1 .tmp/work/QUEUE.txt); [ -n "$L" ] || { echo "QUEUE empty"; exit 0; }
K=${L%%:*}; JS=${L#*:}
[ -f "$JS" ] || { echo "ERROR no JS $JS"; exit 1; }
B=$(git ls-remote origin "refs/heads/codex/svg-$K-*" | tail -1 | awk '{print $2}'); if [ -n "$B" ]; then git fetch -q origin "$B" && git archive FETCH_HEAD triage-20261107/inputs/$K 2>/dev/null | tar -x -C .tmp/work/; fi
R=$(ls .tmp/work/triage-20261107/inputs/$K/ROOT_*.md 2>/dev/null | head -1)
mkdir -p .tmp/work/runs/$K
if [ -n "$R" ]; then export EXTRA="dots 초안 검토 문서: $R 를 먼저 읽고 root-inputs 초안을 출발점으로 삼아라."; fi
P=$(PROMPT_ONLY=1 bash .tmp/work/launch-exam.sh "$K" "$JS" 2>&1 | tail -1)
[ -f "$P" ] || { echo "ERROR prompt $P"; exit 1; }
sed -i '1d' .tmp/work/QUEUE.txt
printf '%s\t%s\t%s\n' "$K" "$JS" "$(dirname "$P")"
