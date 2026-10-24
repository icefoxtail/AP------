import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import * as figure from './number-line-v1.mjs';

// A quadratic inequality solution drawn as a fixed chain (one author plan, quadratic-inequality-chain-v1): the quadratic graph in the solution's own
// variable, then a number line of the solution set (number-line-v1 panel: the interval as a header row, the set on the axis, optional integer points).
// The engine solves the inequality exactly; number_line_observer.py re-solves it with SymPy and checks the final panel SVG.
export const CHAIN_CAPABILITY='quadratic-inequality-chain-v1';
export const NUMBER_LINE_CAPABILITY='number-line-v1';
export const NUMBER_LINE_SVG_VERSION='number-line-panel-svg-v1';
const SOLUTION_VERSION='QUADRATIC_INEQUALITY_SOLUTION_v1',SPEC_VERSION='NUMBER_LINE_SPEC_v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('number-line-observer-worker.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const COMPARATORS=new Set(['<','<=','>','>=']),FLIP={'<':'>','<=':'>=','>':'<','>=':'<='};
const MAX_INTEGER_POINTS=25;

// --- exact numbers: rationals [n,d] (BigInt, d>0, reduced) and p+q*sqrt(s) with s a squarefree integer (s=1: rational) -------------------------
const bad=code=>{throw Error(code);};
// Exact-number helpers shared with number-line-v1.mjs (the standalone number-line figure).
export {rat,add,sub,mul,div,sgn,ZERO,parseRat,gcd,checkVariable,esc,overlaps,isDomainCode,Stop};
const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;};
const rat=(n,d=1n)=>{if(d===0n)bad('INEQUALITY_NUMERIC_SCOPE');if(d<0n){n=-n;d=-d;}const g=gcd(n,d)||1n;return [n/g,d/g];};
const add=(a,b)=>rat(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),sub=(a,b)=>add(a,[-b[0],b[1]]),mul=(a,b)=>rat(a[0]*b[0],a[1]*b[1]),div=(a,b)=>rat(a[0]*b[1],a[1]*b[0]);
const sgn=a=>a[0]>0n?1:a[0]<0n?-1:0,ZERO=[0n,1n];
function parseRat(text,code){
  if(typeof text!=='string'||!/^-?\d{1,15}(?:\/\d{1,15})?$/.test(text))bad(code);
  const [n,d='1']=text.split('/');if(BigInt(d)===0n)bad(code);return rat(BigInt(n),BigInt(d));
}
const real=(p,q=ZERO,s=1n)=>s===1n?{p:add(p,q),q:ZERO,s:1n}:sgn(q)===0?{p,q:ZERO,s:1n}:{p,q,s};
/** sqrt of a positive rational as q*sqrt(s): sqrt(n/d)=sqrt(n*d)/d, n*d=k^2*s. */
function sqrtRat(r){
  const m=r[0]*r[1];if(m>10n**12n)bad('INEQUALITY_NUMERIC_SCOPE');
  let rest=Number(m),k=1;
  for(let f=2;f*f<=rest;f++)while(rest%(f*f)===0){rest/=f*f;k*=f;}
  return {q:rat(BigInt(k),r[1]),s:BigInt(rest)};
}
/** Sign of x-y for numbers sharing one surd (or rational). */
function cmp(x,y){
  if(x.s!==1n&&y.s!==1n&&x.s!==y.s)bad('INEQUALITY_NUMERIC_SCOPE');
  const s=x.s!==1n?x.s:y.s,u=sub(x.p,y.p),w=sub(x.q,y.q),su=sgn(u),sw=sgn(w);
  if(sw===0||s===1n)return sgn(add(u,s===1n?w:ZERO));
  if(su===0||su===sw)return sw;
  const left=mul(u,u),right=mul(mul(w,w),[s,1n]),c=sgn(sub(left,right));
  return c>0?su:c<0?sw:0;
}
const approx=x=>Number(x.p[0])/Number(x.p[1])+Number(x.q[0])/Number(x.q[1])*Math.sqrt(Number(x.s));
function floorOf(x){let n=BigInt(Math.floor(approx(x)));const at=k=>real(rat(k));while(cmp(x,at(n))<0)n--;while(cmp(x,at(n+1n))>=0)n++;return n;}
/** x as (P+Q*sqrt(s))/R with integers, R>0. */
function integerForm(x){const R=x.p[1]*x.q[1]/gcd(x.p[1],x.q[1]);return {P:x.p[0]*(R/x.p[1]),Q:x.q[0]*(R/x.q[1]),R};}
/** The exact value text (phase2 exactValue grammar: integers, a/b, sqrt(...), + - * / and parentheses). */
export function valueText(x){
  if(x.s===1n)return x.p[1]===1n?String(x.p[0]):x.p[0]+'/'+x.p[1];
  const {P,Q,R}=integerForm(x),aq=Q<0n?-Q:Q,root=(aq===1n?'':aq+'*')+'sqrt('+x.s+')';
  const body=(P===0n?(Q<0n?'-':''):P+(Q<0n?'-':'+'))+root;
  return R===1n?body:'('+body+')/'+R;
}
/** The label TeX: fractions stacked (\frac, never a slash; labels are typeset in \displaystyle, so at full size), a leading minus outside. */
export function valueTex(x){
  if(x.s===1n){const [n,d]=x.p,an=n<0n?-n:n;return d===1n?String(n):(n<0n?'-':'')+'\\frac{'+an+'}{'+d+'}';}
  const {P,Q,R}=integerForm(x),aq=Q<0n?-Q:Q,root=(aq===1n?'':String(aq))+'\\sqrt{'+x.s+'}';
  if(R===1n)return (P===0n?(Q<0n?'-':''):P+(Q<0n?'-':'+'))+root;
  if(P<=0n&&Q<0n)return '-\\frac{'+(P===0n?'':(-P)+'+')+root+'}{'+R+'}';
  return '\\frac{'+(P===0n?(Q<0n?'-':''):P+(Q<0n?'-':'+'))+root+'}{'+R+'}';
}
/** Plain text an observer would read for the value (√ for the root, a/b for a fraction). */
const valuePlain=x=>valueText(x).replace(/\*?sqrt\((\d+)\)/g,'√$1');

