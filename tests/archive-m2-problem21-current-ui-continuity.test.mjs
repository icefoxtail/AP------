import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {
  M2_P21_CURRENT_EIGHT_BINDING_REF,M2_P21_CURRENT_EIGHT_ITEMS,
  verifyM2Problem21CurrentUiMetadata,verifyM2Problem21CurrentSourcePair,
  verifyM2Problem21CurrentDataProjection,verifyM2Problem21CurrentSvgProjection,
  assertM2Problem21CurrentUiLeaf,readM2Problem21CurrentUiContinuation,
  replayM2Problem21CurrentUiContinuation
} from '../archive/tools/meta-foundation/m2-problem21-current-ui-continuity.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const clone=x=>structuredClone(x),json=x=>Buffer.from(JSON.stringify(x)+'\n');
const cache=new Map();
function bound(ref){
  const key=ref.commit+':'+ref.path;
  if(cache.has(key))return Buffer.from(cache.get(key));
  const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
  const run=args=>execFileSync('git',args,{cwd:root,maxBuffer:128*1024*1024,timeout:30000,env,stdio:['ignore','pipe','pipe']});
  assert.equal(run(['ls-tree','-z',ref.commit,'--',ref.path]).toString(),'100644 blob '+ref.gitBlobSha1+'\t'+ref.path+'\0');
  const raw=run(['cat-file','blob',ref.gitBlobSha1]);
  assert.equal(raw.length,ref.bytes);assert.equal(sha(raw),ref.sha256);assert.equal(blob(raw),ref.gitBlobSha1);
  cache.set(key,raw);return Buffer.from(raw);
}
const binding=JSON.parse(bound(M2_P21_CURRENT_EIGHT_BINDING_REF));
const baseline={root,binding,technical:JSON.parse(bound(binding.currentTechnicalRef)),
  originalTechnical:JSON.parse(bound(binding.originalTechnicalRef)),originalObserved:JSON.parse(bound(binding.originalObservedRef)),
  reuse:JSON.parse(bound(binding.currentReuseRef)),mobile:JSON.parse(bound(binding.currentMobileVisualRef)),
  readback:JSON.parse(bound(binding.rootRawReadbackRef))};
const one=M2_P21_CURRENT_EIGHT_ITEMS[0];
const parse=v=>JSON.parse(v.toString('utf8'));

test('fresh actual16/18 keeps original ten observations and separate six mobile reviews',()=>{
  assert.deepEqual(verifyM2Problem21CurrentUiMetadata(baseline),{
    status:'PASS',logicalCases:16,pngs:18,reusedOriginalVisual:10,directCurrentVisual:6,newApprovals:0});
});

