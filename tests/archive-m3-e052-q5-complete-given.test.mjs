import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { validateM3Q5CompleteGivenApplication as validate, loadM3Q5CompleteGivenBank as bank,
  M3_Q5_COMPLETE_GIVEN_SCHEMA as SCHEMA, M3_Q5_UID as UID } from '../archive/tools/meta-foundation/reviewed-m3-e052-q5-complete-given.mjs';
import { validateReviewedSourceReassessment, REASSESSED_STUDENT_FIELDS } from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import { buildReviewedSourceBinding, reviewedSourceBindingItems } from '../archive/tools/meta-foundation/reviewed-source-binding.mjs';
import { registerReviewedExamV2 } from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import { loadActiveMetaRegistry } from '../archive/tools/meta-foundation/active-registry.mjs';
import { validateNativeReviewedSourceReuse, nativeReviewedM3Q5CompleteGivenRebind } from '../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';

// Real immutable public metadata and sources are read by hash. No question,
// answer, solution or image bytes are embedded in this test or its TAP output.
// Attack witnesses exist only in a disposable synthetic local Git repository.
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'd7111057c89ad4f4a418e2805eeeb1b04447f99f';
const CAPSULE = '1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2';
const DIR = 'docs/operations/m3-e052-q5-complete-given-20261116/';
const RECEIPT = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-audit-e052-native2-course-r2-20261116';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const clone = value => structuredClone(value);
const serialized = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const env = { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0',
  GIT_AUTHOR_NAME: 'Synthetic contract fixture', GIT_AUTHOR_EMAIL: 'test@example.invalid',
  GIT_COMMITTER_NAME: 'Synthetic contract fixture', GIT_COMMITTER_EMAIL: 'test@example.invalid' };
const git = (cwd, args, input) => execFileSync('git', args, { cwd, env, input, maxBuffer: 32 * 1024 * 1024,
  timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] });
