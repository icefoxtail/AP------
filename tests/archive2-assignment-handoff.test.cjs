const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, `missing source marker: ${startMarker}`);
  assert.notEqual(end, -1, `missing source marker: ${endMarker}`);
  return source.slice(start, end);
}

function assignmentReceiptRuntime(kind) {
  const index = read('index.html');
  const processCode = sliceBetween(index, 'async function assignTargetProcessOneClass(classId) {', 'function renderAssignTargetProgressView() {');
  const renderCode = sliceBetween(index, 'function renderAssignTargetProgressView() {', 'async function assignTargetRetryPdf(classId) {');
  const retryCode = sliceBetween(index, 'async function assignTargetRetryPdf(classId) {', 'async function assignTargetRetrySavedPaperPdf(classId) {');
  const assignmentId = `assignment-${kind}-pdf`;
  const assignmentPosts = [];
  const pdfPosts = [];
  const host = { innerHTML: '' };
  const context = {
    AssignTarget: {
      item: kind === 'saved-paper' ? { savedPaperId: 'saved-paper-exact' } : { file: 'original/sample.js' },
      classState: { classA: { row: { id: 'classA', name: '고1 기하반' }, studentIds: ['s1'], roster: [{ id: 's1' }] } },
      progress: { classA: { status: 'pending' } },
      assignmentBatchId: 'assignment-batch-1', scope: 'class', grade: '고1', qpp: 4,
    },
    async registerIndexClassExamAssignment(row, item, options) {
      assignmentPosts.push({ row, item, options });
      return { saved: true, assignment: { id: assignmentId, pdf_status: 'pending' }, pdfFailure: 'PDF worker unavailable' };
    },
    assignTargetBodyEl: () => host,
    escapeModalText: value => String(value ?? ''),
    getIndexAssignmentAuthHeader: () => ({ Authorization: 'fixture' }),
    ARCHIVE_AP_API_BASE: 'https://api.test/api',
    async fetch(url, init) {
      pdfPosts.push({ url: String(url), method: init?.method || 'GET' });
      return { ok: true, status: 200, json: async () => ({ success: true, assignment: { id: assignmentId, pdf_status: 'ready' } }) };
    },
    renderAssignTargetProgressView() {},
    assignTargetMaybeFinish() {},
    console: { warn() {} },
  };
  vm.runInNewContext([processCode, renderCode, retryCode].join('\n'), context, { filename: `assignment-receipt-${kind}.js` });
  return { context, assignmentId, assignmentPosts, pdfPosts, host };
}

