#!/usr/bin/env node

/**
 * Read-only static QR/OMR regression baseline for the archive blueprint bridge.
 * This does not contact D1, a Worker, or a browser session.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-qr-omr-regression-v1.json');
const TESTS = [
  'tests/apmath-exam-assignment-identity.test.js',
  'tests/assessment-assignment-metadata-flow.test.js',
  'tests/assessment-result-items-storage.test.js',
  'tests/assessment-submit-qr-student-page-route.test.js',
  'tests/assessment-diagnostic-omr-flow.test.js',
  'tests/assessment-check-solution-link.test.js',
  'tests/apmath-wrong-print-qr-solution-regression.test.js'
];

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
  console.log('Usage: node archive/tools/intelligence/run-archive-blueprint-qr-omr-regression.mjs [--out <path>]');
  process.exit(0);
}

const outPath = resolvePath(args.out, DEFAULT_OUT);
const results = [];
for (const relativeTest of TESTS) {
  const startedAt = Date.now();
  try {
    const stdout = execFileSync(process.execPath, [relativeTest], { cwd: ROOT, encoding: 'utf8' });
    results.push({ test: relativeTest, status: 'PASS', durationMs: Date.now() - startedAt, stdout: stdout.trim() });
  } catch (error) {
    results.push({
      test: relativeTest,
      status: 'FAIL',
      durationMs: Date.now() - startedAt,
      exitCode: error.status ?? null,
      stdout: String(error.stdout || '').trim(),
      stderr: String(error.stderr || '').trim()
    });
  }
}

const passed = results.filter(result => result.status === 'PASS').length;
const report = {
  schemaVersion: 'archive-blueprint-qr-omr-regression-v1',
  generatedAt: new Date().toISOString(),
  readOnly: true,
  status: passed === results.length ? 'STATIC_REGRESSION_PASS' : 'REGRESSION_FAIL',
  postBackfill: false,
  scope: 'static QR/OMR and assignment-flow regression; no D1/Worker/browser mutation',
  summary: { total: results.length, passed, failed: results.length - passed },
  results,
  next: 'Rerun after approved blueprint batch backfill and post-audit.'
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  status: report.status,
  passed,
  failed: results.length - passed,
  report: path.relative(ROOT, outPath).replace(/\\/g, '/')
}, null, 2));
if (report.status !== 'STATIC_REGRESSION_PASS') process.exit(1);
