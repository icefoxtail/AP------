import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {bytesSha,canonicalJson,objectSha,safePath} from '../../pipeline-core/canonical.mjs';
import {typesetter,composeTypographyProbe} from './typography.mjs';
import {calculationStage,commitStage} from './store.mjs';
import {dependency,dependencyRoot} from './dependencies.mjs';
import {repoRoot} from './run.mjs';

export const typographyLabels=[
  {id:'korean',kind:'TEXT',text:'수선의 발과 선분의 길이',owner:'H'},
  {id:'fraction-root',kind:'MATH',tex:String.raw`\frac{40}{3}+\sqrt{2}`,owner:'length'},
  {id:'power-sub-prime',kind:'MATH',tex:String.raw`x^2+x_1+f^{\prime}(x)`,owner:'function'},
  {id:'pi-degree-unit',kind:'MATH',tex:String.raw`\pi+40^{\circ}+5\,\mathrm{cm}`,owner:'angle'},
  {id:'entity',kind:'MATH',tex:String.raw`\mathrm{AB}\quad A\cdot B`,owner:'AB'},
  {id:'precedence',kind:'MATH',tex:String.raw`(x+1)\cdot 2\quad x-(y-z)`,owner:'expression'},
].map(l=>({...l,factRole:'DERIVED_INTERMEDIATE',fontPx:20}));

