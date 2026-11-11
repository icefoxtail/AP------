const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveRoot = path.join(repoRoot, 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));

function createRuntime(options = {}) {
  let currentUrl = new URL('http://unit.test/archive/unit-past-exams.html?grade=h1&unit=H22-C-01');
  const elements = new Map();
  const difficultyInputs = [];
  const cards = [];

  class FakeElement {
    constructor(id = '') {
      this.id = id; this.innerHTML = ''; this.textContent = ''; this.value = 'exam';
      this.checked = false; this.style = {}; this.dataset = {}; this.attributes = {};
      this.classList = { toggle: (name, on) => { this.attributes[`class:${name}`] = Boolean(on); } };
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    scrollIntoView() {}
    get selectedOptions() { return []; }
  }
  const getElement = id => {
    if (!elements.has(id)) elements.set(id, new FakeElement(id));
    return elements.get(id);
  };
  const document = {
    body: { appendChild() {} },
    createElement: () => new FakeElement(),
    getElementById: getElement,
    querySelectorAll(selector) {
      if (selector === '.unit-card') return cards;
      if (selector === 'input[name="unit-difficulty"]:checked') return difficultyInputs;
      return [];
    },
    querySelector(selector) {
      if (selector === 'input[name="unit-mode"]:checked') return getElement('unit-mode-quick');
      if (selector === '.unit-advanced-fields' || selector === '.unit-quick-fields') return getElement(selector);
      return null;
    }
  };
  const setUrl = next => {
    currentUrl = new URL(next, currentUrl);
    window.location = currentUrl;
  };
  const history = {
    pushState(_state, _title, url) { setUrl(url); },
    replaceState(_state, _title, url) { setUrl(url); }
  };
  const window = {
    UnitPastExamsCore: core,
    questionIndex: options.questionIndex || [{
      sourceFile: 'original/high/h1/1mid/25_runtime.js', sourceOrdinal: 1, id: 1,
      grade: '고1', subject: '공통수학1', course: '공통수학1', standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산',
      question_uid: 'runtime-uid', subUnitKey: 'H22-C-01-CORE', subUnit: '핵심', level: '중'
    }],
    ...(options.window || {}),
    location: currentUrl,
    addEventListener() {},
    scrollTo() {}
  };
  const context = {
    window, document, history, console, URL, URLSearchParams, Map, Set, Date, Math, Number, String, Boolean, Array, JSON,
    localStorage: { getItem() { return null; }, setItem() {} },
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    btoa: value => Buffer.from(value, 'binary').toString('base64')
  };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8'), context, { filename: 'unit-past-exams.js' });
  getElement('unit-mode-quick').value = 'quick';
  getElement('unit-quick-count').value = '12';
  return { window, document, history, elements, difficultyInputs, cards, getElement, setUrl, get url() { return currentUrl.toString(); } };
}

test('Archive 2.0 ready 화면은 단원 x 단계 표 한 화면이고 칸을 눌러 바로 문제지를 만든다', () => {
  const runtime = createRuntime();
  runtime.setUrl('http://unit.test/archive/unit-past-exams.html?ready=1&grade=h1');
  runtime.window.UnitPastExams.selectProfile('h1');
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /class="ug-table"/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /유사문제 먼저, 기출 다음/);
  assert.match(html, /aria-disabled="true"/, '유사문제 탭은 자리만 있고 누를 수 없다');
  assert.match(html, /유사문제 단계 작업이 끝나면 열립니다/);
  assert.match(html, /aria-label="다항식의 연산 단계 미지정 1문항"/);
  assert.match(html, /세분 출제/);
  assert.match(html, /있는 만큼 전부/);
  assert.doesNotMatch(html, /unit-ready-paper|previewExistingPaper|fa-(solid|regular)/);
  assert.match(html, /id="ug-go"[^>]*disabled/, '아무것도 안 골랐으면 문제지 보기는 비활성');

  // 칸을 누르면 막힘 없이 바로 문제지가 만들어진다(문항이 1개여도 예외 없음).
  runtime.window.UnitPastExams.gridToggleCell('H22-C-01', 'none');
  assert.match(runtime.getElement('ug-bar').innerHTML, /1문항 · 1권/);
  assert.match(runtime.getElement('ug-table').innerHTML, /aria-pressed="true"/);
  // 칸마다 15문항이어도 모자란 칸은 막지 않고 있는 만큼만 넣는다.
  runtime.window.UnitPastExams.gridSetPer('15');
  assert.match(runtime.getElement('ug-bar').innerHTML, /1문항 · 1권/);
  assert.match(runtime.getElement('ug-bar').innerHTML, /모자란 칸 1곳은 있는 만큼만/);
  assert.match(runtime.getElement('ug-table').innerHTML, /is-short/);
  runtime.window.UnitPastExams.gridShowPapers();
  // 버튼 글자는 `출제`다(옛 `반에 출제`를 줄였다). 한 권뿐이면 전체 출제 버튼은 없다.
  assert.match(runtime.getElement('unit-content').innerHTML, /aria-label="[^"]* 출제">출제<\/button>/);
  assert.doesNotMatch(runtime.getElement('unit-content').innerHTML, /반에 출제|전체 출제/);
  // 줄 제목은 그 권을 구별해 주는 것(최신순이면 연도)이고, 고치기 버튼이 있다. 출력에 쓰는 title은 그대로 둔다.
  assert.match(runtime.getElement('unit-content').innerHTML, /<h3>2025년<\/h3>/);
  assert.match(runtime.getElement('unit-content').innerHTML, /gridOpenEdit\('grid-1'\)[^>]*>고치기</);
  assert.match(runtime.url, /view=papers/);
});

