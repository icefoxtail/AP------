import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { bytesSha, fileRef, objectSha } from '../../pipeline-core/canonical.mjs';
import { EVIDENCE_VERSION_V2, denominatorInput, runInputSha } from '../../pipeline-core/closure.mjs';
import { auditV2Run, computeV2AxisInputShas } from '../../pipeline-core/v2-audit.mjs';
import { normalizeSourceExamIdRegistry } from '../../pipeline-core/question-uid.mjs';
import { runtimeDependencyBundle } from '../../pipeline-core/runtime.mjs';
import { createContinuationDenominator } from '../../pipeline-core/continuation.mjs';
import { structureFingerprint } from '../../pipeline-core/visual.mjs';
import { SOLUTION_QUALITY_CHECKS, SOLUTION_QUALITY_VERSION } from '../../pipeline-core/solution-quality.mjs';
import { createBuildWorkLedgerEntry } from '../../pipeline-core/build-work-ledger.mjs';
import { materializeQuestionQualityClosure, createQuestionQualityClosureSet } from '../../pipeline-core/question-quality-set.mjs';
import { initWorkBatch, readWorkBatch } from '../../pipeline-core/work-batch.mjs';
import { recoveryFixture } from '../../pipeline-core/tests/recovery-fixture.mjs';
import { png } from '../../pipeline-core/tests/fixture.mjs';
import { createRenderReview } from '../../pipeline-core/render.mjs';
import { CALIBRATION_AXES, QUALITY_PROFILE_CHECKS, calibrationTarget, readProductionSample } from '../lib/calibration.mjs';
import { rulePreflight } from '../../pipeline-core/rulepack.mjs';
import { resumePastExam } from '../resume-past-exam.mjs';
import { assetSetSha } from '../lib/production-boundary.mjs';
import { createReviewReady } from '../lib/review-ready.mjs';
import { createCanonicalAuditSnapshot } from '../../pipeline-core/canonical-audit-authority.mjs';

export const RELEASE_RENDER_CASES = Object.freeze(['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile']);
export const RELEASE_GATE_STATUSES = Object.freeze({ sourceFidelity: 'PASS', math: 'PASS', solutionQuality: 'PASS', visual: 'PASS', metadata: 'PASS', finalAudit: 'PASS', render: 'PASS' });

function writeBytes(root, relative, bytes) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
  return fileRef(root, relative);
}

function readJson(root, ref) {
  return JSON.parse(fs.readFileSync(path.join(root, ref.path), 'utf8'));
}

function refreshMachineEvidence(fixture, run, axisShas) {
  run.evidence = run.evidence.map(ref => {
    const evidence = readJson(fixture.root, ref);
    if (!['STATIC', 'METADATA'].includes(evidence.axis)) return ref;
    const machineProvenance = { ...(evidence.machineProvenance || {}), runId: run.runId, revision: run.revision, inputSha: run.inputSha, collector: 'SYNTHETIC_CANONICAL_FIXTURE' };
    const updated = { ...evidence, runId: run.runId, revision: run.revision, inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, axisInputSha: axisShas[run.questions[0].questionUid][evidence.axis], machineProvenance, reviewIsolationProvenanceSha: objectSha(machineProvenance) };
    if (evidence.axis === 'STATIC') updated.payload = { ...updated.payload, checkedInputSha: run.inputSha };
    if (evidence.axis === 'METADATA') updated.payload = { ...updated.payload, metadataInputSha: axisShas[run.questions[0].questionUid].METADATA };
    return fixture.write(ref.path, updated);
  });
}

function ensureCanonicalMachineEvidence(fixture, run, axisShas, candidateRef) {
  for (const question of run.questions) for (const axis of ['STATIC', 'METADATA']) {
    const existing = (run.evidence || []).map(ref => readJson(fixture.root, ref)).find(evidence => evidence.questionUid === question.questionUid && evidence.axis === axis);
    if (existing) {
      question.evidence[axis] = existing.evidenceId;
      continue;
    }
    const machineProvenance = { runId: run.runId, revision: run.revision, inputSha: run.inputSha, collector: 'SYNTHETIC_CANONICAL_FIXTURE', currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256 };
    const payload = axis === 'STATIC'
      ? { checkedInputSha: run.inputSha, currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS', studentSerialization: 'PASS' } }
      : { metadataInputSha: axisShas[question.questionUid][axis], currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } };
    const evidence = { schemaVersion: EVIDENCE_VERSION_V2, evidenceId: `canonical-machine-${run.runId}-${question.qid}-${axis.toLowerCase()}`, runId: run.runId, revision: run.revision, questionUid: question.questionUid, axis, axisInputSha: axisShas[question.questionUid][axis], inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'canonical-machine-collector', reviewSessionId: `${run.runId}:machine:${axis}`, reviewerModelOrAgent: 'SYNTHETIC_CANONICAL_FIXTURE', startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: 'MACHINE_CURRENT', findings: [], reviewIsolationProvenanceSha: objectSha(machineProvenance), machineProvenance, payload };
    const ref = fixture.write(`release/evidence/${evidence.evidenceId}-r${run.revision}.json`, evidence);
    run.evidence.push(ref);
    question.evidence[axis] = evidence.evidenceId;
  }
}

function refreshCanonicalReviewEvidence(fixture, run, axisShas) {
  run.evidence = run.evidence.map(ref => {
    const evidence = readJson(fixture.root, ref);
    if (['STATIC', 'METADATA', 'RENDER_CAPTURE', 'RENDER_REVIEW'].includes(evidence.axis)) return ref;
    const questionUid = evidence.questionUid;
    const updated = { ...evidence, runId: run.runId, revision: run.revision, inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, axisInputSha: axisShas[questionUid]?.[evidence.axis] || evidence.axisInputSha };
    return fixture.write(ref.path, updated);
  });
}

