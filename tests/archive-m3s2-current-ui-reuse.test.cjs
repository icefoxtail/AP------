'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const test=require('node:test'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const ui=require('../tools/4slot/m3s2-layout-continuity.cjs');
const root=path.resolve(__dirname,'..'),clone=x=>JSON.parse(JSON.stringify(x));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const memo=new Map();
function git(args,maxBuffer=8*1024*1024){const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
 return execFileSync('git',['-C',root,...args],{env,maxBuffer,timeout:60000,stdio:['ignore','pipe','pipe']});}
function immutable(ref){
 const key=JSON.stringify(ref);if(memo.has(key))return memo.get(key);
 assert.match(ref.commit,/^[a-f0-9]{40}$/);assert.match(ref.gitBlobSha1,/^[a-f0-9]{40}$/);assert.match(ref.sha256,/^[a-f0-9]{64}$/);
 assert.ok(Number.isSafeInteger(ref.bytes)&&ref.bytes>0&&ref.bytes<4*1024*1024);
 assert.ok(typeof ref.path==='string'&&!ref.path.startsWith('/')&&!/[\\\x00-\x1f]/.test(ref.path)&&ref.path.split('/').every(x=>x&&x!=='.'&&x!=='..'));
 assert.equal(git(['ls-tree','-z',ref.commit,'--',ref.path]).toString(),'100644 blob '+ref.gitBlobSha1+'\t'+ref.path+'\0');
 const bytes=git(['cat-file','blob',ref.gitBlobSha1]);assert.equal(bytes.length,ref.bytes);assert.equal(sha(bytes),ref.sha256);assert.equal(blob(bytes),ref.gitBlobSha1);
 memo.set(key,bytes);return bytes;
}
function regular(relative){
 let p=root;for(const part of relative.split('/')){p=path.join(p,part);assert.equal(fs.lstatSync(p).isSymbolicLink(),false);}
 assert.equal(fs.statSync(p).isFile(),true);return fs.readFileSync(p);
}
function fixture({changes=new Map(),denied=new Set(),bytesChanged=new Map()}={}){
 const c=ui.currentUiPins(),reads=[];
 const read={root,reads,
  ancestor(commit){git(['merge-base','--is-ancestor',commit,'HEAD']);},
  ref(ref,live=false){
   if(denied.has(ref.path))throw Error('TEST_CURRENT_UI_INPUT_MISSING');
   let bytes=immutable(ref);if(live)assert.equal(sha(regular(ref.path)),ref.sha256);
   reads.push({path:ref.path,live});
   if(changes.has(ref.path)){const doc=JSON.parse(bytes);changes.get(ref.path)(doc);bytes=Buffer.from(JSON.stringify(doc));}
   if(bytesChanged.has(ref.path))bytes=bytesChanged.get(ref.path)(Buffer.from(bytes));
   return bytes;
  }};
 const technical=JSON.parse(read.ref(c.technicalRef)),visual=JSON.parse(read.ref(c.visualRef));
 return{technical,visual,refs:{technicalRef:c.technicalRef,visualRef:c.visualRef,artifactRefs:c.artifacts},read,pins:c};
}
test('Q16 actual current2 reuses whole original captures and separate visual records',()=>{
 const f=fixture();assert.equal(ui.assertCurrentUiReuse(f.technical,f.visual,f.refs,f.read),true);
 assert.equal(f.visual.newMathematicalQa,0);assert.equal(f.visual.newFourSlotVector,0);
 assert.ok(f.read.reads.some(r=>r.path===f.pins.framesRef.path&&r.live));
 assert.equal(f.read.reads.filter(r=>r.path.endsWith('.png')&&r.live).length,2);
});
test('Q16 rejects an unrecognized engine for every untrusted token argument',()=>{
 const f=fixture(),technical=clone(f.technical);
 // Main2378 and the exact current capture now share engine226. A valid current
 // engine is no longer a negative input; arbitrary bytes still require refusal.
 const engine=technical.servedFiles.find(ref=>ref.path===f.pins.engine.path);assert.ok(engine);
 engine.gitBlobSha1='0'.repeat(40);engine.sha256='0'.repeat(64);
 assert.throws(()=>ui.assertUiRenderDependencies(technical,f.read),/M3S2_LAYOUT_UI_ENGINE/);
 assert.throws(()=>ui.assertUiRenderDependencies(technical,f.read,true),/M3S2_LAYOUT_UI_ENGINE/);
 assert.throws(()=>ui.assertUiRenderDependencies(technical,f.read,{}),/M3S2_LAYOUT_UI_ENGINE/);
});
test('Q16 old and current UI requests remain separate',()=>{
 const f=fixture(),p=JSON.parse(immutable(f.pins.priorTechnicalRef)),v=JSON.parse(immutable(f.pins.priorVisualRef));
 assert.equal(ui.currentUiRequested(f.technical,f.visual,f.refs),true);
 assert.equal(ui.currentUiRequested(p,v,{technicalRef:f.pins.priorTechnicalRef}),false);
});
test('Q16 exported pin copy cannot change the current policy',()=>{
 const c=ui.currentUiPins();c.engine.gitBlobSha1='0'.repeat(40);c.technicalRef.sha256='0'.repeat(64);
 assert.notEqual(ui.currentUiPins().engine.gitBlobSha1,c.engine.gitBlobSha1);
 assert.notEqual(ui.currentUiPins().technicalRef.sha256,c.technicalRef.sha256);
});
for(const[name,change]of[
 ['technical path',f=>f.refs.technicalRef.path='docs/operations/other.json'],
 ['technical hash',f=>f.refs.technicalRef.sha256='0'.repeat(64)],
 ['visual path',f=>f.refs.visualRef.path='docs/operations/other.json'],
 ['artifact omission',f=>f.refs.artifactRefs.pop()],
 ['artifact digest',f=>f.refs.artifactRefs[0].sha256='0'.repeat(64)]
])test('Q16 refuses partial or changed closed refs: '+name,()=>{
 const f=fixture();change(f);assert.throws(()=>ui.assertCurrentUiReuse(f.technical,f.visual,f.refs,f.read),/M3S2_LAYOUT_CURRENT_UI_CLOSED_REFS/);
});
const pins=ui.currentUiPins();
for(const[name,ref,change]of[
 ['unknown capture event',pins.technicalRef,d=>d.executionProvenance.checkout.eventName='pull_request'],
 ['wrong run',pins.technicalRef,d=>d.executionProvenance.checkout.runId='1'],
 ['wrong job',pins.technicalRef,d=>d.executionProvenance.checkout.job='other'],
 ['wrong executable',pins.technicalRef,d=>d.executionProvenance.executableSha256='0'.repeat(64)],
 ['new visual approval',pins.visualRef,d=>d.newSemanticApproval=1],
 ['new four-slot vector',pins.visualRef,d=>d.newFourSlotVector=1],
 ['replaced prior reviewer',pins.visualRef,d=>d.reviewer='replacement'],
 ['missing live guard',pins.visualRef,d=>d.currentFullLiveCodeFontAssetGuardsRequired=false],
 ['false renderer equivalence',pins.visualRef,d=>d.sharedRendererCodeEquivalenceClaimed=true],
 ['changed prior visual decision',pins.priorVisualRef,d=>d.decision='PENDING'],
 ['changed prior visual capture',pins.priorVisualRef,d=>d.records[0].captureSha256='0'.repeat(64)],
 ['missing independent acceptance',pins.witnessRef,d=>d.decision='PENDING'],
 ['different witness head',pins.witnessRef,d=>d.actualCapture.head='0'.repeat(40)],
 ['different original source',pins.technicalRef,d=>d.items[0].sourceRef.sha256='0'.repeat(64)],
 ['different selected metadata',pins.technicalRef,d=>d.selectedDataProjections.metadataSha256='0'.repeat(64)],
 ['new selected image',pins.technicalRef,d=>d.items[0].assetRefs.push(d.items[0].sourceRef)],
 ['changed current capture',pins.technicalRef,d=>d.results[0].capture.content.height++],
 ['changed PNG digest',pins.technicalRef,d=>d.results[0].screenshots[0].sha256='0'.repeat(64)],
 ['changed geometry',pins.technicalRef,d=>d.results[0].geometry.noteBoxCount++],
 ['font response missing',pins.technicalRef,d=>d.studentFontResources.pop()],
 ['font response tampered',pins.technicalRef,d=>d.studentFontResources[0].sha256='0'.repeat(64)],
 ['undeclared case font',pins.technicalRef,d=>d.results[0].technical.fontResourceIds.push('0'.repeat(64))],
 ['changed font readiness',pins.technicalRef,d=>d.results[0].technical.fontReadiness.weights[0].loadedFaces++],
 ['changed capture binding',pins.visualRef,d=>d.captureBindings[0].currentCaptureSha256='0'.repeat(64)],
 ['provenance rewrite',pins.visualRef,d=>d.captureProvenanceDelta.measurementAndCoverageFieldsChanged=1]
])test('Q16 policy refuses '+name,()=>{
 const f=fixture({changes:new Map([[ref.path,change]])});
 assert.throws(()=>ui.assertCurrentUiReuse(f.technical,f.visual,f.refs,f.read),/M3S2_LAYOUT_/);
});
for(const[name,ref]of[['technical',pins.technicalRef],['visual',pins.visualRef],['old technical',pins.priorTechnicalRef],['old visual',pins.priorVisualRef],['independent witness',pins.witnessRef],['frames',pins.framesRef],['PNG',pins.artifacts[0]]])
 test('Q16 missing required '+name+' fails closed',()=>{
  // Load the input values first; then deny an actual resolver read.
  const f=fixture(),base=f.read.ref;f.read.ref=(r,live)=>{if(r.path===ref.path)throw Error('TEST_CURRENT_UI_INPUT_MISSING');return base(r,live);};
  assert.throws(()=>ui.assertCurrentUiReuse(f.technical,f.visual,f.refs,f.read),/TEST_CURRENT_UI_INPUT_MISSING/);
 });
