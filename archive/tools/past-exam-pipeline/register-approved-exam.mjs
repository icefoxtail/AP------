import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import {
  bytesSha,
  canonicalJson,
  objectSha,
} from '../pipeline-core/canonical.mjs';
import {
  assertRegistrationWriteScope,
  assertSha,
} from './lib/production-boundary.mjs';
import { assertExternalApproval } from './lib/release-authority.mjs';

export const REGISTER_APPROVED_EXAM_VERSION = 'APMATH_REGISTER_APPROVED_EXAM_v1';
export const INDEX_REBUILD_VERSION = 'APMATH_APPROVED_INDEX_REBUILD_v1';

function normalizeExamFile(value) {
  return String(value || '')
    .replaceAll('\\', '/')
    .replace(/^archive\/exams\//, '')
    .replace(/^exams\//, '')
    .replace(/^\/+/, '');
}

function absolute(root, value) {
  return path.isAbsolute(String(value || '')) ? path.resolve(value) : path.resolve(root, value);
}

function repoRelative(root, value) {
  return path.relative(path.resolve(root), absolute(root, value)).split(path.sep).join('/');
}

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

function loadWindow(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 3000 });
  return JSON.parse(JSON.stringify(context.window));
}

export function readArchiveDb(file) {
  const data = loadWindow(file);
  if (!Array.isArray(data.mainDB?.exams)) throw new Error('DB_EXAMS_ARRAY_REQUIRED');
  return data;
}

export function readQuestionIndex(file) {
  const data = loadWindow(file);
  if (!Array.isArray(data.questionIndex)) throw new Error('QUESTION_INDEX_ARRAY_REQUIRED');
  return data.questionIndex;
}

function keyedEntries(entries, label) {
  const map = new Map();
  for (const entry of entries || []) {
    const key = normalizeExamFile(entry?.file);
    if (!key) throw new Error(label + '_ENTRY_FILE_REQUIRED');
    if (map.has(key)) throw new Error(label + '_DUPLICATE_ENTRY:' + key);
    map.set(key, entry);
  }
  return map;
}

export function dbSemanticDelta(beforeEntries = [], afterEntries = [], targetFile) {
  const target = normalizeExamFile(targetFile);
  if (!target) throw new Error('DB_TARGET_FILE_REQUIRED');
  const before = keyedEntries(beforeEntries, 'DB_BEFORE');
  const after = keyedEntries(afterEntries, 'DB_AFTER');
  const changedFiles = [...new Set([...before.keys(), ...after.keys()])]
    .filter(file => canonicalJson(before.get(file) ?? null) !== canonicalJson(after.get(file) ?? null))
    .sort();
  const unexpectedFiles = changedFiles.filter(file => file !== target);
  return {
    schemaVersion: 'APMATH_DB_SEMANTIC_DELTA_v1',
    status: unexpectedFiles.length ? 'FAIL' : 'PASS',
    targetFile: target,
    changedFiles,
    unexpectedFiles,
    targetChanged: changedFiles.includes(target),
    deltaCount: changedFiles.length,
    deltaSha: objectSha(changedFiles.map(file => ({ file, before: before.get(file) ?? null, after: after.get(file) ?? null }))),
  };
}

export function assertTargetOnlyDbDelta(beforeEntries, afterEntries, targetFile) {
  const result = dbSemanticDelta(beforeEntries, afterEntries, targetFile);
  if (result.status !== 'PASS') throw new Error('UNEXPECTED_DB_SCOPE_DELTA:' + result.unexpectedFiles.join(','));
  return result;
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.map(item => String(item || '').trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/[,\s]+/).map(item => item.trim()).filter(Boolean);
  return [];
}

function normalizeYear(value) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 0) return null;
  return year < 100 ? 2000 + year : year;
}

function visualFlags(question) {
  const content = String(question?.content || '');
  return Boolean(question?.image || /<img\b|<svg\b|<table\b/i.test(content));
}

