import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { M2_E006_PROBLEM_SCHEMA, M2_E006_PROBLEM_ITEMS, M2_E006_UI_TECHNICAL_REF, M2_E006_UI_VISUAL_REF,
  validateM2E006ProblemUiEvidence, validateM2E006ProblemUiTileEvidence, validateM2E006ProblemContinuity } from '../archive/tools/meta-foundation/reviewed-m2-e006-problem-continuity.mjs';
import { M2_PROBLEM_RENDERER_ITEMS } from '../archive/tools/meta-foundation/reviewed-m2-problem-renderer-continuity.mjs';
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/archive-m2-e006-problem-continuity.json',import.meta.url)));
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const refKeys=['commit','path','gitBlobSha1','sha256','bytes'];
const bytesRef=r=>Object.fromEntries(refKeys.filter(k=>k!=='commit').map(k=>[k,r[k]]));
const evidenceRef=r=>({path:r.path,sha256:r.sha256});
function setup(index=0){
 const technical=JSON.parse(fixture.technicalRawUtf8),visual=JSON.parse(fixture.visualRawUtf8),item=technical.items[index],known=new Set(),reads=[],live=[];
 const docs=new Map([[stable(M2_E006_UI_TECHNICAL_REF),fixture.technicalRawUtf8],[stable(M2_E006_UI_VISUAL_REF),fixture.visualRawUtf8],
  [stable(technical.manifestRef),fixture.manifestRawUtf8]]);
 const visit=v=>{if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object'){
  if(refKeys.every(k=>Object.hasOwn(v,k)))known.add(stable(Object.fromEntries(refKeys.map(k=>[k,v[k]]))));Object.values(v).forEach(visit);
 }};
 visit(technical);visit(M2_E006_UI_TECHNICAL_REF);visit(M2_E006_UI_VISUAL_REF);visit(JSON.parse(fixture.manifestRawUtf8));
 const x={technical,visual,technicalRef:evidenceRef(M2_E006_UI_TECHNICAL_REF),visualRef:evidenceRef(M2_E006_UI_VISUAL_REF),
  questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,currentSource:bytesRef(item.sourceRef),currentAsset:bytesRef(item.assetRef)};
 x.readRef=ref=>{assert(known.has(stable(ref)),'UNKNOWN_IMMUTABLE_REF');reads.push(ref);return Buffer.from(docs.get(stable(ref))||'opaque input verified by the production Git reader');};
 x.readLiveRef=ref=>{live.push(ref);return x.readRef(ref);};
 return{x,reads,live,docs};
}
for(const index of [0,1])test('the immutable four-case observation binds E006 selected item '+index,()=>{
 const f=setup(index),out=validateM2E006ProblemUiEvidence(f.x);
 assert.equal(out.logicalCases,4);assert.equal(out.screenshotArtifactCount,5);assert.equal(out.selectedLogicalCases,2);
 assert.equal(out.selectedOriginalTiles,index?3:2);
 assert(f.live.some(r=>r.path===f.x.currentSource.path));assert(f.live.some(r=>r.path===f.x.currentAsset.path));
 assert(f.live.some(r=>r.path==='archive/engine.html'));assert(f.live.some(r=>r.path.endsWith('.woff2')));
});
test('new exact-two profile preserves the original THREE denominator',()=>{
 assert.equal(M2_E006_PROBLEM_SCHEMA,'archive-m2-e006-problem-continuity-v1');
 assert.equal(M2_E006_PROBLEM_ITEMS.length,2);assert.equal(M2_PROBLEM_RENDERER_ITEMS.length,3);
 assert.deepEqual(M2_E006_PROBLEM_ITEMS.map(r=>r.sourceOrdinal),[3,21]);
});
test('absence of the new opt-in does not activate E006',()=>{
 assert.equal(validateM2E006ProblemContinuity({patch:{sourceReview:{}}}),null);
 assert.equal(validateM2E006ProblemContinuity({patch:{sourceReview:{m2ProblemRendererContinuity:{}}}}),null);
});
for(const v of [null,undefined,false,{},'archive-m2-e006-problem-continuity-v1'])test('present malformed E006 opt-in fails closed: '+String(v),()=>{
 assert.throws(()=>validateM2E006ProblemContinuity({patch:{sourceReview:{m2E006ProblemContinuity:v}}}),/explicit exclusive M2 renderer contract required/);
});
for(const key of ['questionUid','sourceOrdinal'])test('different E006 subject binding is refused: '+key,()=>{
 const f=setup();f.x[key]=key==='questionUid'?'qid_v1_'+'0'.repeat(64):12;
 assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/exact E006 subject/);
});
for(const key of ['readRef','readLiveRef'])test('missing immutable or live reader cannot inherit actual UI: '+key,()=>{
 const f=setup();delete f.x[key];assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/immutable\/live readers/);
});
for(const key of ['technicalRef','visualRef'])test('another evidence locator or resealed hash is refused: '+key,()=>{
 const f=setup();f.x[key].sha256='0'.repeat(64);assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/published E006 UI references/);
});
for(const key of ['technical','visual'])test('modified argument does not substitute for the actual raw capsule: '+key,()=>{
 const f=setup();f.x[key].foreign=true;assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/document argument changed/);
});
for(const ref of [M2_E006_UI_TECHNICAL_REF,M2_E006_UI_VISUAL_REF])test('actual raw evidence bytes are checked: '+ref.path,()=>{
 const f=setup();f.docs.set(stable(ref),'{}');assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/immutable E006 UI document bytes changed/);
});
for(const pair of [['currentSource','path'],['currentSource','gitBlobSha1'],['currentSource','sha256'],['currentSource','bytes'],
 ['currentAsset','path'],['currentAsset','gitBlobSha1'],['currentAsset','sha256'],['currentAsset','bytes']])test('whole current binding cannot be changed: '+pair.join('.'),()=>{
 const f=setup();f.x[pair[0]][pair[1]]=pair[1]==='bytes'?1:'foreign';
 assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/current E006 complete source or renderer differs/);
});
for(const suffix of ['engine.html','.woff2','.js','.svg'])test('live drift propagates without historical fallback: '+suffix,()=>{
 const f=setup();f.x.readLiveRef=ref=>{if(ref.path.endsWith(suffix))throw Error('LIVE_DRIFT');return f.x.readRef(ref);};
 assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/LIVE_DRIFT/);
});
test('missing original first reference fails instead of accepting stored UI status',()=>{
 const f=setup(),missing=f.x.technical.originalFirstBasisRefs[0].path,read=f.x.readRef;
 f.x.readRef=ref=>{if(ref.path===missing)throw Error('MISSING_ORIGINAL_FIRST');return read(ref);};
 assert.throws(()=>validateM2E006ProblemUiEvidence(f.x),/MISSING_ORIGINAL_FIRST/);
});
function tileCase(index){const f=setup(),r=structuredClone(f.x.technical.results[index]),v=structuredClone(f.x.visual.records.find(x=>x.questionUid===r.questionUid&&x.viewport===r.viewport.name));return{r,v};}
for(let index=0;index<4;index++)test('every actual E006 original scroll case remains valid: '+index,()=>{
 const{r,v}=tileCase(index);assert.deepEqual(validateM2E006ProblemUiTileEvidence({},r,v,r.key),r.screenshots);
});
for(const [label,mutate] of [
 ['coverage omitted',(r)=>{r.capture.coverage.complete=false;}],
 ['missing desktop empty original tile',(r)=>{r.capture.tiles.pop();r.screenshots.pop();r.capture.tileCount--;r.capture.scrollAfter=r.capture.tiles.at(-1).scroll;}],
 ['capture viewport changed',(r)=>{r.capture.viewport.width++;}],
 ['tile clips original content',(r)=>{r.capture.tiles[0].clip.height--;}],
 ['tile pixels substituted',(r)=>{r.screenshots[0].sha256='0'.repeat(64);}],
 ['DOM mutation',(r)=>{r.capture.domWrites=1;}],
 ['CSS mutation',(r)=>{r.capture.cssWrites=1;}],
 ['composite image',(r)=>{r.capture.compositeImageCreated=true;}],
 ['foreign content',(r)=>{r.capture.foreignContentHits=1;}],
 ['tile obstruction',(r)=>{r.capture.tiles[0].obstructionsIntersectingClip=1;}],
 ['changed DOM',(r)=>{r.capture.tiles[0].domSha256='0'.repeat(64);}],
 ['independent HOLD',(_r,v)=>{v.decision='HOLD';}],
 ['unviewed original tile',(_r,v)=>{v.everyOriginalTileDirectlyViewed=false;}],
 ['extra independent key',(_r,v)=>{v.newApproval=true;}],
 ['wrong independent ordinal',(_r,v)=>{v.sourceOrdinal=3;}],
 ['wrong independent viewport',(_r,v)=>{v.viewport='mobile';}],
])test('E006 original tile boundary refuses '+label,()=>{
 const{r,v}=tileCase(1);mutate(r,v);assert.throws(()=>validateM2E006ProblemUiTileEvidence({},r,v,r.key),/M2_E006_PROBLEM/);
});

