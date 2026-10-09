const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const outDir = __dirname;
const prefix = process.env.AP_SMOKE_PREFIX || 'pre-main';
const base = process.env.AP_ARCHIVE_BASE || 'http://127.0.0.1:8766';
const sourceA = 'exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js';
const sourceB = 'exams/original/high/h1/1mid/26_복성고_1학기_중간_고1_기출.js';
const sourceC = 'exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js';
const sourceFullwidth = 'exams/original/middle/m3/2mid/25_신흥중_2학기_중간_중3_수학.js';
async function readOutput(page) {
  return page.evaluate(async () => {
    const root = document.getElementById('print-area');
    const pages = [...(root?.querySelectorAll('.page') || [])];
    const boxes = [...(root?.querySelectorAll('.sol-box') || [])];
    const grouped = new Map();
    for (const box of boxes) {
      const sourceRef = box.dataset.sourceRef || '';
      const row = grouped.get(sourceRef) || { answer: '', solution: '', fragments: 0 };
      row.answer ||= box.querySelector('.sol-ans')?.textContent || '';
      row.solution += box.querySelector('.sol-exp')?.textContent || '';
      row.fragments += 1;
      grouped.set(sourceRef, row);
    }
    const rows = [...grouped.entries()].map(([sourceRef, value]) => [sourceRef, value.answer, value.solution]);
    const bodyText = rows.map(row => row.join('\n')).join('\n');
    const bodyHtml = boxes.map(box => String(box.dataset.sourceRef || '') + '\n' + (box.querySelector('.sol-exp')?.innerHTML || '')).join('\n');
    const digest = async value => {
      const bytes = new TextEncoder().encode(value);
      const hash = await crypto.subtle.digest('SHA-256', bytes);
      return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    };
    const clipped = [...(root?.querySelectorAll('.sol-box,.sol-exp,.page-body,.sol-grid-col,.sol-fullwidth-column') || [])].flatMap(node => {
      const style = getComputedStyle(node);
      const dy = node.scrollHeight - node.clientHeight;
      return ['hidden','clip'].includes(style.overflowY) && dy > 2 ? [{sourceRef:node.closest('.sol-box')?.dataset.sourceRef || '',delta:dy}] : [];
    });
    const session = archiveScreenRuntime.inspect().currentSession;
    return {
      url: location.href,
      mode: AppState.mode,
      pageCount: pages.length,
      solutionBoxCount: boxes.length,
      answerCount: [...grouped.values()].filter(row => row.answer).length,
      continuationCount: boxes.filter(box => box.classList.contains('sol-box-long')).length,
      imageCount: root?.querySelectorAll('.sol-image-wrap img').length || 0,
      imagesReady: [...(root?.querySelectorAll('.sol-image-wrap img') || [])].every(image => image.complete && image.naturalWidth > 0),
      mathUnrendered: APRenderLoop.unrenderedMathCount(root),
      mathErrors: root?.querySelectorAll('mjx-merror').length || 0,
      clipped,
      bodyOverflowMax: Math.max(0,...pages.map(page => Math.max(0,(page.querySelector('.page-body')?.scrollHeight || 0)-(page.querySelector('.page-body')?.clientHeight || 0)))),
      bodyTextSha256: await digest(bodyText),
      solutionHtmlSha256: await digest(bodyHtml),
      cacheStatus: archiveScreenRuntime.inspect().attempts.at(-1)?.cacheStatus,
      lastAttempt: archiveScreenRuntime.inspect().attempts.at(-1),
      envelope: AppState.outputEnvelope ? {mode:AppState.outputEnvelope.mode,id:AppState.outputEnvelope.outputRequestId,source:AppState.outputEnvelope.meta?.sourceArchiveFile} : null,
      envelopeReady: window.__AP_OUTPUT_ENVELOPE_READY__ || null,
      renderReady: window.__AP_OUTPUT_RENDER_READY__ || null,
      readerReady: document.getElementById('archive2-reader-controls')?.dataset.ready || null,
      session: session ? {id:session.sessionId,source:session.sourceArchiveFile,activeMode:session.activeMode,modes:Object.fromEntries(Object.entries(session.modeSnapshots || {}).map(([mode,snapshot])=>[mode,snapshot ? snapshot.status : null]))} : null,
      screenReady: JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null'),
      printReadiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || 'null')
    };
  });
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: process.env.AP_SMOKE_HEADED !== '1' });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [], pageErrors = [];
  const trackResources = target => {
    const servedResources = [], reads = [];
    target.on('pageerror', error => pageErrors.push(String(error.stack || error)));
    target.on('console', message => { if (message.type() === 'error' && !message.text().includes('favicon')) consoleErrors.push(message.text()); });
    target.on('response', response => {
      const url = new URL(response.url());
      if (url.pathname === '/archive/engine.html' ||
          url.pathname.endsWith('/screen-runtime-adapter.js') ||
          url.pathname.endsWith('/solution-render-executor.js') ||
          url.pathname.endsWith('/layout-materializer.js') ||
          url.pathname.endsWith('/25_매산여고_2학기_중간_고1_기출.js') ||
          url.pathname.endsWith('/26_복성고_1학기_중간_고1_기출.js') ||
          url.pathname.endsWith('/25_효천고_2학기_중간_고1_기출.js') ||
          url.pathname.endsWith('/25_신흥중_2학기_중간_중3_수학.js') ||
          url.pathname.startsWith('/archive/assets/images/')) {
        reads.push(response.body().then(bytes => servedResources.push({
          url: response.url(), status: response.status(), byteLength: bytes.length,
          sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
        })));
      }
    });
    return { servedResources, settle: () => Promise.all(reads) };
  };
  const mainResources = trackResources(page);
  await page.context().route('**/api/**', route => route.fulfill({status:200,contentType:'application/json',body:'{"success":true}'}));
  const url = base + '/archive/engine.html?data=' + encodeURIComponent(sourceB) + '&mode=exam&fit=screen&qpp=4&printDryRun=1&benchmark=' + prefix + '-bounded-prewarm';
  console.log('OPEN', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  console.log('DOM_CONTENT_LOADED');
  await page.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot?.mode === 'exam', null, { timeout: 120000 });
  console.log('EXAM_ACTIVE');
  await page.waitForTimeout(8000);
  console.log('PREWARM_STATE', JSON.stringify(await page.evaluate(() => ({audit:window.__AP_PREWARM_AUDIT__||[], modes:Object.fromEntries(Object.entries(archiveScreenRuntime.currentSession.modeSnapshots).map(([mode,snapshot])=>[mode,snapshot?.status||null])), attempts:archiveScreenRuntime.inspect().attempts.map(a=>({mode:a.metrics?.mode,state:a.state,cacheStatus:a.cacheStatus,error:a.error}))}))));
  await page.waitForFunction(() => {
    const session = window.archiveScreenRuntime?.currentSession;
    return session?.modeSnapshots?.sol?.status === 'READY' && session?.modeSnapshots?.ans?.status === 'READY';
  }, null, { timeout: 120000 });
  const prewarmState = await page.evaluate(() => ({
    audit: window.__AP_PREWARM_AUDIT__ || [],
    activeMode: archiveScreenRuntime.currentSession.activeMode,
    solution: archiveScreenRuntime.currentSession.modeSnapshots.sol?.status,
    answer: archiveScreenRuntime.currentSession.modeSnapshots.ans?.status
  }));
  await page.screenshot({ path: path.join(outDir, prefix + '-B-exam-prewarmed.png'), fullPage: true });
  await page.locator('#btn-sol').click();
  await page.waitForFunction(() => AppState.mode === 'sol' && window.__AP_OUTPUT_RENDER_READY__?.outputRequestId === AppState.outputEnvelope?.outputRequestId && document.getElementById('archive2-reader-controls')?.dataset.ready === 'true', null, { timeout: 120000 });
  const solutionB = await readOutput(page);
  await page.screenshot({ path: path.join(outDir, prefix + '-B-solution.png'), fullPage: true });
  await page.locator('#btn-ans').click();
  await page.waitForFunction(() => AppState.mode === 'ans' && window.__AP_OUTPUT_RENDER_READY__?.outputRequestId === AppState.outputEnvelope?.outputRequestId && document.getElementById('archive2-reader-controls')?.dataset.ready === 'true', null, { timeout: 120000 });
  const answerB = await page.evaluate(() => ({
    mode: AppState.mode,
    pages: document.querySelectorAll('#print-area .page').length,
    text: document.getElementById('print-area')?.textContent || '',
    envelopeMode: AppState.outputEnvelope?.mode || null,
    envelopeId: AppState.outputEnvelope?.outputRequestId || null,
    routeEnvelopeId: new URL(location.href).searchParams.get('outputRequestId'),
    envelopeReady: window.__AP_OUTPUT_ENVELOPE_READY__?.outputRequestId || null,
    renderReady: window.__AP_OUTPUT_RENDER_READY__?.outputRequestId || null,
    cacheStatus: archiveScreenRuntime.inspect().attempts.at(-1)?.cacheStatus,
    sessionId: archiveScreenRuntime.currentSession.sessionId,
    answerCells: document.querySelectorAll('#print-area .ans-cell').length,
    unrenderedMath: APRenderLoop.unrenderedMathCount(document.getElementById('print-area')),
    bodyOverflowMax: Math.max(0,...[...document.querySelectorAll('#print-area .page')].map(page => Math.max(0,(page.querySelector('.page-body')?.scrollHeight || 0)-(page.querySelector('.page-body')?.clientHeight || 0)))),
  }));
  await page.screenshot({ path: path.join(outDir, prefix + '-B-answer.png'), fullPage: true });
  await page.evaluate(async () => { await safePrint('vector'); });
  const print = await page.evaluate(() => ({
    readiness: archiveReadinessTracker.snapshot(),
    metrics: JSON.parse(document.documentElement.dataset.apPrintMetrics || 'null'),
    pending: printPending,
    printCalled: window.__AP_PRINT_CALL_COUNT__ || 0,
    pages: document.querySelectorAll('#print-area .page').length
  }));
  const beforeSourceChange = await page.evaluate(() => ({
    sessionId: archiveScreenRuntime.currentSession.sessionId,
    envelopeId: AppState.outputEnvelope?.outputRequestId,
    readyId: window.__AP_OUTPUT_RENDER_READY__?.outputRequestId,
    activeMode: AppState.mode
  }));
  const sourceChange = await page.evaluate(async source => {
    const result = await archiveScreenRuntime.request({ type:'SOURCE_CHANGE', foreground:true, payload:{safeDataUrl:source, mode:'exam', qpp:4} });
    const url = new URL(location.href);
    const session = archiveScreenRuntime.currentSession;
    return {
      result,
      sessionId: session.sessionId,
      source: session.sourceArchiveFile,
      activeMode: AppState.mode,
      modes: Object.fromEntries(Object.entries(session.modeSnapshots || {}).map(([mode,snapshot])=>[mode,snapshot ? snapshot.status : null])),
      outputEnvelopeCleared: !AppState.outputEnvelope && !window.__AP_OUTPUT_ENVELOPE__ && !window.__AP_OUTPUT_ENVELOPE_READY__ && !window.__AP_OUTPUT_RENDER_READY__ && !url.searchParams.has('outputRequestId'),
      pageCount: document.querySelectorAll('#print-area .page').length
    };
  }, sourceC);
  await page.screenshot({ path: path.join(outDir, prefix + '-C-exam-after-source-change.png'), fullPage: true });
  await page.locator('#btn-sol').click();
  await page.waitForFunction(() => AppState.mode === 'sol' && window.__AP_OUTPUT_RENDER_READY__?.outputRequestId === AppState.outputEnvelope?.outputRequestId && document.getElementById('archive2-reader-controls')?.dataset.ready === 'true', null, { timeout: 120000 });
  const solutionC = await readOutput(page);
  await page.screenshot({ path: path.join(outDir, prefix + '-C-solution-after-source-change.png'), fullPage: true });

  const fullwidthUrl = base + '/archive/engine.html?data=' + encodeURIComponent(sourceFullwidth) + '&mode=exam&fit=screen&qpp=4&prewarm=0&printDryRun=1&benchmark=' + prefix + '-fullwidth';
  await page.goto(fullwidthUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot?.mode === 'exam', null, { timeout: 120000 });
  const fullwidthExamSession = await page.evaluate(() => ({source:archiveScreenRuntime.currentSession.sourceArchiveFile,mode:AppState.mode,pages:document.querySelectorAll('#print-area .page').length}));
  await page.locator('#btn-sol').click();
  await page.waitForFunction(() => AppState.mode === 'sol' && window.__AP_OUTPUT_RENDER_READY__?.outputRequestId === AppState.outputEnvelope?.outputRequestId && document.getElementById('archive2-reader-controls')?.dataset.ready === 'true', null, { timeout: 120000 });
  const fullwidthSolution = await readOutput(page);
  const fullwidthGeometry = await page.evaluate(() => {
    const root = document.getElementById('print-area');
    const boxes = [...(root?.querySelectorAll('.sol-box') || [])];
    const q10 = boxes.find(box => String(box.dataset.sourceRef || '').includes('#ordinal:10'));
    const q9 = boxes.find(box => String(box.dataset.sourceRef || '').includes('#ordinal:9'));
    const q11 = boxes.find(box => String(box.dataset.sourceRef || '').includes('#ordinal:11'));
    const image = q10?.querySelector('.sol-image-wrap img');
    const pages = [...(root?.querySelectorAll('.page') || [])];
    const pageNo = box => box ? pages.indexOf(box.closest('.page')) + 1 : null;
    const rect = node => { if (!node) return null; const r=node.getBoundingClientRect(); return {width:r.width,height:r.height,top:r.top,bottom:r.bottom,left:r.left,right:r.right}; };
    return {
      source:AppState.sourceArchiveFile,
      q9Page:pageNo(q9),q10Page:pageNo(q10),q11Page:pageNo(q11),
      q10SourceRef:q10?.dataset.sourceRef || null,
      q10Fullwidth:q10?.dataset.solutionFullWidth === 'true' || !!q10?.closest('.sol-fullwidth-column'),
      q10ColumnSpan:q10?.dataset.columnSpan || null,
      q10Column:rect(q10?.closest('.sol-fullwidth-column')),
      q10Box:rect(q10),
      svg:{src:image?.getAttribute('src')||null,complete:!!image?.complete,width:image?.naturalWidth||0,height:image?.naturalHeight||0,contained:!!q10&&!!image&&(()=>{const b=q10.getBoundingClientRect(),i=image.getBoundingClientRect();return i.left>=b.left-1&&i.right<=b.right+1&&i.top>=b.top-1&&i.bottom<=b.bottom+1})()},
      fullwidthColumns:root?.querySelectorAll('.sol-fullwidth-column').length||0,
      clipped:[...(root?.querySelectorAll('.sol-box,.sol-exp,.page-body,.sol-grid-col,.sol-fullwidth-column')||[])].flatMap(node=>{const style=getComputedStyle(node),dy=node.scrollHeight-node.clientHeight;return ['hidden','clip'].includes(style.overflowY)&&dy>2?[{sourceRef:node.closest('.sol-box')?.dataset.sourceRef||'',delta:dy}]:[]})
    };
  });
  await page.screenshot({ path: path.join(outDir, prefix + '-fullwidth-solution.png'), fullPage: true });
  await page.evaluate(async () => { await safePrint('vector'); });
  const fullwidthPrint = await page.evaluate(() => ({readiness:archiveReadinessTracker.snapshot(),metrics:JSON.parse(document.documentElement.dataset.apPrintMetrics||'null'),pending:printPending}));

  const aPage = await page.context().newPage();
  const aResources = trackResources(aPage);
  const aUrl = base + '/archive/engine.html?data=' + encodeURIComponent(sourceA) + '&mode=exam&fit=screen&qpp=4&prewarm=0&printDryRun=1&benchmark=' + prefix + '-long-sol-svg';
  await aPage.goto(aUrl, { waitUntil: 'domcontentloaded' });
  await aPage.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot?.mode === 'exam', null, { timeout: 120000 });
  await aPage.locator('#btn-sol').click();
  await aPage.waitForFunction(() => AppState.mode === 'sol' && window.__AP_OUTPUT_RENDER_READY__?.outputRequestId === AppState.outputEnvelope?.outputRequestId && document.getElementById('archive2-reader-controls')?.dataset.ready === 'true', null, { timeout: 120000 });
  const solutionA = await readOutput(aPage);
  await aPage.screenshot({ path: path.join(outDir, prefix + '-A-long-solution.png'), fullPage: true });
  await aPage.evaluate(async () => { await safePrint('vector'); });
  const printA = await aPage.evaluate(() => ({readiness:archiveReadinessTracker.snapshot(),metrics:JSON.parse(document.documentElement.dataset.apPrintMetrics||'null'),pending:printPending}));
  await Promise.all([mainResources.settle(), aResources.settle()]);
  const result = {
    schemaVersion:'ARCHIVE_MODE_OUTPUT_CANCELLATION_SMOKE_V1',
    browser: await browser.version(),
    viewport:{width:1280,height:720,deviceScaleFactor:1},
    phase:prefix,
    sourceB,
    prewarmState,
    solutionB,
    answerB,
    print,
    beforeSourceChange,
    sourceChange,
    solutionC,
    sourceA,
    solutionA,
    printA,
    sourceFullwidth,
    fullwidthExamSession,
    fullwidthSolution,
    fullwidthGeometry,
    fullwidthPrint,
    servedResources:[...mainResources.servedResources,...aResources.servedResources],
    consoleErrors,
    pageErrors
  };
  fs.writeFileSync(path.join(outDir, prefix + '-mode-output-smoke.json'), JSON.stringify(result, null, 2));
  await browser.close();
  if (consoleErrors.length || pageErrors.length || solutionB.cacheStatus !== 'HIT' || answerB.cacheStatus !== 'HIT' ||
      !print.readiness.ready || print.readiness.state !== 'PRINT_READY' || !print.metrics?.dryRun ||
      !sourceChange.result.ok || !sourceChange.outputEnvelopeCleared || sourceChange.modes.sol !== null || sourceChange.modes.ans !== null ||
      solutionC.cacheStatus === 'HIT' || !fullwidthGeometry.q10Fullwidth ||
      fullwidthGeometry.q10Page !== 4 || fullwidthGeometry.q9Page !== 3 || fullwidthGeometry.q11Page !== 5 ||
      !fullwidthGeometry.svg.complete || !fullwidthGeometry.svg.contained || fullwidthGeometry.clipped.length ||
      fullwidthSolution.mathUnrendered !== 0 || !fullwidthPrint.readiness.ready || fullwidthPrint.readiness.state !== 'PRINT_READY' ||
      solutionA.bodyTextSha256 !== '8bec4e403bba634204ec3396a851488fb74e0ab515046047a0aa9fb350e584b3' ||
      solutionA.answerCount !== 23 || solutionA.imageCount !== 12 || !solutionA.imagesReady || solutionA.mathUnrendered !== 0 ||
      solutionA.clipped.length || !printA.readiness.ready || printA.readiness.state !== 'PRINT_READY') process.exitCode = 1;
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
