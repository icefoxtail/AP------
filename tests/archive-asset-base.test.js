const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = require('../archive/archive-asset-base.js');

const root = path.join(__dirname, '..');
const R2 = { base: 'https://img.wangjiedu.com', source: 'override' };
const OFF = { base: '', source: 'default' };

test('default setting maps exam images to img.wangjiedu.com', () => {
  assert.equal(base.DEFAULT_EXAM_IMAGE_BASE, 'https://img.wangjiedu.com');
  base.resetForTest();
  assert.deepEqual({ base: base.describe().base, source: base.describe().source }, { base: 'https://img.wangjiedu.com', source: 'default' });
  assert.equal(base.resolveExamImageUrl('assets/images/15_x/q1.png?v=1'), 'https://img.wangjiedu.com/exams/images/15_x/q1.png?v=1');
  assert.equal(base.resolveExamImageUrl('assets/generated-lite/x.svg'), 'assets/generated-lite/x.svg');
  base.resetForTest();
});

test('an empty base returns every reference untouched', () => {
  for (const value of ['assets/images/15_x/q1.png', 'assets/images/a b/q1.png?v=1#h', '../assets/images/a/q.svg', 'assets/generated-lite/x.svg', 'q1.png', '', undefined]) {
    assert.equal(base.resolveExamImageUrl(value, { config: OFF }), value);
  }
});

