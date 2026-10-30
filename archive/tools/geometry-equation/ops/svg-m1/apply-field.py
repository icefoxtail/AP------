# usage: apply-field.py <exam js> <content-check.json> <ord,ord,...>
# Whole-field replace (solution/answer/choices[i] not supported) inside the item block whose "id" equals ord; uses patch "new" only.
import json,re,sys
js,cc,ords=sys.argv[1],sys.argv[2],{int(x) for x in sys.argv[3].split(',')}
s=open(js,encoding='utf-8',newline='').read()
for r in json.load(open(cc)):
    if r['ord'] not in ords or r.get('verdict')!='DEFECT': continue
    i=s.find(f'"id": {r["ord"]},'); assert i>=0,r['ord']
    j=s.find('"id": ',i+5); j=len(s) if j<0 else j
    blk=s[i:j]
    for p in r['patches']:
        f=p['field']; assert f in('solution','answer'),f
        m=list(re.finditer(rf'"{f}":\s*"((?:[^"\\]|\\.)*)"',blk)); assert len(m)==1,(r['ord'],f,len(m))
        enc=json.dumps(p['new'],ensure_ascii=False)
        blk=blk[:m[0].start()]+f'"{f}": '+enc+blk[m[0].end():]
        print('ok',r['ord'],f)
    s=s[:i]+blk+s[j:]
open(js,'w',encoding='utf-8',newline='').write(s)
