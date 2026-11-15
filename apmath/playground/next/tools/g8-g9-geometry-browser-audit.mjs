// Real Chromium observations for the six G8/G9 geometry labs. Screenshots and logs
// are external evidence, never production assets. Math and visual review remain
// human/independent-review duties; an automated exit code is not a quality seal.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { evidenceProvenance, bindLabSources, sha256 } from './high-evidence-binding.mjs';
import { createScreenshotGuard, screenshotEnvironmentMatches, SCREENSHOT_ENVIRONMENT_POLICY, VIEWPORT_PIXEL_POLICY } from './browser-screenshot-guard.mjs';
import { captureReviewState } from './high-viewport-evidence.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf(name); return i < 0 ? fallback : argv[i + 1]; };
const root = path.resolve(arg('--root', '.'));
const out = path.resolve(arg('--out', '.tmp/g8-g9-browser-audit'));
const observe = argv.includes('--baseline-observe');
const allUnits = ['g8-triangles', 'g8-quadrilaterals', 'g8-similarity', 'g8-pythagoras', 'g9-trig-ratio', 'g9-circle'];
const units = (arg('--units', allUnits.join(','))).split(',').filter(Boolean);
if (!units.length || units.some(x => !allUnits.includes(x))) throw Error('Unknown or empty G8/G9 unit list');
// The visible range can clamp stale lab.s values. Ask an off-DOM clone to choose
// an allowed adjacent value; only the later native fill changes the real control.
function nextNativeRangeInput(key) {
  const input = lab._ctls?.[key]?.input;
  if (!input || !input.checkVisibility() || input.type !== 'range') throw Error(`Visible range missing: ${key}`);
  const dom = { min: input.min, max: input.max, step: input.step, value: input.value, valueAsNumber: input.valueAsNumber, valueAttribute: input.getAttribute('value') };
  const current = input.valueAsNumber;
  if (!Number.isFinite(current)) throw Error(`Non-finite visible range value: ${key} ${JSON.stringify(dom)}`);
  const probe = input.cloneNode(false);
  for (const direction of [1, -1]) {
    probe.value = input.value;
    if (input.step.toLowerCase() === 'any') probe.value = direction > 0 ? input.max || '100' : input.min || '0';
    else if (direction > 0) probe.stepUp();
    else probe.stepDown();
    const value = probe.valueAsNumber;
    if (Number.isFinite(value) && value !== current && probe.validity.valid) {
      return { key, label: input.getAttribute('aria-label') || APLab.stripEmoji(lab.params[key].label), value, text: probe.value, dom, storedBefore: lab.s[key] };
    }
  }
  throw Error(`No distinct valid range value: ${key} ${JSON.stringify(dom)}`);
}
function readStudentEntry() {
  const visible = selector => !!document.querySelector(selector)?.checkVisibility();
  const pane = document.querySelector('#apl-pane-explore');
  // The narrow layout uses display: contents: the pane has no box, but its
  // rendered children must still be visible and the pane must not be hidden.
  const explorePanel = {
    present: !!pane, hidden: pane?.hidden ?? true,
    ariaHidden: pane?.getAttribute('aria-hidden') ?? null,
    display: pane ? getComputedStyle(pane).display : null,
    renderedChildren: pane ? [...pane.children]
      .filter(child => child.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
      .map(child => ({ tag: child.tagName.toLowerCase(), id: child.id || null, className: child.getAttribute('class') })) : []
  };
  return {
    sceneId: String(lab.scene.id), tab: lab.tab, nativePlayer: lab.video?.state ?? null,
    lessonFirst: document.body.classList.contains('apl-lessonfirst'),
    entryVisible: visible('.apl-lentry'), entryMode: document.querySelector('.apl-lentry')?.dataset.mode ?? null,
    lessonButtons: document.querySelectorAll('.apl-lentry .apl-lgo').length,
    directExploreVisible: visible('.apl-lentry .apl-lmanual'),
    tabsVisible: visible('.apl-tabs'), exploreTabVisible: visible('button.apl-tab[aria-controls="apl-pane-explore"]'),
    explorePanelVisible: explorePanel.present && !explorePanel.hidden && explorePanel.ariaHidden !== 'true' && explorePanel.display !== 'none' && explorePanel.renderedChildren.length > 0,
    explorePanel
  };
}
async function enterStudentExploration(page, entry, settle) {
  try {
    // The native controls are reached through the real student entry, including
    // on the fixed baseline. Never replace this action with a manual URL or setter.
    if (entry.before.lessonFirst) {
      if (!entry.before.entryVisible || entry.before.entryMode !== 'first' || !entry.before.lessonButtons || entry.before.nativePlayer !== 'idle') throw Error('Lesson-first screen has no idle lesson entry');
      const selector = '.apl-lentry[data-mode="first"] .apl-lmanual', button = page.locator(selector);
      if (await button.count() !== 1 || !await button.isVisible() || !await button.isEnabled()) throw Error('Lesson-first screen has no usable direct-exploration button');
      entry.action = { selector, method: 'Playwright locator.click on the actual UI' };
      await button.click();
    }
    await settle();
    entry.after = await page.evaluate(readStudentEntry);
    const after = entry.after;
    if (after.lessonFirst || after.sceneId !== entry.before.sceneId || after.tab !== 'explore' || !after.tabsVisible || !after.exploreTabVisible || !after.explorePanelVisible) throw Error(`Exploration entry did not expose the original tabs and panel: ${JSON.stringify(after)}`);
    entry.status = 'PASS';
  } catch (error) {
    entry.status = 'FAIL'; entry.error = error.message;
    throw Error(`Student exploration entry failed: ${error.message}`);
  }
}

const viewports = [
  { name: 'pc', width: 1440, height: 900 },
  { name: 'tablet-portrait', width: 820, height: 1180 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const runs = viewports.flatMap(v => ['board', 'paper'].map(theme => ({ ...v, name: `${v.name}-${theme}`, theme })));
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
const provenance = evidenceProvenance(root, { baseline: observe });
const sourceBindings = units.map(id => bindLabSources(root, { id, next: `next/labs/${id}.html` }, provenance));
const report = { version: 2, kind: observe ? 'BASELINE_OBSERVATION' : 'CANDIDATE_CHECK', commit: provenance.sourceCommit, provenance, sourceBindings, runs, units: {}, failures: sourceBindings.flatMap(b => b.errors.map(e => ({ unit: b.lab, ...e }))), limitations: ['Browser viewport simulation; physical devices NOT_RUN.', 'Mouse pointer probes do not certify touch input.', 'Math correctness and visual overlap require independent inspection.'] };
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { channel: 'chromium', headless: true });
report.screenshotEnvironmentPolicy = SCREENSHOT_ENVIRONMENT_POLICY;
report.viewportEvidencePolicy = { raw: 'Legacy full-page capture denominator; touch-context pixels UNVERIFIED_BEYOND_VIEWPORT', supporting: 'Fixed-viewport PNGs with actual environment and byte readback; separate denominator', pointerCoverage: 'Existing mouse probes only; no native touch claim' };
try {
  for (const unit of units) {
    report.units[unit] = { scenes: [], observations: [], entries: [], captures: [], captureMetadata: {}, viewportCaptures: [], screenshotEnvironment: [], interactions: [] };
    const dest = report.units[unit];
    dest.controlCoverage = { allScenesRun: 'mobile-paper', otherRuns: 'targeted-scenes', numeric: 'first-visible-slider', drag: 'first-visible-draggable-handle', pointer: 'mouse', reset: 'native-click-stopped-and-rendered' };
    for (const run of runs) {
      const ctx = await browser.newContext({ viewport: { width: run.width, height: run.height }, hasTouch: !run.name.startsWith('pc-'), deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      let screenshotGuard;
      try {
      await page.addInitScript(() => { let seed = 1701; Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`HTTP ${r.status()} ${r.url()}`); });
      await page.goto(`${base}${unit}.html?theme=${run.theme}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.lab && lab.board && lab.list.length);
      await page.evaluate(() => document.fonts.ready);
      // Pin the loaded target document, not about:blank's event properties.
      screenshotGuard = await createScreenshotGuard(page, { expectedTouch: !run.name.startsWith('pc-'), onObservation: observation => {
        dest.screenshotEnvironment.push({ run: run.name, ...observation });
        if (!observation.pass) report.failures.push({ unit, run: run.name, reason: observation.reason, screenshotEnvironment: observation });
      } });
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
      const expected = { 'g8-triangles':43, 'g8-quadrilaterals':32, 'g8-similarity':39, 'g8-pythagoras':37, 'g9-trig-ratio':51, 'g9-circle':45 };
      if (scenes.length !== expected[unit]) report.failures.push({ unit, run: run.name, reason:'scene-inventory-changed', expected:expected[unit], actual:scenes.length });
      if (new Set(scenes.map(s => s.id)).size !== scenes.length) report.failures.push({ unit, run: run.name, reason: 'duplicate-scene-id' });
      await page.evaluate(() => {
        const b = lab.board, original = b._text;
        window.__g89Labels = [];
        window.__g89TextBox = function (x, y, text, o = {}) {
          const size=(o.size||13)*b.fs*b._ts(), c=b.ctx, weight=o.weight||750;
          const segs=b._fracSplit(String(text)); let width=0, fractionSize=0, gap=0;
          c.save();c.font=`${weight} ${size}px ${b.font}`;
          if(segs){
            fractionSize=Math.max(size*.72,Math.min(size*.9,9.5));gap=fractionSize*.2;
            for(const part of segs){c.font=`${weight} ${part.t!==undefined?size:fractionSize}px ${b.font}`;width+=part.t!==undefined?c.measureText(part.t).width:Math.max(c.measureText(part.n).width,c.measureText(part.d).width)+fractionSize*.34;}
          }else width=c.measureText(String(text)).width;
          c.restore();
          const al=o.align||'center', bl=o.baseline||'alphabetic';
          const x0=x+(al==='center'?-width/2:al==='right'||al==='end'?-width:0);
          let top=bl==='middle'?-size/2:bl==='top'||bl==='hanging'?0:bl==='bottom'?-size:-size*.8,bottom=top+size;
          if(segs){const mid=bl==='middle'?0:bl==='top'||bl==='hanging'?size*.5:bl==='bottom'?-size*.5:-size*.3;top=Math.min(top,mid-gap-fractionSize*.95);bottom=Math.max(bottom,mid+gap+fractionSize*.95);}
          return {text:String(text),x0,y0:y+top,x1:x0+width,y1:y+bottom};
        };
        b._text = function (x, y, text, o = {}, screen) {
          if (text != null && text !== '' && !screen && !this._bbox && !this.thumb) {
            window.__g89Labels.push(window.__g89TextBox(x,y,text,o));
          }
          return original.apply(this, arguments);
        };
      });
      const fractionControl=await page.evaluate(()=>{
        const b=lab.board,o={size:16,baseline:'middle'},inside=__g89TextBox(b.W/2,b.H/2,'\\frac{12}{5}',o),outside=__g89TextBox(b.W+10,b.H/2,'\\frac{12}{5}',o);
        return {inside,outside,pass:inside.x0>=0&&inside.x1<=b.W&&inside.y0>=0&&inside.y1<=b.H&&outside.x1>b.W+2&&inside.y1-inside.y0>16*b.fs*b._ts()};
      });
      dest.measurementControls.push({run:run.name,type:'stacked-fraction-bounds',...fractionControl});
      if(!fractionControl.pass)throw Error('Stacked-fraction clipping positive/negative control failed');
      const settle = () => page.evaluate(async () => { lab.render(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); window.__g89Labels = []; lab.render(); });
      const capture = async filename => {
        const evidence = dest.entries?.find(entry => entry.capture === filename) || dest;
        const identity = await page.evaluate(() => ({ id: String(lab.scene.id), state: `${lab.tab}:${lab.s.step}` }));
        try {
          const bundle = await captureReviewState({ page, guard: screenshotGuard, out, name: filename, ...identity, fullPage: true, settle, collectContent: false,
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
            evidence.viewportCaptures.push({ file: bundle.file, rawReference: filename, run: run.name, ...identity, frame });
          }
          evidence.captures.push(filename);
        } catch (error) {
          report.failures.push({ unit, run: run.name, ...identity, reason: 'screenshot-evidence-failed', file: filename, error: error.message });
          throw error;
        }
      };
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
          const clipped = window.__g89Labels.filter(q => Math.max(-q.x0, q.x1 - b.W, -q.y0, q.y1 - b.H) > 2);
          const reviewSteps = Array.from(lab.refs.steps?.children || []).map((el, i) => ({ index: i + 1, open: i < lab.s.step, text: el.children[1]?.textContent.trim() || '', expanded: el.getAttribute('aria-expanded') }));
          const futureStepText = reviewSteps.filter(x => !x.open && x.text !== '선택하면 이 단계의 풀이가 열립니다.');
          const hint = document.querySelector('.apl-orient-hint'), hr = hint?.checkVisibility() ? hint.getBoundingClientRect() : null, cr = c.getBoundingClientRect();
          const orientationHintOverlap = hr ? Math.max(0, Math.min(hr.right, cr.right) - Math.max(hr.left, cr.left)) * Math.max(0, Math.min(hr.bottom, cr.bottom) - Math.max(hr.top, cr.top)) : 0;
          const question = lab.scene.question, expectedQuestion = document.createElement('div');
          expectedQuestion.innerHTML = question ? APLab.renderMath(typeof question === 'function' ? question(lab.s, lab) : question) : '';
          const normalize = text => (text || '').replace(/\s+/g, ' ').trim();
          const questionText = normalize(lab.ui.head.querySelector('.apl-question .q')?.textContent);
          const questionMatches = questionText === normalize(expectedQuestion.textContent);
          const problemTag = lab.scene.problem?.tag, tagExpected = document.createElement('div');
          tagExpected.innerHTML = problemTag ? APLab.renderMath(APLab.esc(APLab.stripEmoji(typeof problemTag === 'function' ? problemTag(lab.s) : problemTag))) : '';
          const tagElement = document.querySelector('#apl-pane-problem .apl-problem-meta .apl-tag');
          const problemTagMatches = problemTag ? !!tagElement && normalize(tagElement.textContent) === normalize(tagExpected.textContent) : !tagElement;
          const visibleText = [...document.querySelectorAll('.apl-tabpanel:not([hidden])')].map(el=>{const c=el.cloneNode(true);c.querySelectorAll('.katex,script,style').forEach(n=>n.remove());return c.textContent;}).join(' ');
          const brokenText = (visibleText.match(/undefined|NaN|Infinity|\[object Object\]|\$|\\(?:frac|sqrt|sin|cos|tan|angle|circ)\b/g)||[]).slice(0,20);
          return { brokenText, ink, sampledInk, clipped, labels: window.__g89Labels, want, have, reviewSteps, futureStepText, orientationHintOverlap, questionText, questionMatches, problemTagMatches, tab: lab.tab, step: lab.s.step, revealed: lab.s.revealed, answerOpen: !!lab.refs.answer?.classList.contains('open'), guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth + 1, katexErrors: [...document.querySelectorAll('.katex-error')].filter(e => e.checkVisibility()).map(e => e.textContent), values: Object.fromEntries(Object.keys(lab.params).map(k => [k, lab.s[k]])) };
        });
        const issues = [];
        if (obs.ink < 200) issues.push('blank-canvas');
        if (obs.clipped.length) issues.push('clipped-label');
        if (obs.overflow) issues.push('horizontal-overflow');
        if (obs.katexErrors.length) issues.push('katex-error');
        if (obs.brokenText.length) issues.push('broken-panel-text');
        if (obs.tab === 'review' && obs.futureStepText.length) issues.push('future-step-disclosure');
        if (obs.orientationHintOverlap > 0) issues.push('orientation-hint-covers-canvas');
        if (!obs.questionMatches) issues.push('question-text-state-mismatch');
        if (!obs.problemTagMatches) issues.push('problem-tag-state-mismatch');
        if (!obs.guide) issues.push('missing-guide');
        if (state === 'initial' && obs.want !== obs.have) issues.push('missing-control');
        const nSteps = await page.evaluate(() => { const x = lab.scene.steps; return (typeof x === 'function' ? x(lab.s, lab) : x)?.length || 0; });
        if (state === 'problem-hidden' && nSteps > obs.step && obs.answerOpen) issues.push('early-answer-open');
        const row = { id: scene.id, run: run.name, state, ...obs, issues };
        dest.observations.push(row);
        if (issues.length) report.failures.push({ unit, id: scene.id, run: run.name, state, issues, clipped: obs.clipped, katexErrors: obs.katexErrors });
        return row;
      };
      const entry = { run: run.name, before: await page.evaluate(readStudentEntry), action: null, status: 'RUNNING', captures: [], captureMetadata: {}, viewportCaptures: [] };
      dest.entries.push(entry);
      entry.capture = `${unit}--${entry.before.sceneId}--${run.name}--entry.png`;
      // Entry evidence is separate from the unchanged scene/state capture totals.
      await capture(entry.capture);
      await enterStudentExploration(page, entry, settle);
      if (entry.action) dest.interactions.push({ id: entry.before.sceneId, run: run.name, control: 'enter-explore', ...entry.action });
      // First/middle/last plus supplied scene IDs provide reproducible captures.
      // All scenes still receive every measurement below.
      const targets = new Set([scenes[0]?.id, scenes[Math.floor(scenes.length / 2)]?.id, scenes.at(-1)?.id]);
      const targetDir = path.dirname(new URL(import.meta.url).pathname);
      const unitTargetFile = path.join(targetDir, `g8-g9-geometry-audit-targets-${unit}.json`);
      const targetFile = path.join(targetDir, 'g8-g9-geometry-audit-targets.json');
      const normalize = x => typeof x === 'string' ? { id: x } : x;
      const alternateTargetFile = path.join(targetDir, `${unit}-audit-targets.json`);
      const unitCases = [unitTargetFile, alternateTargetFile].filter(f => fs.existsSync(f)).flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')).map(normalize));
      const commonCases = (fs.existsSync(targetFile) ? JSON.parse(fs.readFileSync(targetFile, 'utf8'))[unit] || [] : []).map(normalize);
      // Named per-unit cases replace their earlier shared revision. Otherwise keep
      // both sources: adding a unit manifest must not silently remove old risks.
      const named = new Set(unitCases.filter(x => x.label).map(x => x.id + '|' + x.label));
      const stable = x => Array.isArray(x) ? x.map(stable) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map(k => [k, stable(x[k])])) : x;
      const seen = new Set(), filenames = new Set(), cases = [];
      for (const x of [...unitCases, ...commonCases.filter(x => !x.label || !named.has(x.id + '|' + x.label))]) {
        const key = JSON.stringify(stable({ id: x.id, tab: x.tab || 'explore', step: x.step ?? 0, params: x.params || {}, questionKey: x.questionKey || '', inputKey: x.inputKey || '', fromTab: x.fromTab || '' }));
        if (seen.has(key)) continue;
        seen.add(key);
        const c = { ...x }, name = c.id + '|' + (c.label || c.tab || 'fixed');
        if (filenames.has(name)) c.label = (c.label || c.tab || 'fixed') + '-case-' + cases.length;
        filenames.add(c.id + '|' + (c.label || c.tab || 'fixed'));
        cases.push(c);
      }
      dest.targets = cases;
      // A native-drag fixture promises a real draggable scene. A missing handle
      // is a failed observation, never an empty 0/0 interaction pass.
      const requiredNative = new Set(cases.filter(c => String(c.label || '').startsWith('native-drag-')).map(c => String(c.id)));
      const sceneIds = new Set(scenes.map(scene => scene.id));
      for (const c of cases) {
        if (!sceneIds.has(String(c.id))) report.failures.push({ unit, run: run.name, reason: 'unknown-target-scene', id: String(c.id), label: c.label });
        targets.add(String(c.id));
      }
      for (const scene of scenes) {
        await page.evaluate(i => lab.goScene(i), scene.index);
        await measure(scene, 'initial');
        if (targets.has(scene.id) || run.name === 'mobile-paper') {
          const filename = `${unit}--${scene.id}--${run.name}--initial.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
          await capture(filename);
        }
        const hasReview = await page.evaluate(() => lab._tabAvailable('review'));
        if (hasReview) {
          await page.evaluate(() => { lab.setTab('review'); lab.setStep(1); });
          await measure(scene, 'step-1');
          if (targets.has(scene.id)) await capture(`${unit}--${scene.id}--${run.name}--step-1.png`);
          const steps = await page.evaluate(() => { const x = lab.scene.steps; return (typeof x === 'function' ? x(lab.s, lab) : x)?.length || 0; });
          if (steps > 2) {
            await page.evaluate(n => lab.setStep(Math.ceil(n / 2)), steps);
            await measure(scene, 'review-middle');
            if (targets.has(scene.id)) await capture(`${unit}--${scene.id}--${run.name}--review-middle.png`);
          } else {
            (dest.notApplicable ||= []).push({ id: scene.id, run: run.name, state: 'review-middle', reason: 'no-intermediate-step' });
          }
        } else {
          for (const state of ['step-1', 'review-middle', 'review-final']) (dest.notApplicable ||= []).push({ id: scene.id, run: run.name, state, reason: 'no-review-tab' });
        }
        if (await page.evaluate(() => lab._tabAvailable('problem'))) {
          await page.evaluate(() => { lab.setStep(0); lab.setTab('problem'); });
          await page.waitForFunction(() => !lab._tween);
          await measure(scene, 'problem-hidden');
        } else {
          (dest.notApplicable ||= []).push({ id: scene.id, run: run.name, state: 'problem-hidden', reason: 'no-problem-tab' });
        }
        if (hasReview) {
          await page.evaluate(() => { lab.setTab('review'); const x = lab.scene.steps; lab.setStep((typeof x === 'function' ? x(lab.s, lab) : x)?.length || 0); });
          await measure(scene, 'review-final');
          if (targets.has(scene.id) || run.name === 'mobile-paper') {
            const filename = `${unit}--${scene.id}--${run.name}--review-final.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
            await capture(filename);
          }
        }
        // All scenes receive native controls on mobile; selected scenes retain all eight runs.
        if (targets.has(scene.id) || run.name === 'mobile-paper') {
          await page.evaluate(i => lab.goScene(i), scene.index);
          await settle();
          const ctl = await page.evaluate(() => Object.entries(lab._ctls || {}).find(([, c]) => c.input.checkVisibility())?.[0] || null);
          if (ctl) {
            const info = await page.evaluate(nextNativeRangeInput, ctl);
            const value = info.value;
            await page.getByRole('slider', { name: info.label, exact: true }).fill(info.text); await settle();
            const actual = await page.evaluate(k => lab.s[k], ctl);
            const pass = Math.abs(actual - value) < 1e-7;
            dest.interactions.push({ id: scene.id, run: run.name, control: ctl, expected: value, actual, pass, domBefore: info.dom, storedBefore: info.storedBefore });
            if (!pass) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'slider-state-mismatch', expected: value, actual });
            await measure(scene, 'numeric-change');
          } else {
            (dest.notApplicable ||= []).push({ id: scene.id, run: run.name, state: 'numeric-change', reason: 'no-visible-numeric-control' });
          }
          const presets = page.locator('.apl-presets .apl-chip:visible');
          if (await presets.count()) {
            await presets.last().click(); await page.waitForFunction(() => !lab._tween); await settle();
            dest.interactions.push({ id: scene.id, run: run.name, control: 'preset-last', executed: true });
            await measure(scene, 'after-preset');
          }
          // Presets may start playback and hide a handle. Probe initial exploration
          // independently so animation cannot masquerade as a successful drag.
          await page.evaluate(i => lab.goScene(i), scene.index);
          await settle();
          let dragPlaying = await page.evaluate(() => !!lab.s.playing);
          if (dragPlaying) {
            const pause = await page.evaluate(() => (lab._actionBtns || []).findIndex(({ a, b }) => (a.play || a.id === 'play') && b.checkVisibility()));
            if (pause >= 0) { await page.locator('.apl-actions-row button').nth(pause).click(); await settle(); }
            dragPlaying = await page.evaluate(() => !!lab.s.playing);
            const pass = pause >= 0 && !dragPlaying;
            dest.interactions.push({ id: scene.id, run: run.name, control: 'pause-before-drag', executed: pause >= 0, wasPlaying: true, stopped: !dragPlaying, pass });
            if (!pass) {
              report.failures.push({ unit, id: scene.id, run: run.name, reason: 'drag-probe-could-not-pause', pauseFound: pause >= 0, playing: dragPlaying });
              throw Error(`Native pause before drag failed: ${unit}/${scene.id}/${run.name}`);
            }
          }
          const handle = await page.evaluate(() => lab.board.handles.find(h => typeof h.drag === 'function' && h.x > 12 && h.x < lab.board.W - 12 && h.y > 12 && h.y < lab.board.H - 12));
          if (handle) {
            // Render after a control change, scroll, and then read the current
            // handle location. A previous frame's position can start a pan.
            // Exercise native pointer events and verify that the intended handle
            // was actually acquired; never invoke its callback directly.
            const actualCanvas = page.locator('canvas').filter({ visible: true }).first();
            await actualCanvas.scrollIntoViewIfNeeded(); await settle();
            const dx = handle.x < run.width / 2 ? 48 : -48, dy = handle.y < run.height / 2 ? 24 : -24;
            const attempts = []; let passed = false;
            // Integer-snapped handles can require more than 64px to cross a
            // half-step on a large board (sm4-conv quarters of AB). Keep the
            // same native acquisition/state-change gate and try a longer drag.
            for (const [mx, my] of [[dx,dy],[-dx,-dy],[0,-64],[-64,0],[64,0],[0,64],[128,0],[-128,0],[0,128],[0,-128]]) {
              const fresh = await page.evaluate(id => { const h = lab.board.handles.find(h => h.id === id && typeof h.drag === 'function'); return h ? {x:h.x,y:h.y,W:lab.board.W,H:lab.board.H} : null; }, handle.id);
              if (!fresh) break;
              const rect = await actualCanvas.boundingBox();
              const start = { x: rect.x + fresh.x * rect.width / fresh.W, y: rect.y + fresh.y * rect.height / fresh.H };
              const before = await page.evaluate(() => Object.fromEntries(Object.entries(lab.s).filter(([k]) => !['dragging','playing','step'].includes(k))));
              await page.mouse.move(start.x, start.y); await page.mouse.down();
              const acquired = await page.evaluate(id => lab.board.dragging?.id === id, handle.id);
              await page.mouse.move(start.x + mx, start.y + my, {steps:8}); await page.mouse.up(); await settle();
              const after = await page.evaluate(() => Object.fromEntries(Object.entries(lab.s).filter(([k]) => !['dragging','playing','step'].includes(k))));
              const changedKeys = [...new Set([...Object.keys(before),...Object.keys(after)])].filter(k => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
              attempts.push({acquired,delta:[mx,my],changedKeys});
              if (!dragPlaying && acquired && changedKeys.length) { passed = true; break; }
            }
            dest.interactions.push({ id: scene.id, run: run.name, control:'pointer-drag', handle:handle.id, executed:true, stateChanged:passed, pass:passed, attempts, pointer:'mouse' });
            if (!passed) report.failures.push({unit,id:scene.id,run:run.name,reason:'pointer-drag-did-not-update-state',handle:handle.id,attempts});
            await measure(scene, 'after-native-drag');
          } else if (requiredNative.has(scene.id)) {
            dest.interactions.push({ id:scene.id, run:run.name, control:'pointer-drag', executed:false, stateChanged:false, pass:false, attempts:[], pointer:'mouse', reason:'required-handle-missing' });
            report.failures.push({ unit, id:scene.id, run:run.name, reason:'required-native-drag-handle-missing' });
          } else {
            (dest.notApplicable ||= []).push({ id: scene.id, run: run.name, state: 'pointer-drag', reason: 'no-visible-draggable-handle' });
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
            await measure(scene, 'after-play-pause');
          } else {
            (dest.notApplicable ||= []).push({ id: scene.id, run: run.name, state: 'play-pause', reason: 'no-play-action' });
          }
          const reset = await page.evaluate(() => (lab._actionBtns || []).findIndex(({ a, b }) => a.id === 'reset' && b.checkVisibility()));
          if (reset >= 0) {
            await page.locator('.apl-actions-row button').nth(reset).click(); await settle();
            const stopped = await page.evaluate(() => !lab.s.playing);
            dest.interactions.push({ id: scene.id, run: run.name, control: 'reset', executed: true, stopped });
            if (!stopped) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'reset-left-playing' });
            await measure(scene, 'after-reset');
          } else {
            (dest.notApplicable ||= []).push({ id: scene.id, run: run.name, state: 'reset', reason: 'no-reset-action' });
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
              const parameter = await page.evaluate(() => Object.entries(lab._ctls || {}).find(([k, c]) => c.input.checkVisibility() && !/yaw|pitch|orbit|view/i.test(k))?.[0] || null);
              if (parameter) {
                const ctlInfo = await page.evaluate(nextNativeRangeInput, parameter);
                await page.getByRole('slider', { name: ctlInfo.label, exact: true }).fill(ctlInfo.text); await settle();
                const parameterActual = await page.evaluate(k => lab.s[k], parameter);
                const parameterPass = Math.abs(parameterActual - ctlInfo.value) < 1e-7;
                if (!parameterPass) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'slider-state-mismatch', parameter, expected: ctlInfo.value, actual: parameterActual });
                await page.evaluate(() => lab.setTab('problem')); await page.waitForFunction(() => !lab._tween); await settle();
                // Compare question content in the same tab: exploration can hide
                // reveal buttons or answer styles without changing the question.
                const changed = questionBefore !== await signature();
                const locked = await page.evaluate(() => !lab.refs.answer?.classList.contains('open'));
                dest.interactions.push({ id: scene.id, run: run.name, control: 'manual-reveal-then-parameter', opened, parameter: ctlInfo.key, parameterInput: { expected: ctlInfo.value, actual: parameterActual, pass: parameterPass, domBefore: ctlInfo.dom, storedBefore: ctlInfo.storedBefore }, problemChanged: changed, locked });
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
        // Exercise the actual generated-question button for every scene. Record
        // all variants; rendering checks never substitute for independent math.
        if (await page.evaluate(() => lab._tabAvailable('problem'))) {
          await page.evaluate(i => { lab.goScene(i); lab.setTab('problem'); }, scene.index);
          await page.waitForFunction(() => !lab._tween); await settle();
          for (let variant = 1; variant <= 3; variant++) {
            const next = page.locator('#apl-pane-problem button.apl-newprob:visible');
            try { await next.first().waitFor({state:'visible',timeout:3000}); }
            catch { report.failures.push({ unit, id: scene.id, run: run.name, reason:'missing-new-problem-control' }); break; }
            await next.first().click(); await page.waitForFunction(() => !lab._tween);
            await measure(scene, `new-problem-${variant}`);
            await page.evaluate(() => { lab.setTab('review'); const f = lab.scene.steps; lab.setStep((typeof f === 'function' ? f(lab.s, lab) : f)?.length || 0); });
            await measure(scene, `new-solution-${variant}`);
            await page.evaluate(() => lab.setTab('problem'));
          }
        }
        for (const c of cases.filter(x => String(x.id) === scene.id && (x.params || x.questionKey || x.tab || x.step != null))) {
          await page.evaluate(({ index, tab }) => { lab.goScene(index); if (tab) lab.setTab(tab); }, { index: scene.index, tab: c.tab });
          await page.waitForFunction(() => !lab._tween);
          await page.evaluate(c => { if (c.params) lab.set(c.params); }, c); await settle();
          if (c.questionKey) {
            const found = await page.evaluate(({questionKey,maxAttempts=20000}) => {
              const gen=lab.scene.tg?.gen;
              if(typeof gen!=='function')return {found:false,reason:'question-generator-unavailable'};
              let q=lab.s.q, attempts=0;
              while(q?.key!==questionKey&&attempts<maxAttempts){q=gen(q);attempts++;}
              if(q?.key!==questionKey)return {found:false,attempts,reason:'question-key-not-generated'};
              lab.s.q=q; lab.s.step=1;lab.s.revealed=false;lab._buildReview();lab.invalidate(true);
              return {found:true,attempts,key:q.key};
            },c);
            dest.interactions.push({id:scene.id,run:run.name,control:'fixed-production-question',label:c.label,...found});
            if(!found.found)report.failures.push({unit,id:scene.id,run:run.name,reason:found.reason,key:c.questionKey});
            await settle();
          }
          if (c.inputKey) {
            const p = await page.evaluate(k => ({ label: APLab.stripEmoji(lab.params[k].label), value: lab.s[k] }), c.inputKey);
            await page.getByRole('slider', { name: p.label, exact: true }).fill(String(p.value)); await settle();
          }
          if (c.fromTab) {
            await page.evaluate(tab => lab.setTab(tab), c.fromTab); await page.waitForFunction(() => !lab._tween); await settle();
            await page.evaluate(tab => lab.setTab(tab || 'review'), c.tab); await settle();
          }
          // Changing numerical conditions may correctly relock a previous solution.
          // Select the requested review step after that state transition completes.
          if (c.step != null) { await page.evaluate(n => { const x = lab.scene.steps; lab.setStep(n === 'final' ? (typeof x === 'function' ? x(lab.s, lab) : x)?.length || 0 : n); }, c.step); await settle(); }
          if (c.waitFor) {
            const condition = { values: c.waitFor.values, tolerance: c.waitFor.tolerance ?? 0.001 };
            let settled = true;
            try {
              await page.waitForFunction(({ values, tolerance }) => Object.entries(values).every(([key, value]) => Number.isFinite(lab.s[key]) && Math.abs(lab.s[key] - value) <= tolerance), condition, { timeout: c.waitFor.timeoutMs ?? 5000 });
            } catch { settled = false; }
            const actual = await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, lab.s[key]])), Object.keys(condition.values));
            dest.interactions.push({ id: scene.id, run: run.name, control: 'wait-for-production-animation', label: c.label, settled, expected: condition.values, actual });
            if (!settled) report.failures.push({ unit, id: scene.id, run: run.name, reason: 'target-animation-did-not-settle', label: c.label, expected: condition.values, actual });
            await settle();
          }
          const label = 'target-' + (c.label || c.tab || 'fixed');
          const targetObservation = await measure(scene, label);
          targetObservation.target = { requested: c, actual: await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, lab.s[k]])), [...new Set([...Object.keys(c.params || {}), ...Object.keys(c.waitFor?.values || {})])]) };
          const filename = `${unit}--${scene.id}--${run.name}--${label}.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
          await capture(filename);
        }
      }
      if (errors.length) report.failures.push({ unit, run: run.name, reason: 'runtime-error', errors });
      } catch (error) {
        report.failures.push({ unit, run: run.name, reason: 'run-aborted', error: error.message });
        throw error;
      } finally {
        try { await screenshotGuard?.close(); }
        catch (error) { report.failures.push({ unit, run: run.name, reason: 'screenshot-guard-cleanup', error: error.message }); }
        try { await ctx.close(); }
        catch (error) { report.failures.push({ unit, run: run.name, reason: 'browser-context-cleanup', error: error.message }); }
        finally {
          fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2));
          console.log(`${unit} ${run.name}: ${dest.scenes.length} scenes observed; failures so far ${report.failures.length}`);
        }
      }
    }
  }
} finally {
  await browser.close(); await new Promise(resolve => server.close(resolve));
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ mode: report.kind, commit: report.commit, scenes: Object.values(report.units).reduce((n, u) => n + u.scenes.length, 0), failures: report.failures.length }));
process.exitCode = observe ? 0 : report.failures.length ? 1 : 0;
