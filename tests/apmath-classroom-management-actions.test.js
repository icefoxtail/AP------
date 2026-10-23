const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const classroom = fs.readFileSync(path.join(root,'apmath/js/classroom.js'),'utf8');
const management = fs.readFileSync(path.join(root,'apmath/js/management.js'),'utf8');
const timetable = fs.readFileSync(path.join(root,'apmath/js/timetable.js'),'utf8');
const css = fs.readFileSync(path.join(root,'apmath/css/classroom-foundation.css'),'utf8');

function context() {
    const ctx = { console, window: {}, state: {
        auth: {role: 'admin'}, ui: {currentClassId: 'c1'},
        db: { classes: [{id:'c1',name:'중1 A',is_active:1},{id:'c2',name:'중2 B',is_active:1}] }
    }, toast(){}, document:{} };
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
    const ctx={state:{ui:{classroomTimetableReturnClassId:'c1'},db:{classes:[{id:'c1',is_active:1}]}},
        renderClass(id){this.visited=id;}, leaveTimetableWideMode(){this.left=true;},
        canCurrentUserAccessClass(){return true;},toast(){}};
    vm.createContext(ctx);vm.runInContext(timetable.slice(start,end),ctx);
    assert.equal(ctx.returnToClassroomFromTimetable(),true);
    assert.equal(ctx.visited,'c1');
    assert.equal(ctx.left,true);
    assert.equal(ctx.state.ui.classroomTimetableReturnClassId,'');
    assert.match(timetable,/onclick="returnToClassroomFromTimetable\(\)"/);
});

test('mobile management controls remain usable as two 44px touch columns', () => {
    assert.match(css,/\.ap-classroom-management-actions\s*\{/);
    assert.match(css,/@media \(max-width: 760px\)[\s\S]*?\.ap-classroom-management-action\s*\{\s*min-height: 44px/);
});
