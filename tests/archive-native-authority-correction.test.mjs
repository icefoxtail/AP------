import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { AUTHORITY_CORRECTION_MODE, AUTHORITY_CORRECTION_SCHEMA, AUTHORITY_RESTORABLE_FIELDS,
  authorityHoldSealPath, registerNativeAuthorityCorrection, nativeAuthorityHoldState } from '../archive/tools/meta-foundation/native-authority-correction.mjs';
import { planQuestion, nativeReviewReceipt, loadBank } from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import { selectNativeRequests, applyNativeRequests } from '../tools/ci/archive-pr-native-preview.mjs';

const META = 'archive/data/question_metadata.json', IDENTITY = 'archive/data/question_identity_map.json';
const RT = 'archive/data/meta-foundation/runtime/middle2-v1.json';
const RP = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const source = 'original/middle/m2/2final/fixture.js';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const stable = v => JSON.stringify(v, (_, x) => x && !Array.isArray(x) && typeof x === 'object'
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const hash = v => sha(stable(v)), json = v => JSON.stringify(v, null, 2) + '\n';
const uid = n => 'qid_v1_' + sha(source + '#' + n);
const read = (f, p) => JSON.parse(fs.readFileSync(path.join(f.root, p)));
function put(f, p, v) { const full = path.join(f.root, p); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, typeof v === 'string' ? v : json(v)); }
function git(f, ...args) { return execFileSync('git', args, { cwd: f.root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function commit(f) { git(f, 'add', '.'); git(f, '-c', 'user.name=Authority contract test', '-c', 'user.email=authority-test@example.invalid', 'commit', '-qm', 'fixture'); return git(f, 'rev-parse', 'HEAD'); }
function ref(f, p) { return { path: p, sha256: sha(fs.readFileSync(path.join(f.root, p))) }; }
function fixture(t, options = {}) {
  const f = { root: fs.mkdtempSync(path.join(os.tmpdir(), 'archive-authority-correction-')) };
  t.after(() => fs.rmSync(f.root, { recursive: true, force: true })); git(f, 'init', '-q');
  const sourceRaw = 'window.questionBank=' + JSON.stringify([{ id: '1', content: 'fixture one', choices: ['a', 'b'], answer: 'a', solution: 'fixture', difficultyBucket: 2 },
    { id: '2', content: 'untouched', difficultyBucket: 4 }]) + ';\n';
  put(f, 'archive/exams/' + source, sourceRaw);
  const base = n => ({ questionUid: uid(n), sourceArchiveFile: source, sourceOrdinal: n, sourceQuestionNo: String(n),
    sourceFingerprint: sha('full' + n), contentFingerprint: sha('content' + n),
    difficultyBucket: n === 1 ? 2 : 4, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
    standardUnitKey: 'M2-06', subUnitKey: 'M2-06-PARALLEL_LENGTH_RATIO', problemTypeKey: 'PT_TRIANGLE_SIMILARITY',
    templateKey: 'TPL_TRIANGLE_SIMILARITY_APPLICATION', metadataStatus: 'registration_pending_semantic_review', reviewStatus: 'review_required',
    fieldStatus: { standardUnit: 'approved_source', subUnit: 'approved_source', problemType: 'manual_review_pending', template: 'manual_review_pending', difficulty: 'source_unreviewed' },
    approvalEvidence: ['archive/tools/intelligence/sync-pending-question-metadata-v1.mjs'], unrelatedProducerField: 'keep' });
  f.prior = base(1); if (options.priorApproved) Object.assign(f.prior, { metadataApprovalType: 'FINAL_QA', metadataStatus: 'approved_semantic_review', reviewStatus: 'reviewed_pass' });
  const outside = { ...base(2), metadataApprovalType: 'FINAL_QA', metadataStatus: 'approved_semantic_review', reviewStatus: 'reviewed_pass' };
  f.identity = [1, 2].map(n => ({ questionUid: uid(n), sourceArchiveFile: source, sourceOrdinal: n, sourceQuestionNo: String(n), sourceFingerprint: sha('full' + n) }));
  put(f, META, { records: [f.prior, outside], reviewedPassCount: 1, counts: { semanticallyReviewed: 1, explicitProblemTypeHolds: 1 } }); put(f, IDENTITY, { records: f.identity });
  const outsideRuntime = { questionUid: uid(2), sourceArchiveFile: source, sourceOrdinal: 2, problemTypeKey: 'PT_TRIANGLE_SIMILARITY', metaFoundationPackId: 'MIDDLE2', runtimeSelectable: true };
  put(f, RT, { status: 'ACTIVE', packId: 'MIDDLE2', records: [outsideRuntime, ...(options.priorRuntime ? [{ ...outsideRuntime, questionUid: uid(1), sourceOrdinal: 1 }] : [])], counts: { records: options.priorRuntime ? 2 : 1 } });
  f.nativePath = '.archive-meta-register/evidence/native.json';
  put(f, f.nativePath, { items: [{ questionUid: uid(1), ordinal: 1, after: options.nativeAfter ? { problemTypeKey: 'PT_TRIANGLE_SIMILARITY', templateKey: 'TPL_TRIANGLE_SIMILARITY_APPLICATION' } : {},
    activeDefinitionMatch: { projectionApplied: false } }] });
  f.priorCommit = commit(f);
  f.originalRequest = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId: 'old-final', sourceArchiveFile: source,
    approval: { type: 'FINAL_QA', metadataReviewed: true }, items: [{ questionUid: uid(1), sourceOrdinal: 1, before: {}, after: {} }] };
  f.originalRequestPath = '.archive-meta-register/inbox/old-final.json'; put(f, f.originalRequestPath, f.originalRequest); f.preCommit = commit(f);
  f.registered = { ...f.prior, metadataApprovalType: 'FINAL_QA', metadataStatus: 'approved_semantic_review', reviewStatus: 'reviewed_pass',
    metadataRevision: 'registered-version', standardUnit: '등록값', L1: '등록값', L3: 'new label',
    fieldStatus: { problemType: 'approved_final_qa', template: 'approved_final_qa', difficulty: 'approved_final_qa' },
    level: '중', approvalEvidence: [...f.prior.approvalEvidence, RP + 'old-final.json'] };
  f.runtime = { ...outsideRuntime, questionUid: uid(1), sourceOrdinal: 1, approvalEvidence: [RP + 'old-final.json'] };
  const md = read(f, META); md.records[0] = f.registered; put(f, META, md);
  const rt = read(f, RT); rt.records = [outsideRuntime, f.runtime]; put(f, RT, rt);
  f.originalReceipt = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId: 'old-final', requestSha256: hash(f.originalRequest),
    sourceArchiveFile: source, sourceBlobSha1: blob(Buffer.from(sourceRaw)), sourceRawSha256: sha(sourceRaw),
    metadataRegistrationStatus: 'REGISTERED', approval: { type: 'FINAL_QA' }, fingerprintRepairs: [],
    appliedRecords: [f.registered], runtimeRecords: [f.runtime], appliedIdentityRecords: [f.identity[0]] };
  if (Object.hasOwn(options, 'originalEvidenceRefs')) f.originalReceipt.approval.evidenceRefs =
    typeof options.originalEvidenceRefs === 'function' ? options.originalEvidenceRefs(f) : options.originalEvidenceRefs;
  put(f, RP + 'old-final.json', f.originalReceipt); fs.rmSync(path.join(f.root, f.originalRequestPath)); f.actualCommit = commit(f);
  f.withheldPath = '.archive-meta-register/evidence/withheld.json';
  const nativeRef = ref(f, f.nativePath), reasonCode = 'UNAPPLIED_DEFINITION_CANDIDATE_NOT_GENERIC_FINAL_QA_AUTHORITY';
  put(f, f.withheldPath, { schemaVersion: 'm2s2-binding68-authority-withheld11-v1', withheldRows: [{ questionUid: uid(1), sourceOrdinal: 1, reasonCode, native: { sha256: nativeRef.sha256 } }] });
  f.reviewPath = '.archive-meta-register/evidence/authority-review.json';
  f.review = { schemaVersion: 'archive-native-authority-withdrawal-review-v1', decision: 'WITHDRAW_UNSUPPORTED_FINAL_QA', reviewedBy: 'independent-root',
    registeredAtCommit: f.actualCommit, preRegistrationCommit: f.preCommit, priorStateCommit: f.priorCommit,
    newMetadataApprovals: 0, sourceHold: false, withheldScopeRef: ref(f, f.withheldPath),
    items: [{ questionUid: uid(1), sourceArchiveFile: source, sourceOrdinal: 1, reasonCode, nativeRef }] };
  put(f, f.reviewPath, f.review); f.originalRequestCopy = '.archive-meta-register/evidence/old-final-request.json'; put(f, f.originalRequestCopy, f.originalRequest);
  f.request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', registrationMode: AUTHORITY_CORRECTION_MODE,
    requestId: 'withdraw-final', examUid: 'fixture', sourceArchiveFile: source, scope: 'PARTIAL_UIDS', expectedQuestionCount: 2,
    expectedSourceBlobSha1: blob(Buffer.from(sourceRaw)), registryChanges: [],
    approval: { type: 'AUTHORITY_CORRECTION', metadataReviewed: false, approvedBy: 'independent-root', evidenceRefs: [ref(f, f.reviewPath), ref(f, f.withheldPath), nativeRef, ref(f, RP + 'old-final.json'), ref(f, f.originalRequestCopy)] },
    authorityCorrection: { schemaVersion: AUTHORITY_CORRECTION_SCHEMA, operation: 'WITHDRAW_GENERIC_FINAL_QA_TO_PRIOR_PENDING',
      registeredAtCommit: f.actualCommit, preRegistrationCommit: f.preCommit, priorStateCommit: f.priorCommit,
      priorMetadataGitBlobSha1: git(f, 'rev-parse', f.priorCommit + ':' + META), reviewRef: ref(f, f.reviewPath),
      originalReceiptRef: ref(f, RP + 'old-final.json'), originalRequestPath: f.originalRequestPath,
      registeredRequestRef: ref(f, f.originalRequestCopy), nativeRef },
    items: [{ questionUid: uid(1), sourceOrdinal: 1, before: { metadataSha256: hash(f.registered), identitySha256: hash(f.identity[0]), runtimeSha256: hash(f.runtime) },
      priorMetadataRecordSha256: hash(f.prior), after: {}, evidenceRefs: [ref(f, f.reviewPath)] }] };
  f.run = write => registerNativeAuthorityCorrection({ root: f.root, request: f.request, write });
  f.state = () => nativeAuthorityHoldState({ root: f.root, current: read(f, META).records[0], identity: f.identity[0], source, ordinal: 1 });
  return f;
}

