import json
from pathlib import Path
meta=[json.loads(x) for x in Path('archive/analysis/codex-r1-24-suncheon-math1-20261011/current-meta.jsonl').read_text(encoding='utf-8').splitlines()]
d=json.loads(Path('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json').read_text(encoding='utf-8'))
for key in sorted({(r['standardUnitKey'],r['subUnitKey']) for r in meta}):
 arr=[x for x in d['records'] if (x.get('standardUnitKey'),x.get('subUnitKey'))==key]
 stats={s:sum(x.get('mappingStatus')==s for x in arr) for s in sorted({x.get('mappingStatus') for x in arr})}
 sample=[{'rpmPath':x.get('rpmPath'),'status':x.get('mappingStatus'),'binding':x.get('bindingStatus'),'problemTypeKey':x.get('problemTypeKey'),'templateKey':x.get('templateKey')} for x in arr[:4]]
 print(json.dumps({'unit':key[0],'subUnit':key[1],'records':len(arr),'statuses':stats,'samples':sample},ensure_ascii=False))
PY
