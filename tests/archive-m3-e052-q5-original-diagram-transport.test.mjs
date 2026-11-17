import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE as PROFILE,
  M3_E052_Q5_ORIGINAL_DIAGRAM_SCHEMA as SCHEMA, M3_E052_Q5_ORIGINAL_DIAGRAM_SCOPE as SCOPE,
  materializeM3E052Q5OriginalDiagram as materialize } from '../archive/tools/meta-foundation/materialize-reviewed-m3-e052-q5-original-diagram.mjs';
import { CANDIDATE_ENVELOPE, CANDIDATE_SCHEMA, inspectSourceMetadataCandidate,
  buildSourceMetadataCandidate } from '../tools/ci/archive-reviewed-source-candidate.mjs';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CURRENT = '626423cd4806aef2e0aac8c0d989cbfd38b3d6f6';
const STATIC_COMMIT = 'faf874ee45044db2c69368f72ddfe0c230b78a1c';
const STATIC_PATH = 'docs/operations/m3-e052-q5-original-diagram-20261116/independent-static-v1.json';
const IDENTITY = 'archive/data/question_identity_map.json';
const MANIFEST = '.archive-meta-register/evidence/m3-e052-q5-original-diagram-fixture.json';
const ID = 'm3-e052-q5-original-diagram-fixture';
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const blob = bytes => createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');
const json = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const pair = bytes => ({ blobSha1: blob(bytes), sha256: sha(bytes) });
const ref = (name, bytes) => ({ path: name, ...pair(bytes) });
const exactRef = (commit, name, bytes) => ({ commit, path: name, gitBlobSha1: blob(bytes), sha256: sha(bytes), bytes: bytes.length });
const gitRaw = (root, args) => execFileSync('git', ['-C', root, ...args], {
  env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' },
  stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024 });
const git = (root, ...args) => gitRaw(root, args).toString().trim();
const readPublic = (commit, name) => gitRaw(repository, ['show', `${commit}:${name}`]);
const source = readPublic(CURRENT, SCOPE.sourcePath);
const oldAsset = readPublic(CURRENT, SCOPE.oldAssetPath);
const newAsset = readPublic(STATIC_COMMIT, SCOPE.newAssetPath);
const staticRaw = readPublic(STATIC_COMMIT, STATIC_PATH);
const staticDoc = JSON.parse(staticRaw);
function bank(raw) {
  const context = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext('globalThis.window={};globalThis.console={log(){},warn(){},error(){}};', context, { timeout: 1000 });
  vm.runInContext(raw.toString(), context, { timeout: 1000 });
  return JSON.parse(vm.runInContext('JSON.stringify(window.questionBank)', context, { timeout: 1000 }));
}

