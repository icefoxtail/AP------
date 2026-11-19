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

function fixture(t, { inputExtra = {}, baseExtra = {}, publicEvidence = {}, finalizePublicEvidence, mutateManifest, mutateEnvelope,
  mutateRequest, mutatePreservation, setupRequest, withPreservation = false, withParent = false,
  extraBankRow = false, sourcePath = SOURCE, nativeSchema = 'm2-s2-meta-review-v1', mutateNativeDocument, executable,
  transformBank, transformAfter } = {}) {
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
  transformBank?.(bank);
  const before = 'window.questionBank = ' + JSON.stringify(bank, null, 2) + ';\n';
  const afterBank = structuredClone([{ ...bank[0], courseKey: 'M2-2' }, ...bank.slice(1)]);
  transformAfter?.(afterBank);
  const after = 'window.questionBank = ' + JSON.stringify(afterBank, null, 2) + ';\n';
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
  const finalizedEvidence = finalizePublicEvidence?.({ nativeCommit, native, nativeDocument, sourcePath, tuple }) || {};
  for (const [name, bytes] of Object.entries(finalizedEvidence)) put(name, bytes);
  if (Object.keys(finalizedEvidence).length) { git(root, 'add', '--', '.'); git(root, 'commit', '-qm', 'immutable finalization'); }
  const finalizationCommit = git(root, 'rev-parse', 'HEAD');
  for (const name of new Set([...Object.keys(publicEvidence), ...Object.keys(finalizedEvidence)])) git(root, 'rm', '--', name);
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
  setupRequest?.({ request, files, nativeCommit, finalizationCommit, finalizedEvidence, baseCommit, native, before, after, tuples, parent, parentSource });
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
  ['metadata nested object', r => { r.items[0].after.courseKey = { payload: 'value' }; }, /METADATA_SCALAR/],
  ['missing native evidence', r => { delete r.items[0].sourceReview; }, /NATIVE_SOURCE_REVIEW_REQUIRED/],
  ['native not bound to item', r => { r.items[0].evidenceRefs = [{ path: EXTRA, sha256: 'a'.repeat(64) }]; }, /ITEM_EVIDENCE_NOT_APPROVAL/],
]) test(`closed request shape rejects ${label}`, t => {
  const f = fixture(t, { mutateRequest });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), expected);
});

test('a field outside the value contract is not rejected; its name is reported in the result', async t => {
  const f = fixture(t, { mutateRequest: r => { r.items[0].after.userWrapper = 'value'; r.items[0].before.userWrapper = null; } });
  assert.doesNotThrow(() => inspectSourceMetadataCandidate(f.opts));
  const result = await buildSourceMetadataCandidate(f.opts);
  assert.ok(result.unstoredFields.includes('userWrapper'));
  assert.equal(result.unstoredFields.includes('courseKey'), false, 'a stored field is not reported as unstored');
  // a later call in the same process does not inherit the earlier call's names
  const g = fixture(t);
  assert.deepEqual((await buildSourceMetadataCandidate(g.opts)).unstoredFields, []);
});

test('parent labels are newly authored only from exact current public parent records', t => {
  const f = fixture(t, { withParent: true });
  const r = inspectSourceMetadataCandidate(f.opts);
  assert.equal(r.files.size, 4); assert.equal(r.closure.newApprovals, 0);
});

const TARGET_MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const TARGET_CROSSWALK = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const CURRENT_META = 'archive/data/question_metadata.json';
const parentValues = { curriculum: '2015', courseKey: 'M2-2', standardCourse: '중2 수학', standardUnitKey: 'M2-04',
  subUnitKey: 'M2-04-BASIC', problemTypeKey: 'PT_FIXTURE', templateKey: 'TPL_FIXTURE', L1: 'fixture major', L2: 'fixture leaf' };

function targetParentFixture(t, { crosswalk = false, mutateRef, mutateAfter, mutateRegistry, sourcePath = SOURCE } = {}) {
  const master = { schemaVersion: 'js-archive-taxonomy-rpm-primary-v1.0', authorityStatus: 'LOCKED', records: [
    { curriculum: '2015', scope: 'M2-2', majorUnit: parentValues.L1, midUnit: parentValues.L2 }] };
  const taxonomy = { status: 'DERIVED_READ_ONLY', problemTypes: [{ problemTypeKey: 'PT_FIXTURE', status: 'ACTIVE' }],
    templates: [{ templateKey: 'TPL_FIXTURE', parentProblemTypeKey: 'PT_FIXTURE', status: 'ACTIVE' }] };
  const bindings = { status: 'DERIVED_READ_ONLY', bindings: [{ curriculum: '2015', standardCourse: '중2 수학',
    standardUnitKey: 'M2-04', subUnitKey: 'M2-04-BASIC', problemTypeKey: 'PT_FIXTURE', status: 'ACTIVE',
    L1: parentValues.L1, L2: crosswalk ? 'current context alias' : parentValues.L2 }] };
  const tags = [{ key: 'M2-04', keyType: 'standardUnitKey', labelKo: parentValues.L1 },
    { key: 'M2-04-BASIC', keyType: 'subUnitKey', labelKo: crosswalk ? 'current context alias' : parentValues.L2 }];
  const cross = { schemaVersion: 'rpm-primary-active-crosswalk-v1', status: 'ACTIVE_REFERENCE', records: [{ id: 'RPM-M2-FIXTURE',
    curriculum: '2015', scope: 'M2-2', problemTypeKey: 'PT_FIXTURE', templateKey: 'TPL_FIXTURE', bindingStatus: 'ACTIVE',
    rpmPath: { majorUnit: parentValues.L1, midUnit: parentValues.L2 } }] };
  mutateRegistry?.({ master, taxonomy, bindings, tags, cross });
  const baseExtra = { [TARGET_MASTER]: json(master),
    'archive/data/meta-foundation/compiled/taxonomy_registry.json': json(taxonomy),
    'archive/data/meta-foundation/compiled/curriculum_bindings.json': json(bindings),
    'archive/data/master_tables/js_archive_tag_master.json': json(tags), ...(crosswalk ? { [TARGET_CROSSWALK]: json(cross) } : {}) };
  return fixture(t, { sourcePath, baseExtra,
    mutateNativeDocument: doc => { Object.assign(doc.items[0].after, parentValues); doc.items[0].rpmRecordId = 'RPM-M2-FIXTURE'; },
    setupRequest: ({ request, nativeCommit }) => {
      Object.assign(request.items[0].after, parentValues); mutateAfter?.(request.items[0].after);
      const ref = { path: TARGET_MASTER, sha256: rawHash(baseExtra[TARGET_MASTER]), curriculum: '2015', scope: 'M2-2',
        majorUnit: parentValues.L1, midUnit: parentValues.L2,
        ...(crosswalk ? { crosswalkRef: { path: TARGET_CROSSWALK, sha256: rawHash(baseExtra[TARGET_CROSSWALK]), recordId: 'RPM-M2-FIXTURE' } } : {}) };
      mutateRef?.(ref, nativeCommit); request.items[0].targetParentRef = ref;
      for (const r of [ref, ...(ref.crosswalkRef ? [ref.crosswalkRef] : [])]) {
        const evidence = { path: r.path, sha256: r.sha256 };
        request.approval.evidenceRefs.push(evidence); request.items[0].evidenceRefs.push(evidence);
      }
    } });
}

test('M2 target parent transport reads the exact current public master and active context without uploading either', async t => {
  const f = targetParentFixture(t), result = inspectSourceMetadataCandidate(f.opts);
  assert.equal(result.closure.newApprovals, 0); assert.equal(result.files.size, 3);
  const built = await buildSourceMetadataCandidate(f.opts);
  assert.equal(built.approvalEffect, 'NONE'); assert.equal(built.sourceFileCount, 1);
});

test('M2 crosswalk parent transport uses the native-selected exact ACTIVE PT/TPL row', t => {
  const f = targetParentFixture(t, { crosswalk: true });
  assert.equal(inspectSourceMetadataCandidate(f.opts).closure.newApprovals, 0);
});

