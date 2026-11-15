'use strict';

// Actual Chrome qualification. Reports contain identities, hashes and geometry;
// never question/answer/solution text, DOM dumps, screenshots or browser logs.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const baseSha = process.env.ARCHIVE_SOLUTION_BASE_SHA || require('./archive2-output-comparison-references.json').originalReference;
const reportDir = path.resolve(process.env.ARCHIVE_SOLUTION_REPORT_DIR || path.join(os.tmpdir(), 'archive-solution-loading-evidence'));
const repeats = Number(process.env.ARCHIVE_SOLUTION_REPEATS || 2);
const sourceFiles = [
  'archive/exams/original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js',
  'archive/exams/original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js',
  'archive/exams/original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js'
];
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><rect x="20" y="20" width="110" height="50" fill="white" stroke="black"/></svg>';
const hash = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const report = { schema: 'ARCHIVE_SOLUTION_LOADING_CHROME_V1', baselineSha: baseSha, rows: [], comparisons: [] };
let deadline = Infinity;

function requireThat(value, code, details = {}) {
  if (!value) throw Object.assign(new Error(code), { code, details });
}
function safeError(error) {
  return {
    code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error?.code || '') ? error.code : 'BROWSER_QUALIFICATION_FAILED',
    name: String(error?.name || 'Error'), messageSha256: hash(error?.message || ''),
    // Only our assertions attach details; external errors may include source data.
    ...(error?.code && error?.message === error.code ? { details: error.details || {} } : {})
  };
}
function writeReport() {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'solution-loading.json'), JSON.stringify(report, null, 2));
}
function remaining(cap = 45000) {
  const ms = Math.min(cap, deadline - Date.now());
  requireThat(ms > 0, 'BROWSER_SUITE_TIME_BUDGET_EXCEEDED');
  return ms;
}
async function bounded(promise, cap, code) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(Object.assign(new Error(code), { code })), remaining(cap));
    })]);
  } finally { clearTimeout(timer); }
}
async function record(name, work, group = 'rows') {
  try {
    remaining();
    const value = await work();
    const row = { name, pass: true, ...value };
    report[group].push(row);
    console.log(JSON.stringify({ name, pass: true, mode: row.mode, questions: row.questionCount, pages: row.pageCount, renderMs: row.metrics?.renderReadyMs }));
    writeReport();
    return row;
  } catch (error) {
    const row = { name, pass: false, error: safeError(error),
      ...(error.qaEvidence ? { observation: error.qaEvidence } : {}) };
    report[group].push(row);
    console.log(JSON.stringify(row));
    writeReport();
    return row;
  }
}

