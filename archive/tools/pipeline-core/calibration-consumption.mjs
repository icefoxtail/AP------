import { HASH_PATTERN, canonicalJson, isObject, nonempty, objectSha, readBoundFile } from './canonical.mjs';

export const CALIBRATION_CONSUMPTION_VERSION = 'APMATH_CALIBRATION_CONSUMPTION_BINDING_v1';
export const CALIBRATION_PACKET_VERSION = 'APMATH_PHASE_SAFE_CALIBRATION_PACKET_v1';
export const CALIBRATION_COMPARISON_VERSION = 'APMATH_CALIBRATION_QUALITY_COMPARISON_v1';

export const CALIBRATION_AXES = Object.freeze([
  'schema', 'solutionQuality', 'metadata', 'problemVisual', 'solutionVisual', 'layout'
]);

export const SOLUTION_CALIBRATION_COMPARISON_AXES = Object.freeze([
  'conceptExplained',
  'conditionsInterpreted',
  'intermediateReasoningPreserved',
  'keyIdeaAdequate',
  'reasoningCompleteness',
  'studentReproducibility',
  'caseSplitCompleteness',
  'highLevelLogicJump',
  'subjectiveScoringSufficiency',
  'finalConclusionClarity',
  'curriculumAppropriateness',
  'density'
]);

export const VISUAL_CALIBRATION_COMPARISON_AXES = Object.freeze([
  'studentUnderstandingBenefit',
  'decisiveStepExpression',
  'informationDensity',
  'labelLegibility',
  'mathematicalFactClarity',
  'textVisualConnection',
  'altCaptionAppropriateness',
  'unnecessaryDecoration',
  'schematicSufficiency',
  'productionVisualClarity'
]);

export const PROBLEM_VISUAL_CALIBRATION_COMPARISON_AXES = Object.freeze([
  'cropCompleteness',
  'paddingAdequate',
  'conditionBoxPreserved',
  'visualNotCut',
  'labelsAndAxesNotCut',
  'sourceResolutionAdequate',
  'contextPreserved',
  'notTooTight',
  'notTooWide',
  'studentReadable'
]);

export const LAYOUT_CALIBRATION_COMPARISON_AXES = Object.freeze([
  'problemImageSize',
  'solutionImageSize',
  'textVisualSpacing',
  'formulaReadability',
  'solutionDensity',
  'mobileReadability',
  'excessiveWhitespace',
  'crampedLayout',
  'studentUsable'
]);

export const CALIBRATION_REVIEW_PHASES = Object.freeze(['U1', 'U2', 'U3', 'RENDER_REVIEW']);
export const CALIBRATION_COMPARISON_RESULTS = Object.freeze(['PASS', 'QUALITY_DEFECT', 'BLOCKED', 'NOT_APPLICABLE']);

const PROFILE_FIELDS_BY_AXIS = Object.freeze({
  schema: ['noAnswerOnlySolution'],
  solutionQuality: [
    'conceptExplained', 'conditionsInterpreted', 'intermediateReasoningPreserved',
    'choiceConclusionNumber', 'highLevelNoLogicJump', 'subjectiveStepsSufficient'
  ],
  metadata: [],
  problemVisual: [],
  solutionVisual: ['problemSolutionImagesSeparate', 'beneficialVisualsUsed', 'visualAltCaption', 'visualMathParity'],
  layout: []
});

const AXIS_MINIMUM_STANDARDS = Object.freeze({
  schema: 'Use the current archive schema and keep source/problem/solution fields separate.',
  metadata: 'Preserve curriculum-driven classification granularity and complete naming fields.',
  problemVisual: 'Keep the complete source crop readable with required conditions, labels, figures, and appropriate whitespace.',
  solutionVisual: 'Use a student-helpful instructional visual with readable labels and mathematical fact parity.',
  layout: 'Keep exam, solution, and answer content readable on desktop and mobile without cramped or wasteful placement.'
});

