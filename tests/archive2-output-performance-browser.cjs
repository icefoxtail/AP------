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
const { inspectPdf } = require('./archive2-output-pdf-evidence.cjs');
const { loadQualificationFixtures } = require('./archive2-output-qualification-fixtures.cjs');

const root = path.resolve(__dirname, '..');
const baseSha = process.env.ARCHIVE_PERFORMANCE_BASE_SHA || require('./archive2-output-comparison-references.json').performanceReference;
const profileOnly = process.env.ARCHIVE_PERFORMANCE_PROFILE_ONLY === '1';
const pdfOnly = process.env.ARCHIVE_PERFORMANCE_PDF_ONLY === '1';
const skipPdf = process.env.ARCHIVE_PERFORMANCE_SKIP_PDF === '1';
const networkOnly = process.env.ARCHIVE_PERFORMANCE_NETWORK_ONLY === '1';
const networkFixtureId = process.env.ARCHIVE_PERFORMANCE_NETWORK_FIXTURE || null;
const phase = networkOnly ? 'network-completion' : pdfOnly ? 'pdf' : skipPdf ? 'performance' : 'all';
const repeats = networkOnly || pdfOnly || profileOnly ? 1 : Number(process.env.ARCHIVE_PERFORMANCE_REPEATS || 3);
const reportDir = path.resolve(process.env.ARCHIVE_PERFORMANCE_REPORT_DIR || path.join(os.tmpdir(), 'archive-output-performance'));
const suiteBudgetMinutes = networkOnly ? 20 : 25;
const operationTimeoutMs = networkOnly ? 480000 : 90000;
const suiteDeadline = Date.now() + suiteBudgetMinutes * 60 * 1000;
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const round = value => Number(Number(value).toFixed(2));
const operationsByCycle = {
  performance: [{ id: 'cold-exam', mode: 'exam' }, { id: 'exam-sol', mode: 'sol' }, { id: 'sol-ans', mode: 'ans' },
    { id: 'ans-exam', mode: 'exam' }, { id: 'exam-sol-warm', mode: 'sol' }, { id: 'sol-ans-warm', mode: 'ans' },
    { id: 'same-ans', mode: 'ans' }],
  coldSolution: [{ id: 'cold-sol', mode: 'sol' }],
  continuation: [{ id: 'cold-sol', mode: 'sol' }, { id: 'sol-ans', mode: 'ans' }, { id: 'ans-sol-warm', mode: 'sol' }],
  pdf: [{ id: 'pdf-exam', mode: 'exam' }, { id: 'pdf-sol', mode: 'sol' }, { id: 'pdf-ans', mode: 'ans' }],
  network: [{ id: 'cold-sol', mode: 'sol' }, { id: 'sol-ans', mode: 'ans' }, { id: 'ans-exam', mode: 'exam' },
    { id: 'exam-sol-warm', mode: 'sol' }, { id: 'same-sol', mode: 'sol' }]
};
const report = { schema: 'ARCHIVE_OUTPUT_PERFORMANCE_CHROME_V1', baselineSha: baseSha,
  profileOnly, phase, repeats, networkFixtureId, rows: [], comparisons: [], networkComparisons: [], pdfRows: [], pdfComparisons: [], failures: [], cycles: [], summaries: [],
  conditions: { viewport: { width: 1440, height: 1000 }, cpuThrottleRate: 1,
    suiteBudgetMinutes, operationTimeoutMs,
    timeoutScope: networkOnly ? '480s total cold navigation plus render observation, and per warm public operation; product gates unchanged' : '90s per existing navigation/readiness wait; product gates unchanged',
    networkCompletionPurpose: networkOnly ? 'one paired complete cold solution load followed by warm mode switches; not a network P95 estimate' : null,
    networkTransport: networkOnly ? 'identity/no-store stress' : 'identity/no-store unthrottled',
    responseEncoding: 'local static server without compression; production gzip transfer is a separate observation',
    slowNetworkCoverage: 'Dedicated NETWORK_ONLY jobs cover envelope50-qpp1 and envelope8. Normal performance and PDF phases contain no slow-network experiments; historical 90s timeout artifacts remain separate evidence.',
    networkCachePolicy: 'no-store', warmMeaning: 'same-document initialized assets and mode snapshots',
    p95Method: 'nearest rank; for fewer than 20 samples this is the observed maximum, not a population tail estimate',
    coordinateTolerancePx: 1, slowNetwork: { latencyMs: 100, downloadBytesPerSecond: 187500, uploadBytesPerSecond: 93750 } } };

function requireThat(value, code, details = {}) {
  if (!value) throw Object.assign(new Error(code), { code, details });
}
function safeError(error) {
  const details = {};
  if (error?.code && error.message === error.code) for (const [key, value] of Object.entries(error.details || {})) {
    if (Array.isArray(value)) {
      details[key + 'Count'] = value.length;
      details[key + 'Sha256'] = hash(JSON.stringify(value));
    } else details[key] = value;
  }
  return { code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error?.code || '') ? error.code : 'OUTPUT_PERFORMANCE_FAILED',
    name: String(error?.name || 'Error'), messageSha256: hash(String(error?.message || '')),
    ...(Object.keys(details).length ? { details } : {}) };
}
function writeReport() {
  updateCoverage();
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'output-performance.json'), JSON.stringify(report, null, 2));
}
function planCoverage(fixtures, legacy, golden) {
  const labels = profileOnly ? ['current'] : ['baseline', 'current'];
  const measurements = [];
  const add = (fixture, repeat, purpose, network, operations) => {
    for (const operation of operations) measurements.push({ purpose, fixture: fixture.id, qpp: fixture.qpp || 4,
      repeat, network, operation: operation.id, mode: operation.mode, labels });
  };
  if (networkOnly) add(fixtures.find(item => item.id === networkFixtureId), 1, 'network', 'slow-complete', operationsByCycle.network);
  if (!pdfOnly && !networkOnly) {
    for (let repeat = 1; repeat <= repeats; repeat += 1) for (const fixture of fixtures) {
      add(fixture, repeat, 'performance', 'normal', operationsByCycle.performance);
      if (fixture.kind === 'envelope') add(fixture, repeat, 'performance', 'normal', operationsByCycle.coldSolution);
    }
    add(legacy, 1, 'performance', 'normal', operationsByCycle.performance);
    add(golden, 1, 'performance', 'normal', operationsByCycle.continuation);
  }
  if (!skipPdf && !networkOnly) for (const fixture of [...fixtures, legacy, golden])
    add(fixture, 1, 'pdf', 'normal', operationsByCycle.pdf);
  report.coverage = { schema: 'ARCHIVE_OUTPUT_PERFORMANCE_COVERAGE_V1', phase,
    networkTransport: report.conditions.networkTransport, measurements,
    plannedRows: measurements.reduce((sum, item) => sum + item.labels.length, 0),
    plannedPairs: profileOnly ? 0 : measurements.length,
    explanation: 'A captured failure is observed coverage, never a passing result. Missing operations after a failed mode remain listed as blocked; they are not treated as passed.' };
  updateCoverage();
}
function updateCoverage() {
  if (!report.coverage) return;
  const rows = [...report.rows, ...report.pdfRows];
  const comparisons = { performance: report.comparisons, network: report.networkComparisons, pdf: report.pdfComparisons };
  const matches = (observed, expected) => observed.fixture === expected.fixture && observed.repeat === expected.repeat &&
    observed.network === expected.network && observed.operation === expected.operation;
  const missingRows = [], missingPairs = [], duplicateRows = [], duplicatePairs = [];
  for (const expected of report.coverage.measurements) {
    for (const label of expected.labels) {
      const observed = rows.filter(row => row.purpose === expected.purpose && row.label === label && matches(row, expected));
      const identity = { purpose: expected.purpose, fixture: expected.fixture, repeat: expected.repeat,
        network: expected.network, operation: expected.operation, label };
      if (!observed.length) {
        const failedCycle = report.cycles.find(cycle => cycle.fixture === expected.fixture && cycle.repeat === expected.repeat &&
          cycle.network === expected.network && cycle.purpose === expected.purpose && cycle.label === label &&
          cycle.operations.includes(expected.operation) && cycle.failedOperation);
        missingRows.push({ ...identity, status: failedCycle ? 'BLOCKED_OR_FAILED_BEFORE_CAPTURE' : 'NOT_OBSERVED',
          ...(failedCycle ? { precedingFailure: { operation: failedCycle.failedOperation, code: failedCycle.error?.code } } : {}) });
      } else if (observed.length !== 1) duplicateRows.push({ ...identity, count: observed.length });
    }
    if (!profileOnly) {
      const observed = comparisons[expected.purpose].filter(row => matches(row, expected));
      const identity = { purpose: expected.purpose, fixture: expected.fixture, repeat: expected.repeat,
        network: expected.network, operation: expected.operation };
      if (!observed.length) missingPairs.push(identity);
      else if (observed.length !== 1) duplicatePairs.push({ ...identity, count: observed.length });
    }
  }
  Object.assign(report.coverage, { observedRows: rows.length,
    observedPairs: Object.values(comparisons).reduce((sum, items) => sum + items.length, 0),
    missingRows, missingPairs, duplicateRows, duplicatePairs,
    complete: !missingRows.length && !missingPairs.length && !duplicateRows.length && !duplicatePairs.length });
}
function timeLeft(cap = operationTimeoutMs) {
  const remaining = Math.min(cap, suiteDeadline - Date.now());
  requireThat(remaining > 0, 'PERFORMANCE_SUITE_TIME_BUDGET_EXCEEDED');
  return remaining;
}
async function bounded(work, cap = operationTimeoutMs) {
  let timer;
  try { return await Promise.race([work, new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error('PERFORMANCE_OPERATION_TIMEOUT'), { code: 'PERFORMANCE_OPERATION_TIMEOUT' })), timeLeft(cap));
  })]); } finally { clearTimeout(timer); }
}

