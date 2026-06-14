const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const helperPath = path.join(root, 'apmath/js/dashboard-assistant-memos.js');

function loadHelper(storage = {}) {
  const context = {
    console,
    window: {},
    localStorage: {
      getItem(key) { return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null; },
      setItem(key, value) { storage[key] = String(value); },
      removeItem(key) { delete storage[key]; }
    }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(helperPath, 'utf8'), context, { filename: helperPath });
  return context;
}

const baseDb = {
  students: [
    { id: 1, name: '김민준', grade: '중2', status: '재원' },
    { id: 2, name: '황시아', grade: '중1', status: '재원' },
    { id: 3, name: '박정원', grade: '중3', status: '재원' }
  ],
  classes: [
    { id: 10, name: '중2A', teacher_name: '박준성', is_active: 1 },
    { id: 20, name: '중1A', teacher_name: '박준성', is_active: 1 }
  ],
  class_students: [
    { class_id: 10, student_id: 1 },
    { class_id: 20, student_id: 2 },
    { class_id: 20, student_id: 3 }
  ],
  attendance_history: [
    { class_id: 10, student_id: 1, date: '2026-06-10', status: '결석' }
  ],
  homework_history: [
    { student_id: 2, date: '2026-06-08', status: '미제출' },
    { student_id: 2, date: '2026-06-10', status: '미완료' },
    { student_id: 3, date: '2026-06-08', status: '미제출' },
    { student_id: 3, date: '2026-06-10', status: '미제출' }
  ],
  class_daily_records: [],
  academy_schedules: []
};

const scheduledClasses = [
  { id: 10, name: '중2A' },
  { id: 20, name: '중1A' }
];

{
  const ctx = loadHelper();
  const memos = ctx.buildDashboardAssistantMemos({
    todayStr: '2026-06-17',
    dayKey: 'wed',
    teacherName: '박준성',
    db: baseDb,
    scheduledClasses,
    isHoliday: false,
    previousClassDateById: { 10: '2026-06-10', 20: '2026-06-10' }
  });
  assert.strictEqual(memos[0].text, '김민준(중2) 지난 시간에 결석했어요. 보강 확인하세요.');
  assert(memos.some(m => m.text === '오늘은 일지를 제출하는 날이에요.'));
  assert(memos.some(m => m.text === '중2A 지난 수업 진도 기록이 비어 있어요.'));
  assert(memos.length <= 3);
}

{
  const ctx = loadHelper();
  const memos = ctx.buildDashboardAssistantMemos({
    todayStr: '2026-06-18',
    dayKey: 'thu',
    teacherName: '박준성',
    db: baseDb,
    scheduledClasses,
    isHoliday: true,
    previousClassDateById: { 10: '2026-06-10', 20: '2026-06-10' }
  });
  assert(!memos.some(m => m.type === 'journal-day'), 'journal memo must not show on holidays');
}

{
  const ctx = loadHelper();
  const memos = ctx.buildDashboardAssistantMemos({
    todayStr: '2026-06-19',
    dayKey: 'fri',
    teacherName: '박준성',
    db: baseDb,
    scheduledClasses,
    isHoliday: false,
    previousClassDateById: { 10: '2026-06-10', 20: '2026-06-10' }
  });
  const homework = memos.find(m => m.type === 'homework-repeat');
  assert(homework.text.includes('황시아(중1), 박정원(중3)'));
  assert(!homework.text.includes('외'));
}

{
  const storage = {};
  const ctx = loadHelper(storage);
  ctx.hideDashboardAssistantMemo('2026-06-17', 'absence:10:1:2026-06-10');
  const visible = ctx.filterHiddenDashboardAssistantMemos('2026-06-17', [
    { id: 'absence:10:1:2026-06-10', text: 'hidden' },
    { id: 'record-gap:10:2026-06-10', text: 'shown' }
  ]);
  assert.deepStrictEqual(visible.map(m => m.text), ['shown']);
}

{
  const source = fs.readFileSync(helperPath, 'utf8');
  assert(!/toast\s*\(/.test(source), 'assistant memo interactions must not call toast');
}

console.log('dashboard assistant memos contract test passed');
