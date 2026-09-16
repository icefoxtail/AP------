import test from 'node:test';
import assert from 'node:assert/strict';
import { solutionQualityDraft, validateSolutionQuality, SOLUTION_QUALITY_CHECKS } from '../solution-quality.mjs';
import { validateVisualBenefit, validateVisualBenefitPair } from '../solution-visual-benefit.mjs';
import { auditRun } from '../closure.mjs';
import { axisInputSha } from '../projection.mjs';
import { fixture } from './fixture.mjs';

// These are synthetic reviewer outcomes for the reported Gangnam 2019 defect
// classes, not a certification that the original exam has been independently solved.
const defectCases = [
  ['q1 answer-only', 'studentReproducible'],
  ['q10 missing derivation', 'intermediateReasoningComplete'],
  ['q20 missing overlap reasoning', 'uniquenessOrOverlapExplained'],
  ['q21 high-level pedagogy', 'highLevelEnhanced'],
  ['q23 subjective scoring', 'subjectiveScoringReady'],
  ['q24 subjective scoring', 'subjectiveScoringReady'],
  ['q25 subjective scoring', 'subjectiveScoringReady']
];
for (const [name, check] of defectCases) test(`all math/render gates PASS but solution defect blocks final closure: ${name}`, () => {
  const f = fixture('function-family');
  try {
    assert.equal(auditRun(f.root, f.run).status, 'PASS');
    f.rewriteEvidence('solution', e => { e.payload.solutionQuality.checks[check].status = 'FAIL'; });
    const report = auditRun(f.root, f.run);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.some(e => e.includes(`SOLUTION_QUALITY_FAIL:${check}`)), report.errors.join('\n'));
  } finally { f.cleanup(); }
});

test('a PASS label, draft, missing check, or all N/A cannot substitute quality evidence', () => {
  assert.equal(validateSolutionQuality('PASS').status, 'FAIL');
  assert.equal(validateSolutionQuality(solutionQualityDraft()).status, 'FAIL');
  const c = solutionQualityDraft();
  for (const k of SOLUTION_QUALITY_CHECKS) c.checks[k] = { status: 'NOT_APPLICABLE', reason: 'Synthetic exemption', solutionExcerpts: [] };
  assert.equal(validateSolutionQuality(c).status, 'FAIL');
});

test('high difficulty and constructed response exemptions are rejected', () => {
  const f = fixture();
  try {
    const c = structuredClone(f.records.get('solution').payload.solutionQuality);
    const question = { solution: '교집합의 상한과 하한을 계산한다.', level: '상', choices: [] };
    c.checks.highLevelEnhanced.status = 'NOT_APPLICABLE';
    c.checks.subjectiveScoringReady.status = 'NOT_APPLICABLE';
    const report = validateSolutionQuality(c, question);
    assert.ok(report.errors.includes('SOLUTION_QUALITY_EXEMPTION_FORBIDDEN:highLevelEnhanced'));
    assert.ok(report.errors.includes('SOLUTION_QUALITY_EXEMPTION_FORBIDDEN:subjectiveScoringReady'));
    assert.equal(validateSolutionQuality(c, { ...question, solution: '검수 후 바뀐 해설' }).status, 'FAIL');
  } finally { f.cleanup(); }
});

test('difficulty, type and choices invalidate solution review projection', () => {
  const q = { content: '문항', choices: ['1', '2'], solution: '해설', answer: '1', level: '중' };
  for (const patch of [{ level: '상' }, { questionType: '서술형' }, { choices: ['2', '1'] }]) assert.notEqual(axisInputSha(q, 'SOLUTION'), axisInputSha({ ...q, ...patch }, 'SOLUTION'));
});

