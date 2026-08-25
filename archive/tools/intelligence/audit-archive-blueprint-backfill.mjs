#!/usr/bin/env node

/**
 * Read-only post-backfill audit for archive blueprint metadata.
 * It invokes the existing dry-run comparator and never mutates D1 or SQL input.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_DB_SQL = path.join(ROOT, 'reports/backups/ap-math-os_before_schedule_series_20260622_220845.sql');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-post-audit-v1.json');
const DRY_RUN_TOOL = path.join(ROOT, 'archive/tools/intelligence/dry-run-archive-blueprint-backfill.mjs');

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

function resolvePath(value, fallback) {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  return path.isAbsolute(raw) ? raw : path.resolve(ROOT, raw);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log('Usage: node archive/tools/intelligence/audit-archive-blueprint-backfill.mjs [--db-sql <path>] [--dry-run-report <path>] [--mixed-identity-audit <path>] [--out <path>]');
  process.exit(0);
}

const dbSqlPath = resolvePath(args['db-sql'], DEFAULT_DB_SQL);
const outPath = resolvePath(args.out, DEFAULT_OUT);
const mixedIdentityAuditPath = args['mixed-identity-audit'] ? resolvePath(args['mixed-identity-audit'], '') : '';
if (!fs.existsSync(dbSqlPath)) {
  console.error(`D1 SQL export not found: ${dbSqlPath}`);
  process.exit(2);
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-blueprint-post-audit-'));
const dryRunPath = args['dry-run-report']
  ? resolvePath(args['dry-run-report'], '')
  : path.join(tempRoot, 'dry-run.json');
try {
  if (!args['dry-run-report']) {
    execFileSync(process.execPath, [DRY_RUN_TOOL, '--db-sql', dbSqlPath, '--out', dryRunPath, '--limit', '5000'], {
      cwd: ROOT,
      encoding: 'utf8'
    });
  }
  const dryRun = JSON.parse(fs.readFileSync(dryRunPath, 'utf8'));
  const summary = dryRun.summary || {};
  const fileSummaries = Array.isArray(dryRun.fileSummaries) ? dryRun.fileSummaries : [];
  const mixedFiles = fileSummaries.filter(file => file.status === 'MIXED_NO_ARCHIVE_SOURCE');
  const sourceMissingFiles = fileSummaries.filter(file => file.status === 'SOURCE_FILE_MISSING');
  const parseErrorFiles = fileSummaries.filter(file => file.status === 'SOURCE_PARSE_ERROR');
  let mixedIdentityAudit = null;
  if (mixedIdentityAuditPath) {
    if (!fs.existsSync(mixedIdentityAuditPath)) {
      console.error(`MIXED identity audit not found: ${mixedIdentityAuditPath}`);
      process.exit(3);
    }
    mixedIdentityAudit = JSON.parse(fs.readFileSync(mixedIdentityAuditPath, 'utf8'));
  }
  const mixedIdentityRows = Number(mixedIdentityAudit?.summary?.mixedRows || 0);
  const mixedIdentityReady = mixedIdentityAudit?.status === 'MIXED_IDENTITY_CANDIDATES_READY' &&
    Number(mixedIdentityAudit?.summary?.identityCandidateReady || 0) === mixedIdentityRows &&
    Number(mixedIdentityAudit?.summary?.sourceFileMissing || 0) === 0 &&
    Number(mixedIdentityAudit?.summary?.sourceQuestionMissing || 0) === 0 &&
    Number(mixedIdentityAudit?.summary?.identityMismatch || 0) === 0 &&
    Number(mixedIdentityAudit?.summary?.parseError || 0) === 0 &&
    Number(mixedIdentityAudit?.summary?.existingUidRows || 0) === mixedIdentityRows &&
    Number(mixedIdentityAudit?.summary?.existingOrdinalRows || 0) === mixedIdentityRows &&
    Number(mixedIdentityAudit?.summary?.existingMetadataHashRows || 0) === mixedIdentityRows;
  const metadataDiffCount = Number(summary.updateRequired || 0) + Number(summary.insertRequired || 0) + Number(summary.sourceQuestionMissing || 0);
  const report = {
    schemaVersion: 'archive-blueprint-post-audit-v1',
    generatedAt: new Date().toISOString(),
    readOnly: true,
    postBackfill: true,
    status: 'UNKNOWN',
    source: {
      dbSqlPath: path.relative(ROOT, dbSqlPath).replace(/\\/g, '/'),
      dryRunReport: path.relative(ROOT, dryRunPath).replace(/\\/g, '/'),
      dryRunStatus: dryRun.status
    },
    checks: {
      schemaReady: dryRun.source?.schemaReady === true,
      metadataDiffZero: metadataDiffCount === 0,
      unmatchedDbRowsZero: Number(summary.unmatchedDbRows || 0) === 0,
      sourceMissingZero: sourceMissingFiles.length === 0,
      sourceParseErrorZero: parseErrorFiles.length === 0,
      mixedIdentityReviewRequired: mixedFiles.length > 0 && !mixedIdentityReady
    },
    summary: {
      blueprintRows: summary.dbRows || 0,
      archiveFiles: summary.files || 0,
      sourceQuestions: summary.sourceQuestions || 0,
      updateRequired: summary.updateRequired || 0,
      insertRequired: summary.insertRequired || 0,
      sourceQuestionMissing: summary.sourceQuestionMissing || 0,
      unmatchedDbRows: summary.unmatchedDbRows || 0,
      sourceMissingFiles: sourceMissingFiles.length,
      parseErrorFiles: parseErrorFiles.length,
      mixedFiles: mixedFiles.length,
      mixedIdentityAudit: mixedIdentityAuditPath ? path.relative(ROOT, mixedIdentityAuditPath).replace(/\\/g, '/') : null,
      mixedIdentityRows,
      mixedIdentityReady
    },
    blockers: []
  };

  if (!report.checks.schemaReady) report.blockers.push('Phase 2A metadata columns are missing from the export.');
  if (!report.checks.metadataDiffZero) report.blockers.push('Metadata diff remains; batch backfill is not complete.');
  if (!report.checks.unmatchedDbRowsZero) report.blockers.push(`${report.summary.unmatchedDbRows} blueprint row(s) do not match an archive source question.`);
  if (!report.checks.sourceMissingZero) report.blockers.push(`${sourceMissingFiles.length} source file(s) are unavailable.`);
  if (!report.checks.sourceParseErrorZero) report.blockers.push(`${parseErrorFiles.length} source file(s) failed to parse.`);
  if (report.checks.mixedIdentityReviewRequired) report.blockers.push('MIXED blueprint source UID/ordinal requires a separate identity audit.');
  report.status = report.blockers.length
    ? (!report.checks.schemaReady ? 'BLOCKED_SCHEMA_MISSING' : 'POST_AUDIT_REVIEW_REQUIRED')
    : 'POST_AUDIT_PASS';

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    status: report.status,
    blueprintRows: report.summary.blueprintRows,
    updateRequired: report.summary.updateRequired,
    mixedFiles: report.summary.mixedFiles,
    report: path.relative(ROOT, outPath).replace(/\\/g, '/')
  }, null, 2));
} finally {
  if (!args['dry-run-report']) fs.rmSync(tempRoot, { recursive: true, force: true });
}