function loadBank(directory, file, readSource = filename => fs.readFileSync(path.join(directory, filename))) {
  const context = { window: {} };
  vm.runInNewContext(readSource(file).toString('utf8'), context, { filename: file, timeout: 3000 });
  requireThat(Array.isArray(context.window.questionBank), 'FIXTURE_BANK_MISSING', { file });
  return context.window.questionBank;
}
function realFixture(directory, readSource) {
  return sourceFiles.flatMap(file => loadBank(directory, file, readSource).map((question, index) => {
    const source = file.slice('archive/exams/'.length);
    const uid = `loading:${source}:${index + 1}`;
    return { ...question, sourceArchiveFile: source, _sourceFile: source,
      sourceOrdinal: index + 1, _sourceQuestionOrdinal: index + 1,
      sourceQuestionNo: question.id, _sourceQuestionNo: question.id,
      sourceQuestionUid: uid, _sourceQuestionUid: uid };
  })).slice(0, 50);
}
function faultFixture(variant) {
  return Array.from({ length: 50 }, (_, index) => ({
    id: index + 1, sourceArchiveFile: 'test-fixtures/loading-50.js', _sourceFile: 'test-fixtures/loading-50.js',
    sourceOrdinal: index + 1, _sourceQuestionOrdinal: index + 1,
    sourceQuestionUid: `loading-synthetic-${index + 1}`, _sourceQuestionUid: `loading-synthetic-${index + 1}`,
    content: `${index + 1}번 검증 문항. $x+1=3$일 때 $x$의 값을 구하시오.`, choices: [], answer: '$2$',
    solution: '[접근] 등식의 양변에서 $1$을 뺀다.<br>[풀이] $x+1-1=3-1$이므로 $x=2$이다.<br>[확인] $2+1=3$이다.',
    solutionImage: index === 24 ? `/__loading/${variant}.svg` : '',
    solutionImageAlt: index === 24 ? '검증용 직사각형' : ''
  }));
}
function solutionAssetMetadata(questions, directory) {
  const files = [...new Set(questions.map(question => question.solutionImage).filter(Boolean))].map(src => {
    const filename = path.resolve(directory, 'archive', src.split('?')[0]);
    requireThat(filename.startsWith(path.join(directory, 'archive') + path.sep) && fs.existsSync(filename), 'FIXTURE_SOLUTION_ASSET_MISSING', { path: src });
    const bytes = fs.readFileSync(filename);
    return { path: src, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
  });
  return { references: questions.filter(question => question.solutionImage).length, uniqueFiles: files.length,
    totalBytes: files.reduce((sum, file) => sum + file.bytes, 0), largestFileBytes: Math.max(0, ...files.map(file => file.bytes)), files };
}

async function serve(directory, sharedSourceRoot = directory, sourceOverlay) {
  const state = { retryRecovered: false, faults: {}, timers: new Set() };
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
  const server = http.createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      res.setHeader('Cache-Control', 'no-store');
      if (pathname === '/__loading/seed.html') {
        res.setHeader('Content-Type', mime['.html']); res.end('<!doctype html><title>Archive qualification</title>'); return;
      }
      if (pathname.startsWith('/__loading/') && pathname.endsWith('.svg')) {
        const variant = path.basename(pathname, '.svg');
        state.faults[variant] = (state.faults[variant] || 0) + 1;
        if (variant === 'broken' || (variant === 'retry' && !state.retryRecovered)) { res.writeHead(404); res.end(); return; }
        const delay = variant === 'slow' ? 1600 : variant === 'slow-long' ? 6000 : variant === 'hanging' ? 60000 : 0;
        const timer = setTimeout(() => {
          state.timers.delete(timer);
          if (!res.destroyed) { res.setHeader('Content-Type', mime['.svg']); res.end(svg); }
        }, delay);
        state.timers.add(timer);
        res.on('close', () => { clearTimeout(timer); state.timers.delete(timer); });
        return;
      }
      // Measured-output qualification serves the same verified exam JS on both hosts.
      // Other exams/assets retain their shared root; code always comes from its own checkout.
      const pinnedSource = sourceOverlay?.(pathname);
      if (pinnedSource !== undefined) {
        res.setHeader('Content-Type', mime['.js']);
        res.end(pinnedSource);
        return;
      }
      const servingRoot = pathname.startsWith('/archive/exams/') || pathname.startsWith('/archive/assets/') ? sharedSourceRoot : directory;
      const filename = path.resolve(servingRoot, '.' + pathname);
      if (!filename.startsWith(servingRoot + path.sep) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
        res.writeHead(404); res.end(); return;
      }
      res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
      const stream = fs.createReadStream(filename);
      stream.on('error', () => { if (!res.headersSent) res.writeHead(500); res.end(); });
      stream.pipe(res);
    } catch (_) { res.writeHead(500); res.end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { state, origin: `http://127.0.0.1:${server.address().port}`, async close() {
    for (const timer of state.timers) clearTimeout(timer);
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  } };
}

function installInstrumentation({ suppressRaf }) {
  const qa = window.__solutionLoadingQA = { firstBoxMs: null, operationStart: 0, previousArea: null, targetMode: new URLSearchParams(location.search).get('mode') || 'sol',
    calls: [], active: 0, maxActive: 0, rafExecuted: 0, turns: 0, longTasks: [], prints: 0, printEvents: [], alerts: 0 };
  setInterval(() => { qa.turns += 1; }, 8);
  const nativeRaf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = suppressRaf ? () => 1 : callback => nativeRaf(time => { qa.rafExecuted += 1; callback(time); });
  if (suppressRaf) window.cancelAnimationFrame = () => {};
  window.print = () => {
    qa.prints += 1;
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const state = typeof AppState !== 'undefined' ? AppState : window.AppState;
    const attempt = runtime?.inspect().attempts.at(-1);
    const event = { atMs: performance.now(), mode: state?.mode, candidateMode: runtime?.committedCandidate?.mode,
      snapshotId: runtime?.activeSnapshot?.snapshotId, requestGeneration: runtime?.requestGeneration,
      lastAttempt: attempt ? { state: attempt.state, intentType: attempt.intentType, requestGeneration: attempt.requestGeneration, committed: attempt.committed } : null };
    qa.printEvents.push(event);
    Promise.resolve(window.__AP_RENDER_READY__).then(result => {
      event.readyOutcome = { ok: result?.ok === true, code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(result?.code || '') ? result.code : null, transactionId: result?.transactionId || null };
    }, () => { event.readyOutcome = { ok: false, rejected: true }; });
    setTimeout(() => window.dispatchEvent(new Event('afterprint')), 0);
  };
  window.alert = () => { qa.alerts += 1; };
  window.confirm = () => false;
  let loop;
  Object.defineProperty(window, 'APRenderLoop', { configurable: true, get: () => loop, set(value) {
    loop = value;
    if (!value?.typeset) return;
    const original = value.typeset;
    value.typeset = async function (label, elements, metrics) {
      const nodes = Array.from(elements || []);
      const entry = { label, generation: metrics?.requestGeneration || null, elements: nodes.length,
        solutionBoxes: nodes.reduce((sum, node) => sum + (node.matches?.('.sol-box') ? 1 : node.querySelectorAll?.('.sol-box').length || 0), 0),
        startMs: performance.now(), startTurn: qa.turns, startRaf: qa.rafExecuted };
      qa.active += 1; qa.maxActive = Math.max(qa.maxActive, qa.active); qa.calls.push(entry);
      try { return await original.call(this, label, elements, metrics); }
      finally { qa.active -= 1; entry.endMs = performance.now(); entry.endTurn = qa.turns; entry.endRaf = qa.rafExecuted; }
    };
  } });
  try { new PerformanceObserver(list => { for (const item of list.getEntries()) qa.longTasks.push(item.duration); }).observe({ type: 'longtask', buffered: true }); } catch (_) {}
  new MutationObserver(() => {
    if (qa.firstBoxMs !== null) return;
    const state = typeof AppState !== 'undefined' ? AppState : window.AppState;
    const area = document.getElementById('print-area');
    const box = area?.querySelector('.q-box,.ans-cell:not(.ans-cell-empty)');
    if (area !== qa.previousArea && state?.mode === qa.targetMode && box && box.getBoundingClientRect().width > 0 && getComputedStyle(box).visibility !== 'hidden') qa.firstBoxMs = performance.now() - qa.operationStart;
  }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['id', 'class', 'style'] });
}

