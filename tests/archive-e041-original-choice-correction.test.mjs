import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { E041_CHOICE_CORRECTION_PROFILE as PROFILE, E041_CHOICE_CORRECTION_SCHEMA as SCHEMA,
  E041_CORRECTION_REVIEW_SCHEMA as REVIEW_SCHEMA, E041_CORRECTION_REVIEW_PATH as REVIEW_PATH,
  E041_ORIGINAL_GIVEN_PATH as GIVEN_PATH, E041_CHOICE_SCOPE as S,
  materializeE041OriginalChoiceCorrection, validateE041OriginalChoiceCorrectionCandidate }
  from '../archive/tools/meta-foundation/materialize-reviewed-e041-original-choice-correction.mjs';

const repository = fileURLToPath(new URL('..', import.meta.url));
const MODULE = path.join(repository, 'archive/tools/meta-foundation/materialize-reviewed-e041-original-choice-correction.mjs');
const IDENTITY = 'archive/data/question_identity_map.json';
const MANIFEST = '.archive-meta-register/evidence/e041-original-choice-fixture.json';
// Existing public original-given bytes; test roles below remain synthetic.
const GIVEN_COMMIT = '7ac54acd8f26166546c6afb26e0f454bfaee2b2e';
const sha = x => createHash('sha256').update(x).digest('hex');
const blob = x => createHash('sha1').update(`blob ${Buffer.byteLength(x)}\0`).update(x).digest('hex');
const json = x => JSON.stringify(x, null, 2) + '\n';
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const ref = (commit, p, b) => ({ commit, path: p, gitBlobSha1: blob(b), sha256: sha(b), bytes: Buffer.byteLength(b) });
const pair = b => ({ blobSha1: blob(b), sha256: sha(b) });
const cleanEnv = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE'].includes(k)));
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], { env: { ...cleanEnv(), GIT_NO_LAZY_FETCH: '1', GIT_CONFIG_NOSYSTEM: '1' },
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024 }).trim();
const publicGit = args => execFileSync('git', [...(process.env.ARCHIVE_E041_TEST_GIT_DIR
  ? ['--git-dir=' + process.env.ARCHIVE_E041_TEST_GIT_DIR] : ['-C', repository]), ...args],
  { env: { ...cleanEnv(), GIT_NO_LAZY_FETCH: '1' }, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024 });
