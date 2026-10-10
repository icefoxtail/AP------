import json
from pathlib import Path
rows=[json.loads(x) for x in Path('archive/analysis/codex-r1-24-suncheon-math1-20261011/current-meta.jsonl').read_text(encoding='utf-8').splitlines()]
keys={x for r in rows for x in (r.get('crossConceptKeys') or [])}
d=json.loads(Path('archive/data/meta-foundation/compiled/concept_registry.json').read_text(encoding='utf-8'))
print('schema/status',d.get('schemaVersion'),d.get('status'),'keys',list(d))
def walk(n):
 if isinstance(n,dict):
  if any(v in keys for v in n.values() if isinstance(v,str)):print(json.dumps(n,ensure_ascii=False))
  for v in n.values():walk(v)
 elif isinstance(n,list):
  for v in n:walk(v)
walk(d)
PY
