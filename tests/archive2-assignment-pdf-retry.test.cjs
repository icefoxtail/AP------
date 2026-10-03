const test = require('node:test');
const assert = require('node:assert/strict');
const { workspaceHarness, okJson } = require('./helpers/archive2-workspace-ui-harness.cjs');

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
  h.workspace.state.view = 'recent';
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
