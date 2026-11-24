import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import canonical from '../archive/archive2-canonical.js';
import {planQuestion,nativeReviewReceipt,activeBindingContext,sourceFingerprint,contentFingerprint,loadBank,sourcePath,selectTargets,registerMergedSource,backlogCounts} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {textFingerprint} from '../archive/tools/meta-foundation/text-binding-lib.mjs';
import {explicitRegistrationMode,inferRegistrationMode} from '../archive/tools/meta-foundation/registration-mode.mjs';
import {validateActiveMetaFields} from '../archive/tools/meta-foundation/active-registry.mjs';
import {validateReviewedSourceReassessment,REASSESSED_STUDENT_FIELDS} from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import {nativeReviewedFigureRebind} from '../archive/tools/meta-foundation/native-reviewed-figure-reuse.mjs';
import {nativeReviewedRendererRebind} from '../archive/tools/meta-foundation/native-reviewed-renderer-reuse.mjs';
import {REVIEWED_META_VALUE_FIELDS} from '../archive/tools/meta-foundation/reviewed-meta-value-fields.mjs';
import {reviewedRendererBindingPath,buildReviewedRendererBinding} from '../archive/tools/meta-foundation/reviewed-current-renderer-continuity.mjs';
import {reviewedSourceBindingPath,buildReviewedSourceBinding} from '../archive/tools/meta-foundation/reviewed-source-binding.mjs';
import {hasNativeReviewedSourceClaim,validateNativeReviewedSourceReuse} from '../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';
import {hasNativeSourcePreservationClaim} from '../archive/tools/meta-foundation/native-preserved-source-reuse.mjs';
import {assertReviewedPackVersionLineage} from '../archive/tools/meta-foundation/reviewed-pack-version-lineage.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source='original/middle/m3/1mid/fixture.js',uid='qid_v1_'+'a'.repeat(64);
function fixture() {
  const q={id:1,content:'question',choices:['a','b'],answer:'a',solution:'solution',curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-01',subUnitKey:'M3-01-ROOT',problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',level:'중',primaryMethod:'definition',decisiveStep:'positive root'};
  const previous={...q,problemTypeKey:null,templateKey:null};
  const current={...q,questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:1,problemTypeKey:'',templateKey:'',sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q),metadataStatus:'registration_pending_semantic_review',reviewStatus:'review_required',fieldStatus:{problemType:'manual_review_pending'}};
  const identity={questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:1,status:'VERIFIED',sourceFingerprint:sourceFingerprint(q)};
  const registry={status:'ACTIVE',registrySha:'sha256:'+'b'.repeat(64),problemTypes:new Map([['PT_ROOT',{status:'ACTIVE',ownerPack:'MIDDLE3',canonicalLabelKo:'Root'}]]),templates:new Map([['TPL_ROOT',{status:'ACTIVE',ownerPack:'MIDDLE3',parentProblemTypeKey:'PT_ROOT',canonicalLabelKo:'Root test'}]]),activePacks:new Map([['MIDDLE3',{id:'MIDDLE3',version:'1.0.0',status:'ACTIVE',curricula:['2015'],standardCourses:['중3 수학']}]]),bindingRows:[{status:'ACTIVE',curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-01',subUnitKey:'M3-01-ROOT',problemTypeKey:'PT_ROOT',L1:'Numbers',L2:'Roots'}]};
  const validate=(row,reg)=>({status:reg.problemTypes.has(row.problemTypeKey)&&reg.templates.get(row.templateKey)?.parentProblemTypeKey===row.problemTypeKey?'VALIDATED':'FAIL',errors:reg.problemTypes.has(row.problemTypeKey)&&reg.templates.has(row.templateKey)?[]:['INVALID_KEY'],activeBinding:true,difficultyComplete:Number.isInteger(row.difficultyBucket)&&row.difficultyBucket>=1&&row.difficultyBucket<=5,curriculum:'2015'});
  return {question:q,previous,current,identity,registry,validate,source,ordinal:1};
}
test('declared active metadata is registered without fabricating FINAL_QA',()=>{const f=fixture(),r=planQuestion(f);assert.equal(r.status,'APPLY');assert.equal(r.final.metadataRegistrationStatus,'REGISTERED');assert.equal(r.final.metadataApprovalType,'MAIN_MERGE');assert.equal(r.final.reviewStatus,'review_required');assert.equal(r.final.independentMathReviewStatus,'NOT_PERFORMED_BY_AUTO_REGISTRAR');assert.equal(r.final.L4,'Root test');assert.equal(f.current.problemTypeKey,'');});
test('source student fields are never mutated',()=>{const f=fixture(),before=JSON.stringify(f.question);planQuestion(f);assert.equal(JSON.stringify(f.question),before);});
test('unknown PT is isolated',()=>{const f=fixture();f.question.problemTypeKey='UNKNOWN';assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');});
test('missing PT/TPL is debt, not an invented classification',()=>{const f=fixture();f.question.problemTypeKey=null;f.question.templateKey=null;assert.deepEqual(planQuestion(f).reasons,['DECLARED_PT_TPL_MISSING']);});
test('wrong TPL parent is refused',()=>{const f=fixture();f.registry.templates.get('TPL_ROOT').parentProblemTypeKey='OTHER';assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');});
test('binding must match course, not merely an identical unit key',()=>{const f=fixture();f.registry.bindingRows[0].standardCourse='other';assert.deepEqual(planQuestion(f).reasons,['EXACT_COURSE_BINDING_MISSING_OR_AMBIGUOUS']);});
test('ambiguous binding is refused',()=>{const f=fixture();f.registry.bindingRows.push({...f.registry.bindingRows[0]});assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');});
test('UID mismatch is refused',()=>{const f=fixture();f.identity.questionUid='other';assert.deepEqual(planQuestion(f).reasons,['UID_JOIN_MISMATCH']);});
test('embedded source UID cannot impersonate identity',()=>{const f=fixture();f.question.questionUid='other';assert.deepEqual(planQuestion(f).reasons,['SOURCE_UID_CONFLICT']);});
test('identity fingerprint drift is refused when the row is not bound to the current stem and choices',()=>{const f=fixture();f.identity.sourceFingerprint='bad';f.current.contentFingerprint='bad';assert.deepEqual(planQuestion(f).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);});
test('unrelated metadata fingerprint conflict is refused when the row is not bound to the current stem and choices',()=>{const f=fixture();f.current.sourceFingerprint='bad';f.current.contentFingerprint='bad';assert.deepEqual(planQuestion(f).reasons,['METADATA_SOURCE_FINGERPRINT_CONFLICT']);});
// 결속 지문 = 발문+보기(text-v1). 전체 지문(해설·정답·그림)은 감사용이라 그것만 어긋난 행은 막지 않는다.
const rebindsFor=(uidValue,anchorFp,question)=>({present:true,entries:1,byUid:new Map([[uidValue,[{uid:uidValue,fp:anchorFp,text:textFingerprint(question)}]]])});
test('solution-only and answer-only edits no longer block registration (stem and choices bound by the row content fingerprint)',()=>{
  const f=fixture(),staleFp=f.identity.sourceFingerprint;
  f.question.solution='edited solution';f.question.answer='b';
  assert.notEqual(sourceFingerprint(f.question),staleFp);
  const r=planQuestion(f);
  assert.equal(r.status,'APPLY');
  // identity는 이 등록기가 고치지 않으므로 행의 전체 지문도 identity와 같게 둔다(어긋남이 새로 생기면 FINAL_QA·난이도 길이 divergence로 거절한다).
  assert.equal(r.final.sourceFingerprint,staleFp);assert.equal(r.final.contentFingerprint,contentFingerprint(f.question));
  // 같은 요청을 다시 돌려도 지문 사유로 거절되지 않고 이미 등록으로 끝난다.
  const again={...f,current:{...f.current,...r.final}};
  assert.equal(planQuestion({...again,priorReceipt:{inputHash:r.inputHash,metadataRegistrationStatus:'REGISTERED'}}).status,'ALREADY_REGISTERED');
});
test('figure-only edit is accepted only through a frozen rebind record for the row anchor fingerprint',()=>{
  const f=fixture(),anchor=f.current.contentFingerprint;
  f.question.image='new-figure.png';
  assert.notEqual(contentFingerprint(f.question),anchor);
  assert.deepEqual(planQuestion(f).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);
  assert.equal(planQuestion({...f,textRebinds:rebindsFor(uid,anchor,f.question)}).status,'APPLY');
  // 다른 문항·다른 지문에 대한 기록은 효력이 없다.
  assert.deepEqual(planQuestion({...f,textRebinds:rebindsFor(uid,'f'.repeat(64),f.question)}).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);
});
test('stem or choices edit is refused even with an older rebind record',()=>{
  for(const edit of [q=>{q.content='changed stem';},q=>{q.choices=['a','c'];}]) {
    const f=fixture(),anchor=f.current.contentFingerprint,old=structuredClone(f.question);
    edit(f.question);
    assert.deepEqual(planQuestion(f).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);
    assert.deepEqual(planQuestion({...f,textRebinds:rebindsFor(uid,anchor,old)}).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);
  }
});
test('a row with no binding evidence at all stays refused',()=>{const f=fixture();f.identity.sourceFingerprint='bad';delete f.current.contentFingerprint;assert.deepEqual(planQuestion({...f,textRebinds:{present:true,entries:0,byUid:new Map()}}).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);});
test('a row whose only binding is the type judgment stays refused',()=>{
  const f=fixture();f.question.image='new-figure.png';
  f.current.fieldStatus={problemType:'approved_direct_judgment'};
  f.current.typeApproval={approvalType:'DIRECT_JUDGMENT',textBindingFingerprint:textFingerprint(f.question)};
  assert.deepEqual(planQuestion(f).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);
});
test('runtime owner is not silently moved',()=>{const f=fixture();f.runtimeOwner='OTHER';assert.deepEqual(planQuestion(f).reasons,['EXISTING_RUNTIME_OWNER_CONFLICT']);});
test('missing semantic rationale is not synthesized',()=>{const f=fixture();delete f.question.decisiveStep;assert.deepEqual(planQuestion(f).reasons,['SOURCE_SEMANTIC_RATIONALE_MISSING']);});
test('unknown difficulty is retained as debt',()=>{const f=fixture();f.question.difficultyBucket='UNKNOWN';assert.ok(planQuestion(f).reasons.includes('DIFFICULTY_INCOMPLETE'));});
test('unchanged approved values keep independent review provenance',()=>{const f=fixture();f.previous=structuredClone(f.question);f.current={...f.current,problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',metadataStatus:'approved_semantic_review',reviewStatus:'reviewed_pass',metadataApprovalType:'REVIEW2'};const r=planQuestion(f);assert.equal(r.final.reviewStatus,'reviewed_pass');assert.equal(r.final.metadataApprovalType,'REVIEW2');assert.equal(r.preserveReview,true);});
for(const [label,held,caughtUp] of [
  ['both type fields',['problemType','template'],false],
  ['problem type only',['problemType'],false],
  ['template only',['template'],false],
  ['unchanged pending source',['problemType','template'],true],
])test('partial basic approval keeps its explicit '+label+' hold when ACTIVE binding becomes available',()=>{
  const f=fixture();
  if(caughtUp)f.previous=structuredClone(f.question);
  Object.assign(f.current,{metadataStatus:'approved_partial_with_explicit_holds',
    tagStatus:'approved_subunit_concept_partial',metadataRevision:'original-basic-review',
    approvalEvidence:['review/original-basic-classification.json'],
    fieldStatus:{standardUnit:'approved_source',subUnit:'approved_source',concept:'approved_classification',
      difficulty:'approved_source',...Object.fromEntries(held.map(k=>[k,'manual_review_pending']))}});
  const before=JSON.stringify({question:f.question,previous:f.previous,current:f.current,identity:f.identity});
  const binding=f.registry.bindingRows;f.registry.bindingRows=[];
  assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');
  f.registry.bindingRows=binding;
  const result=planQuestion(f);
  assert.equal(result.status,'SUPPLEMENT_PENDING');
  assert.deepEqual(result.reasons,['EXPLICIT_PARTIAL_REVIEW_HOLD']);
  assert.equal(result.final,undefined);assert.equal(result.nativeReviewReceipt,undefined);
  assert.equal(JSON.stringify({question:f.question,previous:f.previous,current:f.current,identity:f.identity}),before);
});
function nativeReviewFixture(t,{omitFields=[],questionOverrides={},officialValidator=false,ordinal=1,globalQuestionNo=ordinal}={}) {
  const f=fixture(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'auto-meta-native-review-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  Object.assign(f.question,questionOverrides);Object.assign(f.current,questionOverrides);
  for(const field of omitFields){delete f.question[field];delete f.current[field];}
  if(officialValidator) {
    f.registry.concepts=new Map();f.registry.conditions=new Map();f.registry.integrationPatterns=new Set(['NONE']);
    f.registry.bindings=new Set(f.registry.bindingRows.map(b=>[b.curriculum,b.standardUnitKey,b.subUnitKey??'<DIRECT>',b.problemTypeKey].join('\0')));
    f.registry.activePacks.set('MIDDLE3',{...f.registry.activePacks.get('MIDDLE3'),id:'MIDDLE3',version:'1.0.0',status:'ACTIVE'});
    f.registry.bindingRows[0].ownerPack='MIDDLE3';
    f.validate=validateActiveMetaFields;
  }
  const requestId='same-source-finalqa',receiptPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${requestId}.json`;
  const evidencePath='review/metadata.json',evidence=Buffer.from('{"scope":"metadata review fixture"}\n');
  const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
  f.previous={...f.question,primaryMethod:'prior method',decisiveStep:'prior step'};
  f.ordinal=ordinal;f.identity={...f.identity,sourceOrdinal:ordinal,sourceQuestionNo:globalQuestionNo};
  f.current={...f.current,sourceOrdinal:ordinal,sourceQuestionNo:globalQuestionNo,problemTypeKey:f.question.problemTypeKey,templateKey:f.question.templateKey,
    L1:'Reviewed RPM parent',L2:'Reviewed RPM middle',L3:'Root',L4:'Root test',
    metadataStatus:'approved_semantic_review',reviewStatus:'reviewed_pass',metadataApprovalType:'FINAL_QA',
    tagStatus:'reviewed_pass',tagConfidence:'approved_final_qa',metaFoundationStatus:'ACTIVE',
    metaFoundationPackId:'MIDDLE3',metaFoundationPackVersion:'1.0.0',
    metadataRevision:`meta-foundation:MIDDLE3@1.0.0:exam-final_qa-v2:${requestId}`,
    approvalEvidence:[receiptPath],fieldStatus:{problemType:'approved_final_qa'}};
  const bank=Array.from({length:ordinal},(_,i)=>i===ordinal-1?structuredClone(f.question):
    {...structuredClone(f.question),id:i+1,...(Object.hasOwn(f.question,'sourceQuestionNo')?{sourceQuestionNo:String(i+1)}:{})});
  const appliedRecords=bank.map((q,i)=>i===ordinal-1?structuredClone(f.current):{...structuredClone(f.current),
    questionUid:'qid_v1_'+(i+1).toString(16).padStart(64,'0'),sourceOrdinal:i+1,sourceQuestionNo:String(i+1)});
  const appliedIdentityRecords=appliedRecords.map(r=>({...structuredClone(f.identity),questionUid:r.questionUid,
    sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo}));
  const runtimeRecords=appliedRecords.map((r,i)=>({...structuredClone(r),sourceIdentity:source+'#'+(i+1),
    sourceQuestionNo:String(bank[i].sourceQuestionNo??bank[i].id??''),approvedSourceFingerprint:r.sourceFingerprint}));
  const bytes=Buffer.from('window.questionBank='+JSON.stringify(bank)+';\n');
  const blobSha1=crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  f.nativeSource={root:dir,bytes,blobSha1,bank,runtimeRecord:structuredClone(runtimeRecords[ordinal-1]),runtimeStatus:'ACTIVE'};
  f.receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId,requestSha256:'a'.repeat(64),
    examUid:'fixture',sourceArchiveFile:source,sourceRawSha256:sha(bytes),sourceBlobSha1:blobSha1,totalQuestions:bank.length,
    metadataRegistrationStatus:'REGISTERED',approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'fixture-reviewer',
      evidenceRefs:[{path:evidencePath,sha256:sha(evidence)}]},appliedRecords,appliedIdentityRecords,runtimeRecords};
  for(const [relative,data] of [['archive/exams/'+source,bytes],[evidencePath,evidence]]) {
    const full=path.join(dir,relative);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,data);
  }
  f.receiptPath=receiptPath;f.evidenceFile=path.join(dir,evidencePath);
  f.saveReceipt=()=>{const full=path.join(dir,receiptPath);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,JSON.stringify(f.receipt));};
  f.saveReceipt();return f;
}
test('a current byte-bound native approval survives an older AutoMeta cursor without rewriting its parent or provenance',t=>{
  const f=nativeReviewFixture(t),before=JSON.stringify({question:f.question,current:f.current,runtime:f.nativeSource.runtimeRecord});
  const r=planQuestion(f);assert.equal(r.status,'ALREADY_REGISTERED');assert.equal(r.nativeReviewReceipt,f.receiptPath);
  assert.equal(r.final,undefined);assert.equal(JSON.stringify({question:f.question,current:f.current,runtime:f.nativeSource.runtimeRecord}),before);
  // Native registration can resolve a parent from the master/targetParentRef when an old ACTIVE binding has no display labels.
  delete f.registry.bindingRows[0].L1;delete f.registry.bindingRows[0].L2;
  assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');
  assert.equal(planQuestion({...f,nativeSource:undefined}).reasons[0],'CANONICAL_LABELS_MISSING');
});
test('stale or incomplete native evidence cannot preserve review after source metadata changes',async t=>{
  const cases=[
    ['old source hash',f=>{f.receipt.sourceRawSha256='0'.repeat(64);}],
    ['wrong Git blob',f=>{f.receipt.sourceBlobSha1='0'.repeat(40);}],
    ['wrong UID',f=>{f.receipt.appliedRecords[0].questionUid='other';}],
    ['wrong ordinal',f=>{f.receipt.appliedRecords[0].sourceOrdinal=2;}],
    ['different current record',f=>{f.current.fieldStatus.problemType='changed';}],
    ['missing approval link',f=>{f.current.approvalEvidence=[];}],
    ['missing approval evidence',f=>{f.receipt.approval.evidenceRefs=[];}],
    ['changed evidence bytes',f=>{fs.writeFileSync(f.evidenceFile,'changed');}],
    ['unregistered receipt',f=>{f.receipt.metadataRegistrationStatus='PENDING';}],
    ['unreviewed receipt',f=>{f.receipt.approval.metadataReviewed=false;}],
    ['runtime drift',f=>{f.nativeSource.runtimeRecord.tagStatus='review_required';}],
    ['inactive runtime document',f=>{f.nativeSource.runtimeStatus='INACTIVE';}],
    ['student payload changed',f=>{f.previous.content='earlier student content';}],
  ];
  for(const [name,mutate] of cases)await t.test(name,t=>{const f=nativeReviewFixture(t);mutate(f);f.saveReceipt();
    const r=planQuestion(f);assert.equal(r.status,'APPLY');assert.equal(r.final.reviewStatus,'review_required');
    assert.equal(r.final.metadataApprovalType,'MAIN_MERGE');assert.equal(r.nativeReviewReceipt,undefined);
  });
});
test('native approval reuse still requires the ACTIVE registry, exact binding and source rationale',t=>{
  const f=nativeReviewFixture(t);f.registry.problemTypes.delete('PT_ROOT');
  assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');
  const noBinding=nativeReviewFixture(t);noBinding.registry.bindingRows=[];
  assert.deepEqual(planQuestion(noBinding).reasons,['EXACT_COURSE_BINDING_MISSING_OR_AMBIGUOUS']);
  const noRationale=nativeReviewFixture(t);delete noRationale.question.decisiveStep;
  assert.deepEqual(planQuestion(noRationale).reasons,['SOURCE_SEMANTIC_RATIONALE_MISSING']);
});
test('native receipt reuse accepts missing producer-only fields without completing or rewriting them',t=>{
  const f=nativeReviewFixture(t,{omitFields:['difficultyBoundaryFlag','legacyLevelCompatibility'],officialValidator:true});
  const before=JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,receipt:f.receipt});
  const calls=[];f.validate=(q,registry,options)=>{calls.push(options.requireFields);return validateActiveMetaFields(q,registry,options);};
  const r=planQuestion(f);
  assert.equal(r.status,'ALREADY_REGISTERED',JSON.stringify(r));assert.equal(r.nativeReviewReceipt,f.receiptPath);assert.equal(r.final,undefined);
  assert.deepEqual(calls,[false],'only existing-receipt validation is used after exact proof succeeds');
  assert.equal(JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,receipt:f.receipt}),before);
  for(const row of [f.question,f.current,f.nativeSource.runtimeRecord])for(const field of ['difficultyBoundaryFlag','legacyLevelCompatibility'])assert.equal(Object.hasOwn(row,field),false);
});
function partialNativeReviewFixture(t,{completeFields=false}={}) {
  const f=nativeReviewFixture(t,{ordinal:3,questionOverrides:{id:3},
    omitFields:completeFields?[]:['difficultyBoundaryFlag','legacyLevelCompatibility'],officialValidator:true});
  f.allRecords=structuredClone(f.receipt.appliedRecords);
  f.allRuntimes=structuredClone(f.receipt.runtimeRecords);
  f.nativeSource.identityByJoin=new Map(f.receipt.appliedIdentityRecords.map(r=>[
    `${r.sourceArchiveFile}#${r.sourceOrdinal}`,structuredClone(r)]));
  Object.assign(f.receipt,{scope:'PARTIAL_UIDS',partialUidCount:2,totalQuestions:2,expectedQuestionCount:3});
  for(const key of ['appliedRecords','appliedIdentityRecords','runtimeRecords'])
    f.receipt[key]=f.receipt[key].filter(r=>r.sourceOrdinal!==2).reverse();
  f.saveReceipt();return f;
}
test('partial native reuse finds a noncontiguous selected UID without rewriting native approval',t=>{
  const f=partialNativeReviewFixture(t),before=JSON.stringify({current:f.current,identity:f.identity,
    runtime:f.nativeSource.runtimeRecord,receipt:f.receipt,question:f.question});
  assert.deepEqual(f.receipt.appliedRecords.map(r=>r.sourceOrdinal),[3,1]);
  const r=planQuestion(f);
  assert.equal(r.status,'ALREADY_REGISTERED',JSON.stringify(r));assert.equal(r.nativeReviewReceipt,f.receiptPath);
  assert.equal(r.final,undefined);
  assert.equal(JSON.stringify({current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,
    receipt:f.receipt,question:f.question}),before);
});
function solutionRebindNativeFixture(t,{completeFields=false}={}) {
  const f=partialNativeReviewFixture(t,{completeFields}),oldBank=structuredClone(f.nativeSource.bank);
  f.previous.solution='previous solution explicitly repaired by the native FINAL_QA';
  oldBank[f.ordinal-1].solution=f.previous.solution;
  execFileSync('git',['init','-q'],{cwd:f.nativeSource.root});
  const oldBytes='window.questionBank='+JSON.stringify(oldBank)+';\n';
  const priorSourceBlobSha1=execFileSync('git',['hash-object','-w','--stdin'],{cwd:f.nativeSource.root,input:oldBytes,encoding:'utf8'}).trim();
  const fp=sourceFingerprint(f.previous),cf=contentFingerprint(f.previous);
  f.receipt.fingerprintRepairs=[{questionUid:f.identity.questionUid,sourceOrdinal:f.ordinal,
    metadataBefore:{sourceFingerprint:fp,contentFingerprint:cf},identityBefore:{sourceFingerprint:fp},
    after:{sourceFingerprint:sourceFingerprint(f.question),contentFingerprint:contentFingerprint(f.question)},
    rebind:{priorSourceBlobSha1,priorContentFingerprint:cf}}];
  f.saveReceipt();return f;
}
test('a selected solution-only repair reuses its new native approval across an older cursor',t=>{
  const f=solutionRebindNativeFixture(t),before=JSON.stringify({current:f.current,identity:f.identity,
    runtime:f.nativeSource.runtimeRecord,receipt:f.receipt,question:f.question});
  delete f.registry.bindingRows[0].L1;delete f.registry.bindingRows[0].L2;
  const result=planQuestion(f);
  assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
  assert.equal(result.nativeReviewReceipt,f.receiptPath);assert.equal(result.final,undefined);
  assert.equal(JSON.stringify({current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,
    receipt:f.receipt,question:f.question}),before);
});
test('solution-only native reuse requires exact selected repair, previous Git bytes and unchanged student inputs',async t=>{
  const cases=[
    ['missing repair',f=>{delete f.receipt.fingerprintRepairs;}],
    ['other UID repair',f=>{f.receipt.fingerprintRepairs[0].questionUid='other';}],
    ['duplicate repair',f=>{f.receipt.fingerprintRepairs.push(structuredClone(f.receipt.fingerprintRepairs[0]));}],
    ['other ordinal',f=>{f.receipt.fingerprintRepairs[0].sourceOrdinal=1;}],
    ['old metadata mismatch',f=>{f.receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint='0'.repeat(64);}],
    ['old identity mismatch',f=>{f.receipt.fingerprintRepairs[0].identityBefore.sourceFingerprint='0'.repeat(64);}],
    ['old content mismatch',f=>{f.receipt.fingerprintRepairs[0].metadataBefore.contentFingerprint='0'.repeat(64);}],
    ['missing old content declaration',f=>{delete f.receipt.fingerprintRepairs[0].metadataBefore.contentFingerprint;}],
    ['current source mismatch',f=>{f.receipt.fingerprintRepairs[0].after.sourceFingerprint='0'.repeat(64);}],
    ['current content mismatch',f=>{f.receipt.fingerprintRepairs[0].after.contentFingerprint='0'.repeat(64);}],
    ['missing actual old blob',f=>{f.receipt.fingerprintRepairs[0].rebind.priorSourceBlobSha1='0'.repeat(40);}],
    ['wrong rebind content',f=>{f.receipt.fingerprintRepairs[0].rebind.priorContentFingerprint='0'.repeat(64);}],
    ['old source solution differs from cursor',f=>{f.previous.solution+=' different';const fp=sourceFingerprint(f.previous);f.receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint=fp;f.receipt.fingerprintRepairs[0].identityBefore.sourceFingerprint=fp;}],
    ['changed stem',f=>{f.previous.content='old different stem';}],
    ['changed answer',f=>{f.previous.answer='other';}],
    ['changed figure',f=>{f.previous.figureSvg='<svg/>';}],
    ['changed layout',f=>{f.previous.layoutTag='wide';}],
    ['changed renderer number',f=>{f.previous.number=8;}],
    ['ambiguous reassessment proof',f=>{f.receipt.fingerprintRepairs[0].sourceReview={};}],
  ];
  for(const [name,mutate] of cases)await t.test(name,t=>{
    const f=solutionRebindNativeFixture(t);mutate(f);f.saveReceipt();const result=planQuestion(f);
    assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
  });
});
test('AutoMeta retains a partial canonical approval when the source carries its uniquely bound legacy alias',t=>{
  const f=partialNativeReviewFixture(t),identityMap={schemaVersion:'question-identity-map-v1',records:[],lookup:{
    byQuestionUid:{},bySourceFileAndOrdinal:{[source]:{}},bySourceFileAndQuestionNo:{[source]:{}},byLegacyQKey:{}}};
  for(const row of f.nativeSource.identityByJoin.values()) {
    row.legacyQKey=`${source}_${row.sourceQuestionNo}`;identityMap.records.push(row);
    identityMap.lookup.byQuestionUid[row.questionUid]={sourceArchiveFile:source,sourceOrdinal:row.sourceOrdinal,sourceQuestionNo:row.sourceQuestionNo};
    identityMap.lookup.bySourceFileAndOrdinal[source][row.sourceOrdinal]=row.questionUid;
    identityMap.lookup.bySourceFileAndQuestionNo[source][row.sourceQuestionNo]=[row.questionUid];
    identityMap.lookup.byLegacyQKey[row.legacyQKey]=[row.questionUid];
  }
  f.nativeSource.identityMap=identityMap;
  f.identity.legacyQKey=`${source}_3`;
  for(const row of f.receipt.appliedIdentityRecords)row.legacyQKey=`${source}_${row.sourceQuestionNo}`;
  f.question.questionUid='fixture|3';f.previous.questionUid='fixture|3';
  f.nativeSource.bank[2].questionUid='fixture|3';
  const bytes=Buffer.from('window.questionBank='+JSON.stringify(f.nativeSource.bank)+';\n');
  f.nativeSource.bytes=bytes;
  f.nativeSource.blobSha1=crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  f.receipt.sourceBlobSha1=f.nativeSource.blobSha1;
  f.receipt.sourceRawSha256=crypto.createHash('sha256').update(bytes).digest('hex');
  f.saveReceipt();const before=JSON.stringify({current:f.current,identity:f.identity,question:f.question});
  const r=planQuestion(f);assert.equal(r.status,'ALREADY_REGISTERED',JSON.stringify(r));assert.equal(r.final,undefined);
  assert.equal(JSON.stringify({current:f.current,identity:f.identity,question:f.question}),before);
  identityMap.lookup.bySourceFileAndQuestionNo[source]['3'].push(f.receipt.appliedRecords[1].questionUid);
  assert.deepEqual(planQuestion(f).reasons,['SOURCE_UID_CONFLICT']);
});
test('a partial receipt cannot lend native approval to a UID outside its selected set',t=>{
  const f=partialNativeReviewFixture(t);
  f.ordinal=2;f.question=structuredClone(f.nativeSource.bank[1]);
  f.previous={...f.question,primaryMethod:'prior method',decisiveStep:'prior step'};
  f.current=f.allRecords[1];f.identity=f.nativeSource.identityByJoin.get(`${source}#2`);
  f.nativeSource.runtimeRecord=f.allRuntimes[1];
  const before=JSON.stringify({current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord});
  const r=planQuestion(f);
  assert.equal(r.status,'SUPPLEMENT_PENDING',JSON.stringify(r));assert.equal(r.nativeReviewReceipt,undefined);
  assert.equal(r.final,undefined);assert.ok(r.reasons.includes('DIFFICULTY_INCOMPLETE'));
  assert.equal(JSON.stringify({current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord}),before);
});
test('partial native reuse rejects malformed scope and tampering in any selected row',async t=>{
  const cases=[
    ['unmarked subset',f=>{delete f.receipt.scope;}],
    ['unknown scope',f=>{f.receipt.scope='OTHER';}],
    ['missing source denominator',f=>{delete f.receipt.expectedQuestionCount;}],
    ['selected count substituted for source denominator',f=>{f.receipt.expectedQuestionCount=2;}],
    ['fractional selected count',f=>{f.receipt.partialUidCount=2.5;}],
    ['wrong selected count',f=>{f.receipt.partialUidCount=1;}],
    ['wrong total',f=>{f.receipt.totalQuestions=3;}],
    ['missing selected metadata',f=>{f.receipt.appliedRecords.pop();}],
    ['duplicate selected UID',f=>{f.receipt.appliedRecords[1].questionUid=f.identity.questionUid;}],
    ['duplicate selected ordinal',f=>{f.receipt.appliedRecords[1].sourceOrdinal=3;}],
    ['out-of-bank ordinal',f=>{f.receipt.appliedRecords[1].sourceOrdinal=4;}],
    ['other selected source',f=>{f.receipt.appliedRecords[1].sourceArchiveFile='other.js';}],
    ['other selected fingerprint',f=>{f.receipt.appliedRecords[1].sourceFingerprint='0'.repeat(64);}],
    ['other selected content fingerprint',f=>{f.receipt.appliedRecords[1].contentFingerprint='0'.repeat(64);}],
    ['other selected global number',f=>{f.receipt.appliedRecords[1].sourceQuestionNo='9';}],
    ['no actual identity map',f=>{delete f.nativeSource.identityByJoin;}],
    ['actual identity UID drift',f=>{f.nativeSource.identityByJoin.get(`${source}#1`).questionUid='foreign';}],
    ['actual identity fingerprint drift',f=>{f.nativeSource.identityByJoin.get(`${source}#1`).sourceFingerprint='0'.repeat(64);}],
    ['missing selected identity',f=>{f.receipt.appliedIdentityRecords.pop();}],
    ['extra identity outside selection',f=>{f.receipt.appliedIdentityRecords.push(f.nativeSource.identityByJoin.get(`${source}#2`));}],
    ['duplicate selected identity',f=>{f.receipt.appliedIdentityRecords[1]=f.receipt.appliedIdentityRecords[0];}],
    ['extra runtime outside selection',f=>{f.receipt.runtimeRecords.push(f.allRuntimes[1]);}],
    ['duplicate runtime',f=>{f.receipt.runtimeRecords.push(f.receipt.runtimeRecords[0]);}],
    ['other selected runtime ordinal',f=>{f.receipt.runtimeRecords[1].sourceOrdinal=2;}],
    ['other selected runtime fingerprint',f=>{f.receipt.runtimeRecords[1].approvedSourceFingerprint='0'.repeat(64);}],
    ['coordinated foreign UID in receipt',f=>{
      for(const key of ['appliedRecords','appliedIdentityRecords','runtimeRecords'])f.receipt[key][1].questionUid='foreign';
    }],
  ];
  for(const [name,mutate] of cases)await t.test(name,t=>{
    const f=partialNativeReviewFixture(t);mutate(f);f.saveReceipt();const r=planQuestion(f);
    assert.equal(r.status,'SUPPLEMENT_PENDING',JSON.stringify(r));assert.equal(r.nativeReviewReceipt,undefined);assert.equal(r.final,undefined);
  });
});
test('a selected REVIEW2 type hold does not require or receive another UID runtime',t=>{
  const f=partialNativeReviewFixture(t),held=f.receipt.appliedRecords[1];
  f.receipt.approval.type='REVIEW2';f.receipt.approval.reviewPassCount=2;
  for(const row of [f.current,f.nativeSource.runtimeRecord,...f.receipt.appliedRecords,...f.receipt.runtimeRecords]) {
    row.metadataApprovalType='REVIEW2';row.metadataRevision=row.metadataRevision.replace('final_qa','review2');
  }
  Object.assign(held,{problemTypeKey:null,templateKey:null,l3Disposition:'HOLD',l4Disposition:'HOLD',
    metadataStatus:'approved_partial_with_explicit_holds',metaFoundationHoldReason:'TYPE_PATH_UNBOUND_UNIT_SUB_ONLY'});
  delete held.metaFoundationStatus;
  f.receipt.runtimeRecords=f.receipt.runtimeRecords.filter(r=>r.questionUid!==held.questionUid);
  Object.assign(f.nativeSource.bank[0],{problemTypeKey:null,templateKey:null});
  const bytes=Buffer.from('window.questionBank='+JSON.stringify(f.nativeSource.bank)+';\n');
  f.nativeSource.bytes=bytes;
  f.nativeSource.blobSha1=crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  f.receipt.sourceBlobSha1=f.nativeSource.blobSha1;
  f.receipt.sourceRawSha256=crypto.createHash('sha256').update(bytes).digest('hex');
  f.saveReceipt();const r=planQuestion(f);
  assert.equal(r.status,'ALREADY_REGISTERED',JSON.stringify(r));assert.equal(r.final,undefined);
  assert.equal(f.receipt.runtimeRecords.length,1);assert.equal(held.l3Disposition,'HOLD');
});
function useCrossPackDefinition(f) {
  f.registry.problemTypes.get('PT_ROOT').ownerPack='GEOMETRY_EQUATIONS';
  f.registry.templates.get('TPL_ROOT').ownerPack='GEOMETRY_EQUATIONS';
  f.registry.activePacks.set('GEOMETRY_EQUATIONS',{id:'GEOMETRY_EQUATIONS',version:'9.0.0',status:'ACTIVE',
    curricula:['2015','2022'],standardCourses:['수학(상)','공통수학2']});
  f.registry.bindingRows[0].ownerPack='MIDDLE3';
  f.runtimeOwner='MIDDLE3';
  return f;
}
test('an exact binding may reuse another ACTIVE pack definition while retaining native runtime approval',t=>{
  const f=useCrossPackDefinition(nativeReviewFixture(t,{omitFields:['difficultyBoundaryFlag','legacyLevelCompatibility'],officialValidator:true}));
  const before=JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,receipt:f.receipt});
  const context=activeBindingContext({candidate:f.current,check:{curriculum:'2015'},registry:f.registry,runtimeOwner:'MIDDLE3'});
  assert.equal(context.reason,undefined);assert.equal(context.ownerPack,'MIDDLE3');assert.equal(context.pt.ownerPack,'GEOMETRY_EQUATIONS');
  assert.equal(context.pack.version,'1.0.0');
  assert.equal(nativeReviewReceipt({...f,pt:context.pt,tpl:context.tpl,ownerPack:context.ownerPack}),f.receiptPath);
  assert.equal(nativeReviewReceipt({...f,pt:context.pt,tpl:context.tpl,ownerPack:context.pt.ownerPack}),null);
  const r=planQuestion(f);assert.equal(r.status,'ALREADY_REGISTERED',JSON.stringify(r));assert.equal(r.nativeReviewReceipt,f.receiptPath);
  assert.equal(r.final,undefined);assert.equal(JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,receipt:f.receipt}),before);
});
test('new production registration consistently uses the exact binding owner and its pack version',()=>{
  const f=useCrossPackDefinition(fixture()),r=planQuestion(f);
  assert.equal(r.status,'APPLY',JSON.stringify(r));assert.equal(r.ownerPack,'MIDDLE3');
  assert.equal(r.final.metaFoundationPackId,'MIDDLE3');assert.equal(r.final.metaFoundationPackVersion,'1.0.0');
  assert.equal(r.final.metadataApprovalType,'MAIN_MERGE');assert.equal(r.final.reviewStatus,'review_required');
  assert.equal(f.registry.problemTypes.get(r.final.problemTypeKey).ownerPack,'GEOMETRY_EQUATIONS');
});
test('cross-pack native reuse still rejects wrong runtime, binding owner, definition owner and scope',async t=>{
  const cases=[
    ['wrong runtime owner',f=>{f.runtimeOwner='GEOMETRY_EQUATIONS';}],
    ['unavailable binding owner',f=>{f.registry.bindingRows[0].ownerPack='MISSING_PACK';}],
    ['wrong active binding owner scope',f=>{f.registry.bindingRows[0].ownerPack='GEOMETRY_EQUATIONS';f.runtimeOwner='GEOMETRY_EQUATIONS';}],
    ['inactive binding owner',f=>{f.registry.activePacks.get('MIDDLE3').status='INACTIVE';}],
    ['inactive definition owner',f=>{f.registry.activePacks.get('GEOMETRY_EQUATIONS').status='INACTIVE';}],
    ['mismatched template definition owner',f=>{f.registry.templates.get('TPL_ROOT').ownerPack='MIDDLE3';}],
    ['inactive exact binding',f=>{f.registry.bindingRows[0].status='INACTIVE';}],
    ['ambiguous exact binding',f=>{f.registry.bindingRows.push({...f.registry.bindingRows[0]});}],
    ['binding owner lacks curriculum',f=>{f.registry.activePacks.get('MIDDLE3').curricula=['2022'];}],
    ['binding owner lacks course',f=>{f.registry.activePacks.get('MIDDLE3').standardCourses=['다른 과정'];}],
    ['binding owner lacks course alias',f=>{f.question.courseKey='UNREGISTERED_ALIAS';f.current.courseKey='UNREGISTERED_ALIAS';}],
    ['missing canonical owner document',f=>{f.registry.root=f.nativeSource.root;}],
    ['receipt revision uses definition owner',f=>{f.current.metadataRevision=f.current.metadataRevision.replace('MIDDLE3@','GEOMETRY_EQUATIONS@');f.receipt.appliedRecords[0].metadataRevision=f.current.metadataRevision;}],
    ['receipt metadata uses definition owner',f=>{f.current.metaFoundationPackId='GEOMETRY_EQUATIONS';f.receipt.appliedRecords[0].metaFoundationPackId='GEOMETRY_EQUATIONS';}],
  ];
  for(const [name,mutate] of cases)await t.test(name,t=>{
    const f=useCrossPackDefinition(nativeReviewFixture(t,{omitFields:['difficultyBoundaryFlag','legacyLevelCompatibility'],officialValidator:true}));
    mutate(f);f.saveReceipt();const r=planQuestion(f);
    assert.equal(r.status,'SUPPLEMENT_PENDING',JSON.stringify(r));assert.equal(r.nativeReviewReceipt,undefined);assert.equal(r.final,undefined);
  });
});
test('read-only receipt proof does not declare a legacy invalid enum eligible for producer reuse',t=>{
  const f=nativeReviewFixture(t,{questionOverrides:{integrationPattern:'DIRECT'},officialValidator:true});
  const before=JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord});
  const context=activeBindingContext({candidate:f.current,check:{curriculum:'2015'},registry:f.registry,runtimeOwner:'MIDDLE3'});
  assert.equal(context.reason,undefined);
  assert.equal(nativeReviewReceipt({...f,nativeSource:f.nativeSource,pt:context.pt,tpl:context.tpl}),f.receiptPath);
  const planned=planQuestion(f);
  assert.equal(planned.status,'SUPPLEMENT_PENDING');assert.ok(planned.reasons.includes('ADVANCED_META_INTEGRATION_PATTERN_INVALID'));
  assert.equal(planned.nativeReviewReceipt,undefined);assert.equal(planned.final,undefined);
  assert.equal(JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord}),before);
});
const restartedNumberFixture=t=>nativeReviewFixture(t,{ordinal:23,globalQuestionNo:'23',
  questionOverrides:{id:23,sourceQuestionNo:'3'},omitFields:['difficultyBoundaryFlag','legacyLevelCompatibility'],officialValidator:true});
test('native receipt reuse preserves global ordinal 23 and restarted explicit display number 3',t=>{
  const f=restartedNumberFixture(t),before=JSON.stringify({question:f.question,current:f.current,identity:f.identity,
    runtime:f.nativeSource.runtimeRecord,receipt:f.receipt});
  const r=planQuestion(f);assert.equal(r.status,'ALREADY_REGISTERED',JSON.stringify(r));
  assert.equal(r.nativeReviewReceipt,f.receiptPath);assert.equal(r.final,undefined);
  assert.equal(f.current.sourceQuestionNo,'23');assert.equal(f.identity.sourceQuestionNo,'23');
  assert.equal(f.nativeSource.runtimeRecord.sourceQuestionNo,'3');assert.equal(f.question.id,23);
  assert.equal(JSON.stringify({question:f.question,current:f.current,identity:f.identity,
    runtime:f.nativeSource.runtimeRecord,receipt:f.receipt}),before);
});
test('restarted display numbers cannot hide native identity, ordinal, receipt, runtime or source drift',async t=>{
  const cases=[
    ['identity global number',f=>{f.identity.sourceQuestionNo='22';}],
    ['metadata global number',f=>{f.current.sourceQuestionNo='22';}],
    ['coordinated global numbers',f=>{f.current.sourceQuestionNo='22';f.identity.sourceQuestionNo='22';}],
    ['identity ordinal',f=>{f.identity.sourceOrdinal=22;}],
    ['metadata ordinal',f=>{f.current.sourceOrdinal=22;}],
    ['receipt identity global number',f=>{f.receipt.appliedIdentityRecords[22].sourceQuestionNo='22';}],
    ['receipt ordinal',f=>{f.receipt.appliedRecords[22].sourceOrdinal=22;}],
    ['explicit display number',f=>{f.question.sourceQuestionNo='4';}],
    ['prior display number',f=>{f.previous.sourceQuestionNo='2';}],
    ['display id in source bytes',f=>{f.question.id=99;}],
    ['coordinated runtime display number',f=>{f.nativeSource.runtimeRecord.sourceQuestionNo='23';f.receipt.runtimeRecords[22].sourceQuestionNo='23';}],
    ['missing runtime display number',f=>{delete f.nativeSource.runtimeRecord.sourceQuestionNo;delete f.receipt.runtimeRecords[22].sourceQuestionNo;}],
    ['source raw bytes',f=>{f.nativeSource.bytes=Buffer.concat([f.nativeSource.bytes,Buffer.from('\n')]);}],
    ['absent native proof',f=>{f.current.approvalEvidence=[];}],
  ];
  for(const [name,mutate] of cases)await t.test(name,t=>{
    const f=restartedNumberFixture(t);mutate(f);f.saveReceipt();const r=planQuestion(f);
    assert.equal(r.status,'SUPPLEMENT_PENDING',JSON.stringify(r));assert.equal(r.nativeReviewReceipt,undefined);assert.equal(r.final,undefined);
  });
});
test('read-only native receipt proof binds its identity number and official runtime display number',t=>{
  const f=restartedNumberFixture(t),context=activeBindingContext({candidate:f.current,check:{curriculum:'2015'},registry:f.registry});
  const verify=()=>nativeReviewReceipt({...f,pt:context.pt,tpl:context.tpl});
  assert.equal(verify(),f.receiptPath);
  f.receipt.appliedIdentityRecords[22].sourceQuestionNo='22';f.saveReceipt();assert.equal(verify(),null);
  f.receipt.appliedIdentityRecords[22].sourceQuestionNo='23';
  f.nativeSource.runtimeRecord.sourceQuestionNo='23';f.receipt.runtimeRecords[22].sourceQuestionNo='23';
  f.saveReceipt();assert.equal(verify(),null);
});
test('missing producer fields still refuse absent or stale native proof through the original strict validator',async t=>{
  const cases=[
    ['no native input',f=>{f.nativeSource=undefined;}],
    ['missing receipt link',f=>{f.current.approvalEvidence=[];}],
    ['stale source hash',f=>{f.receipt.sourceRawSha256='0'.repeat(64);}],
    ['stale Git blob',f=>{f.receipt.sourceBlobSha1='0'.repeat(40);}],
    ['changed proof bytes',f=>{fs.writeFileSync(f.evidenceFile,'changed proof');}],
    ['changed metadata',f=>{f.current.fieldStatus.problemType='changed';}],
    ['changed runtime',f=>{f.nativeSource.runtimeRecord.tagStatus='review_required';}],
    ['inactive runtime',f=>{f.nativeSource.runtimeStatus='INACTIVE';}],
    ['wrong receipt identity',f=>{f.receipt.appliedIdentityRecords[0].sourceFingerprint='0'.repeat(64);}],
    ['changed prior student payload',f=>{f.previous.content='changed student content';}],
  ];
  for(const [name,mutate] of cases)await t.test(name,t=>{
    const f=nativeReviewFixture(t,{omitFields:['difficultyBoundaryFlag','legacyLevelCompatibility'],officialValidator:true});
    mutate(f);f.saveReceipt();const calls=[];
    f.validate=(q,registry,options)=>{calls.push(options.requireFields);return validateActiveMetaFields(q,registry,options);};
    const r=planQuestion(f);
    assert.equal(r.status,'SUPPLEMENT_PENDING');assert.equal(r.nativeReviewReceipt,undefined);assert.equal(r.final,undefined);
    assert.ok(r.reasons.includes('ADVANCED_META_FIELD_MISSING:difficultyBoundaryFlag'));
    assert.ok(r.reasons.includes('ADVANCED_META_FIELD_MISSING:legacyLevelCompatibility'));
    assert.ok(r.reasons.includes('DIFFICULTY_INCOMPLETE'));assert.equal(calls.at(-1),true);
  });
});
test('exact native proof never excuses an invalid supplied key, enum or value',async t=>{
  const cases=[['unknown PT',{problemTypeKey:'UNKNOWN'}],['unknown TPL',{templateKey:'UNKNOWN'}],
    ['unknown CC',{crossConceptKeys:['CC_UNKNOWN']}],['unknown condition',{conditionKeys:['COND_UNKNOWN']}],
    ['invalid integration',{integrationPattern:'INVALID'}],['invalid difficulty confidence',{difficultyConfidence:'INVALID'}],
    ['invalid boundary',{difficultyBoundaryFlag:'INVALID'}],['invalid legacy compatibility',{legacyLevelCompatibility:'INVALID'}]];
  for(const [name,questionOverrides] of cases)await t.test(name,t=>{
    // The source/current/receipt all contain the same invalid value. Rejection
    // must come from the official ACTIVE field validator, not a stale fixture.
    const f=nativeReviewFixture(t,{questionOverrides,officialValidator:true}),r=planQuestion(f);
    assert.equal(r.status,'SUPPLEMENT_PENDING');assert.equal(r.nativeReviewReceipt,undefined);assert.equal(r.final,undefined);
  });
});
test('native reuse retains ACTIVE, exact binding, owner and source-rationale guards',async t=>{
  const cases=[
    ['inactive registry',f=>{f.registry.status='UNAVAILABLE';}],
    ['inactive PT',f=>{f.registry.problemTypes.get('PT_ROOT').status='INACTIVE';}],
    ['inactive TPL',f=>{f.registry.templates.get('TPL_ROOT').status='INACTIVE';}],
    ['inactive pack',f=>{f.registry.activePacks.get('MIDDLE3').status='INACTIVE';}],
    ['inactive binding',f=>{f.registry.bindingRows[0].status='INACTIVE';}],
    ['wrong exact course',f=>{f.registry.bindingRows[0].standardCourse='다른 과정';}],
    ['ambiguous exact binding',f=>{f.registry.bindingRows.push({...f.registry.bindingRows[0]});}],
    ['wrong template owner',f=>{f.registry.templates.get('TPL_ROOT').ownerPack='OTHER';}],
    ['wrong binding owner',f=>{f.registry.bindingRows[0].ownerPack='OTHER';}],
    ['wrong runtime owner',f=>{f.runtimeOwner='OTHER';}],
  ];
  for(const [name,mutate] of cases)await t.test(name,t=>{
    const f=nativeReviewFixture(t,{officialValidator:true});mutate(f);const r=planQuestion(f);
    assert.equal(r.status,'SUPPLEMENT_PENDING');assert.equal(r.nativeReviewReceipt,undefined);assert.equal(r.final,undefined);
  });
  await t.test('missing rationale in exact current receipt',t=>{
    const f=nativeReviewFixture(t,{omitFields:['decisiveStep'],officialValidator:true}),r=planQuestion(f);
    assert.deepEqual(r.reasons,['SOURCE_SEMANTIC_RATIONALE_MISSING']);assert.equal(r.nativeReviewReceipt,undefined);
  });
});
test('student content changes invalidate old independent review, not other rows',()=>{const f=fixture();f.previous=structuredClone(f.question);f.question.content='new question';f.identity.sourceFingerprint=sourceFingerprint(f.question);f.current.reviewStatus='reviewed_pass';const r=planQuestion(f);assert.equal(r.status,'APPLY');assert.equal(r.coreChanged,true);assert.equal(r.final.reviewStatus,'review_required');});
test('a repeated identical input does not create duplicate registration',()=>{const f=fixture(),one=planQuestion(f);const two=planQuestion({...f,current:one.final,priorReceipt:{inputHash:one.inputHash,metadataRegistrationStatus:'REGISTERED'}});assert.equal(two.status,'ALREADY_REGISTERED');});
test('path traversal, absolute paths and controls are refused',()=>{for(const s of ['../escape.js','/root.js','a/../b.js','a\\b.js','a\0.js'])assert.throws(()=>sourcePath(s));});
test('source evaluation supports native schemas and is time-bounded',()=>{assert.equal(loadBank('window.questionBank=[{id:1}];').length,1);assert.throws(()=>loadBank('window.questionBank=[];'));assert.throws(()=>loadBank('process.exit(0);'));});
function gitFixture(fn) {const dir=fs.mkdtempSync(path.join(os.tmpdir(),'auto-meta-test-'));const git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();try{git('init','-q');git('config','user.email','test@example.invalid');git('config','user.name','fixture');const file=path.join(dir,'archive/exams',source);fs.mkdirSync(path.dirname(file),{recursive:true});const put=b=>fs.writeFileSync(file,'window.questionBank='+JSON.stringify(b)+';\n');const commit=()=>{git('add','.');git('commit','-qm','fixture');return git('rev-parse','HEAD');};fn({dir,git,put,commit});}finally{fs.rmSync(dir,{recursive:true,force:true});}}
test('missed push events are caught up from durable cursor; only changed ordinal selected',()=>gitFixture(({dir,put,commit})=>{put([{id:1,a:1},{id:2,a:1}]);const base=commit();put([{id:1,a:2},{id:2,a:1}]);commit();put([{id:1,a:3},{id:2,a:1}]);const head=commit();const targets=selectTargets(dir,{lastProcessedCommit:base},{bootstrapBase:base},head);assert.equal(targets.length,1);assert.equal(targets[0][1].sourceOrdinal,1);}));
test('pending work survives a newer cursor and completed pilots are not replayed',()=>gitFixture(({dir,put,commit})=>{put([{id:1}]);const head=commit(),key=source+'#1';const targets=selectTargets(dir,{lastProcessedCommit:head,pending:{[key]:{sourceArchiveFile:source,sourceOrdinal:1,baseCommit:head}},completedPilots:[key]},{bootstrapBase:head,pilotTargets:[{sourceArchiveFile:source,sourceOrdinal:1}]},head);assert.equal(targets.length,1);}));
test('derived-only commits do not select the whole archive',()=>gitFixture(({dir,put,commit})=>{put([{id:1}]);const base=commit();fs.writeFileSync(path.join(dir,'derived.json'),'{}');const head=commit();assert.equal(selectTargets(dir,{lastProcessedCommit:base},{bootstrapBase:base},head).length,0);}));
test('reordering cannot reuse another ordinal identity',()=>{const f=fixture();f.previous.id=2;assert.deepEqual(planQuestion(f).reasons,['SOURCE_ORDINAL_CHANGED']);});
test('explicit source hold is never auto released',()=>{const f=fixture();f.current.metadataStatus='SOURCE_HOLD';assert.deepEqual(planQuestion(f).reasons,['EXPLICIT_SOURCE_HOLD']);});
test('competing approved values cannot be overwritten by a stale source base',()=>{const f=fixture();f.current.reviewStatus='reviewed_pass';f.current.problemTypeKey='OTHER_REVIEWED_PT';assert.deepEqual(planQuestion(f).reasons,['FIELD_AUTHORITY_CONFLICT:problemTypeKey']);});
test('unchanged difficulty approval survives a PT correction',()=>{const f=fixture();f.current.fieldStatus.difficulty='approved_review2';assert.equal(planQuestion(f).final.fieldStatus.difficulty,'approved_review2');});
test('solution change preserves metadata provenance but does not inherit math QA',()=>{const f=fixture();f.previous=structuredClone(f.question);f.question.solution='revised explanation';f.identity.sourceFingerprint=sourceFingerprint(f.question);f.current.problemTypeKey='PT_ROOT';f.current.templateKey='TPL_ROOT';f.current.metadataApprovalType='REVIEW2';f.current.reviewStatus='reviewed_pass';f.current.independentMathReviewStatus='PASS';const r=planQuestion(f);assert.equal(r.status,'APPLY');assert.equal(r.preserveReview,true);assert.equal(r.final.metadataApprovalType,'REVIEW2');assert.equal(r.final.independentMathReviewStatus,'NOT_PERFORMED_BY_AUTO_REGISTRAR');});
test('selector does not mutate the persisted pending snapshot',()=>gitFixture(({dir,put,commit})=>{put([{id:1}]);const h=commit(),key=source+'#1';const state={lastProcessedCommit:h,pending:{[key]:{sourceArchiveFile:source,sourceOrdinal:1,baseCommit:h}}};const t=selectTargets(dir,state,{bootstrapBase:h},h);t[0][1].attemptSignature='changed';assert.equal(state.pending[key].attemptSignature,undefined);}));
const hasRegistry=fs.existsSync(path.join(root,'archive/data/meta-foundation/canonical/registry_index.json'));
test('pinned DongSan source validates through the official registry and planner',{skip:!hasRegistry},async()=>{
  const {loadActiveMetaRegistry,validateActiveMetaFields}=await import('../archive/tools/meta-foundation/active-registry.mjs');
  const file='original/middle/m3/1mid/22_동산중_1학기_중간_중3_기출.js';
  const src=execFileSync('git',['show','b8e08d57fd0aa07a02e7f3b916bd3043ed995683:archive/exams/'+file],{cwd:root,encoding:'utf8'});
  const q=loadBank(src)[0],reg=loadActiveMetaRegistry(root);assert.equal(reg.status,'ACTIVE',reg.errors.join('\n'));
  const v=validateActiveMetaFields(q,reg,{requireFields:true});assert.equal(v.status,'VALIDATED',v.errors.join('\n'));assert.equal(v.activeBinding,true);assert.equal(v.difficultyComplete,true);
  const previous={...q,problemTypeKey:null,templateKey:null};
  const current={...previous,questionUid:uid,sourceArchiveFile:file,sourceOrdinal:1,sourceFingerprint:sourceFingerprint(q)};
  const identity={questionUid:uid,sourceArchiveFile:file,sourceOrdinal:1,status:'VERIFIED',sourceFingerprint:sourceFingerprint(q)};
  const r=planQuestion({question:q,previous,current,identity,registry:reg,validate:validateActiveMetaFields,source:file,ordinal:1});
  assert.equal(r.status,'APPLY',JSON.stringify(r));assert.equal(r.final.problemTypeKey,'PT_M3_SQUARE_ROOT_PROPERTY');assert.equal(r.final.templateKey,'TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT');
});

function reviewedFigureNativeFixture(t,{form='image',mutateCurrent,mutatePending,mutateIndependent,mutateRenderer,mutateNative,nestedDependency=false,genericReview=false,completeFields=false}={}) {
  const f=partialNativeReviewFixture(t,{completeFields}),dir=f.nativeSource.root;
  const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
  const blob=v=>crypto.createHash('sha1').update(`blob ${v.length}\0`).update(v).digest('hex');
  const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
  const put=(rel,value)=>{const full=path.join(dir,rel);fs.mkdirSync(path.dirname(full),{recursive:true});
    fs.writeFileSync(full,Buffer.isBuffer(value)||typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
  const git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const commit=()=>{git('add','.');git('-c','user.name=Fixture reviewer','-c','user.email=fixture@example.invalid','commit','-qm','Exact figure evidence');return git('rev-parse','HEAD');};
  const sourcePath='archive/exams/'+source,oldAsset='archive/assets/old-problem.svg',newAsset='archive/assets/current-problem.svg',solutionAsset='archive/assets/current-solution.svg';
  const svg='<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 0 L0 10Z"/></svg>\n';
  const before=structuredClone(f.question);
  if(form==='html')before.content='question<br><img src="assets/old-problem.svg" />';
  else if(form==='image')before.image='assets/old-problem.svg';
  const semantic=Object.fromEntries(['standardCourse','standardUnitKey','subUnitKey','curriculum','problemTypeKey','templateKey',
    'crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','level','primaryMethod','decisiveStep'].map(k=>[k,before[k]]));
  const beforeBank=structuredClone(f.nativeSource.bank);beforeBank[f.ordinal-1]=before;
  const beforeBytes=Buffer.from('window.questionBank='+JSON.stringify(beforeBank)+';\n');
  put(sourcePath,beforeBytes);if(form!=='solution')put(oldAsset,svg);
  const originalRows=f.allRecords.map(r=>({ordinal:r.sourceOrdinal,questionUid:r.questionUid,decision:'KEEP',after:r.questionUid===uid?semantic:{},decisiveStep:'reviewed original decision'}));
  const nativePath='review/original-native.json',native={schemaVersion:'m3-s2-complete-semantic-review-v1',sourceArchiveFile:source,
    questionCount:3,author:'original-native-reviewer',rootIntegrator:'integrator',sourceAfterBlob:blob(beforeBytes),sourceAfterSha256:sha(beforeBytes),items:originalRows};
  mutateNative?.(native);put(nativePath,native);
  const pendingPath='.archive-meta-register/inbox/original-pending.json',pending={requestId:f.receipt.requestId,
    schemaVersion:'archive-reviewed-exam-meta-register-request-v2',scope:'PARTIAL_UIDS',sourceArchiveFile:source,expectedQuestionCount:3,
    expectedSourceBlobSha1:blob(beforeBytes),approval:{type:'FINAL_QA',metadataReviewed:true},
    items:[{questionUid:uid,sourceOrdinal:3,after:{...semantic,sourceFingerprint:sourceFingerprint(before),contentFingerprint:contentFingerprint(before)}}]};
  mutatePending?.(pending);put(pendingPath,pending);git('init','-q');const previousCommit=commit();
  const q=structuredClone(before);
  if(form==='html')q.content='question<br><img src="assets/current-problem.svg" />';
  else if(form==='image')q.image='assets/current-problem.svg';
  Object.assign(q,{solutionImage:'assets/current-solution.svg',solutionImageAlt:'The original triangle with matching side labels.',
    solutionImageCaption:'The reviewed relation remains unchanged.',solutionImageSize:'full',layoutTag:'fullwidth'});
  mutateCurrent?.(q);f.question=q;f.previous=structuredClone(before);
  f.nativeSource.bank=structuredClone(beforeBank);f.nativeSource.bank[2]=structuredClone(q);
  f.nativeSource.bytes=Buffer.from('window.questionBank='+JSON.stringify(f.nativeSource.bank)+';\n');f.nativeSource.blobSha1=blob(f.nativeSource.bytes);
  put(sourcePath,f.nativeSource.bytes);
  if(form!=='solution')put(newAsset,svg);
  put(solutionAsset,nestedDependency?svg.replace('</svg>','<image href="other.svg"/></svg>'):svg);
  const currentCommit=commit();
  const asset=p=>{const bytes=fs.readFileSync(path.join(dir,p));return {path:p,gitBlobSha:blob(bytes),rawSha256:sha(bytes)};};
  const beforeAssets=form==='solution'?[]:[asset(oldAsset)],currentAssets=[...(form==='solution'?[]:[asset(newAsset)]),asset(solutionAsset)];
  const currentHash=sha(JSON.stringify(q)),beforeHash=sha(JSON.stringify(before));
  const changed=[...new Set([...Object.keys(before),...Object.keys(q)])].filter(k=>JSON.stringify(before[k]??null)!==JSON.stringify(q[k]??null));
  const independentPath='review/independent-figure.json',independent={schemaVersion:'archive-narrow-current-renderer-independent-review-v1',
    reviewer:'independent-figure-reviewer',sourceCommit:currentCommit,priorSourceCommit:previousCommit,sourcePath,
    sourceBeforeGitBlobSha:blob(beforeBytes),sourceCurrentGitBlobSha:f.nativeSource.blobSha1,
    sourceBeforeSha256:sha(beforeBytes),sourceCurrentSha256:sha(f.nativeSource.bytes),examId:'E001',selectedUidCount:1,
    fullMathematicalQa:false,newReviewPassCount:0,newDifficultyJudgments:0,newMetadataApprovals:0,status:'PASS_NARROW_FIGURE_CONTINUITY',
    rows:[{ordinal:3,questionUid:uid,beforeQuestionSha256:beforeHash,currentQuestionSha256:currentHash,
      status:'PASS_NARROW_FIGURE_CONTINUITY',stemChoicesAnswerSolutionUnchanged:true,acceptedMethodAndDifficultyUnchanged:true,
      newAnswerLeak:false,beforeAssets,currentAssets}]};
  mutateIndependent?.(independent);put(independentPath,independent);
  const rendererPath='review/renderer-assets.json',renderer={schemaVersion:'archive-pending-current-renderer-asset-binding-v1',
    beforeCommit:previousCommit,currentCommit,changedSelectedUidCount:1,otherSelectedAssetChanges:0,
    rows:[{examId:'E001',ordinal:3,questionUid:uid,sourcePath,beforeAssets,currentAssets}]};
  mutateRenderer?.(renderer);put(rendererPath,renderer);
  const ref=p=>({path:p,sha256:sha(fs.readFileSync(path.join(dir,p)))});
  const reviewPath='review/current-figure.json',rows=structuredClone(originalRows);
  Object.assign(rows[2],{decision:'KEEP',inheritedSemanticDecision:'KEEP',after:semantic,
    currentQuestionSha256:currentHash,previousQuestionSha256:beforeHash,changedProtectedFields:changed.filter(k=>REASSESSED_STUDENT_FIELDS.includes(k)),
    independentReviewRef:ref(independentPath),independentReviewer:'independent-figure-reviewer',independentFinding:'Exact diagram continuity checked.',
    fullMathematicalQa:false,newReviewPassCount:0,newDifficultyJudgments:0,semanticAfterValuesUnchangedFromPendingRequest:true});
  const review={schemaVersion:'m3-s2-complete-semantic-review-v1',reviewScope:genericReview?undefined:'NARROW_CURRENT_FIGURE_CONTINUITY_ONLY',examId:'E001',
    author:'current-figure-integrator',rootIntegrator:'root',sourceArchiveFile:source,sourceAfterBlob:f.nativeSource.blobSha1,
    sourceAfterSha256:sha(f.nativeSource.bytes),currentSourceCommit:currentCommit,previousSourceCommit:previousCommit,
    questionCount:3,selectedUidCount:1,fullMathematicalQa:false,newReviewPassCount:0,newDifficultyJudgments:0,
    originalSemanticReview:{commit:previousCommit,path:nativePath,sha256:ref(nativePath).sha256},
    originalPendingRequest:{commit:previousCommit,path:pendingPath,sha256:ref(pendingPath).sha256,gitBlobSha:git('rev-parse',previousCommit+':'+pendingPath)},
    independentReviewRefs:[ref(independentPath)],rendererAssetBindingRef:ref(rendererPath),meaningAndDifficultyReusedWithoutChanges:true,items:rows};
  put(reviewPath,review);const reviewCommit=commit();
  const fp=sourceFingerprint(q),cf=contentFingerprint(q);
  Object.assign(f.current,q,{sourceFingerprint:fp,contentFingerprint:cf});f.identity.sourceFingerprint=fp;
  const idRecord=f.nativeSource.identityByJoin.get(source+'#3');idRecord.sourceFingerprint=fp;
  for(const records of [f.receipt.appliedRecords,f.receipt.runtimeRecords]){
    const i=records.findIndex(r=>r.questionUid===uid);records[i]={...records[i],...structuredClone(f.current)};
    if(records===f.receipt.runtimeRecords)records[i].approvedSourceFingerprint=fp;
  }
  f.receipt.appliedIdentityRecords.find(r=>r.questionUid===uid).sourceFingerprint=fp;
  f.nativeSource.runtimeRecord=structuredClone(f.receipt.runtimeRecords.find(r=>r.questionUid===uid));
  Object.assign(f.receipt,{sourceBlobSha1:f.nativeSource.blobSha1,sourceRawSha256:sha(f.nativeSource.bytes)});
  f.receipt.approval.evidenceRefs.push(ref(reviewPath),ref(independentPath),ref(rendererPath));
  const after={sourceFingerprint:fp,contentFingerprint:cf};
  const proof=validateReviewedSourceReassessment({root:dir,request:{scope:'PARTIAL_UIDS',approval:f.receipt.approval,
      sourceArchiveFile:source,expectedQuestionCount:3},patch:{questionUid:uid,sourceOrdinal:3,after,
      sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit,reviewPath,reviewRef:ref(reviewPath)},
      evidenceRefs:f.receipt.approval.evidenceRefs},metadata:f.current,question:q,final:f.current});
  f.receipt.fingerprintRepairs=[{questionUid:uid,sourceOrdinal:3,metadataBefore:{sourceFingerprint:sourceFingerprint(before),contentFingerprint:contentFingerprint(before)},
    identityBefore:{sourceFingerprint:sourceFingerprint(before)},after,sourceReview:proof}];
  f.saveReceipt();delete f.registry.bindingRows[0].L1;delete f.registry.bindingRows[0].L2;
  return {...f,put,git,sha,stable,review,independent,renderer,reviewPath,independentPath,rendererPath,newAsset,solutionAsset,
    verifyFigure:()=>nativeReviewedFigureRebind(f.receipt,f.nativeSource,f.previous,f.question,f.identity,f.ordinal,f.current)};
}

for(const form of ['image','html','solution'])test('exact current figure native receipt survives an old cursor without new approval: '+form,t=>{
  const f=reviewedFigureNativeFixture(t,{form}),before=JSON.stringify({current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,question:f.question,receipt:f.receipt});
  assert.equal(f.verifyFigure(),true);const result=planQuestion(f);
  assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,f.receiptPath);assert.equal(result.final,undefined);
  assert.equal(JSON.stringify({current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,question:f.question,receipt:f.receipt}),before);
  f.previous=structuredClone(f.question);assert.equal(planQuestion(f).status,'ALREADY_REGISTERED','a caught-up cursor still verifies the same reviewed assets');
  fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- later unreviewed asset -->');
  assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED','a warmed cache and unchanged cursor must not hide changed current asset bytes');
});

test('current figure reuse rejects meaning changes even when current Git, native review and hashes are truthful',async t=>{
  for(const [name,mutateCurrent] of [
    ['stem',q=>{q.content+=' changed mathematical condition';}],['choices',q=>{q.choices=['new','choice'];}],
    ['answer',q=>{q.answer='b';}],['solution',q=>{q.solution+=' unreviewed reasoning';}],
    ['question alias',q=>{q.question='new alias';}],['score',q=>{q.score=7;}],
    ['unreviewed HTML attribute',q=>{q.content=q.content.replace(' />',' alt="answer a" />');}],
  ])await t.test(name,t=>{const f=reviewedFigureNativeFixture(t,{form:'html',mutateCurrent});
    assert.throws(()=>f.verifyFigure(),/non-figure source content or meaning changed/);
    assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');});
});

test('current figure reuse rejects SHA-bound but incorrect original, independent or renderer claims',async t=>{
  const cases=[
    ['pending semantics differ',{mutatePending:p=>{p.items[0].after.crossConceptKeys=['CC_UNREVIEWED'];}},/semantic or difficulty values changed/],
    ['independent HOLD',{mutateIndependent:p=>{p.rows[0].status='HOLD';}},/not an exact narrow PASS/],
    ['independent wrong UID',{mutateIndependent:p=>{p.rows[0].questionUid='other';}},/UID\/ordinal/],
    ['independent wrong ordinal',{mutateIndependent:p=>{p.rows[0].ordinal=2;}},/UID\/ordinal/],
    ['independent duplicate UID',{mutateIndependent:p=>{p.rows.push(structuredClone(p.rows[0]));}},/UID\/ordinal/],
    ['independent question hash',{mutateIndependent:p=>{p.rows[0].beforeQuestionSha256='0'.repeat(64);}},/not an exact narrow PASS/],
    ['independent new difficulty',{mutateIndependent:p=>{p.newDifficultyJudgments=1;}},/not an exact narrow PASS/],
    ['independent answer leak',{mutateIndependent:p=>{p.rows[0].newAnswerLeak=true;}},/not an exact narrow PASS/],
    ['renderer inventory omitted',{mutateRenderer:p=>{p.rows[0].currentAssets=[];}},/renderer inventory mismatch/],
    ['renderer wrong source',{mutateRenderer:p=>{p.rows[0].sourcePath='archive/exams/other.js';}},/renderer inventory mismatch/],
    ['nested SVG dependency',{nestedDependency:true},/nested SVG renderer dependency/],
  ];
  for(const [name,options,error]of cases)await t.test(name,t=>{const f=reviewedFigureNativeFixture(t,options);
    assert.throws(()=>f.verifyFigure(),error);assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');});
});

test('current figure reuse preserves existing exact receipt, old cursor, identity and runtime guards',async t=>{
  const cases=[
    ['no sourceReview',f=>{delete f.receipt.fingerprintRepairs[0].sourceReview;}],
    ['old cursor changed',f=>{f.previous.answer='different';}],
    ['old metadata fingerprint',f=>{f.receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint='0'.repeat(64);}],
    ['old identity fingerprint',f=>{f.receipt.fingerprintRepairs[0].identityBefore.sourceFingerprint='0'.repeat(64);}],
    ['old body fingerprint',f=>{f.receipt.fingerprintRepairs[0].metadataBefore.contentFingerprint='0'.repeat(64);}],
    ['duplicate current review',f=>{f.receipt.fingerprintRepairs.push(structuredClone(f.receipt.fingerprintRepairs[0]));}],
    ['missing review commit',f=>{f.receipt.fingerprintRepairs[0].sourceReview.reviewCommit='0'.repeat(40);}],
    ['wrong review UID',f=>{f.receipt.fingerprintRepairs[0].sourceReview.questionUid='other';}],
    ['wrong proof payload hash',f=>{f.receipt.fingerprintRepairs[0].sourceReview.studentPayloadSha256='0'.repeat(64);}],
    ['unbound independent proof',f=>{f.receipt.approval.evidenceRefs=f.receipt.approval.evidenceRefs.filter(r=>r.path!==f.independentPath);}],
    ['changed independent bytes',f=>{fs.appendFileSync(path.join(f.nativeSource.root,f.independentPath),' ');}],
    ['changed renderer bytes',f=>{fs.appendFileSync(path.join(f.nativeSource.root,f.rendererPath),' ');}],
    ['changed source bytes',f=>{f.nativeSource.bytes=Buffer.concat([f.nativeSource.bytes,Buffer.from(' ')]);}],
    ['changed current metadata',f=>{f.current.fieldStatus.problemType='manual_review_pending';}],
    ['changed runtime',f=>{f.nativeSource.runtimeRecord.approvedSourceFingerprint='0'.repeat(64);}],
    ['changed identity',f=>{f.identity.sourceFingerprint='0'.repeat(64);}],
  ];
  for(const [name,mutate]of cases)await t.test(name,t=>{const f=reviewedFigureNativeFixture(t);
    assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');mutate(f);f.saveReceipt();
    assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');});
});

test('current figure scope/schema flags cannot forge an unchanged-cursor fallback with fresh local hashes',async t=>{
  for(const [name,mutate]of [
    ['local scope removed',(doc,proof)=>{delete doc.reviewScope;}],
    ['local scope generic',(doc,proof)=>{doc.reviewScope='ORDINARY_SEMANTIC_REVIEW';}],
    ['receipt native schema changed',(doc,proof)=>{proof.nativeSchemaVersion='m2-s1-meta-review-v1';}],
    ['both local and receipt native schema changed',(doc,proof)=>{doc.schemaVersion='m2-s1-meta-review-v1';proof.nativeSchemaVersion=doc.schemaVersion;}],
    ['scope and schema removed together',(doc,proof)=>{delete doc.reviewScope;doc.schemaVersion='m2-s2-meta-review-v1';proof.nativeSchemaVersion=doc.schemaVersion;}],
  ])await t.test(name,t=>{
    const f=reviewedFigureNativeFixture(t);f.previous=structuredClone(f.question);
    assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');
    const proof=f.receipt.fingerprintRepairs[0].sourceReview,doc=structuredClone(f.review);mutate(doc,proof);
    f.put(f.reviewPath,doc);const newSha=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.reviewPath)));
    proof.reviewRef.sha256=newSha;
    f.receipt.approval.evidenceRefs.find(r=>r.path===f.reviewPath).sha256=newSha;
    f.saveReceipt();assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');
  });
});

test('ordinary Git-bound source reviews retain their unchanged-cursor path and local-copy layout',t=>{
  const f=reviewedFigureNativeFixture(t,{genericReview:true});
  f.previous=structuredClone(f.question);
  assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');
  const proof=f.receipt.fingerprintRepairs[0].sourceReview,localCopy='review/native-copy.json';
  f.put(localCopy,fs.readFileSync(path.join(f.nativeSource.root,f.reviewPath)));
  const copiedRef={path:localCopy,sha256:proof.reviewRef.sha256};
  proof.reviewRef=copiedRef;f.receipt.approval.evidenceRefs.push(copiedRef);f.saveReceipt();
  assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');
});

function ordinaryReassessmentWithPriorFixture(t) {
  const f=reviewedFigureNativeFixture(t,{genericReview:true,completeFields:true}),dir=f.nativeSource.root;
  const previousBytes=execFileSync('git',['show',f.review.previousSourceCommit+':archive/exams/'+source],{cwd:dir});
  const previousBank=loadBank(previousBytes.toString('utf8'));
  const priorId='prior-approved-native-review',priorPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+priorId+'.json';
  const prior=structuredClone(f.receipt);
  const stripStudent=row=>Object.fromEntries(Object.entries(row).filter(([key])=>
    !REASSESSED_STUDENT_FIELDS.includes(key)||['questionUid','sourceOrdinal','sourceQuestionNo'].includes(key)));
  for(const key of ['appliedRecords','runtimeRecords'])f.receipt[key]=f.receipt[key].map(stripStudent);
  const beforeRow=row=>{
    const q=previousBank[row.sourceOrdinal-1];
    return {...stripStudent(row),sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q),
      ...(Object.hasOwn(row,'approvedSourceFingerprint')?{approvedSourceFingerprint:sourceFingerprint(q)}:{}),
      metadataRevision:`meta-foundation:MIDDLE3@1.0.0:exam-final_qa-v2:${priorId}`,approvalEvidence:[priorPath]};
  };
  Object.assign(prior,{requestId:priorId,requestSha256:f.sha(priorId),sourceBlobSha1:f.git('rev-parse',f.review.previousSourceCommit+':archive/exams/'+source),
    sourceRawSha256:f.sha(previousBytes),fingerprintRepairs:[],approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'prior-reviewer',
      evidenceRefs:[structuredClone(f.receipt.approval.evidenceRefs[0])]},appliedRecords:prior.appliedRecords.map(beforeRow),runtimeRecords:prior.runtimeRecords.map(beforeRow),
    appliedIdentityRecords:prior.appliedIdentityRecords.map(row=>({...row,sourceFingerprint:sourceFingerprint(previousBank[row.sourceOrdinal-1])}))});
  f.put(priorPath,prior);
  const nextId='ordinary-reassessment-with-prior',nextPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+nextId+'.json';
  const updated=row=>({...row,metadataRevision:`meta-foundation:MIDDLE3@1.0.0:exam-final_qa-v2:${nextId}`,approvalEvidence:[priorPath,nextPath]});
  Object.assign(f.receipt,{requestId:nextId,requestSha256:f.sha(nextId),partialUidCount:1,totalQuestions:1,
    appliedRecords:f.receipt.appliedRecords.filter(row=>row.questionUid===uid).map(updated),
    runtimeRecords:f.receipt.runtimeRecords.filter(row=>row.questionUid===uid).map(updated),
    appliedIdentityRecords:f.receipt.appliedIdentityRecords.filter(row=>row.questionUid===uid)});
  f.receipt.approval.evidenceRefs.push({path:priorPath,sha256:f.sha(fs.readFileSync(path.join(dir,priorPath)))});
  f.current=f.receipt.appliedRecords[0];f.nativeSource.runtimeRecord=f.receipt.runtimeRecords[0];
  f.identity=f.receipt.appliedIdentityRecords[0];f.previous=structuredClone(f.question);
  f.registry.bindingRows[0].L1='Numbers';f.registry.bindingRows[0].L2='Roots';
  f.receiptPath=nextPath;f.saveReceipt=()=>f.put(nextPath,f.receipt);f.saveReceipt();
  return {...f,priorNativeReceipt:prior,priorNativePath:priorPath};
}

test('geometry native verifier accepts a fingerprint reassessment citing its prior FINAL_QA receipt',t=>{
  const f=ordinaryReassessmentWithPriorFixture(t),before=JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.receipt]);
  assert.equal(planQuestion({...f,nativeSource:undefined}).status,'APPLY','ordinary producer could otherwise overwrite the native revision');
  const check=validateActiveMetaFields(f.current,f.registry,{requireFields:false});
  const context=activeBindingContext({candidate:f.current,check,registry:f.registry,runtimeOwner:'MIDDLE3'});
  assert.equal(context.reason,undefined);
  assert.equal(nativeReviewReceipt({...f,pt:context.pt,tpl:context.tpl,ownerPack:context.ownerPack}),f.receiptPath);
  const result=planQuestion(f);assert.equal(result.status,'ALREADY_REGISTERED');assert.equal(result.nativeReviewReceipt,f.receiptPath);
  assert.equal(result.final,undefined);assert.equal(JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.receipt]),before);
});

for(const [name,change]of [
  ['missing selected repair',f=>{f.receipt.fingerprintRepairs=[];}],
  ['a repair marker without native review',f=>{delete f.receipt.fingerprintRepairs[0].sourceReview;}],
  ['a fabricated native review marker',f=>{f.receipt.fingerprintRepairs[0].sourceReview={schemaVersion:'archive-reviewed-source-reassessment-v1'};}],
  ['wrong immutable review commit',f=>{f.receipt.fingerprintRepairs[0].sourceReview.reviewCommit='0'.repeat(40);}],
  ['changed saved review payload proof',f=>{f.receipt.fingerprintRepairs[0].sourceReview.studentPayloadSha256='0'.repeat(64);}],
  ['missing current review evidence',f=>{fs.unlinkSync(path.join(f.nativeSource.root,f.reviewPath));}],
  ['locally rebound review outside its Git commit',f=>{
    const doc=structuredClone(f.review);doc.author='unapproved replacement';f.put(f.reviewPath,doc);
    const digest=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.reviewPath)));
    f.receipt.fingerprintRepairs[0].sourceReview.reviewRef.sha256=digest;
    f.receipt.approval.evidenceRefs.find(ref=>ref.path===f.reviewPath).sha256=digest;
  }],
  ['wrong prior metadata fingerprint',f=>{f.receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint='0'.repeat(64);}],
  ['wrong prior identity fingerprint',f=>{f.receipt.fingerprintRepairs[0].identityBefore.sourceFingerprint='0'.repeat(64);}],
  ['wrong current repair fingerprint',f=>{f.receipt.fingerprintRepairs[0].after.contentFingerprint='0'.repeat(64);}],
  ['a new metadata field hidden in fingerprint repair',f=>{f.receipt.fingerprintRepairs[0].after.problemTypeKey='PT_ROOT';}],
  ['a source-only marker with ordinary review',f=>{f.receipt.approval.sourceRebind={};}],
  ['source-only count markers with ordinary review',f=>{f.receipt.newMetadataApprovals=0;f.receipt.preservedMetadataApprovals=1;}],
  ['changed existing approval status',f=>{f.current.fieldStatus.problemType='review_required';f.nativeSource.runtimeRecord.fieldStatus.problemType='review_required';}],
  ['changed identity foreign field',f=>{f.identity.unreviewedField='changed';}],
  ['changed runtime readiness',f=>{f.nativeSource.runtimeRecord.runtimeSelectable=!f.nativeSource.runtimeRecord.runtimeSelectable;}],
])test('ordinary reassessment with prior evidence refuses '+name+' without producer fallback',t=>{
  const f=ordinaryReassessmentWithPriorFixture(t);assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  change(f);f.saveReceipt();
  const out=planQuestion(f);assert.equal(out.status,'SUPPLEMENT_PENDING');assert.equal(out.nativeReviewReceipt,undefined);assert.equal(out.final,undefined);
  assert.deepEqual(out.reasons,['NATIVE_SOURCE_PRESERVATION_REVALIDATION_FAILED']);
});

