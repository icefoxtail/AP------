import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { M2S1_SVG7_IMAGE_POINTER_PROFILE as PROFILE, M2S1_SVG7_IMAGE_POINTER_SCHEMA as SCHEMA,
  M2S1_SVG7_STATIC_SCHEMA as STATIC_SCHEMA, M2S1_SVG7_REVIEWED_SOURCE_COMMIT as ORIGINAL,
  M2S1_SVG7_ASSET_COMMIT as ASSET_COMMIT, M2S1_SVG7_SCOPE as SCOPE,
  materializeM2s1Svg7ImagePointer, validateM2s1Svg7ImagePointerCandidate }
  from '../archive/tools/meta-foundation/materialize-reviewed-m2s1-svg7-image-pointer.mjs';
import { CANDIDATE_ENVELOPE, CANDIDATE_SCHEMA, inspectSourceMetadataCandidate,
  buildSourceMetadataCandidate } from '../tools/ci/archive-reviewed-source-candidate.mjs';

const repository = fileURLToPath(new URL('..', import.meta.url));
const IDENTITY = 'archive/data/question_identity_map.json';
const STATIC = 'docs/operations/m2s1-svg7-source-repair-20261116/independent-static-v1.json';
const MANIFEST = '.archive-meta-register/evidence/svg7-fixture-materialization.json';
const sourcePaths = [...new Set(SCOPE.map(s => s.sourcePath))];
const sha = b => createHash('sha256').update(b).digest('hex');
const blob = b => createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
const json = v => JSON.stringify(v, null, 2) + '\n';
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const pair = raw => ({ blobSha1: blob(raw), sha256: sha(raw) });
const inputRef = (p, raw) => ({ path: p, ...pair(raw) });
const ref = (commit, p, raw) => ({ commit, path: p, gitBlobSha1: blob(raw), sha256: sha(raw), bytes: Buffer.byteLength(raw) });
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], {
  env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_CONFIG_NOSYSTEM: '1' },
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024,
}).trim();
const cache = new Map();
function publicBytes(commit, p) {
  const key = commit + ':' + p;
  if (!cache.has(key)) cache.set(key, execFileSync('git', ['-C', repository, 'show', key], {
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1' }, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024,
  }));
  return cache.get(key);
}
function bankOf(raw) {
  const ctx = { window: {} };
  vm.runInNewContext(String(raw), ctx, { timeout: 3000 });
  return JSON.parse(JSON.stringify(ctx.window.questionBank));
}

// This isolated fixture records synthetic authority roles for negative testing.
// It is never a published review or an actual registration approval. Sources and
// image bytes are read from the two exact public commits, never copied into tests.
function staticFixture() {
  return { schemaVersion: STATIC_SCHEMA, transportProfile: PROFILE,
    producer: 'GPT_REGISTRAR_REPAIR', reviewer: 'GPT_ROOT_C8F1B0BFB4FA',
    rootOriginalFreezeSha256: '4fd7aaedd5666a65ccb32c5eefaf413cddd6e38f43b422f47ab146d23bf07344',
    rootStaticReviewSha256: 'd1f99134c54bc2771b49817996ab0eafe5c3bf1e74aa82566afa01c750d891f5',
    ownedSvgManifestSha256: '5e2ee7da2b0ae1a5817051abca5c26474f9b2b641070a8e45cab9dca403b7d13',
    expectedDisplayFreezeSha256: 'ad2e0fdd5daeb21a38309faea04d16fa9f015c7ca2165c78e9bb8315764e439a',
    rows: SCOPE.map(s => ({ key: s.key, questionUid: s.questionUid, sourceOrdinal: s.sourceOrdinal,
      expectedBankCount: s.expectedBankCount, pointerField: 'content', pointerKind: 'EXACT_SINGLE_IMG_SRC_URI',
      contentBeforeSha256: s.reviewedContentSha256, contentAfterSha256: s.pointerContentAfterSha256,
      beforeSourceRef: ref(ORIGINAL, s.sourcePath, publicBytes(ORIGINAL, s.sourcePath)),
      wholeQuestionBeforeSha256: s.reviewedWholeQuestionSha256,
      oldAssetRef: ref(ORIGINAL, s.oldAssetPath, publicBytes(ORIGINAL, s.oldAssetPath)),
      newAssetRef: ref(ASSET_COMMIT, s.newAssetPath, publicBytes(ASSET_COMMIT, s.newAssetPath)),
      staticDecision: 'ACCEPT_STATIC_DISPLAY_REPAIR' })), actualUi: 'PENDING', newFullMathematicalQa: false,
    newNativeApprovals: 0, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, newFourSlotVectors: 0 };
}

