import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fileRef, objectSha } from '../canonical.mjs';
import { RUN_VERSION_V2, profiles, runInputSha } from '../closure.mjs';
import { computeV2AxisInputShas } from '../v2-audit.mjs';
import { requiredAxesForQuestion } from '../projection.mjs';
import { aggregateWorkBatchAudit, initWorkBatch, freezeWorkBatch, reserveWorkBatchReview, reconcileWorkBatchReview, readWorkBatch, workBatchMetrics } from '../work-batch.mjs';
import { prepareProviderReview } from '../provider-bridge.mjs';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const mainSha = execFileSync('git', ['rev-parse', 'refs/heads/main'], { cwd: repository, encoding: 'utf8' }).trim();
const authority = { startSha: mainSha, calibrationSha: 'sha256:calibration', rulePackSha: 'sha256:rule-pack' };
const phases = ['U1', 'U2', 'U3'];

const sortedTargets = rows => [...rows].sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));

function reviewRequest(purpose) {
  return {
    purpose,
    callerRole: 'MAIN_WORKER',
    auditorId: 'independent-auditor',
    auditorSessionId: `${purpose}-auditor-session`,
    parentLaunchId: null,
    recursiveSubagentLaunchCount: 0,
    contextIsolation: 'STATELESS_INPUTS',
    subagentToolsEnabled: false,
    contexts: Object.fromEntries(phases.map(phase => [phase, { sessionId: `${purpose}-${phase}-session`, contextId: `${purpose}-${phase}-context` }])),
  };
}

