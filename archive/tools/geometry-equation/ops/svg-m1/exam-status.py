# usage: python3 exam-status.py <exam-name-or-substring> [...]
# Before starting an exam: ledger status, items already carrying solution figures, recent commits touching the exam (other sessions), open PR branches.
import glob,json,os,subprocess,sys
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
        try:  # any solutionImage field (also assets/solution-images/...), by question order
            o=subprocess.run(['node','-e',"const vm=require('vm'),fs=require('fs');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);console.log(JSON.stringify(c.window.questionBank.map((q,i)=>[i+1,q.solutionImage||'']).filter(x=>x[1])))",f],capture_output=True,text=True).stdout
            si=json.loads(o or '[]'); figs=sorted(set(figs)|{x[0] for x in si})
            other=[f"q{x[0]}:{x[1].split('/')[-2]}" for x in si if 'solution-images/' in x[1]]
            if other: print(f' NOTE other-path solution images: {other}')
        except Exception as ex2: print(' solutionImage scan failed',ex2)
        print(f'== {n}\n ledger: {e["status"] if e else "NOT_IN_LEDGER"}'+(f" open={[i['ord'] for i in e.get('items',[]) if i['state'] not in ('PUBLISHED','EXEMPT')]}" if e else ''))
        print(f' existing solution svg: {figs}')
        print(' recent commits:',sh(f'git log --since=21.days --format="%h %ad %s" --date=short origin/main -- "{rel}" | head -5') or '-')