const gitBytes = (commit, relative) => git(REPO, ['show', `${commit}:${relative}`]);
const gitJson = (commit, relative) => JSON.parse(gitBytes(commit, relative));
const makeRef = (commit, relative, bytes) => ({ commit, path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes), bytes: bytes.length });
const payload = q => Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k => [k, Object.hasOwn(q, k) ? q[k] : null]));
const fullFp = q => sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
const bodyFp = q => sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null }));
let fixture, basis, technical, visual, request, native, metadata, final, question, canonical, witnessRefs, baseFiles, issuedRecords;
const immutableCache = new Map();
function write(relative, bytes) {
  const full = path.join(fixture, relative); fs.mkdirSync(path.dirname(full), { recursive: true });
  if (fs.existsSync(full)) fs.unlinkSync(full); // Never mutate a donor inode.
  fs.writeFileSync(full, bytes); return full;
}
function preserve(relative, bytes) { if (!baseFiles.has(relative)) { write(relative, bytes); baseFiles.set(relative, bytes); } }
function restore() { for (const [p, b] of baseFiles) if (!fs.existsSync(path.join(fixture, p)) || !fs.readFileSync(path.join(fixture, p)).equals(b)) write(p, b); }
function context() {
  const req = clone(request), patch = req.items.find(row => row.questionUid === UID);
  return { root: fixture, request: req, patch, native: clone(native), row: clone(native.rows.get(5)),
    question: clone(question), metadata: clone(metadata), final: clone(final), studentPayload: payload,
    canonicalBefore: clone(canonical), canonicalAfter: clone(canonical), cache: immutableCache,
    supportedFields: new Set(Object.keys(patch.after)) };
}
// The tool authenticates the renderer at HEAD:archive/engine.html, so the same
// engine bytes preserved in the working tree must be in the HEAD tree as well.
function commitEngineAtHead(root) {
  git(root, ['add', '--', 'archive/engine.html']);
  const tree = git(root, ['write-tree']).toString().trim();
  const commit = git(root, ['commit-tree', tree, '-m', 'Synthetic HEAD carrying the renderer']).toString().trim();
  fs.writeFileSync(path.join(root, '.git/HEAD'), commit + '\n');
}
function reseal(ctx, key, value) {
  const relative = ctx.patch.sourceReview.q5CompleteGivenApplication[key].path, bytes = serialized(value);
  write(relative, bytes);
  git(fixture, ['add', '--', relative]);
  const tree = git(fixture, ['write-tree']).toString().trim();
  const commit = git(fixture, ['commit-tree', tree, '-m', 'Synthetic invalid witness contract test']).toString().trim();
  const ref = makeRef(commit, relative, bytes);
  ctx.patch.sourceReview.q5CompleteGivenApplication[key] = ref;
  for (const list of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs]) {
    const at = list.findIndex(row => row.path === relative); assert(at >= 0); list[at] = { path: relative, sha256: ref.sha256 };
  }
  return ref;
}
before(() => {
  fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'm3-q5-native-contract-'));
  git(fixture, ['init', '--quiet']);
  const objects = git(REPO, ['rev-parse', '--git-path', 'objects']).toString().trim();
  fs.mkdirSync(path.join(fixture, '.git/objects/info'), { recursive: true });
  fs.writeFileSync(path.join(fixture, '.git/objects/info/alternates'), path.resolve(REPO, objects) + '\n');
  baseFiles = new Map(); witnessRefs = {};
  for (const [key, name] of [['applicationRef', 'application-basis-v1.json'], ['technicalRef', 'student-ui-technical-v1.json'],
    ['visualRef', 'student-ui-independent-v1.json']]) {
    const rel = DIR + name, bytes = gitBytes(CAPSULE, rel);
    witnessRefs[key] = makeRef(CAPSULE, rel, bytes); preserve(rel, bytes);
  }
  basis = JSON.parse(baseFiles.get(DIR + 'application-basis-v1.json'));
  technical = JSON.parse(baseFiles.get(DIR + 'student-ui-technical-v1.json'));
  visual = JSON.parse(baseFiles.get(DIR + 'student-ui-independent-v1.json'));
  const refs = [...technical.servedFiles, ...technical.mirroredAssets, technical.captureHelperRef, technical.fontLicenseRef,
    basis.oldAssetRef, basis.newAssetRef, basis.sourceAfterRef];
  for (const ref of refs) if (ref.path !== 'archive/data/question_metadata.json') preserve(ref.path, gitBytes(ref.commit, ref.path));
  const receipt = gitJson(BASE, RECEIPT + '.json'), binding = gitJson(BASE, RECEIPT + '.source-review-binding.json');
  issuedRecords = receipt.appliedRecords;
  request = clone(binding.requestSnapshot); request.requestId = 'm3-q5-complete-given-contract-test'; request.registryChanges = [];
  request.expectedSourceBlobSha1 = basis.sourceAfterRef.gitBlobSha1;
  const afterBank = bank(baseFiles.get(basis.sourceAfterRef.path)); question = afterBank[4];
  for (const patch of request.items) {
    const current = receipt.appliedRecords.find(row => row.questionUid === patch.questionUid);
    patch.before = Object.fromEntries(Object.keys(patch.after).map(k => [k, current[k] ?? null]));
    patch.after = { ...patch.before, sourceFingerprint: fullFp(afterBank[patch.sourceOrdinal - 1]), contentFingerprint: bodyFp(afterBank[patch.sourceOrdinal - 1]) };
    patch.identityBefore = { sourceFingerprint: current.sourceFingerprint };
  }
  const q5 = request.items.find(patch => patch.questionUid === UID);
  metadata = clone(receipt.appliedRecords.find(row => row.questionUid === UID)); final = { ...metadata, ...q5.after };
  q5.sourceReview.q5CompleteGivenApplication = { schemaVersion: SCHEMA, ...clone(witnessRefs) };
  for (const ref of Object.values(witnessRefs)) for (const list of [request.approval.evidenceRefs, q5.evidenceRefs]) list.push({ path: ref.path, sha256: ref.sha256 });
  for (const ref of request.approval.evidenceRefs) if (!baseFiles.has(ref.path)) preserve(ref.path, gitBytes(BASE, ref.path));
  // Preserve every old finalization asset byte without inspecting or printing
  // its content; the original finalizer itself authenticates this inventory.
  const originalFinalization = JSON.parse(baseFiles.get(basis.originalSourceReview.proposalFinalization.finalizationRef.path));
  for (const application of originalFinalization.applications) for (const ref of application.rendererAssets) {
    const bytes = gitBytes(BASE, ref.path);
    assert(sha(bytes) === ref.sha256 && blob(bytes) === ref.gitBlobSha1, 'unchanged finalization asset hash');
    preserve(ref.path, bytes);
  }
  preserve(basis.originalSourceReview.proposalFinalization.proposalSelections[0].documentRef.path,
    gitBytes(basis.nativeReviewRef.commit, basis.originalSourceReview.proposalFinalization.proposalSelections[0].documentRef.path));
  for (const change of binding.requestSnapshot.registryChanges) preserve(change.path, gitBytes(BASE, change.path));
  commitEngineAtHead(fixture);
  const review = gitJson(basis.nativeReviewRef.commit, basis.nativeReviewRef.path);
  const original = bank(gitBytes(basis.nativeReviewRef.commit, basis.sourceBeforeRef.path));
  native = { spec: clone(q5.sourceReview), review, sourceBlob: review.sourceAfterBlob, sourceSha256: review.sourceAfterSha256,
    committedBlob: review.sourceAfterBlob, reviewedBank: original, committedBank: clone(original),
    rows: new Map(review.items.map(row => [row.ordinal, row])), reviewer: review.author };
  canonical = { pt: new Map(), tpl: new Map(), cc: new Map(), bindings: new Map() };
  for (const def of basis.definitions) {
    const doc = gitJson(def.ref.commit, def.ref.path), mapping = { problemTypes: ['pt', 'problemTypeKey'], templates: ['tpl', 'templateKey'],
      concepts: ['cc', 'conceptKey'], bindings: ['bindings', null] }[def.collection];
    for (const row of doc[def.collection]) canonical[mapping[0]].set(mapping[1] ? row[mapping[1]] :
      stable([row.curriculum, row.standardCourse, row.standardUnitKey, row.subUnitKey ?? null, row.problemTypeKey]), row);
  }
});
after(() => { if (fixture) fs.rmSync(fixture, { recursive: true, force: true }); });

