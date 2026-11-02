// APMS 모달 공통 부품·전역 토큰 결함 조건 테스트 (2026-11-02 기반 작업).
// 개수 대신 결함 조건만 본다: Esc가 맨 위 하나만 닫는가, 입력 중이면 확인하는가, 바깥 클릭이 입력 중 폼을 닫지 않는가,
// 등급 클래스·액션줄·휴대폰 시트 규칙이 있는가, 글자로 쓰는 의미색이 AA 대비를 통과하는가, 입력칸 테두리가 3:1 이상인가.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const ui = read('apmath/js/ui.js');
const index = read('apmath/index.html');
const planner = read('apmath/planner/index.html');
const modalCss = read('apmath/css/apms-unified-modal.css');
const warm = read('apmath/css/apms-warm-theme.scope.css');
const override = read('apmath/css/apms-theme-override.css');
const foundation = read('apmath/css/apms-ui-foundation.css');

// ---------- ui.js 정책 구역을 가짜 DOM 위에서 실제로 실행한다 ----------
function sliceBetween(src, begin, end) {
    const i = src.indexOf(begin);
    const j = src.indexOf(end, i + begin.length);
    assert.ok(i >= 0 && j > i, `boundary not found: ${begin}`);
    return src.slice(i, j);
}

function makeHarness({ tier = 'form', open = true } = {}) {
    const calls = { close: 0, confirm: 0, layer: [] };
    const listeners = {};
    const overlay = { classList: { contains: name => name === 'hidden' ? !state.open : false } };
    const state = { open, confirmAnswer: true, loginOverlay: false };
    const rootEl = { classList: { contains: name => tier !== 'legacy' && name === `apms-modal--${tier}` } };
    const bodyEl = {
        addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); },
        querySelector: sel => {
            if (sel === '.apms-modal') return tier === 'legacy' ? null : rootEl;
            return null;
        }
    };
    const documentStub = {
        getElementById: id => (id === 'modal-overlay' ? overlay : id === 'modal-body' ? bodyEl : null),
        querySelector: sel => (sel === '.ap-login-fullscreen' && state.loginOverlay ? {} : null),
        addEventListener: () => {}
    };
    const source = [
        sliceBetween(ui, 'let modalDirtyTouched = false;', 'const apmsEscapeLayers = [];') + 'const apmsEscapeLayers = [];',
        sliceBetween(ui, 'function isModalOpen() {', 'function appHistoryBuildView'),
        sliceBetween(ui, 'function resetModalDirtyState(bodyEl) {', 'if (typeof document !== \'undefined\' && typeof document.addEventListener')
    ].join('\n') + `
        ;globalThis.__api = { resetModalDirtyState, setModalDirtyChecker, markModalClean, markModalDirty, isModalDirty, getModalTier,
            decideModalClose, requestCloseModal, registerEscapeLayer, handleModalEscape, handleModalBackdropPress, handleModalBackdropClick,
            openedNow(){ modalOpenSeq = ++modalLayerSeq; } };`;
    const context = {
        document: documentStub,
        window: { confirm: () => { calls.confirm += 1; return state.confirmAnswer; } },
        console: { warn() {}, log() {}, error() {} },
        closeModal: () => { calls.close += 1; },
        hasUnsavedClassProgressChanges: undefined
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'ui.js(modal-policy)' });
    const api = context.__api;
    api.resetModalDirtyState(bodyEl);
    api.openedNow();
    const typeInto = (target = {}) => (listeners.input || []).forEach(fn => fn({
        isTrusted: true,
        target: { tagName: 'INPUT', type: 'text', closest: () => null, ...target }
    }));
    return { api, calls, state, overlay, typeInto, listeners };
}

const esc = (extra = {}) => ({ key: 'Escape', defaultPrevented: false, isComposing: false, preventDefault() { this.prevented = true; }, ...extra });

test('decideModalClose: 바깥 클릭은 입력 중이면 닫지 않고, 작업 화면·전체 화면은 늘 닫지 않는다', () => {
    const { api } = makeHarness();
    for (const tier of ['confirm', 'form', 'legacy']) {
        assert.equal(api.decideModalClose('backdrop', tier, false), 'close', `${tier} clean backdrop`);
        assert.equal(api.decideModalClose('backdrop', tier, true), 'ignore', `${tier} dirty backdrop`);
    }
    for (const tier of ['workspace', 'panel']) {
        assert.equal(api.decideModalClose('backdrop', tier, false), 'ignore', `${tier} backdrop never closes`);
        assert.equal(api.decideModalClose('backdrop', tier, true), 'ignore');
    }
    for (const tier of ['confirm', 'form', 'workspace', 'panel', 'legacy']) {
        assert.equal(api.decideModalClose('escape', tier, false), 'close');
        assert.equal(api.decideModalClose('escape', tier, true), 'confirm');
    }
});

