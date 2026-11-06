'use strict';

// Real Chrome contract checks for snapshot reuse and failure recovery. The
// existing 50-question benchmark covers performance; these independent contexts
// use eight unchanged real questions to make fault injection quick and bounded.
// Persist only identities, hashes, geometry, outcome codes and timings.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const H = require('./archive2-solution-loading-browser.cjs');
const P = require('./archive2-output-performance-browser.cjs');

const root = path.resolve(__dirname, '..');
const reportDir = path.resolve(process.env.ARCHIVE_CACHE_REPORT_DIR || path.join(os.tmpdir(), 'archive-output-cache'));
const deadline = Date.now() + 4 * 60 * 1000;
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const round = value => Number(Number(value).toFixed(2));
const report = { schema: 'ARCHIVE_OUTPUT_CACHE_CHROME_V1', rows: [], cases: [],
  conditions: { viewport: { width: 1440, height: 1000 }, network: 'unthrottled', prewarm: false,
    fixturePurpose: 'focused fault and invalidation contracts; full-input timings remain in the performance suite',
    rowPassMeaning: 'render readiness only; intentionally failed requests remain false, while case.pass validates their failure behavior' } };

function requireThat(value, code, details = {}) {
  if (!value) throw Object.assign(new Error(code), { code, details });
}
function writeReport() {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'output-cache.json'), JSON.stringify(report, null, 2));
}
function remaining(cap = 45000) {
  const value = Math.min(cap, deadline - Date.now());
  requireThat(value > 0, 'CACHE_SUITE_TIME_BUDGET_EXCEEDED');
  return value;
}
async function bounded(promise, cap = 45000) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(Object.assign(new Error('CACHE_OPERATION_TIMEOUT'), { code: 'CACHE_OPERATION_TIMEOUT' })), remaining(cap));
    })]);
  } finally { clearTimeout(timer); }
}

async function stateEvidence(page) {
  return page.evaluate(async () => {
    const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('');
    const state = window.AppState;
    const runtime = window.mixedScreenRuntime;
    const envelope = window.__AP_OUTPUT_ENVELOPE__;
    const verified = window.__AP_OUTPUT_ENVELOPE_READY__;
    const rendered = window.__AP_OUTPUT_RENDER_READY__;
    const area = document.getElementById('print-area');
    const params = new URLSearchParams(location.search);
    const controls = [...document.querySelectorAll('input,select,textarea')].map(node => ({
      id: node.id, name: node.name, value: node.value, checked: node.checked, selectedIndex: node.selectedIndex
    }));
    const same = value => !!value && !!envelope && value.outputRequestId === envelope.outputRequestId &&
      value.payloadHash === envelope.payloadHash && value.contractVersion === envelope.contractVersion;
    // A pending-request observation must not wait for the held request itself.
    const ready = await Promise.race([Promise.resolve(window.__AP_RENDER_READY__).catch(() => ({ ok: false })),
      new Promise(resolve => setTimeout(() => resolve(null), 0))]);
    return { mode: state.mode, qpp: state.qpp, snapshotId: runtime.activeSnapshot?.snapshotId,
      sessionId: runtime.currentSession?.sessionId, snapshotMode: runtime.activeSnapshot?.mode,
      candidateMode: runtime.committedCandidate?.mode, activeRootMatches: runtime.activeSnapshot?.rootNode === area,
      keyHash: await digest(runtime.activeSnapshot?.key || ''),
      inputControlsHash: await digest(JSON.stringify(controls)),
      headerOptionsHash: await digest(JSON.stringify(state.printHeaderOptions)),
      headerTextHash: await digest([...area.querySelectorAll('.page-header')].map(node => node.textContent).join('\n')),
      renderOutcomeOk: ready?.ok === true, envelopePresent: !!envelope,
      outputRequestId: envelope?.outputRequestId || null, payloadHash: envelope?.payloadHash || null,
      envelopeMode: envelope?.mode || null, urlMode: params.get('mode'), urlRequestId: params.get('outputRequestId'),
      verifiedIdentityMatches: same(verified), renderedIdentityMatches: same(rendered),
      renderReadyPresent: !!rendered, renderErrorPresent: !!window.__AP_OUTPUT_RENDER_ERROR__,
      qr: { submit: params.get('showSubmitQr'), solution: params.get('solQr'),
        submitCount: area.querySelectorAll('.page-submit-qr').length,
        solutionCount: area.querySelectorAll('.page-qr').length,
        canvases: area.querySelectorAll('.page-submit-qr canvas,.page-qr canvas').length },
      activeTabMode: [...document.querySelectorAll('.mode-tab.active')].map(node => node.id.replace(/^btn-/, '')),
      printButtonDisabled: !!document.getElementById('btn-print')?.disabled,
      runtimeBusy: runtime.busy,
      fault: window.__outputCacheQA?.fault ? { entered: window.__outputCacheQA.fault.entered,
        calls: window.__outputCacheQA.fault.calls } : null };
  });
}

