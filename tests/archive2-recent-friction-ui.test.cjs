const test = require('node:test');
const assert = require('node:assert/strict');
const { workspaceHarness, okJson } = require('./helpers/archive2-workspace-ui-harness.cjs');

test('Archive2 client subject identity maps every Recent alias to its semantic subject', () => {
  const h = workspaceHarness();
  const aliases = [
    ['ALGEBRA', ['대수', '수학I', '수학Ⅰ']],
    ['CALCULUS', ['미적분I', '미적분Ⅰ', '수학II', '수학Ⅱ']],
    ['CALCULUS_ADVANCED', ['미적분II', '미적분Ⅱ', '미적분']],
    ['PROB_STATS', ['확률과통계', '확률과 통계']],
  ];
  for (const [semanticSubject, spellings] of aliases)
    for (const spelling of spellings)
      assert.equal(h.ctx.Archive2Core.highSemanticSubjectForCourseKey(spelling), semanticSubject, spelling);
  for (const [ascii, roman] of [['수학I', '수학Ⅰ'], ['수학II', '수학Ⅱ'], ['미적분I', '미적분Ⅰ'], ['미적분II', '미적분Ⅱ']])
    assert.equal(h.ctx.Archive2Core.normalizeCourseIdentity(` ${ascii} `), h.ctx.Archive2Core.normalizeCourseIdentity(roman));
  assert.equal(h.ctx.Archive2Core.normalizeCourseIdentity('확률과 통계'),
    h.ctx.Archive2Core.normalizeCourseIdentity('확률과통계'));
});

test('Recent DOM refetch preserves query focus, cursor, IME composition, errors, and stale-response ordering', async () => {
  const pending = [];
  const h = workspaceHarness(url => new Promise(resolve => pending.push({ url: String(url), resolve })));
  h.workspace.setClasses([{ id: 'class-a', name: '고2 A반', grade: '고2' }]);
  h.workspace.state.view = 'recent';
  h.workspace.state.recentFilters.query = 'old';
  const input = h.queryInput();
  input.value = 'old'; input.selectionStart = 2; input.selectionEnd = 2;
  h.ctx.document.activeElement = input;

  const stale = h.workspace.loadRecent();
  const current = h.workspace.loadRecent();
  assert.equal(pending.length, 2);
  h.workspace.state.recentFilters.query = 'latest';
  pending[0].resolve(okJson({ assignments: [{ id: 'stale-row' }] }));
  await stale;
  assert.equal(h.workspace.state.recentRows.length, 0, 'stale response does not replace the active result');
  assert.equal(h.ctx.document.activeElement, input);
  assert.deepEqual([input.selectionStart, input.selectionEnd], [2, 2]);
  pending[1].resolve(okJson({ assignments: [{
    id: 'latest-row', class_id: 'class-a', class_grade: '고2', grade_label: '고2',
    subject: '미적분Ⅰ', exam_title: '최신 결과', exam_date: '2026-10-01',
  }] }));
  await current;
  assert.equal(h.workspace.state.recentRows[0].id, 'latest-row');
  assert.equal(h.workspace.getRenderCount(), 0, 'a filter response never replaces the Recent page DOM');
  assert.equal(h.queryInput(), input);
  assert.equal(input.isConnected, true);
  assert.equal(h.ctx.document.activeElement, input);
  assert.deepEqual([input.selectionStart, input.selectionEnd], [2, 2]);

  input.value = '조합 중 검색'; input.selectionStart = 5; input.selectionEnd = 5;
  await h.event('input', input, { isComposing: true });
  assert.equal(h.workspace.state.recentFilters.query, 'latest');
  const duringComposition = h.workspace.loadRecent();
  assert.equal(pending.length, 3);
  pending[2].resolve(okJson({ assignments: [{ id: 'composition-old' }] }));
  await duringComposition;
  assert.equal(h.queryInput(), input);
  assert.equal(input.isConnected, true);
  assert.equal(h.ctx.document.activeElement, input);
  assert.deepEqual([input.selectionStart, input.selectionEnd], [5, 5]);

  await h.event('compositionend', input);
  assert.deepEqual(h.timerDelays(), [300]);
  const timerJobs = h.fireTimers();
  assert.equal(new URL(pending.at(-1).url).searchParams.get('query'), '조합 중 검색');
  pending.at(-1).resolve(okJson({ assignments: [] }));
  await Promise.all(timerJobs);
  assert.equal(h.workspace.state.recentRows.length, 0);
  assert.equal(h.workspace.getRenderCount(), 0);
  assert.equal(h.ctx.document.activeElement, input);
  assert.deepEqual([input.selectionStart, input.selectionEnd], [5, 5]);

  input.value = '';
  await h.event('input', input, { isComposing: false });
  assert.equal(h.workspace.state.recentFilters.query, '');
  const clearJobs = h.fireTimers();
  assert.equal(new URL(pending.at(-1).url).searchParams.has('query'), false,
    'clearing the query removes it from the next request');
  pending.at(-1).resolve(okJson({ assignments: [] }));
  await Promise.all(clearJobs);
  assert.equal(h.ctx.document.activeElement, input);
  assert.deepEqual([input.selectionStart, input.selectionEnd], [5, 5]);

  const failed = h.workspace.loadRecent();
  assert.equal(pending.length, 6);
  pending[5].resolve({ ok: false, status: 502, json: async () => ({ error: 'Recent unavailable' }) });
  await assert.rejects(failed, /Recent unavailable/);
  assert.match(h.node('recent-assignments').innerHTML, /Recent unavailable/);
  assert.equal(h.workspace.getRenderCount(), 0);
  assert.equal(h.queryInput(), input);
  assert.equal(input.isConnected, true);
  assert.equal(h.ctx.document.activeElement, input);
  assert.deepEqual([input.selectionStart, input.selectionEnd], [5, 5]);
});