test('Esc: 변경이 없으면 바로 닫고, 입력 중이면 확인을 거치며 아니오면 닫지 않는다', () => {
    const clean = makeHarness();
    assert.equal(clean.api.handleModalEscape(esc()), true);
    assert.equal(clean.calls.close, 1);
    assert.equal(clean.calls.confirm, 0);

    const dirty = makeHarness();
    dirty.typeInto();
    dirty.state.confirmAnswer = false;
    assert.equal(dirty.api.handleModalEscape(esc()), false);
    assert.equal(dirty.calls.confirm, 1);
    assert.equal(dirty.calls.close, 0, '확인에서 아니오 → 닫지 않는다');
    dirty.state.confirmAnswer = true;
    assert.equal(dirty.api.handleModalEscape(esc()), true);
    assert.equal(dirty.calls.close, 1);
});

test('Esc: 열린 모달이 없거나 한글 조합 중이거나 로그인 화면이 위에 있으면 아무것도 하지 않는다', () => {
    const closed = makeHarness({ open: false });
    assert.equal(closed.api.handleModalEscape(esc()), false);
    assert.equal(closed.calls.close, 0);

    const composing = makeHarness();
    assert.equal(composing.api.handleModalEscape(esc({ isComposing: true })), false);
    assert.equal(composing.calls.close, 0);

    const prevented = makeHarness();
    assert.equal(prevented.api.handleModalEscape(esc({ defaultPrevented: true })), false);

    const login = makeHarness();
    login.state.loginOverlay = true;
    assert.equal(login.api.handleModalEscape(esc()), false);
    assert.equal(login.calls.close, 0);

    const other = makeHarness();
    assert.equal(other.api.handleModalEscape({ key: 'Enter' }), false);
    assert.equal(other.calls.close, 0);
});

test('Esc: 모달 위에 더 늦게 열린 레이어가 있으면 그 레이어만 닫고 모달은 남는다', () => {
    const h = makeHarness();
    const closedLayers = [];
    const unregister = h.api.registerEscapeLayer(() => closedLayers.push('layer'));
    assert.equal(h.api.handleModalEscape(esc()), true);
    assert.deepEqual(closedLayers, ['layer']);
    assert.equal(h.calls.close, 0, '맨 위 레이어만 닫는다');
    unregister();
    assert.equal(h.api.handleModalEscape(esc()), true);
    assert.equal(h.calls.close, 1, '레이어가 사라지면 그 다음 Esc가 모달을 닫는다');

    // 모달이 더 늦게 열렸다면(레이어는 그 아래) 모달이 먼저 닫힌다.
    const h2 = makeHarness();
    const order = [];
    h2.api.registerEscapeLayer(() => order.push('layer'));
    h2.api.openedNow();
    h2.api.handleModalEscape(esc());
    assert.equal(h2.calls.close, 1);
    assert.deepEqual(order, []);
});

test('입력 중 판정: 사용자가 직접 바꾼 칸만 센다(코드가 넣은 값·검색창·data-apms-nodirty는 제외)', () => {
    const h = makeHarness();
    assert.equal(h.api.isModalDirty(), false);
    (h.listeners.input || []).forEach(fn => fn({ isTrusted: false, target: { tagName: 'INPUT', type: 'text', closest: () => null } }));
    assert.equal(h.api.isModalDirty(), false, '코드가 보낸 이벤트는 입력 중이 아니다');
    h.typeInto({ type: 'search' });
    assert.equal(h.api.isModalDirty(), false, '검색창');
    h.typeInto({ closest: sel => (sel === '[data-apms-nodirty]' ? {} : null) });
    assert.equal(h.api.isModalDirty(), false, 'data-apms-nodirty');
    (h.listeners.change || []).forEach(fn => fn({ isTrusted: true, target: { tagName: 'DIV', closest: () => null } }));
    assert.equal(h.api.isModalDirty(), false, '입력칸이 아닌 요소');
    h.typeInto();
    assert.equal(h.api.isModalDirty(), true);
    h.api.markModalClean();
    assert.equal(h.api.isModalDirty(), false, '저장 뒤 markModalClean');
});

