'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const vm=require('node:vm');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const exam='exams/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사.js';
const out=process.env.JEIL_CHROME_OUT||path.join(root,'reports/jeil-legacy-similar-chrome');
fs.mkdirSync(out,{recursive:true});
const source=fs.readFileSync(path.join(root,'archive',exam),'utf8');
const context={window:{}};vm.createContext(context);vm.runInContext(source,context,{timeout:3000});
const questions=context.window.questionBank;
assert.equal(questions.length,22);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
 const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/chromium'].find(fs.existsSync);
 if(!chrome||!fs.existsSync(chrome))throw Error('Actual Chrome binary is required');
 const server=http.createServer((req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   const file=path.resolve(root,'.'+pathname);
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
   const ext=path.extname(file).toLowerCase();
   const mime={'.json':'application/json','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.wasm':'application/wasm','.html':'text/html'}[ext]||'application/octet-stream';
   res.writeHead(200,{'Content-Type':mime});fs.createReadStream(file).pipe(res);
  }catch(e){res.writeHead(500);res.end(String(e));}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port+'/archive/engine.html?data='+encodeURIComponent(exam)+'&qpp=4&prewarm=0&snapshotCache=0';
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'jeil-chrome-'));
 const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-background-networking','--remote-debugging-port=0','--remote-allow-origins=*','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});
 let ws;
 try{
  let port;
  for(let i=0;i<150;i++){
   if(proc.exitCode!==null)throw Error('Chrome quit: '+proc.exitCode);
   const f=path.join(temp,'DevToolsActivePort');
   if(fs.existsSync(f)){port=Number(fs.readFileSync(f,'utf8').split('\n')[0]);break;}
   await sleep(100);
  }
  assert(port,'No real Chrome CDP endpoint');
  const target=(await (await fetch('http://127.0.0.1:'+port+'/json/list')).json()).find(x=>x.type==='page');
  assert(target,'No Chrome page');
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let id=0;const pending=new Map(),exceptions=[];
  ws.addEventListener('message',event=>{
   const msg=JSON.parse(event.data);
   if(msg.method==='Runtime.exceptionThrown')exceptions.push(msg.params?.exceptionDetails?.text||'script exception');
   if(!pending.has(msg.id))return;
   const waiter=pending.get(msg.id);pending.delete(msg.id);
   msg.error?waiter.reject(Error(JSON.stringify(msg.error))):waiter.resolve(msg.result);
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
  const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  await send('Page.enable');await send('Runtime.enable');
  const results=[];
  for(const mode of ['exam','ans','sol']){
   exceptions.length=0;
   await send('Page.navigate',{url:base+'&mode='+mode});
   let ready=false, lastObserved=null;
   for(let i=0;i<600;i++){
    try {
     const r=await evaluate("(()=>({mode:typeof AppState!=='undefined'?AppState.mode:null,legacyDone:!!window.__AP_RENDER_METRICS__?.finishedAt,snapshotMode:window.archiveScreenRuntime?.activeSnapshot?.mode||null,snapshotReady:!!window.archiveScreenRuntime?.activeSnapshot,pages:document.querySelectorAll('#print-area .page').length,root:!!document.getElementById('print-area'),error:document.querySelector('.error-message')?.textContent||''}))()");
     lastObserved=r;
     if(r.mode===mode && r.root && r.pages>0 && (r.legacyDone || (r.snapshotReady && r.snapshotMode===mode))){
      const idle=await evaluate("(async()=>{const r=window.archiveScreenRuntime?await window.archiveScreenRuntime.whenIdle():await window.__AP_RENDER_READY__;return {ok:r?.ok??null,pages:r?.pages??null}})()");
      if(idle.ok===true){ready=true;break;}
      lastObserved={...r,idle};
     }
    }catch(err){lastObserved={...lastObserved,transientEvaluationError:String(err)};}
    await sleep(100);
   }
   if(!ready){
    fs.writeFileSync(path.join(out,'debug-'+mode+'.json'),JSON.stringify({lastObserved,exceptions},null,2));
    try{const snap=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,'debug-'+mode+'.png'),Buffer.from(snap.data,'base64'));}catch(_){}
    throw Error('Chrome '+mode+' render not ready: '+JSON.stringify(lastObserved));
   }
   const state=await evaluate("(()=>{const p=document.getElementById('print-area'),pages=[...p.querySelectorAll('.page')];const images=[...p.querySelectorAll('img')];return {mode:typeof AppState!=='undefined'?AppState.mode:null,visibleChars:p.innerText?.length||p.textContent.length,text:p.innerText||p.textContent,pages:pages.length,questionBoxes:p.querySelectorAll('.q-box[data-source-ref]').length,layoutBoxes:p.querySelectorAll('.q-box').length,solutionBoxes:p.querySelectorAll('.sol-box').length,svgCount:p.querySelectorAll('svg').length,images:images.map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),unrenderedMath:window.APRenderLoop?.unrenderedMathCount?.(p)??null,metrics:window.__AP_RENDER_METRICS__}})()");
   assert(state.pages>0,mode+' no printed pages');
   assert(state.visibleChars>(mode==='ans'?70:400),mode+' output blank');
   assert(state.images.every(x=>x.loaded),mode+' image decode failure: '+JSON.stringify(state.images.filter(x=>!x.loaded)));
   if(state.unrenderedMath!==null)assert.equal(state.unrenderedMath,0,mode+' unrendered math');
   if(mode==='exam')assert.equal(state.questionBoxes,22,'exam does not contain all 22 questions');
   if(mode==='sol')assert(state.solutionBoxes>=22,'solution does not contain all 22 solutions');
   if(exceptions.length)throw Error('Chrome '+mode+' script errors: '+JSON.stringify(exceptions));
   const pdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true,landscape:false});
   const bytes=Buffer.from(pdf.data,'base64');
   assert(bytes.subarray(0,4).toString()==='%PDF','Chrome '+mode+' PDF invalid');
   fs.writeFileSync(path.join(out,'jeil-'+mode+'.pdf'),bytes);
   const image=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
   fs.writeFileSync(path.join(out,'jeil-'+mode+'.png'),Buffer.from(image.data,'base64'));
   const {text:ignore,...report}=state;
   report.pdfBytes=bytes.length;
   report.lastQuestionTextSeen=mode==='exam'?state.text.includes('22'):null;
   results.push(report);
   console.log('CHROME_PRINT_PASS',mode,'pages='+state.pages,'qboxes='+state.questionBoxes,'solboxes='+state.solutionBoxes,'images='+state.images.length,'pdfBytes='+bytes.length);
  }
  fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify({target:exam,chromeExecutable:chrome,sourceQuestionCount:questions.length,results},null,2)+'\n');
 }finally{ws?.close();proc.kill('SIGTERM');server.close();try{fs.rmSync(temp,{recursive:true,force:true,maxRetries:5,retryDelay:250});}catch(e){console.warn('Chrome temp cleanup deferred:',e.code);}}
}
main().catch(err=>{console.error(err);process.exitCode=1;});