test('no opt-in leaves ordinary paths unchanged', () => assert.equal(validate({ patch: { sourceReview: {} } }), null));
test('actual immutable Q5 given/UI/current tuple yields only an image comparison view', () => {
  const ctx = context(), before = stable(ctx.question), out = validate(ctx);
  assert(stable(ctx.question) === before, 'caller question unchanged');
  assert(stable(out.normalizedQuestion) === stable(bank(gitBytes(basis.sourceBeforeRef.commit, basis.sourceBeforeRef.path))[4]), 'normalized whole question equals exact before');
  assert.equal(out.proof.outsideScopeCount, 24); assert.equal(out.proof.selectedAuthorityUidCount, 1);
  assert.equal(out.proof.ui.logicalCases, 2); assert.equal(out.proof.ui.screenshotArtifactCount, 2);
  assert.deepEqual(out.proof.normalizedFields, ['image']); assert.equal(out.proof.newNativeApprovals, 0);
  assert(!Object.hasOwn(out.normalizedPatch.sourceReview, 'q5CompleteGivenApplication'));
});
test('complete original Native and original v2 CC finalizer replay after the narrow view', () => {
  const proof = validateReviewedSourceReassessment(context());
  assert.equal(proof.q5CompleteGivenApplication.schemaVersion, SCHEMA);
  assert.equal(proof.proposalFinalization.schemaVersion, 'archive-native-proposal-finalization-v2');
  assert(proof.proposalFinalization.nativeProposalBindings.every(row => row.type === 'CC'));
  assert.equal(proof.q5CompleteGivenApplication.ui.logicalCases, 2);
});
test('ordinary companion Q12 keeps its original Native authority without the Q5 option', () => {
  const c = context(), patch = c.request.items.find(item => item.sourceOrdinal === 12);
  const metadata = clone(issuedRecords.find(row => row.questionUid === patch.questionUid));
  const question = bank(baseFiles.get(basis.sourceAfterRef.path))[11];
  const proof = validateReviewedSourceReassessment({ ...c, patch, metadata, question, final: { ...metadata, ...patch.after } });
  assert.equal(proof.questionUid, patch.questionUid); assert.equal(proof.sourceOrdinal, 12);
  assert(!Object.hasOwn(proof, 'q5CompleteGivenApplication')); assert(!Object.hasOwn(proof, 'proposalFinalization'));
});
test('actual old Q5 cursor is sealed as one missing-course historical question after given and UI checks', () => {
  const c = context(), proof = validateReviewedSourceReassessment(c).q5CompleteGivenApplication;
  const binding = proof.oldCursorCourseBinding;
  const oldBank = bank(gitBytes(binding.sourceRef.commit, binding.sourceRef.path));
  assert.equal(oldBank.length, 25); assert.equal(binding.sourceOrdinal, 5); assert.equal(binding.questionUid, UID);
  assert.equal(binding.sourceRef.commit, '8c27587b8e7bbab6d35e0bc1d95d0c2a1beb63cd');
  assert(!Object.hasOwn(oldBank[4], 'courseKey')); assert.equal(binding.issuedValue, 'M3-2');
  assert.equal(sha(stable(oldBank[4])), binding.wholeQuestionSha256);
  const prior = bank(gitBytes(basis.sourceBeforeRef.commit, basis.sourceBeforeRef.path))[4];
  assert(stable({ ...oldBank[4], courseKey: binding.issuedValue }) === stable(prior), 'only issued course differs');
  for (const altered of [{ ...oldBank[4], courseKey: null }, { ...oldBank[4], courseKey: 'M2-2' },
    { ...oldBank[4], syntheticStudentDelta: true }, oldBank[11]])
    assert.notEqual(sha(stable(altered)), binding.wholeQuestionSha256, 'other cursor cannot match the authenticated whole question');
});
test('Q5 image change is rejected through the ordinary path without its explicit option', () => {
  const c = context(); delete c.patch.sourceReview.q5CompleteGivenApplication;
  assert.throws(() => validateReviewedSourceReassessment(c), /student payload/);
});

