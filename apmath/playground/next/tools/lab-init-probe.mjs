// Read-only browser startup diagnostics. Keep failed initialization evidence
// even when no Lab/Player instance exists; never turn timeouts into PASS.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createScreenshotGuard} from './browser-screenshot-guard.mjs';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../../..');
const args=process.argv.slice(2),value=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const out=path.resolve(value('--out','.tmp/lab-init-probe'));
const labs=value('--labs','common-circle-eq,common-functions,common-irrational,calc1-integral,geom-space-3d').split(',');
if(labs.some(x=>!/^[a-z0-9-]+$/.test(x)))throw Error('Invalid lab identifier');
fs.mkdirSync(out,{recursive:true});
const report={sourceSha:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),startedAt:new Date().toISOString(),contract:'STARTUP_DIAGNOSTICS_ONLY',rows:[]};
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{try{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
 if(!file.startsWith(root+path.sep)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
let browser;
try{
 const {chromium}=createRequire(import.meta.url)('playwright');browser=await chromium.launch({headless:true});
 for(const name of labs){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage(),row={lab:name,errors:[],console:[],resourceErrors:[],status:'NOT_RUN'};
  page.on('pageerror',e=>row.errors.push(String(e.stack||e)));
  page.on('console',m=>{if(['error','warning'].includes(m.type()))row.console.push({type:m.type(),text:m.text()});});
  page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))row.resourceErrors.push({url:r.url(),status:r.status()});});
  try{
   await page.goto(`${base}/apmath/playground/next/labs/${name}.html?theme=paper`,{waitUntil:'load',timeout:30000});
   await page.waitForFunction(()=>window.lab?.video&&lab.board&&lab.list.length,null,{timeout:7000});
   row.status=row.errors.length?'FAIL':'PASS';
  }catch(e){row.status='FAIL';row.error=String(e.stack||e);}
  row.document=await page.evaluate(()=>({readyState:document.readyState,title:document.title,body:document.body.innerText.slice(0,2000),hasLab:!!window.lab,hasAPL:!!window.APLab,labKeys:window.lab?Object.keys(lab):[]}));
  const guard=await createScreenshotGuard(page,{expectedTouch:true});
  await guard.capture(()=>page.screenshot({path:path.join(out,name+'.png'),fullPage:false}),{file:name+'.png',fullPage:false});
  await guard.close();await context.close();report.rows.push(row);
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({lab:name,status:row.status,errors:row.errors,document:row.document}));
 }
}finally{
 await browser?.close();await new Promise(r=>server.close(r));report.finishedAt=new Date().toISOString();
 report.status=report.rows.length===labs.length&&report.rows.every(r=>r.status==='PASS')?'PASS':'FAIL';
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
}
if(report.status!=='PASS')process.exitCode=1;