async function collect(session, name, outcome, elapsedMs = null) {
  const row = await H.capture(session.page, outcome);
  Object.assign(row, await P.documentEvidence(session.page), {
    name, elapsedMs: elapsedMs === null ? null : round(elapsedMs), binding: await stateEvidence(session.page), pass: false
  });
  report.rows.push(row);
  writeReport();
  return row;
}

function assertReady(row, count, strict) {
  H.assertReady(row, count, row.name);
  const b = row.binding;
  requireThat(b.activeRootMatches && b.mode === b.snapshotMode && b.mode === b.candidateMode && b.urlMode === b.mode,
    'VISIBLE_MODE_BINDING_MISMATCH', { name: row.name, mode: b.mode, snapshotMode: b.snapshotMode, candidateMode: b.candidateMode, urlMode: b.urlMode });
  requireThat(b.activeTabMode.length === 1 && b.activeTabMode[0] === b.mode, 'ACTIVE_MODE_CONTROL_MISMATCH');
  requireThat(row.clippingCount === 0 && row.pageOverflowCount === 0, 'VISIBLE_CONTENT_NOT_PRINT_READY',
    { clippingCount: row.clippingCount, pageOverflowCount: row.pageOverflowCount });
  if (strict) requireThat(b.envelopePresent && b.envelopeMode === b.mode && b.outputRequestId === b.urlRequestId &&
    b.verifiedIdentityMatches && b.renderedIdentityMatches && b.renderOutcomeOk && !b.renderErrorPresent,
    'ENVELOPE_BINDING_NOT_READY', { name: row.name, binding: b });
  row.pass = true;
}

function compareVisible(before, after) {
  // Failure cases deliberately keep a previously valid visible document. This
  // compares that document only; the failed request itself never becomes ready.
  const parity = H.compareRows({ ...before, pass: true }, { ...after, pass: true });
  for (const key of ['inputHash', 'mathMarkupHash', 'clippingCount', 'pageOverflowCount', 'continuationCount'])
    requireThat(before[key] === after[key], 'VISIBLE_DOCUMENT_CHANGED', { field: key });
  requireThat(JSON.stringify(before.mathGeometry) === JSON.stringify(after.mathGeometry), 'MATH_GEOMETRY_CHANGED');
  return parity;
}

async function beginOperation(page, mode) {
  await page.evaluate(mode => {
    const qa = window.__solutionLoadingQA;
    const profile = window.__outputPerformance;
    profile.operation += 1;
    profile.runtimeReadyAt = null; profile.envelopeReadyAt = null;
    Object.assign(qa, { operationStart: performance.now(), targetMode: mode,
      previousArea: document.getElementById('print-area'), firstBoxMs: null });
  }, mode);
}

async function operation(session, name, mode, action = 'mode', payload = null) {
  const page = session.page;
  await beginOperation(page, mode);
  const result = await bounded(page.evaluate(async ({ action, mode, payload }) => {
    const area = document.getElementById('print-area');
    const started = performance.now();
    let value, error;
    try {
      if (action === 'mode') value = await window.switchMode(mode);
      else if (action === 'qpp') value = await window.changeQpp(payload);
      else if (action === 'header') value = await window.setPrintHeaderOptions(payload);
      else if (action === 'qr') value = await window.setQrOutputParam(payload.type, payload.checked);
      else if (action === 'source') {
        const data = JSON.parse(JSON.stringify(window.AppState.data));
        const field = Object.hasOwn(data[0], 'content') ? 'content' : 'question';
        data[0][field] = String(data[0][field] || '') + '<span data-cache-qa-marker="1"> cache-QA</span>';
        value = await window.mixedScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { data } });
      } else throw new Error('UNKNOWN_CACHE_TEST_ACTION');
    } catch (caught) { error = await window.__outputPerformance.classifyError(caught); }
    const elapsedMs = performance.now() - started;
    if (area === document.getElementById('print-area')) window.__solutionLoadingQA.firstBoxMs = 0;
    if (!error && value?.ok !== true) error = await window.__outputPerformance.classifyError({
      code: value?.code, message: value?.message || value?.code || 'RENDER_OUTCOME_MISSING'
    });
    return { elapsedMs, outcome: { ok: value?.ok === true && !error, code: error?.code || null,
      ...(error ? { error } : {}) } };
  }, { action, mode, payload }));
  return collect(session, name, result.outcome, result.elapsedMs);
}

