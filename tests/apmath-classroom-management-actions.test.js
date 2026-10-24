const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const classroom = fs.readFileSync(path.join(root,'apmath/js/classroom.js'),'utf8');
const management = fs.readFileSync(path.join(root,'apmath/js/management.js'),'utf8');
const timetable = fs.readFileSync(path.join(root,'apmath/js/timetable.js'),'utf8');
const student = fs.readFileSync(path.join(root,'apmath/js/student.js'),'utf8');
const studentEdit = fs.readFileSync(path.join(root,'apmath/js/student-edit.js'),'utf8');
const css = fs.readFileSync(path.join(root,'apmath/css/classroom-foundation.css'),'utf8');

function context() {
    const ctx = { console, window: {}, state: {
        auth: {role: 'admin'}, ui: {currentClassId: 'c1'},
        db: { classes: [{id:'c1',name:'중1 A',is_active:1},{id:'c2',name:'중2 B',is_active:1}] }
    }, toast(){}, document:{}, apEscapeHtml(value) { return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); } };
    vm.createContext(ctx);
    vm.runInContext(classroom, ctx);
    ctx.getClassroomSwitchableClasses = () => ctx.state.db.classes;
    return ctx;
}

test('classroom renders scoped management actions alongside existing operating tools', () => {
    const ctx=context();
    const html=ctx.renderClassroomManagementToolbar('c1');
    for (const label of ['반 설정','학생 추가','학생 이동','시간표']) assert.ok(html.includes(label));
    assert.match(classroom,/renderClassroomManagementToolbar\(cid\)/);
    assert.match(html,/openClassroomManagementAction/);
});

test('classroom routes edit, add and timetable through existing entrypoints with class context', () => {
    const ctx=context(), calls=[];
    ctx.setManagementReturnView=v=>calls.push(['management',v.classId]);
    ctx.setModalReturnView=v=>calls.push(['modal',v.classId]);
    ctx.openEditClassModal=(id,o)=>calls.push(['edit',id,o.returnTo.classId]);
    ctx.openAddStudent=(id,o)=>calls.push(['add',id,o.returnTo.classId]);
    ctx.openLiveTimetable=()=>calls.push(['timetable']);
    assert.equal(ctx.openClassroomManagementAction('c1','edit'),true);
    assert.equal(ctx.openClassroomManagementAction('c1','addStudent'),true);
    assert.equal(ctx.openClassroomManagementAction('c1','timetable'),true);
    assert.equal(ctx.openClassroomManagementAction('c2','edit'),false);
    assert.equal(ctx.state.ui.classroomTimetableReturnClassId,'c1');
    assert.deepEqual(calls.filter(x=>['edit','add','timetable'].includes(x[0])),[
        ['edit','c1','c1'],['add','c1','c1'],['timetable']
    ]);
});

test('move student picker never writes class assignment directly and opens existing student editor', () => {
    const ctx=context();ctx.state.db.students=[{id:'s1',name:'홍길동'}];
    ctx.getClassroomActiveStudents=()=>ctx.state.db.students;
    ctx.setManagementReturnView=()=>{};
    ctx.setModalReturnView=()=>{};
    let html='';
    ctx.showModal=(_title,body)=>{html=body;};
    ctx.openEditStudent=()=>{};
    assert.equal(ctx.openClassroomManagementAction('c1','moveStudent'),true);
    assert.match(html,/홍길동/);
    assert.match(html,/openEditStudent/);
    assert.doesNotMatch(html,/enrollments\/transfer|api\.post|students\/s1/);
});

test('existing edit class save keeps the originating classroom return, without modifying class API payload', () => {
    assert.match(management,/function openEditClassModal\(cid, options = \{\}\)/);
    assert.match(management,/handleEditClass\(cid, returnTo\)/);
    assert.match(management,/api\.patch\(`classes\/\$\{cid\}`, payload\)/);
    assert.match(management,/returnTo\?\.type === 'classDetail'/);
    assert.match(management,/closeModal\(true\)/);
});

test('timetable return action restores the class and leaves timetable wide mode', () => {
    const start=timetable.indexOf('function returnToClassroomFromTimetable()');
    const end=timetable.indexOf('function renderTimetable()',start);
    assert.ok(start>0&&end>start);
    const effects = {};
    const ctx={state:{ui:{classroomTimetableReturnClassId:'c1'},db:{classes:[{id:'c1',is_active:1}]}},
        renderClass(id){effects.visited=id;}, leaveTimetableWideMode(){effects.left=true;},
        isClassroomClassAccessible(){return true;}, canCurrentUserAccessClass(){return true;},toast(){}};
    vm.createContext(ctx);vm.runInContext(timetable.slice(start,end),ctx);
    assert.equal(ctx.returnToClassroomFromTimetable(),true);
    assert.equal(effects.visited,'c1');
    assert.equal(effects.left,true);
    assert.equal(ctx.state.ui.classroomTimetableReturnClassId,'');
    assert.match(timetable,/onclick="returnToClassroomFromTimetable\(\)"/);
});

