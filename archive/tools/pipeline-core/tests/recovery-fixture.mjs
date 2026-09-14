import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileRef, objectSha } from '../canonical.mjs';
import { RUN_VERSION_V2, runInputSha } from '../closure.mjs';
import { computeV2AxisInputShas } from '../v2-audit.mjs';
import { initWorkBatch } from '../work-batch.mjs';

export function recoveryFixture(t, { questionCount = 1, authorityFinalized = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-recovery-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, value) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value)}\n`);
    return fileRef(root, relative);
  };
  const sourceRows = Array.from({ length: questionCount }, (_, index) => ({ id: index + 1, content: `Find the value for question ${index + 1}.`, choices: ['1', '2'], answer: '1', solution: 'The answer is 1.' }));
  const sourceRef = { ...write('source.js', `window.examTitle="recovery";window.questionBank=${JSON.stringify(sourceRows)};`), role: 'source' };
  initWorkBatch(root, { workBatchId: 'job', runIds: ['run'], builderId: 'builder', builderSessionId: 'builder-session', workflowProfile: 'PAST_EXAM' });
  let serial = 0;
  const makeRun = (revision = 1) => {
    const candidateRows = sourceRows.map(row => ({ ...row, content: revision === 1 ? row.content : `${row.content} Revision ${revision}.` }));
    const candidateRef = { ...write(`candidate-${revision}.js`, `window.examTitle="recovery";window.questionBank=${JSON.stringify(candidateRows)};`), role: 'candidate' };
    const questions = sourceRows.map(row => ({ questionUid: `recovery|${row.id}`, sourceExamId: 'recovery', examId: 'recovery', qid: row.id, sourcePath: sourceRef.path, candidatePath: candidateRef.path, requiredAxes: [], sourceStatus: 'RESOLVED', problemAssetPaths: [], solutionAssetPaths: [], evidence: {}, visual: { origin: 'NATIVE', requirement: 'VISUAL_EXEMPT', action: 'NONE', exemptReason: 'NO_VISUAL_NEEDED', adjudicationId: `q${row.id}:authority`, adjudicationStatus: authorityFinalized ? 'RESOLVED' : 'PENDING', actualSolutionVisualAttached: false, problemVisualMathDependency: false, sharedVisualMathDependency: false } }));
    const run = { schemaVersion: RUN_VERSION_V2, pipeline: 'tag-enrichment', workBatchId: 'job', runId: 'run', revision, builderId: 'builder', builderSessionId: 'builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', questions, inputs: [sourceRef, candidateRef], evidence: [], registry: [] };
    run.inputSha = runInputSha(run);
    const shas = computeV2AxisInputShas(root, run);
    for (const question of questions) for (const axis of ['STATIC', 'METADATA']) {
      const machineProvenance = { runId: run.runId, revision, inputSha: run.inputSha, collector: 'SYNTHETIC_TEST_ONLY' };
      const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: `machine-${revision}-${++serial}`, runId: run.runId, revision, questionUid: question.questionUid, axis, axisInputSha: shas[question.questionUid][axis], inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', machineProvenance, reviewIsolationProvenanceSha: objectSha(machineProvenance), payload: axis === 'STATIC' ? { checkedInputSha: run.inputSha, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS', studentSerialization: 'PASS' } } : { metadataInputSha: shas[question.questionUid][axis], checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } } };
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
