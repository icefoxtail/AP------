import assert from 'node:assert/strict';
import test from 'node:test';
import selector from '../archive/mixer-selector.js';
import joiner from '../archive/weakness-metadata-join.js';
import aggregator from '../archive/weakness-aggregator.js';
import supplement from '../archive/weakness-supplement-preset.js';
import loop from '../archive/weakness-closed-loop.js';

const uid = hex => `qid_v1_${hex.repeat(64).slice(0, 64)}`;

const report = {
  contractVersion: 'archive-weakness-aggregator-v1',
  sourceMode: 'assessment_result_items',
  recoveryCapable: true,
  asOf: '2026-08-25T00:00:00.000Z',
  groups: {
    concept: [{ key: 'CONCEPT_A', weaknessScore: 0.90, attemptCount: 4, wrongCount: 3, recoveryStatus: 'available' }],
    problemType: [{ key: 'TYPE_A', weaknessScore: 0.70, attemptCount: 3, wrongCount: 2, recoveryStatus: 'available' }],
    template: [],
    standardUnit: [{ key: 'UNIT_A', weaknessScore: 0.55, attemptCount: 2, wrongCount: 1, recoveryStatus: 'available' }],
  },
};

const candidates = Array.from({ length: 9 }, (_, index) => ({
  questionUid: uid(String(index + 1)),
  sourceFile: `original/high/h1/1mid/phase5d-${index + 1}.js`,
  sourceOrdinal: index + 1,
  sourceQuestionNo: index + 1,
  grade: '고1',
  subject: '수학',
  course: '수학(상)',
  standardUnitKey: 'UNIT_A',
  standardUnit: '단원 A',
  standardCourse: '수학(상)',
  subUnitKey: 'UNIT_A-SUB',
  conceptClusterKey: 'CONCEPT_A',
  problemTypeKey: 'TYPE_A',
  templateKey: `T${index + 1}`,
  difficultyBucket: '중',
}));

function priorBlueprint() {
  const row = candidates[0];
  return {
    archive_file: 'MIXED:phase5-prior',
    question_no: 1,
    source_archive_file: row.sourceFile,
    source_question_no: row.sourceQuestionNo,
    source_question_uid: row.questionUid,
    source_question_ordinal: row.sourceOrdinal,
    standard_unit_key: row.standardUnitKey,
    sub_unit_key: row.subUnitKey,
    concept_cluster_key: row.conceptClusterKey,
    type_key: row.problemTypeKey,
    template_key: row.templateKey,
    difficulty: row.difficultyBucket,
  };
}

function priorWrongItem() {
  const row = candidates[0];
  return {
    session_id: 'prior-session',
    student_id: 'student-1',
    order_no: 1,
    question_no: 1,
    result_status: 'wrong',
    is_correct: 0,
    source_archive_file: row.sourceFile,
    source_question_no: row.sourceQuestionNo,
    created_at: '2026-08-20T00:00:00.000Z',
  };
}

test('closed-loop fixture passes from preset through MIXED/OMR back to weakness aggregation', () => {
  const builtPreset = supplement.buildSupplementPreset({ weaknessReport: report, count: 6, selectionSeed: 'phase5e-fixture' });
  const result = loop.runClosedLoop({
    preset: builtPreset,
    selector,
    candidates,
    wrongQuestionNos: [2, 4],
    priorAssessmentResultItems: [priorWrongItem()],
    priorBlueprintRows: [priorBlueprint()],
    joiner,
    aggregator,
    sessionId: 'current-session',
    studentId: 'student-1',
    resultAt: '2026-08-25T00:00:00.000Z',
    asOf: '2026-08-25T00:00:00.000Z',
  });

  assert.equal(result.contractVersion, 'archive-weakness-closed-loop-v1');
  assert.equal(result.status, 'CLOSED_LOOP_PASS_NON_OPERATIONAL');
  assert.equal(result.operationalExposure, 'HOLD');
  assert.equal(result.writes, 0);
  assert.equal(result.networkCalls, 0);
  assert.equal(result.replay.selectedCount, 6);
  assert.equal(result.mixed.questionCount, 6);
  assert.equal(result.mixed.archiveFile, 'MIXED:phase5-current-session');
  assert.equal(result.blueprints.count, 6);
  assert.equal(result.result.count, 6);
  assert.equal(result.result.wrongCount, 2);
  assert.equal(result.join.count, 7, 'prior wrong + current six result items should be rejoined');
  assert.equal(result.join.resolvedCount, 7);
  assert.equal(result.weakness.itemCount, 7);
  assert.equal(result.weakness.wrongItemCount, 3);
  assert.ok(result.weakness.groups.concept[0].recoveredWrongCount >= 1);
  assert.equal(result.weakness.groups.concept[0].recoveryStatus, 'available');
  assert.equal(result.omr.writeMode, 'fixture_only');
  assert.deepEqual(result.errors, []);
});

test('closed-loop fixture is deterministic and fails closed on invalid source identity', () => {
  const builtPreset = supplement.buildSupplementPreset({ weaknessReport: report, count: 4, selectionSeed: 'phase5e-deterministic' });
  const options = {
    preset: builtPreset,
    selector,
    candidates,
    wrongQuestionNos: [1],
    joiner,
    aggregator,
    sessionId: 'deterministic-session',
    studentId: 'student-1',
    resultAt: '2026-08-25T00:00:00.000Z',
    asOf: '2026-08-25T00:00:00.000Z',
  };
  const first = loop.runClosedLoop(options);
  const second = loop.runClosedLoop(options);
  assert.deepEqual(first, second);

  const invalid = loop.buildMixedPayload([{ ...candidates[0], questionUid: 'legacy-qkey' }]);
  assert.equal(invalid.ok, false);
  assert.match(invalid.errors[0], /canonical UID/);
});
