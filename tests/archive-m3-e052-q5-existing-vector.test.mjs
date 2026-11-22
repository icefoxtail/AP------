import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import C from '../tools/4slot/m3-e052-q5-complete-given-continuity.cjs';
import builder from '../tools/4slot/build-4slot-runtime.cjs';
import consumer from '../archive/item-4slot.js';
import { verifyM3Q5ExistingVector as verify } from '../tools/4slot/m3-e052-q5-complete-given-continuity.mjs';
import { loadM3Q5CompleteGivenBank as bank, M3_Q5_COMPLETE_GIVEN_SCHEMA } from '../archive/tools/meta-foundation/reviewed-m3-e052-q5-complete-given.mjs';
import { registerReviewedExamV2 } from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';

// Public Git objects supply the original authority. The test never embeds or
// prints student payloads. Two bounded disposable ledgers use the real writer;
// different unrelated synthetic rows yield legitimately different output hashes.
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'bc0af77466f92f32b2044c452e2f1418bbae4cf0';
const OLD = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-audit-e052-native2-course-r2-20261116';
const ENGINE = 'archive/engine.html';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const serial = x => Buffer.from(JSON.stringify(x, null, 2) + '\n');
const env = { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0',
  GIT_AUTHOR_NAME: 'Bounded Q5 contract fixture', GIT_AUTHOR_EMAIL: 'test@example.invalid',
  GIT_COMMITTER_NAME: 'Bounded Q5 contract fixture', GIT_COMMITTER_EMAIL: 'test@example.invalid' };
const git = (root, args, input) => execFileSync('git', ['-C', root, ...args], {
  env, input, maxBuffer: 40 * 1024 * 1024, timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] });
const bytes = (commit, relative) => git(REPO, ['show', commit + ':' + relative]);
const json = (commit, relative) => JSON.parse(bytes(commit, relative));
const fullFp = q => sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
const bodyFp = q => sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null }));
const roots = []; let root, second, request, beforeFiles, receipt;
function put(r, p, b) { const f = path.join(r, p); fs.mkdirSync(path.dirname(f), { recursive: true });
  if (fs.existsSync(f)) fs.unlinkSync(f); fs.writeFileSync(f, b); }