function installProfile({ observeImageWaits = false } = {}) {
  const profile = window.__outputPerformance = { adapters: [], runtimeReadyAt: null, envelopeReadyAt: null, operation: 0,
    metadata: { promisePresent: false, settled: false, fulfilled: null }, imageBuildFailures: [] };
  const imageWaitErrors = new WeakMap(), imageWaitResults = new WeakMap();
  if (observeImageWaits) {
    let readiness;
    Object.defineProperty(window, 'APQuestionImageReadiness', { configurable: true, get: () => readiness, set(value) {
      const observed = { ...value };
      for (const method of ['waitForImages', 'waitForImage']) {
        observed[method] = function (...args) {
          const suppliedTimeout = method === 'waitForImages' ? args[1]?.timeoutMs : args[1];
          const requested = Number(suppliedTimeout ?? value.DEFAULT_TIMEOUT_MS);
          const wait = { method, timeoutMs: Number.isFinite(requested) ? Math.max(0, requested) : value.DEFAULT_TIMEOUT_MS,
            startedAtMs: performance.now(),
            images: method === 'waitForImage' ? [args[0]] : Array.isArray(args[0]) ? args[0].slice() : null };
          // Observe the real wait and return its exact value/error. No image,
          // timeout, listener, decoding operation or product decision changes.
          return value[method].apply(this, args).then(result => {
            const results = method === 'waitForImages' ? result.results : [result];
            for (const item of results || []) if (item && typeof item === 'object') imageWaitResults.set(item, wait);
            return result;
          }, error => {
            if (error && typeof error === 'object') imageWaitErrors.set(error, wait);
            throw error;
          });
        };
      }
      readiness = Object.freeze(observed);
    } });
  }
  const observeBuildImageFailure = (error, ctx, startedAtMs, operation) => {
    if (!observeImageWaits || !['QUESTION_IMAGE_READINESS_INCOMPLETE', 'QUESTION_IMAGE_LOAD_FAILED', 'IMAGE_READINESS_INCOMPLETE'].includes(error?.code)) return;
    try {
      const results = error.details?.results;
      if (!Array.isArray(results)) return;
      const firstUnreadyIndex = results.findIndex(item => item.status !== 'loaded');
      const wait = imageWaitErrors.get(error) || imageWaitResults.get(results[firstUnreadyIndex]);
      const candidates = [...(ctx?.stagingHost?.querySelectorAll('img') || []), ...(ctx?.targetArea?.querySelectorAll('img') || [])];
      const capturedAtMs = performance.now();
      profile.imageBuildFailures.push({ operation, attemptedMode: ctx?.input?.mode || ctx?.candidate?.mode || null,
        qpp: ctx?.buildState?.qpp || null, code: error.code, buildElapsedMs: capturedAtMs - startedAtMs,
        wait: wait ? { method: wait.method, timeoutMs: wait.timeoutMs, elapsedMs: capturedAtMs - wait.startedAtMs } : null,
        summary: Object.fromEntries(['images', 'loaded', 'errors', 'timeouts'].map(key => [key, Number(error.details.summary?.[key])])),
        firstUnreadyIndex,
        results: results.map((result, index) => {
          const source = String(result.src || '');
          const image = wait?.images?.[index] || candidates.find(node => String(node.currentSrc || node.src || '') === source);
          return { index, status: ['loaded', 'pending', 'timeout', 'error'].includes(result.status) ? result.status : 'OTHER',
            reason: /^[A-Z][A-Z0-9_]+$/.test(result.reason || '') ? result.reason : null,
            sourceRef: image?.closest('[data-source-ref]')?.dataset.sourceRef || null,
            // URL remains only in this page; documentEvidence hashes it before
            // exporting, after the runtime has preserved its previous output.
            imageSourceValue: source || String(image?.currentSrc || image?.src || ''),
            naturalWidth: Number(result.naturalWidth ?? image?.naturalWidth) || 0,
            naturalHeight: Number(result.naturalHeight ?? image?.naturalHeight) || 0,
            completeAtFailure: image ? image.complete === true : null,
            inStagingHost: !!image && !!ctx.stagingHost?.contains(image),
            inTargetArea: !!image && !!ctx.targetArea?.contains(image) };
        }) });
    } catch (_) {
      // A diagnostic must not replace the real exception or turn it into PASS.
      profile.imageBuildFailures.push({ operation, code: error.code, diagnosticCaptureFailed: true });
    }
  };
  profile.classifyError = async error => {
    const message = String(error?.message || '');
    const messageSha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))), byte => byte.toString(16).padStart(2, '0')).join('');
    const known = [
      [/^PDF readiness failed: content clipped inside (\d+) element\(s\)\.$/, 'PDF_CONTENT_CLIPPED'],
      [/^PDF readiness failed: layout overflow detected on (\d+) page\(s\)\.$/, 'PDF_LAYOUT_OVERFLOW'],
      [/^PDF readiness failed: (?:verified envelope|rendered output) does not match the requested envelope\.$/, 'PDF_ENVELOPE_IDENTITY_MISMATCH'],
      [/^(?:PDF readiness failed: )?required image (\d+) (?:is unavailable|failed to load)\.$/, 'PDF_IMAGE_UNAVAILABLE'],
      [/^(?:PDF readiness failed: )?(?:render|font|MathJax|MathJax startup|image) readiness timed out\.$/, 'PDF_READINESS_TIMEOUT'],
      [/^PDF readiness failed: math typesetting is incomplete\.$/, 'PDF_MATH_INCOMPLETE']
    ];
    let code = /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error?.code || '') ? error.code :
      /^[A-Z][A-Z0-9_:-]{2,160}$/.test(message) ? message : 'PUBLIC_MODE_SWITCH_FAILED';
    let count;
    for (const [pattern, classified] of known) {
      const match = pattern.exec(message);
      if (!match) continue;
      code = classified;
      if (match[1] && /^\d+$/.test(match[1])) count = Number(match[1]);
      break;
    }
    return { code, name: String(error?.name || 'Error'), messageSha256, ...(count === undefined ? {} : { count }) };
  };
  let api, envelopeReady, metadataReady;
  Object.defineProperty(window, '__ARCHIVE_METADATA_READY__', { configurable: true, get: () => metadataReady, set(value) {
    metadataReady = value;
    const observation = profile.metadata = { promisePresent: !!value?.then, settled: false, fulfilled: null,
      assignedAtMs: performance.now() };
    Promise.resolve(value).then(result => {
      Object.assign(observation, { settled: true, fulfilled: true, resolvedNull: result == null,
        settledAtMs: performance.now(), recordsCount: Array.isArray(result?.records) ? result.records.length : 0 });
    }, error => {
      Object.assign(observation, { settled: true, fulfilled: false, settledAtMs: performance.now(),
        rejectionName: /^[A-Za-z][A-Za-z0-9]*$/.test(error?.name || '') ? error.name : 'Error' });
    });
  } });
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
            if (key === 'build' && result?.then) return result.then(value => { finish(); return value; }, error => {
              finish(); observeBuildImageFailure(error, parameters[0], start, operation); throw error;
            });
            if (result?.then) return result.finally(finish);
            finish(); return result;
          } catch (error) {
            finish();
            if (key === 'build') observeBuildImageFailure(error, parameters[0], start, operation);
            throw error;
          }
        };
      }
      return value.create(timed, ...args);
    } };
  } });
}

