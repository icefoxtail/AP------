// APMS 새로고침 시 반 화면 복원(N4, 결정 D3) 결함 조건 테스트 (2026-11-02).
// ui.js의 "새로고침 시 반 화면 복원" 구역(apmsClassHash*)을 가짜 주소·이력 위에서 실행하고, core.js 연결을 글자로 확인한다.
//  - 반 화면에서는 주소에 #class=<id>만 쓰고(replaceState, 이력 칸을 늘리지 않음), 다른 화면에서는 지우는가
//  - 접근 불가·없는 반 해시는 조용히 버리는가
//  - 로그아웃은 해시·기록·열린 반을 지우는가, 다른 계정(또는 주인 모르는 해시)은 복원하지 않는가
//  - 복원은 화면 이력에 대시보드를 남기고, 보호 항목 pushState는 해시를 따라가는가(코드 글자)
// 실제 크롬 새로고침·뒤로 가기 흐름은 tests/apms-class-hash-restore-browser.cjs(수동 실행)가 본다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const ui = read('apmath/js/ui.js');
const core = read('apmath/js/core.js');
const index = read('apmath/index.html');

const section = ui.slice(ui.indexOf("const APMS_CLASS_HASH_OWNER_KEY"), ui.indexOf('function appHistoryWrapGlobal'));
assert.ok(section.includes('function apmsClassHashForget'), 'N4 구역을 찾지 못함');

// 가짜 브라우저: location.hash와 replaceState 횟수, pushState 횟수를 센다.
function makeEnv({ hash = '', accessible = ['c1'], owner = '', loginVisible = false, auth = { id: 't1', role: 'teacher' } } = {}) {
    const store = {};
    if (owner) store.APMS_CLASS_HASH_OWNER = owner;
    const env = { replaced: [], pushed: 0, store };
    const location = { pathname: '/apmath/index.html', search: '', hash };
    env.location = location;
    const history = {
        state: null,
        replaceState(st, t, url) { env.replaced.push(url); const i = url.indexOf('#'); location.hash = i >= 0 ? url.slice(i) : ''; },
        pushState() { env.pushed += 1; }
    };
    const state = { auth, ui: { currentClassId: null }, db: { classes: [] } };
    const appHistoryState = { currentView: null, backStack: [], restoring: false };
    const rendered = [];
    const ctx = {
        window: { location, history, renderClass: id => { rendered.push(id); state.ui.currentClassId = id; appHistoryState.currentView = { type: 'classDetail', classId: id }; return true; } },
        sessionStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
        document: { querySelector: () => ({}) },
        state, appHistoryState, rendered,
        apmsNavGuard: { holdBoot: false },
        apmsNavLoginVisible: () => loginVisible,
        apmsNavScheduleSync() {},
        appHistoryBuildView: (name, args = []) => ({ type: name === 'renderClass' ? 'classDetail' : 'dashboard', classId: args[0] ? String(args[0]) : '' }),
        appHistoryRecordView(v) { appHistoryState.currentView = v; },
        isClassroomClassAccessible: id => accessible.includes(String(id)),
        renderDashboard() { appHistoryState.currentView = { type: 'dashboard' }; },
        encodeURIComponent, decodeURIComponent, String, Promise, setTimeout, clearTimeout
    };
    ctx.window.window = ctx.window;
    vm.createContext(ctx);
    vm.runInContext(section.replace(/^const /m, 'var ').replace(/^let /m, 'var '), ctx);
    env.ctx = ctx; env.state = state; env.app = appHistoryState; env.rendered = rendered;
    return env;
}

test('반 화면에 있으면 주소에 #class=<id>만 남기고(replaceState), 다른 화면으로 가면 지운다', () => {
    const env = makeEnv();
    env.state.ui.currentClassId = 'c1';
    env.app.currentView = { type: 'classDetail', classId: 'c1' };
    env.ctx.apmsClassHashApply();
    assert.equal(env.location.hash, '#class=c1');
    assert.equal(env.store.APMS_CLASS_HASH_OWNER, 't1', '해시를 쓴 사용자 id를 탭에 기록');
    assert.equal(env.pushed, 0, '이력 칸을 늘리지 않는다');
    env.ctx.apmsClassHashApply();
    assert.equal(env.replaced.length, 1, '같은 값이면 다시 쓰지 않는다');
    env.app.currentView = { type: 'timetable' };
    env.ctx.apmsClassHashApply();
    assert.equal(env.location.hash, '', '다른 화면 → 해시 제거');
    env.app.currentView = { type: 'classDetail', classId: 'c9' };
    env.state.ui.currentClassId = 'c9';
    env.ctx.apmsClassHashApply();
    assert.equal(env.location.hash, '', '접근 불가 반은 해시에 쓰지 않는다');
});

