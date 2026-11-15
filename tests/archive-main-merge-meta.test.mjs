import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {planQuestion,nativeReviewReceipt,activeBindingContext,sourceFingerprint,contentFingerprint,loadBank,sourcePath,selectTargets} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {validateActiveMetaFields} from '../archive/tools/meta-foundation/active-registry.mjs';
import {validateReviewedSourceReassessment,REASSESSED_STUDENT_FIELDS} from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import {nativeReviewedFigureRebind} from '../archive/tools/meta-foundation/native-reviewed-figure-reuse.mjs';
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
test('identity fingerprint drift is refused',()=>{const f=fixture();f.identity.sourceFingerprint='bad';assert.deepEqual(planQuestion(f).reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);});
test('unrelated metadata fingerprint conflict is refused',()=>{const f=fixture();f.current.sourceFingerprint='bad';assert.deepEqual(planQuestion(f).reasons,['METADATA_SOURCE_FINGERPRINT_CONFLICT']);});
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
function partialNativeReviewFixture(t) {
  const f=nativeReviewFixture(t,{ordinal:3,questionOverrides:{id:3},
    omitFields:['difficultyBoundaryFlag','legacyLevelCompatibility'],officialValidator:true});
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
function solutionRebindNativeFixture(t) {
  const f=partialNativeReviewFixture(t),oldBank=structuredClone(f.nativeSource.bank);
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

function reviewedFigureNativeFixture(t,{form='image',mutateCurrent,mutatePending,mutateIndependent,mutateRenderer,nestedDependency=false,genericReview=false}={}) {
  const f=partialNativeReviewFixture(t),dir=f.nativeSource.root;
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
  put(nativePath,native);
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

test('a claimed current figure row cannot drop its repair after the cursor catches up',async t=>{
  for(const [name,change]of [
    ['sourceReview removed',f=>{delete f.receipt.fingerprintRepairs[0].sourceReview;}],
    ['repair entry removed',f=>{f.receipt.fingerprintRepairs=[];}],
  ])await t.test(name,t=>{const f=reviewedFigureNativeFixture(t);f.previous=structuredClone(f.question);
    assert.equal(planQuestion(f).status,'ALREADY_REGISTERED');change(f);f.saveReceipt();
    assert.notEqual(planQuestion(f).status,'ALREADY_REGISTERED');});
});