// Student values are read only from already public, immutable Git at runtime.
// No exam question or answer text is embedded in this test file or diagnostics.
function fixture(t, options = {}) {
  const container = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-q5-diagram-test-'));
  t.after(() => fs.rmSync(container, { recursive: true, force: true }));
  const root = path.join(container, 'repo'); fs.mkdirSync(root);
  git(root, 'init', '-q', '-b', 'main'); git(root, 'config', 'user.name', 'Q5 synthetic transport');
  git(root, 'config', 'user.email', 'fixture@local.invalid'); git(root, 'config', 'commit.gpgsign', 'false');
  git(root, 'config', 'gc.auto', '0'); git(root, 'config', 'maintenance.auto', 'false');
  const common = path.resolve(repository, git(repository, 'rev-parse', '--git-common-dir'));
  fs.writeFileSync(path.join(root, '.git/objects/info/alternates'), path.join(common, 'objects') + '\n');
  const put = (name, bytes) => { const f = path.join(root, name); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, bytes); };
  let before = Buffer.from(source), questions = bank(before);
  if (options.changeBank) {
    options.changeBank(questions);
    before = Buffer.from('window.questionBank = ' + JSON.stringify(questions, null, 2) + ';\n');
  }
  if (options.sourceSuffix) before = Buffer.concat([before, Buffer.from('\n' + options.sourceSuffix + '\n')]);
  if (options.rawTransform) before = Buffer.from(options.rawTransform(before.toString()));
  const old = options.oldAsset ?? oldAsset;
  put(SCOPE.sourcePath, before); put(SCOPE.oldAssetPath, old);
  if (options.existingNewAsset) put(SCOPE.newAssetPath, options.existingNewAsset);
  const sourceArchiveFile = SCOPE.sourcePath.slice('archive/exams/'.length);
  const records = questions.map((q, index) => ({ questionUid: index + 1 === SCOPE.sourceOrdinal ? SCOPE.questionUid : 'qid_v1_' + sha('fixture:' + (index + 1)),
    sourceArchiveFile, sourceOrdinal: index + 1, sourceQuestionNo: String(q.sourceQuestionNo ?? q.sourceQid ?? q.id ?? index + 1) }));
  const identity = { schemaVersion: 'question-identity-map-v1', records, lookup: {
    byQuestionUid: Object.fromEntries(records.map(({ questionUid, ...r }) => [questionUid, r])),
    bySourceFileAndOrdinal: { [sourceArchiveFile]: Object.fromEntries(records.map(r => [r.sourceOrdinal, r.questionUid])) },
    bySourceFileAndQuestionNo: { [sourceArchiveFile]: Object.fromEntries(records.map(r => [r.sourceQuestionNo, [r.questionUid]])) } } };
  options.changeIdentity?.(identity); const identityRaw = json(identity); put(IDENTITY, identityRaw);
  let authorityRef = exactRef(STATIC_COMMIT, STATIC_PATH, staticRaw);
  if (options.changeStatic) {
    const doc = structuredClone(staticDoc); options.changeStatic(doc);
    const bytes = json(doc); put(STATIC_PATH, bytes); put(SCOPE.newAssetPath, newAsset);
    git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic substituted static authority');
    authorityRef = exactRef(git(root, 'rev-parse', 'HEAD'), STATIC_PATH, bytes);
    git(root, 'rm', '--', STATIC_PATH, SCOPE.newAssetPath);
  }
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic trusted current source');
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  const oldUri = SCOPE.oldAssetPath.slice('archive/'.length), newUri = SCOPE.newAssetPath.slice('archive/'.length);
  const after = Buffer.from(before.toString().replace(JSON.stringify(oldUri), JSON.stringify(newUri)));
  const manifest = { schemaVersion: SCHEMA, transportProfile: PROFILE, materializationId: ID, baseCommit,
    identityRef: ref(IDENTITY, identityRaw), staticEvidenceRef: authorityRef, outputScope: [SCOPE.sourcePath],
    files: [{ path: SCOPE.sourcePath, sourceBeforeRef: exactRef(baseCommit, SCOPE.sourcePath, before), after: pair(after),
      expectedQuestionCount: questions.length, changes: [{ key: SCOPE.key, questionUid: SCOPE.questionUid,
        sourceOrdinal: SCOPE.sourceOrdinal, wholeQuestionBeforeSha256: sha(stable(questions[SCOPE.sourceOrdinal - 1])),
        imageBefore: oldUri, imageAfter: newUri, oldAssetRef: exactRef(baseCommit, SCOPE.oldAssetPath, old),
        newAssetRef: exactRef(STATIC_COMMIT, SCOPE.newAssetPath, newAsset) }] }] };
  options.changeManifest?.(manifest, { baseCommit, root });
  let manifestRaw = json(manifest); if (options.manifestText) manifestRaw = Buffer.from(options.manifestText(manifestRaw.toString()));
  const inputs = { [MANIFEST]: manifestRaw, ...(options.extraInput || {}) };
  const envelope = { schemaVersion: CANDIDATE_SCHEMA, materializationId: ID, baseCommit,
    manifestRef: ref(MANIFEST, manifestRaw), inputFiles: Object.entries(inputs).map(([p, b]) => ref(p, b)) };
  options.changeEnvelope?.(envelope);
  for (const [p, b] of Object.entries(inputs)) put(p, b); put(CANDIDATE_ENVELOPE, json(envelope));
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'metadata-only fixture input');
  const inputCommit = git(root, 'rev-parse', 'HEAD'); git(root, 'reset', '--hard', baseCommit);
  const args = { repoRoot: root, baseCommit, inputCommit, manifest, outputRoot: path.join(container, 'output') };
  const candidateArgs = { repoRoot: root, inputCommit, eventRef: 'archive-meta-source-input/' + ID, outputRoot: args.outputRoot };
  return { root, container, before, after, args, candidateArgs, manifest, baseCommit, inputCommit };
}

