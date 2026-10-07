from pathlib import Path
import hashlib, json, os, re, struct, zlib, sys

ROOT=Path.cwd(); PKG=Path('docs/evidence/apmath-vprod/p4/current-graph-overviews-v12')
RUN=Path('.tmp/archive/phase4-correction-20261007')
EXAM='25_효천고_2학기_중간_고1_기출'
REG=RUN/EXAM/'visual-engine/production/regression'
def H(b): return 'sha256:'+hashlib.sha256(b).hexdigest()
def U(v): return str(v).removeprefix('sha256:').lower()
def HP(v):
 p=Path(v); p=p if p.is_absolute() else ROOT/p; s=str(p)
 if os.name=='nt' and len(s)>240 and not s.startswith('\\\\?\\'):
  s=('\\\\?\\UNC\\'+s[2:]) if s.startswith('\\\\') else ('\\\\?\\'+s)
 return Path(s)
def RB(v): return HP(v).read_bytes()
def RJ(v): return json.loads(RB(v).decode('utf-8-sig'))
def RP(v):
 s=str(v).replace('\\','/')
 if s.startswith('//?/'): s=s[4:]
 r=str(ROOT).replace('\\','/')
 return s[len(r)+1:] if s.startswith(r+'/') else s
def valid_png(b):
 if len(b)<33 or b[:8]!=b'\x89PNG\r\n\x1a\n': return False
 pos=8; ended=False
 while pos+12<=len(b):
  n=struct.unpack('>I',b[pos:pos+4])[0]; typ=b[pos+4:pos+8]; end=pos+12+n
  if end>len(b): return False
  crc=struct.unpack('>I',b[pos+8+n:end])[0]
  if zlib.crc32(b[pos+4:pos+8+n]) & 0xffffffff != crc: return False
  pos=end
  if typ==b'IEND': ended=(n==0 and pos==len(b)); break
 return ended
def write_pkg(rel,b):
 out=HP(PKG/rel); out.parent.mkdir(parents=True,exist_ok=True); out.write_bytes(b)
 return {'path':Path(rel).as_posix(),'bytes':len(b),'sha256':H(b)}
def write_json(rel,obj): return write_pkg(rel,(json.dumps(obj,ensure_ascii=False,indent=2)+'\n').encode('utf-8'))
def add_source(source,rel,kind,user):
 b=RB(source); ref=write_pkg(rel,b)
 return {'originalRef':{'path':RP(source),'bytes':len(b),'sha256':H(b)},'pathInPackage':ref['path'],'bytes':ref['bytes'],'sha256':ref['sha256'],'classification':kind,'usedBy':[user]},ref

