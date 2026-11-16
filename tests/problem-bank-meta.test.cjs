'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const meta = require('../archive/problem-bank-meta.js');
const approved = {uid:'ALITE-TEST', sourceKind:'generated', consumerSelectable:true,
  approval:'REVIEW_APPROVED', reviewStatus:'REVIEW_PASS', l2:'PHYSICAL',
  metaFinalSha256:'a'.repeat(64), sourceShardGitSha:'b'.repeat(40), metaReviewEvidenceSha256:'c'.repeat(64),
  meta:{rpmL1:'A',rpmL2:'B',rpmL3:'C',rpmL4:'D',difficultyBucket:5,
    crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE'}};
test('semantic RPM and physical storage bucket never alias; unknown differs from NONE', () => {
  const r=meta.projectGenerated(approved);
  assert.equal(r.L2,'B'); assert.equal(r.storageBucketKey,'PHYSICAL');
  assert.deepEqual(r.crossConceptKeys,[]);
  assert.equal(r.metaStatus.crossConceptKeys,'RECORDED_NOT_APPLICABLE');
  const x=meta.projectGenerated({...approved,meta:{level:'상'}});
  assert.equal(x.difficultyBucket,null); assert.equal(x.L2,null);
  assert.equal(x.conditionKeys,null); assert.equal(x.metaStatus.conditionKeys,'UNKNOWN');
  assert.equal(meta.projectGenerated({...approved,meta:{...approved.meta,conditionKeys:'NONE'}}).conditionKeys,null);
});
test('same query works for original and Generated, unknown does not fill a bucket', () => {
  const rows=meta.buildIndex([{questionUid:'qid_v1_test',sourceFile:'original/test.js',
    L1:'A',L2:'B',L3:'C',L4:'D',difficultyBucket:5}], [approved]);
  assert.equal(meta.query(rows,{L2:'B',difficultyBucket:5}).length,2);
  assert.equal(meta.query(rows,{L2:'PHYSICAL'}).length,0);
  assert.equal(meta.query(rows,{difficultyBucket:'UNKNOWN'}).length,0);
  assert.equal(meta.query(rows,{}, {profile:'VERIFIED'}).length,0);
  assert.throws(()=>meta.buildIndex([], [approved,approved]),/DUPLICATE/);
  const bound={...approved,metaFinalSha256:'a'.repeat(64),metaBrowsePath:{status:'EXACT_AUTHORITY_ALIAS',metaFinalSha256:'a'.repeat(64),L2:'canonical label'}};
  assert.equal(meta.projectGenerated(bound).L2,'canonical label');
  assert.equal(meta.projectGenerated(bound).rpmL2,'B','raw authority key is preserved');
  assert.equal(meta.projectGenerated({...bound,metaFinalSha256:'b'.repeat(64)}).L2,'B','stale alias is not consumed');
});
test('indexed Meta query preserves complete scan results and ordering', () => {
  const rows=meta.buildIndex([
    {questionUid:'qid_v1_a',sourceFile:'original/a.js',L1:'A',L2:'B',rpmL1:'A',difficultyBucket:2},
    {questionUid:'qid_v1_b',sourceFile:'original/b.js',L1:'A',L2:'C',rpmL1:'A',difficultyBucket:3},
    {questionUid:'qid_v1_c',sourceFile:'original/c.js',L1:'D',L2:'B',rpmL1:'D',difficultyBucket:2},
  ],[]);
  for (const filters of [
    {rpmL1:'A',difficultyBuckets:[2,3]},
    {L1:'A',L2:'C',difficultyBucket:3},
    {rpmL1:'missing'},
  ]) {
    const indexed=meta.query(rows,filters).map(row=>row.uid);
    const scanned=meta.query([...rows],filters).map(row=>row.uid);
    assert.deepEqual(indexed,scanned,JSON.stringify(filters));
  }
});
test('source availability, user disablement and Meta verification are independent axes', () => {
  assert.equal(meta.projectGenerated(approved,null,['ALITE-TEST']).directSelectable,false);
  assert.equal(meta.projectGenerated({...approved,reviewStatus:'HOLD'}).directSelectable,true);
  assert.equal(meta.projectGenerated(approved).verifiedEligible,false);
  const userApproved={...approved,approval:'USER_DIRECTED_QUALITY_APPROVED',reviewStatus:'USER_DIRECTED_QUALITY_APPROVED',reviewApprovalBasis:'USER_DIRECTED_QUALITY_APPROVED:scoped-directive'};
  assert.equal(meta.projectGenerated(userApproved).directSelectable,true);
  assert.equal(meta.projectGenerated(userApproved).verifiedEligible,false,'quality approval does not invent full verified Meta');
  const m={...approved.meta,secondaryConceptKeys:[],problemTypeKey:'PT',templateKey:'TPL'};
  const verified=meta.projectGenerated({...approved,meta:m,metaVerification:{
    status:'VERIFIED_CURRENT_SOURCE',sourceBound:true,reviewBytesBound:true,
    metaFinalSha256:approved.metaFinalSha256,sourceShardGitSha:approved.sourceShardGitSha,
    reviewEvidenceSha256:approved.metaReviewEvidenceSha256}});
  assert.equal(verified.verifiedEligible,true);
  const completeCurrentSource={...approved,meta:m,metaVerification:{
    status:'VERIFIED_CURRENT_SOURCE',sourceBound:true,reviewBytesBound:true,
    metaFinalSha256:approved.metaFinalSha256,sourceShardGitSha:approved.sourceShardGitSha,
    reviewEvidenceSha256:approved.metaReviewEvidenceSha256}};
  for (const field of ['rpmL1','rpmL2','rpmL3','rpmL4','secondaryConceptKeys','crossConceptKeys',
    'conditionKeys','integrationPattern','problemTypeKey','templateKey','difficultyBucket']) {
    assert.equal(meta.projectGenerated({...completeCurrentSource,meta:{...m,[field]:null}}).verifiedEligible,false,field+' remains required for Generated Meta');
  }
  assert.equal(meta.projectGenerated({...approved,meta:m,
    metaVerification:{status:'VERIFIED_CURRENT_SOURCE',sourceBound:true}}).verifiedEligible,false);
  for (const patch of [
    { metaFinalSha256:'d'.repeat(64) },
    { sourceShardGitSha:'e'.repeat(40) },
    { reviewEvidenceSha256:'f'.repeat(64) },
  ]) assert.equal(meta.projectGenerated({...approved,meta:m,metaVerification:{
    status:'VERIFIED_CURRENT_SOURCE',sourceBound:true,reviewBytesBound:true,
    metaFinalSha256:approved.metaFinalSha256,sourceShardGitSha:approved.sourceShardGitSha,
    reviewEvidenceSha256:approved.metaReviewEvidenceSha256,...patch}}).verifiedEligible,false);
});
test('actual complete catalog and all current Generated UIDs retain identity', () => {
  const c=core.decodeCatalog(JSON.parse(fs.readFileSync('archive/data/archive2-catalog.json')));
  const i=JSON.parse(fs.readFileSync('archive/data/generated-lite-consumer/v1/index.json'));
  const rows=meta.buildIndex(c.records,i.records,{excludedHoldUids:i.userDisabledUids});
  assert.equal(rows.length,c.records.length+i.records.length);
  assert.ok(c.records.length>=10000);
  assert.equal(rows.filter(r=>r.sourceKind==='generated'&&r.directSelectable).length,i.records.filter(r=>meta.isGeneratedSelectable(r,i.userDisabledUids)).length);
  assert.ok(rows.every(r=>r.uid));
  for(const bucket of [1,2,3,4,5])
    assert.ok(meta.query(rows,{difficultyBucket:bucket}).every(r=>r.difficultyBucket===bucket));
  assert.deepEqual(c.records.map(r=>r.questionUid),rows.slice(0,c.records.length).map(r=>r.questionUid));
});
test('buildIndex names the offending source row when identity is missing or duplicated', () => {
  const sourceFile='similar/middle/m3/2mid/26_삼산중_2학기_중간_중3_유사.js';
  assert.throws(()=>meta.buildIndex([{sourceFile,sourceOrdinal:3}],[]),err=>
    /PROBLEM_BANK_DUPLICATE_OR_MISSING_UID/.test(err.message)&&
    err.message.includes('EMPTY_UID')&&err.message.includes(`${sourceFile}#3`));
  assert.throws(()=>meta.buildIndex([
    {questionUid:'qid_v1_dup',sourceFile,sourceOrdinal:7},
    {questionUid:'qid_v1_dup',sourceFile,sourceOrdinal:9},
  ],[]),err=>err.message.includes(`${sourceFile}#9`)&&
    err.message.includes(`already indexed at ${sourceFile}#7`));
  // Uniqueness stays enforced for generated rows without a source locator.
  assert.throws(()=>meta.buildIndex([], [approved,approved]),/DUPLICATE/);
});
test('every DB-tracked exam source has identity and metadata for each question ordinal', () => {
  const context={window:{},console:{log(){},warn(){},error(){}}};
  vm.runInNewContext(fs.readFileSync('archive/db.js','utf8'),context,{filename:'archive/db.js'});
  const examSource=context.window.mainDB.exams;
  const identity=JSON.parse(fs.readFileSync('archive/data/question_identity_map.json','utf8'));
  const metadata=JSON.parse(fs.readFileSync('archive/data/question_metadata.json','utf8'));
  const metadataUids=new Set(metadata.records.map(r=>r.questionUid));
  // The 21-source batch that produced 971 empty questionUid catalog rows had no
  // identity or metadata rows at all; uniqueness alone did not expose it.
  assert.equal(new Set(identity.records.map(r=>r.questionUid)).size,identity.records.length,'identity UIDs stay unique');
  const bySource=new Map();
  for (const row of identity.records) {
    const file=core.normalizeFile(row.sourceArchiveFile);
    if (!bySource.has(file)) bySource.set(file,[]);
    bySource.get(file).push(row);
  }
  for (const exam of examSource) {
    const file=core.normalizeFile(exam.file), qCount=Number(exam.qCount), rows=bySource.get(file)||[];
    assert.equal(rows.length,qCount,`${file} identity coverage`);
    assert.deepEqual(rows.map(r=>Number(r.sourceOrdinal)).sort((a,b)=>a-b),
      Array.from({length:qCount},(_,i)=>i+1),`${file} identity ordinals`);
    assert.ok(rows.every(r=>r.questionUid&&metadataUids.has(r.questionUid)),`${file} identity to metadata join`);
  }
});
test('catalog keeps a canonical UID for every question of every exam', () => {
  const c=core.decodeCatalog(JSON.parse(fs.readFileSync('archive/data/archive2-catalog.json','utf8')));
  const metadataUids=new Set(JSON.parse(fs.readFileSync('archive/data/question_metadata.json','utf8'))
    .records.map(r=>r.questionUid));
  assert.deepEqual(c.records.filter(r=>!r.questionUid).map(r=>`${r.sourceFile}#${r.sourceOrdinal}`),[],
    'no catalog row may lose questionUid');
  assert.ok(c.records.every(r=>metadataUids.has(r.questionUid)),'catalog identity joins metadata');
  const counts=new Map();
  for (const r of c.records) counts.set(core.normalizeFile(r.sourceFile),(counts.get(core.normalizeFile(r.sourceFile))||0)+1);
  for (const exam of c.exams)
    assert.equal(counts.get(core.normalizeFile(exam.file)),Number(exam.qCount),`${exam.file} catalog coverage`);
});
test('regression: similar/m3/2mid 26_삼산중 유사 keeps deterministic qid_v1 identity', () => {
  const sourceFile='similar/middle/m3/2mid/26_삼산중_2학기_중간_중3_유사.js';
  const formula=ordinal=>'qid_v1_'+crypto.createHash('sha256')
    .update(core.normalizeFile(sourceFile)+'#'+ordinal).digest('hex');
  const c=core.decodeCatalog(JSON.parse(fs.readFileSync('archive/data/archive2-catalog.json','utf8')));
  const rows=c.records.filter(r=>core.normalizeFile(r.sourceFile)===sourceFile);
  assert.equal(rows.length,24,`${sourceFile} catalog rows`);
  // #1 is the row whose identity was lost: pin the literal sha256(path#1) digest
  // and the projectOriginal projection so a hashing/path change cannot silently
  // mint a different canonical UID.
  const pinned='qid_v1_64196b5623c0fa391c7425a28a0699765cbdcd9e217c11b4e66e7f40c9dd285a';
  assert.equal(formula(1),pinned,`${sourceFile}#1 sha256(path#1) digest`);
  const row1=rows.find(r=>Number(r.sourceOrdinal)===1);
  assert.ok(row1,`${sourceFile}#1 catalog row`);
  assert.equal(row1.questionUid,pinned,`${sourceFile}#1 pinned UID`);
  const projected=meta.projectOriginal(row1);
  assert.equal(projected.uid,pinned,`${sourceFile}#1 projectOriginal uid`);
  assert.deepEqual({sourceFile:projected.sourceRelation.sourceFile,sourceOrdinal:projected.sourceRelation.sourceOrdinal},
    {sourceFile,sourceOrdinal:1},`${sourceFile}#1 projectOriginal source locator`);
  assert.equal(projected.sourceRelation.status,'RECORDED',`${sourceFile}#1 projectOriginal source status`);
  for (const row of rows) {
    assert.equal(row.questionUid,formula(row.sourceOrdinal),`${sourceFile}#${row.sourceOrdinal} path#ordinal UID`);
    assert.equal(row.identityStatus,'VERIFIED',`${sourceFile}#${row.sourceOrdinal} identity status`);
  }
  const identity=JSON.parse(fs.readFileSync('archive/data/question_identity_map.json','utf8'));
  const identityRows=identity.records.filter(r=>core.normalizeFile(r.sourceArchiveFile)===sourceFile);
  assert.deepEqual(identityRows.map(r=>Number(r.sourceOrdinal)).sort((a,b)=>a-b),
    Array.from({length:24},(_,i)=>i+1),'identity rows exist for every ordinal');
  assert.ok(identityRows.every(r=>r.questionUid===formula(Number(r.sourceOrdinal))),'identity keeps the deterministic UID');
});

function registeredMiddleDisplayFixture(curriculum='2015') {
  const questionUid='qid_v1_'+'1'.repeat(64), sourceFile='original/middle/m3/2mid/display-fixture.js';
  const sourceFingerprint='2'.repeat(64), assignmentFingerprint='3'.repeat(64);
  return {
    meta:{questionUid,sourceArchiveFile:sourceFile,sourceOrdinal:1,sourceFingerprint,contentFingerprint:assignmentFingerprint,
      metadataApprovalType:'FINAL_QA',metadataStatus:'approved_semantic_review',
      metadataRevision:'meta-foundation:MIDDLE3@1.0.8:exam-final_qa-v2:fixture',
      fieldStatus:{standardUnit:'approved_final_qa',subUnit:'approved_final_qa'},approvalEvidence:['evidence/exact-receipt.json'],
      curriculum,curriculumKey:curriculum,courseKey:'M3-2',standardCourse:'중3 수학',
      standardUnitKey:'M3-05',standardUnit:'삼각비',subUnitKey:'M3-05-TRIG_RATIO',subUnit:'삼각비'},
    identity:{questionUid,sourceArchiveFile:sourceFile,sourceOrdinal:1},sourceFile,sourceOrdinal:1,sourceGrade:'중3',
    sourceFingerprint,assignmentFingerprint,
    gradeCourseAllowlist:['2015','2022'].map(curriculumKey=>({grade:'중3',curriculumKey,courseKey:'M3-2'})),
    scopeParents:['2015','2022'].map(curriculumKey=>({grade:'중3',curriculumKey,courseKey:'M3-2',
      standardUnitKey:'M3-05',subUnitKey:'M3-05-TRIG_RATIO',L1:'M3-'+curriculumKey,L2:'TRIG-'+curriculumKey})),
    canonicalParents:['2015','2022'].map(curriculumKey=>({curriculumKey,courseKey:'M3-2',L1:'M3-'+curriculumKey,L2:'TRIG-'+curriculumKey})),
  };
}

test('registered middle course display keeps the exact approved semester and curriculum', () => {
  for(const curriculum of ['2015','2022']) {
    const input=registeredMiddleDisplayFixture(curriculum), before=structuredClone(input);
    const result=meta.createSourceBoundDisplayProjection(input);
    assert.equal(result.reason,'');assert.equal(result.projection.courseKey,'M3-2');
    assert.equal(result.projection.curriculumKey,curriculum);
    assert.equal(result.projection.standardCourse,'중3 수학');
    assert.equal(result.projection.L1,'M3-'+curriculum);assert.equal(result.projection.L2,'TRIG-'+curriculum);
    assert.equal(result.projection.displayOnly,true);assert.equal(result.projection.sourceBinding.bindingMode,'EXACT');
    assert.deepEqual(input,before,'projection must not rewrite an approved value or input');
  }
});

test('registered middle course display rejects unknown aliases and conflicting course authority', async t => {
  const mutations=[
    ['missing semester',x=>delete x.meta.courseKey],
    ['unregistered semester',x=>x.meta.courseKey='M3-9'],
    ['wrong grade key',x=>x.meta.courseKey='M2-2'],
    ['unknown display alias',x=>x.meta.standardCourse='unreviewed alias'],
    ['different grade display alias',x=>x.meta.standardCourse='중2 수학'],
    ['missing explicit curriculum',x=>delete x.meta.curriculumKey],
    ['unknown curriculum',x=>{x.meta.curriculumKey='2030';x.meta.curriculum='2030';}],
    ['2015 and 2022 conflict',x=>x.meta.curriculum='2022'],
    ['RPM curriculum conflict',x=>x.meta.rpmCurriculum='2022'],
    ['course not allowlisted',x=>x.gradeCourseAllowlist=[]],
    ['grade not allowlisted',x=>x.sourceGrade='중2'],
    ['non-FINAL_QA producer',x=>x.meta.metadataApprovalType='REVIEW2'],
  ];
  for(const [label,mutate]of mutations)await t.test(label,()=>{
    const input=registeredMiddleDisplayFixture();mutate(input);
    assert.equal(meta.createSourceBoundDisplayProjection(input).projection,null);
  });
});

test('registered middle course display retains identity, approval and exact-parent gates', async t => {
  const mutations=[
    ['fingerprint mismatch',x=>x.sourceFingerprint='4'.repeat(64),'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH'],
    ['identity mismatch',x=>x.identity.questionUid='qid_v1_'+'5'.repeat(64),'DISPLAY_PROJECTION_IDENTITY_MISMATCH'],
    ['approval missing',x=>x.meta.fieldStatus.standardUnit='pending','DISPLAY_PROJECTION_CORE_APPROVAL_MISSING'],
    ['missing parent',x=>x.scopeParents=[],'DISPLAY_PROJECTION_PARENT_MISSING'],
    ['parent for another semester',x=>x.scopeParents.forEach(r=>r.courseKey='M3-1'),'DISPLAY_PROJECTION_PARENT_MISSING'],
    ['parent for another curriculum',x=>x.scopeParents=x.scopeParents.filter(r=>r.curriculumKey==='2022'),'DISPLAY_PROJECTION_PARENT_MISSING'],
    ['ambiguous course',x=>x.gradeCourseAllowlist.push({...x.gradeCourseAllowlist[0]}),'DISPLAY_PROJECTION_COURSE_AMBIGUOUS'],
    ['ambiguous parent',x=>x.scopeParents.push({...x.scopeParents[0]}),'DISPLAY_PROJECTION_PARENT_AMBIGUOUS'],
    ['missing canonical parent',x=>x.canonicalParents=[],'DISPLAY_PROJECTION_CANONICAL_PARENT_MISSING'],
  ];
  for(const [label,mutate,reason]of mutations)await t.test(label,()=>{
    const input=registeredMiddleDisplayFixture();mutate(input);
    const result=meta.createSourceBoundDisplayProjection(input);assert.equal(result.projection,null);assert.equal(result.reason,reason);
  });
});

test('registered middle course display does not create verification, RPM values or approval', () => {
  const input=registeredMiddleDisplayFixture(),result=meta.createSourceBoundDisplayProjection(input);
  assert(result.projection);assert.equal(result.projection.metaVerification,undefined);
  for(const key of ['rpmL1','rpmL2','rpmL3','rpmL4'])assert.equal(result.projection[key],undefined);
  const record={questionUid:input.meta.questionUid,sourceFile:input.sourceFile,sourceOrdinal:1,
    metaProjection:result.projection,metaProjectionStatus:'DISPLAY_ONLY_SOURCE_BOUND',
    metadataRevision:input.meta.metadataRevision,currentSourceJsSha256:'6'.repeat(64),
    reviewedExamRegistration:{schemaVersion:'archive-reviewed-exam-registration-projection-v2',
      sourceJsSha256:'6'.repeat(64),metadataRevision:input.meta.metadataRevision,reference:'native.json',sha256:'7'.repeat(64)},
    assignmentEvidence:{reviewEvidence:{reference:'native.json',sha256:'7'.repeat(64)}}};
  const projected=meta.projectOriginal(record);
  assert.equal(projected.directSelectable,true);assert.equal(projected.verifiedEligible,false);
  assert.equal(meta.query([projected],{},{}).length,1);
  assert.equal(meta.query([projected],{},{profile:'VERIFIED'}).length,0);
  for(const key of ['rpmL1','rpmL2','rpmL3','rpmL4'])assert.equal(projected[key],null);
});

test('registered middle course display leaves existing literal high-school courses unchanged', () => {
  const input=registeredMiddleDisplayFixture();input.sourceGrade='고1';input.meta.standardCourse='수학(상)';
  input.meta.metadataApprovalType='REVIEW2';delete input.meta.courseKey;
  input.gradeCourseAllowlist=[{grade:'고1',curriculumKey:'2015',courseKey:'수학(상)'}];
  input.scopeParents=[{grade:'고1',curriculumKey:'2015',courseKey:'수학(상)',standardUnitKey:'M3-05',
    subUnitKey:'M3-05-TRIG_RATIO',L1:'A',L2:'B'}];
  input.canonicalParents=[{curriculumKey:'2015',courseKey:'수학(상)',L1:'A',L2:'B'}];
  const result=meta.createSourceBoundDisplayProjection(input);
  assert.equal(result.reason,'');assert.equal(result.projection.courseKey,'수학(상)');
  assert.equal(result.projection.standardCourse,'수학(상)');
});