function fixture(t, { changeReview, changeReviewText, changeSource, changeBank, sourceTail, changeOldAsset,
  changeIdentity, changeManifest, changeManifestText, changeEnvelope, changeExpectedAfter, extraInput } = {}) {
  const container = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-m2s1-svg7-fixture-'));
  t.after(() => fs.rmSync(container, { recursive: true, force: true }));
  const root = path.join(container, 'repo'); fs.mkdirSync(root);
  const put = (p, b) => { const dst = path.join(root, p); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.writeFileSync(dst, b); };
  git(root, 'init', '-q', '-b', 'main'); git(root, 'config', 'user.name', 'Synthetic SVG7 test');
  git(root, 'config', 'user.email', 'svg7-fixture@example.invalid'); git(root, 'config', 'commit.gpgsign', 'false');
  git(root, 'config', 'core.quotePath', 'false'); git(root, 'config', 'gc.auto', '0');
  const common = path.resolve(repository, git(repository, 'rev-parse', '--git-common-dir'));
  fs.writeFileSync(path.join(root, '.git/objects/info/alternates'), path.join(common, 'objects') + '\n');
  put('README.md', 'SYNTHETIC TEST ONLY. No real review or approval is issued.\n');
  const review = staticFixture(); changeReview?.(review);
  const reviewRaw = changeReviewText?.(json(review)) ?? json(review); put(STATIC, reviewRaw);
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic static contract fixture');
  const reviewCommit = git(root, 'rev-parse', 'HEAD'); git(root, 'rm', '--', STATIC);
  const sources = new Map(), after = new Map(), banks = new Map(), records = [];
  for (const [index, p] of sourcePaths.entries()) {
    const original = publicBytes(ORIGINAL, p), originalBank = bankOf(original), scope = SCOPE.filter(s => s.sourcePath === p);
    const sourceArchiveFile = p.slice('archive/exams/'.length);
    for (const [i, q] of originalBank.entries()) {
      const questionUid = scope.find(s => s.sourceOrdinal === i + 1)?.questionUid || 'qid_v1_' + sha(`${p}:${i + 1}`);
      const sourceQuestionNo = q.sourceQuestionNo ?? q.sourceQid ?? q.id ?? i + 1;
      records.push({ questionUid, sourceArchiveFile, sourceOrdinal: i + 1, sourceQuestionNo,
        legacyQKey: sourceArchiveFile + '_' + sourceQuestionNo });
    }
    let raw = original.toString();
    if (changeBank) { changeBank(originalBank, index); raw = 'window.questionBank = ' + json(originalBank).trimEnd() + ';\n'; }
    raw += sourceTail?.(index) ?? '';
    raw = changeSource?.(raw, index) ?? raw;
    sources.set(p, raw); banks.set(p, bankOf(raw)); put(p, raw);
    let next = raw;
    for (const s of scope) {
      next = next.replace(s.oldAssetPath.slice('archive/'.length), s.newAssetPath.slice('archive/'.length));
      const asset = publicBytes(ORIGINAL, s.oldAssetPath); put(s.oldAssetPath, changeOldAsset?.(asset, s) ?? asset);
    }
    next = changeExpectedAfter?.(next, index) ?? next; after.set(p, next);
  }
  const identity = { schemaVersion: 'question-identity-map-v1', records, lookup: {
    byQuestionUid: Object.fromEntries(records.map(({ questionUid, ...r }) => [questionUid, r])),
    bySourceFileAndOrdinal: Object.fromEntries(sourcePaths.map(p => { const name = p.slice('archive/exams/'.length);
      return [name, Object.fromEntries(records.filter(r => r.sourceArchiveFile === name).map(r => [r.sourceOrdinal, r.questionUid]))]; })),
    bySourceFileAndQuestionNo: Object.fromEntries(sourcePaths.map(p => { const name = p.slice('archive/exams/'.length);
      return [name, Object.fromEntries(records.filter(r => r.sourceArchiveFile === name).map(r => [r.sourceQuestionNo, [r.questionUid]]))]; })),
    byLegacyQKey: Object.fromEntries(records.map(r => [r.legacyQKey, [r.questionUid]])),
  } };
  changeIdentity?.(identity); const identityRaw = json(identity); put(IDENTITY, identityRaw);
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic current whole banks and identity');
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  const manifest = { schemaVersion: SCHEMA, transportProfile: PROFILE, materializationId: 'fixture-m2s1-svg7-pointer', baseCommit,
    identityRef: inputRef(IDENTITY, identityRaw), staticEvidenceRef: ref(reviewCommit, STATIC, reviewRaw), outputScope: sourcePaths,
    files: sourcePaths.map(p => ({ path: p, sourceBeforeRef: ref(baseCommit, p, sources.get(p)), after: pair(after.get(p)),
      expectedQuestionCount: banks.get(p).length, changes: SCOPE.filter(s => s.sourcePath === p).map(s => ({
        key: s.key, questionUid: s.questionUid, sourceOrdinal: s.sourceOrdinal,
        wholeQuestionBeforeSha256: sha(stable(banks.get(p)[s.sourceOrdinal - 1])), pointerField: 'content', pointerKind: 'EXACT_SINGLE_IMG_SRC_URI',
        pointerBefore: s.oldAssetPath.slice('archive/'.length), pointerAfter: s.newAssetPath.slice('archive/'.length),
        contentBeforeSha256: s.reviewedContentSha256, contentAfterSha256: s.pointerContentAfterSha256,
        oldAssetRef: ref(baseCommit, s.oldAssetPath, fs.readFileSync(path.join(root, s.oldAssetPath))),
        newAssetRef: ref(ASSET_COMMIT, s.newAssetPath, publicBytes(ASSET_COMMIT, s.newAssetPath)),
      })) })) };
  changeManifest?.(manifest, { root, baseCommit, reviewCommit, review, sources, after });
  const manifestRaw = changeManifestText?.(json(manifest)) ?? json(manifest);
  const inputs = { [MANIFEST]: manifestRaw, ...extraInput };
  const envelope = { schemaVersion: CANDIDATE_SCHEMA, materializationId: manifest.materializationId, baseCommit,
    manifestRef: inputRef(MANIFEST, manifestRaw), inputFiles: Object.entries(inputs).map(([p, b]) => inputRef(p, b)) };
  changeEnvelope?.(envelope); for (const [p, b] of Object.entries(inputs)) put(p, b); put(CANDIDATE_ENVELOPE, json(envelope));
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'synthetic metadata input without source changes');
  const inputCommit = git(root, 'rev-parse', 'HEAD'); git(root, 'reset', '--hard', baseCommit);
  return { root, container, baseCommit, inputCommit, manifest, envelope, sources, after, banks,
    options: { repoRoot: root, inputCommit, eventRef: 'archive-meta-source-input/' + manifest.materializationId } };
}
function dry(f) { return materializeM2s1Svg7ImagePointer({ repoRoot: f.root, manifest: f.manifest,
  baseCommit: f.baseCommit, inputCommit: f.inputCommit, write: false }); }

