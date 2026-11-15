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
const studentCss = [400, 700, 800].map(weight => `@font-face { font-family: 'Nanum Myeongjo'; font-style: normal; font-weight: ${weight}; src: url(https://fonts.gstatic.com/s/nanummyeongjo/v1/reviewed_${weight}.woff2) format('woff2'); }`).join('\n');

test('the real engine imports its student font before qualified CSS rules', () => {
  const engine = fs.readFileSync(path.join(__dirname, '..', 'archive/engine.html'), 'utf8');
  const fontStyles = [...engine.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map(match => match[1]).filter(css => css.includes('fonts.googleapis.com/css2'));
  assert.equal(fontStyles.length, 1, 'UI_ENGINE_UNIQUE_FONT_STYLESHEET');
  const css = fontStyles[0].replace(/\/\*[\s\S]*?\*\//g, '').trimStart();
  const firstRule = css.match(/^@import\s+url\((['"])([^'"]+)\1\)\s*;/);
  assert(firstRule, 'UI_ENGINE_FONT_IMPORT_MUST_PRECEDE_QUALIFIED_RULES');
  assert.equal(checker.isStudentFontStylesheet(firstRule[2]), true);
});

test('only the exact student stylesheet query is allowed', () => {
  assert.equal(checker.isStudentFontStylesheet('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap'), true);
  assert.equal(checker.isStudentFontStylesheet('https://fonts.googleapis.com/css2?display=swap&family=Nanum%20Myeongjo%3Awght%40400%3B700%3B800'), true);
});
for (const value of [
  'http://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap',
  'https://fonts.googleapis.com.evil.test/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Other:wght@400;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap&extra=1'
]) test(`font stylesheet refuses non-exact URL ${value.split('?')[0]}`, () => assert.equal(checker.isStudentFontStylesheet(value), false));

test('font files are restricted to the returned stylesheet declarations and all three weights', () => {
  assert.deepEqual([...checker.declaredStudentFonts(studentCss)], [400, 700, 800].map(weight => `https://fonts.gstatic.com/s/nanummyeongjo/v1/reviewed_${weight}.woff2`));
});
test('declared Korean font subsets accept the observed canonical numeric suffix range', () => {
  for (const suffix of [0, 9, 10, 65, 94, 99, 100, 119]) {
    const css = studentCss.replaceAll('.woff2', `.${suffix}.woff2`);
    assert.deepEqual([...checker.declaredStudentFonts(css)], [400, 700, 800].map(weight =>
      `https://fonts.gstatic.com/s/nanummyeongjo/v1/reviewed_${weight}.${suffix}.woff2`));
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
  ['another family directory', studentCss.replace('/s/nanummyeongjo/', '/s/other/')],
  ['another origin', studentCss.replace('fonts.gstatic.com', 'example.test')],
  ['missing required weight', studentCss.replace('font-weight: 800;', 'font-weight: 900;')],
  ['malformed escaped URL', studentCss.replace('https://fonts.gstatic.com', 'https://fonts.gstatic.com\\escape')]
]) test(`font CSS refuses ${name}`, () => assert.throws(() => checker.declaredStudentFonts(css)));

test('font failure diagnostics distinguish parsed CSS refusal from request failure without raw response content', () => {
  const observation = { kind: 'STYLESHEET', urlSha256: 'a'.repeat(64), stage: 'CSS_DECLARATIONS', httpStatus: 200,
    responseUrlSha256: 'a'.repeat(64), mime: 'text/css', bytes: 173575, responseSha256: 'b'.repeat(64), rawBody: 'DO_NOT_EXPORT_BODY' };
  let parserError;
  try { checker.declaredStudentFonts(studentCss.replace('/s/nanummyeongjo/', '/s/other/')); } catch (error) { parserError = error; }
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
  ['same path asset mutation', f => { const p = f.manifest.items[0].assetPath; f.files.set(p, Buffer.concat([f.files.get(p), Buffer.from('changed')])); }, /UI_REVIEWED_ASSET_DRIFT/],
  ['wrong UID', f => { f.identities[0].questionUid = 'qid_v1_' + 'f'.repeat(64); f.syncIdentity(); }, /UI_IDENTITY_UID_MISMATCH/],
  ['duplicate identity', f => { f.identities.push(copy(f.identities[0])); f.syncIdentity(); }, /UI_UNIQUE_IDENTITY_RECORD/],
  ['wrong source ordinal', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].id++; f.syncBanks(); }, /UI_QUESTION_ORDINAL_MISMATCH/]
]) test(`preflight rejects ${name}`, () => { const f = fixture(); mutate(f); assert.throws(() => checker.preflight(f.reader, f.manifest), error); });

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

test('workflow requires the six-case job without modifying the existing solution browser gate', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '..', checker.WORKFLOW_PATH), 'utf8');
  assert.match(workflow, /reviewed-problem-renderers:\s*\n\s*name: Archive2 reviewed problem UI \(6 cases\)/);
  const job = workflow.slice(workflow.indexOf('  reviewed-problem-renderers:'));
  assert.match(job, /timeout-minutes: 8/);
  assert.match(job, /ref: \$\{\{ github.sha \}\}/);
  assert.match(job, /node --test tests\/archive-problem-renderer-ui-contract.test.js/);
  assert.match(job, /playwright@1\.62\.1/);
  assert.match(job, /CHROME_BIN: \$\{\{ steps.chrome.outputs.chrome-path \}\}/);
  assert.match(job, /if: steps.plan.outputs.required == 'true'/);
  assert(!job.includes('continue-on-error'));
  assert.match(job, /technical-proof.json/);
  assert.match(job, /\*-desktop-tile-\*.png/);
  assert.match(job, /\*-mobile-tile-\*.png/);
  assert(!job.includes('/*-desktop.png') && !job.includes('/*-mobile.png'), 'v2 uploads original tiles without a single-shot alias');
  assert.match(workflow, /name: Archive2 50-question solution Chrome[\s\S]*?timeout-minutes: 12/);
});