test('dirty 콜백을 등록하면 콜백만 본다(진도 모달의 hasUnsavedClassProgressChanges 같은 장치와 호환)', () => {
    const h = makeHarness({ tier: 'workspace' });
    h.typeInto();
    h.api.setModalDirtyChecker(() => false);
    assert.equal(h.api.isModalDirty(), false, '콜백이 false면 입력 이벤트가 있어도 깨끗하다');
    h.api.setModalDirtyChecker(() => true);
    assert.equal(h.api.isModalDirty(), true);
    h.api.setModalDirtyChecker(() => { throw new Error('boom'); });
    assert.equal(h.api.isModalDirty(), false, '콜백이 실패해도 모달이 닫히지 않는 상태로 굳지 않는다');
    h.api.setModalDirtyChecker(null);
    assert.equal(h.api.isModalDirty(), true, '콜백을 지우면 다시 입력 이벤트 기준');
});

test('바깥 클릭: 입력 중이면 닫지 않고, 안에서 누르고 밖에서 놓은 것은 클릭으로 세지 않는다', () => {
    const clean = makeHarness();
    const down = { target: clean.overlay };
    clean.api.handleModalBackdropPress(down);
    assert.equal(clean.api.handleModalBackdropClick({ target: clean.overlay }), true);
    assert.equal(clean.calls.close, 1);

    const dirty = makeHarness();
    dirty.typeInto();
    dirty.api.handleModalBackdropPress({ target: dirty.overlay });
    assert.equal(dirty.api.handleModalBackdropClick({ target: dirty.overlay }), false);
    assert.equal(dirty.calls.close, 0, '입력 중인 폼은 바깥 클릭으로 사라지지 않는다');

    const dragged = makeHarness();
    dragged.api.handleModalBackdropPress({ target: {} }); // 모달 안에서 누름
    assert.equal(dragged.api.handleModalBackdropClick({ target: dragged.overlay }), false);
    assert.equal(dragged.calls.close, 0, '글자를 끌다가 밖에서 놓아도 닫지 않는다');

    const inside = makeHarness();
    inside.api.handleModalBackdropPress({ target: inside.overlay });
    assert.equal(inside.api.handleModalBackdropClick({ target: {} }), false);
    assert.equal(inside.calls.close, 0, '모달 안쪽 클릭');

    for (const tier of ['workspace', 'panel']) {
        const h = makeHarness({ tier });
        h.api.handleModalBackdropPress({ target: h.overlay });
        assert.equal(h.api.handleModalBackdropClick({ target: h.overlay }), false, `${tier} 바깥 클릭`);
        assert.equal(h.calls.close, 0);
    }
});

test('getModalTier: 등급 클래스를 읽고, 클래스가 없으면 옛 모달(legacy)이다', () => {
    for (const tier of ['confirm', 'form', 'workspace', 'panel']) {
        assert.equal(makeHarness({ tier }).api.getModalTier(), tier);
    }
    assert.equal(makeHarness({ tier: 'workspace-single' }).api.getModalTier(), 'workspace', '단열 변형도 작업 화면 정책을 따른다');
    assert.equal(makeHarness({ tier: 'legacy' }).api.getModalTier(), 'legacy');
});

// ---------- 소스·CSS 결함 조건 ----------
test('ui.js: Esc는 document 한 곳에서 받고, 배경 클릭은 누르기·놓기 둘 다 배경일 때만 처리한다', () => {
    assert.match(ui, /document\.addEventListener\('keydown', handleModalEscape\)/);
    assert.match(ui, /document\.__apmsModalEscapeBound/, 'HMR·중복 로드에도 한 번만 붙인다');
    assert.doesNotMatch(index, /onclick="if\(event\.target===this\) closeModal\(\)"/, '배경 클릭이 입력 중에도 닫는 옛 방식이 남아 있다');
    assert.match(index, /onpointerdown="handleModalBackdropPress\(event\)"/);
    assert.match(index, /onclick="handleModalBackdropClick\(event\)"/);
    // closeModal 자체는 저장 흐름이 부르므로 확인창을 끼우지 않는다.
    const closeFn = sliceBetween(ui, 'function closeModal(suppressReturn = false) {', 'function escapeHtmlForTextarea');
    assert.doesNotMatch(closeFn, /confirm/);
});