test('복원 대상: 접근 가능한 반만, 접근 불가·없는 반은 해시를 조용히 지운다', () => {
    let env = makeEnv({ hash: '#class=c1' });
    env.ctx.apmsClassHashNoteLoad({ id: 't1' });
    assert.equal(env.ctx.apmsClassHashRestoreTarget({ id: 't1' }), 'c1', '로그인 세션이 있는 부팅 → 복원');
    for (const bad of ['c9', 'zzz']) {
        env = makeEnv({ hash: '#class=' + bad });
        env.ctx.apmsClassHashNoteLoad({ id: 't1' });
        assert.equal(env.ctx.apmsClassHashRestoreTarget({ id: 't1' }), '', bad + ' 복원 안 함');
        assert.equal(env.location.hash, '', bad + ' 해시 제거');
    }
    env = makeEnv({ hash: '' });
    env.ctx.apmsClassHashNoteLoad({ id: 't1' });
    assert.equal(env.ctx.apmsClassHashRestoreTarget({ id: 't1' }), '');
    env = makeEnv({ hash: '#class=c1&x=1' });
    assert.equal(env.ctx.apmsClassHashRead(), '', '#class= 말고 다른 것이 섞인 해시는 읽지 않는다');
});

test('다른 계정·주인 모르는 해시는 로그인 뒤에도 복원하지 않는다, 같은 계정 만료 뒤 로그인은 복원한다', () => {
    // 부팅 때 세션이 없었다(로그인 화면) → 해시 주인 기록이 있는 같은 사용자만
    let env = makeEnv({ hash: '#class=c1', owner: 't1' });
    env.ctx.apmsClassHashNoteLoad(null);
    assert.equal(env.ctx.apmsClassHashRestoreTarget({ id: 't1' }), 'c1', '같은 사용자 → 복원');
    env = makeEnv({ hash: '#class=c1', owner: 't1', accessible: ['c1'] });
    env.ctx.apmsClassHashNoteLoad(null);
    assert.equal(env.ctx.apmsClassHashRestoreTarget({ id: 't2' }), '', '다른 사용자 → 복원 안 함');
    assert.equal(env.location.hash, '', '다른 사용자 → 해시와 기록도 지운다');
    assert.equal(env.store.APMS_CLASS_HASH_OWNER, undefined);
    env = makeEnv({ hash: '#class=c1' });
    env.ctx.apmsClassHashNoteLoad(null);
    assert.equal(env.ctx.apmsClassHashRestoreTarget({ id: 't1' }), '', '주인 모르는 해시 + 로그인 전 부팅 → 복원 안 함');
    // 다른 탭에서 다른 사용자가 쓴 해시를 세션 있는 부팅에서 만나도
    env = makeEnv({ hash: '#class=c1', owner: 't2' });
    env.ctx.apmsClassHashNoteLoad({ id: 't1' });
    assert.equal(env.ctx.apmsClassHashRestoreTarget({ id: 't1' }), '', '기록된 주인이 다른 사용자 → 복원 안 함');
});

test('로그아웃은 해시·주인 기록·열린 반·화면 기록을 모두 지운다', () => {
    const env = makeEnv({ hash: '#class=c1', owner: 't1' });
    env.state.ui.currentClassId = 'c1';
    env.app.currentView = { type: 'classDetail', classId: 'c1' };
    env.ctx.apmsClassHashForget();
    assert.equal(env.location.hash, '');
    assert.equal(env.store.APMS_CLASS_HASH_OWNER, undefined);
    assert.equal(env.state.ui.currentClassId, null);
    assert.equal(env.app.currentView, null);
    // 로그아웃 뒤 걷어 낸 낡은 이력 칸의 해시도(주인 기록 없음) 로그인 화면에서 지워진다
    const env2 = makeEnv({ hash: '#class=c1', loginVisible: true });
    env2.ctx.apmsClassHashApply();
    assert.equal(env2.location.hash, '');
    // 세션 만료(주인 기록 있음)면 로그인 화면에서도 해시를 둔다
    const env3 = makeEnv({ hash: '#class=c1', loginVisible: true, owner: 't1' });
    env3.ctx.apmsClassHashApply();
    assert.equal(env3.location.hash, '#class=c1');
});

