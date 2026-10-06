async page => {
  const base='http://127.0.0.1:8765/archive/engine.html?data=exams%2F20_%EA%B8%88%EB%8B%B9%EC%A4%91_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EC%A4%912_%EA%B8%B0%EC%B6%9C.js&fit=screen';
  const result=[];
  for (const viewport of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]) {
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    for (const mode of ['exam','sol','ans']) {
      await page.goto(`${base}&mode=${mode}`,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(() => document.querySelectorAll('#print-area .page').length > 0, {timeout:20000}).catch(()=>{});
      await page.waitForTimeout(1600);
      const metrics=await page.evaluate(()=>{
        const area=document.querySelector('#print-area');
        const boxes=[...document.querySelectorAll('#print-area .q-box')];
        const images=[...document.querySelectorAll('#print-area img')].map(i=>({src:i.currentSrc||i.src.split('/').pop(),complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight}));
        const mathNodes=[...document.querySelectorAll('#print-area mjx-container')];
        const brokenMath=[...document.querySelectorAll('#print-area')].filter(e=>e.innerText.includes('$')).length;
        const clipped=boxes.map((b,i)=>{const r=b.getBoundingClientRect();return {i:i+1,top:Math.round(r.top),bottom:Math.round(r.bottom),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height),scrollWidth:b.scrollWidth,clientWidth:b.clientWidth,scrollHeight:b.scrollHeight,clientHeight:b.clientHeight}}).filter(x=>x.scrollWidth>x.clientWidth+2||x.scrollHeight>x.clientHeight+2);
        return {title:document.querySelector('#ctrl-title')?.innerText||'',pages:document.querySelectorAll('#print-area .page').length,boxCount:boxes.length,boxExamples:boxes.slice(0,2).map(x=>({id:x.id,className:x.className,text:x.innerText.slice(0,80)})),lastBox:boxes.at(-1)?.innerText.slice(0,240),images,mathJaxSource:window.__AP_MATHJAX_SOURCE__||null,mathJaxReady:window.MathJax?.startup?.document?.state??null,mathNodes:mathNodes.length,rawDollarText:brokenMath,docWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,docHeight:document.documentElement.scrollHeight,clipped};
      });
      const file=`.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출/render/${viewport.name}-${mode}.png`;
      await page.screenshot({path:file,fullPage:true});
      result.push({viewport:viewport.name,mode,file,...metrics});
    }
  }
  return JSON.stringify(result);
}