test('SVG7: closed worker builds only seven img-src URI changes across 75 questions', async t => {
  const f = fixture(t), inspected = inspectSourceMetadataCandidate(f.options);
  assert.equal(inspected.closure.transportProfile, PROFILE);
  assert.equal(inspected.closure.selectedUidCount, 7); assert.equal(inspected.closure.newApprovals, 0);
  assert.equal(inspected.closure.actualUi, 'PENDING'); assert.deepEqual(inspected.closure.sourceFieldsChanged, ['content']);
  assert.deepEqual(inspected.closure.sourceFiles.map(r => r.nonselectedWholeQuestionsPreserved), [23, 23, 22]);
  const result = await buildSourceMetadataCandidate({ ...f.options, outputRoot: path.join(f.container, 'output') });
  assert.equal(result.sourceFileCount, 3); assert.equal(result.approvalEffect, 'NONE'); assert.equal(result.registrationStatus, 'NOT_REGISTERED');
  assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit); assert.equal(git(f.root, 'diff', '--name-only', 'HEAD'), '');
  const changed = git(f.root, 'diff-tree', '--no-commit-id', '--name-only', '-r', f.inputCommit, result.candidateCommit).split('\n').sort();
  assert.deepEqual(changed, [CANDIDATE_ENVELOPE, result.receiptPath, ...sourcePaths].sort());
  for (const p of sourcePaths) {
    const actual = fs.readFileSync(path.join(f.container, 'output', p));
    assert.equal(sha(actual), sha(f.after.get(p)));
    let inverse = actual.toString(); const wanted = structuredClone(f.banks.get(p));
    for (const s of SCOPE.filter(s => s.sourcePath === p)) {
      inverse = inverse.replace(s.newAssetPath.slice('archive/'.length), s.oldAssetPath.slice('archive/'.length));
      wanted[s.sourceOrdinal - 1].content = wanted[s.sourceOrdinal - 1].content.replace(
        s.oldAssetPath.slice('archive/'.length), s.newAssetPath.slice('archive/'.length));
      assert.equal(git(f.root, 'rev-parse', result.candidateCommit + ':' + s.oldAssetPath),
        git(f.root, 'rev-parse', f.baseCommit + ':' + s.oldAssetPath));
    }
    assert.equal(sha(inverse), sha(f.sources.get(p))); assert.equal(sha(stable(bankOf(actual))), sha(stable(wanted)));
  }
  assert.equal(git(f.root, 'rev-parse', result.candidateCommit + ':' + IDENTITY), git(f.root, 'rev-parse', f.baseCommit + ':' + IDENTITY));
  const receipt = JSON.parse(git(f.root, 'show', result.candidateCommit + ':' + result.receiptPath));
  assert.equal(receipt.inputClosure.staticEvidenceRef.sha256, f.manifest.staticEvidenceRef.sha256);
  assert.equal(receipt.inputClosure.nonselectedWholeQuestionChanges, 0);
});

