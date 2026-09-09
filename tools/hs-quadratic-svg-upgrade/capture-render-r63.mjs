import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureRender } from '../../archive/tools/pipeline-core/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const PREPARATION = JSON.parse(fs.readFileSync(path.join(REPORT, '780_current_v2_preparation_r63.json'), 'utf8'));
const startOrdinal = Math.max(1, Number(process.argv[2] || 1));
const endOrdinal = Math.min(PREPARATION.runs.length, Number(process.argv[3] || PREPARATION.runs.length));
const selectedRuns = PREPARATION.runs.slice(startOrdinal - 1, endOrdinal);
const shardLabel = startOrdinal === 1 && endOrdinal === PREPARATION.runs.length ? '' : `_part-${String(startOrdinal).padStart(3, '0')}-${String(endOrdinal).padStart(3, '0')}`;
const OUTPUT = path.join(REPORT, `785_browser_render_capture_r63${shardLabel}.json`);
const runs = [];
const errors = [];
const expectedCaptureCount = 6;

function readRun(item) { return JSON.parse(fs.readFileSync(path.join(ROOT, item.manifestPath), 'utf8')); }
function existingCaptures(run) {
  return (run.evidence ?? []).map((ref) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, ref.path), 'utf8')); } catch { return null; } }).filter((e) => e?.axis === 'RENDER_CAPTURE' && e.status === 'PASS');
}
function nextAttempt(base) {
  let index = 1;
  while (fs.existsSync(path.join(ROOT, `${base}-attempt-${index}`))) index += 1;
  return `${base}-attempt-${index}`;
}
function writeReport() {
  const output = {
    schemaVersion: 'HS_QUADRATIC_BROWSER_RENDER_CAPTURE_R63',
    status: errors.length ? 'BROWSER_RENDER_CAPTURE_PARTIAL_OR_FAIL' : runs.length === PREPARATION.runs.length ? 'BROWSER_RENDER_CAPTURE_MATERIALIZED_NO_REVIEW_PASS' : 'BROWSER_RENDER_CAPTURE_IN_PROGRESS_NO_PASS',
    productionAuthorized: false,
    browser: 'Playwright/Chromium',
    browserChannel: 'chromium',
    workBatchId: PREPARATION.workBatchId,
    expectedRunCount: selectedRuns.length,
    completedRunCount: runs.length,
    expectedCaptureCountPerRun: expectedCaptureCount,
    totalCaptureRecords: runs.reduce((sum, run) => sum + run.captureCount, 0),
    runs,
    errors,
    note: 'Actual Playwright browser captures for the current r63a v2 preparation. Capture is mechanical evidence only; readability remains independent RENDER_REVIEW work and no final PASS/SEALED is claimed.',
  };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
}

writeReport();
for (const item of selectedRuns) {
  const run = readRun(item);
  const current = existingCaptures(run);
  if (current.length >= expectedCaptureCount) {
    runs.push({ runId: run.runId, manifestPath: item.manifestPath, questionCount: run.questions.length, captureCount: current.length, status: 'BROWSER_RENDER_CAPTURE_ALREADY_PRESENT' });
    writeReport();
    continue;
  }
  const workdir = nextAttempt(`${item.workdir}/render-r63a`);
  try {
    const capture = await captureRender(ROOT, run, workdir, { channel: 'chromium' });
    run.evidence = [...(run.evidence ?? []), ...capture.captures];
    fs.writeFileSync(path.join(ROOT, item.manifestPath), `${JSON.stringify(run, null, 2)}\n`, 'utf8');
    runs.push({ runId: run.runId, manifestPath: item.manifestPath, questionCount: run.questions.length, captureCount: capture.captures.length, captureReport: `${workdir}/capture-report.json`, status: 'BROWSER_RENDER_CAPTURED' });
  } catch (error) {
    errors.push({ runId: run.runId, manifestPath: item.manifestPath, workdir, error: error.message });
  }
  writeReport();
}
writeReport();
console.log(JSON.stringify({ status: errors.length ? 'BROWSER_RENDER_CAPTURE_PARTIAL_OR_FAIL' : 'BROWSER_RENDER_CAPTURE_MATERIALIZED_NO_REVIEW_PASS', workBatchId: PREPARATION.workBatchId, expectedRunCount: PREPARATION.runs.length, completedRunCount: runs.length, totalCaptureRecords: runs.reduce((sum, run) => sum + run.captureCount, 0), errors: errors.length }, null, 2));
