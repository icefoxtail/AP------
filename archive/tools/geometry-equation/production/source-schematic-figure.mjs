import fs from 'node:fs';
import path from 'node:path';
import {bytesSha} from '../../pipeline-core/canonical.mjs';
import {assetIdentity} from './contracts.mjs';
import {typesetter} from './typography.mjs';
import {inkCoverage,schematicRaster} from './source-schematic-raster.mjs';
import {auditSourceSchematic} from './source-schematic-observer.mjs';
import {analyzeRenderedLayout,captureAtDisplaySize} from '../verify-rendered-layout.mjs';

export const SOURCE_SCHEMATIC_CAPABILITY='source-exp-log-schematic-v1';
const TRANSLATED_LOG_CAPABILITY='source-log-translate-schematic-v1';
const QUADRILATERAL_CAPABILITY='source-exp-log-orthogonal-guides-schematic-v1';
export const isSourceSchematicCapability=value=>
  [SOURCE_SCHEMATIC_CAPABILITY,TRANSLATED_LOG_CAPABILITY,QUADRILATERAL_CAPABILITY].includes(value);
const guideIds=['AC','BD'];
const outlineIds=['AB','BC','CD','DA'];

const colors={exponential:'#1f5fa8',logarithm:'#2e7d32',logOriginal:'#1f5fa8',logShifted:'#2e7d32',secant:'#b85c00'};
const commonOwners={x:'xAxis',y:'yAxis',line:'secant',schematic:'figure'};
const refuse=code=>{throw Error(code);};
const keys=(o,wanted)=>!!o&&Object.getPrototypeOf(o)===Object.prototype&&Object.keys(o).sort().join(',')===[...wanted].sort().join(',');
const plainSha=bytes=>bytesSha(bytes).slice(7);
const fmt=n=>Number(n.toFixed(6));
const expLogTitle='지수곡선과 로그곡선의 개형';
const expLogDescription='좌표평면의 개형이다. 내림 직선이 지수곡선과 A에서, 로그곡선과 B에서 만난다. 지수곡선은 세로축과 C에서 만나며 O는 원점이다.';

function translatedLogFormulas(math,a){
  const logs=[...new Set(math)].map(text=>{
    const hit=text.match(/^y=\\log_([a-wz])\(x-([1-9]\d?)\)([+-][1-9]\d?)?$/);
    return hit&&{text,base:hit[1],shift:Number(hit[2]),height:Number(hit[3]??0)};
  }).filter(Boolean);
  const lines=[...new Set(math)].filter(text=>/^y=-(?:[1-9]\d?|\\frac\{[1-9]\d?\}\{[1-9]\d?\})x\+[1-9]\d?$/.test(text));
  const roles=math.map(token=>token.replace(/\\mathrm\{([ABPQ])\}/g,'$1'));
  if(!a||logs.length!==2||logs.some(row=>row.base!==a)||lines.length!==1||!roles.includes('A,B')||!roles.includes('P,Q'))
    refuse('SCHEMATIC_SOURCE_STEM_UNSUPPORTED');
  const [first,second]=logs,[line]=lines;
  const sequence=[line,'y','x','A,B',line,first.text,second.text,'P,Q'];
  if(!roles.some((_,i)=>sequence.every((token,j)=>roles[i+j]===token)))
    refuse('SCHEMATIC_SOURCE_POINT_BINDING_UNSUPPORTED');
  const fraction=line.match(/\\frac\{(\d+)\}\{(\d+)\}/);
  const numerator=Number(fraction?fraction[1]:line.match(/^y=-(\d+)x/)[1]),denominator=Number(fraction?.[2]??1);
  const dx=second.shift-first.shift,dy=second.height-first.height;
  if(dx<=0||-numerator*dx!==denominator*dy)refuse('SCHEMATIC_TRANSLATION_NOT_PARALLEL');
  return {logOriginal:first.text,logShifted:second.text,line};
}

