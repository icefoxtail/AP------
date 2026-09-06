import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { readBoundFile, safePath, bytesSha, fileRef, writeNewJson } from './canonical.mjs';
import { profiles, runInputSha, EVIDENCE_VERSION } from './closure.mjs';

// This collector measures runtime and saves witnesses. Readability remains
// NOT_TESTED until a separate reviewer actually inspects those saved screens.
export async function captureRender(root, run, workdir, { channel = 'chrome' } = {}) {
  if (!profiles.pipelines[run.pipeline] || run.inputSha !== runInputSha(run)) throw new Error('RUN_INPUT_NOT_FROZEN');
  for (const input of run.inputs) readBoundFile(root, input);
  const output = safePath(root, workdir, { mustExist: false });
  if (fs.existsSync(output)) throw new Error('NEW_RENDER_ATTEMPT_DIRECTORY_REQUIRED');
  for (const p of ['archive/exams', 'archive/assets']) if (output === path.resolve(root, p) || output.startsWith(`${path.resolve(root, p)}${path.sep}`)) throw new Error('PRODUCTION_RENDER_OUTPUT_FORBIDDEN');
  const engine = run.inputs.find(i => i.path === 'archive/engine.html' && i.role === 'engine');
  if (!engine) throw new Error('PRODUCTION_ENGINE_NOT_BOUND');
  const require = createRequire(process.env.APMATH_NODE_MODULES ? path.join(process.env.APMATH_NODE_MODULES, '..', 'package.json') : import.meta.url);
  const { chromium } = require('playwright');
  const candidates = [...new Set(run.questions.map(q => q.candidatePath))];
  const refByPath = new Map(run.inputs.map(i => [i.path, i]));
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
  const server = http.createServer((request, response) => {
    try {
      const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
      let relative = requested;
      const match = requested.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
      if (match) relative = candidates[Number(match[1])];
      else if (requested.startsWith('archive/assets/') && run.assetRoot) relative = `${run.assetRoot}/${requested.slice('archive/'.length)}`;
      const ref = refByPath.get(relative);
      const bytes = ref ? readBoundFile(root, ref) : fs.readFileSync(safePath(root, relative));
      response.writeHead(200, { 'Content-Type': mime[path.extname(relative)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); response.end(bytes);
    } catch (error) { response.writeHead(404); response.end(String(error.message)); }
  });
  let browser;
  const captures = [];
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    browser = await chromium.launch({ channel, headless: true });
    for (let index = 0; index < candidates.length; index++) {
      const candidatePath = candidates[index], sourceContext = { window: {} };
      vm.runInNewContext(readBoundFile(root, refByPath.get(candidatePath)).toString('utf8'), sourceContext, { timeout: 1000 });
      const bank = sourceContext.window.questionBank;
      const questions = run.questions.filter(q => q.candidatePath === candidatePath);
      for (const mode of profiles.pipelines[run.pipeline].modes) for (const profile of profiles.viewports) {
        const viewport = { profile: profile.profile, width: profile.minWidth, height: profile.profile === 'mobile' ? 844 : 1000 };
        const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
        const page = await context.newPage(), pageErrors = [], responseHashes = new Map();
        const pendingResponseReads = [];
        page.on('pageerror', error => pageErrors.push(error.message));
        page.on('response', response => {
          if (response.url().startsWith(`http://127.0.0.1:${port}/archive/assets/`)) pendingResponseReads.push(response.body().then(bytes => responseHashes.set(decodeURIComponent(new URL(response.url()).pathname).slice(1), bytesSha(bytes))).catch(() => {}));
        });
        const startedAt = new Date().toISOString();
        const engineMode = { exam: 'exam', solution: 'sol', answer: 'ans' }[mode];
        const url = `http://127.0.0.1:${port}/archive/engine.html?data=exams/__pipeline_review__/${index}.js&mode=${engineMode}&qpp=4`;
        const selector = mode === 'answer' ? '#print-area .ans-n' : '#print-area .q-box';
        await page.goto(url, { waitUntil: 'load', timeout: 45000 });
        await page.waitForFunction(({ selector, count }) => document.querySelectorAll(selector).length === count, { selector, count: bank.length }, { timeout: 45000 });
        await page.evaluate(async () => {
          await document.fonts.ready;
          if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
          await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
          await new Promise(resolve => {
            let previous = '', stable = 0;
            function frame() {
              const rects = [...document.querySelectorAll('#print-area .q-box, #print-area .ans-n')].map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
              const key = JSON.stringify(rects) + getComputedStyle(document.documentElement).getPropertyValue('--screen-page-scale');
              stable = key === previous ? stable + 1 : 0; previous = key;
              if (stable >= 60) resolve(); else requestAnimationFrame(frame);
            }
            frame();
          });
        });
        await Promise.all(pendingResponseReads);
        const itemWitnesses = [];
        const stem = `candidate-${index}-${mode}-${profile.profile}`;
        fs.mkdirSync(output, { recursive: true });
        for (const q of questions) {
          const ordinal = bank.findIndex(item => item.id === q.qid);
          const target = page.locator(selector).nth(ordinal);
          await target.scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, -60));
          const png = await page.screenshot({ type: 'png' });
          const relative = `${workdir}/${stem}-q${q.qid}.png`;
          fs.writeFileSync(safePath(root, relative, { mustExist: false }), png, { flag: 'wx' });
          const box = await target.boundingBox();
          itemWitnesses.push({ questionUid: q.questionUid, status: 'NOT_TESTED', screenshot: fileRef(root, relative), boundingBox: box, note: 'Separate visual reviewer must inspect readability/clipping and update a NEW evidence revision.' });
        }
        await page.locator(selector).last().scrollIntoViewIfNeeded();
        const lastPng = await page.screenshot({ type: 'png' }), lastPath = `${workdir}/${stem}-last.png`;
        fs.writeFileSync(safePath(root, lastPath, { mustExist: false }), lastPng, { flag: 'wx' });
        const metrics = await page.evaluate(selector => ({ observedQuestionCount: document.querySelectorAll(selector).length, fonts: document.fonts.status, mathJaxPresent: !!window.MathJax, mathErrors: document.querySelectorAll('mjx-merror,[data-mjx-error]').length, rawMergedRelations: /\\(?:lt|gt|leq|geq)[A-Za-z]+/.test(document.querySelector('#print-area')?.innerText || ''), badImages: [...document.querySelectorAll('#print-area img')].filter(i => !i.complete || i.naturalWidth === 0).length, renderError: document.documentElement.dataset.apRenderError || null, scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth }), selector);
        const assetAssociations = [];
        for (const q of questions) for (const assetPath of (mode === 'solution' ? q.solutionAssetPaths : mode === 'exam' ? q.problemAssetPaths : [])) {
          const servedPath = run.assetRoot && assetPath.startsWith(`${run.assetRoot}/`) ? `archive/${assetPath.slice(run.assetRoot.length + 1)}` : assetPath;
          const actual = responseHashes.get(servedPath);
          assetAssociations.push({ questionUid: q.questionUid, path: assetPath, sha256: actual || null, status: actual === refByPath.get(assetPath)?.sha256 ? 'PASS' : 'FAIL' });
        }
        const checks = { runtime: !metrics.renderError && !pageErrors.length ? 'PASS' : 'FAIL', mathJax: metrics.mathJaxPresent && !metrics.mathErrors && !metrics.rawMergedRelations ? 'PASS' : 'FAIL', fonts: metrics.fonts === 'loaded' ? 'PASS' : 'FAIL', imageDecode: metrics.badImages === 0 ? 'PASS' : 'FAIL', assetAssociation: assetAssociations.every(a => a.status === 'PASS') ? 'PASS' : 'FAIL', questionCount: metrics.observedQuestionCount === bank.length ? 'PASS' : 'FAIL', lastQuestion: 'PASS', clipping: 'NOT_TESTED', overflow: 'NOT_TESTED', readability: 'NOT_TESTED' };
        const record = { schemaVersion: EVIDENCE_VERSION, evidenceId: `${run.runId}:${stem}`, runId: run.runId, revision: run.revision, axis: 'render', status: 'NOT_TESTED', validityStatus: 'DRAFT', reviewerId: 'actual-browser-collector', reviewSessionId: `${run.runId}:browser-capture`, reviewerModelOrAgent: 'Playwright/Chrome', inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: runInputSha(run), startedAt, frozenAt: new Date().toISOString(), findings: [], payload: { actualBrowser: true, productionEngine: true, browserVersion: browser.version(), mode, candidatePath, questionUids: questions.map(q => q.questionUid), viewport, expectedQuestionCount: bank.length, observedQuestionCount: metrics.observedQuestionCount, lastQuestionId: bank.at(-1).id, screenshot: fileRef(root, lastPath), itemWitnesses, assetAssociations, checks, metrics, pageErrors, url } };
        const recordPath = `${workdir}/${stem}.json`;
        writeNewJson(safePath(root, recordPath, { mustExist: false }), record); captures.push(fileRef(root, recordPath));
        await context.close();
      }
    }
    for (const input of run.inputs) readBoundFile(root, input);
    const report = { status: 'CAPTURED_REVIEW_REQUIRED', runId: run.runId, inputSha: run.inputSha, captures, productionAuthorized: false };
    writeNewJson(path.join(output, 'capture-report.json'), report);
    return report;
  } finally {
    if (browser) await browser.close();
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
}
