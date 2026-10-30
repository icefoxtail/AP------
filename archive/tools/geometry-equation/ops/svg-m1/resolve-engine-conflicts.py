# Resolve recurring cherry-pick conflicts: golden.manifest.json (union items, append new item notes) and hints.mjs (union of new lines).
import json,subprocess,re,os
os.chdir(os.getcwd())
show=lambda st,p: subprocess.run(['git','show',f':{st}:{p}'],capture_output=True,text=True).stdout
st=subprocess.run(['git','status','--short'],capture_output=True,text=True).stdout
P='archive/tools/geometry-equation/ops/golden.manifest.json'
if 'UU '+P in st:
    ours=json.loads(show(2,P)); theirs=json.loads(show(3,P)); base=json.loads(show(1,P) or '{"note":"","items":[]}')
    have={x['dir'] for x in ours['items']}
    for x in theirs['items']:
        if x['dir'] not in have:
            ours['items'].append(x)
            m=re.search(r' '+x['dir']+r' \(.*?(?= item\d\d \(|$)',theirs['note'])
            if m and m.group(0) not in ours['note']: ours['note']+=m.group(0)
    open(P,'w').write(json.dumps(ours,ensure_ascii=False,indent=1)+'\n'); print('manifest',len(ours['items']))
H='archive/tools/geometry-equation/ops/tools/hints.mjs'
if 'UU '+H in st:
    o=show(2,H).split('\n'); t=show(3,H).split('\n'); b=set(show(1,H).split('\n'))
    new=[l for l in t if l not in b and l.lstrip().startswith('[/') and l not in o]
    idx=max(i for i,l in enumerate(o) if l.strip()=='];')
    o=o[:idx]+[l if l.rstrip().endswith(',') else l.rstrip()+',' for l in new]+o[idx:]
    open(H,'w').write('\n'.join(o)); print('hints +',len(new))
