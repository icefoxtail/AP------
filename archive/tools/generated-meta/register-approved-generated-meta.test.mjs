import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import { registerApprovedGeneratedMeta, withdrawGeneratedUid, metaSha256, sha256Bytes, gitBlobSha } from './register-approved-generated-meta.mjs';
import gate from '../generated-meta-retention-gate.cjs';
import problemBankMeta from '../../problem-bank-meta.js';
import assessmentRecipes from '../../problem-bank-assessment-recipes.js';
const { validateReviewBinding, validateAuthorityBinding, validateMetaTaxonomyBindings, audit } = gate;

const metaTemplate = {
  rpmL1: 'H1-L1', rpmL2: 'H1-L2', rpmL3: 'H1-L3', rpmL4: 'H1-L4',
  rpmL4Namespace: 'RPM_EXISTING_DRAFT', rpmPrimaryRecordId: 'TEST-RPM-001',
  rpmDraftAuthorityRef: 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json', secondaryConceptKeys: [], crossConceptKeys: [], conditionKeys: [],
  integrationPattern: 'NONE', difficultyBucket: 4, level: '상',
  problemTypeKey: null, templateKey: null,
  metaDebt: { problemTypeKey: 'UNKNOWN: no exact mapping evidence', templateKey: 'UNKNOWN: no exact template evidence' }
};