async function remember(page, mode) {
  await page.evaluate(mode => { window.__outputCacheQA.roots[mode] = document.getElementById('print-area'); }, mode);
}
async function assertHit(session, before, after) {
  requireThat(after.cacheStatus === 'HIT', 'EXPECTED_SNAPSHOT_CACHE_HIT', { name: after.name, cacheStatus: after.cacheStatus });
  requireThat(after.snapshotId === before.snapshotId, 'CACHE_HIT_SNAPSHOT_ID_CHANGED');
  requireThat(after.operationMath.calls === 0 && !after.adapters.some(item => item.method === 'build'), 'CACHE_HIT_REBUILT_OUTPUT',
    { mathCalls: after.operationMath.calls, buildCalls: after.adapters.filter(item => item.method === 'build').length });
  requireThat(await session.page.evaluate(mode => window.__outputCacheQA.roots[mode] === document.getElementById('print-area'), after.mode),
    'CACHE_HIT_REPLACED_RENDERED_ROOT');
  const parity = compareVisible(before, after);
  if (after.binding.envelopePresent) requireThat(after.binding.outputRequestId !== before.binding.outputRequestId,
    'REUSED_SNAPSHOT_HAS_STALE_OUTPUT_REQUEST_ID');
  return parity;
}

async function printCheck(session, before, expectedSuccess, name) {
  const page = session.page;
  await beginOperation(page, before.mode);
  const print = await bounded(page.evaluate(async () => {
    const qa = window.__solutionLoadingQA;
    const previous = { prints: qa.prints, alerts: qa.alerts, attempts: window.mixedScreenRuntime.inspect().attempts.length };
    const started = performance.now();
    await window.safePrint('vector');
    return { ...previous, elapsedMs: performance.now() - started };
  }));
  await page.waitForFunction(() => !document.getElementById('btn-print')?.disabled && !window.mixedScreenRuntime.busy,
    null, { timeout: remaining(15000), polling: 20 });
  const result = await page.evaluate(previous => {
    const qa = window.__solutionLoadingQA;
    if (qa.previousArea === document.getElementById('print-area')) qa.firstBoxMs = 0;
    return { printCalls: qa.prints - previous.prints, alerts: qa.alerts - previous.alerts,
      newAttempts: window.mixedScreenRuntime.inspect().attempts.length - previous.attempts,
      event: qa.prints > previous.prints ? qa.printEvents.at(-1) : null };
  }, print);
  const after = await collect(session, name, before.outcome, print.elapsedMs);
  const parity = compareVisible(before, after);
  requireThat(after.snapshotId === before.snapshotId, 'PRINT_CHANGED_READY_SNAPSHOT');
  requireThat(result.newAttempts === 0 && after.operationMath.calls === 0, 'PRINT_REBUILT_READY_DOCUMENT',
    { attempts: result.newAttempts, mathCalls: after.operationMath.calls });
  if (expectedSuccess) {
    requireThat(result.printCalls === 1 && result.alerts === 0, 'SAFE_PRINT_DID_NOT_PRINT_ONCE', result);
    requireThat(result.event?.mode === before.mode && result.event.candidateMode === before.mode &&
      result.event.snapshotId === before.snapshotId && result.event.readyOutcome?.ok === true,
      'SAFE_PRINT_USED_WRONG_OR_FAILED_OUTPUT');
    assertReady(after, session.fixture.questions.length, session.fixture.kind === 'envelope');
  } else {
    requireThat(result.printCalls === 0 && result.alerts > 0, 'FAILED_OUTPUT_WAS_NOT_PRINT_BLOCKED', result);
    after.failureWasBlocked = true;
  }
  return { ...result, elapsedMs: round(print.elapsedMs), visibleParity: parity };
}

function assertFailurePreserved(before, after) {
  requireThat(!after.outcome.ok, 'INJECTED_FAILURE_WAS_HIDDEN');
  requireThat(after.attempts.at(-1)?.state === 'FAILED' && !after.attempts.at(-1)?.committed,
    'FAILED_RENDER_WAS_COMMITTED');
  requireThat(after.feedback.state === 'failed' && after.feedback.visible && after.feedback.retry,
    'FAILED_RENDER_FEEDBACK_OR_RETRY_MISSING');
  compareVisible(before, after);
  for (const key of ['mode', 'qpp', 'snapshotId', 'sessionId', 'snapshotMode', 'candidateMode', 'keyHash',
    'inputControlsHash', 'headerOptionsHash', 'outputRequestId', 'payloadHash', 'envelopeMode', 'urlMode', 'urlRequestId', 'verifiedIdentityMatches'])
    requireThat(before.binding[key] === after.binding[key], 'FAILURE_DID_NOT_PRESERVE_STATE', { field: key });
  requireThat(after.binding.activeRootMatches, 'FAILED_RENDER_LOST_ACTIVE_ROOT');
  requireThat(JSON.stringify(before.binding.activeTabMode) === JSON.stringify(after.binding.activeTabMode), 'FAILED_RENDER_CHANGED_ACTIVE_MODE_CONTROL');
}