// --- solving --------------------------------------------------------------------------------------------------------------------------------
const end=(v,closed)=>({v,closed});
function intersect(a,b){
  const lo=!a.lo?b.lo:!b.lo?a.lo:(c=>c>0?a.lo:c<0?b.lo:end(a.lo.v,a.lo.closed&&b.lo.closed))(cmp(a.lo.v,b.lo.v));
  const hi=!a.hi?b.hi:!b.hi?a.hi:(c=>c<0?a.hi:c>0?b.hi:end(a.hi.v,a.hi.closed&&b.hi.closed))(cmp(a.hi.v,b.hi.v));
  if(lo&&hi){const c=cmp(lo.v,hi.v);if(c>0||c===0&&!(lo.closed&&hi.closed))return null;}
  return {lo,hi};
}
const contains=(piece,x)=>(!piece.lo||(c=>c>0||c===0&&piece.lo.closed)(cmp(x,piece.lo.v)))&&(!piece.hi||(c=>c<0||c===0&&piece.hi.closed)(cmp(x,piece.hi.v)));
function checkVariable(value){
  const variable=value??'x';
  if(typeof variable!=='string'||!/^[a-xz]$/.test(variable))bad('INVALID_AXIS_VARIABLE');
  return variable;
}
function domainPiece(domain){
  if(domain===undefined)return {lo:null,hi:null};
  if(!domain||typeof domain!=='object'||Array.isArray(domain)||domain.kind!=='INTERVAL'||Object.keys(domain).some(key=>!['kind','range','states'].includes(key)))bad('INEQUALITY_DOMAIN_INVALID');
  const range=domain.range,states=domain.states??['CLOSED','CLOSED'];
  if(!Array.isArray(range)||range.length!==2||!Array.isArray(states)||states.length!==2||states.some(state=>state!=='OPEN'&&state!=='CLOSED')||range.every(value=>value===null))bad('INEQUALITY_DOMAIN_INVALID');
  const [lo,hi]=range.map((value,k)=>value===null?null:end(real(parseRat(value,'INEQUALITY_DOMAIN_INVALID')),states[k]==='CLOSED'));
  if(lo&&hi&&cmp(lo.v,hi.v)>=0)bad('INEQUALITY_DOMAIN_INVALID');
  return {lo,hi};
}
/**
 * Solve coefficients[0]+coefficients[1]v+coefficients[2]v^2 (comparator) 0 exactly, intersect it with the optional domain, adjoin the separately
 * checked values (each must close an open end of the set), and return the one interval it is (a bounded interval, a ray, one point or all reals)
 * with its integer points. Anything that is not one interval is refused with its code.
 */
