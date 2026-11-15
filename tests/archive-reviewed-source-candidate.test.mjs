import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CANDIDATE_ENVELOPE, CANDIDATE_SCHEMA, allowedMetadataPath,
  inspectSourceMetadataCandidate, buildSourceMetadataCandidate } from '../tools/ci/archive-reviewed-source-candidate.mjs';

const repository = fileURLToPath(new URL('..', import.meta.url));
const rawHash = value => createHash('sha256').update(value).digest('hex');
const blobHash = value => createHash('sha1').update(`blob ${Buffer.byteLength(value)}\0`).update(value).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const ref = (name, bytes) => ({ path: name, blobSha1: blobHash(bytes), sha256: rawHash(bytes) });
const hashPair = bytes => ({ blobSha1: blobHash(bytes), sha256: rawHash(bytes) });
const SOURCE = 'archive/exams/original/middle/m2/2mid/fixture.js';
const IDENTITY = 'archive/data/question_identity_map.json';
const REQUEST = '.archive-meta-register/inbox/fixture-request.json';
const MANIFEST = '.archive-meta-register/evidence/fixture-materialization.json';
const EXTRA = '.archive-meta-register/evidence/fixture-extra.json';
const NATIVE = '.archive-meta-register/evidence/fixture-native.json';
const NATIVE_ORIGIN = 'docs/operations/fixture-native-review.json';
const PRESERVATION = '.archive-meta-register/inbox/fixture-preserve.json';
const PRIOR = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/fixture-prior.json';
const PARENT = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/fixture.parent-labels.json';
const UID = 'qid_v1_' + '1'.repeat(64);
const UID2 = 'qid_v1_' + '2'.repeat(64);
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], {
  encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1' },
}).trim();

