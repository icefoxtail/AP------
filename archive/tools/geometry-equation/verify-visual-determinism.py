"""Two isolated rebuilds compare actual file bytes and semantic witnesses."""
import argparse,json,hashlib,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from visual_engine.engine import write_candidate,ROOT

def verify(run):
    run=Path(run).resolve();config=json.loads((run/'config/run.json').read_text(encoding='utf-8'))
    rows=[]
    for item in json.loads((run/'fixtures/manifest.json').read_text(encoding='utf-8')):
        spec=json.loads((ROOT/item['spec']).read_text(encoding='utf-8'));builds=[]
        for label in ('rebuild-a','rebuild-b'):
            cfg={**config,'outputRoot':str((run/'determinism'/label).relative_to(ROOT)).replace('\\','/')}
            result=write_candidate(spec,cfg);folder=run/'determinism'/label/'candidate'/spec['id']
            hashes={name:hashlib.sha256((folder/name).read_bytes()).hexdigest() for name in ('visual.svg','visual.tex','witness.json','spec.json')}
            if hashes['visual.svg']!=result['witness']['normalizedSvgSha256'] or hashes['visual.tex']!=result['witness']['texSha256']:raise ValueError('FILE_WITNESS_SHA_MISMATCH')
            builds.append({'files':hashes,'visualSpecSha256':result['witness']['visualSpecSha256'],'semanticWitnessSha256':result['witness']['semanticWitnessSha256']})
        rows.append({'id':spec['id'],'status':'PASS' if builds[0]==builds[1] else 'FAIL','builds':builds})
    result={'status':'PASS' if all(v['status']=='PASS' for v in rows) else 'FAIL','rows':rows,'policy':'raw LF SVG/TeX and canonical spec/semantic hashes'}
    output=run/'determinism/summary.json';output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n');return result

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--run',required=True);a=p.parse_args();r=verify(a.run);print(json.dumps({'status':r['status'],'cases':len(r['rows'])}));sys.exit(0 if r['status']=='PASS' else 1)
