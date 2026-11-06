const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../archive/question-image-readiness.js'), 'utf8');

// Exercise the real readiness promises without network or wall-clock timing.
// A timeout is a bound on the whole load/decode operation, not two allowances.
function readinessHarness() {
  let now = 0;
  let serial = 0;
  const timers = new Map();
  const flush = async () => {
    for (let i = 0; i < 16; i += 1) await Promise.resolve();
  };
  const context = {
    module: { exports: {} },
    Date: class extends Date { static now() { return now; } },
    performance: { now: () => now },
    setTimeout(callback, delay = 0) {
      const id = ++serial;
      timers.set(id, { at: now + Math.max(0, Number(delay) || 0), callback });
      return id;
    },
    clearTimeout(id) { timers.delete(id); }
  };
  vm.runInNewContext(source, context, { filename: 'archive/question-image-readiness.js' });
  return {
    api: context.module.exports,
    timerCount: () => timers.size,
    async advance(ms = 0) {
      const target = now + ms;
      await flush();
      for (;;) {
        const next = [...timers].filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next) break;
        const [id, timer] = next;
        now = timer.at;
        timers.delete(id);
        timer.callback();
        await flush();
      }
      now = target;
      await flush();
    }
  };
}

function image(overrides = {}) {
  const listeners = new Map();
  return {
    complete: true, naturalWidth: 100, naturalHeight: 50, src: 'q1.svg',
    decode: () => Promise.resolve(),
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name) { for (const callback of [...(listeners.get(name) || [])]) callback(); },
    load() {
      this.complete = true; this.naturalWidth = 100; this.naturalHeight = 50;
      this.emit('load');
    },
    fail() {
      this.complete = true; this.naturalWidth = 0; this.naturalHeight = 0;
      this.emit('error');
    },
    listenerCount: () => [...listeners.values()].reduce((sum, values) => sum + values.size, 0),
    ...overrides
  };
}

