import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3');
const outputPath = path.join(outputDir, 'archive-db-archive-consistency-v1.json');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function loadWindow(filePath) {
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { timeout: 10000, filename: filePath });
  return context.window;
}

function normalize(value) {
  return String(value || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '').replace(/^\.\//, '').trim();
}

function listTrackedExamFiles() {
  return execFileSync('git', ['-C', repoRoot, 'ls-files', '-z', '--', 'archive/exams/*.js'], { maxBuffer: 64 * 1024 * 1024 })
    .toString('utf8')
    .split(/\0|\r?\n/)
    .map(normalize)
    .filter(Boolean)
    .map(file => normalize(file));
}

function scopeOf(file) {
  if (file.startsWith('original/')) return 'original';
  if (file.startsWith('types/')) return 'types';
  if (file.startsWith('similar/')) return 'similar';
  return 'other';
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item) || '(empty)';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function requiredFields(record) {
  return ['file', 'school', 'grade', 'year', 'semester', 'examType', 'subject', 'contentType', 'qCount']
    .filter(key => record[key] === undefined || record[key] === null || String(record[key]).trim() === '');
}

export function auditDbArchiveConsistencyV1() {
  const db = loadWindow(path.join(archiveDir, 'db.js')).mainDB?.exams || [];
  const index = loadWindow(path.join(archiveDir, 'question-index.js')).questionIndex || [];
  const indexCounts = new Map();
  for (const record of index) indexCounts.set(normalize(record.sourceFile), (indexCounts.get(normalize(record.sourceFile)) || 0) + 1);
  const seenFiles = new Set();
  const report = {
    schemaVersion: 'archive-db-archive-consistency-v1',
    scope: 'read_only_db_js_vs_production_js_vs_question_index',
    writes: { db: false, productionJs: false, questionIndex: false, commit: false, push: false },
    totals: { dbRecords: db.length, indexRecords: index.length },
    trackedExamFiles: { count: 0, notInDb: [] },
    duplicateDbFiles: [],
    missingFiles: [],
    emptySchool: [],
    requiredFieldGaps: [],
    qCountMismatch: [],
    indexCountMismatch: [],
    byScope: {},
    gates: {}
  };
  const perRecord = [];
  for (const record of db) {
    const file = normalize(record.file);
    const scope = scopeOf(file);
    if (seenFiles.has(file)) report.duplicateDbFiles.push(file);
    seenFiles.add(file);
    const fullPath = path.join(archiveDir, 'exams', ...file.split('/'));
    const fields = requiredFields(record);
    if (fields.length) report.requiredFieldGaps.push({ file, scope, fields });
    if (!String(record.school || '').trim()) report.emptySchool.push({ file, scope });
    if (!fs.existsSync(fullPath)) {
      report.missingFiles.push({ file, scope });
      continue;
    }
    let questions = [];
    let loadError = '';
    try {
      questions = loadWindow(fullPath).questionBank || [];
    } catch (error) {
      loadError = error?.message || String(error);
    }
    if (loadError) {
      report.qCountMismatch.push({ file, scope, db: Number(record.qCount), js: null, error: loadError });
      continue;
    }
    if (questions.length !== Number(record.qCount)) report.qCountMismatch.push({ file, scope, db: Number(record.qCount), js: questions.length });
    const indexed = indexCounts.get(file) || 0;
    if (indexed !== questions.length) report.indexCountMismatch.push({ file, scope, js: questions.length, index: indexed });
    perRecord.push({ file, scope, questionCount: questions.length, requiredFieldGapCount: fields.length, emptySchool: !String(record.school || '').trim(), qCountMatches: questions.length === Number(record.qCount), indexCountMatches: indexed === questions.length });
  }
  const tracked = listTrackedExamFiles();
  const dbFiles = new Set(db.map(record => normalize(record.file)));
  report.trackedExamFiles = { count: tracked.length, notInDb: tracked.filter(file => !dbFiles.has(file)).map(file => ({ file, scope: scopeOf(file) })) };
  report.byScope = Object.fromEntries(['original', 'types', 'similar', 'other'].map(scope => {
    const rows = perRecord.filter(item => item.scope === scope);
    return [scope, {
      dbRecords: rows.length,
      emptySchool: rows.filter(item => item.emptySchool).length,
      requiredFieldGapRecords: rows.filter(item => item.requiredFieldGapCount > 0).length,
      qCountMismatch: rows.filter(item => !item.qCountMatches).length,
      indexCountMismatch: rows.filter(item => !item.indexCountMatches).length
    }];
  }));
  report.totals = {
    ...report.totals,
    trackedExamFiles: tracked.length,
    dbFilesNotTracked: report.trackedExamFiles.notInDb.length,
    missingFiles: report.missingFiles.length,
    duplicateDbFiles: report.duplicateDbFiles.length,
    emptySchool: report.emptySchool.length,
    requiredFieldGapRecords: report.requiredFieldGaps.length,
    qCountMismatch: report.qCountMismatch.length,
    indexCountMismatch: report.indexCountMismatch.length
  };
  report.gates = {
    allDbFilesExist: report.missingFiles.length === 0,
    noDuplicateDbFiles: report.duplicateDbFiles.length === 0,
    allDbRequiredFieldsPresent: report.requiredFieldGaps.length === 0,
    allDbSchoolsPresent: report.emptySchool.length === 0,
    allDbCountsMatchProduction: report.qCountMismatch.length === 0,
    allIndexCountsMatchProduction: report.indexCountMismatch.length === 0,
    reportOnlyNoWrites: true
  };
  const stable = { ...report };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = auditDbArchiveConsistencyV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
}
