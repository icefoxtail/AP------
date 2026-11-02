// APMS 반응 속도(2026-11-02): 앱 시작이 글꼴을 기다리지 않고, 클리닉 학년 자료 조회가 느려지지 않고, 모달 닫기가 짧다.
// 정확한 개수 대신 결함 조건(차단 링크 없음, 결과 불일치 0, 닫기 대기 상한)을 검사한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

test('Pretendard 글꼴 링크는 화면을 막지 않는다(4개 페이지)', () => {
    for (const rel of ['apmath/index.html', 'apmath/student/index.html', 'apmath/homework/index.html', 'apmath/planner/index.html']) {
        const html = read(rel);
        const links = html.match(/<link[^>]*pretendard[^>]*>/gi) || [];
        assert.ok(links.length >= 2, `${rel}: 글꼴 링크(비차단 + noscript)가 있어야 한다`);
        const blocking = html.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '').match(/<link[^>]*rel="stylesheet"[^>]*pretendard[^>]*>/gi) || [];
        assert.ok(blocking.length >= 1, rel);
        for (const tag of blocking) {
            assert.match(tag, /media="print"/, `${rel}: 글꼴 링크가 media="print"로 시작해야 한다`);
            assert.match(tag, /onload="[^"]*requestIdleCallback[^"]*l\.media='all'|onload="[^"]*l\.media='all'[^"]*requestIdleCallback/, `${rel}: 받은 뒤 한가할 때 media를 all로 바꾼다`);
            assert.match(tag, /pretendard@v\d+\.\d+\.\d+\/dist\/web\/static\/pretendard-dynamic-subset\.min\.css/, `${rel}: 버전을 고정한 dynamic-subset`);
        }
        assert.match(html, /<link rel="preconnect" href="https:\/\/cdn\.jsdelivr\.net"/, `${rel}: preconnect`);
        assert.match(html, /<noscript><link rel="stylesheet" href="[^"]*pretendard-dynamic-subset\.min\.css"><\/noscript>/, `${rel}: noscript 대비`);
    }
});

function runAppJs(readyState) {
    const listeners = { doc: {}, win: {} };
    const calls = [];
    const context = {
        document: { readyState, addEventListener: (t, fn) => { (listeners.doc[t] ||= []).push(fn); } },
        window: { addEventListener: (t, fn) => { (listeners.win[t] ||= []).push(fn); } },
        navigator: { onLine: true },
        loadData: async arg => { calls.push(['loadData', arg]); },
        processSyncQueue: async () => { calls.push(['sync']); }
    };
    context.window.window = context.window;
    vm.createContext(context);
    vm.runInContext(read('apmath/app.js'), context, { filename: 'app.js' });
    return { listeners, calls, context };
}

test('app 시작은 window.onload에 묶이지 않는다', async () => {
    assert.doesNotMatch(read('apmath/app.js'), /window\.onload\s*=/);
    const loading = runAppJs('loading');
    assert.equal(loading.context.window.onload, undefined);
    assert.equal(loading.calls.length, 0, '문서를 읽는 중에는 아직 시작하지 않는다');
    for (const fn of loading.listeners.doc.DOMContentLoaded) await fn();
    assert.deepEqual(loading.calls, [['loadData', true], ['sync']]);
    // 이어서 load가 와도 두 번 시작하지 않는다.
    for (const fn of loading.listeners.win.load || []) await fn();
    assert.equal(loading.calls.filter(c => c[0] === 'loadData').length, 1);

    const done = runAppJs('complete');
    await new Promise(r => setImmediate(r));
    assert.deepEqual(done.calls, [['loadData', true], ['sync']], '이미 다 불러온 뒤에는 바로 시작한다');
});

