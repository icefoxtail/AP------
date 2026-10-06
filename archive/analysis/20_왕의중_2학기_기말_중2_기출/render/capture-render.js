async page => {
 const out=[]; const base='http://127.0.0.1:8765/archive/engine.html?data=exams%2Foriginal%2Fmiddle%2Fm2%2F2final%2F20_%EC%99%95%EC%9D%98%EC%A4%91_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EC%A4%912_%EA%B8%B0%EC%B6%9C.js&fit=screen';
 const root='C:/Users/USER/Desktop/AP-worktrees/m2-archive-20261006/AP------/.tmp/archive/archive2-m2-codex-20261006-03/20_왕의중_2학기_기말_중2_기출/render';
 for(const v of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]){
  await page.setViewportSize({width:v.width,height:v.height});
  for(const mode of ['exam','sol','ans']){
   await page.goto(`${base}&mode=${mode}`,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelectorAll('#print-area .page').length>0,{timeout:30000});
   await page.waitForTimeout(2000);
   await page.evaluate(()=>window.MathJax?.startup?.promise||Promise.resolve());
   const metrics=await page.evaluate(()=>{
    const boxes=[...document.querySelectorAll('#print-area .q-box')];
    const imgs=[...document.querySelectorAll('#print-area img')].map(i=>({src:(i.currentSrc||i.src).replace(location.origin,''),complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,alt:i.alt||''}));
    const clipped=boxes.map((b,i)=>{const r=b.getBoundingClientRect();return {qid:i+1,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height),clientWidth:b.clientWidth,scrollWidth:b.scrollWidth,clientHeight:b.clientHeight,scrollHeight:b.scrollHeight,text:(b.innerText||'').slice(0,220)}}).filter(x=>x.scrollWidth>x.clientWidth+2||x.scrollHeight>x.clientHeight+2);
    const math=[...document.querySelectorAll('#print-area mjx-container')];
    const rawMath=[...document.querySelectorAll('#print-area *')].some(e=>e.children.length===0&&/\\\([^)]*\\\)|\\\[[^\]]*\\\]|\$[^$]+\$/.test(e.textContent||''));
    return {title:document.querySelector('#ctrl-title')?.innerText||'',pages:document.querySelectorAll('#print-area .page').length,boxCount:boxes.length,lastBoxText:boxes.at(-1)?.innerText||'',imageCount:imgs.length,images:imgs,badImages:imgs.filter(i=>!i.complete||i.naturalWidth===0).length,mathJaxState:window.MathJax?.startup?.document?.state??null,mathNodeCount:math.length,rawUnrenderedMath:rawMath,docWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2,clipped,boxes:boxes.map((b,i)=>({qid:i+1,width:b.clientWidth,height:b.clientHeight,scrollWidth:b.scrollWidth,scrollHeight:b.scrollHeight,text:(b.innerText||'').slice(0,120)})),answerRowCount:document.querySelectorAll('#print-area tr').length,docHeight:document.documentElement.scrollHeight};
   });
   const file=`${root}/${v.name}-${mode}.png`;
   await page.screenshot({path:file,fullPage:true});
   out.push({viewport:v.name,mode,file,...metrics});
  }
 }
 return JSON.stringify(out);
}
