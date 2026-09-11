import test from 'node:test';
import assert from 'node:assert/strict';
import { objectSha } from '../canonical.mjs';
import {
  CALIBRATION_COMPARISON_VERSION,
  SOLUTION_CALIBRATION_COMPARISON_AXES,
  buildPhaseSafeCalibrationPacket,
  calibrationBindingsEqual,
  createCalibrationConsumptionBinding,
  validateCalibrationConsumptionBinding,
  validatePhaseSafeCalibrationPacket
} from '../calibration-consumption.mjs';
import { buildAuditorPacket } from '../review-isolation-runner.mjs';
import { solutionQualityDraft, SOLUTION_QUALITY_CHECKS, validateSolutionQuality } from '../solution-quality.mjs';
import { materializeQuestionQualityClosure } from '../question-quality-set.mjs';

const hash = char => `sha256:${char.repeat(64)}`;
const identity = {
  referenceSampleLockSha: hash('a'),
  productionQualityProfileSha: hash('b'),
  frozenMainCommit: 'c'.repeat(40)
};
const anchor = 'archive/exams/original/high/h1/1mid/sample.js|1';
const lockRef = { path: 'reports/reference-sample-lock.json', bytes: 100, sha256: identity.referenceSampleLockSha };
const lock = {
  mainCommit: identity.frozenMainCommit,
  productionQualityProfile: {
    conceptExplained: { status: 'PASS', minimumStandard: 'Explain the governing concept.', sampleAnchors: [anchor] },
    problemSolutionImagesSeparate: { status: 'PASS', minimumStandard: 'Keep source and instructional images separate.', sampleAnchors: [anchor] }
  },
  samples: [{
    path: 'archive/exams/original/high/h1/1mid/sample.js',
    checkedAxes: { solutionVisual: { observation: 'The decisive relation is visible.' }, layout: { observation: 'The solution remains readable on mobile.' } },
    questionObservations: [{ qid: 1, solutionExcerpt: '풀이의 핵심', observation: '학생이 재현할 수 있는 풀이', standardCourse: '공통수학1' }]
  }]
};
identity.productionQualityProfileSha = objectSha(lock.productionQualityProfile);

function binding(overrides = {}) {
  return createCalibrationConsumptionBinding({
    ...identity,
    consumedCalibrationAxes: ['solutionQuality'],
    reviewerPhase: 'U3',
    comparisonResult: 'PASS',
    comparisonReason: 'The current explanation meets the frozen student-facing quality floor.',
    referenceAnchorsUsed: [anchor],
    qualityFloorComparison: {
      schemaVersion: CALIBRATION_COMPARISON_VERSION,
      result: 'PASS',
      checks: Object.fromEntries(SOLUTION_CALIBRATION_COMPARISON_AXES.map(key => [key, { status: 'PASS', reason: `Reviewed ${key}` }]))
    },
    ...overrides
  });
}

function reviewedSolutionContract() {
  const contract = solutionQualityDraft();
  for (const key of SOLUTION_QUALITY_CHECKS) contract.checks[key] = { status: 'PASS', reason: `Reviewed ${key}`, solutionExcerpts: ['풀이'] };
  return contract;
}

test('CASE 1: a good current solution plus calibration consumption passes', () => {
  const result = validateSolutionQuality(reviewedSolutionContract(), { solution: '풀이', choices: ['1'], questionType: '객관식' }, {
    calibration: binding(),
    expectedCalibration: identity,
    calibrationAnchorCatalog: new Set([anchor]),
    requireCalibration: true
  });
  assert.equal(result.status, 'PASS', result.errors.join('\n'));
});

test('CASE 2: a mathematically accepted solution below the production floor is a QUALITY_DEFECT', () => {
  const result = validateSolutionQuality(reviewedSolutionContract(), { solution: '풀이', choices: ['1'], questionType: '객관식' }, {
    calibration: binding({ comparisonResult: 'QUALITY_DEFECT', comparisonReason: '중간 조건 해석과 재현 가능한 추론이 production floor보다 부족하다.' }),
    expectedCalibration: identity,
    calibrationAnchorCatalog: new Set([anchor]),
    requireCalibration: true
  });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('CALIBRATION_QUALITY_FLOOR_QUALITY_DEFECT'));
});

