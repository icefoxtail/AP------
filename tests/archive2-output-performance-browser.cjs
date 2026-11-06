'use strict';

// Actual Chrome, serial before/after runs against the same real source bytes.
// Evidence contains only timing, identity, hashes and geometry, never source
// questions/answers/solutions, screenshots, DOM dumps or browser log text.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const H = require('./archive2-solution-loading-browser.cjs');

const root = path.resolve(__dirname, '..');
const baseSha = process.env.ARCHIVE_PERFORMANCE_BASE_SHA || '87d7a554448d8ecf9ab5a535f2ff5541b0c79a0a';
const profileOnly = process.env.ARCHIVE_PERFORMANCE_PROFILE_ONLY === '1';
const repeats = profileOnly ? 1 : Number(process.env.ARCHIVE_PERFORMANCE_REPEATS || 3);
const reportDir = path.resolve(process.env.ARCHIVE_PERFORMANCE_REPORT_DIR || path.join(os.tmpdir(), 'archive-output-performance'));
const suiteDeadline = Date.now() + 15 * 60 * 1000;
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const round = value => Number(Number(value).toFixed(2));
const fixtures = [
  { id: 'envelope50', kind: 'envelope', sources: H.sourceFiles },
  { id: 'images24', kind: 'original', sources: [H.sourceFiles[1]] },
  { id: 'long23', kind: 'original', sources: ['archive/exams/original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js'] },
  { id: 'ordinary', kind: 'original', sources: [H.sourceFiles[0]] }
];
const report = { schema: 'ARCHIVE_OUTPUT_PERFORMANCE_CHROME_V1', baselineSha: baseSha,
  profileOnly, repeats, rows: [], comparisons: [], failures: [], summaries: [],
  conditions: { viewport: { width: 1440, height: 1000 }, cpuThrottleRate: 1,
    networkCachePolicy: 'no-store', warmMeaning: 'same-document initialized assets and mode snapshots',
    p95Method: 'nearest rank; for fewer than 20 samples this is the observed maximum, not a population tail estimate',
    coordinateTolerancePx: 1, slowNetwork: { latencyMs: 100, downloadBytesPerSecond: 187500, uploadBytesPerSecond: 93750 } } };

function requireThat(value, code, details = {}) {
  if (!value) throw Object.assign(new Error(code), { code, details });
}
function safeError(error) {
  return { code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error?.code || '') ? error.code : 'OUTPUT_PERFORMANCE_FAILED',
    name: String(error?.name || 'Error'), messageSha256: hash(String(error?.message || '')),
    ...(error?.code && error.message === error.code ? { details: error.details || {} } : {}) };
}
function writeReport() {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'output-performance.json'), JSON.stringify(report, null, 2));
}
function timeLeft(cap = 90000) {
  const remaining = Math.min(cap, suiteDeadline - Date.now());
  requireThat(remaining > 0, 'PERFORMANCE_SUITE_TIME_BUDGET_EXCEEDED');
  return remaining;
}
async function bounded(work, cap = 90000) {
  let timer;
  try { return await Promise.race([work, new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error('PERFORMANCE_OPERATION_TIMEOUT'), { code: 'PERFORMANCE_OPERATION_TIMEOUT' })), timeLeft(cap));
  })]); } finally { clearTimeout(timer); }
}

function installProfile() {
  const profile = window.__outputPerformance = { adapters: [], runtimeReadyAt: null, envelopeReadyAt: null, operation: 0 };
  let api, envelopeReady;
  Object.defineProperty(window, '__AP_OUTPUT_RENDER_READY__', { configurable: true, get: () => envelopeReady, set(value) {
    envelopeReady = value;
    if (value?.pageCount) profile.envelopeReadyAt = performance.now();
  } });
  Object.defineProperty(window, 'APScreenRuntime', { configurable: true, get: () => api, set(value) {
    api = { ...value, create(adapter, ...args) {
      const timed = { ...adapter };
      for (const key of Object.keys(adapter)) {
        if (typeof adapter[key] !== 'function') continue;
        timed[key] = function (...parameters) {
          const start = performance.now();
          const operation = profile.operation;
          let recorded = false;
          const finish = () => {
            if (recorded) return;
            recorded = true;
            profile.adapters.push({ method: key, ms: performance.now() - start, operation,
              background: parameters[0]?.background === true });
          };
          if (key === 'onRequest') {
            const pending = parameters[0];
            Promise.resolve(pending).then(outcome => {
              if (outcome?.ok === true && window.__AP_RENDER_READY__ === pending) profile.runtimeReadyAt = performance.now();
            }, () => {});
          }
          try {
            const result = adapter[key].apply(this, parameters);
            if (result?.then) return result.finally(finish);
            finish(); return result;
          } catch (error) { finish(); throw error; }
        };
      }
      return value.create(timed, ...args);
    } };
  } });
}

