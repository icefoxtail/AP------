import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { auditWeaknessInputPolicy } from '../archive/tools/audit-weakness-input-policy.mjs';

test('wrong_ids-only input policy is preserved across student, teacher, and worker flows', () => {
  const report = auditWeaknessInputPolicy();
  assert.equal(report.status, 'INPUT_POLICY_PASS');
  assert.equal(report.policy.mode, 'wrong_ids_only');
  assert.equal(report.policy.answerTextCapture, false);
  assert.equal(report.policy.answerAutoScoring, false);
  assert.equal(report.policy.unattemptedState, 'not_separately_captured');
  assert.ok(Object.values(report.checks).every(Boolean));
});

test('checked-in input policy audit is deterministic', () => {
  const file = 'archive/data/weakness-input-policy-audit.json';
  assert.ok(fs.existsSync(file), 'weakness-input-policy-audit.json must be generated');
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), auditWeaknessInputPolicy());
});
