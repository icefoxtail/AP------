#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import core from '../archive2-core.js';
import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';
import { validateCurrentProofChain } from './prepare-existing-target-registration-update.mjs';
import { canonicalContentFingerprint, canonicalSourceFingerprint, makeTargetIdentityRows } from './prepare-target-registration-candidate.mjs';

export const REGISTRY_PATHS = Object.freeze([
  'archive/db.js', 'archive/data/question_identity_map.json', 'archive/data/question_metadata.json',
  'archive/question-identity.js', 'archive/question-index.js', 'archive/question-index-report.md',
  'archive/question-index-audit.md', 'archive/data/archive2-catalog.json',
  'archive/data/archive2-canonical-input-manifest.json',
]);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = bytes => JSON.parse(Buffer.from(bytes).toString('utf8').replace(/^\uFEFF/, ''));
const deep = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = (code, detail = '') => { throw Object.assign(new Error(code + (detail ? ':' + detail : '')), { code }); };
const evalWindow = (source, name) => { const box = { window: {} }; vm.runInNewContext(source, box, { timeout: 5000 }); return box.window[name]; };

function safeRootPath(root, relative) {
  const file = path.resolve(root, relative);
  const rel = path.relative(root, file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) fail('PATH_OUTSIDE_ROOT', relative);
  if (fs.existsSync(file)) {
    const real = fs.realpathSync(file), realRelative = path.relative(root, real);
    if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) fail('SYMLINK_OUTSIDE_ROOT', relative);
  }
  return file;
}

function currentSource(root, assignment, plan) {
  const file = safeRootPath(root, assignment.productionRelativePath);
  const bytes = fs.readFileSync(file);
  if (sha(bytes) !== assignment.artifactRawSha256 || gitBlobSha(bytes) !== assignment.validatorRawBufferBlobSha1) fail('CURRENT_SOURCE_SHA_MISMATCH');
  if (plan.source.path !== assignment.productionRelativePath || plan.source.rawSha256 !== sha(bytes) || plan.source.gitBlobSha1 !== gitBlobSha(bytes)) fail('PLAN_SOURCE_BINDING_MISMATCH');
  const sandbox = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), sandbox, { timeout: 5000 });
  const bank = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(bank) || bank.length !== Number(plan.source.questionCount)) fail('CURRENT_SOURCE_DENOMINATOR_MISMATCH');
  if (bank.some((row, index) => Number(row?.id) !== index + 1)) fail('CURRENT_SOURCE_QID_SEQUENCE_INVALID');
  return { file, bytes, bank, sourceFile: core.normalizeFile(assignment.productionRelativePath.replace(/^archive\/exams\//, '')) };
}

function indexRows(bytes) {
  const source = Buffer.from(bytes).toString('utf8');
  const marker = 'window.questionIndex=';
  const at = source.indexOf(marker);
  if (at < 0) fail('QUESTION_INDEX_ASSIGNMENT_MISSING');
  let start = at + marker.length, quoted = false, escaped = false, depth = 0, seen = false, end = -1;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
    if (c === '"') { quoted = true; continue; }
    if (c === '[' || c === '{') { depth++; seen = true; }
    else if (c === ']' || c === '}') { depth--; if (seen && depth === 0) { end = i + 1; break; } }
  }
  if (end < 0 || source.slice(end).trimStart()[0] !== ';') fail('QUESTION_INDEX_ASSIGNMENT_INVALID');
  return { rows: JSON.parse(source.slice(start, end)), encode: rows => Buffer.from(source.slice(0, start) + JSON.stringify(rows) + source.slice(end), 'utf8') };
}

function assertIndexReportInvariant(before, after) {
  const visual = row => {
    const text = String(row.contentText || '');
    return { image: Boolean(row.hasImage), solutionImage: Boolean(row.hasSolutionImage), img: (text.match(/<img\b/gi) || []).length, svg: (text.match(/<svg\b/gi) || []).length, table: (text.match(/<table\b/gi) || []).length };
  };
  for (const old of before) {
    const next = after.find(row => Number(row.sourceOrdinal) === Number(old.sourceOrdinal));
    if (!next) fail('INDEX_TARGET_ORDINAL_MISSING', String(old.sourceOrdinal));
    for (const key of ['qKey', 'id', 'level', 'standardUnit', 'standardUnitKey', 'standardCourse']) if (!deep(old[key], next[key])) fail('INDEX_REPORT_AGGREGATE_DRIFT', key + ':q' + old.sourceOrdinal);
    if (Boolean(String(old.contentText || '').trim()) !== Boolean(String(next.contentText || '').trim())) fail('INDEX_REPORT_AGGREGATE_DRIFT', 'content:q' + old.sourceOrdinal);
    if (Boolean(String(old.choicesText || '').trim()) !== Boolean(String(next.choicesText || '').trim())) fail('INDEX_REPORT_AGGREGATE_DRIFT', 'choices:q' + old.sourceOrdinal);
    if (Boolean(Array.isArray(old.tags) && old.tags.length) !== Boolean(Array.isArray(next.tags) && next.tags.length)) fail('INDEX_REPORT_AGGREGATE_DRIFT', 'tags:q' + old.sourceOrdinal);
    if (!deep(visual(old), visual(next))) fail('INDEX_REPORT_AGGREGATE_DRIFT', 'visual:q' + old.sourceOrdinal);
  }
}

function updateIndexReport(reportBytes, { exams, indexCount, dbBytes, indexBytes, root }) {
  let text = Buffer.from(reportBytes).toString('utf8');
  const examBytes = exams.reduce((sum, row) => {
    const file = safeRootPath(root, path.join('archive/exams', core.normalizeFile(row.file)));
    if (!fs.existsSync(file)) fail('INDEX_REPORT_SOURCE_FILE_MISSING', row.file);
    return sum + fs.statSync(file).size;
  }, 0);
  const values = new Map([
    ['- 시험지 수(db.js): ', exams.length],
    ['- 시험지 파일 수: ', exams.length],
    ['- 원본 문항 수(중복 제거 전): ', indexCount],
    ['- 최종 인덱스 문항 수(중복 제거 후): ', indexCount],
    ['- db.js 크기: ', dbBytes],
    ['- 시험지 JS 총 크기: ', examBytes],
    ['- 인덱스 크기: ', indexBytes],
  ]);
  for (const [prefix, value] of values) {
    const at = text.indexOf(prefix);
    if (at < 0) fail('INDEX_REPORT_METRIC_MISSING', prefix.trim());
    const start = at + prefix.length;
    const match = /^\d+/.exec(text.slice(start));
    if (!match) fail('INDEX_REPORT_METRIC_VALUE_INVALID', prefix.trim());
    text = text.slice(0, start) + value + text.slice(start + match[0].length);
  }
  return Buffer.from(text, 'utf8');
}

function rebuildIdentity(base, targetRows, sourceFile, head) {
  const rows = [...base.records.filter(row => core.normalizeFile(row.sourceArchiveFile) !== sourceFile), ...targetRows]
    .sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') || Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  const byQuestionUid = {}, byLegacyQKey = {}, bySourceFileAndOrdinal = {}, bySourceFileAndQuestionNo = {};
  for (const row of rows) {
    byQuestionUid[row.questionUid] = { sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal, sourceQuestionNo: row.sourceQuestionNo };
    (byLegacyQKey[row.legacyQKey] ??= []).push(row.questionUid);
    (bySourceFileAndOrdinal[row.sourceArchiveFile] ??= {})[String(row.sourceOrdinal)] = row.questionUid;
    const fileRows = bySourceFileAndQuestionNo[row.sourceArchiveFile] ??= {};
    fileRows[String(row.sourceQuestionNo ?? '')] = [...(fileRows[String(row.sourceQuestionNo ?? '')] || []), row.questionUid];
  }
  const next = {
    ...base, sourceCommit: head, records: rows,
    lookup: {
      byQuestionUid: Object.fromEntries(Object.entries(byQuestionUid).sort(([a], [b]) => a.localeCompare(b, 'en'))),
      byLegacyQKey: Object.fromEntries(Object.entries(byLegacyQKey).sort(([a], [b]) => a.localeCompare(b, 'en'))),
      bySourceFileAndOrdinal: Object.fromEntries(Object.entries(bySourceFileAndOrdinal).sort(([a], [b]) => a.localeCompare(b, 'en'))),
      bySourceFileAndQuestionNo: Object.fromEntries(Object.entries(bySourceFileAndQuestionNo).sort(([a], [b]) => a.localeCompare(b, 'en'))),
    },
    stats: { ...(base.stats || {}), examFileCount: new Set(rows.map(row => row.sourceArchiveFile)).size, sourceQuestionCount: rows.length, uniqueQuestionUidCount: new Set(rows.map(row => row.questionUid)).size, duplicateQuestionUidCount: 0, failures: 0 },
    incrementalSync: { schemaVersion: 'question-identity-incremental-sync-v2', sourceCommit: head, updatedFiles: 1, updatedRecords: targetRows.length, updatedSourceFiles: [sourceFile], renamedFiles: [], renamedRecords: 0, renamedSourceFiles: [] },
    generatedAt: new Date().toISOString(),
  };
  delete next.identityDigest;
  const stable = { ...next }; delete stable.generatedAt;
  next.identityDigest = sha(Buffer.from(JSON.stringify(stable), 'utf8'));
  return next;
}

function rebuildMetadata(base, targetRows, identityNext, identityBytes, sourceFile) {
  const identityByUid = new Map(identityNext.records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile).map(row => [row.questionUid, row]));
  const replacements = targetRows.map(row => {
    const identity = identityByUid.get(row.questionUid);
    if (!identity || Number(row.sourceOrdinal) !== Number(identity.sourceOrdinal) || row.sourceFingerprint !== identity.sourceFingerprint) fail('METADATA_TARGET_UID_JOIN_REQUIRED');
    return row;
  });
  const records = [...base.records.filter(row => core.normalizeFile(row.sourceArchiveFile) !== sourceFile), ...replacements]
    .sort((a, b) => String(a.questionUid).localeCompare(String(b.questionUid), 'en'));
  const sourceJoinKeys = new Set(records.map(row => String(row.sourceArchiveFile).replace(/\\/g, '/') + '#' + Number(row.sourceOrdinal)));
  if (sourceJoinKeys.size !== records.length || new Set(records.map(row => row.questionUid)).size !== records.length) fail('METADATA_GLOBAL_IDENTITY_UNIQUENESS_FAIL');
  const next = {
    ...base, generatedAt: new Date().toISOString(),
    sourceDigests: { ...(base.sourceDigests || {}), identityMap: sha(identityBytes) },
    consistency: { ...(base.consistency || {}), productionValuesWinOnMerge: true },
    counts: {
      ...(base.counts || {}), records: records.length, uidUnique: true, sourceJoinUnique: true,
      semanticallyReviewed: records.filter(row => ['reviewed_pass', 'approved_semantic_review', 'approved_exam_meta_source'].includes(row.reviewStatus) || ['approved_semantic_review', 'approved_exam_meta_source'].includes(row.metadataStatus)).length,
      explicitProblemTypeHolds: records.filter(row => row.fieldStatus?.problemType === 'manual_review_pending').length,
      explicitTemplateHolds: records.filter(row => row.fieldStatus?.template === 'manual_review_pending').length,
      explicitDifficultyHolds: records.filter(row => row.fieldStatus?.difficulty === 'manual_review_pending').length,
    },
    records, registrationSync: { schemaVersion: 'archive-registration-metadata-sync-v2', updated: replacements.length, updatedFiles: [sourceFile], added: 0, relocated: 0, relocatedFiles: [] },
  };
  delete next.digest;
  next.digest = sha(Buffer.from(JSON.stringify(next), 'utf8'));
  return next;
}

