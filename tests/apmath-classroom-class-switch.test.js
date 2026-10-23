const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'apmath/css/classroom-foundation.css'), 'utf8');

function makeContext() {
    const classes = [
        { id: 'a', name: 'A반', grade: '중1', teacher_name: '김', is_active: 1 },
        { id: 'b', name: 'B반', grade: '중2', teacher_name: '김', is_active: 1 },
        { id: 'other', name: '타 교사 반', grade: '중3', teacher_name: '박', is_active: 1 },
        { id: 'hidden', name: '숨김 반', grade: '중1', teacher_name: '김', is_active: 0 }
    ];
    const state = {
        auth: { role: 'teacher', name: '김' },
        ui: { currentClassId: 'a', userName: '김', baseDate: '2026-10-20' },
        db: { classes, students: [], class_students: [], attendance: [], homework: [], consultations: [] }
    };
    const context = {
        console,
        state,
        window: {},
        document: { querySelector() { return null; }, getElementById() { return null; } },
        apEscapeHtml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); },
        getTeacherNameForUI() { return '김'; },
        isClassVisibleForCurrentTeacher(cls) { return cls.teacher_name === '김'; },
        canCurrentUserAccessClass(classId) { return classId !== 'other'; },
        sortClassesForDashboard(rows) { return [...rows]; },
        loadEnrollmentFoundation() { return Promise.resolve(); },
        requestAnimationFrame(callback) { callback(); },
        toast() {}
    };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'classroom.js' });
    return context;
}

test('only accessible active teacher classes appear in the persistent class tabs', () => {
    const ctx = makeContext();
    const html = ctx.renderClassroomSwitchTabs('a');
    assert.match(html, /A반|중1/);
    assert.match(html, /B반|중2/);
    assert.doesNotMatch(html, /타 교사 반|숨김 반/);
    assert.match(html, /data-class-id="a" aria-pressed="true"/);
    assert.match(html, /switchClassroomClass\('b'\)/);
    assert.equal(ctx.getClassroomSwitchableClasses('a').length, 2);
});

test('switching a class uses the classroom renderer without the dashboard or changing the date', () => {
    const ctx = makeContext();
    const calls = [];
    ctx.renderClass = (classId, options) => {
        calls.push({ classId, preserve: options?.preserveClassTabs });
        ctx.state.ui.currentClassId = classId;
    };
    assert.equal(ctx.switchClassroomClass('b'), true);
    assert.deepEqual(calls, [{ classId: 'b', preserve: true }]);
    assert.equal(ctx.state.ui.baseDate, '2026-10-20');
    assert.equal(ctx.switchClassroomClass('other'), false);
    assert.equal(ctx.switchClassroomClass('hidden'), false);
    assert.equal(ctx.switchClassroomClass('b'), false);
    assert.equal(calls.length, 1);
});

test('class switch updates only workspace and retains class strip DOM and horizontal position', () => {
    const ctx = makeContext();
    let htmlWrites = 0, workspaceWrites = 0, classId = 'a';
    const buttons = ['a', 'b'].map(id => ({
        id, pressed: null, selected: false,
        getAttribute(name) { return name === 'data-class-id' ? this.id : null; },
        setAttribute(name, v) { if (name === 'aria-pressed') this.pressed = v; },
        classList: { toggle(name, selected) { /* class tab metadata only */ } }
    }));
    const tabs = { scrollLeft: 87, querySelectorAll() { return buttons; } };
    const workspace = { set innerHTML(v) { workspaceWrites++; this.html = v; } };
    const shell = {
        setAttribute(name, value) { if (name === 'data-class-id') classId = value; },
        querySelector(selector) {
            return selector === '.ap-classroom-class-tabs' ? tabs
                : selector === '.ap-classroom-workspace' ? workspace : null;
        }
    };
    const appRoot = {
        set innerHTML(value) { htmlWrites++; this.html = value; },
        querySelector(selector) { return selector === '.ap-classroom-shell' ? shell : null; }
    };
    ctx.document.getElementById = id => id === 'app-root' ? appRoot : null;
    ctx.injectClassroomStyles = () => {};
    ctx.getClassroomOperationDate = () => ctx.state.ui.baseDate;
    ctx.getClassroomTodayDate = () => '2026-10-23';
    ctx.computeClassTodaySummary = () => ({ att: 0, hw: 0, total: 0, isScheduled: false });
    ctx.getClassroomActiveStudents = () => [];
    ctx.buildClassroomTodayMaps = () => ({ todayAttMap: {}, todayHwMap: {} });
    ctx.isClassPlannerTargetClass = () => false;
    ctx.isPlannerTargetClass = () => false;
    ctx.renderClassroomMonthlyStatusBoard = () => '<div>월간 현황</div>';
    ctx.ensureClassroomMonthlyStatusCache = () => {};
    ctx.renderClass('b', { preserveClassTabs: true });
    assert.equal(htmlWrites, 0);
    assert.equal(workspaceWrites, 1);
    assert.equal(classId, 'b');
    assert.equal(tabs.scrollLeft, 87);
    assert.equal(buttons[1].pressed, 'true');
    assert.equal(buttons[0].pressed, 'false');
    assert.equal(ctx.state.ui.currentClassId, 'b');
    assert.match(workspace.html, /B반/);
    assert.match(workspace.html, /2026-10-20/);
});

test('delayed old-class date load never overrides the newly selected class', async () => {
    const ctx = makeContext();
    let finish;
    ctx.loadClassroomOperationDateData = () => new Promise(resolve => { finish = resolve; });
    ctx.setBaseDate = date => { ctx.state.ui.baseDate = date; };
    const calls = [];
    ctx.renderClass = id => { calls.push(id); };
    const pending = ctx.changeClassOperationDate('a', '2026-10-21');
    ctx.state.ui.currentClassId = 'b';
    finish(true);
    await pending;
    assert.deepEqual(calls, []);
    assert.equal(ctx.state.ui.baseDate, '2026-10-21');
});

test('class tabs retain touch-sized targets and horizontal overflow on mobile', () => {
    assert.match(css, /\.ap-classroom-class-tabs\s*\{[^}]*overflow-x:\s*auto/s);
    assert.match(css, /@media \(max-width: 760px\)\s*\{[\s\S]*?\.ap-classroom-class-tab\s*\{\s*min-height:\s*44px/s);
});
