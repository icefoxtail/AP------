'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const checker = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const sourceManifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/archive-reviewed-problem-renderer-ui3.json'), 'utf8'));
const copy = value => JSON.parse(JSON.stringify(value));
const head = 'a'.repeat(40);
const scope = changedFiles => ({ schemaVersion: 'archive-ci-scope-v2', eventName: 'pull_request', headSha: head, changedFiles });
const fontDir = path.posix.dirname(checker.FONT_STYLESHEET) + '/';
const readFont = file => fs.readFileSync(path.join(__dirname, '..', file));
const studentCss = readFont(checker.FONT_STYLESHEET).toString('utf8');
const studentFonts = [...checker.declaredStudentFonts(studentCss).keys()];
const fontPathToken = './' + path.posix.basename(studentFonts[0]);
const fontResources = new Set([checker.FONT_STYLESHEET, ...studentFonts]);
const localOrigin = 'http://127.0.0.1:49160';
const localUrl = file => localOrigin + '/' + file;

function deferredRouteStep() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

function studentFontRouteFixture(overrides = {}) {
  const fontPath = studentFonts[0];
  const url = new URL(localUrl(fontPath));
  const bytes = readFont(fontPath);
  const state = { declaredFonts: new Set([fontPath]), fontRefs: new Map([[fontPath, { path: fontPath, sha256: checker.sha256(bytes) }]]),
    fontWeights: new Map([[fontPath, 400]]), studentFontResources: new Map(), fontResources: new Map(), failures: [] };
  const calls = [];
  const response = { headers: () => ({ 'content-type': 'font/woff2' }), status: () => 200, url: () => url.href,
    body: async () => bytes };
  const route = { request: () => ({ url: () => url.href }), async fetch(options) {
    calls.push('fetch'); assert.deepEqual(options, { timeout: 15000, maxRedirects: 0 }); return response;
  }, async fulfill(options) { calls.push('fulfill'); assert.equal(options.response, response); },
  async abort(reason) { calls.push('abort'); assert.equal(reason, 'failed'); }, ...overrides };
  return { url, fontPath, state, calls, response, route };
}

test('owned route work settles concurrent and newly arrived handlers before interception is removed', async () => {
  const failures = [], lifecycle = checker.createStudentRouteLifecycle(failures), events = [];
  const first = deferredRouteStep(), second = deferredRouteStep(), late = deferredRouteStep();
  let completed = 0;
  const route = { request: () => ({ url: () => 'https://example.test/hashed-only' }) };
  const lateHandler = lifecycle.wrap(async () => { await late.promise; completed++; events.push('late-settled'); });
  lifecycle.wrap(async () => { await first.promise; completed++; events.push('first-settled'); lateHandler(route); })(route);
  lifecycle.wrap(async () => { await second.promise; completed++; events.push('second-settled'); })(route);
  const page = { async unrouteAll(options) {
    assert.deepEqual(options, { behavior: 'wait' });
    assert.equal(completed, 3, 'unroute must not release another in-flight route'); events.push('unroute');
  } };
  const closing = checker.closeStudentContext(page, { async close() { events.push('close'); } },
    () => { assert.equal(failures.length, 0); events.push('verify'); }, lifecycle);
  await Promise.resolve(); assert.deepEqual(events, []);
  first.resolve(); await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(events, ['first-settled']);
  second.resolve(); await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(events, ['first-settled', 'second-settled']);
  late.resolve(); await closing;
  assert.deepEqual(events, ['first-settled', 'second-settled', 'late-settled', 'unroute', 'verify', 'close']);
});

test('student font route records a resource only after successful fulfillment', async () => {
  const fixture = studentFontRouteFixture(), fulfill = deferredRouteStep();
  fixture.route.fulfill = async () => { fixture.calls.push('fulfill'); await fulfill.promise; };
  const work = checker.serveStudentFont(fixture.route, fixture.url, fixture.fontPath, fixture.state);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(fixture.calls, ['fetch', 'fulfill']);
  assert.equal(fixture.state.fontResources.size, 0); assert.equal(fixture.state.studentFontResources.size, 0);
  fulfill.resolve(); await work;
  assert.equal(fixture.state.fontResources.size, 1); assert.equal(fixture.state.studentFontResources.size, 1);
  assert.equal(fixture.state.failures.length, 0);
});

test('student font route fetch failure aborts once and still fails owned cleanup', async () => {
  const failure = new Error('actual font fetch failed'), fixture = studentFontRouteFixture();
  fixture.route.fetch = async () => { fixture.calls.push('fetch'); throw failure; };
  const lifecycle = checker.createStudentRouteLifecycle(fixture.state.failures);
  await lifecycle.wrap(route => checker.serveStudentFont(route, fixture.url, fixture.fontPath, fixture.state))(fixture.route);
  let closed = 0;
  await assert.rejects(checker.closeStudentContext({ async unrouteAll() { assert.fail('failed work must not wait for an unresolved Playwright handled promise'); } },
    { async close() { closed++; } }, () => assert.fail('failure cannot become PASS'), lifecycle), error => error === failure);
  assert.equal(closed, 1); assert.deepEqual(fixture.calls, ['fetch', 'abort']);
  assert.equal(fixture.state.fontResources.size, 0);
  assert.equal(fixture.state.failures[0].stage, 'FETCH');
  assert.equal(fixture.state.failures[0].errorMessageSha256, checker.sha256(failure.message));
});

test('student font route aborts altered checkout bytes before fulfillment', async () => {
  const fixture = studentFontRouteFixture();
  fixture.response.body = async () => Buffer.from('altered font');
  await assert.rejects(checker.serveStudentFont(fixture.route, fixture.url, fixture.fontPath, fixture.state), /UI_FONT_BYTES_DRIFT/);
  assert.deepEqual(fixture.calls, ['fetch', 'abort']);
  assert.equal(fixture.state.fontResources.size, 0);
  assert.equal(fixture.state.studentFontResources.size, 0);
  assert.equal(fixture.state.failures[0].stage, 'BODY_HASH');
});

test('student font route asynchronous fulfillment failure is recorded and is never aborted twice', async () => {
  const failure = new Error('route.fulfill: Route is already handled!'), fixture = studentFontRouteFixture();
  fixture.route.fulfill = async () => { fixture.calls.push('fulfill'); await Promise.resolve(); throw failure; };
  const lifecycle = checker.createStudentRouteLifecycle(fixture.state.failures);
  await lifecycle.wrap(route => checker.serveStudentFont(route, fixture.url, fixture.fontPath, fixture.state))(fixture.route);
  let closed = false;
  await assert.rejects(checker.closeStudentContext({ async unrouteAll() { assert.fail('no unroute wait after a settlement error'); } },
    { async close() { closed = true; } }, () => assert.fail('failure cannot become PASS'), lifecycle), error => error === failure);
  assert.equal(closed, true); assert.deepEqual(fixture.calls, ['fetch', 'fulfill']);
  assert.equal(fixture.state.fontResources.size, 0); assert.equal(fixture.state.studentFontResources.size, 0);
  assert.equal(fixture.state.failures[0].stage, 'FULFILL');
  assert.equal(fixture.state.failures[0].errorMessageSha256, checker.sha256(failure.message));
});

