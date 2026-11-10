# usage: exam-status.py <exam-name-or-substring> [...]
import json, re, sys
from portable_root import repo_root, run
ROOT=repo_root()
L=json.loads((ROOT/'archive/tools/geometry-equation/production/exam-figure-ledger.json').read_text(encoding='utf-8-sig'))
ex={e['exam']:e for e in (L['exams'] if isinstance(L['exams'],list) else L['exams'].values())}
for q in sys.argv[1:]:
    for f in sorted((ROOT/'archive/exams/original').rglob('*.js')):
        n=f.stem
        if q not in n: continue
        rel=f.relative_to(ROOT); e=ex.get(n); js=f.read_text(encoding='utf-8-sig')
        figs={int(x) for x in re.findall(r'q(\d+)-solution[^"\'\s]*\.svg',js)}
        script="const vm=require('vm'),fs=require('fs');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);console.log(JSON.stringify((c.window.questionBank??c.window.examData?.questions).filter(q=>q.solutionImage).map(q=>[q.id,q.solutionImage])))"
        si=json.loads(run(['node','-e',script,f],cwd=ROOT).stdout); figs.update(x[0] for x in si)
        print(f'== {n}\n ledger: {e["status"] if e else "NOT_IN_LEDGER"}'+(f" open={[i['ord'] for i in e.get('items',[]) if i['state'] not in ('PUBLISHED','EXEMPT')]}" if e else ''))
        print(' existing solution svg:',sorted(figs))
        commits=run(['git','log','-5','--since=21.days','--format=%h %ad %s','--date=short','origin/main','--',rel],cwd=ROOT).stdout.strip()
        print(' recent commits:', commits or '-')
