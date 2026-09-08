import test from 'node:test';
import os from 'node:os';
import { initWorkBatch, freezeWorkBatch, reserveWorkBatchReview, reconcileWorkBatchReview } from '../work-batch.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bytesSha, fileRef, objectSha } from '../canonical.mjs';
import { questionUidV2, parseQuestionUidV2, normalizeSourceExamIdRegistry, createUidMigrationEvidence, validateUidMigrationEvidence } from '../question-uid.mjs';
import { axisInputSha, allAxisInputShas, questionFieldHashMap, requiredAxesForQuestion } from '../projection.mjs';
import { profiles, CORE_SHA, denominatorInput } from '../closure.mjs';
import { semanticDiff, changeImpactMap, computeAxisInputShaMap } from '../semantic-diff.mjs';
import { EVIDENCE_VERSION_V2, createEvidenceReuseReceipt, validateEvidenceFreshness, validateEvidenceReuseReceipt, validateMachineEvidence, validateFreshEvidenceIndependence } from '../review-evidence-v2.mjs';
import { materializeQuestionQualityClosure, createQuestionQualityClosureSet, validateQuestionQualityClosureSet } from '../question-quality-set.mjs';
import { createExamReleaseClosure, validateExamReleaseClosure, RELEASE_CASES } from '../exam-release.mjs';
import { buildAuditorPacket, validateAuditorPacket, createSealedAuditorSubcontexts, secondAuditorRequirement } from '../review-isolation-runner.mjs';
import { createBuildWorkLedgerEntry, validateBuildWorkLedgerEntry } from '../build-work-ledger.mjs';
import { validateSchema } from '../schema.mjs';
import { createContinuationDenominator, validateContinuationDenominator } from '../continuation.mjs';
import { detectRenderImpact } from '../render-impact.mjs';
import { validateBatchManifest } from '../batch.mjs';
import { RUN_VERSION_V2, runInputSha } from '../closure.mjs';
import { auditV2Run, computeV2AxisInputShas, requiresSolutionVisualBenefitGate } from '../v2-audit.mjs';

const hash = value => objectSha(value);
const lifecycle = { withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE' };
const ref = { path: 'fixture.json', bytes: 0, sha256: hash('fixture') };
const axisRow = (questionUid, axis, mode) => ({ questionUid, axis, mode, status: 'PASS', evidenceId: `${questionUid}:${axis}`, evidenceSha: hash([questionUid, axis]), axisInputSha: hash(axis), receiptSha: mode === 'REUSED' ? hash('receipt') : null });
function runFixture(inputRef = ref) {
  return { schemaVersion: RUN_VERSION_V2, pipeline: 'logic-visual', runId: 'v2-run', revision: 1, workBatchId: 'job', builderId: 'builder', builderSessionId: 'builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', inputSha: hash('input'), inputs: [{ ...inputRef, role: 'candidate' }], evidence: [ref], questions: [{ questionUid: 'exam-2026|13', sourceExamId: 'exam-2026', sourceQuestionOrdinal: 13, sourcePath: inputRef.path, candidatePath: inputRef.path, qid: 13, requiredAxes: ['MATH_A1'], axisInputShas: { MATH_A1: hash('axis') }, evidence: {} }], sourceAuthority: { sourceTruthRefs: [inputRef], sourceTruthBundleSha: hash([inputRef]), activeBaselineRef: inputRef, activeBaselineSha: inputRef.sha256, applicability: {} }, uidAuthority: { sourceExamIdRegistryRef: ref, sourceExamIdRegistryEntrySha: hash('entry'), uidMigrationEvidenceRefs: [], uidMigrationEvidenceSetSha: hash([]) }, semanticDependencyBindings: {}, auditorPacketRefs: [], buildWorkLedgerRefs: [], questionQualityClosureSetRef: ref, examReleaseClosureRef: ref };
}
const inputSha = hash({ run: 'v2' });
const q = (uid, solution = 'old solution', overrides = {}) => ({ questionUid: uid, sourceExamId: 'exam-2026', sourceQuestionOrdinal: Number(uid.split('|').at(-1)), content: 'x+1=2', choices: ['1', '2', '3'], answer: '1', solution, tags: ['calculus'], score: 2, ...overrides });

function writeFixture(root, relative, value) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value));
  return fileRef(root, relative);
}

function metadataAuditFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-v2-metadata-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const runId = 'metadata-reuse', sourceExamId = 'metadata-exam', questionUid = `${sourceExamId}|1`;
  const sourceQuestion = { id: 1, content: '태그만 갱신하는 문항', choices: ['가', '나'], answer: '나', solution: '정답은 나이다.', tags: ['synthetic'], score: 1 };
  const sourceScript = `window.examTitle=${JSON.stringify(sourceExamId)};window.questionBank=${JSON.stringify([sourceQuestion])};`;
  const sourceRef = writeFixture(root, 'source.js', sourceScript);
  const candidateRef = writeFixture(root, 'candidate.js', sourceScript);
  const rulePaths = ['00_RULES_INDEX.md', '01_CANONICAL/JS아카이브룰북_v2.6.md', '02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md', '02_PIPELINES/공통파이프라인_실행계약_v1.md', '02_PIPELINES/작업방식_적응형배치루프_v1.md', '03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md'];
  const ruleRefs = rulePaths.map(relative => writeFixture(root, `docs/rules/${relative}`, `synthetic rule ${relative}\n`));
  const manifestRef = writeFixture(root, 'docs/rules/MANIFEST.md', ruleRefs.map((rule, index) => `- ${rulePaths[index]} | ${rule.bytes} bytes | sha256 ${rule.sha256.slice(7)}`).join('\n'));
  const specRef = writeFixture(root, 'spec.json', { schemaVersion: 'SYNTHETIC_SPEC_v1' });
  const verifierRef = writeFixture(root, 'verifier.json', { schemaVersion: 'SYNTHETIC_VERIFIER_v1' });
  const inputs = [{ ...sourceRef, role: 'source' }, { ...candidateRef, role: 'candidate' }, { ...manifestRef, role: 'rule' }, ...ruleRefs.map(ref => ({ ...ref, role: 'rule' })), { ...specRef, role: 'spec' }, { ...verifierRef, role: 'verifier' }];
  const sourceTruthBundleSha = hash([sourceRef]);
  const applicability = Object.fromEntries(['baselineDiscoveryEvidenceRef', 'approvedSourceRepairLedgerRef', 'approvedSourceExceptionLedgerRef'].map((key, index) => {
    const evidenceRef = writeFixture(root, `authority/${index}.json`, { status: 'PASS', applicability: 'NOT_APPLICABLE', reason: `SYNTHETIC_${key}`, sourceTruthBundleSha });
    return [key, { status: 'NOT_APPLICABLE', reason: `SYNTHETIC_${key}`, evidenceRef }];
  }));
  const registry = normalizeSourceExamIdRegistry({ entries: [{ canonicalSourceExamId: sourceExamId, sourceIdentityKey: 'metadata-source-identity', status: 'ACTIVE', sourceExamId, sourceQuestionOrdinal: 1, questionUidV2: questionUid, sourcePath: sourceRef.path, sourceSha256: sourceRef.sha256 }] });
  const registryRef = writeFixture(root, 'authority/source-registry.json', registry);
  const sourceAuthority = { sourceTruthRefs: [sourceRef], sourceTruthBundleSha, activeBaselineRef: sourceRef, activeBaselineSha: sourceRef.sha256, applicability };
  const uidAuthority = { sourceExamIdRegistryRef: registryRef, sourceExamIdRegistryEntrySha: hash(registry.entries), uidMigrationEvidenceRefs: [], uidMigrationEvidenceSetSha: hash([]) };
  const question = () => ({ questionUid, sourceExamId, sourceQuestionOrdinal: 1, sourcePath: sourceRef.path, candidatePath: candidateRef.path, qid: 1, examId: sourceExamId, requiredAxes: [], axisInputShas: {}, evidence: {}, sourceStatus: 'RESOLVED', problemAssetPaths: [], solutionAssetPaths: [], visual: { requirement: 'VISUAL_EXEMPT', action: 'NONE', adjudicationId: 'source-r1', adjudicationStatus: 'RESOLVED', exemptReason: 'METADATA_ONLY', actualSolutionVisualAttached: false, problemVisualMathDependency: false, sharedVisualMathDependency: false } });
  const makeRun = (revision, predecessor = null, priorInputSha = null) => {
    const run = { schemaVersion: RUN_VERSION_V2, pipeline: 'tag-enrichment', runId, revision, workBatchId: 'job', builderId: 'builder', builderSessionId: 'builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', inputSha: null, inputs, evidence: [], questions: [question()], sourceAuthority, uidAuthority, semanticDependencyBindings: {}, auditorPacketRefs: [], buildWorkLedgerRefs: [], questionQualityClosureSetRef: specRef, examReleaseClosureRef: specRef, publicationIntent: 'QUESTION_ONLY', ...(predecessor ? { predecessor } : {}), canonicalRecordId: `record-r${revision}`, registry: [] };
    run.questions[0].requiredAxes = requiredAxesForQuestion(profiles.pipelines[run.pipeline], run.questions[0], run);
    run.inputSha = runInputSha(run);
    run.registry = revision === 1
      ? [{ recordId: 'record-r1', batchId: runId, revision: 1, supersedes: null, isCanonical: true, inputSha: run.inputSha, questionUids: [questionUid] }]
      : [{ recordId: 'record-r1', batchId: runId, revision: 1, supersedes: null, isCanonical: false, inputSha: priorInputSha, questionUids: [questionUid] }, { recordId: 'record-r2', batchId: runId, revision: 2, supersedes: 'record-r1', isCanonical: true, inputSha: run.inputSha, questionUids: [questionUid] }];
    const denominator = denominatorInput(run);
    run.denominator = { status: 'FROZEN', stale: false, ...denominator };
    run.questions[0].axisInputShas = computeV2AxisInputShas(root, run)[questionUid];
    return run;
  };
  const machineEvidence = (run, axis, evidenceId) => {
    const machineProvenance = { collector: 'SYNTHETIC_MACHINE', runId: run.runId, revision: run.revision, inputSha: run.inputSha };
    return { schemaVersion: EVIDENCE_VERSION_V2, evidenceId, runId: run.runId, revision: run.revision, questionUid, axis, inputSha: run.inputSha, axisInputSha: run.questions[0].axisInputShas[axis], mode: 'MACHINE_CURRENT', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'machine-collector', reviewSessionId: `machine-${run.revision}-${axis}`, reviewerModelOrAgent: 'SYNTHETIC_MACHINE', auditorPrincipalType: 'MACHINE_COLLECTOR', startedAt: '2026-09-08T00:00:00.000Z', frozenAt: '2026-09-08T00:00:01.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: 'MACHINE_CURRENT', findings: [], reviewIsolationProvenanceSha: hash(machineProvenance), reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, machineProvenance, payload: axis === 'METADATA' ? { metadataInputSha: run.questions[0].axisInputShas.METADATA, checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } } : { checkedInputSha: run.inputSha, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS' } } };
  };
  const attachMachines = run => {
    const metadataRef = writeFixture(root, `evidence/metadata-r${run.revision}.json`, machineEvidence(run, 'METADATA', `metadata-r${run.revision}`));
    const staticRef = writeFixture(root, `evidence/static-r${run.revision}.json`, machineEvidence(run, 'STATIC', `static-r${run.revision}`));
    run.evidence = [metadataRef, staticRef];
    run.questions[0].evidence = { METADATA: `metadata-r${run.revision}`, STATIC: `static-r${run.revision}` };
    return { metadataRef, staticRef };
  };
  const row = (run, axis, evidenceRef, evidenceId, mode, receiptSha = null) => ({ questionUid, axis, mode, status: 'PASS', evidenceId, evidenceSha: evidenceRef.sha256, axisInputSha: run.questions[0].axisInputShas[axis], receiptSha });
  const close = (run, rows) => {
    const axes = Object.fromEntries(rows.map(entry => [entry.axis, entry]));
    const closure = materializeQuestionQualityClosure({ questionUid, currentRunInputSha: run.inputSha, requiredAxes: run.questions[0].requiredAxes, axes });
    const set = createQuestionQualityClosureSet({ runId: run.runId, revision: run.revision, currentRunInputSha: run.inputSha, questions: run.questions, closures: [closure] });
    run.questionQualityClosureSetRef = writeFixture(root, `closure/r${run.revision}.json`, set);
    const release = createExamReleaseClosure({ run });
    run.examReleaseClosureRef = writeFixture(root, `release/r${run.revision}.json`, release);
    return set;
  };
  const reuseContext = run => {
    const dependencies = run.inputs.filter(ref => !['source', 'candidate', 'rule', 'verifier'].includes(ref.role)).map(ref => ({ ...ref, ownership: 'GLOBAL', questionUids: [] }));
    const sourceAuthoritySlice = { sourceRecord: sourceQuestion, sourceExamId, registryEntrySha: run.uidAuthority.sourceExamIdRegistryEntrySha, repair: null, exception: null };
    return { dependencySetSha: hash(dependencies), ruleDependencySetSha: hash(run.inputs.filter(ref => ref.role === 'rule')), semanticVerifierSha: hash({ verifiers: run.inputs.filter(ref => ref.role === 'verifier'), coreSha: CORE_SHA }), sourceAuthoritySliceSha: hash(sourceAuthoritySlice) };
  };
  return { root, runId, questionUid, sourceQuestion, sourceRef, candidateRef, write: (relative, value) => writeFixture(root, relative, value), makeRun, attachMachines, row, close, reuseContext };
}