test('ui.js: showModalStep·showModal이 dirty 상태를 새 모달로 끌고 가지 않는다', () => {
    const apply = sliceBetween(ui, 'function applyModalContent(', 'function adoptHeaderActionIntoModalActions');
    assert.match(apply, /resetModalDirtyState\(bodyEl\)/);
    assert.match(apply, /adoptHeaderActionIntoModalActions\(bodyEl, at, af\)/);
    assert.match(ui, /dirtyChecker: modalDirtyChecker/, '단계 모달 스냅샷이 dirty 콜백을 보관');
    assert.match(sliceBetween(ui, 'function setModalBody(html) {', 'function setModalLoading'), /modalDirtyTouched = false/);
});

test('모달 CSS: 등급 5개와 하단 액션줄·작업 화면 부품이 모두 있다', () => {
    for (const tier of ['confirm', 'form', 'workspace', 'workspace-single', 'panel']) {
        assert.match(modalCss, new RegExp(`#modal-content:has\\(\\.apms-modal--${tier}\\)`), `등급 ${tier}`);
    }
    for (const cls of ['.apms-modal', '.apms-modal__actions', '.apms-workspace', '.apms-workspace__list', '.apms-workspace__detail', '.apms-workspace__bar']) {
        assert.ok(modalCss.includes(cls + ' {') || modalCss.includes(cls + ',') || modalCss.includes(cls + '\n'), `${cls} 규칙`);
    }
    assert.match(modalCss, /position: sticky;\s*bottom: 0;/, '액션줄은 하단 고정');
    assert.match(modalCss, /justify-content: flex-end/, '액션줄은 오른쪽');
    assert.match(modalCss, /grid-template-columns: minmax\(260px, 0\.38fr\) minmax\(0, 1fr\)/, 'W 목록+상세 2열');
    assert.match(modalCss, /width: min\(1180px, calc\(100vw - 32px\)\)/, 'W 기본 너비 1180px');
});

