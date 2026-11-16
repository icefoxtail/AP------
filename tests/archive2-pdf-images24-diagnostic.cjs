'use strict';

// Bounded, current-only observation of the existing images24 PDF cycle.
// This entrypoint never runs or satisfies the release qualification gate.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const SCHEMA = 'archive-pdf-images24-diagnostic-only-v1';
const BUDGET_MS = 480000;
const CLEANUP_MS = 5000;
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const RELEASE_FLAGS = ['ARCHIVE_PERFORMANCE_PROFILE_ONLY', 'ARCHIVE_PERFORMANCE_PDF_ONLY',
  'ARCHIVE_PERFORMANCE_SKIP_PDF', 'ARCHIVE_PERFORMANCE_NETWORK_ONLY', 'ARCHIVE_PERFORMANCE_NETWORK_FIXTURE',
  'ARCHIVE_PERFORMANCE_REPEATS', 'ARCHIVE_PERFORMANCE_REPORT_DIR', 'ARCHIVE_PERFORMANCE_BASE_SHA'];

function requireThat(ok, code) {
  if (!ok) throw Object.assign(new Error(code), { code });
}
function safeError(error) {
  return { code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error?.code || '') ? error.code : 'PDF_DIAGNOSTIC_FAILED',
    name: String(error?.name || 'Error'), messageSha256: hash(String(error?.message || '')) };
}
function checkoutEvidence(actualCheckoutCommit, env = process.env) {
  const expectedCheckoutCommit = env.ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA;
  requireThat(typeof expectedCheckoutCommit === 'string' && /^[a-f0-9]{40}$/.test(expectedCheckoutCommit),
    'PDF_DIAGNOSTIC_EXPECTED_CHECKOUT_REQUIRED');
  requireThat(/^[a-f0-9]{40}$/.test(actualCheckoutCommit) && actualCheckoutCommit === expectedCheckoutCommit,
    'PDF_DIAGNOSTIC_EXACT_CHECKOUT_REQUIRED');
  // On pull_request, GITHUB_SHA names the event's merge commit even when
  // actions/checkout explicitly selects github.event.pull_request.head.sha.
  const githubEventCommit = env.GITHUB_SHA;
  requireThat(githubEventCommit === undefined || (typeof githubEventCommit === 'string' && /^[a-f0-9]{40}$/.test(githubEventCommit)),
    'PDF_DIAGNOSTIC_EVENT_SHA_INVALID');
  return { expectedCheckoutCommit, actualCheckoutCommit, githubEventCommit: githubEventCommit ?? null };
}
function diagnosticPlan(args, root, env = process.env) {
  const options = new Map();
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    requireThat(['--diagnostic-only', '--cycles', '--output'].includes(key) && !options.has(key), 'PDF_DIAGNOSTIC_ARGUMENTS');
    if (key === '--diagnostic-only') options.set(key, true);
    else {
      const value = args[++i];
      requireThat(typeof value === 'string' && value.length > 0 && !/[\x00-\x1f\x7f]/.test(value) && !value.startsWith('--'), 'PDF_DIAGNOSTIC_ARGUMENTS');
      options.set(key, value);
    }
  }
  requireThat(options.get('--diagnostic-only') === true, 'PDF_DIAGNOSTIC_EXPLICIT_ROLE_REQUIRED');
  const cycles = options.get('--cycles') || '2';
  requireThat(['2', '3'].includes(cycles), 'PDF_DIAGNOSTIC_CYCLE_BOUND');
  const output = options.get('--output');
  requireThat(typeof output === 'string' && path.isAbsolute(output), 'PDF_DIAGNOSTIC_OUTPUT_REQUIRED');
  root = path.resolve(root); const out = path.resolve(output);
  requireThat(out !== root && !out.startsWith(root + path.sep), 'PDF_DIAGNOSTIC_OUTPUT_OUTSIDE_CHECKOUT');
  requireThat(RELEASE_FLAGS.every(key => env[key] === undefined), 'PDF_DIAGNOSTIC_RELEASE_FLAGS_FORBIDDEN');
  return { schemaVersion: SCHEMA, diagnosticOnly: true, releaseGateStatus: 'NOT_RUN', canReplaceReleaseGate: false,
    fixture: 'images24', label: 'current', cycles: Number(cycles), operations: ['pdf-exam', 'pdf-sol', 'pdf-ans'],
    totalBudgetMs: BUDGET_MS, cleanupBudgetMs: CLEANUP_MS, releaseQualificationExpectedRows: 48, root, out };
}

