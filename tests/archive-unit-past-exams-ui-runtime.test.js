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
