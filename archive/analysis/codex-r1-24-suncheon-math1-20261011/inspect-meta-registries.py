import json
from pathlib import Path
root=Path('.')
meta=[json.loads(x) for x in Path('archive/analysis/codex-r1-24-suncheon-math1-20261011/current-meta.jsonl').read_text(encoding='utf-8').splitlines()]
keys=set()
for r in meta:
 for k in ['problemTypeKey','templateKey','conceptClusterKey']:
  if r.get(k):keys.add(r[k])
 for k in ['crossConceptKeys','conditionKeys']:
  keys.update(r.get(k) or [])
for file in ['archive/data/meta-foundation/compiled/taxonomy_registry.json','archive/data/meta-foundation/canonical/condition_registry.json']:
 d=json.loads(Path(file).read_text(encoding='utf-8'));print('REGISTRY',file)
 def walk(node,path='$'):
  if isinstance(node,dict):
   hits=[k for k in keys if k in str(node)]
   if hits: print(json.dumps({'path':path,'keys':hits,'record':node},ensure_ascii=False)[:4000])
   else:
    for k,v in node.items():walk(v,path+'.'+k)
  elif isinstance(node,list):
   for i,v in enumerate(node):walk(v,f'{path}[{i}]')
 walk(d)
PY
