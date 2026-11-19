// 시험지 보관함(assessment-mvp.html)이 선생님 브라우저 사정(저장 공간 가득 참, 팝업 차단, 출제 등록 실패)과 무관하게 시험지를 연다.
// 화면의 실제 스크립트를 가짜 브라우저(vm)에 올려 동작으로 확인한다. 운영 개수는 고정하지 않는다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'archive', 'assessment', 'assessment-mvp.html'), 'utf8');
// 쪽 안의 큰 인라인 스크립트(출제·열기 로직)만 꺼낸다.
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).sort((a, b) => b.length - a.length)[0];

const PACK = { id: 'TEST_PACK_1', title: '시험 평가팩', category: '진단평가', grade: '중1', scopeLabel: '범위', questions: [{ id: 1, content: 'q1', _sourceFile: 'a.js', _sourceQuestionNo: 1 }, { id: 2, content: 'q2', _sourceFile: 'a.js', _sourceQuestionNo: 2 }] };

function node() {
  const el = { style: {}, dataset: {}, children: [], textContent: '', innerHTML: '', value: '', options: [], classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, addEventListener() {}, appendChild(child) { el.children.push(child); return child; }, append(...c) { el.children.push(...c); }, remove() {}, focus() {},
    querySelector: () => null, querySelectorAll: () => [], closest: () => null };
  return el;
}

// 한도가 있는 localStorage: 키+값 글자 수가 limit을 넘으면 QuotaExceededError.
function makeStorage(limit, seed = {}) {
  const map = new Map(Object.entries(seed));
  const size = () => [...map].reduce((n, [k, v]) => n + k.length + String(v).length, 0);
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem(k, v) {
      const next = size() - (map.has(k) ? k.length + String(map.get(k)).length : 0) + k.length + String(v).length;
      if (next > limit) { const e = new Error('The quota has been exceeded.'); e.name = 'QuotaExceededError'; throw e; }
      map.set(k, String(v));
    },
    removeItem: (k) => { map.delete(k); },
    key: (i) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
}

function boot({ storage, session = null, fetchImpl, openMode = 'ok' }) {
  const opened = []; // window.open 호출 기록
  const notices = []; // 화면에 붙인 안내
  const wins = [];
  const makeWin = () => { const w = { closed: false, location: { replaceCalls: [], replace(u) { w.location.replaceCalls.push(u); }, set href(u) { w.location.replaceCalls.push(u); } }, document: { title: '', body: { style: {}, textContent: '' } }, close() { w.closed = true; } }; wins.push(w); return w; };
  const document = {
    getElementById: () => node(), querySelector: () => node(), querySelectorAll: () => [],
    createElement: () => { const el = node(); notices.push(el); return el; },
    body: node(), title: '', addEventListener() {},
  };
  if (session) storage.map.set('APMATH_SESSION', JSON.stringify(session));
  const sandbox = {
    document, localStorage: storage, history: { replaceState() {} }, console: { ...console, warn() {}, error() {}, log() {} },
    URL, URLSearchParams, Date, JSON, Math, Promise, setTimeout, clearTimeout, encodeURIComponent, decodeURIComponent, escape, unescape, btoa: (s) => Buffer.from(s, 'binary').toString('base64'), atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    fetch: fetchImpl || (async () => { throw new TypeError('Failed to fetch'); }),
    alert() {}, addEventListener() {},
  };
  sandbox.window = sandbox;
  sandbox.location = { search: '', hash: '', href: 'https://example.test/archive/assessment/assessment-mvp.html', pathname: '/archive/assessment/assessment-mvp.html' };
  sandbox.APMATH_ASSESSMENT_PACKS_1SEM = { packs: [PACK], categoryOrder: ['진단평가'], sourceSummary: {} };
  sandbox.open = (url) => {
    opened.push(String(url));
    if (openMode === 'blocked') return null;
    return makeWin();
  };
  vm.createContext(sandbox);
  vm.runInContext(script.replace(/\bconst (APMATH|MOCK)/g, 'const $1'), sandbox, { filename: 'assessment-mvp.inline.js' });
  // 스크립트 끝의 렌더 호출이 끝난 뒤의 상태에서 시작
  return { sandbox, opened, notices, wins };
}
const call = (ctx, expr) => vm.runInContext(expr, ctx.sandbox);
const urlOf = (win) => new URL(win.location.replaceCalls.at(-1));
const oldKeys = (n, size = 40) => Object.fromEntries([
  ...Array.from({ length: n }, (_, i) => [`mixedQuestions_assessment_OLD_${1700000000000 + i}`, 'x'.repeat(size)]),
  ...Array.from({ length: n }, (_, i) => [`mixedMeta_assessment_OLD_${1700000000000 + i}`, 'm']),
]);

