'use strict';

// Regression cases from the student portal UX review. Execute production
// functions with isolated API promises and minimal DOM/history boundaries.
// This checks state and request behavior; it is not browser/render evidence.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const portalPath = path.join(__dirname, '..', 'apmath', 'student', 'index.html');
const source = fs.readFileSync(portalPath, 'utf8');

function productionFunction(name) {
  const start = source.search(new RegExp(`^    (?:async )?function ${name}\\(`, 'm'));
  assert.notEqual(start, -1, `production function not found: ${name}`);
  // Top-level portal functions use four spaces; nested closing braces use more.
  // Compile the extracted declaration to fail clearly if that convention changes.
  const end = source.indexOf('\n    }', start);
  assert.notEqual(end, -1, `production function end not found: ${name}`);
  const declaration = source.slice(start, end + '\n    }'.length);
  new vm.Script(declaration, { filename: `${portalPath}:${name}` });
  return declaration;
}

const functionNames = [
  'escapeHtml', 'beginStudentRequest', 'captureStudentAuthContext',
  'isStudentAuthContextCurrent', 'isStudentRequestCurrent',
  'enterStudentView', 'captureStudentView', 'isStudentViewCurrent',
  'recordStudentView', 'restoreStudentView', 'hasPortalReadAccess',
  'normalizeOmrWrongIds', 'normalizeWrongClinicWrongIds',
  'getStudentPortalRecordedSubmission', 'loadMaterialWrongAssignments',
  'refreshMaterialWrongAssignments', 'openMaterialWrongOmr',
  'submitMaterialWrongOmr', 'renderWrongClinicReview', 'renderOmrInput',
  'renderOmrResult', 'renderOmrExams', 'hasUnfinishedStudentWork',
  'reloadStudentPortalWithVersion', 'submitOmr', 'toggleOmrWrong'
];
const production = functionNames.map(productionFunction).join('\n\n');

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function materialResponse(id, wrong = []) {
  return {
    material: { title: `Material ${id}`, number_start: 1, number_end: 200 },
    assignment: { title: `Assignment ${id}` },
    submission: { wrong_numbers: wrong, is_no_wrong: 0 }
  };
}