function installRetainedVisibilityObservation() {
  // Observe the existing view only for same-mode requests. This supplements
  // the new-root observer; it never changes rendering or readiness decisions.
  window.__observeRetainedOutputVisibility = mode => {
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const oldArea = document.getElementById('print-area');
    const oldSnapshot = runtime?.activeSnapshot;
    const oldCell = oldArea?.querySelector('.q-box,.ans-cell:not(.ans-cell-empty)');
    const currentMode = () => (typeof AppState !== 'undefined' ? AppState : window.AppState)?.mode;
    if (currentMode() !== mode || !oldArea || !oldCell || oldSnapshot?.rootNode !== oldArea) return null;
    const observedAtOperationMs = performance.now() - window.__solutionLoadingQA.operationStart;
    let observations = 0, frameObservations = 0, mutationObservations = 0;
    let allObservedVisible = true, preservedIdentity = true, firstFailure = null;
    const sample = phase => {
      const area = document.getElementById('print-area');
      const cell = area?.querySelector('.q-box,.ans-cell:not(.ans-cell-empty)');
      const box = cell?.getBoundingClientRect();
      let visible = !!cell?.isConnected && !!area?.isConnected;
      for (let node = cell; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility !== 'visible' || Number(style.opacity) === 0 ||
          style.contentVisibility === 'hidden') visible = false;
      }
      const value = { mode: currentMode(), rootPreserved: area === oldArea,
        snapshotPreserved: runtime.activeSnapshot === oldSnapshot && oldSnapshot.rootNode === area,
        cellPreserved: !!cell && cell === oldCell, visible,
        x: box?.x || 0, y: box?.y || 0, width: box?.width || 0, height: box?.height || 0,
        inViewport: !!box && box.right > 0 && box.bottom > 0 && box.left < innerWidth && box.top < innerHeight };
      const identity = value.mode === mode && value.rootPreserved && value.snapshotPreserved && value.cellPreserved;
      const pixels = value.visible && value.inViewport && value.width > 0 && value.height > 0;
      observations += 1;
      if (phase === 'frame') frameObservations += 1;
      if (phase === 'mutation') mutationObservations += 1;
      allObservedVisible &&= pixels;
      preservedIdentity &&= identity;
      if ((!identity || !pixels) && !firstFailure) firstFailure = { phase, ...value };
      return value;
    };
    const before = sample('before');
    const observer = new MutationObserver(() => sample('mutation'));
    observer.observe(document, { subtree: true, childList: true, attributes: true,
      attributeFilter: ['id', 'class', 'style', 'hidden', 'aria-hidden'] });
    let frame;
    const observeFrame = () => { sample('frame'); frame = requestAnimationFrame(observeFrame); };
    frame = requestAnimationFrame(observeFrame);
    return { finish() {
      if (observer.takeRecords().length) sample('mutation');
      observer.disconnect(); cancelAnimationFrame(frame);
      const after = sample('after');
      const geometryPreserved = ['x', 'y', 'width', 'height'].every(key => Math.abs(after[key] - before[key]) <= 1);
      return { kind: 'retained-output', observedAtOperationMs, before, after, observations,
        frameObservations, mutationObservations, allObservedVisible, preservedIdentity, geometryPreserved,
        retained: allObservedVisible && preservedIdentity && geometryPreserved, firstFailure };
    } };
  };
}

