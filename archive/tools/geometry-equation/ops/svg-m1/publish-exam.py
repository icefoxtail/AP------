# usage: publish-exam.py <exam> <srcRel> <review.json> <rows.json> [allow-tie-ords.json]
import hashlib, json, sys, tempfile
from pathlib import Path
from portable_root import repo_root, run, require_hash, is_question_key, solution_name
ROOT=repo_root()
def read(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def main():
    if len(sys.argv) not in (5,6): raise ValueError('exam, source, review and rows required')
    exam,src,review_file,rows_file=sys.argv[1:5]
    dest=Path(__file__).resolve().parent/'runs'/f'publish-rows-{exam}.json'
    if dest.exists(): dest.unlink()
    allowed=set(read(sys.argv[5])) if len(sys.argv)==6 else set()
    reviews=read(review_file); rows=read(rows_file)
    if not isinstance(rows,list) or not rows or not isinstance(reviews,list) or not reviews: raise ValueError('rows and reviews must be nonempty arrays')
    def indexed(data):
        result={}
        for r in data:
            o=r.get('ord')
            if not is_question_key(o) or o in result: raise ValueError('invalid or duplicate ord')
            result[o]=r
        return result
    rv=indexed(reviews); rr=indexed(rows)
    if rv.keys()!=rr.keys(): raise ValueError('review and rows ords differ')
    if allowed:
        ledger=read(ROOT/'archive/tools/geometry-equation/production/exam-figure-ledger.json')
        entries=[e for e in ledger['exams'] if e['exam']==exam]
        if len(entries)!=1: raise ValueError('TIE requires existing ledger entry')
        open_ords={i['ord'] for i in entries[0]['items'] if i['state'] not in ('PUBLISHED','EXEMPT')}
        if not allowed <= open_ords: raise ValueError('TIE requires OPEN ledger item')
    script="const vm=require('vm'),fs=require('fs');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);console.log(JSON.stringify(c.window.questionBank.map(q=>({id:q.id,has:Object.prototype.hasOwnProperty.call(q,'solutionImage'),image:q.solutionImage||''}))))"
    bank=json.loads(run(['node','-e',script,ROOT/src],cwd=ROOT).stdout)
    bank={q['id']:q for q in bank}
    adir=ROOT/'archive/assets/images'/Path(src).stem
    grade=next((g for g in ('중1','중2','중3','고1','고2','고3') if f'_{g}_' in exam),None)
    if not grade: raise ValueError('unknown grade')
    fam={'중1':'M1','중2':'M2','중3':'M3','고1':'H1','고2':'H2','고3':'H3'}[grade]
    out=[]
    stage=Path(tempfile.mkdtemp(prefix='reviewed-svg-',dir=dest.parent)) if dest.parent.exists() else None
    if stage is None:
        dest.parent.mkdir(parents=True,exist_ok=True)
        stage=Path(tempfile.mkdtemp(prefix='reviewed-svg-',dir=dest.parent))
    for o,r in rr.items():
        v=rv[o]; a=v.get('A',{})
        if v.get('exam')!=exam or not all(isinstance(v.get(k),str) and v[k].strip() for k in ('reviewer','reviewedAt','expected')): raise ValueError(f'q{o}: review identity/evidence missing')
        if not isinstance(a,dict) or a.get('verdict')!='PASS' or not isinstance(a.get('findings'),str) or not a['findings'].strip(): raise ValueError(f'q{o}: A PASS evidence required')
        if o not in bank: raise ValueError(f'q{o}: missing question')
        is_replace=bool(r.get('replace'))
        if bool(bank[o]['image']) != is_replace: raise ValueError(f'q{o}: replacement flag differs from existing image')
        if is_replace:
            if not isinstance(v.get('B'),dict) or v['B'].get('verdict') not in ('PASS','FAIL','MISSING'): raise ValueError(f'q{o}: B verdict required')
            if v.get('better')!='A' and not (v.get('better')=='TIE' and o in allowed): raise ValueError(f'q{o}: replacement comparison failed')
        elif 'B' in v or 'better' in v: raise ValueError(f'q{o}: new figure must be A-only')
        png=Path(r['A']).resolve()
        if not png.is_file(): raise ValueError(f'q{o}: review PNG missing')
        require_hash(png,a.get('pngSha256'))
        d=png.parent; svg=d/'out/figure-solution.svg'
        if not svg.is_file(): svg=d/'figure-solution.svg'
        digest=hashlib.sha256(svg.read_bytes()).hexdigest()
        if a.get('sha256','').lower().removeprefix('sha256:')!=digest: raise ValueError(f'q{o}: SVG sha256 mismatch')
        staged=stage/solution_name(o)
        staged.write_bytes(svg.read_bytes())
        require_hash(staged,digest)
        publish_path=d/'publish.json'; publish_bytes=publish_path.read_bytes()
        publish_digest=hashlib.sha256(publish_bytes).hexdigest()
        if not isinstance(v.get('publishSha256'),str) or v['publishSha256'].lower().removeprefix('sha256:')!=publish_digest: raise ValueError(f'q{o}: publish.json sha256 mismatch')
        pj=json.loads(publish_bytes.decode('utf-8-sig')); alt=pj['alt']; caption=pj['caption']
        if not isinstance(alt,str) or not alt.strip() or not isinstance(caption,str) or not caption.strip(): raise ValueError(f'q{o}: empty alt/caption')
        result=read(d/'out/figure-result.json')
        size=result.get('sizeClass')
        if result.get('status')!='ARCHIVE_BOUND' or not isinstance(result.get('identity'),dict) or result['identity'].get('questionUid')!=f'{exam}|{o}': raise ValueError(f'q{o}: invalid render status or identity')
        if size not in ('small','medium','large','full') or pj.get('size')!=size: raise ValueError(f'q{o}: publish size differs from validated render size')
        state_path=d/'out/figure-state.json'
        if state_path.exists():
            lineage=read(state_path).get('capture',{}).get('lineage',{}).get('l1SvgSha256')
            if lineage is not None: require_hash(staged,lineage)
        obj={'src':src,'ord':o,'svg':str(staged),'sha256':digest,'reviewPng':str(png),'pngSha256':a['pngSha256'],'reviewPublish':str(publish_path),'publishSha256':publish_digest,'reviewReplacement':is_replace,'key':f'{fam.lower()}-{o}','fam':fam,'alt':alt if alt.startswith('해설 그림') else '해설 그림: '+alt,'caption':caption,'size':size}
        if is_replace:
            k=2
            while (adir/solution_name(o,k)).exists(): k+=1
            obj.update(replace=True,asset=solution_name(o,k))
        elif bank[o]['has']: obj.update(replace=True,asset=solution_name(o))
        elif (adir/solution_name(o)).exists():
            k=2
            while (adir/solution_name(o,k)).exists(): k+=1
            obj.update(asset=solution_name(o,k))
        out.append(obj)
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print(dest)
if __name__=='__main__': main()