export function solveQuadraticInequality(inequality){
  if(!inequality||typeof inequality!=='object'||Array.isArray(inequality)||Object.keys(inequality).some(key=>!['coefficients','comparator','variable','adjoinedPoints','integerPoints','domain'].includes(key)))bad('INEQUALITY_PLAN_INVALID');
  const variable=checkVariable(inequality.variable),comparator=inequality.comparator;
  if(!COMPARATORS.has(comparator))bad('INVALID_INEQUALITY_COMPARATOR');
  const values=inequality.coefficients;
  if(!Array.isArray(values)||values.length!==3)bad('INEQUALITY_NOT_QUADRATIC');
  let c=values.map(value=>parseRat(value,'INVALID_INEQUALITY_COEFFICIENT')),op=comparator;
  if(sgn(c[2])===0)bad('INEQUALITY_NOT_QUADRATIC');
  if(sgn(c[2])<0){c=c.map(value=>[-value[0],value[1]]);op=FLIP[op];}
  const D=sub(mul(c[1],c[1]),mul([4n,1n],mul(c[2],c[0]))),h=div([-c[1][0],c[1][1]],mul([2n,1n],c[2]));
  const closed=op.endsWith('=');let pieces;
  if(sgn(D)>0){
    const {q,s}=sqrtRat(D),w=div(q,mul([2n,1n],c[2])),r1=real(h,[-w[0],w[1]],s),r2=real(h,w,s);
    pieces=op[0]==='<'?[{lo:end(r1,closed),hi:end(r2,closed)}]:[{lo:null,hi:end(r1,closed)},{lo:end(r2,closed),hi:null}];
  }else if(sgn(D)===0){
    const r=real(h);
    pieces=op==='<'?[]:op==='<='?[{lo:end(r,true),hi:end(r,true)}]:op==='>'?[{lo:null,hi:end(r,false)},{lo:end(r,false),hi:null}]:[{lo:null,hi:null}];
  }else pieces=op[0]==='<'?[]:[{lo:null,hi:null}];
  const domain=domainPiece(inequality.domain);
  pieces=pieces.map(piece=>intersect(piece,domain)).filter(Boolean);
  const adjoined=inequality.adjoinedPoints??[];
  if(!Array.isArray(adjoined)||adjoined.length>2)bad('INEQUALITY_PLAN_INVALID');
  for(const text of adjoined){
    const x=real(parseRat(text,'INEQUALITY_ADJOINED_POINT_INVALID'));
    if(!contains(domain,x))bad('INEQUALITY_ADJOINED_POINT_OUTSIDE_DOMAIN');
    if(pieces.some(piece=>contains(piece,x)))continue;
    const open=pieces.flatMap(piece=>[piece.lo,piece.hi]).filter(e=>e&&!e.closed&&cmp(e.v,x)===0);
    if(open.length)open.forEach(e=>{e.closed=true;});
    else if(!pieces.length)pieces.push({lo:end(x,true),hi:end(x,true)});
    else bad('INEQUALITY_ADJOINED_POINT_NOT_ADJACENT');
  }
  // Two rays closed at one common point join into all reals.
  if(pieces.length===2&&pieces[0].hi&&pieces[1].lo&&cmp(pieces[0].hi.v,pieces[1].lo.v)===0&&(pieces[0].hi.closed||pieces[1].lo.closed))pieces=[{lo:pieces[0].lo,hi:pieces[1].hi}];
  if(!pieces.length)bad('INEQUALITY_SOLUTION_EMPTY');
  if(pieces.length>1)bad('INEQUALITY_SOLUTION_NOT_ONE_INTERVAL');
  const [piece]=pieces,kind=!piece.lo&&!piece.hi?'ALL_REALS':piece.lo&&piece.hi&&cmp(piece.lo.v,piece.hi.v)===0?'POINT':'INTERVAL';
  let integers=null;
  if(inequality.integerPoints!==undefined){
    let lo=piece.lo&&floorOf(piece.lo.v),hi=piece.hi&&floorOf(piece.hi.v)+1n;
    if(inequality.integerPoints===true){if(!piece.lo||!piece.hi)bad('INEQUALITY_INTEGER_POINTS_NEED_RANGE');}
    else{
      const range=inequality.integerPoints?.range;
      if(!inequality.integerPoints||typeof inequality.integerPoints!=='object'||Object.keys(inequality.integerPoints).join()!=='range'||!Array.isArray(range)||range.length!==2||range.some(value=>typeof value!=='string'||!/^-?\d{1,6}$/.test(value))||BigInt(range[0])>BigInt(range[1]))bad('INEQUALITY_INTEGER_POINTS_INVALID');
      lo=lo===null||BigInt(range[0])>lo?BigInt(range[0]):lo;hi=hi===null||BigInt(range[1])<hi?BigInt(range[1]):hi;
    }
    if(hi-lo>200n)bad('INEQUALITY_TOO_MANY_INTEGER_POINTS');
    integers=[];for(let n=lo;n<=hi;n++)if(contains(piece,real(rat(n))))integers.push(String(n));
    if(integers.length>MAX_INTEGER_POINTS)bad('INEQUALITY_TOO_MANY_INTEGER_POINTS');
  }
  const side=e=>e&&{value:valueText(e.v),tex:valueTex(e.v),text:valuePlain(e.v),state:e.closed?'CLOSED':'OPEN',approx:approx(e.v)};
  return {schemaVersion:SOLUTION_VERSION,variable,kind,lower:side(piece.lo),upper:kind==='POINT'?null:side(piece.hi),integers,discriminant:D[1]===1n?String(D[0]):D[0]+'/'+D[1]};
}

