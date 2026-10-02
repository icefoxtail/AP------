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
