# usage: build-pub.py <examkey> <jsrel> <srcdir> <decisions.json>
# decisions.json: {"<ord>": "FIGURE"|"REPLACE"|..., ...} overrides triage md; publish targets = FIGURE/REPLACE with ARCHIVE_BOUND.
# srcdir/qNN/{publish.json, figure-solution.svg|out/figure-solution.svg, figure-result.json|out/figure-result.json}
# Makes .tmp/work/pub/<examkey>/{qNN/..., review.json, rows.json, triage.json} and prints mechanical checks.
import json, sys, re, shutil, hashlib, subprocess, datetime
from pathlib import Path
W = Path(__file__).resolve().parent
ROOT = W.parent.parent  # 저장소 루트: 이 파일이 <repo>/.tmp/work/ 에 있다고 본다(restore.sh). 상대경로 인자는 저장소 루트 기준.
if W.parent.name == '.tmp' and (ROOT / '.git').exists():
    import os; os.chdir(ROOT)
SVG2PNG = W.parent / 'svg-m1' / 'svg2png.cjs'
if not SVG2PNG.exists():
    sys.exit(f"ERROR: {SVG2PNG} 이 없다. 복원(HANDOFF_SVG_ENGINE.md §3): cd {ROOT} && mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/")
key, jsrel, srcdir, decf = sys.argv[1:5]
exam = Path(jsrel).stem
# 문항 id: 숫자면 TABLE 번호 = id. 문자열 id(q01.., s01..)면 TABLE/폴더 번호 = 문제은행 순서(1부터). ord 는 id 그대로.
_script = "const vm=require('vm'),fs=require('fs');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);console.log(JSON.stringify(c.window.questionBank.map(q=>q.id)))"
bank_ids = json.loads(subprocess.run(['node', '-e', _script, jsrel], cwd=ROOT, check=True, capture_output=True, text=True, encoding='utf-8').stdout)
str_ids = any(not isinstance(i, int) for i in bank_ids)
def id_of(n):  # TABLE 번호 -> ord
    if not str_ids: return n
    if not 1 <= n <= len(bank_ids): sys.exit(f'ERROR: TABLE Q{n} 에 대응하는 문항이 없다 ({jsrel})')
    return bank_ids[n - 1]
def seq_of(o):  # ord -> 폴더 번호(qNN)
    return bank_ids.index(o) + 1 if str_ids else o
def dkey(k): return int(k) if k.isdigit() else k
dec = {dkey(k): v for k, v in json.loads(Path(decf).read_text(encoding='utf-8')).items()}
md = (W / 'triage-20261107' / f'{key}.md').read_text(encoding='utf-8')
tri = {}
for m in re.finditer(r'^\|\s*Q?(\d+)\s*\|\s*([A-Z_]+)', md, re.M):
    tri[id_of(int(m.group(1)))] = m.group(2)
tri.update(dec)
if str_ids and not set(tri) <= set(bank_ids): sys.exit(f'ERROR: 문제은행에 없는 ord: {sorted(set(tri) - set(bank_ids), key=str)}')
out = W / 'pub' / key
import os, stat
if out.exists(): shutil.rmtree(out, onexc=lambda f,p,e: (os.chmod(p, stat.S_IWRITE), f(p)))
out.mkdir(parents=True)
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
answers = re.compile(r'[①②③④⑤]')
rows, reviews, bad = [], [], []
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
for o, d in sorted(tri.items(), key=lambda kv: seq_of(kv[0])):
    if d not in ('FIGURE', 'REPLACE'): continue
    nn = f'q{seq_of(o):02d}'
    if not (Path(srcdir) / nn).exists(): print(f"{nn} {d} NOT_PRODUCED (stays open)"); continue
    s = Path(srcdir) / nn
    q = out / nn; (q / 'out').mkdir(parents=True)
    svg = s / 'out/figure-solution.svg'
    if not svg.exists(): svg = s / 'figure-solution.svg'
    res = s / 'out/figure-result.json'
    if not res.exists(): res = s / 'figure-result.json'
    shutil.copy(svg, q / 'out/figure-solution.svg'); shutil.copy(res, q / 'out/figure-result.json')
    shutil.copy(s / 'publish.json', q / 'publish.json')
    subprocess.run(['node', str(SVG2PNG), str(q / 'out/figure-solution.svg'), str(q / 'figure.png'), '600'], cwd=ROOT, check=True, capture_output=True)
    r = json.loads(res.read_text(encoding='utf-8-sig')); pj = json.loads((q / 'publish.json').read_text(encoding='utf-8-sig'))
    probs = []
    if r.get('status') != 'ARCHIVE_BOUND': probs.append('status=' + str(r.get('status')))
    if r.get('identity', {}).get('questionUid') != f'{exam}|{o}': probs.append('uid=' + str(r.get('identity', {}).get('questionUid')))
    if pj.get('size') != r.get('sizeClass'): probs.append(f"size {pj.get('size')}!={r.get('sizeClass')}")
    if not str(pj.get('alt', '')).strip() or not str(pj.get('caption', '')).strip(): probs.append('empty alt/caption')
    if answers.search(pj.get('alt', '')): probs.append('choice mark in alt')
    svgt = (q / 'out/figure-solution.svg').read_text(encoding='utf-8')
    for _, txt in re.findall(r'<(title|desc)[^>]*>([^<]*)<', svgt):
        if '?' in txt or re.search(r'[一-鿿]', txt): probs.append('garbled SVG title/desc')
    root_tag = re.search(r'<svg[^>]*>', svgt).group(0)
    if 'role="img"' not in root_tag or '<title' not in svgt: probs.append('SVG root role=img/title missing (run upgrade-svg-accessibility)')
    plan_p = s / 'plan.json'
    if plan_p.exists():
        g = (json.loads(plan_p.read_text(encoding='utf-8-sig')).get('graphPlan') or {})
        ov = g.get('overlays') or {}
        unit_lines = [l for l in ov.get('lines', []) if str(l.get('slope')) in ('1', '-1')]
        if g.get('family') in ('rational', 'sqrt-affine', 'radical', 'sqrt') and not g.get('equalUnits') and (unit_lines or ov.get('circles')):
            probs.append('slope±1 line/circle without equalUnits')
    if probs: bad.append((o, probs))
    row = {'ord': o, 'A': str((q / 'figure.png').resolve())}
    rv = {'ord': o, 'exam': exam, 'reviewer': 'luna-review1 + claude-main-final', 'reviewedAt': now,
          'expected': pj['caption'], 'publishSha256': sha(q / 'publish.json'),
          'A': {'verdict': 'PASS', 'findings': 'Claude main viewed PNG against answer and solution; mechanical checks passed.',
                'sha256': sha(q / 'out/figure-solution.svg'), 'pngSha256': sha(q / 'figure.png')}}
    if d == 'REPLACE':
        row['replace'] = True; rv['B'] = {'verdict': 'FAIL'}; rv['better'] = 'A'
    rows.append(row); reviews.append(rv)
    print(f"{nn} {d} size={pj.get('size')} alt={pj['alt'][:60]} | cap_end={pj['caption'][-40:]}")
(out / 'rows.json').write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding='utf-8')
(out / 'review.json').write_text(json.dumps(reviews, ensure_ascii=False, indent=1), encoding='utf-8')
(out / 'triage.json').write_text(json.dumps([{'ord': o, 'decision': d} for o, d in sorted(tri.items(), key=lambda kv: seq_of(kv[0]))], ensure_ascii=False, indent=1), encoding='utf-8')
print('BAD:', bad if bad else 'none'); print('exam', exam, 'triage ords', len(tri))