import { REVIEWED_SOURCE_BINDING_OPT_INS, reviewedSourceBindingItems, buildReviewedSourceBinding } from '../archive/tools/meta-foundation/reviewed-source-binding.mjs';
import { nativeReviewedM2E006ProblemRebind } from '../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
function bindingCase(){
 const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'e006-two-binding-test',scope:'PARTIAL_UIDS',
  sourceArchiveFile:M2_E006_PROBLEM_ITEMS[0].sourceArchiveFile,expectedSourceBlobSha1:'a'.repeat(40),expectedQuestionCount:23,
  approval:{type:'FINAL_QA',metadataReviewed:true},items:M2_E006_PROBLEM_ITEMS.map(item=>({questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,
   sourceReview:{m2E006ProblemContinuity:{schemaVersion:M2_E006_PROBLEM_SCHEMA}}}))};
 const fingerprintRepairs=request.items.map(item=>({questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,sourceReview:{
  schemaVersion:'archive-reviewed-source-reassessment-v1',questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,
  m2E006ProblemContinuity:{schemaVersion:M2_E006_PROBLEM_SCHEMA,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal}}}));
 return{request,requestId:request.requestId,requestSha256:digest(stable(request)),sourceArchiveFile:request.sourceArchiveFile,
  sourceBlobSha1:request.expectedSourceBlobSha1,sourceRawSha256:'b'.repeat(64),scope:request.scope,expectedQuestionCount:23,partialUidCount:2,fingerprintRepairs};
}
test('writer sidecar seals both separate E006 typed proofs and the exact request',()=>{
 const c=bindingCase(),out=buildReviewedSourceBinding(c);
 assert.equal(REVIEWED_SOURCE_BINDING_OPT_INS.filter(row=>row.requestKey==='m2E006ProblemContinuity'&&row.proofKey==='m2E006ProblemContinuity').length,1);
 assert.equal(reviewedSourceBindingItems(c.request).length,2);assert.equal(out.sourceReviewUidCount,2);assert.equal(out.partialUidCount,2);
 assert.deepEqual(out.requestSnapshot,JSON.parse(stable(c.request)));
 for(const row of out.records){const repair=c.fingerprintRepairs.find(r=>r.questionUid===row.questionUid);assert.equal(row.sourceReviewSha256,digest(stable(repair.sourceReview)));}
});
for(const label of ['missing E006 proof','substitute original THREE proof','duplicate selected proof','wrong original request hash'])test('issued sidecar refuses '+label,()=>{
 const c=bindingCase();if(label==='missing E006 proof')delete c.fingerprintRepairs[0].sourceReview.m2E006ProblemContinuity;
 else if(label==='substitute original THREE proof'){c.fingerprintRepairs[0].sourceReview.m2ProblemRendererContinuity=c.fingerprintRepairs[0].sourceReview.m2E006ProblemContinuity;delete c.fingerprintRepairs[0].sourceReview.m2E006ProblemContinuity;}
 else if(label==='duplicate selected proof')c.fingerprintRepairs.push(structuredClone(c.fingerprintRepairs[0]));else c.requestSha256='0'.repeat(64);
 assert.throws(()=>buildReviewedSourceBinding(c),/reviewed source binding/);
});
function reuseCase(){const item=M2_E006_PROBLEM_ITEMS[0],proof={schemaVersion:M2_E006_PROBLEM_SCHEMA,questionUid:item.questionUid,
 sourceOrdinal:item.sourceOrdinal,sourceArchiveFile:item.sourceArchiveFile,memoryOnlyNormalization:true,newMathematicalQa:false,
 newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0,sourceWrites:0,rendererWrites:0};
 const receipt={approval:{},sourceArchiveFile:item.sourceArchiveFile,fingerprintRepairs:[{questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,sourceReview:{m2E006ProblemContinuity:proof}}]};
 return{receipt,proof,item};}
