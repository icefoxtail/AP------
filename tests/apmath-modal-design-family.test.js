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
test('class add/edit use same modal family and retain save handlers, field IDs and return view', () => {
    const add = func(management, 'function openAddClassModal()', 'async function handleAddClass()');
    const edit = func(management, 'function openEditClassModal(', 'async function handleEditClass(');
    for (const s of [add, edit]) {
        assert.match(s, /apms-unified-modal apms-unified-form/);
        assert.match(s, /apms-unified-context/);
        assert.match(s, /apms-unified-control/);
        assert.match(s, /apms-unified-day/);
    }
    assert.match(add, /'추가', handleAddClass/);
    assert.match(edit, /'저장', \(\) => handleEditClass\(cid, returnTo\)/);
    for (const field of ['name','grade','subject','teacher','period','timelabel']) {
        assert.match(add, new RegExp('id="add-cls-'+field+'"'));
        assert.match(edit, new RegExp('id="edit-cls-'+field+'"'));
    }
});
test('homework modal adopts progress-like context and footer while preserving save and list actions', () => {
    const s=func(classroom,'function openHomeworkPhotoAssignmentModal(','async function handleCreateHomeworkPhotoAssignment(');
    assert.match(s,/apms-unified-modal apms-unified-form/);
    assert.match(s,/apms-unified-actions/);
    assert.match(s,/apms-unified-context/);
    for (const id of ['hw-photo-title','hw-photo-desc','hw-photo-date','hw-photo-time'])
        assert.match(s,new RegExp('id="'+id+'"'));
    assert.match(s,/handleCreateHomeworkPhotoAssignment/);
    assert.match(s,/openHomeworkPhotoAssignmentList/);
});
test('QR generator adopts same modal family without changing input IDs or generation entry', () => {
    const s=func(qr,'function openQrGenerator(cid) {','function shareQrUrl(');
    assert.match(s,/apms-unified-modal apms-unified-form apms-unified-qr/);
    assert.match(s,/apms-unified-context/);
    for(const id of ['qr-exam','qr-q','qr-date','qr-archiveFile','qr-result-area','qr-img','qr-url'])
        assert.match(s,new RegExp('id="'+id+'"'));
});
test('progress modal remains untouched; responsive and dark mode depend on existing theme tokens', () => {
    assert.match(classroom,/ap-class-progress-modal/);
    assert.match(css,/@media \(max-width: 600px\)/);
    assert.match(css,/var\(--surface\)/);
    assert.match(css,/var\(--text\)/);
    assert.doesNotMatch(css,/\.ap-class-progress-modal\s*\{/);
});
