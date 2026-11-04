# usage: ledger-upsert.py <spec.json>  spec={exam,src,camp,closedBy,note,triage:path,published:{ord:asset},open:{ord:[state,reason]},exempt_override:{ord:reason}}
import json,sys,collections
from datetime import date
from portable_root import repo_root, validate_triage
S=json.load(open(sys.argv[1], encoding='utf-8-sig')); P=repo_root()/'archive/tools/geometry-equation/production/exam-figure-ledger.json'
L=json.load(open(P,encoding='utf-8-sig'),object_pairs_hook=collections.OrderedDict)
tri,bank=validate_triage(repo_root(),S['src'],json.load(open(S['triage'],encoding='utf-8-sig')))
pub={int(k):v for k,v in S.get('published',{}).items()}; opn={int(k):v for k,v in S.get('open',{}).items()}
if not tri: raise ValueError('empty triage')
if not set(pub).issubset(tri) or not set(opn).issubset(tri): raise ValueError('ledger ord missing from triage')
if any(tri[o]['decision'] not in ('FIGURE','REPLACE') for o in pub): raise ValueError('invalid published triage decision')
if any(int(o) not in tri or tri[int(o)]['decision']!='EXEMPT' for o in S.get('exempt_override',{})): raise ValueError('exempt override cannot hide unresolved decision')
for o,asset in pub.items():
    p=(repo_root()/'archive'/asset).resolve()
    if bank[o]['image']!=asset or not p.is_relative_to((repo_root()/'archive').resolve()) or not p.is_file(): raise ValueError(f'q{o}: published asset does not match source')
items=[]
for o in sorted(tri):
    t=tri[o]; base={'ord':o}
    ex=S.get('exempt_override',{})
    if str(o) in ex: it={**base,'state':'EXEMPT','camp':S['camp'],'key':f"{S['camp']}-q{o}",'reason':ex[str(o)]}
    elif o in pub: it={**base,'state':'PUBLISHED','camp':S['camp'],'key':f"{S['camp']}-q{o}",'fam':t.get('family'),'figures':[pub[o]]}
    elif t['decision'] in ('CONTENT','UNSUPPORTED','NO_SOURCE_FIGURE'): it={**base,'state':{'CONTENT':'OPEN_CONTENT','UNSUPPORTED':'OPEN_UNSUPPORTED','NO_SOURCE_FIGURE':'OPEN_SOURCE'}[t['decision']],'camp':S['camp'],'key':f"{S['camp']}-q{o}",'fam':t.get('family'),'reason':t.get('reason','')}
    elif o in opn: it={**base,'state':opn[o][0],'camp':S['camp'],'key':f"{S['camp']}-q{o}",'fam':t.get('family'),'reason':opn[o][1]}
    elif t['decision'] in ('KEEP','KEEP_EXISTING'): it={**base,'state':'PUBLISHED','camp':S['camp'],'key':f"{S['camp']}-q{o}",'fam':t.get('family'),'figures':[bank[o]['image']]}
    elif t['decision']=='EXEMPT': it={**base,'state':'EXEMPT','camp':S['camp'],'key':f"{S['camp']}-q{o}",'reason':t.get('reason','')}
    else: it={**base,'state':'OPEN_OTHER','camp':S['camp'],'key':f"{S['camp']}-q{o}",'reason':'미처리: '+t['decision']}
    items.append(it)
status='CLOSED' if all(i['state'] in ('PUBLISHED','EXEMPT') for i in items) else 'OPEN'
entry=collections.OrderedDict([('exam',S['exam']),('src',S['src']),('items',items),('status',status),('closedBy',S.get('closedBy') if status=='CLOSED' else None),('note',S.get('note',''))])
ex=[i for i,e in enumerate(L['exams']) if e['exam']==S['exam']]
if ex: L['exams'][ex[0]]=entry
else: L['exams'].append(entry)
L['updated']=date.today().isoformat()
open(P,'w',encoding='utf-8',newline='\n').write(json.dumps(L,ensure_ascii=False,indent=2)+'\n')
print(S['exam'],status,collections.Counter(i['state'] for i in items))