async function reuseAndPrint(session, initial) {
  requireThat(initial.cacheStatus === 'MISS', 'INITIAL_RENDER_DID_NOT_BUILD');
  await remember(session.page, 'exam');
  const sol = await operation(session, 'first-solution-miss', 'sol');
  assertReady(sol, 8, true); requireThat(sol.cacheStatus === 'MISS', 'FIRST_SOLUTION_WAS_NOT_MISS');
  await remember(session.page, 'sol');
  const ans = await operation(session, 'first-answer-miss', 'ans');
  assertReady(ans, 8, true); requireThat(ans.cacheStatus === 'MISS', 'FIRST_ANSWER_WAS_NOT_MISS');
  await remember(session.page, 'ans');
  const examHit = await operation(session, 'warm-exam-hit', 'exam');
  assertReady(examHit, 8, true); await assertHit(session, initial, examHit);
  const solHit = await operation(session, 'warm-solution-hit', 'sol');
  assertReady(solHit, 8, true); await assertHit(session, sol, solHit);
  const same = await operation(session, 'same-solution-reentry', 'sol');
  assertReady(same, 8, true); compareVisible(solHit, same);
  requireThat(same.attemptCount === solHit.attemptCount && same.snapshotId === solHit.snapshotId &&
    same.operationMath.calls === 0 && !same.adapters.some(item => item.method === 'build'), 'SAME_READY_MODE_REBUILT');
  const print = await printCheck(session, same, true, 'warm-safe-print-vector');
  const ansHit = await operation(session, 'warm-answer-hit', 'ans');
  assertReady(ansHit, 8, true); await assertHit(session, ans, ansHit);
  await session.page.evaluate(() => {
    const snapshot = window.mixedScreenRuntime.currentSession.modeSnapshots.sol;
    snapshot.rootNode.querySelector('.sol-box').setAttribute('data-cache-qa-mutation', '1');
  });
  const repaired = await operation(session, 'mutated-inactive-snapshot-rebuilt', 'sol');
  assertReady(repaired, 8, true);
  requireThat(repaired.cacheStatus === 'MISS' && repaired.snapshotId !== sol.snapshotId &&
    repaired.adapters.some(item => item.method === 'build'), 'MUTATED_CACHE_WAS_REUSED');
  compareVisible(sol, repaired);
  requireThat(await session.page.locator('#print-area [data-cache-qa-mutation]').count() === 0, 'CACHE_MUTATION_LEAKED_INTO_OUTPUT');
  return { initialMiss: true, modeHits: ['exam', 'sol', 'ans'], sameModeNoBuild: true, print, corruptedSnapshotRebuilt: true };
}

async function invalidation(session, initial) {
  const changed = await operation(session, 'same-uid-source-change', 'exam', 'source');
  assertReady(changed, 8, false);
  requireThat(changed.cacheStatus === 'MISS' && changed.snapshotId !== initial.snapshotId &&
    changed.inputHash !== initial.inputHash && changed.bodyHash !== initial.bodyHash, 'SOURCE_CHANGE_USED_STALE_CONTENT');
  requireThat(JSON.stringify(changed.inputUids) === JSON.stringify(initial.inputUids) &&
    JSON.stringify(changed.sourceOrder) === JSON.stringify(initial.sourceOrder), 'SOURCE_CHANGE_TEST_CHANGED_IDENTITIES');
  await remember(session.page, 'exam');
  const sol = await operation(session, 'changed-source-solution', 'sol');
  assertReady(sol, 8, false);
  const warm = await operation(session, 'changed-source-exam-hit', 'exam');
  assertReady(warm, 8, false); await assertHit(session, changed, warm);
  const qpp = await operation(session, 'qpp-invalidation', 'exam', 'qpp', 2);
  assertReady(qpp, 8, false);
  requireThat(qpp.cacheStatus === 'MISS' && qpp.snapshotId !== warm.snapshotId && qpp.qpp === 2 &&
    qpp.inputHash === warm.inputHash && qpp.pageCount >= warm.pageCount, 'QPP_CHANGE_NOT_APPLIED');
  const header = await operation(session, 'header-invalidation', 'exam', 'header', { subtitle: 'Cache invalidation verification' });
  assertReady(header, 8, false);
  requireThat(header.cacheStatus === 'MISS' && header.snapshotId !== qpp.snapshotId && header.inputHash === qpp.inputHash &&
    header.binding.headerOptionsHash !== qpp.binding.headerOptionsHash && header.binding.headerTextHash !== qpp.binding.headerTextHash,
    'HEADER_CHANGE_NOT_APPLIED');
  const qr = await operation(session, 'qr-invalidation', 'exam', 'qr', { type: 'submit', checked: true });
  assertReady(qr, 8, false);
  requireThat(qr.cacheStatus === 'MISS' && qr.snapshotId !== header.snapshotId && qr.inputHash === header.inputHash &&
    qr.binding.qr.submit === '1' && qr.binding.qr.submitCount > 0 && qr.binding.qr.canvases > 0, 'QR_CHANGE_NOT_APPLIED');
  await remember(session.page, 'exam');
  const ans = await operation(session, 'changed-options-answer', 'ans');
  assertReady(ans, 8, false);
  const reused = await operation(session, 'changed-options-exam-hit', 'exam');
  assertReady(reused, 8, false); await assertHit(session, qr, reused);
  return { sameUidContentInvalidated: true, qppInvalidated: true, headerInvalidated: true,
    qrInvalidated: true, changedOptionsReused: true };
}

