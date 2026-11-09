// Source-bound Chromium controls for distinguishing deliberately clipped graph
// ticks from required scene annotations. Disposable browser mutations only.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createScreenshotGuard } from './browser-screenshot-guard.mjs';
import { captureSmokeCalibrationFrame, evaluateSmokeSemanticCalibration, deriveSparseFigureContract, isObservedAxisDecoration } from './scene-smoke-semantic-calibration.mjs';
import { adjudicateSmokeMeasurement } from './scene-smoke-measurement-gate.mjs';

const args = process.argv.slice(2), arg = key => { const i = args.indexOf(key); if (i < 0 || !args[i + 1]) throw Error(`Missing ${key}`); return args[i + 1]; };
const root = path.resolve(arg('--root')), expected = arg('--expected-sha'), out = path.resolve(arg('--out'));
const base = arg('--base-url').replace(/\/?$/, '/');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
if (!/^[a-f0-9]{40}$/.test(expected) || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim() !== expected)
  throw Error('Immutable product checkout mismatch');
fs.mkdirSync(out, { recursive: true });
const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const report = { kind: 'SOURCE_BOUND_AXIS_OBSERVATION_CONTROLS', productSource: expected,
  startedAt: new Date().toISOString(), studentVisualQuality: 'NOT_ASSERTED', rows: [], captures: [], sources: [], errors: [], failures: [],
  qaFiles: ['apmath-smoke-axis-experiment.mjs', 'scene-smoke-semantic-calibration.mjs', 'scene-smoke-measurement-gate.mjs', 'browser-screenshot-guard.mjs']
    .map(file => ({ file, sha256: sha(fs.readFileSync(path.join(toolsDir, file))) })),
  unchangedThresholds: { minimumInk: 200, alpha: 30, clippingCssPixels: 2 } };
