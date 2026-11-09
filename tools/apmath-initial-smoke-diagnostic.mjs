// Read-only supplemental diagnosis. This does not replace or relax scene-smoke.
// --root <exact checkout> --base-url <served labs URL> --out <evidence dir>
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const option = key => { const i = args.indexOf(key); if (i < 0 || !args[i + 1]) throw Error(`Required ${key}`); return args[i + 1]; };
const root = path.resolve(option('--root'));
const base = option('--base-url').replace(/\/?$/, '/');
const out = path.resolve(option('--out'));
fs.mkdirSync(out, { recursive: true });
const sha = data => createHash('sha256').update(data).digest('hex');
const writeJSON = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n');
const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8' }).trim();
const { chromium } = createRequire(import.meta.url)('playwright');
const { createScreenshotGuard } = await import(pathToFileURL(path.join(root, 'apmath/playground/next/tools/browser-screenshot-guard.mjs')));
const LABS = {
  'alg-sequence': ['type8-0', 'type8-1', 'br-tree'],
  'g7-surface-volume': ['sv2-6', 'sv3-6', 'sv6-1'],
  'g8-pythagoras': ['py1-rot'],
  'g9-trig-ratio': ['simRightTri']
};
const RUNS = [
  { id: 'pc-board', name: 'PC·칠판', theme: 'board', viewport: { width: 1280, height: 820 } },
  { id: 'pc-paper', name: 'PC·종이', theme: 'paper', viewport: { width: 1280, height: 820 } },
  { id: 'mobile-board', name: '휴대폰', theme: 'board', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { id: 'tablet-portrait-board', name: '태블릿·세로', theme: 'board', viewport: { width: 768, height: 1024 }, hasTouch: true, deviceScaleFactor: 2 },
  { id: 'tablet-landscape-board', name: '태블릿·가로', theme: 'board', viewport: { width: 1024, height: 768 }, hasTouch: true, deviceScaleFactor: 2 }
];
const report = {
  kind: 'LEGACY_SCENE_SMOKE_DIAGNOSTIC', qualityVerdict: 'NOT_ASSERTED',
  createdAt: new Date().toISOString(), source: { head: git('rev-parse', 'HEAD'), tree: git('rev-parse', 'HEAD^{tree}'), root },
  originalRules: { inkAlphaThreshold: 30, blankIfSampledInkBelow: 200, clipToleranceCssPx: 2 },
  primaryProtocol: 'Original lab.goScene(i); lab.render(); await one RAF; boxes=[]; lab.render(). All scenes in one evaluate; target Canvas PNGs captured synchronously in that pass.',
  pageProtocol: 'Supplemental fresh-context replay of the original scene order through each target; freeze future RAF callbacks only after the target measurement, then fixed-viewport screenshot. Replay comparison is explicit.',
  runs: RUNS, labs: LABS, cases: [], captures: [], sourceResponses: [], externalResponseCount: 0, infrastructureErrors: [],
  counts: { primaryLabEnvironments: 0, targetMeasurements: 0, replayMeasurements: 0, primarySmokeFailureRows: 0 }
};
const sourceMap = new Map();
const pendingResponses = new Set();
const recordError = (where, error) => report.infrastructureErrors.push({ where, error: String(error?.stack || error).slice(0, 1800) });
const responseListener = response => {
  const work = (async () => {
    const u = new URL(response.url());
    if (u.origin !== new URL(base).origin || !/\.(?:html|js|css)$/.test(u.pathname)) { report.externalResponseCount++; return; }
    const rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
    const file = path.resolve(root, rel);
    if (!file.startsWith(root + path.sep)) throw Error('Served response escaped source root');
    const body = await response.body(), actualSha256 = sha(body);
    const expectedSha256 = fs.existsSync(file) ? sha(fs.readFileSync(file)) : null;
    const item = { path: rel, status: response.status(), actualSha256, expectedSha256, match: response.status() === 200 && actualSha256 === expectedSha256 };
    const key = JSON.stringify(item), previous = sourceMap.get(key);
    sourceMap.set(key, { ...item, responses: (previous?.responses || 0) + 1 });
    if (!item.match) recordError('served-source', `${rel}: ${item.status}, actual ${actualSha256}, expected ${expectedSha256}`);
  })().catch(error => recordError('response-body', error));
  pendingResponses.add(work); work.finally(() => pendingResponses.delete(work));
};
const drainResponses = async () => { while (pendingResponses.size) await Promise.allSettled([...pendingResponses]); };

// This function is serialized into the page. It intentionally preserves the old
// smoke sampler and raw label detector, and records additional facts separately.
async function observeOriginalSequence({ targets, stopAt = null, freeze = false }) {
  const lab = window.lab, b = lab.board, c = b.ctx;
  const drawText = b._text;
  const fillText = c.fillText, strokeText = c.strokeText;
  let labels = [], active = null;
  const rectOf = (x, y, width, size, o) => {
    const align = o.align || 'center', baseline = o.baseline || 'alphabetic';
    const x0 = x + (align === 'center' ? -width / 2 : align === 'right' || align === 'end' ? -width : 0);
    const y0 = y + (baseline === 'middle' ? -size / 2 : baseline === 'top' || baseline === 'hanging' ? 0 : baseline === 'bottom' ? -size : -size * .8);
    return { x0, x1: x0 + width, y0, y1: y0 + size };
  };
  const glyph = (method, original, self, values) => {
    if (active && values[0] != null) {
      const metrics = self.measureText(String(values[0])), x = Number(values[1]), y = Number(values[2]);
      const exact = ['actualBoundingBoxLeft', 'actualBoundingBoxRight', 'actualBoundingBoxAscent', 'actualBoundingBoxDescent'].every(k => Number.isFinite(metrics[k]));
      if (exact) {
        const halo = method === 'strokeText' ? self.lineWidth / 2 : 0;
        active.glyphs.push({ method, text: String(values[0]), font: self.font, align: self.textAlign, baseline: self.textBaseline,
          x0: x - metrics.actualBoundingBoxLeft - halo, x1: x + metrics.actualBoundingBoxRight + halo,
          y0: y - metrics.actualBoundingBoxAscent - halo, y1: y + metrics.actualBoundingBoxDescent + halo });
      } else active.glyphMetricUnavailable = true;
    }
    return original.apply(self, values);
  };
  c.fillText = function (...values) { return glyph('fillText', fillText, this, values); };
  c.strokeText = function (...values) { return glyph('strokeText', strokeText, this, values); };
  b._text = function (x, y, str, o = {}, screen) {
    let item = null;
    if (str != null && str !== '' && !screen && !this._bbox) {
      const size = (o.size || 13) * this.fs * this._ts();
      c.save(); c.font = `${o.weight || 750} ${size}px ${this.font}`;
      const rawWidth = c.measureText(String(str)).width; c.restore();
      const annotation = this.annotationSize(String(str), { ...o, size: o.size || 13 });
      item = { text: String(str), x, y, size, rawWidth, annotationSize: annotation, originalRawBox: rectOf(x, y, rawWidth, size, o),
        options: { size: o.size || 13, weight: o.weight || 750, align: o.align || 'center', baseline: o.baseline || 'alphabetic' }, glyphs: [] };
      labels.push(item);
    }
    const previous = active; active = item;
    try { return drawText.call(this, x, y, str, o, screen); } finally { active = previous; }
  };
  const over = q => Math.max(-q.x0, q.x1 - b.W, -q.y0, q.y1 - b.H);
  const out = [];
  try {
    for (let i = 0; i < lab.list.length; i++) {
      lab.goScene(i);
      lab.render();
      await new Promise(resolve => requestAnimationFrame(resolve));
      labels = [];
      lab.render();
      const canvas = b.canvas, pixels = c.getImageData(0, 0, canvas.width, canvas.height).data;
      let ink = 0;
      const step = Math.min(31, Math.max(1, Math.round(canvas.width * canvas.height / 20360)));
      for (let k = 3; k < pixels.length; k += 4 * step) if (pixels[k] > 30) ink++;
      const clipped = labels.filter(q => over(q.originalRawBox) > 2).map(q => q.text.slice(0, 20));
      const L = f => (typeof f === 'function' ? f(lab.s) : f) || [];
      const want = L(lab.scene.controls).filter(k => lab.params[k]).length + L(lab.scene.presets).length + L(lab.scene.actions).length;
      const have = [...document.querySelectorAll('.apl-ctl, .apl-presets .apl-chip, .apl-actions-row button')].filter(e => e.checkVisibility()).length;
      const row = { index: i, id: lab.scene.id, ink, samplingStep: step, clipped, ctl: have === want ? '' : `${have}/${want}`,
        guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim() };
      if (targets.includes(row.id)) {
        let nonzero = 0, alphaGt30 = 0, alphaSum = 0, xmin = canvas.width, xmax = -1, ymin = canvas.height, ymax = -1;
        for (let k = 3, pi = 0; k < pixels.length; k += 4, pi++) {
          const a = pixels[k]; if (a) nonzero++; alphaSum += a;
          if (a > 30) { alphaGt30++; const x = pi % canvas.width, y = Math.floor(pi / canvas.width); xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
        }
        for (const label of labels) {
          if (label.glyphs.length) label.actualGlyphBox = { x0: Math.min(...label.glyphs.map(q => q.x0)), x1: Math.max(...label.glyphs.map(q => q.x1)), y0: Math.min(...label.glyphs.map(q => q.y0)), y1: Math.max(...label.glyphs.map(q => q.y1)) };
          label.originalRawOverflow = over(label.originalRawBox);
          label.actualGlyphOverflow = label.actualGlyphBox ? over(label.actualGlyphBox) : null;
        }
        const rect = canvas.getBoundingClientRect();
        const parameters = Object.fromEntries(Object.keys(lab.params || {}).sort().map(k => [k, lab.s[k]]).filter(([, v]) => v == null || ['number','string','boolean'].includes(typeof v)));
        Object.assign(row, { title: lab.scene.title, params: parameters, tab: lab.tab, step: lab.s.step, playing: !!lab.s.playing,
          canvas: { width: canvas.width, height: canvas.height, cssWidth: b.W, cssHeight: b.H, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, dpr: devicePixelRatio,
            focus: JSON.parse(JSON.stringify(b.focus)), insets: { ...b.insets }, scale: b.k, fontScale: b.fs },
          fullAlpha: { nonzero, greaterThan30: alphaGt30, sum: alphaSum, pixelCount: canvas.width * canvas.height, boundsGreaterThan30: xmax < 0 ? null : { x0: xmin, y0: ymin, x1: xmax + 1, y1: ymax + 1 } },
          labels, canvasDataURL: canvas.toDataURL('image/png'), observedAtPerformanceMs: performance.now() });
      }
      out.push(row);
      if (row.id === stopAt) { if (freeze) window.__smokeDiagnosticFreeze?.(); break; }
    }
  } finally { b._text = drawText; c.fillText = fillText; c.strokeText = strokeText; }
  return out;
}

function takeCanvas(row, filename) {
  const bytes = Buffer.from(row.canvasDataURL.split(',')[1], 'base64'); delete row.canvasDataURL;
  fs.writeFileSync(path.join(out, filename), bytes);
  row.canvasCapture = { file: filename, sha256: sha(bytes), bytes: bytes.length };
  report.captures.push({ ...row.canvasCapture, kind: 'canvas', sceneId: row.id });
}
function replayComparison(first, replay) {
  const fields = ['id','ink','samplingStep','clipped','ctl','guide','params','tab','step','playing','canvas','fullAlpha'];
  const differences = fields.filter(key => JSON.stringify(first[key]) !== JSON.stringify(replay[key]));
  return { fields, differences, sameMeasuredState: differences.length === 0, sameCanvasBytes: first.canvasCapture.sha256 === replay.canvasCapture.sha256 };
}
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
async function open(labId, run, freeze = false) {
  const { id, name, theme, ...device } = run;
  const context = await browser.newContext(device), page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push({ type: 'pageerror', message: String(error.message).slice(0, 500) }));
  page.on('console', message => { if (message.type() === 'error') errors.push({ type: 'console', message: message.text().slice(0, 500) }); });
  page.on('response', responseListener);
  if (freeze) await page.addInitScript(() => {
    const originalRAF = window.requestAnimationFrame.bind(window); let frozen = false;
    window.requestAnimationFrame = callback => originalRAF(time => { if (!frozen) callback(time); });
    window.__smokeDiagnosticFreeze = () => { frozen = true; };
  });
  await page.goto(`${base}${labId}.html?theme=${theme}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.lab && window.lab.board);
  await drainResponses();
  return { context, page, errors };
}
try {
  for (const [labId, targets] of Object.entries(LABS)) for (const run of RUNS) {
    const entry = { labId, runId: run.id, originalRows: [], originalErrors: [], targets: [], missingTargets: [], replays: [] };
    report.cases.push(entry);
    let primary;
    try {
      primary = await open(labId, run);
      entry.originalRows = await primary.page.evaluate(observeOriginalSequence, { targets });
      entry.originalErrors = primary.errors;
      for (const row of entry.originalRows.filter(r => targets.includes(r.id))) {
        takeCanvas(row, `${labId}--${row.id}--${run.id}--primary-canvas.png`);
        entry.targets.push(row.id); report.counts.targetMeasurements++;
      }
      entry.missingTargets = targets.filter(id => !entry.targets.includes(id));
      if (entry.missingTargets.length) recordError('missing-target', `${labId}/${run.id}: ${entry.missingTargets.join(',')}`);
      report.counts.primarySmokeFailureRows += entry.originalRows.filter(r => r.ink < 200 || r.clipped.length || r.ctl || !r.guide).length;
      report.counts.primaryLabEnvironments++;
    } catch (error) { recordError(`${labId}/${run.id}/primary`, error); }
    finally { await drainResponses(); await primary?.context.close(); }
    for (const id of entry.targets) {
      let session, guard;
      const observations = [];
      try {
        session = await open(labId, run, true);
        guard = await createScreenshotGuard(session.page, { expectedTouch: !!run.hasTouch, onObservation: o => observations.push(o) });
        const rows = await session.page.evaluate(observeOriginalSequence, { targets: [id], stopAt: id, freeze: true });
        const row = rows.at(-1);
        if (row?.id !== id || !row.canvasDataURL) throw Error(`Replay did not reach ${id}`);
        takeCanvas(row, `${labId}--${id}--${run.id}--replay-canvas.png`);
        const filename = `${labId}--${id}--${run.id}--replay-page.png`;
        const { value: bytes } = await guard.capture(() => session.page.screenshot({ fullPage: false, animations: 'allow', caret: 'hide' }), { fullPage: false, sceneId: id, labId, runId: run.id });
        fs.writeFileSync(path.join(out, filename), bytes);
        const capture = { file: filename, sha256: sha(bytes), bytes: bytes.length, kind: 'fixed-viewport-page', sceneId: id };
        report.captures.push(capture);
        const stateAfterCapture = await session.page.evaluate(() => ({ id: lab.scene.id, tab: lab.tab, step: lab.s.step, playing: !!lab.s.playing, canvasDataURL: lab.board.canvas.toDataURL('image/png') }));
        const afterCanvasSha = sha(Buffer.from(stateAfterCapture.canvasDataURL.split(',')[1], 'base64')); delete stateAfterCapture.canvasDataURL;
        entry.replays.push({ id, row, comparison: replayComparison(entry.originalRows.find(r => r.id === id), row),
          pageCapture: capture, screenshotEnvironment: observations, stateAfterCapture, canvasFrozenDuringCapture: afterCanvasSha === row.canvasCapture.sha256, errors: session.errors });
        if (afterCanvasSha !== row.canvasCapture.sha256) recordError('capture-state-drift', `${labId}/${id}/${run.id}`);
        report.counts.replayMeasurements++;
      } catch (error) { recordError(`${labId}/${id}/${run.id}/replay`, error); }
      finally { await drainResponses(); await guard?.close(); await session?.context.close(); }
    }
    report.sourceResponses = [...sourceMap.values()].sort((a, b) => a.path.localeCompare(b.path));
    writeJSON('report.json', report);
    console.log(JSON.stringify({ labId, runId: run.id, originalRows: entry.originalRows.length, targets: entry.targets.length, replays: entry.replays.length, originalSmokeFailures: entry.originalRows.filter(r => r.ink < 200 || r.clipped.length || r.ctl || !r.guide).map(r => ({ id: r.id, ink: r.ink, clipped: r.clipped })) }));
  }
} catch (error) { recordError('top-level', error); }
finally { await drainResponses(); await browser.close(); }
report.sourceResponses = [...sourceMap.values()].sort((a, b) => a.path.localeCompare(b.path));
report.completedAt = new Date().toISOString();
report.complete = report.counts.primaryLabEnvironments === 20 && report.counts.targetMeasurements === 40 && report.counts.replayMeasurements === 40 && !report.infrastructureErrors.length;
report.verdict = report.complete ? 'DIAGNOSTIC_CAPTURE_COMPLETE; NO_QUALITY_VERDICT' : 'DIAGNOSTIC_INCOMPLETE';
writeJSON('report.json', report);
console.log(JSON.stringify({ verdict: report.verdict, source: report.source, counts: report.counts, infrastructureErrors: report.infrastructureErrors.length }));
process.exitCode = report.complete ? 0 : 2;
