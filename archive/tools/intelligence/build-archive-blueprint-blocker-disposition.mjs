#!/usr/bin/env node

/**
 * Build a read-only disposition report for archive blueprint rows that remain
 * after metadata backfill and MIXED identity promotion. It never mutates D1,
 * archive JS, or the input reports.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_DRY_RUN = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-after-mixed-identity-v1.json');
const DEFAULT_POST_AUDIT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-post-audit-after-mixed-identity-v3.json');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-blocker-disposition-v1.json');

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

function resolvePath(value, fallback) {
  const raw = String(value || '').trim();
  return raw ? (path.isAbsolute(raw) ? raw : path.resolve(ROOT, raw)) : fallback;
}

function relative(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readJson(file, label) {
  if (!fs.existsSync(file)) throw new Error(`${label} not found: ${file}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log('Usage: node archive/tools/intelligence/build-archive-blueprint-blocker-disposition.mjs [--dry-run <path>] [--post-audit <path>] [--out <path>]');
  process.exit(0);
}

const dryRunPath = resolvePath(args['dry-run'], DEFAULT_DRY_RUN);
const postAuditPath = resolvePath(args['post-audit'], DEFAULT_POST_AUDIT);
const outPath = resolvePath(args.out, DEFAULT_OUT);
const dryRun = readJson(dryRunPath, 'dry-run report');
const postAudit = readJson(postAuditPath, 'post-audit report');

const sourceMissingFiles = (dryRun.fileSummaries || [])
  .filter(file => file.status === 'SOURCE_FILE_MISSING')
  .map(file => ({
    archiveFile: file.archiveFile,
    rows: Number(file.dbRows || 0),
    disposition: 'SOURCE_UNAVAILABLE_HOLD',
    action: 'No metadata write, deletion, or inferred replacement until a verified source is supplied.'
  }));

const orphanRows = (dryRun.questionDiffs || [])
  .filter(diff => diff.status === 'DB_ROW_UNMATCHED')
  .map(diff => ({
    archiveFile: diff.archiveFile,
    questionNo: diff.questionNo,
    sourceOrdinal: diff.sourceOrdinal || null,
    disposition: 'LEGACY_UNMATCHED_SPARSE_ID',
    action: 'Keep row unchanged; do not reinterpret question_no as ordinal and do not delete without explicit disposition approval.'
  }));

const sourceMissingRows = sourceMissingFiles.reduce((sum, file) => sum + file.rows, 0);
const blockers = [
  ...sourceMissingFiles.map(file => `${file.archiveFile}: source unavailable (${file.rows} rows)`),
  ...orphanRows.map(row => `${row.archiveFile}#${row.questionNo}: sparse legacy row unmatched`)
];
const report = {
  schemaVersion: 'archive-blueprint-blocker-disposition-v1',
  generatedAt: new Date().toISOString(),
  readOnly: true,
  status: blockers.length ? 'DISPOSITION_REQUIRED' : 'NO_REMAINING_BLOCKERS',
  source: {
    dryRunReport: relative(dryRunPath),
    postAuditReport: relative(postAuditPath),
    postAuditStatus: postAudit.status
  },
  summary: {
    sourceMissingFiles: sourceMissingFiles.length,
    sourceMissingRows,
    orphanRows: orphanRows.length,
    totalRowsOnHold: sourceMissingRows + orphanRows.length
  },
  sourceMissingFiles,
  orphanRows,
  blockers,
  phase3Gate: {
    allowed: blockers.length === 0,
    reason: blockers.length ? 'Resolve or explicitly disposition every source-unavailable/orphan row before question-index/runtime promotion.' : 'No source-unavailable or orphan rows remain.'
  }
};
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, summary: report.summary, report: relative(outPath) }, null, 2));