test('복원은 화면 이력에 대시보드를 먼저 남기고 반 화면을 연다', () => {
    const env = makeEnv({ hash: '#class=c1' });
    env.ctx.apmsClassHashRestore('c1');
    assert.deepEqual(env.rendered, ['c1']);
    assert.equal(env.app.currentView.type, 'classDetail');
    const env2 = makeEnv({ hash: '#class=c1' });
    env2.ctx.apmsClassHashRestore('c1');
    // 반 화면을 그리기 직전 현재 화면이 대시보드로 잡혀 있어야 이동 감싸기가 대시보드를 backStack에 넣는다
    assert.ok(/appHistoryState\.currentView = appHistoryBuildView\('renderDashboard'\)[\s\S]*window\.renderClass\(id\)/.test(section), '대시보드를 먼저 현재 화면으로 둔다');
});

test('연결: 보호 항목은 해시를 유지하고, hashchange를 듣지 않으며, 로그아웃·loadData가 N4를 부른다', () => {
    assert.ok(/pushState\(\{ apmsGuard: true \}, '', window\.location\.href\)/.test(ui), '보호 항목 pushState는 해시를 포함한 현재 주소');
    assert.ok(!/addEventListener\(\s*['"]hashchange['"]/.test(ui), 'hashchange 이중 처리 없음');
    assert.ok(/appHistoryState\.currentView = nextView;\s*apmsClassHashApply\(\);/.test(ui), '화면이 바뀔 때마다 해시를 맞춘다');
    assert.ok(/apmsClassHashApply\(\); \/\/ 걷어 낸 자리/.test(ui) && /apmsClassHashApply\(\);\s*apmsNavSync\(\);\s*\}/.test(ui), 'popstate 끝에서 해시를 현재 화면에 맞춘다');
    assert.ok(/if \(apmsNavGuard\.holdBoot\) return;/.test(ui), '복원 판단 중에는 보호 항목을 걷지 않는다');
    assert.ok(/state\.ui\.currentClassId = null; \/\/ 로그인 화면/.test(ui), '로그인 화면에서 열린 반을 버린다');
    const logoutFn = core.slice(core.indexOf('async function logout()'), core.indexOf('async function loadData'));
    assert.ok(logoutFn.includes('apmsClassHashForget()') && logoutFn.indexOf('apmsClassHashForget()') < logoutFn.indexOf('renderLogin()'), 'logout이 renderLogin 전에 해시·열린 반을 지운다');
    const loadFn = core.slice(core.indexOf('async function loadData'), core.indexOf('async function refreshDataOnly'));
    assert.ok(loadFn.includes('apmsClassHashNoteLoad(session)') && loadFn.includes('apmsClassHashRestoreTarget(session)') && loadFn.includes('apmsClassHashRestore(restoreClassId)'));
    assert.ok(/isInitial && !state\.ui\.currentClassId/.test(loadFn), '복원은 부팅·로그인 직후(isInitial)에만: 홈 이동 뒤 낡은 해시로 다시 열리지 않는다');
});

test('카드 제목과 스크립트 버전', () => {
    assert.ok(read('apmath/js/dashboard.js').includes('>반 관리</h3>') && read('apmath/js/dashboard-teacher.js').includes('>반 관리</h3>'));
    assert.ok(!/>학급관리<\/h3>/.test(read('apmath/js/dashboard.js') + read('apmath/js/dashboard-teacher.js')));
    assert.match(index, /js\/core\.js\?v=20261105-offline-sync-1/);
    assert.match(index, /js\/dashboard\.js\?v=20261105-offline-sync-1/);
    assert.match(index, /js\/student\.js\?v=20261105-offline-sync-1/);
    assert.match(index, /app\.js\?v=20261105-offline-sync-1/);
    for (const f of ['ui.js', 'dashboard-teacher.js']) {
        assert.ok(new RegExp(`js/${f.replace('.', '\\.')}\\?v=20261102-(nav-hash|cleanup|perf)-\\d`).test(index), `${f} ?v= 올림`);
    }
});