test('SVG7: legitimate current nonselected data and harmless wrapper remain exact', t => {
  const f = fixture(t, { changeBank: (bank, i) => { if (i === 0) bank[0].unrelatedMetadata = 'synthetic current value'; },
    sourceTail: () => '// exact harmless context\nwindow.questionBank[0].anotherMetadata = 7;\n' });
  assert.equal(dry(f).nonselectedWholeQuestionChanges, 0);
});

test('SVG7: dry mode creates no output and does not consume the immutable input', t => {
  const f = fixture(t), target = path.join(f.container, 'no-output');
  materializeM2s1Svg7ImagePointer({ repoRoot: f.root, manifest: f.manifest, baseCommit: f.baseCommit,
    inputCommit: f.inputCommit, outputRoot: target, write: false });
  assert.equal(fs.existsSync(target), false); assert.equal(git(f.root, 'rev-parse', 'HEAD'), f.baseCommit);
});

test('SVG7: exact published root static seven is consumed without granting an approval', t => {
  const published = { commit: '34b9e6ab851d78f90bba4975416cbeb5ee8817e3', path: STATIC,
    gitBlobSha1: 'c0f84ef234a430067e79e563712bb2c95b0ae3a0',
    sha256: '2fa5c28da0a4d22c6443a6a164caa300fadc3642201265224b7351eb273b520e', bytes: 13196 };
  const f = fixture(t, { changeManifest: m => { m.staticEvidenceRef = published; } });
  const closure = inspectSourceMetadataCandidate(f.options).closure;
  assert.deepEqual(closure.staticEvidenceRef, published);
  assert.equal(closure.selectedUidCount, 7);
  assert.equal(closure.newApprovals, 0);
  assert.equal(closure.actualUi, 'PENDING');
});

