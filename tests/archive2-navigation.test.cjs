const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const navigation = require('../archive/archive2-navigation.js');
const { readWorkspace } = require("./helpers/archive2-workspace-source.cjs");
const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');

const labelsOf = (html, sectionPattern) =>
  [...(html.match(sectionPattern) || [''])[0].matchAll(/<span class="archive-nav-label">([^<]*)<\/span>/g)].map(match => match[1]);

test('unit papers are a primary task in both surfaces and no legacy/tool links are shown to teachers', () => {
  for (const mode of ['workspace', 'unit']) {
    const html = navigation.markup(mode);
    assert.match(html, /href="unit-past-exams.html\?ready=1"/);
    assert.doesNotMatch(html, /legacy=1|아카이브 1\.0|자료 점검|view=health|data-view="health"|problem-bank-search|유형·개념으로|archive-navigation-tools/);
    assert.equal((html.match(/<span class="archive-nav-label">단원별 기출<\/span><\/a>/g) || []).length, 1, 'PC menu entry');
    assert.equal((html.match(/<span class="archive-nav-label">단원별<\/span><\/a>/g) || []).length, 1, 'phone menu entry');
  }
  assert.match(navigation.markup('workspace'), /data-view="compose"/);
  assert.match(navigation.markup('unit'), /href="unit-past-exams.html\?ready=1" data-nav-key="unit" aria-current="page" class="active"/);
  assert.match(navigation.markup('unit'), /href="workspace.html\?view=compose"/);
});

test('PC menu has six entries in order and the phone menu has six short ones including 빠른평가', () => {
  for (const mode of ['workspace', 'unit']) {
    const html = navigation.markup(mode);
    assert.deepEqual(labelsOf(html, /<nav class="archive-navigation-tasks"[\s\S]*?<\/nav>/),
      ['홈', '학교별 기출', '단원별 기출', '문제지 만들기', '빠른 평가', '출제 내역 · 보관함']);
    assert.deepEqual(labelsOf(html, /<nav class="archive-mobile-tabs"[\s\S]*?<\/nav>/),
      ['홈', '학교별', '단원별', '만들기', '빠른평가', '출제내역']);
  }
});

test('the menu carries no icons or text symbols', () => {
  const html = navigation.markup('workspace');
  assert.doesNotMatch(html, /<svg|archive-nav-icon|•••/);
});

test('saved and recent screens both mark the one 출제 내역 · 보관함 entry as current', () => {
  for (const view of ['saved', 'recent']) {
    const html = navigation.markup('workspace', { view });
    const sidebar = html.match(/<nav class="archive-navigation-tasks"[\s\S]*?<\/nav>/)[0];
    const current = [...sidebar.matchAll(/<button[^>]*aria-current="page"[^>]*>[\s\S]*?<span class="archive-nav-label">([^<]*)<\/span>/g)];
    assert.deepEqual(current.map(match => match[1]), ['출제 내역 · 보관함'], view);
    assert.ok(navigation.matches('library', view));
    assert.equal(navigation.matches('library', 'find'), false);
  }
  // The menu entry opens 출제 내역 first (PC and phone); 보관함 stays one switch press away and keeps its own explicit links.
  for (const mode of ['workspace', 'unit']) {
    const html = navigation.markup(mode);
    const sidebar = html.match(/<nav class="archive-navigation-tasks"[\s\S]*?<\/nav>/)[0];
    const phone = html.match(/<nav class="archive-mobile-tabs"[\s\S]*?<\/nav>/)[0];
    for (const part of [sidebar, phone]) {
      const entry = part.match(/<(?:button|a)[^>]*data-nav-key="library"[^>]*>/)[0];
      assert.match(entry, mode === 'workspace' ? /data-view="recent"/ : /href="workspace\.html\?view=recent"/);
      assert.doesNotMatch(entry, /view=saved|data-view="saved"/);
    }
  }
  const tabs = navigation.libraryTabs('recent');
  assert.match(tabs, /data-view="recent" aria-pressed="true">출제 내역[\s\S]*data-view="saved" aria-pressed="false">보관함/);
  assert.ok(tabs.indexOf('data-view="recent"') < tabs.indexOf('data-view="saved"'));
  // 시험지 보관함 has a way in from the archive itself (it used to be reachable only from the teacher dashboard).
  assert.ok(tabs.includes('<a href="assessment/assessment-mvp.html"') && tabs.includes('>시험지 보관함</a>'));
  assert.ok(navigation.libraryTabs('saved', '../').includes('href="../assessment/assessment-mvp.html"'));
});

test('quick assessment views keep 빠른 평가 current on PC and phone, and 만들기 only for compose', () => {
  for (const view of ['five-minute', 'subunit-test', 'unit-test', 'monthly-test']) {
    assert.ok(navigation.matches('quick', view));
    assert.equal(navigation.matches('make', view), false);
    assert.equal(navigation.matches('compose', view), false);
    const html = navigation.markup('workspace', { view });
    const tabs = html.match(/<nav class="archive-mobile-tabs"[\s\S]*?<\/nav>/)[0];
    const current = [...tabs.matchAll(/<button[^>]*aria-current="page"[^>]*>[\s\S]*?<span class="archive-nav-label">([^<]*)<\/span>/g)];
    assert.deepEqual(current.map(match => match[1]), ['빠른평가'], view);
    assert.match(tabs, /data-view="five-minute" data-nav-key="quick"/);
  }
  assert.ok(navigation.matches('make', 'compose'));
  const unitTabs = navigation.markup('unit').match(/<nav class="archive-mobile-tabs"[\s\S]*?<\/nav>/)[0];
  assert.match(unitTabs, /href="workspace.html\?view=five-minute" data-nav-key="quick"/);
});

