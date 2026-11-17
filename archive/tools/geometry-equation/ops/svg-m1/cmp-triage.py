import json,sys
from figure_ledger import find_exam
E=find_exam('25_팔마중_2학기_중간_중1_기출')  # 그 시험지 장부 파일 하나만 읽는다
gt={i['ord']:i['state'] for i in (E['items'] if E else [])}
for f in sys.argv[1:]:
    try: t=json.load(open(f))
    except Exception as ex: print(f,'ERR',ex); continue
    agree=0; rows=[]
    for r in t:
        g='FIGURE' if gt.get(r['ord'])=='PUBLISHED' else 'EXEMPT'
        d=r['decision']; ok=(d==g); agree+=ok
        if not ok: rows.append(f"q{r['ord']}: {d} vs ledger {g} — {r.get('reason','')[:70]}")
    print(f.split('/')[-1], f'agree {agree}/{len(t)}'); print('  '+'\n  '.join(rows))