test('catalog image references: default config keeps every URL byte-for-byte', () => {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full.endsWith('.js') ? [full] : [];
  });
  const refs = new Set();
  const pattern = /(?:["'](?:image|solutionImage)["']?\s*:\s*|<img[^>]*?src=\\*)["']([^"'\\]+)/g;
  for (const file of walk(path.join(root, 'archive', 'exams'))) {
    const text = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = pattern.exec(text))) refs.add(match[1]);
  }
  assert.ok(refs.size > 5000, `expected the real catalog references, got ${refs.size}`);
  let mapped = 0;
  for (const ref of refs) {
    assert.equal(base.resolveExamImageUrl(ref, { config: OFF }), ref);
    const external = base.resolveExamImageUrl(ref, { config: R2 });
    if (external !== ref) {
      mapped += 1;
      assert.match(external, /^https:\/\/img\.wangjiedu\.com\/exams\/images\/[^/]+\/[^/?#]+(?:[?#].*)?$/);
    }
  }
  assert.ok(mapped > 5000, `mapped ${mapped}`);
});

test('external base maps to <base>/exams/images/<examFolder>/<file> for every supported form', () => {
  const key = '15_신흥중_2학기_기말_중3_수학/q01.png';
  const expected = 'https://img.wangjiedu.com/exams/images/' + key.split('/').map(encodeURIComponent).join('/');
  const forms = [
    'assets/images/' + key, 'archive/assets/images/' + key, './assets/images/' + key, '../assets/images/' + key,
    'https://icefoxtail.github.io/AP------/archive/assets/images/' + key.split('/').map(encodeURIComponent).join('/')
  ];
  for (const form of forms) assert.equal(base.resolveExamImageUrl(form, { config: R2 }), expected, form);
  assert.equal(base.resolveExamImageUrl('assets/images/' + key + '?v=20261014.1#x', { config: R2 }), expected + '?v=20261014.1#x');
  assert.equal(base.resolveExamImageUrl(key, { config: R2, bareKey: true }), expected);
  assert.equal(base.resolveExamImageUrl(key, { config: R2 }), key, 'bare keys are only mapped when the caller says it is a key');
  assert.equal(base.resolveExamImageUrl('assets/images/' + key, { config: { base: 'https://img.example.test/p' } }), 'https://img.example.test/p/exams/images/' + key.split('/').map(encodeURIComponent).join('/'));
});

test('references that are not exam images, unsafe or foreign are never remapped', () => {
  for (const value of [
    'assets/generated-lite/v1/x.svg', 'assets/solutions/a/q1.svg', 'q1.png', 'data:image/png;base64,aaa', 'blob:https://x/1',
    'assets/images/../../etc/passwd', 'assets/images/only-one-part.png', 'https://evil.example/archive/assets/images/a/q.png',
    'exams/textbooks/a/q1.png', 'assets/images/a/%E0%A4%A.png'
  ]) assert.equal(base.resolveExamImageUrl(value, { config: R2 }), value, value);
});

test('inline <img> html is rewritten only for exam images', () => {
  const html = '<p>x</p><img src="assets/images/a/q1.png" width="3"><img src=\'assets/generated-lite/b.svg\'>';
  assert.equal(base.resolveHtml(html, { config: OFF }), html);
  assert.equal(base.resolveHtml(html, { config: R2 }),
    '<p>x</p><img crossorigin="anonymous" src="https://img.wangjiedu.com/exams/images/a/q1.png" width="3"><img src=\'assets/generated-lite/b.svg\'>');
});

test('base validation accepts https (and local http) origins only', () => {
  assert.equal(base.normalizeBase('https://img.wangjiedu.com/'), 'https://img.wangjiedu.com');
  assert.equal(base.normalizeBase('http://127.0.0.1:8765'), 'http://127.0.0.1:8765');
  for (const bad of ['', 'off', 'http://img.wangjiedu.com', 'javascript:alert(1)', 'https://u:p@h.test', 'https://h.test/?a=1']) assert.equal(base.normalizeBase(bad), '', bad);
});

function listenerDocument() {
  const listeners = [];
  return { addEventListener(type, fn, capture) { listeners.push({ type, fn, capture }); }, listeners };
}
function fakeImage(src) {
  const attrs = { src };
  return { tagName: 'IMG', dataset: {}, getAttribute: name => attrs[name] ?? null, setAttribute(name, value) { attrs[name] = value; }, attrs };
}

test('fallback swaps an failed external image to the original URL exactly once and hides the first error', () => {
  base.resetForTest();
  const original = 'assets/images/a/q1.png?v=1';
  const external = base.resolveExamImageUrl(original, { config: R2 });
  const doc = listenerDocument();
  assert.equal(base.installFallback(doc), true);
  assert.equal(base.installFallback(doc), false, 'installed once per document');
  assert.equal(doc.listeners.length, 1);
  assert.equal(doc.listeners[0].capture, true);
  const image = fakeImage(external);
  let stopped = 0;
  doc.listeners[0].fn({ target: image, stopImmediatePropagation() { stopped += 1; } });
  assert.equal(image.attrs.src, original);
  assert.equal(stopped, 1);
  image.attrs.src = external; // the fallback itself failing must surface, not loop
  doc.listeners[0].fn({ target: image, stopImmediatePropagation() { stopped += 1; } });
  assert.equal(stopped, 1);
  assert.equal(image.attrs.src, external);
  const unknown = fakeImage('https://other.test/a.png');
  doc.listeners[0].fn({ target: unknown, stopImmediatePropagation() { stopped += 1; } });
  assert.equal(stopped, 1);
});

test('QA override is read from the query, remembered, and ignored for students', () => {
  const vm = require('node:vm');
  const source = fs.readFileSync(path.join(root, 'archive', 'archive-asset-base.js'), 'utf8');
  function load(search, pathname, store = new Map()) {
    const sandbox = {
      URL, URLSearchParams, console,
      location: { search, pathname, host: 'icefoxtail.github.io' },
      localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k) },
      module: { exports: {} }
    };
    sandbox.globalThis = sandbox;
    vm.runInNewContext(source, sandbox);
    return { api: sandbox.module.exports, store };
  }
  const QA = 'https://qa.example.test/p';
  const teacher = load('?assetBase=' + QA, '/AP------/archive/engine.html');
  assert.equal(teacher.api.describe().base, QA);
  assert.equal(teacher.store.get('ap.examImageBase.qa'), QA);
  const inherited = load('', '/AP------/archive/mixed_engine.html', teacher.store);
  assert.equal(inherited.api.describe().base, QA);
  // students never honour the override: they get the default (R2)
  const student = load('?assetBase=' + QA, '/AP------/apmath/student/index.html', teacher.store);
  assert.equal(student.api.describe().base, 'https://img.wangjiedu.com');
  assert.equal(student.api.describe().source, 'default');
  assert.equal(student.api.resolveExamImageUrl('assets/images/a/q.png'), 'https://img.wangjiedu.com/exams/images/a/q.png');
  const review = load('?studentReview=1', '/AP------/archive/engine.html', teacher.store);
  assert.equal(review.api.describe().base, 'https://img.wangjiedu.com');
  const studentOff = load('?assetBase=off&studentReview=1', '/AP------/archive/engine.html', teacher.store);
  assert.equal(studentOff.api.describe().base, 'https://img.wangjiedu.com', 'students cannot force same-origin either');
  const off = load('?assetBase=off', '/AP------/archive/engine.html', teacher.store);
  assert.equal(off.api.describe().base, '', 'off forces same-origin images although the default is R2');
  assert.equal(off.api.describe().source, 'override');
  assert.equal(off.api.resolveExamImageUrl('assets/images/a/q.png'), 'assets/images/a/q.png');
  assert.equal(off.store.get('ap.examImageBase.qa'), 'off');
  const offInherited = load('', '/AP------/archive/mixed_engine.html', off.store);
  assert.equal(offInherited.api.describe().base, '', 'off is remembered for preview iframes and print windows');
  const offStudent = load('', '/AP------/apmath/student/index.html', off.store);
  assert.equal(offStudent.api.describe().base, 'https://img.wangjiedu.com', 'students ignore a stored off');
  const reset = load('?assetBase=default', '/AP------/archive/engine.html', off.store);
  assert.equal(reset.api.describe().base, 'https://img.wangjiedu.com');
  assert.equal(reset.api.describe().source, 'default');
  assert.equal(reset.store.has('ap.examImageBase.qa'), false);
  const fresh = load('', '/AP------/archive/engine.html');
  assert.equal(fresh.api.describe().base, 'https://img.wangjiedu.com');
  const bad = load('?assetBase=http://evil.test', '/AP------/archive/engine.html');
  assert.equal(bad.api.describe().base, 'https://img.wangjiedu.com', 'an unusable value never becomes the base');
  assert.equal(bad.store.has('ap.examImageBase.qa'), false);
});

