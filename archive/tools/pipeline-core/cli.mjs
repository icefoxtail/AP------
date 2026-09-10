import fs from 'node:fs';
import { inspectDispatchLock, recoverDispatchLock, initWorkBatch, freezeWorkBatch, reserveWorkBatchReview, reconcileWorkBatchReview, readWorkBatch, workBatchMetrics } from './work-batch.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditManifestFile, profiles, RUN_VERSION, RUN_VERSION_V2, CORE_SHA } from './closure.mjs';
import { objectSha, writeNewJson, readBoundFile, canonicalJson } from './canonical.mjs';
import { validateModelRouteParity, isBenchmarkJobKind } from './gold-contract.mjs';
import { validateVisualFact, semanticSha, compareVisualFacts, VISUAL_SPEC_SHA } from './visual.mjs';
import { rulePreflight } from './rulepack.mjs';
import { prepareDraft } from './prepare.mjs';
import { auditV2Run } from './v2-audit.mjs';
import { semanticDiff, changeImpactMap, computeAxisInputShaMap } from './semantic-diff.mjs';
import { axisInputSha } from './projection.mjs';
import { createExamReleaseClosure, validateExamReleaseClosure } from './exam-release.mjs';
import { detectRenderImpact } from './render-impact.mjs';
import { prepareProviderReview, dispatchProviderReview } from './provider-bridge.mjs';
import { collectMachineEvidence } from './machine-evidence.mjs';

