import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createExecutionIdentity,
  validateModelRouteParity,
  evaluateGoldSourceEligibility,
  criticalFactCoverage,
  validateGeneratorProvenance,
  classifyMachineEvidenceFreshness,
  validateVisualLifecycle,
} from '../gold-contract.mjs';

const observedAt = {
  modelRouteObservedAtStart: '2026-09-10T00:00:00.000Z',
  modelRouteObservedAtClosure: '2026-09-10T00:01:00.000Z',
};

test('GOLD requested Luna xhigh and actual Astra high fail model route parity', () => {
  const result = validateModelRouteParity({ ...createExecutionIdentity({ jobKind: 'GOLD' }), actualModel: 'gpt-6-astra', actualReasoningEffort: 'high', ...observedAt });
  assert.equal(result.MODEL_ROUTE_PARITY, 'FAIL');
  assert.ok(result.errors.includes('MODEL_ROUTE_PARITY'));
});

test('GOLD requested Luna xhigh and actual Luna xhigh pass model route parity', () => {
  const result = validateModelRouteParity({ ...createExecutionIdentity({ jobKind: 'GOLD' }), actualModel: 'gpt-5.6-luna', actualReasoningEffort: 'xhigh', ...observedAt });
  assert.equal(result.status, 'PASS');
  assert.equal(result.MODEL_ROUTE_PARITY, 'PASS');
});

test('a mid-run route change is explicitly invalid benchmark evidence', () => {
  const result = validateModelRouteParity({ ...createExecutionIdentity({ jobKind: 'GOLD' }), actualModel: 'gpt-5.6-luna', actualReasoningEffort: 'xhigh', ...observedAt, modelRouteChanged: true });
  assert.equal(result.MODEL_ROUTE_PARITY, 'FAIL');
  assert.equal(result.routeStatus, 'MIXED_MODEL_ROUTE');
  assert.ok(result.errors.includes('MODEL_ROUTE_CHANGED'));
});

test('model route observation is required and cannot be guessed', () => {
  const result = validateModelRouteParity(createExecutionIdentity({ jobKind: 'GOLD' }), observedAt);
  assert.equal(result.MODEL_ROUTE_PARITY, 'FAIL');
  assert.ok(result.errors.includes('MODEL_ROUTE_NOT_OBSERVED'));
});

test('V4 GOLD accepts PDF with source pixel render evidence', () => {
  const result = evaluateGoldSourceEligibility({ pdfPath: 'source/2020.pdf', sourcePixelRenderAvailable: true });
  assert.equal(result.status, 'GOLD_ELIGIBLE');
  assert.equal(result.SOURCE_FORMAT, 'PDF');
  assert.equal(result.SOURCE_PIXEL_RENDER_AVAILABLE, true);
  assert.equal(result.denominatorIncluded, true);
  assert.equal(result.benchmarkEligible, true);
});

test('HWP and HWPX are ineligible benchmark sources without removing production capability', () => {
  for (const sourceFormat of ['HWP', 'HWPX']) {
    const result = evaluateGoldSourceEligibility({ sourceFormat, sourcePixelRenderAvailable: true });
    assert.equal(result.status, 'GOLD_INELIGIBLE_SOURCE_FORMAT');
    assert.equal(result.denominatorIncluded, false);
  }
});

test('critical expected fact coverage fails closed when three expected facts have only two observations', () => {
  const result = criticalFactCoverage([
    { id: 'asymptote', statement: '점근선', critical: true },
    { id: 'point', statement: '점', critical: true },
    { id: 'symmetry_axis', statement: '대칭축', critical: true },
  ], [{ id: 'asymptote', status: 'OBSERVED' }, { id: 'point', status: 'OBSERVED' }]);
  assert.equal(result.EXPECTED_CRITICAL_FACT_COUNT, 3);
  assert.equal(result.OBSERVED_CRITICAL_FACT_COUNT, 2);
  assert.equal(result.CRITICAL_FACT_COVERAGE, 2 / 3);
  assert.equal(result.EXPECTED_OBSERVED_FACT_PARITY, 'FAIL');
});

test('V1 ADD with no asset fails lifecycle closure', () => {
  const result = validateVisualLifecycle({ action: 'ADD', attached: false, requiredAxes: ['V1', 'V3'], evidenceByAxis: {} });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('V1_ADD_ASSET_MISSING'));
  assert.ok(result.errors.includes('V1_ADD_V2_REVIEW_REQUIRED'));
  assert.ok(result.errors.includes('V1_ADD_V3_REVIEW_REQUIRED'));
});

test('generated asset that is not linked by the candidate fails lifecycle closure', () => {
  const result = validateVisualLifecycle({ action: 'ADD', attached: true, solutionAssetPaths: ['assets/generated.svg'], requiredAxes: ['V2', 'V3'], evidenceByAxis: { V2: { status: 'PASS' }, V3: { status: 'PASS' } }, generatedArtifactSha: 'sha256:' + '1'.repeat(64), assetRefs: [{ path: 'assets/generated.svg', sha256: 'sha256:' + '1'.repeat(64) }], candidateSolutionImage: null });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('GENERATED_ASSET_CANDIDATE_NOT_LINKED'));
});

test('candidate mutation makes old machine evidence stale until recollection', () => {
  const result = classifyMachineEvidenceFreshness({ inputSha: 'sha256:' + 'a'.repeat(64), axisInputSha: 'sha256:' + 'b'.repeat(64), machineProvenance: { currentArtifactSha: 'sha256:' + 'c'.repeat(64) }, payload: { currentArtifactSha: 'sha256:' + 'c'.repeat(64) } }, { runInputSha: 'sha256:' + 'd'.repeat(64), axisInputSha: 'sha256:' + 'e'.repeat(64), currentArtifactSha: 'sha256:' + 'f'.repeat(64) });
  assert.equal(result.status, 'STALE');
  assert.ok(result.errors.includes('EVIDENCE_INPUT_SHA_CURRENT_ARTIFACT_MISMATCH'));
});

test('generator provenance must resolve to a bound repository path and SHA', () => {
  const sha = 'sha256:' + '2'.repeat(64);
  assert.equal(validateGeneratorProvenance({ generatorPath: 'missing/generator.py', generatorSha: sha }, [{ role: 'generator', path: 'archive/tools/pipeline-core/generator.py', sha256: sha }]).status, 'FAIL');
  assert.equal(validateGeneratorProvenance({ generatorPath: 'pipeline-core/generator.py', generatorSha: sha }, [{ role: 'generator', path: 'archive/tools/pipeline-core/generator.py', sha256: sha }]).status, 'PASS');
});