test('CASE 3 and CASE 9: targeted recheck keeps the same frozen binding and rejects a changed SHA', () => {
  const first = binding();
  const recheck = binding();
  assert.equal(calibrationBindingsEqual(first, recheck), true);
  assert.equal(calibrationBindingsEqual(first, binding({ referenceSampleLockSha: hash('d') })), false);
  assert.equal(validateCalibrationConsumptionBinding(recheck, { expectedIdentity: identity, reviewerPhase: 'U3', requiredAxes: ['solutionQuality'], anchorCatalog: new Set([anchor]) }).status, 'PASS');
  assert.equal(validateCalibrationConsumptionBinding(binding({ referenceSampleLockSha: hash('d') }), { expectedIdentity: identity, reviewerPhase: 'U3', requiredAxes: ['solutionQuality'], anchorCatalog: new Set([anchor]) }).status, 'BLOCKED');
});

test('U1 remains blind and U2 never receives reference answers or solutions', () => {
  const u3 = buildPhaseSafeCalibrationPacket({ lock, lockRef, reviewerPhase: 'U3', consumedCalibrationAxes: ['solutionQuality', 'solutionVisual', 'layout'], referenceAnchorsUsed: [anchor] });
  assert.equal(validatePhaseSafeCalibrationPacket(u3, { expectedIdentity: identity, reviewerPhase: 'U3', requiredAxes: ['solutionQuality'], allowedAnchors: new Set([anchor]) }).status, 'PASS');
  const u2 = buildPhaseSafeCalibrationPacket({ lock, lockRef, reviewerPhase: 'U2', consumedCalibrationAxes: ['solutionVisual'], referenceAnchorsUsed: [anchor] });
  const badU2 = structuredClone(u2);
  badU2.referenceAnchors[0].solutionExcerpt = 'reference solution leak';
  assert.equal(validatePhaseSafeCalibrationPacket(badU2, { expectedIdentity: identity, reviewerPhase: 'U2', requiredAxes: ['solutionVisual'], allowedAnchors: new Set([anchor]) }).status, 'BLOCKED');
  assert.throws(() => buildAuditorPacket({
    phase: 'U1', questionUid: 'sample|1', payload: { questionUid: 'sample|1', content: 'source', choices: [], problemAssets: [], calibration: u3 },
    affectedUidSet: ['sample|1'], auditorId: 'auditor', auditorSessionId: 'u1', builderId: 'builder', builderSessionId: 'builder-session', auditorPrincipalType: 'STATELESS_MODEL', contextId: 'u1-context', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', sealed: true, launchId: 'job:1', externalTaskId: 'provider'
  }), /CALIBRATION_U1_FORBIDDEN|CALIBRATION_CONSUMPTION_REQUIRED_MUST_BE_FALSE_FOR_U1/);
});

test('applicable question-quality closure blocks when calibration consumption is missing', () => {
  const inputSha = hash('e');
  const row = { questionUid: 'sample|1', axis: 'SOLUTION', axisInputSha: hash('f'), status: 'PASS', mode: 'FRESH', evidenceId: 'solution-evidence', evidenceSha: hash('1'), receiptSha: null };
  const blocked = materializeQuestionQualityClosure({
    questionUid: 'sample|1', currentRunInputSha: inputSha, requiredAxes: ['SOLUTION'], axes: { SOLUTION: row },
    calibrationIdentity: identity, requiredCalibrationAxesByAxis: { SOLUTION: ['solutionQuality'] }
  });
  assert.equal(blocked.status, 'BLOCKED');
  const closed = materializeQuestionQualityClosure({
    questionUid: 'sample|1', currentRunInputSha: inputSha, requiredAxes: ['SOLUTION'], axes: { SOLUTION: row },
    calibrationByAxis: { SOLUTION: binding() }, calibrationIdentity: identity, calibrationAnchorCatalog: new Set([anchor]), requiredCalibrationAxesByAxis: { SOLUTION: ['solutionQuality'] }
  });
  assert.equal(closed.status, 'PASS', closed.errors.join('\n'));
});

test('quality comparison records are typed rather than a free-form sample-consulted string', () => {
  const comparison = { schemaVersion: CALIBRATION_COMPARISON_VERSION, result: 'PASS', checks: { studentReproducibility: { status: 'PASS', reason: '학생이 같은 조건으로 재현할 수 있다.' } } };
  const result = validateCalibrationConsumptionBinding(binding({ qualityFloorComparison: comparison }), { expectedIdentity: identity, reviewerPhase: 'U3', requiredAxes: ['solutionQuality'], anchorCatalog: new Set([anchor]) });
  assert.equal(result.status, 'PASS', result.errors.join('\n'));
  assert.equal(objectSha(comparison).startsWith('sha256:'), true);
});