test('external exam images are requested in CORS mode (http/https pages only)', () => {
  base.resetForTest();
  const external = base.resolveExamImageUrl('assets/images/a/q1.png?v=1', { config: R2 });
  assert.equal(base.crossOriginAttr(external), ' crossorigin="anonymous"');
  assert.equal(base.crossOriginAttr('assets/images/a/q1.png?v=1'), '', 'same-origin URLs stay plain');
  assert.equal(base.crossOriginAttr('https://img.wangjiedu.com/never-resolved.png'), '');
  const attrs = {};
  const img = { getAttribute: n => attrs[n] ?? null, setAttribute: (n, v) => { attrs[n] = v; } };
  assert.equal(base.applyCrossOrigin(img, external), true);
  assert.equal(attrs.crossorigin, 'anonymous');
  assert.equal(base.applyCrossOrigin({ getAttribute: () => null, setAttribute() { throw new Error('same-origin must not be touched'); } }, 'assets/images/a/q1.png'), false);
  const vm = require('node:vm');
  const source = fs.readFileSync(path.join(root, 'archive', 'archive-asset-base.js'), 'utf8');
  const sandbox = { URL, URLSearchParams, location: { search: '', pathname: '/x/archive/engine.html', host: 'h', protocol: 'file:' }, module: { exports: {} } };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox);
  const fileApi = sandbox.module.exports;
  const fileUrl = fileApi.resolveExamImageUrl('assets/images/a/q1.png');
  assert.match(fileUrl, /^https:\/\/img\.wangjiedu\.com\//);
  assert.equal(fileApi.crossOriginAttr(fileUrl), '', 'file:// pages cannot use CORS mode');
  base.resetForTest();
});

test('every exam-image consumer is wired to the shared module and the module ships in the Pages package', () => {
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  for (const file of ['archive/engine.html', 'archive/mixed_engine.html', 'archive/mixer.html', 'archive/problem-bank-search.html', 'archive/generated-bank.html',
    'archive/workspace.html', 'archive/unit-past-exams.html', 'archive/index.html', 'apmath/index.html', 'apmath/wrong_print_engine.html']) {
    assert.match(read(file), /archive-asset-base\.js\?v=20261030-s21-1/, file);
  }
  for (const file of ['archive/engine.html', 'archive/mixed_engine.html', 'apmath/js/archive-render.js', 'apmath/wrong_print_engine.html', 'apmath/js/report-center.js', 'archive/mixer.html', 'archive/problem-bank-search.html', 'archive/generated-bank.html']) {
    assert.match(read(file), /resolveExamImageUrl/, file);
  }
  for (const file of ['archive/engine.html', 'archive/mixed_engine.html', 'apmath/wrong_print_engine.html']) {
    assert.match(read(file), /examImageCrossOriginAttr\(/, `${file} requests external exam images in CORS mode`);
  }
  for (const file of ['archive/engine.html', 'archive/mixed_engine.html']) assert.match(read(file), /examImageCrossOrigin\(image, resolved\)/, file);
  assert.ok(JSON.parse(read('tools/archive-pages-release-manifest.json')).archiveFiles?.includes('archive-asset-base.js')
    || read('tools/archive-pages-release-manifest.json').includes('"archive-asset-base.js"'));
  assert.doesNotMatch(read('apmath/js/core.js'), /r2\.ap-math\.com/);
  const cors = JSON.parse(read('tools/r2/cors-exam-images.json'));
  assert.deepEqual(cors[0].AllowedOrigins, ['https://icefoxtail.github.io', 'https://wangjiedu.com']);
});
