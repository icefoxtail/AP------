// APMS 뒤로 가기·닫기 정책(N2) 결함 조건 테스트 (2026-11-02).
// ui.js의 실제 모달·이력 코드를 가짜 DOM·가짜 브라우저 이력 위에서 실행한다. 개수 대신 결함 조건만 본다:
//  - 뒤로 가기(popstate)가 맨 위 모달(단계 모달은 한 단계)만 닫는가
//  - 입력 중이면 확인을 묻고, 아니오면 그대로 두며 이력을 복구하는가
//  - 코드가 닫은 뒤(저장 성공 closeModal(true))에 이력이 정리되어 "두 번 눌러야 하는" 일이 없는가
//  - 헤더 취소·앱 ←도 같은 확인을 거치는가, 하단 취소가 헤더 취소와 중복되지 않는가
//  - 주소에 아무것도 남기지 않는가(pushState 세 번째 인자 = 현재 주소)
//  - CSS: 모달 안 <header>를 잡지 않고, 토스트가 모달 제목을 덮지 않고, 휴대폰 전체 화면 모달에서 앱 ←가 숨는가
// 실제 크롬 흐름은 tests/apms-history-back-browser.cjs(수동 실행)가 본다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const ui = read('apmath/js/ui.js');
const index = read('apmath/index.html');

function sliceBetween(src, begin, end) {
    const i = src.indexOf(begin);
    const j = src.indexOf(end, i + begin.length);
    assert.ok(i >= 0 && j > i, `boundary not found: ${begin}`);
    return src.slice(i, j);
}

function fakeElement(extra = {}) {
    const classes = new Set(extra.classes || []);
    const el = {
        classList: {
            add: n => classes.add(n), remove: n => classes.delete(n), contains: n => classes.has(n),
            toggle: (n, on) => { if (on === undefined ? !classes.has(n) : on) classes.add(n); else classes.delete(n); }
        },
        style: {}, dataset: {}, innerText: '', innerHTML: '', disabled: false, onclick: null,
        addEventListener() {}, getBoundingClientRect: () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 }),
        querySelector: () => null, querySelectorAll: () => [], appendChild() {}, setAttribute() {},
        ...extra
    };
    delete el.classes;
    return el;
}

// 브라우저 이력 흉내: pushState는 앞으로 갈 항목을 지우고, go(-1)은 비동기로 popstate를 낸다.
function makeBrowser() {
    const entries = [{ state: { apmsBase: true } }];
    let index = 0;
    const listeners = [];
    const fire = () => listeners.forEach(fn => fn({ state: entries[index].state }));
    const history = {
        get state() { return entries[index].state; },
        pushState(state, title, url) { history.pushed.push(url); entries.splice(index + 1); entries.push({ state }); index += 1; },
        replaceState(state) { entries[index].state = state; },
        go(delta) { setTimeout(() => { index = Math.max(0, Math.min(entries.length - 1, index + delta)); fire(); }, 0); },
        back() { history.go(-1); },
        pushed: []
    };
    return {
        history, entries, listeners,
        addEventListener: (type, fn) => { if (type === 'popstate') listeners.push(fn); },
        userBack() { index = Math.max(0, index - 1); fire(); }, // 기기 뒤로 가기 버튼
        get index() { return index; }
    };
}

const tick = (ms = 5) => new Promise(resolve => setTimeout(resolve, ms));

