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
    const count="document.getElementById('count').textContent";
    async function wait(expression,value,label){
      for(let i=0;i<100;i++){try{if((await ev(expression))===value)return;}catch(e){if(i>85)throw e;}await sleep(100);}
      throw Error('Real browser smoke failure: '+label);
    }
    await wait(count,'165','165 registered');
    await ev("(()=>{const s=document.getElementById('school');s.value='복성고';s.dispatchEvent(new Event('change'));return true})()");
    await wait(count,'73','school filter');
    await ev("(()=>{const q=document.getElementById('query');q.value='ALITE-BSG26-B03-Q14-I10';q.dispatchEvent(new Event('input'));return true})()");
    await wait(count,'1','UID search');
    await ev("(()=>{document.querySelector('#items .item button').click();return true})()");
    await wait("!document.getElementById('toggle-answer').disabled",true,'preview');
    if(!(await ev("(()=>{const t=document.getElementById('detail').innerText;return t.includes('(가)')&&t.includes('(나)')&&t.includes('(다)')&&!t.includes('<br')})()")))throw Error('Multi-statement view malformed');
    await ev("(()=>{document.getElementById('toggle-answer').click();return true})()");
    await wait("document.getElementById('detail').innerText.includes('정답: ④')",true,'answer and solution');
    if(!(await ev("(()=>{document.querySelector('#items .item input[type=checkbox]').click();return !document.getElementById('print').disabled})()")))throw Error('Selection failed');
    const all=await ev("(async()=>{const r=rows.filter(x=>x.school==='복성고');const t=await Promise.all(r.map(async x=>{const q=await questionFor(x);return x.uid===q.uid&&((q.choices.length===5&&q.solution.endsWith('정답은 '+q.answer+'이다.'))||(q.choices.length===0&&q.answer.length>0&&q.solution.length>0))}));return [r.length,t.filter(Boolean).length]})()");
    if(all[0]!==73||all[1]!==73)throw Error('B04/B05 plus B03 lookup mismatch '+JSON.stringify(all));
    // Real registered B04/B05 UID smoke, including the actual student-facing table and non-objective answers.
    await ev("(()=>{const q=document.getElementById('query');q.value='ALITE-BSG26-B04R2-Q23-S01';q.dispatchEvent(new Event('input'));return true})()");
    await wait(count,'1','B04 HTML table UID search');
    await ev("(()=>{document.querySelector('#items .item button').click();return true})()");
    await wait("!document.getElementById('toggle-answer').disabled",true,'B04 table preview');
    const tableOk=await ev("(()=>{const p=document.getElementById('detail');return p.querySelectorAll('table.question-table').length===1&&p.querySelectorAll('tr').length===3&&!p.textContent.includes('<table')})()");
    if(!tableOk)throw Error('Actual B04 q23 source table DOM was not preserved');
    await ev("(()=>{document.getElementById('toggle-answer').click();return true})()");
    await wait("document.querySelector('#detail .answer')!==null",true,'B04 subject answer view');
    if(!(await ev("(()=>{document.querySelector('#items .item input[type=checkbox]').click();return !document.getElementById('print').disabled})()")))throw Error('B04 subjective selection failed');
    await ev("(()=>{const q=document.getElementById('query');q.value='ALITE-BSG26-B05R2-Q21-S07';q.dispatchEvent(new Event('input'));return true})()");
    await wait(count,'1','B05 combination UID search');
    await ev("(()=>{document.querySelector('#items .item button').click();return true})()");
    await wait("!document.getElementById('toggle-answer').disabled",true,'B05 q21 subjective preview');
    await ev("(()=>{document.getElementById('toggle-answer').click();return true})()");
    await wait("document.querySelector('#detail .answer')!==null",true,'B05 q21 answer view');
    await ev("(()=>{const q=document.getElementById('query');q.value='ALITE-BSG26-B05R2-Q22-S01';q.dispatchEvent(new Event('input'));return true})()");
    await wait(count,'0','B05 q22 RPM HOLD must not be selectable');
    await ev("(()=>{const s=document.getElementById('school');s.value='';s.dispatchEvent(new Event('change'));const q=document.getElementById('query');q.value='ALITE-20261008-HYC26-Q10-001';q.dispatchEvent(new Event('input'));return true})()");
    await wait(count,'0','HOLD excluded');
    await ev("(()=>{const q=document.getElementById('query');q.value='';q.dispatchEvent(new Event('input'));const s=document.getElementById('school');s.value='효천고';s.dispatchEvent(new Event('change'));return true})()");
    await wait(count,'92','legacy Hyocheon count');
    const synthetic=await ev("(async()=>{const row={uid:'ALITE-BSG26-B04R2-Q23-S01',sourceQid:23,school:'복성고',l2:'H22-C-09-MATRIX_APPLICATION',localOrdinal:1,shard:'data/generated-lite-consumer/v1/shards/synthetic-subjective.json'};const question={questionType:'서술형',content:'코스 표.<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>코스</th><th>가</th></tr></thead><tbody><tr><th>출발</th><td>1</td></tr></tbody></table></div>경로 수?',choices:[],answer:'$8$',solution:'8가지.'};cache.set(row.shard,Promise.resolve({schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',records:[{sourceKind:'generated',generatedUid:row.uid,localOrdinal:1,question}]}));const q=await questionFor(row);const panel=document.createElement('div');questionMarkup(panel,q,row,true);return {subjective:q.choices.length===0,tableCount:panel.querySelectorAll('table').length,tableRows:panel.querySelectorAll('tr').length,rawMarkup:panel.textContent.includes('<table'),answer:panel.textContent.includes('정답: $8$')};})()");
    if(!synthetic.subjective||synthetic.tableCount!==1||synthetic.tableRows!==2||synthetic.rawMarkup||!synthetic.answer)throw Error('Subjective/table Chrome compatibility failed: '+JSON.stringify(synthetic));
    console.log('GENERATED_BANK_REAL_CHROME_SMOKE_PASS '+JSON.stringify({registered:165,bokseongAvailable:73,bokseongLookupVerified:73,b04b05New:35,actualB04Table:true,actualB05Subjective:true,q22HoldExcluded:true,preview:true,answer:true,selected:true,excludedHold:true,oldHyocheon:92}));
  }finally{
    if(ws)ws.close();
    browser.kill('SIGTERM');
    await new Promise(r=>server.close(r));
    try{fs.rmSync(temp,{recursive:true,force:true});}catch(e){}
  }
}
main().catch(e=>{console.error('GENERATED_BANK_REAL_CHROME_SMOKE_FAIL',e);process.exitCode=1;});