function benchmarkFixture(t, { jobKind = 'GOLD', pipeline = 'tag-enrichment', runIds } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-gold-work-batch-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  execFileSync('git', ['clone', '--shared', '--no-checkout', '--branch', 'main', repository, '.'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['update-ref', 'refs/remotes/origin/main', mainSha], { cwd: root, stdio: 'ignore' });

  const write = (relative, value) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
    return fileRef(root, relative);
  };

  initWorkBatch(root, {
    workBatchId: 'job',
    runIds,
    builderId: 'builder',
    builderSessionId: 'builder-session',
    workflowProfile: pipeline === 'past-exam' ? 'PAST_EXAM' : 'LEGACY',
    jobKind,
    ...(jobKind === 'PRODUCTION' ? {} : { jobAuthority: authority }),
  });

  return {
    root,
    write,
    addRun(runId, count, { eligible = true, revision = 1, changed = false, sourceFormat = eligible ? 'PDF' : 'HWP' } = {}) {
      const questions = Array.from({ length: count }, (_, offset) => {
        const index = offset + 1;
        const questionUid = `${runId}|${index}`;
        const sourceQuestion = { id: index, content: `Question ${index}`, choices: ['1', '2'], answer: '1', solution: 'The answer is 1.' };
        const candidateQuestion = { ...sourceQuestion, content: changed ? `Question ${index} changed` : sourceQuestion.content };
        return { questionUid, sourceQuestion, candidateQuestion };
      });
      const sourcePath = `sources/${runId}.js`;
      const candidatePath = `candidates/${runId}-r${revision}.js`;
      const sourceRef = { ...write(sourcePath, `window.examTitle=${JSON.stringify(runId)};window.questionBank=${JSON.stringify(questions.map(row => row.sourceQuestion))};`), role: 'source' };
      const candidateRef = { ...write(candidatePath, `window.examTitle=${JSON.stringify(runId)};window.questionBank=${JSON.stringify(questions.map(row => row.candidateQuestion))};`), role: 'candidate' };
      const rows = questions.map(({ questionUid, sourceQuestion }) => ({
        questionUid,
        sourceExamId: runId,
        examId: runId,
        qid: sourceQuestion.id,
        sourcePath,
        candidatePath,
        sourceStatus: 'RESOLVED',
        problemAssetPaths: [],
        solutionAssetPaths: [],
        evidence: {},
        visual: { origin: 'NATIVE', requirement: 'VISUAL_EXEMPT', action: 'NONE', exemptReason: 'NO_VISUAL_NEEDED', adjudicationId: `${questionUid}:authority`, adjudicationStatus: 'RESOLVED', actualSolutionVisualAttached: false, problemVisualMathDependency: false, sharedVisualMathDependency: false },
      }));
      for (const row of rows) row.requiredAxes = requiredAxesForQuestion(profiles.pipelines[pipeline], row, { pipeline });
      const run = {
        schemaVersion: RUN_VERSION_V2,
        pipeline,
        workBatchId: 'job',
        runId,
        revision,
        builderId: 'builder',
        builderSessionId: 'builder-session',
        builderModelOrAgent: 'SYNTHETIC_TEST_ONLY',
        ...(jobKind === 'PRODUCTION' ? {} : {
          benchmarkKind: jobKind,
          pastExamAuthority: authority,
          sourceAuthority: { goldBenchmarkEligibility: eligible ? { status: 'GOLD_ELIGIBLE', sourceFormat, sourcePixelRenderAvailable: true, denominatorIncluded: true, benchmarkEligible: true } : { status: 'GOLD_INELIGIBLE_SOURCE_FORMAT', sourceFormat, sourcePixelRenderAvailable: true, denominatorIncluded: false, benchmarkEligible: false } },
        }),
        questions: rows,
        inputs: [sourceRef, candidateRef],
        evidence: [],
      };
      run.inputSha = runInputSha(run);
      const axisShas = computeV2AxisInputShas(root, run);
      for (const row of rows) for (const axis of ['STATIC', 'METADATA']) {
        const machineProvenance = {
          runId,
          revision,
          inputSha: run.inputSha,
          collector: 'SYNTHETIC_TEST_ONLY',
          ...(jobKind === 'PRODUCTION' ? {} : {
            currentArtifactSha: candidateRef.sha256,
            CURRENT_ARTIFACT_SHA: candidateRef.sha256,
            EVIDENCE_INPUT_SHA: candidateRef.sha256,
            authorityStartSha: authority.startSha,
          }),
        };
        const evidence = {
          schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2',
          evidenceId: `${runId}-${revision}-${row.qid}-${axis}`,
          runId,
          revision,
          questionUid: row.questionUid,
          axis,
          axisInputSha: axisShas[row.questionUid][axis],
          inputSha: run.inputSha,
          reviewStartInputSha: run.inputSha,
          reviewEndInputSha: run.inputSha,
          mode: 'MACHINE_CURRENT',
          auditorPrincipalType: 'MACHINE_COLLECTOR',
          status: 'PASS',
          validityStatus: 'FROZEN',
          machineProvenance,
          reviewIsolationProvenanceSha: objectSha(machineProvenance),
          payload: axis === 'STATIC'
            ? { checkedInputSha: run.inputSha, ...(jobKind === 'PRODUCTION' ? {} : { currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, authorityStartSha: authority.startSha }), checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS', studentSerialization: 'PASS' } }
            : { metadataInputSha: axisShas[row.questionUid][axis], ...(jobKind === 'PRODUCTION' ? {} : { currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, authorityStartSha: authority.startSha }), checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } },
        };
        run.evidence.push(write(`evidence/${evidence.evidenceId}.json`, evidence));
      }
      const ref = write(`runs/${runId}-r${revision}.json`, run);
      return { run, ref, targets: rows.map(row => ({ runId, questionUid: row.questionUid })) };
    },
  };
}