function makeApp({ tier = 'form', adoptBodyHasActions = false } = {}) {
    const browser = makeBrowser();
    const calls = { confirm: 0, renderClass: [], renderDashboard: 0, renderAdmin: 0 };
    const answers = { confirm: true };
    const classes = {
        'modal-overlay': ['hidden'], 'modal-body': [], 'modal-content': [], 'modal-title': [], 'modal-cancel-btn': []
    };
    const elements = {};
    for (const id of Object.keys(classes)) elements[id] = fakeElement({ classes: classes[id] });
    const bodyClasses = new Set();
    const bar = { innerHTML: '', className: '', setAttribute() {}, lastChild: {} };
    const root = {
        classList: { contains: name => name === `apms-modal--${tier}` },
        querySelector: () => (adoptBodyHasActions ? {} : null),
        appendChild: el => { root.appended = el; }
    };
    elements['modal-body'].querySelector = sel => (sel === '.apms-modal' ? root : null);
    elements['modal-body'].addEventListener = (type, fn) => { (elements['modal-body'].listeners = elements['modal-body'].listeners || {})[type] = fn; };
    const document = {
        getElementById: id => elements[id] || null,
        querySelector: () => null,
        createElement: () => bar,
        addEventListener() {},
        readyState: 'complete',
        body: { classList: { add: n => bodyClasses.add(n), remove: n => bodyClasses.delete(n), contains: n => bodyClasses.has(n) } }
    };
    const win = {
        history: browser.history, location: { href: 'https://example.test/apmath/index.html' },
        addEventListener: browser.addEventListener, setTimeout, confirm: () => { calls.confirm += 1; return answers.confirm; },
        renderClass: id => { calls.renderClass.push(id); },
        renderDashboard: () => { calls.renderDashboard += 1; },
        renderAdminControlCenter: () => { calls.renderAdmin += 1; }
    };
    const source = [
        sliceBetween(ui, 'let modalCloseTimer = null;', 'function appHistoryWrapGlobal('),
        sliceBetween(ui, 'function getCurrentModalSnapshot() {', 'function escapeHtmlForTextarea(')
    ].join('\n') + `
        ;globalThis.__api = { showModal, showModalStep, closeModal, requestCloseModal, appHistoryBack, appHistoryRecordView, apmsNavDepth,
            registerEscapeLayer, markModalDirty, isModalDirty, appHistoryState, get stepDepth() { return modalStepStack.length; } };`;
    const context = {
        document, window: win, history: browser.history, location: win.location, console: { warn() {}, log() {}, error() {} },
        setTimeout, clearTimeout, Promise, requestAnimationFrame: fn => fn(), state: { ui: {}, auth: { role: 'teacher' } },
        hasUnsavedClassProgressChanges: undefined
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'ui.js(nav-history)' });
    const api = context.__api;
    const type = () => { elements['modal-body'].listeners.input({ isTrusted: true, target: { tagName: 'INPUT', type: 'text', closest: () => null } }); };
    return {
        api, browser, calls, answers, elements, bar, root, bodyClasses, type,
        open: (title = '모달') => { api.showModal(title, '<div></div>'); },
        step: (title = '단계') => { api.showModalStep(title, '<div></div>'); },
        // 화면 이동 흉내: 앱이 renderClass 등을 부르면 ui.js 감싸기가 appHistoryRecordView를 부른다.
        view: (type, extra = {}) => api.appHistoryRecordView({ type, ...extra }),
        guard: () => !!(browser.history.state && browser.history.state.apmsGuard),
        overlayHidden: () => elements['modal-overlay'].classList.contains('hidden')
    };
}

test('popstate: 모달이 열려 있으면 맨 위 모달만 닫고, 화면 이력은 건드리지 않는다', async () => {
    const app = makeApp();
    app.view('adminDashboard');
    app.view('classDetail', { classId: 'c1' }); // 대시보드 → 반 화면
    await tick();
    assert.equal(app.guard(), true, '갈 곳이 있으면 보호 항목이 있다');
    app.open();
    await tick();
    assert.equal(app.guard(), true);
    app.browser.userBack(); // 기기 뒤로 가기
    await tick();
    assert.equal(app.api.apmsNavDepth(), 1, '모달 한 겹만 줄었다');
    assert.equal(app.api.appHistoryState.backStack.length, 1, '화면 이력은 그대로');
    assert.equal(app.guard(), true, '갈 곳이 남았으므로 보호 항목 복구');
    app.browser.userBack(); // 이번에는 화면 한 칸
    await tick();
    assert.equal(app.api.appHistoryState.backStack.length, 0);
    assert.equal(app.guard(), false, '첫 화면에서는 보호 항목이 없다 = 다음 뒤로 가기는 기본 동작');
    assert.equal(app.calls.renderAdmin, 1, '뒤로 → 대시보드를 다시 그림(앱 ← 와 같다)');
});

