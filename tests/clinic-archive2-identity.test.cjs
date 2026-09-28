const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function load(savedFilters = {}) {
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
                { id: 'e2', class_id: 'c2', student_id: 's2', exam_date: '2026-09-28', exam_title: '다른 반 표시 제목', archive_file: 'MIXED:archive2-fixture', question_count: 3 },
                { id: 'e3', class_id: 'c3', student_id: 's3', exam_date: '2026-09-28', archive_file: 'MIXED:archive2-fixture', question_count: 3 },
                { id: 'old', class_id: 'c1', student_id: 's1', exam_date: '2026-09-27', archive_file: 'MIXED:archive2-fixture', question_count: 3 },
                { id: 'other', class_id: 'c1', student_id: 's1', exam_date: '2026-09-28', archive_file: 'MIXED:other', question_count: 3 }
            ],
            wrong_answers: [{ session_id: 'e1', question_id: 2 }, { session_id: 'e2', question_id: 2 }, { session_id: 'e2', question_id: 3 }],
            exam_blueprints: [
                { archive_file: 'MIXED:archive2-fixture', question_no: 2, source_archive_file: 'exams/original/middle/m3/2mid/source.js', source_question_no: 1, source_question_ordinal: 2, source_question_uid: 'uid-subjective-1' },
                { archive_file: 'MIXED:archive2-fixture', question_no: 3, source_archive_file: 'exams/original/middle/m3/2mid/source.js', source_question_no: 1, source_question_ordinal: 1, source_question_uid: 'uid-objective-1' }
            ]
        } },
        localStorage: { getItem(key) { return savedFilters[key] || null; }, setItem(key, value) { savedFilters[key] = value; } },
        Date: class extends Date { constructor(...args) { super(...(args.length ? args : ['2026-09-28T12:00:00+09:00'])); } },
        URL, URLSearchParams, console
    };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../apmath/js/clinic-print.js'), 'utf8'), context);
    return context;
}
test('Archive 2.0 mixed sessions join by date and canonical file across class display titles', () => {
    const c = load();
    const group = c.clinicPrintGetClassExamGroups('c1', 'grade')[0];
    assert.equal(group.sessions.length, 2);
    assert.deepEqual(Array.from(c.clinicPrintGetSessionsForExamGroup('c1', group.examKey), row => row.id), ['e1']);
    assert.deepEqual(Array.from(c.clinicPrintGetGradeSessionsForExamGroup('c1', group.examKey), row => row.id), ['e1', 'e2']);
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