// --- the chain plan --------------------------------------------------------------------------------------------------------------------------
const CAPTION_MATH=/^[A-Za-z0-9=+\-<>.,()]{1,24}$/;
function caption(value,fallback){
  if(value===undefined)return fallback;
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!['math','text'].includes(key))||(!value.math&&!value.text)||(value.math!==undefined&&(typeof value.math!=='string'||!CAPTION_MATH.test(value.math)))||(value.text!==undefined&&(typeof value.text!=='string'||!value.text||value.text.length>24)))bad('CHAIN_CAPTION_INVALID');
  return value;
}
/**
 * {capability:'quadratic-inequality-chain-v1',inequality:{coefficients,comparator,variable?,adjoinedPoints?,integerPoints?,domain?},graphCaption?,
 * numberLineCaption?,caption,sourceConditions,newVisualInformation} -> the composite-panels-v1 plan it stands for: panel 1 the quadratic graph in the
 * inequality's variable with its real roots and vertex as key points, panel 2 the number line. The inequality is solved here first, so a plan whose
 * set is not one interval is refused before anything is drawn.
 */
export function expandInequalityChain(plan){
  if(plan?.capability!==CHAIN_CAPABILITY||!plan.inequality||typeof plan.inequality!=='object')bad('CHAIN_PLAN_INVALID');
  const allowed=['capability','inequality','graphCaption','numberLineCaption','caption','sourceConditions','newVisualInformation'];
  if(Object.keys(plan).some(key=>!allowed.includes(key)))bad('CHAIN_PLAN_INVALID');
  const solution=solveQuadraticInequality(plan.inequality),inequality=plan.inequality;
  const c=inequality.coefficients.map(value=>parseRat(value,'INVALID_INEQUALITY_COEFFICIENT'));
  const f=x=>add(add(c[0],mul(c[1],x)),mul(c[2],mul(x,x))),h=div([-c[1][0],c[1][1]],mul([2n,1n],c[2])),k=f(h);
  const D=sub(mul(c[1],c[1]),mul([4n,1n],mul(c[2],c[0])));
  // Key points: the real roots (A left, B right) and the vertex V (a double root is the vertex, A). A finite domain is drawn as the graph's source
  // interval and keeps only the key points it holds (none on an open end); a one-sided domain shows only on the number line.
  const domain=inequality.domain,finite=!!domain&&domain.range.every(value=>value!==null),piece=domainPiece(domain);
  const keys=[];
  if(sgn(D)>0){
    const {q,s}=sqrtRat(D),w=div(q,mul([2n,1n],c[2])),r1=real(h,[-w[0],w[1]],s),r2=real(h,w,s),[left,right]=cmp(r1,r2)<0?[r1,r2]:[r2,r1];
    keys.push(['A',left,real(ZERO)],['B',right,real(ZERO)]);
  }
  keys.push([sgn(D)===0?'A':'V',real(h),real(k)]);
  const isInt=x=>x.s===1n&&x.p[1]===1n,kept=keys.filter(([,x])=>!finite||contains(piece,x));
  const requiredPoints=kept.map(([id,x,y])=>({id,x:approx(x)||0,y:approx(y)||0}));
  const exactCoordinates=Object.fromEntries(kept.filter(([,x,y])=>!isInt(x)||!isInt(y)).map(([id,x,y])=>[id,[valueText(x),valueText(y)]]));
  const hx=approx(real(h)),graphPlan={family:'polynomial',coefficients:[...inequality.coefficients],domain:[hx-5,hx+5],viewport:[hx-6,hx+6,-10,10],
    sourceDomain:finite?{kind:'INTERVAL',range:[...domain.range],states:[...(domain.states??['CLOSED','CLOSED'])]}:{kind:'ALL_REALS'},requiredPoints,
    ...(Object.keys(exactCoordinates).length?{exactCoordinates}:{}),axisTickValues:{x:[],y:[]},...(solution.variable!=='x'?{axisVariable:solution.variable}:{})};
  return {capability:'composite-panels-v1',chain:CHAIN_CAPABILITY,
    panels:[{caption:caption(plan.graphCaption,{text:'이차함수의 그래프'}),plan:{capability:'polynomial-spike-v1',graphPlan}},
      {caption:caption(plan.numberLineCaption,{text:'해의 범위'}),plan:{capability:NUMBER_LINE_CAPABILITY,numberLine:inequality}}],
    caption:plan.caption,sourceConditions:plan.sourceConditions,newVisualInformation:plan.newVisualInformation};
}