function buildRuntime(identity) {
  const data = { schemaVersion: 'question-identity-runtime-v1', identityDigest: identity.identityDigest, sourceCommit: identity.sourceCommit, files: [], fileIndexByPath: {}, byUid: {}, byFile: {} };
  for (const row of identity.records) {
    let index = data.fileIndexByPath[row.sourceArchiveFile];
    if (index === undefined) { index = data.files.length; data.fileIndexByPath[row.sourceArchiveFile] = index; data.files.push(row.sourceArchiveFile); data.byFile[String(index)] = { o: {}, n: {} }; }
    data.byUid[row.questionUid] = [index, row.sourceOrdinal, row.sourceQuestionNo];
    data.byFile[String(index)].o[String(row.sourceOrdinal)] = row.questionUid;
    const qno = String(row.sourceQuestionNo ?? '');
    data.byFile[String(index)].n[qno] = [...(data.byFile[String(index)].n[qno] || []), row.questionUid];
  }
  const runtimeDigest = sha(Buffer.from(JSON.stringify(data), 'utf8'));
  const source = '// Generated by archive/tools/intelligence/build-question-identity-runtime.mjs\n// identityDigest: ' + identity.identityDigest + '\n(function () {\n  const data = ' + JSON.stringify({ ...data, runtimeDigest }) + ';\n' +
    '  function normalizeFile(value) { return String(value || "").normalize("NFC").replace(/\\\\/g, "/").replace(/^exams\\//, "").replace(/^\\.\\//, "").trim(); }\n' +
    '  function positiveInteger(value) { const n = Number(value); return Number.isInteger(n) && n > 0 ? n : null; }\n' +
    '  function pick(reference, names) { for (const name of names) { const value = reference && reference[name]; if (value !== undefined && value !== null && String(value).trim() !== "") return value; } return null; }\n' +
    '  function unresolved(status, candidates) { return { status, questionUid: null, sourceArchiveFile: null, sourceOrdinal: null, sourceQuestionNo: null, candidates: candidates || [] }; }\n' +
    '  function resolved(status, questionUid, tuple) { return { status, questionUid, sourceArchiveFile: data.files[tuple[0]], sourceOrdinal: tuple[1], sourceQuestionNo: tuple[2], candidates: [] }; }\n' +
    '  window.questionIdentity = data;\n  window.resolveQuestionIdentityReference = function (reference) {\n' +
    '    const questionUid = pick(reference, ["questionUid", "question_uid", "sourceQuestionUid", "source_question_uid"]);\n' +
    '    if (questionUid) { const tuple = data.byUid[questionUid]; return tuple ? resolved("RESOLVED_CANONICAL_UID", questionUid, tuple) : unresolved("UNKNOWN_QUESTION_UID"); }\n' +
    '    const sourceFile = normalizeFile(pick(reference, ["sourceArchiveFile", "source_archive_file", "sourceFile", "_sourceFile"]) || "");\n' +
    '    const sourceOrdinal = positiveInteger(pick(reference, ["sourceOrdinal", "source_ordinal", "sourceQuestionOrdinal", "source_question_ordinal"]));\n' +
    '    const sourceQuestionNo = pick(reference, ["sourceQuestionNo", "source_question_no", "legacyQuestionNo", "legacy_question_no", "questionId", "question_id", "id"]);\n' +
    '    const fileIndex = data.fileIndexByPath[sourceFile]; const fileData = fileIndex === undefined ? null : data.byFile[String(fileIndex)];\n' +
    '    if (sourceFile && sourceOrdinal) { const uid = fileData && fileData.o[String(sourceOrdinal)]; const tuple = uid && data.byUid[uid]; return tuple ? resolved("RESOLVED_SOURCE_ORDINAL", uid, tuple) : unresolved("UNKNOWN_SOURCE_ORDINAL"); }\n' +
    '    if (sourceFile && sourceQuestionNo !== null) { const candidates = fileData && fileData.n[String(sourceQuestionNo)] || []; if (candidates.length === 1) return resolved("RESOLVED_LEGACY_UNAMBIGUOUS", candidates[0], data.byUid[candidates[0]]); if (candidates.length > 1) return unresolved("AMBIGUOUS_LEGACY_REFERENCE", candidates); return unresolved("UNKNOWN_LEGACY_REFERENCE"); }\n' +
    '    return unresolved("INSUFFICIENT_IDENTITY_REFERENCE");\n  };\n})();\n';
  const sandbox = { window: {} }; vm.runInNewContext(source, sandbox, { timeout: 5000 });
  return Buffer.from(source, 'utf8');
}