const original = publicGit(['show', S.reviewedSourceCommit + ':' + S.sourcePath]);
assert.equal(sha(original), S.beforeSha256);
const originalGiven = publicGit(['show', GIVEN_COMMIT + ':' + GIVEN_PATH]);
assert.equal(sha(originalGiven), S.originalGivenSha256);
assert.equal(originalGiven.length, S.originalGivenBytes);
function bank(raw) {
  const ctx = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext('globalThis.window={};globalThis.console={log(){},warn(){},error(){}};', ctx);
  vm.runInContext(String(raw), ctx, { timeout: 3000 });
  return JSON.parse(vm.runInContext('JSON.stringify(window.questionBank)', ctx));
}
const beforeBank = bank(original), beforeQ = beforeBank[S.sourceOrdinal - 1];
const afterQ = structuredClone(beforeQ);
afterQ.choices = S.optionPermutationFromCurrentOneBased.map(n => beforeQ.choices[n - 1]);
const originalLabelIndex = beforeQ.answer.codePointAt(0) - 0x2460 + 1;
afterQ.answer = String.fromCodePoint(0x2460 + S.optionPermutationFromCurrentOneBased.indexOf(originalLabelIndex));
afterQ.solution = beforeQ.solution.split(beforeQ.answer).join(afterQ.answer);
assert.equal(sha(stable(beforeQ)), S.beforeWholeQuestionSha256);
assert.equal(sha(stable(afterQ)), S.afterWholeQuestionSha256);
function identityFixture() {
  const sourceArchiveFile = S.sourcePath.slice('archive/exams/'.length);
  const records = beforeBank.map((q, i) => ({ questionUid: i === S.sourceOrdinal - 1 ? S.questionUid : 'qid_v1_' + sha('E041-synthetic-' + i),
    sourceArchiveFile, sourceOrdinal: i + 1, sourceQuestionNo: q.id, legacyQKey: sourceArchiveFile + '_' + q.id }));
  return { schemaVersion: 'question-identity-map-v1', records, lookup: {
    byQuestionUid: Object.fromEntries(records.map(({ questionUid, ...r }) => [questionUid, r])),
    bySourceFileAndOrdinal: { [sourceArchiveFile]: Object.fromEntries(records.map(r => [r.sourceOrdinal, r.questionUid])) },
    bySourceFileAndQuestionNo: { [sourceArchiveFile]: Object.fromEntries(records.map(r => [r.sourceQuestionNo, [r.questionUid]])) },
    byLegacyQKey: Object.fromEntries(records.map(r => [r.legacyQKey, [r.questionUid]])),
  } };
}
// These roles and decisions are synthetic test fixtures, never a real review.
function reviewFixture(givenCommit) {
  return { schemaVersion: REVIEW_SCHEMA, transportProfile: PROFILE,
    scope: 'EXACT_E041_Q10_ORIGINAL_CHOICE_ORDER_AND_LINKED_LABELS',
    producer: 'GPT_REGISTRAR_REPAIR', reviewer: 'GPT_ROOT_C8F1B0BFB4FA',
    phaseOrder: 'ORIGINAL_GIVEN_FREEZE_THEN_CURRENT_THEN_LINKED_LABELS',
    originalGivenRef: ref(givenCommit, GIVEN_PATH, originalGiven),
    originalObservationSha256: sha('synthetic original observation'), rootCorrectionReviewSha256: sha('synthetic correction review'),
    sourceBeforeRef: ref(S.reviewedSourceCommit, S.sourcePath, original),
    sourceAfter: { path: S.sourcePath, gitBlobSha1: S.afterGitBlobSha1, sha256: S.afterSha256, bytes: S.afterBytes },
    questionUid: S.questionUid, sourceOrdinal: S.sourceOrdinal, expectedQuestionCount: S.expectedQuestionCount,
    beforeWholeQuestionSha256: S.beforeWholeQuestionSha256, afterWholeQuestionSha256: S.afterWholeQuestionSha256,
    fieldTransitions: S.changedFields.map(field => ({ field,
      before: { own: true, type: Array.isArray(beforeQ[field]) ? 'array' : 'string', sha256: sha(stable(beforeQ[field])) },
      after: { own: true, type: Array.isArray(afterQ[field]) ? 'array' : 'string', sha256: sha(stable(afterQ[field])) } })),
    optionPermutationFromCurrentOneBased: [...S.optionPermutationFromCurrentOneBased],
    linkedLabelChange: { answerLabelOnly: true, solutionChoiceLabelOccurrencesOnly: 2, solutionCalculationUnchanged: true },
    decision: 'ACCEPT_EXACT_ORIGINAL_CHOICE_ORDER_AND_LINKED_LABEL_CORRECTION', newNativeApprovals: 0, newReview2Claims: 0,
    newMetadataApprovals: 0, newDifficultyJudgments: 0, newFourSlotVectors: 0,
    existingApprovalReuseAuthorized: false, actualUi: 'PENDING' };
}
function fixture(t, { changeReview, changeReviewText, changeSource, changeIdentity, changeManifest, changeGiven, givenMode } = {}) {
  const container = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-e041-choice-fixture-'));
  t.after(() => fs.rmSync(container, { recursive: true, force: true }));
  const root = path.join(container, 'repo'); fs.mkdirSync(root);
  const put = (p, b) => { const dst = path.join(root, p); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.writeFileSync(dst, b); };
  git(root, 'init', '-q', '-b', 'main'); git(root, 'config', 'user.name', 'Synthetic E041 test');
  git(root, 'config', 'user.email', 'e041-fixture@example.invalid'); git(root, 'config', 'commit.gpgsign', 'false'); git(root, 'config', 'gc.auto', '0');
  const common = publicGit(['rev-parse', '--git-common-dir']).toString().trim();
  const commonDir = path.isAbsolute(common) ? common : path.resolve(repository, common);
  fs.writeFileSync(path.join(root, '.git/objects/info/alternates'), path.join(commonDir, 'objects') + '\n');
  put('README.md', 'SYNTHETIC TEST ONLY; NO REAL APPROVAL.\n');
  const givenRaw = changeGiven ? changeGiven(originalGiven) : originalGiven;
  put(GIVEN_PATH, givenRaw); if (givenMode) fs.chmodSync(path.join(root, GIVEN_PATH), givenMode);
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic original given fixture');
  const givenCommit = git(root, 'rev-parse', 'HEAD');
  const review = reviewFixture(givenCommit); if (changeGiven) review.originalGivenRef = ref(givenCommit, GIVEN_PATH, givenRaw);
  changeReview?.(review, { givenCommit, root }); const reviewRaw = changeReviewText?.(json(review)) ?? json(review);
  put(REVIEW_PATH, reviewRaw); git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic independent contract fixture');
  const reviewCommit = git(root, 'rev-parse', 'HEAD');
  const sourceRaw = changeSource?.(original) ?? original;
  const identity = identityFixture(); changeIdentity?.(identity); const identityRaw = json(identity);
  put(S.sourcePath, sourceRaw); put(IDENTITY, identityRaw); git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic base snapshot');
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  const manifest = { schemaVersion: SCHEMA, transportProfile: PROFILE, materializationId: 'fixture-e041-choice-correction', baseCommit,
    identityRef: { path: IDENTITY, ...pair(identityRaw) }, correctionEvidenceRef: ref(reviewCommit, REVIEW_PATH, reviewRaw),
    outputScope: [S.sourcePath], files: [{ path: S.sourcePath, sourceBeforeRef: ref(baseCommit, S.sourcePath, sourceRaw),
      after: { blobSha1: S.afterGitBlobSha1, sha256: S.afterSha256 }, expectedQuestionCount: S.expectedQuestionCount,
      changes: [{ key: S.key, questionUid: S.questionUid, sourceOrdinal: S.sourceOrdinal,
        wholeQuestionBeforeSha256: S.beforeWholeQuestionSha256, wholeQuestionAfterSha256: S.afterWholeQuestionSha256,
        changedFields: [...S.changedFields], optionPermutationFromCurrentOneBased: [...S.optionPermutationFromCurrentOneBased], linkedSolutionLabelOccurrences: 2 }] }] };
  changeManifest?.(manifest, { root, baseCommit, reviewCommit, givenCommit });
  put(MANIFEST, json(manifest)); git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic metadata-only input');
  const inputCommit = git(root, 'rev-parse', 'HEAD'); git(root, 'reset', '--hard', baseCommit);
  return { container, root, manifest, baseCommit, inputCommit, sourceRaw, identityRaw, reviewCommit, givenCommit };
}
const dry = f => materializeE041OriginalChoiceCorrection({ repoRoot: f.root, manifest: f.manifest,
  baseCommit: f.baseCommit, inputCommit: f.inputCommit, write: false });

