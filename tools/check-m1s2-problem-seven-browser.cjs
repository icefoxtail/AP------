'use strict';
// Closed seven-item GitHub Actions Chromium producer. Exact student engine and
// standard capture/font/lifecycle functions are reused. PR provenance is explicit.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const H=require('./check-reviewed-problem-renderer-browser.cjs');
const Surface=require('./capture-m1s2-problem-surface.cjs');
const {stable,sha256,gitBlob,createGitReader,checkedStudentFontRefs,studentFontResourcePath,createStudentRouteLifecycle,serveStudentFont,closeStudentContext,captureProblemTiles,readScreenshotArtifacts,assertScreenshotInventory,FONT_DIR,FONT_STYLESHEET}=H;
const BASE_COMMIT='a66a389b96525f67e2868a000184039e08627e9f';
const SURFACE_PATH='tools/capture-m1s2-problem-surface.cjs';
const MANIFEST_PATH='tests/fixtures/archive-m1s2-problem-seven-ui.json',CHECKER_PATH='tools/check-m1s2-problem-seven-browser.cjs',SHARED_CHECKER_PATH='tools/check-reviewed-problem-renderer-browser.cjs';
const MANIFEST_SHA='4047f77afefb607509904559a9a166b41a1dc85af849434963172ba7217617e6',CAPTURE_SHA='e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673',IDENTITY_PATH='archive/data/question_identity_map.json';
const SCHEMA='archive-m1s2-problem-seven-github-ui-raw-v1',FONT_FAMILY='Nanum Myeongjo';
const EXPECTED_UIDS=["qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140","qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15","qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e","qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3","qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6","qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c","qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246"];
function validateManifest(m){assert.equal(sha256(stable(m)),MANIFEST_SHA,'UI_CLOSED_MANIFEST');assert.equal(m.expectedCases,14,'UI_CASES');assert.deepEqual(m.items.map(r=>r.questionUid),EXPECTED_UIDS,'UI_EXACT_SEVEN');return m;}
function loadQuestions(bytes){const s={window:{}};vm.runInNewContext(bytes.toString('utf8'),s,{timeout:1500,filename:'selected-source.js',contextCodeGeneration:{strings:false,wasm:false}});const b=s.window.questionBank??s.questionBank??s.window.examData?.questions??s.examData?.questions;assert(Array.isArray(b),'UI_BANK_REQUIRED');return JSON.parse(JSON.stringify(b));}
const mime=rel=>({'.js':'text/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'}[path.extname(rel)]||'application/octet-stream');
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
    assert.equal(gitBlob(bytes),item.sourceGitBlobSha1,'UI_SOURCE_GIT_DRIFT');assert.equal(sha256(bytes),item.sourceSha256,'UI_SOURCE_RAW_DRIFT');assert.equal(bytes.length,item.sourceBytes,'UI_SOURCE_SIZE_DRIFT');assert.equal(questions.length,item.expectedBankCount,'UI_BANK_COUNT');
    const question = questions[item.sourceOrdinal - 1];
    assert.equal(sha256(stable(question)),item.questionSha256,'UI_WHOLE_QUESTION_DRIFT');
    assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_QUESTION_ORDINAL_MISMATCH');
    const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
    assert.equal(matched.length, 1, 'UI_UNIQUE_IDENTITY_RECORD');
    assert.equal(matched[0].questionUid, item.questionUid, 'UI_IDENTITY_UID_MISMATCH');
    assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_PROBLEM_PAYLOAD_DRIFT');
    assert.equal(question.image, item.assetPath.slice('archive/'.length), 'UI_IMAGE_POINTER_MISMATCH');
    assert.equal(sha256(stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag })), item.presentationSha256, 'UI_PRESENTATION_DRIFT');
    const asset = reader.read(item.assetPath);
    assert.equal(sha256(asset), item.assetSha256, 'UI_REVIEWED_ASSET_DRIFT');assert.equal(gitBlob(asset),item.assetGitBlobSha1,'UI_ASSET_GIT_DRIFT');assert.equal(asset.length,item.assetBytes,'UI_ASSET_SIZE_DRIFT');
    return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
      questionSha256:item.questionSha256, problemPayloadSha256: item.problemPayloadSha256, presentationSha256: item.presentationSha256,
      sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), items };
}

