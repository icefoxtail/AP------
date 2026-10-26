// Verify in the real Archive solution page (mode=sol) of every changed exam: the page renders without an error, and each published figure is shown and loaded.
// usage: APMS_ROOT=<worktree> node verify-published.mjs <publish-report.json> <out.json>
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';
const ROOT=(process.env.APMS_ROOT||'').split(String.fromCharCode(92)).join('/').replace(/\/?$/,'/');
const {launchBrowser}=await import(new URL('../../visual-browser-runtime.mjs',import.meta.url).href);
const [reportPath,outPath]=process.argv.slice(2);
const report=JSON.parse(fs.readFileSync(reportPath,'utf8')).filter(r=>r.status==='OK'&&r.items.some(i=>i.ok));
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff':'font/woff','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://x').pathname),f=path.resolve(ROOT,'.'+p);if(!f.startsWith(path.resolve(ROOT))||!fs.existsSync(f)||!types[path.extname(f)]){res.writeHead(404);res.end();return;}res.writeHead(200,{'content-type':types[path.extname(f)]});res.end(fs.readFileSync(f));}catch{res.writeHead(500);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await launchBrowser();const results=[];
for(const ex of report){
  const rel=fs.existsSync(ROOT+'archive/exams/original/high/h1/1mid/'+ex.exam+'.js')?null:null;
  // locate the exam file by name
  const found=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name===ex.exam+'.js')found.push(p);}};walk(ROOT+'archive/exams/original');
  const file=found[0].split(String.fromCharCode(92)).join('/'),dataParam=file.slice((ROOT+'archive/').length);
  const ords=ex.items.filter(i=>i.ok).map(i=>i.ord);const page=await browser.newPage({viewport:{width:1100,height:1400}});
  const row={exam:ex.exam,figures:ords.length,status:'OK',missing:[]};
  try{
    await page.goto(base+'/archive/engine.html?preview=1&qpp=4&mode=sol&data='+encodeURIComponent(dataParam),{waitUntil:'domcontentloaded',timeout:60000});
    const s=await page.waitForFunction(()=>{const e=document.documentElement.dataset.apRenderError;if(e)return {error:e};const t=document.getElementById('ctrl-title');if(t&&t.innerText==='시험지 데이터를 불러올 수 없습니다')return {error:'LOAD_ERROR'};const r=document.getElementById('print-area');if(r&&r.querySelector('.page')){const s2=document.documentElement.dataset.apPrintReadiness;if(!s2)return {ok:true};try{const v=JSON.parse(s2);if(!v.failed&&['RENDER_READY','PRINT_READY'].includes(v.state))return {ok:true};}catch{}}return false;},null,{timeout:90000}).then(h=>h.jsonValue()).catch(()=>({error:'TIMEOUT'}));
    if(!s.ok){row.status='RENDER_ERROR:'+s.error;}
    else{
      await page.waitForTimeout(800);
      const shown=await page.evaluate(()=>[...document.querySelectorAll('#print-area img')].map(i=>({src:i.getAttribute('src')||'',w:i.naturalWidth,done:i.complete})));
      for(const o of ords){const hit=shown.find(i=>i.src.includes('/q'+o+'-solution')||i.src.includes('q'+o+'-solution'));if(!hit||!hit.done||hit.w<=0)row.missing.push(o);}
      if(row.missing.length)row.status='FIGURE_NOT_SHOWN';
    }
  }catch(e){row.status='ERROR:'+String(e.message).slice(0,60);}
  await page.close();results.push(row);console.log(row.exam.slice(0,34).padEnd(34),row.status,row.missing.join(',')||'');
}
fs.writeFileSync(outPath,JSON.stringify(results,null,1));await browser.close();server.close();
const c={};for(const r of results)c[r.status.split(':')[0]]=(c[r.status.split(':')[0]]||0)+1;console.log('SUMMARY',JSON.stringify(c));
