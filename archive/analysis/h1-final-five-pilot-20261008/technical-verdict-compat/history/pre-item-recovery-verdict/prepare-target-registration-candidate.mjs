#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import core from '../archive2-core.js';
import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';
import { questionUidForSource } from './meta-foundation/rpm-active-resolver.mjs';
import { validateR1Evidence } from './archive-stage-validator-r1-v2.mjs';
import { validateCodexRenderReceipt } from './archive-codex-closeout-v2.mjs';

const QUALITY_CONTRACT_V2 = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const PRODUCER_SCHEMA = 'JS_ARCHIVE_TARGET_REGISTRATION_CANDIDATE_PRODUCER_V1';
const REGISTRATION_BASELINE_FILES = Object.freeze([
  'archive/db.js', 'archive/data/question_identity_map.json', 'archive/data/question_metadata.json',
  'archive/question-identity.js', 'archive/question-index.js', 'archive/question-index-report.md',
  'archive/question-index-audit.md', 'archive/data/archive2-catalog.json',
  'archive/data/archive2-canonical-input-manifest.json',
]);
const REGISTRATION_BASELINE_SET = new Set(REGISTRATION_BASELINE_FILES);

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hashJson = value => sha256(Buffer.from(JSON.stringify(value), 'utf8'));
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const text = value => typeof value === 'string' ? value.trim() : '';
const jsonClone = value => JSON.parse(JSON.stringify(value));
const stableSortObject = object => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b, 'en')));
const isWithin = (root, target) => {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
};

function assert(condition, code, detail = '') {
  if (!condition) throw new Error(detail ? `${code}:${detail}` : code);
}

function parseArgs(argv) {
  const args = {};
  const known = new Set(['--root', '--authority', '--roster', '--roster-index', '--assignment', '--r1-evidence', '--r1-validation', '--r1-reuse-manifest', '--candidate-root', '--index-root', '--evidence-root', '--package-output']);
  for (let index = 2; index < argv.length; index += 1) {
    const key = argv[index];
    if (!known.has(key)) throw new Error('UNKNOWN_ARGUMENT:' + key);
    args[key.slice(2)] = argv[++index];
  }
  for (const key of ['--root', '--authority', '--roster', '--roster-index', '--assignment', '--candidate-root', '--evidence-root', '--package-output']) {
    const value = args[key.slice(2)];
    if (value === undefined || value === '') throw new Error('REQUIRED_ARGUMENT:' + key);
  }
  const normalProof = Boolean(args['r1-evidence'] && args['r1-validation']);
  const partialNormalProof = Boolean(args['r1-evidence']) !== Boolean(args['r1-validation']);
  assert(!partialNormalProof && (normalProof !== Boolean(args['r1-reuse-manifest'])), 'R1_PROOF_INPUT_MODE_INVALID');
  args['roster-index'] = Number(args['roster-index']);
  if (!Number.isInteger(args['roster-index']) || args['roster-index'] < 0) throw new Error('ROSTER_INDEX_INVALID');
  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function runVmSource(sourcePath) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { filename: sourcePath, timeout: 5000 });
  const bank = context.window.questionBank || context.window.questions || context.questionBank || context.questions;
  assert(Array.isArray(bank) && bank.length > 0, 'TARGET_BANK_REQUIRED', sourcePath);
  return { window: context.window, bank: bank.map(question => jsonClone(question)) };
}

export function parseAuthorizedDisplayIdentity({ examUid, productionRelativePath, grade, course }) {
  assert(nonempty(examUid) && nonempty(productionRelativePath), 'DISPLAY_IDENTITY_REQUIRED');
  const file = core.normalizeFile(String(productionRelativePath).replace(/^archive\/exams\//, ''));
  assert(/^original\/high\/(h1|h2)\//.test(file) && file.endsWith('.js'), 'TARGET_PRODUCTION_PATH_REQUIRED', file);
  assert(path.basename(file, '.js') === examUid, 'EXAM_UID_PATH_PARITY_REQUIRED', examUid);
  const match = /^(\d{2})_([^_]+)_([12])학기_(중간|기말)_(고[123])_(.+)$/.exec(examUid);
  assert(match, 'LOCKED_DISPLAY_ALIAS_FORMAT_UNSUPPORTED', examUid);
  const [, yearToken, school, semesterToken, examTypeToken, uidGrade, suffix] = match;
  const rosterGrade = String(grade || '').toLowerCase();
  const gradeDisplay = ({ h1: '고1', h2: '고2', h3: '고3' })[rosterGrade];
  assert(gradeDisplay && uidGrade === gradeDisplay, 'ROSTER_GRADE_ALIAS_MISMATCH', examUid);
  assert(file.startsWith(`original/high/${rosterGrade}/`), 'ROSTER_GRADE_SOURCE_PATH_MISMATCH', `${rosterGrade}|${file}`);
  const courseCode = String(course || '');
  const suffixParts = suffix.split('_');
  const hasPastExamSuffix = suffixParts.at(-1) === '기출';
  const uidSubject = hasPastExamSuffix ? suffixParts.slice(0, -1).join('_') : suffix;
  // H1's canonical Archive DB stores first-term finals with the locked exam UID ending in `_기출`;
  // the existing DB's subject/primaryStandardCourse fields supply the display alias.
  const subject = uidSubject || (rosterGrade === 'h1' ? courseCode : '');
  const acceptedSubjects = courseCode === 'math2'
    ? new Set(['수학II', '수학Ⅱ'])
    : courseCode === 'geometry'
      ? new Set(['기하', '기하와벡터', '기하와 벡터'])
      : rosterGrade === 'h1' && courseCode === '수학(상)'
        ? new Set(['수학(상)'])
        : new Set();
  assert(acceptedSubjects.has(subject), 'ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH', `${courseCode}|${subject}`);
  return {
    sourceFile: file,
    displayAlias: { school, year: 2000 + Number(yearToken), semester: semesterToken.slice(0, 1), examType: examTypeToken === '중간' ? 'mid' : 'final', grade: gradeDisplay, subject, contentType: file.startsWith('original/') ? '기출' : '' },
  };
}

function metaRangeRows(bank) {
  const groups = new Map();
  for (let index = 0; index < bank.length; index += 1) {
    const question = bank[index];
    const standardCourse = text(question.standardCourse);
    const standardUnitKey = text(question.standardUnitKey);
    const standardUnit = text(question.standardUnit);
    const standardUnitOrder = Number(question.standardUnitOrder);
    assert(standardCourse && standardUnitKey && standardUnit, 'R1_EMBEDDED_UNIT_META_REQUIRED', String(index + 1));
    assert(Number.isInteger(standardUnitOrder) && standardUnitOrder >= 0, 'R1_EMBEDDED_UNIT_ORDER_REQUIRED', String(index + 1));
    const match = /^(.*)-(\d{1,2})$/.exec(standardUnitKey);
    assert(match && match[1], 'CANONICAL_UNIT_PREFIX_UNRESOLVED', standardUnitKey);
    const courseCode = match[1];
    const groupKey = `${standardCourse}\u0000${courseCode}`;
    if (!groups.has(groupKey)) groups.set(groupKey, { standardCourse, courseCode, units: new Map() });
    const group = groups.get(groupKey);
    const unit = group.units.get(standardUnitKey);
    const candidate = { standardUnitKey, standardUnit, standardUnitOrder, firstOrdinal: index + 1 };
    if (unit && (unit.standardUnit !== standardUnit || unit.standardUnitOrder !== standardUnitOrder)) {
      throw new Error(`R1_META_UNIT_PARITY_CONFLICT:${standardUnitKey}`);
    }
    if (!unit) group.units.set(standardUnitKey, candidate);
  }
  return [...groups.values()].map(group => {
    const units = [...group.units.values()].sort((a, b) => a.standardUnitOrder - b.standardUnitOrder || a.firstOrdinal - b.firstOrdinal);
    for (let index = 1; index < units.length; index += 1) {
      if (units[index - 1].standardUnitOrder === units[index].standardUnitOrder && units[index - 1].standardUnitKey !== units[index].standardUnitKey) {
        throw new Error(`R1_META_UNIT_ORDER_CONFLICT:${group.courseCode}:${units[index].standardUnitOrder}`);
      }
    }
    const first = units[0], last = units.at(-1);
    return {
      standardCourse: group.standardCourse,
      courseCode: group.courseCode,
      rangeStartUnitKey: first.standardUnitKey,
      rangeStartUnit: first.standardUnit,
      rangeStartUnitOrder: first.standardUnitOrder,
      rangeEndUnitKey: last.standardUnitKey,
      rangeEndUnit: last.standardUnit,
      rangeEndUnitOrder: last.standardUnitOrder,
    };
  });
}

export function buildAuthorizedDbRow({ examUid, productionRelativePath, grade, course, bank }) {
  assert(Array.isArray(bank) && bank.length > 0, 'SOURCE_VM_BANK_REQUIRED');
  const { sourceFile, displayAlias } = parseAuthorizedDisplayIdentity({ examUid, productionRelativePath, grade, course });
  const courseRanges = metaRangeRows(bank);
  const singleRange = courseRanges.length === 1 ? courseRanges[0] : null;
  return {
    file: sourceFile,
    school: displayAlias.school,
    topic: '',
    grade: displayAlias.grade,
    year: displayAlias.year,
    semester: displayAlias.semester,
    examType: displayAlias.examType,
    subject: displayAlias.subject,
    contentType: displayAlias.contentType,
    qCount: bank.length,
    rangeStartUnitKey: singleRange?.rangeStartUnitKey || '',
    rangeStartUnit: singleRange?.rangeStartUnit || '',
    rangeStartUnitOrder: singleRange?.rangeStartUnitOrder ?? null,
    rangeEndUnitKey: singleRange?.rangeEndUnitKey || '',
    rangeEndUnit: singleRange?.rangeEndUnit || '',
    rangeEndUnitOrder: singleRange?.rangeEndUnitOrder ?? null,
    courseRanges,
    primaryStandardCourse: displayAlias.subject,
  };
}

export function canonicalSourceFingerprint(question) {
  return sha256(Buffer.from(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    answer: question?.answer ?? null,
    solution: question?.solution ?? null,
    image: question?.image ?? null,
  }), 'utf8'));
}

export function canonicalContentFingerprint(question) {
  return sha256(Buffer.from(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    image: question?.image ?? null,
  }), 'utf8'));
}

