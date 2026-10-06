import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {repoRoot,assertOutput,launchBrowser} from './visual-browser-runtime.mjs';
import {sha256} from './verify-visual-engine-static.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from './verify-rendered-layout.mjs';
import {fileRef,readBoundFile} from '../pipeline-core/canonical.mjs';
import {loadBank} from './build-visual-render-matrix.mjs';

export function normalizeArchiveImageUrlPath(url){
  try{return decodeURIComponent(new URL(url,'http://archive.invalid').pathname);}catch{return null;}
}

function writeArchiveAbortEvidence(run,attempt,cleanup){
  const folder=assertOutput(path.join(run,'archive-render',attempt));fs.mkdirSync(folder,{recursive:true});
  const evidence={schemaVersion:'ARCHIVE_BROWSER_CAPTURE_ABORTED_v1',status:'ABORTED',attempt,reason:'ARCHIVE_CAPTURE_CANCELLED',cleanup};
  const abortPath=path.join(folder,'ABORTED.json');fs.writeFileSync(abortPath,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
  const error=Error('ARCHIVE_CAPTURE_CANCELLED');error.code='ARCHIVE_CAPTURE_CANCELLED';error.cleanup=cleanup;error.abortEvidenceRef=path.relative(repoRoot,abortPath).replaceAll('\\','/');return error;
}

function persistArchiveAbortEvidence(run,attempt,error,cleanup){
  const folder=assertOutput(path.join(run,'archive-render',attempt));fs.mkdirSync(folder,{recursive:true});
  const evidence={schemaVersion:'ARCHIVE_BROWSER_CAPTURE_ABORTED_v1',status:'ABORTED',attempt,reason:'ARCHIVE_CAPTURE_CANCELLED',cleanup};
  const abortPath=path.join(folder,'ABORTED.json');
  if(fs.existsSync(abortPath)){
    const previous=JSON.parse(fs.readFileSync(abortPath,'utf8'));
    if(previous.schemaVersion!=='ARCHIVE_BROWSER_CAPTURE_ABORTED_v1'||previous.status!=='ABORTED'||previous.attempt!==attempt||previous.reason!=='ARCHIVE_CAPTURE_CANCELLED')throw Error('ARCHIVE_ABORT_EVIDENCE_CONFLICT');
  }else fs.writeFileSync(abortPath,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
  error.code='ARCHIVE_CAPTURE_CANCELLED';error.cleanup=cleanup;error.abortEvidenceRef=path.relative(repoRoot,abortPath).replaceAll('\\','/');return error;
}

export async function recordArchiveEvidence({run,attempt='attempt-01',signal,onProgress,blockExternalRequests=false}={}) {
  if(signal!==undefined&&(!signal||typeof signal.aborted!=='boolean'||typeof signal.addEventListener!=='function'||typeof signal.removeEventListener!=='function'))throw Error('ARCHIVE_CAPTURE_SIGNAL_INVALID');
  if(onProgress!==undefined&&typeof onProgress!=='function')throw Error('ARCHIVE_PROGRESS_HOOK_INVALID');
  if(typeof blockExternalRequests!=='boolean')throw Error('ARCHIVE_NETWORK_POLICY_INVALID');
  if(!/^[A-Za-z0-9_-]+$/.test(attempt))throw Error('INVALID_EVIDENCE_ATTEMPT');
  run=assertOutput(run);if(signal?.aborted)throw writeArchiveAbortEvidence(run,attempt,{serverWasListening:false,browserWasLaunched:false,browserClosed:true,serverClosed:true});
  const matrix=JSON.parse(fs.readFileSync(path.join(run,'archive-render-matrix.json'),'utf8'));
  if(matrix.synthetic!==false||sha256(fs.readFileSync(path.join(repoRoot,'archive/engine.html')))!==matrix.engineSha256)throw Error('STALE_ENGINE_MATRIX');
  const overrides=new Map(matrix.sources.map(v=>['/'+v.sourcePath,assertOutput(path.join(repoRoot,v.candidatePath))]));
  for(const source of matrix.sources)for(const asset of source.assets||[])if(asset.archivePath){
    if(!/^assets\/images\/[\p{L}\p{N}_.\/-]+$/u.test(asset.archivePath)||asset.archivePath.split('/').some(part=>!part||part==='.'||part==='..'))throw Error('INVALID_ARCHIVE_ASSET_REFERENCE');
    overrides.set('/archive/'+asset.archivePath,assertOutput(path.join(repoRoot,asset.path)));
  }
  for(const source of matrix.sources){if(sha256(fs.readFileSync(path.join(repoRoot,source.sourcePath)))!==source.sourceSha256||sha256(fs.readFileSync(assertOutput(path.join(repoRoot,source.candidatePath))))!==source.candidateSha256)throw Error('STALE_SOURCE_MATRIX');for(const asset of source.assets||[])if(sha256(fs.readFileSync(assertOutput(path.join(repoRoot,asset.path))))!==asset.sha256)throw Error('STALE_ASSET_MATRIX');}
  const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff':'font/woff','.woff2':'font/woff2','.ico':'image/x-icon'};
  const server=http.createServer((req,res)=>{
    try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=overrides.get(pathname)||path.resolve(repoRoot,'.'+pathname);const extension=path.extname(file).toLowerCase();if(!file.startsWith(path.resolve(repoRoot)+path.sep)||!types[extension]||!fs.existsSync(file)){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':types[extension],'Cache-Control':'no-store'});res.end(fs.readFileSync(file));}catch(error){res.writeHead(400);res.end();}
  });
  let browser=null,serverWasListening=false,browserClosePromise=null,serverClosePromise=null,browserCloseError=null,serverCloseError=null,cancellationError=null,base='';
  const closeBrowser=()=>{if(!browser)return Promise.resolve();browserClosePromise||=browser.close().catch(error=>{browserCloseError=String(error);});return browserClosePromise;};
  const closeServer=()=>{if(!server.listening)return serverClosePromise||Promise.resolve();serverClosePromise||=new Promise(resolve=>{server.close(error=>{if(error)serverCloseError=String(error);resolve();});server.closeAllConnections?.();});return serverClosePromise;};
  const makeCancellationError=()=>{if(!cancellationError){cancellationError=Error('ARCHIVE_CAPTURE_CANCELLED');cancellationError.code='ARCHIVE_CAPTURE_CANCELLED';}return cancellationError;};
  const checkCancelled=()=>{if(signal?.aborted)throw makeCancellationError();};
  const abortListener=()=>{makeCancellationError();if(server.listening){server.closeAllConnections?.();void closeServer();}if(browser)void closeBrowser();};
  signal?.addEventListener('abort',abortListener,{once:true});
  const rows=[],folder=assertOutput(path.join(run,'archive-render',attempt));fs.mkdirSync(folder,{recursive:true});
  try {
    checkCancelled();
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});serverWasListening=true;
    checkCancelled();base='http://127.0.0.1:'+server.address().port;onProgress?.({event:'SERVER_LISTENING',attempt,port:server.address().port});
    browser=await launchBrowser();
    checkCancelled();onProgress?.({event:'BROWSER_LAUNCHED',attempt,browserVersion:browser.version()});
    for(const item of matrix.rows) {
      checkCancelled();
      const page=await browser.newPage({viewport:{width:item.width,height:item.height}});const consoleErrors=[];const responses=[];const responsePromises=[];const externalRequests=[];
      if(blockExternalRequests){
        const localOrigin=new URL(base).origin;
        await page.route('**/*',async route=>{
          const requestUrl=route.request().url();let origin;
          try{origin=new URL(requestUrl).origin;}catch{origin='';}
          if(origin===localOrigin||requestUrl.startsWith('data:')||requestUrl.startsWith('blob:'))return route.continue();
          externalRequests.push({url:requestUrl,resourceType:route.request().resourceType()});
          return route.abort('blockedbyclient');
        });
      }
      page.on('pageerror',error=>consoleErrors.push(String(error)));
      page.on('response',r=>{responsePromises.push((async()=>{try{const bytes=await r.body();responses.push({url:r.url(),status:r.status(),sha256:sha256(bytes),bytes:bytes.length});}catch(error){responses.push({url:r.url(),status:r.status(),error:String(error)});}})());});
      const prefix=item.id+'-'+item.mode+'-'+item.viewport;const errors=[];let state={};const layouts=[];
      try {
        await page.goto(base+item.urlPath,{waitUntil:'domcontentloaded',timeout:60000});checkCancelled();
        const readiness=page.waitForFunction(({mode,count})=>{
          const root=document.getElementById('print-area');
          if(!root||!root.querySelector('.page'))return false;
          const readiness=document.documentElement.dataset.apPrintReadiness;
          if(readiness){const state=JSON.parse(readiness);if(state.failed||!['RENDER_READY','PRINT_READY'].includes(state.state))return false;}
          const numbers=[...root.querySelectorAll(mode==='ans'?'.ans-n':'.q-num')].map(v=>v.textContent.match(/^\s*(\d+)/)?.[1]).filter(Boolean);
          return new Set(numbers).size===count;
        },{mode:item.mode,count:item.questionCount},{timeout:60000});
        const readinessResult=readiness.then(()=>null,error=>error);
        onProgress?.({event:'PAGE_READINESS_WAIT',attempt,rowId:item.id,urlPath:item.urlPath});
        const readinessError=await readinessResult;
        if(readinessError){if(signal?.aborted)checkCancelled();throw readinessError;}
        checkCancelled();
        await page.evaluate(async()=>{if(window.MathJax?.startup?.promise)await window.MathJax.startup.promise;await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));if(window.APPrintRuntime?.waitUntilReady)await window.APPrintRuntime.waitUntilReady();});checkCancelled();
        state=await page.evaluate(async({mode,assets,envelopeTargets})=>{
          const root=document.getElementById('print-area');
          const numberNodes=[...root.querySelectorAll(mode==='ans'?'.ans-n':'.q-num')];
          const numbers=numberNodes.map(v=>v.textContent.match(/^\s*(\d+)/)?.[1]).filter(Boolean);const count=new Set(numbers).size;
          const rect=b=>b?{x:b.x,y:b.y,width:b.width,height:b.height}:null;
          const styleRecord=e=>{const s=getComputedStyle(e);return{width:s.width,height:s.height,maxWidth:s.maxWidth,maxHeight:s.maxHeight,objectFit:s.objectFit,transform:s.transform,paddingLeft:s.paddingLeft,paddingRight:s.paddingRight,borderLeftWidth:s.borderLeftWidth,borderRightWidth:s.borderRightWidth};};
          const contentWidth=e=>{if(!e)return null;const r=e.getBoundingClientRect(),s=getComputedStyle(e),px=v=>parseFloat(v)||0;return r.width-px(s.paddingLeft)-px(s.paddingRight)-px(s.borderLeftWidth)-px(s.borderRightWidth);};
          const images=[...root.querySelectorAll('img')];const targets=assets.map(asset=>{
            const expected=asset.archivePath?'/archive/'+asset.archivePath:'/'+asset.path.replace(/^archive\//,'');
            const image=images.find(i=>{try{return decodeURIComponent(new URL(i.src).pathname)===expected;}catch{return false;}}),wrapper=image?.closest('.sol-image-wrap'),meta=image?.closest('.sol-meta'),box=image?.closest('.q-box');
            const b=image?.getBoundingClientRect();
            return{id:asset.id,src:image?.src||'',loaded:!!image?.complete&&image.naturalWidth>0,rect:rect(b),sizeClass:asset.sizeClass||wrapper?.className?.match(/image-(small|medium|large|full)/)?.[1]||null,naturalWidth:image?.naturalWidth||null,naturalHeight:image?.naturalHeight||null,computedStyle:image?styleRecord(image):null,wrapperRect:rect(wrapper?.getBoundingClientRect()),solutionMetaRect:rect(meta?.getBoundingClientRect()),solutionMetaContentWidth:contentWidth(meta),qBoxRect:rect(box?.getBoundingClientRect()),sourceRef:box?.dataset.sourceRef||null};
          });
          const displayEnvelopes=[];
          for(const target of envelopeTargets||[]){
            const number=Number(target.displayOrdinal||target.questionId);
            const box=[...root.querySelectorAll('.q-box')].find(candidate=>Number(candidate.querySelector('.q-num')?.textContent.match(/^\s*(\d+)/)?.[1])===number);
            const meta=box?.querySelector('.sol-meta'),qBoxRect=rect(box?.getBoundingClientRect()),solutionMetaRect=rect(meta?.getBoundingClientRect()),solutionMetaContentWidth=contentWidth(meta);
            const errors=[];if(!box)errors.push('ENVELOPE_TARGET_QBOX_MISSING');if(!meta)errors.push('ENVELOPE_TARGET_SOLUTION_META_MISSING');if(!Number.isFinite(solutionMetaContentWidth)||solutionMetaContentWidth<=0)errors.push('ENVELOPE_TARGET_SOLUTION_META_CONTENT_WIDTH_MISSING');
            const profiles=[];
            if(meta&&solutionMetaRect&&Number.isFinite(solutionMetaContentWidth)&&solutionMetaContentWidth>0){
              const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+target.intrinsicSvg.width+'" height="'+target.intrinsicSvg.height+'" viewBox="0 0 '+target.intrinsicSvg.width+' '+target.intrinsicSvg.height+'"><rect width="100%" height="100%" fill="white"/></svg>';
              const dataUrl='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
              for(const sizeClass of target.sizeClasses||[]){
              const host=document.createElement('div');host.style.cssText='position:fixed;left:-100000px;top:0;width:'+solutionMetaContentWidth+'px;margin:0;padding:0;border:0;overflow:visible;visibility:hidden;pointer-events:none;';
                const wrapper=document.createElement('span');wrapper.className='sol-image-wrap image-'+sizeClass;
                const image=document.createElement('img');image.src=dataUrl;wrapper.appendChild(image);host.appendChild(wrapper);document.body.appendChild(host);
                try{
                  await image.decode();const imageRect=rect(image.getBoundingClientRect()),wrapperRect=rect(wrapper.getBoundingClientRect()),computedStyle=styleRecord(image);
                  const chain=[image,wrapper,meta,box].map(node=>getComputedStyle(node).transform);
                  profiles.push({status:image.naturalWidth===target.intrinsicSvg.width&&image.naturalHeight===target.intrinsicSvg.height?'PASS':'FAIL',sizeClass,imageRect,wrapperRect,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,computedStyle,transformChain:chain});
                }catch(error){profiles.push({status:'FAIL',sizeClass,error:String(error)});}
                host.remove();
              }
            }
            displayEnvelopes.push({status:errors.length||profiles.some(p=>p.status!=='PASS')?'FAIL':'PASS',id:target.id,questionId:target.questionId,displayOrdinal:number,sourceRef:box?.dataset.sourceRef||null,sourceAuthorityStatus:target.sourceAuthorityStatus||'MEASUREMENT_ONLY',qBoxRect,solutionMetaRect,solutionMetaContentWidth,existingSolutionImage:meta?.querySelector('.sol-image-wrap img')?(()=>{const img=meta.querySelector('.sol-image-wrap img');return{src:img.src,rect:rect(img.getBoundingClientRect()),computedStyle:styleRecord(img)};})():null,intrinsicSvg:target.intrinsicSvg,profiles,errors});
          }
          const overflow=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)>innerWidth+2;
          return{questionBlocks:count,rawQuestionBlocks:numberNodes.length,lastQuestionNo:Math.max(...numbers.map(Number)),pageCount:root.querySelectorAll('.page').length,readiness:document.documentElement.dataset.apPrintReadiness||null,nativeRenderMetrics:document.documentElement.dataset.apRenderMetrics?JSON.parse(document.documentElement.dataset.apRenderMetrics):null,targets,displayEnvelopes,horizontalOverflow:overflow,errorText:document.documentElement.dataset.apRenderError||'',mathJaxReady:!!window.MathJax?.startup?.document,mathJaxSource:window.__AP_MATHJAX_SOURCE__||null,mathJaxCdnFallback:window.__AP_MATHJAX_SOURCE__==='cdn-fallback',qrRendererAvailable:typeof window.QRious==='function',allImagesLoaded:images.every(i=>i.complete&&i.naturalWidth>0),imageCount:images.length};
        },{mode:item.mode,assets:item.assets,envelopeTargets:item.envelopeTargets||[]});
        if(state.questionBlocks!==item.questionCount)errors.push('ARCHIVE_QCOUNT_FAIL');
        if(!state.pageCount||!state.mathJaxReady||state.errorText)errors.push('ARCHIVE_RENDER_NOT_READY');
        if(state.horizontalOverflow)errors.push('ARCHIVE_HORIZONTAL_OVERFLOW');
        if(!state.allImagesLoaded)errors.push('ARCHIVE_IMAGE_LOAD_FAIL');
        if(item.requireQrRenderer&&!state.qrRendererAvailable)errors.push('ARCHIVE_QR_RENDERER_NOT_LOADED');
        if(item.requireLocalResources&&(externalRequests.length||state.mathJaxCdnFallback))errors.push('ARCHIVE_EXTERNAL_RUNTIME_REQUEST_DETECTED');
        for(const envelope of state.displayEnvelopes||[])if(envelope.status!=='PASS')errors.push(...(envelope.errors||['DISPLAY_ENVELOPE_PROBE_FAIL']));
        if(item.mode==='sol')for(const target of state.targets) {
          if(!target.loaded){errors.push('TARGET_SVG_LOAD_FAIL:'+target.id);continue;}
          const asset=item.assets.find(v=>v.id===target.id);
          const inspector=await browser.newPage({viewport:{width:Math.max(1,Math.ceil(target.rect.width)),height:Math.max(1,Math.ceil(target.rect.height))}});
          const capture=await captureAtDisplaySize(inspector,fs.readFileSync(path.join(repoRoot,asset.path),'utf8'),target.rect);const result=analyzeRenderedLayout(capture);layouts.push({id:target.id,...result,svgSha256:asset.sha256,renderedContainer:target.rect,measurementMode:'ISOLATED_SVG_REPLAY_AT_ACTUAL_ARCHIVE_IMAGE_SIZE'});
          await inspector.close();if(result.status!=='PASS')errors.push(...result.errors.map(v=>target.id+':'+v));
          const expectedImagePath=asset.archivePath?'/archive/'+asset.archivePath:'/'+asset.path.replace(/^archive\//,'');
          const imageNodes=page.locator('#print-area .sol-image-wrap img');
          const matchingIndex=await imageNodes.evaluateAll((nodes,expected)=>nodes.findIndex(node=>{try{return decodeURIComponent(new URL(node.src).pathname)===expected;}catch{return false;}}),expectedImagePath);
          if(matchingIndex>=0){
            const matches=imageNodes.nth(matchingIndex);
            await matches.first().screenshot({path:path.join(folder,prefix+'-'+target.id+'.png')});
            const nativeBox=matches.first().locator('xpath=ancestor::div[contains(@class,"q-box")][1]');
            if(await nativeBox.count())await nativeBox.screenshot({path:path.join(folder,prefix+'-'+target.id+'-context.png')});
          }
        }
        await page.screenshot({path:path.join(folder,prefix+'.png'),fullPage:true});checkCancelled();
      }catch(error){if(signal?.aborted)throw makeCancellationError();errors.push(String(error.stack||error));await page.screenshot({path:path.join(folder,prefix+'-error.png'),fullPage:true}).catch(()=>{});}
      await Promise.allSettled(responsePromises);
      checkCancelled();
        if(item.mode==='sol')for(const target of state.targets||[]){const asset=item.assets.find(v=>v.id===target.id);if(!responses.some(v=>v.url===target.src&&v.status===200&&v.sha256===asset?.sha256))errors.push('ACTUAL_LOADED_ASSET_SHA_MISMATCH:'+target.id);}
        if(consoleErrors.length)errors.push(...consoleErrors);
      if(item.mode==='sol')for(const target of item.envelopeTargets||[]){const index=Number(target.displayOrdinal||target.questionId)-1;if(index>=0&&index<item.questionCount){const block=page.locator('#print-area .q-box').nth(index);if(await block.count())await block.screenshot({path:path.join(folder,prefix+'-'+target.id+'-envelope-context.png')});}}
      const row={id:prefix,status:errors.length?'FAIL':'PASS',mode:item.mode,viewport:item.viewport,runtime:'playwright-chromium',synthetic:false,url:base+item.urlPath,sourceSha256:item.sourceSha256,candidateSha256:item.candidateSha256,engineSha256:matrix.engineSha256,browserVersion:browser.version(),state,layouts,responses,errors,network:{policy:blockExternalRequests?'LOCAL_ONLY':'DEFAULT',localOrigin:base,externalRequests},
        capture:Object.keys(state).length?{status:'MEASURED',missingGlyphCount:layouts.reduce((s,v)=>s+v.missingGlyphCount,0),labelCollisionCount:layouts.reduce((s,v)=>s+v.labelCollisionCount,0),criticalCollisionCount:layouts.reduce((s,v)=>s+v.criticalCollisionCount,0),clippedTextCount:layouts.reduce((s,v)=>s+v.clippedTextCount,0),overflowCount:Number(state.horizontalOverflow||false)+layouts.reduce((s,v)=>s+v.overflowCount,0),loadedSvgCount:item.mode==='sol'?state.targets?.filter(v=>v.loaded).length||0:0,failedSvgCount:item.mode==='sol'?state.targets?.filter(v=>!v.loaded).length||0:0}:{status:'NOT_MEASURED',missingGlyphCount:null,labelCollisionCount:null,criticalCollisionCount:null,clippedTextCount:null,overflowCount:null,loadedSvgCount:null,failedSvgCount:null}};
      checkCancelled();fs.writeFileSync(path.join(folder,prefix+'.json'),JSON.stringify(row,null,2)+'\n');rows.push(row);await page.close();checkCancelled();
    }
    checkCancelled();
  }catch(error){if(signal?.aborted)throw makeCancellationError();throw error;}
  finally{
    await closeBrowser();await closeServer();
    if(cancellationError){
      cancellationError.cleanup={serverWasListening,browserWasLaunched:Boolean(browser),browserClosed:!browser||!browser.isConnected(),serverClosed:!server.listening,browserCloseError,serverCloseError};
      persistArchiveAbortEvidence(run,attempt,cancellationError,cancellationError.cleanup);
    }
    signal?.removeEventListener('abort',abortListener);
  }
  const cleanup={serverWasListening,browserWasLaunched:Boolean(browser),browserClosed:!browser||!browser.isConnected(),serverClosed:!server.listening,browserCloseError,serverCloseError};
  onProgress?.({event:'ARCHIVE_RESOURCES_CLEANED',attempt,cleanup});
  if(signal?.aborted&&!cancellationError)cancellationError=makeCancellationError();
  if(cancellationError)throw persistArchiveAbortEvidence(run,attempt,cancellationError,cancellationError.cleanup||cleanup);
  const result={status:rows.every(v=>v.status==='PASS')?'PASS':'FAIL',runtime:'playwright-chromium',synthetic:false,scope:'bound code regression candidates in unmodified archive runtime',rows:rows.map(v=>({id:v.id,status:v.status,capture:v.capture,errors:v.errors})),matrixSha256:sha256(fs.readFileSync(path.join(run,'archive-render-matrix.json')))};
  fs.writeFileSync(path.join(folder,'summary.json'),JSON.stringify(result,null,2)+'\n');return result;
}

