import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const classroomSource = fs.readFileSync(path.join(repoRoot, 'apmath/js/classroom.js'), 'utf8');
const coreSource = fs.readFileSync(path.join(repoRoot, 'apmath/js/core.js'), 'utf8');

function makeContext({
    requestedDate = '2026-09-18',
    loadedPhase = 'regular',
    hasStructuredSnapshot = false,
    checkedUnits = []
} = {}) {
    const elements = new Map();
    const context = {
        console: { log() {}, info() {}, warn() {}, error() {} },
        window: {},
        state: {
            db: {
                classes: [{ id: 'c1', name: '중1 테스트반', textbook: '' }],
                class_progress_date: '2026-09-18',
                class_progress_phases: [{
                    class_id: 'c1', effective_date: null, phase: loadedPhase
                }],
                class_progress_snapshots: [],
                class_progress_items: [],
                class_daily_records: [],
                class_daily_progress: [],
                timetable_class_daily_records: [],
                timetable_class_daily_progress: []
            },
            ui: {
                userName: '테스트 교사',
                classProgressModalMeta: {
                    classId: 'c1',
                    date: requestedDate,
                    gradeKey: '중1',
                    hasStructuredSnapshot,
                    loadedPhase,
                    selectedPhase: loadedPhase,
                    phaseLoadFailed: false
                },
                classProgressModalState: {
                    classId: 'c1',
                    className: '중1 테스트반',
                    date: requestedDate,
                    gradeKey: '중1',
                    groups: [],
                    savedPaths: [],
                    activeGroupKeys: [],
                    books: [],
                    progressByTextbook: {},
                    selectedTextbookId: '',
                    courseAddOpen: false,
                    loadedPhase,
                    selectedPhase: loadedPhase,
                    phaseLoadFailed: false
                }
            }
        },
        document: {
            getElementById(id) { return elements.get(id) || null; },
            querySelector() { return null; },
            querySelectorAll(selector) {
                if (selector === '.record-unit-check:checked') return context._checkedUnits;
                return [];
            }
        },
        apEscapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
        _elements: elements,
        _checkedUnits: checkedUnits,
        _apiCalls: [],
        _toasts: [],
        _closeCalls: []
    };
    context.api = {
        get: async route => {
            context._apiCalls.push({ method: 'GET', route });
            return context._getResponse || { success: false, error: 'unexpected GET' };
        },
        post: async (route, payload) => {
            context._apiCalls.push({ method: 'POST', route, payload });
            if (route === 'class-daily-records') {
                return {
                    success: true,
                    record: { id: 'record-c1-date', class_id: payload.class_id, date: payload.date, special_note: payload.special_note },
                    progress: []
                };
            }
            if (route === 'class-progress') {
                return {
                    success: true,
                    snapshot: { id: 'snapshot-c1-date', class_id: payload.class_id, effective_date: payload.effective_date },
                    items: payload.items
                };
            }
            if (route === 'class-progress-phase') {
                return context._phasePostResponse || {
                    success: true,
                    class_id: payload.class_id,
                    effective_date: payload.effective_date,
                    phase: payload.phase
                };
            }
            return { success: false, error: `unexpected POST ${route}` };
        }
    };
    context.toast = (message, type) => context._toasts.push({ message, type });
    context.closeModal = () => context._closeCalls.push(true);
    context._elements.set('record-special-note', { value: '' });
    vm.createContext(context);
    vm.runInContext(classroomSource, context, { filename: 'apmath/js/classroom.js' });
    return context;
}

function makeCheckedUnit(pathKey) {
    const attributes = {
        'data-curriculum-key': '2022',
        'data-level-key': 'high',
        'data-course-key': '공통수학2',
        'data-canonical-path-key': pathKey,
        'data-l1': '도형의 방정식',
        'data-l2': '원의 방정식'
    };
    return {
        value: pathKey,
        getAttribute(name) { return attributes[name] || ''; }
    };
}

test('phase select renders five exact labels beside course controls even when no textbook is selected', () => {
    const context = makeContext();
    const html = context.renderClassProgressTextbookDetail(null);

    assert.match(html, /id="record-progress-phase-select"/);
    for (const label of [
        '정규 진도',
        '1학기 중간고사 대비',
        '1학기 기말고사 대비',
        '2학기 중간고사 대비',
        '2학기 기말고사 대비'
    ]) assert.ok(html.includes(label), `${label} option is present`);
    assert.match(html, /toggleClassProgressCourseAdd\(\)/);
    assert.match(html, /등록된 교재가 없습니다/);
});