test('a claimed current figure row cannot drop its repair after the cursor catches up',async t=>{
  for(const [name,change]of [
    ['sourceReview removed',f=>{delete f.receipt.fingerprintRepairs[0].sourceReview;}],
    ['repair entry removed',f=>{f.receipt.fingerprintRepairs=[];}],
  ])await t.test(name,t=>{const f=reviewedFigureNativeFixture(t);f.previous=structuredClone(f.question);
    assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');change(f);f.saveReceipt();
    assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');});
});

function compoundRendererNativeFixture(t,{form='image',mutateManifest,mutateIndependent,unapprovedNativeDisplayField=false}={}) {
  const f=reviewedFigureNativeFixture(t,{form,mutateNative:unapprovedNativeDisplayField?
    native=>{const r=native.items.find(r=>r.questionUid===uid);r.after={...r.after,standardUnitOrder:17};}:undefined}),dir=f.nativeSource.root;
  const nativeCommit=f.review.previousSourceCommit,currentCommit=f.review.currentSourceCommit;
  const nativePath='review/original-native.json',sourcePath='archive/exams/'+source;
  const ref=p=>({path:p,sha256:f.sha(fs.readFileSync(path.join(dir,p)))});
  const native=JSON.parse(fs.readFileSync(path.join(dir,nativePath))),row=native.items.find(r=>r.questionUid===uid);
  const nativeReviewRef={commit:nativeCommit,path:nativePath,sha256:ref(nativePath).sha256};
  const snapshot=(commit,q)=>{const bytes=Buffer.from(f.git('show',commit+':'+sourcePath)+'\n');
    return {commit,path:sourcePath,gitBlobSha1:f.git('rev-parse',commit+':'+sourcePath),sha256:f.sha(bytes),questionSha256:f.sha(f.stable(q))};};
  const prefigureSourceRef=snapshot(nativeCommit,f.previous),currentSourceRef=snapshot(currentCommit,f.question);
  const assets=(rows,phase,commit)=>rows.map(a=>({phase,commit,path:a.path,gitBlobSha1:a.gitBlobSha,
    sha256:a.rawSha256,visuallyInspected:true}));
  const independentPath='review/compound-independent-renderer.json',manifestPath='review/compound-renderer.json';
  const independent={schemaVersion:'archive-independent-narrow-renderer-review-v1',reviewer:'independent-renderer-reviewer',
    status:'PASS_NARROW_CURRENT_RENDERER_REVIEW',nativeReviewCommit:nativeCommit,currentSourceCommit:currentCommit,
    counts:{newFullMathApprovals:0,newMetadataApprovals:0,newDifficultyApprovals:0},rows:[{
      questionUid:uid,sourceOrdinal:3,decision:'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION',visualInspectionPerformed:true,
      nativeReviewRef,nativeItemCanonicalSha256:f.sha(f.stable(row)),nativeSourceRef:prefigureSourceRef,currentSourceRef,
      previousQuestionSha256:prefigureSourceRef.questionSha256,currentQuestionSha256:currentSourceRef.questionSha256,
      unchangedFields:['content','choices','answer','solution','id','level','difficultyBucket','difficultyConfidence',
        'difficultyBoundaryFlag','legacyLevelCompatibility'],observed:'The rendered triangle preserves the native relation.',
      rendererAssets:[...assets(f.renderer.rows[0].beforeAssets,'native',nativeCommit),
        ...assets(f.renderer.rows[0].currentAssets,'current',currentCommit)]}]};
  mutateIndependent?.(independent);f.put(independentPath,independent);
  const manifest={schemaVersion:'archive-reviewed-renderer-continuity-evidence-v1',
    scope:'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER',sourceArchiveFile:source,expectedQuestionCount:3,
    selectedUidCount:1,newFullMathematicalQa:false,newReviewPassCount:0,newMetadataApprovals:0,newDifficultyJudgments:0,
    items:[{questionUid:uid,sourceOrdinal:3,nativeReviewRef,nativeItemSha256:f.sha(f.stable(row)),
      prefigureSourceRef,currentSourceRef,independentReviewRef:ref(independentPath)}]};
  mutateManifest?.(manifest);f.put(manifestPath,manifest);
  f.git('add','.');f.git('-c','user.name=Fixture reviewer','-c','user.email=fixture@example.invalid','commit','-qm','Compound renderer witness');
  const reviewCommit=f.git('rev-parse','HEAD');
  f.receipt.approval.evidenceRefs=[ref('review/metadata.json'),ref(nativePath),ref(independentPath),ref(manifestPath)];
  const rendererProof={schemaVersion:'archive-reviewed-current-renderer-continuity-v1',reviewCommit,reviewRef:ref(manifestPath)};
  const after={sourceFingerprint:sourceFingerprint(f.question),contentFingerprint:contentFingerprint(f.question)};
  // This receipt repairs a real stale binding, distinct from the prefigure source.
  const metadataBefore={sourceFingerprint:'c'.repeat(64),contentFingerprint:'d'.repeat(64)},identityBefore={sourceFingerprint:'e'.repeat(64)};
  const sourceReview=validateReviewedSourceReassessment({root:dir,request:{scope:'PARTIAL_UIDS',approval:f.receipt.approval,
    sourceArchiveFile:source,expectedQuestionCount:3},patch:{questionUid:uid,sourceOrdinal:3,after,
      sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:nativeCommit,reviewPath:nativePath,
        reviewRef:ref(nativePath),rendererProof},evidenceRefs:f.receipt.approval.evidenceRefs},
    metadata:{...f.current,...metadataBefore},question:f.question,final:f.current,supportedFields:new Set(REVIEWED_META_VALUE_FIELDS)});
  f.receipt.fingerprintRepairs=[{questionUid:uid,sourceOrdinal:3,metadataBefore,identityBefore,after,sourceReview}];
  const bindingPath=reviewedRendererBindingPath(f.receipt.requestId);
  f.current.approvalEvidence=[...f.current.approvalEvidence,bindingPath];
  for(const records of [f.receipt.appliedRecords,f.receipt.runtimeRecords])
    records.find(r=>r.questionUid===uid).approvalEvidence=structuredClone(f.current.approvalEvidence);
  f.nativeSource.runtimeRecord=structuredClone(f.receipt.runtimeRecords.find(r=>r.questionUid===uid));
  const binding=buildReviewedRendererBinding(f.receipt);
  f.put(bindingPath,binding);f.receipt.outputDigests=[...(f.receipt.outputDigests||[]),ref(bindingPath)];
  f.saveReceipt();
  return {...f,bindingPath,compoundBinding:binding,compoundManifest:manifest,compoundManifestPath:manifestPath,compoundIndependentPath:independentPath,
    verifyCompound:()=>nativeReviewedRendererRebind(f.receipt,f.nativeSource,f.previous,f.question,f.identity,f.ordinal,f.current,f.registry)};
}

for(const form of ['image','html','solution'])test('compound native renderer proof keeps stale bindings distinct and reuses the original approval: '+form,t=>{
  const f=compoundRendererNativeFixture(t,{form});
  assert.notEqual(f.receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint,sourceFingerprint(f.previous));
  assert.notEqual(f.receipt.fingerprintRepairs[0].identityBefore.sourceFingerprint,sourceFingerprint(f.previous));
  const before=JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,receipt:f.receipt});
  assert.equal(f.verifyCompound(),true);
  const result=planQuestion(f);assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
  assert.equal(result.nativeReviewReceipt,f.receiptPath);assert.equal(result.final,undefined);
  assert.equal(JSON.stringify({question:f.question,current:f.current,identity:f.identity,runtime:f.nativeSource.runtimeRecord,receipt:f.receipt}),before);
  f.previous=structuredClone(f.question);assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');
  fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- later unreviewed asset -->');
  assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED','current asset bytes are rechecked after a warm cache and caught-up cursor');
});

