'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const { chromium } = require('/tmp/ap-galaxy-playwright/node_modules/playwright');

const root = path.resolve(__dirname, '../../../..');
const output = path.join(root, 'docs/reviews/ap-galaxy-visual-polish-20261011');
const baseline = 'd7c008eec8c25e2f3e31d59428d9b5c055dd11b3';
const assetPrefix = 'archive/prototypes/ap-galaxy/';
const originalBundle = execFileSync('git', ['show', baseline + ':' + assetPrefix + 'assets/orbital-world.js'], {cwd:root,maxBuffer:8*1024*1024});
const originalApp = execFileSync('git', ['show', baseline + ':' + assetPrefix + 'orbit-app.js'], {cwd:root,maxBuffer:2*1024*1024});
const mimetypes = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webm':'video/webm'};
const server = http.createServer((req,res) => {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch (_) { res.writeHead(400);res.end('Bad request');return; }
  const file = path.resolve(root, '.' + url);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403);res.end('Forbidden');return; }
  fs.stat(file,(error,stat) => {
    if (error || !stat.isFile()) { res.writeHead(404);res.end('Not found: ' + url);return; }
    res.writeHead(200,{'Content-Type':mimetypes[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
});
const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
const median = values => { const sorted=[...values].sort((a,b)=>a-b); return sorted[Math.floor(sorted.length/2)]; };
async function ready(page) {
  await page.goto('http://127.0.0.1:' + server.address().port + '/archive/prototypes/ap-galaxy/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => document.getElementById('sceneCount')?.textContent?.includes('별 자료 노드'),null,{timeout:30000});
  if (await page.locator('#worldFallback').evaluate(el=>!el.hidden)) throw Error('WebGL scene failed; fallback visible');
  await wait(900);
}
async function focusSameSchool(page) {
  await page.locator('#search').fill('삼산중');
  await wait(650);
  const group = page.locator('.planet-label').filter({hasText:'삼산중'}).first();
  await group.waitFor({state:'attached',timeout:10000});
  const pos = await group.evaluate(el => ({x:parseFloat(el.style.left),y:parseFloat(el.style.top)+22}));
  if (!Number.isFinite(pos.x) || !Number.isFinite(pos.y)) throw Error('삼산중 projected position unavailable');
  await page.evaluate(({x,y}) => {
    const canvas=document.getElementById('space');
    canvas.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:x,clientY:y,pointerId:1}));
    canvas.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:x,clientY:y,pointerId:1}));
  },pos);
  await page.waitForFunction(() => !document.getElementById('focusedChip').hidden,null,{timeout:6000});
  await page.mouse.move(800,450);
  await page.mouse.wheel(0,-650);
  await wait(1000);
  return {school:'삼산중',zoomWheel:-650,position:pos};
}
async function sampleFps(page) {
  await page.locator('#motionToggle').evaluate(el=>el.click());
  await wait(250);
  const samples=[];
  for(let i=0;i<3;i++){
    const start=await page.evaluate(() => ({calls:window.__apGalaxyClears||0,time:performance.now()}));
    await wait(3000);
    const end=await page.evaluate(() => ({calls:window.__apGalaxyClears||0,time:performance.now()}));
    samples.push(Number((((end.calls-start.calls)*1000)/(end.time-start.time)).toFixed(2)));
    await wait(200);
  }
  if(samples.some(s=>s<=0)) throw Error('WebGL clear count is zero; FPS sampling unavailable');
  return {samples,median:median(samples),method:'WebGL clear calls per elapsed second',durationSeconds:3,repeats:3};
}
async function load(page,old) {
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')pageErrors.push(m.text());});
  await page.addInitScript(() => {
    window.__apGalaxyClears=0;
    const oldGetContext=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){
      const ctx=oldGetContext.call(this,type,...args);
      if(ctx && ['webgl','webgl2','experimental-webgl'].includes(type) && !ctx.__apGalaxyWrapped){
        const original=ctx.clear;
        ctx.clear=function(...params){window.__apGalaxyClears++;return original.apply(ctx,params);};
        ctx.__apGalaxyWrapped=true;
      }
      return ctx;
    };
  });
  if(old){
    await page.route('**/orbit-app.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:originalApp}));
    await page.route('**/assets/orbital-world.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:originalBundle}));
  }
  // Only the original route and drawer are smoke-tested; student engine output is not.
  await page.route('**/engine.html?**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><title>Route smoke stub</title><body>original route reached</body>'}));
  await ready(page);
  return pageErrors;
}
async function runPair(browser,old,prefix){
  const context=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  const pageErrors=await load(page,old);
  await page.screenshot({path:path.join(output,'star-v2-'+prefix+'-full.png')});
  const focus=await focusSameSchool(page);
  await page.screenshot({path:path.join(output,'star-v2-'+prefix+'-close.png')});
  const fps=await sampleFps(page);
  const result={focus,fps,errors:pageErrors};
  if(!old){
    const options=page.locator('.satellite-hit');
    if(await options.count()<2) throw Error('Two exam labels not available for selection switching');
    const files=[];
    for (let index=0;index<2;index++) {
      const file=await options.nth(index).getAttribute('data-exam-file');
      await options.nth(index).evaluate(el=>el.click());
      await page.waitForFunction(() => document.getElementById('examDrawer').classList.contains('open'));
      const src=await page.locator('#examFrame').getAttribute('src');
      if(!src || !src.includes('data=exams%2F') || !src.includes(encodeURIComponent(file))) throw Error('Preview route mismatch on selection '+index+': '+src);
      files.push(file);
    }
    await page.screenshot({path:path.join(output,'star-v2-after-selection.png')});
    await page.locator('#closeDrawer').evaluate(el=>el.click());
    if(await page.locator('#examDrawer').evaluate(el=>el.classList.contains('open'))) throw Error('Drawer remained open on close');
    if(await page.locator('#examFrame').getAttribute('src') !== 'about:blank') throw Error('Preview not cleared on close');
    result.selection={files,drawerSwitchAndClose:true,previewUrlOnly:true,fullPreviewTested:false};
    await page.locator('[data-group-mode="grade"]').evaluate(el=>el.click());
    await wait(250);
    await page.locator('[data-group-mode="unit"]').evaluate(el=>el.click());
    await wait(250);
    await page.locator('[data-group-mode="school"]').evaluate(el=>el.click());
    result.groupSwitch={grade:true,unit:true,school:true};
  }
  if(pageErrors.length) throw Error(prefix+' page errors: '+pageErrors.join(' | '));
  await context.close();
  return result;
}
async function captureMotion(browser){
  const context=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,reducedMotion:'reduce',recordVideo:{dir:output,size:{width:1600,height:900}}});
  const page=await context.newPage();
  await load(page,false);
  await focusSameSchool(page);
  await page.locator('#motionToggle').evaluate(el=>el.click());
  await wait(1300);
  await page.mouse.move(800,450);
  await page.mouse.down();
  await page.mouse.move(920,490,{steps:15});
  await page.mouse.up();
  await page.mouse.wheel(0,-200);
  await wait(1250);
  const video=page.video();
  await context.close();
  await video.saveAs(path.join(output,'star-v2-motion.webm'));
}
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
  try {
    const pair={baseline:await runPair(browser,true,'before'),updated:await runPair(browser,false,'after')};
    await captureMotion(browser);
    const qa={status:'PASS',baselineCommit:baseline,updatedCommit:process.env.GITHUB_SHA||'unknown',viewport:'1600×900',dpr:1,screenshotMotion:'prefers-reduced-motion: reduce',browser:'Playwright Chromium headless, SwiftShader WebGL',selectionPreviewScope:'Route/iframe only; actual student engine output NOT_TESTED',...pair};
    fs.writeFileSync(path.join(output,'star-v2-qa.json'),JSON.stringify(qa,null,2)+'\n');
    const b=pair.baseline.fps,a=pair.updated.fps;
    const lines=['# AP Galaxy star-only follow-up — same-environment review','',
      '- Baseline: '+baseline+' (PR #390 before star-only follow-up)','- Updated: '+qa.updatedCommit,
      '- Chromium Playwright headless with software WebGL (SwiftShader), 1600×900 CSS px, DPR 1.',
      '- Full shot: school view with reduced motion. Close-up: search 삼산중 → canvas pick → wheel -650 → settle 1000 ms; same steps for each version.',
      '- WebGL clear-call samples: 3 × 3 seconds each, orbital motion enabled at focused close-up; calls/s are a frame proxy, not a GPU profiler result.',
      '- Before: '+b.samples.join(', ')+' FPS-equivalent (median '+b.median+').',
      '- After: '+a.samples.join(', ')+' FPS-equivalent (median '+a.median+').',
      '- Observed median delta: '+((a.median-b.median)/b.median*100).toFixed(1)+'%. The earlier 23 FPS from another environment is not compared.',
      '- Drawer: selection switch and close PASS; checked engine.html?data=exams/... URL and iframe state. Actual exam/solution/print NOT_TESTED (iframe smoke stub).',
      '- School/grade/unit switching: PASS. Browser page errors: none on sampled scene and stubbed route.',
      '- Files: star-v2-before-full.png, star-v2-after-full.png, star-v2-before-close.png, star-v2-after-close.png, star-v2-after-selection.png, star-v2-motion.webm.',''];
    fs.writeFileSync(path.join(output,'star-v2-report.md'),lines.join('\n'));
    console.log(JSON.stringify({status:'PASS',before:b,after:a,selection:qa.updated.selection,files:6}));
  } finally { await browser.close();await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error.stack||String(error));process.exitCode=1;});
