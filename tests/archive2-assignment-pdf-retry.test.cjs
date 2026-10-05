const test = require('node:test');
const assert = require('node:assert/strict');
const { workspaceHarness, okJson } = require('./helpers/archive2-workspace-ui-harness.cjs');

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

test('student assignment PDF modal re-enables retries after 500 and 502 and refreshes on success', async () => {
  const requests = [];
  let attempts = 0;
  const h = workspaceHarness(async (url, init = {}) => {
    const parsed = new URL(String(url));
    const method = init.method || 'GET';
    requests.push({ path: parsed.pathname, method });
    if (parsed.pathname.endsWith('/assignment-pdf-modal/status'))
      return okJson({ assignment: {
        id: 'assignment-pdf-modal', exam_title: 'Modal 시험', exam_date: '2026-10-01',
        question_count: 5, pdf_status: attempts >= 3 ? 'ready' : 'failed', pdf_error: '',
      }, students: [] });
    if (parsed.pathname.endsWith('/assignment-pdf-modal/pdf') && method === 'POST') {
      attempts++;
      if (attempts <= 2) {
        const status = attempts === 1 ? 500 : 502;
        return { ok: false, status, json: async () => ({ error: `PDF ${status}` }) };
      }
      return okJson({ success: true, assignment: { pdf_status: 'ready', pdf_error: '' } });
    }
    throw new Error(`unexpected request ${method} ${parsed.pathname}`);
  });
  h.workspace.setView('recent');
  h.workspace.state.recentRows = [{
    id: 'assignment-pdf-modal', title: 'Modal 시험', date: '2026-10-01',
    targetGrade: '고2', contentGrade: '고2', subjectKeys: [], subjectLabel: '미적분',
    className: '고2 A반', questionCount: 5, recipientCount: 1, submittedCount: 0,
    pdfReady: false, pdfStatus: 'failed', pdfError: '이전 실패',
  }];
  await h.workspace.assignmentStatus('assignment-pdf-modal');
  const button = { dataset: { action: 'assignment-pdf', assignment: 'assignment-pdf-modal' }, disabled: false };
  const target = { closest: selector => selector === 'button' ? button : null };
  const click = () => h.event('click', target, { preventDefault() {}, stopPropagation() {} });

  await click();
  assert.equal(button.disabled, false);
  assert.match(h.node('status').textContent, /PDF만 다시 준비/);
  assert.match(h.node('modal-body').innerHTML, /PDF 다시 준비/);
  await click();
  assert.equal(button.disabled, false);
  assert.match(h.node('status').textContent, /PDF만 다시 준비/);
  await click();
  assert.equal(attempts, 3);
  assert.match(h.node('modal-body').innerHTML, /PDF 준비 완료/);
  assert.doesNotMatch(h.node('modal-body').innerHTML, /PDF 다시 준비/);
  assert.equal(requests.filter(row => row.method === 'POST').length, 3);
  assert.equal(requests.filter(row => row.method === 'POST' && row.path.endsWith('/pdf')).length, 3);
  assert.equal(requests.filter(row => row.method === 'POST' && !row.path.endsWith('/pdf')).length, 0,
    'retry clicks do not issue Assignment creation requests');
});