function quadrilateralFormulas(stem,math){
  const base=stem.match(/1보다\s*큰\s*실수\s*\$([a-wz])\$/)?.[1];
  if(!base)refuse('SCHEMATIC_SOURCE_STEM_UNSUPPORTED');
  const exp=math.find(token=>new RegExp('^y='+base+'\\^x\\+[1-9]\\d?$').test(token));
  const log=math.find(token=>new RegExp('^y=\\\\log_'+base+'\\(x-[1-9]\\d?\\)$').test(token));
  if(!exp||!log)refuse('SCHEMATIC_SOURCE_STEM_UNSUPPORTED');
  const body=stem.split(/<img\b/i)[0].replace(/\s/g,'').replace(/\\mathrm\{([ABCD]+)\}/g,'$1');
  const relations=[
    exp+'$의그래프가$y$축과만나는점을$A$',
    log+'$의그래프가$x$축과만나는점을$B$',
    '$A$를지나고$y$축에수직인직선이함수$'+log+'$의그래프와만나는점을$C$',
    '$B$를지나고$x$축에수직인직선이함수$'+exp+'$의그래프와만나는점을$D$',
    '사각형$ABCD$',
  ];
  if(!relations.every(relation=>body.includes(relation)))
    refuse('SCHEMATIC_SOURCE_POINT_BINDING_UNSUPPORTED');
  return {stem,exp,log};
}

function sourceFormulas(question,translated,quadrilateral){
  const stem=question.content??question.question;
  if(typeof stem!=='string')refuse('SCHEMATIC_SOURCE_STEM_UNSUPPORTED');
  const math=[...stem.matchAll(/\$([^$]+)\$/g)].map(match=>match[1].replace(/\s/g,''));
  if(quadrilateral)return quadrilateralFormulas(stem,math);
  const a=math.find(x=>/^[a-wz]>1$/.test(x))?.[0];
  if(translated)return {stem,...translatedLogFormulas(math,a)};
  const line=math.find(x=>/^y=-x\+[1-9]\d?$/.test(x));
  const exp='y='+a+'^{x-1}',log='y=\\log_'+a+'(x-1)';
  if(!a||!line||!math.includes(exp)||!math.includes(log)||!math.includes('A,B')||!math.includes('C'))
    refuse('SCHEMATIC_SOURCE_STEM_UNSUPPORTED');
  return {stem,exp,log,line};
}

function sourceRaster(plan,repoRoot,stem){
  if(typeof plan.sourceAsset!=='string'||
    !/^archive\/assets\/images\/[^/\\:\u0000-\u001f]+\/[^/\\:\u0000-\u001f]+\.png$/.test(plan.sourceAsset)||
    path.posix.normalize(plan.sourceAsset)!==plan.sourceAsset||
    !/^[a-f0-9]{64}$/.test(plan.sourceSha256??''))refuse('SCHEMATIC_INVALID_SOURCE_REFERENCE');
  const src=[...stem.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map(x=>x[1]);
  if(src.length!==1||src[0]!==plan.sourceAsset.slice('archive/'.length))refuse('SCHEMATIC_SOURCE_NOT_BOUND_TO_QUESTION');
  const abs=path.resolve(repoRoot,plan.sourceAsset),images=fs.realpathSync(path.resolve(repoRoot,'archive/assets/images'));
  const rel=path.relative(images,fs.realpathSync(abs));
  if(rel.startsWith('..')||path.isAbsolute(rel))refuse('SCHEMATIC_INVALID_SOURCE_REFERENCE');
  const bytes=fs.readFileSync(abs);
  if(plainSha(bytes)!==plan.sourceSha256)refuse('SCHEMATIC_SOURCE_SHA_MISMATCH');
  return schematicRaster(bytes);
}

function screenPoint(at,raster){
  return Array.isArray(at)&&at.length===2&&at.every(Number.isSafeInteger)&&
    at[0]>=0&&at[0]<raster.width&&at[1]>=0&&at[1]<raster.height;
}
function crossY(points,x){
  const i=points.findIndex(p=>p[0]>=x);
  if(i<0)return null;
  if(i===0)return points[0][0]===x?points[0][1]:null;
  const [a,b]=[points[i-1],points[i]];
  return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
}
function intersection(points,secant){
  const [[x,y],[u,v]]=secant,slope=(v-y)/(u-x);
  const delta=p=>p[1]-y-(p[0]-x)*slope;
  for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i],l=delta(a),r=delta(b);
    if(!(l>0&&r<=0))continue;
    const t=l/(l-r),hit=[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])];
    if(hit[0]<=x||hit[0]>=u)return null;
    return hit;
  }
  return null;
}