function fixture(t, { inputExtra = {}, baseExtra = {}, publicEvidence = {}, mutateManifest, mutateEnvelope,
  mutateRequest, mutatePreservation, setupRequest, withPreservation = false, withParent = false,
  extraBankRow = false, sourcePath = SOURCE, nativeSchema = 'm2-s2-meta-review-v1', mutateNativeDocument, executable } = {}) {
  const container = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-source-candidate-fixture-'));
  t.after(() => fs.rmSync(container, { recursive: true, force: true }));
  const root = path.join(container, 'repo'); fs.mkdirSync(root);
  const put = (name, bytes) => {
    const absolute = path.join(root, name); fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, bytes); return absolute;
  };
  git(root, 'init', '-q', '-b', 'main');
  git(root, 'config', 'user.name', 'Candidate fixture');
  git(root, 'config', 'user.email', 'candidate@example.invalid');
  git(root, 'config', 'commit.gpgsign', 'false');
  const bank = [{ id: 1, questionUid: UID, question: 'Synthetic preserved question', answer: 'Synthetic preserved answer',
    solution: 'Synthetic preserved solution', difficulty: 2, courseKey: 'M2-1' }];
  if (withPreservation || extraBankRow) bank.push({ ...bank[0], id: 2, questionUid: UID2 });
  const before = 'window.questionBank = ' + JSON.stringify(bank, null, 2) + ';\n';
  const after = 'window.questionBank = ' + JSON.stringify([{ ...bank[0], courseKey: 'M2-2' }, ...bank.slice(1)], null, 2) + ';\n';
  const tuple = { sourceArchiveFile: sourcePath.slice('archive/exams/'.length), sourceOrdinal: 1, sourceQuestionNo: 1 };
  const tuples = bank.map(q => ({ questionUid: q.questionUid, sourceArchiveFile: tuple.sourceArchiveFile, sourceOrdinal: q.id, sourceQuestionNo: q.id }));
  const identity = json({ schemaVersion: 'question-identity-map-v1', records: tuples,
    lookup: { byQuestionUid: Object.fromEntries(tuples.map(({ questionUid, ...r }) => [questionUid, r])),
      bySourceFileAndOrdinal: { [tuple.sourceArchiveFile]: Object.fromEntries(tuples.map(r => [r.sourceOrdinal, r.questionUid])) },
      bySourceFileAndQuestionNo: { [tuple.sourceArchiveFile]: Object.fromEntries(tuples.map(r => [r.sourceOrdinal, [r.questionUid]])) } } });
  const m3 = nativeSchema === 'm3-s2-complete-semantic-review-v1';
  const nativeDocument = { schemaVersion: nativeSchema, sourceArchiveFile: tuple.sourceArchiveFile,
    [m3 ? 'questionCount' : 'reviewedQuestionCount']: bank.length, items: tuples.map(r => ({ questionUid: r.questionUid, [m3 ? 'ordinal' : 'sourceOrdinal']: r.sourceOrdinal,
      after: { courseKey: 'M2-2' } })), artifactRefs: { historicalMissing: { path: 'docs/old-missing.json', sha256: '9'.repeat(64) } } };
  mutateNativeDocument?.(nativeDocument);
  const native = json(nativeDocument);
  const parentRow = { grade: '중2', curriculumKey: '2015', courseKey: 'M2-2', standardUnitKey: 'M2-04', subUnitKey: 'M2-04-BASIC', L1: 'fixture unit', L2: 'fixture leaf' };
  const parentSource = json({ schemaVersion: 'fixture-parent-links', records: [parentRow] });
  const parent = json({ schemaVersion: 'archive-meta-pipeline-parent-label-evidence-v1',
    sourcePath: 'archive/data/basic-scope-parent-links.json', sourceSha256: rawHash(parentSource), records: [parentRow] });
  const prior = json({ schemaVersion: 'archive-reviewed-exam-meta-registration-v2', approval: { type: 'FINAL_QA' },
    sourceArchiveFile: tuple.sourceArchiveFile, expectedQuestionCount: bank.length,
    appliedRecords: withPreservation ? [tuples[1]] : [], historicalReviewEvidence: { evidenceRead: { answer: true } } });
  put(sourcePath, before); put(IDENTITY, identity); put('README.md', 'trusted main\n');
  put(NATIVE_ORIGIN, native);
  if (withPreservation) put(PRIOR, prior);
  if (withParent) put('archive/data/basic-scope-parent-links.json', parentSource);
  for (const [name, bytes] of Object.entries(baseExtra)) put(name, bytes);
  for (const [name, bytes] of Object.entries(publicEvidence)) put(name, bytes);
  git(root, 'add', '--', '.'); git(root, 'commit', '-qm', 'public base');
  const nativeCommit = git(root, 'rev-parse', 'HEAD');
  for (const name of Object.keys(publicEvidence)) git(root, 'rm', '--', name);
  git(root, 'commit', '--allow-empty', '-qm', 'current trusted main');
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  const nativeRef = { path: NATIVE, sha256: rawHash(native) }, parentRef = { path: PARENT, sha256: rawHash(parent) };
  const request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId: 'fixture-request',
    approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'fixture-reviewer', evidenceRefs: [nativeRef, ...(withParent ? [parentRef] : [])] },
    scope: 'PARTIAL_UIDS', sourceArchiveFile: tuple.sourceArchiveFile,
    expectedQuestionCount: bank.length, expectedSourceBlobSha1: blobHash(after), registryChanges: [],
    items: [{ questionUid: UID, sourceOrdinal: 1, before: { courseKey: 'M2-1' }, after: { courseKey: 'M2-2' }, reason: 'Synthetic metadata transport',
      evidenceRefs: [nativeRef, ...(withParent ? [parentRef] : [])], ...(withParent ? { basicScopeParentRef: parentRef } : {}),
      sourceReview: { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: nativeCommit, reviewPath: NATIVE_ORIGIN, reviewRef: nativeRef } }] };
  const files = { [NATIVE]: native, ...(withParent ? { [PARENT]: parent } : {}), ...inputExtra };
  setupRequest?.({ request, files, nativeCommit, baseCommit, native, before, after, tuples, parent, parentSource });
  mutateRequest?.(request);
  const requestBytes = json(request);
  const manifest = { schemaVersion: 'archive-reviewed-source-metadata-materialization-v1', materializationId: 'fixture-candidate',
    baseCommit, identityRef: ref(IDENTITY, identity), requestRefs: [ref(REQUEST, requestBytes)], outputScope: [sourcePath],
    files: [{ path: sourcePath, before: hashPair(before), after: hashPair(after), expectedQuestionCount: bank.length,
      changes: [{ questionUid: UID, sourceOrdinal: 1, requestIndex: 0,
        metadataFields: [{ field: 'courseKey', beforePresent: true, afterPresent: true, before: 'M2-1', after: 'M2-2' }] }] }] };
  mutateManifest?.(manifest);
  files[REQUEST] = requestBytes; files[MANIFEST] = json(manifest);
  if (withPreservation) {
    const priorRef = { path: PRIOR, sha256: rawHash(prior) };
    const preservation = { schemaVersion: request.schemaVersion, requestId: 'fixture-preserve', scope: 'PARTIAL_UIDS',
      sourceArchiveFile: tuple.sourceArchiveFile, expectedQuestionCount: bank.length, expectedSourceBlobSha1: blobHash(after),
      approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'fixture-reviewer', evidenceRefs: [priorRef], sourceRebind: { priorReceiptRef: priorRef } },
      registryChanges: [], items: [{ questionUid: UID2, sourceOrdinal: 2, before: {}, after: {}, reason: 'Preserve current approval', evidenceRefs: [priorRef] }] };
    mutatePreservation?.(preservation);
    files[PRESERVATION] = json(preservation);
  }
  const inputFiles = Object.entries(files).map(([name, bytes]) => ref(name, bytes));
  const envelope = { schemaVersion: CANDIDATE_SCHEMA, materializationId: 'fixture-candidate', baseCommit,
    manifestRef: ref(MANIFEST, files[MANIFEST]), inputFiles,
    ...(withPreservation ? { preservationRequestRefs: [ref(PRESERVATION, files[PRESERVATION])] } : {}) };
  mutateEnvelope?.(envelope);
  for (const [name, bytes] of Object.entries(files)) put(name, bytes);
  if (executable) fs.chmodSync(path.join(root, executable), 0o755);
  put(CANDIDATE_ENVELOPE, json(envelope));
  git(root, 'add', '--', '.'); git(root, 'commit', '-qm', 'metadata input');
  const inputCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', '--detach', baseCommit);
  const opts = { repoRoot: root, inputCommit, eventRef: 'archive-meta-source-input/fixture-candidate',
    outputRoot: path.join(container, 'output') };
  return { ...opts, opts, root, container, put, before, after, baseCommit, inputCommit, nativeCommit, manifest, envelope, files, sourcePath };
}

test('metadata-only envelope is bound to exact base, input parent and immutable file hashes', t => {
  const f = fixture(t), result = inspectSourceMetadataCandidate(f.opts);
  assert.equal(result.baseCommit, f.baseCommit); assert.equal(result.inputCommit, f.inputCommit);
  assert.equal(result.files.size, 3); assert.equal(result.candidateBranch, 'release/metadata-source-fixture-candidate');
  assert.equal(result.closure.newApprovals, 0); assert.equal(result.closure.requestCount, 1);
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit);
});