test('compound renderer reuse refuses receipt drift and cannot fall back through a caught-up cursor',async t=>{
  for(const [name,change]of [
    ['renderer proof removed',f=>{delete f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;}],
    ['source review removed',f=>{delete f.receipt.fingerprintRepairs[0].sourceReview;}],
    ['selected repair removed',f=>{f.receipt.fingerprintRepairs=[];}],
    ['repair and manifest ref removed together',f=>{f.receipt.fingerprintRepairs=[];
      f.receipt.approval.evidenceRefs=f.receipt.approval.evidenceRefs.filter(r=>r.path!==f.compoundManifestPath);}],
    ['binding file removed',f=>{fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath));}],
    ['binding output digest removed',f=>{f.receipt.outputDigests=[];}],
    ['binding path removed from metadata',f=>{f.current.approvalEvidence=f.current.approvalEvidence.filter(p=>p!==f.bindingPath);}],
    ['duplicate selected repair',f=>{f.receipt.fingerprintRepairs.push(structuredClone(f.receipt.fingerprintRepairs[0]));}],
    ['foreign renderer schema',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.schemaVersion='OTHER';}],
    ['foreign renderer scope',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.scope='OTHER';}],
    ['ordinary full request',f=>{f.receipt.scope='FULL_EXAM';}],
    ['sourceRebind mixed in',f=>{f.receipt.approval.sourceRebind={};}],
    ['rebind mixed in',f=>{f.receipt.fingerprintRepairs[0].rebind={};}],
    ['registration mode mixed in',f=>{f.receipt.registrationMode='IDENTITY_FINGERPRINT_ONLY';}],
    ['proof UID changed',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.questionUid='other';}],
    ['proof ordinal changed',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.sourceOrdinal=1;}],
    ['proof native payload changed',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.nativeStudentPayloadSha256='0'.repeat(64);}],
    ['proof inspected asset changed',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.currentAssets[0].sha256='0'.repeat(64);}],
    ['proof independent reviewer changed',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.reviewer='other';}],
    ['proof new metadata approval',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.newMetadataApprovals=1;}],
    ['fingerprint after changed',f=>{f.receipt.fingerprintRepairs[0].after.sourceFingerprint='0'.repeat(64);}],
    ['stale identity proof missing',f=>{delete f.receipt.fingerprintRepairs[0].identityBefore;}],
    ['stale metadata fingerprint changed',f=>{f.receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint='0'.repeat(64);}],
    ['stale identity fingerprint changed',f=>{f.receipt.fingerprintRepairs[0].identityBefore.sourceFingerprint='0'.repeat(64);}],
    ['source raw changed',f=>{f.nativeSource.bytes=Buffer.concat([f.nativeSource.bytes,Buffer.from('\n')]);}],
    ['current metadata changed',f=>{f.current.crossConceptKeys=['unreviewed'];}],
    ['runtime row changed',f=>{f.nativeSource.runtimeRecord.templateKey='OTHER';}],
  ])await t.test(name,t=>{
    const f=compoundRendererNativeFixture(t);f.previous=structuredClone(f.question);
    assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');change(f);f.saveReceipt();
    assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');
  });
});