const staticNegatives = [
  ['missing independent reviewer', d => { d.reviewer = null; }, 'STATIC_INDEPENDENT_ROLES'],
  ['producer posing as reviewer', d => { d.reviewer = d.producer; }, 'STATIC_INDEPENDENT_ROLES'],
  ['foreign producer', d => { d.producer = 'another-role'; }, 'STATIC_INDEPENDENT_ROLES'],
  ['wrong original freeze', d => { d.rootOriginalFreezeSha256 = '0'.repeat(64); }, 'STATIC_BASIS'],
  ['wrong independent review', d => { d.rootStaticReviewSha256 = '0'.repeat(64); }, 'STATIC_BASIS'],
  ['wrong candidate manifest', d => { d.ownedSvgManifestSha256 = '0'.repeat(64); }, 'STATIC_BASIS'],
  ['wrong expected freeze', d => { d.expectedDisplayFreezeSha256 = '0'.repeat(64); }, 'STATIC_BASIS'],
  ['unknown top key', d => { d.extra = true; }, 'STATIC_SHAPE'],
  ['wrong schema', d => { d.schemaVersion += '-unknown'; }, 'STATIC_PROFILE'],
  ['wrong profile', d => { d.transportProfile = 'M2_PROBLEM_IMAGE_REPAIR8_V1'; }, 'STATIC_PROFILE'],
  ['UI approval from static', d => { d.actualUi = 'PASS'; }, 'STATIC_NO_APPROVAL'],
  ['full math approval', d => { d.newFullMathematicalQa = true; }, 'STATIC_NO_APPROVAL'],
  ...['newNativeApprovals','newReview2Claims','newMetadataApprovals','newDifficultyJudgments','newFourSlotVectors']
    .map(k => [k, d => { d[k] = 1; }, 'STATIC_NO_APPROVAL']),
  ['missing item', d => { d.rows.pop(); }, 'STATIC_EXACT_SEVEN'],
  ['duplicate item', d => { d.rows[1] = d.rows[0]; }, 'STATIC_EXACT_SEVEN'],
  ['reordered items', d => { d.rows.reverse(); }, 'STATIC_EXACT_SEVEN'],
  ['unknown row key', d => { d.rows[0].extra = 1; }, 'STATIC_ROW_SHAPE'],
  ['unreviewed row', d => { d.rows[0].staticDecision = null; }, 'STATIC_ROW_SCOPE'],
  ['foreign UID', d => { d.rows[0].questionUid = SCOPE[1].questionUid; }, 'STATIC_ROW_SCOPE'],
  ['wrong ordinal', d => { d.rows[0].sourceOrdinal++; }, 'STATIC_ROW_SCOPE'],
  ['wrong denominator', d => { d.rows[0].expectedBankCount++; }, 'STATIC_ROW_SCOPE'],
  ['top-level image permission', d => { d.rows[0].pointerField = 'image'; }, 'STATIC_ROW_SCOPE'],
  ['different pointer kind', d => { d.rows[0].pointerKind = 'HTML_REWRITE'; }, 'STATIC_ROW_SCOPE'],
  ['different content hash', d => { d.rows[0].contentBeforeSha256 = '0'.repeat(64); }, 'STATIC_CONTENT_DIGEST'],
  ['foreign reviewed source', d => { d.rows[0].beforeSourceRef.commit = ASSET_COMMIT; }, 'STATIC_FIXED_SOURCE'],
  ['changed whole question', d => { d.rows[0].wholeQuestionBeforeSha256 = '0'.repeat(64); }, 'STATIC_FIXED_WHOLE_QUESTION'],
  ['foreign old asset', d => { d.rows[0].oldAssetRef = d.rows[1].oldAssetRef; }, 'STATIC_FIXED_OLD_ASSET'],
  ['foreign new asset', d => { d.rows[0].newAssetRef = d.rows[1].newAssetRef; }, 'STATIC_FIXED_NEW_ASSET'],
];
for (const [name, changeReview, error] of staticNegatives) test('SVG7 rejects static ' + name, t => {
  const f = fixture(t, { changeReview }); assert.throws(() => dry(f), new RegExp('SOURCE_M2S1_SVG7:' + error));
});