function assignmentHandoffHarness(classes) {
  const workspace = read('archive2-workspace.js');
  const entry = read('archive2-entry.js');
  const index = read('index.html');
  const receipts = [];
  const statusReads = [];
  const outputEnvelopes = [];
  const previewPromises = [];
  const snapshots = new Map();
  const assignmentPosts = { count: 0 };
  const legacyTimers = [];
  const legacyLaunches = [];
  let previewLoadCount = 0;
  let previewSrc = '';

  const progress = Object.fromEntries(classes.map(row => [row.id, { status: row.status }]));
  const child = {
    URL,
    URLSearchParams,
    Map,
    AssignTarget: {
      progress,
      grade: '고1',
      item: { file: 'original/sample.js', subject: '수학' },
      qpp: 4,
      classState: Object.fromEntries(classes.map(row => [row.id, {
        checked: true,
        row: { id: row.id, name: row.name || row.id },
      }])),
    },
    location: {
      search: '?archive2Issue=original%2Fsample.js&archive2Embedded=1',
      origin: 'https://archive.test',
    },
    document: {
      documentElement: { classList: { add() {} } },
      createElement: () => ({}),
      head: { appendChild() {} },
    },
    closeModal() {},
    setTimeout(callback, delay) { legacyTimers.push({ callback, delay }); return legacyTimers.length; },
    loadAssignmentBoardForGrade() {},
    renderAssignTargetProgressView() {},
    launchIndexExamOutput(...args) { legacyLaunches.push(args); },
    getQrTeacherName: row => `teacher:${row.id}`,
    openCalls: [],
    open(...args) { this.openCalls.push(args); },
  };
  child.window = child;

  const previewFrame = {
    isConnected: true,
    onload: null,
    get src() { return previewSrc; },
    set src(value) { previewSrc = String(value); previewLoadCount++; },
  };
  const elements = new Map([
    ['original-review', { hidden: true }],
    ['original-issue-frame', { hidden: false, contentWindow: child }],
    ['original-preview-frame', previewFrame],
    ['original-preview-status', { textContent: '' }],
    ['original-receipts', { innerHTML: '' }],
    ['modal', { scrollTop: 0, querySelectorAll: () => [] }],
  ]);
  const state = {
    originalExam: { file: 'original/sample.js' },
    originalSettings: { header: { title: '샘플 시험', subtitle: '수학' }, qpp: 4, includeQr: false },
    originalReceipts: [],
    originalPreviewToken: 0,
    originalPreviewEnvelope: null,
  };
  let messageHandler = null;
  const parent = {
    URL,
    URLSearchParams,
    JSON,
    String,
    Promise,
    location: { origin: 'https://archive.test', href: 'https://archive.test/archive/workspace.html' },
    state,
    window: null,
    document: { querySelector: () => ({ setAttribute() {} }) },
    $(id) { return elements.get(id); },
    esc: value => String(value ?? ""),
    button: (action, label, extra = "") => `<button data-action="${action}" ${extra}>${label}</button>`,
    addEventListener(type, callback) {
      if (type === 'message') messageHandler = callback;
    },
    async api(route) {
      statusReads.push(route);
      const match = route.match(/^\/class-exam-assignments\/([^/]+)\/status$/);
      assert.ok(match, `unexpected parent API request: ${route}`);
      const id = decodeURIComponent(match[1]);
      const snapshot = snapshots.get(id);
      assert.ok(snapshot, `missing frozen Assignment snapshot for ${id}`);
      return { assignment: { mixed_payload_json: JSON.stringify(snapshot) } };
    },
    O: {
      async publishOutputEnvelope(input) {
        const frozenInput = JSON.parse(JSON.stringify(input));
        outputEnvelopes.push(frozenInput);
        return {
          ownerId: 'preview-owner',
          outputRequestId: `preview-${outputEnvelopes.length}`,
          sourceId: input.sourceId,
          assignmentId: input.assignmentId,
          mode: input.mode,
        };
      },
      outputEnvelopeUrl(enginePath, baseUrl, envelope, options) {
        const url = new URL(enginePath, baseUrl);
        url.searchParams.set('preview', options.preview ? '1' : '0');
        url.searchParams.set('mode', envelope.mode);
        url.searchParams.set('output_request_id', envelope.outputRequestId);
        if (options.assignmentId) url.searchParams.set('assignment_id', options.assignmentId);
        return url;
      },
      createOutputStore: () => ({ cleanup: async () => {} }),
    },
  };
  parent.window = parent;

  child.parent = {
    postMessage(message, targetOrigin) {
      receipts.push({ message, targetOrigin });
      messageHandler?.({ origin: targetOrigin, source: child, data: message });
    },
  };

  const parentMessageCode = [
    sliceBetween(workspace, 'function setOriginalStep(step) {', 'async function buildOriginalSourceOutput('),
    sliceBetween(workspace, 'async function originalOutputUrl(mode = "exam", preview = true) {', 'async function originalPrint() {'),
    sliceBetween(workspace, 'function renderOriginalReceipts() {', 'function openOriginalIssue('),
    sliceBetween(workspace, 'window.addEventListener("message", (event) => {', '$("modal").addEventListener("cancel"'),
  ].join('\n');
  vm.runInNewContext(parentMessageCode, parent, { filename: 'archive2-workspace-original-handoff.js' });

  const actualUpdatePreview = parent.updateOriginalPreview;
  parent.updateOriginalPreview = (...args) => {
    const pending = actualUpdatePreview(...args);
    previewPromises.push(pending);
    return pending;
  };

  const retryStart = index.indexOf('async function assignTargetRetryFailed()');
  const retryEnd = index.indexOf('\nfunction assignTargetMaybeFinish()', retryStart);
  const finishStart = index.indexOf('function assignTargetMaybeFinish()');
  const finishEnd = index.indexOf('\n/* engine.html 연동 */', finishStart);
  assert.notEqual(retryStart, -1);
  assert.notEqual(retryEnd, -1);
  assert.notEqual(finishStart, -1);
  assert.notEqual(finishEnd, -1);
  vm.runInNewContext(index.slice(finishStart, finishEnd), child, { filename: 'archive1-assignment-finish.js' });
  vm.runInNewContext(index.slice(retryStart, retryEnd), child, { filename: 'archive1-retry-failed.js' });
  vm.runInNewContext(entry, child, { filename: 'archive2-entry.js' });

  return {
    child,
    parent,
    state,
    elements,
    previewFrame,
    previewPromises,
    previewEnvelopes: outputEnvelopes,
    statusReads,
    receipts,
    snapshots,
    assignmentPosts,
    legacyTimers,
    legacyLaunches,
    get previewLoadCount() { return previewLoadCount; },
    recordSavedAssignment(id, snapshot, options = {}) {
      snapshots.set(id, snapshot);
      const classId = options.classId || classes[assignmentPosts.count]?.id || "class-1";
      const className = options.className || classes[assignmentPosts.count]?.name || classId;
      assignmentPosts.count++;
      child.archive2OriginalReceipt({
        saved: true,
        assignment: {
          id,
          class_id: classId,
          pdf_status: options.pdfStatus || 'ready',
          pdf_error: options.pdfError || '',
        },
        pdfFailure: options.pdfError || '',
      }, { id: classId, name: className });
    },
    async settlePreview() { await Promise.all(previewPromises); },
  };
}

