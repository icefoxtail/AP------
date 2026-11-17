# usage: ledger-upsert.py <spec.json>  spec={exam,src,camp,closedBy,note,triage:path,published:{ord:asset},open:{ord:[state,reason]},exempt_override:{ord:reason},demote:{ord:[state,reason]}}
# 그 시험지 파일(production/exam-figure-ledger/<src 경로>.json) 하나만 고친다.
# 문항 단위 병합: 장부에 이미 PUBLISHED인 문항은 published/exempt_override/demote 로 그 번호를 직접 넘길 때만 바뀐다.
# (일부 문항만 다시 게시할 때 pubflow가 넘기는 open 목록이 기존 PUBLISHED를 OPEN으로 덮던 사고를 막는다.)
import json,sys,collections
from portable_root import repo_root, validate_triage, ord_key, item_key
import figure_ledger as FL
S=json.load(open(sys.argv[1], encoding='utf-8-sig')); ROOT=repo_root()
tri,bank=validate_triage(ROOT,S['src'],json.load(open(S['triage'],encoding='utf-8-sig')))
pub={ord_key(k):v for k,v in S.get('published',{}).items()}; opn={ord_key(k):v for k,v in S.get('open',{}).items()}
dem={ord_key(k):v for k,v in S.get('demote',{}).items()}; exo={ord_key(k):v for k,v in S.get('exempt_override',{}).items()}
if not tri: raise ValueError('empty triage')
if not set(pub).issubset(tri) or not set(opn).issubset(tri) or not set(dem).issubset(tri): raise ValueError('ledger ord missing from triage')
if any(tri[o]['decision'] not in ('FIGURE','REPLACE') for o in pub): raise ValueError('invalid published triage decision')
if any(o not in tri or tri[o]['decision']!='EXEMPT' for o in exo): raise ValueError('exempt override cannot hide unresolved decision')
if set(dem)&(set(pub)|set(exo)) or any(not isinstance(v,list) or len(v)!=2 or not str(v[0]).startswith('OPEN_') for v in dem.values()): raise ValueError('demote must be {ord:[OPEN_*,reason]} and not also published/exempt')
for o,asset in pub.items():
    p=(ROOT/'archive'/asset).resolve()
    if bank[o]['image']!=asset or not p.is_relative_to((ROOT/'archive').resolve()) or not p.is_file(): raise ValueError(f'q{o}: published asset does not match source')
def fresh(o):
    t=tri[o]; base={'ord':o}
    if o in exo: return {**base,'state':'EXEMPT','camp':S['camp'],'key':item_key(S['camp'],o),'reason':exo[o]}
    if o in pub: return {**base,'state':'PUBLISHED','camp':S['camp'],'key':item_key(S['camp'],o),'fam':t.get('family'),'figures':[pub[o]]}
    if o in dem: return {**base,'state':dem[o][0],'camp':S['camp'],'key':item_key(S['camp'],o),'fam':t.get('family'),'reason':dem[o][1]}
    if t['decision'] in ('CONTENT','UNSUPPORTED','NO_SOURCE_FIGURE'): return {**base,'state':{'CONTENT':'OPEN_CONTENT','UNSUPPORTED':'OPEN_UNSUPPORTED','NO_SOURCE_FIGURE':'OPEN_SOURCE'}[t['decision']],'camp':S['camp'],'key':item_key(S['camp'],o),'fam':t.get('family'),'reason':t.get('reason','')}
    if o in opn: return {**base,'state':opn[o][0],'camp':S['camp'],'key':item_key(S['camp'],o),'fam':t.get('family'),'reason':opn[o][1]}
    if t['decision'] in ('KEEP','KEEP_EXISTING'): return {**base,'state':'PUBLISHED','camp':S['camp'],'key':item_key(S['camp'],o),'fam':t.get('family'),'figures':[bank[o]['image']]}
    if t['decision']=='EXEMPT': return {**base,'state':'EXEMPT','camp':S['camp'],'key':item_key(S['camp'],o),'reason':t.get('reason','')}
    return {**base,'state':'OPEN_OTHER','camp':S['camp'],'key':item_key(S['camp'],o),'reason':'미처리: '+t['decision']}
old=FL.load_exam(S['src'],ROOT)
if old is not None and old['exam']!=S['exam']: raise ValueError('exam name differs from ledger entry for src')
explicit=set(pub)|set(exo)|set(dem); kept=[]; extra=[]
def choose(o,prev):
    if prev.get('state')=='PUBLISHED' and o not in explicit:
        if fresh(o)!=prev: kept.append(o)
        return prev
    return fresh(o)
order_key=lambda o:(isinstance(o,str),o)
if old is None: items=[fresh(o) for o in sorted(tri,key=order_key)]
else:
    by={FL.ord_id(o):o for o in tri}; items=[]; seen=set()
    for prev in old['items']:
        k=FL.ord_id(prev['ord'])
        if k in by: items.append(choose(by[k],prev)); seen.add(k)
        else: items.append(prev); extra.append(prev['ord'])
    items+=[fresh(o) for o in sorted(tri,key=order_key) if FL.ord_id(o) not in seen]
status='CLOSED' if all(i['state'] in FL.TERMINAL for i in items) else 'OPEN'
closed_by=(S.get('closedBy') or (old.get('closedBy') if old is not None and old.get('status')=='CLOSED' else None)) if status=='CLOSED' else None
if old is None: entry=collections.OrderedDict([('exam',S['exam']),('src',S['src']),('items',items),('status',status),('closedBy',closed_by),('note',S.get('note',''))])
else:
    entry=dict(old); entry.update(exam=S['exam'],src=S['src'],items=items,status=status,closedBy=closed_by,note=S.get('note',''))
FL.save_exam(entry,ROOT,allow_demote=list(dem)+list(exo))
print(S['exam'],status,collections.Counter(i['state'] for i in items))
if kept: print(' kept PUBLISHED (not passed in this spec):',kept)
if extra: print(' kept items not in source triage:',extra)
