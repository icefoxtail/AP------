// Read-only Chromium smoke of the six published G8/G9 geometry labs.
// node tools/g8-g9-student-live-smoke.mjs --plan (no browser/network/output writes)
// node tools/g8-g9-student-live-smoke.mjs --out .tmp/g8-g9-student-live
// --base-url or BASE_URL can select an explicitly chosen HTTP test server.
// Served HTML and every referenced local JS/CSS are compared with this checkout.
// A workflow event SHA is metadata; it is never asserted to be the deployed SHA.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createScreenshotGuard, screenshotEnvironmentMatches, SCREENSHOT_ENVIRONMENT_POLICY, VIEWPORT_PIXEL_POLICY } from './browser-screenshot-guard.mjs';
import { captureReviewState } from './high-viewport-evidence.mjs';

const STUDENT_BASE = 'https://icefoxtail.github.io/AP------/apmath/playground/next/labs/';
const UNITS = [
  { id: 'g8-triangles', scenes: 43, groups: 7, first: 't1-1' },
  { id: 'g8-quadrilaterals', scenes: 32, groups: 6, first: 'q1-1' },
  { id: 'g8-similarity', scenes: 39, groups: 8, first: 'sm1-corr' },
  { id: 'g8-pythagoras', scenes: 37, groups: 8, first: 'py1-sq' },
  { id: 'g9-trig-ratio', scenes: 51, groups: 8, first: 'r1-1' },
  { id: 'g9-circle', scenes: 45, groups: 7, first: 'c1-1' }
];
const VIEWPORTS = [
  { name: 'pc', width: 1440, height: 900 },
  { name: 'tablet-portrait', width: 820, height: 1180 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const THEMES = ['board', 'paper'];
const STATES = ['initial', 'problem', 'review-first', 'review-next', 'review-final', 'answer', 'return-explore'];
const argv = process.argv.slice(2), options = new Map();
for (let i = 0; i < argv.length; i++) {
  const key = argv[i];
  if (!['--plan', '--base-url', '--out'].includes(key)) throw Error(`Unknown option: ${key}`);
  if (options.has(key)) throw Error(`Duplicate option: ${key}`);
  if (key === '--plan') options.set(key, true);
  else {
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw Error(`Missing ${key} value`);
    options.set(key, value);
  }
}
const base = new URL(options.get('--base-url') || process.env.BASE_URL || STUDENT_BASE);
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw Error('Base URL must be an HTTP(S) labs directory without credentials/query/hash');
if (!base.pathname.endsWith('/')) base.pathname += '/';
const nextURL = new URL('../', base), catalogURL = new URL('kit/apl-catalog.js', nextURL).href;
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const sourcePrefix = 'apmath/playground/next/';
const startedAt = new Date().toISOString(), out = path.resolve(options.get('--out') || `.tmp/g8-g9-student-live-${startedAt.replace(/[:.]/g, '-')}`);
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const safeURL = raw => { try { const u = new URL(raw); return u.origin + u.pathname; } catch { return String(raw).slice(0, 200); } };
// Scene state is kept in the fragment, which is not sent in an HTTP request.
// Preserve the query: two query variants can serve different response bytes.
const responseURL = raw => { const u = new URL(raw); u.hash = ''; return u.href; };
function eventMetadata() {
  let payload = null, payloadReadError = null;
  if (process.env.GITHUB_EVENT_PATH) {
    try { payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')); }
    catch (e) { payloadReadError = e.message; }
  }
  const w = payload?.workflow_run;
  return {
    eventName: process.env.GITHUB_EVENT_NAME || null, smokeRunId: process.env.GITHUB_RUN_ID || null,
    smokeRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null, workflowContextSha: process.env.GITHUB_SHA || null,
    releaseRunId: process.env.RELEASE_RUN_ID || w?.id || null, releaseWorkflowName: w?.name || null,
    releaseConclusion: w?.conclusion || null, releaseHeadBranch: w?.head_branch || null,
    releaseEventHeadSha: process.env.RELEASE_EVENT_HEAD_SHA || w?.head_sha || null,
    releaseRunURL: w?.html_url || null, payloadReadError,
    shaMeaning: 'Workflow/event metadata only; not evidence of the deployed source commit.'
  };
}
const report = {
  version: 1, kind: base.href === STUDENT_BASE ? 'DEPLOYED_STUDENT_URL_READ_ONLY_SMOKE' : 'CUSTOM_HTTP_READ_ONLY_SMOKE',
  status: 'NOT_RUN', startedAt, baseURL: base.href, isExactStudentURL: base.href === STUDENT_BASE,
  event: eventMetadata(), requestedPlaywrightVersion: '1.56.1', viewports: VIEWPORTS, themes: THEMES, states: STATES,
  expected: { units: 6, inventoryScenes: 247, pageLoads: 48, checkedStates: 336, captures: 336 },
  catalog: null, pages: [], failures: [],
  sourceVerification: { status: 'NOT_RUN', checkoutCommit: null, actualDeployedCommit: null, assets: [], externalAssets: [], meaning: 'Per-file HTTP response bytes are compared with exact checkout files and Git blobs. Matching checked assets does not identify the entire deployed commit.' },
  physicalDeviceVerification: 'NOT_RUN',
  screenshotEnvironmentPolicy: SCREENSHOT_ENVIRONMENT_POLICY,
  viewportEvidencePolicy: { raw: 'Legacy full-page capture denominator; touch-context pixels UNVERIFIED_BEYOND_VIEWPORT', supporting: 'Fixed-viewport PNGs with actual environment and byte readback; separate denominator', inputCoverage: 'Existing navigation only; no native touch claim' },
  limitations: [
    'Chromium viewport emulation at four sizes and two themes; no physical devices.',
    'The first scene of each lab follows seven real UI states. All 247 scene IDs/counts are inventoried, but this smoke does not render all 247 scenes.',
    'Current-model consistency, structural answer locking, drawing presence and browser errors are checked. This is not a new mathematical proof or complete visual quality review.',
    'Only GET/HEAD/OPTIONS requests are permitted. Review navigation and answer reveal affect this fresh local browser session only.',
    'Local HTML/JS/CSS response bytes are verified. External CDN assets are recorded separately; fonts/images and unrequested repository files are outside source verification.'
  ]
};
if (options.has('--plan')) {
  console.log(JSON.stringify({ ...report, plannedURLs: UNITS.flatMap(u => THEMES.map(theme => new URL(`${u.id}.html?theme=${theme}`, base).href)), unitInventory: UNITS }, null, 2));
  process.exit(0);
}
if (fs.existsSync(path.join(out, 'results.json'))) throw Error('Output already contains results.json; choose a fresh --out directory to preserve evidence');
fs.mkdirSync(out, { recursive: true });
const fail = (reason, detail = {}) => report.failures.push({ reason, ...detail });
const persist = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2) + '\n');
const expectedCache = new Map(), assets = new Map(), externals = new Map();
let browser, api;
function localRepoPath(raw) {
  const u = new URL(raw);
  if (u.origin !== nextURL.origin) return null;
  if (!u.pathname.startsWith(nextURL.pathname)) throw Error(`Same-origin asset is outside the checked source tree: ${safeURL(raw)}`);
  const suffix = decodeURIComponent(u.pathname.slice(nextURL.pathname.length));
  if (!suffix || suffix.split('/').some(s => s === '..' || s === '.') || suffix.includes('\\') || suffix.includes('\0')) throw Error('Unsafe local asset path');
  return sourcePrefix + suffix;
}
function expectedAsset(repoPath) {
  if (!expectedCache.has(repoPath)) {
    const disk = fs.readFileSync(path.join(repoRoot, repoPath));
    const committed = execFileSync('git', ['show', `${report.sourceVerification.checkoutCommit}:${repoPath}`], { cwd: repoRoot, maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    if (!disk.equals(committed)) throw Error(`Checkout file differs from its pinned commit: ${repoPath}`);
    expectedCache.set(repoPath, { sha256: sha256(committed), bytes: committed.length, gitBlobSha: crypto.createHash('sha1').update(`blob ${committed.length}\0`).update(committed).digest('hex') });
  }
  return expectedCache.get(repoPath);
}
function verifyAsset(raw, body, status, context) {
  const repoPath = localRepoPath(raw), servedHash = sha256(body);
  if (!repoPath) {
    const key = safeURL(raw);
    if (!externals.has(key)) externals.set(key, { url: key, status, sha256: servedHash, verification: 'EXTERNAL_NOT_COMPARED_WITH_GIT' });
    report.sourceVerification.externalAssets = [...externals.values()];
    return null;
  }
  const expected = expectedAsset(repoPath), key = `${repoPath}|${servedHash}`;
  if (!assets.has(key)) assets.set(key, { url: safeURL(raw), repoPath, status, servedSHA256: servedHash, checkoutSHA256: expected.sha256, gitBlobSha: expected.gitBlobSha, bytes: body.length, matchesCheckout: status >= 200 && status < 300 && servedHash === expected.sha256, observedIn: [] });
  const asset = assets.get(key);
  if (!asset.observedIn.includes(context)) asset.observedIn.push(context);
  report.sourceVerification.assets = [...assets.values()]; report.sourceVerification.externalAssets = [...externals.values()];
  if (!asset.matchesCheckout) throw Error(`Served asset does not match checkout ${report.sourceVerification.checkoutCommit}: ${repoPath}`);
  return repoPath;
}
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
  throw Error('Canvas/layout did not settle');
}
function readStudentEntry() {
  const visible = selector => !!document.querySelector(selector)?.checkVisibility();
  return {
    sceneId: String(lab.scene.id), tab: lab.tab, nativePlayer: lab.video?.state ?? null,
    lessonFirst: document.body.classList.contains('apl-lessonfirst'),
    entryVisible: visible('.apl-lentry'), entryMode: document.querySelector('.apl-lentry')?.dataset.mode ?? null,
    lessonButtons: document.querySelectorAll('.apl-lentry .apl-lgo').length,
    directExploreVisible: visible('.apl-lentry .apl-lmanual'),
    tabsVisible: visible('.apl-tabs'), exploreTabVisible: visible('button.apl-tab[aria-controls="apl-pane-explore"]'),
    explorePanelVisible: visible('#apl-pane-explore')
  };
}
async function enterStudentExploration(page, entry) {
  try {
    // Keep the normal student URL and record its first screen before following
    // the existing visible entry control. Wide screens already expose exploration.
    if (entry.before.lessonFirst) {
      if (!entry.before.entryVisible || entry.before.entryMode !== 'first' || !entry.before.lessonButtons || entry.before.nativePlayer !== 'idle') throw Error('Lesson-first screen has no idle lesson entry');
      const selector = '.apl-lentry[data-mode="first"] .apl-lmanual', button = page.locator(selector);
      if (await button.count() !== 1 || !await button.isVisible() || !await button.isEnabled()) throw Error('Lesson-first screen has no usable direct-exploration button');
      entry.action = { selector, method: 'Playwright locator.click on the actual UI' };
      await button.click();
    }
    await settle(page);
    entry.after = await page.evaluate(readStudentEntry);
    const after = entry.after;
    if (after.lessonFirst || after.sceneId !== entry.before.sceneId || after.tab !== 'explore' || !after.tabsVisible || !after.exploreTabVisible || !after.explorePanelVisible) throw Error(`Exploration entry did not expose the original tabs and panel: ${JSON.stringify(after)}`);
    entry.status = 'PASS';
  } catch (error) {
    entry.status = 'FAIL'; entry.error = error.message;
    throw Error(`Student exploration entry failed: ${error.message}`);
  }
}
async function inspect(page, state) {
  return page.evaluate(state => {
    const L = window.lab, sc = L.scene, s = L.s, call = value => typeof value === 'function' ? value(s, L) : value;
    const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
    const rendered = html => { const el = document.createElement('div'); el.innerHTML = APLab.renderMath(html || ''); return el; };
    const bodyText = element => { const el = element?.cloneNode(true); el?.querySelectorAll('button, svg').forEach(n => n.remove()); return normalize(el?.textContent); };
    const qValue = call(sc.question), questionText = normalize(L.ui.head.querySelector('.apl-question .q')?.textContent);
    let Q;
    if (sc.tr) Q = sc.tr.prob(sc.tr.model(s), s);
    else if (sc.qd) Q = sc.qd.prob(sc.qd.model(s), s);
    else if (sc.sm?.questionOf) Q = sc.sm.questionOf(s);
    else if (sc.py) { const qs = { ...s, ...s.pyQ }; Q = sc.py.prob(sc.py.model(qs), qs); }
    else if (sc.tg) Q = s.q;
    else if (sc.ci) Q = sc.ci.prob(sc.ci.model(s, { tab: 'problem', problem: true, review: false, step: 0, txt: true, thumb: false, full: false }), s);
    if (!Q) throw Error(`Missing current-question adapter for ${L.id}`);
    const questionIdentity = JSON.stringify({ id: sc.id, key: Q.key, stem: Q.stem, html: Q.html, choices: Q.choices });
    const problemExpected = rendered(L._rich(call(sc.problem?.text))), reviewExpected = rendered(L._rich(call(sc.reviewTop)));
    const steps = call(sc.steps) || [], children = [...(L.refs.steps?.children || [])], hiddenText = '선택하면 이 단계의 풀이가 열립니다.';
    const stepRows = children.map((e, i) => {
      const expected = i < s.step ? rendered(APLab.esc(String(steps[i]).replace(/^Step\s*\d+\s*·\s*/, '')).replace(/&amp;/g, '&')).textContent : hiddenText;
      return { index: i + 1, open: e.getAttribute('aria-expanded') === 'true', text: normalize(e.children[1]?.textContent), matchesCurrentStep: normalize(e.children[1]?.textContent) === normalize(expected) };
    });
    const c = L.board.canvas, pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let ink = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 30) ink++;
    const answer = L.refs.answer, pane = L.ui.panes.problem;
    const verdictNodes = [...pane.querySelectorAll('[class]')].filter(e => [...e.classList].some(x => /(?:^|-)(?:fb|feedback)$/.test(x)) || (e.tagName === 'BUTTON' && ['ok', 'bad', 'correct', 'incorrect'].some(x => e.classList.contains(x))));
    const sourcePattern = /(?:\bfunction\s*(?:[A-Za-z_$][\w$]*)?\s*\(|(?:\([^)]*\)|\b[A-Za-z_$][\w$]*)\s*=>)/;
    const tag = sc.problem?.tag, actualTag = normalize(pane.querySelector('.apl-problem-meta .apl-tag')?.textContent);
    const expectedTag = tag ? normalize(rendered(APLab.esc(APLab.stripEmoji(call(tag)))).textContent) : '';
    const custom = L.id === 'g8-triangles' && sc.problem?.noAnswer === true;
    return {
      state, sceneId: String(sc.id), tab: L.tab, step: s.step, stepCount: steps.length,
      declaredInitialStep: sc.startStep != null ? sc.startStep : sc.steps ? 1 : 0,
      theme: document.documentElement.getAttribute('data-theme'), questionIdentity,
      question: { rendered: questionText, matchesCurrentState: questionText === normalize(rendered(qValue).textContent), functionSourceExposed: sourcePattern.test(questionText) || sourcePattern.test(bodyText(L.refs.problemText)) },
      problem: { exists: !!sc.problem, textLength: bodyText(L.refs.problemText).length, matchesCurrentState: bodyText(L.refs.problemText) === bodyText(problemExpected), badgeMatchesCurrentState: actualTag === expectedTag },
      review: { recapExists: !!sc.reviewTop && !!L.refs.top, recapMatchesCurrentState: bodyText(L.refs.top) === bodyText(reviewExpected), stepRows },
      canvas: { width: c.width, height: c.height, ink, blankThreshold: 200 },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      katexErrors: [...document.querySelectorAll('.katex-error')].filter(e => e.checkVisibility()).map(e => e.textContent),
      lock: { revealed: !!s.revealed, shellAnswerExists: !!answer, answerOpen: !!answer?.classList.contains('open'), answerValueInDOM: !!answer?.querySelector('.val'),
        answerMatchesCurrentState: !answer?.querySelector('.val') || normalize(answer.querySelector('.val').textContent) === normalize(rendered(L._rich(call(sc.problem?.answer))).textContent),
        customNoAnswer: !!sc.problem?.noAnswer, supportedCustomAnswer: custom, customRevealButton: !!pane.querySelector('[data-tr-show]'), customAnswerVisible: !!pane.querySelector('.tr-ans'),
        verdictNodes: verdictNodes.length, futureBodiesInDOM: stepRows.filter(r => r.index > s.step && r.text !== hiddenText).length },
      playing: !!s.playing
    };
  }, state);
}
function checkObservation(obs, record, unit, questionSignature) {
  const issues = [];
  if (obs.sceneId !== unit.first) issues.push('initial-scene-changed');
  if (obs.theme !== record.theme) issues.push('theme-mismatch');
  if (obs.canvas.ink < obs.canvas.blankThreshold) issues.push('blank-canvas');
  if (obs.horizontalOverflow) issues.push('horizontal-overflow');
  if (obs.katexErrors.length) issues.push('katex-error');
  if (!obs.question.matchesCurrentState || !obs.problem.matchesCurrentState || !obs.problem.badgeMatchesCurrentState) issues.push('question-current-state-mismatch');
  if (!obs.problem.exists || !obs.problem.textLength) issues.push('missing-current-problem');
  if (obs.question.functionSourceExposed) issues.push('function-source-exposed');
  if (obs.questionSHA256 !== questionSignature) issues.push('question-changed-during-review-navigation');
  if (obs.playing) issues.push('unexpected-playing-state');
  if (obs.stepCount < 3 || obs.review.stepRows.length !== obs.stepCount || obs.review.stepRows.some(r => !r.matchesCurrentStep || r.open !== (r.index <= obs.step))) issues.push('step-state-or-text-mismatch');
  if (obs.lock.futureBodiesInDOM) issues.push('future-solution-disclosed');
  if (!obs.lock.answerMatchesCurrentState) issues.push('answer-current-state-mismatch');
  const first = ['initial', 'problem', 'review-first'].includes(obs.state), early = first || obs.state === 'review-next';
  const expectedTab = obs.state === 'initial' || obs.state === 'return-explore' ? 'explore' : obs.state.startsWith('review-') ? 'review' : 'problem';
  if (obs.tab !== expectedTab) issues.push('navigation-tab-mismatch');
  if (first && obs.step !== obs.declaredInitialStep) issues.push('initial-step-contract-mismatch');
  if (obs.state === 'review-next' && obs.step !== obs.declaredInitialStep + 1) issues.push('next-step-button-did-not-advance');
  if (['review-final', 'answer', 'return-explore'].includes(obs.state) && obs.step !== obs.stepCount) issues.push('final-step-not-reached');
  if (obs.tab === 'review' && (!obs.review.recapExists || !obs.review.recapMatchesCurrentState)) issues.push('review-current-problem-mismatch');
  if (early && (obs.lock.revealed || obs.lock.answerOpen || obs.lock.answerValueInDOM || obs.lock.customAnswerVisible || obs.lock.verdictNodes)) issues.push('answer-not-locked-before-final-step');
  if (obs.lock.customNoAnswer) {
    if (!obs.lock.supportedCustomAnswer || obs.lock.shellAnswerExists) issues.push('unsupported-custom-answer-contract');
    if (early && !obs.lock.customRevealButton) issues.push('custom-answer-lock-button-missing');
    if (['answer', 'return-explore'].includes(obs.state) && !obs.lock.customAnswerVisible) issues.push('custom-answer-button-did-not-reveal');
  } else {
    if (!obs.lock.shellAnswerExists) issues.push('shell-answer-lock-missing');
    if (['review-final', 'answer', 'return-explore'].includes(obs.state) && (!obs.lock.answerOpen || !obs.lock.answerValueInDOM)) issues.push('final-answer-not-available');
  }
  return issues;
}
async function clickUnique(page, selector) {
  const button = page.locator(selector);
  if (await button.count() !== 1) throw Error(`Expected one actual UI button: ${selector}`);
  await button.click(); await settle(page);
}

try {
  if (report.event.eventName === 'workflow_run' && (report.event.releaseConclusion !== 'success' || report.event.releaseHeadBranch !== 'main' || report.event.releaseWorkflowName !== 'Archive Pages Release')) throw Error('workflow_run is not a successful Archive Pages Release on main');
  report.sourceVerification.checkoutCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
  report.sourceVerification.status = 'RUNNING';
  const require = createRequire(import.meta.url), pwEntry = require.resolve('playwright', { paths: [process.cwd(), ...(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? [process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES] : [])] });
  const version = createRequire(pwEntry)('./package.json').version;
  if (version !== '1.56.1') throw Error(`Expected Playwright 1.56.1, found ${version}`);
  const { chromium, request } = require(pwEntry); report.playwrightVersion = version;
  api = await request.newContext({ timeout: 30000 });
  const response = await api.get(catalogURL);
  if (!response.ok()) throw Error(`Catalog HTTP ${response.status()}`);
  const catalogBody = await response.body(); verifyAsset(catalogURL, catalogBody, response.status(), 'catalog');
  const source = catalogBody.toString('utf8'), marker = 'window.APLab.catalog =', start = source.indexOf(marker);
  if (start < 0) throw Error('Catalog assignment marker missing');
  const catalog = JSON.parse(source.slice(start + marker.length).trim().replace(/;\s*$/, ''));
  const entries = UNITS.map(u => {
    const matches = catalog.labs?.filter(e => e.id === u.id) || [];
    if (matches.length !== 1 || matches[0].sceneTotal !== u.scenes || matches[0].scenes?.length !== u.groups) throw Error(`Catalog count differs from the full requested scope: ${u.id}`);
    return matches[0];
  });
  report.catalog = { url: catalogURL, status: response.status(), sha256: sha256(catalogBody), version: catalog.version, labs: entries.map(e => ({ id: e.id, sceneTotal: e.sceneTotal, groupCount: e.scenes.length })) };
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { headless: true });
  report.browserVersion = browser.version(); report.status = 'RUNNING'; persist();
  for (const unit of UNITS) for (const viewport of VIEWPORTS) for (const theme of THEMES) {
    const id = `${unit.id}--${viewport.name}--${theme}`, url = new URL(`${unit.id}.html?theme=${theme}`, base).href;
    const record = { unit: unit.id, viewport, theme, url, status: 'RUNNING', inventory: null, observations: [], captures: [], captureMetadata: {}, viewportCaptures: [], screenshotEnvironment: [], interactions: [], localAssetReferences: [], errors: [] };
    report.pages.push(record);
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.name === 'mobile' || viewport.name.startsWith('tablet'), deviceScaleFactor: 1, locale: 'ko-KR', serviceWorkers: 'block' });
    const pendingAssets = new Set(), verifiedURLs = new Set();
    let page, screenshotGuard, listening = true;
    const capture = async (filename, state) => {
      const evidence = state === 'entry' ? record.entry : record;
      const sceneId = await page.evaluate(() => String(lab.scene.id));
      try {
        const bundle = await captureReviewState({ page, guard: screenshotGuard, out, name: filename, id: sceneId, state, fullPage: true, settle: () => settle(page), collectContent: false,
          onCapture: e => {
            const bytes = fs.readFileSync(path.join(out, e.file));
            if (bytes.length < 33 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes.toString('ascii', 12, 16) !== 'IHDR') throw Error(`Unreadable capture PNG: ${e.file}`);
            const png = { sha256: sha256(bytes), bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
            if (!screenshotEnvironmentMatches(e.frame.touchEnvironment, screenshotGuard.expectedTouch)) throw Error(`Unverified screenshot environment: ${e.file}`);
            if (e.frame.fullPage === false && (png.width !== e.frame.viewport.width || png.height !== e.frame.viewport.height || e.frame.touchEnvironment.pixelEnvironment !== VIEWPORT_PIXEL_POLICY)) throw Error(`Viewport capture readback mismatch: ${e.file}`);
            evidence.captureMetadata[e.file] = { ...e.frame, png, pngSha256: png.sha256 };
          }
        });
        if (screenshotGuard.expectedTouch) {
          const frame = evidence.captureMetadata[bundle.file];
          if (frame?.fullPage !== false || bundle.rawReference?.file !== filename) throw Error(`Required viewport evidence missing: ${filename}`);
          evidence.viewportCaptures.push({ file: bundle.file, rawReference: filename, id: sceneId, state, diagnostic: state === 'failure', frame });
        }
        return { filename, sha256: sha256(fs.readFileSync(path.join(out, filename))) };
      } catch (error) {
        record.errors.push({ kind: 'screenshot-evidence-failed', id: sceneId, state, file: filename, message: error.message });
        throw error;
      }
    };
    try {
      await context.route('**/*', async route => {
        const r = route.request();
        if (!['GET', 'HEAD', 'OPTIONS'].includes(r.method())) { record.errors.push({ kind: 'blocked-remote-write', method: r.method(), url: safeURL(r.url()) }); await route.abort('blockedbyclient'); }
        else await route.continue();
      });
      page = await context.newPage();
      page.on('pageerror', e => { if (listening) record.errors.push({ kind: 'pageerror', message: e.message }); });
      page.on('console', m => { if (listening && m.type() === 'error') record.errors.push({ kind: 'console-error', message: m.text() }); });
      page.on('requestfailed', r => { if (listening) record.errors.push({ kind: 'requestfailed', url: safeURL(r.url()), error: r.failure()?.errorText }); });
      page.on('response', r => {
        if (!listening) return;
        if (r.status() >= 400) record.errors.push({ kind: 'http-error', status: r.status(), url: safeURL(r.url()) });
        if (!['document', 'script', 'stylesheet'].includes(r.request().resourceType())) return;
        const task = (async () => {
          try { verifyAsset(r.url(), await r.body(), r.status(), id); verifiedURLs.add(responseURL(r.url())); }
          catch (e) { record.errors.push({ kind: 'source-asset-verification', url: safeURL(r.url()), message: e.message }); }
        })();
        pendingAssets.add(task); task.finally(() => pendingAssets.delete(task));
      });
      const navigation = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      record.httpStatus = navigation?.status(); record.finalURL = page.url();
      if (!navigation?.ok()) throw Error(`Document HTTP ${navigation?.status() ?? 'NO_RESPONSE'}`);
      if (new URL(page.url()).origin !== base.origin || new URL(page.url()).pathname !== new URL(url).pathname) throw Error('Page redirected to a different origin/path');
      await settle(page);
      // Pin the loaded target document, not about:blank's event properties.
      screenshotGuard = await createScreenshotGuard(page, { expectedTouch: viewport.name === 'mobile' || viewport.name.startsWith('tablet'), onObservation: observation => {
        record.screenshotEnvironment.push(observation);
        if (!observation.pass) record.errors.push({ kind: observation.reason, screenshotEnvironment: observation });
      } });
      record.inventory = await page.evaluate(() => ({ id: lab.id, sceneIds: lab.list.map(s => String(s.id)), groupCount: lab.groups.length }));
      const inv = record.inventory;
      if (inv.id !== unit.id || inv.sceneIds.length !== unit.scenes || new Set(inv.sceneIds).size !== unit.scenes || inv.sceneIds[0] !== unit.first || inv.groupCount !== unit.groups) record.errors.push({ kind: 'runtime-inventory-mismatch', expected: unit, actual: inv });
      record.entry = { before: await page.evaluate(readStudentEntry), action: null, status: 'RUNNING', captureMetadata: {}, viewportCaptures: [] };
      // Entry evidence is additional to the unchanged seven-state denominator.
      record.entry.capture = await capture(`${id}--entry.png`, 'entry');
      await enterStudentExploration(page, record.entry);
      if (record.entry.action) record.interactions.push({ state: 'enter-explore', ...record.entry.action });
      let questionSignature;
      for (const state of STATES) {
        let selector;
        if (state === 'problem') selector = 'button.apl-tab[aria-controls="apl-pane-problem"]';
        if (state === 'review-first') selector = unit.id === 'g8-triangles' ? '#apl-pane-problem button[data-tr-go="review"]' : 'button.apl-tab[aria-controls="apl-pane-review"]';
        if (state === 'review-next' || state === 'answer') selector = '#apl-pane-review button.apl-step-next';
        if (state === 'review-final') selector = '#apl-pane-review button.apl-step-all';
        if (state === 'return-explore') selector = 'button.apl-tab[aria-controls="apl-pane-explore"]';
        if (selector) { await clickUnique(page, selector); record.interactions.push({ state, selector, method: 'Playwright locator.click on the actual UI' }); }
        if (state === 'answer' && unit.id === 'g8-triangles') { await clickUnique(page, '#apl-pane-problem button[data-tr-show]'); record.interactions.push({ state, selector: '#apl-pane-problem button[data-tr-show]', method: 'Playwright locator.click on the actual UI' }); }
        const obs = await inspect(page, state);
        obs.questionSHA256 = sha256(obs.questionIdentity); delete obs.questionIdentity;
        if (!questionSignature) questionSignature = obs.questionSHA256;
        obs.issues = checkObservation(obs, record, unit, questionSignature); record.observations.push(obs);
        const filename = `${id}--${state}.png`;
        record.captures.push(await capture(filename, state));
      }
      const references = await page.evaluate(() => [...new Set([location.href, ...[...document.scripts].filter(s => s.src).map(s => s.src), ...[...document.querySelectorAll('link[rel="stylesheet"][href]')].map(s => s.href)])]);
      await Promise.allSettled([...pendingAssets]);
      for (const reference of references) {
        if (new URL(reference).origin !== base.origin) continue;
        record.localAssetReferences.push({ url: safeURL(reference), repoPath: localRepoPath(reference), responseVerified: verifiedURLs.has(responseURL(reference)) });
        if (!verifiedURLs.has(responseURL(reference))) record.errors.push({ kind: 'referenced-local-asset-not-verified', url: safeURL(reference) });
      }
    } catch (e) {
      record.errors.push({ kind: 'exception', message: e.message });
      if (page && screenshotGuard) { try { await capture(`${id}--failed.png`, 'failure'); } catch (error) { record.errors.push({ kind: 'failure-screenshot', message: error.message }); } }
    } finally {
      try { await screenshotGuard?.close(); }
      catch (error) { record.errors.push({ kind: 'screenshot-guard-cleanup', message: error.message }); }
      await Promise.allSettled([...pendingAssets]); listening = false;
      try { await context.close(); }
      catch (error) { record.errors.push({ kind: 'browser-context-cleanup', message: error.message }); }
      record.status = record.errors.length || record.observations.length !== STATES.length || record.observations.some(o => o.issues.length) || !record.localAssetReferences.length ? 'FAIL' : 'PASS_CHECKED_SCOPE';
      if (record.status === 'FAIL') fail('page-smoke-failed', { unit: unit.id, viewport: viewport.name, theme, errorKinds: record.errors.map(e => e.kind), states: record.observations.filter(o => o.issues.length).map(o => ({ state: o.state, issues: o.issues })) });
      fs.writeFileSync(path.join(out, `${id}.json`), JSON.stringify(record, null, 2) + '\n'); persist();
      console.log(JSON.stringify({ unit: unit.id, viewport: viewport.name, theme, status: record.status, errors: record.errors.length, captures: record.captures.length }));
    }
  }
} catch (e) { fail('smoke-execution-error', { message: e.message }); }
finally {
  if (browser) await browser.close(); if (api) await api.dispose();
  report.finishedAt = new Date().toISOString();
  report.summary = { pageLoads: report.pages.length, checkedStates: report.pages.reduce((n, p) => n + p.observations.length, 0), captures: report.pages.reduce((n, p) => n + p.captures.length, 0), supportingViewportCaptures: report.pages.reduce((n, p) => n + p.viewportCaptures.length, 0), verifiedLocalAssets: assets.size, externalAssets: externals.size, failures: report.failures.length };
  if (['pageLoads', 'checkedStates', 'captures'].some(k => report.summary[k] !== report.expected[k])) fail('incomplete-requested-coverage', { expected: report.expected, actual: report.summary });
  const sourceComplete = assets.size > 6 && [...assets.values()].every(a => a.matchesCheckout) && report.pages.length === report.expected.pageLoads && report.pages.every(p => p.localAssetReferences.length > 0 && p.localAssetReferences.every(a => a.responseVerified) && !p.errors.some(e => ['source-asset-verification', 'referenced-local-asset-not-verified'].includes(e.kind)));
  report.sourceVerification.status = sourceComplete ? 'CHECKED_ASSETS_MATCH_CHECKOUT' : 'FAIL_OR_INCOMPLETE';
  report.sourceVerification.verifiedAssetsMatchCheckoutCommit = sourceComplete ? report.sourceVerification.checkoutCommit : null;
  if (!sourceComplete) fail('served-source-verification-incomplete-or-mismatched');
  report.summary.failures = report.failures.length; report.status = report.failures.length ? 'FAIL' : 'PASS_CHECKED_SCOPE'; persist();
  console.log(JSON.stringify({ status: report.status, ...report.summary, results: path.join(out, 'results.json'), sourceVerification: report.sourceVerification.status, actualDeployedCommit: null, physicalDeviceVerification: 'NOT_RUN' }));
  if (report.failures.length) process.exitCode = 1;
}