const manifestNegatives = [
  ['unknown manifest key', m => { m.extra = true; }, 'MANIFEST_SHAPE'],
  ['wrong profile', m => { m.transportProfile += '-unknown'; }, 'MANIFEST_PROFILE'],
  ['wrong source order', m => { m.files.reverse(); }, 'FILE_SCOPE'],
  ['extra source', m => { m.outputScope = [...m.outputScope, 'archive/exams/original/foreign.js']; }, 'FILE_SCOPE'],
  ['missing source', m => { m.files.pop(); }, 'FILE_SCOPE'],
  ['identity path alias', m => { m.identityRef.path = 'archive/data/../data/question_identity_map.json'; }, 'IDENTITY_REF'],
  ['identity hash drift', m => { m.identityRef.sha256 = '0'.repeat(64); }, 'IDENTITY_DRIFT'],
  ['static ref bytes drift', m => { m.staticEvidenceRef.bytes++; }, 'IMMUTABLE_REF_DRIFT'],
  ['static ref unknown key', m => { m.staticEvidenceRef.extra = 1; }, 'IMMUTABLE_REF_SHAPE'],
  ['static alternate path', m => { m.staticEvidenceRef.path += '-copy'; }, 'IMMUTABLE_REF_BINDING'],
  ['source wrong commit', m => { m.files[0].sourceBeforeRef.commit = ORIGINAL; }, 'IMMUTABLE_REF_BINDING'],
  ['source byte drift', m => { m.files[0].sourceBeforeRef.bytes++; }, 'IMMUTABLE_REF_DRIFT'],
  ['source path mismatch', m => { m.files[0].sourceBeforeRef.path = m.files[1].path; }, 'IMMUTABLE_REF_BINDING'],
  ['source count spoof', m => { m.files[0].expectedQuestionCount++; }, 'SOURCE_DENOMINATOR'],
  ['missing selected change', m => { m.files[0].changes.pop(); }, 'CHANGE_SCOPE'],
  ['duplicated selected change', m => { m.files[0].changes[1] = m.files[0].changes[0]; }, 'CHANGE_FIXED_SCOPE'],
  ['change UID substitution', m => { m.files[0].changes[0].questionUid = SCOPE[1].questionUid; }, 'CHANGE_FIXED_SCOPE'],
  ['change ordinal substitution', m => { m.files[0].changes[0].sourceOrdinal++; }, 'CHANGE_FIXED_SCOPE'],
  ['whole question null', m => { m.files[0].changes[0].wholeQuestionBeforeSha256 = null; }, 'STATIC_CURRENT_WHOLE_QUESTION'],
  ['top-level image update', m => { m.files[0].changes[0].pointerField = 'image'; }, 'POINTER_FIXED_SCOPE'],
  ['arbitrary content rewrite', m => { m.files[0].changes[0].pointerKind = 'HTML_REWRITE'; }, 'POINTER_FIXED_SCOPE'],
  ['foreign old pointer', m => { m.files[0].changes[0].pointerBefore += '?old=1'; }, 'POINTER_FIXED_SCOPE'],
  ['foreign new pointer', m => { m.files[0].changes[0].pointerAfter = SCOPE[1].newAssetPath.slice(8); }, 'POINTER_FIXED_SCOPE'],
  ['content before digest', m => { m.files[0].changes[0].contentBeforeSha256 = '0'.repeat(64); }, 'CONTENT_BEFORE'],
  ['content after digest', m => { m.files[0].changes[0].contentAfterSha256 = '0'.repeat(64); }, 'CONTENT_AFTER'],
  ['old asset wrong base', m => { m.files[0].changes[0].oldAssetRef.commit = ORIGINAL; }, 'IMMUTABLE_REF_BINDING'],
  ['old asset wrong bytes', m => { m.files[0].changes[0].oldAssetRef.bytes++; }, 'IMMUTABLE_REF_DRIFT'],
  ['new asset wrong commit', m => { m.files[0].changes[0].newAssetRef.commit = ORIGINAL; }, 'ASSET_STATIC_JOIN'],
  ['new asset changed bytes', m => { m.files[0].changes[0].newAssetRef.sha256 = '0'.repeat(64); }, 'ASSET_STATIC_JOIN'],
  ['unknown selected delta', m => { m.files[0].changes[0].solution = 'synthetic extra'; }, 'CHANGE_SHAPE'],
  ['after digest drift', m => { m.files[0].after.sha256 = '0'.repeat(64); }, 'SOURCE_AFTER_DRIFT'],
];
for (const [name, changeManifest, error] of manifestNegatives) test('SVG7 rejects manifest ' + name, t => {
  const f = fixture(t, { changeManifest }); assert.throws(() => dry(f), new RegExp('SOURCE_M2S1_SVG7:' + error));
});