test('an unissued exact-subject proof cannot authorize receipt-backed native reuse',()=>{
 const{receipt,item}=reuseCase();assert.equal(nativeReviewedM2E006ProblemRebind(receipt,{}, {},{}, {questionUid:item.questionUid},item.sourceOrdinal,{},{}),false);
});
for(const [field,value] of [['schemaVersion','archive-m2-problem-renderer-continuity-v1'],['memoryOnlyNormalization',false],
 ['newMathematicalQa',true],['newMetadataApprovals',1],['newDifficultyJudgments',1],['newReview2Claims',1],['sourceWrites',1],['rendererWrites',1]])
 test('E006 native reuse refuses overbroad proof: '+field,()=>{
  const{receipt,proof,item}=reuseCase();proof[field]=value;assert.equal(nativeReviewedM2E006ProblemRebind(receipt,{}, {},{}, {questionUid:item.questionUid},item.sourceOrdinal,{},{}),false);
 });
test('E006 reuse remains unavailable for another UID or an explicit source rebind',()=>{
 const{receipt,item}=reuseCase();assert.equal(nativeReviewedM2E006ProblemRebind(receipt,{}, {},{}, {questionUid:'qid_v1_'+'0'.repeat(64)},item.sourceOrdinal,{},{}),false);
 receipt.approval.sourceRebind={};assert.equal(nativeReviewedM2E006ProblemRebind(receipt,{}, {},{}, {questionUid:item.questionUid},item.sourceOrdinal,{},{}),false);
});
