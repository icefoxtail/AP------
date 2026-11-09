#!/bin/bash
# usage: launch-rev-open.sh <key>  — luna review of runs/<key>/impl-open into rev-open (JS from input item.json)
K=$1; source "$(dirname "$0")/env.sh"; cd "$R"; need_codex || exit 1
I=.tmp/work/triage-20261107/inputs/$K/root-inputs
JS=$(PYTHONIOENCODING=utf-8 python -c "import json,glob;print(json.load(open(sorted(glob.glob('$I/q*/item.json'))[0],encoding='utf-8-sig'))['sourcePath'])")
M=""; case $K in *math2*) M="이 시험지는 고2 수학II다. 교육과정 기준은 수학II로 읽는다. ";; *stat*) M="이 시험지는 고2 확률과통계다. 교육과정 기준은 확률과통계로 읽는다. ";; esac
IMPL=.tmp/work/runs/$K/impl-open REV=.tmp/work/runs/$K/rev-open EXTRA="${M}이번 검수 대상은 <IMPL>에 있는 문항뿐이다(입력 STATUS.md는 $I/qNN/). 다른 문항은 보지 않는다." .tmp/work/run-rev.sh $K "$JS"