test('a duplicate PDF retry click during an in-flight mutation issues only one PDF POST', async () => {
  const pdf = deferred();
  let posts = 0;
  let statusGets = 0;
  const h = workspaceHarness((url, init = {}) => {
    const parsed = new URL(String(url));
    const method = init.method || 'GET';
    if (parsed.pathname.endsWith('/assignment-once/status')) {
      statusGets++;
      return Promise.resolve(okJson({ assignment: {
        id: 'assignment-once', exam_title: 'Once 시험', exam_date: '2026-10-03',
        question_count: 1, pdf_status: statusGets > 1 ? 'ready' : 'failed',
      }, students: [] }));
    }
    if (parsed.pathname.endsWith('/assignment-once/pdf') && method === 'POST') {
      posts++;
      return pdf.promise;
    }
    throw new Error(`unexpected request ${method} ${parsed.pathname}`);
  });
  h.workspace.setView('recent');
  h.workspace.state.recentSelectedAssignmentId = 'assignment-once';
  h.workspace.state.recentRows = [{
    id: 'assignment-once', title: 'Once 시험', date: '2026-10-03', subjectKeys: [],
    pdfReady: false, pdfStatus: 'failed',
  }];
  await h.workspace.assignmentStatus('assignment-once');
  const firstButton = { dataset: { action: 'assignment-pdf', assignment: 'assignment-once' }, disabled: false };
  const firstClick = h.event('click', { closest: selector => selector === 'button' ? firstButton : null }, {
    preventDefault() {}, stopPropagation() {},
  });
  await h.event('click', { closest: selector => selector === 'button'
    ? { dataset: { action: 'assignment-pdf', assignment: 'assignment-once' }, disabled: false }
    : null }, { preventDefault() {}, stopPropagation() {} });
  assert.equal(posts, 1);
  pdf.resolve(okJson({ success: true, assignment: { id: 'assignment-once', pdf_status: 'ready' } }));
  await firstClick;
  assert.equal(posts, 1);
  assert.equal(statusGets, 2);
  assert.equal(h.workspace.state.recentRows[0].pdfReady, true);
});

test('PDF POST ready remains ready when the follow-up status request fails', async () => {
  const requests = [];
  let statusGets = 0;
  const h = workspaceHarness(async (url, init = {}) => {
    const parsed = new URL(String(url));
    const method = init.method || 'GET';
    requests.push({ path: parsed.pathname, method });
    if (parsed.pathname.endsWith('/assignment-ready/status')) {
      statusGets++;
      if (statusGets === 1) return okJson({ assignment: {
        id: 'assignment-ready', exam_title: 'Ready 시험', exam_date: '2026-10-03',
        question_count: 4, pdf_status: 'failed', pdf_error: '이전 오류',
      }, students: [] });
      return { ok: false, status: 500, json: async () => ({ error: 'status unavailable' }) };
    }
    if (parsed.pathname.endsWith('/assignment-ready/pdf') && method === 'POST')
      return okJson({ success: true, assignment: { id: 'assignment-ready', pdf_status: 'ready', pdf_error: '' } });
    throw new Error(`unexpected request ${method} ${parsed.pathname}`);
  });
  h.workspace.setView('recent');
  h.workspace.state.recentSelectedAssignmentId = 'assignment-ready';
  h.workspace.state.recentRows = [{
    id: 'assignment-ready', title: 'Ready 시험', date: '2026-10-03', subjectKeys: [],
    pdfReady: false, pdfStatus: 'failed', pdfError: '이전 오류',
  }];
  await h.workspace.assignmentStatus('assignment-ready');
  const button = { dataset: { action: 'assignment-pdf', assignment: 'assignment-ready' }, disabled: false };
  await h.event('click', { closest: selector => selector === 'button' ? button : null }, {
    preventDefault() {}, stopPropagation() {},
  });

  assert.equal(h.workspace.state.recentRows[0].pdfReady, true);
  assert.equal(h.workspace.state.recentRows[0].pdfStatus, 'ready');
  assert.match(h.node('modal-body').innerHTML, /PDF 준비 완료/);
  assert.doesNotMatch(h.node('modal-body').innerHTML, /PDF 다시 준비/);
  assert.match(h.node('status').textContent, /PDF 상태는 저장되었습니다/);
  assert.equal(requests.filter(row => row.method === 'POST' && row.path.endsWith('/pdf')).length, 1);
  assert.equal(requests.filter(row => row.method === 'POST' && !row.path.endsWith('/pdf')).length, 0);
});

