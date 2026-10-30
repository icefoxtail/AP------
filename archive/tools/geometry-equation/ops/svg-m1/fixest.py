# usage: fixest.py <exam-substr> <stage> <sec> <ktok>  — replace the latest est entry
import sys,json
ex,st,sec,kt=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
L=open('timing.jsonl').read().splitlines()
for i in range(len(L)-1,-1,-1):
    d=json.loads(L[i])
    if ex in d['exam'] and d['stage']==st and d.get('est'):
        d.update(sec=sec,ktok=kt); d.pop('est'); L[i]=json.dumps(d,ensure_ascii=False); break
open('timing.jsonl','w').write('\n'.join(L)+'\n'); print('ok')