function selectPinnedFixture(pinned) {
  requireThat(pinned && Array.isArray(pinned.fixtures) && typeof pinned.sourceOverlay === 'function', 'PDF_DIAGNOSTIC_QUALIFICATION_LOADER_REQUIRED');
  const rows = pinned.fixtures.filter(row => row.id === 'images24');
  requireThat(rows.length === 1, 'PDF_DIAGNOSTIC_UNIQUE_IMAGES24');
  const row = rows[0];
  requireThat(row.kind === 'original' && row.qpp === 4 && Array.isArray(row.questions) && row.questions.length === 24 &&
    /^[a-f0-9]{64}$/.test(row.inputSha256) && hash(JSON.stringify(row.questions)) === row.inputSha256,
  'PDF_DIAGNOSTIC_PINNED_INPUT_MISMATCH');
  requireThat(Array.isArray(row.sources) && row.sources.length === 1 && row.sources.every(source =>
    typeof source.file === 'string' && source.file.startsWith('archive/exams/original/') &&
    !source.file.includes('\\') && path.posix.normalize(source.file) === source.file && /^[a-f0-9]{64}$/.test(source.sha256)),
  'PDF_DIAGNOSTIC_SOURCE_INVENTORY');
  for (const source of row.sources) {
    const bytes = pinned.sourceOverlay('/' + source.file);
    requireThat(Buffer.isBuffer(bytes) && hash(bytes) === source.sha256, 'PDF_DIAGNOSTIC_SOURCE_BYTES_MISMATCH');
  }
  return { fixture: { ...row, sources: row.sources.map(source => source.file) },
    evidence: { id: row.id, kind: row.kind, qpp: row.qpp, questionCount: row.questions.length,
      inputSha256: row.inputSha256, sources: clone(row.sources) } };
}

function summarizeObservation(plan, observation, completedCycles, error, timedOut) {
  const cycles = observation.cycles || [], rows = observation.pdfRows || [], failures = observation.failures || [];
  requireThat([cycles, rows, failures].every(Array.isArray), 'PDF_DIAGNOSTIC_OBSERVATION_SHAPE');
  requireThat(cycles.length <= plan.cycles && rows.length <= plan.cycles * 3 && [...cycles, ...rows, ...failures].every(row =>
    row.fixture === 'images24' && row.label === 'current' && row.purpose === 'pdf' && row.network === 'normal' &&
    Number.isInteger(row.repeat) && row.repeat >= 1 && row.repeat <= plan.cycles),
  'PDF_DIAGNOSTIC_OBSERVATION_SCOPE');
  requireThat(cycles.every(row => Array.isArray(row.operations) && JSON.stringify(row.operations) === JSON.stringify(plan.operations)),
    'PDF_DIAGNOSTIC_UNCHANGED_CYCLE_REQUIRED');
  requireThat(new Set(cycles.map(row => row.repeat)).size === cycles.length, 'PDF_DIAGNOSTIC_DUPLICATE_CYCLE');
  for (const cycle of cycles) {
    const cycleRows = rows.filter(row => row.repeat === cycle.repeat);
    requireThat(Number.isInteger(cycle.completed) && cycle.completed >= 0 && cycle.completed <= 3 &&
      cycleRows.every((row, index) => row.operation === plan.operations[index]) &&
      (cycle.pass === true ? cycle.completed === 3 && cycleRows.length === 3 && cycleRows.every(row => row.pass === true) :
        cycle.pass === false && cycleRows.length >= cycle.completed && cycleRows.length <= cycle.completed + 1),
    'PDF_DIAGNOSTIC_CYCLE_ROW_INVENTORY');
  }
  const failureReproduced = failures.length > 0 || cycles.some(row => row.pass === false);
  const complete = !error && !timedOut && completedCycles === plan.cycles && cycles.length === plan.cycles;
  return { schemaVersion: SCHEMA, status: 'DIAGNOSTIC_ONLY', releaseGateStatus: 'NOT_RUN', canReplaceReleaseGate: false,
    releaseQualificationExpectedRows: 48, fixture: 'images24', label: 'current', expectedCycles: plan.cycles,
    completedCycles, complete, failureReproduced,
    observation: timedOut ? 'DIAGNOSTIC_TIMEOUT' : !complete ? 'DIAGNOSTIC_INCOMPLETE' : failureReproduced ? 'FAILURE_REPRODUCED' : 'NO_FAILURE_OBSERVED',
    operationsPerCycle: plan.operations, budgetMs: plan.totalBudgetMs, ...(error ? { error: safeError(error) } : {}),
    cycles: clone(cycles), rows: clone(rows), failures: clone(failures),
    baselineComparison: 'NOT_RUN', fixtureBytesChanged: false, thresholdsChanged: false,
    normalizationChanged: false, fullReleaseGateReplaced: false };
}

