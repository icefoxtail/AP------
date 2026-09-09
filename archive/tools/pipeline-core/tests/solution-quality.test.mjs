import test from 'node:test';
import assert from 'node:assert/strict';
import { solutionQualityDraft, validateSolutionQuality, SOLUTION_QUALITY_CHECKS } from '../solution-quality.mjs';
import { validateVisualBenefitPair } from '../solution-visual-benefit.mjs';
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