test('compound renderer proof remains bound to immutable evidence when local scope/hash claims change',async t=>{
  for(const [name,change]of [
    ['schema and scope changed',doc=>{doc.schemaVersion='ordinary-review';doc.scope='OTHER';}],
    ['schema and scope removed',doc=>{delete doc.schemaVersion;delete doc.scope;}],
    ['selected row removed',doc=>{doc.items=[];doc.selectedUidCount=0;}],
    ['wrong selected ordinal',doc=>{doc.items[0].sourceOrdinal=1;}],
    ['native item changed',doc=>{doc.items[0].nativeItemSha256='0'.repeat(64);}],
  ])await t.test(name,t=>{
    const f=compoundRendererNativeFixture(t);f.previous=structuredClone(f.question);
    const doc=structuredClone(f.compoundManifest);change(doc);f.put(f.compoundManifestPath,doc);
    const ref={path:f.compoundManifestPath,sha256:f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.compoundManifestPath)))};
    f.receipt.approval.evidenceRefs=f.receipt.approval.evidenceRefs.map(r=>r.path===ref.path?ref:r);
    f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.reviewRef=ref;f.saveReceipt();
    assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');
    if(name.startsWith('schema')){
      delete f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;f.saveReceipt();
      assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED','structural evidence detects a missing claimed proof');
    }
  });
});

test('compound renderer native reuse refuses an unrelated actual previous student payload',t=>{
  const f=compoundRendererNativeFixture(t);f.previous.answer='unreviewed previous answer';
  assert.throws(()=>f.verifyCompound(),/previous student payload/);assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');
});

test('compound renderer binding cannot be replaced by a locally rehashed false inventory',t=>{
  const f=compoundRendererNativeFixture(t);f.previous=structuredClone(f.question);
  const binding=structuredClone(f.compoundBinding);binding.requestSha256='0'.repeat(64);f.put(f.bindingPath,binding);
  f.receipt.outputDigests.find(r=>r.path===f.bindingPath).sha256=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.bindingPath)));
  f.saveReceipt();assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');
});