// --- the number-line panel -------------------------------------------------------------------------------------------------------------------
// Layout in SVG units (width 512, the quadratic panel width). Rows from the top: safe margin, the interval header, the integer-point labels and dots
// (only with integerPoints), the axis with the solution band and end dots, the end/tick labels under the axis, safe margin.
export const NUMBER_LINE_WIDTH=512;
const SAFE=12,HEADER_ROW=52,INTEGER_LABEL_ROW=26,BELOW_ROW=48,AXIS_LEFT=32,ARROW_TIP=NUMBER_LINE_WIDTH-32-20,MAP_LEFT=AXIS_LEFT+14,MAP_RIGHT=ARROW_TIP-22;
const DISPLAY='\\displaystyle ';// every label TeX starts with it: a fraction is stacked at full size
const END_RADIUS=5,DOT_RADIUS=3.2,TICK_HALF=6,LABEL_GAP=5,ZERO_TICK_CLEARANCE=56;
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};
/** The panel height, known before any label is typeset (the stack is measured for its size first). */
export const numberLinePanelSize=model=>model?.schemaVersion===figure.FIGURE_MODEL_VERSION?figure.figurePanelSize(model):{width:NUMBER_LINE_WIDTH,height:axisRowY(model)+END_RADIUS+LABEL_GAP+BELOW_ROW+SAFE};
/** The exact model of a number-line panel's plan: a standalone figure (rows) or a quadratic inequality's solution set. */
export const solveNumberLine=numberLine=>Array.isArray(numberLine?.rows)?figure.solveNumberLineFigure(numberLine):solveQuadraticInequality(numberLine);
// Integer sizes (the Archive measures an integer intrinsic size): with integer points the dot row sits 22 above the axis, its labels above it.
const axisRowY=model=>SAFE+HEADER_ROW+(model.integers?.length?8+INTEGER_LABEL_ROW+4+Math.ceil(DOT_RADIUS)+22:24);
function headerOf(model){
  const v=model.variable,rel=e=>e.state==='CLOSED'?'\\le ':'<',relText=e=>e.state==='CLOSED'?'≤':'<';
  if(model.kind==='ALL_REALS')return {kind:'TEXT',text:'모든 실수',plain:'모든 실수'};
  if(model.kind==='POINT')return {kind:'MATH',tex:v+'='+model.lower.tex,plain:v+'='+model.lower.text};
  if(model.lower&&model.upper)return {kind:'MATH',tex:model.lower.tex+rel(model.lower)+v+rel(model.upper)+model.upper.tex,plain:model.lower.text+relText(model.lower)+v+relText(model.upper)+model.upper.text};
  if(model.lower)return {kind:'MATH',tex:v+(model.lower.state==='CLOSED'?'\\ge ':'>')+model.lower.tex,plain:v+(model.lower.state==='CLOSED'?'≥':'>')+model.lower.text};
  return {kind:'MATH',tex:v+(model.upper.state==='CLOSED'?'\\le ':'<')+model.upper.tex,plain:v+relText(model.upper)+model.upper.text};
}
/**
 * The number line the panel draws, from the plan and the solved model, before typesetting: the unit-to-px map, the axis, the band, every dot and tick,
 * and every label with its TeX and its anchor (labels are placed by their typeset size). Deterministic: the same plan and model give the same spec.
 */