async function documentEvidence(page) {
  return page.evaluate(async () => {
    const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('');
    const state = typeof AppState !== 'undefined' ? AppState : window.AppState;
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const area = document.getElementById('print-area');
    const attempt = runtime.inspect().attempts.at(-1);
    const profile = window.__outputPerformance;
    const imageBuildFailures = await Promise.all(profile.imageBuildFailures.filter(item => item.operation === profile.operation).map(async item => ({
      ...item, results: item.results ? await Promise.all(item.results.map(async ({ imageSourceValue, ...result }) => {
        let normalizedSource = imageSourceValue;
        try { const url = new URL(imageSourceValue, location.href); url.searchParams.delete('v'); normalizedSource = url.href; } catch (_) {}
        normalizedSource = String(normalizedSource || '').replace(/https?:\/\/127\.0\.0\.1:\d+/g, 'LOCAL').replace(/\s+/g, ' ').trim();
        return { ...result, imageUrlSha256: await digest(normalizedSource) };
      })) : []
    })));
    const envelope = window.__AP_OUTPUT_ENVELOPE__;
    const ready = window.__AP_OUTPUT_RENDER_READY__;
    const verified = window.__AP_OUTPUT_ENVELOPE_READY__;
    const expectedEnvelopeIdentity = value => !!value && value.outputRequestId === envelope?.outputRequestId &&
      value.payloadHash === envelope?.payloadHash && value.contractVersion === envelope?.contractVersion;
    const math = [...area.querySelectorAll('mjx-container')];
    const mathMarkup = math.map(node => node.innerHTML.replace(/MJX-\d+/g, 'MJX-N'));
    const operationMath = window.__solutionLoadingQA.calls.filter(call => call.startMs >= window.__solutionLoadingQA.operationStart);
    const solutionSources = [...area.querySelectorAll('.sol-box')].map(node => node.dataset.sourceRef || '');
    const clipping = [...area.querySelectorAll('.page *')].filter(node => {
      const style = getComputedStyle(node);
      return (['hidden', 'clip'].includes(style.overflowX) && node.scrollWidth > node.clientWidth + 3) ||
        (['hidden', 'clip'].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 3);
    });
    const pages = [...area.querySelectorAll('.page')];
    const clippingEvidence = await Promise.all(clipping.map(async node => {
      const style = getComputedStyle(node), rect = node.getBoundingClientRect();
      // Only numeric geometry and source identities leave Chrome. Math source
      // strings remain in the page and are reduced to digests before capture.
      const descendants = [...node.querySelectorAll('*')].filter(child => {
        const box = child.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && (box.right > rect.right + 3 || box.left < rect.left - 3 ||
          box.bottom > rect.bottom + 3 || box.top < rect.top - 3);
      });
      let mathItems = [];
      try { mathItems = Array.from(window.MathJax?.startup?.document?.getMathItemsWithin?.([node]) || []); } catch (_) {}
      const overflowingDescendants = await Promise.all(descendants.slice(0, 48).map(async child => {
        const childStyle = getComputedStyle(child), box = child.getBoundingClientRect();
        const mathRoot = child.closest('mjx-container');
        const mathItem = mathRoot && mathItems.find(item => item.typesetRoot === mathRoot);
        const source = mathItem?.math || mathRoot?.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
        return { tag: child.tagName, classes: [...child.classList].filter(name => /^[A-Za-z0-9_-]+$/.test(name)),
          sourceRef: child.closest('[data-source-ref]')?.dataset.sourceRef || '',
          x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height,
          clientWidth: child.clientWidth, scrollWidth: child.scrollWidth, clientHeight: child.clientHeight, scrollHeight: child.scrollHeight,
          display: childStyle.display, overflowX: childStyle.overflowX, overflowY: childStyle.overflowY,
          fontSize: childStyle.fontSize, lineHeight: childStyle.lineHeight, whiteSpace: childStyle.whiteSpace,
          mathSourceSha256: source ? await digest(String(source)) : null,
          ...(child.tagName === 'IMG' ? { imageNaturalWidth: child.naturalWidth, imageNaturalHeight: child.naturalHeight,
            imageLoaded: child.complete && child.naturalWidth > 0,
            imageUrlSha256: await digest(child.getAttribute('src') || '') } : {}) };
      }));
      return { tag: node.tagName, classes: [...node.classList].filter(name => /^[A-Za-z0-9_-]+$/.test(name)),
        sourceRef: node.closest('[data-source-ref]')?.dataset.sourceRef || '', page: pages.indexOf(node.closest('.page')) + 1,
        clientWidth: node.clientWidth, clientHeight: node.clientHeight, scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight,
        rectWidth: rect.width, rectHeight: rect.height, overflowX: style.overflowX, overflowY: style.overflowY,
        display: style.display, fontSize: style.fontSize, lineHeight: style.lineHeight, whiteSpace: style.whiteSpace,
        insideMath: !!node.closest('mjx-container'), insideSolution: !!node.closest('.sol-box'),
        overflowingDescendantCount: descendants.length, overflowingDescendants };
    }));
    return {
      inputHash: await digest(JSON.stringify((state.data || []).map(q => ({ id: q.id,
        uid: q._sourceQuestionUid || q.sourceQuestionUid || q.questionUid || q.source_question_uid || '',
        content: q.content || q.question || '', choices: q.choices || [], answer: q.answer,
        solution: q.solution || q.explanation || q.sol || '', image: q.image || '', images: q.images || [],
        solutionImage: q.solutionImage || '', solutionImageLayout: q.solutionImageLayout || '' })))),
      mathMarkupHash: await digest(JSON.stringify(mathMarkup)),
      mathGeometry: math.map(node => ({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height) })),
      operationMath: { calls: operationMath.length,
        totalMs: operationMath.reduce((total, call) => total + (call.endMs - call.startMs), 0),
        labels: operationMath.map(call => ({ label: call.label, elapsedMs: call.endMs - call.startMs })) },
      imageBuildFailures,
      continuationCount: solutionSources.length - new Set(solutionSources).size,
      clippingCount: clipping.length, clippingEvidence,
      pageOverflowCount: pages.filter(node => node.scrollHeight > node.clientHeight + 3 || node.scrollWidth > node.clientWidth + 3).length,
      envelope: envelope ? { present: true, mode: envelope.mode, questionCount: envelope.questionCount,
        verifiedIdentityMatches: expectedEnvelopeIdentity(verified), renderedIdentityMatches: expectedEnvelopeIdentity(ready),
        urlIdentityMatches: new URLSearchParams(location.search).get('outputRequestId') === envelope.outputRequestId,
        errorPresent: !!window.__AP_OUTPUT_RENDER_ERROR__ } : { present: false },
      cacheStatus: attempt?.cacheStatus || null, snapshotId: runtime.activeSnapshot?.snapshotId || null,
      committedMode: runtime.committedCandidate?.mode || null, snapshotMode: runtime.activeSnapshot?.mode || null,
      urlMode: new URLSearchParams(location.search).get('mode'),
      visibleKinds: { solutionBoxes: area.querySelectorAll('.sol-box').length,
        answerCells: area.querySelectorAll('.ans-cell:not(.ans-cell-empty)').length,
        examBoxes: area.querySelectorAll('.q-box:not(.sol-box)').length },
      attemptCount: runtime.inspect().attempts.length,
      phases: attempt?.metrics?.phases || {}, visibleReadyMs: attempt?.visibleReadyMs || null,
      runtimeReadyAt: profile.runtimeReadyAt, envelopeReadyAt: profile.envelopeReadyAt,
      adapters: profile.adapters.filter(item => item.operation === profile.operation),
      navigation: (() => { const item = performance.getEntriesByType('navigation')[0]; return item ? {
        domContentLoadedMs: item.domContentLoadedEventEnd, loadMs: item.loadEventEnd, responseEndMs: item.responseEnd } : null; })(),
      startup: { metadata: { ...profile.metadata },
        metadataLoaderMode: ['frozen-source', 'sidecar'].includes(window.APOutputMetadataLoader?.mode) ? window.APOutputMetadataLoader.mode : null,
        metadataRecordsCount: Array.isArray(window.ARCHIVE_QUESTION_METADATA?.records) ? window.ARCHIVE_QUESTION_METADATA.records.length : 0,
        appDataCount: Array.isArray(state?.data) ? state.data.length : 0, appKeyPresent: !!state?.key }
    };
  });
}

async function awaitInitialOutcome(page, strictEnvelope) {
  try { await page.waitForFunction(strict => {
    if (window.__AP_OUTPUT_RENDER_ERROR__) return true;
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const attempt = runtime?.inspect().attempts.at(-1);
    if (!runtime || runtime.busy || !['SUCCEEDED', 'FAILED'].includes(attempt?.state)) return false;
    return !strict || attempt.state === 'FAILED' || !!window.__AP_OUTPUT_RENDER_READY__;
  }, strictEnvelope, { timeout: timeLeft(), polling: 25 }); }
  catch (error) { if (error.name === 'TimeoutError') error.code = 'OUTPUT_READY_TIMEOUT'; throw error; }
  return page.evaluate(async () => {
    if (window.__AP_OUTPUT_RENDER_ERROR__) {
      const error = await window.__outputPerformance.classifyError({ message: window.__AP_OUTPUT_RENDER_ERROR__ });
      return { ok: false, code: error.code, error };
    }
    const result = await window.__AP_RENDER_READY__;
    return { ok: result?.ok === true, code: result?.ok ? null : /^[A-Z][A-Z0-9_:-]{2,160}$/.test(result?.code || '') ? result.code : 'RENDER_FAILED' };
  });
}