function translatedLogPoints(secant,axes,first,second){
  const [[sx,sy],[ex,ey]]=secant,{xAxis,yAxis}=axes;
  const [[lx,ly],[rx]]=xAxis,[[tx,ty],[,by]]=yAxis;
  const slope=(ey-sy)/(ex-sx),ay=sy+(tx-sx)*slope,bx=sx+(ly-sy)/slope;
  const A=[tx,ay],B=[bx,ly],P=intersection(first,secant),Q=intersection(second,secant);
  if(!P||!Q||!(sx<tx&&bx<ex&&ty<ay&&ay<by&&lx<bx&&bx<rx&&tx<P[0]&&P[0]<Q[0]&&Q[0]<bx&&
    ay<P[1]&&P[1]<Q[1]&&Q[1]<ly))
    refuse('SCHEMATIC_POINT_TOPOLOGY_MISMATCH');
  if(first[0][0]<=tx||first[0][0]>=second[0][0]||first[0][1]<=ly||second[0][1]<=ly)
    refuse('SCHEMATIC_LOG_DOMAIN_SIDE_MISMATCH');
  return {O:[tx,ly],A,P,Q,B};
}

function expLogPoints(secant,axes,exponential,logarithm){
  const {xAxis,yAxis}=axes,[[,ly]]=xAxis,[[tx]]=yAxis;
  const cy=crossY(exponential,tx),A=intersection(exponential,secant),B=intersection(logarithm,secant);
  const O=[tx,ly],C=[tx,cy];
  if(!A||!B||cy===null||!(tx<A[0]&&A[0]<B[0]&&A[1]<B[1]&&B[1]<cy&&cy<ly))refuse('SCHEMATIC_POINT_TOPOLOGY_MISMATCH');
  if(logarithm[0][0]<=tx||logarithm[0][1]<=ly)refuse('SCHEMATIC_LOG_DOMAIN_SIDE_MISMATCH');
  return {O,C,A,B};
}

function quadrilateralPoints(axes,exponential,logarithm){
  const {xAxis,yAxis}=axes,[[lx,ly],[rx]]=xAxis,[[tx,ty]]=yAxis;
  // crossY on [-screenY, screenX] gives the x position at a given height.
  const asHeight=logarithm.map(([x,y])=>[-y,x]);
  const ay=crossY(exponential,tx),bx=crossY(asHeight,-ly);
  const cx=ay===null?null:crossY(asHeight,-ay),dy=bx===null?null:crossY(exponential,bx);
  if([ay,bx,cx,dy].some(value=>value===null)||
    !(ty<=ay&&ay<ly&&lx<=bx&&tx<bx&&bx<cx&&bx<=rx&&dy<ay&&logarithm[0][0]>tx))
    refuse('SCHEMATIC_POINT_TOPOLOGY_MISMATCH');
  return {O:[tx,ly],A:[tx,ay],B:[bx,ly],C:[cx,ay],D:[bx,dy]};
}

function quadrilateralEdges(points,raster,coverage){
  const edges={};
  for(const id of [...guideIds,...outlineIds]){
    const path=[points[id[0]],points[id[1]]],sample=inkCoverage(path,raster);
    // The source scan may have a bounded gap in an outline. The ends still
    // come from jointly verified curve/axis incidences, never from input edges.
    const min=guideIds.includes(id)?.93:.8;
    const maxGap=guideIds.includes(id)?7:36;
    if(sample.ratio<min||sample.longestGap>maxGap)refuse('SCHEMATIC_TRACE_WITHOUT_SOURCE_INK:'+id);
    edges[id]=path;coverage[id]=sample;
  }
  return edges;
}

