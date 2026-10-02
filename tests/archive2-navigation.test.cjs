const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const navigation = require('../archive/archive2-navigation.js');
const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');

function embeddedAssignmentHarness(classes, itemOverrides = {}) {
  const index = read('index.html');
  const finishGateStart = index.indexOf('function assignTargetMaybeFinish()');
  const finishLauncherStart = index.indexOf('function assignTargetFinishAndOpenEngine()', finishGateStart);
  const finishLauncherEnd = index.indexOf('\n/* engine.html 연동 */', finishLauncherStart);
  const retryStart = index.indexOf('async function assignTargetRetryFailed()');
  const retryEnd = index.indexOf('\nfunction assignTargetMaybeFinish()', retryStart);
  assert.notEqual(finishGateStart, -1);
  assert.notEqual(finishLauncherStart, -1);
  assert.notEqual(finishLauncherEnd, -1);
  assert.notEqual(retryStart, -1);
  assert.notEqual(retryEnd, -1);

  const timers = [];
  const outputOpens = [];
  const messages = [];
  const retryIds = [];
  const assignmentPosts = { count: classes.filter(row => row.status === 'success').length };
  const progress = Object.fromEntries(classes.map(row => [row.id, {
    status: row.status,
    ...(row.pdfPending ? { pdfPending: true, pdfError: 'PDF 준비 대기' } : {}),
    ...(row.assignmentId ? { assignmentId: row.assignmentId } : {}),
  }]));
  const classState = Object.fromEntries(classes.map(row => [row.id, {
    checked: true,
    row: { id: row.id, name: row.name || row.id },
  }]));
  const sandbox = {
    URLSearchParams,
    Map,
    AssignTarget: {
      grade: '고1',
      item: { file: 'original/sample.js', subject: '수학', ...itemOverrides },
      qpp: 4,
      assignmentBatchId: 'batch-1',
      scope: 'all',
      progress,
      classState,
    },
    location: { search: '?archive2Issue=original%2Fsample.js&archive2Embedded=1', origin: 'https://archive.test' },
    parent: { postMessage: (message, origin) => messages.push({ message, origin }) },
    document: {
      documentElement: { classList: { add() {} } },
      createElement: () => ({}),
      head: { appendChild() {} },
    },
    setTimeout: (callback, delay) => { timers.push({ callback, delay }); return timers.length; },
    closeModal() {},
    loadAssignmentBoardForGrade() {},
    renderAssignTargetProgressView() {},
    launchIndexExamOutput: (item, mode, qpp, options) => outputOpens.push({ item, mode, qpp, options }),
    getQrTeacherName: row => `teacher:${row.id}`,
    assignTargetProcessOneClass: async id => {
      retryIds.push(id);
      assignmentPosts.count++;
      progress[id] = { status: 'success' };
    },
  };
  sandbox.window = sandbox;
  vm.runInNewContext(index.slice(finishGateStart, finishLauncherStart) +
    index.slice(finishLauncherStart, finishLauncherEnd) + '\n' +
    index.slice(retryStart, retryEnd), sandbox);
  const baseFinish = sandbox.assignTargetMaybeFinish;
  vm.runInNewContext(read('archive2-entry.js'), sandbox);
  return { sandbox, baseFinish, timers, outputOpens, messages, retryIds, assignmentPosts };
}

test('unit papers are a primary task in both surfaces and keep legacy escape available', () => {
  for (const mode of ['workspace', 'unit']) {
    const html = navigation.markup(mode);
    assert.match(html, /href="unit-past-exams.html\?ready=1"/);
    assert.match(html, /href="index.html\?legacy=1">아카이브 1.0/);
    assert.equal((html.match(/<span class="archive-nav-label">단원별 기출<\/span><\/a>/g) || []).length, 2);
  }
  assert.match(navigation.markup('workspace'), /data-view="compose"/);
  assert.match(navigation.markup('unit'), /href="unit-past-exams.html\?ready=1" aria-current="page" class="active"/);
  assert.match(navigation.markup('unit'), /href="workspace.html\?view=compose"/);
});

