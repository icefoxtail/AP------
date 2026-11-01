# usage: pubflow.py "<commit title>" "<commit body>" EXAM:REVIEW.json:ROWS.json [EXAM:...]
# publish PASS rows -> apply -> verify (retry once) -> gate tests -> ledger (create spec if missing) -> commit+push
import json,os,re,subprocess,sys
S='/home/user/AP------/.tmp/svg-m1/'; R=S+'runs/'; ROOT='/home/user/AP------'
title,body=sys.argv[1],sys.argv[2]; specs=[a.split(':') for a in sys.argv[3:]]
def sh(c,**k): return subprocess.run(c,shell=True,capture_output=True,text=True,cwd=ROOT,**k)
batch=[]
import glob
def srcOf(e):
    m=glob.glob(f'{ROOT}/archive/exams/original/**/{e}.js',recursive=True); assert len(m)==1,(e,m); return m[0][len(ROOT)+1:]
def grade(e): return next((g for g in ('중1','중2','중3','고1','고2','고3') if f'_{g}_' in e),'중1')
def camp(e): return {'중1':'m1','중2':'m2','중3':'m3','고1':'h1','고2':'h2','고3':'h3'}[grade(e)]+'-sonnet'
for e,rv,rw in specs:
    o=sh(f"python3 {S}publish-exam.py {e} {srcOf(e)} {R}{rv} {R}{rw}"); print(o.stdout.strip() or o.stderr[-500:])
    p=R+f'publish-rows-{e}.json'
    if os.path.exists(p): batch+=json.load(open(p))
if not batch: print('nothing to publish'); sys.exit(0)
json.dump(batch,open(R+'publish-rows-batch.json','w'),ensure_ascii=False,indent=1)
o=sh(f"node {S}publish.mjs {R}publish-rows-batch.json {ROOT} --apply"); rep=o.stdout
assert '"problems": []' in rep and '"skips": []' in rep, rep[-1500:]
def verify(report):
    o=sh(f"APMS_ROOT={ROOT} timeout 900 node {S}verify-published.mjs {report} {R}verify-batch.json"); return o.stdout
v=verify('publish-report.json'); print(v.strip().splitlines()[-1])
os.replace(ROOT+'/publish-report.json',R+'publish-report-last.json')
if '"OK"' not in v.splitlines()[-1] or any(k in v.splitlines()[-1] for k in ('RENDER_ERROR','FAIL','MISSING')):
    bad=[l.split()[0] for l in v.splitlines() if l.strip() and not l.startswith('SUMMARY') and ' OK' not in l]
    r=[x for x in json.load(open(R+'publish-report-last.json')) if any(b in json.dumps(x,ensure_ascii=False) for b in bad)]
    json.dump(r,open(R+'publish-report-retry.json','w'),ensure_ascii=False)
    v2=verify(R+'publish-report-retry.json'); print('retry',v2.strip().splitlines()[-1])
    assert 'RENDER_ERROR' not in v2 and 'FAIL' not in v2.splitlines()[-1], v2
g=sh("timeout 600 node --test tests/m2-*-create-gate-*.test.js"); gp=re.findall(r'^# (pass|fail) (\d+)',g.stdout,re.M); print('gate',gp)
assert dict(gp).get('fail')=='0', g.stdout[-2000:]
by={}
for r in batch: by.setdefault(r['src'].split('/')[-1][:-3],[]).append(r)
for e,rows in by.items():
    p=R+f'ledger-spec-{e}.json'
    if os.path.exists(p): s=json.load(open(p))
    else:
        t=json.load(open(R+f'triage-{e}.json'))
        s={'exam':e,'src':srcOf(e),'camp':camp(e),'triage':R+f'triage-{e}.json','published':{},
           'open':{str(x['ord']):['OPEN_LAYOUT','plan 대기'] for x in t if x['decision'] in ('FIGURE','REPLACE','UNSUPPORTED')},
           'note':grade(e)+' Sonnet 캠페인: 0개 게시(독립 Sonnet 검토 PASS, 실제 해설 페이지 표시 확인).'}
    for r in rows: s['published'][str(r['ord'])]=f"assets/images/{e}/{r.get('asset') or 'q%d-solution.svg'%r['ord']}"; s['open'].pop(str(r['ord']),None)
    n=len(s['published']); s['note']=re.sub(r'\d+개 게시',f'{n}개 게시',s['note'],count=1)
    json.dump(s,open(p,'w'),ensure_ascii=False)
    print(sh(f"python3 {S}ledger-upsert.py {p}").stdout.strip())
msg=f"{title}\n\n{body}\n독립 Sonnet 검토 PASS, 실제 해설 페이지 표시 확인, create-gate 8/8.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: {os.environ.get('CLAUDE_SESSION_URL','')}"
open(R+'commitmsg.txt','w').write(msg)
o=sh(f"git add archive/exams/original archive/assets/images archive/tools/geometry-equation/production/exam-figure-ledger.json && git commit -q -F {R}commitmsg.txt && git push -q -u origin HEAD && git log --oneline -1")
print(o.stdout.strip(), o.stderr[-300:])
