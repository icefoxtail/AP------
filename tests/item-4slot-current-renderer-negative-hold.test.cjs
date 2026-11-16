'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const mod=require('../tools/4slot/build-4slot-runtime.cjs');
const hold=require('../tools/4slot/current-renderer-negative-hold.cjs');
const consumer=require('../archive/item-4slot.js');
const {createCurrentNegativeContext}=require('./helpers/4slot-current-negative-context.cjs');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const source='original/middle/m3/2final/current-negative-fixture.js',sp='archive/exams/'+source,cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
const dictPath='docs/architecture/4slot/term-dictionary-v1.5.json';
const proofDir='docs/operations/current-negative-fixture/';
function fixture(t) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'current-negative-hold-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v));};
 const bytes=p=>fs.readFileSync(path.join(root,p));
 const git=(...a)=>execFileSync('git',['-C',root,...a],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
 const commit=msg=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm',msg);return git('rev-parse','HEAD').trim();};
 const ref=(commit,p,full=false)=>({commit,path:p,...(full?{gitBlobSha1:mod.blob(bytes(p))}:{}),sha256:mod.sha(bytes(p))});
 const heldOld='archive/assets/images/current-negative/held-old.svg',heldNow='archive/assets/images/current-negative/held-current.svg',retOld='archive/assets/images/current-negative/retained-old.svg',retNow='archive/assets/images/current-negative/retained-current.svg',unchangedAsset='archive/assets/images/current-negative/unchanged.png';
 const before=[{id:1,content:'Fixture question one',answer:'fixture',solution:'Fixture unchanged solution',solutionImage:heldOld.slice(8)},{id:2,content:'Fixture question two',answer:'fixture',solution:'Fixture unchanged solution',image:retOld.slice(8)},{id:3,content:'Fixture question three',answer:'fixture',solution:'Fixture unchanged solution',image:unchangedAsset.slice(8)}];
 const js=bank=>'window.questionBank='+JSON.stringify(bank)+';';
 const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'fixture given'},{id:2,ko:'fixture goal'},{id:3,ko:'fixture method'}]};
 const items=before.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}));
 const nativePath=proofDir+'original-four-slot.json';
 const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(before)),dictionaryVersion:dict.dictionaryVersion,judgedBy:{agent:'original-reviewer'},items:before.map((q,i)=>({questionUid:uid(i+1),sourceOrdinal:i+1,format:items[i].format,slots:{given:[{term:'fixture given'}],goal:[{term:'fixture goal'}],method:[{term:'fixture method'}],condition:[]}})),candidates:[],selfCheck:{}};
 const identity={records:before.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q),status:'VERIFIED'}))};
 save(sp,js(before));save(dictPath,dict);save('archive/data/question_identity_map.json',identity);save(nativePath,native);save(heldOld,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1L2 2"/></svg>');save(retOld,'<svg xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1"/></svg>');
 // Non-UTF8 bytes make a text-mode Git read of unchanged assets fail this positive case.
 save(unchangedAsset,Buffer.from([137,80,78,71,13,10,26,10,255,0,128,129]));
 git('init','-q');const nativeCommit=commit('original source and full reviewed vector');
 const nativeRef=ref(nativeCommit,nativePath);
 const prior={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(before)),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'review/original',...nativeRef,sourceContinuity:null},reviewedBy:{agent:'original-reviewer',at:'2026-11-15',sampled:[1]},items};
 save(cp,prior);const priorCommit=commit('existing full compact');const priorCompactRef=ref(priorCommit,cp,true),priorSourceRef=ref(priorCommit,sp,true);
 const bank=structuredClone(before);bank[0].solutionImage=heldNow.slice(8);bank[1].image=retNow.slice(8);
 save(sp,js(bank));save(heldNow,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1L3 2"/></svg>');save(retNow,'<svg xmlns="http://www.w3.org/2000/svg"><circle cx="3" cy="3" r="1"/></svg>');const currentCommit=commit('current presentation bytes');
 const sourceRef=ref(currentCommit,sp,true),author='independent-current-vector-reviewer';
 const assetRef=(c,p)=>({...ref(c,p,true),visuallyInspected:true});
 const proofPath=proofDir+'hold-carrier.json',reviewPath=proofDir+'continuity.json',negativePath=proofDir+'negative-independent-review.json';
 const review={schemaVersion:hold.CONTINUITY_SCHEMA,scope:'KEEP_EXACT_EXISTING_FOUR_SLOT_VECTOR_ON_CURRENT_SOURCE',reviewer:author,reviewedAtUtc:'2026-11-15T12:00:00Z',newFourSlotValues:0,newSemanticApprovals:0,newDifficultyApprovals:0,newMathQa:0,sourceWrites:0,assetWrites:0,actualBrowser:'NOT_RUN',dictionaryRef:{...ref(currentCommit,dictPath,true),version:dict.dictionaryVersion},exams:[{examId:'E-fixture',priorCompactRef,priorSourceRef,sourceRef,sourceQuestionCount:3,originalFourSlotRef:nativeRef,sourceContinuityRef:null,rows:[{questionUid:uid(2),sourceOrdinal:2,sourceQuestionNo:'2',ordinal:2,decision:'RETAIN_EXISTING_FOUR_SLOTS',compactItemSha256:mod.sha(stable(items[1])),priorWholeQuestionSha256:mod.sha(stable(before[1])),currentWholeQuestionSha256:mod.sha(stable(bank[1])),changedFields:['image'],changedStudentFields:['image'],stemRead:true,solutionRead:true,allFourSlotsRead:true,actualVisualInspection:true,priorAssets:[assetRef(priorCommit,retOld)],currentAssets:[assetRef(currentCommit,retNow)],captureSha256:mod.sha('synthetic fixture capture'),renderers:['synthetic fixture'],observed:'Fixture-only unchanged vector with reviewed current presentation.'}],withheldOrdinals:[1]}]};
 const negative={schemaVersion:hold.REVIEW_SCHEMA,scope:'EXISTING_FOUR_SLOT_VECTOR_CURRENT_RENDERER_NEGATIVE_ONLY',decision:'WITHHOLD_CURRENT_RENDERER',reviewer:'second-independent-reviewer',transportAuthor:author,reviewedAtUtc:'2026-11-15T12:01:00Z',heldUidCount:1,newSemanticApprovals:0,newDifficultyApprovals:0,newMathQa:0,newSlotValues:0,sourceWrites:0,assetWrites:0,rows:[{questionUid:uid(1),sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,sourceRef,priorCompactRef,compactItemSha256:mod.sha(stable(items[0])),studentPayloadSha256:mod.payloadHash(bank[0]),sourceFingerprint:mod.identityHash(bank[0]),wholeQuestionSha256:mod.sha(stable(bank[0])),incorrectRenderer:{role:'solutionImage',...assetRef(currentCommit,heldNow)},currentAssets:[assetRef(currentCommit,heldNow)],inspection:{stemRead:true,solutionRead:true,existingFourSlotsRead:true,actualRendererRead:true,browser:'NOT_RUN'},classification:'CURRENT_RENDERER_AMBIGUITY',decision:'WITHHOLD_CURRENT_RENDERER',observed:'Fixture-only ambiguity; the existing slot row is withheld.'}]};
 save(reviewPath,review);save(negativePath,negative);const reviewCommit=commit('independent positive and negative fixture evidence');
 const proof={schemaVersion:hold.PROOF_SCHEMA,scope:'CURRENT_FULL_COMPACT_ONE_RENDERER_HOLD',reason:hold.REASON,decision:'WITHHOLD_REGISTRATION',author,sourceArchiveFile:source,expectedQuestionCount:3,heldUidCount:1,questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,priorCompactRef,priorSourceRef,sourceRef,nativeFourSlotRef:nativeRef,vectorContinuityRef:ref(reviewCommit,reviewPath),independentNegativeReviewRef:ref(reviewCommit,negativePath),retainedOrdinals:[2],unchangedOrdinals:[3],newSemanticApprovals:0,newDifficultyApprovals:0,newMathQa:0,slotChanges:0,sourceWrites:0,assetWrites:0,nextAction:'Resolve the exact current renderer discrepancy before any release of this UID.'};
 const data=structuredClone(prior);
 function signCarrier(){save(proofPath,proof);const proofCommit=commit('bind exact current negative scope');const carrierRef=ref(proofCommit,proofPath);data.sourceGitBlobSha=proof.sourceRef.gitBlobSha1;data.evidence.nativeHoldReview={currentRendererNegative:carrierRef,vectorContinuity:proof.vectorContinuityRef,independentNegative:proof.independentNegativeReviewRef};data.items[0].registrationHold={schemaVersion:hold.HOLD_SCHEMA,reason:hold.REASON,questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,sourceGitBlobSha:proof.sourceRef.gitBlobSha1,studentPayloadSha256:negative.rows[0].studentPayloadSha256,sourceFingerprint:negative.rows[0].sourceFingerprint,wholeQuestionSha256:negative.rows[0].wholeQuestionSha256,currentRendererNegativeEvidence:carrierRef,vectorContinuityEvidence:proof.vectorContinuityRef,independentNegativeEvidence:proof.independentNegativeReviewRef,nextAction:proof.nextAction};save(cp,data);}
 function signReview(which){const target=which==='negative'?negativePath:reviewPath;save(target,which==='negative'?negative:review);const c=commit('changed immutable fixture review');proof[which==='negative'?'independentNegativeReviewRef':'vectorContinuityRef']=ref(c,target);signCarrier();}
 signCarrier();return {root,save,bytes,git,commit,ref,priorCommit,bank,before,js,data,prior,proof,review,negative,proofPath,reviewPath,negativePath,identity,heldNow,retNow,unchangedAsset,signCarrier,signReview,write:()=>save(cp,data)};
}
function denied(f){const out=mod.build(f.root).index;assert.equal(out.records.length,0,JSON.stringify(out.counts));assert.ok(out.pending.some(p=>/CURRENT_RENDERER_HOLD_/.test(p.reason)),JSON.stringify(out.pending));assert.equal(consumer.createIndex(out).get(uid(1)),null);return out;}
function dataCheck(f,check=createCurrentNegativeContext(f.root,f.identity)){
 const raw=f.bytes(dictPath),dictionary=JSON.parse(raw);
 return check(f.data,{path:dictPath,sha256:mod.sha(raw),terms:new Map(dictionary.terms.map(t=>[t.id,t]))});
}
test('data check derives the v1 item context only after full current negative validation',t=>{
 const f=fixture(t),before=f.bytes(cp),item=f.data.items[0],current={q:f.bank[0],ordinal:1};
 assert.deepEqual(mod.validateRegistrationHold(f.root,f.data,item,f.identity.records[0],current),['CURRENT_RENDERER_HOLD_FILE_NOT_VALIDATED']);
 const checked=dataCheck(f);assert.deepEqual(checked.errors,[]);assert.equal(checked.context.currentRendererNegativeValidated,true);
 assert.deepEqual(mod.validateRegistrationHold(f.root,f.data,item,f.identity.records[0],current,checked.context),[]);
 assert.deepEqual(f.bytes(cp),before);assert.ok(f.data.items[0].registrationHold);
});
test('data check rereads v1 carrier bytes after an earlier successful file validation',t=>{
 const f=fixture(t),check=createCurrentNegativeContext(f.root,f.identity);assert.deepEqual(dataCheck(f,check).errors,[]);
 f.save(f.proofPath,{...f.proof,slotChanges:1});const checked=dataCheck(f,check);
 assert.ok(checked.errors.some(e=>e==='CURRENT_RENDERER_HOLD_LOCAL_BYTES'));assert.equal(checked.context.currentRendererNegativeValidated,false);
 assert.deepEqual(mod.validateRegistrationHold(f.root,f.data,f.data.items[0],f.identity.records[0],{q:f.bank[0],ordinal:1},checked.context),['CURRENT_RENDERER_HOLD_FILE_NOT_VALIDATED']);
});
test('data check cannot derive v1 eligibility by stripping every live hold marker',t=>{
 const f=fixture(t),check=createCurrentNegativeContext(f.root,f.identity);assert.deepEqual(dataCheck(f,check).errors,[]);
 delete f.data.evidence.nativeHoldReview;delete f.data.items[0].registrationHold;f.write();
 for(const verify of [check,createCurrentNegativeContext(f.root,f.identity)]){const checked=dataCheck(f,verify);assert.ok(checked.errors.includes('CURRENT_RENDERER_HOLD_NEGATIVE_OBLIGATION_REQUIRED'));assert.equal(checked.context.currentRendererNegativeValidated,false);}
});
test('current negative intake retains the original full vector while exactly one UID stays pending',t=>{
 const f=fixture(t),sourceBefore=f.bytes(sp),compactBefore=structuredClone(f.prior),out=mod.build(f.root).index;
 assert.deepEqual(out.records.map(r=>r.questionUid),[uid(2),uid(3)]);assert.equal(out.counts.items,3);assert.equal(out.pending.length,1);assert.equal(out.pending[0].reason,'EXPLICIT_REVIEW_HOLD:'+hold.REASON);assert.equal(out.pending[0].questionUid,uid(1));assert.equal(consumer.createIndex(out).get(uid(1)),null);assert.equal(mod.verify(out).verified,2);
 assert.deepEqual(f.data.items.map(({registrationHold,...r})=>r),compactBefore.items);assert.deepEqual(f.data.reviewedBy,compactBefore.reviewedBy);assert.deepEqual(f.bytes(sp),sourceBefore);assert.equal(out.sourceMutation,0);assert.equal(out.semanticApprovalMutation,0);
 assert.equal(mod.run(f.root,{write:true}).counts.registered,2);assert.equal(mod.run(f.root,{check:true}).changed,false);
});
for(const fault of ['held-uid','held-number','denominator','unknown-schema','unknown-field','new-approval','uncovered-retained','unchanged-partition','wrong-original-vector','wrong-source-commit'])test('current negative intake rejects immutable carrier fault: '+fault,t=>{
 const f=fixture(t);
 if(fault==='held-uid')f.proof.questionUid=uid(2);
 if(fault==='held-number')f.proof.sourceQuestionNo='2';
 if(fault==='denominator')f.proof.expectedQuestionCount=2;
 if(fault==='unknown-schema')f.proof.schemaVersion='generic-review-v1';
 if(fault==='unknown-field')f.proof.allowPartial=true;
 if(fault==='new-approval')f.proof.newSemanticApprovals=1;
 if(fault==='uncovered-retained')f.proof.retainedOrdinals=[];
 if(fault==='unchanged-partition')f.proof.unchangedOrdinals=[2,3];
 if(fault==='wrong-original-vector')f.proof.nativeFourSlotRef.sha256='0'.repeat(64);
 if(fault==='wrong-source-commit')f.proof.sourceRef={...f.proof.sourceRef,commit:'f'.repeat(40)};
 f.signCarrier();denied(f);
});
for(const fault of ['slot','reviewer','removed-hold','removed-top-marker','removed-direct-proof','missing-carrier','missing-positive','missing-negative','source-field','held-asset','retained-asset','unchanged-binary-asset','identity-join'])test('current negative intake rejects live drift before any peer registers: '+fault,t=>{
 const f=fixture(t);
 if(fault==='slot')f.data.items[2].method=[2];
 if(fault==='reviewer')f.data.reviewedBy.agent='changed';
 if(fault==='removed-hold')delete f.data.items[0].registrationHold;
 if(fault==='removed-top-marker')delete f.data.evidence.nativeHoldReview;
 if(fault==='removed-direct-proof')delete f.data.items[0].registrationHold.independentNegativeEvidence;
 if(fault==='missing-carrier')fs.unlinkSync(path.join(f.root,f.proofPath));
 if(fault==='missing-positive')fs.unlinkSync(path.join(f.root,f.reviewPath));
 if(fault==='missing-negative')fs.unlinkSync(path.join(f.root,f.negativePath));
 if(fault==='source-field'){f.bank[2].tagStatus='unreviewed';f.save(sp,f.js(f.bank));}
 if(fault==='held-asset')f.save(f.heldNow,'<svg>changed current held asset</svg>');
 if(fault==='retained-asset')f.save(f.retNow,'<svg>changed current retained asset</svg>');
 if(fault==='unchanged-binary-asset')f.save(f.unchangedAsset,Buffer.from([137,80,78,71,13,10,26,10,254,0,128,129]));
 if(fault==='identity-join'){f.identity.records[2].questionUid=uid(2);f.save('archive/data/question_identity_map.json',f.identity);}
 f.write();denied(f);
});
for(const fault of ['positive-not-inspected','positive-asset-omitted','positive-wrong-vector','positive-wrong-field-coverage','negative-not-inspected','negative-asset-omitted','negative-payload','negative-reviewer-collision','negative-register-decision'])test('current negative intake rejects invalid immutable observation: '+fault,t=>{
 const f=fixture(t);let which='positive';
 if(fault==='positive-not-inspected')f.review.exams[0].rows[0].actualVisualInspection=false;
 if(fault==='positive-asset-omitted')f.review.exams[0].rows[0].currentAssets=[];
 if(fault==='positive-wrong-vector')f.review.exams[0].rows[0].compactItemSha256='0'.repeat(64);
 if(fault==='positive-wrong-field-coverage')f.review.exams[0].rows[0].changedStudentFields=[];
 if(fault.startsWith('negative-'))which='negative';
 if(fault==='negative-not-inspected')f.negative.rows[0].inspection.actualRendererRead=false;
 if(fault==='negative-asset-omitted')f.negative.rows[0].currentAssets=[];
 if(fault==='negative-payload')f.negative.rows[0].wholeQuestionSha256='0'.repeat(64);
 if(fault==='negative-reviewer-collision')f.negative.reviewer=f.proof.author;
 if(fault==='negative-register-decision')f.negative.rows[0].decision='REGISTER';
 f.signReview(which);denied(f);
});
for(const target of ['carrier','positive','negative'])test('cached current negative intake revalidates '+target+' bytes and exposes all proof digests',t=>{
 const f=fixture(t);const built=mod.build(f.root);const seen=new Map(built.observed);for(const p of [f.proofPath,f.reviewPath,f.negativePath])assert.equal(seen.get(p),mod.sha(f.bytes(p)));
 mod.run(f.root,{write:true});fs.unlinkSync(path.join(f.root,target==='carrier'?f.proofPath:target==='positive'?f.reviewPath:f.negativePath));denied(f);
});
test('the new hold schema cannot be accepted by the row API without full-file authority',t=>{
 const f=fixture(t);assert.deepEqual(mod.validateRegistrationHold(f.root,f.data,f.data.items[0],f.identity.records[0],{q:f.bank[0],ordinal:1}),['CURRENT_RENDERER_HOLD_FILE_NOT_VALIDATED']);
});
for(const fault of ['all-markers','all-markers-and-local-proof','proof-deleted-in-HEAD','current-source-rebound','git-unavailable'])test('immutable negative ancestry prevents a silent release: '+fault,t=>{
 const f=fixture(t);delete f.data.evidence.nativeHoldReview;delete f.data.items[0].registrationHold;
 if(fault==='all-markers-and-local-proof')fs.unlinkSync(path.join(f.root,f.negativePath));
 if(fault==='current-source-rebound'){f.bank[2].tagStatus='changed source requires separate review';f.save(sp,f.js(f.bank));f.data.sourceGitBlobSha=mod.blob(f.js(f.bank));}
 f.write();
 if(fault==='proof-deleted-in-HEAD'){fs.unlinkSync(path.join(f.root,f.negativePath));f.commit('later tree cannot erase the negative obligation');}
 if(fault==='git-unavailable')fs.renameSync(path.join(f.root,'.git'),path.join(f.root,'git-unavailable'));
 denied(f);
});
test('legacy full compact without a negative decision in its ancestry retains its original behavior',t=>{
 const f=fixture(t);f.commit('freeze current hold fixture');f.git('checkout','--detach',f.priorCommit);
 const out=mod.build(f.root).index;assert.equal(out.records.length,3);assert.equal(out.pending.length,0);assert.equal(mod.verify(out).verified,3);
});
for(const field of ['imageAlt','imageSize','solutionImageCaption','tagStatus'])test('truthfully rebound source refs cannot approve an unreviewed peer field: '+field,t=>{
 const f=fixture(t);f.bank[2][field]='new unreviewed value';f.save(sp,f.js(f.bank));const sourceCommit=f.commit('immutable new source with an unreviewed peer change');const sourceRef=f.ref(sourceCommit,sp,true);
 f.proof.sourceRef=sourceRef;f.review.exams[0].sourceRef=sourceRef;f.negative.rows[0].sourceRef=sourceRef;
 for(const r of f.review.exams[0].rows)for(const a of r.currentAssets)a.commit=sourceCommit;
 for(const r of f.negative.rows){r.incorrectRenderer.commit=sourceCommit;for(const a of r.currentAssets)a.commit=sourceCommit;}
 f.save(f.reviewPath,f.review);f.save(f.negativePath,f.negative);const reviewCommit=f.commit('immutable exact references without a new peer review');
 f.proof.vectorContinuityRef=f.ref(reviewCommit,f.reviewPath);f.proof.independentNegativeReviewRef=f.ref(reviewCommit,f.negativePath);f.signCarrier();
 const out=denied(f);assert.ok(out.pending.some(p=>p.reason==='CURRENT_RENDERER_HOLD_UNREVIEWED_QUESTION_CHANGE'),JSON.stringify(out.pending));
});
