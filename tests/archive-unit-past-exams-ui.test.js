const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const archiveRoot = path.resolve(__dirname, '..', 'archive');
const html = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.html'), 'utf8');
const js = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');
const css = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.css'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(archiveRoot, 'mixed_engine.html'), 'utf8');
const fallbackFixture = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'unit-past-exams-fallback.html'), 'utf8');

test('단원별 기출 페이지는 승인 메타데이터와 새 출제 UI를 연결한다', () => {
  assert.match(html, /question-meta\.js/);
  assert.match(html, /unit-past-exams\.css\?v=20260827b/);
  assert.match(html, /question-index\.js\?v=20260827a/);
  assert.match(html, /unit-past-exams-core\.js\?v=20260827b/);
  for (const id of ['unit-subunits', 'unit-difficulty', 'unit-mode', 'unit-quick-preset', 'unit-quick-count', 'unit-advanced-rows', 'unit-selection-report', 'unit-collection-scope', 'unit-collection-year-mode', 'unit-collection-schools', 'unit-collection-output', 'unit-collection-report']) {
    assert.match(js, new RegExp(id));
  }
  for (const method of ['generatePaper', 'generateCollectionPapers', 'updateCollectionFilter', 'resetCollectionFilter', 'filterCollectionSchools', 'selectAllCollectionSchools', 'clearCollectionSchools', 'addBlueprintRow', 'updateBlueprintRow', 'reduceRequestedCount', 'enableAdjacentDifficulty', 'enableUnclassified', 'printPaper', 'assignPaper']) {
    assert.match(js, new RegExp(`window\\.UnitPastExams = \\{[\\s\\S]*${method}`));
  }
  assert.match(js, /clearSelectionPreview\(\)/);
  assert.match(js, /blueprint/);
  assert.match(js, /window\.addEventListener\('popstate'/);
  assert.match(js, /renderSafeFallback/);
  assert.match(js, /limitExceeded/);
  assert.match(js, /includeUnclassified/);
  assert.match(js, /core\.splitIntoPapers\(result\.selected/);
  assert.match(js, /options\.restore \|\| !state\.filterState/);
  assert.match(js, /core\.getQuestionUid\(question\)/);
  assert.match(js, /core\.isSubUnitInParentScope/);
  assert.match(js, /aria-pressed=/);
  assert.match(js, /state\.selectedUnitKey === unit\.key/);
  assert.match(js, /event\.key !== 'Enter' && event\.key !== ' '/);
  assert.match(js, /papers\.map\(paper =>/);
  assert.match(js, /최근 3·5개년은 빈 연도를 억지로 만들지 않고/);
  assert.match(js, /unit-collection-semester/);
  assert.match(js, /unit-collection-exam-type/);
  assert.match(js, /unit-collection-school-search/);
  assert.match(js, /aria-label="모아뽑기 단원 범위"/);
});

test('출제 UI는 작은 화면과 키보드 포커스를 위한 스타일을 포함한다', () => {
  assert.match(css, /@media \(max-width: 580px\)/);
  assert.match(css, /:focus/);
  assert.match(css, /\.unit-page, \.unit-page \*/);
  assert.doesNotMatch(css, /^\*\s*\{/m);
  assert.doesNotMatch(css, /^body\s*\{/m);
  assert.match(css, /min-width: 44px/);
  assert.match(css, /grid-template-columns: 1fr; align-items: stretch/);
  assert.match(css, /unit-advanced-fields/);
  assert.match(css, /unit-filter-actions/);
  assert.match(html, /id="unit-status"[^>]*aria-live="polite"/);
  assert.match(fallbackFixture, /unit-past-exams\.js\?v=20260827b/);
  assert.match(js, /기존 아카이브 전체 문제지로 이동/);
  assert.match(js, /sourceSummary/);
  assert.match(mixedEngine, /AppState\.meta\?\.sourceSummary/);
});
