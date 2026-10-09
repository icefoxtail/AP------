#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import gate from '../generated-meta-retention-gate.cjs';

const ROOT_PREFIXES = ['archive/', 'alive/'];
const HEX64 = /^[a-f0-9]{64}$/i;
const HEX40 = /^[a-f0-9]{40}$/i;
const { validateMeta, validateAuthorityBinding, validateMetaTaxonomyBindings } = gate;
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const TOP_LEVEL_META_FIELDS = ['problemTypeKey', 'templateKey', 'secondaryConceptKeys', 'crossConceptKeys', 'conditionKeys', 'integrationPattern'];

const sorted = value => Array.isArray(value) ? value.map(sorted) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])])) : value;
export const canonicalMeta = value => JSON.stringify(sorted(value));
export const metaSha256 = value => crypto.createHash('sha256').update(canonicalMeta(value)).digest('hex');
export const sha256Bytes = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const gitBlobSha = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

function repoFile(root, relative, label) {
  if (typeof relative !== 'string' || relative.includes('\\') || path.posix.isAbsolute(relative) || relative.split('/').includes('..') || !ROOT_PREFIXES.some(prefix => relative.startsWith(prefix))) {
    throw new Error(`${label}_PATH_INVALID`);
  }
  const full = path.resolve(root, relative);
  const resolvedRoot = path.resolve(root) + path.sep;
  if (!full.startsWith(resolvedRoot)) throw new Error(`${label}_PATH_OUT_OF_ROOT`);
  return full;
}

function parseJsonFile(file, label) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { throw new Error(`${label}_JSON_INVALID:${error.message}`); }
}

function assertMetaValid(meta) {
  const issues = validateMeta(meta);
  if (issues.length) throw new Error(`APPROVED_META_INVALID:${issues.join('|')}`);
}

function labelOf(value) { return typeof value === 'string' ? value.split('|').at(-1).trim() : ''; }

function exactOne(items, predicate, label) {
  const found = items.filter(predicate);
  if (found.length !== 1) throw new Error(`${label}_NOT_UNIQUE`);
  return found[0];
}

function readSource(bytes, filename) {
  const sandbox = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), sandbox, { timeout: 2000, filename });
  if (!Array.isArray(sandbox.window.questionBank)) throw new Error('SOURCE_QUESTION_BANK_INVALID');
  return { questionBank: sandbox.window.questionBank, examTitle: sandbox.window.examTitle };
}

function bodyProjection(question) {
  const result = structuredClone(question);
  for (const key of ['uid', 'difficultyBucket', 'level', 'meta', 'metaFinalSha256', 'metaReviewEvidence', 'metaReviewEvidenceSha256',
    'problemTypeKey', 'templateKey', 'secondaryConceptKeys', 'crossConceptKeys', 'conditionKeys', 'integrationPattern']) delete result[key];
  return result;
}