async function documentEvidence(page) {
  return page.evaluate(async () => {
    const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('');
    const state = typeof AppState !== 'undefined' ? AppState : window.AppState;
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const area = document.getElementById('print-area');
    const attempt = runtime.inspect().attempts.at(-1);
    const profile = window.__outputPerformance;
    const envelope = window.__AP_OUTPUT_ENVELOPE__;
    const ready = window.__AP_OUTPUT_RENDER_READY__;
    const verified = window.__AP_OUTPUT_ENVELOPE_READY__;
    const expectedEnvelopeIdentity = value => !!value && value.outputRequestId === envelope?.outputRequestId &&
      value.payloadHash === envelope?.payloadHash && value.contractVersion === envelope?.contractVersion;
    const math = [...area.querySelectorAll('mjx-container')];
    const mathMarkup = math.map(node => node.innerHTML.replace(/MJX-\d+/g, 'MJX-N'));
    const clipping = [...area.querySelectorAll('.page *')].filter(node => {
      const style = getComputedStyle(node);
      return (['hidden', 'clip'].includes(style.overflowX) && node.scrollWidth > node.clientWidth + 3) ||
        (['hidden', 'clip'].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 3);
    });
    const pages = [...area.querySelectorAll('.page')];
    return {
      inputHash: await digest(JSON.stringify((state.data || []).map(q => ({ id: q.id,
        uid: q._sourceQuestionUid || q.sourceQuestionUid || q.questionUid || q.source_question_uid || '',
        content: q.content || q.question || '', choices: q.choices || [], answer: q.answer,
        solution: q.solution || q.explanation || q.sol || '', image: q.image || '', images: q.images || [],
        solutionImage: q.solutionImage || '', solutionImageLayout: q.solutionImageLayout || '' })))),
      mathMarkupHash: await digest(JSON.stringify(mathMarkup)),
      mathGeometry: math.map(node => ({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height) })),
      continuationCount: area.querySelectorAll('[data-continuation-of], [data-solution-trailing-rebalance]').length,
      clippingCount: clipping.length,
      pageOverflowCount: pages.filter(node => node.scrollHeight > node.clientHeight + 3 || node.scrollWidth > node.clientWidth + 3).length,
      envelope: envelope ? { present: true, mode: envelope.mode, questionCount: envelope.questionCount,
        verifiedIdentityMatches: expectedEnvelopeIdentity(verified), renderedIdentityMatches: expectedEnvelopeIdentity(ready),
        urlIdentityMatches: new URLSearchParams(location.search).get('outputRequestId') === envelope.outputRequestId,
        errorPresent: !!window.__AP_OUTPUT_RENDER_ERROR__ } : { present: false },
      cacheStatus: attempt?.cacheStatus || null, snapshotId: runtime.activeSnapshot?.snapshotId || null,
      attemptCount: runtime.inspect().attempts.length,
      phases: attempt?.metrics?.phases || {}, visibleReadyMs: attempt?.visibleReadyMs || null,
      runtimeReadyAt: profile.runtimeReadyAt, envelopeReadyAt: profile.envelopeReadyAt,
      adapters: profile.adapters.filter(item => item.operation === profile.operation),
      navigation: (() => { const item = performance.getEntriesByType('navigation')[0]; return item ? {
        domContentLoadedMs: item.domContentLoadedEventEnd, loadMs: item.loadEventEnd, responseEndMs: item.responseEnd } : null; })()
    };
  });
}

