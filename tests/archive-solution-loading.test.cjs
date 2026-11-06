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
