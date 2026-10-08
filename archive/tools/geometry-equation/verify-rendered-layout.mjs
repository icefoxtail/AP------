import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchBrowser,assertOutput} from './visual-browser-runtime.mjs';
import {sha256} from './verify-visual-engine-static.mjs';

const Q10_LEGACY_LINE_MASK_SVG_SHA256='8e2d318dcdd5e791c153cd638b57862b349061115c90a189ae3541637e6f9ca7';

export async function collectRenderedLayout(page,publicationViewport=page.viewportSize()) {
  await page.evaluate(()=>document.fonts.ready);
  return page.evaluate(publicationViewport=>{
    const svg=document.querySelector('svg');if(!svg||document.querySelector('parsererror'))throw Error('SVG_RENDER_PARSE_FAIL');
    const paintOrder=new Map([...svg.querySelectorAll('*')].map((element,index)=>[element,index]));
    const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;
    const rect=b=>({x:b.x,y:b.y,width:b.width,height:b.height});
    const safeBox=e=>{try{return rect(e.getBBox());}catch{return{x:0,y:0,width:0,height:0};}};
    const strictNumber=value=>{if(typeof value!=='string'||value.trim()==='')return null;const parsed=Number(value.trim());return Number.isFinite(parsed)?parsed:null;};
    const project=(e,x,y)=>{const matrix=e.getScreenCTM();if(!matrix)return[NaN,NaN];const p=new DOMPoint(x,y).matrixTransform(matrix);return[p.x,p.y];};
    const parseUrlReference=value=>{const match=String(value??'').match(/url\(\s*["']?#([^\)"']+)["']?\s*\)/i);return match?.[1]??null;};
    const parseColor=value=>{
      const color=String(value??'').trim().toLowerCase();
      if(color==='none'||color==='transparent')return{r:0,g:0,b:0,a:0};
      if(/^#[\da-f]{6}$/.test(color))return{r:parseInt(color.slice(1,3),16),g:parseInt(color.slice(3,5),16),b:parseInt(color.slice(5,7),16),a:1};
      if(/^#[\da-f]{8}$/.test(color))return{r:parseInt(color.slice(1,3),16),g:parseInt(color.slice(3,5),16),b:parseInt(color.slice(5,7),16),a:parseInt(color.slice(7,9),16)/255};
      const rgb=color.match(/^rgba?\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
      if(rgb){const channel=value=>{const parsed=Number.parseFloat(value);return value.endsWith('%')?parsed*2.55:parsed;};const alpha=rgb[4]===undefined?1:(rgb[4].endsWith('%')?Number.parseFloat(rgb[4])/100:Number.parseFloat(rgb[4]));return{r:channel(rgb[1]),g:channel(rgb[2]),b:channel(rgb[3]),a:Number.isFinite(alpha)?alpha:0};}
      return null;
    };
    const effectCache=new Map();
    const shapeNodes=reference=>[...reference.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon')];
    const boxHasArea=box=>box&&[box.x,box.y,box.width,box.height].every(Number.isFinite)&&box.width>0&&box.height>0;
    const inspectEffect=(property,value)=>{
      const raw=String(value??'').trim();
      if(!raw||raw==='none')return{status:'CLEAR',value:'none',referenceId:null,reason:null};
      const cacheKey=property+'\0'+raw;if(effectCache.has(cacheKey))return effectCache.get(cacheKey);
      const referenceId=parseUrlReference(raw),reference=referenceId?document.getElementById(referenceId):null;
      let result;
      if(!referenceId)result={status:'UNSUPPORTED',value:raw,referenceId:null,reason:'NON_URL_EFFECT'};
      else if(!reference)result={status:'UNSUPPORTED',value:raw,referenceId,reason:'REFERENCE_MISSING'};
      else {
        const nodes=shapeNodes(reference),boxes=nodes.map(safeBox);
        if(!nodes.length)result={status:'HIDDEN',value:raw,referenceId,reason:'EMPTY_REFERENCE'};
        else if(property==='clip-path')result=boxes.every(box=>!boxHasArea(box))?{status:'HIDDEN',value:raw,referenceId,reason:'ZERO_AREA_CLIP'}:{status:'UNSUPPORTED',value:raw,referenceId,reason:'CLIP_GEOMETRY_NOT_PROVEN'};
        else {
          const maskType=(getComputedStyle(reference).maskType||reference.getAttribute('mask-type')||'luminance').toLowerCase();
          const painted=nodes.map(node=>{const style=getComputedStyle(node),fill=parseColor(style.fill),stroke=parseColor(style.stroke),box=safeBox(node),opacity=Number.parseFloat(style.opacity),fillOpacity=Number.parseFloat(style.fillOpacity),strokeOpacity=Number.parseFloat(style.strokeOpacity),factor=Number.isFinite(opacity)?opacity:0;const fillLuminance=fill?((fill.r*.2126+fill.g*.7152+fill.b*.0722)/255)*fill.a*(Number.isFinite(fillOpacity)?fillOpacity:0)*factor:0;const strokeLuminance=stroke?((stroke.r*.2126+stroke.g*.7152+stroke.b*.0722)/255)*stroke.a*(Number.isFinite(strokeOpacity)?strokeOpacity:0)*factor:0;return{box,fillLuminance,strokeLuminance,hasArea:boxHasArea(box)};});
          const hidden=painted.every(item=>!item.hasArea||item.fillLuminance<=1e-9&&item.strokeLuminance<=1e-9);
          result=maskType==='luminance'&&hidden?{status:'HIDDEN',value:raw,referenceId,reason:'ZERO_LUMINANCE_MASK'}:{status:'UNSUPPORTED',value:raw,referenceId,reason:'MASK_EFFECT_NOT_PROVEN'};
        }
      }
      effectCache.set(cacheKey,result);return result;
    };
    const effectValue=(element,styleProperty,attribute,alternateStyleProperty=null)=>{const style=getComputedStyle(element),computed=style[styleProperty],alternate=alternateStyleProperty?style[alternateStyleProperty]:null;if(computed&&computed!=='none')return computed;if(alternate&&alternate!=='none')return alternate;const raw=element.getAttribute(attribute);return raw||'none';};
    const ancestorChain=element=>{
      const chain=[];let current=element;
      while(current&&current.nodeType===1){
        const style=getComputedStyle(current),opacity=Number.parseFloat(style.opacity),clipPath=effectValue(current,'clipPath','clip-path'),mask=effectValue(current,'mask','mask','maskImage');
        chain.push({tag:current.localName,id:current.id||null,display:style.display,visibility:style.visibility,opacity:Number.isFinite(opacity)?opacity:null,clipPath,mask,clipPathState:inspectEffect('clip-path',clipPath),maskState:inspectEffect('mask',mask)});
        current=current.parentElement;
      }
      return chain;
    };
    const paintStyle=element=>{
      const style=getComputedStyle(element);
      return{fill:style.fill,fillOpacity:Number.parseFloat(style.fillOpacity),stroke:style.stroke,strokeOpacity:Number.parseFloat(style.strokeOpacity),strokeWidth:Number.parseFloat(style.strokeWidth)};
    };
    const measuredContent=(element,kind,text=null)=>({tag:element.localName,id:element.id||null,kind,text,glyph:element.getAttribute?.('data-c')??null,bbox:safeBox(element),client:rect(element.getBoundingClientRect()),ancestors:ancestorChain(element),...paintStyle(element)});
    const renderedVisibility=(element,kind)=>{
      let content=[];
      if(kind==='TEXT'){
        const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node;
        while((node=walker.nextNode())){const text=node.nodeValue||'';if(/\S/u.test(text)&&node.parentElement)content.push(measuredContent(node.parentElement,'TEXT_RUN',text));}
      }else{
        content=[...element.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon')].map(node=>measuredContent(node,'OUTLINE'));
      }
      return{kind,elementAncestors:ancestorChain(element),content};
    };
    const labels=[...svg.querySelectorAll('text')].map(e=>{
      const bbox=safeBox(e),client=rect(e.getBoundingClientRect());
      const value=e.textContent||'';let missing=Number(value.includes('�')||value.includes('□'));
      try{for(let i=0;i<e.getNumberOfChars();i++){const c=value[i];if(c&&!/\s/.test(c)){const b=e.getExtentOfChar(i);if(!b.width||!b.height)missing++;}}}catch{missing++;}
      const style=getComputedStyle(e),matrix=e.getScreenCTM(),fontPx=Number.parseFloat(style.fontSize);
      const tickSource=e.hasAttribute('data-tick-source-x')?[strictNumber(e.getAttribute('data-tick-source-x')),strictNumber(e.getAttribute('data-tick-source-y'))]:null;
      return{id:e.id,kind:e.getAttribute('data-label-kind')||'LEGACY_TEXT',visualRole:e.getAttribute('data-visual-role'),priority:Number(e.getAttribute('data-priority')||2),value,bbox,client,paintOrder:paintOrder.get(e)??null,missingGlyphCount:missing,font:style.fontFamily,baseFontPx:fontPx,effectiveFontPx:matrix&&Number.isFinite(fontPx)?fontPx*Math.hypot(matrix.a,matrix.b):NaN,owner:e.getAttribute('data-owner'),annotation:e.getAttribute('data-annotation'),tickOwner:e.getAttribute('data-tick-owner'),tickAxis:e.getAttribute('data-tick-axis'),tickValue:e.getAttribute('data-tick-value'),tickDisplayValue:e.getAttribute('data-tick-display-value'),tickCalloutSchema:e.getAttribute('data-tick-callout'),tickSource,tickSourceClient:tickSource?project(svg,...tickSource):null,renderedVisibility:renderedVisibility(e,'TEXT')};
    });
    for(const e of svg.querySelectorAll('g[data-fragment-sha]')){
      const bbox=safeBox(e),client=rect(e.getBoundingClientRect()),matrix=e.getScreenCTM(),font=Number(e.getAttribute('data-font-px'));
      // The wrapper CTM misses nested SVG viewBox fitting. MathJax outlines
      // use 1000 units/em; read the CTM at that font-unit boundary instead.
      const fontRoots=[...e.querySelectorAll('[data-outline-units-per-em]')];
      if(!fontRoots.length)fontRoots.push(...e.querySelectorAll('[data-mml-node="math"]'));
      const fontScales=fontRoots.map(node=>{
        const m=node.getScreenCTM(),units=Number(node.getAttribute('data-outline-units-per-em')||1000);
        if(!m||!Number.isFinite(units)||units<=0)return NaN;
        // Smallest singular value also catches horizontal squeezing/shearing.
        const sum=m.a*m.a+m.b*m.b+m.c*m.c+m.d*m.d,det=m.a*m.d-m.b*m.c;
        return units*Math.sqrt(Math.max(0,(sum-Math.sqrt(Math.max(0,sum*sum-4*det*det)))/2));
      });
      const effectiveFontPx=fontScales.length?Math.min(...fontScales):(matrix?font*Math.hypot(matrix.a,matrix.b):NaN);
      const tickSource=e.hasAttribute('data-tick-source-x')?[strictNumber(e.getAttribute('data-tick-source-x')),strictNumber(e.getAttribute('data-tick-source-y'))]:null;
      labels.push({id:e.id,kind:e.getAttribute('data-label-kind'),visualRole:e.getAttribute('data-visual-role'),priority:Number(e.getAttribute('data-priority')||2),value:e.getAttribute('data-fragment-sha'),bbox,client,paintOrder:paintOrder.get(e)??null,missingGlyphCount:Number(!bbox.width||!bbox.height),font:'FROZEN_OUTLINE',baseFontPx:font,effectiveFontPx,owner:e.getAttribute('data-owner'),annotation:null,tickOwner:e.getAttribute('data-tick-owner'),tickAxis:e.getAttribute('data-tick-axis'),tickValue:e.getAttribute('data-tick-value'),tickDisplayValue:e.getAttribute('data-tick-display-value'),tickCalloutSchema:e.getAttribute('data-tick-callout'),tickSource,tickSourceClient:tickSource?project(svg,...tickSource):null,renderedVisibility:renderedVisibility(e,'OUTLINE')});
    }
    const geometry=[...svg.querySelectorAll('circle,line,polyline,polygon,path,rect[data-role="conditionBox"],rect[data-role="tick-label-knockout"]')].filter(e=>!e.closest('g[data-fragment-sha]')).map(e=>{
      const tag=e.tagName;const client=rect(e.getBoundingClientRect());
      const style=getComputedStyle(e),matrix=e.getScreenCTM();
      const strokeWidthPx=style.stroke==='none'?0:parseFloat(style.strokeWidth)*(style.vectorEffect==='non-scaling-stroke'?1:Math.max(Math.hypot(matrix.a,matrix.b),Math.hypot(matrix.c,matrix.d)));
      if(tag==='circle'){const at=project(e,e.cx.baseVal.value,e.cy.baseVal.value);const radius=e.r.baseVal.value*Math.hypot(e.getScreenCTM().a,e.getScreenCTM().b);return{id:e.id,kind:e.getAttribute('data-role')==='point'?'point':'circle',at,radius,client,strokeWidthPx,visibilityEvidence:{kind:'GEOMETRY',elementAncestors:ancestorChain(e),content:[measuredContent(e,'GEOMETRY')]}};}
      if(tag==='rect'){
        const role=e.getAttribute('data-role');
        if(role==='tick-label-knockout')return{id:e.id,kind:'tickLabelKnockout',role,ownerLabelId:e.getAttribute('data-owner-label'),occludedPrimitiveIds:(e.getAttribute('data-occluded-primitives')||'').split(/\s+/).filter(Boolean),client,fill:style.fill,fillOpacity:Number.parseFloat(style.fillOpacity),opacity:Number.parseFloat(style.opacity),paintOrder:paintOrder.get(e)??null,strokeWidthPx,visibilityEvidence:{kind:'GEOMETRY',elementAncestors:ancestorChain(e),content:[measuredContent(e,'GEOMETRY')]}};
        return{id:e.id,kind:'conditionBox',role,client,paintOrder:paintOrder.get(e)??null,strokeWidthPx,visibilityEvidence:{kind:'GEOMETRY',elementAncestors:ancestorChain(e),content:[measuredContent(e,'GEOMETRY')]}};
      }
      let points=[];
      if(tag==='line')points=[project(e,e.x1.baseVal.value,e.y1.baseVal.value),project(e,e.x2.baseVal.value,e.y2.baseVal.value)];
      else if(tag==='polyline'||tag==='polygon'){for(let i=0;i<e.points.numberOfItems;i++){const p=e.points.getItem(i);points.push(project(e,p.x,p.y));}if(tag==='polygon'&&points.length)points.push(points[0]);}
      else{const length=e.getTotalLength(),count=Math.min(4096,Math.max(2,Math.ceil(length)));for(let i=0;i<=count;i++){const p=e.getPointAtLength(length*i/count);points.push(project(e,p.x,p.y));}}
      return{id:e.id,kind:e.getAttribute('data-role')||'line',role:e.getAttribute('data-role'),points,client,paintOrder:paintOrder.get(e)??null,strokeWidthPx,strokeColor:style.stroke,markerStart:e.getAttribute('marker-start')||'',markerEnd:e.getAttribute('marker-end')||'',axis:e.getAttribute('data-axis'),value:e.getAttribute('data-value'),requiredLabelId:e.getAttribute('data-required-label-id'),owner:e.getAttribute('data-owner'),ownerKind:e.getAttribute('data-owner-kind'),ownerPoints:(e.getAttribute('data-owner-points')||'').split(' ').filter(Boolean),ownerLabelId:e.getAttribute('data-owner-label'),tickOwner:e.getAttribute('data-tick-owner'),tickAxis:e.getAttribute('data-tick-axis'),tickValue:e.getAttribute('data-tick-value'),visibilityEvidence:{kind:'GEOMETRY',elementAncestors:ancestorChain(e),content:[measuredContent(e,'GEOMETRY')]}};
    });
    const safeMargin=svg.getAttribute('data-publication-profile')==='fragment-publication-spike-v1'?12:32;
    const rootMatrix=svg.getScreenCTM();
    return{runtime:'playwright-chromium',synthetic:false,svg:rect(r),viewBox:{x:v.x,y:v.y,width:v.width,height:v.height},coordinateScale:Math.hypot(rootMatrix.a,rootMatrix.b),publicationViewport,safeMargin,publicationProfile:svg.getAttribute('data-publication-profile'),labels,geometry,fontStatus:document.fonts.status};
  },publicationViewport);
}
const right=b=>b.x+b.width,bottom=b=>b.y+b.height;
const expand=(b,p)=>({x:b.x-p,y:b.y-p,width:b.width+2*p,height:b.height+2*p});
const overlap=(a,b)=>a.x<right(b)-.1&&b.x<right(a)-.1&&a.y<bottom(b)-.1&&b.y<bottom(a)-.1;
const contains=(a,b)=>a.x-.1<=b.x&&right(b)<=right(a)+.1&&a.y-.1<=b.y&&bottom(b)<=bottom(a)+.1;
function pointOnBoxEdge(point,box,tolerance){
  const inX=point[0]>=box.x-tolerance&&point[0]<=right(box)+tolerance,inY=point[1]>=box.y-tolerance&&point[1]<=bottom(box)+tolerance;
  return inX&&(Math.abs(point[1]-box.y)<=tolerance||Math.abs(point[1]-bottom(box))<=tolerance)
    ||inY&&(Math.abs(point[0]-box.x)<=tolerance||Math.abs(point[0]-right(box))<=tolerance);
}
function strictFiniteNumber(value){
  if(typeof value==='number')return Number.isFinite(value)?value:null;
  if(typeof value!=='string'||value.trim()==='')return null;
  const parsed=Number(value.trim());return Number.isFinite(parsed)?parsed:null;
}
function computedColorAlpha(value){
  const color=String(value??'').trim().toLowerCase();
  if(color==='none'||color==='transparent')return 0;
  if(/^#[\da-f]{4}$/.test(color))return parseInt(color[4],16)/15;
  if(/^#[\da-f]{8}$/.test(color))return parseInt(color.slice(7,9),16)/255;
  const fraction=raw=>{const parsed=Number.parseFloat(raw);return Number.isFinite(parsed)?(String(raw).trim().endsWith('%')?parsed/100:parsed):0;};
  const slash=color.match(/\/\s*([\d.]+%?)\s*\)$/);if(slash)return fraction(slash[1]);
  const rgba=color.match(/^rgba\([^)]*,\s*([\d.]+%?)\s*\)$/);return rgba?fraction(rgba[1]):1;
}
function visibleComputedChain(chain){
  return Array.isArray(chain)&&chain.length>0&&chain.every(node=>node&&node.display!=='none'&&node.visibility==='visible'&&Number.isFinite(node.opacity)&&node.opacity>0);
}
function visibilityEffectStatus(evidence){
  const chains=[evidence?.elementAncestors,...(evidence?.content||[]).map(item=>item?.ancestors)].filter(Array.isArray);
  if(!chains.length||chains.some(chain=>chain.some(node=>!node||!('clipPathState' in node)||!('maskState' in node))))return'UNSUPPORTED';
  const states=chains.flatMap(chain=>chain.flatMap(node=>[node.clipPathState?.status,node.maskState?.status]));
  if(states.includes('HIDDEN'))return'HIDDEN';
  if(states.includes('UNSUPPORTED'))return'UNSUPPORTED';
  return'CLEAR';
}
function visiblePaintedContent(item){
  if(!item||!visibleComputedChain(item.ancestors)||!item.bbox||![item.bbox.x,item.bbox.y,item.bbox.width,item.bbox.height].every(Number.isFinite)||item.bbox.width<=0||item.bbox.height<=0)return false;
  const fill=String(item.fill??'').trim().toLowerCase(),stroke=String(item.stroke??'').trim().toLowerCase();
  const fillVisible=fill!=='none'&&computedColorAlpha(fill)>0&&Number.isFinite(item.fillOpacity)&&item.fillOpacity>0;
  const strokeVisible=stroke!=='none'&&computedColorAlpha(stroke)>0&&Number.isFinite(item.strokeOpacity)&&item.strokeOpacity>0&&Number.isFinite(item.strokeWidth)&&item.strokeWidth>0;
  return item.tag==='line'?strokeVisible:fillVisible||strokeVisible;
}
function visiblePaintedGeometry(item){
  if(!item||!visibleComputedChain(item.ancestors))return false;
  const bounds=item.client??item.bbox;
  if(!bounds||![bounds.x,bounds.y,bounds.width,bounds.height].every(Number.isFinite)||(bounds.width<=0&&bounds.height<=0))return false;
  const fill=String(item.fill??'').trim().toLowerCase(),stroke=String(item.stroke??'').trim().toLowerCase();
  const fillVisible=fill!=='none'&&computedColorAlpha(fill)>0&&Number.isFinite(item.fillOpacity)&&item.fillOpacity>0;
  const strokeVisible=stroke!=='none'&&computedColorAlpha(stroke)>0&&Number.isFinite(item.strokeOpacity)&&item.strokeOpacity>0&&Number.isFinite(item.strokeWidth)&&item.strokeWidth>0;
  return item.tag==='line'?strokeVisible:fillVisible||strokeVisible;
}
function visibleTickLabel(label){
  const evidence=label?.renderedVisibility;
  const expectedKind=label?.font==='FROZEN_OUTLINE'?'OUTLINE':'TEXT';
  if(evidence?.kind!==expectedKind||!visibleComputedChain(evidence.elementAncestors)||!Array.isArray(evidence.content)||evidence.content.length===0)return{ok:false,code:'TICK_LABEL_NOT_VISIBLE',effectStatus:visibilityEffectStatus(evidence)};
  const effectStatus=visibilityEffectStatus(evidence);
  if(effectStatus==='HIDDEN')return{ok:false,code:'TICK_LABEL_NOT_VISIBLE',effectStatus};
  if(effectStatus==='UNSUPPORTED')return{ok:false,code:'TICK_LABEL_VISIBILITY_UNSUPPORTED',effectStatus};
  if(!evidence.content.every(visiblePaintedContent))return{ok:false,code:'TICK_LABEL_NOT_VISIBLE',effectStatus};
  return{ok:true,code:null,effectStatus};
}
function visibleGeometry(item){
  const evidence=item?.visibilityEvidence;
  if(evidence?.kind!=='GEOMETRY'||!Array.isArray(evidence.content)||evidence.content.length!==1)return{ok:false,code:'VISIBILITY_UNSUPPORTED',effectStatus:'UNSUPPORTED'};
  const effectStatus=visibilityEffectStatus(evidence);
  if(effectStatus==='HIDDEN')return{ok:false,code:'NOT_VISIBLE',effectStatus};
  if(effectStatus==='UNSUPPORTED')return{ok:false,code:'VISIBILITY_UNSUPPORTED',effectStatus};
  if(!visiblePaintedGeometry(evidence.content[0]))return{ok:false,code:'NOT_VISIBLE',effectStatus};
  return{ok:true,code:null,effectStatus};
}
function segmentIntersection(a,b) {
  if(a?.length!==2||b?.length!==2)return null;
  const cross=(u,v)=>u[0]*v[1]-u[1]*v[0],u=[a[1][0]-a[0][0],a[1][1]-a[0][1]],v=[b[1][0]-b[0][0],b[1][1]-b[0][1]],w=[b[0][0]-a[0][0],b[0][1]-a[0][1]],den=cross(u,v);
  if(Math.abs(den)<1e-9)return null;
  const t=cross(w,v)/den,s=cross(w,u)/den;
  if(t<-.001||t>1.001||s<-.001||s>1.001)return null;
  return[a[0][0]+t*u[0],a[0][1]+t*u[1]];
}
function pointSegmentDistance(point,a,b) {
  const dx=b[0]-a[0],dy=b[1]-a[1],length2=dx*dx+dy*dy;
  if(length2<=1e-18)return Math.hypot(point[0]-a[0],point[1]-a[1]);
  const t=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/length2));
  return Math.hypot(point[0]-(a[0]+t*dx),point[1]-(a[1]+t*dy));
}
function segmentDistance(a,b) {
  if(segmentIntersection([a[0],a[1]],[b[0],b[1]]))return 0;
  return Math.min(pointSegmentDistance(a[0],b[0],b[1]),pointSegmentDistance(a[1],b[0],b[1]),pointSegmentDistance(b[0],a[0],a[1]),pointSegmentDistance(b[1],a[0],a[1]));
}
function ownerLeaderClearance(label,leader,geometry,tickIntersection,scale) {
  const clearance=6*scale+.25,allowedOwnerIds=new Set([label.tickOwner,`${label.tickAxis}-axis`]),rows=[],errors=[];
  if(leader?.points?.length!==2)return{status:'FAIL',clearanceCssPx:clearance,checks:[],errors:['LEADER_GEOMETRY_INVALID']};
  for(const other of geometry.filter(value=>value.id!==leader.id&&value.id!==leader.ownerLabelId)){
    let minimum=Infinity,intersections=[];
    if(other.kind==='point'||other.kind==='circle'){
      const center=other.at,rad=other.kind==='point'?other.radius:0;
      minimum=Math.max(0,pointSegmentDistance(center,leader.points[0],leader.points[1])-rad);
    }else if(Array.isArray(other.points)&&other.points.length>=2){
      for(let index=1;index<other.points.length;index++){
        const segment=[other.points[index-1],other.points[index]];
        minimum=Math.min(minimum,segmentDistance(leader.points,segment));
        const intersection=segmentIntersection(leader.points,segment);
        if(intersection)intersections.push(intersection);
      }
    }
    const owner=allowedOwnerIds.has(other.id);
    if(owner){
      if(intersections.some(point=>Math.hypot(point[0]-tickIntersection[0],point[1]-tickIntersection[1])>1*scale+.25))errors.push('LEADER_OWNER_ENDPOINT_CROSSING:'+other.id);
    }else if(minimum<=clearance)errors.push('LEADER_NEAR_GEOMETRY:'+leader.id+':'+other.id);
    rows.push({geometryId:other.id,kind:other.kind,ownerEndpointAllowed:owner,minClearanceCssPx:Number.isFinite(minimum)?minimum:null,requiredClearanceCssPx:owner?null:clearance,intersections});
  }
  return{status:errors.length?'FAIL':'PASS',clearanceCssPx:clearance,checks:rows,errors};
}
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
  const errors=[];let labelCollisionCount=0,criticalCollisionCount=0,observedLabelCollisionCount=0,observedCriticalCollisionCount=0,clippedTextCount=0,overflowCount=0;
  const scale=Number.isFinite(capture.coordinateScale)?capture.coordinateScale:capture.svg.width/capture.viewBox.width;const pad=capture.safeMargin*scale;
  const safe={x:capture.svg.x+pad,y:capture.svg.y+pad,width:capture.svg.width-2*pad,height:capture.svg.height-2*pad};
  const tickLabels=capture.labels.filter(v=>v.kind==='TICK_LABEL'||v.visualRole==='tick-label'),tickEvidence=[];
  const tickKnockouts=capture.geometry.filter(v=>v.kind==='tickLabelKnockout'),geometryById=new Map(capture.geometry.map(value=>[value.id,value])),validLegacyLineMaskIds=new Set(),tickKnockoutEvidence=[];
  for(const knockout of tickKnockouts){
    const owners=capture.labels.filter(value=>value.id===knockout.ownerLabelId&&value.kind==='TICK_LABEL'),owner=owners.length===1?owners[0]:null;
    const targets=(knockout.occludedPrimitiveIds||[]).map(id=>geometryById.get(id)),lineOnly=targets.length===1&&targets[0]?.id==='segmentAB'&&targets[0]?.kind==='line'&&targets[0]?.role==='line';
    const white=String(knockout.fill||'').trim().toLowerCase()==='rgb(255, 255, 255)'||String(knockout.fill||'').trim().toLowerCase()==='#fff';
    const layers=owner&&Number.isFinite(knockout.paintOrder)&&Number.isFinite(owner.paintOrder)&&knockout.paintOrder<owner.paintOrder;
    const targetLayer=lineOnly&&Number.isFinite(targets[0].paintOrder)&&targets[0].paintOrder<knockout.paintOrder;
    const exactOwner=owner?.id==='tick-x--1-label'&&owner.tickOwner==='tick-x--1'&&owner.tickAxis==='x'&&strictFiniteNumber(owner.tickValue)===-2;
    const maskSizeBound=owner&&knockout.client?.width<=owner.client.width+16*scale+.5&&knockout.client?.height<=owner.client.height+16*scale+.5;
    const visibility=visibleGeometry(knockout),containsOwner=!!owner&&!!knockout.client&&!!owner.client&&contains(knockout.client,expand(owner.client,1));
    const checks={exactSvgSha256:capture.svgSha256===Q10_LEGACY_LINE_MASK_SVG_SHA256,ownerUnique:owners.length===1,ownerBinding:exactOwner,onlyExpectedStraightSegment:lineOnly,opaqueWhite:white&&knockout.fillOpacity>=.999&&knockout.opacity>=.999,visible:visibility.ok,backingBeforeOwner:!!layers,segmentBeforeBacking:!!targetLayer,boundsWithinOwnerAllowance:!!maskSizeBound,containsOwnerInk:containsOwner};
    const failedChecks=Object.entries(checks).filter(([,passed])=>!passed).map(([name])=>name);
    tickKnockoutEvidence.push({id:knockout.id,ownerLabelId:knockout.ownerLabelId,occludedPrimitiveIds:knockout.occludedPrimitiveIds||[],svgSha256:capture.svgSha256??null,status:failedChecks.length?'FAIL':'PASS',checks,failedChecks,measured:{backingClient:knockout.client??null,ownerClient:owner?.client??null,scale,fill:knockout.fill??null,fillOpacity:knockout.fillOpacity??null,opacity:knockout.opacity??null,backingPaintOrder:knockout.paintOrder??null,ownerPaintOrder:owner?.paintOrder??null,targetPaintOrders:targets.map(value=>({id:value?.id??null,kind:value?.kind??null,role:value?.role??null,paintOrder:value?.paintOrder??null}))}});
    if(failedChecks.length){
      const targetsCurve=targets.some(value=>value&&['curve','asymptote'].includes(value.kind));
      errors.push(targetsCurve?'TICK_LABEL_CURVE_MASK_FORBIDDEN:'+knockout.id:'TICK_LABEL_KNOCKOUT_EVIDENCE_INVALID:'+knockout.id);continue;
    }
    validLegacyLineMaskIds.add(knockout.id);
  }
  const ownedCounts=new Map(tickLabels.map(v=>[v.tickOwner,(tickLabels.filter(x=>x.tickOwner===v.tickOwner).length)]));
  const normalized=v=>String(v??'').replace(/−/g,'-').trim();
  for(const label of tickLabels) {
    const labelErrors=[],ownerId=label.tickOwner,ownerMatches=capture.geometry.filter(v=>v.id===ownerId&&v.kind==='tick'),owner=ownerMatches.length===1?ownerMatches[0]:null;
    const axisMatches=capture.geometry.filter(v=>v.id===`${label.tickAxis}-axis`&&v.kind==='axis'),axis=axisMatches.length===1?axisMatches[0]:null;
    const labelVisibility=visibleTickLabel(label),ownerVisibility=owner?visibleGeometry(owner):null,axisVisibility=axis?visibleGeometry(axis):null;
    const tickValue=strictFiniteNumber(label.tickValue),primitiveValue=strictFiniteNumber(owner?.value),displayValue=strictFiniteNumber(normalized(label.tickDisplayValue));
    const fail=(code)=>{labelErrors.push(`${code}:${label.id}`);errors.push(`${code}:${label.id}`);};
    if(label.kind!=='TICK_LABEL')fail('TICK_LABEL_KIND_MISMATCH');
    if(!ownerId||ownerMatches.length!==1)fail('TICK_LABEL_OWNER_MISSING_OR_AMBIGUOUS');
    if(label.owner!==ownerId)fail('TICK_LABEL_OWNER_ATTRIBUTE_MISMATCH');
    if(ownedCounts.get(ownerId)!==1)fail('TICK_LABEL_OWNER_NOT_UNIQUE');
    if(tickValue===null)fail('TICK_LABEL_VALUE_INVALID');
    if(primitiveValue===null)fail('TICK_LABEL_PRIMITIVE_VALUE_INVALID');
    if(!axis||axis.axis!==label.tickAxis||!['x','y'].includes(label.tickAxis)||owner?.axis!==label.tickAxis)fail('TICK_LABEL_AXIS_VALUE_PARITY');
    else if(tickValue!==null&&primitiveValue!==null&&Math.abs(primitiveValue-tickValue)>1e-9)fail('TICK_LABEL_AXIS_VALUE_PARITY');
    if(displayValue===null)fail('TICK_LABEL_DISPLAY_VALUE_INVALID');
    else if(tickValue!==null&&Math.abs(displayValue-tickValue)>1e-9)fail('TICK_LABEL_DISPLAY_VALUE_PARITY');
    if(label.font!=='FROZEN_OUTLINE'&&normalized(label.value)!==normalized(label.tickDisplayValue))fail('TICK_LABEL_RENDERED_TEXT_PARITY');
    if(!labelVisibility.ok)fail(labelVisibility.code);
    if(owner&&!ownerVisibility.ok)fail(ownerVisibility.effectStatus==='UNSUPPORTED'?'TICK_LABEL_OWNER_VISIBILITY_UNSUPPORTED':'TICK_LABEL_OWNER_NOT_VISIBLE');
    if(axis&&!axisVisibility.ok)fail(axisVisibility.effectStatus==='UNSUPPORTED'?'TICK_LABEL_AXIS_VISIBILITY_UNSUPPORTED':'TICK_LABEL_AXIS_NOT_VISIBLE');
    const point=owner&&axis?segmentIntersection(axis.points,owner.points):null;
    if(!point)fail('TICK_LABEL_AXIS_TICK_INTERSECTION_MISSING');
    const ownerLeaders=capture.geometry.filter(value=>value.kind==='leader'&&value.ownerLabelId===label.id),calloutSchema=label.tickCalloutSchema;
    let ownerLeaderEvidence=null,ownerLeaderPass=false;
    if(calloutSchema!==null&&calloutSchema!==undefined){
      const leader=ownerLeaders.length===1?ownerLeaders[0]:null,leaderErrors=[],leaderFail=code=>leaderErrors.push(code);
      if(calloutSchema!=='TICK_LABEL_OWNER_LEADER_v1')leaderFail('TICK_LABEL_CALLOUT_SCHEMA_INVALID');
      if(!leader||leader.id!==label.id+'-owner-leader')leaderFail('TICK_LABEL_OWNER_LEADER_MISSING_OR_AMBIGUOUS');
      if(leader&&(!point||leader.role!=='leader'||leader.ownerLabelId!==label.id||leader.tickOwner!==ownerId||leader.tickAxis!==label.tickAxis||strictFiniteNumber(leader.tickValue)!==tickValue))leaderFail('TICK_LABEL_OWNER_LEADER_BINDING_MISMATCH');
      let leaderLength=null,startDelta=null,endAtLabelEdge=false;
      let clearanceEvidence=null;
      if(leader?.points?.length===2){
        leaderLength=Math.hypot(leader.points[1][0]-leader.points[0][0],leader.points[1][1]-leader.points[0][1]);
        startDelta=point?Math.hypot(leader.points[0][0]-point[0],leader.points[0][1]-point[1]):null;
        endAtLabelEdge=!!label.client&&pointOnBoxEdge(leader.points[1],label.client,1.5);
        clearanceEvidence=point?ownerLeaderClearance(label,leader,capture.geometry,point,scale):{status:'FAIL',errors:['TICK_LABEL_OWNER_LEADER_TICK_POINT_MISSING']};
        if(!Number.isFinite(leaderLength)||leaderLength>48*scale+.25)leaderFail('TICK_LABEL_OWNER_LEADER_TOO_LONG');
        if(startDelta===null||startDelta>1*scale+.25)leaderFail('TICK_LABEL_OWNER_LEADER_START_MISMATCH');
        if(!endAtLabelEdge)leaderFail('TICK_LABEL_OWNER_LEADER_END_MISMATCH');
        if(!Number.isFinite(leader.strokeWidthPx)||leader.strokeWidthPx>.8*scale+.25||!['rgb(102, 102, 102)','#666','#666666'].includes(String(leader.strokeColor||'').trim().toLowerCase()))leaderFail('TICK_LABEL_OWNER_LEADER_STYLE_INVALID');
        if(leader.markerStart&&leader.markerStart!=='none'||leader.markerEnd&&leader.markerEnd!=='none')leaderFail('TICK_LABEL_OWNER_LEADER_ARROW_FORBIDDEN');
        if(clearanceEvidence.status!=='PASS')leaderFail('TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL');
        if(!visibleGeometry(leader).ok)leaderFail('TICK_LABEL_OWNER_LEADER_NOT_VISIBLE');
      }else leaderFail('TICK_LABEL_OWNER_LEADER_GEOMETRY_INVALID');
      ownerLeaderPass=leaderErrors.length===0;
      if(!ownerLeaderPass)leaderErrors.forEach(code=>fail(code));
      ownerLeaderEvidence={schemaVersion:calloutSchema,status:ownerLeaderPass?'PASS':'FAIL',leaderId:leader?.id??null,ownerTick:ownerId,axis:label.tickAxis,value:tickValue,leaderLengthCssPx:leaderLength,startDeltaCssPx:startDelta,endAtLabelEdge,clearanceEvidence,errors:leaderErrors};
    }else if(ownerLeaders.length)fail('TICK_LABEL_UNDECLARED_OWNER_LEADER');
    let alignmentDelta=null,edgeGap=null,sourceDelta=null;
    if(point&&label.client) {
      if(label.tickAxis==='x') {
        alignmentDelta=Math.abs(label.client.x+label.client.width/2-point[0]);
        const gaps=[point[1]-bottom(label.client),label.client.y-point[1]].filter(v=>v>=-.1);edgeGap=gaps.length?Math.min(...gaps):null;
      } else if(label.tickAxis==='y') {
        alignmentDelta=Math.abs(label.client.y+label.client.height/2-point[1]);
        const gaps=[point[0]-right(label.client),label.client.x-point[0]].filter(v=>v>=-.1);edgeGap=gaps.length?Math.min(...gaps):null;
      }
      if(!ownerLeaderPass&& (alignmentDelta===null||alignmentDelta>4*scale+.25))fail('TICK_LABEL_ALONG_AXIS_MISALIGNMENT');
      if(!ownerLeaderPass&& (edgeGap===null||edgeGap>16*scale+.25))fail('TICK_LABEL_NORMAL_DISTANCE_OUT_OF_RANGE');
      if(!Array.isArray(label.tickSource)||label.tickSource.length!==2||!label.tickSource.every(Number.isFinite)||!Array.isArray(label.tickSourceClient))fail('TICK_LABEL_SOURCE_POSITION_MISSING');
      else {sourceDelta=Math.hypot(label.tickSourceClient[0]-point[0],label.tickSourceClient[1]-point[1]);if(sourceDelta>1*scale+.25)fail('TICK_LABEL_SOURCE_POSITION_PARITY');}
    }
    tickEvidence.push({labelId:label.id,tickOwner:ownerId,axis:label.tickAxis,displayValue:label.tickDisplayValue,numericValue:tickValue,primitiveValue,ownerMatches:ownerMatches.length,axisMatches:axisMatches.length,intersection:point,actualLabelClient:label.client,alignmentDelta,edgeGap,sourceDelta,ownerLeader:ownerLeaderEvidence,visibility:{label:labelVisibility,owner:ownerVisibility,axis:axisVisibility},renderedVisibility:label.renderedVisibility??null,ownerVisibilityEvidence:owner?.visibilityEvidence??null,axisVisibilityEvidence:axis?.visibilityEvidence??null,status:labelErrors.length?'FAIL':'PASS',errors:labelErrors});
  }
  for(const tick of capture.geometry.filter(v=>v.kind==='tick'&&v.requiredLabelId)) {
    const matches=capture.labels.filter(v=>v.id===tick.requiredLabelId);
    if(strictFiniteNumber(tick.value)===null)errors.push('REQUIRED_TICK_VALUE_INVALID:'+tick.id);
    if(matches.length!==1||matches[0].kind!=='TICK_LABEL'||matches[0].tickOwner!==tick.id) {
      const code='REQUIRED_TICK_LABEL_MISSING_OR_MISOWNED:'+tick.requiredLabelId;errors.push(code);
      tickEvidence.push({labelId:tick.requiredLabelId,tickOwner:tick.id,axis:tick.axis,numericValue:strictFiniteNumber(tick.value),status:'FAIL',errors:[code],requiredLabelMatches:matches.length});
    }
  }
  for(let i=0;i<capture.labels.length;i++) {
    const label=capture.labels[i],box=label.client;
    if(!contains(safe,box)){clippedTextCount++;errors.push('TEXT_CLIPPED:'+label.id);}
    for(const other of capture.labels.slice(i+1))if(overlap(box,other.client)){labelCollisionCount++;if(Math.min(label.priority,other.priority)<=2)criticalCollisionCount++;errors.push('LABEL_OVERLAP:'+label.id+':'+other.id);}
    for(const g of capture.geometry) {
      let hit=false;
      const strokePad=(g.strokeWidthPx??0)/2;
      if(!Number.isFinite(strokePad)||strokePad<0){errors.push('INVALID_STROKE_MEASUREMENT:'+g.id);continue;}
      if(g.kind==='leader'&&g.ownerLabelId===label.id)continue;
      if(g.kind==='tickLabelKnockout'){
        if(g.ownerLabelId===label.id)continue;
        hit=overlap(box,expand(g.client,strokePad));
      } else
      if(g.kind==='conditionBox'){
        if(g.id===label.id+'-box'){if(!contains(g.client,box)){overflowCount++;errors.push('CONDITION_BOX_OVERFLOW:'+label.id);}continue;}
        hit=overlap(box,expand(g.client,strokePad));
      } else if(g.kind==='point'||g.kind==='circle'){
        const [x,y]=g.at;const near=Math.hypot(Math.max(box.x-x,0,x-right(box)),Math.max(box.y-y,0,y-bottom(box)));
        const far=Math.max(...[box.x,right(box)].flatMap(a=>[box.y,bottom(box)].map(b=>Math.hypot(a-x,b-y))));
        hit=near<=g.radius+strokePad&&(g.kind==='point'||far>=Math.max(0,g.radius-strokePad));
      } else hit=g.points?.some((p,j)=>j>0&&segmentBox(g.points[j-1],p,expand(box,strokePad)));
      if(hit){
        const legacyLineMask=tickKnockouts.some(mask=>validLegacyLineMaskIds.has(mask.id)&&mask.ownerLabelId===label.id&&mask.occludedPrimitiveIds.includes(g.id)&&label.id==='tick-x--1-label'&&g.id==='segmentAB'&&g.kind==='line');
        observedLabelCollisionCount++;if(label.priority<=2)observedCriticalCollisionCount++;
        if(!legacyLineMask){labelCollisionCount++;if(label.priority<=2)criticalCollisionCount++;errors.push('LABEL_GEOMETRY_COLLISION:'+label.id+':'+g.id);}
      }
    }
  }
  const publication=['geometry-publication-v1','fragment-publication-spike-v1'].includes(capture.publicationProfile);
  if(publication) {
    const desktopPublication=!capture.publicationViewport||Number.isFinite(capture.publicationViewport?.width)&&capture.publicationViewport.width>=1280;
    const kinds=new Set(['POINT_NAME','ANGLE_LABEL','LENGTH_LABEL','AREA_LABEL','COORDINATE_LABEL','EQUATION_LABEL','TICK_LABEL']);
    const labels=capture.labels.filter(v=>kinds.has(v.kind));
    if(!labels.length||capture.fontStatus!=='loaded')errors.push('PUBLICATION_TEXT_NOT_READY');
    for(const label of capture.labels) {
      if(desktopPublication&&(!Number.isFinite(label.effectiveFontPx)||label.effectiveFontPx<11-1e-7))errors.push('PUBLICATION_FONT_BELOW_11_CSS_PX:'+label.id);
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
  return{status:errors.length?'FAIL':'PASS',HARD_RENDERED_COLLISION:criticalCollisionCount,CLIPPING:clippedTextCount,tickLabelEvidence:tickEvidence,tickKnockoutEvidence,
    labelCollisionCount,criticalCollisionCount,observedLabelCollisionCount,observedCriticalCollisionCount,clippedTextCount,overflowCount,missingGlyphCount,errors,
    labelMeasurements:capture.labels.map(v=>({id:v.id,kind:v.kind,owner:v.owner,annotation:v.annotation,finalViewportCssFontPx:v.effectiveFontPx,baseFontPx:v.baseFontPx,font:v.font,client:v.client,bbox:v.bbox})),
    measurements:Object.fromEntries(capture.labels.map(v=>[v.id,[v.bbox.width+2,v.bbox.height+2]]))};
}
export async function captureAtDisplaySize(page,svg,display,{publicationViewport}={}) {
  if(!display||![display.width,display.height].every(v=>Number.isFinite(v)&&v>0))throw Error('DISPLAY_SIZE_REQUIRED');
  await page.setContent(svg);
  await page.evaluate(({width,height})=>{
    document.body.style.margin='0';
    const root=document.querySelector('svg');
    root.style.width=width+'px';root.style.height=height+'px';root.style.maxWidth='none';root.style.display='block';
  },display);
  return collectRenderedLayout(page,publicationViewport||page.viewportSize());
}
export async function verifyRenderedFile(file,{width=1440,height=1000,screenshot,display}={}) {
  const browser=await launchBrowser();
  try{const page=await browser.newPage({viewport:{width,height}});const svgBytes=fs.readFileSync(file),svg=svgBytes.toString('utf8');let capture;if(display)capture=await captureAtDisplaySize(page,svg,display,{publicationViewport:{width,height}});else{await page.setContent(svg);capture=await collectRenderedLayout(page,{width,height});}capture.svgSha256=sha256(svgBytes);const result=analyzeRenderedLayout(capture);if(screenshot){assertOutput(screenshot);fs.mkdirSync(path.dirname(screenshot),{recursive:true});await page.locator('svg').screenshot({path:screenshot});}return{...result,capture,browserVersion:browser.version(),svgSha256:sha256(svgBytes)};}finally{await browser.close();}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=k=>process.argv[process.argv.indexOf(k)+1];const file=path.resolve(arg('--svg')),out=assertOutput(arg('--out'));const result=await verifyRenderedFile(file,{width:process.argv.includes('--mobile')?390:1440,screenshot:out.replace(/\.json$/,'.png')});fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,errors:result.errors}));if(result.status!=='PASS')process.exitCode=1;
}