test('CASE 1: benchmark denominator and FINAL_AUDIT scope use question-level eligibility', t => {
  const f = benchmarkFixture(t, { runIds: ['eligible-run', 'excluded-run'] });
  const eligible = f.addRun('eligible-run', 20, { eligible: true });
  const excluded = f.addRun('excluded-run', 25, { eligible: false });
  const frozen = freezeWorkBatch(f.root, 'job', [eligible.ref, excluded.ref]);
  const denominator = frozen.freezes[0].benchmarkDenominator;
  assert.equal(denominator.status, 'FROZEN');
  assert.equal(denominator.totalTargetCount, 45);
  assert.equal(denominator.eligibleTargetCount, 20);
  assert.equal(denominator.excludedTargetCount, 25);
  assert.deepEqual(denominator.eligibleTargets, sortedTargets(eligible.targets));
  assert.deepEqual(denominator.excludedTargets, sortedTargets(excluded.targets));
  assert.deepEqual(frozen.freezes[0].targets, sortedTargets([...eligible.targets, ...excluded.targets]));
  assert.deepEqual(denominator.excludedRuns, [{ runId: 'excluded-run', status: 'GOLD_INELIGIBLE_SOURCE_FORMAT' }]);

  const runtime = path.join(f.root, 'preflight.mjs');
  fs.writeFileSync(runtime, `import fs from 'node:fs'; const request=JSON.parse(fs.readFileSync(0,'utf8')); process.stdout.write(JSON.stringify({schemaVersion:request.schemaVersion,operation:request.operation,status:'READY',requestSha:request.requestSha,provider:'synthetic-provider',model:'gpt-5.6-luna',reasoningEffort:'xhigh',externalTaskId:'provider-final',auditorId:'provider-auditor',auditorSessionId:'provider-session',contextIsolation:'STATELESS_INPUTS',subagentToolsEnabled:false,modelInvocationCount:0,runtimeAttestation:'synthetic-attestation',contexts:{U1:{sessionId:'provider-u1',contextId:'provider-c1'},U2:{sessionId:'provider-u2',contextId:'provider-c2'},U3:{sessionId:'provider-u3',contextId:'provider-c3'}}}));`);
  const prepared = prepareProviderReview(f.root, { workBatchId: 'job', purpose: 'FINAL_AUDIT', transport: { command: process.execPath, args: [runtime] }, planPath: 'alive/runtime/provider-bridge/job/preflight.json' });
  const plan = JSON.parse(fs.readFileSync(path.join(f.root, 'alive/runtime/provider-bridge/job/preflight.json'), 'utf8'));
  assert.deepEqual(plan.scope, sortedTargets(eligible.targets));
  const reserved = reserveWorkBatchReview(f.root, 'job', prepared.reservationRequest);
  assert.deepEqual(reserved.launches[0].scope, sortedTargets(eligible.targets));
  const metrics = workBatchMetrics(f.root, eligible.run);
  assert.equal(metrics.targetCount, 45);
  assert.equal(metrics.totalTargetCount, 20);
  assert.equal(metrics.benchmarkReviewedTargetCount, 20);
  assert.equal(metrics.benchmarkEligibleTargetCount, 20);
  assert.equal(metrics.benchmarkExcludedTargetCount, 25);
  assert.equal(metrics.benchmarkTotalSourceTargetCount, 45);
  assert.equal(metrics.benchmarkEligibleAffectedTargetCount, 20);
});

test('CASE 2: all eligible runs keep the complete question denominator', t => {
  const f = benchmarkFixture(t, { runIds: ['run-a', 'run-b'] });
  const runA = f.addRun('run-a', 10, { eligible: true });
  const runB = f.addRun('run-b', 15, { eligible: true });
  const frozen = freezeWorkBatch(f.root, 'job', [runA.ref, runB.ref]);
  const denominator = frozen.freezes[0].benchmarkDenominator;
  assert.equal(denominator.totalTargetCount, 25);
  assert.equal(denominator.eligibleTargetCount, 25);
  assert.equal(denominator.excludedTargetCount, 0);
  assert.deepEqual(denominator.excludedTargets, []);
  assert.deepEqual(denominator.excludedRuns, []);
  const reserved = reserveWorkBatchReview(f.root, 'job', reviewRequest('FINAL_AUDIT'));
  assert.deepEqual(reserved.launches[0].scope, frozen.freezes[0].targets);
});

test('CASE 3: an all-ineligible benchmark cannot freeze a zero denominator', t => {
  const f = benchmarkFixture(t, { runIds: ['excluded-a', 'excluded-b'] });
  const runA = f.addRun('excluded-a', 12, { eligible: false });
  const runB = f.addRun('excluded-b', 8, { eligible: false });
  assert.throws(() => freezeWorkBatch(f.root, 'job', [runA.ref, runB.ref]), /GOLD_BENCHMARK_DENOMINATOR_EMPTY/);
  const held = readWorkBatch(f.root, 'job');
  assert.equal(held.status, 'HOLD');
  assert.equal(held.lastHold.code, 'HOLD:GOLD_BENCHMARK_DENOMINATOR_EMPTY');
  assert.equal(held.freezes.length, 0);
});