test('E041: exact original choice order and linked labels produce only the pinned source bytes', t => {
  const f = fixture(t), p = path.join(f.container, 'output'), result = materializeE041OriginalChoiceCorrection({ repoRoot: f.root,
    manifest: f.manifest, baseCommit: f.baseCommit, inputCommit: f.inputCommit, outputRoot: p, write: true });
  const actual = fs.readFileSync(path.join(p, S.sourcePath)), actualBank = bank(actual);
  assert.equal(sha(actual), S.afterSha256); assert.equal(blob(actual), S.afterGitBlobSha1);
  assert.deepEqual(actualBank[S.sourceOrdinal - 1], afterQ);
  assert.deepEqual(actualBank.filter((_, i) => i !== S.sourceOrdinal - 1), beforeBank.filter((_, i) => i !== S.sourceOrdinal - 1));
  const differences = Object.keys(beforeQ).filter(k => stable(beforeQ[k]) !== stable(actualBank[S.sourceOrdinal - 1][k])).sort();
  assert.deepEqual(differences, ['answer', 'choices', 'solution']);
  assert.equal(result.sourceFiles[0].nonselectedWholeQuestionsPreserved, 23);
  assert.equal(result.approvalEffect, 'NONE'); assert.equal(result.newApprovals, 0); assert.equal(result.actualUi, 'PENDING');
  assert.equal(result.nativeCorrectionReview, 'REQUIRED_SEPARATELY'); assert.equal(result.existingApprovalReuseAuthorized, false);
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit); assert.equal(git(f.root, 'diff', '--name-only', 'HEAD'), '');
  assert.equal(sha(fs.readFileSync(path.join(f.root, S.sourcePath))), S.beforeSha256);
  assert.equal(sha(fs.readFileSync(path.join(f.root, IDENTITY))), sha(f.identityRaw));
});
test('E041: inspection is read-only and candidate closure has no registration requests', t => {
  const f = fixture(t), out = path.join(f.container, 'not-created'), mf = { path: MANIFEST, value: f.manifest };
  const result = validateE041OriginalChoiceCorrectionCandidate({ root: f.root, baseCommit: f.baseCommit, inputCommit: f.inputCommit,
    envelope: {}, manifestFile: mf, files: new Map([[MANIFEST, mf]]) });
  assert.equal(result.requestCount, 0); assert.equal(result.preservationRequestCount, 0); assert.equal(result.selectedUidCount, 1);
  materializeE041OriginalChoiceCorrection({ repoRoot: f.root, manifest: f.manifest, baseCommit: f.baseCommit,
    inputCommit: f.inputCommit, outputRoot: out, write: false });
  assert.equal(fs.existsSync(out), false);
});
test('E041: exact public root correction is consumed without issuing a Native or UI approval', t => {
  const published = { commit: '60f0ec217116aff2b9ddd535aee861db9494ceef', path: REVIEW_PATH,
    gitBlobSha1: 'ca3866d8b65fc5bfcaa7b7de47a7fb376f1c008a',
    sha256: 'ddb8ae9a5c394673ffa065130a2bdcbc53e37ce52f573ce07c1bbcf6958a6280', bytes: 3497 };
  const f = fixture(t, { changeManifest: m => { m.correctionEvidenceRef = published; } });
  const result = dry(f);
  assert.deepEqual(result.correctionEvidenceRef, published);
  assert.equal(result.newApprovals, 0); assert.equal(result.existingApprovalReuseAuthorized, false);
  assert.equal(result.actualUi, 'PENDING'); assert.equal(result.nativeCorrectionReview, 'REQUIRED_SEPARATELY');
});