test('a status response started before PDF commit cannot overwrite the newer PDF mutation result', async () => {
  const oldStatus = deferred();
  const refreshedStatus = deferred();
  const secondStatusRequested = deferred();
  let statusGets = 0;
  const h = workspaceHarness(async (url, init = {}) => {
    const parsed = new URL(String(url));
    const method = init.method || 'GET';
    if (parsed.pathname.endsWith('/assignment-order/status')) {
      statusGets++;
      if (statusGets === 1) return oldStatus.promise;
      secondStatusRequested.resolve();
      return refreshedStatus.promise;
    }
    if (parsed.pathname.endsWith('/assignment-order/pdf') && method === 'POST')
      return okJson({ success: true, assignment: { id: 'assignment-order', pdf_status: 'ready' } });
    throw new Error(`unexpected request ${method} ${parsed.pathname}`);
  });
  h.workspace.setView('recent');
  h.workspace.state.recentSelectedAssignmentId = 'assignment-order';
  h.workspace.state.recentRows = [{
    id: 'assignment-order', title: 'Ordered 시험', date: '2026-10-03', subjectKeys: [],
    pdfReady: false, pdfStatus: 'failed',
  }];
  h.workspace.state.openAssignment = { assignment: {
    id: 'assignment-order', exam_title: 'Ordered 시험', exam_date: '2026-10-03',
    question_count: 2, pdf_status: 'failed',
  }, students: [] };
  h.node('modal').showModal();
  const olderRead = h.workspace.assignmentStatus('assignment-order');
  const button = { dataset: { action: 'assignment-pdf', assignment: 'assignment-order' }, disabled: false };
  const retry = h.event('click', { closest: selector => selector === 'button' ? button : null }, {
    preventDefault() {}, stopPropagation() {},
  });
  await secondStatusRequested.promise;
  assert.equal(statusGets, 2, 'PDF commit starts a fresh status read after the mutation version advances');
  refreshedStatus.resolve(okJson({ assignment: {
    id: 'assignment-order', exam_title: 'Ordered 시험', exam_date: '2026-10-03',
    question_count: 2, pdf_status: 'ready',
  }, students: [] }));
  await retry;
  oldStatus.resolve(okJson({ assignment: {
    id: 'assignment-order', exam_title: 'Ordered 시험', exam_date: '2026-10-03',
    question_count: 2, pdf_status: 'failed',
  }, students: [] }));
  await olderRead;
  assert.equal(h.workspace.state.openAssignment.assignment.pdf_status, 'ready');
  assert.equal(h.workspace.state.recentRows[0].pdfReady, true);
  assert.doesNotMatch(h.node('modal-body').innerHTML, /PDF 다시 준비/);
});

test('PDF mutation failure remains retryable and preserves the Worker failed status response', async () => {
  let posts = 0;
  const h = workspaceHarness(async (url, init = {}) => {
    const parsed = new URL(String(url));
    const method = init.method || 'GET';
    if (parsed.pathname.endsWith('/assignment-failed-status/status'))
      return okJson({ assignment: {
        id: 'assignment-failed-status', exam_title: 'Failed 시험', exam_date: '2026-10-03',
        question_count: 4, pdf_status: 'failed', pdf_error: posts ? 'Worker still failed' : 'Worker failure',
      }, students: [] });
    if (parsed.pathname.endsWith('/assignment-failed-status/pdf') && method === 'POST') {
      posts++;
      return okJson({ success: true, assignment: {
        id: 'assignment-failed-status', pdf_status: 'failed', pdf_error: 'Worker still failed',
      } });
    }
    throw new Error(`unexpected request ${method} ${parsed.pathname}`);
  });
  h.workspace.setView('recent');
  h.workspace.state.recentSelectedAssignmentId = 'assignment-failed-status';
  h.workspace.state.recentRows = [{
    id: 'assignment-failed-status', title: 'Failed 시험', date: '2026-10-03', subjectKeys: [],
    pdfReady: false, pdfStatus: 'failed', pdfError: 'Worker failure',
  }];
  await h.workspace.assignmentStatus('assignment-failed-status');
  const button = { dataset: { action: 'assignment-pdf', assignment: 'assignment-failed-status' }, disabled: false };
  await h.event('click', { closest: selector => selector === 'button' ? button : null }, {
    preventDefault() {}, stopPropagation() {},
  });
  assert.equal(posts, 1);
  assert.equal(h.workspace.state.recentRows[0].pdfStatus, 'failed');
  assert.equal(h.workspace.state.recentRows[0].pdfError, 'Worker still failed');
  assert.match(h.node('modal-body').innerHTML, /PDF 준비 실패/);
  assert.match(h.node('modal-body').innerHTML, /PDF 다시 준비/);
  assert.doesNotMatch(h.node('modal-body').innerHTML, /aria-busy="true"/);
});

