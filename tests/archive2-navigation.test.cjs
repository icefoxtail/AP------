const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const navigation = require('../archive/archive2-navigation.js');
const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');

const labelsOf = (html, sectionPattern) =>
  [...(html.match(sectionPattern) || [''])[0].matchAll(/<span class="archive-nav-label">([^<]*)<\/span>/g)].map(match => match[1]);

test('unit papers are a primary task in both surfaces and keep legacy escape available', () => {
  for (const mode of ['workspace', 'unit']) {
    const html = navigation.markup(mode);
    assert.match(html, /href="unit-past-exams.html\?ready=1"/);
    assert.match(html, /href="index.html\?legacy=1">아카이브 1.0/);
    assert.equal((html.match(/<span class="archive-nav-label">단원별 기출<\/span><\/a>/g) || []).length, 1, 'PC menu entry');
    assert.equal((html.match(/<span class="archive-nav-label">단원별<\/span><\/a>/g) || []).length, 1, 'phone menu entry');
  }
  assert.match(navigation.markup('workspace'), /data-view="compose"/);
  assert.match(navigation.markup('unit'), /href="unit-past-exams.html\?ready=1" data-nav-key="unit" aria-current="page" class="active"/);
  assert.match(navigation.markup('unit'), /href="workspace.html\?view=compose"/);
});

test('PC menu has six entries in order and the phone menu has five', () => {
  for (const mode of ['workspace', 'unit']) {
    const html = navigation.markup(mode);
    assert.deepEqual(labelsOf(html, /<nav class="archive-navigation-tasks"[\s\S]*?<\/nav>/),
      ['홈', '학교별 기출', '단원별 기출', '문제지 만들기', '빠른 평가', '보관함 · 출제 내역']);
    assert.deepEqual(labelsOf(html, /<nav class="archive-mobile-tabs"[\s\S]*?<\/nav>/),
      ['홈', '학교별', '단원별', '만들기', '보관함']);
  }
});

test('the menu carries no icons or text symbols', () => {
  const html = navigation.markup('workspace');
  assert.doesNotMatch(html, /<svg|archive-nav-icon|•••/);
});

test('saved and recent screens both mark the one 보관함 · 출제 내역 entry as current', () => {
  for (const view of ['saved', 'recent']) {
    const html = navigation.markup('workspace', { view });
    const sidebar = html.match(/<nav class="archive-navigation-tasks"[\s\S]*?<\/nav>/)[0];
    const current = [...sidebar.matchAll(/<button[^>]*aria-current="page"[^>]*>[\s\S]*?<span class="archive-nav-label">([^<]*)<\/span>/g)];
    assert.deepEqual(current.map(match => match[1]), ['보관함 · 출제 내역'], view);
    assert.ok(navigation.matches('library', view));
    assert.equal(navigation.matches('library', 'find'), false);
  }
  assert.match(navigation.libraryTabs('recent'), /data-view="saved" aria-pressed="false">보관함[\s\S]*data-view="recent" aria-pressed="true">출제 내역/);
});

test('quick assessment views keep 빠른 평가 (PC) and 만들기 (phone) current', () => {
  for (const view of ['five-minute', 'subunit-test', 'unit-test', 'monthly-test']) {
    assert.ok(navigation.matches('quick', view));
    assert.ok(navigation.matches('make', view));
    assert.equal(navigation.matches('compose', view), false);
  }
});

test('a body title equal to the phone top bar title is marked so it can be hidden', () => {
  const heading = text => {
    const h = { textContent: text, marks: null, classList: { toggle(name, on) { h.marks = [name, on]; } } };
    return h;
  };
  const run = (barText, headings) => navigation.markDuplicateTitles({
    querySelector: () => ({ textContent: barText }),
    querySelectorAll: () => headings,
  });
  const same = heading(' 학교별 기출 '), other = heading('시험 대비 문제지'), home = heading('JS 아카이브 홈');
  run('학교별 기출', [same, other]);
  assert.deepEqual(same.marks, ['title-in-topbar', true]);
  assert.deepEqual(other.marks, ['title-in-topbar', false]);
  run('', [home]);
  assert.deepEqual(home.marks, ['title-in-topbar', false], 'no bar title (home) hides nothing');
});