const manifestNegatives = [
  ['raw-source payload', m => { m.source = 'untrusted text'; }, 'MANIFEST_SHAPE'],
  ['unknown profile', m => { m.transportProfile += '-other'; }, 'MANIFEST_PROFILE'],
  ['other schema', m => { m.schemaVersion += '-other'; }, 'MANIFEST_PROFILE'],
  ['control character in id', m => { m.materializationId += '\t'; }, 'MANIFEST_PROFILE'],
  ['different base', m => { m.baseCommit = 'a'.repeat(40); }, 'MANIFEST_BASE'],
  ['second output', m => { m.outputScope.push('archive/other.js'); }, 'EXACT_ONE_SOURCE'],
  ['second file', m => { m.files.push(structuredClone(m.files[0])); }, 'EXACT_ONE_SOURCE'],
  ['foreign source', m => { m.files[0].path = 'archive/other.js'; }, 'FILE_SCOPE'],
  ['different denominator', m => { m.files[0].expectedQuestionCount++; }, 'FILE_SCOPE'],
  ['extra source value', m => { m.files[0].choices = []; }, 'FILE_SHAPE'],
  ['wrong after bytes', m => { m.files[0].after.sha256 = 'a'.repeat(64); }, 'AFTER_FIXED_REF'],
  ['second selected item', m => { m.files[0].changes.push(structuredClone(m.files[0].changes[0])); }, 'EXACT_ONE_CHANGE'],
  ['foreign uid', m => { m.files[0].changes[0].questionUid = 'qid_v1_' + 'a'.repeat(64); }, 'CHANGE_FIXED_SCOPE'],
  ['wrong ordinal', m => { m.files[0].changes[0].sourceOrdinal--; }, 'CHANGE_FIXED_SCOPE'],
  ['changed whole question', m => { m.files[0].changes[0].wholeQuestionBeforeSha256 = 'a'.repeat(64); }, 'CHANGE_FIXED_SCOPE'],
  ['unreviewed permutation', m => { m.files[0].changes[0].optionPermutationFromCurrentOneBased.reverse(); }, 'CHANGE_FIXED_SCOPE'],
  ['extra target field', m => { m.files[0].changes[0].changedFields.push('content'); }, 'CHANGE_FIXED_SCOPE'],
  ['label occurrence expansion', m => { m.files[0].changes[0].linkedSolutionLabelOccurrences++; }, 'CHANGE_FIXED_SCOPE'],
  ['literal answer payload', m => { m.files[0].changes[0].answer = 'untrusted'; }, 'CHANGE_SHAPE'],
  ['source ref unknown key', m => { m.files[0].sourceBeforeRef.extra = 1; }, 'IMMUTABLE_REF_SHAPE'],
  ['source commit mismatch', m => { m.files[0].sourceBeforeRef.commit = S.reviewedSourceCommit; }, 'IMMUTABLE_REF_BINDING'],
  ['source path alias', m => { m.files[0].sourceBeforeRef.path = './' + S.sourcePath; }, 'IMMUTABLE_REF_BINDING'],
  ['source ref byte count', m => { m.files[0].sourceBeforeRef.bytes++; }, 'IMMUTABLE_REF_DRIFT'],
  ['wrong identity path', m => { m.identityRef.path = 'archive/data/other.json'; }, 'IDENTITY_REF'],
  ['wrong identity digest', m => { m.identityRef.sha256 = 'a'.repeat(64); }, 'IDENTITY_DRIFT'],
  ['missing correction evidence', m => { m.correctionEvidenceRef = null; }, 'IMMUTABLE_REF_SHAPE'],
  ['wrong correction path', m => { m.correctionEvidenceRef.path = 'docs/operations/other.json'; }, 'IMMUTABLE_REF_BINDING'],
  ['wrong correction hash', m => { m.correctionEvidenceRef.sha256 = 'a'.repeat(64); }, 'IMMUTABLE_REF_DRIFT'],
];
for (const [name, changeManifest, code] of manifestNegatives) test('E041 rejects ' + name, t => {
  const f = fixture(t, { changeManifest }); assert.throws(() => dry(f), new RegExp('SOURCE_E041_CHOICE:' + code));
});
const reviewNegatives = [
  ['unsigned decision', d => { d.decision = null; }, 'CORRECTION_AUTHORITY_LIMIT'],
  ['missing reviewer', d => { d.reviewer = null; }, 'CORRECTION_INDEPENDENT_ROLES'],
  ['self review', d => { d.reviewer = d.producer; }, 'CORRECTION_INDEPENDENT_ROLES'],
  ['other producer', d => { d.producer = 'other'; }, 'CORRECTION_INDEPENDENT_ROLES'],
  ['current-first phase', d => { d.phaseOrder = 'CURRENT_THEN_ORIGINAL'; }, 'CORRECTION_PHASE_FREEZE'],
  ['no original freeze', d => { d.originalObservationSha256 = null; }, 'CORRECTION_PHASE_FREEZE'],
  ['zero correction proof', d => { d.rootCorrectionReviewSha256 = '0'.repeat(64); }, 'CORRECTION_PHASE_FREEZE'],
  ['unreviewed scope', d => { d.scope += '_OTHER'; }, 'CORRECTION_REVIEW_SCOPE'],
  ['raw solution field', d => { d.solution = 'untrusted'; }, 'CORRECTION_REVIEW_SHAPE'],
  ...['newNativeApprovals', 'newReview2Claims', 'newMetadataApprovals', 'newDifficultyJudgments', 'newFourSlotVectors']
    .map(field => [field, d => { d[field] = 1; }, 'CORRECTION_AUTHORITY_LIMIT']),
  ['approval reuse', d => { d.existingApprovalReuseAuthorized = true; }, 'CORRECTION_AUTHORITY_LIMIT'],
  ['claim actual UI', d => { d.actualUi = 'PASS'; }, 'CORRECTION_AUTHORITY_LIMIT'],
  ['other uid', d => { d.questionUid = 'qid_v1_' + 'a'.repeat(64); }, 'CORRECTION_FIXED_ITEM'],
  ['other ordinal', d => { d.sourceOrdinal++; }, 'CORRECTION_FIXED_ITEM'],
  ['other whole after', d => { d.afterWholeQuestionSha256 = 'a'.repeat(64); }, 'CORRECTION_FIXED_ITEM'],
  ['expanded permutation', d => { d.optionPermutationFromCurrentOneBased = [5, 4, 3, 2, 1]; }, 'CORRECTION_FIXED_TRANSITION'],
  ['missing field transition', d => { d.fieldTransitions.pop(); }, 'CORRECTION_FIXED_TRANSITION'],
  ['different field hash', d => { d.fieldTransitions[0].after.sha256 = 'a'.repeat(64); }, 'CORRECTION_FIXED_TRANSITION'],
  ['extra linked key', d => { d.linkedLabelChange.normalization = true; }, 'LINKED_LABEL_SHAPE'],
  ['unbounded label occurrences', d => { d.linkedLabelChange.solutionChoiceLabelOccurrencesOnly++; }, 'LINKED_LABEL_SCOPE'],
  ['changed calculation', d => { d.linkedLabelChange.solutionCalculationUnchanged = false; }, 'LINKED_LABEL_SCOPE'],
  ['different reviewed original', d => { d.sourceBeforeRef.commit = 'a'.repeat(40); }, 'IMMUTABLE_REF_BINDING'],
  ['different after source', d => { d.sourceAfter.sha256 = 'a'.repeat(64); }, 'REVIEW_AFTER_BYTES'],
  ['different given path', d => { d.originalGivenRef.path += '.alias'; }, 'IMMUTABLE_REF_BINDING'],
  ['wrong given hash', d => { d.originalGivenRef.sha256 = 'a'.repeat(64); }, 'IMMUTABLE_REF_DRIFT'],
];
for (const [name, changeReview, code] of reviewNegatives) test('E041 rejects review ' + name, t => {
  const f = fixture(t, { changeReview }); assert.throws(() => dry(f), new RegExp('SOURCE_E041_CHOICE:' + code));
});
test('E041 rejects duplicate JSON authority keys even when the effective value is unchanged', t => {
  const f = fixture(t, { changeReviewText: raw => raw.replace('"reviewer":', '"reviewer": "GPT_ROOT_C8F1B0BFB4FA", "reviewer":') });
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:DUPLICATE_JSON_KEY/);
});
test('E041 rejects a rehashed changed original-given image', t => {
  const f = fixture(t, { changeGiven: b => Buffer.concat([b, Buffer.from('x')]) });
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:ORIGINAL_GIVEN_BYTES/);
});
test('E041 refuses executable-mode original-given input', t => {
  const f = fixture(t, { givenMode: 0o755 }); assert.throws(() => dry(f), /SOURCE_E041_CHOICE:GIT_REGULAR_FILE/);
});
test('E041 refuses current wrapper changes despite unchanged question data', t => {
  const f = fixture(t, { changeSource: raw => Buffer.concat([raw, Buffer.from('\n// changed wrapper\n')]) });
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:FIXED_SOURCE_BEFORE/);
});
test('E041 refuses any nonselected current question change', t => {
  const f = fixture(t, { changeSource: raw => Buffer.from(raw.toString().replace('"id": 1,', '"id": 1001,')) });
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:FIXED_SOURCE_BEFORE/);
});
test('E041 refuses a duplicate current identity row', t => {
  const f = fixture(t, { changeIdentity: d => d.records.push(structuredClone(d.records[0])) });
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:IDENTITY_DENOMINATOR/);
});
test('E041 refuses a missing current identity row', t => {
  const f = fixture(t, { changeIdentity: d => d.records.pop() });
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:IDENTITY_DENOMINATOR/);
});
test('E041 refuses ordinal lookup disagreement despite exact selected UID', t => {
  const f = fixture(t, { changeIdentity: d => { d.lookup.bySourceFileAndOrdinal[S.sourcePath.slice('archive/exams/'.length)][10] = d.records[0].questionUid; } });
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:IDENTITY_LOOKUP_JOIN/);
});
test('E041 input cannot reuse its own commit as correction authority', t => {
  const f = fixture(t); f.manifest.correctionEvidenceRef.commit = f.inputCommit;
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:IMMUTABLE_REF_BINDING/);
});
test('E041 input and base must be different commits', t => {
  const f = fixture(t); f.inputCommit = f.baseCommit;
  assert.throws(() => dry(f), /SOURCE_E041_CHOICE:MANIFEST_BASE/);
});
test('E041 cannot write into the current checkout', t => {
  const f = fixture(t); assert.throws(() => materializeE041OriginalChoiceCorrection({ repoRoot: f.root, manifest: f.manifest,
    baseCommit: f.baseCommit, inputCommit: f.inputCommit, write: true, outputRoot: path.join(f.root, 'output') }), /ISOLATED_NEW_OUTPUT/);
});
test('E041 cannot overwrite an existing output directory', t => {
  const f = fixture(t), out = path.join(f.container, 'output'); fs.mkdirSync(out);
  assert.throws(() => materializeE041OriginalChoiceCorrection({ repoRoot: f.root, manifest: f.manifest,
    baseCommit: f.baseCommit, inputCommit: f.inputCommit, write: true, outputRoot: out }), /ISOLATED_NEW_OUTPUT/);
});
test('E041 rejects extra input files and preservation-only requests', t => {
  const f = fixture(t), mf = { path: MANIFEST, value: f.manifest };
  for (const [envelope, files] of [[{ preservationRequestRefs: [] }, new Map([[MANIFEST, mf]])],
    [{}, new Map([[MANIFEST, mf], ['extra', {}]])]]) {
    assert.throws(() => validateE041OriginalChoiceCorrectionCandidate({ root: f.root, baseCommit: f.baseCommit,
      inputCommit: f.inputCommit, envelope, manifestFile: mf, files }), /INPUT_GRAPH_SCOPE/);
  }
});
test('E041 scope constants expose no source, answer, or solution values', () => {
  assert.deepEqual(S.changedFields, ['answer', 'choices', 'solution']);
  for (const key of ['source', 'content', 'answer', 'choices', 'solution']) assert.equal(Object.hasOwn(S, key), false);
});

