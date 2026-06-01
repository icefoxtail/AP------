const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const dashboardPath = path.join(root, 'apmath/js/dashboard.js');
const dashboard = fs.readFileSync(dashboardPath, 'utf8');
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const eieCss = fs.readFileSync(path.join(root, 'eie/css/eie.css'), 'utf8');

for (const file of [
  'archive/assessment/assessment-mvp.html',
  'archive/assessment/assessment-packs-1sem.generated.js',
  'archive/assessment/assessment-question-index-1sem.generated.js'
]) {
  assert(fs.existsSync(path.join(root, file)), `${file} should exist before wiring the dashboard card`);
}

const overviewMatch = dashboard.match(/function\s+renderAdminStudentOverviewPanel\s*\([^)]*\)\s*\{([\s\S]*?)\nfunction\s+renderAdminNeedCheckPanel/);
assert(overviewMatch, 'renderAdminStudentOverviewPanel should exist');
const overviewBody = overviewMatch[1];

assert(
  dashboard.includes('시험지 보관함') && overviewBody.includes('renderAdminAssessmentArchiveMetric'),
  'admin overview should render the assessment archive card title'
);
assert(
  dashboard.includes('진단평가 · 단원평가 · 중간·기말평가'),
  'admin overview should show the confirmed assessment archive helper text'
);
assert(
  overviewBody.includes('../archive/assessment/assessment-mvp.html'),
  'admin overview should link to the assessment MVP using the correct path from apmath/index.html'
);
assert(
  !overviewBody.includes("renderAdminMiniMetric('휴원'"),
  'admin overview should not keep the old leave card in the first-screen metric grid'
);
assert(
  /function\s+openAdminLeaveStudentList\s*\(/.test(dashboard) && dashboard.includes('휴원생 목록'),
  'leave student functionality should remain available outside the first-screen card'
);
assert(
  ui.includes('시험지 보관함') && ui.includes('../archive/assessment/assessment-mvp.html'),
  'teacher sidebar should include the assessment archive as a small menu item'
);

const eieSurfaceActionBlocks = Array.from(
  eieCss.matchAll(/\.eie-admin-shortcut,\s*\n\.eie-surface-action\s*\{([\s\S]*?)\n\}/g)
).map(match => match[1]);
assert(eieSurfaceActionBlocks.length > 0, 'EIE dashboard surface action styles should exist');
for (const block of eieSurfaceActionBlocks) {
  assert(
    /font-weight:\s*500\s*;/.test(block),
    'EIE owner dashboard gate and shortcut buttons should use AP dashboard font weight 500'
  );
}

console.log('admin assessment archive dashboard card regression test passed');
