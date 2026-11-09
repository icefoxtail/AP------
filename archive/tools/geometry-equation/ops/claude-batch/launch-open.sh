#!/bin/bash
# usage: launch-open.sh <inputkey> <tablekey> "<Q list>"  — OPEN items newly filled by dots; out = runs/<tablekey>/impl-open
IK=$1; TK=$2; QS=$3; source "$(dirname "$0")/env.sh"; cd "$R"; need_codex || exit 1
I=.tmp/work/triage-20261107/inputs/$IK/root-inputs
JS=$(PYTHONIOENCODING=utf-8 python -c "import json,glob;print(json.load(open(sorted(glob.glob('$I/q*/item.json'))[0],encoding='utf-8-sig'))['sourcePath'])")
M=""; case $IK in *math2*) M="이 시험지는 고2 수학II다. 교육과정 기준은 수학II로 읽는다. ";; *stat*) M="이 시험지는 고2 확률과통계다. 교육과정 기준은 확률과통계로 읽는다. ";; esac
OUT=.tmp/work/runs/$TK/impl-open EXTRA="${M}이 문항들은 이전에 OPEN이었고 dots가 입력 초안을 새로 채웠다(입력 초안 경로는 .tmp/work/triage-20261107/inputs/$IK/root-inputs/, 각 qNN의 STATUS.md에 이전 OPEN 사유·주의가 있다). 판정표 .tmp/work/triage-20261107/$TK.md의 OPEN 사유와 STATUS.md를 함께 읽고 해설대로 그림을 만든다. 이 시험지의 다른 문항은 이미 게시됐으니 건드리지 않는다. 엔진이 정말 못 그리거나 교육과정 밖이면 그 문항은 OPEN(사유)으로 남긴다." .tmp/work/run-impl.sh $IK "$JS" "$QS"