async function waitForOutcome(page, afterAttempts = 0) {
  await page.waitForFunction(previous => {
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const attempts = runtime?.inspect().attempts || [];
    // VISIBLE_READY is an observer event; successful attempt state is SUCCEEDED.
    return runtime && !runtime.busy && attempts.length > previous && ['SUCCEEDED', 'FAILED'].includes(attempts.at(-1)?.state);
  }, afterAttempts, { timeout: remaining(), polling: 50 });
  return bounded(page.evaluate(async () => {
    const result = await window.__AP_RENDER_READY__;
    return { ok: result?.ok === true, code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(result?.code || '') ? result.code : result?.ok ? null : 'RENDER_FAILED' };
  }), 5000, 'RENDER_OUTCOME_PROMISE_TIMEOUT');
}

async function capture(page, outcome) {
  return bounded(page.evaluate(async outcome => {
    const digest = async text => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))), byte => byte.toString(16).padStart(2, '0')).join('');
    const normalized = text => String(text || '').replace(/https?:\/\/127\.0\.0\.1:\d+/g, 'LOCAL').replace(/\s+/g, ' ').trim();
    const safeCode = code => /^[A-Z][A-Z0-9_:-]{2,160}$/.test(code || '') ? code : code ? 'RENDER_FAILED' : null;
    const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
    const attempts = runtime.inspect().attempts;
    const attempt = attempts.at(-1);
    const state = typeof AppState !== 'undefined' ? AppState : window.AppState;
    const area = document.getElementById('print-area');
    const selector = '.q-box,.ans-cell:not(.ans-cell-empty)';
    const blocks = [...area.querySelectorAll(selector)];
    const domSourceOrder = blocks.map(node => node.dataset.sourceRef || '');
    const order = domSourceOrder.filter(Boolean);
    const uniqueOrder = order.filter((ref, index) => order.indexOf(ref) === index);
    const pageNodes = [...area.querySelectorAll('.page')];
    // Answer cells are deliberately interleaved across two desktop columns.
    // The executor's explicit ordinal also drives mobile's one-column order.
    // Do not infer an ordinal by looking up a UID in the expected input list.
    const answerCells = state.mode === 'ans' ? blocks.map(node => {
      const marker = node.style.getPropertyValue('--archive2-mobile-answer-order').trim();
      const number = /^\s*(\d+)\.\s*$/.exec(node.querySelector('.ans-n')?.textContent || '');
      return { sourceRef: node.dataset.sourceRef || '', page: pageNodes.indexOf(node.closest('.page')) + 1,
        orderIndex: /^\d+$/.test(marker) ? Number(marker) : null, displayNumber: number ? Number(number[1]) : null };
    }) : null;
    const sourceOrder = answerCells ? answerCells.slice().sort((left, right) => left.orderIndex - right.orderIndex).map(cell => cell.sourceRef) : uniqueOrder;
    const ref = window.getMixedQuestionSourceRef || window.getArchiveQuestionSourceRef;
    const expectedOrder = (state.data || []).map((question, index) => ref(question, index));
    const imageInfo = async node => {
      const url = new URL(node.getAttribute('src') || '', location.href); url.searchParams.delete('v');
      return { sourceHash: await digest(normalized(url.href)), loaded: node.complete && node.naturalWidth > 0 && node.naturalHeight > 0,
        width: node.naturalWidth, height: node.naturalHeight };
    };
    const pages = await Promise.all(pageNodes.map(async node => {
      const pageRect = node.getBoundingClientRect(); const scale = pageRect.width / node.offsetWidth || 1;
      return { width: node.offsetWidth, height: node.offsetHeight, textHash: await digest(normalized(node.textContent)),
        blocks: await Promise.all([...node.querySelectorAll(selector)].map(async block => {
          const rect = block.getBoundingClientRect();
          return { sourceRef: block.dataset.sourceRef || '', textHash: await digest(normalized(block.textContent)),
            x: Math.round((rect.x - pageRect.x) / scale), y: Math.round((rect.y - pageRect.y) / scale), width: Math.round(rect.width / scale), height: Math.round(rect.height / scale) };
        })), images: await Promise.all([...node.querySelectorAll('img')].map(imageInfo)) };
    }));
    const qa = window.__solutionLoadingQA;
    const metrics = attempt?.metrics || window.__AP_RENDER_METRICS__ || {};
    const calls = qa.calls.filter(call => call.generation === (metrics.requestGeneration || null));
    const feedback = document.getElementById('ap-archive-render-feedback');
    return { outcome, mode: state.mode, qpp: state.qpp, questionCount: state.data?.length || 0,
      sourceOrder, domSourceOrder, answerCells, expectedOrder, inputUids: (state.data || []).map(question => String(question._sourceQuestionUid || question.sourceQuestionUid || question.questionUid || '')),
      blockCount: blocks.length, pageCount: pages.length, pages, bodyHash: await digest(normalized(area.textContent)),
      images: await Promise.all([...area.querySelectorAll('img')].map(imageInfo)),
      mathCount: area.querySelectorAll('mjx-container').length, mathErrors: area.querySelectorAll('mjx-merror,[data-mjx-error]').length,
      unrenderedMath: window.APRenderLoop?.unrenderedMathCount(area),
      engineElapsedMs: performance.now(), operationElapsedMs: performance.now() - qa.operationStart, firstBoxMs: qa.firstBoxMs,
      metrics: { renderReadyMs: metrics.renderReadyMs, mathJaxTotalMs: metrics.mathJaxTotalMs, mathJaxCalls: metrics.mathJaxCalls,
        rafCount: metrics.rafCount, calls: (metrics.calls || []).map(call => ({ label: call.label, elapsedMs: call.elapsedMs })) },
      typeset: { maxConcurrent: qa.maxActive, calls }, longTasks: { count: qa.longTasks.length, maxMs: Math.max(0, ...qa.longTasks) },
      attempts: attempts.map(item => ({ state: item.state, intentType: item.intentType, committed: item.committed, code: safeCode(item.error) })),
      feedback: { state: feedback?.dataset.state || null, visible: !!feedback && !feedback.hidden, code: safeCode(feedback?.dataset.errorCode), retry: !!feedback?.querySelector('button:not([hidden]):not([disabled])') },
      prints: qa.prints, printEvents: qa.printEvents };
  }, outcome), 15000, 'OUTPUT_METADATA_CAPTURE_TIMEOUT');
}

