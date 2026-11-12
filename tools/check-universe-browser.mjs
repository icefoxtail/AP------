#!/usr/bin/env node
// Real DOM/pointer journeys against the exact local repository over HTTP.
// The test API only exposes observations; it never drives product navigation.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const args = process.argv.slice(2);
function option(name, fallback) {
  const at = args.indexOf(name);
  if (at < 0) return fallback;
  if (!args[at + 1] || args[at + 1].startsWith('--')) throw Error(`Missing ${name} value`);
  return args[at + 1];
}
const root = path.resolve(option('--root', '.'));
const baselineRoot = option('--baseline', '') ? path.resolve(option('--baseline', '')) : null;
const output = path.resolve(option('--out', '.tmp/universe-browser'));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const errorText = error => String(error?.stack || error?.message || error);
const html = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const mime = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf' };
const report = {
  schemaVersion: 'APMATH_UNIVERSE_BROWSER_V1', startedAt: new Date().toISOString(),
  rendererPolicy: 'SOFTWARE_WEBGL2_ANGLE_SWIFTSHADER', physicalGpuPerformance: 'NOT_RUN',
  initialFramePolicy: 'First stable rendered state after startup; not every compositor frame',
  visualEquivalence: 'REVIEW_REQUIRED', baselineTiming: 'Same seed and viewport; ambient wall-clock phases may differ. No automatic pixel equivalence verdict.',
  execution: { runId: process.env.GITHUB_RUN_ID || null, runAttempt: process.env.GITHUB_RUN_ATTEMPT || null },
  mathWaitPolicy: 'PC duality progress: 90 seconds wall time; mobile: 20 seconds. Thresholds and normal animated scenes are unchanged.',
  resourcePolicy: '20 real DOM round trips after warm-up: PC reduced-motion resource phase; mobile normal-animation phase. Sample only after every family has detailedObjects=0.',
  profiles: [], screenshots: [], failures: [],
};
fs.mkdirSync(path.join(output, 'screenshots'), { recursive: true });
function evidence() {
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  const cards = report.screenshots.map(s => `<figure><img src="${html(s.file)}" alt="${html(s.label)}"><figcaption>${html(s.label)}<br>${html(s.revision)}<br>${html(s.viewport.width)} × ${html(s.viewport.height)} · ${html(s.sha256)}</figcaption></figure>`).join('\n');
  fs.writeFileSync(path.join(output, 'gallery.html'), `<!doctype html><meta charset="utf-8"><title>AP Math Universe browser evidence</title><style>body{font:16px system-ui;background:#10121a;color:#eee;margin:30px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}figure{margin:0}img{width:100%;height:auto}figcaption{padding:10px;overflow-wrap:anywhere;font-size:12px}</style><h1>AP Math Universe · actual browser evidence</h1><p>Software WebGL2. Technical checks are in report.json. These images require visual review and are not a physical GPU benchmark.</p><main>${cards}</main>`);
}
function assert(condition, message, details) {
  if (!condition) throw Error(`${message}${details === undefined ? '' : `: ${JSON.stringify(details)}`}`);
}
function progress(record, stage, details = {}) {
  const event={at:new Date().toISOString(),elapsedSeconds:Number(((Date.now()-Date.parse(record.startedAt))/1000).toFixed(3)),profile:record.name,kind:record.kind,stage,...details};
  record.events.push(event);
  console.log(`[universe] ${JSON.stringify(event)}`);
  evidence();
}
function bindSource(directory, expected, label) {
  const revision = execFileSync('git', ['-C', directory, 'rev-parse', 'HEAD'], { encoding:'utf8' }).trim();
  if (expected) assert(/^[a-f0-9]{40}$/i.test(expected) && expected === revision, `${label} revision mismatch`, { expected, revision });
  const files = ['apmath/playground/index.html', 'apmath/js/student-navigation.js', 'apmath/css/student-navigation.css'];
  function walk(dir) {
    for (const ent of fs.readdirSync(path.join(directory, dir), { withFileTypes:true })) {
      const rel = `${dir}/${ent.name}`;
      if (ent.isDirectory()) walk(rel); else if (ent.isFile()) files.push(rel);
    }
  }
  walk('apmath/playground/universe');
  return { revision, files:files.sort().map(file => ({ path:file, bytes:fs.statSync(path.join(directory,file)).size, sha256:sha256(fs.readFileSync(path.join(directory,file))) })) };
}
async function serve(directory) {
  const realRoot = fs.realpathSync(directory);
  const server = http.createServer((req, res) => {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      if (!pathname.startsWith('/AP------/')) { res.writeHead(404); res.end(); return; }
      let relative = pathname.slice('/AP------/'.length);
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      const file = path.resolve(realRoot, relative), relation = path.relative(realRoot, file);
      if (!relation || relation.startsWith('..') || path.isAbsolute(relation) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
      const resolvedRelation = path.relative(realRoot, fs.realpathSync(file));
      if (resolvedRelation.startsWith('..') || path.isAbsolute(resolvedRelation)) { res.writeHead(403); res.end(); return; }
      res.writeHead(200, { 'Content-Type':`${mime[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control':'no-store' });
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(400); res.end(); }
  });
  await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
  return { origin:`http://127.0.0.1:${server.address().port}`, close:()=>new Promise(resolve=>server.close(resolve)) };
}
const profiles = [
  { name:'pc', viewport:{width:1440,height:900}, resize:{width:1024,height:768}, hasTouch:false, isMobile:false },
  { name:'mobile', viewport:{width:390,height:844}, resize:{width:390,height:667}, hasTouch:true, isMobile:true },
];
const selectors = { circle:'.celestial-pill[data-celestial="circle-sector"]', polyhedra:'.celestial-pill[data-celestial="polyhedra"]', tangent:'button[data-concept="two-tangents"]', cube:'button[data-concept="cube-octahedron"]', dodeca:'button[data-concept="dodecahedron-icosahedron"]', back:'#btnExploreBack', home:'#btnUniverseHome', replay:'#btnReplayConcept', pause:'#btnPauseConcept', seek:'#conceptSeek', hideHud:'#btnToggleHud', restoreHud:'#btnRestoreHud' };
const mode = state => state.route?.kind || state.mode;
async function state(page) { return page.evaluate(()=>window.__APMathUniverse.getState()); }
async function debug(page) { return page.evaluate(()=>window.__APMathUniverse.getDebugState()); }
async function waitForMathTime(page, threshold, timeout, record, label) {
  const started=Date.now(), observation={label,threshold,timeoutMs:timeout,startedAt:new Date().toISOString(),samples:[],status:'RUNNING'};
  record.mathProgress.push(observation);
  progress(record,'math:start',{label,threshold,timeoutMs:timeout});
  let lastLog=0;
  try {
    while(true) {
      const d=await debug(page), elapsedMs=Date.now()-started;
      const sample={at:new Date().toISOString(),elapsedMs,conceptId:d.conceptId,mathTime:d.mathTime,mathPlaying:d.mathPlaying,transitioning:d.transitioning,frame:d.renderer?.frame};
      observation.samples.push(sample);
      assert(Number.isFinite(d.mathTime)&&Number.isInteger(sample.frame),'Mathematical progress observation is invalid',sample);
      assert(d.mode==='concept'&&d.transitioning===false,'Mathematical progress left the settled concept',sample);
      assert(elapsedMs<=timeout,'Mathematical progress timed out',{label,threshold,timeoutMs:timeout,first:observation.samples[0],last:sample});
      if(d.mathTime>threshold) {
        observation.status='PASS';observation.completedAt=sample.at;
        progress(record,'math:complete',{label,...sample});return;
      }
      assert(d.mathPlaying===true,'Mathematical timeline stopped before its required observation point',sample);
      if(elapsedMs-lastLog>=10000) { progress(record,'math:progress',{label,...sample});lastLog=elapsedMs; }
      await page.waitForTimeout(Math.min(1000,timeout-elapsedMs));
    }
  } catch(error) {
    observation.status='FAIL';observation.error=errorText(error);observation.completedAt=new Date().toISOString();
    progress(record,'math:failed',{label,error:observation.error,last:observation.samples.at(-1)});throw error;
  }
}
const routeIdentity = value => JSON.stringify({mode:mode(value),celestialId:value.celestialId,conceptId:value.conceptId});
async function ready(page) {
  await page.waitForFunction(()=>typeof window.__APMathUniverse?.getState==='function'&&typeof window.__APMathUniverse?.getDebugState==='function',null,{timeout:45000});
}
async function settled(page, kind, conceptId) {
  await page.waitForFunction(({kind,conceptId})=>{
    const s=window.__APMathUniverse?.getState?.();
    return s && (s.route?.kind || s.mode)===kind && s.transitioning===false && (!conceptId || s.conceptId===conceptId || s.route?.conceptId===conceptId);
  }, {kind,conceptId}, {timeout:30000});
  await page.waitForFunction(()=>Number(window.__APMathUniverse.getDebugState()?.renderer?.calls)>0, null, {timeout:30000});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert(await page.locator('.webgl-fallback').count()===0, 'WebGL fallback is present');
  assert(await page.evaluate(()=>location.hash)==='#g8', 'Exploration overwrote the grade hash');
  assert(await page.evaluate(()=>new URL(location.href).searchParams.get('student_id'))==='universe-qa', 'Exploration lost the synthetic student context');
}
async function press(page, selector, touch) {
  const target=page.locator(selector);
  await target.waitFor({state:'visible',timeout:20000});
  await target.scrollIntoViewIfNeeded();
  if(touch) await target.tap({timeout:20000}); else await target.click({timeout:20000});
}
async function webgl(page) {
  return page.evaluate(()=>{
    const canvas=document.querySelector('#space');
    const gl=canvas?.getContext('webgl2');
    if(!gl)return {available:false};
    const ext=gl.getExtension('WEBGL_debug_renderer_info');
    return {available:true,lost:gl.isContextLost(),version:gl.getParameter(gl.VERSION),renderer:gl.getParameter(gl.RENDERER),unmaskedRenderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null,canvas:{width:canvas.width,height:canvas.height},error:gl.getError()};
  });
}
function pngStats(buffer) {
  const p=PNG.sync.read(buffer), bins=new Set();let n=0,mean=0,m2=0;
  for(let y=0;y<p.height;y+=8)for(let x=0;x<p.width;x+=8){
    const i=(y*p.width+x)*4, v=.2126*p.data[i]+.7152*p.data[i+1]+.0722*p.data[i+2];
    bins.add((p.data[i]>>4)*256+(p.data[i+1]>>4)*16+(p.data[i+2]>>4));
    n++;const delta=v-mean;mean+=delta/n;m2+=delta*(v-mean);
  }
  return {width:p.width,height:p.height,meanLuminance:mean,luminanceStdDev:Math.sqrt(m2/n),sampledColorBins:bins.size};
}
async function capture(page, guard, label, revision, record) {
  const file=`screenshots/${label}.png`, absolute=path.join(output,file);
  const started=Date.now(),startedAt=new Date().toISOString();
  const sceneObservation=await page.evaluate(()=>{
    const api=window.__APMathUniverse;if(!api)return null;
    const s=api.getState(),d=api.getDebugState();
    return {route:s.route,mathTime:s.mathTime,mathPlaying:s.mathPlaying,reducedMotion:s.reducedMotion,rendererFrame:d.renderer?.frame};
  });
  progress(record,'capture:start',{label,sceneObservation});
  const result=await guard.capture(()=>page.screenshot({path:absolute,fullPage:false,timeout:60000}),{fullPage:false,label});
  const pixels=pngStats(result.value);
  assert(pixels.sampledColorBins>8 && pixels.luminanceStdDev>1, 'Captured frame is empty or nearly uniform',pixels);
  const item={label,file,revision,viewport:page.viewportSize(),sha256:sha256(result.value),pixels,startedAt,capturedAt:new Date().toISOString(),wallMs:Date.now()-started,sceneObservation};
  report.screenshots.push(item);record.captures.push(item);progress(record,'capture:complete',{label,wallMs:item.wallMs});return item;
}
async function captureConceptTime(page,guard,record,label,seconds) {
  const slider=page.locator(selectors.seek);
  await slider.waitFor({state:'visible'});
  const min=Number(await slider.getAttribute('min')),max=Number(await slider.getAttribute('max')),step=Number(await slider.getAttribute('step'));
  assert(step>0&&seconds>=min&&seconds<=max,'Requested visual checkpoint is outside the DOM range',{seconds,min,max,step});
  const fromEnd=seconds>(min+max)/2,count=Math.round(Math.abs((fromEnd?max:min)-seconds)/step);
  assert(count<=160,'Unexpected range precision for visual checkpoint',{seconds,step,count});
  const conceptId=(await state(page)).conceptId;
  progress(record,'scrub:start',{label,conceptId,seconds,input:'DOM range keyboard'});
  await slider.focus();await slider.press(fromEnd?'End':'Home');
  for(let i=0;i<count;i++)await slider.press(fromEnd?'ArrowLeft':'ArrowRight');
  await page.waitForFunction(({seconds,conceptId})=>{
    const s=window.__APMathUniverse.getState();return s.conceptId===conceptId&&!s.mathPlaying&&Math.abs(s.mathTime-seconds)<.001;
  },{seconds,conceptId},{timeout:15000});
  await settled(page,'concept',conceptId);
  record.scrubChecks.push({conceptId,seconds,input:'DOM range keyboard',value:await slider.inputValue()});
  await capture(page,guard,label,report.candidate.revision,record);
}
async function checkLabels(page, expectedCount, record, label) {
  const boxes=await page.locator('button[data-concept]').evaluateAll(elements=>elements.filter(e=>{
    const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.visibility!=='hidden'&&c.display!=='none'&&Number(c.opacity)>0&&r.width>0&&r.height>0;
  }).map(e=>{const r=e.getBoundingClientRect();return{id:e.dataset.concept,x:r.x,y:r.y,width:r.width,height:r.height};}));
  const viewport=page.viewportSize();
  assert(new Set(boxes.map(b=>b.id)).size===expectedCount, 'Missing or duplicate visible concept labels',{label,boxes});
  for(const b of boxes){
    assert(b.x>=-1&&b.y>=-1&&b.x+b.width<=viewport.width+1&&b.y+b.height<=viewport.height+1,'Concept label clipped by viewport',{label,...b,viewport});
    assert(b.width>=24&&b.height>=24,'Concept hit label is smaller than the minimum test bound',{label,...b});
  }
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const a=boxes[i],b=boxes[j];const overlapX=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x),overlapY=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
    assert(!(overlapX>1&&overlapY>1),'Concept label hit regions overlap',{label,a,b,overlapX,overlapY});
  }
  record.labelChecks.push({label,viewport,boxes});
}
async function checkBlankAndHudRestore(page, record) {
  const before=await state(page), identity=routeIdentity(before), url=page.url();
  // A freshly fitted PC galaxy reserves 40 px at each side. Exercise the real
  // canvas in that empty margin, not an overlay that might swallow the click.
  const blank={x:16,y:Math.round(page.viewportSize().height/2)};
  assert(await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.id==='space',blank),'Blank-space probe is covered by UI',blank);
  await page.mouse.click(blank.x,blank.y);await settled(page,'galaxy');
  assert(routeIdentity(await state(page))===identity&&page.url()===url,'Blank-space click changed the exploration route');

  // Project the actual Three object without mutating it. This is an observation;
  // all navigation is still driven by physical pointer events or DOM controls.
  const body=await page.evaluate(()=>{
    const api=window.__APMathUniverse, object=api.scene.getObjectByName('math-concept-two-tangents');
    if(!object)return null;
    const p=object.getWorldPosition(object.position.clone()).project(api.camera);
    return {x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2,z:p.z};
  });
  assert(body&&body.z>-1&&body.z<1&&body.x>0&&body.x<page.viewportSize().width&&body.y>0&&body.y<page.viewportSize().height,'HUD probe has no visible concept body',body);
  await press(page,selectors.hideHud,false);
  await page.waitForFunction(()=>document.querySelector('#universeUi').inert&&document.querySelector('#universeUi').classList.contains('hud-hidden'));
  assert(await page.locator(selectors.restoreHud).isVisible(),'Hidden HUD has no reachable restore button');
  assert(await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.id==='space',body),'Hidden-HUD gesture target is covered',body);
  await page.mouse.click(body.x,body.y);
  await page.waitForFunction(()=>!document.querySelector('#universeUi').inert&&!document.querySelector('#universeUi').classList.contains('hud-hidden'));
  await settled(page,'galaxy');
  assert(routeIdentity(await state(page))===identity&&page.url()===url,'First hidden-HUD gesture also selected a concept');
  record.pointerChecks={blank,hiddenHudBody:body,route:JSON.parse(identity)};
  record.checks.push('PC blank-space click preserves route; first hidden-HUD gesture restores UI without selection');
}
async function checkReducedMotion(page, guard, record) {
  // Only the PC journey runs this extra startup. Reload is intentional: it tests
  // an existing user preference before scene initialization, not only a change.
  progress(record,'reduced-motion:start');
  record.reducedMotionCheck={status:'RUNNING'};
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload({waitUntil:'networkidle',timeout:60000});await ready(page);await settled(page,'universe');
  const initial=await state(page);
  assert(initial.reducedMotion===true&&initial.motionPlaying===false,'Reduced-motion startup did not hold ambient motion',initial);
  await press(page,selectors.circle,false);await settled(page,'galaxy');
  await press(page,selectors.tangent,false);await settled(page,'concept','two-tangents');
  const held=await state(page);
  assert(held.reducedMotion===true&&held.mathPlaying===false&&Math.abs(held.mathTime-held.mathDuration)<.001,'Reduced-motion concept did not hold the completed relationship',held);
  await page.waitForTimeout(200);
  assert(Math.abs((await state(page)).mathTime-held.mathTime)<.001,'Reduced-motion held timeline advanced without user input');
  await capture(page,guard,'pc-reduced-motion-hold',report.candidate.revision,record);
  await press(page,selectors.replay,false);
  await waitForMathTime(page,.2,30000,record,'reduced-motion-explicit-replay');
  const replay=await state(page);
  assert(replay.reducedMotion&&replay.mathPlaying&&replay.mathTime<replay.mathDuration,'Explicit replay did not advance under the reduced-motion preference',replay);
  await press(page,selectors.pause,false);
  assert((await state(page)).mathPlaying===false,'Explicit reduced-motion playback cannot be paused');
  await press(page,selectors.back,false);await settled(page,'galaxy');
  await press(page,selectors.home,false);await settled(page,'universe');
  record.reducedMotion={initial,held,replay};
  record.reducedMotionCheck={status:'PASS',completedAt:new Date().toISOString()};
  record.checks.push('PC reduced-motion startup and completed concept hold; explicit replay advances and can pause');
  progress(record,'reduced-motion:complete');
}
function resources(data) {
  const r=data.resources;
  assert(r&&['geometries','textures','programs'].every(k=>Number.isInteger(r[k])&&r[k]>=0),'Missing resource counters',r);
  return {geometries:r.geometries,textures:r.textures,programs:r.programs};
}
async function roundTrip(page, touch, family) {
  await press(page,selectors[family],touch);await settled(page,'galaxy');
  const entered=await debug(page),galaxyId=family==='circle'?'circle-sector':'polyhedra';
  const expected=entered.concepts.length,active=entered.families?.find(f=>f.id===galaxyId);
  assert(expected>0&&active?.detailedObjects===expected,'Resource round trip did not create the selected family',{family,expected,active});
  await press(page,family==='circle'?selectors.tangent:selectors.cube,touch);await settled(page,'concept');
  await press(page,selectors.back,touch);await settled(page,'galaxy');
  await press(page,selectors.home,touch);await settled(page,'universe');
  const disposalStarted=Date.now();
  await page.waitForFunction(()=>{
    const d=window.__APMathUniverse.getDebugState();
    return d.mode==='universe'&&Array.isArray(d.families)&&d.families.length>0&&d.families.every(f=>f.detailedObjects===0);
  },null,{timeout:30000});
  const disposed=await debug(page),remaining=disposed.families.reduce((sum,f)=>sum+f.detailedObjects,0);
  assert(remaining===0,'Detailed objects reappeared before the resource sample',disposed.families);
  return {...resources(disposed),createdDetailedObjects:expected,remainingDetailedObjects:remaining,disposalWaitMs:Date.now()-disposalStarted,rendererFrame:disposed.renderer.frame};
}
async function checkResourceRoundTrips(page,profile,record) {
  const reduced=profile.name==='pc',motionMode=reduced?'reduced-motion':'normal-animation';
  assert((await state(page)).reducedMotion===reduced,'Resource phase has the wrong motion preference',{expected:motionMode});
  record.resourceProbe={mode:motionMode,input:'real DOM buttons',requiredRoundTrips:20,disposalCondition:'every family detailedObjects === 0',status:'RUNNING'};
  progress(record,'resources:start',{mode:motionMode,roundTrips:20});
  try {
    record.resourceWarmup=[];
    for(const family of ['circle','polyhedra','circle']) {
      const sample=await roundTrip(page,profile.hasTouch,family);record.resourceWarmup.push(sample);
      progress(record,'resources:warm-up',{mode:motionMode,family,round:record.resourceWarmup.length,...sample});
    }
    const ceiling=Object.fromEntries(['geometries','textures','programs'].map(k=>[k,Math.max(...record.resourceWarmup.map(r=>r[k]))]));
    record.resourceCeiling=ceiling;record.resourceRoundTrips=[];
    for(let i=0;i<20;i++) {
      const family=i%2?'polyhedra':'circle',sample=await roundTrip(page,profile.hasTouch,family);
      record.resourceRoundTrips.push({round:i+1,family,...sample});
      for(const k of Object.keys(ceiling))assert(sample[k]<=ceiling[k],'Resources exceed the observed warm-cache ceiling',{round:i+1,counter:k,ceiling:ceiling[k],actual:sample[k]});
      progress(record,'resources:round-trip',{mode:motionMode,round:i+1,family,...sample});
    }
    record.resourceProbe.status='PASS';record.resourceProbe.completedAt=new Date().toISOString();
    record.checks.push(`twenty post-warm-up ${motionMode} DOM round trips without resource-count growth; detailed objects disposed before every sample`);
    progress(record,'resources:complete',{mode:motionMode,roundTrips:record.resourceRoundTrips.length,ceiling});
  } catch(error) {
    record.resourceProbe.status='FAIL';record.resourceProbe.error=errorText(error);
    progress(record,'resources:failed',{mode:motionMode,error:record.resourceProbe.error});throw error;
  }
}
async function makePage(browser, profile, origin, record) {
  const context=await browser.newContext({viewport:profile.viewport,deviceScaleFactor:1,hasTouch:profile.hasTouch,isMobile:profile.isMobile,reducedMotion:'no-preference'});
  await context.addInitScript(()=>{let seed=0x41504d;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};});
  await context.route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.origin===origin || url.origin==='https://cdn.jsdelivr.net')return route.continue();
    record.blockedExternal.push({url:url.origin+url.pathname,method:route.request().method()});return route.abort('blockedbyclient');
  });
  const page=await context.newPage();page.setDefaultTimeout(20000);
  page.on('pageerror',error=>record.pageErrors.push(errorText(error)));
  page.on('console',message=>{if(message.type()==='error')record.consoleErrors.push({text:message.text(),location:message.location()});});
  page.on('response',response=>{if(response.url().startsWith(origin)&&response.status()>=400)record.httpErrors.push({url:response.url(),status:response.status()});});
  page.on('requestfailed',request=>{if(request.url().startsWith(origin))record.httpErrors.push({url:request.url(),error:request.failure()?.errorText});});
  return {context,page};
}
function newRecord(profile,kind){return{name:profile.name,kind,startedAt:new Date().toISOString(),viewport:profile.viewport,hasTouch:profile.hasTouch,events:[],mathProgress:[],scrubChecks:[],captures:[],labelChecks:[],touchObservations:[],pageErrors:[],consoleErrors:[],httpErrors:[],blockedExternal:[],checks:[]};}
function checkErrors(record) {
  assert(record.pageErrors.length===0&&record.consoleErrors.length===0&&record.httpErrors.length===0,'Candidate emitted script, console or local asset errors',{pageErrors:record.pageErrors,consoleErrors:record.consoleErrors,httpErrors:record.httpErrors});
  assert(record.blockedExternal.length===0,'Candidate attempted unexpected external requests',record.blockedExternal);
}
async function baselineCapture(browser,profile,server,createScreenshotGuard){
  const record=newRecord(profile,'baseline');report.profiles.push(record);let context,guard,page;
  try{
    progress(record,'baseline:start');
    ({context,page}=await makePage(browser,profile,server.origin,record));
    await page.goto(`${server.origin}/AP------/apmath/playground/index.html#g8`,{waitUntil:'networkidle',timeout:60000});
    await page.waitForTimeout(1200);
    record.webgl=await webgl(page);assert(record.webgl.available&&!record.webgl.lost,'Baseline WebGL2 unavailable',record.webgl);
    assert(await page.locator('.webgl-fallback').count()===0,'Baseline entered WebGL fallback');
    assert(await page.locator('.celestial-pill').count()===12,'Baseline does not expose twelve representative selectors');
    guard=await createScreenshotGuard(page,{expectedTouch:profile.hasTouch,onObservation:o=>record.touchObservations.push(o)});
    await capture(page,guard,`${profile.name}-before-universe`,report.baseline.revision,record);
    assert(record.pageErrors.length===0&&record.httpErrors.length===0,'Baseline script or local asset errors',{pageErrors:record.pageErrors,httpErrors:record.httpErrors});
    record.status='CAPTURED_FOR_VISUAL_REVIEW';
    progress(record,'baseline:complete');
  }catch(error){record.status='FAIL';record.error=errorText(error);report.failures.push({profile:profile.name,kind:'baseline',error:record.error});progress(record,'baseline:failed',{error:record.error});}
  finally{if(guard)await guard.close().catch(()=>{});if(context)await context.close();evidence();}
}
async function candidateJourney(browser,profile,server,createScreenshotGuard){
  const record=newRecord(profile,'candidate');report.profiles.push(record);let context,guard,page;
  record.normalJourney={mode:'normal-animation',status:'RUNNING'};
  record.resourceProbe={mode:profile.name==='pc'?'reduced-motion':'normal-animation',status:'NOT_RUN'};
  record.reducedMotionCheck={status:profile.name==='pc'?'NOT_RUN':'NOT_SCHEDULED'};
  try{
    progress(record,'normal:start');
    ({context,page}=await makePage(browser,profile,server.origin,record));
    await page.goto(`${server.origin}/AP------/apmath/playground/index.html?universeTest=1&student_id=universe-qa#g8`,{waitUntil:'networkidle',timeout:60000});
    await ready(page);
    await settled(page,'universe');record.initialState=await state(page);record.initialDebug=await debug(page);record.webgl=await webgl(page);
    assert(record.webgl.available&&!record.webgl.lost,'Candidate WebGL2 unavailable',record.webgl);
    assert(/swiftshader/i.test(record.webgl.unmaskedRenderer||record.webgl.renderer),'Renderer is not the declared software backend',record.webgl);
    assert(await page.locator('.celestial-pill').count()===12,'Candidate lost representative celestial selectors');
    guard=await createScreenshotGuard(page,{expectedTouch:profile.hasTouch,onObservation:o=>record.touchObservations.push(o)});
    await capture(page,guard,`${profile.name}-after-universe`,report.candidate.revision,record);
    record.checks.push('initial stable WebGL2 render and twelve representative selectors');

    progress(record,'normal:circle-entry');
    await press(page,selectors.circle,profile.hasTouch);await settled(page,'galaxy');
    await checkLabels(page,6,record,'circle-galaxy');
    await capture(page,guard,`${profile.name}-circle-galaxy`,report.candidate.revision,record);
    if(profile.name==='pc')await checkBlankAndHudRestore(page,record);
    await press(page,selectors.tangent,profile.hasTouch);await settled(page,'concept','two-tangents');
    await waitForMathTime(page,.3,profile.name==='pc'?30000:15000,record,'two-tangents');
    await press(page,selectors.pause,profile.hasTouch);
    assert((await state(page)).mathPlaying===false,'Pause did not stop the mathematical timeline');
    const paused=(await state(page)).mathTime;await page.waitForTimeout(150);
    assert(Math.abs((await state(page)).mathTime-paused)<.05,'Paused timeline is still advancing');
    await press(page,selectors.replay,profile.hasTouch);
    await page.waitForFunction(()=>{const s=window.__APMathUniverse.getState();return s.mathPlaying&&s.mathTime<1.5;},null,{timeout:10000});
    await press(page,selectors.pause,profile.hasTouch);
    await capture(page,guard,`${profile.name}-tangents-detail`,report.candidate.revision,record);
    await captureConceptTime(page,guard,record,`${profile.name}-tangents-complete`,8);
    record.checks.push('circle entry, concept selection, mathematical pause and replay');

    progress(record,'normal:history-and-resize');
    await page.goBack();await settled(page,'galaxy');
    await page.goForward();await settled(page,'concept','two-tangents');
    await press(page,selectors.back,profile.hasTouch);await settled(page,'galaxy');
    await page.setViewportSize(profile.resize);await page.waitForTimeout(400);
    await settled(page,'galaxy');await checkLabels(page,6,record,'resized-circle-galaxy');
    await capture(page,guard,`${profile.name}-resized-circle-galaxy`,report.candidate.revision,record);
    await page.setViewportSize(profile.viewport);await page.waitForTimeout(400);await settled(page,'galaxy');
    await press(page,selectors.home,profile.hasTouch);await settled(page,'universe');
    record.checks.push('browser back/forward, in-app back/home, resize, grade and student context');

    progress(record,'normal:polyhedra-entry');
    await press(page,selectors.polyhedra,profile.hasTouch);await settled(page,'galaxy');
    await checkLabels(page,2,record,'polyhedra-galaxy');
    await capture(page,guard,`${profile.name}-polyhedra-galaxy`,report.candidate.revision,record);
    for(const [key,id] of [['cube','cube-octahedron'],['dodeca','dodecahedron-icosahedron']]){
      progress(record,'normal:duality-entry',{conceptId:id});
      await press(page,selectors[key],profile.hasTouch);await settled(page,'concept',id);
      // c69 on SwiftShader reached 1.9166 simulated seconds after a 20-second
      // wait while still playing. Preserve the 3-second observation and allow
      // 90 wall seconds on PC; record frame/time samples instead of assuming FPS.
      await waitForMathTime(page,3,profile.name==='pc'?90000:20000,record,id);
      await press(page,selectors.pause,profile.hasTouch);
      await capture(page,guard,`${profile.name}-${key}-detail`,report.candidate.revision,record);
      for(const [phase,seconds] of [['face-to-point',1.7],['point-to-face',6.2],['complete',8]]) {
        await captureConceptTime(page,guard,record,`${profile.name}-${key}-${phase}`,seconds);
      }
      await press(page,selectors.back,profile.hasTouch);await settled(page,'galaxy');
    }
    await press(page,selectors.home,profile.hasTouch);await settled(page,'universe');
    record.checks.push('both polyhedron duality scenes render and return');
    await capture(page,guard,`${profile.name}-returned-universe`,report.candidate.revision,record);
    checkErrors(record);record.normalJourney.status='PASS';record.normalJourney.completedAt=new Date().toISOString();
    progress(record,'normal:complete');

    // Keep normal animated observations above intact. Only the separate PC
    // resource phase uses the supported reduced-motion preference and actual DOM
    // navigation; mobile still repeats the normal animated routes twenty times.
    if(profile.name==='pc')await checkReducedMotion(page,guard,record);
    await checkResourceRoundTrips(page,profile,record);
    await capture(page,guard,`${profile.name}-${profile.name==='pc'?'reduced-motion-':''}resource-returned-universe`,report.candidate.revision,record);
    record.finalState=await state(page);record.finalDebug=await debug(page);
    checkErrors(record);
    record.status='PASS';
    progress(record,'candidate:complete',{normal:record.normalJourney.status,resourceMode:record.resourceProbe.mode,resources:record.resourceProbe.status});
  }catch(error){
    record.status='FAIL';record.error=errorText(error);report.failures.push({profile:profile.name,kind:'candidate',error:record.error});
    if(record.normalJourney.status==='RUNNING')record.normalJourney.status='FAIL';
    if(record.reducedMotionCheck.status==='RUNNING')record.reducedMotionCheck.status='FAIL';
    progress(record,'candidate:failed',{error:record.error});
    if(page){
      try{record.failureState=await state(page);record.failureDebug=await debug(page);}catch{}
      try{const file=`screenshots/${profile.name}-failure.png`;await page.screenshot({path:path.join(output,file),fullPage:false,timeout:60000});record.failureScreenshot=file;}
      catch(captureError){record.failureCaptureError=errorText(captureError);progress(record,'failure-capture:failed',{error:record.failureCaptureError});}
    }
  }finally{if(guard)await guard.close().catch(()=>{});if(context)await context.close();evidence();}
}
let browser,candidateServer,baselineServer;
try{
  report.candidate=bindSource(root,option('--candidate-sha',''),'Candidate');
  if(baselineRoot)report.baseline=bindSource(baselineRoot,option('--baseline-sha',''),'Baseline');
  const {createScreenshotGuard}=await import(pathToFileURL(path.join(root,'apmath/playground/next/tools/browser-screenshot-guard.mjs')).href);
  candidateServer=await serve(root);if(baselineRoot)baselineServer=await serve(baselineRoot);
  browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],timeout:45000});
  report.browserVersion=browser.version();evidence();
  for(const profile of profiles){
    if(baselineServer)await baselineCapture(browser,profile,baselineServer,createScreenshotGuard);
    await candidateJourney(browser,profile,candidateServer,createScreenshotGuard);
  }
}catch(error){report.failures.push({kind:'environment-or-source',error:errorText(error)});}
finally{
  if(browser)await browser.close();if(candidateServer)await candidateServer.close();if(baselineServer)await baselineServer.close();
  report.completedAt=new Date().toISOString();report.status=report.failures.length?'FAIL':'PASS';evidence();
  console.log(JSON.stringify({status:report.status,candidate:report.candidate?.revision,baseline:report.baseline?.revision,profiles:report.profiles.map(p=>({name:p.name,kind:p.kind,status:p.status})),failures:report.failures,output},null,2));
  if(report.failures.length)process.exitCode=1;
}