test('shared navigation mounts only on the ready shelf, leaving the legacy builder intact', () => {
  for (const ready of [false, true]) {
    let removed = false, attached = false;
    const host = { dataset: { archiveNavigation: 'unit' }, hidden: true, remove: () => removed = true };
    vm.runInNewContext(read('archive2-navigation.js'), {
      document: {querySelector: () => host, body: {classList: {add: () => attached = true}}},
      URLSearchParams, location: {search: ready ? '?ready=1' : ''},
    });
    assert.equal(removed, !ready);
    assert.equal(attached, ready);
    if (ready) assert.equal(host.hidden, false);
  }
});

test('native unit assignment embeds without changing assignment APIs and cannot close during a save', () => {
  const messages = [], classes = [];
  let closeCount = 0;
  const assignment = {progress: {a: {status:'pending'}}};
  const window = {Archive2Output:{},closeModal:() => closeCount++};
  vm.runInNewContext(read('archive2-entry.js'), {
    window, URLSearchParams, Map, AssignTarget:assignment,
    location:{search:'?unitPastAssign=existing-snapshot&archive2Embedded=1',origin:'https://archive.test'},
    parent:{postMessage:(message, origin) => messages.push({message, origin})},
    document:{documentElement:{classList:{add:value => classes.push(value)}},createElement:()=>({}),head:{appendChild(){}}},
    renderAssignTargetProgressView(){},
  });
  assert.ok(classes.includes('archive2-original-host'));
  window.closeModal(); assert.equal(closeCount,0);
  assignment.progress.a.status = 'success';
  window.closeModal(); assert.equal(closeCount,1);
  assert.equal(messages[0].message.type,'archive2-original-close');
  assert.equal(messages[0].origin,'https://archive.test');
});

test('embedded Archive2 original keeps the base all-success exam output handoff', () => {
  for (const classes of [
    [{ id: 'one', status: 'success' }],
    [
      { id: 'one', name: '1반', status: 'success' },
      { id: 'two', name: '2반', status: 'success' },
      { id: 'three', name: '3반', status: 'success' },
    ],
  ]) {
    const h = embeddedAssignmentHarness(classes);
    assert.strictEqual(h.sandbox.assignTargetMaybeFinish, h.baseFinish,
      'Archive2 embedded entry must not replace the Archive1 completion gate');
    h.sandbox.assignTargetMaybeFinish();
    assert.equal(h.timers.length, 1);
    assert.equal(h.outputOpens.length, 0, 'output waits for the existing success delay');
    h.timers[0].callback();
    assert.equal(h.outputOpens.length, 1);
    assert.equal(h.outputOpens[0].mode, 'exam');
    assert.equal(h.outputOpens[0].options.classId, 'one', 'multi-class output opens once for the representative class');
    assert.deepEqual(h.messages.map(row => row.message.type), ['archive2-original-close']);
  }
});

test('partial failure waits, retries failed classes only, then opens one exam without another assignment POST', async () => {
  const h = embeddedAssignmentHarness([
    { id: 'one', status: 'success' },
    { id: 'two', status: 'error' },
  ]);
  h.sandbox.assignTargetMaybeFinish();
  assert.equal(h.timers.length, 0);
  assert.equal(h.outputOpens.length, 0);

  await h.sandbox.assignTargetRetryFailed();
  assert.deepEqual(h.retryIds, ['two']);
  assert.equal(h.timers.length, 1);
  const postsAfterRetry = h.assignmentPosts.count;
  h.timers[0].callback();
  assert.equal(h.outputOpens.length, 1);
  assert.equal(h.outputOpens[0].mode, 'exam');
  assert.equal(h.assignmentPosts.count, postsAfterRetry,
    'opening the exam output must not create or retry an Assignment');
});

test('Saved Paper output stays gated until its existing PDF closure completes', () => {
  const h = embeddedAssignmentHarness([
    { id: 'one', status: 'success', pdfPending: true, assignmentId: 'saved-assignment' },
  ], { savedPaperId: 'saved-paper-1', outputSnapshot: { questions: [{ questionUid: 'q1' }] } });
  h.sandbox.assignTargetMaybeFinish();
  assert.equal(h.timers.length, 0);
  assert.equal(h.outputOpens.length, 0);
  h.sandbox.AssignTarget.progress.one.pdfPending = false;
  h.sandbox.assignTargetMaybeFinish();
  assert.equal(h.timers.length, 1);
  h.timers[0].callback();
  assert.equal(h.outputOpens.length, 1);
  assert.equal(h.outputOpens[0].mode, 'exam');
  assert.equal(h.outputOpens[0].item.savedPaperId, 'saved-paper-1');
});