const HASHED = value => HASH_PATTERN.test(String(value || ''));
const unique = values => [...new Set((Array.isArray(values) ? values : []).map(value => String(value)))];
const PHASE_ALLOWED_AXES = Object.freeze({
  U1: [],
  U2: ['problemVisual', 'solutionVisual', 'layout'],
  U3: ['solutionQuality', 'solutionVisual', 'layout', 'metadata'],
  RENDER_REVIEW: ['layout']
});

function normalizeAnchor(anchor) {
  if (typeof anchor === 'string') return anchor;
  if (isObject(anchor) && nonempty(anchor.samplePath) && Number.isSafeInteger(anchor.qid)) return `${anchor.samplePath}|${anchor.qid}`;
  return null;
}

function anchorCatalog(lock) {
  return new Set((lock?.samples || []).flatMap(sample => (sample.questionObservations || []).map(row => `${sample.path}|${row.qid}`)));
}

function profileForAxis(lock, axis) {
  const profile = lock?.productionQualityProfile || {};
  const keys = PROFILE_FIELDS_BY_AXIS[axis] || [];
  const selected = Object.fromEntries(keys.filter(key => profile[key]).map(key => [key, {
    status: profile[key].status,
    minimumStandard: profile[key].minimumStandard,
    sampleAnchors: [...(profile[key].sampleAnchors || [])]
  }]));
  const observations = (lock?.samples || []).flatMap(sample => {
    const observation = sample.checkedAxes?.[axis];
    return observation ? [{ samplePath: sample.path, status: observation.status || 'NOT_TESTED', observation: observation.observation || '' }] : [];
  });
  if (axis !== 'solutionQuality' || !Object.keys(selected).length) return { minimumStandard: AXIS_MINIMUM_STANDARDS[axis] || '', checks: selected, observations };
  return selected;
}

function anchorRows(lock, anchors, phase) {
  const wanted = new Set(anchors);
  return (lock?.samples || []).flatMap(sample => (sample.questionObservations || []).flatMap(row => {
    const anchor = `${sample.path}|${row.qid}`;
    if (!wanted.has(anchor)) return [];
    const visualObservation = Object.fromEntries(
      ['problemVisual', 'solutionVisual', 'layout']
        .map(axis => [axis, sample.checkedAxes?.[axis]?.observation || ''])
        .filter(([, value]) => nonempty(value))
    );
    const value = { anchor, samplePath: sample.path, qid: row.qid, visualObservation };
    if (phase === 'U3') value.solutionExcerpt = row.solutionExcerpt || '';
    return [value];
  }));
}

export function productionQualityProfileSha(lock) {
  return objectSha(lock?.productionQualityProfile || null);
}

export function calibrationIdentityFromLock(lockRef, lock) {
  const referenceSampleLockSha = lockRef?.sha256 || null;
  const frozenMainCommit = lock?.mainCommit || null;
  const productionProfileSha = productionQualityProfileSha(lock);
  return {
    referenceSampleLockSha,
    productionQualityProfileSha: productionProfileSha,
    frozenMainCommit,
    mainCommit: frozenMainCommit
  };
}

export function loadCalibrationIdentity(root, run) {
  if (run?.pipeline !== 'past-exam') return null;
  const authority = run.pastExamAuthority || {};
  const ref = authority.calibrationRef || run.inputs?.find(input => input.role === 'spec' && /reference-sample-lock|calibration|lock/i.test(input.path));
  if (!ref) throw new Error('CALIBRATION_REFERENCE_LOCK_REF_REQUIRED');
  const lock = JSON.parse(readBoundFile(root, ref).toString('utf8'));
  const identity = calibrationIdentityFromLock(ref, lock);
  if (!HASHED(identity.referenceSampleLockSha)) throw new Error('CALIBRATION_REFERENCE_LOCK_SHA_REQUIRED');
  if (!HASHED(identity.productionQualityProfileSha)) throw new Error('CALIBRATION_PROFILE_SHA_REQUIRED');
  if (!/^[0-9a-f]{40,64}$/.test(identity.frozenMainCommit || '')) throw new Error('CALIBRATION_FROZEN_MAIN_COMMIT_REQUIRED');
  if (authority.calibrationSha && authority.calibrationSha !== identity.referenceSampleLockSha) throw new Error('CALIBRATION_REFERENCE_LOCK_SHA_MISMATCH');
  if (authority.productionQualityProfileSha && authority.productionQualityProfileSha !== identity.productionQualityProfileSha) throw new Error('CALIBRATION_PROFILE_SHA_MISMATCH');
  return { ...identity, lockRef: ref, lock };
}

