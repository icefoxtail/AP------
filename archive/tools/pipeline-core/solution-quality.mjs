import { isObject, nonempty, objectSha } from './canonical.mjs';
import { validateStudentSerialization } from './student-output.mjs';
import { evaluateExpression } from './expression.mjs';

export const SOLUTION_QUALITY_VERSION = 'APMATH_SOLUTION_QUALITY_v1';
export const SOLUTION_CORE_CHECKS = Object.freeze([
  'mathCorrect', 'answerConclusionParity', 'keyIdeaAdequate',
  'conditionInterpretationAdequate', 'reasoningDirectionAdequate',
  'intermediateReasoningComplete', 'studentReproducible',
  'curriculumBoundaryPass', 'forbiddenExpressionPass',
  'internalConsistency', 'independentIntermediateRecalculation',
  'finalAnswerParity'
]);
export const SOLUTION_CONDITIONAL_CHECKS = Object.freeze([
  'caseSplitComplete', 'rangeBoundaryComplete', 'uniquenessOrOverlapExplained',
  'highLevelEnhanced', 'subjectiveScoringReady'
]);
export const SOLUTION_QUALITY_CHECKS = Object.freeze([...SOLUTION_CORE_CHECKS, ...SOLUTION_CONDITIONAL_CHECKS]);

// Semantic adequacy belongs to the independent U3 reviewer. This reducer checks
// completeness, applicability, and anchors; it never infers pedagogy from length
// or a heading such as [키포인트], and never manufactures review decisions.
export function solutionQualityDraft() {
  return { schemaVersion: SOLUTION_QUALITY_VERSION, checks: Object.fromEntries(
    SOLUTION_QUALITY_CHECKS.map(key => [key, { status: 'NOT_TESTED', reason: '', solutionExcerpts: [] }])) };
}

export function validateSolutionQuality(contract, question = null) {
  const errors = [];
  if (question) errors.push(...validateStudentSerialization(question).errors);
  if (!isObject(contract) || contract.schemaVersion !== SOLUTION_QUALITY_VERSION) return { status: 'FAIL', errors: ['SOLUTION_QUALITY_CONTRACT_REQUIRED'] };
  const required = new Set(SOLUTION_CORE_CHECKS);
  if (question && /\b(?:OCR|ChatGPT|Gemini|PASS|FAIL|pre-live)\b|원문 오류|원문 확인|검수 필요|재검산|내부 계산/.test(String(question.solution || ''))) errors.push('SOLUTION_FORBIDDEN_OPERATIONAL_TEXT');
  if (question?.level === '상') required.add('highLevelEnhanced');
  if (question && /경우|경우의 수|나누어|분류|조합|순열/.test(question.solution || '')) required.add('caseSplitComplete');
  // Constructed responses require reproducible scoring steps, even when an old
  // questionType is blank. This does not grant any special layout permission.
  if (question && ((!nonempty(question.questionType) && !question.choices?.length) || /서술|서답|주관|subjective|essay/i.test(question.questionType || ''))) required.add('subjectiveScoringReady');
  if (!isObject(contract.checks)) return { status: 'FAIL', errors: ['SOLUTION_QUALITY_CHECKS_REQUIRED'] };
  if (question && /\d/.test(question.solution || '')) {
    const recheck = contract.checks.independentIntermediateRecalculation;
    if (!nonempty(recheck?.independentWork) || !Array.isArray(recheck?.recalculations) || !recheck.recalculations.length) errors.push('SOLUTION_INDEPENDENT_RECALCULATION_REQUIRED');
    else for (const row of recheck.recalculations) {
      if (!nonempty(row?.solutionExcerpt) || !question.solution.includes(row.solutionExcerpt)) errors.push('SOLUTION_RECALCULATION_ANCHOR_STALE');
      try {
        const value = evaluateExpression(row.expression);
        if (!Number.isFinite(row.claimedValue) || !Number.isFinite(row.independentlyComputedValue) || Math.abs(value - row.claimedValue) > 1e-9 || Math.abs(value - row.independentlyComputedValue) > 1e-9) errors.push('SOLUTION_INTERMEDIATE_RECALCULATION_FAIL');
      } catch { errors.push('SOLUTION_RECALCULATION_EXPRESSION_INVALID'); }
    }
  }
  for (const key of Object.keys(contract.checks)) if (!SOLUTION_QUALITY_CHECKS.includes(key)) errors.push(`SOLUTION_QUALITY_UNKNOWN_CHECK:${key}`);
  for (const key of SOLUTION_QUALITY_CHECKS) {
    const check = contract.checks[key];
    if (!isObject(check) || !['PASS', 'FAIL', 'NOT_APPLICABLE'].includes(check.status)) { errors.push(`SOLUTION_QUALITY_NOT_REVIEWED:${key}`); continue; }
    if (!nonempty(check.reason)) errors.push(`SOLUTION_QUALITY_REASON_REQUIRED:${key}`);
    if (check.status === 'FAIL') errors.push(`SOLUTION_QUALITY_FAIL:${key}`);
    if (check.status === 'NOT_APPLICABLE' && required.has(key)) errors.push(`SOLUTION_QUALITY_EXEMPTION_FORBIDDEN:${key}`);
    if (check.status === 'PASS') {
      if (!Array.isArray(check.solutionExcerpts) || !check.solutionExcerpts.length || check.solutionExcerpts.some(s => !nonempty(s))) errors.push(`SOLUTION_QUALITY_ANCHOR_REQUIRED:${key}`);
      else if (question && check.solutionExcerpts.some(s => !String(question.solution || '').includes(s))) errors.push(`SOLUTION_QUALITY_ANCHOR_STALE:${key}`);
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors, ...(errors.length ? {} : { contractSha: objectSha(contract) }) };
}
