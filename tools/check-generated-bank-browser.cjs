'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
  const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(p=>fs.existsSync(p));
  if(!chrome||!fs.existsSync(chrome))throw Error('Real Chrome unavailable: smoke PASS prohibited');
  const server=http.createServer((req,res)=>{
    try{const n=decodeURIComponent(new URL(req.url,'http://localhost').pathname),p=path.resolve(root,'.'+n);
      if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);res.end();return;}
      res.writeHead(200,{'Content-Type':(n.endsWith('.json')?'application/json':'text/html')+'; charset=utf-8'});
      fs.createReadStream(p).pipe(res);
    }catch(e){res.writeHead(500);res.end(String(e));}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url='http://127.0.0.1:'+server.address().port+'/archive/generated-bank.html';
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'b03-chrome-'));
  const browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
    '--no-first-run','--disable-background-networking','--remote-allow-origins=*',
    '--remote-debugging-port=0','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});
  let ws;
  try{
    let port=0;
    for(let k=0;k<100;k++){
      if(browser.exitCode!==null)throw Error('Chrome exited '+browser.exitCode);
      const p=path.join(temp,'DevToolsActivePort');
      if(fs.existsSync(p)){port=Number(fs.readFileSync(p,'utf8').split('\n')[0]);break;}
      await sleep(100);
    }
    if(!port)throw Error('Chrome debugging port not found');
    const targets=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
    const target=targets.find(x=>x.type==='page');
    if(!target)throw Error('Chrome page target missing');
    ws=new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
    let id=0;const pending=new Map();
    ws.addEventListener('message',ev=>{
      const d=JSON.parse(ev.data);if(!pending.has(d.id))return;
      const p=pending.get(d.id);pending.delete(d.id);d.error?p.reject(Error(JSON.stringify(d.error))):p.resolve(d.result);
    });
    const send=(method,params={})=>new Promise((resolve,reject)=>{
      const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));
    });
    const ev=async expression=>{
      const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});
      if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
      return r.result.value;
    };
    await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url});
    async function wait(expression,label){
      for(let i=0;i<120;i++){try{if(await ev(expression))return;}catch(e){if(i>115)throw e;}await sleep(100);}
      throw Error('Real Chrome mock-exam failure: '+label);
    }
    await wait("document.querySelectorAll('#exam-cards .exam-card').length===2",'two exam cards');
    const home=await ev("(()=>({labels:[...document.querySelectorAll('#exam-cards .exam-card')].map(x=>x.textContent),advanced:!!document.getElementById('advanced'),controls:[...document.querySelectorAll('main input,main select')].length,ready:document.getElementById('print').disabled}))()");
    if(home.advanced||home.controls||!home.ready||!home.labels.some(x=>x.includes('복성고')&&x.includes('23문항'))||!home.labels.some(x=>x.includes('효천고')&&x.includes('26문항')))throw Error('Exam-only screen incorrect '+JSON.stringify(home));
    await ev("(()=>{window.__paperPrintCount=0;window.print=()=>window.__paperPrintCount++;const btn=[...document.querySelectorAll('#exam-cards .exam-card')].find(x=>x.textContent.includes('복성고'));btn.click();document.getElementById('print').click();return true})()");
    await wait("window.__paperPrintCount===1",'Bokseong 23 question print');
    const bok=await ev("(()=>({cards:document.querySelectorAll('#paper-items .paper-question').length,title:document.getElementById('paper-title').textContent,enabled:!document.getElementById('print').disabled}))()");
    if(bok.cards!==23||!bok.title.includes('복성고')||!bok.enabled)throw Error('Bokseong source count mismatch '+JSON.stringify(bok));
    await ev("(()=>{[...document.querySelectorAll('#exam-cards .exam-card')].find(x=>x.textContent.includes('효천고')).click();document.getElementById('print').click();return true})()");
    await wait("window.__paperPrintCount===2",'Hyocheon 26 question print');
    const hyo=await ev("(()=>({cards:document.querySelectorAll('#paper-items .paper-question').length,title:document.getElementById('paper-title').textContent,sourceCount:SOURCE_EXAMS['69ad80ffa9ec80b2592bee26ffce247f8d7013d1'].count}))()");
    if(hyo.cards!==26||hyo.sourceCount!==26||!hyo.title.includes('효천고'))throw Error('Hyocheon source count mismatch '+JSON.stringify(hyo));
    const source=await ev("(async()=>{const bok=rows.filter(r=>r.school==='복성고'),hyo=rows.filter(r=>r.school==='효천고');const passes=await Promise.all([...bok,...hyo].map(async x=>{const q=await questionFor(x);return !!q.content&&q.answer!=null&&q.solution!=null}));return {total:rows.length,bok:bok.length,hyo:hyo.length,pass:passes.filter(Boolean).length,holdExcluded:!rows.some(x=>x.uid==='ALITE-BSG26-B05R2-Q22-S01'||x.uid==='ALITE-20261008-HYC26-Q10-001')};})()");
    if(source.total!==190||source.bok!==98||source.hyo!==92||source.pass!==190||!source.holdExcluded)throw Error('Data supply regression '+JSON.stringify(source));
    const b06=await ev("(async()=>{const b=rows.filter(r=>r.uid.startsWith('ALITE-BSG26-B06-'));const questions=await Promise.all(b.map(r=>questionFor(r)));const sources=[...new Set(questions.map(q=>q.image))];const graphics=await Promise.all(sources.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src,valid:img.naturalWidth>0,w:img.naturalWidth,h:img.naturalHeight});img.onerror=()=>resolve({src,valid:false});img.src=new URL(src,location.href).href;})));return {registered:b.length,objective:questions.filter(q=>q.choices.length===5).length,subjective:questions.filter(q=>q.choices.length===0).length,imageCount:sources.length,images:graphics,remainingMarkdown:questions.filter(q=>q.content.includes('**')).length,s01:questions.find(q=>q.uid.endsWith('B06-Q19-S01'))?.answer,s15:questions.find(q=>q.uid.endsWith('B06-Q19-S15'))?.answer}})()");
    if(b06.registered!==25||b06.objective!==23||b06.subjective!==2||b06.imageCount!==9||b06.remainingMarkdown||b06.s01!=='⑤'||b06.s15!=='④'||b06.images.some(x=>!x.valid))throw Error('B06 real SVG and original-pixel wrapper load mismatch '+JSON.stringify(b06));

    const table=await ev("(async()=>{const row=rows.find(x=>x.uid==='ALITE-BSG26-B04R2-Q23-S01');const q=await questionFor(row);const root=document.createElement('section');questionMarkup(root,q,row,true);return {table:root.querySelectorAll('table.question-table').length,rows:root.querySelectorAll('tr').length,noRaw:!root.textContent.includes('<table'),answer:root.textContent.includes('정답:')};})()");
    if(table.table!==1||table.rows!==3||!table.noRaw||!table.answer)throw Error('HTML table/subjective regression '+JSON.stringify(table));
    console.log('GENERATED_BANK_REAL_CHROME_SMOKE_PASS '+JSON.stringify({screen:'exam-select-and-print-only',bokseongPrinted:23,hyocheonPrinted:26,registered:190,bokseongAvailable:98,hyocheonAvailable:92,holdExcluded:true,tableSubjective:true}));
  }finally{
    if(ws)ws.close();
    browser.kill('SIGTERM');
    await new Promise(r=>server.close(r));
    try{fs.rmSync(temp,{recursive:true,force:true});}catch(e){}
  }
}
main().catch(e=>{console.error('GENERATED_BANK_REAL_CHROME_SMOKE_FAIL',e);process.exitCode=1;});
