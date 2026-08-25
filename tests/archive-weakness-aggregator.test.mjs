import assert from 'node:assert/strict';
import test from 'node:test';
import joiner from '../archive/weakness-metadata-join.js';
import aggregator from '../archive/weakness-aggregator.js';

const rows = joiner.joinWrongItems({
  assessmentResultItems: [
    { session_id: 's1', student_id: 'u1', source_archive_file: 'original/middle/m3/1final/a.js', source_question_ordinal: 1, source_question_uid: 'qid_v1_' + 'a'.repeat(64), result_status: 'wrong', is_correct: 0, concept_cluster_key: 'FUNC-INVERSE', type_key: '서술형', difficulty: '하', created_at: '2026-08-20T00:00:00Z' },
    { session_id: 's1', student_id: 'u1', source_archive_file: 'original/middle/m3/1final/a.js', source_question_ordinal: 2, source_question_uid: 'qid_v1_' + 'b'.repeat(64), result_status: 'wrong', is_correct: 0, concept_cluster_key: 'FUNC-INVERSE', type_key: '서술형', difficulty: '중', created_at: '2026-08-01T00:00:00Z' },
    { session_id: 's1', student_id: 'u1', source_archive_file: 'original/middle/m3/1final/a.js', source_question_ordinal: 3, source_question_uid: 'qid_v1_' + 'c'.repeat(64), result_status: 'correct', is_correct: 1, concept_cluster_key: 'FUNC-INVERSE', type_key: '서술형', difficulty: '중', created_at: '2026-08-22T00:00:00Z' },
  ],
});

test('weakness aggregation is deterministic and recovery-aware', () => {
  const first = aggregator.aggregateWeakness(rows, { asOf: '2026-08-25T00:00:00Z' });
  const second = aggregator.aggregateWeakness(rows, { asOf: '2026-08-25T00:00:00Z' });
  assert.deepEqual(first, second);
  assert.equal(first.sourceMode, 'assessment_result_items');
  assert.equal(first.recoveryCapable, true);
  const concept = first.groups.concept.find(item => item.key === 'FUNC-INVERSE');
  assert.ok(concept);
  assert.equal(concept.attemptCount, 3);
  assert.equal(concept.wrongCount, 2);
  assert.equal(concept.recoveredWrongCount, 2);
  assert.equal(concept.recoveryStatus, 'available');
  assert.ok(concept.weaknessScore > 0);
});

test('fallback mode exposes limited recovery instead of inventing correct history', () => {
  const report = aggregator.aggregateWeakness([
    { resultStatus: 'wrong', isCorrect: 0, standardUnitKey: 'M3-04', difficultyBucket: '하', resultAt: '2026-08-20T00:00:00Z' },
  ], { asOf: '2026-08-25T00:00:00Z', recoveryCapable: false, sourceMode: 'wrong_answers_fallback' });
  const unit = report.groups.standardUnit[0];
  assert.equal(report.recoveryCapable, false);
  assert.equal(unit.recoveryStatus, 'limited_fallback');
  assert.equal(unit.recoveredWrongCount, 0);
  assert.equal(unit.recoveryFactor, 1);
});