async function printPreflight(page, before) {
  const measured = await bounded(page.evaluate(async () => {
    const started = performance.now();
    try {
      if (window.mixedFastHost) {
        const result = await window.mixedFastHost.preflight();
        return { ok: result.ok, pages: result.pages, elapsedMs: performance.now() - started };
      }
      const runtime = window.archiveScreenRuntime;
      const result = window.APArchiveSnapshotContract.preflight(runtime.activeSnapshot, runtime.committedCandidate);
      if (result.pass) window.bindArchiveRuntimePrintReadiness();
      return { ok: result.pass, failedGates: Object.keys(result.gates).filter(key => !result.gates[key]), elapsedMs: performance.now() - started };
    } catch (error) {
      return { ok: false, code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error?.code || error?.message || '') ? error.code || error.message : 'PRINT_PREFLIGHT_FAILED',
        elapsedMs: performance.now() - started };
    } finally { window.mixedFastHost?.unlockPrint(); }
  }), 45000);
  requireThat(measured.ok, 'SUCCESSFUL_RENDER_PRINT_PREFLIGHT_FAILED', measured);
  // Capture and parity verification are deliberately outside the timed gate.
  const after = await H.capture(page, before.outcome);
  const parity = H.compareRows({ ...before, pass: true, name: 'before-preflight' }, { ...after, pass: true, name: 'after-preflight' });
  return { ...measured, outputParity: parity, attemptsBefore: before.attempts.length, attemptsAfter: after.attempts.length };
}

