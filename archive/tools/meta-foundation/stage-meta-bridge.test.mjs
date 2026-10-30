import test from 'node:test';
import assert from 'node:assert/strict';
import { checkResolverProjectionParity, evaluateMetaStage } from './stage-meta-bridge.mjs';

const resolution = {
  semanticStatus: 'FINAL', projectionStatus: 'PROJECTION_REUSE',
  problemTypeKey: 'PT_LIMIT_VALUE_CALC', templateKey: 'TPL_LIMIT_GEOMETRY_PARAMETERIZATION'
};
const candidate = {
  problemTypeKey: 'PT_LIMIT_VALUE_CALC', templateKey: 'TPL_LIMIT_GEOMETRY_PARAMETERIZATION',
  crossConceptKeys: ['CC_TRIANGLE_AREA', 'CC_PIECEWISE_FUNCTION']
};
test('valid resolver projection preserves cross concepts as a separate axis', () => {
  assert.deepEqual(checkResolverProjectionParity(resolution, candidate), []);
});
test('wrong PT is rejected rather than guessed from a supporting concept', () => {
  assert.match(checkResolverProjectionParity(resolution, { ...candidate, problemTypeKey: 'PT_DERIVATIVE_DEFINITION' }).join(','), /PROBLEMTYPEKEY_MISMATCH/);
});
test('wrong TPL is rejected independently of PT', () => {
  assert.match(checkResolverProjectionParity(resolution, { ...candidate, templateKey: 'TPL_DERIVATIVE_LIMIT_REDUCTION' }).join(','), /TEMPLATEKEY_MISMATCH/);
});
test('unregistered curriculum binding cannot be promoted by manually supplying active PT', () => {
  const pending = { ...resolution, projectionStatus: 'PROJECTION_BINDING_PENDING', problemTypeKey: '', templateKey: '' };
  assert.ok(checkResolverProjectionParity(pending, candidate).length > 0);
  const built = { resolverEvidence: pending, validation: { status: 'PASS' } };
  const result = evaluateMetaStage({ stage: 'R2', built });
  assert.equal(result.metaStatus, 'PROJECTION_PENDING');
  assert.equal(result.stageQualityPass, false);
});
test('duplicate cross concepts fail rather than pretending to be evidence', () => {
  assert.ok(checkResolverProjectionParity(resolution, { ...candidate, crossConceptKeys: ['CC_TRIANGLE_AREA','CC_TRIANGLE_AREA'] }).includes('META_CROSSCONCEPT_DUPLICATE'));
});
test('resolver alone is not R3 meta PASS', () => {
  const built = { resolverEvidence: resolution, validation: { status: 'PASS' } };
  assert.equal(evaluateMetaStage({ stage: 'R3', built }).metaStatus, 'EVIDENCE_INCOMPLETE');
  assert.equal(evaluateMetaStage({ stage: 'CREATE', built }).metaStatus, 'RESOLVER_ONLY');
});