async function typesetFailure(session) {
  await session.page.evaluate(() => {
    document.getElementById('print-header-title-input').value = 'Unsubmitted cache QA input';
    const original = window.APRenderLoop.typeset;
    window.__outputCacheQA.fault = { entered: false, calls: 0 };
    window.APRenderLoop.typeset = async function (...args) {
      if (args[0] === 'solution-staging') {
        window.APRenderLoop.typeset = original;
        Object.assign(window.__outputCacheQA.fault, { entered: true, calls: 1 });
        throw Object.assign(new Error('QA_TYPESET_FAILURE'), { code: 'QA_TYPESET_FAILURE' });
      }
      return original.apply(this, args);
    };
  });
  const before = await collect(session, 'before-typeset-failure', { ok: true });
  assertReady(before, 8, true);
  const failed = await operation(session, 'typeset-failure-preserves-exam', 'sol');
  requireThat(failed.binding.fault?.entered && failed.binding.fault.calls === 1, 'TYPESET_FAULT_NOT_EXERCISED');
  assertFailurePreserved(before, failed);
  const blocked = await printCheck(session, failed, false, 'failed-typeset-print-blocked');
  const retry = await operation(session, 'typeset-retry-succeeds', 'sol');
  assertReady(retry, 8, true);
  requireThat(retry.cacheStatus === 'MISS', 'FAILED_SOLUTION_WAS_CACHED');
  const printed = await printCheck(session, retry, true, 'recovered-typeset-print');
  return { failedRequestPreservedVisibleDocument: true, inputPreserved: true, retry: true, blocked, printed };
}

async function layoutFailure(session, initial) {
  await session.page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'qa-force-answer-clipping';
    style.textContent = '#print-area .ans-cell{max-width:1px!important;overflow:hidden!important;white-space:nowrap!important}';
    document.head.appendChild(style);
  });
  const failed = await operation(session, 'actual-clipping-rolls-back-commit', 'ans');
  assertFailurePreserved(initial, failed);
  requireThat(failed.outcome.error?.code === 'PDF_CONTENT_CLIPPED', 'LAYOUT_FAULT_REJECTED_FOR_WRONG_REASON',
    { actualCode: failed.outcome.code });
  await session.page.evaluate(() => document.getElementById('qa-force-answer-clipping').remove());
  const retry = await operation(session, 'layout-retry-succeeds', 'ans');
  assertReady(retry, 8, true);
  return { realClippingRejected: true, previousDocumentAndBindingPreserved: true, retry: true };
}