export function calibrationRequiredAxesForReviewAxis(axis, question = {}) {
  const normalized = String(axis || '').toUpperCase();
  const hasProblemVisual = Boolean(question.problemAssetPaths?.length || question.visual?.problemVisualMathDependency);
  const hasSolutionVisual = Boolean(question.solutionAssetPaths?.length || question.visual?.actualSolutionVisualAttached || question.visual?.requirement === 'VISUAL_REQUIRED');
  if (normalized === 'SOLUTION') return ['solutionQuality'];
  if (normalized === 'V2') return [...(hasProblemVisual ? ['problemVisual'] : []), ...(hasSolutionVisual ? ['solutionVisual'] : [])];
  if (normalized === 'V3') return hasSolutionVisual ? ['solutionVisual'] : [];
  if (normalized === 'RENDER_REVIEW') return ['layout'];
  return [];
}

export function calibrationComparisonChecksForReviewAxis(axis, question = {}) {
  const normalized = String(axis || '').toUpperCase();
  const hasProblemVisual = Boolean(question.problemAssetPaths?.length || question.visual?.problemVisualMathDependency);
  const hasSolutionVisual = Boolean(question.solutionAssetPaths?.length || question.visual?.actualSolutionVisualAttached || question.visual?.requirement === 'VISUAL_REQUIRED');
  if (normalized === 'SOLUTION') return [...SOLUTION_CALIBRATION_COMPARISON_AXES];
  if (normalized === 'V2') return [...(hasProblemVisual ? PROBLEM_VISUAL_CALIBRATION_COMPARISON_AXES : []), ...(hasSolutionVisual ? VISUAL_CALIBRATION_COMPARISON_AXES : [])];
  if (normalized === 'V3') return hasSolutionVisual ? [...VISUAL_CALIBRATION_COMPARISON_AXES] : [];
  if (normalized === 'RENDER_REVIEW') return [...LAYOUT_CALIBRATION_COMPARISON_AXES];
  return [];
}

export function calibrationRequiredForAxis(axis, question = {}, pipeline = null) {
  return pipeline === 'past-exam' && calibrationRequiredAxesForReviewAxis(axis, question).length > 0;
}

export function createCalibrationConsumptionBinding({
  referenceSampleLockSha,
  productionQualityProfileSha: profileSha,
  frozenMainCommit,
  consumedCalibrationAxes,
  reviewerPhase,
  comparisonResult,
  comparisonReason,
  referenceAnchorsUsed,
  qualityFloorComparison = null
}) {
  const normalizedAnchors = unique((referenceAnchorsUsed || []).map(normalizeAnchor).filter(Boolean));
  const binding = {
    schemaVersion: CALIBRATION_CONSUMPTION_VERSION,
    referenceSampleLockSha,
    productionQualityProfileSha: profileSha,
    frozenMainCommit,
    consumedCalibrationAxes: unique(consumedCalibrationAxes),
    reviewerPhase,
    comparisonResult,
    comparisonReason,
    referenceAnchorsUsed: normalizedAnchors
  };
  if (qualityFloorComparison !== null) binding.qualityFloorComparison = structuredClone(qualityFloorComparison);
  return binding;
}

