const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const dashSrc = fs.readFileSync(path.join(root, 'apmath/js/dashboard.js'), 'utf8');

function extractBetween(source, startFn, endFn) {
  const start = source.indexOf(`function ${startFn}`);
  const end = source.indexOf(`function ${endFn}`, start + 1);
  assert.ok(start >= 0 && end > start, `extractBetween: ${startFn} → ${endFn} not found`);
  return source.slice(start, end);
}

// Fixed base date: 2026-06-28 (Sun)
const BASE_DATE_STR = '2026-06-28';
const BASE_DATE_MS = new Date(BASE_DATE_STR + 'T00:00:00').getTime();

class FakeDate extends Date {
  constructor(...args) {
    if (args.length === 0) super(BASE_DATE_MS);
    else super(...args);
  }
  static now() { return BASE_DATE_MS; }
}

function buildWeeklyHtml(examSchedules, baseDateStr = BASE_DATE_STR) {
  const context = {
    Date: FakeDate,
    Math, String, Number,
    state: {
      db: { exam_schedules: examSchedules, academy_schedules: [] }
    },
    apEscapeHtml: (v) => String(v == null ? '' : v),
    apDashIcon: () => '',
    renderDashboardHoverPreview: () => '',
    renderOnboardingWeeklyScheduleRows: () => ''
  };
  vm.createContext(context);
  const code = [
    extractBetween(dashSrc, 'apParseLocalDateTime', 'apFormatMonthDay'),
    extractBetween(dashSrc, 'dashboardFormatDateWithDay', 'getDashboardAcademyScheduleSeries'),
    extractBetween(dashSrc, 'getDashboardAcademyScheduleSeries', 'renderDashboardWeeklyScheduleSection'),
    extractBetween(dashSrc, 'renderDashboardWeeklyScheduleSection', 'renderTodoSections')
  ].join('\n');
  vm.runInContext(
    `${code}\nglobalThis.__html = renderDashboardWeeklyScheduleSection('${baseDateStr}');`,
    context
  );
  return context.__html;
}

test('6/30~7/3 연속 4일 같은 시험 → HTML 1건으로 병합', () => {
  const exams = [
    { exam_date: '2026-06-30', school_name: '팔마', grade: '', exam_name: '기말고사', memo: '' },
    { exam_date: '2026-07-01', school_name: '팔마', grade: '', exam_name: '기말고사', memo: '' },
    { exam_date: '2026-07-02', school_name: '팔마', grade: '', exam_name: '기말고사', memo: '' },
    { exam_date: '2026-07-03', school_name: '팔마', grade: '', exam_name: '기말고사', memo: '' }
  ];
  const html = buildWeeklyHtml(exams);
  assert.equal((html.match(/팔마 기말고사/g) || []).length, 1, '4일 연속 시험이 1건으로 병합되어야 함');
  assert.match(html, /6\/30\(화\)~7\/3\(금\)/);
});

test('6/30, 7/1, 7/4 → 2구간 분리', () => {
  const exams = [
    { exam_date: '2026-06-30', school_name: '매산', grade: '고1', exam_name: '기말고사', memo: '' },
    { exam_date: '2026-07-01', school_name: '매산', grade: '고1', exam_name: '기말고사', memo: '' },
    { exam_date: '2026-07-04', school_name: '매산', grade: '고1', exam_name: '기말고사', memo: '' }
  ];
  const html = buildWeeklyHtml(exams);
  assert.equal((html.match(/매산 고1 기말고사/g) || []).length, 2, '날짜 끊긴 시험은 2구간으로 분리되어야 함');
  assert.match(html, /6\/30\(화\)~7\/1\(수\)/);
  assert.match(html, /7\/4\(토\)/);
});

test('어제~내일 이어지는 시험 → 진행중 표시', () => {
  // today=6/28(Sun), 어제=6/27(Sat), 내일=6/29(Mon)
  const exams = [
    { exam_date: '2026-06-27', school_name: '한빛고', grade: '', exam_name: '기말고사', memo: '' },
    { exam_date: '2026-06-28', school_name: '한빛고', grade: '', exam_name: '기말고사', memo: '' },
    { exam_date: '2026-06-29', school_name: '한빛고', grade: '', exam_name: '기말고사', memo: '' }
  ];
  const html = buildWeeklyHtml(exams);
  assert.match(html, /진행중/, '어제 시작 시험은 진행중으로 표시되어야 함');
  assert.doesNotMatch(html, /D-Day/, 'D-Day가 아니라 진행중이어야 함');
});