function reviewedSolutionContract(solution, recalculation = { solutionExcerpt: '7*6=42', expression: '7*6', claimedValue: 42, independentlyComputedValue: 42 }) {
  const contract = solutionQualityDraft();
  for (const key of SOLUTION_QUALITY_CHECKS) contract.checks[key] = { status: 'PASS', reason: `Reviewed ${key}`, solutionExcerpts: [solution] };
  contract.checks.independentIntermediateRecalculation = {
    status: 'PASS', reason: 'Independent arithmetic recomputation recorded', solutionExcerpts: [recalculation.solutionExcerpt],
    independentWork: `Recomputed ${recalculation.expression} independently`, recalculations: [recalculation]
  };
  return contract;
}

test('correct answer with wrong reasoning is blocked by the explicit reasoning check', () => {
  const solution = '정답은 ④이다. 근거는 존재하지 않는 규칙을 적용했기 때문이다. 7*6=42이다.';
  const contract = reviewedSolutionContract(solution);
  contract.checks.keyIdeaAdequate.status = 'FAIL';
  const result = validateSolutionQuality(contract, { answer: '④', solution, choices: ['1', '2', '3', '4'] });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('SOLUTION_QUALITY_FAIL:keyIdeaAdequate'));
});

test('correct final answer with a wrong intermediate count is independently recalculated', () => {
  const solution = '중간 계산은 6*6=42이고 최종 정답은 42이다.';
  const contract = reviewedSolutionContract(solution, { solutionExcerpt: '6*6=42', expression: '6*6', claimedValue: 42, independentlyComputedValue: 36 });
  const result = validateSolutionQuality(contract, { answer: '42', solution, choices: ['36', '42'] });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('SOLUTION_INTERMEDIATE_RECALCULATION_FAIL'));
});

test('self-contradictory explanation is blocked even when the answer parity check passes', () => {
  const solution = '첫째 경우는 3가지이다. 따라서 같은 문제의 경우의 수는 4가지이다. 3+1=4이다.';
  const contract = reviewedSolutionContract(solution, { solutionExcerpt: '3+1=4', expression: '3+1', claimedValue: 4, independentlyComputedValue: 4 });
  contract.checks.internalConsistency.status = 'FAIL';
  const result = validateSolutionQuality(contract, { answer: '4', solution, choices: ['3', '4'] });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('SOLUTION_QUALITY_FAIL:internalConsistency'));
});

test('a bare direct count cannot pass the required case split check', () => {
  const solution = '경우의 수는 직접 세면 237이다. 따라서 정답은 ④이다. 237=237이다.';
  const contract = reviewedSolutionContract(solution, { solutionExcerpt: '237=237', expression: '237', claimedValue: 237, independentlyComputedValue: 237 });
  contract.checks.caseSplitComplete.status = 'FAIL';
  const result = validateSolutionQuality(contract, { answer: '④', solution, choices: ['1', '2', '3', '4'] });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('SOLUTION_QUALITY_FAIL:caseSplitComplete'));
});

for (const [name, mutate] of [
  ['PASS-only benefit', (v1, v3) => { delete v3.payload.visualBenefit; }],
  ['source image used as exemption', (v1, v3) => { v3.payload.visualBenefit.sourceFigureUsedAsExemption = true; }],
  ['optional benefit ignored', (v1, v3) => { v3.payload.visualBenefit.visualAction = 'NONE'; }],
  ['expected facts changed after freeze', (v1, v3) => { v3.payload.visualBenefit.expectedFacts[0].statement = 'changed'; }],
  ['wrong frozen first-pass SHA', (v1, v3) => { v3.payload.visualBenefit.v1ContractSha = 'sha256:' + '0'.repeat(64); }],
  ['unbound policy', (v1, v3) => { v3.payload.visualBenefit.applicablePolicyRefs[0].sha256 = 'sha256:' + '0'.repeat(64); }]
]) test(`typed visual benefit rejects ${name}`, () => {
  const f = fixture();
  try {
    const v1 = structuredClone(f.records.get('v1')), v3 = structuredClone(f.records.get('v3'));
    const context = { question: { solutionImage: 'assets/visual.svg', solutionImageAlt: '집합의 원소 수', solutionImageCaption: '최댓값과 최솟값' }, visual: f.run.questions[0].visual, ruleRefs: f.run.inputs.filter(r => r.role === 'rule') };
    assert.equal(validateVisualBenefitPair(v1, v3, context).status, 'PASS');
    mutate(v1, v3);
    assert.equal(validateVisualBenefitPair(v1, v3, context).status, 'FAIL');
  } finally { f.cleanup(); }
});