test('Recent facet options retain sibling classes and semantic subjects after narrowed or empty results', async () => {
  const requests = [];
  const h = workspaceHarness(async (url, init = {}) => {
    const parsed = new URL(String(url));
    requests.push({ url: parsed, method: init.method || 'GET' });
    return okJson({ assignments: [] });
  });
  h.workspace.setClasses([
    { id: 'class-a', name: '고2 A반', grade: '고2' },
    { id: 'class-b', name: '고2 B반', grade: '고2' },
    { id: 'class-c', name: '고1 C반', grade: '고1' },
  ]);
  h.workspace.state.view = 'recent';
  h.workspace.state.recentFilters.grade = '고2';
  h.workspace.state.recentFilters.subject = 'CALCULUS';
  h.workspace.state.recentClassId = 'class-a';
  h.workspace.state.recentRows = [{
    id: 'only-a', date: '2026-10-01', title: 'A 시험', classId: 'class-a',
    targetGrade: '고2', contentGrade: '고2', subjectKeys: ['ALGEBRA'], subjectLabel: '대수',
    questionCount: 2, recipientCount: 1, submittedCount: 0, pdfStatus: 'pending',
  }];
  assert.deepEqual(h.workspace.recentClassOptions().map(option => option.value), ['class-a', 'class-b']);
  const options = h.workspace.recentSubjectOptions().map(option => option.value);
  for (const key of ['ALGEBRA', 'CALCULUS', 'CALCULUS_ADVANCED', 'PROB_STATS'])
    assert.ok(options.includes(key), `${key} remains selectable after narrowing to ALGEBRA`);

  const classNode = h.node('recent-class');
  const subjectNode = h.node('recent-subject');
  const input = h.queryInput();
  input.value = '고사'; input.selectionStart = 1; input.selectionEnd = 1;
  h.ctx.document.activeElement = input;
  h.workspace.updateRecentResults();
  h.workspace.state.recentRows = [];
  assert.ok(h.workspace.recentSubjectOptions().some(option => option.value === 'CALCULUS'));

  h.workspace.state.recentClassId = 'stale-class-id';
  const emptyResult = h.workspace.loadRecent();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url.searchParams.has('class'), false,
    'a stale class id is cleared before a server request');
  await emptyResult;
  assert.equal(h.workspace.state.recentClassId, '');
  assert.deepEqual(h.workspace.recentClassOptions().map(option => option.value), ['class-a', 'class-b']);
  assert.ok(h.workspace.recentSubjectOptions().some(option => option.value === 'CALCULUS'),
    'a valid semantic subject remains available with zero results');
  h.workspace.updateRecentResults();
  assert.equal(h.node('recent-class'), classNode);
  assert.equal(h.node('recent-subject'), subjectNode);
  assert.equal(h.queryInput(), input);
  assert.equal(input.isConnected, true);
  assert.equal(h.ctx.document.activeElement, input);

  h.workspace.state.recentClassId = 'class-a';
  await h.event('change', { id: 'recent-class', dataset: {}, value: 'class-b' });
  assert.equal(h.workspace.state.recentClassId, 'class-b');
  assert.ok(h.workspace.recentClassOptions().some(option => option.value === 'class-a'));
  assert.ok(h.workspace.recentClassOptions().some(option => option.value === 'class-b'));
  const classJobs = h.fireTimers();
  await Promise.all(classJobs);
  assert.equal(requests.at(-1).url.searchParams.get('class'), 'class-b');
  assert.equal(requests.at(-1).url.searchParams.get('subject'), 'CALCULUS');

  await h.event('change', { dataset: { recentFilter: 'subject' }, value: 'PROB_STATS' });
  const subjectJobs = h.fireTimers();
  await Promise.all(subjectJobs);
  assert.equal(requests.at(-1).url.searchParams.get('class'), 'class-b');
  assert.equal(requests.at(-1).url.searchParams.get('subject'), 'PROB_STATS');

  await h.event('change', { dataset: { recentFilter: 'grade' }, value: '고1' });
  assert.deepEqual(h.workspace.recentClassOptions().map(option => option.value), ['class-c']);
  assert.equal(h.workspace.state.recentClassId, '', 'a class from the old grade clears safely');
  const gradeJobs = h.fireTimers();
  await Promise.all(gradeJobs);
  assert.equal(requests.at(-1).url.searchParams.get('grade'), '고1');
  assert.equal(requests.at(-1).url.searchParams.has('class'), false);
  assert.equal(h.queryInput(), input);
  assert.equal(h.ctx.document.activeElement, input);
});