export function validateQualityFloorComparison(comparison, { requiredChecks = [] } = {}) {
  const errors = [];
  if (comparison === null || comparison === undefined) return { status: 'PASS', errors };
  if (!isObject(comparison) || comparison.schemaVersion !== CALIBRATION_COMPARISON_VERSION) errors.push('CALIBRATION_COMPARISON_SCHEMA_INVALID');
  if (!['PASS', 'QUALITY_DEFECT', 'BLOCKED', 'NOT_APPLICABLE'].includes(comparison?.result)) errors.push('CALIBRATION_COMPARISON_RESULT_INVALID');
  if (!isObject(comparison?.checks)) errors.push('CALIBRATION_COMPARISON_CHECKS_REQUIRED');
  for (const key of requiredChecks) {
    const row = comparison?.checks?.[key];
    if (!isObject(row) || !['PASS', 'QUALITY_DEFECT', 'BLOCKED', 'NOT_APPLICABLE'].includes(row.status) || !nonempty(row.reason)) errors.push(`CALIBRATION_COMPARISON_CHECK_INVALID:${key}`);
  }
  const failed = Object.entries(comparison?.checks || {}).filter(([, row]) => ['QUALITY_DEFECT', 'BLOCKED'].includes(row?.status));
  if (comparison?.result === 'PASS' && failed.length) errors.push('CALIBRATION_COMPARISON_PASS_WITH_DEFECT');
  if (comparison?.result === 'PASS' && requiredChecks.some(key => !['PASS', 'NOT_APPLICABLE'].includes(comparison?.checks?.[key]?.status))) errors.push('CALIBRATION_COMPARISON_REQUIRED_CHECK_NOT_PASS');
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors };
}

export function validateCalibrationConsumptionBinding(binding, {
  expectedIdentity = null,
  reviewerPhase = null,
  requiredAxes = [],
  requirePass = true,
  anchorCatalog: allowedAnchors = null,
  requiredComparisonChecks = []
} = {}) {
  const errors = [];
  if (!isObject(binding)) return { status: 'BLOCKED', errors: ['CALIBRATION_CONSUMPTION_BINDING_REQUIRED'] };
  if (binding.schemaVersion !== CALIBRATION_CONSUMPTION_VERSION) errors.push('CALIBRATION_CONSUMPTION_SCHEMA_INVALID');
  for (const field of ['referenceSampleLockSha', 'productionQualityProfileSha']) if (!HASHED(binding[field])) errors.push(`CALIBRATION_CONSUMPTION_HASH_INVALID:${field}`);
  if (!/^[0-9a-f]{40,64}$/.test(binding.frozenMainCommit || '')) errors.push('CALIBRATION_CONSUMPTION_MAIN_COMMIT_INVALID');
  if (!CALIBRATION_REVIEW_PHASES.includes(binding.reviewerPhase)) errors.push('CALIBRATION_CONSUMPTION_PHASE_INVALID');
  if (reviewerPhase && binding.reviewerPhase !== reviewerPhase) errors.push('CALIBRATION_CONSUMPTION_PHASE_MISMATCH');
  if (!Array.isArray(binding.consumedCalibrationAxes) || !binding.consumedCalibrationAxes.length || new Set(binding.consumedCalibrationAxes).size !== binding.consumedCalibrationAxes.length || binding.consumedCalibrationAxes.some(axis => !CALIBRATION_AXES.includes(axis))) errors.push('CALIBRATION_CONSUMED_AXES_INVALID');
  for (const axis of requiredAxes) if (!binding.consumedCalibrationAxes?.includes(axis)) errors.push(`CALIBRATION_AXIS_NOT_CONSUMED:${axis}`);
  if (PHASE_ALLOWED_AXES[binding.reviewerPhase] && binding.consumedCalibrationAxes?.some(axis => !PHASE_ALLOWED_AXES[binding.reviewerPhase].includes(axis))) errors.push('CALIBRATION_PHASE_AXIS_FORBIDDEN');
  if (!CALIBRATION_COMPARISON_RESULTS.includes(binding.comparisonResult)) errors.push('CALIBRATION_COMPARISON_RESULT_INVALID');
  if (!nonempty(binding.comparisonReason)) errors.push('CALIBRATION_COMPARISON_REASON_REQUIRED');
  if (!Array.isArray(binding.referenceAnchorsUsed) || new Set(binding.referenceAnchorsUsed).size !== binding.referenceAnchorsUsed.length || binding.referenceAnchorsUsed.some(anchor => !normalizeAnchor(anchor))) errors.push('CALIBRATION_REFERENCE_ANCHORS_INVALID');
  if (allowedAnchors && binding.referenceAnchorsUsed?.some(anchor => !allowedAnchors.has(normalizeAnchor(anchor)))) errors.push('CALIBRATION_REFERENCE_ANCHOR_NOT_FROZEN');
  if (expectedIdentity) {
    for (const field of ['referenceSampleLockSha', 'productionQualityProfileSha', 'frozenMainCommit']) if (binding[field] !== expectedIdentity[field]) errors.push(`CALIBRATION_CONSUMPTION_IDENTITY_MISMATCH:${field}`);
  }
  if (requirePass && binding.comparisonResult !== 'PASS') errors.push(`CALIBRATION_QUALITY_FLOOR_${binding.comparisonResult || 'MISSING'}`);
  const comparison = validateQualityFloorComparison(binding.qualityFloorComparison, { requiredChecks: requiredComparisonChecks });
  if (requiredComparisonChecks.length && !binding.qualityFloorComparison) errors.push('CALIBRATION_COMPARISON_REQUIRED');
  errors.push(...comparison.errors);
  if (binding.qualityFloorComparison?.result && binding.qualityFloorComparison.result !== binding.comparisonResult) errors.push('CALIBRATION_COMPARISON_BINDING_MISMATCH');
  if (requirePass && binding.qualityFloorComparison && binding.qualityFloorComparison.result !== 'PASS') errors.push('CALIBRATION_QUALITY_FLOOR_COMPARISON_NOT_PASS');
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors };
}