async function runRealEngineAssignmentRegistration(previewUrl) {
  const engine = read('engine.html');
  const engineRequests = [];
  const context = {
    URL,
    URLSearchParams,
    window: { location: { search: new URL(previewUrl).search } },
    AppState: { mode: 'exam', data: [{ questionUid: 'q1' }], qpp: 4 },
    committedArchiveState: { data: [{ questionUid: 'q1' }], qpp: 4, title: '샘플 시험' },
    ARCHIVE_AP_API_BASE: 'https://api.test/api',
    _classExamAssignmentRegisteredSig: '',
    getAssignmentAuthHeader: () => ({ Authorization: 'fixture' }),
    getIdentityTitle: () => '샘플 시험',
    getKstTodayString: () => '2026-10-03',
    notifyArchiveQrApiFailure() {},
    console: { warn() {} },
    async fetch(url, init) {
      engineRequests.push({ url: String(url), method: init?.method || 'GET' });
      return { ok: true, json: async () => ({ success: true }) };
    },
  };
  const engineFunctions = [
    sliceBetween(engine, 'function isPreviewMode() {', 'function installArchivePreviewWitness()'),
    sliceBetween(engine, 'function shouldRenderSubmitQr() {', 'function buildSubmitQrTargetUrl()'),
    sliceBetween(engine, 'async function registerClassExamAssignmentToOS(candidate = null) {', 'function wrapLatex(text)'),
  ].join('\n');
  vm.runInNewContext(engineFunctions, context, { filename: 'engine-registration-preview.js' });
  const result = await context.registerClassExamAssignmentToOS();
  return { result, engineRequests };
}

function frozenSnapshot(questionUid, content) {
  return {
    questions: [{ questionUid, content, answer: '정답', solution: '해설' }],
    meta: { sourceKind: 'archive2-original', questionUids: [questionUid], title: '샘플 시험' },
  };
}

test('one-class completion changes the same modal to its saved frozen preview with no engine Assignment POST', async () => {
  const h = assignmentHandoffHarness([{ id: 'class-1', status: 'success' }]);
  const snapshot = frozenSnapshot('saved-q1', 'class-1 frozen content');
  h.recordSavedAssignment('assignment-1', snapshot);

  h.child.assignTargetMaybeFinish();
  await h.settlePreview();

  assert.equal(h.assignmentPosts.count, 1, 'only the existing class Assignment save has occurred');
  assert.deepEqual(h.receipts.map(row => row.message.type), [
    'archive2-original-saved',
    'archive2-original-complete',
  ]);
  assert.equal(h.state.originalReceipts[0].id, 'assignment-1');
  const receiptHtml = h.elements.get('original-receipts').innerHTML;
  assert.match(receiptHtml, /class-1/);
  assert.match(receiptHtml, /Assignment ID[^<]*<code>assignment-1<\/code>/);
  assert.match(receiptHtml, /data-assignment="assignment-1" data-mode="exam"/);
  assert.equal(h.elements.get('original-review').hidden, false);
  assert.equal(h.elements.get('original-issue-frame').hidden, true);
  assert.equal(h.previewLoadCount, 1);
  assert.deepEqual(h.statusReads, ['/class-exam-assignments/assignment-1/status']);
  assert.equal(h.previewEnvelopes.length, 1);
  assert.equal(h.previewEnvelopes[0].sourceKind, 'assignment');
  assert.equal(h.previewEnvelopes[0].sourceId, 'assignment-1');
  assert.equal(h.previewEnvelopes[0].assignmentId, 'assignment-1');
  assert.equal(h.previewEnvelopes[0].questions[0].content, 'class-1 frozen content');

  const outputUrl = new URL(h.previewFrame.src);
  assert.equal(outputUrl.pathname, '/archive/engine.html');
  assert.equal(outputUrl.searchParams.get('preview'), '1');
  assert.equal(outputUrl.searchParams.get('assignment_id'), 'assignment-1');
  assert.equal(outputUrl.searchParams.get('mode'), 'exam');
  assert.equal(outputUrl.searchParams.has('submitQr'), false);
  const engine = await runRealEngineAssignmentRegistration(outputUrl.href);
  assert.equal(engine.result.code, 'SKIPPED_BY_CONTRACT');
  assert.deepEqual(engine.engineRequests, [], 'the real engine registration hook must not POST for this preview handoff');
  assert.equal(h.assignmentPosts.count, 1, 'opening the saved preview does not add an Assignment POST');
});

