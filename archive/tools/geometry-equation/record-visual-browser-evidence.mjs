import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {repoRoot,assertOutput,launchBrowser} from './visual-browser-runtime.mjs';
import {sha256} from './verify-visual-engine-static.mjs';
import {collectRenderedLayout,analyzeRenderedLayout} from './verify-rendered-layout.mjs';

export async function recordArchiveEvidence({run,attempt='attempt-01'}) {
  if(!/^[A-Za-z0-9_-]+$/.test(attempt))throw Error('INVALID_EVIDENCE_ATTEMPT');
  run=assertOutput(run);const matrix=JSON.parse(fs.readFileSync(path.join(run,'archive-render-matrix.json'),'utf8'));
  if(matrix.synthetic!==false||sha256(fs.readFileSync(path.join(repoRoot,'archive/engine.html')))!==matrix.engineSha256)throw Error('STALE_ENGINE_MATRIX');
  const overrides=new Map(matrix.sources.map(v=>['/'+v.sourcePath,path.join(repoRoot,v.candidatePath)]));
  for(const source of matrix.sources){if(sha256(fs.readFileSync(path.join(repoRoot,source.sourcePath)))!==source.sourceSha256||sha256(fs.readFileSync(path.join(repoRoot,source.candidatePath)))!==source.candidateSha256)throw Error('STALE_SOURCE_MATRIX');for(const asset of source.assets)if(sha256(fs.readFileSync(path.join(repoRoot,asset.path)))!==asset.sha256)throw Error('STALE_ASSET_MATRIX');}
  const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff':'font/woff','.woff2':'font/woff2','.ico':'image/x-icon'};
  const server=http.createServer((req,res)=>{
    try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=overrides.get(pathname)||path.resolve(repoRoot,'.'+pathname);const extension=path.extname(file).toLowerCase();if(!file.startsWith(path.resolve(repoRoot)+path.sep)||!types[extension]||!fs.existsSync(file)){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':types[extension],'Cache-Control':'no-store'});res.end(fs.readFileSync(file));}catch(error){res.writeHead(400);res.end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
  const browser=await launchBrowser();const rows=[];const folder=assertOutput(path.join(run,'archive-render',attempt));fs.mkdirSync(folder,{recursive:true});
  try {
    for(const item of matrix.rows) {
      const page=await browser.newPage({viewport:{width:item.width,height:item.height}});const consoleErrors=[];const responses=[];const responsePromises=[];
      page.on('pageerror',error=>consoleErrors.push(String(error)));
      page.on('response',r=>{responsePromises.push((async()=>{try{const bytes=await r.body();responses.push({url:r.url(),status:r.status(),sha256:sha256(bytes),bytes:bytes.length});}catch(error){responses.push({url:r.url(),status:r.status(),error:String(error)});}})());});
      const prefix=item.id+'-'+item.mode+'-'+item.viewport;const errors=[];let state={};const layouts=[];
      try {
        await page.goto(base+item.urlPath,{waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForFunction(({mode,count})=>{
          const root=document.getElementById('print-area');
          if(!root||!root.querySelector('.page'))return false;
          const readiness=document.documentElement.dataset.apPrintReadiness;
          if(readiness){const state=JSON.parse(readiness);if(state.failed||!['RENDER_READY','PRINT_READY'].includes(state.state))return false;}
          const numbers=[...root.querySelectorAll(mode==='ans'?'.ans-n':'.q-num')].map(v=>v.textContent.match(/^\s*(\d+)/)?.[1]).filter(Boolean);
          return new Set(numbers).size===count;
        },{mode:item.mode,count:item.questionCount},{timeout:60000});
        await page.evaluate(async()=>{if(window.MathJax?.startup?.promise)await window.MathJax.startup.promise;await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));if(window.APPrintRuntime?.waitUntilReady)await window.APPrintRuntime.waitUntilReady();});
        state=await page.evaluate(({mode,assets})=>{
          const root=document.getElementById('print-area');
          const numberNodes=[...root.querySelectorAll(mode==='ans'?'.ans-n':'.q-num')];
          const numbers=numberNodes.map(v=>v.textContent.match(/^\s*(\d+)/)?.[1]).filter(Boolean);const count=new Set(numbers).size;
          const images=[...root.querySelectorAll('img')];const targets=assets.map(asset=>{const image=images.find(i=>i.src.includes('/'+asset.path.replace(/^archive\//,'')));const b=image?.getBoundingClientRect();return{id:asset.id,src:image?.src||'',loaded:!!image?.complete&&image.naturalWidth>0,rect:b?{x:b.x,y:b.y,width:b.width,height:b.height}:null};});
          const overflow=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)>innerWidth+2;
          return{questionBlocks:count,rawQuestionBlocks:numberNodes.length,lastQuestionNo:Math.max(...numbers.map(Number)),pageCount:root.querySelectorAll('.page').length,readiness:document.documentElement.dataset.apPrintReadiness||null,targets,horizontalOverflow:overflow,errorText:document.documentElement.dataset.apRenderError||'',mathJaxReady:!!window.MathJax?.startup?.document,allImagesLoaded:images.every(i=>i.complete&&i.naturalWidth>0),imageCount:images.length};
        },{mode:item.mode,assets:item.assets});
        if(state.questionBlocks!==item.questionCount)errors.push('ARCHIVE_QCOUNT_FAIL');
        if(!state.pageCount||!state.mathJaxReady||state.errorText)errors.push('ARCHIVE_RENDER_NOT_READY');
        if(state.horizontalOverflow)errors.push('ARCHIVE_HORIZONTAL_OVERFLOW');
        if(!state.allImagesLoaded)errors.push('ARCHIVE_IMAGE_LOAD_FAIL');
        if(item.mode==='sol')for(const target of state.targets) {
          if(!target.loaded){errors.push('TARGET_SVG_LOAD_FAIL:'+target.id);continue;}
          const asset=item.assets.find(v=>v.id===target.id);
          const inspector=await browser.newPage({viewport:{width:Math.max(1,Math.ceil(target.rect.width)),height:Math.max(1,Math.ceil(target.rect.height))}});
          await inspector.setContent(fs.readFileSync(path.join(repoRoot,asset.path),'utf8'));const capture=await collectRenderedLayout(inspector);const result=analyzeRenderedLayout(capture);layouts.push({id:target.id,...result,svgSha256:asset.sha256,renderedContainer:target.rect});
          await inspector.close();if(result.status!=='PASS')errors.push(...result.errors.map(v=>target.id+':'+v));
          const matches=page.locator('#print-area .sol-image-wrap img[src*="'+asset.path.replace(/^archive\//,'')+'"]');
          if(await matches.count())await matches.first().screenshot({path:path.join(folder,prefix+'-'+target.id+'.png')});
        }
        await page.screenshot({path:path.join(folder,prefix+'.png'),fullPage:true});
      }catch(error){errors.push(String(error.stack||error));await page.screenshot({path:path.join(folder,prefix+'-error.png'),fullPage:true}).catch(()=>{});}
      await Promise.allSettled(responsePromises);if(consoleErrors.length)errors.push(...consoleErrors);
      const row={id:prefix,status:errors.length?'FAIL':'PASS',mode:item.mode,viewport:item.viewport,runtime:'playwright-chromium',synthetic:false,url:base+item.urlPath,sourceSha256:item.sourceSha256,candidateSha256:item.candidateSha256,engineSha256:matrix.engineSha256,browserVersion:browser.version(),state,layouts,responses,errors,
        capture:Object.keys(state).length?{status:'MEASURED',missingGlyphCount:layouts.reduce((s,v)=>s+v.missingGlyphCount,0),labelCollisionCount:layouts.reduce((s,v)=>s+v.labelCollisionCount,0),criticalCollisionCount:layouts.reduce((s,v)=>s+v.criticalCollisionCount,0),clippedTextCount:layouts.reduce((s,v)=>s+v.clippedTextCount,0),overflowCount:Number(state.horizontalOverflow||false)+layouts.reduce((s,v)=>s+v.overflowCount,0),loadedSvgCount:item.mode==='sol'?state.targets?.filter(v=>v.loaded).length||0:0,failedSvgCount:item.mode==='sol'?state.targets?.filter(v=>!v.loaded).length||0:0}:{status:'NOT_MEASURED',missingGlyphCount:null,labelCollisionCount:null,criticalCollisionCount:null,clippedTextCount:null,overflowCount:null,loadedSvgCount:null,failedSvgCount:null}};
      fs.writeFileSync(path.join(folder,prefix+'.json'),JSON.stringify(row,null,2)+'\n');rows.push(row);await page.close();
    }
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
  const result={status:rows.every(v=>v.status==='PASS')?'PASS':'FAIL',runtime:'playwright-chromium',synthetic:false,scope:'bound code regression candidates in unmodified archive runtime',rows:rows.map(v=>({id:v.id,status:v.status,capture:v.capture,errors:v.errors})),matrixSha256:sha256(fs.readFileSync(path.join(run,'archive-render-matrix.json')))};
  fs.writeFileSync(path.join(folder,'summary.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=k=>process.argv[process.argv.indexOf(k)+1];const result=await recordArchiveEvidence({run:arg('--run'),attempt:process.argv.includes('--attempt')?arg('--attempt'):'attempt-01'});console.log(JSON.stringify(result));if(result.status!=='PASS')process.exitCode=1;
}