function setup(extra = false) {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'm3-q5-existing-vector-')); roots.push(r);
  git(r, ['init', '--quiet']); const objectDir = git(REPO, ['rev-parse', '--git-path', 'objects']).toString().trim();
  fs.mkdirSync(path.join(r, '.git/objects/info'), { recursive: true });
  fs.writeFileSync(path.join(r, '.git/objects/info/alternates'), path.resolve(REPO, objectDir) + '\n');
  const basis = json(C.PINS.refs.applicationRef.commit, C.PINS.refs.applicationRef.path);
  const technical = json(C.PINS.refs.technicalRef.commit, C.PINS.refs.technicalRef.path);
  for (const key of ['compactRef', 'dictionaryRef', 'applicationRef', 'technicalRef', 'visualRef', 'currentSourceRef']) {
    const ref = C.PINS.refs[key]; put(r, ref.path, bytes(ref.commit, ref.path));
  }
  const dataPaths = new Set([C.MD, C.ID]);
  for (const ref of [...technical.servedFiles, ...technical.mirroredAssets, technical.captureHelperRef,
    technical.fontLicenseRef, basis.oldAssetRef, basis.newAssetRef]) if (!dataPaths.has(ref.path))
    put(r, ref.path, bytes(ref.commit, ref.path));
  const prior = json(BASE, OLD + '.json'), binding = json(BASE, OLD + '.source-review-binding.json');
  put(r, OLD + '.json', bytes(BASE, OLD + '.json')); put(r, OLD + '.source-review-binding.json', bytes(BASE, OLD + '.source-review-binding.json'));
  const req = structuredClone(binding.requestSnapshot), source = bank(bytes(basis.sourceAfterRef.commit, basis.sourceAfterRef.path));
  req.requestId = C.REQUEST_ID; req.registryChanges = []; req.expectedSourceBlobSha1 = basis.sourceAfterRef.gitBlobSha1;
  for (const patch of req.items) {
    const current = prior.appliedRecords.find(x => x.questionUid === patch.questionUid);
    const identity = prior.appliedIdentityRecords.find(x => x.questionUid === patch.questionUid), q = source[patch.sourceOrdinal - 1];
    patch.before = Object.fromEntries(Object.keys(patch.after).map(k => [k, current[k] ?? null]));
    patch.after = { ...patch.before, sourceFingerprint: fullFp(q), contentFingerprint: bodyFp(q) };
    patch.identityBefore = { sourceFingerprint: identity.sourceFingerprint };
  }
  const q5 = req.items.find(p => p.questionUid === C.UID), witnessRefs = {};
  for (const key of ['applicationRef', 'technicalRef', 'visualRef']) {
    witnessRefs[key] = structuredClone(C.PINS.refs[key]);
    for (const list of [req.approval.evidenceRefs, q5.evidenceRefs]) list.push({ path: witnessRefs[key].path, sha256: witnessRefs[key].sha256 });
  }
  q5.sourceReview.q5CompleteGivenApplication = { schemaVersion: M3_Q5_COMPLETE_GIVEN_SCHEMA, ...witnessRefs };
  assert.equal(sha(serial(req)), C.PINS.requestSha256, 'exact public request raw reconstruction');
  assert.equal(sha(stable(req)), C.PINS.requestSnapshotSha256, 'normalized request snapshot is a different hash');
  for (const ref of req.approval.evidenceRefs) if (!fs.existsSync(path.join(r, ref.path))) put(r, ref.path, bytes(BASE, ref.path));
  const finalization = JSON.parse(fs.readFileSync(path.join(r, basis.originalSourceReview.proposalFinalization.finalizationRef.path)));
  for (const application of finalization.applications) for (const ref of application.rendererAssets) {
    const raw = bytes(BASE, ref.path); assert.equal(sha(raw), ref.sha256); put(r, ref.path, raw);
  }
  for (const selection of basis.originalSourceReview.proposalFinalization.proposalSelections)
    put(r, selection.documentRef.path, bytes(basis.nativeReviewRef.commit, selection.documentRef.path));
  const indexPath = 'archive/data/meta-foundation/canonical/registry_index.json', index = json(BASE, indexPath);
  for (const p of new Set([indexPath, 'archive/data/meta-foundation/canonical/metadata_rules.json',
    'archive/data/master_tables/js_archive_tag_master.json', ...index.canonicalSources.map(x => x.path), ...index.compiledArtifacts.map(x => x.path)])) put(r, p, bytes(BASE, p));
  const native = json(basis.nativeReviewRef.commit, basis.nativeReviewRef.path), nativeRows = new Map(native.items.map(x => [x.ordinal, x]));
  const records = source.map((q, i) => structuredClone(prior.appliedRecords.find(x => x.sourceOrdinal === i + 1) || {
    questionUid: nativeRows.get(i + 1).questionUid, sourceArchiveFile: C.SOURCE, sourceOrdinal: i + 1, sourceQuestionNo: String(i + 1),
    sourceFingerprint: fullFp(q), contentFingerprint: bodyFp(q), metadataStatus: 'unreviewed', reviewStatus: 'pending', defaultSelectable: false }));
  const identities = records.map(x => structuredClone(prior.appliedIdentityRecords.find(y => y.sourceOrdinal === x.sourceOrdinal) || {
    questionUid: x.questionUid, sourceArchiveFile: x.sourceArchiveFile, sourceOrdinal: x.sourceOrdinal, sourceQuestionNo: x.sourceQuestionNo,
    sourceFingerprint: x.sourceFingerprint, status: 'VERIFIED' }));
  if (extra) {
    const unrelated = { questionUid: 'qid_v1_' + '7'.repeat(64), sourceArchiveFile: 'synthetic/unrelated.js', sourceOrdinal: 1,
      sourceQuestionNo: '1', sourceFingerprint: '8'.repeat(64), metadataStatus: 'unreviewed', reviewStatus: 'pending', defaultSelectable: false };
    records.push(unrelated); identities.push({ questionUid: unrelated.questionUid, sourceArchiveFile: unrelated.sourceArchiveFile,
      sourceOrdinal: 1, sourceQuestionNo: '1', sourceFingerprint: unrelated.sourceFingerprint, status: 'VERIFIED' });
  }
  put(r, C.MD, serial({ schemaVersion: 'bounded-test-metadata-v1', records }));
  put(r, C.ID, serial({ schemaVersion: 'bounded-test-identity-v1', records: identities }));
  const rt = json(BASE, C.RUNTIME); rt.records = structuredClone(prior.runtimeRecords); put(r, C.RUNTIME, serial(rt));
  put(r, C.REQUEST_WITNESS, serial(req)); put(r, C.FILE, serial(C.descriptor()));
  // The tool authenticates the renderer at HEAD:archive/engine.html, so the same
  // engine bytes copied into the working tree above must be in the HEAD tree too.
  git(r, ['add', '--', C.REQUEST_WITNESS, ENGINE]); const tree = git(r, ['write-tree']).toString().trim();
  const commit = git(r, ['commit-tree', tree, '-m', 'Exact synthetic Git request witness']).toString().trim();
  fs.writeFileSync(path.join(r, '.git/HEAD'), commit + '\n');
  const issued = registerReviewedExamV2({ root: r, request: req, write: true }); assert.equal(issued.status, 'PASS');
  return { root: r, request: req };
}
before(() => { const first = setup(); root = first.root; request = first.request;
  receipt = JSON.parse(fs.readFileSync(path.join(root, C.RECEIPT))); beforeFiles = new Map();
  const scan = (dir, prefix = '') => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue; const p = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) scan(path.join(dir, entry.name), p); else beforeFiles.set(p, sha(fs.readFileSync(path.join(root, p)))); } }; scan(root);
});
after(() => { for (const r of roots) fs.rmSync(r, { recursive: true, force: true }); });
function mutate(p, action, expected) {
  const full = path.join(root, p), raw = fs.readFileSync(full);
  try { const value = action(raw); if (value === null) fs.unlinkSync(full); else put(root, p, Buffer.isBuffer(value) ? value : serial(value));
    assert.throws(() => verify(root), expected); }
  finally { put(root, p, raw); }
}
function mutateJson(p, action, expected) { mutate(p, raw => { const d = JSON.parse(raw); action(d); return d; }, expected); }