test('withdrawal dry/write/replay restores finite prior semantics while preserving source, identity, difficulty and outside rows', t => {
  const f = fixture(t), beforeMeta = read(f, META), beforeRuntime = read(f, RT);
  const protectedFiles = [IDENTITY, 'archive/exams/' + source, RP + 'old-final.json', f.originalRequestCopy].map(p => [p, fs.readFileSync(path.join(f.root, p))]);
  const dry = f.run(false); assert.equal(dry.newMetadataApprovals, 0); assert.deepEqual(read(f, META), beforeMeta); assert.deepEqual(read(f, RT), beforeRuntime);
  const write = f.run(true); assert.equal(write.withdrawnMetadataApprovals, 1);
  const after = read(f, META).records[0]; assert.equal(after.metadataApprovalType, undefined); assert.equal(after.metadataStatus, 'registration_pending_semantic_review');
  for (const k of ['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceQuestionNo', 'sourceFingerprint', 'contentFingerprint', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'level', 'unrelatedProducerField']) assert.deepEqual(after[k], f.registered[k]);
  assert.deepEqual(read(f, META).records[1], beforeMeta.records[1]); assert.deepEqual(read(f, RT).records, [beforeRuntime.records[0]]);
  assert.equal(f.state().status, 'VALID_HOLD'); assert.equal(f.run(false).replay, true);
  const postWrite = [META, IDENTITY, RT, RP + 'withdraw-final.json', authorityHoldSealPath(uid(1))].map(p => [p, fs.readFileSync(path.join(f.root, p))]);
  assert.equal(f.run(true).replay, true);
  for (const [p, b] of postWrite) assert(fs.readFileSync(path.join(f.root, p)).equals(b));
  for (const [p, b] of protectedFiles) assert(fs.readFileSync(path.join(f.root, p)).equals(b));
  assert(!AUTHORITY_RESTORABLE_FIELDS.includes('sourceFingerprint')); assert(!AUTHORITY_RESTORABLE_FIELDS.includes('difficultyBucket'));
});
for (const [label, change, message] of [
  ['current metadata drift', f => { const d = read(f, META); d.records[0].primaryMethod = 'changed'; put(f, META, d); }, /current metadata CAS/],
  ['identity drift', f => { const d = read(f, IDENTITY); d.records[0].sourceFingerprint = sha('wrong'); put(f, IDENTITY, d); }, /current identity drift/],
  ['runtime drift', f => { const d = read(f, RT); d.records[1].runtimeSelectable = false; put(f, RT, d); }, /current runtime CAS/],
  ['source drift', f => put(f, 'archive/exams/' + source, 'window.questionBank=[];'), /source blob drift/],
  ['after-value injection', f => { f.request.items[0].after = { problemTypeKey: 'invented' }; }, /cannot supply new values/],
  ['registry mutation', f => { f.request.registryChanges = [{}]; }, /no approval or registry/],
  ['ordinary approval masquerade', f => { f.request.approval.type = 'FINAL_QA'; f.request.approval.metadataReviewed = true; }, /no approval/],
  ['duplicate target', f => { f.request.items.push(structuredClone(f.request.items[0])); }, /duplicate/],
  ['empty partition', f => { f.request.items = []; }, /exact withdrawal partition/],
  ['non-withheld UID substitution', f => { f.request.items[0].questionUid = uid(2); }, /exact withdrawal partition/],
  ['wrong source ordinal', f => { f.request.items[0].sourceOrdinal = 2; }, /UID\/ordinal\/reason/],
  ['forged prior state hash', f => { f.request.items[0].priorMetadataRecordSha256 = sha('wrong'); }, /snapshot CAS/],
  ['reviewer mismatch', f => { f.request.approval.approvedBy = 'other'; }, /withdrawal review/],
  ['original receipt altered', f => { const d = read(f, RP + 'old-final.json'); d.appliedRecords[0].templateKey = 'invented'; put(f, RP + 'old-final.json', d); }, /evidence SHA drift/],
  ['consumed request altered', f => { const d = read(f, f.originalRequestCopy); d.items[0].after = { templateKey: 'invented' }; put(f, f.originalRequestCopy, d); }, /evidence SHA drift/],
]) test('refuses ' + label + ' without writes', t => {
  const f = fixture(t); change(f); const before = [META, IDENTITY, RT].map(p => [p, fs.readFileSync(path.join(f.root, p))]);
  assert.throws(() => f.run(true), message); for (const [p, b] of before) assert(fs.readFileSync(path.join(f.root, p)).equals(b));
  assert(!fs.existsSync(path.join(f.root, RP + 'withdraw-final.json')));
});
for (const option of ['priorApproved', 'priorRuntime', 'nativeAfter']) test('refuses pre-existing authority: ' + option, t => {
  const f = fixture(t, { [option]: true }); assert.throws(() => f.run(true), /prior approved\/native\/runtime|explicit after authority/);
});
for (const [label, mutate] of [
  ['metadata marker removal', f => { const d = read(f, META); delete d.records[0].metadataAuthorityHold; put(f, META, d); }],
  ['metadata marker and UID seal removal', f => { const d = read(f, META); delete d.records[0].metadataAuthorityHold; put(f, META, d); fs.rmSync(path.join(f.root, authorityHoldSealPath(uid(1)))); }],
  ['old approval restored with immutable hold evidence after both marker removals', f => { const d = read(f, META), evidence = d.records[0].approvalEvidence; d.records[0] = { ...f.registered, approvalEvidence: evidence }; put(f, META, d); fs.rmSync(path.join(f.root, authorityHoldSealPath(uid(1)))); }],
  ['approval restored without separate release', f => { const d = read(f, META); d.records[0] = f.registered; put(f, META, d); }],
  ['seal removed', f => fs.rmSync(path.join(f.root, authorityHoldSealPath(uid(1))))],
  ['correction receipt altered', f => { const d = read(f, RP + 'withdraw-final.json'); d.newMetadataApprovals = 1; put(f, RP + 'withdraw-final.json', d); }],
]) test('persistent hold is fail-closed after ' + label, t => {
  const f = fixture(t); f.run(true); mutate(f); assert.equal(f.state().status, 'INVALID_HOLD'); assert.throws(() => f.run(false), /replay|receipt/);
});
test('write failure restores every touched file and does not leave a correction receipt', t => {
  const f = fixture(t), before = [META, IDENTITY, RT].map(p => [p, fs.readFileSync(path.join(f.root, p))]);
  const original = fs.writeFileSync; let injected = false;
  fs.writeFileSync = function(file, ...args) { if (!injected && String(file) === path.join(f.root, RT)) { injected = true; throw Error('injected I/O failure'); } return original.call(fs, file, ...args); };
  try { assert.throws(() => f.run(true), /injected I\/O failure/); } finally { fs.writeFileSync = original; }
  assert(injected); for (const [p, b] of before) assert(fs.readFileSync(path.join(f.root, p)).equals(b)); assert(!fs.existsSync(path.join(f.root, RP + 'withdraw-final.json')));
});