def collect_actual(name,result):
 capture=result['actualArchive']; base=Path(capture['run']); base=base if base.is_absolute() else ROOT/base
 render=base/'archive-render'; row_id=capture['rowId']; hits=[]
 if not render.is_dir(): raise RuntimeError('ARCHIVE_RENDER_MISSING:'+name)
 for folder in render.iterdir():
  if not folder.is_dir(): continue
  for path in folder.glob('*.json'):
   if path.name=='summary.json': continue
   row=RJ(path)
   if row.get('id')==row_id: hits.append((path,row))
 if len(hits)!=1: raise RuntimeError('ROW_CARDINALITY:'+name+':'+str(len(hits)))
 row_path,row=hits[0]
 if row.get('status')!='PASS' or row.get('network',{}).get('policy')!='LOCAL_ONLY' or row.get('network',{}).get('externalRequests'):
  raise RuntimeError('ROW_NETWORK_OR_STATUS:'+name)
 state=row.get('state',{})
 if state.get('qrRendererAvailable') is not True or state.get('mathJaxSource')!='local' or state.get('mathJaxCdnFallback') is not False:
  raise RuntimeError('ROW_RUNTIME:'+name)
 target=U(result['candidateSvgSha256'])
 candidate=[x for x in row.get('responses',[]) if x.get('status')==200 and U(x.get('sha256',''))==target]
 qr=[x for x in row.get('responses',[]) if '/vendor/qrious/qrious.min.js' in x.get('url','')]
 if len(candidate)!=1 or len(qr)!=1: raise RuntimeError('RESPONSE_CARDINALITY:'+name)
 vendor=RB('archive/vendor/qrious/qrious.min.js')
 if qr[0].get('status')!=200 or U(qr[0].get('sha256',''))!=U(H(vendor)) or qr[0].get('bytes')!=len(vendor):
  raise RuntimeError('QRIUS_RESPONSE_HASH:'+name)
 pngs=list(row_path.parent.glob('*.png')); prefix=row_id+'-'
 selected=[p for p in pngs if p.name==row_id+'.png']
 if not selected: selected=[p for p in pngs if p.name.startswith(prefix) and p.name.endswith('.png') and not p.name.endswith('-context.png') and not p.name.endswith('-envelope-context.png')]
 context=[p for p in pngs if p.name.startswith(prefix) and p.name.endswith('-context.png') and not p.name.endswith('-envelope-context.png')]
 envelope=[p for p in pngs if p.name.startswith(prefix) and p.name.endswith('-envelope-context.png')]
 if len(selected)!=1 or len(context)!=1 or len(envelope)!=1: raise RuntimeError('PNG_CARDINALITY:'+name)
 paths={'row':row_path,'selected':selected[0],'context':context[0],'envelope':envelope[0]}
 for key,p in paths.items():
  b=RB(p)
  if key!='row' and not valid_png(b): raise RuntimeError('PNG_INVALID:'+name+':'+key)
 return paths,row,candidate[0],qr[0]

def preflight():
 idx=RJ(PKG/'evidence-index.json'); ledger=RJ(PKG/'phase4-ledger.json')
 artifacts={}
 for name,fixture in ledger['fixtures'].items():
  result=RJ(PKG/Path('payload/fixtures')/name/'fixture-result.json')
  artifacts[name]=collect_actual(name,result)
 if not (REG/'node-full-suite-corrected.log').is_file(): raise RuntimeError('CORRECTED_NODE_LOG_MISSING')
 if not (REG/'phase4-focused-spec-construction-corrected.log').is_file(): raise RuntimeError('FOCUSED_LOG_MISSING')
 return artifacts

artifacts=preflight()
if '--preflight' in sys.argv:
 print(json.dumps({'preflight':'PASS','fixtures':len(artifacts),'screenshots':3*len(artifacts),'rowJson':len(artifacts)},indent=2)); raise SystemExit(0)

idx=RJ(PKG/'evidence-index.json'); ledger=RJ(PKG/'phase4-ledger.json'); summary=RJ(PKG/'regression-summary.json'); attempt=RJ(PKG/'attempt-ledger.json')
new_entries=[]
for name,data in artifacts.items():
 paths,row,candidate,qr=data; base=Path('payload/fixtures')/name/'actual-archive/capture-evidence'; refs={}
 for key,source,leaf,kind in (
  ('row',paths['row'],'row.json','ACTUAL_ARCHIVE_ROW_JSON'),
  ('selected',paths['selected'],'selected-profile.png','ACTUAL_ARCHIVE_SCREENSHOT'),
  ('context',paths['context'],'context.png','ACTUAL_ARCHIVE_CONTEXT_SCREENSHOT'),
  ('envelope',paths['envelope'],'envelope-context.png','ACTUAL_ARCHIVE_ENVELOPE_CONTEXT_SCREENSHOT')):
  run_rel=Path(ledger['fixtures'][name]['actualArchive']['run'])
  source_rel=run_rel/'archive-render'/paths['row'].parent.name/source.name
  entry,ref=add_source(source_rel,base/leaf,kind,name+':actual-archive:'+key); idx['entries'].append(entry); refs[key]=ref
  new_entries.append(entry)
 ledger['fixtures'][name]['actualArchiveCaptureEvidence']={
  'rowId':row['id'],'row':refs['row'],'selectedScreenshot':refs['selected'],'contextScreenshot':refs['context'],'envelopeContextScreenshot':refs['envelope'],
  'classification':'ACTUAL_CHROMIUM_ARCHIVE_CAPTURE','status':row['status'],'networkPolicy':'LOCAL_ONLY','externalRequests':[],
  'candidateSvgSha256':ledger['fixtures'][name]['candidateSvgSha256'],
  'candidateSvgResponse':{'url':candidate['url'],'status':candidate['status'],'sha256':'sha256:'+U(candidate['sha256']),'bytes':candidate['bytes']},
  'qrResponse':{'url':qr['url'],'status':qr['status'],'sha256':'sha256:'+U(qr['sha256']),'bytes':qr['bytes'],'vendoredFile':'archive/vendor/qrious/qrious.min.js','vendoredFileSha256':H(RB('archive/vendor/qrious/qrious.min.js'))}}