function loadClinicPrint() {
    const context = {
        window: { location: { href: 'https://fixture.local/apmath/index.html', origin: 'https://fixture.local' }, addEventListener() {}, open() { return {}; } },
        document: { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
        state: { db: { wrong_answers: [] }, ui: {} },
        localStorage: { getItem() { return null; }, setItem() {} },
        sessionStorage: { setItem() {} },
        URL, URLSearchParams, console, toast() {}
    };
    vm.createContext(context);
    vm.runInContext(read('apmath/js/clinic-print.js'), context, { filename: 'clinic-print.js' });
    return context;
}

function legacyWrongIds(rows, sessionId) {
    return rows
        .filter(row => String(row.session_id) === String(sessionId))
        .map(row => Number(row.question_id))
        .filter(no => Number.isFinite(no) && no > 0)
        .sort((a, b) => a - b);
}

test('clinicPrintGetWrongIdsBySession: 색인 결과가 옛 선형 탐색과 같다(무작위 자료)', () => {
    const ctx = loadClinicPrint();
    let seed = 20261102;
    const rand = n => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed % n; };
    const sessionCount = 40;
    const rows = [];
    for (let i = 0; i < 1500; i += 1) {
        const q = rand(8) === 0 ? ['x', 0, -3, null, '7'][rand(5)] : rand(30) + 1; // 이상한 값도 섞는다
        rows.push({ id: `w${i}`, session_id: rand(3) === 0 ? rand(sessionCount) : `ses${rand(sessionCount)}`, question_id: q });
    }
    ctx.__rows = rows;
    vm.runInContext("clinicPrintGradeData.set('g1', { status: 'ready', wrong_answers: __rows });", ctx);
    for (let s = 0; s < sessionCount + 5; s += 1) {
        for (const id of [`ses${s}`, s, String(s)]) {
            assert.deepEqual([...ctx.clinicPrintGetWrongIdsBySession(id, 'g1')], legacyWrongIds(rows, id), `session ${id}`);
        }
    }
    assert.deepEqual([...ctx.clinicPrintGetWrongIdsBySession('ses-없음', 'g1')], []);

    // 같은 배열에 행이 늘면(길이가 달라지면) 다시 만든다.
    rows.push({ id: 'late', session_id: 'ses1', question_id: 29 });
    assert.deepEqual([...ctx.clinicPrintGetWrongIdsBySession('ses1', 'g1')], legacyWrongIds(rows, 'ses1'));
    // 배열 자체가 바뀌어도 새 배열을 쓴다.
    const next = [{ id: 'n1', session_id: 'ses1', question_id: 3 }];
    ctx.__next = next;
    vm.runInContext("clinicPrintGradeData.set('g1', { status: 'ready', wrong_answers: __next });", ctx);
    assert.deepEqual([...ctx.clinicPrintGetWrongIdsBySession('ses1', 'g1')], [3]);
});

test('클리닉 출력 센터: 두 조회를 동시에 보내고, 미리보기 문서는 화면이 그려진 뒤 불러온다', () => {
    const src = read('apmath/js/clinic-print.js');
    assert.match(src, /await Promise\.all\(\[\s*clinicPrintRefreshClassAssignments\(classId\),\s*clinicPrintRefreshGradeClinicData\(classId\)\s*\]\)/);
    assert.doesNotMatch(src, /<iframe id="clinic-print-preview-frame"[^>]*\ssrc=/, '미리보기 iframe은 처음부터 src를 갖지 않는다');
    assert.match(src, /setAttribute\('src', 'wrong_print_engine\.html\?preview=1'\)/);
});

test('모달 닫기 대기는 150ms 이하(현재 120ms)이고 CSS 전환과 맞는다', () => {
    const ui = read('apmath/js/ui.js');
    const ms = Number(ui.match(/const APMS_MODAL_CLOSE_MS = (\d+);/)?.[1]);
    assert.ok(ms > 0 && ms <= 150, `닫기 대기 ${ms}ms`);
    assert.match(ui, /\}, apmsModalCloseDelay\(\)\);/);
    assert.match(ui, /prefers-reduced-motion: reduce/);
    const html = read('apmath/index.html');
    const overlay = html.match(/#modal-overlay \{[\s\S]*?\n        \}/)[0];
    const content = html.match(/#modal-content \{[\s\S]*?\n        \}/)[0];
    for (const block of [overlay, content]) {
        const sec = Number(block.match(/transition:[^;]*?(\d*\.?\d+)s/)?.[1]);
        assert.ok(sec > 0 && sec * 1000 <= ms, `전환 ${sec}s는 닫기 대기 ${ms}ms 이하`);
    }
});