const scopeAttacks = [
  ['FULL scope', c => c.request.scope = 'FULL'], ['BASIC approval', c => c.request.approval.type = 'BASIC'],
  ['unreviewed metadata', c => c.request.approval.metadataReviewed = false], ['source-only subtype', c => c.request.approval.sourceRebind = {}],
  ['identity-only registration', c => c.request.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'], ['generic rebind', c => c.patch.rebind = {}],
  ['other source', c => c.request.sourceArchiveFile += '.other'], ['wrong bank denominator', c => c.request.expectedQuestionCount = 24],
  ['new registry ADD', c => c.request.registryChanges.push({ before: null })], ['other UID', c => c.patch.questionUid = 'qid_other'],
  ['other ordinal', c => c.patch.sourceOrdinal = 6], ['missing full fingerprint', c => delete c.patch.after.sourceFingerprint],
  ['missing body fingerprint', c => delete c.patch.after.contentFingerprint], ['new outside item', c => c.request.items.push(clone(c.patch))],
  ['Q12 missing', c => c.request.items.pop()], ['Q12 arbitrary opt-in', c => c.request.items[1].sourceReview.q5CompleteGivenApplication = {}],
  ['Q12 nonordinary review', c => c.request.items[1].sourceReview.rendererProof = {}], ['original CC finalizer removed', c => delete c.patch.sourceReview.proposalFinalization],
  ['mixed renderer exception', c => c.patch.sourceReview.rendererProof = {}], ['unexpected option key', c => c.patch.sourceReview.q5CompleteGivenApplication.extra = true],
];
for (const [name, mutate] of scopeAttacks) test('rejects ' + name, () => { const c = context(); mutate(c); assert.throws(() => validate(c)); });
test('cannot reseal the fixed basis into a different authority', () => {
  const c = context(), altered = clone(basis); altered.activeTuple.crossConceptKeys = []; reseal(c, 'applicationRef', altered);
  assert.throws(() => validate(c), /FROZEN_APPLICATION_BASIS/); restore();
});
for (const [name, mutate] of [
  ['duplicate item witness', c => c.patch.evidenceRefs.push(clone(c.patch.evidenceRefs.at(-1)))],
  ['missing approval witness', c => c.request.approval.evidenceRefs.pop()],
  ['ref traversal', c => c.patch.sourceReview.q5CompleteGivenApplication.applicationRef.path = '../application-basis-v1.json'],
  ['ref extra key', c => c.patch.sourceReview.q5CompleteGivenApplication.applicationRef.extra = true],
  ['wrong immutable commit', c => c.patch.sourceReview.q5CompleteGivenApplication.applicationRef.commit = '0'.repeat(40)],
  ['changed original row', c => c.row.after.conditionKeys = ['SYNTHETIC']],
  ['omitted complete Native row', c => c.native.rows.delete(25)],
  ['changed complete Native document', c => c.native.review.author = 'synthetic-author'],
  ['changed nonselected native question', c => c.native.reviewedBank[0].image = 'synthetic-other'],
  ['arbitrary current selected field', c => c.question.syntheticAddedField = true],
  ['wrong current source CAS', c => c.request.expectedSourceBlobSha1 = '1'.repeat(40)],
  ['changed ACTIVE binding', c => c.canonicalAfter.bindings.clear()],
  ['inactive existing PT', c => c.canonicalAfter.pt.get(basis.activeTuple.problemTypeKey).status = 'PENDING'],
  ['different final template', c => c.final.templateKey = 'SYNTHETIC_OTHER'],
  ['different final course', c => c.final.courseKey = 'M2-2'],
]) test('rejects ' + name, () => { const c = context(); mutate(c); assert.throws(() => validate(c)); });

const uiAttacks = [
  ['technical FAIL', d => d.status = 'FAIL'], ['standalone rendering', d => d.executionOwner = 'STATIC_RENDER'],
  ['opened solutions', d => d.solutionsOpened = true], ['source overlay', d => d.sourceOverlayCount = 1],
  ['missing viewport', d => d.results.pop()], ['extra logical case', d => d.results.push(clone(d.results[0]))],
  ['different actual source', d => d.items[0].sourceRef.gitBlobSha1 = '0'.repeat(40)],
  ['different executed checker', d => d.checkerRef.sha256 = '0'.repeat(64)],
  ['unloaded fonts', d => d.results[0].technical.fontReadiness.status = 'loading'],
  ['font response removed', d => d.studentFontResources.pop()],
  ['unexpected external font', d => d.externalFontResources.push({})],
  ['wrapper role missing', d => d.results[0].capture.equalSlotRoles.contentMath = 0],
  ['generic direct-child substitution', d => d.results[0].capture.visibleChildren = 5],
  ['coverage gap', d => d.results[0].capture.tiles[0].relativeInterval[0] = 1],
  ['toolbar obstruction', d => d.results[0].capture.tiles[0].obstructionsIntersectingClip = 1],
  ['foreign pixel hits', d => d.results[0].capture.tiles[0].foreignContentHits = 1],
  ['changed DOM', d => d.results[0].capture.tiles[0].domSha256 = '0'.repeat(64)],
  ['injected CSS', d => d.results[0].capture.cssWrites = 1],
  ['resized viewport', d => d.results[0].capture.viewportChanges = 1],
  ['composite screenshot', d => d.results[0].capture.compositeImageCreated = true],
  ['missing original PNG', d => d.screenshotArtifacts.pop()],
  ['unknown capture field', d => d.results[0].capture.syntheticExtra = true],
];
for (const [name, mutate] of uiAttacks) test('resealed technical evidence rejects ' + name, () => {
  const c = context(), altered = clone(technical), review = clone(visual); mutate(altered);
  const ref = reseal(c, 'technicalRef', altered); review.technicalRef.sha256 = ref.sha256; reseal(c, 'visualRef', review);
  assert.throws(() => validate(c)); restore();
});
for (const [name, mutate] of [
  ['producer self-review', d => d.reviewer = d.producerOwner], ['different reviewer', d => d.reviewer = 'synthetic-other'],
  ['missing observed PNG', d => d.records[0].screenshots = []], ['different observed PNG', d => d.records[0].screenshots[0].sha256 = '0'.repeat(64)],
  ['incomplete review', d => d.records[0].completeProblemCoverage = false], ['new mathematical approval', d => d.newMathematicalQa = true],
  ['new Native approval', d => d.newNativeApprovals = 1], ['unbound technical', d => d.technicalRef.sha256 = '0'.repeat(64)],
]) test('resealed independent review rejects ' + name, () => {
  const c = context(), altered = clone(visual); mutate(altered); reseal(c, 'visualRef', altered); assert.throws(() => validate(c)); restore();
});
test('live evidence mutation is rejected even with populated immutable cache', () => {
  const c = context(); validate(c); const p = witnessRefs.visualRef.path; write(p, Buffer.concat([baseFiles.get(p), Buffer.from(' ')]));
  assert.throws(() => validate(c), /LIVE_/); restore();
});
for (const key of ['oldAssetRef', 'newAssetRef', 'sourceAfterRef']) test('live ' + key + ' cannot drift', () => {
  const c = context(), p = basis[key].path; write(p, Buffer.concat([baseFiles.get(p), Buffer.from(' ')]));
  assert.throws(() => validate(c), /LIVE_/); restore();
});
test('original full Native/CC replay still rejects an unauthorized final value', () => {
  const c = context(); c.final.difficultyBucket = 99; c.patch.after.difficultyBucket = 99;
  assert.throws(() => validateReviewedSourceReassessment(c), /approved|reviewed after/);
});
for (const seed of ['window', 'console']) test('VM rejects host constructor access via ' + seed, () => {
  const source = `window.questionBank=[{id:1}]; ${seed}.constructor.constructor('return process')();`;
  assert.throws(() => bank(Buffer.from(source)));
});
for (const [name, source] of [
  ['accessor', 'window.questionBank=[{get id(){return 1}}]'], ['function', 'window.questionBank=[{id(){}}]'],
  ['sparse array', 'window.questionBank=[,{id:2}]'], ['custom prototype', 'window.questionBank=[Object.create({id:1})]'],
]) test('VM rejects non-data ' + name, () => assert.throws(() => bank(Buffer.from(source))));
test('durable binding reserves the Q5 opt-in and rejects a deleted typed proof', () => {
  const c = context(); assert(reviewedSourceBindingItems(c.request).some(p => p.questionUid === UID));
  const repair = { questionUid: UID, sourceOrdinal: 5, sourceReview: { schemaVersion: 'archive-reviewed-source-reassessment-v1',
    questionUid: UID, sourceOrdinal: 5, proposalFinalization: {} } };
  assert.throws(() => buildReviewedSourceBinding({ request: c.request, requestId: c.request.requestId,
    requestSha256: sha(stable(c.request)), sourceArchiveFile: c.request.sourceArchiveFile,
    sourceBlobSha1: c.request.expectedSourceBlobSha1, sourceRawSha256: basis.sourceAfterRef.sha256,
    scope: c.request.scope, expectedQuestionCount: 25, partialUidCount: 2, fingerprintRepairs: [repair] }), /source-review proof/);
});
test('durable sidecar seals the real Q5 typed proof and its unmodified original CC proof', () => {
  const c = context(), sourceReview = validateReviewedSourceReassessment(c);
  const repair = { questionUid: UID, sourceOrdinal: 5, sourceReview };
  const args = { request: c.request, requestId: c.request.requestId, requestSha256: sha(stable(c.request)),
    sourceArchiveFile: c.request.sourceArchiveFile, sourceBlobSha1: c.request.expectedSourceBlobSha1,
    sourceRawSha256: basis.sourceAfterRef.sha256, scope: c.request.scope, expectedQuestionCount: 25,
    partialUidCount: 2, fingerprintRepairs: [repair] };
  const bound = buildReviewedSourceBinding(args);
  assert.equal(bound.sourceReviewUidCount, 1); assert.equal(bound.partialUidCount, 2);
  assert.equal(bound.records[0].sourceReviewSha256, sha(stable(sourceReview)));
  for (const field of ['q5CompleteGivenApplication', 'proposalFinalization']) {
    const altered = structuredClone(args); delete altered.fingerprintRepairs[0].sourceReview[field];
    assert.throws(() => buildReviewedSourceBinding(altered), /source-review proof/);
  }
});

// These regressions use the official writer to issue the real immutable Q5/Q12
// authority in a bounded disposable bank. The other 23 ledger rows are
// deliberately unreviewed synthetic rows; no full-global-data claim is made.
let issuedRoot, issuedReceipt, issuedIdentity, issuedRuntime, issuedBank, issuedBytes, issuedRegistry;
const CURRENT = '50d001f8ab5a9a4dbfc749edb30916fb15c8dc0a';
const OLD_BINDING = RECEIPT + '.source-review-binding.json';
after(() => { if (issuedRoot) fs.rmSync(issuedRoot, { recursive: true, force: true }); });
function putIssued(relative, bytes) {
  const full = path.join(issuedRoot, relative); fs.mkdirSync(path.dirname(full), { recursive: true });
  if (fs.existsSync(full)) fs.unlinkSync(full);
  fs.writeFileSync(full, bytes);
}
function ensureIssued() {
  if (issuedReceipt) return;
  restore(); issuedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'm3-q5-issued-ancestor-'));
  git(issuedRoot, ['init', '--quiet']);
  const objects = git(REPO, ['rev-parse', '--git-path', 'objects']).toString().trim();
  fs.mkdirSync(path.join(issuedRoot, '.git/objects/info'), { recursive: true });
  fs.writeFileSync(path.join(issuedRoot, '.git/objects/info/alternates'), path.resolve(REPO, objects) + '\n');
  for (const p of baseFiles.keys()) {
    const dest = path.join(issuedRoot, p); fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.linkSync(path.join(fixture, p), dest);
  }
  commitEngineAtHead(issuedRoot);
  for (const p of [RECEIPT + '.json', OLD_BINDING]) putIssued(p, gitBytes(CURRENT, p));
  const indexPath = 'archive/data/meta-foundation/canonical/registry_index.json';
  const index = gitJson(CURRENT, indexPath);
  for (const p of new Set([indexPath, 'archive/data/meta-foundation/canonical/metadata_rules.json',
    'archive/data/master_tables/js_archive_tag_master.json',
    ...index.canonicalSources.map(row => row.path), ...index.compiledArtifacts.map(row => row.path)]))
    putIssued(p, gitBytes(CURRENT, p));
  const prior = gitJson(CURRENT, RECEIPT + '.json');
  issuedBytes = baseFiles.get(basis.sourceAfterRef.path); issuedBank = bank(issuedBytes);
  const realMd = new Map(prior.appliedRecords.map(row => [row.sourceOrdinal, row]));
  const realIds = new Map(prior.appliedIdentityRecords.map(row => [row.sourceOrdinal, row]));
  const records = issuedBank.map((q, i) => clone(realMd.get(i + 1) || {
    questionUid: native.rows.get(i + 1).questionUid, sourceArchiveFile: request.sourceArchiveFile, sourceOrdinal: i + 1,
    sourceQuestionNo: String(i + 1), sourceFingerprint: fullFp(q), contentFingerprint: bodyFp(q),
    metadataStatus: 'unreviewed', reviewStatus: 'pending', defaultSelectable: false
  }));
  const identities = records.map(row => clone(realIds.get(row.sourceOrdinal) || {
    questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal,
    sourceQuestionNo: row.sourceQuestionNo, sourceFingerprint: row.sourceFingerprint, status: 'VERIFIED'
  }));
  putIssued('archive/data/question_metadata.json', serialized({ schemaVersion: 'bounded-test-metadata-v1', records }));
  putIssued('archive/data/question_identity_map.json', serialized({ schemaVersion: 'bounded-test-identity-v1', records: identities }));
  const runtimePath = 'archive/data/meta-foundation/runtime/middle-geometry-v1.json';
  const rt = gitJson(CURRENT, runtimePath); rt.records = clone(prior.runtimeRecords); putIssued(runtimePath, serialized(rt));
  const req = clone(request); req.requestId = 'm3-q5-issued-ancestor-contract-test';
  const result = registerReviewedExamV2({ root: issuedRoot, request: req, write: true });
  assert.equal(result.status, 'PASS'); assert.equal(result.replay, false);
  issuedReceipt = JSON.parse(fs.readFileSync(path.join(issuedRoot,
    'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/' + req.requestId + '.json')));
  issuedIdentity = JSON.parse(fs.readFileSync(path.join(issuedRoot, 'archive/data/question_identity_map.json')));
  issuedRuntime = JSON.parse(fs.readFileSync(path.join(issuedRoot, runtimePath)));
  issuedRegistry = loadActiveMetaRegistry(issuedRoot); assert.equal(issuedRegistry.status, 'ACTIVE');
}
function issuedContext() {
  ensureIssued(); const receipt = clone(issuedReceipt);
  const current = receipt.appliedRecords.find(row => row.questionUid === UID);
  const identity = receipt.appliedIdentityRecords.find(row => row.questionUid === UID);
  const runtimeRecord = receipt.runtimeRecords.find(row => row.questionUid === UID);
  return { receipt, current, identity, question: clone(issuedBank[4]), ordinal: 5, registry: issuedRegistry,
    nativeSource: { root: issuedRoot, bytes: issuedBytes, blobSha1: blob(issuedBytes), bank: clone(issuedBank),
      runtimeRecord, runtimeStatus: issuedRuntime.status, identityMap: clone(issuedIdentity) } };
}
function verifyIssued(c) { return validateNativeReviewedSourceReuse(c.receipt, c.nativeSource, c.question, c.identity, 5, c.current, c.registry); }
test('official issued Q5 replays its exact original CC typed ancestor before old-cursor reuse', () => {
  const c = issuedContext(); assert.equal(verifyIssued(c), true);
  const proof = c.receipt.fingerprintRepairs.find(row => row.questionUid === UID).sourceReview.q5CompleteGivenApplication;
  const old = bank(gitBytes(proof.oldCursorCourseBinding.sourceRef.commit, proof.oldCursorCourseBinding.sourceRef.path))[4];
  assert.equal(nativeReviewedM3Q5CompleteGivenRebind(c.receipt,c.nativeSource,old,c.question,c.identity,5,c.current,c.registry), true);
});
for (const p of [RECEIPT + '.json', OLD_BINDING]) {
  test('issued Q5 rejects a missing immutable ancestor ' + path.basename(p), () => {
    const c = issuedContext(), raw = fs.readFileSync(path.join(issuedRoot,p)); fs.unlinkSync(path.join(issuedRoot,p));
    try { assert.throws(() => verifyIssued(c)); } finally { putIssued(p,raw); }
  });
  test('issued Q5 rejects drifted live ancestor ' + path.basename(p), () => {
    const c = issuedContext(), raw = fs.readFileSync(path.join(issuedRoot,p)); putIssued(p,Buffer.concat([raw,Buffer.from(' ')]));
    try { assert.throws(() => verifyIssued(c), /Q5 original typed ancestor raw\/live/); } finally { putIssued(p,raw); }
  });
}
test('issued Q5 cannot delete the inherited CC marker from all new row views', () => {
  const c = issuedContext();
  for (const row of [c.current,c.nativeSource.runtimeRecord]) row.approvalEvidence = row.approvalEvidence.filter(p => p !== OLD_BINDING);
  assert.throws(() => verifyIssued(c), /Q5 original typed ancestor obligation/);
});
test('issued Q5 cannot smuggle an unrelated typed ancestor into the wanted set', () => {
  const c = issuedContext(), marker = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/synthetic-other.source-review-binding.json';
  for (const row of [c.current,c.nativeSource.runtimeRecord]) row.approvalEvidence.push(marker);
  assert.throws(() => verifyIssued(c), /Q5 original typed ancestor obligation/);
});
test('issued Q5 cannot change an unrelated metadata or runtime field', () => {
  const c = issuedContext(); c.current.syntheticApprovalDelta = true; c.nativeSource.runtimeRecord.syntheticApprovalDelta = true;
  assert.throws(() => verifyIssued(c), /Q5 original typed ancestor changed/);
});
test('issued Q5 cannot change its ordinary Q12 companion identity', () => {
  const c = issuedContext(), q12 = c.receipt.appliedIdentityRecords.find(row => row.sourceOrdinal === 12);
  q12.syntheticIdentityDelta = true;
  assert.throws(() => verifyIssued(c), /Q5 original typed ancestor changed/);
});
test('issued Q5 still requires the original Git ancestor even when live bytes and immutable cache exist', () => {
  const c = issuedContext(); assert.equal(verifyIssued(c), true);
  const alt = path.join(issuedRoot,'.git/objects/info/alternates'), raw = fs.readFileSync(alt); fs.unlinkSync(alt);
  try { assert.throws(() => verifyIssued(c)); } finally { fs.writeFileSync(alt,raw); }
});