test('compound reuse follows the writer value contract without approving native display-only fields',t=>{
  const f=compoundRendererNativeFixture(t,{unapprovedNativeDisplayField:true});
  assert.equal(f.current.standardUnitOrder,undefined);
  assert.equal(f.verifyCompound(),true);assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');
  assert.equal(f.current.standardUnitOrder,undefined);
});

function typedSourceReviewFixture(t) {
  const f=nativeReviewFixture(t,{ordinal:2,questionOverrides:{id:2,standardCourse:'중2 수학',courseKey:'M2-2',
    standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO'},officialValidator:true});
  const dir=f.nativeSource.root,sha=v=>crypto.createHash('sha256').update(v).digest('hex');
  const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
  const put=(p,v)=>{const full=path.join(dir,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');return{path:p,sha256:sha(fs.readFileSync(full))};};
  const git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');git('config','user.name','Synthetic review');git('config','user.email','synthetic@example.invalid');
  f.source='original/middle/m2/2final/typed-source-fixture.js';
  const owner='MIDDLE_GEOMETRY',packPath='archive/data/meta-foundation/canonical/packs/middle-geometry';
  for(const rows of [f.receipt.appliedRecords,f.receipt.runtimeRecords,f.receipt.appliedIdentityRecords])for(const row of rows){
    row.sourceArchiveFile=f.source;
    if(row.sourceIdentity)row.sourceIdentity=f.source+'#'+row.sourceOrdinal;
    if(row.metaFoundationPackId){row.metaFoundationPackId=owner;row.metadataRevision=`meta-foundation:${owner}@1.0.0:exam-final_qa-v2:${f.receipt.requestId}`;}
  }
  f.current=f.receipt.appliedRecords[1];f.identity=f.receipt.appliedIdentityRecords[1];
  const plainCurrent=f.receipt.appliedRecords[0],plainIdentity=f.receipt.appliedIdentityRecords[0],plainRuntime=f.receipt.runtimeRecords[0];
  f.nativeSource.runtimeRecord=f.receipt.runtimeRecords[1];f.runtimeOwner=owner;
  f.nativeSource.identityByJoin=new Map(f.receipt.appliedIdentityRecords.map(r=>[f.source+'#'+r.sourceOrdinal,r]));
  const pt={problemTypeKey:'PT_ROOT',canonicalLabelKo:'Root',status:'ACTIVE',ownerPack:owner,supportingQuestionUids:[uid]},
    tpl={templateKey:'TPL_ROOT',canonicalLabelKo:'Root test',status:'ACTIVE',ownerPack:owner,parentProblemTypeKey:'PT_ROOT',supportingQuestionUids:[uid]},
    binding={curriculum:'2015',standardCourse:'중2 수학',standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO',problemTypeKey:'PT_ROOT',status:'ACTIVE',ownerPack:owner,L1:'Reviewed RPM parent',L2:'Reviewed RPM middle'};
  const pack={packId:owner,packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:['중2 수학','M2-2']};
  const entries=[put(packPath+'/pack.json',pack),put(packPath+'/taxonomy.json',{problemTypes:[pt],templates:[tpl]}),
    put(packPath+'/bindings.json',{bindings:[binding]}),put(packPath+'/aliases.json',{aliases:[]}),
    put('archive/data/meta-foundation/canonical/condition_registry.json',{conditions:[]})];
  const index={status:'ACTIVE',activePacks:[{id:owner,version:'1.0.0',status:'ACTIVE'}],activeConceptShards:[],canonicalSources:entries,compiledArtifacts:[]};
  put('archive/data/meta-foundation/canonical/registry_index.json',index);
  const master=[{key:'M2-06',keyType:'standardUnitKey',status:'active',labelKo:'도형의 닮음'},
    {key:'M2-06-RATIO',keyType:'subUnitKey',status:'active',parentKey:'M2-06',labelKo:'선분비'}];
  put('archive/data/master_tables/js_archive_tag_master.json',master);
  Object.assign(f.registry,{root:dir,files:{index},problemTypes:new Map([['PT_ROOT',pt]]),templates:new Map([['TPL_ROOT',tpl]]),
    bindingRows:[binding],activePacks:new Map([[owner,index.activePacks[0]]])});
  f.registry.bindings=new Set(['2015\0M2-06\0M2-06-RATIO\0PT_ROOT']);
  const sourcePath='archive/exams/'+f.source,rpmPath='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  put(sourcePath,f.nativeSource.bytes.toString());
  const rpmRef=put(rpmPath,{records:[{id:'M2-RPM-TEST',curriculum:'2015',scope:'M2-2',standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO'}]});
  git('add','.');git('commit','-qm','Synthetic immutable reviewed source');
  const base=git('rev-parse','HEAD'),sourceBlob=git('rev-parse',base+':'+sourcePath);
  const after=Object.fromEntries(REVIEWED_META_VALUE_FIELDS.filter(k=>Object.hasOwn(f.current,k)&&!['problemTypeKey','templateKey'].includes(k)).map(k=>[k,f.current[k]]));
  const native={schemaVersion:'m2-s2-meta-review-v1',sourceArchiveFile:f.source,baseSha:base,sourceGitBlobSha:sourceBlob,owner:'native-reviewer',reviewedQuestionCount:2,
    items:f.receipt.appliedRecords.map(row=>({questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,rpmDecision:'KEEP',rpmRecordId:'M2-RPM-TEST',decisiveStep:f.question.decisiveStep,
      after,proposalRefs:[],registrationDebt:[],fieldReview:{classification:'기존 주유형 유지',binding:'정확한 기존 ACTIVE binding 대조',difficulty:'확정 난도 유지'},
      activeDefinitionMatch:{problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',problemTypeStatus:'ACTIVE',templateStatus:'ACTIVE',templateParent:'PT_ROOT',
        exactBindings:[Object.fromEntries(['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey','status'].map(k=>[k,binding[k]]))]}})),proposals:[]};
  const reviewRef=put('review/native-source.json',native);git('add','.');git('commit','-qm','Synthetic native decision');
  const patch={questionUid:uid,sourceOrdinal:2,before:{problemTypeKey:null,templateKey:null,sourceFingerprint:'b'.repeat(64),contentFingerprint:'c'.repeat(64)},
    after:{problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',sourceFingerprint:sourceFingerprint(f.question),contentFingerprint:contentFingerprint(f.question)},
    identityBefore:{sourceFingerprint:'b'.repeat(64)},evidenceRefs:[reviewRef,rpmRef],sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',
      reviewCommit:git('rev-parse','HEAD'),reviewPath:reviewRef.path,reviewRef,retainedFields:{schemaVersion:'archive-reviewed-native-retained-fields-v1',fields:['problemTypeKey','templateKey']}}};
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:f.receipt.requestId,examUid:f.receipt.examUid,scope:'PARTIAL_UIDS',
    sourceArchiveFile:f.source,expectedSourceBlobSha1:sourceBlob,expectedQuestionCount:2,registryChanges:[],items:[patch],
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'fixture-reviewer',evidenceRefs:[reviewRef,rpmRef]}};
  const tables={pt:f.registry.problemTypes,tpl:f.registry.templates,cc:new Map(),cond:new Map(),master:new Map(master.map(r=>[r.key,r])),
    bindings:new Map([[stable(['2015','중2 수학','M2-06','M2-06-RATIO','PT_ROOT']),binding]])};
  const proof=validateReviewedSourceReassessment({root:dir,request,patch,metadata:{...f.current,...patch.before},question:f.question,final:f.current,
    supportedFields:new Set(REVIEWED_META_VALUE_FIELDS),canonicalBefore:tables,canonicalAfter:tables});
  const bindingPath=reviewedSourceBindingPath(request.requestId);
  for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence.push(bindingPath);
  Object.assign(f.receipt,{sourceArchiveFile:f.source,scope:'PARTIAL_UIDS',partialUidCount:1,totalQuestions:1,expectedQuestionCount:2,
    requestSha256:sha(stable(request)),approval:request.approval,registryChanges:[],appliedRecords:[f.current],appliedIdentityRecords:[f.identity],runtimeRecords:[f.nativeSource.runtimeRecord],
    fingerprintRepairs:[{questionUid:uid,sourceOrdinal:2,metadataBefore:{sourceFingerprint:patch.before.sourceFingerprint,contentFingerprint:patch.before.contentFingerprint},
      identityBefore:patch.identityBefore,after:{sourceFingerprint:sourceFingerprint(f.question),contentFingerprint:contentFingerprint(f.question)},sourceReview:proof}]});
  f.receipt.outputDigests=[put(bindingPath,buildReviewedSourceBinding({request,...f.receipt}))];f.saveReceipt();
  return Object.assign(f,{put,git,sha,stable,request,bindingPath,sourcePath,reviewPath:reviewRef.path,plainCurrent,plainIdentity,plainRuntime});
}
function typedSourceAncestor(f) {
  const priorPath=f.receiptPath,priorRef={path:priorPath,sha256:f.sha(fs.readFileSync(path.join(f.nativeSource.root,priorPath)))};
  f.git('hash-object','-w',f.sourcePath);
  f.nativeSource.bank[0].primaryMethod='unselected source metadata changed';
  const raw=Buffer.from('window.questionBank='+JSON.stringify(f.nativeSource.bank)+';\n');f.put(f.sourcePath,raw.toString());
  f.nativeSource.bytes=raw;f.nativeSource.blobSha1=crypto.createHash('sha1').update(`blob ${raw.length}\0`).update(raw).digest('hex');
  const nextId='typed-source-rebind',nextPath=priorPath.replace(f.receipt.requestId+'.json',nextId+'.json');
  for(const row of [f.current,f.nativeSource.runtimeRecord]){row.metadataRevision=`meta-foundation:MIDDLE_GEOMETRY@1.0.0:exam-final_qa-v2:${nextId}`;row.approvalEvidence.push(nextPath);}
  f.receipt={...structuredClone(f.receipt),requestId:nextId,sourceBlobSha1:f.nativeSource.blobSha1,sourceRawSha256:f.sha(raw),
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'preserve existing approval',evidenceRefs:[priorRef],sourceRebind:{priorReceiptRef:priorRef}},
    fingerprintRepairs:[],outputDigests:[],newMetadataApprovals:0,preservedMetadataApprovals:1,
    appliedRecords:[f.current],runtimeRecords:[f.nativeSource.runtimeRecord]};
  f.receiptPath=nextPath;f.saveReceipt=()=>f.put(nextPath,f.receipt);f.saveReceipt();return f;
}
test('typed native source review revalidates a consumed request without altering its approval',t=>{
  const f=typedSourceReviewFixture(t),before=JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.nativeSource.bank]);
  assert.equal(validateNativeReviewedSourceReuse(f.receipt,f.nativeSource,f.question,f.identity,f.ordinal,f.current,f.registry),true);
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  assert.equal(JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.nativeSource.bank]),before);
});
for(const [name,mutate] of [
  ['sidecar removed',f=>fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath))],
  ['sidecar digest removed',f=>{f.receipt.outputDigests=[];}],
  ['repair and native evidence both removed',f=>{f.receipt.fingerprintRepairs=[];f.receipt.approval.evidenceRefs=f.receipt.approval.evidenceRefs.filter(r=>r.path!==f.reviewPath);}],
  ['sidecar selected UID changed',f=>{const p=JSON.parse(fs.readFileSync(path.join(f.nativeSource.root,f.bindingPath)));p.records[0].questionUid='other';f.put(f.bindingPath,p);}],
  ['before fingerprint changed',f=>{f.receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint='e'.repeat(64);}],
  ['native decision bytes changed',f=>f.put(f.reviewPath,{unreviewed:true})],
  ['current definition bytes changed',f=>f.put('archive/data/meta-foundation/canonical/packs/middle-geometry/taxonomy.json',{problemTypes:[],templates:[]})],
  ['receipt missing',f=>{fs.unlinkSync(path.join(f.nativeSource.root,f.receiptPath));f.saveReceipt=()=>{};}],
  ['all row markers and receipt proofs erased but sidecar output remains',f=>{
    for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence=row.approvalEvidence.filter(p=>p!==f.bindingPath);
    f.receipt.fingerprintRepairs=[];
  }],
  ['all markers, proofs and digest erased but exact sidecar file remains',f=>{
    for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence=row.approvalEvidence.filter(p=>p!==f.bindingPath);
    f.receipt.fingerprintRepairs=[];f.receipt.outputDigests=[];
  }],
  ['all markers, proofs and sidecar file erased but output digest remains',f=>{
    for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence=row.approvalEvidence.filter(p=>p!==f.bindingPath);
    f.receipt.fingerprintRepairs=[];fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath));
  }],
  ['selected count changed',f=>{f.receipt.partialUidCount=2;}],
])test('typed source reuse refuses '+name+' and cannot fall back to MAIN_MERGE',t=>{
  const f=typedSourceReviewFixture(t);assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');mutate(f);f.saveReceipt();
  const out=planQuestion(f);assert.equal(out.status,'SUPPLEMENT_PENDING');assert.deepEqual(out.reasons,['NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED']);assert.equal(out.final,undefined);
});
test('a valid typed source review does not authorize unrelated student changes across the cursor',t=>{
  const f=typedSourceReviewFixture(t);f.previous.answer='unreviewed previous answer';
  assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');assert.equal(planQuestion(f).nativeReviewReceipt,undefined);
});
test('a mixed partial receipt does not impose another selected UID source-review opt-in on a plain row',t=>{
  const f=typedSourceReviewFixture(t);
  f.request.items.unshift({questionUid:f.plainIdentity.questionUid,sourceOrdinal:1,before:{},after:{},evidenceRefs:f.request.approval.evidenceRefs});
  f.receipt.requestSha256=f.sha(f.stable(f.request));f.receipt.partialUidCount=2;f.receipt.totalQuestions=2;
  f.receipt.appliedRecords.unshift(f.plainCurrent);f.receipt.appliedIdentityRecords.unshift(f.plainIdentity);f.receipt.runtimeRecords.unshift(f.plainRuntime);
  f.receipt.outputDigests=[f.put(f.bindingPath,buildReviewedSourceBinding({request:f.request,...f.receipt}))];f.saveReceipt();
  f.ordinal=1;f.current=f.plainCurrent;f.identity=f.plainIdentity;f.nativeSource.runtimeRecord=f.plainRuntime;
  f.question=structuredClone(f.nativeSource.bank[0]);f.previous=structuredClone(f.question);
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  assert.equal(validateNativeReviewedSourceReuse(f.receipt,f.nativeSource,f.question,f.identity,f.ordinal,f.current,f.registry),null);
});
test('source-only rebind retains its original typed source-review witness obligations',t=>{
  const f=typedSourceAncestor(typedSourceReviewFixture(t));
  assert.equal(validateNativeReviewedSourceReuse(f.receipt,f.nativeSource,f.question,f.identity,f.ordinal,f.current,f.registry),true);
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  f.put(f.reviewPath,{unreviewed:true});assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');
});
for(const [name,mutate] of [
  ['wrong prior receipt SHA',f=>{f.receipt.approval.sourceRebind.priorReceiptRef.sha256='e'.repeat(64);}],
  ['unregistered new approval',f=>{f.receipt.newMetadataApprovals=1;}],
  ['missing original sidecar',f=>fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath))],
])test('typed source-review ancestor refuses '+name,t=>{
  const f=typedSourceAncestor(typedSourceReviewFixture(t));mutate(f);f.saveReceipt();
  assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');assert.equal(planQuestion(f).final,undefined);
});
test('an explicit prior receipt detects typed ancestry after all inherited row provenance is erased',t=>{
  const f=typedSourceAncestor(typedSourceReviewFixture(t));
  for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence=[f.receiptPath];
  f.saveReceipt();
  assert.equal(hasNativeReviewedSourceClaim({root:f.nativeSource.root,current:f.current,runtimeRecord:f.nativeSource.runtimeRecord}),true);
  const out=planQuestion(f);assert.equal(out.status,'SUPPLEMENT_PENDING');assert.equal(out.final,undefined);
  f.put(f.reviewPath,{unreviewed:true});
  assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');
});
test('an explicit receipt ancestry with no typed source review preserves the plain native path',t=>{
  const f=typedSourceReviewFixture(t);
  for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence=row.approvalEvidence.filter(p=>p!==f.bindingPath);
  f.receipt.fingerprintRepairs=[];f.receipt.outputDigests=[];fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath));f.saveReceipt();
  typedSourceAncestor(f);
  assert.equal(hasNativeReviewedSourceClaim({root:f.nativeSource.root,current:f.current,runtimeRecord:f.nativeSource.runtimeRecord}),false);
  assert.equal(validateNativeReviewedSourceReuse(f.receipt,f.nativeSource,f.question,f.identity,f.ordinal,f.current,f.registry),null);
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
});

