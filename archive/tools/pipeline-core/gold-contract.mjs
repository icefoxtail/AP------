import path from 'node:path';
import { HASH_PATTERN, isObject, nonempty } from './canonical.mjs';

export const GOLD_JOB_KINDS = Object.freeze(['GOLD', 'PILOT', 'BENCHMARK', 'HOLDOUT']);
export const DEFAULT_V4_GOLD_MODEL = 'gpt-5.6-luna';
export const DEFAULT_V4_GOLD_REASONING_EFFORT = 'xhigh';
export const GOLD_CONTRACT_VERSION = 'APMATH_GOLD_EXECUTION_CONTRACT_v1';

export const isBenchmarkJobKind = value => GOLD_JOB_KINDS.includes(String(value || '').trim().toUpperCase());

const nonemptyString = value => typeof value === 'string' && value.trim().length > 0;

export function createExecutionIdentity({
  jobKind = 'PRODUCTION',
  requestedModel = null,
  requestedReasoningEffort = null,
} = {}) {
  const normalizedKind = String(jobKind || 'PRODUCTION').trim().toUpperCase();
  const benchmark = isBenchmarkJobKind(normalizedKind);
  return {
    schemaVersion: GOLD_CONTRACT_VERSION,
    jobKind: normalizedKind,
    requestedModel: requestedModel || (normalizedKind === 'GOLD' ? DEFAULT_V4_GOLD_MODEL : null),
    requestedReasoningEffort: requestedReasoningEffort || (normalizedKind === 'GOLD' ? DEFAULT_V4_GOLD_REASONING_EFFORT : null),
    actualModel: null,
    actualReasoningEffort: null,
    modelRouteObservedAtStart: null,
    modelRouteObservedAtClosure: null,
    modelRouteChanged: false,
    routeStatus: benchmark ? 'NOT_OBSERVED' : 'NOT_APPLICABLE',
    MODEL_ROUTE_PARITY: benchmark ? 'FAIL' : 'NOT_APPLICABLE',
  };
}

export function observeModelRoute(value, observedAt = null) {
  return {
    actualModel: nonemptyString(value?.actualModel) ? value.actualModel.trim() : nonemptyString(value?.model) ? value.model.trim() : null,
    actualReasoningEffort: nonemptyString(value?.actualReasoningEffort) ? value.actualReasoningEffort.trim() : nonemptyString(value?.reasoningEffort) ? value.reasoningEffort.trim() : null,
    observedAt: observedAt || value?.modelRouteObservedAt || value?.observedAt || null,
  };
}

export function validateModelRouteParity(identity, {
  modelRouteChanged = identity?.modelRouteChanged === true,
  modelRouteObservedAtStart = identity?.modelRouteObservedAtStart,
  modelRouteObservedAtClosure = identity?.modelRouteObservedAtClosure,
} = {}) {
  const errors = [];
  if (!isBenchmarkJobKind(identity?.jobKind)) return { status: 'PASS', routeStatus: 'NOT_APPLICABLE', MODEL_ROUTE_PARITY: 'NOT_APPLICABLE', errors };
  if (!nonemptyString(identity?.requestedModel) || !nonemptyString(identity?.requestedReasoningEffort)) errors.push('MODEL_ROUTE_REQUEST_REQUIRED');
  if (!nonemptyString(identity?.actualModel) || !nonemptyString(identity?.actualReasoningEffort)) errors.push('MODEL_ROUTE_NOT_OBSERVED');
  if (!nonemptyString(modelRouteObservedAtStart) || !nonemptyString(modelRouteObservedAtClosure)) errors.push('MODEL_ROUTE_OBSERVATION_TIME_REQUIRED');
  if (modelRouteChanged) errors.push('MODEL_ROUTE_CHANGED');
  if (identity?.actualModel !== identity?.requestedModel || identity?.actualReasoningEffort !== identity?.requestedReasoningEffort) errors.push('MODEL_ROUTE_PARITY');
  const changed = modelRouteChanged === true;
  return {
    status: errors.length ? 'FAIL' : 'PASS',
    routeStatus: changed ? 'MIXED_MODEL_ROUTE' : errors.length ? 'MODEL_ROUTE_INVALID' : 'VALID',
    MODEL_ROUTE_PARITY: errors.length ? 'FAIL' : 'PASS',
    errors: [...new Set(errors)],
  };
}

