import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { capabilityForRoute, recoveryCapabilityRegistry } from '../recovery-capability.mjs';
import { buildRepairPlan, routeDefect, routeDefects } from '../defect-router.mjs';

const root = path.resolve(process.cwd());

test('recovery capability registry probes executable handlers instead of trusting ACTIVE text', () => {
  const registry = recoveryCapabilityRegistry(root, { inputReady: true });
  assert.deepEqual(registry.routes.map(row => row.route), [
    'SOURCE_FIDELITY_RESTORATION',
    'ANSWER_KEY_RECOVERY',
    'DERIVED_SOURCE_RECOVERY',
    'CANDIDATE_REPAIR',
    'VISUAL_EVIDENCE_REPAIR',
    'AUTHORITY_BINDING_REPAIR',
    'EXECUTION_RECOVERY',
  ]);
  const derived = capabilityForRoute(registry, 'DERIVED_SOURCE_RECOVERY');
  assert.equal(derived.implemented, false);
  assert.equal(derived.available, false);
  assert.equal(derived.reason, 'PRODUCER_NOT_IMPLEMENTED');
  for (const route of ['AUTHORITY_BINDING_REPAIR', 'EXECUTION_RECOVERY', 'VISUAL_EVIDENCE_REPAIR']) assert.equal(capabilityForRoute(registry, route).available, true);
});

test('unavailable derived source recovery is explicit human decision, while structured class wins over geometry text', () => {
  const registry = recoveryCapabilityRegistry(root, { inputReady: true });
  const unavailable = routeDefect({ defectClass: 'SOURCE_PAYLOAD_DEFECT', type: 'LOGICAL_AND_GEOMETRIC_ERROR' }, { capabilityRegistry: registry });
  assert.equal(unavailable.requestedRoute, 'DERIVED_SOURCE_RECOVERY');
  assert.equal(unavailable.route, 'HUMAN_DECISION_REQUIRED');
  assert.equal(unavailable.capabilityReason, 'PRODUCER_NOT_IMPLEMENTED');
  assert.equal(routeDefect({ defectClass: 'SOURCE_PAYLOAD_DEFECT' }, { sourceRecoveryCapability: 'ACTIVE' }).route, 'HUMAN_DECISION_REQUIRED');
  const candidate = routeDefect({ defectClass: 'CANDIDATE_MATH_DEFECT', type: 'LOGICAL_AND_GEOMETRIC_ERROR' }, { capabilityRegistry: registry });
  assert.equal(candidate.route, 'CANDIDATE_REPAIR');
  assert.equal(candidate.classificationSource, 'STRUCTURED');
  assert.equal(buildRepairPlan([{ runId: 'run', questionUid: 'q', defectClass: 'SOURCE_PAYLOAD_DEFECT' }], [], { capabilityRegistry: registry }).status, 'HUMAN_DECISION_REQUIRED');
});

test('Maesan-shaped defect fixture routes q5, q11, q19, and provider envelope by structured evidence', () => {
  const registry = recoveryCapabilityRegistry(root, { inputReady: true });
  const defects = routeDefects([
    { runId: 'past20-maesan', questionUid: '20_매산고_2학기_중간_고1_기출|5', phase: 'U2', axis: 'V2', defectClass: 'VISUAL_DEFECT', type: 'VISUAL_DEPENDENCY_UNVERIFIED' },
    { runId: 'past20-maesan', questionUid: '20_매산고_2학기_중간_고1_기출|11', phase: 'U3', axis: 'MATH_A2', defectClass: 'SOURCE_PAYLOAD_DEFECT', type: 'LOGICAL_AND_GEOMETRIC_ERROR' },
    { runId: 'past20-maesan', questionUid: '20_매산고_2학기_중간_고1_기출|19', phase: 'U2', axis: 'AUTHORITY', defectClass: 'AUTHORITY_DEFECT', type: 'ANSWER_RUBRIC_AUTHORITY' },
    { runId: 'past20-maesan', questionUid: '20_매산고_2학기_중간_고1_기출|5', phase: 'U1', axis: 'EXECUTION', defectClass: 'EXECUTION_DEFECT', type: 'PROVIDER_INPUT_ENVELOPE_INVALID' },
  ], { capabilityRegistry: registry });
  assert.equal(defects[0].route, 'VISUAL_EVIDENCE_REPAIR');
  assert.equal(defects[1].route, 'HUMAN_DECISION_REQUIRED');
  assert.equal(defects[1].requestedRoute, 'DERIVED_SOURCE_RECOVERY');
  assert.equal(defects[2].route, 'AUTHORITY_BINDING_REPAIR');
  assert.equal(defects[3].route, 'EXECUTION_RECOVERY');
});
