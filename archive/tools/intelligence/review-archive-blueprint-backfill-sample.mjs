#!/usr/bin/env node

/**
 * Read-only Phase 2 sample review for archive -> exam_blueprints backfill.
 * It rechecks a bounded sample against local archive JS without touching D1.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_REPORT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-v1.json');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-sample-review-v1.json');
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
  console.log(`Usage: node archive/tools/intelligence/review-archive-blueprint-backfill-sample.mjs [options]

Options:
  --report <path>  dry-run JSON report (default: phase2 dry-run report)
  --out <path>     sample review JSON path
  --limit <n>      sample size (default: 300)
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

function questionNumber(question) {
  return Number(String(question?.id ?? '').match(/\d+/)?.[0] || 0);
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
    return Array.isArray(bank) ? bank : { error: 'questionBank is not an array' };
  } catch (error) {
    return { error: String(error?.message || error) };
  }
}

function buildSourceResolver() {
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
    const normalized = normalizeArchiveFile(archiveFile);
    const exact = path.join(ROOT, 'archive', normalized);
    if (normalized && fs.existsSync(exact)) return { path: exact, resolution: 'exact' };
    if (normalized.startsWith('MIXED:')) return { path: '', resolution: 'mixed_no_source' };
    const matches = byBasename.get(path.basename(normalized)) || [];
    if (matches.length === 1) return { path: matches[0], resolution: 'basename_fallback' };
    if (matches.length > 1) return { path: '', resolution: 'basename_ambiguous' };
    return { path: '', resolution: 'missing' };
  };
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

const reportPath = resolvePath(args.report, DEFAULT_REPORT);
const outPath = resolvePath(args.out, DEFAULT_OUT);
const limit = Math.max(1, Number(args.limit) || 300);
if (!fs.existsSync(reportPath)) {
  console.error(`Dry-run report not found: ${reportPath}`);
  process.exit(2);
}

const dryRun = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const diffs = Array.isArray(dryRun.questionDiffs) ? dryRun.questionDiffs.slice(0, limit) : [];
const resolveSource = buildSourceResolver();
const rows = [];
for (const diff of diffs) {
  const archiveFile = normalizeArchiveFile(diff.archiveFile);
  const source = resolveSource(archiveFile);
  const row = {
    archiveFile,
    sourceOrdinal: Number(diff.sourceOrdinal) || null,
    expectedQuestionNo: Number(diff.questionNo) || null,
    expectedHash: diff.expectedHash || null,
    sourcePath: source.path ? path.relative(ROOT, source.path).replace(/\\/g, '/') : null,
    sourcePathResolution: source.resolution,
    status: 'UNKNOWN',
    actualQuestionNo: null,
    recomputedHash: null,
    hashStable: false,
    metadataRevision: null,
    parseError: null
  };
  if (source.resolution === 'mixed_no_source') {
    row.status = 'MIXED_NO_ARCHIVE_SOURCE';
    rows.push(row);
    continue;
  }
  if (!source.path || !fs.existsSync(source.path)) {
    row.status = 'SOURCE_FILE_MISSING';
    rows.push(row);
    continue;
  }
  const bank = extractQuestionBank(fs.readFileSync(source.path, 'utf8'));
  if (!Array.isArray(bank)) {
    row.status = 'SOURCE_PARSE_ERROR';
    row.parseError = bank.error || 'questionBank is not an array';
    rows.push(row);
    continue;
  }
  const question = bank[(Number(diff.sourceOrdinal) || 0) - 1];
  if (!question) {
    row.status = 'SOURCE_QUESTION_MISSING';
    rows.push(row);
    continue;
  }
  const metadata = buildMetadata(question);
  row.actualQuestionNo = questionNumber(question);
  row.recomputedHash = metadataHash(metadata);
  row.hashStable = Boolean(row.expectedHash && row.recomputedHash === row.expectedHash);
  row.metadataRevision = metadata.metadataRevision;
  row.status = row.actualQuestionNo === row.expectedQuestionNo && row.hashStable
    ? 'SOURCE_HASH_STABLE'
    : (row.actualQuestionNo !== row.expectedQuestionNo ? 'QUESTION_NO_MISMATCH' : 'HASH_MISMATCH');
  rows.push(row);
}

const summary = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] || 0) + 1;
  return acc;
}, { sampleSize: rows.length });
const report = {
  schemaVersion: 'archive-blueprint-backfill-sample-review-v1',
  generatedAt: new Date().toISOString(),
  readOnly: true,
  status: dryRun.status === 'BLOCKED_SCHEMA_MISSING' ? 'BLOCKED_SCHEMA_MISSING' : (summary.HASH_MISMATCH || summary.QUESTION_NO_MISMATCH ? 'REVIEW_REQUIRED' : 'SOURCE_SAMPLE_PASS'),
  source: {
    dryRunReport: path.relative(ROOT, reportPath).replace(/\\/g, '/'),
    dryRunStatus: dryRun.status,
    requested: limit,
    source: 'local archive JS only; no D1 access'
  },
  summary,
  rows
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  status: report.status,
  sampleSize: rows.length,
  sourceHashStable: summary.SOURCE_HASH_STABLE || 0,
  sourceMissing: summary.SOURCE_FILE_MISSING || 0,
  report: path.relative(ROOT, outPath).replace(/\\/g, '/')
}, null, 2));