function sourceFormatOf(source = {}) {
  if (nonemptyString(source.sourceFormat || source.SOURCE_FORMAT)) return (source.sourceFormat || source.SOURCE_FORMAT).trim().replace(/^\./, '').toUpperCase();
  const candidate = source.pdfPath || source.sourcePath || source.sourceDocumentPath || '';
  return path.extname(String(candidate)).replace(/^\./, '').toUpperCase() || null;
}

export function evaluateGoldSourceEligibility(source = {}) {
  const sourceFormat = sourceFormatOf(source);
  const explicitPixel = source.sourcePixelRenderAvailable ?? source.SOURCE_PIXEL_RENDER_AVAILABLE;
  const sourcePixelRenderAvailable = explicitPixel === true || (explicitPixel === undefined && Array.isArray(source.sourcePageImagePaths) && source.sourcePageImagePaths.length > 0);
  if (sourceFormat !== 'PDF') return { status: 'GOLD_INELIGIBLE_SOURCE_FORMAT', sourceFormat, SOURCE_FORMAT: sourceFormat, sourcePixelRenderAvailable, SOURCE_PIXEL_RENDER_AVAILABLE: sourcePixelRenderAvailable, denominatorIncluded: false, benchmarkEligible: false };
  if (!sourcePixelRenderAvailable) return { status: 'GOLD_INELIGIBLE_SOURCE_PIXEL_RENDER', sourceFormat, SOURCE_FORMAT: sourceFormat, sourcePixelRenderAvailable: false, SOURCE_PIXEL_RENDER_AVAILABLE: false, denominatorIncluded: false, benchmarkEligible: false };
  return { status: 'GOLD_ELIGIBLE', sourceFormat, SOURCE_FORMAT: sourceFormat, sourcePixelRenderAvailable: true, SOURCE_PIXEL_RENDER_AVAILABLE: true, denominatorIncluded: true, benchmarkEligible: true };
}

function observedFactIds(observedFacts) {
  if (!Array.isArray(observedFacts)) return null;
  return new Set(observedFacts.filter(row => {
    if (typeof row === 'string') return true;
    return isObject(row) && (row.status === undefined || row.status === 'OBSERVED' || row.observed === true);
  }).map(row => typeof row === 'string' ? row : row.id).filter(nonemptyString));
}

export function criticalFactCoverage(expectedFacts, observedFacts) {
  const expected = Array.isArray(expectedFacts) ? expectedFacts.filter(fact => fact?.critical === true) : [];
  const observedIds = observedFactIds(observedFacts);
  const observed = observedIds ? expected.filter(fact => observedIds.has(fact.id)) : [];
  const expectedCount = expected.length;
  const observedCount = observed.length;
  const coverage = expectedCount === 0 ? 1 : observedCount / expectedCount;
  const parity = observedIds !== null && observedCount === expectedCount && expected.every(fact => observedIds.has(fact.id));
  return {
    EXPECTED_CRITICAL_FACT_COUNT: expectedCount,
    OBSERVED_CRITICAL_FACT_COUNT: observedCount,
    CRITICAL_FACT_COVERAGE: coverage,
    EXPECTED_OBSERVED_FACT_PARITY: parity ? 'PASS' : 'FAIL',
    expectedCriticalFactIds: expected.map(fact => fact.id),
    observedCriticalFactIds: observed.map(fact => fact.id),
    errors: parity ? [] : ['EXPECTED_OBSERVED_FACT_PARITY'],
  };
}