node_path=REG/'node-full-suite-corrected.log'; node_text=RB(node_path).decode('utf-8',errors='replace')
tests=int(re.search(r'ℹ tests (\d+)',node_text).group(1)); passes=int(re.search(r'ℹ pass (\d+)',node_text).group(1)); fails=int(re.search(r'ℹ fail (\d+)',node_text).group(1))
if fails or tests!=passes: raise RuntimeError('CORRECTED_NODE_SUITE_FAILED')
old_node_source=Path('.tmp/archive/full-node-suite-final-20261007-excluding-q10-cancel')/EXAM/'visual-engine/production/node-full-suite.log'
old_bytes=RB(old_node_source); old_ref=write_pkg('payload/regression/node-full-suite-pre-correction-superseded.txt',old_bytes)
old_entry={'originalRef':{'path':RP(old_node_source),'bytes':len(old_bytes),'sha256':H(old_bytes)},'pathInPackage':old_ref['path'],'bytes':old_ref['bytes'],'sha256':old_ref['sha256'],'classification':'SUPERSEDED_NODE_REGRESSION_LOG','usedBy':['pre-correction-regression-history']}
idx['entries']=[e for e in idx['entries'] if e.get('pathInPackage')!=old_ref['path']]; idx['entries'].append(old_entry)
new_node_entry,new_node_ref=add_source(node_path,'payload/regression/node-full-suite.txt','CORRECTED_FULL_NODE_REGRESSION_LOG','final-regression')
idx['entries']=[e for e in idx['entries'] if e.get('pathInPackage')!='payload/regression/node-full-suite.txt']; idx['entries'].append(new_node_entry)
focused_refs=[]
for source,dest,label in ((REG/'absolute-value-spec.log','payload/regression/absolute-value-spec-focused.txt','absolute-value-spec-2-of-2'),(REG/'phase4-focused-spec-construction-corrected.log','payload/regression/phase4-spec-construction-focused.txt','phase4-spec-construction-29-of-29')):
 entry,ref=add_source(source,dest,'FOCUSED_NODE_REGRESSION_LOG','corrective-focused-validation'); idx['entries'].append(entry); focused_refs.append({'label':label,'log':ref})
syntax_summary={'schemaVersion':'APMATH_NODE_SYNTAX_DEFECT_ATTEMPT_v1','status':'FAILED_BEFORE_CORRECTION','defects':[{'testFile':'archive/tools/geometry-equation/tests/phase4-absolute-value-spec.test.mjs','line':50,'error':'SyntaxError: Invalid or unexpected token','cause':'Literal backslash+n suffix at EOF.'},{'testFile':'archive/tools/geometry-equation/tests/absolute-value-archive.test.mjs','line':118,'error':'SyntaxError: Invalid or unexpected token','cause':'Same EOF cleanup mistake; fixed before corrected suite.'}],'rawFailureLogPreserved':False,'note':'The full-suite log path was reused for the corrected run; this structured record does not claim to be a raw failure log.'}
syntax_ref=write_json('payload/regression/node-syntax-defect-attempt.json',syntax_summary)
idx['entries'].append({'originalRef':syntax_ref,'pathInPackage':syntax_ref['path'],'bytes':syntax_ref['bytes'],'sha256':syntax_ref['sha256'],'classification':'FAILED_NODE_SYNTAX_ATTEMPT_SUMMARY','usedBy':['superseded-syntax-failure']})

