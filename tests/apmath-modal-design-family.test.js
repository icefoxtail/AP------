const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const index = read('apmath/index.html');
const management = read('apmath/js/management.js');
const classroom = read('apmath/js/classroom.js');
const qr = read('apmath/js/qr-omr.js');
const css = read('apmath/css/apms-unified-modal.css');
const func = (src, begin, end) => {
    const i = src.indexOf(begin), j = src.indexOf(end, i + begin.length);
    assert.ok(i >= 0 && j > i, 'function boundary');
    return src.slice(i, j);
};
test('APMS modal skin loads after classroom base and is opt-in only', () => {
    assert.ok(index.includes('apms-unified-modal.css'));
    assert.ok(index.indexOf('classroom-foundation.css') < index.indexOf('apms-unified-modal.css'));
    assert.match(css, /#modal-content:has\(\.apms-unified-modal\)/);
    assert.doesNotMatch(css, /^#modal-content\s*\{/m);
    assert.doesNotMatch(css, /^body\s*\{/m);
});
// 2026-11-02 사용자 결정(M4): 반 추가·수정 F 모달은 반 관리 작업 화면(W) 안으로 들어왔다(ws-student-class.js).
// 그래서 예전 기대(F 모달 함수 본문에 통합 양식 클래스·헤더/액션줄 저장 버튼)를 새 폼 빌더와 작업 화면 껍데기로 옮겼다.
// 지키는 것은 그대로다: 입력 ID(add-cls-*, edit-cls-*), 저장 함수(handleAddClass, handleEditClass(cid, returnTo)),
// 돌아갈 화면(classDetail), 하단 오른쪽 액션줄의 저장 버튼.
const wsClassSource = read('apmath/js/ws-student-class.js');
test('class add/edit forms live in the W workspace and retain save handlers, field IDs and return view', () => {
    const form = func(wsClassSource, 'function wsClassFormHtml(', 'function wsClassFormValues(');
    assert.match(form, /apms-unified-form/);
    assert.match(form, /apms-unified-control/);
    assert.match(form, /apms-unified-day/);
    assert.match(form, /apms-unified-label/);
    for (const field of ['name','grade','subject','teacher','period','timelabel']) {
        assert.match(form, new RegExp('id="\\$\\{p\\}-cls-' + field + '"'));
    }
    assert.match(form, /const p = mode === 'edit' \? 'edit' : 'add'/);
    assert.match(form, /class="\$\{p\}-cls-days"/);
    const open = wsClassSource.slice(wsClassSource.indexOf('function openClassManageWorkspace('));
    assert.match(open, /apms-modal apms-modal--workspace/);
    assert.match(open, /apms-modal__actions/);
    assert.match(open, /setModalDirtyChecker\(wsClassIsDirty\)/);
    const actions = func(wsClassSource, 'function wsClassActionsHtml(', 'function wsClassRenderDetail(');
    assert.match(actions, /apms-modal__actions|wsClassSave\(\)">추가<\/button>/);
    assert.match(actions, /wsClassSave\(\)">저장<\/button>/);
    const save = func(wsClassSource, 'function wsClassSave(', 'function wsClassOpenClassroom(');
    assert.match(save, /handleAddClass\(\)/);
    assert.match(save, /handleEditClass\(wsClass\.selectedId, wsClass\.returnTo/);
    // 옛 열기 함수는 얇은 래퍼로 남는다. 반 화면 "반 설정"의 돌아갈 화면 계약(classDetail)은 래퍼가 지킨다.
    const edit = func(management, 'function openEditClassModal(', 'let classMutationInFlight');
    assert.match(edit, /type: 'classDetail'/);
    assert.match(edit, /openClassManageWorkspace\(\{ selectId: cid, returnTo \}\)/);
    assert.match(func(management, 'function openAddClassModal()', 'function openEditClassModal('), /openClassManageWorkspace\(\{ mode: 'add' \}\)/);
    assert.doesNotMatch(management, /`,\s*'추가'/);
});
test('homework modal adopts progress-like context and footer while preserving save and list actions', () => {
    const s=func(classroom,'function openHomeworkPhotoAssignmentModal(','async function handleCreateHomeworkPhotoAssignment(');
    assert.match(s,/apms-modal apms-modal--form apms-unified-modal apms-unified-form/);
    assert.match(s,/apms-unified-actions/);
    assert.match(s,/apms-unified-context/);
    for (const id of ['hw-photo-title','hw-photo-desc','hw-photo-date','hw-photo-time'])
        assert.match(s,new RegExp('id="'+id+'"'));
    assert.match(s,/handleCreateHomeworkPhotoAssignment/);
    assert.match(s,/openHomeworkPhotoAssignmentList/);
});
test('QR generator adopts same modal family without changing input IDs or generation entry', () => {
    const s=func(qr,'function openQrGenerator(cid) {','function shareQrUrl(');
    assert.match(s,/apms-modal apms-modal--form apms-unified-modal apms-unified-form apms-unified-qr/);
    assert.match(s,/apms-modal__actions[\s\S]*generateQrCode\(\)/);
    assert.match(s,/apms-unified-context/);
    for(const id of ['qr-exam','qr-q','qr-date','qr-archiveFile','qr-result-area','qr-img','qr-url'])
        assert.match(s,new RegExp('id="'+id+'"'));
});
test('homework markup does not duplicate HTML class attributes', () => {
    const s = func(classroom, 'function openHomeworkPhotoAssignmentModal(', 'async function handleCreateHomeworkPhotoAssignment(');
    assert.doesNotMatch(s, /<button[^>]*\\bclass="[^"]+"\\s+class=/);
});
test('progress modal remains untouched; responsive and dark mode depend on existing theme tokens', () => {
    assert.match(classroom,/ap-class-progress-modal/);
    assert.match(css,/@media \(max-width: 600px\)/);
    assert.match(css,/var\(--surface\)/);
    assert.match(css,/var\(--text\)/);
    assert.doesNotMatch(css,/\.ap-class-progress-modal\s*\{/);
});
