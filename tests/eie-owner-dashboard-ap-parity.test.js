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
  'renderTeacherStatusPlaceholder()',
  'renderRecentConsultationPlaceholder()',
  'renderRecentStudents(data)',
  'renderNeedCheck(data)',
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
  'ap-admin-check-grid',
  'ap-admin-bottom-search'
]) {
  assert(source.includes(requiredClass), `EIE owner dashboard should reuse AP dashboard shell class ${requiredClass}`);
}

assert(
  (source.match(/준비중/g) || []).length >= 4,
  'Unimplemented EIE owner dashboard sections should remain in-place as 준비중'
);

for (const requiredCssSelector of [
  '.eie-admin-home .ap-admin-section',
  '.eie-admin-home .ap-admin-teacher-grid',
  '.eie-admin-home .ap-admin-check-grid',
  '.eie-admin-home .ap-admin-bottom-search'
]) {
  assert(css.includes(requiredCssSelector), `EIE CSS should style AP dashboard selector ${requiredCssSelector}`);
}

console.log('EIE owner dashboard AP parity regression test passed');