function harness() {
  const calls = { gets: [], posts: [], draws: [], homes: 0, toasts: [], history: [], confirmations: [], replacements: [] };
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, innerHTML: '', textContent: '', disabled: false, isConnected: true,
      focus() {}, querySelector() { return null; },
      classList: { add() {}, remove() {}, toggle() {} }
    });
    return elements.get(id);
  }
  const exams = new Map([
    ['exam-A', { assignment_id: 'exam-A', exam_title: 'Exam A', question_count: 10, is_submitted: 0, wrong_ids: [1] }],
    ['exam-B', { assignment_id: 'exam-B', exam_title: 'Exam B', question_count: 10, is_submitted: 0, wrong_ids: [] }]
  ]);
  const packets = new Map([
    ['clinic-A', { packet_key: 'clinic-A', title: 'Clinic A', item_count: 10, is_submitted: 1, review_wrong_ids: [1] }]
  ]);
  const history = {
    state: { apStudentView: 'home' },
    pushState(state) { this.state = { ...state }; calls.history.push({ kind: 'push', state: this.state }); },
    replaceState(state) { this.state = { ...state }; calls.history.push({ kind: 'replace', state: this.state }); }
  };
  let get = async () => { throw new Error('unexpected GET'); };
  let post = async () => { throw new Error('unexpected POST'); };
  const context = vm.createContext({
    console, URL, URLSearchParams, encodeURIComponent,
    STUDENT_APP_VERSION: 'fixture-version',
    isTeacherPreview: false, exactOmrAssignmentId: '',
    session: { student_id: 'student-A', student_token: 'synthetic-token-A' },
    studentRequestGeneration: 0, studentRequestSequences: Object.create(null),
    studentViewGeneration: 1, currentStudentView: 'home',
    isLoading: false, isLoadingViewGeneration: null, pendingStudentWrites: 0,
    pendingOmrSubmissionIds: new Set(),
    studentHistoryReady: true, studentHistoryRestoring: false,
    clinicLearningController: null, homeData: null,
    omrDraft: null, omrResultAssignmentId: '', wrongClinicDraft: null,
    materialWrongData: null, materialWrongDraft: null, materialWrongTargetId: '',
    $: element,
    document: { body: { dataset: {} }, querySelector: selector => selector === '.omr-browser' ? element('omr-browser') : null },
    window: {
      history, location: { href: 'https://student.example/apmath/student/', replace: url => calls.replacements.push(url) },
      scrollTo() {}, addEventListener() {},
      requestAnimationFrame(callback) { callback(); return 1; }
    },
    requestAnimationFrame(callback) { callback(); return 1; },
    queueMicrotask(callback) { callback(); },
    setTimeout() { return 1; }, clearTimeout() {},
    confirm(message) { calls.confirmations.push(message); return false; },
    readTeacherPreviewToken: () => '', disposeClinicLearningView() {},
    updateStudentNavigation() {}, setTopStudent() {},
    toast: message => calls.toasts.push(message),
    findOmrExam: id => exams.get(String(id)) || null,
    findWrongClinicPacket: key => packets.get(String(key)) || null,
    drawOmrInput: exam => calls.draws.push({ type: 'omr', id: exam.assignment_id }),
    updateOmrDraftSummary() {},
    drawWrongClinicReview: packet => calls.draws.push({ type: 'clinic', id: packet.packet_key }),
    renderOmrReviewActions: () => '', renderOmrPdfAction: () => '',
    getVisibleOmrExams: () => Array.from(exams.values()),
    renderOmrExamBrowser: () => '<div>exam browser</div>',
    loadOmrExams: async () => {},
    apiGet: (url, token) => { calls.gets.push({ url, token }); return get(url, token); },
    apiPost: (url, body) => { calls.posts.push({ url, body }); return post(url, body); }
  });
  context.renderHome = () => {
    calls.homes += 1;
    context.enterStudentView('home', false, true);
    element('app').innerHTML = 'home';
  };
  context.renderAssignments = () => context.enterStudentView('assignments', false, true);
  context.openStudentReview = () => {};
  context.drawMaterialWrongOmr = () => calls.draws.push({ type: 'material', id: context.materialWrongDraft?.assignment_id });
  vm.runInContext(production, context, { filename: portalPath });
  return { context, calls, history, exams, packets, element,
    setGet: callback => { get = callback; }, setPost: callback => { post = callback; },
    switchStudent() {
      context.session = { student_id: 'student-B', student_token: 'synthetic-token-B' };
      context.studentRequestGeneration += 1;
      context.materialWrongData = null;
      context.materialWrongDraft = null;
      context.enterStudentView('home', false, true);
    }
  };
}

test('late material list and detail responses cannot cross an authenticated student change', async () => {
  const h = harness();
  const list = deferred();
  const detail = deferred();
  h.setGet(url => url.startsWith('material-omr/student-assignments') ? list.promise : detail.promise);
  const listRequest = h.context.loadMaterialWrongAssignments(true);
  const openRequest = h.context.openMaterialWrongOmr('material-A');
  assert.ok(h.calls.gets.every(call => call.token === 'synthetic-token-A'));
  h.switchStudent();
  h.element('app').innerHTML = 'student B screen';
  list.resolve({ items: [{ assignment_id: 'material-A' }] });
  detail.resolve(materialResponse('material-A', [3]));
  await Promise.all([listRequest, openRequest]);
  assert.equal(h.context.materialWrongData, null, 'old student list must not replace current data');
  assert.equal(h.context.materialWrongDraft, null, 'old student detail must not create a current draft');
  assert.equal(h.element('app').innerHTML, 'student B screen');
  assert.deepEqual(h.calls.draws, []);
  assert.deepEqual(h.calls.toasts, []);
});