test('production AutoMeta refuses a correction hold and removed markers before any source promotion', t => {
  const f = fixture(t); f.run(true);
  const bytes = fs.readFileSync(path.join(f.root, 'archive/exams/' + source)), bank = loadBank(bytes.toString()), question = bank[0];
  const input = { nativeSource: { root: f.root, bytes, bank, blobSha1: blob(bytes) }, question, previous: question,
    current: read(f, META).records[0], identity: f.identity[0], source, ordinal: 1,
    registry: {}, validate() { throw Error('source promotion must not run for an authority hold'); } };
  assert.equal(nativeReviewReceipt(input), null);
  assert.deepEqual(planQuestion(input).reasons, ['UNSUPPORTED_NATIVE_AUTHORITY_WITHDRAWN']);
  const noMarker = structuredClone(input.current); delete noMarker.metadataAuthorityHold;
  assert.deepEqual(planQuestion({ ...input, current: noMarker }).reasons, ['AUTHORITY_HOLD_EVIDENCE_OR_STATE_DRIFT']);
  fs.rmSync(path.join(f.root, authorityHoldSealPath(uid(1))));
  assert.deepEqual(planQuestion({ ...input, current: noMarker }).reasons, ['AUTHORITY_HOLD_EVIDENCE_OR_STATE_DRIFT']);
  const restored = { ...f.registered, approvalEvidence: input.current.approvalEvidence };
  assert.deepEqual(planQuestion({ ...input, current: restored }).reasons, ['AUTHORITY_HOLD_EVIDENCE_OR_STATE_DRIFT']);
});