test('candidate build retains all student fields, removes its envelope, and leaves HEAD/index/refs untouched', async t => {
  const f = fixture(t);
  const beforeState = [git(f.root, 'rev-parse', 'HEAD'), git(f.root, 'write-tree'), git(f.root, 'for-each-ref'), git(f.root, 'status', '--porcelain')];
  const result = await buildSourceMetadataCandidate(f.opts);
  assert.equal(result.registrationStatus, 'NOT_REGISTERED'); assert.equal(result.approvalEffect, 'NONE');
  assert.equal(git(f.root, 'show', `${result.candidateCommit}:${SOURCE}`) + '\n', f.after);
  assert.equal(fs.readFileSync(path.join(f.root, SOURCE), 'utf8'), f.before);
  assert.equal(git(f.root, 'ls-tree', result.candidateCommit, '--', CANDIDATE_ENVELOPE), '');
  assert.equal(git(f.root, 'rev-parse', `${result.candidateCommit}^`), f.inputCommit);
  const receipt = JSON.parse(git(f.root, 'show', `${result.candidateCommit}:${result.receiptPath}`));
  assert.equal(receipt.registrationStatus, 'NOT_REGISTERED'); assert.equal(receipt.sourceFiles[0].sha256, rawHash(f.after));
  assert.deepEqual([git(f.root, 'rev-parse', 'HEAD'), git(f.root, 'write-tree'), git(f.root, 'for-each-ref'), git(f.root, 'status', '--porcelain')], beforeState);
  assert.deepEqual(git(f.root, 'diff', '--name-only', f.baseCommit, result.candidateCommit).split('\n').sort(),
    [SOURCE, REQUEST, MANIFEST, NATIVE, result.receiptPath].sort());
});

for (const [label, name] of [
  ['source bank', SOURCE + '.new.js'], ['workflow', '.github/workflows/unsafe.json'],
  ['derived metadata', 'archive/data/question_metadata.json'],
  ['issued source-review receipt', '.archive-meta-register/evidence/fixture.source-review-binding.json'],
]) test(`uploaded ${label} is rejected before construction`, t => {
  const f = fixture(t, { inputExtra: { [name]: '{}\n' } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /INPUT_PATH_NOT_METADATA/);
  assert.equal(fs.existsSync(f.outputRoot), false);
});

for (const key of ['question', 'answer', 'solution', 'currentQuestion', 'source_body', '__proto__']) {
  test(`metadata transport refuses raw or unsafe ${key} fields`, t => {
    const f = fixture(t, { inputExtra: { [EXTRA]: `{"nested":{"${key}":"blocked fixture"}}\n` } });
    assert.throws(() => inspectSourceMetadataCandidate(f.opts), /RAW_OR_UNSAFE_METADATA_FIELD/);
  });
}

test('existing evidence cannot be overwritten even with its new hash declared', t => {
  const f = fixture(t, { baseExtra: { [EXTRA]: '{"version":1}\n' }, inputExtra: { [EXTRA]: '{"version":2}\n' } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /INPUT_OVERWRITE_FORBIDDEN/);
});

test('executable input files are refused despite matching content hashes', t => {
  const f = fixture(t, { executable: REQUEST });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /INPUT_FILE_MODE/);
});

test('unlisted Git changes cannot enter a candidate', t => {
  const f = fixture(t, { inputExtra: { [EXTRA]: '{"kind":"fixture"}\n' },
    mutateEnvelope: envelope => { envelope.inputFiles = envelope.inputFiles.filter(row => row.path !== EXTRA); } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /INPUT_TREE_SCOPE/);
});

test('hash drift, duplicate input paths, and unknown envelope fields fail closed', t => {
  for (const mutateEnvelope of [
    envelope => { envelope.inputFiles[0].sha256 = '0'.repeat(64); },
    envelope => { envelope.inputFiles.push(envelope.inputFiles[0]); },
    envelope => { envelope.extraAuthority = true; },
  ]) {
    const f = fixture(t, { mutateEnvelope });
    assert.throws(() => inspectSourceMetadataCandidate(f.opts), /INPUT_REF_MISMATCH|DUPLICATE_INPUT_PATH|UNKNOWN_OR_MISSING_FIELD/);
  }
});

test('event ref and the current main parent are exact, not inferred from branch labels', t => {
  const f = fixture(t);
  assert.throws(() => inspectSourceMetadataCandidate({ ...f.opts, eventRef: 'archive-meta-source-input/other-id' }), /EVENT_REF_MISMATCH/);
  f.put('unrelated.txt', 'main advanced\n'); git(f.root, 'add', 'unrelated.txt'); git(f.root, 'commit', '-qm', 'new main');
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /INPUT_PARENT_NOT_CURRENT_BASE/);
});

test('dirty trusted checkout and multiple-parent inputs are refused', t => {
  const f = fixture(t);
  f.put('README.md', 'dirty');
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /TRUSTED_CHECKOUT_DIRTY/);
  git(f.root, 'checkout', '--', 'README.md');
  const extraParent = execFileSync('git', ['-C', f.root, 'commit-tree', `${f.baseCommit}^{tree}`],
    { input: 'separate root\n', encoding: 'utf8' }).trim();
  const merge = execFileSync('git', ['-C', f.root, 'commit-tree', `${f.inputCommit}^{tree}`, '-p', f.baseCommit, '-p', extraParent],
    { input: 'ambiguous input\n', encoding: 'utf8' }).trim();
  assert.throws(() => inspectSourceMetadataCandidate({ ...f.opts, inputCommit: merge }), /INPUT_PARENT_NOT_CURRENT_BASE/);
});