async function latestRequest(session, initial) {
  await beginOperation(session.page, 'sol');
  await session.page.evaluate(() => {
    const qa = window.__outputCacheQA;
    const original = window.APRenderLoop.typeset;
    let release;
    const held = new Promise(resolve => { release = resolve; });
    qa.release = release; qa.fault = { entered: false, calls: 0 };
    window.APRenderLoop.typeset = async function (...args) {
      if (!qa.fault.entered && args[0] === 'solution-staging') {
        qa.fault.entered = true; qa.fault.calls += 1;
        await held;
        window.APRenderLoop.typeset = original;
      }
      return original.apply(this, args);
    };
    qa.first = Promise.resolve(window.switchMode('sol')).then(value => ({ ok: value?.ok === true,
      code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(value?.code || '') ? value.code : value?.code ? 'RENDER_FAILED' : null }),
      async error => ({ ok: false, error: await window.__outputPerformance.classifyError(error) }));
  });
  await session.page.waitForFunction(() => window.__outputCacheQA.fault.entered, null, { timeout: remaining(20000), polling: 20 });
  // While MathJax is actually pending, the previously committed document and
  // transport identity must still be on screen.
  const pending = await collect(session, 'pending-solution-keeps-exam', { ok: false, code: 'QA_PENDING' });
  compareVisible(initial, pending);
  requireThat(pending.snapshotId === initial.snapshotId && pending.binding.outputRequestId === initial.binding.outputRequestId &&
    pending.binding.urlRequestId === initial.binding.urlRequestId, 'PENDING_REQUEST_CHANGED_COMMITTED_BINDING');
  const result = await bounded(session.page.evaluate(async () => {
    const qa = window.__outputCacheQA;
    window.__solutionLoadingQA.targetMode = 'ans';
    const latest = Promise.resolve(window.switchMode('ans')).then(value => ({ ok: value?.ok === true,
      code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(value?.code || '') ? value.code : value?.code ? 'RENDER_FAILED' : null }),
      async error => ({ ok: false, error: await window.__outputPerformance.classifyError(error) }));
    qa.release();
    const [first, last] = await Promise.all([qa.first, latest]);
    await window.mixedScreenRuntime.whenIdle();
    return { first, last };
  }));
  const after = await collect(session, 'latest-answer-wins', result.last);
  assertReady(after, 8, true);
  requireThat(!result.first.ok && result.last.ok && after.mode === 'ans' && after.binding.envelopeMode === 'ans',
    'LATEST_PUBLIC_REQUEST_DID_NOT_WIN', result);
  requireThat(after.attempts.some(attempt => !attempt.committed &&
    (attempt.state === 'DISCARDED_STALE' || attempt.code === 'DISCARDED_STALE')),
    'SUPERSEDED_BUILD_WAS_NOT_DISCARDED');
  return { first: result.first, latest: result.last, finalMode: after.mode, oldDocumentPreservedWhilePending: true };
}

async function finalReadinessFailure(session, initial) {
  await session.page.evaluate(() => {
    document.getElementById('print-header-title-input').value = 'Unsubmitted final-readiness QA input';
    const original = window.Archive2PdfReadiness.assertReady;
    window.__outputCacheQA.fault = { entered: false, calls: 0 };
    window.Archive2PdfReadiness.assertReady = async function (...args) {
      const result = await original.apply(this, args);
      if (window.mixedScreenRuntime.activeSnapshot?.mode === 'sol') {
        window.Archive2PdfReadiness.assertReady = original;
        Object.assign(window.__outputCacheQA.fault, { entered: true, calls: 1 });
        throw Object.assign(new Error('QA_FINAL_PDF_FAILURE'), { code: 'QA_FINAL_PDF_FAILURE' });
      }
      return result;
    };
  });
  const before = await collect(session, 'before-final-readiness-failure', initial.outcome);
  assertReady(before, 8, true);
  const failed = await operation(session, 'final-pdf-readiness-failure', 'sol');
  requireThat(!failed.outcome.ok && failed.outcome.code === 'QA_FINAL_PDF_FAILURE' && failed.binding.fault?.entered,
    'FINAL_PDF_FAULT_NOT_OBSERVED');
  assertFailurePreserved(before, failed);
  const blocked = await printCheck(session, failed, false, 'final-pdf-failure-print-blocked');
  const retry = await operation(session, 'final-pdf-retry-preserved-target-mode', 'sol');
  assertReady(retry, 8, true);
  const printed = await printCheck(session, retry, true, 'final-pdf-recovered-print');
  return { failureVisible: true, previousDocumentAndBindingPreserved: true, targetModeRetry: true, blocked, printed };
}

