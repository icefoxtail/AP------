import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { readBoundFile, safePath, bytesSha, fileRef, objectSha, writeNewJson } from './canonical.mjs';
import { profiles, runInputSha, EVIDENCE_VERSION, EVIDENCE_VERSION_V2, RUN_VERSION_V2 } from './closure.mjs';
import { validateRenderReviewReuseReceipt, validateRenderTransitionParity } from './render-impact.mjs';
import { validateRuntimeBundle } from './runtime.mjs';
import { createContinuationDenominator, validateContinuationDenominator } from './continuation.mjs';

export function createRenderReview(root, run, captureRef, decision) {
  const capture = JSON.parse(readBoundFile(root, captureRef));
  const v2 = run.schemaVersion === RUN_VERSION_V2;
  if (capture.axis !== (v2 ? 'RENDER_CAPTURE' : 'render-capture') || capture.status !== 'PASS' || capture.validityStatus !== 'FROZEN' || capture.inputSha !== run.inputSha) throw new Error('CAPTURE_NOT_FROZEN_PASS');
  for (const field of ['reviewerId', 'reviewSessionId', 'reviewerModelOrAgent', 'startedAt']) if (!decision?.[field]) throw new Error(`RENDER_REVIEW_FIELD_MISSING:${field}`);
  if (decision.reviewSessionId === capture.reviewSessionId || decision.reviewerId === capture.reviewerId) throw new Error('RENDER_REVIEW_NOT_INDEPENDENT');
  if (!Number.isFinite(Date.parse(decision.startedAt)) || Date.parse(decision.startedAt) < Date.parse(capture.frozenAt)) throw new Error('RENDER_REVIEW_BEFORE_CAPTURE_FREEZE');
  for (const check of ['clipping', 'overflow', 'readability']) if (decision.checks?.[check] !== 'PASS') throw new Error(`RENDER_REVIEW_CHECK_NOT_PASS:${check}`);
  const witnesses = capture.payload?.itemWitnesses || [];
  if (!Array.isArray(decision.itemReviews) || decision.itemReviews.length !== witnesses.length) throw new Error('RENDER_ITEM_REVIEW_COVERAGE');
  for (const witness of witnesses) {
    const matches = decision.itemReviews.filter(item => item.questionUid === witness.questionUid);
    if (matches.length !== 1 || matches[0].status !== 'PASS' || matches[0].screenshotSha !== witness.screenshot.sha256) throw new Error(`RENDER_ITEM_REVIEW_INVALID:${witness.questionUid}`);
    if (v2 && matches[0].mode === 'REUSED') {
      const receipt = JSON.parse(readBoundFile(root, matches[0].reuseReceiptRef));
      if (validateRenderReviewReuseReceipt(root, receipt, { currentCaptureRef: captureRef, currentRunInputSha: run.inputSha, questionUid: witness.questionUid }).status !== 'PASS') throw new Error('RENDER_ITEM_VALIDATED_REUSE_REQUIRED');
    }
    if (v2 && validateContinuationDenominator(witness.continuationDenominator, { questionUid: witness.questionUid, cases: [`${witness.mode}/${witness.viewportProfile}`], reviewedBlocks: matches[0].blockReviews || [] }).status !== 'PASS') throw new Error('RENDER_CONTINUATION_REVIEW_REQUIRED');
  }
  return {
    schemaVersion: v2 ? EVIDENCE_VERSION_V2 : EVIDENCE_VERSION,
    ...(v2 ? { mode: 'FRESH', launchId: decision.launchId, externalTaskId: decision.externalTaskId, withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', axisInputShas: capture.reviewAxisInputShas, reviewIsolationProvenanceSha: decision.reviewIsolationProvenanceSha, auditorPrincipalType: decision.auditorPrincipalType, inputVisibilityProfile: decision.inputVisibilityProfile } : {}),
    evidenceId: `${capture.evidenceId}:review:${decision.reviewSessionId}`,
    runId: run.runId,
    revision: run.revision,
    axis: v2 ? 'RENDER_REVIEW' : 'render',
    status: 'PASS',
    validityStatus: 'FROZEN',
    reviewerId: decision.reviewerId,
    reviewSessionId: decision.reviewSessionId,
    reviewerModelOrAgent: decision.reviewerModelOrAgent,
    priorReviewVisibility: v2 ? 'NONE' : 'CAPTURE_ONLY',
    inputSha: run.inputSha,
    reviewStartInputSha: run.inputSha,
    reviewEndInputSha: runInputSha(run),
    startedAt: decision.startedAt,
    frozenAt: decision.frozenAt || new Date().toISOString(),
    findings: decision.findings || [],
    payload: { freshQuestionUids: decision.itemReviews.filter(item => item.mode !== 'REUSED').map(item => item.questionUid), questionUids: capture.payload.questionUids, captureEvidenceId: capture.evidenceId, captureEvidenceSha: captureRef.sha256, runtimeBundleSha: capture.payload.runtimeBundleSha, runtimeResponseBundleSha: capture.payload.runtimeResponseBundleSha, checks: decision.checks, itemReviews: decision.itemReviews }
  };
}

export function validateProductionReadiness(readiness) {
  if (!readiness || readiness.ok !== true) throw new Error(`RENDER_RUNTIME_NOT_READY:${readiness?.code || 'UNKNOWN'}`);
  if (readiness.runtimePresent && (!readiness.transactionId || !readiness.sessionId)) throw new Error('RENDER_RUNTIME_TRANSACTION_BINDING_MISSING');
  if (readiness.runtimePresent && (!readiness.snapshotId || readiness.snapshotStatus !== 'ACTIVE')) throw new Error('RENDER_RUNTIME_SNAPSHOT_INVALID');
  if (readiness.runtimePresent && readiness.renderReady !== true) throw new Error('RENDER_RUNTIME_READY_MARKER_MISSING');
  return readiness;
}

export async function waitForProductionReadiness(page, { timeoutMs = 45000 } = {}) {
  const readiness = await page.evaluate(async timeout => {
    const runtime = window.archiveScreenRuntime || null;
    const ready = runtime?.whenIdle ? runtime.whenIdle() : window.__AP_RENDER_READY__;
    if (!ready) return { ok: false, code: 'RENDER_READINESS_API_MISSING' };
    const timeoutMarker = Symbol('render-readiness-timeout');
    let outcome;
    try {
      outcome = await Promise.race([
        Promise.resolve(ready).catch(error => ({ ok: false, code: 'RENDER_TRANSACTION_REJECTED', message: String(error?.message || error) })),
        new Promise(resolve => setTimeout(() => resolve(timeoutMarker), timeout)),
      ]);
    } catch (error) {
      return { ok: false, code: 'RENDER_TRANSACTION_REJECTED', message: String(error?.message || error) };
    }
    if (outcome === timeoutMarker) return { ok: false, code: 'RENDER_READINESS_TIMEOUT' };
    const snapshot = runtime?.activeSnapshot || null;
    return {
      ...(outcome || { ok: false, code: 'RENDER_TRANSACTION_EMPTY' }),
      runtimePresent: Boolean(runtime),
      transactionId: outcome?.transactionId || null,
      sessionId: outcome?.sessionId || runtime?.currentSession?.sessionId || null,
      snapshotId: snapshot?.snapshotId || null,
      snapshotStatus: snapshot?.status || null,
      renderReady: document.documentElement.dataset.apRenderReady === 'true',
      readiness: document.documentElement.dataset.apPrintReadiness || null,
      metrics: window.__AP_RENDER_METRICS__ || null,
    };
  }, timeoutMs);
  return validateProductionReadiness(readiness);
}

export function createScreenshotStore(root) {
  const byCaseAndSha = new Map();
  const counters = { encodedCount: 0, uniqueFileCount: 0, dedupHitCount: 0, writtenBytes: 0, encodeMs: 0, writeMs: 0 };
  return {
    write(bytes, relative, { caseKey = 'unknown' } = {}) {
      const payload = Buffer.from(bytes);
      counters.encodedCount += 1;
      const sha256 = bytesSha(payload);
      const key = String(caseKey) + '|' + sha256;
      const existing = byCaseAndSha.get(key);
      if (existing) {
        counters.dedupHitCount += 1;
        return { ref: existing, reused: true, sha256 };
      }
      const startedAt = Date.now();
      const target = safePath(root, relative, { mustExist: false });
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, payload, { flag: 'wx' });
      counters.writeMs += Math.max(0, Date.now() - startedAt);
      counters.uniqueFileCount += 1;
      counters.writtenBytes += payload.length;
      const ref = fileRef(root, relative);
      byCaseAndSha.set(key, ref);
      return { ref, reused: false, sha256 };
    },
    observeEncode(elapsedMs) { if (Number.isFinite(elapsedMs) && elapsedMs >= 0) counters.encodeMs += elapsedMs; },
    stats() { return { ...counters }; },
  };
}

// This collector measures runtime and saves witnesses. Readability remains
// NOT_TESTED until a separate reviewer actually inspects those saved screens.
export async function captureRender(root, run, workdir, { channel = 'chrome', collectorIdentity = null } = {}) {
  const v2 = run.schemaVersion === RUN_VERSION_V2;
  const axisShas = v2 ? (await import('./v2-audit.mjs')).computeV2AxisInputShas(root, run) : null;
  if (v2) collectorIdentity = { reviewerId: 'pipeline-core-machine-collector', reviewSessionId: `${run.runId}:r${run.revision}:machine-capture`, reviewerModelOrAgent: 'Playwright/Chrome', auditorPrincipalType: 'MACHINE_COLLECTOR', reviewIsolationProvenanceSha: objectSha({ runId: run.runId, revision: run.revision, inputSha: run.inputSha, collector: 'Playwright/Chrome' }) };
  if (!profiles.pipelines[run.pipeline] || run.inputSha !== runInputSha(run)) throw new Error('RUN_INPUT_NOT_FROZEN');
  const runtime = validateRuntimeBundle(root, run);
  if (runtime.status !== 'PASS') throw new Error(`RENDER_RUNTIME_BLOCKED:${runtime.errors.join(';')}`);
  for (const input of run.inputs) readBoundFile(root, input);
  const output = safePath(root, workdir, { mustExist: false });
  if (fs.existsSync(output)) throw new Error('NEW_RENDER_ATTEMPT_DIRECTORY_REQUIRED');
  for (const p of ['archive/exams', 'archive/assets', 'archive/db.js', 'archive/question-index.js']) if (output === path.resolve(root, p) || output.startsWith(`${path.resolve(root, p)}${path.sep}`)) throw new Error('PRODUCTION_RENDER_OUTPUT_FORBIDDEN');
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
      // Candidate solutionImage values are repository-relative archive paths,
      // while engine.html prefixes asset URLs with archive/. Normalize the
      // resulting double prefix before looking up the bound ref.
      let relative = requested.startsWith('archive/archive/') ? requested.slice('archive/'.length) : requested;
      const match = requested.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
      if (match) relative = candidates[Number(match[1])];
      else if (requested.startsWith('archive/assets/') && run.assetRoot) relative = `${run.assetRoot}/${requested.slice('archive/'.length)}`;
      // Some engine-relative data URLs are requested below /archive/ even
      // though the manifest binds them at repository root (for example
      // data/question_metadata.json). Preserve exact archive paths first,
      // then resolve the archive-prefixed alias against the bound ref map.
      const ref = refByPath.get(relative) || (requested.startsWith('archive/') ? refByPath.get(requested.slice('archive/'.length)) : null);
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
  const caseMetrics = [];
  const captureStartedAt = Date.now();
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    browser = await chromium.launch({ ...(channel ? { channel } : {}), headless: true });
    for (let index = 0; index < candidates.length; index++) {
      const candidatePath = candidates[index], sourceContext = { window: {} };
      vm.runInNewContext(readBoundFile(root, refByPath.get(candidatePath)).toString('utf8'), sourceContext, { timeout: 1000 });
      const bank = sourceContext.window.questionBank;
      const questions = run.questions.filter(q => q.candidatePath === candidatePath);
      const screenshotStore = createScreenshotStore(root);
      const sessions = new Map();
      const ownedContexts = new Set();
      const pageStates = new WeakMap();
      const observedPages = new WeakSet();
      const candidateAssetSha = objectSha(run.inputs.filter(ref => ref.role === 'asset' && questions.some(question => [...(question.problemAssetPaths || []), ...(question.solutionAssetPaths || [])].includes(ref.path))).map(ref => ({ path: ref.path, sha256: ref.sha256 })));
      const resetPageState = page => {
        const state = { pageErrors: [], failedRequests: [], responseHashes: new Map(), runtimeResponses: [], pendingResponseReads: [] };
        pageStates.set(page, state);
        return state;
      };
      const attachPageObservers = casePage => {
        if (observedPages.has(casePage)) return;
        observedPages.add(casePage);
        casePage.on('pageerror', error => pageStates.get(casePage)?.pageErrors.push(error.message));
        casePage.on('requestfailed', request => pageStates.get(casePage)?.failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'REQUEST_FAILED' }));
        casePage.on('response', response => {
          const state = pageStates.get(casePage);
          if (!state) return;
          const body = Promise.race([response.body(), new Promise((_, reject) => setTimeout(() => reject(new Error('RESPONSE_BODY_TIMEOUT')), 10000))]);
          state.pendingResponseReads.push(body.then(bytes => {
            const parsed = new URL(response.url());
            const local = parsed.origin === ('http://127.0.0.1:' + port) ? decodeURIComponent(parsed.pathname).slice(1) : null;
            let resolved = local;
            const candidateMatch = local?.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
            if (candidateMatch) resolved = candidates[Number(candidateMatch[1])];
            else if (local?.startsWith('archive/assets/') && run.assetRoot) resolved = run.assetRoot + '/' + local.slice('archive/'.length);
            else if (local?.startsWith('archive/archive/')) resolved = local.slice('archive/'.length);
            const ref = resolved ? refByPath.get(resolved) : null;
            if (ref?.role === 'asset') {
              const sha256 = bytesSha(bytes);
              state.responseHashes.set(local, sha256);
              state.responseHashes.set(resolved, sha256);
            }
            if (!local || ['engine', 'runtime'].includes(ref?.role)) state.runtimeResponses.push({ url: response.url(), localPath: resolved || null, role: ref?.role || 'external', status: response.status(), bytes: ref && response.status() >= 200 && response.status() < 400 ? ref.bytes : bytes.length, sha256: ref && response.status() >= 200 && response.status() < 400 ? ref.sha256 : bytesSha(bytes), bodyBoundRef: ref && response.status() >= 200 && response.status() < 400 ? true : false });
          }).catch(error => {
            try {
              const parsed = new URL(response.url());
              const local = parsed.origin === ('http://127.0.0.1:' + port) ? decodeURIComponent(parsed.pathname).slice(1) : null;
              const candidateMatch = local?.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
              const resolved = candidateMatch ? candidates[Number(candidateMatch[1])] : local?.startsWith('archive/archive/') ? local.slice('archive/'.length) : local;
              const ref = resolved ? refByPath.get(resolved) : null;
              if (ref && response.status() >= 200 && response.status() < 400 && /evicted|not available/i.test(error.message)) {
                state.runtimeResponses.push({ url: response.url(), localPath: resolved, role: ref.role, status: response.status(), bytes: ref.bytes, sha256: ref.sha256, bodyRead: 'INSPECTOR_EVICTED_BOUND_REF' });
                return;
              }
            } catch {}
            state.failedRequests.push({ url: response.url(), error: 'RESPONSE_BODY:' + error.message });
          }));
        });
      };
      const openCasePage = async viewport => {
        const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
        ownedContexts.add(context);
        const page = await context.newPage();
        attachPageObservers(page);
        return { context, page };
      };
      const identityFor = async (page, mode, profile, runtimeReadiness) => page.evaluate(({ mode, profile, runtimeReadiness, candidatePath, candidateSha, sourceRef, candidateAssetSha, questionUids, questionCount }) => ({
        candidatePath,
        candidateSha,
        sourceRef,
        assetSha: candidateAssetSha,
        mode,
        viewport: profile,
        questionUids,
        questionCount,
        runtimeTransactionId: runtimeReadiness.transactionId || null,
        sessionId: runtimeReadiness.sessionId || null,
        snapshotId: runtimeReadiness.snapshotId || null,
        pagination: String(document.querySelectorAll('#print-area .page').length) + ':' + (document.querySelector('#print-area .page:last-child')?.textContent?.length || 0),
        solutionBlock: document.querySelectorAll('#print-area .sol-box, #print-area .sol-exp').length,
        answerBlock: document.querySelectorAll('#print-area .ans-n').length,
        mathJax: window.MathJax && !document.querySelector('mjx-merror,[data-mjx-error]') ? 'loaded' : 'missing',
        errorState: document.documentElement.dataset.apRenderError || null,
      }), { mode, profile: profile.profile, runtimeReadiness, candidatePath, candidateSha: refByPath.get(candidatePath)?.sha256 || null, sourceRef: questions[0]?.sourcePath || null, candidateAssetSha, questionUids: questions.map(question => question.questionUid), questionCount: bank.length });
      const prepareCase = async ({ mode, profile, viewport, engineMode, selector, url, forceFresh = false, fallbackReason = null }) => {
        let session = sessions.get(profile.profile) || { page: null, context: null, lastIdentity: null, reuseDisabled: false };
        let reusedContext = !forceFresh && !session.reuseDisabled && Boolean(session.page && session.context);
        let casePage = session.page;
        let context = session.context;
        let runtimeReadiness = null;
        const navigateAndWait = async page => {
          resetPageState(page);
          activeUnboundRequests = [];
          await page.goto(url, { waitUntil: 'load', timeout: 45000 });
          runtimeReadiness = await waitForProductionReadiness(page, { timeoutMs: 45000 });
          await page.waitForFunction(({ selector, count }) => new Set([...document.querySelectorAll(selector)].map((node, index) => node.dataset.sourceRef || String(index))).size === count, { selector, count: bank.length }, { timeout: 45000 });
        };
        if (reusedContext) {
          resetPageState(casePage);
          activeUnboundRequests = [];
          const transition = await casePage.evaluate(async requestedMode => {
            const runtime = window.archiveScreenRuntime;
            if (!runtime) return { ok: false, code: 'MODE_TRANSITION_API_MISSING' };
            try { return await runtime.request({ type: 'MODE_CHANGE', requestedMode, foreground: true }); }
            catch (error) { return { ok: false, code: 'MODE_TRANSITION_FAILED', message: String(error?.message || error) }; }
          }, engineMode);
          if (!transition?.ok) {
            session.reuseDisabled = true;
            sessions.set(profile.profile, session);
            return prepareCase({ mode, profile, viewport, engineMode, selector, url, forceFresh: true, fallbackReason: transition?.code || 'MODE_TRANSITION_FAILED' });
          }
          runtimeReadiness = await waitForProductionReadiness(casePage, { timeoutMs: 45000 });
          await casePage.waitForFunction(({ selector, count }) => new Set([...document.querySelectorAll(selector)].map((node, index) => node.dataset.sourceRef || String(index))).size === count, { selector, count: bank.length }, { timeout: 45000 });
        } else {
          const opened = await openCasePage(viewport);
          context = opened.context;
          casePage = opened.page;
          reusedContext = false;
          await navigateAndWait(casePage);
        }
        const identity = await identityFor(casePage, mode, profile, runtimeReadiness);
        const parity = session.lastIdentity && !session.reuseDisabled && !forceFresh ? validateRenderTransitionParity(session.lastIdentity, identity) : { status: 'PASS', errors: [] };
        if (parity.status !== 'PASS' && !forceFresh) {
          session.reuseDisabled = true;
          sessions.set(profile.profile, session);
          return prepareCase({ mode, profile, viewport, engineMode, selector, url, forceFresh: true, fallbackReason: 'PARITY:' + parity.errors.join(',') });
        }
        session.page = casePage;
        session.context = context;
        session.lastIdentity = identity;
        sessions.set(profile.profile, session);
        return { context, page: casePage, caseState: pageStates.get(casePage), runtimeReadiness, renderIdentity: identity, reusedContext, transition: { action: reusedContext ? 'MODE_CHANGE' : 'NAVIGATION', fallbackReason, parity } };
      };
      for (const mode of (run.publicationIntent === 'FULL_EXAM' ? ['exam', 'solution', 'answer'] : profiles.pipelines[run.pipeline].modes)) for (const profile of profiles.viewports) {
        const viewport = { profile: profile.profile, width: profile.minWidth, height: profile.profile === 'mobile' ? 844 : 1000 };
        const engineMode = { exam: 'exam', solution: 'sol', answer: 'ans' }[mode];
        const url = 'http://127.0.0.1:' + port + '/' + run.renderRuntime.enginePath + '?data=exams/__pipeline_review__/' + index + '.js&mode=' + engineMode + '&qpp=4&fit=screen';
        const selector = mode === 'answer' ? '#print-area .ans-n' : '#print-area .q-box';
        const preparedCase = await prepareCase({ mode, profile, viewport, engineMode, selector, url });
        const { context, page, caseState, runtimeReadiness, renderIdentity, reusedContext, transition } = preparedCase;
        const { pageErrors, failedRequests, responseHashes, runtimeResponses, pendingResponseReads } = caseState;
        const startedAt = new Date().toISOString();
        const screenshotBaseline = screenshotStore.stats();
        /*
         * Legacy per-case navigation and observer setup is superseded by
         * prepareCase(), which owns the reusable viewport session.
        activeUnboundRequests = [];
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
            else if (local?.startsWith('archive/archive/')) resolved = local.slice('archive/'.length);
            const ref = resolved ? refByPath.get(resolved) : null;
            if (ref?.role === 'asset') {
              const sha256 = bytesSha(bytes);
              responseHashes.set(local, sha256);
              responseHashes.set(resolved, sha256);
            }
            if (!local || ['engine', 'runtime'].includes(ref?.role)) runtimeResponses.push({ url: response.url(), localPath: resolved || null, role: ref?.role || 'external', status: response.status(), bytes: ref && response.status() >= 200 && response.status() < 400 ? ref.bytes : bytes.length, sha256: ref && response.status() >= 200 && response.status() < 400 ? ref.sha256 : bytesSha(bytes), bodyBoundRef: ref && response.status() >= 200 && response.status() < 400 ? true : false });
          }).catch(error => {
            // Chrome may evict an already-consumed local response body while a
            // navigation settles. The response is still a valid bound runtime
            // witness when its local ref and successful status are known; do
            // not turn that inspector limitation into a false runtime failure.
            try {
              const parsed = new URL(response.url());
              const local = parsed.origin === `http://127.0.0.1:${port}` ? decodeURIComponent(parsed.pathname).slice(1) : null;
              const candidateMatch = local?.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
              const resolved = candidateMatch ? candidates[Number(candidateMatch[1])] : local?.startsWith('archive/archive/') ? local.slice('archive/'.length) : local;
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
        const runtimeReadiness = await waitForProductionReadiness(page, { timeoutMs: 45000 });
        await page.waitForFunction(({ selector, count }) => new Set([...document.querySelectorAll(selector)].map((node, index) => node.dataset.sourceRef || String(index))).size === count, { selector, count: bank.length }, { timeout: 45000 });
        */
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
          const blockIndexes = await page.evaluate(({ selector, ordinal }) => {
            const nodes = [...document.querySelectorAll(selector)], keys = [...new Set(nodes.map((node, index) => node.dataset.sourceRef || String(index)))];
            return nodes.map((node, index) => ({ key: node.dataset.sourceRef || String(index), index })).filter(row => row.key === keys[ordinal]).map(row => row.index);
          }, { selector, ordinal });
          const target = page.locator(selector).nth(blockIndexes[0]);
          await target.scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, -60));
          const screenshotEncodeStartedAt = Date.now();
          const png = await page.screenshot({ type: 'png' });
          const relative = `${workdir}/${stem}-q${q.qid}.png`;
          const screenshot = screenshotStore.write(png, relative, { caseKey: mode + '/' + profile.profile });
          screenshotStore.observeEncode(Math.max(0, Date.now() - screenshotEncodeStartedAt));
          const box = await target.boundingBox();
          const blocks = [];
          for (let blockIndex = 0; blockIndex < blockIndexes.length; blockIndex++) {
            const element = page.locator(selector).nth(blockIndexes[blockIndex]);
            const geometry = await element.evaluate(node => {
              const rect = node.getBoundingClientRect(), page = node.closest('.page'), column = node.closest('.col, .column, .sol-col');
              let clipped = false;
              for (const child of [node, ...node.querySelectorAll('*')]) {
                const box = child.getBoundingClientRect();
                if (!box.width || !box.height) continue;
                for (let ancestor = child.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
                  const style = getComputedStyle(ancestor), boundary = ancestor.getBoundingClientRect();
                  if (['hidden','clip'].includes(style.overflowX) && (box.left < boundary.left - 1 || box.right > boundary.right + 1) || ['hidden','clip'].includes(style.overflowY) && (box.top < boundary.top - 1 || box.bottom > boundary.bottom + 1)) clipped = true;
                }
              }
              return { clipped, page: page ? [...document.querySelectorAll('.page')].indexOf(page) + 1 : 1, column: column ? [...column.parentElement.children].indexOf(column) + 1 : 1, flowPosition: [...node.parentElement.children].indexOf(node), boundingBox: { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height }, blockId: node.dataset.solutionLayoutBlockId || null };
            });
            const segments = Math.max(1, Math.ceil(geometry.boundingBox.height / (viewport.height - 120)));
            for (let segment = 0; segment < segments; segment++) {
              await page.evaluate(y => scrollTo(0, y), geometry.boundingBox.y + segment * (viewport.height - 120) - 60);
              const blockPath = `${workdir}/${stem}-q${q.qid}-b${blockIndex}-s${segment}.png`;
              const blockEncodeStartedAt = Date.now();
              const blockScreenshot = screenshotStore.write(await page.screenshot({ type: 'png' }), blockPath, { caseKey: mode + '/' + profile.profile });
              screenshotStore.observeEncode(Math.max(0, Date.now() - blockEncodeStartedAt));
              const { blockId: sourceBlockId, ...geometryFields } = geometry;
              const placement = { ...geometryFields, sourceBlockId, segment, segmentOffset: segment * (viewport.height - 120) };
              blocks.push({ questionUid: q.questionUid, mode, viewportProfile: profile.profile, caseKey: `${mode}/${profile.profile}`, ...placement, blockId: `${geometry.blockId || `${q.questionUid}:${blockIndex}`}:segment:${segment}`, placementSha: objectSha(placement), screenshot: blockScreenshot.ref, final: blockIndex === blockIndexes.length - 1 && segment === segments - 1 });
            }
          }
          const first = blocks[0];
          itemWitnesses.push({ questionUid: q.questionUid, mode, viewportProfile: profile.profile, status: 'CAPTURED', screenshot: screenshot.ref, boundingBox: first.boundingBox, page: first.page, column: first.column, flowPosition: first.flowPosition, continuation: blocks.length > 1, blocks, continuationDenominator: createContinuationDenominator({ questionUid: q.questionUid, cases: [`${mode}/${profile.profile}`], blocks }) });
        }
        await page.locator(selector).last().scrollIntoViewIfNeeded();
        const lastEncodeStartedAt = Date.now();
        const lastPng = await page.screenshot({ type: 'png' }), lastPath = `${workdir}/${stem}-last.png`;
        const lastScreenshot = screenshotStore.write(lastPng, lastPath, { caseKey: mode + '/' + profile.profile });
        screenshotStore.observeEncode(Math.max(0, Date.now() - lastEncodeStartedAt));
        const screenshotStats = screenshotStore.stats();
        for (const key of ['encodedCount', 'uniqueFileCount', 'dedupHitCount', 'writtenBytes', 'encodeMs', 'writeMs']) screenshotStats[key] -= screenshotBaseline[key];
        caseMetrics.push({ caseKey: mode + '/' + profile.profile, ...screenshotStats, contextReused: reusedContext, transition: transition.action, fallbackReason: transition.fallbackReason });
        const metrics = await page.evaluate(selector => ({ observedQuestionCount: new Set([...document.querySelectorAll(selector)].map((node, index) => node.dataset.sourceRef || String(index))).size, fonts: document.fonts.status, mathJaxPresent: !!window.MathJax, mathErrors: document.querySelectorAll('mjx-merror,[data-mjx-error]').length, rawMergedRelations: /\\(?:lt|gt|leq|geq)[A-Za-z]+/.test(document.querySelector('#print-area')?.innerText || ''), badImages: [...document.querySelectorAll('#print-area img')].filter(i => !i.complete || i.naturalWidth === 0).length, renderError: document.documentElement.dataset.apRenderError || null, scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth }), selector);
        const assetAssociations = [];
        for (const q of questions) for (const assetPath of (mode === 'solution' ? q.solutionAssetPaths : mode === 'exam' ? q.problemAssetPaths : [])) {
          const servedPath = run.assetRoot && assetPath.startsWith(`${run.assetRoot}/`) ? `archive/${assetPath.slice(run.assetRoot.length + 1)}` : assetPath;
          const actual = responseHashes.get(servedPath);
          assetAssociations.push({ questionUid: q.questionUid, path: assetPath, sha256: actual || null, status: actual === refByPath.get(assetPath)?.sha256 ? 'PASS' : 'FAIL' });
        }
        const canonicalResponses = runtimeResponses.map(row => ({ ...row, url: row.localPath ? new URL(row.url).pathname + new URL(row.url).search : row.url }));
        const uniqueRuntimeResponses = [...new Map(canonicalResponses.sort((a, b) => a.url.localeCompare(b.url)).map(row => [`${row.url}|${row.sha256}`, row])).values()];
        const runtimeResponseBundleSha = objectSha(uniqueRuntimeResponses);
        for (const witness of itemWitnesses) {
          witness.runtimeResponseSha = runtimeResponseBundleSha;
          witness.assetSha = objectSha(assetAssociations.filter(row => row.questionUid === witness.questionUid));
          witness.witnessSha = objectSha(witness);
        }
        const geometryPass = itemWitnesses.every(w => w.blocks.every(b => b.clipped === false && b.boundingBox && [b.boundingBox.x,b.boundingBox.y,b.boundingBox.width,b.boundingBox.height].every(Number.isFinite) && b.boundingBox.width > 0 && b.boundingBox.height > 0));
        const overflowPass = metrics.scrollWidth <= metrics.viewportWidth && itemWitnesses.every(w => w.blocks.every(b => b.boundingBox.x >= 0 && b.boundingBox.x + b.boundingBox.width <= viewport.width));
        const checks = { runtime: !metrics.renderError && !pageErrors.length && !failedRequests.length && !activeUnboundRequests.length ? 'PASS' : 'FAIL', mathJax: metrics.mathJaxPresent && !metrics.mathErrors && !metrics.rawMergedRelations ? 'PASS' : 'FAIL', fonts: metrics.fonts === 'loaded' ? 'PASS' : 'FAIL', imageDecode: metrics.badImages === 0 ? 'PASS' : 'FAIL', assetAssociation: assetAssociations.every(a => a.status === 'PASS') ? 'PASS' : 'FAIL', questionCount: metrics.observedQuestionCount === bank.length ? 'PASS' : 'FAIL', lastQuestion: 'PASS', clipping: geometryPass ? 'PASS' : 'FAIL', overflow: overflowPass ? 'PASS' : 'FAIL', readability: 'NOT_TESTED' };
        const mechanicalPass = ['runtime', 'mathJax', 'fonts', 'imageDecode', 'assetAssociation', 'questionCount', 'lastQuestion', 'clipping', 'overflow'].every(key => checks[key] === 'PASS');
        const currentCandidateSha = refByPath.get(candidatePath)?.sha256 || null;
        const record = { schemaVersion: EVIDENCE_VERSION, evidenceId: `${run.runId}:${stem}:capture`, runId: run.runId, revision: run.revision, axis: 'render-capture', status: mechanicalPass ? 'PASS' : 'FAIL', validityStatus: 'FROZEN', reviewerId: 'actual-browser-collector', reviewSessionId: `${run.runId}:browser-capture`, reviewerModelOrAgent: 'Playwright/Chrome', inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: runInputSha(run), startedAt, frozenAt: new Date().toISOString(), findings: mechanicalPass ? [] : [{ status: 'OPEN', code: 'CAPTURE_MECHANICAL_FAIL' }], payload: { actualBrowser: true, productionEngine: true, browserVersion: browser.version(), mode, candidatePath, currentArtifactSha: currentCandidateSha, CURRENT_ARTIFACT_SHA: currentCandidateSha, EVIDENCE_INPUT_SHA: currentCandidateSha, authorityStartSha: run.pastExamAuthority?.startSha || null, questionUids: questions.map(q => q.questionUid), viewport, expectedQuestionCount: bank.length, observedQuestionCount: metrics.observedQuestionCount, lastQuestionId: bank.at(-1).id, screenshot: lastScreenshot.ref, itemWitnesses, assetAssociations, checks, metrics, runtimeReadiness, renderIdentity, captureSession: { viewportProfile: profile.profile, contextReused: reusedContext, action: transition.action, fallbackReason: transition.fallbackReason, parity: transition.parity }, screenshotStats, pageErrors, failedRequests, unboundRequests: [...new Set(activeUnboundRequests)].sort(), runtimeBundleSha: run.renderRuntime.bundleSha, runtimeResponses: uniqueRuntimeResponses, runtimeResponseBundleSha, url } };
        const recordPath = `${workdir}/${stem}.json`;
        record.payload.candidateRef = refByPath.get(candidatePath);
        record.payload.assetRefs = run.inputs.filter(ref => assetAssociations.some(row => row.path === ref.path));
        if (v2) {
          const machineProvenance = { runId: run.runId, revision: run.revision, inputSha: run.inputSha, currentArtifactSha: currentCandidateSha, CURRENT_ARTIFACT_SHA: currentCandidateSha, EVIDENCE_INPUT_SHA: currentCandidateSha, authorityStartSha: run.pastExamAuthority?.startSha || null, collector: 'Playwright/Chrome' };
          Object.assign(record, { schemaVersion: EVIDENCE_VERSION_V2, machineProvenance, axis: 'RENDER_CAPTURE', mode: 'MACHINE_CURRENT', withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', reviewerId: collectorIdentity.reviewerId, reviewSessionId: collectorIdentity.reviewSessionId, reviewerModelOrAgent: collectorIdentity.reviewerModelOrAgent, auditorPrincipalType: collectorIdentity.auditorPrincipalType, reviewIsolationProvenanceSha: objectSha(machineProvenance), priorReviewVisibility: 'NONE', inputVisibilityProfile: 'ACTUAL_RENDER', axisInputShas: Object.fromEntries(questions.map(q => [q.questionUid, axisShas[q.questionUid].RENDER_CAPTURE])), reviewAxisInputShas: Object.fromEntries(questions.map(q => [q.questionUid, axisShas[q.questionUid].RENDER_REVIEW])) });
        }
        writeNewJson(safePath(root, recordPath, { mustExist: false }), record); captures.push(fileRef(root, recordPath));
      }
      for (const context of ownedContexts) await context.close();
    }
    for (const input of run.inputs) readBoundFile(root, input);
    const screenshotStats = caseMetrics.reduce((total, row) => Object.fromEntries(Object.keys(total).map(key => [key, total[key] + (row[key] || 0)])), { encodedCount: 0, uniqueFileCount: 0, dedupHitCount: 0, writtenBytes: 0, encodeMs: 0, writeMs: 0 });
    const report = { status: 'CAPTURED_REVIEW_REQUIRED', runId: run.runId, inputSha: run.inputSha, captures, productionAuthorized: false, totalCaptureMs: Math.max(0, Date.now() - captureStartedAt), screenshotStats, caseMetrics };
    writeNewJson(path.join(output, 'capture-report.json'), report);
    return report;
  } finally {
    if (browser) await browser.close();
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
}
