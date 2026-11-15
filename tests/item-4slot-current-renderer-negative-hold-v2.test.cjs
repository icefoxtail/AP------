'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'), os=require('node:os'), path=require('node:path');
const {execFileSync}=require('node:child_process');
const mod=require('../tools/4slot/build-4slot-runtime.cjs');
const v2=require('../tools/4slot/current-renderer-negative-hold-v2.cjs');
const {compactItem}=require('../tools/4slot/import-4slot.cjs');
const {buildLookup}=require('../tools/4slot/validate-4slot.cjs');
const consumer=require('../archive/item-4slot.js');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const source='original/middle/m3/2final/current-negative-v2-fixture.js';
const sp='archive/exams/'+source, cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
const proofDir='docs/operations/current-negative-v2-fixture/';
const dictPath='docs/architecture/4slot/term-dictionary-v1.6.json';

function fixture(t,{amended=true}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'current-negative-v2-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v));};
  const bytes=p=>fs.readFileSync(path.join(root,p));
  const git=(...a)=>execFileSync('git',['-C',root,...a],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
  const commit=msg=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm',msg);return git('rev-parse','HEAD').trim();};
  const ref=(c,p,full=false)=>({commit:c,path:p,...(full?{gitBlobSha1:mod.blob(bytes(p))}:{}),sha256:mod.sha(bytes(p))});
  const ar=(c,p)=>({...ref(c,p,true),visuallyInspected:true});
  const js=qs=>'window.questionBank='+JSON.stringify(qs)+';';
  const asset=name=>'archive/assets/images/current-negative-v2/'+name;
  const paths={pOld:asset('held-problem-old.svg'),pNow:asset('held-problem-current.svg'),sOld:asset('held-solution-old.svg'),sNow:asset('held-solution-current.svg'),rOld:asset('retained-old.svg'),rNow:asset('retained-current.svg'),binary:asset('unchanged.png')};
  const svg=n=>'<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1L'+n+' 3"/></svg>';
  // Display numbers deliberately differ from source ordinals.
  const originalBank=[
    {id:10,question:'Synthetic question <img src="'+paths.pOld.slice(8)+'">',answer:'fixture',solution:'Synthetic solution one'},
    {id:20,content:'Synthetic question two',answer:'fixture',solution:'Synthetic solution two',solutionImage:paths.sOld.slice(8)},
    {id:30,content:'Synthetic question three',answer:'fixture',solution:'Synthetic solution three',image:paths.rOld.slice(8)},
    {id:40,content:'Synthetic question four',answer:'fixture',solution:'Original synthetic method'},
    {id:50,content:'Synthetic question five',answer:'fixture',solution:'Synthetic unchanged solution',image:paths.binary.slice(8)}
  ];
  const dict={dictionaryVersion:'term-dict-v1.6-2026-11-15',terms:[{id:1,ko:'fixture given'},{id:2,ko:'fixture goal'},{id:3,ko:'fixture method'},{id:4,ko:'fixture amended method'}]};
  const nativePath=proofDir+'original-four-slot.json';
  const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(originalBank)),dictionaryVersion:dict.dictionaryVersion,judgedBy:{agent:'original-reviewer'},items:originalBank.map((q,i)=>({questionUid:uid(i+1),sourceOrdinal:i+1,format:'단일 정답',slots:{given:[{term:'fixture given'}],goal:[{term:'fixture goal'}],method:[{term:'fixture method'}],condition:[]}})),candidates:[],selfCheck:{}};
  if(amended) native.items[3].slots.method.push({term:'fixture candidate method'});
  const identity={records:originalBank.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q),status:'VERIFIED'}))};
  save(sp,js(originalBank));save(dictPath,dict);save('archive/data/question_identity_map.json',identity);save(nativePath,native);
  save(paths.pOld,svg(2));save(paths.sOld,svg(3));save(paths.rOld,svg(4));save(paths.binary,Buffer.from([137,80,78,71,13,10,26,10,255,0,128,129]));
  git('init','-q');const originalCommit=commit('original reviewed vector and source'), originalRef=ref(originalCommit,nativePath);
  const before=structuredClone(originalBank);
  if(amended) before[3].solution='Previously approved synthetic amendment quote';
  save(sp,js(before));const baselineCommit=commit('existing approved source correction');
  const topPath=amended?'archive-work/current-negative-v2-fixture/exams/E-fixture.4slot.json':nativePath;
  const top=structuredClone(native);
  const continuityPath='archive-work/current-negative-v2-fixture/current-source-continuity.json';
  const amendmentPath=proofDir+'method-amendment-independent-review.json';
  let continuity=null, amendment=null, topRef=originalRef;
  if(amended) {
    top.sourceGitBlobSha=mod.blob(js(before));
    top.items[3].slots.method=[{term:'fixture amended method',src:'solution',quote:'synthetic amendment quote',evidenceType:'IMPLIED',justification:'Synthetic fixture approval witness.'}];
    top.sourceRebinding={reviewCommit:originalRef.commit,nativePath:originalRef.path,nativeSha256:originalRef.sha256,sourceCommit:baselineCommit,sourceBlobSha1:mod.blob(js(before)),reboundBy:'prior-transport',scope:'REUSE_COMPLETED_REVIEW_AND_SCOPED_CURRENT_SOURCE_CONTINUITY',fullExamReReview:false,semanticApprovalGranted:false};
    save(topPath,top);
    const entry={examId:'E-fixture',sourceOrdinal:4,questionUid:uid(4),before:['fixture method','fixture candidate method'],after:['fixture amended method'],afterSolutionSha256:mod.sha(before[3].solution)};
    continuity={schemaVersion:'archive-m3s2-4slot-current-source-continuity-v1',sourceCommit:baselineCommit,originalReviewCommit:originalCommit,sourceMutation:0,semanticApprovalMutation:0,difficultyApprovalMutation:0,methodAmendmentCount:1,methodAmendments:[entry],exams:[{examId:'E-fixture',sourceArchiveFile:source,sourcePath:sp,sourceGitBlobSha:mod.blob(js(before)),itemCount:5,reviewPath:topPath,reviewSha256:mod.sha(bytes(topPath)),nativeReviewPath:originalRef.path,nativeReviewSha256:originalRef.sha256}]};
    amendment={schemaVersion:'independent-scoped-method-review-v1',reviewer:'prior-independent-method-reviewer',sourceCommit:baselineCommit,amendmentSha256:mod.sha('opaque legacy aggregate identifier, never authority by itself'),scope:'12 changed method mappings only; existing mathematical solution approvals reused; no new full semantic approval',reason:'Synthetic pre-existing independent method review.',rows:[{key:'E-fixture#4',questionUid:uid(4),sourcePath:sp,sourceSha256:mod.sha(js(before)),solutionSha256:mod.sha(before[3].solution),terms:['fixture amended method'],exactQuotesVerified:true,decision:'ACCEPTED_CURRENT_METHOD_ONLY'}]};
    save(continuityPath,continuity);save(amendmentPath,amendment);const topCommit=commit('previously approved method amendment');topRef=ref(topCommit,topPath);
  }
  const lut=buildLookup(dict), lookup=new Map(before.map((q,i)=>[String(i+1),{ordinal:q.id}]));
  const items=top.items.map(i=>compactItem(i,lut,lookup));
  const evidence={branch:'review/prior',...topRef,originalReview:originalRef,sourceContinuity:amended?{...ref(topRef.commit,continuityPath),scope:'EXACT_STUDENT_PAYLOAD_OR_SCOPED_REUSED_REVIEW',fullExamReReview:false}:null};
  if(amended) evidence.methodAmendmentIndependentReview={path:amendmentPath,sha256:mod.sha(bytes(amendmentPath)),scope:'12_CURRENT_METHOD_MAPPINGS_ONLY',decision:'ACCEPTED_CURRENT_METHOD_ONLY'};
  const prior={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(before)),dictionaryVersion:dict.dictionaryVersion,evidence,reviewedBy:{agent:'original-reviewer',at:'2026-11-15',sampled:[10]},items};
  save(cp,prior);const priorCommit=commit('pre-existing full compact');
  const priorCompactRef=ref(priorCommit,cp,true), priorSourceRef=ref(priorCommit,sp,true);
  const bank=structuredClone(before);bank[0].question=bank[0].question.replace(paths.pOld.slice(8),paths.pNow.slice(8));bank[1].solutionImage=paths.sNow.slice(8);bank[2].image=paths.rNow.slice(8);
  save(sp,js(bank));save(paths.pNow,svg(6));save(paths.sNow,svg(7));save(paths.rNow,svg(8));const currentCommit=commit('current presentation source and bytes');
  const sourceRef=ref(currentCommit,sp,true), author='current-vector-observer';
  const reviewPath=proofDir+'continuity.json', negativePath=proofDir+'negative-independent-review.json', proofPath=proofDir+'hold-carrier.json';
  const review={schemaVersion:v2.CONTINUITY_SCHEMA,scope:'KEEP_EXACT_EXISTING_FOUR_SLOT_VECTOR_ON_CURRENT_SOURCE',reviewer:author,reviewedAtUtc:'2026-11-15T12:00:00Z',newFourSlotValues:0,newSemanticApprovals:0,newDifficultyApprovals:0,newMathQa:0,sourceWrites:0,assetWrites:0,actualBrowser:'NOT_RUN',dictionaryRef:{...ref(currentCommit,dictPath,true),version:dict.dictionaryVersion},exams:[{examId:'E-fixture',priorCompactRef,priorSourceRef,sourceRef,sourceQuestionCount:5,originalFourSlotRef:originalRef,sourceContinuityRef:evidence.sourceContinuity,rows:[{questionUid:uid(3),sourceOrdinal:3,sourceQuestionNo:'30',ordinal:30,decision:'RETAIN_EXISTING_FOUR_SLOTS',compactItemSha256:mod.sha(stable(items[2])),priorWholeQuestionSha256:mod.sha(stable(before[2])),currentWholeQuestionSha256:mod.sha(stable(bank[2])),changedFields:['image'],changedStudentFields:['image'],stemRead:true,solutionRead:true,allFourSlotsRead:true,actualVisualInspection:true,priorAssets:[ar(priorCommit,paths.rOld)],currentAssets:[ar(currentCommit,paths.rNow)],captureSha256:mod.sha('synthetic fixture capture'),renderers:['synthetic fixture, no browser'],observed:'Synthetic fixture continuity observation.'}],withheldOrdinals:[10,20]}]};
  const negative={schemaVersion:v2.REVIEW_SCHEMA,scope:'EXISTING_FOUR_SLOT_VECTOR_CURRENT_RENDERER_NEGATIVE_ONLY',decision:'WITHHOLD_CURRENT_RENDERER',reviewer:'second-current-observer',transportAuthor:author,reviewedAtUtc:'2026-11-15T12:01:00Z',heldUidCount:2,newSemanticApprovals:0,newDifficultyApprovals:0,newMathQa:0,newSlotValues:0,sourceWrites:0,assetWrites:0,rows:[0,1].map(i=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(bank[i].id),ordinal:bank[i].id,sourceRef,priorCompactRef,compactItemSha256:mod.sha(stable(items[i])),studentPayloadSha256:mod.payloadHash(bank[i]),sourceFingerprint:mod.identityHash(bank[i]),wholeQuestionSha256:mod.sha(stable(bank[i])),incorrectRenderer:{role:i?'solutionImage':'questionImage',...ar(currentCommit,i?paths.sNow:paths.pNow)},currentAssets:[ar(currentCommit,i?paths.sNow:paths.pNow)],inspection:{stemRead:true,solutionRead:true,existingFourSlotsRead:true,actualRendererRead:true,browser:'NOT_RUN'},classification:i?'CURRENT_RENDERER_AMBIGUITY':'CURRENT_RENDERER_RELATION_MISMATCH',decision:'WITHHOLD_CURRENT_RENDERER',observed:'Synthetic independent negative observation.'}))};
  save(reviewPath,review);save(negativePath,negative);const reviewCommit=commit('independent current vector and negative observations');
  const heldItems=negative.rows.map(r=>Object.fromEntries(['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'].map(k=>[k,r[k]])));
  const proof={schemaVersion:v2.PROOF_SCHEMA,scope:'CURRENT_FULL_COMPACT_RENDERER_HOLDS',reason:v2.REASON,decision:'WITHHOLD_REGISTRATION',author,sourceArchiveFile:source,expectedQuestionCount:5,heldUidCount:2,heldItems,priorCompactRef,priorSourceRef,sourceRef,nativeFourSlotRef:topRef,originalFourSlotRef:originalRef,methodAmendmentIndependentReviewRef:amended?ref(priorCommit,amendmentPath):null,vectorContinuityRef:ref(reviewCommit,reviewPath),independentNegativeReviewRef:ref(reviewCommit,negativePath),retainedOrdinals:[30],unchangedOrdinals:[40,50],newSemanticApprovals:0,newDifficultyApprovals:0,newMathQa:0,slotChanges:0,sourceWrites:0,assetWrites:0,nextAction:'Resolve each exact current renderer discrepancy through a separate approved transition.'};
  const data=structuredClone(prior);
  function signCarrier() {
    save(proofPath,proof);const c=commit('bind exact current multi-hold partition'), carrier=ref(c,proofPath);
    data.sourceGitBlobSha=proof.sourceRef.gitBlobSha1;
    data.evidence.nativeHoldReview={currentRendererNegative:carrier,vectorContinuity:proof.vectorContinuityRef,independentNegative:proof.independentNegativeReviewRef};
    for(let i=0;i<2;i++) data.items[i].registrationHold={schemaVersion:v2.HOLD_SCHEMA,reason:v2.REASON,...heldItems[i],sourceGitBlobSha:proof.sourceRef.gitBlobSha1,studentPayloadSha256:negative.rows[i].studentPayloadSha256,sourceFingerprint:negative.rows[i].sourceFingerprint,wholeQuestionSha256:negative.rows[i].wholeQuestionSha256,currentRendererNegativeEvidence:carrier,vectorContinuityEvidence:proof.vectorContinuityRef,independentNegativeEvidence:proof.independentNegativeReviewRef,nextAction:proof.nextAction};
    save(cp,data);
  }
  function signReview(which) {
    const target=which==='negative'?negativePath:reviewPath;
    save(target,which==='negative'?negative:review);const c=commit('changed immutable observation fixture');
    proof[which==='negative'?'independentNegativeReviewRef':'vectorContinuityRef']=ref(c,target);signCarrier();
  }
  function rebindCurrent() {
    save(sp,js(bank));const c=commit('truthfully sealed new current source'), sr=ref(c,sp,true);
    proof.sourceRef=sr;review.exams[0].sourceRef=sr;
    for(const r of review.exams[0].rows) for(const a of r.currentAssets) a.commit=c;
    for(const r of negative.rows){r.sourceRef=sr;r.incorrectRenderer.commit=c;for(const a of r.currentAssets)a.commit=c;}
    save(reviewPath,review);save(negativePath,negative);const rc=commit('truthful source hashes without extra review');
    proof.vectorContinuityRef=ref(rc,reviewPath);proof.independentNegativeReviewRef=ref(rc,negativePath);signCarrier();
  }
  function resealPriorAuthority() {
    save(topPath,top);continuity.exams[0].reviewSha256=mod.sha(bytes(topPath));
    save(continuityPath,continuity);save(amendmentPath,amendment);
    const ac=commit('truthfully sealed changed historical authority fixture');
    Object.assign(prior.evidence,ref(ac,topPath));
    prior.evidence.sourceContinuity={...prior.evidence.sourceContinuity,...ref(ac,continuityPath)};
    prior.evidence.methodAmendmentIndependentReview.sha256=mod.sha(bytes(amendmentPath));
    save(cp,prior);const pc=commit('truthfully sealed changed prior compact fixture'), pr=ref(pc,cp,true);
    proof.priorCompactRef=pr;proof.nativeFourSlotRef=ref(ac,topPath);proof.methodAmendmentIndependentReviewRef=ref(pc,amendmentPath);
    review.exams[0].priorCompactRef=pr;review.exams[0].sourceContinuityRef=prior.evidence.sourceContinuity;
    for(const r of negative.rows){r.priorCompactRef=pr;r.compactItemSha256=mod.sha(stable(prior.items.find(i=>i.ordinal===r.ordinal)));}
    for(const k of Object.keys(data))delete data[k];Object.assign(data,structuredClone(prior));
    save(reviewPath,review);save(negativePath,negative);const rc=commit('truthful new refs without new method approval');
    proof.vectorContinuityRef=ref(rc,reviewPath);proof.independentNegativeReviewRef=ref(rc,negativePath);signCarrier();
  }
  signCarrier();
  return {root,save,bytes,git,commit,ref,bank,before,js,paths,data,prior,proof,review,negative,identity,native,top,continuity,amendment,nativePath,topPath,continuityPath,amendmentPath,proofPath,reviewPath,negativePath,priorCommit,signCarrier,signReview,rebindCurrent,resealPriorAuthority,write:()=>save(cp,data)};
}

