'use strict';

// Exact Q22 problem-only student UI evidence. This tool cannot restore a BASIC
// parent, approve metadata or grant mathematical, difficulty or REVIEW2 status.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const { stable, sha256, gitBlob, createGitReader, isStudentFontStylesheet, declaredStudentFonts,
  fontFailureDiagnostic, captureProblemTiles, readScreenshotArtifacts, assertScreenshotInventory } = H;
const MANIFEST_PATH = 'tests/fixtures/archive-q22-basic-parent-problem-ui.json';
const CHECKER_PATH = 'tools/check-q22-basic-parent-problem-browser.cjs';
const SHARED_CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const SHARED_CHECKER_SHA256 = '94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-q22-basic-parent-problem-ui-preview-v1';
const FONT_FAMILY = 'Nanum Myeongjo';
const SHA1 = /^[a-f0-9]{40}$/;
const EXPECTED_ITEM = Object.freeze({
  "key": "Q22",
  "questionUid": "qid_v1_0704335d6e4bedb837a893f8f28eac2587963888307021abc83e61407b889051",
  "sourceOrdinal": 22,
  "sourcePath": "archive/exams/original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js",
  "sourceGitBlobSha1": "40fac8532d52c2b308708f6a0769005029bb7565",
  "sourceSha256": "b86fc1cbb7a69bdedc337675a834c9641344df0c7d2cd47a1bb953b6177cb2f4",
  "expectedBankCount": 24,
  "problemPayloadSha256": "4d003957bebc1c59d848c1dbd62c4e0aa8aa31115325772be359ce116de50b3a",
  "presentationSha256": "ebee08e5cc9e5b0089e1fca7b4b30cdaea5e17287dae4817731ec8313fef81af",
  "assetPath": "archive/assets/images/24_매산중_2학기_중간_중2_수학/q22-problem-visual-v2.svg",
  "assetGitBlobSha1": "b74f08fbd57d670ab8463932191dfedb9e16bf88",
  "assetSha256": "274a37ec62956b63400c6d27b9d217b2715ca3ef4d0a64dc40dcd39f5058f96d"
});
const VIEWPORTS = Object.freeze([{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]);
function ownKeys(value, keys, code) {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), keys.slice().sort(), code);
}
function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'expectedCases', 'viewports', 'items'], 'UI_Q22_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-q22-basic-parent-problem-ui-manifest-v1', 'UI_Q22_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'EXACT_Q22_PROBLEM_DISPLAY_ONLY_NO_PARENT_APPROVAL', 'UI_Q22_MANIFEST_SCOPE');
  assert.equal(manifest.expectedCases, 2, 'UI_Q22_CASE_COUNT');
  assert.deepEqual(manifest.viewports, VIEWPORTS, 'UI_Q22_EXACT_VIEWPORTS');
  assert(Array.isArray(manifest.items) && manifest.items.length === 1, 'UI_Q22_EXACT_ONE_ITEM');
  ownKeys(manifest.items[0], Object.keys(EXPECTED_ITEM), 'UI_Q22_ITEM_KEYS');
  assert.deepEqual(manifest.items[0], EXPECTED_ITEM, 'UI_Q22_EXACT_TARGET_BINDING');
  return manifest;
}
function checkoutEvidence(actualCommit, env = process.env) {
  const expectedCommit = env.ARCHIVE_Q22_PROBLEM_UI_EXPECTED_SHA;
  assert(typeof expectedCommit === 'string' && SHA1.test(expectedCommit), 'UI_Q22_EXPECTED_CHECKOUT_REQUIRED');
  assert.equal(actualCommit, expectedCommit, 'UI_Q22_CHECKOUT_MISMATCH');
  assert(env.GITHUB_SHA === undefined || (typeof env.GITHUB_SHA === 'string' && SHA1.test(env.GITHUB_SHA)), 'UI_Q22_EVENT_SHA');
  return { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: actualCommit, githubEventCommit: env.GITHUB_SHA ?? null };
}
function loadQuestions(bytes) {
  const sandbox = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), sandbox, { timeout: 1500, filename: 'q22-source.js', contextCodeGeneration: { strings: false, wasm: false } });
  const bank = sandbox.window.questionBank ?? sandbox.questionBank ?? sandbox.window.examData?.questions ?? sandbox.examData?.questions;
  assert(Array.isArray(bank), 'UI_Q22_BANK_REQUIRED');
  return bank;
}
function preflight(reader, manifest) {
  validateManifest(manifest);
  const item = manifest.items[0], source = reader.read(item.sourcePath), asset = reader.read(item.assetPath);
  assert.equal(gitBlob(source), item.sourceGitBlobSha1, 'UI_Q22_SOURCE_GIT_DRIFT');
  assert.equal(sha256(source), item.sourceSha256, 'UI_Q22_SOURCE_RAW_DRIFT');
  assert.equal(gitBlob(asset), item.assetGitBlobSha1, 'UI_Q22_ASSET_GIT_DRIFT');
  assert.equal(sha256(asset), item.assetSha256, 'UI_Q22_ASSET_RAW_DRIFT');
  const questions = loadQuestions(source);
  assert.equal(questions.length, item.expectedBankCount, 'UI_Q22_BANK_COUNT');
  const question = questions[item.sourceOrdinal - 1];
  assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_Q22_ORDINAL');
  assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_Q22_PROBLEM_PAYLOAD_DRIFT');
  assert.equal(question.image, item.assetPath.slice('archive/'.length), 'UI_Q22_IMAGE_POINTER');
  assert.equal(sha256(stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag })), item.presentationSha256, 'UI_Q22_PRESENTATION_DRIFT');
  const identityBytes = reader.read(IDENTITY_PATH), identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_Q22_IDENTITY_RECORDS');
  const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
  assert.equal(matched.length, 1, 'UI_Q22_UNIQUE_IDENTITY');
  assert.equal(matched[0].questionUid, item.questionUid, 'UI_Q22_IDENTITY_UID');
  return { expectedBankCount: questions.length, identityRef: reader.ref(IDENTITY_PATH, identityBytes), items: [{
    key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    problemPayloadSha256: item.problemPayloadSha256, presentationSha256: item.presentationSha256,
    sourceRef: reader.ref(item.sourcePath, source), assetRef: reader.ref(item.assetPath, asset) }] };
}
function assertTechnicalState(technical) {
  assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
  assert.equal(technical.questions, EXPECTED_ITEM.expectedBankCount, 'UI_Q22_RENDERED_BANK_COUNT');
  assert.equal(technical.readiness, 'RENDER_READY', 'UI_Q22_RENDER_READY');
  assert(technical.pages > 0 && technical.imagesComplete === true, 'UI_RENDERED_IMAGES');
  assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
  assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
  assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
  assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
}
function assertCompletedResults(results, inputs, manifest, artifacts) {
  validateManifest(manifest);
  assert.equal(results.length, 2, 'UI_Q22_TWO_LOGICAL_CASES');
  assert.deepEqual(results.map(row => row.viewport), VIEWPORTS, 'UI_Q22_TWO_EXACT_VIEWPORTS');
  const item = inputs.items[0];
  for (const row of results) {
    assert(row.status === 'PASS' && row.visualReview === 'PENDING' && row.key === item.key &&
      row.questionUid === item.questionUid && row.sourceOrdinal === 22, 'UI_Q22_RESULT_TARGET');
    assert.deepEqual(row.sourceRef, item.sourceRef, 'UI_Q22_RESULT_SOURCE');
    assert.deepEqual(row.assetRef, item.assetRef, 'UI_Q22_RESULT_ASSET');
    assertTechnicalState(row.technical);
    const capture = row.capture;
    assert(capture.schemaVersion === H.TILE_SCHEMA && capture.method === 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' &&
      capture.overlapCssPixels === 32 && capture.tileLimit === 8 && capture.cssWrites === 0 && capture.domWrites === 0 &&
      capture.viewportChanges === 0 && capture.compositeImageCreated === false && capture.feedbackIdle === true && capture.foreignContentHits === 0,
      'UI_Q22_UNCHANGED_CAPTURE_REQUIRED');
    assert.deepEqual(capture.coverage, H.assertTileCoverage(capture.content.height, capture.tiles), 'UI_Q22_COMPLETE_COVERAGE');
  }
  return assertScreenshotInventory(results, artifacts);
}
function checkedOutput(root, out) {
  root = path.resolve(root); out = path.resolve(out);
  assert(out !== root && !out.startsWith(root + path.sep), 'UI_Q22_OUTPUT_OUTSIDE_CHECKOUT');
  for (let current = out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'UI_Q22_OUTPUT_SYMLINK');
  assert(!fs.existsSync(out) || fs.readdirSync(out).length === 0, 'UI_Q22_EMPTY_OUTPUT_REQUIRED');
  return out;
}

