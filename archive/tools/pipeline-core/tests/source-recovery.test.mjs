import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { bytesSha, uidSetSha } from '../canonical.mjs';
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
  authorizationAuthority: 'BOUNDED_PRODUCTION',
  scopeAuthorizationStatus: 'PASS',
  authorizedScope: { sourceQuestionUid: 'Q17', recoveryTier: 'R1', defectTypes: ['NO_CORRECT_ANSWER'] },
  sourceDefectTypes: ['NO_CORRECT_ANSWER'],
  recoveryTier: 'R1',
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

test('shadow authority cannot be upgraded by forged ADOPTED replacement fields', () => {
  const result = validateSourceRecoveryLedger({
    ...base,
    items: [{
      ...adopted,
      recoveryAuthority: 'SHADOW_ONLY',
      productionAdoptionStatus: 'ADOPTED',
      replacementDisposition: 'DERIVED_REPLACEMENT_VERIFIED',
      finalTarget: true,
    }],
  });
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.errors.includes('SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION'));
});

test('partial producer and retry budgets cannot be counted as exhaustion', () => {
  const result = validateSourceRecoveryLedger({
    ...base,
    items: [{
      sourceQuestionUid: 'Q17',
      status: 'RECOVERING',
      tierMatrix: {
        R1: { applicability: 'APPLICABLE_PRIMARY', capability: 'ACTIVE', execution: 'ATTEMPTED_EXHAUSTED' },
      },
      producerAttempts: {
        R1: {
          producerStatus: 'COMPLETED',
          attemptCount: 1,
          candidateBudget: 3,
          candidateBudgetConsumed: 1,
          retryBudget: 1,
          retryBudgetConsumed: false,
          generatedCandidateCount: 1,
          attemptEvidenceRef: 'attempt-r1',
          attemptEvidenceSha: 'sha256:' + 'a'.repeat(64),
          allProducedCandidatesRejected: false,
        },
      },
    }],
  });
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.errors.includes('RECOVERY_PRODUCER_BUDGET_NOT_EXHAUSTED'));
});

test('final seal re-reads replacement evidence and final artifact bytes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-source-recovery-seal-'));
  try {
    const finalArtifactRef = 'final/q17.json';
    const replacementEvidenceRef = 'evidence/q17-lineage.json';
    const qualityClosureEvidenceRef = 'evidence/q17-quality.json';
    const finalBytes = Buffer.from('{"answer":"①"}\n', 'utf8');
    fs.mkdirSync(path.join(root, 'final'), { recursive: true });
    fs.mkdirSync(path.join(root, 'evidence'), { recursive: true });
    fs.writeFileSync(path.join(root, finalArtifactRef), finalBytes);
    const item = {
      ...adopted,
      finalArtifactRef,
      finalArtifactSha256: bytesSha(finalBytes),
      afterPayloadSha256: 'sha256:' + 'b'.repeat(64),
      sourceLockSha256: 'b'.repeat(64),
      initialIncludedScopeUidSetSha256: uidSetSha(['Q1', 'Q17']),
      replacementEvidenceRef,
      qualityClosureEvidenceRef,
    };
    const evidence = {
      evidenceId: 'lineage-q17',
      status: 'PASS',
      sourceQuestionUid: item.sourceQuestionUid,
      recoveredQuestionUid: item.recoveredQuestionUid,
      effectiveArtifactUid: item.effectiveArtifactUid,
      candidatePayloadSha256: item.afterPayloadSha256,
      sourceLockSha256: item.sourceLockSha256,
      initialIncludedScopeUidSetSha256: item.initialIncludedScopeUidSetSha256,
      finalArtifactSha256: item.finalArtifactSha256,
      finalArtifactRef,
    };
    const evidenceBytes = Buffer.from(JSON.stringify(evidence), 'utf8');
    fs.writeFileSync(path.join(root, replacementEvidenceRef), evidenceBytes);
    item.replacementEvidenceSha = bytesSha(evidenceBytes);
    const quality = { ...evidence, evidenceId: 'quality-q17', qualityGateResults: { math: 'PASS', structure: 'PASS' } };
    const qualityBytes = Buffer.from(JSON.stringify(quality), 'utf8');
    fs.writeFileSync(path.join(root, qualityClosureEvidenceRef), qualityBytes);
    item.qualityClosureEvidenceSha = bytesSha(qualityBytes);
    let result = validateSourceRecoveryLedger({ ...base, items: [item] }, null, root);
    assert.equal(result.status, 'PASS', JSON.stringify(result.errors));
    fs.writeFileSync(path.join(root, finalArtifactRef), Buffer.from('{"answer":"②"}\n', 'utf8'));
    result = validateSourceRecoveryLedger({ ...base, items: [item] }, null, root);
    assert.equal(result.status, 'BLOCKED');
    assert.ok(result.errors.includes('FINAL_ARTIFACT_SHA_MISMATCH'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
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