test('fixed Git PR preview selects and applies the typed withdrawal with exact UID/output scope', t => {
  const f = fixture(t), requestPath = '.archive-meta-register/inbox/withdraw-final.json';
  put(f, requestPath, f.request); const headSha = commit(f);
  const requests = selectNativeRequests({ root: f.root, baseSha: f.actualCommit, headSha });
  assert.equal(requests.length, 1); assert.equal(requests[0].kind, 'native-authority-withdrawal');
  assert.equal(requests[0].questionCount, 1); assert.equal(requests[0].sourceQuestionCount, 2);
  assert.deepEqual(requests[0].selectedItems, [{ questionUid: uid(1), sourceOrdinal: 1 }]);
  const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const plans = applyNativeRequests({ root: f.root, requests, scriptRoot });
  assert.equal(plans.length, 1); assert.equal(plans[0].replay, false);
  assert.deepEqual([...plans[0].plannedPaths].sort(), [META, RT, RP + 'withdraw-final.json', authorityHoldSealPath(uid(1))].sort());
  assert.equal(read(f, RP + 'withdraw-final.json').newMetadataApprovals, 0);
  assert.equal(f.state().status, 'VALID_HOLD');
});

function fixedWithdrawalSelection(f) {
  put(f, '.archive-meta-register/inbox/withdraw-final.json', f.request);
  const headSha = commit(f);
  return () => selectNativeRequests({ root: f.root, baseSha: f.actualCommit, headSha });
}

