'use strict';
// 원본 기출 화면(engine.html)의 "쪽당 문항 수" 선택. 실제 Chrome 확인은 PR 본문에 있고, 여기서는 결함 조건만 지킨다:
// 선택이 보이면 안 되는 화면(미리보기·학생·QR·출제본)에서 안 보이는지, 고른 값이 엔진의 기존 다시 그리기 경로(QPP_CHANGE)와
// 기억 저장 키로만 가는지(새 저장 키·새 렌더 경로 없음), 시험·해설 탭을 오간 뒤의 스냅샷 주소가 직접 열기 주소로 돌아가는지.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive/engine.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'archive/archive2-output-bar.css'), 'utf8');

function sliceFunction(source, header) {
  const start = source.indexOf(header);
  assert.notEqual(start, -1, `${header} exists`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`${header} not closed`);
}

function harness({ search, envelope = false, preview = false, qpp = 4, setArchiveQpp } = {}) {
  const calls = { qpp: [], replaced: [], stored: [] };
  const buttons = [2, 4, 6, 8].map(value => {
    const classes = new Set();
    return { dataset: { qpp: String(value) }, classList: { toggle: (name, on) => (on ? classes.add(name) : classes.delete(name)), has: name => classes.has(name) }, setAttribute() {}, classes };
  });
  const box = { hidden: true, classList: { add() {}, remove() {} }, querySelectorAll: () => buttons };
  const sandbox = {
    URLSearchParams, URL, Number, String, Set, Promise,
    AppState: { qpp, outputEnvelope: envelope ? {} : undefined },
    document: { getElementById: id => (id === 'qpp-switch' ? box : null) },
    localStorage: { setItem: (key, value) => calls.stored.push([key, value]) },
    isPreviewMode: () => preview,
    setArchiveQpp: setArchiveQpp || (async value => { calls.qpp.push(value); sandbox.AppState.qpp = value; return { ok: true }; }),
  };
  sandbox.window = { location: { search, href: `https://example.test/archive/engine.html${search}`, replace: href => calls.replaced.push(href) } };
  vm.createContext(sandbox);
  vm.runInContext([
    "const ARCHIVE_ORIGINAL_QPP_KEY = 'APMATH_ARCHIVE2_ORIGINAL_QPP';",
    sliceFunction(engine, 'function qppSwitchEligible()'),
    sliceFunction(engine, 'function syncQppSwitch()'),
    'let qppSwitchBusy = false;',
    sliceFunction(engine, 'async function chooseArchiveQpp(value)'),
  ].join('\n'), sandbox);
  return { sandbox, calls, box, buttons };
}

test('선택은 원본을 data= 주소로 직접 연 화면에서만 보인다', () => {
  const shown = search => { const h = harness({ search }); h.sandbox.syncQppSwitch(); return !h.box.hidden; };
  assert.equal(shown('?data=exams%2Foriginal%2Fa.js&mode=exam'), true);
  assert.equal(shown('?data=exams%2Foriginal%2Fa.js&mode=exam&qpp=2'), true);
  // 미리보기·학생 화면·QR·출제본·저장본(주소에 data가 없음)·학생 검토에서는 없다.
  assert.equal(harness({ search: '?data=exams%2Fa.js&preview=1', preview: true }).sandbox.qppSwitchEligible(), false);
  for (const search of ['?data=exams%2Fa.js&fit=screen', '?data=exams%2Fa.js&qr=1', '?data=exams%2Fa.js&studentReview=1', '?data=exams%2Fa.js&assignmentId=x', '?data=exams%2Fa.js&originalSnapshot=k',
    '?archive2Context=archive2&outputRequestId=r&outputOwnerId=o&mode=exam&qpp=4'])
    assert.equal(shown(search), false, search);
});

test('현재 쪽당 값 하나만 눌린 표시가 되고, 고른 값은 엔진의 QPP_CHANGE 경로와 기존 기억 키로 간다', async () => {
  const h = harness({ search: '?data=exams%2Fa.js&mode=exam', qpp: 4 });
  h.sandbox.syncQppSwitch();
  assert.deepEqual(h.buttons.filter(b => b.classes.has('is-active')).map(b => b.dataset.qpp), ['4']);
  await h.sandbox.chooseArchiveQpp(2);
  assert.deepEqual(h.calls.qpp, [2]);
  assert.deepEqual(h.calls.stored, [['APMATH_ARCHIVE2_ORIGINAL_QPP', '2']]);
  assert.deepEqual(h.calls.replaced, []);
  assert.deepEqual(h.buttons.filter(b => b.classes.has('is-active')).map(b => b.dataset.qpp), ['2']);
  // 같은 값·허용 밖의 값·화면에 없는 선택에서는 아무 일도 하지 않는다.
  await h.sandbox.chooseArchiveQpp(2);
  await h.sandbox.chooseArchiveQpp(3);
  assert.deepEqual(h.calls.qpp, [2]);
  const hidden = harness({ search: '?data=exams%2Fa.js&fit=screen' });
  await hidden.sandbox.chooseArchiveQpp(2);
  assert.deepEqual([hidden.calls.qpp, hidden.calls.stored], [[], []]);
});

