const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');

const context = {
  console,
  Date,
  Set,
  Map,
  Array,
  String,
  Number,
  RegExp,
  Math,
  crypto: { randomUUID: () => 'uuid-test' },
  state: {
    ui: {
      monthlyAttendanceCache: {
        '2026-06': {
          attendance: [
            { student_id: 's1', date: '2026-06-02', status: '결석' },
            { student_id: 's1', date: '2026-06-01', status: '보강' },
            { student_id: 's1', date: '2026-06-04', status: '미기록', tags: '보강' },
            { student_id: 's2', date: '2026-06-03', status: '미기록', tags: '상담' },
            { student_id: 's2', date: '2026-06-05', status: '미기록', tags: 'makeup:homework' },
            { student_id: 's2', date: '2026-07-01', status: '보강' }
          ],
          homework: [
            { student_id: 's1', date: '2026-06-01', status: '미완료' },
            { student_id: 's1', date: '2026-06-04', status: '완료' },
            { student_id: 's2', date: '2026-06-13', status: '미완료' }
          ]
        }
      }
    },
    db: {
      attendance: [],
      homework: [],
      consultations: [
        { student_id: 's2', date: '2026-06-03', content: '상담' },
        { student_id: 's1', consultation_date: '2026-07-02', content: '다른 달' }
      ],
      classes: [],
      class_students: [],
      students: [],
      academy_schedules: []
    }
  },
  window: {},
  document: {
    getElementById: () => null,
    createElement: () => ({ style: {}, textContent: '' }),
    head: { appendChild: () => {} }
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(source, context, { filename: 'classroom.js' });

const students = [
  { id: 's1', name: '남지혁' },
  { id: 's2', name: '박정원' }
];

const data = context.buildClassroomMonthlyStatusBoardData('c1', students, '2026-06-16');
assert.strictEqual(data.month, '2026-06', 'selected date should drive the full month');
assert.deepStrictEqual(Array.from(data.groups.absent.get('s1')).sort(), ['2026-06-02']);
assert.deepStrictEqual(Array.from(data.groups.makeup.get('s1')).sort(), ['2026-06-01', '2026-06-04']);
assert.deepStrictEqual(Array.from(data.groups.makeup.get('s2')).sort(), ['2026-06-05']);
assert.deepStrictEqual(Array.from(data.groups.homework.get('s1')).sort(), ['2026-06-01']);
assert.deepStrictEqual(Array.from(data.groups.homework.get('s2')).sort(), ['2026-06-13']);
assert.deepStrictEqual(Array.from(data.groups.consultation.get('s2')).sort(), ['2026-06-03']);

const html = context.renderClassroomMonthlyStatusBoard('c1', students, '2026-06-16');
assert(!html.includes('이번달 현황판'), 'board title should not be rendered');
assert(!html.includes('월간 누적 보기'), 'month subtitle should not be rendered');
assert(!html.includes('이 반에서 이번 달'), 'board description should not be rendered');
assert(html.includes('결석') && html.includes('1건'), 'absence count should be rendered');
assert(html.includes('보강') && html.includes('3건'), 'makeup count should be rendered');
assert(html.includes('숙제') && html.includes('2건'), 'homework issue count should be rendered');
assert(html.includes('상담') && html.includes('1건'), 'consultation count should be rendered');
assert(html.includes('is-absent'), 'absence category should carry the top-chip color tone');
assert(html.includes('is-makeup'), 'makeup category should carry the top-chip color tone');
assert(html.includes('is-homework'), 'homework category should carry the top-chip color tone');
assert(html.includes('is-consultation'), 'consultation category should carry the top-chip color tone');
assert(html.includes('남지혁') && html.includes('6/1 · 6/4'), 'student dates should be grouped');
assert(html.includes("openStudentDetail('s1'"), 'monthly status board student name should open student detail');
assert(html.includes("returnTo: { type: 'classDetail', classId: 'c1' }"), 'monthly status board detail link should return to class detail');
assert(!/<button\b|href=/.test(html), 'monthly status board should not add buttons or links');

const emptyHtml = context.renderClassroomMonthlyStatusBoard('c1', students, '2026-08-16');
assert(!emptyHtml.includes('이번 달 보강 기록 없음'), 'empty makeup copy should not be rendered');
assert(!emptyHtml.includes('이번 달 숙제 이슈 없음'), 'empty homework copy should not be rendered');
assert(!emptyHtml.includes('이번 달 상담 기록 없음'), 'empty consultation copy should not be rendered');
assert(emptyHtml.includes('결석') && emptyHtml.includes('0건'), 'empty absence category should stay as a blank zero-count category');

let replacedHtml = '';
context.state.ui.currentClassId = 'c1';
context.state.ui.monthlyAttendanceCache = { '2026-06': { attendance: [], homework: [] } };
context.document.getElementById = id => (
  id === 'classroom-monthly-status-board'
    ? {
        set outerHTML(value) {
          replacedHtml = value;
        }
      }
    : null
);
context.getClassroomActiveStudents = () => students;
context.syncClassroomHomeworkStatusToState('s1', '2026-06-16', '미완료');
assert(replacedHtml.includes('숙제') && replacedHtml.includes('6/16'), 'homework toggle sync should refresh the monthly board');

console.log('classroom monthly status board test passed');