test('CASE 4: TARGETED_RECHECK intersects affected targets with eligible benchmark targets', t => {
  const f = benchmarkFixture(t, { runIds: ['eligible-run', 'excluded-run'] });
  const eligibleV1 = f.addRun('eligible-run', 2, { eligible: true });
  const excludedV1 = f.addRun('excluded-run', 2, { eligible: false });
  freezeWorkBatch(f.root, 'job', [eligibleV1.ref, excludedV1.ref]);
  reserveWorkBatchReview(f.root, 'job', reviewRequest('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const receiptIdentity = { ...readWorkBatch(f.root, 'job').executionIdentity, actualModel: 'gpt-5.6-luna', actualReasoningEffort: 'xhigh', modelRouteObservedAtStart: '2026-09-11T00:00:00.000Z', modelRouteObservedAtClosure: '2026-09-11T00:01:00.000Z', routeStatus: 'VALID', MODEL_ROUTE_PARITY: 'PASS' };
  const receiptRef = f.write('receipts/final.json', { launchId: 'job:1', externalId: 'provider-final', status: 'COMPLETED', executionIdentity: receiptIdentity, independentAgentLaunchCount: 1, expensiveAgentLaunchCount: 1, concurrentExpensiveAgentPeak: 1, recursiveSubagentLaunchCount: 0, usedTokens: null, evidenceRefs: [], defects: [] });
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'COMPLETED', providerReceiptRef: receiptRef });

  const eligibleV2 = f.addRun('eligible-run', 2, { eligible: true, revision: 2, changed: true });
  const excludedV2 = f.addRun('excluded-run', 2, { eligible: false, revision: 2, changed: true });
  const second = freezeWorkBatch(f.root, 'job', [eligibleV2.ref, excludedV2.ref]);
  assert.equal(second.freezes[1].affected.length, 4);
  const runtime = path.join(f.root, 'targeted-preflight.mjs');
  fs.writeFileSync(runtime, `import fs from 'node:fs'; const request=JSON.parse(fs.readFileSync(0,'utf8')); process.stdout.write(JSON.stringify({schemaVersion:request.schemaVersion,operation:request.operation,status:'READY',requestSha:request.requestSha,provider:'synthetic-provider',model:'gpt-5.6-luna',reasoningEffort:'xhigh',externalTaskId:'provider-targeted',auditorId:'provider-targeted-auditor',auditorSessionId:'provider-targeted-session',contextIsolation:'STATELESS_INPUTS',subagentToolsEnabled:false,modelInvocationCount:0,runtimeAttestation:'synthetic-attestation',contexts:{U1:{sessionId:'targeted-u1',contextId:'targeted-c1'},U2:{sessionId:'targeted-u2',contextId:'targeted-c2'},U3:{sessionId:'targeted-u3',contextId:'targeted-c3'}}}));`);
  const prepared = prepareProviderReview(f.root, { workBatchId: 'job', purpose: 'TARGETED_RECHECK', transport: { command: process.execPath, args: [runtime] }, planPath: 'alive/runtime/provider-bridge/job/targeted-preflight.json' });
  const plan = JSON.parse(fs.readFileSync(path.join(f.root, 'alive/runtime/provider-bridge/job/targeted-preflight.json'), 'utf8'));
  assert.deepEqual(plan.scope, sortedTargets(eligibleV2.targets));
  const recheck = reserveWorkBatchReview(f.root, 'job', prepared.reservationRequest);
  assert.deepEqual(recheck.launches[1].scope, sortedTargets(eligibleV2.targets));
  assert.equal(recheck.launches[1].scope.some(row => row.runId === 'excluded-run'), false);
});

test('CASE 5: PRODUCTION retains freeze.targets and full FINAL_AUDIT scope', t => {
  const f = benchmarkFixture(t, { jobKind: 'PRODUCTION', runIds: ['production-run'] });
  const run = f.addRun('production-run', 3);
  const frozen = freezeWorkBatch(f.root, 'job', [run.ref]);
  assert.equal(frozen.freezes[0].benchmarkDenominator.status, 'NOT_APPLICABLE');
  const reserved = reserveWorkBatchReview(f.root, 'job', reviewRequest('FINAL_AUDIT'));
  assert.deepEqual(reserved.launches[0].scope, frozen.freezes[0].targets);
  const metrics = workBatchMetrics(f.root, run.run);
  assert.equal(metrics.targetCount, 3);
  assert.equal(metrics.totalTargetCount, 3);
  assert.equal(metrics.benchmarkEligibleTargetCount, null);
  assert.equal(metrics.benchmarkExcludedTargetCount, null);
});

