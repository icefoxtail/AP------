// Read-only deployed-site smoke for the ten G7 geometry labs.
// Requires playwright@1.56.1 and its Chromium. Run only after Pages release succeeds.
// Syntax/plan only (no browser or network): node g7-student-live-smoke.mjs --plan
// Live: node g7-student-live-smoke.mjs --out .tmp/student-live-smoke
// BASE_URL or --base-url may point to an explicitly chosen test server. Results
// distinguish that target from the exact student URL; event HEAD is never called
// the actual deployed SHA. Release/source identity is verified separately by root.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { createScreenshotGuard, screenshotEnvironmentMatches, SCREENSHOT_ENVIRONMENT_POLICY, VIEWPORT_PIXEL_POLICY } from './browser-screenshot-guard.mjs';
import { captureReviewState } from './high-viewport-evidence.mjs';

const STUDENT_BASE = 'https://icefoxtail.github.io/AP------/apmath/playground/next/labs/';
const UNITS = ['g7-points-lines', 'g7-parallel', 'g7-spatial', 'g7-construction', 'g7-area', 'g7-polygons', 'g7-circle-sector', 'g7-polyhedra', 'g7-surface-volume', 'g7-solids'];
const VIEWPORTS = [{ name: 'pc', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }];
// These exact entry hooks reset step after shell.goScene applies its default.
// Verified against production core.enter and actual initial Chromium captures.
// This is not a blanket allowance for arbitrary step0/step1 states.
const ENTER_INITIAL_STEPS = {
  'g7-spatial': { sceneId: 's1-1', step: 0 },
  'g7-polyhedra': { sceneId: 'p1-0', step: 0 },
  'g7-surface-volume': { sceneId: 'sv1-1', step: 0 }
};
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf(name); if (i < 0) return fallback; if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw Error(`Missing ${name} value`); return argv[i + 1]; };
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--plan') continue;
  if (['--base-url', '--out'].includes(argv[i])) { i++; continue; }
  throw Error(`Unknown option: ${argv[i]}`);
}
const base = new URL(arg('--base-url', process.env.BASE_URL || STUDENT_BASE));
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw Error('Base URL must be an HTTP(S) labs directory without credentials/query/hash');
if (!base.pathname.endsWith('/')) base.pathname += '/';
const catalogURL = new URL('../kit/apl-catalog.js', base).href;
const startedAt = new Date().toISOString();
const out = path.resolve(arg('--out', `.tmp/student-live-smoke-${startedAt.replace(/[:.]/g, '-')}`));
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const eventMetadata = () => {
  let payload = null, payloadReadError = null;
  if (process.env.GITHUB_EVENT_PATH) {
    try { payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')); }
    catch (e) { payloadReadError = e.message; }
  }
  const w = payload?.workflow_run;
  return {
    eventName: process.env.GITHUB_EVENT_NAME || null,
    smokeRunId: process.env.GITHUB_RUN_ID || null,
    smokeRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
    workflowContextSha: process.env.GITHUB_SHA || null,
    releaseRunId: process.env.RELEASE_RUN_ID || w?.id || null,
    releaseWorkflowName: process.env.RELEASE_WORKFLOW_NAME || w?.name || null,
    releaseConclusion: process.env.RELEASE_CONCLUSION || w?.conclusion || null,
    releaseHeadBranch: process.env.RELEASE_HEAD_BRANCH || w?.head_branch || null,
    releaseEventHeadSha: process.env.RELEASE_HEAD_SHA || w?.head_sha || null,
    releaseRunURL: process.env.RELEASE_RUN_URL || w?.html_url || null,
    payloadReadError,
    shaMeaning: 'Event/workflow metadata only; NOT proof of the actual deployed source SHA.'
  };
};
const report = {
  version: 1, kind: base.href === STUDENT_BASE ? 'DEPLOYED_STUDENT_URL_READ_ONLY_SMOKE' : 'LOCAL_HTTP_READ_ONLY_SMOKE', status: 'NOT_RUN', startedAt,
  baseURL: base.href, isExactStudentURL: base.href === STUDENT_BASE,
  event: eventMetadata(), requestedPlaywrightVersion: '1.56.1', viewports: VIEWPORTS,
  expected: { units: UNITS.length, pageLoads: UNITS.length * VIEWPORTS.length, initialAndProblemCaptures: UNITS.length * VIEWPORTS.length * 2 },
  catalog: null, pages: [], failures: [],
  deployedSourceVerification: 'NOT_RUN by this script; root separately checks HTTP bytes and Pages context SHA.',
  physicalDeviceVerification: 'NOT_RUN',
  screenshotEnvironmentPolicy: SCREENSHOT_ENVIRONMENT_POLICY,
  viewportEvidencePolicy: { raw: 'Legacy full-page capture denominator; touch-context pixels UNVERIFIED_BEYOND_VIEWPORT', supporting: 'Fixed-viewport PNGs with actual environment and byte readback; separate denominator', inputCoverage: 'Existing navigation only; no native touch claim' },
  limitations: ['Chromium PC/mobile viewport emulation, not physical devices.', 'One initial scene and its problem screen per unit/viewport; full scene inventory counts are checked, but all scenes are not rendered.', 'Structural answer locking and function-source checks do not prove every mathematical answer or visual layout.', 'No answer reveal, choice selection, slider change, submission, or remote write is performed.']
};
if (argv.includes('--plan')) {
  console.log(JSON.stringify({ ...report, plannedURLs: UNITS.map(id => new URL(`${id}.html?theme=board&manual=1`, base).href) }, null, 2));
  process.exit(0);
}
if (fs.existsSync(path.join(out, 'results.json'))) throw Error('Output already contains results.json; choose a fresh --out directory to preserve evidence');
fs.mkdirSync(out, { recursive: true });
const fail = (reason, detail = {}) => report.failures.push({ reason, ...detail });
const persist = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2) + '\n');
const safeURL = raw => { try { const u = new URL(raw); return u.origin + u.pathname; } catch { return String(raw).slice(0, 200); } };
let browser, api;

