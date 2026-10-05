#!/usr/bin/env node

/**
 * Audit questionType preservation between original exam JS and question-index.
 *
 * The audit is deliberately read-only with respect to exam JS files. A blank
 * source value (including a missing property) is preserved as blank; this
 * tool never infers a type from choices, tags, or answer shape.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.resolve(HERE, '..');
const ORIGINAL_ROOT = path.join(ARCHIVE_ROOT, 'exams', 'original');
const INDEX_PATH = path.join(ARCHIVE_ROOT, 'question-index.js');
const OUTPUT_PATH = path.join(ARCHIVE_ROOT, 'data', 'question-type-coverage-audit.json');

export const SCHEMA_VERSION = 'question-type-coverage-audit.v1';

function listJsFiles(root) {
  const result = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.js')) result.push(full);
    }
  };
  walk(root);
  return result.sort((a, b) => a.localeCompare(b, 'en'));
}

function sourceRelative(filePath) {
  return path.relative(path.join(ARCHIVE_ROOT, 'exams'), filePath).split(path.sep).join('/');
}

function runArchiveScript(filePath) {
  const context = {
    window: {},
    console: { log() {}, warn() {}, error() {} },
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  return context;
}

function loadQuestions(filePath) {
  const context = runArchiveScript(filePath);
  const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
  if (!Array.isArray(questions)) throw new Error('questions array not found');
  return questions;
}

function loadIndex() {
  const source = fs.readFileSync(INDEX_PATH, 'utf8');
  const start = source.indexOf('[', source.indexOf('window.questionIndex='));
  const end = source.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('question-index array not found');
  return JSON.parse(source.slice(start, end + 1));
}

function indexKey(sourceFile, sourceOrdinal) {
  return `${sourceFile}#${sourceOrdinal}`;
}

function emptyBucket() {
  return { total: 0, nonblank: 0, blank: 0, missingProperty: 0 };
}

export function auditQuestionTypeCoverage({ files = listJsFiles(ORIGINAL_ROOT), indexRecords = loadIndex() } = {}) {
  const indexBySource = new Map(
    indexRecords
      .filter(record => String(record.sourceFile || '').startsWith('original/'))
      .map(record => [indexKey(record.sourceFile, record.sourceOrdinal), record])
  );
  const source = {
    root: 'archive/exams/original',
    fileCount: files.length,
    questionCount: 0,
    explicitPropertyCount: 0,
    nonblankCount: 0,
    blankCount: 0,
    missingPropertyCount: 0,
    filesWithoutProperty: [],
  };
  const mismatches = [];
  const missingIndexRecords = [];
  const byFile = [];

  for (const filePath of files) {
    const sourceFile = sourceRelative(filePath);
    const questions = loadQuestions(filePath);
    const stats = emptyBucket();
    for (let i = 0; i < questions.length; i += 1) {
      const question = questions[i];
      const hasProperty = Boolean(question && Object.prototype.hasOwnProperty.call(question, 'questionType'));
      const value = String(question?.questionType || '').trim();
      stats.total += 1;
      source.questionCount += 1;
      if (hasProperty) source.explicitPropertyCount += 1;
      else { stats.missingProperty += 1; source.missingPropertyCount += 1; }
      if (value) { stats.nonblank += 1; source.nonblankCount += 1; }
      else { stats.blank += 1; source.blankCount += 1; }

      const record = indexBySource.get(indexKey(sourceFile, i + 1));
      if (!record) {
        missingIndexRecords.push({ sourceFile, sourceOrdinal: i + 1 });
      } else if (String(record.questionType || '').trim() !== value) {
        mismatches.push({
          sourceFile,
          sourceOrdinal: i + 1,
          sourceValue: value,
          indexValue: String(record.questionType || '').trim(),
        });
      }
    }
    if (stats.missingProperty) source.filesWithoutProperty.push({ sourceFile, questionCount: stats.total, missingPropertyCount: stats.missingProperty });
    byFile.push({ sourceFile, ...stats });
  }

  source.filesWithoutProperty.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile, 'en'));
  byFile.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile, 'en'));
  const indexOriginal = indexRecords.filter(record => String(record.sourceFile || '').startsWith('original/'));
  const index = {
    totalRecordCount: indexRecords.length,
    originalRecordCount: indexOriginal.length,
    originalNonblankCount: indexOriginal.filter(record => String(record.questionType || '').trim()).length,
    originalBlankCount: indexOriginal.filter(record => !String(record.questionType || '').trim()).length,
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    source,
    index,
    comparison: {
      missingIndexRecordCount: missingIndexRecords.length,
      questionTypeMismatchCount: mismatches.length,
      originalCountMatches: source.questionCount === index.originalRecordCount,
      exactValueMatch: mismatches.length === 0 && missingIndexRecords.length === 0,
    },
    blankPolicy: 'preserve_source_blank',
    files: byFile,
    mismatches,
    missingIndexRecords,
  };
}

export function writeAudit(outputPath = OUTPUT_PATH) {
  const audit = auditQuestionTypeCoverage();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
  return audit;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const audit = writeAudit();
  console.log(`questionType coverage audit: source ${audit.source.questionCount}, index original ${audit.index.originalRecordCount}, mismatches ${audit.comparison.questionTypeMismatchCount}, missing index ${audit.comparison.missingIndexRecordCount}`);
  console.log(`files without questionType property: ${audit.source.filesWithoutProperty.length}`);
}
