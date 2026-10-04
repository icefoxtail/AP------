import assert from 'node:assert/strict';
import test from 'node:test';
import selector from '../archive/mixer-selector.js';
import preset from '../archive/weakness-supplement-preset.js';

const uid = hex => `qid_v1_${hex.repeat(64).slice(0, 64)}`;

const report = {
  contractVersion: 'archive-weakness-aggregator-v1',
  sourceMode: 'assessment_result_items',
  recoveryCapable: true,
  asOf: '2026-08-25T00:00:00.000Z',
  groups: {
    concept: [{ key: 'CONCEPT_A', label: '개념 A', weaknessScore: 0.90, attemptCount: 4, wrongCount: 3, recoveryStatus: 'available' }],
    problemType: [{ key: 'TYPE_A', label: '유형 A', weaknessScore: 0.70, attemptCount: 3, wrongCount: 2, recoveryStatus: 'available' }],
    template: [],
    standardUnit: [{ key: 'UNIT_A', label: '단원 A', weaknessScore: 0.55, attemptCount: 2, wrongCount: 1, recoveryStatus: 'available' }],
  },
};

test('supplement preset deterministically allocates weakness targets into selector requests', () => {
  const first = preset.buildSupplementPreset({ weaknessReport: report, count: 6, selectionSeed: 'phase5d-fixture' });
  const second = preset.buildSupplementPreset({ weaknessReport: report, count: 6, selectionSeed: 'phase5d-fixture' });

  assert.equal(first.contractVersion, 'archive-weakness-supplement-preset-v1');
  assert.equal(first.exposure, 'non_operational');
  assert.equal(first.status, 'candidate_non_operational');
  assert.deepEqual(first, second);
  assert.equal(preset.validatePreset(first).ok, true);
  assert.equal(first.selectorRequests.reduce((sum, row) => sum + row.requestedCount, 0), 6);
  assert.deepEqual(first.targets.map(row => row.key), ['CONCEPT_A', 'TYPE_A', 'UNIT_A']);
  assert.ok(first.selectorRequests.every(row => row.selectorRequest.count === row.requestedCount));
  assert.ok(first.selectorRequests.every(row => row.selectorRequest.recentQuestionUids.length === 0));
  assert.equal(first.constraints.preserveExistingWrongClinic, true);
  assert.equal(first.roundtrip.mixer, 'not_run');
});

test('selector requests can be replayed sequentially without canonical UID duplication', () => {
  const built = preset.buildSupplementPreset({ weaknessReport: report, count: 6, selectionSeed: 'phase5d-replay' });
  const pool = Array.from({ length: 9 }, (_, index) => ({
    questionUid: uid(String(index + 1)),
    sourceFile: `original/high/h1/1mid/fixture-${index + 1}.js`,
    sourceOrdinal: 1,
    grade: '고1',
    subject: '수학',
    course: '수학(상)',
    standardUnitKey: 'UNIT_A',
    conceptClusterKey: 'CONCEPT_A',
    problemTypeKey: 'TYPE_A',
    templateKey: `T${index + 1}`,
    difficultyBucket: '중',
  }));
  const selected = [];
  for (const row of built.selectorRequests) {
    const excluded = new Set(selected.map(item => item.questionUid));
    const result = selector.selectCandidates(pool.filter(item => !excluded.has(item.questionUid)), row.selectorRequest, {
      selectionSeed: row.selectorRequest.selectionSeed,
    });
    assert.equal(result.ok, true);
    assert.equal(result.selected.length, row.requestedCount);
    selected.push(...result.selected);
  }
  assert.equal(selected.length, built.count);
  assert.equal(new Set(selected.map(item => item.questionUid)).size, built.count);
});

test('fallback recovery and missing targets remain explicit', () => {
  const fallback = preset.buildSupplementPreset({
    weaknessReport: { recoveryCapable: false, groups: { concept: [{ key: 'C', weaknessScore: 0.5, recoveryStatus: 'limited_fallback' }] } },
    count: 4,
  });
  assert.equal(fallback.source.recoveryStatus, 'limited_fallback');
  assert.equal(preset.validatePreset(fallback).ok, true);

  const blocked = preset.buildSupplementPreset({ weaknessReport: { groups: { concept: [{ key: 'UNSPECIFIED', weaknessScore: 1 }] } }, count: 4 });
  assert.equal(blocked.status, 'blocked_no_eligible_targets');
  assert.equal(blocked.selectorRequests.length, 0);
  assert.equal(preset.validatePreset(blocked).ok, true);
});
