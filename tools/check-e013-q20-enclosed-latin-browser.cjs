'use strict';

// Exact E013 Q20 problem-only glyph evidence. This tool cannot register a vector,
// approve metadata or grant mathematical, difficulty or REVIEW2 status.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const { stable, sha256, gitBlob, createGitReader, FONT_DIR, FONT_STYLESHEET, studentFontResourcePath, checkedStudentFontRefs,
  createStudentRouteLifecycle, serveStudentFont, closeStudentContext, readScreenshotArtifacts, assertScreenshotInventory } = H;
const MANIFEST_PATH = 'tests/fixtures/archive-e013-q20-enclosed-latin-ui.json';
const CHECKER_PATH = 'tools/check-e013-q20-enclosed-latin-browser.cjs';
const SHARED_CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
// The approved UI3 capture is immutable. The current checkout supplies font
// transport and route cleanup under its own exact byte pin.
const SHARED_CHECKER_COMMIT = '1b91646c1b4d8aef41a6bba11470f75ac533445a';
const SHARED_CHECKER_GIT_BLOB = 'dcb4382ada6913f9aa35a820777248ee93879e36';
const SHARED_CHECKER_SHA256 = '94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4';
const LIVE_CHECKER_SHA256 = 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-e013-q20-enclosed-latin-ui-preview-v1';
const FONT_FAMILY = 'Nanum Myeongjo';
const SHA1 = /^[a-f0-9]{40}$/;
const EXPECTED_ITEM = Object.freeze({
  "key": "E013-Q20",
  "questionUid": "qid_v1_56df750b001e9bd82eee54570a1d61a919417f58ac313a35842b6171177d5f75",
  "sourceOrdinal": 20,
  "sourcePath": "archive/exams/original/middle/m2/1mid/25_삼산중_1학기_중간_중2_수학.js",
  "sourceGitBlobSha1": "fe6b625aa8c36a994e7fe026c6c9d6eab827e889",
  "sourceSha256": "4ccae3e25d173235d090952676063728b2fe100e4bd096632a4a48273f72bdfa",
  "expectedBankCount": 24,
  "problemPayloadSha256": "5fec5db588091a4688982f098bdc36f69d6f7e4cda3057d47327d1b603f0d2f5",
  "presentationSha256": "2210d02be8eef691c86d83d8ef5bbe9997aded6f91d62a8ba9f5eaacd9ddda6a",
  "assetPath": "archive/assets/images/25_삼산중_1학기_중간_중2_수학/q20-problem-visual-v2.svg",
  "assetGitBlobSha1": "9201779b28e6fc6b7e2945c16691b729bf91c077",
  "assetSha256": "7bf03e923426b547a4339e217037fb9a6362830e015be7e34d85fa406bff4761",
  "choiceGlyphs": [
    [
      9424,
      9426
    ],
    [
      9425,
      9427
    ],
    [
      9426,
      9429
    ],
    [
      9427,
      9428
    ],
    [
      9428,
      9429
    ]
  ]
});
const EXPECTED_FONT = Object.freeze({
  "path": "archive/vendor/ap-enclosed-latin/APEnclosedLatin-Regular.woff2",
  "gitBlobSha1": "48f9ef1a2f2f544ce1614fadebccc4335fb2de95",
  "sha256": "79403a2023f44e801e2dbe9b50f2263500aad6750677b6ef2996ea3251a5ce95",
  "bytes": 5100
});
const VIEWPORTS = Object.freeze([{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]);
function ownKeys(value, keys, code) {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), keys.slice().sort(), code);
}
function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'expectedCases', 'viewports', 'font', 'items'], 'UI_E013_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-e013-q20-enclosed-latin-ui-manifest-v1', 'UI_E013_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'EXACT_E013_Q20_PROBLEM_DISPLAY_ONLY_NO_APPROVAL', 'UI_E013_MANIFEST_SCOPE');
  assert.equal(manifest.expectedCases, 2, 'UI_E013_CASE_COUNT');
  assert.deepEqual(manifest.font, EXPECTED_FONT, 'UI_E013_EXACT_FONT');
  assert.deepEqual(manifest.viewports, VIEWPORTS, 'UI_E013_EXACT_VIEWPORTS');
  assert(Array.isArray(manifest.items) && manifest.items.length === 1, 'UI_E013_EXACT_ONE_ITEM');
  ownKeys(manifest.items[0], Object.keys(EXPECTED_ITEM), 'UI_E013_ITEM_KEYS');
  assert.deepEqual(manifest.items[0], EXPECTED_ITEM, 'UI_E013_EXACT_TARGET_BINDING');
  return manifest;
}
function checkoutEvidence(actualCommit, env = process.env) {
  const expectedCommit = env.ARCHIVE_E013_Q20_UI_EXPECTED_SHA;
  assert(typeof expectedCommit === 'string' && SHA1.test(expectedCommit), 'UI_E013_EXPECTED_CHECKOUT_REQUIRED');
  assert.equal(actualCommit, expectedCommit, 'UI_E013_CHECKOUT_MISMATCH');
  assert(env.GITHUB_SHA === undefined || (typeof env.GITHUB_SHA === 'string' && SHA1.test(env.GITHUB_SHA)), 'UI_E013_EVENT_SHA');
  return { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: actualCommit, githubEventCommit: env.GITHUB_SHA ?? null };
}
function loadQuestions(bytes) {
  const sandbox = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), sandbox, { timeout: 1500, filename: 'e013-q20-source.js', contextCodeGeneration: { strings: false, wasm: false } });
  const bank = sandbox.window.questionBank ?? sandbox.questionBank ?? sandbox.window.examData?.questions ?? sandbox.examData?.questions;
  assert(Array.isArray(bank), 'UI_E013_BANK_REQUIRED');
  return bank;
}
function preflight(reader, manifest) {
  validateManifest(manifest);
  const item = manifest.items[0], source = reader.read(item.sourcePath), asset = reader.read(item.assetPath);
  assert.equal(gitBlob(source), item.sourceGitBlobSha1, 'UI_E013_SOURCE_GIT_DRIFT');
  assert.equal(sha256(source), item.sourceSha256, 'UI_E013_SOURCE_RAW_DRIFT');
  assert.equal(gitBlob(asset), item.assetGitBlobSha1, 'UI_E013_ASSET_GIT_DRIFT');
  assert.equal(sha256(asset), item.assetSha256, 'UI_E013_ASSET_RAW_DRIFT');
  const fontBytes = reader.read(EXPECTED_FONT.path);
  assert.equal(gitBlob(fontBytes), EXPECTED_FONT.gitBlobSha1, 'UI_E013_FONT_GIT_DRIFT');
  assert.equal(sha256(fontBytes), EXPECTED_FONT.sha256, 'UI_E013_FONT_RAW_DRIFT');
  assert.equal(fontBytes.length, EXPECTED_FONT.bytes, 'UI_E013_FONT_BYTES_DRIFT');
  const questions = loadQuestions(source);
  assert.equal(questions.length, item.expectedBankCount, 'UI_E013_BANK_COUNT');
  const question = questions[item.sourceOrdinal - 1];
  assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_E013_ORDINAL');
  assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_E013_PROBLEM_PAYLOAD_DRIFT');
  assert.equal(Object.hasOwn(question, 'image'), false, 'UI_E013_INLINE_IMAGE_ONLY');
  assert.equal(typeof question.content, 'string', 'UI_E013_CONTENT_REQUIRED');
  assert.deepEqual(Array.from(question.content.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi), match=>match[1]),
    [item.assetPath.slice('archive/'.length)], 'UI_E013_EXACT_INLINE_IMAGE_POINTER');
  assert.equal(sha256(stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag })), item.presentationSha256, 'UI_E013_PRESENTATION_DRIFT');
  assert.deepEqual(JSON.parse(JSON.stringify(question.choices.map(text => Array.from(String(text), c => c.codePointAt(0)).filter(c => c >= 0x24B6 && c <= 0x24E9)))), item.choiceGlyphs, 'UI_E013_SOURCE_GLYPHS');
  const identityBytes = reader.read(IDENTITY_PATH), identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_E013_IDENTITY_RECORDS');
  const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
  assert.equal(matched.length, 1, 'UI_E013_UNIQUE_IDENTITY');
  assert.equal(matched[0].questionUid, item.questionUid, 'UI_E013_IDENTITY_UID');
  return { fontRef: reader.ref(EXPECTED_FONT.path, fontBytes), expectedBankCount: questions.length, identityRef: reader.ref(IDENTITY_PATH, identityBytes), items: [{
    key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    problemPayloadSha256: item.problemPayloadSha256, presentationSha256: item.presentationSha256,
    sourceRef: reader.ref(item.sourcePath, source), assetRef: reader.ref(item.assetPath, asset) }] };
}
// Browser evaluation is observation-only: no font load, typeset, DOM or CSS write.
function readChoiceGlyphs(image) {
  const box = image.closest('.q-box');
  if (AppState.mode !== 'exam' || document.querySelector('#print-area .sol-ans,#print-area .sol-exp')) throw new Error('UI_E013_GLYPH_SURFACE');
  if (box.querySelector('.q-num')?.textContent?.trim() !== '20.') throw new Error('UI_E013_GLYPH_ORDINAL');
  const output = window.MathJax?.startup?.document?.outputJax;
  const cache = output?.unknownCache?.get('normal');
  const choices = [...box.querySelectorAll('.choice-text')].map(choice => {
    const glyphs = [...choice.querySelectorAll('mjx-utext > .ap-enclosed-latin')].map(node => {
      const run = node.parentElement, runStyle = getComputedStyle(run);
      const style = getComputedStyle(node), rect = node.getBoundingClientRect();
      return { codePoints: [...node.textContent].map(c => c.codePointAt(0)), variant: run.getAttribute('variant'),
        fontFamily: style.fontFamily, width: rect.width, height: rect.height,
        display: runStyle.display === 'none' ? 'none' : style.display,
        visibility: runStyle.visibility === 'visible' ? style.visibility : runStyle.visibility,
        opacity: Number(style.opacity) * Number(runStyle.opacity) };
    });
    return { glyphs };
  });
  const used = [...new Set(choices.flatMap(choice => choice.glyphs.flatMap(glyph => glyph.codePoints)))].sort((a,b)=>a-b);
  return { schemaVersion: 'archive-enclosed-latin-glyph-observation-v1', sourceOrdinal: 20, mode: 'exam',
    unknownFamily: output?.font?.options?.unknownFamily ?? null, normalCssFont: output?.font?.getCssFont('normal') ?? null,
    loadedFaces: [...document.fonts].filter(face => face.family.replace(/["']/g, '') === 'AP Enclosed Latin').map(face => ({ family:face.family, status:face.status })),
    fontChecked: document.fonts.check('16px "AP Enclosed Latin"', String.fromCodePoint(...used)),
    measuredWidths: used.map(codePoint => ({ codePoint, width: cache?.get(String.fromCodePoint(codePoint))?.w ?? null })),
    choices, domWrites: 0, cssWrites: 0, sourceWrites: 0, fontLoadsByChecker: 0, typesetsByChecker: 0 };
}
function assertChoiceGlyphs(observed) {
  assert(observed && observed.schemaVersion === 'archive-enclosed-latin-glyph-observation-v1', 'UI_E013_GLYPH_SCHEMA');
  assert.equal(observed.mode, 'exam', 'UI_E013_GLYPH_SURFACE');
  assert.equal(observed.sourceOrdinal, 20, 'UI_E013_GLYPH_ORDINAL');
  assert.equal(observed.unknownFamily, 'serif', 'UI_E013_UNKNOWN_FAMILY');
  assert.deepEqual(observed.normalCssFont, ['serif', false, false], 'UI_E013_NORMAL_VARIANT_FONT');
  assert(Array.isArray(observed.loadedFaces) && observed.loadedFaces.length === 1 &&
    observed.loadedFaces[0].family.replace(/["']/g, '') === 'AP Enclosed Latin' && observed.loadedFaces[0].status === 'loaded' &&
    observed.fontChecked === true, 'UI_E013_GLYPH_FONT_READY');
  assert.equal(observed.choices.length, 5, 'UI_E013_FIVE_CHOICES');
  const actual = observed.choices.map(choice => choice.glyphs.flatMap(glyph => glyph.codePoints));
  assert.deepEqual(actual, EXPECTED_ITEM.choiceGlyphs, 'UI_E013_EXACT_CHOICE_GLYPHS');
  for (const choice of observed.choices) for (const glyph of choice.glyphs) {
    assert.equal(glyph.variant, 'normal', 'UI_E013_GLYPH_VARIANT');
    assert.deepEqual(glyph.fontFamily.replace(/["']/g, '').split(',').map(s=>s.trim()), ['MJX-TEX-ZERO','AP Enclosed Latin','serif'], 'UI_E013_GLYPH_FONT_FAMILY');
    assert(Number.isFinite(glyph.width) && glyph.width > 0 && Number.isFinite(glyph.height) && glyph.height > 0 &&
      glyph.display !== 'none' && glyph.visibility === 'visible' && glyph.opacity > 0, 'UI_E013_GLYPH_NOT_VISIBLE');
  }
  const expectedPoints = [...new Set(EXPECTED_ITEM.choiceGlyphs.flat())].sort((a,b)=>a-b);
  assert.deepEqual(observed.measuredWidths.map(row=>row.codePoint), expectedPoints, 'UI_E013_GLYPH_MEASUREMENT_INVENTORY');
  assert(observed.measuredWidths.every(row=>Number.isFinite(row.width) && row.width>0), 'UI_E013_GLYPH_ZERO_MEASUREMENT_CACHE');
  for(const key of ['domWrites','cssWrites','sourceWrites','fontLoadsByChecker','typesetsByChecker']) assert.equal(observed[key],0,'UI_E013_OBSERVATION_ONLY');
}
function assertTechnicalState(technical) {
  assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
  assert.equal(technical.questions, EXPECTED_ITEM.expectedBankCount, 'UI_E013_RENDERED_BANK_COUNT');
  assert.equal(technical.readiness, 'RENDER_READY', 'UI_E013_RENDER_READY');
  assert(technical.pages > 0 && technical.imagesComplete === true, 'UI_RENDERED_IMAGES');
  assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
  assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
  assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
  assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
}
function assertCompletedResults(results, inputs, manifest, artifacts) {
  validateManifest(manifest);
  assert.equal(results.length, 2, 'UI_E013_TWO_LOGICAL_CASES');
  assert.deepEqual(results.map(row => row.viewport), VIEWPORTS, 'UI_E013_TWO_EXACT_VIEWPORTS');
  const item = inputs.items[0];
  for (const row of results) {
    assert(row.status === 'PASS' && row.visualReview === 'PENDING' && row.key === item.key &&
      row.questionUid === item.questionUid && row.sourceOrdinal === EXPECTED_ITEM.sourceOrdinal, 'UI_E013_RESULT_TARGET');
    assert.deepEqual(row.sourceRef, item.sourceRef, 'UI_E013_RESULT_SOURCE');
    assert.deepEqual(row.assetRef, item.assetRef, 'UI_E013_RESULT_ASSET');
    assertTechnicalState(row.technical);
    assertChoiceGlyphs(row.choiceGlyphs);
    assert.deepEqual(row.fontRef, inputs.fontRef, 'UI_E013_RESULT_FONT');
    const capture = row.capture;
    assert(capture.schemaVersion === H.TILE_SCHEMA && capture.method === 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' &&
      capture.overlapCssPixels === 32 && capture.tileLimit === 8 && capture.cssWrites === 0 && capture.domWrites === 0 &&
      capture.viewportChanges === 0 && capture.compositeImageCreated === false && capture.feedbackIdle === true && capture.foreignContentHits === 0,
      'UI_E013_UNCHANGED_CAPTURE_REQUIRED');
    assert.deepEqual(capture.coverage, H.assertTileCoverage(capture.content.height, capture.tiles), 'UI_E013_COMPLETE_COVERAGE');
  }
  return assertScreenshotInventory(results, artifacts);
}
function checkedOutput(root, out) {
  root = path.resolve(root); out = path.resolve(out);
  assert(out !== root && !out.startsWith(root + path.sep), 'UI_E013_OUTPUT_OUTSIDE_CHECKOUT');
  for (let current = out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'UI_E013_OUTPUT_SYMLINK');
  assert(!fs.existsSync(out) || fs.readdirSync(out).length === 0, 'UI_E013_EMPTY_OUTPUT_REQUIRED');
  return out;
}

const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

function readFrozenCaptureSource(root) {
  const bytes = execFileSync('git', ['-C', root, 'show', SHARED_CHECKER_COMMIT + ':' + SHARED_CHECKER_PATH],
    { timeout: 30000, maxBuffer: 128 * 1024 });
  const ref = { commit: SHARED_CHECKER_COMMIT, path: SHARED_CHECKER_PATH, gitBlobSha1: gitBlob(bytes), sha256: sha256(bytes), bytes: bytes.length };
  assert.equal(ref.gitBlobSha1, SHARED_CHECKER_GIT_BLOB, 'UI_E013_CAPTURE_HELPER_GIT_CHANGED');
  assert.equal(ref.sha256, SHARED_CHECKER_SHA256, 'UI_E013_CAPTURE_HELPER_CHANGED');
  return { ref, bytes };
}

function loadFrozenCaptureHelper(root) {
  const { ref, bytes } = readFrozenCaptureSource(root);
  const approvedModule = { exports: {} };
  vm.compileFunction(bytes.toString('utf8'), ['require', 'module', 'exports'],
    { filename: ref.commit + ':' + ref.path })(require, approvedModule, approvedModule.exports);
  return { ref, helper: approvedModule.exports };
}

async function inspectStudentUi({ root, out, expectedCommit, executablePath, githubEventCommit = null }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  assert(SHA1.test(expectedCommit), 'UI_E013_EXPECTED_CHECKOUT_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const liveHelperRef = reader.ref(SHARED_CHECKER_PATH);
  assert.equal(liveHelperRef.sha256, LIVE_CHECKER_SHA256, 'UI_E013_LIVE_HELPER_CHANGED');
  const { ref: captureHelperRef, helper: { captureProblemTiles } } = loadFrozenCaptureHelper(root);
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [], glyphObservations = [];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef, liveHelperRef, ...inputs,
    checkout: { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: reader.commit, githubEventCommit },
    parentRestorationApproval: false, releaseGate: 'PENDING_INDEPENDENT_VISUAL_REVIEW',
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_STUDENT_NANUM_FILES_AND_TRACKED_ENCLOSED_LATIN_WOFF2', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertCompletedResults(results, inputs, manifest, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, glyphObservations, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
      studentFontResources: [...studentFontResources.values()], externalFontResources: [], failures };
    fs.writeFileSync(path.join(out, 'technical-proof.json'), JSON.stringify(proof, null, 2) + '\n');
    return proof;
  };
  let browser;
  const server = http.createServer((request, response) => {
    try {
      const rel = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\//, '');
      if (rel === 'favicon.ico') { response.writeHead(204); response.end(); return; }
      // The engine also loads its tracked ../apmath navigation resources.
      // read() requires an exact regular file in this immutable checkout tree;
      // it cannot expose an untracked file, symlink, traversal or Git internals.
      const bytes = reader.read(rel);
      served.set(rel, reader.ref(rel, bytes));
      response.writeHead(200, { 'Content-Type': mime(rel), 'Cache-Control': 'no-store' });
      response.end(bytes);
    } catch {
      failures.push({ code: 'UI_STATIC_FILE_UNAVAILABLE', requestSha256: sha256(request.url || '') });
      response.writeHead(404); response.end();
    }
  });
  const watchdog = setTimeout(() => { writeProof('FAIL', 'UI_TOTAL_TIMEOUT'); process.exit(1); }, 240000);
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const { chromium } = require('playwright');
    browser = await chromium.launch({ executablePath, headless: true, timeout: 30000 });
    proofBase.browserVersion = browser.version();
    const banks = [...new Set(manifest.items.map(item => item.sourcePath))];
    for (const viewport of manifest.viewports) for (const sourcePath of banks) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1,
        isMobile: viewport.name === 'mobile', hasTouch: viewport.name === 'mobile', serviceWorkers: 'block' });
      let page, casesCompleted = false, caseFailure = null;
      const pageErrors = [], requestFailures = [], externalRequests = [];
      const fontState = { declaredFonts: new Set(), fontRefs, fontWeights, studentFontResources, fontResources: new Map(), failures };
      const routeLifecycle = createStudentRouteLifecycle(failures);
      try {
        page = await context.newPage();
        page.setDefaultTimeout(10000);
        page.on('pageerror', error => pageErrors.push({ messageSha256: sha256(error.message) }));
        page.on('requestfailed', request => requestFailures.push({ urlSha256: sha256(request.url()), errorSha256: sha256(request.failure()?.errorText || '') }));
        await page.route('**/*', routeLifecycle.wrap(async route => {
          const url = new URL(route.request().url());
          const fontPath = studentFontResourcePath(url.href, origin, fontRefs);
          if (fontPath) return serveStudentFont(route, url, fontPath, fontState);
          if (url.origin === origin) {
            if (url.pathname.startsWith('/' + FONT_DIR)) {
              failures.push({ code: 'UI_FONT_NOT_DECLARED', requestSha256: sha256(url.href) });
              return route.abort('blockedbyclient');
            }
            return route.continue();
          }
          if (url.protocol === 'https:' && url.hostname === 'img.wangjiedu.com' && url.pathname.startsWith('/exams/images/')) {
            try {
              const rel = 'archive/assets/images/' + decodeURIComponent(url.pathname.slice('/exams/images/'.length));
              const bytes = reader.read(rel);
              mirrored.set(rel, reader.ref(rel, bytes));
              return route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' }, contentType: mime(rel), body: bytes });
            } catch { failures.push({ code: 'UI_MIRRORED_ASSET_UNAVAILABLE', requestSha256: sha256(route.request().url()) }); }
          }
          externalRequests.push({ host: url.hostname, urlSha256: sha256(url.href) });
          return route.abort('blockedbyclient');
        }));
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=exam&fit=screen&studentReview=1`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForFunction(() => {
          const readiness = JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}');
          return readiness.state === 'RENDER_READY' && typeof AppState !== 'undefined' && AppState.mode === 'exam' && AppState.data.length > 0;
        }, null, { timeout: 40000 });
        const fontReadiness = await page.evaluate(async family => {
          await document.fonts.ready;
          const weights = [];
          for (const weight of [400, 700, 800]) {
            const faces = await document.fonts.load(`${weight} 12px "${family}"`, '한글 ABC 123');
            weights.push({ weight, loadedFaces: faces.length, allLoaded: faces.length > 0 && faces.every(face =>
              face.status === 'loaded' && face.family.replace(/["']/g, '') === family &&
              face.weight === String(weight) && face.style === 'normal'), checked: document.fonts.check(`${weight} 12px "${family}"`, '한글 ABC 123') });
          }
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { status: document.fonts.status, family, weights,
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content')].map(node => getComputedStyle(node).fontFamily))] };
        }, FONT_FAMILY);
        assert.equal(fontReadiness.status, 'loaded', 'UI_DOCUMENT_FONTS_READY');
        assert(fontReadiness.weights.every(row => row.allLoaded && row.checked), 'UI_STUDENT_FONT_NOT_LOADED');
        assert(fontReadiness.problemFontFamilies.length > 0 && fontReadiness.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_STUDENT_FONT_NOT_APPLIED');
        // Resource evidence is recorded when Playwright's fulfillment settles.
        await routeLifecycle.drain();
        routeLifecycle.assertSettled();
        const respondingWeights = [...fontState.fontResources.keys()].map(file => fontWeights.get(file));
        assert(fontState.fontResources.has(FONT_STYLESHEET) && fontReadiness.weights.every(row =>
          respondingWeights.filter(weight => weight === row.weight).length >= row.loadedFaces),
          'UI_FONT_RESPONSES_REQUIRED');
        await page.waitForFunction(() => JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state === 'RENDER_READY', null, { timeout: 30000 });
        const technical = await page.evaluate(() => ({
          mode: AppState.mode, questions: AppState.data.length, pages: document.querySelectorAll('#print-area .page').length,
          readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
          imagesComplete: [...document.querySelectorAll('#print-area img')].every(image => image.complete && image.naturalWidth > 0),
          mathErrors: document.querySelectorAll('#print-area mjx-merror,#print-area [data-mjx-error]').length,
          unrenderedMath: window.APRenderLoop?.unrenderedMathCount(document.querySelector('#print-area')),
          mathJaxSource: window.__AP_MATHJAX_SOURCE__,
          solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length
        }));
        assertTechnicalState(technical);
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          const choiceGlyphs = await target.evaluate(readChoiceGlyphs);
          glyphObservations.push({ key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
            viewport, sourceRef: item.sourceRef, fontRef: inputs.fontRef, observation: choiceGlyphs });
          fs.writeFileSync(path.join(out, 'choice-glyph-diagnostic.json'), JSON.stringify(glyphObservations, null, 2) + '\n');
          assertChoiceGlyphs(choiceGlyphs);
          assert(served.has(EXPECTED_FONT.path), 'UI_E013_FONT_RESPONSE_REQUIRED');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const capture = await captureProblemTiles(page, target, path.join(out, screenshotPath));
          const geometry = await target.evaluate(image => {
            const box = image.closest('.q-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth > 0 && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber || '').match(/^\d+/)?.[0]), item.sourceOrdinal, 'UI_VISIBLE_ORDINAL');
          const screenshots = capture.tiles.map(tile => { const bytes = fs.readFileSync(path.join(out, tile.filename));
            return { tileIndex: tile.tileIndex, path: tile.filename, sha256: sha256(bytes), bytes: bytes.length }; });
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
            sourceRef: item.sourceRef, assetRef: item.assetRef, fontRef: inputs.fontRef, choiceGlyphs, screenshots,
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontState.fontResources.values()].sort() }, geometry, capture,
            visualReview: 'PENDING', pageErrors, requestFailures, externalRequests });
          activeCase = null;
        }
        casesCompleted = true;
      } catch (error) {
        caseFailure = error;
        throw error;
      } finally {
        await closeStudentContext(page, context, () => {
          if (casesCompleted) assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
        }, routeLifecycle, caseFailure);
      }
    }
    assertCompletedResults(results, inputs, manifest, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.liveHelperRef, inputs.identityRef, inputs.fontRef, fontLicenseRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
      assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
    }
    assert.deepEqual(readFrozenCaptureSource(root).ref, captureHelperRef, 'UI_E013_CAPTURE_HELPER_CHANGED');
    return writeProof('TECHNICAL_PASS_VISUAL_REVIEW_PENDING');
  } catch (error) {
    writeProof('FAIL', /^UI_[A-Z0-9_]+$/.test(error.message) ? error.message : 'UI_BROWSER_CHECK_FAILED');
    throw error;
  } finally {
    clearTimeout(watchdog);
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}


async function main() {
  const args = process.argv.slice(2);
  assert(args.length === 2 && args[0] === '--output' && typeof args[1] === 'string' &&
    path.isAbsolute(args[1]) && !/[\x00-\x1f\x7f]/.test(args[1]), 'UI_E013_ARGUMENTS');
  const root = process.cwd(), out = checkedOutput(root, args[1]);
  const reader = createGitReader(root), checkout = checkoutEvidence(reader.commit);
  const proof = await inspectStudentUi({ root, out, expectedCommit: checkout.expectedCheckoutCommit,
    githubEventCommit: checkout.githubEventCommit, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, logicalCases: proof.results.length,
    screenshotArtifacts: proof.screenshotArtifactCount, checkoutCommit: proof.checkoutCommit,
    parentRestorationApproval: false, releaseGate: proof.releaseGate }));
}
module.exports = { MANIFEST_PATH, CHECKER_PATH, SHARED_CHECKER_PATH, LIVE_CHECKER_SHA256, loadFrozenCaptureHelper, IDENTITY_PATH, SCHEMA,
  EXPECTED_ITEM, EXPECTED_FONT, readChoiceGlyphs, assertChoiceGlyphs, VIEWPORTS, validateManifest, checkoutEvidence, preflight, assertTechnicalState, assertCompletedResults, checkedOutput };
if (require.main === module) main().catch(error => {
  const message = String(error?.message || ''), code = message.split('\n')[0];
  console.error(JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL', parentRestorationApproval: false,
    releaseGate: 'PENDING_ACTUAL_STUDENT_UI', failureCode: /^UI_[A-Z0-9_]+$/.test(code) ? code : 'UI_E013_PREFLIGHT_FAILED',
    errorMessageSha256: sha256(message) }));
  process.exitCode = 1;
});