// The captured global SVG index also contains other exams. The original UI
// authority remains fixed while its exact consumed asset lookup is preserved.
const svgIndexPath = 'archive/data/svg-accessibility-index.js';
const svgIndexPrefix = "(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(";
const svgIndexSuffix = ");\n}(typeof window !== 'undefined' ? window : globalThis));\n";
const svgIndexDoc = raw => JSON.parse(raw.toString().slice(svgIndexPrefix.length, -svgIndexSuffix.length));
const svgIndexBytes = doc => Buffer.from(svgIndexPrefix + JSON.stringify(doc) + svgIndexSuffix);
const capturedAssetRefs = () => [...technical.servedFiles, ...technical.mirroredAssets]
  .filter(ref => ref.path.startsWith('archive/assets/'));
const svgContinuity = (await import('../tools/4slot/existing-vector-svg-index-continuity.cjs')).default;
function withSvgIndex(edit, check) {
  restore(); const raw = baseFiles.get(svgIndexPath), doc = svgIndexDoc(raw);
  try { write(svgIndexPath, edit(doc, raw)); check(); } finally { restore(); }
}

test('actual later main global SVG index preserves the issued Q5 complete-given proof', () => {
  restore(); const before = validate(context());
  const current = gitBytes('debf134d0e4807c1d8f04264a5dd9a707b9d2cb9', svgIndexPath);
  assert.notEqual(sha(current), sha(baseFiles.get(svgIndexPath)));
  assert.equal(svgContinuity.selectEntries(svgContinuity.parseIndex(current), capturedAssetRefs()).length, 1);
  withSvgIndex(() => current, () => assert.deepEqual(validate(context()), before));
});

