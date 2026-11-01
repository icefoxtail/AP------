# usage: python3 exam-status.py <exam-name-or-substring> [...]
# Before starting an exam: ledger status, items already carrying solution figures, recent commits touching the exam (other sessions), open PR branches.
import json,glob,os,subprocess,sys
ROOT='/home/user/AP------'
L=json.load(open(ROOT+'/archive/tools/geometry-equation/production/exam-figure-ledger.json'))
ex={e['exam']:e for e in (L['exams'] if isinstance(L['exams'],list) else L['exams'].values())}
def sh(c): return subprocess.run(c,shell=True,capture_output=True,text=True,cwd=ROOT).stdout.strip()
for q in sys.argv[1:]:
    for f in sorted(glob.glob(ROOT+'/archive/exams/original/**/*.js',recursive=True)):
        n=os.path.basename(f)[:-3]
        if q not in n: continue
        rel=os.path.relpath(f,ROOT); e=ex.get(n)
        js=open(f,encoding='utf-8').read()
        figs=sorted({int(x) for x in __import__('re').findall(r'q(\d+)-solution[^"\'\s]*\.svg',js)})
        print(f'== {n}\n ledger: {e["status"] if e else "NOT_IN_LEDGER"}'+(f" open={[i['ord'] for i in e.get('items',[]) if i['state'] not in ('PUBLISHED','EXEMPT')]}" if e else ''))
        print(f' existing solution svg: {figs}')
        print(' recent commits:',sh(f'git log --since=21.days --format="%h %ad %s" --date=short origin/main -- "{rel}" | head -5') or '-')