test('a late material open cannot replace a newer assignment or a screen the student left for', async () => {
  const h = harness();
  const first = deferred();
  h.setGet(url => url.includes('assignment_id=material-A') ? first.promise : Promise.resolve(materialResponse('material-B', [8])));
  const oldOpen = h.context.openMaterialWrongOmr('material-A');
  await h.context.openMaterialWrongOmr('material-B');
  const newerDraft = h.context.materialWrongDraft;
  first.resolve(materialResponse('material-A', [3]));
  await oldOpen;
  assert.equal(h.context.materialWrongDraft, newerDraft);
  assert.equal(h.context.materialWrongDraft.assignment_id, 'material-B');
  assert.deepEqual(h.calls.draws, [{ type: 'material', id: 'material-B' }]);

  const another = deferred();
  h.setGet(() => another.promise);
  const leaving = h.context.openMaterialWrongOmr('material-C');
  h.context.renderHome();
  another.resolve(materialResponse('material-C'));
  await leaving;
  assert.equal(h.context.currentStudentView, 'home');
  assert.equal(h.element('app').innerHTML, 'home');
  assert.equal(h.context.materialWrongDraft, newerDraft);
});

test('late material A submission preserves the newer material B draft and view', async () => {
  const h = harness();
  h.setGet(url => Promise.resolve(materialResponse(new URL(url, 'https://fixture/').searchParams.get('assignment_id'))));
  await h.context.openMaterialWrongOmr('material-A');
  h.context.materialWrongDraft.wrong_numbers.add(7);
  const response = deferred();
  h.setPost(() => response.promise);
  const submit = h.context.submitMaterialWrongOmr();
  assert.equal(h.context.pendingStudentWrites, 1);
  await h.context.openMaterialWrongOmr('material-B');
  const newerDraft = h.context.materialWrongDraft;
  newerDraft.wrong_numbers.add(9);
  response.resolve({ success: true });
  await submit;
  assert.equal(h.context.materialWrongDraft, newerDraft);
  assert.deepEqual(Array.from(newerDraft.wrong_numbers), [9]);
  assert.equal(h.context.currentStudentView, 'material-wrong');
  assert.equal(h.calls.homes, 0);
  assert.equal(h.context.pendingStudentWrites, 0);
  assert.equal(h.calls.posts.length, 1);
  assert.equal(h.calls.posts[0].body.assignment_id, 'material-A');
  assert.equal(h.calls.posts[0].body.student_id, 'student-A');
  assert.deepEqual(Array.from(h.calls.posts[0].body.wrong_numbers), [7]);
});

test('a late material submission cannot clear a replacement student draft', async () => {
  const h = harness();
  h.setGet(() => Promise.resolve(materialResponse('material-A')));
  await h.context.openMaterialWrongOmr('material-A');
  const response = deferred();
  h.setPost(() => response.promise);
  const submit = h.context.submitMaterialWrongOmr();
  h.switchStudent();
  const nextDraft = { assignment_id: 'student-B-material', wrong_numbers: new Set([12]) };
  h.context.materialWrongDraft = nextDraft;
  h.context.materialWrongData = { items: [{ assignment_id: 'student-B-material' }] };
  response.resolve({ success: true });
  await submit;
  assert.equal(h.context.materialWrongDraft, nextDraft);
  assert.equal(h.context.materialWrongData.items[0].assignment_id, 'student-B-material');
  assert.equal(h.calls.homes, 0);
  assert.equal(h.context.pendingStudentWrites, 0);
  assert.deepEqual(h.calls.toasts, []);
});

test('reopening the same OMR or restoring the same clinic preserves unsaved selections', async () => {
  const h = harness();
  h.context.renderOmrInput('exam-A');
  const omrDraft = h.context.omrDraft;
  omrDraft.wrong_ids = [2, 3];
  h.context.renderHome();
  h.context.renderOmrInput('exam-A');
  assert.equal(h.context.omrDraft, omrDraft);
  assert.deepEqual(Array.from(h.context.omrDraft.wrong_ids), [2, 3]);
  assert.deepEqual(Array.from(h.context.omrDraft.saved_wrong_ids), [1]);

  h.context.renderWrongClinicReview('clinic-A');
  const clinicDraft = h.context.wrongClinicDraft;
  clinicDraft.wrong_ids = [4, 5];
  h.context.renderHome();
  h.history.state = { apStudentView: 'clinic-review', packetKey: 'clinic-A' };
  await h.context.restoreStudentView({ state: h.history.state });
  assert.equal(h.context.wrongClinicDraft, clinicDraft);
  assert.deepEqual(Array.from(h.context.wrongClinicDraft.wrong_ids), [4, 5]);
  assert.deepEqual(Array.from(h.context.wrongClinicDraft.saved_wrong_ids), [1]);
});

