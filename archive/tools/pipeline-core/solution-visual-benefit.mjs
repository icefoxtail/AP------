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
  question?.solution,
].filter(nonempty).join(' ').toLowerCase();

export function inferDefaultVisualNeed(question = {}) {
  const explicit = String(question.visualNeed || question.visual?.visualNeed || '').trim().toUpperCase();
  if (DEFAULT_VISUAL_NEED_TYPES.includes(explicit)) return { type: explicit, required: true, source: 'EXPLICIT_PIPELINE_POLICY' };
  const strongRequirement = String(question.visual?.requirement || '').trim().toUpperCase();
  if (strongRequirement === 'VISUAL_REQUIRED') {
    const declaredType = [explicit, question.visual?.expectedVisualType].map(value => String(value || '').trim().toUpperCase()).find(value => DEFAULT_VISUAL_NEED_TYPES.includes(value));
    return { type: declaredType || 'VISUAL_REQUIRED', required: true, source: 'EXPLICIT_VISUAL_REQUIREMENT' };
  }
  const text = visualText(question);
  const unitText = [question?.standardUnit, question?.subUnit, question?.category].filter(nonempty).join(' ').toLowerCase();

  // A unit-level policy can be stronger than the generic classifier. Keep it
  // explicit and narrow: course names or one isolated word such as 함수 or
  // 좌표 are not enough to manufacture a visual obligation.
  if (/도형의\s*방정식|coordinate\s*geometry|analytic\s*geometry/.test(unitText)) {
    return { type: 'GEOMETRY_BASED', required: true, source: 'UNIT_SPECIFIC_POLICY' };
  }

  // These predicates describe a visual operation or relationship, not merely
  // a topic label. In particular, 함수/좌표/구간/역함수/합성함수 alone do not
  // match any predicate below.
  const graphInterpretation = [
    /그래프(?:를|에|의|상|로|와|에서)/,
    /그래프.{0,24}(그려|읽|해석|비교|이용|나타내|교점|절편|꼭짓점|영역)/,
    /(절편|꼭짓점|점근선|사분면|교점).{0,24}(구하|찾|읽|비교|그래프|위치|개수)/,
    /(영역|넓이).{0,24}(그래프|곡선|직선|좌표평면)/,
    /(함수|곡선).{0,24}(교점|절편|꼭짓점|점근선|사분면|그래프)/,
    /graph.{0,24}(intercept|vertex|intersection|asymptote|plot|read|interpret)/i,
  ].some(pattern => pattern.test(text));
  if (graphInterpretation) return { type: 'GRAPH_BASED', required: true, source: 'SEMANTIC_VISUAL_POLICY' };

  const inequalityInterpretation = [
    /해집합/,
    /수직선/,
    /부호\s*(?:표|구간)/,
    /(부등식|부등).{0,28}(해|범위|구간|영역|경계|포함|제외).{0,28}(나타내|표시|겹치|공통|그리|읽|비교)/,
    /(경계|끝점).{0,16}(포함|제외|열린|닫힌)/,
    /(영역|구간).{0,24}(그래프|수직선|부등식|해집합)/,
    /inequalit.{0,24}(number\s*line|solution\s*set|sign\s*chart|boundary|region)/i,
  ].some(pattern => pattern.test(text));
  if (inequalityInterpretation) return { type: 'INEQUALITY_BASED', required: true, source: 'SEMANTIC_VISUAL_POLICY' };

  const geometryInterpretation = [
    /접선/,
    /반지름/,
    /대칭\s*이동|대칭이동/,
    /최단\s*거리|자취|위치\s*관계/,
    /(평행|수직).{0,24}(직선|선분|두\s*직선|관계|조건)/,
    /(점|직선|원|삼각형|도형).{0,24}(거리|교점|접선|반지름|평행|수직|대칭|이동|자취|위치)/,
    /geometry.{0,24}(distance|parallel|perpendicular|tangent|radius|locus|symmetr|position)/i,
  ].some(pattern => pattern.test(text));
  if (geometryInterpretation) return { type: 'GEOMETRY_BASED', required: true, source: 'SEMANTIC_VISUAL_POLICY' };

  if (explicit === 'NONE' || explicit === 'OPTIONAL') return { type: 'NONE', required: false, source: 'EXPLICIT_EXEMPTION_AFTER_SEMANTIC_CHECK' };
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
