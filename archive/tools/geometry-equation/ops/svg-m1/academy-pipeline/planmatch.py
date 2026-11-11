# 게시된 해설 SVG와 내용이 같은 렌더 결과를 runs에서 찾아, 그 그림의 작도 원본(plan.json)을 고른다.
# usage: python planmatch.py [--copy <dest dir>]
import os, sys, json, hashlib, subprocess, collections, shutil
def git(*a): return subprocess.run(['git', '-c', 'core.quotepath=off', *a], capture_output=True).stdout.decode('utf-8', 'replace')
def norm(b): return hashlib.sha1(b.replace(b'\r\n', b'\n')).hexdigest()
# 1) runs 안의 모든 svg → 해시 → (폴더)
idx = collections.defaultdict(list)
for dp, dn, fn in os.walk('.tmp/work/runs'):
    for f in fn:
        if f.endswith('.svg'):
            p = os.path.join(dp, f)
            try: idx[norm(open(p, 'rb').read())].append(dp.replace('\\', '/'))
            except OSError: pass
for dp, dn, fn in os.walk('.tmp/work/pub'):
    for f in fn:
        if f.endswith('.svg'):
            p = os.path.join(dp, f)
            try: idx[norm(open(p, 'rb').read())].append(dp.replace('\\', '/'))
            except OSError: pass
def plan_for(d):
    # svg가 있는 폴더에서 위로 올라가며 plan.json을 찾는다(최대 3단계)
    for _ in range(4):
        p = os.path.join(d, 'plan.json')
        if os.path.exists(p): return p.replace('\\', '/')
        d = os.path.dirname(d)
    return None
# 2) 장부의 PUBLISHED 그림
L = json.loads(git('show', 'origin/main:archive/tools/geometry-equation/production/exam-figure-ledger.json'))
tot = hit = 0; out = []; per = collections.Counter(); perhit = collections.Counter()
for e in L['exams']:
    lv = '/'.join(e['src'].split('/')[3:6])
    for it in e['items']:
        if it.get('state') != 'PUBLISHED': continue
        for fg in it.get('figures', []):
            path = 'archive/' + fg if not fg.startswith('archive/') else fg
            tot += 1; per[lv] += 1
            if not os.path.exists(path): continue
            h = norm(open(path, 'rb').read())
            plan = None
            for d in idx.get(h, []):
                plan = plan_for(d)
                if plan: break
            if plan:
                hit += 1; perhit[lv] += 1; out.append((e['exam'], str(it['ord']), fg, plan))
print('published figures', tot, 'matched plan', hit)
for k in sorted(per): print(' ', k, per[k], 'matched', perhit[k])
if '--copy' in sys.argv:
    dest = sys.argv[sys.argv.index('--copy') + 1]; n = 0; size = 0
    for exam, ord_, fg, plan in out:
        base = os.path.splitext(os.path.basename(fg))[0]
        d = os.path.join(dest, exam); os.makedirs(d, exist_ok=True)
        t = os.path.join(d, base + '.plan.json')
        data = open(plan, 'rb').read().replace(b'\r\n', b'\n')
        open(t, 'wb').write(data); n += 1; size += len(data)
    print('copied', n, round(size / 1e6, 1), 'MB ->', dest)