test('실제 UI 모듈 실행으로 같은 단원 popstate가 URL 상태를 다시 그린다', () => {
  const runtime = createRuntime();
  runtime.window.UnitPastExams.selectProfile('h1');
  runtime.window.UnitPastExams.renderDetail('H22-C-01', { noScroll: true, restore: true });

  const highInput = runtime.document.createElement();
  highInput.value = '상';
  runtime.difficultyInputs.push(highInput);
  runtime.window.UnitPastExams.updateDetailFilter();
  const changedUrl = runtime.url;
  assert.match(changedUrl, /difficulty=%EC%83%81/);
  assert.match(runtime.getElement('unit-filter-summary').textContent, /0문항/);

  runtime.setUrl('http://unit.test/archive/unit-past-exams.html?grade=h1&unit=H22-C-01');
  runtime.window.UnitPastExams.restoreFromUrl();
  assert.doesNotMatch(runtime.getElement('unit-detail-root').innerHTML, /value="상" checked/);
  assert.match(runtime.getElement('unit-filter-summary').textContent, /중 1/);
});

test('실제 UI 모듈 실행으로 snake_case UID가 catalog 정규화까지 전달된다', () => {
  const runtime = createRuntime();
  runtime.window.UnitPastExams.selectProfile('h1');
  runtime.window.UnitPastExams.renderDetail('H22-C-01', { noScroll: true, restore: true });
  assert.match(runtime.getElement('unit-content').innerHTML, /핵심/);
  assert.equal(core.getQuestionUid({ question_uid: 'runtime-uid' }), 'runtime-uid');
});

test('학년 첫 화면은 6개 카드이고 고3은 고2와 같은 5과목 선택 화면을 사용한다', () => {
  const runtime = createRuntime();
  runtime.window.UnitPastExams.clearProfileSelection();
  const grades = runtime.getElement('unit-content').innerHTML;
  for (const label of ['중1','중2','중3','고1','고2','고3']) assert.match(grades, new RegExp(label));
  assert.match(grades, /unit-grade-card/);

  // 이전 화면(세분 출제 쪽)은 그대로 과목 카드를 쓴다.
  runtime.setUrl('http://unit.test/archive/unit-past-exams.html?grade=h3');
  runtime.window.UnitPastExams.selectProfile('h3');
  const subjects = runtime.getElement('unit-content').innerHTML;
  for (const label of ['대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하']) assert.match(subjects, new RegExp(label));
  assert.match(subjects, /unit-subject-card/);
  assert.match(runtime.getElement('unit-kicker').textContent, /고3/);
  // 새 표 화면은 학년 버튼 6개와 같은 5과목 전환을 쓴다.
  runtime.setUrl('http://unit.test/archive/unit-past-exams.html?ready=1&grade=h3');
  runtime.window.UnitPastExams.selectProfile('h3');
  const grid = runtime.getElement('unit-content').innerHTML;
  for (const label of ['중1','중2','중3','고1','고2','고3']) assert.match(grid, new RegExp(`data-profile="[mh]\\d"[^>]*>${label}<`));
  for (const label of ['대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하']) assert.match(grid, new RegExp(`>${label}</button>`));
  assert.match(grid, /class="ug-courses"/);
});

