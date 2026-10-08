'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),delay=t=>new Promise(r=>setTimeout(r,t));
async function main(){
  const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(fs.existsSync);
  if(!chrome)throw Error('CHROME_UNAVAILABLE');
  const server=http.createServer((req,res)=>{
    try {
      const u=new URL(req.url,'http://127.0.0.1'),p=path.resolve(root,'.'+decodeURIComponent(u.pathname));
      if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);res.end('NOT_FOUND');return;}
      const type=p.endsWith('.js')?'text/javascript':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.png')?'image/png':p.endsWith('.css')?'text/css':p.endsWith('.json')?'application/json':'text/html';
      res.writeHead(200,{'Content-Type':type+'; charset=utf-8'});fs.createReadStream(p).pipe(res);
    }catch(e){res.writeHead(500);res.end(String(e));}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'b06-engine-')),capture=process.env.B06_CAPTURE_DIR||path.join(temp,'capture');
  fs.mkdirSync(capture,{recursive:true});
  const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-first-run','--disable-background-networking','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});
  let ws;
  try{
    let port=0;
    for(let i=0;i<140;i++){
      if(proc.exitCode!==null)throw Error('Chrome exited '+proc.exitCode);
      const t=path.join(temp,'DevToolsActivePort');
      if(fs.existsSync(t)){port=Number(fs.readFileSync(t,'utf8').split('\n')[0]);break}
      await delay(100);
    }
    if(!port)throw Error('DevTools port not found');
    const pages=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
    const page=pages.find(p=>p.type==='page');
    ws=new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res,rej)=>{ws.addEventListener('open',res,{once:true});ws.addEventListener('error',rej,{once:true})});
    let n=0;const pending=new Map();
    ws.addEventListener('message',e=>{const d=JSON.parse(e.data);if(!pending.has(d.id))return;const p=pending.get(d.id);pending.delete(d.id);d.error?p.reject(Error(JSON.stringify(d.error))):p.resolve(d.result)});
    const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++n;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
    const ev=async expression=>{
      const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});
      if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
      return r.result.value;
    };
    await send('Runtime.enable');await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride',{width:1380,height:1100,deviceScaleFactor:1,mobile:false});
    const records=[],svgPaths=new Set();
    const origin='http://127.0.0.1:'+server.address().port;
    for(const [src,expected,countSvg] of [['B06_REVIEW_Q18.js',10,6],['B06_REVIEW_Q19.js',15,2]]){
      for(const mode of ['exam','sol']){
        await send('Page.navigate',{url:origin+'/archive/engine.html?data=exams/'+src+'&mode='+mode+'&qpp=4'});
        const expectedExp=JSON.stringify(expected),modeExp=JSON.stringify(mode);
        let ready=false,last=null;
        for(let i=0;i<600;i++){
          try{
            const out=await ev("(()=>{const state=typeof AppState!=='undefined'?AppState:null;const area=document.getElementById('print-area');const boxes=area?.querySelectorAll('.q-box[data-source-ref]')||[];const imgs=[...(area?.querySelectorAll('.q-image-wrap img')||[])];return {state:state?.data?.length||0,mode:state?.mode||null,boxCount:boxes.length,imgCount:imgs.length,imagesReady:imgs.every(x=>x.complete&&x.naturalWidth>0),broken:imgs.filter(x=>x.complete&&x.naturalWidth===0).map(x=>x.currentSrc),error:area?.textContent?.slice(0,160)}})()");
            last=out;
            if(out.state===expected&&out.mode===mode&&out.boxCount===expected&&out.imgCount===expected&&out.imagesReady){ready=true;break}
          }catch(e){last=String(e)}
          await delay(125);
        }
        if(!ready)throw Error('ENGINE_RENDER_NOT_READY '+src+' '+mode+' '+JSON.stringify(last));
        const audit=await ev("(()=>{const area=document.getElementById('print-area');const imgs=[...area.querySelectorAll('.q-image-wrap img')];const svg=imgs.filter(x=>new URL(x.currentSrc).pathname.endsWith('.svg')).map(x=>new URL(x.currentSrc).pathname);const badStars=area.innerText.includes('**');const math=area.querySelectorAll('mjx-container').length;return {q:area.querySelectorAll('.q-box[data-source-ref]').length,img:imgs.length,broken:imgs.filter(x=>x.naturalWidth===0).length,svg,rawMarkdown:badStars,mathjax:math,visibleHeight:area.scrollHeight}})()");
        if(audit.q!==expected||audit.img!==expected||audit.broken||audit.rawMarkdown)throw Error('ENGINE_RENDER_BROKEN '+src+' '+mode+' '+JSON.stringify(audit));
        if(audit.svg.length!==countSvg)throw Error('SVG_REFERENCES_MISMATCH '+src+' '+mode+' '+JSON.stringify(audit.svg));
        if(audit.mathjax<expected)throw Error('MATHJAX_NOT_RENDERED '+src+' '+mode+' '+audit.mathjax);
        audit.svg.forEach(x=>svgPaths.add(x));
        const screen=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
        const out=path.join(capture,src.replace('.js','')+'-'+mode+'.png');
        fs.writeFileSync(out,Buffer.from(screen.data,'base64'));
        records.push({source:src,mode,...audit,screenshot:path.basename(out)});
      }
    }
    if(svgPaths.size!==7)throw Error('SVG_DISTINCT_COUNT '+svgPaths.size);
    const report={schemaVersion:'B06_ACTUAL_ENGINE_RENDER_CHROME_V1',sourceGitBranch:process.env.GITHUB_REF_NAME||'local',mathEditorSource:'exact binary-alias of repaired B06 student JS',rows:records,distinctSvgAssets:[...svgPaths],all25ExamAndSolutionViews:true,originalPng2AndSvg7Rendered:true};
    fs.writeFileSync(path.join(capture,'receipt.json'),JSON.stringify(report,null,2)+'\n');
    console.log('B06_ACTUAL_ENGINE_RENDER_PASS '+JSON.stringify({examAndSolCount:records.length,examQuestionCount:25,solutionQuestionCount:25,distinctSvgAssets:svgPaths.size,allImagesReady:true,rawMarkdown:false,images:records.map(x=>x.img),mathjax:records.map(x=>x.mathjax)}));
  } finally {
    if(ws)ws.close();
    proc.kill('SIGTERM');await new Promise(r=>server.close(r));
    // the screenshots are stored outside temp when B06_CAPTURE_DIR is set by workflow
  }
}
main().catch(e=>{console.error('B06_ACTUAL_ENGINE_RENDER_FAIL',e.stack||e);process.exitCode=1});