export function makeTargetIdentityRows(sourceFile, bank) {
  assert(Array.isArray(bank) && bank.length > 0, 'SOURCE_VM_BANK_REQUIRED');
  return bank.map((question, index) => {
    const sourceOrdinal = index + 1;
    const sourceQuestionNo = String(question?.id ?? '');
    assert(sourceQuestionNo, 'SOURCE_QUESTION_ID_REQUIRED', String(sourceOrdinal));
    return {
      questionUid: questionUidForSource(sourceFile, sourceOrdinal),
      legacyQKey: `${sourceFile}_${sourceQuestionNo}`,
      sourceArchiveFile: sourceFile,
      sourceOrdinal,
      sourceQuestionNo,
      sourceFingerprint: canonicalSourceFingerprint(question),
    };
  });
}

function sourceValue(question, key, fallback = '') {
  return hasOwn(question, key) ? question[key] : fallback;
}

function sourceFieldStatus(question, key, nullableProjection = false) {
  if (key === 'subUnitKey' && nullableProjection && hasOwn(question, 'subUnitKey')) return 'approved_source';
  const value = question[key];
  return value !== null && value !== undefined && String(value).trim() !== '' ? 'approved_source' : 'manual_review_pending';
}

export function makeTargetMetadataRows({ sourceFile, bank, identityRows, r1EvidencePath }) {
  assert(identityRows.length === bank.length, 'TARGET_METADATA_IDENTITY_DENOMINATOR_MISMATCH');
  return bank.map((question, index) => {
    const identity = identityRows[index];
    assert(identity.sourceOrdinal === index + 1, 'TARGET_METADATA_IDENTITY_ORDINAL_MISMATCH', String(index + 1));
    const nullableProjection = question.subUnitKey === null;
    const fieldStatus = {
      standardUnit: sourceFieldStatus(question, 'standardUnitKey'),
      subUnit: sourceFieldStatus(question, 'subUnitKey', nullableProjection),
      concept: sourceFieldStatus(question, 'conceptClusterKey'),
      problemType: sourceFieldStatus(question, 'problemTypeKey'),
      template: sourceFieldStatus(question, 'templateKey'),
      difficulty: sourceFieldStatus(question, 'difficultyBucket'),
    };
    const hasExplicitHolds = Object.values(fieldStatus).some(value => value === 'manual_review_pending');
    const row = {
      questionUid: identity.questionUid,
      sourceArchiveFile: sourceFile,
      sourceOrdinal: identity.sourceOrdinal,
      sourceQuestionNo: identity.sourceQuestionNo,
      sourceFingerprint: identity.sourceFingerprint,
      contentFingerprint: canonicalContentFingerprint(question),
      standardCourse: sourceValue(question, 'standardCourse', sourceValue(question, 'course')),
      standardUnitKey: sourceValue(question, 'standardUnitKey'),
      standardUnit: sourceValue(question, 'standardUnit'),
      standardUnitOrder: sourceValue(question, 'standardUnitOrder'),
      subUnitKey: sourceValue(question, 'subUnitKey', null),
      subUnit: sourceValue(question, 'subUnit'),
      conceptClusterKey: sourceValue(question, 'conceptClusterKey', null),
      problemTypeKey: sourceValue(question, 'problemTypeKey', null),
      templateKey: sourceValue(question, 'templateKey', null),
      difficultyBucket: sourceValue(question, 'difficultyBucket', null),
      difficultyConfidence: sourceValue(question, 'difficultyConfidence', null),
      difficultyBoundaryFlag: sourceValue(question, 'difficultyBoundaryFlag', null),
      legacyLevelCompatibility: sourceValue(question, 'legacyLevelCompatibility', null),
      crossConceptKeys: sourceValue(question, 'crossConceptKeys', []),
      conditionKeys: sourceValue(question, 'conditionKeys', []),
      integrationPattern: sourceValue(question, 'integrationPattern', ''),
      tagConfidence: sourceValue(question, 'tagConfidence', sourceValue(question, 'subUnitConfidence')),
      tagStatus: sourceValue(question, 'tagStatus'),
      metadataStatus: nonempty(question.metadataStatus) ? question.metadataStatus : (hasExplicitHolds ? 'approved_partial_with_explicit_holds' : 'approved_source'),
      fieldStatus: hasOwn(question, 'fieldStatus') && question.fieldStatus && typeof question.fieldStatus === 'object'
        ? jsonClone(question.fieldStatus)
        : fieldStatus,
      metadataRevision: sourceValue(question, 'metadataRevision', 'archive-registration-target-source-projection-v1'),
      approvalEvidence: [...new Set([...(Array.isArray(question.approvalEvidence) ? question.approvalEvidence.filter(nonempty) : []), r1EvidencePath])],
    };
    for (const optional of ['subUnitConfidence', 'subUnitClassificationDepth', 'conceptClusterKey', 'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable', 'reviewStatus']) {
      if (hasOwn(question, optional)) row[optional] = jsonClone(question[optional]);
    }
    return row;
  });
}

export function appendDbExamRow(baseBytes, row) {
  const textValue = Buffer.from(baseBytes).toString('utf8');
  const eol = Buffer.from(baseBytes).includes(Buffer.from('\r\n')) ? '\r\n' : '\n';
  const closeAt = textValue.lastIndexOf(eol + '  ]');
  assert(closeAt >= 0, 'DB_EXAMS_ARRAY_CLOSE_LOCUS_MISSING');
  const rowText = JSON.stringify(row, null, 2).split('\n').map(line => '    ' + line).join(eol);
  const next = textValue.slice(0, closeAt).replace(/[ \t\r\n]*$/, '') + ',' + eol + rowText + textValue.slice(closeAt);
  const context = { window: {} };
  vm.runInNewContext(next, context, { timeout: 3000 });
  assert(context.window.mainDB?.exams?.at(-1)?.file === row.file, 'DB_TARGET_ROW_INSERT_VALIDATION_FAILED');
  return Buffer.from(next, 'utf8');
}

