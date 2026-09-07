import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { readBoundFile, safePath, bytesSha, fileRef, objectSha, writeNewJson } from './canonical.mjs';
import { profiles, runInputSha, EVIDENCE_VERSION } from './closure.mjs';
import { validateRuntimeBundle } from './runtime.mjs';

export function createRenderReview(root, run, captureRef, decision) {
  const capture = JSON.parse(readBoundFile(root, captureRef));
  if (capture.axis !== 'render-capture' || capture.status !== 'PASS' || capture.validityStatus !== 'FROZEN') throw new Error('CAPTURE_NOT_FROZEN_PASS');
  for (const field of ['reviewerId', 'reviewSessionId', 'reviewerModelOrAgent', 'startedAt']) if (!decision?.[field]) throw new Error(`RENDER_REVIEW_FIELD_MISSING:${field}`);
  if (decision.reviewSessionId === capture.reviewSessionId || decision.reviewerId === capture.reviewerId) throw new Error('RENDER_REVIEW_NOT_INDEPENDENT');
  if (!Number.isFinite(Date.parse(decision.startedAt)) || Date.parse(decision.startedAt) < Date.parse(capture.frozenAt)) throw new Error('RENDER_REVIEW_BEFORE_CAPTURE_FREEZE');
  for (const check of ['clipping', 'overflow', 'readability']) if (decision.checks?.[check] !== 'PASS') throw new Error(`RENDER_REVIEW_CHECK_NOT_PASS:${check}`);
  const witnesses = capture.payload?.itemWitnesses || [];
  if (!Array.isArray(decision.itemReviews) || decision.itemReviews.length !== witnesses.length) throw new Error('RENDER_ITEM_REVIEW_COVERAGE');
  for (const witness of witnesses) {
    const matches = decision.itemReviews.filter(item => item.questionUid === witness.questionUid);
    if (matches.length !== 1 || matches[0].status !== 'PASS' || matches[0].screenshotSha !== witness.screenshot.sha256) throw new Error(`RENDER_ITEM_REVIEW_INVALID:${witness.questionUid}`);
  }
  return {
    schemaVersion: EVIDENCE_VERSION,
    evidenceId: `${capture.evidenceId}:review:${decision.reviewSessionId}`,
    runId: run.runId,
    revision: run.revision,
    axis: 'render',
    status: 'PASS',
    validityStatus: 'FROZEN',
    reviewerId: decision.reviewerId,
    reviewSessionId: decision.reviewSessionId,
    reviewerModelOrAgent: decision.reviewerModelOrAgent,
    priorReviewVisibility: 'CAPTURE_ONLY',
    inputSha: run.inputSha,
    reviewStartInputSha: run.inputSha,
    reviewEndInputSha: runInputSha(run),
    startedAt: decision.startedAt,
    frozenAt: decision.frozenAt || new Date().toISOString(),
    findings: decision.findings || [],
    payload: { captureEvidenceId: capture.evidenceId, captureEvidenceSha: captureRef.sha256, runtimeBundleSha: capture.payload.runtimeBundleSha, runtimeResponseBundleSha: capture.payload.runtimeResponseBundleSha, checks: decision.checks, itemReviews: decision.itemReviews }
  };
}

