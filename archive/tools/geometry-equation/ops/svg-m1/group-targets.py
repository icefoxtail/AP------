# usage: group-targets.py <prefix> <maxPerGroup> EXAM...  -> runs/t-<prefix>-<family>[N].txt (form-based groups, 사용자 지시 2026-11-02)
import json,sys,glob,collections
pre,mx,ex=sys.argv[1],int(sys.argv[2]),sys.argv[3:]
R='/home/user/AP------/.tmp/svg-m1/runs/'; by=collections.defaultdict(list)
for e in ex:
    t=json.load(open(R+f'triage-{e}.json'))
    src=glob.glob(f'/home/user/AP------/archive/exams/original/**/{e}.js',recursive=True)[0].split('/home/user/AP------/')[1]
    for r in t:
        if r['decision'] in ('REPLACE','FIGURE'):
            f=(r.get('family') or 'OTHER').upper()
            f={'NUMBER_LINE':'COORD','SET':'OTHER'}.get(f,f)
            by[f].append(f"EXAM {e} | PACKET /home/user/AP------/.tmp/svg-m1/packets/{e}.json | SOURCE {src} | ord {r['ord']} ({r.get('family')}) [{r['decision']}{' existing: '+r.get('reason','')[:220] if r['decision']=='REPLACE' else ''}]: {r.get('figureIdea','')}")
for f,L in by.items():
    n=(len(L)+mx-1)//mx
    for k in range(n):
        part=L[k::n]; name=f"{pre}-{f.lower()}{k+1 if n>1 else ''}"
        open(R+f't-{name}.txt','w').write('\n'.join(part)+'\n'); print(name,len(part))