export function assertCandidateStatusIsRegistryOnly(statusPorcelainZ) {
  const entries = String(statusPorcelainZ || '').split('\0').filter(Boolean);
  for (const entry of entries) {
    const changedPath = entry.slice(3).replaceAll('\\', '/');
    assert(REGISTRATION_BASELINE_SET.has(changedPath), 'CANDIDATE_NON_BASELINE_DIRTY', changedPath);
  }
  return entries.length;
}

function mergeIdentityMap(base, targetRows, head) {
  const records = [...base.records, ...targetRows].sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') || Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  const byQuestionUid = {}, byLegacyQKey = {}, bySourceFileAndOrdinal = {}, bySourceFileAndQuestionNo = {};
  for (const row of records) {
    byQuestionUid[row.questionUid] = { sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal, sourceQuestionNo: row.sourceQuestionNo };
    (byLegacyQKey[row.legacyQKey] ??= []).push(row.questionUid);
    (bySourceFileAndOrdinal[row.sourceArchiveFile] ??= {})[String(row.sourceOrdinal)] = row.questionUid;
    (bySourceFileAndQuestionNo[row.sourceArchiveFile] ??= {})[String(row.sourceQuestionNo ?? '')] = ((bySourceFileAndQuestionNo[row.sourceArchiveFile][String(row.sourceQuestionNo ?? '')]) || []).concat(row.questionUid);
  }
  const next = {
    ...base,
    sourceCommit: head,
    records,
    lookup: { byQuestionUid: stableSortObject(byQuestionUid), byLegacyQKey: stableSortObject(byLegacyQKey), bySourceFileAndOrdinal: stableSortObject(bySourceFileAndOrdinal), bySourceFileAndQuestionNo: stableSortObject(bySourceFileAndQuestionNo) },
    stats: { ...(base.stats || {}), examFileCount: new Set(records.map(row => row.sourceArchiveFile)).size, sourceQuestionCount: records.length, uniqueQuestionUidCount: new Set(records.map(row => row.questionUid)).size, duplicateQuestionUidCount: 0, failures: 0 },
    incrementalSync: { schemaVersion: 'question-identity-incremental-sync-v2', sourceCommit: head, newFiles: 1, newRecords: targetRows.length, newSourceFiles: [targetRows[0].sourceArchiveFile], renamedFiles: [], renamedRecords: 0, renamedSourceFiles: [] },
    generatedAt: new Date().toISOString(),
  };
  delete next.identityDigest;
  const stable = { ...next };
  delete stable.generatedAt;
  next.identityDigest = hashJson(stable);
  return next;
}

function mergeMetadata(base, targetRows, identityText) {
  const records = [...base.records, ...targetRows].sort((a, b) => String(a.questionUid).localeCompare(String(b.questionUid), 'en'));
  const sourceJoinKeys = new Set(records.map(row => String(row.sourceArchiveFile).replace(/\\/g, '/') + '#' + Number(row.sourceOrdinal)));
  assert(sourceJoinKeys.size === records.length && new Set(records.map(row => row.questionUid)).size === records.length, 'TARGET_METADATA_IDENTITY_UNIQUENESS_FAIL');
  const next = {
    ...base,
    generatedAt: new Date().toISOString(),
    sourceDigests: { ...(base.sourceDigests || {}), identityMap: sha256(Buffer.from(identityText, 'utf8')) },
    consistency: { ...(base.consistency || {}), sourceFingerprintFailures: Number(base.consistency?.sourceFingerprintFailures || 0), sourceClassificationConflicts: Number(base.consistency?.sourceClassificationConflicts || 0), productionValuesWinOnMerge: true },
    counts: {
      ...(base.counts || {}), records: records.length, uidUnique: true, sourceJoinUnique: true,
      semanticallyReviewed: records.filter(row => row.reviewStatus === 'reviewed_pass' || row.metadataStatus === 'approved_semantic_review' || row.metadataStatus === 'approved_exam_meta_source').length,
      explicitProblemTypeHolds: records.filter(row => row.fieldStatus?.problemType === 'manual_review_pending').length,
      explicitTemplateHolds: records.filter(row => row.fieldStatus?.template === 'manual_review_pending').length,
      explicitDifficultyHolds: records.filter(row => row.fieldStatus?.difficulty === 'manual_review_pending').length,
    },
    records,
    registrationSync: { schemaVersion: 'archive-registration-metadata-sync-v2', added: targetRows.length, addedFiles: [targetRows[0].sourceArchiveFile], relocated: 0, relocatedFiles: [] },
  };
  delete next.digest;
  next.digest = hashJson(next);
  return next;
}

