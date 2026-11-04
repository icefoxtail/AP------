// Read-only physical font QA. Batch: [{src:"archive/exams/original/...js",ords:[1,2]}].
// Output: source/response hashes, actual rectangle, recursive embedded paths/hashes,
// per-label measured CSS px and explicit PASS/FAIL/EVIDENCE_DEBT for each question.
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import vm from 'node:vm';import crypto from 'node:crypto';import {pathToFileURL} from 'node:url';
import portable from './portable-root.cjs';
const ROOT=portable.repoRoot(),archive=path.join(ROOT,'archive');
const {launchBrowser}=await import(pathToFileURL(path.join(ROOT,'archive/tools/geometry-equation/visual-browser-runtime.mjs')).href);
const {captureAtDisplaySize,collectRenderedLayout}=await import(pathToFileURL(path.join(ROOT,'archive/tools/geometry-equation/verify-rendered-layout.mjs')).href);
const arg=n=>{const i=process.argv.indexOf(n);return i<0?null:process.argv[i+1]};
const batchPath=arg('--batch'),out=arg('--out');if(!batchPath||!out)throw Error('usage: --batch manifest.json --out result.json');
const outputPath=path.resolve(out), outputRoot=path.join(ROOT,'.tmp','svg-m1','runs');
if(!outputPath.startsWith(outputRoot+path.sep))throw Error('output must be inside .tmp/svg-m1/runs');
const batch=JSON.parse(fs.readFileSync(batchPath,'utf8').replace(/^\uFEFF/,''));if(!Array.isArray(batch)||!batch.length)throw Error('empty batch');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://x').pathname),f=path.resolve(ROOT,'.'+p);if(!(f===ROOT||f.startsWith(ROOT+path.sep))||!fs.existsSync(f)||!types[path.extname(f).toLowerCase()]){res.writeHead(404);return res.end();}res.writeHead(200,{'content-type':types[path.extname(f).toLowerCase()]});res.end(fs.readFileSync(f));}catch{res.writeHead(500);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await launchBrowser();const rows=[];let failed=false;
// Each SVG is replayed at its measured CSS image box using the existing renderer collector.
// Embedded data SVGs are decoded byte-for-byte, verified and recursively replayed at their image box.
async function measure(svgBytes,display,treePath,depth=0){
  if(depth>12)throw Error('EVIDENCE_DEBT: embedded depth');
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  try{
    await captureAtDisplaySize(page,svgBytes.toString('utf8'),display,{publicationViewport:{width:1440,height:1000}});
    const before=await page.evaluate(()=>{
      const root=document.querySelector('svg');
      const snapshot=()=>[...root.querySelectorAll('*')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return [r.x,r.y,r.width,r.height,s.display,s.visibility,s.opacity,s.fill,s.stroke,s.transform]});
      const initial=snapshot();let propagated=0;
      for(const e of root.querySelectorAll('g[data-fragment-sha]'))if(!e.hasAttribute('data-font-px')){const a=e.parentElement?.closest('[data-font-px]');if(a){e.setAttribute('data-font-px',a.getAttribute('data-font-px'));propagated++;}}
      const after=snapshot();
      const expected=root.querySelectorAll('text, g[data-fragment-sha]').length;
      const images=[...root.querySelectorAll('image')].map((e,index)=>{const r=e.getBoundingClientRect(),m=e.getScreenCTM();return {index,href:e.getAttribute('href')||e.getAttributeNS('http://www.w3.org/1999/xlink','href')||'',declared:e.getAttribute('data-panel-svg-sha'),preserveAspectRatio:e.getAttribute('preserveAspectRatio')||'xMidYMid meet',rect:{x:r.x,y:r.y,width:r.width,height:r.height},matrix:m?{a:m.a,b:m.b,c:m.c,d:m.d}:null};});
      return {geometryUnchanged:JSON.stringify(initial)===JSON.stringify(after),propagated,expected,images};
    });
    if(!before.geometryUnchanged)throw Error('EVIDENCE_DEBT: metadata changed geometry or style');
    const capture=await collectRenderedLayout(page,{width:1440,height:1000});
    const labels=capture.labels.map((v,index)=>({path:treePath,id:v.id||null,index,kind:v.kind,finalViewportCssFontPx:v.effectiveFontPx}));
    if(labels.length!==before.expected)throw Error('EVIDENCE_DEBT: label count mismatch');
    const embedded=[];
    for(const img of before.images){
      const match=img.href.match(/^data:image\/svg\+xml;base64,([A-Za-z0-9+/=\r\n]+)$/i);
      if(!match)throw Error('EVIDENCE_DEBT: unsupported embedded image '+treePath+'/'+img.index);
      const encoded=match[1].replace(/\s/g,''),bytes=Buffer.from(encoded,'base64');if(bytes.toString('base64')!==encoded)throw Error('EVIDENCE_DEBT: invalid base64');
      const hash=sha(bytes);if(!img.declared||img.declared.toLowerCase().replace(/^sha256:/,'')!==hash)throw Error('EVIDENCE_DEBT: embedded SHA mismatch');
      const m=img.matrix;if(!m||Math.abs(m.b)>1e-7||Math.abs(m.c)>1e-7||Math.abs(Math.abs(m.a)-Math.abs(m.d))>1e-6||m.a<=0||m.d<=0)throw Error('EVIDENCE_DEBT: transformed embedded viewport');
      if(![img.rect.width,img.rect.height].every(v=>Number.isFinite(v)&&v>0))throw Error('EVIDENCE_DEBT: invalid embedded rect');
      // The replay preserves the child SVG's own viewBox/preserveAspectRatio, matching
      // the image viewport. Slice can crop labels, so do not claim full evidence.
      const inspect=await browser.newPage();let childMeta;
      try{await inspect.setContent(bytes.toString('utf8'));childMeta=await inspect.evaluate(()=>{const e=document.querySelector('svg');if(!e||document.querySelector('parsererror'))return null;const v=e.viewBox.baseVal;return{viewBox:[v.x,v.y,v.width,v.height],par:e.getAttribute('preserveAspectRatio')||'xMidYMid meet'};});}finally{await inspect.close();}
      if(!childMeta||!childMeta.viewBox.slice(2).every(v=>Number.isFinite(v)&&v>0)||/\bslice\b/i.test(childMeta.par))throw Error('EVIDENCE_DEBT: child SVG viewport unsupported');
      if(/\bslice\b/i.test(img.preserveAspectRatio)||Math.abs(img.rect.width/img.rect.height-childMeta.viewBox[2]/childMeta.viewBox[3])>1e-4)throw Error('EVIDENCE_DEBT: embedded viewport and viewBox ratios differ');
      const childPath=treePath+'/image['+img.index+']';const child=await measure(bytes,img.rect,childPath,depth+1);
      embedded.push({path:childPath,sha256:hash,declaredSha256:img.declared,actualImageRect:img.rect,viewBox:childMeta.viewBox,imagePreserveAspectRatio:img.preserveAspectRatio,childPreserveAspectRatio:childMeta.par,...child});
    }
    return {expectedLabelCount:before.expected+embedded.reduce((n,x)=>n+x.expectedLabelCount,0),measuredLabelCount:labels.length+embedded.reduce((n,x)=>n+x.measuredLabelCount,0),metadataPropagation:{count:before.propagated,geometryAndStylesUnchanged:before.geometryUnchanged},labels,embedded};
  }finally{await page.close();}
}
try{
  for(const entry of batch){
    if(!entry||typeof entry.src!=='string'||!Array.isArray(entry.ords)||!entry.ords.length||new Set(entry.ords).size!==entry.ords.length||entry.ords.some(o=>!Number.isInteger(o)||o<1))throw Error('invalid batch entry');
    const file=path.resolve(ROOT,entry.src),original=path.join(archive,'exams/original');if(!file.startsWith(original+path.sep))throw Error('source outside original exams');
    const sourceBytes=fs.readFileSync(file),ctx={window:{}};vm.runInNewContext(sourceBytes.toString('utf8'),ctx);const bank=ctx.window.questionBank||ctx.window.examData?.questions;if(!Array.isArray(bank))throw Error('missing bank');
    const page=await browser.newPage({viewport:{width:1440,height:1000}});const responses=new Map();
    page.on('response',response=>{if(response.url().startsWith(base+'/archive/')&&response.status()===200){const key=new URL(response.url()).pathname;responses.set(key,response.body().then(b=>sha(b)).catch(()=>null));}});
    try{
      const rel=path.relative(archive,file).split(path.sep).join('/');await page.goto(base+'/archive/engine.html?preview=1&qpp=4&mode=sol&data='+encodeURIComponent(rel)+'&assetBase=off',{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForFunction(()=>{const e=document.documentElement.dataset.apRenderError;if(e)throw Error(e);const p=document.getElementById('print-area');return !!p?.querySelector('.page')},null,{timeout:90000});
      await page.waitForLoadState('networkidle',{timeout:60000});
      for(const ord of entry.ords){const row={src:entry.src,ord,archiveSourceSha:sha(sourceBytes),browserVersion:browser.version(),status:'EVIDENCE_DEBT'};rows.push(row);
        try{
          const q=bank.find(x=>x.id===ord);if(!q?.solutionImage)throw Error('FAIL: missing published solutionImage');
          const asset=path.resolve(archive,q.solutionImage);if(!asset.startsWith(archive+path.sep))throw Error('FAIL: invalid asset path');const svg=fs.readFileSync(asset);row.sourceSvgSha=sha(svg);
          const expected='/archive/'+q.solutionImage.replace(/\\/g,'/').replace(/^\/+/, '');
          const targets=await page.evaluate(expected=>[...document.querySelectorAll('#print-area .sol-image-wrap img')].filter(i=>{try{return decodeURIComponent(new URL(i.src).pathname)===expected}catch{return false}}).map(i=>{const r=i.getBoundingClientRect();return{url:i.currentSrc||i.src,loaded:i.complete&&i.naturalWidth>0,rect:{x:r.x,y:r.y,width:r.width,height:r.height},naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight}}),expected);
          if(targets.length!==1||!targets[0].loaded)throw Error('FAIL: published image missing or ambiguous');row.actualRect=targets[0].rect;
          const responseKey=new URL(targets[0].url).pathname;row.responseSha=await responses.get(responseKey);if(!row.responseSha||row.responseSha!==row.sourceSvgSha)throw Error('FAIL: response SHA mismatch or unavailable');
          const measurement=await measure(svg,row.actualRect,'root');Object.assign(row,measurement);
          const all=[];const collect=x=>{all.push(...x.labels);for(const e of x.embedded)collect(e)};collect(measurement);
          row.minFontPx=all.length?Math.min(...all.map(x=>x.finalViewportCssFontPx)):null;
          if(!all.length||row.expectedLabelCount!==row.measuredLabelCount||all.some(x=>!Number.isFinite(x.finalViewportCssFontPx)||x.finalViewportCssFontPx<=0))throw Error('FAIL: missing or unmeasurable labels');
          if(row.minFontPx<11)throw Error('FAIL: font below 11 CSS px');row.status='PASS';
        }catch(e){row.error=String(e.message||e);row.status=row.error.startsWith('FAIL:')?'FAIL':'EVIDENCE_DEBT';failed=true;}
      }
    }finally{await page.close();}
  }
}catch(e){failed=true;rows.push({status:'EVIDENCE_DEBT',error:String(e.message||e)});}finally{await browser.close();await new Promise(r=>server.close(r));}
fs.writeFileSync(outputPath,JSON.stringify({viewport:{width:1440,height:1000},thresholdCssPx:11,rows},null,2)+'\n');if(failed||!rows.length)process.exitCode=1;
