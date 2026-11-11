#!/bin/bash
# usage: pub-exclude.sh <key> <ord>  — pub/<key>의 review/rows에서 ord를 빼고 triage를 UNSUPPORTED로
cd .tmp/work/pub/$1 && for f in review rows triage; do [ -f $f.full.json ] || cp $f.json $f.full.json; done && python - "$2" <<'PY'
import json,sys
X=int(sys.argv[1])
for f in ['review','rows']:
    d=[x for x in json.load(open(f+'.json',encoding='utf-8')) if x['ord']!=X]
    open(f+'.json','wb').write(json.dumps(d,ensure_ascii=False,indent=1).encode('utf-8'))
t=json.load(open('triage.json',encoding='utf-8'))
for x in t:
    if x['ord']==X: x['decision']='UNSUPPORTED'
open('triage.json','wb').write(json.dumps(t,ensure_ascii=False,indent=1).encode('utf-8'))
print('excluded',X)
PY
