'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const {chromium} = require('/tmp/ap-galaxy-playwright/node_modules/playwright');

const root = path.resolve(__dirname,'../../../..');
const evidence = path.join(root,'docs/reviews/ap-galaxy-visual-polish-20261011');
const bundlePath = path.join(root,'archive/prototypes/ap-galaxy/assets/orbital-world.js');
const actualFile='original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
const original = fs.readFileSync(bundlePath,'utf8');
const exp=/export\{([A-Za-z_$][\w$]*) as createOrbitWorld\};?\s*$/.exec(original);
if(!exp) throw Error('The existing bundled export signature changed; update test instrumentation safely.');
const hooked = original.slice(0,exp.index) + 
  'function createMonitoredWorld(options){const world='+exp[1]+'(options);const originalSetData=world.setData;world.setData=function(data){window.__detailFiles=data.details.map(exam=>exam.file);return originalSetData.call(world,data)};const originalSelect=world.setSelectedExam;world.setSelectedExam=function(file){window.__selectedGlowFile=file||"";return originalSelect.call(world,file)};return world}export{createMonitoredWorld as createOrbitWorld};\n';
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)}
  catch{res.writeHead(400).end('Bad path');return}
  const file=path.resolve(root,'.'+pathname);
  if(file!==root && !file.startsWith(root+path.sep)){res.writeHead(403).end('Forbidden');return}
  fs.stat(file,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404).end('NOT FOUND: '+pathname);return}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
});
function examTitle(exam){
  const type=exam.examType==='final'?'기말고사':'중간고사';
  const semester=exam.semester?exam.semester+'학기 ':'';
  return [exam.year?exam.year+'년':'',semester+type,exam.school,exam.grade,exam.subject].filter(Boolean).join(' · ');
}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function clickExamByTitle(page,title){
  const button=page.locator('.exam-link').filter({hasText:title}).first();
  if(await button.count()!==1)throw Error('No exact target in accessible list: '+title);
  await button.evaluate(el=>{el.closest('details').open=true;el.click()});
  await page.waitForFunction(()=>document.getElementById('examDrawer').classList.contains('open'),null,{timeout:10000});
}
(async()=>{
  fs.mkdirSync(evidence,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
  const ctx=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  const pageErrors=[],consoleErrors=[],failedRequests=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
  page.on('response',r=>{if(r.status()>=400)failedRequests.push(r.status()+' '+r.url())});
  await page.route('**/assets/orbital-world.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:hooked}));
  const url='http://127.0.0.1:'+server.address().port+'/archive/prototypes/ap-galaxy/index.html';
  let preview;
  try{
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>Array.isArray(window.__detailFiles)&&window.__detailFiles.length>0,null,{timeout:35000});
    const before=await page.evaluate(()=>[...window.__detailFiles]);
    if(before.length>96||before.length<70)throw Error('Unexpected initial detail budget: '+before.length);
    const picks=await page.evaluate(async()=>{
      const raw=await (await fetch('/archive/data/archive2-catalog.json')).json();
      const decoded=window.Archive2Core.decodeCatalog(raw);
      return decoded.exams.filter(e=>e.file&&e.contentType==='기출');
    });
    const outside=picks.findLast(exam=>!before.includes(exam.file));
    const inside=picks.find(exam=>exam.file===actualFile);
    if(!outside||!inside)throw Error('Target catalog fixture missing');
    // Off-budget selection: prevent unrelated absent exam files from loading in
    // the deliberately sparse QA checkout. This route is removed BEFORE real preview.
    const stub=async route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Off-budget selection route smoke</title>'});
    await page.route('**/engine.html?**',stub);
    await page.locator('#viewToggle').click();
    await clickExamByTitle(page,examTitle(outside));
    await page.waitForFunction(file=>window.__detailFiles?.includes(file),outside.file,{timeout:30000});
    const selected=await page.evaluate(()=>({ids:[...window.__detailFiles],glow:window.__selectedGlowFile}));
    if(selected.ids.length!==before.length||selected.ids.length>96||new Set(selected.ids).size!==selected.ids.length) throw Error('Selection exceeded or duplicated the 96-star detail budget');
    if(selected.glow!==outside.file) throw Error('Selected glow not bound to promoted exam');
    if(!selected.ids.includes(outside.file)||before.includes(outside.file))throw Error('Outside-budget promotion test is not valid');
    await page.locator('#closeDrawer').click();
    await page.waitForFunction(()=>window.__selectedGlowFile==='',null,{timeout:10000});
    await page.unroute('**/engine.html?**',stub);
    // Actual source path. No iframe/engine/document replacement or fixture stub.
    await page.locator('#search').fill('삼산중');
    await wait(600);
    await page.locator('#viewToggle').click();
    await clickExamByTitle(page,examTitle(inside));
    const src=await page.locator('#examFrame').getAttribute('src');
    if(!src||!src.includes(encodeURIComponent(actualFile))) throw Error('Actual engine data parameter mismatch: '+src);
    const visibleTitle=await page.locator('#examTitle').textContent();
    if(!visibleTitle||!visibleTitle.includes('삼산중'))throw Error('Drawer title not populated: '+visibleTitle);
    const frame=page.frameLocator('#examFrame');
    await frame.locator('#print-area').waitFor({state:'attached',timeout:45000});
    await page.waitForFunction(()=>{
      const f=document.getElementById('examFrame');
      const doc=f?.contentDocument;
      return Boolean(f?.contentWindow?.questionBank?.length>0
        && doc?.getElementById('print-area')?.innerText.includes('다음 중 옳은 것은?'));
    },null,{timeout:110000,polling:500});
    await wait(1500);
    preview=await page.evaluate(()=>{
      const iframe=document.getElementById('examFrame');
      const doc=iframe.contentDocument, title=document.getElementById('examTitle');
      const drawer=document.getElementById('examDrawer');
      const rect=title.getBoundingClientRect(),bounds=drawer.getBoundingClientRect();
      return {drawerTitle:title.textContent,engineTitle:doc.getElementById('ctrl-title').innerText,
        questionCount:iframe.contentWindow.questionBank.length,
        firstQuestionVisible:doc.getElementById('print-area').innerText.includes('다음 중 옳은 것은?'),
        bodyExcerpt:doc.getElementById('print-area').innerText.slice(0,340),
        drawerTitleRect:{left:rect.left,right:rect.right,width:rect.width},
        drawerRect:{left:bounds.left,right:bounds.right},
        renderError:doc.documentElement.dataset.apRenderError||null,
        iframeUrl:iframe.contentWindow.location.href
      };
    });
    if(!preview.firstQuestionVisible||preview.questionCount<10||preview.renderError)throw Error('Actual engine content failed: '+JSON.stringify(preview));
    if(preview.drawerTitleRect.left<preview.drawerRect.left||preview.drawerTitleRect.right>preview.drawerRect.right)throw Error('Drawer title is clipped beyond panel: '+JSON.stringify(preview.drawerTitleRect));
    await page.screenshot({path:path.join(evidence,'star-v3-real-preview.png')});
    const result={status:'PASS',target:actualFile,selectionProof:{
      initialDetailCount:before.length,afterDetailCount:selected.ids.length,wasOutsideBefore:true,
      promotedInsideDetail:true,uniqueDetailFiles:true,maxDesktopDetail:96,glowBoundToSelected:true,
      glowClearedOnClose:true
    },realPreview:preview,viewport:{width:1600,height:900,dpr:1},
      environment:'headless Chromium, SwiftShader WebGL, prefers-reduced-motion',
      actualEngineNoStub:true,consoleErrors,pageErrors,failedRequests};
    fs.writeFileSync(path.join(evidence,'star-v3-review.json'),JSON.stringify(result,null,2)+'\n');
    fs.writeFileSync(path.join(evidence,'star-v3-review.md'),
      '# AP Galaxy — off-budget selection + actual original preview\n\n'+
      '- Tested outside-budget catalog file: '+outside.file+'\n'+
      '- Detailed star nodes before/after: '+before.length+'/'+selected.ids.length+' (desktop cap 96); selected included, no duplicates. On close selected glow cleared.\n'+
      '- Actual engine URL: '+preview.iframeUrl+'\n'+
      '- Actual drawer title: '+preview.drawerTitle+'\n'+
      '- Actual engine title: '+preview.engineTitle+'\n'+
      '- Actual source JS questionBank count: '+preview.questionCount+'\n'+
      '- Real rendered question 1 found: '+preview.firstQuestionVisible+'\n'+
      '- No engine iframe stub for final screenshot. The off-budget selection test alone used a route stub because the non-screenshot fixture is absent from sparse checkout.\n'+
      '- UI screenshot: star-v3-real-preview.png (1600×900, DPR 1)\n'+
      '- Browser page errors: '+pageErrors.length+'; console errors: '+consoleErrors.length+'; HTTP >=400: '+failedRequests.length+'\n'+
      '- Page/console/request details and DOM geometry are in star-v3-review.json.\n');
    console.log(JSON.stringify({status:'PASS',detail:selected.ids.length,title:preview.drawerTitle,exam:preview.engineTitle,questions:preview.questionCount,consoleErrors:consoleErrors.length,requestsFailed:failedRequests.length}));
  }catch(error){
    try{await page.screenshot({path:path.join(evidence,'star-v3-debug.png')})}catch{}
    console.error('FAILED',error.stack||String(error),JSON.stringify({pageErrors,consoleErrors,failedRequests}).slice(0,12000));
    process.exitCode=1;
  }finally{await ctx.close();await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error.stack||String(error));process.exitCode=1});