test('popstate: 단계 모달은 한 단계씩만 돌아간다', async () => {
    const app = makeApp();
    app.open('첫째');
    app.step('둘째');
    await tick();
    assert.equal(app.api.apmsNavDepth(), 2);
    app.browser.userBack();
    await tick();
    assert.equal(app.api.stepDepth, 0, '둘째 단계만 닫힘');
    assert.equal(app.elements['modal-title'].innerText, '첫째');
    assert.equal(app.overlayHidden(), false, '첫째 모달은 남음');
    assert.equal(app.guard(), true);
    app.browser.userBack();
    await tick();
    assert.equal(app.api.apmsNavDepth(), 0);
    assert.equal(app.guard(), false);
});

test('popstate: 입력 중이면 닫을까요? 확인을 묻고, 아니오면 닫지 않고 보호 항목을 복구한다', async () => {
    const app = makeApp();
    app.open();
    await tick();
    app.type();
    app.answers.confirm = false;
    app.browser.userBack();
    await tick();
    assert.equal(app.calls.confirm, 1);
    assert.equal(app.api.apmsNavDepth(), 1, '아니오 → 모달 유지');
    assert.equal(app.guard(), true, '아니오 → 다음 뒤로 가기가 다시 확인을 묻도록 보호 항목 복구');
    app.answers.confirm = true;
    app.browser.userBack();
    await tick();
    assert.equal(app.calls.confirm, 2);
    assert.equal(app.api.apmsNavDepth(), 0, '예 → 닫힘');
    assert.equal(app.guard(), false);
});

test('헤더 취소·앱 ←: 입력 중이면 Esc와 같은 확인을 거치고, 변경이 없으면 바로 닫는다', async () => {
    const app = makeApp();
    assert.match(index, /id="modal-cancel-btn" onclick="requestCloseModal\('cancel'\)"/, '헤더 취소는 확인을 거치는 닫기를 부른다');
    assert.doesNotMatch(index, /id="modal-cancel-btn" onclick="closeModal\(\)"/);
    app.open();
    app.type();
    app.answers.confirm = false;
    assert.equal(app.api.requestCloseModal('cancel'), false);
    assert.equal(app.calls.confirm, 1);
    assert.equal(app.api.appHistoryBack(), false, '앱 ← 도 같은 확인(아니오 → 유지)');
    assert.equal(app.calls.confirm, 2);
    assert.equal(app.api.apmsNavDepth(), 1);
    app.answers.confirm = true;
    assert.equal(app.api.requestCloseModal('cancel'), true);
    assert.equal(app.api.apmsNavDepth(), 0);

    app.open();
    const before = app.calls.confirm;
    assert.equal(app.api.requestCloseModal('cancel'), true, '변경 없음 → 바로 닫힘');
    assert.equal(app.calls.confirm, before, '변경 없으면 확인 없음');
});

test('저장 성공 닫기 closeModal(true): 확인 없이 닫히고 보호 항목이 걷혀 뒤로 가기가 두 번 필요하지 않다', async () => {
    const app = makeApp();
    app.open();
    await tick();
    assert.equal(app.guard(), true);
    app.type();
    app.api.closeModal(true);
    await tick(20);
    assert.equal(app.calls.confirm, 0, '확인 없음');
    assert.equal(app.api.apmsNavDepth(), 0);
    assert.equal(app.guard(), false, '쌓인 이력 항목이 정리됨');
    assert.equal(app.browser.index, 0, '이력 위치가 처음으로 돌아옴(뒤로 가기 한 번 = 앱 밖)');
});

test('코드가 닫고 바로 다른 모달을 여는 흐름은 이력을 늘리지 않는다', async () => {
    const app = makeApp();
    app.open('첫째');
    await tick();
    const pushedBefore = app.browser.history.pushed.length;
    app.api.closeModal(true);
    app.open('다음');
    await tick(20);
    assert.equal(app.browser.history.pushed.length, pushedBefore, '닫고 곧바로 열어도 새 항목을 쌓지 않는다');
    assert.equal(app.guard(), true);
    assert.equal(app.browser.index, 1, '보호 항목은 한 칸뿐');
});

