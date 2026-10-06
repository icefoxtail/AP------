import assert from 'node:assert/strict';
import test from 'node:test';

import {
  QUALITY_CONTRACT_V2,
  solutionSha256,
  validateArtifactContract,
} from './archive-stage-validator-artifact-v2.mjs';

function validQuestion(overrides = {}) {
  return {
    id: 1,
    questionType: '객관식',
    choices: ['1', '2', '3', '4', '5'],
    answer: '①',
    solution: 'x+1=2\\nx=1',
    problemTypeKey: 'PT_SAMPLE',
    templateKey: 'TPL_SAMPLE',
    crossConceptKeys: [],
    conditionKeys: [],
    integrationPattern: 'NONE',
    difficultyBucket: 2,
    difficultyConfidence: 'high',
    difficultyBoundaryFlag: 'NONE',
    legacyLevelCompatibility: 'NORMAL',
    ...overrides,
  };
}

function validEvidence(question, overrides = {}) {
  return {
    qualityContractVersion: QUALITY_CONTRACT_V2,
    goldenCalibrationReviewed: true,
    goldenCalibrationSet: ['golden-a', 'golden-b', 'golden-c'],
    rows: [{
      qid: question.id,
      smallBoardContinuityStatus: 'PASS',
      solutionSha256: solutionSha256(question.solution),
    }],
    ...overrides,
  };
}

test('legacy evidence does not activate the 2.0 artifact contract', () => {
  const report = validateArtifactContract({
    stage: 'CREATE',
    evidence: { rows: [] },
    questions: [validQuestion()],
  });
  assert.equal(report.active, false);
  assert.deepEqual(report.issues, []);
});

test('quality contract v2 accepts a complete artifact', () => {
  const question = validQuestion();
  const report = validateArtifactContract({
    stage: 'CREATE',
    evidence: validEvidence(question),
    questions: [question],
  });
  assert.equal(report.active, true);
  assert.equal(report.disposition, 'PASS');
  assert.deepEqual(report.issues, []);
});

test('quality contract v2 catches physical schema and escape defects', () => {
  const question = validQuestion({
    choices: ['① 1', '2', '3', '4', '5'],
    solution: 'x=1\\timestwo',
    templateKey: undefined,
    difficultyConfidence: undefined,
  });
  delete question.templateKey;
  delete question.difficultyConfidence;

  const evidence = validEvidence(question, {
    rows: [{
      qid: 1,
      smallBoardContinuityStatus: 'FAIL',
      solutionSha256: 'stale',
    }],
  });

  const report = validateArtifactContract({
    stage: 'R1',
    evidence,
    questions: [question],
  });

  assert.equal(report.disposition, 'FAIL');
  assert.ok(report.issues.some(issue => issue.startsWith('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED')));
  assert.ok(report.issues.includes('ARTIFACT_CONTROL_ESCAPE:solution:q1'));
  assert.ok(report.issues.includes('ARTIFACT_META_FIELD_REQUIRED:templateKey:q1'));
  assert.ok(report.issues.includes('ARTIFACT_DIFFICULTY_FIELD_REQUIRED:difficultyConfidence:q1'));
  assert.ok(report.issues.includes('ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q1'));
  assert.ok(report.issues.includes('ARTIFACT_SOLUTION_SHA256_MISMATCH:q1'));
});

test('canonical metadata debt must be explicit', () => {
  const question = validQuestion({ templateKey: null });
  const evidence = validEvidence(question);
  let report = validateArtifactContract({ stage: 'CREATE', evidence, questions: [question] });
  assert.ok(report.issues.includes('ARTIFACT_META_DEBT_REQUIRED:templateKey:q1'));

  evidence.rows[0].metaDebtFields = ['templateKey'];
  evidence.rows[0].metaDebtReason = 'canonical template lookup debt';
  report = validateArtifactContract({ stage: 'CREATE', evidence, questions: [question] });
  assert.equal(report.disposition, 'PASS');
});