function verifyReviewEvidence(root, binding, uid, metaDigest) {
  if (!binding || typeof binding !== 'object' || typeof binding.path !== 'string' || !['alive/06_EXECUTION/', 'archive/analysis/'].some(prefix => binding.path.startsWith(prefix)) || !HEX64.test(binding.sha256 || '')) throw new Error('REVIEW_EVIDENCE_BINDING_REQUIRED');
  const file = repoFile(root, binding.path, 'REVIEW_EVIDENCE');
  const bytes = fs.readFileSync(file);
  if (sha256Bytes(bytes) !== binding.sha256.toLowerCase()) throw new Error('REVIEW_EVIDENCE_BYTES_MISMATCH');
  const evidence = parseJsonFile(file, 'REVIEW_EVIDENCE');
  if (evidence.schemaVersion !== 'GENERATED_META_REVIEW_EVIDENCE_V1' || !Array.isArray(evidence.items)) throw new Error('REVIEW_EVIDENCE_SCHEMA_INVALID');
  const item = exactOne(evidence.items, row => row?.uid === uid, 'REVIEW_EVIDENCE_UID');
  const status = item.reviewStatus;
  if (!['REVIEW_PASS', 'REVIEW_APPROVED', 'USER_DIRECTED_OPERATING_APPROVED', 'USER_DIRECTED_QUALITY_APPROVED'].includes(status)) throw new Error('REVIEW_EVIDENCE_STATUS_NOT_APPROVED');
  if (binding.reviewStatus !== status) throw new Error('REVIEW_EVIDENCE_STATUS_BINDING_MISMATCH');
  if (item.metaFinalSha256 !== metaDigest) throw new Error('REVIEW_EVIDENCE_META_SHA_MISMATCH');
  if (status === 'USER_DIRECTED_QUALITY_APPROVED' && (!Array.isArray(item.scopeUids) || !item.scopeUids.includes(uid) || typeof item.approvalBasis !== 'string' || !item.approvalBasis.startsWith('USER_DIRECTED_QUALITY_APPROVED'))) throw new Error('USER_DIRECTED_APPROVAL_SCOPE_BINDING_INVALID');
  return {
    path: binding.path, sha256: binding.sha256.toLowerCase(), reviewStatus: status,
    ...(status === 'USER_DIRECTED_QUALITY_APPROVED' ? { approvalBasis: item.approvalBasis, scopeUids: item.scopeUids } : {})
  };
}

