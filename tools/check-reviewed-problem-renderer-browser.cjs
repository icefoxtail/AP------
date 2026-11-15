'use strict';

// This checker records problem-only student UI evidence. It never grants a
// mathematical, metadata, difficulty, REVIEW2, or four-slot approval.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const MANIFEST_PATH = 'tests/fixtures/archive-reviewed-problem-renderer-ui3.json';
const CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const TEST_PATH = 'tests/archive-problem-renderer-ui-contract.test.js';
const WORKFLOW_PATH = '.github/workflows/archive2-runtime-guard.yml';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-problem-renderer-student-ui-preview-v1';
const FONT_FAMILY = 'Nanum Myeongjo';
const EXPECTED_KEYS = ['E005-Q12', 'E006-Q21', 'E006-Q3'];
const SHA256 = /^[a-f0-9]{64}$/;
const SHA1 = /^[a-f0-9]{40}$/;
const stable = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const ownKeys = (value, expected, code) => {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), expected.slice().sort(), code);
};
const relativePath = value => typeof value === 'string' && value.length > 0 && !value.includes('\\') &&
  !value.includes('\0') && !path.posix.isAbsolute(value) && path.posix.normalize(value) === value &&
  !value.split('/').some(part => part === '.' || part === '..');

function isStudentFontStylesheet(value) {
  const url = new URL(value);
  return url.origin === 'https://fonts.googleapis.com' && url.pathname === '/css2' && !url.hash &&
    [...url.searchParams.keys()].sort().join(',') === 'display,family' && url.searchParams.get('display') === 'swap' &&
    url.searchParams.get('family') === 'Nanum Myeongjo:wght@400;700;800';
}

