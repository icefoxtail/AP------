# usage: ledger-upsert.py <spec.json>  spec={exam,src,camp,closedBy,note,triage:path,published:{ord:asset},open:{ord:[state,reason]},exempt_override:{ord:reason}}
import json,sys,collections
S=json.load(open(sys.argv[1])); P='/home/user/AP------/archive/tools/geometry-equation/production/exam-figure-ledger.json'
L=json.load(open(P),object_pairs_hook=collections.OrderedDict)
tri={r['ord']:r for r in json.load(open(S['triage']))}
pub={int(k):v for k,v in S.get('published',{}).items()}; opn={int(k):v for k,v in S.get('open',{}).items()}
items=[]
for o in sorted(tri):
    t=tri[o]; base={'ord':o}
    ex=S.get('exempt_override',{})
    if str(o) in ex: it={**base,'state':'EXEMPT','camp':S['camp'],'key':f"{S['camp']}-q{o}",'reason':ex[str(o)]}
    elif o in pub: it={**base,'state':'PUBLISHED','camp':S['camp'],'key':f"{S['camp']}-q{o}",'fam':t.get('family'),'figures':[pub[o]]}
    elif o in opn: it={**base,'state':opn[o][0],'camp':S['camp'],'key':f"{S['camp']}-q{o}",'fam':t.get('family'),'reason':opn[o][1]}
    elif t['decision'] in ('EXEMPT','KEEP_EXISTING'): it={**base,'state':'EXEMPT' if t['decision']=='EXEMPT' else 'PUBLISHED','camp':S['camp'],'key':f"{S['camp']}-q{o}",'reason':t.get('reason','')}
    else: it={**base,'state':'OPEN_OTHER','camp':S['camp'],'key':f"{S['camp']}-q{o}",'reason':'미처리: '+t['decision']}
    items.append(it)
status='CLOSED' if all(i['state'] in ('PUBLISHED','EXEMPT') for i in items) else 'OPEN'
entry=collections.OrderedDict([('exam',S['exam']),('src',S['src']),('items',items),('status',status),('closedBy',S.get('closedBy') if status=='CLOSED' else None),('note',S.get('note',''))])
ex=[i for i,e in enumerate(L['exams']) if e['exam']==S['exam']]
if ex: L['exams'][ex[0]]=entry
else: L['exams'].append(entry)
L['updated']=S.get('updated','2026-10-29')
open(P,'w',encoding='utf-8',newline='\n').write(json.dumps(L,ensure_ascii=False,indent=2)+'\n')
print(S['exam'],status,collections.Counter(i['state'] for i in items))
