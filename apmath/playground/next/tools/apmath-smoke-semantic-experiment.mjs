// Isolated, source-bound Chromium experiment. Never replaces scene-smoke or a
// production gate. Legacy FAILs and experimental semantic outcomes are separate.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createScreenshotGuard } from './browser-screenshot-guard.mjs';
import { deriveSparseFigureContract, evaluateSmokeSemanticCalibration, captureSmokeCalibrationFrame } from './scene-smoke-semantic-calibration.mjs';
import { sampleInitialFigure } from './middle-initial-figure-contracts.mjs';
import { adjudicateSmokeMeasurement } from './scene-smoke-measurement-gate.mjs';

const argv = process.argv.slice(2), arg = name => { const i = argv.indexOf(name); if (i < 0 || !argv[i + 1]) throw Error(`Required ${name}`); return argv[i + 1]; };
const root = path.resolve(arg('--root')), base = arg('--base-url').replace(/\/?$/, '/'), out = path.resolve(arg('--out'));
const phase = arg('--phase'), expected = arg('--expected-sha');
if (!['baseline', 'candidate'].includes(phase) || !/^[a-f0-9]{40}$/.test(expected)) throw Error('Invalid source binding');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
if (git('rev-parse', 'HEAD') !== expected) throw Error('Checkout does not match the requested immutable source');
fs.mkdirSync(out, { recursive: true });
const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const experimentSource = ['apmath-smoke-semantic-experiment.mjs', 'scene-smoke-semantic-calibration.mjs', 'scene-smoke-measurement-gate.mjs', 'middle-initial-figure-contracts.mjs', 'browser-screenshot-guard.mjs']
  .map(file => ({ file, sha256: sha(fs.readFileSync(path.join(toolsDir, file))) }));
const legacyPath = 'apmath/playground/next/tools/scene-smoke.mjs';
const legacySha = sha(fs.readFileSync(path.join(root, legacyPath)));
if (legacySha !== '4e54d5ecb00e820e911a0d4a2d2bcc522cd5df75cc4a8d94f7d06f5cd6fb8046') throw Error('Original scene-smoke bytes changed');
const LABS = { 'alg-sequence': ['type8-0', 'type8-1', 'br-tree'], 'g7-surface-volume': ['sv2-6', 'sv3-6', 'sv6-1'],
  'g8-pythagoras': ['py1-rot'], 'g9-trig-ratio': ['simRightTri'] };