test('materialized output must match the exact request after-source blob', async t => {
  const f = fixture(t, { mutateManifest: manifest => { manifest.files[0].after.blobSha1 = '2'.repeat(40); } });
  await assert.rejects(buildSourceMetadataCandidate(f.opts), /REQUEST_AFTER_SOURCE_BLOB/);
  assert.equal(fs.existsSync(f.outputRoot), false);
});

test('candidate construction refuses existing outputs and any output inside the checkout', async t => {
  const f = fixture(t);
  fs.mkdirSync(f.outputRoot);
  await assert.rejects(buildSourceMetadataCandidate(f.opts), /OUTPUT_ALREADY_EXISTS/);
  await assert.rejects(buildSourceMetadataCandidate({ ...f.opts, outputRoot: path.join(f.root, 'new-output') }), /OUTPUT_INSIDE_REPOSITORY/);
});

test('path allowlist rejects traversal, source payload destinations and reserved issued receipts', () => {
  assert.equal(allowedMetadataPath('.archive-meta-register/evidence/fixture.json'), true);
  assert.equal(allowedMetadataPath('docs/operations/m2s2-follow193-20261115/metadata.json'), true);
  assert.throws(() => allowedMetadataPath('.archive-meta-register/evidence/../file.json'), /UNSAFE_PATH/);
  assert.throws(() => allowedMetadataPath('/absolute.json'), /UNSAFE_PATH/);
  assert.equal(allowedMetadataPath('.archive-meta-register/evidence/fixture.source-review-binding.json'), false);
  assert.equal(allowedMetadataPath('archive/exams/original/middle/m2/2mid/raw.json'), false);
});

test('workflow executes trusted main and creates only a candidate ref with a create-only lease', () => {
  const workflow = fs.readFileSync(path.join(repository, '.github/workflows/archive-reviewed-source-candidate.yml'), 'utf8');
  assert.match(workflow, /on:\n  create:/);
  assert.match(workflow, /ref: main\n\s+fetch-depth: 0/);
  assert.match(workflow, /github\.event\.ref_type == 'branch'/);
  assert.match(workflow, /INPUT_COMMIT: \$\{\{ github\.sha \}\}/);
  assert.match(workflow, /INPUT_REF: \$\{\{ github\.event\.ref \}\}/);
  assert.match(workflow, /test "\$current_main" = "\$base_sha"/);
  assert.match(workflow, /git push --force-with-lease="refs\/heads\/\$candidate_branch:" origin "\$candidate_sha:refs\/heads\/\$candidate_branch"/);
  assert.doesNotMatch(workflow, /gh pr merge|gh workflow run|HEAD:main|HEAD:refs\/heads\/main|pull_request_target|continue-on-error/);
  assert.match(workflow, /path: \$\{\{ runner.temp \}\}\/archive-source-candidate-result\.json/);
});

