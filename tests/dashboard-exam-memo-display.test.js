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
  assert.ok(start >= 0 && end > start, `extractBetween: ${startFn} to ${endFn} not found`);
  return source.slice(start, end);
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildWeeklyHtml(examSchedules, baseDateStr = '2026-06-28') {
  const context = {
    Date,
    Math,
    String,
    Number,
    state: {
      db: { exam_schedules: examSchedules, academy_schedules: [] }
    },
    apEscapeHtml: escapeHtml,
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
  vm.runInContext(`${code}\nglobalThis.__html = renderDashboardWeeklyScheduleSection('${baseDateStr}');`, context);
  return context.__html;
}

test('weekly dashboard displays grouped exam memo', () => {
  const html = buildWeeklyHtml([
    { exam_date: '2026-06-30', school_name: 'A', grade: 'G1', exam_name: 'Final', memo: '7/1 math' },
    { exam_date: '2026-07-01', school_name: 'A', grade: 'G1', exam_name: 'Final', memo: '7/1 math' },
    { exam_date: '2026-07-02', school_name: 'A', grade: 'G1', exam_name: 'Final', memo: '7/1 math' }
  ]);

  assert.match(html, /A G1 Final/);
  assert.match(html, /7\/1 math/);
});

test('weekly dashboard folds multiline memo and escapes html', () => {
  const html = buildWeeklyHtml([
    { exam_date: '2026-06-30', school_name: 'A', grade: '', exam_name: 'Final', memo: 'line <one>\nline & two' }
  ]);

  assert.match(html, /line &lt;one&gt; · line &amp; two/);
  assert.doesNotMatch(html, /line <one>/);
});

test('weekly dashboard keeps existing two-line display when memo is empty', () => {
  const html = buildWeeklyHtml([
    { exam_date: '2026-06-30', school_name: 'A', grade: '', exam_name: 'Final', memo: '' }
  ]);

  assert.match(html, /A Final/);
  assert.doesNotMatch(html, /undefined|null/);
});
