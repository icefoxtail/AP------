// M4 반 관리 · M6 학생 상세 작업 화면 — 결함 조건 검사.
// 정확한 개수가 아니라 결함(저장 뒤 전체 재조회, 모달 연쇄, 라벨 없는 입력, payload 변경, dirty 확인 누락)이 없는지 본다.
// 화면 동작은 tests/ws-student-browser.cjs(실제 Chrome)가 본다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const management = read('apmath/js/management.js');
const wsClass = read('apmath/js/ws-student-class.js');
const index = read('apmath/index.html');
const slice = (src, begin, end) => {
    const i = src.indexOf(begin), j = end ? src.indexOf(end, i + begin.length) : src.length;
    assert.ok(i >= 0 && j > i, 'function boundary: ' + begin);
    return src.slice(i, j);
};
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

test('ws-student files are loaded after student-edit.js, css after the shared modal css', () => {
    assert.ok(index.indexOf('js/student-edit.js') < index.indexOf('js/ws-student-class.js'));
    assert.ok(index.indexOf('apms-unified-modal.css') < index.indexOf('css/ws-student.css'));
});

test('M4 class workspace: no modal stacking and one modal shell', () => {
    const code = stripComments(wsClass);
    assert.doesNotMatch(code, /showModalStep|replaceModalStep/);
    assert.equal((code.match(/\bshowModal\(/g) || []).length, 1, 'only the workspace shell opens a modal');
    // 반 관리 안에서 모달을 다시 여는 호출이 없다(저장 뒤 목록 모달 재오픈 금지)
    assert.doesNotMatch(code, /openClassManageModal\(/);
});

test('M4 class save paths do not reload everything or reopen the list modal', () => {
    for (const [begin, end] of [
        ['async function handleEditClass(', 'async function toggleClassActive('],
        ['async function toggleClassActive(', 'async function handleDeleteClass('],
        ['async function handleDeleteClass(', 'function getBillingAccountingFoundationState(']
    ]) {
        const body = stripComments(slice(management, begin, end));
        assert.doesNotMatch(body, /loadData\(/, begin + ' must not call loadData');
        assert.doesNotMatch(body, /openClassManageModal\(/, begin + ' must not reopen the list modal');
        assert.match(body, /classMutationInFlight/, begin + ' guards double submit');
    }
    // 추가는 서버가 돌려주는 행이 없을 때만 전체 조회로 되돌아간다.
    const add = stripComments(slice(management, 'async function handleAddClass(', 'async function handleEditClass('));
    assert.match(add, /if \(row\) \{ wsClassAfterMutation\('add', row\); return; \}\s*await loadData\(\);/);
    assert.equal((add.match(/loadData\(/g) || []).length, 1);
    assert.match(add, /classMutationInFlight/);
});

test('M4 class payload fields and API paths are unchanged', () => {
    assert.match(management, /const payload = \{ name, grade, subject, teacher_name, schedule_days, is_active: 1, time_label \};/);
    assert.match(management, /const payload = \{ name, grade, subject, teacher_name, schedule_days, time_label \};/);
    assert.match(management, /const payload = \{ name: c\.name, grade: c\.grade, subject: c\.subject, teacher_name: c\.teacher_name, schedule_days: c\.schedule_days, is_active: status, time_label: c\.time_label \|\| '' \};/);
    assert.match(management, /api\.post\('classes', payload\)/);
    assert.match(management, /api\.patch\(`classes\/\$\{cid\}`, payload\)/);
    assert.match(management, /api\.delete\('classes', classId\)/);
});

test('M4 class form: every input has a label and mobile touch targets are sized in css', () => {
    const form = slice(wsClass, 'function wsClassFormHtml(', 'function wsClassFormValues(');
    const ids = [...form.matchAll(/<(?:input|select)\s+id="([^"]+)"/g)].map(m => m[1]);
    assert.ok(ids.length >= 6);
    for (const id of ids) assert.ok(form.includes(`for="${id}"`), 'label for ' + id);
    const css = read('apmath/css/ws-student.css');
    assert.match(css, /\.ws-class__days \.apms-unified-day \{[^}]*min-height: 44px/);
    assert.doesNotMatch(css, /font-size:\s*(?:[0-9]|10|11)(?:\.\d+)?px/, 'no text under 12px in ws-student.css');
});

test('M4 class workspace has dirty confirmation and a single cancel (header only)', () => {
    assert.match(wsClass, /setModalDirtyChecker\(wsClassIsDirty\)/);
    assert.match(wsClass, /function wsClassConfirmLeave\(\)[\s\S]*window\.confirm/);
    assert.match(wsClass, /wsClassSelect\(cid\)[\s\S]*wsClassConfirmLeave\(\)/);
    const actions = slice(wsClass, 'function wsClassActionsHtml(', 'function wsClassRenderDetail(');
    assert.doesNotMatch(actions, />\s*취소\s*</, 'the bottom action row has no second 취소 next to the header one');
});

test('M4 wsClassApplyRow mirrors server visibility (teacher cannot see classes of other teachers) and timetable list', () => {
    const ctx = {
        console, window: {},
        state: { auth: { role: 'teacher' }, ui: { userName: '김선생' }, db: { classes: [{ id: 'c1', name: 'A', teacher_name: '김선생', is_active: 1 }], timetable_classes: [{ id: 'c1', name: 'A', is_active: 1 }] } },
        isClassVisibleForCurrentTeacher: c => String(c.teacher_name || '') === '김선생'
    };
    vm.createContext(ctx);
    vm.runInContext(slice(wsClass, 'function wsClassFind(', 'function wsClassRoot(') + slice(wsClass, 'function wsClassSyncTimetableClass(', '// 저장 성공 뒤 이 화면을'), ctx);
    assert.equal(ctx.wsClassApplyRow({ id: 'c2', name: 'B', teacher_name: '박선생', is_active: 1 }), false);
    assert.equal(ctx.state.db.classes.length, 1, 'class of another teacher is not listed');
    assert.equal(ctx.wsClassApplyRow({ id: 'c3', name: 'C', teacher_name: '김선생', is_active: 1 }), true);
    assert.equal(ctx.state.db.classes.length, 2);
    assert.equal(ctx.state.db.timetable_classes.length, 2);
    assert.equal(ctx.wsClassApplyRow({ id: 'c3', is_active: 0 }), true);
    assert.equal(ctx.state.db.classes.find(c => c.id === 'c3').name, 'C', 'partial row keeps existing fields');
    assert.equal(ctx.state.db.timetable_classes.length, 1, 'hidden class leaves the timetable list');
});