test('Recent grade changes clear stale subjects before the debounced server request', async () => {
  for (const staleSubject of ['ALGEBRA', 'CALCULUS']) {
    const requests = [];
    const h = workspaceHarness(async url => {
      requests.push(new URL(String(url)));
      return okJson({ assignments: [] });
    });
    h.workspace.setClasses([{ id: 'class-high2', name: '고2 A반', grade: '고2' }]);
    h.workspace.state.view = 'recent';
    h.workspace.state.recentFilters.grade = '고2';
    h.workspace.state.recentFilters.subject = staleSubject;

    await h.event('change', { dataset: { recentFilter: 'grade' }, value: '고1' });
    assert.equal(h.workspace.state.recentFilters.subject, '', `${staleSubject} is invalid for the new grade`);
    const jobs = h.fireTimers();
    assert.equal(requests.length, 1);
    assert.equal(requests[0].searchParams.get('grade'), '고1');
    assert.equal(requests[0].searchParams.has('subject'), false,
      `${staleSubject} is never sent for the new grade`);
    await Promise.all(jobs);
  }

  const h = workspaceHarness(async () => okJson({ assignments: [] }));
  h.workspace.setClasses([{ id: 'class-high2', name: '고2 A반', grade: '고2' }]);
  h.workspace.state.view = 'recent';
  h.workspace.state.recentFilters.grade = '고2';
  h.workspace.state.recentFilters.subject = 'CALCULUS';
  await h.event('change', { dataset: { recentFilter: 'grade' }, value: '고2' });
  assert.equal(h.workspace.state.recentFilters.subject, 'CALCULUS',
    'a subject valid within the selected grade remains selected');
});

