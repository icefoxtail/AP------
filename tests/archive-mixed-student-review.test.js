const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'archive/mixed_engine.html'), 'utf8');
const cssPath = path.join(root, 'archive/student-review-mobile.css');
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

function printHarness(options = {}) {
  const attributes = new Map();
  const dataset = {};
  if (options.student !== false) dataset.apStudentReview = 'true';
  if (options.previous !== undefined) attributes.set('data-ap-student-review-printing', options.previous);
  const htmlNode = {
    dataset,
    getAttribute(name) { return attributes.get(name) ?? null; },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    removeAttribute(name) { attributes.delete(name); }
  };
  const events = [], listeners = new Map();
  const suspended = () => attributes.get('data-ap-student-review-printing') === 'true';
  const note = name => { events.push({ name, suspended: suspended() }); };
  const maybeFail = name => { if (options.fail === name) throw Object.assign(new Error(name), { code: options.code || name }); };
  const transport = name => async () => { note(name); maybeFail(name); return { summary: { pageCount: 3, elapsedMs: 1 }, restore() { note(name + '-restore'); } }; };
  const context = {
    document: { documentElement: htmlNode, getElementById() { return null; }, querySelectorAll() { return [1, 2, 3]; }, fonts: { ready: Promise.resolve() } },
    window: {
      location: { search: options.dryRun ? '?printDryRun=1' : '' },
      mixedFastHost: { async preflight() { note('preflight'); maybeFail('preflight'); }, unlockPrint() { note('unlock'); } },
      __AP_RENDER_READY__: Promise.resolve({ ok: true }),
      APPrintRuntime: { assertSuccessfulRender(outcome) { assert.equal(outcome.ok, true); } },
      APRenderLoop: { unrenderedMathCount() { return 0; } },
      APNativePrint: {
        DEFAULT_PRINTER: 'fixture',
        async print() { note('native'); maybeFail('native'); return { pageCount: 3, elapsedMs: 1 }; },
        async printGdi() { note('gdi'); maybeFail('gdi'); return { pageCount: 3, elapsedMs: 1 }; }
      },
      addEventListener(name, callback) { listeners.set(name, callback); },
      removeEventListener(name) { listeners.delete(name); },
      print() { note('window-print'); maybeFail('window-print'); if (options.afterPrint !== false) listeners.get('afterprint')?.(); },
      alert() { note('alert'); },
      confirm() { note('confirm'); return false; }
    },
    performance: { now() { return 1; } },
    console: { warn() {} },
    URLSearchParams,
    setTimeout(callback, ms) { if (ms <= 60) queueMicrotask(callback); return 1; },
    clearTimeout() {},
    buildContext: null,
    AppState: {},
    activeOutputModeTransition: false,
    printPending: options.busy === true,
    setPrintButtonsBusy(busy) { note(busy ? 'busy' : 'idle'); if (busy) maybeFail('busy'); },
    getFastPrintCopies() { return 2; },
    async waitForPrintImages() { note('images'); maybeFail('images'); },
    rendererMode() { return 'batch'; },
    typesetMath: async () => {},
    markMixedReadiness() { note('print-ready'); },
    prepareRasterPrint: transport('raster'),
    flattenPrintImagesForOpaquePrint: transport('vector'),
    downloadNativePrintAgentInstaller() { throw new Error('unexpected installer'); }
  };
  const helperStart = html.indexOf('function suspendStudentReviewPresentation()');
  const start = helperStart < 0 ? html.indexOf("async function safePrint(mode = 'vector')") : helperStart;
  const end = html.indexOf('if (!buildContext) window.safePrint = safePrint;', start);
  assert.ok(start >= 0 && end > start);
  vm.createContext(context);
  vm.runInContext(html.slice(start, end) + '\nglobalThis.runPrint = safePrint;', context);
  return { context, events, attributes, run: mode => context.runPrint(mode), suspended };
}

test('student reading marker recognizes only the explicit studentReview query', () => {
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('dataset.apStudentReview'));
  assert.ok(script, 'explicit presentation marker is installed');
  for (const [query, expected] of [['?studentReview=1', true], ['?preview=1&studentReview=1', true], ['?studentReview=0', false], ['?studentReview=true', false], ['?archive2Review=1', false], ['', false]]) {
    const dataset = {};
    vm.runInNewContext(script, { URLSearchParams, window: { location: { search: query } }, document: { documentElement: { dataset } } });
    assert.equal(dataset.apStudentReview === 'true', expected, query);
    assert.equal(dataset.archive2Context, undefined, 'student view is not an Archive2 transport context');
  }
});