function pathMatches(actual, declared) {
  const normalize = value => String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
  const a = normalize(actual), d = normalize(declared);
  return a === d || a.endsWith(`/${d}`) || d.endsWith(`/${a}`);
}

export function validateGeneratorProvenance(witness, generatorRefs = []) {
  const errors = [];
  const generatorPath = witness?.generatorPath || witness?.generator;
  const generator = generatorRefs.find(ref => ref?.role === undefined || ref?.role === 'generator' ? pathMatches(ref.path, generatorPath) : false);
  if (!nonemptyString(generatorPath) || !generator) errors.push('GENERATOR_PROVENANCE_UNRESOLVABLE');
  if (generator && (!HASH_PATTERN.test(witness?.generatorSha || '') || witness.generatorSha !== generator.sha256)) errors.push('GENERATOR_PROVENANCE_SHA_MISMATCH');
  return { status: errors.length ? 'FAIL' : 'PASS', resolvable: !errors.includes('GENERATOR_PROVENANCE_UNRESOLVABLE'), errors: [...new Set(errors)], generatorPath: generatorPath || null, generatorRef: generator || null };
}

export function classifyMachineEvidenceFreshness(evidence, { runInputSha, axisInputSha, currentArtifactSha } = {}) {
  const errors = [];
  if (evidence?.inputSha !== runInputSha) errors.push('EVIDENCE_INPUT_SHA_STALE');
  if (evidence?.axisInputSha !== axisInputSha) errors.push('EVIDENCE_AXIS_INPUT_SHA_STALE');
  if (evidence?.machineProvenance?.currentArtifactSha !== currentArtifactSha || evidence?.payload?.currentArtifactSha !== currentArtifactSha) errors.push('EVIDENCE_INPUT_SHA_CURRENT_ARTIFACT_MISMATCH');
  return { status: errors.length ? 'STALE' : 'CURRENT', errors: [...new Set(errors)] };
}

export function validateVisualLifecycle({ action, attached, solutionAssetPaths = [], requiredAxes = [], evidenceByAxis = {}, generatedArtifactSha = null, assetRefs = [], candidateSolutionImage = null, lifecycleException = null } = {}) {
  const errors = [];
  const explicitLifecycleException = lifecycleException?.valid === true && ['DEFECT', 'HOLD', 'RECLASSIFICATION'].includes(lifecycleException.status);
  const v2 = evidenceByAxis.V2;
  const v3 = evidenceByAxis.V3;
  if (!explicitLifecycleException && ['ADD', 'REBUILD', 'KEEP'].includes(action) && !attached) errors.push('VISUAL_ACTION_PARITY');
  if (['NONE', 'REMOVE'].includes(action) && attached) errors.push('VISUAL_ACTION_PARITY');
  if (action === 'ADD' && !explicitLifecycleException) {
    if (!solutionAssetPaths.length || !attached) errors.push('V1_ADD_ASSET_MISSING');
    if (!requiredAxes.includes('V2') || !v2 || v2.status !== 'PASS' || v2.payload?.reviewStatus === 'NOT_TESTED' || v2.payload?.notTested === true || v2.payload?.artifactStatus === 'NOT_TESTED') errors.push('V1_ADD_V2_REVIEW_REQUIRED');
    if (!v3 || v3.status !== 'PASS') errors.push('V1_ADD_V3_REVIEW_REQUIRED');
  }
  if (generatedArtifactSha) {
    const matches = assetRefs.filter(ref => ref?.sha256 === generatedArtifactSha);
    const linked = matches.some(ref => solutionAssetPaths.includes(ref.path) && (candidateSolutionImage === ref.path || candidateSolutionImage === ref.path.replace(/^archive\//, '') || candidateSolutionImage === ref.path.replace(/^.*?(assets\/)/, '$1')));
    if (!matches.length || !linked) errors.push('GENERATED_ASSET_CANDIDATE_NOT_LINKED');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)] };
}
