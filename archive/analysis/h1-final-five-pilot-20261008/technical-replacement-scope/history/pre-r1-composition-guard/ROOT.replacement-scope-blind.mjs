#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { inside, physical, readExam, sha256, writeFresh } from '../../tools/archive-codex-artifact-io.mjs';
import { normalizeStudentBundle, STUDENT_FIELDS, studentAssetRefs } from '../../tools/archive-student-bundle.mjs';

export const AUTHORITY_SCHEMA = 'ROOT_REPLACEMENT_SCOPE_BLIND_AUTHORITY_V1';
export const FREEZE_SCHEMA = 'ROOT_REPLACEMENT_SCOPE_BLIND_FREEZE_V1';
export const DISCLOSURE_SCHEMA = 'ROOT_REPLACEMENT_SCOPE_POSTFREEZE_DISCLOSURE_V1';
export const RUN_ID = 'h1-final-five-pilot-20261008';
export const EXAM_UID = '21_매산고_1학기_기말_고1_기출';
export const SCOPE_QIDS = Object.freeze([17, 20]);
export const FULL_QIDS = Object.freeze(Array.from({ length: 20 }, (_, index) => index + 1));
const QUALITY_CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const CHOICE_FIELDS = new Set(['text', 'content', 'value', 'answer']);
const SCOPE_OUTPUT_FIELDS = Object.freeze(['answer', 'solution', 'explanation', 'sol', 'decisiveStep', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']);
const META_FIELDS = Object.freeze(['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'problemTypeKey', 'templateKey', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']);
const FORBIDDEN_AUTHORITY_KEYS = new Set(['answer', 'answers', 'independentanswer', 'storedanswer', 'solution', 'explanation', 'decisivestep', 'oldanswers', 'oldrows']);
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const hashJson = value => sha256(Buffer.from(JSON.stringify(value), 'utf8'));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const abs = value => typeof value === 'string' && path.isAbsolute(value);
function assert(condition, code, detail = '') { if (!condition) throw new Error(detail ? `${code}:${detail}` : code); }
function set(values) { return [...new Set(values)].sort((a, b) => a - b); }
function noAnswerPayload(value, at = 'authority') {
  if (Array.isArray(value)) { value.forEach((entry, index) => noAnswerPayload(entry, `${at}[${index}]`)); return; }
  if (!value || typeof value !== 'object') return;
  for (const [key, entry] of Object.entries(value)) {
    assert(!FORBIDDEN_AUTHORITY_KEYS.has(key.toLowerCase()), 'ROOT_RECOVERY_PACKET_MUST_NOT_CARRY_ANSWER_PAYLOAD', `${at}.${key}`);
    noAnswerPayload(entry, `${at}.${key}`);
  }
}
function within(root, value, code) { assert(abs(value), `${code}_ABSOLUTE_PATH_REQUIRED`); return inside(root, value); }
function boundFile(root, ref, code) {
  assert(ref && /^[a-f0-9]{64}$/.test(ref.sha256 || ''), `${code}_SHA256_BINDING_REQUIRED`);
  const file = within(root, ref.path, `${code}_PATH`), snapshot = physical(file);
  assert(snapshot.sha256 === ref.sha256, `${code}_SHA256_MISMATCH`);
  return { file, snapshot, bytes: fs.readFileSync(file) };
}
function safeBundle(root, ref, sourceRawSha256, sourceRawBlobSha1, assetRoot, { oldScopedAssetsMayDrift = false } = {}) {
  const fileRef = boundFile(root, ref, 'SAFE_STUDENT_BUNDLE');
  const raw = JSON.parse(fileRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(raw.schemaVersion === 'JS_ARCHIVE_STUDENT_BUNDLE_V2', 'SAFE_STUDENT_BUNDLE_V2_REQUIRED');
  assert(Array.isArray(raw.whitelist) && same(raw.whitelist, [...STUDENT_FIELDS]), 'STUDENT_WHITELIST_EXACT_REQUIRED');
  assert(same(Object.keys(raw).sort(), ['schemaVersion', 'sourceRawSha256', 'sourceRawBlobSha1', 'questionCount', 'qids', 'whitelist', 'rows', 'adapterProvenance', 'extractionProvenance'].sort()), 'SAFE_STUDENT_BUNDLE_FIELDS_EXACT_REQUIRED');
  assert(raw.sourceRawSha256 === sourceRawSha256 && raw.sourceRawBlobSha1 === sourceRawBlobSha1, 'SAFE_STUDENT_BUNDLE_SOURCE_METADATA_MISMATCH');
  assert(raw.questionCount === FULL_QIDS.length && same(raw.qids, FULL_QIDS) && Array.isArray(raw.rows) && raw.rows.length === FULL_QIDS.length, 'FULL_20_QID_BUNDLE_REQUIRED');
  const normalizedAssetRoot = path.resolve(assetRoot);
  const bundleRows = [];
  for (let index = 0; index < raw.rows.length; index += 1) {
    const row = raw.rows[index], qid = FULL_QIDS[index];
    assert(Number(row.qid) === qid && row.student && typeof row.student === 'object' && !Array.isArray(row.student), 'SAFE_BUNDLE_ROW_QID_OR_STUDENT_INVALID', String(qid));
    assert(same(Object.keys(row).sort(), ['qid', 'student', 'assets', 'studentPayloadSha256', 'originalStudentPayloadSha256'].filter(key => Object.hasOwn(row, key)).sort()), 'SAFE_BUNDLE_ROW_FIELDS_INVALID', String(qid));
    assert(Object.keys(row.student).every(key => STUDENT_FIELDS.has(key)), 'SAFE_BUNDLE_STUDENT_FIELD_NOT_WHITELISTED', String(qid));
    assert(row.student.id === undefined || Number(row.student.id) === qid, 'SAFE_BUNDLE_STUDENT_ID_MISMATCH', String(qid));
    assert(row.student.choices === undefined || Array.isArray(row.student.choices), 'SAFE_BUNDLE_CHOICES_ARRAY_REQUIRED', String(qid));
    for (const choice of row.student.choices || []) if (choice && typeof choice === 'object') assert(!Array.isArray(choice) && Object.keys(choice).every(key => CHOICE_FIELDS.has(key)), 'SAFE_BUNDLE_CHOICE_FIELDS_INVALID', String(qid));
    assert(Array.isArray(row.assets), 'SAFE_BUNDLE_ASSET_ARRAY_REQUIRED', String(qid));
    const assets = [];
    for (const asset of row.assets) {
      assert(same(Object.keys(asset).sort(), ['ref', 'path', 'sha256'].sort()), 'SAFE_BUNDLE_ASSET_FIELDS_INVALID', String(qid));
      assert(typeof asset.ref === 'string' && asset.ref.startsWith('assets/images/') && !asset.ref.split('/').includes('..'), 'SAFE_BUNDLE_ASSET_REF_INVALID', String(qid));
      assert(abs(asset.path) && /^[a-f0-9]{64}$/.test(asset.sha256 || ''), 'SAFE_BUNDLE_ASSET_BINDING_REQUIRED', String(qid));
      const expectedPath = path.resolve(normalizedAssetRoot, ...asset.ref.split('/'));
      assert(path.resolve(asset.path) === expectedPath, 'SAFE_BUNDLE_ASSET_PATH_ROOT_MISMATCH', asset.ref);
      inside(normalizedAssetRoot, asset.ref);
      if (!(oldScopedAssetsMayDrift && SCOPE_QIDS.includes(qid))) assert(physical(expectedPath).sha256 === asset.sha256, 'SAFE_BUNDLE_ASSET_SHA_MISMATCH', asset.ref);
      assets.push(structuredClone(asset));
    }
    const requiredRefs = new Set(studentAssetRefs(row.student));
    for (const ref of requiredRefs) assert(assets.some(asset => asset.ref === ref), 'SAFE_BUNDLE_REQUIRED_ASSET_MISSING', `${qid}:${ref}`);
    bundleRows.push({ qid, student: structuredClone(row.student), assets, ...(row.studentPayloadSha256 ? { studentPayloadSha256: row.studentPayloadSha256 } : {}) });
  }
  const bundle = oldScopedAssetsMayDrift
    ? { schemaVersion: raw.schemaVersion, sourceRawSha256: raw.sourceRawSha256, sourceRawBlobSha1: raw.sourceRawBlobSha1, questionCount: raw.questionCount, qids: [...raw.qids], whitelist: [...raw.whitelist], rows: bundleRows }
    : normalizeStudentBundle(raw, { inputFile: fileRef.file, expectedSourceRawSha256: sourceRawSha256 });
  assert(bundle.sourceRawSha256 === sourceRawSha256 && bundle.sourceRawBlobSha1 === sourceRawBlobSha1, 'STUDENT_BUNDLE_SOURCE_BINDING_MISMATCH');
  assert(bundle.questionCount === FULL_QIDS.length && same(bundle.qids, FULL_QIDS), 'FULL_20_QID_BUNDLE_REQUIRED');
  assert(raw.extractionProvenance?.answersDisclosed === false && raw.extractionProvenance?.studentFieldsExactParity === true, 'CURRENT_SAFE_STUDENT_EXTRACTION_REQUIRED');
  assert(raw.adapterProvenance?.answersRead === false && raw.adapterProvenance?.studentFieldsDropped?.length === 0, 'ANSWER_FREE_BUNDLE_PROVENANCE_REQUIRED');
  return { ...fileRef, raw, bundle };
}
function rowProjection(row) {
  return { qid: row.qid, student: currentStudentProjection(row.student), assets: row.assets.map(asset => ({ ref: asset.ref, path: path.resolve(asset.path), sha256: asset.sha256 })) };
}
function compareOldCurrent(oldBundle, currentBundle) {
  assert(same(oldBundle.bundle.qids, FULL_QIDS) && same(currentBundle.bundle.qids, FULL_QIDS), 'FULL_20_QID_ORDER_REQUIRED');
  const oldRows = new Map(oldBundle.bundle.rows.map(row => [row.qid, row]));
  const currentRows = new Map(currentBundle.bundle.rows.map(row => [row.qid, row]));
  const changedQids = [], outside = [], changedRows = [];
  for (const qid of FULL_QIDS) {
    const oldRow = oldRows.get(qid), currentRow = currentRows.get(qid);
    assert(oldRow && currentRow, 'FULL_BANK_ROW_REQUIRED', String(qid));
    const oldDigest = hashJson(rowProjection(oldRow)), currentDigest = hashJson(rowProjection(currentRow));
    if (oldDigest !== currentDigest) changedQids.push(qid);
    if (SCOPE_QIDS.includes(qid)) changedRows.push({ qid, oldDigest, currentDigest });
    else outside.push({ qid, digest: oldDigest, equal: oldDigest === currentDigest });
  }
  assert(same(changedQids, SCOPE_QIDS), 'ONLY_Q17_Q20_STUDENT_OR_ASSET_PAYLOAD_MAY_CHANGE', changedQids.join(','));
  assert(outside.every(row => row.equal), 'OUTSIDE_18_STUDENT_AND_ASSET_PARITY_REQUIRED');
  return {
    changedQids,
    unchangedQids: outside.map(row => row.qid),
    outsideScopeDigest: hashJson(outside.map(({ qid, digest }) => ({ qid, digest }))),
    scopedChangeDigest: hashJson(changedRows),
  };
}
function verifyAssetReadProof(root, authority, bundle) {
  const proofBound = boundFile(root, authority.scopedAssetReadProof, 'SCOPED_ASSET_READ_PROOF');
  const proof = JSON.parse(proofBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(proof, 'scopedAssetReadProof');
  assert(proof.schemaVersion === 'ROOT_REPLACEMENT_SCOPE_ASSET_READS_V1' && proof.runId === RUN_ID && proof.examUid === EXAM_UID && proof.stage === authority.stage, 'SCOPED_ASSET_READ_PROOF_SCOPE_REQUIRED');
  assert(same(proof.reviewerIdentity, authority.freshReviewer.reviewerIdentity), 'SCOPED_ASSET_REVIEWER_MISMATCH');
  const dependencies = authority.scopeDependenciesQids;
  assert(Array.isArray(dependencies) && SCOPE_QIDS.every(qid => dependencies.includes(qid)) && dependencies.every(qid => FULL_QIDS.includes(qid)), 'Q17_Q20_ASSET_DEPENDENCIES_REQUIRED');
  const required = [];
  for (const row of bundle.bundle.rows) if (dependencies.includes(row.qid)) for (const asset of row.assets) required.push({ qid: row.qid, ref: asset.ref, sha256: asset.sha256 });
  assert(Array.isArray(proof.rows) && proof.rows.every(row => row.opened === true && row.qid && row.ref && row.sha256 && row.openedAt), 'SCOPED_ASSETS_MUST_HAVE_ACTUAL_OPEN_ACKS');
  const key = row => `${row.qid}\u0000${row.ref}\u0000${row.sha256}`;
  assert(new Set(proof.rows.map(key)).size === proof.rows.length && same(proof.rows.map(key).sort(), required.map(key).sort()), 'SCOPED_ASSET_ACK_SET_MISMATCH');
  return { proofBound, proof };
}
function verifyAuthority({ root, authorityFile }) {
  const repository = fs.realpathSync(root), authFile = within(repository, authorityFile, 'ROOT_AUTHORITY');
  const authSnapshot = physical(authFile), authority = json(authFile);
  noAnswerPayload(authority);
  assert(authority.schemaVersion === AUTHORITY_SCHEMA && authority.decisionAuthority === 'ROOT_DIRECTED_ITEM_RECOVERY', 'ROOT_ITEM_RECOVERY_AUTHORITY_REQUIRED');
  assert(authority.runId === RUN_ID && authority.examUid === EXAM_UID && ['R1', 'R2'].includes(authority.stage), 'LOCKED_REPLACEMENT_SCOPE_TARGET_REQUIRED');
  assert(same(authority.scopeQids, SCOPE_QIDS) && same(authority.expectedQidOrder, FULL_QIDS), 'EXACT_Q17_Q20_SCOPE_AND_FULL_DENOMINATOR_REQUIRED');
  assert(same(authority.reuseOriginalQids, FULL_QIDS.filter(qid => !SCOPE_QIDS.includes(qid))), 'ORIGINAL_18_VALID_FREEZE_REUSE_REQUIRED');
  assert(same(authority.invalidOriginalQids, SCOPE_QIDS), 'ORIGINAL_Q17_Q20_INVALID_FREEZE_SCOPE_REQUIRED');
  assert(authority.rootDecision?.decisionAuthority === 'ROOT_DIRECTED_ITEM_RECOVERY' && same(authority.rootDecision.scopeQids, SCOPE_QIDS) && authority.rootDecision.remainingAfterR2 === true, 'ROOT_REPLACEMENT_DECISION_EVIDENCE_REQUIRED');
  assert(authority.freshReviewer?.reviewerIdentity?.role === `archive_${authority.stage.toLowerCase()}` && authority.freshReviewer.reviewerIdentity.reviewerId, 'FRESH_R1_OR_R2_REVIEWER_REQUIRED');
  assert(authority.freshReviewer.forkTurns === 'none' && authority.freshReviewer.reviewerIdentity.reviewerId !== authority.originalFreeze?.reviewerId, 'CLEAN_FRESH_REVIEW_SESSION_REQUIRED');

  const rosterBound = boundFile(repository, authority.lockedRoster, 'LOCKED_ROSTER');
  const roster = JSON.parse(rosterBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(roster.locked === true && roster.runId === RUN_ID && Array.isArray(roster.rows) && roster.rows.filter(row => row.examUid === EXAM_UID).length === 1, 'LOCKED_ROSTER_SCOPE_REQUIRED');
  const assignmentBound = boundFile(repository, authority.assignment, 'REPLACEMENT_SCOPE_ASSIGNMENT');
  const assignment = JSON.parse(assignmentBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(assignment, 'assignment');
  assert(assignment.runId === RUN_ID && assignment.examUid === EXAM_UID && assignment.stage === authority.stage && assignment.executionLine === 'CODEX' && assignment.qualityContractVersion === QUALITY_CONTRACT, 'CURRENT_CODEX_SCOPE_ASSIGNMENT_REQUIRED');
  assert(assignment.workingJsPrefreezePermission === 'HASH_ONLY_NO_TEXT_OR_PARSE', 'PREFREEZE_SOURCE_HASH_ONLY_PERMISSION_REQUIRED');
  assert(same(assignment.scopeQids, SCOPE_QIDS) && same(assignment.fullQidOrder, FULL_QIDS) && assignment.questionCount === FULL_QIDS.length, 'ASSIGNMENT_FULL_BANK_SCOPE_BINDING_REQUIRED');
  assert(assignment.expectedSourceRawSha256 === authority.source.rawSha256 && assignment.expectedSourceRawBufferGitBlobSha1 === authority.source.rawBufferGitBlobSha1, 'ASSIGNMENT_CURRENT_SOURCE_SHA_BINDING_MISMATCH');
  assert(path.resolve(assignment.workingJsAbsolute) === path.resolve(authority.source.path), 'ASSIGNMENT_SOURCE_PATH_MISMATCH');
  assert(path.resolve(assignment.studentBundleAbsolute) === path.resolve(authority.currentBundle.path) && assignment.studentBundleSha256 === authority.currentBundle.sha256, 'ASSIGNMENT_CURRENT_BUNDLE_BINDING_MISMATCH');
  assert(path.resolve(assignment.assetRootAbsolute) === path.resolve(authority.assetRootAbsolute), 'ASSIGNMENT_ASSET_ROOT_MISMATCH');

  const originalFreezeBound = boundFile(repository, authority.originalFreeze, 'OPAQUE_ORIGINAL_FREEZE');
  assert(authority.originalFreeze.opaque === true && authority.originalFreeze.stage === authority.stage && authority.originalFreeze.sourceRawSha256 === authority.oldBundle.sourceRawSha256, 'OPAQUE_ORIGINAL_FULL_FREEZE_BINDING_REQUIRED');
  const assetRoot = within(repository, authority.assetRootAbsolute, 'ASSET_ROOT');
  const oldBundle = safeBundle(repository, authority.oldBundle, authority.oldBundle.sourceRawSha256, authority.oldBundle.sourceRawBlobSha1, assetRoot, { oldScopedAssetsMayDrift: true });
  const currentBundle = safeBundle(repository, authority.currentBundle, authority.source.rawSha256, authority.source.rawBufferGitBlobSha1, assetRoot);
  assert(oldBundle.bundle.sourceRawSha256 === authority.originalFreeze.sourceRawSha256, 'OLD_BUNDLE_ORIGINAL_FREEZE_SOURCE_MISMATCH');
  const invariance = compareOldCurrent(oldBundle, currentBundle);
  const recoveryBound = boundFile(repository, authority.sourceRecoveryProvenance, 'SOURCE_RECOVERY_PROVENANCE');
  const recovery = JSON.parse(recoveryBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(recovery, 'sourceRecoveryProvenance');
  assert(recovery.schemaVersion === 'ROOT_ITEM_RECOVERY_SOURCE_PROVENANCE_V1' && recovery.runId === RUN_ID && recovery.examUid === EXAM_UID, 'ROOT_SOURCE_RECOVERY_PROVENANCE_REQUIRED');
  assert(same(recovery.scopeQids, SCOPE_QIDS) && recovery.disposition === 'ROOT_SOURCE_RECOVERY_Q17_Q20_ONLY', 'SOURCE_RECOVERY_QID_SCOPE_REQUIRED');
  assert(recovery.sourceRawSha256 === authority.source.rawSha256 && recovery.sourceRawBufferGitBlobSha1 === authority.source.rawBufferGitBlobSha1 && recovery.oldSourceRawSha256 === authority.oldBundle.sourceRawSha256, 'SOURCE_RECOVERY_HASH_BINDING_MISMATCH');
  assert(recovery.changedQids && same(recovery.changedQids, SCOPE_QIDS) && recovery.fullQuestionCount === FULL_QIDS.length, 'SOURCE_RECOVERY_FULL_DENOMINATOR_SCOPE_REQUIRED');

  const assetReads = verifyAssetReadProof(repository, authority, currentBundle);
  const sessionBound = boundFile(repository, authority.freshReviewer.sessionProof, 'FRESH_REVIEW_SESSION_PROOF');
  const session = JSON.parse(sessionBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(session, 'freshReviewerSessionProof');
  assert(session.schemaVersion === 'ROOT_FRESH_REPLACEMENT_SCOPE_SESSION_V1' && session.runId === RUN_ID && session.examUid === EXAM_UID && session.stage === authority.stage, 'FRESH_REVIEW_SESSION_PROOF_REQUIRED');
  assert(same(session.reviewerIdentity, authority.freshReviewer.reviewerIdentity) && session.forkTurns === 'none' && same(session.scopeQids, SCOPE_QIDS), 'FRESH_REVIEW_SESSION_BINDING_MISMATCH');
  assert(session.sourceRawSha256 === authority.source.rawSha256 && session.studentBundleSha256 === currentBundle.snapshot.sha256, 'FRESH_REVIEW_SESSION_INPUT_MISMATCH');
  const freezeOutput = within(repository, authority.scopeFreezeOutputAbsolute, 'SCOPE_FREEZE_OUTPUT');
  const disclosureOutput = within(repository, authority.postfreezeDisclosureOutputAbsolute, 'POSTFREEZE_DISCLOSURE_OUTPUT');
  assert(path.dirname(freezeOutput) === path.resolve(authority.evidenceRootAbsolute) && path.dirname(disclosureOutput) === path.resolve(authority.evidenceRootAbsolute), 'ROOT_EVIDENCE_OUTPUT_ROOT_REQUIRED');
  return { repository, authority, authSnapshot, rosterBound, assignmentBound, assignment, originalFreeze: originalFreezeBound, oldBundle, currentBundle, invariance, recoveryBound, recovery, assetRoot, assetReads, sessionBound, session, freezeOutput, disclosureOutput };
}

export function preflightReplacementScope({ root, authorityFile }) {
  const v = verifyAuthority({ root, authorityFile });
  return {
    status: 'PREFLIGHT_PASS_NOT_FROZEN', runId: RUN_ID, examUid: EXAM_UID, stage: v.authority.stage,
    scopeQids: SCOPE_QIDS, fullQuestionCount: FULL_QIDS.length, fullQidOrder: FULL_QIDS,
    currentSourceRawSha256: v.authority.source.rawSha256, currentSourceRawBufferGitBlobSha1: v.authority.source.rawBufferGitBlobSha1,
    oldBundleSha256: v.oldBundle.snapshot.sha256, currentBundleSha256: v.currentBundle.snapshot.sha256,
    originalFullFreezeOpaqueSha256: v.originalFreeze.snapshot.sha256, originalValidReuseQids: v.authority.reuseOriginalQids,
    changedStudentQids: v.invariance.changedQids, unchangedStudentQids: v.invariance.unchangedQids,
    scopedAssetAckCount: v.assetReads.proof.rows.length, reviewerIdentity: v.authority.freshReviewer.reviewerIdentity,
    freezeOutput: v.freezeOutput, oldFreezeParsed: false, rawSourceJsRead: false,
  };
}

export function freezeReplacementScope({ root, authorityFile, answersFile }) {
  const v = verifyAuthority({ root, authorityFile });
  const answerPath = within(v.repository, answersFile, 'FRESH_SCOPED_ANSWERS');
  const answerRef = physical(answerPath), packet = json(answerPath);
  noAnswerPayload(v.authority);
  assert(same(Object.keys(packet).sort(), ['answers', 'reviewerIdentity', 'schemaVersion'].sort()), 'SCOPED_ANSWER_PACKET_FIELDS_EXACT_REQUIRED');
  assert(packet.schemaVersion === 'ROOT_FRESH_REPLACEMENT_SCOPE_ANSWERS_V1' && same(packet.reviewerIdentity, v.authority.freshReviewer.reviewerIdentity), 'FRESH_SCOPED_REVIEWER_PACKET_REQUIRED');
  assert(Array.isArray(packet.answers) && packet.answers.length === 2 && same(packet.answers.map(row => row.qid), SCOPE_QIDS), 'EXACT_Q17_Q20_ANSWERS_REQUIRED');
  for (const row of packet.answers) {
    assert(same(Object.keys(row).sort(), ['independentAnswer', 'qid', 'reasoning'].sort()), 'SCOPED_ANSWER_FIELDS_EXACT_REQUIRED');
    assert((typeof row.independentAnswer === 'string' || typeof row.independentAnswer === 'number') && String(row.independentAnswer).trim(), 'SCOPED_INDEPENDENT_ANSWER_REQUIRED', String(row.qid));
    assert(typeof row.reasoning === 'string' && row.reasoning.trim(), 'SCOPED_REASONING_REQUIRED', String(row.qid));
  }
  const freeze = {
    schemaVersion: FREEZE_SCHEMA, status: 'FRESH_REPLACEMENT_SCOPE_FREEZE_ONLY', runId: RUN_ID, examUid: EXAM_UID,
    stage: v.authority.stage, qualityContractVersion: QUALITY_CONTRACT,
    reviewerIdentity: v.authority.freshReviewer.reviewerIdentity, frozenAt: new Date().toISOString(),
    scopeQids: SCOPE_QIDS, fullQidOrder: FULL_QIDS, fullQuestionCount: FULL_QIDS.length,
    fullCurrentStudentBundle: v.currentBundle.snapshot, fullStudentWhitelist: [...STUDENT_FIELDS],
    currentSource: { path: v.authority.source.path, rawSha256: v.authority.source.rawSha256, rawBufferGitBlobSha1: v.authority.source.rawBufferGitBlobSha1 },
    originalFullFreezeOpaque: { ...v.authority.originalFreeze, physical: v.originalFreeze.snapshot, invalidQids: SCOPE_QIDS, reusedUnchangedQids: v.authority.reuseOriginalQids, payloadParsed: false },
    rootDecision: v.authority.rootDecision,
    sourceRecoveryProvenance: v.recoveryBound.snapshot,
    fullStudentPayloadComparison: v.invariance,
    scopedAssetReadProof: v.assetReads.proofBound.snapshot,
    scopedAssetReads: v.assetReads.proof.rows,
    dependencyQids: v.authority.scopeDependenciesQids,
    rootAuthority: v.authSnapshot,
    reviewerSessionProof: v.sessionBound.snapshot,
    freshAnswerInput: answerRef,
    answers: packet.answers,
    stagePass: false, qualityVerdictCreated: false, dispatcherSlotReleased: false, rawSourceJsRead: false,
  };
  const result = writeFresh(v.freezeOutput, freeze);
  return { status: freeze.status, freeze: result, scopeQids: SCOPE_QIDS, fullQuestionCount: FULL_QIDS.length, stagePassClaimed: false };
}

function currentStudentProjection(question) {
  const student = Object.fromEntries([...STUDENT_FIELDS].filter(field => Object.hasOwn(question, field)).map(field => [field, question[field]]));
  if (Array.isArray(student.choices)) student.choices = student.choices.map(choice => choice && typeof choice === 'object' && !Array.isArray(choice) ? Object.fromEntries(Object.entries(choice).filter(([key]) => CHOICE_FIELDS.has(key))) : choice);
  return student;
}
function scopeSolutionAssets(question, assetRoot) {
  const refs = new Set();
  for (const value of [question.image, question.solutionImage, question.visualAsset, question.solution, question.explanation, question.sol]) {
    if (typeof value !== 'string') continue;
    if (value.startsWith('assets/images/')) refs.add(value);
    for (const match of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)) if (!/^(?:data:|#)/.test(match[1])) refs.add(match[1]);
  }
  return [...refs].sort().map(ref => {
    assert(ref.startsWith('assets/images/') && !ref.split('/').includes('..'), 'SCOPED_SOLUTION_ASSET_REF_INVALID', ref);
    const file = inside(assetRoot, ref), snapshot = physical(file);
    return { ref, ...snapshot };
  });
}
export function discloseReplacementScope({ root, authorityFile, freezeFile, freezeSha256 }) {
  const v = verifyAuthority({ root, authorityFile });
  const freezePath = within(v.repository, freezeFile, 'SCOPED_FREEZE');
  const freezeRef = physical(freezePath);
  assert(freezeRef.sha256 === freezeSha256 && path.resolve(freezePath) === v.freezeOutput, 'SCOPED_FREEZE_SHA_OR_PATH_MISMATCH');
  const freeze = json(freezePath);
  assert(freeze.schemaVersion === FREEZE_SCHEMA && freeze.status === 'FRESH_REPLACEMENT_SCOPE_FREEZE_ONLY', 'FRESH_REPLACEMENT_SCOPE_FREEZE_REQUIRED');
  assert(freeze.stage === v.authority.stage && same(freeze.scopeQids, SCOPE_QIDS) && same(freeze.fullQidOrder, FULL_QIDS) && freeze.fullQuestionCount === 20, 'SCOPED_FREEZE_TARGET_DENOMINATOR_MISMATCH');
  assert(same(freeze.reviewerIdentity, v.authority.freshReviewer.reviewerIdentity) && same(freeze.rootAuthority, v.authSnapshot), 'SCOPED_FREEZE_AUTHORITY_REVIEWER_MISMATCH');
  assert(same(freeze.fullCurrentStudentBundle, v.currentBundle.snapshot) && same(freeze.sourceRecoveryProvenance, v.recoveryBound.snapshot), 'SCOPED_FREEZE_INPUT_PROOF_CHANGED');
  assert(freeze.stagePass === false && freeze.qualityVerdictCreated === false && freeze.dispatcherSlotReleased === false, 'SCOPED_FREEZE_CANNOT_CLAIM_STAGE_CLOSURE');
  assert(v.originalFreeze.snapshot.sha256 === v.authority.originalFreeze.sha256, 'ORIGINAL_FULL_FREEZE_OPAQUE_SHA_CHANGED');
  const sourcePath = within(v.repository, v.authority.source.path, 'POSTFREEZE_SOURCE');
  const exam = readExam(sourcePath);
  assert(exam.rawSha256 === v.authority.source.rawSha256 && exam.rawBufferGitBlobSha1 === v.authority.source.rawBufferGitBlobSha1, 'POSTFREEZE_CURRENT_SOURCE_SHA_MISMATCH');
  assert(exam.questions.length === FULL_QIDS.length && same(exam.questions.map(question => Number(question.id ?? question.qid)), FULL_QIDS), 'POSTFREEZE_FULL_SOURCE_QID_ORDER_REQUIRED');
  const bundleRows = new Map(v.currentBundle.bundle.rows.map(row => [row.qid, row]));
  for (const question of exam.questions) {
    const qid = Number(question.id ?? question.qid), bundleRow = bundleRows.get(qid);
    assert(bundleRow && same(currentStudentProjection(question), currentStudentProjection(bundleRow.student)), 'POSTFREEZE_FULL_STUDENT_PARITY_REQUIRED', String(qid));
  }
  const disclosureRows = SCOPE_QIDS.map(qid => {
    const question = exam.questions.find(entry => Number(entry.id ?? entry.qid) === qid);
    const storedFields = Object.fromEntries(SCOPE_OUTPUT_FIELDS.filter(field => Object.hasOwn(question, field)).map(field => [field, question[field]]));
    const metaFields = Object.fromEntries(META_FIELDS.filter(field => Object.hasOwn(question, field)).map(field => [field, question[field]]));
    return { qid, storedFields, metaFields, solutionAssets: scopeSolutionAssets(question, v.assetRoot) };
  });
  const disclosure = {
    schemaVersion: DISCLOSURE_SCHEMA, status: 'POSTFREEZE_Q17_Q20_ONLY_DISCLOSURE', runId: RUN_ID, examUid: EXAM_UID,
    stage: v.authority.stage, scopeQids: SCOPE_QIDS, fullQidOrder: FULL_QIDS,
    scopeFreeze: freezeRef, currentFullStudentBundle: v.currentBundle.snapshot,
    currentSource: { ...physical(sourcePath), rawBufferGitBlobSha1: exam.rawBufferGitBlobSha1 },
    originalFullFreezeOpaque: v.originalFreeze.snapshot,
    fullStudentParity: 'EXACT_20_QID_BANK', rows: disclosureRows,
    nonScopeAnswersDisclosed: false, stagePassClaimed: false, disclosedAt: new Date().toISOString(),
  };
  const result = writeFresh(v.disclosureOutput, disclosure);
  return { status: disclosure.status, disclosure: result, disclosedQids: SCOPE_QIDS, fullStudentParity: disclosure.fullStudentParity, stagePassClaimed: false };
}

function parseArgs(argv) {
  const command = argv[0];
  if (!['preflight', 'freeze', 'disclose'].includes(command)) throw new Error('COMMAND_REQUIRED:preflight|freeze|disclose');
  const args = {};
  for (let index = 1; index < argv.length; index += 1) {
    const key = argv[index];
    if (!['--root', '--authority', '--answers', '--freeze', '--freeze-sha'].includes(key)) throw new Error('UNKNOWN_ARGUMENT:' + key);
    args[key.slice(2)] = argv[++index];
  }
  for (const key of ['root', 'authority']) if (!args[key]) throw new Error('REQUIRED_ARGUMENT:--' + key);
  if (command === 'freeze' && !args.answers) throw new Error('REQUIRED_ARGUMENT:--answers');
  if (command === 'disclose' && (!args.freeze || !args['freeze-sha'])) throw new Error('FREEZE_AND_SHA_REQUIRED');
  return { command, ...args };
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = args.command === 'preflight'
      ? preflightReplacementScope({ root: args.root, authorityFile: args.authority })
      : args.command === 'freeze'
        ? freezeReplacementScope({ root: args.root, authorityFile: args.authority, answersFile: args.answers })
        : discloseReplacementScope({ root: args.root, authorityFile: args.authority, freezeFile: args.freeze, freezeSha256: args['freeze-sha'] });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(String(error?.stack || error));
    process.exitCode = 1;
  }
}