function pendingImage(overrides = {}) {
  return image({ complete: false, naturalWidth: 0, naturalHeight: 0, ...overrides });
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function observe(promise) {
  const outcome = { settled: false };
  promise.then(value => Object.assign(outcome, { settled: true, value }),
    error => Object.assign(outcome, { settled: true, error }));
  return outcome;
}

for (const result of ['success', 'rejection']) {
  test(`completed image decode ${result} removes its deadline timer`, async () => {
    const harness = readinessHarness();
    const decode = deferred();
    const item = image({ decode: () => decode.promise });
    const outcome = observe(harness.api.waitForImage(item, 100));
    await harness.advance(25);
    assert.equal(outcome.settled, false);
    if (result === 'success') decode.resolve();
    else decode.reject(new Error('invalid image bytes'));
    await harness.advance();
    assert.equal(outcome.settled, true);
    assert.equal(outcome.value.status, result === 'success' ? 'loaded' : 'error');
    if (result === 'rejection') assert.equal(outcome.value.reason, 'DECODE_ERROR');
    assert.equal(harness.timerCount(), 0, 'finished decodes leave no timer for each figure');
    assert.equal(item.listenerCount(), 0);
  });
}

test('load and decode share one total deadline', async () => {
  const harness = readinessHarness();
  const decode = deferred();
  const item = pendingImage({ decode: () => decode.promise });
  const outcome = observe(harness.api.waitForImage(item, 100));
  await harness.advance(80);
  item.load();
  await harness.advance();
  assert.equal(item.listenerCount(), 0, 'load listeners are released before decoding');
  await harness.advance(19);
  assert.equal(outcome.settled, false);
  await harness.advance(1);
  assert.equal(outcome.settled, true, '80ms load must leave 20ms, not another 100ms, for decode');
  assert.equal(outcome.value.status, 'timeout');
  assert.equal(outcome.value.reason, 'DECODE_TIMEOUT');
  assert.equal(harness.timerCount(), 0);
  decode.resolve();
  await harness.advance();
  assert.equal(outcome.value.status, 'timeout', 'a late decode cannot upgrade a failed render');
});

test('50 figures accept one valid delayed SVG within the existing print asset budget', async () => {
  const harness = readinessHarness();
  const figures = Array.from({ length: 50 }, (_, i) => image({ src: `q${i + 1}.svg` }));
  figures[24] = pendingImage({ src: 'q25.svg' });
  const outcome = observe(harness.api.waitForImages(figures, { timeoutMs: 5000 }));
  await harness.advance(1600);
  assert.equal(outcome.settled, false, 'a slow valid asset is still pending, not a successful partial render');
  figures[24].load();
  await harness.advance();
  assert.equal(outcome.settled, true);
  assert.equal(outcome.error, undefined);
  assert.equal(outcome.value.summary.images, 50);
  assert.equal(outcome.value.summary.loaded, 50);
  assert.equal(outcome.value.summary.errors, 0);
  assert.equal(outcome.value.summary.timeouts, 0);
  assert.equal(harness.timerCount(), 0);
  assert.equal(figures[24].listenerCount(), 0);
});

for (const failure of ['network', 'decode', 'timeout']) {
  test(`one ${failure} failure among 50 figures still blocks readiness`, async () => {
    const harness = readinessHarness();
    const decode = deferred();
    const figures = Array.from({ length: 50 }, (_, i) => image({ src: `q${i + 1}.svg` }));
    figures[24] = failure === 'decode'
      ? image({ src: 'q25.svg', decode: () => decode.promise })
      : pendingImage({ src: 'q25.svg' });
    const outcome = observe(harness.api.waitForImages(figures, {
      timeoutMs: 100,
      failureCodes: { error: 'QUESTION_IMAGE_LOAD_FAILED', timeout: 'QUESTION_IMAGE_READINESS_INCOMPLETE' }
    }));
    await harness.advance(25);
    if (failure === 'network') figures[24].fail();
    if (failure === 'decode') decode.reject(new Error('invalid image bytes'));
    await harness.advance(failure === 'timeout' ? 75 : 0);
    assert.equal(outcome.settled, true);
    assert.equal(outcome.value, undefined, '49 ready images cannot hide the failed figure');
    assert.equal(outcome.error.code, failure === 'timeout' ? 'QUESTION_IMAGE_READINESS_INCOMPLETE' : 'QUESTION_IMAGE_LOAD_FAILED');
    assert.equal(outcome.error.details.summary.images, 50);
    assert.equal(outcome.error.details.summary.loaded, 49);
    assert.equal(outcome.error.details.summary.errors, failure === 'timeout' ? 0 : 1);
    assert.equal(outcome.error.details.summary.timeouts, failure === 'timeout' ? 1 : 0);
    assert.equal(outcome.error.details.results[24].src, 'q25.svg');
    assert.equal(harness.timerCount(), 0);
    assert.equal(figures[24].listenerCount(), 0);
    if (failure === 'timeout') {
      figures[24].load();
      await harness.advance();
      assert.equal(outcome.error.code, 'QUESTION_IMAGE_READINESS_INCOMPLETE');
    }
  });
}

function trackedAbort() {
  const controller = new AbortController(), listeners = new Set();
  const signal = controller.signal;
  const add = signal.addEventListener.bind(signal), remove = signal.removeEventListener.bind(signal);
  signal.addEventListener = (type, callback, options) => { if (type === 'abort') listeners.add(callback); add(type, callback, options); };
  signal.removeEventListener = (type, callback) => { if (type === 'abort') listeners.delete(callback); remove(type, callback); };
  return { controller, signal, listenerCount: () => listeners.size };
}

for (const phase of ['load', 'decode', 'already-aborted']) {
  test(`canceling an image ${phase} wait releases its deadline and listeners immediately`, async () => {
    const harness = readinessHarness(), abort = trackedAbort(), decode = deferred();
    const item = phase === 'load' ? pendingImage() : image({ decode: () => decode.promise });
    if (phase === 'already-aborted') abort.controller.abort();
    const outcome = observe(harness.api.waitForImages([item], { timeoutMs: 15000, signal: abort.signal }));
    await harness.advance(50);
    if (phase !== 'already-aborted') {
      assert.equal(outcome.settled, false);
      abort.controller.abort();
      await harness.advance();
    }
    assert.equal(outcome.error?.code, 'DISCARDED_STALE');
    assert.equal(harness.timerCount(), 0);
    assert.equal(item.listenerCount(), 0);
    assert.equal(abort.listenerCount(), 0);
    // Late native completion is observed but cannot upgrade the canceled wait.
    if (phase === 'load') item.load();
    else decode.reject(new Error('late native decode failure'));
    if (phase === 'already-aborted') decode.promise.catch(() => {});
    await harness.advance();
    assert.equal(outcome.error?.code, 'DISCARDED_STALE');
    assert.equal(harness.timerCount(), 0);
  });
}

function examImageHarness(imageState, signal) {
  const timing = readinessHarness(), events = [];
  const node = (tag = 'div') => {
    const value = { tag, style: {}, dataset: {}, children: [], className: '',
      classList: { add() {}, remove() {} },
      appendChild(child) { this.children.push(child); return child; },
      removeChild(child) { this.children.splice(this.children.indexOf(child), 1); },
      querySelectorAll(selector) {
        const all = this.children.flatMap(child => [child, ...child.querySelectorAll('*')]);
        return selector === '*' ? all : all.filter(child => child.className === 'q-box');
      },
      cloneNode() { const clone = node(tag); clone.className = this.className; clone.dataset = { ...this.dataset }; return clone; }
    };
    Object.defineProperties(value, {
      innerHTML: { set() { this.children = []; } },
      scrollHeight: { get() { events.push({ kind: 'geometry', box: this.className === 'q-box' }); return 60; } },
      clientHeight: { get() { events.push({ kind: 'geometry', box: false }); return 1000; } }
    });
    return value;
  };
  const document = { createElement: node }, staging = node(), area = node();
  const context = { module: { exports: {} }, URL };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../archive/exam-render-executor.js'), 'utf8'), context);
  const pass = value => value;
  const deps = { document, stagingHost: staging, appState: { qpp: 1 }, abortSignal: signal,
    makePage(target, type, number) { events.push({ kind: 'page', number }); const page = node('page'); page.body = node('body'); page.appendChild(page.body); target.appendChild(page); return page; },
    async applyAutoImageSizeClasses(target, timeoutMs, passedSignal) {
      events.push({ kind: 'images', timeoutMs, signal: passedSignal });
      await timing.api.waitForImages([imageState], { timeoutMs, signal: passedSignal,
        failureCodes: { error: 'QUESTION_IMAGE_LOAD_FAILED', timeout: 'QUESTION_IMAGE_READINESS_INCOMPLETE' } });
      events.push({ kind: 'images-ready' });
    },
    async typesetMath() { events.push({ kind: 'math' }); }, async raf() {},
    getArchiveQuestionSourceRef: (question, index) => 'fixture#' + index,
    stripInlineImagesFromContent: pass, sanitizeProtectedSegments: pass, normalizeQuestionNotes: pass,
    normalizeViewBlocks: pass, normalizeQuestionTables: pass, formatQuestionContent: pass, wrapLatex: pass,
    renderQuestionImageHTML: () => '', renderChoicesHTML: () => '', normalizeQuestionImageSources() {},
    fitQuestionBox() {}, autoCompress() {}, rendererMode: () => 'batch', measurementMode: () => 'batch' };
  return { ...timing, events, area,
    outcome: observe(context.module.exports.render({ area, data: [{ content: 'first' }, { content: 'second' }], deps })) };
}

test('shared exam staging waits for delayed figures before MathJax, profile measurement and pages', async () => {
  const item = pendingImage(), abort = trackedAbort();
  const h = examImageHarness(item, abort.signal);
  assert.equal(h.events[0].timeoutMs, 15000);
  assert.equal(h.events[0].signal, abort.signal);
  await h.advance(6000);
  assert.equal(h.outcome.settled, false);
  assert.deepEqual(h.events.map(item => item.kind), ['images'], 'valid slow images cannot be measured as unloaded placeholders');
  item.load(); await h.advance(); await h.advance();
  assert.equal(h.outcome.error, undefined);
  assert.equal(h.outcome.value, h.area);
  assert.ok(h.events.filter(item => item.kind === 'geometry' && item.box).length >= 4, 'both raw and tight question measurements still execute');
  assert.ok(h.events.some(item => item.kind === 'math'));
  assert.ok(h.events.filter(item => item.kind === 'page' && item.number > 0).length > 0);
  assert.equal(h.events.findIndex(item => item.kind === 'images-ready'), 1);
  assert.equal(h.timerCount(), 0);
  assert.equal(abort.listenerCount(), 0);
});

for (const failure of ['network', 'timeout', 'cancel']) {
  test(`exam staging ${failure} still blocks every measurement and cleans up before retry`, async () => {
    const item = pendingImage(), abort = trackedAbort();
    const h = examImageHarness(item, abort.signal);
    await h.advance(14999);
    assert.equal(h.outcome.settled, false);
    if (failure === 'network') item.fail();
    if (failure === 'cancel') abort.controller.abort();
    await h.advance(failure === 'timeout' ? 1 : 0);
    assert.equal(h.outcome.error?.code, failure === 'cancel' ? 'DISCARDED_STALE' :
      failure === 'timeout' ? 'QUESTION_IMAGE_READINESS_INCOMPLETE' : 'QUESTION_IMAGE_LOAD_FAILED');
    assert.deepEqual(h.events.map(item => item.kind), ['images']);
    assert.equal(h.timerCount(), 0);
    assert.equal(item.listenerCount(), 0);
    assert.equal(abort.listenerCount(), 0);
    const retry = examImageHarness(image(), new AbortController().signal);
    await retry.advance(); await retry.advance();
    assert.equal(retry.outcome.value, retry.area, 'an old image failure must not poison a fresh transaction');
  });
}