test('the three tool addresses are hidden from the menus but still open by address', () => {
  // The health screen is still a workspace route and a menu-less view, and the two pages still exist.
  assert.equal(navigation.currentView('workspace'), 'home');
  const route = readWorkspace().match(/state\.view = \[([^\]]*)\]\.includes\(p\.get\("view"\)\)/);
  assert.ok(route && /"health"/.test(route[1]), 'workspace still routes ?view=health');
  assert.equal(navigation.currentKey('workspace'), 'home');
  for (const name of ['index.html', 'problem-bank-search.html', 'workspace.html'])
    assert.ok(fs.existsSync(path.join(__dirname, '../archive', name)), name);
  assert.match(readWorkspace(), /view === "health"|\["find", "compose", "health"\]/);
  const shown = readWorkspace();
  assert.doesNotMatch(shown, /href="problem-bank-search\.html"|href="index\.html\?legacy=1"|기존 아카이브/);
  assert.match(shown, /data-boot-wait="failed"[^`]*다시 시도/);
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
    ['built-in admin id', { id: 't_admin', session_token: 't' }, true],
    ['admin login id', { login_id: 'admin', session_token: 't' }, true],
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
  // 토큰이 없는 옛 교사 세션은 요청을 보낼 수 없으므로 로그인됨으로 보이지 않고, 다른 계정 안내도 아닌 "로그인 필요"다.
  for (const value of [{ role: 'teacher', name: '김선생' }, { id: 't_admin' }, { login_id: 'admin' }, { role: 'teacher', session_token: '' }]) {
    const state = navigation.loginState(value);
    assert.deepEqual([state.loggedIn, state.needsTeacher], [false, false], JSON.stringify(value));
    const html = navigation.markup('workspace', { session: value });
    assert.doesNotMatch(html, /로그인됨/, JSON.stringify(value));
    assert.match(html, /data-login="out"/, JSON.stringify(value));
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
  // The unit page is parsed first and started on DOMContentLoaded (after its deferred scripts), so the menu and the rule it
  // reads are small blocking scripts placed right after the menu host: the menu is in the first painted frame.
  assert.match(unitHtml, /<script src="archive2-session\.js\?v=[\w-]+"><\/script>\s*<script src="archive2-navigation\.js\?v=[\w-]+"><\/script>/);
  assert.ok(unitHtml.indexOf('<header data-archive-navigation="unit"') < unitHtml.indexOf('archive2-session.js'), 'menu host before the menu scripts');
  assert.match(unitHtml, /<script defer src="unit-past-exams\.js/, 'the page runtime is deferred, so it runs after the menu and never blocks the first frame');
  assert.match(unitHtml, /DOMContentLoaded[\s\S]{0,160}UnitPastExams\.init\(\)/);
});

test('shared navigation mounts on the unit page whether or not the address says ready, and is never hidden or removed', () => {
  for (const search of ['', '?ready=1', '?grade=h1&unit=H22-C2-01']) {
    let removed = false;
    const attached = [];
    const host = { dataset: { archiveNavigation: 'unit' }, hidden: true, remove: () => { removed = true; } };
    vm.runInNewContext(read('archive2-navigation.js'), {
      document: { querySelector: () => host, body: { classList: { add: name => attached.push(name) } } },
      URLSearchParams, location: { search },
    });
    assert.equal(removed, false, search);
    assert.deepEqual(attached.slice(0, 2), ['archive2-shell', 'archive2-unit-surface'], search);
    assert.equal(host.hidden, false, search);
    assert.match(host.innerHTML, /<a href="unit-past-exams\.html\?ready=1" data-nav-key="unit" aria-current="page" class="active"/, search);
  }
  // The first frame is already the new frame: the static page carries the shell classes, so nothing is restyled when the menu mounts.
  const html = read('unit-past-exams.html');
  assert.match(html, /<body class="unit-page archive2-shell archive2-unit-surface">/);
  assert.doesNotMatch(html, /data-archive-navigation="unit"[^>]*hidden/);
  assert.doesNotMatch(html, /unit-stepper|unit-back|fa-solid|font-awesome/i);
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

test('standalone pages in a sub folder keep the menu working: base prefix, chosen current entry and custom phone title', () => {
  const html = navigation.markup('standalone', { view: 'saved', title: '시험지 보관함', base: '../' });
  assert.match(html, /href="\.\.\/workspace\.html\?view=home"/, 'brand');
  assert.match(html, /href="\.\.\/unit-past-exams\.html\?ready=1" data-nav-key="unit"/);
  assert.match(html, /href="\.\.\/workspace\.html\?view=recent" data-nav-key="library" aria-current="page" class="active"/);
  assert.equal((html.match(/aria-current="page"/g) || []).length, 2, 'one current entry in the PC menu and one in the phone menu');
  assert.match(html, /<span class="archive-mobile-title">시험지 보관함<\/span>/);
  assert.match(html, /href="\.\.\/\.\.\/apmath\/"/, 'login link reaches AP Math OS from archive/assessment/');
  assert.doesNotMatch(html, /href="workspace\.html|href="unit-past-exams\.html/, 'no un-prefixed links');
  const quick = navigation.markup('standalone', { view: 'five-minute', title: '모의고사' });
  assert.match(quick, /href="workspace\.html\?view=five-minute" data-nav-key="quick" aria-current="page" class="active"/);
  assert.match(quick, /href="\.\.\/apmath\/"/);
  assert.equal(navigation.markup('standalone', { view: 'saved' }).includes('archive-mobile-title">보관함<'), true, 'default title still comes from the view');
});
