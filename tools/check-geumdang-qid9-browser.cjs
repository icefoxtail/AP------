'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
 const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(p=>fs.existsSync(p));
 if(!chrome||!fs.existsSync(chrome))throw Error('Real Chrome unavailable: Geumdang Archive2 smoke PASS prohibited');
 const server=http.createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}const ext=path.extname(file);res.writeHead(200,{'Content-Type':({'.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.js':'text/javascript','.css':'text/css'}[ext]||'text/html')+'; charset=utf-8'});fs.createReadStream(file).pipe(res);}catch(e){res.writeHead(500);res.end(String(e));}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/archive/generated-bank.html`;
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'geumdang-archive2-'));const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-popup-blocking','--no-first-run','--disable-background-networking','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});let ws;
 try{
  let port=0;for(let i=0;i<100;i++){if(proc.exitCode!==null)throw Error(`Chrome exited ${proc.exitCode}`);const p=path.join(temp,'DevToolsActivePort');if(fs.existsSync(p)){port=Number(fs.readFileSync(p,'utf8').split('\n')[0]);break;}await sleep(100);}if(!port)throw Error('Chrome debugging port unavailable');
  const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json(),target=targets.find(x=>x.type==='page');if(!target)throw Error('Chrome target missing');
  ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});let id=0;const pending=new Map();ws.addEventListener('message',ev=>{const d=JSON.parse(ev.data);if(!pending.has(d.id))return;const p=pending.get(d.id);pending.delete(d.id);d.error?p.reject(Error(JSON.stringify(d.error))):p.resolve(d.result);});
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params,...(sessionId?{sessionId}:{})}));});
  const evaluate=async(expression,sessionId)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  await send('Target.setDiscoverTargets',{discover:true});await send('Page.enable');await send('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('APMATH_SESSION',JSON.stringify({session_token:'archive-smoke',role:'teacher',id:'t_admin'}));window.print=()=>{window.__printCount=(window.__printCount||0)+1};"});await send('Page.navigate',{url});
  async function wait(expression,label,session){for(let i=0;i<150;i++){try{if(await evaluate(expression,session))return;}catch{}await sleep(100);}throw Error(`Geumdang Archive2 smoke failed: ${label}`);}
  await wait("document.querySelector('#generated-search')&&rows.length>=198",'consumer index ready');
  const roster=await evaluate("(()=>{const q=rows.filter(r=>r.school==='금당고'&&r.uid.startsWith('ALITE-GEUMDANG25-2FINAL-'));const counts=Array.from({length:22},(_,i)=>q.filter(r=>r.sourceQid===i+1).length);return {count:q.length,unique:new Set(q.map(r=>r.uid)).size,counts,errors:q.filter(r=>r.technicalStatus==='ERROR').length}})()");
  if(roster.count!==198||roster.unique!==198||roster.counts.some(n=>n!==9)||roster.errors!==0)throw Error('Geumdang source roster mismatch '+JSON.stringify(roster));
  await evaluate("(()=>{document.querySelector('#manual-section').open=true;const x=document.querySelector('#generated-search');x.value='ALITE-GEUMDANG25-2FINAL-Q02-C2';x.dispatchEvent(new Event('input',{bubbles:true}));return true})()");
  await wait("document.querySelectorAll('#generated-results article').length===1",'exact UID search');
  const search=await evaluate("(()=>({text:document.querySelector('#generated-results article').innerText,summary:document.querySelector('#generated-search-summary').innerText}))()");
  if(!search.text.includes('금당고')||!search.text.includes('ALITE-GEUMDANG25-2FINAL-Q02-C2')||!search.text.includes('기술 상태: READY'))throw Error('Search result not operational '+JSON.stringify(search));
  await evaluate("document.querySelector('#generated-results article button').click()");await wait("document.querySelector('#generated-preview')?.innerText.includes('ALITE-GEUMDANG25-2FINAL-Q02-C2')",'problem preview');
  const problem=await evaluate("(()=>({choices:document.querySelectorAll('#generated-preview .choice').length,math:document.querySelectorAll('#generated-preview mjx-container').length,solutionButton:!!document.querySelector('#generated-preview .solution-preview')}))()");
  if(problem.choices!==5||!problem.solutionButton)throw Error('Problem choices/solution controls missing '+JSON.stringify(problem));
  await send('Target.setDiscoverTargets',{discover:true});await evaluate("document.querySelector('#generated-preview .solution-preview').click()");
  let sol=null;for(let i=0;i<100;i++){const all=await send('Target.getTargets');sol=all.targetInfos.find(t=>t.type==='page'&&t.url.includes('mixed_engine.html')&&t.url.includes('mode=sol'));if(sol)break;await sleep(100);}if(!sol)throw Error('Archive2 sol output envelope did not open');
  const attached=await send('Target.attachToTarget',{targetId:sol.targetId,flatten:true});const session=attached.sessionId;
  await wait("document.body?.innerText.includes('정답 및 해설')",'solution preview',session);
  const solution=await evaluate("(()=>({title:document.body.innerText.includes('금당고'),svgImages:[...document.images].filter(x=>x.src.includes('Q02-C2-solution.svg')).map(x=>({loaded:x.complete&&x.naturalWidth>0,width:x.naturalWidth})),text:document.body.innerText.slice(0,260)}))()",session);
  if(!solution.title||!solution.svgImages.some(x=>x.loaded))throw Error('Solution SVG not rendered '+JSON.stringify(solution));
  await evaluate("document.querySelector('#generated-results article button.primary').click()");await wait("document.querySelector('#generated-selection-summary').innerText.includes('1개')",'question selection');
  await evaluate("document.querySelector('#generated-print').click()");
  let problemOutput=null;for(let i=0;i<120;i++){const all=await send('Target.getTargets');problemOutput=all.targetInfos.find(t=>t.type==='page'&&t.url.includes('mixed_engine.html')&&t.url.includes('mode=exam')&&t.url.includes('preview=1'));if(problemOutput)break;await sleep(100);}if(!problemOutput)throw Error('Archive2 selected problem output preview did not open');
  const problemAttached=await send('Target.attachToTarget',{targetId:problemOutput.targetId,flatten:true});const problemSession=problemAttached.sessionId;
  await wait("document.body?.innerText.includes('생성문제')",'selected problem output preview',problemSession);
  const problemOutputView=await evaluate("(()=>({title:document.body.innerText.includes('생성문제'),choiceCount:document.querySelectorAll('.choices').length,questionText:document.body.innerText.includes('모든')}))()",problemSession);
  if(!problemOutputView.title||!problemOutputView.choiceCount||!problemOutputView.questionText)throw Error('Selected output preview content missing '+JSON.stringify(problemOutputView));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});const mobile=await evaluate('document.documentElement.scrollWidth<=innerWidth');if(!mobile)throw Error('Mobile width horizontal overflow');
  console.log('GEUMDANG_ARCHIVE2_CHROME_PASS '+JSON.stringify({searchUid:'ALITE-GEUMDANG25-2FINAL-Q02-C2',registered:roster.count,unique:roster.unique,perQid:9,problemChoices:problem.choices,mathRendered:problem.math>0,solutionSvgLoaded:solution.svgImages.some(x=>x.loaded),selectedProblemPreview:true,problemOutputView,mobileWidth:390,mobileOverflow:false}));
 }finally{if(ws)ws.close();proc.kill('SIGTERM');await new Promise(r=>server.close(r));try{fs.rmSync(temp,{recursive:true,force:true});}catch{}}
}
main().catch(e=>{console.error('GEUMDANG_ARCHIVE2_CHROME_FAIL',e);process.exitCode=1;});
