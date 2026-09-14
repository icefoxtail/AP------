import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileRef, objectSha } from '../canonical.mjs';
import { RUN_VERSION_V2, runInputSha } from '../closure.mjs';
import { computeV2AxisInputShas } from '../v2-audit.mjs';
import { initWorkBatch } from '../work-batch.mjs';
import { visualApplicabilityForQuestion } from '../review-isolation-runner.mjs';

export function recoveryFixture(t, { questionCount = 1, authorityFinalized = true, pipeline = 'tag-enrichment', revisionMutation = 'content', currentPassAxes = [], currentPassAnswers = {}, candidateOverrides = null, assetFiles = {}, examId = 'recovery' } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-recovery-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, value) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value)}\n`);
    return fileRef(root, relative);
  };
  const sourceRows = Array.from({ length: questionCount }, (_, index) => ({ id: index + 1, content: `Find the value for question ${index + 1}.`, choices: ['1', '2'], answer: '1', solution: 'The answer is 1.' }));
  const sourceRef = { ...write('source.js', `window.examTitle=${JSON.stringify(examId)};window.questionBank=${JSON.stringify(sourceRows)};`), role: 'source' };
  initWorkBatch(root, { workBatchId: 'job', runIds: ['run'], builderId: 'builder', builderSessionId: 'builder-session', workflowProfile: 'PAST_EXAM' });
  let serial = 0;
  const makeRun = (revision = 1) => {
    const candidateRows = sourceRows.map((row, index) => {
      const base = revision === 1
        ? { ...row }
        : revisionMutation === 'solution'
          ? { ...row, solution: `${row.solution} Revision ${revision}.` }
          : { ...row, content: `${row.content} Revision ${revision}.` };
      const override = typeof candidateOverrides === 'function' ? candidateOverrides(base, index, revision) : candidateOverrides;
      return { ...base, ...(override || {}) };
    });
    const candidateRef = { ...write(`candidate-${revision}.js`, `window.examTitle=${JSON.stringify(examId)};window.questionBank=${JSON.stringify(candidateRows)};`), role: 'candidate' };
    const assetRefs = Object.entries(assetFiles || {}).map(([relative, value]) => ({ ...write(relative, value), role: 'asset' }));
    const assetPaths = new Set(assetRefs.map(ref => ref.path));
    const questions = sourceRows.map(row => {
      const candidate = candidateRows.find(item => item.id === row.id) || row;
      const requirement = candidate.image ? 'VISUAL_REQUIRED' : candidate.solutionImage ? 'VISUAL_OPTIONAL' : 'VISUAL_EXEMPT';
      return { questionUid: `${examId}|${row.id}`, sourceExamId: examId, examId, qid: row.id, sourcePath: sourceRef.path, candidatePath: candidateRef.path, requiredAxes: [], sourceStatus: 'RESOLVED', problemAssetPaths: [candidate.image].filter(value => value && assetPaths.has(value)), solutionAssetPaths: [candidate.solutionImage].filter(value => value && assetPaths.has(value)), evidence: {}, visual: { origin: 'NATIVE', requirement, action: requirement === 'VISUAL_EXEMPT' ? 'NONE' : 'KEEP', exemptReason: requirement === 'VISUAL_EXEMPT' ? 'NO_VISUAL_NEEDED' : null, adjudicationId: `q${row.id}:authority`, adjudicationStatus: authorityFinalized ? 'RESOLVED' : 'PENDING', actualSolutionVisualAttached: Boolean(candidate.solutionImage), problemVisualMathDependency: Boolean(candidate.image), sharedVisualMathDependency: false } };
    });
    const run = { schemaVersion: RUN_VERSION_V2, pipeline, workBatchId: 'job', runId: 'run', revision, builderId: 'builder', builderSessionId: 'builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', questions, inputs: [sourceRef, candidateRef, ...assetRefs], evidence: [], auditorPacketRefs: [], registry: [] };
    run.inputSha = runInputSha(run);
    const shas = computeV2AxisInputShas(root, run);
    if (revision > 1 && currentPassAxes.length) {
      const phaseForAxis = axis => ['SOURCE', 'MATH_A1', 'V1'].includes(axis) ? 'U1' : axis === 'V2' ? 'U2' : 'U3';
      const packetRefs = new Map();
      for (const phase of [...new Set(currentPassAxes.map(phaseForAxis))]) {
        const packetBody = {
          schemaVersion: 'APMATH_AUDITOR_PACKET_v1',
          phase,
          questionUids: questions.map(question => question.questionUid),
          payload: phase === 'U3'
            ? questions.map(question => { const candidate = candidateRows.find(row => row.id === question.qid); return { questionUid: question.questionUid, currentQuestion: { questionUid: question.questionUid, content: candidate.content, choices: candidate.choices, candidateRef }, currentAnswer: candidate.answer, currentSolution: candidate.solution }; })
            : phase === 'U2'
              ? questions.map(question => ({ questionUid: question.questionUid, artifact: null, renderWitnesses: [], visualApplicability: visualApplicabilityForQuestion(question) }))
              : questions.map(question => ({ questionUid: question.questionUid, content: sourceRows.find(row => row.id === question.qid).content, choices: sourceRows.find(row => row.id === question.qid).choices })),
          auditorId: 'auditor-job:1',
          auditorSessionId: `job:1-${phase.toLowerCase()}`,
          builderId: 'builder',
          builderSessionId: 'builder-session',
          auditorPrincipalType: 'STATELESS_MODEL',
          contextId: `job:1-c${phase.slice(1)}`,
          inputVisibilityProfile: phase === 'U1' ? 'SOURCE_ONLY' : phase === 'U2' ? 'ARTIFACT_ONLY' : 'CANDIDATE_ONLY',
          priorReviewVisibility: 'NONE',
          sealed: true,
          launchId: 'job:1',
          externalTaskId: 'external-job:1',
        };
        const packet = { ...packetBody, packetSha: objectSha(packetBody) };
        const packetRef = write(`packets/current-pass-${revision}-${phase.toLowerCase()}.json`, packet);
        packetRefs.set(phase, { packet, ref: packetRef });
        run.auditorPacketRefs.push(packetRef);
      }
      for (const question of questions) for (const axis of currentPassAxes) {
        const evidenceId = `current-pass-${revision}-${question.id}-${axis}`;
        const phase = phaseForAxis(axis);
        const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId, runId: run.runId, revision, questionUid: question.questionUid, axis, axisInputSha: shas[question.questionUid][axis], inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, status: 'PASS', validityStatus: 'VALID', mode: 'FRESH', reviewerId: 'auditor-job:1', reviewSessionId: `job:1-${phase.toLowerCase()}`, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-13T00:00:00Z', frozenAt: '2026-09-13T00:01:00Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: phase === 'U1' ? 'SOURCE_ONLY' : phase === 'U2' ? 'ARTIFACT_ONLY' : 'CANDIDATE_ONLY', reviewIsolationProvenanceSha: packetRefs.get(phase).packet.packetSha, launchId: 'job:1', externalTaskId: 'external-job:1', withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', findings: [], payload: ['MATH_A1', 'MATH_A2'].includes(axis) ? { independentAnswer: currentPassAnswers[axis] || '1', independentDerivation: 'Synthetic independent derivation.' } : {} };
        run.evidence.push(write(`evidence/${evidenceId}.json`, evidence));
        question.evidence[axis] = evidenceId;
      }
    }
    for (const question of questions) for (const axis of ['STATIC', 'METADATA']) {
      const artifactBinding = pipeline === 'past-exam' ? { currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256 } : {};
      const machineProvenance = { runId: run.runId, revision, inputSha: run.inputSha, collector: 'SYNTHETIC_TEST_ONLY', ...artifactBinding };
      const payload = axis === 'STATIC' ? { checkedInputSha: run.inputSha, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS', studentSerialization: 'PASS' }, ...artifactBinding } : { metadataInputSha: shas[question.questionUid][axis], checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' }, ...artifactBinding };
      const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: `machine-${revision}-${++serial}`, runId: run.runId, revision, questionUid: question.questionUid, axis, axisInputSha: shas[question.questionUid][axis], inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', machineProvenance, reviewIsolationProvenanceSha: objectSha(machineProvenance), payload };
      run.evidence.push(write(`evidence/${evidence.evidenceId}.json`, evidence));
    }
    const ref = write(`run-${revision}.json`, run);
    return { run, ref };
  };
  const request = (purpose, suffix = purpose) => ({ purpose, callerRole: 'MAIN_WORKER', auditorId: `${suffix}-auditor`, auditorSessionId: `${suffix}-session`, parentLaunchId: null, recursiveSubagentLaunchCount: 0, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, contexts: Object.fromEntries(['U1', 'U2', 'U3'].map(phase => [phase, { sessionId: `${suffix}-${phase}-session`, contextId: `${suffix}-${phase}-context` }])) });
  const terminalReceipt = (launchId, externalId, status, defects = [], extra = {}) => {
    const evidenceRef = write(`provider/evidence-${++serial}.json`, { schemaVersion: 'APMATH_PROVIDER_EXECUTION_FAILURE_EVIDENCE_v1', status: status === 'FAILED' ? 'FAILED' : 'PASS', launchId, externalId });
    const receiptRef = write(`provider/receipt-${serial}.json`, { launchId, externalId, status, independentAgentLaunchCount: 1, expensiveAgentLaunchCount: 1, concurrentExpensiveAgentPeak: 1, recursiveSubagentLaunchCount: 0, usedTokens: null, evidenceRefs: status === 'FAILED' ? [evidenceRef] : [], defects, ...extra });
    return receiptRef;
  };
  return { root, write, makeRun, request, terminalReceipt, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