function verifyR1MetaProof(evidence, assignment, examUid, bank) {
  assert(evidence?.stage === 'R1' && evidence.examUid === examUid && evidence.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006' && evidence.executionLine === 'CODEX', 'R1_META_PROOF_IDENTITY_INVALID');
  assert(evidence.artifactSha === assignment.validatorRawBufferBlobSha1, 'R1_META_PROOF_ARTIFACT_SHA_MISMATCH');
  if (evidence.artifactRawSha256 !== undefined) assert(evidence.artifactRawSha256 === assignment.artifactRawSha256, 'R1_META_PROOF_RAW_SHA_MISMATCH');
  if (evidence.artifactRawBufferBlobSha1 !== undefined) assert(evidence.artifactRawBufferBlobSha1 === assignment.validatorRawBufferBlobSha1, 'R1_META_PROOF_BLOB_SHA_MISMATCH');
  assert(Array.isArray(evidence.rows) && evidence.rows.length === bank.length, 'R1_META_PROOF_DENOMINATOR_MISMATCH');
  const expected = bank.map((_, index) => index + 1);
  const actual = evidence.rows.map(row => Number(row.qid)).sort((a, b) => a - b);
  assert(JSON.stringify(actual) === JSON.stringify(expected), 'R1_META_PROOF_QID_SET_MISMATCH');
  assert(evidence.rows.every(row => isAcceptedR1Verdict(row.verdict) && hasAcceptedMetaDisposition(row)), 'R1_META_PROOF_META_PASS_REQUIRED');
}

function isAcceptedR1Verdict(value) {
  return value === 'PASS' || value === 'PASS_AFTER_ADJUDICATION' || value === 'PASS_AFTER_SAME_STAGE_SOURCE_FIGURE_ADJUDICATION' || value === 'PASS_AFTER_REPAIR';
}

const acceptedMetaPassValues = new Set([
  'PASS',
  'PASS_WITH_RPM_PROJECTION_DEBT',
  'PASS_CURRENT_FIELDS_AND_RPM_PROOF',
  'PASS_AFTER_RECHECK',
  'SAME_STAGE_CLASSIFICATION_REPAIR_PASS',
  'CURRENT_FIELDS_RECORDED_NO_SEMANTIC_RECLASSIFICATION',
]);

function metaProofValues(row) {
  const values = [];
  const push = value => { if (typeof value === 'string' && value.trim()) values.push(value.trim()); };
  const axis = row?.axisEvidence?.META ?? row?.axisEvidence?.meta;
  push(axis?.status); push(axis?.verdict); push(axis?.metaStatus);
  push(row?.metaStatus); push(row?.metaReview?.status); push(row?.metaAudit?.status);
  const fourAxisMeta = row?.fourAxisReview?.META ?? row?.fourAxisReview?.meta;
  if (typeof fourAxisMeta === 'string') push(fourAxisMeta);
  else {
    push(fourAxisMeta?.status); push(fourAxisMeta?.verdict);
    if (['CURRENT_FIELDS_RETAINED', 'CURRENT_NULL_DEBT_PRESERVED'].includes(fourAxisMeta?.disposition)
      && typeof fourAxisMeta.evidence === 'string' && fourAxisMeta.evidence.trim()) {
      values.push('REVIEWED_CURRENT_META_DISPOSITION');
    }
  }
  return values;
}

function hasAcceptedMetaDisposition(row) {
  const values = metaProofValues(row);
  return values.some(value => acceptedMetaPassValues.has(value) || value === 'REVIEWED_CURRENT_META_DISPOSITION');
}

export function verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment, examUid, bank }) {
  assert(nonempty(evidencePath), 'R1_EVIDENCE_PATH_REQUIRED');
  const rootReal = fs.realpathSync(root);
  const evidenceCandidate = path.resolve(rootReal, evidencePath);
  assert(isWithin(rootReal, evidenceCandidate), 'R1_EVIDENCE_PATH_OUTSIDE_ROOT');
  const evidenceReal = fs.realpathSync(evidenceCandidate);
  assert(isWithin(rootReal, evidenceReal), 'R1_EVIDENCE_SYMLINK_OUTSIDE_ROOT');
  const relative = path.relative(rootReal, evidenceReal).split(path.sep).join('/');
  if (assignment.r1EvidencePath !== undefined) {
    assert(assignment.r1EvidencePath === relative, 'ASSIGNMENT_R1_PATH_MISMATCH');
  }
  const bytes = fs.readFileSync(evidenceReal);
  const evidenceSha256 = sha256(bytes);
  assert(nonempty(assignment.r1EvidenceSha256) && assignment.r1EvidenceSha256 === evidenceSha256, 'ASSIGNMENT_R1_SHA256_MISMATCH');
  let evidence;
  try {
    evidence = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error('R1_EVIDENCE_JSON_INVALID');
  }
  verifyR1MetaProof(evidence, assignment, examUid, bank);
  const validationCandidate = path.resolve(rootReal, validationPath || '');
  assert(nonempty(validationPath) && isWithin(rootReal, validationCandidate), 'R1_VALIDATION_PATH_OUTSIDE_ROOT');
  const validationReal = fs.realpathSync(validationCandidate);
  assert(isWithin(rootReal, validationReal), 'R1_VALIDATION_SYMLINK_OUTSIDE_ROOT');
  const validationRelative = path.relative(rootReal, validationReal).split(path.sep).join('/');
  if (assignment.r1ValidationPath !== undefined) assert(assignment.r1ValidationPath === validationRelative, 'ASSIGNMENT_R1_VALIDATION_PATH_MISMATCH');
  const validationBytes = fs.readFileSync(validationReal);
  const validationSha256 = sha256(validationBytes);
  assert(nonempty(assignment.r1ValidationSha256) && assignment.r1ValidationSha256 === validationSha256, 'ASSIGNMENT_R1_VALIDATION_SHA256_MISMATCH');
  let validation;
  try { validation = JSON.parse(validationBytes.toString('utf8').replace(/^\uFEFF/, '').trim()); }
  catch { throw new Error('R1_VALIDATION_JSON_INVALID'); }
  assert(validation?.ok === true && validation?.disposition === 'PASS' && validation?.validatorMode === 'R1_V2', 'R1_VALIDATION_NOT_PASS');
  assert(validation.stage === 'R1' && validation.examUid === examUid, 'R1_VALIDATION_IDENTITY_MISMATCH');
  assert(validation.artifactSha === evidence.artifactSha && validation.artifactSha === assignment.validatorRawBufferBlobSha1, 'R1_VALIDATION_ARTIFACT_SHA_MISMATCH');
  assert(validation.denominator === bank.length && validation.rowCount === bank.length && Array.isArray(validation.issues) && validation.issues.length === 0, 'R1_VALIDATION_DENOMINATOR_OR_ISSUES');
  const expectedEvidenceRef = path.resolve(rootReal, relative).replace(/\\/g, '/');
  const actualEvidenceRef = typeof validation.evidenceRef === 'string' ? path.resolve(validation.evidenceRef).replace(/\\/g, '/') : '';
  const authorizedEvidenceRef = typeof assignment.r1EvidenceReferencePath === 'string' ? path.resolve(assignment.r1EvidenceReferencePath).replace(/\\/g, '/') : '';
  assert(actualEvidenceRef === expectedEvidenceRef || (authorizedEvidenceRef && actualEvidenceRef === authorizedEvidenceRef), 'R1_VALIDATION_EVIDENCE_REF_MISMATCH');
  const expectedQids = bank.map((_, index) => index + 1);
  const shared = validateR1Evidence({ examUid, artifactSha: evidence.artifactSha, actualArtifactSha: assignment.validatorRawBufferBlobSha1, evidenceRef: validation.evidenceRef, evidence, expectedQids });
  assert(shared.ok && shared.disposition === 'PASS', 'R1_SHARED_VALIDATOR_REJECTED');
  return { relative, evidenceSha256, evidence, validationRelative, validationSha256, validation };
}

