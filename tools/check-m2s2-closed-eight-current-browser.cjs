'use strict';

// Closed current-renderer capture for eight existing E017/E023 bindings.
// The original 24-question/48-view evidence remains unchanged. This separate
// 16-view capture confers no mathematical, Native or metadata approval.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const { stable, sha256, gitBlob, createGitReader, studentFontResourcePath, checkedStudentFontRefs, FONT_DIR, FONT_STYLESHEET,
  fontFailureDiagnostic, captureProblemTiles, readScreenshotArtifacts, assertScreenshotInventory } = H;
const MANIFEST_PATH = 'tests/fixtures/archive-m2s2-closed-eight-current-ui.json';
const CHECKER_PATH = 'tools/check-m2s2-closed-eight-current-browser.cjs';
const SHARED_CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const SHARED_CHECKER_SHA256 = 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-m2s2-closed-eight-current-ui-raw-v1';
const CLOSED_PUSH_REF = 'refs/heads/ops/m2-closed8-current-renderer-26fc-20261117';
const EXECUTION_OWNER = 'GITHUB_ACTIONS_CHROMIUM_CLOSED_M2S2_EIGHT_PUSH_HEAD';
const FONT_FAMILY = 'Nanum Myeongjo';
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const EXPECTED_ITEMS_SHA256 = '7dc81210d3c5c2173f0aee9cb2140641f6a26f55650e4016276fefccb3c4f1a9';
const EXPECTED_SOURCE_BINDINGS_SHA256 = '71b529444193bb6c6aab3d20c38d7fb5074172241d3102efb6ebb003990e4ba2';
const VIEWPORTS = Object.freeze([{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]);
const DRAFT = 'DRAFT_AWAIT_POST92_PUBLIC_SOURCE_REBIND';
const SEALED = 'SEALED_PUBLIC_RENDERER_CANDIDATE';
const ownSnapshot = (question, fields) => Object.fromEntries(fields.map(field => [field,
  { present: Object.hasOwn(question, field), value: question[field] ?? null }]));
function ownKeys(value, keys, code) {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), keys.slice().sort(), code);
}
function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'bindingState', 'expectedCases', 'viewports', 'sourceBindings', 'items'], 'UI_CLOSED8_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-m2s2-closed-eight-current-ui-manifest-v1', 'UI_CLOSED8_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'EXACT_E017_SIX_E023_TWO_CURRENT_RENDERER_NO_NEW_APPROVAL', 'UI_CLOSED8_MANIFEST_SCOPE');
  assert([DRAFT, SEALED].includes(manifest.bindingState), 'UI_CLOSED8_BINDING_STATE');
  assert.equal(manifest.expectedCases, 16, 'UI_CLOSED8_CASE_COUNT');
  assert.deepEqual(manifest.viewports, VIEWPORTS, 'UI_CLOSED8_EXACT_VIEWPORTS');
  assert(Array.isArray(manifest.items) && manifest.items.length === 8, 'UI_CLOSED8_EXACT_ITEMS');
  assert.equal(sha256(stable(manifest.items)), EXPECTED_ITEMS_SHA256, 'UI_CLOSED8_EXACT_TARGET_BINDING');
  assert.equal(new Set(manifest.items.map(item => item.questionUid)).size, 8, 'UI_CLOSED8_UNIQUE_UID');
  const sources = [...new Set(manifest.items.map(item => item.sourcePath))].sort();
  assert.equal(sources.length, 2, 'UI_CLOSED8_TWO_BANKS');
  assert(Array.isArray(manifest.sourceBindings) && manifest.sourceBindings.length === 2, 'UI_CLOSED8_SOURCE_BINDINGS');
  assert.deepEqual(manifest.sourceBindings.map(row => row.sourcePath), sources, 'UI_CLOSED8_SOURCE_INVENTORY');
  assert.equal(sha256(stable(manifest.sourceBindings)), EXPECTED_SOURCE_BINDINGS_SHA256, 'UI_CLOSED8_EXACT_CURRENT_SOURCE_BINDING');
  for (const row of manifest.sourceBindings) {
    ownKeys(row, ['sourcePath', 'gitBlobSha1', 'sha256', 'bytes'], 'UI_CLOSED8_SOURCE_BINDING_KEYS');
    assert(SHA1.test(row.gitBlobSha1) && SHA256.test(row.sha256) && Number.isSafeInteger(row.bytes) && row.bytes > 0, 'UI_CLOSED8_SOURCE_BINDING_VALUES');
  }
  return manifest;
}
function requireSealedManifest(manifest) {
  validateManifest(manifest);
  assert.equal(manifest.bindingState, SEALED, 'UI_CLOSED8_PUBLIC_SOURCE_SEAL_REQUIRED');
  return manifest;
}
function checkoutEvidence(actualCommit, env = process.env, event) {
  const expectedCommit = env.ARCHIVE_M2S2_CLOSED8_UI_EXPECTED_SHA;
  assert(typeof expectedCommit === 'string' && SHA1.test(expectedCommit), 'UI_CLOSED8_EXPECTED_CHECKOUT_REQUIRED');
  assert.equal(actualCommit, expectedCommit, 'UI_CLOSED8_CHECKOUT_MISMATCH');
  assert(env.GITHUB_ACTIONS === 'true' && env.GITHUB_REPOSITORY === 'icefoxtail/AP------', 'UI_CLOSED8_ACTIONS_REPOSITORY');
  assert(env.GITHUB_EVENT_NAME === 'push', 'UI_CLOSED8_EXACT_PUSH_EVENT');
  assert.equal(env.GITHUB_SHA, expectedCommit, 'UI_CLOSED8_PUSH_SHA');
  assert.equal(env.GITHUB_REF, CLOSED_PUSH_REF, 'UI_CLOSED8_EXACT_PUSH_REF');
  assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID || ''), 'UI_CLOSED8_RUN_ID');
  const runAttempt = Number(env.GITHUB_RUN_ATTEMPT);
  assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT || '') && Number.isSafeInteger(runAttempt), 'UI_CLOSED8_RUN_ATTEMPT');
  assert(typeof env.GITHUB_WORKFLOW === 'string' && env.GITHUB_WORKFLOW.length > 0 && env.GITHUB_WORKFLOW.length < 200 &&
    /^[A-Za-z0-9_-]+$/.test(env.GITHUB_JOB || ''), 'UI_CLOSED8_WORKFLOW_JOB');
  const payload = event || JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
  assert(payload && payload.ref === CLOSED_PUSH_REF && payload.after === expectedCommit &&
    payload.deleted === false, 'UI_CLOSED8_EXACT_PUSH_PAYLOAD');
  assert(payload.repository?.full_name === env.GITHUB_REPOSITORY && payload.repository?.fork === false,
    'UI_CLOSED8_PUSH_REPOSITORY');
  const execution = { provider: 'GITHUB_ACTIONS', repository: env.GITHUB_REPOSITORY, eventName: 'push',
    ref: CLOSED_PUSH_REF, headSha: actualCommit, capturedHead: actualCommit, eventSha: env.GITHUB_SHA,
    runId: env.GITHUB_RUN_ID, runAttempt, workflow: env.GITHUB_WORKFLOW, job: env.GITHUB_JOB,
    pullRequest: null, baseSha: null };
  return { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: actualCommit,
    githubEventCommit: env.GITHUB_SHA, execution };
}
function loadQuestions(bytes) {
  const sandbox = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), sandbox, { timeout: 1500, filename: 'problem24-source.js', contextCodeGeneration: { strings: false, wasm: false } });
  const bank = sandbox.window.questionBank ?? sandbox.questionBank ?? sandbox.window.examData?.questions ?? sandbox.examData?.questions;
  assert(Array.isArray(bank), 'UI_CLOSED8_BANK_REQUIRED');
  return bank;
}
function assertBoundQuestion(item, question) {
  assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_CLOSED8_ORDINAL');
  assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_CLOSED8_PROBLEM_PAYLOAD_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['content', 'question', 'choices']))), item.problemFieldsSha256, 'UI_CLOSED8_PROBLEM_OWN_FIELDS_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['image', 'imageAlt', 'imageSize', 'layoutTag']))), item.presentationSha256, 'UI_CLOSED8_PRESENTATION_DRIFT');
  const inline = [...String(question.content ?? question.question ?? '').matchAll(/<img\b[^>]*\bsrc\s*=\s*(['"])(.*?)\1/gi)].map(match => match[2]);
  if (item.imageBinding === 'CONTENT_SINGLE_IMG') {
    assert(item.key === 'E017-Q10' && item.sourceOrdinal === 10 && Object.hasOwn(question, 'image') && question.image === '', 'UI_CLOSED8_INLINE_IMAGE_PROFILE');
    assert.deepEqual(inline, [item.assetPath.slice('archive/'.length)], 'UI_CLOSED8_SINGLE_INLINE_IMAGE');
  } else {
    assert.equal(item.imageBinding, 'QUESTION_IMAGE', 'UI_CLOSED8_IMAGE_PROFILE');
    assert.deepEqual(inline, [], 'UI_CLOSED8_UNDECLARED_INLINE_IMAGE');
    assert.equal(question.image, item.assetPath.slice('archive/'.length), 'UI_CLOSED8_IMAGE_POINTER');
  }
}
function preflight(reader, manifest) {
  requireSealedManifest(manifest);
  const identityBytes = reader.read(IDENTITY_PATH), identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_CLOSED8_IDENTITY_RECORDS');
  const banks = new Map();
  for (const binding of manifest.sourceBindings) {
    const bytes = reader.read(binding.sourcePath);
    assert.equal(gitBlob(bytes), binding.gitBlobSha1, 'UI_CLOSED8_SOURCE_GIT_DRIFT');
    assert.equal(sha256(bytes), binding.sha256, 'UI_CLOSED8_SOURCE_RAW_DRIFT');
    assert.equal(bytes.length, binding.bytes, 'UI_CLOSED8_SOURCE_SIZE_DRIFT');
    banks.set(binding.sourcePath, { bytes, questions: loadQuestions(bytes) });
  }
  const items = manifest.items.map(item => {
    const { bytes, questions } = banks.get(item.sourcePath), asset = reader.read(item.assetPath);
    assert.equal(questions.length, item.expectedBankCount, 'UI_CLOSED8_BANK_COUNT');
    assertBoundQuestion(item, questions[item.sourceOrdinal - 1]);
    assert.equal(gitBlob(asset), item.assetGitBlobSha1, 'UI_CLOSED8_ASSET_GIT_DRIFT');
    assert.equal(sha256(asset), item.assetSha256, 'UI_CLOSED8_ASSET_RAW_DRIFT');
    assert.equal(asset.length, item.assetBytes, 'UI_CLOSED8_ASSET_SIZE_DRIFT');
    const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
    assert.equal(matched.length, 1, 'UI_CLOSED8_UNIQUE_IDENTITY');
    assert.equal(matched[0].questionUid, item.questionUid, 'UI_CLOSED8_IDENTITY_UID');
    return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, expectedBankCount: item.expectedBankCount,
      imageBinding: item.imageBinding, problemPayloadSha256: item.problemPayloadSha256, problemFieldsSha256: item.problemFieldsSha256,
      presentationSha256: item.presentationSha256, sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), items };
}
function assertTechnicalState(technical, expectedBankCount) {
  assert([23, 24].includes(expectedBankCount), 'UI_CLOSED8_EXPECTED_BANK_COUNT');
  assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
  assert.equal(technical.questions, expectedBankCount, 'UI_CLOSED8_RENDERED_BANK_COUNT');
  assert.equal(technical.readiness, 'RENDER_READY', 'UI_CLOSED8_RENDER_READY');
  assert(technical.pages > 0 && technical.imagesComplete === true, 'UI_RENDERED_IMAGES');
  assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
  assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
  assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
  assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
}
function assertCompletedResults(results, inputs, manifest, artifacts) {
  requireSealedManifest(manifest);
  assert.equal(results.length, 16, 'UI_CLOSED8_SIXTEEN_LOGICAL_CASES');
  assert.equal(inputs.items.length, 8, 'UI_CLOSED8_INPUT_INVENTORY');
  const seen = new Set();
  for (const row of results) {
    const item = inputs.items.find(item => item.key === row.key), viewport = VIEWPORTS.find(viewport => viewport.name === row.viewport?.name);
    assert(item && viewport, 'UI_CLOSED8_RESULT_TARGET');assert.deepEqual(row.viewport, viewport, 'UI_CLOSED8_RESULT_VIEWPORT');
    const key = item.questionUid + '#' + viewport.name;assert(!seen.has(key), 'UI_CLOSED8_DUPLICATE_LOGICAL_CASE');seen.add(key);
    assert(row.status === 'PASS' && row.visualReview === 'PENDING' && row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal, 'UI_CLOSED8_RESULT_TARGET');
    assert.deepEqual(row.sourceRef, item.sourceRef, 'UI_CLOSED8_RESULT_SOURCE');assert.deepEqual(row.assetRef, item.assetRef, 'UI_CLOSED8_RESULT_ASSET');
    assertTechnicalState(row.technical, item.expectedBankCount);
    const fonts = row.technical.fontReadiness;
    assert(fonts && fonts.status === 'loaded' && fonts.family === FONT_FAMILY && Array.isArray(fonts.weights) &&
      fonts.weights.length === 3 && fonts.weights.every((font, index) => font.weight === [400, 700, 800][index] && font.loadedFaces > 0 && font.allLoaded === true && font.checked === true) &&
      Array.isArray(fonts.problemFontFamilies) && fonts.problemFontFamilies.length > 0 && fonts.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_CLOSED8_COMPLETED_FONT_READINESS');
    const capture = row.capture;
    assert(capture.schemaVersion === H.TILE_SCHEMA && capture.method === 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' && capture.overlapCssPixels === 32 && capture.tileLimit === 8 &&
      capture.cssWrites === 0 && capture.domWrites === 0 && capture.viewportChanges === 0 && capture.compositeImageCreated === false && capture.feedbackIdle === true && capture.foreignContentHits === 0, 'UI_CLOSED8_UNCHANGED_CAPTURE_REQUIRED');
    assert.deepEqual(capture.coverage, H.assertTileCoverage(capture.content.height, capture.tiles), 'UI_CLOSED8_COMPLETE_COVERAGE');
    for (const tile of capture.tiles) {
      assert(tile.feedbackIdle === true && tile.obstructionsIntersectingClip === 0 && tile.foreignContentHits === 0 && tile.hitTestSamples > 0 && tile.domSha256 === capture.domSha256, 'UI_CLOSED8_UNOBSTRUCTED_ORIGINAL_TILE');
    }
    assert(row.geometry?.imageInsideQuestion === true && row.geometry.naturalWidth > 0 && row.geometry.image.width > 0, 'UI_CLOSED8_RESULT_IMAGE_GEOMETRY');
    for (const field of ['pageErrors', 'requestFailures', 'externalRequests']) assert.deepEqual(row[field], [], 'UI_CLOSED8_NETWORK_OR_PAGE_FAILURE');
  }
  assert.equal(seen.size, 16, 'UI_CLOSED8_COMPLETE_LOGICAL_INVENTORY');
  return assertScreenshotInventory(results, artifacts);
}
function checkedOutput(root, out) {
  root = path.resolve(root); out = path.resolve(out);
  assert(out !== root && !out.startsWith(root + path.sep), 'UI_CLOSED8_OUTPUT_OUTSIDE_CHECKOUT');
  for (let current = out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'UI_CLOSED8_OUTPUT_SYMLINK');
  assert(!fs.existsSync(out) || fs.readdirSync(out).length === 0, 'UI_CLOSED8_EMPTY_OUTPUT_REQUIRED');
  return out;
}

// The bounded browser driver below is copied from the independently checked
// Q22 problem-only driver; only the closed cohort names and bank counts differ.
const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath, githubEventCommit = null, execution }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  assert(SHA1.test(expectedCommit), 'UI_CLOSED8_EXPECTED_CHECKOUT_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  assert.deepEqual(execution, checkoutEvidence(reader.commit).execution, 'UI_CLOSED8_EXECUTION_CHANGED');
  const captureHelperRef = reader.ref(SHARED_CHECKER_PATH);
  assert.equal(captureHelperRef.sha256, SHARED_CHECKER_SHA256, 'UI_CLOSED8_CAPTURE_HELPER_CHANGED');
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: EXECUTION_OWNER, checkoutCommit: reader.commit, execution,
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
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=exam&fit=screen&studentReview=1&figureZoom=0`;
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
          assert(geometry.imageInsideQuestion && geometry.naturalWidth > 0 && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
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
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, inputs.identityRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
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
    path.isAbsolute(args[1]) && !/[\x00-\x1f\x7f]/.test(args[1]), 'UI_CLOSED8_ARGUMENTS');
  const root = process.cwd(), out = checkedOutput(root, args[1]);
  const reader = createGitReader(root), checkout = checkoutEvidence(reader.commit);
  const proof = await inspectStudentUi({ root, out, expectedCommit: checkout.expectedCheckoutCommit,
    githubEventCommit: checkout.githubEventCommit, execution: checkout.execution, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, logicalCases: proof.results.length,
    screenshotArtifacts: proof.screenshotArtifactCount, checkoutCommit: proof.checkoutCommit,
    newParentApprovals: 0, releaseGate: proof.releaseGate }));
}
module.exports = { MANIFEST_PATH, CHECKER_PATH, SHARED_CHECKER_PATH, SHARED_CHECKER_SHA256, IDENTITY_PATH, SCHEMA,
  EXPECTED_ITEMS_SHA256, EXPECTED_SOURCE_BINDINGS_SHA256, CLOSED_PUSH_REF, EXECUTION_OWNER, VIEWPORTS, DRAFT, SEALED, ownSnapshot, validateManifest, requireSealedManifest, checkoutEvidence, loadQuestions, assertBoundQuestion, preflight, assertTechnicalState, assertCompletedResults, checkedOutput };
if (require.main === module) main().catch(error => {
  const message = String(error?.message || ''), code = message.split('\n')[0];
  console.error(JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL', newParentApprovals: 0,
    releaseGate: 'PENDING_ACTUAL_STUDENT_UI', failureCode: /^UI_[A-Z0-9_]+$/.test(code) ? code : 'UI_CLOSED8_PREFLIGHT_FAILED',
    errorMessageSha256: sha256(message) }));
  process.exitCode = 1;
});
