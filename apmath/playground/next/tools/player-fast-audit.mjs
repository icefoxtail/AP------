// Selective one-click player audit. This file is never loaded by student pages.
// --manifest FILE: {targets:[{lab,scene?,gi?,lessonIndices?,views?,capture?,
//                            playback?,normalPlayback?,captureQuestionScroll?,captureAllSamples?,captureStableRestore?,diagnosticLimit?,reason?}]}
// Explicit seeks sample every caption, chapter and animated-track midpoint/end.
// They are NOT continuous playback evidence. Marked playback units additionally
// run the unchanged native requestAnimationFrame player at defaultRate * 10;
// marked normalPlayback units run to the end at the observed student default.
// Outputs are append-only unit JSONL, compact summary and selected screenshots.
// Resume reuses only PASS rows with the same source/configuration fingerprint.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { captureSmokeCalibrationFrame, isObservedAxisDecoration } from './scene-smoke-semantic-calibration.mjs';
import { createScreenshotGuard } from './browser-screenshot-guard.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../../..');
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const opt = (key, fallback) => { const n = args.indexOf(key); return n < 0 ? fallback : args[n + 1]; };
const manifestPath = opt('--manifest');
if (!manifestPath) throw Error('An explicit --manifest FILE is required; no implicit full-repository audit.');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (!Array.isArray(manifest.targets) || !manifest.targets.length) throw Error('Manifest must contain non-empty targets.');
const out = path.resolve(opt('--out', '.tmp/player-fast-audit'));
const qaMultiplier = Number(opt('--multiplier', '10'));
if (!(qaMultiplier > 0 && qaMultiplier <= 20)) throw Error('QA multiplier must be in (0, 20].');
const limit = Number(opt('--limit', 'Infinity'));
const shardText = opt('--shard');
const shard = shardText && /^(\d+)\/(\d+)$/.exec(shardText);
if (shardText && (!shard || +shard[2] < 1 || +shard[1] >= +shard[2])) throw Error('--shard must be k/n with 0 <= k < n.');
const onlyLabs = opt('--only', '').split(',').filter(Boolean);
const explicitViews = opt('--views', '').split(',').filter(Boolean);
const rowFile = path.join(out, 'units.jsonl');
fs.mkdirSync(out, { recursive: true });
const hash = text => createHash('sha256').update(text).digest('hex');
const sourceSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
const filesUnder = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? filesUnder(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const sharedFiles = filesUnder(path.resolve(DIR, '../kit')).filter(f => /\.(js|css|woff2)$/.test(f));
const toolFiles = ['player-fast-audit.mjs', 'scene-smoke-semantic-calibration.mjs', 'browser-screenshot-guard.mjs'].map(f => path.join(DIR, f));
const fingerprint = (lab, observedUrls = []) => {
  const dir = path.resolve(DIR, '../labs', lab);
  const closure = new Set([...sharedFiles, ...toolFiles, dir + '.html', ...(fs.existsSync(dir) ? filesUnder(dir) : [])]);
  // Direct HTML imports cover shared middle-functions sources and aliases such
  // as geom-space-3d.html -> geom-space/lesson-*.js. CSS URLs bind local fonts.
  const pending = [...closure];
  while (pending.length) {
    const file = pending.pop();
    if (!/\.(html|css|js|mjs)$/.test(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const refs = file.endsWith('.html')
      ? [...text.matchAll(/<(?:script|link|img)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi)].map(m=>m[1])
      : file.endsWith('.css')
        ? [...text.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)].map(m=>m[1])
        : [...text.matchAll(/new URL\(\s*["']([^"']+)["']/g)].map(m=>m[1]);
    for (const ref of refs) {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
      const dep = ref.startsWith('/') ? path.resolve(ROOT, '.' + ref.split(/[?#]/)[0]) : path.resolve(path.dirname(file), ref.split(/[?#]/)[0]);
      if (dep.startsWith(ROOT + path.sep) && fs.existsSync(dep) && fs.statSync(dep).isFile() && !closure.has(dep)) { closure.add(dep); pending.push(dep); }
    }
  }
  // Capture script/link resources actually imported by dynamic module loaders.
  // Same-origin browser URLs are mapped back to their checked-out local bytes.
  for (const url of observedUrls) {
    const pathname = decodeURIComponent(new URL(url).pathname), marker = pathname.indexOf('/apmath/');
    const file = path.resolve(ROOT, '.' + (marker >= 0 ? pathname.slice(marker) : pathname));
    if (file.startsWith(ROOT + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) closure.add(file);
  }
  const files = [...closure].sort();
  const sourceFiles = files.map(file => ({ file: path.relative(ROOT, file), sha256: hash(fs.readFileSync(file)) }));
  return { sourceFiles, sha256: hash(JSON.stringify(sourceFiles)) };
};
const views = {
  '390x844': { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  '360x640': { viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  '844x390': { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  '820x1180': { viewport: { width: 820, height: 1180 }, hasTouch: true, deviceScaleFactor: 1 },
  '1024x768': { viewport: { width: 1024, height: 768 }, hasTouch: true, deviceScaleFactor: 1 },
  '1280x820': { viewport: { width: 1280, height: 820 }, hasTouch: false, deviceScaleFactor: 1 },
  '1440x900': { viewport: { width: 1440, height: 900 }, hasTouch: false, deviceScaleFactor: 1 }
};
const targets = manifest.targets.filter(t => !onlyLabs.length || onlyLabs.includes(t.lab));
if (!targets.length) throw Error('No manifest targets match --only.');
for (const t of targets) {
  if (!/^[a-z0-9-]+$/.test(t.lab)) throw Error('Invalid lab id: ' + t.lab);
  for (const v of explicitViews.length ? explicitViews : t.views || ['390x844']) if (!views[v]) throw Error('Unknown viewport: ' + v);
}

let server;
let base = opt('--base');
if (!base) {
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
  server = http.createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const file = path.resolve(ROOT, '.' + pathname);
      if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
      const stat = fs.statSync(file);
      if (!stat.isFile()) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/`;
}
base = base.replace(/\/?$/, '/');
const origins = new URL(base).origin;
const prior = new Map();
if (args.includes('--resume') && fs.existsSync(rowFile)) {
  for (const line of fs.readFileSync(rowFile, 'utf8').trim().split('\n').filter(Boolean)) {
    const row = JSON.parse(line); prior.set(row.key, row);
  }
} else if (fs.existsSync(rowFile) && fs.statSync(rowFile).size) throw Error('Output already has rows; choose a new directory or --resume.');

// Inspect rendered student text only. KaTeX's clipped accessibility duplicate
// and genuinely hidden descendants must not contribute placeholder tokens.
function visibleDataLeaks() {
  const leaks=[];
  const visible=e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true});
  for(const selector of ['.apl-question .q','.apl-vcap .t','.apl-vpin','.apl-vsum','.apl-vans']) {
    for(const e of document.querySelectorAll(selector)) {
      if(!visible(e))continue;
      const parts=[],walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
      let node;
      while(node=walker.nextNode()) {
        const parent=node.parentElement;
        if(!parent||!visible(parent)||parent.closest('.katex-mathml,.apl-sr'))continue;
        const range=document.createRange();range.selectNodeContents(node);
        if([...range.getClientRects()].some(r=>r.width>0&&r.height>0))parts.push(node.textContent);
      }
      const text=parts.join('');
      const hits=[...text.matchAll(/\b(?:undefined|NaN)\b|\[object Object\]/g)].map(m=>({token:m[0],context:text.slice(Math.max(0,m.index-60),m.index+m[0].length+60)}));
      if(hits.length)leaks.push({selector,hits});
    }
  }
  return leaks;
}

// Reuse the existing source-bound canvas glyph/fraction/axis observation. It
// preserves raw clipped labels, while separately identifying proven native axis
// decorations. Pixel presence is not a mathematical/educational quality verdict.
const observeFrame = new Function(`return function observeFrame() {
  ${isObservedAxisDecoration.toString()}
  ${captureSmokeCalibrationFrame.toString()}
  ${visibleDataLeaks.toString()}
  const f = captureSmokeCalibrationFrame(), b = lab.board;
  const outside = g => ![g.x0,g.x1,g.y0,g.y1].every(Number.isFinite) || Math.max(-g.x0,g.x1-b.W,-g.y0,g.y1-b.H)>2;
  const marks = [...f.glyphs,...f.fractionBars], rawClipped = marks.filter(outside);
  const clipped = rawClipped.filter(g => !isObservedAxisDecoration(f,g));
  const rect = e => { const r=e.getBoundingClientRect(); return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; };
  const inViewport = r => r.left>=-2 && r.top>=-2 && r.right<=innerWidth+2 && r.bottom<=innerHeight+2;
  const dom=[];
  for(const selector of ['.apl-vcap .t','.apl-vpin','.apl-vsum','.apl-vans','.apl-vtaskline','.apl-vnext','.apl-vend-btns .apl-vbtn','.apl-lgo','.apl-question .q']) {
    for(const e of document.querySelectorAll(selector)) {
      if(!e.checkVisibility() || !e.getBoundingClientRect().height) continue;
      const r=rect(e), style=getComputedStyle(e), clippedX=e.scrollWidth>e.clientWidth+2 && ['hidden','clip'].includes(style.overflowX);
      const math=[...e.querySelectorAll('.katex')].map(k=>({text:k.textContent.slice(0,100),rect:rect(k)}));
      let scrollable=false; for(let a=e;a && a!==document.body;a=a.parentElement){const s=getComputedStyle(a);if(['auto','scroll'].includes(s.overflowX) && a.scrollWidth>a.clientWidth+2)scrollable=true;}
      dom.push({selector,text:e.textContent.slice(0,240),rect:r,inViewport:inViewport(r),clippedX,scrollable,mathOverflow:math.filter(k=>k.rect.left<r.left-2||k.rect.right>r.right+2)});
    }
  }
  const overlayLabels=[...document.querySelectorAll('.apl-mlabel')].filter(e=>e.checkVisibility()).map(e=>{
    const r=rect(e),layer=e.closest('.apl-labels'),bounds=layer&&rect(layer);
    return {text:e.textContent.slice(0,240),rect:r,layer:bounds,clipped:!bounds||r.left<bounds.left-2||r.right>bounds.right+2||r.top<bounds.top-2||r.bottom>bounds.bottom+2};
  });
  let pixelHash=2166136261;
  for(let i=0;i<f.rgba.length;i+=Math.max(4,Math.round(f.rgba.length/4096/4)*4)){pixelHash^=f.rgba[i];pixelHash=Math.imul(pixelHash,16777619);pixelHash^=f.rgba[i+3];pixelHash=Math.imul(pixelHash,16777619);}
  return {canvas:f.canvas,ink:f.legacy.ink,pixelHash:(pixelHash>>>0).toString(16),glyphs:f.glyphs.length,fractionBars:f.fractionBars.length,
    clipped,rawClipped,axisDecorations:rawClipped.filter(g=>isObservedAxisDecoration(f,g)),dom,overlayLabels,dataLeaks:visibleDataLeaks(),
    katexErrors:[...document.querySelectorAll('.katex-error')].filter(e=>e.checkVisibility()).map(e=>e.textContent),
    documentOverflow:document.documentElement.scrollWidth>innerWidth+2,viewport:{width:innerWidth,height:innerHeight},
    state:{player:lab.video.state,time:lab.video.t,step:lab.s.step,part:lab.s.part,tab:lab.tab,lessonOn:lab.s.lessonOn,dragging:lab.s.dragging},
    caption:lab.video.ui.cap.textContent,captionExpected:!!lab.video.cs&&APLab.videoCore.stateAt(lab.video.cs,lab.video.t,lab.video.base).say>=0,pinCount:lab.video.ui.pins.childElementCount};
}`)();

const summary = { version: 1, sourceSha, manifestSha256: hash(fs.readFileSync(manifestPath)), startedAt: new Date().toISOString(),
  method: 'DETERMINISTIC_NATIVE_SEEK_SAMPLES_PLUS_SELECTED_NATIVE_RAF_PLAYBACK', qaMultiplier, shard:shardText||null,
  visualEducationalQuality: 'NOT_ASSERTED_REQUIRES_INDEPENDENT_REVIEW', base,
  completed: 0, passed: 0, failed: 0, reviewRequired: 0, reused: 0, samples: 0, continuous: [], failures: [], labFailures: [], sourceFiles: {}, rows: [] };
const saveSummary = () => fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
const writeRow = row => { fs.appendFileSync(rowFile, JSON.stringify(row)+'\n'); summary.completed++; summary.samples+=row.samples?.length||0;
  if(row.status==='PASS')summary.passed++;else if(row.status==='REVIEW_REQUIRED')summary.reviewRequired++;else summary.failed++;
  summary.rows.push({key:row.key,status:row.status,failed:row.checks.filter(c=>c.status!=='PASS'),screenshots:row.screenshots});
  if(row.status!=='PASS')summary.failures.push({key:row.key,status:row.status,failed:row.checks.filter(c=>c.status!=='PASS')});
  if(row.continuous)summary.continuous.push(...row.continuous.map(c=>({key:row.key,...c}))); saveSummary(); };
const safe = s => String(s).replace(/[^a-zA-Z0-9@_-]/g,'_');
const {chromium} = require('playwright');
let browser, done=0;
try {
  browser=await chromium.launch(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH,headless:true} : {headless:true});
  for(const labId of [...new Set(targets.map(t=>t.lab))]) {
    const labTargets=targets.filter(t=>t.lab===labId);
    const requestedViews=[...new Set(labTargets.flatMap(t=>explicitViews.length?explicitViews:t.views||['390x844']))];
    for(const view of requestedViews) {
      let context,page,guard,phase='create-context';
      const runtimeErrors=[],resourceErrors=[],warnings=[],screenshotObservations=[];
      try {
      context=await browser.newContext({...views[view],reducedMotion:'no-preference'});
      page=await context.newPage();
      page.on('pageerror',e=>runtimeErrors.push(e.message));
      page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource'))runtimeErrors.push(m.text());if(m.type()==='warning'&&/^\[(해설|영상 대본)\]/.test(m.text()))warnings.push(m.text());});
      page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===origins&&!r.url().endsWith('/favicon.ico'))resourceErrors.push(`HTTP ${r.status()} ${r.url()}`);});
      page.on('requestfailed',r=>{if(new URL(r.url()).origin===origins)resourceErrors.push(`${r.url()} ${r.failure()?.errorText}`);});
      summary.sourceFiles[labId]=fingerprint(labId);
      phase='page-load';
      await page.goto(`${base}${labId}.html?theme=paper`,{waitUntil:'load',timeout:30000});
      phase='player-ready';
      await page.waitForFunction(()=>window.lab?.video&&lab.board&&lab.list.length,null,{timeout:15000});
      await page.evaluate(()=>document.fonts.ready);
      const observedUrls=await page.evaluate(()=>[...new Set([...document.querySelectorAll('script[src],link[href]')].map(e=>e.src||e.href)
        .concat(performance.getEntriesByType('resource').map(e=>e.name)))].filter(url=>new URL(url).origin===location.origin));
      const source=fingerprint(labId,observedUrls);summary.sourceFiles[labId]=source;
      guard=await createScreenshotGuard(page,{expectedTouch:!!views[view].hasTouch,onObservation:o=>screenshotObservations.push(o)});
      phase='unit-enumeration';
      const units=await page.evaluate(()=>lab.list.flatMap((sc,i)=>lab.video.entries(i).map((c,k)=>({i,k,id:String(sc.id),gi:sc.gi,title:sc.title,lessonTitle:c.title,label:c.label,length:c.length,kind:c.kind}))));
      for(const t of labTargets.filter(t=>!explicitViews.length&&t.views&&!t.views.includes(view)?false:true)) if(t.scene!=null&&!units.some(u=>u.id===String(t.scene)&&(t.gi==null||u.gi===t.gi)))throw Error(`Manifest scene has no playable unit: ${labId}:${t.scene}`);
      for(const unit of units) {
        const matches=labTargets.filter(t=>(explicitViews.length||!t.views||t.views.includes(view))&&(t.scene==null||String(t.scene)===unit.id)&&(t.gi==null||t.gi===unit.gi)&&(!t.lessonIndices||t.lessonIndices.includes(unit.k)));
        if(!matches.length)continue;
        const config={capture:matches.some(t=>t.capture),playback:matches.some(t=>t.playback),normalPlayback:matches.some(t=>t.normalPlayback),captureQuestionScroll:matches.some(t=>t.captureQuestionScroll),captureAllSamples:matches.some(t=>t.captureAllSamples),captureStableRestore:matches.some(t=>t.captureStableRestore),diagnosticLimit:Math.min(32,Math.max(2,...matches.map(t=>Number(t.diagnosticLimit)||2))),qaMultiplier,view};
        const key=`${labId}:${unit.id}@${unit.gi}:${unit.k}:${view}`, sourceConfig=hash(JSON.stringify({source:source.sha256,config}));
        if(shard&&parseInt(hash(key).slice(0,8),16)%+shard[2]!==+shard[1])continue;
        const previous=prior.get(key);
        if(previous?.status==='PASS'&&previous.sourceConfig===sourceConfig){summary.reused++;continue;}
        if(done>=limit)break;
        done++;
        const row={key,lab:labId,scene:unit.id,gi:unit.gi,lessonIndex:unit.k,title:unit.lessonTitle,view,sourceConfig,sourceFingerprint:source.sha256,
          status:'RUNNING',startedAt:new Date().toISOString(),reason:matches.map(t=>t.reason).filter(Boolean),checks:[],samples:[],screenshots:[],continuous:[]};
        const check=(name,pass,details)=>row.checks.push({name,status:pass?'PASS':'FAIL',...(pass?{}:{details})});
        const review=(name,details)=>row.checks.push({name,status:'REVIEW_REQUIRED',details});
        const shot=async label=>{const file=`${safe(key)}--${safe(label)}.png`;await guard.capture(()=>page.screenshot({path:path.join(out,file),fullPage:false}),{file,fullPage:false});row.screenshots.push(file);};
        const captureFailed=async(label,from)=>{
          const failed=row.checks.slice(from).filter(c=>c.status!=='PASS').map(c=>c.name);
          if(!failed.length)return;
          row.firstFailureCaptures??=[];
          const prior=row.firstFailureCaptures.find(c=>c.label===label);
          if(prior){prior.checks.push(...failed);return;}
          if(row.firstFailureCaptures.length>=config.diagnosticLimit)return;
          await shot(`diagnostic-${label}`);
          row.firstFailureCaptures.push({label,checks:failed,file:row.screenshots.at(-1)});
        };
        const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
        const stableAspect=async(label)=>{
          await page.locator('.apl-stage').evaluate(e=>Promise.all(e.getAnimations({subtree:true}).filter(a=>Number.isFinite(a.effect?.getComputedTiming().endTime)).map(a=>a.finished.catch(()=>{}))));
          await settle();
          const dimensions=await page.evaluate(()=>{const c=document.querySelector('canvas'),r=c.getBoundingClientRect();return {width:c.width,height:c.height,cssWidth:r.width,cssHeight:r.height,ratioX:c.width/r.width,ratioY:c.height/r.height};});
          const first=row.checks.length;
          check(`${label} canvas bitmap aspect matches displayed canvas`,Math.abs(dimensions.ratioX/dimensions.ratioY-1)<.02,dimensions);
          await captureFailed(`${label}-aspect`,first);
          return dimensions;
        };
        const inspect=async(label,{caption=false,final=false,entry=false}={})=>{
          const checkStart=row.checks.length;
          const f=await page.evaluate(observeFrame); f.label=label;
          check(`${label}: finite usable canvas`,f.canvas.cssWidth>=100&&f.canvas.cssHeight>=80,f.canvas);
          check(`${label}: emitted scene glyphs stay within canvas`,!f.clipped.length,f.clipped);
          check(`${label}: HTML math labels stay inside their clipping layer`,!f.overlayLabels.some(x=>x.clipped),f.overlayLabels.filter(x=>x.clipped));
          check(`${label}: no KaTeX error`,!f.katexErrors.length,f.katexErrors);
          check(`${label}: visible question/caption/answer has no missing-data tokens`,!f.dataLeaks.length,f.dataLeaks);
          check(`${label}: no page horizontal overflow`,!f.documentOverflow,{});
          if(f.ink<200)review(`${label}: low canvas ink needs semantic review`,{ink:f.ink,threshold:200,pixelHash:f.pixelHash});
          const required=f.dom.filter(d=>caption?['.apl-vcap .t','.apl-vpin'].includes(d.selector):final?['.apl-vsum','.apl-vans','.apl-vtaskline','.apl-vnext','.apl-vend-btns .apl-vbtn'].includes(d.selector):entry?['.apl-lgo','.apl-question .q'].includes(d.selector):false);
          // Narrow portrait keeps the final figure and full end card on screen.
          // Native landscape and desktop panels intentionally allow scrolling.
          const portraitEnd=final&&f.viewport.width<=859&&f.viewport.height>=480;
          const bad=required.filter(d=>d.clippedX||(!d.scrollable&&d.mathOverflow.length)||((caption||portraitEnd||entry&&d.selector==='.apl-lgo')&&!d.inViewport));
          check(`${label}: visible caption/formula/entry text is accessible`,!bad.length,bad);
          if(caption&&f.captionExpected)check(`${label}: caption exists`,!!f.caption.trim(),{});
          await captureFailed(label,checkStart);
          return f;
        };
        phase=`unit:${key}`;
        try {
          await page.evaluate(i=>{lab.video.close();lab.video._setExplored(false);lab.goScene(i);window.scrollTo(0,0);},unit.i);
          await settle();
          row.defaultRate=await page.evaluate(()=>lab.video.rate);
          check('student default rate is 1.5',row.defaultRate===1.5,{observed:row.defaultRate});
          row.initial=await inspect('initial',{entry:true});
          check('initial player idle and answer unrevealed',row.initial.state.player==='idle'&&!await page.evaluate(()=>lab.s.revealed),row.initial.state);
          const buttons=await page.locator('.apl-lgo:visible').count();
          check('one entry button per valid lesson',buttons===units.filter(u=>u.i===unit.i).length,{buttons});
          row.parameterBaseline=await page.evaluate(k=>{
            const sc=lab.scene,cs=lab.video.compiled(lab.index,k);
            const controls=(typeof sc.controls==='function'?sc.controls(lab.s):sc.controls)||[];
            return {activeControls:[...new Set([...controls,...Object.keys(lab._ctls||{})])],
              lessonControlled:[...new Set([...Object.keys(cs.tracks),...cs.setKeys])],
              values:Object.fromEntries(Object.entries(lab.params).filter(([,p])=>typeof p.min==='number').map(([key,p])=>{
                const value=lab.s[key];return [key,{value,type:typeof value,inRange:Number.isFinite(value)&&value>=p.min-1e-8&&value<=p.max+1e-8}];
              }))};
          },unit.k);
          if(config.capture)await shot('initial');
          row.questionAccess=await page.evaluate(async keepScroll=>{
            delete window.__playerAuditQuestionScroll;
            const q=[...document.querySelectorAll('.apl-question .q')].find(e=>e.checkVisibility()),footer=[...document.querySelectorAll('.apl-lentry')].find(e=>e.checkVisibility());
            if(!q||!footer||getComputedStyle(footer).position!=='fixed')return {applicable:false};
            const lines=()=>{const a=[];const walker=document.createTreeWalker(q,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){
              if(!n.textContent.trim()||n.parentElement.closest('.katex-mathml'))continue;
              const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects())if(r.width>0&&r.height>2)a.push({left:r.left,right:r.right,top:r.top,bottom:r.bottom});}
              return a.sort((a,b)=>a.bottom-b.bottom).at(-1);};
            const before=lines(),barBefore=footer.getBoundingClientRect();
            if(!before)return {applicable:true,pass:false,reason:'visible-question-text-ranges-missing'};
            if(before.bottom<=barBefore.top+2)return {applicable:true,pass:true,reason:'last-line-already-above-fixed-entry',before,footerTop:barBefore.top};
            const scrollers=[];for(let e=q.parentElement;e;e=e.parentElement){const style=getComputedStyle(e);if(['auto','scroll'].includes(style.overflowY)&&e.scrollHeight>e.clientHeight+1)scrollers.push(e);}
            const doc=document.scrollingElement;if(doc&&!scrollers.includes(doc))scrollers.push(doc);
            const saved=scrollers.map(e=>({e,top:e.scrollTop}));
            for(const {e} of saved)e.scrollTop=e.scrollHeight;
            await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
            const after=lines(),bar=footer.getBoundingClientRect();
            let clipTop=0;for(let e=q.parentElement;e&&e!==document.body;e=e.parentElement)if(['auto','scroll','hidden','clip'].includes(getComputedStyle(e).overflowY))clipTop=Math.max(clipTop,e.getBoundingClientRect().top);
            const result={applicable:true,pass:!!after&&after.bottom<=bar.top+2&&after.top>=clipTop-2,reason:'scrolled-last-question-line',before,after,footerTop:bar.top,clipTop,
              scrollers:saved.map(({e,top})=>({tag:e.tagName,cls:e.className,before:top,after:e.scrollTop,max:e.scrollHeight-e.clientHeight}))};
            if(keepScroll)window.__playerAuditQuestionScroll=saved;
            else for(const {e,top}of saved)e.scrollTop=top;
            await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
            return result;
          },config.captureQuestionScroll);
          const questionCheckStart=row.checks.length;
          if(row.questionAccess.applicable)check('full question can be read above the fixed lesson buttons',row.questionAccess.pass,row.questionAccess);
          await captureFailed('question-access',questionCheckStart);
          if(config.captureQuestionScroll&&row.questionAccess.applicable){
            try{await shot('question-scrolled');row.questionAccess.screenshot=row.screenshots.at(-1);}
            finally{await page.evaluate(()=>{for(const {e,top}of window.__playerAuditQuestionScroll||[])e.scrollTop=top;delete window.__playerAuditQuestionScroll;});await settle();}
          }

          // A frozen QA clock leaves the actual playing layout intact. Every
          // value is set by the native seek/apply API, never by editing lab.s.
          await page.evaluate(({i,k})=>{lab.video.rate=0;lab.video.play(i,k);},unit);
          const samplePlan=await page.evaluate(()=>{
            const cs=lab.video.cs, points=new Map();
            // The native RAF calls finish at length even with a frozen clock.
            // Keep sampled frames before that boundary and inspect finish below.
            const add=(t,why)=>{t=Math.max(0,Math.min(cs.length-.002,Math.round(t*1000)/1000));const key=t.toFixed(3);if(!points.has(key))points.set(key,{time:t,reasons:[]});points.get(key).reasons.push(why);};
            add(0,'initial');add(cs.length-.002,'last-frame-before-finish');
            cs.chapters.forEach((c,i)=>{add(c.at+.001,`chapter-${i+1}-start`);add(c.at+c.length/2,`chapter-${i+1}-middle`);});
            cs.cues.forEach((c,i)=>{add(c.at+.001,`cue-${i+1}`);if(c.to&&c.dur>0){add(c.at+c.dur/2,`motion-${i+1}-middle`);add(c.at+c.dur,`motion-${i+1}-end`);}});
            return [...points.values()].sort((a,b)=>a.time-b.time);
          });
          row.samplePlan=samplePlan;
          for(const p of samplePlan) {
            const applied=await page.evaluate(t=>{lab.video.seek(t);return {lqcSig:lab.s.lqcSig};},p.time);
            await settle();
            const f=await inspect(`t=${p.time}`,{caption:true});
            const stateMatch=await page.evaluate(({labId,applied})=>{
              const v=lab.video,expected=APLab.videoCore.stateAt(v.cs,v.t,v.base),bad=[],derived=[];
              // Native apply intentionally gives set cues precedence over the
              // numeric track/start defaults (e.g. trial slope presets).
              for(const [k,x]of Object.entries({...expected.nums,...expected.sets}))if(typeof x==='number'?(!Number.isFinite(lab.s[k])||Math.abs(lab.s[k]-x)>1e-6):lab.s[k]!==x){
                // Exact documented cache only: common-quadratic.html's draw
                // copies shown.cqSig (stage focus cache) back to s.lqcSig.
                // The reset must still be applied by the native player before
                // draw. Numerical/pedagogical state is never exempted.
                if(labId==='common-quadratic'&&k==='lqcSig'&&x===''&&applied.lqcSig===''&&typeof lab.s[k]==='string')derived.push({key:k,expected:x,afterNativeApply:applied.lqcSig,afterDraw:lab.s[k],contract:'common-quadratic draw focus cache'});
                else bad.push({key:k,expected:x,actual:lab.s[k]});
              }
              if(v.cs.usesStep&&lab.s.step!==expected.step)bad.push({key:'step',expected:expected.step,actual:lab.s.step});
              if(v.cs.usesPart&&lab.s.part!==expected.part)bad.push({key:'part',expected:expected.part,actual:lab.s.part});
              return {bad,derived};
            },{labId,applied});
            const stateCheckStart=row.checks.length;
            check(`t=${p.time}: rendered state remains bound to native timeline`,!stateMatch.bad.length,stateMatch.bad);
            await captureFailed(`t=${p.time}`,stateCheckStart);
            row.samples.push({...p,method:'NATIVE_SEEK_FROZEN_QA_CLOCK',frame:f,...(stateMatch.derived.length?{derivedRenderState:stateMatch.derived}:{})});
            if(config.capture&&(config.captureAllSamples||p.reasons.some(r=>/^chapter-\d+-middle$/.test(r))))await shot(`sample-${p.time}`);
          }
          await page.evaluate(()=>lab.video.finish());await settle();
          await page.locator('.apl-vend:visible').evaluate(e=>Promise.all(e.getAnimations({subtree:true}).filter(a=>Number.isFinite(a.effect.getComputedTiming().endTime)).map(a=>a.finished.catch(()=>{}))));
          row.finalAspect=await stableAspect('ended');
          row.final=await inspect('seek-ended',{final:true});
          check('native finish shows end card',await page.locator('.apl-vend:visible').count()===1,{});
          if(config.capture)await shot('ended');
          row.parameterBeforeClose=await page.evaluate(()=>{
            const values=Object.fromEntries(Object.keys(lab.params).map(k=>[k,lab.s[k]]));
            lab.video.close();return values;
          });await settle();
          const restore=await page.evaluate(({baseline,beforeClose})=>{
            const sc=lab.scene,controls=(typeof sc.controls==='function'?sc.controls(lab.s):sc.controls)||[];
            const activeControls=[...new Set([...controls,...Object.keys(lab._ctls||{})])];
            const active=new Set([...baseline.activeControls,...activeControls]),lesson=new Set(baseline.lessonControlled);
            const assessed=new Set([...active,...lesson]);
            const parameters=Object.entries(lab.params).filter(([,p])=>typeof p.min==='number').map(([key,p])=>{
              const value=lab.s[key],initial=baseline.values[key];
              return {key,value,type:typeof value,min:p.min,max:p.max,inRange:Number.isFinite(value)&&value>=p.min-1e-8&&value<=p.max+1e-8,
                initial,beforeClose:beforeClose[key],changedOnClose:!Object.is(value,beforeClose[key]),
                changedFromInitial:!initial||typeof value!==initial.type||!Object.is(value,initial.value)};
            });
            // Registry min/max describes the UI range. It is not proof that a
            // pre-existing inactive lesson value is mathematically invalid.
            const inactiveLesson=parameters.filter(p=>!active.has(p.key)&&lesson.has(p.key));
            const lessonReview=inactiveLesson.filter(p=>Number.isFinite(p.value)&&p.changedFromInitial&&(!p.inRange||p.changedOnClose)).map(p=>({...p,status:'REVIEW_REQUIRED',reason:!p.inRange?'NEW_OR_CHANGED_VALUE_OUTSIDE_SLIDER_INPUT_RANGE':'NONINTERACTIVE_LESSON_VALUE_CHANGED_ON_CLOSE'}));
            return {state:lab.video.state,raf:lab.video._raf,tab:lab.tab,dragging:lab.s.dragging,lessonOn:lab.s.lessonOn,
              videoClass:document.body.classList.contains('apl-vid'),pins:lab.video.ui.pins.childElementCount,
              parameterScope:{contract:'ACTIVE_CONTROL_RANGE_AND_BASELINE_RELATIVE_LESSON_VALUES',initialActiveControls:baseline.activeControls,restoredActiveControls:activeControls,lessonControlled:baseline.lessonControlled,assessedNumericParameters:parameters.filter(p=>assessed.has(p.key)).map(p=>p.key)},
              bad:parameters.filter(p=>active.has(p.key)&&!p.inRange||lesson.has(p.key)&&!Number.isFinite(p.value)),
              existingInactiveLessonRange:inactiveLesson.filter(p=>Number.isFinite(p.value)&&!p.inRange&&!p.changedFromInitial).map(p=>({...p,status:'EXISTING_INACTIVE_LESSON_VALUE_OUTSIDE_SLIDER_INPUT_RANGE',restorationDamage:false})),
              lessonReview,
              inactiveLessonChanged:inactiveLesson.filter(p=>p.changedFromInitial).map(p=>({...p,status:lessonReview.some(r=>r.key===p.key)?'REVIEW_REQUIRED':'OBSERVED_PROGRAMMATIC_LESSON_VALUE'})),
              inactiveBad:parameters.filter(p=>!assessed.has(p.key)&&!p.inRange).map(p=>({...p,status:'NOT_ASSESSED_INACTIVE_REGISTRY_PARAMETER'})),
              inactiveChanged:parameters.filter(p=>!assessed.has(p.key)&&p.changedFromInitial).map(p=>({...p,status:'NOT_ASSESSED_INACTIVE_REGISTRY_PARAMETER'})),
              mismatch:Object.entries(lab._ctls||{}).filter(([k,c])=>!Number.isFinite(lab.s[k])||Math.abs(+c.input.value-lab.s[k])>(+c.input.step||.001)/2+1e-6).map(([k,c])=>({key:k,state:lab.s[k],slider:c.input.value}))};
          },{baseline:row.parameterBaseline,beforeClose:row.parameterBeforeClose});
          row.restore=restore;
          const restoreCheckStart=row.checks.length;
          check('close restores idle/explore, releases lesson state and pins',restore.state==='idle'&&restore.raf===0&&restore.tab==='explore'&&!restore.dragging&&restore.lessonOn===undefined&&!restore.videoClass&&restore.pins===0,restore);
          check('restored parameters and sliders valid',!restore.bad.length&&!restore.mismatch.length,restore);
          if(restore.lessonReview.length)review('inactive lesson parameter changes need semantic review',restore.lessonReview);
          await captureFailed('restored',restoreCheckStart);
          if(config.capture)await shot('restored');
          // All lessons share the close/layout lifecycle. Measure every restored
          // bitmap; retain additional screenshots only for selected visual risks.
          row.stableRestore=await stableAspect('stable restored');
          if(config.captureStableRestore)await shot('restored-stable');
          // Actual playback is kept separate from seek/finish coverage.
          for(const multiplier of [...(config.playback?[qaMultiplier]:[]),...(config.normalPlayback?[1]:[])]){
            await page.evaluate(({i,rate})=>{lab.video.close();lab.video._setExplored(false);lab.goScene(i);lab.video.rate=rate;}, {i:unit.i,rate:row.defaultRate*multiplier});
            await settle();
            const started=Date.now();
            await page.locator('.apl-lgo:visible').nth(unit.k).click();
            await page.waitForFunction(()=>lab.video.state==='playing',null,{timeout:5000});
            const trace=await page.evaluate(()=>{
              const v=lab.video,trace=window.__fastAuditTrace={frames:0,first:null,last:0,maximumJump:0,seenCaptions:[],seenChapters:[],finished:false};
              const poll=()=>{trace.frames++;const t=v.t;if(trace.first===null)trace.first=t;trace.maximumJump=Math.max(trace.maximumJump,t-trace.last);trace.last=t;
                const say=APLab.videoCore.stateAt(v.cs,t,v.base).say,ch=APLab.videoCore.chapterAt(v.cs,t);
                if(!trace.seenCaptions.includes(say))trace.seenCaptions.push(say);if(!trace.seenChapters.includes(ch))trace.seenChapters.push(ch);
                if(v.state==='ended'){trace.finished=true;return;}requestAnimationFrame(poll);};requestAnimationFrame(poll);return {length:v.cs.length,says:v.cs.says.length,chapters:v.cs.chapters.length,rate:v.rate};
            });
            await page.waitForFunction(()=>lab.video.state==='ended',null,{timeout:Math.max(10000,unit.length/(row.defaultRate*multiplier)*1500+8000)});
            const metrics=await page.evaluate(()=>window.__fastAuditTrace);
            const played={method:'NATIVE_RAF_PLAYBACK',multiplier,rate:trace.rate,duration:unit.length,wallMs:Date.now()-started,...metrics};
            row.continuous.push(played);
            check(`${multiplier}x native playback reaches ended`,metrics.finished&&metrics.last>=unit.length-1e-6,played);
            check(`${multiplier}x native playback observes every caption and chapter`,metrics.seenCaptions.filter(x=>x>=0).length===trace.says&&metrics.seenChapters.length===trace.chapters,{...trace,...metrics});
            if(multiplier===1){
              await page.locator('.apl-vend:visible').evaluate(e=>Promise.all(e.getAnimations({subtree:true}).filter(a=>Number.isFinite(a.effect.getComputedTiming().endTime)).map(a=>a.finished.catch(()=>{}))));
              row.normalFinal=await inspect('normal-ended',{final:true});
            }
            await page.evaluate(()=>lab.video.close());await settle();
          }
          if(config.playback||config.normalPlayback){
            // Representative UI regression: real buttons and trusted keyboard
            // scrubbing, separate from the fast seek coverage above.
            await page.evaluate(({i,k,rate})=>{lab.video.rate=rate;lab.video.play(i,k);},{...unit,rate:row.defaultRate});
            await page.waitForFunction(()=>lab.video.t>.9,null,{timeout:5000});
            await page.locator('.apl-vmini:visible').click();
            const paused=await page.evaluate(()=>({time:lab.video.t,state:lab.video.state,raf:lab.video._raf}));
            await page.waitForTimeout(220);
            const frozen=await page.evaluate(()=>({time:lab.video.t,state:lab.video.state,raf:lab.video._raf}));
            check('normal UI pause freezes native clock',paused.state==='paused'&&frozen.state==='paused'&&frozen.raf===0&&Math.abs(frozen.time-paused.time)<1e-9,{paused,frozen});
            await page.locator('.apl-vrange:visible').press('End');await settle();
            const forward=await page.evaluate(()=>({time:lab.video.t,length:lab.video.cs.length,state:lab.video.state,pins:lab.video.ui.pins.childElementCount}));
            check('trusted forward scrub reaches final timeline while paused',forward.state==='paused'&&Math.abs(forward.time-forward.length)<1e-6,forward);
            await page.locator('.apl-vrange:visible').press('Home');await settle();
            const rewind=await page.evaluate(()=>({time:lab.video.t,state:lab.video.state,pins:lab.video.ui.pins.childElementCount,expectedPins:APLab.videoCore.pinnedAt(lab.video.cs,0).length,
              controlled:JSON.stringify({...Object.fromEntries(Object.keys(lab.video.cs.tracks).map(k=>[k,lab.s[k]])),...Object.fromEntries(lab.video.cs.setKeys.map(k=>[k,lab.s[k]])),...(lab.video.cs.usesStep?{step:lab.s.step}:{}),...(lab.video.cs.usesPart?{part:lab.s.part}:{})})}));
            check('trusted rewind removes future captions/pins',rewind.time===0&&rewind.state==='paused'&&rewind.pins===rewind.expectedPins,rewind);
            await page.locator('.apl-vctl [aria-label="다시 보기"]:visible').click();
            // Let the real replay initialize/render before testing rewind. A
            // synchronous pause before its first RAF tests an artificial event
            // ordering, not the student's replay button path.
            await page.waitForFunction(()=>lab.video.state==='playing'&&lab.video.t>.12,null,{timeout:5000});
            await page.evaluate(()=>{lab.video.pause();lab.video.seek(0);});await settle();
            const replay=await page.evaluate(()=>JSON.stringify({...Object.fromEntries(Object.keys(lab.video.cs.tracks).map(k=>[k,lab.s[k]])),...Object.fromEntries(lab.video.cs.setKeys.map(k=>[k,lab.s[k]])),...(lab.video.cs.usesStep?{step:lab.s.step}:{}),...(lab.video.cs.usesPart?{part:lab.s.part}:{})}));
            check('replay starts with same controlled values as rewind',replay===rewind.controlled,{rewind:rewind.controlled,replay});
            await page.waitForFunction(()=>performance.now()-lab.video._startedAt>500);
            await page.locator('.apl-vctl .primary:visible').click();
            await page.waitForFunction(()=>lab.video.state==='playing'&&lab.video.t>.25,null,{timeout:5000});
            check('normal UI resume advances native clock',true);
            const midClosePrepared=await page.evaluate(()=>{
              lab.video.pause();const cs=lab.video.cs,half=cs.length/2;
              const candidates=[half,...cs.says.map(s=>(s.at+s.end)/2)];
              const time=candidates.find(t=>t>0&&t<cs.length&&APLab.videoCore.pinnedAt(cs,t).length>0)??half;
              lab.video.seek(time);return {time,expectedPins:APLab.videoCore.pinnedAt(cs,time).length};
            });await settle();
            midClosePrepared.actualPins=await page.evaluate(()=>lab.video.ui.pins.childElementCount);
            check('mid-close pin setup matches compiled timeline',midClosePrepared.actualPins===midClosePrepared.expectedPins,midClosePrepared);
            await page.locator('.apl-vctl [aria-label="영상 닫고 직접 해 보기"]:visible').click();await settle();
            const midCloseAspect=await stableAspect('mid-close restored');
            const midClose=await page.evaluate(()=>({state:lab.video.state,raf:lab.video._raf,tab:lab.tab,dragging:lab.s.dragging,lessonOn:lab.s.lessonOn,pins:lab.video.ui.pins.childElementCount,
              mismatch:Object.entries(lab._ctls||{}).filter(([k,c])=>Math.abs(+c.input.value-lab.s[k])>(+c.input.step||.001)/2+1e-6).map(([k])=>k)}));
            check('mid-chapter UI close restores exploration',midClose.state==='idle'&&midClose.raf===0&&midClose.tab==='explore'&&!midClose.dragging&&midClose.lessonOn===undefined&&!midClose.pins&&!midClose.mismatch.length,midClose);
            // Next uses the native end card but no extra continuous-play claim.
            await page.evaluate(({i,k})=>{lab.video.rate=0;lab.video.play(i,k);lab.video.finish();},unit);await settle();
            const next=await page.evaluate(()=>lab.video.nextTarget());
            await page.locator('.apl-vnext:visible').click();await settle();
            const nextState=await page.evaluate(()=>({index:lab.video.index,lessonIndex:lab.video.lessonIndex,state:lab.video.state,toc:!!lab.toc?.isOpen}));
            check('end-card next opens the correct following lesson or contents',next?nextState.index===next.i&&nextState.lessonIndex===next.k&&nextState.state==='playing':nextState.state==='idle'&&nextState.toc,{expected:next,actual:nextState});
            await page.evaluate(()=>{lab.video.close();if(lab.toc?.isOpen)lab.toc.close();});await settle();
            row.controls={method:'NATIVE_UI_BUTTONS_AND_TRUSTED_KEYBOARD_RANGE',paused,frozen,forward,rewind,replay,midClosePrepared,midCloseAspect,midClose,next,nextState};
          }
          await page.evaluate(rate=>{lab.video.rate=rate;},row.defaultRate);
          check('no page runtime/resource/invalid-script errors',!runtimeErrors.length&&!resourceErrors.length&&!warnings.length,{runtimeErrors,resourceErrors,warnings});
        } catch(error){row.error=String(error?.stack||error);check('execution completed',false,row.error);try{await shot('failure');}catch{}}
        finally{try{await page.evaluate(()=>{lab.video.close();lab.video.rate=1.5;});}catch{}}
        row.finishedAt=new Date().toISOString();
        row.status=row.checks.some(c=>c.status==='FAIL')?'FAIL':row.checks.some(c=>c.status==='REVIEW_REQUIRED')?'REVIEW_REQUIRED':'PASS';
        writeRow(row);console.log(`${row.status} ${key} samples=${row.samples.length} checks=${row.checks.length}`);
      }
      }catch(error){
        const failure={lab:labId,view,phase,status:'NOT_COMPLETED',error:String(error?.stack||error),runtimeErrors,resourceErrors,warnings,at:new Date().toISOString(),targets:labTargets};
        if(page){
          try{failure.page=await page.evaluate(()=>({url:location.href,title:document.title,body:document.body?.innerText?.slice(0,4000),labType:typeof window.lab,labVideo:!!window.lab?.video,sceneCount:window.lab?.list?.length}));}catch{}
          try{const file=`${safe(labId)}--${view}--lab-failure.png`;await page.screenshot({path:path.join(out,file),fullPage:false,timeout:5000});failure.screenshot=file;}catch{}
        }
        summary.labFailures.push(failure);
        fs.appendFileSync(path.join(out,'lab-failures.jsonl'),JSON.stringify(failure)+'\n');
        saveSummary();console.error(`LAB_FAILURE ${labId}:${view} ${phase}: ${failure.error}`);
      }finally{
        summary.screenshotEnvironmentObservations=(summary.screenshotEnvironmentObservations||[]).concat(screenshotObservations);
        try{await guard?.close();}catch{}try{await context?.close();}catch{}
      }
      if(done>=limit)break;
    }
    if(done>=limit)break;
  }
}catch(error){summary.fatalError=String(error?.stack||error);console.error(summary.fatalError);}
finally{await browser?.close();if(server)await new Promise(r=>server.close(r));summary.finishedAt=new Date().toISOString();summary.limited=done>=limit;
  summary.executionStatus=summary.fatalError&&summary.completed===0?'BLOCKED':summary.fatalError||summary.labFailures.length||summary.limited?'PARTIAL':'COMPLETE';
  summary.status=summary.executionStatus==='BLOCKED'?'NOT_RUN':summary.fatalError||summary.labFailures.length||summary.failed?'FAIL':summary.limited?'PARTIAL':summary.reviewRequired?'REVIEW_REQUIRED':'PASS';saveSummary();}
console.log(JSON.stringify({status:summary.status,completed:summary.completed,reused:summary.reused,samples:summary.samples,failed:summary.failed,reviewRequired:summary.reviewRequired,summary:path.join(out,'summary.json')}));
if(['FAIL','NOT_RUN'].includes(summary.status))process.exitCode=1;