test('login state follows the shared AP Math OS session and ignores bad data', () => {
  assert.equal(navigation.loginState(null).loggedIn, false);
  assert.equal(navigation.loginState({}).loggedIn, false);
  assert.equal(navigation.loginState({ role: 'teacher', session_token: 't', name: '김선생' }).name, '김선생');
  assert.equal(navigation.loginState({ role: 'teacher', session_token: 't', expires_at: '2020-01-01T00:00:00Z' }).loggedIn, false);
  assert.match(navigation.markup('workspace', { session: null }), /선생님 로그인/);
  const loggedIn = navigation.markup('workspace', { session: { role: 'teacher', session_token: 't', name: '<b>x</b>' } });
  assert.match(loggedIn, /로그인됨/);
  assert.doesNotMatch(loggedIn, /<b>x<\/b>/, 'the name is escaped');
});

// 2026-11-10: the menu used to say "로그인됨" for any session with a token, so a student or parent account looked
// logged in while 단원별 기출 asked for a teacher login. Both now use archive2-session.js.
test('only a teacher session shows 로그인됨; any other account is asked for a teacher login', () => {
  const session = require('../archive/archive2-session.js');
  const table = [
    ['teacher', { role: 'teacher', session_token: 't' }, true],
    ['admin role', { role: 'admin', session_token: 't' }, true],
    ['owner role', { role: 'owner', session_token: 't' }, true],
    ['nested user role', { user: { role: 'Teacher ' }, session_token: 't' }, true],
    ['built-in admin id', { id: 't_admin' }, true],
    ['admin login id', { login_id: 'admin' }, true],
    ['student', { role: 'student', session_token: 't', login_id: 's1' }, false],
    ['parent', { role: 'parent', session_token: 't' }, false],
    ['token without a role', { session_token: 't', name: '김선생' }, false],
  ];
  for (const [label, value, teacher] of table) {
    const state = navigation.loginState(value);
    assert.equal(state.loggedIn, teacher, label);
    assert.equal(state.needsTeacher, !teacher, label);
    assert.equal(session.isTeacher(value), teacher, label + ' (shared rule)');
    const html = navigation.markup('workspace', { session: value });
    assert.equal(/로그인됨/.test(html), teacher, label + ' (menu text)');
    if (!teacher) {
      assert.match(html, /선생님 계정으로 로그인해 주세요/, label);
      assert.match(html, /data-login="teacher" href="\.\.\/apmath\/"/, label);
    }
  }
  // Expired, empty and broken values are plain "logged out", not "wrong account".
  for (const value of [null, undefined, {}, [], 'text', 42, true, { role: 'teacher', expires_at: '2020-01-01T00:00:00Z' }]) {
    const state = navigation.loginState(value);
    assert.deepEqual([state.loggedIn, state.needsTeacher], [false, false], JSON.stringify(value));
    assert.match(navigation.markup('workspace', { session: value }), /data-login="out"/);
  }
});

test('단원별 기출 and the menu share one teacher rule instead of two copies', () => {
  const unit = read('unit-past-exams.js');
  assert.match(unit, /Archive2Session\?\.isTeacher\(getSession\(\)\)/);
  assert.doesNotMatch(unit, /\['teacher', 'admin', 'owner'\]/);
  const workspaceHtml = read('workspace.html');
  assert.ok(workspaceHtml.indexOf('defer src="archive2-session.js') > 0 &&
    workspaceHtml.indexOf('defer src="archive2-session.js') < workspaceHtml.indexOf('defer src="archive2-navigation.js'),
  'workspace: deferred scripts run in order, the rule before the menu');
  const unitHtml = read('unit-past-exams.html');
  // The unit page starts itself with an inline init() call, before deferred scripts run, so the rule is not deferred.
  assert.match(unitHtml, /<script src="archive2-session\.js\?v=[\w-]+"><\/script>/);
  assert.ok(unitHtml.indexOf('archive2-session.js') < unitHtml.indexOf('unit-past-exams.js'), 'rule before the page init');
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