export function buildPhaseSafeCalibrationPacket({
  lock,
  lockRef,
  reviewerPhase,
  consumedCalibrationAxes,
  comparisonResult = 'PASS',
  comparisonReason = 'Frozen production quality profile consumed as a phase-safe quality floor.',
  referenceAnchorsUsed = [],
  qualityFloorComparison = null
}) {
  if (reviewerPhase === 'U1') throw new Error('CALIBRATION_U1_FORBIDDEN');
  const identity = calibrationIdentityFromLock(lockRef, lock);
  const binding = createCalibrationConsumptionBinding({ ...identity, consumedCalibrationAxes, reviewerPhase, comparisonResult, comparisonReason, referenceAnchorsUsed, qualityFloorComparison });
  const safeAxes = unique(consumedCalibrationAxes).filter(axis => CALIBRATION_AXES.includes(axis));
  const profile = Object.fromEntries(safeAxes.map(axis => [axis, profileForAxis(lock, axis)]));
  return {
    schemaVersion: CALIBRATION_PACKET_VERSION,
    phase: reviewerPhase,
    calibrationConsumption: binding,
    productionQualityProfile: profile,
    referenceAnchors: anchorRows(lock, binding.referenceAnchorsUsed, reviewerPhase)
  };
}

export function validatePhaseSafeCalibrationPacket(packet, {
  expectedIdentity = null,
  reviewerPhase = null,
  requiredAxes = [],
  requirePass = true,
  allowedAnchors = null,
  requiredComparisonChecks = []
} = {}) {
  const errors = [];
  if (!isObject(packet) || packet.schemaVersion !== CALIBRATION_PACKET_VERSION) errors.push('CALIBRATION_PACKET_SCHEMA_INVALID');
  if (reviewerPhase && packet?.phase !== reviewerPhase) errors.push('CALIBRATION_PACKET_PHASE_MISMATCH');
  const binding = packet?.calibrationConsumption;
  errors.push(...validateCalibrationConsumptionBinding(binding, { expectedIdentity, reviewerPhase, requiredAxes, requirePass, anchorCatalog: allowedAnchors, requiredComparisonChecks }).errors);
  if (!isObject(packet?.productionQualityProfile)) errors.push('CALIBRATION_PROFILE_PACKET_REQUIRED');
  if (!Array.isArray(packet?.referenceAnchors)) errors.push('CALIBRATION_ANCHOR_PACKET_REQUIRED');
  else {
    const bindingAnchors = new Set(binding?.referenceAnchorsUsed || []);
    for (const row of packet.referenceAnchors) if (!bindingAnchors.has(row?.anchor)) errors.push('CALIBRATION_ANCHOR_PACKET_BINDING');
    if (reviewerPhase === 'U3') for (const row of packet.referenceAnchors) if (!nonempty(row?.solutionExcerpt)) errors.push('CALIBRATION_U3_SOLUTION_ANCHOR_REQUIRED');
    if (reviewerPhase === 'U2') for (const row of packet.referenceAnchors) if (Object.hasOwn(row || {}, 'solutionExcerpt')) errors.push('CALIBRATION_U2_SOLUTION_EXCERPT_FORBIDDEN');
  }
  const walkForbidden = (value, phase) => {
    if (Array.isArray(value)) return value.forEach(item => walkForbidden(item, phase));
    if (!isObject(value)) return;
    for (const [key, nested] of Object.entries(value)) {
      const normalized = key.toLowerCase().replace(/[^a-z]/g, '');
      if (phase === 'U2' && ['answer', 'currentanswer', 'solution', 'currentsolution', 'referenceanswer', 'referencesolution'].includes(normalized)) errors.push(`CALIBRATION_U2_BLIND_LEAK:${key}`);
      walkForbidden(nested, phase);
    }
  };
  walkForbidden(packet, reviewerPhase);
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors };
}

