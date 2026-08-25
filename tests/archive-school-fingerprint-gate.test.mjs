import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { runSchoolFingerprintGate } from '../archive/tools/run-school-fingerprint-gate.mjs';

test('Phase 4 school fingerprint technical gate passes while exposure remains held', () => {
  const report = runSchoolFingerprintGate();
  assert.equal(report.status, 'PASS');
  assert.equal(report.operationalExposure, 'HOLD');
  assert.deepEqual(report.checks, {
    originalOnly: true,
    deterministic: true,
    aliasAudit: true,
    thresholdAudit: true,
    questionTypeCoverage: true,
    presetConversion: true,
    selectorReplay: true,
  });
  assert.equal(report.sampleReplay.selectedCount, 15);
});

test('checked-in Phase 4 gate report is deterministic', () => {
  const path = 'archive/data/school-fingerprint-gate-report.json';
  assert.ok(fs.existsSync(path), 'school-fingerprint-gate-report.json must be generated');
  assert.deepEqual(JSON.parse(fs.readFileSync(path, 'utf8')), runSchoolFingerprintGate());
});