test('opening and closing the course picker keeps it outside the phase-header controls', () => {
    const context = makeContext();
    context.state.ui.classProgressModalState.courseAddOpen = false;
    context.state.ui.classProgressModalState.selectedPhase = 'semester2_midterm';
    const detail = { innerHTML: 'before' };
    context._elements.set('record-progress-detail', detail);

    context.toggleClassProgressCourseAdd();
    const openHtml = detail.innerHTML;
    assert.ok(openHtml.indexOf('id="record-progress-phase-select"') < openHtml.indexOf('class="ap-class-progress-course-add ap-class-progress-course-add--panel"'));
    assert.match(openHtml, /value="semester2_midterm" selected/);

    context.toggleClassProgressCourseAdd();
    assert.match(detail.innerHTML, /class="ap-class-progress-course-add ap-class-progress-course-add--compact"/);
    assert.doesNotMatch(detail.innerHTML, /ap-class-progress-course-add--panel/);
    assert.match(detail.innerHTML, /value="semester2_midterm" selected/);
});

test('current initial-data phase is used from its own cache and a past date uses the phase endpoint', async () => {
    const context = makeContext({ loadedPhase: 'semester2_midterm' });
    const current = await context.loadClassProgressPhaseForDate('c1', '2026-09-18');
    assert.equal(current.phase, 'semester2_midterm');
    assert.equal(context._apiCalls.length, 0);

    context._getResponse = {
        success: true,
        class_id: 'c1',
        date: '2026-09-10',
        phase: 'semester2_midterm',
        effective_date: '2026-09-01'
    };
    const historical = await context.loadClassProgressPhaseForDate('c1', '2026-09-10');
    assert.equal(historical.phase, 'semester2_midterm');
    assert.deepEqual(context._apiCalls, [{
        method: 'GET',
        route: 'class-progress-phase?class_id=c1&date=2026-09-10'
    }]);
});

test('missing phase row resolves to regular through the date-scoped API contract', async () => {
    const context = makeContext({ loadedPhase: 'regular' });
    context.state.db.class_progress_phases = [];
    context._getResponse = {
        success: true,
        class_id: 'c1',
        date: '2026-09-18',
        phase: 'regular',
        effective_date: null
    };

    const result = await context.loadClassProgressPhaseForDate('c1', '2026-09-18');

    assert.equal(result.phase, 'regular');
    assert.equal(result.effectiveDate, null);
});

test('saving a historical phase invalidates a cached later as-of phase', async () => {
    const context = makeContext({ loadedPhase: 'regular' });
    const beforeSave = await context.loadClassProgressPhaseForDate('c1', '2026-09-18');
    assert.equal(beforeSave.phase, 'regular');
    assert.equal(context._apiCalls.length, 0);

    context.state.ui.classProgressModalMeta.date = '2026-09-10';
    context.state.ui.classProgressModalMeta.loadedPhase = 'regular';
    context.state.ui.classProgressModalState.date = '2026-09-10';
    context.state.ui.classProgressModalState.loadedPhase = 'regular';
    context._elements.set('record-progress-phase-select', { value: 'semester2_midterm' });
    await context.saveClassRecord('c1', '2026-09-10');

    context._getResponse = {
        success: true,
        class_id: 'c1',
        date: '2026-09-18',
        phase: 'semester2_midterm',
        effective_date: '2026-09-10'
    };
    const afterHistoricalEdit = await context.loadClassProgressPhaseForDate('c1', '2026-09-18');
    assert.equal(afterHistoricalEdit.phase, 'semester2_midterm');
    assert.deepEqual(context._apiCalls.filter(call => call.method === 'GET').map(call => call.route), [
        'class-progress-phase?class_id=c1&date=2026-09-18'
    ]);
});

test('phase load failure disables only the status selector and leaves ordinary progress saving available', async () => {
    const context = makeContext({ loadedPhase: 'regular', hasStructuredSnapshot: false });
    context.state.db.class_progress_phases = [];
    context._getResponse = { success: false, error: 'API Endpoint Not Found' };
    const phase = await context.loadClassProgressPhaseForDate('c1', '2026-09-18');
    assert.equal(phase.loadFailed, true);
    context.state.ui.classProgressModalState.phaseLoadFailed = true;
    context.state.ui.classProgressModalMeta.phaseLoadFailed = true;
    assert.match(context.renderClassProgressPhaseSelect(), /disabled/);

    await context.saveClassRecord('c1', '2026-09-18');
    assert.deepEqual(context._apiCalls.map(call => call.route), [
        'class-progress-phase?class_id=c1&date=2026-09-18',
        'class-daily-records'
    ]);
    assert.equal(context._closeCalls.length, 1);
});

