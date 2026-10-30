import json,sys
L=json.load(open('/home/user/AP------/archive/tools/geometry-equation/production/exam-figure-ledger.json'))
gt={i['ord']:i['state'] for e in L['exams'] if e['exam']=='25_팔마중_2학기_중간_중1_기출' for i in e['items']}
for f in sys.argv[1:]:
    try: t=json.load(open(f))
    except Exception as ex: print(f,'ERR',ex); continue
    agree=0; rows=[]
    for r in t:
        g='FIGURE' if gt.get(r['ord'])=='PUBLISHED' else 'EXEMPT'
        d=r['decision']; ok=(d==g); agree+=ok
        if not ok: rows.append(f"q{r['ord']}: {d} vs ledger {g} — {r.get('reason','')[:70]}")
    print(f.split('/')[-1], f'agree {agree}/{len(t)}'); print('  '+'\n  '.join(rows))
