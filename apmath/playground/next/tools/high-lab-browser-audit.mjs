// Full high-school scene observations. A browser pass does not certify the math.
// Invoked through scene-smoke.mjs --high-school; evidence stays outside Git.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { createLiveAssetVerifier, publicPlaygroundBase, drainResponseTasks } from './high-live-assets.mjs';
import { probeNativeDrag, probeNativeTouchDrag } from './high-drag-probe.mjs';
import { probeNativeOrbit, classifyOrbitCapability, currentOrbitFacts } from './high-orbit-probe.mjs';
import { evidenceProvenance, bindLabSources } from './high-evidence-binding.mjs';
import { REVIEW_LABS, requiredReviewStates, createReviewManifest, recordReviewScenes, recordReviewCapture, saveReviewManifest } from './high-review-capture.mjs';
import { captureReviewTargets, setNativeSolutionDisclosure } from './high-review-targets.mjs';
import { createScreenshotGuard, SCREENSHOT_ENVIRONMENT_POLICY } from './browser-screenshot-guard.mjs';
import { captureReviewState } from './high-viewport-evidence.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const arg = (key, fallback) => { const i = argv.indexOf(key); return i < 0 ? fallback : argv[i + 1]; };
const root = path.resolve(arg('--root', '.'));
const out = path.resolve(arg('--out', '.tmp/high-lab-browser'));
const observe = argv.includes('--baseline-observe');
const reviewCaptures = argv.includes('--review-captures');
if (observe && reviewCaptures) throw Error('Review captures belong to the candidate, not the baseline observation');
const publicBase = arg('--base-url', ''); // HTTP(S) playground/ directory, not labs/.
if (publicBase && observe) throw Error('Public verification cannot be a baseline-only observation');
const scope = arg('--only', '').split(',').filter(Boolean);
const courses = ['common', 'algebra', 'calc1', 'geom', 'probstat'];
// Bounded mobile follow-up for independently observed label regressions.
const mobileFollowup = new Set(['calc1-tangent:normal', 'prob-stats:pdf']);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-catalog.js'), 'utf8'), sandbox);
const allLabs = sandbox.window.APLab.catalog.labs.filter(l => courses.includes(l.course));
const labs = allLabs.filter(l => !scope.length || scope.includes(l.id) || scope.includes(path.basename(l.next, '.html')) || scope.includes(l.course));
if (!labs.length || scope.some(s => !labs.some(l => [l.id, l.course, path.basename(l.next, '.html')].includes(s)))) throw Error('Empty or unknown high-school scope');
const runs = [
  { name: 'pc', width: 1440, height: 900 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'tablet-portrait', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 }
].flatMap(v => ['paper', 'board'].map(theme => ({ ...v, theme, name: v.name + '-' + theme })));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400).end(); return; }
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
if (!publicBase) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = publicBase ? publicPlaygroundBase(publicBase).href : `http://127.0.0.1:${server.address().port}/apmath/playground/`;
fs.mkdirSync(out, { recursive: true });
const provenance = evidenceProvenance(root, { baseline: observe });
const sourceBindings = labs.map(item => bindLabSources(root, item, provenance));
const report = { schema: 3, mode: observe ? 'BASELINE_OBSERVATION' : 'CANDIDATE_CHECK', commit: provenance.sourceCommit, provenance, sourceBindings, runs, labs: [], failures: [], capabilityPolicy: { touchDrag: 'REQUIRED_FOR_VISIBLE_HANDLES', orbit: 'REVIEWED_CURRENT_SCENE', screenshotEnvironment: SCREENSHOT_ENVIRONMENT_POLICY }, limitations: ['Viewport and Chromium touch-input simulation; physical devices NOT_RUN.', 'All baseline scenes and steps; two generated variants per scene on mobile paper.', 'First visible slider and draggable point per scene; mouse and touch drag plus required 3D empty-canvas orbit. Mathematical/visual interpretation requires independent review.'] };
for (const binding of sourceBindings) for (const error of binding.errors) report.failures.push({ lab: binding.lab, ...error });
const captureLabs = reviewCaptures ? labs.filter(l => REVIEW_LABS.includes(l.id)) : [];
const reviewManifest = captureLabs.length ? createReviewManifest({ labs: captureLabs, provenance, sourceBindings }) : null;
const live = publicBase ? createLiveAssetVerifier({root,baseURL:base,commit:report.commit,onFailure:f=>report.failures.push(f)}) : null;
if (live) {
  report.mode = 'PUBLIC_READ_ONLY_CHECK'; report.baseURL = base; report.sourceVerification = live.report;
  report.releaseEvent = { runId:process.env.RELEASE_RUN_ID||null,headSHA:process.env.RELEASE_EVENT_HEAD_SHA||null,meaning:'Release workflow metadata, not an assertion of deployed commit.' };
}
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { headless: true });
const save = (final = false) => {
  if (reviewManifest) {
    const coverage = saveReviewManifest(reviewManifest, out, report, { final });
    report.reviewCapture = { file: 'review-capture-manifest.json', ...coverage };
    if (final && !coverage.complete) report.failures.push({ reason: 'incomplete-review-capture', errors: coverage.errors, missing: coverage.missing });
  }
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2));
};
try {
  for (const item of labs) {
    const dest = { id: item.id, course: item.course, file: item.next, scenes: [], observations: [], interactions: [], captures: [], captureMetadata: {}, captureBundles: {}, screenshotEnvironment: [], failureCaptures: [] };
    report.labs.push(dest);
    for (const run of runs) {
      const context = await browser.newContext({ viewport: { width: run.width, height: run.height }, hasTouch: !run.name.startsWith('pc'), deviceScaleFactor: 1, serviceWorkers:'block' });
      const page = await context.newPage();
      let screenshotGuard;
      const errors = [], externalFailures = [];
      const responseTasks=[],liveContext=item.id+'--'+run.name;
      if(live){
        await context.route('**/*',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():(errors.push('Blocked non-read-only request'),route.abort()));
        page.on('response',response=>{if(['document','script','stylesheet'].includes(response.request().resourceType()))responseTasks.push(live.verify(response,liveContext));});
      }
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`HTTP ${r.status()} ${r.url()}`); });
      page.on('requestfailed', r => { if (r.url().startsWith(base)) errors.push(r.url() + ' ' + r.failure()?.errorText); else externalFailures.push({ url: r.url(), error: r.failure()?.errorText }); });
      try {
        await page.addInitScript(() => { let seed = 424; Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; });
        await page.goto(base + item.next + '?theme=' + run.theme + '&manual=1', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForFunction(() => window.lab && lab.board && lab.list.length);
        // Event support is document-specific: compare captures with the loaded
        // lab, not with the transient about:blank document before navigation.
        screenshotGuard = await createScreenshotGuard(page, { expectedTouch: !run.name.startsWith('pc'), onObservation: observation => {
          dest.screenshotEnvironment.push({ run: run.name, ...observation });
          if (!observation.pass) report.failures.push({ lab: item.id, run: run.name, id: observation.id, state: observation.state, reason: observation.reason, screenshotEnvironment: observation });
        } });
        if(live){
          const catalogResponse=await context.request.get(new URL('next/kit/apl-catalog.js',base).href);
          await live.verify(catalogResponse,liveContext);
        }
        const census = await page.evaluate(async () => {
          const scenes = lab.list.map((s, index) => ({ id: String(s.id), title: s.title, index, group: s.group?.title }));
          lab.openOverview(); await new Promise(r => requestAnimationFrame(r));
          const selectionCount = document.querySelectorAll('.apl-scene-card').length;
          return { scenes, selectionCount };
        });
        // The kit uses an accessible div dialog, not the native HTML <dialog>.
        await page.getByRole('dialog').getByRole('button', { name: '닫기', exact: true }).click();
        await page.locator('.apl-dialog').waitFor({ state: 'detached' });
        if (!dest.scenes.length) dest.scenes = census.scenes;
        if (reviewManifest) recordReviewScenes(reviewManifest, item.id, census.scenes);
        if (Number.isInteger(item.sceneTotal) && census.scenes.length !== item.sceneTotal) report.failures.push({ lab: item.id, run: run.name, reason: 'catalog-scene-total-mismatch', expected: item.sceneTotal, actual: census.scenes.length });
        if (census.selectionCount !== census.scenes.length || new Set(census.scenes.map(s => s.id)).size !== census.scenes.length) report.failures.push({ lab: item.id, run: run.name, reason: 'scene-selection-inventory', selectionCount: census.selectionCount, count: census.scenes.length });
        if (JSON.stringify(dest.scenes) !== JSON.stringify(census.scenes)) throw Error('Scene list changes between viewports/themes');
        await page.evaluate(() => {
          const b = lab.board, original = b._text;
          window.__highLabels = [];
          b._text = function (x, y, text, o = {}, screen) {
            if (text != null && text !== '' && !screen && !this._bbox && !this.thumb) {
              const size = (o.size || 13) * b.fs * b._ts(), c = b.ctx;
              c.save(); c.font = `${o.weight || 750} ${size}px ${b.font}`;
              const segs = b._fracSplit(String(text)), fractionSize = Math.max(size * .72, Math.min(size * .9, 9.5));
              let width = 0;
              if (segs) for (const part of segs) {
                c.font = `${o.weight || 750} ${part.t === undefined ? fractionSize : size}px ${b.font}`;
                width += part.t === undefined ? Math.max(c.measureText(part.n).width, c.measureText(part.d).width) + fractionSize * .34 : c.measureText(part.t).width;
              } else width = c.measureText(String(text)).width;
              c.restore();
              const align = o.align || 'center', baseline = o.baseline || 'alphabetic';
              const x0 = x + (align === 'center' ? -width / 2 : ['right', 'end'].includes(align) ? -width : 0);
              let y0 = y + (baseline === 'middle' ? -size / 2 : ['top', 'hanging'].includes(baseline) ? 0 : baseline === 'bottom' ? -size : -size * .8), y1 = y0 + size;
              if (segs) {
                const mid = y + (baseline === 'middle' ? 0 : ['top','hanging'].includes(baseline) ? size * .5 : baseline === 'bottom' ? -size * .5 : -size * .3);
                y0 = Math.min(y0, mid - fractionSize * 1.15); y1 = Math.max(y1, mid + fractionSize * 1.15);
              }
              window.__highLabels.push({ text: String(text), x0, x1: x0 + width, y0, y1 });
            }
            return original.apply(this, arguments);
          };
        });
        const settle = async () => {
          await page.waitForFunction(() => !lab._tween, null, { timeout: 5000 });
          await page.evaluate(async () => { lab.render(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); window.__highLabels = []; lab.render(); });
        };
        const measure = async (scene, state) => {
          await settle();
          const obs = await page.evaluate(() => {
            const b = lab.board, d = b.ctx.getImageData(0, 0, b.canvas.width, b.canvas.height).data;
            let ink = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 30) ink++;
            const get = v => (typeof v === 'function' ? v(lab.s, lab) : v) || [];
            const want = get(lab.scene.controls).filter(k => lab.params[k]).length + get(lab.scene.presets).length + get(lab.scene.actions).length;
            const have = [...document.querySelectorAll('.apl-ctl, .apl-presets .apl-chip, .apl-actions-row button')].filter(e => e.checkVisibility()).length;
            const future = [...(lab.refs.steps?.children || [])].filter((e, i) => i >= lab.s.step && e.children[1]?.textContent.trim() !== '선택하면 이 단계의 풀이가 열립니다.').length;
            const katexErrors = [...document.querySelectorAll('.katex-error')].filter(e => e.checkVisibility()).map(e => e.textContent);
            const text = [...document.querySelectorAll('.apl-tabpanel:not([hidden])')].map(e => e.textContent).join(' ');
            const handles=b.handles.filter(h=>typeof h.drag==='function'&&h.x>10&&h.y>10&&h.x<b.W-10&&h.y<b.H-10);
            const capabilities={sliders:[...document.querySelectorAll('.apl-ctl input[type="range"]')].filter(e=>e.checkVisibility()).length,drags:handles.length,generator:!!lab._newProbBtn(),solutions:['standard','quick'].filter(k=>lab.scene.solution?.[k]).length};
            return { step: lab.s.step, tab: lab.tab, tabs: ['review','problem'].filter(t=>lab._tabAvailable(t)), stagedReveal:!!lab.def.stagedReveal, solutionVisible:!!lab.refs.solution?.querySelector('details')&&lab.refs.solution.checkVisibility(),capabilities,ink, width: b.W, height: b.H, want, have, future, katexErrors,
              invalidText: (text.match(/undefined|NaN|Infinity|\[object Object\]/g) || []),
              clipped: window.__highLabels.filter(q => Math.max(-q.x0, q.x1-b.W, -q.y0, q.y1-b.H) > 2),
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              overflowNodes: document.documentElement.scrollWidth > innerWidth + 1 ? [...document.querySelectorAll('body *')].filter(e=>e.checkVisibility()).map(e=>({e,r:e.getBoundingClientRect()})).filter(({r})=>r.left < -1 || r.right > innerWidth + 1).sort((a,b)=>b.r.right-a.r.right).slice(0,8).map(({e,r})=>({tag:e.tagName,className:String(e.className),left:r.left,right:r.right,width:r.width,text:e.textContent.replace(/\s+/g,' ').trim().slice(0,100)})) : [],
              answerOpen: !!lab.refs.answer?.classList.contains('open'),
              camera: { focus:b.focus, zoom:b.zoom, k:b.k, ky:b.ky, panX:b.panX, panY:b.panY, insets:b.insets },
              steps: get(lab.scene.steps).length,
              guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim() };
          });
          const issues = [];
          if (state === 'initial') {
            obs.capabilities.orbit = classifyOrbitCapability(item.id, scene.id, await page.evaluate(currentOrbitFacts));
            if (obs.capabilities.orbit.status === 'INVALID') issues.push('invalid-orbit-capability');
          }
          if (obs.ink < 200) issues.push('blank-canvas');
          if (obs.overflow) issues.push('page-horizontal-overflow');
          if (obs.katexErrors.length) issues.push('katex-error');
          if (obs.invalidText.length) issues.push('invalid-panel-text');
          if (obs.clipped.length) issues.push('clipped-label');
          if (!obs.guide) issues.push('missing-guide');
          if (state === 'initial' && obs.want !== obs.have) issues.push('missing-control');
          if (obs.tab === 'review' && obs.future) issues.push('future-step-disclosure');
          if ((state === 'initial' || state === 'problem-hidden' || /^variant-\d+$/.test(state)) && obs.steps > 0 && obs.answerOpen) issues.push('early-answer-disclosure');
          if(obs.stagedReveal){
            if(state==='initial'&&obs.step!==0)issues.push('initial-step-not-zero');
            if(state==='first-review'&&obs.steps>0&&obs.step!==1)issues.push('first-review-not-step-one');
            if(state!=='answer-revealed'&&obs.step<obs.steps&&(obs.answerOpen||obs.solutionVisible))issues.push('early-staged-solution-disclosure');
          }
          const row = { id: scene.id, run: run.name, state, ...obs, issues };
          dest.observations.push(row);
          if (issues.length) report.failures.push({ lab: item.id, id: scene.id, run: run.name, state, issues, clipped: obs.clipped, katexErrors: obs.katexErrors, overflowNodes:obs.overflowNodes });
          if (issues.length && !observe && run.theme==='paper' && dest.failureCaptures.length<2 && !dest.failureCaptures.some(f=>f.id===scene.id)) {
            await capture(scene, `defect-${state}`, false);
            dest.failureCaptures.push({id:scene.id,run:run.name,state,issues,file:dest.captures.at(-1)});
          }
          return row;
        };
        const inspectSolutions = async (scene, prefix) => {
          // These bodies are lazy: calling scene.steps does not exercise them.
          const cards = page.locator('#apl-pane-review details.apl-acc');
          const count = await cards.count();
          for (let index = 0; index < count; index++) {
            const card = cards.nth(index);
            const toggle = open => setNativeSolutionDisclosure({ page, card, open, settle,
              onObservation: result => dest.interactions.push({ id: scene.id, run: run.name, kind: 'solution-control', state: prefix, index, ...result }) });
            await toggle(true);
            await measure(scene, `${prefix}-solution-${index + 1}`);
            const body = (await card.locator('.apl-acc-body').innerText()).trim();
            dest.interactions.push({ id:scene.id, run:run.name, kind:'solution-disclosure', state:prefix, index, bodyPresent:!!body });
            if (!body) report.failures.push({ lab:item.id, id:scene.id, run:run.name, state:prefix, reason:'empty-solution-body', index });
            await toggle(false);
          }
        };
        const capture = async (scene, state, fullPage = true) => {
          const name = `${item.id}--${scene.id}--${run.name}--${state}.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
          const bundle = await captureReviewState({ page, guard: screenshotGuard, out, name, id: scene.id, state, fullPage, settle,
            nativeViewportOnly: true,
            collectContent: !!reviewManifest && REVIEW_LABS.includes(item.id),
            onCapture: entry => { dest.captureMetadata[entry.file] = entry.frame; dest.captures.push(entry.file); }
          });
          dest.captureBundles[bundle.file] = bundle;
          if (reviewManifest && requiredReviewStates(item.id, run.name).includes(state)) recordReviewCapture(reviewManifest, out, { lab: item.id, id: scene.id, run: run.name, state, ...bundle, method: state === 'answer-revealed' ? 'native-reveal-button' : 'scene-state-traversal' });
          return bundle.file;
        };
        const wantsCapture = state => reviewManifest && requiredReviewStates(item.id, run.name).includes(state);
        for (const scene of census.scenes) {
          await page.evaluate(i => lab.goScene(i), scene.index); const initial = await measure(scene, 'initial');
          if (scene.index === 0 && ['pc-paper', 'mobile-paper'].includes(run.name)) await capture(scene, 'initial');
          if (wantsCapture('initial-explore')) {
            await page.evaluate(() => lab.setTab('explore'));
            await measure(scene, 'initial-explore'); await capture(scene, 'initial-explore');
          }
          if (await page.evaluate(() => lab._tabAvailable('review'))) {
            await page.evaluate(() => lab.setTab('review'));
            // Some scenes expose their steps only in the review/problem tab.
            const firstReview = await measure(scene,'first-review'), n = firstReview.steps;
            for (let step = 0; step <= n; step++) {
              await page.evaluate(s => lab.setStep(s), step); await measure(scene, `step-${step}`);
            }
            if (n && await page.locator('.apl-step-all:visible').count()) { await page.locator('.apl-step-all:visible').click(); await measure(scene,'show-all'); }
            await inspectSolutions(scene, 'baseline');
            if (wantsCapture('review-final')) { await measure(scene, 'review-final'); await capture(scene, 'review-final'); }
            else if (scene.index === 0 && run.name === 'pc-paper') await capture(scene, 'final');
            // One bounded student viewport per opted-in scene supports independent
            // figure/step review without archiving every intermediate state.
            else if (!observe && !live && initial.stagedReveal && run.name === 'pc-paper') await capture(scene, 'review', false);
            if (!observe && run.name === 'mobile-paper' && mobileFollowup.has(`${item.id}:${scene.id}`)) await capture(scene, 'review', false);
          }
          if (await page.evaluate(() => lab._tabAvailable('problem'))) {
            await page.evaluate(() => { lab.s.revealed=false; lab.setStep(0); lab.setTab('problem'); }); await measure(scene, 'problem-hidden');
            if (wantsCapture('problem-hidden')) await capture(scene, 'problem-hidden');
            if (run.name === 'pc-paper' || run.name === 'mobile-paper' || wantsCapture('answer-revealed')) {
              const reveal = page.locator('#apl-pane-problem .apl-answer [data-reveal]:visible');
              if (await reveal.count()) {
                await reveal.click(); await settle();
                const opened = await page.evaluate(() => ({ open:!!lab.refs.answer?.classList.contains('open'), text:lab.refs.answer?.querySelector('.val')?.textContent.trim() || '' }));
                const pass = opened.open && !!opened.text;
                dest.interactions.push({ id:scene.id, run:run.name, kind:'answer-control', pass, open:opened.open, answerPresent:!!opened.text });
                if (!pass) report.failures.push({lab:item.id,id:scene.id,run:run.name,reason:'answer-control'});
                await measure(scene, 'answer-revealed');
                if (wantsCapture('answer-revealed') && pass) await capture(scene, 'answer-revealed');
                await page.evaluate(() => { lab.s.revealed=false; lab.invalidate(true); }); await settle();
              } else {
                dest.interactions.push({ id:scene.id, run:run.name, kind:'answer-control', status:'NOT_APPLICABLE', reason:'scene-does-not-expose-standard-reveal-button' });
                if (wantsCapture('answer-revealed')) report.failures.push({ lab: item.id, id: scene.id, run: run.name, reason: 'required-review-answer-control-missing' });
              }
            }
          }
          if (run.name === 'mobile-paper') {
            await page.evaluate(i => { lab.goScene(i); lab.setTab('explore'); }, scene.index); await settle();
            const ctl = await page.evaluate(() => {
              const entry=Object.entries(lab._ctls || {}).find(([,c]) => c.input.type==='range' && c.input.checkVisibility());
              if (!entry) return null;
              const [key,c]=entry, p=c.input.cloneNode(false); p.value=c.input.value;
              try { p.stepUp(); if (p.value===c.input.value) p.stepDown(); } catch { p.value=c.input.max; }
              return {key,value:p.value,label:c.input.getAttribute('aria-label') || APLab.stripEmoji(lab.params[key].label)};
            });
            if (ctl) {
              await page.getByRole('slider', {name:ctl.label,exact:true}).fill(ctl.value); await settle();
              const actual=await page.evaluate(k=>lab.s[k],ctl.key), pass=Math.abs(actual-Number(ctl.value))<1e-7;
              dest.interactions.push({id:scene.id,run:run.name,kind:'slider',...ctl,actual,pass});
              if (!pass) report.failures.push({lab:item.id,id:scene.id,reason:'slider-state',expected:ctl.value,actual});
              await measure(scene,'slider');
            }
            await page.evaluate(i => lab.goScene(i), scene.index); await settle();
            const handle=await page.evaluate(()=>lab.board.handles.find(h=>typeof h.drag==='function' && h.x>10 && h.y>10 && h.x<lab.board.W-10 && h.y<lab.board.H-10));
            if(handle){
              const result=await probeNativeDrag(page,page.locator('.apl-canvas'),settle,handle.id);
              dest.interactions.push({id:scene.id,run:run.name,kind:'drag',handle:handle.id,...result});
              if(!result.pass)report.failures.push({lab:item.id,id:scene.id,reason:'native-drag',...result});
              await measure(scene,'drag');
              await page.evaluate(i => lab.goScene(i), scene.index); await settle();
              const touch = await probeNativeTouchDrag(page, page.locator('.apl-canvas'), settle, handle.id);
              dest.interactions.push({ id: scene.id, run: run.name, kind: 'touch-drag', handle: handle.id, ...touch });
              if (!touch.pass) report.failures.push({ lab: item.id, id: scene.id, run: run.name, reason: 'native-touch-drag', ...touch });
              await measure(scene, 'touch-drag');
            }
            await page.evaluate(i=>lab.goScene(i),scene.index);await settle();
            const orbit = classifyOrbitCapability(item.id, scene.id, await page.evaluate(currentOrbitFacts));
            if (orbit.status === 'REQUIRED') {
              const result=await probeNativeOrbit(page,page.locator('.apl-canvas'),settle);
              dest.interactions.push({id:scene.id,run:run.name,kind:'orbit',capability:orbit,...result});
              if(!result.pass)report.failures.push({lab:item.id,id:scene.id,reason:'native-orbit',...result});
              await measure(scene,'orbit');
            } else if (orbit.status === 'INVALID') {
              dest.interactions.push({ id: scene.id, run: run.name, kind: 'orbit', pass: false, capability: orbit, reason: orbit.reason });
              report.failures.push({ lab: item.id, id: scene.id, run: run.name, reason: 'invalid-orbit-capability', capability: orbit });
            } else {
              dest.interactions.push({ id: scene.id, run: run.name, kind: 'orbit', status: 'NOT_APPLICABLE', capability: orbit, reason: orbit.reason });
            }
            if(await page.evaluate(()=>lab._tabAvailable('problem'))){
              await page.evaluate(i=>{lab.goScene(i);lab.setTab('problem');},scene.index);await settle();
              const button=page.locator('#apl-pane-problem .apl-newprob:visible');
              const available=await button.count();
              if(!available)dest.interactions.push({id:scene.id,run:run.name,kind:'new-problem',status:'NOT_APPLICABLE',reason:'scene-does-not-expose-generator'});
              const problemText=()=>page.evaluate(()=>{const e=lab.refs.problemText.cloneNode(true);e.querySelectorAll('button').forEach(b=>b.remove());return e.textContent.replace(/\s+/g,' ').trim();});
              for(let variant=1;available&&variant<=2;variant++){
                const before=await problemText();
                await button.first().click();await settle();
                const after=await problemText();
                dest.interactions.push({id:scene.id,run:run.name,kind:'new-problem',variant,textChanged:before!==after});
                if(before===after)report.failures.push({lab:item.id,id:scene.id,run:run.name,state:`variant-${variant}`,reason:'unchanged-new-problem'});
                await measure(scene,`variant-${variant}`);
                if(await page.evaluate(()=>lab._tabAvailable('review'))){
                  await page.evaluate(()=>{lab.setTab('review');const s=lab.scene.steps;lab.setStep((typeof s==='function'?s(lab.s,lab):s)?.length||0);});
                  await measure(scene,`variant-solution-${variant}`);await inspectSolutions(scene,`variant-${variant}`);
                  if (reviewManifest && item.course === 'algebra' && REVIEW_LABS.includes(item.id) && variant === 1) {
                    const state = 'target-generated-variant-1'; await measure(scene, state);
                    const file = await capture(scene, state);
                    recordReviewCapture(reviewManifest, out, { lab: item.id, id: scene.id, run: run.name, state, ...dest.captureBundles[file], method: 'native-new-problem-button', variant });
                  }
                  await page.evaluate(()=>lab.setTab('problem'));
                }
              }
            }
          }
          if (reviewManifest && REVIEW_LABS.includes(item.id)) {
            const entries = await captureReviewTargets({ page, item, scene, run, settle, measure, capture,
              onInteraction: result => dest.interactions.push(result) });
            for (const entry of entries || []) {
              if (entry.file) recordReviewCapture(reviewManifest, out, { ...entry, lab: item.id, id: scene.id, run: run.name, ...dest.captureBundles[entry.file] });
              else {
                const row = { ...entry, lab: item.id, id: scene.id, run: run.name };
                if (entry.status === 'NOT_APPLICABLE') reviewManifest.notApplicable.push(row);
                else if (entry.status === 'LIMITATION') reviewManifest.targetLimitations.push(row);
                else reviewManifest.coverageDebt.push(row);
              }
            }
          }
        }
      } catch(e) { report.failures.push({lab:item.id,run:run.name,reason:'runner-error',error:e.message}); }
      if(errors.length)report.failures.push({lab:item.id,run:run.name,reason:'runtime-error',errors});
      if(externalFailures.length)(dest.externalFailures ||= []).push({run:run.name,failures:externalFailures});
      let sourceURLs=[];
      if(live){
        sourceURLs=await page.evaluate(()=>[location.href,...[...document.scripts].filter(s=>s.src).map(s=>s.src),...[...document.querySelectorAll('link[rel="stylesheet"][href]')].map(s=>s.href)]).catch(()=>[]);
        await drainResponseTasks(responseTasks);
      }
      try { await screenshotGuard?.close(); }
      catch (e) { report.failures.push({ lab: item.id, run: run.name, reason: 'screenshot-guard-cleanup', error: e.message }); }
      await context.close(); // End observation before the final response drain.
      if(live){
        await drainResponseTasks(responseTasks);
        live.requireSources([base+item.next,new URL('next/kit/apl-catalog.js',base).href,...sourceURLs],liveContext);
      }
      save();
      console.log(JSON.stringify({lab:item.id,run:run.name,scenes:dest.scenes.length,failures:report.failures.filter(f=>f.lab===item.id).length}));
    }
  }
} finally { await browser.close();if(!publicBase)await new Promise(resolve=>server.close(resolve));if(live)report.sourceVerification=live.finish();save(true); }
const totals={};for(const l of report.labs)totals[l.course]=(totals[l.course]||0)+l.scenes.length;
console.log(JSON.stringify({mode:report.mode,commit:report.commit,labs:report.labs.length,scenes:report.labs.reduce((n,l)=>n+l.scenes.length,0),totals,failures:report.failures.length}));
process.exitCode=observe?0:report.failures.length?1:0;