async function awaitInitialOutcome(page, strictEnvelope) {
  await page.waitForFunction(strict => {
    if (window.__AP_OUTPUT_RENDER_ERROR__) return true;
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const attempt = runtime?.inspect().attempts.at(-1);
    if (!runtime || runtime.busy || !['SUCCEEDED', 'FAILED'].includes(attempt?.state)) return false;
    return !strict || attempt.state === 'FAILED' || !!window.__AP_OUTPUT_RENDER_READY__;
  }, strictEnvelope, { timeout: timeLeft(), polling: 25 });
  return page.evaluate(async () => {
    if (window.__AP_OUTPUT_RENDER_ERROR__) return { ok: false, code: 'ENVELOPE_RENDER_FAILED' };
    const result = await window.__AP_RENDER_READY__;
    return { ok: result?.ok === true, code: result?.ok ? null : /^[A-Z][A-Z0-9_:-]{2,160}$/.test(result?.code || '') ? result.code : 'RENDER_FAILED' };
  });
}

async function openSession(browser, server, fixture, initialMode, slow) {
  const context = await browser.newContext({ viewport: report.conditions.viewport, serviceWorkers: 'block' });
  const errors = [];
  try {
    await context.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
    await context.addInitScript(H.installInstrumentation, { suppressRaf: false });
    await context.addInitScript(installProfile);
    const page = await context.newPage();
    page.setDefaultTimeout(timeLeft());
    page.on('pageerror', error => errors.push({ name: error.name, messageSha256: hash(error.message) }));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Performance.enable');
    const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(item => [item.name, item.value]));
    await page.goto(server.origin + '/__loading/seed.html', { waitUntil: 'domcontentloaded', timeout: timeLeft() });
    let url;
    if (fixture.kind === 'envelope') {
      await page.addScriptTag({ url: server.origin + '/archive/archive2-output-contract.js' });
      await page.addScriptTag({ url: server.origin + '/archive/archive2-output.js' });
      url = await page.evaluate(async ({ questions, mode }) => {
        const questionUids = questions.map(q => q.questionUid || q.source_question_uid || q._sourceQuestionUid || null);
        const envelope = await window.Archive2Output.publishOutputEnvelope({ sourceKind: 'archive2-mixed', sourceId: 'performance-real-50',
          mode, questionCount: questions.length, questionUids,
          meta: { title: '50문항 해설 로딩 검증', qpp: 4, includeQr: false, questionUids,
            printHeaderOptions: { title: '50문항 해설 로딩 검증' } }, questions });
        return window.Archive2Output.outputEnvelopeUrl('mixed_engine.html', new URL('/archive/workspace.html', location.href).href, envelope, { studio: true }).href;
      }, { questions: fixture.questions, mode: initialMode });
    } else if (fixture.kind === 'legacy') {
      await page.evaluate(questions => {
        localStorage.setItem('mixedQuestions_performance', JSON.stringify(questions));
        localStorage.setItem('mixedMeta_performance', JSON.stringify({ title: '50문항 해설 로딩 검증', qpp: 4, count: questions.length }));
      }, fixture.questions);
      url = `${server.origin}/archive/mixed_engine.html?key=performance&mode=${initialMode}&qpp=4`;
    } else {
      url = new URL('/archive/engine.html', server.origin);
      url.searchParams.set('data', fixture.sources[0].slice('archive/'.length));
      url.searchParams.set('mode', initialMode); url.searchParams.set('qpp', '4');
    }
    url = new URL(url);
    url.searchParams.set('assetBase', 'off'); url.searchParams.set('prewarm', '0');
    if (slow) {
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', { offline: false,
        latency: report.conditions.slowNetwork.latencyMs,
        downloadThroughput: report.conditions.slowNetwork.downloadBytesPerSecond,
        uploadThroughput: report.conditions.slowNetwork.uploadBytesPerSecond, connectionType: 'cellular3g' });
    }
    return { context, page, cdp, metrics, errors, url: url.href, fixture,
      async close() { await context.close(); } };
  } catch (error) { await context.close(); throw error; }
}