test('다시 그리는 동안의 겹친 선택은 무시하고, 실패해도 선택줄이 다시 눌린다', async () => {
  let release;
  const h = harness({ search: '?data=exams%2Fa.js', setArchiveQpp: value => new Promise(resolve => { release = () => resolve({ ok: false, code: String(value) }); }) });
  const first = h.sandbox.chooseArchiveQpp(2);
  await h.sandbox.chooseArchiveQpp(6);
  assert.deepEqual(h.calls.stored, [['APMATH_ARCHIVE2_ORIGINAL_QPP', '2']], '두 번째 누름은 저장도 하지 않는다');
  release();
  await first;
  const second = h.sandbox.chooseArchiveQpp(8);
  release();
  await second;
  assert.deepEqual(h.calls.stored.at(-1), ['APMATH_ARCHIVE2_ORIGINAL_QPP', '8']);
});

test('시험·해설 탭을 오간 뒤(출력 스냅샷 주소)에는 스냅샷 값을 지운 직접 열기 주소로 다시 연다', async () => {
  const search = '?data=exams%2Fa.js&mode=exam&qpp=4&archive2Context=archive2&archive2OutputContract=c1&outputRequestId=r1&outputOwnerId=o1&q=20&studio=1';
  const h = harness({ search, envelope: true });
  await h.sandbox.chooseArchiveQpp(2);
  assert.deepEqual(h.calls.qpp, [], '스냅샷에 묶인 값은 제자리에서 바꾸지 않는다');
  assert.equal(h.calls.replaced.length, 1);
  const url = new URL(h.calls.replaced[0]);
  assert.equal(url.searchParams.get('qpp'), '2');
  assert.equal(url.searchParams.get('data'), 'exams/a.js');
  assert.equal(url.searchParams.get('mode'), 'exam');
  for (const key of ['archive2Context', 'archive2OutputContract', 'outputRequestId', 'outputOwnerId', 'studio']) assert.equal(url.searchParams.has(key), false, key);
});

test('화면 규칙: 미리보기·학생 화면·휴대폰·해설/정답 탭에서는 숨고, 새 저장 키·렌더 경로를 만들지 않는다', () => {
  assert.match(css, /body\.preview-mode :is\([^)]*#qpp-switch/);
  assert.match(css, /body\.screen-fit-mode #qpp-switch \{ display: none !important; \}/);
  assert.match(css, /#ctrl-title, #qpp-display, #qpp-switch \{ display: none; \}/);
  assert.match(css, /#mode-ctrl:has\(#btn-sol\.active, #btn-ans\.active\) #qpp-switch \{ display: none; \}/);
  assert.match(css, /\.qpp-switch\[hidden\] \{ display: none; \}/);
  assert.doesNotMatch(css, /@media print/);
  // 쪽당 2·4가 먼저, 6·8은 옅은 작은 선택(같은 묶음 안).
  const markup = engine.slice(engine.indexOf('id="qpp-switch"'), engine.indexOf('id="qpp-display"'));
  assert.deepEqual([...markup.matchAll(/data-qpp="(\d)"/g)].map(m => m[1]), ['2', '4', '6', '8']);
  assert.match(markup, /data-qpp="6"/);
  assert.equal((markup.match(/qpp-opt--minor/g) || []).length, 2);
  assert.match(css, /\.qpp-opt--minor \{[^}]*var\(--muted\)/);
  // 기억값은 기존 키 하나만 쓰고, 다시 그리기는 엔진의 setArchiveQpp(QPP_CHANGE)만 쓴다.
  const choose = sliceFunction(engine, 'async function chooseArchiveQpp(value)');
  assert.match(choose, /localStorage\.setItem\(ARCHIVE_ORIGINAL_QPP_KEY/);
  assert.match(engine, /const ARCHIVE_ORIGINAL_QPP_KEY = 'APMATH_ARCHIVE2_ORIGINAL_QPP';/);
  assert.match(choose, /await setArchiveQpp\(qpp\)/);
  assert.doesNotMatch(choose, /archiveScreenRuntime\.request|render\(\)/);
  // 엔진이 "쪽당 N문항" 글자를 다시 쓸 때마다 표시를 맞춘다(첫 그리기·되돌림 포함).
  assert.match(engine, /new MutationObserver\(syncQppSwitch\)\.observe\(qppDisplay/);
});
