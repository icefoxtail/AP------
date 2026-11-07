// Full high-school scene observations. A browser pass does not certify the math.
// Invoked through scene-smoke.mjs --high-school; evidence stays outside Git.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const arg = (key, fallback) => { const i = argv.indexOf(key); return i < 0 ? fallback : argv[i + 1]; };
const root = path.resolve(arg('--root', '.'));
const out = path.resolve(arg('--out', '.tmp/high-lab-browser'));
const observe = argv.includes('--baseline-observe');
const scope = arg('--only', '').split(',').filter(Boolean);
const courses = ['common', 'algebra', 'calc1', 'geom', 'probstat'];
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
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/apmath/playground/`;
fs.mkdirSync(out, { recursive: true });
const report = { schema: 1, mode: observe ? 'BASELINE_OBSERVATION' : 'CANDIDATE_CHECK', commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), runs, labs: [], failures: [], limitations: ['Viewport simulation, not physical device testing.', 'All baseline scenes and steps; two generated variants per scene on mobile paper.', 'First visible slider and draggable point per scene; mathematical/visual interpretation requires independent review.'] };
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { headless: true });
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2));
try {
  for (const item of labs) {
    const dest = { id: item.id, course: item.course, file: item.next, scenes: [], observations: [], interactions: [], captures: [], failureCaptures: [] };
    report.labs.push(dest);
    for (const run of runs) {
      const context = await browser.newContext({ viewport: { width: run.width, height: run.height }, hasTouch: !run.name.startsWith('pc'), deviceScaleFactor: 1 });
      const page = await context.newPage();
      const errors = [], externalFailures = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`HTTP ${r.status()} ${r.url()}`); });
      page.on('requestfailed', r => { if (r.url().startsWith(base)) errors.push(r.url() + ' ' + r.failure()?.errorText); else externalFailures.push({ url: r.url(), error: r.failure()?.errorText }); });
      try {
        await page.addInitScript(() => { let seed = 424; Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; });
        await page.goto(base + item.next + '?theme=' + run.theme, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForFunction(() => window.lab && lab.board && lab.list.length);
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
              steps: get(lab.scene.steps).length,
              guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim() };
          });
          const issues = [];
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
            if(obs.step<obs.steps&&(obs.answerOpen||obs.solutionVisible))issues.push('early-staged-solution-disclosure');
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
            const card = cards.nth(index), summary = card.locator('summary');
            if (!(await card.getAttribute('open') !== null)) await summary.click();
            await measure(scene, `${prefix}-solution-${index + 1}`);
            const body = (await card.locator('.apl-acc-body').innerText()).trim();
            dest.interactions.push({ id:scene.id, run:run.name, kind:'solution-disclosure', state:prefix, index, bodyPresent:!!body });
            if (!body) report.failures.push({ lab:item.id, id:scene.id, run:run.name, state:prefix, reason:'empty-solution-body', index });
            if (await card.getAttribute('open') !== null) await summary.click();
          }
        };
        const capture = async (scene, state, fullPage = true) => {
          const name = `${item.id}--${scene.id}--${run.name}--${state}.png`.replace(/[^\p{L}\p{N}._-]/gu, '_');
          await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })); await settle();
          await page.screenshot({ path: path.join(out, name), fullPage }); dest.captures.push(name);
        };
        for (const scene of census.scenes) {
          await page.evaluate(i => lab.goScene(i), scene.index); const initial = await measure(scene, 'initial');
          if (scene.index === 0 && ['pc-paper', 'mobile-paper'].includes(run.name)) await capture(scene, 'initial');
          if (await page.evaluate(() => lab._tabAvailable('review'))) {
            await page.evaluate(() => lab.setTab('review'));
            // Some scenes expose their steps only in the review/problem tab.
            const firstReview = await measure(scene,'first-review'), n = firstReview.steps;
            for (let step = 0; step <= n; step++) {
              await page.evaluate(s => lab.setStep(s), step); await measure(scene, `step-${step}`);
            }
            if (n && await page.locator('.apl-step-all:visible').count()) { await page.locator('.apl-step-all:visible').click(); await measure(scene,'show-all'); }
            await inspectSolutions(scene, 'baseline');
            if (scene.index === 0 && run.name === 'pc-paper') await capture(scene, 'final');
            // One bounded student viewport per opted-in scene supports independent
            // figure/step review without archiving every intermediate state.
            else if (!observe && initial.stagedReveal && run.name === 'pc-paper') await capture(scene, 'review', false);
          }
          if (await page.evaluate(() => lab._tabAvailable('problem'))) {
            await page.evaluate(() => { lab.s.revealed=false; lab.setStep(0); lab.setTab('problem'); }); await measure(scene, 'problem-hidden');
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
              const canvas=page.locator('.apl-canvas'); await canvas.scrollIntoViewIfNeeded(); await settle();
              const point=await page.evaluate(id=>{const h=lab.board.handles.find(h=>h.id===id); const model=Object.fromEntries(Object.entries(lab.s).filter(([k])=>!['step','part','revealed','playing'].includes(k)));return {x:h.x,y:h.y,W:lab.board.W,H:lab.board.H,state:JSON.stringify(model)};},handle.id);
              const box=await canvas.boundingBox(),x=box.x+point.x*box.width/point.W,y=box.y+point.y*box.height/point.H;
              await page.mouse.move(x,y);await page.mouse.down();
              const acquired=await page.evaluate(id=>lab.board.dragging?.id===id,handle.id);
              await page.mouse.move(x+(point.x>point.W/2?-48:48),y-28,{steps:6});await page.mouse.up();await settle();
              const changed=point.state!==await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(lab.s).filter(([k])=>!['step','part','revealed','playing'].includes(k)))));
              dest.interactions.push({id:scene.id,run:run.name,kind:'drag',handle:handle.id,acquired,changed,pass:acquired&&changed});
              if(!acquired||!changed)report.failures.push({lab:item.id,id:scene.id,reason:'native-drag',acquired,changed});
              await measure(scene,'drag');
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
                  await measure(scene,`variant-solution-${variant}`);await inspectSolutions(scene,`variant-${variant}`);await page.evaluate(()=>lab.setTab('problem'));
                }
              }
            }
          }
        }
      } catch(e) { report.failures.push({lab:item.id,run:run.name,reason:'runner-error',error:e.message}); }
      if(errors.length)report.failures.push({lab:item.id,run:run.name,reason:'runtime-error',errors});
      if(externalFailures.length)(dest.externalFailures ||= []).push({run:run.name,failures:externalFailures});
      await context.close();save();
      console.log(JSON.stringify({lab:item.id,run:run.name,scenes:dest.scenes.length,failures:report.failures.filter(f=>f.lab===item.id).length}));
    }
  }
} finally { await browser.close();await new Promise(resolve=>server.close(resolve));save(); }
const totals={};for(const l of report.labs)totals[l.course]=(totals[l.course]||0)+l.scenes.length;
console.log(JSON.stringify({mode:report.mode,commit:report.commit,labs:report.labs.length,scenes:report.labs.reduce((n,l)=>n+l.scenes.length,0),totals,failures:report.failures.length}));
process.exitCode=observe?0:report.failures.length?1:0;