test('student font route preserves both the original fetch failure and an abort failure', async () => {
  const fetchError = new Error('fetch failed'), abortError = new Error('abort failed'), fixture = studentFontRouteFixture();
  fixture.route.fetch = async () => { fixture.calls.push('fetch'); throw fetchError; };
  fixture.route.abort = async () => { fixture.calls.push('abort'); throw abortError; };
  await assert.rejects(checker.serveStudentFont(fixture.route, fixture.url, fixture.fontPath, fixture.state), error =>
    error instanceof AggregateError && error.message === 'UI_ROUTE_ABORT_FAILED' &&
    error.errors[0] === fetchError && error.errors[1] === abortError);
  assert.deepEqual(fixture.calls, ['fetch', 'abort']);
  assert.deepEqual(fixture.state.failures.map(x => x.stage), ['FETCH', 'ABORT']);
  assert.equal(fixture.state.failures[1].errorMessageSha256, checker.sha256(abortError.message));
});

test('owned route work records a non-font handler rejection and never calls the success verifier', async () => {
  const failures = [], lifecycle = checker.createStudentRouteLifecycle(failures), failure = new Error('continue failed');
  const route = { request: () => ({ url: () => 'https://example.test/request-not-exported' }) };
  await lifecycle.wrap(async () => { throw failure; })(route);
  let closed = false;
  await assert.rejects(checker.closeStudentContext(null, { async close() { closed = true; } },
    () => assert.fail('must not verify failed work'), lifecycle), error => error === failure);
  assert.equal(closed, true); assert.equal(failures.length, 1);
  assert.equal(failures[0].code, 'UI_ROUTE_HANDLER_FAILED');
  assert(!JSON.stringify(failures).includes('request-not-exported'));
});

test('student context retains the original case failure alongside route and close failures', async () => {
  const failures = [], lifecycle = checker.createStudentRouteLifecycle(failures);
  const original = new Error('UI_RENDERED_IMAGES'), routeError = new Error('route fulfillment failed'), closeError = new Error('context close failed');
  const route = { request: () => ({ url: () => 'https://example.test/private-request' }) };
  await lifecycle.wrap(async () => { throw routeError; })(route);
  await assert.rejects(checker.closeStudentContext(null, { async close() { throw closeError; } },
    () => assert.fail('failed work cannot pass verification'), lifecycle, original), error =>
      error instanceof AggregateError && error.message === original.message && error.cause === original &&
      error.errors.length === 3 && error.errors[0] === original && error.errors[1] === routeError && error.errors[2] === closeError);
  assert.equal(failures.length, 1);
});

test('student context waits for a pending font body and route fulfillment before disposal', async () => {
  const events = []; let disposed = false, releaseBody;
  const bodyReady = new Promise(resolve => { releaseBody = resolve; });
  const handler = (async () => {
    await bodyReady;
    assert.equal(disposed, false, 'pending response must still be readable');
    events.push('body-read', 'route-fulfilled');
  })();
  const page = { async unrouteAll(options) {
    assert.deepEqual(options, { behavior: 'wait' });
    events.push('drain-start'); await handler; events.push('drain-end');
  } };
  const context = { async close() { disposed = true; events.push('context-closed'); } };
  const completion = checker.closeStudentContext(page, context, () => {
    assert.equal(disposed, false); events.push('late-check');
  });
  await Promise.resolve();
  assert.equal(disposed, false); assert.deepEqual(events, ['drain-start']);
  releaseBody(); await completion;
  assert.deepEqual(events, ['drain-start', 'body-read', 'route-fulfilled', 'drain-end', 'late-check', 'context-closed']);
});

