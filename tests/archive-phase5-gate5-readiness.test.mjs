import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { auditPhase5Gate5Readiness } from '../archive/tools/audit-phase5-gate5-readiness.mjs';

test('Gate 5 technical readiness passes while operational exposure remains held', () => {
  const report = auditPhase5Gate5Readiness();
  assert.equal(report.status, 'GATE5_TECHNICAL_PASS_OPERATIONAL_HOLD');
  assert.equal(report.gate.technical, true);
  assert.equal(report.gate.operationalExposure, 'HOLD');
  assert.equal(report.gate.studentUi, 'not_exposed');
  assert.equal(report.gate.dbWrite, 'not_run');
  assert.equal(report.gate.remoteOmr, 'not_run');
  assert.ok(Object.values(report.checks).every(Boolean));
  assert.equal(report.writes, 0);
  assert.equal(report.networkCalls, 0);
});

test('checked-in Gate 5 readiness audit is deterministic', () => {
  const file = 'archive/data/phase5-gate5-readiness.json';
  assert.ok(fs.existsSync(file), 'phase5-gate5-readiness.json must be generated');
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), auditPhase5Gate5Readiness());
});


test('temporary o67 R1 calibration preflight passes canonical gate', async () => {
  globalThis.window = {};
  await import('../archive/exams/original/middle/m3/2final/22_연향중_2학기_기말_중3_기출.js?o67-r1-calibration');
  const questions = globalThis.window.questionBank;
  const evidence = JSON.parse(fs.readFileSync('archive/data/r2e-intake/m3/22_연향중_2학기_기말_중3_기출.r1-active-v2.preflight.json', 'utf8'));
  const { validateSolutionCalibrationPreflight } = await import('../archive/tools/solution-calibration-gate.mjs');
  const issues = validateSolutionCalibrationPreflight({
    examFile: 'archive/exams/original/middle/m3/2final/22_연향중_2학기_기말_중3_기출.js',
    questions,
    evidence,
    stage: 'R1'
  });
  assert.deepEqual(issues, []);
});

// validation-bus sync: o67 R1 preflight 2026-10-03T00:38+09:00