test('a phase-only change is persisted after the daily record even when there are zero canonical items', async () => {
    const context = makeContext({ hasStructuredSnapshot: false, loadedPhase: 'regular' });
    context._elements.set('record-progress-phase-select', { value: 'semester2_midterm' });
    context.setClassProgressPhaseSelection('semester2_midterm');
    assert.equal(context._apiCalls.length, 0, 'changing the select only updates the modal draft');

    await context.saveClassRecord('c1', '2026-09-18');

    assert.deepEqual(context._apiCalls.map(call => call.route), [
        'class-daily-records',
        'class-progress-phase'
    ]);
    assert.deepEqual(JSON.parse(JSON.stringify(context._apiCalls[1].payload)), {
        class_id: 'c1',
        effective_date: '2026-09-18',
        phase: 'semester2_midterm'
    });
    assert.equal(context._closeCalls.length, 1);
});

test('phase-only changes preserve canonical unit paths and save after existing canonical progress', async () => {
    const pathKey = '2022|high|공통수학2|도형의 방정식|원의 방정식';
    const context = makeContext({
        hasStructuredSnapshot: true,
        loadedPhase: 'semester2_midterm',
        checkedUnits: [makeCheckedUnit(pathKey)]
    });
    context.state.ui.classProgressModalState.activeGroupKeys = ['2022|high|공통수학2'];
    context.state.ui.classProgressModalState.savedPaths = [pathKey];
    context.state.ui.classProgressModalState.books = [
        { id: 'book1', class_id: 'c1', title: '개념원리 공통수학2', status: 'active' }
    ];
    context.state.ui.classProgressModalState.selectedTextbookId = 'book1';
    context.state.ui.classProgressModalState.progressByTextbook = {
        book1: { progressText: 'p.20~35', isChecked: true }
    };
    context._elements.set('record-special-note', { value: '학생별 보충 설명' });
    context._elements.set('record-progress-phase-select', { value: 'regular' });

    await context.saveClassRecord('c1', '2026-09-18');

    assert.deepEqual(context._apiCalls.map(call => call.route), [
        'class-daily-records',
        'class-progress',
        'class-progress-phase'
    ]);
    assert.deepEqual(JSON.parse(JSON.stringify(context._apiCalls[0].payload.progress)), [{
        textbook_id: 'book1',
        textbook_title_snapshot: '개념원리 공통수학2',
        progress_text: 'p.20~35'
    }]);
    assert.equal(context._apiCalls[0].payload.special_note, '학생별 보충 설명');
    assert.deepEqual(JSON.parse(JSON.stringify(context._apiCalls[1].payload.items.map(item => item.canonical_path_key))), [pathKey]);
    assert.deepEqual(JSON.parse(JSON.stringify(context.state.ui.classProgressModalState.activeGroupKeys)), ['2022|high|공통수학2']);
    assert.deepEqual(JSON.parse(JSON.stringify(context.state.ui.classProgressModalState.savedPaths)), [pathKey]);
    assert.equal(context.state.ui.classProgressModalState.selectedTextbookId, 'book1');
    assert.equal(context.state.ui.classProgressModalState.progressByTextbook.book1.progressText, 'p.20~35');
});

test('unchanged phase causes no phase write and failed phase write keeps the modal open with a clear warning', async () => {
    const unchanged = makeContext({ loadedPhase: 'regular', hasStructuredSnapshot: false });
    await unchanged.saveClassRecord('c1', '2026-09-18');
    assert.deepEqual(unchanged._apiCalls.map(call => call.route), ['class-daily-records']);
    assert.equal(unchanged._closeCalls.length, 1);

    const failed = makeContext({ loadedPhase: 'regular', hasStructuredSnapshot: false });
    failed._elements.set('record-progress-phase-select', { value: 'semester1_final' });
    failed._phasePostResponse = { success: false, error: 'database unavailable' };
    await failed.saveClassRecord('c1', '2026-09-18');
    assert.deepEqual(failed._apiCalls.map(call => call.route), ['class-daily-records', 'class-progress-phase']);
    assert.equal(failed._closeCalls.length, 0);
    assert.ok(failed._toasts.some(item => item.message === '일지/진도는 저장됐지만 수업 상태 저장에 실패했습니다. 다시 시도해주세요.'));
});

