import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {planQuestion,sourceFingerprint,contentFingerprint,loadBank,sourcePath,selectTargets,classifySourceFingerprintDrift} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
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
function solutionOnlyFixture(){
  const f=fixture();
  f.previous=structuredClone(f.question);
  f.question.solution='revised explanation, same answer';
  f.current.sourceFingerprint=sourceFingerprint(f.previous);
  f.current.contentFingerprint=contentFingerprint(f.previous);
  f.current.metadataStatus='approved_semantic_review';
  f.current.reviewStatus='reviewed_pass';
  f.current.metadataApprovalType='REVIEW2';
  f.current.approvalEvidence=['real-prior-metadata-review.json'];
  f.current.independentMathReviewStatus='PASS';
  f.current.problemTypeKey='PT_ROOT';f.current.templateKey='TPL_ROOT';
  return f;
}
test('S1: reviewed, Git-anchored solution-only change rebinds identity without inheriting solution QA',()=>{
  const f=solutionOnlyFixture(),input=JSON.stringify(f.question);
  const r=planQuestion(f);
  assert.equal(r.status,'APPLY');assert.equal(r.rebindIdentity,true);
  assert.equal(r.fingerprintCause,'SOLUTION_ONLY_PROVEN');
  assert.equal(r.rebindProof.before,sourceFingerprint(f.previous));
  assert.equal(r.rebindProof.after,sourceFingerprint(f.question));
  assert.equal(r.final.reviewStatus,'reviewed_pass');
  assert.equal(r.final.metadataApprovalType,'REVIEW2');
  assert.equal(r.final.independentMathReviewStatus,'NOT_PERFORMED_BY_AUTO_REGISTRAR');
  assert.equal(JSON.stringify(f.question),input);
  f.identity.sourceFingerprint=r.rebindProof.after;
  const replay=planQuestion({...f,current:r.final,priorReceipt:{inputHash:r.inputHash,metadataRegistrationStatus:'REGISTERED'}});
  assert.equal(replay.status,'ALREADY_REGISTERED');
});
test('S1: no approved evidence means fingerprint mismatch remains pending',()=>{
  const f=solutionOnlyFixture();f.current.approvalEvidence=[];
  const r=planQuestion(f);
  assert.deepEqual(r.reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);
  assert.equal(r.fingerprintCause,'REVIEWED_METADATA_EVIDENCE_MISSING');
});
test('S1: old fingerprint must match actual Git baseline before rebinding',()=>{
  const f=solutionOnlyFixture();f.identity.sourceFingerprint='a'.repeat(64);
  assert.equal(planQuestion(f).fingerprintCause,'OLD_FINGERPRINT_NOT_ANCHORED');
});
test('S1: metadata sidecar must match the same historical fingerprint',()=>{
  const f=solutionOnlyFixture();f.current.sourceFingerprint='b'.repeat(64);
  assert.equal(planQuestion(f).fingerprintCause,'METADATA_IDENTITY_DIVERGED');
});
test('S1: question text and figure changes cannot be reclassified as a solution-only edit',()=>{
  for(const field of ['content','image','choices']){
    const f=solutionOnlyFixture();
    f.question[field]=field==='choices'?['altered']:'altered';
    const r=planQuestion(f);
    assert.deepEqual(r.reasons,['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']);
    assert.equal(r.fingerprintCause,'QUESTION_OR_IMAGE_CHANGED');
  }
});
test('S1: changed answer and non-fingerprint student/metadata fields are refused',()=>{
  for(const [field,value] of [['answer','new-answer'],['questionType','new-type'],['primaryMethod','changed-method']]){
    const f=solutionOnlyFixture();f.question[field]=value;
    assert.equal(planQuestion(f).fingerprintCause,'ANSWER_OR_OTHER_FIELDS_CHANGED');
  }
});
test('S1: ordinal shift refuses rebind before inspecting fingerprints',()=>{
  const f=solutionOnlyFixture();f.question.id=2;
  assert.deepEqual(planQuestion(f).reasons,['SOURCE_ORDINAL_CHANGED']);
});
test('S1: metadata-only edit needs no identity rebind',()=>{
  const f=fixture();f.question.primaryMethod='updated-meaning';
  const drift=classifySourceFingerprintDrift({question:f.question,previous:f.previous,current:f.current,identity:f.identity});
  assert.equal(drift.cause,'CURRENT_MATCH');assert.equal(drift.canRebind,false);
});
test('unrelated metadata fingerprint conflict is refused',()=>{const f=fixture();f.current.sourceFingerprint='bad';assert.deepEqual(planQuestion(f).reasons,['METADATA_SOURCE_FINGERPRINT_CONFLICT']);});
test('runtime owner is not silently moved',()=>{const f=fixture();f.runtimeOwner='OTHER';assert.deepEqual(planQuestion(f).reasons,['EXISTING_RUNTIME_OWNER_CONFLICT']);});
test('missing semantic rationale is not synthesized',()=>{const f=fixture();delete f.question.decisiveStep;assert.deepEqual(planQuestion(f).reasons,['SOURCE_SEMANTIC_RATIONALE_MISSING']);});
test('unknown difficulty is retained as debt',()=>{const f=fixture();f.question.difficultyBucket='UNKNOWN';assert.ok(planQuestion(f).reasons.includes('DIFFICULTY_INCOMPLETE'));});
test('unchanged approved values keep independent review provenance',()=>{const f=fixture();f.previous=structuredClone(f.question);f.current={...f.current,problemTypeKey:'PT_ROOT',templateKey:'TPL_ROOT',metadataStatus:'approved_semantic_review',reviewStatus:'reviewed_pass',metadataApprovalType:'REVIEW2'};const r=planQuestion(f);assert.equal(r.final.reviewStatus,'reviewed_pass');assert.equal(r.final.metadataApprovalType,'REVIEW2');assert.equal(r.preserveReview,true);});
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