test('Q5 exact public static authority, original PNG and current whole question are bound before construction', t => {
  const f = fixture(t), result = inspectSourceMetadataCandidate(f.candidateArgs).closure;
  assert.equal(result.selectedUidCount, 1); assert.equal(result.newApprovals, 0); assert.equal(result.approvalEffect, 'NONE');
  assert.equal(result.actualUi, 'PENDING'); assert.deepEqual(result.sourceFieldsChanged, ['image']);
  assert.equal(result.sourceFiles[0].nonselectedWholeQuestionsPreserved, 24);
  assert.equal(result.selection[0].beforeWholeQuestionSha256, SCOPE.wholeQuestionBeforeSha256);
  assert.equal(git(f.root, 'status', '--porcelain'), '');
});

test('Q5 candidate changes source1 only and preserves HEAD, old PNG, original source bytes outside the URI', async t => {
  const f = fixture(t), state = [git(f.root, 'rev-parse', 'HEAD'), git(f.root, 'write-tree'), git(f.root, 'for-each-ref')];
  const result = await buildSourceMetadataCandidate(f.candidateArgs);
  const actual = gitRaw(f.root, ['show', result.candidateCommit + ':' + SCOPE.sourcePath]);
  assert(actual.equals(f.after));
  const inverse = actual.toString().replace(JSON.stringify(SCOPE.newAssetPath.slice('archive/'.length)), JSON.stringify(SCOPE.oldAssetPath.slice('archive/'.length)));
  assert.equal(inverse, f.before.toString());
  assert(gitRaw(f.root, ['show', result.candidateCommit + ':' + SCOPE.oldAssetPath]).equals(oldAsset));
  assert.deepEqual([git(f.root, 'rev-parse', 'HEAD'), git(f.root, 'write-tree'), git(f.root, 'for-each-ref')], state);
  const receipt = JSON.parse(gitRaw(f.root, ['show', result.candidateCommit + ':' + result.receiptPath]));
  assert.equal(receipt.inputClosure.selectedUidCount, 1); assert.equal(receipt.inputClosure.newApprovals, 0);
  assert.equal(git(f.root, 'rev-parse', result.candidateCommit + '^'), f.inputCommit);
});

test('newer unselected fields and suffix metadata remain exact current context', t => {
  const f = fixture(t, { sourceSuffix: 'window.questionBank[0].fixtureCurrentMetadata = "preserve-current";' });
  const result = materialize({ ...f.args, write: true });
  const after = fs.readFileSync(path.join(f.args.outputRoot, SCOPE.sourcePath));
  assert.equal(result.nonselectedWholeQuestionChanges, 0);
  assert.equal(bank(after)[0].fixtureCurrentMetadata, 'preserve-current');
  assert.equal(result.sourcePrefixSuffixChanged, 0);
});

test('an already present exact approved new asset remains unchanged', t => {
  const f = fixture(t, { existingNewAsset: newAsset });
  assert.equal(materialize(f.args).selectedUidCount, 1);
});