test('foreign generated SVG entries preserve Q5 but its consumed record cannot change', () => {
  restore(); const before = validate(context());
  withSvgIndex(doc => {
    const row = clone(svgContinuity.selectEntries(doc, capturedAssetRefs())[0]);
    row.assetRef = 'assets/images/public-unrelated-for-q5/diagram.svg';
    row.sourceExamRef = 'public-unrelated-for-q5'; row.sourceQid = 'public-unrelated';
    doc.records.push(row); return svgIndexBytes(doc);
  }, () => assert.deepEqual(validate(context()), before));
  withSvgIndex(doc => {
    const row = svgContinuity.selectEntries(doc, capturedAssetRefs())[0];
    row.descriptionKo = 'synthetic changed consumed description'; return svgIndexBytes(doc);
  }, () => assert.throws(() => validate(context()), /SVG_INDEX_CONSUMED_FOOTPRINT_DRIFT/));
});

test('removing or adding a consumed SVG role remains a closed Q5 failure', () => {
  for (const mode of ['remove', 'add-role']) withSvgIndex(doc => {
    const row = svgContinuity.selectEntries(doc, capturedAssetRefs())[0];
    if (mode === 'remove') doc.records = doc.records.filter(value => value !== row);
    else doc.records.push({ ...row, visualRole: row.visualRole === 'problem' ? 'solution' : 'problem' });
    return svgIndexBytes(doc);
  }, () => assert.throws(() => validate(context()), /SVG_INDEX_CONSUMED_FOOTPRINT_DRIFT/));
});

