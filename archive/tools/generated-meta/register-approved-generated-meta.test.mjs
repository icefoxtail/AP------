import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { registerApprovedGeneratedMeta, withdrawGeneratedUid, metaSha256, sha256Bytes, gitBlobSha } from './register-approved-generated-meta.mjs';
import gate from '../generated-meta-retention-gate.cjs';
const { validateReviewBinding, audit } = gate;

const metaTemplate = {
  rpmL1: 'H1-L1', rpmL2: 'H1-L2', rpmL3: 'H1-L3', rpmL4: 'H1-L4',
  rpmL4Namespace: 'RPM_EXISTING_DRAFT', rpmPrimaryRecordId: 'TEST-RPM-001',
  rpmDraftAuthorityRef: 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json', crossConceptKeys: [], conditionKeys: [],
  integrationPattern: 'NONE', difficultyBucket: 4, level: '상',
  problemTypeKey: null, templateKey: null,
  metaDebt: { problemTypeKey: 'UNKNOWN: no exact mapping evidence', templateKey: 'UNKNOWN: no exact template evidence' }
};

function fixture({ unregistered = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-meta-register-'));
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
  const rpmAuthority = { schemaVersion: 'rpm-primary-active-crosswalk-v1', rpmAuthority: { status: 'LOCKED' }, records: [{ id: meta.rpmPrimaryRecordId, standardCourse: question.standardCourse, standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey, rpmPath: { majorUnit: 'H1-L1', midUnit: 'H1-L2', l3: 'H1-L3', l4: 'H1-L4' } }] };
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
  return { root, rel, args, question, meta };
}

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
    const evidenceFile = path.join(f.root, f.rel.evidence);
    const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
    evidence.items[0].metaFinalSha256 = metaSha256(f.args.meta);
    const bytes = Buffer.from(JSON.stringify(evidence, null, 2) + '\n');
    fs.writeFileSync(evidenceFile, bytes);
    f.args.reviewEvidence.sha256 = sha256Bytes(bytes);
    assert.throws(() => registerApprovedGeneratedMeta(f.args), /RPM_AUTHORITY_BINDING_REQUIRED_FALSE_LOCKED_REJECTED/);
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