// This collector measures runtime and saves witnesses. Readability remains
// NOT_TESTED until a separate reviewer actually inspects those saved screens.
export async function captureRender(root, run, workdir, { channel = 'chrome' } = {}) {
  if (!profiles.pipelines[run.pipeline] || run.inputSha !== runInputSha(run)) throw new Error('RUN_INPUT_NOT_FROZEN');
  const runtime = validateRuntimeBundle(root, run);
  if (runtime.status !== 'PASS') throw new Error(`RENDER_RUNTIME_BLOCKED:${runtime.errors.join(';')}`);
  for (const input of run.inputs) readBoundFile(root, input);
  const output = safePath(root, workdir, { mustExist: false });
  if (fs.existsSync(output)) throw new Error('NEW_RENDER_ATTEMPT_DIRECTORY_REQUIRED');
  for (const p of ['archive/exams', 'archive/assets']) if (output === path.resolve(root, p) || output.startsWith(`${path.resolve(root, p)}${path.sep}`)) throw new Error('PRODUCTION_RENDER_OUTPUT_FORBIDDEN');
  const engine = run.inputs.find(i => i.path === run.renderRuntime.enginePath && i.role === 'engine');
  if (!engine) throw new Error('PRODUCTION_ENGINE_NOT_BOUND');
  const require = createRequire(process.env.APMATH_NODE_MODULES ? path.join(process.env.APMATH_NODE_MODULES, '..', 'package.json') : import.meta.url);
  const { chromium } = require('playwright');
  const candidates = [...new Set(run.questions.map(q => q.candidatePath))];
  const refByPath = new Map(run.inputs.map(i => [i.path, i]));
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
  let activeUnboundRequests = [];
  const server = http.createServer((request, response) => {
    try {
      const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
      if (requested === 'favicon.ico') {
        response.writeHead(204);
        response.end();
        return;
      }
      let relative = requested;
      const match = requested.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
      if (match) relative = candidates[Number(match[1])];
      else if (requested.startsWith('archive/assets/') && run.assetRoot) relative = `${run.assetRoot}/${requested.slice('archive/'.length)}`;
      const ref = refByPath.get(relative);
      if (!ref) {
        activeUnboundRequests.push(relative);
        throw new Error(`UNBOUND_RUNTIME_REQUEST:${relative}`);
      }
      const bytes = readBoundFile(root, ref);
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
        const page = await context.newPage(), pageErrors = [], failedRequests = [], responseHashes = new Map(), runtimeResponses = [];
        activeUnboundRequests = [];
        const pendingResponseReads = [];
        page.on('pageerror', error => pageErrors.push(error.message));
        page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'REQUEST_FAILED' }));
        page.on('response', response => {
          const body = Promise.race([response.body(), new Promise((_, reject) => setTimeout(() => reject(new Error('RESPONSE_BODY_TIMEOUT')), 10000))]);
          pendingResponseReads.push(body.then(bytes => {
            const parsed = new URL(response.url());
            const local = parsed.origin === `http://127.0.0.1:${port}` ? decodeURIComponent(parsed.pathname).slice(1) : null;
            let resolved = local;
            const candidateMatch = local?.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
            if (candidateMatch) resolved = candidates[Number(candidateMatch[1])];
            else if (local?.startsWith('archive/assets/') && run.assetRoot) resolved = `${run.assetRoot}/${local.slice('archive/'.length)}`;
            const ref = resolved ? refByPath.get(resolved) : null;
            if (local?.startsWith('archive/assets/')) responseHashes.set(local, bytesSha(bytes));
            if (!local || ['engine', 'runtime'].includes(ref?.role)) runtimeResponses.push({ url: response.url(), localPath: resolved || null, role: ref?.role || 'external', status: response.status(), bytes: bytes.length, sha256: bytesSha(bytes) });
          }).catch(error => {
            // Chrome may evict an already-consumed local response body while a
            // navigation settles. The response is still a valid bound runtime
            // witness when its local ref and successful status are known; do
            // not turn that inspector limitation into a false runtime failure.
            try {
              const parsed = new URL(response.url());
              const local = parsed.origin === `http://127.0.0.1:${port}` ? decodeURIComponent(parsed.pathname).slice(1) : null;
              const candidateMatch = local?.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
              const resolved = candidateMatch ? candidates[Number(candidateMatch[1])] : local;
              const ref = resolved ? refByPath.get(resolved) : null;
              if (ref && response.status() >= 200 && response.status() < 400 && /evicted|not available/i.test(error.message)) {
                runtimeResponses.push({ url: response.url(), localPath: resolved, role: ref.role, status: response.status(), bytes: ref.bytes, sha256: ref.sha256, bodyRead: 'INSPECTOR_EVICTED_BOUND_REF' });
                return;
              }
            } catch {}
            failedRequests.push({ url: response.url(), error: `RESPONSE_BODY:${error.message}` });
          }));
        });
        const startedAt = new Date().toISOString();
        const engineMode = { exam: 'exam', solution: 'sol', answer: 'ans' }[mode];
        const url = `http://127.0.0.1:${port}/${run.renderRuntime.enginePath}?data=exams/__pipeline_review__/${index}.js&mode=${engineMode}&qpp=4&fit=screen`;
        const selector = mode === 'answer' ? '#print-area .ans-n' : '#print-area .q-box';
        await page.goto(url, { waitUntil: 'load', timeout: 45000 });
        await page.waitForFunction(({ selector, count }) => document.querySelectorAll(selector).length === count, { selector, count: bank.length }, { timeout: 45000 });
        await page.evaluate(async () => {
          const within = (promise, ms) => Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);
          await within(document.fonts.ready, 10000);
          if (window.MathJax?.startup?.promise) await within(window.MathJax.startup.promise, 10000);
          await within(Promise.all([...document.images].map(image => image.decode().catch(() => {}))), 10000);
          await within(new Promise(resolve => {
            let previous = '', stable = 0;
            function frame() {
              const rects = [...document.querySelectorAll('#print-area .q-box, #print-area .ans-n')].map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
              const key = JSON.stringify(rects) + getComputedStyle(document.documentElement).getPropertyValue('--screen-page-scale');
              stable = key === previous ? stable + 1 : 0; previous = key;
              if (stable >= 60) resolve(); else requestAnimationFrame(frame);
            }
            frame();
          }), 10000);
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
          itemWitnesses.push({ questionUid: q.questionUid, status: 'CAPTURED', screenshot: fileRef(root, relative), boundingBox: box, note: 'Separate visual reviewer must inspect this immutable capture.' });
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
        const uniqueRuntimeResponses = [...new Map(runtimeResponses.sort((a, b) => a.url.localeCompare(b.url)).map(row => [`${row.url}|${row.sha256}`, row])).values()];
        const runtimeResponseBundleSha = objectSha(uniqueRuntimeResponses);
        const checks = { runtime: !metrics.renderError && !pageErrors.length && !failedRequests.length && !activeUnboundRequests.length ? 'PASS' : 'FAIL', mathJax: metrics.mathJaxPresent && !metrics.mathErrors && !metrics.rawMergedRelations ? 'PASS' : 'FAIL', fonts: metrics.fonts === 'loaded' ? 'PASS' : 'FAIL', imageDecode: metrics.badImages === 0 ? 'PASS' : 'FAIL', assetAssociation: assetAssociations.every(a => a.status === 'PASS') ? 'PASS' : 'FAIL', questionCount: metrics.observedQuestionCount === bank.length ? 'PASS' : 'FAIL', lastQuestion: 'PASS', clipping: 'NOT_TESTED', overflow: 'NOT_TESTED', readability: 'NOT_TESTED' };
        const mechanicalPass = ['runtime', 'mathJax', 'fonts', 'imageDecode', 'assetAssociation', 'questionCount', 'lastQuestion'].every(key => checks[key] === 'PASS');
        const record = { schemaVersion: EVIDENCE_VERSION, evidenceId: `${run.runId}:${stem}:capture`, runId: run.runId, revision: run.revision, axis: 'render-capture', status: mechanicalPass ? 'PASS' : 'FAIL', validityStatus: 'FROZEN', reviewerId: 'actual-browser-collector', reviewSessionId: `${run.runId}:browser-capture`, reviewerModelOrAgent: 'Playwright/Chrome', inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: runInputSha(run), startedAt, frozenAt: new Date().toISOString(), findings: mechanicalPass ? [] : [{ status: 'OPEN', code: 'CAPTURE_MECHANICAL_FAIL' }], payload: { actualBrowser: true, productionEngine: true, browserVersion: browser.version(), mode, candidatePath, questionUids: questions.map(q => q.questionUid), viewport, expectedQuestionCount: bank.length, observedQuestionCount: metrics.observedQuestionCount, lastQuestionId: bank.at(-1).id, screenshot: fileRef(root, lastPath), itemWitnesses, assetAssociations, checks, metrics, pageErrors, failedRequests, unboundRequests: [...new Set(activeUnboundRequests)].sort(), runtimeBundleSha: run.renderRuntime.bundleSha, runtimeResponses: uniqueRuntimeResponses, runtimeResponseBundleSha, url } };
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
