# usage: exam-status.py <exam-name-or-substring> [...]
import json, re, sys
from portable_root import repo_root, run
from figure_ledger import load_exam
ROOT=repo_root()
files=sorted((ROOT/'archive/exams/original').rglob('*.js'))
matches=[(q,f) for q in sys.argv[1:] for f in files if q in f.stem]
# 맞는 시험지 JS를 node 한 번으로 읽는다(시험지마다 node를 새로 띄우지 않는다).
script="const vm=require('vm'),fs=require('fs');console.log(JSON.stringify(process.argv.slice(1).map(p=>{const c={window:{}};vm.runInNewContext(fs.readFileSync(p,'utf8'),c);return (c.window.questionBank??c.window.examData?.questions).filter(q=>q.solutionImage).map(q=>[q.id,q.solutionImage])})))"
uniq=list(dict.fromkeys(f for _,f in matches))
banks={}
for i in range(0,len(uniq),40):  # 명령줄 길이 한도 때문에 40개씩
    part=uniq[i:i+40]; banks.update(zip(part,json.loads(run(['node','-e',script,*part],cwd=ROOT).stdout)))
for q,f in matches:
    n=f.stem
    rel=f.relative_to(ROOT); e=load_exam(rel.as_posix(),ROOT); js=f.read_text(encoding='utf-8-sig')
    figs={int(x) for x in re.findall(r'q(\d+)-solution[^"\'\s]*\.svg',js)}
    figs.update(x[0] for x in banks[f])
    print(f'== {n}\n ledger: {e["status"] if e else "NOT_IN_LEDGER"}'+(f" open={[i['ord'] for i in e.get('items',[]) if i['state'] not in ('PUBLISHED','EXEMPT')]}" if e else ''))
    print(' existing solution svg:',sorted(figs))
    commits=run(['git','log','-5','--since=21.days','--format=%h %ad %s','--date=short','origin/main','--',rel],cwd=ROOT).stdout.strip()
    print(' recent commits:', commits or '-')