// Validate the source-pixel paths; pixel coordinates are not allowed to acquire mathematical units.
function geometry(paths,raster,curveIds,translated,quadrilateral){
  const pathIds=['xAxis','yAxis',...(quadrilateral?[]:['secant']),...curveIds];
  if(!keys(paths,pathIds))refuse('SCHEMATIC_INVALID_TRACE');
  const coverage={};
  for(const id of pathIds){
    const trace=paths[id],curved=curveIds.includes(id);
    if(!Array.isArray(trace)||trace.length>(curved?64:2)||trace.length<(curved?6:2)||
      !trace.every(point=>screenPoint(point,raster)))refuse('SCHEMATIC_INVALID_TRACE:'+id);
    const link=inkCoverage(trace,raster);
    if(link.ratio<.93||link.longestGap>7||!trace.every(([x,y])=>raster.nearInk(x,y)))refuse('SCHEMATIC_TRACE_WITHOUT_SOURCE_INK:'+id);
    coverage[id]=link;
  }
  const {xAxis,yAxis,secant}=paths, [first,second]=curveIds.map(id=>paths[id]);
  const [[lx,ly],[rx,ry]]=xAxis,[[tx,ty],[bx,by]]=yAxis;
  if(ly!==ry||tx!==bx||lx>=tx||rx<=tx||ty>=ly||by<=ly)refuse('SCHEMATIC_INVALID_AXES_OR_LINE');
  if(!quadrilateral){
    const [[sx,sy],[ex,ey]]=secant;
    if(sx>=ex||sy>=ey)refuse('SCHEMATIC_INVALID_AXES_OR_LINE');
  }
  for(const trace of [first,second]){
    if(trace.slice(1).some(([x,y],i)=>x<=trace[i][0]||y>=trace[i][1]))refuse('SCHEMATIC_CURVE_NOT_INCREASING');
  }
  const chord=(a,b)=>Math.abs((b[1]-a[1])/(b[0]-a[0]));
  for(const [trace,convex] of [[first,!translated],[second,false]]){
    const middle=trace[Math.floor(trace.length/2)],l=chord(trace[0],middle),r=chord(middle,trace.at(-1));
    if(convex?r<1.4*l:l<1.4*r)refuse('SCHEMATIC_CURVE_WRONG_BEND');
  }
  const overlapStart=Math.max(first[0][0],second[0][0]),overlapEnd=Math.min(first.at(-1)[0],second.at(-1)[0]);
  const overlapXs=[overlapStart,overlapEnd,...first.concat(second).map(p=>p[0]).filter(x=>overlapStart<x&&x<overlapEnd)];
  if(overlapStart>=overlapEnd||overlapXs.some(x=>crossY(first,x)>=crossY(second,x)))
    refuse('SCHEMATIC_CURVES_CROSS_OR_DO_NOT_OVERLAP');
  const axes={xAxis,yAxis};
  const points=quadrilateral?quadrilateralPoints(axes,first,second)
    :translated?translatedLogPoints(secant,axes,first,second):expLogPoints(secant,axes,first,second);
  for(const [x,y] of Object.values(points))if(!raster.nearInk(x,y))refuse('SCHEMATIC_POINT_WITHOUT_SOURCE_INK');
  const drawnPaths=Object.fromEntries(pathIds.map(id=>[id,paths[id]]));
  if(quadrilateral)Object.assign(drawnPaths,quadrilateralEdges(points,raster,coverage));
  return {points,coverage,drawnPaths};
}

const attrs=(id,role)=>'id="'+id+'" data-role="'+role+'"';
const position=(x,y)=>fmt(x)+','+fmt(y);

function outputFrame(raster,view,drawnPaths){
  if(!keys(view,['width','height'])||!Number.isSafeInteger(view.width)||!Number.isSafeInteger(view.height)||
    view.width<.7*raster.width||view.width>raster.width||view.height<raster.height||view.height>raster.height+128)
    refuse('SCHEMATIC_INVALID_OUTPUT_FRAME');
  if(Object.values(drawnPaths).some(trace=>trace.some(([x,y])=>x>=view.width||y>=view.height)))
    refuse('SCHEMATIC_TRACE_OUTSIDE_OUTPUT_FRAME');
  return view;
}

