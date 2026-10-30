# usage: split-targets.py <triage.json> <prefix> [maxPerGroup=6] [skip ords comma]
import json,sys
t=json.load(open(sys.argv[1])); pre=sys.argv[2]; mx=int(sys.argv[3]) if len(sys.argv)>3 else 6
skip={int(x) for x in sys.argv[4].split(',')} if len(sys.argv)>4 and sys.argv[4] else set()
fam_guide={'SOLID':'solid','STAT':'stat','COORD':'plane+graph','NUMBER_LINE':'core','SET':'core'}
by={}
for r in t:
    if r['decision'] not in ('FIGURE','REPLACE') or r['ord'] in skip: continue
    f=r.get('family','PLANE'); by.setdefault('solid' if f=='SOLID' else 'stat' if f=='STAT' else 'plane',[]).append(r)
groups=[]
for k,rs in by.items():
    for i in range(0,len(rs),mx): groups.append((f'{k}{i//mx+1}',rs[i:i+mx]))
for g,rs in groups:
    lines=[f"ord {r['ord']} ({r.get('family')}, guide-{fam_guide.get(r.get('family'),'plane')}.md): {'[REPLACE existing figure: '+r.get('reason','')[:120]+'] ' if r['decision']=='REPLACE' else ''}{r.get('figureIdea','')}" for r in rs]
    open(f'{pre}-{g}.txt','w').write('\n'.join(lines)+'\n'); print(g,[r['ord'] for r in rs])
