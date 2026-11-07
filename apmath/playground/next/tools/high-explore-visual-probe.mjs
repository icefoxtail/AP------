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
const report={sourceHashes:Object.fromEntries(cases.map(([f])=>[f,crypto.createHash('sha256').update(fs.readFileSync(`apmath/playground/next/labs/${f}.html`)).digest('hex')])),cases:[],failures:[]};
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch();
try{
  for(const [file,ids] of cases){
    for(const [width,height,theme,selected] of [[1440,900,'paper',ids],[390,844,'board',[ids[0]]]]){
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
        const state=await page.evaluate(()=>({id:lab.scene.id,tab:lab.tab,step:lab.s.step,teach:lab.teach,params:lab.s,steps:typeof lab.scene.steps==='function'?lab.scene.steps(lab.s,lab):lab.scene.steps,presenter:lab.ui.presenter.innerText,katexErrors:[...document.querySelectorAll('.katex-error')].map(x=>x.textContent),overflow:document.documentElement.scrollWidth>innerWidth+3,board:{W:lab.board.W,H:lab.board.H}}));
        const filename=`${file}--${id}--${width}-${theme}--explore-3.png`;
        await page.screenshot({path:path.join(out,filename),fullPage:false});
        report.cases.push({file,id,width,height,theme,control:ctl,state,screenshot:filename});
        if(state.katexErrors.length||!state.presenter||state.tab!=='explore'||state.step!==3||!state.teach||state.overflow)report.failures.push({file,id,width,reason:'presenter-state',state});
      }
      await context.close();
    }
  }
}finally{fs.writeFileSync(path.join(out,'explore-visual-probe.json'),JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));}
console.log(JSON.stringify({cases:report.cases.length,failures:report.failures.length,sourceHashes:report.sourceHashes}));
if(report.failures.length)process.exitCode=1;