test('reading CSS is limited to mobile screen, READY, explicit student mode, and live question DOM', () => {
  assert.match(html, /href="student-review-mobile\.css\?v=20261116-readable-2"/);
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  assert.match(clean, /^@media screen and \(max-width: 640px\)\s*\{/);
  assert.equal((clean.match(/@media/g) || []).length, 1);
  assert.match(clean, /html\[data-ap-student-review="true"\]\[data-ap-render-ready="true"\]:not\(\[data-archive2-context\]\):not\(\[data-ap-student-review-printing="true"\]\)/);
  assert.match(clean, /body:not\(\.mode-pdf\) #print-area:has\(\.q-box\)\s*\{/);
  assert.doesNotMatch(clean, /data-archive-build-root|data-fast-build|@media print/);
});

test('existing Archive2 context keeps its own mobile reading and print policy', () => {
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('dataset.apStudentReview'));
  assert.ok(script);
  const dataset = {};
  vm.runInNewContext(script, { URLSearchParams, window: { location: { search: '?archive2Context=archive2&studentReview=1' } }, document: { documentElement: { dataset } } });
  assert.equal(dataset.archive2Context, 'archive2');
  assert.equal(dataset.apStudentReview, undefined);
  assert.match(css, /:not\(\[data-archive2-context\]\)/);
});

test('reading rules remove page scaling and print column heights without reordering question content', () => {
  assert.match(css, /width: calc\(100% - 16px\) !important/);
  assert.match(css, /transform: none !important/);
  assert.match(css, /\.page-body, \.grid-container, \.grid-col, \.ap-equal-slot-grid, \.ap-equal-slot\s*\{[^}]*display: block !important;[^}]*height: auto !important/s);
  assert.match(css, /\.ap-slot-content\s*\{[^}]*position: static !important;[^}]*transform: none !important/s);
  assert.match(css, /\.q-box\s*\{[^}]*height: auto !important;[^}]*overflow: visible !important/s);
  assert.doesNotMatch(css, /\border\s*:|\bcontent\s*:|\bzoom\s*:|\btext-transform\s*:/);
});

test('body, choices and written solution use readable CSS sizes after A4 compression', () => {
  assert.match(css, /\.q-box, \.q-content, \.choices, \.choice-item, \.sol-exp, \.sol-ans,[\s\S]*?\.q-box > div\[data-semantic-content="1"\], table\.question-table\s*\{\s*font-size: 16px !important;\s*line-height: 1\.6 !important;/);
  assert.match(css, /\.q-num\s*\{ font-size: 18px !important;/);
  assert.match(css, /\.sol-image-caption\s*\{ font-size: 14px !important;/);
  assert.match(css, /\.q-box img\s*\{[^}]*max-width: 100% !important;[^}]*height: auto !important/s);
  assert.doesNotMatch(css, /data:image|url\(|textContent|innerHTML/);
});

for (const mode of ['vector', 'raster', 'native', 'gdi']) {
  test(`${mode} print temporarily suspends the reading view and restores it on completion`, async () => {
    const h = printHarness();
    await h.run(mode);
    assert.ok(h.events.some(e => e.name === 'preflight' && e.suspended));
    assert.ok(h.events.some(e => e.name === mode && e.suspended));
    assert.ok(h.events.filter(e => ['preflight', 'images', 'print-ready', mode].includes(e.name)).every(e => e.suspended));
    assert.equal(h.attributes.has('data-ap-student-review-printing'), false);
  });
  test(`${mode} dry-run restores the reading view without a browser print`, async () => {
    const h = printHarness({ dryRun: true });
    await h.run(mode);
    assert.ok(h.events.some(e => e.name === mode && e.suspended));
    assert.ok(!h.events.some(e => e.name === 'window-print'));
    assert.equal(h.attributes.has('data-ap-student-review-printing'), false);
  });
}

for (const mode of ['vector', 'raster', 'native', 'gdi']) {
  test(`${mode} preflight refusal restores the reading view and keeps transport blocked`, async () => {
    const h = printHarness({ fail: 'preflight' });
    await h.run(mode);
    assert.ok(h.events.some(e => e.name === 'preflight' && e.suspended));
    assert.ok(!h.events.some(e => e.name === mode || e.name === 'window-print'));
    assert.equal(h.attributes.has('data-ap-student-review-printing'), false);
  });
}

test('GDI refusal and cancelled installer prompt restore presentation', async () => {
  const h = printHarness({ fail: 'gdi', code: 'AP_NATIVE_AGENT_UNAVAILABLE' });
  await h.run('gdi');
  assert.ok(h.events.some(e => e.name === 'confirm' && e.suspended));
  assert.equal(h.attributes.has('data-ap-student-review-printing'), false);
});

test('browser print cancellation restores presentation', async () => {
  const h = printHarness();
  await h.run('vector');
  assert.ok(h.events.some(e => e.name === 'window-print' && e.suspended));
  assert.equal(h.attributes.has('data-ap-student-review-printing'), false);
});

test('synchronous browser print throw restores presentation in finally', async () => {
  const h = printHarness({ fail: 'window-print' });
  await assert.rejects(h.run('vector'), /window-print/);
  assert.equal(h.attributes.has('data-ap-student-review-printing'), false);
});

test('unexpected setup throw restores presentation in finally', async () => {
  const h = printHarness({ fail: 'busy' });
  await assert.rejects(h.run('vector'), /busy/);
  assert.equal(h.attributes.has('data-ap-student-review-printing'), false);
});

test('pre-existing presentation suspension is restored exactly', async () => {
  const h = printHarness({ previous: 'prior-state', dryRun: true });
  await h.run('vector');
  assert.ok(h.events.some(e => e.name === 'vector' && e.suspended));
  assert.equal(h.attributes.get('data-ap-student-review-printing'), 'prior-state');
});

test('busy print and normal review do not change presentation attributes', async () => {
  const busy = printHarness({ busy: true, previous: 'existing' });
  await busy.run('vector');
  assert.equal(busy.events.length, 0);
  assert.equal(busy.attributes.get('data-ap-student-review-printing'), 'existing');
  const normal = printHarness({ student: false, dryRun: true });
  await normal.run('vector');
  assert.ok(normal.events.length > 0);
  assert.ok(normal.events.every(e => !e.suspended));
  assert.equal(normal.attributes.has('data-ap-student-review-printing'), false);
});
