import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { git, sha, atomicWrite } from '../common.mjs';
import { acquireLease } from '../lock.mjs';
import { inventory } from '../snapshot.mjs';
import { finalGate, REQUIRED_GATES } from '../final-gate.mjs';
import { objectSha } from '../../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from '../../meta-foundation/active-registry.mjs';
import { META_RESOLUTION_SCHEMA, makeDifficultyEvidence, makeMetaValidatorReceipt, resolveMetaRoute, sealR2EMetaReceipt, validateMetaFinalization, validateR2EReceipt, validateResolverEvidence } from '../../meta-foundation/rpm-active-resolver.mjs';

const currentRepoRoot = path.resolve(fileURLToPath(new URL('../../../..', import.meta.url)));

function fixture() {
  const base = path.resolve(fileURLToPath(new URL('../../../..', import.meta.url)), 'tmp/r2e-tests-20260927'); fs.mkdirSync(base, { recursive: true });
  const root = fs.mkdtempSync(path.join(base, 'fixture-')), repo = path.join(root, 'repo'), remote = path.join(root, 'remote.git'); fs.mkdirSync(repo);
  execFileSync('git', ['init', '--bare', remote], { stdio: 'pipe' }); git(repo, ['init', '-b', 'main']); git(repo, ['config', 'user.name', 'R2E Test']); git(repo, ['config', 'user.email', 'test@example.invalid']); git(repo, ['config', 'core.autocrlf', 'false']); git(repo, ['remote', 'add', 'origin', remote]);
  const write = (rel, value) => { const target = path.join(repo, rel); atomicWrite(target, typeof value === 'string' ? value : JSON.stringify(value)); return { path: rel, sha256: sha(fs.readFileSync(target)) }; };
  const commit = (paths, message) => { git(repo, ['add', '--', ...paths]); git(repo, ['commit', '-m', message]); return git(repo, ['rev-parse', 'HEAD']).trim(); };
  const examFile = 'archive/exams/original/middle/m2/1mid/test.js';
  const crosswalk = JSON.parse(fs.readFileSync(path.join(currentRepoRoot, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json'), 'utf8'));
  const activeRow = crosswalk.records.find(row => row.mappingStatus === 'DIRECT_ACTIVE' && row.bindingStatus === 'ACTIVE' && row.subUnitKey);
  const question = {
    id: 1, content: '이등변삼각형의 두 밑각이 같음을 이용한다.', answer: '①', choices: ['①', '②'],
    solution: '두 밑각은 서로 같으므로 답은 ①이다.', curriculum: activeRow.curriculum, standardCourse: '중2 수학', standardUnitKey: activeRow.standardUnitKey,
    subUnitKey: activeRow.subUnitKey, problemTypeKey: activeRow.problemTypeKey, templateKey: activeRow.templateKey,
    crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE', difficultyBucket: 2,
    difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  };
  const sourceArchiveFile = examFile.replace(/^archive\/exams\//, '');
  const questionUid = `qid_v1_${sha(`${sourceArchiveFile}#1`)}`;
  write(examFile, `window.questionBank=${JSON.stringify([question])};`);
  const main = commit([examFile], 'main'); git(repo, ['push', 'origin', 'main']);
  for (const g of ['m2', 'm3']) git(repo, ['push', 'origin', `${main}:refs/heads/work/intake/${g}`]);
  git(repo, ['checkout', '-b', 'work/intake/m2']);
  const receiptPath = 'archive/data/r2e-intake/m2/test.json';
  const input = {
    sourceIdentity: {
      sourceArchiveFile, questionUid, sourceOrdinal: 1,
      contentHash: objectSha(question.content), choicesHash: objectSha(question.choices),
      imageRefHash: objectSha({ image: '', visualAsset: '', fullPageImagePath: '', fullPageImageRelPath: '', sourceEvidencePath: '', sourcePageEvidencePaths: [] }),
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: objectSha(question.solution) },
    curriculumContext: { grade: 'M2', curriculum: activeRow.curriculum, scope: activeRow.scope, standardCourse: question.standardCourse,
      standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey },
    semanticDecision: { primaryMethod: '밑각의 크기가 같음을 이용한다.', decisiveStep: '이등변삼각형의 두 밑각을 비교한다.',
      rpmPath: { curriculum: activeRow.curriculum, scope: activeRow.scope, ...activeRow.rpmPath } },
  };
  const resolverEvidence = resolveMetaRoute(input, { repoRoot: currentRepoRoot });
  const difficultyEvidence = makeDifficultyEvidence({
    status: 'PASS', blindPassStatus: 'FRESH_INDEPENDENT', sourceFingerprint: resolverEvidence.sourceFingerprint,
    solutionHash: input.solutionIdentity.solutionHash, independentOfSemanticPass: true, difficultyBucket: 2,
    difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
    rationale: '표준 성질 적용과 짧은 계산 구조를 새로 검토했다.', blindReviewerId: 'r2e-test', decisionSha: objectSha({ uid: input.sourceIdentity.questionUid, bucket: 2 }),
  });
  const semanticMetaEvidence = {
    schemaVersion: 'JS_ARCHIVE_RELATIONAL_META_EVIDENCE_v1', sourceFingerprint: resolverEvidence.sourceFingerprint,
    inputBundleSha: resolverEvidence.inputBundleSha, candidateVisibleDuringDecision: false, crossConceptDecisions: [], conditionDecisions: [],
  };
  semanticMetaEvidence.evidenceSha = objectSha(semanticMetaEvidence);
  const validatorReceipt = makeMetaValidatorReceipt(resolverEvidence, validateResolverEvidence(input, resolverEvidence, { repoRoot: currentRepoRoot }));
  const metaResolutionEvidence = {
    schemaVersion: 'JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1', items: [{
      questionUid: input.sourceIdentity.questionUid, sourceOrdinal: 1, disposition: resolverEvidence.disposition,
      input, resolverEvidence, difficultyEvidence, semanticMetaEvidence, validatorReceipt,
      candidateMeta: { ...question, integrationReason: '주개념 경로만으로 풀이가 끝난다.' },
    }],
  };
  const metaEvidencePath = 'archive/data/r2e-intake/m2/test.meta.json';
  const metaEvidenceRef = write(metaEvidencePath, metaResolutionEvidence);
  const receipt = { examUid: 'test', examFile, grade: '중2', lane: 'A', stage: 'R1', sourceBlobSha: sha('source'), inputCommit: main, totalQuestions: 1, changedQuestions: [], changedSvgFiles: [], metaDispositionSummary: { [resolverEvidence.disposition]: 1 }, metaResolutionEvidenceRef: metaEvidenceRef, metaResolverContractVersion: META_RESOLUTION_SCHEMA, unresolvedItems: [], authorityRefs: [], nextState: 'READY_FOR_R2E', updatedAt: new Date().toISOString() };
  write(receiptPath, receipt); const ready = commit([receiptPath, metaEvidencePath], 'R1 READY'); git(repo, ['push', 'origin', 'work/intake/m2']);
  return { root, repo, write, commit, examFile, sourceArchiveFile, question, metaResolutionEvidence, main, receiptPath, receipt, ready };
}
test('grade snapshot is immutable; late and malformed receipts do not block healthy input', () => {
  const f = fixture(), first = inventory(f.repo, { metaAuthorityRoot: currentRepoRoot }); assert.equal(first.status, 'READY'); assert.equal(first.candidates[0].inputCommit, f.ready);
  const intakeItem = f.metaResolutionEvidence.items[0];
  const runtimeRecord = {
    questionUid: intakeItem.questionUid, sourceFingerprint: intakeItem.resolverEvidence.sourceFingerprint,
    resolverEvidenceSha: intakeItem.resolverEvidence.evidenceSha, difficultyEvidenceSha: intakeItem.difficultyEvidence.evidenceSha,
    ...Object.fromEntries(['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'].map(key => [key, intakeItem.candidateMeta[key]])),
  };
  const finalMetaPreflight = validateMetaFinalization({ input: intakeItem.input, resolverEvidence: intakeItem.resolverEvidence,
    difficultyEvidence: intakeItem.difficultyEvidence, candidateMeta: intakeItem.candidateMeta,
    semanticMetaEvidence: intakeItem.semanticMetaEvidence, requireValidatorReceipt: false, repoRoot: currentRepoRoot });
  assert.equal(finalMetaPreflight.status, 'PASS', JSON.stringify(finalMetaPreflight.errors));
  const finalValidatorReceipt = makeMetaValidatorReceipt(intakeItem.resolverEvidence, finalMetaPreflight);
  const finalReceipt = sealR2EMetaReceipt({
    schemaVersion: 'JS_ARCHIVE_R2E_META_RECEIPT_v1', stage: 'R2E_FINAL',
    unresolvedSemanticCount: 0, unresolvedProposalCount: 0, unresolvedCrossConceptCandidateCount: 0,
    metaHoldCount: 0, migrationGapCount: 0, runtimeParityFailureCount: 0,
    items: [{ ...intakeItem, validatorReceipt: finalValidatorReceipt, r2eFinalDisposition: 'EXISTING_REUSE', runtimeRecord }],
  });
  const finalValidation = validateR2EReceipt(finalReceipt, {
    repoRoot: currentRepoRoot, sourceArchiveFile: f.sourceArchiveFile, sourceQuestions: [f.question],
  });
  assert.equal(finalValidation.status, 'PASS', JSON.stringify(finalValidation.errors));
  f.write('archive/data/r2e-intake/m2/bad.json', { nextState: 'READY_FOR_R2E' }); const late = f.commit(['archive/data/r2e-intake/m2/bad.json'], 'late invalid'); git(f.repo, ['push', 'origin', 'work/intake/m2']);
  assert.equal(first.heads.m2.sha, f.ready); assert.equal(first.candidates.length, 1);
  const next = inventory(f.repo, { metaAuthorityRoot: currentRepoRoot }); assert.equal(next.heads.m2.sha, late); assert.equal(next.candidates.length, 1); assert.equal(next.errors.length, 1);
  const oldLanes = 'work/intake/m2-a'; git(f.repo, ['push', 'origin', `${late}:refs/heads/${oldLanes}`]); assert.deepEqual(Object.keys(inventory(f.repo, { metaAuthorityRoot: currentRepoRoot }).heads), ['m2', 'm3']);
});
test('remote physical checkpoint takes resume precedence; final input is skipped', () => {
  const f = fixture(); git(f.repo, ['checkout', '-b', 'work/r2e-state', f.main]);
  const rel = 'archive/data/r2e/m2/exams/test.json'; f.write(rel, { examUid: 'test', inputCommit: f.ready, finalStatus: 'R2E_IN_PROGRESS', nextAction: 'continue q1' }); f.commit([rel], 'checkpoint'); git(f.repo, ['push', 'origin', 'work/r2e-state']);
  assert.equal(inventory(f.repo, { metaAuthorityRoot: currentRepoRoot }).status, 'RESUME');
  f.write(rel, { examUid: 'test', inputCommit: f.ready, finalStatus: 'R2E_MAIN_FINAL' }); f.commit([rel], 'final receipt'); git(f.repo, ['push', 'origin', 'work/r2e-state']); assert.equal(inventory(f.repo, { metaAuthorityRoot: currentRepoRoot }).status, 'NO_WORK');
});
test('same-repository worktrees share OS lock; competing owner is rejected; release fences old owner', async t => {
  const f = fixture(), first = await acquireLease(f.repo, { runId: 'first' }); t.after(() => first.release()); assert.equal(first.status, 'ACQUIRED');
  const worktree = path.join(f.root, 'other'); git(f.repo, ['worktree', 'add', '--detach', worktree, f.main]);
  assert.equal((await acquireLease(worktree, { runId: 'second' })).status, 'RUN_ALREADY_ACTIVE');
  await first.release(); assert.throws(first.assert, /LEASE_LOST/);
  const next = await acquireLease(worktree, { runId: 'second' }); t.after(() => next.release()); assert.ok(next.fencingToken > first.fencingToken);
});
test('guard helper crash releases kernel lock; prior JavaScript owner can no longer mutate', async t => {
  const f = fixture(), first = await acquireLease(f.repo, { runId: 'crash' });
  const owner = JSON.parse(fs.readFileSync(path.join(f.repo, '.git/r2e/lease.json'), 'utf8')); process.kill(owner.guardPid);
  await new Promise(resolve => setTimeout(resolve, 100)); assert.throws(first.assert, /LEASE_LOST/);
  const next = await acquireLease(f.repo, { runId: 'recovered' }); t.after(() => next.release()); assert.equal(next.status, 'ACQUIRED');
});
test('final gate needs current bytes, complete evidence, HOLD Zero and integrity reuse for normal PASS', () => {
  const f = fixture(), evidence = f.write('archive/data/r2e/m2/evidence/check.json', { scope: 'synthetic test', status: 'PASS' });
  const metaResolutionReceipt = sealR2EMetaReceipt({
    schemaVersion: 'JS_ARCHIVE_R2E_META_RECEIPT_v1', stage: 'R2E_FINAL',
    unresolvedSemanticCount: 0, unresolvedProposalCount: 0, unresolvedCrossConceptCandidateCount: 0,
    metaHoldCount: 0, migrationGapCount: 0, runtimeParityFailureCount: 0,
    items: [{ questionUid: 'qid-test-001', resolverEvidence: { disposition: 'EXISTING_REUSE', sourceFingerprint: 'fixture' } }],
  });
  const ledger = { examFile: f.examFile, inputBranch: 'work/intake/m2', inputCommit: f.ready, dependencyShas: [evidence], denominator: 1, integrityScanned: 1, deepReviewItems: [], resolvedItems: [], remainingItems: [], unresolvedItems: [], metaResolutionReceipt, items: [{ ordinal: 1, questionUid: 'qid-test-001', status: 'PASS', r1Status: 'PASS', reviewMode: 'INTEGRITY_REUSE', metaDisposition: 'EXISTING_REUSE', sourceFingerprint: 'fixture' }] };
  const validation = { artifactSha256: sha(fs.readFileSync(path.join(f.repo, f.examFile))), inputCommit: f.ready, artifacts: [], gates: Object.fromEntries(REQUIRED_GATES.map(name => [name, { status: 'PASS', evidenceRef: evidence }])) };
  const metaValidator = () => ({ status: 'PASS', errors: [] });
  const passed = finalGate(f.repo, ledger, validation, { validateMetaReceipt: metaValidator });
  assert.equal(passed.status, 'PASS', JSON.stringify(passed.errors));
  for (const code of ['META_PACK_GAP_HOLD', 'META_CANONICAL_HOLD', 'RPM_PRIMARY_MIGRATION_GAP', 'PROPOSED_NEW_L3', 'PROPOSED_NEW_L4', 'CROSS_CONCEPT_CANDIDATE']) {
    const modified = structuredClone(ledger); modified.items[0].disposition = code; assert.equal(finalGate(f.repo, modified, validation, { validateMetaReceipt: metaValidator }).status, 'FAIL');
  }
  const deep = structuredClone(ledger); deep.items[0].reviewMode = 'DEEP'; assert.equal(finalGate(f.repo, deep, validation, { validateMetaReceipt: metaValidator }).status, 'FAIL');
  const proposal = structuredClone(ledger); proposal.crossConceptCandidates = ['unresolved']; assert.equal(finalGate(f.repo, proposal, validation, { validateMetaReceipt: metaValidator }).status, 'FAIL');
  const wrongIdentity = structuredClone(ledger); wrongIdentity.items[0].ordinal = 2; assert.equal(finalGate(f.repo, wrongIdentity, validation, { validateMetaReceipt: metaValidator }).status, 'FAIL');
  const missing = structuredClone(validation); delete missing.gates.compiledRuntimeParity; assert.equal(finalGate(f.repo, ledger, missing, { validateMetaReceipt: metaValidator }).status, 'FAIL');
  f.write(evidence.path, 'changed dependency'); assert.equal(finalGate(f.repo, ledger, validation, { validateMetaReceipt: metaValidator }).status, 'FAIL');
  f.write(f.examFile, 'window.questionBank=[];'); assert.equal(finalGate(f.repo, ledger, validation, { validateMetaReceipt: metaValidator }).status, 'FAIL');
});