async function abortPendingDecode(session, initial) {
  await beginOperation(session.page, 'sol');
  await session.page.evaluate(async () => {
    const qa = window.__outputCacheQA;
    const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('');
    qa.oldRoot = document.getElementById('print-area');
    qa.oldSnapshot = window.mixedScreenRuntime.activeSnapshot;
    qa.oldRootHash = await digest(qa.oldRoot.innerHTML);
    qa.oldRequestId = window.__AP_OUTPUT_ENVELOPE__.outputRequestId;
    qa.decodeReleased = false; qa.decodeSettled = false; qa.latestRequested = false;
    qa.fault = { entered: false, calls: 0 };
    qa.rollbackObservation = null;
    qa.observer = new MutationObserver(() => {
      if (!qa.latestRequested || document.getElementById('print-area') !== qa.oldRoot) return;
      const runtime = window.mixedScreenRuntime;
      const params = new URLSearchParams(location.search);
      qa.rollbackObservation = { oldRootRestored: true,
        oldSnapshotRestored: runtime.activeSnapshot === qa.oldSnapshot,
        mode: window.AppState.mode, candidateMode: runtime.committedCandidate?.mode,
        oldEnvelopeRestored: window.__AP_OUTPUT_ENVELOPE__?.outputRequestId === qa.oldRequestId,
        oldUrlRestored: params.get('outputRequestId') === qa.oldRequestId && params.get('mode') === 'exam' };
    });
    qa.observer.observe(document, { childList: true, subtree: true });
    const originalAssertReady = window.Archive2PdfReadiness.assertReady;
    let release;
    const held = new Promise(resolve => { release = resolve; });
    qa.releaseDecode = () => { qa.decodeReleased = true; release(); };
    window.Archive2PdfReadiness.assertReady = async function (...args) {
      if (!qa.fault.installed && window.mixedScreenRuntime.activeSnapshot?.mode === 'sol') {
        qa.fault.installed = true;
        const image = document.querySelector('#print-area img');
        if (!image || typeof image.decode !== 'function') throw new Error('QA_DECODE_IMAGE_MISSING');
        const originalDecode = image.decode;
        image.decode = function () {
          if (qa.fault.entered) return originalDecode.call(this);
          qa.fault.entered = true; qa.fault.calls += 1; qa.decodeStartedAt = performance.now();
          qa.heldDecode = held.then(() => originalDecode.call(image)).then(() => { qa.decodeSettled = true; });
          return qa.heldDecode;
        };
        // The normal build has already waited for its images. Only this real
        // finalizer's decode is held; later candidate images are untouched.
        try { return await originalAssertReady.apply(this, args); }
        finally { image.decode = originalDecode; window.Archive2PdfReadiness.assertReady = originalAssertReady; }
      }
      return originalAssertReady.apply(this, args);
    };
    qa.first = Promise.resolve(window.switchMode('sol')).then(value => ({ ok: value?.ok === true,
      code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(value?.code || '') ? value.code : value?.code ? 'RENDER_FAILED' : null }),
      async error => ({ ok: false, error: await window.__outputPerformance.classifyError(error) }));
  });
  await session.page.waitForFunction(() => window.__outputCacheQA.fault.entered, null, { timeout: remaining(20000), polling: 20 });
  const pending = await collect(session, 'full-finalizer-decode-pending', { ok: false, code: 'QA_DECODE_PENDING' });
  const oldRoot = await session.page.evaluate(async () => {
    const qa = window.__outputCacheQA;
    const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('');
    return { unchanged: await digest(qa.oldRoot.innerHTML) === qa.oldRootHash,
      retainedBySnapshot: qa.oldSnapshot.rootNode === qa.oldRoot,
      pages: qa.oldRoot.querySelectorAll('.page').length,
      visibleModeWhileFinalizing: window.AppState.mode, decodeReleased: qa.decodeReleased };
  });
  requireThat(oldRoot.unchanged && oldRoot.retainedBySnapshot && oldRoot.pages === initial.pageCount &&
    !oldRoot.decodeReleased && pending.binding.fault?.entered, 'PENDING_FINALIZER_DESTROYED_PREVIOUS_DOCUMENT');
  await beginOperation(session.page, 'ans');
  const result = await bounded(session.page.evaluate(async () => {
    const qa = window.__outputCacheQA;
    qa.latestRequested = true;
    const started = performance.now();
    const latest = Promise.resolve(window.switchMode('ans')).then(value => ({ ok: value?.ok === true,
      code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(value?.code || '') ? value.code : value?.code ? 'RENDER_FAILED' : null }),
      async error => ({ ok: false, error: await window.__outputPerformance.classifyError(error) }));
    const [first, last] = await Promise.all([qa.first, latest]);
    const elapsedMs = performance.now() - started;
    await window.mixedScreenRuntime.whenIdle();
    return { first, last, elapsedMs, decodeReleased: qa.decodeReleased, decodeSettled: qa.decodeSettled,
      elapsedSinceDecodeStartMs: performance.now() - qa.decodeStartedAt, rollback: qa.rollbackObservation };
  }), 10000);
  const after = await collect(session, 'latest-answer-cancels-held-decode', result.last, result.elapsedMs);
  assertReady(after, 8, true);
  requireThat(!result.first.ok && result.last.ok && after.mode === 'ans', 'HELD_DECODE_PREVENTED_LATEST_REQUEST', result);
  requireThat(!result.decodeReleased && !result.decodeSettled && result.elapsedMs < 3000,
    'LATEST_REQUEST_WAITED_FOR_OLD_DECODE_TIMEOUT', { elapsedMs: round(result.elapsedMs), maxMs: 3000,
      decodeReleased: result.decodeReleased, decodeSettled: result.decodeSettled });
  requireThat(after.attempts.some(attempt => !attempt.committed &&
    (attempt.state === 'DISCARDED_STALE' || attempt.code === 'DISCARDED_STALE')),
    'HELD_DECODE_REQUEST_WAS_NOT_DISCARDED');
  requireThat(result.rollback?.oldRootRestored && result.rollback.oldSnapshotRestored &&
    result.rollback.mode === 'exam' && result.rollback.candidateMode === 'exam' &&
    result.rollback.oldEnvelopeRestored && result.rollback.oldUrlRestored,
    'CANCELED_FINALIZER_DID_NOT_RESTORE_PREVIOUS_VIEW', { rollback: result.rollback });
  await bounded(session.page.evaluate(async () => {
    const qa = window.__outputCacheQA;
    qa.releaseDecode();
    await qa.heldDecode;
    await window.mixedScreenRuntime.whenIdle();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    qa.observer.disconnect();
    if (!qa.decodeSettled) throw new Error('QA_HELD_DECODE_DID_NOT_SETTLE');
    window.__solutionLoadingQA.firstBoxMs = 0;
  }), 10000);
  const settled = await collect(session, 'released-old-decode-cannot-overwrite-answer', result.last);
  assertReady(settled, 8, true);
  compareVisible(after, settled);
  for (const key of ['snapshotId', 'outputRequestId', 'payloadHash', 'mode', 'urlMode', 'urlRequestId'])
    requireThat(after.binding[key] === settled.binding[key], 'LATE_DECODE_OVERWROTE_LATEST_OUTPUT', { field: key });
  requireThat(after.attemptCount === settled.attemptCount, 'LATE_DECODE_STARTED_UNEXPECTED_RENDER');
  return { first: result.first, latest: result.last, latestReadyMs: round(result.elapsedMs), maxLatestReadyMs: 3000,
    heldDecodeStillPendingAtLatestReady: true, previousDocumentRetainedWhilePending: oldRoot,
    previousViewRestoredBeforeLatestCommit: result.rollback, noOverwriteAfterNativeDecodeSettled: true };
}