// A new source container can change an unselected question after a native
// solution/figure approval. Its selected approval and original proof stay exact.
function preserveNativeSubset(f,id='plain-source-preservation') {
  const dir=f.nativeSource.root,sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
  const put=(relative,value)=>{const file=path.join(dir,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value));};
  execFileSync('git',['init','-q'],{cwd:dir});
  f.saveReceipt();
  const prior=structuredClone(f.receipt),priorPath=f.receiptPath,priorBytes=fs.readFileSync(path.join(dir,priorPath));
  execFileSync('git',['hash-object','-w','--stdin'],{cwd:dir,input:f.nativeSource.bytes});
  const nextBank=structuredClone(f.nativeSource.bank),selected=new Set(prior.appliedRecords.map(row=>row.sourceOrdinal));
  const other=nextBank.findIndex((_,i)=>!selected.has(i+1));assert.notEqual(other,-1);
  nextBank[other].primaryMethod='unselected container-only change '+id;
  const bytes=Buffer.from('window.questionBank='+JSON.stringify(nextBank)+';\n'),blobSha1=crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  put('archive/exams/'+source,bytes);
  const nextPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+id+'.json';
  const updated=row=>({...structuredClone(row),metadataRevision:`meta-foundation:${row.metaFoundationPackId}@${row.metaFoundationPackVersion}:exam-final_qa-v2:${id}`,
    approvalEvidence:[...new Set([...row.approvalEvidence,nextPath])]});
  const appliedRecords=prior.appliedRecords.map(updated),runtimeRecords=prior.runtimeRecords.map(updated),ref={path:priorPath,sha256:sha(priorBytes)};
  f.receipt={...prior,requestId:id,requestSha256:sha(id+prior.requestSha256),sourceBlobSha1:blobSha1,sourceRawSha256:sha(bytes),
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'preserve exact previous approval',evidenceRefs:[ref],sourceRebind:{priorReceiptRef:ref}},
    registryChanges:[],fingerprintRepairs:[],nativeParentBindings:[],outputDigests:[],newMetadataApprovals:0,preservedMetadataApprovals:prior.partialUidCount,
    appliedRecords,runtimeRecords};
  f.current=appliedRecords.find(row=>row.questionUid===f.identity.questionUid);
  f.nativeSource={...f.nativeSource,bytes,blobSha1,bank:nextBank,runtimeRecord:runtimeRecords.find(row=>row.questionUid===f.identity.questionUid)};
  f.receiptPath=nextPath;f.saveReceipt=()=>put(nextPath,f.receipt);f.saveReceipt();
  return Object.assign(f,{ancestor:prior,ancestorPath:priorPath,put,sha});
}
for(const [name,make]of [
  ['plain unchanged source',partialNativeReviewFixture],['solution correction',solutionRebindNativeFixture],
  ['independent figure',reviewedFigureNativeFixture],['compound renderer',compoundRendererNativeFixture],
])test('source-only preservation reuses the original '+name+' approval across old and caught-up cursors',t=>{
  const f=preserveNativeSubset(make(t)),before=JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.nativeSource.bank]);
  for(const previous of [f.previous,structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,f.receiptPath);assert.equal(result.final,undefined);
  }
  assert.equal(JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.nativeSource.bank]),before);
});
test('two exact source-only preserves replay the original solution proof without approval or identity changes',t=>{
  const f=preserveNativeSubset(preserveNativeSubset(solutionRebindNativeFixture(t)),'second-source-preservation');
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  f.previous=structuredClone(f.question);assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
});
test('source-only ancestry can end at an exact ordinary fingerprint reassessment with prior evidence',t=>{
  const f=preserveNativeSubset(ordinaryReassessmentWithPriorFixture(t));
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  f.put(f.reviewPath,{unreviewed:true});assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');
});
test('erasing preservation markers and copying an ancestor review cannot fabricate a new reassessment',t=>{
  const f=preserveNativeSubset(ordinaryReassessmentWithPriorFixture(t));
  delete f.receipt.approval.sourceRebind;delete f.receipt.newMetadataApprovals;delete f.receipt.preservedMetadataApprovals;
  f.receipt.fingerprintRepairs=structuredClone(f.ancestor.fingerprintRepairs);
  for(const repair of f.receipt.fingerprintRepairs) {
    const old=f.ancestor.appliedRecords.find(row=>row.questionUid===repair.questionUid);
    repair.metadataBefore={sourceFingerprint:old.sourceFingerprint,contentFingerprint:old.contentFingerprint};
    repair.identityBefore={sourceFingerprint:old.sourceFingerprint};
  }
  f.receipt.approval.evidenceRefs.push(...f.ancestor.approval.evidenceRefs.filter(ref=>!ref.path.startsWith('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/')));
  f.saveReceipt();const result=planQuestion(f);
  assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
});
const updatePreservedPrior=f=>{
  f.put(f.ancestorPath,f.ancestor);
  f.receipt.approval.sourceRebind.priorReceiptRef.sha256=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.ancestorPath)));
};
for(const [name,change]of [
  ['prior SHA changed',f=>{f.receipt.approval.sourceRebind.priorReceiptRef.sha256='e'.repeat(64);}],
  ['prior receipt missing',f=>fs.unlinkSync(path.join(f.nativeSource.root,f.ancestorPath))],
  ['prior receipt symlink',f=>{fs.renameSync(path.join(f.nativeSource.root,f.ancestorPath),path.join(f.nativeSource.root,'prior-copy.json'));fs.symlinkSync(path.join(f.nativeSource.root,'prior-copy.json'),path.join(f.nativeSource.root,f.ancestorPath));}],
  ['sourceRebind removed',f=>{delete f.receipt.approval.sourceRebind;}],
  ['sourceRebind and count markers removed',f=>{delete f.receipt.approval.sourceRebind;delete f.receipt.newMetadataApprovals;delete f.receipt.preservedMetadataApprovals;}],
  ['sourceRebind, count markers and prior-ref all removed',f=>{
    delete f.receipt.approval.sourceRebind;delete f.receipt.newMetadataApprovals;delete f.receipt.preservedMetadataApprovals;
    f.receipt.approval.evidenceRefs=structuredClone(f.ancestor.approval.evidenceRefs);
  }],
  ['all receipt markers and predecessor file removed',f=>{
    delete f.receipt.approval.sourceRebind;delete f.receipt.newMetadataApprovals;delete f.receipt.preservedMetadataApprovals;
    f.receipt.approval.evidenceRefs=structuredClone(f.ancestor.approval.evidenceRefs);
    fs.unlinkSync(path.join(f.nativeSource.root,f.ancestorPath));
  }],
  ['all receipt markers removed and predecessor JSON malformed',f=>{
    delete f.receipt.approval.sourceRebind;delete f.receipt.newMetadataApprovals;delete f.receipt.preservedMetadataApprovals;
    f.receipt.approval.evidenceRefs=structuredClone(f.ancestor.approval.evidenceRefs);f.put(f.ancestorPath,'invalid JSON');
  }],
  ['unregistered new approval',f=>{f.receipt.newMetadataApprovals=1;}],
  ['wrong preserved count',f=>{f.receipt.preservedMetadataApprovals=1;}],
  ['unknown scope',f=>{f.receipt.scope='ALL';}],
  ['new registry change',f=>{f.receipt.registryChanges=[{collection:'bindings'}];}],
  ['malformed registry change object',f=>{f.receipt.registryChanges={collection:'bindings'};}],
  ['new fingerprint repair',f=>{f.receipt.fingerprintRepairs=[{questionUid:uid}];}],
  ['unknown sourceRebind option',f=>{f.receipt.approval.sourceRebind.allowContentChanges=true;}],
  ['parent scope change',f=>{f.ancestor.examUid='other-exam';updatePreservedPrior(f);}],
  ['parent denominator change',f=>{f.ancestor.expectedQuestionCount=4;updatePreservedPrior(f);}],
  ['parent selected UID change',f=>{f.ancestor.appliedRecords[0].questionUid='other';updatePreservedPrior(f);}],
  ['parent ordinal change',f=>{f.ancestor.appliedIdentityRecords[0].sourceOrdinal=2;updatePreservedPrior(f);}],
  ['parent approval downgraded',f=>{f.ancestor.approval.type='MAIN_MERGE';updatePreservedPrior(f);}],
  ['parent approval evidence changed',f=>{f.put('review/metadata.json','unreviewed change');}],
  ['current approved field changed',f=>{f.current.fieldStatus.problemType='review_required';}],
  ['current runtime field changed',f=>{f.nativeSource.runtimeRecord.reviewStatus='review_required';}],
  ['parent selected whole question changed',f=>{
    const bank=structuredClone(f.nativeSource.bank);bank[f.ordinal-1].sharedMaterial='unreviewed selected material';
    const bytes=Buffer.from('window.questionBank='+JSON.stringify(bank)+';\n');
    f.ancestor.sourceBlobSha1=execFileSync('git',['hash-object','-w','--stdin'],{cwd:f.nativeSource.root,input:bytes,encoding:'utf8'}).trim();
    f.ancestor.sourceRawSha256=f.sha(bytes);updatePreservedPrior(f);
  }],
  ['another selected question changed outside legacy fingerprint fields',f=>{
    const bank=structuredClone(f.nativeSource.bank),other=f.ancestor.appliedRecords.find(row=>row.questionUid!==f.identity.questionUid);
    bank[other.sourceOrdinal-1].sharedMaterial='unreviewed selected neighbour material';
    const bytes=Buffer.from('window.questionBank='+JSON.stringify(bank)+';\n');
    f.ancestor.sourceBlobSha1=execFileSync('git',['hash-object','-w','--stdin'],{cwd:f.nativeSource.root,input:bytes,encoding:'utf8'}).trim();
    f.ancestor.sourceRawSha256=f.sha(bytes);updatePreservedPrior(f);
  }],
  ['original repair before fingerprint changed',f=>{f.ancestor.fingerprintRepairs[0].metadataBefore.sourceFingerprint='e'.repeat(64);updatePreservedPrior(f);}],
  ['original old source blob changed',f=>{f.ancestor.fingerprintRepairs[0].rebind.priorSourceBlobSha1='e'.repeat(40);updatePreservedPrior(f);}],
  ['preserved metadata evidence removed',f=>{f.current.approvalEvidence=[f.receiptPath];}],
  ['preserved runtime evidence removed',f=>{f.nativeSource.runtimeRecord.approvalEvidence=[f.receiptPath];}],
])test('source-only native ancestry refuses '+name+' without producer fallback',t=>{
  const f=preserveNativeSubset(solutionRebindNativeFixture(t));change(f);f.saveReceipt();
  assert.equal(hasNativeSourcePreservationClaim({root:f.nativeSource.root,current:f.current,runtimeRecord:f.nativeSource.runtimeRecord}),true);
  for(const previous of [f.previous,structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
  }
});
for(const make of [reviewedFigureNativeFixture,compoundRendererNativeFixture])test('preserved renderer ancestry rechecks actual assets after a warm cache and caught-up cursor: '+make.name,t=>{
  const f=preserveNativeSubset(make(t));assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- unreviewed renderer bytes -->');
  for(const previous of [f.previous,structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
  }
});
test('partial source preservation cannot replace an unknown old student payload with an existing approved one',t=>{
  const f=preserveNativeSubset(solutionRebindNativeFixture(t));f.previous.answer='unreviewed old answer';
  const result=planQuestion(f);assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
});
test('partial source preservation bounds the receipt ancestry depth',t=>{
  let f=partialNativeReviewFixture(t);
  for(let i=0;i<65;i++)f=preserveNativeSubset(f,'source-preservation-depth-'+i);
  const result=planQuestion(f);assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
});
for(const [name,removeLatest]of [
  ['missing latest',f=>fs.unlinkSync(path.join(f.nativeSource.root,f.receiptPath))],
  ['missing latest and original',f=>{fs.unlinkSync(path.join(f.nativeSource.root,f.receiptPath));fs.unlinkSync(path.join(f.nativeSource.root,f.ancestorPath));}],
  ['empty latest object',f=>{f.put(f.receiptPath,{});}],
  ['latest approval removed',f=>{delete f.receipt.approval;f.saveReceipt();}],
  ['latest approval type removed',f=>{delete f.receipt.approval.type;f.saveReceipt();}],
  ['latest scope removed',f=>{delete f.receipt.scope;f.saveReceipt();}],
  ['latest selected metadata removed',f=>{f.receipt.appliedRecords=[];f.saveReceipt();}],
  ['latest preservation markers removed and source tuple rolled back',f=>{
    delete f.receipt.approval.sourceRebind;delete f.receipt.newMetadataApprovals;delete f.receipt.preservedMetadataApprovals;
    f.receipt.approval.evidenceRefs=structuredClone(f.ancestor.approval.evidenceRefs);
    f.receipt.sourceBlobSha1=f.ancestor.sourceBlobSha1;f.receipt.sourceRawSha256=f.ancestor.sourceRawSha256;f.saveReceipt();
  }],
])for(const make of [solutionRebindNativeFixture,reviewedFigureNativeFixture])test(name+' preservation receipt cannot invoke the otherwise eligible producer: '+make.name,t=>{
  // Complete the ordinary producer fields so neither missing difficulty fields
  // nor absent canonical labels can accidentally hide a fallback to APPLY.
  const f=preserveNativeSubset(make(t,{completeFields:true}));
  Object.assign(f.registry.bindingRows[0],{L1:'Numbers',L2:'Roots'});
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  // The unchanged ordinary producer has enough information to write these rows.
  for(const previous of [f.previous,structuredClone(f.question)])assert.equal(planQuestion({...f,previous,nativeSource:undefined}).status,'APPLY');
  removeLatest(f);
  for(const previous of [f.previous,structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING');
    assert.deepEqual(result.reasons,['NATIVE_SOURCE_PRESERVATION_REVALIDATION_FAILED']);assert.equal(result.final,undefined);
  }
});

function ordinaryRendererReassessmentWithPriorFixture(t) {
  const f=compoundRendererNativeFixture(t),dir=f.nativeSource.root,proof=f.receipt.fingerprintRepairs[0].sourceReview;
  const priorBytes=execFileSync('git',['cat-file','blob',proof.rendererContinuity.prefigureSourceRef.gitBlobSha1],{cwd:dir});
  const priorBank=loadBank(priorBytes.toString('utf8')),priorId='prior-renderer-final-qa',priorPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+priorId+'.json';
  const stripStudent=row=>Object.fromEntries(Object.entries(row).filter(([key])=>
    !REASSESSED_STUDENT_FIELDS.includes(key)||['questionUid','sourceOrdinal','sourceQuestionNo'].includes(key)));
  const prior=structuredClone(f.receipt),beforeRow=row=>{
    const q=priorBank[row.sourceOrdinal-1];return {...stripStudent(row),sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q),
      ...(Object.hasOwn(row,'approvedSourceFingerprint')?{approvedSourceFingerprint:sourceFingerprint(q)}:{}),
      metadataRevision:`meta-foundation:MIDDLE3@1.0.0:exam-final_qa-v2:${priorId}`,approvalEvidence:[priorPath]};
  };
  Object.assign(prior,{requestId:priorId,requestSha256:f.sha(priorId),sourceBlobSha1:proof.rendererContinuity.prefigureSourceRef.gitBlobSha1,
    sourceRawSha256:f.sha(priorBytes),fingerprintRepairs:[],outputDigests:[],
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'prior-native-reviewer',evidenceRefs:[f.receipt.approval.evidenceRefs[0]]},
    appliedRecords:prior.appliedRecords.map(beforeRow),runtimeRecords:prior.runtimeRecords.map(beforeRow),
    appliedIdentityRecords:prior.appliedIdentityRecords.map(row=>({...row,sourceFingerprint:sourceFingerprint(priorBank[row.sourceOrdinal-1])}))});
  f.put(priorPath,prior);
  const nextId='ordinary-renderer-reassessment-with-prior',nextPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+nextId+'.json',
    bindingPath=reviewedRendererBindingPath(nextId),updated=row=>({...stripStudent(row),
      metadataRevision:`meta-foundation:MIDDLE3@1.0.0:exam-final_qa-v2:${nextId}`,approvalEvidence:[priorPath,nextPath,bindingPath]});
  Object.assign(f.receipt,{requestId:nextId,requestSha256:f.sha(nextId),partialUidCount:1,totalQuestions:1,
    appliedRecords:f.receipt.appliedRecords.filter(row=>row.questionUid===uid).map(updated),
    runtimeRecords:f.receipt.runtimeRecords.filter(row=>row.questionUid===uid).map(updated),
    appliedIdentityRecords:f.receipt.appliedIdentityRecords.filter(row=>row.questionUid===uid)});
  const before=prior.appliedRecords.find(row=>row.questionUid===uid),oldIdentity=prior.appliedIdentityRecords.find(row=>row.questionUid===uid),repair=f.receipt.fingerprintRepairs[0];
  repair.metadataBefore={sourceFingerprint:before.sourceFingerprint,contentFingerprint:before.contentFingerprint};
  repair.identityBefore={sourceFingerprint:oldIdentity.sourceFingerprint};
  f.receipt.approval.evidenceRefs.push({path:priorPath,sha256:f.sha(fs.readFileSync(path.join(dir,priorPath)))});
  f.current=f.receipt.appliedRecords[0];f.nativeSource.runtimeRecord=f.receipt.runtimeRecords[0];f.identity=f.receipt.appliedIdentityRecords[0];
  f.receiptPath=nextPath;f.bindingPath=bindingPath;
  f.refreshBinding=()=>{
    f.put(bindingPath,buildReviewedRendererBinding(f.receipt));
    f.receipt.outputDigests=[{path:bindingPath,sha256:f.sha(fs.readFileSync(path.join(dir,bindingPath)))}];
  };
  f.refreshBinding();f.saveReceipt=()=>f.put(nextPath,f.receipt);f.saveReceipt();
  f.verifyCompound=()=>nativeReviewedRendererRebind(f.receipt,f.nativeSource,f.previous,f.question,f.identity,f.ordinal,f.current,f.registry);
  return {...f,priorNativeReceipt:prior,priorNativePath:priorPath};
}

test('ordinary fingerprint renderer reassessment retains issued values and exact typed provenance',t=>{
  const f=ordinaryRendererReassessmentWithPriorFixture(t),before=JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.receipt]);
  assert.equal(f.verifyCompound(),true,'the original official renderer verifier validates this bound proof');
  for(const previous of [f.previous,structuredClone(f.question)]){
    const result=planQuestion({...f,previous});
    assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,f.receiptPath);assert.equal(result.final,undefined);
  }
  assert.equal(JSON.stringify([f.current,f.identity,f.nativeSource.runtimeRecord,f.receipt]),before);
});

for(const [name,change]of [
  ['arbitrary evidence append',f=>{for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence.push('review/arbitrary-provenance.json');}],
  ['foreign typed sidecar append',f=>{for(const row of [f.current,f.nativeSource.runtimeRecord])row.approvalEvidence.push(reviewedRendererBindingPath('foreign-request'));}],
  ['missing metadata sidecar marker',f=>{f.current.approvalEvidence=f.current.approvalEvidence.filter(p=>p!==f.bindingPath);}],
  ['missing runtime sidecar marker',f=>{f.nativeSource.runtimeRecord.approvalEvidence=f.nativeSource.runtimeRecord.approvalEvidence.filter(p=>p!==f.bindingPath);}],
  ['missing sidecar file',f=>{fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath));}],
  ['missing sidecar digest',f=>{f.receipt.outputDigests=[];}],
  ['changed independent witness',f=>{fs.appendFileSync(path.join(f.nativeSource.root,f.compoundIndependentPath),' ');}],
  ['missing selected renderer proof',f=>{delete f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;}],
  ['foreign renderer schema',f=>{f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity.schemaVersion='unrecognized-renderer';
    assert.throws(()=>f.refreshBinding(),/exact renderer binding repair inventory required/);}],
  ['current container replaced with prior container',f=>{const proof=f.receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;
    proof.currentSourceRef.gitBlobSha1=f.priorNativeReceipt.sourceBlobSha1;proof.currentSourceRef.sha256=f.priorNativeReceipt.sourceRawSha256;f.refreshBinding();}],
  ['prior approved difficulty differs',f=>{f.priorNativeReceipt.appliedRecords.find(r=>r.questionUid===uid).difficultyBucket=5;
    f.put(f.priorNativePath,f.priorNativeReceipt);f.receipt.approval.evidenceRefs.find(r=>r.path===f.priorNativePath).sha256=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.priorNativePath)));}],
  ['identity foreign field inserted',f=>{f.identity.unreviewedField='not a fingerprint';}],
  ['runtime classification changed',f=>{f.nativeSource.runtimeRecord.conditionKeys=['UNREVIEWED'];}],
  ['new approval count inserted',f=>{f.receipt.newMetadataApprovals=1;}],
  ['source-only preservation flag inserted',f=>{f.receipt.approval.sourceRebind={};}],
])test('ordinary renderer reassessment rejects '+name+' without producer fallback',t=>{
  const f=ordinaryRendererReassessmentWithPriorFixture(t);
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  change(f);f.saveReceipt();
  for(const previous of [f.previous,structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
  }
});
test('ordinary renderer reassessment rechecks same-path asset bytes after its cache is warm',t=>{
  const f=ordinaryRendererReassessmentWithPriorFixture(t);
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- unreviewed current renderer -->');
  for(const previous of [f.previous,structuredClone(f.question)])assert.equal(planQuestion({...f,previous}).status,'SUPPLEMENT_PENDING');
});
test('source-only ancestry can end at an exact ordinary renderer reassessment',t=>{
  const f=preserveNativeSubset(ordinaryRendererReassessmentWithPriorFixture(t));
  for(const previous of [f.previous,structuredClone(f.question)])assert.equal(planQuestion({...f,previous}).nativeReviewReceipt,f.receiptPath);
});
test('copying a renderer ancestor and erasing preservation markers cannot fabricate a new source review',t=>{
  const f=preserveNativeSubset(ordinaryRendererReassessmentWithPriorFixture(t));
  delete f.receipt.approval.sourceRebind;delete f.receipt.newMetadataApprovals;delete f.receipt.preservedMetadataApprovals;
  f.receipt.fingerprintRepairs=structuredClone(f.ancestor.fingerprintRepairs);
  for(const repair of f.receipt.fingerprintRepairs) {
    const old=f.ancestor.appliedRecords.find(row=>row.questionUid===repair.questionUid);
    repair.metadataBefore={sourceFingerprint:old.sourceFingerprint,contentFingerprint:old.contentFingerprint};
    repair.identityBefore={sourceFingerprint:old.sourceFingerprint};
  }
  f.receipt.approval.evidenceRefs.push(...f.ancestor.approval.evidenceRefs.filter(ref=>!ref.path.startsWith('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/')));
  const bindingPath=reviewedRendererBindingPath(f.receipt.requestId);
  f.current.approvalEvidence.push(bindingPath);f.nativeSource.runtimeRecord.approvalEvidence.push(bindingPath);
  f.put(bindingPath,buildReviewedRendererBinding(f.receipt));
  f.receipt.outputDigests=[{path:bindingPath,sha256:f.sha(fs.readFileSync(path.join(f.nativeSource.root,bindingPath)))}];f.saveReceipt();
  for(const previous of [f.previous,structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
  }
});

function mixedRendererReassessmentFixture(t,{technical=false}={}) {
  const f=ordinaryRendererReassessmentWithPriorFixture(t),old=f.priorNativeReceipt,
    oldRow=old.appliedRecords.find(r=>r.sourceOrdinal===1),oldRuntime=old.runtimeRecords.find(r=>r.sourceOrdinal===1),
    identity=structuredClone(old.appliedIdentityRecords.find(r=>r.sourceOrdinal===1)),q=f.nativeSource.bank[0];
  const updated=row=>({...structuredClone(row),metadataRevision:`meta-foundation:MIDDLE3@1.0.0:exam-final_qa-v2:${f.receipt.requestId}`,
    approvalEvidence:[...row.approvalEvidence,f.receiptPath]});
  const current=updated(oldRow),runtime=updated(oldRuntime),nativePath='review/unchanged-current-native.json';
  const native=JSON.parse(fs.readFileSync(path.join(f.nativeSource.root,'review/original-native.json'))),nativeRow=native.items.find(r=>r.sourceOrdinal===1||r.ordinal===1);
  native.sourceAfterBlob=f.nativeSource.blobSha1;native.sourceAfterSha256=f.sha(f.nativeSource.bytes);
  nativeRow.after=Object.fromEntries(Object.entries(q).filter(([key])=>REVIEWED_META_VALUE_FIELDS.includes(key)));
  nativeRow.decisiveStep=q.decisiveStep;
  if(technical)native.proposals=[{kind:'EXISTING_ACTIVE_CROSSWALK_CONNECTION',questionUid:identity.questionUid,
    sourceOrdinal:1,existingTemplates:[q.templateKey]}];
  f.put(nativePath,native);f.git('add',nativePath);
  f.git('-c','user.name=Fixture reviewer','-c','user.email=fixture@example.invalid','commit','-qm','Exact unchanged native member');
  const reviewRef={path:nativePath,sha256:f.sha(fs.readFileSync(path.join(f.nativeSource.root,nativePath)))},reviewCommit=f.git('rev-parse','HEAD');
  f.receipt.approval.evidenceRefs.push(reviewRef);
  const metadataBefore={sourceFingerprint:oldRow.sourceFingerprint,contentFingerprint:oldRow.contentFingerprint},
    identityBefore={sourceFingerprint:identity.sourceFingerprint},after={sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q)},
    canonical={pt:f.registry.problemTypes,tpl:f.registry.templates};
  const sourceReview=validateReviewedSourceReassessment({root:f.nativeSource.root,
    request:{scope:'PARTIAL_UIDS',approval:f.receipt.approval,sourceArchiveFile:source,expectedQuestionCount:3},
    patch:{questionUid:identity.questionUid,sourceOrdinal:1,before:metadataBefore,identityBefore,after,
      evidenceRefs:f.receipt.approval.evidenceRefs,sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit,reviewPath:nativePath,reviewRef}},
    metadata:oldRow,question:q,final:current,canonicalBefore:canonical,canonicalAfter:canonical,supportedFields:new Set(REVIEWED_META_VALUE_FIELDS)});
  f.receipt.appliedRecords.push(current);f.receipt.runtimeRecords.push(runtime);f.receipt.appliedIdentityRecords.push(identity);
  f.receipt.fingerprintRepairs.push({questionUid:identity.questionUid,sourceOrdinal:1,metadataBefore,identityBefore,after,sourceReview});
  f.receipt.partialUidCount=2;f.receipt.totalQuestions=2;f.refreshBinding();f.saveReceipt();
  const beforeSource=execFileSync('git',['cat-file','blob',old.sourceBlobSha1],{cwd:f.nativeSource.root}),beforeBank=loadBank(beforeSource.toString());
  return {...f,current,identity,question:q,previous:structuredClone(q),ordinal:1,
    nativeSource:{...f.nativeSource,runtimeRecord:runtime},oldBank:beforeBank,
    rendererUid:uid,unchangedUid:identity.questionUid,nativeMemberPath:nativePath};
}
for(const technical of [false,true])test('mixed renderer reassessment preserves the unchanged complete prior cohort with technical definitions='+technical,t=>{
  const f=mixedRendererReassessmentFixture(t,{technical}),before=JSON.stringify([f.receipt,f.current,f.identity,f.nativeSource.identityByJoin&&[...f.nativeSource.identityByJoin]]);
  for(const previous of [f.oldBank[0],structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,f.receiptPath);assert.equal(result.final,undefined);
  }
  assert.equal(JSON.stringify([f.receipt,f.current,f.identity,f.nativeSource.identityByJoin&&[...f.nativeSource.identityByJoin]]),before);
});
for(const [name,change]of [
  ['prior selected subset',f=>{for(const key of ['appliedRecords','appliedIdentityRecords','runtimeRecords'])f.priorNativeReceipt[key]=f.priorNativeReceipt[key].filter(r=>r.questionUid===f.unchangedUid);
    f.priorNativeReceipt.partialUidCount=1;f.priorNativeReceipt.totalQuestions=1;f.put(f.priorNativePath,f.priorNativeReceipt);
    f.receipt.approval.evidenceRefs.find(r=>r.path===f.priorNativePath).sha256=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.priorNativePath)));}],
  ['new selected subset',f=>{for(const key of ['appliedRecords','appliedIdentityRecords','runtimeRecords'])f.receipt[key]=f.receipt[key].filter(r=>r.questionUid===f.unchangedUid);
    f.receipt.fingerprintRepairs=f.receipt.fingerprintRepairs.filter(r=>r.questionUid===f.unchangedUid);f.receipt.partialUidCount=1;f.receipt.totalQuestions=1;f.receipt.outputDigests=[];}],
  ['missing peer current renderer proof',f=>{delete f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.rendererUid).sourceReview.rendererContinuity;}],
  ['peer proof sidecar and all typed markers erased',f=>{
    delete f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.rendererUid).sourceReview.rendererContinuity;
    for(const rows of [f.receipt.appliedRecords,f.receipt.runtimeRecords])for(const row of rows)
      row.approvalEvidence=row.approvalEvidence.filter(p=>p!==f.bindingPath);
    f.receipt.outputDigests=[];fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath));}],
  ['missing peer renderer marker',f=>{f.receipt.appliedRecords.find(r=>r.questionUid===f.rendererUid).approvalEvidence=f.receipt.appliedRecords.find(r=>r.questionUid===f.rendererUid).approvalEvidence.filter(p=>p!==f.bindingPath);}],
  ['missing peer runtime renderer marker',f=>{f.receipt.runtimeRecords.find(r=>r.questionUid===f.rendererUid).approvalEvidence=f.receipt.runtimeRecords.find(r=>r.questionUid===f.rendererUid).approvalEvidence.filter(p=>p!==f.bindingPath);}],
  ['arbitrary unchanged provenance',f=>{f.current.approvalEvidence.push('review/extra.json');f.nativeSource.runtimeRecord.approvalEvidence.push('review/extra.json');}],
  ['arbitrary peer provenance',f=>{f.receipt.appliedRecords.find(r=>r.questionUid===f.rendererUid).approvalEvidence.push('review/extra.json');}],
  ['unchanged identity foreign field',f=>{f.identity.extraField='unreviewed';}],
  ['peer runtime difficulty changed',f=>{f.receipt.runtimeRecords.find(r=>r.questionUid===f.rendererUid).difficultyBucket=5;}],
  ['original source receipt gone',f=>{fs.unlinkSync(path.join(f.nativeSource.root,f.priorNativePath));}],
  ['original prior evidence changed',f=>{f.put('review/metadata.json','changed previous approval evidence');}],
  ['current peer asset changed',f=>{fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- peer asset drift -->');}],
  ['new source-only marker',f=>{f.receipt.approval.sourceRebind={};}],
  ['new preserved-count marker',f=>{f.receipt.newMetadataApprovals=0;f.receipt.preservedMetadataApprovals=2;}],
  ['changed unchanged-member source review',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).sourceReview.studentPayloadSha256='e'.repeat(64);}],
])test('mixed renderer continuation refuses '+name+' without promoting the unchanged member',t=>{
  const f=mixedRendererReassessmentFixture(t);assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  change(f);f.saveReceipt();
  for(const previous of [f.oldBank[0],structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));assert.equal(result.final,undefined);assert.equal(result.nativeReviewReceipt,undefined);
  }
});
test('mixed renderer continuation keeps the actual previous-payload guard for an unchanged member',t=>{
  const f=mixedRendererReassessmentFixture(t);f.previous.answer='unreviewed older answer';
  const result=planQuestion(f);assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
});
test('mixed renderer technical reuse cannot silently replace an ACTIVE definition after issuance',t=>{
  const f=mixedRendererReassessmentFixture(t,{technical:true});assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  f.registry.templates.get('TPL_ROOT').definition='changed after issuance';
  const result=planQuestion(f);assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
});