test('three successful classes open one preview from the first receipt frozen snapshot', async () => {
  const h = assignmentHandoffHarness([
    { id: 'class-1', status: 'success' },
    { id: 'class-2', status: 'success' },
    { id: 'class-3', status: 'success' },
  ]);
  h.recordSavedAssignment('assignment-1', frozenSnapshot('q1', 'first receipt snapshot'));
  h.recordSavedAssignment('assignment-2', frozenSnapshot('q2', 'second receipt snapshot'));
  h.recordSavedAssignment('assignment-3', frozenSnapshot('q3', 'third receipt snapshot'));

  h.child.assignTargetMaybeFinish();
  await h.settlePreview();

  const completions = h.receipts.filter(row => row.message.type === 'archive2-original-complete');
  assert.equal(completions.length, 1);
  assert.equal(completions[0].message.receiptCount, 3);
  assert.equal(h.state.originalReceipts.length, 3);
  assert.equal(h.previewLoadCount, 1, 'one shared exam preview serves the multi-class assignment');
  const receiptHtml = h.elements.get('original-receipts').innerHTML;
  for (const id of ['class-1', 'class-2', 'class-3']) assert.match(receiptHtml, new RegExp(id));
  for (const id of ['assignment-1', 'assignment-2', 'assignment-3']) assert.match(receiptHtml, new RegExp(`Assignment ID[^<]*<code>${id}</code>`));
  assert.deepEqual(h.statusReads, ['/class-exam-assignments/assignment-1/status']);
  assert.equal(h.previewEnvelopes.length, 1);
  assert.equal(h.previewEnvelopes[0].assignmentId, h.state.originalReceipts[0].id);
  assert.equal(h.previewEnvelopes[0].questions[0].content, 'first receipt snapshot');
  assert.equal(h.assignmentPosts.count, 3, 'the handoff adds no POST after the three class saves');
});

test('partial failure stays on progress; retrying only the failed class switches to one frozen preview', async () => {
  const h = assignmentHandoffHarness([
    { id: 'class-1', status: 'success' },
    { id: 'class-2', status: 'error' },
  ]);
  h.recordSavedAssignment('assignment-1', frozenSnapshot('q1', 'first class snapshot'));

  h.child.assignTargetMaybeFinish();
  assert.equal(h.receipts.some(row => row.message.type === 'archive2-original-complete'), false);
  assert.equal(h.previewLoadCount, 0);
  assert.equal(h.elements.get('original-review').hidden, true);

  const retryIds = [];
  h.child.assignTargetProcessOneClass = async classId => {
    retryIds.push(classId);
    h.child.AssignTarget.progress[classId] = { status: 'success' };
    h.recordSavedAssignment('assignment-2', frozenSnapshot('q2', 'retried class snapshot'));
  };
  await h.child.assignTargetRetryFailed();
  await h.settlePreview();

  assert.deepEqual(retryIds, ['class-2']);
  assert.equal(h.assignmentPosts.count, 2, 'only the failed class retry adds a save');
  assert.equal(h.receipts.filter(row => row.message.type === 'archive2-original-complete').length, 1);
  assert.equal(h.previewLoadCount, 1);
  assert.equal(h.previewEnvelopes[0].assignmentId, 'assignment-1');
  assert.equal(h.previewEnvelopes[0].questions[0].content, 'first class snapshot');
  h.child.assignTargetMaybeFinish();
  await h.settlePreview();
  assert.equal(h.receipts.filter(row => row.message.type === 'archive2-original-complete').length, 1,
    'repeated finish checks cannot reopen or regenerate the preview');
  assert.equal(h.previewLoadCount, 1);
  assert.equal(h.assignmentPosts.count, 2, 'preview completion performs no additional Assignment save');
});