export function loadProductionBank(root, targetFile) {
  const archive = path.resolve(root, 'archive');
  const examFile = absolute(archive, path.join('exams', targetFile));
  if (!inside(path.resolve(archive, 'exams'), examFile)) throw new Error('TARGET_EXAM_PATH_INVALID');
  if (!fs.existsSync(examFile)) throw new Error('TARGET_EXAM_FILE_MISSING');
  const data = loadWindow(examFile);
  if (!Array.isArray(data.questionBank) || !data.questionBank.length) throw new Error('TARGET_EXAM_QUESTION_BANK_REQUIRED');
  return { file: examFile, bank: data.questionBank, questionCount: data.questionBank.length, examTitle: data.examTitle };
}

export function buildTargetIndexRows(root, targetFile, dbEntry) {
  const target = normalizeExamFile(targetFile);
  const production = loadProductionBank(root, target);
  const rows = production.bank.map((question, ordinal) => {
    const id = question.id;
    const tags = normalizeTags(question.tags);
    return {
      qKey: target + '_' + id,
      sourceFile: target,
      sourceOrdinal: ordinal + 1,
      grade: String(dbEntry?.grade || '').trim(),
      subject: String(dbEntry?.subject || '').trim(),
      school: String(dbEntry?.school || '').trim(),
      schoolKey: String(dbEntry?.school || '').normalize('NFKC').trim().replace(/\s+/g, '').toLocaleLowerCase(),
      examYear: normalizeYear(dbEntry?.year),
      semester: String(dbEntry?.semester || '').trim(),
      examType: String(dbEntry?.examType || '').trim(),
      sourceExamKey: target,
      id,
      standardUnit: String(question.standardUnit || '').trim(),
      standardUnitKey: String(question.standardUnitKey || '').trim(),
      subUnitKey: String(question.subUnitKey || '').trim(),
      subUnit: String(question.subUnit || '').trim(),
      subUnitConfidence: String(question.subUnitConfidence || '').trim(),
      subUnitClassificationDepth: String(question.subUnitClassificationDepth || '').trim(),
      course: String(question.standardCourse || dbEntry?.primaryStandardCourse || '').trim(),
      level: String(question.level || '').trim(),
      questionType: String(question.questionType || '').trim(),
      tags,
      hasImage: visualFlags(question),
      hasSolutionImage: Boolean(question.solutionImage),
      contentText: stripHtml(question.content),
      choicesText: stripHtml((Array.isArray(question.choices) ? question.choices : []).map(choice => String(choice || '')).join(' ')),
    };
  });
  return { rows, questionCount: production.bank.length, examTitle: production.examTitle };
}

function indexByKey(rows, label) {
  const map = new Map();
  for (const row of rows || []) {
    if (!row?.qKey) throw new Error(label + '_QKEY_REQUIRED');
    if (map.has(row.qKey)) throw new Error(label + '_DUPLICATE_QKEY:' + row.qKey);
    map.set(row.qKey, row);
  }
  return map;
}

export function indexSemanticDelta(beforeRows = [], afterRows = [], targetFile) {
  const target = normalizeExamFile(targetFile);
  const before = indexByKey(beforeRows, 'INDEX_BEFORE');
  const after = indexByKey(afterRows, 'INDEX_AFTER');
  const changedKeys = [...new Set([...before.keys(), ...after.keys()])]
    .filter(key => canonicalJson(before.get(key) ?? null) !== canonicalJson(after.get(key) ?? null))
    .sort();
  const unexpectedKeys = changedKeys.filter(key => normalizeExamFile(before.get(key)?.sourceFile || after.get(key)?.sourceFile) !== target);
  const changedFiles = [...new Set(changedKeys.map(key => normalizeExamFile(before.get(key)?.sourceFile || after.get(key)?.sourceFile)))].sort();
  return {
    schemaVersion: 'APMATH_INDEX_SEMANTIC_DELTA_v1',
    status: unexpectedKeys.length ? 'FAIL' : 'PASS',
    targetFile: target,
    changedKeys,
    unexpectedKeys,
    changedFiles,
    deltaCount: changedKeys.length,
    deltaSha: objectSha(changedKeys.map(key => ({ key, before: before.get(key) ?? null, after: after.get(key) ?? null }))),
  };
}

export function assertTargetOnlyIndexDelta(beforeRows, afterRows, targetFile) {
  const result = indexSemanticDelta(beforeRows, afterRows, targetFile);
  if (result.status !== 'PASS') throw new Error('UNEXPECTED_INDEX_SCOPE_DELTA:' + result.unexpectedKeys.join(','));
  return result;
}

