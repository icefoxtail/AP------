import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fileRef, objectSha, readBoundFile } from './canonical.mjs';
import { captureRender } from './render.mjs';

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`${name} is required`);
  return process.argv[index + 1];
}

function readJsonRef(root, ref) {
  return JSON.parse(readBoundFile(root, ref).toString('utf8'));
}

function caseKey(capture) {
  const mode = capture?.payload?.mode;
  const viewport = capture?.payload?.viewport?.profile;
  return `${mode}/${viewport}`;
}

function captureTimestamp(capture) {
  return [capture?.startedAt, capture?.frozenAt].map(value => Date.parse(value || '')).filter(Number.isFinite).sort((left, right) => right - left)[0] || 0;
}

function buildCase(captureRef, capture) {
  const key = caseKey(capture);
  return {
    caseKey: key,
    status: capture?.status === 'PASS' ? 'PASS' : 'FAIL',
    expectedQuestionCount: capture?.payload?.expectedQuestionCount ?? null,
    observedQuestionCount: capture?.payload?.observedQuestionCount ?? null,
    captureRef,
    witness: {
      captureId: capture?.evidenceId || null,
      actualBrowser: capture?.payload?.actualBrowser === true,
      productionEngine: capture?.payload?.productionEngine === true,
      browserVersion: capture?.payload?.browserVersion || null,
      screenshot: capture?.payload?.screenshot || null,
      candidatePath: capture?.payload?.candidatePath || null,
      inputSha: capture?.inputSha || null,
      runtimeBundleSha: capture?.payload?.runtimeBundleSha || null,
      runtimeResponseBundleSha: capture?.payload?.runtimeResponseBundleSha || null,
    },
  };
}

export async function collectProductionSmoke({ root, run, binding, transactionId, reviewReadyRunId, outputDirectory, channel = null } = {}) {
  if (!root || !run || !binding || !transactionId || !reviewReadyRunId || !outputDirectory) throw new Error('PRODUCTION_SMOKE_COLLECTOR_INPUT_REQUIRED');
  const rootPath = path.resolve(root);
  const outputPath = path.isAbsolute(outputDirectory) ? path.resolve(outputDirectory) : path.resolve(rootPath, outputDirectory);
  const outputRelative = path.relative(rootPath, outputPath);
  if (!outputRelative || outputRelative.startsWith('..') || path.isAbsolute(outputRelative)) throw new Error('NON_CANONICAL_PATH');
  const captureOutputDirectory = outputRelative.split(path.sep).join('/');
  const selectedChannel = channel || process.env.APMATH_BROWSER_CHANNEL || 'chrome';
  const captureReport = await captureRender(rootPath, run, captureOutputDirectory, { channel: selectedChannel });
  const captures = (captureReport.captures || []).map(ref => ({ ref, capture: readJsonRef(rootPath, ref) }));
  const cases = captures.map(({ ref, capture }) => buildCase(ref, capture));
  const required = ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'];
  if (cases.length !== required.length || new Set(cases.map(row => row.caseKey)).size !== cases.length || cases.some(row => !required.includes(row.caseKey))) throw new Error('PRODUCTION_SMOKE_CASE_COVERAGE_INVALID');
  const browserRows = cases.map(row => row.witness);
  if (binding.rendererRuntimeBinding?.runtimeBundleSha && browserRows.some(row => row.runtimeBundleSha !== binding.rendererRuntimeBinding.runtimeBundleSha)) throw new Error('PRODUCTION_SMOKE_RUNTIME_BUNDLE_BINDING_INVALID');
  const latestCaptureTime = Math.max(...captures.map(({ capture }) => captureTimestamp(capture)));
  const capturedAt = new Date(latestCaptureTime || Date.now()).toISOString();
  const report = {
    schemaVersion: 'APMATH_PRODUCTION_SMOKE_REPORT_v1',
    status: cases.every(row => row.status === 'PASS') ? 'PASS' : 'FAIL',
    releaseTransactionId: transactionId,
    reviewReadyRunId,
    smokeId: `${transactionId}:${objectSha(captures.map(({ ref }) => ref))}`,
    capturedAt,
    executedAt: new Date().toISOString(),
    browserWitness: {
      captureId: `${transactionId}:browser-capture`,
      actualBrowser: browserRows.every(row => row.actualBrowser === true),
      browserVersion: browserRows.map(row => row.browserVersion).find(Boolean) || null,
      captureRefs: captures.map(({ ref }) => ref),
    },
    rendererRuntimeBinding: binding.rendererRuntimeBinding,
    productionBinding: binding,
    cases,
    captureReport: { status: captureReport.status, captures: captureReport.captures },
  };
  fs.mkdirSync(outputPath, { recursive: true });
  const reportPath = path.join(outputPath, 'production-smoke-report.json');
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  report.reportRef = fileRef(rootPath, path.relative(rootPath, reportPath).split(path.sep).join('/'));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(arg('--root'));
    const plan = JSON.parse(fs.readFileSync(path.resolve(arg('--plan')), 'utf8'));
    const outputDirectory = path.resolve(arg('--out'));
    const report = await collectProductionSmoke({ root, run: plan.run, binding: plan.binding, transactionId: plan.transactionId, reviewReadyRunId: plan.reviewReadyRunId, outputDirectory, channel: plan.channel || null });
    process.stdout.write(`${JSON.stringify(report)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message || error}\n`);
    process.exitCode = 1;
  }
}