test('pushState는 주소를 바꾸지 않는다(해시·쿼리를 남기지 않는다)', async () => {
    const app = makeApp();
    app.open();
    await tick();
    assert.deepEqual(app.browser.history.pushed, ['https://example.test/apmath/index.html']);
    assert.match(sliceBetween(ui, 'function apmsNavSync() {', 'function apmsNavScheduleSync'), /pushState\(\{ apmsGuard: true \}, '', window\.location\.href\)/);
});

test('위에 뜬 Esc 레이어는 모달보다 먼저 뒤로 가기로 닫힌다', async () => {
    const app = makeApp();
    app.open();
    let closed = 0;
    const off = app.api.registerEscapeLayer(() => { closed += 1; off(); });
    await tick();
    assert.equal(app.api.apmsNavDepth(), 2);
    app.browser.userBack();
    await tick();
    assert.equal(closed, 1);
    assert.equal(app.api.apmsNavDepth(), 1, '모달은 남음');
});

test('첫 화면(대시보드)으로 직접 돌아오면 화면 이력을 비워 뒤로 가기가 앱 종료가 된다', async () => {
    const app = makeApp();
    app.view('dashboard');
    app.view('classDetail', { classId: 'c1' });
    app.view('dashboard'); // 홈 버튼 등
    await tick();
    assert.equal(app.api.appHistoryState.backStack.length, 0);
    assert.equal(app.guard(), false);
});

test('학생 상세(모달)는 화면 이력에 들어가지 않는다 — 닫은 뒤 뒤로 가기가 다시 열지 않는다', async () => {
    const app = makeApp();
    app.view('dashboard');
    app.view('classDetail', { classId: 'c1' });
    app.view('studentDetail', { studentId: 's1' });
    app.view('classDetail', { classId: 'c1' }); // 모달을 닫고 반 화면으로 복귀
    assert.deepEqual(Array.from(app.api.appHistoryState.backStack, v => v.type), ['dashboard']);
});

test('adoptHeaderActionIntoModalActions: 헤더 취소가 있으면 하단 취소를 만들지 않는다(중복 금지)', async () => {
    const app = makeApp();
    app.api.showModal('저장 모달', '<div class="apms-modal apms-modal--form"></div>', '저장', () => {});
    assert.ok(app.bar.innerHTML.includes('modal-action-btn'), '하단 주 버튼은 만든다');
    assert.ok(!app.bar.innerHTML.includes('취소'), '헤더에 취소가 있으므로 하단 취소는 없다');
    // 헤더 취소가 없는 화면(비정상)에서만 하단 취소를 둔다
    const none = makeApp();
    none.elements['modal-cancel-btn'] = null;
    none.api.showModal('저장 모달', '<div class="apms-modal apms-modal--form"></div>', '저장', () => {});
    assert.ok(none.bar.innerHTML.includes('취소') && none.bar.innerHTML.includes("requestCloseModal('cancel')"));
});

test('CSS: 앱 맨 위 헤더만 잡고(모달 안 <header> 제외), 토스트는 모달 제목을 덮지 않으며, 휴대폰 전체 화면 모달에서는 앱 ←가 숨는다', () => {
    assert.match(index, /body\.ap-modal-open > header,/, '`body.ap-modal-open header`(모든 header)를 앱 최상단 header로 좁힘');
    assert.doesNotMatch(index, /body\.ap-modal-open header[,\s{]/);
    const toastRule = sliceBetween(index, 'body.ap-modal-open .toast-container {', '}');
    assert.match(toastRule, /top: var\(--toast-top/, '모달 헤더 실측 위치(--toast-top)를 쓴다');
    assert.doesNotMatch(toastRule, /top: calc\(12px/, '화면 맨 위(모달 제목 위)에 두지 않는다');
    assert.match(toastRule, /pointer-events: none/, '토스트가 아래 버튼 누르기를 막지 않는다');
    assert.match(sliceBetween(ui, 'function apmsPlaceToastContainer(c) {', 'function toast('), /modal-header[\s\S]*--toast-top/);
    const phoneRule = sliceBetween(index, '@media (max-width: 600px) {\n            body.ap-modal-open:has(', '}\n        }');
    assert.match(phoneRule, /apms-modal--workspace[\s\S]*apms-modal--panel[\s\S]*\.app-back-btn/);
    assert.match(phoneRule, /visibility: hidden/);
});
