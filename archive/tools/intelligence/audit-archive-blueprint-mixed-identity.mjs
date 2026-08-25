#!/usr/bin/env node

/**
 * Read-only audit for MIXED exam_blueprints source identity.
 * It resolves each stored source_archive_file/source_question_no against the
 * current archive JS and emits deterministic UID/ordinal/hash candidates.
 * It never connects to D1 and never writes SQL or production data.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_DB_SQL = path.join(ROOT, 'archive/_generated/intelligence/phase2/exam-blueprints-after-backfill-20260824.sql');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-mixed-identity-audit-v1.json');
const IDENTITY_PATH = path.join(ROOT, 'archive/data/question_identity_map.json');
const METADATA_PATH = path.join(ROOT, 'archive/data/question_metadata.json');
const ARCHIVE_METADATA_REVISION = 'archive-metadata-v1';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    if (key === 'help') args.help = true;
    else args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node archive/tools/intelligence/audit-archive-blueprint-mixed-identity.mjs [options]

Options:
  --db-sql <path>  local D1 SQL export (read-only)
  --out <path>     audit JSON output path
  --sql-out <path> review-only UPDATE plan (never executes SQL)
`);
}

function resolvePath(value, fallback) {
  const raw = String(value || '').trim();
  return raw ? (path.isAbsolute(raw) ? raw : path.resolve(ROOT, raw)) : fallback;
}

function normalizeSourceFile(value) {
  let raw = String(value || '').trim().replace(/\\/g, '/');
  raw = raw.replace(/^\.?\//, '').replace(/^\/+/, '').replace(/^archive\//, '').replace(/^exams\//, '');
  if (raw && !raw.endsWith('.js')) raw += '.js';
  return raw;
}

function parseSqlScalar(raw) {
  const value = String(raw || '').trim();
  if (/^NULL$/i.test(value)) return null;
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  if (/^-?\d+$/.test(value)) return Number(value);
  if (/^-?(?:\d+\.\d*|\.\d+)$/.test(value)) return Number(value);
  return value;
}

function splitSqlValues(raw) {
  const values = [];
  let start = 0;
  let quoted = false;
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i] === "'") {
      if (quoted && raw[i + 1] === "'") i += 1;
      else quoted = !quoted;
    } else if (raw[i] === ',' && !quoted) {
      values.push(parseSqlScalar(raw.slice(start, i)));
      start = i + 1;
    }
  }
  values.push(parseSqlScalar(raw.slice(start)));
  return values;
}

function extractInsertRows(sql) {
  const rows = [];
  const marker = 'INSERT INTO "exam_blueprints"';
  let offset = 0;
  while (true) {
    const start = sql.indexOf(marker, offset);
    if (start < 0) break;
    const columnOpen = sql.indexOf('(', start + marker.length);
    const columnClose = sql.indexOf(')', columnOpen + 1);
    const valuesMarker = sql.indexOf('VALUES(', columnClose + 1);
    if (columnOpen < 0 || columnClose < 0 || valuesMarker < 0) break;
    let close = valuesMarker + 'VALUES('.length;
    let quoted = false;
    for (; close < sql.length; close += 1) {
      if (sql[close] === "'") {
        if (quoted && sql[close + 1] === "'") close += 1;
        else quoted = !quoted;
      } else if (sql[close] === ')' && !quoted) break;
    }
    const columns = sql.slice(columnOpen + 1, columnClose).split(',').map(v => v.replace(/["`]/g, '').trim()).filter(Boolean);
    const values = splitSqlValues(sql.slice(valuesMarker + 'VALUES('.length, close));
    if (columns.length === values.length) rows.push(Object.fromEntries(columns.map((column, i) => [column, values[i]])));
    offset = close + 1;
  }
  return rows;
}

function extractQuestionBank(jsText) {
  const sandboxWindow = { questionBank: null, __questionBank: null };
  const sandboxDocument = {
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, innerHTML: '' }),
    head: { appendChild() {} },
    body: { appendChild() {} },
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
  try {
    const fn = new Function('window', 'document', `${jsText}\n;return window.questionBank || window.__questionBank || null;`);
    const bank = fn(sandboxWindow, sandboxDocument);
    return Array.isArray(bank) ? bank : [];
  } catch (error) {
    return { error: String(error?.message || error) };
  }
}

function firstValue(question, names) {
  for (const name of names) {
    const value = question?.[name];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return null;
}

function buildMetadata(question) {
  return {
    standardUnitKey: firstValue(question, ['standardUnitKey', 'standard_unit_key']),
    standardUnit: firstValue(question, ['standardUnit', 'standard_unit']),
    standardCourse: firstValue(question, ['standardCourse', 'standard_course']),
    subUnitKey: firstValue(question, ['subUnitKey', 'sub_unit_key']),
    conceptClusterKey: firstValue(question, ['conceptClusterKey', 'concept_cluster_key', 'conceptCluster', 'conceptKey', 'concept_key']),
    typeKey: firstValue(question, ['problemTypeKey', 'problem_type_key', 'typeKey', 'type_key']),
    templateKey: firstValue(question, ['templateKey', 'template_key']),
    difficulty: firstValue(question, ['difficultyBucket', 'difficulty_bucket', 'difficulty', 'level']),
    tags: Array.isArray(question?.tags) ? question.tags.map(item => String(item || '').trim()).filter(Boolean) : [],
    metadataRevision: String(firstValue(question, ['metadataRevision', 'metadata_revision']) || ARCHIVE_METADATA_REVISION).trim()
  };
}

function metadataHash(metadata) {
  const payload = JSON.stringify({ ...metadata, tags: metadata.tags || [] });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function sqlLiteral(value) {
  if (value === null || value === undefined || value === '') return 'NULL';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildIdentityMetadataUpdate(rowAudit) {
  const metadata = rowAudit.expectedMetadata;
  if (!metadata || rowAudit.status !== 'IDENTITY_CANDIDATE_READY') return '';
  const assignments = [
    ['source_archive_file', rowAudit.sourceArchiveFile],
    ['source_question_no', rowAudit.sourceQuestionNo],
    ['source_question_uid', rowAudit.expectedQuestionUid],
    ['source_question_ordinal', rowAudit.expectedQuestionOrdinal],
    ['standard_unit_key', metadata.standardUnitKey],
    ['standard_unit', metadata.standardUnit],
    ['standard_course', metadata.standardCourse],
    ['concept_cluster_key', metadata.conceptClusterKey],
    ['sub_unit_key', metadata.subUnitKey],
    ['type_key', metadata.typeKey],
    ['template_key', metadata.templateKey],
    ['difficulty', metadata.difficulty],
    ['metadata_revision', metadata.metadataRevision],
    ['metadata_hash', rowAudit.expectedMetadataHash]
  ];
  return [
    `UPDATE exam_blueprints SET ${assignments.map(([column, value]) => `${column}=${sqlLiteral(value)}`).join(', ')}, updated_at=CURRENT_TIMESTAMP`,
    `WHERE archive_file=${sqlLiteral(rowAudit.mixedFile)} AND question_no=${sqlLiteral(rowAudit.questionNo)};`
  ].join('\n');
}

function questionNumber(question) {
  return Number(String(question?.id ?? '').match(/\d+/)?.[0] || 0);
}

function resolveSource(sourceArchiveFile) {
  const normalized = normalizeSourceFile(sourceArchiveFile);
  const candidates = [
    path.join(ROOT, 'archive', normalized),
    path.join(ROOT, 'archive', 'exams', normalized)
  ];
  const sourcePath = candidates.find(candidate => fs.existsSync(candidate));
  if (!sourcePath) return { normalized, path: null, resolution: 'missing' };
  return { normalized, path: sourcePath, resolution: 'exact' };
}

const args = parseArgs(process.argv.slice(2));
if (args.help) { printHelp(); process.exit(0); }
if (!fs.existsSync(IDENTITY_PATH) || !fs.existsSync(METADATA_PATH)) {
  console.error(`identity/metadata sidecar missing: ${IDENTITY_PATH}, ${METADATA_PATH}`);
  process.exit(2);
}
const identityMap = JSON.parse(fs.readFileSync(IDENTITY_PATH, 'utf8'));
const metadataSidecar = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
const identityBySourceOrdinal = identityMap.lookup?.bySourceFileAndOrdinal || {};
const metadataBySourceOrdinal = new Map((metadataSidecar.records || []).map(record => [`${normalizeSourceFile(record.sourceArchiveFile)}#${Number(record.sourceOrdinal)}`, record]));
const dbSqlPath = resolvePath(args['db-sql'], DEFAULT_DB_SQL);
const outPath = resolvePath(args.out, DEFAULT_OUT);
const sqlOutPath = args['sql-out'] ? resolvePath(args['sql-out'], '') : '';
if (!fs.existsSync(dbSqlPath)) { console.error(`D1 SQL export not found: ${dbSqlPath}`); process.exit(2); }

const rows = extractInsertRows(fs.readFileSync(dbSqlPath, 'utf8')).filter(row => String(row.archive_file || '').startsWith('MIXED:'));
const byFile = new Map();
for (const row of rows) {
  const key = String(row.archive_file);
  if (!byFile.has(key)) byFile.set(key, []);
  byFile.get(key).push(row);
}

const fileAudits = [];
const rowAudits = [];
for (const [mixedFile, mixedRows] of byFile) {
  const sourceCache = new Map();
  for (const row of mixedRows) {
    const sourceArchiveFile = String(row.source_archive_file || '').trim();
    const sourceQuestionNo = Number(row.source_question_no);
    let source = sourceCache.get(sourceArchiveFile);
    if (!source) {
      source = resolveSource(sourceArchiveFile);
      if (source.path) {
        const parsed = extractQuestionBank(fs.readFileSync(source.path, 'utf8'));
        source.bank = Array.isArray(parsed) ? parsed : [];
        source.parseError = parsed?.error || null;
      } else source.bank = [];
      sourceCache.set(sourceArchiveFile, source);
    }
    const questionIndex = source.bank.findIndex(question => questionNumber(question) === sourceQuestionNo);
    const question = questionIndex >= 0 ? source.bank[questionIndex] : null;
    const sourceRelative = source.path ? path.relative(path.join(ROOT, 'archive'), source.path).replace(/\\/g, '/').replace(/^exams\//, '') : source.normalized;
    const expectedUid = question
      ? (identityBySourceOrdinal[sourceRelative]?.[String(questionIndex + 1)] || `qid_v1_${crypto.createHash('sha256').update(`${sourceRelative}#${questionIndex + 1}`).digest('hex')}`)
      : null;
    const metadataRecord = question ? metadataBySourceOrdinal.get(`${sourceRelative}#${questionIndex + 1}`) : null;
    const metadata = question ? (metadataRecord ? {
      standardUnitKey: metadataRecord.standardUnitKey,
      standardUnit: metadataRecord.standardUnit,
      standardCourse: metadataRecord.standardCourse,
      subUnitKey: metadataRecord.subUnitKey,
      conceptClusterKey: metadataRecord.conceptClusterKey,
      typeKey: metadataRecord.problemTypeKey,
      templateKey: metadataRecord.templateKey,
      difficulty: metadataRecord.difficultyBucket,
      tags: Array.isArray(question.tags) ? question.tags.map(item => String(item || '').trim()).filter(Boolean) : [],
      metadataRevision: metadataRecord.metadataRevision
    } : buildMetadata(question)) : null;
    const expectedHash = metadata ? metadataHash(metadata) : null;
    const status = !source.path ? 'SOURCE_FILE_MISSING'
      : source.parseError ? 'SOURCE_PARSE_ERROR'
        : !question ? 'SOURCE_QUESTION_MISSING'
          : row.source_question_uid && String(row.source_question_uid) !== expectedUid ? 'IDENTITY_MISMATCH'
            : row.source_question_ordinal && Number(row.source_question_ordinal) !== questionIndex + 1 ? 'IDENTITY_MISMATCH'
              : 'IDENTITY_CANDIDATE_READY';
    rowAudits.push({
      mixedFile,
      questionNo: Number(row.question_no) || null,
      sourceArchiveFile,
      sourceQuestionNo: Number.isFinite(sourceQuestionNo) ? sourceQuestionNo : null,
      sourceQuestionUid: row.source_question_uid || null,
      sourceQuestionOrdinal: Number(row.source_question_ordinal) || null,
      expectedQuestionOrdinal: question ? questionIndex + 1 : null,
      expectedQuestionUid: expectedUid,
      existingMetadataHash: row.metadata_hash || null,
      expectedMetadataHash: expectedHash,
      expectedMetadata: metadata,
      status
    });
  }
  const fileRows = rowAudits.filter(row => row.mixedFile === mixedFile);
  fileAudits.push({
    mixedFile,
    rows: fileRows.length,
    identityCandidateReady: fileRows.filter(row => row.status === 'IDENTITY_CANDIDATE_READY').length,
    sourceFileMissing: fileRows.filter(row => row.status === 'SOURCE_FILE_MISSING').length,
    sourceQuestionMissing: fileRows.filter(row => row.status === 'SOURCE_QUESTION_MISSING').length,
    identityMismatch: fileRows.filter(row => row.status === 'IDENTITY_MISMATCH').length,
    parseError: fileRows.filter(row => row.status === 'SOURCE_PARSE_ERROR').length
  });
}

const summary = {
  mixedFiles: fileAudits.length,
  mixedRows: rowAudits.length,
  identityCandidateReady: rowAudits.filter(row => row.status === 'IDENTITY_CANDIDATE_READY').length,
  sourceFileMissing: rowAudits.filter(row => row.status === 'SOURCE_FILE_MISSING').length,
  sourceQuestionMissing: rowAudits.filter(row => row.status === 'SOURCE_QUESTION_MISSING').length,
  identityMismatch: rowAudits.filter(row => row.status === 'IDENTITY_MISMATCH').length,
  parseError: rowAudits.filter(row => row.status === 'SOURCE_PARSE_ERROR').length,
  existingUidRows: rowAudits.filter(row => row.sourceQuestionUid).length,
  existingOrdinalRows: rowAudits.filter(row => row.sourceQuestionOrdinal).length,
  existingMetadataHashRows: rowAudits.filter(row => row.existingMetadataHash).length
};
const report = {
  schemaVersion: 'archive-blueprint-mixed-identity-audit-v1',
  generatedAt: new Date().toISOString(),
  readOnly: true,
  status: summary.sourceFileMissing || summary.sourceQuestionMissing || summary.identityMismatch || summary.parseError
    ? 'MIXED_IDENTITY_REVIEW_REQUIRED'
    : 'MIXED_IDENTITY_CANDIDATES_READY',
  source: { dbSqlPath: path.relative(ROOT, dbSqlPath).replace(/\\/g, '/'), archiveRoot: 'archive/' },
  summary,
  fileAudits,
  rowAudits,
  sqlPlan: {
    requested: Boolean(sqlOutPath),
    path: sqlOutPath ? path.relative(ROOT, sqlOutPath).replace(/\\/g, '/') : null,
    statements: sqlOutPath ? rowAudits.filter(row => row.status === 'IDENTITY_CANDIDATE_READY').length : 0,
    note: sqlOutPath ? 'Review-only UPDATE statements; this tool never executes SQL.' : 'No SQL plan requested.'
  }
};
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
if (sqlOutPath) {
  const readyRows = rowAudits.filter(row => row.status === 'IDENTITY_CANDIDATE_READY');
  const keySet = new Set(readyRows.map(row => `${row.mixedFile}\u0000${row.questionNo}`));
  const duplicateKeys = readyRows.length - keySet.size;
  const sqlStatements = readyRows.map(buildIdentityMetadataUpdate).filter(Boolean);
  if (duplicateKeys || sqlStatements.length !== readyRows.length) {
    console.error(JSON.stringify({ duplicateKeys, expectedStatements: readyRows.length, actualStatements: sqlStatements.length }, null, 2));
    process.exit(3);
  }
  fs.mkdirSync(path.dirname(sqlOutPath), { recursive: true });
  fs.writeFileSync(sqlOutPath,
    `-- MIXED archive blueprint identity/metadata plan (review only; not executed)\n-- Source report: ${path.relative(ROOT, outPath).replace(/\\/g, '/')}\n-- Statements: ${sqlStatements.length}\n\n${sqlStatements.join('\n\n')}\n`,
    'utf8'
  );
}
console.log(JSON.stringify({ status: report.status, summary, report: path.relative(ROOT, outPath).replace(/\\/g, '/'), sqlPlan: sqlOutPath ? path.relative(ROOT, sqlOutPath).replace(/\\/g, '/') : null, sqlStatements: report.sqlPlan.statements }, null, 2));
