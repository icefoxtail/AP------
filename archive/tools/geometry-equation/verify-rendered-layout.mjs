import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchBrowser,assertOutput} from './visual-browser-runtime.mjs';
import {sha256} from './verify-visual-engine-static.mjs';

export async function collectRenderedLayout(page) {
  await page.evaluate(()=>document.fonts.ready);
  return page.evaluate(()=>{
    const svg=document.querySelector('svg');if(!svg||document.querySelector('parsererror'))throw Error('SVG_RENDER_PARSE_FAIL');
    const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;
    const rect=b=>({x:b.x,y:b.y,width:b.width,height:b.height});
    const project=(e,x,y)=>{const p=new DOMPoint(x,y).matrixTransform(e.getScreenCTM());return[p.x,p.y];};
    const labels=[...svg.querySelectorAll('text')].map(e=>{
      const bbox=e.getBBox(),client=e.getBoundingClientRect();
      const value=e.textContent||'';let missing=Number(value.includes('�')||value.includes('□'));
      for(let i=0;i<e.getNumberOfChars();i++){const c=value[i];if(c&&!/\s/.test(c)){const b=e.getExtentOfChar(i);if(!b.width||!b.height)missing++;}}
      return{id:e.id,kind:e.getAttribute('data-label-kind')||'LEGACY_TEXT',priority:Number(e.getAttribute('data-priority')||2),value,bbox:rect(bbox),client:rect(client),missingGlyphCount:missing,font:getComputedStyle(e).fontFamily};
    });
    const geometry=[...svg.querySelectorAll('circle,line,polyline,polygon,path,rect[data-role="conditionBox"]')].map(e=>{
      const tag=e.tagName;const client=rect(e.getBoundingClientRect());
      if(tag==='circle'){const at=project(e,e.cx.baseVal.value,e.cy.baseVal.value);const radius=e.r.baseVal.value*Math.hypot(e.getScreenCTM().a,e.getScreenCTM().b);return{id:e.id,kind:radius<=4?'point':'circle',at,radius,client};}
      if(tag==='rect')return{id:e.id,kind:'conditionBox',client};
      let points=[];
      if(tag==='line')points=[project(e,e.x1.baseVal.value,e.y1.baseVal.value),project(e,e.x2.baseVal.value,e.y2.baseVal.value)];
      else if(tag==='polyline'||tag==='polygon'){for(let i=0;i<e.points.numberOfItems;i++){const p=e.points.getItem(i);points.push(project(e,p.x,p.y));}}
      else{const length=e.getTotalLength(),count=Math.min(4096,Math.max(2,Math.ceil(length)));for(let i=0;i<=count;i++){const p=e.getPointAtLength(length*i/count);points.push(project(e,p.x,p.y));}}
      return{id:e.id,kind:e.getAttribute('data-role')||'line',points,client};
    });
    return{runtime:'playwright-chromium',synthetic:false,svg:rect(r),viewBox:{x:v.x,y:v.y,width:v.width,height:v.height},safeMargin:32,labels,geometry,fontStatus:document.fonts.status};
  });
}
const right=b=>b.x+b.width,bottom=b=>b.y+b.height;
const overlap=(a,b)=>a.x<right(b)-.1&&b.x<right(a)-.1&&a.y<bottom(b)-.1&&b.y<bottom(a)-.1;
const contains=(a,b)=>a.x-.1<=b.x&&right(b)<=right(a)+.1&&a.y-.1<=b.y&&bottom(b)<=bottom(a)+.1;
function segmentBox(p,q,b) {
  const dx=q[0]-p[0],dy=q[1]-p[1];let lo=0,hi=1;
  for(const [a,c] of [[-dx,p[0]-b.x],[dx,right(b)-p[0]],[-dy,p[1]-b.y],[dy,bottom(b)-p[1]]]){if(a===0){if(c<0)return false;}else{const t=c/a;if(a<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return false;}}
  return true;
}
export function analyzeRenderedLayout(capture) {
  if(capture.synthetic!==false||capture.runtime!=='playwright-chromium')throw Error('ACTUAL_BROWSER_CAPTURE_REQUIRED');
  const errors=[];let labelCollisionCount=0,criticalCollisionCount=0,clippedTextCount=0,overflowCount=0;
  const scale=capture.svg.width/capture.viewBox.width;const pad=capture.safeMargin*scale;
  const safe={x:capture.svg.x+pad,y:capture.svg.y+pad,width:capture.svg.width-2*pad,height:capture.svg.height-2*pad};
  for(let i=0;i<capture.labels.length;i++) {
    const label=capture.labels[i],box=label.client;
    if(!contains(safe,box)){clippedTextCount++;errors.push('TEXT_CLIPPED:'+label.id);}
    for(const other of capture.labels.slice(i+1))if(overlap(box,other.client)){labelCollisionCount++;if(Math.min(label.priority,other.priority)<=2)criticalCollisionCount++;errors.push('LABEL_OVERLAP:'+label.id+':'+other.id);}
    for(const g of capture.geometry) {
      let hit=false;
      if(g.kind==='conditionBox'){
        if(g.id===label.id+'-box'){if(!contains(g.client,box)){overflowCount++;errors.push('CONDITION_BOX_OVERFLOW:'+label.id);}continue;}
        hit=overlap(box,g.client);
      } else if(g.kind==='point'||g.kind==='circle'){
        const [x,y]=g.at;const near=Math.hypot(Math.max(box.x-x,0,x-right(box)),Math.max(box.y-y,0,y-bottom(box)));
        const far=Math.max(...[box.x,right(box)].flatMap(a=>[box.y,bottom(box)].map(b=>Math.hypot(a-x,b-y))));
        hit=near<=g.radius&&(g.kind==='point'||far>=g.radius);
      } else hit=g.points?.some((p,j)=>j>0&&segmentBox(g.points[j-1],p,box));
      if(hit){labelCollisionCount++;if(label.priority<=2)criticalCollisionCount++;errors.push('LABEL_GEOMETRY_COLLISION:'+label.id+':'+g.id);}
    }
  }
  const missingGlyphCount=capture.labels.reduce((s,v)=>s+v.missingGlyphCount,0);
  for(const g of capture.geometry){if(!contains(capture.svg,g.client)){overflowCount++;errors.push('GEOMETRY_VIEWPORT_CLIPPING:'+g.id);}}
  if(missingGlyphCount)errors.push('MISSING_GLYPH');
  return{status:errors.length?'FAIL':'PASS',HARD_RENDERED_COLLISION:criticalCollisionCount,CLIPPING:clippedTextCount,
    labelCollisionCount,criticalCollisionCount,clippedTextCount,overflowCount,missingGlyphCount,errors,
    measurements:Object.fromEntries(capture.labels.map(v=>[v.id,[v.bbox.width+2,v.bbox.height+2]]))};
}
export async function verifyRenderedFile(file,{width=1440,height=1000,screenshot}={}) {
  const browser=await launchBrowser();
  try{const page=await browser.newPage({viewport:{width,height}});await page.setContent(fs.readFileSync(file,'utf8'));const capture=await collectRenderedLayout(page);const result=analyzeRenderedLayout(capture);if(screenshot){assertOutput(screenshot);fs.mkdirSync(path.dirname(screenshot),{recursive:true});await page.locator('svg').screenshot({path:screenshot});}return{...result,capture,browserVersion:browser.version(),svgSha256:sha256(fs.readFileSync(file))};}finally{await browser.close();}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=k=>process.argv[process.argv.indexOf(k)+1];const file=path.resolve(arg('--svg')),out=assertOutput(arg('--out'));const result=await verifyRenderedFile(file,{width:process.argv.includes('--mobile')?390:1440,screenshot:out.replace(/\.json$/,'.png')});fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,errors:result.errors}));if(result.status!=='PASS')process.exitCode=1;
}
