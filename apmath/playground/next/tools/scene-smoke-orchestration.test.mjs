// Execute the real CLI with a minimal Playwright transport double. These tests
// verify public failure reports/exit codes; they do not simulate visual PASS.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const baselineIndex = process.argv.indexOf('--baseline');
const baseline = baselineIndex < 0 ? null : process.argv[baselineIndex + 1];
if (baselineIndex >= 0) assert.ok(baseline && fs.existsSync(baseline), 'an existing baseline CLI file is required');

const mock = String.raw`
const fs = require('node:fs'), Module = require('node:module');
const originalLoad = Module._load, mode = process.env.APMATH_SMOKE_MOCK_MODE;
const trace = { launch: 0, newContext: 0, newPage: 0, goto: 0, wait: 0, evaluate: 0, contextClose: 0, browserClose: 0 };
process.on('exit', code => fs.writeFileSync(process.env.APMATH_SMOKE_MOCK_TRACE, JSON.stringify({ ...trace, exitCode: code })));
const completeRow = { id: 'done-scene', ink: 230, clipped: [], ctl: '', guide: true,
  measurement: { status: 'PASS', failures: [], corrections: [] }, legacy: { status: 'PASS' } };
const page = {
  on() {},
  async goto() { trace.goto++; if (mode === 'goto') throw Error('MOCK_NAVIGATION_FAILURE'); },
  async waitForFunction() { trace.wait++; },
  async evaluate() {
    trace.evaluate++;
    if (mode === 'evaluate-partial' && trace.evaluate === 2) return {
      rows: [completeRow], sceneIds: ['done-scene', 'broken-scene', 'pending-scene'], activeId: 'broken-scene'
    };
    throw Error(trace.evaluate === 1 ? 'MOCK_FINAL_RENDER_FAILURE' : 'MOCK_PROGRESS_UNAVAILABLE');
  }
};
const context = { async newPage() { trace.newPage++; return page; }, async close() { trace.contextClose++; } };
const browser = { async newContext() { trace.newContext++; return context; }, async close() { trace.browserClose++; } };
const playwright = { chromium: { async launch() {
  trace.launch++; if (mode === 'launch') throw Error('MOCK_LAUNCH_FAILURE'); return browser;
} } };
Module._load = function (request, parent, isMain) {
  return request === 'playwright' ? playwright : originalLoad.apply(this, arguments);
};
`;

function run(mode) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-smoke-orchestration-'));
  try {
    const preload = path.join(temporary, 'playwright-double.cjs');
    const reportFile = path.join(temporary, 'report.json'), traceFile = path.join(temporary, 'trace.json');
    fs.writeFileSync(preload, mock);
    let runner = path.join(toolsDir, 'scene-smoke.mjs');
    if (baseline) {
      // Preserve the old CLI bytes and its relative imports without editing
      // either production source or the baseline file.
      const copiedTools = path.join(temporary, 'app', 'tools'); fs.mkdirSync(copiedTools, { recursive: true });
      runner = path.join(copiedTools, 'scene-smoke.mjs'); fs.copyFileSync(baseline, runner);
      for (const file of ['scene-smoke-semantic-calibration.mjs', 'scene-smoke-measurement-gate.mjs', 'middle-initial-figure-contracts.mjs'])
        fs.symlinkSync(path.join(toolsDir, file), path.join(copiedTools, file));
      fs.symlinkSync(path.join(toolsDir, '../labs'), path.join(temporary, 'app', 'labs'), 'dir');
    }
    const child = spawnSync(process.execPath, ['--require', preload, runner, '--only', 'g7-circle-sector', '--report', reportFile], {
      cwd: path.resolve(toolsDir, '../../../..'), encoding: 'utf8', timeout: 20_000,
      env: { ...process.env, APMATH_SMOKE_MOCK_MODE: mode, APMATH_SMOKE_MOCK_TRACE: traceFile }
    });
    assert.ifError(child.error);
    assert.equal(child.status, 1, `${mode}: a failed observation must exit1; ${child.stderr}`);
    assert.ok(fs.existsSync(reportFile), `${mode}: --report must survive the failure; ${child.stderr}`);
    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    const trace = JSON.parse(fs.readFileSync(traceFile, 'utf8'));
    assert.equal(report.status, 'FAIL');
    assert.equal(report.minimumInk, 200); assert.equal(report.alphaThreshold, 30); assert.equal(report.clippingToleranceCssPx, 2);
    assert.equal(report.studentVisualQuality, 'NOT_ASSERTED');
    assert.equal(report.runs.length, 5, 'all original five environments are accounted for');
    assert.ok(report.runs.every(r => r.file === 'g7-circle-sector.html'));
    assert.equal(trace.launch, 1); assert.equal(trace.exitCode, 1);
    return { report, trace };
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
}

