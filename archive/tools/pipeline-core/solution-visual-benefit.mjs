import { HASH_PATTERN, isObject, nonempty, objectSha } from './canonical.mjs';

export const VISUAL_BENEFIT_VERSION = 'APMATH_SOLUTION_VISUAL_BENEFIT_v1';
export const DEFAULT_VISUAL_NEED_TYPES = Object.freeze(['GRAPH_BASED', 'INEQUALITY_BASED', 'GEOMETRY_BASED']);

const visualText = question => [
  question?.visualNeed,
  question?.visualType,
  question?.visual?.visualNeed,
  question?.visual?.expectedVisualType,
  question?.category,
  question?.standardUnit,
  question?.subUnit,
  ...(Array.isArray(question?.tags) ? question.tags : []),
  question?.content,
].filter(nonempty).join(' ').toLowerCase();

export function inferDefaultVisualNeed(question = {}) {
  const explicit = String(question.visualNeed || question.visual?.visualNeed || '').trim().toUpperCase();
  if (DEFAULT_VISUAL_NEED_TYPES.includes(explicit)) return { type: explicit, required: true, source: 'EXPLICIT_PIPELINE_POLICY' };
  if (explicit === 'NONE' || explicit === 'OPTIONAL') return { type: 'NONE', required: false, source: 'EXPLICIT_EXEMPTION' };
  const text = visualText(question);
  if (/(inequality|부등식|부등|해집합|수직선|구간)/i.test(text)) return { type: 'INEQUALITY_BASED', required: true, source: 'DEFAULT_TYPE_POLICY' };
  if (/(geometry|geometry-based|기하|도형|접선|원의 방정식|대칭이동|최단거리)/i.test(text)) return { type: 'GEOMETRY_BASED', required: true, source: 'DEFAULT_TYPE_POLICY' };
  if (/(graph|graph-based|그래프|함수|좌표|점근선|역함수|합성함수|대응)/i.test(text)) return { type: 'GRAPH_BASED', required: true, source: 'DEFAULT_TYPE_POLICY' };
  return { type: 'NONE', required: false, source: 'NO_DEFAULT_VISUAL_MATCH' };
}

export function hasSolutionVisual(question = {}) {
  return Boolean(question.solutionImage || /<(?:svg|table|img)\b/i.test(String(question.solution || '')));
}