// Wait for fonts, production tween completion, two paint frames, then three
// stable layout samples. This does not reset step/revealed or replace rendering.
async function settle(page) {
  await page.waitForFunction(() => window.lab?.board?.canvas && lab.list?.length && !lab._tween && (!document.fonts || document.fonts.status === 'loaded'), null, { timeout: 15000 });
  await page.evaluate(async () => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
  let last = '', stable = 0;
  for (let n = 0; n < 40; n++) {
    const current = await page.evaluate(() => {
      const c = lab.board.canvas, r = c.getBoundingClientRect();
      return { positive: c.width > 0 && c.height > 0 && r.width > 0 && r.height > 0, key: [lab.scene.id, lab.tab, lab.s.step, !!lab._tween, ...[r.x, r.y, r.width, r.height].map(x => Math.round(x * 10) / 10)].join('|') };
    });
    stable = current.positive && current.key === last ? stable + 1 : 0; last = current.key;
    if (stable >= 2) return;
    await page.waitForTimeout(100);
  }
  throw Error('Canvas/layout did not settle in four seconds');
}

async function inspect(page, state) {
  return page.evaluate(({ state, enterSteps }) => {
    const L = window.lab, normalize = s => String(s || '').replace(/\s+/g, ' ').trim();
    const q = L.scene.question, qValue = typeof q === 'function' ? q(L.s, L) : q;
    const expected = document.createElement('div'); expected.innerHTML = APLab.renderMath(qValue || '');
    const questionText = normalize(L.ui.head.querySelector('.apl-question .q')?.textContent);
    const sourcePattern = /(?:\bfunction\s*(?:[A-Za-z_$][\w$]*)?\s*\(|(?:\([^)]*\)|\b[A-Za-z_$][\w$]*)\s*=>)/;
    const problemText = normalize(L.refs.problemText?.textContent);
    const c = L.board.canvas, pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let ink = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 30) ink++;
    const answer = L.refs.answer, pane = L.ui.panes.problem;
    const verdictNodes = [...(pane?.querySelectorAll('[class]') || [])].filter(e => [...e.classList].some(x => /(?:^|-)(?:fb|feedback)$/.test(x)) || (e.tagName === 'BUTTON' && ['ok', 'bad', 'correct', 'incorrect'].some(x => e.classList.contains(x))));
    const futureBodies = [...(L.refs.steps?.children || [])].slice(Number(L.s.step) || 0).filter(e => normalize(e.children[1]?.textContent) !== '선택하면 이 단계의 풀이가 열립니다.');
    const declaredInitialStep = L.scene.startStep != null ? L.scene.startStep : L.scene.steps ? 1 : 0;
    const entryOverride = enterSteps[L.id]?.sceneId === String(L.scene.id) ? enterSteps[L.id] : null;
    return {
      state, sceneId: String(L.scene.id), tab: L.tab, step: L.s.step,
      declaredInitialStep, expectedInitialStep: entryOverride?.step ?? declaredInitialStep,
      initialStepSource: entryOverride ? 'Verified unit core.enter reset for this exact first scene' : 'scene.startStep or shell steps default',
      revealed: !!L.s.revealed,
      question: { type: typeof q, rendered: questionText, matchesCurrentState: questionText === normalize(expected.textContent), functionSourceExposed: sourcePattern.test(questionText) || sourcePattern.test(problemText) || (typeof q === 'function' && questionText.includes(normalize(Function.prototype.toString.call(q)))) },
      canvas: { width: c.width, height: c.height, ink, blankThreshold: 200 },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      katexErrors: [...document.querySelectorAll('.katex-error')].filter(e => e.checkVisibility()).map(e => e.textContent),
      lock: { hasProblem: !!L.scene.problem, shellAnswerExists: !!answer, customNoAnswer: !!L.scene.problem?.noAnswer, answerOpen: !!answer?.classList.contains('open'), answerValueInDOM: !!answer?.querySelector('.val'), initialVerdictNodes: verdictNodes.length, futureBodiesInDOM: futureBodies.length },
      problemTextLength: problemText.length, initialPlaying: !!L.s.playing
    };
  }, { state, enterSteps: ENTER_INITIAL_STEPS });
}