test('actual official issuance carries one exact original vector and leaves its outside24 source whole', () => {
  const result = verify(root); assert.equal(result.status, 'PASS'); assert.equal(result.existingVectorCount, 25);
  assert.equal(result.outside24WholeQuestionsUnchanged, true); assert.equal(result.newFourSlotApprovals, 0);
  for (const [p, h] of beforeFiles) assert.equal(sha(fs.readFileSync(path.join(root, p))), h, 'read-only input ' + p);
});
test('a second real writer ledger changes global outputDigests while preserving exact selected authority', () => {
  second = setup(true).root; const other = JSON.parse(fs.readFileSync(path.join(second, C.RECEIPT)));
  assert.notDeepEqual(other.outputDigests, receipt.outputDigests);
  for (const key of ['requestSha256', 'approval', 'appliedRecords', 'appliedIdentityRecords', 'runtimeRecords', 'fingerprintRepairs'])
    assert.deepEqual(other[key], receipt[key]);
  assert.equal(verify(second).status, 'PASS');
});
for (const [label, edit] of [
  ['another UID', d => d.questionUid = 'qid_v1_' + '1'.repeat(64)], ['another ordinal', d => d.sourceOrdinal = 12],
  ['another bank', d => d.sourceArchiveFile += '.other'], ['larger selection', d => d.selectedUidCount = 2],
  ['changed denominator', d => d.expectedQuestionCount = 24], ['new vector approval', d => d.newFourSlotApprovals = 1],
  ['unknown key', d => d.extra = true], ['re-signed current source', d => d.refs.currentSourceRef.sha256 = 'a'.repeat(64)],
  ['another request', d => d.request.requestId += '-other'], ['altered original compact', d => d.compactItemSha256 = 'b'.repeat(64)]
]) test('closed descriptor rejects ' + label, () => { const d = C.descriptor(); edit(d); assert.throws(() => C.assertDescriptor(d), /CLOSED_DESCRIPTOR/); });
test('raw request whitespace cannot be hidden by equal normalized JSON', () => mutate(C.REQUEST_WITNESS,
  raw => Buffer.concat([raw, Buffer.from(' ')]), /PUBLIC_REQUEST_RAW_AND_SNAPSHOT/));
