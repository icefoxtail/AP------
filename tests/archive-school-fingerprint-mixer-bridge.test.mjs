import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { buildSchoolFingerprints, fingerprintToMixerPreset } from '../archive/tools/build-school-fingerprints.mjs';
import selector from '../archive/mixer-selector.js';
import bridge from '../archive/mixer-school-fingerprint.js';
import fingerprintRuntime from '../archive/mixer-school-fingerprint-runtime.js';

function loadQuestionIndex() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.resolve('archive/question-index.js'), 'utf8'), context);
  return context.window.questionIndex || [];
}

test('eligible school fingerprint becomes a selector request and full-scope replay stays in tolerance', () => {
  const document = buildSchoolFingerprints();
  const eligible = document.schools
    .filter(school => school.sampleEligible)
    .sort((a, b) => b.questionCount - a.questionCount || a.schoolKey.localeCompare(b.schoolKey))[0];
  assert.ok(eligible, 'an eligible school fingerprint is required');

  const identity = JSON.parse(fs.readFileSync(path.resolve('archive/data/question_identity_map.json'), 'utf8'));
  const exams = document.schools.flatMap(school => school.exams);
  const candidates = bridge.enrichIndexRecords(loadQuestionIndex(), identity.records, exams)
    .filter(record => record.school === eligible.schoolName);
  assert.equal(candidates.length, eligible.questionCount);
  assert.ok(candidates.every(candidate => bridge.CANONICAL_UID_RE.test(candidate.questionUid)));
  assert.equal(new Set(candidates.map(candidate => candidate.questionUid)).size, candidates.length);

  const preset = fingerprintToMixerPreset(eligible);
  const request = bridge.toSelectorRequest(preset, {
    count: candidates.length,
    selectionSeed: 'phase4-school-fingerprint-contract'
  });
  assert.deepEqual(request.includeSchools, [eligible.schoolName]);
  assert.equal(request.count, eligible.questionCount);

  const first = bridge.selectSchoolFingerprint(selector, candidates, preset, request);
  const second = bridge.selectSchoolFingerprint(selector, candidates, preset, request);
  assert.equal(first.ok, true, first.errors.join('; ') + ' distribution=' + JSON.stringify(first.distribution));
  assert.equal(first.selected.length, candidates.length);
  assert.deepEqual(first.selected.map(item => item.questionUid), second.selected.map(item => item.questionUid));
  assert.equal(first.hardValidation.ok, true, first.hardValidation.errors.join('; '));
  assert.equal(first.distribution.ok, true, JSON.stringify(first.distribution));

  const sample = bridge.selectSchoolFingerprint(selector, candidates, preset, {
    count: 15,
    selectionSeed: 'phase4-school-fingerprint-sample'
  });
  assert.equal(sample.ok, true, sample.errors.join('; ') + ' distribution=' + JSON.stringify(sample.distribution));
  assert.equal(sample.selected.length, 15);
});

test('school fingerprint bridge rejects a request without a school scope', () => {
  const result = bridge.toSelectorRequest({ targetDistribution: {} }, { count: 5 });
  assert.deepEqual(result.includeSchools, []);
  const outcome = bridge.selectSchoolFingerprint(selector, [], { targetDistribution: {}, constraints: {} }, { count: 5 });
  assert.equal(outcome.ok, false);
  assert.ok(outcome.errors.includes('school fingerprint must supply includeSchools'));
});

test('Mixer runtime preset injection reaches the selector distribution gate', () => {
  const payload = JSON.parse(fs.readFileSync(path.resolve('archive/data/school-fingerprints.json'), 'utf8'));
  const preset = fingerprintRuntime.eligiblePresets(payload)
    .sort((a, b) => b.sample.questionCount - a.sample.questionCount || a.schoolName.localeCompare(b.schoolName))[0];
  assert.ok(preset);
  const identity = JSON.parse(fs.readFileSync(path.resolve('archive/data/question_identity_map.json'), 'utf8'));
  const exams = payload.schools.flatMap(school => school.exams);
  const candidates = bridge.enrichIndexRecords(loadQuestionIndex(), identity.records, exams)
    .filter(record => record.school === preset.schoolName);
  const result = bridge.selectSchoolFingerprint(selector, candidates, preset, {
    count: 15,
    selectionSeed: 'phase4-runtime-preset-injection'
  });
  assert.equal(result.ok, true, result.errors.join('; '));
  assert.equal(result.selected.length, 15);
  assert.equal(result.hardValidation.ok, true);
  assert.equal(result.distribution.ok, true);
});
