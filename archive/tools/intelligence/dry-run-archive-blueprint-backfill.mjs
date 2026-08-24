#!/usr/bin/env node

/**
 * Read-only Phase 2D dry-run for archive metadata -> exam_blueprints.
 *
 * The input is a local D1 SQL export. This tool never opens a D1 connection
 * and never mutates the SQL export or any database. It compares the export's
 * existing blueprint rows with the current archive JS questionBank files and
 * writes a deterministic diff report for review before a real backfill.
 * With --sql-out it can also emit a review-only UPSERT plan, but never executes SQL.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_DB_SQL = path.join(ROOT, 'reports/backups/ap-math-os_before_schedule_series_20260622_220845.sql');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-v1.json');
const ARCHIVE_METADATA_REVISION = 'archive-metadata-v1';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    if (key === 'help') {
      args.help = true;
      continue;
    }
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node archive/tools/intelligence/dry-run-archive-blueprint-backfill.mjs [options]

Options:
  --db-sql <path>  local D1 SQL export (read-only)
  --out <path>     JSON diff report path
  --sql-out <path> emit reviewed UPDATE/UPSERT SQL plan (never executes it)
  --limit <n>      cap question-level diff rows (default: 2000)
`);
}

function resolvePath(value, fallback) {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  return path.isAbsolute(raw) ? raw : path.resolve(ROOT, raw);
}

function normalizeArchiveFile(value) {
  let raw = String(value || '').trim().replace(/\\/g, '/');
  if (!raw) return '';
  raw = raw.replace(/^\.\//, '').replace(/^\/+/, '');
  if (raw.startsWith('archive/')) raw = raw.slice('archive/'.length);
  if (!raw.endsWith('.js')) raw += '.js';
  return raw;
}

function archiveFileToPath(archiveFile) {
  const normalized = normalizeArchiveFile(archiveFile);
  if (!normalized) return '';
  return path.join(ROOT, 'archive', normalized);
}

function buildArchiveSourceResolver() {
  const byBasename = new Map();
  const root = path.join(ROOT, 'archive', 'exams');
  const visit = directory => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(entryPath);
      else if (entry.isFile() && entry.name.endsWith('.js')) {
        if (!byBasename.has(entry.name)) byBasename.set(entry.name, []);
        byBasename.get(entry.name).push(entryPath);
      }
    }
  };
  visit(root);

  return archiveFile => {
    const directPath = archiveFileToPath(archiveFile);
    if (directPath && fs.existsSync(directPath)) {
      return { path: directPath, resolution: 'exact' };
    }
    if (String(archiveFile || '').startsWith('MIXED:')) {
      return { path: '', resolution: 'mixed_no_source' };
    }
    const basename = path.basename(normalizeArchiveFile(archiveFile));
    const matches = byBasename.get(basename) || [];
    if (matches.length === 1) return { path: matches[0], resolution: 'basename_fallback' };
    if (matches.length > 1) return { path: '', resolution: 'basename_ambiguous', candidates: matches.map(file => path.relative(ROOT, file).replace(/\\/g, '/')) };
    return { path: '', resolution: 'missing' };
  };
}

function parseSqlScalar(raw) {
  const value = String(raw || '').trim();
  if (/^NULL$/i.test(value)) return null;
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (/^-?\d+$/.test(value)) return Number(value);
  if (/^-?(?:\d+\.\d*|\.\d+)$/.test(value)) return Number(value);
  return value;
}

function splitSqlValues(raw) {
  const values = [];
  let start = 0;
  let quoted = false;
  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    if (char === "'") {
      if (quoted && raw[i + 1] === "'") {
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
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

    let quoted = false;
    let close = valuesMarker + 'VALUES('.length;
    for (; close < sql.length; close += 1) {
      const char = sql[close];
      if (char === "'") {
        if (quoted && sql[close + 1] === "'") {
          close += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === ')' && !quoted) {
        break;
      }
    }
    if (close >= sql.length) break;

    const columns = sql.slice(columnOpen + 1, columnClose)
      .split(',')
      .map(column => column.replace(/["`]/g, '').trim())
      .filter(Boolean);
    const values = splitSqlValues(sql.slice(valuesMarker + 'VALUES('.length, close));
    if (columns.length === values.length) {
      rows.push(Object.fromEntries(columns.map((column, index) => [column, values[index]])));
    }
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
    const fn = new Function('window', 'document', `${jsText}\n;return window.questionBank || window.__questionBank || (typeof questionBank !== 'undefined' ? questionBank : null);`);
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

function normalizeTags(value) {
  return Array.isArray(value) ? value.map(item => String(item || '').trim()).filter(Boolean) : [];
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
    tags: normalizeTags(question?.tags),
    metadataRevision: String(firstValue(question, ['metadataRevision', 'metadata_revision']) || ARCHIVE_METADATA_REVISION).trim()
  };
}

function metadataHash(metadata) {
  const payload = JSON.stringify({
    standardUnitKey: metadata.standardUnitKey || null,
    standardUnit: metadata.standardUnit || null,
    standardCourse: metadata.standardCourse || null,
    subUnitKey: metadata.subUnitKey || null,
    conceptClusterKey: metadata.conceptClusterKey || null,
    typeKey: metadata.typeKey || null,
    templateKey: metadata.templateKey || null,
    difficulty: metadata.difficulty || null,
    tags: metadata.tags || [],
    metadataRevision: metadata.metadataRevision || ARCHIVE_METADATA_REVISION
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function questionNumber(question) {
  return Number(String(question?.id ?? '').match(/\d+/)?.[0] || 0);
}

function sqlLiteral(value) {
  if (value === null || value === undefined || value === '') return 'NULL';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function canonicalQuestionUid(archiveFile, ordinal) {
  const sourceFile = normalizeArchiveFile(archiveFile).replace(/^exams\//, '');
  return `qid_v1_${crypto.createHash('sha256').update(`${sourceFile}#${ordinal}`).digest('hex')}`;
}

function buildBackfillSqlStatement(archiveFile, question, ordinal, metadata, expectedHash, sourceArchiveFile = archiveFile, sourceQuestionNo = questionNumber(question)) {
  const questionNo = questionNumber(question);
  if (!questionNo) return '';
  const columns = [
    'archive_file', 'question_no', 'source_archive_file', 'source_question_no',
    'source_question_uid', 'source_question_ordinal', 'standard_unit_key',
    'standard_unit', 'standard_course', 'concept_cluster_key', 'sub_unit_key',
    'type_key', 'template_key', 'difficulty', 'metadata_revision', 'metadata_hash'
  ];
  const values = [
    archiveFile, questionNo, sourceArchiveFile, sourceQuestionNo,
    canonicalQuestionUid(sourceArchiveFile, ordinal), ordinal,
    metadata.standardUnitKey, metadata.standardUnit, metadata.standardCourse,
    metadata.conceptClusterKey, metadata.subUnitKey, metadata.typeKey,
    metadata.templateKey, metadata.difficulty, metadata.metadataRevision, expectedHash
  ];
  const updateColumns = columns.slice(2).map(column => `${column}=excluded.${column}`);
  updateColumns.push('updated_at=CURRENT_TIMESTAMP');
  return [
    `INSERT INTO exam_blueprints (${columns.join(', ')}) VALUES (${values.map(sqlLiteral).join(', ')})`,
    `ON CONFLICT(archive_file, question_no) DO UPDATE SET ${updateColumns.join(', ')}`,
    ';'
  ].join('\n');
}

function sourceOrdinal(row) {
  const ordinal = Number(row?.source_question_ordinal);
  return Number.isInteger(ordinal) && ordinal > 0 ? ordinal : Number(row?.question_no) || null;
}

function compareFile(rows, archiveFile, options) {
  let source = options.resolveSource(archiveFile);
  // Some legacy blueprint keys are logical exam identifiers rather than the
  // physical archive path. When every row carries the same source file, use
  // that explicit source field as a deterministic fallback instead of
  // treating the whole file as missing.
  if (!source.path && !String(archiveFile).startsWith('MIXED:')) {
    const sourceFields = [...new Set(rows
      .map(row => normalizeArchiveFile(row?.source_archive_file))
      .filter(Boolean))];
    if (sourceFields.length === 1 && sourceFields[0] !== archiveFile) {
      const sourceFromField = options.resolveSource(sourceFields[0]);
      if (sourceFromField.path) source = { ...sourceFromField, resolution: 'source_field_fallback', sourceField: sourceFields[0] };
    }
  }
  const sourcePath = source.path;
  const result = {
    archiveFile,
    sourcePath: sourcePath ? path.relative(ROOT, sourcePath).replace(/\\/g, '/') : null,
    sourcePathResolution: source.resolution,
    sourceCandidates: source.candidates || [],
    dbRows: rows.length,
    sourceQuestions: 0,
    status: 'UNKNOWN',
    unchanged: 0,
    updateRequired: 0,
    insertRequired: 0,
    sourceQuestionMissing: 0,
    unmatchedDbRows: 0,
    sourceFileMissing: false,
    parseError: null
  };

  if (source.resolution === 'mixed_no_source') {
    result.status = 'MIXED_NO_ARCHIVE_SOURCE';
    return { result, diffs: [] };
  }
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    result.status = 'SOURCE_FILE_MISSING';
    result.sourceFileMissing = true;
    return { result, diffs: [] };
  }

  const extracted = extractQuestionBank(fs.readFileSync(sourcePath, 'utf8'));
  if (!Array.isArray(extracted)) {
    result.status = 'SOURCE_PARSE_ERROR';
    result.parseError = extracted.error || 'questionBank is not an array';
    return { result, diffs: [] };
  }
  result.sourceQuestions = extracted.length;

  // A legacy row without source_question_ordinal must be matched by the
  // archive question number, not by treating question_no as an ordinal.
  // Several archives use sparse IDs (for example 1-4, 9-24).
  const byOrdinal = new Map(rows
    .map(row => [Number(row?.source_question_ordinal), row])
    .filter(([ordinal]) => Number.isInteger(ordinal) && ordinal > 0));
  const byQuestionNo = new Map(rows
    .map(row => [Number(row?.question_no), row])
    .filter(([questionNo]) => Number.isInteger(questionNo) && questionNo > 0));
  const matchedRows = new Set();
  const diffs = [];
  const sqlStatements = [];
  for (let index = 0; index < extracted.length; index += 1) {
    const question = extracted[index];
    const ordinal = index + 1;
    const existing = byOrdinal.get(ordinal) || byQuestionNo.get(questionNumber(question));
    if (existing) matchedRows.add(existing);
    const metadata = buildMetadata(question);
    const expectedHash = metadataHash(metadata);
    const base = {
      archiveFile,
      questionNo: questionNumber(question),
      sourceOrdinal: ordinal,
      metadataRevision: metadata.metadataRevision,
      expectedHash,
      existingHash: existing?.metadata_hash || null,
      existingRevision: existing?.metadata_revision || null
    };

    if (!existing) {
      result.insertRequired += 1;
      diffs.push({ ...base, status: 'INSERT_REQUIRED' });
      if (options.emitSql) sqlStatements.push(buildBackfillSqlStatement(archiveFile, question, ordinal, metadata, expectedHash, source.sourceField || archiveFile, questionNumber(question)));
      continue;
    }
    if (!options.schemaReady) {
      result.updateRequired += 1;
      diffs.push({ ...base, status: 'SCHEMA_MISSING' });
    } else if (
      String(existing.metadata_revision || '') === metadata.metadataRevision &&
      String(existing.metadata_hash || '') === expectedHash
    ) {
      result.unchanged += 1;
    } else {
      result.updateRequired += 1;
      diffs.push({ ...base, status: existing.metadata_hash ? 'UPDATE_REQUIRED' : 'METADATA_MISSING' });
      if (options.emitSql) sqlStatements.push(buildBackfillSqlStatement(archiveFile, question, ordinal, metadata, expectedHash, source.sourceField || archiveFile, questionNumber(question)));
    }
  }

  for (const row of rows) {
    if (matchedRows.has(row)) continue;
    result.unmatchedDbRows += 1;
    diffs.push({
      archiveFile,
      questionNo: Number(row?.question_no) || null,
      sourceOrdinal: Number(row?.source_question_ordinal) || null,
      expectedHash: null,
      existingHash: row?.metadata_hash || null,
      existingRevision: row?.metadata_revision || null,
      status: 'DB_ROW_UNMATCHED'
    });
  }

  result.status = options.schemaReady
    ? (result.updateRequired || result.insertRequired || result.sourceQuestionMissing || result.unmatchedDbRows ? 'DIFF' : 'UNCHANGED')
    : 'SCHEMA_MISSING';
  return { result, diffs, sqlStatements: sqlStatements.filter(Boolean) };
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

const dbSqlPath = resolvePath(args['db-sql'], DEFAULT_DB_SQL);
const outPath = resolvePath(args.out, DEFAULT_OUT);
const sqlOutPath = args['sql-out'] ? resolvePath(args['sql-out'], '') : '';
const diffLimit = Math.max(1, Number(args.limit) || 2000);
if (!fs.existsSync(dbSqlPath)) {
  console.error(`D1 SQL export not found: ${dbSqlPath}`);
  process.exit(2);
}

const sql = fs.readFileSync(dbSqlPath, 'utf8');
const blueprintRows = extractInsertRows(sql);
const dbColumns = new Set(blueprintRows.flatMap(row => Object.keys(row)));
const schemaReady = dbColumns.has('metadata_revision') && dbColumns.has('metadata_hash');
const identitySchemaReady = schemaReady && dbColumns.has('source_question_uid') && dbColumns.has('source_question_ordinal');
if (sqlOutPath && !identitySchemaReady) {
  console.error('SQL plan requires Phase 2A metadata and canonical identity columns in the input export.');
  process.exit(3);
}
const byArchive = new Map();
for (const row of blueprintRows) {
  const archiveFile = normalizeArchiveFile(row.archive_file);
  if (!archiveFile) continue;
  if (!byArchive.has(archiveFile)) byArchive.set(archiveFile, []);
  byArchive.get(archiveFile).push(row);
}

const fileSummaries = [];
const questionDiffs = [];
const sqlStatements = [];
const resolveSource = buildArchiveSourceResolver();
for (const [archiveFile, rows] of byArchive) {
  const compared = compareFile(rows, archiveFile, { schemaReady, resolveSource, emitSql: Boolean(sqlOutPath) });
  fileSummaries.push(compared.result);
  for (const diff of compared.diffs) {
    if (questionDiffs.length < diffLimit) questionDiffs.push(diff);
  }
  if (sqlOutPath) sqlStatements.push(...(compared.sqlStatements || []));
}

const summary = fileSummaries.reduce((acc, file) => {
  acc[file.status] = (acc[file.status] || 0) + 1;
  acc.dbRows += file.dbRows;
  acc.sourceQuestions += file.sourceQuestions;
  acc.unchanged += file.unchanged;
  acc.updateRequired += file.updateRequired;
  acc.insertRequired += file.insertRequired;
  acc.sourceQuestionMissing += file.sourceQuestionMissing;
  acc.unmatchedDbRows += file.unmatchedDbRows;
  return acc;
}, {
  files: fileSummaries.length,
  dbRows: 0,
  sourceQuestions: 0,
  unchanged: 0,
  updateRequired: 0,
  insertRequired: 0,
  sourceQuestionMissing: 0,
  unmatchedDbRows: 0
});

const report = {
  schemaVersion: 'archive-blueprint-backfill-dry-run-v1',
  generatedAt: new Date().toISOString(),
  readOnly: true,
  status: schemaReady ? 'READY_FOR_SAMPLE_REVIEW' : 'BLOCKED_SCHEMA_MISSING',
  source: {
    dbSqlPath: path.relative(ROOT, dbSqlPath).replace(/\\/g, '/'),
    dbSqlSha256: sha256File(dbSqlPath),
    archiveRoot: 'archive/',
    schemaColumns: [...dbColumns].sort(),
    schemaReady,
    note: schemaReady
      ? 'Input export contains Phase 2A metadata columns.'
      : 'Input export predates Phase 2A metadata columns; this report is a stale-baseline inventory, not a production backfill approval.'
  },
  summary: { ...summary, questionDiffRowsEmitted: questionDiffs.length, questionDiffLimit: diffLimit },
  sqlPlan: {
    requested: Boolean(sqlOutPath),
    path: sqlOutPath ? path.relative(ROOT, sqlOutPath).replace(/\\/g, '/') : null,
    statements: sqlStatements.length,
    schemaReady,
    identitySchemaReady,
    note: sqlOutPath
      ? 'SQL is emitted for review only; this tool never executes it.'
      : 'No SQL plan requested.'
  },
  fileSummaries,
  questionDiffs
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
if (sqlOutPath) {
  fs.mkdirSync(path.dirname(sqlOutPath), { recursive: true });
  fs.writeFileSync(
    sqlOutPath,
    `-- Archive blueprint metadata backfill plan (review only; not executed)\n-- Source report: ${path.relative(ROOT, outPath).replace(/\\/g, '/')}\n\n${sqlStatements.join('\n\n')}\n`,
    'utf8'
  );
}
console.log(JSON.stringify({
  status: report.status,
  dbRows: summary.dbRows,
  files: summary.files,
  updateRequired: summary.updateRequired,
  insertRequired: summary.insertRequired,
  unchanged: summary.unchanged,
  report: path.relative(ROOT, outPath).replace(/\\/g, '/'),
  sqlPlan: sqlOutPath ? path.relative(ROOT, sqlOutPath).replace(/\\/g, '/') : null,
  sqlStatements: sqlStatements.length
}, null, 2));
