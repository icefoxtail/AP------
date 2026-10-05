"""Small sequential test recorder. No implementation or production mutation."""
import argparse, hashlib, json, os, re, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(Path(__file__).resolve().parent))
from visual_engine.config import resolve_output
def record(run):
    run=Path(run).resolve();cfg=json.loads((run/'config/run.json').read_text(encoding='utf-8'))
    if resolve_output(cfg)!=run: raise ValueError('RUN_CONFIG_SCOPE_MISMATCH')
    tool=ROOT/'archive/tools/geometry-equation'
    code=sorted(p for p in tool.rglob('*') if p.is_file() and p.suffix in {'.py','.mjs','.json'} and '__pycache__' not in p.parts)
    folder=run/'tests';folder.mkdir(parents=True,exist_ok=True);rows=[]
    env={**os.environ,'PYTHONIOENCODING':'utf-8'}
    def execute(name,args):
        result=subprocess.run(args,cwd=ROOT,env=env,capture_output=True,encoding='utf-8',errors='replace',timeout=180)
        for suffix,value in [('stdout',result.stdout),('stderr',result.stderr)]:
            (folder/f'phase-15-{name}.{suffix}.txt').write_text(value,encoding='utf-8',newline='\n')
        row={'name':name,'command':args,'exitCode':result.returncode,'status':'PASS' if result.returncode==0 else 'FAIL'}
        rows.append(row);return result
    pyfiles=[str(p.relative_to(ROOT)) for p in code if p.suffix=='.py']
    # Explicit file arguments work on Windows, unlike a literal shell wildcard.
    execute('pycompile',[sys.executable,'-X','utf8','-m','py_compile',*pyfiles])
    python=execute('python-unit',[sys.executable,'-X','utf8','-m','unittest','discover','archive/tools/geometry-equation/tests','-p','test_*.py'])
    pm=re.search(r'Ran (\d+) tests?',python.stderr+python.stdout);pythonCount=int(pm[1]) if pm else None
    for file in [p for p in code if p.suffix=='.mjs']:
        execute('node-check-'+file.stem,['node','--check',str(file.relative_to(ROOT))])
    node=execute('node-unit',['node','--test',*[str(p.relative_to(ROOT)) for p in (tool/'tests').glob('*.test.mjs')]])
    nm=re.search(r'# tests (\d+)',node.stdout);nodeCount=int(nm[1]) if nm else None
    execute('baseline',[sys.executable,'-X','utf8',str(tool/'freeze-visual-baseline.py'),'--verify'])
    execute('diff-check',['git','diff','--check'])
    result={'status':'PASS' if rows and all(r['status']=='PASS' for r in rows) and pythonCount and nodeCount else 'FAIL',
        'pythonTests':pythonCount,'nodeTests':nodeCount,'commands':rows,
        'codeFileHashes':{p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in code}}
    (folder/'phase-15-code-tests.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    return result
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--run',required=True);a=p.parse_args();r=record(a.run)
    print(json.dumps({'status':r['status'],'pythonTests':r['pythonTests'],'nodeTests':r['nodeTests'],
        'failed':[v['name'] for v in r['commands'] if v['status']!='PASS']}))
    sys.exit(0 if r['status']=='PASS' else 1)