for (const [label, options, pattern] of [
  ['different semester', { mutateRef: r => { r.scope = 'M2-1'; } }, /TARGET_PARENT_BASE_SCOPE/],
  ['different curriculum', { mutateAfter: a => { a.curriculum = '2022'; } }, /M2_CURRENT_PARENT_CONTEXT/],
  ['different grade', { mutateAfter: a => { a.standardCourse = '중3 수학'; } }, /M2_CURRENT_PARENT_CONTEXT/],
  ['changed parent label', { mutateRef: r => { r.midUnit = 'other parent'; } }, /TARGET_PARENT_BASE_SCOPE/],
  ['historical commit override', { mutateRef: (r, commit) => { r.commit = commit; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['wrong public hash', { mutateRef: r => { r.sha256 = '8'.repeat(64); } }, /EVIDENCE_HASH/],
  ['inactive binding', { mutateRegistry: r => { r.bindings.bindings[0].status = 'INACTIVE'; } }, /TARGET_PARENT_CURRENT_BINDING/],
  ['template from another parent', { mutateRegistry: r => { r.taxonomy.templates[0].parentProblemTypeKey = 'PT_OTHER'; } }, /TARGET_PARENT_CURRENT_BINDING/],
  ['foreign native crosswalk row', { crosswalk: true, mutateRef: r => { r.crosswalkRef.recordId = 'RPM-OTHER'; } }, /TARGET_PARENT_CROSSWALK_SCOPE/],
  ['unbound family template', { crosswalk: true, mutateRegistry: r => { delete r.cross.records[0].templateKey; } }, /TARGET_PARENT_CROSSWALK_RECORD/],
  ['raw parent payload', { mutateRef: r => { r.question = 'not metadata'; } }, /RAW_OR_UNSAFE_METADATA_FIELD/],
]) test(`M2 current public target parent rejects ${label}`, t => {
  const f = targetParentFixture(t, options); assert.throws(() => inspectSourceMetadataCandidate(f.opts), pattern);
});

function metadataParentFixture(t, { mutateDoc, mutateCurrent, mutateAfter } = {}) {
  const current = { questionUid: UID, sourceArchiveFile: SOURCE.slice('archive/exams/'.length), sourceOrdinal: 1,
    ...parentValues, metadataStatus: 'approved_semantic_review', reviewStatus: 'review_required' };
  mutateCurrent?.(current);
  const md = json({ schemaVersion: 'archive-question-metadata-v1', records: [current] });
  const snapshot = { questionUid: UID, sourceArchiveFile: current.sourceArchiveFile, sourceOrdinal: 1, curriculumKey: '2015',
    courseKey: '중2 수학', standardUnitKey: 'M2-04', subUnitKey: 'M2-04-BASIC', L1: parentValues.L1, L2: parentValues.L2 };
  const doc = { schemaVersion: 'archive-meta-pipeline-parent-label-evidence-v1', sourcePath: CURRENT_META,
    sourceSha256: rawHash(md), records: [snapshot] };
  mutateDoc?.(doc); const raw = json(doc);
  return fixture(t, { baseExtra: { [CURRENT_META]: md }, inputExtra: { [PARENT]: raw },
    setupRequest: ({ request }) => {
      Object.assign(request.items[0].after, parentValues); mutateAfter?.(request.items[0].after);
      const r = { path: PARENT, sha256: rawHash(raw) }; request.items[0].basicScopeParentRef = r;
      request.approval.evidenceRefs.push(r); request.items[0].evidenceRefs.push(r);
    } });
}

test('existing approved M2 metadata parent is a current-base projection for exactly the selected UID', t => {
  const f = metadataParentFixture(t), r = inspectSourceMetadataCandidate(f.opts);
  assert.equal(r.closure.newApprovals, 0); assert.equal(r.files.size, 4); assert(!r.files.has(CURRENT_META));
});

const rationaleContinuity = { schemaVersion: 'archive-native-rationale-continuity-v1' };
const nativeRationale = { primaryMethod: 'Synthetic native method', decisiveStep: 'Synthetic native decisive step' };

function rationaleContinuityFixture(t, { mutateRequest, mutateNative, mutateParent, twoItems = false,
  sourcePath = SOURCE, nativeSchema = 'm2-s2-meta-review-v1' } = {}) {
  const uids = twoItems ? [UID, UID2] : [UID];
  const current = uids.map((questionUid, index) => ({ questionUid, sourceArchiveFile: sourcePath.slice('archive/exams/'.length),
    sourceOrdinal: index + 1, ...parentValues, metadataStatus: 'approved_semantic_review', reviewStatus: 'review_required' }));
  const md = json({ schemaVersion: 'archive-question-metadata-v1', records: current });
  const doc = { schemaVersion: 'archive-meta-pipeline-parent-label-evidence-v1', sourcePath: CURRENT_META,
    sourceSha256: rawHash(md), records: current.map(row => ({ questionUid: row.questionUid,
      sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal, curriculumKey: '2015',
      courseKey: '중2 수학', standardUnitKey: 'M2-04', subUnitKey: 'M2-04-BASIC', L1: parentValues.L1, L2: parentValues.L2 })) };
  mutateParent?.(doc); const raw = json(doc);
  return fixture(t, { baseExtra: { [CURRENT_META]: md }, inputExtra: { [PARENT]: raw }, extraBankRow: twoItems, sourcePath, nativeSchema,
    transformAfter: bank => bank.forEach(row => { row.courseKey = 'M2-2'; }),
    mutateNativeDocument: native => { native.items.forEach(row => Object.assign(row, nativeRationale)); mutateNative?.(native); },
    setupRequest: ({ request }) => {
      if (twoItems) request.items.push({ ...structuredClone(request.items[0]), questionUid: UID2, sourceOrdinal: 2 });
      const ref = { path: PARENT, sha256: rawHash(raw) }; request.approval.evidenceRefs.push(ref);
      for (const item of request.items) {
        Object.assign(item.after, parentValues, { curriculumKey: '2015' }, nativeRationale);
        item.basicScopeParentRef = ref; item.evidenceRefs.push(ref);
        item.sourceReview.rationaleContinuity = structuredClone(rationaleContinuity);
      }
    },
    mutateRequest,
    mutateManifest: manifest => {
      if (twoItems) manifest.files[0].changes.push({ ...structuredClone(manifest.files[0].changes[0]), questionUid: UID2, sourceOrdinal: 2 });
    } });
}

test('M2 native rationale continuity transports the exact opt-in without inserting source rationale or granting approval', async t => {
  const f = rationaleContinuityFixture(t), result = inspectSourceMetadataCandidate(f.opts);
  assert.equal(result.closure.newApprovals, 0); assert.equal(result.closure.requestCount, 1);
  assert(!result.files.has(CURRENT_META));
  const built = await buildSourceMetadataCandidate(f.opts);
  assert.equal(built.registrationStatus, 'NOT_REGISTERED'); assert.equal(built.approvalEffect, 'NONE');
  assert.equal(git(f.root, 'show', `${built.candidateCommit}:${SOURCE}`) + '\n', f.after);
  assert.doesNotMatch(f.after, /primaryMethod|decisiveStep/);
  const request = JSON.parse(git(f.root, 'show', `${built.candidateCommit}:${REQUEST}`));
  assert.deepEqual(request.items[0].sourceReview.rationaleContinuity, rationaleContinuity);
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit);
});

test('M2 native rationale continuity binds every selected member to one exact metadata-parent inventory', t => {
  const f = rationaleContinuityFixture(t, { twoItems: true });
  assert.equal(inspectSourceMetadataCandidate(f.opts).closure.newApprovals, 0);
});

test('M2 native rationale continuity rejects basic-parent-links in place of a whole-metadata parent witness', t => {
  const f = fixture(t, { withParent: true,
    mutateNativeDocument: native => Object.assign(native.items[0], nativeRationale),
    mutateRequest: request => {
      Object.assign(request.items[0].after, parentValues, { curriculumKey: '2015' }, nativeRationale);
      request.items[0].sourceReview.rationaleContinuity = structuredClone(rationaleContinuity);
    } });
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), /RATIONALE_CONTINUITY_PARENT_SCOPE/);
});