function atomicReplace(file, body) {
  const temp = file + '.release-' + randomUUID() + '.tmp';
  fs.writeFileSync(temp, body, 'utf8');
  try {
    fs.renameSync(temp, file);
  } catch (error) {
    try { if (fs.existsSync(temp)) fs.unlinkSync(temp); } catch {}
    throw error;
  }
}

function serializeDb(data) {
  return 'window.mainDB = ' + JSON.stringify(data.mainDB, null, 2) + ';\n';
}

function serializeIndex(rows) {
  return '// Generated by register-approved-exam.mjs\nwindow.questionIndex=' + JSON.stringify(rows) + ';\n';
}

export function registerApprovedExam({
  root,
  examId,
  targetFile,
  dbEntry,
  dbPath = 'archive/db.js',
  expectedDbSha256,
  reviewReady,
  approval,
  promotion,
  write = true,
} = {}) {
  if (!root || !examId || !targetFile || !dbEntry) throw new Error('REGISTER_APPROVED_EXAM_INPUT_REQUIRED');
  if (!reviewReady || !approval || promotion?.status !== 'PROMOTED') throw new Error('REGISTER_BEFORE_PROMOTION_FORBIDDEN');
  assertExternalApproval({ root, reviewReady, approval, candidateRef: reviewReady.candidateRef, assetRefs: reviewReady.assetRefs });
  if (promotion.examId !== examId || promotion.candidateSha256 !== reviewReady.candidateSha256) throw new Error('PROMOTION_PARITY_REQUIRED');
  const target = normalizeExamFile(targetFile);
  if (normalizeExamFile(dbEntry.file) !== target) throw new Error('DB_TARGET_FILE_MISMATCH');
  if (dbEntry.examId && dbEntry.examId !== examId) throw new Error('DB_TARGET_EXAM_ID_MISMATCH');
  assertSha(expectedDbSha256, 'DB_BASELINE_SHA_REQUIRED');
  if (approval.dbBaselineSha256 !== expectedDbSha256) throw new Error('APPROVAL_DB_BASELINE_SHA_MISMATCH');
  const file = absolute(root, dbPath);
  if (repoRelative(root, dbPath) !== 'archive/db.js') throw new Error('DB_WRITE_ALLOWLIST_TARGET_INVALID');
  const beforeBytes = fs.readFileSync(file);
  if (bytesSha(beforeBytes) !== expectedDbSha256) throw new Error('DB_BASELINE_CHANGED');
  const before = readArchiveDb(file);
  const production = loadProductionBank(root, target);
  if (Number(dbEntry.qCount) !== production.bank.length) throw new Error('DB_TARGET_QCOUNT_MISMATCH');
  const currentEntries = before.mainDB.exams;
  const existing = currentEntries.findIndex(entry => normalizeExamFile(entry.file) === target);
  const afterEntries = [...currentEntries];
  if (existing >= 0) afterEntries[existing] = structuredClone(dbEntry);
  else afterEntries.push(structuredClone(dbEntry));
  const delta = assertTargetOnlyDbDelta(currentEntries, afterEntries, target);
  assertRegistrationWriteScope(root, [dbPath], { dbPath });
  const afterData = { ...before, mainDB: { ...before.mainDB, exams: afterEntries } };
  if (write && canonicalJson(before.mainDB.exams) !== canonicalJson(afterData.mainDB.exams)) atomicReplace(file, serializeDb(afterData));
  const afterBytes = fs.readFileSync(file);
  return {
    schemaVersion: REGISTER_APPROVED_EXAM_VERSION,
    status: 'PASS',
    phase: 'REGISTER_APPROVED_EXAM',
    examId,
    targetFile: target,
    dbPath,
    reviewReadyRunId: reviewReady.reviewReadyRunId,
    approvalStatus: approval.approvalStatus,
    beforeSha256: bytesSha(beforeBytes),
    afterSha256: bytesSha(afterBytes),
    delta,
    changed: bytesSha(beforeBytes) !== bytesSha(afterBytes),
  };
}

