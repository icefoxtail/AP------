'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(process.env.ARCHIVE_EXAM_ACCESS_ROOT||path.resolve(__dirname,'..'));
const source=process.env.ARCHIVE_ORIGINAL_EXAM||'original/high/h2/1final/22_매산고_1학기_기말_고2_기하_기출.js';
const mode=process.env.ARCHIVE_OUTPUT_MODE||'exam';
assert(['exam','sol'].includes(mode),'exam or sol output mode required');
const full=path.resolve(root,'archive/exams',source);
assert(full.startsWith(path.resolve(root,'archive/exams')+path.sep)&&fs.existsSync(full),'original exam JS required');
const server=http.createServer((req,res)=>{
 try{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  const mime={'.js':'text/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream';
  res.writeHead(200,{'Content-Type':mime});fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN,headless:true}:{channel:'chrome',headless:true});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/archive/engine.html?data=${encodeURIComponent('exams/'+source)}&mode=${mode}`;
  await page.goto(url);await page.waitForFunction(targetMode=>{
   const ready=JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}');
   return ready.state==='RENDER_READY'&&typeof AppState!=='undefined'&&AppState.mode===targetMode&&AppState.data.length>0;
  },mode,{timeout:60000});
  const result=await page.evaluate(()=>({questions:AppState.data.length,pages:document.querySelectorAll('#print-area .page').length,
   visibleText:document.querySelector('#print-area')?.innerText?.length||0,images:[...document.querySelectorAll('#print-area img')].every(img=>img.complete&&img.naturalWidth>0)}));
  assert(result.questions>0&&result.pages>0&&result.visibleText>100&&result.images,'original output must render usable questions and images');
  assert.deepEqual(errors,[]);
  const pdf=await page.pdf({printBackground:true,preferCSSPageSize:true});
  assert(pdf.subarray(0,5).toString()==='%PDF-'&&pdf.length>1000,'Chrome must produce a nonempty PDF');
  console.log(JSON.stringify({status:'OUTPUT_TECHNICAL_PASS',source,mode,...result,pdfBytes:pdf.length}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