test('QUESTION_UID_v2 is canonical and migrations are explicit', () => {
  const uid = questionUidV2('exam-2026', 13);
  assert.equal(uid, 'exam-2026|13');
  assert.deepEqual(parseQuestionUidV2(uid), { sourceExamId: 'exam-2026', sourceQuestionOrdinal: 13 });
  assert.throws(() => questionUidV2('exam|bad', 1), /SOURCE_EXAM_ID_INVALID/);
  const registry = normalizeSourceExamIdRegistry({ entries: [{ sourceExamId: 'exam-2026', canonicalSourceExamId: 'exam-2026', sourceIdentityKey: 'source-2026', sourcePath: 'source.js', sourceSha256: hash('synthetic-source-bytes'), status: 'ACTIVE', sourceQuestionOrdinal: 13, questionUidV2: uid, legacyQuestionUid: 'source.js|exam-2026|13' }] });
  assert.equal(registry.schemaVersion, 'SOURCE_EXAM_ID_REGISTRY_v1');
  assert.throws(() => normalizeSourceExamIdRegistry({ entries: [registry.entries[0], { ...registry.entries[0], questionUidV2: 'exam-2026|14', sourceQuestionOrdinal: 14, sourceIdentityKey: 'second-identity' }] }), /SOURCE_ID_MULTIPLE_IDENTITIES/);
  const evidence = createUidMigrationEvidence({ legacyQuestionUid: 'source.js|exam-2026|13', sourceExamId: 'exam-2026', sourceQuestionOrdinal: 13 });
  assert.equal(validateUidMigrationEvidence(evidence).status, 'PASS');
  assert.equal(validateUidMigrationEvidence(evidence, { questionUidV2: 'exam-2026|14' }).status, 'FAIL');
});

test('axis projections isolate semantic inputs and hash deterministically', () => {
  const before = q('exam-2026|13');
  const after = q('exam-2026|13', 'new solution');
  const beforeFields = questionFieldHashMap(before);
  const afterFields = questionFieldHashMap(after);
  assert.notEqual(beforeFields.fieldShaMap.SOLUTION, afterFields.fieldShaMap.SOLUTION);
  assert.equal(beforeFields.fieldShaMap.CHOICES, afterFields.fieldShaMap.CHOICES);
  assert.notEqual(axisInputSha(before, 'solution'), axisInputSha(after, 'solution'));
  assert.equal(axisInputSha(before, 'math'), axisInputSha(after, 'math'));
  assert.deepEqual(Object.keys(allAxisInputShas(before)).sort(), ['SOURCE', 'MATH_A1', 'MATH_A2', 'SOLUTION', 'METADATA', 'STATIC', 'V1', 'V2', 'V3', 'RENDER_CAPTURE', 'RENDER_REVIEW'].sort());
});

test('semantic diff maps a local solution edit without exposing unrelated UIDs', () => {
  const previous = [q('exam-2026|12', 'same'), q('exam-2026|13', 'old solution'), q('exam-2026|14', 'same')];
  const current = [q('exam-2026|12', 'same'), q('exam-2026|13', 'new solution'), q('exam-2026|14', 'same')];
  const diff = semanticDiff(previous, current);
  assert.deepEqual(diff.changedUidSet, ['exam-2026|13']);
  assert.deepEqual(diff.changedFieldMap['exam-2026|13'], ['SOLUTION']);
  const impact = changeImpactMap(diff, current, { previousAxisInputShas: computeAxisInputShaMap(previous), currentAxisInputShas: computeAxisInputShaMap(current) });
  assert.ok(impact.affectedUidAxisSet.some(row => row.questionUid === 'exam-2026|13' && row.axis === 'SOLUTION'));
  assert.ok(impact.affectedUidAxisSet.some(row => row.questionUid === 'exam-2026|13' && row.axis === 'RENDER_REVIEW'));
  assert.equal(impact.affectedUidAxisSet.some(row => row.questionUid !== 'exam-2026|13'), false);
  assert.ok(impact.reusableUidAxisSet.some(row => row.questionUid === 'exam-2026|12' && row.axis === 'MATH_A1'));
});

test('solution visual benefit gate follows the canonical V3 denominator', () => {
  const changed = ['SOLUTION'];
  const metadataAxes = requiredAxesForQuestion(profiles.pipelines['tag-enrichment'], { visual: { requirement: 'VISUAL_EXEMPT' } });
  const visualAxes = requiredAxesForQuestion(profiles.pipelines['logic-visual'], { visual: { requirement: 'VISUAL_REQUIRED', actualSolutionVisualAttached: true } });
  assert.equal(metadataAxes.includes('V3'), false);
  assert.equal(visualAxes.includes('V3'), true);
  assert.equal(requiresSolutionVisualBenefitGate(metadataAxes, changed, null), false);
  assert.equal(requiresSolutionVisualBenefitGate(visualAxes, changed, null), true);
  assert.equal(requiresSolutionVisualBenefitGate(visualAxes, changed, { payload: { checks: { SOLUTION_VISUAL_BENEFIT_GATE: 'PASS' } } }), false);
  assert.equal(requiresSolutionVisualBenefitGate(['SOURCE', 'V3'], ['CHOICES'], null), false);
});