const negative = [
  ['unknown profile', { changeManifest: m => { m.transportProfile = 'GENERIC_IMAGE_EDIT'; } }, /SOURCE_METADATA_CANDIDATE:UNKNOWN_OR_MISSING_FIELD/],
  ['unknown manifest key', { changeManifest: m => { m.permitSourceText = true; } }, /MANIFEST_SHAPE/],
  ['source count', { changeManifest: m => { m.files.push(structuredClone(m.files[0])); } }, /FILE_SCOPE/],
  ['another bank', { changeManifest: m => { m.outputScope[0] += '.new.js'; } }, /FILE_SCOPE/],
  ['question count', { changeManifest: m => { m.files[0].expectedQuestionCount = 24; } }, /SOURCE_DENOMINATOR/],
  ['another UID', { changeManifest: m => { m.files[0].changes[0].questionUid = 'qid_v1_' + '1'.repeat(64); } }, /CHANGE_FIXED_SCOPE/],
  ['another ordinal', { changeManifest: m => { m.files[0].changes[0].sourceOrdinal = 6; } }, /CHANGE_FIXED_SCOPE/],
  ['second selected row', { changeManifest: m => { m.files[0].changes.push(structuredClone(m.files[0].changes[0])); } }, /CHANGE_SCOPE/],
  ['imageAlt insertion', { changeManifest: m => { m.files[0].changes[0].imageAlt = 'synthetic'; } }, /CHANGE_SHAPE/],
  ['different new URI', { changeManifest: m => { m.files[0].changes[0].imageAfter += '.new.png'; } }, /IMAGE_URI_SCOPE/],
  ['source before digest drift', { changeManifest: m => { m.files[0].sourceBeforeRef.sha256 = '0'.repeat(64); } }, /IMMUTABLE_REF_DRIFT/],
  ['after source digest drift', { changeManifest: m => { m.files[0].after.sha256 = '0'.repeat(64); } }, /SOURCE_AFTER_DRIFT/],
  ['identity digest drift', { changeManifest: m => { m.identityRef.sha256 = '0'.repeat(64); } }, /IDENTITY_DRIFT/],
  ['identity duplicate row', { changeIdentity: d => { d.records.push(structuredClone(d.records[4])); } }, /IDENTITY_DENOMINATOR/],
  ['identity ordinal lookup drift', { changeIdentity: d => { Object.values(d.lookup.bySourceFileAndOrdinal)[0]['5'] = d.records[0].questionUid; } }, /IDENTITY_LOOKUP_JOIN/],
  ['selected given drift with resealed B', { changeBank: b => { b[4].content += ' synthetic drift'; } }, /STATIC_CURRENT_WHOLE_QUESTION/],
  ['selected nonproblem field drift with resealed B', { changeBank: b => { b[4].fixtureMetadata = true; } }, /STATIC_CURRENT_WHOLE_QUESTION/],
  ['old PNG drift with resealed B', { oldAsset: Buffer.concat([oldAsset, Buffer.from('changed')]) }, /STATIC_CURRENT_OLD_ASSET/],
  ['static reviewer substitution', { changeStatic: d => { d.reviewer = d.producer; } }, /EXACT_STATIC_AUTHORITY/],
  ['static historical question substitution', { changeStatic: d => { d.row.wholeQuestionBeforeSha256 = '0'.repeat(64); } }, /EXACT_STATIC_AUTHORITY/],
  ['static approval escalation', { changeStatic: d => { d.newNativeApprovals = 1; } }, /EXACT_STATIC_AUTHORITY/],
  ['asset commit independent of static commit', { changeManifest: (m, f) => { m.files[0].changes[0].newAssetRef.commit = f.baseCommit; } }, /ASSET_STATIC_JOIN/],
  ['new asset hash substitution', { changeManifest: m => { m.files[0].changes[0].newAssetRef.sha256 = '0'.repeat(64); } }, /ASSET_STATIC_JOIN/],
  ['existing conflicting new path', { existingNewAsset: Buffer.from('conflicting current asset') }, /NEW_ASSET_PATH_CONFLICT/],
  ['source suffix overriding requested image', { sourceSuffix: `window.questionBank[4].image = ${JSON.stringify(SCOPE.oldAssetPath.slice('archive/'.length))};` }, /EXECUTED_WHOLE_BANK_DRIFT/],
  ['source suffix changing unselected question after image switch', { sourceSuffix: `if (window.questionBank[4].image !== ${JSON.stringify(SCOPE.oldAssetPath.slice('archive/'.length))}) window.questionBank[0].fixtureDrift = true;` }, /EXECUTED_WHOLE_BANK_DRIFT/],
  ['window host constructor', { sourceSuffix: 'window.constructor.constructor("return process")();' }, /SOURCE_EXECUTION/],
  ['console host constructor', { sourceSuffix: 'console.log.constructor("return process")();' }, /SOURCE_EXECUTION/],
  ['source runtime eval', { sourceSuffix: 'eval("window.questionBank[4].fixtureDrift = true");' }, /SOURCE_EXECUTION/],
  ['source accessor', { sourceSuffix: 'Object.defineProperty(window.questionBank[0],"fixtureAccessor",{enumerable:true,get(){return 1}});' }, /SOURCE_EXECUTION/],
  ['duplicate literal property', { rawTransform: s => s.replace('"image":', '"image": null, "image":') }, /SOURCE_DUPLICATE_OR_UNSAFE_KEY/],
  ['unknown extra input evidence', { extraInput: { '.archive-meta-register/evidence/q5-extra.json': json({ schemaVersion: 'synthetic' }) } }, /INPUT_GRAPH_SCOPE/],
  ['preservation request attached to URI profile', { changeEnvelope: e => { e.preservationRequestRefs = []; } }, /INPUT_GRAPH_SCOPE/],
  ['raw source uploaded as input', { extraInput: { [SCOPE.sourcePath]: source } }, /INPUT_FILE_PATH|INPUT_PATH|SOURCE|RAW/],
  ['duplicate JSON field', { manifestText: s => s.replace('"transportProfile":', '"transportProfile":"overwritten", "transportProfile":') }, /DUPLICATE_JSON_KEY/],
];
for (const [name, options, error] of negative) test('Q5 closed transport rejects ' + name, t => {
  const f = fixture(t, options); assert.throws(() => inspectSourceMetadataCandidate(f.candidateArgs), error);
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit);
  assert.equal(git(f.root, 'status', '--porcelain'), ''); assert.equal(fs.existsSync(f.args.outputRoot), false);
});