test('history identifies the displayed result and each material assignment', async () => {
  const h = harness();
  h.context.omrDraft = { assignment_id: 'exam-B', wrong_ids: [9] };
  const examA = h.exams.get('exam-A');
  Object.assign(examA, { is_submitted: 1, score: 80 });
  h.context.renderOmrResult(examA);
  assert.equal(h.history.state.apStudentView, 'omr-result');
  assert.equal(h.history.state.assignmentId, 'exam-A', 'result identity must come from the rendered exam');
  assert.equal(h.context.omrDraft.assignment_id, 'exam-B');
  assert.ok(h.element('app').innerHTML.includes('Exam A'));

  h.setGet(url => Promise.resolve(materialResponse(new URL(url, 'https://fixture/').searchParams.get('assignment_id'))));
  await h.context.openMaterialWrongOmr('material-A');
  await h.context.openMaterialWrongOmr('material-B');
  assert.deepEqual(h.calls.history.filter(call => call.state.apStudentView === 'material-wrong').map(call => call.state.assignmentId), ['material-A', 'material-B']);
  h.history.state = { apStudentView: 'material-wrong', assignmentId: 'material-A' };
  const countBeforeBack = h.calls.history.length;
  await h.context.restoreStudentView({ state: h.history.state });
  assert.equal(h.context.materialWrongDraft.assignment_id, 'material-A');
  assert.equal(h.calls.history.length, countBeforeBack, 'restoring history must not push another entry');
});

test('an async history restoration does not suppress a subsequent real navigation', async () => {
  const h = harness();
  const response = deferred();
  h.context.loadOmrExams = () => response.promise;
  h.history.state = { apStudentView: 'omr-list' };
  const restore = h.context.restoreStudentView({ state: h.history.state });
  assert.equal(h.context.currentStudentView, 'omr-list');
  h.context.renderHome();
  assert.equal(h.history.state.apStudentView, 'home', 'new navigation during the await must be recorded');
  response.resolve();
  await restore;
  assert.equal(h.context.currentStudentView, 'home');
  assert.equal(h.element('app').innerHTML, 'home', 'late list response must not repaint after leaving');
  assert.equal(h.context.studentHistoryRestoring, false);
});

test('PWA update protection follows dirty drafts on home and outstanding writes', () => {
  const h = harness();
  assert.equal(h.context.hasUnfinishedStudentWork(), false);
  const drafts = [
    { field: 'omrDraft', value: { assignment_id: 'exam-A', wrong_ids: [2], saved_wrong_ids: [1] } },
    { field: 'wrongClinicDraft', value: { packet_key: 'clinic-A', wrong_ids: [2], saved_wrong_ids: [1] } },
    { field: 'materialWrongDraft', value: { assignment_id: 'material-A', wrong_numbers: new Set([2]), saved_wrong_numbers: [1], is_no_wrong: 0, saved_is_no_wrong: 0 } }
  ];
  for (const { field, value } of drafts) {
    h.context[field] = value;
    assert.equal(h.context.currentStudentView, 'home');
    assert.equal(h.context.hasUnfinishedStudentWork(), true, `${field} must remain protected away from its form`);
    h.context.reloadStudentPortalWithVersion('new-version');
    assert.equal(h.calls.replacements.length, 0, 'declining update must retain the current document');
    h.context[field] = null;
  }
  assert.equal(h.calls.confirmations.length, drafts.length);
  h.context.pendingStudentWrites = 1;
  assert.equal(h.context.hasUnfinishedStudentWork(), true, 'a write remains protected even after its view changes');
  h.context.pendingStudentWrites = 0;
  assert.equal(h.context.hasUnfinishedStudentWork(), false);
  h.context.reloadStudentPortalWithVersion('new-version');
  assert.equal(h.calls.replacements.length, 1);
});

