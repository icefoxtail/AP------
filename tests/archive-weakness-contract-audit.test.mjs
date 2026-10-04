import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { auditWeaknessContract } from '../archive/tools/audit-weakness-contract.mjs';

test('Phase 5A/5B/5C/5D/5E contract audit passes without operational exposure', () => {
  const report = auditWeaknessContract();
  assert.equal(report.status, 'CONTRACT_PASS_NON_OPERATIONAL');
  assert.equal(report.operationalExposure, 'HOLD');
  assert.equal(report.source.originalIndexRecords, 7981);
  assert.equal(report.source.originalCanonicalUidCoverage, 7981);
  assert.deepEqual(report.checks, {
    canonicalIndexCoverage: true,
    joinSampleResolved: true,
    aggregationDimensionsPresent: true,
    studentViewReady: true,
    wrongClinicPreserved: true,
    supplementPresetReady: true,
    closedLoopReady: true,
  });
  assert.equal(report.studentView.exposure, 'non_operational');
  assert.equal(report.studentView.wrongClinicPreserved, true);
  assert.equal(report.supplementPreset.validation, true);
  assert.equal(report.supplementPreset.roundtrip.mixer, 'not_run');
  assert.equal(report.closedLoop.status, 'CLOSED_LOOP_PASS_NON_OPERATIONAL');
  assert.equal(report.closedLoop.writes, 0);
  assert.equal(report.closedLoop.networkCalls, 0);
});

test('checked-in weakness contract audit is deterministic', () => {
  const path = 'archive/data/weakness-phase5-contract-audit.json';
  assert.ok(fs.existsSync(path), 'weakness-phase5-contract-audit.json must be generated');
  assert.deepEqual(JSON.parse(fs.readFileSync(path, 'utf8')), auditWeaknessContract());
});