const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath, githubEventCommit = null }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  assert(SHA1.test(expectedCommit), 'UI_Q22_EXPECTED_CHECKOUT_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const captureHelperRef = reader.ref(SHARED_CHECKER_PATH);
  assert.equal(captureHelperRef.sha256, SHARED_CHECKER_SHA256, 'UI_Q22_CAPTURE_HELPER_CHANGED');
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const served = new Map(), mirrored = new Map(), externalFontResources = new Map(), failures = [], results = [];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef, ...inputs,
    checkout: { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: reader.commit, githubEventCommit },
    parentRestorationApproval: false, releaseGate: 'PENDING_INDEPENDENT_VISUAL_REVIEW',
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_STUDENT_GOOGLE_STYLESHEET_AND_ITS_DECLARED_NANUM_MYEONGJO_FILES',
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertCompletedResults(results, inputs, manifest, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
      externalFontResources: [...externalFontResources.values()], failures };
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
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        const pageErrors = [], requestFailures = [], externalRequests = [], declaredFonts = new Set(), fontResources = new Set();
        page.on('pageerror', error => pageErrors.push({ messageSha256: sha256(error.message) }));
        page.on('requestfailed', request => requestFailures.push({ urlSha256: sha256(request.url()), errorSha256: sha256(request.failure()?.errorText || '') }));
        await page.route('**/*', async route => {
          const url = new URL(route.request().url());
          if (url.origin === origin) return route.continue();
          const stylesheet = isStudentFontStylesheet(url.href);
          if (stylesheet || declaredFonts.has(url.href)) {
            const fontObservation = { kind: stylesheet ? 'STYLESHEET' : 'FONT', urlSha256: sha256(url.href), stage: 'FETCH' };
            try {
              const response = await route.fetch({ timeout: 15000, maxRedirects: 0 });
              const contentType = response.headers()['content-type'] || '', mediaType = contentType.split(';')[0].trim().toLowerCase();
              Object.assign(fontObservation, { httpStatus: response.status(), responseUrlSha256: sha256(response.url()), mime: mediaType, stage: 'HTTP_STATUS' });
              assert.equal(response.status(), 200, 'UI_FONT_HTTP_STATUS');
              fontObservation.stage = 'RESPONSE_URL';
              assert.equal(response.url(), url.href, 'UI_FONT_REDIRECT');
              fontObservation.stage = 'MIME';
              assert(stylesheet ? mediaType === 'text/css' : ['font/woff2', 'font/woff', 'font/ttf', 'application/font-woff', 'application/x-font-ttf'].includes(mediaType), 'UI_FONT_MIME');
              fontObservation.stage = 'BODY_READ';
              const bytes = await response.body();
              Object.assign(fontObservation, { bytes: bytes.length, responseSha256: sha256(bytes), stage: 'BODY_SIZE' });
              assert(bytes.length > 0 && bytes.length <= 2 * 1024 * 1024, 'UI_FONT_BODY_SIZE');
              fontObservation.stage = 'CSS_DECLARATIONS';
              if (stylesheet) for (const file of declaredStudentFonts(bytes.toString('utf8'))) declaredFonts.add(file);
              const urlSha256 = sha256(url.href), responseSha256 = sha256(bytes);
              const resourceId = sha256(stable({ urlSha256, responseSha256, mime: contentType }));
              externalFontResources.set(resourceId, { resourceId, kind: stylesheet ? 'STYLESHEET' : 'FONT', host: url.hostname, urlSha256,
                status: response.status(), mime: contentType, sha256: responseSha256, bytes: bytes.length });
              fontResources.add(resourceId);
              return route.fulfill({ response });
            } catch (error) {
              failures.push(fontFailureDiagnostic(fontObservation, error));
              return route.abort('failed');
            }
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
        });
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
              face.status === 'loaded' && face.family.replace(/["']/g, '') === family), checked: document.fonts.check(`${weight} 12px "${family}"`, '한글 ABC 123') });
          }
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { status: document.fonts.status, family, weights,
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content')].map(node => getComputedStyle(node).fontFamily))] };
        }, FONT_FAMILY);
        assert.equal(fontReadiness.status, 'loaded', 'UI_DOCUMENT_FONTS_READY');
        assert(fontReadiness.weights.every(row => row.allLoaded && row.checked), 'UI_STUDENT_FONT_NOT_LOADED');
        assert(fontReadiness.problemFontFamilies.length > 0 && fontReadiness.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_STUDENT_FONT_NOT_APPLIED');
        assert([...fontResources].some(key => externalFontResources.get(key)?.kind === 'STYLESHEET') &&
          [...fontResources].some(key => externalFontResources.get(key)?.kind === 'FONT'), 'UI_FONT_RESPONSES_REQUIRED');
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
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontResources].sort() }, geometry, capture,
            visualReview: 'PENDING', pageErrors, requestFailures, externalRequests });
          activeCase = null;
        }
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
      } finally { await context.close(); }
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
    path.isAbsolute(args[1]) && !/[\x00-\x1f\x7f]/.test(args[1]), 'UI_Q22_ARGUMENTS');
  const root = process.cwd(), out = checkedOutput(root, args[1]);
  const reader = createGitReader(root), checkout = checkoutEvidence(reader.commit);
  const proof = await inspectStudentUi({ root, out, expectedCommit: checkout.expectedCheckoutCommit,
    githubEventCommit: checkout.githubEventCommit, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, logicalCases: proof.results.length,
    screenshotArtifacts: proof.screenshotArtifactCount, checkoutCommit: proof.checkoutCommit,
    parentRestorationApproval: false, releaseGate: proof.releaseGate }));
}
module.exports = { MANIFEST_PATH, CHECKER_PATH, SHARED_CHECKER_PATH, SHARED_CHECKER_SHA256, IDENTITY_PATH, SCHEMA,
  EXPECTED_ITEM, VIEWPORTS, validateManifest, checkoutEvidence, preflight, assertTechnicalState, assertCompletedResults, checkedOutput };
if (require.main === module) main().catch(error => {
  const message = String(error?.message || ''), code = message.split('\n')[0];
  console.error(JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL', parentRestorationApproval: false,
    releaseGate: 'PENDING_ACTUAL_STUDENT_UI', failureCode: /^UI_[A-Z0-9_]+$/.test(code) ? code : 'UI_Q22_PREFLIGHT_FAILED',
    errorMessageSha256: sha256(message) }));
  process.exitCode = 1;
});