test('initial-data and refreshDataOnly keep phase rows in state.db and clear the independent phase cache', async () => {
    let responseData = {
        students: [],
        classes: [],
        class_progress_date: '2026-09-18',
        class_progress_phases: [{ class_id: 'c1', effective_date: '2026-09-01', phase: 'semester2_midterm' }]
    };
    const coreContext = vm.createContext({
        console,
        window: {},
        document: {
            querySelector() { return null; },
            getElementById() { return null; }
        },
        localStorage: {
            getItem() { return null; },
            setItem() {},
            removeItem() {}
        },
        navigator: { onLine: true },
        fetch: async () => ({ status: 200, json: async () => responseData })
    });
    vm.runInContext(coreSource, coreContext, { filename: 'apmath/js/core.js' });
    coreContext.apmsInvalidateDataIndexes = () => {};
    coreContext.apmsGetDataIndexes = () => {};
    coreContext.renderDashboard = () => {};
    coreContext.getSession = () => ({ id: 't1', name: '테스트 교사', role: 'teacher' });
    vm.runInContext(`
        state.ui.classProgressPhaseCache = { stale: { phase: 'regular' } };
        state.ui.classProgressPhaseInitialDataInvalid = { c1: true };
    `, coreContext);

    await vm.runInContext('loadData(false)', coreContext);
    const initiallyLoadedPhases = vm.runInContext('state.db.class_progress_phases', coreContext);
    assert.ok(Array.isArray(initiallyLoadedPhases), 'loadData stores phase rows in state.db');
    assert.deepEqual(JSON.parse(JSON.stringify(initiallyLoadedPhases)), [
        { class_id: 'c1', effective_date: '2026-09-01', phase: 'semester2_midterm' }
    ]);
    assert.deepEqual(JSON.parse(JSON.stringify(vm.runInContext('state.ui.classProgressPhaseCache', coreContext))), {});
    assert.deepEqual(JSON.parse(JSON.stringify(vm.runInContext('state.ui.classProgressPhaseInitialDataInvalid', coreContext))), {});

    responseData = {
        ...responseData,
        class_progress_phases: [{ class_id: 'c1', effective_date: '2026-09-18', phase: 'regular' }]
    };
    await vm.runInContext('refreshDataOnly()', coreContext);
    assert.deepEqual(JSON.parse(JSON.stringify(vm.runInContext('state.db.class_progress_phases', coreContext))), [
        { class_id: 'c1', effective_date: '2026-09-18', phase: 'regular' }
    ]);
});

test('opening a progress modal restores a historical phase into both loaded and selected draft state', async () => {
    const context = makeContext({ requestedDate: '2026-09-10', loadedPhase: 'regular' });
    context.state.db.classes = [{ id: 'c1', name: '중1 테스트반', grade: '중1', textbook: '' }];
    context.state.db.class_progress_date = '2026-09-18';
    context.state.db.class_progress_phases = [{
        class_id: 'c1', effective_date: '2026-09-01', phase: 'regular'
    }];
    context.state.db.class_progress_taxonomy = [];
    context._getResponse = {
        success: true,
        class_id: 'c1',
        date: '2026-09-10',
        phase: 'semester2_midterm',
        effective_date: '2026-09-01'
    };
    context.loadClassProgressForDate = async () => ({ snapshot: null, items: [], legacy_record: null });
    context.loadClassDailyRecordForDate = async () => ({ record: null, progress: [], loadFailed: false });
    context.showModal = (title, html) => { context._modal = { title, html }; };

    await context.openClassRecordModal('c1', '2026-09-10');

    const modalState = context.state.ui.classProgressModalState;
    assert.equal(modalState.loadedPhase, 'semester2_midterm');
    assert.equal(modalState.selectedPhase, 'semester2_midterm');
    assert.equal(context.state.ui.classProgressModalMeta.loadedPhase, 'semester2_midterm');
    assert.match(context._modal.html, /value="semester2_midterm" selected/);
    assert.match(context._modal.html, /등록된 교재가 없습니다/);
    assert.deepEqual(context._apiCalls, [{
        method: 'GET',
        route: 'class-progress-phase?class_id=c1&date=2026-09-10'
    }]);
});