async function printPdfMetadata(session, before) {
  const started = performance.now();
  const pdf = await bounded(session.cdp.send('Page.printToPDF', {
    printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false
  }), 60000);
  const elapsedMs = round(performance.now() - started);
  const bytes = Buffer.from(pdf.data, 'base64');
  const text = bytes.toString('latin1');
  requireThat(bytes.subarray(0, 5).toString() === '%PDF-', 'CHROME_PDF_NOT_PRODUCED');
  const pageCount = (text.match(/\/Type\s*\/Page\b/g) || []).length;
  const mediaBoxes = [...text.matchAll(/\/MediaBox\s*\[\s*([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s*\]/g)]
    .map(match => match.slice(1).map(value => round(Number(value))));
  requireThat(pageCount === before.pageCount, 'PDF_PAGE_COUNT_CHANGED', { screenPages: before.pageCount, pdfPages: pageCount });
  requireThat(mediaBoxes.length > 0 && mediaBoxes.every(box => box[2] > box[0] && box[3] > box[1]), 'PDF_PAGE_GEOMETRY_MISSING');
  const raster = inspectPdf(bytes, pageCount);
  // Chrome can load print fonts and legitimately replace the screen snapshot
  // while the offline PDF inspector runs. Observe its actual completed state
  // before the next mode request, so rollback is checked against the right ID.
  const stable = await bounded(session.page.evaluate(async () => {
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const frames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (;;) {
      await document.fonts?.ready;
      await frames();
      await runtime.whenIdle();
      const pending = window.__AP_RENDER_READY__;
      const outcome = await pending;
      await frames();
      if (runtime.busy || pending !== window.__AP_RENDER_READY__ || document.fonts?.status !== 'loaded') continue;
      return { snapshotId: runtime.activeSnapshot?.snapshotId || null, attemptCount: runtime.inspect().attempts.length,
        runtimeBusy: runtime.busy, fontsStatus: document.fonts.status,
        activeRootMatches: runtime.activeSnapshot?.rootNode === document.getElementById('print-area'),
        outcome: { ok: outcome?.ok === true, code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(outcome?.code || '') ? outcome.code : null } };
    }
  }), 45000);
  requireThat(stable.outcome.ok && stable.activeRootMatches, 'POST_PDF_OUTPUT_NOT_READY', stable);
  const after = await H.capture(session.page, stable.outcome);
  const afterEvidence = await documentEvidence(session.page);
  H.assertReady(after, before.questionCount, 'after-pdf');
  requireThat(after.mode === before.mode && after.qpp === before.qpp && afterEvidence.snapshotId === stable.snapshotId &&
    afterEvidence.attemptCount === stable.attemptCount && afterEvidence.snapshotMode === after.mode &&
    afterEvidence.committedMode === after.mode, 'POST_PDF_BINDING_NOT_STABLE');
  if (afterEvidence.envelope.present) requireThat(afterEvidence.envelope.mode === after.mode &&
    afterEvidence.envelope.verifiedIdentityMatches && afterEvidence.envelope.renderedIdentityMatches &&
    afterEvidence.envelope.urlIdentityMatches && !afterEvidence.envelope.errorPresent, 'POST_PDF_ENVELOPE_NOT_READY');
  const screenParity = compare({ ...before, pass: true, name: 'before-pdf' },
    { ...after, ...afterEvidence, pass: true, name: 'after-pdf' });
  const afterPrintState = { snapshotId: afterEvidence.snapshotId, snapshotMode: afterEvidence.snapshotMode,
    committedMode: afterEvidence.committedMode, mode: after.mode, attemptCount: afterEvidence.attemptCount,
    runtimeBusy: stable.runtimeBusy, fontsStatus: stable.fontsStatus, renderOutcomeOk: stable.outcome.ok,
    activeRootMatches: stable.activeRootMatches, envelope: afterEvidence.envelope };
  // PDF timestamps/object identities are allowed to differ. Compare page count
  // and physical geometry, while retaining the generated byte hash as evidence.
  return { generated: true, elapsedMs, bytes: bytes.length, sha256: hash(bytes), pageCount, mediaBoxes,
    fontObjects: (text.match(/\/Type\s*\/Font\b/g) || []).length, screenParity, afterPrintState, raster };
}

async function openSession(browser, server, fixture, initialMode, slow) {
  const context = await browser.newContext({ viewport: report.conditions.viewport, serviceWorkers: 'block' });
  const errors = [];
  try {
    await context.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
    await context.addInitScript(H.installInstrumentation, { suppressRaf: false });
    await context.addInitScript(installProfile, { observeImageWaits: !!slow });
    await context.addInitScript(installRetainedVisibilityObservation);
    const page = await context.newPage();
    page.setDefaultTimeout(timeLeft());
    page.on('pageerror', error => errors.push({ name: error.name, messageSha256: hash(error.message) }));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Performance.enable');
    const metadataNetwork = [];
    if (slow) {
      const requests = new Map();
      cdp.on('Network.requestWillBeSent', event => {
        let pathname;
        try { pathname = new URL(event.request.url).pathname; } catch (_) { return; }
        if (!pathname.endsWith('/data/question_metadata.json')) return;
        const record = { resource: 'question_metadata.json', state: 'REQUESTED', finished: false, failed: false,
          decodedDataBytes: 0, encodedDataBytes: 0, chunks: 0 };
        requests.set(event.requestId, { record, start: event.timestamp }); metadataNetwork.push(record);
      });
      cdp.on('Network.responseReceived', event => {
        const request = requests.get(event.requestId); if (!request) return;
        const headers = Object.fromEntries(Object.entries(event.response.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
        const encoding = String(headers['content-encoding'] || 'identity').toLowerCase();
        Object.assign(request.record, { state: 'RECEIVING', httpStatus: event.response.status,
          headersAfterMs: round((event.timestamp - request.start) * 1000),
          contentEncoding: ['identity', 'gzip', 'br', 'deflate', 'zstd'].includes(encoding) ? encoding : 'OTHER',
          contentLength: /^\d+$/.test(String(headers['content-length'] || '')) ? Number(headers['content-length']) : null,
          responseEncodedBytes: event.response.encodedDataLength });
      });
      cdp.on('Network.dataReceived', event => {
        const request = requests.get(event.requestId); if (!request) return;
        request.record.decodedDataBytes += event.dataLength;
        request.record.encodedDataBytes += event.encodedDataLength;
        request.record.chunks += 1;
        request.record.lastChunkAfterMs = round((event.timestamp - request.start) * 1000);
      });
      cdp.on('Network.loadingFinished', event => {
        const request = requests.get(event.requestId); if (!request) return;
        Object.assign(request.record, { state: 'FINISHED', finished: true,
          finishedAfterMs: round((event.timestamp - request.start) * 1000), encodedBytesTotal: event.encodedDataLength });
      });
      cdp.on('Network.loadingFailed', event => {
        const request = requests.get(event.requestId); if (!request) return;
        Object.assign(request.record, { state: 'FAILED', failed: true, canceled: !!event.canceled,
          failedAfterMs: round((event.timestamp - request.start) * 1000),
          code: /^net::ERR_[A-Z0-9_]+$/.test(event.errorText || '') ? event.errorText : 'NETWORK_FAILED' });
      });
    }
    const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(item => [item.name, item.value]));
    await page.goto(server.origin + '/__loading/seed.html', { waitUntil: 'domcontentloaded', timeout: timeLeft() });
    let url;
    if (fixture.kind === 'envelope') {
      await page.addScriptTag({ url: server.origin + '/archive/archive2-output-contract.js' });
      await page.addScriptTag({ url: server.origin + '/archive/archive2-output.js' });
      url = await page.evaluate(async ({ questions, mode, qpp }) => {
        const questionUids = questions.map(q => q.questionUid || q.source_question_uid || q._sourceQuestionUid || null);
        const envelope = await window.Archive2Output.publishOutputEnvelope({ sourceKind: 'archive2-mixed', sourceId: 'performance-real-50',
          mode, questionCount: questions.length, questionUids,
          meta: { title: '50문항 해설 로딩 검증', qpp, includeQr: false, questionUids,
            printHeaderOptions: { title: '50문항 해설 로딩 검증' } }, questions });
        return window.Archive2Output.outputEnvelopeUrl('mixed_engine.html', new URL('/archive/workspace.html', location.href).href, envelope, { studio: true }).href;
      }, { questions: fixture.questions, mode: initialMode, qpp: fixture.qpp || 4 });
    } else if (fixture.kind === 'legacy') {
      await page.evaluate(({ questions, qpp }) => {
        localStorage.setItem('mixedQuestions_performance', JSON.stringify(questions));
        localStorage.setItem('mixedMeta_performance', JSON.stringify({ title: '50문항 해설 로딩 검증', qpp, count: questions.length }));
      }, { questions: fixture.questions, qpp: fixture.qpp || 4 });
      url = `${server.origin}/archive/mixed_engine.html?key=performance&mode=${initialMode}&qpp=${fixture.qpp || 4}`;
    } else {
      url = new URL('/archive/engine.html', server.origin);
      url.searchParams.set('data', fixture.sources[0].slice('archive/'.length));
      url.searchParams.set('mode', initialMode); url.searchParams.set('qpp', String(fixture.qpp || 4));
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
    return { context, page, cdp, metrics, errors, url: url.href, fixture, metadataNetwork,
      async close() { await context.close(); } };
  } catch (error) { await context.close(); throw error; }
}

async function measureOperation(session, operation, label, repeat, network, first, purpose = 'performance') {
  const { page, fixture } = session;
  const before = await session.metrics();
  let outcome, publicMs, alreadyVisible = false, previousAttempts = 0, retainedVisibility = null;
  if (first) {
    const initial = async () => {
      try { await page.goto(session.url, { waitUntil: 'domcontentloaded', timeout: timeLeft() }); }
      catch (error) { if (error.name === 'TimeoutError') error.code = 'OUTPUT_NAVIGATION_TIMEOUT'; throw error; }
      return awaitInitialOutcome(page, fixture.kind === 'envelope');
    };
    // The separate slow-network experiment observes actual completion, with
    // one total cap including navigation. Existing suite wait caps stay intact.
    outcome = networkOnly ? await bounded(initial(), operationTimeoutMs) : await initial();
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
      const retainedObservation = previousMode === mode ? window.__observeRetainedOutputVisibility(mode) : null;
      const started = performance.now();
      let result;
      let elapsed;
      try { result = await window.switchMode(mode); elapsed = performance.now() - started; }
      catch (error) {
        elapsed = performance.now() - started;
        const classified = await profile.classifyError(error);
        result = { ok: false, code: classified.code, error: classified };
      }
      if (result?.ok !== true && !result?.error) {
        const classified = await profile.classifyError({ code: result?.code, message: result?.message || result?.code || '' });
        result = { ok: false, code: classified.code, error: classified };
      }
      const retainedVisibility = retainedObservation?.finish() || null;
      const newAttempts = runtime.inspect().attempts.length;
      const alreadyVisible = previousMode === mode && oldArea === document.getElementById('print-area') &&
        oldSnapshot === runtime.activeSnapshot && previousAttempts === newAttempts && retainedVisibility?.retained === true;
      return { outcome: { ok: result?.ok === true, code: result?.ok ? null : result.code, ...(result?.error ? { error: result.error } : {}) },
        publicMs: elapsed, alreadyVisible, previousAttempts, retainedVisibility };
    }, operation.mode));
    ({ outcome, publicMs, alreadyVisible, previousAttempts, retainedVisibility } = result);
  }
  const after = await session.metrics();
  const row = await H.capture(page, outcome);
  const evidence = await documentEvidence(page);
  if (first) publicMs = (fixture.kind === 'envelope' ? evidence.envelopeReadyAt : evidence.runtimeReadyAt) ?? row.engineElapsedMs;
  // A same-mode cache HIT may create a real transaction while retaining the
  // active DOM. Zero means observed existing output, not a newly painted view.
  // Keep that HIT's actual wall time, attempt, adapter and MathJax metrics.
  if (retainedVisibility?.retained) row.firstBoxMs = 0;
  Object.assign(row, { name: `${fixture.id}-${label}-${repeat}-${network}-${operation.id}`, fixture: fixture.id,
    label, repeat, network, purpose, operation: operation.id, initial: first, publicMs: round(publicMs),
    alreadyVisible, previousAttempts, retainedVisibility, ...evidence,
    cdp: Object.fromEntries(['LayoutCount', 'RecalcStyleCount', 'LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration', 'TaskDuration'].map(key =>
      [key.endsWith('Duration') ? key + 'Ms' : key, round(((after[key] || 0) - (before[key] || 0)) * (key.endsWith('Duration') ? 1000 : 1))])),
    pageErrors: session.errors.slice() });
  if (network !== 'normal') {
    const transfers = session.metadataNetwork.map(record => ({ ...record }));
    row.metadataTransfer = { state: !transfers.length ? 'NOT_REQUESTED' : transfers.some(item => item.failed) ? 'FAILED' :
      transfers.every(item => item.finished) ? 'COMPLETE' : 'PENDING', requests: transfers,
      loaderMode: row.startup.metadataLoaderMode,
      notRequestedUnderFrozenSourcePolicy: transfers.length === 0 && row.startup.metadataLoaderMode === 'frozen-source',
      renderCompletedWithoutMetadataRequest: outcome.ok === true && transfers.length === 0 };
  }
  if (alreadyVisible) {
    row.cacheStatus = 'UNCHANGED_ACTIVE'; row.phases = {}; row.visibleReadyMs = null;
    row.metrics = { renderReadyMs: 0, mathJaxTotalMs: 0, mathJaxCalls: 0, rafCount: 0, calls: [] };
    row.typeset = { maxConcurrent: 0, calls: [] };
  }
  row.pass = false;
  (purpose === 'pdf' ? report.pdfRows : report.rows).push(row);
  writeReport();
  H.assertReady(row, fixture.questions.length, row.name);
  requireThat(row.qpp === (fixture.qpp || 4), 'FIXTURE_OUTPUT_OPTION_CHANGED', { fixture: fixture.id, expectedQpp: fixture.qpp || 4, actualQpp: row.qpp });
  requireThat(session.errors.length === 0, 'UNEXPECTED_BROWSER_ERROR', { errors: session.errors });
  if (row.envelope.present) requireThat(row.envelope.mode === operation.mode && row.envelope.verifiedIdentityMatches &&
    row.envelope.renderedIdentityMatches && row.envelope.urlIdentityMatches && !row.envelope.errorPresent,
    'ENVELOPE_IDENTITY_NOT_READY', { fixture: fixture.id, operation: operation.id, identity: row.envelope });
  row.printPreflight = await printPreflight(page, row);
  row.printPreflightMs = round(row.printPreflight.elapsedMs);
  if (fixture.id === 'continuation-golden' && operation.mode === 'sol')
    requireThat(row.continuationCount > 0, 'GOLDEN_CONTINUATION_NOT_EXERCISED');
  if (purpose === 'pdf') row.pdf = await printPdfMetadata(session, row);
  row.pass = true;
  writeReport();
  console.log(JSON.stringify({ fixture: fixture.id, label, repeat, network, purpose, operation: operation.id, pass: true,
    publicMs: row.publicMs, firstBoxMs: round(row.firstBoxMs), cache: row.cacheStatus, mathMs: round(row.operationMath.totalMs),
    mathCalls: row.operationMath.calls, layoutMs: row.cdp.LayoutDurationMs, pages: row.pageCount,
    printMs: row.printPreflightMs, phases: row.phases,
    adaptersMs: row.adapters.reduce((total, item) => { total[item.method] = round((total[item.method] || 0) + item.ms); return total; }, {}) }));
  return row;
}

async function cycle(browser, server, fixture, label, repeat, { coldSolution = false, slow = false, continuation = false, pdf = false, pdfAnswerOnly = false, networkCompletion = false } = {}) {
  const network = networkCompletion ? 'slow-complete' : slow ? 'slow' : 'normal';
  const purpose = networkCompletion ? 'network' : pdf ? 'pdf' : 'performance';
  const operations = networkCompletion ? operationsByCycle.network : pdf ? (pdfAnswerOnly ? operationsByCycle.pdf.slice(2) : operationsByCycle.pdf) :
    continuation ? operationsByCycle.continuation : coldSolution ? operationsByCycle.coldSolution : operationsByCycle.performance;
  const planned = { fixture: fixture.id, qpp: fixture.qpp || 4, label, repeat, network, purpose,
    context: pdfAnswerOnly ? 'isolated-direct-answer-after-blocked-solution' : 'mode-sequence',
    operations: operations.map(item => item.id), pass: false, completed: 0 };
  report.cycles.push(planned);
  const rows = [];
  let session;
  try {
    session = await openSession(browser, server, fixture, operations[0].mode, slow || networkCompletion);
    for (let index = 0; index < operations.length; index += 1) {
      const row = await measureOperation(session, operations[index], label, repeat, network, index === 0, purpose);
      rows.push(row);
      planned.completed += 1;
    }
    planned.pass = true;
  } catch (error) {
    planned.failedOperation = operations[planned.completed]?.id || 'session-open';
    planned.error = safeError(error);
    if (session) {
      planned.metadataNetworkAtFailure = session.metadataNetwork.map(record => ({ ...record }));
      try { planned.browserAtFailure = await session.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
        const state = window.AppState;
        return { elapsedMs: performance.now(), documentReadyState: document.readyState,
          metadata: { ...(window.__outputPerformance?.metadata || { promisePresent: false, settled: false, fulfilled: null }) },
          metadataLoaderMode: ['frozen-source', 'sidecar'].includes(window.APOutputMetadataLoader?.mode) ? window.APOutputMetadataLoader.mode : null,
          metadataRecordsCount: Array.isArray(window.ARCHIVE_QUESTION_METADATA?.records) ? window.ARCHIVE_QUESTION_METADATA.records.length : 0,
          appDataCount: Array.isArray(state?.data) ? state.data.length : 0, appKeyPresent: !!state?.key,
          mathJaxLoaded: typeof window.MathJax?.typesetPromise === 'function', runtimePresent: !!runtime,
          runtimeBusy: runtime?.busy || false,
          latestAttemptState: runtime?.inspect().attempts.at(-1)?.state || null,
          outputErrorPresent: !!window.__AP_OUTPUT_RENDER_ERROR__, outputReadyPresent: !!window.__AP_OUTPUT_RENDER_READY__,
          visiblePageCount: document.querySelectorAll('#print-area .page').length,
          navigation: navigation ? { responseEndMs: navigation.responseEnd,
            domContentLoadedMs: navigation.domContentLoadedEventEnd, loadMs: navigation.loadEventEnd,
            encodedBodyBytes: navigation.encodedBodySize, transferBytes: navigation.transferSize } : null,
          resources: { count: resources.length, transferBytes: resources.reduce((sum, item) => sum + item.transferSize, 0),
            encodedBodyBytes: resources.reduce((sum, item) => sum + item.encodedBodySize, 0),
            maxDurationMs: Math.max(0, ...resources.map(item => item.duration)),
            byType: resources.reduce((counts, item) => { counts[item.initiatorType] = (counts[item.initiatorType] || 0) + 1; return counts; }, {}) } };
      }); } catch (captureError) { planned.failureDiagnosticsError = safeError(captureError); }
    }
    const failedRow = (pdf ? report.pdfRows : report.rows).findLast(row => row.fixture === fixture.id && row.label === label && row.repeat === repeat &&
      row.network === network && row.operation === planned.failedOperation);
    if (failedRow && !rows.includes(failedRow)) { failedRow.error = planned.error; rows.push(failedRow); }
    report.failures.push({ fixture: fixture.id, label, repeat, network, purpose, operation: planned.failedOperation, error: planned.error });
    console.log(JSON.stringify({ fixture: fixture.id, label, repeat, network, purpose, operation: planned.failedOperation,
      pass: false, code: planned.error.code, publicFailure: failedRow?.outcome?.error || null,
      clipping: failedRow?.clippingEvidence || [], stateMode: failedRow?.mode, snapshotMode: failedRow?.snapshotMode,
      completed: planned.completed, planned: operations.length }));
    // A failure poisons this mode sequence. Independent fresh contexts still
    // run, and the aggregate result remains FAIL; no missing operation passes.
  } finally { await session?.close(); writeReport(); }
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
  if (before.pdf || after.pdf) requireThat(before.pdf?.generated && after.pdf?.generated &&
    before.pdf.pageCount === after.pdf.pageCount && JSON.stringify(before.pdf.mediaBoxes) === JSON.stringify(after.pdf.mediaBoxes),
    'PDF_GEOMETRY_PARITY_FAILED', { fixture: before.fixture, operation: before.operation });
  if (before.pdf || after.pdf) {
    const { inspectionElapsedMs: beforeInspectionMs, ...beforeRaster } = before.pdf?.raster || {};
    const { inspectionElapsedMs: afterInspectionMs, ...afterRaster } = after.pdf?.raster || {};
    requireThat(before.pdf?.raster && after.pdf?.raster && JSON.stringify(beforeRaster) === JSON.stringify(afterRaster),
      'PDF_PAINTED_OUTPUT_PARITY_FAILED', { fixture: before.fixture, operation: before.operation });
  }
  return { ...parity, fixture: before.fixture, qpp: before.qpp, operation: before.operation, repeat: before.repeat, network: before.network, purpose: before.purpose, pass: true };
}