function declaredStudentFonts(css) {
  assert(!/@import\b/i.test(css), 'UI_NESTED_FONT_IMPORT');
  const urls = [...css.matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/gi)].map(match => match[2]);
  assert(urls.length > 0, 'UI_FONT_URLS_REQUIRED');
  assert.equal((css.match(/url\(/gi) || []).length, urls.length, 'UI_FONT_URL_SYNTAX');
  for (const value of urls) {
    const url = new URL(value);
    // The observed Korean subset files add one canonical numeric suffix, 0..119,
    // before .woff2. Other suffix shapes remain outside this declared family.
    assert(url.origin === 'https://fonts.gstatic.com' && /^\/s\/nanummyeongjo\/[A-Za-z0-9/_-]+\.(?:woff2?|ttf|(?:[0-9]|[1-9][0-9]|1[01][0-9])\.woff2)$/.test(url.pathname) && !url.search && !url.hash,
      'UI_FONT_URL_OUTSIDE_DECLARED_FAMILY');
  }
  assert(/font-family:\s*['"]Nanum Myeongjo['"]/i.test(css), 'UI_FONT_FAMILY_REQUIRED');
  for (const weight of [400, 700, 800]) assert(new RegExp(`font-weight:\\s*${weight}\\s*;`).test(css), 'UI_FONT_WEIGHT_REQUIRED');
  return new Set(urls);
}

function fontFailureDiagnostic(observation, error) {
  const message = typeof error?.message === 'string' ? error.message : '';
  const code = message.split('\n')[0];
  const knownCodes = ['UI_FONT_HTTP_STATUS', 'UI_FONT_REDIRECT', 'UI_FONT_MIME', 'UI_FONT_BODY_SIZE',
    'UI_NESTED_FONT_IMPORT', 'UI_FONT_URLS_REQUIRED', 'UI_FONT_URL_SYNTAX', 'UI_FONT_URL_OUTSIDE_DECLARED_FAMILY',
    'UI_FONT_FAMILY_REQUIRED', 'UI_FONT_WEIGHT_REQUIRED'];
  return { code: 'UI_STUDENT_FONT_FAILED',
    kind: ['STYLESHEET', 'FONT'].includes(observation.kind) ? observation.kind : 'UNKNOWN',
    urlSha256: SHA256.test(observation.urlSha256 || '') ? observation.urlSha256 : null,
    stage: ['FETCH', 'HTTP_STATUS', 'RESPONSE_URL', 'MIME', 'BODY_READ', 'BODY_SIZE', 'CSS_DECLARATIONS'].includes(observation.stage)
      ? observation.stage : 'UNKNOWN',
    httpStatus: Number.isInteger(observation.httpStatus) && observation.httpStatus >= 100 && observation.httpStatus <= 599 ? observation.httpStatus : null,
    responseUrlSha256: SHA256.test(observation.responseUrlSha256 || '') ? observation.responseUrlSha256 : null,
    mime: typeof observation.mime === 'string' && observation.mime.length <= 128 && /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/.test(observation.mime) ? observation.mime : null,
    bytes: Number.isSafeInteger(observation.bytes) && observation.bytes >= 0 ? observation.bytes : null,
    responseSha256: SHA256.test(observation.responseSha256 || '') ? observation.responseSha256 : null,
    errorName: ['AssertionError', 'Error', 'TimeoutError', 'TypeError', 'SyntaxError'].includes(error?.name) ? error.name : 'OtherError',
    errorCode: knownCodes.includes(code) ? code : 'UNCLASSIFIED_ERROR', errorMessageSha256: sha256(message) };
}

function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'expectedCases', 'viewports', 'items'], 'UI_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-reviewed-problem-renderer-ui-manifest-v1', 'UI_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'PR2188_PROBLEM_RENDERERS_AND_Q3_LABEL_REPAIR_ONLY', 'UI_MANIFEST_SCOPE');
  assert.equal(manifest.expectedCases, 6, 'UI_MANIFEST_CASE_COUNT');
  assert.deepEqual(manifest.viewports, [{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }], 'UI_VIEWPORTS');
  assert(Array.isArray(manifest.items), 'UI_ITEMS');
  assert.deepEqual(manifest.items.map(item => item.key).sort(), EXPECTED_KEYS, 'UI_EXACT_THREE_ITEMS');
  const uids = new Set();
  const locators = new Set();
  for (const item of manifest.items) {
    ownKeys(item, ['key', 'questionUid', 'sourceOrdinal', 'sourcePath', 'problemPayloadSha256', 'presentationSha256', 'assetPath', 'assetSha256'], 'UI_ITEM_KEYS');
    assert(/^qid_v1_[a-f0-9]{64}$/.test(item.questionUid) && !uids.has(item.questionUid), 'UI_UNIQUE_UID');
    uids.add(item.questionUid);
    assert(Number.isInteger(item.sourceOrdinal) && item.sourceOrdinal > 0, 'UI_ORDINAL');
    assert(relativePath(item.sourcePath) && item.sourcePath.startsWith('archive/exams/original/middle/m2/2final/') && item.sourcePath.endsWith('.js'), 'UI_SOURCE_PATH');
    assert(relativePath(item.assetPath) && item.assetPath.startsWith('archive/assets/images/') && item.assetPath.endsWith('.svg'), 'UI_ASSET_PATH');
    const locator = `${item.sourcePath}:${item.sourceOrdinal}`;
    assert(!locators.has(locator), 'UI_UNIQUE_LOCATOR');
    locators.add(locator);
    assert(SHA256.test(item.problemPayloadSha256) && SHA256.test(item.presentationSha256) && SHA256.test(item.assetSha256), 'UI_HASH');
    if (item.key === 'E006-Q3') {
      assert.equal(item.sourceOrdinal, 3, 'UI_Q3_ORDINAL');
      assert.equal(path.posix.basename(item.assetPath), 'q3-problem-visual-v3.svg', 'UI_Q3_REPAIRED_ASSET_REQUIRED');
      assert.equal(item.assetSha256, 'd1d29913cf799c82380e2765ac1648ad9cda6324e421a5418055b779e7ba61c7', 'UI_Q3_REPAIRED_BYTES_REQUIRED');
    }
  }
  assert.equal(new Set(manifest.items.map(item => item.sourcePath)).size, 2, 'UI_TWO_BANKS');
  return manifest;
}