for(const [label,mutate] of [
  ['wrong push branch',x=>x.technical.execution.ref='refs/heads/main'],
  ['wrong repository',x=>x.technical.execution.repository='other/fork'],
  ['push represented as pull request',x=>x.technical.execution.eventName='pull_request'],
  ['wrong run',x=>x.technical.execution.runId='44023454160'],
  ['unknown checkout',x=>x.technical.checkoutCommit='0'.repeat(40)],
  ['mixed expected checkout',x=>x.technical.checkout.expectedCheckoutCommit='0'.repeat(40)],
  ['missing execution ownership',x=>delete x.technical.executionOwner],
  ['source overlay forbidden',x=>x.technical.sourceOverlay=true],
  ['source writes forbidden',x=>x.technical.sourceWrites=1],
  ['new mathematical approval forbidden',x=>x.technical.newFullMathematicalQa=true],
  ['new four-slot approval forbidden',x=>x.technical.newFourSlotApprovals=1],
  ['missing logical case',x=>x.technical.results.pop()],
  ['duplicate logical case',x=>x.technical.results[1]=clone(x.technical.results[0])],
  ['missing original full48 case',x=>x.originalTechnical.results.pop()],
  ['missing original full51 tile',x=>x.originalTechnical.screenshotArtifacts.pop()],
  ['old observer cannot become independent math QA',x=>x.originalObserved.roleDisclosure.independentMathQa=true],
  ['six direct mobile reviews required',x=>x.mobile.records.pop()],
  ['mobile reviewer identity changed',x=>x.mobile.reviewer='producer'],
  ['mobile approval escalation forbidden',x=>x.mobile.authorityBoundary.newNativeApprovals=1],
  ['missing direct PNG inspection',x=>x.mobile.records[0].screenshots[0].actualDirectVisualInspection=false],
  ['wrong mobile observation',x=>x.mobile.records[0].captureSha256='0'.repeat(64)],
  ['old visual cannot excuse a changed mobile',x=>x.binding.records.find(r=>r.observationMode==='CURRENT_INDEPENDENT_MOBILE_SIX').observationMode='ORIGINAL_OBSERVATION_SAME_PNG_AND_GEOMETRY'],
  ['wrong reuse count',x=>x.reuse.scope.exactScreenshotCases=16],
  ['new mobile cannot be marked reused',x=>x.reuse.records.find(r=>r.newVisualRequired).newVisualRequired=false],
  ['live renderer inventory incomplete',x=>x.technical.servedFiles.pop()],
  ['duplicate served input',x=>x.technical.servedFiles[1]=clone(x.technical.servedFiles[0])],
  ['mirror inventory incomplete',x=>x.technical.mirroredAssets.pop()],
  ['font inventory incomplete',x=>x.technical.studentFontResources.pop()],
  ['external fonts forbidden',x=>x.technical.externalFontResources=[{path:'unbound'}]],
  ['unbound per-case font resource',x=>x.technical.results[0].technical.fontResourceIds[0]='0'.repeat(64)],
  ['unloaded font face',x=>x.technical.results[0].technical.fontReadiness.weights[0].allLoaded=false],
  ['missing image readiness',x=>x.technical.results[0].technical.imagesComplete=false],
  ['math renderer error',x=>x.technical.results[0].technical.mathErrors=1],
  ['solution surface forbidden',x=>x.technical.results[0].technical.solutionNodes=1],
  ['partial image geometry forbidden',x=>x.technical.results[0].geometry.imageInsideQuestion=false],
  ['changed capture geometry',x=>x.technical.results[0].geometry.naturalWidth++],
  ['current whole problem payload mismatch',x=>x.technical.items[0].problemPayloadSha256='0'.repeat(64)],
  ['wrong source pin',x=>x.technical.results[0].sourceRef.gitBlobSha1='0'.repeat(40)],
  ['wrong asset pin',x=>x.technical.results[0].assetRef.sha256='0'.repeat(64)],
  ['missing full PNG readback',x=>x.readback.checks.pngFullRemoteReadback=17],
  ['PNG reference commit substitution',x=>x.binding.records[0].screenshots[0].immutableRef.commit='0'.repeat(40)],
  ['PNG byte hash substitution',x=>x.binding.records[0].screenshots[0].sha256='0'.repeat(64)],
  ['extra returned PNG',x=>x.technical.screenshotArtifacts.push(clone(x.technical.screenshotArtifacts[0]))],
  ['current evidence cannot erase ordinary Native',x=>x.binding.authorityBoundary.originalNativeAuthorityRequired=false],
  ['Q10 separate observer remains required',x=>x.binding.authorityBoundary.originalQ10SeparateObserverRequired=false],
  ['E023 solution continuity remains required',x=>x.binding.authorityBoundary.originalE023SolutionDisplayRequired=false]
])test('current display guard: '+label,()=>{
  const value=clone(baseline);mutate(value);
  assert.throws(()=>verifyM2Problem21CurrentUiMetadata(value));
});

for(const item of [M2_P21_CURRENT_EIGHT_ITEMS[0],M2_P21_CURRENT_EIGHT_ITEMS[6]]){
  test('exact issued/current bank metadata transport: '+item.key.split('-')[0],()=>{
    const result=verifyM2Problem21CurrentSourcePair({sourceArchiveFile:item.sourceArchiveFile,
      oldBytes:bound(item.issuedSourceRef),currentBytes:bound(item.currentSourceRef)});
    assert.equal(result.count,item.expectedQuestionCount);
    assert.equal(result.selectedWholeQuestionHashes.length,item.key.startsWith('E017')?6:2);
    assert.deepEqual(result.changes.map(r=>r.ordinal),item.key.startsWith('E017')?[2,6,17]:[]);
  });
}
test('changed source bytes cannot be normalized through a valid old pin',()=>{
  const raw=bound(one.currentSourceRef);
  assert.throws(()=>verifyM2Problem21CurrentSourcePair({sourceArchiveFile:one.sourceArchiveFile,
    oldBytes:bound(one.issuedSourceRef),currentBytes:Buffer.concat([raw,Buffer.from(' ')])}),/RAW_GIT_PIN/);
});
test('other bank cannot use selected source transport',()=>{
  assert.throws(()=>verifyM2Problem21CurrentSourcePair({sourceArchiveFile:'original/unknown.js',
    oldBytes:Buffer.from('[]'),currentBytes:Buffer.from('[]')}),/SOURCE_OUTSIDE_CLOSED_TWO/);
});

