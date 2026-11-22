// 2026-11-23 원본 시험지·해설 열기 속도: 선생님이 기다리는 시간을 늘리던 세 가지가 다시 생기지 않게 지킨다.
// 1) MathJax 의미 분석·낭독·점자·탐색기(수식 하나에 10ms+): engine.html이 문서가 만들어진 뒤 끈다.
// 2) 인쇄 머리글 맞춤(print-header-table.js)이 문서 어디서든 노드가 바뀔 때마다 프레임을 예약하던 것: 머리글이 생기거나 바뀔 때만 예약한다.
// 3) 해설 쪽 배치 측정(layout-materializer.js)이 측정 한 번마다 화면 프레임을 기다리던 것, 같은 상자를 칸에 다시 끼우던 것.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const read = file => fs.readFileSync(path.join(__dirname, '../archive', file), 'utf8');

test('engine.html turns MathJax enrichment, speech, braille and explorer off once the document exists', () => {
  const html = read('engine.html');
  const pageReady = html.slice(html.indexOf('function prepareEnclosedLatinMathJax'), html.indexOf('window.MathJax = {'));
  for (const key of ['enableEnrichment', 'enableSpeech', 'enableBraille', 'enableExplorer', 'enableComplexity']) {
    assert.ok(pageReady.includes(`'${key}'`), `${key} is switched off in the pageReady hook`);
  }
  assert.match(pageReady, /startup\.document\.options\[key\]\s*=\s*false/);
  // window.MathJax.options 에 쓰면 확장이 덮어써서 소용없다(실측). 설정 객체에는 메뉴 끄기만 둔다.
  assert.match(html, /options: \{ enableMenu: false \},/);
});

test('mixed_engine.html switches the same MathJax features off in pageReady (keeps PDF before/after math markup stable)', () => {
  const html = read('mixed_engine.html');
  const pageReady = html.slice(html.indexOf('pageReady()'), html.indexOf('window.__AP_MATHJAX_SOURCE__'));
  for (const key of ['enableEnrichment', 'enableSpeech', 'enableBraille', 'enableExplorer', 'enableComplexity']) {
    assert.ok(pageReady.includes(`'${key}'`), `${key} is switched off in the pageReady hook`);
  }
  assert.match(pageReady, /startup\.document\.options\[key\]\s*=\s*false/);
  assert.match(pageReady, /return startup\.defaultPageReady\(\)/);
  assert.match(html, /options: \{ enableMenu: false \},/);
});

function loadPrintHeaderTable() {
  const frames = [];
  const observers = [];
  class FakeObserver { constructor(callback) { this.callback = callback; observers.push(this); } observe() {} }
  const document = {
    readyState: 'complete', body: {}, documentElement: { classList: { contains: () => false } },
    addEventListener() {}, querySelectorAll: () => [],
  };
  const window = {
    requestAnimationFrame: fn => { frames.push(fn); return frames.length; },
    addEventListener() {}, localStorage: { getItem: () => '', setItem() {} },
    matchMedia: () => ({ matches: true, addEventListener() {} }), getComputedStyle: () => ({}),
  };
  window.window = window; window.document = document;
  const context = vm.createContext({ window, document, MutationObserver: FakeObserver, setTimeout: () => 0, console });
  vm.runInContext(read('print-header-table.js'), context, { filename: 'print-header-table.js' });
  const runFrames = () => { while (frames.length) frames.shift()(); };
  runFrames(); // start()가 한 번 예약한 첫 맞춤
  return { observer: observers[0], frames, runFrames };
}

function element({ headerAncestor = false, matchesPageOrHeader = false, containsHeader = false } = {}) {
  return {
    nodeType: 1,
    querySelectorAll: () => [],
    closest: selector => (headerAncestor && selector === '.page-header' ? {} : null),
    matches: selector => matchesPageOrHeader && /\.page/.test(selector),
    querySelector: selector => (containsHeader && selector === '.page-header' ? {} : null),
  };
}

test('print header fitting is scheduled only when a header appears or changes', () => {
  const { observer, frames, runFrames } = loadPrintHeaderTable();
  assert.ok(observer, 'the mutation observer is installed');

  // 수식 조판·측정 중 문서 안 어디서든 일어나는 변화는 프레임을 만들지 않는다.
  const noise = Array.from({ length: 50 }, () => ({ target: element(), addedNodes: [element(), { nodeType: 3 }] }));
  observer.callback(noise);
  assert.equal(frames.length, 0, 'unrelated DOM churn schedules nothing');

  observer.callback([{ target: element({ headerAncestor: true }), addedNodes: [] }]);
  assert.equal(frames.length, 1, 'a change inside .page-header schedules one fit');
  runFrames();

  observer.callback([{ target: element(), addedNodes: [element({ matchesPageOrHeader: true })] }]);
  assert.equal(frames.length, 1, 'an added .page or .page-header schedules one fit');
  runFrames();

  observer.callback([{ target: element(), addedNodes: [element({ containsHeader: true })] }]);
  assert.equal(frames.length, 1, 'an added container holding a .page-header schedules one fit');
  runFrames();

  // 문자 노드가 머리글 안에 들어가는 변화(제목 글자 바꿈)도 놓치지 않는다.
  const textNodeTarget = { nodeType: 3, parentElement: element({ headerAncestor: true }) };
  observer.callback([{ target: textNodeTarget, addedNodes: [] }]);
  assert.equal(frames.length, 1, 'text changes in a header are noticed through the parent element');
});

test('solution measuring does not wait for a screen frame per measurement and keeps a measured box in place', () => {
  const source = read('layout-materializer.js');
  const solution = source.slice(source.indexOf('async function solution('));
  assert.equal((solution.match(/await deps\.raf\(\)/g) || []).length, 1, 'only the time-budgeted yield awaits a frame');
  assert.match(solution, /const yieldMeasure = async \(\) => \{\s*if \(clockNow\(\) - lastMeasureYield < MEASURE_YIELD_BUDGET_MS\) return;\s*await deps\.raf\(\);/);
  assert.equal((solution.match(/await yieldMeasure\(\)/g) || []).length, 2, 'both query-loop waits use the budgeted yield');
  assert.match(solution, /host\.childNodes\.length !== 2 \|\| host\.firstChild !== node \|\| host\.lastChild !== marker\) host\.replaceChildren\(node, marker\)/);
});