test('typed withdrawal permits an empty evidence array only for its exact unsupported original receipt', t => {
  const f = fixture(t, { originalEvidenceRefs: [] }), original = fs.readFileSync(path.join(f.root, RP + 'old-final.json'));
  const requests = fixedWithdrawalSelection(f)();
  assert.equal(requests[0].kind, 'native-authority-withdrawal');
  assert.ok(requests[0].evidence.some(r => r.path === RP + 'old-final.json' && r.sha256 === sha(original)));
  const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const plans = applyNativeRequests({ root: f.root, requests, scriptRoot });
  assert.equal(plans.length, 1); assert.equal(read(f, RP + 'withdraw-final.json').newMetadataApprovals, 0);
  assert.equal(f.state().status, 'VALID_HOLD');
  assert.deepEqual(fs.readFileSync(path.join(f.root, RP + 'old-final.json')), original);
});

for (const [label, value] of [['null', null], ['object', {}]]) {
  test(`typed withdrawal rejects malformed ${label} approval evidence on its designated original`, t => {
    const f = fixture(t, { originalEvidenceRefs: value });
    assert.throws(fixedWithdrawalSelection(f), /EVIDENCE_REQUIRED/);
  });
}

for (const label of ['path', 'sha256']) {
  test(`typed withdrawal cannot exempt an original receipt with a different declared ${label}`, t => {
    const f = fixture(t);
    f.request.authorityCorrection.originalReceiptRef[label] = label === 'path' ? RP + 'different.json' : '0'.repeat(64);
    assert.throws(fixedWithdrawalSelection(f), /EVIDENCE_REQUIRED/);
  });
}

