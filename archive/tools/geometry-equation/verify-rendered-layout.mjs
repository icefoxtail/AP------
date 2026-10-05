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
      return{id:e.id,kind:e.getAttribute('data-label-kind')||'LEGACY_TEXT',priority:Number(e.getAttribute('data-priority')||2),value,bbox:rect(bbox),client:rect(client),missingGlyphCount:missing,font:getComputedStyle(e).fontFamily,baseFontPx:parseFloat(getComputedStyle(e).fontSize),effectiveFontPx:parseFloat(getComputedStyle(e).fontSize)*Math.hypot(e.getScreenCTM().a,e.getScreenCTM().b),owner:e.getAttribute('data-owner'),annotation:e.getAttribute('data-annotation')};
    });
    const geometry=[...svg.querySelectorAll('circle,line,polyline,polygon,path,rect[data-role="conditionBox"]')].map(e=>{
      const tag=e.tagName;const client=rect(e.getBoundingClientRect());
      const style=getComputedStyle(e),matrix=e.getScreenCTM();
      const strokeWidthPx=style.stroke==='none'?0:parseFloat(style.strokeWidth)*(style.vectorEffect==='non-scaling-stroke'?1:Math.max(Math.hypot(matrix.a,matrix.b),Math.hypot(matrix.c,matrix.d)));
      if(tag==='circle'){const at=project(e,e.cx.baseVal.value,e.cy.baseVal.value);const radius=e.r.baseVal.value*Math.hypot(e.getScreenCTM().a,e.getScreenCTM().b);return{id:e.id,kind:e.getAttribute('data-role')==='point'?'point':'circle',at,radius,client,strokeWidthPx};}
      if(tag==='rect')return{id:e.id,kind:'conditionBox',client,strokeWidthPx};
      let points=[];
      if(tag==='line')points=[project(e,e.x1.baseVal.value,e.y1.baseVal.value),project(e,e.x2.baseVal.value,e.y2.baseVal.value)];
      else if(tag==='polyline'||tag==='polygon'){for(let i=0;i<e.points.numberOfItems;i++){const p=e.points.getItem(i);points.push(project(e,p.x,p.y));}if(tag==='polygon'&&points.length)points.push(points[0]);}
      else{const length=e.getTotalLength(),count=Math.min(4096,Math.max(2,Math.ceil(length)));for(let i=0;i<=count;i++){const p=e.getPointAtLength(length*i/count);points.push(project(e,p.x,p.y));}}
      return{id:e.id,kind:e.getAttribute('data-role')||'line',points,client,strokeWidthPx,owner:e.getAttribute('data-owner'),ownerKind:e.getAttribute('data-owner-kind'),ownerPoints:(e.getAttribute('data-owner-points')||'').split(' ').filter(Boolean)};
    });
    return{runtime:'playwright-chromium',synthetic:false,svg:rect(r),viewBox:{x:v.x,y:v.y,width:v.width,height:v.height},safeMargin:32,publicationProfile:svg.getAttribute('data-publication-profile'),labels,geometry,fontStatus:document.fonts.status};
  });
}
const right=b=>b.x+b.width,bottom=b=>b.y+b.height;
const expand=(b,p)=>({x:b.x-p,y:b.y-p,width:b.width+2*p,height:b.height+2*p});
const overlap=(a,b)=>a.x<right(b)-.1&&b.x<right(a)-.1&&a.y<bottom(b)-.1&&b.y<bottom(a)-.1;
const contains=(a,b)=>a.x-.1<=b.x&&right(b)<=right(a)+.1&&a.y-.1<=b.y&&bottom(b)<=bottom(a)+.1;
function segmentBox(p,q,b) {
  const dx=q[0]-p[0],dy=q[1]-p[1];let lo=0,hi=1;
  for(const [a,c] of [[-dx,p[0]-b.x],[dx,right(b)-p[0]],[-dy,p[1]-b.y],[dy,bottom(b)-p[1]]]){if(a===0){if(c<0)return false;}else{const t=c/a;if(a<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return false;}}
  return true;
}
function properCross(a,b,c,d) {
  const u=[b[0]-a[0],b[1]-a[1]],v=[d[0]-c[0],d[1]-c[1]],w=[c[0]-a[0],c[1]-a[1]];
  const cross=(p,q)=>p[0]*q[1]-p[1]*q[0];const determinant=cross(u,v);if(Math.abs(determinant)<1e-9)return false;
  const t=cross(w,v)/determinant,s=cross(w,u)/determinant;
  return t>1e-6&&t<1-1e-6&&s>1e-6&&s<1-1e-6;
}
function isOwnRegionExit(leader,other,geometry) {
  if(leader.ownerKind!=='REGION'||leader.points?.length!==2)return false;
  const region=geometry.find(v=>v.kind==='region'&&v.id===leader.owner);
  if(!region?.points?.length)return false;
  if(other.id===region.id)return true;
  if(other.points?.length!==2)return false;
  const near=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1])<.01;
  return region.points.some((p,i)=>i>0&&((near(region.points[i-1],other.points[0])&&near(p,other.points[1]))||(near(region.points[i-1],other.points[1])&&near(p,other.points[0]))));
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
      const strokePad=(g.strokeWidthPx??0)/2;
      if(!Number.isFinite(strokePad)||strokePad<0){errors.push('INVALID_STROKE_MEASUREMENT:'+g.id);continue;}
      if(g.kind==='conditionBox'){
        if(g.id===label.id+'-box'){if(!contains(g.client,box)){overflowCount++;errors.push('CONDITION_BOX_OVERFLOW:'+label.id);}continue;}
        hit=overlap(box,expand(g.client,strokePad));
      } else if(g.kind==='point'||g.kind==='circle'){
        const [x,y]=g.at;const near=Math.hypot(Math.max(box.x-x,0,x-right(box)),Math.max(box.y-y,0,y-bottom(box)));
        const far=Math.max(...[box.x,right(box)].flatMap(a=>[box.y,bottom(box)].map(b=>Math.hypot(a-x,b-y))));
        hit=near<=g.radius+strokePad&&(g.kind==='point'||far>=Math.max(0,g.radius-strokePad));
      } else hit=g.points?.some((p,j)=>j>0&&segmentBox(g.points[j-1],p,expand(box,strokePad)));
      if(hit){labelCollisionCount++;if(label.priority<=2)criticalCollisionCount++;errors.push('LABEL_GEOMETRY_COLLISION:'+label.id+':'+g.id);}
    }
  }
  const publication=capture.publicationProfile==='geometry-publication-v1';
  if(publication) {
    const kinds=new Set(['POINT_NAME','ANGLE_LABEL','LENGTH_LABEL','AREA_LABEL','COORDINATE_LABEL','EQUATION_LABEL']);
    const labels=capture.labels.filter(v=>kinds.has(v.kind));
    if(!labels.length||capture.fontStatus!=='loaded')errors.push('PUBLICATION_TEXT_NOT_READY');
    for(const label of capture.labels) {
      if(!Number.isFinite(label.effectiveFontPx)||label.effectiveFontPx<11-1e-7)errors.push('PUBLICATION_FONT_BELOW_11_CSS_PX:'+label.id);
      if(![label.client.x,label.client.y,label.client.width,label.client.height].every(Number.isFinite)||label.client.width<=0||label.client.height<=0)errors.push('PUBLICATION_TEXT_BOUNDS_INVALID:'+label.id);
    }
    if(labels.some(v=>!Number.isFinite(v.baseFontPx)||Math.abs(v.baseFontPx-labels[0].baseFontPx)>1e-7))errors.push('PUBLICATION_BASE_FONT_INCONSISTENT');
  }
  const missingGlyphCount=capture.labels.reduce((s,v)=>s+v.missingGlyphCount,0);
  for(const leader of capture.geometry.filter(v=>v.kind==='leader'))for(const other of capture.geometry.filter(v=>v.id!==leader.id&&v.points)) {
    if(publication&&isOwnRegionExit(leader,other,capture.geometry))continue;
    if(leader.points.some((p,i)=>i>0&&other.points.some((q,j)=>j>0&&properCross(leader.points[i-1],p,other.points[j-1],q)))){criticalCollisionCount++;errors.push('LEADER_CROSSING:'+leader.id+':'+other.id);}
  }
  for(const g of capture.geometry){if(!contains(capture.svg,expand(g.client,(g.strokeWidthPx??0)/2))){overflowCount++;errors.push('GEOMETRY_VIEWPORT_CLIPPING:'+g.id);}}
  if(missingGlyphCount)errors.push('MISSING_GLYPH');
  return{status:errors.length?'FAIL':'PASS',HARD_RENDERED_COLLISION:criticalCollisionCount,CLIPPING:clippedTextCount,
    labelCollisionCount,criticalCollisionCount,clippedTextCount,overflowCount,missingGlyphCount,errors,
    labelMeasurements:capture.labels.map(v=>({id:v.id,kind:v.kind,owner:v.owner,annotation:v.annotation,finalViewportCssFontPx:v.effectiveFontPx,baseFontPx:v.baseFontPx,font:v.font,client:v.client,bbox:v.bbox})),
    measurements:Object.fromEntries(capture.labels.map(v=>[v.id,[v.bbox.width+2,v.bbox.height+2]]))};
}
export async function captureAtDisplaySize(page,svg,display) {
  if(!display||![display.width,display.height].every(v=>Number.isFinite(v)&&v>0))throw Error('DISPLAY_SIZE_REQUIRED');
  await page.setContent(svg);
  await page.evaluate(({width,height})=>{
    document.body.style.margin='0';
    const root=document.querySelector('svg');
    root.style.width=width+'px';root.style.height=height+'px';root.style.maxWidth='none';root.style.display='block';
  },display);
  return collectRenderedLayout(page);
}
export async function verifyRenderedFile(file,{width=1440,height=1000,screenshot,display}={}) {
  const browser=await launchBrowser();
  try{const page=await browser.newPage({viewport:{width,height}});const svg=fs.readFileSync(file,'utf8');let capture;if(display)capture=await captureAtDisplaySize(page,svg,display);else{await page.setContent(svg);capture=await collectRenderedLayout(page);}const result=analyzeRenderedLayout(capture);if(screenshot){assertOutput(screenshot);fs.mkdirSync(path.dirname(screenshot),{recursive:true});await page.locator('svg').screenshot({path:screenshot});}return{...result,capture,browserVersion:browser.version(),svgSha256:sha256(fs.readFileSync(file))};}finally{await browser.close();}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=k=>process.argv[process.argv.indexOf(k)+1];const file=path.resolve(arg('--svg')),out=assertOutput(arg('--out'));const result=await verifyRenderedFile(file,{width:process.argv.includes('--mobile')?390:1440,screenshot:out.replace(/\.json$/,'.png')});fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,errors:result.errors}));if(result.status!=='PASS')process.exitCode=1;
}
