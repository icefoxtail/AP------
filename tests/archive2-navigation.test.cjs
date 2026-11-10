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

test('login state follows the shared AP Math OS session and ignores bad data', () => {
  assert.equal(navigation.loginState(null).loggedIn, false);
  assert.equal(navigation.loginState({}).loggedIn, false);
  assert.equal(navigation.loginState({ session_token: 't', name: '김선생' }).name, '김선생');
  assert.equal(navigation.loginState({ session_token: 't', expires_at: '2020-01-01T00:00:00Z' }).loggedIn, false);
  assert.match(navigation.markup('workspace', { session: null }), /선생님 로그인/);
  const loggedIn = navigation.markup('workspace', { session: { session_token: 't', name: '<b>x</b>' } });
  assert.match(loggedIn, /로그인됨/);
  assert.doesNotMatch(loggedIn, /<b>x<\/b>/, 'the name is escaped');
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
