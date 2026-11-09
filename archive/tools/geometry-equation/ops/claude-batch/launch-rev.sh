#!/bin/bash
# usage: launch-rev.sh <key>  — JS from root-inputs item.json; math2 keys get the 수학II curriculum note
K=$1; source "$(dirname "$0")/env.sh"; cd "$R"; need_codex || exit 1
I=.tmp/work/triage-20261107/inputs/$K/root-inputs
JS=$(PYTHONIOENCODING=utf-8 python -c "import json,glob;print(json.load(open(sorted(glob.glob('$I/q*/item.json'))[0],encoding='utf-8-sig'))['sourcePath'])")
M=""; case $K in *math2*) M="이 시험지는 고2 수학II다. 교육과정 기준은 고1이 아니라 수학II(다항함수의 극한·미분·적분, 그 이전 과정 포함)로 읽는다. ";; *stat*) M="이 시험지는 고2 확률과통계다. 교육과정 기준은 확률과통계(경우의 수·확률·통계)로 읽는다. ";; esac
EXTRA="${M}참고: 판정표 .tmp/work/triage-20261107/$K.md 의 판정·이력을 따른다." .tmp/work/run-rev.sh $K "$JS"