test('student context draining preserves late font failure diagnostics and does not suppress handler errors', async () => {
  const failures = []; let releaseFailure, closed = false;
  const pending = new Promise(resolve => { releaseFailure = resolve; });
  const message = 'apiResponse.body: genuine response body read failure';
  const handler = (async () => {
    await pending;
    failures.push(checker.fontFailureDiagnostic({ kind: 'FONT', stage: 'BODY_READ', httpStatus: 200,
      urlSha256: 'a'.repeat(64), responseUrlSha256: 'a'.repeat(64), mime: 'font/woff2' }, new Error(message)));
  })();
  const completion = checker.closeStudentContext({ async unrouteAll(options) {
    assert.deepEqual(options, { behavior: 'wait' }); await handler;
  } }, { async close() { closed = true; } }, () => {
    assert.equal(closed, false);
    assert.equal(failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
  });
  await Promise.resolve(); assert.equal(closed, false); assert.equal(failures.length, 0);
  const rejects = assert.rejects(completion, /UI_LATE_NETWORK_OR_PAGE_FAILURE/);
  releaseFailure(); await rejects;
  assert.equal(closed, true); assert.equal(failures.length, 1);
  assert.equal(failures[0].errorMessageSha256, checker.sha256(message));
  assert.equal(failures[0].stage, 'BODY_READ');
  assert.throws(() => assert.equal(failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE'), /UI_LATE_NETWORK_OR_PAGE_FAILURE/);
  const original = new Error('route handler failed'); let closedAfterError = false;
  await assert.rejects(checker.closeStudentContext({ async unrouteAll() { throw original; } },
    { async close() { closedAfterError = true; } }), error => error === original);
  assert.equal(closedAfterError, true);
});

test('the real engine imports its student font before qualified CSS rules', () => {
  const engine = fs.readFileSync(path.join(__dirname, '..', 'archive/engine.html'), 'utf8');
  const importRef = checker.FONT_STYLESHEET.slice('archive/'.length);
  const fontStyles = [...engine.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map(match => match[1]).filter(css => css.includes(importRef));
  assert.equal(fontStyles.length, 1, 'UI_ENGINE_UNIQUE_FONT_STYLESHEET');
  const css = fontStyles[0].replace(/\/\*[\s\S]*?\*\//g, '').trimStart();
  const firstRule = css.match(/^@import\s+url\((['"])([^'"]+)\1\)\s*;/);
  assert(firstRule, 'UI_ENGINE_FONT_IMPORT_MUST_PRECEDE_QUALIFIED_RULES');
  assert.equal(firstRule[2], importRef);
  assert.doesNotMatch(engine, /fonts\.(?:googleapis|gstatic)\.com/);
  assert.match(css, /font-family:\s*'Nanum Myeongjo',\s*serif;/);
  assert.match(css, /\.archive2-snapshot-output #print-header-editor-wrap,\.archive2-snapshot-output #qr-output-wrap\{display:none!important\}/);
});

test('only the exact same-origin student stylesheet and declared font subsets qualify', () => {
  for (const rel of fontResources) {
    assert.equal(checker.studentFontResourcePath(localUrl(rel), localOrigin, fontResources), rel);
  }
});
for (const [name, value] of [
  ['Google stylesheet', 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap'],
  ['Google font', 'https://fonts.gstatic.com/s/nanummyeongjo/v31/9Btx3DZF0dXLMZlywRbVRNhxy1Lu.woff2'],
  ['wrong origin', 'http://127.0.0.1:49161/' + checker.FONT_STYLESHEET],
  ['host lookalike', 'http://127.0.0.1.evil.test:49160/' + checker.FONT_STYLESHEET],
  ['query string', localUrl(studentFonts[0]) + '?extra=1'],
  ['fragment', localUrl(checker.FONT_STYLESHEET) + '#extra'],
  ['credentials', localUrl(checker.FONT_STYLESHEET).replace('http://', 'http://user@')],
  ['encoded filename', localUrl(studentFonts[0]).replace('/9B', '/%39B')],
  ['unknown file', localUrl(fontDir + 'nanum-myeongjo-900.woff2')],
  ['superseded full font', localUrl(fontDir + 'nanum-myeongjo-400.woff2')],
]) test(`student font transport refuses ${name}`, () => assert.equal(checker.studentFontResourcePath(value, localOrigin, fontResources), null));

test('the real stylesheet declares 92 normal swap font subsets for each of the three weights', () => {
  const fonts = checker.declaredStudentFonts(studentCss);
  assert.equal(fonts.size, 276);
  assert.deepEqual([400, 700, 800].map(weight => [...fonts.values()].filter(value => value === weight).length), [92, 92, 92]);
});
const fontReader = read => ({ read, ref: (file, data) => ({ path: file, bytes: data.length, sha256: checker.sha256(data) }) });
test('the declared assets are the locked v31 Chromium WOFF2 payloads and their upstream OFL', () => {
  const { refs, licenseRef, weights } = checker.checkedStudentFontRefs(fontReader(readFont));
  assert.deepEqual([...refs.keys()], [checker.FONT_STYLESHEET, ...studentFonts.slice().sort()]);
  assert.deepEqual([...weights.keys()], studentFonts);
  assert.equal(studentFonts.reduce((sum, file) => sum + refs.get(file).bytes, 0), 6002860);
  assert.equal(licenseRef.path, checker.FONT_LICENSE);
  assert.equal(licenseRef.bytes, 4457);
  const pages = JSON.parse(readFont('tools/archive-pages-release-manifest.json'));
  const tree = pages.trees.find(row => row.path === 'archive/vendor');
  assert(tree && !tree.exclude?.includes('nanum-myeongjo'));
});
test('a missing, altered or swapped font or altered license fails closed', () => {
  const check = read => checker.checkedStudentFontRefs(fontReader(read));
  assert.throws(() => check(file => readFont(file === studentFonts[0] ? fontDir + 'missing.woff2' : file)), /ENOENT/);
  assert.throws(() => check(file => file === studentFonts[0] ? readFont(studentFonts[1]) : readFont(file)), /UI_FONT_BYTES_DRIFT/);
  assert.throws(() => check(file => file === studentFonts[0] ? Buffer.from('wOF2tampered') : readFont(file)), /UI_FONT_BYTES_DRIFT/);
  assert.throws(() => check(file => file === checker.FONT_LICENSE ? Buffer.from('altered') : readFont(file)), /UI_FONT_LICENSE_DRIFT/);
});
test('the font CSS must preserve both the original unicode ranges and declaration order', () => {
  const range = studentCss.replace(/unicode-range:\s*U\+[0-9a-f]+/i, 'unicode-range: U+EE');
  const [first, second] = studentCss.match(/@font-face\s*\{[^{}]*\}/g);
  const head = studentCss.indexOf(first);
  const next = studentCss.indexOf(second, head + first.length);
  const swapped = studentCss.slice(0, head) + second + studentCss.slice(head + first.length, next) +
    first + studentCss.slice(next + second.length);
  for (const css of [range, swapped]) {
    assert.notEqual(css, studentCss);
    assert.equal(checker.declaredStudentFonts(css).size, 276);
    assert.throws(() => checker.checkedStudentFontRefs(fontReader(file => file === checker.FONT_STYLESHEET ? Buffer.from(css) : readFont(file))),
      /UI_FONT_STYLESHEET_BYTES_DRIFT/);
  }
});
for (const suffix of ['120.woff2', '999.woff2', '00.woff2', '01.woff2', '-1.woff2', '+1.woff2',
  '1e2.woff2', 'subset.woff2', '1.2.woff2', '119.woff', '119.ttf', '119.woff2?other=1', '119.woff2#other']) {
  test(`font CSS refuses undeclared subset shape ${suffix}`, () => {
    assert.throws(() => checker.declaredStudentFonts(studentCss.replaceAll('.woff2', `.${suffix}`)),
      /UI_FONT_URL_OUTSIDE_DECLARED_FAMILY/);
  });
}
for (const [name, css] of [
  ['nested stylesheet', `@import 'https://example.test/font.css';\n${studentCss}`],
  ['another family directory', studentCss.replace(fontPathToken, './other/' + path.posix.basename(studentFonts[0]))],
  ['another origin', studentCss.replace(fontPathToken, 'https://example.test/font.woff2')],
  ['missing required weight', studentCss.replace('font-weight: 800;', 'font-weight: 900;')],
  ['malformed escaped URL', studentCss.replace(fontPathToken, '.\\escape/font.woff2')],
  ['incorrect family', studentCss.replace('Nanum Myeongjo', 'Other')],
  ['changed loading strategy', studentCss.replace('font-display: swap;', 'font-display: block;')],
  ['changed style', studentCss.replace('font-style: normal;', 'font-style: italic;')],
  ['duplicate declaration', studentCss.replace('font-weight: 400;', 'font-weight: 400; font-weight: 700;')],
  ['workstation-only fallback', studentCss.replace('src: url(', 'src: local("Nanum Myeongjo"), url(')],
  ['unspecified subset coverage', studentCss.replace(/unicode-range:[^;]+;/, '')],
  ['other CSS rule', studentCss + 'body { color: white; }'],
]) test(`font CSS refuses ${name}`, () => assert.throws(() => checker.declaredStudentFonts(css)));

test('font failure diagnostics distinguish parsed CSS refusal from request failure without raw response content', () => {
  const observation = { kind: 'STYLESHEET', urlSha256: 'a'.repeat(64), stage: 'CSS_DECLARATIONS', httpStatus: 200,
    responseUrlSha256: 'a'.repeat(64), mime: 'text/css', bytes: 173575, responseSha256: 'b'.repeat(64), rawBody: 'DO_NOT_EXPORT_BODY' };
  let parserError;
  try { checker.declaredStudentFonts(studentCss.replace(fontPathToken, './other/font.woff2')); } catch (error) { parserError = error; }
  const diagnostic = checker.fontFailureDiagnostic(observation, parserError);
  assert.equal(diagnostic.stage, 'CSS_DECLARATIONS'); assert.equal(diagnostic.httpStatus, 200);
  assert.equal(diagnostic.mime, 'text/css'); assert.equal(diagnostic.bytes, 173575);
  assert.equal(diagnostic.errorCode, 'UI_FONT_URL_OUTSIDE_DECLARED_FAMILY');
  assert.equal(diagnostic.errorName, 'AssertionError');
  assert.deepEqual(Object.keys(diagnostic).sort(), ['code', 'kind', 'urlSha256', 'stage', 'httpStatus',
    'responseUrlSha256', 'mime', 'bytes', 'responseSha256', 'errorName', 'errorCode', 'errorMessageSha256'].sort());
  assert(!JSON.stringify(diagnostic).includes('DO_NOT_EXPORT'));
});

test('font request diagnostics keep only bounded metadata and hash an unclassified message', () => {
  const message = 'Request failed: https://example.test/DO_NOT_EXPORT_URL';
  const error = new Error(message); error.name = 'DO_NOT_EXPORT_ERROR';
  const diagnostic = checker.fontFailureDiagnostic({ kind: 'STYLESHEET', stage: 'FETCH', urlSha256: 'a'.repeat(64) }, error);
  assert.equal(diagnostic.stage, 'FETCH'); assert.equal(diagnostic.httpStatus, null);
  assert.equal(diagnostic.bytes, null); assert.equal(diagnostic.responseSha256, null);
  assert.equal(diagnostic.errorName, 'OtherError'); assert.equal(diagnostic.errorCode, 'UNCLASSIFIED_ERROR');
  assert.equal(diagnostic.errorMessageSha256, checker.sha256(message));
  assert(!JSON.stringify(diagnostic).includes('DO_NOT_EXPORT'));
  const malformed = checker.fontFailureDiagnostic({ kind: message, stage: message, urlSha256: message,
    responseUrlSha256: message, mime: message, responseSha256: message, bytes: -1, httpStatus: 1000 }, error);
  assert.equal(malformed.kind, 'UNKNOWN'); assert.equal(malformed.stage, 'UNKNOWN');
  for (const key of ['urlSha256', 'responseUrlSha256', 'mime', 'responseSha256', 'bytes', 'httpStatus']) assert.equal(malformed[key], null);
  assert(!JSON.stringify(malformed).includes('DO_NOT_EXPORT'));
});

test('font HTTP assertion diagnostics preserve the fixed code while excluding compared values', () => {
  let httpError;
  try { assert.equal(503, 200, 'UI_FONT_HTTP_STATUS'); } catch (error) { httpError = error; }
  const diagnostic = checker.fontFailureDiagnostic({ kind: 'FONT', stage: 'HTTP_STATUS', httpStatus: 503,
    urlSha256: 'a'.repeat(64), responseUrlSha256: 'a'.repeat(64), mime: 'text/html' }, httpError);
  assert.equal(diagnostic.errorCode, 'UI_FONT_HTTP_STATUS'); assert.equal(diagnostic.httpStatus, 503);
  assert.equal(diagnostic.mime, 'text/html'); assert.equal(diagnostic.bytes, null);
  assert.equal(diagnostic.errorMessageSha256, checker.sha256(httpError.message));
  assert(!JSON.stringify(diagnostic).includes('503 !== 200'));
});

function captureFrame() {
  // The actual desktop artifact placed a 994px q-box near y=3 while the
  // production fixed controls occupied y=0..114. Its real content fits below.
  return { question: { x: 350.34375, y: 2.578125, width: 664.3125, height: 994.03125 },
    children: [
      { x: 350.34375, y: 12.578125, width: 664.3125, height: 19 },
      { x: 350.34375, y: 37.578125, width: 664.3125, height: 180 },
      { x: 350.34375, y: 225.578125, width: 664.3125, height: 256 },
      { x: 350.34375, y: 491.578125, width: 664.3125, height: 20 }
    ], viewport: { width: 1365, height: 1000 }, scroll: { x: 0, y: 6000 },
    obstructions: [{ x: 0, y: 0, width: 1365, height: 56 }, { x: 0, y: 56, width: 1365, height: 58 }],
    feedbackIdle: true, readiness: 'RENDER_READY', solutionNodes: 0, mandatoryChildrenVisible: true,
    questionNumber: '12.', domSha256: 'c'.repeat(64) };
}
function scrollFrame(frame, delta) {
  frame.question.y -= delta;
  for (const child of frame.children) child.y -= delta;
  if (frame.image) frame.image.y -= delta;
  frame.scroll.y += delta;
}

test('the actual desktop placement is rejected despite a complete image inside the q-box', () => {
  assert.throws(() => checker.assertProblemCapture(captureFrame()), /UI_CAPTURE_OBSCURED/);
});

test('capture includes all visible children and excludes only the empty flex tail', () => {
  const frame = captureFrame(), clip = checker.problemContentClip(frame);
  assert.equal(clip.x, frame.question.x); assert.equal(clip.width, frame.question.width);
  assert(clip.y <= frame.children[0].y);
  assert(clip.y + clip.height >= frame.children.at(-1).y + frame.children.at(-1).height);
  assert(clip.height < frame.question.height);
  const newChild = { x: clip.x, y: 600, width: clip.width, height: 50 };
  frame.children.push(newChild);
  assert(checker.problemContentClip(frame).y + checker.problemContentClip(frame).height >= 650);
});

test('natural scrolling places complete desktop content below both fixed bars without resizing', () => {
  const frame = captureFrame(), original = copy(frame), plan = checker.planProblemScroll(frame);
  assert(plan.scrollByY < 0); assert.equal(plan.safeInterval[0], 122);
  scrollFrame(frame, plan.scrollByY);
  const clip = checker.assertProblemCapture(frame);
  assert.equal(clip.y, 122); assert.equal(frame.question.width, original.question.width);
  assert.equal(frame.question.height, original.question.height); assert.deepEqual(frame.viewport, original.viewport);
  assert.deepEqual(frame.obstructions, original.obstructions);
});

test('already clear mobile content is captured with no extra scroll', () => {
  const frame = captureFrame(); frame.viewport = { width: 390, height: 844 };
  frame.question = { x: 28, y: 137, width: 334, height: 569 };
  frame.children = [{ x: 28, y: 147, width: 334, height: 19 }, { x: 28, y: 172, width: 334, height: 220 },
    { x: 28, y: 400, width: 334, height: 256 }, { x: 28, y: 666, width: 334, height: 20 }];
  frame.obstructions = frame.obstructions.map(rect => ({ ...rect, width: 390 }));
  assert.equal(checker.planProblemScroll(frame).scrollByY, 0);
  assert(checker.assertProblemCapture(frame).height > 530);
});

for (const [name, mutate, error] of [
  ['number or statement missing from the measured content', frame => frame.children.splice(0, 2), /UI_COMPLETE_PROBLEM_CHILDREN/],
  ['content outside the q-box', frame => { frame.children.at(-1).y = 990; }, /UI_PROBLEM_CHILD_CLIPPED/],
  ['horizontal viewport clipping', frame => { frame.viewport.width = 900; }, /UI_PROBLEM_HORIZONTAL_CLIP/],
  ['complete content cannot fit the unchanged viewport', frame => { frame.viewport.height = 500; }, /UI_COMPLETE_PROBLEM_DOES_NOT_FIT_VIEWPORT/],
  ['zero-size content', frame => { frame.children[0].height = 0; }, /UI_CAPTURE_RECT/]
]) test(`capture planning refuses ${name}`, () => { const frame = captureFrame(); mutate(frame); assert.throws(() => checker.planProblemScroll(frame), error); });

for (const [name, mutate, error] of [
  ['pending status panel', frame => { frame.feedbackIdle = false; }, /UI_RENDER_FEEDBACK_NOT_IDLE/],
  ['solution DOM appears', frame => { frame.solutionNodes = 1; }, /UI_CAPTURE_RENDER_STATE/],
  ['readiness becomes pending', frame => { frame.readiness = 'RENDERING'; }, /UI_CAPTURE_RENDER_STATE/],
  ['absolute viewport edge truncates the complete question', frame => { frame.viewport.height = 500; }, /UI_COMPLETE_PROBLEM_OUTSIDE_VIEWPORT/],
  ['new fixed panel intersects the chosen content', frame => { frame.obstructions.push({ x: 600, y: 250, width: 100, height: 40 }); }, /UI_CAPTURE_OBSCURED/]
]) test(`capture gate refuses ${name}`, () => {
  const frame = captureFrame(); scrollFrame(frame, checker.planProblemScroll(frame).scrollByY); mutate(frame);
  assert.throws(() => checker.assertProblemCapture(frame), error);
});

function captureDriver(mutate = {}) {
  const frame = captureFrame(), calls = [], shots = [];
  const target = { async evaluate(fn, argument) {
    calls.push(fn.name);
    if (fn.name === 'measureProblemCapture') return copy(frame);
    if (fn.name === 'inspectCaptureHits') return { samples: 1500, outsideQuestion: mutate.foreignHits || 0 };
    throw new Error('UNEXPECTED_BROWSER_OPERATION');
  } };
  const page = {
    async waitForFunction(_fn, _arg, options) { assert.equal(options.timeout, 15000); if (mutate.pending) throw new Error('timeout'); },
    async evaluate(_fn, delta) { if (typeof delta === 'number') { scrollFrame(frame, delta); if (mutate.afterScroll) mutate.afterScroll(frame); } },
    async screenshot(options) { shots.push(options); if (mutate.afterScreenshot) mutate.afterScreenshot(frame); }
  };
  return { frame, page, target, calls, shots };
}

test('the capture path uses one verified viewport clip without locator scrolling or style overrides', async () => {
  const driver = captureDriver(), result = await checker.captureCompleteProblem(driver.page, driver.target, '/synthetic/problem.png');
  assert.equal(driver.shots.length, 1);
  assert.deepEqual(Object.keys(driver.shots[0]).sort(), ['path', 'clip', 'fullPage', 'caret', 'timeout'].sort());
  assert.equal(driver.shots[0].fullPage, false); assert.equal(driver.shots[0].caret, 'initial');
  assert.equal(result.scrollOperations, 1); assert.equal(result.foreignContentHits, 0);
  assert.equal(result.cssWrites + result.domWrites + result.viewportChanges, 0);
  assert.equal(driver.calls.filter(name => name === 'inspectCaptureHits').length, 2);
});

for (const [name, mutation, error, shots] of [
  ['render feedback never settles', { pending: true }, /UI_RENDER_FEEDBACK_NOT_IDLE/, 0],
  ['an unrelated visible element wins a capture hit test', { foreignHits: 1 }, /UI_CAPTURE_FOREIGN_CONTENT/, 0],
  ['a mandatory problem element is hidden', { afterScroll: frame => { frame.mandatoryChildrenVisible = false; } }, /UI_REQUIRED_PROBLEM_CHILD_HIDDEN/, 0],
  ['the problem DOM changes during scrolling', { afterScroll: frame => { frame.domSha256 = 'd'.repeat(64); } }, /UI_PROBLEM_DOM_CHANGED_DURING_SCROLL/, 0],
  ['the problem DOM changes during the screenshot', { afterScreenshot: frame => { frame.domSha256 = 'd'.repeat(64); } }, /UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE/, 1],
  ['capture unexpectedly scrolls the page', { afterScreenshot: frame => { frame.scroll.y += 2; } }, /UI_CAPTURE_SCROLLED/, 1],
  ['the content moves during capture', { afterScreenshot: frame => { frame.children.at(-1).y += 2; } }, /UI_CAPTURE_GEOMETRY_CHANGED/, 1],
  ['a fixed panel appears during capture', { afterScreenshot: frame => { frame.obstructions.push({ x: 400, y: 160, width: 100, height: 40 }); } }, /UI_CAPTURE_OBSCURED/, 1]
]) test(`browser capture refuses ${name}`, async () => {
  const driver = captureDriver(mutation);
  await assert.rejects(checker.captureCompleteProblem(driver.page, driver.target, '/synthetic/problem.png'), error);
  assert.equal(driver.shots.length, shots);
});

function tallMobileFrame() {
  const frame = captureFrame();
  frame.viewport = { width: 390, height: 844 };
  frame.question = { x: 28, y: 3, width: 334, height: 1600 };
  frame.children = [{ x: 28, y: 13, width: 334, height: 19 }, { x: 28, y: 38, width: 334, height: 600 },
    { x: 28, y: 648, width: 334, height: 540 }, { x: 28, y: 1198, width: 334, height: 70 }];
  frame.image = copy(frame.children[2]);
  frame.obstructions = frame.obstructions.map(rect => ({ ...rect, width: 390 }));
  return frame;
}

function tileDriver(mutation = {}, initial = tallMobileFrame()) {
  const frame = copy(initial), shots = [], calls = [];
  if (!frame.image) frame.image = copy(frame.children[2]);
  const target = { async evaluate(fn, arg) {
    calls.push(fn.name);
    if (fn.name === 'measureProblemCapture') return copy(frame);
    if (fn.name === 'inspectCaptureHits') return { samples: 1500, outsideQuestion: mutation.foreignHits || 0 };
    throw Error('UNEXPECTED_BROWSER_OPERATION');
  } };
  const page = {
    async waitForFunction(_fn, _arg, options) { assert.equal(options.timeout, 15000); if (mutation.pending) throw Error('timeout'); },
    async evaluate(_fn, delta) {
      if (typeof delta === 'number') {
        if (!mutation.stuckScroll) scrollFrame(frame, delta);
        if (mutation.afterScroll) mutation.afterScroll(frame);
      }
    },
    async screenshot(options) { shots.push(copy(options)); if (mutation.afterScreenshot) mutation.afterScreenshot(frame, shots.length); }
  };
  return { frame, target, page, shots, calls };
}

test('UI v2 keeps six logical cases separate from bounded original PNG tiles', () => {
  assert.equal(checker.SCHEMA, 'archive-problem-renderer-student-ui-preview-v2');
  assert.equal(checker.TILE_SCHEMA, 'archive-problem-scroll-coverage-v1');
  assert.equal(checker.TILE_LIMIT, 8); assert.equal(checker.TILE_OVERLAP, 32);
  const source = fs.readFileSync(path.join(__dirname, '..', checker.CHECKER_PATH), 'utf8');
  assert.match(source, /expectedLogicalCases: manifest\.expectedCases/);
  assert.match(source, /completedLogicalCases: results\.length/);
  assert.match(source, /UI_SCREENSHOT_ARTIFACT_INVENTORY/);
  assert.match(source, /UI_UNIQUE_SIX_REQUIRED/);
  assert.match(source, /UI_TOTAL_TIMEOUT[\s\S]*?240000/);
  assert(!/screenshot:\s*\{\s*path: screenshotPath/.test(source), 'v2 cannot retain a misleading single-shot alias');
});

test('tall mobile planning retains the single-shot rejection and proves complete overlapping tile coverage', () => {
  const frame = tallMobileFrame(), before = copy(frame), height = checker.problemContentClip(frame).height;
  assert.throws(() => checker.planProblemScroll(frame), /UI_COMPLETE_PROBLEM_DOES_NOT_FIT_VIEWPORT/);
  const plan = checker.planProblemTiles(frame);
  assert.equal(plan.tiles.length, 2); assert.equal(plan.tiles[0].relativeInterval[0], 0);
  assert.equal(plan.tiles.at(-1).relativeInterval[1], height);
  assert.equal(plan.tiles[0].relativeInterval[1] - plan.tiles[1].relativeInterval[0], 32);
  assert.deepEqual(plan.coverage, { requiredInterval: [0, height], coveredInterval: [0, height], complete: true });
  assert.deepEqual(frame, before, 'planning has no rendering mutation');
});

test('a one-tile desktop case keeps the complete content envelope and zero artificial split', () => {
  const frame = captureFrame(); frame.image = copy(frame.children[2]);
  const plan = checker.planProblemTiles(frame);
  assert.equal(plan.tiles.length, 1); assert.equal(plan.tiles[0].relativeInterval[1], checker.problemContentClip(frame).height);
});

for (const [name, mutate, error] of [
  ['missing top', t => { t[0].relativeInterval[0] = 1; }, /TOP_MISSING/],
  ['missing bottom', t => { t.at(-1).relativeInterval[1] -= 1; }, /BOTTOM_MISSING/],
  ['gap between tiles', t => { t[1].relativeInterval[0] = t[0].relativeInterval[1] + 1; }, /OVERLAP/],
  ['31px overlap', t => { t[1].relativeInterval[0] += 1; }, /OVERLAP/],
  ['33px overlap', t => { t[1].relativeInterval[0] -= 1; }, /OVERLAP/],
  ['out-of-order indices', t => { t[1].tileIndex = 1; }, /RANGE/],
  ['duplicated region', t => { t[1].relativeInterval = copy(t[0].relativeInterval); }, /NO_PROGRESS/],
  ['nonfinite bound', t => { t[0].relativeInterval[1] = NaN; }, /RANGE/],
  ['negative start', t => { t[0].relativeInterval[0] = -1; }, /RANGE/],
  ['overshoot after content', t => { t.at(-1).relativeInterval[1] += 1; }, /RANGE/],
  ['missing last artifact', t => { t.pop(); }, /BOTTOM_MISSING/]
]) test(`scroll coverage refuses ${name}`, () => {
  const frame = tallMobileFrame(), plan = checker.planProblemTiles(frame), tiles = copy(plan.tiles); mutate(tiles);
  assert.throws(() => checker.assertTileCoverage(checker.problemContentClip(frame).height, tiles), error);
});

for (const [name, mutate, error] of [
  ['horizontal overflow', f => { f.children[0].width = 400; }, /PROBLEM_CHILD_CLIPPED/],
  ['viewport narrower than the question', f => { f.viewport.width = 300; }, /HORIZONTAL_CLIP/],
  ['no useful visible interval', f => { f.obstructions.push({ x: 0, y: 114, width: 390, height: 700 }); }, /VISIBLE_AREA/],
  ['more than eight tiles', f => { f.question.height = 20000; f.children.at(-1).y = 19000; }, /TILE_LIMIT/],
  ['missing mandatory content', f => { f.children.splice(0, 2); }, /COMPLETE_PROBLEM_CHILDREN/]
]) test(`tile planning refuses ${name}`, () => { const frame = tallMobileFrame(); mutate(frame); assert.throws(() => checker.planProblemTiles(frame), error); });

test('two natural scroll captures preserve exact document geometry, 32px overlap and every viewport pixel', async () => {
  const driver = tileDriver(), original = copy(driver.frame);
  const result = await checker.captureProblemTiles(driver.page, driver.target, '/synthetic/problem.png');
  assert.equal(result.tileCount, 2); assert.equal(driver.shots.length, 2);
  assert.equal(result.tiles[0].relativeInterval[1] - result.tiles[1].relativeInterval[0], 32);
  assert.deepEqual(result.viewport, original.viewport); assert.equal(result.content.height, checker.problemContentClip(original).height);
  assert.equal(result.cssWrites + result.domWrites + result.viewportChanges, 0); assert.equal(result.compositeImageCreated, false);
  assert.equal(result.foreignContentHits, 0); assert.equal(result.coverage.complete, true);
  assert.equal(new Set(result.tiles.map(t => t.filename)).size, 2);
  for (let i = 0; i < driver.shots.length; i++) {
    const shot = driver.shots[i]; assert.equal(shot.fullPage, false); assert.equal(shot.caret, 'initial'); assert.equal(shot.timeout, 15000);
    assert.equal(shot.clip.width, original.question.width); assert.equal(shot.clip.height, result.tiles[i].relativeInterval[1] - result.tiles[i].relativeInterval[0]);
    assert.match(shot.path, new RegExp(`tile-0${i + 1}\\.png$`));
    assert.equal(result.tiles[i].obstructionsIntersectingClip, 0); assert(result.tiles[i].hitTestSamples > 0);
  }
  assert.equal(driver.calls.filter(n => n === 'inspectCaptureHits').length, 4);
});

test('single desktop capture uses the same v2 inventory without a stitched or legacy screenshot alias', async () => {
  const driver = tileDriver({}, captureFrame());
  const result = await checker.captureProblemTiles(driver.page, driver.target, '/synthetic/desktop.png');
  assert.equal(result.tileCount, 1); assert.equal(driver.shots.length, 1); assert.equal(result.coverage.complete, true);
  assert.equal(result.tiles[0].filename, 'desktop-tile-01.png');
});

for (const [name, mutation, error] of [
  ['feedback remains pending', { pending: true }, /FEEDBACK_NOT_IDLE/],
  ['natural scrolling cannot move the page', { stuckScroll: true }, /OUTSIDE_VIEWPORT|OBSCURED/],
  ['foreign overlay hit', { foreignHits: 1 }, /FOREIGN_CONTENT/],
  ['hidden child after scroll', { afterScroll: f => { f.mandatoryChildrenVisible = false; } }, /CHILD_HIDDEN/],
  ['changed DOM after scroll', { afterScroll: f => { f.domSha256 = 'd'.repeat(64); } }, /DOM_CHANGED_DURING_SCROLL/],
  ['changed document geometry after scroll', { afterScroll: f => { f.children[1].height += 1; } }, /DOCUMENT_GEOMETRY_CHANGED/],
  ['changed viewport after scroll', { afterScroll: f => { f.viewport.width += 1; } }, /DOCUMENT_GEOMETRY_CHANGED/],
  ['solution DOM after scroll', { afterScroll: f => { f.solutionNodes = 1; } }, /RENDER_STATE/],
  ['screenshot scrolls without permission', { afterScreenshot: f => { f.scroll.y += 1; } }, /CAPTURE_SCROLLED/],
  ['screenshot changes content', { afterScreenshot: f => { f.children.at(-1).y += 1; } }, /DOCUMENT_GEOMETRY_CHANGED/],
  ['screenshot changes DOM', { afterScreenshot: f => { f.domSha256 = 'd'.repeat(64); } }, /DOM_CHANGED_DURING_CAPTURE/],
  ['later tile loses a mandatory element', { afterScreenshot: (f, n) => { if (n === 2) f.mandatoryChildrenVisible = false; } }, /CHILD_HIDDEN/],
  ['later tile gains a toast', { afterScreenshot: (f, n) => { if (n === 2) f.obstructions.push({ x: 30, y: 200, width: 300, height: 100 }); } }, /OBSCURED/]
]) test(`v2 scroll capture refuses ${name}`, async () => {
  const driver = tileDriver(mutation); await assert.rejects(checker.captureProblemTiles(driver.page, driver.target, '/synthetic/problem.png'), error);
});

function tileInventory() {
  const rows = [{ key: 'E005-Q12', viewport: { name: 'mobile' }, capture: { tileCount: 2, tiles: [] }, screenshots: [] },
    { key: 'E006-Q3', viewport: { name: 'desktop' }, capture: { tileCount: 1, tiles: [] }, screenshots: [] }];
  for (const row of rows) for (let index = 1; index <= row.capture.tileCount; index++) {
    const file = `${row.key}-${row.viewport.name}-tile-${String(index).padStart(2, '0')}.png`;
    row.capture.tiles.push({ tileIndex: index, filename: file });
    row.screenshots.push({ tileIndex: index, path: file, sha256: checker.sha256(file), bytes: 123 });
  }
  return { rows, artifacts: rows.flatMap(row => row.screenshots.map(({ path, sha256, bytes }) => ({ path, sha256, bytes }))) };
}

test('the artifact inventory binds all original tile paths and raw bytes separately from logical cases', () => {
  const { rows, artifacts } = tileInventory();
  assert.equal(rows.length, 2); assert.equal(checker.assertScreenshotInventory(rows, artifacts), 3);
});

for (const [name, mutate, error] of [
  ['unrecorded extra PNG', f => { f.artifacts.push({ path: 'extra.png', sha256: 'a'.repeat(64), bytes: 1 }); }, /ARTIFACT_INVENTORY/],
  ['missing original tile', f => { f.artifacts.pop(); }, /ARTIFACT_INVENTORY/],
  ['same path changed bytes', f => { f.artifacts[0].sha256 = 'b'.repeat(64); }, /ARTIFACT_INVENTORY/],
  ['changed byte count', f => { f.artifacts[0].bytes += 1; }, /ARTIFACT_INVENTORY/],
  ['duplicated file', f => { f.artifacts.push(copy(f.artifacts[0])); }, /ARTIFACT_INVENTORY/],
  ['duplicated logical record', f => { f.rows.push(copy(f.rows[0])); }, /ARTIFACT_DUPLICATE/],
  ['missing tile mapping', f => { f.rows[0].capture.tiles.pop(); }, /TILE_COUNT/],
  ['reordered tile mapping', f => { f.rows[0].screenshots.reverse(); }, /TILE_BINDING/],
  ['forged legacy single-shot name', f => { f.rows[0].screenshots[0].path = 'E005-Q12-mobile.png'; }, /TILE_BINDING/],
  ['foreign case filename', f => { f.rows[0].capture.tiles[0].filename = 'E006-Q3-mobile-tile-01.png'; }, /TILE_BINDING/]
]) test(`v2 artifact inventory refuses ${name}`, () => {
  const f = tileInventory(); mutate(f); assert.throws(() => checker.assertScreenshotInventory(f.rows, f.artifacts), error);
});

test('artifact bytes are freshly hashed and a symlink cannot supply an original PNG', t => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'problem-ui-tiles-'));
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));
  const file = path.join(folder, 'E005-Q12-mobile-tile-01.png');
  fs.writeFileSync(file, 'synthetic-original');
  const before = checker.readScreenshotArtifacts(folder);
  fs.writeFileSync(file, 'synthetic-changed');
  assert.notEqual(checker.readScreenshotArtifacts(folder)[0].sha256, before[0].sha256);
  fs.symlinkSync(file, path.join(folder, 'E005-Q12-mobile-tile-02.png'));
  assert.throws(() => checker.readScreenshotArtifacts(folder), /UI_SCREENSHOT_REGULAR_FILE/);
});

function fixture() {
  const manifest = copy(sourceManifest), files = new Map(), banks = new Map(), identities = [];
  for (const item of manifest.items) {
    if (!banks.has(item.sourcePath)) banks.set(item.sourcePath, []);
    const questions = banks.get(item.sourcePath);
    while (questions.length < item.sourceOrdinal) questions.push({ id: questions.length + 1, content: 'unselected' });
    const question = { id: item.sourceOrdinal, content: `Synthetic problem ${item.key}`, choices: ['Synthetic choice'],
      image: item.assetPath.slice('archive/'.length), imageAlt: 'Synthetic geometry', imageSize: 'full', layoutTag: 'fullwidth',
      answer: 'DO_NOT_EXPORT_ANSWER', solution: 'DO_NOT_EXPORT_SOLUTION' };
    questions[item.sourceOrdinal - 1] = question;
    item.problemPayloadSha256 = checker.sha256(checker.stable({ content: question.content, choices: question.choices }));
    item.presentationSha256 = checker.sha256(checker.stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag }));
    if (item.key === 'E006-Q3') {
      // Keep the pinned real v3 asset as a fixture; it contains only the problem
      // drawing. The other synthetic assets exercise byte binding independently.
      const svg = fs.readFileSync(path.join(__dirname, '..', item.assetPath));
      files.set(item.assetPath, svg);
    } else {
      const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><title>${item.key}</title></svg>`);
      files.set(item.assetPath, svg); item.assetSha256 = checker.sha256(svg);
    }
    identities.push({ sourceArchiveFile: item.sourcePath.slice('archive/exams/'.length), sourceOrdinal: item.sourceOrdinal, questionUid: item.questionUid });
  }
  const syncBanks = () => { for (const [file, questions] of banks) files.set(file, Buffer.from(`window.questionBank = ${JSON.stringify(questions)};`)); };
  const syncIdentity = () => files.set(checker.IDENTITY_PATH, Buffer.from(JSON.stringify({ records: identities })));
  syncBanks(); syncIdentity();
  const reader = { commit: head, read(file) { assert(files.has(file), 'UI_TRACKED_FILE_REQUIRED'); return files.get(file); },
    ref(file, bytes = this.read(file)) { return { commit: head, path: file, gitBlobSha1: checker.gitBlob(bytes), sha256: checker.sha256(bytes), bytes: bytes.length }; } };
  return { manifest, files, banks, identities, syncBanks, syncIdentity, reader };
}

test('UI3 manifest fixes three problems, both viewports and the reviewed v3 bytes', () => {
  assert.equal(checker.validateManifest(copy(sourceManifest)).expectedCases, 6);
});

for (const [name, mutate] of [
  ['missing one item', x => x.items.pop()],
  ['duplicate UID', x => { x.items[1].questionUid = x.items[0].questionUid; }],
  ['path traversal', x => { x.items[0].sourcePath = 'archive/exams/../secrets.js'; }],
  ['unknown raw body field', x => { x.items[0].content = 'not permitted'; }],
  ['missing mobile case', x => x.viewports.pop()],
  ['old v2 target', x => { x.items.find(row => row.key === 'E006-Q3').assetPath = 'archive/assets/images/q3-problem-visual-v2.svg'; }],
  ['different v3 bytes', x => { x.items.find(row => row.key === 'E006-Q3').assetSha256 = 'b'.repeat(64); }]
]) test(`UI3 manifest refuses ${name}`, () => { const x = copy(sourceManifest); mutate(x); assert.throws(() => checker.validateManifest(x)); });

test('every exact source, asset and checker trigger requires six cases', () => {
  const plan = checker.planRequired(sourceManifest, scope([]), head);
  assert.equal(plan.required, false);
  for (const file of plan.triggerPaths) assert.equal(checker.planRequired(sourceManifest, scope([file]), head).required, true, file);
  const fontChange = checker.planRequired(sourceManifest, scope([studentFonts[0]]), head);
  assert.equal(fontChange.required, true);
  assert.deepEqual(fontChange.matchedPaths, [studentFonts[0]]);
  assert.equal(checker.planRequired(sourceManifest, scope(['archive/exams/unrelated.js']), head).required, false);
});

test('unknown diff and explicit dispatch require the browser and stale HEAD is rejected', () => {
  assert.equal(checker.planRequired(sourceManifest, scope(null), head).required, true);
  assert.equal(checker.planRequired(sourceManifest, { ...scope([]), eventName: 'workflow_dispatch' }, head).required, true);
  assert.throws(() => checker.planRequired(sourceManifest, scope([]), 'b'.repeat(40)), /UI_SCOPE_HEAD/);
  assert.throws(() => checker.planRequired(sourceManifest, scope(undefined), head), /UI_CHANGED_FILES/);
});

test('source preflight yields only exact Git/hash bindings and never answer or solution values', () => {
  const f = fixture(), result = checker.preflight(f.reader, f.manifest);
  assert.equal(result.items.length, 3);
  assert(!JSON.stringify(result).includes('DO_NOT_EXPORT'));
  assert(!JSON.stringify(result).includes('Synthetic problem'));
  assert(result.items.every(row => row.sourceRef.commit === head && row.assetRef.commit === head));
});

for (const [name, mutate, error] of [
  ['missing repaired SVG', f => f.files.delete(f.manifest.items.find(row => row.key === 'E006-Q3').assetPath), /UI_TRACKED_FILE_REQUIRED/],
  ['stale v2 pointer', f => { const x = f.manifest.items.find(row => row.key === 'E006-Q3'); f.banks.get(x.sourcePath)[2].image = x.assetPath.slice('archive/'.length).replace('-v3.svg', '-v2.svg'); f.syncBanks(); }, /UI_IMAGE_POINTER_MISMATCH/],
  ['changed problem text', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].content += ' changed'; f.syncBanks(); }, /UI_PROBLEM_PAYLOAD_DRIFT/],
  ['changed choice', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].choices.push('changed'); f.syncBanks(); }, /UI_PROBLEM_PAYLOAD_DRIFT/],
  ['changed presentation', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].imageSize = 'small'; f.syncBanks(); }, /UI_PRESENTATION_DRIFT/],
  ['wrong UID', f => { f.identities[0].questionUid = 'qid_v1_' + 'f'.repeat(64); f.syncIdentity(); }, /UI_IDENTITY_UID_MISMATCH/],
  ['duplicate identity', f => { f.identities.push(copy(f.identities[0])); f.syncIdentity(); }, /UI_UNIQUE_IDENTITY_RECORD/],
  ['wrong source ordinal', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].id++; f.syncBanks(); }, /UI_QUESTION_ORDINAL_MISMATCH/]
]) test(`preflight rejects ${name}`, () => { const f = fixture(); mutate(f); assert.throws(() => checker.preflight(f.reader, f.manifest), error); });

test('preflight accepts a redrawn figure at the same path and reports the actual bytes', () => {
  // 2026-11-24: 그림 바이트는 승인 당시 값에 고정하지 않는다. 발문·보기·그림 포인터가 같으면 통과하고 실제 해시가 assetRef에 남는다.
  const f = fixture(), p = f.manifest.items[0].assetPath, changed = Buffer.concat([f.files.get(p), Buffer.from('changed')]);
  f.files.set(p, changed);
  const result = checker.preflight(f.reader, f.manifest);
  assert.equal(result.items[0].assetRef.sha256, checker.sha256(changed));
  assert.notEqual(result.items[0].assetRef.sha256, f.manifest.items[0].assetSha256);
});

test('Git reader rejects local drift, untracked bytes, symlinks and event mismatch', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'problem-ui-git-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'UI Test', GIT_AUTHOR_EMAIL: 'ui@example.test', GIT_COMMITTER_NAME: 'UI Test', GIT_COMMITTER_EMAIL: 'ui@example.test' } }).trim();
  git('init', '-q'); fs.writeFileSync(path.join(root, 'a.txt'), 'same'); fs.symlinkSync('a.txt', path.join(root, 'link.txt'));
  git('add', '.'); git('commit', '-qm', 'fixture');
  const commit = git('rev-parse', 'HEAD'), reader = checker.createGitReader(root, commit);
  assert.equal(reader.read('a.txt').toString(), 'same');
  assert.throws(() => checker.createGitReader(root, 'b'.repeat(40)), /UI_EVENT_HEAD_MISMATCH/);
  assert.throws(() => reader.read('link.txt'), /UI_TRACKED_FILE_REQUIRED/);
  fs.writeFileSync(path.join(root, 'new.txt'), 'same'); assert.throws(() => reader.read('new.txt'), /UI_TRACKED_FILE_REQUIRED/);
  fs.writeFileSync(path.join(root, 'a.txt'), 'changed'); assert.throws(() => reader.read('a.txt'), /UI_CHECKOUT_BYTES_DRIFT/);
});

test('workflow requires the six-case check without modifying the existing solution browser gate', () => {
  // The runtime contract, six-case reviewed problem UI and 50-question solution checks run as steps of one job
  // (one checkout, one runner wait). Each keeps its step name, its scope condition and its own limits.
  const workflow = fs.readFileSync(path.join(__dirname, '..', checker.WORKFLOW_PATH), 'utf8');
  assert.match(workflow, /\n  runtime-guard:\n    name: Archive2 runtime guard\n/);
  assert(!workflow.includes('reviewed-problem-renderers:'), 'the six-case check is a step of the single runtime-guard job');
  const job = workflow.slice(workflow.indexOf('  runtime-guard:'));
  assert.match(job, /\n    timeout-minutes: 25\n/);
  assert.match(job, /ref: \$\{\{ github.sha \}\}\n\s+fetch-depth: 0/);
  assert.match(job, /name: Verify the closed problem UI evidence contract\n\s+id: ui_contract\n\s+if: \$\{\{ !cancelled\(\) && steps\.scope\.outcome == 'success' \}\}\n\s+run: node --test tests\/archive-problem-renderer-ui-contract.test.js/);
  assert.match(job, /name: Require all six views for exact source, asset or checker changes\n\s+id: plan\n/);
  assert.match(job, /playwright@1\.62\.1/);
  const six = /- name: Verify all three reviewed problems in desktop and mobile exam mode\n([\s\S]*?)\n      # ---/.exec(job)?.[1] || '';
  assert.match(six, /if: \$\{\{ !cancelled\(\) && steps\.plan\.outputs\.required == 'true' \}\}/);
  assert.match(six, /timeout-minutes: 5/);
  assert.match(six, /CHROME_BIN: \$\{\{ steps.chrome.outputs.chrome-path \}\}/);
  assert.match(six, /node tools\/check-reviewed-problem-renderer-browser.cjs --output/);
  assert(!workflow.includes('continue-on-error'));
  assert.match(job, /technical-proof.json/);
  assert.match(job, /\*-desktop-tile-\*.png/);
  assert.match(job, /\*-mobile-tile-\*.png/);
  assert(!job.includes('/*-desktop.png') && !job.includes('/*-mobile.png'), 'v2 uploads original tiles without a single-shot alias');
  assert.match(job, /name: Compare 50 real solutions and verify asset failures in actual Chrome\n\s+id: solution_50\n\s+if: \$\{\{ !cancelled\(\) && steps\.scope\.outputs\.solution_browser == 'true' \}\}\n\s+timeout-minutes: 8/);
});