test('live request without its immutable Git blob is rejected', () => {
  const head = path.join(root, '.git/HEAD'), raw = fs.readFileSync(head); fs.writeFileSync(head, BASE + '\n');
  try { assert.throws(() => verify(root), /IMMUTABLE_PATH_REQUIRED/); } finally { fs.writeFileSync(head, raw); }
});
test('receipt absence cannot be replaced by public given or UI approval', () => mutate(C.RECEIPT, () => null, /ENOENT/));
test('typed sidecar absence is rejected', () => mutate(C.SOURCE_BINDING, () => null, /ENOENT/));
test('an unrelated issued receipt is rejected', () => mutateJson(C.RECEIPT, d => d.requestId += '-unrelated', /EXACT_ISSUED_REQUEST_PROVENANCE/));
test('raw hash cannot impersonate the normalized registrar request hash', () => mutateJson(C.RECEIPT,
  d => d.requestSha256 = C.PINS.requestSha256, /EXACT_ISSUED_REQUEST_PROVENANCE/));
test('altered issuer cannot reuse the original witness', () => mutateJson(C.RECEIPT,
  d => d.approval.approvedBy = 'other-producer', /EXACT_ISSUED_REQUEST_PROVENANCE/));
test('changed sidecar request before-values are rejected', () => mutateJson(C.SOURCE_BINDING,
  d => d.requestSnapshot.items[0].before.synthetic = true, /EXACT_ISSUED_SIDECAR/));
test('all selected metadata fields are compared', () => mutateJson(C.MD,
  d => d.records.find(r => r.questionUid === C.UID).extraIssuedValue = true, /WHOLE_ISSUED_SELECTED_DATA/));
test('ordinary Q12 stays outside the Q5 exception and keeps its whole issued metadata', () => mutateJson(C.MD,
  d => d.records.find(r => r.sourceOrdinal === 12).metadataApprovalType = 'BASIC', /WHOLE_ISSUED_SELECTED_DATA/));
test('selected identity drift is rejected', () => mutateJson(C.ID,
  d => d.records.find(r => r.questionUid === C.UID).sourceFingerprint = 'e'.repeat(64), /WHOLE_ISSUED_SELECTED_DATA/));
test('nonselected identity tuple drift is rejected', () => mutateJson(C.ID,
  d => d.records.find(r => r.sourceOrdinal === 1).sourceOrdinal = 26, /ORIGINAL_IDENTITY_EXACT_IDENTITY/));
test('whole selected runtime drift is rejected', () => mutateJson(C.RUNTIME,
  d => d.records.find(r => r.questionUid === C.UID).extra = true, /WHOLE_ISSUED_RUNTIME/));
test('duplicate runtime owner is rejected', () => {
  const p = 'archive/data/meta-foundation/runtime/synthetic-duplicate.json'; put(root, p, fs.readFileSync(path.join(root, C.RUNTIME)));
  try { assert.throws(() => verify(root), /WHOLE_ISSUED_RUNTIME/); } finally { fs.unlinkSync(path.join(root, p)); }
});
test('compact vector edits cannot be reclassified as display changes', () => mutateJson(C.PINS.refs.compactRef.path,
  d => d.items[4].given.push(999999), /LIVE_REFERENCE_CHANGED/));