for (const field of ['content','question','choices','answer','solution','curriculum','courseKey','svg','choicesEmbeddedInImage']) {
  test('SVG7 rejects fully resealed current selected field change: ' + field, t => {
    const f = fixture(t, { changeBank: (bank, i) => { if (i === 0) bank[2][field] = 'synthetic changed field'; } });
    assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:STATIC_CURRENT_WHOLE_QUESTION/);
  });
}
for (const [name, changeIdentity, error] of [
  ['missing bank member', d => { d.records.splice(0, 1); }, 'IDENTITY_DENOMINATOR'],
  ['duplicate ordinal', d => { d.records[0].sourceOrdinal = d.records[1].sourceOrdinal; }, 'IDENTITY_DENOMINATOR'],
  ['selected UID extra owner', d => { d.records[25].questionUid = SCOPE[0].questionUid; }, 'IDENTITY_UID_JOIN'],
  ['selected ordinal swapped', d => { [d.records[2].questionUid,d.records[3].questionUid] = [d.records[3].questionUid,d.records[2].questionUid]; }, 'IDENTITY_UID_JOIN'],
  ['UID lookup changed', d => { d.lookup.byQuestionUid[SCOPE[0].questionUid].sourceOrdinal = 4; }, 'IDENTITY_LOOKUP_JOIN'],
  ['ordinal lookup changed', d => { d.lookup.bySourceFileAndOrdinal[SCOPE[0].sourcePath.slice('archive/exams/'.length)]['3'] = d.records[3].questionUid; }, 'IDENTITY_LOOKUP_JOIN'],
]) test('SVG7 rejects identity ' + name, t => {
  const f = fixture(t, { changeIdentity }); assert.throws(() => dry(f), new RegExp('SOURCE_M2S1_SVG7:' + error));
});

