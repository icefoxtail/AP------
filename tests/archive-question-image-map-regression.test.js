const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

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

test('pending solution images keep the default timeout when rendered through Array.map', async () => {
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
    [DEFAULT_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, DEFAULT_TIMEOUT_MS],
    'Array.map indexes must not become timeoutMs values'
  );

  calls.forEach(({ image }) => image.resolve());
  await renderPromise;
});

test('archive solution image map call sites use explicit one-argument callbacks', () => {
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
