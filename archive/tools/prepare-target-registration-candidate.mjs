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
const LEGACY_DISPLAY_ALIAS_SCHEMA = 'ROOT_TARGET_REGISTRATION_LEGACY_DISPLAY_ALIAS_ADMISSION_V1';
const LEGACY_DISPLAY_ALIAS_EXPECTED = Object.freeze({
  examUid: '24_강남여고_1학기_중간_고2_대수',
  productionPath: 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_대수.js',
  grade: 'h2',
  course: 'H15-M1',
  questionCount: 25,
  sourceField: 'standardCourse',
  sourceFieldValue: '수학I',
  sourceCurriculumFamily: 'H15-M1',
  legacyUidSuffix: '대수',
  displaySubject: '수학I',
});
const META_BINDING_PENDING_ADMISSION_SCHEMA = 'ROOT_TARGET_REGISTRATION_META_BINDING_PENDING_ADMISSION_V1';
const META_BINDING_PENDING_FIELD_NAMES = Object.freeze(['problemTypeKey', 'templateKey']);
const META_BINDING_PENDING_DISPOSITION = 'PRESERVE_CURRENT_VALUES_AS_MANUAL_REVIEW_PENDING';
const META_BINDING_PENDING_SCOPES = Object.freeze({
  '24_강남여고_1학기_중간_고2_대수': Object.freeze({
    sourceRawSha256: '7682d45aa112f60403a32f1333def73d8598dfc12715a17a3726b708d40c469f',
    sourceGitBlobSha1: '829ee06ee6275c5106db0cd5286e0f2db42f8a01',
    questionCount: 25,
    qids: Object.freeze([9, 17, 18, 19, 20, 21, 24]),
    axisStatus: 'PASS_WITH_BINDING_PENDING',
    metaField: null,
    projectionStatus: 'BINDING_PENDING',
  }),
  '23_매산여고_1학기_중간_고2_수학I': Object.freeze({
    sourceRawSha256: '339ef62e6a0e163f70a37251d1419c39469c0bf9e8a138242b3fc04448451eb9',
    sourceGitBlobSha1: 'c6d691872f370d518f64d309b7bf27707cbffbc0',
    questionCount: 23,
    qids: Object.freeze([16]),
    axisStatus: 'CURRENT_FIELDS_REVIEWED',
    metaField: 'currentFields',
    projectionStatus: 'BINDING_PENDING',
  }),
  '23_순천여고_1학기_중간_고2_수학I': Object.freeze({
    sourceRawSha256: '9b0aff68d0d57ad182d0198bd9b5247fb42e8cd5e902954929402fcc9e299757',
    sourceGitBlobSha1: 'ec2da748583fdf29443495c6a9b05fc3319c733c',
    questionCount: 23,
    qids: Object.freeze([7, 13, 16, 19, 20, 22, 23]),
    axisStatusesByQid: Object.freeze({
      7: 'REVIEWED_WITH_EXISTING_PROJECTION_STATUS',
      13: 'REVIEWED_WITH_EXISTING_PROJECTION_STATUS',
      16: 'REVIEWED_WITH_EXISTING_PROJECTION_STATUS',
      19: 'REVIEWED_WITH_EXISTING_PROJECTION_STATUS',
      20: 'REVIEWED_BINDING_PENDING',
      22: 'REVIEWED_WITH_EXISTING_PROJECTION_STATUS',
      23: 'REVIEWED_CURRENT_META_DISPOSITION',
    }),
    metaField: 'currentMeta',
    projectionStatus: 'PROJECTION_BINDING_PENDING',
  }),
});
const verifiedLegacyDisplayAliasTokens = new WeakSet();

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

function runVmSourceBytes(sourceBytes, filename) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(Buffer.from(sourceBytes).toString('utf8'), context, { filename, timeout: 5000 });
  const bank = context.window.questionBank || context.window.questions || context.questionBank || context.questions;
  assert(Array.isArray(bank) && bank.length > 0, 'SOURCE_PROOF_BANK_REQUIRED', filename);
  return bank.map(question => jsonClone(question));
}