const moduleText = fs.readFileSync(MODULE, 'utf8');
const bankFunction = moduleText.slice(moduleText.indexOf('function executedBank('), moduleText.indexOf('function identityAt('));
const isolatedBank = vm.runInNewContext(`const MAX_SOURCE=1024*1024; const fail=c=>{throw Error('SOURCE_E041_CHOICE:'+c)};
  const need=(x,c)=>{if(!x)fail(c)}; const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.getPrototypeOf(v)===Object.prototype;
  ${bankFunction}; executedBank;`, { vm, Buffer });
test('E041 VM accepts ordinary source data without a host-created window', () => {
  assert.equal(isolatedBank(Buffer.from('window.questionBank=[{id:1}];'))[0].id, 1);
});
for (const [name, expression] of [['window constructor', 'window.constructor.constructor("return process")()'],
  ['console constructor', 'console.log.constructor("return process")()']]) {
  test('E041 VM refuses ' + name, () => {
    assert.throws(() => isolatedBank(Buffer.from(`window.questionBank=[{id:1}]; ${expression};`)), /SOURCE_EXECUTION/);
  });
}
test('E041 VM refuses accessors, sparse arrays, and non-data values', () => {
  for (const script of ['window.questionBank=[{get id(){return 1}}];', 'window.questionBank=[,{id:1}];',
    'window.questionBank=[{id:1,fn(){}}];']) assert.throws(() => isolatedBank(Buffer.from(script)), /SOURCE_EXECUTION/);
});