async function measureOperation(session, operation, label, repeat, network, first) {
  const { page, fixture } = session;
  const before = await session.metrics();
  let outcome, publicMs, alreadyVisible = false, previousAttempts = 0;
  if (first) {
    await page.goto(session.url, { waitUntil: 'domcontentloaded', timeout: timeLeft() });
    outcome = await awaitInitialOutcome(page, fixture.kind === 'envelope');
  } else {
    const result = await bounded(page.evaluate(async mode => {
      const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
      const state = typeof AppState !== 'undefined' ? AppState : window.AppState;
      const qa = window.__solutionLoadingQA;
      const profile = window.__outputPerformance;
      const oldArea = document.getElementById('print-area');
      const oldSnapshot = runtime.activeSnapshot;
      const previousAttempts = runtime.inspect().attempts.length;
      const previousMode = state.mode;
      profile.operation += 1; profile.runtimeReadyAt = null; profile.envelopeReadyAt = null;
      Object.assign(qa, { operationStart: performance.now(), targetMode: mode, firstBoxMs: null, previousArea: oldArea });
      const started = performance.now();
      let result;
      try { result = await window.switchMode(mode); }
      catch (error) { result = { ok: false, code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error?.code || '') ? error.code : 'PUBLIC_MODE_SWITCH_FAILED' }; }
      const elapsed = performance.now() - started;
      const newAttempts = runtime.inspect().attempts.length;
      const alreadyVisible = previousMode === mode && oldArea === document.getElementById('print-area') &&
        oldSnapshot === runtime.activeSnapshot && previousAttempts === newAttempts;
      return { outcome: { ok: result?.ok === true, code: result?.ok ? null : /^[A-Z][A-Z0-9_:-]{2,160}$/.test(result?.code || '') ? result.code : 'PUBLIC_MODE_SWITCH_FAILED' },
        publicMs: elapsed, alreadyVisible, previousAttempts };
    }, operation.mode));
    ({ outcome, publicMs, alreadyVisible, previousAttempts } = result);
  }
  const after = await session.metrics();
  const row = await H.capture(page, outcome);
  const evidence = await documentEvidence(page);
  if (first) publicMs = (fixture.kind === 'envelope' ? evidence.envelopeReadyAt : evidence.runtimeReadyAt) ?? row.engineElapsedMs;
  if (alreadyVisible) row.firstBoxMs = 0; // Same DOM was visible for the entire no-op; no new paint is claimed.
  Object.assign(row, { name: `${fixture.id}-${label}-${repeat}-${network}-${operation.id}`, fixture: fixture.id,
    label, repeat, network, operation: operation.id, initial: first, publicMs: round(publicMs),
    alreadyVisible, previousAttempts, ...evidence,
    cdp: Object.fromEntries(['LayoutCount', 'RecalcStyleCount', 'LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration', 'TaskDuration'].map(key =>
      [key.endsWith('Duration') ? key + 'Ms' : key, round(((after[key] || 0) - (before[key] || 0)) * (key.endsWith('Duration') ? 1000 : 1))])),
    pageErrors: session.errors.slice() });
  if (alreadyVisible) row.cacheStatus = 'UNCHANGED_ACTIVE';
  row.pass = false;
  report.rows.push(row);
  writeReport();
  H.assertReady(row, fixture.questions.length, row.name);
  requireThat(session.errors.length === 0, 'UNEXPECTED_BROWSER_ERROR', { errors: session.errors });
  if (row.envelope.present) requireThat(row.envelope.mode === operation.mode && row.envelope.verifiedIdentityMatches &&
    row.envelope.renderedIdentityMatches && row.envelope.urlIdentityMatches && !row.envelope.errorPresent,
    'ENVELOPE_IDENTITY_NOT_READY', { fixture: fixture.id, operation: operation.id, identity: row.envelope });
  const printStart = performance.now();
  row.printPreflight = await H.verifiedPreflight(page, row);
  row.printPreflightMs = round(performance.now() - printStart);
  row.pass = true;
  writeReport();
  console.log(JSON.stringify({ fixture: fixture.id, label, repeat, network, operation: operation.id, pass: true,
    publicMs: row.publicMs, firstBoxMs: round(row.firstBoxMs), cache: row.cacheStatus, mathMs: row.metrics.mathJaxTotalMs,
    mathCalls: row.metrics.mathJaxCalls, layoutMs: row.cdp.LayoutDurationMs, pages: row.pageCount,
    printMs: row.printPreflightMs, phases: row.phases,
    adaptersMs: row.adapters.reduce((total, item) => { total[item.method] = round((total[item.method] || 0) + item.ms); return total; }, {}) }));
  return row;
}

