'use strict';

// Closed display-only checks for one existing E017 solution renderer. No approval is issued.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const { stable, sha256, gitBlob, createGitReader, studentFontResourcePath, checkedStudentFontRefs, FONT_DIR, FONT_STYLESHEET,
  fontFailureDiagnostic, readScreenshotArtifacts, assertScreenshotInventory } = H;
const { captureSolutionTiles, makeE017CaptionAbsencePolicy, makeE017CaptionAssetTransport, assertE017CaptionObservation } = require("./check-m2s1-solution-scroll.cjs");

const CHECKER_PATH='tools/check-e017-solution-display-browser.cjs';
const SHARED_CHECKER_PATH='tools/check-reviewed-problem-renderer-browser.cjs';
const SOLUTION_CHECKER_PATH='tools/check-m2s1-solution-scroll.cjs';
const SHARED_CHECKER_SHA256='e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const SOLUTION_CHECKER_SHA256='5ac51ffc469444e3e13449980d2820d19924563e50de08409ac47678a6c19d80';
const IDENTITY_PATH='archive/data/question_identity_map.json';
const SCHEMA='archive-e017-solution-display-raw-ui-v1',FONT_FAMILY='Nanum Myeongjo';
const SHA1=/^[a-f0-9]{40}$/;
const SPECS=Object.freeze({SOLUTION:{path:'tests/fixtures/archive-e017-solution-display-ui.json',hash:'966de71fcb4089b09fedb204918f6b2f72c80e0fa54a53313fcb69e727f929b3',count:1,cases:1,mode:'sol'}});
const FIELDS={SOLUTION:['solution','explanation','sol','solutionImage','solutionImages','solutionFigureSvg','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageLayoutTag']};
const selectOwn=(q,s)=>Object.fromEntries(FIELDS[s].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
function validateManifest(m){
 assert(m && Object.hasOwn(SPECS,m.surface),'UI_DISPLAY_SURFACE');
 const s=SPECS[m.surface];
 assert.equal(sha256(stable(m)),s.hash,'UI_EXACT_CLOSED_MANIFEST');
 assert.equal(m.items.length,s.count,'UI_SELECTED_COUNT');
 assert.equal(m.expectedCases,s.cases,'UI_CASE_COUNT');
 assert.equal(m.mode,s.mode,'UI_MANIFEST_MODE');
 assert.equal(new Set(m.items.map(x=>x.questionUid)).size,s.count,'UI_UNIQUE_SELECTED_UIDS');
 return m;
}
function assertFinalBinding(manifest){
 assert.equal(manifest.bindingPhase,'FINAL_PUBLIC_SOURCE_BINDING','UI_FINAL_PUBLIC_BINDING_REQUIRED');
 return manifest;
}
function checkoutEvidence(actualCommit,env=process.env){
 const expectedCommit=env.ARCHIVE_E017_SOLUTION_UI_EXPECTED_SHA;
 assert(typeof expectedCommit==='string'&&SHA1.test(expectedCommit),'UI_EXPECTED_CHECKOUT_REQUIRED');
 assert.equal(actualCommit,expectedCommit,'UI_CHECKOUT_MISMATCH');
 assert(env.GITHUB_SHA===undefined || SHA1.test(env.GITHUB_SHA),'UI_EVENT_SHA');
 return {expectedCheckoutCommit:expectedCommit,actualCheckoutCommit:actualCommit,githubEventCommit:env.GITHUB_SHA??null};
}
function loadQuestions(bytes){
 const sandbox={window:{}};
 vm.runInNewContext(bytes.toString('utf8'),sandbox,{timeout:1500,filename:'selected-source.js',contextCodeGeneration:{strings:false,wasm:false}});
 const bank=sandbox.window.questionBank??sandbox.questionBank??sandbox.window.examData?.questions??sandbox.examData?.questions;
 assert(Array.isArray(bank),'UI_BANK_REQUIRED');return JSON.parse(JSON.stringify(bank));
}
function preflight(reader,manifest){
 validateManifest(manifest);
 const identityBytes=reader.read(IDENTITY_PATH),identity=JSON.parse(identityBytes);assert(Array.isArray(identity.records),'UI_IDENTITY_RECORDS');
 const banks=new Map(),items=manifest.items.map(item=>{
  if(!banks.has(item.sourcePath)){const bytes=reader.read(item.sourcePath);banks.set(item.sourcePath,{bytes,questions:loadQuestions(bytes)});}
  const {bytes,questions}=banks.get(item.sourcePath);
  assert.equal(gitBlob(bytes),item.sourceGitBlobSha1,'UI_SOURCE_GIT_DRIFT');assert.equal(sha256(bytes),item.sourceSha256,'UI_SOURCE_RAW_DRIFT');
  assert.equal(questions.length,item.expectedBankCount,'UI_BANK_COUNT');
  const q=questions[item.sourceOrdinal-1];assert(q&&String(q.id??q.number)===String(item.sourceOrdinal),'UI_ORDINAL');
  assert.equal(sha256(stable(q)),item.questionSha256,'UI_WHOLE_QUESTION_DRIFT');
  const payload=selectOwn(q,manifest.surface);assert.equal(sha256(stable(payload)),item.surfacePayloadSha256,'UI_SURFACE_PAYLOAD_DRIFT');
  const assetRefs=item.assets.map(a=>{const b=reader.read(a.path);assert.equal(gitBlob(b),a.gitBlobSha1,'UI_ASSET_GIT_DRIFT');assert.equal(sha256(b),a.sha256,'UI_ASSET_RAW_DRIFT');assert.equal(b.length,a.bytes,'UI_ASSET_BYTES_DRIFT');
   assert(stable(payload).includes(a.path.slice('archive/'.length)),'UI_SURFACE_ASSET_POINTER');return reader.ref(a.path,b);});
  assert.equal(assetRefs.length,1,'UI_EXACT_ONE_DISPLAY_IMAGE');
  const match=identity.records.filter(x=>x.sourceArchiveFile===item.sourcePath.slice('archive/exams/'.length)&&Number(x.sourceOrdinal)===item.sourceOrdinal);
  assert.equal(match.length,1,'UI_UNIQUE_IDENTITY');assert.equal(match[0].questionUid,item.questionUid,'UI_IDENTITY_UID');
  return {...item,sourceRef:reader.ref(item.sourcePath,bytes),assetRef:assetRefs[0],assetRefs};
 });return {identityRef:reader.ref(IDENTITY_PATH,identityBytes),items};
}
function assertTechnicalState(t,mode,count){
 assert.equal(t.mode,mode,'UI_RENDER_MODE');assert.equal(t.questions,count,'UI_RENDERED_BANK_COUNT');assert.equal(t.readiness,'RENDER_READY','UI_RENDER_READY');
 assert(t.pages>0&&t.imagesComplete===true,'UI_RENDERED_IMAGES');assert.equal(t.mathErrors,0,'UI_MATH_ERRORS');assert.equal(t.unrenderedMath,0,'UI_UNRENDERED_MATH');assert.equal(t.mathJaxSource,'local','UI_LOCAL_MATHJAX');
 assert.equal(mode,'sol','UI_SOLUTION_MODE_ONLY');assert(t.solutionNodes>0,'UI_SOLUTION_REQUIRED');
}
function assertCompletedResults(results,inputs,manifest,artifacts){
 validateManifest(manifest);assert.equal(results.length,manifest.expectedCases,'UI_ALL_LOGICAL_CASES');
 const expected=new Map(manifest.items.flatMap(i=>manifest.viewports.map(v=>[i.key+':'+v.name,{i,v}])));const seen=new Set();
 for(const row of results){const key=row.key+':'+row.viewport.name,b=expected.get(key);assert(b&&!seen.has(key),'UI_UNIQUE_REQUIRED_CASE');seen.add(key);
  const item=inputs.items.find(x=>x.key===row.key);assert(row.status==='PASS'&&row.visualReview==='PENDING'&&row.questionUid===item.questionUid&&row.sourceOrdinal===item.sourceOrdinal,'UI_RESULT_TARGET');
  assert.equal(row.surface,manifest.surface,'UI_RESULT_SURFACE');assert.equal(row.mode,manifest.mode,'UI_RESULT_MODE');assert.deepEqual(row.viewport,b.v,'UI_EXACT_VIEWPORT');
  assert.deepEqual(row.sourceRef,item.sourceRef,'UI_RESULT_SOURCE');assert.deepEqual(row.assetRefs,item.assetRefs,'UI_RESULT_ASSETS');
  assertTechnicalState(row.technical,manifest.mode,item.expectedBankCount);
  assertE017CaptionObservation(row.captionAbsenceObservation);
  assert.deepEqual(row.captionAbsenceObservation.imageTransport.assetRef,item.assetRef,'UI_RESULT_CAPTION_TRANSPORT_ASSET');
  const c=row.capture;assert.equal(c.schemaVersion,'archive-solution-scroll-coverage-v1','UI_CAPTURE_SCHEMA');
  assert(c.method==='UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES'&&c.overlapCssPixels===32&&c.tileLimit===8&&c.cssWrites===0&&c.domWrites===0&&c.viewportChanges===0&&c.compositeImageCreated===false&&c.feedbackIdle===true&&c.foreignContentHits===0,'UI_UNCHANGED_CAPTURE_REQUIRED');
  assert.deepEqual(c.coverage,H.assertTileCoverage(c.content.height,c.tiles),'UI_COMPLETE_COVERAGE');
 }
 assert.equal(seen.size,expected.size,'UI_CASE_INVENTORY');return assertScreenshotInventory(results,artifacts);
}
function checkedOutput(root, out) {
  root = path.resolve(root); out = path.resolve(out);
  assert(out !== root && !out.startsWith(root + path.sep), 'UI_E017_OUTPUT_OUTSIDE_CHECKOUT');
  for (let current = out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'UI_E017_OUTPUT_SYMLINK');
  assert(!fs.existsSync(out) || fs.readdirSync(out).length === 0, 'UI_E017_EMPTY_OUTPUT_REQUIRED');
  return out;
}

const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath, githubEventCommit = null }) {
  const surface = 'SOLUTION';
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  assert(SHA1.test(expectedCommit), 'UI_E017_EXPECTED_CHECKOUT_REQUIRED');
  assert(Object.hasOwn(SPECS,surface), "UI_DISPLAY_SURFACE");
  const spec=SPECS[surface],MANIFEST_PATH=spec.path;
  const reader = createGitReader(root, expectedCommit);
  const captureHelperRef = reader.ref(SHARED_CHECKER_PATH);
  assert.equal(captureHelperRef.sha256, SHARED_CHECKER_SHA256, 'UI_E017_CAPTURE_HELPER_CHANGED');
  const solutionCaptureHelperRef = reader.ref(SOLUTION_CHECKER_PATH);
  assert.equal(solutionCaptureHelperRef.sha256, SOLUTION_CHECKER_SHA256, 'UI_E017_SOLUTION_CAPTURE_HELPER_CHANGED');
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.surface,surface,"UI_SELECTED_SURFACE");
  assertFinalBinding(manifest);
  const inputs = preflight(reader, manifest);
  const captionAbsencePolicy=makeE017CaptionAbsencePolicy(reader,inputs.items[0],loadQuestions);
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [];
  let activeCase = null, captureDiagnostic = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef, solutionCaptureHelperRef, ...inputs,
    checkout: { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: reader.commit, githubEventCommit },
    parentRestorationApproval: false, releaseGate: 'PENDING_INDEPENDENT_VISUAL_REVIEW',
    surface, mode: manifest.mode, studentReview: true, screenshotsScope: 'SELECTED_OWN_SURFACE_ORIGINAL_SCROLL_TILES', problemOnlyScreenshots: false,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: true, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef, captionAbsenceBinding:captionAbsencePolicy,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertCompletedResults(results, inputs, manifest, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase, captureDiagnostic } : {}), expectedLogicalCases: manifest.expectedCases,
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
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=${manifest.mode}&fit=screen&studentReview=1`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForFunction(expectedMode => {
          const readiness = JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}');
          return readiness.state === 'RENDER_READY' && typeof AppState !== 'undefined' && AppState.mode === expectedMode && AppState.data.length > 0;
        }, manifest.mode, { timeout: 40000 });
        const fontReadiness = await page.evaluate(async ({family,selector}) => {
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
            problemFontFamilies: [...new Set([...document.querySelectorAll(selector)].map(node => getComputedStyle(node).fontFamily))] };
        }, {family:FONT_FAMILY,selector:'#print-area .sol-exp'});
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
        assertTechnicalState(technical,manifest.mode,inputs.items.find(x=>x.sourceRef.path===sourcePath).expectedBankCount);
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name, surface, mode:manifest.mode };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," sol-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_SOLUTION_BOX');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const imageTransport=makeE017CaptionAssetTransport(captionAbsencePolicy,{
            imageUrl:await target.evaluate(image=>image.currentSrc||image.src),origin,
            servedRefs:[...served.values()],mirroredRefs:[...mirrored.values()]});
          const {captionAbsenceObservation,...capture}=await captureSolutionTiles(page,target,path.join(out,screenshotPath),captionAbsencePolicy,imageTransport);
          const geometry = await target.evaluate(image => {
            const box = image.closest('.sol-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth > 0 && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber || '').match(/^\d+/)?.[0]), item.sourceOrdinal, 'UI_VISIBLE_ORDINAL');
          const screenshots = capture.tiles.map(tile => { const bytes = fs.readFileSync(path.join(out, tile.filename));
            return { tileIndex: tile.tileIndex, path: tile.filename, sha256: sha256(bytes), bytes: bytes.length }; });
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport, surface, mode:manifest.mode,
            sourceRef: item.sourceRef, assetRef: item.assetRef, assetRefs:item.assetRefs, screenshots,
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontState.fontResources.values()].sort() }, geometry, capture, captionAbsenceObservation,
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
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, proofBase.solutionCaptureHelperRef, inputs.identityRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
      assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
    }
    return writeProof('TECHNICAL_PASS_VISUAL_REVIEW_PENDING');
  } catch (error) {
    captureDiagnostic=error.captureDiagnostic??null;
    writeProof('FAIL', /^UI_[A-Z0-9_]+$/.test(error.message) ? error.message : 'UI_BROWSER_CHECK_FAILED');
    throw error;
  } finally {
    clearTimeout(watchdog);
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}

async function main(){
 const args=process.argv.slice(2);assert(args.length===2&&args[0]==='--output'&&path.isAbsolute(args[1]),'UI_ARGUMENTS');
 const root=process.cwd(),out=checkedOutput(root,args[1]),reader=createGitReader(root),checkout=checkoutEvidence(reader.commit);
 const p=await inspectStudentUi({root,out,expectedCommit:checkout.expectedCheckoutCommit,githubEventCommit:checkout.githubEventCommit,executablePath:process.env.CHROME_BIN});
 console.log(JSON.stringify({status:p.status,surface:p.surface,logicalCases:p.completedLogicalCases,screenshotArtifacts:p.screenshotArtifactCount,checkoutCommit:p.checkoutCommit,newApprovals:0}));
}
module.exports={SPECS,FIELDS,assertFinalBinding,validateManifest,checkoutEvidence,loadQuestions,preflight,assertTechnicalState,assertCompletedResults,checkedOutput};
if(require.main===module)main().catch(error=>{console.error(JSON.stringify({schemaVersion:SCHEMA,status:'FAIL',failureCode:/^UI_[A-Z0-9_]+$/.test(error.message)?error.message:'UI_DISPLAY_CHECK_FAILED',errorMessageSha256:sha256(error.message||'')}));process.exitCode=1;});
