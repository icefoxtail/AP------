'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const createNavigation = require('../apmath/js/student-navigation.js');
const review = require('../apmath/student/archive-review-output.js');
const root = path.resolve(__dirname, '..');

function harness(pathname = '/AP------/apmath/student/', stored = new Map()) {
  const location = new URL('https://school.test' + pathname);
  const host = {
    innerHTML: '', hidden: true, attrs: {},
    classList: { add() {}, remove() {} },
    setAttribute(key, value) { this.attrs[key] = value; },
    contains() { return true; }
  };
  const doc = {
    body: { classList: { add() {}, remove() {} } },
    getElementById: () => host,
    querySelectorAll: () => [],
    dispatchEvent(event) { return !event.defaultPrevented; }
  };
  const window = {
    location,
    sessionStorage: {
      getItem: key => stored.get(key) || null,
      setItem: (key, value) => stored.set(key, value),
      removeItem: key => stored.delete(key)
    },
    CustomEvent: class { constructor(type, options) { Object.assign(this, { type, ...options }); this.defaultPrevented = false; } }
  };
  window.parent = window;
  const prefix = pathname.includes('/AP------/') ? '/AP------/' : '/';
  const nav = createNavigation(window, doc, 'https://school.test' + prefix + 'apmath/js/student-navigation.js?v=2026.11.11.3');
  return { nav, host, doc, window, stored };
}

test('all five actual destinations preserve the deployment prefix and preview metadata only', () => {
  const h = harness();
  h.nav.setContext({ preview: true, studentId: 'student-A', pin: 'never-store', student_token: 'never-store' });
  h.nav.mount({ host: h.host, active: 'planner' });
  assert.equal((h.host.innerHTML.match(/data-student-destination=/g) || []).length, 5);
  for (const label of ['홈', '시험지', '실험실', '플래너', '더보기']) assert.ok(h.host.innerHTML.includes(label));
  assert.equal((h.host.innerHTML.match(/aria-current="page"/g) || []).length, 1);
  for (const view of ['home', 'exams', 'labs', 'planner', 'more']) {
    const href = new URL(h.nav.portalHref(view));
    assert.equal(href.pathname, '/AP------/apmath/student/');
    assert.equal(href.searchParams.get('view'), view);
    assert.equal(href.searchParams.get('teacher_preview'), '1');
    assert.equal(href.searchParams.get('student_id'), 'student-A');
    assert.deepEqual([...href.searchParams.keys()].sort(), ['student_id', 'teacher_preview', 'view']);
  }
  assert.deepEqual(JSON.parse([...h.stored.values()][0]), { preview: true, studentId: 'student-A' });
  assert.ok(!h.host.innerHTML.includes('never-store'));
});

test('ordinary student routing never turns the student id into preview authorization', () => {
  const h = harness('/apmath/planner/?student_id=student-A');
  h.nav.setContext({ preview: false, studentId: 'student-A' });
  const href = new URL(h.nav.portalHref('exams'));
  assert.equal(href.pathname, '/apmath/student/');
  assert.equal(href.search, '?view=exams');
  h.nav.clearContext();
  assert.equal(h.stored.size, 0);
});

test('public labs receive a persistent preview return route without a PIN or token', () => {
  const h = harness();
  h.nav.setContext({ preview: true, studentId: 'student-A' });
  const destination = new URL(h.nav.withContext('../playground/next/#g8'));
  assert.equal(destination.pathname, '/AP------/apmath/playground/next/');
  assert.equal(destination.hash, '#g8');
  assert.equal(destination.searchParams.get('portal'), '1');
  const lab = harness(destination.pathname + destination.search);
  assert.equal(new URL(lab.nav.portalHref('planner')).searchParams.get('teacher_preview'), '1');
  assert.equal(h.nav.withContext('https://elsewhere.test/'), 'https://elsewhere.test/');
});

test('the lab shell loads common navigation only for explicit portal or preview visits', () => {
  const source = fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-shell.js'), 'utf8');
  const loader = source.slice(0, source.indexOf('  const APLab =')) + '\nwindow.attachStudentNavigation = attachStudentNavigation;})();';
  const noDocument = { window: {} };
  vm.runInNewContext(loader, noDocument);
  assert.doesNotThrow(() => noDocument.window.attachStudentNavigation());
  for (const [search, count] of [['', 0], ['?theme=paper', 0], ['?portal=1', 2], ['?teacher_preview=1&student_id=student-A', 2]]) {
    const added = [];
    const context = {
      URL, URLSearchParams,
      window: { location: { search } },
      document: {
        currentScript: { src: 'https://school.test/AP------/apmath/playground/next/kit/apl-shell.js' },
        getElementById: () => null, createElement: () => ({ dataset: {} }),
        addEventListener() {},
        head: { appendChild: node => added.push(node) }
      }
    };
    vm.runInNewContext(loader, context); context.window.attachStudentNavigation();
    assert.equal(added.length, count, search || 'standalone visit');
    if (count) assert.equal(added[1].src, 'https://school.test/AP------/apmath/js/student-navigation.js?v=2026.11.11.4');
  }
});

