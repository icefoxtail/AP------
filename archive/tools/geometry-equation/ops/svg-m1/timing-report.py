# usage: timing-report.py  -> per-exam totals from timing.jsonl (agent wall time sum, tokens) and stage averages
import json,collections
rows=[json.loads(l) for l in open('/home/user/AP------/.tmp/svg-m1/timing.jsonl') if l.strip()]
by=collections.defaultdict(lambda:{'sec':0,'ktok':0,'figs':0,'stages':0})
st=collections.defaultdict(list)
for r in rows:
    e=r['exam']; b=by[e]; b['sec']+=r.get('sec',0); b['ktok']+=r.get('ktok',0); b['stages']+=1
    if r['stage'].startswith('plan'): b['figs']+=r.get('figs',0)
    k=r['stage'].split('-')[0]
    if r.get('sec'): st[k].append((r['sec'],r.get('ktok',0),r.get('figs',0)))
print('exam | agent-min | ktok | figs planned | stages')
for e,b in sorted(by.items()): print(f"{e} | {b['sec']/60:.0f} | {b['ktok']} | {b['figs']} | {b['stages']}")
print('\nstage | n | avg min | avg ktok | avg figs')
for k,v in sorted(st.items()): print(f"{k} | {len(v)} | {sum(x[0] for x in v)/len(v)/60:.1f} | {sum(x[1] for x in v)/len(v):.0f} | {sum(x[2] for x in v)/len(v):.1f}")
