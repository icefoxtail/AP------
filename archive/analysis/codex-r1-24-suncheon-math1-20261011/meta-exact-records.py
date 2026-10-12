import json
from pathlib import Path
rows=[json.loads(x) for x in Path('archive/analysis/codex-r1-24-suncheon-math1-20261011/current-meta.jsonl').read_text(encoding='utf-8').splitlines()]
pt={r['problemTypeKey'] for r in rows if r.get('problemTypeKey')}; tpl={r['templateKey'] for r in rows if r.get('templateKey')}; cc={x for r in rows for x in (r.get('crossConceptKeys') or [])}; cond={x for r in rows for x in (r.get('conditionKeys') or [])}
def find_records(node, keynames, wanted, out):
 if isinstance(node,dict):
  for key in keynames:
   val=node.get(key)
   if isinstance(val,str) and val in wanted:out.append(node);break
  for v in node.values():find_records(v,keynames,wanted,out)
 elif isinstance(node,list):
  for v in node:find_records(v,keynames,wanted,out)
for f,keynames,wanted in [('archive/data/meta-foundation/compiled/taxonomy_registry.json',['problemTypeKey','templateKey','crossConceptKey','conditionKey'],pt|tpl|cc|cond),('archive/data/meta-foundation/canonical/condition_registry.json',['conditionKey'],cond)]:
 d=json.loads(Path(f).read_text(encoding='utf-8'));out=[];find_records(d,keynames,wanted,out);print('FILE',f)
 for x in out:print(json.dumps(x,ensure_ascii=False))
PY