test('an unreferenced metadata-shaped payload cannot ride along in inputFiles', t => {
  const f = fixture(t, { inputExtra: { [EXTRA]: json({ unrecognized_payload: 'synthetic orphan' }) } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /UNREFERENCED_INPUT_FILE/);
  assert.equal(fs.existsSync(f.outputRoot), false);
});

test('a hash-correct referenced unknown schema is rejected', t => {
  const bytes = json({ schemaVersion: 'unrecognized-author-wrapper-v1', arbitraryField: 'synthetic payload' });
  const f = fixture(t, { inputExtra: { [EXTRA]: bytes }, mutateRequest: request => {
    const r = { path: EXTRA, sha256: rawHash(bytes) };
    request.approval.evidenceRefs.push(r); request.items[0].evidenceRefs.push(r);
  } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /UNRECOGNIZED_EVIDENCE_SCHEMA/);
});

for (const bytes of ['{"schemaVersion":"hidden","schemaVersion":"replacement"}\n',
  '{"rows":[{"re\\u0061son":"discarded","reason":"visible"}]}\n']) {
  test('duplicate JSON keys cannot hide discarded input bytes', t => {
    const f = fixture(t, { inputExtra: { [EXTRA]: bytes } });
    assert.throws(() => inspectSourceMetadataCandidate(f.opts), /DUPLICATE_JSON_KEY/);
  });
}

test('unknown fields in an uploaded native copy cannot be authorized by updating its local hash', t => {
  const f = fixture(t, { setupRequest: ({ request, files }) => {
    const doc = JSON.parse(files[NATIVE]); doc.injectedMetadata = 'not present in immutable review';
    files[NATIVE] = json(doc); request.items[0].sourceReview.reviewRef.sha256 = rawHash(files[NATIVE]);
  } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /IMMUTABLE_EVIDENCE_MISMATCH/);
});

test('recognized native schema is required even when the public Git copy and declared hash match', t => {
  const f = fixture(t, { nativeSchema: 'unrecognized-native-review-v9' });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /UNRECOGNIZED_EVIDENCE_SCHEMA/);
});

test('native historical artifact references are not recursively imported or required', t => {
  const f = fixture(t);
  const r = inspectSourceMetadataCandidate(f.opts);
  assert.equal(r.files.size, 3);
  assert.equal(r.closure.evidenceTraversal, 'EXPLICIT_TYPED_AND_CURRENT_REGISTRAR_REFS_ONLY');
  assert.equal(git(f.root, 'ls-tree', f.inputCommit, '--', 'docs/old-missing.json'), '');
});

test('immutable M3 evidence-read booleans are metadata and carry no student payload', t => {
  const f = fixture(t, { sourcePath: SOURCE.replace('/m2/', '/m3/'), nativeSchema: 'm3-s2-complete-semantic-review-v1',
    mutateNativeDocument: d => { d.items[0].evidenceRead = { stem: true, choices: true, answer: false }; } });
  assert.equal(inspectSourceMetadataCandidate(f.opts).closure.newApprovals, 0);
});

test('a boolean answer outside the exact native evidence-read slot is still refused', t => {
  const f = fixture(t, { sourcePath: SOURCE.replace('/m2/', '/m3/'), nativeSchema: 'm3-s2-complete-semantic-review-v1',
    mutateNativeDocument: d => { d.items[0].answer = false; } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /RAW_OR_UNSAFE_METADATA_FIELD/);
});

for (const value of ['Synthetic answer payload', 1, { text: 'Synthetic payload' }]) {
  test('native evidence-read fields cannot carry nonboolean student data even in a public copy', t => {
    const f = fixture(t, { sourcePath: SOURCE.replace('/m2/', '/m3/'), nativeSchema: 'm3-s2-complete-semantic-review-v1',
      mutateNativeDocument: d => { d.items[0].evidenceRead = { answer: value }; } });
    assert.throws(() => inspectSourceMetadataCandidate(f.opts), /RAW_OR_UNSAFE_METADATA_FIELD/);
  });
}

for (const [label, mutateRequest, expected] of [
  ['root', r => { r.userWrapper = {}; }, /UNKNOWN_OR_MISSING_FIELD/],
  ['approval', r => { r.approval.userWrapper = {}; }, /UNKNOWN_OR_MISSING_FIELD/],
  ['item', r => { r.items[0].userWrapper = {}; }, /UNKNOWN_OR_MISSING_FIELD/],
  ['native spec', r => { r.items[0].sourceReview.userWrapper = {}; }, /UNKNOWN_OR_MISSING_FIELD/],
  ['metadata field', r => { r.items[0].after.userWrapper = 'value'; }, /UNKNOWN_METADATA_FIELD/],
  ['metadata nested object', r => { r.items[0].after.courseKey = { payload: 'value' }; }, /METADATA_SCALAR/],
  ['missing native evidence', r => { delete r.items[0].sourceReview; }, /NATIVE_SOURCE_REVIEW_REQUIRED/],
  ['native not bound to item', r => { r.items[0].evidenceRefs = [{ path: EXTRA, sha256: 'a'.repeat(64) }]; }, /ITEM_EVIDENCE_NOT_APPROVAL/],
]) test(`closed request shape rejects ${label}`, t => {
  const f = fixture(t, { mutateRequest });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), expected);
});

test('parent labels are newly authored only from exact current public parent records', t => {
  const f = fixture(t, { withParent: true });
  const r = inspectSourceMetadataCandidate(f.opts);
  assert.equal(r.files.size, 4); assert.equal(r.closure.newApprovals, 0);
});

test('historical empty before values do not authorize empty after classification', t => {
  const f = fixture(t, { mutateRequest: r => { r.items[0].before.problemTypeKey = ''; } });
  assert.equal(inspectSourceMetadataCandidate(f.opts).closure.newApprovals, 0);
  const bad = fixture(t, { mutateRequest: r => { r.items[0].after.problemTypeKey = ''; } });
  assert.throws(() => inspectSourceMetadataCandidate(bad.opts), /METADATA_SCALAR/);
});

for (const [label, mutate, expected] of [
  ['root field', doc => { doc.userWrapper = {}; }, /UNKNOWN_OR_MISSING_FIELD/],
  ['record field', doc => { doc.records[0].userWrapper = 'x'; }, /UNKNOWN_OR_MISSING_FIELD/],
  ['changed parent', doc => { doc.records[0].subUnitKey = 'M2-04-WRONG'; }, /PARENT_RECORD_NOT_CURRENT_BASE/],
  ['old source hash', doc => { doc.sourceSha256 = '8'.repeat(64); }, /PARENT_SOURCE_HASH/],
]) test(`parent labels reject ${label} after all local hashes are updated`, t => {
  const f = fixture(t, { withParent: true, setupRequest: ({ files, request }) => {
    const doc = JSON.parse(files[PARENT]); mutate(doc); files[PARENT] = json(doc);
    request.items[0].basicScopeParentRef.sha256 = rawHash(files[PARENT]);
  } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), expected);
});

test('declared preservation requests target the same after-source while preserving a distinct existing UID', async t => {
  const f = fixture(t, { withPreservation: true });
  const inspected = inspectSourceMetadataCandidate(f.opts);
  assert.deepEqual([inspected.closure.requestCount, inspected.closure.preservationRequestCount, inspected.closure.selectedUidCount], [1, 1, 2]);
  const result = await buildSourceMetadataCandidate(f.opts);
  assert.equal(result.registrationStatus, 'NOT_REGISTERED');
  assert.equal(git(f.root, 'show', `${result.candidateCommit}:${PRESERVATION}`) + '\n', f.files[PRESERVATION]);
  assert.equal(git(f.root, 'show', `${result.candidateCommit}:${SOURCE}`) + '\n', f.after);
});

for (const [label, mutatePreservation, expected] of [
  ['changed values', r => { r.items[0].after.courseKey = 'M2-1'; }, /PRESERVATION_VALUES/],
  ['different source', r => { r.sourceArchiveFile = 'original/middle/m2/2mid/foreign.js'; }, /REQUEST_AFTER_SOURCE_BLOB/],
  ['different after blob', r => { r.expectedSourceBlobSha1 = '8'.repeat(40); }, /REQUEST_AFTER_SOURCE_BLOB/],
  ['wrong full denominator', r => { r.expectedQuestionCount = 1; }, /REQUEST_AFTER_SOURCE_BLOB/],
  ['overlapping new UID', r => { r.items[0].questionUid = UID; r.items[0].sourceOrdinal = 1; }, /REQUEST_SELECTED_UID/],
  ['foreign ordinal', r => { r.items[0].sourceOrdinal = 1; }, /REQUEST_IDENTITY_JOIN/],
  ['untyped sourceRebind flag', r => { r.approval.sourceRebind.skipVerification = true; }, /UNKNOWN_OR_MISSING_FIELD/],
  ['wrong prior hash', r => { r.approval.sourceRebind.priorReceiptRef.sha256 = '9'.repeat(64); }, /EVIDENCE_HASH/],
  ['new registry change', r => { r.registryChanges.push({}); }, /PRESERVATION_PRIOR_BASE_ONLY/],
]) test(`preservation closure rejects ${label}`, t => {
  const f = fixture(t, { withPreservation: true, mutatePreservation });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), expected);
});