test('Original and Saved Paper PDF failure is a saved receipt; retry POST targets PDF only', async () => {
  for (const kind of ['original', 'saved-paper']) {
    const h = assignmentReceiptRuntime(kind);
    await h.context.assignTargetProcessOneClass('classA');
    assert.deepEqual(JSON.parse(JSON.stringify(h.context.AssignTarget.progress.classA)), {
      status: 'success', assignmentId: h.assignmentId, pdfPending: true, pdfError: 'PDF worker unavailable',
    });
    h.context.renderAssignTargetProgressView();
    assert.match(h.host.innerHTML, /고1 기하반/);
    assert.match(h.host.innerHTML, new RegExp(`Assignment ID[^<]*${h.assignmentId}`));
    assert.match(h.host.innerHTML, /PDF 다시 준비/);
    for (const mode of ['exam', 'sol', 'ans']) assert.match(h.host.innerHTML, new RegExp(`archiveBoardDirectOutput\\('${h.assignmentId}','${mode}'\\)`));

    await h.context.assignTargetRetryPdf('classA');
    assert.equal(h.assignmentPosts.length, 1, `${kind}: PDF retry must not resubmit the Assignment POST`);
    assert.deepEqual(h.pdfPosts, [{ url: `https://api.test/api/class-exam-assignments/${h.assignmentId}/pdf`, method: 'POST' }]);
    assert.equal(h.context.AssignTarget.progress.classA.status, 'success');
    assert.equal(h.context.AssignTarget.progress.classA.pdfPending, false);
  }
});

test('saved and Original Assignment completion stays on receipt actions without reopening the engine', () => {
  const index = read('index.html');
  const finishCode = sliceBetween(index, 'function assignTargetFinishAndOpenEngine() {', '/* engine.html 연동 */');
  for (const { item, search } of [
    { item: { savedPaperId: 'saved-paper-exact' }, search: '?savedPaper=saved-paper-exact' },
    { item: { file: 'original/sample.js' }, search: '?archive2Issue=original%2Fsample.js' },
  ]) {
    let rendered = 0, closed = 0, engineLaunches = 0;
    const context = {
      AssignTarget: { classState: { classA: { checked: true, row: { id: 'classA' } } }, item, qpp: 4, grade: '고1', assignmentBatchId: 'batch', scope: 'class' },
      window: { location: { search } }, URLSearchParams,
      renderAssignTargetProgressView() { rendered++; },
      closeModal() { closed++; },
      launchIndexExamOutput() { engineLaunches++; },
      getQrTeacherName: () => '교사',
    };
    vm.runInNewContext(finishCode, context, { filename: 'assignment-finish-receipt.js' });
    context.assignTargetFinishAndOpenEngine();
    assert.equal(rendered, 1);
    assert.equal(closed, 0);
    assert.equal(engineLaunches, 0, 'completed Assignment output must not launch a second engine registration');
  }
});

test('Original Assignment completes on saved=true while PDF stays pending and receipts expose exact retry/output IDs', async () => {
  const h = assignmentHandoffHarness([
    { id: 'class-pdf', name: '고1 A반', status: 'success' },
  ]);
  h.recordSavedAssignment('assignment-pdf-1', frozenSnapshot('q-pdf', 'saved original bytes'), {
    pdfStatus: 'pending',
    pdfError: 'Browser Rendering unavailable',
  });

  h.child.assignTargetMaybeFinish();
  await h.settlePreview();

  assert.equal(h.assignmentPosts.count, 1, 'the committed Assignment is counted once');
  assert.equal(h.state.originalReceipts[0].className, '고1 A반');
  assert.equal(h.state.originalReceipts[0].pdfStatus, 'pending');
  assert.equal(h.receipts.filter(row => row.message.type === 'archive2-original-complete').length, 1,
    'completion means Assignment saved even when its PDF still needs preparation');
  const receiptHtml = h.elements.get('original-receipts').innerHTML;
  assert.match(receiptHtml, /고1 A반/);
  assert.match(receiptHtml, /Assignment ID[^<]*<code>assignment-pdf-1<\/code>/);
  assert.match(receiptHtml, /PDF 다시 준비/);
  assert.match(receiptHtml, /data-assignment="assignment-pdf-1" data-mode="sol"/);
  assert.match(receiptHtml, /Browser Rendering unavailable/);
  assert.equal(h.previewEnvelopes[0].assignmentId, 'assignment-pdf-1');
  assert.equal(h.previewEnvelopes[0].questions[0].content, 'saved original bytes');
});