test('mixed-format past-exam aggregate passes eligible PDF targets and retains HWP diagnostics', t => {
  const f = benchmarkFixture(t, { pipeline: 'past-exam', runIds: ['pdf-run', 'hwp-run', 'hwpx-run'] });
  const pdf = f.addRun('pdf-run', 2, { eligible: true, sourceFormat: 'PDF' });
  const hwp = f.addRun('hwp-run', 1, { eligible: false, sourceFormat: 'HWP' });
  const hwpx = f.addRun('hwpx-run', 1, { eligible: false, sourceFormat: 'HWPX' });
  const frozen = freezeWorkBatch(f.root, 'job', [pdf.ref, hwp.ref, hwpx.ref]);
  const denominator = frozen.freezes[0].benchmarkDenominator;
  assert.equal(denominator.totalTargetCount, 4);
  assert.equal(denominator.eligibleTargetCount, 2);
  assert.equal(denominator.excludedTargetCount, 2);

  const statePath = path.join(f.root, 'alive/runtime/work-batches/job/state.json');
  const state = readWorkBatch(f.root, 'job');
  state.executionIdentity = { ...state.executionIdentity, actualModel: 'gpt-5.6-luna', actualReasoningEffort: 'xhigh', modelRouteObservedAtStart: '2026-09-11T00:00:00.000Z', modelRouteObservedAtClosure: '2026-09-11T00:01:00.000Z', routeStatus: 'VALID', MODEL_ROUTE_PARITY: 'PASS' };
  fs.writeFileSync(statePath, JSON.stringify(state));
  const reserved = reserveWorkBatchReview(f.root, 'job', reviewRequest('FINAL_AUDIT'));
  assert.deepEqual(reserved.launches[0].scope, sortedTargets(pdf.targets));

  const passReport = run => ({ runId: run.runId, status: 'PASS', freshness: run.questions.flatMap(question => question.requiredAxes.map(axis => ({ questionUid: question.questionUid, axis, mode: 'FRESH', status: 'PASS' }))) });
  const excludedReport = run => ({ runId: run.runId, status: 'BLOCKED', freshness: run.questions.flatMap(question => question.requiredAxes.map(axis => ({ questionUid: question.questionUid, axis, mode: 'FRESH', status: 'BLOCKED' }))), errors: ['GOLD_INELIGIBLE_SOURCE_FORMAT'] });
  const aggregate = aggregateWorkBatchAudit(f.root, reserved, [pdf.run, hwp.run, hwpx.run], [passReport(pdf.run), excludedReport(hwp.run), excludedReport(hwpx.run)]);
  assert.equal(aggregate.status, 'PASS');
  assert.equal(aggregate.benchmarkEligible, true);
  assert.equal(aggregate.finalCoverage, 1);
  assert.equal(aggregate.diagnostics.closed, true);
  assert.equal(aggregate.diagnostics.eligibleReportCount, 1);
  assert.deepEqual(aggregate.diagnostics.excludedRuns.map(row => row.runId), ['hwp-run', 'hwpx-run']);
  assert.deepEqual(aggregate.reports.map(report => [report.runId, report.status]), [['pdf-run', 'PASS'], ['hwp-run', 'BLOCKED'], ['hwpx-run', 'BLOCKED']]);

  const routeMismatchState = { ...reserved, executionIdentity: { ...reserved.executionIdentity, actualModel: 'gpt-6-astra', actualReasoningEffort: 'high', routeStatus: 'MODEL_ROUTE_INVALID', MODEL_ROUTE_PARITY: 'FAIL' } };
  const routeMismatch = aggregateWorkBatchAudit(f.root, routeMismatchState, [pdf.run, hwp.run, hwpx.run], [passReport(pdf.run), excludedReport(hwp.run), excludedReport(hwpx.run)]);
  assert.equal(routeMismatch.status, 'BLOCKED');
  assert.equal(routeMismatch.benchmarkEligible, false);
});

test('all-ineligible past-exam jobs keep the zero-denominator HOLD gate', t => {
  const f = benchmarkFixture(t, { pipeline: 'past-exam', runIds: ['hwp-run'] });
  const hwp = f.addRun('hwp-run', 2, { eligible: false, sourceFormat: 'HWPX' });
  assert.throws(() => freezeWorkBatch(f.root, 'job', [hwp.ref]), /GOLD_BENCHMARK_DENOMINATOR_EMPTY/);
  assert.equal(readWorkBatch(f.root, 'job').status, 'HOLD');
});