test('dictionary definition edits are rejected', () => mutateJson(C.PINS.refs.dictionaryRef.path,
  d => d.terms[0].ko += ' synthetic', /LIVE_REFERENCE_CHANGED/));
test('nonselected source changes are rejected before any normalization', () => mutate(C.PINS.refs.currentSourceRef.path,
  raw => Buffer.concat([raw, Buffer.from('\nwindow.questionBank[0].synthetic = true;\n')]), /LIVE_REFERENCE_CHANGED/));
for (const key of ['technicalRef', 'visualRef', 'applicationRef']) test('changed ' + key + ' cannot issue vector continuity', () =>
  mutate(C.PINS.refs[key].path, raw => Buffer.concat([raw, Buffer.from(' ')]), /LIVE_REFERENCE_CHANGED/));
for (const key of ['oldAssetRef', 'newAssetRef']) test('changed ' + key + ' is rejected', () => {
  const basis = JSON.parse(fs.readFileSync(path.join(root, C.PINS.refs.applicationRef.path)));
  mutate(basis[key].path, raw => Buffer.concat([raw, Buffer.from('x')]), /LIVE_REFERENCE_CHANGED/);
});
test('original typed ancestor is still required after a cached successful verification', () =>
  mutate(OLD + '.source-review-binding.json', () => null, /ORIGINAL_NATIVE_GIVEN_UI_AND_ANCESTOR_REQUIRED/));
test('original receipt bytes cannot be changed behind the same path', () =>
  mutate(OLD + '.json', raw => Buffer.concat([raw, Buffer.from(' ')]), /ORIGINAL_NATIVE_GIVEN_UI_AND_ANCESTOR_REQUIRED/));
test('immutable Git objects are mandatory even with live proof files', () => {
  const p = path.join(root, '.git/objects/info/alternates'), raw = fs.readFileSync(p); fs.unlinkSync(p);
  try { assert.throws(() => verify(root), /IMMUTABLE_GIT_REQUIRED|IMMUTABLE_PATH_REQUIRED/); } finally { fs.writeFileSync(p, raw); }
});
test('one-bank builder registers all25 and preserves all original vectors', () => {
  const result = builder.build(root, { reuseCache: false }); assert.equal(builder.verify(result.index).verified, 25);
  assert.equal(result.index.pending.length, 0); const q5 = result.index.records.find(r => r.questionUid === C.UID);
  assert.equal(q5.sourceBinding, C.BINDING); assert.equal(result.stats.reusedFiles, 0);
  const replay = builder.build(root, { previous: result.index, reuseCache: true });
  assert.equal(JSON.stringify(replay.index), JSON.stringify(result.index));
  assert.equal(replay.stats.reusedFiles, 0, 'the selected issued proof is always replayed live');
  const compact = JSON.parse(fs.readFileSync(path.join(root, C.PINS.refs.compactRef.path)));
  for (const row of result.index.records) { const it = compact.items.find(x => x.ordinal === row.sourceDisplayNumber);
    for (const key of ['given', 'goal', 'method', 'condition', 'format', 'candidates']) assert.deepEqual(row[key], it[key]); }
  const raw = fs.readFileSync(path.join(root, C.FILE)); fs.unlinkSync(path.join(root, C.FILE));
  try { const missing = builder.build(root, { previous: result.index, reuseCache: true });
    assert.equal(missing.index.records.length, 24); assert.deepEqual(missing.index.pending.map(r => [r.ordinal, r.reason]), [[5, 'M3_Q5_CLAIM_MISSING_OR_MIXED']]);
    assert.equal(missing.stats.reusedFiles, 0);
    const missingAgain = builder.build(root, { previous: missing.index, reuseCache: true });
    assert.equal(JSON.stringify(missingAgain.index), JSON.stringify(missing.index), 'failure tombstone survives replay');
    const sourcePath = C.PINS.refs.currentSourceRef.path, currentSource = fs.readFileSync(path.join(root, sourcePath));
    try { put(root, sourcePath, bytes(C.PINS.refs.beforeSourceRef.commit, C.PINS.refs.beforeSourceRef.path));
      const restored = builder.build(root, { previous: missingAgain.index, reuseCache: true });
      assert.equal(restored.index.records.length, 24);
      assert.deepEqual(restored.index.pending.map(r => [r.ordinal, r.reason]), [[5, 'M3_Q5_CLAIM_MISSING_OR_MIXED']],
        'restoring an ordinary source cannot erase an issued continuity tombstone');
    } finally { put(root, sourcePath, currentSource); }
  } finally { put(root, C.FILE, raw); }
});