test('missing beneficial SVG and unanchored solution both block despite review PASS', () => {
  const f = fixture();
  try {
    const result = validateVisualBenefitPair(f.records.get('v1'), f.records.get('v3'), { question: { solution: '글뿐인 해설' }, visual: f.run.questions[0].visual, ruleRefs: f.run.inputs.filter(r => r.role === 'rule') });
    assert.ok(result.errors.includes('SOLUTION_VISUAL_MISSING'));
    f.rewriteEvidence('solution', e => { e.payload.solutionQuality.checks.studentReproducible.solutionExcerpts = ['존재하지 않는 해설']; });
    assert.ok(auditRun(f.root, f.run).errors.some(e => e.includes('SOLUTION_QUALITY_ANCHOR_STALE')));
  } finally { f.cleanup(); }
});

test('explicit objective type with empty choices does not force subjective scoring', () => {
  const c = solutionQualityDraft();
  for (const key of SOLUTION_QUALITY_CHECKS) c.checks[key] = { status: 'PASS', reason: 'reviewed', solutionExcerpts: ['풀이'] };
  c.checks.subjectiveScoringReady.status = 'NOT_APPLICABLE';
  const q = { solution: '풀이', choices: [], questionType: '객관식' };
  assert.equal(validateSolutionQuality(c, q).status, 'PASS');
  for (const questionType of ['', '서술형', '서답형']) {
    const report = validateSolutionQuality(c, { ...q, questionType });
    assert.ok(report.errors.includes('SOLUTION_QUALITY_EXEMPTION_FORBIDDEN:subjectiveScoringReady'));
  }
});

test('optional false benefit with NONE fails at both review phases', () => {
  const f = fixture();
  try {
    const c = structuredClone(f.records.get('v1').payload.visualBenefit);
    const context = { ruleRefs: f.run.inputs.filter(r => r.role === 'rule') };
    assert.equal(validateVisualBenefit(c, context).status, 'PASS');
    Object.assign(c, { studentUnderstandingBenefit: false, visualAction: 'NONE', expectedFacts: [] });
    for (const phase of ['U1', 'U3']) {
      const report = validateVisualBenefit(c, { ...context, phase, question: {}, visual: { requirement: 'VISUAL_OPTIONAL', action: 'NONE' } });
      assert.equal(report.status, 'FAIL');
      assert.ok(report.errors.includes('VISUAL_OPTIONAL_BENEFIT_REQUIRED'));
    }
  } finally { f.cleanup(); }
});

test('visual role accepts canonical roles and legacy non-geometry sentinel only', () => {
  const f = fixture();
  try {
    const c = structuredClone(f.records.get('v1').payload.visualBenefit);
    const context = { ruleRefs: f.run.inputs.filter(r => r.role === 'rule') };
    for (const role of ['DECISIVE_REASONING', 'DEFINITION_REINFORCEMENT', 'RELATIONSHIP_EXPLANATION', 'REPRESENTATION_SUPPORT', 'SOURCE_RECONSTRUCTION', 'NONE', 'NOT_GEOMETRY']) {
      assert.equal(validateVisualBenefit({ ...c, geometryVisualRole: role }, context).status, 'PASS');
    }
    for (const role of ['invented', 'decisive_reasoning', '', null, 1]) {
      const report = validateVisualBenefit({ ...c, geometryVisualRole: role }, context);
      assert.equal(report.status, 'FAIL');
      assert.ok(report.errors.includes('VISUAL_BENEFIT_ROLE_INVALID'));
    }
  } finally { f.cleanup(); }
});