test('validated reuse requires immutable prior evidence and exact receipt parity', () => {
  const priorEvidence = { schemaVersion: EVIDENCE_VERSION_V2, ...lifecycle, mode: 'FRESH', runId: 'prior', evidenceId: 'prior-a1', questionUid: 'exam-2026|13', axis: 'MATH_A1', status: 'PASS', validityStatus: 'FROZEN', inputSha: hash({ run: 'prior' }), axisInputSha: hash({ axis: 'MATH_A1', q: 13 }) };
  const priorEvidenceSha = hash(priorEvidence);
  const currentAxisInputSha = priorEvidence.axisInputSha;
  const lifecycleSnapshotRef = { path: 'lifecycle.json', bytes: 0, sha256: hash('lifecycle') };
  const receipt = createEvidenceReuseReceipt({ ...lifecycle, rootFreshEvidenceId: priorEvidence.evidenceId, rootFreshEvidenceSha: priorEvidenceSha, rootFreshRunId: priorEvidence.runId, rootFreshRunInputSha: priorEvidence.inputSha, rootFreshAxisInputSha: priorEvidence.axisInputSha, rootFreshEvidenceRef: { path: 'root-evidence.json', bytes: 0, sha256: priorEvidenceSha }, eligibilityEvidenceRef: { path: 'eligibility.json', bytes: 0, sha256: hash('eligibility') }, lifecycleSnapshotRef, rootFreshRunRef: { path: 'root-run.json', bytes: 0, sha256: hash('root-run') }, rootFreshPacketRef: { path: 'root-packet.json', bytes: 0, sha256: hash('root-packet') }, receiptId: 'reuse-a1-r2', questionUid: priorEvidence.questionUid, axis: 'MATH_A1', priorEvidenceId: priorEvidence.evidenceId, priorEvidenceSha, priorRunInputSha: priorEvidence.inputSha, currentRunId: 'run-2', currentRevision: 2, currentRunInputSha: inputSha, priorAxisInputSha: currentAxisInputSha, currentAxisInputSha, dependencySetSha: hash([]), ruleDependencySetSha: hash([]), semanticVerifierSha: hash({ verifier: 2 }), validatedAt: '2026-09-07T00:00:00Z', status: 'PASS', reasonCodes: ['AXIS_INPUT_PARITY'] });
  const eligibility = { ...lifecycle, currentRunId: 'run-2', currentRevision: 2, currentRunInputSha: inputSha, rootFreshEvidenceSha: priorEvidenceSha, correctionLineageStatus: 'VALID', questionUid: priorEvidence.questionUid, axis: priorEvidence.axis, sourceAuthoritySliceSha: hash('authority'), lifecycleSnapshotSha: lifecycleSnapshotRef.sha256 };
  const context = { rootFreshEvidence: priorEvidence, rootFreshEvidenceSha: priorEvidenceSha, eligibility, sourceAuthoritySliceSha: eligibility.sourceAuthoritySliceSha, lifecycleSnapshotSha: eligibility.lifecycleSnapshotSha, priorEvidence, priorEvidenceId: priorEvidence.evidenceId, priorEvidenceSha, priorRunInputSha: priorEvidence.inputSha, currentRunId: 'run-2', currentRevision: 2, currentRunInputSha: inputSha, currentAxisInputSha, dependencySetSha: receipt.dependencySetSha, ruleDependencySetSha: receipt.ruleDependencySetSha, semanticVerifierSha: receipt.semanticVerifierSha };
  const reuseSchema = JSON.parse(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../contracts/reuse-receipt-v1.schema.json')));
  assert.deepEqual(validateSchema(receipt, reuseSchema), []);
  const missingLifecycleRef = { ...receipt }; delete missingLifecycleRef.lifecycleSnapshotRef;
  assert.ok(validateSchema(missingLifecycleRef, reuseSchema).length > 0);
  assert.throws(() => createEvidenceReuseReceipt({ ...receipt, lifecycleSnapshotRef: null }), /REUSE_LIFECYCLE_SNAPSHOT_REF_REQUIRED/);
  assert.equal(validateEvidenceReuseReceipt(receipt, context).status, 'PASS');
  assert.ok(validateEvidenceReuseReceipt({ ...receipt, lifecycleSnapshotRef: { ...lifecycleSnapshotRef, sha256: hash('wrong') } }, context).errors.includes('REUSE_LIFECYCLE_SNAPSHOT_HASH_MISMATCH'));
  const incompleteRoot = { ...priorEvidence };
  delete incompleteRoot.eligibilityStatus;
  assert.ok(validateEvidenceReuseReceipt(receipt, { ...context, rootFreshEvidence: incompleteRoot }).errors.includes('REUSE_INELIGIBLE:eligibilityStatus'));
  assert.ok(validateEvidenceReuseReceipt(receipt, { ...context, eligibility: null }).errors.includes('REUSE_CORRECTION_LINEAGE_INVALID'));
  assert.ok(validateEvidenceReuseReceipt(receipt, { ...context, eligibility: { ...eligibility, currentRevision: 1 } }).errors.includes('REUSE_CORRECTION_LINEAGE_INVALID'));
  assert.ok(validateEvidenceReuseReceipt(receipt, { ...context, rootFreshEvidence: { ...priorEvidence, revocationStatus: 'REVOKED' } }).errors.includes('REUSE_INELIGIBLE:revocationStatus'));
  const currentEvidence = { ...priorEvidence }; // immutable root identity is not relabelled on reuse
  const freshPacket = { packetSha: hash('fresh-packet'), auditorId: 'reviewer', auditorSessionId: 'review-session', auditorPrincipalType: 'STATELESS_MODEL', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', sealed: true, contextId: 'fresh-context', questionUids: [priorEvidence.questionUid], phase: 'U1', launchId: 'launch', externalTaskId: 'provider' };
  const fresh = { ...priorEvidence, reviewerId: 'reviewer', reviewSessionId: 'review-session', reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-07T00:00:00Z', frozenAt: '2026-09-07T00:01:00Z', findings: [], inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', reviewIsolationProvenanceSha: freshPacket.packetSha, launchId: 'launch', externalTaskId: 'provider', payload: { questionUids: [priorEvidence.questionUid] } };
  assert.deepEqual(validateFreshEvidenceIndependence(fresh, { builderId: 'builder', builderSessionId: 'builder-session' }, freshPacket), []);
  assert.ok(validateFreshEvidenceIndependence(({ ...fresh, withdrawalStatus: 'WITHDRAWN' }), { builderId: 'builder', builderSessionId: 'builder-session' }, freshPacket).includes('FRESH_LIFECYCLE_DECLARATION_INVALID:withdrawalStatus'));
  assert.ok(validateFreshEvidenceIndependence(({ ...fresh, revocationStatus: 'REVOKED' }), { builderId: 'builder', builderSessionId: 'builder-session' }, freshPacket).includes('FRESH_LIFECYCLE_DECLARATION_INVALID:revocationStatus'));
  const missingLifecycle = { ...fresh }; delete missingLifecycle.eligibilityStatus;
  assert.ok(validateFreshEvidenceIndependence(missingLifecycle, { builderId: 'builder', builderSessionId: 'builder-session' }, freshPacket).includes('FRESH_LIFECYCLE_DECLARATION_INVALID:eligibilityStatus'));
  assert.equal(validateEvidenceFreshness(currentEvidence, { currentRunInputSha: inputSha, currentAxisInputSha, reuseReceipt: receipt, reuseContext: context }).status, 'PASS');
  assert.equal(validateEvidenceFreshness(currentEvidence, { currentRunInputSha: inputSha, currentAxisInputSha: hash({ changed: true }), reuseReceipt: receipt, reuseContext: context }).status, 'BLOCKED');
  assert.equal(validateEvidenceFreshness({ ...currentEvidence, schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v1' }, { currentRunInputSha: inputSha, currentAxisInputSha }).errors[0], 'V1_EVIDENCE_AUTO_UPGRADE_FORBIDDEN');
});

test('audit-v2 closes metadata-only revision one and reuses an unchanged SOURCE axis in revision two', t => {
  const f = metadataAuditFixture(t);
  const request = { purpose: 'FINAL_AUDIT', callerRole: 'MAIN_WORKER', auditorId: 'auditor', auditorSessionId: 'auditor-session', parentLaunchId: null, recursiveSubagentLaunchCount: 0, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, contexts: { U1: { sessionId: 'auditor-u1', contextId: 'context-u1' }, U2: { sessionId: 'auditor-u2', contextId: 'context-u2' }, U3: { sessionId: 'auditor-u3', contextId: 'context-u3' } } };
  const r1 = f.makeRun(1);
  const r1Machine = f.attachMachines(r1);
  const r1FreezeRef = f.write('runs/r1-freeze.json', r1);
  initWorkBatch(f.root, { workBatchId: 'job', runIds: [f.runId], builderId: r1.builderId, builderSessionId: r1.builderSessionId });
  const frozen = freezeWorkBatch(f.root, 'job', [r1FreezeRef]);
  const freeze = frozen.freezes.at(-1);
  const preflightBody = {
    schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1',
    operation: 'PREPARE_STATELESS_FINAL_AUDIT',
    workBatchId: 'job',
    purpose: 'FINAL_AUDIT',
    launchId: 'job:1',
    freezeSha: freeze.freezeSha,
    scope: freeze.targets,
    builderId: r1.builderId,
    builderSessionId: r1.builderSessionId,
    requiredCapabilities: { contexts: ['U1', 'U2', 'U3'], contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, automaticRetry: false, recursiveSubagents: false },
  };
  const preflightRequest = { ...preflightBody, requestSha: hash(preflightBody) };
  const preflightResponse = {
    schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1',
    operation: 'PREPARE_STATELESS_FINAL_AUDIT',
    status: 'READY',
    requestSha: preflightRequest.requestSha,
    provider: 'synthetic-provider',
    model: 'synthetic-model',
    externalTaskId: 'provider-r1',
    auditorId: request.auditorId,
    auditorSessionId: request.auditorSessionId,
    contextIsolation: 'STATELESS_INPUTS',
    subagentToolsEnabled: false,
    modelInvocationCount: 0,
    runtimeAttestation: 'synthetic-runtime-attestation',
    contexts: request.contexts,
  };
  const providerPlan = {
    schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1',
    kind: 'PROVIDER_STATELESS_REVIEW_PLAN',
    workBatchId: 'job',
    purpose: 'FINAL_AUDIT',
    launchId: 'job:1',
    freezeSha: freeze.freezeSha,
    scope: freeze.targets,
    builderId: r1.builderId,
    builderSessionId: r1.builderSessionId,
    provider: preflightResponse.provider,
    model: preflightResponse.model,
    externalId: preflightResponse.externalTaskId,
    auditorId: preflightResponse.auditorId,
    auditorSessionId: preflightResponse.auditorSessionId,
    contexts: request.contexts,
    contextIsolation: 'STATELESS_INPUTS',
    subagentToolsEnabled: false,
    preflightRequest,
    preflightResponse,
    preflightResponseSha: hash(preflightResponse),
  };
  const providerPlanRef = f.write('alive/runtime/provider-bridge/job/preflight.json', providerPlan);
  reserveWorkBatchReview(f.root, 'job', { ...request, providerAttestationPlanRef: providerPlanRef });
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-r1', status: 'DISPATCHED' });
  const packet = buildAuditorPacket({ phase: 'U1', questionUid: f.questionUid, payload: { questionUid: f.questionUid, content: f.sourceQuestion.content, choices: f.sourceQuestion.choices }, affectedUidSet: [f.questionUid], auditorId: request.auditorId, auditorSessionId: request.contexts.U1.sessionId, builderId: r1.builderId, builderSessionId: r1.builderSessionId, auditorPrincipalType: 'STATELESS_MODEL', contextId: request.contexts.U1.contextId, inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', sealed: true, launchId: 'job:1', externalTaskId: 'provider-r1' });
  const packetRef = f.write('packets/source-r1.json', packet);
  const startedAt = new Date().toISOString();
  const sourceEvidence = { schemaVersion: EVIDENCE_VERSION_V2, ...lifecycle, evidenceId: 'source-r1', runId: r1.runId, revision: r1.revision, questionUid: f.questionUid, axis: 'SOURCE', inputSha: r1.inputSha, axisInputSha: r1.questions[0].axisInputShas.SOURCE, mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: request.auditorId, reviewSessionId: request.contexts.U1.sessionId, reviewerModelOrAgent: 'SYNTHETIC_AUDITOR', auditorPrincipalType: 'STATELESS_MODEL', startedAt, frozenAt: new Date().toISOString(), priorReviewVisibility: 'NONE', inputVisibilityProfile: 'SOURCE_ONLY', findings: [], reviewIsolationProvenanceSha: packet.packetSha, launchId: 'job:1', externalTaskId: 'provider-r1', reviewStartInputSha: r1.inputSha, reviewEndInputSha: r1.inputSha, payload: { sourceTruthBundleSha: r1.sourceAuthority.sourceTruthBundleSha, fidelityRationale: 'source and choices are canonical', sourceFidelityVerified: true } };
  const sourceRef = f.write('evidence/source-r1.json', sourceEvidence);
  assert.deepEqual(Object.fromEntries(Object.keys(lifecycle).map(key => [key, sourceEvidence[key]])), lifecycle);
  r1.evidence = [sourceRef, r1Machine.metadataRef, r1Machine.staticRef];
  r1.auditorPacketRefs = [packetRef];
  r1.questions[0].evidence = { SOURCE: sourceEvidence.evidenceId, METADATA: 'metadata-r1', STATIC: 'static-r1' };
  const r1Rows = [f.row(r1, 'SOURCE', sourceRef, sourceEvidence.evidenceId, 'FRESH'), f.row(r1, 'METADATA', r1Machine.metadataRef, 'metadata-r1', 'MACHINE_CURRENT'), f.row(r1, 'STATIC', r1Machine.staticRef, 'static-r1', 'MACHINE_CURRENT')];
  const ledger = createBuildWorkLedgerEntry({ buildId: 'build-r1', pipeline: r1.pipeline, questionUid: f.questionUid, builderId: r1.builderId, builderSessionId: r1.builderSessionId, builderModelOrAgent: r1.builderModelOrAgent, runId: r1.runId, revision: r1.revision, inputSha: r1.inputSha, outputRefs: [{ ...f.candidateRef, role: 'candidate' }], reviewEvidenceIds: r1Rows.map(row => row.evidenceId), createdAt: '2026-09-07T00:00:00.000Z' });
  r1.buildWorkLedgerRefs = [f.write('ledger/r1.json', ledger)];
  const r1Closure = f.close(r1, r1Rows);
  const r1Ref = f.write('runs/r1.json', r1);
  const terminalRef = f.write('receipts/r1.json', { launchId: 'job:1', externalId: 'provider-r1', providerPlanRef, status: 'COMPLETED', usedTokens: null, independentAgentLaunchCount: 1, expensiveAgentLaunchCount: 1, concurrentExpensiveAgentPeak: 1, recursiveSubagentLaunchCount: 0, evidenceRefs: r1.evidence, defects: [] });
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-r1', status: 'COMPLETED', providerReceiptRef: terminalRef });
  const r1Audit = auditV2Run(f.root, r1);
  assert.equal(r1Closure.status, 'PASS');
  assert.equal(r1Audit.status, 'PASS', r1Audit.errors.join(';'));
  assert.equal(r1Audit.freshness.some(row => row.axis === 'V3'), false);
  assert.equal(r1Audit.errors.some(error => error.includes('SOLUTION_VISUAL_BENEFIT_GATE')), false);

  const r2 = f.makeRun(2, { runId: r1.runId, revision: r1.revision, inputSha: r1.inputSha, closureSetSha: r1Closure.closureSetSha, candidateRefs: [{ ...f.candidateRef, role: 'candidate' }], runRef: r1Ref, closureSetRef: r1.questionQualityClosureSetRef }, r1.inputSha);
  const r2Machine = f.attachMachines(r2);
  const r2FreezeRef = f.write('runs/r2-freeze.json', r2);
  freezeWorkBatch(f.root, 'job', [r2FreezeRef]);
  const context = f.reuseContext(r2);
  const eligibilityBody = { ...lifecycle, currentRunId: r2.runId, currentRevision: r2.revision, currentRunInputSha: r2.inputSha, rootFreshEvidenceSha: sourceRef.sha256, correctionLineageStatus: 'VALID', questionUid: f.questionUid, axis: 'SOURCE', sourceAuthoritySliceSha: context.sourceAuthoritySliceSha };
  const lifecycleSnapshot = { schemaVersion: 'APMATH_REUSE_LIFECYCLE_SNAPSHOT_v1', currentRunId: r2.runId, currentRevision: r2.revision, currentRunInputSha: r2.inputSha, rootFreshEvidenceSha: sourceRef.sha256, eligibility: eligibilityBody };
  const lifecycleSnapshotRef = f.write('lifecycle/r2-source.json', lifecycleSnapshot);
  const eligibility = { ...eligibilityBody, lifecycleSnapshotSha: lifecycleSnapshotRef.sha256 };
  const eligibilityRef = f.write('eligibility/r2-source.json', eligibility);
  const receipt = createEvidenceReuseReceipt({ ...lifecycle, receiptId: 'reuse-source-r2', questionUid: f.questionUid, axis: 'SOURCE', priorEvidenceId: sourceEvidence.evidenceId, priorEvidenceSha: sourceRef.sha256, priorRunInputSha: r1.inputSha, currentRunId: r2.runId, currentRevision: r2.revision, currentRunInputSha: r2.inputSha, priorAxisInputSha: r1.questions[0].axisInputShas.SOURCE, currentAxisInputSha: r2.questions[0].axisInputShas.SOURCE, dependencySetSha: context.dependencySetSha, ruleDependencySetSha: context.ruleDependencySetSha, semanticVerifierSha: context.semanticVerifierSha, rootFreshEvidenceId: sourceEvidence.evidenceId, rootFreshEvidenceSha: sourceRef.sha256, rootFreshRunId: r1.runId, rootFreshRunInputSha: r1.inputSha, rootFreshAxisInputSha: r1.questions[0].axisInputShas.SOURCE, rootFreshEvidenceRef: sourceRef, eligibilityEvidenceRef: eligibilityRef, lifecycleSnapshotRef, rootFreshRunRef: r1Ref, rootFreshPacketRef: packetRef, validatedAt: '2026-09-08T00:00:00.000Z', status: 'PASS', reasonCodes: ['AXIS_INPUT_PARITY'] });
  const receiptRef = f.write('receipts/reuse-source-r2.json', receipt);
  r2.evidence = [sourceRef, r2Machine.metadataRef, r2Machine.staticRef];
  r2.reuseReceipts = [receiptRef];
  r2.questions[0].evidence = { SOURCE: sourceEvidence.evidenceId, METADATA: 'metadata-r2', STATIC: 'static-r2' };
  const r2Rows = [f.row(r2, 'SOURCE', sourceRef, sourceEvidence.evidenceId, 'REUSED', hash(receipt)), f.row(r2, 'METADATA', r2Machine.metadataRef, 'metadata-r2', 'MACHINE_CURRENT'), f.row(r2, 'STATIC', r2Machine.staticRef, 'static-r2', 'MACHINE_CURRENT')];
  f.close(r2, r2Rows);
  const r2Audit = auditV2Run(f.root, r2);
  assert.equal(r2Audit.status, 'PASS', r2Audit.errors.join(';'));
  assert.deepEqual(r2Audit.freshness.find(row => row.axis === 'SOURCE'), { ...r2Rows[0], errors: [] });
});

test('question-quality closure set is 100% fresh or validated reuse and never production authority', () => {
  const questions = [q('exam-2026|12'), q('exam-2026|13')];
  const close = question => materializeQuestionQualityClosure({ questionUid: question.questionUid, currentRunInputSha: inputSha, requiredAxes: ['MATH_A1', 'SOLUTION', 'STATIC'], axes: { MATH_A1: axisRow(question.questionUid, 'MATH_A1', 'REUSED'), SOLUTION: axisRow(question.questionUid, 'SOLUTION', 'FRESH'), STATIC: axisRow(question.questionUid, 'STATIC', 'MACHINE_CURRENT') } });
  const set = createQuestionQualityClosureSet({ runId: 'run-2', revision: 2, currentRunInputSha: inputSha, questions, closures: questions.map(close) });
  assert.equal(set.status, 'PASS');
  assert.equal(validateQuestionQualityClosureSet(set, { runId: 'run-2', revision: 2, currentRunInputSha: inputSha }).status, 'PASS');
  assert.equal(validateQuestionQualityClosureSet({ ...set, productionAuthorized: true }, { runId: 'run-2', revision: 2, currentRunInputSha: inputSha }).status, 'BLOCKED');
  assert.equal(createQuestionQualityClosureSet({ runId: 'run-2', revision: 2, currentRunInputSha: inputSha, questions, closures: [close(questions[0])] }).status, 'BLOCKED');
  assert.doesNotThrow(() => validateQuestionQualityClosureSet({ ...set, questionUids: ['duplicate', 'duplicate'] }));
});

test('EXAM_RELEASE rejects case names without evidence and accepts canonical N/A', () => {
  const question = q('exam-2026|1');
  const closure = materializeQuestionQualityClosure({ questionUid: question.questionUid, currentRunInputSha: inputSha, requiredAxes: ['MATH_A1'], axes: { MATH_A1: axisRow(question.questionUid, 'MATH_A1', 'FRESH') } });
  const quality = createQuestionQualityClosureSet({ runId: 'exam-run', revision: 1, currentRunInputSha: inputSha, questions: [question], closures: [closure] });
  assert.equal(quality.status, 'PASS');
  const run = { runId: 'exam-run', revision: 1, inputSha, questions: [question], inputs: [], pipeline: 'past-exam', publicationIntent: 'FULL_EXAM' };
  const release = createExamReleaseClosure({ run, qualityClosureSet: quality, renderCases: RELEASE_CASES });
  assert.equal(release.status, 'BLOCKED');
  assert.ok(release.errors.includes('RELEASE_RENDER_EVIDENCE_AGGREGATE_REQUIRED'));
  const partialRun = { ...run, publicationIntent: 'QUESTION_ONLY' };
  const na = createExamReleaseClosure({ run: partialRun });
  assert.equal(validateExamReleaseClosure(na, { run: partialRun }).status, 'PASS');
  assert.equal(validateExamReleaseClosure({ ...na, reason: 'unbound reason' }, { run: partialRun }).status, 'BLOCKED');
});

test('unified auditor packets enforce sealed visibility and principal separation', () => {
  const packet = buildAuditorPacket({ phase: 'U1', questionUid: 'exam-2026|13', payload: { questionUid: 'exam-2026|13', content: 'x', choices: ['1'] }, affectedUidSet: ['exam-2026|13'], auditorId: 'auditor', auditorSessionId: 'auditor-u1', builderId: 'builder', builderSessionId: 'builder-session', auditorPrincipalType: 'STATELESS_MODEL', contextId: 'ctx-u1', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', sealed: true, launchId: 'job:1', externalTaskId: 'provider:1' });
  assert.equal(validateAuditorPacket(packet, { affectedUidSet: ['exam-2026|13'] }).status, 'PASS');
  const evidence = { ...lifecycle, questionUid: 'exam-2026|13', axis: 'MATH_A1', reviewerId: 'auditor', reviewSessionId: 'auditor-u1', reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-07T00:00:00Z', frozenAt: '2026-09-07T00:01:00Z', findings: [], inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', reviewIsolationProvenanceSha: packet.packetSha, launchId: 'job:1', externalTaskId: 'provider:1' };
  const runIdentity = { builderId: 'builder', builderSessionId: 'builder-session' };
  assert.deepEqual(validateFreshEvidenceIndependence(evidence, runIdentity, packet), []);
  assert.ok(validateFreshEvidenceIndependence({ ...evidence, axis: 'MATH_A2' }, runIdentity, packet).includes('AXIS_PHASE_VISIBILITY_EXACT_BINDING'));

  const { packetSha: oldSha, ...body } = packet;
  const leaked = { ...body, payload: { ...body.payload, curriculum: { hiddenContext: { answer: '1' } } } };
  assert.ok(validateAuditorPacket({ ...leaked, packetSha: hash(leaked) }, { affectedUidSet: ['exam-2026|13'] }).errors.some(error => error.startsWith('NESTED_BLIND_CONTEXT_LEAK:')));
  assert.equal(validateAuditorPacket({ ...packet, payload: { ...packet.payload, solution: 'leak' } }, { affectedUidSet: ['exam-2026|13'] }).status, 'BLOCKED');
  assert.equal(createSealedAuditorSubcontexts({ builderId: 'builder', builderSessionId: 'builder-session', auditorId: 'auditor', auditorPrincipalType: 'STATELESS_MODEL', sessions: { U1: 's1', U2: 's2', U3: 's3' }, contextIds: { U1: 'c1', U2: 'c2', U3: 'c3' } }).status, 'PASS');
  assert.deepEqual(secondAuditorRequirement({ independentAnswerMatches: false }), { required: false, eligible: true, requiresExplicitAuthorization: true, maxAdditionalAuditors: 1, reasonCodes: ['ANSWER_MISMATCH'] });
});

test('build ledger and machine-readable contracts are bounded', () => {
  const entry = createBuildWorkLedgerEntry({ buildId: 'b1', pipeline: 'logic-visual', questionUid: 'exam-2026|13', builderId: 'builder', builderSessionId: 'session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', runId: 'run', revision: 1, inputSha, reviewEvidenceIds: ['v3', 'a1', 'v3'], createdAt: '2026-09-07T00:00:00Z' });
  assert.equal(validateBuildWorkLedgerEntry(entry).status, 'PASS');
  assert.deepEqual(entry.reviewEvidenceIds, ['a1', 'v3', 'v3']);
  const contractRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'contracts');
  const schema = JSON.parse(fs.readFileSync(path.join(contractRoot, 'run-v2.schema.json')));
  assert.deepEqual(validateSchema(runFixture(), schema), []);
  const stale = runFixture(); delete stale.workBatchId;
  assert.ok(validateSchema(stale, schema).some(error => error.includes('workBatchId')));
  const missingRelease = runFixture(); delete missingRelease.examReleaseClosureRef;
  assert.ok(validateSchema(missingRelease, schema).some(error => error.includes('examReleaseClosureRef')));
  const evidenceSchema = JSON.parse(fs.readFileSync(path.join(contractRoot, 'evidence-v2.schema.json')));
  const freshSource = { schemaVersion: EVIDENCE_VERSION_V2, ...lifecycle, evidenceId: 'fresh-source', runId: 'run', revision: 1, questionUid: 'exam-2026|13', axis: 'SOURCE', inputSha, axisInputSha: hash('source-axis'), mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'auditor', reviewSessionId: 'auditor-u1', reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-07T00:00:00Z', frozenAt: '2026-09-07T00:01:00Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: 'SOURCE_ONLY', findings: [], reviewIsolationProvenanceSha: hash('packet'), reviewStartInputSha: inputSha, reviewEndInputSha: inputSha, payload: { sourceTruthBundleSha: hash('source'), fidelityRationale: 'independent source check', sourceFidelityVerified: true } };
  assert.deepEqual(validateSchema(freshSource, evidenceSchema), []);
  const schemaMissingLifecycle = { ...freshSource }; delete schemaMissingLifecycle.revocationStatus;
  assert.ok(validateSchema(schemaMissingLifecycle, evidenceSchema).length > 0);
  const machineMetadata = { ...freshSource, axis: 'METADATA', mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', payload: { metadataInputSha: hash('metadata-axis'), checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } } };
  for (const key of Object.keys(lifecycle)) delete machineMetadata[key];
  assert.deepEqual(validateSchema(machineMetadata, evidenceSchema), []);
  assert.ok(validateSchema({ schemaVersion: 'APMATH_PIPELINE_RUN_v2' }, schema).length > 0);
});

test('audit-v2 requires a persisted whole-job freeze even for schema-valid input', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-v2-audit-'));
  try {
    fs.writeFileSync(path.join(root, 'candidate.js'), 'window.questionBank=[];');
    const run = runFixture(fileRef(root, 'candidate.js'));
    run.inputSha = runInputSha(run);
    initWorkBatch(root, { workBatchId: 'job', runIds: [run.runId], builderId: run.builderId, builderSessionId: run.builderSessionId, tokenBudget: 1000 });
    const report = auditV2Run(root, run);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.some(error => error.includes('WORK_BATCH_FREEZE_REQUIRED')), report.errors.join(';'));
    assert.equal(report.productionAuthorized, false);
    assert.equal(report.cost.workBatchId, 'job');
    assert.equal(report.cost.expensiveAgentLaunchCount, 0);
    assert.equal(report.cost.recursiveSubagentLaunchCount, 0);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('render impact is selective and global invalidators escalate only render scope', () => {
  const witness = (questionUid, y) => ({ questionUid, mode: 'solution', viewportProfile: 'desktop', page: 1, boundingBox: { x: 1, y, width: 10, height: 10 }, screenshot: { sha256: hash([questionUid, y]) }, runtimeResponseSha: hash('runtime'), assetSha: hash('asset'), blocks: [{ blockId: 'final', placementSha: hash(y), screenshot: { sha256: hash(y) }, final: true }] });
  const previous = [witness('exam-2026|12', 1), witness('exam-2026|13', 20)];
  const current = [previous[0], witness('exam-2026|13', 24)];
  const local = detectRenderImpact(previous, current);
  assert.deepEqual(local.renderChangedUidSet, ['exam-2026|13']);
  assert.equal(local.changedRenderSet[0].mode, 'solution');
  assert.equal(local.changedRenderSet[0].viewport, 'desktop');
  const global = detectRenderImpact(previous, current, { globalDependencies: ['CSS'] });
  assert.deepEqual(global.affectedRenderUidSet, ['exam-2026|12', 'exam-2026|13']);
});

test('continuation denominator requires every frozen final block review', () => {
  const denominator = createContinuationDenominator({ questionUid: 'exam-2026|13', cases: ['solution/desktop'], blocks: [{ questionUid: 'exam-2026|13', caseKey: 'solution/desktop', blockId: 'final', placementSha: hash({ page: 2 }), screenshotSha: hash('png'), final: true }] });
  assert.equal(denominator.status, 'PASS');
  assert.equal(validateContinuationDenominator(denominator, { questionUid: 'exam-2026|13', cases: ['solution/desktop'], reviewedBlocks: [{ caseKey: 'solution/desktop', blockId: 'final', status: 'PASS', placementSha: hash({ page: 2 }), screenshotSha: hash('png') }] }).status, 'PASS');
  assert.equal(validateContinuationDenominator(denominator, { questionUid: 'exam-2026|13', cases: ['solution/desktop'], reviewedBlocks: [] }).status, 'BLOCKED');
});

test('HIGH_RISK review batches cannot bypass the hard maximum with a size exception', () => {
  const root = fs.mkdtempSync(path.join(process.env.TEMP || process.cwd(), 'apmath-batch-'));
  try {
    const uids = ['exam-2026|1', 'exam-2026|2', 'exam-2026|3', 'exam-2026|4', 'exam-2026|5', 'exam-2026|6'];
    const inventory = { rows: uids.map(questionUid => ({ questionUid })) };
    const inventoryBytes = Buffer.from(JSON.stringify(inventory));
    const manifest = { batchId: 'batch-1', batchNo: 1, revision: 1, supersedes: null, isCanonical: true, riskProfile: 'HIGH_RISK', plannedSize: 6, questionUids: uids, visualDecisionPlan: { NO_VISUAL: 0, KEEP_EXISTING: 6, REBUILD_EXISTING: 0, ADD_NEW_VISUAL: 0 }, visualTypes: ['set-cardinality'], factSchemaVersions: ['APMATH_VISUAL_FACT_v2'], appliedRuleRefs: [{ path: 'docs/rules/00_RULES_INDEX.md', bytes: 0, sha256: 'sha256:' + '0'.repeat(64), declaredVersion: 'index' }], inventorySha: bytesSha(inventoryBytes) };
    manifest.manifestSha = objectSha(manifest);
    const result = validateBatchManifest(root, manifest, inventory, inventoryBytes, [{ recordId: 'old', batchId: 'old', revision: 1, supersedes: null, isCanonical: true, inputSha: hash('old'), questionUids: ['old'] }]);
    assert.equal(result.status, 'FAIL');
    assert.ok(result.errors.includes('HIGH_RISK_HARD_MAX'));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});


test('machine capture remains current and cannot masquerade as a fresh semantic review', () => {
  const run = { runId: 'run', revision: 2, inputSha };
  const provenance = { ...run, collector: 'SYNTHETIC_TEST_ONLY' };
  const evidence = { ...run, schemaVersion: EVIDENCE_VERSION_V2, axis: 'RENDER_CAPTURE', mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', validityStatus: 'FROZEN', axisInputSha: hash('capture-axis'), reviewStartInputSha: inputSha, reviewEndInputSha: inputSha, machineProvenance: provenance, reviewIsolationProvenanceSha: hash(provenance), payload: { actualBrowser: true, productionEngine: true, itemWitnesses: [{ questionUid: 'exam|1' }] } };
  assert.deepEqual(validateMachineEvidence(evidence, run), []);
  assert.equal(validateEvidenceFreshness(evidence, { currentRunInputSha: inputSha, currentAxisInputSha: evidence.axisInputSha }).mode, 'MACHINE_CURRENT');
  assert.equal(validateEvidenceFreshness(evidence, { currentRunInputSha: hash('changed'), currentAxisInputSha: evidence.axisInputSha }).status, 'BLOCKED');
  assert.ok(validateMachineEvidence({ ...evidence, mode: 'FRESH' }, run).includes('MACHINE_COLLECTOR_SEMANTICS_INVALID'));
});