const args = process.argv.slice(2);
const value = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const root = path.resolve(value('--root') || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
let output;
try {
  switch (args[0]) {
    case 'work-batch-lock-status': output = inspectDispatchLock(root); break;
    case 'work-batch-lock-recover': output = recoverDispatchLock(root, value('--expected-lock-sha')); break;
    case 'work-batch-init': output = initWorkBatch(root, read(value('--spec'))); break;
    case 'work-batch-freeze': output = freezeWorkBatch(root, value('--work-batch-id'), read(value('--run-refs'))); break;
    case 'work-batch-reserve': output = reserveWorkBatchReview(root, value('--work-batch-id'), read(value('--request'))); break;
    case 'work-batch-reconcile': output = reconcileWorkBatchReview(root, value('--work-batch-id'), read(value('--request'))); break;
    case 'provider-preflight': output = prepareProviderReview(root, { workBatchId: value('--work-batch-id'), purpose: value('--purpose'), transport: { command: value('--provider-command'), args: value('--provider-args') ? read(value('--provider-args')) : [] }, planPath: value('--plan-out') }); break;
    case 'provider-dispatch': output = dispatchProviderReview(root, { workBatchId: value('--work-batch-id'), launchId: value('--launch-id'), planPath: value('--plan'), packetRefs: read(value('--packet-refs')), transport: { command: value('--provider-command'), args: value('--provider-args') ? read(value('--provider-args')) : [] }, receiptPath: value('--receipt-out') }); break;
    case 'work-batch-audit': {
      const state = readWorkBatch(root, value('--work-batch-id'));
      const runs = read(value('--run-refs')).map(ref => JSON.parse(readBoundFile(root, ref)));
      if (canonicalJson(runs.map(r => r.runId).sort()) !== canonicalJson(state.runIds) || runs.some(r => r.workBatchId !== state.workBatchId)) throw new Error('WHOLE_JOB_AUDIT_REQUIRED');
      const reports = runs.map(run => auditV2Run(root, run));
      const rows = reports.flatMap(report => report.freshness.map(row => ({ ...row, runId: report.runId, targetQuestionUid: row.questionUid, questionUid: `${report.runId}:${row.questionUid}` })));
      const cost = workBatchMetrics(root, runs[0], rows);
      const closed = reports.every(report => report.status === 'PASS');
      const route = validateModelRouteParity(state.executionIdentity);
      const routeErrors = isBenchmarkJobKind(state.jobKind) && route.status !== 'PASS' ? ['MODEL_ROUTE_PARITY_FAIL'] : [];
      const freeze = state.freezes.at(-1);
      const benchmarkDenominator = freeze?.benchmarkDenominator || null;
      const denominator = benchmarkDenominator?.eligibleTargetCount;
      const excluded = benchmarkDenominator?.excludedRuns || [];
      const reviewTargets = isBenchmarkJobKind(state.jobKind) ? benchmarkDenominator?.eligibleTargets || [] : freeze?.targets || [];
      const reviewTargetKeys = new Set(reviewTargets.map(row => canonicalJson({ runId: row.runId, questionUid: row.questionUid })));
      const excludedStatus = excluded.find(row => row.status)?.status || null;
      const finalStatus = excludedStatus ? excludedStatus : closed && !routeErrors.length ? 'PASS' : 'BLOCKED';
      output = { status: finalStatus, benchmarkEligible: !excludedStatus && !routeErrors.length, workBatchId: state.workBatchId, productionAuthorized: false, MODEL_ROUTE_PARITY: route.MODEL_ROUTE_PARITY, modelRouteStatus: route.routeStatus, routeErrors, benchmarkDenominator, cost: { ...cost, totalTargetCount: denominator ?? cost.totalTargetCount }, finalCoverage: (() => { const denominatorAxes = runs.reduce((n, run) => n + run.questions.reduce((m, question) => m + (reviewTargetKeys.has(canonicalJson({ runId: run.runId, questionUid: question.questionUid })) ? question.requiredAxes?.length || 0 : 0), 0), 0); return denominatorAxes ? new Set(rows.filter(row => row.status === 'PASS' && reviewTargetKeys.has(canonicalJson({ runId: row.runId, questionUid: row.targetQuestionUid }))).map(row => `${row.questionUid}:${row.axis}`)).size / denominatorAxes : 0; })(), reports: reports.map(({ runId, status, errors }) => ({ runId, status, errors })) }; break;
    }
    case 'work-batch-status': { const state = readWorkBatch(root, value('--work-batch-id')); output = { status: state.status, workBatchId: state.workBatchId, latestFreezeSha: state.freezes.at(-1)?.freezeSha || null, targetCount: state.freezes.at(-1)?.targets.length || 0, launches: state.launches.map(({ launchId, purpose, status, externalId, usedTokens }) => ({ launchId, purpose, status, externalId, usedTokens: Number.isSafeInteger(usedTokens) ? usedTokens : null })) }; break; }
    case 'rules': output = rulePreflight(root); break;
    case 'prepare': output = prepareDraft(root, { pipeline: value('--pipeline'), runId: value('--run-id'), sourcePath: value('--source'), candidatePath: value('--candidate'), workdir: value('--workdir'), schemaVersion: args.includes('--v2') ? RUN_VERSION_V2 : RUN_VERSION, builderId: value('--builder-id'), builderSessionId: value('--builder-session-id'), builderModelOrAgent: value('--builder-model'), workBatchId: value('--work-batch-id'), pastExamManifestPath: value('--past-exam-manifest'), assetRoot: value('--asset-root'), sourceAssetRoot: value('--source-asset-root'), benchmarkKind: value('--benchmark-kind'), sourceExamIdRegistryRef: value('--source-registry-ref') ? read(path.resolve(value('--source-registry-ref'))) : null }); break;
    case 'prepare-v2': output = prepareDraft(root, { pipeline: value('--pipeline'), runId: value('--run-id'), sourcePath: value('--source'), candidatePath: value('--candidate'), workdir: value('--workdir'), schemaVersion: RUN_VERSION_V2, builderId: value('--builder-id'), builderSessionId: value('--builder-session-id'), builderModelOrAgent: value('--builder-model'), workBatchId: value('--work-batch-id'), pastExamManifestPath: value('--past-exam-manifest'), assetRoot: value('--asset-root'), sourceAssetRoot: value('--source-asset-root'), benchmarkKind: value('--benchmark-kind'), sourceExamIdRegistryRef: value('--source-registry-ref') ? read(path.resolve(value('--source-registry-ref'))) : null }); break;
    case 'machine-checks': output = collectMachineEvidence(root, value('--manifest'), { manifestOut: value('--manifest-out'), evidenceDir: value('--evidence-dir') }); break;
    case 'render': output = await (await import('./render.mjs')).captureRender(root, read(value('--manifest')), value('--workdir'), { channel: value('--browser-channel') || 'chrome', collectorIdentity: value('--collector-identity') ? read(path.resolve(value('--collector-identity'))) : null }); break;
    case 'render-review': output = (await import('./render.mjs')).createRenderReview(root, read(value('--manifest')), read(value('--capture-ref')), read(value('--decision'))); break;
    case 'audit': {
      const manifest = value('--manifest');
      if (!manifest) throw new Error('--manifest is required');
      output = auditManifestFile(root, path.resolve(manifest), value('--pipeline'));
      break;
    }
    case 'audit-v2': {
      const manifest = value('--manifest');
      if (!manifest) throw new Error('--manifest is required');
      output = auditV2Run(root, read(path.resolve(manifest)));
      break;
    }
    case 'semantic-diff': {
      output = semanticDiff(read(path.resolve(value('--previous'))), read(path.resolve(value('--current'))));
      break;
    }
    case 'change-impact': {
      const diff = read(path.resolve(value('--diff')));
      const current = read(path.resolve(value('--current')));
      output = changeImpactMap(diff, current, { previousAxisInputShas: value('--previous-axis') ? read(path.resolve(value('--previous-axis'))) : {}, currentAxisInputShas: value('--current-axis') ? read(path.resolve(value('--current-axis'))) : computeAxisInputShaMap(current) });
      break;
    }
    case 'axis-input': {
      const question = read(path.resolve(value('--question')));
      output = { axis: value('--axis'), axisInputSha: axisInputSha(question, value('--axis')), questionUid: question.questionUid || null };
      break;
    }
    case 'render-impact': {
      output = detectRenderImpact(read(path.resolve(value('--previous'))), read(path.resolve(value('--current'))), { globalDependencies: value('--global') ? value('--global').split(',').filter(Boolean) : [] });
      break;
    }
    case 'release-audit': {
      const manifest = read(path.resolve(value('--manifest')));
      if (manifest.schemaVersion === RUN_VERSION_V2) output = auditV2Run(root, manifest);
      else throw new Error('RELEASE_AUDIT_REQUIRES_V2_MANIFEST');
      break;
    }
    case 'release-authorize-check': {
      const release = read(path.resolve(value('--release')));
      if (!value('--manifest')) throw new Error('RELEASE_CHECK_REQUIRES_BOUND_RUN_MANIFEST');
      const run = read(path.resolve(value('--manifest')));
      if (canonicalJson(release) !== canonicalJson(JSON.parse(readBoundFile(root, run.examReleaseClosureRef)))) throw new Error('RELEASE_MANIFEST_BINDING');
      output = auditV2Run(root, run);
      break;
    }
    case 'fact': {
      const fact = args.includes('--stdin') ? JSON.parse(fs.readFileSync(0, 'utf8')) : read(value('--file'));
      output = validateVisualFact(fact);
      if (output.status === 'PASS') output = { ...output, semanticSha: semanticSha(fact), specSha: VISUAL_SPEC_SHA };
      break;
    }
    case 'parity':
      output = compareVisualFacts(read(value('--expected')), read(value('--observed')));
      break;
    case 'inventory':
      output = { status: 'INVENTORY_ONLY', runSchema: RUN_VERSION, coreSha: CORE_SHA, pipelines: profiles.pipelines, note: 'Registered closure adapters; generation coverage remains bounded by each adapter. This is not quality PASS.' };
      break;
    case 'template': {
      const pipeline = value('--pipeline');
      if (!profiles.pipelines[pipeline]) throw new Error('Unknown --pipeline');
      output = { schemaVersion: RUN_VERSION, pipeline, runId: 'REPLACE_WITH_NEW_RUN_ID', revision: 1, builderSessionId: 'REPLACE_WITH_BUILDER_SESSION', canonicalRecordId: 'REPLACE_WITH_REGISTRY_RECORD', questions: [], inputs: [], evidence: [], registry: [], denominator: { status: 'UNFROZEN', stale: true }, inputSha: null, status: 'DRAFT_NOT_EXECUTABLE' };
      break;
    }
    default: throw new Error('Usage: cli.mjs provider-preflight --work-batch-id JOB --purpose FINAL_AUDIT|TARGETED_RECHECK --provider-command COMMAND [--provider-args JSON_FILE] --plan-out RUNTIME_PLAN | provider-dispatch --work-batch-id JOB --launch-id JOB:N --plan RUNTIME_PLAN --packet-refs JSON_FILE --provider-command COMMAND [--provider-args JSON_FILE] --receipt-out RUNTIME_RECEIPT | prepare-v2 ... | machine-checks --manifest FILE [--manifest-out FILE] [--evidence-dir DIR] | audit-v2 --manifest FILE | release-audit --manifest FILE | semantic-diff --previous FILE --current FILE | change-impact --diff FILE --current FILE | axis-input --question FILE --axis AXIS | render-impact --previous FILE --current FILE [--global CSS] | audit --manifest FILE | fact --file FILE | parity --expected FILE | template --pipeline ID | inventory');
  }
} catch (error) { output = { status: error.message.startsWith('HOLD:') ? 'HOLD' : 'BLOCKED', errors: [error.message], productionAuthorized: false }; }
if (args[0]?.startsWith('work-batch-') && output.freezes) output = { status: output.status, workBatchId: output.workBatchId, latestFreezeSha: output.freezes.at(-1)?.freezeSha || null, targetCount: output.freezes.at(-1)?.targets.length || 0, launch: output.launches.at(-1) || null };
output.reportSha = objectSha(output);
if (value('--out')) {
  const target = path.resolve(value('--out'));
  const protectedRoots = ['archive/exams', 'archive/assets'].map(p => path.resolve(root, p));
  if (protectedRoots.some(p => target === p || target.startsWith(`${p}${path.sep}`))) throw new Error('PRODUCTION_OUTPUT_FORBIDDEN');
  writeNewJson(target, output);
}
console.log(JSON.stringify(output, null, 2));
if (!['PASS', 'INVENTORY_ONLY', 'DRAFT_NOT_EXECUTABLE', 'CAPTURED_REVIEW_REQUIRED', 'MACHINE_EVIDENCE_READY', 'PRODUCTION', 'FROZEN', 'NO_DISPATCH_LOCK', 'LOCK_RECONCILIATION_REQUIRED', 'RECOVERED_RECONCILE_REQUIRED'].includes(output.status)) process.exitCode = 1;
