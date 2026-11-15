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
const ref = (name, bytes) => ({ path: name, blobSha1: blobHash(bytes), sha256: rawHash(bytes) });
const hashPair = bytes => ({ blobSha1: blobHash(bytes), sha256: rawHash(bytes) });
const SOURCE = 'archive/exams/original/middle/m2/2mid/fixture.js';
const IDENTITY = 'archive/data/question_identity_map.json';
const REQUEST = '.archive-meta-register/inbox/fixture-request.json';
const MANIFEST = '.archive-meta-register/evidence/fixture-materialization.json';
const EXTRA = '.archive-meta-register/evidence/fixture-extra.json';
const UID = 'qid_v1_' + '1'.repeat(64);
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], {
  encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1' },
}).trim();

function fixture(t, { inputExtra = {}, baseExtra = {}, mutateManifest, mutateEnvelope, executable } = {}) {
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
  const before = 'window.questionBank = ' + JSON.stringify(bank, null, 2) + ';\n';
  const after = 'window.questionBank = ' + JSON.stringify([{ ...bank[0], courseKey: 'M2-2' }], null, 2) + ';\n';
  const tuple = { sourceArchiveFile: SOURCE.slice('archive/exams/'.length), sourceOrdinal: 1, sourceQuestionNo: 1 };
  const identity = json({ schemaVersion: 'question-identity-map-v1', records: [{ questionUid: UID, ...tuple }],
    lookup: { byQuestionUid: { [UID]: tuple }, bySourceFileAndOrdinal: { [tuple.sourceArchiveFile]: { '1': UID } },
      bySourceFileAndQuestionNo: { [tuple.sourceArchiveFile]: { '1': [UID] } } } });
  put(SOURCE, before); put(IDENTITY, identity); put('README.md', 'trusted main\n');
  for (const [name, bytes] of Object.entries(baseExtra)) put(name, bytes);
  git(root, 'add', '--', '.'); git(root, 'commit', '-qm', 'public base');
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  const request = json({ schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId: 'fixture-request',
    approval: { type: 'FINAL_QA', metadataReviewed: true }, scope: 'PARTIAL_UIDS', sourceArchiveFile: tuple.sourceArchiveFile,
    expectedQuestionCount: 1, expectedSourceBlobSha1: blobHash(after),
    items: [{ questionUid: UID, sourceOrdinal: 1, after: { courseKey: 'M2-2' } }] });
  const manifest = { schemaVersion: 'archive-reviewed-source-metadata-materialization-v1', materializationId: 'fixture-candidate',
    baseCommit, identityRef: ref(IDENTITY, identity), requestRefs: [ref(REQUEST, request)], outputScope: [SOURCE],
    files: [{ path: SOURCE, before: hashPair(before), after: hashPair(after), expectedQuestionCount: 1,
      changes: [{ questionUid: UID, sourceOrdinal: 1, requestIndex: 0,
        metadataFields: [{ field: 'courseKey', beforePresent: true, afterPresent: true, before: 'M2-1', after: 'M2-2' }] }] }] };
  mutateManifest?.(manifest);
  const files = { [REQUEST]: request, [MANIFEST]: json(manifest), ...inputExtra };
  const inputFiles = Object.entries(files).map(([name, bytes]) => ref(name, bytes));
  const envelope = { schemaVersion: CANDIDATE_SCHEMA, materializationId: 'fixture-candidate', baseCommit,
    manifestRef: ref(MANIFEST, files[MANIFEST]), inputFiles };
  mutateEnvelope?.(envelope);
  for (const [name, bytes] of Object.entries(files)) put(name, bytes);
  if (executable) fs.chmodSync(path.join(root, executable), 0o755);
  put(CANDIDATE_ENVELOPE, json(envelope));
  git(root, 'add', '--', '.'); git(root, 'commit', '-qm', 'metadata input');
  const inputCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', '--detach', baseCommit);
  const opts = { repoRoot: root, inputCommit, eventRef: 'archive-meta-source-input/fixture-candidate',
    outputRoot: path.join(container, 'output') };
  return { ...opts, opts, root, container, put, before, after, baseCommit, inputCommit, manifest, envelope };
}

test('metadata-only envelope is bound to exact base, input parent and immutable file hashes', t => {
  const f = fixture(t), result = inspectSourceMetadataCandidate(f.opts);
  assert.equal(result.baseCommit, f.baseCommit); assert.equal(result.inputCommit, f.inputCommit);
  assert.equal(result.files.size, 2); assert.equal(result.candidateBranch, 'release/metadata-source-fixture-candidate');
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
    [SOURCE, REQUEST, MANIFEST, result.receiptPath].sort());
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
