// Real-browser regression for the shared review controls outside the G7 units.
// G7 scene coverage is provided by g7-geometry-browser-audit.mjs.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf(name); return i < 0 ? fallback : argv[i + 1]; };
const root = path.resolve(arg('--root', '.'));
const out = path.resolve(arg('--out', '.tmp/shared-disclosure-browser'));
const hiddenText = '선택하면 이 단계의 풀이가 열립니다.';
const units = ['g8-pythagoras', 'common-quadratic', 'geom-vector-dot'];
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
fs.mkdirSync(out, { recursive: true });
const report = { commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), entries: [], checks: [], failures: [], limitations: ['Representative non-G7 scenes and targeted G7 disclosure checks only; physical devices NOT_RUN.'] };
function readStudentEntry() {
  const visible = selector => !!document.querySelector(selector)?.checkVisibility();
  const pane = document.querySelector('#apl-pane-explore');
  const explorePanel = {
    present: !!pane, hidden: pane?.hidden ?? true, ariaHidden: pane?.getAttribute('aria-hidden') ?? null,
    display: pane ? getComputedStyle(pane).display : null,
    renderedChildren: pane ? [...pane.children]
      .filter(child => child.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
      .map(child => ({ tag: child.tagName.toLowerCase(), id: child.id || null, className: child.getAttribute('class') })) : []
  };
  return {
    sceneId: String(lab.scene.id), tab: lab.tab, nativePlayer: lab.video?.state ?? null,
    lessonFirst: document.body.classList.contains('apl-lessonfirst'),
    entryMode: document.querySelector('.apl-lentry')?.dataset.mode ?? null,
    directExploreVisible: visible('.apl-lentry .apl-lmanual'), tabsVisible: visible('.apl-tabs'),
    learningView: lab.learning?.view ?? null, learningMode: lab.learning?.mode ?? null, activeShort: !!lab.learning?.active,
    explorePanelVisible: explorePanel.present && !explorePanel.hidden && explorePanel.ariaHidden !== 'true' && explorePanel.display !== 'none' && explorePanel.renderedChildren.length > 0,
    explorePanel
  };
}
async function enterStudentExploration(page, unit, viewport, sceneId = null) {
  const g7Contents = unit.startsWith('g7-') && sceneId !== null;
  const entry = { unit, viewport, requestedSceneId: sceneId, actions: [], status: 'RUNNING' };
  report.entries.push(entry);
  try {
    if (g7Contents) await page.waitForFunction(() => lab.learning?.enabled() && lab.learning.view === 'contents' && lab.toc?.isOpen && !document.body.classList.contains('apl-g7-loading'));
    entry.before = await page.evaluate(readStudentEntry);
    if (g7Contents) {
      const target = await page.evaluate(id => {
        const i = lab.list.findIndex(scene => scene.id === id);
        const item = i >= 0 ? lab.learning.lessonInfo(i)[0] : null;
        return item ? { i, choice: item.choice } : null;
      }, sceneId);
      if (!target) throw Error(`No contents learning item for ${sceneId}`);
      const selector = `.apl-toc button[data-i="${target.i}"][data-choice="${target.choice}"]`;
      const item = page.locator(selector);
      if (await item.count() !== 1) throw Error(`Expected one contents item for ${sceneId}`);
      await item.click();
      entry.actions.push({ selector, method: 'Playwright locator.click on the actual UI' });
      await page.waitForFunction(i => lab.index === i && lab.learning.view === 'lesson' && !lab.toc.isOpen, target.i);
      await page.locator('.g7-learning-controls').getByRole('button', { name: '직접 해 보기', exact: true }).click();
      entry.actions.push({ selector: '.g7-learning-controls', role: 'button', name: '직접 해 보기', method: 'Playwright locator.click on the actual UI' });
      await page.waitForFunction(() => lab.learning.mode === 'explore' && !lab.learning.active && lab.video.state === 'idle');
    } else if (entry.before.lessonFirst) {
      if (entry.before.entryMode !== 'first' || !entry.before.directExploreVisible || entry.before.nativePlayer !== 'idle') throw Error('Native lesson entry has no visible direct-exploration control');
      const selector = '.apl-lentry[data-mode="first"] .apl-lmanual', button = page.locator(selector);
      if (await button.count() !== 1 || !await button.isEnabled()) throw Error('Native direct-exploration control is unavailable');
      await button.click();
      entry.actions.push({ selector, method: 'Playwright locator.click on the actual UI' });
    } else {
      entry.status = 'NOT_REQUIRED';
      return;
    }
    await page.waitForFunction(() => {
      const pane = document.querySelector('#apl-pane-explore');
      return !document.body.classList.contains('apl-lessonfirst') && lab.tab === 'explore'
        && document.querySelector('.apl-tabs')?.checkVisibility() && pane && !pane.hidden && pane.getAttribute('aria-hidden') !== 'true'
        && [...pane.children].some(child => child.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));
    });
    entry.after = await page.evaluate(readStudentEntry);
    if (entry.after.sceneId !== (sceneId || entry.before.sceneId) || !entry.after.explorePanelVisible) throw Error('Exploration entry did not preserve the requested scene and expose its controls');
    entry.status = 'PASS';
  } catch (error) {
    entry.status = 'FAIL'; entry.error = error.message;
    report.failures.push({ unit, viewport, id: sceneId, stage: 'student-exploration-entry', error: error.message });
    throw error;
  }
}
const browser = await chromium.launch({ channel: 'chromium', headless: true });
try {
  for (const unit of units) for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('pageerror', e => report.failures.push({ unit, viewport, error: e.message }));
    await page.goto(`http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/${unit}.html?theme=board`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.lab && lab.list.length);
    await enterStudentExploration(page, unit, viewport);
    const count = await page.evaluate(() => lab.list.length);
    const indices = [...new Set([0, Math.floor(count / 2), count - 1])];
    const settle = async () => { await page.waitForFunction(() => !lab._tween); await page.evaluate(async () => { lab.render(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); lab.render(); }); };
    const check = async (id, stage, expected, stepCount) => {
      await settle();
      const values = await page.evaluate(() => ({ step: lab.s.step, rows: [...(lab.refs.steps?.children || [])].map(el => ({ text: el.children[1]?.textContent.trim(), expanded: el.getAttribute('aria-expanded') })) }));
      const pass = values.step === expected && values.rows.length === stepCount && values.rows.every((row, i) => i < expected ? row.text && row.text !== hiddenText && row.expanded === 'true' : row.text === hiddenText && row.expanded === 'false');
      report.checks.push({ unit, viewport, id, stage, expected, actual: values.step, rows: values.rows.length, pass });
      if (!pass) report.failures.push({ unit, viewport, id, stage, values });
    };
    for (const index of indices) {
      await page.evaluate(i => { lab.goScene(i); lab.setTab('review'); lab.setStep(0); }, index);
      await settle();
      const { id, steps } = await page.evaluate(() => ({ id: lab.scene.id, steps: lab.refs.steps?.children.length || 0 }));
      if (!steps) { report.checks.push({ unit, viewport, id, status: 'NOT_APPLICABLE', reason: 'No review steps' }); continue; }
      await check(id, 'before-reveal', 0, steps);
      await page.locator('.apl-step').first().click();
      await check(id, 'first-step-click', 1, steps);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: path.join(out, `${unit}--${id}--${viewport.width}--step1.png`), fullPage: true });
      await page.locator('.apl-step').last().click();
      await check(id, 'last-step-click', steps, steps);
      await page.locator('.apl-step-prev').click();
      await check(id, 'previous-relocks-future', steps - 1, steps);
      await page.locator('.apl-step-all').click();
      await check(id, 'show-all-click', steps, steps);
    }
    await context.close();
  }
  // Dynamic inquiry questions must be evaluated and refreshed with real inputs.
  for (const viewport of viewports) {
    const unit = 'g7-area', id = 'a1-rect';
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('pageerror', e => report.failures.push({ unit, viewport, error: e.message }));
    await page.goto(`http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/${unit}.html?theme=board`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.lab && lab.list.some(sc => sc.id === 'a1-rect'));
    await enterStudentExploration(page, unit, viewport, id);
    await page.evaluate(() => { lab.setTab('explore'); lab.render(); });
    const initial = await page.locator('.apl-question .q').textContent();
    const label = await page.evaluate(() => APLab.stripEmoji(lab.params.a1W.label));
    await page.getByRole('slider', { name: label, exact: true }).fill('7');
    await page.evaluate(async () => { lab.render(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); lab.render(); });
    const text = await page.locator('.apl-question .q').textContent();
    const value = await page.evaluate(() => lab.s.a1W);
    const pass = /가로 6칸, 세로 4칸/.test(initial) && value === 7 && /가로 7칸, 세로 4칸/.test(text) && !/function\s*\(/.test(text);
    report.checks.push({ unit, viewport, id, stage: 'question-follows-slider-input', pass, initial, text, value });
    if (!pass) report.failures.push({ unit, viewport, id, stage: 'question-follows-slider-input', initial, text, value });
    await context.close();
  }
  // A real detail toggle is a deliberate reveal. Reusing it for changed givens
  // would expose a new solution before the student asks for that solution.
  for (const viewport of viewports) {
    const unit = 'g7-circle-sector', id = 'f1-star';
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('pageerror', e => report.failures.push({ unit, viewport, error: e.message }));
    await page.goto(`http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/${unit}.html?theme=board`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.lab && lab.list.some(sc => sc.id === 'f1-star'));
    await enterStudentExploration(page, unit, viewport, id);
    const settle = async () => {
      await page.waitForFunction(() => !lab._tween);
      await page.evaluate(async () => { lab.render(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); lab.render(); });
      // This scene also animates through tick/_raf, outside the shell tween.
      // Compare every input only after that real animation has finished.
      await page.waitForFunction(() => !lab._tween && !lab._raf);
    };
    await page.evaluate(() => { lab.setTab('review'); lab.setStep(1); });
    await settle();
    const initial = await page.evaluate(() => {
      window.__solutionReads = 0;
      for (const key of ['standard', 'quick']) {
        const src = lab.scene.solution[key];
        lab.scene.solution[key] = s => { window.__solutionReads++; return typeof src === 'function' ? src(s) : src; };
      }
      return { step: lab.s.step, inputs: Object.fromEntries(lab.scene.controls(lab.s).map(k => [k, lab.s[k]])) };
    });
    await page.evaluate(() => lab.setTab('explore')); await settle();
    await page.evaluate(() => lab.setTab('review')); await settle();
    const unchanged = await page.evaluate(() => ({ reads: window.__solutionReads, step: lab.s.step, inputs: Object.fromEntries(lab.scene.controls(lab.s).map(k => [k, lab.s[k]])) }));
    const noHiddenWork = unchanged.reads === 0 && unchanged.step === initial.step && JSON.stringify(unchanged.inputs) === JSON.stringify(initial.inputs);
    report.checks.push({ unit, viewport, id, stage: 'closed-solutions-not-evaluated-and-tab-state-retained', pass: noHiddenWork, reads: unchanged.reads });
    if (!noHiddenWork) report.failures.push({ unit, viewport, id, stage: 'closed-solutions-not-evaluated-and-tab-state-retained', initial, unchanged });
    const detail = page.locator('#apl-pane-review details.apl-acc').first();
    await detail.locator('summary').click(); await settle();
    const before = await detail.locator('.apl-acc-body').innerHTML();
    const retained = await detail.getAttribute('open') !== null;
    report.checks.push({ unit, viewport, id, stage: 'explicit-solution-open-retained', pass: retained && !!before });
    if (!retained || !before) report.failures.push({ unit, viewport, id, stage: 'explicit-solution-open-retained' });
    await page.evaluate(() => lab.setTab('explore')); await settle();
    const numeric = await page.evaluate(() => {
      const key = lab.scene.controls(lab.s)[1], p = lab.params[key];
      const next = lab.s[key] + p.step <= p.max ? lab.s[key] + p.step : lab.s[key] - p.step;
      return { label: APLab.stripEmoji(p.label), next: Number(next.toFixed(8)) };
    });
    await page.getByRole('slider', { name: numeric.label, exact: true }).fill(String(numeric.next)); await settle();
    await page.evaluate(() => lab.setTab('review')); await settle();
    const changed = await page.evaluate(() => [...lab.refs.solution.querySelectorAll('details.apl-acc')].map(d => ({ open: d.open, text: d.querySelector('.apl-acc-body').textContent.trim() })));
    const relocked = changed.length > 0 && changed.every(d => !d.open && !d.text);
    report.checks.push({ unit, viewport, id, stage: 'changed-givens-relock-detailed-solution', pass: relocked });
    if (!relocked) report.failures.push({ unit, viewport, id, stage: 'changed-givens-relock-detailed-solution', changed });
    await detail.locator('summary').click(); await settle();
    const after = await detail.locator('.apl-acc-body').innerHTML();
    const refreshed = await detail.getAttribute('open') !== null && !!after && after !== before;
    report.checks.push({ unit, viewport, id, stage: 'explicit-reopen-shows-current-solution', pass: refreshed });
    if (!refreshed) report.failures.push({ unit, viewport, id, stage: 'explicit-reopen-shows-current-solution' });
    await page.evaluate(() => lab.setTab('problem')); await settle();
    const openBeforeNew = await detail.getAttribute('open') !== null;
    report.checks.push({ unit, viewport, id, stage: 'new-question-precondition-solution-still-open', pass: openBeforeNew });
    if (!openBeforeNew) report.failures.push({ unit, viewport, id, stage: 'new-question-precondition-solution-still-open' });
    await page.locator('#apl-pane-problem .apl-newprob').first().click(); await settle();
    await page.evaluate(() => lab.setTab('review')); await settle();
    const newQuestionLocked = await page.evaluate(() => [...lab.refs.solution.querySelectorAll('details.apl-acc')].every(d => !d.open && !d.querySelector('.apl-acc-body').textContent.trim()));
    report.checks.push({ unit, viewport, id, stage: 'new-question-relocks-detailed-solution', pass: newQuestionLocked });
    if (!newQuestionLocked) report.failures.push({ unit, viewport, id, stage: 'new-question-relocks-detailed-solution' });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: path.join(out, `${unit}--${id}--${viewport.width}--new-question-locked.png`), fullPage: true });
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ checks: report.checks.length, failures: report.failures.length }));
if (report.failures.length) process.exitCode = 1;
