// Withdraw a demonstrably unsupported FINAL_QA registration. This operation
// restores only a finite semantic/authority projection and creates no approval.
// Original receipts, source bytes, identity, difficulty and shared registries are immutable.
import fs from 'node:fs';
import { META_FILE, questionMetadataBytesAt, questionMetadataText, assertMetadataAssembledCurrent, syncMetadataShards } from './question-metadata-format.mjs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { isDeepStrictEqual as equal } from 'node:util';
import { refreshRuntime } from './reviewed-runtime-summary.mjs';

export const AUTHORITY_CORRECTION_MODE = 'WITHDRAW_UNSUPPORTED_NATIVE_AUTHORITY';
export const AUTHORITY_CORRECTION_SCHEMA = 'archive-native-authority-correction-v1';
export const AUTHORITY_HOLD_SCHEMA = 'archive-native-authority-hold-v1';
const META = 'archive/data/question_metadata.json';
const IDENTITY = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime/';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SEALS = RECEIPTS + 'authority-holds/';
const D5 = ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
export const AUTHORITY_RESTORABLE_FIELDS = Object.freeze([
  'standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder',
  'subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth',
  'conceptClusterKey', 'secondaryConceptKeys', 'problemTypeKey', 'templateKey',
  'crossConceptKeys', 'conditionKeys', 'integrationPattern',
  'curriculum', 'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4',
  'primaryMethod', 'decisiveStep', 'rpmPrimaryId', 'rpmPrimaryPath',
  'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'rpmSemanticStatus', 'rpmSemanticReason',
  'rpmCrosswalkStatus', 'rpmPathStatus', 'semanticSourceScope', 'semanticScopeRelation',
  'curriculumApplicability', 'defaultSelectable', 'l3Disposition', 'l4Disposition',
  'foundationTaxonomyStatus', 'projectionStatus', 'reviewStatus', 'metadataStatus',
  'metadataApprovalType', 'metadataRevision', 'tagConfidence', 'tagStatus',
  'metaFoundationStatus', 'metaFoundationPackId', 'metaFoundationPackVersion',
  'metaFoundationHoldReason', 'fieldStatus', 'approvalEvidence',
]);
const REASONS = new Set([
  'RPM_TRANSPORT_MISMATCH_AND_UNAPPLIED_PT_TPL_CANDIDATE',
  'UNAPPLIED_DEFINITION_CANDIDATE_NOT_GENERIC_FINAL_QA_AUTHORITY',
  'TPL_AUTHORITY_NOT_EXPLICIT_FOR_GENERIC_FINAL_QA',
]);
const text = v => typeof v === 'string' && Boolean(v.trim());
const stable = v => JSON.stringify(v, (_, x) => x && !Array.isArray(x) && typeof x === 'object'
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const hash = v => sha(stable(v));
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const json = v => JSON.stringify(v, null, 2) + '\n';
const fail = m => { throw Error('NATIVE_AUTHORITY_CORRECTION: ' + m); };
const assert = (v, m) => { if (!v) fail(m); };
const pick = (v, keys) => Object.fromEntries(keys.filter(k => Object.hasOwn(v, k)).map(k => [k, v[k]]));
const uidValid = u => /^qid_v1_[a-f0-9]{64}$/.test(u || '');

function safe(root, relative) {
  assert(text(relative) && !path.isAbsolute(relative) && !relative.includes('\\') &&
    !/[\x00-\x1f]/.test(relative) && relative.split('/').every(p => p && p !== '.' && p !== '..'), 'unsafe path');
  const base = path.resolve(root), full = path.resolve(base, relative);
  for (let p = full; p !== base; p = path.dirname(p))
    assert(!fs.existsSync(p) || !fs.lstatSync(p).isSymbolicLink(), 'symlink path');
  return full;
}
function git(root, args) {
  try { return execFileSync('git', args, { cwd: root, maxBuffer: 128 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'] }); } catch { fail('immutable Git input unavailable'); }
}
function commit(root, value) {
  assert(/^[a-f0-9]{40}$/.test(value || ''), 'full immutable commit required');
  assert(git(root, ['rev-parse', '--verify', value + '^{commit}']).toString().trim() === value, 'commit identity');
}
function gitBytes(root, ref, file) { safe(root, file); if (file === META_FILE) return questionMetadataBytesAt(root, ref); return git(root, ['show', `${ref}:${file}`]); }
function read(root, file) { return JSON.parse(fs.readFileSync(safe(root, file), 'utf8')); }
function bound(root, ref, refs) {
  assert(ref && /^[a-f0-9]{64}$/.test(ref.sha256 || '') && refs?.some(r => equal(r, ref)), 'bound evidence reference');
  const raw = fs.readFileSync(safe(root, ref.path)); assert(sha(raw) === ref.sha256, 'evidence SHA drift: ' + ref.path);
  return { raw, doc: JSON.parse(raw) };
}
function unique(rows, key, label) {
  assert(Array.isArray(rows), label + ' array'); const out = new Map();
  for (const row of rows) { const k = row?.[key]; assert(k != null && !out.has(k), label + ' duplicate/missing ' + key); out.set(k, row); }
  return out;
}
function loadBank(raw) {
  const ctx = { window: {} }; vm.runInNewContext(raw.toString(), ctx, { timeout: 5000 });
  const rows = ctx.window.questionBank || ctx.window.questions || ctx.questionBank || ctx.questions;
  assert(Array.isArray(rows), 'source question bank'); return JSON.parse(JSON.stringify(rows));
}
function runtimeFilesAt(root, ref) {
  return git(root, ['ls-tree', '-r', '--name-only', '-z', ref, '--', RUNTIME]).toString().split('\0')
    .filter(p => p.endsWith('.json') && p !== RUNTIME + 'runtime-bridge-receipt.json');
}
function runtimes(root, ref = null) {
  const files = ref ? runtimeFilesAt(root, ref) : fs.readdirSync(safe(root, RUNTIME.slice(0, -1)))
    .filter(n => n.endsWith('.json') && n !== 'runtime-bridge-receipt.json').map(n => RUNTIME + n);
  const docs = new Map(), byUid = new Map();
  for (const file of files) {
    const doc = JSON.parse(ref ? gitBytes(root, ref, file) : fs.readFileSync(safe(root, file)));
    assert(Array.isArray(doc.records), 'runtime records'); docs.set(file, doc);
    for (const row of doc.records) {
      assert(uidValid(row.questionUid) && !byUid.has(row.questionUid), 'runtime UID duplicate');
      byUid.set(row.questionUid, { file, row });
    }
  }
  return { docs, byUid };
}
export const authorityHoldSealPath = uid => { assert(uidValid(uid), 'hold UID'); return SEALS + uid + '.json'; };
export const isNativeAuthorityCorrection = req => req?.schemaVersion === 'archive-reviewed-exam-meta-register-request-v2'
  && req.registrationMode === AUTHORITY_CORRECTION_MODE;

function requestContext(root, req) {
  assert(isNativeAuthorityCorrection(req), 'unsupported correction mode');
  assert(/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(req.requestId || ''), 'requestId');
  assert(req.scope === 'PARTIAL_UIDS' && text(req.examUid) && Number.isSafeInteger(req.expectedQuestionCount) && req.expectedQuestionCount > 0, 'explicit selected scope');
  assert(/^original\/middle\/m2\/2(?:mid|final)\/.+\.js$/.test(req.sourceArchiveFile || ''), 'M2 semester2 authority correction source');
  assert(req.approval?.type === 'AUTHORITY_CORRECTION' && req.approval.metadataReviewed === false && text(req.approval.approvedBy)
    && req.approval.sourceRebind === undefined && req.registryChanges?.length === 0, 'withdrawal creates no approval or registry changes');
  const spec = req.authorityCorrection;
  assert(spec?.schemaVersion === AUTHORITY_CORRECTION_SCHEMA && spec.operation === 'WITHDRAW_GENERIC_FINAL_QA_TO_PRIOR_PENDING', 'correction contract');
  for (const ref of [spec.registeredAtCommit, spec.preRegistrationCommit, spec.priorStateCommit]) commit(root, ref);
  const parents = git(root, ['cat-file', 'commit', spec.registeredAtCommit]).toString().split('\n').filter(l => l.startsWith('parent '));
  assert(parents[0] === 'parent ' + spec.preRegistrationCommit, 'immediate pre-registration parent');
  const sourcePath = 'archive/exams/' + req.sourceArchiveFile, sourceBytes = fs.readFileSync(safe(root, sourcePath));
  assert(blob(sourceBytes) === req.expectedSourceBlobSha1, 'current source blob drift');
  for (const ref of [spec.registeredAtCommit, spec.preRegistrationCommit, spec.priorStateCommit])
    assert(gitBytes(root, ref, sourcePath).equals(sourceBytes), 'source changed across correction snapshots');
  const bank = loadBank(sourceBytes); assert(bank.length === req.expectedQuestionCount, 'source denominator');
  const refs = req.approval.evidenceRefs;
  const review = bound(root, spec.reviewRef, refs).doc;
  assert(review.schemaVersion === 'archive-native-authority-withdrawal-review-v1' && review.decision === 'WITHDRAW_UNSUPPORTED_FINAL_QA'
    && review.reviewedBy === req.approval.approvedBy && review.newMetadataApprovals === 0 && review.sourceHold === false
    && review.registeredAtCommit === spec.registeredAtCommit && review.preRegistrationCommit === spec.preRegistrationCommit
    && review.priorStateCommit === spec.priorStateCommit, 'explicit authority withdrawal review');
  const withheld = bound(root, review.withheldScopeRef, refs).doc;
  assert(withheld.schemaVersion === 'm2s2-binding68-authority-withheld11-v1', 'existing withheld scope contract');
  const withheldByUid = unique(withheld.withheldRows, 'questionUid', 'withheld scope');
  const reviewRows = unique(review.items, 'questionUid', 'review scope');
  assert(equal([...reviewRows.keys()].sort(), [...withheldByUid.keys()].sort()), 'review must retain exact withheld authority scope');
  const items = unique(req.items, 'questionUid', 'selected UID'); unique(req.items, 'sourceOrdinal', 'selected ordinal');
  const expected = review.items.filter(i => i.sourceArchiveFile === req.sourceArchiveFile).map(i => i.questionUid).sort();
  assert(items.size > 0 && equal([...items.keys()].sort(), expected), 'request/source exact withdrawal partition');
  const original = bound(root, spec.originalReceiptRef, refs);
  assert(spec.originalReceiptRef.path === RECEIPTS + original.doc.requestId + '.json' &&
    gitBytes(root, spec.registeredAtCommit, spec.originalReceiptRef.path).equals(original.raw), 'original receipt immutable Git binding');
  assert(original.doc.schemaVersion === 'archive-reviewed-exam-meta-registration-v2' && original.doc.metadataRegistrationStatus === 'REGISTERED'
    && original.doc.approval?.type === 'FINAL_QA' && original.doc.sourceArchiveFile === req.sourceArchiveFile
    && original.doc.sourceBlobSha1 === req.expectedSourceBlobSha1 && original.doc.sourceRawSha256 === sha(sourceBytes), 'original FINAL_QA/source receipt');
  const requestProof = bound(root, spec.registeredRequestRef, refs);
  assert(gitBytes(root, spec.preRegistrationCommit, spec.originalRequestPath).equals(requestProof.raw)
    && requestProof.doc.requestId === original.doc.requestId && hash(requestProof.doc) === original.doc.requestSha256, 'original consumed request identity');
  assert(original.doc.fingerprintRepairs?.length === 0, 'cannot undo a fingerprint repair');
  const oldMetaRaw = gitBytes(root, spec.priorStateCommit, META);
  assert(blob(oldMetaRaw) === spec.priorMetadataGitBlobSha1, 'prior metadata snapshot blob');
  const prior = unique(JSON.parse(oldMetaRaw).records, 'questionUid', 'prior metadata');
  const immediate = unique(JSON.parse(gitBytes(root, spec.preRegistrationCommit, META)).records, 'questionUid', 'immediate prior metadata');
  const registered = unique(JSON.parse(gitBytes(root, spec.registeredAtCommit, META)).records, 'questionUid', 'registered metadata');
  const priorIdentity = unique(JSON.parse(gitBytes(root, spec.priorStateCommit, IDENTITY)).records, 'questionUid', 'prior identity');
  const registeredIdentity = unique(JSON.parse(gitBytes(root, spec.registeredAtCommit, IDENTITY)).records, 'questionUid', 'registered identity');
  const beforeRuntime = runtimes(root, spec.preRegistrationCommit), priorRuntime = spec.priorStateCommit === spec.preRegistrationCommit
    ? beforeRuntime : runtimes(root, spec.priorStateCommit);
  const receiptMeta = unique(original.doc.appliedRecords, 'questionUid', 'receipt metadata');
  const receiptRuntime = unique(original.doc.runtimeRecords, 'questionUid', 'receipt runtime');
  const receiptIdentity = unique(original.doc.appliedIdentityRecords, 'questionUid', 'receipt identity');
  const nativeDocs = new Map();
  for (const [uid, item] of items) {
    const r = reviewRows.get(uid), debt = withheldByUid.get(uid), old = prior.get(uid), now = registered.get(uid);
    assert(uidValid(uid) && Number.isSafeInteger(item.sourceOrdinal) && item.sourceOrdinal >= 1 && item.sourceOrdinal <= bank.length
      && item.sourceOrdinal === r.sourceOrdinal && debt.sourceOrdinal === item.sourceOrdinal && r.reasonCode === debt.reasonCode
      && REASONS.has(r.reasonCode) && r.sourceArchiveFile === req.sourceArchiveFile, 'reviewed UID/ordinal/reason');
    assert(item.after && equal(item.after, {}) && item.rebind === undefined && item.sourceReview === undefined && item.typeHold === undefined,
      'withdrawal cannot supply new values or another registration operation');
    assert(equal(item.before && Object.keys(item.before).sort(), ['identitySha256', 'metadataSha256', 'runtimeSha256'])
      && Object.values(item.before).every(v => /^[a-f0-9]{64}$/.test(v || '')), 'exact current state CAS required');
    assert(old && now && equal(old, immediate.get(uid)) && old.metadataStatus === 'registration_pending_semantic_review'
      && !old.metadataApprovalType && old.reviewStatus !== 'reviewed_pass' && !String(old.metadataStatus).startsWith('approved_')
      && !['problemType', 'template'].some(k => /^approved/.test(old.fieldStatus?.[k] || ''))
      && !(old.approvalEvidence || []).some(p => typeof p === 'string' && p.startsWith(RECEIPTS))
      && !priorRuntime.byUid.has(uid) && !beforeRuntime.byUid.has(uid), 'prior approved/native/runtime authority must not be withdrawn');
    assert(old.sourceArchiveFile === req.sourceArchiveFile && old.sourceOrdinal === item.sourceOrdinal
      && now.sourceArchiveFile === req.sourceArchiveFile && now.sourceOrdinal === item.sourceOrdinal
      && now.metadataApprovalType === 'FINAL_QA' && now.metadataStatus === 'approved_semantic_review', 'snapshot/source/state mismatch');
    assert(equal(now, receiptMeta.get(uid)) && equal(registeredIdentity.get(uid), receiptIdentity.get(uid))
      && equal(registeredIdentity.get(uid), priorIdentity.get(uid)), 'registered receipt/snapshot/identity equality');
    assert(hash(now) === item.before.metadataSha256 && hash(registeredIdentity.get(uid)) === item.before.identitySha256
      && hash(receiptRuntime.get(uid)) === item.before.runtimeSha256 && hash(old) === item.priorMetadataRecordSha256, 'snapshot CAS digest mismatch');
    for (const k of [...D5, 'questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceQuestionNo', 'sourceFingerprint', 'contentFingerprint'])
      assert(equal(old[k], now[k]), 'protected registration field drift: ' + k);
    assert(equal(r.nativeRef, spec.nativeRef) && r.nativeRef.sha256 === debt.native.sha256, 'native evidence binding');
    if (!nativeDocs.has(r.nativeRef.path)) {
      const native = bound(root, r.nativeRef, refs);
      assert(gitBytes(root, spec.registeredAtCommit, r.nativeRef.path).equals(native.raw), 'current committed native evidence');
      nativeDocs.set(r.nativeRef.path, native.doc);
    }
    const native = nativeDocs.get(r.nativeRef.path).items?.find(x => x.questionUid === uid && Number(x.ordinal ?? x.sourceOrdinal) === item.sourceOrdinal);
    assert(native && !Object.hasOwn(native.after || {}, 'problemTypeKey') && !Object.hasOwn(native.after || {}, 'templateKey'), 'native explicit after authority cannot be withdrawn by this mode');
    if (r.reasonCode !== 'TPL_AUTHORITY_NOT_EXPLICIT_FOR_GENERIC_FINAL_QA')
      assert(native.activeDefinitionMatch?.projectionApplied === false, 'unapplied native candidate boundary');
    else assert(native.activeDefinitionMatch == null, 'unconfirmed template boundary');
  }
  return { spec, items, prior, registered, registeredIdentity, receiptRuntime, reviewRows, sourceBytes, bank,
    originalReceipt: original.doc, refs, requestSha256: hash(req) };
}

function restoredRecord(current, prior, req, item, receiptPath) {
  const next = structuredClone(current);
  for (const key of AUTHORITY_RESTORABLE_FIELDS) {
    if (Object.hasOwn(prior, key)) next[key] = structuredClone(prior[key]); else delete next[key];
  }
  next.metadataAuthorityHold = { schemaVersion: AUTHORITY_HOLD_SCHEMA, correctionRequestId: req.requestId,
    receiptPath, sealPath: authorityHoldSealPath(item.questionUid), reason: 'UNSUPPORTED_GENERIC_FINAL_QA',
    priorSemanticSha256: hash(pick(prior, AUTHORITY_RESTORABLE_FIELDS)), sourceHold: false };
  next.approvalEvidence = [...new Set([...(prior.approvalEvidence || []), req.authorityCorrection.originalReceiptRef.path, receiptPath])];
  return next;
}

export function registerNativeAuthorityCorrection({ root, request: req, write = false }) {
  const c = requestContext(root, req), metadata = read(root, META), identityRaw = fs.readFileSync(safe(root, IDENTITY));
  const current = unique(metadata.records, 'questionUid', 'current metadata'), identities = unique(JSON.parse(identityRaw).records, 'questionUid', 'current identity');
  const runtime = runtimes(root), receiptPath = RECEIPTS + req.requestId + '.json';
  const previous = fs.existsSync(safe(root, receiptPath)) ? read(root, receiptPath) : null;
  assert(!previous || previous.schemaVersion === AUTHORITY_CORRECTION_SCHEMA && previous.requestSha256 === c.requestSha256, 'immutable correction request collision');
  const applied = [], touched = new Set();
  for (const [uid, item] of c.items) {
    const actual = current.get(uid), expected = c.registered.get(uid), next = restoredRecord(expected, c.prior.get(uid), req, item, receiptPath);
    assert(equal(identities.get(uid), c.registeredIdentity.get(uid)), 'current identity drift');
    const found = runtime.byUid.get(uid);
    if (previous) {
      assert(equal(actual, next) && !found, 'correction replay state drift');
      const claim = nativeAuthorityHoldState({ root, current: actual, identity: identities.get(uid), source: req.sourceArchiveFile, ordinal: item.sourceOrdinal });
      assert(claim?.status === 'VALID_HOLD', 'correction replay hold proof');
    } else {
      assert(equal(actual, expected) && hash(actual) === item.before.metadataSha256, 'current metadata CAS drift');
      assert(found && equal(found.row, c.receiptRuntime.get(uid)) && hash(found.row) === item.before.runtimeSha256, 'current runtime CAS drift');
      assert(!actual.metadataAuthorityHold && !fs.existsSync(safe(root, authorityHoldSealPath(uid))), 'existing authority hold requires separate resolution');
      metadata.records[metadata.records.indexOf(actual)] = next;
      runtime.docs.get(found.file).records = runtime.docs.get(found.file).records.filter(r => r.questionUid !== uid); touched.add(found.file);
    }
    applied.push({ questionUid: uid, sourceOrdinal: item.sourceOrdinal, beforeMetadataSha256: item.before.metadataSha256,
      priorMetadataRecordSha256: item.priorMetadataRecordSha256, beforeRuntimeSha256: item.before.runtimeSha256,
      identitySha256: item.before.identitySha256, metadataAfter: next, metadataAfterSha256: hash(next),
      priorSemanticSha256: hash(pick(c.prior.get(uid), AUTHORITY_RESTORABLE_FIELDS)),
      reasonCode: c.reviewRows.get(uid).reasonCode, runtimeAfter: null, newMetadataApproval: false });
  }
  if (previous) {
    assert(equal(previous.applied, applied), 'correction receipt replay drift');
    return { status: 'PASS', replay: true, requestId: req.requestId, registrationMode: req.registrationMode,
      scope: req.scope, partialUidCount: applied.length, expectedQuestionCount: req.expectedQuestionCount, totalQuestions: applied.length,
      withdrawnMetadataApprovals: applied.length, newMetadataApprovals: 0, plannedPaths: [], consumerSearchStatus: 'NOT_RUN' };
  }
  metadata.reviewedPassCount = metadata.records.filter(r => r.reviewStatus === 'reviewed_pass').length;
  const counts = metadata.counts || {};
  if (Object.hasOwn(counts, 'semanticallyReviewed')) counts.semanticallyReviewed = metadata.records.filter(r => r.reviewStatus === 'reviewed_pass'
    || ['approved_semantic_review', 'approved_exam_meta_source'].includes(r.metadataStatus)).length;
  for (const [field, group] of [['explicitProblemTypeHolds', 'problemType'], ['explicitTemplateHolds', 'template'], ['explicitDifficultyHolds', 'difficulty']])
    if (Object.hasOwn(counts, field)) counts[field] = metadata.records.filter(r => r.fieldStatus?.[group] === 'manual_review_pending').length;
  if (Object.hasOwn(metadata, 'digest')) { delete metadata.digest; metadata.digest = sha(JSON.stringify(metadata)); }
  const receipt = { schemaVersion: AUTHORITY_CORRECTION_SCHEMA, requestId: req.requestId, requestSha256: c.requestSha256,
    sourceArchiveFile: req.sourceArchiveFile, sourceBlobSha1: req.expectedSourceBlobSha1, sourceRawSha256: sha(c.sourceBytes),
    registeredAtCommit: c.spec.registeredAtCommit, preRegistrationCommit: c.spec.preRegistrationCommit, priorStateCommit: c.spec.priorStateCommit,
    originalReceiptRef: c.spec.originalReceiptRef, correctionReviewRef: c.spec.reviewRef, request: req,
    metadataRegistrationStatus: 'UNSUPPORTED_AUTHORITY_WITHDRAWN', newMetadataApprovals: 0,
    withdrawnMetadataApprovals: applied.length, sourceHold: false, identityChanged: false, difficultyChanged: false,
    restoredFieldAllowlist: AUTHORITY_RESTORABLE_FIELDS, applied };
  const receiptText = json(receipt), outputs = new Map([[META, questionMetadataText(metadata)], [receiptPath, receiptText]]);
  for (const file of touched) { const rt = runtime.docs.get(file); refreshRuntime(rt); outputs.set(file, json(rt)); }
  for (const row of applied) outputs.set(authorityHoldSealPath(row.questionUid), json({ schemaVersion: AUTHORITY_HOLD_SCHEMA,
    questionUid: row.questionUid, sourceArchiveFile: req.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal,
    correctionRequestId: req.requestId, receiptPath, receiptSha256: sha(receiptText), metadataAfterSha256: row.metadataAfterSha256,
    identitySha256: row.identitySha256, status: 'AUTHORITY_REVIEW_REQUIRED', sourceHold: false }));
  assert(fs.readFileSync(safe(root, IDENTITY)).equals(identityRaw), 'identity changed during validation');
  assert(fs.readFileSync(safe(root, 'archive/exams/' + req.sourceArchiveFile)).equals(c.sourceBytes), 'source changed during validation');
  if (write) {
    assertMetadataAssembledCurrent(root);
    const backups = new Map();
    try { for (const [file, value] of outputs) { const full = safe(root, file); backups.set(full, fs.existsSync(full) ? fs.readFileSync(full) : null);
      fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, value); }
      syncMetadataShards(root); }
    catch (error) { for (const [file, bytes] of backups) { if (bytes === null) fs.rmSync(file, { force: true }); else fs.writeFileSync(file, bytes); } throw error; }
  }
  return { status: 'PASS', write, replay: false, requestId: req.requestId, registrationMode: req.registrationMode,
    scope: req.scope, partialUidCount: applied.length, expectedQuestionCount: req.expectedQuestionCount, totalQuestions: applied.length,
    withdrawnMetadataApprovals: applied.length, newMetadataApprovals: 0, plannedPaths: [...outputs.keys()], consumerSearchStatus: 'NOT_RUN' };
}

// The catalog is supplied by the existing digest-checked canonical loader. The
// page index and query are exactly the production student-search Consumer.
export function verifyNativeAuthorityCorrectionConsumer({ root, request, catalog }) {
  assert(isNativeAuthorityCorrection(request) && Array.isArray(catalog?.records) && Array.isArray(catalog.sourceHashes), 'withdrawal Consumer input');
  const require = createRequire(import.meta.url), ProblemBankMeta = require('../../problem-bank-meta.js');
  const generated = read(root, 'archive/data/generated-lite-consumer/v1/index.json');
  const sourceHashes = new Map(catalog.sourceHashes);
  const inventory = ProblemBankMeta.buildIndex(catalog.records.map(row => ({ ...row,
    currentSourceJsSha256: sourceHashes.get(row.sourceFile) || '' })), generated.records,
    { excludedHoldUids: generated.userDisabledUids || [] });
  const pages = unique(inventory, 'uid', 'Consumer UID'), metadata = unique(read(root, META).records, 'questionUid', 'Consumer metadata');
  const identity = unique(read(root, IDENTITY).records, 'questionUid', 'Consumer identity'), runtime = runtimes(root);
  const verified = new Set(ProblemBankMeta.query(inventory, {}, { profile: 'VERIFIED' }).map(row => row.uid));
  const results = [];
  for (const item of request.items) {
    const uid = item.questionUid, current = metadata.get(uid), id = identity.get(uid), page = pages.get(uid);
    const matches = catalog.records.filter(row => row.questionUid === uid && row.sourceFile === request.sourceArchiveFile && row.sourceOrdinal === item.sourceOrdinal);
    assert(matches.length === 1 && page, 'withdrawal Consumer exact UID/source row');
    const row = matches[0], hold = nativeAuthorityHoldState({ root, current, identity: id, source: request.sourceArchiveFile, ordinal: item.sourceOrdinal });
    assert(hold?.status === 'VALID_HOLD' && !runtime.byUid.has(uid), 'withdrawal Consumer persistent hold/runtime');
    assert(current.metadataStatus === 'registration_pending_semantic_review' && !current.metadataApprovalType
      && current.reviewStatus !== 'reviewed_pass' && row.reviewStatus !== 'reviewed_pass'
      && row.canonicalAssignmentReasons?.includes('assignment_missing') && row.assignmentEvidence?.approvalStatus !== 'APPROVED'
      && !row.problemTypeKey && !row.templateKey, 'withdrawal Consumer semantic authority leaked');
    assert(page.verifiedEligible === false && page.automatic === false && !verified.has(uid)
      && page.metaProjectionFailureReason === 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING'
      && ['problemTypeKey', 'templateKey', 'rpmPrimaryRecordId', 'L1', 'L2', 'L3', 'L4', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4']
        .every(key => Object.hasOwn(page, key) && page[key] === null), 'withdrawal Consumer approved page exposure');
    assert(page.metaStatus?.problemTypeKey === 'PENDING' && page.metaStatus?.templateKey === 'PENDING', 'withdrawal Consumer pending type status');
    assert(equal(page.difficultyBucket, current.difficultyBucket), 'withdrawal Consumer difficulty preservation');
    results.push({ questionUid: uid, sourceOrdinal: item.sourceOrdinal, authorityStatus: hold.status,
      sourceStatus: row.sourceStatus, runtimeRows: 0, verifiedEligible: false, automatic: false,
      verifiedQueryCount: 0, directSelectable: page.directSelectable, metaHintStatus: page.metaHintStatus ?? null,
      projectionFailure: page.metaProjectionFailureReason, difficultyBucket: page.difficultyBucket, newMetadataApproval: false });
  }
  assert(results.length === request.items.length && results.length > 0, 'withdrawal Consumer denominator');
  return { status: 'PASS', withdrawnMetadataApprovals: results.length, newMetadataApprovals: 0,
    checkedAuthorityHolds: results.length, runtimeRows: 0, verifiedQueryCount: 0, rows: results };
}

// The deterministic UID seal is checked even when a caller removes the metadata
// marker. Invalid evidence blocks reuse; it never becomes an approval fallback.
export function nativeAuthorityHoldState({ root, current, identity, source, ordinal }) {
  const marker = current?.metadataAuthorityHold, uid = identity?.questionUid || current?.questionUid;
  if (!uidValid(uid)) return marker ? { status: 'INVALID_HOLD', reason: 'AUTHORITY_HOLD_IDENTITY_INVALID' } : null;
  if (!root) return marker ? { status: 'INVALID_HOLD', reason: 'AUTHORITY_HOLD_PROOF_REQUIRED' } : null;
  try {
    const file = authorityHoldSealPath(uid), full = safe(root, file);
    // A correction receipt remains an authority-withdrawal claim after either
    // transport marker is removed. It cannot silently become ordinary metadata.
    const receiptClaim = (current?.approvalEvidence || []).some(relative => {
      if (typeof relative !== 'string' || !relative.startsWith(RECEIPTS) || !relative.endsWith('.json')) return false;
      const evidence = safe(root, relative);
      if (!fs.existsSync(evidence)) return false;
      const doc = JSON.parse(fs.readFileSync(evidence, 'utf8'));
      return doc.schemaVersion === AUTHORITY_CORRECTION_SCHEMA || isNativeAuthorityCorrection(doc.request);
    });
    if (!marker && !fs.existsSync(full) && !receiptClaim) return null;
    assert(marker?.schemaVersion === AUTHORITY_HOLD_SCHEMA && marker.sealPath === file && fs.existsSync(full), 'marker/seal missing');
    const seal = read(root, file);
    assert(seal.schemaVersion === AUTHORITY_HOLD_SCHEMA && seal.status === 'AUTHORITY_REVIEW_REQUIRED' && seal.sourceHold === false
      && seal.questionUid === uid && seal.sourceArchiveFile === source && seal.sourceOrdinal === ordinal
      && seal.receiptPath === marker.receiptPath && seal.correctionRequestId === marker.correctionRequestId, 'hold seal identity');
    assert(seal.receiptPath === RECEIPTS + seal.correctionRequestId + '.json' && /^[a-f0-9]{64}$/.test(seal.receiptSha256), 'hold receipt path');
    const raw = fs.readFileSync(safe(root, seal.receiptPath)); assert(sha(raw) === seal.receiptSha256, 'hold receipt SHA');
    const receipt = JSON.parse(raw), rows = receipt.applied?.filter(r => r.questionUid === uid);
    assert(receipt.schemaVersion === AUTHORITY_CORRECTION_SCHEMA && receipt.metadataRegistrationStatus === 'UNSUPPORTED_AUTHORITY_WITHDRAWN'
      && receipt.requestId === seal.correctionRequestId && receipt.newMetadataApprovals === 0 && receipt.sourceHold === false
      && receipt.requestSha256 === hash(receipt.request) && isNativeAuthorityCorrection(receipt.request)
      && receipt.request.authorityCorrection.reviewRef.path === receipt.correctionReviewRef.path
      && equal(receipt.request.authorityCorrection.reviewRef, receipt.correctionReviewRef)
      && rows?.length === 1 && rows[0].sourceOrdinal === ordinal && rows[0].runtimeAfter === null
      && rows[0].newMetadataApproval === false && rows[0].identitySha256 === seal.identitySha256
      && hash(current) === seal.metadataAfterSha256 && equal(current, rows[0].metadataAfter)
      && hash(identity) === seal.identitySha256 && !current.metadataApprovalType
      && current.metadataStatus === 'registration_pending_semantic_review', 'hold state/request/receipt mismatch');
    const review = bound(root, receipt.correctionReviewRef, receipt.request.approval.evidenceRefs).doc;
    assert(review.decision === 'WITHDRAW_UNSUPPORTED_FINAL_QA' && review.reviewedBy === receipt.request.approval.approvedBy
      && review.items.some(r => r.questionUid === uid && r.sourceOrdinal === ordinal && r.sourceArchiveFile === source), 'hold review scope');
    return { status: 'VALID_HOLD', reason: 'UNSUPPORTED_NATIVE_AUTHORITY_WITHDRAWN', receiptPath: seal.receiptPath, sealPath: file };
  } catch { return { status: 'INVALID_HOLD', reason: 'AUTHORITY_HOLD_EVIDENCE_OR_STATE_DRIFT' }; }
}
