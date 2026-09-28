import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const repo=process.cwd();
const setKey='비상_공통수학2_평면좌표_중단원학습점검_고1';
const jsFile=path.resolve(repo,'archive-work/textbooks/visang-common2/middle/geometry/평면좌표/js',`${setKey}.js`);
const evidence=path.resolve(repo,'archive-work/textbooks/visang-common2/middle/geometry/평면좌표/evidence',setKey);
const route='/archive/exams/__visang_plane_coordinates_candidate__.js';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/favicon.ico'||url.pathname==='/apple-touch-icon.png'){res.writeHead(204);res.end();return;}
  if(url.pathname===route){res.writeHead(200,{'content-type':mime['.js'],'cache-control':'no-store'});res.end(fs.readFileSync(jsFile));return;}
  let decoded;try{decoded=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end('bad path');return;}
  const file=path.resolve(repo,'.'+decoded);
  if(file!==repo&&!file.startsWith(repo+path.sep)){res.writeHead(403);res.end('forbidden');return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('not found');return;}res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);});
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
let browser;
try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  const rows=[];
  for(const mode of ['exam','sol','ans']){
    const page=await browser.newPage({viewport:{width:1280,height:1000},deviceScaleFactor:1});
    const consoleErrors=[],pageErrors=[],requestFailures=[],responseErrors=[];
    page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
    page.on('pageerror',e=>pageErrors.push(String(e)));
    page.on('requestfailed',r=>requestFailures.push(`${r.url()}: ${r.failure()?.errorText||'failed'}`));
    const url=`http://127.0.0.1:${port}/archive/engine.html?data=exams%2F__visang_plane_coordinates_candidate__.js&mode=${mode}&qpp=4`;
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(m=>{
      if(m==='exam')return document.querySelectorAll('#print-area .q-box').length>0;
      if(m==='sol')return document.querySelectorAll('#print-area .sol-box').length>0;
      return document.querySelectorAll('#print-area .ans-n').length>0;
    },mode,{timeout:30000});
    await page.evaluate(()=>document.fonts?.ready);
    await page.waitForTimeout(700);
    const measured=await page.evaluate(m=>{
      const count=m==='exam'?document.querySelectorAll('#print-area .q-box').length:m==='sol'?document.querySelectorAll('#print-area .sol-box').length:document.querySelectorAll('#print-area .ans-n').length;
      const imgs=[...document.querySelectorAll('#print-area img')].map(i=>({src:i.getAttribute('src'),complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight}));
      const pages=document.querySelectorAll('#print-area .page').length;
      const errorText=[...document.querySelectorAll('.error,.load-error')].map(x=>x.textContent.trim()).filter(Boolean);
      const root=document.documentElement;
      const staging=document.querySelector('#print-area');
      return {count,pages,imgs,errorText,mathJaxContainers:document.querySelectorAll('#print-area mjx-container').length,overflow:root.scrollWidth>root.clientWidth+2,printAreaWidth:staging?.scrollWidth||0,viewportWidth:root.clientWidth,engineDataError:document.body.innerText.includes('시험지 데이터가 전달되지 않았습니다')||document.body.innerText.includes('시험지 데이터를 불러올 수 없습니다')};
    },mode);
    const brokenImages=measured.imgs.filter(i=>!i.complete||i.naturalWidth<=0);
    const expected=4;
    const pass=measured.count===expected&&measured.errorText.length===0&&!measured.engineDataError&&brokenImages.length===0&&consoleErrors.length===0&&pageErrors.length===0&&requestFailures.length===0&&responseErrors.length===0&&!measured.overflow&&(mode!=='sol'||measured.mathJaxContainers>0);
    const screenshot=`browser-render-${mode}.png`;
    await page.screenshot({path:path.join(evidence,screenshot),fullPage:true,animations:'disabled'});
    rows.push({mode,status:pass?'PASS':'FAIL',expectedCount:expected,...measured,brokenImages,consoleErrors,pageErrors,requestFailures,responseErrors,screenshot});
    await page.close();
  }
  const report={schemaVersion:'candidate-browser-render-v1',runtime:'local archive/engine.html with task-local HTTP route serving assigned candidate JS; no production copy',status:rows.every(r=>r.status==='PASS')?'PASS':'FAIL',modes:rows};
  fs.writeFileSync(path.join(evidence,'browser-render-report.json'),JSON.stringify(report,null,2)+'\n','utf8');
  console.log(JSON.stringify(report,null,2));
  if(report.status!=='PASS')process.exitCode=1;
}finally{if(browser)await browser.close();server.close();}