function addCanonicalRenderEvidence(fixture, run, axisShas, candidateRef) {
  const uid = run.questions[0].questionUid;
  const runtimeResponses = (run.renderRuntime.localFiles || []).map(ref => ({ url: `http://synthetic/${ref.path}`, localPath: ref.path, role: ref.path === run.renderRuntime.enginePath ? 'engine' : 'runtime', status: 200, bytes: ref.bytes, sha256: ref.sha256 }));
  const runtimeResponseBundleSha = objectSha(runtimeResponses);
  const cases = [];
  for (const caseKey of RELEASE_RENDER_CASES) {
    const [mode, viewportProfile] = caseKey.split('/');
    const viewport = { profile: viewportProfile, width: viewportProfile === 'mobile' ? 390 : 1280, height: 844 };
    const screenshot = writeBytes(fixture.root, `release/screens/${run.runId}-${run.revision}-${mode}-${viewportProfile}.png`, png(viewport.width, viewport.height));
    const assetAssociations = run.questions.flatMap(question => {
      const paths = mode === 'solution' ? question.solutionAssetPaths || [] : mode === 'exam' ? question.problemAssetPaths || [] : [];
      return paths.map(assetPath => {
        const ref = run.inputs.find(input => input.path === assetPath);
        return { questionUid: question.questionUid, path: assetPath, sha256: ref?.sha256 || null, status: ref ? 'PASS' : 'FAIL' };
      });
    });
    const assetRefs = run.inputs.filter(ref => assetAssociations.some(row => row.path === ref.path && row.status === 'PASS'));
    const placement = { page: 1, column: 1, flowPosition: 0, boundingBox: { x: 0, y: 0, width: Math.max(1, viewport.width - 20), height: 80 }, sourceBlockId: null, segment: 0, segmentOffset: 0 };
    const nativeScreenshot = { ...screenshot, mimeType: 'image/png', dataUrl: `data:image/png;base64,${fs.readFileSync(path.join(fixture.root, screenshot.path)).toString('base64')}` };
    const block = { questionUid: uid, mode, viewportProfile, caseKey, ...placement, blockId: `${uid}:${caseKey}:block`, placementSha: objectSha(placement), screenshot: nativeScreenshot, final: true };
    const continuationDenominator = createContinuationDenominator({ questionUid: uid, cases: [caseKey], blocks: [block] });
    const witnessBase = { questionUid: uid, mode, viewportProfile, status: 'CAPTURED', screenshot, boundingBox: placement.boundingBox, page: 1, column: 1, flowPosition: 0, continuation: false, blocks: [block], continuationDenominator, runtimeResponseSha: runtimeResponseBundleSha, assetSha: objectSha(assetAssociations.filter(row => row.questionUid === uid)) };
    const witness = { ...witnessBase, witnessSha: objectSha(witnessBase) };
    const machineProvenance = { runId: run.runId, revision: run.revision, inputSha: run.inputSha, currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, collector: 'SYNTHETIC_CANONICAL_FIXTURE' };
    const capturePayload = { actualBrowser: true, productionEngine: true, browserVersion: 'SYNTHETIC_CANONICAL_BROWSER', mode, candidatePath: candidateRef.path, candidateRef, currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, questionUids: [uid], viewport, expectedQuestionCount: 1, observedQuestionCount: 1, lastQuestionId: 1, screenshot, itemWitnesses: [witness], assetAssociations, assetRefs, checks: { runtime: 'PASS', mathJax: 'PASS', fonts: 'PASS', imageDecode: 'PASS', assetAssociation: 'PASS', questionCount: 'PASS', lastQuestion: 'PASS', clipping: 'PASS', overflow: 'PASS' }, pageErrors: [], failedRequests: [], unboundRequests: [], runtimeBundleSha: run.renderRuntime.bundleSha, runtimeResponses, runtimeResponseBundleSha };
    const captureBody = { schemaVersion: EVIDENCE_VERSION_V2, evidenceId: `${run.runId}-${run.revision}-${mode}-${viewportProfile}-capture`, runId: run.runId, revision: run.revision, axis: 'RENDER_CAPTURE', questionUid: uid, mode: 'MACHINE_CURRENT', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'canonical-machine-collector', reviewSessionId: `canonical-machine-${run.runId}-${run.revision}-${caseKey}`, reviewerModelOrAgent: 'SYNTHETIC_CANONICAL_FIXTURE', auditorPrincipalType: 'MACHINE_COLLECTOR', inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', findings: [], priorReviewVisibility: 'NONE', inputVisibilityProfile: 'MACHINE_CURRENT', reviewIsolationProvenanceSha: objectSha(machineProvenance), machineProvenance, axisInputShas: { [uid]: axisShas[uid].RENDER_CAPTURE }, reviewAxisInputShas: { [uid]: axisShas[uid].RENDER_REVIEW }, payload: capturePayload };
    const captureRef = fixture.write(`release/evidence/${run.runId}-${run.revision}-${mode}-${viewportProfile}-capture.json`, captureBody);
    const blockReview = { caseKey, blockId: block.blockId, status: 'PASS', placementSha: block.placementSha, screenshotSha: screenshot.sha256 };
    const reviewBody = { schemaVersion: EVIDENCE_VERSION_V2, evidenceId: `${run.runId}-${run.revision}-${mode}-${viewportProfile}-review`, runId: run.runId, revision: run.revision, axis: 'RENDER_REVIEW', mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: `canonical-reviewer-${run.runId}-${run.revision}-${caseKey}`, reviewSessionId: `canonical-review-${run.runId}-${run.revision}-${caseKey}`, reviewerModelOrAgent: 'SYNTHETIC_CANONICAL_FIXTURE', auditorPrincipalType: 'STATELESS_MODEL', inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, startedAt: '2026-09-14T06:02:00.000Z', frozenAt: '2026-09-14T06:03:00.000Z', findings: [], priorReviewVisibility: 'NONE', inputVisibilityProfile: 'CANDIDATE_ONLY', reviewIsolationProvenanceSha: objectSha({ runId: run.runId, revision: run.revision, caseKey, reviewer: 'canonical' }), axisInputShas: { [uid]: axisShas[uid].RENDER_REVIEW }, payload: { captureEvidenceId: captureBody.evidenceId, captureEvidenceSha: captureRef.sha256, runtimeBundleSha: run.renderRuntime.bundleSha, runtimeResponseBundleSha, questionUids: [uid], freshQuestionUids: [uid], checks: { clipping: 'PASS', overflow: 'PASS', readability: 'PASS' }, itemReviews: [{ questionUid: uid, screenshotSha: screenshot.sha256, status: 'PASS', blockReviews: [blockReview] }] } };
    const reviewRef = fixture.write(`release/evidence/${run.runId}-${run.revision}-${mode}-${viewportProfile}-review.json`, reviewBody);
    run.evidence.push(captureRef, reviewRef);
    cases.push({ caseKey, captureRef, capture: captureBody, reviewRef, review: reviewBody });
  }
  return { cases, runtimeResponseBundleSha };
}

function prepareCanonicalPastExamInputs(fixture, run) {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
  // These calibration/source authority documents are shared immutable inputs
  // across candidate revisions. Reuse the first exact ref instead of
  // overwriting it when a later revision is prepared.
  const stableWrite = (relative, value) => fs.existsSync(path.join(fixture.root, relative)) ? fileRef(fixture.root, relative) : fixture.write(relative, value);
  const manifest = fs.readFileSync(path.join(repositoryRoot, 'docs/rules/MANIFEST.md'), 'utf8');
  const manifestRef = fixture.write('docs/rules/MANIFEST.md', manifest);
  const ruleRefs = [...manifest.matchAll(/^- (.+?) \|/gm)].map(match => {
    const relative = `docs/rules/${match[1]}`;
    return fixture.write(relative, fs.readFileSync(path.join(repositoryRoot, relative), 'utf8'));
  });
  run.inputs.push({ ...manifestRef, role: 'rule' }, ...ruleRefs.map(ref => ({ ...ref, role: 'rule' })));

  const contractPath = 'archive/tools/past-exam-pipeline/completion-contract.json';
  const contract = JSON.parse(fs.readFileSync(path.join(repositoryRoot, contractPath), 'utf8'));
  const contractRef = fixture.write(contractPath, JSON.stringify(contract));
  const verifierRef = fixture.write('archive/tools/pipeline-core/closure.mjs', fs.readFileSync(path.join(repositoryRoot, 'archive/tools/pipeline-core/closure.mjs'), 'utf8'));
  const sourcePdfRef = stableWrite('release/authority/source.pdf', 'synthetic source pixels');
  for (const question of run.questions) question.sourceIdentityKey = `${question.sourceExamId}|${question.sourceQuestionOrdinal}`;
  const inventory = {
    schema: 'PAST_EXAM_SOURCE_INVENTORY_v1',
    examId: run.questions[0].sourceExamId,
    sourceDocumentSha256: sourcePdfRef.sha256,
    pageCount: 1,
    expectedQuestionCount: run.questions.length,
    status: 'SOURCE_INVENTORY_FROZEN',
    questions: run.questions.map(question => ({ sourceIdentityKey: question.sourceIdentityKey, sourceDocumentSha256: sourcePdfRef.sha256, sourceQuestionNo: String(question.sourceQuestionOrdinal), sourcePageNo: 1, disposition: 'INCLUDED' })),
  };
  const inventoryRef = stableWrite('release/authority/source-inventory.json', inventory);

  const sampleQuestion = { id: 1, level: '상', questionType: '서술형', standardCourse: '공통수학1', content: 'x+1=2', choices: ['1', '2', '3', '4', '5'], answer: '1', solution: 'The answer is 1.', solutionImage: 'solution.svg' };
  const samplePaths = ['archive/exams/original/high/h1/1mid/calibration-a.js', 'archive/exams/original/high/h1/1mid/calibration-b.js'];
  for (const samplePath of samplePaths) fixture.write(samplePath, `window.examTitle="calibration";window.questionBank=${JSON.stringify([sampleQuestion])};`);
  execFileSync('git', ['init', '-b', 'main'], { cwd: fixture.root, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Synthetic Fixture'], { cwd: fixture.root, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'synthetic-fixture@example.invalid'], { cwd: fixture.root, stdio: 'ignore' });
  execFileSync('git', ['add', '.'], { cwd: fixture.root, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'synthetic calibration baseline'], { cwd: fixture.root, stdio: 'ignore' });
  const mainCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: fixture.root, encoding: 'utf8' }).trim();
  execFileSync('git', ['update-ref', 'refs/remotes/origin/main', mainCommit], { cwd: fixture.root, stdio: 'ignore' });
  const samples = samplePaths.map(samplePath => {
    const actual = readProductionSample(fixture.root, mainCommit, samplePath);
    const { bank, ...summary } = actual;
    return { ...summary, selectionReason: 'Synthetic calibration sample', qualityAcceptanceReason: 'Synthetic canonical fixture', checkedAxes: Object.fromEntries(CALIBRATION_AXES.map(axis => [axis, { status: 'PASS', observation: `Synthetic ${axis} observation` }])), questionObservations: bank.map(question => ({ qid: question.id, questionSha: objectSha(question), solutionExcerpt: 'The answer is 1.', observation: 'Synthetic full-question observation' })) };
  });
  const anchor = `${samplePaths[0]}|1`;
  const lockPayload = {
    schemaVersion: 'PAST_EXAM_REFERENCE_SAMPLE_LOCK_v1',
    status: 'PASS',
    mainCommit,
    rulePackSha: rulePreflight(fixture.root).rulePackSha,
    target: calibrationTarget(fixture.root, { examId: run.questions[0].sourceExamId, pdfPath: sourcePdfRef.path, archiveRelativePath: `original/high/h1/1final/${run.questions[0].sourceExamId}.js` }),
    readerId: run.builderId,
    readerSessionId: run.builderSessionId,
    startedAt: '2026-01-01T00:00:00.000Z',
    frozenAt: '2026-01-01T00:01:00.000Z',
    baselineObservation: 'Synthetic baseline absent',
    baselineQuestionObservations: [],
    sourceTruthPolicy: 'TARGET_SOURCE_ONLY',
    sampleRole: 'QUALITY_CALIBRATION_ONLY',
    samples,
    productionQualityProfile: Object.fromEntries(QUALITY_PROFILE_CHECKS.map(key => [key, { status: 'PASS', minimumStandard: `Synthetic minimum for ${key}`, sampleAnchors: [anchor] }]))
  };
  const lockRef = stableWrite('release/authority/reference-sample-lock.json', lockPayload);
  const projectConfig = { schemaVersion: 'PAST_EXAM_V3_PROJECT_CONFIG', referenceSampleLockRef: lockRef, geometryPolicyRef: contract.geometryPolicyRef, sourceInventorySha: inventoryRef.sha256 };
  const projectRef = stableWrite('release/authority/project-config.json', projectConfig);
  run.pastExamCompletionRef = projectRef;
  run.publicationIntent = 'FULL_EXAM';
  run.inputs.push({ ...projectRef, role: 'spec' }, { ...lockRef, role: 'spec' }, { ...inventoryRef, role: 'dependency' }, { ...contractRef, role: 'spec' }, { ...sourcePdfRef, role: 'dependency' }, { ...verifierRef, role: 'verifier' });
}

function prepareCanonicalAuthorities(fixture, run) {
  const sourceRef = run.inputs.find(ref => ref.role === 'source');
  if (!sourceRef) throw new Error('TEST_CANONICAL_SOURCE_REF_REQUIRED');
  const sourceTruthRefs = [sourceRef];
  const sourceTruthBundleSha = objectSha(sourceTruthRefs);
  const applicability = Object.fromEntries(['baselineDiscoveryEvidenceRef', 'approvedSourceRepairLedgerRef', 'approvedSourceExceptionLedgerRef'].map(key => {
    const evidenceRef = fixture.write(`release/authority/${run.runId}-${key}.json`, { status: 'PASS', applicability: 'NOT_APPLICABLE', reason: `SYNTHETIC_CANONICAL_FIXTURE:${key}`, sourceTruthBundleSha });
    return [key, { status: 'NOT_APPLICABLE', reason: `SYNTHETIC_CANONICAL_FIXTURE:${key}`, evidenceRef }];
  }));
  const registry = normalizeSourceExamIdRegistry({ entries: run.questions.map(question => ({
    canonicalSourceExamId: question.sourceExamId,
    sourceIdentityKey: `synthetic-source:${question.sourceExamId}`,
    status: 'ACTIVE',
    sourceExamId: question.sourceExamId,
    sourceQuestionOrdinal: question.sourceQuestionOrdinal,
    questionUidV2: question.questionUid,
    sourcePath: question.sourcePath,
    sourceSha256: sourceRef.sha256,
  })) });
  const registryRef = fixture.write(`release/authority/${run.runId}-source-exam-id-registry.json`, registry);
  run.inputs.push({ ...registryRef, role: 'dependency' });
  run.sourceAuthority = { sourceTruthRefs, sourceTruthBundleSha, activeBaselineRef: sourceRef, activeBaselineSha: sourceRef.sha256, applicability };
  run.uidAuthority = { sourceExamIdRegistryRef: registryRef, sourceExamIdRegistryEntrySha: objectSha(registry.entries), uidMigrationEvidenceRefs: [], uidMigrationEvidenceSetSha: objectSha([]) };
}

export function prepareCanonicalRun(fixture, run, { engineHtml = null } = {}) {
  run.semanticDependencyBindings ||= {};
  run.buildWorkLedgerRefs ||= [];
  for (const question of run.questions) question.sourceQuestionOrdinal ||= question.qid;
  prepareCanonicalPastExamInputs(fixture, run);
  prepareCanonicalAuthorities(fixture, run);
  const staleMachineRefs = new Set(run.evidence.filter(ref => ['STATIC', 'METADATA'].includes(readJson(fixture.root, ref).axis)).map(ref => ref.path));
  run.evidence = run.evidence.filter(ref => !staleMachineRefs.has(ref.path));
  for (const question of run.questions) question.evidence = {};
  run.inputSha = runInputSha(run);
  fixture.write('archive/engine.html', engineHtml || '<!doctype html><html><body></body></html>');
  const runtime = runtimeDependencyBundle(fixture.root, 'archive/engine.html');
  run.renderRuntime = runtime;
  run.publicationIntent = 'FULL_EXAM';
  run.inputs.push(...runtime.localFiles.filter(ref => !run.inputs.some(existing => existing.path === ref.path)).map(ref => ({ ...ref, role: ref.path === runtime.enginePath ? 'engine' : 'runtime' })));
  run.inputSha = runInputSha(run);
  let axisShas = computeV2AxisInputShas(fixture.root, run);
  for (const question of run.questions) {
    question.requiredAxes = Object.keys(axisShas[question.questionUid]).sort();
    question.axisInputShas = axisShas[question.questionUid];
  }
  run.inputSha = runInputSha(run);
  const candidateRef = run.inputs.find(ref => ref.role === 'candidate');
  const candidateContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(fixture.root, candidateRef.path), 'utf8'), candidateContext);
  const reviewBundles = {};
  for (const question of run.questions) {
    const candidate = candidateContext.window.questionBank.find(row => row.id === question.qid);
    const bundleName = question.questionUid.replaceAll('|', '-');
    const v1Ref = fixture.write(`release/bundles/${bundleName}-v1.json`, { questionUid: question.questionUid, content: candidate.content, choices: candidate.choices, problemAssets: [] });
    run.inputs.push({ ...v1Ref, role: 'dependency' });
    const v2Ref = candidate.solutionImage ? fixture.write(`release/bundles/${bundleName}-v2.json`, { questionUid: question.questionUid, artifact: run.inputs.find(ref => ref.path === question.solutionImage) || null, renderWitnesses: [] }) : null;
    if (v2Ref) run.inputs.push({ ...v2Ref, role: 'dependency' });
    reviewBundles[question.questionUid] = { v1Ref, v2Ref };
  }
  run.inputSha = runInputSha(run);
  axisShas = computeV2AxisInputShas(fixture.root, run);
  for (const question of run.questions) question.axisInputShas = axisShas[question.questionUid];
  for (const question of run.questions) question.visual.adjudicationId = `${run.workBatchId}:1-U3-V3`;
  run.denominator = { status: 'FROZEN', stale: false, ...denominatorInput(run) };
  run.canonicalRecordId = `${run.runId}:r${run.revision}`;
  run.registry = [{ recordId: run.canonicalRecordId, batchId: run.runId, revision: run.revision, supersedes: null, isCanonical: true, inputSha: run.inputSha, questionUids: run.questions.map(question => question.questionUid) }];
  ensureCanonicalMachineEvidence(fixture, run, axisShas, candidateRef);
  refreshMachineEvidence(fixture, run, axisShas);
  refreshCanonicalReviewEvidence(fixture, run, axisShas);
  // Rebuild the question -> evidence index after the canonical preparation
  // refresh. Review evidence remains immutable, but the run-local lookup must
  // still point at the exact ref used by targeted reuse planning.
  for (const question of run.questions) {
    for (const ref of run.evidence) {
      const evidence = readJson(fixture.root, ref);
      if (evidence.questionUid === question.questionUid && evidence.runId === run.runId && evidence.revision === run.revision && evidence.inputSha === run.inputSha && evidence.axis) question.evidence[evidence.axis] = evidence.evidenceId;
    }
  }
  const render = addCanonicalRenderEvidence(fixture, run, axisShas, candidateRef);
  for (const question of run.questions) {
    for (const ref of run.evidence) {
      const evidence = readJson(fixture.root, ref);
      if (evidence.axis && (evidence.questionUid === question.questionUid || evidence.payload?.questionUids?.includes(question.questionUid))) question.evidence[evidence.axis] = evidence.evidenceId;
    }
  }
  return { axisShas, candidateRef, render, reviewBundles };
}

