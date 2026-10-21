'use strict';
// Real Chrome check of the exact original Geumdang 2026 H2 Algebra exam, answers and solutions.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const exam='original/high/h2/1final/26_금당고_1학기_기말_고2_대수.js';
async function main(){
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'archive/data/archive2-catalog.json'),'utf8'));
 const decodeRow=row=>catalog.encoding==='column-dictionary-v1'
  ?Object.fromEntries(catalog.columns.map((key,i)=>[key,Array.isArray(row[i])&&row[i].length===1&&Number.isInteger(row[i][0])&&catalog.strings?.[row[i][0]]!==undefined?catalog.strings[row[i][0]]:row[i]]))
  :row;
 const records=(catalog.records||[]).map(decodeRow).filter(x=>x.sourceFile===exam);
 if(records.length!==21)throw Error('Consumer catalog must have 21 Geumdang records, found '+records.length);
 const keys=records.map(r=>r.questionUid);
 if(new Set(keys).size!==21||records.some(r=>!r.problemTypeKey||!r.templateKey||!Number.isInteger(r.difficultyBucket)))
  throw Error('Catalog source→UID→PT/TPL→difficulty projection incomplete '+JSON.stringify(records.slice(0,2)));
 const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(fs.existsSync);
 if(!chrome||!fs.existsSync(chrome))throw Error('Actual Chrome is required');
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
 const server=http.createServer((req,res)=>{try{
  const name=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(!name.startsWith(root+path.sep)||!fs.existsSync(name)||!fs.statSync(name).isFile()){res.writeHead(404);res.end();return}
  res.setHeader('Content-Type',(mime[path.extname(name)]||'application/octet-stream')+'; charset=utf-8');fs.createReadStream(name).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e))}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+'/archive/';
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'geumdang26-algebra-finalqa-'));
 const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-background-networking','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+tmp,'about:blank'],{stdio:'ignore'});let ws;
 try{
  let port=0;
  for(let n=0;n<200;n++){const f=path.join(tmp,'DevToolsActivePort');if(fs.existsSync(f)){port=Number(fs.readFileSync(f,'utf8').split('\n')[0]);break;}if(proc.exitCode!==null)throw Error('Chrome exited '+proc.exitCode);await sleep(100)}
  if(!port)throw Error('Chrome debug port unavailable');
  const targets=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
  const target=targets.find(t=>t.type==='page');if(!target)throw Error('No Chrome target');
  ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((yes,no)=>{ws.addEventListener('open',yes,{once:true});ws.addEventListener('error',no,{once:true})});
  let next=0;const pending=new Map();
  ws.addEventListener('message',evt=>{const m=JSON.parse(evt.data),p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
  const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
  const wait=async(test,label)=>{for(let n=0;n<250;n++){try{if(await run(test))return}catch{}await sleep(200)}throw Error('timeout '+label)};
  await send('Runtime.enable');await send('Page.enable');
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('APMATH_SESSION',JSON.stringify({id:'finalqa-read-only',role:'teacher'}));window.print=()=>true"});
  // Finder: real student/teacher catalogue must show original exam with 21 questions.
  await send('Page.navigate',{url:base+'workspace.html?view=find'});
  await wait("!!document.querySelector('#finder-query')&&document.querySelectorAll('.exam-list article').length>0",'Archive finder');
  await run("(()=>{const x=document.querySelector('#finder-query');x.value='26_금당고';document.querySelector('[data-action=\"finder-search\"]').click();return true})()");
  await wait("document.querySelector('.exam-list')?.innerText.includes('금당고')",'Geumdang finder search');
  const finder=await run("(()=>[...document.querySelectorAll('.exam-list article')].filter(e=>e.innerText.includes('금당고')&&e.innerText.includes('대수')&&e.innerText.includes('21')).map(e=>e.innerText.slice(0,240)))()");
  if(!finder.length)throw Error('2026 Geumdang exam missing in real Finder result: '+JSON.stringify(finder));
  const modes={};
  for(const mode of ['exam','sol','ans']){
   const url=new URL(base+'engine.html');url.searchParams.set('data','exams/'+exam);url.searchParams.set('mode',mode);
   url.searchParams.set('title','26_금당고_1학기_기말_고2_대수');url.searchParams.set('q','21');
   await send('Page.navigate',{url:url.href});
   await wait("window.questionBank?.length===21&&document.querySelector('#print-area')?.querySelectorAll('.page').length>0&&document.documentElement.dataset.apRenderError===undefined",'engine '+mode+' 21 QIDs');
   const state=await run("(()=>({count:window.questionBank.length,renderedPages:document.querySelectorAll('#print-area .page').length,mode:(typeof AppState==='object'?AppState.mode:null),totalText:document.querySelector('#print-area').innerText.length,renderError:document.documentElement.dataset.apRenderError||'',math:document.querySelectorAll('#print-area mjx-container').length,images:[...document.querySelectorAll('#print-area img')].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0}))}))()");
   if(state.count!==21||state.renderedPages<1||state.totalText<35||state.renderError)throw Error('Broken engine '+mode+' '+JSON.stringify(state));
   if(state.images.some(x=>!x.loaded))throw Error('Engine image failed '+mode+' '+JSON.stringify(state.images.filter(x=>!x.loaded)));
   modes[mode]=state;
  }
  console.log('GEUMDANG26_ALGEBRA_ORIGINAL_CHROME_PASS '+JSON.stringify({finderMatches:finder.length,catalogUIDs:keys.length,modes}));
 }finally{ws?.close();proc.kill('SIGTERM');await new Promise(resolve=>server.close(resolve));try{fs.rmSync(tmp,{recursive:true,force:true})}catch{}}
}
main().catch(e=>{console.error('GEUMDANG26_ALGEBRA_ORIGINAL_CHROME_FAIL',e);process.exitCode=1});