test('source-only ancestry replays the complete mixed renderer receipt and its unchanged member',t=>{
  const f=preserveNativeSubset(mixedRendererReassessmentFixture(t,{technical:true}),'preserve-mixed-renderer-cohort');
  for(const previous of [f.oldBank[0],structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.nativeReviewReceipt,f.receiptPath,JSON.stringify(result));
    assert.equal(result.status,'ALREADY_REGISTERED');assert.equal(result.final,undefined);
  }
});
test('source-only ancestry cannot hide a changed renderer peer behind its unchanged mixed member',t=>{
  const f=preserveNativeSubset(mixedRendererReassessmentFixture(t,{technical:true}),'preserve-mixed-renderer-cohort');
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- unreviewed ancestor peer asset -->');
  for(const previous of [f.oldBank[0],structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
  }
});

function mixedApprovedRebindMemberFixture(t) {
  const f=mixedRendererReassessmentFixture(t),repair=f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid);
  delete repair.sourceReview;
  repair.rebind={priorSourceBlobSha1:f.priorNativeReceipt.sourceBlobSha1,priorContentFingerprint:repair.metadataBefore.contentFingerprint};
  f.receipt.approval.evidenceRefs=f.receipt.approval.evidenceRefs.filter(ref=>ref.path!==f.nativeMemberPath);
  f.refreshBinding();f.saveReceipt();return f;
}

test('mixed current renderer retains a whole-question-identical prior approval through the existing exact rebind form',t=>{
  const f=mixedApprovedRebindMemberFixture(t),before=JSON.stringify([f.receipt,f.current,f.identity,f.nativeSource.runtimeRecord]);
  for(const previous of [f.oldBank[0],structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,f.receiptPath);assert.equal(result.final,undefined);
  }
  assert.equal(JSON.stringify([f.receipt,f.current,f.identity,f.nativeSource.runtimeRecord]),before);
});

for(const [name,change]of [
  ['foreign prior source',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).rebind.priorSourceBlobSha1='e'.repeat(40);}],
  ['foreign prior content',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).rebind.priorContentFingerprint='e'.repeat(64);}],
  ['unknown rebind property',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).rebind.allowRenderer=true;}],
  ['new source review alongside rebind',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).sourceReview={schemaVersion:'invented'};}],
  ['new after value',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).after.difficultyBucket=5;}],
  ['changed before fingerprint',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).metadataBefore.sourceFingerprint='e'.repeat(64);}],
  ['changed identity before',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).identityBefore.sourceFingerprint='e'.repeat(64);}],
  ['new repair property',f=>{f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.unchangedUid).allowNativeReuse=true;}],
  ['metadata value change',f=>{f.current.conditionKeys=['UNREVIEWED'];}],
  ['runtime value change',f=>{f.nativeSource.runtimeRecord.difficultyBucket=5;}],
  ['identity value change',f=>{f.identity.foreign='new';}],
  ['extra provenance',f=>{f.current.approvalEvidence.push('review/foreign.json');f.nativeSource.runtimeRecord.approvalEvidence.push('review/foreign.json');}],
  ['source-only marker',f=>{f.receipt.approval.sourceRebind={};}],
  ['subset',f=>{for(const key of ['appliedRecords','appliedIdentityRecords','runtimeRecords'])f.receipt[key]=f.receipt[key].filter(r=>r.questionUid===f.unchangedUid);
    f.receipt.fingerprintRepairs=f.receipt.fingerprintRepairs.filter(r=>r.questionUid===f.unchangedUid);f.receipt.partialUidCount=1;f.receipt.totalQuestions=1;}],
  ['missing renderer peer proof and markers',f=>{delete f.receipt.fingerprintRepairs.find(r=>r.questionUid===f.rendererUid).sourceReview.rendererContinuity;
    for(const rows of [f.receipt.appliedRecords,f.receipt.runtimeRecords])for(const row of rows)row.approvalEvidence=row.approvalEvidence.filter(p=>p!==f.bindingPath);
    f.receipt.outputDigests=[];fs.unlinkSync(path.join(f.nativeSource.root,f.bindingPath));}],
  ['changed renderer peer asset',f=>{fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- unreviewed -->');}],
  ['missing prior receipt',f=>{fs.unlinkSync(path.join(f.nativeSource.root,f.priorNativePath));}],
  ['prior evidence drift',f=>{f.put('review/metadata.json','changed prior witness');}],
])test('mixed existing rebind cannot permit '+name,t=>{
  const f=mixedApprovedRebindMemberFixture(t);assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  change(f);f.saveReceipt();
  for(const previous of [f.oldBank[0],structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
  }
});

test('mixed existing rebind retains the original actual previous-payload guard',t=>{
  const f=mixedApprovedRebindMemberFixture(t);f.previous.answer='not approved before';
  assert.equal(planQuestion(f).status,'SUPPLEMENT_PENDING');
});

test('source-only descendant replays the existing rebind members and current renderer proof',t=>{
  const f=preserveNativeSubset(mixedApprovedRebindMemberFixture(t),'preserve-existing-rebind-cohort');
  for(const previous of [f.oldBank[0],structuredClone(f.question)])
    assert.equal(planQuestion({...f,previous}).nativeReviewReceipt,f.receiptPath);
  fs.appendFileSync(path.join(f.nativeSource.root,f.solutionAsset),'<!-- changed ancestor renderer -->');
  for(const previous of [f.oldBank[0],structuredClone(f.question)]) {
    const result=planQuestion({...f,previous});assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
  }
});

test('mixed existing rebind also replays an earlier solution-only repair instead of replacing its authority',t=>{
  const f=mixedApprovedRebindMemberFixture(t),old=f.priorNativeReceipt,ordinal=f.ordinal;
  const oldBank=structuredClone(f.oldBank);oldBank[ordinal-1].solution='original solution-only repair input';
  const bytes=Buffer.from('window.questionBank='+JSON.stringify(oldBank)+';\n');
  const originalBlob=execFileSync('git',['hash-object','-w','--stdin'],{cwd:f.nativeSource.root,input:bytes,encoding:'utf8'}).trim();
  const originalFp=sourceFingerprint(oldBank[ordinal-1]),originalContent=contentFingerprint(oldBank[ordinal-1]);
  const row=old.appliedRecords.find(r=>r.questionUid===f.unchangedUid);
  old.fingerprintRepairs=[{questionUid:f.unchangedUid,sourceOrdinal:ordinal,
    metadataBefore:{sourceFingerprint:originalFp,contentFingerprint:originalContent},identityBefore:{sourceFingerprint:originalFp},
    after:{sourceFingerprint:row.sourceFingerprint,contentFingerprint:row.contentFingerprint},
    rebind:{priorSourceBlobSha1:originalBlob,priorContentFingerprint:originalContent}}];
  f.put(f.priorNativePath,old);f.receipt.approval.evidenceRefs.find(r=>r.path===f.priorNativePath).sha256=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.priorNativePath)));f.saveReceipt();
  assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  old.fingerprintRepairs[0].rebind.priorContentFingerprint='e'.repeat(64);
  f.put(f.priorNativePath,old);f.receipt.approval.evidenceRefs.find(r=>r.path===f.priorNativePath).sha256=f.sha(fs.readFileSync(path.join(f.nativeSource.root,f.priorNativePath)));f.saveReceipt();
  const result=planQuestion(f);assert.equal(result.status,'SUPPLEMENT_PENDING');assert.equal(result.final,undefined);
});

// Match the main-writer situation: three separately approved add-only binding
// requests bump the same pack before an otherwise unchanged native reassessment.
function approvedBindingVersionFixture(t,make=ordinaryReassessmentWithPriorFixture) {
  const f=make(t),dir=f.nativeSource.root,id='MIDDLE3',base='archive/data/meta-foundation/canonical/packs/middle3',
    packPath=base+'/pack.json',bindingPath=base+'/bindings.json',indexPath='archive/data/meta-foundation/canonical/registry_index.json',
    compiledPath='archive/data/meta-foundation/compiled/taxonomy_registry.json',runtimePath='archive/data/meta-foundation/runtime/middle3-v1.json',
    receiptBase='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
  const pack={packId:id,ownerPack:id,packVersion:'1.0.0',canonicalStatus:'ACTIVE',bindingCount:1,ownedStandardUnitDomains:['M3-01']};
  const bindings={status:'ACTIVE',bindingCount:1,bindings:[{...structuredClone(f.registry.bindingRows[0]),ownerPack:id}]};
  const taxonomy={problemTypes:[structuredClone(f.registry.problemTypes.get('PT_ROOT'))],templates:[structuredClone(f.registry.templates.get('TPL_ROOT'))]};
  taxonomy.problemTypes[0].problemTypeKey='PT_ROOT';taxonomy.templates[0].templateKey='TPL_ROOT';
  f.registry.problemTypes.set('PT_ROOT',structuredClone(taxonomy.problemTypes[0]));
  f.registry.templates.set('TPL_ROOT',structuredClone(taxonomy.templates[0]));
  // Technical-review fixtures commit these exact records in their native proof.
  for(const [collection,map]of [['problemTypes',f.registry.problemTypes],['templates',f.registry.templates]])
    for(const row of taxonomy[collection])if(!map.has(row.problemTypeKey||row.templateKey))throw Error('fixture definition missing');
  const compiled={status:'DERIVED_READ_ONLY',sourcePacks:[{packId:id,version:'1.0.0'}],...structuredClone(taxonomy)};
  const live={status:'ACTIVE',packId:id,packVersion:'1.0.0',generatedFrom:{},records:[]},providers=[];
  const raw=p=>fs.readFileSync(path.join(dir,p)),ref=p=>({path:p,sha256:f.sha(raw(p))});
  const writeAuthority=()=>{
    f.put(packPath,pack);f.put(bindingPath,bindings);f.put(base+'/taxonomy.json',taxonomy);f.put(base+'/aliases.json',{aliases:[]});
    compiled.sourcePacks[0].version=pack.packVersion;f.put(compiledPath,compiled);
    f.put(indexPath,{status:'ACTIVE',activePacks:[{id,version:pack.packVersion,status:'ACTIVE'}],
      canonicalSources:[packPath,bindingPath,base+'/taxonomy.json',base+'/aliases.json'].map(ref),compiledArtifacts:[ref(compiledPath)]});
    live.packVersion=pack.packVersion;live.records=structuredClone(f.receipt.runtimeRecords);f.put(runtimePath,live);
    f.registry.activePacks.get(id).version=pack.packVersion;
  };
  for(let n=1;n<=3;n++){
    const requestId='binding-version-step-'+n,requestPath='.archive-meta-register/inbox/'+requestId+'.json',receiptPath=receiptBase+requestId+'.json';
    const after={...bindings.bindings[0],subUnitKey:'M3-01-ADDED-'+n};
    const match=Object.fromEntries(['curriculum','problemTypeKey','standardCourse','standardUnitKey','subUnitKey'].map(k=>[k,after[k]]));
    const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId,scope:'PARTIAL_UIDS',expectedQuestionCount:3,
      sourceArchiveFile:source,expectedSourceBlobSha1:f.nativeSource.blobSha1,
      approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'binding-reviewer',evidenceRefs:[ref('review/metadata.json')]},
      items:f.receipt.appliedRecords.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,after:{problemTypeKey:r.problemTypeKey,templateKey:r.templateKey}})),
      registryChanges:[{path:bindingPath,collection:'bindings',match,before:null,after,evidenceRefs:[ref('review/metadata.json')]}]};
    f.put(requestPath,request);providers.push({request,requestPath,receiptPath});
  }
  writeAuthority();f.saveReceipt();f.git('add','.');f.git('-c','user.name=Fixture reviewer','-c','user.email=fixture@example.invalid','commit','-qm','Immutable prior and three binding requests');
  const anchor=f.git('rev-parse','HEAD');
  for(const [i,p]of providers.entries()){
    bindings.bindings.push(structuredClone(p.request.registryChanges[0].after));bindings.bindingCount=bindings.bindings.length;
    pack.bindingCount=bindings.bindingCount;pack.packVersion='1.0.'+(i+1);writeAuthority();
    const row=r=>({...structuredClone(r),metaFoundationPackVersion:pack.packVersion,
      metadataRevision:`meta-foundation:${id}@${pack.packVersion}:exam-final_qa-v2:${p.request.requestId}`});
    p.receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId:p.request.requestId,
      requestSha256:f.sha(f.stable(p.request)),sourceArchiveFile:source,sourceBlobSha1:f.nativeSource.blobSha1,sourceRawSha256:f.sha(f.nativeSource.bytes),
      expectedQuestionCount:3,metadataRegistrationStatus:'REGISTERED',approval:p.request.approval,registryChanges:p.request.registryChanges,
      appliedRecords:f.receipt.appliedRecords.map(row),runtimeRecords:f.receipt.runtimeRecords.map(row),outputDigests:[ref(packPath),ref(bindingPath)]};
    f.put(p.receiptPath,p.receipt);live.generatedFrom['reviewedExam_'+p.request.requestId]=p.receiptPath;
  }
  for(const rows of [f.receipt.appliedRecords,f.receipt.runtimeRecords])for(const row of rows){
    row.metaFoundationPackVersion='1.0.3';row.metadataRevision=`meta-foundation:${id}@1.0.3:exam-final_qa-v2:${f.receipt.requestId}`;
  }
  f.refreshBinding?.();f.saveReceipt();writeAuthority();
  const priorRef=f.receipt.approval.evidenceRefs.find(r=>r.path===f.priorNativePath);
  const check=()=>assertReviewedPackVersionLineage({root:dir,current:f.current,runtime:f.nativeSource.runtimeRecord,
    prior:f.priorNativeReceipt.appliedRecords.find(r=>r.questionUid===f.current.questionUid),
    priorRuntime:f.priorNativeReceipt.runtimeRecords.find(r=>r.questionUid===f.current.questionUid),priorReceiptRef:priorRef,registry:f.registry});
  const laterDefinition=()=>{
    f.git('add','.');f.git('-c','user.name=Fixture reviewer','-c','user.email=fixture@example.invalid','commit','-qm','Official issued version and receipts');
    for(const p of providers)fs.unlinkSync(path.join(dir,p.requestPath));
    taxonomy.templates.push({templateKey:'TPL_UNRELATED_NEW',parentProblemTypeKey:'PT_ROOT',ownerPack:id,status:'ACTIVE'});
    compiled.templates=structuredClone(taxonomy.templates);pack.packVersion='1.0.4';writeAuthority();
    f.git('add','.');f.git('-c','user.name=Fixture reviewer','-c','user.email=fixture@example.invalid','commit','-qm','Later unrelated definition, prior inbox consumed');
  };
  return Object.assign(f,{lineage:{check,pack,bindings,taxonomy,compiled,live,providers,anchor,writeAuthority,laterDefinition,
    packPath,bindingPath,indexPath,compiledPath,runtimePath,raw}});
}

for(const [name,make]of [['ordinary',ordinaryReassessmentWithPriorFixture],['renderer',ordinaryRendererReassessmentWithPriorFixture],
  ['mixed existing rebind',mixedApprovedRebindMemberFixture]])test('official pack binding lineage preserves '+name+' values across main registration',t=>{
  const f=approvedBindingVersionFixture(t,make),before=JSON.stringify([f.receipt,f.current,f.identity,f.nativeSource.runtimeRecord]);
  assert.equal(f.lineage.check(),true);
  for(const previous of [f.previous,structuredClone(f.question)]){
    const result=planQuestion({...f,previous});assert.equal(result.nativeReviewReceipt,f.receiptPath,JSON.stringify(result));assert.equal(result.final,undefined);
  }
  assert.equal(JSON.stringify([f.receipt,f.current,f.identity,f.nativeSource.runtimeRecord]),before);
});

test('historical issued pack lineage survives later unrelated PT/TPL registration and consumed inboxes',t=>{
  const f=approvedBindingVersionFixture(t,mixedApprovedRebindMemberFixture);f.lineage.laterDefinition();
  assert.equal(f.current.metaFoundationPackVersion,'1.0.3');assert.equal(f.registry.activePacks.get('MIDDLE3').version,'1.0.4');
  assert.equal(f.lineage.check(),true);assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  const next=preserveNativeSubset(f,'preserve-issued-pack-lineage');
  assert.equal(planQuestion(next).nativeReviewReceipt,next.receiptPath);
  fs.appendFileSync(path.join(next.nativeSource.root,next.solutionAsset),'<!-- changed ancestor renderer -->');
  assert.equal(planQuestion(next).status,'SUPPLEMENT_PENDING');
});

test('issued pack lineage remains verifiable after more than 64 unrelated main commits',t=>{
  const f=approvedBindingVersionFixture(t);f.lineage.laterDefinition();
  let parent=f.git('rev-parse','HEAD');const tree=f.git('rev-parse',parent+'^{tree}');
  for(let i=0;i<70;i++)parent=f.git('-c','user.name=Fixture reviewer','-c','user.email=fixture@example.invalid',
    'commit-tree',tree,'-p',parent,'-m','Unrelated main change '+i);
  f.git('update-ref','HEAD',parent);
  assert.equal(f.lineage.check(),true);assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
});

for(const [name,change]of [
  ['missing version step',f=>{delete f.lineage.live.generatedFrom['reviewedExam_binding-version-step-2'];f.lineage.writeAuthority();}],
  ['registry output digest',f=>{const p=f.lineage.providers[1];p.receipt.outputDigests[0].sha256='e'.repeat(64);f.put(p.receiptPath,p.receipt);}],
  ['replacement rather than add-only',f=>{const p=f.lineage.providers[1];p.receipt.registryChanges[0].before={status:'ACTIVE'};f.put(p.receiptPath,p.receipt);}],
  ['foreign curriculum in provider',f=>{const p=f.lineage.providers[1];p.receipt.registryChanges[0].after.curriculum='2022';f.put(p.receiptPath,p.receipt);}],
  ['request without immutable hash',f=>{const p=f.lineage.providers[1];p.receipt.requestSha256='e'.repeat(64);f.put(p.receiptPath,p.receipt);}],
  ['request without immutable source',f=>{const p=f.lineage.providers[1];p.receipt.sourceRawSha256='e'.repeat(64);f.put(p.receiptPath,p.receipt);}],
  ['changed original witness',f=>{const p=f.lineage.providers[1];p.receipt.approval.evidenceRefs[0].sha256='e'.repeat(64);f.put(p.receiptPath,p.receipt);}],
  ['forged official revision',f=>{f.current.metadataRevision='invented';f.saveReceipt();}],
  ['different approval kind',f=>{f.current.metadataApprovalType='REVIEW2';f.saveReceipt();}],
  ['changed semantic value',f=>{f.current.difficultyBucket=5;f.nativeSource.runtimeRecord.difficultyBucket=5;f.saveReceipt();}],
  ['changed identity value',f=>{f.identity.foreign='new';f.saveReceipt();}],
  ['compiled version mismatch',f=>{f.lineage.compiled.sourcePacks[0].version='1.0.2';f.put(f.lineage.compiledPath,f.lineage.compiled);}],
  ['canonical input digest mismatch',f=>{f.lineage.bindings.bindings[0].L1='changed';f.put(f.lineage.bindingPath,f.lineage.bindings);}],
  ['runtime pack version mismatch',f=>{f.lineage.live.packVersion='1.0.2';f.put(f.lineage.runtimePath,f.lineage.live);}],
  ['later changed selected definition',f=>{f.lineage.laterDefinition();f.lineage.taxonomy.templates[0].definition='unreviewed';f.lineage.compiled.templates=structuredClone(f.lineage.taxonomy.templates);f.lineage.writeAuthority();}],
  ['later changed exact binding',f=>{f.lineage.laterDefinition();f.lineage.bindings.bindings[0].L2='unreviewed';f.lineage.writeAuthority();}],
])test('official pack binding lineage refuses '+name+' without producer fallback',t=>{
  const f=approvedBindingVersionFixture(t);assert.equal(planQuestion(f).nativeReviewReceipt,f.receiptPath);
  change(f);const result=planQuestion(f);assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
});

// Exercise the actual CLI entry point; importing the API alone does not reveal
// a top-level-await cycle when its Consumer registrar imports the entry module.
function verificationCliFixture(t) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'auto-meta-verify-cli-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
  const put=(rel,value)=>{const file=path.join(dir,rel);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');return sha(fs.readFileSync(file));};
  const canon='archive/data/meta-foundation/canonical',compiled='archive/data/meta-foundation/compiled';
  const sources=[['metadata_rules',{status:'ACTIVE',integrationPatterns:['NONE']}],['condition_registry',{status:'ACTIVE',conditions:[]}]]
    .map(([name,value])=>{const p=canon+'/'+name+'.json';return {path:p,sha256:put(p,value)};});
  const artifacts=[['taxonomy_registry',{status:'DERIVED_READ_ONLY',problemTypes:[],templates:[]}],['concept_registry',{status:'DERIVED_READ_ONLY',concepts:[]}],
    ['condition_registry',{status:'DERIVED_READ_ONLY',conditions:[]}],['curriculum_bindings',{status:'DERIVED_READ_ONLY',bindings:[]}]]
    .map(([name,value])=>{const p=compiled+'/'+name+'.json';return {path:p,sha256:put(p,value)};});
  put(canon+'/registry_index.json',{status:'ACTIVE',activePacks:[],canonicalSources:sources,compiledArtifacts:artifacts});
  put('archive/data/question_metadata.json',{records:[]});put('archive/data/question_identity_map.json',{records:[]});
  const parent={grade:'fixture',curriculumKey:'fixture',courseKey:'fixture',L1:'fixture',L2:'fixture'};
  const masterSha=put('archive/'+canonical.CANONICAL_MASTER_PATH,{records:[{curriculum:'fixture',scope:'fixture',majorUnit:'fixture',midUnit:'fixture',concepts:[]}]});
  put('archive/data/archive2-canonical-projection-policy.json',{schemaVersion:'archive2-canonical-projection-policy-v1',status:'ACTIVE',canonicalMasterSha256:masterSha,gradeCourseAllowlist:[parent]});
  put('archive/data/archive2-item-review-overrides.json',{schemaVersion:'archive2-item-review-override-index-v1',records:[]});
  put('archive/data/basic-scope-parent-links.json',{schemaVersion:'archive2-basic-scope-parent-links-v1',status:'DERIVED_READ_ONLY',authority:{source:canonical.CANONICAL_MASTER_PATH,sha256:masterSha},records:[],sourceParents:[]});
  put('archive/data/archive2-catalog.json',{schemaVersion:'archive2-catalog-v1',indexVersion:'empty-cli-fixture',exams:[],records:[],sourceHashes:[]});
  const runtimePaths=canonical.runtimeInputPathsFromManifest([]);
  for(const relative of canonical.MANIFEST_REQUIRED_PATHS)if(!fs.existsSync(path.join(dir,'archive',relative)))
    put('archive/'+relative,runtimePaths.includes(relative)?{packId:path.basename(relative,'.json').toUpperCase().replaceAll('-','_'),packVersion:'1.0.0',status:'ACTIVE',records:[]}:{records:[]});
  const packs=runtimePaths.map(p=>JSON.parse(fs.readFileSync(path.join(dir,'archive',p),'utf8')));
  const files=[...new Set([...canonical.MANIFEST_REQUIRED_PATHS,...runtimePaths,...canonical.reviewedRegistrationProofPaths(packs)])]
    .map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(dir,'archive',p)))}));
  put('archive/data/archive2-canonical-input-manifest.json',{schemaVersion:'archive2-canonical-input-manifest-v1',resolverVersion:canonical.RESOLVER_VERSION,
    projectionVersion:'archive2-canonical-v1:'+sha(canonical.projectionManifestPayload(files,canonical.RESOLVER_VERSION)),files});
  put('report.json',{results:[]});
  const run=()=>{
    try {return {status:0,stdout:execFileSync(process.execPath,[path.join(root,'archive/tools/meta-foundation/auto-register-merged-source.mjs'),
      '--verify','--root',dir,'--report',path.join(dir,'report.json')],{encoding:'utf8',timeout:10000,stdio:['ignore','pipe','pipe']}),stderr:''};}
    catch(e){return {status:e.status,stdout:String(e.stdout||''),stderr:String(e.stderr||'')};}
  };
  return {dir,put,run};
}