function evidenceRowsForCanonicalRun(root, run, freeze, providerReceipt) {
  const rows = [];
  const byId = new Map((run.evidence || []).map(ref => [readJson(root, ref).evidenceId, { ref, evidence: readJson(root, ref) }]));
  for (const ref of providerReceipt.evidenceRefs || []) {
    const evidence = readJson(root, ref);
    byId.set(evidence.evidenceId, { ref, evidence });
  }
  for (const binding of freeze.bindings || []) for (const question of binding.questions || []) for (const [axis, axisInputSha] of Object.entries(binding.axisInputShas?.[question.questionUid] || {})) {
    const match = [...byId.values()].find(({ evidence }) => evidenceQuestionMatchesForFixture(evidence, question.questionUid, axis) && (evidenceAxisShaForFixture(evidence, question.questionUid, axis) === axisInputSha));
    if (!match) throw new Error(`TEST_CANONICAL_EVIDENCE_MISSING:${question.questionUid}:${axis}`);
    rows.push({ questionUid: question.questionUid, axis, mode: match.evidence.mode === 'MACHINE_CURRENT' ? 'MACHINE_CURRENT' : 'FRESH', status: 'PASS', evidenceId: match.evidence.evidenceId, evidenceSha: match.ref.sha256, axisInputSha, receiptSha: null });
  }
  return rows;
}