await test('launch failure writes a FAIL report and leaves all five environments NOT_RUN', () => {
  const { report, trace } = run('launch');
  assert.equal(report.abort.message, 'MOCK_LAUNCH_FAILURE'); assert.equal(report.abort.stage, 'launch');
  assert.ok(report.runs.every(r => r.status === 'NOT_RUN' && r.originalLegacyStatus === 'NOT_RUN' && r.rows.length === 0));
  assert.equal(trace.newContext, 0); assert.equal(trace.contextClose, 0); assert.equal(trace.browserClose, 0);
});

await test('navigation failure records the failed environment and closes existing resources', () => {
  const { report, trace } = run('goto');
  assert.equal(report.abort.message, 'MOCK_NAVIGATION_FAILURE'); assert.equal(report.abort.stage, 'navigation');
  assert.equal(report.runs[0].status, 'FAIL'); assert.equal(report.runs[0].remainingSceneCoverage, 'UNKNOWN');
  assert.ok(report.runs.slice(1).every(r => r.status === 'NOT_RUN'));
  assert.equal(trace.goto, 1); assert.equal(trace.wait, 0); assert.equal(trace.contextClose, 1); assert.equal(trace.browserClose, 1);
});

await test('unrecoverable render failure records UNKNOWN scene coverage rather than a PASS or invented rows', () => {
  const { report, trace } = run('evaluate');
  assert.equal(report.abort.message, 'MOCK_FINAL_RENDER_FAILURE'); assert.equal(report.abort.stage, 'scene-rendering');
  const failed = report.runs[0];
  assert.equal(failed.status, 'FAIL'); assert.equal(failed.originalLegacyStatus, 'UNKNOWN');
  assert.equal(failed.remainingSceneCoverage, 'UNKNOWN'); assert.deepEqual(failed.rows, []);
  assert.ok(report.runs.slice(1).every(r => r.status === 'NOT_RUN'));
  assert.equal(trace.evaluate, 2); assert.equal(trace.contextClose, 1); assert.equal(trace.browserClose, 1);
});

await test('recoverable render failure preserves completed rows, the failing scene and remaining scene IDs', () => {
  const { report, trace } = run('evaluate-partial');
  assert.equal(report.abort.message, 'MOCK_FINAL_RENDER_FAILURE');
  const failed = report.runs[0];
  assert.equal(failed.status, 'FAIL'); assert.equal(failed.remainingSceneCoverage, 'RECORDED');
  assert.deepEqual(failed.rows, [{ id: 'done-scene', ink: 230, clipped: [], ctl: '', guide: true,
    measurement: { status: 'PASS', failures: [], corrections: [] }, legacy: { status: 'PASS' } }]);
  assert.equal(failed.failedSceneId, 'broken-scene'); assert.deepEqual(failed.notRunSceneIds, ['pending-scene']);
  assert.ok(report.runs.slice(1).every(r => r.status === 'NOT_RUN' && r.rows.length === 0));
  assert.equal(trace.evaluate, 2); assert.equal(trace.contextClose, 1); assert.equal(trace.browserClose, 1);
});