test('an undeclared extra preservation request remains an orphan', t => {
  const f = fixture(t, { withPreservation: true, mutateEnvelope: e => { delete e.preservationRequestRefs; } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /UNREFERENCED_INPUT_FILE/);
});

test('every selected materialization request item must occur exactly once in manifest changes', t => {
  const f = fixture(t, { extraBankRow: true, mutateRequest: r => {
    r.items.push({ ...structuredClone(r.items[0]), questionUid: UID2, sourceOrdinal: 2 });
  } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /UNUSED_MATERIALIZATION_REQUEST_ITEM/);
});

const FINALIZATION = '.archive-meta-register/evidence/fixture-proposal-finalization.json';
const PROPOSALS = 'docs/operations/fixture-native-proposals.json';
const REGISTRY_PROPOSAL = '.archive-meta-register/evidence/fixture-registry-changes.json';
function proposalFixture(t, { mutateProofCopy, mutateRegistry, mutateSelection, rawHistoricalUpload = false } = {}) {
  const change = { path: 'archive/data/meta-foundation/canonical/condition_registry.json', collection: 'conditions',
    match: { conditionKey: 'COND_FIXTURE' }, before: null, after: { conditionKey: 'COND_FIXTURE', status: 'ACTIVE', definition: 'Synthetic condition' } };
  const proposals = json([{ id: 'P1', type: 'CONDITION', supportingQuestionUids: [UID], sourceOrdinal: 1 }]);
  const selected = { documentRef: { path: PROPOSALS, sha256: rawHash(proposals) }, index: 0,
    proposalSha256: rawHash(stable(JSON.parse(proposals)[0])), questionUid: UID, sourceOrdinal: 1, proposalId: 'P1' };
  mutateSelection?.(selected);
  const historical = json({ schemaVersion: 'archive-m3s2-followup-exact-proposal-review-input-v1', currentQuestion: { answer: 'Synthetic historical source' } });
  const historicPath = '.archive-meta-register/evidence/fixture-historical-source-inputs.json';
  const proof = json({ schemaVersion: 'archive-independent-native-proposal-disposition-v1', applications: [
    { questionUid: UID, sourceOrdinal: 1, decisions: [{ registryChange: change }] }],
    normalizationProvenance: { sourceInputRef: { path: historicPath, sha256: rawHash(historical) } } });
  const registry = json({ schemaVersion: 'archive-reviewed-registry-change-proposal-v1', status: 'PROPOSED', registryChanges: [change] });
  return fixture(t, { publicEvidence: { [PROPOSALS]: proposals, [FINALIZATION]: proof, [REGISTRY_PROPOSAL]: registry, [historicPath]: historical },
    setupRequest: ({ request, files, nativeCommit }) => {
      files[FINALIZATION] = proof; files[REGISTRY_PROPOSAL] = registry;
      if (rawHistoricalUpload) files[historicPath] = historical;
      if (mutateProofCopy) { const d = JSON.parse(files[FINALIZATION]); mutateProofCopy(d); files[FINALIZATION] = json(d); }
      const finalRef = { path: FINALIZATION, sha256: rawHash(files[FINALIZATION]) }, registryRef = { path: REGISTRY_PROPOSAL, sha256: rawHash(registry) };
      request.items[0].sourceReview.proposalFinalization = { schemaVersion: 'archive-native-proposal-finalization-v2',
        finalizationCommit: nativeCommit, finalizationRef: finalRef, proposalSelections: [selected] };
      request.approval.evidenceRefs.push(finalRef, registryRef); request.items[0].evidenceRefs.push(finalRef, registryRef);
      request.registryChanges = [{ ...change, evidenceRefs: [registryRef] }];
      mutateRegistry?.(request.registryChanges[0]);
    } });
}

test('proposal finalization and add-only registry change bind exact public metadata without copying historical source payloads', t => {
  const f = proposalFixture(t), r = inspectSourceMetadataCandidate(f.opts);
  assert.equal(r.closure.newApprovals, 0);
  assert.equal(r.files.size, 5);
});

test('public historical raw-source evidence is still refused if uploaded as metadata', t => {
  const f = proposalFixture(t, { rawHistoricalUpload: true });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /RAW_OR_UNSAFE_METADATA_FIELD/);
});

test('recognized proposal schema with new local fields fails exact immutable-copy validation', t => {
  const f = proposalFixture(t, { mutateProofCopy: d => { d.newUnreviewedField = 'x'; } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /IMMUTABLE_EVIDENCE_MISMATCH/);
});

test('a registry definition cannot gain an extra field under a recognized public proposal', t => {
  const f = proposalFixture(t, { mutateRegistry: c => { c.after = { ...c.after, unreviewedPayload: 'x' }; } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /REGISTRY_CHANGE_NOT_IMMUTABLE_PROPOSAL/);
});

for (const mutateSelection of [s => { s.proposalId = 'UNREVIEWED'; }, s => { s.proposalSha256 = 'f'.repeat(64); }]) {
  test('a native proposal selection binds the actual original ID and complete proposal hash', t => {
    const f = proposalFixture(t, { mutateSelection });
    assert.throws(() => inspectSourceMetadataCandidate(f.opts), /NATIVE_PROPOSAL_SELECTION/);
  });
}

function rendererFixture(t, { observation, independentSchema, mutateWitnessCopy } = {}) {
  const renderer = '.archive-meta-register/evidence/fixture-renderer.json', witness = '.archive-meta-register/evidence/fixture-renderer-independent.json';
  const sourcePath = SOURCE.replace('/m2/', '/m3/');
  const independent = json({ schemaVersion: independentSchema || (observation === undefined ? 'archive-independent-narrow-renderer-review-v1' : 'archive-independent-current-figure-review-v1'),
    rows: [{ questionUid: UID, sourceOrdinal: 1, ...(observation === undefined ? {} : { directVisualReview: { solution: observation } }) }],
    historicalUnconsumedRef: { path: 'docs/missing-old-review.json', sha256: 'c'.repeat(64) } });
  const proof = json({ schemaVersion: 'archive-reviewed-renderer-continuity-evidence-v1', sourceArchiveFile: sourcePath.slice('archive/exams/'.length),
    expectedQuestionCount: 1, items: [{ questionUid: UID, sourceOrdinal: 1, independentReviewRef: { path: witness, sha256: rawHash(independent) } }] });
  const f = fixture(t, { sourcePath, nativeSchema: 'm3-s2-complete-semantic-review-v1', publicEvidence: { [renderer]: proof, [witness]: independent },
    mutateManifest: m => { m.transportProfile = 'M3_REVIEWED_METADATA_V1'; }, setupRequest: ({ request, files, nativeCommit }) => {
      files[renderer] = proof; files[witness] = independent;
      if (mutateWitnessCopy) { const d = JSON.parse(files[witness]); mutateWitnessCopy(d); files[witness] = json(d); }
      const refs = [renderer, witness].map(p => ({ path: p, sha256: rawHash(files[p]) }));
      request.approval.evidenceRefs.push(...refs); request.items[0].evidenceRefs.push(...refs);
      request.items[0].sourceReview.rendererProof = { schemaVersion: 'archive-reviewed-current-renderer-continuity-v1', reviewCommit: nativeCommit, reviewRef: refs[0] };
    } });
  return f;
}

test('current renderer proof follows only the selected independent witness in its exact public commit', t => {
  const f = rendererFixture(t);
  assert.equal(inspectSourceMetadataCandidate(f.opts).closure.evidenceFileCount, 3);
  // This transport result is not a substitute for the official renderer validator.
  assert.equal(fs.existsSync(f.outputRoot), false);
});

test('metadata-only current renderer v2 remains an exact public evidence copy before official validation', t => {
  const f = rendererFixture(t, { independentSchema: 'archive-independent-current-renderer-review-v2' });
  const result = inspectSourceMetadataCandidate(f.opts);
  assert.equal(result.closure.evidenceFileCount, 3);
  assert.equal(result.closure.newApprovals, 0);
  assert.equal(fs.existsSync(f.outputRoot), false);
});

test('current renderer v2 does not accept an altered copy of its public witness', t => {
  const f = rendererFixture(t, { independentSchema: 'archive-independent-current-renderer-review-v2',
    mutateWitnessCopy: d => { d.rows[0].visualInspectionPerformed = true; } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /TYPED_EVIDENCE_NOT_DECLARED|EVIDENCE_HASH|IMMUTABLE_EVIDENCE_MISMATCH/);
});

test('current renderer v2 adds no exception for raw student content', t => {
  const f = rendererFixture(t, { independentSchema: 'archive-independent-current-renderer-review-v2',
    mutateWitnessCopy: d => { d.rows[0].content = 'Synthetic raw student content remains forbidden'; } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /RAW_OR_UNSAFE_METADATA_FIELD/);
});

test('current renderer v3 transport preserves exact public evidence without supplying an approval', t => {
  const f = rendererFixture(t, { independentSchema: 'archive-independent-current-renderer-review-v3' });
  const result = inspectSourceMetadataCandidate(f.opts);
  assert.equal(result.closure.evidenceFileCount, 3);
  assert.equal(result.closure.newApprovals, 0);
  assert.equal(fs.existsSync(f.outputRoot), false);
});

for (const [label, mutateWitnessCopy, pattern] of [
  ['changed public copy', d => { d.rows[0].visualInspectionPerformed = true; }, /TYPED_EVIDENCE_NOT_DECLARED|EVIDENCE_HASH|IMMUTABLE_EVIDENCE_MISMATCH/],
  ['raw student content', d => { d.rows[0].content = 'Synthetic raw content'; }, /RAW_OR_UNSAFE_METADATA_FIELD/],
]) test(`current renderer v3 still refuses ${label}`, t => {
  const f = rendererFixture(t, { independentSchema: 'archive-independent-current-renderer-review-v3', mutateWitnessCopy });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), pattern);
});

function priorRendererFixture(t, { mutatePublic, mutateCopy, omitItemRef = false, unlinked = false } = {}) {
  const renderer = '.archive-meta-register/evidence/fixture-renderer.json';
  const witness = '.archive-meta-register/evidence/fixture-renderer-independent.json';
  const priorPath = '.archive-meta-register/evidence/fixture-prior-renderer.json';
  const sourcePath = SOURCE.replace('/m2/', '/m3/');
  const priorDoc = { schemaVersion: 'archive-independent-prior-solution-renderer-review-v1', questionUid: UID, sourceOrdinal: 1 };
  mutatePublic?.(priorDoc);
  const prior = json(priorDoc), priorRef = { path: priorPath, sha256: rawHash(prior) };
  const independent = json({ schemaVersion: 'archive-independent-current-renderer-review-v3', rows: [
    { questionUid: UID, sourceOrdinal: 1, ...(unlinked ? {} : { prefigureRendererReviewRef: priorRef }) }
  ] });
  const proof = json({ schemaVersion: 'archive-reviewed-renderer-continuity-evidence-v1', sourceArchiveFile: sourcePath.slice('archive/exams/'.length),
    expectedQuestionCount: 1, items: [{ questionUid: UID, sourceOrdinal: 1, independentReviewRef: { path: witness, sha256: rawHash(independent) } }] });
  return fixture(t, { sourcePath, nativeSchema: 'm3-s2-complete-semantic-review-v1',
    publicEvidence: { [renderer]: proof, [witness]: independent, [priorPath]: prior },
    mutateManifest: m => { m.transportProfile = 'M3_REVIEWED_METADATA_V1'; },
    setupRequest: ({ request, files, nativeCommit }) => {
      files[renderer] = proof; files[witness] = independent; files[priorPath] = prior;
      if (mutateCopy) { const d = JSON.parse(prior); mutateCopy(d); files[priorPath] = json(d); }
      const refs = [renderer, witness, priorPath].map(p => ({ path: p, sha256: rawHash(files[p]) }));
      request.approval.evidenceRefs.push(...refs);
      request.items[0].evidenceRefs.push(...refs.filter(r => !omitItemRef || r.path !== priorPath));
      request.items[0].sourceReview.rendererProof = { schemaVersion: 'archive-reviewed-current-renderer-continuity-v1',
        reviewCommit: nativeCommit, reviewRef: refs[0] };
    } });
}

test('v3 prior solution renderer witness requires the selected UID and exact same public commit', t => {
  const f = priorRendererFixture(t), result = inspectSourceMetadataCandidate(f.opts);
  assert.equal(result.closure.evidenceFileCount, 4);
  assert.equal(result.closure.newApprovals, 0);
  assert.equal(fs.existsSync(f.outputRoot), false);
});

for (const [label, options, pattern] of [
  ['a changed copy', { mutateCopy: d => { d.observed = 'New unreviewed statement'; } }, /TYPED_EVIDENCE_NOT_DECLARED|EVIDENCE_HASH|IMMUTABLE_EVIDENCE_MISMATCH/],
  ['an undeclared item reference', { omitItemRef: true }, /TYPED_EVIDENCE_NOT_DECLARED/],
  ['a different selected UID', { mutatePublic: d => { d.questionUid = UID2; } }, /PRIOR_RENDERER_SELECTED_UID/],
  ['an unsupported schema', { mutatePublic: d => { d.schemaVersion = 'unreviewed-prior-schema'; } }, /UNRECOGNIZED_EVIDENCE_SCHEMA/],
  ['a raw solution field', { mutateCopy: d => { d.solution = 'Synthetic forbidden payload'; } }, /RAW_OR_UNSAFE_METADATA_FIELD/],
  ['a witness without its selected v3 link', { unlinked: true }, /UNSELECTED_PRIOR_RENDERER_WITNESS/],
]) test(`prior renderer transport refuses ${label}`, t => {
  const f = priorRendererFixture(t, options);
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), pattern);
});

test('a prior renderer witness cannot replace the current independent witness', t => {
  const f = rendererFixture(t, { independentSchema: 'archive-independent-prior-solution-renderer-review-v1' });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /PRIOR_RENDERER_REQUIRES_V3_LINK/);
});

