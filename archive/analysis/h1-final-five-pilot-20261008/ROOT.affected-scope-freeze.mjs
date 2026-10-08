#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { inside, physical, readExam, sha256, writeFresh } from '../../tools/archive-codex-artifact-io.mjs';
import { normalizeStudentBundle, STUDENT_FIELDS, studentAssetRefs } from '../../tools/archive-student-bundle.mjs';

export const AUTHORITY_SCHEMA = 'ROOT_AFFECTED_SCOPE_FREEZE_AUTHORITY_V1';
export const SCOPE_FREEZE_SCHEMA = 'ROOT_AFFECTED_QID_IMMUTABLE_FREEZE_V1';
export const SCOPE_DISCLOSURE_SCHEMA = 'ROOT_AFFECTED_QID_POSTFREEZE_DISCLOSURE_V1';
export const INVARIANCE_SCHEMA = 'ROOT_AFFECTED_STUDENT_SOURCE_INVARIANCE_V1';
export const QID_SCOPE = Object.freeze([14]);
export const FULL_QIDS = Object.freeze(Array.from({ length: 20 }, (_, index) => index + 1));
const QUALITY_CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const FORBIDDEN_AUTHORITY_KEYS = new Set(['answer', 'answers', 'independentanswer', 'storedanswer', 'solution', 'explanation', 'decisivestep', 'oldanswers', 'oldrows']);
const CHOICE_FIELDS = new Set(['text', 'content', 'value', 'answer']);
const POSTFREEZE_FIELDS = Object.freeze(['answer', 'solution', 'explanation', 'sol', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'decisiveStep']);
const META_FIELDS = Object.freeze(['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'problemTypeKey', 'templateKey', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'decisiveStep']);
const hashJson = value => sha256(Buffer.from(JSON.stringify(value), 'utf8'));
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const absolute = value => typeof value === 'string' && path.isAbsolute(value);
function assert(condition, code, detail = '') { if (!condition) throw new Error(detail ? `${code}:${detail}` : code); }
function sortedQids(values) { return [...values].sort((a, b) => a - b); }
function assertNoAnswerPayload(value, at = 'authority') {
  if (Array.isArray(value)) { value.forEach((entry, index) => assertNoAnswerPayload(entry, `${at}[${index}]`)); return; }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    assert(!FORBIDDEN_AUTHORITY_KEYS.has(key.toLowerCase()), 'ROOT_AUTHORITY_MUST_NOT_CARRY_ANSWER_PAYLOAD', `${at}.${key}`);
    assertNoAnswerPayload(nested, `${at}.${key}`);
  }
}
function resolveInside(root, value, code) {
  assert(absolute(value), `${code}_ABSOLUTE_PATH_REQUIRED`);
  return inside(root, value);
}
function readBoundFile(root, ref, code) {
  assert(ref && /^[a-f0-9]{64}$/.test(ref.sha256 || ''), `${code}_BINDING_REQUIRED`);
  const file = resolveInside(root, ref.path, `${code}_PATH`);
  const snapshot = physical(file);
  assert(snapshot.sha256 === ref.sha256, `${code}_SHA256_MISMATCH`);
  return { file, snapshot, bytes: fs.readFileSync(file) };
}
function normalizedBundle(root, ref, expectedSourceSha256, expectedBlobSha1) {
  const bound = readBoundFile(root, ref, 'STUDENT_BUNDLE');
  const raw = JSON.parse(bound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(raw.schemaVersion === 'JS_ARCHIVE_STUDENT_BUNDLE_V2', 'CURRENT_SAFE_STUDENT_BUNDLE_V2_REQUIRED');
  assert(Array.isArray(raw.whitelist) && same(raw.whitelist, [...STUDENT_FIELDS]), 'STUDENT_WHITELIST_EXACT_PARITY_REQUIRED');
  const bundle = normalizeStudentBundle(raw, { inputFile: bound.file, expectedSourceRawSha256: expectedSourceSha256 });
  assert(bundle.sourceRawSha256 === expectedSourceSha256, 'STUDENT_BUNDLE_SOURCE_SHA256_MISMATCH');
  if (expectedBlobSha1) assert(bundle.sourceRawBlobSha1 === expectedBlobSha1, 'STUDENT_BUNDLE_SOURCE_BLOB_SHA1_MISMATCH');
  assert(bundle.questionCount === FULL_QIDS.length && same(bundle.qids, FULL_QIDS), 'FULL_CURRENT_STUDENT_QID_ORDER_REQUIRED');
  assert(raw.extractionProvenance?.answersDisclosed === false && raw.extractionProvenance?.studentFieldsExactParity === true, 'CURRENT_SAFE_EXTRACTION_PROVENANCE_REQUIRED');
  assert(raw.adapterProvenance?.answersRead === false && raw.adapterProvenance?.studentFieldsDropped?.length === 0, 'SAFE_BUNDLE_ADAPTER_PROVENANCE_REQUIRED');
  return { ...bound, raw, bundle };
}
function projectRow(row) {
  return {
    qid: row.qid,
    student: canonicalStudentProjection(row.student),
    assets: row.assets.map(asset => ({ ref: asset.ref, path: path.resolve(asset.path), sha256: asset.sha256 })),
  };
}
function canonicalStudentProjection(student) {
  const projected = Object.fromEntries([...STUDENT_FIELDS].filter(field => Object.hasOwn(student, field)).map(field => [field, student[field]]));
  if (Array.isArray(projected.choices)) projected.choices = projected.choices.map(choice => choice && typeof choice === 'object' && !Array.isArray(choice) ? Object.fromEntries(Object.entries(choice).filter(([key]) => CHOICE_FIELDS.has(key))) : choice);
  return projected;
}
export function compareStudentBundles({ oldBundle, currentBundle, scopeQids = QID_SCOPE }) {
  assert(same(scopeQids, QID_SCOPE), 'AFFECTED_QID_SCOPE_MUST_BE_EXACTLY_14');
  assert(oldBundle.questionCount === FULL_QIDS.length && currentBundle.questionCount === FULL_QIDS.length, 'FULL_STUDENT_BUNDLE_DENOMINATOR_REQUIRED');
  assert(same(oldBundle.qids, FULL_QIDS) && same(currentBundle.qids, FULL_QIDS), 'FULL_STUDENT_BUNDLE_ORDER_REQUIRED');
  const oldByQid = new Map(oldBundle.rows.map(row => [row.qid, row]));
  const currentByQid = new Map(currentBundle.rows.map(row => [row.qid, row]));
  const changedQids = [];
  const outsidePairs = [];
  const scopedPairDigests = [];
  for (const qid of FULL_QIDS) {
    const oldRow = oldByQid.get(qid), currentRow = currentByQid.get(qid);
    assert(oldRow && currentRow, 'FULL_STUDENT_QID_ROW_REQUIRED', String(qid));
    const oldProjection = projectRow(oldRow), currentProjection = projectRow(currentRow);
    const oldDigest = hashJson(oldProjection), currentDigest = hashJson(currentProjection);
    if (oldDigest !== currentDigest) changedQids.push(qid);
    if (scopeQids.includes(qid)) scopedPairDigests.push({ qid, oldDigest, currentDigest });
    else outsidePairs.push({ qid, digest: oldDigest, unchanged: oldDigest === currentDigest });
  }
  assert(same(changedQids, scopeQids), 'ONLY_AFFECTED_QID_STUDENT_PAYLOAD_MAY_CHANGE', changedQids.join(','));
  assert(outsidePairs.every(row => row.unchanged), 'OUTSIDE_SCOPE_STUDENT_OR_ASSET_PARITY_REQUIRED');
  const outsideScopeComparisonSha256 = hashJson(outsidePairs.map(({ qid, digest }) => ({ qid, digest })));
  const scopedChangeSha256 = hashJson(scopedPairDigests);
  const comparison = {
    schemaVersion: INVARIANCE_SCHEMA,
    scopeQids,
    fullQidOrder: FULL_QIDS,
    oldBundleSha256: oldBundle.sourceRef.sha256,
    currentBundleSha256: currentBundle.sourceRef.sha256,
    changedQids,
    unchangedQids: outsidePairs.map(row => row.qid),
    outsideScopeComparisonSha256,
    scopedChangeSha256,
    comparisonSha256: hashJson({ scopeQids, fullQidOrder: FULL_QIDS, oldBundleSha256: oldBundle.sourceRef.sha256, currentBundleSha256: currentBundle.sourceRef.sha256, changedQids, outsideScopeComparisonSha256, scopedChangeSha256 }),
    outsideScopeStudentAndAssetParity: true,
  };
  return comparison;
}
export function compareStudentBundleFiles({ root, oldBundleRef, currentBundleRef, oldSourceRawSha256, oldSourceRawBlobSha1, currentSourceRawSha256, currentSourceRawBlobSha1 }) {
  const repository = fs.realpathSync(root);
  const old = normalizedBundle(repository, oldBundleRef, oldSourceRawSha256, oldSourceRawBlobSha1);
  const current = normalizedBundle(repository, currentBundleRef, currentSourceRawSha256, currentSourceRawBlobSha1);
  return compareStudentBundles({
    oldBundle: { ...old.bundle, sourceRef: old.snapshot },
    currentBundle: { ...current.bundle, sourceRef: current.snapshot },
    scopeQids: QID_SCOPE,
  });
}
function exactAssetReadProof(root, authority, currentBundle) {
  const proofBound = readBoundFile(root, authority.scopedAssetReadProof, 'SCOPED_ASSET_READ_PROOF');
  const proof = JSON.parse(proofBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(proof.schemaVersion === 'ROOT_AFFECTED_SCOPE_ASSET_READS_V1' && proof.runId === authority.runId && proof.examUid === authority.examUid && proof.stage === authority.stage, 'SCOPED_ASSET_READ_PROOF_SCOPE_REQUIRED');
  assert(same(proof.reviewerIdentity, authority.freshReviewer.reviewerIdentity), 'SCOPED_ASSET_REVIEWER_IDENTITY_MISMATCH');
  assert(Array.isArray(authority.scopeDependenciesQids) && authority.scopeDependenciesQids.includes(14) && authority.scopeDependenciesQids.every(qid => FULL_QIDS.includes(qid)), 'SCOPED_DEPENDENCY_QIDS_REQUIRED');
  const neededQids = new Set(authority.scopeDependenciesQids);
  const needed = [];
  for (const row of currentBundle.rows) {
    if (!neededQids.has(row.qid)) continue;
    for (const asset of row.assets) needed.push({ qid: row.qid, ref: asset.ref, sha256: asset.sha256 });
  }
  const actual = proof.rows;
  assert(Array.isArray(actual) && actual.every(row => row.opened === true && typeof row.openedAt === 'string' && Number.isInteger(row.qid)), 'ACTUAL_SCOPED_ASSET_OPEN_ACK_REQUIRED');
  const key = row => `${row.qid}\u0000${row.ref}\u0000${row.sha256}`;
  assert(new Set(actual.map(key)).size === actual.length, 'SCOPED_ASSET_OPEN_ACK_DUPLICATE');
  assert(same(actual.map(key).sort(), needed.map(key).sort()), 'SCOPED_ASSET_OPEN_ACK_SET_MISMATCH');
  return { proofBound, proof, rows: needed };
}
function validateAuthority({ root, authorityFile }) {
  const repository = fs.realpathSync(root);
  const authorityBound = readBoundFile(repository, { path: authorityFile, sha256: physical(authorityFile).sha256 }, 'ROOT_AUTHORITY');
  const authority = JSON.parse(authorityBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assertNoAnswerPayload(authority);
  assert(authority.schemaVersion === AUTHORITY_SCHEMA && authority.decisionAuthority === 'ROOT_DIRECTED_AFFECTED_QID_ONLY', 'ROOT_AFFECTED_SCOPE_AUTHORITY_REQUIRED');
  assert(authority.runId === 'h1-final-five-pilot-20261008' && authority.examUid === '21_매산고_1학기_기말_고1_기출', 'LOCKED_RUN_EXAM_SCOPE_REQUIRED');
  assert(['R1', 'R2'].includes(authority.stage) && same(authority.scopeQids, QID_SCOPE) && same(authority.expectedQidOrder, FULL_QIDS), 'EXACT_Q14_SCOPE_AND_FULL_BANK_REQUIRED');
  assert(authority.invalidOriginalQids?.length === 1 && same(authority.invalidOriginalQids, QID_SCOPE), 'ORIGINAL_FREEZE_Q14_INVALID_SCOPE_REQUIRED');
  assert(same(authority.reuseOriginalQids, FULL_QIDS.filter(qid => qid !== 14)), 'ORIGINAL_FREEZE_19_VALID_SCOPE_PRESERVATION_REQUIRED');
  assert(authority.freshReviewer?.reviewerIdentity?.role === `archive_${authority.stage.toLowerCase()}` && authority.freshReviewer.reviewerIdentity.reviewerId, 'FRESH_STAGE_REVIEWER_IDENTITY_REQUIRED');
  assert(authority.freshReviewer.reviewerIdentity.reviewerId !== authority.originalFreeze?.reviewerId, 'FRESH_REVIEWER_SESSION_REQUIRED');
  assert(authority.freshReviewer.sessionCreatedWithForkTurns === 'none', 'FRESH_CLEAN_REVIEW_SESSION_REQUIRED');

  const rosterBound = readBoundFile(repository, authority.lockedRoster, 'LOCKED_ROSTER');
  const roster = JSON.parse(rosterBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(roster.locked === true && roster.runId === authority.runId && Array.isArray(roster.rows), 'LOCKED_RUN_ROSTER_REQUIRED');
  const targetRows = roster.rows.filter(row => row.examUid === authority.examUid);
  assert(targetRows.length === 1, 'LOCKED_ROSTER_TARGET_CARDINALITY_INVALID');

  const assignmentBound = readBoundFile(repository, authority.assignment, 'AFFECTED_SCOPE_ASSIGNMENT');
  const assignment = JSON.parse(assignmentBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(assignment.runId === authority.runId && assignment.examUid === authority.examUid && assignment.stage === authority.stage && assignment.qualityContractVersion === QUALITY_CONTRACT && assignment.executionLine === 'CODEX', 'CURRENT_AFFECTED_SCOPE_ASSIGNMENT_REQUIRED');
  assert(assignment.workingJsPrefreezePermission === 'HASH_ONLY_NO_TEXT_OR_PARSE', 'PREFREEZE_RAW_SOURCE_PROHIBITION_REQUIRED');
  assert(same(assignment.scopeQids, QID_SCOPE) && assignment.questionCount === FULL_QIDS.length && same(assignment.fullQidOrder, FULL_QIDS), 'ASSIGNMENT_SCOPE_AND_DENOMINATOR_BINDING_REQUIRED');
  assert(assignment.expectedSourceRawSha256 === authority.source.rawSha256 && assignment.expectedSourceRawBufferGitBlobSha1 === authority.source.rawBufferGitBlobSha1, 'ASSIGNMENT_SOURCE_BINDING_MISMATCH');
  assert(path.resolve(assignment.workingJsAbsolute) === path.resolve(authority.source.path), 'ASSIGNMENT_WORKING_SOURCE_PATH_MISMATCH');
  assert(path.resolve(assignment.studentBundleAbsolute) === path.resolve(authority.currentBundle.path) && assignment.studentBundleSha256 === authority.currentBundle.sha256, 'ASSIGNMENT_CURRENT_BUNDLE_BINDING_MISMATCH');
  assert(path.resolve(assignment.assetRootAbsolute) === path.resolve(authority.assetRootAbsolute), 'ASSIGNMENT_ASSET_ROOT_MISMATCH');

  const originalFreeze = readBoundFile(repository, authority.originalFreeze, 'OPAQUE_ORIGINAL_FULL_FREEZE');
  assert(authority.originalFreeze.opaque === true && authority.originalFreeze.stage === 'R1' && authority.originalFreeze.sourceRawSha256 === authority.oldBundle.sourceRawSha256, 'OPAQUE_ORIGINAL_FREEZE_BINDING_REQUIRED');
  const oldBundle = normalizedBundle(repository, authority.oldBundle, authority.oldBundle.sourceRawSha256, authority.oldBundle.sourceRawBlobSha1);
  const currentBundle = normalizedBundle(repository, authority.currentBundle, authority.source.rawSha256, authority.source.rawBufferGitBlobSha1);
  assert(oldBundle.bundle.sourceRawSha256 === authority.originalFreeze.sourceRawSha256, 'OLD_BUNDLE_ORIGINAL_FREEZE_SOURCE_MISMATCH');
  const sourcePreimage = readBoundFile(repository, authority.sourcePreimage, 'ORIGINAL_FULL_SOURCE_PREIMAGE');
  assert(authority.sourcePreimage.fullQuestionCount === FULL_QIDS.length && authority.sourcePreimage.rawSha256 === oldBundle.bundle.sourceRawSha256 && sourcePreimage.snapshot.sha256 === authority.sourcePreimage.rawSha256, 'ORIGINAL_FULL_SOURCE_PREIMAGE_BINDING_REQUIRED');
  const repairProvenance = readBoundFile(repository, authority.sourceRepairProvenance, 'Q14_SOURCE_REPAIR_PROVENANCE');
  assert(same(authority.sourceRepairProvenance.scopeQids, QID_SCOPE) && authority.sourceRepairProvenance.fullQuestionCount === FULL_QIDS.length, 'Q14_SOURCE_REPAIR_SCOPE_PROOF_REQUIRED');
  assert(authority.sourceRepairProvenance.sourcePreimageSha256 === sourcePreimage.snapshot.sha256 && authority.sourceRepairProvenance.currentSourceRawSha256 === authority.source.rawSha256, 'Q14_SOURCE_REPAIR_PROVENANCE_BINDING_MISMATCH');
  const comparison = compareStudentBundles({ oldBundle: { ...oldBundle.bundle, sourceRef: oldBundle.snapshot }, currentBundle: { ...currentBundle.bundle, sourceRef: currentBundle.snapshot }, scopeQids: authority.scopeQids });
  const invarianceBound = readBoundFile(repository, authority.bundleInvarianceEvidence, 'ROOT_BUNDLE_INVARIANCE_EVIDENCE');
  const invariance = JSON.parse(invarianceBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(invariance.schemaVersion === INVARIANCE_SCHEMA && invariance.status === 'PASS' && invariance.runId === authority.runId && invariance.examUid === authority.examUid, 'ROOT_AUTHORED_BUNDLE_INVARIANCE_EVIDENCE_REQUIRED');
  for (const field of ['scopeQids', 'fullQidOrder', 'oldBundleSha256', 'currentBundleSha256', 'changedQids', 'unchangedQids', 'outsideScopeComparisonSha256', 'scopedChangeSha256', 'comparisonSha256', 'outsideScopeStudentAndAssetParity']) {
    assert(same(invariance[field], comparison[field]), 'ROOT_BUNDLE_INVARIANCE_EVIDENCE_MISMATCH', field);
  }

  assert(absolute(authority.sourceRootPdf.path), 'SOURCE_ROOT_PDF_ABSOLUTE_PATH_REQUIRED');
  const sourceRootPdfPath = fs.realpathSync(authority.sourceRootPdf.path);
  const sourceRootPdf = physical(sourceRootPdfPath);
  assert(sourceRootPdf.sha256 === authority.sourceRootPdf.sha256 && targetRows[0].sha256 === sourceRootPdf.sha256 && path.resolve(targetRows[0].pdfAbsolute) === sourceRootPdfPath, 'LOCKED_SOURCE_ROOT_PDF_BINDING_REQUIRED');
  const restorationBound = readBoundFile(repository, authority.sourceRestorationProof, 'SOURCE_ROOT_PDF_RESTORATION_PROOF');
  const restoration = JSON.parse(restorationBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(restoration.schemaVersion === 'ROOT_SOURCE_ROOT_PDF_RESTORATION_PROOF_V1' && restoration.runId === authority.runId && restoration.examUid === authority.examUid && restoration.disposition === 'RESTORED_FROM_LOCKED_SOURCE_ROOT_PDF', 'SOURCE_ROOT_PDF_RESTORATION_PROOF_REQUIRED');
  assert(path.resolve(restoration.sourceRootPdf.path) === sourceRootPdfPath && restoration.sourceRootPdf.sha256 === sourceRootPdf.sha256, 'SOURCE_ROOT_PDF_RESTORATION_BINDING_MISMATCH');
  assert(restoration.sourceExtractionProof?.path && /^[a-f0-9]{64}$/.test(restoration.sourceExtractionProof.sha256 || ''), 'SOURCE_EXTRACTION_RESTORATION_REFERENCE_REQUIRED');
  const sourceExtractionProofPath = resolveInside(repository, restoration.sourceExtractionProof.path, 'SOURCE_EXTRACTION_RESTORATION_REFERENCE');
  assert(physical(sourceExtractionProofPath).sha256 === restoration.sourceExtractionProof.sha256, 'SOURCE_EXTRACTION_RESTORATION_SHA_MISMATCH');

  const assetRoot = resolveInside(repository, authority.assetRootAbsolute, 'ASSET_ROOT');
  const assetReadProof = exactAssetReadProof(repository, authority, currentBundle.bundle);
  const sessionBound = readBoundFile(repository, authority.freshReviewer.sessionProof, 'FRESH_REVIEW_SESSION_PROOF');
  const sessionProof = JSON.parse(sessionBound.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(sessionProof.schemaVersion === 'ROOT_FRESH_AFFECTED_REVIEW_SESSION_V1' && sessionProof.runId === authority.runId && sessionProof.examUid === authority.examUid && sessionProof.stage === authority.stage, 'FRESH_REVIEW_SESSION_PROOF_REQUIRED');
  assert(same(sessionProof.reviewerIdentity, authority.freshReviewer.reviewerIdentity) && sessionProof.forkTurns === 'none' && sessionProof.scopeQids && same(sessionProof.scopeQids, QID_SCOPE), 'FRESH_REVIEW_SESSION_SCOPE_MISMATCH');
  assert(sessionProof.sourceRawSha256 === authority.source.rawSha256 && sessionProof.studentBundleSha256 === authority.currentBundle.sha256, 'FRESH_REVIEW_SESSION_INPUT_BINDING_MISMATCH');

  const scopeFreezeOutputPath = resolveInside(repository, authority.scopeFreezeOutputAbsolute, 'SCOPE_FREEZE_OUTPUT');
  assert(path.dirname(scopeFreezeOutputPath) === path.resolve(authority.evidenceRootAbsolute), 'SCOPE_FREEZE_EVIDENCE_ROOT_REQUIRED');
  return {
    repository, authority, authorityBound, rosterBound, roster, targetRow: targetRows[0], assignmentBound, assignment,
    originalFreeze: { ...authority.originalFreeze, snapshot: originalFreeze.snapshot }, sourcePreimage: sourcePreimage.snapshot, repairProvenance: repairProvenance.snapshot, oldBundle, currentBundle, comparison,
    invarianceBound, invariance, sourceRootPdf, restorationBound, restoration, sourceExtractionProofPath,
    assetRoot, assetReadProof, sessionBound, sessionProof, scopeFreezeOutputPath,
  };
}

export function preflightAffectedScope({ root, authorityFile }) {
  const validated = validateAuthority({ root, authorityFile });
  return {
    status: 'PREFLIGHT_PASS_NOT_FROZEN',
    runId: validated.authority.runId,
    examUid: validated.authority.examUid,
    stage: validated.authority.stage,
    rootAuthority: validated.authorityBound.snapshot,
    scopeQids: QID_SCOPE,
    fullQidOrder: FULL_QIDS,
    sourceRawSha256: validated.authority.source.rawSha256,
    sourceRawBufferGitBlobSha1: validated.authority.source.rawBufferGitBlobSha1,
    oldBundleSha256: validated.oldBundle.snapshot.sha256,
    currentBundleSha256: validated.currentBundle.snapshot.sha256,
    oldFullFreezeOpaqueSha256: validated.originalFreeze.snapshot.sha256,
    sourceRootPdfSha256: validated.sourceRootPdf.sha256,
    comparisonSha256: validated.comparison.comparisonSha256,
    scopedAssetAckCount: validated.assetReadProof.rows.length,
    reviewerIdentity: validated.authority.freshReviewer.reviewerIdentity,
    freezeOutputPath: validated.scopeFreezeOutputPath,
    originalFreezePayloadParsed: false,
    rawSourceJsRead: false,
  };
}

export function freezeAffectedScope({ root, authorityFile, answersFile }) {
  const validated = validateAuthority({ root, authorityFile });
  const answerPath = resolveInside(validated.repository, answersFile, 'FRESH_SCOPE_ANSWERS');
  const answerBytes = fs.readFileSync(answerPath);
  const answerRef = physical(answerPath);
  const input = JSON.parse(answerBytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(same(Object.keys(input).sort(), ['answers', 'reviewerIdentity', 'schemaVersion'].sort()), 'FRESH_SCOPE_ANSWER_PACKET_FIELDS_EXACT_REQUIRED');
  assert(input.schemaVersion === 'ROOT_FRESH_AFFECTED_QID_ANSWERS_V1', 'FRESH_AFFECTED_QID_ANSWERS_SCHEMA_REQUIRED');
  assert(same(input.reviewerIdentity, validated.authority.freshReviewer.reviewerIdentity), 'FRESH_AFFECTED_QID_REVIEWER_IDENTITY_MISMATCH');
  assert(Array.isArray(input.answers) && input.answers.length === 1, 'ONE_AFFECTED_QID_ANSWER_REQUIRED');
  const answer = input.answers[0];
  assert(Object.keys(answer).sort().join(',') === ['independentAnswer', 'qid', 'reasoning'].sort().join(','), 'FRESH_AFFECTED_QID_ANSWER_FIELDS_EXACT_REQUIRED');
  assert(Number(answer.qid) === 14 && (typeof answer.independentAnswer === 'string' || typeof answer.independentAnswer === 'number') && String(answer.independentAnswer).trim(), 'FRESH_Q14_INDEPENDENT_ANSWER_REQUIRED');
  assert(typeof answer.reasoning === 'string' && answer.reasoning.trim(), 'FRESH_Q14_REASONING_REQUIRED');
  const freeze = {
    schemaVersion: SCOPE_FREEZE_SCHEMA,
    status: 'FRESH_SCOPE_FREEZE_ONLY',
    runId: validated.authority.runId,
    examUid: validated.authority.examUid,
    stage: validated.authority.stage,
    rootAuthority: validated.authorityBound.snapshot,
    qualityContractVersion: QUALITY_CONTRACT,
    reviewerIdentity: validated.authority.freshReviewer.reviewerIdentity,
    frozenAt: new Date().toISOString(),
    scopeQids: QID_SCOPE,
    fullQidOrder: FULL_QIDS,
    fullQuestionCount: FULL_QIDS.length,
    fullCurrentStudentBundle: validated.currentBundle.snapshot,
    fullWhitelist: [...STUDENT_FIELDS],
    sourceRawSha256: validated.authority.source.rawSha256,
    sourceRawBufferGitBlobSha1: validated.authority.source.rawBufferGitBlobSha1,
    oldFullFreezeOpaque: {
      ...validated.originalFreeze,
      invalidQids: validated.authority.invalidOriginalQids,
      reusedUnchangedQids: validated.authority.reuseOriginalQids,
      payloadParsed: false,
      oldAnswersWerePrefreezeInputs: false,
    },
    originalFullSourcePreimageOpaque: validated.sourcePreimage,
    q14SourceRepairProvenance: validated.repairProvenance,
    oldCurrentBundleComparison: validated.comparison,
    rootBundleInvarianceEvidence: validated.invarianceBound.snapshot,
    sourceRootPdfRestorationProof: validated.restorationBound.snapshot,
    freshReviewerSessionProof: validated.sessionBound.snapshot,
    scopedAssetReadProof: validated.assetReadProof.proofBound.snapshot,
    scopedAssetReads: validated.assetReadProof.proof.rows,
    dependencyQids: validated.authority.scopeDependenciesQids,
    answerDraftInput: answerRef,
    answers: [{ qid: 14, independentAnswer: answer.independentAnswer, reasoning: answer.reasoning }],
    stagePass: false,
    qualityVerdictCreated: false,
    dispatcherSlotReleased: false,
    rawSourceJsRead: false,
  };
  const result = writeFresh(validated.scopeFreezeOutputPath, freeze);
  return { status: freeze.status, freeze: result, freezeSha256: result.sha256, scopeQids: QID_SCOPE, fullQuestionCount: FULL_QIDS.length, genericStagePassClaimed: false };
}

function studentProjection(question) {
  return canonicalStudentProjection(question);
}
function solutionAssetRefs(question) {
  const refs = new Set();
  for (const value of [question.image, question.solutionImage, question.visualAsset, question.solution, question.explanation, question.sol]) {
    if (typeof value === 'string') {
      if (value.startsWith('assets/images/')) refs.add(value);
      for (const match of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)) if (!/^(?:data:|#)/.test(match[1])) refs.add(match[1]);
    }
  }
  return [...refs];
}
function sourceQuestionParity({ questions, bundle }) {
  assert(questions.length === FULL_QIDS.length, 'POSTFREEZE_CURRENT_SOURCE_DENOMINATOR_REQUIRED');
  assert(same(questions.map(question => Number(question.id ?? question.qid)), FULL_QIDS), 'POSTFREEZE_CURRENT_SOURCE_QID_ORDER_REQUIRED');
  const byQid = new Map(bundle.rows.map(row => [row.qid, row]));
  for (const question of questions) {
    const qid = Number(question.id ?? question.qid), before = byQid.get(qid);
    assert(before && same(studentProjection(question), canonicalStudentProjection(before.student)), 'POSTFREEZE_CURRENT_STUDENT_FIELDS_PARITY_REQUIRED', String(qid));
  }
}
export function discloseAffectedScope({ root, authorityFile, scopeFreezeFile, scopeFreezeSha256 }) {
  const validated = validateAuthority({ root, authorityFile });
  const freezePath = resolveInside(validated.repository, scopeFreezeFile, 'SCOPE_FREEZE');
  const freezeRef = physical(freezePath);
  assert(freezeRef.sha256 === scopeFreezeSha256 && path.resolve(freezePath) === validated.scopeFreezeOutputPath, 'SCOPE_FREEZE_SHA_OR_PATH_MISMATCH');
  const freeze = json(freezePath);
  assert(freeze.schemaVersion === SCOPE_FREEZE_SCHEMA && freeze.status === 'FRESH_SCOPE_FREEZE_ONLY', 'IMMUTABLE_AFFECTED_SCOPE_FREEZE_REQUIRED');
  assert(freeze.runId === validated.authority.runId && freeze.examUid === validated.authority.examUid && freeze.stage === validated.authority.stage, 'SCOPE_FREEZE_TARGET_MISMATCH');
  assert(same(freeze.rootAuthority, validated.authorityBound.snapshot), 'SCOPE_FREEZE_ROOT_AUTHORITY_CHANGED');
  assert(same(freeze.scopeQids, QID_SCOPE) && same(freeze.fullQidOrder, FULL_QIDS) && freeze.fullQuestionCount === FULL_QIDS.length, 'SCOPE_FREEZE_FULL_BANK_BINDING_REQUIRED');
  assert(same(freeze.reviewerIdentity, validated.authority.freshReviewer.reviewerIdentity) && freeze.reviewerIdentity.reviewerId !== validated.authority.originalFreeze.reviewerId, 'SCOPE_FREEZE_REVIEWER_SESSION_MISMATCH');
  assert(same(freeze.fullCurrentStudentBundle, validated.currentBundle.snapshot) && freeze.sourceRawSha256 === validated.authority.source.rawSha256 && freeze.sourceRawBufferGitBlobSha1 === validated.authority.source.rawBufferGitBlobSha1, 'SCOPE_FREEZE_INPUT_BINDING_MISMATCH');
  assert(same(freeze.oldCurrentBundleComparison, validated.comparison) && freeze.rootBundleInvarianceEvidence.sha256 === validated.invarianceBound.snapshot.sha256, 'SCOPE_FREEZE_INVARIANCE_EVIDENCE_MISMATCH');
  assert(same(freeze.originalFullSourcePreimageOpaque, validated.sourcePreimage) && same(freeze.q14SourceRepairProvenance, validated.repairProvenance), 'SCOPE_FREEZE_SOURCE_REPAIR_PROVENANCE_MISMATCH');
  assert(same(freeze.scopedAssetReadProof, validated.assetReadProof.proofBound.snapshot) && same(freeze.scopedAssetReads, validated.assetReadProof.proof.rows), 'SCOPE_FREEZE_ASSET_READ_PROOF_MISMATCH');
  assert(Array.isArray(freeze.answers) && freeze.answers.length === 1 && Number(freeze.answers[0].qid) === 14, 'SCOPE_FREEZE_MUST_CONTAIN_Q14_ONLY');
  assert(freeze.stagePass === false && freeze.qualityVerdictCreated === false && freeze.dispatcherSlotReleased === false && freeze.rawSourceJsRead === false, 'SCOPE_FREEZE_MUST_NOT_CLAIM_STAGE_CLOSURE');
  assert(validated.originalFreeze.snapshot.sha256 === validated.authority.originalFreeze.sha256, 'ORIGINAL_FULL_FREEZE_OPAQUE_SHA_CHANGED');

  const sourcePath = resolveInside(validated.repository, validated.authority.source.path, 'POSTFREEZE_SOURCE');
  const exam = readExam(sourcePath);
  assert(exam.rawSha256 === validated.authority.source.rawSha256 && exam.rawBufferGitBlobSha1 === validated.authority.source.rawBufferGitBlobSha1, 'POSTFREEZE_SOURCE_RAW_BINDING_MISMATCH');
  sourceQuestionParity({ questions: exam.questions, bundle: validated.currentBundle.bundle });
  const question = exam.questions.find(item => Number(item.id ?? item.qid) === 14);
  assert(question, 'POSTFREEZE_Q14_SOURCE_REQUIRED');
  const solutionAssets = [];
  for (const ref of solutionAssetRefs(question)) {
    assert(ref.startsWith('assets/images/') && !ref.split('/').includes('..'), 'POSTFREEZE_Q14_ASSET_REF_INVALID', ref);
    const file = inside(validated.assetRoot, ref), asset = physical(file);
    solutionAssets.push({ ref, path: asset.path, sha256: asset.sha256 });
  }
  const storedFields = Object.fromEntries(POSTFREEZE_FIELDS.filter(field => Object.hasOwn(question, field)).map(field => [field, question[field]]));
  const metaFields = Object.fromEntries(META_FIELDS.filter(field => Object.hasOwn(question, field)).map(field => [field, question[field]]));
  const output = {
    schemaVersion: SCOPE_DISCLOSURE_SCHEMA,
    status: 'POSTFREEZE_Q14_ONLY_DISCLOSURE',
    runId: validated.authority.runId,
    examUid: validated.authority.examUid,
    stage: validated.authority.stage,
    scopeQids: QID_SCOPE,
    fullQidOrder: FULL_QIDS,
    scopeFreeze: freezeRef,
    currentFullStudentBundle: validated.currentBundle.snapshot,
    currentSource: { ...physical(sourcePath), rawBufferGitBlobSha1: exam.rawBufferGitBlobSha1 },
    sourceStudentParity: 'EXACT_FULL_BANK_20',
    originalFullFreezeOpaque: validated.originalFreeze.snapshot,
    rows: [{ qid: 14, storedFields, metaFields, solutionAssets }],
    disclosedAt: new Date().toISOString(),
    nonScopeAnswersDisclosed: false,
    stagePassClaimed: false,
  };
  const outputPath = resolveInside(validated.repository, validated.authority.postfreezeDisclosureOutputAbsolute, 'POSTFREEZE_DISCLOSURE_OUTPUT');
  assert(path.dirname(outputPath) === path.resolve(validated.authority.evidenceRootAbsolute), 'POSTFREEZE_DISCLOSURE_EVIDENCE_ROOT_REQUIRED');
  const result = writeFresh(outputPath, output);
  return { status: output.status, disclosure: result, disclosedQids: QID_SCOPE, fullStudentParity: output.sourceStudentParity, stagePassClaimed: false };
}

function parseArgs(argv) {
  const command = argv[0];
  if (!['compare', 'preflight', 'freeze', 'disclose'].includes(command)) throw new Error('COMMAND_REQUIRED:compare|preflight|freeze|disclose');
  const args = {};
  for (let index = 1; index < argv.length; index += 1) {
    const key = argv[index];
    if (!['--root', '--authority', '--answers', '--freeze', '--freeze-sha', '--old-bundle', '--old-sha', '--old-source-sha', '--old-source-blob-sha', '--current-bundle', '--current-sha', '--current-source-sha', '--current-source-blob-sha'].includes(key)) throw new Error('UNKNOWN_ARGUMENT:' + key);
    args[key.slice(2)] = argv[++index];
  }
  if (command === 'compare') {
    for (const key of ['root', 'old-bundle', 'old-sha', 'old-source-sha', 'old-source-blob-sha', 'current-bundle', 'current-sha', 'current-source-sha', 'current-source-blob-sha']) if (!args[key]) throw new Error('REQUIRED_ARGUMENT:--' + key);
    return { command, ...args };
  }
  for (const key of ['root', 'authority']) if (!args[key]) throw new Error('REQUIRED_ARGUMENT:--' + key);
  if (command === 'freeze' && !args.answers) throw new Error('REQUIRED_ARGUMENT:--answers');
  if (command === 'disclose' && (!args.freeze || !args['freeze-sha'])) throw new Error('FREEZE_AND_SHA_REQUIRED');
  return { command, ...args };
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = args.command === 'compare'
      ? { status: 'COMPARISON_READY_ROOT_MUST_AUTHOR_EVIDENCE', comparison: compareStudentBundleFiles({ root: args.root, oldBundleRef: { path: args['old-bundle'], sha256: args['old-sha'] }, currentBundleRef: { path: args['current-bundle'], sha256: args['current-sha'] }, oldSourceRawSha256: args['old-source-sha'], oldSourceRawBlobSha1: args['old-source-blob-sha'], currentSourceRawSha256: args['current-source-sha'], currentSourceRawBlobSha1: args['current-source-blob-sha'] }) }
      : args.command === 'preflight'
      ? preflightAffectedScope({ root: args.root, authorityFile: args.authority })
      : args.command === 'freeze'
        ? freezeAffectedScope({ root: args.root, authorityFile: args.authority, answersFile: args.answers })
        : discloseAffectedScope({ root: args.root, authorityFile: args.authority, scopeFreezeFile: args.freeze, scopeFreezeSha256: args['freeze-sha'] });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(String(error?.stack || error));
    process.exitCode = 1;
  }
}
