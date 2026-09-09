import test from 'node:test';
import assert from 'node:assert/strict';
import { uidSetSha } from '../canonical.mjs';
import { validateSourceRecoveryLedger } from '../source-recovery.mjs';
import { fixture } from './fixture.mjs';
import { auditRun, runInputSha } from '../closure.mjs';

const base = {
  schemaVersion: 'ALIVE_SOURCE_RECOVERY_LEDGER_v1',
  initialIncludedScopeUidSet: ['Q1', 'Q17'],
  initialIncludedScopeUidSetSha256: uidSetSha(['Q1', 'Q17']),
  items: [],
};

const adopted = {
  sourceQuestionUid: 'Q17',
  recoveredQuestionUid: 'Q17-R',
  slotUid: 'Q17',
  effectiveArtifactUid: 'Q17-R',
  sourceOriginalPreserved: true,
  productionOriginalActive: false,
  productionRecoveredActive: true,
  replacementLineageParity: 'PASS',
  recoveredQualityClosure: 'PASS',
  replacementEvidenceRef: 'evidence/q17-replacement.json',
  replacementEvidenceSha: 'sha256:' + 'a'.repeat(64),
  replacementCardinality: '1:1',
  recoveryAuthority: 'BOUNDED_PRODUCTION',
  productionAdoptionStatus: 'ADOPTED',
  replacementDisposition: 'DERIVED_REPLACEMENT_VERIFIED',
  status: 'RECOVERED',
  finalTarget: true,
};

test('derived replacement passes only with a bound source slot and one-to-one parity', () => {
  const result = validateSourceRecoveryLedger({ ...base, items: [adopted] }, {
    questions: [
      { questionUid: 'Q1' },
      { questionUid: 'Q17', slotUid: 'Q17', effectiveArtifactUid: 'Q17-R' },
    ],
  });
  assert.equal(result.status, 'PASS', JSON.stringify(result.errors));
  assert.equal(result.productionSeal, 'PASS');
});

test('initial denominator mutation and simultaneous production activity fail closed', () => {
  const result = validateSourceRecoveryLedger({
    ...base,
    initialIncludedScopeUidSet: ['Q1'],
    initialIncludedScopeUidSetSha256: uidSetSha(['Q1']),
    items: [{ ...adopted, productionOriginalActive: true }],
  }, { questions: [{ questionUid: 'Q1' }, { questionUid: 'Q17' }] });
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.errors.includes('INITIAL_SCOPE_RUN_UID_SET_MISMATCH'));
  assert.ok(result.errors.includes('DERIVED_REPLACEMENT_PARITY_FAIL'));
});

test('shadow recovered final target is blocked even when its artifact is otherwise valid', () => {
  const result = validateSourceRecoveryLedger({
    ...base,
    items: [{ ...adopted, recoveryAuthority: 'SHADOW_ONLY', productionAdoptionStatus: 'NOT_AUTHORIZED' }],
  });
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.errors.includes('SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION'));
});

test('pipeline-core closure consumes the recovery ledger as a hard gate', () => {
  const f = fixture();
  try {
    f.run.sourceRecoveryLedger = {
      ...base,
      initialIncludedScopeUidSet: [f.run.questions[0].questionUid],
      initialIncludedScopeUidSetSha256: uidSetSha([f.run.questions[0].questionUid]),
      items: [{ ...adopted, sourceQuestionUid: f.run.questions[0].questionUid, finalTarget: true, recoveryAuthority: 'SHADOW_ONLY', productionAdoptionStatus: 'NOT_AUTHORIZED' }],
    };
    f.run.inputSha = runInputSha(f.run);
    f.run.registry[0].inputSha = f.run.inputSha;
    f.run.denominator.inputSha = f.run.inputSha;
    const report = auditRun(f.root, f.run);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.some(error => error.includes('SOURCE_RECOVERY:')), report.errors.join(';'));
  } finally {
    f.cleanup();
  }
});