for (const label of ['absent', 'empty']) {
  test(`typed withdrawal does not exempt an unrelated native receipt with ${label} evidence`, t => {
    const f = fixture(t), other = RP + 'unrelated-final.json';
    put(f, other, { schemaVersion: 'archive-reviewed-exam-meta-registration-v2',
      approval: label === 'empty' ? { evidenceRefs: [] } : {} });
    f.request.items[0].evidenceRefs.push(ref(f, other));
    assert.throws(fixedWithdrawalSelection(f), /EVIDENCE_REQUIRED/);
  });
}

test('typed withdrawal stages nonempty original approval evidence through the ordinary fixed Git closure', t => {
  const leaf = 'docs/operations/unsupported-original-evidence.json';
  const f = fixture(t, { originalEvidenceRefs: f => { put(f, leaf, { fixture: true }); return [ref(f, leaf)]; } });
  const requests = fixedWithdrawalSelection(f)();
  assert.ok(requests[0].evidence.some(r => r.path === leaf && r.sha256 === ref(f, leaf).sha256));
});

for (const [label, expected] of [['missing', /MISSING_FILE/], ['hash', /EVIDENCE_DRIFT/], ['fixed Git', /EVIDENCE_NOT_FIXED/], ['cycle', /EVIDENCE_CYCLE/]]) {
  test(`typed withdrawal retains the ${label} rejection for nonempty original evidence`, t => {
    const leaf = 'docs/operations/unsupported-original-evidence.json', forged = json({ forged: true });
    const f = fixture(t, { originalEvidenceRefs: f => {
      if (label === 'cycle') return [{ path: RP + 'old-final.json', sha256: '0'.repeat(64) }];
      if (label !== 'missing') put(f, leaf, { fixture: true });
      return [{ path: leaf, sha256: label === 'fixed Git' ? sha(forged) : '0'.repeat(64) }];
    } });
    const select = fixedWithdrawalSelection(f);
    if (label === 'fixed Git') put(f, leaf, forged);
    assert.throws(select, expected);
  });
}

for (const label of ['approval', 'item']) {
  test(`typed withdrawal still requires nonempty top-level ${label} evidence`, t => {
    const f = fixture(t);
    if (label === 'approval') f.request.approval.evidenceRefs = [];
    else f.request.items[0].evidenceRefs = [];
    assert.throws(fixedWithdrawalSelection(f), /EVIDENCE_REQUIRED/);
  });
}
