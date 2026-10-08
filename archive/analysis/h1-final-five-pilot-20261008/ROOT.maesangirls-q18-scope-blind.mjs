#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { inside, physical, readExam, sha256, writeFresh } from '../../tools/archive-codex-artifact-io.mjs';
import { normalizeStudentBundle, STUDENT_FIELDS, studentAssetRefs } from '../../tools/archive-student-bundle.mjs';

export const AUTHORITY_SCHEMA = 'ROOT_MAESANGIRLS_Q18_SCOPE_BLIND_AUTHORITY_V1';
export const FREEZE_SCHEMA = 'ROOT_MAESANGIRLS_Q18_SCOPE_FREEZE_V1';
export const DISCLOSURE_SCHEMA = 'ROOT_MAESANGIRLS_Q18_QID_POSTFREEZE_DISCLOSURE_V1';
export const RUN_ID = 'h1-final-five-pilot-20261008';
export const EXAM_UID = '21_매산여고_1학기_기말_고1_기출';
export const SCOPE_QIDS = Object.freeze([18]);
export const FULL_QIDS = Object.freeze(Array.from({ length: 22 }, (_, index) => index + 1));
const QUALITY_CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const CHOICE_FIELDS = new Set(['text', 'content', 'value', 'answer']);
const ANSWER_FIELDS = Object.freeze(['answer', 'solution', 'explanation', 'sol', 'decisiveStep', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']);
const META_FIELDS = Object.freeze(['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'problemTypeKey', 'templateKey', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']);
const FORBIDDEN = new Set(['answer', 'answers', 'independentanswer', 'storedanswer', 'solution', 'explanation', 'decisivestep', 'oldanswers', 'oldrows']);
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const hashJson = value => sha256(Buffer.from(JSON.stringify(value), 'utf8'));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const abs = value => typeof value === 'string' && path.isAbsolute(value);
function assert(condition, code, detail = '') { if (!condition) throw new Error(detail ? `${code}:${detail}` : code); }
function noAnswerPayload(value, at = 'packet') {
  if (Array.isArray(value)) { value.forEach((entry, index) => noAnswerPayload(entry, `${at}[${index}]`)); return; }
  if (!value || typeof value !== 'object') return;
  for (const [key, entry] of Object.entries(value)) {
    assert(!FORBIDDEN.has(key.toLowerCase()), 'ROOT_RECOVERY_PACKET_MUST_NOT_CARRY_ANSWER_PAYLOAD', `${at}.${key}`);
    noAnswerPayload(entry, `${at}.${key}`);
  }
}
function insideAbs(root, value, code) { assert(abs(value), `${code}_ABSOLUTE_PATH_REQUIRED`); return inside(root, value); }
function boundFile(root, ref, code) {
  assert(ref && /^[a-f0-9]{64}$/.test(ref.sha256 || ''), `${code}_SHA256_BINDING_REQUIRED`);
  const file = insideAbs(root, ref.path, `${code}_PATH`), snapshot = physical(file);
  assert(snapshot.sha256 === ref.sha256, `${code}_SHA256_MISMATCH`);
  return { file, snapshot, bytes: fs.readFileSync(file) };
}
function safeBundle(root, ref, sourceRawSha256, sourceRawBlobSha1, assetRoot, { oldScopedAssetsMayDrift = false } = {}) {
  const fileRef = boundFile(root, ref, 'SAFE_STUDENT_BUNDLE');
  const raw = JSON.parse(fileRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(raw.schemaVersion === 'JS_ARCHIVE_STUDENT_BUNDLE_V2' && same(raw.whitelist, [...STUDENT_FIELDS]), 'CURRENT_SAFE_STUDENT_BUNDLE_V2_WHITELIST_REQUIRED');
  assert(raw.sourceRawSha256 === sourceRawSha256 && raw.sourceRawBlobSha1 === sourceRawBlobSha1, 'SAFE_BUNDLE_SOURCE_BINDING_MISMATCH');
  assert(raw.questionCount === FULL_QIDS.length && same(raw.qids, FULL_QIDS) && Array.isArray(raw.rows) && raw.rows.length === FULL_QIDS.length, 'FULL_22_QID_STUDENT_BUNDLE_REQUIRED');
  assert(raw.extractionProvenance?.answersDisclosed === false && raw.extractionProvenance?.studentFieldsExactParity === true && raw.adapterProvenance?.answersRead === false, 'ANSWER_FREE_STUDENT_EXTRACTION_REQUIRED');
  const assetRootPath = path.resolve(assetRoot), rows = [];
  for (let index = 0; index < FULL_QIDS.length; index += 1) {
    const row = raw.rows[index], qid = FULL_QIDS[index];
    assert(Number(row.qid) === qid && row.student && typeof row.student === 'object' && !Array.isArray(row.student), 'SAFE_BUNDLE_ROW_INVALID', String(qid));
    assert(Object.keys(row.student).every(key => STUDENT_FIELDS.has(key)), 'SAFE_BUNDLE_STUDENT_FIELD_INVALID', String(qid));
    assert(row.student.id === undefined || Number(row.student.id) === qid, 'SAFE_BUNDLE_STUDENT_ID_MISMATCH', String(qid));
    assert(Array.isArray(row.assets), 'SAFE_BUNDLE_ASSET_LIST_REQUIRED', String(qid));
    const assets = [];
    for (const asset of row.assets) {
      assert(typeof asset.ref === 'string' && asset.ref.startsWith('assets/images/') && !asset.ref.split('/').includes('..') && abs(asset.path) && /^[a-f0-9]{64}$/.test(asset.sha256 || ''), 'SAFE_BUNDLE_ASSET_BINDING_INVALID', String(qid));
      const expected = path.resolve(assetRootPath, ...asset.ref.split('/'));
      assert(path.resolve(asset.path) === expected, 'SAFE_BUNDLE_ASSET_ROOT_MISMATCH', asset.ref);
      inside(assetRootPath, asset.ref);
      if (!(oldScopedAssetsMayDrift && SCOPE_QIDS.includes(qid))) assert(physical(expected).sha256 === asset.sha256, 'SAFE_BUNDLE_ASSET_SHA_MISMATCH', asset.ref);
      assets.push(structuredClone(asset));
    }
    for (const ref of studentAssetRefs(row.student)) assert(assets.some(asset => asset.ref === ref), 'SAFE_BUNDLE_REQUIRED_ASSET_MISSING', `${qid}:${ref}`);
    rows.push({ qid, student: structuredClone(row.student), assets });
  }
  if (!oldScopedAssetsMayDrift) normalizeStudentBundle(raw, { inputFile: fileRef.file, expectedSourceRawSha256: sourceRawSha256 });
  return { ...fileRef, raw, bundle: { schemaVersion: raw.schemaVersion, sourceRawSha256: raw.sourceRawSha256, sourceRawBlobSha1: raw.sourceRawBlobSha1, questionCount: raw.questionCount, qids: [...raw.qids], whitelist: [...raw.whitelist], rows } };
}
function projectRow(row) {
  const student = Object.fromEntries([...STUDENT_FIELDS].filter(key => Object.hasOwn(row.student, key)).map(key => [key, row.student[key]]));
  if (Array.isArray(student.choices)) student.choices = student.choices.map(choice => choice && typeof choice === 'object' && !Array.isArray(choice) ? Object.fromEntries(Object.entries(choice).filter(([key]) => CHOICE_FIELDS.has(key))) : choice);
  return { qid: row.qid, student, assets: row.assets.map(asset => ({ ref: asset.ref, path: path.resolve(asset.path), sha256: asset.sha256 })) };
}
function compareBundles(oldBundle, currentBundle) {
  const oldRows = new Map(oldBundle.bundle.rows.map(row => [row.qid, row])), currentRows = new Map(currentBundle.bundle.rows.map(row => [row.qid, row]));
  const changed = [], unchanged = [], outside = [], scoped = [];
  for (const qid of FULL_QIDS) {
    const before = oldRows.get(qid), now = currentRows.get(qid);
    assert(before && now, 'FULL_STUDENT_ROW_REQUIRED', String(qid));
    const oldHash = hashJson(projectRow(before)), currentHash = hashJson(projectRow(now));
    if (oldHash !== currentHash) changed.push(qid);
    if (qid === 18) scoped.push({ qid, oldHash, currentHash });
    else { unchanged.push(qid); outside.push({ qid, oldHash, unchanged: oldHash === currentHash }); }
  }
  assert(same(changed, SCOPE_QIDS), 'ONLY_Q18_STUDENT_OR_ASSET_PAYLOAD_MAY_CHANGE', changed.join(','));
  assert(outside.every(row => row.unchanged), 'OUTSIDE_21_STUDENT_AND_ASSET_PARITY_REQUIRED');
  return { changedQids: changed, unchangedQids: unchanged, outsideScopeDigest: hashJson(outside.map(({ qid, oldHash }) => ({ qid, oldHash }))), scopedChangeDigest: hashJson(scoped) };
}
function verifyAuthority({ root, authorityFile }) {
  const repo = fs.realpathSync(root), authorityPath = insideAbs(repo, authorityFile, 'ROOT_AUTHORITY');
  const authoritySnapshot = physical(authorityPath), authority = json(authorityPath);
  noAnswerPayload(authority, 'authority');
  assert(authority.schemaVersion === AUTHORITY_SCHEMA && authority.decisionAuthority === 'ROOT_DIRECTED_ITEM_RECOVERY', 'ROOT_ITEM_RECOVERY_AUTHORITY_REQUIRED');
  assert(authority.runId === RUN_ID && authority.examUid === EXAM_UID && ['R1', 'R2'].includes(authority.stage), 'LOCKED_TARGET_STAGE_REQUIRED');
  assert(same(authority.scopeQids, SCOPE_QIDS) && same(authority.fullQidOrder, FULL_QIDS), 'EXACT_Q18_SCOPE_FULL_22_QIDS_REQUIRED');
  assert(same(authority.invalidOriginalQids, SCOPE_QIDS) && same(authority.reusableCurrentBaselineQids, FULL_QIDS.filter(qid => qid !== 18)), 'ORIGINAL_Q18_HOLD_AND_21_REUSE_REQUIRED');
  assert(authority.rootDecision?.decisionAuthority === 'ROOT_DELEGATED' && same(authority.rootDecision.scopeQids, SCOPE_QIDS) && authority.rootDecision.remainingAfterR2 === true, 'ROOT_DECISION_SOURCE_HOLD_ADMISSION_REQUIRED');
  assert(authority.freshReviewer?.reviewerIdentity?.role === `archive_${authority.stage.toLowerCase()}` && authority.freshReviewer.forkTurns === 'none' && authority.freshReviewer.reviewerIdentity.reviewerId !== authority.originalFreeze?.reviewerId, 'CLEAN_FRESH_R1_R2_REVIEWER_REQUIRED');

  const rosterRef = boundFile(repo, authority.lockedRoster, 'LOCKED_ROSTER');
  const roster = JSON.parse(rosterRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(roster.locked === true && roster.runId === RUN_ID && roster.rows?.some(row => row.examUid === EXAM_UID), 'LOCKED_RUN_ROSTER_REQUIRED');
  const assignmentRef = boundFile(repo, authority.assignment, 'CURRENT_SCOPE_ASSIGNMENT');
  const assignment = JSON.parse(assignmentRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(assignment, 'assignment');
  assert(assignment.runId === RUN_ID && assignment.examUid === EXAM_UID && assignment.stage === authority.stage && assignment.executionLine === 'CODEX' && assignment.qualityContractVersion === QUALITY_CONTRACT, 'CURRENT_CODEX_ASSIGNMENT_REQUIRED');
  assert(assignment.workingJsPrefreezePermission === 'HASH_ONLY_NO_TEXT_OR_PARSE' && assignment.questionCount === 22 && same(assignment.fullQidOrder, FULL_QIDS) && same(assignment.scopeQids, SCOPE_QIDS), 'FULL_22_HASH_ONLY_ASSIGNMENT_REQUIRED');
  assert(assignment.expectedSourceRawSha256 === authority.source.rawSha256 && assignment.expectedSourceRawBufferGitBlobSha1 === authority.source.rawBufferGitBlobSha1 && path.resolve(assignment.workingJsAbsolute) === path.resolve(authority.source.path), 'ASSIGNMENT_CURRENT_SOURCE_BINDING_MISMATCH');
  assert(path.resolve(assignment.studentBundleAbsolute) === path.resolve(authority.currentBundle.path) && assignment.studentBundleSha256 === authority.currentBundle.sha256 && path.resolve(assignment.assetRootAbsolute) === path.resolve(authority.assetRootAbsolute), 'ASSIGNMENT_CURRENT_SAFE_BUNDLE_BINDING_MISMATCH');

  const originalFreeze = boundFile(repo, authority.originalFreeze, 'OPAQUE_ORIGINAL_FREEZE');
  assert(authority.originalFreeze.opaque === true && authority.originalFreeze.stage === authority.stage && authority.originalFreeze.sourceRawSha256 === authority.oldBundle.sourceRawSha256, 'ORIGINAL_FREEZE_OLD_SOURCE_BINDING_REQUIRED');
  const assetRoot = insideAbs(repo, authority.assetRootAbsolute, 'ASSET_ROOT');
  const oldBundle = safeBundle(repo, authority.oldBundle, authority.oldBundle.sourceRawSha256, authority.oldBundle.sourceRawBlobSha1, assetRoot, { oldScopedAssetsMayDrift: true });
  const currentBundle = safeBundle(repo, authority.currentBundle, authority.source.rawSha256, authority.source.rawBufferGitBlobSha1, assetRoot);
  const comparison = compareBundles(oldBundle, currentBundle);

  const rootDecisionRef = boundFile(repo, authority.rootDecision.proof, 'ROOT_DECISION_PROOF');
  const rootDecision = JSON.parse(rootDecisionRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(rootDecision, 'rootDecisionProof');
  assert(rootDecision.schemaVersion === 'ROOT_POST_R2_BOUNDED_ITEM_RECOVERY_DECISION_V1' && rootDecision.decisionAuthority === 'ROOT_DELEGATED' && rootDecision.runId === RUN_ID && rootDecision.examUid === EXAM_UID && same(rootDecision.scopeQids, SCOPE_QIDS) && rootDecision.remainingAfterR2 === true && rootDecision.sourceHoldRecordedInEvidence === true, 'ROOT_POST_R2_Q18_DECISION_PROOF_REQUIRED');
  const recoveryRef = boundFile(repo, authority.sourceRecoveryProvenance, 'SOURCE_RECOVERY_PROVENANCE');
  const recovery = JSON.parse(recoveryRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(recovery, 'sourceRecoveryProvenance');
  assert(recovery.schemaVersion === 'JS_ARCHIVE_ITEM_RECOVERY_NON_TARGET_INVARIANCE_V1' && recovery.runId === RUN_ID && recovery.examUid === EXAM_UID, 'Q18_NON_TARGET_INVARIANCE_SCHEMA_REQUIRED');
  assert(same(recovery.allowedQids, SCOPE_QIDS) && same(recovery.changedQids, SCOPE_QIDS) && recovery.currentQuestionCount === 22 && recovery.nonTargetQidCount === 21 && recovery.nonTargetMutationCount === 0, 'ROOT_Q18_SOURCE_RECOVERY_SCOPE_PROOF_REQUIRED');
  assert(recovery.currentSourceRawSha256 === authority.source.rawSha256 && recovery.sourceBeforeRecoveryRawSha256 === rootDecision.source.sha256, 'ROOT_Q18_SOURCE_RECOVERY_SHA_BINDING_MISMATCH');

  const sessionRef = boundFile(repo, authority.freshReviewer.sessionProof, 'FRESH_REVIEW_SESSION_PROOF');
  const session = JSON.parse(sessionRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(session, 'freshReviewerSessionProof');
  assert(session.schemaVersion === 'ROOT_FRESH_Q18_SCOPE_REVIEW_SESSION_V1' && session.runId === RUN_ID && session.examUid === EXAM_UID && session.stage === authority.stage && session.forkTurns === 'none' && same(session.reviewerIdentity, authority.freshReviewer.reviewerIdentity) && same(session.scopeQids, SCOPE_QIDS), 'FRESH_Q18_REVIEW_SESSION_BINDING_REQUIRED');
  assert(session.sourceRawSha256 === authority.source.rawSha256 && session.studentBundleSha256 === currentBundle.snapshot.sha256, 'FRESH_Q18_SESSION_INPUT_SHA_MISMATCH');

  const assetProofRef = boundFile(repo, authority.scopedAssetReadProof, 'SCOPED_ASSET_READ_PROOF');
  const assetProof = JSON.parse(assetProofRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  noAnswerPayload(assetProof, 'scopedAssetReadProof');
  assert(assetProof.schemaVersion === 'ROOT_Q18_SCOPE_ASSET_READS_V1' && assetProof.runId === RUN_ID && assetProof.examUid === EXAM_UID && assetProof.stage === authority.stage && same(assetProof.reviewerIdentity, authority.freshReviewer.reviewerIdentity), 'Q18_SCOPED_ASSET_REVIEWER_BINDING_REQUIRED');
  assert(Array.isArray(authority.scopeDependenciesQids) && authority.scopeDependenciesQids.includes(18) && authority.scopeDependenciesQids.every(qid => FULL_QIDS.includes(qid)), 'Q18_SCOPE_DEPENDENCIES_REQUIRED');
  const requiredAssets = currentBundle.bundle.rows.filter(row => authority.scopeDependenciesQids.includes(row.qid)).flatMap(row => row.assets.map(asset => ({ qid: row.qid, ref: asset.ref, sha256: asset.sha256 })));
  const ackKey = row => `${row.qid}\u0000${row.ref}\u0000${row.sha256}`;
  assert(Array.isArray(assetProof.rows) && assetProof.rows.every(row => row.opened === true && row.openedAt) && same(assetProof.rows.map(ackKey).sort(), requiredAssets.map(ackKey).sort()), 'Q18_REQUIRED_ASSETS_ACTUALLY_OPENED');

  const freezeOutput = insideAbs(repo, authority.scopeFreezeOutputAbsolute, 'Q18_SCOPE_FREEZE_OUTPUT');
  const disclosureOutput = insideAbs(repo, authority.postfreezeDisclosureOutputAbsolute, 'Q18_DISCLOSURE_OUTPUT');
  assert(path.dirname(freezeOutput) === path.resolve(authority.evidenceRootAbsolute) && path.dirname(disclosureOutput) === path.resolve(authority.evidenceRootAbsolute), 'Q18_OUTPUT_EVIDENCE_ROOT_REQUIRED');
  return { repo, authority, authoritySnapshot, rosterRef, assignmentRef, originalFreeze, oldBundle, currentBundle, comparison, rootDecisionRef, rootDecision, recoveryRef, recovery, sessionRef, session, assetProofRef, assetProof, assetRoot, freezeOutput, disclosureOutput };
}

export function preflightQ18Scope({ root, authorityFile }) {
  const v = verifyAuthority({ root, authorityFile });
  return { status: 'PREFLIGHT_PASS_NOT_FROZEN', runId: RUN_ID, examUid: EXAM_UID, stage: v.authority.stage, scopeQids: SCOPE_QIDS, fullQidOrder: FULL_QIDS,
    currentSourceRawSha256: v.authority.source.rawSha256, currentSourceRawBufferGitBlobSha1: v.authority.source.rawBufferGitBlobSha1,
    oldBundleSha256: v.oldBundle.snapshot.sha256, currentBundleSha256: v.currentBundle.snapshot.sha256,
    originalFreezeOpaqueSha256: v.originalFreeze.snapshot.sha256, changedStudentQids: v.comparison.changedQids, unchangedStudentQids: v.comparison.unchangedQids,
    scopedAssetAckCount: v.assetProof.rows.length, reviewerIdentity: v.authority.freshReviewer.reviewerIdentity, freezeOutput: v.freezeOutput, rawSourceJsRead: false, oldFreezeParsed: false };
}

export function freezeQ18Scope({ root, authorityFile, answersFile }) {
  const v = verifyAuthority({ root, authorityFile });
  const answerPath = insideAbs(v.repo, answersFile, 'Q18_ANSWERS'), packet = json(answerPath), answerRef = physical(answerPath);
  noAnswerPayload(v.authority);
  assert(same(Object.keys(packet).sort(), ['answers', 'reviewerIdentity', 'schemaVersion'].sort()) && packet.schemaVersion === 'ROOT_FRESH_Q18_SCOPE_ANSWERS_V1' && same(packet.reviewerIdentity, v.authority.freshReviewer.reviewerIdentity), 'Q18_FRESH_ANSWER_PACKET_SCHEMA_REQUIRED');
  assert(Array.isArray(packet.answers) && packet.answers.length === 1 && packet.answers[0].qid === 18, 'EXACT_ONE_Q18_ANSWER_REQUIRED');
  const answer = packet.answers[0];
  assert(same(Object.keys(answer).sort(), ['independentAnswer', 'qid', 'reasoning'].sort()) && (typeof answer.independentAnswer === 'string' || typeof answer.independentAnswer === 'number') && String(answer.independentAnswer).trim() && typeof answer.reasoning === 'string' && answer.reasoning.trim(), 'Q18_FRESH_ANSWER_FIELDS_REQUIRED');
  const freeze = { schemaVersion: 'ROOT_MAESANGIRLS_Q18_SCOPE_FREEZE_V1', status: 'FRESH_Q18_SCOPE_FREEZE_ONLY', runId: RUN_ID, examUid: EXAM_UID, stage: v.authority.stage,
    qualityContractVersion: QUALITY_CONTRACT, reviewerIdentity: v.authority.freshReviewer.reviewerIdentity, frozenAt: new Date().toISOString(),
    scopeQids: SCOPE_QIDS, fullQidOrder: FULL_QIDS, fullQuestionCount: 22, currentFullSafeStudentBundle: v.currentBundle.snapshot,
    currentSource: { path: v.authority.source.path, rawSha256: v.authority.source.rawSha256, rawBufferGitBlobSha1: v.authority.source.rawBufferGitBlobSha1 },
    originalFullFreezeOpaque: { ...v.authority.originalFreeze, physical: v.originalFreeze.snapshot, invalidQids: [18], reusableCurrentBaselineQids: FULL_QIDS.filter(qid => qid !== 18), payloadParsed: false },
    rootDecisionProof: v.rootDecisionRef.snapshot, sourceRecoveryProvenance: v.recoveryRef.snapshot, nonTargetStudentAssetComparison: v.comparison,
    scopedAssetReadProof: v.assetProofRef.snapshot, scopedAssetReads: v.assetProof.rows, reviewerSessionProof: v.sessionRef.snapshot,
    rootAuthority: v.authoritySnapshot, freshAnswerInput: answerRef, answers: [answer], stagePass: false, qualityVerdictCreated: false, dispatcherSlotReleased: false, rawSourceJsRead: false };
  const result = writeFresh(v.freezeOutput, freeze);
  return { status: freeze.status, freeze: result, scopeQids: SCOPE_QIDS, fullQuestionCount: 22, stagePassClaimed: false };
}

function currentStudentProjection(question) {
  const student = Object.fromEntries([...STUDENT_FIELDS].filter(field => Object.hasOwn(question, field)).map(field => [field, question[field]]));
  if (Array.isArray(student.choices)) student.choices = student.choices.map(choice => choice && typeof choice === 'object' && !Array.isArray(choice) ? Object.fromEntries(Object.entries(choice).filter(([key]) => CHOICE_FIELDS.has(key))) : choice);
  return student;
}
function answerAssetRefs(question) {
  const refs = new Set();
  for (const value of [question.image, question.solutionImage, question.visualAsset, question.solution, question.explanation, question.sol]) {
    if (typeof value !== 'string') continue;
    if (value.startsWith('assets/images/')) refs.add(value);
    for (const match of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)) if (!/^(?:data:|#)/.test(match[1])) refs.add(match[1]);
  }
  return [...refs].sort();
}
export function discloseQ18Scope({ root, authorityFile, freezeFile, freezeSha256 }) {
  const v = verifyAuthority({ root, authorityFile }), freezePath = insideAbs(v.repo, freezeFile, 'Q18_SCOPE_FREEZE'), freezeRef = physical(freezePath);
  assert(freezeRef.sha256 === freezeSha256 && freezePath === v.freezeOutput, 'Q18_SCOPE_FREEZE_SHA_OR_PATH_MISMATCH');
  const freeze = json(freezePath);
  assert(freeze.schemaVersion === 'ROOT_MAESANGIRLS_Q18_SCOPE_FREEZE_V1' && freeze.status === 'FRESH_Q18_SCOPE_FREEZE_ONLY' && freeze.stage === v.authority.stage && same(freeze.scopeQids, SCOPE_QIDS) && same(freeze.fullQidOrder, FULL_QIDS) && freeze.fullQuestionCount === 22, 'Q18_FULLBANK_SCOPE_FREEZE_REQUIRED');
  assert(same(freeze.reviewerIdentity, v.authority.freshReviewer.reviewerIdentity) && same(freeze.currentFullSafeStudentBundle, v.currentBundle.snapshot) && same(freeze.rootAuthority, v.authoritySnapshot), 'Q18_FREEZE_AUTHORITY_OR_SOURCE_BINDING_MISMATCH');
  assert(freeze.stagePass === false && freeze.qualityVerdictCreated === false && freeze.dispatcherSlotReleased === false, 'Q18_FREEZE_CANNOT_CLAIM_STAGE_COMPLETION');
  assert(v.originalFreeze.snapshot.sha256 === v.authority.originalFreeze.sha256, 'Q18_ORIGINAL_FREEZE_OPAQUE_SHA_CHANGED');
  const sourcePath = insideAbs(v.repo, v.authority.source.path, 'Q18_POSTFREEZE_SOURCE'), exam = readExam(sourcePath);
  assert(exam.rawSha256 === v.authority.source.rawSha256 && exam.rawBufferGitBlobSha1 === v.authority.source.rawBufferGitBlobSha1, 'Q18_POSTFREEZE_SOURCE_SHA_MISMATCH');
  assert(exam.questions.length === FULL_QIDS.length && same(exam.questions.map(question => Number(question.id ?? question.qid)), FULL_QIDS), 'Q18_POSTFREEZE_FULL_QID_ORDER_REQUIRED');
  const bundleRows = new Map(v.currentBundle.bundle.rows.map(row => [row.qid, row]));
  for (const question of exam.questions) {
    const qid = Number(question.id ?? question.qid), row = bundleRows.get(qid);
    assert(row && same(currentStudentProjection(question), currentStudentProjection(row.student)), 'Q18_POSTFREEZE_FULL_STUDENT_PARITY_REQUIRED', String(qid));
  }
  const question = exam.questions.find(row => Number(row.id ?? row.qid) === 18);
  const storedFields = Object.fromEntries([...ANSWER_FIELDS, ...META_FIELDS].filter(field => Object.hasOwn(question, field)).map(field => [field, question[field]]));
  const solutionAssets = answerAssetRefs(question).map(ref => { assert(ref.startsWith('assets/images/') && !ref.split('/').includes('..'), 'Q18_ANSWER_ASSET_REF_INVALID'); const file = inside(v.assetRoot, ref); return { ref, ...physical(file) }; });
  const disclosure = { schemaVersion: DISCLOSURE_SCHEMA, status: 'POSTFREEZE_Q18_ONLY_DISCLOSURE', runId: RUN_ID, examUid: EXAM_UID, stage: v.authority.stage,
    scopeQids: SCOPE_QIDS, fullQidOrder: FULL_QIDS, scopeFreeze: freezeRef, currentSource: { ...physical(sourcePath), rawBufferGitBlobSha1: exam.rawBufferGitBlobSha1 },
    currentFullSafeStudentBundle: v.currentBundle.snapshot, originalFullFreezeOpaque: v.originalFreeze.snapshot,
    fullStudentParity: 'EXACT_22_QID_BANK', rows: [{ qid: 18, storedFields, solutionAssets }], nonScopeAnswersDisclosed: false, stagePassClaimed: false, disclosedAt: new Date().toISOString() };
  const result = writeFresh(v.disclosureOutput, disclosure);
  return { status: disclosure.status, disclosure: result, disclosedQids: SCOPE_QIDS, stagePassClaimed: false };
}

function parseArgs(argv) {
  const command = argv[0]; if (!['preflight', 'freeze', 'disclose'].includes(command)) throw new Error('COMMAND_REQUIRED:preflight|freeze|disclose');
  const args = {}; for (let i = 1; i < argv.length; i += 1) { const key = argv[i]; if (!['--root', '--authority', '--answers', '--freeze', '--freeze-sha'].includes(key)) throw new Error('UNKNOWN_ARGUMENT:'+key); args[key.slice(2)] = argv[++i]; }
  if (!args.root || !args.authority) throw new Error('ROOT_AND_AUTHORITY_REQUIRED');
  if (command === 'freeze' && !args.answers) throw new Error('ANSWERS_FILE_REQUIRED');
  if (command === 'disclose' && (!args.freeze || !args['freeze-sha'])) throw new Error('FREEZE_AND_SHA_REQUIRED');
  return { command, ...args };
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const a = parseArgs(process.argv.slice(2));
    const out = a.command === 'preflight' ? preflightQ18Scope({ root: a.root, authorityFile: a.authority }) : a.command === 'freeze' ? freezeQ18Scope({ root: a.root, authorityFile: a.authority, answersFile: a.answers }) : discloseQ18Scope({ root: a.root, authorityFile: a.authority, freezeFile: a.freeze, freezeSha256: a['freeze-sha'] });
    console.log(JSON.stringify(out, null, 2));
  } catch (error) { console.error(String(error?.stack || error)); process.exitCode = 1; }
}
