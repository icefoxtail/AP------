import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { CANONICAL_PARENT_MASTER, CANONICAL_PARENT_RETRY_INDEX, canonicalParentRetryHash,
  canonicalParentRetryRequests, loadCanonicalParentRetry, canonicalParentRetryTargets,
  resolveCanonicalParentRetry } from '../archive/tools/meta-foundation/canonical-parent-retry.mjs';
import { planQuestion, sourceFingerprint, contentFingerprint } from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(value)}\0`).update(value).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'main-auto-parent-retry-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, value) => {
    const raw = typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value) + '\n';
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    fs.writeFileSync(path.join(root, relative), raw); return { path: relative, sha256: sha(raw) };
  };
  const source = 'original/middle/m1/2final/24_parent_fixture.js', uid = 'qid_v1_' + sha(source + '#1');
  const question = { id: 1, questionUid: uid, content: 'Invented fixture question', primaryMethod: 'fixture', decisiveStep: 'fixture',
    standardCourse: '중1 수학', standardUnitKey: 'M1-06', subUnitKey: 'M1-06-TEST', problemTypeKey: 'PT_TEST', templateKey: 'TPL_TEST',
    crossConceptKeys: [], conditionKeys: [], integrationPattern: 'SINGLE', difficultyBucket: 2,
    difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' };
  const previous = structuredClone(question), bytes = Buffer.from('window.questionBank=' + JSON.stringify([question]) + ';\n');
  write('archive/exams/' + source, bytes);
  const identity = { questionUid: uid, sourceArchiveFile: source, sourceOrdinal: 1, sourceQuestionNo: 1,
    status: 'VERIFIED', sourceFingerprint: sourceFingerprint(question) };
  const current = { ...identity, ...question, sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question),
    metadataStatus: 'registration_pending_semantic_review', reviewStatus: 'review_required', fieldStatus: { standardUnit: 'approved_source', subUnit: 'approved_source' } };
  const master = [{ key: 'M1-06', keyType: 'standardUnitKey', status: 'active', labelKo: 'Fixture unit' },
    { key: 'M1-06-TEST', keyType: 'subUnitKey', parentKey: 'M1-06', standardUnitKey: 'M1-06', status: 'active', labelKo: 'Fixture subunit' }];
  const masterRef = write(CANONICAL_PARENT_MASTER, master), reviewRef = write('docs/operations/parent-retry-fixture/review.json', { scope: 'METADATA_ONLY', selectedOrdinals: [1] });
  const binding = { status: 'ACTIVE', ownerPack: 'MIDDLE1', curriculum: '2015', standardCourse: '중1 수학', standardUnitKey: 'M1-06', subUnitKey: 'M1-06-TEST', problemTypeKey: 'PT_TEST' };
  const pack = { id: 'MIDDLE1', version: '1.0.0', status: 'ACTIVE', packId: 'MIDDLE1', packVersion: '1.0.0', curricula: ['2015'], standardCourses: ['중1 수학'] };
  const registry = { status: 'ACTIVE', registrySha: 'sha256:' + 'a'.repeat(64), bindingRows: [binding], activePacks: new Map([['MIDDLE1', pack]]),
    problemTypes: new Map([['PT_TEST', { ownerPack: 'MIDDLE1', status: 'ACTIVE', canonicalLabelKo: 'Fixture type' }]]),
    templates: new Map([['TPL_TEST', { ownerPack: 'MIDDLE1', status: 'ACTIVE', parentProblemTypeKey: 'PT_TEST', canonicalLabelKo: 'Fixture template' }]]) };
  const row = { questionUid: uid, sourceOrdinal: 1, metadataBeforeSha256: canonicalParentRetryHash(current), identitySha256: canonicalParentRetryHash(identity),
    curriculum: '2015', standardCourse: '중1 수학', standardUnitKey: 'M1-06', subUnitKey: 'M1-06-TEST', problemTypeKey: 'PT_TEST', templateKey: 'TPL_TEST',
    L1: 'Fixture unit', L2: 'Fixture subunit' };
  const request = { schemaVersion: 'archive-main-auto-canonical-parent-retry-v1', requestId: 'synthetic-parent-retry', scope: 'EXACT_UIDS',
    approvalBasis: 'MAIN_MERGED_EXPLICIT_METADATA', independentReviewClaim: false, sourceArchiveFile: source, sourceBlobSha1: blob(bytes), sourceSha256: sha(bytes),
    expectedQuestionCount: 1, baseCommit: 'b'.repeat(40), priorSourceBlobSha1: blob(bytes), priorSourceSha256: sha(bytes),
    registrySha: registry.registrySha, masterRef, evidenceRefs: [reviewRef], items: [row] };
  const requestPath = 'archive/data/meta-foundation/evidence/main-auto-parent-retry/v1/synthetic-parent-retry.json';
  let ref;
  const save = () => { ref = write(requestPath, request); write(CANONICAL_PARENT_RETRY_INDEX, { schemaVersion: 'archive-main-auto-canonical-parent-retry-index-v1', requests: [ref] }); return ref; };
  save();
  const nativeSource = { root, bytes, previousSourceBytes: bytes, bank: [question], identityMap: { records: [identity] } };
  const context = state => ({ state, source, ordinal: 1, question, previous, current, identity, registry, binding, candidate: current,
    nativeSource, studentChanged: false, validatedCurriculum: '2015' });
  const load = () => loadCanonicalParentRetry(root, ref.path, ref.sha256);
  const plan = state => planQuestion({ ...context(state), validate: () => ({ status: 'VALIDATED', errors: [], curriculum: '2015', activeBinding: true, difficultyComplete: true }),
    canonicalParentRetry: state });
  return { root, write, save, load, plan, context, request, requestPath, row, source, uid, current, identity, question, previous, master, binding, registry, nativeSource };
}

test('ordinary AutoMeta retains its old refusal; only the exact request supplies ACTIVE master parents', t => {
  const f = fixture(t), before = structuredClone(f.current);
  assert.deepEqual(f.plan(null).reasons, ['CANONICAL_LABELS_MISSING']);
  const state = f.load(), result = f.plan(state);
  assert.equal(result.status, 'APPLY'); assert.equal(result.final.L1, 'Fixture unit'); assert.equal(result.final.L2, 'Fixture subunit');
  assert.equal(result.final.metadataRegistrationBasis, 'MAIN_MERGED_EXPLICIT_METADATA');
  assert.equal(result.final.reviewStatus, 'review_required'); assert.equal(result.final.metadataApprovalType, undefined);
  assert.deepEqual(f.current, before);
  assert.deepEqual(canonicalParentRetryTargets(state).map(([key]) => key), [f.source + '#1']);
  assert.deepEqual(canonicalParentRetryRequests(f.root).map(r => r.path), [f.requestPath]);
});
test('an absent request index preserves the normal lane, while an empty configured index fails closed', t => {
  const f = fixture(t); fs.unlinkSync(path.join(f.root, CANONICAL_PARENT_RETRY_INDEX)); assert.deepEqual(canonicalParentRetryRequests(f.root), []);
  f.write(CANONICAL_PARENT_RETRY_INDEX, { schemaVersion: 'archive-main-auto-canonical-parent-retry-index-v1', requests: [] });
  assert.throws(() => canonicalParentRetryRequests(f.root), /CANONICAL_PARENT_RETRY:INDEX/);
});
for (const [name, mutate, expected] of [
  ['changed master bytes', f => fs.appendFileSync(path.join(f.root, CANONICAL_PARENT_MASTER), ' '), /EVIDENCE_DIGEST/],
  ['changed source edition', f => fs.appendFileSync(path.join(f.root, 'archive/exams/' + f.source), '\n'), /SOURCE_EDITION/],
  ['changed review evidence', f => fs.appendFileSync(path.join(f.root, f.request.evidenceRefs[0].path), ' '), /EVIDENCE_DIGEST/],
  ['duplicate requested UID', f => { f.request.items.push(structuredClone(f.row)); f.save(); }, /ITEMS|ITEM_IDENTITY/],
  ['manufactured native authority', f => { f.request.approvalBasis = 'FINAL_QA'; f.save(); }, /REQUEST_AUTHORITY/],
]) test('request loading rejects ' + name, t => { const f = fixture(t); mutate(f); assert.throws(f.load, expected); });
for (const [name, mutate, expected] of [
  ['inactive master unit', f => { f.master[0].status = 'inactive'; f.request.masterRef = f.write(CANONICAL_PARENT_MASTER, f.master); f.save(); }, /MASTER_PARENT/],
  ['invalid subunit parent', f => { f.master[1].parentKey = 'M1-99'; f.request.masterRef = f.write(CANONICAL_PARENT_MASTER, f.master); f.save(); }, /MASTER_PARENT/],
  ['explicit current label conflict', f => { f.current.L1 = 'Different reviewed parent'; f.row.metadataBeforeSha256 = canonicalParentRetryHash(f.current); f.save(); }, /EXPLICIT_LABEL_CONFLICT/],
  ['identity drift', f => { f.identity.sourceFingerprint = 'd'.repeat(64); }, /IDENTITY_DRIFT/],
  ['metadata drift', f => { f.current.reviewStatus = 'reviewed_pass'; }, /METADATA_DRIFT/],
  ['ACTIVE binding parent mismatch', f => { f.binding.subUnitKey = 'M1-06-OTHER'; }, /BINDING_PARENT/],
  ['explicit curriculum conflict', f => { f.current.curriculum = '2022'; f.row.metadataBeforeSha256 = canonicalParentRetryHash(f.current); f.save(); }, /CANDIDATE_COURSE/],
]) test('parent resolution rejects ' + name, t => { const f = fixture(t); mutate(f); assert.throws(() => resolveCanonicalParentRetry(f.context(f.load())), expected); });
test('a new master digest changes the bounded input hash and cannot reuse the old registration proof', t => {
  const f = fixture(t), oldState = f.load(), oldResult = f.plan(oldState), proof = oldResult.canonicalParentRetry;
  f.master[0].description = 'New public-master revision with unchanged labels';
  f.request.masterRef = f.write(CANONICAL_PARENT_MASTER, f.master); f.save();
  const nextState = f.load(), nextResult = f.plan(nextState);
  assert.equal(nextResult.status, 'APPLY'); assert.notEqual(nextResult.inputHash, oldResult.inputHash);
  const registered = { ...oldResult.final, metadataRevision: 'bounded-fixture' };
  const priorReceipt = { metadataRegistrationStatus: 'REGISTERED', canonicalParentRetry: proof,
    registeredMetadataSha256: canonicalParentRetryHash(registered), questionUid: f.uid,
    sourceArchiveFile: f.source, sourceOrdinal: 1, sourceSha256: f.request.sourceSha256 };
  assert.throws(() => resolveCanonicalParentRetry({ ...f.context(nextState), current: registered, candidate: registered, priorReceipt }), /METADATA_DRIFT/);
});
test('same request/master may replay only the exact registered row and exact prior source edition', t => {
  const f = fixture(t), state = f.load(), result = f.plan(state), registered = { ...result.final, metadataRevision: 'bounded-fixture' };
  const priorReceipt = { metadataRegistrationStatus: 'REGISTERED', canonicalParentRetry: result.canonicalParentRetry,
    registeredMetadataSha256: canonicalParentRetryHash(registered), questionUid: f.uid,
    sourceArchiveFile: f.source, sourceOrdinal: 1, sourceSha256: f.request.sourceSha256 };
  const context = { ...f.context(state), current: registered, candidate: registered, priorReceipt };
  assert.equal(resolveCanonicalParentRetry(context).L1, 'Fixture unit');
  assert.throws(() => resolveCanonicalParentRetry({ ...context, nativeSource: { ...f.nativeSource, previousSourceBytes: Buffer.from('different prior source') } }), /PRIOR_SOURCE_EDITION/);
  assert.throws(() => resolveCanonicalParentRetry({ ...context, current: { ...registered, difficultyBucket: 5 } }), /METADATA_DRIFT/);
});
test('a completed exact batch is not automatically selected again; explicit replay still rejects master drift', t => {
  const f = fixture(t), state = f.load(), result = f.plan(state);
  const receipt = f.write('.archive-meta-register/auto/receipts/fixture-registered.json', {
    metadataRegistrationStatus: 'REGISTERED', questionUid: f.uid, sourceArchiveFile: f.source, sourceOrdinal: 1,
    canonicalParentRetry: result.canonicalParentRetry,
  });
  f.write('.archive-meta-register/auto/state.json', { completedCanonicalParentRetries: {
    [state.requestSha256]: { requestPath: f.requestPath, requestSha256: state.requestSha256,
      receipts: [{ questionUid: f.uid, ...receipt }] },
  } });
  assert.deepEqual(canonicalParentRetryRequests(f.root), []);
  fs.appendFileSync(path.join(f.root, CANONICAL_PARENT_MASTER), ' ');
  assert.deepEqual(canonicalParentRetryRequests(f.root), [], 'closed historical requests confer no new current-edition approval');
  assert.throws(f.load, /EVIDENCE_DIGEST/);
});
test('a tampered completion receipt cannot hide an outstanding bounded request', t => {
  const f = fixture(t), state = f.load(), result = f.plan(state);
  const receipt = f.write('.archive-meta-register/auto/receipts/fixture-registered.json', {
    metadataRegistrationStatus: 'REGISTERED', questionUid: f.uid, sourceArchiveFile: f.source, sourceOrdinal: 1,
    canonicalParentRetry: result.canonicalParentRetry,
  });
  f.write('.archive-meta-register/auto/state.json', { completedCanonicalParentRetries: {
    [state.requestSha256]: { requestPath: f.requestPath, requestSha256: state.requestSha256,
      receipts: [{ questionUid: f.uid, ...receipt }] },
  } });
  fs.appendFileSync(path.join(f.root, receipt.path), ' ');
  assert.throws(() => canonicalParentRetryRequests(f.root), /COMPLETION_RECEIPT_DIGEST/);
});
