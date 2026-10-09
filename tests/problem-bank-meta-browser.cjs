'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',f.endsWith('.json')?'application/json; charset=utf-8':f.endsWith('.js')?'text/javascript; charset=utf-8':f.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8');
 fs.createReadStream(f).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch(process.env.CHROME_BIN ?
    {executablePath:process.env.CHROME_BIN,headless:true} : {channel:'chrome',headless:true});
  const context=await browser.newContext();
  await context.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('quota','QuotaExceededError');};});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base=`http://127.0.0.1:${server.address().port}/archive/`;
  await page.goto(base+'problem-bank-search.html');
  await page.waitForFunction(()=>typeof inventory!=='undefined'&&inventory.length>10000);
  assert.equal(await page.locator('#results article').count(),40);
  const original=await page.locator('#results article a').first().getAttribute('href');
  assert.match(original,/engine\.html\?data=exams%2F/);
  await page.selectOption('#source','generated');
  const registered=await page.evaluate(()=>matching.length);
  assert.equal(registered,JSON.parse(fs.readFileSync(path.join(root,'archive/data/generated-lite-consumer/v1/index.json'))).approvedCount);
  for(const bucket of ['1','2','3','4','5','UNKNOWN']){
   await page.selectOption('#difficulty',bucket);
   assert.equal(await page.evaluate(b=>matching.every(r=>r.difficultyBucket===(b==='UNKNOWN'?null:Number(b))),bucket),true);
   if(await page.locator('#results article button').count()){
    await page.locator('#results article button').first().click();
    await page.waitForFunction(()=>!document.querySelector('#results article button').disabled);
    const rendered=await page.locator('#preview').textContent();
    assert.ok(rendered.length>30&&!/GENERATED_|불러오는 중|오류/.test(rendered),rendered);
   }
  }
  const safeTable=await page.evaluate(()=>{const host=document.createElement('div');safeStem(host,'before<div class="question-table-wrap"><table class="question-table"><tr><th>A</th><td>1</td></tr></table></div>after<script>bad()</script>');return {tables:host.querySelectorAll('table').length,cells:host.querySelectorAll('th,td').length,scripts:host.querySelectorAll('script').length,text:host.textContent};});
  assert.equal(safeTable.tables,1);assert.equal(safeTable.cells,2);assert.equal(safeTable.scripts,0);assert.ok(safeTable.text.includes('before')&&safeTable.text.includes('after'));
  await page.selectOption('#difficulty','UNKNOWN');
  assert.equal(await page.evaluate(()=>matching.length),7);
  await page.selectOption('#difficulty','');
  const l2=await page.evaluate(()=>inventory.find(r=>r.sourceKind==='generated'&&r.L2&&!r.L2.includes('|'))?.L2);
  assert.ok(l2,'recovered exact RPM L2 exists');
  await page.selectOption('#L2',l2);
  assert.ok(await page.evaluate(()=>matching.length>0));
  await page.selectOption('#source','');
  assert.ok(await page.evaluate(()=>matching.some(r=>r.sourceKind==='original')&&matching.some(r=>r.sourceKind==='generated')),'same L2 includes original and Generated');
  await page.selectOption('#source','generated');
  await page.locator('#results article button').first().click();
  await page.waitForFunction(()=>!document.querySelector('#results article button').disabled);
  const preview=await page.locator('#preview').textContent();
  assert.ok(preview.length>30&&!/GENERATED_|불러오는 중|오류/.test(preview),preview);
  assert.equal(await page.locator('#preview .answer').count(),0);
  const target=await page.locator('#results article a').first().getAttribute('href');
  await page.goto(base+target);
  await page.waitForFunction(()=>document.querySelector('#generated-results .generated-question-card'));
  assert.equal(await page.locator('#generated-results .generated-question-card').count(),1);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'ACTUAL_CHROME_PASS',registered,scopeL2:l2,difficultyBuckets:[1,2,3,4,5,'UNKNOWN'],unknown:7,storageFailure:true,generatedExactSelection:true}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
