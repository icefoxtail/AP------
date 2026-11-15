import fs from 'node:fs';
import path from 'node:path';
import {bytesSha} from '../../pipeline-core/canonical.mjs';
import {assetIdentity} from './contracts.mjs';
import {typesetter} from './typography.mjs';
import {inkCoverage,schematicRaster} from './source-schematic-raster.mjs';
import {auditSourceSchematic} from './source-schematic-observer.mjs';
import {analyzeRenderedLayout,captureAtDisplaySize} from '../verify-rendered-layout.mjs';

export const SOURCE_SCHEMATIC_CAPABILITY='source-exp-log-schematic-v1';
const pathIds=['xAxis','yAxis','secant','exponential','logarithm'];
const labels=['O','A','B','C','x','y','exp','log','line','schematic'];
const color={exponential:'#1f5fa8',logarithm:'#2e7d32',secant:'#b85c00'};
const owner={O:'O',A:'A',B:'B',C:'C',x:'xAxis',y:'yAxis',exp:'exponential',log:'logarithm',line:'secant',schematic:'figure'};
const refuse=code=>{throw Error(code);};
const keys=(o,wanted)=>!!o&&Object.getPrototypeOf(o)===Object.prototype&&Object.keys(o).sort().join(',')===[...wanted].sort().join(',');
const plainSha=bytes=>bytesSha(bytes).slice(7);
const fmt=n=>Number(n.toFixed(6));
const title='지수곡선과 로그곡선의 개형';
const description='좌표평면의 개형이다. 내림 직선이 지수곡선과 A에서, 로그곡선과 B에서 만난다. 지수곡선은 세로축과 C에서 만나며 O는 원점이다.';

