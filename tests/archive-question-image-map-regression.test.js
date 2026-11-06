const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const solutionExecutor = require('../archive/solution-render-executor.js');

const DEFAULT_TIMEOUT_MS = 1200;

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  add(...names) {
    names.forEach(name => this.values.add(name));
  }

  remove(...names) {
    names.forEach(name => this.values.delete(name));
  }

  contains(name) {
    return this.values.has(name);
  }
}

class PendingImage {
  constructor(id) {
    this.tagName = 'IMG';
    this.id = id;
    this.complete = false;
    this.resolve = null;
  }
}

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.dataset = {};
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.className = '';
    this.style = {};
    this.clientHeight = 100;
    this.scrollHeight = 0;
    this._innerHTML = '';
  }

  set innerHTML(value) {
    this._innerHTML = String(value ?? '');
    this.children = [];
    if (this._innerHTML.includes('class="sol-exp"')) {
      const explanation = new FakeElement('div');
      explanation.className = 'sol-exp';
      this.appendChild(explanation);
    }
    for (const match of this._innerHTML.matchAll(/<img\b[^>]*data-test-image="([^"]+)"[^>]*>/g)) {
      this.appendChild(new PendingImage(match[1]));
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  appendChild(child) {
    child.parentNode?.removeChild(child);
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  append(...children) {
    children.forEach(child => this.appendChild(child));
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) this.children.splice(index, 1);
    child.parentNode = null;
    return child;
  }

  remove() {
    this.parentNode?.removeChild(this);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = node => {
      for (const child of node.children || []) {
        const isMatch = selector === 'img'
          ? child.tagName === 'IMG'
          : selector === '.sol-exp'
            ? child.className === 'sol-exp'
            : selector === '.sol-box'
              ? child.className.split(/\s+/).includes('sol-box')
              : false;
        if (isMatch) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    if (this.attributes.has(name)) return this.attributes.get(name);
    if (name === 'data-source-ref') return this.dataset.sourceRef || null;
    return null;
  }
}

function makeDependencies(staging, calls) {
  const document = {
    createElement: tagName => new FakeElement(tagName),
    getElementById: id => id === 'staging' ? staging : null
  };

  return {
    document,
    Node: FakeElement,
    stagingHost: staging,
    appState: {},
    makePage: () => ({ body: new FakeElement('section') }),
    typesetMath: async () => {},
    raf: async () => {},
    autoCompress: () => {},
    makeSolutionHtmlChunks: () => ['풀이'],
    makeLongSolutionShell: () => {
      const shell = new FakeElement('div');
      shell.className = 'q-box sol-box';
      shell.appendChild(Object.assign(new FakeElement('div'), { className: 'sol-exp' }));
      return shell;
    },
    renderSolutionImageHTML: question => `<img data-test-image="${question.id}">`,
    formatSolutionHtml: value => String(value ?? ''),
    formatQuestionContent: value => String(value ?? ''),
    getArchiveQuestionSourceRef: (question, index) => `test:${question.id}:${index}`,
    normalizeQuestionImageSources: root => root.querySelectorAll('img'),
    waitForQuestionImage: (image, timeoutMs = DEFAULT_TIMEOUT_MS) => {
      calls.push({ image, timeoutMs });
      return new Promise(resolve => { image.resolve = resolve; });
    },
    rendererMode: () => 'batch',
    wrapLatex: value => String(value ?? ''),
    stripInlineImagesFromContent: value => String(value ?? ''),
    sanitizeProtectedSegments: value => value,
    normalizeQuestionNotes: value => value,
    normalizeViewBlocks: value => value,
    normalizeQuestionTables: value => value,
    measureSolutionOuterFootprint: () => 1
  };
}

test('pending solution images share the initial asset budget without receiving Array.map indexes', async () => {
  const staging = new FakeElement('div');
  const calls = [];
  const deps = makeDependencies(staging, calls);
  const renderPromise = solutionExecutor.render({
    area: new FakeElement('main'),
    data: [{ id: 'image-1', solution: 'one' }, { id: 'image-2', solution: 'two' }, { id: 'image-3', solution: 'three' }],
    deps
  });

  assert.equal(calls.length, 3, 'all pending images should enter the Array.map path');
  assert.deepEqual(calls.map(call => call.image.complete), [false, false, false]);
  assert.deepEqual(
    calls.map(call => call.timeoutMs),
    [15000, 15000, 15000],
    'Array.map indexes must not become timeoutMs values'
  );

  calls.forEach(({ image }) => image.resolve());
  await renderPromise;
});

test('archive solution image map call sites do not pass Array.map indexes as timeouts', () => {
  const root = path.resolve(__dirname, '..');
  const files = [
    'archive/engine.html',
    'archive/mixed_engine.html',
    'archive/solution-render-executor.js'
  ];
  const directCallback = /\.map\(\s*(?:deps\.)?waitForQuestionImage\s*\)/;

  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, directCallback, `${file}: Array.map must not pass its index to waitForQuestionImage`);
  }
});