const save = () => fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const pending = new Set(), sources = new Map();
function listen(response) {
  const work = (async () => {
    const url = new URL(response.url());
    if (url.origin !== new URL(base).origin || !/\.(html|js|css)$/.test(url.pathname)) return;
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, ''), absolute = path.resolve(root, relative);
    if (!absolute.startsWith(root + path.sep)) throw Error('Source path escaped checkout');
    const bytes = await response.body(), wanted = execFileSync('git', ['show', `${expected}:${relative}`], { cwd: root });
    const actualSha256 = sha(bytes), gitSha256 = sha(wanted);
    const match = response.status() === 200 && actualSha256 === gitSha256 && sha(fs.readFileSync(absolute)) === gitSha256;
    sources.set(`${relative}:${actualSha256}`, { path: relative, actualSha256, gitSha256, match });
    if (!match) throw Error(`Served source mismatch: ${relative}`);
  })().catch(error => report.errors.push({ stage: 'served-source', message: String(error) }));
  pending.add(work); work.finally(() => pending.delete(work));
}
const observe = new Function(`return function observe() {
  ${isObservedAxisDecoration.toString()}
  ${deriveSparseFigureContract.toString()}
  ${captureSmokeCalibrationFrame.toString()}
  ${evaluateSmokeSemanticCalibration.toString()}
  ${adjudicateSmokeMeasurement.toString()}
  const frame = captureSmokeCalibrationFrame(), semantic = evaluateSmokeSemanticCalibration(frame);
  const measurement = adjudicateSmokeMeasurement(frame, semantic);
  const {rgba, ...observation} = frame;
  return {semantic, measurement, observation, png:lab.board.canvas.toDataURL('image/png')};
}`)();
const change = ({ kind }) => {
  const b = lab.board, c = b.ctx, old = { render: lab.render, axes: b.axes, clip: c.clip, fillText: c.fillText };
  if (kind === 'replacement-axes') b.axes = function (...args) { return old.axes.apply(this, args); };
  if (kind === 'no-op-clip') c.clip = function () {};
  if (kind === 'scene-label-inside-axes') {
    let injected = false;
    c.fillText = function (...args) {
      if (!injected) { injected = true; b._text(-100, 50, 'required A', { halo: false, align: 'left' }); }
      return old.fillText.apply(this, args);
    };
  }
  if (kind === 'direct-text-after-axes') lab.render = function (...args) {
    const result = old.render.apply(this, args); c.save(); c.textAlign = 'left'; c.fillText('5', -100, 50); c.restore(); return result;
  };
  window.__restoreAxisControl = () => { lab.render = old.render; b.axes = old.axes; c.clip = old.clip; c.fillText = old.fillText; old.render.call(lab); delete window.__restoreAxisControl; };
};
const scenes = [['common-functions', 'bas-1'], ['common-quadratic', 'diffFuncFlatten'], ['geom-hyperbola', 'm1s1']];
const runs = [
  { id: 'pc-board', theme: 'board', viewport: { width: 1280, height: 820 } },
  { id: 'pc-paper', theme: 'paper', viewport: { width: 1280, height: 820 } },
  { id: 'mobile-board', theme: 'board', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { id: 'tablet-portrait-board', theme: 'board', viewport: { width: 768, height: 1024 }, hasTouch: true, deviceScaleFactor: 2 },
  { id: 'tablet-landscape-board', theme: 'board', viewport: { width: 1024, height: 768 }, hasTouch: true, deviceScaleFactor: 2 }
];
const { chromium } = createRequire(import.meta.url)('playwright');
let browser;
try {
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  for (const [unit, id] of scenes) for (const run of runs) {
    const { id: runId, theme, ...device } = run, context = await browser.newContext(device);
    let guard;
    try {
      const page = await context.newPage(); page.on('response', listen);
      page.on('pageerror', error => report.errors.push({ unit, id, run: runId, message: String(error) }));
      await page.addInitScript(() => { const original = requestAnimationFrame; window.__holdAxisRAF = false;
        window.requestAnimationFrame = callback => original(time => { if (!window.__holdAxisRAF) callback(time); }); });
      await page.goto(`${base}${unit}.html?theme=${theme}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.lab?.list?.length);
      await page.evaluate(async target => { const index = lab.list.findIndex(scene => scene.id === target); if (index < 0) throw Error('Missing scene');
        for (let i = 0; i <= index; i++) { lab.goScene(i); lab.render(); await new Promise(resolve => requestAnimationFrame(resolve)); lab.render(); }
        window.__holdAxisRAF = true;
      }, id);
      guard = await createScreenshotGuard(page, { expectedTouch: !!run.hasTouch });
      let baselineSha, rawAxisClipped = 0;
      for (const kind of ['positive', 'replacement-axes', 'no-op-clip', 'scene-label-inside-axes', 'direct-text-after-axes']) {
        // A pane with no overhanging tick cannot demonstrate the clip-provenance
        // negative. Record that explicit applicability limit instead of PASS.
        if (['replacement-axes', 'no-op-clip'].includes(kind) && !rawAxisClipped) {
          report.rows.push({ unit, id, run: runId, kind, status: 'NOT_APPLICABLE', reason: 'positive-has-no-overhanging-axis-glyph' }); continue;
        }
        try {
          if (kind !== 'positive') await page.evaluate(change, { kind });
          const result = await page.evaluate(observe), png = Buffer.from(result.png.split(',')[1], 'base64'); delete result.png;
          const tag = `${unit}--${id}--${runId}--${kind}`, canvasFile = `${tag}-canvas.png`, pageFile = `${tag}-page.png`;
          fs.writeFileSync(path.join(out, canvasFile), png);
          const canvasCapture = { file: canvasFile, sha256: sha(png), bytes: png.length };
          const { value: screen } = await guard.capture(() => page.screenshot({ fullPage: false, animations: 'allow', caret: 'hide' }), { unit, id, run: runId, kind, fullPage: false });
          fs.writeFileSync(path.join(out, pageFile), screen);
          const pageCapture = { file: pageFile, sha256: sha(screen), bytes: screen.length };
          const frozen = await page.evaluate(() => lab.board.canvas.toDataURL('image/png'));
          if (sha(Buffer.from(frozen.split(',')[1], 'base64')) !== canvasCapture.sha256) throw Error('Canvas changed during fixed-viewport capture');
          const expectedStatus = kind === 'positive' ? 'PASS' : 'FAIL';
          report.rows.push({ unit, id, run: runId, kind, expectedStatus, ...result, canvasCapture, pageCapture });
          report.captures.push(canvasCapture, pageCapture);
          if (result.measurement.status !== expectedStatus) report.failures.push({ unit, id, run: runId, kind, expectedStatus, actual: result.measurement.status });
          if (kind === 'positive') { baselineSha = canvasCapture.sha256; rawAxisClipped = result.semantic.actualGlyphMeasurement.axisDecorationClipped.length; }
        } finally {
          if (kind !== 'positive') {
            const restored = await page.evaluate(() => { window.__restoreAxisControl?.(); return lab.board.canvas.toDataURL('image/png'); });
            if (sha(Buffer.from(restored.split(',')[1], 'base64')) !== baselineSha) throw Error('Product frame did not restore byte-exactly');
          }
        }
        save();
      }
    } catch (error) { report.errors.push({ unit, id, run: runId, message: String(error.stack || error) }); }
    finally { await guard?.close(); await context.close(); while (pending.size) await Promise.allSettled([...pending]); save(); }
  }
} catch (error) { report.errors.push({ stage: 'launch', message: String(error.stack || error) }); }
finally { await browser?.close(); report.sources = [...sources.values()]; report.finishedAt = new Date().toISOString();
  report.positiveCount = report.rows.filter(row => row.kind === 'positive' && row.measurement?.status === 'PASS').length;
  report.negativeCount = report.rows.filter(row => row.expectedStatus === 'FAIL' && row.measurement?.status === 'FAIL').length;
  report.status = report.positiveCount === 15 && report.negativeCount >= 30 && !report.errors.length && !report.failures.length ? 'PASS' : 'FAIL'; save(); }
console.log(JSON.stringify({ status: report.status, positive: report.positiveCount, negative: report.negativeCount, errors: report.errors.length, failures: report.failures.length }));
process.exitCode = report.status === 'PASS' ? 0 : 1;