function assertReady(row, count, stage = 'render-ready') {
  const context = { stage, mode: row.mode, qpp: row.qpp, expected: count, questions: row.questionCount,
    expectedOrder: row.expectedOrder, actualOrder: row.sourceOrder, domSourceOrder: row.domSourceOrder };
  try {
    requireThat(row.outcome.ok, 'EXPECTED_RENDER_READY', { ...context, code: row.outcome.code });
    requireThat(row.questionCount === count && row.sourceOrder.length === count, 'QUESTION_DENOMINATOR_MISMATCH', context);
    requireThat(row.expectedOrder.length === count && new Set(row.expectedOrder).size === count, 'INPUT_SOURCE_IDENTITIES_NOT_UNIQUE', context);
    if (row.mode === 'ans') {
      const cells = row.answerCells || [];
      const semantic = cells.slice().sort((left, right) => left.orderIndex - right.orderIndex);
      requireThat(cells.length === count && row.blockCount === count && semantic.every((cell, index) => cell.orderIndex === index), 'ANSWER_ORDINAL_MISSING_OR_DUPLICATED', { ...context, cells });
      requireThat(semantic.every((cell, index) => cell.displayNumber === index + 1 && cell.sourceRef === row.expectedOrder[index]), 'ANSWER_NUMBER_OR_SOURCE_MISMATCH', { ...context, cells });
      const expectedDomIndices = [];
      let pageStart = 0;
      for (let page = 1; page <= row.pageCount; page += 1) {
        const pageCount = cells.filter(cell => cell.page === page).length;
        const columnCount = Math.ceil(Math.ceil(pageCount / 2) / 4) * 4;
        for (let index = 0; index < columnCount; index += 1) for (const offset of [index, columnCount + index]) {
          if (offset < pageCount) expectedDomIndices.push(pageStart + offset);
        }
        pageStart += pageCount;
      }
      requireThat(JSON.stringify(cells.map(cell => cell.orderIndex)) === JSON.stringify(expectedDomIndices), 'ANSWER_COLUMN_ORDER_CHANGED', { ...context, expectedDomIndices, cells });
    }
    requireThat(JSON.stringify(row.sourceOrder) === JSON.stringify(row.expectedOrder), 'SOURCE_ORDER_CHANGED', context);
    requireThat(row.pageCount > 0 && row.blockCount >= count, 'OUTPUT_DOCUMENT_INCOMPLETE', context);
    requireThat(row.images.every(image => image.loaded), 'OUTPUT_IMAGE_NOT_READY', { stage, mode: row.mode });
    requireThat(row.mathErrors === 0 && row.unrenderedMath === 0, 'OUTPUT_MATH_NOT_READY', { stage, mode: row.mode, mathErrors: row.mathErrors, unrenderedMath: row.unrenderedMath });
    requireThat(Number.isFinite(row.firstBoxMs), 'VISIBLE_OUTPUT_NOT_OBSERVED', { stage, mode: row.mode });
  } catch (error) {
    error.qaEvidence = { stage, ...row };
    throw error;
  }
}
function assertBatched(row) {
  const calls = row.typeset.calls.filter(call => call.label === 'solution-staging');
  requireThat(JSON.stringify(calls.map(call => call.solutionBoxes)) === JSON.stringify([8, 8, 8, 8, 8, 8, 2]), 'SOLUTION_BATCH_DENOMINATOR_CHANGED', { sizes: calls.map(call => call.solutionBoxes) });
  requireThat(row.typeset.maxConcurrent === 1, 'CONCURRENT_MATHJAX_CALLS', { maxConcurrent: row.typeset.maxConcurrent });
  requireThat(calls.slice(1).every((call, index) => call.startRaf > calls[index].endRaf || call.startTurn > calls[index].endTurn), 'SOLUTION_BATCHES_DID_NOT_YIELD');
  requireThat(!row.metrics.calls.some(call => call.label === 'solution-decision-batch'), 'UNUSED_DIAGNOSTIC_TYPESET_REMAINS');
}
function compareRows(baseline, current) {
  requireThat(baseline?.pass && current?.pass, 'PARITY_INPUT_NOT_READY', { baselinePass: !!baseline?.pass, currentPass: !!current?.pass });
  for (const key of ['questionCount', 'blockCount', 'pageCount', 'bodyHash', 'sourceOrder', 'mathCount', 'images']) {
    requireThat(JSON.stringify(baseline[key]) === JSON.stringify(current[key]), 'OUTPUT_PARITY_MISMATCH', { field: key });
  }
  requireThat(baseline.pages.length === current.pages.length, 'PAGE_DENOMINATOR_MISMATCH');
  for (let p = 0; p < baseline.pages.length; p += 1) {
    const before = baseline.pages[p], after = current.pages[p];
    for (const key of ['width', 'height', 'textHash', 'images']) requireThat(JSON.stringify(before[key]) === JSON.stringify(after[key]), 'PAGE_PARITY_MISMATCH', { page: p + 1, field: key });
    requireThat(before.blocks.length === after.blocks.length, 'PAGE_BLOCK_COUNT_CHANGED', { page: p + 1 });
    for (let b = 0; b < before.blocks.length; b += 1) {
      for (const key of ['sourceRef', 'textHash']) requireThat(before.blocks[b][key] === after.blocks[b][key], 'BLOCK_CONTENT_OR_ORDER_CHANGED', { page: p + 1, block: b + 1, field: key });
      for (const key of ['x', 'y', 'width', 'height']) requireThat(Math.abs(before.blocks[b][key] - after.blocks[b][key]) <= 1, 'BLOCK_GEOMETRY_CHANGED', { page: p + 1, block: b + 1, field: key, baseline: before.blocks[b][key], current: after.blocks[b][key] });
    }
  }
  return { baseline: baseline.name, current: current.name, questions: current.questionCount, pages: current.pageCount, sourceOrderHash: hash(current.sourceOrder.join('\n')), bodyHash: current.bodyHash, coordinateTolerancePx: 1 };
}