test('output must be a fresh directory outside the checkout with no symlink parent', t => {
  const f = fixture(t); const target = path.join(f.container, 'existing'); fs.mkdirSync(target);
  assert.throws(() => materialize({ ...f.args, write: true, outputRoot: target }), /ISOLATED_NEW_OUTPUT/);
  assert.throws(() => materialize({ ...f.args, write: true, outputRoot: path.join(f.root, 'output') }), /ISOLATED_NEW_OUTPUT/);
  const link = path.join(f.container, 'link'); fs.symlinkSync(target, link);
  assert.throws(() => materialize({ ...f.args, write: true, outputRoot: path.join(link, 'child') }), /ISOLATED_NEW_OUTPUT/);
});

test('the shared runner retains the existing default metadata fields and profiles', () => {
  const text = fs.readFileSync(path.join(repository, 'tools/ci/archive-reviewed-source-candidate.mjs'), 'utf8');
  for (const name of ['validateM2s1Svg7ImagePointerCandidate', 'validateM2ProblemImageRepair8Candidate', 'validateClosedInputGraph',
    'materializeM2s1Svg7ImagePointer', 'materializeM2ProblemImageRepair8', 'materializeReviewedSourceMetadata']) assert(text.includes(name));
  const baseline = gitRaw(repository, ['show', CURRENT + ':archive/tools/meta-foundation/materialize-reviewed-source-metadata.mjs']);
  assert(baseline.equals(fs.readFileSync(path.join(repository, 'archive/tools/meta-foundation/materialize-reviewed-source-metadata.mjs'))));
});