export function rebuildApprovedIndex({
  root,
  examId,
  targetFile,
  dbEntry,
  indexPath = 'archive/question-index.js',
  expectedIndexSha256,
  registration,
  write = true,
} = {}) {
  if (!root || !examId || !targetFile || !dbEntry) throw new Error('INDEX_REBUILD_INPUT_REQUIRED');
  if (registration?.status !== 'PASS' || registration.phase !== 'REGISTER_APPROVED_EXAM' || registration.approvalStatus !== 'APPROVED' || !registration.reviewReadyRunId) throw new Error('INDEX_BEFORE_REGISTRATION_FORBIDDEN');
  const target = normalizeExamFile(targetFile);
  assertSha(expectedIndexSha256, 'INDEX_BASELINE_SHA_REQUIRED');
  const file = absolute(root, indexPath);
  if (repoRelative(root, indexPath) !== 'archive/question-index.js') throw new Error('INDEX_WRITE_ALLOWLIST_TARGET_INVALID');
  const beforeBytes = fs.readFileSync(file);
  if (bytesSha(beforeBytes) !== expectedIndexSha256) throw new Error('INDEX_BASELINE_CHANGED');
  const beforeRows = readQuestionIndex(file);
  const targetBuild = buildTargetIndexRows(root, target, dbEntry);
  const withoutTarget = beforeRows.filter(row => normalizeExamFile(row.sourceFile) !== target);
  const firstTarget = beforeRows.findIndex(row => normalizeExamFile(row.sourceFile) === target);
  const afterRows = firstTarget < 0
    ? [...withoutTarget, ...targetBuild.rows]
    : [
      ...beforeRows.slice(0, firstTarget).filter(row => normalizeExamFile(row.sourceFile) !== target),
      ...targetBuild.rows,
      ...beforeRows.slice(firstTarget + 1).filter(row => normalizeExamFile(row.sourceFile) !== target),
    ];
  const delta = assertTargetOnlyIndexDelta(beforeRows, afterRows, target);
  assertRegistrationWriteScope(root, [indexPath], { dbPath: indexPath, indexPath });
  if (write && canonicalJson(beforeRows) !== canonicalJson(afterRows)) atomicReplace(file, serializeIndex(afterRows));
  const afterBytes = fs.readFileSync(file);
  return {
    schemaVersion: INDEX_REBUILD_VERSION,
    status: 'PASS',
    phase: 'INDEX_REBUILD',
    examId,
    targetFile: target,
    indexPath,
    questionCount: targetBuild.questionCount,
    beforeSha256: bytesSha(beforeBytes),
    afterSha256: bytesSha(afterBytes),
    delta,
    changed: bytesSha(beforeBytes) !== bytesSha(afterBytes),
    targetRows: targetBuild.rows,
  };
}

export function loadTargetDbEntry(root, dbPath, targetFile) {
  const data = readArchiveDb(absolute(root, dbPath));
  const target = normalizeExamFile(targetFile);
  return data.mainDB.exams.find(entry => normalizeExamFile(entry.file) === target) || null;
}

export function loadTargetIndexRows(root, indexPath, targetFile) {
  const rows = readQuestionIndex(absolute(root, indexPath));
  const target = normalizeExamFile(targetFile);
  return rows.filter(row => normalizeExamFile(row.sourceFile) === target);
}

export { normalizeExamFile };

function cliArg(name, argv = process.argv) {
  const index = argv.indexOf(name);
  if (index < 0 || !argv[index + 1]) throw new Error(name + ' is required');
  return argv[index + 1];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = process.cwd();
    const entry = JSON.parse(fs.readFileSync(path.resolve(cliArg('--db-entry')), 'utf8'));
    const result = registerApprovedExam({
      root,
      examId: cliArg('--exam-id'),
      targetFile: cliArg('--target-file'),
      dbEntry: entry,
      dbPath: cliArg('--db-path'),
      expectedDbSha256: cliArg('--expected-db-sha256'),
      reviewReady: JSON.parse(fs.readFileSync(path.resolve(cliArg('--review-ready')), 'utf8')),
      approval: JSON.parse(fs.readFileSync(path.resolve(cliArg('--approval-receipt')), 'utf8')),
      promotion: JSON.parse(fs.readFileSync(path.resolve(cliArg('--promotion-result')), 'utf8')),
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(String(error.message || error));
    process.exitCode = 1;
  }
}
