import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { auditSchoolFingerprintPolicy } from '../archive/tools/audit-school-fingerprint-policy.mjs';

test('school alias and threshold policy audit is complete but non-operational', () => {
  const audit = auditSchoolFingerprintPolicy();
  assert.equal(audit.policyStatus, 'candidate_v1_not_operational');
  assert.equal(audit.exposure, 'not_operational');
  assert.equal(audit.aliasPolicy.sourceNameCount, 37);
  assert.equal(audit.aliasPolicy.canonicalNameCount, 37);
  assert.equal(audit.aliasPolicy.explicitAliasCount, 0);
  assert.equal(audit.aliasPolicy.collisionCount, 0);
  assert.equal(audit.samplePolicy.candidateCount, 23);
  assert.equal(audit.samplePolicy.hiddenCount, 14);
  assert.equal(audit.audit.aliasAuditPass, true);
  assert.equal(audit.audit.thresholdAuditPass, true);
  assert.equal(audit.audit.deterministicInput, true);
});

test('checked-in school policy audit remains deterministic', () => {
  const path = 'archive/data/school-fingerprint-policy-audit.json';
  assert.ok(fs.existsSync(path), 'school-fingerprint-policy-audit.json must be generated');
  assert.deepEqual(JSON.parse(fs.readFileSync(path, 'utf8')), auditSchoolFingerprintPolicy());
});

test('Mixer loads the fingerprint bridge without exposing a preset control', () => {
  const html = fs.readFileSync('archive/mixer.html', 'utf8');
  assert.match(html, /mixer-school-fingerprint\.js\?v=20260825\.1/);
  assert.doesNotMatch(html, /school-fingerprint-(?:select|preset)\b/i);
});