async function runDiagnostic(plan, deps, clock = { setTimeout, clearTimeout }) {
  requireThat(plan?.schemaVersion === SCHEMA && plan.diagnosticOnly === true && plan.canReplaceReleaseGate === false &&
    plan.releaseGateStatus === 'NOT_RUN' && ['images24'].includes(plan.fixture) && plan.label === 'current' &&
    [2, 3].includes(plan.cycles) && plan.totalBudgetMs === BUDGET_MS && plan.cleanupBudgetMs === CLEANUP_MS &&
    JSON.stringify(plan.operations) === JSON.stringify(['pdf-exam', 'pdf-sol', 'pdf-ans']), 'PDF_DIAGNOSTIC_PLAN_REQUIRED');
  let server, browser, stopped = false, timedOut = false, timer, completedCycles = 0, error = null, binding;
  const closed = new Set();
  const closeOnce = resource => {
    if (!resource || closed.has(resource)) return Promise.resolve();
    closed.add(resource); return Promise.resolve().then(() => resource.close());
  };
  const work = (async () => {
    const pinned = await deps.loadFixtures(plan.root);
    binding = selectPinnedFixture(pinned);
    requireThat(!stopped, 'PDF_DIAGNOSTIC_CANCELLED');
    server = await deps.serve(plan.root, plan.root, pinned.sourceOverlay);
    if (stopped) await closeOnce(server);
    requireThat(!stopped, 'PDF_DIAGNOSTIC_CANCELLED');
    browser = await deps.launch();
    if (stopped) await closeOnce(browser);
    for (let repeat = 1; repeat <= plan.cycles; repeat++) {
      requireThat(!stopped, 'PDF_DIAGNOSTIC_CANCELLED');
      // Reuse the exact existing sequence and guards, including exam→sol→ans.
      await deps.cycle(browser, server, binding.fixture, 'current', repeat, { pdf: true });
      requireThat(!stopped, 'PDF_DIAGNOSTIC_CANCELLED');
      completedCycles++;
    }
    assert.deepEqual(selectPinnedFixture(pinned).evidence, binding.evidence, 'PDF_DIAGNOSTIC_INPUT_CHANGED');
  })();
  try {
    await Promise.race([work, new Promise((_resolve, reject) => {
      timer = clock.setTimeout(() => { timedOut = true; stopped = true;
        reject(Object.assign(new Error('PDF_DIAGNOSTIC_TOTAL_TIMEOUT'), { code: 'PDF_DIAGNOSTIC_TOTAL_TIMEOUT' })); }, BUDGET_MS);
    })]);
  } catch (caught) { error = caught; }
  finally {
    stopped = true; clock.clearTimeout(timer);
    let cleanupTimer;
    try {
      const cleanup = await Promise.race([Promise.allSettled([closeOnce(browser), closeOnce(server)]),
        new Promise(resolve => { cleanupTimer = clock.setTimeout(() => resolve(null), CLEANUP_MS); })]);
      if (cleanup === null) error ||= Object.assign(new Error('PDF_DIAGNOSTIC_CLEANUP_TIMEOUT'), { code: 'PDF_DIAGNOSTIC_CLEANUP_TIMEOUT' });
      else if (cleanup.some(row => row.status === 'rejected')) error ||= Object.assign(new Error('PDF_DIAGNOSTIC_CLEANUP_FAILED'), { code: 'PDF_DIAGNOSTIC_CLEANUP_FAILED' });
    }
    finally { clock.clearTimeout(cleanupTimer); }
  }
  let observed = {};
  try { observed = deps.observe(); }
  catch (caught) { error ||= caught; }
  const result = summarizeObservation(plan, observed, completedCycles, error, timedOut);
  return { ...result, ...(binding ? { verifiedFixture: binding.evidence } : {}),
    chromeVersion: browser?.version?.() || null };
}