test('Q16 non-PNG bytes cannot substitute for a declared original tile',()=>{
 const f=fixture({bytesChanged:new Map([[pins.artifacts[0].path,()=>Buffer.from('not a PNG')]])});
 assert.throws(()=>ui.assertCurrentUiReuse(f.technical,f.visual,f.refs,f.read),/M3S2_LAYOUT_CURRENT_UI_PNG_BYTES/);
});
test('Q16 omitted publication ancestry is refused',()=>{
 const f=fixture();delete f.read.ancestor;
 assert.throws(()=>ui.assertCurrentUiReuse(f.technical,f.visual,f.refs,f.read),/M3S2_LAYOUT_CURRENT_UI_ANCESTRY_READER/);
});
if(process.argv.includes('--actual-authority'))test('actual Q16 official verifier keeps original vector24, MDID and all current live UI dependencies',async()=>{
 const beforeStatus=git(['status','--porcelain','--untracked-files=all']).toString();
 const sidecarPath=ui.DIR+'/'+ui.UID+'.json',raw=regular(sidecarPath),doc=JSON.parse(raw);
 ui.assertSubject(doc);
 const compactRaw=regular(doc.refs.compactRef.path),d=JSON.parse(compactRaw),sourceRaw=regular(doc.refs.currentSourceRef.path);
 assert.equal(sha(compactRaw),doc.refs.compactRef.sha256);assert.equal(blob(compactRaw),doc.refs.compactRef.gitBlobSha1);
 assert.equal(sha(sourceRaw),doc.refs.currentSourceRef.sha256);assert.equal(blob(sourceRaw),doc.refs.currentSourceRef.gitBlobSha1);
 const {loadM3Q5CompleteGivenBank}=await import('../archive/tools/meta-foundation/reviewed-m3-e052-q5-complete-given.mjs');
 const bank=loadM3Q5CompleteGivenBank(sourceRaw),identity=JSON.parse(regular('archive/data/question_identity_map.json'));
 const ids=identity.records.filter(r=>r.questionUid===ui.UID);assert.equal(ids.length,1);
 const uidUses=new Map();for(const r of identity.records)uidUses.set(r.questionUid,(uidUses.get(r.questionUid)||0)+1);
 const it=d.items.find(x=>x.ordinal===ui.ORDINAL);assert.ok(it);
 const result=ui.verify(root,{path:sidecarPath,sha256:sha(raw),questionUid:ui.UID,sourceOrdinal:ui.ORDINAL,doc},{
  d,it,id:ids[0],cur:{ordinal:ui.ORDINAL,q:bank[ui.ORDINAL-1]},dict:{path:doc.refs.dictionaryRef.path,sha256:doc.refs.dictionaryRef.sha256},
  bank,sourceRaw,identity,uidUses,loadBank:loadM3Q5CompleteGivenBank
 });
 assert.equal(result.scope,'EXISTING_VECTOR_LAYOUT_ONLY');assert.equal(result.newApprovals,0);
 assert.equal(result.logicalCases,2);assert.equal(result.originalTiles,2);
 const observed=new Map(result.observed);for(const ref of [pins.technicalRef,pins.visualRef,pins.priorTechnicalRef,pins.priorVisualRef,pins.witnessRef,pins.framesRef,...pins.artifacts])
  assert.equal(observed.get(ref.path),ref.sha256,'CURRENT_UI_PROOF_NOT_OBSERVED');
 for(const [p,h]of observed)assert.equal(sha(regular(p)),h,'FINAL_OBSERVED_INPUT_DRIFT');
 assert.equal(git(['status','--porcelain','--untracked-files=all']).toString(),beforeStatus,'ACTUAL_AUTHORITY_VERIFIER_MUST_BE_READ_ONLY');
});
