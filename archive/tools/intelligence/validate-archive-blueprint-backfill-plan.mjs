#!/usr/bin/env node

/**
 * Read-only safety gate for a generated archive blueprint backfill SQL plan.
 * This validator never executes SQL and rejects destructive statements.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_REPORT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-v1.json');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-plan-validation-v1.json');

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
  console.log(`Usage: node archive/tools/intelligence/validate-archive-blueprint-backfill-plan.mjs [options]

Options:
  --report <path>  dry-run JSON report
  --sql-plan <path> generated SQL plan
  --out <path>     validation report path
`);
}

function resolvePath(value, fallback) {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  return path.isAbsolute(raw) ? raw : path.resolve(ROOT, raw);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

const reportPath = resolvePath(args.report, DEFAULT_REPORT);
const sqlPlanPath = args['sql-plan'] ? resolvePath(args['sql-plan'], '') : '';
const outPath = resolvePath(args.out, DEFAULT_OUT);
if (!fs.existsSync(reportPath)) {
  console.error(`Dry-run report not found: ${reportPath}`);
  process.exit(2);
}

const dryRun = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const validation = {
  schemaVersion: 'archive-blueprint-backfill-plan-validation-v1',
  generatedAt: new Date().toISOString(),
  readOnly: true,
  status: 'UNKNOWN',
  source: {
    dryRunReport: path.relative(ROOT, reportPath).replace(/\\/g, '/'),
    dryRunStatus: dryRun.status,
    sqlPlan: sqlPlanPath ? path.relative(ROOT, sqlPlanPath).replace(/\\/g, '/') : null
  },
  checks: {
    sqlPlanPresent: Boolean(sqlPlanPath && fs.existsSync(sqlPlanPath)),
    destructiveStatementFree: false,
    deterministicUpsertOnly: false,
    statementCountMatches: false
  },
  statementCount: 0,
  expectedStatementCount: Number(dryRun.sqlPlan?.statements || 0),
  errors: []
};

if (dryRun.status === 'BLOCKED_SCHEMA_MISSING') {
  validation.status = 'BLOCKED_SCHEMA_MISSING';
  validation.errors.push('Dry-run input predates Phase 2A schema; no batch plan is eligible.');
} else if (!validation.checks.sqlPlanPresent) {
  validation.status = 'BLOCKED_SQL_PLAN_MISSING';
  validation.errors.push('No SQL plan was supplied for validation.');
} else {
  const sql = fs.readFileSync(sqlPlanPath, 'utf8');
  const statements = sql.split(/;\s*(?=INSERT INTO exam_blueprints)/g)
    .map(statement => statement.trim())
    .filter(statement => /^--[\s\S]*INSERT INTO exam_blueprints/m.test(statement));
  validation.statementCount = statements.length;
  validation.checks.destructiveStatementFree = !/\b(DROP|DELETE|ALTER|TRUNCATE|REPLACE)\b/i.test(sql);
  validation.checks.deterministicUpsertOnly = statements.length > 0 && statements.every(statement =>
    /^--[\s\S]*INSERT INTO exam_blueprints/m.test(statement) &&
    /ON CONFLICT\(archive_file, question_no\) DO UPDATE SET/.test(statement)
  );
  validation.checks.statementCountMatches = validation.expectedStatementCount === statements.length;
  if (!validation.checks.destructiveStatementFree) validation.errors.push('Destructive SQL keyword detected.');
  if (!validation.checks.deterministicUpsertOnly) validation.errors.push('Every statement must be an archive_file/question_no UPSERT.');
  if (!validation.checks.statementCountMatches) validation.errors.push('SQL statement count does not match dry-run report.');
  validation.status = validation.errors.length ? 'REVIEW_REQUIRED' : 'READY_FOR_BATCH_REVIEW';
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(validation, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  status: validation.status,
  statementCount: validation.statementCount,
  expectedStatementCount: validation.expectedStatementCount,
  report: path.relative(ROOT, outPath).replace(/\\/g, '/')
}, null, 2));
