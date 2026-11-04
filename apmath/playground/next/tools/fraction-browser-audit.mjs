// ROOT runs this against its own static server. Default denominator: every catalog lab and every scene.
// node .../fraction-browser-audit.mjs http://127.0.0.1:8765/apmath/playground/next/ --out reports/fraction-audit
// --only id,id is diagnostic only: result.scope remains PARTIAL. CHROME_PATH selects installed Chrome.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); if (i < 0) return null; return argv.splice(i, 2)[1]; };
const out = path.resolve(arg('--out') || 'reports/fraction-audit');
const only = arg('--only')?.split(',');
const base = (argv[0] || 'http://127.0.0.1:8765/apmath/playground/next/').replace(/\/?$/, '/');
// Evidence must stay in the ignored reports directory (or an absolute external output directory).
const reports = path.resolve('reports');
if (!(out.startsWith(reports + path.sep) || out === reports || !out.startsWith(process.cwd() + path.sep))) throw new Error('--out must be under ignored reports/ or outside the checkout');
fs.mkdirSync(out, { recursive: true });
const catContext = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), catContext);
const all = catContext.window.APLab.catalog.labs;
const labs = all.filter((l) => !only || only.includes(l.id));
if (!labs.length) throw new Error('No matching catalog labs');
const report = { scope: only ? 'PARTIAL' : 'ALL_CATALOG_LABS_ALL_SCENES', expectedLabs: labs.map((l) => l.id), labs: [], specialAngles: [], exclusions: ['KaTeX annotation/MathML and stacked .mfrac content are excluded; a visible slash outside .mfrac in KaTeX HTML is still audited', 'script/style/code/pre/input/textarea are not rendered math labels', 'explicit URL/date/unit tokens are non-fractions', 'scene progress .count is navigation, not a mathematical quotient'], limits: ['One generated variant per scene; random generation is not exhaustive', 'Canvas checks final fillText/strokeText calls, not original Board._text input; stacked fractions therefore are not false positives', 'Canvas pixel clipping/occlusion cannot be fully inferred from text calls', 'Ambiguous slash expressions require human review; reviewCandidates prevents a PASS claim'] };
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
async function install(page) {
  await page.addInitScript(() => {
    window.__fractionCanvas = [];
    for (const name of ['fillText', 'strokeText']) {
      const original = CanvasRenderingContext2D.prototype[name];
      CanvasRenderingContext2D.prototype[name] = function(text, x, y, ...rest) {
        if (this.canvas.isConnected && this.canvas.checkVisibility() && this.globalAlpha > 0) window.__fractionCanvas.push({ text: String(text), x, y });
        return original.call(this, text, x, y, ...rest);
      };
    }
  });
}
async function collect(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(requestAnimationFrame);
    window.__fractionCanvas = [];
    lab.render();
    const failures = [], reviewCandidates = [], excluded = [], sources = [];
    const visible = (el) => el && el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && el.getClientRects().length;
    const locator = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().replace(/\s+/g, '.') : '');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement, text = node.textContent.trim();
      if (!text || !visible(el)) continue;
      if (el.closest('.katex,math,.mfrac,script,style,code,pre,input,textarea')) continue;
      const hiddenLive = el.closest('.apl-sr');
      if (hiddenLive) { if (/[\/\\]/.test(text)) excluded.push({ text, reason: 'visually-hidden-live-region-not-visual-math; accessibility-reviewed-separately' }); continue; }
      if (el.closest('.count,.apl-sub-count') || /^(?:풀이\s*\d+\s*\/\s*\d+\s*단계|(?:단계|장면)\s*\d+\s*\/\s*\d+)$/.test(text)) { if (text.includes('/')) excluded.push({ text, reason: 'navigation-progress' }); continue; }
      sources.push({ kind: 'dom', where: locator(el), text });
    }
    // KaTeX itself can render an author-supplied a/b as a slash: do not call it stacked
    // just because it is inside .katex. Inspect its visible HTML, never its annotation.
    for (const math of document.querySelectorAll('.katex-html')) {
      if (!visible(math)) continue;
      const copy = math.cloneNode(true);
      copy.querySelectorAll('.mfrac').forEach((el) => el.replaceWith(document.createTextNode(' [stacked fraction] ')));
      if (copy.textContent.includes('/')) sources.push({ kind: 'katex-visible', where: locator(math.parentElement), text: copy.textContent });
    }
    for (const label of window.__fractionCanvas) sources.push({ kind: 'canvas-final', ...label });
    const seen = new Set();
    for (const source of sources) {
      const key = source.kind + ':' + source.text;
      if (seen.has(key)) continue;
      seen.add(key);
      let text = source.text;
      text = text.replace(/https?:\/\/[^\s<>]+|\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b|\b(?:km|m|cm)\/(?:h|s)\b/g, (token) => { excluded.push({ ...source, token, reason: 'url-date-unit' }); return ''; });
      if (/\\(?:[dt]?frac|sqrt|pi|theta|cdot|times)\b/.test(text)) failures.push({ ...source, reason: 'raw-tex' });
      if (/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/.test(text) || /(?<![\w./])(?:\d*π|\d*√\d+|\d+(?:\.\d+)?)\/(?:√?\d+(?:\.\d+)?)(?![\w/])/.test(text)) failures.push({ ...source, reason: 'unstacked-numeric-fraction' });
      else if (text.includes('/')) reviewCandidates.push({ ...source, reason: /\d\s+\/\s*\d/.test(text) ? 'spaced-quotient-or-separator' : 'symbolic-quotient-or-separator' });
    }
    for (const el of document.querySelectorAll('.katex-error')) if (visible(el)) failures.push({ reason: 'katex-error', text: el.textContent });
    for (const el of document.querySelectorAll('.mfrac')) {
      if (!el.closest('.katex') || !visible(el.closest('.katex'))) continue;
      const r = el.getBoundingClientRect();
      if (!r.height || !r.width) failures.push({ reason: 'zero-size-fraction', text: el.closest('.katex').textContent });
      const button = el.closest('button');
      if (button) {
        const b = button.getBoundingClientRect();
        if (r.top < b.top - 1 || r.bottom > b.bottom + 1 || r.left < b.left - 1 || r.right > b.right + 1) failures.push({ reason: 'fraction-outside-button', text: button.textContent });
      }
    }
    return { scene: lab.scene.id, tab: lab.tab, failures, reviewCandidates, excluded, inspected: { dom: sources.filter((s) => s.kind === 'dom').length, canvasFinal: sources.filter((s) => s.kind === 'canvas-final').length } };
  });
}
try {
  for (const item of labs) {
    const entry = { id: item.id, expectedScenes: [], states: [], errors: [] };
    report.labs.push(entry);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', (e) => entry.errors.push(e.message));
    await install(page);
    try {
      if (!item.next) throw new Error('Catalog entry has no next path');
      await page.goto(new URL(item.next.replace(/^next\//, ''), base).href, { waitUntil: 'load' });
      await page.waitForFunction(() => window.lab?.board, { timeout: 20000 });
      entry.expectedScenes = await page.evaluate(() => lab.list.map((s) => s.id));
      for (let i = 0; i < entry.expectedScenes.length; i++) {
        const tabs = await page.evaluate((index) => { lab.goScene(index); return ['explore', 'review', 'problem'].filter((t) => lab._tabAvailable(t)); }, i);
        for (const tab of tabs) {
          await page.evaluate((t) => { lab.setTab(t); if (t === 'review') { const steps = typeof lab.scene.steps === 'function' ? lab.scene.steps(lab.s) : lab.scene.steps; lab.setStep(steps?.length || 0); } if (t === 'problem') lab.s.revealed = true; lab.render(); }, tab);
          entry.states.push(await collect(page));
          if (tab === 'problem') {
            const changed = await page.evaluate(() => { const b = [...document.querySelectorAll('.apl-newprob')].find((b) => b.checkVisibility()); if (!b) return false; b.click(); lab.s.revealed = true; lab.render(); return true; });
            if (changed) entry.states.push({ ...await collect(page), variant: 'new-problem-once' });
          }
        }
      }
    } catch (e) { entry.errors.push(e.stack || String(e)); }
    await page.close();
    fs.writeFileSync(path.join(out, item.id + '.json'), JSON.stringify(entry, null, 2));
    console.log(JSON.stringify({ lab: item.id, scenes: entry.expectedScenes.length, states: entry.states.length, failures: entry.states.reduce((n, s) => n + s.failures.length, entry.errors.length), candidates: entry.states.reduce((n, s) => n + s.reviewCandidates.length, 0) }));
  }
  // The user's exact regression case: real preset clicks, on both PC and phone.
  if (!only || only.includes('alg-unit-circle')) for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(new URL('labs/alg-unit-circle.html', base).href, { waitUntil: 'load' });
    await page.waitForFunction(() => window.lab?.board);
    await page.evaluate(() => lab.goScene(lab.list.findIndex((s) => s.id === 'coords')));
    for (const [tex, theta] of [['\\frac{\\pi}{6}', Math.PI / 6], ['\\frac{4\\pi}{3}', 4 * Math.PI / 3]]) {
      const button = page.locator('.apl-presets button').filter({ has: page.locator('annotation').filter({ hasText: tex }) }).first();
      await button.click();
      await page.waitForTimeout(700);
      const result = await page.evaluate(({ tex, theta }) => {
        const b = [...document.querySelectorAll('.apl-presets button')].find((b) => b.querySelector('annotation')?.textContent === tex);
        const fraction = b?.querySelector('.mfrac');
        const rect = b?.getBoundingClientRect();
        return { theta: lab.s.theta, expected: theta, selected: !!b?.classList.contains('on'), stacked: !!fraction && fraction.getBoundingClientRect().height > 0, buttonHeight: rect?.height, angleMatches: Math.abs(lab.s.theta - theta) < 1e-7, pageOverflow: document.documentElement.scrollWidth > innerWidth + 1 };
      }, { tex, theta });
      const name = `unit-circle-${viewport.width}-${theta < 1 ? 'pi6' : '4pi3'}`;
      await page.screenshot({ path: path.join(out, name + '.png'), fullPage: true });
      report.specialAngles.push({ name, ...result, pass: result.angleMatches && result.selected && result.stacked && result.buttonHeight >= 44 && !result.pageOverflow });
    }
    await page.close();
  }
} catch (e) { report.fatal = e.stack || String(e); }
finally { await browser.close(); }
const failures = report.labs.reduce((n, l) => n + l.errors.length + l.states.reduce((n, s) => n + s.failures.length, 0), 0) + report.specialAngles.filter((s) => !s.pass).length + (report.fatal ? 1 : 0);
const candidates = report.labs.reduce((n, l) => n + l.states.reduce((n, s) => n + s.reviewCandidates.length, 0), 0);
const incomplete = report.labs.length !== labs.length || report.labs.some((l) => !l.expectedScenes.length || l.expectedScenes.some((id) => !l.states.some((s) => s.scene === id && s.tab === 'explore')));
report.status = failures || incomplete ? 'FAIL' : candidates ? 'REVIEW_REQUIRED' : only ? 'PARTIAL_PASS' : 'PASS';
report.summary = { failures, reviewCandidates: candidates, incomplete, labs: report.labs.length, states: report.labs.reduce((n, l) => n + l.states.length, 0) };
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: report.status, scope: report.scope, ...report.summary, output: out }));
process.exitCode = report.status === 'PASS' || report.status === 'PARTIAL_PASS' ? 0 : report.status === 'REVIEW_REQUIRED' ? 2 : 1;