async function cycle(browser, server, fixture, label, repeat, { coldSolution = false, slow = false, legacy = false } = {}) {
  const network = slow ? 'slow' : 'normal';
  const operations = coldSolution ? [{ id: 'cold-sol', mode: 'sol' }] : [
    { id: 'cold-exam', mode: 'exam' }, { id: 'exam-sol', mode: 'sol' }, { id: 'sol-ans', mode: 'ans' },
    { id: 'ans-exam', mode: 'exam' }, { id: 'exam-sol-warm', mode: 'sol' }, { id: 'sol-ans-warm', mode: 'ans' },
    { id: 'same-ans', mode: 'ans' }
  ];
  const session = await openSession(browser, server, fixture, operations[0].mode, slow);
  const rows = [];
  try {
    for (let index = 0; index < operations.length; index += 1) {
      const row = await measureOperation(session, operations[index], label, repeat, network, index === 0);
      rows.push(row);
    }
  } finally { await session.close(); }
  return rows;
}

function compare(before, after) {
  const parity = H.compareRows(before, after);
  for (const key of ['inputHash', 'mathMarkupHash', 'clippingCount', 'pageOverflowCount', 'continuationCount'])
    requireThat(before[key] === after[key], 'EXTENDED_OUTPUT_PARITY_MISMATCH', { fixture: before.fixture, operation: before.operation, field: key });
  requireThat(before.mathGeometry.length === after.mathGeometry.length, 'MATH_GEOMETRY_COUNT_CHANGED');
  for (let index = 0; index < before.mathGeometry.length; index += 1) for (const axis of ['width', 'height'])
    requireThat(Math.abs(before.mathGeometry[index][axis] - after.mathGeometry[index][axis]) <= 1,
      'MATH_GEOMETRY_CHANGED', { fixture: before.fixture, operation: before.operation, index, axis });
  return { ...parity, fixture: before.fixture, operation: before.operation, repeat: before.repeat, network: before.network, pass: true };
}

function summary(values) {
  const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return { n: sorted.length, medianMs: round(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2),
    p95Ms: round(sorted[Math.ceil(sorted.length * 0.95) - 1]), minMs: round(sorted[0]), maxMs: round(sorted.at(-1)) };
}
function summarize() {
  const groups = new Map();
  for (const row of report.rows.filter(row => row.pass)) {
    const key = [row.fixture, row.network, row.operation].join(':');
    if (!groups.has(key)) groups.set(key, { fixture: row.fixture, network: row.network, operation: row.operation, baseline: [], current: [] });
    groups.get(key)[row.label].push(row);
  }
  return [...groups.values()].map(group => {
    const metrics = {};
    for (const [name, getter] of Object.entries({ publicMs: row => row.publicMs, firstVisibleMs: row => row.firstBoxMs,
      mathMs: row => row.alreadyVisible ? 0 : row.metrics.mathJaxTotalMs,
      layoutMs: row => row.cdp.LayoutDurationMs, printPreflightMs: row => row.printPreflightMs })) {
      const baseline = summary(group.baseline.map(getter)), current = summary(group.current.map(getter));
      metrics[name] = { baseline, current,
        deltaMs: baseline && current ? round(current.medianMs - baseline.medianMs) : null,
        improvementPercent: baseline && current && baseline.medianMs > 0 ? round((baseline.medianMs - current.medianMs) / baseline.medianMs * 100) : null };
    }
    return { fixture: group.fixture, operation: group.operation, network: group.network, metrics,
      cache: { baseline: group.baseline.map(row => row.cacheStatus), current: group.current.map(row => row.cacheStatus) } };
  });
}