async function preflight(page) {
  return bounded(page.evaluate(async () => {
    try {
      if (window.mixedFastHost) { const result = await window.mixedFastHost.preflight(); return { ok: result.ok, pages: result.pages }; }
      const runtime = window.archiveScreenRuntime;
      const result = window.APArchiveSnapshotContract.preflight(runtime.activeSnapshot, runtime.committedCandidate);
      if (result.pass) window.bindArchiveRuntimePrintReadiness();
      return { ok: result.pass, failedGates: Object.keys(result.gates).filter(key => !result.gates[key]) };
    } catch (error) { return { ok: false, code: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(error.code || error.message || '') ? error.code || error.message : 'PRINT_PREFLIGHT_FAILED' }; }
    finally { window.mixedFastHost?.unlockPrint(); }
  }), 45000, 'PRINT_PREFLIGHT_TIMEOUT');
}
async function verifiedPreflight(page, before) {
  const result = await preflight(page);
  requireThat(result.ok, 'SUCCESSFUL_RENDER_PRINT_PREFLIGHT_FAILED', result);
  const after = await capture(page, before.outcome);
  const parity = compareRows({ ...before, pass: true, name: 'before-preflight' }, { ...after, pass: true, name: 'after-preflight' });
  return { ...result, outputParity: parity, attemptsBefore: before.attempts.length, attemptsAfter: after.attempts.length };
}
async function assertPrintBlocked(page, stage = 'failed-render') {
  const result = await bounded(page.evaluate(async () => {
    const inspect = async () => {
      const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
      const state = typeof AppState !== 'undefined' ? AppState : window.AppState;
      const safeCode = code => /^[A-Z][A-Z0-9_:-]{2,160}$/.test(code || '') ? code : code ? 'RENDER_FAILED' : null;
      let timer;
      let readyOutcome;
      try {
        readyOutcome = await Promise.race([Promise.resolve(window.__AP_RENDER_READY__).then(result => ({ ok: result?.ok === true, code: safeCode(result?.code), transactionId: result?.transactionId || null }), () => ({ ok: false, rejected: true })),
          new Promise(resolve => { timer = setTimeout(() => resolve({ pending: true }), 500); })]);
      } finally { clearTimeout(timer); }
      return { printCalls: window.__solutionLoadingQA.prints, mode: state?.mode, candidateMode: runtime?.committedCandidate?.mode,
        requestGeneration: runtime?.requestGeneration, snapshotId: runtime?.activeSnapshot?.snapshotId, pages: document.querySelectorAll('#print-area .page').length,
        readyOutcome, attempts: (runtime?.inspect().attempts || []).slice(-4).map(attempt => ({ state: attempt.state, intentType: attempt.intentType,
          requestGeneration: attempt.requestGeneration, committed: attempt.committed, code: safeCode(attempt.error) })) };
    };
    const before = await inspect();
    const eventStart = window.__solutionLoadingQA.printEvents.length;
    await window.safePrint('vector');
    return { before, after: await inspect(), printEvents: window.__solutionLoadingQA.printEvents.slice(eventStart) };
  }), 25000, 'FAILED_RENDER_PRINT_PROBE_TIMEOUT');
  result.stage = stage;
  requireThat(result.after.printCalls === result.before.printCalls, 'FAILED_RENDER_REACHED_PRINT', result);
  return result;
}