function compareCycles(before, after, target = report.comparisons) {
  const keys = [...new Set([...before, ...after].map(row => row.operation))];
  for (const operation of keys) {
    const baseline = before.find(row => row.operation === operation);
    const current = after.find(row => row.operation === operation);
    try { target.push(compare(baseline, current)); }
    catch (error) {
      const row = baseline || current;
      target.push({ fixture: row?.fixture, qpp: row?.qpp, operation, repeat: row?.repeat, network: row?.network, purpose: row?.purpose, pass: false, error: safeError(error) });
    }
  }
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
      mathMs: row => row.operationMath.totalMs,
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
  requireThat(!(pdfOnly && skipPdf), 'CONFLICTING_PDF_PHASE_FLAGS');
  requireThat(!(networkOnly && (pdfOnly || profileOnly)), 'NETWORK_COMPLETION_REQUIRES_PAIRED_NON_PDF_RUN');
  if (networkOnly) requireThat(['envelope50-qpp1', 'envelope8'].includes(networkFixtureId), 'NETWORK_FIXTURE_REQUIRED');
  const chrome = process.env.CHROME_BIN;
  requireThat(chrome && fs.existsSync(chrome), 'REAL_CHROME_BIN_REQUIRED');
  report.currentSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  report.playwrightVersion = require('playwright/package.json').version;
  const pinned = loadQualificationFixtures(root);
  report.fixtures = pinned.fixtures.filter(fixture => !networkOnly || fixture.id === networkFixtureId)
    .map(fixture => ({ ...fixture, questions: fixture.questions.length }));
  const runtimeFixtures = pinned.fixtures.map(fixture => ({ ...fixture, sources: fixture.sources.map(source => source.file) }));
  const fixtures = runtimeFixtures.slice(0, 6);
  const [legacy, golden] = runtimeFixtures.slice(6);
  planCoverage(fixtures, legacy, golden);
  writeReport();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-output-performance-'));
  const baselineRoot = path.join(temp, 'baseline');
  let baselineServer, currentServer, browser, worktree = false;
  try {
    if (!profileOnly) {
      execFileSync('git', ['worktree', 'add', '--detach', baselineRoot, baseSha], { cwd: root, stdio: 'pipe', timeout: 120000 });
      worktree = true;
      baselineServer = await H.serve(baselineRoot, root, pinned.sourceOverlay);
    }
    currentServer = await H.serve(root, root, pinned.sourceOverlay);
    browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    report.chromeVersion = browser.version();
    if (networkOnly) {
      const fixture = fixtures.find(item => item.id === networkFixtureId);
      const outputs = {};
      for (const label of ['baseline', 'current'])
        outputs[label] = await cycle(browser, label === 'baseline' ? baselineServer : currentServer, fixture, label, 1, { networkCompletion: true });
      compareCycles(outputs.baseline, outputs.current, report.networkComparisons);
    }
    if (!pdfOnly && !networkOnly) for (let repeat = 1; repeat <= repeats; repeat += 1) {
      for (const fixture of fixtures) {
        const outputs = {};
        const labels = profileOnly ? ['current'] : repeat % 2 ? ['baseline', 'current'] : ['current', 'baseline'];
        for (const label of labels) {
          const server = label === 'baseline' ? baselineServer : currentServer;
          outputs[label] = await cycle(browser, server, fixture, label, repeat);
          if (fixture.kind === 'envelope') outputs[label].push(...await cycle(browser, server, fixture, label, repeat, { coldSolution: true }));
        }
        if (!profileOnly) compareCycles(outputs.baseline, outputs.current);
        writeReport();
      }
    }
    // A separate legacy session detects repeated clicks that never enter the
    // strict Archive2 wrapper. It is not substituted for the envelope benchmark.
    if (!pdfOnly && !networkOnly) {
      const legacyOutputs = {};
      for (const label of profileOnly ? ['current'] : ['baseline', 'current'])
        legacyOutputs[label] = await cycle(browser, label === 'baseline' ? baselineServer : currentServer, legacy, label, 1);
      if (!profileOnly) compareCycles(legacyOutputs.baseline, legacyOutputs.current);
      const goldenOutputs = {};
      for (const label of profileOnly ? ['current'] : ['baseline', 'current'])
        goldenOutputs[label] = await cycle(browser, label === 'baseline' ? baselineServer : currentServer, golden, label, 1, { continuation: true });
      if (!profileOnly) compareCycles(goldenOutputs.baseline, goldenOutputs.current);
      // Slow transport completion now has its own NETWORK_ONLY phase and
      // explicit coverage manifest. Earlier timeout reports are retained as
      // historical failures; they are not reclassified as successful loads.
    }
    if (!skipPdf && !networkOnly) {
      // Printing can load extra fonts and trigger FONT_INVALIDATION. Dedicated
      // contexts keep those real print effects out of warm mode-switch timing.
      for (const fixture of [...fixtures, legacy, golden]) {
        const pdfOutputs = {};
        for (const label of profileOnly ? ['current'] : ['baseline', 'current']) {
          const server = label === 'baseline' ? baselineServer : currentServer;
          pdfOutputs[label] = await cycle(browser, server, fixture, label, 1, { pdf: true });
          // The unchanged qpp4 solution has a real clipping failure. Keep that
          // failure, then measure its otherwise unreachable answer output in a
          // fresh strict context with the identical 50-question bytes/options.
          if (fixture.id === 'envelope50' && !pdfOutputs[label].some(row => row.operation === 'pdf-ans'))
            pdfOutputs[label].push(...await cycle(browser, server, fixture, label, 1, { pdf: true, pdfAnswerOnly: true }));
        }
        if (!profileOnly) compareCycles(pdfOutputs.baseline, pdfOutputs.current, report.pdfComparisons);
      }
    }
    const phaseParity = (purpose, rows) => profileOnly ? 'NOT_RUN_PROFILE_ONLY' :
      !report.cycles.some(item => item.purpose === purpose) ? 'NOT_RUN_IN_THIS_PHASE' :
        report.cycles.filter(item => item.purpose === purpose).every(item => item.pass) && rows.length > 0 && rows.every(item => item.pass) ? 'PASS' : 'FAIL';
    report.performanceParity = phaseParity('performance', report.comparisons);
    report.networkParity = phaseParity('network', report.networkComparisons);
    report.pdfParity = phaseParity('pdf', report.pdfComparisons);
    report.outputParity = profileOnly ? 'NOT_RUN_PROFILE_ONLY' : report.failures.length === 0 &&
      [...report.comparisons, ...report.networkComparisons, ...report.pdfComparisons].every(row => row.pass) ? 'PASS' : 'FAIL';
    updateCoverage();
    report.pass = report.coverage.complete && report.failures.length === 0 && report.cycles.every(cycle => cycle.pass) &&
      [...report.rows, ...report.pdfRows].length > 0 && [...report.rows, ...report.pdfRows].every(row => row.pass) &&
      (profileOnly || [...report.comparisons, ...report.networkComparisons, ...report.pdfComparisons].every(row => row.pass));
  } finally {
    await browser?.close(); await baselineServer?.close(); await currentServer?.close();
    if (worktree) execFileSync('git', ['worktree', 'remove', '--force', baselineRoot], { cwd: root, stdio: 'pipe', timeout: 30000 });
    fs.rmSync(temp, { recursive: true, force: true });
    report.summaries = summarize(); writeReport();
  }
  console.log(JSON.stringify({ schema: report.schema, pass: report.pass, profileOnly, phase, cases: report.rows.length,
    pdfCases: report.pdfRows.length, comparisons: report.comparisons.length, pdfComparisons: report.pdfComparisons.length,
    networkComparisons: report.networkComparisons.length,
    outputParity: report.outputParity, chrome: report.chromeVersion }));
  if (!report.pass) process.exitCode = 1;
}

module.exports = { openSession, awaitInitialOutcome, documentEvidence, printPreflight, safeError };

if (require.main === module) main().catch(error => {
  report.pass = false; report.failures.push(safeError(error)); report.summaries = summarize(); writeReport();
  console.error(JSON.stringify({ pass: false, failure: safeError(error) })); process.exitCode = 1;
});