function fixture({ unregistered = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-meta-register-'));
  for (const rel of [
    'archive/data/meta-foundation/compiled/taxonomy_registry.json',
    'archive/data/meta-foundation/compiled/concept_registry.json',
    'archive/data/meta-foundation/compiled/condition_registry.json',
    'archive/data/meta-foundation/canonical/metadata_rules.json'
  ]) {
    const target = path.join(root, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(process.cwd(), rel), target);
  }
  const rel = {
    sourceShard: 'archive/generated/lite/v1/test/shards/source.js',
    sourceMetadata: 'archive/generated/lite/v1/test/metadata/source.json',
    consumerShard: 'archive/data/generated-lite-consumer/v1/shards/test/consumer.json',
    consumerIndex: 'archive/data/generated-lite-consumer/v1/index.json',
    evidence: 'alive/06_EXECUTION/test/review.json'
  };
  for (const value of Object.values(rel)) fs.mkdirSync(path.dirname(path.join(root, value)), { recursive: true });
  const question = { id: 1, uid: 'ALITE-TEST-001', content: '$x+1$', choices: ['1', '2'], answer: '①', solution: '계산', solutionImage: 'assets/test/q1.svg', standardUnitKey: 'H1', subUnitKey: 'H1-PHYSICAL', level: '중', difficultyBucket: 3 };
  question.standardCourse = '공통수학1';
  const meta = structuredClone(metaTemplate);
  const rpmAuthority = { schemaVersion: 'rpm-primary-active-crosswalk-v1', rpmAuthority: { status: 'LOCKED' }, records: [{ id: meta.rpmPrimaryRecordId, curriculum: '2022', scope: 'H1-SCOPE', standardCourse: question.standardCourse, standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey, rpmPath: { majorUnit: 'H1-L1', midUnit: 'H1-L2', l3: 'H1-L3', l4: 'H1-L4' } }] };
  const rpmBytes = Buffer.from(JSON.stringify(rpmAuthority, null, 2) + '\n');
  const rpmFile = path.join(root, meta.rpmDraftAuthorityRef);
  fs.mkdirSync(path.dirname(rpmFile), { recursive: true }); fs.writeFileSync(rpmFile, rpmBytes);
  meta.rpmDraftAuthoritySha256 = sha256Bytes(rpmBytes);
  const sourceQuestion = { ...question }; delete sourceQuestion.uid;
  const sourceBytes = Buffer.from(`window.examTitle = "Fixture";window.extraConfig={keep:true};\nwindow.questionBank = ${JSON.stringify([sourceQuestion])};\n`);
  fs.writeFileSync(path.join(root, rel.sourceShard), sourceBytes);
  const sourceExamPath = 'archive/exams/original/test/source.js';
  const sourceExamBytes = Buffer.from('window.questionBank=[];\n');
  fs.mkdirSync(path.dirname(path.join(root, sourceExamPath)), { recursive: true }); fs.writeFileSync(path.join(root, sourceExamPath), sourceExamBytes);
  const sourceMetadata = [{ uid: question.uid, qid: 1, sourceQid: 1, sourceArchiveFile: sourceExamPath, sourceBlobSha: gitBlobSha(sourceExamBytes), sourceSchoolMarker: '시험학교', reviewApprovalStatus: 'REVIEW_PASS' }];
  fs.writeFileSync(path.join(root, rel.sourceMetadata), JSON.stringify(sourceMetadata, null, 2) + '\n');
  const consumerRecord = { generatedUid: question.uid, localOrdinal: 1, sourceKind: 'generated', sourceShard: rel.sourceShard, sourceShardGitSha: gitBlobSha(sourceBytes), l2: 'H1-PHYSICAL', question: { ...question } };
  const consumerDoc = { schemaVersion: 'ALIVE_GENERATED_CONSUMER_SHARD_V1', school: '시험학교', batchId: 'fixture', sourceShard: rel.sourceShard, records: unregistered ? [] : [consumerRecord] };
  fs.writeFileSync(path.join(root, rel.consumerShard), JSON.stringify(consumerDoc, null, 2) + '\n');
  const existingIndexRow = { uid: question.uid, school: '시험학교', year: 2026, grade: '고1', subject: '공통수학1', sourceQid: 1, localOrdinal: 1, sourceKind: 'generated', l2: 'H1-PHYSICAL', consumerSelectable: true, reviewStatus: 'REVIEW_PASS', approval: 'REVIEW_APPROVED', reviewApprovalBasis: 'FIXTURE_REVIEW', sourceShardGitSha: gitBlobSha(sourceBytes), shard: rel.consumerShard.replace(/^archive\//, '') };
  const consumerIndex = { schemaVersion: 'ALIVE_GENERATED_CONSUMER_INDEX_V1', approvedCount: unregistered ? 0 : 1, approvedBySchool: unregistered ? {} : { 시험학교: 1 }, excludedHoldUids: [], records: unregistered ? [] : [existingIndexRow] };
  fs.writeFileSync(path.join(root, rel.consumerIndex), JSON.stringify(consumerIndex, null, 2) + '\n');
  const evidenceDoc = { schemaVersion: 'GENERATED_META_REVIEW_EVIDENCE_V1', items: [{ uid: question.uid, reviewStatus: 'REVIEW_PASS', metaFinalSha256: metaSha256(meta) }] };
  const evidenceBytes = Buffer.from(JSON.stringify(evidenceDoc, null, 2) + '\n');
  fs.writeFileSync(path.join(root, rel.evidence), evidenceBytes);
  const paths = { sourceShard: rel.sourceShard, sourceMetadata: rel.sourceMetadata, consumerShard: rel.consumerShard, consumerIndex: rel.consumerIndex };
  const expectedSha256 = Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, sha256Bytes(fs.readFileSync(path.join(root, value)))]));
  const newRegistration = unregistered ? { indexRow: { school: '시험학교', year: 2026, grade: '고1', subject: '공통수학1', sourceQid: 1, localOrdinal: 1, sourceKind: 'generated', l2: 'H1-PHYSICAL', approval: 'REVIEW_APPROVED', reviewStatus: 'REVIEW_PASS', reviewApprovalBasis: 'FIXTURE_REVIEW', shard: rel.consumerShard.replace(/^archive\//, '') } } : undefined;
  const args = { root, uid: question.uid, meta, approval: { status: 'REVIEW_PASS' }, reviewEvidence: { path: rel.evidence, sha256: sha256Bytes(evidenceBytes), reviewStatus: 'REVIEW_PASS' }, paths, expectedSha256, ...(newRegistration ? { newRegistration } : {}) };
  return { root, rel, args, question, meta, sourceExamPath, sourceExamBytes };
}

function historicalApprovalFixture(){
  const f=fixture({unregistered:true}),historicalBytes=Buffer.from('window.questionBank=[{"id":1,"stem":"approved historical source"}];\n','utf8');
  execFileSync('git',['init','--quiet'],{cwd:f.root});
  execFileSync('git',['config','core.autocrlf','false'],{cwd:f.root});
  const historicalSourceBlobSha1=execFileSync('git',['hash-object','-w','--stdin'],{cwd:f.root,input:historicalBytes,encoding:'utf8'}).trim();
  const currentBytes=Buffer.from('window.questionBank=[{"id":1,"stem":"current source bytes"}];\n','utf8');
  fs.writeFileSync(path.join(f.root,f.sourceExamPath),currentBytes);
  const currentSourceBlobSha1=execFileSync('git',['hash-object','--path='+f.sourceExamPath,'--stdin'],{cwd:f.root,input:currentBytes,encoding:'utf8'}).trim();
  const receiptPath='alive/06_EXECUTION/test/approval.json',packagePath='alive/06_EXECUTION/test/package.json';
  const packageDoc={sourceExamPath:f.sourceExamPath,sourceGitBlobSha:historicalSourceBlobSha1,sourceQid:1,items:[{uid:f.question.uid,stem:f.question.content,choices:f.question.choices,answer:f.question.answer,solution:f.question.solution}]};
  const packageBytes=Buffer.from(JSON.stringify(packageDoc,null,2)+'\n','utf8');
  const packageGitBlobSha1=execFileSync('git',['hash-object','-w','--stdin'],{cwd:f.root,input:packageBytes,encoding:'utf8'}).trim();
  const packageSha256=sha256Bytes(packageBytes);
  const approvalBasis='USER_DIRECTED_QUALITY_APPROVED_TEST_HISTORICAL_SOURCE';
  const receiptDoc={schemaVersion:'ALIVE_QID9_USER_DIRECTED_APPROVAL_V1',status:'USER_DIRECTED_QUALITY_APPROVED',approvalBasis,
    source:{path:f.sourceExamPath,gitBlobSha1:historicalSourceBlobSha1},scope:{uids:[f.question.uid]},
    packages:[{sourceQid:1,path:packagePath,sha256:packageSha256,gitBlobSha1:packageGitBlobSha1,uids:[f.question.uid]}]};
  const receiptBytes=Buffer.from(JSON.stringify(receiptDoc,null,2)+'\n','utf8');
  const receiptGitBlobSha1=execFileSync('git',['hash-object','-w','--stdin'],{cwd:f.root,input:receiptBytes,encoding:'utf8'}).trim();
  const receiptSha256=sha256Bytes(receiptBytes);
  for(const [rel,bytes] of [[packagePath,packageBytes],[receiptPath,receiptBytes]]){fs.mkdirSync(path.dirname(path.join(f.root,rel)),{recursive:true});fs.writeFileSync(path.join(f.root,rel),bytes);}
  const sourceMetadataPath=path.join(f.root,f.rel.sourceMetadata),sourceMetadata=JSON.parse(fs.readFileSync(sourceMetadataPath,'utf8'));
  sourceMetadata[0].sourceBlobSha=historicalSourceBlobSha1;sourceMetadata[0].approvedSourceBlobSha=historicalSourceBlobSha1;
  sourceMetadata[0].currentSourceExamBlobSha1=currentSourceBlobSha1;
  sourceMetadata[0].reviewApprovalStatus='USER_DIRECTED_QUALITY_APPROVED';
  fs.writeFileSync(sourceMetadataPath,JSON.stringify(sourceMetadata,null,2)+'\n');
  const consumerPath=path.join(f.root,f.rel.consumerShard),consumer=JSON.parse(fs.readFileSync(consumerPath,'utf8'));
  consumer.sourceExamBlobSha=historicalSourceBlobSha1;consumer.currentSourceExamBlobSha1=currentSourceBlobSha1;
  consumer.approvedSourceSnapshot={path:f.sourceExamPath,gitBlobSha1:historicalSourceBlobSha1};
  fs.writeFileSync(consumerPath,JSON.stringify(consumer,null,2)+'\n');
  const evidenceDoc={schemaVersion:'GENERATED_META_REVIEW_EVIDENCE_V1',approvalReceiptPath:receiptPath,approvalReceiptSha256:receiptSha256,approvalReceiptGitBlobSha1:receiptGitBlobSha1,
    approvedPackagePath:packagePath,approvedPackageSha256:packageSha256,approvedPackageGitBlobSha1:packageGitBlobSha1,
    approvedSourceSnapshot:{path:f.sourceExamPath,gitBlobSha1:historicalSourceBlobSha1},currentSource:{path:f.sourceExamPath,gitBlobSha1:currentSourceBlobSha1},
    items:[{uid:f.question.uid,reviewStatus:'USER_DIRECTED_QUALITY_APPROVED',metaFinalSha256:metaSha256(f.meta),approvalBasis,scopeUids:[f.question.uid]}]};
  const evidenceBytes=Buffer.from(JSON.stringify(evidenceDoc,null,2)+'\n','utf8');
  fs.writeFileSync(path.join(f.root,f.rel.evidence),evidenceBytes);
  f.args.approval.status='USER_DIRECTED_QUALITY_APPROVED';
  f.args.reviewEvidence={path:f.rel.evidence,sha256:sha256Bytes(evidenceBytes),reviewStatus:'USER_DIRECTED_QUALITY_APPROVED'};
  f.args.expectedSha256=Object.fromEntries(Object.entries(f.args.paths).map(([key,rel])=>[key,sha256Bytes(fs.readFileSync(path.join(f.root,rel)))]));
  Object.assign(f.args.newRegistration.indexRow,{approval:'USER_DIRECTED_QUALITY_APPROVED',reviewStatus:'USER_DIRECTED_QUALITY_APPROVED',reviewApprovalBasis:approvalBasis,
    sourceExamBlobSha:historicalSourceBlobSha1,currentSourceExamBlobSha1:currentSourceBlobSha1,approvedSourceSnapshotBlobSha1:historicalSourceBlobSha1});
  Object.assign(f.args.newRegistration,{sourceExamPath:f.sourceExamPath,sourceExamBlobSha:historicalSourceBlobSha1,currentSourceBlobSha1,
    approvedSourceSnapshot:{sourcePath:f.sourceExamPath,sourceBlobSha1:historicalSourceBlobSha1,currentSourceBlobSha1,approvalReceiptPath:receiptPath,approvalReceiptSha256:receiptSha256,approvalReceiptGitBlobSha1:receiptGitBlobSha1,
      approvedPackagePath:packagePath,approvedPackageSha256:packageSha256,approvedPackageGitBlobSha1:packageGitBlobSha1}});
  execFileSync('git',['config','user.name','Fixture'],{cwd:f.root});
  execFileSync('git',['config','user.email','fixture@example.invalid'],{cwd:f.root});
  execFileSync('git',['add','--',f.sourceExamPath,receiptPath,packagePath],{cwd:f.root});
  execFileSync('git',['commit','--quiet','-m','fixture historical approval'],{cwd:f.root});
  return {...f,historicalSourceBlobSha1,currentSourceBlobSha1,receiptPath,packagePath,receiptSha256,receiptGitBlobSha1,packageSha256,packageGitBlobSha1};
}

function historicalTargetBytes(f){return [f.rel.sourceShard,f.rel.sourceMetadata,f.rel.consumerShard,f.rel.consumerIndex].map(rel=>fs.readFileSync(path.join(f.root,rel)));}

test('registration writes identical approved Meta and byte-bound evidence to all projections', () => {
  const f = fixture();
  try {
    const result = registerApprovedGeneratedMeta(f.args);
    assert.equal(result.status, 'REGISTERED');
    const source = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(f.root, f.rel.sourceShard), 'utf8'), source);
    const sourceQuestion = source.window.questionBank[0];
    const authority = JSON.parse(fs.readFileSync(path.join(f.root, f.rel.sourceMetadata), 'utf8'))[0];
    const consumer = JSON.parse(fs.readFileSync(path.join(f.root, f.rel.consumerShard), 'utf8')).records[0];
    const index = JSON.parse(fs.readFileSync(path.join(f.root, f.rel.consumerIndex), 'utf8')).records[0];
    for (const projection of [sourceQuestion, authority, consumer, consumer.question, index]) {
      assert.equal(JSON.stringify(projection.meta), JSON.stringify(f.meta));
      assert.equal(projection.metaFinalSha256, metaSha256(f.meta));
      assert.equal(projection.metaReviewEvidence.uid, f.question.uid);
      assert.equal(projection.metaReviewEvidence.reviewStatus, 'REVIEW_PASS');
    }
    assert.equal(sourceQuestion.uid, f.question.uid);
    assert.equal(source.window.extraConfig.keep, true);
    assert.equal(sourceQuestion.content, f.question.content);
    assert.equal(JSON.stringify(sourceQuestion.choices), JSON.stringify(f.question.choices));
    assert.equal(sourceQuestion.answer, f.question.answer);
    assert.equal(sourceQuestion.solution, f.question.solution);
    assert.equal(sourceQuestion.solutionImage, f.question.solutionImage);
    assert.equal(sourceQuestion.difficultyBucket, 4);
    assert.equal(sourceQuestion.level, '상');
    assert.equal(index.rpmL2, f.meta.rpmL2);
    assert.equal(index.l2, 'H1-PHYSICAL');
    for (const field of ['problemTypeKey', 'templateKey', 'secondaryConceptKeys', 'crossConceptKeys', 'conditionKeys', 'integrationPattern']) {
      const expected = Object.prototype.hasOwnProperty.call(f.meta, field) ? JSON.stringify(f.meta[field]) : undefined;
      for (const value of [sourceQuestion[field], consumer.question[field], index[field]]) assert.equal(value === undefined ? undefined : JSON.stringify(value), expected, field);
    }
    assert.equal(index.sourceShardGitSha, gitBlobSha(fs.readFileSync(path.join(f.root, f.rel.sourceShard))));
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('registration rejects source CAS drift before changing any target', () => {
  const f = fixture();
  try {
    fs.appendFileSync(path.join(f.root, f.rel.sourceShard), '// changed\n');
    const beforeIndex = fs.readFileSync(path.join(f.root, f.rel.consumerIndex));
    assert.throws(() => registerApprovedGeneratedMeta(f.args), /SOURCE_SHARD_CAS_CONFLICT/);
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.rel.consumerIndex)), beforeIndex);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('registration rejects review evidence whose bytes changed after approval', () => {
  const f = fixture();
  try {
    fs.appendFileSync(path.join(f.root, f.rel.evidence), ' ');
    assert.throws(() => registerApprovedGeneratedMeta(f.args), /REVIEW_EVIDENCE_BYTES_MISMATCH/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('registration rejects a claimed RPM_LOCKED path without an actual pinned RPM authority binding', () => {
  const f = fixture();
  try {
    f.args.meta.rpmL4Namespace = 'RPM_LOCKED';
    const crosswalkBytes = fs.readFileSync(path.join(f.root, f.meta.rpmDraftAuthorityRef));
    f.args.meta.rpmAuthorityRef = f.meta.rpmDraftAuthorityRef;
    f.args.meta.rpmAuthoritySha256 = sha256Bytes(crosswalkBytes);
    const masterRef = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
    const master = { authorityStatus: 'LOCKED', policy: { L3L4: 'CANONICAL_DRAFT normalized labels' }, records: [{
      curriculum: '2022', level: 'high', scope: 'H1-SCOPE', majorUnit: 'H1-L1', midUnit: 'H1-L2',
      majorStatus: 'RPM_VERIFIED', midStatus: 'RPM_VERIFIED',
      concepts: [{ concept: 'H1-L3', status: 'CANONICAL_DRAFT', problemTypes: [{ problemType: 'H1-L4', status: 'CANONICAL_DRAFT' }] }]
    }] };
    const masterBytes = Buffer.from(JSON.stringify(master, null, 2) + '\n');
    const masterPath = path.join(f.root, masterRef);
    fs.mkdirSync(path.dirname(masterPath), { recursive: true }); fs.writeFileSync(masterPath, masterBytes);
    f.args.meta.rpmCanonicalMasterRef = masterRef;
    f.args.meta.rpmCanonicalMasterSha256 = sha256Bytes(masterBytes);
    const evidenceFile = path.join(f.root, f.rel.evidence);
    const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
    evidence.items[0].metaFinalSha256 = metaSha256(f.args.meta);
    const bytes = Buffer.from(JSON.stringify(evidence, null, 2) + '\n');
    fs.writeFileSync(evidenceFile, bytes);
    f.args.reviewEvidence.sha256 = sha256Bytes(bytes);
    const authorityResult = validateAuthorityBinding(f.root, f.args.meta, f.question, f.question.uid);
    assert.ok(authorityResult.issues.includes('RPM_LOCKED_GLOBAL_POLICY_DRAFT'));
    assert.ok(authorityResult.issues.includes('RPM_LOCKED_LEAF_DRAFT'));
    assert.throws(() => registerApprovedGeneratedMeta(f.args), /RPM_LOCKED_GLOBAL_POLICY_DRAFT|RPM_LOCKED_LEAF_DRAFT/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('registration rejects status mismatch, excluded HOLD UIDs and multi-question source shards', () => {
  const a = fixture();
  const b = fixture();
  const c = fixture();
  try {
    a.args.approval.status = 'REVIEW_APPROVED';
    assert.throws(() => registerApprovedGeneratedMeta(a.args), /APPROVAL_STATUS_REVIEW_EVIDENCE_MISMATCH/);
    const indexFile = path.join(b.root, b.rel.consumerIndex);
    const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    index.excludedHoldUids = [b.question.uid];
    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
    b.args.expectedSha256.consumerIndex = sha256Bytes(fs.readFileSync(indexFile));
    assert.throws(() => registerApprovedGeneratedMeta(b.args), /UID_EXCLUDED_HOLD_CANNOT_REGISTER/);
    const second = { ...c.question, uid: 'ALITE-OTHER-002', id: 2 };
    fs.appendFileSync(path.join(c.root, c.rel.sourceShard), `\nwindow.questionBank.push(${JSON.stringify(second)});\n`);
    c.args.expectedSha256.sourceShard = sha256Bytes(fs.readFileSync(path.join(c.root, c.rel.sourceShard)));
    assert.throws(() => registerApprovedGeneratedMeta(c.args), /SOURCE_SHARD_MULTI_UID_UNSUPPORTED/);
  } finally {
    for (const f of [a, b, c]) fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('new registrations reject UIDs outside the generated-bank runtime format', () => {
  const f = fixture({ unregistered: true });
  try {
    f.args.uid = 'B05_Q04_C01_DISTANCE_SUM_MIN';
    assert.throws(() => registerApprovedGeneratedMeta(f.args), /NEW_UID_RUNTIME_UID_INVALID/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('registration restores every prior file if a staged replacement fails', () => {
  const f = fixture();
  try {
    const files = [f.rel.sourceShard, f.rel.sourceMetadata, f.rel.consumerShard, f.rel.consumerIndex];
    const before = files.map(file => fs.readFileSync(path.join(f.root, file)));
    assert.throws(() => registerApprovedGeneratedMeta(f.args, { beforeReplace: (_entry, index) => { if (index === 1) throw new Error('injected replace failure'); } }), /REGISTRATION_WRITE_ROLLED_BACK/);
    for (let index = 0; index < files.length; index++) assert.deepEqual(fs.readFileSync(path.join(f.root, files[index])), before[index]);
    assert.equal(fs.existsSync(`${path.join(f.root, f.rel.consumerIndex)}.meta-register.lock`), false);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('gate review binding verifies the evidence bytes, exact UID, approved status and Meta digest', () => {
  const f = fixture();
  try {
    assert.deepEqual(validateReviewBinding(f.root, { path: f.rel.evidence, sha256: f.args.reviewEvidence.sha256, reviewStatus: 'REVIEW_PASS' }, f.question.uid, metaSha256(f.meta), 'REVIEW_PASS'), []);
    assert.ok(validateReviewBinding(f.root, { path: f.rel.evidence, sha256: f.args.reviewEvidence.sha256, reviewStatus: 'REVIEW_PASS' }, 'ALITE-WRONG-UID', metaSha256(f.meta), 'REVIEW_PASS').includes('REVIEW_EVIDENCE_UID_NOT_UNIQUE'));
    assert.ok(validateReviewBinding(f.root, { path: f.rel.evidence, sha256: f.args.reviewEvidence.sha256, reviewStatus: 'REVIEW_PASS' }, f.question.uid, metaSha256(f.meta), 'REVIEW_HOLD').includes('REVIEW_EVIDENCE_STATUS_MISMATCH'));
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('withdrawal removes a UID from selection and preserves its exact shard record as withdrawn', () => {
  const f = fixture();
  try {
    const reason = 'review approval withdrawn';
    const evidenceFile = path.join(f.root, f.rel.evidence);
    const evidenceBytes = Buffer.from(JSON.stringify({ schemaVersion: 'GENERATED_META_WITHDRAWAL_EVIDENCE_V1', items: [{ uid: f.question.uid, status: 'WITHDRAWN', reason }] }, null, 2) + '\n');
    fs.writeFileSync(evidenceFile, evidenceBytes);
    const expectedSha256 = {
      consumerIndex: sha256Bytes(fs.readFileSync(path.join(f.root, f.rel.consumerIndex))),
      consumerShard: sha256Bytes(fs.readFileSync(path.join(f.root, f.rel.consumerShard)))
    };
    const result = withdrawGeneratedUid({ root: f.root, uid: f.question.uid, reason,
      withdrawalEvidence: { path: f.rel.evidence, sha256: sha256Bytes(evidenceBytes) },
      paths: { consumerIndex: f.rel.consumerIndex, consumerShard: f.rel.consumerShard }, expectedSha256 });
    assert.equal(result.status, 'WITHDRAWN');
    const index = JSON.parse(fs.readFileSync(path.join(f.root, f.rel.consumerIndex), 'utf8'));
    const shard = JSON.parse(fs.readFileSync(path.join(f.root, f.rel.consumerShard), 'utf8'));
    assert.deepEqual(index.records, []);
    assert.deepEqual(index.excludedHoldUids, [f.question.uid]);
    assert.equal(index.approvedCount, 0);
    assert.equal(shard.records[0].consumerSelectable, false);
    assert.equal(shard.records[0].reviewStatus, 'WITHDRAWN');
    assert.equal(shard.records[0].question.content, f.question.content);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('retention gate accepts an adapter-produced source-to-authority-to-consumer binding', () => {
  const f = fixture();
  try {
    const cutoverPath = path.join(f.root, 'archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json');
    fs.mkdirSync(path.dirname(cutoverPath), { recursive: true });
    const legacyUids = Array.from({ length: 323 }, (_, index) => `LEGACY-${String(index + 1).padStart(3, '0')}`);
    fs.writeFileSync(cutoverPath, JSON.stringify({ schemaVersion: 'GENERATED_META_RETENTION_CUTOVER_V1', legacyCount: 323, legacyUids, historicalMetaEvidenceCompatibilityCount: 0, historicalMetaEvidenceCompatibility: [] }, null, 2) + '\n');
    const idxPath = path.join(f.root, f.rel.consumerIndex);
    const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
    idx.records.unshift(...legacyUids.map(uid => ({ uid })));
    idx.approvedCount = idx.records.length;
    fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2) + '\n');
    f.args.expectedSha256.consumerIndex = sha256Bytes(fs.readFileSync(idxPath));
    registerApprovedGeneratedMeta(f.args);
    const result = audit(f.root);
    assert.equal(result.status, 'PASS_NEW_UID_SCOPE_ONLY', result.errors.join('\n'));
    assert.equal(result.legacyExemptNotRecertified, 323);
    assert.equal(result.newUidChecked, 1);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('new approval creates a previously absent UID from source bytes, passes gate, and withdraws cleanly', () => {
  const f = fixture({ unregistered: true });
  try {
    const cutoverPath = path.join(f.root, 'archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json');
    fs.mkdirSync(path.dirname(cutoverPath), { recursive: true });
    const legacyUids = Array.from({ length: 323 }, (_, index) => `LEGACY-${String(index + 1).padStart(3, '0')}`);
    fs.writeFileSync(cutoverPath, JSON.stringify({ schemaVersion: 'GENERATED_META_RETENTION_CUTOVER_V1', legacyCount: 323, legacyUids, historicalMetaEvidenceCompatibilityCount: 0, historicalMetaEvidenceCompatibility: [] }, null, 2) + '\n');
    const indexPath = path.join(f.root, f.rel.consumerIndex);
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    index.records = legacyUids.map(uid => ({ uid, school: 'Legacy' }));
    index.approvedCount = index.records.length;
    index.approvedBySchool = { Legacy: index.records.length };
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
    f.args.expectedSha256.consumerIndex = sha256Bytes(fs.readFileSync(indexPath));
    const registered = registerApprovedGeneratedMeta(f.args);
    assert.equal(registered.status, 'REGISTERED');
    const afterRegister = audit(f.root);
    assert.equal(afterRegister.status, 'PASS_NEW_UID_SCOPE_ONLY', afterRegister.errors.join('\n'));
    assert.equal(afterRegister.newUidChecked, 1);
    const registeredIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    assert.equal(registeredIndex.approvedCount, 324);
    assert.equal(registeredIndex.approvedBySchool['시험학교'], 1);
    assert.equal(registeredIndex.records.at(-1).uid, f.question.uid);

    const reason = 'test withdrawal';
    const evidenceBytes = Buffer.from(JSON.stringify({ schemaVersion: 'GENERATED_META_WITHDRAWAL_EVIDENCE_V1', items: [{ uid: f.question.uid, status: 'WITHDRAWN', reason }] }, null, 2) + '\n');
    fs.writeFileSync(path.join(f.root, f.rel.evidence), evidenceBytes);
    const withdrawn = withdrawGeneratedUid({ root: f.root, uid: f.question.uid, reason,
      withdrawalEvidence: { path: f.rel.evidence, sha256: sha256Bytes(evidenceBytes) },
      paths: { consumerIndex: f.rel.consumerIndex, consumerShard: f.rel.consumerShard },
      expectedSha256: { consumerIndex: sha256Bytes(fs.readFileSync(indexPath)), consumerShard: sha256Bytes(fs.readFileSync(path.join(f.root, f.rel.consumerShard))) } });
    assert.equal(withdrawn.status, 'WITHDRAWN');
    assert.equal(audit(f.root).status, 'PASS_NEW_UID_SCOPE_ONLY');
    assert.equal(JSON.parse(fs.readFileSync(indexPath, 'utf8')).approvedCount, 323);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('an exact UID-scoped receipt and package authorize a historical source blob while the current source remains separately bound', () => {
  const f=historicalApprovalFixture();
  try {
    const result=registerApprovedGeneratedMeta(f.args);
    assert.equal(result.status,'REGISTERED');
    const index=JSON.parse(fs.readFileSync(path.join(f.root,f.rel.consumerIndex),'utf8')).records[0];
    const consumerDoc=JSON.parse(fs.readFileSync(path.join(f.root,f.rel.consumerShard),'utf8'));
    const consumer=consumerDoc.records[0];
    const sourceQuestion={window:{}};
    vm.runInNewContext(fs.readFileSync(path.join(f.root,f.rel.sourceShard),'utf8'),sourceQuestion);
    assert.equal(index.sourceExamBlobSha,f.historicalSourceBlobSha1);
    assert.equal(index.approvedSourceSnapshotBlobSha1,f.historicalSourceBlobSha1);
    assert.equal(index.currentSourceExamBlobSha1,f.currentSourceBlobSha1);
    assert.equal(consumer.sourceExamBlobSha,f.historicalSourceBlobSha1);
    assert.equal(consumer.currentSourceExamBlobSha1,f.currentSourceBlobSha1);
    assert.equal(consumerDoc.sourceExamBlobSha,f.historicalSourceBlobSha1);
    assert.equal(sourceQuestion.window.questionBank[0].uid,f.question.uid);
  } finally { fs.rmSync(f.root,{recursive:true,force:true}); }
});

test('historical source registration fails closed on missing or mismatched receipt, package, and source blob before writes', () => {
  const cases=[
    ['missing historical receipt binding',f=>{delete f.args.newRegistration.approvedSourceSnapshot;},/NEW_UID_SOURCE_EXAM_BYTES_MISMATCH/],
    ['mismatched receipt bytes',f=>{f.args.newRegistration.approvedSourceSnapshot.approvalReceiptSha256='0'.repeat(64);},/HISTORICAL_SOURCE_RECEIPT_OR_PACKAGE_BYTES_MISMATCH/],
    ['mismatched package bytes',f=>{f.args.newRegistration.approvedSourceSnapshot.approvedPackageSha256='0'.repeat(64);},/HISTORICAL_SOURCE_RECEIPT_OR_PACKAGE_BYTES_MISMATCH/],
    ['mismatched historical source blob',f=>{f.args.newRegistration.approvedSourceSnapshot.sourceBlobSha1='0'.repeat(40);},/HISTORICAL_SOURCE_IDENTITY_BINDING_MISMATCH/],
    ['mismatched current source blob',f=>{f.args.newRegistration.approvedSourceSnapshot.currentSourceBlobSha1='0'.repeat(40);},/HISTORICAL_SOURCE_CURRENT_SOURCE_BINDING_MISMATCH/],
    ['source student body differs from the receipt-bound package',f=>{
      const source={window:{}};vm.runInNewContext(fs.readFileSync(path.join(f.root,f.rel.sourceShard),'utf8'),source);
      source.window.questionBank[0].content='altered after approval';
      fs.writeFileSync(path.join(f.root,f.rel.sourceShard),`window.examTitle="fixture";window.questionBank=${JSON.stringify(source.window.questionBank)};`);
      f.args.expectedSha256.sourceShard=sha256Bytes(fs.readFileSync(path.join(f.root,f.rel.sourceShard)));
    },/HISTORICAL_SOURCE_PACKAGE_BODY_MISMATCH/]
  ];
  for(const [name,mutate,error] of cases){
    const f=historicalApprovalFixture();
    try{
      mutate(f);
      const before=historicalTargetBytes(f);
      assert.throws(()=>registerApprovedGeneratedMeta(f.args),error,name);
      assert.deepEqual(historicalTargetBytes(f),before,name+' must not write any projection');
    }finally{fs.rmSync(f.root,{recursive:true,force:true});}
  }
});

test('scoped user-directed quality authority registers without claiming an independent GPT verdict', () => {
  const f = fixture({ unregistered: true });
  try {
    const basis = 'USER_DIRECTED_QUALITY_APPROVED:fixture-scope';
    const sourceMetadataPath = path.join(f.root, f.rel.sourceMetadata);
    const sourceMetadata = JSON.parse(fs.readFileSync(sourceMetadataPath, 'utf8'));
    sourceMetadata[0].reviewApprovalStatus = 'USER_DIRECTED_QUALITY_APPROVED';
    fs.writeFileSync(sourceMetadataPath, JSON.stringify(sourceMetadata, null, 2) + '\n');
    f.args.expectedSha256.sourceMetadata = sha256Bytes(fs.readFileSync(sourceMetadataPath));

    const evidencePath = path.join(f.root, f.rel.evidence);
    const evidenceBytes = Buffer.from(JSON.stringify({ schemaVersion: 'GENERATED_META_REVIEW_EVIDENCE_V1', items: [{
      uid: f.question.uid, reviewStatus: 'USER_DIRECTED_QUALITY_APPROVED',
      metaFinalSha256: metaSha256(f.meta), approvalBasis: basis, scopeUids: [f.question.uid]
    }] }, null, 2) + '\n');
    fs.writeFileSync(evidencePath, evidenceBytes);
    f.args.reviewEvidence = { path: f.rel.evidence, sha256: sha256Bytes(evidenceBytes), reviewStatus: 'USER_DIRECTED_QUALITY_APPROVED' };
    f.args.approval.status = 'USER_DIRECTED_QUALITY_APPROVED';
    f.args.newRegistration.indexRow.approval = 'USER_DIRECTED_QUALITY_APPROVED';
    f.args.newRegistration.indexRow.reviewStatus = 'USER_DIRECTED_QUALITY_APPROVED';
    f.args.newRegistration.indexRow.reviewApprovalBasis = basis;

    const cutoverPath = path.join(f.root, 'archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json');
    fs.mkdirSync(path.dirname(cutoverPath), { recursive: true });
    const legacyUids = Array.from({ length: 323 }, (_, index) => `LEGACY-${String(index + 1).padStart(3, '0')}`);
    fs.writeFileSync(cutoverPath, JSON.stringify({ schemaVersion: 'GENERATED_META_RETENTION_CUTOVER_V1', legacyCount: 323, legacyUids, historicalMetaEvidenceCompatibilityCount: 0, historicalMetaEvidenceCompatibility: [] }, null, 2) + '\n');
    const indexPath = path.join(f.root, f.rel.consumerIndex);
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    index.records = legacyUids.map(uid => ({ uid, school: 'Legacy' }));
    index.approvedCount = index.records.length;
    index.approvedBySchool = { Legacy: index.records.length };
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
    f.args.expectedSha256.consumerIndex = sha256Bytes(fs.readFileSync(indexPath));

    const result = registerApprovedGeneratedMeta(f.args);
    assert.equal(result.status, 'REGISTERED');
    assert.equal(result.reviewEvidence.reviewStatus, 'USER_DIRECTED_QUALITY_APPROVED');
    assert.deepEqual(result.reviewEvidence.scopeUids, [f.question.uid]);
    assert.equal(result.reviewEvidence.approvalBasis, basis);
    assert.equal(Object.hasOwn(result.reviewEvidence, 'gptReviewStatus'), false);
    const auditResult = audit(f.root);
    assert.equal(auditResult.status, 'PASS_NEW_UID_SCOPE_ONLY', auditResult.errors.join('\n'));
    assert.equal(auditResult.newUidChecked, 1);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('complete registered Meta carries a current-source marker into shared VERIFIED recipes', () => {
  const f = fixture({ unregistered: true });
  try {
    f.args.meta.secondaryConceptKeys = [];
    f.args.meta.problemTypeKey = 'PT_CIRCLE_EQUATION';
    f.args.meta.templateKey = 'TM_CIRCLE_CENTER_RADIUS';
    delete f.args.meta.metaDebt;
    const evidencePath = path.join(f.root, f.rel.evidence);
    const evidenceBytes = Buffer.from(JSON.stringify({ schemaVersion: 'GENERATED_META_REVIEW_EVIDENCE_V1', items: [{
      uid: f.question.uid, reviewStatus: 'REVIEW_PASS', metaFinalSha256: metaSha256(f.args.meta)
    }] }, null, 2) + '\n');
    fs.writeFileSync(evidencePath, evidenceBytes);
    f.args.reviewEvidence.sha256 = sha256Bytes(evidenceBytes);
    const result = registerApprovedGeneratedMeta(f.args);
    assert.equal(result.status, 'REGISTERED');
    const index = JSON.parse(fs.readFileSync(path.join(f.root, f.rel.consumerIndex), 'utf8'));
    const row = index.records.find(item => item.uid === f.question.uid);
    const view = problemBankMeta.projectGenerated(row);
    assert.equal(view.verifiedEligible, true);
    assert.deepEqual(view.secondaryConceptKeys, []);
    assert.equal(row.metaVerification.metaFinalSha256, row.metaFinalSha256);
    assert.equal(row.metaVerification.sourceShardGitSha, row.sourceShardGitSha);
    assert.equal(row.metaVerification.reviewEvidenceSha256, row.metaReviewEvidenceSha256);
    const source = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(f.root, f.rel.sourceShard), 'utf8'), source);
    for (const field of ['problemTypeKey', 'templateKey', 'secondaryConceptKeys', 'crossConceptKeys', 'conditionKeys', 'integrationPattern']) {
      assert.equal(JSON.stringify(source.window.questionBank[0][field]), JSON.stringify(f.args.meta[field]), field);
    }
    const recipe = assessmentRecipes.queryRecipe([view], 'FIVE_MINUTE');
    assert.equal(recipe.profile, 'VERIFIED');
    assert.deepEqual(recipe.candidates.map(item => item.uid), [f.question.uid]);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('canonical Meta taxonomy bindings reject unregistered keys and wrong parents', () => {
  const f = fixture();
  try {
    const parent = validateAuthorityBinding(f.root, f.meta, f.question, f.question.uid).primaryRecord;
    const valid = { ...f.meta, problemTypeKey: 'PT_CIRCLE_EQUATION', templateKey: 'TM_CIRCLE_CENTER_RADIUS', metaDebt: undefined };
    assert.deepEqual(validateMetaTaxonomyBindings(f.root, valid, parent), []);
    assert.ok(validateMetaTaxonomyBindings(f.root, { ...valid, problemTypeKey: 'PT_DOES_NOT_EXIST' }, parent).includes('META_PROBLEM_TYPE_NOT_ACTIVE_UNIQUE'));
    assert.ok(validateMetaTaxonomyBindings(f.root, { ...valid, templateKey: 'TM_TANGENT_AT_POINT' }, parent).includes('META_TEMPLATE_PROBLEM_TYPE_PARENT_MISMATCH'));
    assert.ok(validateMetaTaxonomyBindings(f.root, { ...valid, crossConceptKeys: ['CC_DOES_NOT_EXIST'] }, parent).some(issue => issue.startsWith('META_CROSS_CONCEPT_NOT_ACTIVE_UNIQUE')));
    const globallyShared = validateMetaTaxonomyBindings(f.root, { ...valid, crossConceptKeys: ['CC_ABSOLUTE_VALUE_EQUATION'] }, parent);
    assert.deepEqual(globallyShared, []);
    const sharedConcept = JSON.parse(fs.readFileSync(path.join(f.root, 'archive/data/meta-foundation/compiled/concept_registry.json'), 'utf8')).concepts.find(row => row.conceptKey === 'CC_ABSOLUTE_VALUE_EQUATION');
    assert.ok(!sharedConcept.taxonomyRefs.includes(valid.problemTypeKey));
    assert.ok(sharedConcept.curriculumRefs.some(ref => !ref.includes(parent.standardCourse)));
    assert.ok(validateMetaTaxonomyBindings(f.root, { ...valid, conditionKeys: ['COND_NOT_ACTIVE'] }, parent).some(issue => issue.startsWith('META_CONDITION_NOT_ACTIVE_UNIQUE')));
    assert.ok(validateMetaTaxonomyBindings(f.root, { ...valid, integrationPattern: 'UNREGISTERED_PATTERN' }, parent).includes('META_INTEGRATION_PATTERN_NOT_CANONICAL'));
    assert.deepEqual(validateMetaTaxonomyBindings(f.root, { ...f.meta, problemTypeKey: null, templateKey: null,
      metaDebt: { ...f.meta.metaDebt, problemTypeKey: 'UNKNOWN', templateKey: 'UNKNOWN' } }, parent), []);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});
