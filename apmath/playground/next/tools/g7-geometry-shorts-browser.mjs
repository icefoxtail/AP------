/** New geometry shorts only: real HTTP/Chromium, every registered question,
 * normal-speed playback and native exploration restore. Existing baseline
 * proofs retain their separate, previously verified evidence. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const targets = (process.env.G7_SHORT_LABS || 'g7-area,g7-polygons,g7-parallel').split(',');
const mode = process.env.G7_SHORT_MODE || 'full';
assert.ok(['full', 'static'].includes(mode), 'unknown browser verification mode');
const liveScenes = new Set((process.env.G7_LIVE_SCENES || '').split(',').filter(Boolean));
const excludeScenes = new Set((process.env.G7_SHORT_EXCLUDE_SCENES || '').split(',').filter(Boolean));
const includeScenes = new Set((process.env.G7_SHORT_SCENES || '').split(',').filter(Boolean));
const out = path.resolve(process.env.G7_EVIDENCE || '.tmp/g7-geometry-browser');
const base = process.env.G7_BASE_URL || 'http://127.0.0.1:8765/apmath/playground/next/labs/';
fs.mkdirSync(out, { recursive: true });
const report = {
  kind: 'G7_NEW_GEOMETRY_SHORT_HTTP_CHROMIUM', commit: process.env.GITHUB_SHA || null,
  targets, mode, liveScenes: [...liveScenes], includeScenes: [...includeScenes], excludeScenes: [...excludeScenes], inventory: [], static: [], screenshots: [], live: [], interactions: [], errors: [],
  visualReview: 'PENDING_SCREENSHOT_REVIEW', studentObservation: 'NOT_RUN'
};
const save = () => fs.writeFileSync(path.join(out, 'geometry-report.json'), JSON.stringify(report, null, 2) + '\n');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const viewports = [{ width: 1440, height: 900 }, { width: 820, height: 1180 }, { width: 1024, height: 768 }, { width: 390, height: 844 }];

async function pageFor(viewport, reducedMotion = 'reduce') {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push({ url: page.url(), message: e.message }));
  page.on('console', m => { if (m.type() === 'error') report.errors.push({ url: page.url(), message: m.text() }); });
  return { page, context };
}
async function load(page, id, hash = '') {
  await page.goto(base + id + '.html' + hash);
  await page.waitForFunction(() => window.lab?.learning);
  await page.evaluate(() => document.fonts.ready);
}
async function inventory(page) {
  const entries = await page.evaluate(() => lab.list.map((scene, i) => ({
    i, scene: scene.id, title: scene.title,
    labels: lab.video.lessonInfo(i).map(x => x.label || ''),
    shortInfo: APLab.G7ShortInfo?.[`${lab.id}/${scene.id}`] || []
  })));
  return entries.filter(x => !excludeScenes.has(x.scene) && (!includeScenes.size || includeScenes.has(x.scene)));
}

try {
  // Static seeking is a render/condition check, not timed playback evidence.
  for (const viewport of viewports) {
    const { page, context } = await pageFor(viewport);
    for (const id of targets) {
      await load(page, id);
      const entries = await inventory(page);
      if (viewport.width === 390) report.inventory.push({ id, entries });
      for (const entry of entries) {
        assert.deepEqual(entry.shortInfo.map(x => x.legacyLabel).sort(), [...entry.labels].sort(), `${id}/${entry.scene}: missing question metadata`);
        const checks = await page.evaluate(async ({ i, labels }) => {
          lab.goScene(i); lab.learning.explore();
          const state = () => {
            const s = JSON.parse(JSON.stringify(lab.s));
            delete s.lessonOn; delete s.lessonEntry; delete s.playing;
            return JSON.stringify(s);
          };
          const before = state(), plans = lab.learning.plans();
          const rows = [];
          for (let choice = 0; choice < plans.length; choice++) {
            lab.learning.choice = choice; lab.learning.play(); lab.learning.pause();
            const p = lab.learning.active, frames = [];
            const stages = [...new Set([0, ...(p.stops || []), p.duration * .25, p.duration * .55, p.duration * .85, p.duration])].sort((a, z) => a - z);
            for (const t of stages) {
              lab.learning.seek(t);
              await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
              const text = [], b = lab.board, original = b._text;
              b._text = function (x, y, str, options = {}, screen = false) {
                if (str != null) text.push({ x, y, text: String(str), size: (options.size || 13) * this.fs * this._ts() });
                return original.call(this, x, y, str, options, screen);
              };
              try { lab.render(); } finally { b._text = original; }
              const c = lab.ui.canvas, rgba = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
              let ink = 0; for (let k = 3; k < rgba.length; k += 4) if (rgba[k] > 20) ink++;
              // KaTeX retains source TeX in its accessibility annotation. Only
              // inspect text outside rendered math; a missing delimiter used
              // to leave bare commands visible while the dollar-only gate passed.
              const plainMathText = [lab.learning.ui.caption, lab.learning.ui.formula, lab.learning.ui.goal].map(el => {
                const clone = el.cloneNode(true);
                clone.querySelectorAll('.katex').forEach(node => node.remove());
                return clone.textContent;
              }).join(' ');
              frames.push({
                t, ink, width: b.W, height: b.H,
                overflow: document.documentElement.scrollWidth > innerWidth + 2,
                katexErrors: document.querySelectorAll('.katex-error').length,
                unrenderedMath: /\$|\\[A-Za-z]+/.test(plainMathText),
                finiteText: text.every(x => Number.isFinite(x.x) && Number.isFinite(x.y)),
                clippedControls: [...lab.learning.ui.root.querySelectorAll('button')].filter(x => {
                  const r = x.getBoundingClientRect();
                  return r.width > 0 && r.height > 0 && (r.left < -1 || r.right > innerWidth + 1 || x.scrollWidth > x.clientWidth + 2);
                }).map(x => x.textContent),
                offCanvasText: text.filter(x => x.x < -1 || x.x > b.W + 1 || x.y < -1 || x.y > b.H + 1),
                caption: lab.learning.ui.caption.textContent, formula: lab.learning.ui.formula.textContent
              });
            }
            const during = state(); lab.learning.explore();
            const after = state(), originalState = JSON.parse(before);
            const changedKeys = value => {
              const other = JSON.parse(value);
              return [...new Set([...Object.keys(originalState), ...Object.keys(other)])].filter(key => JSON.stringify(originalState[key]) !== JSON.stringify(other[key]));
            };
            rows.push({ id: p.id, label: p.legacyLabel, duration: p.duration, frames, untouched: before === during, restored: before === after, changedDuring: changedKeys(during), changedAfter: changedKeys(after) });
          }
          return { labels: plans.map(p => p.legacyLabel), rows };
        }, { i: entry.i, labels: entry.labels });
        // Keep the failing row as evidence too; a boolean-only assertion hid
        // which native cache changed in the earlier polyhedra restoration bug.
        report.static.push({ id, scene: entry.scene, viewport, ...checks });
        assert.deepEqual([...checks.labels].sort(), [...entry.labels].sort(), `${id}/${entry.scene}: missing visual solution`);
        for (const row of checks.rows) {
          assert.ok(row.duration > 0 && row.duration <= 10, `${row.id}: duration`);
          assert.ok(row.untouched && row.restored, `${row.id}: exploration changed`);
          for (const f of row.frames) {
            assert.ok(f.width >= 150 && f.height >= 150 && f.ink > 200, `${row.id}: missing drawing`);
            assert.ok(f.finiteText, `${row.id}: nonfinite label`);
            assert.equal(f.katexErrors, 0, `${row.id}: invalid formula`);
            assert.ok(!f.unrenderedMath, `${row.id}: inline mathematics was not rendered at ${viewport.width}`);
            assert.ok(!f.overflow, `${row.id}: horizontal overflow at ${viewport.width}`);
            assert.deepEqual(f.clippedControls, [], `${row.id}: clipped learning buttons at ${viewport.width}`);
          }
        }
        // End-state sheets from all four viewports support actual visual review.
        const shown = await page.evaluate(async i => {
          lab.goScene(i); lab.learning.explore(); lab.learning.choice = 0;
          lab.learning.play(); lab.learning.seek(lab.learning.active.duration);
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
          return { choice: 0, label: lab.learning.active.legacyLabel };
        }, entry.i);
        const file = `geometry-${id}-${entry.scene}-choice-0-${viewport.width}-final.png`;
        await page.screenshot({ path: path.join(out, file) });
        report.screenshots.push({ id, scene: entry.scene, viewport, ...shown, file });
      }
      // Metadata also controls the visible table of contents.
      const toc = await page.evaluate(() => {
        lab.learning.explore(); lab.toc.open();
        const times = [...lab.toc.ui.list.querySelectorAll('.sec')].map(x => x.textContent);
        const row = lab.list.findIndex(sc => (APLab.G7ShortInfo?.[`${lab.id}/${sc.id}`] || []).length > 1);
        const i = row < 0 ? 0 : row, k = row < 0 ? 0 : 1;
        lab.toc.go(i, k);
        return { times, label: lab.learning.active?.legacyLabel, expected: lab.video.lessonInfo(i)[k].label || '', mode: lab.learning.mode };
      });
      assert.ok(toc.times.length > 0 && toc.times.every(x => parseFloat(x) <= 10), `${id}: stale TOC durations`);
      assert.equal(toc.label, toc.expected); assert.equal(toc.mode, 'paused');
      report.interactions.push({ name: 'toc-question-mapping', id, viewport, ...toc });
      save();
    }
    await context.close();
  }

  // Every new question runs on the normal clock on a phone-sized viewport.
  // No seeking, acceleration, mocked clock or shortened legacy lesson is used.
  const { page, context } = await pageFor(viewports[3], 'no-preference');
  for (const id of targets) {
    if (mode === 'static' && !liveScenes.size) continue;
    await load(page, id);
    const entries = await inventory(page);
    for (const entry of entries) {
      if (mode === 'static' && !liveScenes.has(entry.scene)) continue;
      for (let choice = 0; choice < entry.labels.length; choice++) {
        await page.evaluate(({ i, choice }) => {
          lab.goScene(i); lab.learning.explore(); lab.learning.choice = choice;
          lab.learning.play(); window.geometryStart = performance.now(); window.geometryEnd = null;
          const watch = () => {
            if (lab.learning.mode === 'ended') window.geometryEnd = performance.now();
            else requestAnimationFrame(watch);
          };
          requestAnimationFrame(watch);
        }, { i: entry.i, choice });
        const files = [];
        const duration = await page.evaluate(() => lab.learning.active.duration);
        for (const t of [0, duration * .42, duration * .74]) {
          await page.waitForFunction(t => lab.learning.elapsed >= t, t, { timeout: 15000 });
          const name = `geometry-live-${id}-${entry.scene}-${choice}-${t.toFixed(1).replace('.', '_')}.png`;
          await page.screenshot({ path: path.join(out, name) }); files.push(name);
        }
        await page.waitForFunction(() => window.geometryEnd !== null, null, { timeout: 15000 });
        const timing = await page.evaluate(() => ({ seconds: (window.geometryEnd - window.geometryStart) / 1000, duration: lab.learning.active.duration, label: lab.learning.active.legacyLabel }));
        assert.ok(timing.seconds >= timing.duration - .15 && timing.seconds <= 10, `${id}/${entry.scene}: actual playback ${timing.seconds}s`);
        const name = `geometry-live-${id}-${entry.scene}-${choice}-final.png`;
        await page.screenshot({ path: path.join(out, name) }); files.push(name);
        report.live.push({ id, scene: entry.scene, choice, ...timing, files }); save();
      }
    }
  }
  await context.close();

  // The native p3-4 default starts fully folded. Its separate editable zero
  // fold condition exposed a real missing-occlusion path between .5 and 2.6s.
  // Capture that actual pose explicitly; seeking is static evidence only.
  if (targets.includes('g7-polyhedra') && (!includeScenes.size || includeScenes.has('p3-4'))) {
    for (const viewport of [viewports[0], viewports[3]]) {
      const extra = await pageFor(viewport);
      await load(extra.page, 'g7-polyhedra');
      for (const choice of [0, 1, 2]) {
        const result = await extra.page.evaluate(async choice => {
          lab.goScene(lab.list.findIndex(sc => sc.id === 'p3-4')); lab.learning.explore();
          lab.s.phFold = 0;
          const state = () => JSON.stringify(Object.fromEntries(Object.entries(lab.s).filter(([key]) => !['lessonOn', 'lessonEntry', 'playing'].includes(key))));
          const before = state();
          lab.learning.choice = choice; lab.learning.play(); lab.learning.pause(); lab.learning.seek(1.55);
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
          return { scene: lab.scene.id, plan: lab.learning.active.id, startFold: lab.learning.active.model.s.phFold, elapsed: lab.learning.elapsed, untouched: before === state() };
        }, choice);
        assert.equal(result.scene, 'p3-4'); assert.equal(result.startFold, 0); assert.equal(result.elapsed, 1.55); assert.ok(result.untouched);
        const file = `geometry-native-g7-polyhedra-p3-4-${choice}-${viewport.width}-fold-half.png`;
        await extra.page.screenshot({ path: path.join(out, file) });
        report.interactions.push({ name: 'native-zero-fold-skew-edge-midpoint', viewport, choice, file, ...result });
      }
      await extra.context.close();
    }
    save();
  }

  // A native edit, replay, navigation, reload and an explicit question choice.
  if (targets.includes('g7-area')) {
  const reduced = await pageFor(viewports[3]);
  await load(reduced.page, 'g7-area', '#s=a1-rect');
  const native = await reduced.page.evaluate(() => {
    lab.learning.explore(); lab.s.a1W = 9; lab.s.a1H = 5;
    lab.learning.play(); lab.learning.seek(3.8); lab.learning.explore();
    const restored = { w: lab.s.a1W, h: lab.s.a1H };
    lab.learning.play(); lab.learning.seek(3.8); lab.learning.store();
    const model = lab.learning.active.model;
    return { restored, plan: lab.learning.active.id, model: { w: model.W, h: model.H, area: model.A } };
  });
  assert.deepEqual(native.restored, { w: 9, h: 5 });
  assert.deepEqual(native.model, { w: 9, h: 5, area: 45 });
  const navigated = await reduced.page.evaluate(() => {
    lab.goScene(1); lab.goScene(0);
    const model = lab.learning.active.model;
    return { w: lab.s.a1W, h: lab.s.a1H, t: lab.learning.elapsed, mode: lab.learning.mode, model: { w: model.W, h: model.H, area: model.A } };
  });
  assert.deepEqual(navigated, { w: 9, h: 5, t: 3.8, mode: 'paused', model: { w: 9, h: 5, area: 45 } });
  report.interactions.push({ name: 'area-before-reload', hash: await reduced.page.evaluate(() => location.hash), navigated }); save();
  await reduced.page.reload(); await reduced.page.waitForFunction(() => window.lab?.learning);
  const resumed = await reduced.page.evaluate(() => {
    const model = lab.learning.active?.model || {};
    return { w: lab.s.a1W, h: lab.s.a1H, t: lab.learning.elapsed, mode: lab.learning.mode, model: { w: model.W, h: model.H, area: model.A } };
  });
  report.interactions.push({ name: 'area-after-reload', resumed }); save();
  assert.deepEqual(resumed, { w: 9, h: 5, t: 3.8, mode: 'paused', model: { w: 9, h: 5, area: 45 } });
  report.interactions.push({ name: 'area-current-conditions-replay-navigation-reload', restored: native.restored, model: native.model, navigated, resumed });
  await reduced.context.close();
  }
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  report.status = 'TECHNICAL_CHECKS_PASSED';
} catch (error) {
  report.status = 'FAIL'; report.failure = error.stack; process.exitCode = 1; console.error(error);
} finally { save(); await browser.close(); }
console.log(JSON.stringify({ status: report.status, screens: report.inventory.reduce((n, x) => n + x.entries.length, 0), static: report.static.length, live: report.live.length, errors: report.errors.length, out }));