function productionDependencies(plan) {
  const recordDir = path.join(plan.out, 'diagnostic-cycle-records');
  fs.mkdirSync(recordDir);
  // These environment values only configure an imported helper's private
  // report destination. Its main(), PDF_ONLY selection and 48-row plan are not run.
  process.env.ARCHIVE_PERFORMANCE_PDF_ONLY = '1';
  process.env.ARCHIVE_PERFORMANCE_REPORT_DIR = recordDir;
  let helper;
  try { helper = require('./archive2-output-performance-browser.cjs'); }
  finally { delete process.env.ARCHIVE_PERFORMANCE_PDF_ONLY; delete process.env.ARCHIVE_PERFORMANCE_REPORT_DIR; }
  const H = require('./archive2-solution-loading-browser.cjs');
  const { loadQualificationFixtures } = require('./archive2-output-qualification-fixtures.cjs');
  const { chromium } = require('playwright');
  return { loadFixtures: loadQualificationFixtures, serve: H.serve, cycle: helper.cycle,
    launch: () => chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'] }),
    observe: () => {
      const file = path.join(recordDir, 'output-performance.json');
      if (!fs.existsSync(file)) return {};
      const bytes = fs.readFileSync(file);
      fs.renameSync(file, path.join(recordDir, 'diagnostic-cycle-records.json'));
      return JSON.parse(bytes);
    } };
}

async function main() {
  const root = path.resolve(__dirname, '..'), plan = diagnosticPlan(process.argv.slice(2), root);
  requireThat(process.env.CHROME_BIN && path.isAbsolute(process.env.CHROME_BIN) && fs.statSync(process.env.CHROME_BIN).isFile(), 'PDF_DIAGNOSTIC_REAL_CHROME_REQUIRED');
  for (let current = plan.out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) requireThat(!fs.lstatSync(current).isSymbolicLink(), 'PDF_DIAGNOSTIC_OUTPUT_SYMLINK');
  requireThat(!fs.existsSync(plan.out) || fs.readdirSync(plan.out).length === 0, 'PDF_DIAGNOSTIC_EMPTY_OUTPUT_REQUIRED');
  fs.mkdirSync(plan.out, { recursive: true });
  const currentCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const checkout = checkoutEvidence(currentCommit, process.env);
  const codePaths = ['tests/archive2-pdf-images24-diagnostic.cjs', 'tests/archive2-output-performance-browser.cjs',
    'tests/archive2-output-qualification-fixtures.cjs', 'tests/archive2-output-release-qualification.cjs',
    'tests/archive2-output-comparison-references.json', 'tests/archive2-solution-loading-browser.cjs'];
  const code = codePaths.map(file => {
    requireThat(fs.lstatSync(path.join(root, file)).isFile(), 'PDF_DIAGNOSTIC_CODE_REGULAR_FILE');
    const bytes = fs.readFileSync(path.join(root, file));
    const gitBlobSha1 = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
    const expected = execFileSync('git', ['rev-parse', 'HEAD:' + file], { cwd: root, encoding: 'utf8' }).trim();
    requireThat(gitBlobSha1 === expected, 'PDF_DIAGNOSTIC_CODE_NOT_EXACT_CHECKOUT');
    return { path: file, sha256: hash(bytes), gitBlobSha1, bytes: bytes.length };
  });
  const result = { ...await runDiagnostic(plan, productionDependencies(plan)), currentCommit, checkout, code };
  for (const ref of code) requireThat(hash(fs.readFileSync(path.join(root, ref.path))) === ref.sha256, 'PDF_DIAGNOSTIC_CODE_CHANGED');
  fs.writeFileSync(path.join(plan.out, 'pdf-images24-diagnostic.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ status: result.status, observation: result.observation,
    expectedCycles: result.expectedCycles, completedCycles: result.completedCycles, releaseGateStatus: result.releaseGateStatus,
    canReplaceReleaseGate: false }));
  if (!result.complete || result.failureReproduced) process.exitCode = 1;
}

module.exports = { SCHEMA, BUDGET_MS, CLEANUP_MS, RELEASE_FLAGS, checkoutEvidence, diagnosticPlan, selectPinnedFixture,
  summarizeObservation, runDiagnostic, safeError };
if (require.main === module) main().catch(error => {
  console.error(JSON.stringify({ status: 'DIAGNOSTIC_ONLY', releaseGateStatus: 'NOT_RUN', canReplaceReleaseGate: false, error: safeError(error) }));
  process.exitCode = 1;
});