async function main() {
  requireThat(/^[a-f0-9]{40}$/i.test(baseSha), 'EXACT_BASELINE_SHA_REQUIRED');
  requireThat(repeats === 2 || repeats === 3, 'TWO_OR_THREE_REPETITIONS_REQUIRED');
  const chrome = process.env.CHROME_BIN;
  requireThat(chrome && fs.existsSync(chrome), 'REAL_CHROME_BIN_REQUIRED');
  report.currentSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  report.playwrightVersion = require('playwright/package.json').version;
  report.repeats = repeats;
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-solution-baseline-'));
  const baselineRoot = path.join(temp, 'checkout');
  let worktree = false, browser, baselineServer, currentServer;
  try {
    // A real pinned checkout avoids serving current files when a baseline blob
    // is absent and keeps git-show/cache overhead outside browser timings.
    execFileSync('git', ['worktree', 'add', '--detach', baselineRoot, baseSha], { cwd: root, stdio: 'pipe', timeout: 120000 });
    worktree = true;
    const actual = realFixture(root);
    const solutionImageCount = actual.filter(question => question.solutionImage).length;
    requireThat(actual.length === 50 && solutionImageCount > 0, 'REAL_FIXTURE_DENOMINATOR_CHANGED', { questions: actual.length, solutionImages: solutionImageCount });
    const payloadSha256 = hash(JSON.stringify(actual));
    report.fixture = { questions: actual.length, solutionImages: solutionImageCount, baselinePayloadSha256: payloadSha256, currentPayloadSha256: payloadSha256,
      sharedSourceDirectories: ['archive/exams/', 'archive/assets/'],
      sources: sourceFiles.map(file => ({ file, sha256: hash(fs.readFileSync(path.join(root, file), 'utf8')) })) };
    report.fixture.solutionAssets = solutionAssetMetadata(actual, root);
    const originalCount = loadBank(root, sourceFiles[0]).length;
    baselineServer = await serve(baselineRoot, root); currentServer = await serve(root);
    const { chromium } = require('playwright');
    browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    report.chromeVersion = browser.version();
    deadline = Date.now() + 300000;
    const qrious = fs.readFileSync(path.join(root, 'archive/vendor/qrious/qrious.min.js'));

    async function openSession(label, { variant = 'actual', original = false, mode = 'sol', qpp = 4, suppressRaf = false } = {}) {
      const server = label === 'baseline' ? baselineServer : currentServer;
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
      let page;
      const errors = [];
      try {
        await context.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
        await context.route('https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js', route => route.fulfill({ contentType: 'text/javascript', body: qrious }));
        await context.addInitScript(installInstrumentation, { suppressRaf });
        page = await context.newPage();
        page.on('pageerror', error => errors.push({ name: error.name, messageSha256: hash(error.message) }));
        const fixture = variant === 'actual' ? actual : faultFixture(variant);
        if (!original) {
          await page.goto(`${server.origin}/__loading/seed.html`, { waitUntil: 'domcontentloaded', timeout: remaining(30000) });
          await page.evaluate(({ questions, qpp }) => {
            localStorage.setItem('mixedQuestions_loading-qa', JSON.stringify(questions));
            localStorage.setItem('mixedMeta_loading-qa', JSON.stringify({ title: '50문항 해설 로딩 검증', qpp, count: questions.length }));
          }, { questions: fixture, qpp });
        }
        const url = new URL(original ? '/archive/engine.html' : '/archive/mixed_engine.html', server.origin);
        if (original) url.searchParams.set('data', sourceFiles[0].slice('archive/'.length));
        else url.searchParams.set('key', 'loading-qa');
        for (const [key, value] of Object.entries({ mode, qpp, assetBase: 'off', prewarm: '0', snapshotCache: '0' })) url.searchParams.set(key, value);
        // No dualrun: this is the ordinary student path, not diagnostic work.
        await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: remaining(30000) });
        const outcome = await waitForOutcome(page);
        return { page, context, outcome, errors, server, expectedCount: original ? originalCount : 50,
          async snapshot() { const row = await capture(page, this.outcome); row.pageErrors = errors.slice(); return row; },
          async transition(nextMode) {
            const switched = await bounded(page.evaluate(async ({ next, timeoutMs }) => {
              const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
              const previous = runtime.inspect().attempts.length;
              Object.assign(window.__solutionLoadingQA, { operationStart: performance.now(), targetMode: next, firstBoxMs: null, previousArea: document.getElementById('print-area') });
              let timer;
              let result;
              try {
                result = await Promise.race([window.switchMode(next), new Promise(resolve => {
                  timer = setTimeout(() => resolve({ ok: false, code: 'PUBLIC_MODE_SWITCH_TIMEOUT' }), timeoutMs);
                })]);
              } catch (error) { result = { ok: false, code: error.code || error.message }; }
              finally { clearTimeout(timer); }
              const code = /^[A-Z][A-Z0-9_:-]{2,160}$/.test(result?.code || '') ? result.code : 'PUBLIC_MODE_SWITCH_FAILED';
              return { previous, attempts: runtime.inspect().attempts.length, outcome: { ok: result?.ok === true, code: result?.ok ? null : code } };
            }, { next: nextMode, timeoutMs: remaining() }), 46000, 'PUBLIC_MODE_SWITCH_EVALUATION_TIMEOUT');
            const runtimeOutcome = switched.attempts > switched.previous ? await waitForOutcome(page, switched.previous) : { ok: false, code: 'MODE_RENDER_NOT_STARTED' };
            this.outcome = switched.outcome.ok ? runtimeOutcome : switched.outcome;
            const row = await this.snapshot();
            row.publicModeOutcome = switched.outcome;
            row.runtimeOutcome = runtimeOutcome;
            return row;
          }, async close() { await context.close(); } };
      } catch (error) {
        if (page && !page.isClosed()) {
          try { error.qaEvidence = await page.evaluate(async () => {
            const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
            const attempt = runtime?.inspect().attempts.at(-1);
            const rawError = String(attempt?.error || '');
            const errorHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawError))), byte => byte.toString(16).padStart(2, '0')).join('');
            return { pathname: location.pathname, documentState: document.readyState, runtimeAvailable: !!runtime, busy: runtime?.busy,
              attemptState: attempt?.state, attemptCode: /^[A-Z][A-Z0-9_:-]{2,160}$/.test(rawError) ? rawError : null, attemptErrorSha256: errorHash,
              attemptCount: runtime?.inspect().attempts.length || 0, renderPromiseAvailable: !!window.__AP_RENDER_READY__, fontStatus: document.fonts?.status,
              pages: document.querySelectorAll('#print-area .page').length, mathJaxAvailable: typeof window.MathJax?.typesetPromise === 'function' };
          }); } catch (_) {}
        }
        error.qaEvidence = { ...(error.qaEvidence || {}), pageErrors: errors };
        await context.close(); throw error;
      }
    }
    async function readyCase(label, options = {}) {
      const session = await openSession(label, options);
      let row;
      try {
        row = await session.snapshot(); assertReady(row, session.expectedCount, `${label}-${options.original ? 'original' : options.variant || 'actual'}-${options.mode || 'sol'}`);
        requireThat(row.pageErrors.length === 0, 'UNEXPECTED_BROWSER_ERROR', { errors: row.pageErrors });
        if (!options.original && (options.variant || 'actual') === 'actual') {
          requireThat(JSON.stringify(row.inputUids) === JSON.stringify(actual.map(question => question._sourceQuestionUid)), 'INPUT_UID_ORDER_CHANGED');
          if ((options.mode || 'sol') === 'sol') requireThat(row.images.length >= solutionImageCount, 'SOLUTION_FIGURES_MISSING', { expectedAtLeast: solutionImageCount, actual: row.images.length });
        }
        if (label === 'current' && !options.original && (options.mode || 'sol') === 'sol') assertBatched(row);
        row.printPreflight = await verifiedPreflight(session.page, row);
        return row;
      } catch (error) {
        if (row) error.qaEvidence = row;
        throw error;
      } finally { await session.close(); }
    }

    const pairs = [];
    for (let repeat = 0; repeat < repeats; repeat += 1) {
      const pair = {};
      for (const label of repeat % 2 ? ['current', 'baseline'] : ['baseline', 'current']) pair[label] = await record(`actual-50-${label}-${repeat + 1}`, () => readyCase(label));
      pairs.push(pair);
      await record(`actual-50-parity-${repeat + 1}`, () => compareRows(pair.baseline, pair.current), 'comparisons');
    }
    await record('actual-50-performance', () => {
      requireThat(pairs.every(pair => pair.baseline.pass && pair.current.pass), 'PERFORMANCE_INPUT_NOT_READY');
      const median = values => { const sorted = values.slice().sort((a, b) => a - b); const i = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[i] : (sorted[i - 1] + sorted[i]) / 2; };
      const baselineMs = median(pairs.map(pair => pair.baseline.metrics.renderReadyMs));
      const currentMs = median(pairs.map(pair => pair.current.metrics.renderReadyMs));
      const baselineDiagnosticCalls = pairs[0].baseline.typeset.calls.filter(call => call.label === 'solution-decision-batch');
      requireThat(baselineDiagnosticCalls.length > 0, 'BASELINE_DIAGNOSTIC_PATH_NOT_EXERCISED');
      // Short shared runners vary. The structural removal is mandatory; this
      // separate ceiling detects a material median regression, not small noise.
      const allowedMs = baselineMs * 1.25 + 750;
      requireThat(currentMs <= allowedMs, 'RENDER_TIME_REGRESSION', { baselineMs, currentMs, allowedMs });
      return { baselineMedianMs: baselineMs, currentMedianMs: currentMs, allowedMs,
        baselineEngineElapsedMedianMs: median(pairs.map(pair => pair.baseline.engineElapsedMs)),
        currentEngineElapsedMedianMs: median(pairs.map(pair => pair.current.engineElapsedMs)),
        baselineFirstBoxMedianMs: median(pairs.map(pair => pair.baseline.firstBoxMs)),
        currentFirstBoxMedianMs: median(pairs.map(pair => pair.current.firstBoxMs)),
        diagnosticCallsRemoved: baselineDiagnosticCalls.length, diagnosticRootNodesRemoved: baselineDiagnosticCalls.reduce((sum, call) => sum + call.elements, 0) };
    }, 'comparisons');
    for (const qpp of [1, 2]) {
      const before = await record(`actual-50-qpp${qpp}-baseline`, () => readyCase('baseline', { qpp }));
      const after = await record(`actual-50-qpp${qpp}-current`, () => readyCase('current', { qpp }));
      await record(`actual-50-qpp${qpp}-parity`, () => compareRows(before, after), 'comparisons');
    }

    await record('slow-svg-1600ms-current', () => readyCase('current', { variant: 'slow' }));
    await record('slow-svg-6000ms-current', () => readyCase('current', { variant: 'slow-long' }));
    for (const variant of ['broken', 'hanging']) await record(`image-${variant}-blocks-print`, async () => {
      const session = await openSession('current', { variant });
      try {
        const row = await session.snapshot();
        requireThat(!row.outcome.ok && /IMAGE/.test(row.outcome.code), 'BAD_IMAGE_DID_NOT_FAIL', { code: row.outcome.code });
        requireThat(row.attempts.at(-1)?.state === 'FAILED' && !row.attempts.at(-1)?.committed, 'FAILED_IMAGE_WAS_COMMITTED');
        requireThat(row.pageCount === 0, 'PARTIAL_SOLUTION_BECAME_VISIBLE');
        requireThat(row.feedback.visible && row.feedback.state === 'failed' && row.feedback.retry, 'RENDER_ERROR_RECOVERY_UI_MISSING');
        row.printProbe = await assertPrintBlocked(session.page, `initial-${variant}-failure`);
        return row;
      } finally { await session.close(); }
    });
    await record('mixed-mode-failure-retry', async () => {
      currentServer.state.retryRecovered = false;
      const session = await openSession('current', { variant: 'retry', mode: 'exam' });
      try {
        const exam = await session.snapshot(); assertReady(exam, 50, 'mixed-before-image-failure-exam');
        const failed = await session.transition('sol');
        requireThat(!failed.outcome.ok && /IMAGE/.test(failed.outcome.code), 'MODE_CHANGE_IMAGE_FAILURE_MISSING');
        requireThat(failed.mode === 'exam' && failed.bodyHash === exam.bodyHash, 'MODE_FAILURE_REPLACED_PREVIOUS_OUTPUT');
        requireThat(failed.feedback.visible && failed.feedback.state === 'failed' && failed.feedback.retry, 'MODE_FAILURE_RETRY_MISSING');
        const printProbe = await assertPrintBlocked(session.page, 'mixed-after-solution-image-failure');
        currentServer.state.retryRecovered = true;
        const previous = await session.page.evaluate(() => {
          const count = window.mixedScreenRuntime.inspect().attempts.length;
          Object.assign(window.__solutionLoadingQA, { operationStart: performance.now(), targetMode: 'sol', firstBoxMs: null, previousArea: document.getElementById('print-area') });
          document.querySelector('#ap-archive-render-feedback button:not([hidden])').click();
          return count;
        });
        session.outcome = await waitForOutcome(session.page, previous);
        const recovered = await session.snapshot(); assertReady(recovered, 50, 'mixed-recovered-sol');
        requireThat(recovered.mode === 'sol' && !recovered.feedback.visible, 'RETRY_DID_NOT_RESTORE_REQUESTED_MODE');
        assertBatched(recovered);
        const answer = await session.transition('ans'); assertReady(answer, 50, 'mixed-after-retry-ans');
        const returned = await session.transition('exam'); assertReady(returned, 50, 'mixed-after-retry-exam');
        requireThat(returned.bodyHash === exam.bodyHash, 'MODE_ROUNDTRIP_CONTENT_CHANGED');
        return { exam, failed, printProbe, recovered, answer, returned, recoveredImageRequests: currentServer.state.faults.retry };
      } finally { await session.close(); }
    });

    const originalBefore = await record('original-real-sol-baseline', () => readyCase('baseline', { original: true }));
    const originalAfter = await record('original-real-sol-current', () => readyCase('current', { original: true }));
    await record('original-real-sol-parity', () => compareRows(originalBefore, originalAfter), 'comparisons');
    await record('original-real-modes-with-raf-suppressed', async () => {
      const session = await openSession('current', { original: true, suppressRaf: true });
      try {
        const solution = await session.snapshot(); assertReady(solution, originalCount, 'original-raf-suppressed-sol');
        const answer = await session.transition('ans'); assertReady(answer, originalCount, 'original-raf-suppressed-ans');
        const exam = await session.transition('exam'); assertReady(exam, originalCount, 'original-raf-suppressed-exam');
        const printPreflight = await verifiedPreflight(session.page, exam);
        requireThat(session.errors.length === 0, 'UNEXPECTED_BROWSER_ERROR', { errors: session.errors });
        return { solution, answer, exam, printPreflight, suppressedRequestAnimationFrame: true };
      } finally { await session.close(); }
    });
    report.assetFaultRequests = currentServer.state.faults;
  } finally {
    await browser?.close();
    await baselineServer?.close(); await currentServer?.close();
    if (worktree) { try { execFileSync('git', ['worktree', 'remove', '--force', baselineRoot], { cwd: root, stdio: 'pipe', timeout: 30000 }); } catch (_) {} }
    fs.rmSync(temp, { recursive: true, force: true });
  }
  report.pass = report.rows.length > 0 && [...report.rows, ...report.comparisons].every(row => row.pass);
  writeReport();
  console.log(JSON.stringify({ schema: report.schema, pass: report.pass, cases: report.rows.length, comparisons: report.comparisons.length, baselineSha: baseSha, currentSha: report.currentSha }));
  if (!report.pass) process.exitCode = 1;
}

module.exports = { serve, realFixture, loadBank, sourceFiles, installInstrumentation,
  waitForOutcome, capture, assertReady, compareRows, verifiedPreflight,
  assertPrintBlocked, faultFixture };

if (require.main === module) main().catch(error => {
  report.pass = false; report.fatal = safeError(error); writeReport();
  console.error(JSON.stringify({ pass: false, error: report.fatal })); process.exitCode = 1;
});
