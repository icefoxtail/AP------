#!/bin/bash
# usage: launch-impl.sh <key>  — targets = root-inputs folders, JS from item.json
K=$1; source "$(dirname "$0")/env.sh"; cd "$R"; need_codex || exit 1
I=.tmp/work/triage-20261107/inputs/$K/root-inputs
JS=$(PYTHONIOENCODING=utf-8 python -c "import json,glob;print(json.load(open(sorted(glob.glob('$I/q*/item.json'))[0],encoding='utf-8-sig'))['sourcePath'])")
QS=$(ls $I | tr 'q' 'Q' | tr '\n' ' ')
EXTRA="${EXTRA0:-}참고: 판정표 .tmp/work/triage-20261107/$K.md 의 문항별 판정·이유·기존 이력(OPEN, KEEP 등)을 따른다. 판정표가 KEEP·OPEN·EXEMPT로 둔 문항은 만들지 않는다. 기존 그림이 있는 문항은 기존 그림과 비교한다(결함 없는 새 엔진 그림이면 KEEP_EXISTING)." .tmp/work/run-impl.sh $K "$JS" "$QS"
