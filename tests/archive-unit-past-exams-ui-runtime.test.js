const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveRoot = path.join(repoRoot, 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));

function createRuntime() {
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
    questionIndex: [{
      sourceFile: 'original/high/h1/1mid/25_runtime.js', sourceOrdinal: 1, id: 1,
      grade: '고1', subject: '공통수학1', course: '공통수학1', standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산',
      question_uid: 'runtime-uid', subUnitKey: 'H22-C-01-CORE', subUnit: '핵심', level: '중'
    }],
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
  assert.match(runtime.getElement('unit-content').innerHTML, /반에 출제/);
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
