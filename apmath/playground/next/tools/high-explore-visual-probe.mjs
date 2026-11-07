import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('playwright');
const root=process.cwd(),out=process.env.PROBE_OUT||'/tmp/high-explore-probe';
fs.mkdirSync(out,{recursive:true});
const cases=[
  ['alg-explog',['t2a','t2b','t4a','t4b','t6a','t6b','t8a','t8b','t9a','t9b','t10a','t10b','t11a']],
  ['alg-exp-deep',['t3a','t3b','t4a','t4b','t6a','t6b']]
];
const report={sourceHashes:Object.fromEntries(cases.map(([f])=>[f,crypto.createHash('sha256').update(fs.readFileSync(`apmath/playground/next/labs/${f}.html`)).digest('hex')])),kitHashes:Object.fromEntries(['apl-shell.js','apl.css'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(`apmath/playground/next/kit/${f}`)).digest('hex')])),cases:[],failures:[],commonDiagnostics:[]};
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch();
try{
  for(const [file,ids] of cases){
    for(const [width,height,theme,selected] of [[1440,900,'paper',ids],[390,844,'board',ids]]){
      const context=await browser.newContext({viewport:{width,height},hasTouch:width<1280}),page=await context.newPage();
      page.on('pageerror',e=>report.failures.push({file,width,error:e.message}));
      await page.addInitScript(()=>{let seed=424;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};});
      await page.goto(`http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/${file}.html?theme=${theme}`,{waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.lab?.board);
      const settle=async()=>{await page.waitForFunction(()=>!lab._tween);await page.evaluate(async()=>{lab.render();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));lab.render();});};
      for(const id of selected){
        await page.evaluate(id=>{lab.goScene(lab.list.findIndex(s=>s.id===id));lab.setTab('explore');lab.setStep(3);},id);await settle();
        const ctl=await page.evaluate(()=>{const e=Object.entries(lab._ctls||{}).find(([,c])=>c.input.type==='range'&&c.input.checkVisibility());if(!e)return null;const[k,c]=e,p=c.input.cloneNode(false);p.value=c.input.value;try{p.stepUp(3);if(p.value===c.input.value)p.stepDown(3);}catch{p.value=c.input.max;}return{key:k,value:p.value,label:c.input.getAttribute('aria-label')||APLab.stripEmoji(lab.params[k].label)};});
        if(ctl){await page.getByRole('slider',{name:ctl.label,exact:true}).fill(ctl.value);await settle();}
        if(!await page.evaluate(()=>lab.teach))await page.locator('.apl-teach-btn').click();
        await page.evaluate(()=>{window.scrollTo(0,0);lab.setStep(3);});await settle();
        const state=await page.evaluate(()=>({id:lab.scene.id,tab:lab.tab,step:lab.s.step,teach:lab.teach,params:lab.s,steps:typeof lab.scene.steps==='function'?lab.scene.steps(lab.s,lab):lab.scene.steps,presenter:lab.ui.presenter.innerText,katexErrors:[...document.querySelectorAll('.katex-error')].map(x=>x.textContent),overflow:document.documentElement.scrollWidth>innerWidth+3,board:{W:lab.board.W,H:lab.board.H,area:lab.board._area()},presenterBox:{width:lab.ui.presenter.getBoundingClientRect().width,height:lab.ui.presenter.getBoundingClientRect().height,textWidth:lab.ui.presenter.querySelector('.txt').getBoundingClientRect().width}}));
        const filename=`${file}--${id}--${width}-${theme}--explore-3.png`;
        await page.screenshot({path:path.join(out,filename),fullPage:false});
        report.cases.push({file,id,width,height,theme,control:ctl,state,screenshot:filename});
        if(state.katexErrors.length||!state.presenter||state.tab!=='explore'||state.step!==3||!state.teach||state.overflow||(width===390&&state.presenterBox.textWidth<140))report.failures.push({file,id,width,reason:'presenter-state',state});
      }
      await context.close();
    }
  }

  // Diagnose the two observed common-lines overflows with the production DOM.
  for(const [id,width,height,theme] of [['fixedPointPencil',390,844,'paper'],['fixedPointPencil',390,844,'board'],['trapLineSegmentMeet',1024,768,'paper'],['trapLineSegmentMeet',1024,768,'board']]){
    const context=await browser.newContext({viewport:{width,height},hasTouch:width<860}),page=await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/apmath/playground/next/labs/common-lines.html?theme=${theme}`,{waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.lab?.board);
    await page.evaluate(id=>{lab.goScene(lab.list.findIndex(s=>s.id===id));lab.setTab('explore');lab.setStep(0);lab.render();},id);
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const inspect=()=>page.evaluate(()=>({pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,nodes:[...document.querySelectorAll('.apl-panel-inner,.apl-controls,.apl-actions-row,.apl-actions-row .apl-btn,.apl-read .v,.apl-read .n')].filter(e=>e.checkVisibility()).map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return{class:e.className,text:e.textContent,left:r.left,right:r.right,width:r.width,scrollWidth:e.scrollWidth,minWidth:c.minWidth,whiteSpace:c.whiteSpace};})}));
    const source=await inspect();let withOldLabel=null,restored=null;
    if(id==='fixedPointPencil'){
      await page.evaluate(()=>{const b=[...document.querySelectorAll('.apl-actions-row .apl-btn span')].find(e=>e.textContent==='정점 P를 중심으로 회전');if(!b)throw Error('Expected actual action label missing');b.dataset.probeOriginal=b.textContent;b.textContent='k의 값에 따라 직선이 점 P를 중심으로 회전하는 모습 보기';});
      await page.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));withOldLabel=await inspect();
      await page.evaluate(()=>{const e=document.querySelector('[data-probe-original]');e.textContent=e.dataset.probeOriginal;delete e.dataset.probeOriginal;});
      await page.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));restored=await inspect();
    }
    const screenshot=`common-lines--${id}--${width}-${theme}--overflow-source.png`;
    await page.screenshot({path:path.join(out,screenshot),fullPage:false});
    report.commonDiagnostics.push({id,width,height,theme,source,withOldLabel,restored,screenshot,sourceHash:crypto.createHash('sha256').update(fs.readFileSync('apmath/playground/next/labs/common-lines.html')).digest('hex')});
    if(source.pageWidth>width+3||(restored&&restored.pageWidth>width+3))report.failures.push({id,width,theme,reason:'common-source-horizontal-overflow',source,restored});
    await context.close();
  }
}finally{fs.writeFileSync(path.join(out,'explore-visual-probe.json'),JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));}
console.log(JSON.stringify({cases:report.cases.length,failures:report.failures.length,sourceHashes:report.sourceHashes}));
if(report.failures.length)process.exitCode=1;