test('the actual service worker controller-change handler defers reload for off-screen drafts and pending writes', () => {
  const h = harness();
  const listeners = new Map();
  let reloads = 0;
  let notices = 0;
  h.context.navigator = { serviceWorker: {
    controller: {}, addEventListener: (name, callback) => listeners.set(name, callback)
  } };
  h.context.document.addEventListener = () => {};
  h.context.window.setInterval = () => 1;
  h.context.window.location.reload = () => { reloads += 1; };
  h.context.showStudentUpdateNotice = () => { notices += 1; };
  const start = source.indexOf("    if ('serviceWorker' in navigator) {");
  const end = source.indexOf('\n  </script>', start);
  assert.ok(start >= 0 && end > start, 'student service worker event wiring must be available');
  vm.runInContext(source.slice(start, end), h.context, { filename: `${portalPath}:serviceWorker` });
  const controllerChange = listeners.get('controllerchange');
  assert.equal(typeof controllerChange, 'function');

  h.context.pendingStudentWrites = 1;
  controllerChange();
  assert.equal(reloads, 0);
  h.context.pendingStudentWrites = 0;
  h.context.omrDraft = { assignment_id: 'exam-A', wrong_ids: [4], saved_wrong_ids: [] };
  controllerChange();
  assert.equal(h.context.currentStudentView, 'home');
  assert.equal(reloads, 0, 'a retained draft must not be lost merely because home is visible');
  assert.equal(notices, 2);
  h.context.omrDraft = null;
  controllerChange();
  controllerChange();
  assert.equal(reloads, 1, 'a clean session may update, but only one reload is scheduled');
});

test('reentering an OMR with a pending submission cannot send a duplicate or change its answers', async () => {
  const h = harness();
  h.context.renderOmrInput('exam-A');
  h.context.omrDraft.wrong_ids = [2, 3];
  const response = deferred();
  h.setPost(() => response.promise);
  const firstSubmit = h.context.submitOmr();
  assert.equal(h.calls.posts.length, 1);
  assert.equal(h.context.pendingStudentWrites, 1);
  h.context.renderHome();
  h.context.renderOmrInput('exam-A');
  h.context.toggleOmrWrong(8);
  assert.deepEqual(Array.from(h.context.omrDraft.wrong_ids), [2, 3], 'the submitted selection stays fixed while its result is pending');
  await h.context.submitOmr();
  assert.equal(h.calls.posts.length, 1, 'reentry must not supersede the first write with a duplicate POST');
  response.resolve({ session: { id: 'session-A', score: 80, wrong_ids: [2, 3] } });
  await firstSubmit;
  assert.equal(h.exams.get('exam-A').is_submitted, 1);
  assert.equal(h.exams.get('exam-A').score, 80);
  assert.equal(h.context.currentStudentView, 'omr-result');
  assert.equal(h.history.state.assignmentId, 'exam-A');
  assert.equal(h.context.pendingStudentWrites, 0);
  assert.equal(h.context.pendingOmrSubmissionIds.size, 0);
  assert.deepEqual(Array.from(h.calls.posts[0].body.wrong_ids), [2, 3]);
});

test('a failed OMR submission after reentry is reported and releases the lock for an explicit retry', async () => {
  const h = harness();
  h.context.renderOmrInput('exam-A');
  h.context.omrDraft.wrong_ids = [2];
  const response = deferred();
  h.setPost(() => response.promise);
  const submit = h.context.submitOmr();
  h.context.renderHome();
  h.context.renderOmrInput('exam-A');
  response.reject(new Error('Synthetic connection failure'));
  await submit;
  assert.equal(h.context.currentStudentView, 'omr-input');
  assert.equal(h.exams.get('exam-A').is_submitted, 0);
  assert.deepEqual(Array.from(h.context.omrDraft.wrong_ids), [2]);
  assert.ok(h.calls.toasts.includes('Synthetic connection failure'), 'a reentered form still needs the result of its own pending submission');
  assert.equal(h.context.pendingOmrSubmissionIds.size, 0);
  assert.equal(h.context.pendingStudentWrites, 0);
  assert.equal(h.element('omr-submit-btn').disabled, false);
  h.setPost(() => Promise.resolve({ session: { id: 'session-A', score: 90, wrong_ids: [2] } }));
  await h.context.submitOmr();
  assert.equal(h.calls.posts.length, 2);
  assert.equal(h.exams.get('exam-A').is_submitted, 1);
  assert.equal(h.context.currentStudentView, 'omr-result');
});