test('closing the Assignment modal during PDF retry never reopens it or starts a refresh', async () => {
  const pdf = deferred();
  let statusGets = 0;
  const h = workspaceHarness((url, init = {}) => {
    const parsed = new URL(String(url));
    const method = init.method || 'GET';
    if (parsed.pathname.endsWith('/assignment-close/status')) {
      statusGets++;
      return Promise.resolve(okJson({ assignment: {
        id: 'assignment-close', exam_title: 'Closed 시험', exam_date: '2026-10-03',
        question_count: 4, pdf_status: 'failed',
      }, students: [] }));
    }
    if (parsed.pathname.endsWith('/assignment-close/pdf') && method === 'POST') return pdf.promise;
    throw new Error(`unexpected request ${method} ${parsed.pathname}`);
  });
  h.workspace.setView('recent');
  h.workspace.state.recentSelectedAssignmentId = 'assignment-close';
  h.workspace.state.recentRows = [{
    id: 'assignment-close', title: 'Closed 시험', date: '2026-10-03', subjectKeys: [], pdfReady: false, pdfStatus: 'failed',
  }];
  await h.workspace.assignmentStatus('assignment-close');
  const button = { dataset: { action: 'assignment-pdf', assignment: 'assignment-close' }, disabled: false };
  const retry = h.event('click', { closest: selector => selector === 'button' ? button : null }, {
    preventDefault() {}, stopPropagation() {},
  });
  h.node('modal').close();
  pdf.resolve(okJson({ success: true, assignment: { id: 'assignment-close', pdf_status: 'ready' } }));
  await retry;
  assert.equal(statusGets, 1, 'a closed modal has no status refresh authority');
  assert.equal(h.node('modal').open, false);
  assert.equal(h.workspace.state.recentRows[0].pdfStatus, 'failed',
    'the late mutation cannot patch the view after its modal authority was lost');
});

test('switching Assignment selection during PDF retry keeps the new modal authoritative', async () => {
  const pdf = deferred();
  let aStatusGets = 0;
  const h = workspaceHarness((url, init = {}) => {
    const parsed = new URL(String(url));
    const method = init.method || 'GET';
    if (parsed.pathname.endsWith('/assignment-a/pdf') && method === 'POST') return pdf.promise;
    if (parsed.pathname.endsWith('/assignment-a/status')) {
      aStatusGets++;
      return Promise.resolve(okJson({ assignment: {
        id: 'assignment-a', exam_title: 'A 시험', exam_date: '2026-10-03', question_count: 4, pdf_status: 'failed',
      }, students: [] }));
    }
    if (parsed.pathname.endsWith('/assignment-b/status'))
      return Promise.resolve(okJson({ assignment: {
        id: 'assignment-b', exam_title: 'B 시험', exam_date: '2026-10-04', question_count: 3, pdf_status: 'ready',
      }, students: [] }));
    throw new Error(`unexpected request ${method} ${parsed.pathname}`);
  });
  h.workspace.setView('recent');
  h.workspace.state.recentSelectedAssignmentId = 'assignment-a';
  h.workspace.state.recentRows = [
    { id: 'assignment-a', title: 'A 시험', date: '2026-10-03', subjectKeys: [], pdfReady: false, pdfStatus: 'failed' },
    { id: 'assignment-b', title: 'B 시험', date: '2026-10-04', subjectKeys: [], pdfReady: true, pdfStatus: 'ready' },
  ];
  await h.workspace.assignmentStatus('assignment-a');
  const button = { dataset: { action: 'assignment-pdf', assignment: 'assignment-a' }, disabled: false };
  const retry = h.event('click', { closest: selector => selector === 'button' ? button : null }, {
    preventDefault() {}, stopPropagation() {},
  });
  h.workspace.state.recentSelectedAssignmentId = 'assignment-b';
  await h.workspace.assignmentStatus('assignment-b');
  pdf.resolve(okJson({ success: true, assignment: { id: 'assignment-a', pdf_status: 'ready' } }));
  await retry;
  assert.equal(aStatusGets, 1, 'the stale PDF completion does not refetch A after selection moves to B');
  assert.equal(h.workspace.state.openAssignment.assignment.id, 'assignment-b');
  assert.match(h.node('modal-body').innerHTML, /B 시험/);
  assert.equal(h.workspace.state.recentRows[0].pdfStatus, 'failed');
});
