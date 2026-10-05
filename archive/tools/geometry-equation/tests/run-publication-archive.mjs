/** Synthetic fixture bank served to the real unmodified Archive engine.
 * No source exam or production SVG is created/modified. This checks integration,
 * not the ten-exam FULL REBUILD, student content, or independent visual approval.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {repoRoot,launchBrowser} from '../visual-browser-runtime.mjs';
import {sha256} from '../verify-visual-engine-static.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
const folder=path.join(repoRoot,'archive/_generated/geometry-visual-engine/publication-tests');
const fixtures=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
const sourcePath='/archive/exams/original/middle/m3/2mid/25_publication_fixture.js';
const bank='window.examTitle="도형 엔진 회귀 테스트";window.questionBank='+JSON.stringify(fixtures.map((f,i)=>({id:i+1,content:'도형의 관계를 확인하시오.',answer:'회귀 테스트',solution:'점, 선분, 각도와 영역의 관계를 확인한다.',solutionImage:f.svg.replace(/^archive\//,''),solutionImageAlt:'도형 엔진 synthetic fixture '+f.id,solutionImageSize:'full'})))+';';
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  try{
    if(req.method!=='GET'){res.writeHead(405);res.end();return;}
    const requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(requested===sourcePath){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});res.end(bank);return;}
    const file=path.resolve(repoRoot,'.'+requested),type=types[path.extname(file)];
    if(!file.startsWith(path.resolve(repoRoot)+path.sep)||!type||!fs.existsSync(file)||!fs.realpathSync(file).startsWith(fs.realpathSync(repoRoot)+path.sep)){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(fs.readFileSync(file));
  }catch{res.writeHead(400);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;const errors=[],rows=[],responses=[],pending=[],pageErrors=[];
const result={scope:'SYNTHETIC_FIXTURES_IN_UNMODIFIED_ARCHIVE',mode:'sol',viewport:{width:390,height:844},publicationAuthorized:false,engineSha256:sha256(fs.readFileSync(path.join(repoRoot,'archive/engine.html'))),fixtureBankSha256:sha256(bank),rows,errors};
try{
  browser=await launchBrowser();const page=await browser.newPage({viewport:result.viewport});
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('response',r=>pending.push((async()=>{try{responses.push({url:r.url(),status:r.status(),sha256:sha256(await r.body())});}catch{}})()));
  const base='http://127.0.0.1:'+server.address().port;
  result.url=base+'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace('/archive/',''));
  await page.goto(result.url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(count=>{
    const area=document.querySelector('#print-area');
    const imgs=[...(area?.querySelectorAll('.sol-image-wrap img')||[])].filter(i=>i.getBoundingClientRect().width>0);
    return !!area?.querySelector('.page')&&imgs.length===count&&imgs.every(i=>i.complete&&i.naturalWidth>0);
  },fixtures.length,{timeout:60000});
  await page.evaluate(async()=>{if(window.MathJax?.startup?.promise)await window.MathJax.startup.promise;await document.fonts.ready;if(window.APPrintRuntime?.waitUntilReady)await window.APPrintRuntime.waitUntilReady();});
  const state=await page.evaluate(()=>({mode:document.querySelector('#btn-sol')?.classList.contains('active'),mathJaxReady:!!window.MathJax?.startup?.document,readiness:document.documentElement.dataset.apPrintReadiness||'',renderError:document.documentElement.dataset.apRenderError||'',overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)>innerWidth+2,images:[...document.querySelectorAll('#print-area .sol-image-wrap img')].map(i=>{const b=i.getBoundingClientRect();return{src:i.src,loaded:i.complete&&i.naturalWidth>0,width:b.width,height:b.height};}).filter(i=>i.width>0)}));
  result.state=state;
  if(!state.mode||!state.mathJaxReady||state.renderError||state.overflow)errors.push('ARCHIVE_RENDER_STATE_FAIL');
  if(state.readiness){const r=JSON.parse(state.readiness);if(r.failed||!['RENDER_READY','PRINT_READY'].includes(r.state))errors.push('ARCHIVE_READINESS_FAIL');}
  for(const f of fixtures){
    const target=state.images.find(i=>decodeURIComponent(new URL(i.src).pathname)==='/'+f.svg);
    if(!target?.loaded)throw Error('ARCHIVE_TARGET_LOAD_FAIL:'+f.id);
    const bytes=fs.readFileSync(path.join(repoRoot,f.svg));if(sha256(bytes)!==f.svgSha256)throw Error('STALE_FIXTURE:'+f.id);
    const inspector=await browser.newPage({viewport:{width:390,height:844}});
    const capture=await captureAtDisplaySize(inspector,bytes.toString('utf8'),target);
    const layout=analyzeRenderedLayout(capture);await inspector.close();
    rows.push({id:f.id,status:layout.status,svgSha256:f.svgSha256,actualImage:target,measurementMode:'ISOLATED_REPLAY_AT_ACTUAL_ARCHIVE_IMAGE_SIZE',minCssFont:Math.min(...capture.labels.map(l=>l.effectiveFontPx)),errors:layout.errors});
    fs.writeFileSync(path.join(folder,f.id+'.archive-layout.json'),JSON.stringify({capture,layout},null,2));
    const image=page.locator('#print-area .sol-image-wrap img').filter({visible:true});
    for(let i=0;i<await image.count();i++)if(await image.nth(i).getAttribute('src')&&decodeURIComponent(new URL(await image.nth(i).evaluate(e=>e.src)).pathname)==='/'+f.svg){await image.nth(i).screenshot({path:path.join(folder,f.id+'.archive.png')});break;}
    if(layout.status!=='PASS')errors.push('ARCHIVE_LAYOUT_FAIL:'+f.id);
  }
  await page.screenshot({path:path.join(folder,'archive-390.png'),fullPage:true});
  await Promise.allSettled(pending);
  if(!responses.some(r=>new URL(r.url).pathname===sourcePath&&r.status===200&&r.sha256===result.fixtureBankSha256))errors.push('ACTUAL_BANK_SHA_MISMATCH');
  for(const row of rows)if(!responses.some(r=>r.url===row.actualImage.src&&r.status===200&&r.sha256===row.svgSha256))errors.push('ACTUAL_LOADED_ASSET_SHA_MISMATCH:'+row.id);
  if(pageErrors.length)errors.push(...pageErrors);
}catch(e){errors.push(String(e.stack||e));}
finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
result.status=errors.length?'FAIL':'PASS';result.responses=responses;result.browser=browser?.version();
fs.writeFileSync(path.join(folder,'archive-summary.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