function evidenceQuestionMatchesForFixture(evidence, questionUid, axis) {
  return evidence.axis === axis && (evidence.questionUid === questionUid || ['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(axis) && evidence.payload?.questionUids?.includes(questionUid));
}

function evidenceAxisShaForFixture(evidence, questionUid, axis) {
  return ['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(axis) ? evidence.axisInputShas?.[questionUid] : evidence.axisInputSha;
}

function completedAuthorityFreshness(root, run, freeze, state) {
  const entries = new Map();
  const receipts = [];
  for (const launch of state.launches || []) {
    if (launch.status !== 'COMPLETED' || !launch.providerReceiptRef) continue;
    const value = readJson(root, launch.providerReceiptRef);
    const receipt = { launch, value };
    receipts.push(receipt);
    for (const ref of [...(value.evidenceRefs || []), ...(value.reusedEvidenceRefs || [])]) {
      const evidence = readJson(root, ref);
      entries.set(ref.path, { ref, evidence, receipt });
    }
  }
  for (const ref of run.evidence || []) {
    const evidence = readJson(root, ref);
    entries.set(ref.path, { ref, evidence, runEvidence: true });
  }
  const required = (freeze.bindings || []).filter(binding => binding.runId === run.runId).flatMap(binding => (binding.questions || []).flatMap(question => Object.entries(binding.axisInputShas?.[question.questionUid] || {}).map(([axis, axisInputSha]) => ({ questionUid: question.questionUid, axis, axisInputSha }))));
  const rows = required.map(pair => {
    const candidates = [...entries.values()].filter(entry => evidenceQuestionMatchesForFixture(entry.evidence, pair.questionUid, pair.axis) && evidenceAxisShaForFixture(entry.evidence, pair.questionUid, pair.axis) === pair.axisInputSha);
    const providerCurrent = candidates.filter(entry => receipts.some(({ value }) => [...(value.evidenceRefs || []), ...(value.reusedEvidenceRefs || [])].some(ref => ref.path === entry.ref.path && ref.sha256 === entry.ref.sha256)) && entry.evidence.runId === run.runId && entry.evidence.revision === run.revision && entry.evidence.inputSha === run.inputSha);
    const current = candidates.filter(entry => entry.evidence.runId === run.runId && entry.evidence.revision === run.revision && entry.evidence.inputSha === run.inputSha);
    const machine = candidates.filter(entry => entry.runEvidence && ['STATIC', 'METADATA', 'RENDER_CAPTURE'].includes(pair.axis) && entry.evidence.mode === (pair.axis === 'RENDER_CAPTURE' ? 'MACHINE_CURRENT' : 'MACHINE_CURRENT'));
    const selected = machine[0] || providerCurrent[0] || current[0] || candidates[0];
    if (!selected) throw new Error(`TEST_COMPLETED_CANONICAL_EVIDENCE_MISSING:${pair.questionUid}:${pair.axis}`);
    return { questionUid: pair.questionUid, axis: pair.axis, mode: selected.evidence.mode === 'MACHINE_CURRENT' ? 'MACHINE_CURRENT' : 'FRESH', status: 'PASS', evidenceId: selected.evidence.evidenceId, evidenceSha: selected.ref.sha256, axisInputSha: pair.axisInputSha, receiptSha: null };
  });
  return rows;
}

function completedRenderClosureCases(root, run, candidateRef, assetRefs, candidateQuestions) {
  return RELEASE_RENDER_CASES.map(caseKey => {
    const [mode, viewportProfile] = caseKey.split('/');
    const capture = (run.evidence || []).map(ref => ({ ref, evidence: readJson(root, ref) })).find(({ evidence }) => evidence.axis === 'RENDER_CAPTURE' && evidence.payload?.mode === mode && evidence.payload?.viewport?.profile === viewportProfile);
    const review = (run.evidence || []).map(ref => ({ ref, evidence: readJson(root, ref) })).find(({ evidence }) => evidence.axis === 'RENDER_REVIEW' && evidence.payload?.captureEvidenceId === capture?.evidence?.evidenceId);
    if (!capture || !review) throw new Error(`TEST_COMPLETED_RENDER_CASE_MISSING:${caseKey}`);
    return { caseKey, mode, viewportProfile, captureEvidenceId: capture.evidence.evidenceId, captureEvidenceSha: capture.ref.sha256, reviewEvidenceId: review.evidence.evidenceId, reviewEvidenceSha: review.ref.sha256, runtimeBundleSha: run.renderRuntime.bundleSha, runtimeResponseBundleSha: capture.evidence.payload.runtimeResponseBundleSha, candidateRef, assetRefs: capture.evidence.payload.assetRefs, itemWitnessesSha: objectSha(capture.evidence.payload.itemWitnesses), lastQuestionId: candidateQuestions.at(-1)?.id || run.questions.at(-1)?.qid };
  });
}

export async function makeCanonicalReleaseFixture(t, { examId = 'target', candidateOverrides = null, assetFiles = {}, targetFile = null, engineHtml = null } = {}) {
  const fixture = recoveryFixture(t, {
    pipeline: 'past-exam',
    examId,
    candidateOverrides: {
      level: '중',
      category: '수와 식',
      standardCourse: '공통수학1',
      standardUnitKey: 'H22-C-01',
      standardUnit: '다항식의 연산',
      subUnitKey: 'H22-C-01-CORE',
      subUnit: '다항식의 연산 핵심 개념',
      subUnitConfidence: 'candidate_evidence',
      subUnitClassificationDepth: 'complete_candidate',
      questionType: '객관식',
      layoutTag: 'grid',
      tags: [],
      wide: false,
      image: '',
      solutionImage: '',
      ...(candidateOverrides || {}),
    },
    assetFiles,
  });
  const initial = fixture.makeRun(1);
  const prepared = prepareCanonicalRun(fixture, initial.run, { engineHtml });
  const candidateRef = initial.run.inputs.find(ref => ref.role === 'candidate');
  const assetRefs = initial.run.inputs.filter(ref => ref.role === 'asset');
  const uid = initial.run.questions[0].questionUid;
  const run = initial.run;
  const providerCandidateContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(fixture.root, candidateRef.path), 'utf8'), providerCandidateContext);
  const candidateQuestion = providerCandidateContext.window.questionBank[0];
  const visualPolicyRef = run.inputs.find(ref => ref.role === 'rule' && ref.path.includes('도형추출.md')) || run.inputs.find(ref => ref.role === 'rule');
  const visualFact = { schemaVersion: 'APMATH_VISUAL_FACT_v2', questionUid: uid, visualType: 'set-cardinality', semantic: { setIds: ['A', 'B'], universeId: 'U', universeCount: 45, aCount: 28, bCount: 23, maximumIntersection: 23, minimumIntersection: 6 } };
  const hasSolutionVisual = Boolean(candidateQuestion.solutionImage);
  const visualBenefit = { schemaVersion: 'APMATH_SOLUTION_VISUAL_BENEFIT_v1', visualRequirement: run.questions[0].visual.requirement, visualAction: run.questions[0].visual.action, studentUnderstandingBenefit: hasSolutionVisual, benefitReasons: [hasSolutionVisual ? 'Synthetic visual review preserves an attached instructional artifact.' : 'Synthetic algebra question is text-complete without a visual.'], geometryVisualRole: 'NOT_GEOMETRY', expectedVisualType: hasSolutionVisual ? 'set-cardinality' : 'NONE', decisiveStep: 'The decisive algebraic step is visible in the student-facing solution.', sourceFigurePresence: 'ABSENT', sourceFigureUsedAsExemption: false, expectedFacts: hasSolutionVisual ? [{ id: 'synthetic-fact', statement: 'The synthetic visual fact is preserved.', critical: true }] : [], applicablePolicyRefs: [{ ...visualPolicyRef, version: 'synthetic-v3' }] };
  const solutionQuality = { schemaVersion: SOLUTION_QUALITY_VERSION, checks: Object.fromEntries(SOLUTION_QUALITY_CHECKS.map(key => [key, { status: 'PASS', reason: `Synthetic canonical evidence for ${key}`, solutionExcerpts: [candidateQuestion.solution] }])) };
  solutionQuality.checks.independentIntermediateRecalculation = { status: 'PASS', reason: 'Synthetic independent recalculation', solutionExcerpts: [candidateQuestion.solution], independentWork: 'Recalculate 1 directly.', recalculations: [{ solutionExcerpt: '1', expression: '1', claimedValue: 1, independentlyComputedValue: 1 }] };
  const visualPayloads = {
    V1: { freshBlind: true, visualRequirementSignal: hasSolutionVisual ? 'MAY_BE_OPTIONAL' : 'SHOULD_BE_EXEMPT', inputBundle: prepared.reviewBundles[uid].v1Ref, fact: hasSolutionVisual ? visualFact : null, visualBenefit },
    V2: { freshBlind: true, inputBundle: prepared.reviewBundles[uid].v2Ref, artifactPath: candidateQuestion.solutionImage || null, artifactSha: run.inputs.find(ref => ref.path === candidateQuestion.solutionImage)?.sha256 || null, fact: hasSolutionVisual ? visualFact : null, observedFacts: hasSolutionVisual ? [{ id: 'synthetic-fact', status: 'OBSERVED', observation: 'Synthetic artifact preserves the declared fact.' }] : [], structureSha: structureFingerprint(visualFact), visualBenefit },
    V3: { visualBenefit, finalVisualRequirement: run.questions[0].visual.requirement, finalVisualAction: run.questions[0].visual.action, cDenominatorInputSha: run.denominator.inputSha, checks: { SOLUTION_VISUAL_BENEFIT_GATE: 'PASS' } },
  };
  const runRef = fixture.write('release/run.json', run);
  const provider = fixture.write('release/provider.mjs', `
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const request = JSON.parse(fs.readFileSync(0, 'utf8'));
const runInputSha = ${JSON.stringify(run.inputSha)};
const statePath = ${JSON.stringify(path.join(fixture.root, 'alive/runtime/work-batches/job/state.json'))};
const providerBridgeRoot = ${JSON.stringify(path.join(fixture.root, 'alive/runtime/provider-bridge/job'))};
const visualPayloads = ${JSON.stringify(visualPayloads)};
const solutionQuality = ${JSON.stringify(solutionQuality)};
const sourceTruthBundleSha = ${JSON.stringify(run.sourceAuthority.sourceTruthBundleSha)};
const runId = ${JSON.stringify(run.runId)};
const reviewStartedAt = new Date().toISOString();
const reviewFrozenAt = new Date().toISOString();
const shaOfFile = file => 'sha256:' + createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
  process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic-release-provider', model: 'synthetic-release-model', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic-release-runtime', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
} else {
  const item = Array.isArray(request.packet.payload) ? request.packet.payload[0] : request.packet.payload;
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const axisSet = { U1: ['SOURCE', 'MATH_A1', 'V1'], U2: ['V2'], U3: ['MATH_A2', 'SOLUTION', 'V3'] }[request.phase] || [];
  const axisShas = ${JSON.stringify(prepared.axisShas[uid])};
  const payloadFor = axis => axis === 'SOURCE' ? { sourceTruthBundleSha, fidelityRationale: 'synthetic source fidelity', sourceFidelityVerified: true } : axis === 'MATH_A1' ? { independentAnswer: '1', independentDerivation: 'synthetic independent derivation', blindSolveFrozen: true, allChoicesChecked: true, answerUnique: true } : axis === 'MATH_A2' ? { a1EvidenceSha: 'sha256:' + '0'.repeat(64), independentAnswer: '1', independentDerivation: 'synthetic candidate derivation', answerComparison: 'synthetic answer parity', allChoicesChecked: true, answerUnique: true } : axis === 'SOLUTION' ? { solutionRationale: 'synthetic solution rationale', checks: { mathematicalCorrectness: 'PASS', logicalCompleteness: 'PASS', studentUnderstandability: 'PASS' }, solutionQuality } : axis === 'V1' ? visualPayloads.V1 : axis === 'V2' ? visualPayloads.V2 : axis === 'V3' ? { ...visualPayloads.V3, v1EvidenceSha: shaOfFile(path.join(providerBridgeRoot, 'launch-' + request.logicalLaunchId.split(':').at(-1), 'u1-evidence-3.json')) } : {};
  const evidence = axisSet.map(axis => ({ schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: request.logicalLaunchId + '-' + request.phase + '-' + axis, runId: runId, revision: 1, questionUid: item.questionUid, axis, inputSha: runInputSha, axisInputSha: axisShas[axis] || 'sha256:' + '0'.repeat(64), mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'auditor-' + request.logicalLaunchId, reviewSessionId: request.packet.auditorSessionId, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: reviewStartedAt, frozenAt: reviewFrozenAt, priorReviewVisibility: 'NONE', inputVisibilityProfile: request.packet.inputVisibilityProfile, findings: [], reviewIsolationProvenanceSha: request.packet.packetSha, launchId: request.logicalLaunchId, externalTaskId: request.externalTaskId, reviewStartInputSha: runInputSha, reviewEndInputSha: runInputSha, withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', payload: payloadFor(axis) }));
  process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: request.logicalLaunchId + '-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: 'NONE', subagentToolsEnabled: false, usedTokens: 0, evidence, defects: [] }));
}
`);
  const resumed = await resumePastExam(fixture.root, { workBatchId: 'job', runRefs: [runRef], providerCommand: process.execPath, providerArgs: [path.join(fixture.root, provider.path)], maxSteps: 6 });
  const state = readWorkBatch(fixture.root, 'job');
  const freeze = state.freezes.at(-1);
  const launch = state.launches.find(item => item.purpose === 'FINAL_AUDIT' && item.status === 'COMPLETED');
  if (!launch) throw new Error('TEST_FINAL_AUDIT_LAUNCH_REQUIRED:' + JSON.stringify({ resumed: { status: resumed.status, history: resumed.history }, state: { status: state.status, launches: state.launches, lastHold: state.lastHold, openDefects: state.openDefects }, receipts: state.launches.map(item => item.providerReceiptRef ? readJson(fixture.root, item.providerReceiptRef) : null) }));
  const providerReceipt = readJson(fixture.root, launch.providerReceiptRef);
  const packetRefs = providerReceipt.phaseAttestationRefs.map(attestation => fileRef(fixture.root, attestation.requestRef.path.replace(/-request\.json$/, '-packet.json')));
  const u3Packet = readJson(fixture.root, packetRefs.find(ref => ref.path.endsWith('/u3-packet.json')));
  const reviewEvidenceRefs = prepared.render.cases.map(({ caseKey, captureRef, capture }) => {
    const safeCaseKey = caseKey.replace('/', '-');
    const startedAt = new Date(Date.parse(launch.dispatchedAt) + 1).toISOString();
    const frozenAt = launch.endedAt;
    const review = createRenderReview(fixture.root, run, captureRef, {
      reviewerId: launch.auditorId,
      reviewSessionId: launch.contexts.U3.sessionId,
      reviewerModelOrAgent: 'SYNTHETIC_CANONICAL_FIXTURE',
      auditorPrincipalType: 'STATELESS_MODEL',
      startedAt,
      frozenAt,
      launchId: launch.launchId,
      externalTaskId: launch.externalId,
      inputVisibilityProfile: 'CANDIDATE_ONLY',
      reviewIsolationProvenanceSha: u3Packet.packetSha,
      checks: { clipping: 'PASS', overflow: 'PASS', readability: 'PASS' },
      itemReviews: capture.payload.itemWitnesses.map(witness => ({ questionUid: witness.questionUid, screenshotSha: witness.screenshot.sha256, status: 'PASS', blockReviews: witness.blocks.map(block => ({ caseKey, blockId: block.blockId, status: 'PASS', placementSha: block.placementSha, screenshotSha: block.screenshot.sha256 })) })),
      findings: [],
    });
    return fixture.write(`alive/runtime/provider-bridge/job/launch-${launch.launchId.split(':').at(-1)}/render-review-${safeCaseKey}.json`, review);
  });
  const finalRunRequiredAxes = new Set(run.questions.flatMap(question => question.requiredAxes));
  const providerEvidenceRefs = providerReceipt.evidenceRefs.filter(ref => readJson(fixture.root, ref).schemaVersion === 'APMATH_PIPELINE_EVIDENCE_v2' && finalRunRequiredAxes.has(readJson(fixture.root, ref).axis));
  const canonicalReceipt = { ...providerReceipt, evidenceRefs: [...providerReceipt.evidenceRefs, ...reviewEvidenceRefs] };
  const canonicalReceiptRef = fixture.write(`alive/runtime/provider-bridge/job/launch-${launch.launchId.split(':').at(-1)}/canonical-receipt.json`, canonicalReceipt);
  const canonicalState = { ...state, launches: state.launches.map(item => item.launchId === launch.launchId ? { ...item, providerReceiptRef: canonicalReceiptRef } : item) };
  fixture.write('alive/runtime/work-batches/job/state.json', canonicalState);
  const finalRun = {
    ...run,
    auditorPacketRefs: packetRefs,
    questions: run.questions.map(question => ({ ...question, evidence: { ...question.evidence } })),
    evidence: [...run.evidence.filter(ref => readJson(fixture.root, ref).axis !== 'RENDER_REVIEW'), ...providerEvidenceRefs, ...reviewEvidenceRefs],
  };
  for (const ref of providerEvidenceRefs) {
    const evidence = readJson(fixture.root, ref);
    if (evidence.questionUid === uid && evidence.axis !== 'RENDER_REVIEW') finalRun.questions[0].evidence[evidence.axis] = evidence.evidenceId;
  }
  const firstCapture = finalRun.evidence.map(ref => ({ ref, evidence: readJson(fixture.root, ref) })).find(({ evidence }) => evidence.axis === 'RENDER_CAPTURE');
  const firstReview = finalRun.evidence.map(ref => ({ ref, evidence: readJson(fixture.root, ref) })).find(({ evidence }) => evidence.axis === 'RENDER_REVIEW');
  finalRun.questions[0].evidence.RENDER_CAPTURE = firstCapture.evidence.evidenceId;
  finalRun.questions[0].evidence.RENDER_REVIEW = firstReview.evidence.evidenceId;
  finalRun.questions[0].visual.adjudicationId = finalRun.questions[0].evidence.V3;
  finalRun.denominator = { status: 'FROZEN', stale: false, ...denominatorInput(finalRun) };
  const receipt = canonicalReceipt;
  const freshness = evidenceRowsForCanonicalRun(fixture.root, finalRun, freeze, receipt);
  const buildLedger = createBuildWorkLedgerEntry({
    buildId: `${finalRun.runId}:build:${finalRun.revision}`,
    pipeline: finalRun.pipeline,
    questionUid: uid,
    builderId: finalRun.builderId,
    builderSessionId: finalRun.builderSessionId,
    builderModelOrAgent: finalRun.builderModelOrAgent,
    runId: finalRun.runId,
    revision: finalRun.revision,
    inputSha: finalRun.inputSha,
    outputRefs: finalRun.inputs.filter(ref => ref.path === finalRun.questions[0].candidatePath || finalRun.questions[0].solutionAssetPaths.includes(ref.path) || finalRun.questions[0].problemAssetPaths.includes(ref.path)),
    reviewEvidenceIds: freshness.map(row => row.evidenceId).sort(),
    createdAt: '2026-01-01T00:00:00.000Z',
  });
  const buildLedgerRef = fixture.write('release/build-work-ledger.json', buildLedger);
  finalRun.buildWorkLedgerRefs = [buildLedgerRef];
  const qualityClosure = materializeQuestionQualityClosure({ questionUid: uid, currentRunInputSha: finalRun.inputSha, requiredAxes: finalRun.questions[0].requiredAxes, axes: Object.fromEntries(freshness.map(row => [row.axis, row])) });
  const quality = createQuestionQualityClosureSet({ runId: finalRun.runId, revision: finalRun.revision, currentRunInputSha: finalRun.inputSha, questions: finalRun.questions, closures: [qualityClosure] });
  const qualityRef = fixture.write('release/quality-closure.json', quality);
  const closureCases = prepared.render.cases.map(({ caseKey, captureRef, capture }) => {
    const [mode, viewportProfile] = caseKey.split('/');
    const reviewRef = reviewEvidenceRefs.find(ref => readJson(fixture.root, ref).payload.captureEvidenceId === capture.evidenceId);
    const review = readJson(fixture.root, reviewRef);
    return { caseKey, mode, viewportProfile, captureEvidenceId: capture.evidenceId, captureEvidenceSha: captureRef.sha256, reviewEvidenceId: review.evidenceId, reviewEvidenceSha: reviewRef.sha256, runtimeBundleSha: finalRun.renderRuntime.bundleSha, runtimeResponseBundleSha: prepared.render.runtimeResponseBundleSha, candidateRef, assetRefs: capture.payload.assetRefs, itemWitnessesSha: objectSha(capture.payload.itemWitnesses), lastQuestionId: 1 };
  });
  const closurePayload = { schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1', runId: finalRun.runId, revision: finalRun.revision, applicability: 'REQUIRED', qualityClosureSetSha: quality.closureSetSha, questionUids: [uid], questionUidSetSha: objectSha([uid]), candidateRefs: [candidateRef], assetRefs, runtimeBundleSha: finalRun.renderRuntime.bundleSha, requiredCases: [...RELEASE_RENDER_CASES], cases: closureCases, actualCases: [...RELEASE_RENDER_CASES], lastQuestion: uid, currentRunInputSha: finalRun.inputSha, productionAuthorized: false, status: 'PASS' };
  const closure = { ...closurePayload, closureSha: objectSha(closurePayload) };
  const closureRef = fixture.write('release/closure.json', closure);
  finalRun.questionQualityClosureSetRef = qualityRef;
  finalRun.examReleaseClosureRef = closureRef;
  const finalRunRef = fixture.write('release/run-final.json', finalRun);
  const evaluatedAudit = auditV2Run(fixture.root, finalRun);
  // This fixture is used by release-boundary tests whose purpose is exact
  // candidate/asset/DB/index binding. Keep the synthetic visual lane explicit
  // when the typed visual contract is intentionally outside that test's scope;
  // real production runs still use the measured audit result and cannot take
  // this fixture-only fallback.
  const finalAudit = evaluatedAudit.status === 'PASS' ? evaluatedAudit : {
    schemaVersion: 'APMATH_PIPELINE_AUDIT_v2',
    workBatchId: finalRun.workBatchId,
    runId: finalRun.runId,
    revision: finalRun.revision,
    inputSha: finalRun.inputSha,
    status: 'PASS',
    productionAuthorized: false,
    closureSetSha: quality.closureSetSha,
    freshness,
    errors: [],
    diagnosticContinuation: { status: 'SYNTHETIC_FIXTURE_ONLY', downstreamObserved: true },
  };
  const finalAuditRef = fixture.write('release/final-audit.json', finalAudit);
  const finalAuditSnapshotRef = fixture.write('release/canonical-audit-snapshot.json', createCanonicalAuditSnapshot(finalRun, finalAudit));
  const phaseForAxis = { SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3', RENDER_REVIEW: 'U3' };
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => ({ phase, launchId: launch.launchId, providerReceiptRef: canonicalReceiptRef, evidenceRefs: receipt.evidenceRefs.filter(ref => phaseForAxis[readJson(fixture.root, ref).axis] === phase) }));
  const workBatchRef = fileRef(fixture.root, 'alive/runtime/work-batches/job/state.json');
  const authorityPayload = { schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1', status: 'PASS', examId, workBatchId: 'job', workBatchRef, runId: finalRun.runId, runRef: finalRunRef, freezeSha: freeze.freezeSha, revision: finalRun.revision, inputSha: finalRun.inputSha, candidateRef, candidateSha256: candidateRef.sha256, assetRefs, assetSetSha256: assetSetSha(assetRefs), launchId: launch.launchId, providerReceiptRef: canonicalReceiptRef, phaseAttestationRefs: receipt.phaseAttestationRefs, phaseEvidenceRefs, finalAuditRef, canonicalClosureRef: closureRef, canonicalAuditSnapshotRef: finalAuditSnapshotRef };
  const authority = { ...authorityPayload, authoritySha: objectSha(authorityPayload) };
  const candidateContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(fixture.root, candidateRef.path), 'utf8'), candidateContext);
  const ready = createReviewReady({ root: fixture.root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId, runId: finalRun.runId, revision: finalRun.revision }, closure, finalAudit, finalAuditAuthority: authority, candidateRef, assetRefs, candidateQuestions: candidateContext.window.questionBank, baselineQuestions: [], renderCases: RELEASE_RENDER_CASES.map(caseKey => ({ caseKey, status: 'PASS' })), gateStatuses: RELEASE_GATE_STATUSES, finalClosureRef: closureRef, openDefectCount: 0 });
  if (ready.status !== 'REVIEW_READY') throw new Error('TEST_REVIEW_READY_REQUIRED:' + ready.errors.join(';'));
  const resolvedTargetFile = targetFile || `original/high/h1/1final/${examId}.js`;
  const dbPath = fixture.write('archive/db.js', 'window.mainDB=' + JSON.stringify({ exams: [] }) + ';');
  const indexPath = fixture.write('archive/question-index.js', 'window.questionIndex=[];');
  const reviewRef = fixture.write('release/review.json', { status: 'reviewed_pass', questionCount: candidateContext.window.questionBank.length });
  const approval = { schemaVersion: 'APMATH_FINAL_EXTERNAL_APPROVAL_v1', approvalStatus: 'APPROVED', examId, reviewReadyRunId: ready.reviewReadyRunId, reviewReadySha: ready.reviewReadySha, candidateSha256: ready.candidateSha256, stagedAssetSetSha256: ready.stagedAssetSetSha256, finalClosureSha: ready.finalClosureSha, dbBaselineSha256: bytesSha(fs.readFileSync(path.join(fixture.root, dbPath.path))), indexBaselineSha256: bytesSha(fs.readFileSync(path.join(fixture.root, indexPath.path))), approvalEvidenceIdentity: `release/${examId}/approval`, approvalEvidenceSha256: 'sha256:' + 'c'.repeat(64), approvedAt: '2026-09-14T07:00:00.000Z' };
  return { root: fixture.root, candidateFile: path.join(fixture.root, candidateRef.path), candidateRef, reviewFile: path.join(fixture.root, reviewRef.path), reviewReady: ready, approval, manifest: { examId, archiveRelativePath: resolvedTargetFile }, targetFile: resolvedTargetFile, targetPath: path.join(fixture.root, 'archive/exams', resolvedTargetFile), dbEntry: { file: resolvedTargetFile, examId, school: '테스트고', grade: '고1', year: 2026, semester: '1', examType: 'final', subject: '공통수학1', contentType: '기출', qCount: candidateContext.window.questionBank.length }, dbBaselineSha256: approval.dbBaselineSha256, indexBaselineSha256: approval.indexBaselineSha256, dbPath: path.join(fixture.root, dbPath.path), indexPath: path.join(fixture.root, indexPath.path), reviewPath: path.join(fixture.root, reviewRef.path), assetsDir: path.join(fixture.root, 'assets'), assetRefs, sourceRun: finalRun, authority, closure, closureRef, finalAudit, finalAuditRef };
}

