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

test('M4 re-enrollment opens inline in the withdrawal report instead of replacing the modal, same save and payload', () => {
    const restore = stripComments(read('apmath/js/ws-student-restore.js'));
    assert.doesNotMatch(restore, /showModal\(|showModalStep\(|closeModal\(/, 'inline form never swaps or closes the modal');
    for (const id of ['restore-class', 'restore-date']) {
        assert.ok(restore.includes(`id="${id}"`) && restore.includes(`for="${id}"`), id + ' has a label');
    }
    assert.match(restore, /data-student-reenrollment=/);
    assert.match(restore, /handleRestore\.confirm\(/);
    const edit = read('apmath/js/student-edit.js');
    assert.match(slice(edit, 'async function handleRestore(sid)', 'handleRestore.confirm = async'), /wsRestoreIsReportOpen\(\) && wsRestoreToggleInline\(sid\)/);
    // 저장 payload·API는 그대로
    assert.match(edit, /api\.patch\(`students\/\$\{sid\}\/restore`, \{\s*class_id: classId,\s*reenrollment_date: reenrollmentDate\s*\}\)/);
    // 목록 안 폼의 저장 성공은 모달을 닫았다 여는 대신 같은 목록을 다시 그린다
    assert.match(slice(edit, 'handleRestore.confirm = async', 'function sortClassesForStudentModal('), /if \(inlineSave && typeof wsRestoreAfterSave === 'function'\)/);
    assert.match(index, /js\/ws-student-restore\.js/);
});

// ------------------------------------------------------------ M6 학생 상세 · 상담 탭
const student = read('apmath/js/student.js');
const consult = read('apmath/js/ws-student-consult.js');

test('M6 consultation tab: inline form never opens a modal or closes the detail', () => {
    const code = stripComments(consult);
    assert.doesNotMatch(code, /showModal\(|showModalStep\(|replaceModalStep\(|closeModal\(/, 'no modal calls in the inline consultation module');
    // 열기 함수는 학생 상세가 열려 있으면 인라인으로 가고, 아니면(반 화면에서 직접 호출) 옛 단일 모달 폼으로 간다
    assert.match(slice(student, 'function openAddConsultationModal(sid)', 'const _consultSaveInFlight'), /wsConsultOpenInline\('add', sid\)\) return;[\s\S]*showStudentDetailSubModalStep\('consultation-add'/);
    assert.match(slice(student, 'function openEditConsultation(cid, sid)', 'async function handleEditConsultation('), /wsConsultOpenInline\('edit', sid, cid\)\) return;/);
});

test('M6 consultation save paths: inline success does not close the detail or refetch; payloads and dedupe unchanged', () => {
    const save = slice(student, 'async function handleSaveConsultation(sid)', 'async function generateConsultationAiSummary(');
    assert.match(save, /api\.post\('consultations', \{ studentId: sid, date, type, content, nextAction, clientRequestId \}\)/);
    assert.match(save, /_consultSaveInFlight\.has\(guardKey\)/);
    assert.match(save, /clientRequestId = \(typeof crypto/);
    const inlineBranch = slice(save, 'if (inline) {', 'closeModal(true);');
    assert.doesNotMatch(inlineBranch, /closeModal|ensureStudentConsultationsLoaded|renderStudentDetailTab\(/);
    assert.match(inlineBranch, /wsConsultAfterSave\(sid, 'add'/);
    const edit = slice(student, 'async function handleEditConsultation(cid, sid)', 'async function handleDeleteConsultation(');
    assert.match(edit, /api\.patch\(`consultations\/\$\{cid\}`, \{ date, type, content, nextAction \}\)/);
    assert.match(edit, /_consultSaveInFlight\.has\(cid\)/);
    assert.doesNotMatch(slice(edit, 'if (inline) {', 'closeModal(true);'), /closeModal|ensureStudentConsultationsLoaded/);
    const del = slice(student, 'async function handleDeleteConsultation(', 'async function handleDeleteSession(');
    assert.match(del, /api\.delete\('consultations', cid\)/);
    assert.match(del, /wsConsultRemoveRow\(sid, cid\);\s*\} else \{\s*await ensureStudentConsultationsLoaded/, 'delete updates local state; refetch only as fallback');
});

test('M6 consultation inline form: every field labelled, AI panel and hooks present', () => {
    const form = slice(consult, 'function wsConsultFormHtml(', 'function wsConsultRefreshHost(');
    const ids = [...form.matchAll(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"/g)].map(m => m[1]);
    assert.ok(ids.length >= 5);
    for (const id of ids) assert.ok(form.includes(`for="${id}"`), 'label for ' + id);
    assert.match(form, /consultation-ai-panel-wrap/);
    assert.match(student, /wsConsultFormHtml\(key\)/);
    assert.match(student, /wsConsultThreadHtml\(key\)/);
    assert.match(slice(student, 'function renderStudentDetailTab(', 'function renderStudentDetailTabInPlace('), /wsConsultGuardLeave/);
    assert.match(index, /js\/ws-student-consult\.js/);
});

test('M6 consultation edit/delete controls are real buttons (touch target), not clickable text', () => {
    for (const fn of ['renderStudentPinnedConsultationPreviewHtml', 'apStudentConsultationCardHtml']) {
        const body = slice(student, 'function ' + fn + '(', '\nfunction ');
        assert.match(body, /<button type="button" class="ws-link-btn" onclick="openEditConsultation/);
        assert.doesNotMatch(body, /<span[^>]*onclick="(?:openEditConsultation|handleDeleteConsultation)/);
    }
    assert.match(read('apmath/css/ws-student.css'), /\.ws-link-btn \{[^}]*min-height: 44px/);
});

// ------------------------------------------------------------ M6 학생 상세 · 이력
test('M6 history: status/transfer history are inline details, not modal steps', () => {
    const history = read('apmath/js/ws-student-history.js');
    assert.doesNotMatch(stripComments(history), /showModal\(|showModalStep\(|replaceModalStep\(|closeModal\(/);
    const section = slice(student, 'function renderStudentOperationHistorySection(', 'function openStudentPortalPreview(');
    assert.doesNotMatch(section, /openStudentStatusHistoryModal|openStudentClassTransferHistoryModal/, 'section no longer opens history modals');
    assert.match(section, /wsHistoryHtml\(sid\)/);
    // 옛 열기 함수는 이력 구역이 화면에 있으면 그 자리를 펼치고, 없을 때만 옛 모달로 간다(얇은 래퍼 규칙)
    assert.match(slice(student, 'async function openStudentStatusHistoryModal(', 'async function openStudentClassTransferHistoryModal('), /wsHistoryOpenInline\('status', sid\)\) return;/);
    assert.match(slice(student, 'async function openStudentClassTransferHistoryModal(', 'async function ensureStudentParentContactDataLoaded('), /wsHistoryOpenInline\('transfer', sid\)\) return;/);
    assert.match(index, /js\/ws-student-history\.js/);
    assert.match(read('apmath/css/ws-student.css'), /\.ws-history > summary \{[^}]*min-height: 44px/);
});