const OPS_PUSH_REF='refs/heads/ops/middle-protected9-current-renderer-26fc-20261117';
function executionProvenance(expectedCommit,env=process.env,event=null){
  assert.equal(env.GITHUB_ACTIONS,'true','UI_GITHUB_ACTIONS_REQUIRED');
  if(env.GITHUB_EVENT_NAME==='push'){
    const payload=event||JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
    assert(payload&&typeof payload==='object'&&!Array.isArray(payload),'UI_PUSH_PAYLOAD');
    assert.equal(env.GITHUB_REPOSITORY,'icefoxtail/AP------','UI_REPOSITORY');
    assert(payload.repository&&typeof payload.repository==='object'&&!Array.isArray(payload.repository),'UI_PUSH_REPOSITORY');
    assert.equal(payload.repository.full_name,'icefoxtail/AP------','UI_PUSH_REPOSITORY');
    assert.equal(payload.repository.fork,false,'UI_PUSH_FORK');
    assert.equal(env.GITHUB_REF,OPS_PUSH_REF,'UI_PUSH_REF');
    assert.equal(payload.ref,OPS_PUSH_REF,'UI_PUSH_REF');
    assert.equal(payload.deleted,false,'UI_PUSH_DELETED');
    assert(/^[a-f0-9]{40}$/.test(expectedCommit||'')&&/^[a-f0-9]{40}$/.test(env.GITHUB_SHA||''),'UI_HEAD_SHA');
    assert.equal(env.GITHUB_SHA,expectedCommit,'UI_PUSH_HEAD_SHA');
    assert.equal(payload.after,expectedCommit,'UI_PUSH_AFTER');
    assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID||''),'UI_RUN_ID');
    assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT||'')&&Number.isSafeInteger(Number(env.GITHUB_RUN_ATTEMPT)),'UI_RUN_ATTEMPT');
    assert(String(env.GITHUB_WORKFLOW||'').trim()&&/^[A-Za-z0-9_-]+$/.test(env.GITHUB_JOB||''),'UI_WORKFLOW_JOB');
    return{provider:'GITHUB_ACTIONS',eventName:'push',repository:env.GITHUB_REPOSITORY,workflow:env.GITHUB_WORKFLOW,job:env.GITHUB_JOB,
      runId:env.GITHUB_RUN_ID,runAttempt:Number(env.GITHUB_RUN_ATTEMPT),pullRequest:null,headSha:expectedCommit,baseSha:null,eventSha:env.GITHUB_SHA,
      runUrl:'https://github.com/'+env.GITHUB_REPOSITORY+'/actions/runs/'+env.GITHUB_RUN_ID,ref:OPS_PUSH_REF,capturedHead:expectedCommit};
  }
  assert.equal(env.GITHUB_EVENT_NAME,'pull_request','UI_PR_EVENT_REQUIRED');
  assert.equal(env.GITHUB_REPOSITORY,'icefoxtail/AP------','UI_REPOSITORY');
  assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID||''),'UI_RUN_ID');
  assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT||''),'UI_RUN_ATTEMPT');
  assert(String(env.GITHUB_WORKFLOW||'').trim()&&/^[A-Za-z0-9_-]+$/.test(env.GITHUB_JOB||''),'UI_WORKFLOW_JOB');
  assert(/^[a-f0-9]{40}$/.test(expectedCommit||'')&&/^[a-f0-9]{40}$/.test(env.GITHUB_SHA||''),'UI_HEAD_SHA');
  const payload=event||JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
  const pr=payload.pull_request;
  assert(pr&&!pr.head?.repo?.fork&&pr.head?.repo?.full_name===env.GITHUB_REPOSITORY&&pr.base?.repo?.full_name===env.GITHUB_REPOSITORY,'UI_SAME_REPOSITORY_PR');
  assert.equal(pr.head.sha,expectedCommit,'UI_EXACT_PR_HEAD');
  assert(Number.isSafeInteger(payload.number)&&payload.number>0&&/^[a-f0-9]{40}$/.test(pr.base.sha||''),'UI_PR_IDENTITY');
  return{provider:'GITHUB_ACTIONS',eventName:'pull_request',repository:env.GITHUB_REPOSITORY,workflow:env.GITHUB_WORKFLOW,job:env.GITHUB_JOB,
    runId:env.GITHUB_RUN_ID,runAttempt:Number(env.GITHUB_RUN_ATTEMPT),pullRequest:payload.number,headSha:expectedCommit,baseSha:pr.base.sha,eventSha:env.GITHUB_SHA,
    runUrl:'https://github.com/'+env.GITHUB_REPOSITORY+'/actions/runs/'+env.GITHUB_RUN_ID};
}
async function inspectStudentUi({ root, out, expectedCommit, executablePath }) {
  const execution=executionProvenance(expectedCommit);
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  if(execution.eventName==='push'){
    assert.equal(reader.commit,execution.capturedHead,'UI_PUSH_CAPTURED_HEAD');
    assert.equal(reader.commit,execution.eventSha,'UI_PUSH_CHECKOUT_SHA');
  }
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  assert.equal(reader.ref(SHARED_CHECKER_PATH).sha256, CAPTURE_SHA, 'UI_CAPTURE_HELPER_DRIFT');
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [], surfaceDiagnostics=[];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: execution.eventName==='push'?'GITHUB_ACTIONS_CHROMIUM_CLOSED_OPS_PUSH_HEAD':'GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD', execution, checkoutCommit: reader.commit, baseCommit: BASE_COMMIT,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef: reader.ref(SHARED_CHECKER_PATH), surfaceHelperRef:reader.ref(SURFACE_PATH), ...inputs,
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertScreenshotInventory(results, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, surfaceDiagnostics, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
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
  const watchdog = setTimeout(() => { writeProof('FAIL', 'UI_TOTAL_TIMEOUT'); process.exit(1); }, 600000);
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
          if (fontPath) {
            return serveStudentFont(route, url, fontPath, fontState);
          }
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
        assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
        assert(technical.pages > 0 && technical.imagesComplete, 'UI_RENDERED_IMAGES');
        assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
        assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
        assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
        assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const measuredSurface=await target.evaluate(Surface.measureM1ProblemCapture);
          surfaceDiagnostics.push({key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,viewport:viewport.name,surface:measuredSurface.surface});
          Surface.assertSurfaceTopology(measuredSurface.surface);
          const {capture,surface:surfaceStructure} = await Surface.captureM1ProblemTiles(page, target, path.join(out, screenshotPath));
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
            sourceRef: item.sourceRef, assetRef: item.assetRef, assetRefs:[item.assetRef], questionSha256:item.questionSha256, surface:'PROBLEM', surfaceStructure, mode:'exam', screenshots,
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
          // Inspect real late failures after route settlement and before teardown.
          // If the case already failed, retain that original failure instead.
          if (casesCompleted) assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
        }, routeLifecycle, caseFailure);
      }
    }
    assert.equal(results.length, manifest.expectedCases, 'UI_ALL_FOURTEEN_REQUIRED');
    assert.equal(new Set(results.map(row => `${row.key}:${row.viewport.name}`)).size, 14, 'UI_UNIQUE_FOURTEEN_REQUIRED');
    assertScreenshotInventory(results, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, proofBase.surfaceHelperRef, inputs.identityRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
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

async function main(){const a=process.argv.slice(2);assert(a.length===4&&a[0]==='--root'&&a[2]==='--output','UI_ARGUMENTS');const root=path.resolve(a[1]),out=path.resolve(a[3]);assert(!out.startsWith(root+path.sep)&&out!==root,'UI_OUTPUT_OUTSIDE_CHECKOUT');assert(!fs.existsSync(out)||fs.readdirSync(out).length===0,'UI_EMPTY_OUTPUT');for(let p=out;p!==path.dirname(p);p=path.dirname(p))if(fs.existsSync(p))assert(!fs.lstatSync(p).isSymbolicLink(),'UI_OUTPUT_SYMLINK');const expectedCommit=process.env.ARCHIVE_M1S2_UI_EXPECTED_SHA;assert(/^[a-f0-9]{40}$/.test(expectedCommit||''),'UI_EXPECTED_COMMIT');const p=await inspectStudentUi({root,out,expectedCommit,executablePath:process.env.CHROME_BIN});console.log(JSON.stringify({status:p.status,cases:p.completedLogicalCases,checkoutCommit:p.checkoutCommit,newApprovals:0}));}
module.exports={validateManifest,preflight,executionProvenance,inspectStudentUi,CAPTURE_SHA,MANIFEST_SHA,BASE_COMMIT};
if(require.main===module)main().catch(e=>{console.error(JSON.stringify({status:'FAIL',failureCode:/^UI_[A-Z0-9_]+$/.test(e.message)?e.message:'UI_GITHUB_CHROME_FAILED',errorMessageSha256:sha256(e.message||'')}));process.exitCode=1;});