export function verifyR1ReuseBinding({ root, manifestPath, assignment, examUid, rosterIndex, productionPath, bank }) {
  const rootReal = fs.realpathSync(root);
  const readBoundFile = relative => {
    assert(nonempty(relative), 'R1_REUSE_PROOF_PATH_REQUIRED');
    const candidate = path.resolve(rootReal, relative);
    assert(isWithin(rootReal, candidate), 'R1_REUSE_PROOF_PATH_OUTSIDE_ROOT', relative);
    const real = fs.realpathSync(candidate);
    assert(isWithin(rootReal, real), 'R1_REUSE_PROOF_SYMLINK_OUTSIDE_ROOT', relative);
    return { relative: path.relative(rootReal, real).split(path.sep).join('/'), bytes: fs.readFileSync(real) };
  };
  const manifestFile = readBoundFile(manifestPath);
  const manifestSha256 = sha256(manifestFile.bytes);
  assert(assignment.r1ReuseManifestPath === manifestFile.relative && assignment.r1ReuseManifestSha256 === manifestSha256, 'R1_REUSE_MANIFEST_BINDING_MISMATCH');
  let manifest;
  try { manifest = JSON.parse(manifestFile.bytes.toString('utf8').replace(/^\uFEFF/, '')); }
  catch { throw new Error('R1_REUSE_MANIFEST_JSON_INVALID'); }
  assert(manifest.schemaVersion === 'ROOT_CURRENT_VALID_R1_REGISTRATION_PATHS_V1'
    && manifest.status === 'ACTUAL_VALIDATED_PROOFS_REFERENCED_NO_SEMANTIC_PROMOTION'
    && manifest.runId === assignment.runId, 'R1_REUSE_MANIFEST_AUTHORITY_REQUIRED');
  const target = manifest.rows?.[rosterIndex];
  assert(target?.reuse === true && target.examUid === examUid && target.productionPath === productionPath && target.metaSemanticsUnchangedConfirmed === true, 'R1_REUSE_SCOPE_OR_META_INVARIANCE_REQUIRED');

  const reuseAssessment = readBoundFile(target.reuseAssessment);
  const mainDone = readBoundFile(target.mainDoneReceipt);
  const historicalR1 = readBoundFile(target.historicalR1Evidence);
  const historicalR1Validation = readBoundFile(target.historicalR1Validation);
  const currentR3Validation = readBoundFile(target.currentR3Validation);
  const currentR3Evidence = readBoundFile(target.currentR3Evidence);
  const currentR3Adjudication = readBoundFile(target.currentR3Adjudication);
  let assessment, done, r1, r1Validation, r3Validation, r3Evidence, r3Adjudication;
  const parse = (file, code) => { try { return JSON.parse(file.bytes.toString('utf8').replace(/^\uFEFF/, '')); } catch { throw new Error(code); } };
  assessment = parse(reuseAssessment, 'R1_REUSE_ASSESSMENT_JSON_INVALID');
  done = parse(mainDone, 'R1_REUSE_MAIN_DONE_JSON_INVALID');
  r1 = parse(historicalR1, 'R1_REUSE_HISTORICAL_R1_JSON_INVALID');
  r1Validation = parse(historicalR1Validation, 'R1_REUSE_HISTORICAL_VALIDATION_JSON_INVALID');
  r3Validation = parse(currentR3Validation, 'R1_REUSE_CURRENT_R3_VALIDATION_JSON_INVALID');
  r3Evidence = parse(currentR3Evidence, 'R1_REUSE_CURRENT_R3_EVIDENCE_JSON_INVALID');
  r3Adjudication = parse(currentR3Adjudication, 'R1_REUSE_CURRENT_R3_ADJUDICATION_JSON_INVALID');

  const originalMainDonePath = done.originalMainDoneReceipt?.path;
  const originalMainDoneFile = readBoundFile(originalMainDonePath);
  const originalMainDoneSha256 = sha256(originalMainDoneFile.bytes);
  assert(originalMainDoneSha256 === done.originalMainDoneReceipt.sha256, 'R1_REUSE_ORIGINAL_MAIN_DONE_SHA_MISMATCH');
  const originalMainDone = parse(originalMainDoneFile, 'R1_REUSE_ORIGINAL_MAIN_DONE_JSON_INVALID');
  const renderPath = done.renderReceipt?.path;
  const renderFile = readBoundFile(renderPath);
  const renderSha256 = sha256(renderFile.bytes);
  assert(renderSha256 === done.renderReceipt.sha256, 'R1_REUSE_RENDER_RECEIPT_SHA_MISMATCH');
  const renderReceipt = parse(renderFile, 'R1_REUSE_RENDER_RECEIPT_JSON_INVALID');
  const intakePath = path.posix.join(path.posix.dirname(mainDone.relative), 'ROOT.MAIN_DONE.reuse-intake.json');
  const intakeFile = readBoundFile(intakePath);
  const mainDoneIntake = parse(intakeFile, 'R1_REUSE_MAIN_DONE_INTAKE_JSON_INVALID');

  const expectedPaths = [reuseAssessment.relative, mainDone.relative, historicalR1.relative, historicalR1Validation.relative,
    currentR3Validation.relative, currentR3Evidence.relative, currentR3Adjudication.relative, originalMainDoneFile.relative,
    renderFile.relative, intakeFile.relative];
  const boundHashes = assignment.r1ReuseProofSha256ByPath;
  assert(boundHashes && typeof boundHashes === 'object' && !Array.isArray(boundHashes), 'R1_REUSE_PROOF_HASH_MAP_REQUIRED');
  assert(JSON.stringify(Object.keys(boundHashes).sort()) === JSON.stringify([...expectedPaths].sort()), 'R1_REUSE_PROOF_HASH_MAP_SCOPE_MISMATCH');
  const proofFiles = [reuseAssessment, mainDone, historicalR1, historicalR1Validation, currentR3Validation, currentR3Evidence,
    currentR3Adjudication, originalMainDoneFile, renderFile, intakeFile];
  for (let index = 0; index < proofFiles.length; index += 1) {
    assert(boundHashes[proofFiles[index].relative] === sha256(proofFiles[index].bytes), 'R1_REUSE_PROOF_FILE_SHA_MISMATCH', proofFiles[index].relative);
  }

  assert(r1.stage === 'R1' && r1.examUid === examUid && r1.qualityContractVersion === QUALITY_CONTRACT_V2 && r1.executionLine === 'CODEX', 'R1_REUSE_HISTORICAL_R1_IDENTITY_INVALID');
  assert(r1Validation.ok === true && r1Validation.disposition === 'PASS' && r1Validation.validatorMode === 'R1_V2'
    && r1Validation.stage === 'R1' && r1Validation.examUid === examUid && r1Validation.artifactSha === r1.artifactSha,
  'R1_REUSE_HISTORICAL_VALIDATION_NOT_PASS');
  assert(r1Validation.denominator === bank.length && r1Validation.rowCount === bank.length && Array.isArray(r1Validation.issues) && r1Validation.issues.length === 0,
    'R1_REUSE_HISTORICAL_DENOMINATOR_OR_ISSUES');
  const historicalEvidenceSha256 = sha256(historicalR1.bytes);
  const historicalEvidenceCleanLfSha256 = sha256(Buffer.from(historicalR1.bytes.toString('utf8').replace(/\r\n/g, '\n'), 'utf8'));
  assert(r1Validation.evidenceSha256 === historicalEvidenceCleanLfSha256, 'R1_REUSE_HISTORICAL_CLEAN_LF_SHA_MISMATCH');
  const expectedHistoricalRefSuffix = '/' + historicalR1.relative;
  const historicalEvidenceRef = String(r1Validation.evidenceRef || '').replace(/\\/g, '/');
  assert(historicalEvidenceRef.endsWith(expectedHistoricalRefSuffix), 'R1_REUSE_HISTORICAL_EVIDENCE_REF_MISMATCH');
  const historicalAssignment = { artifactRawSha256: r1.currentArtifact?.fileSha256, validatorRawBufferBlobSha1: r1.artifactSha };
  verifyR1MetaProof(r1, historicalAssignment, examUid, bank);
  const sharedHistoricalR1 = validateR1Evidence({ examUid, artifactSha: r1.artifactSha, actualArtifactSha: r1.artifactSha,
    evidenceRef: r1Validation.evidenceRef, evidence: r1, expectedQids: bank.map((_, index) => index + 1) });
  assert(sharedHistoricalR1.ok && sharedHistoricalR1.disposition === 'PASS', 'R1_REUSE_HISTORICAL_SHARED_VALIDATOR_REJECTED');
  assert(r3Evidence.upstreamSeals?.r1?.artifactSha === r1.artifactSha
    && r3Evidence.upstreamSeals?.r1?.sha256 === historicalEvidenceCleanLfSha256, 'R1_REUSE_R3_UPSTREAM_R1_SEAL_MISMATCH');

  const currentBlob = assignment.validatorRawBufferBlobSha1;
  assert(r3Validation.ok === true && r3Validation.disposition === 'PASS' && r3Validation.validatorMode === 'R3_V2'
    && r3Validation.stage === 'R3' && r3Validation.examUid === examUid && r3Validation.artifactSha === currentBlob
    && Number.isInteger(r3Validation.scopeCount) && r3Validation.rowCount === r3Validation.scopeCount
    && r3Validation.scopeCount <= bank.length && Array.isArray(r3Validation.issues) && r3Validation.issues.length === 0,
  'R1_REUSE_CURRENT_R3_VALIDATION_NOT_PASS');
  assert(r3Evidence.stage === 'R3' && r3Evidence.examUid === examUid && r3Evidence.artifactSha === currentBlob
    && r3Evidence.artifactDispositions?.artifactSha === currentBlob, 'R1_REUSE_CURRENT_R3_ARTIFACT_BINDING_MISMATCH');
  const dispositions = r3Evidence.artifactDispositions?.rows;
  assert(Array.isArray(dispositions) && dispositions.length === bank.length, 'R1_REUSE_CURRENT_META_DISPOSITION_DENOMINATOR');
  const dispositionQids = dispositions.map(row => Number(row.qid)).sort((a, b) => a - b);
  assert(JSON.stringify(dispositionQids) === JSON.stringify(bank.map((_, index) => index + 1)), 'R1_REUSE_CURRENT_META_DISPOSITION_QID_SET');
  assert(dispositions.every(row => ['PASS', 'PASS_AFTER_RECHECK'].includes(row.metaDisposition) && row.artifactSha === currentBlob), 'R1_REUSE_CURRENT_META_DISPOSITION_NOT_PASS');
  assert(r3Adjudication.stage === 'R3' && r3Adjudication.examUid === examUid && r3Adjudication.finalArtifactSha === currentBlob,
    'R1_REUSE_R3_ADJUDICATION_BINDING_MISMATCH');
  const metadataFieldPattern = /^(?:meta|metaStatus|metaAudit|standardCourse|standardUnitKey|standardUnit|subUnitKey|subUnit|problemTypeKey|templateKey|difficultyBucket|difficultyConfidence|crossConceptKeys|conditionKeys|integrationPattern)$/i;
  assert(Array.isArray(r3Adjudication.changedFields) && r3Adjudication.changedFields.every(change => !metadataFieldPattern.test(String(change.field || ''))), 'R1_REUSE_R3_CHANGED_META_FIELD');
  assert(assessment.assessment === 'REUSE_ELIGIBLE_EXISTING_MAIN_DONE'
    && assessment.validatorDisposition?.disposition === 'PASS_REUSED'
    && Array.isArray(assessment.validatorDisposition?.issues) && assessment.validatorDisposition.issues.length === 0,
  'R1_REUSE_ASSESSMENT_NOT_ELIGIBLE');
  assert(assessment.currentArtifact?.rawSha256 === assignment.artifactRawSha256
    && assessment.currentArtifact?.gitBlobSha1 === currentBlob
    && assessment.r3Validation?.ok === true && assessment.r3Validation?.artifactSha === currentBlob && assessment.r3Validation?.questionCount === bank.length
    && assessment.mainDone?.status === 'MAIN_DONE' && assessment.mainDone?.artifactSha === currentBlob,
  'R1_REUSE_ASSESSMENT_CURRENT_BINDING_MISMATCH');
  assert(done.executionLine === 'CODEX' && done.qualityContractVersion === QUALITY_CONTRACT_V2 && done.status === 'MAIN_DONE'
    && done.artifactSha === currentBlob && done.productionPath === productionPath
    && originalMainDone.status === 'MAIN_DONE' && originalMainDone.artifactSha === currentBlob,
  'R1_REUSE_MAIN_DONE_RECEIPT_INVALID');
  assert(mainDoneIntake.ok === true && mainDoneIntake.disposition === 'PASS' && Array.isArray(mainDoneIntake.issues) && mainDoneIntake.issues.length === 0,
    'R1_REUSE_MAIN_DONE_INTAKE_NOT_PASS');
  const renderQids = bank.map((_, index) => index + 1);
  const renderResult = validateCodexRenderReceipt({ receipt: renderReceipt, root: rootReal, artifactSha: currentBlob, assets: renderReceipt.assets, qids: renderQids });
  assert(renderResult.ok && renderResult.disposition === 'PASS', 'R1_REUSE_CURRENT_RENDER_VALIDATION_FAILED', renderResult.issues.join(','));

  return {
    relative: historicalR1.relative,
    evidenceSha256: historicalEvidenceSha256,
    evidenceCleanLfSha256: historicalEvidenceCleanLfSha256,
    evidence: r1,
    validationRelative: historicalR1Validation.relative,
    validationSha256: sha256(historicalR1Validation.bytes),
    validation: r1Validation,
    reuse: {
      manifestPath: manifestFile.relative, manifestSha256,
      assessmentPath: reuseAssessment.relative, assessmentSha256: sha256(reuseAssessment.bytes),
      currentR3EvidencePath: currentR3Evidence.relative, currentR3EvidenceSha256: sha256(currentR3Evidence.bytes),
      currentR3ValidationPath: currentR3Validation.relative, currentR3ValidationSha256: sha256(currentR3Validation.bytes),
      mainDonePath: mainDone.relative, mainDoneSha256: sha256(mainDone.bytes),
      mainDoneIntakePath: intakeFile.relative, mainDoneIntakeSha256: sha256(intakeFile.bytes),
      renderReceiptPath: renderFile.relative, renderReceiptSha256: renderSha256, renderDisposition: renderResult.disposition,
      metaSemanticsUnchangedConfirmed: true, currentMetaDispositionCount: dispositions.length,
    },
  };
}

