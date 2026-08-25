import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { buildSchoolFingerprints, fingerprintToMixerPreset, validatePresetDistribution, SAMPLE_POLICY } from '../archive/tools/build-school-fingerprints.mjs';

const expectedPath = path.resolve('archive/data/school-fingerprints.json');

test('school fingerprint builder is deterministic and original-only', () => {
  const first = buildSchoolFingerprints();
  const second = buildSchoolFingerprints();
  assert.deepEqual(first, second);
  assert.equal(first.schemaVersion, 'school-fingerprint.v1');
  assert.equal(first.source.parseErrorCount, 0);
  assert.equal(first.source.root, 'archive/exams/original');
  assert.ok(first.source.fileCount >= 300);
  assert.ok(first.source.questionCount >= 7000);
  assert.ok(first.schools.length >= 30);
  assert.equal(first.aliasAudit.collisionCount, 0);
  assert.ok(first.aliasAudit.sourceSchoolCount >= first.aliasAudit.canonicalSchoolCount);
  assert.equal(SAMPLE_POLICY.operator, 'OR');
  for (const school of first.schools) {
    assert.ok(school.exams.length > 0);
    assert.equal(school.examCount, school.exams.length);
    assert.equal(school.questionCount, school.metrics.questionCount);
    assert.equal(school.axes.length > 0, true);
    const preset = fingerprintToMixerPreset(school);
    assert.equal(preset.sourceScope, 'archive');
    assert.deepEqual(preset.schoolInclude, [school.schoolName]);
    assert.equal(preset.constraints.canonicalUidRequired, true);
    assert.equal(preset.sample.eligible, school.sampleEligible);
    assert.equal(validatePresetDistribution(preset, school.metrics).ok, true);
  }
});

test('checked-in fingerprint matches a freshly generated build', () => {
  assert.ok(fs.existsSync(expectedPath), 'school-fingerprints.json must be generated');
  const checkedIn = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
  assert.deepEqual(checkedIn, buildSchoolFingerprints());
});
