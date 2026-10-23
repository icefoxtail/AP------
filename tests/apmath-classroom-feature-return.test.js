const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const classroom = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const planner = fs.readFileSync(path.join(root, 'apmath/js/classroom-planner.js'), 'utf8');
const qr = fs.readFileSync(path.join(root, 'apmath/js/qr-omr.js'), 'utf8');

function setup() {
    const ctx = {
        console, window: {}, toast() {},
        document: { getElementById() { return null; }, querySelector() { return null; } },
        state: { ui: { currentClassId: 'b', userName: 'teacher' },
            db: { classes: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }] } },
        canCurrentUserAccessClass(id) { return id !== 'a'; }
    };
    vm.createContext(ctx);
    vm.runInContext(classroom, ctx);
    return ctx;
}

test('classroom toolbar uses a single class-scoped entry for every feature', () => {
    for (const name of ['progress', 'homework', 'qr', 'exam', 'clinic', 'planner'])
        assert.match(classroom, new RegExp("openClassroomFeature\\('\\$\\{cid\\}', '"+name+"'\\)"));
});

test('classroom feature return context follows the selected class and rejects another class', () => {
    const ctx = setup(), calls = [], returns = [];
    ctx.setManagementReturnView = value => returns.push(['management', value.classId]);
    ctx.setModalReturnView = value => returns.push(['modal', value.classId]);
    for (const [feature,fn] of Object.entries({
        progress: 'openClassRecordModal', homework: 'openHomeworkPhotoAssignmentModal',
        qr: 'openQrGenerator', exam: 'openExamGradeView',
        clinic: 'openClinicCenter', planner: 'renderPlannerControl'
    })) ctx[fn] = id => calls.push([feature,id]);
    for (const feature of ['progress', 'homework', 'qr', 'exam', 'clinic', 'planner'])
        assert.equal(ctx.openClassroomFeature('b', feature), true);
    assert.deepEqual(calls, ['progress', 'homework', 'qr', 'exam', 'clinic', 'planner'].map(f => [f,'b']));
    assert.deepEqual(returns, Array.from({length:6}, () => [['management','b'],['modal','b']]).flat());
    assert.equal(ctx.openClassroomFeature('a','qr'), false);
    assert.equal(ctx.openClassroomFeature('b','missing'), false);
    assert.equal(calls.length, 6);
});

test('consultation keeps the original class as the student-detail return anchor', () => {
    const ctx=setup();
    let opened = '', original = null;
    ctx.setManagementReturnView = value => { original = value; };
    ctx.openAddConsultationModal = sid => { opened = sid; };
    ctx.requestAnimationFrame = callback => callback();
    ctx.openClassroomConsultation('s2', 'b', '2026-10-23');
    assert.equal(opened, 's2');
    assert.equal(original.classId, 'b');
    assert.equal(ctx.state.ui.currentStudentDetailReturnTo.classId, 'b');
});

test('app back honors class return context but leaves unrelated modal behavior unchanged', () => {
    const start=ui.indexOf('function appHistoryBack()');
    const end=ui.indexOf('function appHistoryWrapGlobal(',start);
    assert.ok(start>=0 && end>start);
    const calls=[];
    const ctx={
        modalStepStack:[], isModalOpen:()=>true,
        state:{ui:{modalReturnView:{type:'classDetail',classId:'b'}}},
        closeModal:s=>calls.push(s), updateAppBackButtons(){},
        window:{setTimeout(){}}
    };
    vm.runInNewContext(ui.slice(start,end)+'\nthis.go = appHistoryBack;',ctx);
    ctx.go();
    assert.deepEqual(calls,[false]);
    ctx.state.ui.modalReturnView={type:'dashboard'};
    ctx.go();
    assert.deepEqual(calls,[false,true]);
    ctx.state.ui.modalReturnView={type:'studentDetail',studentId:'s1'};
    ctx.state.ui.currentStudentDetailReturnTo={type:'classDetail',classId:'b'};
    ctx.go();
    assert.deepEqual(calls,[false,true,false]);
});

test('planner and QR attach explicit class return routes without changing their save APIs', () => {
    assert.match(planner,/setModalReturnView\(\{ type: 'classDetail', classId: String\(classId\) \}\)/);
    assert.match(planner,/returnToPreviousManagementView\('dashboard', \{ type: 'classDetail', classId:/);
    assert.match(qr,/function openQrGenerator\(cid\) \{[\s\S]*?setModalReturnView\(\{ type: 'classDetail', classId: String\(cid\) \}\)/);
});