function packCatalog(catalog, base, sourceFile) {
  if (base.encoding !== 'column-dictionary-v1') return { ...catalog, records: catalog.records };
  const columns = [...base.columns], columnSet = new Set(columns);
  for (const row of catalog.records) for (const key of Object.keys(row)) if (!columnSet.has(key)) fail('CATALOG_COLUMN_SET_CHANGE_REQUIRED', key);
  const strings = [...base.strings], stringIds = new Map(strings.map((value, index) => [value, index]));
  const encode = value => {
    if (typeof value !== 'string') return value ?? null;
    if (!stringIds.has(value)) { stringIds.set(value, strings.length); strings.push(value); }
    return [stringIds.get(value)];
  };
  const bySourceOrdinal = new Map(catalog.records.filter(row => row.sourceFile === sourceFile).map(row => [Number(row.sourceOrdinal), row]));
  const baseDecoded = core.decodeCatalog(base).records;
  const records = base.records.map((packed, index) => {
    if (core.normalizeFile(baseDecoded[index].sourceFile) !== sourceFile) return packed;
    const row = bySourceOrdinal.get(Number(baseDecoded[index].sourceOrdinal));
    if (!row) fail('CATALOG_TARGET_PACKED_ROW_MISSING');
    return columns.map(column => encode(row[column]));
  });
  return { ...catalog, encoding: 'column-dictionary-v1', columns, strings, records };
}

function canonicalHealth(taxonomy, exams, records, policy) {
  const gradeCourses = policy.gradeCourseAllowlist || [], parents = [], advanced = [];
  for (const row of taxonomy || []) for (const allowed of gradeCourses) if (allowed.curriculumKey === row.curriculumKey && allowed.courseKey === row.courseKey) {
    const withGrade = { ...row, grade: allowed.grade }; parents.push(withGrade); if (row.L3 && row.L4) advanced.push(withGrade);
  }
  const uniqueBy = (rows, fields) => [...new Map(rows.map(row => [JSON.stringify(fields.map(field => String(row[field] ?? ''))), row])).values()];
  const authority = {
    taxonomyVersion: core.TAXONOMY_VERSION, examGradeByFile: Object.fromEntries(exams.map(row => [core.normalizeFile(row.file), row.grade])),
    identityByUid: Object.fromEntries(records.filter(row => row.questionUid).map(row => [row.questionUid, { questionUid: row.questionUid, sourceArchiveFile: row.sourceFile, sourceOrdinal: row.sourceOrdinal, status: row.identityStatus }])),
    gradeCourses, canonicalParents: uniqueBy(parents, ['grade', 'curriculumKey', 'courseKey', 'L1', 'L2']),
    canonicalAdvancedPaths: uniqueBy(advanced, ['grade', 'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4']),
    assignmentsByUid: Object.fromEntries(records.filter(row => row.assignmentEvidence).map(row => [row.questionUid, [row.assignmentEvidence]])), advancedAssignmentsByUid: {},
  };
  const health = {}, eligibleByUid = {};
  for (const row of records) { const result = core.eligibility(row, { canonicalAuthority: authority }); eligibleByUid[row.questionUid] = result; for (const reason of result.reasons) health[reason] = (health[reason] || 0) + 1; if (result.ok) health.automatic = (health.automatic || 0) + 1; }
  health.exams = exams.length; health.questions = records.length;
  return { health, eligibleByUid };
}

export const TARGET_META_DELTA_POLICY = Object.freeze({
  schemaVersion: 'JS_ARCHIVE_EXISTING_TARGET_META_DELTA_POLICY_V1',
  fields: Object.freeze([
    'standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder',
    'subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth',
    'conceptClusterKey', 'problemTypeKey', 'templateKey', 'crossConceptKeys',
    'conditionKeys', 'integrationPattern', 'curriculumKey', 'courseKey',
    'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability',
  ]),
  applyRequires: 'CURRENT_R1_META_PASS_AND_EXACT_CURRENT_SOURCE_PARITY',
  changedQidRuntimeDisposition: 'PHYSICAL_VALUES_UPDATED_REVIEW_STATUS_RESET_PENDING',
});

const TARGET_META_REVIEW_FIELDS = new Set([
  'metadataStatus', 'reviewStatus', 'fieldStatus', 'approvalEvidence',
  'metadataRevision', 'tagStatus', 'tagConfidence', 'registrationUpdateState',
]);
const TARGET_META_SOURCE_IDENTITY_FIELDS = new Set([
  'questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceQuestionNo', 'legacyQKey',
  'sourceFingerprint', 'contentFingerprint',
]);

function physicalMetaSourceValue(question, field) {
  if (field === 'standardCourse' && !Object.prototype.hasOwnProperty.call(question, field)) {
    if (Object.prototype.hasOwnProperty.call(question, 'course')) return { present: true, value: question.course };
    return { present: false };
  }
  if (!Object.prototype.hasOwnProperty.call(question, field)) return { present: false };
  return { present: true, value: question[field] };
}

function targetMetaFieldGroup(field) {
  if (['standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder'].includes(field)) return 'standardUnit';
  if (['subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth'].includes(field)) return 'subUnit';
  if (['problemTypeKey', 'templateKey'].includes(field)) return field === 'problemTypeKey' ? 'problemType' : 'template';
  if (['difficultyBucket'].includes(field)) return 'difficulty';
  return 'concept';
}