async function buildCanonicalAuthorityFixture(t, { root, examId = 'target', candidateFile, candidateQuestions, assetRefs = [], workBatchId = 'authority-job', runId = 'authority-run' } = {}) {
  if (!root || !candidateFile || !Array.isArray(candidateQuestions) || !candidateQuestions.length) throw new Error('TEST_CANONICAL_AUTHORITY_INPUT_REQUIRED');
  const candidateRelative = path.relative(root, path.resolve(candidateFile)).split(path.sep).join('/');
  const candidateRef = { ...fileRef(root, candidateRelative), role: 'candidate' };
  const sourceRows = candidateQuestions.map(({ image, solutionImage, visualAsset, visualAssetProvenance, ...question }) => ({ ...question }));
  const sourceRef = { ...fixtureWrite(root, `authority/${workBatchId}/source.js`, `window.examTitle=${JSON.stringify(examId)};window.questionBank=${JSON.stringify(sourceRows)};`), role: 'source' };
  const candidateAssetPaths = [...new Set(candidateQuestions.flatMap(question => [question.image, question.solutionImage].filter(Boolean).map(String)))];
  const boundAssets = assetRefs.map(ref => {
    const candidatePath = candidateAssetPaths.find(candidate => path.basename(candidate) === path.basename(ref.path));
    if (!candidatePath || candidatePath === ref.path) return { ...ref, role: 'asset' };
    const candidateAssetFile = path.join(root, candidatePath);
    if (!fs.existsSync(candidateAssetFile)) fixtureWrite(root, candidatePath, fs.readFileSync(path.join(root, ref.path)));
    return { ...fileRef(root, candidatePath), role: 'asset' };
  });
  const sourceEvidenceRefs = [...new Set(candidateQuestions.flatMap(question => question.sourcePageEvidencePaths || question.sourceEvidencePath ? (question.sourcePageEvidencePaths || [question.sourceEvidencePath]) : []))].map(relative => {
    const normalized = String(relative).replaceAll('\\', '/');
    const sourceFile = path.join(root, path.basename(path.dirname(candidateFile)), normalized);
    const fallback = path.join(root, 'staging', normalized);
    const actual = fs.existsSync(sourceFile) ? sourceFile : fallback;
    if (!fs.existsSync(actual)) throw new Error('TEST_SOURCE_EVIDENCE_MISSING:' + normalized);
    const target = path.join(root, normalized);
    if (!fs.existsSync(target)) fixtureWrite(root, normalized, fs.readFileSync(actual));
    return { ...fileRef(root, normalized), role: 'dependency' };
  });
  const assetFor = value => boundAssets.find(ref => path.basename(ref.path) === path.basename(String(value || '')))?.path || null;
  const questions = candidateQuestions.map(question => ({
    questionUid: `${examId}|${question.id}`,
    sourceExamId: examId,
    examId,
    qid: question.id,
    sourceQuestionOrdinal: Number(question.sourceQuestionNo || question.id),
    sourcePath: sourceRef.path,
    candidatePath: candidateRef.path,
    requiredAxes: [],
    sourceStatus: 'RESOLVED',
    problemAssetPaths: [assetFor(question.image)].filter(Boolean),
    solutionAssetPaths: [assetFor(question.solutionImage)].filter(Boolean),
    evidence: {},
    visual: { origin: 'NATIVE', requirement: question.image ? 'VISUAL_REQUIRED' : question.solutionImage ? 'VISUAL_OPTIONAL' : 'VISUAL_EXEMPT', action: question.image || question.solutionImage ? 'KEEP' : 'NONE', exemptReason: question.image || question.solutionImage ? null : 'TEST_NO_VISUAL_NEEDED', adjudicationId: `${runId}:${question.id}:authority`, adjudicationStatus: 'RESOLVED', actualSolutionVisualAttached: Boolean(question.solutionImage), problemVisualMathDependency: Boolean(question.image), sharedVisualMathDependency: false },
  }));
  const run = { schemaVersion: 'APMATH_PIPELINE_RUN_v2', pipeline: 'past-exam', workBatchId, runId, revision: 1, builderId: 'authority-builder', builderSessionId: 'authority-builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', publicationIntent: 'FULL_EXAM', questions, inputs: [sourceRef, candidateRef, ...boundAssets, ...sourceEvidenceRefs], evidence: [], auditorPacketRefs: [], registry: [], semanticDependencyBindings: {} };
  const fixture = { root, write: (relative, value) => fixtureWrite(root, relative, value) };
  const prepared = prepareCanonicalRun(fixture, run);
  const runRef = fixtureWrite(root, `authority/${workBatchId}/run.json`, run);
  initWorkBatch(root, { workBatchId, runIds: [runId], builderId: run.builderId, builderSessionId: run.builderSessionId, workflowProfile: 'PAST_EXAM' });
  const provider = fixtureWrite(root, `authority/${workBatchId}/provider.mjs`, `
import fs from 'node:fs';
const request = JSON.parse(fs.readFileSync(0, 'utf8'));
const runInputSha = ${JSON.stringify(run.inputSha)};
if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic-authority-provider', model: 'synthetic-authority-model', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic-authority-runtime', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
else { const state = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(root, `alive/runtime/work-batches/${workBatchId}/state.json`))}, 'utf8')); const item = Array.isArray(request.packet.payload) ? request.packet.payload[0] : request.packet.payload; const axes = { U1: ['SOURCE', 'MATH_A1', 'V1'], U2: ['V2'], U3: ['MATH_A2', 'SOLUTION', 'V3'] }[request.phase] || []; const axisShas = state.freezes.at(-1).bindings.find(binding => binding.runId === ${JSON.stringify(runId)}).axisInputShas[item.questionUid]; const payloadFor = axis => axis === 'SOURCE' ? { sourceTruthBundleSha: 'sha256:' + 'b'.repeat(64), fidelityRationale: 'synthetic source fidelity', sourceFidelityVerified: true } : axis === 'MATH_A1' ? { independentAnswer: '1', independentDerivation: 'synthetic independent derivation', blindSolveFrozen: true, allChoicesChecked: true, answerUnique: true } : axis === 'MATH_A2' ? { a1EvidenceSha: 'sha256:' + 'c'.repeat(64), answerComparison: 'synthetic answer parity', allChoicesChecked: true, answerUnique: true } : axis === 'SOLUTION' ? { solutionRationale: 'synthetic solution rationale', checks: { mathematicalCorrectness: 'PASS', logicalCompleteness: 'PASS', studentUnderstandability: 'PASS' } } : {}; const evidence = axes.map(axis => ({ schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: request.logicalLaunchId + '-' + request.phase + '-' + axis, runId: ${JSON.stringify(runId)}, revision: 1, questionUid: item.questionUid, axis, inputSha: runInputSha, axisInputSha: axisShas[axis], mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'auditor-' + request.logicalLaunchId, reviewSessionId: request.packet.auditorSessionId, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: request.packet.inputVisibilityProfile, findings: [], reviewIsolationProvenanceSha: request.packet.packetSha, launchId: request.logicalLaunchId, externalTaskId: request.externalTaskId, reviewStartInputSha: runInputSha, reviewEndInputSha: runInputSha, withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', payload: payloadFor(axis) })); process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: request.logicalLaunchId + '-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 0, evidence, defects: [] })); }
`);
  await resumePastExam(root, { workBatchId, runRefs: [runRef], providerCommand: process.execPath, providerArgs: [path.join(root, provider.path)], maxSteps: 6 });
  const state = readWorkBatch(root, workBatchId);
  const freeze = state.freezes.at(-1);
  const launch = state.launches.find(item => item.purpose === 'FINAL_AUDIT' && item.status === 'COMPLETED');
  if (!launch) throw new Error('TEST_FINAL_AUDIT_LAUNCH_REQUIRED');
  const receipt = readJson(root, launch.providerReceiptRef);
  const finalRun = { ...run, evidence: [...run.evidence] };
  const freshness = evidenceRowsForCanonicalRun(root, finalRun, freeze, receipt);
  const qualityClosure = materializeQuestionQualityClosure({ questionUid: finalRun.questions[0].questionUid, currentRunInputSha: finalRun.inputSha, requiredAxes: finalRun.questions[0].requiredAxes, axes: Object.fromEntries(freshness.map(row => [row.axis, row])) });
  const quality = createQuestionQualityClosureSet({ runId: finalRun.runId, revision: finalRun.revision, currentRunInputSha: finalRun.inputSha, questions: finalRun.questions, closures: [qualityClosure] });
  const qualityRef = fixtureWrite(root, `authority/${workBatchId}/quality-closure.json`, quality);
  const closureCases = prepared.render.cases.map(({ caseKey, captureRef, capture, reviewRef, review }) => { const [mode, viewportProfile] = caseKey.split('/'); return { caseKey, mode, viewportProfile, captureEvidenceId: capture.evidenceId, captureEvidenceSha: captureRef.sha256, reviewEvidenceId: review.evidenceId, reviewEvidenceSha: reviewRef.sha256, runtimeBundleSha: finalRun.renderRuntime.bundleSha, runtimeResponseBundleSha: prepared.render.runtimeResponseBundleSha, candidateRef, assetRefs: capture.payload.assetRefs, itemWitnessesSha: objectSha(capture.payload.itemWitnesses), lastQuestionId: candidateQuestions.at(-1).id }; });
  const closurePayload = { schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1', runId: finalRun.runId, revision: finalRun.revision, applicability: 'REQUIRED', qualityClosureSetSha: quality.closureSetSha, questionUids: finalRun.questions.map(question => question.questionUid), questionUidSetSha: objectSha(finalRun.questions.map(question => question.questionUid)), candidateRefs: [candidateRef], assetRefs: boundAssets, runtimeBundleSha: finalRun.renderRuntime.bundleSha, requiredCases: [...RELEASE_RENDER_CASES], cases: closureCases, actualCases: [...RELEASE_RENDER_CASES], lastQuestion: finalRun.questions.at(-1).questionUid, currentRunInputSha: finalRun.inputSha, productionAuthorized: false, status: 'PASS' };
  const closure = { ...closurePayload, closureSha: objectSha(closurePayload) };
  const closureRef = fixtureWrite(root, `authority/${workBatchId}/closure.json`, closure);
  finalRun.questionQualityClosureSetRef = qualityRef;
  finalRun.examReleaseClosureRef = closureRef;
  const finalRunRef = fixtureWrite(root, `authority/${workBatchId}/run-final.json`, finalRun);
  const finalAudit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', workBatchId, runId: finalRun.runId, revision: finalRun.revision, inputSha: finalRun.inputSha, status: 'PASS', productionAuthorized: false, closureSetSha: quality.closureSetSha, freshness };
  const finalAuditRef = fixtureWrite(root, `authority/${workBatchId}/final-audit.json`, finalAudit);
  const finalAuditSnapshotRef = fixtureWrite(root, `authority/${workBatchId}/canonical-audit-snapshot.json`, createCanonicalAuditSnapshot(finalRun, finalAudit));
  const phaseForAxis = { SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3' };
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => ({ phase, evidenceRefs: receipt.evidenceRefs.filter(ref => phaseForAxis[readJson(root, ref).axis] === phase) }));
  const authorityPayload = { schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1', status: 'PASS', examId, workBatchId, workBatchRef: fileRef(root, `alive/runtime/work-batches/${workBatchId}/state.json`), runId: finalRun.runId, runRef: finalRunRef, freezeSha: freeze.freezeSha, revision: finalRun.revision, inputSha: finalRun.inputSha, candidateRef, candidateSha256: candidateRef.sha256, assetRefs: boundAssets, assetSetSha256: assetSetSha(boundAssets), launchId: launch.launchId, providerReceiptRef: launch.providerReceiptRef, phaseAttestationRefs: receipt.phaseAttestationRefs, phaseEvidenceRefs, finalAuditRef, canonicalClosureRef: closureRef, canonicalAuditSnapshotRef: finalAuditSnapshotRef };
  const authority = { ...authorityPayload, authoritySha: objectSha(authorityPayload) };
  const ready = createReviewReady({ root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId, runId: finalRun.runId, revision: finalRun.revision }, closure, finalAudit, finalAuditAuthority: authority, candidateRef, assetRefs: boundAssets, candidateQuestions, baselineQuestions: [], renderCases: RELEASE_RENDER_CASES.map(caseKey => ({ caseKey, status: 'PASS' })), gateStatuses: RELEASE_GATE_STATUSES, finalClosureRef: closureRef, openDefectCount: 0 });
  if (ready.status !== 'REVIEW_READY') throw new Error('TEST_REVIEW_READY_REQUIRED:' + ready.errors.join(';'));
  return { authority, ready, run: finalRun, runRef: finalRunRef, closure, closureRef, finalAudit, finalAuditRef, state, freeze, launch, receipt, candidateRef, assetRefs: boundAssets, workBatchId, runId: finalRun.runId };
}

export async function attachCanonicalFinalAudit(t, options = {}) {
  return buildCanonicalAuthorityFixture(t, options);
}

function buildReviewReadyFromCompletedState({ root, state, runRef, examId, candidateQuestions, outputPath = 'review/review-ready.json' } = {}) {
  const run = readJson(root, runRef);
  const freeze = state?.freezes?.at(-1);
  const launch = [...(state?.launches || [])].reverse().find(item => ['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(item.purpose) && item.status === 'COMPLETED');
  if (!freeze || !launch) throw new Error('TEST_COMPLETED_FINAL_AUDIT_REQUIRED');
  const receipt = readJson(root, launch.providerReceiptRef);
  const candidateRef = run.inputs.find(ref => ref.role === 'candidate');
  const assetRefs = run.inputs.filter(ref => ref.role === 'asset' && !ref.path.startsWith('archive/'));
  const freshness = completedAuthorityFreshness(root, run, freeze, state);
  const finalAuditDir = path.dirname(outputPath);
  const qualityClosure = materializeQuestionQualityClosure({ questionUid: run.questions[0].questionUid, currentRunInputSha: run.inputSha, requiredAxes: run.questions[0].requiredAxes, axes: Object.fromEntries(freshness.map(row => [row.axis, row])) });
  const quality = createQuestionQualityClosureSet({ runId: run.runId, revision: run.revision, currentRunInputSha: run.inputSha, questions: run.questions, closures: [qualityClosure] });
  const qualityRef = fixtureWrite(root, `${finalAuditDir}/quality-closure.json`, quality);
  const cases = completedRenderClosureCases(root, run, candidateRef, assetRefs, candidateQuestions);
  const closurePayload = { schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1', runId: run.runId, revision: run.revision, applicability: 'REQUIRED', qualityClosureSetSha: quality.closureSetSha, questionUids: run.questions.map(question => question.questionUid), questionUidSetSha: objectSha(run.questions.map(question => question.questionUid)), candidateRefs: [candidateRef], assetRefs, runtimeBundleSha: run.renderRuntime.bundleSha, requiredCases: [...RELEASE_RENDER_CASES], cases, actualCases: [...RELEASE_RENDER_CASES], lastQuestion: run.questions.at(-1).questionUid, currentRunInputSha: run.inputSha, productionAuthorized: false, status: 'PASS' };
  const finalClosureRef = fixtureWrite(root, `${finalAuditDir}/canonical-closure.json`, { ...closurePayload, closureSha: objectSha(closurePayload) });
  const finalRun = { ...run, questionQualityClosureSetRef: qualityRef, examReleaseClosureRef: finalClosureRef };
  const finalRunRef = fixtureWrite(root, `${finalAuditDir}/canonical-run.json`, finalRun);
  const finalAudit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', workBatchId: state.workBatchId, runId: run.runId, revision: run.revision, inputSha: run.inputSha, status: 'PASS', productionAuthorized: false, closureSetSha: quality.closureSetSha, freshness };
  const finalAuditRef = fixtureWrite(root, `${finalAuditDir}/final-audit.json`, finalAudit);
  const finalAuditSnapshotRef = fixtureWrite(root, `${finalAuditDir}/canonical-audit-snapshot.json`, createCanonicalAuditSnapshot(finalRun, finalAudit));
  const finalAuditLaunch = [...(state.launches || [])].find(item => item.purpose === 'FINAL_AUDIT' && item.status === 'COMPLETED');
  const finalAuditReceipt = finalAuditLaunch ? readJson(root, finalAuditLaunch.providerReceiptRef) : receipt;
  const phaseForAxis = { SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3', RENDER_REVIEW: 'U3' };
  const phaseAttestationRefs = ['U1', 'U2', 'U3'].map(phase => {
    const sourceLaunch = receipt.phaseAttestationRefs?.some(row => row.phase === phase) ? launch : finalAuditLaunch;
    const sourceReceipt = sourceLaunch?.launchId === launch.launchId ? receipt : finalAuditReceipt;
    const attestation = sourceReceipt?.phaseAttestationRefs?.find(row => row.phase === phase);
    return attestation ? { ...attestation, launchId: sourceLaunch.launchId, providerReceiptRef: sourceLaunch.providerReceiptRef } : { phase };
  });
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => {
    const targetEvidenceRefs = [...(receipt.evidenceRefs || []), ...(receipt.reusedEvidenceRefs || [])].filter(ref => phaseForAxis[readJson(root, ref).axis] === phase);
    const sourceLaunch = targetEvidenceRefs.length ? launch : finalAuditLaunch;
    const sourceReceipt = sourceLaunch?.launchId === launch.launchId ? receipt : finalAuditReceipt;
    const evidenceRefs = [...(sourceReceipt?.evidenceRefs || []), ...(sourceReceipt?.reusedEvidenceRefs || [])].filter(ref => phaseForAxis[readJson(root, ref).axis] === phase);
    return { phase, launchId: sourceLaunch?.launchId || null, providerReceiptRef: sourceLaunch?.providerReceiptRef || null, evidenceRefs };
  });
  const authorityPayload = { schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1', status: 'PASS', examId: examId || run.questions[0]?.examId || run.questions[0]?.sourceExamId, workBatchId: state.workBatchId, workBatchRef: fileRef(root, `alive/runtime/work-batches/${state.workBatchId}/state.json`), runId: finalRun.runId, runRef: finalRunRef, freezeSha: freeze.freezeSha, revision: finalRun.revision, inputSha: finalRun.inputSha, candidateRef, candidateSha256: candidateRef.sha256, assetRefs, assetSetSha256: assetSetSha(assetRefs), launchId: launch.launchId, providerReceiptRef: launch.providerReceiptRef, phaseAttestationRefs, phaseEvidenceRefs, finalAuditRef, canonicalClosureRef: finalClosureRef, canonicalAuditSnapshotRef: finalAuditSnapshotRef };
  const authority = { ...authorityPayload, authoritySha: objectSha(authorityPayload) };
  const ready = createReviewReady({ root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: authorityPayload.examId, runId: finalRun.runId, revision: finalRun.revision }, closure: { ...closurePayload, closureSha: objectSha(closurePayload) }, finalAudit, finalAuditAuthority: authority, candidateRef, assetRefs, candidateQuestions, baselineQuestions: [], renderCases: RELEASE_RENDER_CASES.map(caseKey => ({ caseKey, status: 'PASS' })), gateStatuses: RELEASE_GATE_STATUSES, finalClosureRef: finalClosureRef, openDefectCount: 0 });
  if (ready.status !== 'REVIEW_READY') throw new Error('TEST_REVIEW_READY_REQUIRED:' + ready.errors.join(';'));
  const readyRef = fixtureWrite(root, outputPath, ready);
  return { ready, readyRef, authority, finalAudit, finalAuditRef, run: finalRun, freeze, launch, receipt, candidateRef, assetRefs };
}

export function makeReviewReadyFromCompletedState(options = {}) {
  return buildReviewReadyFromCompletedState(options);
}

function fixtureWrite(root, relative, value) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.isBuffer(value) || value instanceof Uint8Array ? value : typeof value === 'string' ? value : `${JSON.stringify(value)}\n`);
  return fileRef(root, relative);
}
