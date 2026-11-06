// Real Chromium observations for the ten G7 geometry labs. Screenshots and logs
// are external evidence, never production assets. Math and visual review remain
// human/independent-review duties; an automated exit code is not a quality seal.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf(name); return i < 0 ? fallback : argv[i + 1]; };
const root = path.resolve(arg('--root', '.'));
const out = path.resolve(arg('--out', '.tmp/g7-browser-audit'));
const observe = argv.includes('--baseline-observe');
const allUnits = ['g7-points-lines', 'g7-parallel', 'g7-spatial', 'g7-construction', 'g7-area', 'g7-polygons', 'g7-circle-sector', 'g7-polyhedra', 'g7-surface-volume', 'g7-solids'];
const units = (arg('--units', allUnits.join(','))).split(',').filter(Boolean);
if (!units.length || units.some(x => !allUnits.includes(x))) throw Error('Unknown or empty G7 unit list');
const runs = [
  { name: 'pc', width: 1440, height: 900 },
  { name: 'tablet-portrait', width: 820, height: 1180 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (p !== root && !p.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/`;
fs.mkdirSync(out, { recursive: true });
const report = { version: 1, kind: observe ? 'BASELINE_OBSERVATION' : 'CANDIDATE_CHECK', commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), runs, units: {}, failures: [], limitations: ['Browser viewport simulation; physical devices NOT_RUN.', 'Math correctness and visual overlap require independent inspection.'] };
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { channel: 'chromium', headless: true });
try {
  for (const unit of units) {
    report.units[unit] = { scenes: [], observations: [], captures: [], interactions: [] };
    const dest = report.units[unit];
    for (const run of runs) {
      const ctx = await browser.newContext({ viewport: { width: run.width, height: run.height }, hasTouch: run.name !== 'pc', deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.addInitScript(() => { let seed = 1701; Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`HTTP ${r.status()} ${r.url()}`); });
      await page.goto(`${base}${unit}.html?theme=board`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.lab && lab.board && lab.list.length);
      await page.evaluate(() => document.fonts.ready);
      const measurementControl = await page.evaluate(() => {
        const c = document.createElement('canvas'); c.width = 600; c.height = 400;
        const x = c.getContext('2d');
        const count = () => { const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 30) n++; return n; };
        const blank = count(); x.fillRect(20, 200, 500, 1); const thinLine = count();
        return { blank, thinLine, threshold: 200, pass: blank < 200 && thinLine >= 200 };
      });
      (dest.measurementControls ||= []).push({ run: run.name, ...measurementControl });
      if (!measurementControl.pass) throw Error('Canvas measurement positive/negative control failed');
      const scenes = await page.evaluate(() => lab.list.map((s, index) => ({ id: String(s.id), title: s.title, index })));
      if (!dest.scenes.length) dest.scenes = scenes;
      if (new Set(scenes.map(s => s.id)).size !== scenes.length) report.failures.push({ unit, run: run.name, reason: 'duplicate-scene-id' });
      await page.evaluate(() => {
        const b = lab.board, original = b._text;
        window.__g7Labels = [];
        b._text = function (x, y, text, o = {}, screen) {
          if (text != null && text !== '' && !screen && !this._bbox && !this.thumb) {
            const size = (o.size || 13) * this.fs * this._ts(), c = this.ctx;
            c.save(); c.font = `${o.weight || 750} ${size}px ${this.font}`;
            const width = c.measureText(String(text)).width; c.restore();
            const al = o.align || 'center', bl = o.baseline || 'alphabetic';
            const x0 = x + (al === 'center' ? -width / 2 : al === 'right' || al === 'end' ? -width : 0);
            const y0 = y + (bl === 'middle' ? -size / 2 : bl === 'top' || bl === 'hanging' ? 0 : bl === 'bottom' ? -size : -size * .8);
            window.__g7Labels.push({ text: String(text), x0, y0, x1: x0 + width, y1: y0 + size });
          }
          return original.apply(this, arguments);
        };
      });
      const settle = () => page.evaluate(async () => { lab.render(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); window.__g7Labels = []; lab.render(); });
      const measure = async (scene, state) => {
        await settle();
        const obs = await page.evaluate(() => {
          const b = lab.board, c = b.canvas, data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          // Count actual occupied pixels. Stride sampling aliases thin horizontal
          // diagrams, so a valid long line could be reported as a blank canvas.
          // Keep the 200-pixel blank threshold; retain sampledInk as diagnostics.
          let ink = 0, sampledInk = 0;
          const stride = Math.min(31, Math.max(1, Math.round(c.width * c.height / 20360)));
          for (let k = 3; k < data.length; k += 4) if (data[k] > 30) { ink++; if (((k - 3) / 4) % stride === 0) sampledInk++; }
          const get = x => (typeof x === 'function' ? x(lab.s, lab) : x) || [];
          const want = get(lab.scene.controls).filter(k => lab.params[k]).length + get(lab.scene.presets).length + get(lab.scene.actions).length;
          const have = [...document.querySelectorAll('.apl-ctl, .apl-presets .apl-chip, .apl-actions-row button')].filter(e => e.checkVisibility()).length;
          const clipped = window.__g7Labels.filter(q => Math.max(-q.x0, q.x1 - b.W, -q.y0, q.y1 - b.H) > 2);
          return { ink, sampledInk, clipped, labels: window.__g7Labels, want, have, tab: lab.tab, step: lab.s.step, revealed: lab.s.revealed, answerOpen: !!lab.refs.answer?.classList.contains('open'), guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth + 1, katexErrors: [...document.querySelectorAll('.katex-error')].filter(e => e.checkVisibility()).map(e => e.textContent), values: Object.fromEntries(Object.keys(lab.params).map(k => [k, lab.s[k]])) };
        });
        const issues = [];
        if (obs.ink < 200) issues.push('blank-canvas');
        if (obs.clipped.length) issues.push('clipped-label');
        if (obs.overflow) issues.push('horizontal-overflow');
        if (obs.katexErrors.length) issues.push('katex-error');
        if (!obs.guide) issues.push('missing-guide');
        if (state === 'initial' && obs.want !== obs.have) issues.push('missing-control');
        const nSteps = await page.evaluate(() => { const x = lab.scene.steps; return (typeof x === 'function' ? x(lab.s, lab) : x)?.length || 0; });
        if (state === 'problem-hidden' && nSteps > obs.step && obs.answerOpen) issues.push('early-answer-open');
        const row = { id: scene.id, run: run.name, state, ...obs, issues };
        dest.observations.push(row);
        if (issues.length) report.failures.push({ unit, id: scene.id, run: run.name, state, issues, clipped: obs.clipped, katexErrors: obs.katexErrors });
        return row;
      };
      // First/middle/last plus supplied scene IDs provide reproducible captures.
      // All scenes still receive every measurement below.
      const targets = new Set([scenes[0]?.id, scenes[Math.floor(scenes.length / 2)]?.id, scenes.at(-1)?.id]);
      const targetDir = path.dirname(new URL(import.meta.url).pathname);
      const unitTargetFile = path.join(targetDir, `g7-geometry-audit-targets-${unit}.json`);
      const targetFile = path.join(targetDir, 'g7-geometry-audit-targets.json');
      const rawCases = fs.existsSync(unitTargetFile) ? JSON.parse(fs.readFileSync(unitTargetFile, 'utf8')) : fs.existsSync(targetFile) ? JSON.parse(fs.readFileSync(targetFile, 'utf8'))[unit] || [] : [];
      const cases = rawCases.map(x => typeof x === 'string' ? { id: x } : x);
      for (const c of cases) targets.add(String(c.id));
      for (const scene of scenes) {
        await page.evaluate(i => lab.goScene(i), scene.index);
        await measure(scene, 'initial');
        if (targets.has(scene.id)) {
          const filename = `${unit}--${scene.id}--${run.name}--initial.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
          await page.screenshot({ path: path.join(out, filename), fullPage: true }); dest.captures.push(filename);
        }
        const hasReview = await page.evaluate(() => lab._tabAvailable('review'));
        if (hasReview) {
          await page.evaluate(() => { lab.setTab('review'); lab.setStep(1); });
          await measure(scene, 'step-1');
        }
        if (await page.evaluate(() => lab._tabAvailable('problem'))) {
          await page.evaluate(() => { lab.setStep(0); lab.setTab('problem'); });
          await page.waitForFunction(() => !lab._tween);
          await measure(scene, 'problem-hidden');
        }
        if (hasReview) {
          await page.evaluate(() => { lab.setTab('review'); const x = lab.scene.steps; lab.setStep((typeof x === 'function' ? x(lab.s, lab) : x)?.length || 0); });
          await measure(scene, 'review-final');
          if (targets.has(scene.id)) {
            const filename = `${unit}--${scene.id}--${run.name}--review-final.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
            await page.screenshot({ path: path.join(out, filename), fullPage: true }); dest.captures.push(filename);
          }
        }
        if (targets.has(scene.id)) {
          await page.evaluate(i => lab.goScene(i), scene.index);
          await settle();
          const ctl = await page.evaluate(() => Object.entries(lab._ctls || {}).find(([, c]) => c.input.checkVisibility())?.[0] || null);
          if (ctl) {
            const info = await page.evaluate(k => { const p = lab.params[k]; return { label: APLab.stripEmoji(p.label), value: lab.s[k], step: +p.step || .01, min: +p.min, max: +p.max }; }, ctl);
            // Range inputs reject binary floating-point tails such as 0.15000000000000002.
            // Round to the control's decimal precision before exercising its real input event.
            const places = Math.max(0, String(info.step).split('.')[1]?.length || 0, String(info.min).split('.')[1]?.length || 0);
            const value = Number((info.value + info.step <= info.max ? info.value + info.step : info.value - info.step).toFixed(Math.min(12, places)));
            await page.getByRole('slider', { name: info.label, exact: true }).fill(String(value));
            const actual = await page.evaluate(k => lab.s[k], ctl);
            const pass = Math.abs(actual - value) < 1e-7;
            dest.interactions.push({ id: scene.id, run: run.name, control: ctl, expected: value, actual, pass });
            if (!pass) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'slider-state-mismatch', expected: value, actual });
          }
          const presets = page.locator('.apl-presets .apl-chip:visible');
          if (await presets.count()) {
            await presets.last().click(); await page.waitForFunction(() => !lab._tween); await settle();
            dest.interactions.push({ id: scene.id, run: run.name, control: 'preset-last', executed: true });
          }
          const handle = await page.evaluate(() => lab.board.handles.find(h => typeof h.drag === 'function' && h.x > 12 && h.x < lab.board.W - 12 && h.y > 12 && h.y < lab.board.H - 12));
          if (handle) {
            // Exercise native browser pointer events; do not invoke the drag callback.
            const actualCanvas = page.locator('canvas').filter({ visible: true }).first();
            await actualCanvas.scrollIntoViewIfNeeded();
            const rect = await actualCanvas.boundingBox();
            const before = await page.evaluate(() => JSON.stringify(lab.s));
            const start = { x: rect.x + handle.x, y: rect.y + handle.y };
            const dx = handle.x < rect.width / 2 ? 48 : -48, dy = handle.y < rect.height / 2 ? 24 : -24;
            await page.mouse.move(start.x, start.y); await page.mouse.down();
            await page.mouse.move(start.x + dx, start.y + dy, { steps: 8 }); await page.mouse.up(); await settle();
            const after = await page.evaluate(() => JSON.stringify(lab.s));
            dest.interactions.push({ id: scene.id, run: run.name, control: 'pointer-drag', handle: handle.id, executed: true, stateChanged: before !== after, pointer: 'mouse' });
          }
          const play = await page.evaluate(() => (lab._actionBtns || []).findIndex(({ a, b }) => (a.play || a.id === 'play') && b.checkVisibility()));
          if (play >= 0) {
            const before = await page.evaluate(() => JSON.stringify(lab.s));
            const buttons = page.locator('.apl-actions-row button');
            await buttons.nth(play).click(); await page.waitForTimeout(250);
            const during = await page.evaluate(() => ({ playing: !!lab.s.playing, state: JSON.stringify(lab.s) }));
            if (during.playing) await buttons.nth(play).click();
            const paused = await page.evaluate(() => !lab.s.playing);
            const pass = during.state !== before && paused;
            dest.interactions.push({ id: scene.id, run: run.name, control: 'play-pause', executed: true, pass });
            if (!pass) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'play-pause-state' });
          }
          const reset = await page.evaluate(() => (lab._actionBtns || []).findIndex(({ a, b }) => a.id === 'reset' && b.checkVisibility()));
          if (reset >= 0) {
            await page.locator('.apl-actions-row button').nth(reset).click(); await settle();
            const stopped = await page.evaluate(() => !lab.s.playing);
            dest.interactions.push({ id: scene.id, run: run.name, control: 'reset', executed: true, stopped });
            if (!stopped) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'reset-left-playing' });
          }
          if (await page.evaluate(() => lab._tabAvailable('problem'))) {
            await page.evaluate(i => { lab.goScene(i); lab.setStep(0); lab.setTab('problem'); }, scene.index);
            await page.waitForFunction(() => !lab._tween); await settle();
            const reveal = page.locator('[data-reveal]:visible');
            if (await reveal.count()) {
              await reveal.click(); await settle();
              const opened = await page.evaluate(() => !!lab.refs.answer?.classList.contains('open'));
              const signature = () => page.evaluate(() => { const p = lab.scene.problem, call = v => typeof v === 'function' ? v(lab.s, lab) : v; return JSON.stringify([call(p.text), call(p.answer)]); });
              const questionBefore = await signature();
              await page.evaluate(() => lab.setTab('explore')); await settle();
              const ctlInfo = await page.evaluate(() => {
                const x = Object.entries(lab._ctls || {}).find(([k, c]) => c.input.checkVisibility() && !/yaw|pitch|orbit|view/i.test(k));
                if (!x) return null; const [key] = x, p = lab.params[key];
                return { key, label: APLab.stripEmoji(p.label), value: lab.s[key], step: +p.step || .01, min: +p.min, max: +p.max };
              });
              if (ctlInfo) {
                const places = Math.max(0, String(ctlInfo.step).split('.')[1]?.length || 0, String(ctlInfo.min).split('.')[1]?.length || 0);
                const value = Number((ctlInfo.value + ctlInfo.step <= ctlInfo.max ? ctlInfo.value + ctlInfo.step : ctlInfo.value - ctlInfo.step).toFixed(Math.min(12, places)));
                await page.getByRole('slider', { name: ctlInfo.label, exact: true }).fill(String(value)); await settle();
                const changed = questionBefore !== await signature();
                await page.evaluate(() => lab.setTab('problem')); await page.waitForFunction(() => !lab._tween); await settle();
                const locked = await page.evaluate(() => !lab.refs.answer?.classList.contains('open'));
                dest.interactions.push({ id: scene.id, run: run.name, control: 'manual-reveal-then-parameter', opened, parameter: ctlInfo.key, problemChanged: changed, locked });
                if (opened && changed && !locked) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'new-values-retain-open-answer', parameter: ctlInfo.key });
              }
              const revealAgain = page.locator('[data-reveal]:visible');
              if (await revealAgain.count()) await revealAgain.click();
              const newProblem = page.locator('.apl-newprob:visible').last();
              if (await newProblem.count()) {
                await newProblem.click(); await page.waitForFunction(() => !lab._tween); await settle();
                const locked = await page.evaluate(() => !lab.refs.answer?.classList.contains('open'));
                dest.interactions.push({ id: scene.id, run: run.name, control: 'new-problem-relocks-answer', locked });
                if (!locked) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'new-problem-retains-open-answer' });
              }
            }
          }
        }
        for (const c of cases.filter(x => String(x.id) === scene.id && (x.params || x.tab || x.step != null))) {
          await page.evaluate(({ index, tab }) => { lab.goScene(index); if (tab) lab.setTab(tab); }, { index: scene.index, tab: c.tab });
          await page.waitForFunction(() => !lab._tween);
          await page.evaluate(c => { if (c.params) lab.set(c.params); if (c.step != null) lab.setStep(c.step); }, c);
          const label = 'target-' + (c.label || c.tab || 'fixed');
          await measure(scene, label);
          const filename = `${unit}--${scene.id}--${run.name}--${label}.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
          await page.screenshot({ path: path.join(out, filename), fullPage: true }); dest.captures.push(filename);
        }
      }
      if (errors.length) report.failures.push({ unit, run: run.name, reason: 'runtime-error', errors });
      await ctx.close();
      fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2));
      console.log(`${unit} ${run.name}: ${scenes.length} scenes observed; failures so far ${report.failures.length}`);
    }
  }
} finally {
  await browser.close(); await new Promise(resolve => server.close(resolve));
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ mode: report.kind, commit: report.commit, scenes: Object.values(report.units).reduce((n, u) => n + u.scenes.length, 0), failures: report.failures.length }));
process.exitCode = observe ? 0 : report.failures.length ? 1 : 0;