test('persisted one-bank output passes the strict cold check without digest self-dependency', () => {
  const output = 'archive/data/item-4slot-index.json', full = path.join(root, output);
  assert.equal(fs.existsSync(full), false);
  try {
    const written = builder.run(root, { write: true });
    assert.equal(written.status, 'PASS'); assert.equal(written.verified, 25);
    const persisted = fs.readFileSync(full);
    const cold = builder.run(root, { check: true });
    assert.equal(cold.status, 'PASS'); assert.equal(cold.verified, 25);
    assert.equal(cold.pending, 0); assert.equal(cold.changed, false);
    assert.deepEqual(fs.readFileSync(full), persisted);
  } finally { if (fs.existsSync(full)) fs.unlinkSync(full); }
});

function consumerRow() {
  const compact = JSON.parse(fs.readFileSync(path.join(root, C.PINS.refs.compactRef.path))), it = compact.items.find(x => x.ordinal === 5);
  return { questionUid: C.UID, sourceArchiveFile: C.SOURCE, sourceOrdinal: 5, sourceQuestionNo: '5', sourceDisplayNumber: 5,
    registrationStatus: 'REGISTERED', sourceBinding: C.BINDING, dictionaryVersion: compact.dictionaryVersion,
    compactPath: C.PINS.refs.compactRef.path, given: it.given, goal: it.goal, method: it.method, condition: it.condition,
    format: it.format, candidates: it.candidates, independentReviewClaim: false,
    q5CompleteGivenContinuityRef: { path: C.FILE, sha256: sha(fs.readFileSync(path.join(root, C.FILE))) } };
}
test('consumer accepts and freezes the one named reference without creating an approval', () => {
  const row = consumerRow(), api = consumer.createIndex({ schemaVersion: 'archive-item-4slot-runtime-v1', records: [row] });
  assert.equal(api.size, 1); assert(Object.isFrozen(api.get(C.UID).q5CompleteGivenContinuityRef));
  assert.equal(api.get(C.UID).independentReviewClaim, false);
});
for (const [label, change] of [
  ['another UID', r => r.questionUid = 'qid_v1_' + 'a'.repeat(64)], ['another bank', r => r.sourceArchiveFile += '.other'],
  ['another ordinal', r => r.sourceOrdinal = 12], ['another display number', r => r.sourceDisplayNumber = 12],
  ['missing reference', r => delete r.q5CompleteGivenContinuityRef], ['foreign path', r => r.q5CompleteGivenContinuityRef.path += '.other'],
  ['bad hash', r => r.q5CompleteGivenContinuityRef.sha256 = 'invalid'], ['approval claim', r => r.independentReviewClaim = true],
  ['unexpected field', r => r.q5CompleteGivenContinuityRef.extra = true]
]) test('consumer rejects named-reference ' + label, () => {
  const row = consumerRow(); change(row);
  assert.throws(() => consumer.createIndex({ schemaVersion: 'archive-item-4slot-runtime-v1', records: [row] }), /FOUR_SLOT_M3_Q5_COMPLETE_GIVEN_REF_INVALID/);
});
test('consumer rejects the Q5 reference attached to an ordinary row', () => {
  const row = consumerRow(); row.sourceBinding = 'UNCHANGED_STUDENT_PAYLOAD';
  assert.throws(() => consumer.createIndex({ schemaVersion: 'archive-item-4slot-runtime-v1', records: [row] }), /FOUR_SLOT_M3_Q5_COMPLETE_GIVEN_REF_UNEXPECTED/);
});