function runStep({ name, command, args, cwd, env, logsDir }) {
  let stdout = Buffer.alloc(0), stderr = Buffer.alloc(0), exitCode = 0;
  try {
    stdout = execFileSync(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 128 * 1024 * 1024 });
  } catch (error) {
    stdout = Buffer.from(error.stdout || '');
    stderr = Buffer.from(error.stderr || '');
    exitCode = Number.isInteger(error.status) ? error.status : 1;
  }
  const stdoutPath = path.join(logsDir, `${name}.stdout.bin`);
  const stderrPath = path.join(logsDir, `${name}.stderr.bin`);
  fs.writeFileSync(stdoutPath, stdout);
  fs.writeFileSync(stderrPath, stderr);
  return { command, args, cwd, exitCode, stdoutPath, stdoutSha256: sha256(stdout), stdoutBytes: stdout.length, stderrPath, stderrSha256: sha256(stderr), stderrBytes: stderr.length };
}

async function main() {
  const args = parseArgs(process.argv);
  const root = fs.realpathSync(path.resolve(args.root));
  const safe = relative => {
    const target = path.resolve(root, relative);
    assert(isWithin(root, target), 'PATH_OUTSIDE_ROOT', relative);
    return target;
  };
  const authorityPath = safe(args.authority), rosterPath = safe(args.roster), assignmentPath = safe(args.assignment);
  const candidateRoot = fs.realpathSync(path.resolve(args['candidate-root']));
  const evidenceRoot = path.resolve(root, args['evidence-root']);
  const packagePath = safe(args['package-output']);
  assert(isWithin(root, candidateRoot) && isWithin(root, evidenceRoot), 'PRODUCER_PATH_OUTSIDE_WORKTREE');
  fs.mkdirSync(evidenceRoot, { recursive: true });
  const authorityBytes = fs.readFileSync(authorityPath), rosterBytes = fs.readFileSync(rosterPath), assignmentBytes = fs.readFileSync(assignmentPath);
  const authority = JSON.parse(authorityBytes.toString('utf8'));
  const roster = JSON.parse(rosterBytes.toString('utf8'));
  const assignment = JSON.parse(assignmentBytes.toString('utf8'));
  const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  assert(authority.schemaVersion === 'ROOT_TARGET_REGISTRATION_PRODUCER_AUTHORITY_V1' && authority.decisionAuthority === 'ROOT_DELEGATED', 'ROOT_PRODUCER_AUTHORITY_REQUIRED');
  const standingReference = authority.authorityReference;
  assert(standingReference?.path && standingReference?.sourceRawSha256 && standingReference?.sourceGitBlobSha1, 'ROOT_STANDING_AUTHORITY_BINDING_REQUIRED');
  const standingBytes = fs.readFileSync(safe(standingReference.path));
  assert(sha256(standingBytes) === standingReference.sourceRawSha256 && sha256(standingBytes) === standingReference.sha256, 'ROOT_STANDING_AUTHORITY_RAW_SHA_MISMATCH');
  assert(gitBlobSha(standingBytes) === standingReference.sourceGitBlobSha1, 'ROOT_STANDING_AUTHORITY_GIT_BLOB_SHA_MISMATCH');
  assert(authority.runId === roster.runId && authority.runId === assignment.runId && roster.schemaVersion === 'JS_ARCHIVE_CODEX_LOCKED_ROSTER_V1', 'LOCKED_ROSTER_RUN_ID_MISMATCH');
  assert(sha256(rosterBytes) === authority.roster.sha256, 'LOCKED_ROSTER_SHA_MISMATCH');
  assert(assignment.lockedRosterSha256 === sha256(rosterBytes), 'ASSIGNMENT_ROSTER_SHA_MISMATCH');
  assert(assignment.producerAuthorityPath === args.authority && assignment.producerAuthoritySha256 === sha256(authorityBytes), 'ASSIGNMENT_AUTHORITY_SHA_MISMATCH');
  assert(assignment.expectedHead === head, 'CURRENT_HEAD_MISMATCH');
  assert(execFileSync('git', ['-C', candidateRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() === head, 'CANDIDATE_ROOT_HEAD_MISMATCH');
  const candidateStatusZ = execFileSync('git', ['-C', candidateRoot, 'status', '--porcelain', '-z'], { encoding: 'utf8' });
  const candidateStatusCount = assertCandidateStatusIsRegistryOnly(candidateStatusZ);
  const mainRootBaselineHashes = Object.fromEntries(REGISTRATION_BASELINE_FILES.map(file => [file, sha256(fs.readFileSync(safe(file)))]));
  const candidateRootBaselineHashes = Object.fromEntries(REGISTRATION_BASELINE_FILES.map(file => [file, sha256(fs.readFileSync(path.join(candidateRoot, file)))]));
  assert(JSON.stringify(mainRootBaselineHashes) === JSON.stringify(candidateRootBaselineHashes), 'CANDIDATE_ROOT_REGISTRY_BASELINE_MISMATCH');
  const rosterIndex = args['roster-index'];
  const authorizedRow = authority.scope[rosterIndex], rosterRow = roster.rows[rosterIndex];
  assert(authorizedRow && rosterRow && authorizedRow.examUid === rosterRow.examUid && authorizedRow.productionPath === rosterRow.productionPath, 'AUTHORIZED_ROSTER_ROW_MISMATCH');
  assert(assignment.examUid === authorizedRow.examUid && assignment.productionRelativePath === authorizedRow.productionPath, 'ASSIGNMENT_AUTHORITY_ROW_MISMATCH');
  const targetFile = core.normalizeFile(authorizedRow.productionPath.replace(/^archive\/exams\//, ''));
  assert(/^archive\/exams\/original\/high\/(h1|h2)\//.test(assignment.productionRelativePath), 'TARGET_PRODUCTION_PATH_REQUIRED');
  const assignmentAbs = safe(assignment.productionRelativePath);
  const sourceBytes = fs.readFileSync(assignmentAbs);
  const sourceRawSha256 = sha256(sourceBytes), sourceBlobSha1 = gitBlobSha(sourceBytes);
  assert(sourceRawSha256 === assignment.artifactRawSha256 && sourceBlobSha1 === assignment.validatorRawBufferBlobSha1, 'TARGET_SOURCE_HASH_BINDING_MISMATCH');
  const sourceStatus = execFileSync('git', ['-C', root, 'status', '--short', '--', assignment.productionRelativePath], { encoding: 'utf8' }).trim();
  assert(!sourceStatus, 'TARGET_SOURCE_DIRTY');
  const registeredGrade = ({ h1: '고1', h2: '고2' })[authorizedRow.grade];
  assert(registeredGrade, 'ROSTER_GRADE_UNSUPPORTED', String(authorizedRow.grade));
  const registered = core.Canonical.resolveSourceGrade({ registeredGrade, sourceFile: targetFile, identitySourceFile: targetFile });
  assert(registered.status === 'VALID' && registered.grade === registeredGrade, 'ROSTER_GRADE_SOURCE_PARITY_FAIL');
  const sourceContext = runVmSource(assignmentAbs);
  const bank = sourceContext.bank;
  if (assignment.questionCount !== undefined) assert(Number(assignment.questionCount) === bank.length, 'ASSIGNMENT_QCOUNT_MISMATCH');
  assert(Number(rosterRow.questionCount) === bank.length, 'LOCKED_ROSTER_QCOUNT_MISMATCH');

  const r1EvidenceBinding = args['r1-reuse-manifest']
    ? verifyR1ReuseBinding({ root, manifestPath: args['r1-reuse-manifest'], assignment, examUid: authorizedRow.examUid, rosterIndex, productionPath: authorizedRow.productionPath, bank })
    : verifyR1EvidenceBinding({ root, evidencePath: args['r1-evidence'], validationPath: args['r1-validation'], assignment, examUid: authorizedRow.examUid, bank });
  const r1EvidenceRelative = r1EvidenceBinding.relative;
  const r1Evidence = r1EvidenceBinding.evidence;
  const sourceFingerprintByOrdinal = bank.map(question => canonicalSourceFingerprint(question));
  const contentFingerprintByOrdinal = bank.map(question => canonicalContentFingerprint(question));
  const identityRows = makeTargetIdentityRows(targetFile, bank);
  const identityBase = readJson(path.join(candidateRoot, 'archive/data/question_identity_map.json'));
  const metadataBase = readJson(path.join(candidateRoot, 'archive/data/question_metadata.json'));
  const existingDbBytes = fs.readFileSync(path.join(candidateRoot, 'archive/db.js'));
  const existingDbWindow = { window: {} };
  vm.runInNewContext(existingDbBytes.toString('utf8'), existingDbWindow, { timeout: 3000 });
  const candidateBaseIndexWindow = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(candidateRoot, 'archive/question-index.js'), 'utf8'), candidateBaseIndexWindow, { timeout: 3000 });
  const baseCatalog = core.decodeCatalog(readJson(path.join(candidateRoot, 'archive/data/archive2-catalog.json')));
  assert(!existingDbWindow.window.mainDB.exams.some(row => core.normalizeFile(row.file) === targetFile), 'TARGET_DB_ALREADY_PRESENT');
  assert(!identityBase.records.some(row => row.sourceArchiveFile === targetFile), 'TARGET_IDENTITY_ALREADY_PRESENT');
  assert(!metadataBase.records.some(row => row.sourceArchiveFile === targetFile), 'TARGET_METADATA_ALREADY_PRESENT');
  assert(!(candidateBaseIndexWindow.window.questionIndex || []).some(row => core.normalizeFile(row.sourceFile) === targetFile), 'TARGET_INDEX_ALREADY_PRESENT');
  assert(!baseCatalog.records.some(row => core.normalizeFile(row.sourceFile) === targetFile), 'TARGET_CATALOG_ALREADY_PRESENT');
  const idUids = new Set(identityBase.records.map(row => row.questionUid));
  const legacyQKeys = new Set(identityBase.records.map(row => row.legacyQKey));
  for (const row of identityRows) {
    assert(!idUids.has(row.questionUid), 'TARGET_UID_COLLISION', row.questionUid);
    assert(!legacyQKeys.has(row.legacyQKey), 'TARGET_LEGACY_QKEY_COLLISION', row.legacyQKey);
  }

  const display = parseAuthorizedDisplayIdentity({ examUid: authorizedRow.examUid, productionRelativePath: authorizedRow.productionPath, grade: authorizedRow.grade, course: authorizedRow.course });
  const targetDbRow = buildAuthorizedDbRow({ examUid: authorizedRow.examUid, productionRelativePath: authorizedRow.productionPath, grade: authorizedRow.grade, course: authorizedRow.course, bank });
  const targetMetadataRows = makeTargetMetadataRows({ sourceFile: targetFile, bank, identityRows, r1EvidencePath: r1EvidenceRelative });
  assert(targetMetadataRows.every((row, index) => row.questionUid === identityRows[index].questionUid && row.sourceFingerprint === sourceFingerprintByOrdinal[index] && row.contentFingerprint === contentFingerprintByOrdinal[index]), 'TARGET_METADATA_FINGERPRINT_PARITY_FAIL');

  const beforeCandidateHashes = Object.fromEntries(REGISTRATION_BASELINE_FILES.map(file => [file, sha256(fs.readFileSync(path.join(candidateRoot, file)))]));
  const identityNext = mergeIdentityMap(identityBase, identityRows, head);
  const identityText = JSON.stringify(identityNext, null, 2) + '\n';
  const metadataNext = mergeMetadata(metadataBase, targetMetadataRows, identityText);
  const metadataText = JSON.stringify(metadataNext, null, 2) + '\n';
  const dbText = appendDbExamRow(existingDbBytes, targetDbRow);
  fs.writeFileSync(path.join(candidateRoot, 'archive/db.js'), dbText);
  fs.writeFileSync(path.join(candidateRoot, 'archive/data/question_identity_map.json'), identityText);
  fs.writeFileSync(path.join(candidateRoot, 'archive/data/question_metadata.json'), metadataText);

  const runRoot = path.join(root, '.tmp/archive', authority.runId, authorizedRow.examUid);
  const indexRoot = args['index-root'] ? path.resolve(root, args['index-root']) : path.join(runRoot, 'registration-index-root');
  assert(isWithin(root, indexRoot), 'INDEX_ROOT_OUTSIDE_TEMP_WORKSPACE');
  assert(!fs.existsSync(indexRoot), 'FRESH_INDEX_ROOT_REQUIRED');
  const indexArchiveRoot = path.join(indexRoot, 'archive');
  const indexSourcePath = path.join(indexArchiveRoot, 'exams', ...targetFile.split('/'));
  fs.mkdirSync(path.dirname(indexSourcePath), { recursive: true });
  fs.mkdirSync(path.join(indexArchiveRoot, 'tools'), { recursive: true });
  fs.copyFileSync(assignmentAbs, indexSourcePath);
  fs.copyFileSync(path.join(candidateRoot, 'archive/tools/build-question-index.mjs'), path.join(indexArchiveRoot, 'tools/build-question-index.mjs'));
  fs.writeFileSync(path.join(indexArchiveRoot, 'db.js'), 'window.mainDB = ' + JSON.stringify({ exams: [targetDbRow] }, null, 2) + ';\n', 'utf8');
  const steps = [];
  const stepPrefix = `target-index-${rosterIndex}`;
  const indexEnvironment = { ...process.env, GEOMETRY_ARCHIVE_ROOT: indexArchiveRoot, GEOMETRY_REPO_ROOT: indexRoot };
  const indexScript = path.join(indexArchiveRoot, 'tools/build-question-index.mjs');
   const indexStep = runStep({ name: `${stepPrefix}-canonical-question-index`, command: process.execPath, args: [indexScript], cwd: indexRoot, env: indexEnvironment, logsDir: evidenceRoot });
  steps.push(indexStep);
  assert(indexStep.exitCode === 0, 'TARGET_INDEX_GENERATOR_FAILED', String(indexStep.exitCode));
  const indexWindow = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(indexArchiveRoot, 'question-index.js'), 'utf8'), indexWindow, { timeout: 3000 });
  const targetIndexRows = indexWindow.window.questionIndex;
  assert(Array.isArray(targetIndexRows) && targetIndexRows.length === bank.length, 'TARGET_INDEX_DENOMINATOR_MISMATCH');
  assert(targetIndexRows.every((row, index) => core.normalizeFile(row.sourceFile) === targetFile && Number(row.sourceOrdinal) === index + 1), 'TARGET_INDEX_SOURCE_ORDINAL_MISMATCH');
  fs.writeFileSync(path.join(candidateRoot, 'archive/question-index.js'), fs.readFileSync(path.join(indexArchiveRoot, 'question-index.js')));

  const catalogStep = runStep({ name: `${stepPrefix}-canonical-archive2-catalog`, command: process.execPath, args: [path.join(candidateRoot, 'archive/tools/build-archive2-catalog.mjs')], cwd: candidateRoot, env: process.env, logsDir: evidenceRoot });
  steps.push(catalogStep);
  assert(catalogStep.exitCode === 0, 'TARGET_CATALOG_GENERATOR_FAILED', String(catalogStep.exitCode));
  const catalogCandidatePath = path.join(candidateRoot, 'archive/data/archive2-catalog.json');
  const targetCatalog = core.decodeCatalog(readJson(catalogCandidatePath));
  const targetCatalogRows = targetCatalog.records.filter(row => core.normalizeFile(row.sourceFile) === targetFile);
  assert(targetCatalogRows.length === bank.length && targetCatalogRows.every(row => row.identityStatus === 'VERIFIED' && row.sourceStatus === 'VERIFIED'), 'TARGET_CATALOG_SOURCE_PARITY_FAIL');

  const packageOutput = safe(args['package-output']);
  assert(!fs.existsSync(packageOutput), 'FRESH_TARGET_PACKAGE_REQUIRED');
  const prepareStep = runStep({
    name: `${stepPrefix}-prepare-target-registration`, command: process.execPath,
    args: [path.join(root, 'archive/tools/prepare-target-registration.mjs'), '--root', root, '--assignment', args.assignment, '--candidate-root', candidateRoot, '--output', args['package-output']],
    cwd: root, env: process.env, logsDir: evidenceRoot,
  });
  steps.push(prepareStep);
  assert(prepareStep.exitCode === 0 && fs.existsSync(packageOutput), 'TARGET_REGISTRATION_PACKAGE_PREPARATION_FAILED', String(prepareStep.exitCode));
  const packageSha256 = sha256(fs.readFileSync(packageOutput));
  const registerStep = runStep({
    name: `${stepPrefix}-register-target-default-dry-run`, command: process.execPath,
    args: [path.join(root, 'archive/tools/register-target-exam.mjs'), '--root', root, '--assignment', args.assignment, '--proposal', args['package-output'], '--catalog-candidate', catalogCandidatePath, '--evidence-root', args['evidence-root']],
    cwd: root, env: process.env, logsDir: evidenceRoot,
  });
  steps.push(registerStep);
  assert(registerStep.exitCode === 0, 'TARGET_REGISTRATION_DRY_RUN_FAILED', String(registerStep.exitCode));
  const dryRunReceiptPath = path.join(evidenceRoot, 'target-registration.receipt.json');
  const dryRunReceipt = readJson(dryRunReceiptPath);
  assert(dryRunReceipt.status === 'PLAN_VALIDATED_NOT_APPLIED', 'TARGET_REGISTRATION_DRY_RUN_STATUS_INVALID', dryRunReceipt.status);
  assert(dryRunReceipt.targetCounts?.identity === bank.length && dryRunReceipt.targetCounts?.metadata === bank.length && dryRunReceipt.targetCounts?.index === bank.length && dryRunReceipt.targetCounts?.catalog === bank.length && dryRunReceipt.targetCounts?.db === 1, 'TARGET_REGISTRATION_DRY_RUN_DENOMINATOR_INVALID');
  assert(!process.argv.includes('--apply'), 'PRODUCER_APPLY_FORBIDDEN');

  const rootAfter = Object.fromEntries(REGISTRATION_BASELINE_FILES.map(file => [file, sha256(fs.readFileSync(safe(file)))]));
  assert(JSON.stringify(mainRootBaselineHashes) === JSON.stringify(rootAfter), 'MAIN_ROOT_REGISTRY_MUTATION_DETECTED');
  const receipt = {
    schemaVersion: PRODUCER_SCHEMA,
    status: 'PLAN_VALIDATED_NOT_APPLIED',
    runId: authority.runId,
    rosterIndex,
    examUid: authorizedRow.examUid,
    head,
    authority: { path: args.authority, sha256: sha256(authorityBytes), decisionAuthority: authority.decisionAuthority, authorityReference: authority.authorityReference },
    roster: { path: args.roster, sha256: sha256(rosterBytes), rosterIndex, examUid: rosterRow.examUid, productionPath: rosterRow.productionPath, grade: rosterRow.grade, course: rosterRow.course },
    assignment: { path: args.assignment, sha256: sha256(assignmentBytes), currentProductionRawSha256: sourceRawSha256, currentProductionRawBufferBlobSha1: sourceBlobSha1 },
    r1MetaProof: { path: r1EvidenceRelative, rawSha256: r1EvidenceBinding.evidenceSha256, cleanLfSha256: r1EvidenceBinding.evidenceCleanLfSha256, validatorPath: r1EvidenceBinding.validationRelative, validatorRawSha256: r1EvidenceBinding.validationSha256, validatorMode: r1EvidenceBinding.validation.validatorMode, validatorDisposition: r1EvidenceBinding.validation.disposition, artifactSha: r1Evidence.artifactSha, artifactRawSha256: r1Evidence.artifactRawSha256, artifactRawBufferBlobSha1: r1Evidence.artifactRawBufferBlobSha1, qidCount: r1Evidence.rows.length, allMetaAxesPass: true },
    ...(r1EvidenceBinding.reuse ? { r1ReuseProof: r1EvidenceBinding.reuse } : {}),
    sourceQuestionCount: bank.length,
    displayIdentity: display.displayAlias,
    dbRow: targetDbRow,
    targetRows: { identity: identityRows.length, metadata: targetMetadataRows.length, questionIndex: targetIndexRows.length, catalog: targetCatalogRows.length },
    candidateRoot: { path: candidateRoot, head: execFileSync('git', ['-C', candidateRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), allowedPreexistingRegistryChangeCount: candidateStatusCount, baselineHashesBefore: beforeCandidateHashes, generatedCatalogSha256: sha256(fs.readFileSync(catalogCandidatePath)), generatedCatalogIndexVersion: targetCatalog.indexVersion, generatedCatalogProjectionVersion: targetCatalog.projectionVersion },
    package: { path: args['package-output'], sha256: packageSha256, schemaVersion: readJson(packageOutput).schemaVersion },
    defaultDryRunReceipt: { path: path.join(args['evidence-root'], 'target-registration.receipt.json'), sha256: sha256(fs.readFileSync(dryRunReceiptPath)), schemaVersion: dryRunReceipt.schemaVersion, status: dryRunReceipt.status, targetCounts: dryRunReceipt.targetCounts, nonTargetInvariant: dryRunReceipt.nonTargetInvariant },
    steps,
    noApply: true,
    noMainRegistryWrites: JSON.stringify(mainRootBaselineHashes) === JSON.stringify(rootAfter),
    previousFailureAttemptsPreserved: true,
  };
  const receiptPath = safe(args['evidence-root'] + '/target-registration-producer.receipt.json');
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ status: receipt.status, examUid: receipt.examUid, sourceQuestionCount: bank.length, targetRows: receipt.targetRows, packagePath: receipt.package.path, packageSha256, dryRunReceiptPath: receipt.defaultDryRunReceipt.path, dryRunStatus: receipt.defaultDryRunReceipt.status, receiptPath: args['evidence-root'] + '/target-registration-producer.receipt.json' }, null, 2));
}

const direct = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (direct) main().catch(error => { console.error(String(error?.stack || error)); process.exitCode = 1; });