export function validateTypedVisualExemption(exemption) {
  const errors = [];
  if (!isObject(exemption) || exemption.status !== 'APPROVED') errors.push('VISUAL_EXEMPTION_APPROVAL_REQUIRED');
  if (!nonempty(exemption?.reason)) errors.push('VISUAL_EXEMPTION_REASON_REQUIRED');
  if (['easy_question', 'source_has_no_figure', 'easy question', 'source has no figure'].includes(String(exemption?.reason || '').trim().toLowerCase())) errors.push('VISUAL_EXEMPTION_REASON_TOO_WEAK');
  const identity = exemption?.approvalEvidenceIdentity || exemption?.evidenceIdentity || exemption?.evidenceRef?.path;
  const evidenceSha = exemption?.approvalEvidenceSha256 || exemption?.evidenceSha256 || exemption?.evidenceRef?.sha256;
  if (!nonempty(identity)) errors.push('VISUAL_EXEMPTION_EVIDENCE_IDENTITY_REQUIRED');
  if (!HASH_PATTERN.test(String(evidenceSha || ''))) errors.push('VISUAL_EXEMPTION_EVIDENCE_SHA_REQUIRED');
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function validateDefaultVisualGate(question = {}, { exemption = null } = {}) {
  const need = inferDefaultVisualNeed(question);
  if (!need.required || hasSolutionVisual(question)) return { status: 'PASS', errors: [], need, exempted: false };
  if (exemption) {
    const checked = validateTypedVisualExemption(exemption);
    if (checked.status === 'PASS') return { status: 'PASS', errors: [], need, exempted: true };
    return { status: 'FAIL', errors: checked.errors, need, exempted: false };
  }
  return { status: 'FAIL', errors: ['SOLUTION_VISUAL_MISSING'], need, exempted: false };
}

function visualIdentity(question) {
  return String(question?.sourceIdentityKey || question?.questionUid || question?.id || '');
}

export function validateVisualBaselineNonRegression(baselineQuestions = [], currentQuestions = [], { exemptions = {} } = {}) {
  const current = new Map(currentQuestions.map(question => [visualIdentity(question), question]));
  const regressions = [];
  for (const baseline of baselineQuestions) {
    if (!hasSolutionVisual(baseline)) continue;
    const currentQuestion = current.get(visualIdentity(baseline));
    if (!currentQuestion || !hasSolutionVisual(currentQuestion)) {
      const checked = validateTypedVisualExemption(exemptions[visualIdentity(baseline)]);
      if (checked.status !== 'PASS') regressions.push({ questionUid: visualIdentity(baseline), code: 'VISUAL_BASELINE_REGRESSION' });
    }
  }
  return {
    status: regressions.length ? 'FAIL' : 'PASS',
    errors: regressions.map(item => item.code + ':' + item.questionUid),
    regressions,
  };
}

export function visualBenefitDraft() {
  return { schemaVersion: VISUAL_BENEFIT_VERSION, visualRequirement: null, visualAction: null,
    studentUnderstandingBenefit: null, benefitReasons: [], geometryVisualRole: null,
    expectedVisualType: null, decisiveStep: '', sourceFigurePresence: null,
    sourceFigureUsedAsExemption: false, expectedFacts: [], applicablePolicyRefs: [] };
}

export function validateVisualBenefit(contract, { phase, question, visual, expectedFact, ruleRefs = [] } = {}) {
  const errors = [];
  if (!isObject(contract) || contract.schemaVersion !== VISUAL_BENEFIT_VERSION) return { status: 'FAIL', errors: ['VISUAL_BENEFIT_CONTRACT_REQUIRED'] };
  const c = contract;
  if (!['VISUAL_REQUIRED', 'VISUAL_OPTIONAL', 'VISUAL_EXEMPT'].includes(c.visualRequirement)) errors.push('VISUAL_BENEFIT_REQUIREMENT_INVALID');
  if (!['ADD', 'REBUILD', 'KEEP', 'NONE', 'REMOVE'].includes(c.visualAction)) errors.push('VISUAL_BENEFIT_ACTION_INVALID');
  if (typeof c.studentUnderstandingBenefit !== 'boolean') errors.push('VISUAL_BENEFIT_UNDECIDED');
  if (expectedFact && c.expectedVisualType !== expectedFact.visualType) errors.push('VISUAL_BENEFIT_TYPE_MISMATCH');
  if (!Array.isArray(c.benefitReasons) || !c.benefitReasons.length || c.benefitReasons.some(s => !nonempty(s))) errors.push('VISUAL_BENEFIT_REASON_REQUIRED');
  if (!['PRESENT', 'ABSENT'].includes(c.sourceFigurePresence) || c.sourceFigureUsedAsExemption !== false) errors.push('SOURCE_FIGURE_EXEMPTION_FORBIDDEN');
  if (!nonempty(c.decisiveStep) || !nonempty(c.geometryVisualRole) || !nonempty(c.expectedVisualType)) errors.push('VISUAL_BENEFIT_SEMANTICS_REQUIRED');
  if (!Array.isArray(c.applicablePolicyRefs) || !c.applicablePolicyRefs.length) errors.push('VISUAL_BENEFIT_POLICY_REQUIRED');
  else for (const ref of c.applicablePolicyRefs) if (!nonempty(ref?.version) || !ruleRefs.some(r => r.path === ref.path && r.bytes === ref.bytes && r.sha256 === ref.sha256)) errors.push('VISUAL_BENEFIT_POLICY_UNBOUND');
  if (!['DECISIVE_REASONING', 'DEFINITION_REINFORCEMENT', 'RELATIONSHIP_EXPLANATION', 'REPRESENTATION_SUPPORT', 'SOURCE_RECONSTRUCTION', 'NONE', 'NOT_GEOMETRY'].includes(c.geometryVisualRole)) errors.push('VISUAL_BENEFIT_ROLE_INVALID');
  if (c.visualRequirement === 'VISUAL_OPTIONAL' && c.studentUnderstandingBenefit !== true) errors.push('VISUAL_OPTIONAL_BENEFIT_REQUIRED');
  const wantsVisual = c.studentUnderstandingBenefit === true || c.visualRequirement === 'VISUAL_REQUIRED';
  if (wantsVisual && !['ADD', 'REBUILD', 'KEEP'].includes(c.visualAction)) errors.push('SOLUTION_VISUAL_BENEFIT_IGNORED');
  if (c.visualRequirement === 'VISUAL_EXEMPT' && (c.studentUnderstandingBenefit !== false || !['NONE', 'REMOVE'].includes(c.visualAction))) errors.push('VISUAL_EXEMPT_CONTRADICTION');
  if (!Array.isArray(c.expectedFacts)) errors.push('VISUAL_EXPECTED_FACTS_REQUIRED');
  else {
    if ((wantsVisual || expectedFact) && !c.expectedFacts.length) errors.push('VISUAL_EXPECTED_FACTS_REQUIRED');
    if (c.expectedFacts.some(f => !isObject(f) || !nonempty(f.id) || !nonempty(f.statement) || typeof f.critical !== 'boolean')) errors.push('VISUAL_EXPECTED_FACT_INVALID');
    if (new Set(c.expectedFacts.map(f => f?.id)).size !== c.expectedFacts.length) errors.push('VISUAL_EXPECTED_FACT_DUPLICATE');
    if (wantsVisual && !c.expectedFacts.some(f => f?.critical === true)) errors.push('VISUAL_CRITICAL_FACT_REQUIRED');
  }
  if (phase === 'U3') {
    if (c.visualRequirement !== visual?.requirement || c.visualAction !== visual?.action) errors.push('VISUAL_BENEFIT_FINAL_MAP_MISMATCH');
    const attached = Boolean(question?.solutionImage || /<(?:svg|table|img)\b/i.test(question?.solution || ''));
    if (wantsVisual && !attached) errors.push('SOLUTION_VISUAL_MISSING');
    if (['ADD', 'REBUILD', 'KEEP'].includes(c.visualAction) !== attached) errors.push('VISUAL_BENEFIT_ATTACHMENT_MISMATCH');
    if (question?.solutionImage && (!nonempty(question.solutionImageAlt) || !nonempty(question.solutionImageCaption) || !['small', 'medium', 'large', 'full'].includes(question.solutionImageSize ?? 'medium'))) errors.push('SOLUTION_VISUAL_ACCESSIBILITY_REQUIRED');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors, ...(errors.length ? {} : { contractSha: objectSha(c) }) };
}

export function validateVisualBenefitPair(v1, v3, context) {
  if (context?.independent) {
    // Both reports are independently validated. Numeric expected/observed
    // parity is computed by the closure kernel, never asserted using a peer's
    // hash by the candidate auditor.
    const errors = [
      ...validateVisualBenefit(v1?.payload?.visualBenefit, { ...context, phase: 'U1', expectedFact: v1?.payload?.fact }).errors,
      ...validateVisualBenefit(v3?.payload?.visualBenefit, { ...context, phase: 'U3' }).errors,
    ];
    return { status: errors.length ? 'FAIL' : 'PASS', errors };
  }
  const errors = [
    ...validateVisualBenefit(v1?.payload?.visualBenefit, { ...context, phase: 'U1', expectedFact: v1?.payload?.fact }).errors,
    ...validateVisualBenefit(v3?.payload?.visualBenefit, { ...context, phase: 'U3', expectedFact: v1?.payload?.fact }).errors
  ];
  if (!v1?.payload?.visualBenefit || v3?.payload?.visualBenefit?.v1ContractSha !== objectSha(v1.payload.visualBenefit)) errors.push('VISUAL_BENEFIT_V1_FREEZE_UNBOUND');
  if (v1?.payload?.fact && v3?.payload?.visualBenefit?.expectedFactSha !== objectSha(v1.payload.fact)) errors.push('VISUAL_BENEFIT_EXPECTED_FACT_UNBOUND');
  if (v1?.payload?.visualBenefit && v3?.payload?.visualBenefit &&
      objectSha(v1.payload.visualBenefit.expectedFacts ?? null) !== objectSha(v3.payload.visualBenefit.expectedFacts ?? null)) errors.push('VISUAL_BENEFIT_EXPECTED_FACTS_CHANGED');
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}