test('normalized duplicate SVG roles outside Q5 still fail the whole runtime lookup', () => {
  withSvgIndex(doc => {
    const row = clone(svgContinuity.selectEntries(doc, capturedAssetRefs())[0]);
    doc.records.push({ ...row, assetRef: 'assets/images/public-unrelated-for-q5/diagram.svg' },
      { ...row, assetRef: '/archive/assets/images/public-unrelated-for-q5/diagram.svg' });
    return svgIndexBytes(doc);
  }, () => assert.throws(() => validate(context()), /RUNTIME_LOOKUP_REJECTED/));
});

test('Q5 rejects executable SVG index suffixes without running them', () => {
  withSvgIndex((_doc, raw) => Buffer.concat([raw, Buffer.from('globalThis.__q5SvgExecuted = true;')]),
    () => assert.throws(() => validate(context()), /WRAPPER/));
  assert.equal(globalThis.__q5SvgExecuted, undefined);
});

test('missing current SVG index cannot reuse a populated immutable Q5 cache', () => {
  restore(); validate(context());
  try { fs.unlinkSync(path.join(fixture, svgIndexPath));
    assert.throws(() => validate(context()), /LIVE_SVG_INDEX_REQUIRED/);
  } finally { restore(); }
});

test('a changed exact consumed asset is still rejected with a later global SVG index', () => {
  withSvgIndex(() => gitBytes('debf134d0e4807c1d8f04264a5dd9a707b9d2cb9', svgIndexPath), () => {
    const target = basis.newAssetRef.path; write(target, Buffer.concat([baseFiles.get(target), Buffer.from('changed')]));
    assert.throws(() => validate(context()), /LIVE_FILE_MISSING_OR_SIZE_DRIFT|LIVE_RAW_DRIFT/);
  });
});

for (const [label, ordinal, both] of [
  ['Q5 metadata and runtime', 5, true],
  ['Q12 companion metadata and runtime', 12, true],
  ['Q5 runtime only', 5, false],
]) {
  test('issued ' + label + ' cannot claim an unissued canonical pack version', () => {
    const c = issuedContext();
    const metadata = c.receipt.appliedRecords.find(row => row.sourceOrdinal === ordinal);
    const runtime = c.receipt.runtimeRecords.find(row => row.sourceOrdinal === ordinal);
    const oldVersion = metadata.metaFoundationPackVersion, claimedVersion = '999.0.0';
    assert.notEqual(oldVersion, claimedVersion);
    runtime.metaFoundationPackVersion = claimedVersion;
    if (both) metadata.metaFoundationPackVersion = claimedVersion;
    for (const row of both ? [metadata, runtime] : [runtime])
      row.metadataRevision = row.metadataRevision.replace('@' + oldVersion + ':', '@' + claimedVersion + ':');
    assert.throws(() => verifyIssued(c), /Q5 original typed ancestor current ACTIVE pack version differs/);
  });
}