for (const [label, options, pattern] of [
  ['unknown option key', { mutateRequest: r => { r.items[0].sourceReview.rationaleContinuity.approved = true; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['null option', { mutateRequest: r => { r.items[0].sourceReview.rationaleContinuity = null; } }, /OBJECT_REQUIRED/],
  ['different schema', { mutateRequest: r => { r.items[0].sourceReview.rationaleContinuity.schemaVersion = 'unreviewed'; } }, /RATIONALE_CONTINUITY_SCOPE/],
  ['proposal mixing', { mutateRequest: r => { r.items[0].sourceReview.proposalFinalization = {}; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['renderer mixing', { mutateRequest: r => { r.items[0].sourceReview.rendererProof = {}; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['retained-field mixing', { mutateRequest: r => { r.items[0].sourceReview.retainedFields = []; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['full scope', { mutateRequest: r => { delete r.scope; } }, /RATIONALE_CONTINUITY_SCOPE/],
  ['registration mode', { mutateRequest: r => { r.registrationMode = 'identity-only'; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['registry operation', { mutateRequest: r => { r.registryChanges.push({ before: null, after: {} }); } }, /RATIONALE_CONTINUITY_SCOPE/],
  ['source rebind', { mutateRequest: r => { r.approval.sourceRebind = {}; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['item rebind', { mutateRequest: r => { r.items[0].rebind = {}; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['missing parent', { mutateRequest: r => { delete r.items[0].basicScopeParentRef; } }, /RATIONALE_CONTINUITY_SCOPE/],
  ['second parent', { mutateRequest: r => { r.items[0].targetParentRef = {}; } }, /AMBIGUOUS_PARENT_REFERENCE/],
  ['conflicting curriculum key', { mutateRequest: r => { r.items[0].after.curriculumKey = '2022'; } }, /RATIONALE_CONTINUITY_SCOPE/],
  ['different curriculum', { mutateRequest: r => { r.items[0].after.curriculum = '2022'; } }, /M2_CURRENT_PARENT_CONTEXT/],
  ['different semester', { mutateRequest: r => { r.items[0].after.courseKey = 'M2-1'; } }, /M2_CURRENT_PARENT_CONTEXT/],
  ['different grade source and native', { sourcePath: SOURCE.replace('/m2/', '/m3/'), nativeSchema: 'm3-s2-complete-semantic-review-v1' }, /M2_CURRENT_PARENT_CONTEXT/],
  ['M3 native in an M2 source', { nativeSchema: 'm3-s2-complete-semantic-review-v1' }, /NATIVE_SOURCE_DENOMINATOR/],
  ['course alias', { mutateRequest: r => { r.items[0].after.standardCourse = '중2수학'; } }, /RATIONALE_CONTINUITY_SCOPE/],
  ['changed method', { mutateRequest: r => { r.items[0].after.primaryMethod = 'Different method'; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['missing method', { mutateRequest: r => { delete r.items[0].after.primaryMethod; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['changed decisive step', { mutateRequest: r => { r.items[0].after.decisiveStep = 'Different step'; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['missing native rationale', { mutateNative: n => { delete n.items[0].decisiveStep; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['blank native rationale', { mutateNative: n => { n.items[0].primaryMethod = ' '; }, mutateRequest: r => { r.items[0].after.primaryMethod = ' '; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['native after rationale instead of top-level evidence', { mutateNative: n => { n.items[0].after.primaryMethod = nativeRationale.primaryMethod; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['native after null rationale', { mutateNative: n => { n.items[0].after.decisiveStep = null; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['native after missing', { mutateNative: n => { delete n.items[0].after; } }, /RATIONALE_CONTINUITY_NATIVE_VALUES/],
  ['mixed selected opt-ins', { twoItems: true, mutateRequest: r => { delete r.items[1].sourceReview.rationaleContinuity; } }, /RATIONALE_CONTINUITY_PARENT_SCOPE/],
  ['different selected parent refs', { twoItems: true, mutateRequest: r => { r.items[1].basicScopeParentRef = { ...r.items[1].basicScopeParentRef, sha256: '8'.repeat(64) }; } }, /RATIONALE_CONTINUITY_PARENT_SCOPE/],
  ['unselected parent row', { mutateParent: p => { p.records.push({ ...p.records[0], questionUid: UID2, sourceOrdinal: 2 }); } }, /METADATA_PARENT_SELECTED_SCOPE/],
]) test(`M2 native rationale continuity rejects ${label}`, t => {
  const f = rationaleContinuityFixture(t, options);
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), pattern);
});

for (const [label, options, pattern] of [
  ['forged snapshot row', { mutateDoc: d => { d.records[0].L2 = 'invented'; } }, /METADATA_PARENT_VALUE_DRIFT/],
  ['another UID', { mutateDoc: d => { d.records[0].questionUid = UID2; } }, /METADATA_PARENT_SELECTED_SCOPE/],
  ['another ordinal', { mutateDoc: d => { d.records[0].sourceOrdinal = 2; } }, /METADATA_PARENT_SELECTED_SCOPE/],
  ['an unselected record', { mutateDoc: d => { d.records.push({ ...d.records[0], questionUid: UID2, sourceOrdinal: 2 }); } }, /METADATA_PARENT_SELECTED_SCOPE/],
  ['an old whole-metadata hash', { mutateDoc: d => { d.sourceSha256 = '8'.repeat(64); } }, /METADATA_PARENT_SOURCE_HASH/],
  ['unapproved current metadata', { mutateCurrent: d => { d.metadataStatus = 'registration_pending_semantic_review'; } }, /METADATA_PARENT_NOT_APPROVED/],
  ['changed after parent', { mutateAfter: a => { a.L1 = 'different'; } }, /METADATA_PARENT_VALUE_DRIFT/],
  ['another course', { mutateAfter: a => { a.courseKey = 'M2-1'; } }, /M2_CURRENT_PARENT_CONTEXT/],
  ['raw student field', { mutateDoc: d => { d.records[0].solution = 'not metadata'; } }, /RAW_OR_UNSAFE_METADATA_FIELD/],
]) test(`current approved-metadata parent rejects ${label}`, t => {
  const f = metadataParentFixture(t, options); assert.throws(() => inspectSourceMetadataCandidate(f.opts), pattern);
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

function conceptV1Fixture(t, { mutateProof, mutateProofCopy, mutateNative, mutateRequest } = {}) {
  const primary = { standardCourse: '중2 수학', standardUnitKey: 'M2-07', subUnitKey: 'M2-07-BASIC',
    problemTypeKey: 'PT_FIXTURE', templateKey: 'TPL_FIXTURE' };
  const definition = conceptKey => ({ conceptKey, status: 'ACTIVE', definition: 'Synthetic exact concept' });
  return fixture(t, {
    mutateNativeDocument: native => {
      native.examId = 'E059'; native.proposals = [
        { id: 'CC-P1', type: 'CC', supportingQuestionUids: [UID] },
        { id: 'CC-P2', type: 'CC', supportingQuestionUids: [UID2] }];
      native.items[0].proposalRefs = ['CC-P1'];
      native.items[0].after = { ...native.items[0].after, ...primary, crossConceptKeys: [] };
      mutateNative?.(native);
    },
    finalizePublicEvidence: ({ nativeCommit, native, nativeDocument, sourcePath }) => {
      const proof = { schemaVersion: 'archive-cross-concept-narrow-definition-finalization-v1',
        status: 'DEFINITIONS_FINALIZED_OFFICIAL_REGISTRATION_PENDING', reviewer: 'Independent fixture reviewer',
        nativeReviewCommit: nativeCommit,
        scope: { newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0 },
        applications: [{ questionUid: UID, sourceOrdinal: 1, examId: 'E059', sourcePath,
          nativeReviewRef: { commit: nativeCommit, path: NATIVE_ORIGIN, sha256: rawHash(native) },
          nativeItemStableSha256: rawHash(stable(nativeDocument.items[0])), nativeProposalRefs: ['CC-P1'],
          definitionDisposition: 'ADD_EXACT_NEW_CANONICAL_CC', newMathematicalQa: false, newMetadataApproval: false,
          difficultyChanged: false, nativeProtectedStudentFieldsChanges: [], nativeAfterCrossConceptKeys: [],
          addCrossConceptKey: 'CC_FIXTURE', reviewedPrimaryContext: primary }],
        definitionDecisions: ['CC_FIXTURE', 'CC_UNSELECTED'].map(key => ({ definition: definition(key) })) };
      mutateProof?.(proof);
      const proofBytes = json(proof), finalRef = { path: FINALIZATION, sha256: rawHash(proofBytes) };
      const registry = { schemaVersion: 'archive-reviewed-cross-concept-registry-change-proposal-v1',
        status: 'PENDING_OFFICIAL_REGISTRAR', evidenceRefs: [finalRef],
        registryChanges: ['CC_FIXTURE', 'CC_UNSELECTED'].map(key => ({
          path: 'archive/data/meta-foundation/canonical/concept_registry.json', collection: 'concepts',
          match: { conceptKey: key }, before: null, after: definition(key), evidenceRefs: [finalRef] })) };
      return { [FINALIZATION]: proofBytes, [REGISTRY_PROPOSAL]: json(registry) };
    },
    setupRequest: ({ request, files, finalizationCommit, nativeCommit, finalizedEvidence }) => {
      Object.assign(files, finalizedEvidence);
      if (mutateProofCopy) { const proof = JSON.parse(files[FINALIZATION]); mutateProofCopy(proof); files[FINALIZATION] = json(proof); }
      const finalRef = { path: FINALIZATION, sha256: rawHash(files[FINALIZATION]) };
      const registryRef = { path: REGISTRY_PROPOSAL, sha256: rawHash(files[REGISTRY_PROPOSAL]) };
      request.items[0].after = { ...request.items[0].after, ...primary, crossConceptKeys: ['CC_FIXTURE'] };
      request.items[0].sourceReview.proposalFinalization = { schemaVersion: 'archive-native-proposal-finalization-v1',
        finalizationCommit, finalizationRef: finalRef, registryChangesRef: registryRef, proposalIds: ['CC-P1'] };
      request.approval.evidenceRefs.push(finalRef, registryRef); request.items[0].evidenceRefs.push(finalRef, registryRef);
      const changes = JSON.parse(files[REGISTRY_PROPOSAL]).registryChanges;
      request.registryChanges = [structuredClone(changes[0])];
      mutateRequest?.({ request, changes, finalRef, registryRef, nativeCommit });
    },
  });
}

test('M2 v1 CC transport carries only the exact selected public change including its evidence refs', async t => {
  const f = conceptV1Fixture(t), inspection = inspectSourceMetadataCandidate(f.opts);
  assert.equal(inspection.closure.selectedUidCount, 1);
  assert.equal(inspection.closure.newApprovals, 0);
  const built = await buildSourceMetadataCandidate(f.opts);
  const request = JSON.parse(git(f.root, 'show', `${built.candidateCommit}:${REQUEST}`));
  assert.equal(request.registryChanges.length, 1);
  assert.equal(request.registryChanges[0].after.conceptKey, 'CC_FIXTURE');
  assert.equal(built.registrationStatus, 'NOT_REGISTERED');
  assert.equal(built.approvalEffect, 'NONE');
});

for (const [label, options, error] of [
  ['unselected native proposal ID', { mutateRequest: ({ request }) => { request.items[0].sourceReview.proposalFinalization.proposalIds = ['CC-P2']; } }, /M2_V1_CC_PROPOSAL_IDS/],
  ['non-CC native proposal', { mutateNative: native => { native.proposals[0].type = 'NEW_TPL'; } }, /M2_V1_CC_NATIVE_PROPOSAL/],
  ['unknown opt-in fields', { mutateRequest: ({ request }) => { request.items[0].sourceReview.proposalFinalization.extraAuthority = true; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['changed public proof copy', { mutateProofCopy: proof => { proof.unreviewedField = 'new'; } }, /IMMUTABLE_EVIDENCE_MISMATCH/],
  ['wrong selected UID', { mutateProof: proof => { proof.applications[0].questionUid = UID2; } }, /EVIDENCE_SELECTED_UID/],
  ['wrong native item digest', { mutateProof: proof => { proof.applications[0].nativeItemStableSha256 = 'f'.repeat(64); } }, /M2_V1_CC_APPLICATION/],
  ['different approved primary', { mutateProof: proof => { proof.applications[0].reviewedPrimaryContext = { ...proof.applications[0].reviewedPrimaryContext, templateKey: 'TPL_OTHER' }; } }, /M2_V1_CC_PRIMARY_CONTEXT/],
  ['new-approval claim', { mutateProof: proof => { proof.scope.newMetadataApprovals = 1; } }, /M2_V1_CC_FINALIZATION_SCOPE/],
  ['missing selected change', { mutateRequest: ({ request }) => { request.registryChanges = []; } }, /M2_V1_CC_SELECTED_REGISTRY_CHANGE/],
  ['unselected sibling public definition', { mutateRequest: ({ request, changes }) => { request.registryChanges.push(structuredClone(changes[1])); } }, /REGISTRY_CHANGE_NOT_IMMUTABLE_PROPOSAL/],
  ['modified definition value', { mutateRequest: ({ request }) => { request.registryChanges[0].after.definition = 'Unreviewed change'; } }, /M2_V1_CC_SELECTED_REGISTRY_CHANGE/],
  ['different change evidence refs', { mutateRequest: ({ request, registryRef }) => { request.registryChanges[0].evidenceRefs = [registryRef]; } }, /M2_V1_CC_SELECTED_REGISTRY_CHANGE/],
  ['wrong finalization commit', { mutateRequest: ({ request, nativeCommit }) => { request.items[0].sourceReview.proposalFinalization.finalizationCommit = nativeCommit; } }, /INPUT_FILE_MISSING/],
  ['raw student field even in public evidence', { mutateProof: proof => { proof.answer = 'Synthetic raw payload'; } }, /RAW_OR_UNSAFE_METADATA_FIELD/],
]) test(`M2 v1 CC transport rejects ${label}`, t => {
  const f = conceptV1Fixture(t, options);
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), error);
  assert.equal(fs.existsSync(f.outputRoot), false);
});

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

function m2ProposalV3Fixture(t, { type = 'NEW_PT', mutateNative, mutateWitness, mutateProof, mutateCopy,
  mutateRequest, mutateManifest, profile = 'M2_NATIVE_PROPOSAL_V3' } = {}) {
  const witnessPath = '.archive-meta-register/evidence/m2-v3-root-independent.json';
  const rpmPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const prerequisitePath = '.archive-meta-register/evidence/m2-v3-public-prerequisite.json';
  const rpm = { id: 'RPM_M2_V3_FIXTURE', curriculum: '2015', scope: 'M2-2', ownerPack: 'MIDDLE_GEOMETRY', rpmPath: { l3: 'Synthetic narrow primary' } };
  const rpmBytes = json({ records: [rpm] }), isConcept = type.startsWith('CC'), isPrimary = type === 'NEW_PT';
  const primary = { standardCourse: '중2 수학', standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES',
    problemTypeKey: isPrimary ? 'PT_M2_V3_NEW' : 'PT_FIXTURE', templateKey: isConcept ? 'TPL_FIXTURE' : 'TPL_M2_V3_NEW' };
  const concept = { conceptKey: 'CC_M2_V3_FIXTURE', status: 'ACTIVE', definition: 'Synthetic finalized concept' };
  const conceptChange = { path: 'archive/data/meta-foundation/canonical/concepts/plane-geometry.json',
    collection: 'concepts', match: { conceptKey: concept.conceptKey }, before: null, after: concept };
  const prerequisiteBytes = json({ registryChanges: [conceptChange] });
  const metadataOps = isConcept ? [{ field: 'crossConceptKeys', beforePresent: true, before: [], afterPresent: true, after: [concept.conceptKey] }]
    : [{ field: 'templateKey', beforePresent: true, before: 'TPL_OLD', afterPresent: true, after: primary.templateKey },
      ...(isPrimary ? [{ field: 'problemTypeKey', beforePresent: true, before: 'PT_OLD', afterPresent: true, after: primary.problemTypeKey }] : [])];
  let selectedChanges, siblingChange, refs;
  return fixture(t, {
    extraBankRow: true,
    baseExtra: { [rpmPath]: rpmBytes }, publicEvidence: type === 'CC_REUSE' ? { [prerequisitePath]: prerequisiteBytes } : {},
    transformBank: bank => Object.assign(bank[0], { crossConceptKeys: [], templateKey: 'TPL_OLD', problemTypeKey: 'PT_OLD' }),
    transformAfter: bank => metadataOps.forEach(op => { bank[0][op.field] = op.after; }),
    mutateNativeDocument: native => {
      native.examId = 'E054'; native.proposals = [{ id: 'M2-V3-P1', type: isConcept ? 'CC' : type,
        supportingQuestionUids: [UID], parent: `${rpm.id} / ${rpm.rpmPath.l3}` }];
      Object.assign(native.items[0], { proposalRefs: ['M2-V3-P1'], rpmRecordId: rpm.id,
        after: isPrimary ? {} : { ...primary, crossConceptKeys: [] },
        activeDefinitionMatch: { problemTypeKey: null, templateKey: null, problemTypeStatus: null,
          templateStatus: null, templateParent: null, exactBindings: [] } });
      mutateNative?.(native);
    },
    finalizePublicEvidence: ({ nativeCommit, native, nativeDocument, sourcePath }) => {
      const row = nativeDocument.items[0], proposal = nativeDocument.proposals[0];
      const selection = { documentRef: { path: NATIVE_ORIGIN, sha256: rawHash(native) }, index: 0,
        proposalSha256: rawHash(stable(proposal)), questionUid: UID, sourceOrdinal: 1, proposalId: 'M2-V3-P1' };
      const pt = { problemTypeKey: primary.problemTypeKey, ownerPack: rpm.ownerPack, status: 'ACTIVE', labelKo: 'Synthetic PT' };
      const tpl = { templateKey: primary.templateKey, parentProblemTypeKey: primary.problemTypeKey, ownerPack: rpm.ownerPack, status: 'ACTIVE' };
      const taxonomy = 'archive/data/meta-foundation/canonical/packs/middle-geometry/taxonomy.json';
      const match = { problemTypeKey: primary.problemTypeKey, curriculum: rpm.curriculum,
        standardCourse: primary.standardCourse, standardUnitKey: primary.standardUnitKey, subUnitKey: primary.subUnitKey };
      const binding = { ...match, ownerPack: rpm.ownerPack, status: 'ACTIVE', supportingQuestionUids: [UID], supportingItemCount: 1 };
      const choice = { selection, disposition: type === 'CC_REUSE' ? 'REUSE_ACTIVE' : 'ADD_ONLY', definition: isConcept ? concept : tpl };
      if (type === 'CC_REUSE') Object.assign(choice, { canonicalPath: conceptChange.path,
        prerequisiteDefinitionRef: { commit: nativeCommit, path: prerequisitePath, sha256: rawHash(prerequisiteBytes), definitionSha256: rawHash(stable(concept)) } });
      else choice.registryChange = isConcept ? conceptChange : { path: taxonomy, collection: 'templates',
        match: { templateKey: tpl.templateKey }, before: null, after: tpl };
      if (isPrimary) Object.assign(choice, { problemTypeDefinition: pt, binding,
        problemTypeRegistryChange: { path: taxonomy, collection: 'problemTypes', match: { problemTypeKey: pt.problemTypeKey }, before: null, after: pt },
        bindingRegistryChange: { path: taxonomy.replace('taxonomy.json', 'bindings.json'), collection: 'bindings', match, before: null, after: binding } });
      selectedChanges = ['registryChange', 'problemTypeRegistryChange', 'bindingRegistryChange'].map(k => choice[k]).filter(Boolean);
      siblingChange = { ...conceptChange, match: { conceptKey: 'CC_UNSELECTED' }, after: { ...concept, conceptKey: 'CC_UNSELECTED' } };
      const scope = { newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, newSourceContentEdits: 0 };
      const app = { examId: nativeDocument.examId, questionUid: UID, sourceOrdinal: 1, sourcePath,
        nativeReviewRef: { commit: nativeCommit, path: NATIVE_ORIGIN, sha256: rawHash(native) },
        nativeItemStableSha256: rawHash(stable(row)), proposalSelections: [selection],
        sourceSnapshot: { commit: nativeCommit, path: sourcePath, sha256: 'a'.repeat(64) }, rendererAssets: [],
        reviewedPrimaryContext: primary, decisions: [choice], reviewer: 'Independent synthetic reviewer', reason: 'Finalize selected original proposal',
        newMathematicalQa: false, newMetadataApproval: false, difficultyChanged: false, nativeProtectedStudentFieldsChanges: [] };
      const witness = { schemaVersion: 'archive-independent-m2-native-definition-finalization-v1',
        decision: 'APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS', reviewer: app.reviewer, ...scope,
        existingDefinitionsModified: 0, sourceWrites: 0, canonicalWrites: 0, officialCompilerResolverConsumerStillRequired: true,
        actualMainRegistrationClaimed: false, currentMainChecked: nativeCommit, approvedRegistryChanges: [...selectedChanges, siblingChange],
        rows: [{ ...app, nativeProposal: proposal, proposalSelection: selection, nativeAfter: row.after,
          nativeActiveDefinitionMatch: row.activeDefinitionMatch, decision: choice, protectedPayloadFieldsUnchanged: true,
          nativeRpmContext: { path: rpmPath, sha256: rawHash(rpmBytes), record: rpm },
          newFullMathematicalQa: false, newReview2: false, newDifficultyJudgment: false, sourceWrites: 0 }] };
      mutateWitness?.(witness);
      const witnessBytes = json(witness); app.independentReviewRef = { path: witnessPath, sha256: rawHash(witnessBytes) };
      const proof = { schemaVersion: 'archive-independent-m2-native-proposal-disposition-v1',
        status: 'NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING', scope, applications: [app] };
      mutateProof?.(proof);
      return { [FINALIZATION]: json(proof), [witnessPath]: witnessBytes };
    },
    setupRequest: ({ request, files, finalizationCommit, finalizedEvidence }) => {
      Object.assign(files, finalizedEvidence); mutateCopy?.(files);
      const finalRef = { path: FINALIZATION, sha256: rawHash(files[FINALIZATION]) }, witnessRef = { path: witnessPath, sha256: rawHash(files[witnessPath]) };
      refs = [finalRef, witnessRef];
      Object.assign(request.items[0].after, primary);
      metadataOps.forEach(op => { request.items[0].after[op.field] = op.after; });
      request.items[0].sourceReview.proposalFinalization = { schemaVersion: 'archive-native-proposal-finalization-v3',
        finalizationCommit, finalizationRef: finalRef, proposalSelections: JSON.parse(files[FINALIZATION]).applications[0].proposalSelections };
      request.approval.evidenceRefs.push(...refs); request.items[0].evidenceRefs.push(...refs);
      request.registryChanges = selectedChanges.map(c => ({ ...structuredClone(c), evidenceRefs: refs }));
      mutateRequest?.({ request, siblingChange, selectedChanges, refs, witnessRef, finalRef });
    },
    mutateManifest: manifest => {
      if (profile) manifest.transportProfile = profile;
      manifest.files[0].changes[0].metadataFields.push(...structuredClone(metadataOps));
      mutateManifest?.(manifest);
    },
  });
}

for (const type of ['CC', 'CC_REUSE', 'NEW_TPL', 'NEW_PT']) {
  test(`M2 v3 candidate closes the exact public ${type} selection without issuing an approval`, async t => {
    const f = m2ProposalV3Fixture(t, { type }), inspected = inspectSourceMetadataCandidate(f.opts);
    assert.equal(inspected.closure.selectedUidCount, 1); assert.equal(inspected.closure.newApprovals, 0);
    const result = await buildSourceMetadataCandidate(f.opts);
    assert.equal(result.registrationStatus, 'NOT_REGISTERED'); assert.equal(result.approvalEffect, 'NONE');
    const request = JSON.parse(git(f.root, 'show', `${result.candidateCommit}:${REQUEST}`));
    assert.equal(request.registryChanges.length, type === 'CC_REUSE' ? 0 : type === 'NEW_PT' ? 3 : 1);
    assert.equal(request.registryChanges.some(c => c.after.conceptKey === 'CC_UNSELECTED'), false);
    assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit);
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath), 'utf8'), f.before);
  });
}

for (const [label, options, error] of [
  ['missing explicit primary profile', { profile: null }, /M2_V3_PRIMARY_PROFILE/],
  ['unknown proposal option', { mutateRequest: ({ request: r }) => { r.items[0].sourceReview.proposalFinalization.ignorePrior = true; } }, /UNKNOWN_OR_MISSING_FIELD/],
  ['wrong original index', { mutateRequest: ({ request: r }) => { r.items[0].sourceReview.proposalFinalization.proposalSelections[0].index = 1; } }, /M2_V3_NATIVE_PROPOSAL/],
  ['wrong original proposal hash', { mutateRequest: ({ request: r }) => { r.items[0].sourceReview.proposalFinalization.proposalSelections[0].proposalSha256 = 'e'.repeat(64); } }, /M2_V3_NATIVE_PROPOSAL/],
  ['foreign selected UID', { mutateRequest: ({ request: r }) => { r.items[0].sourceReview.proposalFinalization.proposalSelections[0].questionUid = UID2; } }, /M2_V3_NATIVE_SELECTION/],
  ['unrelated native proposal type', { mutateNative: n => { n.proposals[0].type = 'BOUNDARY_REVIEW'; } }, /M2_V3_NATIVE_PROPOSAL/],
  ['changed public proof copy', { mutateCopy: files => { const p = JSON.parse(files[FINALIZATION]); p.unreviewed = true; files[FINALIZATION] = json(p); } }, /IMMUTABLE_EVIDENCE_MISMATCH/],
  ['raw student body in public evidence', { mutateProof: p => { p.solution = 'Unpermitted payload'; } }, /RAW_OR_UNSAFE_METADATA_FIELD/],
  ['new mathematical approval claim', { mutateWitness: w => { w.newFullMathematicalQa = true; } }, /M2_V3_INDEPENDENT_SCOPE/],
  ['missing root witness', { mutateRequest: ({ request: r, witnessRef }) => { r.items[0].evidenceRefs = r.items[0].evidenceRefs.filter(x => x.path !== witnessRef.path); } }, /TYPED_EVIDENCE_NOT_DECLARED/],
  ['different original native after', { mutateWitness: w => { w.rows[0].nativeAfter = { problemTypeKey: 'PT_OTHER' }; } }, /M2_V3_ORIGINAL_WITNESS/],
  ['different current snapshot', { mutateProof: p => { p.applications[0].sourceSnapshot = { ...p.applications[0].sourceSnapshot, commit: 'a'.repeat(40) }; } }, /M2_V3_INDEPENDENT_SCOPE/],
  ['different primary owner context', { mutateProof: p => { p.applications[0].reviewedPrimaryContext = { ...p.applications[0].reviewedPrimaryContext, problemTypeKey: 'PT_OTHER' }; } }, /M2_V3_PRIMARY_CONTEXT/],
  ['missing selected definition', { mutateRequest: ({ request: r }) => { r.registryChanges.shift(); } }, /M2_V3_SELECTED_REGISTRY_CHANGE/],
  ['replacement of existing registry row', { mutateRequest: ({ request: r }) => { r.registryChanges[0].before = {}; } }, /M2_V3_SELECTED_REGISTRY_CHANGE/],
  ['unbound selected change', { mutateRequest: ({ request: r }) => { r.registryChanges[0].evidenceRefs = []; } }, /M2_V3_SELECTED_REGISTRY_CHANGE/],
  ['different binding context', { mutateRequest: ({ request: r }) => { r.registryChanges.find(c => c.collection === 'bindings').after.curriculum = '2022'; } }, /M2_V3_SELECTED_REGISTRY_CHANGE/],
  ['unselected public sibling definition', { mutateRequest: ({ request: r, siblingChange, refs }) => { r.registryChanges.push({ ...siblingChange, evidenceRefs: refs }); } }, /REGISTRY_CHANGE_NOT_IMMUTABLE_PROPOSAL/],
  ['reused CC disguised as another new definition', { type: 'CC_REUSE', mutateRequest: ({ request: r, refs }) => {
    const p = { conceptKey: 'CC_M2_V3_FIXTURE', status: 'ACTIVE', definition: 'Synthetic finalized concept' };
    r.registryChanges.push({ path: 'archive/data/meta-foundation/canonical/concepts/plane-geometry.json', collection: 'concepts',
      match: { conceptKey: p.conceptKey }, before: null, after: p, evidenceRefs: refs }); } }, /REGISTRY_CHANGE_NOT_IMMUTABLE_PROPOSAL/],
]) test(`M2 v3 candidate rejects ${label}`, t => {
  const f = m2ProposalV3Fixture(t, options);
  assert.throws(() => inspectSourceMetadataCandidate(f.opts), error);
  assert.equal(fs.existsSync(f.outputRoot), false);
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit);
});

// Closed image8 tests reuse the immutable reviewed context as opaque Git bytes.
// Only hashes/ref metadata are committed here; no student source or review body
// is embedded in the tests. Missing exact evidence is a fixture failure.
import vmImage8 from 'node:vm';
import { M2_PROBLEM_IMAGE_REPAIR8_PROFILE as IMAGE8_PROFILE, M2_PROBLEM_IMAGE_REPAIR8_SCHEMA as IMAGE8_SCHEMA,
  M2_PROBLEM_IMAGE_REPAIR8_STATIC_SCHEMA as IMAGE8_STATIC_SCHEMA, M2_PROBLEM_IMAGE_REPAIR8_SCOPE as IMAGE8_SCOPE,
  materializeM2ProblemImageRepair8 } from '../archive/tools/meta-foundation/materialize-reviewed-problem-image-repair8.mjs';
const IMAGE8_STATIC = 'docs/operations/m2-problem-image8-repair-20261116/independent-static-v2.json';
const IMAGE8_A2_COMMIT = '8a03e198329962876dadc62149821efefecf0a02';
const IMAGE8_ORIGINAL_COMMIT = '61830b6cd7ef773f6d9c963142a7e95af4c48e82';
const image8Ref = (commit, name, raw) => ({ commit, path: name, gitBlobSha1: blobHash(raw), sha256: rawHash(raw), bytes: Buffer.byteLength(raw) });
const image8Run = raw => {
  const ctx = { window: {} }; vmImage8.runInNewContext(String(raw), ctx, { timeout: 3000 });
  return JSON.parse(JSON.stringify(ctx.window.questionBank || ctx.window.questions || ctx.questionBank || ctx.questions));
};
const image8Evidence = new Map();
function image8EvidenceBytes(commit, name) {
  const key = commit + ':' + name;
  if (!image8Evidence.has(key)) image8Evidence.set(key, execFileSync('git', ['-C', repository, 'show', key], {
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1' }, maxBuffer: 2 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  }));
  return image8Evidence.get(key);
}
const image8ApprovedAssets = new Map();
function image8Asset(scope) {
  if (!image8ApprovedAssets.has(scope.key)) {
    const raw = execFileSync('git', ['-C', repository, 'cat-file', 'blob', scope.approvedAssetGitBlobSha1], {
      env: { ...process.env, GIT_NO_LAZY_FETCH: '1' }, maxBuffer: 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
    });
    assert.equal(blobHash(raw), scope.approvedAssetGitBlobSha1); assert.equal(rawHash(raw), scope.approvedAssetSha256);
    assert.equal(raw.length, scope.approvedAssetBytes); image8ApprovedAssets.set(scope.key, raw);
  }
  return image8ApprovedAssets.get(scope.key);
}
function image8Fixture(t, { changeBank, suffix, changeSource, changeIdentity, changeReview, changeManifest, changeOldAsset,
  changeEnvelope, changeManifestText, extraInput, changeExpectedAfter } = {}) {
  const container = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-image8-candidate-fixture-'));
  t.after(() => fs.rmSync(container, { recursive: true, force: true }));
  const root = path.join(container, 'repo'); fs.mkdirSync(root);
  const put = (name, raw) => { const f = path.join(root, name); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, raw); };
  git(root, 'init', '-q', '-b', 'main'); git(root, 'config', 'user.name', 'Image fixture');
  git(root, 'config', 'user.email', 'fixture@example.invalid'); git(root, 'config', 'commit.gpgsign', 'false');
  git(root, 'config', 'core.quotePath', 'false');
  const common = path.resolve(repository, git(repository, 'rev-parse', '--git-common-dir'));
  fs.writeFileSync(path.join(root, '.git/objects/info/alternates'), path.join(common, 'objects') + '\n');
  put('README.md', 'Opaque immutable context transport fixture\n');
  for (const s of IMAGE8_SCOPE) put(s.newAssetPath, image8Asset(s));
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'immutable approved assets');
  const assetCommit = git(root, 'rev-parse', 'HEAD');
  const approvedReview = JSON.parse(image8EvidenceBytes(IMAGE8_A2_COMMIT, IMAGE8_STATIC));
  const review = structuredClone(approvedReview);
  assert.equal(review.schemaVersion, IMAGE8_STATIC_SCHEMA);
  changeReview?.(review); const reviewRaw = json(review); put(IMAGE8_STATIC, reviewRaw);
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'immutable independent static context');
  const reviewCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'rm', '--', IMAGE8_STATIC, ...IMAGE8_SCOPE.map(s => s.newAssetPath));
  const sourcePaths = [...new Set(IMAGE8_SCOPE.map(s => s.sourcePath))], sources = new Map(), after = new Map(), banks = new Map(), records = [];
  for (const [index, sourcePath] of sourcePaths.entries()) {
    const sourceArchiveFile = sourcePath.slice('archive/exams/'.length), scope = IMAGE8_SCOPE.filter(s => s.sourcePath === sourcePath);
    const bank = image8Run(image8EvidenceBytes(IMAGE8_ORIGINAL_COMMIT, sourcePath));
    assert.equal(bank.length, index === 0 ? 23 : 24);
    for (const [i, q] of bank.entries()) {
      const owner = scope.find(s => s.sourceOrdinal === i + 1), questionUid = owner?.questionUid || 'qid_v1_' + rawHash(`${sourcePath}:${i + 1}`);
      const sourceQuestionNo = q.sourceQuestionNo ?? q.sourceQid ?? q.id ?? i + 1;
      records.push({ questionUid, sourceArchiveFile, sourceOrdinal: i + 1, sourceQuestionNo,
        legacyQKey: sourceArchiveFile + '_' + sourceQuestionNo });
    }
    changeBank?.(bank, index);
    const tail = suffix?.(index) ?? '\n// Public trailing metadata remains byte-identical.\nwindow.questionBank[10].courseKey = "M2-2";\n';
    let before = '// Opaque historical source context serialized for isolated transport test\nwindow.questionBank = ' + JSON.stringify(bank, null, 2) + ';\n' + tail;
    before = changeSource?.(before, index) ?? before;
    const executed = image8Run(before); banks.set(sourcePath, executed); sources.set(sourcePath, before); put(sourcePath, before);
    let changed = before;
    for (const s of scope) changed = changed.replace('"image": ' + JSON.stringify(s.oldAssetPath.slice('archive/'.length)),
      '"image": ' + JSON.stringify(s.newAssetPath.slice('archive/'.length)));
    changed = changeExpectedAfter?.(changed, index) ?? changed; after.set(sourcePath, changed);
    for (const s of scope) {
      const original = image8EvidenceBytes(IMAGE8_ORIGINAL_COMMIT, s.oldAssetPath);
      put(s.oldAssetPath, changeOldAsset?.(original, s) ?? original);
    }
  }
  put('archive/assets/images/fixture-original.png', 'Synthetic original PNG bytes\n');
  const identity = { schemaVersion: 'question-identity-map-v1', records,
    lookup: { byQuestionUid: Object.fromEntries(records.map(({ questionUid, ...r }) => [questionUid, r])),
      bySourceFileAndOrdinal: Object.fromEntries(sourcePaths.map(p => [p.slice('archive/exams/'.length), Object.fromEntries(records.filter(r => r.sourceArchiveFile === p.slice('archive/exams/'.length)).map(r => [r.sourceOrdinal, r.questionUid]))])),
      bySourceFileAndQuestionNo: Object.fromEntries(sourcePaths.map(p => [p.slice('archive/exams/'.length), Object.fromEntries(records.filter(r => r.sourceArchiveFile === p.slice('archive/exams/'.length)).map(r => [r.sourceQuestionNo, [r.questionUid]]))])),
      byLegacyQKey: Object.fromEntries(records.map(r => [r.legacyQKey, [r.questionUid]])) } };
  changeIdentity?.(identity); const identityRaw = json(identity); put(IDENTITY, identityRaw);
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'trusted current source and identity');
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  const manifest = { schemaVersion: IMAGE8_SCHEMA, transportProfile: IMAGE8_PROFILE, materializationId: 'fixture-image8-repair', baseCommit,
    identityRef: ref(IDENTITY, identityRaw), staticEvidenceRef: image8Ref(reviewCommit, IMAGE8_STATIC, reviewRaw), outputScope: sourcePaths,
    files: sourcePaths.map(sourcePath => ({ path: sourcePath, sourceBeforeRef: image8Ref(baseCommit, sourcePath, sources.get(sourcePath)),
      after: hashPair(after.get(sourcePath)), expectedQuestionCount: banks.get(sourcePath).length,
      changes: IMAGE8_SCOPE.filter(s => s.sourcePath === sourcePath).map(s => ({ key: s.key, questionUid: s.questionUid, sourceOrdinal: s.sourceOrdinal,
        wholeQuestionBeforeSha256: rawHash(stable(banks.get(sourcePath)[s.sourceOrdinal - 1])),
        imageBefore: s.oldAssetPath.slice('archive/'.length), imageAfter: s.newAssetPath.slice('archive/'.length),
        oldAssetRef: image8Ref(baseCommit, s.oldAssetPath, fs.readFileSync(path.join(root, s.oldAssetPath))),
        newAssetRef: structuredClone(approvedReview.rows.find(r => r.key === s.key).newAssetRef) })) })) };
  changeManifest?.(manifest, { baseCommit, assetCommit, reviewCommit, sources, after });
  let manifestRaw = json(manifest); manifestRaw = changeManifestText?.(manifestRaw) ?? manifestRaw;
  const input = { [MANIFEST]: manifestRaw, ...(extraInput || {}) };
  const envelope = { schemaVersion: CANDIDATE_SCHEMA, materializationId: manifest.materializationId, baseCommit,
    manifestRef: ref(MANIFEST, manifestRaw), inputFiles: Object.entries(input).map(([p, b]) => ref(p, b)) };
  changeEnvelope?.(envelope);
  for (const [p, b] of Object.entries(input)) put(p, b); put(CANDIDATE_ENVELOPE, json(envelope));
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'metadata-only image repair input');
  const inputCommit = git(root, 'rev-parse', 'HEAD'); git(root, 'reset', '--hard', baseCommit);
  const options = { repoRoot: root, inputCommit, eventRef: 'archive-meta-source-input/' + envelope.materializationId };
  return { root, container, options, baseCommit, inputCommit, manifest, envelope, sources, after, banks, sourcePaths };
}

test('image8 closed candidate: exact URI8, source2 only, approved assets read-only and no approvals', async t => {
  const f = image8Fixture(t), inspected = inspectSourceMetadataCandidate(f.options);
  assert.equal(inspected.closure.transportProfile, IMAGE8_PROFILE); assert.equal(inspected.closure.selectedUidCount, 8);
  assert.equal(inspected.closure.newApprovals, 0); assert.equal(inspected.closure.actualUi, 'PENDING');
  assert.deepEqual(inspected.closure.sourceFiles.map(r => r.nonselectedWholeQuestionsPreserved), [17, 22]);
  const result = await buildSourceMetadataCandidate({ ...f.options, outputRoot: path.join(f.container, 'output') });
  assert.equal(result.sourceFileCount, 2); assert.equal(result.approvalEffect, 'NONE'); assert.equal(result.registrationStatus, 'NOT_REGISTERED');
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit); assert.equal(git(f.root, 'diff', '--name-only', 'HEAD'), '');
  const changes = git(f.root, 'diff-tree', '--no-commit-id', '--name-only', '-r', f.inputCommit, result.candidateCommit).split('\n').sort();
  assert.deepEqual(changes, [CANDIDATE_ENVELOPE, result.receiptPath, ...f.sourcePaths].sort());
  for (const sourcePath of f.sourcePaths) {
    assert.equal(git(f.root, 'show', result.candidateCommit + ':' + sourcePath), f.after.get(sourcePath).trim());
    const produced = image8Run(fs.readFileSync(path.join(f.container, 'output', sourcePath))), wanted = structuredClone(f.banks.get(sourcePath));
    for (const s of IMAGE8_SCOPE.filter(s => s.sourcePath === sourcePath)) wanted[s.sourceOrdinal - 1].image = s.newAssetPath.slice('archive/'.length);
    assert.equal(rawHash(stable(produced)), rawHash(stable(wanted))); assert.equal(produced[10].courseKey, 'M2-2');
  }
  const receipt = JSON.parse(git(f.root, 'show', result.candidateCommit + ':' + result.receiptPath));
  assert.equal(receipt.inputClosure.staticEvidenceRef.sha256, f.manifest.staticEvidenceRef.sha256);
  for (const s of IMAGE8_SCOPE) assert.equal(git(f.root, 'rev-parse', result.candidateCommit + ':' + s.oldAssetPath), git(f.root, 'rev-parse', f.baseCommit + ':' + s.oldAssetPath));
  assert.equal(git(f.root, 'rev-parse', result.candidateCommit + ':archive/assets/images/fixture-original.png'), git(f.root, 'rev-parse', f.baseCommit + ':archive/assets/images/fixture-original.png'));
});
test('image8 closed candidate: newer unselected Q2 context remains outside the eight-row scope', t => {
  const f = image8Fixture(t, { changeBank: (bank, i) => { if (i === 0) bank[1].question = 'Synthetic newer unselected context'; } });
  const inspected = inspectSourceMetadataCandidate(f.options);
  assert.equal(inspected.closure.selectedUidCount, 8);
  assert.deepEqual(inspected.closure.sourceFiles.map(r => r.nonselectedWholeQuestionsPreserved), [17, 22]);
});

const image8Negative = [
  ['fully resealed current given differs from independent before', { changeBank: (b, i) => { if (i === 0) b[3].question = 'Synthetic changed given'; } }, /STATIC_CURRENT_WHOLE_QUESTION/],
  ['fully resealed current old asset differs from independent before', { changeOldAsset: (b, s) => s.key === IMAGE8_SCOPE[0].key ? Buffer.concat([b, Buffer.from('\n<!-- synthetic changed asset context -->\n')]) : b }, /STATIC_CURRENT_OLD_ASSET/],
  ['A2 omits A1 lineage', { changeReview: r => { delete r.priorStaticRef; } }, /STATIC_SHAPE/],
  ['A2 changes A1 lineage commit', { changeReview: r => { r.priorStaticRef.commit = '1'.repeat(40); } }, /STATIC_PRIOR_REF/],
  ['A2 changes A1 lineage digest', { changeReview: r => { r.priorStaticRef.sha256 = '0'.repeat(64); } }, /STATIC_PRIOR_REF/],
  ['A2 reassigns independent reviewer', { changeReview: r => { r.reviewer = 'DIFFERENT_REVIEWER'; } }, /STATIC_PRIOR_LINEAGE/],
  ['A2 changes original source commit', { changeReview: r => { r.rows[0].beforeSourceRef.commit = '1'.repeat(40); } }, /STATIC_GIVEN_FIXED/],
  ['A2 changes original source hash', { changeReview: r => { r.rows[0].beforeSourceRef.sha256 = '0'.repeat(64); } }, /STATIC_GIVEN_FIXED/],
  ['A2 changes original whole question digest', { changeReview: r => { r.rows[0].wholeQuestionBeforeSha256 = '0'.repeat(64); } }, /STATIC_GIVEN_DIGEST/],
  ['A2 changes old asset commit', { changeReview: r => { r.rows[0].oldAssetRef.commit = '1'.repeat(40); } }, /STATIC_OLD_ASSET_FIXED/],
  ['A2 changes old asset hash', { changeReview: r => { r.rows[0].oldAssetRef.sha256 = '0'.repeat(64); } }, /STATIC_OLD_ASSET_FIXED/],
  ['no profile fallback', { changeManifest: m => { delete m.transportProfile; } }, /SOURCE_METADATA_CANDIDATE:/],
  ['unknown profile', { changeManifest: m => { m.transportProfile = 'M2_PROBLEM_IMAGE_REPAIR9_V1'; } }, /SOURCE_METADATA_CANDIDATE:/],
  ['unknown manifest field', { changeManifest: m => { m.extra = true; } }, /MANIFEST_SHAPE/],
  ['raw source payload', { changeManifest: m => { m.sourceBody = 'forbidden'; } }, /RAW_OR_UNSAFE_METADATA_FIELD/],
  ['raw SVG payload', { changeManifest: m => { m.files[0].changes[0].svg = '<svg/>'; } }, /RAW_OR_UNSAFE_METADATA_FIELD/],
  ['unreferenced metadata input', { extraInput: { [EXTRA]: '{}\n' } }, /INPUT_GRAPH_SCOPE/],
  ['preservation mixed into image profile', { changeEnvelope: e => { e.preservationRequestRefs = []; } }, /INPUT_GRAPH_SCOPE/],
  ['additional source', { changeManifest: m => { m.outputScope.push(SOURCE); } }, /FILE_SCOPE/],
  ['missing selected item', { changeManifest: m => { m.files[0].changes.pop(); } }, /CHANGE_SCOPE/],
  ['duplicate selected item', { changeManifest: m => { m.files[0].changes[1] = structuredClone(m.files[0].changes[0]); } }, /CHANGE_FIXED_SCOPE/],
  ['excluded Q2', { changeManifest: m => { m.files[0].changes[0].key = 'E017-Q02'; m.files[0].changes[0].sourceOrdinal = 2; } }, /CHANGE_FIXED_SCOPE/],
  ['wrong UID', { changeManifest: m => { m.files[0].changes[0].questionUid = UID; } }, /CHANGE_FIXED_SCOPE/],
  ['wrong ordinal', { changeManifest: m => { m.files[0].changes[0].sourceOrdinal++; } }, /CHANGE_FIXED_SCOPE/],
  ['whole question changed', { changeManifest: m => { m.files[0].changes[0].wholeQuestionBeforeSha256 = '0'.repeat(64); } }, /WHOLE_QUESTION_BEFORE/],
  ['source before wrong commit', { changeManifest: (m, f) => { m.files[0].sourceBeforeRef.commit = f.assetCommit; } }, /IMMUTABLE_REF_BINDING/],
  ['source before wrong hash', { changeManifest: m => { m.files[0].sourceBeforeRef.sha256 = '0'.repeat(64); } }, /IMMUTABLE_REF_DRIFT/],
  ['source wrong denominator', { changeManifest: m => { m.files[0].expectedQuestionCount = 25; } }, /SOURCE_DENOMINATOR/],
  ['wrong after source hash', { changeManifest: m => { m.files[0].after.sha256 = '0'.repeat(64); } }, /SOURCE_AFTER_DRIFT/],
  ['image before differs', { changeManifest: m => { m.files[0].changes[0].imageBefore += '?changed'; } }, /IMAGE_URI_SCOPE/],
  ['remote image after', { changeManifest: m => { m.files[0].changes[0].imageAfter = 'https://example.invalid/image.svg'; } }, /IMAGE_URI_SCOPE/],
  ['new URI outside approved version', { changeManifest: m => { m.files[0].changes[0].imageAfter = m.files[0].changes[0].imageAfter.replace('v4', 'v5'); } }, /IMAGE_URI_SCOPE/],
  ['old asset wrong current commit', { changeManifest: (m, f) => { m.files[0].changes[0].oldAssetRef.commit = f.assetCommit; } }, /IMMUTABLE_REF_BINDING/],
  ['old asset hash drift', { changeManifest: m => { m.files[0].changes[0].oldAssetRef.sha256 = '0'.repeat(64); } }, /IMMUTABLE_REF_DRIFT/],
  ['new asset disagrees with static review', { changeManifest: m => { m.files[0].changes[0].newAssetRef.sha256 = '0'.repeat(64); } }, /ASSET_STATIC_JOIN/],
  ['resealed static cannot approve different SVG', { changeReview: r => { r.rows[0].newAssetRef.sha256 = '0'.repeat(64); } }, /APPROVED_ASSET_BYTES/],
  ['reviewer equals producer', { changeReview: r => { r.reviewer = r.producer; } }, /REVIEWER_SEPARATION/],
  ['case-only reviewer alias', { changeReview: r => { r.reviewer = r.producer.toLowerCase(); } }, /REVIEWER_SEPARATION/],
  ['unrecognized review schema', { changeReview: r => { r.schemaVersion += '-other'; } }, /STATIC_PROFILE/],
  ['review scope duplicate', { changeReview: r => { r.rows[1] = structuredClone(r.rows[0]); } }, /STATIC_ROW_SCOPE/],
  ['review pending row', { changeReview: r => { r.rows[0].staticDecision = 'PENDING'; } }, /STATIC_ROW_SCOPE/],
  ['review missing row', { changeReview: r => { r.rows.pop(); } }, /STATIC_SCOPE/],
  ['review basis drift', { changeReview: r => { r.basisReviewSha256 = '0'.repeat(64); } }, /STATIC_BASIS/],
  ['repair plan drift', { changeReview: r => { r.repairPlanSha256 = '0'.repeat(64); } }, /STATIC_BASIS/],
  ['UI approval claim', { changeReview: r => { r.actualUi = 'PASS'; } }, /STATIC_EFFECT/],
  ['new metadata approval claim', { changeReview: r => { r.newMetadataApprovals = 1; } }, /STATIC_EFFECT/],
  ['wrong static ref hash', { changeManifest: m => { m.staticEvidenceRef.sha256 = '0'.repeat(64); } }, /IMMUTABLE_REF_DRIFT/],
  ['static reference wrong path', { changeManifest: m => { m.staticEvidenceRef.path = 'docs/operations/other.json'; } }, /IMMUTABLE_REF_BINDING/],
  ['identity digest drift', { changeManifest: m => { m.identityRef.sha256 = '0'.repeat(64); } }, /IDENTITY_DRIFT/],
  ['identity duplicate UID', { changeIdentity: x => { x.records.push(structuredClone(x.records[3])); } }, /IDENTITY_DENOMINATOR/],
  ['identity lookup wrong UID', { changeIdentity: x => { const k = Object.keys(x.lookup.bySourceFileAndOrdinal)[0]; x.lookup.bySourceFileAndOrdinal[k]['4'] = UID; } }, /IDENTITY_LOOKUP_JOIN/],
  ['embedded UID mismatch', { changeBank: (b, i) => { if (i === 0) b[3].questionUid = UID; } }, /EXPLICIT_SOURCE_UID/],
  ['metadata change mixed into URI item', { changeManifest: m => { m.files[0].changes[0].metadataFields = []; } }, /CHANGE_SHAPE/],
  ['duplicate JSON manifest key', { changeManifestText: s => s.replace('"transportProfile":', '"transportProfile":"ignored", "transportProfile":') }, /DUPLICATE_JSON_KEY/],
  ['trailing execution overrides selected image', { suffix: i => i === 0 ? '\nwindow.questionBank[3].image = "'+IMAGE8_SCOPE[0].oldAssetPath.slice('archive/'.length)+'";\n' : '' }, /EXECUTED_WHOLE_BANK_DRIFT/],
  ['trailing execution changes an unselected value after URI switch', { suffix: i => i === 0 ? '\nif (window.questionBank[3].image.endsWith("v4.svg")) window.questionBank[0].answer="changed";\n' : '' }, /EXECUTED_WHOLE_BANK_DRIFT/],
  ['forged output changes answer', { changeExpectedAfter: (s, i) => i === 0 ? s.replace(/"answer":\s*(?:"(?:\\.|[^"\\])*"|[^,\n]+)/, '"answer": "synthetic changed output"') : s }, /SOURCE_AFTER_DRIFT/],
  ['string code generation from window constructor', { suffix: i => i === 0 ? '\nwindow.constructor.constructor("return 7")();\n' : '' }, /SOURCE_EXECUTION/],
  ['string code generation from console method', { suffix: i => i === 0 ? '\nconsole.log.constructor("return 7")();\n' : '' }, /SOURCE_EXECUTION/],
];
for (const [name, options, error] of image8Negative) test('image8 closed candidate rejects ' + name, t => {
  const f = image8Fixture(t, options); assert.throws(() => inspectSourceMetadataCandidate(f.options), error);
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit); assert.equal(git(f.root, 'diff', '--name-only', 'HEAD'), '');
});