test('저장 공간이 가득 차도 시험지가 열린다: 옛 평가 전달 자료를 정리하고 다시 쓰며, 다른 키는 지우지 않는다', async () => {
  const limit = 4000;
  const storage = makeStorage(limit, { ...oldKeys(60, 40), other_app_key: 'z'.repeat(200) });
  assert.throws(() => storage.setItem('probe', 'y'.repeat(2500)), /quota/i, 'the fixture really is full');
  const ctx = boot({ storage });
  const promise = call(ctx, 'goAssessmentMixedEngine(packs[0], "exam", 4, { preview: true })');
  assert.equal(ctx.opened.length, 1, 'the window is opened at the click itself, before anything is awaited');
  await promise;
  assert.equal(ctx.wins.length, 1);
  const url = urlOf(ctx.wins[0]);
  assert.ok(url.pathname.endsWith('/mixed_engine.html') && url.searchParams.get('key').startsWith('assessment_TEST_PACK_1_'), 'the paper address is loaded into the already open window');
  assert.ok(storage.getItem('mixedQuestions_' + url.searchParams.get('key')), 'the paper data was stored for the engine');
  assert.equal(url.searchParams.get('packId'), null, 'storing worked, so the normal transport is used');
  assert.equal(storage.getItem('other_app_key'), 'z'.repeat(200), 'keys of other features are untouched');
});

test('자료를 아예 저장할 수 없으면 평가팩 번호로 열린다(엔진이 팩 자료 파일에서 직접 읽음)', async () => {
  const storage = makeStorage(0);
  const ctx = boot({ storage });
  await call(ctx, 'goAssessmentMixedEngine(packs[0], "sol", 2)');
  const url = urlOf(ctx.wins[0]);
  assert.equal(url.searchParams.get('packId'), 'TEST_PACK_1');
  assert.equal(url.searchParams.get('mode'), 'sol');
  assert.equal(url.searchParams.get('qpp'), '2');
});

test('출제 등록이 실패해도 시험지는 QR 없이 열리고, 이유를 한국어로 알린다(영어 원문·내부 용어 없음)', async () => {
  const storage = makeStorage(1e9);
  const session = { login_id: 't', session_token: 'tok', expires_at: '2999-01-01T00:00:00Z' };
  for (const [label, fetchImpl, expected] of [
    ['server error', async () => ({ ok: false, status: 502, json: async () => ({ error: 'PDF failed' }) }), /출제본 PDF|서버/],
    ['expired login', async () => ({ ok: false, status: 401, json: async () => ({}) }), /로그인/],
    ['network', async () => { throw new TypeError('Failed to fetch'); }, /연결/],
  ]) {
    const ctx = boot({ storage, session, fetchImpl });
    const promise = call(ctx, 'goAssessmentMixedEngine(packs[0], "exam", 4, { submitQr: true, classId: "c1", className: "반", teacherName: "선생님", target_scope: "class" })');
    assert.equal(ctx.opened.length, 1, `${label}: the window is opened before the slow registration`);
    const result = await promise;
    const url = urlOf(ctx.wins[0]);
    assert.equal(url.searchParams.get('submitQr'), '0', `${label}: no dead submit QR is printed`);
    assert.equal(url.searchParams.get('class'), null, label);
    assert.ok(result && result.registrationFailed, `${label}: the caller is told the registration failed`);
    assert.match(result.registrationFailed, expected, label);
    assert.doesNotMatch(result.registrationFailed, /[A-Za-z]{4,}/, `${label}: no English wording in the teacher message`);
  }
});

test('등록에 성공하면 QR 출제 주소로 열린다', async () => {
  const storage = makeStorage(1e9);
  const session = { login_id: 't', session_token: 'tok' };
  const ctx = boot({ storage, session, fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ success: true, assignment: { pdf_status: 'ready' } }) }) });
  const result = await call(ctx, 'goAssessmentMixedEngine(packs[0], "exam", 4, { submitQr: true, classId: "c1", className: "반", teacherName: "선생님", target_scope: "class" })');
  const url = urlOf(ctx.wins[0]);
  assert.equal(url.searchParams.get('submitQr'), '1');
  assert.equal(url.searchParams.get('class'), 'c1');
  assert.equal(url.searchParams.get('assignmentRegistered'), '1');
  assert.ok(!result || !result.registrationFailed);
});

test('팝업이 막혀 창을 못 열면 던지지 않고 안내와 열기 링크를 보여 준다', async () => {
  const ctx = boot({ storage: makeStorage(1e9), openMode: 'blocked' });
  await call(ctx, 'goAssessmentMixedEngine(packs[0], "exam", 4, { preview: true })');
  const text = ctx.notices.map((el) => `${el.textContent} ${el.href || ''}`).join(' ');
  assert.match(text, /팝업/);
  assert.match(text, /mixed_engine\.html/);
});
