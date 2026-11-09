#!/bin/bash
# usage: launch-rev-open2.sh <inputkey> <tablekey> — like launch-rev-open.sh when input key differs (e.g. 19-palma-h1 -> 19-palma)
IK=$1; K=$2; source "$(dirname "$0")/env.sh"; cd "$R"; need_codex || exit 1
I=.tmp/work/triage-20261107/inputs/$IK/root-inputs
JS=$(PYTHONIOENCODING=utf-8 python -c "import json,glob;print(json.load(open(sorted(glob.glob('$I/q*/item.json'))[0],encoding='utf-8-sig'))['sourcePath'])")
IMPL=.tmp/work/runs/$K/impl-open REV=.tmp/work/runs/$K/rev-open EXTRA="이번 검수 대상은 <IMPL>에 있는 문항뿐이다(입력 STATUS.md는 $I/qNN/). 다른 문항은 보지 않는다. 기존 해설 그림이 있는 문항은 새 그림이 학생 이해에 더 나은지도 판단한다." .tmp/work/run-rev.sh $K "$JS"