summary['supersededPriorNodeRun']={'status':'SUPERSEDED','tests':158,'passed':158,'reason':'The earlier 158/158 log predates the committed test-file EOF syntax defect. It is not current validation.','logRef':old_ref}
summary['syntaxDefectAttempt']=syntax_ref
summary['node']={'command':'node --test --test-concurrency=1 all geometry-equation tests except archive-cancel-recovery.test.mjs','exitCode':0,'tests':tests,'passed':passes,'failed':fails,'excludedTestFile':'archive/tools/geometry-equation/tests/archive-cancel-recovery.test.mjs','exclusionReason':'This file enters q10 Phase 2. It was excluded to preserve the canonical q10 shared 3/3 ledger.','log':new_node_ref}
summary['focusedNodeTests']=[{'command':'node --test phase4-absolute-value-spec.test.mjs','tests':2,'passed':2,'failed':0,'log':focused_refs[0]['log']},{'command':'node --test --test-concurrency=1 absolute-value-archive plus all Phase 4 spec/Construction files','tests':29,'passed':29,'failed':0,'log':focused_refs[1]['log']}]
summary_ref=write_json('regression-summary.json',summary)
for e in idx['entries']:
 if e.get('pathInPackage')=='regression-summary.json': e.update({'bytes':summary_ref['bytes'],'sha256':summary_ref['sha256']}); e['originalRef']={'path':'regression-summary.json','bytes':summary_ref['bytes'],'sha256':summary_ref['sha256']}

attempt['correctiveRegression']={'status':'PASS','testFilesFixed':['archive/tools/geometry-equation/tests/phase4-absolute-value-spec.test.mjs','archive/tools/geometry-equation/tests/absolute-value-archive.test.mjs'],'focused':summary['focusedNodeTests'],'safeNodeSuite':summary['node'],'syntaxDefectAttempt':syntax_ref}
attempt_ref=write_json('attempt-ledger.json',attempt)
for e in idx['entries']:
 if e.get('pathInPackage')=='attempt-ledger.json': e.update({'bytes':attempt_ref['bytes'],'sha256':attempt_ref['sha256']}); e['originalRef']={'path':'attempt-ledger.json','bytes':attempt_ref['bytes'],'sha256':attempt_ref['sha256']}

