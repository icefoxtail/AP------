const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const readiness = require('../archive/question-image-readiness.js');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const mixed = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
const examExecutor = fs.readFileSync(path.join(root, 'archive', 'exam-render-executor.js'), 'utf8');
const solutionExecutor = fs.readFileSync(path.join(root, 'archive', 'solution-render-executor.js'), 'utf8');
const layoutMaterializer = fs.readFileSync(path.join(root, 'archive', 'layout-materializer.js'), 'utf8');
const screenAdapter = fs.readFileSync(path.join(root, 'archive', 'screen-runtime-adapter.js'), 'utf8');
const commonRuntime = fs.readFileSync(path.join(root, 'archive', 'common-fast-runtime.js'), 'utf8');
const q9Source = fs.readFileSync(path.join(root, 'archive', 'exams', 'original', 'high', 'h2', '2mid', '25_제일고_2학기_중간_고2_수학II.js'), 'utf8');

function engineContext() {
  const window = {
    APQuestionImageReadiness: readiness,
    addEventListener() {},
    removeEventListener() {},
    matchMedia() { return { matches: false }; },
    requestAnimationFrame(callback) { return setTimeout(callback, 0); },
    cancelAnimationFrame() {}
  };
  const document = new Proxy({}, {
    get(target, property) {
      if (property === 'addEventListener' || property === 'removeEventListener') return () => {};
      if (property === 'getElementById' || property === 'querySelector' || property === 'querySelectorAll') return () => null;
      return undefined;
    }
  });
  const context = {
    window, document,
    Node: { TEXT_NODE: 3, ELEMENT_NODE: 1 },
    URL, URLSearchParams, console, setTimeout, clearTimeout,
    requestAnimationFrame: callback => setTimeout(callback, 0),
    performance: { now: () => 0 }
  };
  window.document = document;
  vm.runInNewContext(engine.slice(engine.indexOf('const ARCHIVE_ASSET_CACHE_VERSION'), engine.lastIndexOf('</script>')), context, { filename: 'archive/engine.html' });
  return context;
}

function image(overrides = {}) {
  const attributes = new Map();
  const listeners = new Map();
  return {
    complete: true,
    naturalWidth: 100,
    naturalHeight: 50,
    getAttribute(name) { return attributes.get(name) || null; },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    addEventListener(name, listener) { listeners.set(name, listener); },
    removeEventListener(name, listener) { if (listeners.get(name) === listener) listeners.delete(name); },
    emit(name) { listeners.get(name)?.(); },
    ...overrides
  };
}

test('wrapLatex keeps q9 inline HTML and cache-buster normalization is idempotent', () => {
  const context = engineContext();
  const content = '발문<br><img src="assets/images/example.png"><div class="note-box">ㄱ. 하나<br>ㄴ. 둘<br>ㄷ. 셋</div>';
  const rendered = context.formatQuestionContent(context.wrapLatex(context.stripInlineImagesFromContent(content, false)), {});
  assert.match(rendered, /<br><img src="assets\/images\/example\.png">/);
  assert.match(rendered, /<div class="note-box">/);
  assert.equal(context.withArchiveAssetCacheBuster('assets/images/example.png?foo=1#frag'), 'assets/images/example.png?foo=1&v=20260903.1#frag');
  assert.equal(context.withArchiveAssetCacheBuster('assets/images/example.png?foo=1&v=old#frag'), 'assets/images/example.png?foo=1&v=old#frag');
  assert.equal(context.withArchiveAssetCacheBuster('data:image/png;base64,abc'), 'data:image/png;base64,abc');
  assert.equal(context.withArchiveAssetCacheBuster('blob:https://example.test/id'), 'blob:https://example.test/id');
});

test('question image readiness requires complete positive dimensions and decode when available', async () => {
  const loaded = image({ decode: () => Promise.resolve() });
  assert.deepEqual(await readiness.waitForImage(loaded, 20), { status: 'loaded', naturalWidth: 100, naturalHeight: 50, src: '' });

  const broken = image({ naturalWidth: 0, naturalHeight: 0 });
  await assert.rejects(
    readiness.waitForImages([broken], { failureCodes: { error: 'QUESTION_IMAGE_LOAD_FAILED', timeout: 'QUESTION_IMAGE_READINESS_INCOMPLETE' } }),
    error => error.code === 'QUESTION_IMAGE_LOAD_FAILED' && error.details.summary.errors === 1
  );

  const pending = image({ complete: false, naturalWidth: 0, naturalHeight: 0 });
  const waiting = readiness.waitForImage(pending, 50);
  pending.complete = true;
  pending.naturalWidth = 320;
  pending.naturalHeight = 120;
  pending.emit('load');
  assert.equal((await waiting).status, 'loaded');
});

test('question image source normalization targets q-content and q-image-wrap without touching special URLs', () => {
  const first = image();
  first.setAttribute('src', 'assets/images/inline.png');
  const second = image();
  second.setAttribute('src', 'data:image/png;base64,abc');
  const rootNode = { querySelectorAll: selector => {
    assert.equal(selector, readiness.QUESTION_IMAGE_SELECTOR);
    return [first, second];
  } };
  readiness.normalizeQuestionImageSources(rootNode, src => src.startsWith('assets/') ? `${src}?v=fixture` : src);
  assert.equal(first.getAttribute('src'), 'assets/images/inline.png?v=fixture');
  assert.equal(second.getAttribute('src'), 'data:image/png;base64,abc');
});

test('inline image policy is wired through shared, legacy, layout-authority, Screen Runtime, and mixer paths', () => {
  assert.match(engine, /question-image-readiness\.js\?v=20260915\.2/);
  assert.match(engine, /s = s\.split\(mathSegmentRe\)\.map/);
  assert.doesNotMatch(engine, /protectedSegmentRe/);
  assert.match(engine, /await prepareQuestionImages\(root\)/);
  assert.match(engine, /\.q-content img, \.q-image-wrap img/);
  assert.match(engine, /QUESTION_IMAGE_LOAD_FAILED/);
  assert.match(engine, /finish\(document\.getElementById\('print-area'\), undefined, outcome\?\.ok === true\)/);
  assert.match(mixed, /question-image-readiness\.js\?v=20260915\.2/);
  assert.match(mixed, /await prepareQuestionImages\(root\)/);
  assert.match(examExecutor, /normalizeQuestionImageSources/);
  assert.match(solutionExecutor, /normalizeQuestionImageSources/);
  assert.match(layoutMaterializer, /validateQuestionImageReadiness/);
  assert.match(screenAdapter, /validateQuestionImageReadiness/);
  assert.match(commonRuntime, /i\.naturalWidth > 0 && i\.naturalHeight > 0/);
  const q9Record = q9Source.match(/\{\s*"id": 9,[\s\S]*?(?=\n  \{\s*"id": 10)/)?.[0] || '';
  assert.match(q9Record, /"content": "[^"]*<br><img src=\\"assets\/images\/25_제일고_2학기_중간_고2_수학II\/q9\.png\\"[^<]*><div class=\\"note-box\\"/);
  assert.doesNotMatch(q9Record, /"image"\s*:/, 'q9 must remain without a q.image field');
});