export function prepareSourceSchematic(plan,{repoRoot,question,identity,typography}){
  const quadrilateral=plan?.capability===QUADRILATERAL_CAPABILITY;
  if(!keys(plan,['capability','sourceAsset','sourceSha256','paths','labelOrigins',...(quadrilateral?['view']:[])])||
    !isSourceSchematicCapability(plan.capability))refuse('SCHEMATIC_INVALID_PLAN');
  if(identity?.surface!=='PROBLEM_VISUAL'||!['body','image'].includes(identity.visualRole)||
    identity.assetId!==assetIdentity(identity.questionUid,identity.surface,identity.visualRole).assetId)
    refuse('SCHEMATIC_PROBLEM_SURFACE_REQUIRED');
  const ordinal=question?.id??question?.qid??question?.number;
  if(!Number.isSafeInteger(ordinal)||!identity.questionUid.endsWith('|'+ordinal))refuse('SCHEMATIC_SOURCE_ORDINAL_MISMATCH');
  const translated=plan.capability===TRANSLATED_LOG_CAPABILITY;
  const formulas=sourceFormulas(question,translated,quadrilateral),raster=sourceRaster(plan,repoRoot,formulas.stem);
  const curveIds=translated?['logOriginal','logShifted']:['exponential','logarithm'];
  const {points,coverage,drawnPaths}=geometry(plan.paths,raster,curveIds,translated,quadrilateral);
  const frame=quadrilateral?outputFrame(raster,plan.view,drawnPaths):raster;
  const pointNames=quadrilateral?['O','A','B','C','D']:translated?['O','A','B','P','Q']:['O','A','B','C'];
  const formulaNames=translated?curveIds:['exp','log'];
  const labels=[...pointNames,'x','y',...formulaNames,...(quadrilateral?[]:['line']),'schematic'];
  const owner={...commonOwners,...Object.fromEntries(pointNames.map(id=>[id,id])),
    [formulaNames[0]]:curveIds[0],[formulaNames[1]]:curveIds[1]};
  if(!keys(plan.labelOrigins,labels)||!Object.values(plan.labelOrigins).every(at=>screenPoint(at,frame)))refuse('SCHEMATIC_INVALID_LABEL_POSITIONS');
  const {baseFontPx,displayScale}=typography??{};
  if(!Number.isFinite(baseFontPx)||baseFontPx<20||baseFontPx>36||!Number.isFinite(displayScale)||displayScale<=0||displayScale>2)// 2026-11-23 (owner): the displayed font (baseFontPx*displayScale) no longer has to reach 11; the authored baseFontPx >= 20 above still does
    refuse('SCHEMATIC_TYPOGRAPHY_INVALID');
  const text={...Object.fromEntries(pointNames.map(id=>[id,id])),x:'x',y:'y',
    [formulaNames[0]]:formulas[formulaNames[0]],[formulaNames[1]]:formulas[formulaNames[1]],line:formulas.line,schematic:'개형'};
  const title=quadrilateral?'지수곡선과 로그곡선이 만드는 사각형의 개형':translated?'두 로그곡선과 직선의 개형':expLogTitle;
  const description=quadrilateral
    ?'좌표평면의 개형이다. 세로축과 지수곡선의 교점은 A이고, 가로축과 로그곡선의 교점은 B이다. A에서 옮긴 수평선은 C에서 로그곡선과 만나고, B에서 세운 수직선은 D에서 지수곡선과 만난다. 네 점이 사각형을 이룬다.'
    :translated
    ?'좌표평면의 개형이다. 직선이 세로축과 A에서, 가로축과 B에서 만난다. 첫 로그곡선은 직선과 P에서 만나고 오른쪽 아래로 옮긴 둘째 로그곡선은 Q에서 만난다. O는 원점이다.'
    :expLogDescription;
  const {width,height}=frame,type=typesetter();
  const groups=labels.map(id=>{
    const f=type({id:'label-'+id,owner:owner[id],factRole:'GIVEN',fontPx:baseFontPx,
      ...(id==='schematic'?{kind:'TEXT',text:text[id]}:{kind:'MATH',tex:text[id]})},identity);
    const [x,y]=plan.labelOrigins[id];
    if(x<10||y<10||x+f.intrinsic.width>width-10||y+f.intrinsic.height>height-10)refuse('SCHEMATIC_LABEL_OUTSIDE_SAFE_AREA:'+id);
    const kind=pointNames.includes(id)?'POINT_NAME':id==='schematic'||id==='x'||id==='y'?'GRAPH_ANNOTATION':'EQUATION_LABEL';
    if(pointNames.includes(id)&&Math.hypot(x+f.intrinsic.width/2-points[id][0],y+f.intrinsic.height/2-points[id][1])>55)
      refuse('SCHEMATIC_POINT_LABEL_TOO_FAR:'+id);
    const start='<g id="label-'+id+'" data-label-kind="'+kind+'" data-owner="'+owner[id]+'" data-font-px="'+baseFontPx+'" data-fragment-sha="'+f.fragmentSha256+'" data-priority="0" transform="translate('+x+' '+y+')">';
    return {id,group:start+f.svg+'</g>',box:[x,y,x+f.intrinsic.width,y+f.intrinsic.height]};
  });
  for(const [i,a] of groups.entries())for(const b of groups.slice(i+1)){
    const [l,t,r,d]=a.box,[x,y,u,v]=b.box;
    if(l<u&&x<r&&t<v&&y<d)refuse('SCHEMATIC_LABEL_OVERLAP:'+a.id+':'+b.id);
  }
  const strokes=Object.entries(drawnPaths).map(([id,trace])=>{
    const isAxis=id==='xAxis'||id==='yAxis',guide=guideIds.includes(id),side=outlineIds.includes(id);
    const stroke=guide?'#475569':side?'#64748b':colors[id]??'#111';
    const weight=isAxis?1.8:guide?2.2:side?2.4:3.2;
    if(!curveIds.includes(id)){
      const [[x1,y1],[x2,y2]]=trace;
      return '<line '+attrs(id,isAxis?'axis':'line')+' x1="'+fmt(x1)+'" y1="'+fmt(y1)+'" x2="'+fmt(x2)+'" y2="'+fmt(y2)+'" stroke="'+stroke+'" stroke-width="'+weight+'"/>';
    }
    return '<polyline '+attrs(id,'curve')+' points="'+trace.map(([x,y])=>position(x,y)).join(' ')+'" fill="none" stroke="'+stroke+'" stroke-width="'+weight+'"'+(id===curveIds[1]?' stroke-dasharray="8 4"':'')+'/>';
  });
  const dots=Object.entries(points).map(([id,[x,y]])=>'<circle '+attrs(id,'point')+' cx="'+fmt(x)+'" cy="'+fmt(y)+'" r="4.5" fill="#111"/>');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+
    '" role="img" aria-labelledby="visual-title visual-desc" data-source-png-sha256="'+plan.sourceSha256+'" data-scale-policy="SCHEMATIC_ALLOWED" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="10">'+
    '<title id="visual-title">'+title+'</title><desc id="visual-desc">'+description+'</desc><rect width="'+width+'" height="'+height+'" fill="#fff"/>'+
    '<g id="schematic-geometry">'+strokes.join('')+dots.join('')+'</g><g id="schematic-labels">'+groups.map(g=>g.group).join('')+'</g></svg>';
  const staticAudit=auditSourceSchematic(svg,{paths:drawnPaths,points,groups,sourceSha256:plan.sourceSha256,width,height,title,description});
  if(staticAudit.status!=='PASS')refuse('SCHEMATIC_STATIC_AUDIT_FAILED:'+staticAudit.errors.join(','));
  return {svg,staticAudit,coverage,points,display:{width:width*displayScale,height:height*displayScale},sourceSha256:plan.sourceSha256,svgSha256:plainSha(Buffer.from(svg))};
}

export async function composeSourceSchematic(plan,context){
  const prepared=prepareSourceSchematic(plan,context),page=await context.browser.newPage();
  let renderedLayout;
  try{
    const capture=await captureAtDisplaySize(page,prepared.svg,prepared.display,{publicationViewport:{width:1440,height:1000}});
    renderedLayout=analyzeRenderedLayout(capture);
  }finally{await page.close();}
  if(renderedLayout.status!=='PASS')return {status:'RENDERED_LAYOUT_FAIL',detail:renderedLayout.errors,staticAudit:prepared.staticAudit,renderedLayout};
  return {...prepared,status:'COMPOSED',renderedLayout};
}
