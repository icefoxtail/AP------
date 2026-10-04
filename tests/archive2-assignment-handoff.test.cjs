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

function assignmentHandoffHarness(classes, kind = 'original') {
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
      item: kind === 'saved-paper'
        ? { savedPaperId: 'saved-paper-exact', title: '저장 시험지', subject: '공통수학1' }
        : { file: 'original/sample.js', subject: '수학' },
      qpp: 4,
      classState: Object.fromEntries(classes.map(row => [row.id, {
        checked: true,
        row: { id: row.id, name: row.name || row.id },
      }])),
    },
    location: {
      search: kind === 'saved-paper'
        ? '?savedPaper=saved-paper-exact&archive2Embedded=1'
        : '?archive2Issue=original%2Fsample.js&archive2Embedded=1',
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
  const originalFrame = kind === 'original' ? { hidden: false, contentWindow: child } : null;
  const savedPaperFrame = kind === 'saved-paper' ? { hidden: false, contentWindow: child } : null;
  const elements = new Map([
    ['original-review', { hidden: true }],
    ['original-issue-frame', originalFrame],
    ['saved-paper-issue-frame', savedPaperFrame],
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
    document: { querySelector: () => ({ setAttribute() {}, removeAttribute() {} }) },
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

test('Saved Paper embedded issue mounts the shared receipt and frozen Assignment preview surface', () => {
  const workspace = read('archive2-workspace.js');
  const entry = read('archive2-entry.js');
  const openSaved = sliceBetween(workspace, 'function openSavedPaperIssue(id) {', 'window.Archive2WorkspaceSavedPaperIssue =');
  const captured = { title: '', body: '' };
  const context = {
    URL,
    location: { href: 'https://archive.test/archive/workspace.html' },
    state: { originalReceipts: [{ id: 'stale' }], originalPreviewEnvelope: { stale: true }, originalPreviewToken: 1 },
    esc: value => String(value ?? ''),
    button: (action, label, extra = '') => `<button data-action="${action}" ${extra}>${label}</button>`,
    showDialog(title, body) { captured.title = title; captured.body = body; },
    $: () => ({ classList: { add(value) { captured.className = value; } } }),
    setOriginalStep(step) { captured.step = step; },
  };
  vm.runInNewContext(openSaved, context);
  context.openSavedPaperIssue('saved-paper-exact');
  assert.equal(context.state.originalReceipts.length, 0);
  assert.equal(context.state.originalPreviewEnvelope, null);
  assert.equal(context.state.originalPreviewToken, 2);
  assert.equal(captured.title, '저장한 시험지 출제');
  assert.equal(captured.step, 'targets');
  assert.match(captured.body, /id="saved-paper-issue-frame"/);
  assert.match(captured.body, /id="original-receipts"/);
  assert.match(captured.body, /id="original-review" hidden/);
  assert.match(captured.body, /id="original-preview-frame"/);
  assert.match(captured.body, /data-action="original-review" disabled/);
  assert.match(captured.body, /savedPaper=saved-paper-exact/);
  assert.match(entry, /if \(requested \|\| requestedSavedPaper\) \{/,
    'Saved Paper uses the same all-success embedded completion override as Original');
});

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

test('Saved Paper one-class completion opens the exact Assignment frozen preview in the parent', async () => {
  const h = assignmentHandoffHarness([{ id: 'saved-class-1', status: 'success' }], 'saved-paper');
  h.recordSavedAssignment('saved-assignment-1', frozenSnapshot('saved-q1', 'saved class frozen content'));

  h.child.assignTargetMaybeFinish();
  await h.settlePreview();

  assert.deepEqual(h.receipts.map(row => row.message.type), [
    'archive2-original-saved',
    'archive2-original-complete',
  ]);
  assert.equal(h.elements.get('saved-paper-issue-frame').hidden, true);
  assert.equal(h.elements.get('original-review').hidden, false);
  assert.equal(h.previewLoadCount, 1);
  assert.equal(h.previewEnvelopes[0].sourceKind, 'assignment');
  assert.equal(h.previewEnvelopes[0].assignmentId, 'saved-assignment-1');
  assert.equal(h.previewEnvelopes[0].questions[0].content, 'saved class frozen content');
  assert.deepEqual(h.statusReads, ['/class-exam-assignments/saved-assignment-1/status']);
  assert.equal(h.assignmentPosts.count, 1, 'parent preview adds no Assignment POST');
});

test('Saved Paper three-class completion preserves each receipt and previews the first exact Assignment once', async () => {
  const h = assignmentHandoffHarness([
    { id: 'saved-class-1', status: 'success' },
    { id: 'saved-class-2', status: 'success' },
    { id: 'saved-class-3', status: 'success' },
  ], 'saved-paper');
  h.recordSavedAssignment('saved-assignment-1', frozenSnapshot('saved-q1', 'first saved Assignment'));
  h.recordSavedAssignment('saved-assignment-2', frozenSnapshot('saved-q2', 'second saved Assignment'));
  h.recordSavedAssignment('saved-assignment-3', frozenSnapshot('saved-q3', 'third saved Assignment'));

  h.child.assignTargetMaybeFinish();
  await h.settlePreview();

  assert.equal(h.state.originalReceipts.length, 3);
  assert.deepEqual(h.state.originalReceipts.map(row => row.id), [
    'saved-assignment-1', 'saved-assignment-2', 'saved-assignment-3',
  ]);
  assert.equal(h.receipts.filter(row => row.message.type === 'archive2-original-complete').length, 1);
  assert.equal(h.previewLoadCount, 1);
  assert.equal(h.previewEnvelopes[0].assignmentId, h.state.originalReceipts[0].id);
  assert.equal(h.previewEnvelopes[0].questions[0].content, 'first saved Assignment');
  assert.equal(h.assignmentPosts.count, 3);
});

test('Saved Paper partial failure stays on progress and retrying the failed class completes once', async () => {
  const h = assignmentHandoffHarness([
    { id: 'saved-class-1', status: 'success' },
    { id: 'saved-class-2', status: 'error' },
  ], 'saved-paper');
  h.recordSavedAssignment('saved-assignment-1', frozenSnapshot('saved-q1', 'first saved Assignment'));

  h.child.assignTargetMaybeFinish();
  assert.equal(h.receipts.some(row => row.message.type === 'archive2-original-complete'), false);
  assert.equal(h.previewLoadCount, 0);
  assert.equal(h.elements.get('original-review').hidden, true);

  const retryIds = [];
  h.child.assignTargetProcessOneClass = async classId => {
    retryIds.push(classId);
    h.child.AssignTarget.progress[classId] = { status: 'success' };
    h.recordSavedAssignment('saved-assignment-2', frozenSnapshot('saved-q2', 'retried saved Assignment'));
  };
  await h.child.assignTargetRetryFailed();
  await h.settlePreview();

  assert.deepEqual(retryIds, ['saved-class-2']);
  assert.equal(h.receipts.filter(row => row.message.type === 'archive2-original-complete').length, 1);
  assert.equal(h.previewLoadCount, 1);
  assert.equal(h.previewEnvelopes[0].assignmentId, 'saved-assignment-1');
  assert.equal(h.assignmentPosts.count, 2, 'retry saves one failed class and preview adds no POST');
});

test('Saved Paper PDF failure remains complete and previews the exact receipt Assignment', async () => {
  const h = assignmentHandoffHarness([
    { id: 'saved-class-pdf', name: '고1 저장반', status: 'success' },
  ], 'saved-paper');
  h.recordSavedAssignment('saved-assignment-pdf', frozenSnapshot('saved-pdf-q', 'saved PDF pending snapshot'), {
    pdfStatus: 'pending', pdfError: 'PDF renderer unavailable',
  });

  h.child.assignTargetMaybeFinish();
  await h.settlePreview();

  assert.equal(h.state.originalReceipts[0].pdfStatus, 'pending');
  assert.equal(h.state.originalReceipts[0].pdfError, 'PDF renderer unavailable');
  assert.equal(h.receipts.filter(row => row.message.type === 'archive2-original-complete').length, 1);
  assert.equal(h.previewEnvelopes[0].assignmentId, 'saved-assignment-pdf');
  assert.match(h.elements.get('original-receipts').innerHTML, /PDF 다시 준비/);
  const retry = assignmentReceiptRuntime('saved-paper');
  await retry.context.assignTargetProcessOneClass('classA');
  await retry.context.assignTargetRetryPdf('classA');
  assert.deepEqual(retry.pdfPosts, [{ url: 'https://api.test/api/class-exam-assignments/assignment-saved-paper-pdf/pdf', method: 'POST' }]);
  assert.equal(retry.assignmentPosts.length, 1, 'PDF retry never creates a second Assignment');
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

async function runSharedTargetPicker(classes, preferredGrade) {
  const index = read('index.html');
  const helpers = sliceBetween(index, 'function sortQrClassesForSelect(list) {', 'function getArchiveExamQuestionCount(item) {');
  const picker = sliceBetween(index, 'async function openAssignTargetPanel(item, qpp) {', 'function renderAssignTargetNotice(message) {');
  const body = { innerHTML: '' };
  const notices = [];
  const selectedGrades = [];
  const context = {
    document: { getElementById: () => ({ classList: { add() {} } }) },
    Archive2History: require('../archive/archive2-history.js'),
    resetAssignTargetPreviewPane() {},
    assignTargetBodyEl: () => body,
    getIndexAssignmentAuthHeader: () => ({ Authorization: 'Bearer fixture' }),
    ARCHIVE_AP_API_BASE: 'https://api.test/api',
    fetch: async () => ({ status: 200, ok: true, json: async () => ({ success: true, classes }) }),
    isArchiveAdminSession: () => false,
    getArchiveCurrentTeacherId: () => 'teacher-a',
    getArchiveCurrentTeacherName: () => 'Teacher A',
    compactText: value => String(value ?? '').normalize('NFC').replace(/\s+/g, '').toLowerCase(),
    assignTargetSwitchGrade(grade) { selectedGrades.push(grade); },
    renderAssignTargetNotice(message) { notices.push(String(message)); },
    renderAssignTargetLoginPrompt() { notices.push('login'); },
    console: { error(error) { throw error; } },
  };
  vm.runInNewContext(`${helpers}\n${picker}`, context, { filename: 'shared-target-picker.js' });
  await context.openAssignTargetPanel({ savedPaperId: 'saved-paper-exact', grade: preferredGrade }, 4);
  return { context, notices, selectedGrades };
}

test('Saved Paper shared target picker exposes high3-only, mixed and fallback grades after teacher filtering', async () => {
  const index = read('index.html');
  assert.ok(index.indexOf('<script src="archive2-history.js?v=20261004-class-grade-fallback-1"') <
    index.indexOf('<script src="archive2-entry.js?'), 'shared grade resolver loads before Saved Paper entry');
  const high3Only = await runSharedTargetPicker([
    { id: 'high3-explicit', name: '고3 대상반', grade: '고3', teacher_id: 'teacher-a' },
  ], '고2');
  assert.deepEqual(
    Array.from(high3Only.context.getIndexAvailableGrades(high3Only.context.AssignTarget.classRows)),
    ['고3'],
    'the actual shared picker must retain a high3-only target even when the paper grade is different',
  );
  assert.deepEqual(high3Only.selectedGrades, ['고3']);

  const mixed = await runSharedTargetPicker([
    { id: 'high1', name: '고1 대상반', grade: '고1', teacher_id: 'teacher-a', teacher_name: 'Teacher A' },
    { id: 'high3-name', name: '고3 이름 fallback 반', teacher_id: 'teacher-a', teacher_name: 'Teacher A' },
    { id: 'other-teacher', name: '고2 다른 선생님 반', grade: '고2', teacher_id: 'teacher-b', teacher_name: 'Teacher B' },
  ], '고1');
  assert.deepEqual(
    Array.from(mixed.context.getIndexAvailableGrades(mixed.context.AssignTarget.classRows)),
    ['고1', '고3'],
    'the paper grade is only an initial preference; every teacher-assigned grade remains available',
  );
  assert.deepEqual(mixed.selectedGrades, ['고1']);
  assert.deepEqual(
    Array.from(mixed.context.AssignTarget.classRows, row => row.id),
    ['high1', 'high3-name'],
    'the shared picker keeps its current-teacher class filter',
  );

  const labelOnly = await runSharedTargetPicker([
    { id: 'high3-label', name: '졸업반', grade_label: '고3', teacher_id: 'teacher-a' },
  ], '고3');
  assert.deepEqual(
    Array.from(labelOnly.context.getIndexAvailableGrades(labelOnly.context.AssignTarget.classRows)),
    ['고3'],
    'explicit grade_label metadata remains supported',
  );

  const noneAssigned = await runSharedTargetPicker([
    { id: 'other-teacher-only', name: '고3 다른 담당 반', grade: '고3', teacher_id: 'teacher-b' },
  ], '고3');
  assert.deepEqual(noneAssigned.selectedGrades, []);
  assert.match(noneAssigned.notices.join(' '), /담당 반이 없습니다/);
});