test('모달 CSS: 휴대폰(≤600px)에서 C·F는 시트, W·P는 화면 전체로 열리고 목록 위·상세 아래로 쌓인다', () => {
    const phone = modalCss.slice(modalCss.lastIndexOf('@media (max-width: 600px)'));
    assert.match(phone, /has\(\.apms-modal--confirm\)[\s\S]*border-radius: 16px 16px 0 0/);
    assert.match(phone, /has\(\.apms-modal--workspace\)[\s\S]*has\(\.apms-modal--panel\)[\s\S]*inset: 0;[\s\S]*height: 100dvh;[\s\S]*border-radius: 0;/);
    assert.match(phone, /\.apms-workspace \{ display: flex; flex-direction: column;/);
    assert.match(phone, /env\(safe-area-inset-bottom\)/);
});

test('모달 CSS: 진도 모달 전용 규칙을 복제하지 않고, 움직임 줄이기 설정을 지킨다', () => {
    assert.doesNotMatch(modalCss, /\.ap-class-progress-modal\s*\{/);
    assert.match(modalCss, /prefers-reduced-motion: reduce/);
    assert.doesNotMatch(modalCss, /^#modal-content\s*\{/m);
});

test('모서리: 카드를 6px로 !important 강제하던 옛 규칙이 없고, 카드·모달 16px / 입력·버튼 8px 토큰이 있다', () => {
    assert.doesNotMatch(override, /border-radius:\s*6px\s*!important/);
    assert.match(foundation, /--ap-ui-radius-card:\s*16px/);
    assert.match(foundation, /--ap-ui-radius-control:\s*8px/);
    assert.match(foundation, /--ap-ui-radius-panel:\s*8px/);
    assert.match(warm, /--radius-lg:\s*16px/);
    assert.match(warm, /--radius-md:\s*8px/);
});

test('글자 크기 변수는 한 벌(--ap-font-*)이고 12px 아래 값이 없다', () => {
    assert.doesNotMatch(index, /--ap-font-(title|section|body|meta|label|button):\s*\d/, 'index.html 인라인 정의는 걷어냈다');
    assert.doesNotMatch(read('apmath/css/apms-ui-foundation.css'), /--ap-ui-font-/);
    const defs = [...foundation.matchAll(/--ap-font-([a-z]+):\s*([\d.]+)px/g)];
    const names = defs.map(m => m[1]).sort();
    assert.deepEqual(names, ['body', 'button', 'label', 'meta', 'section', 'stat', 'title']);
    for (const [, name, px] of defs) assert.ok(Number(px) >= 12, `--ap-font-${name} ${px}px < 12px`);
});

test('Pretendard를 APMS·플래너·숙제·학생 포털이 같은 CDN·같은 고정 버전(비차단)으로 불러온다', () => {
    const link = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css';
    assert.ok(index.includes(link), 'apmath/index.html');
    assert.ok(planner.includes(link), 'apmath/planner/index.html');
    assert.ok(read('apmath/homework/index.html').includes(link), '기준: 숙제');
    assert.ok(read('apmath/student/index.html').includes(link), '학생 포털');
});

// ---------- 대비 ----------
function luminance(hex) {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => {
    const [x, y] = [luminance(a), luminance(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
function tokens(block) {
    const out = {};
    for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g)) out[m[1]] = m[2];
    return out;
}
const lightBlock = warm.slice(warm.indexOf('.apms-warm-scope {'), warm.indexOf('body.dark.apms-warm-scope'));
const darkBlock = warm.slice(warm.indexOf('body.dark.apms-warm-scope'), warm.indexOf('/* ---------- 3.'));
const light = tokens(lightBlock);
const dark = tokens(darkBlock);

test('의미색을 글자로 써도 흰 면·안쪽 면·소프트 면 위에서 AA(4.5:1)를 통과한다 (라이트)', () => {
    const surfaces = ['surface', 'bg', 'surface-2', 'success-soft', 'warning-soft', 'error-soft', 'accent-soft'];
    for (const fg of ['success', 'warning', 'error', 'danger', 'secondary', 'primary']) {
        for (const bgName of surfaces) {
            const ratio = contrast(light[fg], light[bgName]);
            assert.ok(ratio >= 4.5, `light --${fg} ${light[fg]} on --${bgName} ${light[bgName]} = ${ratio.toFixed(2)}`);
        }
    }
});

test('다크: 글자색(보조·성공·경고·오류)이 면과 안쪽 면 위에서 AA를 통과한다', () => {
    for (const fg of ['secondary', 'success', 'warning', 'error', 'text-soft']) {
        for (const bgName of ['surface', 'surface-2', 'bg']) {
            const ratio = contrast(dark[fg], dark[bgName]);
            assert.ok(ratio >= 4.5, `dark --${fg} ${dark[fg]} on --${bgName} ${dark[bgName]} = ${ratio.toFixed(2)}`);
        }
    }
});

test('입력칸 테두리(--control-border)는 면 위에서 UI 대비 3:1 이상이고, 입력 규칙이 그것을 쓴다', () => {
    for (const bgName of ['surface', 'bg', 'surface-2']) {
        assert.ok(contrast(light['control-border'], light[bgName]) >= 3, `light control-border on ${bgName}`);
    }
    for (const bgName of ['surface', 'bg']) {
        assert.ok(contrast(dark['control-border'], dark[bgName]) >= 3, `dark control-border on ${bgName}`);
    }
    // 학생 포털이 같이 쓰는 override의 :root 값도 흰 면 위에서 통과해야 한다.
    const rootBlock = override.slice(override.indexOf(':root {'), override.indexOf('body.dark {'));
    const darkRoot = override.slice(override.indexOf('body.dark {'), override.indexOf('html {'));
    assert.ok(contrast(tokens(rootBlock)['control-border'], '#ffffff') >= 3, 'override :root');
    assert.ok(contrast(tokens(darkRoot)['control-border'], '#1c1c1e') >= 3, 'override body.dark');
    assert.match(override, /border-color:\s*var\(--control-border, var\(--border\)\)/);
    assert.match(modalCss, /border: 1px solid var\(--control-border, var\(--border\)\)/);
});

test('포커스 표시는 2px 실선 --primary 고리다(옛 4px 14% 고리는 UI 대비 1.2:1이었다)', () => {
    const focus = sliceBetween(override, '.btn:focus-visible,', '[style*="rgba(26,92,255,0.07)"]');
    assert.match(focus, /outline:\s*2px solid var\(--primary\)/);
    assert.doesNotMatch(focus, /0\.14/);
    assert.ok(contrast(light.primary, light.surface) >= 3);
    assert.ok(contrast(dark.primary, dark.surface) >= 3);
});

test('모달이 열려 있으면 토스트가 모달 제목줄 아래로 올라가 제목·하단 액션줄을 가리지 않는다', () => {
    // N2: 화면 맨 위(top: 12px)는 모달 제목을 덮었다. 위치는 ui.js toast()가 모달 헤더를 재서 --toast-top 으로 넣는다.
    assert.match(index, /body\.ap-modal-open \.toast-container\s*\{[^}]*bottom:\s*auto;[^}]*top:\s*var\(--toast-top,/);
    assert.doesNotMatch(index, /body\.ap-modal-open \.toast-container\s*\{[^}]*top:\s*calc\(12px/);
});