function denied(f,reason) {
  const out=mod.build(f.root).index;
  assert.equal(out.records.length,0,JSON.stringify(out.pending));
  assert.ok(out.pending.some(p=>p.reason.includes(reason || 'CURRENT_RENDERER_HOLD_')),JSON.stringify(out.pending));
  for(const n of [1,2]) assert.equal(consumer.createIndex(out).get(uid(n)),null);
  return out;
}
test('v2 preserves an already amended full vector and holds both renderer roles without confusing display numbers',t=>{
  const f=fixture(t), raw=f.bytes(sp), out=mod.build(f.root).index;
  assert.deepEqual(out.records.map(r=>r.questionUid),[uid(3),uid(4),uid(5)]);
  assert.deepEqual(out.pending.map(r=>r.questionUid),[uid(1),uid(2)]);
  assert.ok(out.pending.every(r=>r.reason==='EXPLICIT_REVIEW_HOLD:'+v2.REASON));
  assert.equal(out.counts.items,5);assert.equal(mod.verify(out).verified,3);
  assert.deepEqual(f.data.items.map(({registrationHold,...r})=>r),f.prior.items);
  assert.deepEqual(f.data.items[3].method,[4]);assert.deepEqual(f.data.items[3].candidates,[]);
  assert.deepEqual(f.data.reviewedBy,f.prior.reviewedBy);assert.deepEqual(f.bytes(sp),raw);
  const ix=consumer.createIndex(out);assert.equal(ix.get(uid(1)),null);assert.equal(ix.get(uid(2)),null);assert.ok(ix.get(uid(4)));
  assert.equal(mod.run(f.root,{write:true}).counts.registered,3);assert.equal(mod.run(f.root,{check:true}).changed,false);
});
test('v2 accepts an unamended original authority without inventing an amendment',t=>{
  const f=fixture(t,{amended:false}),out=mod.build(f.root).index;
  assert.equal(out.records.length,3,JSON.stringify(out.pending));assert.equal(out.pending.length,2);
});
for(const fault of ['held-count','duplicate-held-uid','wrong-source-ordinal','missing-held-tuple','denominator','retained-overlap','unchanged-overlap','missing-native','missing-original','missing-amendment','unknown-field','new-approval']) test('v2 rejects immutable carrier fault: '+fault,t=>{
  const f=fixture(t);
  if(fault==='held-count') f.proof.heldUidCount=1;
  if(fault==='duplicate-held-uid') f.proof.heldItems[1].questionUid=uid(1);
  if(fault==='wrong-source-ordinal') f.proof.heldItems[0].sourceOrdinal=10;
  if(fault==='missing-held-tuple') f.proof.heldItems.pop();
  if(fault==='denominator') f.proof.expectedQuestionCount=4;
  if(fault==='retained-overlap') f.proof.retainedOrdinals=[10,30];
  if(fault==='unchanged-overlap') f.proof.unchangedOrdinals=[20,40,50];
  if(fault==='missing-native') f.proof.nativeFourSlotRef.sha256='0'.repeat(64);
  if(fault==='missing-original') f.proof.originalFourSlotRef.sha256='0'.repeat(64);
  if(fault==='missing-amendment') f.proof.methodAmendmentIndependentReviewRef=null;
  if(fault==='unknown-field') f.proof.allowPartial=true;
  if(fault==='new-approval') f.proof.newSemanticApprovals=1;
  f.signCarrier();denied(f);
});
for(const fault of ['problem-as-solution','solution-as-problem','foreign-problem-asset','negative-not-inspected','negative-current-asset-omitted','negative-payload','negative-reviewer-collision','positive-not-inspected','positive-field-omitted']) test('v2 rejects falsely bound current observation: '+fault,t=>{
  const f=fixture(t);let which='negative';
  if(fault==='problem-as-solution') f.negative.rows[0].incorrectRenderer.role='solutionImage';
  if(fault==='solution-as-problem') f.negative.rows[1].incorrectRenderer.role='questionImage';
  if(fault==='foreign-problem-asset') f.negative.rows[0].incorrectRenderer={...f.negative.rows[1].incorrectRenderer,role:'questionImage'};
  if(fault==='negative-not-inspected') f.negative.rows[1].inspection.actualRendererRead=false;
  if(fault==='negative-current-asset-omitted') f.negative.rows[0].currentAssets=[];
  if(fault==='negative-payload') f.negative.rows[0].wholeQuestionSha256='0'.repeat(64);
  if(fault==='negative-reviewer-collision') f.negative.reviewer=f.proof.author;
  if(fault.startsWith('positive-')) which='positive';
  if(fault==='positive-not-inspected') f.review.exams[0].rows[0].allFourSlotsRead=false;
  if(fault==='positive-field-omitted') f.review.exams[0].rows[0].changedStudentFields=[];
  f.signReview(which);denied(f);
});
for(const fault of ['original-method-reverted','candidate-added','reviewer-changed','held-asset','retained-asset','unchanged-binary-asset','identity-join','downgrade-v1']) test('v2 rejects live drift before any peer registers: '+fault,t=>{
  const f=fixture(t);
  if(fault==='original-method-reverted') f.data.items[3].method=[3];
  if(fault==='candidate-added') f.data.items[3].candidates=['fixture candidate method'];
  if(fault==='reviewer-changed') f.data.reviewedBy.agent='changed';
  if(fault==='held-asset') f.save(f.paths.pNow,'<svg>changed</svg>');
  if(fault==='retained-asset') f.save(f.paths.rNow,'<svg>changed</svg>');
  if(fault==='unchanged-binary-asset') f.save(f.paths.binary,Buffer.from([137,80,78,71,13,10,26,10,254,0,128,129]));
  if(fault==='identity-join'){f.identity.records[4].questionUid=uid(1);f.save('archive/data/question_identity_map.json',f.identity);}
  if(fault==='downgrade-v1') for(const i of f.data.items.slice(0,2)) i.registrationHold.schemaVersion='4slot-current-renderer-negative-hold-v1';
  f.write();denied(f);
});
test('v2 rejects a truthfully rebound source with an unreviewed whole-object peer change',t=>{
  const f=fixture(t);f.bank[4].solutionImageCaption='New unreviewed presentation metadata';f.rebindCurrent();
  denied(f,'CURRENT_RENDERER_HOLD_V2_UNREVIEWED_QUESTION_CHANGE');
});
for(const form of ['plain-text','comment','data-src']) test('a truthfully sealed '+form+' path is not a question renderer',t=>{
  const f=fixture(t),p=f.paths.pNow.slice(8);
  f.bank[0].question=form==='plain-text'?'Synthetic path '+p:form==='comment'?'<!-- <img src="'+p+'"> -->':'<img data-src="'+p+'">';
  f.negative.rows[0].studentPayloadSha256=mod.payloadHash(f.bank[0]);
  f.negative.rows[0].sourceFingerprint=mod.identityHash(f.bank[0]);
  f.negative.rows[0].wholeQuestionSha256=mod.sha(stable(f.bank[0]));
  f.rebindCurrent();denied(f,'CURRENT_RENDERER_HOLD_V2_INCORRECT_RENDERER');
});
for(const fault of ['method-term','protected-given','solution-hash','source-commit','quote','missing-selected-row','independent-reviewer']) test('truthfully resealed native and compact refs cannot replace direct method approval: '+fault,t=>{
  const f=fixture(t);
  if(fault==='method-term'){
    f.top.items[3].slots.method[0].term='fixture goal';f.prior.items[3].method=[2];
    f.continuity.methodAmendments[0].after=['fixture goal'];
  }
  if(fault==='protected-given'){f.top.items[3].slots.given=[{term:'fixture goal'}];f.prior.items[3].given=[2];}
  if(fault==='solution-hash')f.amendment.rows[0].solutionSha256='0'.repeat(64);
  if(fault==='source-commit'){
    f.amendment.sourceCommit=f.proof.sourceRef.commit;f.continuity.sourceCommit=f.proof.sourceRef.commit;
    f.top.sourceRebinding.sourceCommit=f.proof.sourceRef.commit;
  }
  if(fault==='quote')f.top.items[3].slots.method[0].quote='not present in the approved solution';
  if(fault==='missing-selected-row')f.amendment.rows=[];
  if(fault==='independent-reviewer')f.amendment.reviewer='original-reviewer';
  f.resealPriorAuthority();denied(f);
});
for(const fault of ['remove-one-hold','all-markers','all-markers-and-proof','committed-delete','committed-blank','git-unavailable']) test('v2 keeps every immutable negative obligation after marker stripping: '+fault,t=>{
  const f=fixture(t);
  delete f.data.items[0].registrationHold;
  if(fault!=='remove-one-hold'){delete f.data.items[1].registrationHold;delete f.data.evidence.nativeHoldReview;}
  if(['all-markers-and-proof','committed-delete'].includes(fault)) fs.unlinkSync(path.join(f.root,f.negativePath));
  if(fault==='committed-blank') f.save(f.negativePath,{});
  f.write();
  if(fault.startsWith('committed-')) f.commit('later tree cannot erase published negative UIDs');
  if(fault==='git-unavailable') fs.renameSync(path.join(f.root,'.git'),path.join(f.root,'git-unavailable'));
  denied(f);
});
test('v2 negative obligations survive a merge that deletes the second-parent witness',t=>{
  const f=fixture(t),side=f.commit('freeze the side branch negative intake');
  f.git('checkout','--detach',f.proof.sourceRef.commit);
  f.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','merge','--no-ff','--no-commit',side);
  delete f.data.evidence.nativeHoldReview;for(const i of f.data.items)delete i.registrationHold;
  f.write();fs.unlinkSync(path.join(f.root,f.negativePath));f.commit('merge cannot erase the side-parent negative obligations');
  denied(f,'CURRENT_RENDERER_HOLD_NEGATIVE_OBLIGATION_REQUIRED');
});
test('a negative witness on an unmerged branch does not create an unrelated HEAD obligation',t=>{
  const f=fixture(t),side=f.commit('freeze a future negative intake');f.git('branch','future-negative',side);
  f.git('checkout','--detach',f.priorCommit);
  const out=mod.build(f.root).index;
  assert.equal(out.records.length,5,JSON.stringify(out.pending));assert.equal(out.pending.length,0);
});
test('v2 does not accept a row hold without successful full-file validation',t=>{
  const f=fixture(t);
  assert.deepEqual(mod.validateRegistrationHold(f.root,f.data,f.data.items[0],f.identity.records[0],{q:f.bank[0],ordinal:1}),['CURRENT_RENDERER_HOLD_FILE_NOT_VALIDATED']);
});
test('v2 proof bytes are freshly checked even when a previous runtime index exists',t=>{
  const f=fixture(t);mod.run(f.root,{write:true});fs.unlinkSync(path.join(f.root,f.reviewPath));denied(f);
});