test('SVG7 rejects changed current old asset despite a resealed immutable ref', t => {
  const f = fixture(t, { changeOldAsset: (raw, s) => s.key === SCOPE[0].key ? Buffer.concat([raw, Buffer.from('\n')]) : raw });
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:STATIC_CURRENT_OLD_ASSET/);
});
test('SVG7 rejects URI-triggered executable changes outside the selected content', t => {
  const uri = SCOPE[0].newAssetPath.slice('archive/'.length);
  const f = fixture(t, { sourceTail: i => i === 0
    ? '\nif (window.questionBank[2].content.includes(' + JSON.stringify(uri.slice(0, -4)) + ' + ".svg")) window.questionBank[0].syntheticMutation = true;\n' : '' });
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:EXECUTED_WHOLE_BANK_DRIFT/);
});
test('SVG7 rejects new URI already anywhere in the source, including comments', t => {
  const f = fixture(t, { sourceTail: i => i === 0 ? '\n// ' + SCOPE[0].newAssetPath.slice(8) + '\n' : '' });
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:POINTER_LITERAL_UNIQUE/);
});
test('SVG7 rejects duplicate old URI outside the selected img', t => {
  const f = fixture(t, { sourceTail: i => i === 0 ? '\n// ' + SCOPE[0].oldAssetPath.slice(8) + '\n' : '' });
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:POINTER_LITERAL_UNIQUE/);
});
test('SVG7 rejects duplicate immutable static JSON keys', t => {
  const f = fixture(t, { changeReviewText: s => s.replace('"actualUi": "PENDING"', '"actualUi": "PENDING", "actualUi": "PENDING"') });
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:DUPLICATE_JSON_KEY/);
});
test('SVG7 rejects duplicate source object keys even when executed values agree', t => {
  const f = fixture(t, { changeSource: (raw, i) => i === 0 ? raw.replace('"id": 1,', '"id": 1, "id": 1,') : raw });
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:SOURCE_DUPLICATE_OR_UNSAFE_KEY/);
});
test('SVG7 rejects expected after bytes with a nonselected change', t => {
  const f = fixture(t, { changeExpectedAfter: (raw, i) => i === 0 ? raw + '\nwindow.questionBank[0].extra = 1;\n' : raw });
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:SOURCE_AFTER_DRIFT/);
});
test('SVG7 refuses aliases and unknown envelope dependencies', t => {
  const f = fixture(t, { extraInput: { '.archive-meta-register/evidence/unused-svg7.json': '{}' } });
  assert.throws(() => inspectSourceMetadataCandidate(f.options), /SOURCE_M2S1_SVG7:INPUT_GRAPH_SCOPE/);
});
test('SVG7 refuses even an empty preservation opt-in', t => {
  const f = fixture(t, { changeEnvelope: e => { e.preservationRequestRefs = []; } });
  assert.throws(() => inspectSourceMetadataCandidate(f.options), /SOURCE_M2S1_SVG7:INPUT_GRAPH_SCOPE/);
});
test('SVG7 refuses duplicate manifest JSON keys before worker dispatch', t => {
  const f = fixture(t, { changeManifestText: s => s.replace('"transportProfile":', '"transportProfile":"M2S1_SVG7_IMAGE_POINTER_V1", "transportProfile":') });
  assert.throws(() => inspectSourceMetadataCandidate(f.options), /DUPLICATE_JSON_KEY/);
});
test('SVG7 refuses self-bound static reference, unknown mode and unsafe output', t => {
  const f = fixture(t); f.manifest.staticEvidenceRef.commit = f.inputCommit;
  assert.throws(() => dry(f), /SOURCE_M2S1_SVG7:IMMUTABLE_REF_BINDING/);
  f.manifest.staticEvidenceRef.commit = git(f.root, 'rev-parse', f.baseCommit + '^');
  assert.throws(() => materializeM2s1Svg7ImagePointer({ repoRoot:f.root,manifest:f.manifest,baseCommit:f.baseCommit,
    inputCommit:f.inputCommit,write:null }), /SOURCE_M2S1_SVG7:WRITE_BOOLEAN/);
  assert.throws(() => materializeM2s1Svg7ImagePointer({ repoRoot:f.root,manifest:f.manifest,baseCommit:f.baseCommit,
    inputCommit:f.inputCommit,write:true,outputRoot:path.join(f.root,'inside') }), /SOURCE_M2S1_SVG7:ISOLATED_NEW_OUTPUT/);
});
test('SVG7 direct graph validator refuses detached manifest objects', t => {
  const f = fixture(t), file = { path: MANIFEST, value: f.manifest };
  assert.throws(() => validateM2s1Svg7ImagePointerCandidate({ root:f.root,baseCommit:f.baseCommit,inputCommit:f.inputCommit,
    envelope:f.envelope,manifestFile:file,files:new Map([[MANIFEST,{...file}]]) }), /SOURCE_M2S1_SVG7:INPUT_GRAPH_SCOPE/);
});
