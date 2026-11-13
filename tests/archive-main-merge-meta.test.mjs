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
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source='original/middle/m3/1mid/fixture.js',uid='qid_v1_'+'a'.repeat(64);
function fixture() {
  const q={id:1,content:'question',choices:['a','b'],answer:'a',solution:'solution',curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-01',subUnitKey:'M3-01-ROOT',problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',level:'중',primaryMethod:'definition',decisiveStep:'positive root'};
  const previous={...q,problemTypeKey:null,templateKey:null};
  const current={...q,questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:1,problemTypeKey:'',templateKey:'',sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q),metadataStatus:'registration_pending_semantic_review',reviewStatus:'review_required',fieldStatus:{problemType:'manual_review_pending'}};
  const identity={questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:1,status:'VERIFIED',sourceFingerprint:sourceFingerprint(q)};
  const registry={status:'ACTIVE',registrySha:'sha256:'+'b'.repeat(64),problemTypes:new Map([['PT_ROOT',{status:'ACTIVE',ownerPack:'MIDDLE3',canonicalLabelKo:'Root'}]]),templates:new Map([['TPL_ROOT',{status:'ACTIVE',ownerPack:'MIDDLE3',parentProblemTypeKey:'PT_ROOT',canonicalLabelKo:'Root test'}]]),activePacks:new Map([['MIDDLE3',{version:'1.0.0'}]]),bindingRows:[{status:'ACTIVE',curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-01',subUnitKey:'M3-01-ROOT',problemTypeKey:'PT_ROOT',L1:'Numbers',L2:'Roots'}]};
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
function nativeReviewFixture(t,{omitFields=[],questionOverrides={},officialValidator=false,ordinal=1,globalQuestionNo=ordinal}={}) {
  const f=fixture(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'auto-meta-native-review-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  Object.assign(f.question,questionOverrides);Object.assign(f.current,questionOverrides);
  for(const field of omitFields){delete f.question[field];delete f.current[field];}
  if(officialValidator) {
    f.registry.concepts=new Map();f.registry.conditions=new Map();f.registry.integrationPatterns=new Set(['NONE']);
    f.registry.bindings=new Set(f.registry.bindingRows.map(b=>[b.curriculum,b.standardUnitKey,b.subUnitKey??'<DIRECT>',b.problemTypeKey].join('\0')));
    f.registry.activePacks.set('MIDDLE3',{id:'MIDDLE3',version:'1.0.0',status:'ACTIVE'});
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