function sourceFormulas(question){
  const stem=question.content??question.question;
  if(typeof stem!=='string')refuse('SCHEMATIC_SOURCE_STEM_UNSUPPORTED');
  const math=[...stem.matchAll(/\$([^$]+)\$/g)].map(match=>match[1].replace(/\s/g,''));
  const a=math.find(x=>/^[a-wz]>1$/.test(x))?.[0];
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

// Validate the source-pixel paths; pixel coordinates are not allowed to acquire mathematical units.
function geometry(paths,raster){
  if(!keys(paths,pathIds))refuse('SCHEMATIC_INVALID_TRACE');
  const coverage={};
  for(const id of pathIds){
    const trace=paths[id],curved=id==='exponential'||id==='logarithm';
    if(!Array.isArray(trace)||trace.length>(curved?64:2)||trace.length<(curved?6:2)||
      !trace.every(point=>screenPoint(point,raster)))refuse('SCHEMATIC_INVALID_TRACE:'+id);
    const link=inkCoverage(trace,raster);
    if(link.ratio<.93||link.longestGap>7||!trace.every(([x,y])=>raster.nearInk(x,y)))refuse('SCHEMATIC_TRACE_WITHOUT_SOURCE_INK:'+id);
    coverage[id]=link;
  }
  const {xAxis,yAxis,secant,exponential,logarithm}=paths;
  const [[lx,ly],[rx,ry]]=xAxis,[[tx,ty],[bx,by]]=yAxis,[[sx,sy],[ex,ey]]=secant;
  if(ly!==ry||tx!==bx||lx>=tx||rx<=tx||ty>=ly||by<=ly||sx>=ex||sy>=ey)refuse('SCHEMATIC_INVALID_AXES_OR_LINE');
  for(const trace of [exponential,logarithm]){
    if(trace.slice(1).some(([x,y],i)=>x<=trace[i][0]||y>=trace[i][1]))refuse('SCHEMATIC_CURVE_NOT_INCREASING');
  }
  const chord=(a,b)=>Math.abs((b[1]-a[1])/(b[0]-a[0]));
  for(const [trace,convex] of [[exponential,true],[logarithm,false]]){
    const middle=trace[Math.floor(trace.length/2)],l=chord(trace[0],middle),r=chord(middle,trace.at(-1));
    if(convex?r<1.4*l:l<1.4*r)refuse('SCHEMATIC_CURVE_WRONG_BEND');
  }
  const overlapStart=Math.max(exponential[0][0],logarithm[0][0]),overlapEnd=Math.min(exponential.at(-1)[0],logarithm.at(-1)[0]);
  const overlapXs=[overlapStart,overlapEnd,...exponential.concat(logarithm).map(p=>p[0]).filter(x=>overlapStart<x&&x<overlapEnd)];
  if(overlapStart>=overlapEnd||overlapXs.some(x=>crossY(exponential,x)>=crossY(logarithm,x)))
    refuse('SCHEMATIC_CURVES_CROSS_OR_DO_NOT_OVERLAP');
  const cy=crossY(exponential,tx),A=intersection(exponential,secant),B=intersection(logarithm,secant);
  const O=[tx,ly],C=[tx,cy];
  if(!A||!B||cy===null||!(tx<A[0]&&A[0]<B[0]&&A[1]<B[1]&&B[1]<cy&&cy<ly))refuse('SCHEMATIC_POINT_TOPOLOGY_MISMATCH');
  if(logarithm[0][0]<=tx||logarithm[0][1]<=ly)refuse('SCHEMATIC_LOG_DOMAIN_SIDE_MISMATCH');
  const points={O,C,A,B};
  for(const [x,y] of Object.values(points))if(!raster.nearInk(x,y))refuse('SCHEMATIC_POINT_WITHOUT_SOURCE_INK');
  return {points,coverage};
}

const attrs=(id,role)=>'id="'+id+'" data-role="'+role+'"';
const position=(x,y)=>fmt(x)+','+fmt(y);

export function prepareSourceSchematic(plan,{repoRoot,question,identity,typography}){
  if(!keys(plan,['capability','sourceAsset','sourceSha256','paths','labelOrigins'])||
    plan.capability!==SOURCE_SCHEMATIC_CAPABILITY)refuse('SCHEMATIC_INVALID_PLAN');
  if(identity?.surface!=='PROBLEM_VISUAL'||!['body','image'].includes(identity.visualRole)||
    identity.assetId!==assetIdentity(identity.questionUid,identity.surface,identity.visualRole).assetId)
    refuse('SCHEMATIC_PROBLEM_SURFACE_REQUIRED');
  const ordinal=question?.id??question?.qid??question?.number;
  if(!Number.isSafeInteger(ordinal)||!identity.questionUid.endsWith('|'+ordinal))refuse('SCHEMATIC_SOURCE_ORDINAL_MISMATCH');
  const formulas=sourceFormulas(question),raster=sourceRaster(plan,repoRoot,formulas.stem);
  const {points,coverage}=geometry(plan.paths,raster);
  if(!keys(plan.labelOrigins,labels)||!Object.values(plan.labelOrigins).every(at=>screenPoint(at,raster)))refuse('SCHEMATIC_INVALID_LABEL_POSITIONS');
  const {baseFontPx,displayScale}=typography??{};
  if(!Number.isFinite(baseFontPx)||baseFontPx<20||baseFontPx>36||!Number.isFinite(displayScale)||displayScale<=0||displayScale>2||baseFontPx*displayScale<11)
    refuse('SCHEMATIC_TYPOGRAPHY_INVALID');
  const text={O:'O',A:'A',B:'B',C:'C',x:'x',y:'y',exp:formulas.exp,log:formulas.log,line:formulas.line,schematic:'개형'};
  const width=raster.width,height=raster.height,type=typesetter();
  const groups=labels.map(id=>{
    const f=type({id:'label-'+id,owner:owner[id],factRole:'GIVEN',fontPx:baseFontPx,
      ...(id==='schematic'?{kind:'TEXT',text:text[id]}:{kind:'MATH',tex:text[id]})},identity);
    const [x,y]=plan.labelOrigins[id];
    if(x<10||y<10||x+f.intrinsic.width>width-10||y+f.intrinsic.height>height-10)refuse('SCHEMATIC_LABEL_OUTSIDE_SAFE_AREA:'+id);
    const kind=['O','A','B','C'].includes(id)?'POINT_NAME':id==='schematic'||id==='x'||id==='y'?'GRAPH_ANNOTATION':'EQUATION_LABEL';
    if(['O','A','B','C'].includes(id)&&Math.hypot(x+f.intrinsic.width/2-points[id][0],y+f.intrinsic.height/2-points[id][1])>55)
      refuse('SCHEMATIC_POINT_LABEL_TOO_FAR:'+id);
    const start='<g id="label-'+id+'" data-label-kind="'+kind+'" data-owner="'+owner[id]+'" data-font-px="'+baseFontPx+'" data-fragment-sha="'+f.fragmentSha256+'" data-priority="0" transform="translate('+x+' '+y+')">';
    return {id,group:start+f.svg+'</g>',box:[x,y,x+f.intrinsic.width,y+f.intrinsic.height]};
  });
  for(const [i,a] of groups.entries())for(const b of groups.slice(i+1)){
    const [l,t,r,d]=a.box,[x,y,u,v]=b.box;
    if(l<u&&x<r&&t<v&&y<d)refuse('SCHEMATIC_LABEL_OVERLAP:'+a.id+':'+b.id);
  }
  const strokes=pathIds.map(id=>{
    const trace=plan.paths[id],stroke=color[id]??'#111',weight=id==='xAxis'||id==='yAxis'?1.8:3.2;
    if(id==='xAxis'||id==='yAxis'||id==='secant'){
      const [[x1,y1],[x2,y2]]=trace;
      return '<line '+attrs(id,id==='secant'?'line':'axis')+' x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+stroke+'" stroke-width="'+weight+'"/>';
    }
    return '<polyline '+attrs(id,'curve')+' points="'+trace.map(([x,y])=>position(x,y)).join(' ')+'" fill="none" stroke="'+stroke+'" stroke-width="'+weight+'"'+(id==='logarithm'?' stroke-dasharray="8 4"':'')+'/>';
  });
  const dots=Object.entries(points).map(([id,[x,y]])=>'<circle '+attrs(id,'point')+' cx="'+fmt(x)+'" cy="'+fmt(y)+'" r="4.5" fill="#111"/>');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+
    '" role="img" aria-labelledby="visual-title visual-desc" data-source-png-sha256="'+plan.sourceSha256+'" data-scale-policy="SCHEMATIC_ALLOWED" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="10">'+
    '<title id="visual-title">'+title+'</title><desc id="visual-desc">'+description+'</desc><rect width="'+width+'" height="'+height+'" fill="#fff"/>'+
    '<g id="schematic-geometry">'+strokes.join('')+dots.join('')+'</g><g id="schematic-labels">'+groups.map(g=>g.group).join('')+'</g></svg>';
  const staticAudit=auditSourceSchematic(svg,{paths:plan.paths,points,groups,sourceSha256:plan.sourceSha256,width,height,title,description});
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
