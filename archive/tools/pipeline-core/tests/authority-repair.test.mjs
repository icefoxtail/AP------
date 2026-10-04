import test from 'node:test';
import assert from 'node:assert/strict';
import { authorityBindingReady, materializeAuthorityBinding } from '../authority-repair.mjs';

const evidenceRef = { path: 'evidence/visual-authority.json', bytes: 7, sha256: `sha256:${'a'.repeat(64)}` };
const makeRun = visual => ({
  schemaVersion: 'APMATH_PIPELINE_RUN_v1',
  pipeline: 'textbook',
  runId: 'authority-repair-fixture',
  revision: 1,
  inputSha: `sha256:${'b'.repeat(64)}`,
  inputs: [evidenceRef],
  questions: [{ questionUid: 'fixture|1', visual }],
});

test('bound authority evidence preserves an explicit optional or exempt decision with a solution visual', () => {
  const run = makeRun({ requirement: 'VISUAL_OPTIONAL', actualSolutionVisualAttached: true, problemVisualMathDependency: false, sharedVisualMathDependency: false });
  const result = materializeAuthorityBinding(run, { authorityEvidenceRef: evidenceRef });
  assert.equal(result.status, 'REPAIRED');
  assert.equal(result.run.questions[0].visual.requirement, 'VISUAL_OPTIONAL');
  assert.equal(result.run.questions[0].visual.adjudicationStatus, 'RESOLVED');
  assert.equal(authorityBindingReady(result.run).status, 'PASS');
});

test('authority evidence must be bound to the run and cannot exempt a problem visual dependency', () => {
  const run = makeRun({ requirement: 'VISUAL_OPTIONAL', problemVisualMathDependency: true, sharedVisualMathDependency: false });
  assert.throws(() => materializeAuthorityBinding(run, { authorityEvidenceRef: { ...evidenceRef, sha256: `sha256:${'c'.repeat(64)}` } }), /AUTHORITY_EVIDENCE_REF_NOT_BOUND/);
  assert.throws(() => materializeAuthorityBinding(run, { authorityEvidenceRef: evidenceRef }), /AUTHORITY_EVIDENCE_CONTRADICTS_VISUAL_DEPENDENCY/);
});