try {
  if (report.event.eventName === 'workflow_run' && (report.event.releaseConclusion !== 'success' || report.event.releaseHeadBranch !== 'main' || report.event.releaseWorkflowName !== 'Archive Pages Release')) throw Error('workflow_run is not a successful Archive Pages Release on main');
  const require = createRequire(import.meta.url);
  const pwEntry = require.resolve('playwright', { paths: [process.cwd(), ...(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? [process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES] : [])] });
  const pwRequire = createRequire(pwEntry), version = pwRequire('./package.json').version;
  if (version !== '1.56.1') throw Error(`Expected playwright1.56.1, found${version}`);
  const { chromium, request } = require(pwEntry); report.playwrightVersion = version;
  api = await request.newContext({ timeout: 30000 });
  const response = await api.get(catalogURL);
  if (!response.ok()) throw Error(`Catalog HTTP${response.status()}: ${catalogURL}`);
  const source = await response.text(), marker = 'window.APLab.catalog =';
  const start = source.indexOf(marker);
  if (start < 0) throw Error('Catalog assignment marker missing');
  // The production catalog is a JSON literal assignment. Parse data; do not eval.
  const catalog = JSON.parse(source.slice(start + marker.length).trim().replace(/;\s*$/, ''));
  const entries = UNITS.map(id => {
    const matches = catalog.labs?.filter(e => e.id === id) || [];
    if (matches.length !== 1 || !Number.isInteger(matches[0].sceneTotal) || matches[0].sceneTotal < 1 || !Array.isArray(matches[0].scenes)) throw Error(`Invalid catalog entry: ${id}`);
    return matches[0];
  });
  report.catalog = { url: catalogURL, status: response.status(), sha256: sha256(source), version: catalog.version, labs: entries.map(e => ({ id: e.id, sceneTotal: e.sceneTotal, groupCount: e.scenes.length })) };
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { headless: true });
  report.browserVersion = browser.version(); report.status = 'RUNNING'; persist();
  for (const unit of UNITS) for (const run of VIEWPORTS) {
    const entry = entries.find(e => e.id === unit), url = new URL(`${unit}.html?theme=board&manual=1`, base).href;
    const record = { unit, viewport: run, url, status: 'RUNNING', observations: [], captures: [], captureMetadata: {}, viewportCaptures: [], screenshotEnvironment: [], errors: [] }; report.pages.push(record);
    const context = await browser.newContext({ viewport: { width: run.width, height: run.height }, hasTouch: run.name === 'mobile', deviceScaleFactor: 1, locale: 'ko-KR' });
    let page, screenshotGuard, listening = true;
    const capture = async (filename, state) => {
      const id = await page.evaluate(() => String(lab.scene.id));
      try {
        const bundle = await captureReviewState({ page, guard: screenshotGuard, out, name: filename, id, state, fullPage: true, settle: () => settle(page), collectContent: false,
          onCapture: e => {
            const bytes = fs.readFileSync(path.join(out, e.file));
            if (bytes.length < 33 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes.toString('ascii', 12, 16) !== 'IHDR') throw Error(`Unreadable capture PNG: ${e.file}`);
            const png = { sha256: sha256(bytes), bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
            if (!screenshotEnvironmentMatches(e.frame.touchEnvironment, screenshotGuard.expectedTouch)) throw Error(`Unverified screenshot environment: ${e.file}`);
            if (e.frame.fullPage === false && (png.width !== e.frame.viewport.width || png.height !== e.frame.viewport.height || e.frame.touchEnvironment.pixelEnvironment !== VIEWPORT_PIXEL_POLICY)) throw Error(`Viewport capture readback mismatch: ${e.file}`);
            record.captureMetadata[e.file] = { ...e.frame, png, pngSha256: png.sha256 };
          }
        });
        if (screenshotGuard.expectedTouch) {
          const frame = record.captureMetadata[bundle.file];
          if (frame?.fullPage !== false || bundle.rawReference?.file !== filename) throw Error(`Required viewport evidence missing: ${filename}`);
          record.viewportCaptures.push({ file: bundle.file, rawReference: filename, id, state, diagnostic: state === 'failure', frame });
        }
        return { filename, sha256: sha256(fs.readFileSync(path.join(out, filename))) };
      } catch (error) {
        record.errors.push({ kind: 'screenshot-evidence-failed', id, state, file: filename, message: error.message });
        throw error;
      }
    };
    try {
      await context.route('**/*', async route => {
        const request = route.request();
        if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) { record.errors.push({ kind: 'blocked-remote-write', method: request.method(), url: safeURL(request.url()) }); await route.abort('blockedbyclient'); }
        else await route.continue();
      });
      page = await context.newPage();
      page.on('pageerror', e => { if (listening) record.errors.push({ kind: 'pageerror', message: e.message }); });
      page.on('console', m => { if (listening && m.type() === 'error') record.errors.push({ kind: 'console-error', message: m.text() }); });
      page.on('response', r => { if (listening && r.status() >= 400) record.errors.push({ kind: 'http-error', status: r.status(), url: safeURL(r.url()) }); });
      page.on('requestfailed', r => { if (listening) record.errors.push({ kind: 'requestfailed', url: safeURL(r.url()), error: r.failure()?.errorText }); });
      const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      record.httpStatus = response?.status(); record.finalURL = page.url();
      if (!response?.ok()) throw Error(`Document HTTP${response?.status() ?? 'NO_RESPONSE'}`);
      if (new URL(page.url()).origin !== base.origin || new URL(page.url()).pathname !== new URL(url).pathname) throw Error('Student page redirected to a different origin/path');
      await settle(page);
      // Pin the loaded target document, not about:blank's event properties.
      screenshotGuard = await createScreenshotGuard(page, { expectedTouch: run.name === 'mobile', onObservation: observation => {
        record.screenshotEnvironment.push(observation);
        if (!observation.pass) record.errors.push({ kind: observation.reason, screenshotEnvironment: observation });
      } });
      record.inventory = await page.evaluate(() => ({ id: lab.id, sceneIds: lab.list.map(s => String(s.id)), groupCount: lab.groups.length, groups: lab.groups.map(g => ({ id: g.id, title: g.title, scenes: g.scenes.length })) }));
      const inv = record.inventory;
      if (inv.id !== unit || inv.sceneIds.length !== entry.sceneTotal || new Set(inv.sceneIds).size !== inv.sceneIds.length || inv.sceneIds.some(id => !id || id === 'undefined') || inv.groupCount !== entry.scenes.length) record.errors.push({ kind: 'catalog-runtime-mismatch', expected: { sceneTotal: entry.sceneTotal, groupCount: entry.scenes.length }, actual: inv });
      for (const state of ['initial', 'problem']) {
        if (state === 'problem') {
          const tab = page.locator('button.apl-tab[aria-controls="apl-pane-problem"]');
          if (await tab.count() !== 1) throw Error('Initial scene has no unique problem tab; this smoke does not silently substitute another scene');
          await tab.click(); await settle(page);
        }
        const obs = await inspect(page, state); obs.issues = [];
        if (obs.canvas.ink < obs.canvas.blankThreshold) obs.issues.push('blank-canvas');
        if (obs.horizontalOverflow) obs.issues.push('horizontal-overflow');
        if (obs.katexErrors.length) obs.issues.push('katex-error');
        if (!obs.question.matchesCurrentState) obs.issues.push('question-current-state-mismatch');
        if (obs.question.functionSourceExposed) obs.issues.push('function-source-exposed');
        if (obs.step !== obs.expectedInitialStep) obs.issues.push('initial-step-contract-mismatch');
        if (obs.revealed || obs.lock.answerOpen || obs.lock.answerValueInDOM || obs.lock.initialVerdictNodes || obs.lock.futureBodiesInDOM) obs.issues.push('initial-disclosure-not-locked');
        if (state === 'initial' && obs.tab !== 'explore') obs.issues.push('unexpected-initial-tab');
        if (state === 'problem' && (obs.tab !== 'problem' || !obs.problemTextLength || !obs.lock.hasProblem || !obs.lock.shellAnswerExists || obs.lock.customNoAnswer)) obs.issues.push('problem-or-verifiable-lock-missing');
        record.observations.push(obs);
        const filename = `${unit}--${run.name}--${state}.png`;
        record.captures.push(await capture(filename, state));
      }
    } catch (e) {
      record.errors.push({ kind: 'exception', message: e.message });
      if (page && screenshotGuard) { try { await capture(`${unit}--${run.name}--failed.png`, 'failure'); } catch (error) { record.errors.push({ kind: 'failure-screenshot', message: error.message }); } }
    } finally {
      try { await screenshotGuard?.close(); }
      catch (error) { record.errors.push({ kind: 'screenshot-guard-cleanup', message: error.message }); }
      listening = false;
      try { await context.close(); }
      catch (error) { record.errors.push({ kind: 'browser-context-cleanup', message: error.message }); }
      record.status = record.errors.length || record.observations.length !== 2 || record.observations.some(o => o.issues.length) ? 'FAIL' : 'PASS_CHECKED_SCOPE';
      if (record.status === 'FAIL') fail('page-smoke-failed', { unit, viewport: run.name, errorKinds: record.errors.map(e => e.kind), states: record.observations.filter(o => o.issues.length).map(o => ({ state: o.state, issues: o.issues })) });
      fs.writeFileSync(path.join(out, `${unit}--${run.name}.json`), JSON.stringify(record, null, 2) + '\n'); persist();
      console.log(JSON.stringify({ unit, viewport: run.name, status: record.status, errors: record.errors.length, captures: record.captures.length }));
    }
  }
} catch (e) { fail('smoke-execution-error', { message: e.message }); }
finally {
  if (browser) await browser.close(); if (api) await api.dispose();
  report.finishedAt = new Date().toISOString();
  report.summary = { pageLoads: report.pages.length, checkedStates: report.pages.reduce((n, p) => n + p.observations.length, 0), captures: report.pages.reduce((n, p) => n + p.captures.length, 0), supportingViewportCaptures: report.pages.reduce((n, p) => n + p.viewportCaptures.length, 0), failures: report.failures.length };
  if (report.summary.pageLoads !== report.expected.pageLoads || report.summary.captures !== report.expected.initialAndProblemCaptures) fail('incomplete-requested-coverage', { expected: report.expected, actual: report.summary });
  report.summary.failures = report.failures.length;
  report.status = report.failures.length ? 'FAIL' : 'PASS_CHECKED_SCOPE'; persist();
  console.log(JSON.stringify({ status: report.status, ...report.summary, results: path.join(out, 'results.json'), physicalDeviceVerification: 'NOT_RUN', deployedSourceVerification: report.deployedSourceVerification }));
  if (report.failures.length) process.exitCode = 1;
}