ledger['regression']={'path':'regression-summary.json','sha256':summary_ref['sha256'],'node':summary['node'],'python':summary['python'],'focusedNodeTests':summary['focusedNodeTests'],'supersededPriorNodeRun':summary['supersededPriorNodeRun']}
ledger['archiveScreenshotCount']=3*len(artifacts); ledger['archiveRowJsonCount']=len(artifacts)
phase4_bytes=(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n').encode('utf-8'); HP(PKG/'phase4-ledger.json').write_bytes(phase4_bytes)
phase4_ref={'path':'phase4-ledger.json','bytes':len(phase4_bytes),'sha256':H(phase4_bytes)}
for e in idx['entries']:
 if e.get('pathInPackage')=='phase4-ledger.json': e.update({'bytes':phase4_ref['bytes'],'sha256':phase4_ref['sha256']}); e['originalRef']={'path':'phase4-ledger.json','bytes':phase4_ref['bytes'],'sha256':phase4_ref['sha256']}

targets={'archive/tools/geometry-equation/tests/absolute-value-archive.test.mjs','archive/tools/geometry-equation/tests/phase4-absolute-value-spec.test.mjs'}
for collection in (idx['codeRefs'],ledger['codeRefs']):
 for ref in collection:
  if ref.get('path') in targets:
   b=RB(ref['path']); ref['bytes']=len(b); ref['sha256']=H(b)
report=Path('docs/reports/APMath_Visual_Production_Phase3-5_20261006.md')
text=RB(report).decode('utf-8')
old='The final Node suite passed 158/158 with only `archive-cancel-recovery.test.mjs` excluded because that test enters q10 Phase 2; the q10 canonical ledger was checked at 3/3 and no q10 replay was run.'
new='The corrected final Node suite passed 158/158 with only `archive-cancel-recovery.test.mjs` excluded because that test enters q10 Phase 2; the q10 canonical ledger was checked at 3/3 and no q10 replay was run. The earlier 158/158 log is superseded because it predates the committed EOF syntax defect.'
if old in text: text=text.replace(old,new)
report_bytes=text.encode('utf-8'); HP(report).write_bytes(report_bytes); report_pkg=write_pkg('payload/checkpoints/phase3Report.md',report_bytes)
report_source={'path':report.as_posix(),'bytes':len(report_bytes),'sha256':H(report_bytes)}
idx['externalTrackedRefs']['phase3Report']=report_source; ledger['externalCheckpointRefs']['phase3Report']=report_source; idx['externalPackageRefs']['phase3Report']=report_pkg
for e in idx['entries']:
 if e.get('pathInPackage')=='payload/checkpoints/phase3Report.md': e.update({'originalRef':report_source,'bytes':report_pkg['bytes'],'sha256':report_pkg['sha256']})
phase4_bytes=(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n').encode('utf-8'); HP(PKG/'phase4-ledger.json').write_bytes(phase4_bytes)
phase4_ref={'path':'phase4-ledger.json','bytes':len(phase4_bytes),'sha256':H(phase4_bytes)}
for e in idx['entries']:
 if e.get('pathInPackage')=='phase4-ledger.json': e.update({'bytes':phase4_ref['bytes'],'sha256':phase4_ref['sha256']}); e['originalRef']={'path':'phase4-ledger.json','bytes':phase4_ref['bytes'],'sha256':phase4_ref['sha256']}

refresh_source=Path('.tmp/archive/phase4-correction-20261007')/EXAM/'visual-engine/production/refresh_v12_evidence.py'
refresh_entry,refresh_ref=add_source(refresh_source,'payload/tooling/refresh_v12_evidence.py','PACKAGE_EVIDENCE_REFRESH_SOURCE','package-refresh-reproducibility')
idx['entries'].append(refresh_entry); idx['evidenceRefreshSourceRef']=refresh_ref
idx_bytes=(json.dumps(idx,ensure_ascii=False,indent=2)+'\n').encode('utf-8'); HP(PKG/'evidence-index.json').write_bytes(idx_bytes)

files=[]
for p in HP(PKG).rglob('*'):
 if p.is_file() and p.relative_to(HP(PKG)).as_posix()!='evidence-manifest.json':
  b=RB(p); files.append({'path':p.relative_to(HP(PKG)).as_posix(),'bytes':len(b),'sha256':H(b)})
files.sort(key=lambda x:x['path'])
manifest={'schemaVersion':'APMATH_PHASE4_CURRENT_GRAPH_OVERVIEWS_MANIFEST_v2','classification':ledger['classification'],'compositeScopeFingerprint':ledger['compositeScopeFingerprint'],'files':files}
mb=(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode('utf-8'); HP(PKG/'evidence-manifest.json').write_bytes(mb)
print(json.dumps({'status':'PASS_REFRESHED','archiveRows':len(artifacts),'archiveScreenshots':3*len(artifacts),'archiveRowJson':len(artifacts),'manifestFiles':len(files),'manifestBytes':sum(x['bytes'] for x in files),'manifestSha256':H(mb),'indexEntries':len(idx['entries']),'node':f'{tests}/{passes} passed, {fails} failed','focused':{'absolute':2,'phase4Construction':29}},ensure_ascii=False,indent=2))