export async function runTypographySpike() {
  const fontPath=path.join(dependencyRoot,'NotoSansKR.ttf');
  const fontSha256=bytesSha(fs.readFileSync(fontPath));
  const identity={questionUid:'synthetic-typography-spike|1',visualAssetKey:objectSha({role:'typography-spike'})};
  const t=typesetter({fontPath,fontSha256});const fragments=typographyLabels.map(l=>t(l,identity));
  const svg=composeTypographyProbe(fragments);const svgSha256=bytesSha(Buffer.from(svg));
  const tallSvg=composeTypographyProbe(fragments,{gap:40});const tallSha256=bytesSha(Buffer.from(tallSvg));
  const typeset=await calculationStage(repoRoot,{stage:'TYPESET',key:objectSha({svgSha256,tallSha256,fontSha256,labels:typographyLabels}),provenance:identity},async()=>({'visual.svg':svg,'tall-negative.svg':tallSvg,'fragments.json':canonicalJson(fragments)}));
  const normalAsset=typeset.receipt.outputs.find(r=>r.path.endsWith('/visual.svg'));
  const tallAsset=typeset.receipt.outputs.find(r=>r.path.endsWith('/tall-negative.svg'));
  const sourcePath='/archive/exams/original/middle/m3/2mid/phase0-2-typography-spike.js';
  const bank='window.examTitle="조판 전달 spike";window.questionBank='+JSON.stringify(['full','medium'].map((size,i)=>({id:i+1,content:'조판 전달 회귀',answer:'회귀',solution:'한글과 수학 기호를 확인한다.',solutionImage:(i?tallAsset:normalAsset).path.replace(/^archive\//,''),solutionImageSize:size})))+';';
  const bankSha256=bytesSha(Buffer.from(bank));
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.json':'application/json','.png':'image/png','.ico':'image/x-icon'};
  const server=http.createServer((req,res)=>{
    try{
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(pathname===sourcePath){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});res.end(bank);return;}
      const file=safePath(repoRoot,pathname.slice(1));const type=mime[path.extname(file)];
      if(!type||!fs.statSync(file).isFile())throw Error('NOT_FOUND');
      res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(fs.readFileSync(file));
    }catch{res.writeHead(404);res.end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    const {chromium}=dependency('playwright');
    browser=await chromium.launch({headless:true,...(process.env.GEOMETRY_BROWSER_EXECUTABLE?{executablePath:process.env.GEOMETRY_BROWSER_EXECUTABLE}:{channel:'chrome'})});
    const page=await browser.newPage({viewport:{width:1440,height:1000}});const responses=[],pending=[],pageErrors=[];
    page.on('pageerror',e=>pageErrors.push(String(e)));
    page.on('response',r=>pending.push((async()=>{try{responses.push({url:r.url(),status:r.status(),sha256:bytesSha(await r.body())});}catch{}})()));
    const base='http://127.0.0.1:'+server.address().port;
    const url=base+'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace('/archive/',''));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>{
      const imgs=[...document.querySelectorAll('#print-area .sol-image-wrap img')].filter(i=>i.getBoundingClientRect().width>0);
      return imgs.length===2&&imgs.every(i=>i.complete&&i.naturalWidth>0);
    },null,{timeout:60000});
    await page.evaluate(async()=>{if(window.MathJax?.startup?.promise)await window.MathJax.startup.promise;await document.fonts.ready;if(window.APPrintRuntime?.waitUntilReady)await window.APPrintRuntime.waitUntilReady();});
    const images=await page.evaluate(()=>[...document.querySelectorAll('#print-area .sol-image-wrap img')].filter(i=>i.getBoundingClientRect().width>0).map(i=>{const r=i.getBoundingClientRect();return {src:i.src,width:r.width,height:r.height,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight};}));
    const observations=[];
    for(const [index,image] of images.entries()){
      const scale=Math.min(image.width/image.naturalWidth,image.height/image.naturalHeight);
      const inspector=await browser.newPage();
      await inspector.setContent(index?tallSvg:svg);
      const boxes=await inspector.evaluate(()=>[...document.querySelectorAll('svg > g[data-label-id]')].map(g=>{const b=g.getBBox();return {id:g.dataset.labelId,x:b.x,y:b.y,width:b.width,height:b.height};}));
      await inspector.close();
      if(boxes.length!==fragments.length || boxes.some(b=>b.width<=0||b.height<=0))throw Error('ACTUAL_FRAGMENT_BBOX_MISSING');
      observations.push({size:index===0?'full':'medium',image,scale,boxes,minCssFont:20*scale,status:20*scale>=11?'PASS':'FAIL',measurementMode:'OUTLINE_BBOX_REPLAY_AT_ACTUAL_IMG_SCALE'});
    }
    const screenshot=await page.screenshot({fullPage:true});
    await Promise.allSettled(pending);
    const errors=[...pageErrors];
    if(!responses.some(r=>r.url===base+sourcePath&&r.sha256===bankSha256))errors.push('BANK_RESPONSE_HASH_MISMATCH');
    if(images.some((i,index)=>!responses.some(r=>r.url===i.src&&r.sha256===(index?tallSha256:svgSha256))))errors.push('IMG_RESPONSE_HASH_MISMATCH');
    if(observations[0].status!=='PASS')errors.push('FULL_FONT_GATE_FAIL');
    if(observations[1].status!=='FAIL')errors.push('MEDIUM_NEGATIVE_NOT_DETECTED');
    const result={scope:'SYNTHETIC_TYPOGRAPHY_IN_ACTUAL_UNMODIFIED_ARCHIVE',status:errors.length?'FAIL':'PASS',productionAuthorized:false,independentVisualReview:'NOT_RUN',svgSha256,tallSha256,fontSha256,bankSha256,engineSha256:bytesSha(fs.readFileSync(path.join(repoRoot,'archive/engine.html'))),screenshotSha256:bytesSha(screenshot),browserVersion:browser.version(),viewport:{width:1440,height:1000},mode:'sol',fit:'NONE',observations,responses,errors};
    const receipt=commitStage(repoRoot,{stage:'CAPTURE',key:objectSha({svgSha256,invocation:crypto.randomUUID()}),provenance:{identity,typesetManifest:typeset.receipt.manifestRef},outputs:{'browser.json':canonicalJson(result),'archive.png':screenshot,'fixture-bank.js':bank}});
    return {result,receipt};
  } finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const {result,receipt}=await runTypographySpike();console.log(JSON.stringify({status:result.status,observations:result.observations.map(({size,minCssFont,status})=>({size,minCssFont,status})),manifest:receipt.manifestRef}));
  if(result.status!=='PASS')process.exitCode=1;
}