function solutionPlacementFixture({ rendererMode = 'batch', cancelAt = Infinity, longSolution = false } = {}) {
  // A synchronous layout model checks pagination decisions and cooperative
  // cancellation. Actual font/image/MathJax geometry remains a Chrome gate.
  const clock = { now: 0 };
  const sandbox = { module: { exports: {} }, performance: { now: () => clock.now } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../archive/solution-render-executor.js'), 'utf8'), sandbox);
  const executor = sandbox.module.exports;
  const staging = new FakeElement('div');
  const area = new FakeElement('main');
  const deps = makeDependencies(staging, []);
  const data = longSolution
    ? [{ id: 'long', solution: Array.from({ length: 40 }, (_, index) => `chunk-${index}`).join('|') }]
    : Array.from({ length: 50 }, (_, index) => ({ id: `q-${index}`, solution: `solution-${index}` }));
  const naturalHeights = new Map(data.map((question, index) => [question.id, longSolution ? 1200 : 60 - index % 2 * 10]));
  const frames = [];
  const mathCalls = [];
  const measurements = [];
  const progress = [];
  let layoutReads = 0;
  let compressions = 0;
  const height = box => box.dataset.testShell
    ? 10 + box.querySelector('.sol-exp').children.length * 30
    : naturalHeights.get(box.dataset.sourceRef) - (box.dataset.testCompressed ? 10 : 0);
  deps.document.createElement = tagName => {
    const node = new FakeElement(tagName);
    Object.defineProperty(node, 'scrollHeight', { configurable: true, get() {
      if (!node.className.split(/\s+/).includes('sol-grid-col')) return 0;
      clock.now += 2;
      layoutReads += 1;
      return node.children.reduce((sum, child) => sum + height(child), 0);
    } });
    return node;
  };
  deps.makePage = () => {
    const body = new FakeElement('section');
    area.appendChild(body);
    return { body };
  };
  deps.raf = async () => {
    if (!area.children.length) return;
    frames.push(clock.now);
    if (clock.now >= cancelAt) throw Error('ABORTED');
  };
  deps.typesetMath = async label => { mathCalls.push(label); };
  deps.autoCompress = box => { compressions += 1; box.dataset.testCompressed = '1'; };
  deps.renderSolutionImageHTML = () => '';
  deps.getArchiveQuestionSourceRef = question => question.id;
  deps.makeSolutionHtmlChunks = html => String(html).split('|');
  deps.makeLongSolutionShell = source => {
    const shell = new FakeElement('div');
    shell.className = 'q-box sol-box';
    shell.dataset.sourceRef = source.dataset.sourceRef;
    shell.dataset.testShell = '1';
    shell.appendChild(Object.assign(new FakeElement('div'), { className: 'sol-exp' }));
    return shell;
  };
  deps.rendererMode = () => rendererMode;
  deps.measurementMode = () => 'batch';
  deps.layoutPlannerMode = () => 'observed';
  deps.collectSolutionDecisionDetails = false;
  deps.onSolutionProgress = value => { progress.push(value); };
  deps.measureSolutionOuterFootprint = box => {
    const tight = box.classList.contains('fit-tight');
    measurements.push({ source: box.dataset.sourceRef, tight });
    return naturalHeights.get(box.dataset.sourceRef) - (tight ? 10 : 0);
  };
  return {
    run: () => executor.render({ area, data, deps }),
    area, data, frames, mathCalls, measurements, progress, state: deps.appState,
    stats: () => ({ layoutReads, compressions, workMs: clock.now }),
    pageMap: () => area.children.map(page => page.children[0].children.map(column => column.children.map(box => ({
      source: box.dataset.sourceRef,
      compressed: Boolean(box.dataset.testCompressed),
      chunks: box.querySelector('.sol-exp').children.map(chunk => chunk.innerHTML)
    }))))
  };
}

test('budgeted solution placement keeps every fit decision and source order with fewer fixed frame waits', async () => {
  const legacy = solutionPlacementFixture({ rendererMode: 'legacy' });
  const batch = solutionPlacementFixture();
  await legacy.run();
  await batch.run();
  assert.deepEqual(batch.pageMap(), legacy.pageMap());
  assert.deepEqual(JSON.parse(JSON.stringify(batch.state.solutionObservedPlacementLedger)),
    JSON.parse(JSON.stringify(legacy.state.solutionObservedPlacementLedger)));
  assert.deepEqual(batch.measurements, legacy.measurements);
  assert.deepEqual(batch.stats(), legacy.stats(), 'no fit measurement or compression may be skipped');
  assert.equal(batch.mathCalls.length, 7, '50 prepared boxes retain serial batches and are not retypeset on retry');
  assert.ok(batch.frames.length < legacy.frames.length / 2, 'fast layout work must share animation frames');
  assert.equal(batch.frames[0], 0, 'first placement retains a real host barrier');
  assert.ok(batch.frames.slice(1).every((time, index) => time - batch.frames[index] <= 16),
    'layout must return to the host within a frame of simulated synchronous work');
  assert.deepEqual(batch.area.querySelectorAll('.sol-box').map(box => box.dataset.sourceRef), batch.data.map(question => question.id));
});

test('budgeted long-solution placement preserves continuation contents and yields during the split', async () => {
  const legacy = solutionPlacementFixture({ rendererMode: 'legacy', longSolution: true });
  const batch = solutionPlacementFixture({ longSolution: true });
  await legacy.run();
  await batch.run();
  assert.deepEqual(batch.pageMap(), legacy.pageMap());
  assert.deepEqual(batch.stats(), legacy.stats());
  const shells = batch.area.querySelectorAll('.sol-box');
  assert.ok(shells.length > 1);
  assert.deepEqual(shells.flatMap(shell => shell.querySelector('.sol-exp').children.map(chunk => chunk.innerHTML)),
    batch.data[0].solution.split('|'));
  assert.ok(batch.frames.length > 2, 'long splits must offer repeated cancellation/progress opportunities');
  assert.ok(batch.frames.slice(1).every((time, index) => time - batch.frames[index] <= 16));
  assert.deepEqual(batch.mathCalls, ['solution-staging', 'solution-split-staging']);
});

test('budgeted solution layout propagates host cancellation before completing boxes or a long split', async () => {
  for (const longSolution of [false, true]) {
    const fixture = solutionPlacementFixture({ cancelAt: 16, longSolution });
    await assert.rejects(fixture.run(), /ABORTED/);
    assert.ok(fixture.stats().workMs <= 24, 'an expensive layout slice must not starve the cancellation barrier');
    assert.equal(fixture.state.solutionObservedPlacementLedger, null);
    assert.equal(fixture.state.solutionDecisionLedger, null);
    assert.ok(!fixture.progress.some(event => event.phase === 'layout' && event.completed === fixture.data.length),
      'cancelled output must never report completed layout');
  }
});