const CRITICAL = { 'g7-circle-sector': ['f1-star', 'f1-ss2', 'f1-lens', 'f1-ex22', 'f1-ring', 'f1-tri', 'f3-leaf-len'], 'g9-circle': ['c6-8'] };
const RUNS = [
  { id: 'pc-board', theme: 'board', viewport: { width: 1280, height: 820 } },
  { id: 'pc-paper', theme: 'paper', viewport: { width: 1280, height: 820 } },
  { id: 'mobile-board', theme: 'board', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { id: 'tablet-portrait-board', theme: 'board', viewport: { width: 768, height: 1024 }, hasTouch: true, deviceScaleFactor: 2 },
  { id: 'tablet-landscape-board', theme: 'board', viewport: { width: 1024, height: 768 }, hasTouch: true, deviceScaleFactor: 2 }
];
const MUTATIONS = ['blank', 'alpha-zero', 'faint', 'offscreen', 'tiny-css', 'labels-only', 'core-hidden-with-auxiliary-frame'];
const report = { kind: 'SEMANTIC_MEASUREMENT_EXPERIMENT_ONLY', qualityVerdict: 'NOT_ASSERTED', createdAt: new Date().toISOString(),
  phase, source: { head: expected, tree: git('rev-parse', 'HEAD^{tree}'), root }, experimentSource,
  originalSmoke: { file: legacyPath, sha256: legacySha, unchanged: true, alphaThreshold: 30, minimumInk: 200, clippingToleranceCssPx: 2, gateOverride: false },
  protocol: 'Primary: exact original goScene(i), render, one RAF, final render (collector observes that final render only). Replay: same fresh-context sequence through target, then freeze future RAF callbacks for a fixed-viewport screenshot. Mutations are confined to each disposable browser page.',
  runs: RUNS, positive: [], replays: [], negative: [], critical: [], captures: [], sources: [], failures: [], infrastructureErrors: [],
  limitations: ['Experimental control success is not whole-project quality PASS.', 'Unmodified legacy smoke is a separate workflow step and retains its original failure exit.', 'Independent screenshot review and the middle initial-figure full matrix remain required.'] };
report.historicalFixtureBinding = {
  run: 'https://github.com/icefoxtail/AP------/actions/runs/42637145342',
  sources: {
    baseline: { head: 'd69709250e06005f6e4d8fc4cea15667bc5d3ded', reportSha256: '21685719cc41e2efcac95e39a173ace6915ee672fdb7da6bb0e6d97cfc44d3c4' },
    candidate: { head: '9bf1bb63bdc32dfa25195fb784c69d5c6290ddb6', reportSha256: '2299588829383a8b3faf9ea6901934c90b3819372fb5f49ec293bd7144d9fa82' }
  },
  originalPrimaryCapturesPerSource: 40,
  comparisonStatus: 'REQUIRES_INDEPENDENT_COMPARISON_TO_RETRIEVED_IMMUTABLE_FIXTURES'
};
const write = () => fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const error = (where, e) => report.infrastructureErrors.push({ where, error: String(e?.stack || e).slice(0, 2000) });
const sourceMap = new Map(), pending = new Set();
const listen = response => {
  const work = (async () => {
    const u = new URL(response.url()); if (u.origin !== new URL(base).origin || !/\.(html|js|css)$/.test(u.pathname)) return;
    const rel = decodeURIComponent(u.pathname).replace(/^\/+/, ''), absolute = path.resolve(root, rel);
    if (!absolute.startsWith(root + path.sep)) throw Error('Served path escaped immutable checkout');
    const bytes = await response.body(), actual = sha(bytes), expectedBytes = execFileSync('git', ['show', `${expected}:${rel}`], { cwd: root });
    const wanted = sha(expectedBytes), match = response.status() === 200 && actual === wanted && sha(fs.readFileSync(absolute)) === wanted;
    const key = `${rel}:${actual}`; sourceMap.set(key, { path: rel, status: response.status(), actualSha256: actual, gitBlobSha256: wanted, match });
    if (!match) throw Error(`Served source mismatch: ${rel}`);
  })().catch(e => error('served-source', e));
  pending.add(work); work.finally(() => pending.delete(work));
};
const drain = async () => { while (pending.size) await Promise.allSettled([...pending]); report.sources = [...sourceMap.values()].sort((a, b) => a.path.localeCompare(b.path)); };

// The collector itself installs temporary Canvas hooks only after the actual
// app/Board exists. Its embedded dependencies are the four hashed local modules.
const observe = new Function(`return function observe() {
  ${deriveSparseFigureContract.toString()}
  ${evaluateSmokeSemanticCalibration.toString()}
  ${captureSmokeCalibrationFrame.toString()}
  ${sampleInitialFigure.toString()}
  ${adjudicateSmokeMeasurement.toString()}
  const frame = captureSmokeCalibrationFrame();
  const previousDraws=window.__initialFigureDraws;let initial;
  try { window.__initialFigureDraws=frame.draws;initial=sampleInitialFigure(); }
  finally { if(previousDraws===undefined)delete window.__initialFigureDraws;else window.__initialFigureDraws=previousDraws; }
  const result = evaluateSmokeSemanticCalibration(frame, initial);
  const measurementGate=adjudicateSmokeMeasurement(frame,result);
  const primitiveState = Object.fromEntries(Object.entries(frame.state).filter(([,v]) => v == null || ['number','string','boolean'].includes(typeof v)));
  const {rgba, state, ...observation} = frame;
  window.__apmExperimentLatest = {image: lab.board.ctx.getImageData(0,0,lab.board.canvas.width,lab.board.canvas.height),glyphs:frame.glyphs};
  return {result, measurementGate, observation:{...observation,state:primitiveState}, canvasDataURL:lab.board.canvas.toDataURL('image/png')};
}`)();
const sequence = new Function(`return async function sequence({targets,stopAt=null}) {
  const observe = ${observe.toString()}; const rows=[];
  for (let i=0;i<lab.list.length;i++) {
    lab.goScene(i); lab.render(); await new Promise(r=>requestAnimationFrame(r));
    if (targets.includes(String(lab.scene.id))) rows.push({id:String(lab.scene.id),index:i,...observe()}); else lab.render();
    if (String(lab.scene.id)===stopAt) {window.__apmExperimentHoldRAF=true;break;}
  }
  return rows;
}`)();
const negativeObserve = new Function(`return function negativeObserve({kind}) {
  const observe = ${observe.toString()};
  const b=lab.board,c=b.ctx,can=b.canvas,base=window.__apmExperimentBaseline;
  if(!base)throw Error('Positive baseline frame required before mutation');
  const originalRender=lab.render,originalFill=c.fill,style=can.style.cssText;
  const copy=()=>new Uint8ClampedArray(base.image.data);
  const apply=()=>{
    if(kind==='offscreen'||kind==='tiny-css'||kind==='leaf-fill-hidden')return;
    const W=can.width,H=can.height,data=copy();
    if(kind==='alpha-zero'||kind==='faint') {for(let k=3;k<data.length;k+=4)data[k]=kind==='alpha-zero'?0:Math.min(30,data[k]);}
    else {
      data.fill(0);
      if(kind==='labels-only'||kind==='core-hidden-with-auxiliary-frame'||kind==='leaf-contours-and-region-hidden'){
        const sx=W/b.W,sy=H/b.H;
        for(const g of base.glyphs)for(let y=Math.max(0,Math.floor(g.y0*sy));y<Math.min(H,Math.ceil(g.y1*sy));y++)
          for(let x=Math.max(0,Math.floor(g.x0*sx));x<Math.min(W,Math.ceil(g.x1*sx));x++){
            const k=(y*W+x)*4;data.set(base.image.data.subarray(k,k+4),k);
          }
      }
      if(kind==='core-hidden-with-auxiliary-frame'||kind==='leaf-contours-and-region-hidden'){
        for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<6||y<6||x>=W-6||y>=H-6)data.set([240,240,240,255],(y*W+x)*4);
      }
    }
    c.putImageData(new ImageData(data,W,H),0,0);
    if(kind==='leaf-contours-and-region-hidden'){
      const side=Number(lab.s.f1_lens_a)||8,p=b.toS(0,0),q=b.toS(side,side);
      c.save();c.setTransform(1,0,0,1,0,0);c.strokeStyle='#888';c.lineWidth=3;
      c.strokeRect(Math.min(p.x,q.x)*W/b.W,Math.min(p.y,q.y)*H/b.H,Math.abs(q.x-p.x)*W/b.W,Math.abs(q.y-p.y)*H/b.H);c.restore();
    }
  };
  if(kind==='offscreen')can.style.transform='translateX(20000px)';
  if(kind==='tiny-css'){can.style.transformOrigin='top left';can.style.transform='scale(0.03)';}
  if(kind==='leaf-fill-hidden')c.fill=function(){};
  lab.render=function(...args){originalRender.apply(this,args);apply();};
  window.__apmExperimentRestore=()=>{lab.render=originalRender;c.fill=originalFill;can.style.cssText=style;originalRender.call(lab);delete window.__apmExperimentRestore;};
  try{return observe();}catch(e){window.__apmExperimentRestore();throw e;}
}`)();

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
async function open(labId, run, hash = '') {
  const { id, theme, ...device } = run, context = await browser.newContext(device), page = await context.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', listen);
  await page.addInitScript(() => { const native = window.requestAnimationFrame.bind(window);
    window.__apmExperimentHoldRAF = false; window.requestAnimationFrame = cb => native(t => { if (!window.__apmExperimentHoldRAF) cb(t); }); });
  try {
    await page.goto(`${base}${labId}.html?theme=${theme}${hash ? '#s=' + encodeURIComponent(hash) : ''}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.lab?.board && window.lab.list?.length);
    const environment = [], guard = await createScreenshotGuard(page, { expectedTouch: !!run.hasTouch, onObservation: v => environment.push(v) });
    return { page, context, errors, guard, environment };
  } catch (e) { await context.close(); throw e; }
}
const saveCanvas = (row, name) => {
  const bytes = Buffer.from(row.canvasDataURL.split(',')[1], 'base64'); delete row.canvasDataURL;
  fs.writeFileSync(path.join(out, name), bytes); const ref = { file: name, sha256: sha(bytes), bytes: bytes.length, kind: 'actual-canvas' };
  row.canvasCapture = ref; report.captures.push(ref); return ref;
};
async function viewport(session, row, name, context) {
  const { value: bytes } = await session.guard.capture(() => session.page.screenshot({ fullPage: false, animations: 'allow', caret: 'hide' }), { fullPage: false, ...context });
  fs.writeFileSync(path.join(out, name), bytes); const ref = { file: name, sha256: sha(bytes), bytes: bytes.length, kind: 'fixed-viewport-page' };
  row.pageCapture = ref; report.captures.push(ref);
  const after = await session.page.evaluate(() => ({ id:lab.scene.id,tab:lab.tab,step:lab.s.step,playing:!!lab.s.playing,png:lab.board.canvas.toDataURL('image/png') }));
  row.canvasFrozenDuringCapture = sha(Buffer.from(after.png.split(',')[1], 'base64')) === row.canvasCapture.sha256; delete after.png;
  row.stateAfterCapture = after; if (!row.canvasFrozenDuringCapture) throw Error('Screenshot captured a different canvas state');
}
function assertPositive(row, where) {
  if (row.result.status !== 'PASS') report.failures.push({ where, reason: 'positive-semantic-not-pass', status: row.result.status, failures: row.result.failures, unknown: row.result.unknown });
  if(row.measurementGate.status!=='PASS')report.failures.push({where,reason:'positive-invocation-bound-gate-not-pass',gate:row.measurementGate});
}
async function runNegative(session, unit, id, run, kinds, baselineSha) {
  await session.page.evaluate(() => { window.__apmExperimentBaseline = window.__apmExperimentLatest; });
  for (const kind of kinds) {
    const tag = `${unit}--${id}--${run.id}--negative-${kind}`;
    try {
      const row = { unit, id, run: run.id, mutation: kind, ...await session.page.evaluate(negativeObserve, { kind }) };
      saveCanvas(row, `${tag}-canvas.png`); await viewport(session, row, `${tag}-page.png`, { unit, id, mutation: kind, run: run.id });
      if (row.result.status !== 'FAIL' || !row.result.failures.length) report.failures.push({ where: tag, reason: 'negative-control-was-not-hard-fail', status: row.result.status });
      if(row.measurementGate.status!=='FAIL')report.failures.push({where:tag,reason:'negative-invocation-bound-gate-did-not-fail',gate:row.measurementGate});
      if (['core-hidden-with-auxiliary-frame', 'leaf-contours-and-region-hidden'].includes(kind) && row.result.legacy.ink < 200)
        report.failures.push({ where: tag, reason: 'auxiliary-ink-control-did-not-cross-original-200' });
      report.negative.push(row);
    } catch (e) { error(tag, e); }
    finally {
      const restored = await session.page.evaluate(() => { window.__apmExperimentRestore?.();return lab.board.canvas.toDataURL('image/png'); });
      if (sha(Buffer.from(restored.split(',')[1], 'base64')) !== baselineSha) error(tag, 'Positive source frame was not restored byte-exactly');
    }
  }
}

try {
  for (const [unit, targets] of Object.entries(LABS)) for (const run of RUNS) {
    let session; const positives = new Map();
    try {
      session = await open(unit, run);
      const rows = await session.page.evaluate(sequence, { targets });
      for (const row of rows) { const tag = `${unit}--${row.id}--${run.id}--primary`;
        saveCanvas(row, `${tag}-canvas.png`); Object.assign(row, { unit, run: run.id }); assertPositive(row, tag);
        report.positive.push(row); positives.set(row.id, row); }
      if (rows.length !== targets.length || targets.some(id => !positives.has(id))) throw Error('Primary runtime target inventory mismatch');
      if (session.errors.length) error(`${unit}/${run.id}/primary`, session.errors.join('\n'));
    } catch (e) { error(`${unit}/${run.id}/primary`, e); }
    finally { await session?.guard.close(); await session?.context.close(); await drain(); }
    for (const id of targets) {
      session = undefined;
      try {
        session = await open(unit, run);
        const rows = await session.page.evaluate(sequence, { targets: [id], stopAt: id }), row = rows.at(-1);
        if (row?.id !== id) throw Error('Replay target mismatch');
        Object.assign(row, { unit, run: run.id }); const tag = `${unit}--${id}--${run.id}--replay`;
        saveCanvas(row, `${tag}-canvas.png`); await viewport(session, row, `${tag}-page.png`, { unit, id, run: run.id });
        row.primarySameCanvasBytes = row.canvasCapture.sha256 === positives.get(id)?.canvasCapture.sha256;
        row.primarySameLegacy = JSON.stringify(row.result.legacy) === JSON.stringify(positives.get(id)?.result.legacy);
        if (!row.primarySameCanvasBytes || !row.primarySameLegacy) report.failures.push({ where: tag, reason: 'primary-replay-drift' });
        assertPositive(row, tag); report.replays.push(row);
        if (row.result.contract.applicable) await runNegative(session, unit, id, run, MUTATIONS, row.canvasCapture.sha256);
        if (session.errors.length) error(tag, session.errors.join('\n'));
        row.screenshotEnvironment = session.environment;
      } catch (e) { error(`${unit}/${id}/${run.id}`, e); }
      finally { await session?.guard.close(); await session?.context.close(); await drain(); }
    }
    write(); console.log(JSON.stringify({ phase, unit, run: run.id, positive: report.positive.length, negative: report.negative.length, failures: report.failures.length, errors: report.infrastructureErrors.length }));
  }
  if (phase === 'candidate') for (const [unit, ids] of Object.entries(CRITICAL)) for (const id of ids) for (const run of RUNS) {
    let session;
    try {
      session = await open(unit, run, id);
      await session.page.evaluate(async expectedId => { if (String(lab.scene.id) !== expectedId) throw Error('Direct-hash critical scene mismatch');
        lab.render(); await new Promise(r => requestAnimationFrame(r)); }, id);
      const row = { unit, id, run: run.id, ...await session.page.evaluate(observe) };
      await session.page.evaluate(() => { window.__apmExperimentHoldRAF = true; });
      const tag = `${unit}--${id}--${run.id}--critical-positive`; saveCanvas(row, `${tag}-canvas.png`);
      await viewport(session, row, `${tag}-page.png`, { unit, id, run: run.id }); assertPositive(row, tag); report.critical.push(row);
      const kinds = ['core-hidden-with-auxiliary-frame']; if (id === 'f1-lens') kinds.push('leaf-fill-hidden', 'leaf-contours-and-region-hidden');
      await runNegative(session, unit, id, run, kinds, row.canvasCapture.sha256);
      if (session.errors.length) error(tag, session.errors.join('\n'));
      row.screenshotEnvironment = session.environment;
    } catch (e) { error(`${unit}/${id}/${run.id}/critical`, e); }
    finally { await session?.guard.close(); await session?.context.close(); await drain(); write(); }
  }
} catch (e) { error('top-level', e); }
finally { await drain(); await browser.close(); }
report.finishedAt = new Date().toISOString();
report.counts = { primary: report.positive.length, replays: report.replays.length, negative: report.negative.length,
  criticalPositive: report.critical.length, captures: report.captures.length, originalLegacyFailedPrimary: report.positive.filter(r => r.result.legacy.status === 'FAIL').length };
const expectedNegative = phase === 'candidate' ? 295 : 245;
report.experimentComplete = report.positive.length === 40 && report.replays.length === 40 && report.negative.length === expectedNegative
  && report.critical.length === (phase === 'candidate' ? 40 : 0) && !report.failures.length && !report.infrastructureErrors.length;
report.experimentStatus = report.experimentComplete ? 'CONTROLS_VERIFIED_NO_QUALITY_VERDICT' : 'EXPERIMENT_INCOMPLETE_OR_FAILED';
write(); console.log(JSON.stringify({ phase, source: expected, counts: report.counts, experimentStatus: report.experimentStatus,
  failures: report.failures.length, errors: report.infrastructureErrors.length }));
process.exitCode = report.experimentComplete ? 0 : 2;
