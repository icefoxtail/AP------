'use strict';

// Closed problem-only capture for E052 Q5 and its restored original given diagram.
// Source seals remain a draft until the trusted public candidate is verified.
// Technical capture confers no mathematical, Native or metadata approval.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const { stable, sha256, gitBlob, createGitReader, studentFontResourcePath, checkedStudentFontRefs, FONT_DIR, FONT_STYLESHEET,
  fontFailureDiagnostic, captureProblemTiles, readScreenshotArtifacts, assertScreenshotInventory } = H;
const MANIFEST_PATH = 'tests/fixtures/archive-m3-e052-q5-problem-ui.json';
const CHECKER_PATH = 'tools/check-m3-e052-q5-problem-browser.cjs';
const SHARED_CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const SHARED_CHECKER_SHA256 = 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-m3-e052-q5-student-ui-preview-v1';
const FONT_FAMILY = 'Nanum Myeongjo';
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const EXPECTED_ITEMS_SHA256 = '4654337aafdb73a826ab1b6e286394042932e506feece451dc5526bf6063e937';
const EXPECTED_SOURCE_BINDINGS = Object.freeze([{"sourcePath":"archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js","gitBlobSha1":"82c627bacb59105e9bd3a5397d4828757308d587","sha256":"996ba1f2538b060c96f6528fc90c62affa567285a6a24d2106051199f9a348d1","bytes":66658}]);
const EXPECTED_SURFACE_REFS = Object.freeze([{"path":"archive/engine.html","gitBlobSha1":"905952ae39138e1f6dc0aa2d7c7c8a64403f527b","sha256":"a963c562478b96f7f9d8ae09ad6e5c85b3262296d734e7abd001836e1c3f317b","bytes":201060},{"path":"archive/screen-runtime-adapter.js","gitBlobSha1":"3d8f3159934c99637c4df893649adbc331065d96","sha256":"2834bd3d0f3b40264921e15a85840df3d2374c7fcc6158844ce12883fb7cdd93","bytes":52980}]);
const VIEWPORTS = Object.freeze([{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]);
const DRAFT = 'DRAFT_AWAIT_TRUSTED_PUBLIC_SOURCE';
const SEALED = 'SEALED_PUBLIC_RENDERER_CANDIDATE';
const ownSnapshot = (question, fields) => Object.fromEntries(fields.map(field => [field,
  { present: Object.hasOwn(question, field), value: question[field] ?? null }]));
function ownKeys(value, keys, code) {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), keys.slice().sort(), code);
}
function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'bindingState', 'expectedCases', 'viewports', 'sourceBindings', 'items'], 'UI_Q5_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-m3-e052-q5-problem-ui-manifest-v1', 'UI_Q5_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'EXACT_E052_Q5_ORIGINAL_GIVEN_DIAGRAM_NO_APPROVAL', 'UI_Q5_MANIFEST_SCOPE');
  assert([DRAFT, SEALED].includes(manifest.bindingState), 'UI_Q5_BINDING_STATE');
  assert.equal(manifest.expectedCases, 2, 'UI_Q5_CASE_COUNT');
  assert.deepEqual(manifest.viewports, VIEWPORTS, 'UI_Q5_EXACT_VIEWPORTS');
  assert(Array.isArray(manifest.items) && manifest.items.length === 1, 'UI_Q5_EXACT_ITEMS');
  assert.equal(sha256(stable(manifest.items)), EXPECTED_ITEMS_SHA256, 'UI_Q5_EXACT_TARGET_BINDING');
  assert.equal(new Set(manifest.items.map(item => item.questionUid)).size, 1, 'UI_Q5_UNIQUE_UID');
  const sources = [...new Set(manifest.items.map(item => item.sourcePath))].sort();
  assert.equal(sources.length, 1, 'UI_Q5_ONE_BANK');
  assert(Array.isArray(manifest.sourceBindings) && manifest.sourceBindings.length === 1, 'UI_Q5_SOURCE_BINDINGS');
  assert.deepEqual(manifest.sourceBindings.map(row => row.sourcePath), sources, 'UI_Q5_SOURCE_INVENTORY');
  for (const row of manifest.sourceBindings) {
    ownKeys(row, ['sourcePath', 'gitBlobSha1', 'sha256', 'bytes'], 'UI_Q5_SOURCE_BINDING_KEYS');
    assert(SHA1.test(row.gitBlobSha1) && SHA256.test(row.sha256) && Number.isSafeInteger(row.bytes) && row.bytes > 0, 'UI_Q5_SOURCE_BINDING_VALUES');
  }
  assert.deepEqual(manifest.sourceBindings, EXPECTED_SOURCE_BINDINGS, 'UI_Q5_EXACT_EXPECTED_PUBLIC_SOURCE');
  return manifest;
}
function requireSealedManifest(manifest) {
  validateManifest(manifest);
  assert.equal(manifest.bindingState, SEALED, 'UI_Q5_PUBLIC_SOURCE_SEAL_REQUIRED');
  return manifest;
}
function checkoutEvidence(actualCommit, env = process.env) {
  const expectedCommit = env.ARCHIVE_M3_E052_Q5_UI_EXPECTED_SHA;
  assert(typeof expectedCommit === 'string' && SHA1.test(expectedCommit), 'UI_Q5_EXPECTED_CHECKOUT_REQUIRED');
  assert.equal(actualCommit, expectedCommit, 'UI_Q5_CHECKOUT_MISMATCH');
  assert(env.GITHUB_SHA === undefined || (typeof env.GITHUB_SHA === 'string' && SHA1.test(env.GITHUB_SHA)), 'UI_Q5_EVENT_SHA');
  return { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: actualCommit, githubEventCommit: env.GITHUB_SHA ?? null };
}
function loadQuestions(bytes) {
  assert(Buffer.isBuffer(bytes) && bytes.length > 0 && bytes.length <= 16 * 1024 * 1024, 'UI_Q5_SOURCE_SIZE');
  const context = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
  new vm.Script('globalThis.window={};globalThis.console={log(){},warn(){},error(){}};').runInContext(context, { timeout: 1500 });
  new vm.Script(bytes.toString('utf8'), { filename: 'q5-problem-source.js' }).runInContext(context, { timeout: 1500 });
  const json = new vm.Script(`(() => {
    const bank = window.questionBank ?? globalThis.questionBank ?? window.examData?.questions ?? globalThis.examData?.questions;
    if (!Array.isArray(bank) || !bank.length) throw new Error('UI_Q5_BANK_REQUIRED');
    const seen = new Set();
    function data(value) {
      if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return;
      if (!value || typeof value !== 'object' || seen.has(value)) throw new Error('UI_Q5_SOURCE_DATA');
      seen.add(value);
      if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) throw new Error('UI_Q5_SOURCE_PROTOTYPE');
      for (const key of Reflect.ownKeys(value)) {
        if (Array.isArray(value) && key === 'length') continue;
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (typeof key !== 'string' || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new Error('UI_Q5_SOURCE_DESCRIPTOR');
        data(descriptor.value);
      }
      if (Array.isArray(value) && Object.keys(value).length !== value.length) throw new Error('UI_Q5_SOURCE_ARRAY');
      seen.delete(value);
    }
    data(bank); return JSON.stringify(bank);
  })()`).runInContext(context, { timeout: 1500 });
  return JSON.parse(json);
}
function assertBoundQuestion(item, question) {
  assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_Q5_ORDINAL');
  assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_Q5_PROBLEM_PAYLOAD_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['content', 'question', 'choices']))), item.problemFieldsSha256, 'UI_Q5_PROBLEM_OWN_FIELDS_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['image', 'imageAlt', 'imageSize', 'layoutTag']))), item.presentationSha256, 'UI_Q5_PRESENTATION_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['choicesEmbeddedInImage']))), item.choicePresentationSha256, 'UI_Q5_CHOICE_PRESENTATION_DRIFT');
  assert(Array.isArray(question.choices) && question.choices.length === 5 && question.choicesEmbeddedInImage !== true, 'UI_Q5_EXACT_VISIBLE_CHOICES');
  assert(!/<img\b/i.test(String(question.content ?? question.question ?? '')), 'UI_Q5_UNDECLARED_INLINE_IMAGE');
  assert.equal(item.imageBinding, 'QUESTION_IMAGE', 'UI_Q5_IMAGE_PROFILE');
  assert.equal(question.image, item.assetPath.slice('archive/'.length), 'UI_Q5_IMAGE_POINTER');
}
function checkedSurface(reader) {
  return EXPECTED_SURFACE_REFS.map(expected => {
    const bytes = reader.read(expected.path), actual = reader.ref(expected.path, bytes);
    for (const field of ['path', 'gitBlobSha1', 'sha256', 'bytes']) assert.equal(actual[field], expected[field], 'UI_Q5_EXACT_CURRENT_SURFACE');
    return actual;
  });
}
function preflight(reader, manifest) {
  requireSealedManifest(manifest);
  const identityBytes = reader.read(IDENTITY_PATH), identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_Q5_IDENTITY_RECORDS');
  const surfaceRefs = checkedSurface(reader);
  const banks = new Map();
  for (const binding of manifest.sourceBindings) {
    const bytes = reader.read(binding.sourcePath);
    assert.equal(gitBlob(bytes), binding.gitBlobSha1, 'UI_Q5_SOURCE_GIT_DRIFT');
    assert.equal(sha256(bytes), binding.sha256, 'UI_Q5_SOURCE_RAW_DRIFT');
    assert.equal(bytes.length, binding.bytes, 'UI_Q5_SOURCE_SIZE_DRIFT');
    banks.set(binding.sourcePath, { bytes, questions: loadQuestions(bytes) });
  }
  const items = manifest.items.map(item => {
    const { bytes, questions } = banks.get(item.sourcePath), asset = reader.read(item.assetPath);
    assert.equal(questions.length, item.expectedBankCount, 'UI_Q5_BANK_COUNT');
    assertBoundQuestion(item, questions[item.sourceOrdinal - 1]);
    assert.equal(gitBlob(asset), item.assetGitBlobSha1, 'UI_Q5_ASSET_GIT_DRIFT');
    assert.equal(sha256(asset), item.assetSha256, 'UI_Q5_ASSET_RAW_DRIFT');
    assert.equal(asset.length, item.assetBytes, 'UI_Q5_ASSET_SIZE_DRIFT');
    const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
    assert.equal(matched.length, 1, 'UI_Q5_UNIQUE_IDENTITY');
    assert.equal(matched[0].questionUid, item.questionUid, 'UI_Q5_IDENTITY_UID');
    const bankIdentity = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length));
    assert(bankIdentity.length === 25 && new Set(bankIdentity.map(row => row.sourceOrdinal)).size === 25 &&
      bankIdentity.every(row => Number.isSafeInteger(row.sourceOrdinal) && row.sourceOrdinal >= 1 && row.sourceOrdinal <= 25), 'UI_Q5_IDENTITY_DENOMINATOR');
    assert.equal(identity.records.filter(row => row.questionUid === item.questionUid).length, 1, 'UI_Q5_GLOBAL_UID_UNIQUE');
    return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, expectedBankCount: item.expectedBankCount,
      imageBinding: item.imageBinding, problemPayloadSha256: item.problemPayloadSha256, problemFieldsSha256: item.problemFieldsSha256,
      presentationSha256: item.presentationSha256, choicePresentationSha256: item.choicePresentationSha256, expectedImageWidth: item.expectedImageWidth, expectedImageHeight: item.expectedImageHeight, sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), surfaceRefs, items };
}
function assertTechnicalState(technical, expectedBankCount) {
  assert.equal(expectedBankCount, 25, 'UI_Q5_EXPECTED_BANK_COUNT');
  assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
  assert.equal(technical.questions, expectedBankCount, 'UI_Q5_RENDERED_BANK_COUNT');
  assert.equal(technical.readiness, 'RENDER_READY', 'UI_Q5_RENDER_READY');
  assert(technical.pages > 0 && technical.imagesComplete === true, 'UI_RENDERED_IMAGES');
  assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
  assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
  assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
  assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
}
function assertCompletedResults(results, inputs, manifest, artifacts) {
  requireSealedManifest(manifest);
  assert.equal(results.length, 2, 'UI_Q5_TWO_LOGICAL_CASES');
  assert.equal(inputs.items.length, 1, 'UI_Q5_INPUT_INVENTORY');
  const seen = new Set();
  for (const row of results) {
    const item = inputs.items.find(item => item.key === row.key), viewport = VIEWPORTS.find(viewport => viewport.name === row.viewport?.name);
    assert(item && viewport, 'UI_Q5_RESULT_TARGET');assert.deepEqual(row.viewport, viewport, 'UI_Q5_RESULT_VIEWPORT');
    const key = item.questionUid + '#' + viewport.name;assert(!seen.has(key), 'UI_Q5_DUPLICATE_LOGICAL_CASE');seen.add(key);
    assert(row.status === 'PASS' && row.visualReview === 'PENDING' && row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal, 'UI_Q5_RESULT_TARGET');
    assert.deepEqual(row.sourceRef, item.sourceRef, 'UI_Q5_RESULT_SOURCE');assert.deepEqual(row.assetRef, item.assetRef, 'UI_Q5_RESULT_ASSET');
    assertTechnicalState(row.technical, item.expectedBankCount);
    const fonts = row.technical.fontReadiness;
    assert(fonts && fonts.status === 'loaded' && fonts.family === FONT_FAMILY && Array.isArray(fonts.weights) &&
      fonts.weights.length === 3 && fonts.weights.every((font, index) => font.weight === [400, 700, 800][index] && font.loadedFaces > 0 && font.allLoaded === true && font.checked === true) &&
      Array.isArray(fonts.problemFontFamilies) && fonts.problemFontFamilies.length > 0 && fonts.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_Q5_COMPLETED_FONT_READINESS');
    const capture = row.capture;
    assert(capture.schemaVersion === H.TILE_SCHEMA && capture.method === 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' && capture.overlapCssPixels === 32 && capture.tileLimit === 8 &&
      capture.cssWrites === 0 && capture.domWrites === 0 && capture.viewportChanges === 0 && capture.compositeImageCreated === false && capture.feedbackIdle === true && capture.foreignContentHits === 0, 'UI_Q5_UNCHANGED_CAPTURE_REQUIRED');
    assert.deepEqual(capture.coverage, H.assertTileCoverage(capture.content.height, capture.tiles), 'UI_Q5_COMPLETE_COVERAGE');
    for (const tile of capture.tiles) {
      assert(tile.feedbackIdle === true && tile.obstructionsIntersectingClip === 0 && tile.foreignContentHits === 0 && tile.hitTestSamples > 0 && tile.domSha256 === capture.domSha256, 'UI_Q5_UNOBSTRUCTED_ORIGINAL_TILE');
    }
    assert(row.geometry?.imageInsideQuestion === true && row.geometry.naturalWidth === item.expectedImageWidth && row.geometry.naturalHeight === item.expectedImageHeight && row.geometry.image.width > 0, 'UI_Q5_RESULT_IMAGE_GEOMETRY');
    for (const field of ['pageErrors', 'requestFailures', 'externalRequests']) assert.deepEqual(row[field], [], 'UI_Q5_NETWORK_OR_PAGE_FAILURE');
  }
  assert.equal(seen.size, 2, 'UI_Q5_COMPLETE_LOGICAL_INVENTORY');
  return assertScreenshotInventory(results, artifacts);
}
function checkedOutput(root, out) {
  root = path.resolve(root); out = path.resolve(out);
  assert(out !== root && !out.startsWith(root + path.sep), 'UI_Q5_OUTPUT_OUTSIDE_CHECKOUT');
  for (let current = out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'UI_Q5_OUTPUT_SYMLINK');
  assert(!fs.existsSync(out) || fs.readdirSync(out).length === 0, 'UI_Q5_EMPTY_OUTPUT_REQUIRED');
  return out;
}

// The bounded browser driver below is copied from the independently checked
// Q22 problem-only driver; only the closed cohort names and bank counts differ.
const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath, githubEventCommit = null }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  assert(SHA1.test(expectedCommit), 'UI_Q5_EXPECTED_CHECKOUT_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const captureHelperRef = reader.ref(SHARED_CHECKER_PATH);
  assert.equal(captureHelperRef.sha256, SHARED_CHECKER_SHA256, 'UI_Q5_CAPTURE_HELPER_CHANGED');
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef, ...inputs,
    checkout: { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: reader.commit, githubEventCommit },
    newParentApprovals: 0, newNativeApprovals: 0, releaseGate: 'PENDING_INDEPENDENT_VISUAL_REVIEW',
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertCompletedResults(results, inputs, manifest, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
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
      const routeLifecycle = H.createStudentRouteLifecycle(failures);
      try {
        page = await context.newPage();
        page.setDefaultTimeout(10000);
        page.on('pageerror', error => pageErrors.push({ messageSha256: sha256(error.message) }));
        page.on('requestfailed', request => requestFailures.push({ urlSha256: sha256(request.url()), errorSha256: sha256(request.failure()?.errorText || '') }));
        await page.route('**/*', routeLifecycle.wrap(async route => {
          const url = new URL(route.request().url());
          const fontPath = studentFontResourcePath(url.href, origin, fontRefs);
          if (fontPath) return H.serveStudentFont(route, url, fontPath, fontState);
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
              face.status === 'loaded' && face.family.replace(/["']/g, '') === family && face.weight === String(weight) && face.style === 'normal'), checked: document.fonts.check(`${weight} 12px "${family}"`, '한글 ABC 123') });
          }
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { status: document.fonts.status, family, weights,
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content')].map(node => getComputedStyle(node).fontFamily))] };
        }, FONT_FAMILY);
        assert.equal(fontReadiness.status, 'loaded', 'UI_DOCUMENT_FONTS_READY');
        assert(fontReadiness.weights.every(row => row.allLoaded && row.checked), 'UI_STUDENT_FONT_NOT_LOADED');
        assert(fontReadiness.problemFontFamilies.length > 0 && fontReadiness.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_STUDENT_FONT_NOT_APPLIED');
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
        assertTechnicalState(technical, inputs.items.find(item => item.sourceRef.path === sourcePath).expectedBankCount);
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const capture = await captureProblemTiles(page, target, path.join(out, screenshotPath));
          const geometry = await target.evaluate(image => {
            const box = image.closest('.q-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth === item.expectedImageWidth && geometry.naturalHeight === item.expectedImageHeight && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber || '').match(/^\d+/)?.[0]), item.sourceOrdinal, 'UI_VISIBLE_ORDINAL');
          const screenshots = capture.tiles.map(tile => { const bytes = fs.readFileSync(path.join(out, tile.filename));
            return { tileIndex: tile.tileIndex, path: tile.filename, sha256: sha256(bytes), bytes: bytes.length }; });
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
            sourceRef: item.sourceRef, assetRef: item.assetRef, screenshots,
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontState.fontResources.values()].sort() }, geometry, capture,
            visualReview: 'PENDING', pageErrors, requestFailures, externalRequests });
          activeCase = null;
        }
        casesCompleted = true;
      } catch (error) {
        caseFailure = error;
        throw error;
      } finally {
        await H.closeStudentContext(page, context, () => {
          if (casesCompleted) assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
        }, routeLifecycle, caseFailure);
      }
    }
    assertCompletedResults(results, inputs, manifest, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, inputs.identityRef, ...inputs.surfaceRefs, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
      assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
    }
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
    path.isAbsolute(args[1]) && !/[\x00-\x1f\x7f]/.test(args[1]), 'UI_Q5_ARGUMENTS');
  const root = process.cwd(), out = checkedOutput(root, args[1]);
  const reader = createGitReader(root), checkout = checkoutEvidence(reader.commit);
  const proof = await inspectStudentUi({ root, out, expectedCommit: checkout.expectedCheckoutCommit,
    githubEventCommit: checkout.githubEventCommit, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, logicalCases: proof.results.length,
    screenshotArtifacts: proof.screenshotArtifactCount, checkoutCommit: proof.checkoutCommit,
    newParentApprovals: 0, releaseGate: proof.releaseGate }));
}
module.exports = { MANIFEST_PATH, CHECKER_PATH, SHARED_CHECKER_PATH, SHARED_CHECKER_SHA256, IDENTITY_PATH, SCHEMA,
  EXPECTED_ITEMS_SHA256, EXPECTED_SOURCE_BINDINGS, EXPECTED_SURFACE_REFS, checkedSurface, VIEWPORTS, DRAFT, SEALED, ownSnapshot, validateManifest, requireSealedManifest, checkoutEvidence, loadQuestions, assertBoundQuestion, preflight, assertTechnicalState, assertCompletedResults, checkedOutput };
if (require.main === module) main().catch(error => {
  const message = String(error?.message || ''), code = message.split('\n')[0];
  console.error(JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL', newParentApprovals: 0,
    releaseGate: 'PENDING_ACTUAL_STUDENT_UI', failureCode: /^UI_[A-Z0-9_]+$/.test(code) ? code : 'UI_Q5_PREFLIGHT_FAILED',
    errorMessageSha256: sha256(message) }));
  process.exitCode = 1;
});