export function numberLineSpec(plan,model){
  if(plan?.capability!==NUMBER_LINE_CAPABILITY||!plan.numberLine)bad('NUMBER_LINE_PLAN_INVALID');
  if(Array.isArray(plan.numberLine.rows))return figure.numberLineFigureSpec(plan,model);
  if(objectSha(solveQuadraticInequality(plan.numberLine))!==objectSha(model))bad('NUMBER_LINE_MODEL_MISMATCH');
  const ends=[model.lower,model.upper].filter(Boolean).map(e=>e.approx),ints=(model.integers??[]).map(Number);
  let lo,hi;
  if(model.kind==='ALL_REALS'){lo=-4;hi=4;}
  else if(model.kind==='POINT'){lo=ends[0]-2;hi=ends[0]+2;}
  else if(model.lower&&model.upper){const span=model.upper.approx-model.lower.approx,pad=Math.max(.6,.1*span);lo=model.lower.approx-pad;hi=model.upper.approx+pad;}
  else if(model.lower){lo=model.lower.approx-1.5;hi=model.lower.approx+4.5;}
  else{lo=model.upper.approx-4.5;hi=model.upper.approx+1.5;}
  if(ints.length){lo=Math.min(lo,Math.min(...ints)-.75);hi=Math.max(hi,Math.max(...ints)+.75);}
  const px=u=>r6(MAP_LEFT+(u-lo)/(hi-lo)*(MAP_RIGHT-MAP_LEFT)),axisY=axisRowY(model),dotY=axisY-22;
  const dots=[],ticks=[],labels=[];
  const header=headerOf(model);
  labels.push({id:'interval-header',role:'header',owner:'number-line',kind:header.kind,...(header.kind==='MATH'?{tex:DISPLAY+header.tex}:{text:header.text}),plain:header.plain,anchor:{x:NUMBER_LINE_WIDTH/2,y:SAFE+HEADER_ROW/2,align:'center'},rowHeight:HEADER_ROW});
  const endDot=(id,e)=>{dots.push({id,role:'endpoint',value:e.value,state:e.state,x:px(e.approx),y:axisY,r:END_RADIUS});labels.push({id:id+'-label',role:'endpoint',owner:id,kind:'MATH',tex:DISPLAY+e.tex,plain:e.text,value:e.value,anchor:{x:px(e.approx),y:r6(axisY+END_RADIUS+LABEL_GAP),align:'below'},rowHeight:BELOW_ROW});};
  if(model.kind==='POINT')endDot('endpoint-point',model.lower);
  else{if(model.lower)endDot('endpoint-lower',model.lower);if(model.upper)endDot('endpoint-upper',model.upper);}
  const band=model.kind==='POINT'?null:{x1:model.lower?px(model.lower.approx):AXIS_LEFT,x2:model.upper?px(model.upper.approx):ARROW_TIP-2,y:axisY,from:model.lower?.value??'-oo',to:model.upper?.value??'+oo'};
  // A 0 tick for orientation, only where it is clearly apart from every end (its label must never crowd an end label).
  const endsPx=dots.map(dot=>dot.x);
  if(lo<0&&0<hi&&!(model.lower?.value==='0'||model.upper?.value==='0')&&endsPx.every(x=>Math.abs(x-px(0))>=ZERO_TICK_CLEARANCE)){
    ticks.push({id:'tick-0',value:'0',x:px(0),y1:axisY-TICK_HALF,y2:axisY+TICK_HALF});
    labels.push({id:'tick-0-label',role:'tick',owner:'tick-0',kind:'MATH',tex:'0',plain:'0',value:'0',anchor:{x:px(0),y:r6(axisY+END_RADIUS+LABEL_GAP),align:'below'},rowHeight:BELOW_ROW});
  }
  // Every integer dot is labelled when neighbouring labels have room at a generous font (24 px: a digit 12, a minus 19); otherwise only the
  // smallest and the largest are, and the dots between them carry the count.
  const integers=model.integers??[],estimate=n=>12*n.replace('-','').length+(n.startsWith('-')?19:0);
  const integerLabels=integers.every((n,i)=>!i||px(Number(n))-px(Number(integers[i-1]))>=(estimate(n)+estimate(integers[i-1]))/2+4)?'ALL':'ENDS';
  for(const [i,n] of integers.entries()){
    const id='integer-'+n.replace('-','m');dots.push({id,role:'integer',value:n,state:'CLOSED',x:px(Number(n)),y:dotY,r:DOT_RADIUS});
    if(integerLabels==='ENDS'&&i&&i<integers.length-1)continue;
    labels.push({id:id+'-label',role:'integer',owner:id,kind:'MATH',tex:n,plain:n,value:n,anchor:{x:px(Number(n)),y:r6(dotY-DOT_RADIUS-4),align:'above'},rowHeight:INTEGER_LABEL_ROW});
  }
  labels.push({id:'axis-variable',role:'variable',owner:'x-axis',kind:'MATH',tex:model.variable,plain:model.variable,anchor:{x:ARROW_TIP+6,y:axisY,align:'right'},rowHeight:30});
  return {schemaVersion:SPEC_VERSION,size:numberLinePanelSize(model),map:{unitLeft:r6(lo),unitRight:r6(hi),pxLeft:MAP_LEFT,pxRight:MAP_RIGHT},axis:{x1:AXIS_LEFT,x2:ARROW_TIP,y:axisY},band,dots,ticks,labels,...(integers.length?{integerLabels}:{})};
}

