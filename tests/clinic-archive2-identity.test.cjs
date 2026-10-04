const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function load(savedFilters = {}, now = '2026-09-28T12:00:00+09:00') {
    const context = {
        window: { addEventListener() {} },
        document: { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
        state: { db: {
            classes: [{ id: 'c1', grade: '중3' }, { id: 'c2', grade: '중3' }, { id: 'c3', grade: '중2' }],
            students: [{ id: 's1', name: '학생1' }, { id: 's2', name: '학생2' }, { id: 's3', name: '학생3' }],
            class_students: [{ class_id: 'c1', student_id: 's1' }, { class_id: 'c2', student_id: 's2' }, { class_id: 'c3', student_id: 's3' }],
            class_exam_assignments: [{ id: 'a1', class_id: 'c1', exam_date: '2026-09-28', exam_title: '중3 중간고사', archive_file: 'MIXED:archive2-fixture', question_count: 3 }],
            exam_sessions: [
                { id: 'e1', class_id: 'c1', student_id: 's1', exam_date: '2026-09-28', exam_title: '중3 2학기 중간', archive_file: 'MIXED:archive2-fixture', question_count: 3 },
                { id: 'e2', class_id: 'c2', student_id: 's2', exam_date: '2026-09-20', exam_title: '다른 반 표시 제목', archive_file: 'MIXED:archive2-fixture', question_count: 3 },
                { id: 'e3', class_id: 'c3', student_id: 's3', exam_date: '2026-09-28', archive_file: 'MIXED:archive2-fixture', question_count: 3 },
                { id: 'old', class_id: 'c1', student_id: 's1', exam_date: '2026-08-27', archive_file: 'MIXED:archive2-fixture', question_count: 3 },
                { id: 'other', class_id: 'c1', student_id: 's1', exam_date: '2026-09-28', archive_file: 'MIXED:other', question_count: 3 }
            ],
            wrong_answers: [{ session_id: 'e1', question_id: 2 }, { session_id: 'e2', question_id: 2 }, { session_id: 'e2', question_id: 3 }],
            exam_blueprints: [
                { archive_file: 'MIXED:archive2-fixture', question_no: 2, source_archive_file: 'exams/original/middle/m3/2mid/source.js', source_question_no: 1, source_question_ordinal: 2, source_question_uid: 'uid-subjective-1' },
                { archive_file: 'MIXED:archive2-fixture', question_no: 3, source_archive_file: 'exams/original/middle/m3/2mid/source.js', source_question_no: 1, source_question_ordinal: 1, source_question_uid: 'uid-objective-1' }
            ]
        } },
        localStorage: { getItem(key) { return savedFilters[key] || null; }, setItem(key, value) { savedFilters[key] = value; } },
        Date: class extends Date { constructor(...args) { super(...(args.length ? args : [now])); } },
        URL, URLSearchParams, console
    };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../apmath/js/clinic-print.js'), 'utf8'), context);
    return context;
}
test('Grade sessions join across teacher, title and exam date within the recent month', () => {
    const c = load();
    const group = c.clinicPrintGetClassExamGroups('c1', 'grade')[0];
    assert.equal(group.sessions.length, 2);
    assert.deepEqual(Array.from(c.clinicPrintGetSessionsForExamGroup('c1', group.examKey), row => row.id), ['e1']);
    assert.deepEqual(Array.from(c.clinicPrintGetGradeSessionsForExamGroup('c1', group.examKey), row => row.id), ['e1', 'e2']);
});

test('Grade window uses Korean today and clamps the previous calendar month at month end', () => {
    assert.deepEqual(JSON.parse(JSON.stringify(load().clinicPrintGetGradeWindow('c1'))), { from: '2026-08-28', to: '2026-09-28' });
    assert.deepEqual(JSON.parse(JSON.stringify(load({}, '2026-03-31T23:30:00+09:00').clinicPrintGetGradeWindow('c1'))), { from: '2026-02-28', to: '2026-03-31' });
    assert.deepEqual(JSON.parse(JSON.stringify(load({}, '2028-03-31T00:30:00+09:00').clinicPrintGetGradeWindow('c1'))), { from: '2028-02-29', to: '2028-03-31' });
});

test('Grade paper merges different dates and counts only the latest attempt per student', () => {
    const c = load();
    c.state.db.exam_sessions.push({ ...c.state.db.exam_sessions[0], id: 'retake-old', exam_date: '2026-09-10' });
    c.state.db.wrong_answers.push({ session_id: 'retake-old', question_id: 1 });
    const groups = c.clinicPrintGetClassExamGroups('c1', 'grade').filter(group => group.archiveFile === 'MIXED:archive2-fixture');
    assert.equal(groups.length, 1);
    assert.equal(groups[0].sessions.length, 2);
    assert.equal(groups[0].wrongCount, 3);
    const payload = c.clinicPrintBuildPayload('c1', { mode: 'grade', selectedExamKeys: [groups[0].examKey], selectedStudentIds: ['s1'] });
    assert.deepEqual(Array.from(payload.gradeWrongItems, item => item.questionNo).sort(), [2, 3]);
    assert.ok(payload.gradeWrongItems.every(item => item.totalCount === 2));
    assert.deepEqual(Array.from(c.clinicPrintBuildWrongClinicTargets('c1', payload, ['s1']), row => row.student_id), ['s1']);
});

test('Other-teacher-only papers appear and are selected by default in grade scope', () => {
    const c = load();
    c.state.db.exam_sessions.push({ ...c.state.db.exam_sessions[1], id: 'foreign-only', archive_file: 'MIXED:foreign-only', exam_title: '다른 선생님 출제 시험' });
    const groups = c.clinicPrintGetClassExamGroups('c1', 'grade');
    const html = c.clinicPrintRenderExamListHtml('c1', 'grade');
    assert.ok(html.includes('MIXED:foreign-only'));
    assert.equal((html.match(/name="clinic-print-exam"[^>]+ checked/g) || []).length, groups.length);
    assert.ok(!c.clinicPrintRenderExamListHtml('c1', 'class').includes('MIXED:foreign-only'));
});

test('Shared source questions include correct students from every selected paper in the denominator', () => {
    const c = load();
    c.state.db.students.push({ id: 's4', name: '학생4' });
    c.state.db.class_students.push({ class_id: 'c2', student_id: 's4' });
    c.state.db.class_exam_assignments = [];
    c.state.db.exam_sessions = [
        { id: 'a', class_id: 'c1', student_id: 's1', exam_date: '2026-09-28', archive_file: 'MIXED:A', question_count: 1 },
        { id: 'b', class_id: 'c2', student_id: 's2', exam_date: '2026-09-15', archive_file: 'MIXED:B', question_count: 1 },
        { id: 'c', class_id: 'c2', student_id: 's4', exam_date: '2026-09-15', archive_file: 'MIXED:B', question_count: 1 }
    ];
    c.state.db.wrong_answers = [{ session_id: 'a', question_id: 1 }];
    c.state.db.exam_blueprints = ['MIXED:A', 'MIXED:B'].map(archive_file => ({ archive_file, question_no: 1,
        source_archive_file: 'exams/original/middle/m3/2mid/shared.js', source_question_no: 7 }));
    const keys = Array.from(c.clinicPrintGetClassExamGroups('c1', 'grade'), group => group.examKey);
    const items = c.clinicPrintGetScopeWrongItems('c1', keys, 'grade');
    assert.equal(items.length, 1);
    assert.equal(items[0].wrongCount, 1);
    assert.equal(items[0].totalCount, 3);
    assert.equal(items[0].correctRate, 67);
    assert.equal(c.clinicPrintFilterTypeItems(items, 'gte50').length, 1);
    assert.equal(c.clinicPrintFilterTypeItems(items, 'lt50').length, 0);
});

function gradeResponse(c, overrides = {}) {
    return { success: true, classes: c.state.db.classes, class_students: c.state.db.class_students,
        students: c.state.db.students, assignments: c.state.db.class_exam_assignments,
        sessions: c.state.db.exam_sessions, wrong_answers: c.state.db.wrong_answers,
        blueprints: c.state.db.exam_blueprints, exclusions: [], ...overrides };
}

test('Grade refresh requests the recent month and uses the response as the authoritative cohort', async () => {
    const c = load();
    let query;
    c.api = { async get(value) { query = value; return gradeResponse(c, { sessions: [c.state.db.exam_sessions[1]], wrong_answers: [] }); } };
    assert.equal(await c.clinicPrintRefreshGradeClinicData('c1'), true);
    const params = new URL('https://fixture/' + query).searchParams;
    assert.equal(params.get('from'), '2026-08-28');
    assert.equal(params.get('to'), '2026-09-28');
    const key = c.clinicPrintGetClassExamGroups('c1', 'grade')[0].examKey;
    assert.deepEqual(Array.from(c.clinicPrintGetGradeSessionsForExamGroup('c1', key), row => row.id), ['e2']);
    assert.equal(c.clinicPrintGetScopeWrongItems('c1', [key], 'grade').length, 0, 'removed wrong rows must not leak from cached state');
});

test('HTTP errors and empty responses block grade statistics and show a retry instead of own-class results', async () => {
    for (const response of [{ error: 'Internal server error' }, {}]) {
        const c = load();
        c.api = { async get() { return response; } };
        assert.equal(await c.clinicPrintRefreshGradeClinicData('c1'), false);
        assert.equal(c.clinicPrintGetGradeStudents('c1').length, 0);
        assert.equal(c.clinicPrintGetClassExamGroups('c1', 'grade').length, 0);
        assert.ok(c.clinicPrintGetClassExamGroups('c1', 'class').length > 0);
        const html = c.clinicPrintRenderExamListHtml('c1', 'grade');
        assert.ok(html.includes('학년 전체 기록을 불러오지 못했습니다'));
        const dom = { 'clinic-print-exam-list': { innerHTML: '' }, 'clinic-print-grade-window': { hidden: true, innerHTML: '' },
            'clinic-print-student-list': { innerHTML: '' }, 'clinic-print-summary': { textContent: '' } };
        c.document.getElementById = id => dom[id] || null;
        c.document.querySelector = () => ({ value: 'grade' });
        c.clinicPrintSchedulePreviewPush = () => {};
        c.clinicPrintUpdateExamList('c1');
        c.clinicPrintUpdateStudentList('c1');
        assert.ok(dom['clinic-print-grade-window'].innerHTML.includes('다시 불러오기'));
        assert.ok(dom['clinic-print-summary'].textContent.includes('불러오지 못했습니다'));
        assert.ok(!dom['clinic-print-summary'].textContent.includes('학년 전체 학생'));
    }
});

test('Both type rankings use wrong-student count first and preserve the 50-percent boundary', () => {
    const c = load();
    const items = [{ questionNo: 1, correctRate: 50, wrongCount: 2 }, { questionNo: 2, correctRate: 0, wrongCount: 8 },
        { questionNo: 3, correctRate: 90, wrongCount: 1 }, { questionNo: 4, correctRate: 60, wrongCount: 4 },
        { questionNo: 5, correctRate: null, wrongCount: 10 }];
    assert.deepEqual(Array.from(c.clinicPrintFilterTypeItems(items, 'lt50'), row => row.questionNo), [2, 1]);
    assert.deepEqual(Array.from(c.clinicPrintFilterTypeItems(items, 'gte50'), row => row.questionNo), [4, 3]);
});
test('Grade and student wrong payloads retain canonical source ordinal and UID without collapsing duplicate ids', () => {
    const c = load();
    const group = c.clinicPrintGetClassExamGroups('c1', 'grade')[0];
    const payload = c.clinicPrintBuildPayload('c1', { selectedExamKeys: [group.examKey], selectedStudentIds: ['s1', 's2'], mode: 'grade' });
    assert.equal(payload.gradeWrongItems.length, 2);
    const subjective = payload.gradeWrongItems.find(item => item.sourceQuestionOrdinal === 2);
    assert.equal(subjective.sourceQuestionUid, 'uid-subjective-1');
    assert.equal(subjective.wrongCount, 2);
    assert.equal(subjective.totalCount, 2);
    assert.equal(subjective.correctRate, 0);
    const objective = payload.gradeWrongItems.find(item => item.sourceQuestionOrdinal === 1);
    assert.equal(objective.sourceQuestionUid, 'uid-objective-1');
    assert.equal(objective.correctRate, 50);
    assert.equal(payload.students[0].wrongItems[0].sourceQuestionOrdinal, 2);
});
test('Legacy relative file spellings normalize before joining OMR sessions to assignment groups', () => {
    const c = load();
    c.state.db.class_exam_assignments[0].archive_file = 'exams/original/middle/m3/2mid/source.js';
    c.state.db.exam_sessions[0].archive_file = 'archive/exams/original/middle/m3/2mid/source.js';
    const group = c.clinicPrintGetClassExamGroups('c1')[0];
    assert.equal(c.clinicPrintGetSessionsForExamGroup('c1', group.examKey).length, 1);
});

function addFilterAssignments(c) {
    c.state.db.exam_sessions = [];
    c.state.db.class_exam_assignments = ['25_학교_2학기_중간_중3_수학', '24_학교_2학기_중간_중3_수학', '25_학교_1학기_중간_중3_수학', '25_학교_1학기_기말_중3_수학', '25_학교_2학기_기말_중3_수학'].map((title, i) => ({ id: 'a' + i, class_id: 'c1', exam_date: '2026-09-28', archive_file: title, exam_title: title, question_count: 20 }));
}
test('Academic period uses the source paper, and defaults to the current term and newest source year', () => {
    const c = load();
    addFilterAssignments(c);
    assert.equal(c.clinicPrintGetExamPeriodFilter('c1'), '2mid');
    assert.equal(c.clinicPrintGetExamYearFilter('c1'), '2025');
    const html = c.clinicPrintRenderExamListHtml('c1');
    assert.ok(html.includes('25_학교_2학기_중간'));
    assert.ok(!html.includes('24_학교'));
    assert.ok(!html.includes('1학기'));
    const cards = c.clinicPrintRenderExamPeriodFilters('c1');
    assert.match(cards, /data-exam-period="2mid" aria-pressed="true"/);
    assert.equal(c.clinicPrintGetExamPeriod({ archiveFile: 'exams/original/middle/m3/1final/paper.js', examDate: '2026-09-28' }), '1final');
});
test('Choosing another term or all years updates only visible exams and persists across reopening', () => {
    const saved = {};
    const c = load(saved);
    addFilterAssignments(c);
    c.clinicPrintSetExamPeriodFilter('c1', '1final');
    assert.ok(c.clinicPrintRenderExamListHtml('c1').includes('25_학교_1학기_기말'));
    assert.ok(!c.clinicPrintRenderExamListHtml('c1').includes('2학기'));
    c.clinicPrintSetExamPeriodFilter('c1', '2mid');
    c.clinicPrintSetExamYearFilter('c1', 'all');
    assert.ok(c.clinicPrintRenderExamListHtml('c1').includes('24_학교'));
    const reopened = load(saved);
    addFilterAssignments(reopened);
    assert.equal(reopened.clinicPrintGetExamYearFilter('c1'), 'all');
    assert.equal(reopened.clinicPrintGetExamPeriodFilter('c1'), '2mid');
});
