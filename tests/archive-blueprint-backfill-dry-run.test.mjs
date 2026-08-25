import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'archive/tools/intelligence/dry-run-archive-blueprint-backfill.mjs');
const dbSql = path.join(root, 'reports/backups/ap-math-os_before_schedule_series_20260622_220845.sql');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-blueprint-dry-run-'));
const out = path.join(tempRoot, 'report.json');

try {
  const stdout = execFileSync(process.execPath, [tool, '--db-sql', dbSql, '--out', out, '--limit', '10'], {
    cwd: root,
    encoding: 'utf8'
  });
  const result = JSON.parse(stdout);
  const report = JSON.parse(fs.readFileSync(out, 'utf8'));

  assert.equal(report.readOnly, true, 'dry-run report must be explicitly read-only');
  assert.equal(report.status, 'BLOCKED_SCHEMA_MISSING', 'stale export must not be treated as production-ready');
  assert.equal(report.source.schemaReady, false, 'pre-Phase 2A export must be marked schema-incomplete');
  assert(report.summary.dbRows > 0, 'dry-run must parse existing blueprint rows');
  assert(report.summary.files > 0, 'dry-run must group blueprint rows by archive file');
  assert.equal(typeof report.summary.unmatchedDbRows, 'number', 'dry-run must expose unmatched legacy blueprint rows');
  assert.equal(result.status, report.status, 'CLI summary must match report status');
  assert(report.fileSummaries.some(file => file.status === 'MIXED_NO_ARCHIVE_SOURCE'), 'MIXED rows must be kept outside archive-source comparison');
  assert(report.questionDiffs.length <= 10, 'question diff limit must be enforced');

  const sourceArchive = 'exams/types/middle/m1/중1_1단원_소인수분해.js';
  const sourceText = fs.readFileSync(path.join(root, 'archive', sourceArchive), 'utf8');
  const sourceWindow = { questionBank: null, __questionBank: null };
  const sourceDocument = { createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, innerHTML: '' }), head: { appendChild() {} }, body: { appendChild() {} }, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] };
  const sourceBank = new Function('window', 'document', `${sourceText}\n;return window.questionBank;`)(sourceWindow, sourceDocument);
  const question = sourceBank[0];
  const metadata = {
    standardUnitKey: question.standardUnitKey,
    standardUnit: question.standardUnit,
    standardCourse: question.standardCourse,
    subUnitKey: question.subUnitKey,
    conceptClusterKey: question.conceptClusterKey,
    typeKey: question.problemTypeKey || question.typeKey || null,
    templateKey: question.templateKey || null,
    difficulty: question.difficultyBucket || question.difficulty || question.level,
    tags: Array.isArray(question.tags) ? question.tags : [],
    metadataRevision: 'archive-metadata-v1'
  };
  const expectedHash = (await import('node:crypto')).createHash('sha256').update(JSON.stringify(metadata)).digest('hex');
  const sqlValue = value => value === null || value === undefined ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`;
  const fixtureColumns = ['archive_file', 'question_no', 'source_archive_file', 'source_question_no', 'source_question_uid', 'source_question_ordinal', 'standard_unit_key', 'standard_unit', 'standard_course', 'concept_cluster_key', 'sub_unit_key', 'type_key', 'template_key', 'difficulty', 'metadata_revision', 'metadata_hash'];
  const fixtureSourceFile = sourceArchive.replace(/^exams\//, '');
  const fixtureUid = `qid_v1_${(await import('node:crypto')).createHash('sha256').update(`${fixtureSourceFile}#1`).digest('hex')}`;
  const fixtureValues = [sourceArchive, 1, sourceArchive, 1, fixtureUid, 1, metadata.standardUnitKey, metadata.standardUnit, metadata.standardCourse, metadata.conceptClusterKey, metadata.subUnitKey, metadata.typeKey, metadata.templateKey, metadata.difficulty, metadata.metadataRevision, expectedHash];
  const fixtureSql = `INSERT INTO "exam_blueprints" (${fixtureColumns.map(column => `"${column}"`).join(',')}) VALUES(${fixtureValues.map(sqlValue).join(',')});\n`;
  const fixtureDb = path.join(tempRoot, 'ready.sql');
  const fixtureOut = path.join(tempRoot, 'ready-report.json');
  fs.writeFileSync(fixtureDb, fixtureSql, 'utf8');
  execFileSync(process.execPath, [tool, '--db-sql', fixtureDb, '--out', fixtureOut], { cwd: root, encoding: 'utf8' });
  const readyReport = JSON.parse(fs.readFileSync(fixtureOut, 'utf8'));
  assert.equal(readyReport.status, 'READY_FOR_SAMPLE_REVIEW', 'Phase 2A-shaped export must reach ready dry-run status');
  assert.equal(readyReport.summary.unchanged, 1, 'matching revision/hash must be unchanged');
  assert.equal(readyReport.summary.updateRequired, 0, 'matching revision/hash must not require update');
  const fixtureSqlOut = path.join(tempRoot, 'backfill-plan.sql');
  execFileSync(process.execPath, [tool, '--db-sql', fixtureDb, '--out', fixtureOut, '--sql-out', fixtureSqlOut], { cwd: root, encoding: 'utf8' });
  const readySqlReport = JSON.parse(fs.readFileSync(fixtureOut, 'utf8'));
  assert.equal(readySqlReport.sqlPlan.requested, true, 'SQL plan request must be recorded');
  assert(readySqlReport.sqlPlan.statements > 0, 'missing source rows must emit insert SQL for backfill');
  assert(fs.readFileSync(fixtureSqlOut, 'utf8').includes('review only; not executed'), 'SQL plan must be explicitly review-only');

  const changedDb = path.join(tempRoot, 'changed.sql');
  const changedOut = path.join(tempRoot, 'changed-report.json');
  const changedSqlOut = path.join(tempRoot, 'changed-plan.sql');
  fs.writeFileSync(changedDb, fixtureSql.replace(expectedHash, 'stale-hash'), 'utf8');
  execFileSync(process.execPath, [tool, '--db-sql', changedDb, '--out', changedOut, '--sql-out', changedSqlOut], { cwd: root, encoding: 'utf8' });
  const changedReport = JSON.parse(fs.readFileSync(changedOut, 'utf8'));
  assert.equal(changedReport.summary.updateRequired, 1, 'changed hash must require one update');
  assert.equal(changedReport.sqlPlan.statements, readySqlReport.sqlPlan.statements + 1, 'changed hash must add one deterministic update to the insert plan');
  assert(fs.readFileSync(changedSqlOut, 'utf8').includes('ON CONFLICT(archive_file, question_no) DO UPDATE SET'), 'SQL plan must use deterministic blueprint upsert');

  let staleSqlRejected = false;
  try {
    execFileSync(process.execPath, [tool, '--db-sql', dbSql, '--sql-out', path.join(tempRoot, 'stale.sql')], { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    staleSqlRejected = error.status === 3;
  }
  assert.equal(staleSqlRejected, true, 'stale schema must reject SQL plan generation');
  console.log('archive blueprint backfill dry-run checks passed');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