const receiptDocs=[...new Map(M2_P21_CURRENT_EIGHT_ITEMS.map(i=>[i.receiptRef.path,i.receiptRef])).values()]
  .map(ref=>parse(bound(ref)));
function data(kind){
  const key=kind==='IDENTITY'?'appliedIdentityRecords':'appliedRecords',ids=new Set(M2_P21_CURRENT_EIGHT_ITEMS.map(i=>i.questionUid));
  return{records:receiptDocs.flatMap(r=>r[key]).filter(r=>ids.has(r.questionUid))};
}
for(const kind of ['METADATA','IDENTITY']){
  test(kind+' projection preserves all eight exact issued rows despite unrelated data order',()=>{
    const before=data(kind),after=clone(before);
    after.records.reverse();after.records.push({questionUid:'fixture-unrelated',sourceArchiveFile:'original/fixture.json',sourceOrdinal:1});
    assert.equal(verifyM2Problem21CurrentDataProjection({capturedBytes:json(before),currentBytes:json(after),kind}).selected,8);
  });
  for(const [label,change] of [
    ['missing selected row',d=>d.records.pop()],
    ['selected row field drift',d=>d.records[0].sourceFingerprint='0'.repeat(64)],
    ['duplicate selected UID',d=>d.records.push(clone(d.records[0]))],
    ['contradictory selected ordinal',d=>d.records[0].sourceOrdinal++],
    ['duplicate outside UID',d=>d.records.push({questionUid:'outside',sourceArchiveFile:'original/x.js',sourceOrdinal:1},
      {questionUid:'outside',sourceArchiveFile:'original/y.js',sourceOrdinal:2})]
  ])test(kind+' data guard: '+label,()=>{
    const before=data(kind),after=clone(before);change(after);
    assert.throws(()=>verifyM2Problem21CurrentDataProjection({capturedBytes:json(before),currentBytes:json(after),kind}));
  });
}
test('identity joins remain globally unique for different UIDs',()=>{
  const before=data('IDENTITY'),after=clone(before);
  after.records.push({...after.records[0],questionUid:'another-uid'});
  assert.throws(()=>verifyM2Problem21CurrentDataProjection({capturedBytes:json(before),currentBytes:json(after),kind:'IDENTITY'}),/GLOBAL_IDENTITY_JOIN/);
});
test('unknown data kind is refused',()=>{
  assert.throws(()=>verifyM2Problem21CurrentDataProjection({capturedBytes:json({}),currentBytes:json({}),kind:'OTHER'}),/DATA_KIND/);
});

const capturedSvgRef=baseline.technical.servedFiles.find(r=>r.path==='archive/data/svg-accessibility-index.js');
const capturedSvg=bound(capturedSvgRef);
test('actual current capture has zero named entries; zero stays zero',()=>{
  const r=verifyM2Problem21CurrentSvgProjection({capturedBytes:capturedSvg,currentBytes:capturedSvg});
  assert.equal(r.selected,8);assert.ok(r.rows.every(x=>x.capturedRecords===0&&x.currentRecords===0));
});
test('invalid generated wrapper cannot be treated as an empty index',()=>{
  assert.throws(()=>verifyM2Problem21CurrentSvgProjection({capturedBytes:capturedSvg,currentBytes:Buffer.from('{}')}));
});

