import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {gitBlobSha} from '../../../../archive/tools/archive-stage-validator.mjs';

const args={channel:'chrome'};
for(let i=2;i<process.argv.length;i++){const k=process.argv[i];if(k==='--preflight')args.preflight=true;else if(['--root','--exam','--asset-root','--output','--node-modules','--channel','--cases'].includes(k))args[k.slice(2)]=process.argv[++i];else throw Error('UNKNOWN_ARGUMENT:'+k);}
for(const k of ['root','output'])if(!args[k])throw Error('REQUIRED_ARGUMENT:'+k);
const selectedCases=args.cases?new Set(args.cases.split(',').map(v=>v.trim()).filter(Boolean)):null;
if(selectedCases&&[...selectedCases].some(v=>!['exam/mobile','sol/mobile'].includes(v)))throw Error('UNAUTHORIZED_SELECTED_CASE:'+([...selectedCases].join(',')));
const root=fs.realpathSync(path.resolve(args.root));
function within(base,p){const absolute=path.resolve(base,p),rel=path.relative(base,absolute);if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('PATH_ESCAPE:'+p);return absolute;}
const out=within(path.join(root,'.tmp/archive'),path.resolve(root,args.output));
if(fs.existsSync(out))throw Error('FRESH_CAPTURE_DIRECTORY_REQUIRED');
fs.mkdirSync(out,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const ref=file=>({path:path.relative(root,file).replaceAll('\\','/'),sha256:hash(fs.readFileSync(file))});
const driver=createRequire(args['node-modules']?path.join(path.resolve(args['node-modules']),'../package.json'):import.meta.url);
let browser,server;
const report={schemaVersion:'JS_ARCHIVE_CODEX_MACHINE_CAPTURE_V1',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',status:'NOT_RUN',reviewStatus:'R3_REVIEW_REQUIRED',renderPass:false,startedAt:new Date().toISOString(),cases:[]};
try{
  const {chromium}=driver('playwright');
  browser=await chromium.launch({channel:args.channel,headless:true});
  report.browserVersion=browser.version();
  if(args.preflight){
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.setContent('<!doctype html><p>Archive capture capability preflight</p>');
    const file=path.join(out,'preflight-mobile.png');
    await page.screenshot({path:file,type:'png'});
    report.status='CAPABILITY_READY';report.capabilities={physicalPng:true,viewport:await page.evaluate(()=>({width:innerWidth,height:innerHeight}))};report.preflightCapture=ref(file);
  }else{
    if(!args.exam)throw Error('EXAM_REQUIRED');
    const exam=within(root,args.exam),bytes=fs.readFileSync(exam),box={window:{}};
    vm.runInNewContext(bytes.toString('utf8'),box,{timeout:5000});
    const bank=box.window.questionBank||box.window.questions;
    if(!Array.isArray(bank)||!bank.length)throw Error('QUESTION_BANK_REQUIRED');
    report.qids=bank.map(q=>Number(q.id));if(new Set(report.qids).size!==bank.length)throw Error('DUPLICATE_QIDS');
    report.loadedJs=ref(exam);report.artifactSha=gitBlobSha(bytes);
    const assetRoot=fs.realpathSync(path.resolve(root,args['asset-root']||'archive'));
    const virtual='/archive/exams/__codex_capture__/'+path.basename(exam);
    const mime={'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.woff2':'font/woff2'};
    server=http.createServer((req,res)=>{
      try{
        const url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
        const file=url===virtual?exam:url.startsWith('/archive/assets/')?within(assetRoot,url.slice('/archive/'.length)):within(root,url.slice(1));
        // A symlink must not escape the assigned root or asset root.
        const real=fs.realpathSync(file);within(url.startsWith('/archive/assets/')?assetRoot:root,real);
        res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(fs.readFileSync(file));
      }catch{res.writeHead(404);res.end();}
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const origin='http://127.0.0.1:'+server.address().port;
    report.engine=ref(path.join(root,'archive/engine.html'));
    for(const mode of ['exam','sol','ans'])for(const profile of ['desktop','mobile']){
      if(selectedCases&&!selectedCases.has(mode+'/'+profile))continue;
      const viewport={width:profile==='mobile'?390:1280,height:profile==='mobile'?844:1000};
      const context=await browser.newContext({viewport,deviceScaleFactor:1}),page=await context.newPage();
      const responses=new Map(),pending=[],errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',response=>{
        const url=new URL(response.url());
        const responsePath=decodeURIComponent(url.pathname);
        if(url.origin===origin&&(responsePath===virtual||responsePath.startsWith('/archive/assets/')))pending.push((async()=>{
          const body=await response.body();responses.set(responsePath,{url:response.url(),status:response.status(),sha256:hash(body)});
        })().catch(e=>errors.push('RESPONSE_BODY:'+e.message)));
      });
      const url=origin+'/archive/engine.html?fit=screen&qpp=4&mode=exam&data='+encodeURIComponent(virtual.slice('/archive/'.length));
      await page.goto(url,{waitUntil:'load',timeout:60000});
      await page.waitForFunction(count=>new Set([...document.querySelectorAll('#print-area .q-box[data-source-ref]')].map(n=>n.dataset.sourceRef).filter(Boolean)).size===count,bank.length,{timeout:60000});
      const modeChange=await page.evaluate(async targetMode=>await window.switchMode(targetMode),mode);
      if(!modeChange?.ok)throw Error('OFFICIAL_MODE_CHANGE_FAILED:'+JSON.stringify(modeChange));
      await page.waitForFunction(({targetMode,count})=>{const p=new URLSearchParams(location.search);return p.get('archive2Context')==='archive2'&&p.get('archive2OutputContract')==='archive2-output-envelope-v1'&&p.has('outputRequestId')&&p.has('outputOwnerId')&&p.get('mode')===targetMode&&Number(p.get('q'))===count}, {targetMode:mode,count:bank.length},{timeout:60000});
      const officialOutputUrl=page.url();
      await page.goto(officialOutputUrl,{waitUntil:'load',timeout:60000});
      const selector=mode==='ans'?'#print-area .ans-n':'#print-area .q-box[data-source-ref]';
      await page.waitForFunction(({selector,count,mode})=>{
        const nodes=[...document.querySelectorAll(selector)];
        if(mode==='ans')return nodes.length===count&&document.documentElement.dataset.archive2Context==='archive2';
        return new Set(nodes.map(node=>node.dataset.sourceRef).filter(Boolean)).size===count&&document.documentElement.dataset.archive2Context==='archive2'&&window.__AP_OUTPUT_RENDER_READY__?.pageCount>0;
      },{selector,count:bank.length,mode},{timeout:60000});      await page.evaluate(async()=>{await document.fonts.ready;if(window.MathJax?.startup?.promise)await window.MathJax.startup.promise;});
      await page.waitForFunction(()=>[...document.querySelectorAll('#print-area img')].every(i=>i.complete),{},{timeout:30000});
      await Promise.all(pending);
      if(responses.get(virtual)?.sha256!==report.loadedJs.sha256)throw Error('LOADED_JS_SHA_MISMATCH');
      const metrics=await page.evaluate(({selector,mode})=>{
        const nodes=[...document.querySelectorAll(selector)];
        const sourceRefs=nodes.map(n=>n.dataset.sourceRef||n.textContent.trim());
        return {
        count:mode==='ans'?nodes.length:new Set(sourceRefs).size,renderedBoxCount:nodes.length,width:innerWidth,height:innerHeight,
        mathJaxPresent:!!window.MathJax,mathErrors:document.querySelectorAll('mjx-merror,[data-mjx-error]').length,
        images:[...document.querySelectorAll('#print-area img')].map(i=>({url:i.currentSrc||i.src,decoded:i.complete&&i.naturalWidth>0})),
        sourceRefs,
        scrollWidth:document.documentElement.scrollWidth
      }},{selector,mode});
      const assets=[];
      for(const i of metrics.images){
        const u=new URL(i.url);
        if(!i.decoded)throw Error('ASSET_DECODE_FAILED:'+u.pathname);
        if(!u.pathname.startsWith('/archive/assets/'))continue;
        const assetRef=decodeURIComponent(u.pathname).slice('/archive/'.length),file=within(assetRoot,assetRef),expected=hash(fs.readFileSync(file)),actual=responses.get(decodeURIComponent(u.pathname));
        if(actual?.sha256!==expected||actual.status!==200)throw Error('LOADED_ASSET_SHA_MISMATCH:'+assetRef);
        if(!assets.some(a=>a.ref===assetRef))assets.push({ref:assetRef,sha256:expected,file:ref(file)});
      }
      const capture=path.join(out,mode+'-'+profile+'.png');
      await page.screenshot({path:capture,type:'png',fullPage:true});
      if(hash(fs.readFileSync(exam))!==report.loadedJs.sha256)throw Error('EXAM_CHANGED_DURING_CAPTURE');
      report.cases.push({id:mode+'/'+profile,status:'CAPTURED_REVIEW_REQUIRED',viewport:{width:metrics.width,height:metrics.height},captures:[{image:ref(capture),qids:report.qids}],loadedAssets:assets,metrics,pageErrors:errors,mechanicalStatus:metrics.count===bank.length&&metrics.mathJaxPresent&&metrics.mathErrors===0&&errors.length===0?'PASS':'FAIL',layoutReviewStatus:'NOT_REVIEWED',mathJaxStatus:metrics.mathJaxPresent&&metrics.mathErrors===0?'PASS':'FAIL',assetDecodeStatus:'PASS'});
      await context.close();
    }
    report.status=report.cases.every(c=>c.mechanicalStatus==='PASS')?'CAPTURED_REVIEW_REQUIRED':'CAPTURE_MECHANICAL_FAIL';
  }
}catch(e){report.status='CAPTURE_BLOCKED';report.blocker={code:e.code||'CAPTURE_ERROR',reason:e.message};process.exitCode=1;}
finally{
  if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
  report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'machine-capture.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,report:ref(path.join(out,'machine-capture.json')),cases:report.cases.length,renderPass:false,...(report.blocker?{blocker:report.blocker}:{})}));
}