export function selectCalibrationAnchors(lock, question = {}, { max = 3 } = {}) {
  const rows = (lock?.samples || []).flatMap(sample => (sample.questionObservations || []).map(row => ({ sample, row, anchor: `${sample.path}|${row.qid}` })));
  const score = ({ sample, row }) => {
    let value = 0;
    if (question.standardCourse && row.standardCourse === question.standardCourse) value += 64;
    if (question.standardUnitKey && row.standardUnitKey === question.standardUnitKey) value += 32;
    if (question.subUnitKey && row.subUnitKey === question.subUnitKey) value += 16;
    if (question.questionType && row.questionType === question.questionType) value += 8;
    if (question.level && row.level === question.level) value += 4;
    if (Array.isArray(question.choices) && Boolean(question.choices.length) === Boolean(row.choicesPresent)) value += 2;
    if (Object.hasOwn(question, 'solutionImage') || question.solutionAssetPaths) if (Boolean(question.solutionImage || question.solutionAssetPaths?.length) === Boolean(row.solutionImagePresent)) value += 1;
    if (sample.standardCourse?.includes?.(question.standardCourse)) value += 1;
    return value;
  };
  return rows.map(item => ({ ...item, score: score(item) })).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.anchor.localeCompare(b.anchor)).slice(0, max).map(item => item.anchor);
}

export function calibrationBindingsEqual(left, right) {
  if (!left || !right) return false;
  const fields = ['referenceSampleLockSha', 'productionQualityProfileSha', 'frozenMainCommit', 'reviewerPhase'];
  return fields.every(field => left[field] === right[field])
    && canonicalJson([...left.consumedCalibrationAxes].sort()) === canonicalJson([...right.consumedCalibrationAxes].sort())
    && canonicalJson([...left.referenceAnchorsUsed].sort()) === canonicalJson([...right.referenceAnchorsUsed].sort())
    && canonicalJson(left.qualityFloorComparison || null) === canonicalJson(right.qualityFloorComparison || null);
}