test('ordinary caller without a token receives no comparison source',()=>{
  assert.equal(readM2Problem21CurrentUiContinuation({context:undefined}),null);
});
test('fabricated public object cannot create a private token',()=>{
  assert.throws(()=>assertM2Problem21CurrentUiLeaf({context:Object.freeze({})}),/PRIVATE_SELECTED_LEAF/);
  assert.throws(()=>readM2Problem21CurrentUiContinuation({context:Object.freeze({})}),/PRIVATE_ORIGINAL_P21_READER/);
});
test('unknown UID never invokes a replay callback',()=>{
  let called=false;
  assert.equal(replayM2Problem21CurrentUiContinuation({nativeSource:{root},identity:{questionUid:'unknown'},
    revalidateLeaf(){called=true;return true;}}),null);
  assert.equal(called,false);
});
test('same-bank nonselected39 cannot borrow the closed-eight replay',()=>{
  let called=false;
  assert.equal(replayM2Problem21CurrentUiContinuation({nativeSource:{root},identity:{questionUid:'nonselected'},
    source:one.sourceArchiveFile,ordinal:6,revalidateLeaf(){called=true;return true;}}),null);
  assert.equal(called,false);
});
test('known UID cannot change source or ordinal',()=>{
  for(const extra of [{source:'original/other.js',ordinal:one.sourceOrdinal},
      {source:one.sourceArchiveFile,ordinal:one.sourceOrdinal+1}])
    assert.throws(()=>replayM2Problem21CurrentUiContinuation({nativeSource:{root},identity:{questionUid:one.questionUid},...extra}),/CLOSED_UID_SOURCE_ORDINAL/);
});
test('mixed or caller-made continuation is refused before any proof read',()=>{
  for(const key of ['m2Problem21CurrentUiContinuation','e015IssuedSourceContinuation','issuedRpmHistoryContext','issuedSolutionRpmHistoryContext'])
    assert.throws(()=>replayM2Problem21CurrentUiContinuation({nativeSource:{root,[key]:{}},identity:{questionUid:one.questionUid},
      source:one.sourceArchiveFile,ordinal:one.sourceOrdinal}),/MIXED_PRIVATE_CONTINUATION/);
});

// The original observed document is already authenticated by bound() above.
// Its cases transport a digest of the original observation, not of the case.
const originalReuseCases=value=>value.binding.records
  .filter(row=>row.observationMode==='ORIGINAL_OBSERVATION_SAME_PNG_AND_GEOMETRY')
  .map(row=>({bound:row,
    observed:value.originalObserved.cases.find(r=>r.questionUid===row.questionUid&&r.viewport===row.viewport.name),
    reuse:value.reuse.records.find(r=>r.questionUid===row.questionUid&&r.viewport===row.viewport.name)}));
test('original observation transport keeps all ten retained record digests and full16 coverage',()=>{
  const rows=originalReuseCases(baseline);
  assert.equal(rows.length,10);
  const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)
    ?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
  for(const {bound:row,observed,reuse} of rows){
    assert.match(observed.observationRecordSha256,/^[a-f0-9]{64}$/);
    assert.notEqual(sha(stable(observed)),observed.observationRecordSha256);
    assert.equal(row.observationRecordSha256,observed.observationRecordSha256);
    assert.equal(reuse.originalObservationRecordSha256,observed.observationRecordSha256);
  }
  assert.deepEqual(verifyM2Problem21CurrentUiMetadata(baseline),{
    status:'PASS',logicalCases:16,pngs:18,reusedOriginalVisual:10,directCurrentVisual:6,newApprovals:0});
});
for(const [label,mutate] of [
  ['missing original record digest',r=>delete r.observed.observationRecordSha256],
  ['invalid original record digest',r=>r.observed.observationRecordSha256='not-a-digest'],
  ['different original record digest',r=>r.observed.observationRecordSha256='0'.repeat(64)],
  ['different binding record digest',r=>r.bound.observationRecordSha256='0'.repeat(64)],
  ['different reuse record digest',r=>r.reuse.originalObservationRecordSha256='0'.repeat(64)],
  ['contradictory original key',r=>r.observed.key='E017-Q05'],
  ['contradictory original ordinal',r=>r.observed.sourceOrdinal++],
  ['unknown original field',r=>r.observed.unboundObservation=true],
  ['changed original decision',r=>r.observed.decision='PENDING'],
  ['changed original PNG bytes',r=>r.observed.screenshots[0].bytes++],
  ['changed original PNG hash',r=>r.observed.screenshots[0].sha256='0'.repeat(64)],
  ['missing original PNG tile',r=>r.observed.screenshots.pop()],
  ['different original immutable ref',r=>r.bound.observationRef.commit='0'.repeat(40)]
])test('original observation transport guard: '+label,()=>{
  const value=clone(baseline);mutate(originalReuseCases(value)[0]);
  assert.throws(()=>verifyM2Problem21CurrentUiMetadata(value),/ORIGINAL_SAME_PNG_OBSERVATION_REUSE/);
});
test('original observation transport refuses a duplicated UID and viewport',()=>{
  const value=clone(baseline),selected=originalReuseCases(value)[0].observed;
  const other=value.originalObserved.cases.findIndex(row=>row.questionUid!==selected.questionUid);
  value.originalObserved.cases[other]=clone(selected);
  assert.throws(()=>verifyM2Problem21CurrentUiMetadata(value),/ORIGINAL_OBSERVATION/);
});
