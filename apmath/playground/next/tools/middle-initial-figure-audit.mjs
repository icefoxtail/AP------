// Initial figures are inspected independently of solution completion. Screenshots
// and observations belong in external evidence storage, never in the source tree.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { sampleInitialFigure } from './middle-initial-figure-contracts.mjs';

export const VIEWPORTS = [
  { name: 'pc', width: 1440, height: 900 },
  { name: 'tablet-portrait', width: 820, height: 1180 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small-mobile', width: 360, height: 800 }
];

export function discoverMiddleCatalog(root) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-catalog.js'), 'utf8'), context);
  const labs = context.window.APLab.catalog.labs.filter(l => ['g7', 'g8', 'g9'].includes(l.course));
  if (!labs.length || new Set(labs.map(l => l.id)).size !== labs.length) throw Error('Empty or duplicate middle catalog');
  for (const lab of labs) {
    if (!lab.next || !fs.existsSync(path.join(root, 'apmath/playground', lab.next))) throw Error(`Missing registered lab: ${lab.id}`);
  }
  return JSON.parse(JSON.stringify(labs));
}

// Legacy direct-entry conditions live beside the actual module registration.
// Discover their literal IDs from source, then ask Chromium which scenes they
// register. Alias URLs are tested separately and do not inflate the denominator.
export function discoverHashEntries(root, unit) {
  const html = fs.readFileSync(path.join(root, 'apmath/playground/next/labs', `${unit}.html`), 'utf8');
  const entries = new Map();
  for (const match of html.matchAll(/\.split\(['"]@['"]\)\[0\]\s*===\s*['"]([^'"]+)['"]/g)) {
    const id = match[1], tail = html.slice(match.index + match[0].length, match.index + match[0].length + 650);
    const boundary = tail.indexOf('\n  }');
    const assignment = /oldHash\.set\(['"]s['"],\s*['"]([^'"]+)['"]\)/.exec(boundary >= 0 ? tail.slice(0,boundary) : '');
    entries.set(id, {id, expectedId: assignment ? assignment[1].split('@')[0] : id});
  }
  return [...entries.values()];
}

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function sourcesFor(root, unit) {
  const directory = path.join(root, 'apmath/playground/next');
  const files = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full);
      else if (/\.(?:js|css|html)$/.test(item.name)) files.push(full);
    }
  }
  walk(path.join(directory, 'kit'));
  files.push(path.join(directory, 'labs', `${unit}.html`));
  const modules = path.join(directory, 'labs', unit);
  if (fs.existsSync(modules)) walk(modules);
  const entries = files.sort().map(file => ({ path: path.relative(root, file), sha256: sha(fs.readFileSync(file)) }));
  return { digest: sha(JSON.stringify(entries)), files: entries };
}

// Instrument actual drawing, including caught renderer exceptions. A text label
// or outer rectangle alone is not a semantic pass (see the independent contracts).
function installObservation() {
  const b = window.lab.board;
  window.__initialFigureDraws = [];
  for (const method of ['path', 'poly', 'line', 'segment', 'arc', 'circle', 'plot', 'handle', 'point']) {
    if (typeof b[method] !== 'function') continue;
    const original = b[method];
    b[method] = function (...args) {
      const options = args.at(-1);
      if (!this._bbox && !this.thumb) window.__initialFigureDraws.push({ method,
        ref: options && typeof options === 'object' ? options.ref || null : null,
        alpha: options && typeof options === 'object' ? options.alpha ?? 1 : 1 });
      return original.apply(this, args);
    };
  }
}

function observe() {
  const l = window.lab, b = l.board, c = b.canvas, rect = c.getBoundingClientRect();
  const pixels = b.ctx.getImageData(0, 0, c.width, c.height).data;
  let ink = 0, x0 = c.width, y0 = c.height, x1 = -1, y1 = -1, hash = 2166136261;
  for (let i = 0; i < pixels.length; i += 4) {
    hash = Math.imul(hash ^ pixels[i], 16777619);
    hash = Math.imul(hash ^ pixels[i + 1], 16777619);
    hash = Math.imul(hash ^ pixels[i + 2], 16777619);
    hash = Math.imul(hash ^ pixels[i + 3], 16777619);
    if (pixels[i + 3] > 30) {
      ink++;
      const x = (i / 4) % c.width, y = Math.floor(i / 4 / c.width);
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  }
  const style = getComputedStyle(c);
  const visibleWidth = Math.max(0, Math.min(innerWidth, rect.right) - Math.max(0, rect.left));
  const visibleHeight = Math.max(0, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top));
  const handles = b.handles.filter(h => typeof h.drag === 'function').map(h => ({ id: h.id, x: h.x, y: h.y,
    inCanvas: h.x >= 0 && h.x <= b.W && h.y >= 0 && h.y <= b.H }));
  const params = Object.fromEntries(Object.keys(l.params).map(key => [key, l.s[key]]));
  const value = v => typeof v === 'function' ? v(l.s, l) : v;
  const declaredControls = (value(l.scene.controls) || []).filter(k => l.params[k]);
  const sliders = Object.entries(l._ctls || {}).filter(([,v]) => v.input.checkVisibility()).map(([key,v]) => ({
    key, label: v.input.getAttribute('aria-label'), min: v.input.min, max: v.input.max, step: v.input.step, value: v.input.value,
    stateValue: l.s[key], output: v.out.textContent, hint: typeof v.p.hint === 'string' ? v.p.hint : null
  }));
  const hint = document.querySelector('.apl-orient-hint');
  const hr = hint?.checkVisibility() ? hint.getBoundingClientRect() : null;
  const hintOverlap = hr ? Math.max(0, Math.min(hr.right, rect.right) - Math.max(hr.left, rect.left)) * Math.max(0, Math.min(hr.bottom, rect.bottom) - Math.max(hr.top, rect.top)) : 0;
  return { id: String(l.scene.id), title: l.scene.title, heading: document.querySelector('.apl-scene-title')?.textContent,
    index: l.index, tab: l.tab, step: l.s.step, playing: !!l.s.playing, revealed: !!l.s.revealed,
    answerOpen: !!l.refs.answer?.classList.contains('open'),
    canvas: { width: c.width, height: c.height, cssWidth: rect.width, cssHeight: rect.height,
      left: rect.left, top: rect.top, visibleWidth, visibleHeight, display: style.display, visibility: style.visibility, opacity: style.opacity },
    ink, inkBounds: ink ? { x0, y0, x1, y1 } : null, pixelFingerprint: (hash >>> 0).toString(16),
    geometry: window.__initialFigureDraws, params, declaredControls, sliders, handles,
    overflow: document.documentElement.scrollWidth > innerWidth + 1, hintOverlap,
    katexErrors: [...document.querySelectorAll('.katex-error')].filter(e => e.checkVisibility()).map(e => e.textContent),
    question: document.querySelector('.apl-question .q')?.textContent || '',
    problem: l.ui.panes.problem?.textContent || '',
    svgCount: document.querySelectorAll('.apl-stage svg').length,
    reviewAvailable: l._tabAvailable('review'), problemAvailable: l._tabAvailable('problem'),
    animationAvailable: (l._actionBtns || []).some(({a,b}) => (a.play || a.id === 'play') && b.checkVisibility())
  };
}

export function initialIssues(observation, expectedId, errors, semantic) {
  const issues = [];
  if (observation.id !== expectedId) issues.push('selected-scene-mismatch');
  if (errors.length) issues.push('browser-error');
  const c = observation.canvas;
  if (c.width <= 0 || c.height <= 0 || c.cssWidth <= 0 || c.cssHeight <= 0 || c.display === 'none' || c.visibility !== 'visible' || +c.opacity <= 0) issues.push('canvas-not-visible');
  if (c.visibleWidth < Math.min(100, c.cssWidth) || c.visibleHeight < Math.min(100, c.cssHeight)) issues.push('canvas-outside-first-viewport');
  if (observation.ink < 200) issues.push('blank-canvas');
  if (observation.overflow) issues.push('horizontal-overflow');
  if (observation.hintOverlap > 0) issues.push('orientation-hint-covers-canvas');
  if (observation.katexErrors.length) issues.push('math-typesetting-error');
  for (const slider of observation.sliders || []) {
    // A native range may round half a step, but cannot silently clamp a model
    // value to another module's range while displaying the original number.
    const tolerance = Math.max(1e-7, (+slider.step || 0) / 2 + 1e-7);
    if (Number.isFinite(slider.stateValue) && Math.abs(+slider.value - slider.stateValue) > tolerance) issues.push(`slider-model-mismatch:${slider.key}`);
  }
  if (semantic.status === 'FAIL') issues.push(...semantic.failures.map(x => typeof x === 'string' ? x : x.code || 'required-figure-missing'));
  return [...new Set(issues)];
}

async function run() {
  const argv = process.argv.slice(2);
  const arg = (key, fallback) => { const i = argv.indexOf(key); return i < 0 ? fallback : argv[i + 1]; };
  const root = path.resolve(arg('--root', '.'));
  const all = discoverMiddleCatalog(root);
  if (argv.includes('--list-units')) { console.log(JSON.stringify(all.map(l => l.id))); return; }
  const chosen = arg('--units', '').split(',').filter(Boolean);
  if (chosen.some(id => !all.some(l => l.id === id))) throw Error('Unknown middle unit');
  const units = chosen.length ? all.filter(l => chosen.includes(l.id)) : all;
  const requestedScenes = arg('--scenes', '').split(',').filter(Boolean);
  const out = path.resolve(arg('--out', '.tmp/middle-initial'));
  const observationOnly = argv.includes('--baseline-observe');
  const baseURL = arg('--base-url', '');
  const selectedViews = arg('--viewports', '').split(',').filter(Boolean);
  if (selectedViews.some(name => !VIEWPORTS.some(v => v.name === name))) throw Error('Unknown viewport');
  const views = selectedViews.length ? VIEWPORTS.filter(v => selectedViews.includes(v.name)) : VIEWPORTS;
  const themes = arg('--themes', 'board').split(',');
  if (themes.some(x => !['board','paper'].includes(x))) throw Error('Unknown theme');
  fs.mkdirSync(out, { recursive: true });
  const report = { version: 1, kind: observationOnly ? 'BASELINE_INITIAL_FIGURE' : 'CANDIDATE_INITIAL_FIGURE',
    createdAt: new Date().toISOString(), commit: execFileSync('git', ['rev-parse','HEAD'], {cwd:root,encoding:'utf8'}).trim(),
    scope: { discoveredUnits: all.map(l => l.id), selectedUnits: units.map(l => l.id), requestedScenes, viewports: views, themes },
    units: {}, failures: [], limitations: ['Physical devices NOT_RUN.', 'Automated checks never establish semantic/educational visual PASS; independent screenshot review required.', 'Pixel fingerprints are comparison evidence, not image quality verdicts.'],
    visualReview: 'UNKNOWN' };
  let server;
  let base = baseURL;
  if (!base) {
    const mime = {'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
    server = http.createServer((req,res) => {
      const p = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if (!p.startsWith(root + path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile()) {res.writeHead(404).end();return;}
      res.writeHead(200, {'Content-Type':mime[path.extname(p)] || 'application/octet-stream'});fs.createReadStream(p).pipe(res);
    });
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    base = `http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/`;
  }
  if (!base.endsWith('/')) base += '/';
  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH,headless:true} : {headless:true});
  const save = () => fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  try {
    for (const unit of units) {
      const dest = report.units[unit.id] = { course:unit.course,title:unit.title,catalogSceneTotal:unit.sceneTotal,
        source:sourcesFor(root,unit.id),scenes:[],defaultScenes:[],hashEntries:discoverHashEntries(root,unit.id),aliases:[],observations:[],captures:[],comparisons:[],interactions:[],notRun:[] };
      for (const view of views) for (const theme of themes) {
        const context = await browser.newContext({viewport:{width:view.width,height:view.height},deviceScaleFactor:1,hasTouch:!view.name.startsWith('pc')});
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push({type:'pageerror',message:e.message}));
        page.on('console', m => {if(m.type()==='error') errors.push({type:'console-error',message:m.text()});});
        page.on('response', r => {if(r.status()>=400 && r.url().startsWith(base)) errors.push({type:'http',message:`${r.status()} ${r.url()}`});});
        await page.addInitScript(() => {let seed=1701;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};});
        const settle = async () => {
          await page.waitForFunction(() => window.lab && !lab._tween, null, {timeout:15000});
          await page.evaluate(async () => {await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));window.__initialFigureDraws=[];lab.render();});
        };
        const capture = async (scene,state) => {
          const name = `${unit.id}--${scene.id}--${view.name}-${theme}--${state}.png`.replace(/[^\w.-]/g,'_');
          const bytes = await page.screenshot({path:path.join(out,name),fullPage:false});
          const item = {id:scene.id,view:view.name,theme,state,file:name,sha256:sha(bytes),sourceDigest:dest.source.digest};
          dest.captures.push(item);return item;
        };
        const measure = async (scene,state,screenshot=false) => {
          await settle();
          const obs = await page.evaluate(observe), semantic = await page.evaluate(sampleInitialFigure);
          const row = {id:scene.id,view:view.name,theme,state,...obs,semantic,errors:[...errors]};
          row.issues=initialIssues(obs,scene.id,errors,semantic);
          const expectedTab=state==='problem-initial'?'problem':'explore';
          if(obs.tab!==expectedTab)row.issues.push('selected-tab-mismatch');
          if (screenshot) row.capture=await capture(scene,state);
          dest.observations.push(row);
          if(row.issues.length) report.failures.push({unit:unit.id,id:scene.id,view:view.name,theme,state,issues:row.issues,errors:[...errors]});
          return row;
        };
        try {
          await page.goto(`${base}${unit.id}.html?theme=${theme}&initial-inventory=1`,{waitUntil:'load'});
          await page.waitForFunction(()=>window.lab?.list?.length>0);
          const readScenes = () => page.evaluate(()=>lab.list.map((s,index)=>({id:String(s.id),title:s.title,short:s.short,gi:s.gi,index,groupIndex:s.group.scenes.findIndex(x=>x.id===s.id)})));
          const registered = await readScenes();
          if(new Set(registered.map(s=>s.id+'@'+s.gi)).size!==registered.length) throw Error('Duplicate runtime scene identity');
          if(unit.sceneTotal!==registered.length) report.failures.push({unit:unit.id,view:view.name,reason:'catalog-runtime-count-mismatch',catalog:unit.sceneTotal,runtime:registered.length});
          if(!dest.defaultScenes.length)dest.defaultScenes=registered;
          else if(JSON.stringify(dest.defaultScenes)!==JSON.stringify(registered))throw Error('Default runtime inventory changed between viewports');
          const combined = new Map(registered.map(s=>[s.id+'@'+s.gi,s]));
          for(const entry of dest.hashEntries){
            errors.length=0;
            await page.goto(`${base}${unit.id}.html?theme=${theme}&initial-legacy=${encodeURIComponent(entry.id)}#s=${encodeURIComponent(entry.id)}`,{waitUntil:'load'});
            await page.waitForFunction(()=>window.lab?.list?.length>0);
            await page.evaluate(()=>document.fonts.ready);await page.evaluate(installObservation);await settle();
            const actual=await page.evaluate(()=>String(lab.scene.id));
            const discovered=await readScenes();
            for(const s of discovered)if(!combined.has(s.id+'@'+s.gi))combined.set(s.id+'@'+s.gi,{...s,hashOnly:true});
            if(entry.id!==entry.expectedId){
              const alias={entry:entry.id,expectedId:entry.expectedId,actualId:actual,view:view.name,theme,pass:actual===entry.expectedId};
              dest.aliases.push(alias);
              await measure({id:entry.expectedId},'alias-'+entry.id,true);
              if(!alias.pass)report.failures.push({unit:unit.id,...alias,reason:'legacy-alias-mismatch'});
            }else if(actual!==entry.id)report.failures.push({unit:unit.id,entry:entry.id,actualId:actual,view:view.name,theme,reason:'hash-entry-mismatch'});
          }
          const discoveredScenes=[...combined.values()];
          if(!dest.scenes.length)dest.scenes=discoveredScenes;
          else if(JSON.stringify(dest.scenes)!==JSON.stringify(discoveredScenes))throw Error('Hash-inclusive inventory changed between viewports');
          const scenes=requestedScenes.length?discoveredScenes.filter(s=>requestedScenes.includes(s.id)):discoveredScenes;
          for(const scene of scenes){
            try {
            errors.length=0;
            // A distinct query forces a new document; changing only the hash does
            // not run this app's initial restoration code.
            await page.goto(`${base}${unit.id}.html?theme=${theme}&initial-document=${scene.index}#s=${encodeURIComponent(scene.id+'@'+scene.gi)}`,{waitUntil:'load'});
            await page.waitForFunction(()=>window.lab?.list?.length>0);
            await page.evaluate(()=>document.fonts.ready);
            await page.evaluate(installObservation);
            const first=await measure(scene,'first-entry',true);
            const activeParams = obs => Object.fromEntries(first.declaredControls.map(k=>[k,obs.params[k]]));
            // Follow the actual selected button, including scene/group closure.
            const button=page.locator('.apl-subscenes [aria-selected="true"]');
            if(await button.count())await button.click();
            else await page.locator('.apl-rail [aria-selected="true"]').click();
            await page.evaluate(()=>window.scrollTo(0,0));
            const again=await measure(scene,'reselected');
            dest.comparisons.push({id:scene.id,view:view.name,theme,state:'reselected',pixelsEqual:first.pixelFingerprint===again.pixelFingerprint,
              parametersEqual:JSON.stringify(activeParams(first))===JSON.stringify(activeParams(again)),semanticStatus:again.semantic.status});
            if(first.pixelFingerprint!==again.pixelFingerprint)await capture(scene,'reselected-difference');
            // Visit another registered scene before returning: scene-specific
            // enter hooks must not inherit a previous animation or disclosure.
            await page.evaluate(i=>lab.goScene((i+1)%lab.list.length),first.index);await settle();
            await page.evaluate(i=>lab.goScene(i),first.index);
            const returned=await measure(scene,'returned');
            dest.comparisons.push({id:scene.id,view:view.name,theme,state:'returned',pixelsEqual:first.pixelFingerprint===returned.pixelFingerprint,
              parametersEqual:JSON.stringify(activeParams(first))===JSON.stringify(activeParams(returned)),semanticStatus:returned.semantic.status});
            if(first.pixelFingerprint!==returned.pixelFingerprint)await capture(scene,'returned-difference');
            for(const [state,row]of [['reselected',again],['returned',returned]]){
              if(JSON.stringify(activeParams(first))!==JSON.stringify(activeParams(row)))report.failures.push({unit:unit.id,id:scene.id,view:view.name,theme,state,reason:'active-initial-parameters-not-restored',before:activeParams(first),after:activeParams(row)});
              if(row.playing||row.revealed)report.failures.push({unit:unit.id,id:scene.id,view:view.name,theme,state,reason:'initial-animation-or-answer-state-not-restored'});
            }
            if(first.problemAvailable){
              await page.locator('.apl-tab[aria-controls="apl-pane-problem"]').click();
              await page.evaluate(()=>window.scrollTo(0,0));
              await measure(scene,'problem-initial',true);
              await page.locator('.apl-tab[aria-controls="apl-pane-explore"]').click();
              await page.evaluate(()=>window.scrollTo(0,0));
              await measure(scene,'explore-return');
            }
            // Risk-based animation sampling, explicitly recorded per scene.
            if(!observationOnly && ['pc','small-mobile'].includes(view.name)){
              await page.evaluate(i=>lab.goScene(i),first.index);await settle();
              const control=await page.evaluate(()=>Object.entries(lab._ctls||{}).filter(([,v])=>v.input.checkVisibility()).map(([key,v])=>({key,label:v.input.getAttribute('aria-label')||'',min:+v.input.min,max:+v.input.max})).find(x=>/움직여 보기|애니메이션|펼치기|진행률|분리/.test(x.label))||null);
              if(control){
                for(const [state,fraction] of [['animation-middle',.5],['animation-end',1]]){
                  const value=await page.evaluate(({key,fraction})=>{const input=lab._ctls[key].input,probe=input.cloneNode(false);probe.value=String(+input.min+(+input.max-+input.min)*fraction);return probe.valueAsNumber;},{key:control.key,fraction});
                  await page.getByRole('slider',{name:control.label,exact:true}).fill(String(value));
                  await page.evaluate(()=>window.scrollTo(0,0));
                  await measure(scene,state,true);
                  const actual=await page.evaluate(k=>lab.s[k],control.key),pass=Math.abs(actual-value)<1e-7;
                  dest.interactions.push({id:scene.id,view:view.name,theme,type:'native-progress-slider',state,key:control.key,requested:value,actual,pass});
                  if(!pass)report.failures.push({unit:unit.id,id:scene.id,view:view.name,theme,state,reason:'native-progress-state-mismatch',key:control.key,requested:value,actual});
                }
                const reset=page.locator('.apl-actions-row button').filter({hasText:/^처음으로$/});
                if(await reset.count()){await reset.click();await page.evaluate(()=>window.scrollTo(0,0));const after=await measure(scene,'reset',true);const pass=!after.playing&&Math.abs(after.params[control.key]-first.params[control.key])<1e-7;dest.interactions.push({id:scene.id,view:view.name,theme,type:'native-reset',pass});if(!pass)report.failures.push({unit:unit.id,id:scene.id,view:view.name,theme,state:'reset',reason:'reset-does-not-restore-animation'});}
                else{await page.evaluate(i=>lab.goScene(i),first.index);await measure(scene,'reentry-reset',true);dest.notRun.push({id:scene.id,view:view.name,state:'native-reset',reason:'no-reset-button'});}
              }else dest.notRun.push({id:scene.id,view:view.name,state:'animation-middle/end',reason:'no-visible-progress-slider; existing animation/drag audit covers other controls'});
            }
            } catch(error) {
              report.failures.push({unit:unit.id,id:scene.id,view:view.name,theme,reason:'scene-run-incomplete',message:error.stack});
              dest.notRun.push({id:scene.id,view:view.name,theme,state:'remaining-scene-states',reason:'browser-action-failed'});
            }
            save();
          }
        }catch(error){report.failures.push({unit:unit.id,view:view.name,theme,reason:'run-incomplete',message:error.stack});}
        finally{await context.close();save();}
        console.log(JSON.stringify({unit:unit.id,view:view.name,theme,scenes:dest.scenes.length,observations:dest.observations.length,failures:report.failures.length}));
      }
      // Coverage is checked against runtime registration, never a stale count.
      for(const scene of dest.scenes.filter(s=>!requestedScenes.length||requestedScenes.includes(s.id)))for(const view of views)for(const theme of themes){
        for(const state of ['first-entry','reselected','returned','explore-return']){
          if(state==='explore-return'&&!dest.observations.some(o=>o.id===scene.id&&o.state==='problem-initial'))continue;
          if(!dest.observations.some(o=>o.id===scene.id&&o.view===view.name&&o.theme===theme&&o.state===state))report.failures.push({unit:unit.id,id:scene.id,view:view.name,theme,reason:'missing-required-state',state});
        }
      }
      save();
    }
  }finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));save();}
  report.finishedAt=new Date().toISOString();
  report.automaticStatus=report.failures.length?'FAIL':'PASS';save();
  console.log(JSON.stringify({automaticStatus:report.automaticStatus,failures:report.failures.length,units:Object.keys(report.units).length}));
  if(report.failures.length&&!observationOnly)process.exitCode=1;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)run().catch(e=>{console.error(e);process.exitCode=1;});