export async function measureArchiveDisplayEnvelope({run,sourceRef,sourceOrdinal,targetId,questionUid=null,intrinsicSvg,sizeClasses=['small','medium','large','full'],sourceAuthorityStatus='MEASUREMENT_ONLY',signal,onProgress,blockExternalRequests=false}){
  run=assertOutput(run);
  if(typeof blockExternalRequests!=='boolean')throw Error('ARCHIVE_NETWORK_POLICY_INVALID');
  if(signal!==undefined&&(!signal||typeof signal.aborted!=='boolean'||typeof signal.addEventListener!=='function'||typeof signal.removeEventListener!=='function'))throw Error('ARCHIVE_CAPTURE_SIGNAL_INVALID');
  if(signal?.aborted)throw writeArchiveAbortEvidence(run,'envelope-preflight',{serverWasListening:false,browserWasLaunched:false,browserClosed:true,serverClosed:true});
  if(onProgress!==undefined&&typeof onProgress!=='function')throw Error('ARCHIVE_PROGRESS_HOOK_INVALID');
  if(!sourceRef?.path?.startsWith('archive/exams/original/')||!Number.isSafeInteger(sourceOrdinal)||sourceOrdinal<1||!/^[-A-Za-z0-9_]{1,96}$/.test(targetId)||!Number.isInteger(intrinsicSvg?.width)||!Number.isInteger(intrinsicSvg?.height)||!Array.isArray(sizeClasses)||!sizeClasses.length)throw Error('DISPLAY_ENVELOPE_PREFLIGHT_INPUT_INVALID');
  if(sizeClasses.some(v=>!['small','medium','large','full'].includes(v))||new Set(sizeClasses).size!==sizeClasses.length)throw Error('DISPLAY_ENVELOPE_PROFILE_SET_INVALID');
  const sourceBytes=readBoundFile(repoRoot,sourceRef),bank=loadBank(sourceBytes.toString('utf8'));
  const index=bank.findIndex(q=>q.id===sourceOrdinal);if(index<0)throw Error('DISPLAY_ENVELOPE_SOURCE_ORDINAL_MISSING');
  const candidateName=path.basename(sourceRef.path),candidatePath=assertOutput(path.join(run,candidateName));
  if(fs.existsSync(candidatePath))throw Error('IMMUTABLE_PREFLIGHT_CANDIDATE_EXISTS');
  fs.writeFileSync(candidatePath,sourceBytes,{flag:'wx'});
  const rawSha=ref=>ref.sha256.slice(7),candidateRef=fileRef(repoRoot,path.relative(repoRoot,candidatePath).replaceAll('\\','/'));
  const sourceInfo={id:targetId,sourcePath:sourceRef.path,sourceSha256:rawSha(sourceRef),candidatePath:path.relative(repoRoot,candidatePath).replaceAll('\\','/'),candidateSha256:rawSha(candidateRef),questionCount:bank.length,assets:[]};
  const row={...sourceInfo,mode:'sol',viewport:'desktop-envelope',width:1440,height:1000,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourceRef.path.replace(/^archive\//,'')),requireLocalResources:blockExternalRequests,requireQrRenderer:blockExternalRequests,envelopeTargets:[{id:targetId,questionId:sourceOrdinal,displayOrdinal:index+1,intrinsicSvg,sizeClasses,sourceAuthorityStatus}]};
  const matrix={schemaVersion:'GEOMETRY_ARCHIVE_DISPLAY_ENVELOPE_MATRIX_v1',synthetic:false,measurementOnly:true,engineSha256:sha256(fs.readFileSync(path.join(repoRoot,'archive/engine.html'))),sources:[sourceInfo],rows:[row]};
  fs.writeFileSync(path.join(run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n');
  const archive=await recordArchiveEvidence({run,attempt:'envelope-preflight',signal,onProgress,blockExternalRequests});
  const captureFolder=path.join(run,'archive-render','envelope-preflight');
  const rowPath=path.join(captureFolder,targetId+'-sol-desktop-envelope.json');
  const rowEvidence=JSON.parse(fs.readFileSync(rowPath,'utf8'));
  const rawObservation=rowEvidence.state?.displayEnvelopes?.find(v=>v.id===targetId);
  const observation=rawObservation?{...rawObservation,...(questionUid?{questionUid}:{}),synthetic:false,runtime:rowEvidence.runtime,browserVersion:rowEvidence.browserVersion,sourceRef,sourceAuthorityStatus}:null;
  if(archive.status!=='PASS'||rowEvidence.status!=='PASS'||observation?.status!=='PASS')throw Error('ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL:'+JSON.stringify({archive:archive.status,row:rowEvidence.status,observation:observation?.status,errors:rowEvidence.errors}));
  return {status:'PASS',measurementOnly:true,sourceAuthorityStatus,sourceRef,candidateRef,matrixSha256:sha256(fs.readFileSync(path.join(run,'archive-render-matrix.json'))),archive,rowEvidence,observation,captureFolder};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=k=>process.argv[process.argv.indexOf(k)+1];const result=await recordArchiveEvidence({run:arg('--run'),attempt:process.argv.includes('--attempt')?arg('--attempt'):'attempt-01'});console.log(JSON.stringify(result));if(result.status!=='PASS')process.exitCode=1;
}