test('a public renderer review observation requires reuse of the exact existing blob, not new author text', t => {
  const f = rendererFixture(t, { observation: 'Synthetic existing independent observation about preserved labels.' });
  const r = inspectSourceMetadataCandidate(f.opts);
  assert.equal(r.closure.publicBlobReuse.length, 1);
  const reuse = r.closure.publicBlobReuse[0];
  assert.equal(reuse.contentUploadPermitted, false);
  assert.equal(reuse.blobSha1, git(f.root, 'rev-parse', `${reuse.commit}:${reuse.path}`));
});

test('new or changed solution-observation strings cannot be substituted into public evidence', t => {
  const f = rendererFixture(t, { observation: 'Synthetic original observation', mutateWitnessCopy: d => {
    d.rows[0].directVisualReview.solution = 'Newly authored observation cannot inherit the original public proof';
  } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /TYPED_EVIDENCE_NOT_DECLARED|EVIDENCE_HASH|IMMUTABLE_EVIDENCE_MISMATCH/);
});

for (const observation of ['x'.repeat(1001), '<svg><text>synthetic new renderer payload</text></svg>']) {
  test('the named public observation role cannot carry oversized text or renderer markup', t => {
    const f = rendererFixture(t, { observation });
    assert.throws(() => inspectSourceMetadataCandidate(f.opts), /RAW_OR_UNSAFE_METADATA_FIELD/);
  });
}
