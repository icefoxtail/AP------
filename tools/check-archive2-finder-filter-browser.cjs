'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
 const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(fs.existsSync);
 if(!chrome)throw Error('Real Chrome is required');
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
 const server=http.createServer((req,res)=>{
  try{const filename=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
   if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404);res.end();return;}
   res.setHeader('Content-Type',(types[path.extname(filename)]||'application/octet-stream')+'; charset=utf-8');
   fs.createReadStream(filename).pipe(res);
  }catch(e){res.writeHead(500);res.end(String(e));}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'archive-finder-'));
 const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-background-networking','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
 let ws;
 try{
  let port=0;for(let i=0;i<150;i++){if(proc.exitCode!==null)throw Error('Chrome exited');const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=Number(fs.readFileSync(f,'utf8').split('\n')[0]);break;}await sleep(100);}
  if(!port)throw Error('Chrome DevTools unavailable');
  const target=(await(await fetch('http://127.0.0.1:'+port+'/json/list')).json()).find(x=>x.type==='page');
  if(!target)throw Error('Chrome page target unavailable');
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let id=0;const pending=new Map();
  ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data),p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
  const run=async expression=>{const data=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(data.exceptionDetails)throw Error(JSON.stringify(data.exceptionDetails));return data.result.value;};
  const wait=async(expression,label)=>{for(let n=0;n<160;n++){if(await run(expression))return;await sleep(200);}throw Error('Timed out: '+label);};
  await send('Runtime.enable');await send('Page.enable');
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('APMATH_SESSION',JSON.stringify({id:'local-read-only',role:'teacher'}));"});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/archive/workspace.html?view=find'});
  await wait("!!document.querySelector('.find-panel .find-grade')",'finder filters');
  const visibleTall=`(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>=44})`;
  const desktop=await run(`(()=>{const tall=${visibleTall};const grades=[...document.querySelectorAll('.find-grade')],terms=[...document.querySelectorAll('.find-term')];const tops=[...grades,...terms].map(el=>Math.round(el.getBoundingClientRect().top));return {grades:grades.length,terms:terms.length,tall:[...grades,...terms].every(tall),oneRow:new Set(tops).size===1,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,similar:!!document.querySelector('.find-check input[data-filter="similarOnly"]')}})()`);
  if(desktop.grades!==6||desktop.terms!==4||!desktop.tall||!desktop.oneRow||desktop.overflow||!desktop.similar)throw Error('Desktop filters are not one row: '+JSON.stringify(desktop));
  // The fold keeps every other filter (nothing was removed, only moved).
  await run("(()=>{const d=document.querySelector('.find-more');if(!d.open)d.querySelector('summary').click();return true})()");
  await wait("document.querySelector('.find-more').open",'open the fold');
  const fold=await run("(()=>{const q=s=>!!document.querySelector('.find-more [data-filter=\"'+s+'\"]');return {curriculum:q('curriculumKey'),subject:q('semanticSubject')||q('courseKey'),school:q('school'),from:q('yearFrom'),to:q('yearTo'),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2}})()");
  if(!fold.curriculum||!fold.subject||!fold.school||!fold.from||!fold.to||fold.overflow)throw Error('Folded filters missing/overflow: '+JSON.stringify(fold));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await wait("!!document.querySelector('.find-term')&&getComputedStyle(document.querySelector('.find-divider')).display==='none'",'visible mobile term shortcuts');
  const mobile=await run(`(()=>{const tall=${visibleTall};const buttons=[...document.querySelectorAll('.find-term')];return {buttons:buttons.map(x=>({label:x.textContent,visible:tall(x)})),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2}})()`);
  if(mobile.buttons.length!==4||mobile.buttons.some(x=>!x.visible)||mobile.overflow)throw Error('Mobile controls missing/overflow: '+JSON.stringify(mobile));
  for(const [label,value] of [['1학기 중간','1-mid'],['1학기 기말','1-final'],['2학기 중간','2-mid'],['2학기 기말','2-final']]){
   const click=JSON.stringify(label);
   await run("(()=>{const b=[...document.querySelectorAll('.find-term')].find(x=>x.textContent==="+click+");if(!b)throw Error('missing term');b.click();return true})()");
   await wait("new URLSearchParams(location.search).get('axis')==="+JSON.stringify(value),"term "+label);
   const pressed=await run("[...document.querySelectorAll('.find-term[aria-pressed=\"true\"]')].map(x=>x.textContent).join('|')");
   if(pressed!==label)throw Error('Wrong highlighted term '+pressed);
  }
  await run("(()=>{document.querySelector('.find-term[aria-pressed=\"true\"]').click();return true})()");
  await wait("!new URLSearchParams(location.search).get('axis')",'deselect mobile term');
  await run("(()=>{[...document.querySelectorAll('.find-grade')].find(x=>x.textContent==='고1').click();return true})()");
  await wait("new URLSearchParams(location.search).get('grade')==='고1'&&document.querySelector('.find-grade[aria-pressed=\"true\"]')?.textContent==='고1'",'grade button');
  await run("(()=>{document.querySelector('.find-grade[aria-pressed=\"true\"]').click();return true})()");
  await wait("!new URLSearchParams(location.search).get('grade')",'grade button clears');
  console.log('ARCHIVE2_FINDER_FILTER_CHROME_PASS '+JSON.stringify({desktop,fold,mobile,mobileTermSelection:4,repeatTapClears:true}));
  await require('./check-archive-rpm-middle-browser.cjs')({
   send, run, wait,
   baseUrl:'http://127.0.0.1:'+server.address().port,
   reportDir:process.env.RPM_MIDDLE_BROWSER_REPORT_DIR||path.join(root,'.tmp','rpm-middle-browser-ci'),
  });
 }finally{
  ws?.close();proc.kill('SIGTERM');await new Promise(resolve=>server.close(resolve));
  try{fs.rmSync(profile,{recursive:true,force:true});}catch(e){}
 }
}
main().catch(e=>{console.error('ARCHIVE2_FINDER_FILTER_CHROME_FAIL',e);process.exitCode=1;});