function planRequired(manifest, scope, checkoutCommit) {
  validateManifest(manifest);
  assert(SHA1.test(checkoutCommit), 'UI_CHECKOUT_COMMIT');
  assert.equal(scope.schemaVersion, 'archive-ci-scope-v2', 'UI_SCOPE_SCHEMA');
  assert.equal(scope.headSha, checkoutCommit, 'UI_SCOPE_HEAD');
  assert(scope.changedFiles === null || (Array.isArray(scope.changedFiles) && scope.changedFiles.every(relativePath)), 'UI_CHANGED_FILES');
  const triggers = new Set([MANIFEST_PATH, CHECKER_PATH, TEST_PATH, WORKFLOW_PATH]);
  for (const item of manifest.items) { triggers.add(item.sourcePath); triggers.add(item.assetPath); }
  const repaired = manifest.items.find(item => item.key === 'E006-Q3');
  triggers.add(repaired.assetPath.replace('-v3.svg', '-v2.svg'));
  const matchedPaths = (scope.changedFiles || []).filter(file => triggers.has(file)).sort();
  const required = scope.eventName === 'workflow_dispatch' || scope.changedFiles === null || matchedPaths.length > 0;
  return { schemaVersion: 'archive-reviewed-problem-renderer-ui-plan-v1', checkoutCommit, required, expectedCases: 6,
    reason: scope.eventName === 'workflow_dispatch' ? 'EXPLICIT_DISPATCH' : scope.changedFiles === null ? 'UNKNOWN_DIFF_FAIL_CLOSED' : required ? 'EXACT_TARGET_OR_CHECKER_CHANGED' : 'TARGETS_UNCHANGED',
    matchedPaths, triggerPaths: [...triggers].sort() };
}

function createGitReader(root, expectedCommit = '') {
  root = path.resolve(root);
  const git = args => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 30000 });
  const commit = git(['rev-parse', '--verify', 'HEAD']).trim();
  assert(SHA1.test(commit), 'UI_CHECKOUT_COMMIT');
  if (expectedCommit) assert.equal(commit, expectedCommit, 'UI_EVENT_HEAD_MISMATCH');
  const tree = new Map(git(['ls-tree', '-r', '-z', commit]).split('\0').filter(Boolean).map(row => {
    const tab = row.indexOf('\t'), [mode, type, blob] = row.slice(0, tab).split(' ');
    return [row.slice(tab + 1), { mode, type, blob }];
  }));
  const read = rel => {
    assert(relativePath(rel), 'UI_UNSAFE_PATH');
    const entry = tree.get(rel);
    assert(entry && entry.type === 'blob' && ['100644', '100755'].includes(entry.mode), 'UI_TRACKED_FILE_REQUIRED');
    const full = path.join(root, rel);
    assert(fs.lstatSync(full).isFile(), 'UI_REGULAR_FILE_REQUIRED');
    const bytes = fs.readFileSync(full);
    assert.equal(gitBlob(bytes), entry.blob, 'UI_CHECKOUT_BYTES_DRIFT');
    return bytes;
  };
  const ref = (rel, bytes = read(rel)) => ({ commit, path: rel, gitBlobSha1: gitBlob(bytes), sha256: sha256(bytes), bytes: bytes.length });
  return { root, commit, read, ref };
}

function loadQuestions(bytes) {
  const sandbox = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), sandbox, { timeout: 1500, filename: 'reviewed-source.js', contextCodeGeneration: { strings: false, wasm: false } });
  const bank = sandbox.window.questionBank ?? sandbox.questionBank ?? sandbox.window.examData?.questions ?? sandbox.examData?.questions;
  assert(Array.isArray(bank), 'UI_BANK_REQUIRED');
  return bank;
}

function preflight(reader, manifest) {
  validateManifest(manifest);
  const identityBytes = reader.read(IDENTITY_PATH);
  const identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_IDENTITY_RECORDS');
  const banks = new Map();
  const items = manifest.items.map(item => {
    if (!banks.has(item.sourcePath)) {
      const bytes = reader.read(item.sourcePath);
      banks.set(item.sourcePath, { bytes, questions: loadQuestions(bytes) });
    }
    const { bytes, questions } = banks.get(item.sourcePath);
    const question = questions[item.sourceOrdinal - 1];
    assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_QUESTION_ORDINAL_MISMATCH');
    const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
    assert.equal(matched.length, 1, 'UI_UNIQUE_IDENTITY_RECORD');
    assert.equal(matched[0].questionUid, item.questionUid, 'UI_IDENTITY_UID_MISMATCH');
    assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_PROBLEM_PAYLOAD_DRIFT');
    assert.equal(question.image, item.assetPath.slice('archive/'.length), 'UI_IMAGE_POINTER_MISMATCH');
    assert.equal(sha256(stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag })), item.presentationSha256, 'UI_PRESENTATION_DRIFT');
    const asset = reader.read(item.assetPath);
    assert.equal(sha256(asset), item.assetSha256, 'UI_REVIEWED_ASSET_DRIFT');
    return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
      problemPayloadSha256: item.problemPayloadSha256, presentationSha256: item.presentationSha256,
      sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), items };
}

