const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const crypto = require('crypto');
const { createRequire } = require('module');
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (!['--root','--exam','--asset-root','--output','--node-modules'].includes(key)) throw Error('UNKNOWN_ARG:' + key);
  args[key.slice(2)] = process.argv[++i];
}
const root = fs.realpathSync(path.resolve(args.root));
const exam = fs.realpathSync(path.resolve(root, args.exam));
const assetRoot = fs.realpathSync(path.resolve(root, args['asset-root']));
const out = path.resolve(root, args.output);
const allowed = path.relative(path.join(root, 'archive/analysis'), out);
if (allowed.startsWith('..') || path.isAbsolute(allowed) || fs.existsSync(out)) throw Error('FRESH_ASSIGNED_OUTPUT_REQUIRED');
fs.mkdirSync(out, { recursive: true });
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const ref = f => ({ path: path.relative(root, f).replaceAll('\\', '/'), sha256: hash(fs.readFileSync(f)) });
function within(base, p) {
  const f = path.resolve(base, p), r = path.relative(base, f);
  if (r.startsWith('..') || path.isAbsolute(r)) throw Error('PATH_ESCAPE:' + p);
  return f;
}
const bytes = fs.readFileSync(exam), box = { window: {} };
vm.runInNewContext(bytes.toString('utf8'), box, { timeout: 5000 });
const bank = box.window.questionBank || box.window.questions;
if (!Array.isArray(bank) || !bank.length) throw Error('QUESTION_BANK_REQUIRED');
const qids = bank.map(q => Number(q.id));
const loadedJs = ref(exam);
const artifactSha = crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const virtual = '/archive/exams/__codex_capture__/' + path.basename(exam);
const mime = { '.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = url === virtual ? exam : url.startsWith('/archive/assets/') ? within(assetRoot, url.slice('/archive/'.length)) : within(root, url.slice(1));
    const real = fs.realpathSync(file);
    within(url.startsWith('/archive/assets/') ? assetRoot : root, real);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(fs.readFileSync(file));
  } catch { res.writeHead(404); res.end(); }
});
const report = { schemaVersion:'JS_ARCHIVE_CODEX_TARGETED_CAPTURE_RECOVERY_V1', executionLine:'CODEX', qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', status:'IN_PROGRESS', renderPass:false, artifactSha, loadedJs, captureCases:[], qids, startedAt:new Date().toISOString() };
(async () => {
  let browser;
  try {
    const modules = path.resolve(args['node-modules']);
    const { chromium } = createRequire(path.join(modules, '../package.json'))('playwright');
    browser = await chromium.launch({ channel:'chrome', headless:true });
    report.browserVersion = browser.version();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    for (const [mode, profile] of [['sol','desktop'],['sol','mobile'],['ans','desktop'],['ans','mobile']]) {
      const id = mode + '/' + profile;
      const viewport = { width:profile === 'mobile' ? 390 : 1280, height:profile === 'mobile' ? 844 : 1000 };
      const context = await browser.newContext({ viewport, deviceScaleFactor:1 });
      const page = await context.newPage();
      const responses = new Map(), pending = [], errors = [], consoleMessages = [], failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') consoleMessages.push({ type:message.type(), text:message.text() }); });
      page.on('requestfailed', request => failedRequests.push({ url:request.url(), error:request.failure()?.errorText }));
      page.on('response', response => {
        const u = new URL(response.url()), p = decodeURIComponent(u.pathname);
        if (u.origin === origin && (p === virtual || p.startsWith('/archive/assets/'))) {
          pending.push((async () => {
            const body = await response.body();
            responses.set(p, { status:response.status(), sha256:hash(body), url:response.url() });
          })().catch(error => errors.push('RESPONSE_BODY:' + error.message)));
        }
      });
      const selector = mode === 'ans' ? '#print-area .ans-n' : '#print-area .q-box[data-source-ref]';
      const caseRow = { id, status:'IN_PROGRESS', viewport, errors, consoleMessages, failedRequests, requestTrace:[] };
      report.captureCases.push(caseRow);
      try {
        const url = origin + '/archive/engine.html?preview=1&fit=screen&qpp=4&mode=' + mode + '&data=' + encodeURIComponent(virtual.slice('/archive/'.length));
        await page.goto(url, { waitUntil:'load', timeout:60000 });
        await page.waitForFunction(({ selector, count, mode }) => {
          const nodes = [...document.querySelectorAll(selector)];
          if (mode === 'ans') return nodes.length === count;
          return new Set(nodes.map(node => node.dataset.sourceRef).filter(Boolean)).size === count;
        }, { selector, count:bank.length, mode }, { timeout:60000 });
        await page.evaluate(async () => { await document.fonts.ready; if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise; });
        await page.waitForFunction(() => [...document.querySelectorAll('#print-area img')].every(img => img.complete), {}, { timeout:30000 });
        await Promise.all(pending);
        if (responses.get(virtual)?.sha256 !== loadedJs.sha256) throw Error('LOADED_JS_SHA_MISMATCH');
        const metrics = await page.evaluate(({ selector, mode }) => {
          const nodes = [...document.querySelectorAll(selector)], sourceRefs = nodes.map(node => node.dataset.sourceRef || node.textContent.trim());
          return { count:mode === 'ans' ? nodes.length : new Set(sourceRefs).size, renderedBoxCount:nodes.length, width:innerWidth, height:innerHeight, mathJaxPresent:!!window.MathJax, mathErrors:document.querySelectorAll('mjx-merror,[data-mjx-error]').length, images:[...document.querySelectorAll('#print-area img')].map(img => ({ url:img.currentSrc || img.src, decoded:img.complete && img.naturalWidth > 0 })), sourceRefs, scrollWidth:document.documentElement.scrollWidth, apRenderError:document.documentElement.dataset.apRenderError || null };
        }, { selector, mode });
        const assets = [];
        for (const image of metrics.images) {
          const url = new URL(image.url);
          if (!image.decoded) throw Error('ASSET_DECODE_FAILED:' + url.pathname);
          if (!url.pathname.startsWith('/archive/assets/')) continue;
          const assetRef = decodeURIComponent(url.pathname).slice('/archive/'.length), file = within(assetRoot, assetRef), expected = hash(fs.readFileSync(file)), actual = responses.get(decodeURIComponent(url.pathname));
          if (actual?.sha256 !== expected || actual.status !== 200) throw Error('LOADED_ASSET_SHA_MISMATCH:' + assetRef);
          if (!assets.some(asset => asset.ref === assetRef)) assets.push({ ref:assetRef, sha256:expected, file:ref(file) });
        }
        const screenshot = path.join(out, mode + '-' + profile + '.png');
        await page.screenshot({ path:screenshot, type:'png', fullPage:true });
        if (hash(fs.readFileSync(exam)) !== loadedJs.sha256) throw Error('EXAM_CHANGED_DURING_CAPTURE');
        caseRow.captures = [{ image:ref(screenshot), qids }];
        caseRow.loadedAssets = assets;
        caseRow.metrics = metrics;
        caseRow.mechanicalStatus = metrics.count === bank.length && metrics.mathJaxPresent && metrics.mathErrors === 0 && errors.length === 0 ? 'PASS' : 'FAIL';
        caseRow.mathJaxStatus = metrics.mathJaxPresent && metrics.mathErrors === 0 ? 'PASS' : 'FAIL';
        caseRow.assetDecodeStatus = 'PASS';
        caseRow.status = caseRow.mechanicalStatus === 'PASS' ? 'CAPTURED_REVIEW_REQUIRED' : 'CAPTURE_MECHANICAL_FAIL';
        caseRow.requestTrace = [...responses.values()];
      } catch (error) {
        caseRow.status = 'CAPTURE_BLOCKED';
        caseRow.blocker = { code:error.code || 'CAPTURE_ERROR', reason:error.message };
        caseRow.requestTrace = [...responses.values()];
        try {
          caseRow.timeoutState = await page.evaluate(() => ({ title:document.title, bodyText:document.body?.innerText?.slice(0,1500), printAreaText:document.querySelector('#print-area')?.innerText?.slice(0,1500), renderError:document.documentElement.dataset.apRenderError || null, printArea:{ qboxes:document.querySelectorAll('#print-area .q-box').length, solBoxes:document.querySelectorAll('#print-area .sol-box').length, ansNodes:document.querySelectorAll('#print-area .ans-n').length, pages:document.querySelectorAll('#print-area .page').length }, staging:{ qboxes:document.querySelectorAll('#staging .q-box').length, solBoxes:document.querySelectorAll('#staging .sol-box').length }, mathJax:!!window.MathJax }));
        } catch (diagnosticError) { caseRow.timeoutStateError = diagnosticError.message; }
      } finally { await context.close(); }
    }
    report.status = report.captureCases.every(item => item.mechanicalStatus === 'PASS') ? 'CAPTURED_REVIEW_REQUIRED' : 'CAPTURE_RECOVERY_INCOMPLETE';
  } catch (error) {
    report.status = 'CAPTURE_BLOCKED'; report.blocker = { code:error.code || 'CAPTURE_ERROR', reason:error.message }; process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server.listening) await new Promise(resolve => server.close(resolve));
    report.finishedAt = new Date().toISOString();
    const file = path.join(out, 'targeted-capture-recovery.json');
    fs.writeFileSync(file, JSON.stringify(report, null, 2) + '\n', { flag:'wx' });
    console.log(JSON.stringify({ status:report.status, cases:report.captureCases.map(item => ({ id:item.id, status:item.status, mechanicalStatus:item.mechanicalStatus, blocker:item.blocker, timeoutState:item.timeoutState })), report:ref(file) }, null, 2));
  }
})().catch(error => { console.error(error); process.exit(2); });