const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const archiveRoot = path.resolve(__dirname, '..', 'archive');
const html = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.html'), 'utf8');
const js = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');
const css = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.css'), 'utf8');
const navigationCss = fs.readFileSync(path.join(archiveRoot, 'archive2-navigation.css'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(archiveRoot, 'mixed_engine.html'), 'utf8');
const archiveIndex = fs.readFileSync(path.join(archiveRoot, 'index.html'), 'utf8');
const fallbackFixture = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'unit-past-exams-fallback.html'), 'utf8');

test('단원별 기출 페이지는 승인 메타데이터와 출력·출제 모듈을 연결하고 새 틀로 바로 시작한다', () => {
  assert.match(html, /question-meta\.js/);
  assert.match(html, /unit-past-exams\.css\?v=20261116-polish-1/);
  // question-index.js is parsed only after the table skeleton is painted: the page preloads it and loads it from the runtime.
  assert.match(html, /<link rel="preload" as="script" href="question-index\.js\?v=20261110a">/);
  assert.doesNotMatch(html, /<script[^>]*src="question-index\.js/);
  assert.match(js, /QUESTION_INDEX_SRC = 'question-index\.js\?v=20261110a'/);
  // question-meta.js is shared with engine.html and mixer.html, so its version must match theirs.
  assert.match(html, /question-meta\.js\?v=archive-metadata-v1-phase1b-20260826b/);
  assert.ok(html.indexOf('archive2-canonical.js') < html.indexOf('archive2-core.js'), 'canonical core must load before its browser consumer');
  assert.ok(html.indexOf('archive2-output-contract.js') < html.indexOf('archive2-output.js'), 'output contract must load before its producer');
  assert.ok(html.indexOf('archive2-output.js') < html.indexOf('unit-past-exams.js'), 'Unit Past must load the existing Output Envelope producer first');
  assert.ok(html.indexOf('archive2-boot.js') < html.indexOf('meta-foundation-runtime.js'), 'the boot gate must exist before the metadata runtime starts fetching');
  assert.ok(html.indexOf('question-meta.js') < html.indexOf('meta-foundation-runtime.js'));
  assert.match(html, /archive2-core\.js\?v=20261119-pair-type-spread-1/);
  assert.match(html, /unit-past-exams-core\.js\?v=20261117-middle-parent-1/);
  assert.match(html, /unit-past-exams\.js\?v=20261119-no-basic-1/);
  // Every heavy script is deferred; only the asset base, the login rule and the menu run while the page is parsed.
  for (const script of html.match(/<script[^>]*src="[^"]+"[^>]*>/g)) {
    if (/archive-asset-base|archive2-session|archive2-navigation/.test(script)) assert.doesNotMatch(script, /defer/, script);
    else assert.match(script, /defer/, script);
  }
  assert.match(html, /id="boot-progress"[^>]*hidden/);
  assert.match(html, /id="unit-status"[^>]*aria-live="polite"/);
  // Old header, back button, empty progress band, gray loading status and Font Awesome never appear.
  assert.doesNotMatch(html, /unit-stepper|unit-back|unit-appbar[^>]*>\s*<button|is-loading|font-awesome|fa-solid|집계하는 중/i);
  assert.doesNotMatch(js, /fa-(solid|regular)|font-awesome/i);
  assert.doesNotMatch(css, /unit-stepper|\.unit-back|fa-/);
  assert.doesNotMatch(navigationCss, /unit-stepper|\.unit-back|unit-ready-paper/);
  assert.match(css, /\.boot-progress\b/);
  assert.match(css, /\.ug-skeleton\b/);
});

test('단원별 기출은 단원 x 단계 표 한 화면이다: 옛 3단계 화면과 세분 출제 코드는 없다', () => {
  for (const removed of ['openFineBuilder', 'renderCatalog', 'renderDetail', 'renderStepper', 'renderConfigStep', 'renderSourceStep', 'goToStep', 'selectSourceMode',
    'continueSource', 'generateUnifiedPreview', 'generatePaper', 'generateCollectionPapers', 'previewExistingPaper', 'renderStepSelector', 'renderShelfPaperButtons',
    'readyShelf', 'selectProfile', 'unit-grade-card', 'unit-subject-card', 'WORKFLOW_STEPS', 'QUICK_PRESETS', 'gridFineHref', '세분 출제',
    '기존 아카이브 전체 문제지로 이동', '기존 믹서 출제로 이동', 'mixedQuestions_', 'mixedMeta_', 'APMATH_UNIT_PAST_ASSIGN_', 'storeMixedSnapshot']) {
    assert.ok(!js.includes(removed), `${removed} must not come back`);
  }
  assert.match(js, /<button type="button" class="unit-btn primary" onclick="location\.reload\(\)">다시 시도<\/button>/);
  // The table's own pieces stay: 고치기 (preview + header + question swap), 출력, 출제 패널 and its 되돌림 길.
  for (const keep of ['renderConfirmation', 'gridOpenEdit', 'updatePrintHeaderOption', 'replaceSelectedQuestion', 'quickReplaceSelectedQuestion', 'undoLastQuestionReplacement',
    'tunePreviewFrame', 'selectPreviewPaper', 'printPaper', 'assignPaper', 'assignAllPapers', 'unitPastAssign', 'unit-ready-assignment', 'openAssignPanel']) {
    assert.ok(js.includes(keep), `${keep} must stay`);
  }
  for (const method of ['init', 'gridSelectGrade', 'gridRestoreFromUrl', 'gridPickGradeEarly', 'gridOpenEdit', 'gridLeaveEdit', 'printPaper', 'assignPaper', 'assignAllPapers'])
    assert.match(js, new RegExp(`window\\.UnitPastExams = \\{[^}]*\\b${method}\\b`));
  assert.match(js, /ARCHIVE_META_FOUNDATION_RUNTIME/);
  assert.match(js, /validateMetaFoundationSelection/);
  assert.match(js, /metaFoundationOwnedScope/);
  assert.match(js, /metaFoundationTaxonomyValid/);
  assert.match(js, /metaFoundationRuntimeAvailable/);
  assert.match(js, /isAutomaticSelectable/);
  assert.match(js, /catalog\.selectableCount/);
  assert.match(js, /Meta Foundation 연결 실패로 승인 메타 정보 없이 일반 출제합니다/);
  assert.match(js, /window\.addEventListener\('popstate'/);
  assert.match(js, /renderSafeFallback/);
  assert.match(js, /core\.getQuestionUid\(question\)/);
  assert.match(js, /core\.isSubUnitInParentScope/);
  assert.match(js, /prepareOutputEnvelope/);
  assert.match(js, /sourceKind: 'unit-past'/);
  assert.match(js, /qpp: Number\(getQpp\(\)\), includeQr: false/);
  assert.match(js, /outputEnvelopeUrl\(outputEnvelope, true\)/);
  assert.match(js, /popup\.location\.href = appendSessionHash\(outputEnvelopeUrl\(outputEnvelope\)\.href\)/);
  assert.match(archiveIndex, /outputMeta\?\.qpp/);
  assert.match(archiveIndex, /if \(item\?\.outputRequestId && item\?\.outputOwnerId\)/);
  assert.match(archiveIndex, /sourceKind: 'unit-past'/);
  assert.match(js, /aria-pressed=/);
  assert.match(js, /state\.generatedPapers\.length > 1/);
  assert.match(js, /doc\.body\.classList\.add\('screen-fit-mode'\)/);
  assert.match(js, /sourceSummary/);
  assert.match(mixedEngine, /AppState\.meta\?\.sourceSummary/);
});

test('옛 주소와 1.0 링크는 표 화면으로 열린다', () => {
  // 1.0의 자료 종류 "단원별 기출"은 새 화면 주소로 보낸다.
  assert.match(archiveIndex, /unit-past-exams\.html\?ready=1&grade=\$\{unitPastGrade\}/);
  assert.match(js, /LEGACY_URL_PARAMS = \[[\s\S]*'subUnit'[\s\S]*'blueprint'[\s\S]*'collectionIncludeUnclassified'[\s\S]*\]/);
  assert.match(js, /LEGACY_URL_PARAMS\.forEach\(key => url\.searchParams\.delete\(key\)\)/);
  assert.doesNotMatch(js, /get\('ready'\)/);
});

test('표 화면은 작은 화면과 키보드 포커스를 위한 스타일을 포함한다', () => {
  assert.match(css, /@media \(max-width: 580px\)/);
  assert.match(css, /:focus/);
  assert.match(css, /\.unit-page,\s*\n\.unit-page \*/);
  assert.doesNotMatch(css, /^\*\s*\{/m);
  assert.doesNotMatch(css, /^body\s*\{/m);
  assert.match(css, /min-width: 44px/);
  assert.match(css, /\.unit-confirmation \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /--archive2-mobile-bottom-nav-offset/);
  assert.match(css, /unit-preview-frame/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(fallbackFixture, /unit-past-exams\.js\?v=20260827c/);
});

test('단원별 기출 권의 해설·정답 머리글은 출력 봉투 경로에서도 출처 요약을 쓴다', () => {
  // 출력 봉투 경로에서는 AppState.key가 outputRequestId라 unitpast_ 접두로 알 수 없다: meta.category·봉투 sourceKind로 판별한다.
  assert.match(mixedEngine, /function isUnitPastOutput\(\)/);
  assert.match(mixedEngine, /startsWith\('unitpast_'\)[\s\S]{0,80}AppState\.meta\?\.category === '단원별 기출'[\s\S]{0,80}AppState\.outputEnvelope\?\.sourceKind === 'unit-past'/);
  assert.match(mixedEngine, /function getRenderHeaderSubtitle\(type\) \{\s*const opts = getPrintHeaderOptions\(\);\s*if \(isUnitPastOutput\(\)\)/);
  assert.match(js, /category: '단원별 기출'/);
});

test('긴 출처 요약은 시험 이름 중간이 아니라 " / " 경계에서 자르고 " 외 N개"를 붙인다', () => {
  const start = mixedEngine.indexOf('function clampSourceSummary(');
  const end = mixedEngine.indexOf('function getRenderHeaderSubtitle(', start);
  assert.ok(start > 0 && end > start);
  assert.match(mixedEngine.slice(end, end + 400), /clampSourceSummary\(AppState\.meta\?\.sourceSummary \|\| '', 180\)/);
  const clampText = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const clampSourceSummary = new Function('clampText', `${mixedEngine.slice(start, end)}; return clampSourceSummary;`)(clampText);
  const names = ['2026 · 금당고 · 1학기 중간', '2026 · 복성고 · 1학기 중간', '2026 · 효천고 · 1학기 중간', '2025 · 강남여고 · 1학기 중간',
    '2025 · 금당고 · 1학기 중간', '2025 · 순천여고 · 1학기 중간', '2025 · 강남여고 · 1학기 기말', '2024 · 강남여고 · 1학기 중간'];
  const long = `출처: ${names.join(' / ')}`;
  const cut = clampSourceSummary(long, 180);
  assert.ok(cut.length <= 180);
  assert.match(cut, /^출처: /);
  assert.match(cut, / 외 \d+개$/);
  const kept = cut.replace(/^출처: /, '').replace(/ 외 \d+개$/, '').split(' / ');
  kept.forEach(name => assert.ok(names.includes(name), `잘린 이름 없이 통째로 남는다: ${name}`));
  assert.equal(kept.length + Number(/ 외 (\d+)개$/.exec(cut)[1]), names.length);
  const short = '출처: 2026 · 금당고 · 1학기 중간 / 2025 · 강남여고 · 1학기 중간';
  assert.equal(clampSourceSummary(short, 180), short);
  const noSlash = '출처: ' + '가'.repeat(300);
  assert.equal(clampSourceSummary(noSlash, 180), clampText(noSlash, 180));
});