test('timetable return refuses a class that is no longer accessible', () => {
    const start=timetable.indexOf('function returnToClassroomFromTimetable()');
    const end=timetable.indexOf('function renderTimetable()',start);
    const effects = {};
    const ctx={state:{ui:{classroomTimetableReturnClassId:'c1'},db:{classes:[{id:'c1',is_active:1}]}},
        renderClass(){effects.rendered=true;}, leaveTimetableWideMode(){effects.left=true;},
        isClassroomClassAccessible(){return false;},toast(message){effects.message=message;}};
    vm.createContext(ctx);vm.runInContext(timetable.slice(start,end),ctx);
    assert.equal(ctx.returnToClassroomFromTimetable(),false);
    assert.equal(ctx.state.ui.classroomTimetableReturnClassId,'');
    assert.equal(effects.left,undefined);
    assert.equal(effects.rendered,undefined);
    assert.equal(effects.message,'현재 반으로 복귀할 수 없습니다.');
});

test('student class change refreshes the originating classroom roster before the student detail is reopened', async () => {
    const calls = [];
    const studentId = 's1';
    const appState = {
        ui: { currentClassId: 'c1', currentStudentDetailId: studentId, currentStudentDetailMode: 'edit', currentStudentDetailReturnTo: { type: 'classDetail', classId: 'c1' } },
        db: {
            students: [{ id: studentId, name: '홍길동', grade: '중1', status: '재원' }],
            class_students: [{ student_id: studentId, class_id: 'c1' }]
        }
    };
    const ctx = {
        console,
        state: appState,
        document: {
            getElementById(id) {
                if (id === 'modal-overlay') return { classList: { contains: name => name === 'show' } };
                const values = {
                    'edit-student-pin': '', 'edit-class': 'c2', 'edit-grade': '중2',
                    'edit-is-new': false, 'edit-is-leave': false, 'edit-already-attending': false,
                    'edit-onboarding-started-at': '', 'edit-student-phone': '', 'edit-parent-phone': '',
                    'edit-guardian-rel': '', 'edit-student-address': '', 'edit-vehicle-info': ''
                };
                if (!(id in values)) return null;
                const value = values[id];
                return typeof value === 'boolean' ? { checked: value } : { value };
            },
            querySelectorAll() { return []; }
        },
        api: { async patch() { return { success: true, student: { id: studentId }, student_enrollments: [], class_student: { student_id: studentId, class_id: 'c2' } }; } },
        getStudentProfileEditStudent() { return appState.db.students[0]; },
        getStudentProfileEditClassMapping() { return appState.db.class_students[0]; },
        isStudentNewMember() { return false; },
        normalizeStudentStatus(value) { return value; },
        normalizeStudentDetailTab(value) { return value; },
        normalizeOnboardingDate(value) { return value; },
        getStudentOnboardingStartedAt() { return ''; },
        getOnboardingStartDateInputId(prefix) { return `${prefix}-onboarding-started-at`; },
        collectHighSubjectExclusions() { return []; },
        isHighSubjectGrade() { return false; },
        mergeStudentEnrollmentRowsAfterEdit() {},
        mergeStudentCreateResponseIntoState(response) {
            appState.db.class_students = [response.class_student];
            return response.student;
        },
        async refreshDataOnly() { calls.push('refresh-data'); },
        renderClass(classId) { calls.push(`render:${classId}:${appState.db.class_students[0].class_id}`); },
        async openStudentDetail() { calls.push('reopen-student'); appState.ui.currentStudentDetailMode = 'view'; },
        toast() {}
    };
    vm.createContext(ctx);
    const listRefreshStart = student.indexOf('function refreshCurrentStudentListViewAfterMutation(');
    const listRefreshEnd = student.indexOf('function apmsStudentDetailEsc(', listRefreshStart);
    const editStart = studentEdit.indexOf('let editStudentSubmitting = false;');
    const editEnd = studentEdit.indexOf('function openAddStudent(', editStart);
    assert.ok(listRefreshStart >= 0 && listRefreshEnd > listRefreshStart);
    assert.ok(editStart >= 0 && editEnd > editStart);
    vm.runInContext(student.slice(listRefreshStart, listRefreshEnd) + studentEdit.slice(editStart, editEnd), ctx);

    await ctx.handleEditStudent(studentId);
    assert.deepEqual(calls, ['refresh-data', 'render:c1:c2', 'reopen-student']);
});

test('mobile management controls remain usable as two 44px touch columns', () => {
    assert.match(css,/\.ap-classroom-management-actions\s*\{/);
    assert.match(css,/@media \(max-width: 760px\)[\s\S]*?\.ap-classroom-management-action\s*\{\s*min-height: 44px/);
});
