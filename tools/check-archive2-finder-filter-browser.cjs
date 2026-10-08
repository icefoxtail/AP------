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
  await wait("!!document.querySelector('.finder-filter-bar [data-filter=\"axis\"]')",'finder filters');
  const desktop=await run("(()=>{const root=document.querySelector('.finder-filter-bar');const labels=[...root.querySelectorAll('.finder-field')].filter(el=>getComputedStyle(el).display!=='none'&&!el.classList.contains('finder-family'));const tops=labels.map(el=>el.getBoundingClientRect().top);return {count:labels.length,rows:new Set(tops.map(n=>Math.round(n))).size,overflow:root.scrollWidth>root.clientWidth+2,axis:!!root.querySelector('select[data-filter=\"axis\"]')}})()");
  if(desktop.count!==6||desktop.rows!==1||desktop.overflow||!desktop.axis)throw Error('Desktop filters are not one row: '+JSON.stringify(desktop));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await wait("!!document.querySelector('.finder-axis-quick button') && getComputedStyle(document.querySelector('.finder-axis-quick')).display==='grid'",'visible mobile term shortcuts');
  const mobile=await run("(()=>{const root=document.querySelector('.finder-filter-bar'),buttons=[...document.querySelectorAll('.finder-axis-quick button')];return {buttons:buttons.map(x=>({label:x.textContent,visible:x.getBoundingClientRect().height>=44})),overflow:root.scrollWidth>root.clientWidth+2}})()");
  if(mobile.buttons.length!==4||mobile.buttons.some(x=>!x.visible)||mobile.overflow)throw Error('Mobile controls missing/overflow: '+JSON.stringify(mobile));
  for(const [label,value] of [['1학기 중간','1-mid'],['1학기 기말','1-final'],['2학기 중간','2-mid'],['2학기 기말','2-final']]){
   const click=JSON.stringify(label);
   await run("(()=>{const b=[...document.querySelectorAll('.finder-axis-quick button')].find(x=>x.textContent==="+click+");if(!b)throw Error('missing term');b.click();return true})()");
   await wait("document.querySelector('select[data-filter=\"axis\"]').value==="+JSON.stringify(value),"term "+label);
   const pressed=await run("document.querySelector('.finder-axis-quick button[aria-pressed=\"true\"]')?.textContent");
   if(pressed!==label)throw Error('Wrong highlighted term '+pressed);
  }
  await run("(()=>{document.querySelector('.finder-axis-quick button[aria-pressed=\"true\"]').click();return true})()");
  await wait("document.querySelector('select[data-filter=\"axis\"]').value===''",'deselect mobile term');
  console.log('ARCHIVE2_FINDER_FILTER_CHROME_PASS '+JSON.stringify({desktop,mobile,mobileTermSelection:4,repeatTapClears:true}));
 }finally{
  ws?.close();proc.kill('SIGTERM');await new Promise(resolve=>server.close(resolve));
  try{fs.rmSync(profile,{recursive:true,force:true});}catch(e){}
 }
}
main().catch(e=>{console.error('ARCHIVE2_FINDER_FILTER_CHROME_FAIL',e);process.exitCode=1;});
