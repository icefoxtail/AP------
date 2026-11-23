'use strict';
// One existing M3S2 problem, original problem-only tiles; no source overlay or new mathematical approval.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const H=require('./check-reviewed-problem-renderer-browser.cjs');
const {stable,sha256,gitBlob,createGitReader,FONT_DIR,FONT_STYLESHEET,studentFontResourcePath,checkedStudentFontRefs,
 createStudentRouteLifecycle,serveStudentFont,closeStudentContext,captureProblemTiles,readScreenshotArtifacts,assertScreenshotInventory}=H;
const MANIFEST_PATH="tests/fixtures/archive-m3s2-q16-layout-ui.json",CHECKER_PATH="tools/check-m3s2-q16-layout-browser.cjs",SHARED_CHECKER_PATH='tools/check-reviewed-problem-renderer-browser.cjs';
const SHARED_CHECKER_SHA256='e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const MANIFEST_SHA256="3b7c83afb819bb683d356fdfc142cdf59d86e9c570a49cc4d98c0d05ca87efbc",SCHEMA='archive-m3s2-q16-layout-raw-ui-v2',FONT_FAMILY='Nanum Myeongjo';
const METADATA_PATH='archive/data/question_metadata.json',IDENTITY_PATH='archive/data/question_identity_map.json',SHA1=/^[a-f0-9]{40}$/;
const FIELDS=["content","question","choices","image","images","figureSvg","svg","imageAlt","imageSize","layoutTag"];
function validateManifest(m){assert.equal(sha256(stable(m)),MANIFEST_SHA256,'UI_EXACT_Q16_MANIFEST');return m;}
function loadQuestions(bytes){const c={window:{},console:{log(){},warn(){},error(){}}};c.globalThis=c;vm.createContext(c,{codeGeneration:{strings:false,wasm:false}});vm.runInContext(String(bytes),c,{timeout:1500});const b=c.window.questionBank||c.window.questions||c.questionBank||c.questions||c.window.examData?.questions;assert(Array.isArray(b),'UI_BANK_REQUIRED');return JSON.parse(JSON.stringify(b));}
function selectedDataHash(records,uid,source,ordinal,expectedHash){
 assert(Array.isArray(records),'UI_DATA_RECORDS');const rows=records.filter(row=>row.questionUid===uid);assert.equal(rows.length,1,'UI_UNIQUE_SELECTED_DATA');const row=rows[0];assert.equal(row.sourceArchiveFile,source,'UI_SELECTED_DATA_SOURCE');assert.equal(row.sourceOrdinal,ordinal,'UI_SELECTED_DATA_ORDINAL');const digest=sha256(stable(row));assert.equal(digest,expectedHash,'UI_SELECTED_DATA_CHANGED');return digest;
}
function preflight(reader,m){
 validateManifest(m);const metadataBytes=reader.read(METADATA_PATH),metadata=JSON.parse(metadataBytes),identityBytes=reader.read(IDENTITY_PATH),identity=JSON.parse(identityBytes);const target=m.items[0],source=target.sourcePath.slice('archive/exams/'.length);const selectedDataProjections={schemaVersion:'archive-m3s2-q16-ui-data-projection-v1',questionUid:target.questionUid,sourceArchiveFile:source,sourceOrdinal:16,metadataSha256:selectedDataHash(metadata.records,target.questionUid,source,16,'a83412669da7333bbafb2ffb13a570bde073f150d218d64da25e8a881bc10b92'),identitySha256:selectedDataHash(identity.records,target.questionUid,source,16,'14e7993098a77babf53ee0b1036537579b85c3b27fb194204630f0ab174d3e55')};
 const items=m.items.map(item=>{const bytes=reader.read(item.sourcePath),bank=loadQuestions(bytes),q=bank[item.sourceOrdinal-1];
  assert.equal(gitBlob(bytes),item.sourceGitBlobSha1,'UI_SOURCE_GIT_DRIFT');assert.equal(sha256(bytes),item.sourceSha256,'UI_SOURCE_RAW_DRIFT');
  assert.equal(bank.length,24,'UI_BANK_COUNT');assert(q&&String(q.id??q.number)==='16','UI_ORDINAL');assert.equal(sha256(stable(q)),item.questionSha256,'UI_WHOLE_QUESTION_DRIFT');
  const payload=Object.fromEntries(FIELDS.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));assert.equal(sha256(stable(payload)),item.problemPayloadSha256,'UI_PROBLEM_PAYLOAD_DRIFT');
  assert.equal(q.choices.length,5,'UI_EXACT_CHOICES');assert.equal(item.assets.length,0,'UI_HTML_ONLY');
  assert(!/(?:assets\/|<\s*(?:img|svg|object|iframe|canvas)\b|\bsrcset\s*=|data:image\/)/i.test(stable(payload)),'UI_NO_PROBLEM_ASSET');
  const ids=identity.records.filter(x=>x.sourceArchiveFile===item.sourcePath.slice('archive/exams/'.length)&&Number(x.sourceOrdinal)===16);
  assert.equal(ids.length,1,'UI_UNIQUE_IDENTITY');assert.equal(ids[0].questionUid,item.questionUid,'UI_IDENTITY_UID');
  return {...item,sourceRef:reader.ref(item.sourcePath,bytes),assetRefs:[]};});
 return {metadataRef:reader.ref(METADATA_PATH,metadataBytes),identityRef:reader.ref(IDENTITY_PATH,identityBytes),selectedDataProjections,items};
}
function checkoutEvidence(actualCommit,env=process.env){
 const expected=env.ARCHIVE_M3S2_LAYOUT_UI_EXPECTED_SHA;assert(SHA1.test(expected||''),'UI_EXPECTED_CHECKOUT_REQUIRED');assert.equal(actualCommit,expected,'UI_CHECKOUT_MISMATCH');
 if(env.GITHUB_ACTIONS==='true'){
  const reviewPush=env.GITHUB_EVENT_NAME==='push';
  assert(env.GITHUB_EVENT_NAME==='pull_request'||reviewPush,'UI_ACTIONS_EVENT_REQUIRED');
  if(reviewPush)assert.equal(env.GITHUB_REF,'refs/heads/ops/middle-protected9-current-renderer-26fc-20261117','UI_ACTIONS_REVIEW_BRANCH');
  assert.equal(env.GITHUB_REPOSITORY,'icefoxtail/AP------','UI_ACTIONS_REPOSITORY');assert(SHA1.test(env.GITHUB_SHA||''),'UI_ACTIONS_EVENT_COMMIT');
  assert(path.isAbsolute(env.GITHUB_EVENT_PATH||'')&&fs.statSync(env.GITHUB_EVENT_PATH).isFile(),'UI_ACTIONS_EVENT_FILE');const event=JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
  if(reviewPush){
   assert.equal(env.GITHUB_SHA,actualCommit,'UI_ACTIONS_PUSH_HEAD_MISMATCH');assert.equal(event.after,actualCommit,'UI_ACTIONS_PUSH_AFTER_MISMATCH');assert.equal(event.ref,env.GITHUB_REF,'UI_ACTIONS_PUSH_REF_MISMATCH');
  }else{
   assert.equal(event.pull_request?.head?.sha,actualCommit,'UI_ACTIONS_HEAD_MISMATCH');assert.equal(event.pull_request?.head?.repo?.full_name,env.GITHUB_REPOSITORY,'UI_ACTIONS_SAME_REPOSITORY');
  }
  assert.equal(event.repository?.full_name,env.GITHUB_REPOSITORY,'UI_ACTIONS_EVENT_REPOSITORY');
  assert(/^\d+$/.test(env.GITHUB_RUN_ID||'')&&/^\d+$/.test(env.GITHUB_RUN_ATTEMPT||''),'UI_ACTIONS_RUN_REQUIRED');assert(/^[A-Za-z0-9_.-]+$/.test(env.GITHUB_JOB||''),'UI_ACTIONS_JOB_REQUIRED');return{expectedCheckoutCommit:expected,actualCheckoutCommit:actualCommit,executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',githubEventCommit:env.GITHUB_SHA,repository:env.GITHUB_REPOSITORY,runId:env.GITHUB_RUN_ID,runAttempt:env.GITHUB_RUN_ATTEMPT,job:env.GITHUB_JOB,eventName:env.GITHUB_EVENT_NAME,headCommit:reviewPush?event.after:event.pull_request.head.sha};}

 assert(env.GITHUB_SHA===undefined&&env.GITHUB_RUN_ID===undefined,'UI_LOCAL_EXECUTION_NOT_ACTIONS');return{expectedCheckoutCommit:expected,actualCheckoutCommit:actualCommit,executionOwner:'LOCAL_CHROMIUM',githubEventCommit:null};
}
function browserExecutionEvidence(executablePath,checkout){
 assert(path.isAbsolute(executablePath||'')&&fs.statSync(executablePath).isFile(),'UI_SUPPORTED_CHROME_REQUIRED');
 const realExecutable=fs.realpathSync(executablePath),version=execFileSync(executablePath,['--version'],{encoding:'utf8',timeout:10000}).trim();
 const local=checkout.executionOwner==='LOCAL_CHROMIUM';assert(local?/^Chromium \d+\.[\d.]+(?: .*)?$/.test(version):/^(?:Google Chrome|Chromium) \d+\.[\d.]+(?: .*)?$/.test(version),'UI_BROWSER_VERSION');
 const sum=execFileSync('sha256sum',[realExecutable],{encoding:'utf8',timeout:30000}).split(/\s+/)[0];assert(/^[a-f0-9]{64}$/.test(sum),'UI_BROWSER_BYTES');
 return{schemaVersion:'archive-m3s2-q16-browser-execution-v1',executionOwner:checkout.executionOwner,checkout,executableName:path.basename(realExecutable),executableSha256:sum,version,playwrightVersion:require('playwright/package.json').version,headless:true,launchArgumentsAdded:[],networkPolicy:'TRACKED_LOCALHOST_AND_EXACT_ASSET_MIRROR_ONLY'};
}
function assertTechnicalState(t){assert(t.mode==='exam'&&t.questions===24&&t.pages>0&&t.readiness==='RENDER_READY'&&t.imagesComplete===true&&t.mathErrors===0&&t.unrenderedMath===0&&t.mathJaxSource==='local'&&t.solutionNodes===0,'UI_EXACT_PROBLEM_RENDER_STATE');}
function assertCompletedResults(results,inputs,m,artifacts){validateManifest(m);assert.equal(results.length,2,'UI_ALL_TWO_REQUIRED');const seen=new Set();for(const r of results){const v=m.viewports.find(v=>v.name===r.viewport?.name);assert(v&&!seen.has(v.name),'UI_UNIQUE_TWO_REQUIRED');seen.add(v.name);assert.deepEqual(r.viewport,v,'UI_VIEWPORT');assert.equal(r.key,'E008-Q16','UI_TARGET');assert.equal(r.questionUid,m.items[0].questionUid,'UI_UID');assert.equal(r.sourceOrdinal,16,'UI_ORDINAL');assert.deepEqual(r.sourceRef,inputs.items[0].sourceRef,'UI_SOURCE');assert.deepEqual(r.assetRefs,[],'UI_HTML_ASSETS');assert.equal(r.status,'PASS','UI_PASS');assert.equal(r.visualReview,'PENDING','UI_VISUAL_PENDING');assertTechnicalState(r.technical);const c=r.capture;assert(c.schemaVersion===H.TILE_SCHEMA&&c.method==='UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES'&&c.visibleChildren>=3&&c.cssWrites===0&&c.domWrites===0&&c.viewportChanges===0&&c.compositeImageCreated===false&&c.feedbackIdle===true&&c.foreignContentHits===0&&c.tileLimit===8&&c.overlapCssPixels===32,'UI_CAPTURE_GUARDS');assert.deepEqual(c.coverage,H.assertTileCoverage(c.content.height,c.tiles),'UI_COVERAGE');assert(r.geometry.selectedFigureAssetCount===0&&r.geometry.noteBoxCount===1&&r.geometry.noteBoxNestedDivs===0&&r.geometry.choiceCount===5&&r.geometry.choiceLabelOrderValid&&r.geometry.noteInsideQuestion&&r.geometry.contentInsideQuestion&&r.geometry.horizontalOverflow===false,'UI_LAYOUT_GEOMETRY');}return assertScreenshotInventory(results,artifacts);}
function checkedOutput(root,out){root=path.resolve(root);out=path.resolve(out);assert(out!==root&&!out.startsWith(root+path.sep),'UI_OUTPUT_OUTSIDE_CHECKOUT');for(let p=out;p!==path.dirname(p);p=path.dirname(p))if(fs.existsSync(p))assert(!fs.lstatSync(p).isSymbolicLink(),'UI_OUTPUT_SYMLINK');assert(!fs.existsSync(out)||fs.readdirSync(out).length===0,'UI_EMPTY_OUTPUT_REQUIRED');return out;}
const mime=rel=>({'.js':'text/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'}[path.extname(rel)]||'application/octet-stream');
async function inspectStudentUi({ root, out, expectedCommit, executablePath }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const captureHelperRef=reader.ref(SHARED_CHECKER_PATH);assert.equal(captureHelperRef.sha256,SHARED_CHECKER_SHA256,'UI_CAPTURE_HELPER_CHANGED');
  const inputs = preflight(reader, manifest);
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const executionProvenance=browserExecutionEvidence(executablePath,checkoutEvidence(reader.commit));
  const proofBase = { schemaVersion: SCHEMA, executionOwner: executionProvenance.executionOwner, executionProvenance, checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef, ...inputs,
    fixedScope: 'E008_Q16_HTML_LAYOUT_DESKTOP_MOBILE_ONLY', surface: 'PROBLEM',
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertCompletedResults(results,inputs,manifest,screenshotArtifacts);
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
        assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
        assert(technical.pages > 0 && technical.imagesComplete, 'UI_RENDERED_IMAGES');
        assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
        assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
        assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
        assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const box=page.locator('#print-area .q-box').filter({has:page.locator('.q-num').filter({hasText:/^16(?:[.)\s]|$)/})});
          assert.equal(await box.count(),1,'UI_UNIQUE_PROBLEM_BOX');
          const target=box.locator('.q-content');assert.equal(await target.count(),1,'UI_UNIQUE_PROBLEM_CONTENT');
          const screenshotPath=`${item.key}-${viewport.name}.png`;
          const capture=await captureProblemTiles(page,target,path.join(out,screenshotPath));
          const geometry=await target.evaluate(content=>{const box=content.closest('.q-box'),r=e=>{const a=e.getBoundingClientRect();return{x:a.x,y:a.y,width:a.width,height:a.height};},b=r(box),c=r(content),notes=[...content.querySelectorAll('.note-box')],choices=[...box.querySelectorAll('.choice-item')],inside=a=>a.x>=b.x-1&&a.x+a.width<=b.x+b.width+1&&a.y>=b.y-1&&a.y+a.height<=b.y+b.height+1;return{question:b,content:c,selectedFigureAssetCount:box.querySelectorAll('img,svg,object,iframe,canvas,video').length,questionNumber:box.querySelector('.q-num')?.textContent?.trim(),noteBoxCount:notes.length,noteBoxNestedDivs:notes.reduce((n,e)=>n+e.querySelectorAll('div').length,0),choiceCount:choices.length,choiceLabelOrderValid:[...box.querySelectorAll('.choice-no')].map(e=>e.textContent.trim()).join('')==='①②③④⑤',noteInsideQuestion:notes.length===1&&inside(r(notes[0])),contentInsideQuestion:inside(c),horizontalOverflow:[content,...notes,...choices].some(e=>e.scrollWidth>e.clientWidth+1)};});
          assert.equal(Number((geometry.questionNumber||'').match(/^\d+/)?.[0]),16,'UI_VISIBLE_ORDINAL');
          assert(geometry.selectedFigureAssetCount===0&&geometry.noteBoxCount===1&&geometry.noteBoxNestedDivs===0&&geometry.choiceCount===5&&geometry.choiceLabelOrderValid&&geometry.noteInsideQuestion&&geometry.contentInsideQuestion&&!geometry.horizontalOverflow,'UI_Q16_LAYOUT_CLIPPED_OR_INCOMPLETE');
          const screenshots = capture.tiles.map(tile => { const bytes = fs.readFileSync(path.join(out, tile.filename));
            return { tileIndex: tile.tileIndex, path: tile.filename, sha256: sha256(bytes), bytes: bytes.length }; });
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
            sourceRef: item.sourceRef, assetRefs: [], screenshots,
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
    assert.equal(results.length, manifest.expectedCases, 'UI_ALL_TWO_REQUIRED');
    assert.equal(new Set(results.map(row => `${row.key}:${row.viewport.name}`)).size, 2, 'UI_UNIQUE_TWO_REQUIRED');
    assertScreenshotInventory(results, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, inputs.metadataRef, inputs.identityRef, ...inputs.items.map(row => row.sourceRef), ...served.values(), ...mirrored.values()]) {
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

async function main(){const a=process.argv.slice(2);assert(a.length===2&&a[0]==='--output'&&path.isAbsolute(a[1]),'UI_ARGUMENTS');const root=process.cwd(),reader=createGitReader(root),checkout=checkoutEvidence(reader.commit);const result=await inspectStudentUi({root,out:checkedOutput(root,a[1]),expectedCommit:checkout.expectedCheckoutCommit,executablePath:process.env.CHROME_BIN});console.log(JSON.stringify({status:result.status,cases:result.completedLogicalCases,checkoutCommit:result.checkoutCommit,newApprovals:0}));}
module.exports={MANIFEST_PATH,CHECKER_PATH,SHARED_CHECKER_SHA256,MANIFEST_SHA256,validateManifest,loadQuestions,selectedDataHash,preflight,checkoutEvidence,assertTechnicalState,assertCompletedResults,checkedOutput,browserExecutionEvidence};
if(require.main===module)main().catch(e=>{console.error(JSON.stringify({schemaVersion:SCHEMA,status:'FAIL',failureCode:/^UI_[A-Z0-9_]+$/.test(e.message)?e.message:'UI_Q16_CHECK_FAILED',errorSha256:sha256(e.message||'')}));process.exitCode=1;});