function writeJson(value) { return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8'); }

function preflightTarget(root, relative, expectedSha256, label) {
  const file = repoFile(root, relative, label);
  if (!HEX64.test(expectedSha256 || '')) throw new Error(`${label}_EXPECTED_SHA256_REQUIRED`);
  const before = fs.readFileSync(file);
  if (sha256Bytes(before) !== expectedSha256.toLowerCase()) throw new Error(`${label}_CAS_CONFLICT`);
  return { file, before };
}

function atomicReplace(files, beforeReplace) {
  const nonce = `${process.pid}-${crypto.randomBytes(8).toString('hex')}`;
  const staged = [];
  const replaced = [];
  const lock = `${files.find(entry => entry.label === 'consumerIndex')?.file || files.at(-1).file}.meta-register.lock`;
  let lockFd;
  try {
    try { lockFd = fs.openSync(lock, 'wx'); }
    catch { throw new Error('REGISTRATION_LOCK_BUSY'); }
    for (const entry of files) {
      if (sha256Bytes(fs.readFileSync(entry.file)) !== entry.expectedSha256) throw new Error(`${entry.label.toUpperCase()}_CAS_CONFLICT`);
    }
    for (const entry of files) {
      const temp = `${entry.file}.tmp-${nonce}`;
      const fd = fs.openSync(temp, 'wx');
      try { fs.writeFileSync(fd, entry.after); fs.fsyncSync(fd); }
      finally { fs.closeSync(fd); }
      staged.push({ ...entry, temp });
    }
    for (let index = 0; index < staged.length; index++) {
      const entry = staged[index];
      if (beforeReplace) beforeReplace(entry, index);
      fs.renameSync(entry.temp, entry.file);
      replaced.push(entry);
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const entry of replaced.reverse()) {
      try { fs.writeFileSync(entry.file, entry.before); } catch (rollbackError) { rollbackErrors.push(`${entry.file}:${rollbackError.message}`); }
    }
    if (rollbackErrors.length) throw new Error(`REGISTRATION_ROLLBACK_FAILED:${rollbackErrors.join('|')};cause=${error.message}`);
    throw new Error(`REGISTRATION_WRITE_ROLLED_BACK:${error.message}`);
  } finally {
    for (const entry of staged) { try { fs.unlinkSync(entry.temp); } catch { /* already renamed or absent */ } }
    if (lockFd !== undefined) { try { fs.closeSync(lockFd); } catch { /* already closed */ } try { fs.unlinkSync(lock); } catch { /* lock was removed */ } }
  }
}

/** Persist one already-approved Meta payload across its authority, generated source, Consumer shard and index.
 * Caller supplies expected SHA-256 values for all four mutable files as CAS guards.
 */
export function registerApprovedGeneratedMeta({ root, uid, meta, reviewEvidence, approval, paths, expectedSha256, newRegistration }, options = {}) {
  if (typeof uid !== 'string' || !uid.trim()) throw new Error('UID_REQUIRED');
  if (newRegistration && !/^ALITE-[A-Za-z0-9-]+$/.test(uid)) throw new Error('NEW_UID_RUNTIME_UID_INVALID');
  if (!approval || !['REVIEW_PASS', 'REVIEW_APPROVED', 'USER_DIRECTED_OPERATING_APPROVED', 'USER_DIRECTED_QUALITY_APPROVED'].includes(approval.status)) throw new Error('APPROVAL_STATUS_REQUIRED');
  assertMetaValid(meta);
  if (approval.status !== reviewEvidence?.reviewStatus) throw new Error('APPROVAL_STATUS_REVIEW_EVIDENCE_MISMATCH');
  if (!paths?.sourceShard?.startsWith('archive/generated/lite/v1/') || !paths?.sourceMetadata?.startsWith('archive/generated/lite/v1/') || !paths?.consumerShard?.startsWith('archive/data/generated-lite-consumer/v1/shards/') || paths?.consumerIndex !== 'archive/data/generated-lite-consumer/v1/index.json') throw new Error('REGISTRATION_TARGET_PATH_OUT_OF_SCOPE');
  const metadataForSource = paths.sourceShard.replace('/shards/', '/metadata/').replace(/\.js$/, '.json');
  if (metadataForSource === paths.sourceShard || paths.sourceMetadata !== metadataForSource) throw new Error('SOURCE_METADATA_NOT_PAIRED_WITH_SOURCE_SHARD');
  const digest = metaSha256(meta);
  const evidence = verifyReviewEvidence(root, reviewEvidence, uid, digest);
  const required = ['sourceShard', 'sourceMetadata', 'consumerShard', 'consumerIndex'];
  for (const key of required) if (!paths?.[key] || !expectedSha256?.[key]) throw new Error(`${key.toUpperCase()}_PATH_AND_CAS_REQUIRED`);
  const labels = { sourceShard: 'SOURCE_SHARD', sourceMetadata: 'SOURCE_METADATA', consumerShard: 'CONSUMER_SHARD', consumerIndex: 'CONSUMER_INDEX' };
  const targets = Object.fromEntries(required.map(key => [key, preflightTarget(root, paths[key], expectedSha256[key], labels[key])]));
  const source = readSource(targets.sourceShard.before, paths.sourceShard);
  const sourceQs = source.questionBank;
  const sourceMetaDoc = parseJsonFile(targets.sourceMetadata.file, 'SOURCE_METADATA');
  const authority = exactOne(sourceMetaDoc, item => item.uid === uid, 'SOURCE_METADATA_UID');
  const sourceQuestion = exactOne(sourceQs, question => question.uid === uid || (question.uid == null && Number.isInteger(authority.qid) && question.id === authority.qid), 'SOURCE_UID_OR_LOCAL_QID');
  if (sourceQs.length !== 1) throw new Error('SOURCE_SHARD_MULTI_UID_UNSUPPORTED');
  const authorityValidation = validateAuthorityBinding(root, meta, sourceQuestion, uid);
  if (authorityValidation.issues.length) throw new Error(`META_AUTHORITY_INVALID:${authorityValidation.issues.join('|')}`);
  const parentRecord = authorityValidation.primaryRecord;
  const taxonomyIssues = validateMetaTaxonomyBindings(root, meta, parentRecord, uid);
  if (taxonomyIssues.length) throw new Error(`META_TAXONOMY_INVALID:${taxonomyIssues.join('|')}`);
  const sourceHadUid = sourceQuestion.uid === uid;
  if (sourceQuestion.uid == null) sourceQuestion.uid = uid;
  const consumerDoc = parseJsonFile(targets.consumerShard.file, 'CONSUMER_SHARD');
  if (consumerDoc.schemaVersion !== 'ALIVE_GENERATED_CONSUMER_SHARD_V1' || !Array.isArray(consumerDoc.records)) throw new Error('CONSUMER_SHARD_SCHEMA_INVALID');
  const indexDoc = parseJsonFile(targets.consumerIndex.file, 'CONSUMER_INDEX');
  if (indexDoc.schemaVersion !== 'ALIVE_GENERATED_CONSUMER_INDEX_V1' || !Array.isArray(indexDoc.records)) throw new Error('CONSUMER_INDEX_SCHEMA_INVALID');
  if (indexDoc.approvedCount !== indexDoc.records.length || new Set(indexDoc.records.map(row => row.uid)).size !== indexDoc.records.length) throw new Error('CONSUMER_INDEX_COUNT_OR_UID_INTEGRITY_INVALID');
  const consumerMatches = consumerDoc.records.filter(row => row.generatedUid === uid);
  const indexMatches = indexDoc.records.filter(row => row.uid === uid);
  let consumerRecord, indexRow;
  if (newRegistration) {
    if (consumerMatches.length || indexMatches.length) throw new Error('NEW_UID_ALREADY_REGISTERED_USE_UPDATE_PATH');
    if (consumerDoc.records.length !== 0) throw new Error('NEW_UID_REQUIRES_EMPTY_PREPARED_CONSUMER_SHARD');
    const proposed = newRegistration.indexRow;
    if (!proposed || typeof proposed !== 'object') throw new Error('NEW_UID_INDEX_ROW_REQUIRED');
    if (!Number.isInteger(proposed.localOrdinal) || proposed.localOrdinal < 1 || !Number.isInteger(proposed.year) || !nonempty(proposed.school) || !nonempty(proposed.grade) || !nonempty(proposed.subject)) throw new Error('NEW_UID_INDEX_IDENTITY_FIELDS_INVALID');
    if (!['REVIEW_APPROVED', 'USER_DIRECTED_OPERATING_APPROVED', 'USER_DIRECTED_QUALITY_APPROVED'].includes(proposed.approval) || proposed.reviewStatus !== approval.status || !nonempty(proposed.reviewApprovalBasis)) throw new Error('NEW_UID_APPROVAL_FIELDS_INVALID');
    if (approval.status === 'USER_DIRECTED_QUALITY_APPROVED' && proposed.reviewApprovalBasis !== evidence.approvalBasis) throw new Error('NEW_UID_DIRECTIVE_BASIS_MISMATCH');
    if (proposed.l2 !== sourceQuestion.subUnitKey || proposed.shard !== paths.consumerShard.replace(/^archive\//, '') || proposed.sourceKind && proposed.sourceKind !== 'generated' || proposed.consumerSelectable === false) throw new Error('NEW_UID_INDEX_SOURCE_BUCKET_PARITY_INVALID');
    const sourceExamPath = authority.sourceArchiveFile || authority.sourceExamPath || newRegistration.sourceExamPath;
    const sourceExamBlobSha = authority.sourceBlobSha || authority.sourceExamBlobSha || newRegistration.sourceExamBlobSha;
    const sourceQid = authority.sourceQid ?? authority.qid ?? proposed.sourceQid;
    if (!nonempty(sourceExamPath) || !sourceExamPath.startsWith('archive/exams/') || !HEX40.test(sourceExamBlobSha || '') || !Number.isInteger(sourceQid) || sourceQid < 1) throw new Error('NEW_UID_SOURCE_PROVENANCE_REQUIRED');
    if (proposed.sourceQid !== sourceQid) throw new Error('NEW_UID_SOURCE_QID_MISMATCH');
    const sourceExamBytes = fs.readFileSync(repoFile(root, sourceExamPath, 'SOURCE_EXAM'));
    if (gitBlobSha(sourceExamBytes).toLowerCase() !== sourceExamBlobSha.toLowerCase()) throw new Error('NEW_UID_SOURCE_EXAM_BYTES_MISMATCH');
    if (consumerDoc.sourceShard !== paths.sourceShard || consumerDoc.school && consumerDoc.school !== proposed.school) throw new Error('NEW_UID_PREPARED_SHARD_IDENTITY_MISMATCH');
    if (authority.sourceSchoolMarker && authority.sourceSchoolMarker !== proposed.school) throw new Error('NEW_UID_SOURCE_SCHOOL_MISMATCH');
    indexRow = { ...proposed, uid, sourceKind: 'generated', consumerSelectable: true, shard: paths.consumerShard.replace(/^archive\//, ''), sourceQid, sourceExamBlobSha, reviewStatus: approval.status };
    consumerRecord = {
      generatedUid: uid, localOrdinal: proposed.localOrdinal, sourceKind: 'generated',
      sourceExamPath, sourceExamBlobSha, sourceQid, sourceShard: paths.sourceShard,
      l2: proposed.l2, reviewStatus: approval.status,
      reviewApprovalReceipt: reviewEvidence.path,
      rpmPrimary: { recordId: parentRecord.id || parentRecord.recordId, l3: labelOf(meta.rpmL3), l4: labelOf(meta.rpmL4) },
      question: { ...structuredClone(sourceQuestion), id: proposed.localOrdinal, uid }
    };
    consumerDoc.records.push(consumerRecord);
    indexDoc.records.push(indexRow);
    indexDoc.approvedCount = indexDoc.records.length;
    indexDoc.approvedBySchool = indexDoc.records.reduce((counts, row) => { counts[row.school] = (counts[row.school] || 0) + 1; return counts; }, {});
    if (indexDoc.excludedHoldUids?.includes(uid)) throw new Error('UID_EXCLUDED_HOLD_CANNOT_REGISTER');
  } else {
    if (consumerMatches.length !== 1 || indexMatches.length !== 1) throw new Error('UID_NOT_UNIQUE_OR_NEW_REGISTRATION_REQUIRED');
    consumerRecord = consumerMatches[0];
    indexRow = indexMatches[0];
  }
  if (indexDoc.excludedHoldUids?.includes(uid)) throw new Error('UID_EXCLUDED_HOLD_CANNOT_REGISTER');
  if (indexRow.sourceKind !== 'generated' || indexRow.consumerSelectable !== true || consumerRecord.sourceKind !== 'generated') throw new Error('UID_NOT_APPROVED_SELECTABLE');
  if (indexRow.shard !== paths.consumerShard.replace(/^archive\//, '') || consumerRecord.sourceShard !== paths.sourceShard || consumerDoc.sourceShard !== paths.sourceShard) throw new Error('REGISTRATION_SOURCE_CONSUMER_PATH_PARITY_MISMATCH');
  if (consumerRecord.localOrdinal !== indexRow.localOrdinal || consumerRecord.l2 !== indexRow.l2 || consumerRecord.question?.subUnitKey !== indexRow.l2) throw new Error('REGISTRATION_UID_ORDINAL_OR_STORAGE_BUCKET_MISMATCH');
  if (sourceQuestion.content !== consumerRecord.question?.content || JSON.stringify(sourceQuestion.choices) !== JSON.stringify(consumerRecord.question?.choices) || sourceQuestion.answer !== consumerRecord.question?.answer || sourceQuestion.solution !== consumerRecord.question?.solution || sourceQuestion.solutionImage !== consumerRecord.question?.solutionImage) throw new Error('SOURCE_CONSUMER_STUDENT_BODY_MISMATCH');
  if (authority.reviewApprovalStatus !== approval.status || ![indexRow.reviewStatus, indexRow.approval].includes(approval.status)) throw new Error('APPROVAL_STATUS_PROJECTION_MISMATCH');

  const evidenceRef = { ...evidence, uid };
  sourceQuestion.meta = meta; sourceQuestion.metaFinalSha256 = digest;
  sourceQuestion.metaReviewEvidence = evidenceRef;
  sourceQuestion.metaReviewEvidenceSha256 = evidence.sha256;
  sourceQuestion.difficultyBucket = meta.difficultyBucket; sourceQuestion.level = meta.level;
  for (const field of TOP_LEVEL_META_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(meta, field)) sourceQuestion[field] = structuredClone(meta[field]);
    else delete sourceQuestion[field];
  }
  authority.meta = meta; authority.metaFinalSha256 = digest; authority.metaReviewEvidence = evidenceRef;
  authority.metaReviewEvidenceSha256 = evidence.sha256;
  authority.reviewEvidenceBinding = evidence;
  consumerRecord.meta = meta; consumerRecord.metaFinalSha256 = digest; consumerRecord.metaReviewEvidence = evidenceRef;
  consumerRecord.metaReviewEvidenceSha256 = evidence.sha256;
  consumerRecord.question.meta = meta; consumerRecord.question.metaFinalSha256 = digest; consumerRecord.question.metaReviewEvidence = evidenceRef;
  consumerRecord.question.metaReviewEvidenceSha256 = evidence.sha256;
  consumerRecord.question.uid = uid;
  consumerRecord.question.difficultyBucket = meta.difficultyBucket; consumerRecord.question.level = meta.level;
  for (const field of TOP_LEVEL_META_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(meta, field)) consumerRecord.question[field] = structuredClone(meta[field]);
    else delete consumerRecord.question[field];
  }
  indexRow.meta = meta; indexRow.metaFinalSha256 = digest; indexRow.metaReviewEvidence = evidenceRef;
  indexRow.metaReviewEvidenceSha256 = evidence.sha256;
  indexRow.rpmL1 = meta.rpmL1; indexRow.rpmL2 = meta.rpmL2; indexRow.rpmL3 = meta.rpmL3; indexRow.rpmL4 = meta.rpmL4;
  indexRow.difficultyBucket = meta.difficultyBucket; indexRow.level = meta.level;
  for (const field of TOP_LEVEL_META_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(meta, field)) indexRow[field] = structuredClone(meta[field]);
    else delete indexRow[field];
  }

  const overlay = {
    uid, meta, metaFinalSha256: digest, metaReviewEvidence: evidenceRef,
    metaReviewEvidenceSha256: evidence.sha256,
    difficultyBucket: meta.difficultyBucket, level: meta.level
  };
  const topLevelMeta = Object.fromEntries(TOP_LEVEL_META_FIELDS.filter(field => Object.prototype.hasOwnProperty.call(meta, field)).map(field => [field, meta[field]]));
  Object.assign(overlay, topLevelMeta);
  const removeSecondaryConceptKeys = !Object.prototype.hasOwnProperty.call(meta, 'secondaryConceptKeys');
  const identity = sourceHadUid ? `q.uid === ${JSON.stringify(uid)}` : `(!q.uid && q.id === ${JSON.stringify(sourceQuestion.id)})`;
  const deleteSecondary = removeSecondaryConceptKeys ? 'delete rows[0].secondaryConceptKeys;' : '';
  const patchScript = `\n;(function(){const bank=window.questionBank;if(!Array.isArray(bank))throw Error("META_OVERLAY_BANK_MISSING");const rows=bank.filter(q=>${identity});if(rows.length!==1)throw Error("META_OVERLAY_UID_NOT_UNIQUE");Object.assign(rows[0],${JSON.stringify(overlay)});${deleteSecondary}})();\n`;
  const newSourceBytes = Buffer.concat([targets.sourceShard.before, Buffer.from(patchScript, 'utf8')]);
  const reparsed = readSource(newSourceBytes, paths.sourceShard).questionBank;
  const registeredQuestion = exactOne(reparsed, q => q.uid === uid, 'OVERLAY_SOURCE_UID');
  if (JSON.stringify(bodyProjection(registeredQuestion)) !== JSON.stringify(bodyProjection(sourceQuestion))) throw new Error('SOURCE_STUDENT_BODY_MUTATED');
  const newSourceBlob = gitBlobSha(newSourceBytes);
  authority.sourceShardGitSha = newSourceBlob;
  consumerDoc.sourceShardGitSha = newSourceBlob;
  consumerRecord.sourceShardGitSha = newSourceBlob;
  indexRow.sourceShardGitSha = newSourceBlob;
  indexRow.metaVerification = {
    status: 'VERIFIED_CURRENT_SOURCE', sourceBound: true, reviewBytesBound: true,
    metaFinalSha256: digest, sourceShardGitSha: newSourceBlob,
    reviewEvidenceSha256: evidence.sha256
  };
  const newConsumerBytes = writeJson(consumerDoc);
  const newConsumerBlob = gitBlobSha(newConsumerBytes);
  indexRow.consumerShardGitSha = newConsumerBlob;
  indexRow.shardGitBlobSha = newConsumerBlob;
  indexRow.consumerShardSha256 = sha256Bytes(newConsumerBytes);
  const newIndexBytes = writeJson(indexDoc);
  const newMetadataBytes = writeJson(sourceMetaDoc);

  const writes = [
    { ...targets.sourceShard, label: 'SOURCE_SHARD', expectedSha256: expectedSha256.sourceShard.toLowerCase(), after: newSourceBytes },
    { ...targets.sourceMetadata, label: 'SOURCE_METADATA', expectedSha256: expectedSha256.sourceMetadata.toLowerCase(), after: newMetadataBytes },
    { ...targets.consumerShard, label: 'CONSUMER_SHARD', expectedSha256: expectedSha256.consumerShard.toLowerCase(), after: newConsumerBytes },
    { ...targets.consumerIndex, label: 'CONSUMER_INDEX', expectedSha256: expectedSha256.consumerIndex.toLowerCase(), after: newIndexBytes }
  ];
  atomicReplace(writes, options.beforeReplace);
  return { status: 'REGISTERED', uid, metaFinalSha256: digest, reviewEvidence: evidence, sourceShardGitBlobSha: newSourceBlob, consumerShardGitBlobSha: newConsumerBlob };
}

export function withdrawGeneratedUid({ root, uid, reason, withdrawalEvidence, paths, expectedSha256 }, options = {}) {
  if (typeof uid !== 'string' || !uid.trim()) throw new Error('UID_REQUIRED');
  if (typeof reason !== 'string' || !reason.trim()) throw new Error('WITHDRAWAL_REASON_REQUIRED');
  if (paths?.consumerIndex !== 'archive/data/generated-lite-consumer/v1/index.json' || !paths?.consumerShard?.startsWith('archive/data/generated-lite-consumer/v1/shards/')) throw new Error('WITHDRAWAL_TARGET_PATH_OUT_OF_SCOPE');
  if (!HEX64.test(expectedSha256?.consumerIndex || '') || !HEX64.test(expectedSha256?.consumerShard || '')) throw new Error('WITHDRAWAL_CAS_REQUIRED');
  if (!withdrawalEvidence || !['alive/06_EXECUTION/', 'archive/analysis/'].some(prefix => withdrawalEvidence.path?.startsWith(prefix)) || !HEX64.test(withdrawalEvidence.sha256 || '')) throw new Error('WITHDRAWAL_EVIDENCE_BINDING_REQUIRED');
  const evidenceFile = repoFile(root, withdrawalEvidence.path, 'WITHDRAWAL_EVIDENCE');
  const evidenceBytes = fs.readFileSync(evidenceFile);
  if (sha256Bytes(evidenceBytes).toLowerCase() !== withdrawalEvidence.sha256.toLowerCase()) throw new Error('WITHDRAWAL_EVIDENCE_BYTES_MISMATCH');
  const evidence = parseJsonFile(evidenceFile, 'WITHDRAWAL_EVIDENCE');
  if (evidence.schemaVersion !== 'GENERATED_META_WITHDRAWAL_EVIDENCE_V1' || !Array.isArray(evidence.items) || exactOne(evidence.items, item => item?.uid === uid && item.status === 'WITHDRAWN' && item.reason === reason, 'WITHDRAWAL_EVIDENCE_UID') == null) throw new Error('WITHDRAWAL_EVIDENCE_UID_STATUS_INVALID');
  const indexTarget = preflightTarget(root, paths.consumerIndex, expectedSha256.consumerIndex, 'CONSUMER_INDEX');
  const consumerTarget = preflightTarget(root, paths.consumerShard, expectedSha256.consumerShard, 'CONSUMER_SHARD');
  const indexDoc = parseJsonFile(indexTarget.file, 'CONSUMER_INDEX');
  const matches = indexDoc.records.filter(row => row.uid === uid);
  if (matches.length !== 1) throw new Error('WITHDRAWAL_INDEX_UID_NOT_UNIQUE');
  const indexRow = matches[0];
  if (indexDoc.schemaVersion !== 'ALIVE_GENERATED_CONSUMER_INDEX_V1' || indexRow.sourceKind !== 'generated' || indexRow.consumerSelectable !== true) throw new Error('WITHDRAWAL_UID_NOT_CURRENTLY_SELECTABLE');
  if (indexRow.shard !== paths.consumerShard.replace(/^archive\//, '')) throw new Error('WITHDRAWAL_CONSUMER_SHARD_MISMATCH');
  const consumerDoc = parseJsonFile(consumerTarget.file, 'CONSUMER_SHARD');
  if (consumerDoc.schemaVersion !== 'ALIVE_GENERATED_CONSUMER_SHARD_V1' || !Array.isArray(consumerDoc.records)) throw new Error('WITHDRAWAL_CONSUMER_SHARD_SCHEMA_INVALID');
  const record = exactOne(consumerDoc.records || [], row => row.generatedUid === uid && row.localOrdinal === indexRow.localOrdinal, 'WITHDRAWAL_CONSUMER_UID_ORDINAL');
  if (record.sourceKind !== 'generated' || record.consumerSelectable === false) throw new Error('WITHDRAWAL_CONSUMER_UID_NOT_SELECTABLE');
  record.consumerSelectable = false;
  record.reviewStatus = 'WITHDRAWN';
  record.withdrawal = { reason, evidenceRef: withdrawalEvidence.path, evidenceSha256: withdrawalEvidence.sha256.toLowerCase() };
  const newConsumerBytes = writeJson(consumerDoc);
  const newConsumerBlob = gitBlobSha(newConsumerBytes);
  indexDoc.records = indexDoc.records.filter(row => row.uid !== uid);
  indexDoc.excludedHoldUids = [...new Set([...(indexDoc.excludedHoldUids || []), uid])].sort();
  indexDoc.approvedCount = indexDoc.records.length;
  for (const row of indexDoc.records) if (row.shard === indexRow.shard) {
    row.consumerShardGitSha = newConsumerBlob;
    row.shardGitBlobSha = newConsumerBlob;
    row.consumerShardSha256 = sha256Bytes(newConsumerBytes);
  }
  const newIndexBytes = writeJson(indexDoc);
  atomicReplace([
    { ...consumerTarget, label: 'CONSUMER_SHARD', expectedSha256: expectedSha256.consumerShard.toLowerCase(), after: newConsumerBytes },
    { ...indexTarget, label: 'CONSUMER_INDEX', expectedSha256: expectedSha256.consumerIndex.toLowerCase(), after: newIndexBytes }
  ], options.beforeReplace);
  return { status: 'WITHDRAWN', uid, reason, consumerShardGitBlobSha: newConsumerBlob, approvedCount: indexDoc.approvedCount };
}

async function main() {
  const inputFlag = process.argv.indexOf('--input');
  if (inputFlag < 0 || !process.argv[inputFlag + 1]) throw new Error('USAGE: node register-approved-generated-meta.mjs --input <registration-or-withdrawal.json>');
  const inputFile = path.resolve(process.argv[inputFlag + 1]);
  const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const root = path.resolve(path.dirname(inputFile), input.repoRoot || '../..');
  const result = input.action === 'withdraw'
    ? withdrawGeneratedUid({ ...input, root })
    : registerApprovedGeneratedMeta({ ...input, root });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