test('main auto-meta verify CLI completes the Consumer registrar import cycle',t=>{
  const f=verificationCliFixture(t),paths=['archive/data/question_metadata.json','archive/data/question_identity_map.json','report.json'];
  const before=paths.map(p=>fs.readFileSync(path.join(f.dir,p)));
  const result=f.run();assert.equal(result.status,0,result.stderr);
  assert.deepEqual(JSON.parse(result.stdout),{status:'PASS',verifiedCount:0,verified:[],studentMutation:0});
  for(let i=0;i<paths.length;i++)assert.deepEqual(fs.readFileSync(path.join(f.dir,paths[i])),before[i]);
  assert.equal(fs.existsSync(path.join(f.dir,'.archive-meta-register/auto/last-verification.json')),false);
});

test('main auto-meta verify CLI preserves Consumer input digest rejection',t=>{
  const f=verificationCliFixture(t);
  fs.appendFileSync(path.join(f.dir,'archive/data/archive2-catalog.json'),'\n');
  const result=f.run();assert.equal(result.status,1,result.stderr);
  assert.match(result.stderr,/canonical input digest mismatch: data\/archive2-catalog\.json/);
  assert.doesNotMatch(result.stderr,/unsettled top-level await/);
});

test('main auto-meta verify CLI preserves missing registered UID rejection',t=>{
  const f=verificationCliFixture(t);
  f.put('report.json',{results:[{status:'APPLY',questionUid:'qid_v1_'+'a'.repeat(64),receiptPath:'.archive-meta-register/auto/receipts/missing.json'}]});
  const result=f.run();assert.equal(result.status,1,result.stderr);
  assert.match(result.stderr,/REGISTERED_UID_MISSING:qid_v1_a{64}/);
  assert.doesNotMatch(result.stderr,/unsettled top-level await/);
});

// ---- registration modes: a merge run handles only what that merge changed; the backlog waits for a digest run ----
test('registration mode: libraries read only the explicit variable; the writer alone infers merge from a push event',()=>{
  // Library/tool reader: no explicit value means digest, whatever CI event the process runs in.
  for(const env of [{},{GITHUB_EVENT_NAME:'push'},{GITHUB_EVENT_NAME:'schedule'},{GITHUB_EVENT_NAME:'pull_request'}])assert.equal(explicitRegistrationMode(env),'digest',JSON.stringify(env));
  assert.equal(explicitRegistrationMode({ARCHIVE_REGISTRATION_MODE:'merge'}),'merge');
  assert.equal(explicitRegistrationMode({GITHUB_EVENT_NAME:'push',ARCHIVE_REGISTRATION_MODE:'digest'}),'digest');
  assert.throws(()=>explicitRegistrationMode({ARCHIVE_REGISTRATION_MODE:'fast'}),/REGISTRATION_MODE_INVALID/);
  // Writer reader.
  assert.equal(inferRegistrationMode({GITHUB_EVENT_NAME:'push'}),'merge');
  for(const env of [{},{GITHUB_EVENT_NAME:'schedule'},{GITHUB_EVENT_NAME:'workflow_dispatch'},{GITHUB_EVENT_NAME:'pull_request'}])assert.equal(inferRegistrationMode(env),'digest');
  assert.equal(inferRegistrationMode({GITHUB_EVENT_NAME:'push',ARCHIVE_REGISTRATION_MODE:'digest'}),'digest');
  assert.equal(inferRegistrationMode({GITHUB_EVENT_NAME:'schedule',ARCHIVE_REGISTRATION_MODE:'merge'}),'merge');
  assert.throws(()=>inferRegistrationMode({ARCHIVE_REGISTRATION_MODE:'fast'}),/REGISTRATION_MODE_INVALID/);
  assert.throws(()=>selectTargets(root,{},{},'0'.repeat(40),undefined,'fast'),/REGISTRATION_MODE_INVALID/);
});
test('a push environment without an explicit mode never turns the registrar (function or CLI) into merge mode',()=>modeFixture(async f=>{
  seedMode(f);const before=f.stateBytes();
  process.env.GITHUB_EVENT_NAME='push';
  const plan=await f.run('plan',{plan:true});
  assert.equal(plan.mode,'digest');assert.equal(plan.targetCount,5,'backlog plus this merge, as in a digest run');
  const out=path.join(f.reports,'cli-plan.json'),env={...process.env,GITHUB_EVENT_NAME:'push',GITHUB_ACTIONS:''};delete env.ARCHIVE_REGISTRATION_MODE;
  const cli=spawnSync(process.execPath,[path.join(root,'archive/tools/meta-foundation/auto-register-merged-source.mjs'),'--root',f.dir,'--plan','--report',out],{encoding:'utf8',env});
  assert.equal(cli.status,0,cli.stderr);
  const cliPlan=JSON.parse(fs.readFileSync(out,'utf8'));assert.equal(cliPlan.mode,'digest');assert.equal(cliPlan.targetCount,5);
  const explicit=spawnSync(process.execPath,[path.join(root,'archive/tools/meta-foundation/auto-register-merged-source.mjs'),'--root',f.dir,'--plan','--report',out],{encoding:'utf8',env:{...env,ARCHIVE_REGISTRATION_MODE:'merge'}});
  assert.equal(explicit.status,0,explicit.stderr);assert.equal(JSON.parse(fs.readFileSync(out,'utf8')).targetCount,3,'only an explicit value selects merge');
  assert.deepEqual(f.stateBytes(),before);
}));
const refusingContext=async()=>({registry:{registrySha:'sha256:'+'c'.repeat(64)},validate(){},refreshRuntime(){},metadata:{records:[]},metaByUid:new Map(),
  identityMap:{records:[]},identityByJoin:new Map(),runtimes:new Map(),owners:new Map()});
// Two exam files. fixture.js is the one a merge changes; other.js only carries queued backlog. Every attempted target is refused
// by the empty context, which is enough to observe ordering, budget, markers and cursor without a registry.
async function modeFixture(fn,{maxQuestionsPerRun=2}={}) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'auto-meta-mode-')),git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();
  const savedActions=process.env.GITHUB_ACTIONS,savedMode=process.env.ARCHIVE_REGISTRATION_MODE,savedEvent=process.env.GITHUB_EVENT_NAME;
  const reports=dir+'-reports';fs.mkdirSync(reports);
  try {
    delete process.env.GITHUB_ACTIONS;delete process.env.ARCHIVE_REGISTRATION_MODE;delete process.env.GITHUB_EVENT_NAME;
    git('init','-q');git('config','user.email','test@example.invalid');git('config','user.name','fixture');
    const other='original/middle/m3/1mid/other.js';
    const put=(file,bank)=>{const full=path.join(dir,'archive/exams',file);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,'window.questionBank='+JSON.stringify(bank)+';\n');};
    const commit=()=>{git('add','.');git('commit','-qm','fixture');return git('rev-parse','HEAD');};
    const auto=name=>path.join(dir,'.archive-meta-register/auto',name);
    const setState=state=>{fs.mkdirSync(path.dirname(auto('x')),{recursive:true});fs.writeFileSync(auto('state.json'),JSON.stringify(state,null,2)+'\n');};
    const setConfig=head=>{fs.mkdirSync(path.dirname(auto('x')),{recursive:true});fs.writeFileSync(auto('config.json'),JSON.stringify({schemaVersion:'archive-main-merge-meta-v1',enabled:true,bootstrapBase:head,maxQuestionsPerRun,pilotTargets:[]}));};
    const state=()=>JSON.parse(fs.readFileSync(auto('state.json'),'utf8')),stateBytes=()=>fs.readFileSync(auto('state.json'));
    const run=(name,options={})=>registerMergedSource({root:dir,contextLoader:refusingContext,reportPath:path.join(reports,name+'.json'),...options});
    const report=name=>JSON.parse(fs.readFileSync(path.join(reports,name+'.json'),'utf8'));
    await fn({dir,git,put,commit,other,setState,setConfig,state,stateBytes,run,report,reports});
  } finally {
    for(const [name,value] of [['GITHUB_ACTIONS',savedActions],['ARCHIVE_REGISTRATION_MODE',savedMode],['GITHUB_EVENT_NAME',savedEvent]]){if(value===undefined)delete process.env[name];else process.env[name]=value;}
    fs.rmSync(dir,{recursive:true,force:true});fs.rmSync(reports,{recursive:true,force:true});
  }
}
// base: both files exist; head: this merge rewrote every question of fixture.js. State: cursor at base, two queued questions of other.js.
const seedMode=f=>{
  const bank=(n,a=1)=>Array.from({length:n},(_,i)=>({id:i+1,a}));
  f.put(source,bank(3));f.put(f.other,bank(2));const base=f.commit();
  f.put(source,bank(3,2));const head=f.commit();
  const pending={};for(const n of [1,2])pending[`${f.other}#${n}`]={sourceArchiveFile:f.other,sourceOrdinal:n,baseCommit:base};
  f.setConfig(base);f.setState({schemaVersion:'archive-main-merge-meta-v1',lastProcessedCommit:base,pending,completedPilots:[],latestReceipts:{}});
  return {base,head,pending};
};
test('merge mode selects only what changed since the cursor plus pilots, and never copies or edits the queued backlog',()=>modeFixture(f=>{
  const {base,head,pending}=seedMode(f),state={lastProcessedCommit:base,pending,completedPilots:[]};
  const before=JSON.stringify(state),stats={};
  const merge=selectTargets(f.dir,state,{bootstrapBase:base},head,stats,'merge');
  assert.deepEqual(merge.map(([k])=>k),[1,2,3].map(n=>`${source}#${n}`));
  assert.equal(stats.pendingBefore,2,'the report still knows how much is queued');assert.equal(JSON.stringify(state),before);
  const digest=selectTargets(f.dir,state,{bootstrapBase:base},head,{},'digest');
  assert.deepEqual(digest.map(([k])=>k),[`${source}#1`,`${source}#2`,`${source}#3`,`${f.other}#1`,`${f.other}#2`],'digest keeps the previous behaviour: backlog plus this merge, one alphabetical line');
  assert.deepEqual(selectTargets(f.dir,state,{bootstrapBase:base},head),digest,'the default is digest');
}));
test('merge mode starts from the durable cursor, so a skipped intermediate push loses nothing',()=>gitFixture(({dir,put,commit})=>{
  put([{id:1,a:1},{id:2,a:1},{id:3,a:1}]);const base=commit();
  put([{id:1,a:2},{id:2,a:1},{id:3,a:1}]);commit();            // push 1 (its own run was replaced in the concurrency queue)
  put([{id:1,a:2},{id:2,a:1},{id:3,a:2}]);const head=commit();  // push 2
  const keys=selectTargets(dir,{lastProcessedCommit:base,pending:{}},{bootstrapBase:base},head,undefined,'merge').map(([k])=>k);
  assert.deepEqual(keys,[`${source}#1`,`${source}#3`]);
}));
test('a digest run tries merge leftovers first; entries without the new fields are plain backlog in unchanged order',()=>modeFixture(f=>{
  const {base,head}=seedMode(f),mk=(file,n,extra={})=>[`${file}#${n}`,{sourceArchiveFile:file,sourceOrdinal:n,baseCommit:base,...extra}];
  const pending=Object.fromEntries([mk(f.other,1),mk(f.other,2,{origin:'merge',mergeHead:head}),mk(source,3,{origin:'merge',mergeHead:head})]);
  const keys=selectTargets(f.dir,{lastProcessedCommit:head,pending},{bootstrapBase:base},head,{},'digest').map(([k])=>k);
  assert.deepEqual(keys,[`${source}#3`,`${f.other}#2`,`${f.other}#1`],'merge leftovers first, alphabetical inside each group');
  const old={lastProcessedCommit:head,pending:Object.fromEntries([mk(f.other,2),mk(f.other,1)])};
  assert.deepEqual(selectTargets(f.dir,old,{bootstrapBase:base},head,{},'digest').map(([k])=>k),[`${f.other}#1`,`${f.other}#2`],'no markers: plain alphabetical');
  assert.deepEqual(backlogCounts(pending),{backlogRemaining:3,mergeBacklog:2});assert.deepEqual(backlogCounts(undefined),{backlogRemaining:0,mergeBacklog:0});
}));
test('merge mode with no changed exam question: plan reports zero targets, state.json is byte-identical, the backlog stays visible',()=>modeFixture(async f=>{
  const {base}=seedMode(f);
  fs.writeFileSync(path.join(f.dir,'derived.json'),'{}');f.commit();
  f.setState({schemaVersion:'archive-main-merge-meta-v1',lastProcessedCommit:f.git('rev-parse','HEAD'),pending:{[`${f.other}#1`]:{sourceArchiveFile:f.other,sourceOrdinal:1,baseCommit:base}},completedPilots:[],latestReceipts:{}});
  const before=f.stateBytes();
  const plan=await f.run('plan',{mode:'merge',plan:true});
  assert.equal(plan.status,'NO_CHANGE');assert.equal(plan.targetCount,0);assert.equal(plan.mode,'merge');
  assert.equal(plan.backlogRemaining,1,'NO_TARGETS is not "nothing left"');assert.equal(plan.mergeBacklog,0);
  assert.match(plan.note,/^NO_TARGETS/);assert.equal(plan.instrumentation.registration.backlogRemaining,1);
  const written=await f.run('write',{mode:'merge',write:true});
  assert.equal(written.status,'NO_CHANGE');assert.deepEqual(f.stateBytes(),before);
  await assert.rejects(()=>f.run('bad',{mode:'merge',plan:true,write:true}),/AUTO_META_PLAN_READ_ONLY/);
}));
test('merge mode with a changed exam: plan lists only that merge, with no queued entry and no write',()=>modeFixture(async f=>{
  seedMode(f);const before=f.stateBytes();
  const plan=await f.run('plan',{mode:'merge',plan:true});
  assert.equal(plan.status,'PLAN');assert.equal(plan.targetCount,3);assert.equal(plan.backlogRemaining,2);
  assert.deepEqual(f.stateBytes(),before);
  const digestPlan=await f.run('plan-digest',{mode:'digest',plan:true});
  assert.equal(digestPlan.targetCount,5,'a digest run also owns the two queued questions');
}));
test('merge run over the limit marks its unreached questions, advances the cursor, leaves the backlog byte-identical; the next digest run takes them first and clears the mark',()=>modeFixture(async f=>{
  const {base,head,pending}=seedMode(f);
  const merge=await f.run('merge',{mode:'merge',write:true});
  const after=f.state();
  assert.equal(after.lastProcessedCommit,head,'cursor and queued marks are written together');
  assert.deepEqual([after.pending[`${f.other}#1`],after.pending[`${f.other}#2`]],[pending[`${f.other}#1`],pending[`${f.other}#2`]],'queued backlog untouched');
  assert.equal(merge.results.length,2,'the limit of 2 applies to this merge only');
  for(const n of [1,2]){const e=after.pending[`${source}#${n}`];assert.ok(e.lastReasons?.length&&e.attemptSignature,'attempted and refused');assert.equal(e.origin,undefined);assert.equal(e.mergeHead,undefined);}
  assert.deepEqual(after.pending[`${source}#3`],{sourceArchiveFile:source,sourceOrdinal:3,baseCommit:base,origin:'merge',mergeHead:head});
  assert.equal(merge.mergeNotReached,1);assert.equal(merge.mergeBacklog,1);assert.equal(merge.backlogRemaining,5);assert.equal(merge.mode,'merge');
  assert.deepEqual(merge.instrumentation.registration,{mode:'merge',backlogRemaining:5,mergeBacklog:1,mergeNotReached:1});
  // The writer's replay of exactly this batch must stay idempotent with the new fields.
  const replay=await f.run('replay',{mode:'digest',replayReportPath:path.join(f.reports,'merge.json')});
  assert.equal(replay.replayVerified,true);assert.equal(replay.applied,0);assert.deepEqual(replay.plannedPaths,[]);
  const digest=await f.run('digest',{mode:'digest',write:true});
  const tried=digest.results.filter(r=>r.status!=='SUPPLEMENT_PENDING_UNCHANGED').map(r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`);
  assert.equal(tried[0],`${source}#3`,'the merge leftover is attempted before any older backlog');
  const done=f.state().pending[`${source}#3`];
  assert.ok(done.lastReasons?.length);assert.equal(done.origin,undefined);assert.equal(done.mergeHead,undefined,'the mark disappears once it was attempted');
  assert.equal(digest.mergeBacklog,0);assert.equal(digest.mode,'digest');
}));
test('digest run with markerless state behaves as before: whole backlog plus this merge, no marks written',()=>modeFixture(async f=>{
  const {base}=seedMode(f);
  const run=await f.run('digest',{mode:'digest',write:true});
  assert.equal(run.results.length,2,'limit 2 of 5 targets');
  const state=f.state();assert.equal(state.pending[`${source}#1`].lastReasons?.length>0,true);assert.equal(state.pending[`${f.other}#1`].lastReasons,undefined,'not reached, not touched');
  assert.ok(Object.values(state.pending).every(e=>e.origin===undefined&&e.mergeHead===undefined),'digest never marks anything');
  assert.equal(state.lastProcessedCommit,f.git('rev-parse','HEAD'));void base;
}));
test('merge run that fits in the limit handles exactly its own questions and leaves every queued entry untouched',()=>modeFixture(async f=>{
  const {pending}=seedMode(f);
  const run=await f.run('merge',{mode:'merge',write:true});
  assert.equal(run.results.length,3,'exactly the three questions of this merge');
  assert.equal(run.mergeNotReached,0);assert.equal(run.mergeBacklog,0);
  for(const key of Object.keys(pending))assert.deepEqual(f.state().pending[key],pending[key]);
},{maxQuestionsPerRun:100}));
test('a merge mark left on an entry that was already attempted (kept by an older writer) is dropped when the entry is skipped as unchanged',()=>modeFixture(async f=>{
  seedMode(f);
  await f.run('first',{mode:'digest',write:true});
  const state=f.state(),key=`${source}#1`;
  assert.ok(state.pending[key].attemptSignature);
  state.pending[key]={...state.pending[key],origin:'merge',mergeHead:'a'.repeat(40)};
  fs.writeFileSync(path.join(f.dir,'.archive-meta-register/auto/state.json'),JSON.stringify(state,null,2)+'\n');
  const run=await f.run('second',{mode:'digest',write:true});
  assert.ok(run.results.some(r=>r.status==='SUPPLEMENT_PENDING_UNCHANGED'&&r.sourceOrdinal===1));
  assert.equal(f.state().pending[key].origin,undefined);assert.equal(f.state().pending[key].mergeHead,undefined);
  assert.equal(f.state().pending[key].attemptSignature,state.pending[key].attemptSignature,'nothing else about the entry changes');
}));
// 결속은 발문+보기뿐이다: 정답·그림만 바뀌거나, 발문·보기가 바뀌어도 재결속 기록으로 같은 문제임이 확인된 문항은 이미 한 판정과 승인 이력을 그대로 둔다(2026-11-24).
// 확인되지 않은 발문·보기 수정만 예전처럼 "검토 대기"로 내린다. 이유: 정식 수정한 문항이 단원·교육과정 판정을 잃고 필터에서 빠졌다.
test('answer-only and figure-only edits keep the reviewed judgment (no demotion to review_required)',()=>{
  for(const edit of [q=>{q.answer='b';},q=>{q.image='new-figure.png';}]) {
    const f=fixture();f.previous=structuredClone(f.question);edit(f.question);
    f.identity.sourceFingerprint=sourceFingerprint(f.question);
    f.current={...f.current,metadataStatus:'approved_semantic_review',reviewStatus:'reviewed_pass',metadataApprovalType:'REVIEW2',problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',contentFingerprint:contentFingerprint(f.previous)};
    const r=planQuestion({...f,textRebinds:rebindsFor(uid,f.current.contentFingerprint,f.question)});
    assert.equal(r.status,'APPLY');assert.equal(r.coreChanged,false);assert.equal(r.preserveReview,true);
    assert.equal(r.final.metadataStatus,'approved_semantic_review');assert.equal(r.final.reviewStatus,'reviewed_pass');
  }
});
test('a stem edit confirmed by a rebind record keeps the judgment; the same edit without one is still demoted',()=>{
  const f=fixture();f.previous=structuredClone(f.question);f.question.content='question (corrected wording)';
  f.identity.sourceFingerprint=sourceFingerprint(f.question);
  const anchor=contentFingerprint(f.previous);
  f.current={...f.current,metadataStatus:'approved_semantic_review',reviewStatus:'reviewed_pass',metadataApprovalType:'REVIEW2',problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',contentFingerprint:anchor};
  const bound=planQuestion({...f,textRebinds:rebindsFor(uid,anchor,f.question)});
  assert.equal(bound.status,'APPLY');assert.equal(bound.coreChanged,false);assert.equal(bound.final.reviewStatus,'reviewed_pass');
  const unbound=planQuestion({...f,current:{...f.current,sourceFingerprint:sourceFingerprint(f.question)}});
  assert.equal(unbound.status,'APPLY');assert.equal(unbound.coreChanged,true);assert.equal(unbound.final.reviewStatus,'review_required');
});
// 단원 칸 승인(standardUnit·subUnit)은 발문·보기가 확인 없이 바뀐 문항에서만 함께 내려간다(contentFingerprint가 현재 지문으로 덮여 "묶인 승인"으로 오해되는 것을 막는다).
test('unit approval after a stem edit: unconfirmed edit drops it, answer/figure-only, rebound and approved_source rows keep it',()=>{
  const approvedRow=(f,unit='approved_final_qa')=>{
    f.current={...f.current,metadataStatus:'approved_semantic_review',reviewStatus:'reviewed_pass',metadataApprovalType:'REVIEW2',problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',
      contentFingerprint:contentFingerprint(f.previous),fieldStatus:{...f.current.fieldStatus,standardUnit:unit,subUnit:unit}};
  };
  const run=(edit,{rebind=false,unit}={})=>{
    const f=fixture();f.previous=structuredClone(f.question);edit(f.question);
    f.identity.sourceFingerprint=sourceFingerprint(f.question);approvedRow(f,unit);
    return planQuestion(rebind?{...f,textRebinds:rebindsFor(uid,f.current.contentFingerprint,f.question)}:f);
  };
  const stem=q=>{q.content='question (changed meaning)';};
  const dropped=run(stem);
  assert.equal(dropped.status,'APPLY');assert.equal(dropped.final.reviewStatus,'review_required');
  assert.equal(dropped.final.fieldStatus.standardUnit,'registered_main_merge');assert.equal(dropped.final.fieldStatus.subUnit,'registered_main_merge');
  for(const edit of [q=>{q.answer='b';},q=>{q.image='new-figure.png';}]) {
    const kept=run(edit,{rebind:true});
    assert.equal(kept.final.fieldStatus.standardUnit,'approved_final_qa');assert.equal(kept.final.fieldStatus.subUnit,'approved_final_qa');
  }
  const reboundStem=run(stem,{rebind:true});
  assert.equal(reboundStem.final.reviewStatus,'reviewed_pass');assert.equal(reboundStem.final.fieldStatus.standardUnit,'approved_final_qa');
  const declared=run(stem,{unit:'approved_source'});
  assert.equal(declared.final.reviewStatus,'review_required');
  assert.equal(declared.final.fieldStatus.standardUnit,'approved_source',"the source's own declared unit is not this judgment");
  assert.equal(declared.final.fieldStatus.subUnit,'approved_source');
});
