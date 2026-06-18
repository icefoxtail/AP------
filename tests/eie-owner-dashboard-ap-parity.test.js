const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');
const css = (function(){ const idx = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8'); const list = (idx.match(/href="\.\/css\/(eie[\w-]*\.css)"/g) || []).map(function(m){ return m.replace(/^.*\/css\//, '').replace(/".*$/, ''); }); return list.map(function(f){ return fs.readFileSync(path.join(root, 'eie/css', f), 'utf8'); }).join('\n'); })();

const expectedRenderOrder = [
  'renderGate()',
  'renderActionGrid()',
  'renderOverview(data)',
  'renderTeacherStatus(data)',
  'renderRecentConsultationPanel(data)',
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

// [REDESIGN] 상단 바: 날짜 + 컴팩트 AP/EIE pill 토글 + 통합검색 (AP 새 디자인 언어와 정렬)
assert(
  source.includes('function renderTopbar(') && /\$\{renderTopbar\(\)\}/.test(source),
  'EIE dashboard should mount a top bar (date + AP/EIE toggle + search) like the AP redesign'
);

for (const requiredClass of [
  'eie-owner-topbar',
  'eie-owner-sysgate',
  'eie-owner-search',
  'ap-admin-shortcuts',
  'eie-owner-stat-grid',
  'ap-admin-teacher-grid'
]) {
  assert(source.includes(requiredClass), `EIE owner dashboard should render shell class ${requiredClass}`);
}

assert(
  source.includes('data-eie-route="attendance"') && source.includes('aria-label="EIE 출석부"'),
  'Attendance shortcut should be enabled and route to the implemented attendance board'
);

// [REDESIGN] 액션 버튼 라인 아이콘(출석부/시간표/성적표/관리)
assert(
  (source.match(/eie-action-ico/g) || []).length >= 4,
  'each EIE action shortcut should carry a line icon for visual parity with AP'
);

// [REDESIGN] 통계 카드 3개 — 아이콘 + 큰 라벨, 숫자 미노출, 호버 시 학년 브레이크다운
assert(
  source.includes("renderEieOverviewStatCard('재원생', 'blue'") &&
    source.includes("renderEieOverviewStatCard('최근 등록', 'green'") &&
    source.includes("renderEieOverviewStatCard('퇴원', 'amber'"),
  'EIE overview should render three large stat cards (재원생 / 최근 등록 / 퇴원) with tones'
);

const statMatch = source.match(/function\s+renderEieOverviewStatCard\s*\([^)]*\)\s*\{([\s\S]*?)\n    \}/);
assert(statMatch, 'renderEieOverviewStatCard should exist');
const statBody = statMatch[1];
assert(
  statBody.includes('eie-owner-stat__icon') &&
    statBody.includes('${iconSvg}') &&
    /eie-owner-stat__title[^>]*>\$\{esc\(label\)\}/.test(statBody) &&
    !statBody.includes('toLocaleString'),
  'stat card face should show an icon plus the label, never a bare count'
);
assert(
  statBody.includes('eie-owner-stat__tip') && source.includes('buildGradeHoverGrid('),
  'student counts should appear only in the hover tooltip (grade breakdown)'
);

// CSS: AP 셸 셀렉터 + 새 상단바/통계 카드 스타일이 EIE 스코프로 존재
for (const requiredCssSelector of [
  '.eie-admin-home .ap-admin-section',
  '.eie-admin-home .ap-admin-teacher-grid',
  '.eie-admin-home .eie-owner-topbar',
  '.eie-admin-home .eie-owner-stat',
  '.eie-admin-home .eie-owner-stat__tip'
]) {
  assert(css.includes(requiredCssSelector), `EIE CSS should style selector ${requiredCssSelector}`);
}

console.log('EIE owner dashboard AP parity regression test passed');