async function main() {
  requireThat(/^[a-f0-9]{40}$/i.test(baseSha), 'EXACT_BASELINE_SHA_REQUIRED');
  requireThat(Number.isInteger(repeats) && repeats >= 1 && repeats <= 5, 'INVALID_REPEAT_COUNT');
  const chrome = process.env.CHROME_BIN;
  requireThat(chrome && fs.existsSync(chrome), 'REAL_CHROME_BIN_REQUIRED');
  report.currentSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  report.playwrightVersion = require('playwright/package.json').version;
  for (const fixture of fixtures) fixture.questions = fixture.kind === 'envelope' ? H.realFixture(root) : H.loadBank(root, fixture.sources[0]);
  report.fixtures = fixtures.map(fixture => ({ id: fixture.id, kind: fixture.kind, questions: fixture.questions.length,
    inputSha256: hash(JSON.stringify(fixture.questions)), sources: fixture.sources.map(file => ({ file, sha256: hash(fs.readFileSync(path.join(root, file))) })) }));
  requireThat(fixtures[0].questions.length === 50, 'REAL_50_QUESTION_FIXTURE_CHANGED');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-output-performance-'));
  const baselineRoot = path.join(temp, 'baseline');
  let baselineServer, currentServer, browser, worktree = false;
  try {
    if (!profileOnly) {
      execFileSync('git', ['worktree', 'add', '--detach', baselineRoot, baseSha], { cwd: root, stdio: 'pipe', timeout: 120000 });
      worktree = true;
      baselineServer = await H.serve(baselineRoot, root);
    }
    currentServer = await H.serve(root);
    browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    report.chromeVersion = browser.version();
    for (let repeat = 1; repeat <= repeats; repeat += 1) {
      for (const fixture of fixtures) {
        const outputs = {};
        const labels = profileOnly ? ['current'] : repeat % 2 ? ['baseline', 'current'] : ['current', 'baseline'];
        for (const label of labels) {
          const server = label === 'baseline' ? baselineServer : currentServer;
          outputs[label] = await cycle(browser, server, fixture, label, repeat);
          if (fixture.kind === 'envelope') outputs[label].push(...await cycle(browser, server, fixture, label, repeat, { coldSolution: true }));
        }
        if (!profileOnly) for (let index = 0; index < outputs.baseline.length; index += 1)
          report.comparisons.push(compare(outputs.baseline[index], outputs.current[index]));
        writeReport();
      }
    }
    // A separate legacy session detects repeated clicks that never enter the
    // strict Archive2 wrapper. It is not substituted for the envelope benchmark.
    const legacy = { ...fixtures[0], id: 'legacy50', kind: 'legacy' };
    const legacyOutputs = {};
    for (const label of profileOnly ? ['current'] : ['baseline', 'current'])
      legacyOutputs[label] = await cycle(browser, label === 'baseline' ? baselineServer : currentServer, legacy, label, 1);
    if (!profileOnly) for (let index = 0; index < legacyOutputs.baseline.length; index += 1)
      report.comparisons.push(compare(legacyOutputs.baseline[index], legacyOutputs.current[index]));
    // Throttle actual first-page resources separately. One paired sample is
    // useful failure evidence, but cannot establish a reliable network P95.
    const slowOutputs = {};
    for (const label of profileOnly ? ['current'] : ['baseline', 'current'])
      slowOutputs[label] = await cycle(browser, label === 'baseline' ? baselineServer : currentServer, fixtures[0], label, 1, { coldSolution: true, slow: true });
    if (!profileOnly) report.comparisons.push(compare(slowOutputs.baseline[0], slowOutputs.current[0]));
    report.outputParity = profileOnly ? 'NOT_RUN' : 'PASS';
    report.pass = report.rows.length > 0 && report.rows.every(row => row.pass) && (profileOnly || report.comparisons.every(row => row.pass));
  } finally {
    await browser?.close(); await baselineServer?.close(); await currentServer?.close();
    if (worktree) execFileSync('git', ['worktree', 'remove', '--force', baselineRoot], { cwd: root, stdio: 'pipe', timeout: 30000 });
    fs.rmSync(temp, { recursive: true, force: true });
    report.summaries = summarize(); writeReport();
  }
  console.log(JSON.stringify({ schema: report.schema, pass: report.pass, profileOnly, cases: report.rows.length,
    comparisons: report.comparisons.length, outputParity: report.outputParity, chrome: report.chromeVersion }));
  if (!report.pass) process.exitCode = 1;
}

main().catch(error => {
  report.pass = false; report.failures.push(safeError(error)); report.summaries = summarize(); writeReport();
  console.error(JSON.stringify({ pass: false, failure: safeError(error) })); process.exitCode = 1;
});