async function runCase(browser, server, fixture, name, work) {
  let session;
  try {
    session = await bounded(P.openSession(browser, server, fixture, 'exam', false));
    session.page.setDefaultTimeout(remaining());
    await session.page.goto(session.url, { waitUntil: 'domcontentloaded', timeout: remaining() });
    const outcome = await bounded(P.awaitInitialOutcome(session.page, fixture.kind === 'envelope'));
    await session.page.evaluate(() => { window.__outputCacheQA = { roots: {} }; });
    const initial = await collect(session, name + '-initial', outcome);
    assertReady(initial, fixture.questions.length, fixture.kind === 'envelope');
    const evidence = await work(session, initial);
    requireThat(session.errors.length === 0, 'UNEXPECTED_BROWSER_ERROR', { errors: session.errors });
    report.cases.push({ name, pass: true, ...evidence });
    console.log(JSON.stringify({ name, pass: true }));
  } catch (error) {
    const failure = { name, pass: false, error: P.safeError(error) };
    report.cases.push(failure);
    console.log(JSON.stringify(failure));
  } finally { await session?.close(); writeReport(); }
}

async function main() {
  const chrome = process.env.CHROME_BIN;
  requireThat(chrome && fs.existsSync(chrome), 'REAL_CHROME_BIN_REQUIRED');
  const questions = H.realFixture(root).slice(0, 8);
  requireThat(questions.length === 8, 'CACHE_REAL_FIXTURE_INCOMPLETE');
  report.currentSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  report.fixture = { questions: questions.length, inputSha256: hash(JSON.stringify(questions)),
    sources: [H.sourceFiles[0]], modifiedOnlyInBrowser: ['same-uid-source-change'] };
  const envelope = { id: 'cache-real8', kind: 'envelope', questions, sources: [H.sourceFiles[0]] };
  const legacy = { ...envelope, id: 'cache-editor-real8', kind: 'legacy' };
  let browser, server;
  try {
    server = await H.serve(root);
    browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    report.chromeVersion = browser.version();
    await runCase(browser, server, envelope, 'strict-cache-reuse-and-print', reuseAndPrint);
    await runCase(browser, server, legacy, 'editor-source-and-option-invalidation', invalidation);
    await runCase(browser, server, envelope, 'typeset-failure-and-retry', typesetFailure);
    await runCase(browser, server, envelope, 'actual-layout-failure-and-rollback', layoutFailure);
    await runCase(browser, server, envelope, 'latest-public-request-wins', latestRequest);
    await runCase(browser, server, envelope, 'final-readiness-failure-and-retry', finalReadinessFailure);
    await runCase(browser, server, envelope, 'pending-finalizer-decode-cancellation', abortPendingDecode);
    report.pass = report.cases.length === 7 && report.cases.every(row => row.pass);
  } finally { await browser?.close(); await server?.close(); writeReport(); }
  console.log(JSON.stringify({ schema: report.schema, pass: report.pass, cases: report.cases.length, chrome: report.chromeVersion }));
  if (!report.pass) process.exitCode = 1;
}

if (require.main === module) main().catch(error => {
  report.pass = false; report.fatal = P.safeError(error); writeReport();
  console.error(JSON.stringify({ pass: false, error: report.fatal })); process.exitCode = 1;
});
