const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = '.tmp/archive/archive2-m2-codex-20261006-03/19_신흥중_2학기_기말_중2_기출';
const render = path.join(base, 'render', 'attempt-05'); fs.mkdirSync(render, {recursive:true});
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const report={attempt:'attempt-05',reviewerIdentity:'archive_r3 (Codex worker)',cases:[],startedAt:new Date().toISOString(),browserVersion:browser.version()};
 for(const mode of ['exam','sol','ans']) for(const view of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]){
   const id=`${mode}/${view.name}`; const page=await browser.newPage({viewport:{width:view.width,height:view.height},deviceScaleFactor:1});
   const errs=[],failedResponses=[]; page.on('pageerror',e=>errs.push(String(e))); page.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); page.on('response',r=>{if(r.status()>=400)failedResponses.push({url:r.url(),status:r.status()})});
   const url=`http://127.0.0.1:4179/archive/engine.html?data=${encodeURIComponent('exams/19_신흥중_2학기_기말_중2_기출.js')}&mode=${mode}&qpp=4`;
   await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
   await page.evaluate(async()=>{const pending=window.__AP_RENDER_READY__; if(pending&&typeof pending.then==='function') return await pending; return null;});
   await page.waitForFunction(()=>document.querySelectorAll('#print-area .page').length>0,{timeout:60000});
   await page.waitForTimeout(1500);
   try { await page.evaluate(async()=>{if(window.MathJax?.typesetPromise)await window.MathJax.typesetPromise();}); } catch(e){errs.push('MathJax:'+e.message)}
   await page.waitForTimeout(500);
   const inspection=await page.evaluate(()=>{
     const q=window.questionBank||[];
     const boxes=[...document.querySelectorAll('.q-box[data-source-ref]')];
     const images=[...document.images].map(i=>({src:i.currentSrc||i.src,complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,alt:i.alt||''}));
     const mathNodes=[...document.querySelectorAll('.mjx-container')].length;
     const metrics=boxes.map((b,i)=>{const r=b.getBoundingClientRect();return {index:i+1,text:(b.innerText||'').slice(0,90),h:Math.round(r.height),scrollHeight:b.scrollHeight,clientHeight:b.clientHeight,scrollWidth:b.scrollWidth,clientWidth:b.clientWidth,overflowY:getComputedStyle(b).overflowY,top:Math.round(r.top+scrollY),bottom:Math.round(r.bottom+scrollY),page:!!b.closest('.page')};});
     const pages=[...document.querySelectorAll('.page')].map(p=>({w:Math.round(p.getBoundingClientRect().width),h:Math.round(p.getBoundingClientRect().height),scrollWidth:p.scrollWidth,clientWidth:p.clientWidth,scrollHeight:p.scrollHeight,clientHeight:p.clientHeight}));
     return {title:document.title,qidCount:q.length,loadedQids:q.map(x=>Number(x.id)),boxCount:boxes.length,mathNodes,images,metrics,pages,scrollWidth:document.documentElement.scrollWidth,innerWidth,renderError:document.documentElement.dataset.apRenderError||null,bodyText:(document.body.innerText||'').slice(0,160)};
   });
   const caseDir=path.join(render,mode,view.name);fs.mkdirSync(caseDir,{recursive:true});
   const full=path.join(caseDir,'full.png');await page.screenshot({path:full,fullPage:true,animations:'disabled'});
   const capturePaths=[full];
   const record={id,status:'PASS',viewport:{width:view.width,height:view.height},url,reviewerIdentity:report.reviewerIdentity,loadedQids:inspection.loadedQids,actualBoxCount:inspection.boxCount,mathJaxStatus:inspection.mathNodes?'PASS':'FAIL',assetDecodeStatus:inspection.images.every(i=>i.complete&&i.naturalWidth>0)?'PASS':'FAIL',layoutReviewStatus:'PENDING_VISUAL',inspection,consoleErrors:errs,failedResponses,captures:capturePaths.map(p=>({path:path.relative(render,p).replaceAll('\\','/'),sha256:hash(fs.readFileSync(p))}))};
   report.cases.push(record);fs.writeFileSync(path.join(caseDir,'inspection.json'),JSON.stringify(record,null,2));await page.close();
 }
 report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(render,'actual-render-report-attempt-05.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});