export function deriveTargetMetadataDelta({ existingRows, candidateRows, sourceBank, identityRows, r1MetaPassQids, r1EvidenceRef }) {
  const order = rows => [...rows].sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  if (![existingRows, candidateRows, identityRows, sourceBank].every(Array.isArray)
    || existingRows.length !== sourceBank.length || candidateRows.length !== sourceBank.length || identityRows.length !== sourceBank.length) fail('TARGET_META_DELTA_FULL_DENOMINATOR_REQUIRED');
  const passQids = new Set((r1MetaPassQids || []).map(Number));
  const policyFields = new Set(TARGET_META_DELTA_POLICY.fields);
  const oldRows = order(existingRows), newRows = order(candidateRows), ids = order(identityRows);
  const changes = [];
  const resultRows = newRows.map((candidate, index) => {
    const old = oldRows[index], source = sourceBank[index], identity = ids[index], qid = Number(source?.id);
    if (Number(candidate.qid ?? candidate.sourceOrdinal) !== index + 1 || Number(candidate.sourceOrdinal) !== index + 1
      || candidate.questionUid !== identity.questionUid || old.questionUid !== identity.questionUid) fail('TARGET_META_DELTA_UID_ORDINAL_MISMATCH', 'q' + (index + 1));
    const changedFields = [];
    for (const field of TARGET_META_DELTA_POLICY.fields) {
      const sourceValue = physicalMetaSourceValue(source, field);
      const hasCandidate = Object.prototype.hasOwnProperty.call(candidate, field);
      if (sourceValue.present && (!hasCandidate || JSON.stringify(candidate[field]) !== JSON.stringify(sourceValue.value))) fail('CANDIDATE_META_SOURCE_PARITY_MISMATCH', field + ':q' + qid);
      if (hasCandidate && !sourceValue.present && JSON.stringify(old[field]) !== JSON.stringify(candidate[field])) fail('CANDIDATE_META_FIELD_NOT_PHYSICAL_IN_CURRENT_SOURCE', field + ':q' + qid);
      if (hasCandidate && JSON.stringify(old[field]) !== JSON.stringify(candidate[field])) changedFields.push(field);
    }
    for (const key of new Set([...Object.keys(old), ...Object.keys(candidate)])) {
      if (TARGET_META_DELTA_POLICY.fields.includes(key) || TARGET_META_REVIEW_FIELDS.has(key)
        || TARGET_META_SOURCE_IDENTITY_FIELDS.has(key)) continue;
      if (JSON.stringify(old[key]) !== JSON.stringify(candidate[key])) fail('TARGET_META_FIELD_OUTSIDE_DELTA_POLICY', key + ':q' + qid);
    }
    const sourceChanged = old.sourceFingerprint !== identity.sourceFingerprint;
    const metaPass = passQids.has(qid);
    if (candidate.sourceFingerprint !== identity.sourceFingerprint
      || candidate.contentFingerprint !== canonicalContentFingerprint(source)) fail('CANDIDATE_META_IDENTITY_OR_CONTENT_FINGERPRINT_MISMATCH', 'q' + qid);
    if (changedFields.length && !metaPass) fail('TARGET_META_DELTA_REQUIRES_CURRENT_R1_META_PASS', 'q' + qid + ':' + changedFields.join(','));
    const resetPending = changedFields.length > 0 || (sourceChanged && !metaPass);
    const row = { ...old, sourceFingerprint: identity.sourceFingerprint };
    if (Object.prototype.hasOwnProperty.call(candidate, 'contentFingerprint')) row.contentFingerprint = candidate.contentFingerprint;
    for (const field of changedFields) row[field] = candidate[field];
    const currentPhysicalMeta = Object.fromEntries(TARGET_META_DELTA_POLICY.fields
      .filter(field => Object.prototype.hasOwnProperty.call(row, field))
      .map(field => [field, row[field]]));
    const currentPhysicalMetaSha256 = sha(Buffer.from(JSON.stringify(currentPhysicalMeta), 'utf8'));
    if (resetPending) {
      const fieldStatus = { ...(old.fieldStatus || {}) };
      const resetGroups = [...new Set([...Object.keys(fieldStatus), ...changedFields.map(targetMetaFieldGroup)])];
      for (const group of resetGroups) fieldStatus[group] = 'manual_review_pending';
      row.fieldStatus = fieldStatus;
      row.metadataStatus = 'registration_pending_semantic_review';
      row.reviewStatus = 'review_required';
      row.tagStatus = 'review_required';
      row.tagConfidence = 'review_required';
      row.approvalEvidence = [];
      row.registrationUpdateState = {
        schemaVersion: TARGET_META_DELTA_POLICY.schemaVersion,
        disposition: 'PHYSICAL_META_UPDATED_REVIEW_RESET_PENDING',
        changedFields,
        currentPhysicalMeta,
        currentPhysicalMetaSha256,
        r1MetaPass: metaPass,
        r1EvidenceRef: r1EvidenceRef || null,
      };
    }
    changes.push({ qid, sourceFingerprintChanged: sourceChanged, changedFields, r1MetaPass: metaPass, runtimeReviewReset: resetPending, currentPhysicalMeta, currentPhysicalMetaSha256 });
    return row;
  });
  return { rows: resultRows, changes, policy: TARGET_META_DELTA_POLICY.schemaVersion };
}

