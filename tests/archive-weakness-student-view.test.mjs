import assert from 'node:assert/strict';
import test from 'node:test';
import view from '../archive/weakness-student-view.js';

const report = {
  contractVersion: 'archive-weakness-aggregator-v1',
  sourceMode: 'assessment_result_items',
  recoveryCapable: true,
  asOf: '2026-08-25T00:00:00.000Z',
  itemCount: 4,
  wrongItemCount: 3,
  groups: {
    concept: [
      { key: 'alg.linear', weaknessScore: 0.81, attemptCount: 3, wrongCount: 3, correctCount: 0, recoveredWrongCount: 0, recoveryRate: 0, recoveryFactor: 1, recoveryStatus: 'available', latestResultAt: '2026-08-24T00:00:00.000Z' },
      { key: 'geo.angle', weaknessScore: 0.20, attemptCount: 1, wrongCount: 1, correctCount: 0, recoveryStatus: 'available' },
    ],
    problemType: [{ key: 'type.short', weaknessScore: 0.40, attemptCount: 2, wrongCount: 1, correctCount: 1, recoveryStatus: 'available' }],
    template: [],
    standardUnit: [{ key: 'std.algebra', weaknessScore: 0.70, attemptCount: 3, wrongCount: 2, correctCount: 1, recoveryStatus: 'available' }],
  },
};

test('student view summarizes weaknesses without replacing existing Wrong Clinic packets', () => {
  const packets = [{ packet_key: 'wc-1', item_count: 4, nested: { mode: 'student' } }];
  const original = JSON.parse(JSON.stringify(packets));
  const result = view.buildStudentWeaknessView({ weaknessReport: report, wrongClinicPackets: packets, maxItems: 1 });

  assert.equal(result.contractVersion, 'archive-weakness-student-view-v1');
  assert.equal(result.exposure, 'non_operational');
  assert.equal(result.readOnly, true);
  assert.equal(result.weakness.available, true);
  assert.equal(result.weakness.dimensions.concept.length, 1);
  assert.equal(result.weakness.dimensions.concept[0].severity, 'high');
  assert.equal(result.weakness.dimensions.problemType[0].severity, 'medium');
  assert.deepEqual(result.wrongClinic.packets, original);
  assert.equal(result.wrongClinic.preserved, true);
  assert.deepEqual(packets, original, 'input Wrong Clinic packets must not be mutated');
  assert.deepEqual(result.notices, []);
});

test('fallback recovery is explicit and empty data remains non-operational', () => {
  const result = view.buildStudentWeaknessView({
    weaknessReport: { recoveryCapable: false, groups: { concept: [{ key: 'x', weaknessScore: 0.1, recoveryStatus: 'limited_fallback' }] } },
  });
  assert.equal(result.weakness.available, true);
  assert.deepEqual(result.notices.map(row => row.code), ['RECOVERY_LIMITED']);

  const empty = view.buildStudentWeaknessView({ weaknessReport: { groups: {} } });
  assert.equal(empty.weakness.available, false);
  assert.deepEqual(empty.notices.map(row => row.code), ['NO_WEAKNESS_DATA']);
  assert.equal(empty.wrongClinic.packetCount, 0);
});