const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const served = new Map(), mirrored = new Map(), externalFontResources = new Map(), failures = [], results = [];
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), ...inputs,
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_Q_BOX_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_STUDENT_GOOGLE_STYLESHEET_AND_ITS_DECLARED_NANUM_MYEONGJO_FILES',
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const proof = { ...proofBase, status, ...(code ? { failureCode: code } : {}), results, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
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
        assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
        assert(technical.pages > 0 && technical.imagesComplete, 'UI_RENDERED_IMAGES');
        assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
        assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
        assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
        assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          await box.scrollIntoViewIfNeeded();
          const geometry = await target.evaluate(image => {
            const box = image.closest('.q-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth > 0 && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber || '').match(/^\d+/)?.[0]), item.sourceOrdinal, 'UI_VISIBLE_ORDINAL');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          await box.screenshot({ path: path.join(out, screenshotPath), animations: 'disabled', timeout: 15000 });
          const screenshot = fs.readFileSync(path.join(out, screenshotPath));
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
            sourceRef: item.sourceRef, assetRef: item.assetRef, screenshot: { path: screenshotPath, sha256: sha256(screenshot), bytes: screenshot.length },
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontResources].sort() }, geometry,
            visualReview: 'PENDING', pageErrors, requestFailures, externalRequests });
        }
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
      } finally { await context.close(); }
    }
    assert.equal(results.length, manifest.expectedCases, 'UI_ALL_SIX_REQUIRED');
    assert.equal(new Set(results.map(row => `${row.key}:${row.viewport.name}`)).size, 6, 'UI_UNIQUE_SIX_REQUIRED');
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, inputs.identityRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
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
  const args = process.argv.slice(2), get = flag => { const index = args.indexOf(flag); return index < 0 ? '' : args[index + 1]; };
  const root = process.cwd(), expectedCommit = process.env.GITHUB_SHA || '';
  if (args.includes('--plan')) {
    const scopePath = get('--scope'), output = get('--output');
    assert(scopePath && output, 'UI_PLAN_ARGUMENTS');
    const reader = createGitReader(root, expectedCommit), manifest = JSON.parse(reader.read(MANIFEST_PATH));
    const scopeModule = await import('./ci/archive-ci-scope.mjs');
    const scope = scopeModule.readScope(scopePath, root);
    const plan = planRequired(manifest, scope, reader.commit);
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(plan, null, 2) + '\n');
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `required=${plan.required}\n`);
    console.log(JSON.stringify(plan));
    return;
  }
  const out = get('--output');
  assert(out, 'UI_OUTPUT_REQUIRED');
  assert(!path.resolve(out).startsWith(path.resolve(root) + path.sep), 'UI_OUTPUT_OUTSIDE_CHECKOUT_REQUIRED');
  const proof = await inspectStudentUi({ root, out: path.resolve(out), expectedCommit, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, cases: proof.results.length, checkoutCommit: proof.checkoutCommit }));
}

module.exports = { MANIFEST_PATH, CHECKER_PATH, TEST_PATH, WORKFLOW_PATH, IDENTITY_PATH, SCHEMA, stable, sha256, gitBlob, validateManifest, planRequired, createGitReader, preflight,
  isStudentFontStylesheet, declaredStudentFonts, fontFailureDiagnostic };
if (require.main === module) main().catch(error => {
  const args = process.argv.slice(2), index = args.indexOf('--output');
  if (!args.includes('--plan') && index >= 0 && args[index + 1]) {
    const out = path.resolve(args[index + 1]);
    if (out !== process.cwd() && !out.startsWith(process.cwd() + path.sep)) {
      fs.mkdirSync(out, { recursive: true });
      const file = path.join(out, 'technical-proof.json');
      if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL',
        failureCode: /^UI_[A-Z0-9_]+$/.test(error.message) ? error.message : 'UI_PREFLIGHT_FAILED', results: [] }, null, 2) + '\n');
    }
  }
  console.error('UI_PROBLEM_RENDERER_VERIFICATION_FAILED'); process.exitCode = 1;
});