export function parseAuthorizedDisplayIdentity({ examUid, productionRelativePath, grade, course, verifiedLegacyDisplayAlias = null }) {
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
  let subject = uidSubject || (rosterGrade === 'h1' ? courseCode : '');
  const acceptedSubjects = courseCode === 'math2'
    ? new Set(['수학II', '수학Ⅱ'])
    : courseCode === 'geometry'
      ? new Set(['기하', '기하와벡터', '기하와 벡터'])
      : rosterGrade === 'h2' && courseCode === 'H15-M1'
        ? new Set(['수학I'])
      : rosterGrade === 'h2' && courseCode === 'H15-PS'
        ? new Set(['확률과통계'])
      : rosterGrade === 'h1' && courseCode === '수학(상)'
        ? new Set(['수학(상)'])
        : new Set();
  if (!acceptedSubjects.has(subject)) {
    const token = verifiedLegacyDisplayAlias;
    assert(token && verifiedLegacyDisplayAliasTokens.has(token)
      && token.examUid === examUid
      && token.productionPath === productionRelativePath
      && token.grade === rosterGrade
      && token.course === courseCode
      && token.legacyUidSuffix === uidSubject
      && token.displaySubject === '수학I', 'ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH', `${courseCode}|${subject}`);
    subject = token.displaySubject;
  }
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

export function buildAuthorizedDbRow({ examUid, productionRelativePath, grade, course, bank, verifiedLegacyDisplayAlias = null }) {
  assert(Array.isArray(bank) && bank.length > 0, 'SOURCE_VM_BANK_REQUIRED');
  const { sourceFile, displayAlias } = parseAuthorizedDisplayIdentity({ examUid, productionRelativePath, grade, course, verifiedLegacyDisplayAlias });
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

export function verifyBoundLegacyDisplayAliasAdmission({
  root, authorityAdmission, rosterAdmission, authorizedRow, rosterRow, assignment, examUid, productionRelativePath, grade, course, sourceBytes, bank,
}) {
  const keys = ['schemaVersion', 'examUid', 'productionPath', 'grade', 'course', 'questionCount', 'sourceRawSha256', 'sourceGitBlobSha1', 'sourceField', 'sourceFieldValue', 'sourceCurriculumFamily', 'legacyUidSuffix', 'displaySubject', 'attestation'];
  const exactKeys = value => value && typeof value === 'object' && !Array.isArray(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());
  assert(exactKeys(authorityAdmission) && exactKeys(rosterAdmission), 'ROOT_LEGACY_DISPLAY_ALIAS_ADMISSION_SCHEMA_REQUIRED');
  for (const key of keys) {
    if (key === 'attestation') continue;
    assert(authorityAdmission[key] === rosterAdmission[key], 'ROOT_LEGACY_DISPLAY_ALIAS_SCOPE_ROW_MISMATCH', key);
  }
  assert(authorityAdmission.attestation?.path === rosterAdmission.attestation?.path
    && authorityAdmission.attestation?.sha256 === rosterAdmission.attestation?.sha256,
  'ROOT_LEGACY_DISPLAY_ALIAS_ATTESTATION_REF_MISMATCH');
  const admission = authorityAdmission;
  assert(admission.schemaVersion === LEGACY_DISPLAY_ALIAS_SCHEMA, 'ROOT_LEGACY_DISPLAY_ALIAS_SCHEMA_INVALID');
  for (const [key, expected] of Object.entries(LEGACY_DISPLAY_ALIAS_EXPECTED)) {
    assert(admission[key] === expected, 'ROOT_LEGACY_DISPLAY_ALIAS_SCOPE_INVALID', key);
  }
  assert(examUid === admission.examUid && productionRelativePath === admission.productionPath
    && String(grade).toLowerCase() === admission.grade && course === admission.course,
  'ROOT_LEGACY_DISPLAY_ALIAS_TARGET_BINDING_MISMATCH');
  for (const [row, code] of [[authorizedRow, 'ROOT_LEGACY_DISPLAY_ALIAS_AUTHORITY_ROW'], [rosterRow, 'ROOT_LEGACY_DISPLAY_ALIAS_ROSTER_ROW']]) {
    assert(row?.examUid === admission.examUid && row?.productionPath === admission.productionPath
      && row?.grade === admission.grade && row?.course === admission.course
      && Number(row?.questionCount) === admission.questionCount,
    `${code}_SCOPE_MISMATCH`);
    const rowAdmission = row.legacyDisplayAliasAdmission;
    assert(exactKeys(rowAdmission) && rowAdmission.schemaVersion === admission.schemaVersion
      && rowAdmission.examUid === admission.examUid && rowAdmission.productionPath === admission.productionPath
      && rowAdmission.grade === admission.grade && rowAdmission.course === admission.course
      && rowAdmission.questionCount === admission.questionCount && rowAdmission.sourceRawSha256 === admission.sourceRawSha256
      && rowAdmission.sourceGitBlobSha1 === admission.sourceGitBlobSha1 && rowAdmission.sourceField === admission.sourceField
      && rowAdmission.sourceFieldValue === admission.sourceFieldValue && rowAdmission.sourceCurriculumFamily === admission.sourceCurriculumFamily
      && rowAdmission.legacyUidSuffix === admission.legacyUidSuffix && rowAdmission.displaySubject === admission.displaySubject
      && rowAdmission.attestation?.path === admission.attestation.path && rowAdmission.attestation?.sha256 === admission.attestation.sha256,
    `${code}_ADMISSION_BINDING_MISMATCH`);
  }
  assert(assignment?.examUid === admission.examUid
    && assignment?.productionRelativePath === admission.productionPath
    && assignment?.grade === admission.grade
    && assignment?.course === admission.course
    && Number(assignment?.questionCount) === admission.questionCount,
  'ROOT_LEGACY_DISPLAY_ALIAS_ASSIGNMENT_BINDING_MISMATCH');
  assert(Buffer.isBuffer(sourceBytes) && sha256(sourceBytes) === admission.sourceRawSha256
    && assignment.artifactRawSha256 === admission.sourceRawSha256,
  'ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_RAW_SHA_MISMATCH');
  assert(gitBlobSha(sourceBytes) === admission.sourceGitBlobSha1
    && assignment.validatorRawBufferBlobSha1 === admission.sourceGitBlobSha1,
  'ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_BLOB_SHA_MISMATCH');
  assert(Array.isArray(bank) && bank.length === admission.questionCount, 'ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_DENOMINATOR_MISMATCH');
  assert(bank.every(question => question?.standardCourse === admission.sourceFieldValue), 'ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_COURSE_PARITY_FAIL');

  const attestationBytes = readBoundFileBytes(root, admission.attestation, 'R1_LEGACY_DISPLAY_ALIAS_ATTESTATION');
  let attestation;
  try { attestation = JSON.parse(attestationBytes.toString('utf8').replace(/^\uFEFF/, '')); }
  catch { throw new Error('R1_LEGACY_DISPLAY_ALIAS_ATTESTATION_JSON_INVALID'); }
  const scope = attestation.scope;
  assert(attestation.schemaVersion === 'JS_ARCHIVE_R1_BOUNDED_LEGACY_DISPLAY_ALIAS_ATTESTATION_V1'
    && attestation.executionLine === 'CODEX'
    && attestation.qualityContractVersion === QUALITY_CONTRACT_V2
    && attestation.reviewerId === 'r1_10'
    && attestation.examUid === admission.examUid
    && attestation.decision === 'R1_CONFIRMS_H15_MATH_I_DISPLAY_ALIAS_FOR_THIS_TARGET_ONLY',
  'R1_LEGACY_DISPLAY_ALIAS_ATTESTATION_IDENTITY_INVALID');
  assert(scope?.currentSourceRawSha256 === admission.sourceRawSha256
    && scope?.currentSourceBufferBlobSha1 === admission.sourceGitBlobSha1
    && scope?.productionPath === admission.productionPath
    && scope?.questionCount === admission.questionCount
    && scope?.reviewedQids === '1-25'
    && scope?.sourceField === admission.sourceField
    && scope?.sourceFieldValue === admission.sourceFieldValue
    && scope?.sourceCurriculumFamily === admission.sourceCurriculumFamily
    && scope?.legacyUidSuffix === admission.legacyUidSuffix
    && scope?.approvedDisplaySubject === admission.displaySubject
    && scope?.normalizationScope === 'DISPLAY_ALIAS_ONLY_FOR_THIS_EXAMUID_AND_SOURCE_SHA',
  'R1_LEGACY_DISPLAY_ALIAS_ATTESTATION_SCOPE_MISMATCH');
  const actualUnitKeys = [...new Set(bank.map(question => text(question?.standardUnitKey)))].sort();
  const attestedUnitKeys = Array.isArray(scope?.observedStandardUnitKeys) ? [...new Set(scope.observedStandardUnitKeys)].sort() : [];
  assert(actualUnitKeys.length > 0 && actualUnitKeys.every(key => key.startsWith('H15-M1-') && attestedUnitKeys.includes(key))
    && attestedUnitKeys.every(key => key.startsWith('H15-M1-')),
  'R1_LEGACY_DISPLAY_ALIAS_UNIT_SCOPE_MISMATCH');
  assert(attestation.r1Judgment?.sourceOrMetaMutation === false
    && typeof attestation.r1Judgment?.finding === 'string' && attestation.r1Judgment.finding.trim()
    && attestation.allowedConsumerUse?.useDisplayAlias === true
    && attestation.allowedConsumerUse?.displaySubject === admission.displaySubject
    && attestation.allowedConsumerUse?.preserveExamUidExactly === true
    && attestation.allowedConsumerUse?.preserveSourceFileAndProductionPathExactly === true
    && attestation.allowedConsumerUse?.preserveStandardCourseAndEveryMetaFieldExactly === true
    && attestation.allowedConsumerUse?.globalAliasOrSuffixRuleCreated === false,
  'R1_LEGACY_DISPLAY_ALIAS_CONSUMER_SCOPE_INVALID');

  const token = Object.freeze({
    examUid: admission.examUid,
    productionPath: admission.productionPath,
    grade: admission.grade,
    course: admission.course,
    legacyUidSuffix: admission.legacyUidSuffix,
    displaySubject: admission.displaySubject,
  });
  verifiedLegacyDisplayAliasTokens.add(token);
  return token;
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

export function makeTargetMetadataRows({ sourceFile, bank, identityRows, r1EvidencePath, r1MetaDebtRows = [], r1MetaBindingPendingRows = [] }) {
  assert(identityRows.length === bank.length, 'TARGET_METADATA_IDENTITY_DENOMINATOR_MISMATCH');
  const metaDebtByOrdinal = new Map((r1MetaDebtRows || []).map(row => [Number(row.qid), row]));
  const metaBindingPendingByOrdinal = new Map((r1MetaBindingPendingRows || []).map(row => [Number(row.qid), row]));
  return bank.map((question, index) => {
    const identity = identityRows[index];
    assert(identity.sourceOrdinal === index + 1, 'TARGET_METADATA_IDENTITY_ORDINAL_MISMATCH', String(index + 1));
    const admittedDebt = metaDebtByOrdinal.get(index + 1);
    const admittedBindingPending = metaBindingPendingByOrdinal.get(index + 1);
    const nullableProjection = question.subUnitKey === null;
    const fieldStatus = {
      standardUnit: sourceFieldStatus(question, 'standardUnitKey'),
      subUnit: sourceFieldStatus(question, 'subUnitKey', nullableProjection),
      concept: sourceFieldStatus(question, 'conceptClusterKey'),
      problemType: sourceFieldStatus(question, 'problemTypeKey'),
      template: sourceFieldStatus(question, 'templateKey'),
      difficulty: sourceFieldStatus(question, 'difficultyBucket'),
    };
    if (admittedDebt) {
      for (const field of admittedDebt.metaDebtFields || []) {
        if (field === 'problemTypeKey') fieldStatus.problemType = 'manual_review_pending';
        if (field === 'templateKey') fieldStatus.template = 'manual_review_pending';
      }
    }
    if (admittedBindingPending) {
      for (const field of admittedBindingPending.fieldNames || []) {
        if (field === 'problemTypeKey') fieldStatus.problemType = 'manual_review_pending';
        if (field === 'templateKey') fieldStatus.template = 'manual_review_pending';
      }
    }
    const hasExplicitHolds = Object.values(fieldStatus).some(value => value === 'manual_review_pending');
    const serializedFieldStatus = hasOwn(question, 'fieldStatus') && question.fieldStatus && typeof question.fieldStatus === 'object'
      ? jsonClone(question.fieldStatus)
      : fieldStatus;
    if (admittedDebt) {
      for (const field of admittedDebt.metaDebtFields || []) {
        if (field === 'problemTypeKey') serializedFieldStatus.problemType = 'manual_review_pending';
        if (field === 'templateKey') serializedFieldStatus.template = 'manual_review_pending';
      }
    }
    if (admittedBindingPending) {
      for (const field of admittedBindingPending.fieldNames || []) {
        if (field === 'problemTypeKey') serializedFieldStatus.problemType = 'manual_review_pending';
        if (field === 'templateKey') serializedFieldStatus.template = 'manual_review_pending';
      }
    }
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
      ...(admittedDebt ? {
        projectionStatus: admittedDebt.projectionStatus,
        metaDebtFields: jsonClone(admittedDebt.metaDebtFields),
        metaDebtReason: admittedDebt.metaDebtReason,
      } : {}),
      crossConceptKeys: sourceValue(question, 'crossConceptKeys', []),
      conditionKeys: sourceValue(question, 'conditionKeys', []),
      integrationPattern: sourceValue(question, 'integrationPattern', ''),
      tagConfidence: sourceValue(question, 'tagConfidence', sourceValue(question, 'subUnitConfidence')),
      tagStatus: sourceValue(question, 'tagStatus'),
      metadataStatus: admittedDebt
        ? 'approved_partial_with_explicit_holds'
        : (nonempty(question.metadataStatus) ? question.metadataStatus : (hasExplicitHolds ? 'approved_partial_with_explicit_holds' : 'approved_source')),
      fieldStatus: serializedFieldStatus,
      metadataRevision: sourceValue(question, 'metadataRevision', 'archive-registration-target-source-projection-v1'),
      approvalEvidence: [...new Set([...(Array.isArray(question.approvalEvidence) ? question.approvalEvidence.filter(nonempty) : []), r1EvidencePath])],
    };
    for (const optional of ['subUnitConfidence', 'subUnitClassificationDepth', 'conceptClusterKey', 'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable', 'reviewStatus']) {
      if (hasOwn(question, optional)) row[optional] = jsonClone(question[optional]);
    }
    return row;
  });
}

export function serializeR1MetaProofSummary(binding, evidence) {
  const metaDebtRows = binding?.metaDebtRows || [];
  return {
    path: binding.relative,
    rawSha256: binding.evidenceSha256,
    cleanLfSha256: binding.evidenceCleanLfSha256,
    validatorPath: binding.validationRelative,
    validatorRawSha256: binding.validationSha256,
    validatorMode: binding.validation.validatorMode,
    validatorDisposition: binding.validation.disposition,
    artifactSha: evidence.artifactSha,
    artifactRawSha256: evidence.artifactRawSha256,
    artifactRawBufferBlobSha1: evidence.artifactRawBufferBlobSha1,
    qidCount: evidence.rows.length,
    allMetaAxesPass: metaDebtRows.length === 0,
    ...(metaDebtRows.length ? {
      metaDebtQids: metaDebtRows.map(row => row.qid),
      coreMetaFieldsPass: true,
      metaDebtAdmission: binding.metaDebtAdmission,
      semanticPassClaim: false,
    } : {}),
  };
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

function verifyR1MetaProof(evidence, assignment, examUid, bank, root, admission = null) {
  assert(evidence?.stage === 'R1' && evidence.examUid === examUid && evidence.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006' && evidence.executionLine === 'CODEX', 'R1_META_PROOF_IDENTITY_INVALID');
  assert(evidence.artifactSha === assignment.validatorRawBufferBlobSha1, 'R1_META_PROOF_ARTIFACT_SHA_MISMATCH');
  if (evidence.artifactRawSha256 !== undefined) assert(evidence.artifactRawSha256 === assignment.artifactRawSha256, 'R1_META_PROOF_RAW_SHA_MISMATCH');
  if (evidence.artifactRawBufferBlobSha1 !== undefined) assert(evidence.artifactRawBufferBlobSha1 === assignment.validatorRawBufferBlobSha1, 'R1_META_PROOF_BLOB_SHA_MISMATCH');
  assert(Array.isArray(evidence.rows) && evidence.rows.length === bank.length, 'R1_META_PROOF_DENOMINATOR_MISMATCH');
  const expected = bank.map((_, index) => index + 1);
  const actual = evidence.rows.map(row => Number(row.qid)).sort((a, b) => a - b);
  assert(JSON.stringify(actual) === JSON.stringify(expected), 'R1_META_PROOF_QID_SET_MISMATCH');
  const admittedRows = admission ? verifyR1MetaCoreDebtAdmission({ admission, evidence, assignment, examUid, bank, root }) : [];
  const admittedQids = new Set(admittedRows.map(row => Number(row.qid)));
  assert(evidence.rows.every(row => (isAcceptedR1Verdict(row.verdict) || (admittedQids.has(Number(row.qid)) && row.verdict === 'PASS_WITH_META_DEBT'))
    && (admittedQids.has(Number(row.qid)) || hasAcceptedMetaDisposition(row, bank[Number(row.qid) - 1]))), 'R1_META_PROOF_META_PASS_REQUIRED');
  const itemRecoveryRows = evidence.rows.filter(row => row.verdict === 'PASS_AFTER_ITEM_RECOVERY');
  assert(itemRecoveryRows.every(row => verifyR1ItemRecoveryProof({ row, examUid, bank, root, assignment })), 'R1_ITEM_RECOVERY_VERDICT_PROOF_REQUIRED');
  return admittedRows;
}

export function verifyBoundR1MetaBindingPendingAdmission({
  authorityAdmission, rosterAdmission, assignment, examUid, sourceRawSha256, sourceGitBlobSha1,
  r1EvidenceBinding, bank,
}) {
  const keys = ['schemaVersion', 'examUid', 'sourceRawSha256', 'sourceGitBlobSha1', 'questionCount', 'r1EvidencePath', 'r1EvidenceSha256', 'qids', 'fieldNames', 'disposition'];
  const exactKeys = value => value && typeof value === 'object' && !Array.isArray(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());
  assert(exactKeys(authorityAdmission) && exactKeys(rosterAdmission), 'ROOT_R1_META_BINDING_PENDING_ADMISSION_SCHEMA_REQUIRED');
  const admission = authorityAdmission;
  const expectedScope = META_BINDING_PENDING_SCOPES[examUid];
  assert(expectedScope, 'ROOT_R1_META_BINDING_PENDING_UID_UNSUPPORTED', examUid);
  assert(keys.filter(key => !['qids', 'fieldNames'].includes(key)).every(key => admission[key] === rosterAdmission[key])
    && JSON.stringify(admission.qids) === JSON.stringify(rosterAdmission.qids)
    && JSON.stringify(admission.fieldNames) === JSON.stringify(rosterAdmission.fieldNames),
  'ROOT_R1_META_BINDING_PENDING_SCOPE_ROW_MISMATCH');
  assert(admission.schemaVersion === META_BINDING_PENDING_ADMISSION_SCHEMA, 'ROOT_R1_META_BINDING_PENDING_SCHEMA_INVALID');
  assert(admission.examUid === examUid
    && admission.sourceRawSha256 === expectedScope.sourceRawSha256
    && sourceRawSha256 === admission.sourceRawSha256
    && assignment?.artifactRawSha256 === admission.sourceRawSha256
    && admission.sourceGitBlobSha1 === expectedScope.sourceGitBlobSha1
    && sourceGitBlobSha1 === admission.sourceGitBlobSha1
    && assignment?.validatorRawBufferBlobSha1 === admission.sourceGitBlobSha1
    && admission.questionCount === expectedScope.questionCount
    && bank.length === admission.questionCount
    && admission.disposition === META_BINDING_PENDING_DISPOSITION,
  'ROOT_R1_META_BINDING_PENDING_SCOPE_INVALID');
  assert(admission.r1EvidencePath === r1EvidenceBinding?.relative
    && admission.r1EvidencePath === assignment?.r1EvidencePath
    && admission.r1EvidenceSha256 === r1EvidenceBinding?.evidenceSha256
    && admission.r1EvidenceSha256 === assignment?.r1EvidenceSha256,
  'ROOT_R1_META_BINDING_PENDING_R1_BINDING_MISMATCH');
  assert(JSON.stringify(admission.qids) === JSON.stringify(expectedScope.qids)
    && JSON.stringify(admission.fieldNames) === JSON.stringify(META_BINDING_PENDING_FIELD_NAMES),
  'ROOT_R1_META_BINDING_PENDING_QID_OR_FIELD_SCOPE_INVALID');
  const evidence = r1EvidenceBinding.evidence;
  assert(evidence?.examUid === admission.examUid
    && evidence?.artifactRawSha256 === admission.sourceRawSha256
    && Array.isArray(evidence.rows) && evidence.rows.length === admission.questionCount,
  'ROOT_R1_META_BINDING_PENDING_EVIDENCE_IDENTITY_INVALID');
  const rowsByQid = new Map(evidence.rows.map(row => [Number(row.qid), row]));
  const expectedQids = admission.qids;
  assert(rowsByQid.size === evidence.rows.length && expectedQids.every(qid => rowsByQid.has(qid)), 'ROOT_R1_META_BINDING_PENDING_EVIDENCE_QID_SET_INVALID');
  const hasPendingMarker = row => {
    const meta = row?.axisEvidence?.META;
    const projectionStatus = meta?.projectionStatus ?? meta?.currentFields?.projectionStatus ?? meta?.currentMeta?.projectionStatus;
    return (typeof meta?.status === 'string' && meta.status.includes('BINDING_PENDING'))
      || (typeof projectionStatus === 'string' && projectionStatus.includes('BINDING_PENDING'));
  };
  const pendingRows = evidence.rows.filter(hasPendingMarker);
  assert(JSON.stringify(pendingRows.map(row => Number(row.qid)).sort((a, b) => a - b)) === JSON.stringify([...expectedQids].sort((a, b) => a - b)),
    'ROOT_R1_META_BINDING_PENDING_EVIDENCE_SCOPE_MISMATCH');

  const rows = expectedQids.map(qid => {
    const row = rowsByQid.get(qid);
    const question = bank[qid - 1];
    const axisMeta = row?.axisEvidence?.META;
    const meta = expectedScope.metaField ? axisMeta?.[expectedScope.metaField] : axisMeta;
    const fourAxisMeta = row?.fourAxisReview?.META;
    assert(row && question && isAcceptedR1Verdict(row.verdict), 'ROOT_R1_META_BINDING_PENDING_R1_VERDICT_REQUIRED', String(qid));
    const expectedAxisStatus = expectedScope.axisStatusesByQid?.[qid] ?? expectedScope.axisStatus;
    assert(axisMeta?.status === expectedAxisStatus
      && meta?.projectionStatus === expectedScope.projectionStatus
      && (!hasOwn(meta, 'metaDebtFields') || (Array.isArray(meta.metaDebtFields) && meta.metaDebtFields.length === 0)),
    'ROOT_R1_META_BINDING_PENDING_TYPED_STATE_REQUIRED', String(qid));
    assert(fourAxisMeta?.disposition === 'CURRENT_FIELDS_RETAINED'
      && (fourAxisMeta?.sourceRawSha256 === undefined || fourAxisMeta.sourceRawSha256 === admission.sourceRawSha256)
      && nonempty(fourAxisMeta?.evidence),
    'ROOT_R1_META_BINDING_PENDING_CURRENT_FIELDS_PROOF_REQUIRED', String(qid));
    assert(question.problemTypeKey !== null && question.problemTypeKey !== undefined && String(question.problemTypeKey).trim()
      && question.templateKey !== null && question.templateKey !== undefined && String(question.templateKey).trim()
      && meta.problemTypeKey === question.problemTypeKey && meta.templateKey === question.templateKey,
    'ROOT_R1_META_BINDING_PENDING_SOURCE_VALUE_PARITY_FAIL', String(qid));
    return { qid, fieldNames: [...admission.fieldNames], disposition: admission.disposition };
  });
  return rows;
}

const R1_META_DEBT_CORE_FIELDS = Object.freeze([
  'standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'level',
]);
const R1_META_CORE_AUTHORITY_CITATION_PATHS = Object.freeze([
  'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',
  'docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md',
  'docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md',
  'docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md',
  'archive/data/master_tables/js_archive_tag_master.json',
  'archive/data/meta-foundation/compiled/taxonomy_registry.json',
  'archive/data/meta-foundation/compiled/curriculum_bindings.json',
  'archive/data/meta-foundation/canonical/packs/probability-statistics/taxonomy.json',
]);

function readBoundFileBytes(root, ref, code) {
  assert(ref && typeof ref.path === 'string' && /^[a-f0-9]{64}$/.test(ref.sha256 || ''), `${code}_REFERENCE_REQUIRED`);
  const candidate = path.resolve(root, ref.path);
  assert(isWithin(root, candidate), `${code}_PATH_OUTSIDE_ROOT`);
  const real = fs.realpathSync(candidate);
  assert(isWithin(root, real), `${code}_SYMLINK_OUTSIDE_ROOT`);
  const bytes = fs.readFileSync(real);
  assert(sha256(bytes) === ref.sha256, `${code}_SHA256_MISMATCH`);
  return bytes;
}

function readBoundJson(root, ref, code) {
  const bytes = readBoundFileBytes(root, ref, code);
  try { return JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')); }
  catch { throw new Error(`${code}_JSON_INVALID`); }
}

/**
 * Validates ROOT's single-target exception for preserving explicit R1 PT/TPL projection debt.
 * This only permits a registration projection with manual holds; it does not turn R1 Meta into PASS.
 */
export function verifyR1MetaCoreDebtAdmission({ admission, evidence, assignment, examUid, bank, root }) {
  const rootReal = fs.realpathSync(root);
  assert(evidence?.stage === 'R1' && evidence.examUid === examUid
    && evidence.qualityContractVersion === QUALITY_CONTRACT_V2 && evidence.executionLine === 'CODEX',
  'R1_META_CORE_ADMISSION_R1_CONTRACT_INVALID');
  assert(admission?.schemaVersion === 'JS_ARCHIVE_ROOT_R1_META_CORE_DEBT_ADMISSION_V1'
    && admission.executionLine === 'CODEX'
    && admission.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'
    && admission.decisionAuthority === 'ROOT_DELEGATED'
    && admission.status === 'ROOT_AUTHORIZED_BOUNDED_ADMISSION', 'R1_META_CORE_ADMISSION_AUTHORITY_INVALID');
  const scope = admission.scope || {};
  assert(scope.examUid === examUid && examUid === '23_매산여고_1학기_중간_고2_확률과통계'
    && scope.productionPath === assignment.productionRelativePath
    && scope.sourceRawSha256 === assignment.artifactRawSha256
    && scope.sourceGitBlobSha1 === assignment.validatorRawBufferBlobSha1
    && scope.questionCount === bank.length
    && JSON.stringify(scope.allowedQids) === JSON.stringify([1, 6, 7, 8, 9]), 'R1_META_CORE_ADMISSION_SCOPE_INVALID');
  assert(scope.lockedRosterSha256 === assignment.lockedRosterSha256, 'R1_META_CORE_ADMISSION_ROSTER_BINDING_MISMATCH');
  assert(admission.rootAuthorityReference?.path === assignment.producerAuthorityPath
    && admission.rootAuthorityReference?.sha256 === assignment.producerAuthoritySha256,
  'R1_META_CORE_ADMISSION_ROOT_AUTHORITY_BINDING_MISMATCH');
  const standingAuthority = readBoundJson(rootReal, admission.rootAuthorityReference, 'R1_META_CORE_ADMISSION_ROOT_AUTHORITY');
  assert(standingAuthority.decisionAuthority === 'ROOT_DELEGATED'
    && standingAuthority.runId === scope.runId
    && standingAuthority.roster?.sha256 === scope.lockedRosterSha256
    && standingAuthority.scope?.some(row => row.examUid === examUid && row.productionPath === scope.productionPath),
  'R1_META_CORE_ADMISSION_STANDING_AUTHORITY_SCOPE_MISMATCH');
  const supplement = readBoundJson(rootReal, admission.metaCoreDebtSupplement, 'R1_META_CORE_ADMISSION_SUPPLEMENT');
  assert(supplement.schemaVersion === admission.metaCoreDebtSupplement.schemaVersion
    && supplement.schemaVersion === 'JS_ARCHIVE_R1_META_CORE_DEBT_SUPPLEMENT_V1'
    && supplement.examUid === examUid && supplement.stage === 'R1_SUPPLEMENTAL_META_ONLY'
    && supplement.qualityContractVersion === QUALITY_CONTRACT_V2 && supplement.executionLine === 'CODEX'
    && supplement.sourceRawSha256 === scope.sourceRawSha256
    && supplement.sourceRawBufferBlobSha1 === scope.sourceGitBlobSha1
    && supplement.fullArtifactDenominator === bank.length
    && JSON.stringify(supplement.scopeQids) === JSON.stringify(scope.allowedQids)
    && supplement.priorR1Evidence?.sha256 === admission.r1Evidence.sha256
    && supplement.priorR1ValidatorReport?.sha256 === admission.r1Validation.sha256,
  'R1_META_CORE_ADMISSION_SUPPLEMENT_SCOPE_MISMATCH');
  const citationFiles = supplement.citationFiles;
  assert(Array.isArray(citationFiles)
    && JSON.stringify(citationFiles.map(ref => ref.path).slice().sort()) === JSON.stringify([...R1_META_CORE_AUTHORITY_CITATION_PATHS].sort()),
  'R1_META_CORE_ADMISSION_CITATION_SCOPE_INVALID');
  for (const ref of citationFiles) readBoundFileBytes(rootReal, ref, 'R1_META_CORE_ADMISSION_LIVE_CITATION');
  assert(admission.r1Evidence?.path === assignment.r1EvidencePath
    && admission.r1Evidence?.sha256 === assignment.r1EvidenceSha256
    && admission.r1Validation?.path === assignment.r1ValidationPath
    && admission.r1Validation?.sha256 === assignment.r1ValidationSha256,
  'R1_META_CORE_ADMISSION_R1_BINDING_MISMATCH');
  assert(evidence.artifactSha === scope.sourceGitBlobSha1 && evidence.artifactRawSha256 === scope.sourceRawSha256,
    'R1_META_CORE_ADMISSION_ARTIFACT_BINDING_MISMATCH');
  const policy = admission.admissionPolicy || {};
  assert(JSON.stringify(policy.allowedMetaDebtFields) === JSON.stringify(['problemTypeKey', 'templateKey'])
    && JSON.stringify(policy.coreFieldsMustMatchSource) === JSON.stringify(R1_META_DEBT_CORE_FIELDS)
    && policy.requireRegisteredL2 === true
    && policy.requireDifficultyCurrentEqualsIndependent === true
    && policy.requireReviewStatusManual === true
    && policy.requireR1V2ActiveArtifactPass === true
    && policy.requireFullQuestionDenominator === true,
  'R1_META_CORE_ADMISSION_POLICY_INVALID');
  assert(admission.outputConstraints?.reviewStatus === 'manual_review'
    && admission.outputConstraints?.metadataStatus === 'approved_partial_with_explicit_holds'
    && admission.outputConstraints?.fieldStatusForDebtFields === 'manual_review_pending'
    && admission.outputConstraints?.projectionStatusCopied === true
    && admission.outputConstraints?.metaDebtFieldsAndReasonCopied === true
    && admission.outputConstraints?.semanticPassClaim === false
    && admission.outputConstraints?.sourceValuesUnchanged === true
    && admission.outputConstraints?.automaticEligibilityPromoted === false,
  'R1_META_CORE_ADMISSION_OUTPUT_CONSTRAINTS_INVALID');

  const rows = new Map(evidence.rows.map(row => [Number(row.qid), row]));
  const supplementRows = new Map((supplement.rows || []).map(row => [Number(row.qid), row]));
  const admissionRows = admission.admissionPolicy.rows;
  assert(Array.isArray(admissionRows) && JSON.stringify(admissionRows.map(row => Number(row.qid))) === JSON.stringify(scope.allowedQids),
    'R1_META_CORE_ADMISSION_ROW_SCOPE_INVALID');
  const result = [];
  for (const authorized of admissionRows) {
    const qid = Number(authorized.qid), question = bank[qid - 1], row = rows.get(qid), supplementRow = supplementRows.get(qid);
    assert(question && row && question.reviewStatus === 'manual_review', 'R1_META_CORE_ADMISSION_SOURCE_REVIEW_STATUS_INVALID', String(qid));
    const current = row.metaReview?.currentFields;
    const coreAssessment = authorized.coreMetaAssessment || {};
    const supplementalCurrent = supplementRow?.currentMeta || {};
    const supplementalCore = supplementRow?.coreMetaAssessment || {};
    const supplementalProjection = supplementRow?.projectionAssessment || {};
    const supplementalL2 = supplementRow?.registeredMasterRows?.subUnit;
    assert(supplementRow && R1_META_DEBT_CORE_FIELDS.every(field => question[field] === supplementalCurrent[field]
      && supplementalCurrent[field] === current?.[field])
      && ['standardCourseValid', 'standardUnitValid', 'standardUnitOrderValid', 'registeredL2Valid', 'difficultyFieldsValid', 'difficultyLevelMappingValid'].every(key => supplementalCore[key] === coreAssessment[key])
      && supplementalCore.priorR1DifficultyReview?.currentBucket === coreAssessment.priorR1DifficultyReview?.currentBucket
      && supplementalCore.priorR1DifficultyReview?.independentBucket === coreAssessment.priorR1DifficultyReview?.independentBucket
      && supplementalCore.priorR1DifficultyReview?.confidence === coreAssessment.priorR1DifficultyReview?.confidence
      && supplementalCore.priorR1DifficultyReview?.boundaryFlag === coreAssessment.priorR1DifficultyReview?.boundaryFlag
      && supplementalCore.priorR1DifficultyReview?.legacyLevelCompatibility === coreAssessment.priorR1DifficultyReview?.legacyLevelCompatibility
      && supplementalCurrent.reviewStatus === 'manual_review'
      && supplementalL2?.status === 'active'
      && supplementalL2.key === authorized.registeredL2?.key
      && supplementalL2.parentKey === question.standardUnitKey,
    'R1_META_CORE_ADMISSION_SUPPLEMENT_CORE_MISMATCH', String(qid));
    assert(R1_META_DEBT_CORE_FIELDS.every(field => question[field] === current?.[field]),
      'R1_META_CORE_ADMISSION_CORE_FIELDS_NOT_SOURCE_PARITY', String(qid));
    assert(coreAssessment.standardCourseValid === true && coreAssessment.standardUnitValid === true
      && coreAssessment.standardUnitOrderValid === true && coreAssessment.registeredL2Valid === true
      && coreAssessment.difficultyFieldsValid === true && coreAssessment.difficultyLevelMappingValid === true,
    'R1_META_CORE_ADMISSION_CORE_ASSESSMENT_INVALID', String(qid));
    const l2 = authorized.registeredL2;
    assert(l2?.status === 'active' && question.subUnitKey === l2.key && question.standardUnitKey === l2.standardUnitKey,
      'R1_META_CORE_ADMISSION_REGISTERED_L2_INVALID', String(qid));
    const difficulty = coreAssessment.priorR1DifficultyReview;
    assert(difficulty && difficulty.currentBucket === question.difficultyBucket
      && difficulty.independentBucket === question.difficultyBucket
      && difficulty.confidence === question.difficultyConfidence
      && difficulty.boundaryFlag === question.difficultyBoundaryFlag
      && difficulty.legacyLevelCompatibility === question.legacyLevelCompatibility,
    'R1_META_CORE_ADMISSION_DIFFICULTY_PARITY_INVALID', String(qid));
    assert(row.verdict === authorized.expectedR1Verdict
      && row.metaReview?.status === authorized.expectedR1MetaReviewStatus
      && current?.projectionStatus === authorized.expectedProjectionStatus
      && question.projectionStatus === authorized.expectedProjectionStatus
      && JSON.stringify(row.metaReview?.metaDebtFields) === JSON.stringify(authorized.metaDebtFields)
      && JSON.stringify(authorized.metaDebtFields) === JSON.stringify(['problemTypeKey', 'templateKey'])
      && row.metaReview?.metaDebtReason === authorized.metaDebtReason,
    'R1_META_CORE_ADMISSION_DEBT_STATUS_MISMATCH', String(qid));
    assert(supplementalProjection.status === authorized.expectedProjectionStatus
      && supplementalProjection.currentProblemTypeKey === question.problemTypeKey
      && supplementalProjection.currentTemplateKey === question.templateKey
      && JSON.stringify(supplementalProjection.metaDebtFields) === JSON.stringify(authorized.metaDebtFields)
      && supplementalProjection.metaDebtReason === authorized.metaDebtReason,
    'R1_META_CORE_ADMISSION_SUPPLEMENT_PROJECTION_MISMATCH', String(qid));
    if (qid === 1) {
      assert(row.verdict === 'PASS_WITH_META_DEBT' && current.problemTypeKey === null && current.templateKey === null
        && question.problemTypeKey === null && question.templateKey === null
        && authorized.projectionAssessment?.disposition === 'META_ONLY_UNRESOLVED_NO_SINGLE_PRIMARY; do not claim semantic PASS'
        && authorized.projectionAssessment?.retainedKeysActiveAndSameParent === null
        && authorized.projectionAssessment?.exactCurrentL2BindingCount === null,
      'R1_META_CORE_ADMISSION_Q1_NULL_PROJECTION_INVALID');
    } else {
      assert(row.verdict === 'PASS' && admission.admissionPolicy.q6to9ProjectionPending?.r1MetaReviewStatus === 'PROJECTION_BINDING_PENDING'
        && authorized.projectionAssessment?.retainedKeysActiveAndSameParent === true
        && authorized.projectionAssessment?.exactCurrentL2BindingCount === 0
        && question.problemTypeKey === authorized.projectionAssessment.currentProblemTypeKey
        && question.templateKey === authorized.projectionAssessment.currentTemplateKey
        && current.problemTypeKey === question.problemTypeKey && current.templateKey === question.templateKey,
      'R1_META_CORE_ADMISSION_PENDING_PROJECTION_INVALID', String(qid));
    }
    result.push({ qid, projectionStatus: authorized.expectedProjectionStatus,
      metaDebtFields: jsonClone(authorized.metaDebtFields), metaDebtReason: authorized.metaDebtReason });
  }
  const admittedQids = new Set(result.map(row => Number(row.qid)));
  assert(evidence.rows.every(row => admittedQids.has(Number(row.qid))
    ? row.verdict === (Number(row.qid) === 1 ? 'PASS_WITH_META_DEBT' : 'PASS')
    : isAcceptedR1Verdict(row.verdict) && hasAcceptedMetaDisposition(row, bank[Number(row.qid) - 1])),
  'R1_META_CORE_ADMISSION_SCOPE_EXPANSION_REJECTED');
  return result;
}

function isAcceptedR1Verdict(value) {
  return value === 'PASS' || value === 'PASS_AFTER_ADJUDICATION' || value === 'PASS_AFTER_SAME_STAGE_SOURCE_FIGURE_ADJUDICATION' || value === 'PASS_AFTER_REPAIR' || value === 'PASS_AFTER_ITEM_RECOVERY';
}

function verifyR1ItemRecoveryProof({ row, examUid, bank, root, assignment }) {
  assert(Number(row.qid) === 18 && examUid === '21_매산여고_1학기_기말_고1_기출', 'R1_ITEM_RECOVERY_Q18_SCOPE_REQUIRED');
  const currentQuestion = bank.find(question => Number(question?.id) === 18);
  assert(row.itemStatus === 'CLEAR_AFTER_FRESH_SCOPED_R1_R2', 'R1_ITEM_RECOVERY_EVIDENCE_NOT_CLEARED');
  assert(currentQuestion, 'R1_ITEM_RECOVERY_SOURCE_QID_MISSING');
  if (hasOwn(currentQuestion, 'itemStatus')) {
    assert(currentQuestion.itemStatus === 'CLEAR_AFTER_FRESH_SCOPED_R1_R2', 'R1_ITEM_RECOVERY_SOURCE_NOT_CLEARED');
  }
  assert(row.disposition === 'FRESH_Q18_R1_PASS_R2_MATCH_ALIVE_REPLACEMENT' && row.repairApplied === true && row.sourceMode === 'ALIVE_REPLACEMENT', 'R1_ITEM_RECOVERY_DISPOSITION_REQUIRED');
  const proof = row.provenanceEvidence?.authorizedReplacement;
  assert(proof?.sourceMode === 'ALIVE_REPLACEMENT', 'R1_ITEM_RECOVERY_PROVENANCE_REQUIRED');
  const rootDecision = proof.rootDecision;
  assert(rootDecision?.authority === 'ROOT_DELEGATED' && Array.isArray(rootDecision.scopeQids) && rootDecision.scopeQids.length === 1 && Number(rootDecision.scopeQids[0]) === 18, 'R1_ITEM_RECOVERY_ROOT_DECISION_BINDING_REQUIRED');
  const rootReal = fs.realpathSync(root);
  const readProofRef = (ref, expectedRelative, code) => {
    assert(ref?.path === expectedRelative && /^[a-f0-9]{64}$/.test(ref.sha256 || ''), code + '_REFERENCE_REQUIRED');
    const candidate = path.resolve(rootReal, expectedRelative);
    assert(isWithin(rootReal, candidate), code + '_PATH_OUTSIDE_ROOT');
    const real = fs.realpathSync(candidate);
    assert(isWithin(rootReal, real), code + '_SYMLINK_OUTSIDE_ROOT');
    const bytes = fs.readFileSync(real);
    assert(sha256(bytes) === ref.sha256, code + '_SHA256_MISMATCH');
    return { path: real, bytes };
  };
  const evidenceRoot = `archive/analysis/${examUid}/h1-final-five-pilot-20261008`;
  const decisionPath = `${evidenceRoot}/ROOT.item-recovery.decision.json`;
  const decisionRef = readProofRef(rootDecision, decisionPath, 'R1_ITEM_RECOVERY_ROOT_DECISION');
  const decision = JSON.parse(decisionRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(decision.schemaVersion === 'ROOT_POST_R2_BOUNDED_ITEM_RECOVERY_DECISION_V1' && decision.runId === 'h1-final-five-pilot-20261008' && decision.examUid === examUid && decision.decisionAuthority === 'ROOT_DELEGATED' && decision.remainingAfterR2 === true && decision.sourceHoldRecordedInEvidence === true && decision.physicalItemStatusNotPresent === true && Array.isArray(decision.scopeQids) && decision.scopeQids.length === 1 && Number(decision.scopeQids[0]) === 18, 'R1_ITEM_RECOVERY_ROOT_DECISION_INVALID');
  const recoveryRef = readProofRef(proof.itemRecoveryEvidence, `${evidenceRoot}/ITEM_RECOVERY.q18.closed.evidence.json`, 'R1_ITEM_RECOVERY_CLOSED_EVIDENCE');
  let recoveryEvidence;
  try { recoveryEvidence = JSON.parse(recoveryRef.bytes.toString('utf8').replace(/^\uFEFF/, '')); }
  catch { throw new Error('R1_ITEM_RECOVERY_CLOSED_EVIDENCE_JSON_INVALID'); }
  assert(recoveryEvidence.schemaVersion === 'JS_ARCHIVE_ITEM_RECOVERY_CLOSURE_EVIDENCE_V1'
    && recoveryEvidence.status === 'Q18_RECOVERY_CLOSED_SCOPED_REVIEW_COMPLETE'
    && recoveryEvidence.runId === 'h1-final-five-pilot-20261008' && recoveryEvidence.examUid === examUid
    && Array.isArray(recoveryEvidence.allowedQids) && recoveryEvidence.allowedQids.length === 1 && Number(recoveryEvidence.allowedQids[0]) === 18
    && recoveryEvidence.sourceMode === 'ALIVE_REPLACEMENT'
    && recoveryEvidence.reviewStatus?.physicalItemStatus === 'CLEAR'
    && recoveryEvidence.reviewStatus?.r1Q18 === 'PASS' && recoveryEvidence.reviewStatus?.r2Q18 === 'MATCH'
    && recoveryEvidence.closureAuthority === 'ROOT_DELEGATED'
    && recoveryEvidence.sourcePreservation?.originalSourceTextRemainsUnchanged === true,
  'R1_ITEM_RECOVERY_CLOSED_EVIDENCE_CLEAR_PROOF_REQUIRED');
  let holdClearPriorBank;
  if (!hasOwn(currentQuestion, 'itemStatus')) {
    assert(decision.physicalItemStatusNotPresent === true && recoveryEvidence.reviewStatus.physicalItemStatus === 'CLEAR', 'R1_ITEM_RECOVERY_SOURCE_NOT_CLEARED');
    const binding = recoveryEvidence.closure?.studentAndProofBinding;
    assert(binding?.studentFieldsUnchanged === true && binding?.answerSolutionMetaUnchanged === true
      && binding?.originalR1R2FreezeFilesPreserved === true
      && binding?.postClearRawSha256 === assignment.artifactRawSha256
      && /^[a-f0-9]{64}$/.test(binding.r1R2InputRawSha256 || '')
      && /^[a-f0-9]{40}$/.test(binding.r1R2InputBlobSha1 || ''),
    'R1_ITEM_RECOVERY_HOLD_CLEAR_BINDING_REQUIRED');
    const holdClearRelative = `.tmp/archive/h1-final-five-pilot-20261008/${examUid}/evidence/ITEM_RECOVERY.q18.hold-clear-change.json`;
    const holdClearRef = recoveryEvidence.closure?.changeReport;
    const holdClearAbsolute = path.resolve(rootReal, holdClearRelative);
    assert(holdClearRef?.sha256 && /^[a-f0-9]{64}$/.test(holdClearRef.sha256)
      && path.resolve(holdClearRef.path || '') === holdClearAbsolute, 'R1_ITEM_RECOVERY_HOLD_CLEAR_CHANGE_REFERENCE_REQUIRED');
    const holdClearReal = fs.realpathSync(holdClearAbsolute);
    assert(isWithin(rootReal, holdClearReal), 'R1_ITEM_RECOVERY_HOLD_CLEAR_CHANGE_PATH_OUTSIDE_ROOT');
    const holdClearBytes = fs.readFileSync(holdClearReal);
    assert(sha256(holdClearBytes) === holdClearRef.sha256, 'R1_ITEM_RECOVERY_HOLD_CLEAR_CHANGE_SHA256_MISMATCH');
    let holdClear;
    try { holdClear = JSON.parse(holdClearBytes.toString('utf8').replace(/^\uFEFF/, '')); }
    catch { throw new Error('R1_ITEM_RECOVERY_HOLD_CLEAR_CHANGE_JSON_INVALID'); }
    assert(holdClear.schemaVersion === 'JS_ARCHIVE_Q18_HOLD_CLEAR_CHANGE_V1' && holdClear.runId === 'h1-final-five-pilot-20261008'
      && holdClear.examUid === examUid && JSON.stringify(holdClear.changedQids) === '[18]'
      && JSON.stringify(holdClear.changedFields) === '[\"itemStatus\"]'
      && holdClear.beforeRawSha256 === binding.r1R2InputRawSha256 && holdClear.afterRawSha256 === assignment.artifactRawSha256
      && holdClear.priorItemStatus === 'HOLD' && holdClear.currentItemStatus === 'CLEARED_AFTER_FRESH_SCOPED_R1_R2'
      && holdClear.studentFieldsUnchanged === true && holdClear.answerSolutionMetaUnchanged === true
      && holdClear.nonTargetParsedObjectMutationCount === 0 && holdClear.questionCount === bank.length
      && holdClear.r1?.verdict === 'PASS' && holdClear.r2?.verdict === 'PASS' && holdClear.r2?.answerComparison === 'MATCH'
      && JSON.stringify(holdClear.r1?.scopeQids) === '[18]' && JSON.stringify(holdClear.r2?.scopeQids) === '[18]',
    'R1_ITEM_RECOVERY_HOLD_CLEAR_CHANGE_INVALID');
    assert(path.resolve(rootReal, holdClear.r1?.path || '') === path.resolve(rootReal, `${evidenceRoot}/R1.q18fresh.scoped-review-receipt.json`)
      && path.resolve(rootReal, holdClear.r2?.path || '') === path.resolve(rootReal, `${evidenceRoot}/R2.q18fresh.scoped-comparison-receipt.json`), 'R1_ITEM_RECOVERY_HOLD_CLEAR_REVIEW_BINDING_INVALID');
    const freshScopeRefs = row.provenanceEvidence?.freshScopeReviews;
    assert(holdClear.r1?.sha256 === freshScopeRefs?.r1?.sha256 && holdClear.r2?.sha256 === freshScopeRefs?.r2?.sha256,
      'R1_ITEM_RECOVERY_HOLD_CLEAR_REVIEW_SHA_MISMATCH');
    const historicalPath = `${evidenceRoot}/preserved-inputs/history/q18-hold-clear-preimage/${examUid}/${examUid}.js.source-evidence.json`;
    const historicalReal = fs.realpathSync(path.resolve(rootReal, historicalPath));
    assert(isWithin(rootReal, historicalReal), 'R1_ITEM_RECOVERY_HOLD_CLEAR_PREIMAGE_PATH_OUTSIDE_ROOT');
    const historicalBytes = fs.readFileSync(historicalReal);
    const historical = JSON.parse(historicalBytes.toString('utf8').replace(/^\uFEFF/, ''));
    assert(historical.schemaVersion === 'JS_ARCHIVE_HISTORICAL_SOURCE_BYTES_V1'
      && historical.originalPath === `.tmp/archive/h1-final-five-pilot-20261008/${examUid}/history/q18-hold-clear-preimage/${examUid}/${examUid}.js`
      && historical.rawSha256 === binding.r1R2InputRawSha256 && typeof historical.base64 === 'string', 'R1_ITEM_RECOVERY_HOLD_CLEAR_PREIMAGE_REQUIRED');
    const priorSourceBytes = Buffer.from(historical.base64, 'base64');
    assert(priorSourceBytes.length > 0 && sha256(priorSourceBytes) === historical.rawSha256, 'R1_ITEM_RECOVERY_HOLD_CLEAR_PREIMAGE_SHA_MISMATCH');
    const priorBank = runVmSourceBytes(priorSourceBytes, historical.originalPath);
    assert(priorBank.length === bank.length, 'R1_ITEM_RECOVERY_HOLD_CLEAR_PREIMAGE_QCOUNT_MISMATCH');
    const priorQuestion = priorBank.find(question => Number(question?.id) === 18);
    const priorComparable = jsonClone(priorQuestion), currentComparable = jsonClone(currentQuestion);
    delete priorComparable.itemStatus;
    delete currentComparable.itemStatus;
    assert(hashJson(priorComparable) === hashJson(currentComparable), 'R1_ITEM_RECOVERY_HOLD_CLEAR_Q18_FIELDS_CHANGED');
    holdClearPriorBank = priorBank;
  }
  assert(proof.nonTargetInvariant?.nonTargetQidCount === bank.length - 1 && proof.nonTargetInvariant.mutationCount === 0, 'R1_ITEM_RECOVERY_NON_TARGET_SUMMARY_REQUIRED');
  const invarianceRef = readProofRef(proof.nonTargetInvariant, `${evidenceRoot}/ITEM_RECOVERY.q18.non-target-invariance.json`, 'R1_ITEM_RECOVERY_NON_TARGET_INVARIANCE');
  const invariance = JSON.parse(invarianceRef.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  assert(invariance.schemaVersion === 'JS_ARCHIVE_ITEM_RECOVERY_NON_TARGET_INVARIANCE_V1' && invariance.runId === 'h1-final-five-pilot-20261008' && invariance.examUid === examUid, 'R1_ITEM_RECOVERY_NON_TARGET_PROOF_REQUIRED');
  if (holdClearPriorBank) {
    const priorOutside = Object.fromEntries(holdClearPriorBank.filter(question => Number(question?.id) !== 18).map(question => [String(question.id), hashJson(question)]));
    const currentOutside = Object.fromEntries(bank.filter(question => Number(question?.id) !== 18).map(question => [String(question.id), hashJson(question)]));
    const expectedOutsideQids = bank.map((_, index) => index + 1).filter(qid => qid !== 18);
    assert(expectedOutsideQids.every(qid => invariance.nonTargetParsedObjectSha256?.[String(qid)] === priorOutside[String(qid)]
      && invariance.nonTargetParsedObjectSha256?.[String(qid)] === currentOutside[String(qid)]), 'R1_ITEM_RECOVERY_HOLD_CLEAR_NON_TARGET_OBJECTS_CHANGED');
  }
  const expectedNonTargetQids = bank.map((_, index) => index + 1).filter(qid => qid !== 18);
  assert(Array.isArray(invariance.allowedQids) && invariance.allowedQids.length === 1 && Number(invariance.allowedQids[0]) === 18 && Array.isArray(invariance.changedQids) && invariance.changedQids.length === 1 && Number(invariance.changedQids[0]) === 18 && invariance.currentQuestionCount === bank.length && invariance.nonTargetMutationCount === 0, 'R1_ITEM_RECOVERY_NON_TARGET_INVARIANCE_INVALID');
  assert(Array.isArray(invariance.nonTargetQids) && invariance.nonTargetQids.length === expectedNonTargetQids.length
    && JSON.stringify(invariance.nonTargetQids.map(Number)) === JSON.stringify(expectedNonTargetQids)
    && invariance.nonTargetParsedObjectSha256 && Object.keys(invariance.nonTargetParsedObjectSha256).length === expectedNonTargetQids.length,
  'R1_ITEM_RECOVERY_NON_TARGET_QID_MAP_INVALID');
  const holdClearBinding = recoveryEvidence.closure?.studentAndProofBinding;
  assert(invariance.sourceBeforeRecoveryRawSha256 === decision.source?.sha256
    && (invariance.currentSourceRawSha256 === assignment.artifactRawSha256
      || (holdClearBinding?.r1R2InputRawSha256 === invariance.currentSourceRawSha256
        && holdClearBinding?.postClearRawSha256 === assignment.artifactRawSha256)), 'R1_ITEM_RECOVERY_NON_TARGET_SOURCE_SHA_MISMATCH');

  const reviews = row.provenanceEvidence?.freshScopeReviews;
  assert(reviews?.r1?.reviewerIdentity?.role === 'archive_r1' && reviews?.r2?.reviewerIdentity?.role === 'archive_r2', 'R1_ITEM_RECOVERY_FRESH_R1_R2_REVIEWS_REQUIRED');
  assert(reviews.r1.reviewerIdentity.reviewerId && reviews.r2.reviewerIdentity.reviewerId && reviews.r1.reviewerIdentity.reviewerId !== reviews.r2.reviewerIdentity.reviewerId, 'R1_ITEM_RECOVERY_REVIEWER_IDENTITY_REQUIRED');
  assert(Array.isArray(reviews.r1.scopeQids) && reviews.r1.scopeQids.length === 1 && Number(reviews.r1.scopeQids[0]) === 18 && Array.isArray(reviews.r2.scopeQids) && reviews.r2.scopeQids.length === 1 && Number(reviews.r2.scopeQids[0]) === 18, 'R1_ITEM_RECOVERY_FRESH_SCOPE_Q18_REQUIRED');
  const r1ReceiptPath = `${evidenceRoot}/R1.q18fresh.scoped-review-receipt.json`, r2ReceiptPath = `${evidenceRoot}/R2.q18fresh.scoped-comparison-receipt.json`;
  readProofRef(reviews.r1, r1ReceiptPath, 'R1_ITEM_RECOVERY_FRESH_R1_RECEIPT');
  readProofRef(reviews.r2, r2ReceiptPath, 'R1_ITEM_RECOVERY_FRESH_R2_RECEIPT');
  const r1Axes = reviews.r1.fourAxisReview;
  assert(r1Axes?.QUESTION_LAYOUT?.verdict === 'PASS' && r1Axes?.SOLUTION_LAYOUT?.verdict === 'PASS' && r1Axes?.META?.verdict === 'PASS' && ['PASS', 'VISUAL_EXEMPT'].includes(r1Axes?.VISUAL_SVG?.verdict), 'R1_ITEM_RECOVERY_FRESH_R1_AXES_PASS_REQUIRED');
  assert(reviews.r2.comparison?.qid === 18 && reviews.r2.comparison.disposition === 'MATCH', 'R1_ITEM_RECOVERY_FRESH_R2_MATCH_REQUIRED');
  return true;
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

function hasAcceptedMetaDisposition(row, question) {
  const values = metaProofValues(row);
  if (values.some(value => acceptedMetaPassValues.has(value) || value === 'REVIEWED_CURRENT_META_DISPOSITION')) return true;
  const axis = row?.axisEvidence?.META ?? row?.axisEvidence?.meta;
  if (axis?.status !== 'PASS_WITH_META_ONLY_DEBT') return false;
  const debtFields = axis.nullDebt?.fields;
  const rowDebtFields = row?.metaDebtFields;
  const exactTemplateDebt = Array.isArray(debtFields) && debtFields.length === 1 && debtFields[0] === 'templateKey'
    && Array.isArray(rowDebtFields) && rowDebtFields.length === 1 && rowDebtFields[0] === 'templateKey'
    && typeof axis.nullDebt?.reason === 'string' && axis.nullDebt.reason.trim().length > 0
    && row.metaDebtReason === axis.nullDebt.reason
    && axis.projectionStatus === 'TEMPLATE_UNMATERIALIZED'
    && question && hasOwn(question, 'templateKey') && question.templateKey === null;
  return exactTemplateDebt;
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
  assert(validation.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006' && validation.executionLine === 'CODEX'
    && validation.artifactContract?.active === true && validation.artifactContract.disposition === 'PASS'
    && validation.artifactContract.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'
    && validation.artifactContract.questionCount === bank.length && Array.isArray(validation.artifactContract.issues) && validation.artifactContract.issues.length === 0,
  'R1_VALIDATED_CURRENT_ARTIFACT_PASS_REQUIRED');
  assert(validation.artifactSha === evidence.artifactSha && validation.artifactSha === assignment.validatorRawBufferBlobSha1, 'R1_VALIDATION_ARTIFACT_SHA_MISMATCH');
  assert(validation.denominator === bank.length && validation.rowCount === bank.length && Array.isArray(validation.issues) && validation.issues.length === 0, 'R1_VALIDATION_DENOMINATOR_OR_ISSUES');
  const expectedEvidenceRef = path.resolve(rootReal, relative).replace(/\\/g, '/');
  const actualEvidenceRef = typeof validation.evidenceRef === 'string' ? path.resolve(validation.evidenceRef).replace(/\\/g, '/') : '';
  const authorizedEvidenceRef = typeof assignment.r1EvidenceReferencePath === 'string' ? path.resolve(assignment.r1EvidenceReferencePath).replace(/\\/g, '/') : '';
  assert(actualEvidenceRef === expectedEvidenceRef || (authorizedEvidenceRef && actualEvidenceRef === authorizedEvidenceRef), 'R1_VALIDATION_EVIDENCE_REF_MISMATCH');
  const expectedQids = bank.map((_, index) => index + 1);
  const shared = validateR1Evidence({ examUid, artifactSha: evidence.artifactSha, actualArtifactSha: assignment.validatorRawBufferBlobSha1, evidenceRef: validation.evidenceRef, evidence, expectedQids });
  assert(shared.ok && shared.disposition === 'PASS', 'R1_SHARED_VALIDATOR_REJECTED');
  let admission = null;
  if (assignment.r1MetaCoreDebtAdmissionPath !== undefined || assignment.r1MetaCoreDebtAdmissionSha256 !== undefined) {
    assert(nonempty(assignment.r1MetaCoreDebtAdmissionPath) && /^[a-f0-9]{64}$/.test(assignment.r1MetaCoreDebtAdmissionSha256 || ''), 'R1_META_CORE_ADMISSION_ASSIGNMENT_BINDING_REQUIRED');
    const admissionCandidate = path.resolve(rootReal, assignment.r1MetaCoreDebtAdmissionPath);
    assert(isWithin(rootReal, admissionCandidate), 'R1_META_CORE_ADMISSION_PATH_OUTSIDE_ROOT');
    const admissionReal = fs.realpathSync(admissionCandidate);
    assert(isWithin(rootReal, admissionReal), 'R1_META_CORE_ADMISSION_SYMLINK_OUTSIDE_ROOT');
    const admissionBytes = fs.readFileSync(admissionReal);
    assert(sha256(admissionBytes) === assignment.r1MetaCoreDebtAdmissionSha256, 'R1_META_CORE_ADMISSION_ASSIGNMENT_SHA256_MISMATCH');
    try { admission = JSON.parse(admissionBytes.toString('utf8').replace(/^\uFEFF/, '')); }
    catch { throw new Error('R1_META_CORE_ADMISSION_JSON_INVALID'); }
  }
  const metaDebtRows = verifyR1MetaProof(evidence, assignment, examUid, bank, rootReal, admission);
  return { relative, evidenceSha256, evidence, validationRelative, validationSha256, validation, metaDebtRows, metaDebtAdmission: admission ? { path: assignment.r1MetaCoreDebtAdmissionPath, sha256: assignment.r1MetaCoreDebtAdmissionSha256 } : null };
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
  const r1MetaDebtRows = r1EvidenceBinding.metaDebtRows || [];
  const authorityBindingPendingAdmission = authorizedRow.r1MetaBindingPendingAdmission;
  const rosterBindingPendingAdmission = rosterRow.r1MetaBindingPendingAdmission;
  const isBoundMetaBindingTarget = hasOwn(META_BINDING_PENDING_SCOPES, authorizedRow.examUid);
  const hasBindingPendingR1Rows = isBoundMetaBindingTarget && r1Evidence.rows.some(row => {
    const meta = row?.axisEvidence?.META;
    const projectionStatus = meta?.projectionStatus ?? meta?.currentFields?.projectionStatus ?? meta?.currentMeta?.projectionStatus;
    return (typeof meta?.status === 'string' && meta.status.includes('BINDING_PENDING'))
      || (typeof projectionStatus === 'string' && projectionStatus.includes('BINDING_PENDING'));
  });
  const r1MetaBindingPendingRows = hasBindingPendingR1Rows
    || authorityBindingPendingAdmission !== undefined
    || rosterBindingPendingAdmission !== undefined
    ? verifyBoundR1MetaBindingPendingAdmission({
      authorityAdmission: authorityBindingPendingAdmission,
      rosterAdmission: rosterBindingPendingAdmission,
      assignment,
      examUid: authorizedRow.examUid,
      sourceRawSha256,
      sourceGitBlobSha1: sourceBlobSha1,
      r1EvidenceBinding,
      bank,
    })
    : [];
  const authorityLegacyAlias = authorizedRow.legacyDisplayAliasAdmission;
  const rosterLegacyAlias = rosterRow.legacyDisplayAliasAdmission;
  const verifiedLegacyDisplayAlias = authorityLegacyAlias !== undefined || rosterLegacyAlias !== undefined
    ? verifyBoundLegacyDisplayAliasAdmission({
      root,
      authorityAdmission: authorityLegacyAlias,
      rosterAdmission: rosterLegacyAlias,
      authorizedRow,
      rosterRow,
      assignment,
      examUid: authorizedRow.examUid,
      productionRelativePath: authorizedRow.productionPath,
      grade: authorizedRow.grade,
      course: authorizedRow.course,
      sourceBytes,
      bank,
    })
    : null;
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

  const display = parseAuthorizedDisplayIdentity({ examUid: authorizedRow.examUid, productionRelativePath: authorizedRow.productionPath, grade: authorizedRow.grade, course: authorizedRow.course, verifiedLegacyDisplayAlias });
  const targetDbRow = buildAuthorizedDbRow({ examUid: authorizedRow.examUid, productionRelativePath: authorizedRow.productionPath, grade: authorizedRow.grade, course: authorizedRow.course, bank, verifiedLegacyDisplayAlias });
  const targetMetadataRows = makeTargetMetadataRows({ sourceFile: targetFile, bank, identityRows, r1EvidencePath: r1EvidenceRelative, r1MetaDebtRows, r1MetaBindingPendingRows });
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
    r1MetaProof: serializeR1MetaProofSummary(r1EvidenceBinding, r1Evidence),
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
