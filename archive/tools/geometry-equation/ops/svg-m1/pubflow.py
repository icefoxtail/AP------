# usage: pubflow.py --batch manifest.json
# Manifest: [{exam, review, rows, triage, camp, closedBy?, allowTieOrdinals?}]
# Relative paths resolve against manifest directory. Local apply, verify, gates and ledger only.
import glob, json, math, os, re, sys
from pathlib import Path
from portable_root import repo_root, run, validate_triage, require_hash
ROOT=repo_root(); S=Path(__file__).resolve().parent; R=S/'runs'
def read(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def write(p, data): Path(p).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def validate_font_row(row, expected_sha):
    n=row.get('expectedLabelCount'); measured=row.get('measuredLabelCount'); minimum=row.get('minFontPx')
    if row.get('status')!='PASS' or type(n) is not int or n<0 or type(measured) is not int or measured!=n or row.get('sourceSvgSha')!=expected_sha or row.get('responseSha')!=expected_sha:
        raise ValueError('font verification failed')
    if n==0:
        e=row.get('explicitTextFree')
        if not isinstance(e,dict) or row.get('fontApplicability')!='NOT_APPLICABLE' or minimum is not None or e.get('schemaVersion')!='APMATH_EXPLICIT_TEXT_FREE_FONT_EVIDENCE_v1' or e.get('rootMarked') is not True or e.get('path')!='root' or any(e.get(k)!=expected_sha for k in ('svgSha256','sourceSvgSha','responseSha')) or e.get('runtime')!='playwright-chromium' or e.get('synthetic') is not False or e.get('fontStatus')!='loaded':
            raise ValueError('explicit text-free font evidence missing')
        if any(type(e.get(k)) is not int or e[k]!=0 for k in ('textOrLabelElementCount','foreignObjectCount','embeddedImageCount')) or type(e.get('visibleGeometryPrimitiveCount')) is not int or e['visibleGeometryPrimitiveCount']<=0 or row.get('labels')!=[] or row.get('embedded')!=[]:
            raise ValueError('explicit text-free font evidence invalid')
    elif row.get('fontApplicability')!='APPLICABLE' or row.get('explicitTextFree') is not None or type(minimum) not in (int,float) or not math.isfinite(minimum) or minimum<11:
        raise ValueError('font verification failed')

def main():
    if len(sys.argv)!=3 or sys.argv[1]!='--batch': raise ValueError('usage: pubflow.py --batch manifest.json')
    manifest=Path(sys.argv[2]).resolve(); entries=read(manifest)
    if not isinstance(entries,list) or not entries: raise ValueError('empty batch')
    R.mkdir(parents=True,exist_ok=True); batch=[]; seen=set(); sources={}
    def file_path(p):
        p=Path(p); return p if p.is_absolute() else manifest.parent/p
    for e in entries:
        name=e['exam']
        if name in seen or Path(name).name!=name: raise ValueError('duplicate or invalid exam')
        seen.add(name)
        matches=list((ROOT/'archive/exams/original').rglob(name+'.js'))
        if len(matches)!=1: raise ValueError(f'{name}: expected exactly one source')
        src=matches[0].relative_to(ROOT).as_posix(); sources[name]=src
        for key in ('review','rows','triage','camp'):
            if not e.get(key): raise ValueError(f'{name}: missing {key}')
        triage,_=validate_triage(ROOT,src,read(file_path(e['triage'])))
        ties=e.get('allowTieOrdinals',[])
        if not isinstance(ties,list) or any(type(o) is not int for o in ties): raise ValueError('invalid allowTieOrdinals')
        ties_file=R/f'allow-ties-{name}.json'; write(ties_file,ties)
        dest=R/f'publish-rows-{name}.json'
        if dest.exists(): dest.unlink()
        result=run([sys.executable,S/'publish-exam.py',name,src,file_path(e['review']),file_path(e['rows']),ties_file],cwd=ROOT)
        print(result.stdout.strip(),flush=True)
        produced=read(dest)
        if not isinstance(produced,list) or not produced: raise ValueError(f'{name}: no publish rows')
        if any(triage[r['ord']]['decision'] != ('REPLACE' if r['reviewReplacement'] else 'FIGURE') for r in produced): raise ValueError(f'{name}: published row conflicts with triage')
        batch.extend(produced)
    batchfile=R/'publish-rows-batch.json'; write(batchfile,batch)
    reportfile=R/'publish-report-last.json'; env=os.environ.copy(); env['PUBLISH_REPORT']=str(reportfile); env['APMS_ROOT']=str(ROOT)
    def publish(apply):
        if reportfile.exists(): reportfile.unlink()
        p=run(['node',S/'publish.mjs',batchfile,ROOT,*(['--apply'] if apply else [])],cwd=ROOT,timeout=300,env=env)
        summary=json.loads(p.stdout); report=read(reportfile)
        if summary.get('problems') or summary.get('skips') or summary.get('figures')!=len(batch) or summary.get('okExams')!=len(entries): raise ValueError('publish summary incomplete: '+p.stdout)
        expected={(Path(r['src']).stem,r['ord']) for r in batch}
        if not isinstance(report,list) or len(report)!=len(entries) or any(x.get('status')!='OK' or not x.get('items') or any(i.get('ok') is not True for i in x['items']) for x in report): raise ValueError('invalid publish report')
        actual=[(x['exam'],i['ord']) for x in report for i in x['items']]
        if len(actual)!=len(expected) or set(actual)!=expected: raise ValueError('publish report rows mismatch')
    publish(False)
    for r in batch:
        require_hash(r['svg'],r['sha256'])
        require_hash(r['reviewPng'],r['pngSha256'])
        require_hash(r['reviewPublish'],r['publishSha256'])
    publish(True)
    for r in batch:
        asset=r.get('asset') or f"q{r['ord']}-solution.svg"
        require_hash(ROOT/'archive/assets/images'/Path(r['src']).stem/asset,r['sha256'])
    verification=R/'verify-batch.json'
    if verification.exists(): verification.unlink()
    print(run(['node',S/'verify-published.mjs',reportfile,verification],cwd=ROOT,timeout=900,env=env).stdout,flush=True)
    result=read(verification)
    expected_counts={e['exam']:sum(Path(r['src']).stem==e['exam'] for r in batch) for e in entries}
    if not isinstance(result,list) or len(result)!=len(entries) or {x.get('exam') for x in result}!=set(expected_counts) or any(x.get('status')!='OK' or x.get('missing') or x.get('figures')!=expected_counts[x['exam']] for x in result): raise ValueError('verification failed or incomplete')
    font_input=R/'font-batch-input.json'; font_output=R/'font-batch-result.json'
    font_entries=[{'src':sources[e['exam']],'ords':[r['ord'] for r in batch if r['src']==sources[e['exam']]]} for e in entries]
    write(font_input,font_entries)
    if font_output.exists(): font_output.unlink()
    print(run(['node',S/'verify-publication-fonts.mjs','--batch',font_input,'--out',font_output],cwd=ROOT,timeout=900,env=env).stdout,flush=True)
    font_report=read(font_output); font_rows=font_report.get('rows') if isinstance(font_report,dict) else None
    expected_fonts={(r['src'],r['ord']):r['sha256'] for r in batch}
    if not isinstance(font_rows,list) or not font_rows or len(font_rows)!=len(expected_fonts): raise ValueError('font verification missing rows')
    actual_fonts={(r.get('src'),r.get('ord')):r for r in font_rows}
    if len(actual_fonts)!=len(font_rows) or set(actual_fonts)!=set(expected_fonts): raise ValueError('font verification coverage mismatch')
    for key,r in actual_fonts.items():
        try: validate_font_row(r,expected_fonts[key])
        except ValueError as error: raise ValueError(f'font verification failed: {key}: {error}') from error
    tests=sorted(glob.glob(str(ROOT/'tests/m2-*-create-gate-*.test.js')))
    if not tests: raise ValueError('no gate test files')
    gate=run(['node','--test','--test-reporter=tap',*tests],cwd=ROOT,timeout=600,env=env)
    print(gate.stdout,flush=True)
    passes=re.findall(r'^# pass (\d+)\s*$',gate.stdout,re.M); failures=re.findall(r'^# fail (\d+)\s*$',gate.stdout,re.M)
    if not passes or int(passes[-1])<1 or not failures or int(failures[-1])!=0: raise ValueError('gate did not report a nonzero passing test count')
    for e in entries:
        name=e['exam']; triage_path=file_path(e['triage']); tri=read(triage_path)
        if not isinstance(tri,list) or not tri: raise ValueError(f'{name}: empty triage')
        published={str(r['ord']):f"assets/images/{name}/{r.get('asset') or 'q%d-solution.svg'%r['ord']}" for r in batch if Path(r['src']).stem==name}
        reviewers=sorted({x['reviewer'] for x in read(file_path(e['review']))})
        spec={'exam':name,'src':sources[name],'camp':e['camp'],'closedBy':e.get('closedBy'), 'triage':str(triage_path),'published':published,'open':{str(x['ord']):['OPEN_LAYOUT','plan 대기'] for x in tri if x['decision'] in ('FIGURE','REPLACE') and str(x['ord']) not in published},'note':f"{len(published)}개 게시; 독립 검수: {', '.join(reviewers)}; 해설 페이지와 실제 표시 글자 크기 검증; 공통 CREATE 게이트 회귀 {passes[-1]}개 통과."}
        if e.get('exempt_override'): spec['exempt_override']=e['exempt_override']
        specfile=R/f'ledger-spec-{name}.json'; write(specfile,spec)
        print(run([sys.executable,S/'ledger-upsert.py',specfile],cwd=ROOT).stdout.strip(),flush=True)
    print('Local publication complete. Git operations are separate.')
if __name__=='__main__': main()
