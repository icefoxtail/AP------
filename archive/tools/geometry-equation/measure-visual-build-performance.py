"""Measure pure builds without writing or replacing candidate/production SVGs."""
import argparse, hashlib, json, statistics, sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from visual_engine.engine import build, ROOT
from visual_engine.config import resolve_output

def measure(run, repetitions=5):
    run=Path(run).resolve()
    config=json.loads((run/'config/run.json').read_text(encoding='utf-8'))
    if resolve_output(config)!=run: raise ValueError('RUN_CONFIG_SCOPE_MISMATCH')
    if not 1<=repetitions<=20: raise ValueError('INVALID_REPETITIONS')
    rows=[]
    for item in json.loads((run/'fixtures/manifest.json').read_text(encoding='utf-8')):
        spec=json.loads((ROOT/item['spec']).read_text(encoding='utf-8'))
        expected=(ROOT/item['svg']).read_bytes()
        build(spec)  # warm-up excluded from timing
        samples=[]; hashes=[]
        for _ in range(repetitions):
            started=time.perf_counter()
            result=build(spec)
            samples.append((time.perf_counter()-started)*1000)
            hashes.append(hashlib.sha256(result['svg'].encode('utf-8')).hexdigest())
        digest=hashlib.sha256(expected).hexdigest()
        rows.append({'id':item['id'],'status':'PASS' if all(h==digest for h in hashes) else 'FAIL',
            'svgSha256':digest,'svgBytes':len(expected),'repetitions':repetitions,
            'buildTimeMs':{'min':min(samples),'median':statistics.median(samples),'max':max(samples)},
            'samplesMs':samples,'pureBuildByteParity':all(h==digest for h in hashes)})
    result={'status':'PASS' if rows and all(r['status']=='PASS' for r in rows) else 'FAIL',
        'scope':'pure build including validation, sampling, layout, SVG and TeX serialization',
        'runtime':sys.version,'timingClock':'perf_counter','warmupExcluded':True,'rows':rows}
    output=run/'performance/build.json';output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    return result
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--repetitions',type=int,default=5)
    a=p.parse_args();r=measure(a.run,a.repetitions)
    print(json.dumps({'status':r['status'],'cases':len(r['rows'])}))
    sys.exit(0 if r['status']=='PASS' else 1)
