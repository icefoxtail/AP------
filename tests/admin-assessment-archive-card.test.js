const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const dashboardPath = path.join(root, 'apmath/js/dashboard.js');
const dashboardAdminPath = path.join(root, 'apmath/js/dashboard-admin.js');
const dashboard = fs.readFileSync(dashboardPath, 'utf8');
const dashboardAdmin = fs.readFileSync(dashboardAdminPath, 'utf8');
const dashboardCombined = `${dashboardAdmin}\n${dashboard}`;
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const eieCss = (function(){ const idx = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8'); const list = (idx.match(/href="\.\/css\/(eie[\w-]*\.css)"/g) || []).map(function(m){ return m.replace(/^.*\/css\//, '').replace(/".*$/, ''); }); return list.map(function(f){ return fs.readFileSync(path.join(root, 'eie/css', f), 'utf8'); }).join('\n'); })();

for (const file of [
  'archive/assessment/assessment-mvp.html',
  'archive/assessment/assessment-packs-1sem.generated.js',
  'archive/assessment/assessment-question-index-1sem.generated.js'
]) {
  assert(fs.existsSync(path.join(root, file)), `${file} should exist before wiring the dashboard card`);
}

const overviewMatch = dashboardAdmin.match(/function\s+renderAdminStudentOverviewPanel\s*\([^)]*\)\s*\{([\s\S]*?)\nfunction\s+renderAdminNeedCheckPanel/);
assert(overviewMatch, 'renderAdminStudentOverviewPanel should exist');
const overviewBody = overviewMatch[1];

assert(
  /function\s+adminBuildGradeHoverRows\s*\(/.test(dashboardAdmin),
  'admin overview should build grade-level hover rows for student metrics'
);
assert(
  dashboardAdmin.includes('ap-admin-mini-metric__hover') && overviewBody.includes('adminBuildGradeHoverRows(data.activeStudents)'),
  'student overview metrics should show a larger grade breakdown on hover'
);
assert(
  overviewBody.includes("renderAdminMiniMetric('재원'") &&
    overviewBody.includes("renderAdminMiniMetric('최근등록'") &&
    overviewBody.includes("renderAdminMiniMetric('퇴원'"),
  'today operation student metrics should render Korean labels instead of bare counts'
);
assert(
  !dashboardCombined.includes('title="${hoverText}"'),
  'student metric hover details should use the custom hover panel instead of the browser title tooltip'
);

assert(
  dashboardAdmin.includes('시험지 보관함') && overviewBody.includes('renderAdminAssessmentArchiveMetric'),
  'admin overview should render the assessment archive card title'
);
assert(
  dashboardAdmin.includes('ap-admin-assessment-card') &&
    dashboardAdmin.includes('align-items:center; justify-content:center; text-align:center;'),
  'admin assessment archive card should center its label like the other mini metrics'
);
assert(
  dashboardAdmin.includes('진단평가 · 단원평가 · 중간·기말평가'),
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
  /function\s+openAdminLeaveStudentList\s*\(/.test(dashboardAdmin) && dashboardAdmin.includes('휴원생 목록'),
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
