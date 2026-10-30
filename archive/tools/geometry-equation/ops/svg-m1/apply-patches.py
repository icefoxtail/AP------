# usage: apply-patches.py <exam js> <content-check.json> <ord,ord,...>
# Replaces JSON-escaped old->new strings inside the item block whose "id" equals ord. Each old must occur exactly once in that block.
import json,sys,re
js,cc,ords=sys.argv[1],sys.argv[2],[int(x) for x in sys.argv[3].split(',')]
src=open(js,encoding='utf-8',newline='').read()
ids=[(m.start(),int(m.group(1))) for m in re.finditer(r'^\s*"id": (\d+),',src,re.M)]
def block(o):
    for i,(pos,v) in enumerate(ids):
        if v==o: return pos, ids[i+1][0] if i+1<len(ids) else len(src)
    raise SystemExit(f'no id {o}')
enc=lambda s: json.dumps(s,ensure_ascii=False)[1:-1]
for r in json.load(open(cc,encoding='utf-8')):
    if r['ord'] not in ords: continue
    for p in r['patches']:
        a,b=block(r['ord']); seg=src[a:b]
        old,new=enc(p['old']),enc(p['new'])
        if p['field']=='answer': old,new=f'"answer": "{old}"',f'"answer": "{new}"'
        elif p['field'].startswith('choices'): old,new=f'"{old}"',f'"{new}"'
        n=seg.count(old)
        if n!=1: raise SystemExit(f'ord {r["ord"]} field {p["field"]}: {n} matches')
        src=src[:a]+seg.replace(old,new)+src[b:]; print('ok',r['ord'],p['field'])
open(js,'w',encoding='utf-8',newline='').write(src)
