const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const dashboardSource = fs.readFileSync(path.join(root, 'apmath/js/dashboard.js'), 'utf8');

function extractFunction(source, functionName, nextFunctionName) {
  const start = source.indexOf(`function ${functionName}`);
  const end = source.indexOf(`function ${nextFunctionName}`, start + 1);
  assert.ok(start >= 0 && end > start, `${functionName} source not found`);
  return source.slice(start, end);
}

// 고정 기준일 2026-06-17 (수)로 today를 결정론적으로 만든다.
const FIXED = new Date('2026-06-17T00:00:00');
class FakeDate extends Date {
  constructor(...args) {
    if (args.length === 0) {
      super(FIXED.getTime());
    } else {
      super(...args);
    }
  }
  static now() { return FIXED.getTime(); }
}

function buildContext(memos) {
  const context = {
    Date: FakeDate,
    Math,
    String,
    Number,
    state: { db: { operation_memos: memos, classes: [] } },
    apEscapeHtml: (v) => String(v == null ? '' : v),
    apDashIcon: () => '',
    isClassVisibleForCurrentTeacher: () => true,
    isClassScheduledOnDateForDashboard: () => false,
    renderDashboardAssistantMemoBlock: () => '',
    renderDashboardWeeklyScheduleSection: () => ''
  };
  vm.createContext(context);
  const src = [
    extractFunction(dashboardSource, 'apParseLocalDateTime', 'apFormatMonthDay'),
    extractFunction(dashboardSource, 'dashboardGetDdayLabel', 'getDashboardOnboardingDueLabel'),
    extractFunction(dashboardSource, 'renderTodoSections', 'renderTodayJournalCard')
  ].join('\n');
  vm.runInContext(`${src}\nglobalThis.__html = renderTodoSections();`, context);
  return context.__html;
}

const memos = [
  { id: 't', content: 'today-memo', memo_date: '2026-06-17' },
  { id: 'd3', content: 'd3-memo', memo_date: '2026-06-20' },
  { id: 'd7', content: 'd7-memo', memo_date: '2026-06-24' },
  { id: 'd8', content: 'd8-memo', memo_date: '2026-06-25' },
  { id: 'past', content: 'past-memo', memo_date: '2026-06-10' },
  { id: 'done', content: 'done-memo', memo_date: '2026-06-17', is_done: 1 },
  { id: 'pin', content: 'pinned-memo', memo_date: '2026-12-31', is_pinned: 1 }
];

test('오늘~+7일 이내 미완료 메모와 고정 메모만 표시한다', () => {
  const html = buildContext(memos);
  assert.match(html, /today-memo/);
  assert.match(html, /d3-memo/);
  assert.match(html, /d7-memo/);     // 정확히 +7일 경계는 표시
  assert.match(html, /pinned-memo/);
  assert.doesNotMatch(html, /d8-memo/);   // +8일은 미표시
  assert.doesNotMatch(html, /past-memo/); // 과거 미완료는 숨김(결정)
  assert.doesNotMatch(html, /done-memo/); // 완료는 숨김
});

test('메모 행에 D-Day 뱃지가 정확히 붙는다', () => {
  const html = buildContext(memos);
  assert.match(html, /D-Day/); // 오늘
  assert.match(html, /D-3/);   // +3일
  assert.match(html, /D-7/);   // +7일
  assert.match(html, /고정/);   // 고정 메모는 D-Day 대신 고정 뱃지
});

test('고정 메모가 날짜 메모보다 먼저 정렬된다', () => {
  const html = buildContext(memos);
  assert.ok(html.indexOf('pinned-memo') < html.indexOf('today-memo'), '고정 메모가 맨 위');
});

test('표시할 메모가 없으면 빈 상태 문구를 보여준다', () => {
  const html = buildContext([{ id: 'old', content: 'PASTONLYMEMO', memo_date: '2026-06-10' }]);
  assert.match(html, /표시할 메모가 없습니다/);
  assert.doesNotMatch(html, /PASTONLYMEMO/);
});

test('카드 제목이 "메모"로 바뀌었다', () => {
  const html = buildContext(memos);
  assert.match(html, /ap-dash-card__title">메모</);
  assert.doesNotMatch(html, /오늘일정/);
});

test('dashboardGetDdayLabel: D-Day / D-N / D+N 라벨이 정확하다', () => {
  const context = { Date: FakeDate, Math, String, Number };
  vm.createContext(context);
  const src = [
    extractFunction(dashboardSource, 'apParseLocalDateTime', 'apFormatMonthDay'),
    extractFunction(dashboardSource, 'dashboardGetDdayLabel', 'getDashboardOnboardingDueLabel')
  ].join('\n');
  vm.runInContext(src, context);
  assert.equal(context.dashboardGetDdayLabel('2026-06-17', '2026-06-17'), 'D-Day');
  assert.equal(context.dashboardGetDdayLabel('2026-06-20', '2026-06-17'), 'D-3');
  assert.equal(context.dashboardGetDdayLabel('2026-06-15', '2026-06-17'), 'D+2');
  assert.equal(context.dashboardGetDdayLabel('', '2026-06-17'), '');
});
