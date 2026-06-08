const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'eie/css/eie.css'), 'utf8');

const expectedRenderOrder = [
  'renderGate()',
  'renderActionGrid()',
  'renderOverview(data)',
  'renderTeacherStatus(data)',
  'renderRecentConsultationPlaceholder()',
  'renderRecentStudents(data)',
  'renderWeeklySchedulePlaceholder()',
  'renderBottomSearchPlaceholder()'
];

let previousIndex = -1;
for (const token of expectedRenderOrder) {
  const index = source.indexOf(token);
  assert(index > previousIndex, `EIE owner dashboard should render ${token} in AP dashboard order`);
  previousIndex = index;
}

assert(
  !source.includes('renderStatusGrid') && !source.includes('eie-admin-status-grid'),
  'EIE dashboard should not keep its old custom status-grid layout'
);

for (const requiredClass of [
  'ap-admin-shortcuts',
  'ap-admin-overview-grid',
  'ap-admin-teacher-grid',
  'ap-admin-bottom-search'
]) {
  assert(source.includes(requiredClass), `EIE owner dashboard should reuse AP dashboard shell class ${requiredClass}`);
}

assert(
  (source.match(/준비중/g) || []).length >= 4,
  'Unimplemented EIE owner dashboard sections should remain in-place as 준비중'
);

assert(
  source.includes('EIE 출석부 준비중') && !source.includes('data-eie-route="classroom"'),
  'Attendance shortcut should be visible but disabled until the attendance book is implemented'
);

assert(source.includes("renderMiniMetric('재원'"), 'EIE owner dashboard should keep the active-student metric');
assert(source.includes("renderMiniMetric('최근 등록'"), 'EIE owner dashboard should keep the recent-student metric');
assert(!source.includes("renderMiniMetric('대기'"), 'EIE owner dashboard should remove the ambiguous waiting metric');
assert(!source.includes("renderMiniMetric('확인 필요'"), 'EIE owner dashboard should remove the ambiguous needs-review metric');
assert(!source.includes('renderNeedCheck(data)'), 'EIE owner dashboard should remove the lower needs-check placeholder section');

assert(
  source.includes('eie-admin-mini-metric__hover') && !source.includes('<strong>${Number(value || 0).toLocaleString'),
  'EIE today metrics should show text only by default and keep counts in the AP-style hover panel'
);

assert(
  source.includes('onclick="event.stopPropagation();') &&
    source.includes("classList.toggle('is-visible')"),
  'EIE today metrics should reveal the AP-style hover panel on click instead of navigating away'
);

assert(
  css.includes('.eie-admin-mini-metric__hover {') &&
    css.includes('opacity: 0;') &&
    css.includes('pointer-events: none;') &&
    css.includes('.eie-admin-mini-metric:hover .eie-admin-mini-metric__hover,') &&
    css.includes('.eie-admin-mini-metric__hover.is-visible {') &&
    css.includes('opacity: 1;'),
  'EIE today metric counts must stay hidden by default and appear only on hover/focus/click'
);

assert(
  css.includes('APMATH PORT LOCK') &&
    css.includes('default state must show label text only'),
  'EIE dashboard CSS should document the AP MATH metric behavior so it does not regress'
);

for (const requiredCssSelector of [
  '.eie-admin-home .ap-admin-section',
  '.eie-admin-home .ap-admin-teacher-grid',
  '.eie-admin-home .ap-admin-bottom-search'
]) {
  assert(css.includes(requiredCssSelector), `EIE CSS should style AP dashboard selector ${requiredCssSelector}`);
}

console.log('EIE owner dashboard AP parity regression test passed');
