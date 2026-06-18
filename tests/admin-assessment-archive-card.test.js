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

const overviewMatch = dashboardAdmin.match(/function\s+renderAdminStudentOverviewPanel\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(overviewMatch, 'renderAdminStudentOverviewPanel should exist');
const overviewBody = overviewMatch[1];

assert(
  /function\s+adminBuildGradeHoverRows\s*\(/.test(dashboardAdmin),
  'admin overview should build grade-level hover rows for student metrics'
);
assert(
  dashboardAdmin.includes('ap-owner-stat__tip') && overviewBody.includes('adminBuildGradeHoverRows(data.activeStudents)'),
  'student overview stat cards should show a grade breakdown on hover'
);
assert(
  overviewBody.includes("renderAdminOverviewStatCard('재원생'") &&
    overviewBody.includes("renderAdminOverviewStatCard('최근 등록'") &&
    overviewBody.includes("renderAdminOverviewStatCard('휴원·퇴원'"),
  'first-screen overview should render the three large stat cards (재원생 / 최근 등록 / 휴원·퇴원)'
);
const statCardMatch = dashboardAdmin.match(/function\s+renderAdminOverviewStatCard\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(statCardMatch, 'renderAdminOverviewStatCard should exist');
const statCardBody = statCardMatch[1];
assert(
  statCardBody.includes('ap-owner-stat__icon') &&
    statCardBody.includes('${iconSvg}') &&
    /ap-owner-stat__title[^>]*>\$\{safeLabel\}/.test(statCardBody),
  'overview stat card face should show a line icon plus the large label'
);
assert(
  !statCardBody.includes('••') && !statCardBody.includes('ap-owner-stat__num'),
  'overview stat card face should not render the masked/blurred number anymore'
);
assert(
  !/\.ap-owner-stat__num\s*\{[^}]*filter\s*:\s*blur/.test(dashboardAdmin),
  'overview stat card numbers should not use the blur treatment'
);
assert(
  /ap-owner-stat__tip-title[\s\S]*?\$\{safeValue\}/.test(statCardBody),
  'the real count should still be revealed only in the hover tooltip'
);
assert(
  /renderAdminOverviewStatCard\('재원생',[^,]+,\s*'blue',\s*icoActive/.test(dashboardAdmin) &&
    /renderAdminOverviewStatCard\('최근 등록',[^,]+,\s*'green',\s*icoRecent/.test(dashboardAdmin) &&
    /renderAdminOverviewStatCard\('휴원·퇴원',[^,]+,\s*'amber',\s*icoLeave/.test(dashboardAdmin),
  'each stat card should pass a tone and a dedicated line icon'
);
assert(
  !dashboardCombined.includes('title="${hoverText}"'),
  'student metric hover details should use the custom hover panel instead of the browser title tooltip'
);

const shortcutMatch = dashboardAdmin.match(/ap-admin-shortcuts[\s\S]*?ap-surface-toolbar--five([\s\S]*?)`;/);
assert(shortcutMatch, 'admin shortcut row should exist and use the five-column toolbar');
const shortcutBody = shortcutMatch[1];
assert(
  shortcutBody.includes('시험지 보관함') &&
    shortcutBody.includes('openAdminAssessmentArchiveWindow(event)') &&
    shortcutBody.includes('../archive/assessment/assessment-mvp.html'),
  'assessment archive should be a top action button in the shortcut row'
);
assert(
  !overviewBody.includes('시험지 보관함') && !overviewBody.includes('renderAdminAssessmentArchiveMetric'),
  'assessment archive should no longer live inside the first-screen overview grid'
);
assert(
  !overviewBody.includes('renderAdminMiniMetric('),
  'overview should use the large stat cards instead of the old mini metrics'
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