async function makeManifest(root, packedCatalogText, identityText, metadataText, indexVersion) {
  const archive = path.join(root, 'archive');
  const runtime = core.Canonical.RUNTIME_INPUT_PATHS.map(relative => json(fs.readFileSync(path.join(archive, relative))));
  const inputs = core.Canonical.manifestInputPathsFromRuntimePacks(runtime, relative => fs.existsSync(path.join(archive, relative)) && fs.statSync(path.join(archive, relative)).isFile());
  const files = inputs.map(relative => {
    let bytes;
    if (relative === 'data/archive2-catalog.json') bytes = Buffer.from(packedCatalogText);
    else if (relative === 'data/question_identity_map.json') bytes = Buffer.from(identityText);
    else if (relative === 'data/question_metadata.json') bytes = Buffer.from(metadataText);
    else bytes = fs.readFileSync(path.join(archive, relative));
    return { path: relative, sha256: sha(Buffer.from(bytes.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n'), 'utf8')) };
  });
  return { schemaVersion: 'archive2-canonical-input-manifest-v1', resolverVersion: core.Canonical.RESOLVER_VERSION, generatedFromCatalogIndexVersion: indexVersion, projectionVersion: await core.Canonical.computeProjectionVersion(files, core.Canonical.RESOLVER_VERSION), files };
}

function verifyCandidateFiles(root, plan, candidateRoot) {
  const actualRoot = fs.realpathSync(candidateRoot);
  const rootRelative = path.relative(root, actualRoot);
  if (rootRelative.startsWith('..') || path.isAbsolute(rootRelative) || actualRoot !== fs.realpathSync(plan.candidateRoot)) fail('CANDIDATE_ROOT_BINDING_MISMATCH');
  const candidateHead = execFileSync('git', ['-C', actualRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (candidateHead !== plan.expectedHead) fail('CANDIDATE_HEAD_MISMATCH');
  for (const row of plan.candidateBindings) if (sha(fs.readFileSync(safeRootPath(actualRoot, row.relativePath))) !== row.sha256) fail('CANDIDATE_INPUT_SHA_MISMATCH', row.relativePath);
}

export async function buildExistingTargetMerge({ root, assignment, plan, candidateRoot, proofManifestPath }) {
  const realRoot = fs.realpathSync(root);
  const head = execFileSync('git', ['-C', realRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (head !== assignment.expectedHead || head !== plan.expectedHead) fail('HEAD_MISMATCH');
  const source = currentSource(realRoot, assignment, plan);
  verifyCandidateFiles(realRoot, plan, candidateRoot);
  const proofManifest = json(fs.readFileSync(safeRootPath(realRoot, proofManifestPath)));
  const proofChain = validateCurrentProofChain({ root: realRoot, assignment, proofManifest, proofManifestPath });
  if (!deep(proofChain, plan.currentStageProofs)) fail('CURRENT_PROOF_VALIDATION_CHANGED');
  const paths = REGISTRY_PATHS;
  if (plan.baselineBindings.length !== paths.length) fail('NINE_BASELINE_BINDINGS_REQUIRED');
  const baseline = new Map();
  for (const binding of plan.baselineBindings) {
    if (!paths.includes(binding.relativePath)) fail('UNEXPECTED_BASELINE_PATH', binding.relativePath);
    const bytes = fs.readFileSync(safeRootPath(realRoot, binding.relativePath));
    if (sha(bytes) !== binding.sha256) fail('BASELINE_REGISTRY_SHA_MISMATCH', binding.relativePath);
    baseline.set(binding.relativePath, bytes);
  }
  for (const asset of plan.releaseAssets) {
    const file = safeRootPath(realRoot, path.join('archive', asset.ref));
    if (sha(fs.readFileSync(file)) !== asset.sha256) fail('RELEASE_ASSET_SHA_MISMATCH', asset.ref);
  }
  const sourceFile = source.sourceFile;
  const dbBase = evalWindow(baseline.get('archive/db.js').toString('utf8'), 'mainDB');
  const identityBase = json(baseline.get('archive/data/question_identity_map.json'));
  const metadataBase = json(baseline.get('archive/data/question_metadata.json'));
  const indexBase = indexRows(baseline.get('archive/question-index.js')).rows;
  const packedBase = json(baseline.get('archive/data/archive2-catalog.json'));
  const catalogBase = core.decodeCatalog(packedBase);
  const dbTarget = dbBase.exams.filter(row => core.normalizeFile(row.file) === sourceFile);
  const idTarget = identityBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const metaTarget = metadataBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const indexTarget = indexBase.filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  const catalogTarget = catalogBase.records.filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  const qCount = source.bank.length, qids = Array.from({ length: qCount }, (_, index) => index + 1);
  if (dbTarget.length !== 1 || [idTarget.length, metaTarget.length, indexTarget.length, catalogTarget.length].some(count => count !== qCount)) fail('EXISTING_TARGET_FULL_DENOMINATOR_REQUIRED');
  if (Number(dbTarget[0].qCount) !== qCount) fail('EXISTING_TARGET_DB_DENOMINATOR_MISMATCH');
  const targetDbCandidate = evalWindow(fs.readFileSync(safeRootPath(plan.candidateRoot, 'archive/db.js'), 'utf8'), 'mainDB').exams.filter(row => core.normalizeFile(row.file) === sourceFile);
  if (targetDbCandidate.length !== 1 || !deep(targetDbCandidate[0], dbTarget[0])) fail('TARGET_RUNTIME_DB_TUPLE_CHANGE');
  const replacements = plan.replacementRows;
  const ordered = rows => [...rows].sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  const candidateIdentityRows = json(fs.readFileSync(safeRootPath(plan.candidateRoot, 'archive/data/question_identity_map.json'))).records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const candidateMetadataRows = json(fs.readFileSync(safeRootPath(plan.candidateRoot, 'archive/data/question_metadata.json'))).records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFile);
  const candidateIndexRows = indexRows(fs.readFileSync(safeRootPath(plan.candidateRoot, 'archive/question-index.js'))).rows.filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  const candidateCatalogRows = core.decodeCatalog(json(fs.readFileSync(safeRootPath(plan.candidateRoot, 'archive/data/archive2-catalog.json')))).records.filter(row => core.normalizeFile(row.sourceFile) === sourceFile);
  for (const [name, rows, actual] of [
    ['identity', replacements.identity, candidateIdentityRows], ['metadata', replacements.metadata, candidateMetadataRows],
    ['index', replacements.index, candidateIndexRows], ['catalog', replacements.catalog, candidateCatalogRows],
  ]) if (!deep(ordered(rows), ordered(actual))) fail('UPDATE_PLAN_TARGET_ROWS_DO_NOT_MATCH_CANDIDATE', name);
  for (const [name, rows] of Object.entries({ identity: replacements.identity, metadata: replacements.metadata, index: replacements.index, catalog: replacements.catalog })) {
    if (!Array.isArray(rows) || rows.length !== qCount || ordered(rows).some((row, index) => Number(row.sourceOrdinal) !== index + 1)) fail('CANDIDATE_FULL_DENOMINATOR_REQUIRED', name);
  }
  if (!deep(ordered(idTarget).map(row => [row.questionUid, Number(row.sourceOrdinal)]), ordered(replacements.identity).map(row => [row.questionUid, Number(row.sourceOrdinal)]))) fail('TARGET_UID_ORDINAL_CHANGE_FORBIDDEN');
  const sourceIdentity = makeTargetIdentityRows(sourceFile, source.bank);
  for (let index = 0; index < qCount; index++) {
    const candidate = ordered(replacements.identity)[index], current = sourceIdentity[index];
    if (candidate.questionUid !== current.questionUid || candidate.legacyQKey !== current.legacyQKey
      || candidate.sourceFingerprint !== canonicalSourceFingerprint(source.bank[index])) fail('CANDIDATE_IDENTITY_NOT_DERIVED_FROM_CURRENT_SOURCE', 'q' + (index + 1));
  }
  const uidByOrdinal = new Map(ordered(replacements.identity).map(row => [Number(row.sourceOrdinal), row.questionUid]));
  for (const [name, rows] of [['metadata', replacements.metadata], ['index', replacements.index], ['catalog', replacements.catalog]]) for (const row of rows) {
    if (row.questionUid !== uidByOrdinal.get(Number(row.sourceOrdinal))) fail('TARGET_UID_JOIN_MISMATCH', name + ':' + row.sourceOrdinal);
  }
  const originalTargetMetadata = ordered(metaTarget);
  if (!Array.isArray(plan.originalTargetMetadata) || !deep(originalTargetMetadata, plan.originalTargetMetadata)
    || plan.originalTargetMetadataSha256 !== sha(Buffer.from(JSON.stringify(originalTargetMetadata), 'utf8'))) fail('ORIGINAL_TARGET_METADATA_PROVENANCE_BINDING_REQUIRED');
  const r1Proof = proofChain.stages.find(row => row.stage === 'R1');
  const metaDelta = deriveTargetMetadataDelta({
    existingRows: originalTargetMetadata, candidateRows: replacements.metadata, sourceBank: source.bank,
    identityRows: ordered(replacements.identity), r1MetaPassQids: proofChain.r1MetaPassQids, r1EvidenceRef: r1Proof?.path,
  });
  const indexMetaMap = new Map([
    ['standardCourse', 'course'], ['standardUnitKey', 'standardUnitKey'], ['standardUnit', 'standardUnit'],
    ['subUnitKey', 'subUnitKey'], ['subUnit', 'subUnit'], ['subUnitConfidence', 'subUnitConfidence'],
    ['subUnitClassificationDepth', 'subUnitClassificationDepth'],
  ]);
  for (let index = 0; index < qCount; index++) {
    const indexRow = ordered(replacements.index)[index], sourceQuestion = source.bank[index];
    for (const [metaField, indexField] of indexMetaMap) {
      if (!Object.prototype.hasOwnProperty.call(indexRow, indexField)) continue;
      const sourceValue = physicalMetaSourceValue(sourceQuestion, metaField);
      if (sourceValue.present && JSON.stringify(indexRow[indexField]) !== JSON.stringify(sourceValue.value)) fail('CANDIDATE_INDEX_META_SOURCE_PARITY_MISMATCH', indexField + ':q' + (index + 1));
    }
  }
  const catalogMetaMap = new Map([
    ['standardCourse', 'standardCourse'], ['standardUnitKey', 'standardUnitKey'], ['standardUnit', 'standardUnit'],
    ['subUnitKey', 'subUnitKey'], ['subUnit', 'subUnit'], ['curriculumKey', 'curriculumKey'], ['courseKey', 'courseKey'],
    ['L1', 'L1'], ['L2', 'L2'], ['L3', 'L3'], ['L4', 'L4'],
  ]);
  const catalogIdentityFields = new Set(['sourceFingerprint', 'rawQuestionHash', 'identityStatus', 'sourceIntegrityStatus', 'sourceStatus']);
  const catalogComputedFields = new Set(['assignmentFingerprint', 'metadataAssignmentEvidence', 'taxonomyStatus', 'unverifiedTaxonomy', 'metadataConflicts', 'canonicalAssignmentReasons', 'courseFamilies', 'automatic', 'defaultSelectable', 'semanticDisposition', 'metadataStatus', 'fieldStatus', 'tagStatus', 'tagConfidence']);
  const catalogRows = ordered(replacements.catalog).map((candidate, index) => {
    const old = ordered(catalogTarget)[index];
    if (candidate.sourceStatus !== 'VERIFIED' || candidate.identityStatus !== 'VERIFIED'
      || candidate.metadataAssignmentEvidence?.evidenceDigest !== metadataBase.sourceDigests?.completeClassification) fail('CATALOG_SOURCE_OR_CLASSIFICATION_BINDING_REQUIRED', 'q' + (index + 1));
    if (candidate.sourceFingerprint !== sourceIdentity[index].sourceFingerprint
      || candidate.rawQuestionHash !== sha(Buffer.from(JSON.stringify(source.bank[index]), 'utf8'))
      || candidate.assignmentFingerprint !== canonicalContentFingerprint(source.bank[index])
      || candidate.metadataAssignmentEvidence?.assignmentFingerprint !== canonicalContentFingerprint(source.bank[index])
      || candidate.metadataAssignmentEvidence?.sourceFingerprint !== candidate.sourceFingerprint) fail('CANDIDATE_CATALOG_SOURCE_FINGERPRINT_MISMATCH', 'q' + (index + 1));
    const decision = metaDelta.changes[index], metadata = metaDelta.rows[index];
    const physicalChanged = new Set(decision.changedFields);
    const allowedCatalogChanges = new Set([...catalogIdentityFields, ...catalogComputedFields]);
    for (const [catalogField, metadataField] of catalogMetaMap) if (physicalChanged.has(metadataField)) allowedCatalogChanges.add(catalogField);
    const keys = new Set([...Object.keys(old), ...Object.keys(candidate)]);
    for (const key of keys) {
      if (allowedCatalogChanges.has(key)) continue;
      if (!deep(old[key], candidate[key])) fail('CATALOG_FIELD_OUTSIDE_META_DELTA_POLICY', key + ':q' + (index + 1));
    }
    for (const [catalogField, metadataField] of catalogMetaMap) {
      if (!Object.prototype.hasOwnProperty.call(candidate, catalogField)) continue;
      if (!Object.prototype.hasOwnProperty.call(metadata, metadataField)) {
        if (!deep(old[catalogField], candidate[catalogField])) fail('CATALOG_FIELD_WITHOUT_CURRENT_SOURCE_META', catalogField + ':q' + (index + 1));
        continue;
      }
      if (JSON.stringify(candidate[catalogField]) !== JSON.stringify(metadata[metadataField])) fail('CANDIDATE_CATALOG_META_SOURCE_PARITY_MISMATCH', catalogField + ':q' + (index + 1));
    }
    const next = { ...old };
    for (const field of catalogIdentityFields) if (Object.prototype.hasOwnProperty.call(candidate, field)) next[field] = candidate[field];
    for (const [catalogField, metadataField] of catalogMetaMap) if (physicalChanged.has(metadataField)) next[catalogField] = metadata[metadataField];
    next.assignmentFingerprint = candidate.assignmentFingerprint;
    next.sourceFingerprint = candidate.sourceFingerprint;
    next.rawQuestionHash = candidate.rawQuestionHash;
    next.identityStatus = candidate.identityStatus;
    next.sourceIntegrityStatus = candidate.sourceIntegrityStatus;
    next.sourceStatus = candidate.sourceStatus;
    if (decision.runtimeReviewReset) {
      next.metadataStatus = 'registration_pending_semantic_review';
      next.fieldStatus = metadata.fieldStatus || {};
      next.tagStatus = 'review_required';
      next.tagConfidence = 'review_required';
      next.taxonomyStatus = 'UNKNOWN';
      next.metadataConflicts = [];
      next.unverifiedTaxonomy = {
        curriculumKey: metadata.curriculumKey || '', courseKey: metadata.courseKey || metadata.standardCourse || '',
        L1: metadata.L1 || '', L2: metadata.L2 || '', L3: metadata.L3 || '', L4: metadata.L4 || '',
      };
      next.canonicalAssignmentReasons = ['registration_update_meta_pending'];
      next.courseFamilies = [];
      next.automatic = false;
      next.defaultSelectable = false;
      next.semanticDisposition = 'HOLD';
      next.approvedSourceFingerprint = '';
      next.metadataAssignmentEvidence = {
        questionUid: candidate.questionUid,
        sourceFile: candidate.sourceFile,
        sourceOrdinal: candidate.sourceOrdinal,
        sourceFingerprint: candidate.sourceFingerprint,
        assignmentFingerprint: metadata.contentFingerprint || candidate.metadataAssignmentEvidence.assignmentFingerprint,
        metadataStatus: metadata.metadataStatus,
        fieldStatus: metadata.fieldStatus,
        evidenceRefs: [],
        evidenceDigest: metadataBase.sourceDigests?.completeClassification || '',
        metadataRevision: metadata.metadataRevision || '',
        registrationUpdateReviewProof: {
          r1EvidenceRef: r1Proof?.path || null,
          r1EvidenceSha256: r1Proof?.sha256 || null,
          r1MetaPass: decision.r1MetaPass,
          changedFields: decision.changedFields,
          currentPhysicalMeta: decision.currentPhysicalMeta,
          currentPhysicalMetaSha256: decision.currentPhysicalMetaSha256,
          disposition: 'PHYSICAL_META_VALUES_BOUND_REVIEW_RESET_PENDING',
        },
      };
    } else {
      next.metadataAssignmentEvidence = { ...old.metadataAssignmentEvidence, sourceFingerprint: candidate.sourceFingerprint, assignmentFingerprint: candidate.assignmentFingerprint };
    }
    return next;
  });

  const outputs = new Map(paths.map(relative => [relative, baseline.get(relative)]));
  const identityNext = rebuildIdentity(identityBase, ordered(replacements.identity), sourceFile, head);
  const identityText = JSON.stringify(identityNext, null, 2) + '\n';
  const identityBytes = Buffer.from(identityText, 'utf8');
  const metadataNext = rebuildMetadata(metadataBase, metaDelta.rows, identityNext, identityBytes, sourceFile);
  if (metadataNext.sourceDigests?.completeClassification !== metadataBase.sourceDigests?.completeClassification) fail('CLASSIFICATION_DIGEST_MUST_BE_INHERITED');
  const metadataText = JSON.stringify(metadataNext, null, 2) + '\n';
  outputs.set('archive/data/question_identity_map.json', identityBytes);
  outputs.set('archive/data/question_metadata.json', Buffer.from(metadataText, 'utf8'));
  const idx = indexRows(baseline.get('archive/question-index.js'));
  assertIndexReportInvariant(indexTarget, ordered(replacements.index));
  const indexNext = idx.rows.map(row => core.normalizeFile(row.sourceFile) === sourceFile ? ordered(replacements.index)[Number(row.sourceOrdinal) - 1] : row);
  if (indexNext.some(row => !row)) fail('QUESTION_INDEX_TARGET_REPLACEMENT_MISSING');
  if (new Set(indexNext.map(row => row.qKey)).size !== indexNext.length) fail('MERGED_QKEY_UNIQUENESS_FAIL');
  const indexBytes = idx.encode(indexNext);
  outputs.set('archive/question-index.js', indexBytes);
  outputs.set('archive/question-index-report.md', updateIndexReport(baseline.get('archive/question-index-report.md'), {
    exams: dbBase.exams, indexCount: indexNext.length, dbBytes: baseline.get('archive/db.js').length, indexBytes: indexBytes.length, root: realRoot,
  }));
  const runtimeBytes = buildRuntime(identityNext);
  const runtimeWin = evalWindow(runtimeBytes.toString('utf8'), 'questionIdentity');
  const baseRuntime = evalWindow(baseline.get('archive/question-identity.js').toString('utf8'), 'questionIdentity');
  for (const [uid, tuple] of Object.entries(baseRuntime.byUid)) if (!deep(tuple, runtimeWin.byUid[uid])) fail('RUNTIME_UID_TUPLE_CHANGED', uid);
  if (!deep(baseRuntime.files, runtimeWin.files)) fail('RUNTIME_FILE_INDEX_CHANGED');
  outputs.set('archive/question-identity.js', runtimeBytes);

  const candidateCatalog = core.decodeCatalog(json(fs.readFileSync(safeRootPath(plan.candidateRoot, 'archive/data/archive2-catalog.json'))));
  const candidateExam = candidateCatalog.exams.filter(row => core.normalizeFile(row.file) === sourceFile);
  if (candidateExam.length !== 1) fail('CANDIDATE_TARGET_EXAM_CATALOG_REQUIRED');
  const nextRecords = catalogBase.records.map(row => core.normalizeFile(row.sourceFile) === sourceFile ? catalogRows[Number(row.sourceOrdinal) - 1] : row);
  let nextExams = catalogBase.exams.map(row => core.normalizeFile(row.file) === sourceFile ? candidateExam[0] : row);
  const nextSourceHashes = catalogBase.sourceHashes.map(pair => core.normalizeFile(pair[0]) === sourceFile ? [pair[0], sha(source.bytes)] : pair);
  if (nextSourceHashes.filter(pair => core.normalizeFile(pair[0]) === sourceFile).length !== 1) fail('CATALOG_SOURCE_HASH_TARGET_REQUIRED');
  const policy = json(fs.readFileSync(safeRootPath(realRoot, 'archive/data/archive2-canonical-projection-policy.json')));
  const computedCatalog = canonicalHealth(catalogBase.taxonomy, nextExams, nextRecords, policy);
  for (const change of metaDelta.changes) if (change.runtimeReviewReset
    && computedCatalog.eligibleByUid[uidByOrdinal.get(change.qid)]?.ok === true) fail('META_PENDING_ROW_REMAINS_AUTOMATICALLY_ELIGIBLE', 'q' + change.qid);
  const targetAutomaticCount = metaTarget.reduce((count, row) => count + (computedCatalog.eligibleByUid[row.questionUid]?.ok ? 1 : 0), 0);
  nextExams = nextExams.map(row => core.normalizeFile(row.file) === sourceFile ? { ...row, automaticCount: targetAutomaticCount } : row);
  const health = computedCatalog.health;
  const catalogNext = { ...catalogBase, indexVersion: '', identityDigest: identityNext.identityDigest, sourceHashes: nextSourceHashes, exams: nextExams, records: nextRecords, health };
  const indexVersion = sha(Buffer.from(JSON.stringify([core.VERSION, nextSourceHashes, sha(outputs.get('archive/data/question_metadata.json')), identityNext.identityDigest, catalogNext.taxonomy, nextExams, nextRecords]), 'utf8'));
  catalogNext.indexVersion = indexVersion;
  const packedNext = packCatalog(catalogNext, packedBase, sourceFile);
  const catalogText = JSON.stringify(packedNext) + '\n';
  outputs.set('archive/data/archive2-catalog.json', Buffer.from(catalogText, 'utf8'));
  const manifestNext = await makeManifest(realRoot, catalogText, identityText, metadataText, indexVersion);
  outputs.set('archive/data/archive2-canonical-input-manifest.json', Buffer.from(JSON.stringify(manifestNext) + '\n', 'utf8'));

  for (const relative of paths) if (sha(fs.readFileSync(safeRootPath(realRoot, relative))) !== plan.baselineBindings.find(row => row.relativePath === relative).sha256) fail('BASELINE_CHANGED_DURING_MERGE', relative);
  if (sha(fs.readFileSync(source.file)) !== plan.source.rawSha256) fail('SOURCE_CHANGED_DURING_MERGE');
  for (const asset of plan.releaseAssets) if (sha(fs.readFileSync(safeRootPath(realRoot, path.join('archive', asset.ref)))) !== asset.sha256) fail('ASSET_CHANGED_DURING_MERGE', asset.ref);
  const reread = {
    db: evalWindow(outputs.get('archive/db.js').toString('utf8'), 'mainDB').exams,
    identity: json(outputs.get('archive/data/question_identity_map.json')).records,
    metadata: json(outputs.get('archive/data/question_metadata.json')).records,
    index: indexRows(outputs.get('archive/question-index.js')).rows,
    catalog: core.decodeCatalog(json(outputs.get('archive/data/archive2-catalog.json'))).records,
  };
  for (const [name, baseRows, rows, key] of [
    ['db', dbBase.exams, reread.db, 'file'], ['identity', identityBase.records, reread.identity, 'sourceArchiveFile'],
    ['metadata', metadataBase.records, reread.metadata, 'sourceArchiveFile'], ['index', indexBase, reread.index, 'sourceFile'],
    ['catalog', catalogBase.records, reread.catalog, 'sourceFile'],
  ]) if (!deep(baseRows.filter(row => core.normalizeFile(row[key]) !== sourceFile), rows.filter(row => core.normalizeFile(row[key]) !== sourceFile))) fail('NON_TARGET_DEEP_INVARIANCE_FAIL', name);
  for (const [relative, bytes] of outputs) {
    if (relative.endsWith('.js')) new vm.Script(bytes.toString('utf8'), { filename: relative });
    else if (relative.endsWith('.json')) json(bytes);
    else if (!relative.endsWith('.md')) fail('UNSUPPORTED_OUTPUT_KIND', relative);
  }
  return {
    outputs, source, qids, proofChain,
    receipt: {
      schemaVersion: 'JS_ARCHIVE_EXISTING_TARGET_REGISTRATION_UPDATE_V1', status: 'MERGE_VALIDATED_NOT_APPLIED',
      runId: assignment.runId, examUid: assignment.examUid, head, source: { path: assignment.productionRelativePath, rawSha256: sha(source.bytes), gitBlobSha1: gitBlobSha(source.bytes), questionCount: qCount },
      targetQids: qids, targetCounts: { identity: qCount, metadata: qCount, index: qCount, catalog: qCount, db: 1 },
      preservedProofs: plan.preservedProofs, currentStageProofs: proofChain,
      nonTargetInvariance: { checked: true, db: true, identity: true, metadata: true, index: true, catalog: true, runtimeUidTuples: true, runtimeFileIndices: true },
      semanticMetaDisposition: 'CURRENT_R1_META_BOUND_PHYSICAL_DELTA_NO_APPROVAL_PROMOTION',
      metaDeltaPolicy: metaDelta.policy,
      metaDelta: metaDelta.changes,
      originalTargetMetadataSha256: plan.originalTargetMetadataSha256,
      baselineBindings: plan.baselineBindings,
      changedFiles: paths.map(relativePath => ({ relativePath, beforeSha256: sha(fs.readFileSync(safeRootPath(fs.realpathSync(root), relativePath))), afterSha256: sha(outputs.get(relativePath)) })),
      apply: { requested: false, sharedFilesWritten: false },
    },
  };
}

export function applyExistingTargetOutputs({ root, outputDir, outputs, plan, receipt, assignment, proofManifestPath, apply = false, renameFile = fs.renameSync }) {
  const realRoot = fs.realpathSync(root), out = path.resolve(realRoot, outputDir);
  const relativeOut = path.relative(realRoot, out).replaceAll('\\', '/');
  if (!relativeOut.startsWith('.tmp/archive/' + plan.runId + '/' + plan.examUid + '/')) fail('OUTPUT_MUST_BE_ASSIGNED_TEMP_EVIDENCE');
  if (fs.existsSync(out)) fail('FRESH_OUTPUT_DIRECTORY_REQUIRED');
  const currentHead = execFileSync('git', ['-C', realRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (currentHead !== plan.expectedHead || assignment.expectedHead !== plan.expectedHead) fail('HEAD_CHANGED_BEFORE_APPLY');
  const backups = new Map();
  for (const row of plan.baselineBindings) {
    const file = safeRootPath(realRoot, row.relativePath), bytes = fs.readFileSync(file);
    if (sha(bytes) !== row.sha256) fail('APPLY_BASELINE_CHANGED', row.relativePath);
    backups.set(row.relativePath, bytes);
  }
  const sourceBytes = fs.readFileSync(safeRootPath(realRoot, assignment.productionRelativePath));
  if (sha(sourceBytes) !== plan.source.rawSha256 || gitBlobSha(sourceBytes) !== plan.source.gitBlobSha1) fail('SOURCE_CHANGED_BEFORE_APPLY');
  for (const proof of [...(plan.preservedProofs || []), ...(plan.currentStageProofs?.stages || [])]) {
    if (sha(fs.readFileSync(safeRootPath(realRoot, proof.path))) !== proof.sha256) fail('PROOF_CHANGED_BEFORE_APPLY', proof.path);
  }
  if (!proofManifestPath || proofManifestPath !== plan.currentStageProofs?.path) fail('PROOF_MANIFEST_PATH_MISMATCH');
  const proofManifest = json(fs.readFileSync(safeRootPath(realRoot, proofManifestPath)));
  const proofChain = validateCurrentProofChain({ root: realRoot, assignment, proofManifest, proofManifestPath });
  if (!deep(proofChain, plan.currentStageProofs)) fail('CURRENT_PROOF_VALIDATION_CHANGED');
  for (const asset of plan.releaseAssets || []) if (sha(fs.readFileSync(safeRootPath(realRoot, path.join('archive', asset.ref)))) !== asset.sha256) fail('ASSET_CHANGED_BEFORE_APPLY', asset.ref);
  fs.mkdirSync(out, { recursive: true });
  for (const [relative, bytes] of outputs) {
    if (relative.endsWith('.js')) new vm.Script(bytes.toString('utf8'), { filename: relative });
    else if (relative.endsWith('.json')) json(bytes);
    else if (!relative.endsWith('.md')) fail('UNSUPPORTED_OUTPUT_KIND', relative);
    const tmp = safeRootPath(realRoot, path.join(relativeOut, 'candidate', relative));
    fs.mkdirSync(path.dirname(tmp), { recursive: true }); fs.writeFileSync(tmp, bytes);
  }
  const backupRoot = path.join(out, 'rollback-backups');
  for (const [relative, bytes] of backups) {
    const file = path.join(backupRoot, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
  }
  const changes = [...outputs].filter(([relative, bytes]) => sha(backups.get(relative)) !== sha(bytes));
  const written = [], createdTemps = [];
  if (apply !== true) {
    receipt.apply = { requested: false, sharedFilesWritten: false };
    receipt.status = 'MERGE_VALIDATED_NOT_APPLIED';
    receipt.nextRequiredAction = 'ROOT_DECIDE_EXPLICIT_APPLY';
    const receiptPath = path.join(out, 'existing-target-update.receipt.json');
    fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
    return { receipt, receiptPath: path.relative(realRoot, receiptPath).replaceAll('\\', '/') };
  }
  try {
    for (const [relative, bytes] of changes) {
      const target = safeRootPath(realRoot, relative), expected = plan.baselineBindings.find(row => row.relativePath === relative);
      if (sha(fs.readFileSync(target)) !== expected.sha256) fail('APPLY_CONCURRENT_WRITE_DETECTED', relative);
      const temp = target + '.existing-target-update.tmp';
      if (fs.existsSync(temp)) fail('APPLY_TEMP_PATH_ALREADY_EXISTS', relative);
      fs.writeFileSync(temp, bytes);
      createdTemps.push(temp);
      written.push(relative);
      renameFile(temp, target);
    }
    for (const [relative, bytes] of outputs) if (sha(fs.readFileSync(safeRootPath(realRoot, relative))) !== sha(bytes)) fail('APPLY_READBACK_MISMATCH', relative);
    receipt.status = 'APPLIED_PENDING_VALIDATORS';
    receipt.nextRequiredAction = 'RUN_CURRENT_REGISTRATION_VALIDATORS_AND_READBACK';
    receipt.apply = { requested: true, sharedFilesWritten: true, rollbackBackupDirectory: path.relative(realRoot, backupRoot).replaceAll('\\', '/'), rollback: { restored: [], conflicts: [] } };
    const receiptPath = path.join(out, 'existing-target-update.receipt.json');
    fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
    return { receipt, receiptPath: path.relative(realRoot, receiptPath).replaceAll('\\', '/') };
  } catch (error) {
    const restored = [], conflicts = [];
    for (const temp of createdTemps) if (fs.existsSync(temp)) fs.rmSync(temp);
    for (const relative of written.reverse()) {
      const target = safeRootPath(realRoot, relative), temp = target + '.existing-target-update.tmp';
      if (fs.existsSync(temp)) fs.rmSync(temp);
      const currentSha = sha(fs.readFileSync(target));
      if (currentSha === sha(backups.get(relative))) continue;
      if (currentSha !== sha(outputs.get(relative))) { conflicts.push(relative); continue; }
      const saved = backups.get(relative), restoreTemp = target + '.existing-target-rollback.tmp';
      if (fs.existsSync(restoreTemp)) { conflicts.push(relative); continue; }
      try { fs.writeFileSync(restoreTemp, saved); fs.renameSync(restoreTemp, target); restored.push(relative); }
      catch { if (fs.existsSync(restoreTemp)) fs.rmSync(restoreTemp); conflicts.push(relative); }
    }
    receipt.status = 'APPLY_FAILED_ROLLBACK_ATTEMPTED';
    receipt.apply = { requested: true, sharedFilesWritten: false, rollback: { restored, conflicts } };
    receipt.failure = String(error?.stack || error);
    const failurePath = path.join(out, 'existing-target-update.failure.json');
    fs.writeFileSync(failurePath, JSON.stringify(receipt, null, 2) + '\n');
    throw error;
  }
}

async function main() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const key = process.argv[i];
    if (key === '--apply') args.apply = true;
    else if (['--root', '--assignment', '--plan', '--plan-sha256', '--candidate-root', '--proof-manifest', '--output-dir'].includes(key)) args[key.slice(2)] = process.argv[++i];
    else fail('UNKNOWN_ARGUMENT', key);
  }
  for (const key of ['root', 'assignment', 'plan', 'plan-sha256', 'candidate-root', 'proof-manifest', 'output-dir']) if (!args[key]) fail('REQUIRED_ARGUMENT', key);
  const root = fs.realpathSync(path.resolve(args.root));
  const assignment = json(fs.readFileSync(safeRootPath(root, args.assignment)));
  const planBytes = fs.readFileSync(safeRootPath(root, args.plan));
  if (sha(planBytes) !== args['plan-sha256']) fail('PLAN_SHA256_MISMATCH');
  const plan = json(planBytes);
  if (plan.currentStageProofs?.path !== args['proof-manifest']) fail('PLAN_PROOF_MANIFEST_PATH_MISMATCH');
  if (plan.schemaVersion !== 'JS_ARCHIVE_EXISTING_TARGET_REGISTRATION_UPDATE_V1' || plan.status !== 'UPDATE_CANDIDATE_READY_NOT_APPLIED' || plan.route !== 'EXISTING_TARGET_UPDATE') fail('EXISTING_TARGET_UPDATE_CANDIDATE_REQUIRED');
  const built = await buildExistingTargetMerge({ root, assignment, plan, candidateRoot: args['candidate-root'], proofManifestPath: args['proof-manifest'] });
  const result = applyExistingTargetOutputs({ root, outputDir: args['output-dir'], outputs: built.outputs, plan, receipt: built.receipt, assignment, proofManifestPath: args['proof-manifest'], apply: args.apply === true });
  console.log(JSON.stringify({ ...result.receipt, receiptPath: result.receiptPath, sharedFilesWritten: Boolean(args.apply) }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(JSON.stringify({ status: 'BLOCKED', code: error.code || 'ERROR', message: error.message })); process.exitCode = 1; });