test('Recent assignment status requests discard stale success and stale error responses', async () => {
  const pending = [];
  const h = workspaceHarness(url => new Promise((resolve, reject) => pending.push({
    url: String(url), resolve, reject,
  })));
  h.workspace.state.view = 'recent';
  h.workspace.state.recentSelectedAssignmentId = 'assignment-a';
  h.workspace.state.openAssignment = { assignment: { id: 'previous' }, students: [] };
  h.node('status').textContent = 'keep current status';

  const staleA = h.workspace.assignmentStatus('assignment-a');
  h.workspace.state.recentSelectedAssignmentId = 'assignment-b';
  const currentB = h.workspace.assignmentStatus('assignment-b');
  assert.equal(pending.length, 2);
  pending[1].resolve(okJson({
    assignment: { id: 'assignment-b', exam_title: 'B 시험', exam_date: '2026-10-02', question_count: 2, pdf_status: 'ready' },
    students: [],
  }));
  await currentB;
  assert.equal(h.workspace.state.openAssignment.assignment.id, 'assignment-b');
  assert.match(h.node('modal-body').innerHTML, /B 시험/);

  pending[0].reject(new Error('stale A failed'));
  await staleA;
  assert.equal(h.workspace.state.openAssignment.assignment.id, 'assignment-b');
  assert.match(h.node('modal-body').innerHTML, /B 시험/);
  assert.doesNotMatch(h.node('modal-body').innerHTML, /A 시험/);
  assert.equal(h.node('status').textContent, 'keep current status',
    'a stale status failure cannot overwrite current UI status');
});

test('Recent assignment status response is ignored after Finder navigation or selection clear', async () => {
  const pending = [];
  const h = workspaceHarness(url => {
    if (String(url).endsWith('/qr-classes')) return Promise.resolve(okJson({ classes: [] }));
    if (String(url).includes('/class-exam-assignments/recent-summary'))
      return Promise.resolve(okJson({ assignments: [] }));
    return new Promise(resolve => pending.push({ url: String(url), resolve }));
  });
  h.workspace.state.view = 'recent';
  h.workspace.state.recentSelectedAssignmentId = 'assignment-a';
  const sentinel = { assignment: { id: 'previous' }, students: [] };
  h.workspace.state.openAssignment = sentinel;
  const request = h.workspace.assignmentStatus('assignment-a');
  const findButton = { dataset: { view: 'find' }, disabled: false };
  await h.event('click', { closest: selector => selector === 'button' ? findButton : null }, {
    preventDefault() {}, stopPropagation() {},
  });
  const recentButton = { dataset: { view: 'recent' }, disabled: false };
  await h.event('click', { closest: selector => selector === 'button' ? recentButton : null }, {
    preventDefault() {}, stopPropagation() {},
  });
  pending[0].resolve(okJson({
    assignment: { id: 'assignment-a', exam_title: '낡은 시험', exam_date: '2026-10-01', question_count: 1, pdf_status: 'ready' },
    students: [],
  }));
  await request;
  assert.equal(h.workspace.state.openAssignment, sentinel);
  assert.doesNotMatch(h.node('modal-body').innerHTML, /낡은 시험/);

  h.workspace.state.recentSelectedAssignmentId = 'assignment-a';
  const selectionRequest = h.workspace.assignmentStatus('assignment-a');
  h.workspace.state.recentSelectedAssignmentId = '';
  pending[1].resolve(okJson({
    assignment: { id: 'assignment-a', exam_title: 'Back 이후 시험', exam_date: '2026-10-01', question_count: 1, pdf_status: 'ready' },
    students: [],
  }));
  await selectionRequest;
  assert.equal(h.workspace.state.openAssignment, sentinel);
  assert.doesNotMatch(h.node('modal-body').innerHTML, /Back 이후 시험/);
});