// ---- 단원별 기출 출제를 화면 안 패널로 (2026-11-11) ----
// 한 단원에 문항 130개(원본 시험지 26개)를 두어 문제지가 여러 권 나오게 한다.
const manyRecords = Array.from({ length: 130 }, (_, index) => ({
  sourceFile: `original/high/h1/1mid/25_runtime_${String(Math.floor(index / 5)).padStart(2, '0')}.js`, sourceOrdinal: (index % 5) + 1, id: (index % 5) + 1,
  grade: '고1', subject: '공통수학1', course: '공통수학1', standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산',
  question_uid: `runtime-uid-${index}`, subUnitKey: 'H22-C-01-CORE', subUnit: '핵심', level: '중'
}));
function openPapersView(runtime) {
  runtime.setUrl('http://unit.test/archive/unit-past-exams.html?ready=1&grade=h1');
  runtime.window.UnitPastExams.selectProfile('h1');
  runtime.window.UnitPastExams.gridToggleCell('H22-C-01', 'none');
  runtime.window.UnitPastExams.gridShowPapers();
  return runtime.getElement('unit-content').innerHTML;
}
const fakePanel = (opened, { legacy = false } = {}) => ({
  open: options => { opened.push(options); return {}; }, isOpen: () => false, useLegacy: () => legacy, handlePopState: () => false,
});

test('여러 권이면 `전체 출제 (N권)` 버튼이 있고, 권마다 버튼은 `출제`다', () => {
  const opened = [];
  const runtime = createRuntime({ questionIndex: manyRecords, window: { Archive2Assign: fakePanel(opened) } });
  const html = openPapersView(runtime);
  const papers = (html.match(/class="ug-paper"/g) || []).length;
  assert.ok(papers >= 2, `문제지가 여러 권이어야 한다(${papers})`);
  assert.match(html, new RegExp(`class="ug-primary ug-assign-all"[^>]*>전체 출제 \\(${papers}권\\)</button>`));
  assert.equal((html.match(/class="ug-primary ug-assign"[^>]*>출제<\/button>/g) || []).length, papers);
  assert.doesNotMatch(html, /반에 출제/);
});

test('패널을 쓸 수 없으면(assign=legacy·스크립트 없음) 전체 출제 버튼이 없고 옛 iframe 경로로 간다', () => {
  for (const panel of [undefined, fakePanel([], { legacy: true })]) {
    const runtime = createRuntime({ questionIndex: manyRecords, window: panel ? { Archive2Assign: panel } : {} });
    const html = openPapersView(runtime);
    assert.ok((html.match(/class="ug-paper"/g) || []).length >= 2);
    assert.doesNotMatch(html, /전체 출제/);
    assert.match(html, /UnitPastExams\.assignPaper\(/, '권마다 `출제` 버튼은 옛 경로로 그대로 있다');
  }
  // 옛 경로 코드는 지우지 않았다.
  const js = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');
  assert.match(js, /unitPastAssign/);
  assert.match(js, /unit-ready-assignment/);
});

test('`출제`는 그 권 하나로, `전체 출제`는 모든 권으로 패널을 연다', () => {
  const opened = [];
  const runtime = createRuntime({ questionIndex: manyRecords, window: { Archive2Assign: fakePanel(opened) } });
  openPapersView(runtime);
  const html = runtime.getElement('unit-content').innerHTML;
  const papers = (html.match(/class="ug-paper"/g) || []).length;
  const first = html.match(/UnitPastExams\.assignPaper\('__grid__', '(grid-\d+)'/);
  assert.ok(first, '출제 버튼의 권 번호');
  runtime.window.UnitPastExams.assignPaper('__grid__', first[1], null);
  assert.equal(opened.length, 1);
  assert.equal(opened[0].items.length, 1);
  const item = opened[0].items[0];
  assert.equal(item.kind, 'unit');
  assert.match(item.snapshotKey, /^[a-zA-Z0-9_-]+$/);
  assert.ok(item.title && item.count > 0);
  assert.equal(opened[0].outputLinks, false, '단원 페이지에는 출력 처리기가 없어 결과 줄의 출력 버튼을 끈다');
  assert.equal(typeof opened[0].request, 'function');
  assert.equal(typeof opened[0].unit.load, 'function');
  assert.equal(runtime.getElement('unit-ready-assignment').innerHTML, '', 'iframe 모달은 열리지 않는다');
  runtime.window.UnitPastExams.assignAllPapers(null);
  assert.equal(opened.length, 2);
  assert.equal(opened[1].items.length, papers);
  assert.equal(new Set(opened[1].items.map(row => row.snapshotKey)).size, papers, '권마다 다른 문제지');
});

test('패널 request: 로그인이 없으면 요청 없이 status 401이다(패널이 로그인 안내를 그린다)', async () => {
  const opened = [];
  const runtime = createRuntime({ questionIndex: manyRecords, window: { Archive2Assign: fakePanel(opened) } });
  openPapersView(runtime);
  runtime.window.UnitPastExams.assignAllPapers(null);
  const request = opened[0].request;
  await assert.rejects(() => request('/qr-classes', { method: 'GET', timeoutMs: 30000 }), error => error.status === 401);
});