class Stop extends Error{constructor(status,detail=null){super(status);this.status=status;this.detail=detail;}}
const isDomainCode=error=>error?.constructor===Error&&/^[A-Z][A-Z0-9_]*(?::|$)/.test(error.message);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const overlaps=(a,b)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height;

/**
 * Compose the number-line panel: typeset every label at the policy base font, place it at its anchor, refuse a label that does not fit its row or
 * that would touch another label (integer labels too dense, ends too close), build the SVG, run the independent number-line observer on the final
 * bytes and the rendered layout check in Chrome. Returns the same record shape as an L1 panel (no layout repairs: a panel that does not fit fails).
 */
export async function composeNumberLinePanel({plan,model,identity,typographyPolicy,browser}={}){
  if(Array.isArray(plan?.numberLine?.rows))return figure.composeNumberLineFigurePanel({plan,model,identity,typographyPolicy,browser});
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:NUMBER_LINE_SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false,qualification:'NOT_RUN'});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=numberLineSpec(plan,model);}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='NUMBER_LINE_MODEL_MISMATCH'?error.message:'NUMBER_LINE_SPEC_ERROR',{code:error.message});}
    lineage.specSha256=objectSha(spec);
    const typeset=typesetter(),font=typographyPolicy.baseFontPx,placed=[];
    for(const label of spec.labels){
      let fragment;
      try{fragment=typeset({id:label.id,owner:label.owner,factRole:label.role==='endpoint'||label.role==='header'||label.role==='integer'?'CONCLUSION':'DERIVED_INTERMEDIATE',fontPx:font,panelId:'number-line',...(label.kind==='MATH'?{kind:'MATH',tex:label.tex}:{kind:'TEXT',text:label.text})},identity);}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('NUMBER_LINE_TYPESET_ERROR',{labelId:label.id,code:error.message});}
      const {width,height}=fragment.intrinsic,{x,y,align}=label.anchor;
      if(height>label.rowHeight)throw new Stop('NUMBER_LINE_LABEL_TOO_LARGE',{labelId:label.id,height,rowHeight:label.rowHeight});
      const box={x:r6(align==='right'?x:x-width/2),y:r6(align==='below'?y:align==='above'?y-height:y-height/2),width,height};
      placed.push({label,fragment,box});
    }
    // Labels of one row never touch: integer labels need room between neighbours, end labels need room between the ends.
    for(let i=0;i<placed.length;i++)for(const other of placed.slice(i+1))if(overlaps(placed[i].box,other.box)){
      const roles=[placed[i].label.role,other.label.role];
      throw new Stop(roles.every(role=>role==='integer')?'NUMBER_LINE_INTEGER_POINTS_TOO_DENSE':'NUMBER_LINE_LABELS_TOO_CLOSE',{labels:[placed[i].label.id,other.label.id]});
    }
    lineage.fragmentSha256s=Object.fromEntries(placed.map(item=>[item.label.id,item.fragment.fragmentSha256]));
    const {width,height}=spec.size,{axis,band,map}=spec;
    let body=`<rect width="${width}" height="${height}" fill="#fff"/>`;
    body+=`<g data-layer="30"><line id="x-axis" data-role="axis" data-axis="x" stroke="#111" stroke-width="1.2" fill="none" x1="${axis.x1}" y1="${axis.y}" x2="${axis.x2-6}" y2="${axis.y}"/>`;
    body+=`<polygon id="axis-arrow" data-role="arrow" fill="#111" stroke="none" points="${axis.x2},${axis.y} ${axis.x2-9},${r6(axis.y-4)} ${axis.x2-9},${r6(axis.y+4)}"/></g>`;
    for(const tick of spec.ticks)body+=`<g data-layer="30"><line id="${tick.id}" data-role="tick" data-axis="x" data-value="${tick.value}" stroke="#111" stroke-width="1.2" fill="none" x1="${tick.x}" y1="${tick.y1}" x2="${tick.x}" y2="${tick.y2}"/></g>`;
    if(band)body+=`<g data-layer="40"><line id="solution-band" data-role="solution-band" data-from="${esc(band.from)}" data-to="${esc(band.to)}" stroke="#111" stroke-width="3.2" stroke-linecap="butt" fill="none" x1="${band.x1}" y1="${band.y}" x2="${band.x2}" y2="${band.y}"/></g>`;
    for(const dot of spec.dots){
      const open=dot.state==='OPEN';
      body+=`<g data-layer="70"><circle id="${dot.id}" data-role="point" data-dot="${dot.role}" data-value="${esc(dot.value)}" data-state="${dot.state}" stroke="#111" stroke-width="${open?1.6:.8}" fill="${open?'#fff':'#111'}" cx="${dot.x}" cy="${dot.y}" r="${dot.r}"/></g>`;
    }
    for(const {label,fragment,box} of placed){
      body+=`<g data-layer="90"><g id="${label.id}" data-label-kind="${label.role==='header'?'EQUATION_LABEL':'COORDINATE_LABEL'}" data-label-role="${label.role}" data-priority="0" data-font-px="${font}" data-owner="${label.owner}"${label.value!==undefined?` data-value="${esc(label.value)}"`:''}${label.kind==='MATH'?` data-tex="${esc(label.tex)}"`:` data-text="${esc(label.text)}"`} data-fragment-sha="${fragment.fragmentSha256}" transform="translate(${box.x} ${box.y})">${fragment.svg}</g></g>`;
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" data-number-line="${NUMBER_LINE_CAPABILITY}" data-variable="${model.variable}" data-unit-left="${map.unitLeft}" data-unit-right="${map.unitRight}" data-px-left="${map.pxLeft}" data-px-right="${map.pxRight}"${spec.integerLabels?` data-integer-labels="${spec.integerLabels}"`:''} data-publication-profile="fragment-publication-spike-v1" data-safe-margin="${SAFE}" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    // Opt-in diagnostic, as in L1: the panel beside its audit, so a person can see it (never read by any gate).
    if(process.env.APMS_DRAFT_DIR)(await import('node:fs')).writeFileSync(process.env.APMS_DRAFT_DIR+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-number-line-'+Date.now()+'.svg',svg);
    let response;
    try{response=await pythonWorker({numberLine:plan.numberLine,svg},{script:OBSERVER_SCRIPT});}catch(error){throw new Stop('WORKER_ERROR',{stage:'numberLineAudit',code:String(error?.message??error)});}
    if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'numberLineAudit',code:response?.result?.code??null});
    const audit=response.result;lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')throw new Stop('NUMBER_LINE_STATIC_AUDIT_FAIL',{errors});
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('NUMBER_LINE_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
/** The texts an observer reads on a number-line panel (for the inverse observation expectation). */
export const numberLineLabelTexts=spec=>spec.labels.map(label=>label.plain);