test('readers accept only the exact same-project portal return target', () => {
  const h = harness('/AP------/archive/engine.html?studentReview=1&studentReturnTo=' + encodeURIComponent('/AP------/apmath/student/?teacher_preview=1&student_id=student-B&view=exams'));
  assert.equal(new URL(h.nav.portalHref('home')).searchParams.get('student_id'), 'student-B');
  for (const unsafe of ['https://elsewhere.test/AP------/apmath/student/', '/other-project/apmath/student/', '/AP------/apmath/student/evil', '//elsewhere.test/apmath/student/']) assert.equal(h.nav.safePortalTarget(unsafe), null);
  const target = review.studentReturnTarget('https://school.test/AP------/apmath/student/?view=exams&teacher_preview=1&student_id=student-B&pin=private&token=private#list');
  const url = new URL(target, 'https://school.test');
  assert.equal(url.pathname, '/AP------/apmath/student/');
  assert.equal(url.searchParams.get('view'), 'exams');
  assert.equal(url.searchParams.get('student_id'), 'student-B');
  assert.ok(!target.includes('private'));
  assert.equal(review.studentReturnTarget('https://school.test/AP------/apmath/student/other'), '');
});

test('navigation uses the portal callback and gives child drafts a cancellation boundary', () => {
  const h = harness();
  const navigated = [];
  h.nav.mount({ host: h.host, active: 'home', onNavigate: view => navigated.push(view) });
  const link = { dataset: { studentDestination: 'planner' } };
  const event = () => ({ target: { closest: () => link }, button: 0, prevented: false, preventDefault() { this.prevented = true; } });
  const first = event(); h.host.onclick(first);
  assert.deepEqual(navigated, ['planner']); assert.equal(first.prevented, true);
  h.doc.dispatchEvent = () => false;
  const cancelled = event(); h.host.onclick(cancelled);
  assert.deepEqual(navigated, ['planner']); assert.equal(cancelled.prevented, true);
  const newTab = { ...event(), ctrlKey: true }; h.host.onclick(newTab);
  assert.equal(newTab.prevented, false);
});

function extractFunction(rel, name) {
  const source = fs.readFileSync(path.join(root, rel), 'utf8');
  const begin = source.search(new RegExp(`^    (?:async )?function ${name}\\(`, 'm'));
  assert.ok(begin >= 0);
  const end = source.indexOf('\n    }', begin);
  return source.slice(begin, end + 6);
}
test('direct teacher preview child URLs cannot import a remembered student PIN or issue API calls', async () => {
  for (const [file, name] of [['apmath/planner/index.html', 'initPlanner'], ['apmath/homework/index.html', 'loadAssignment']]) {
    let message = '';
    const context = { isTeacherPreview: true, $: () => ({ style: {} }), renderError: value => { message = value; } };
    vm.runInNewContext(extractFunction(file, name), context);
    await context[name]();
    assert.ok(message.includes('선생님 미리보기'), file + ' must explain unavailable capability');
    // No storage, authentication or network functions exist in this context:
    // reading a remembered PIN or invoking an API would throw this test.
  }
});

test('shared reader return control honors a GitHub Pages prefix and rejects foreign project paths', () => {
  const source = fs.readFileSync(path.join(root, 'archive/archive2-reader-controls.js'), 'utf8');
  const start = source.indexOf('  function fallbackUrl() {');
  const end = source.indexOf('\n  function returnToSource()', start);
  const allowed = '/AP------/apmath/student/?teacher_preview=1&student_id=student-B&view=exams';
  const context = { URL, URLSearchParams, envelope: () => null, location: new URL('https://school.test/AP------/archive/engine.html?studentReview=1&studentReturnTo=' + encodeURIComponent(allowed)) };
  vm.runInNewContext(source.slice(start, end), context);
  assert.equal(context.fallbackUrl(), 'https://school.test' + allowed);
  context.location = new URL('https://school.test/AP------/archive/engine.html?studentReview=1&studentReturnTo=/other-project/apmath/student/');
  assert.equal(context.fallbackUrl(), 'https://school.test/AP------/apmath/student/index.html?omr=1');
});
