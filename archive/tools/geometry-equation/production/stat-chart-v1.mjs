import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {Stop,isDomainCode,esc,overlaps} from './quadratic-inequality-chain-v1.mjs';

// A standalone statistics / probability figure (stat-chart-figure-v1): histogram, frequency polygon (also over a histogram), relative-frequency graph,
// stem-and-leaf plot, box plot, scatter plot, the 6x6 table of two dice and a probability tree. The author gives the data exactly (class boundaries and
// frequencies, values, branch probabilities); the engine derives every other number (class midpoints, polygon vertices with the zero-frequency end classes,
// relative frequencies, quartiles, sorted leaves, table cells, path probabilities) in exact arithmetic. stat_chart_observer.py re-derives all of it from the
// same plan with its own code and checks the final SVG bytes (the engine's own numbers are never trusted).
export const FIGURE_CAPABILITY='stat-chart-figure-v1';
export const MODEL_VERSION='STAT_CHART_MODEL_v1',SPEC_VERSION='STAT_CHART_SPEC_v1',SVG_VERSION='stat-chart-svg-v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('stat-chart-observer-worker.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const bad=code=>{throw Error(code);};
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const onlyKeys=(value,keys,code)=>{if(!isPlain(value)||Object.keys(value).some(key=>!keys.includes(key)))bad(code);};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};

// --- exact numbers: rationals [n,d] (BigInt, d>0, reduced) ---------------------------------------------------------------------------------
const gcdB=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};
const Q=(n,d=1n)=>{if(d<0n){n=-n;d=-d;}const g=gcdB(n,d)||1n;return [n/g,d/g];};
const ZERO=Q(0n),ONE=Q(1n);
const qadd=(a,b)=>Q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),qsub=(a,b)=>Q(a[0]*b[1]-b[0]*a[1],a[1]*b[1]),qmul=(a,b)=>Q(a[0]*b[0],a[1]*b[1]),qdiv=(a,b)=>Q(a[0]*b[1],a[1]*b[0]);
const qcmp=(a,b)=>{const x=a[0]*b[1]-b[0]*a[1];return x<0n?-1:x>0n?1:0;};
const qnum=a=>Number(a[0])/Number(a[1]);
const qceil=a=>{let q=a[0]/a[1];if(a[0]%a[1]!==0n&&a[0]>0n)q+=1n;return q;};
const qfloor=a=>{let q=a[0]/a[1];if(a[0]%a[1]!==0n&&a[0]<0n)q-=1n;return q;};
function parseQ(raw,code){
  const text=typeof raw==='number'&&Number.isSafeInteger(raw)?String(raw):raw;
  if(typeof text!=='string')bad(code);
  let m=/^(-?)(\d{1,12})(?:\.(\d{1,6}))?$/.exec(text);
  if(m){const frac=m[3]??'',n=BigInt(m[2]+frac),d=10n**BigInt(frac.length);return Q(m[1]?-n:n,d);}
  m=/^(-?)(\d{1,12})\/(\d{1,12})$/.exec(text);
  if(m&&BigInt(m[3])!==0n)return Q(m[1]?-BigInt(m[2]):BigInt(m[2]),BigInt(m[3]));
  return bad(code);
}
function decimalOf(a){
  let d=a[1],twos=0,fives=0;
  while(d%2n===0n){d/=2n;twos++;}while(d%5n===0n){d/=5n;fives++;}
  if(d!==1n)return null;
  const k=Math.max(twos,fives),n=a[0]*10n**BigInt(k)/a[1],neg=n<0n,abs=(neg?-n:n).toString().padStart(k+1,'0');
  return (neg?'-':'')+(k?abs.slice(0,-k)+'.'+abs.slice(-k):abs);
}
const qstr=a=>decimalOf(a)??`${a[0]}/${a[1]}`;
const qtex=a=>decimalOf(a)??`${a[0]<0n?'-':''}\\frac{${a[0]<0n?-a[0]:a[0]}}{${a[1]}}`;
const qfrac=a=>a[1]===1n?String(a[0]):`${a[0]<0n?'-':''}\\frac{${a[0]<0n?-a[0]:a[0]}}{${a[1]}}`;
const P=text=>parseQ(text,'STAT_MODEL_NUMBER_INVALID'),N=text=>qnum(P(text));
const titleText=(v,code,fallback)=>{if(v===undefined)return fallback;if(typeof v!=='string'||v.length<1||v.length>14||/[\u0000-\u001f<>&"\\]/.test(v))bad(code);return v;};
const intIn=(v,lo,hi,code)=>{if(!Number.isInteger(v)||v<lo||v>hi)bad(code);return v;};
const median=sorted=>{const n=sorted.length;return n%2?sorted[(n-1)/2]:qdiv(qadd(sorted[n/2-1],sorted[n/2]),Q(2n));};
/** The Korean curriculum quartiles: Q2 the median, Q1 the median of the lower half and Q3 of the upper half, the middle value excluded when n is odd. */
const fiveNumbers=sorted=>{const n=sorted.length,h=Math.floor(n/2);return {min:sorted[0],q1:median(sorted.slice(0,h)),median:median(sorted),q3:median(sorted.slice(n-h)),max:sorted[n-1]};};
const NICE=[1,2,5,10,20,50,100,200,500,1000,2000,5000];

// --- solving: the exact model --------------------------------------------------------------------------------------------------------------
export function solveStatChart(chart){
  if(!isPlain(chart))bad('STAT_CHART_PLAN_INVALID');
  switch(chart.kind){
    case 'HISTOGRAM':case 'FREQUENCY_POLYGON':return solveFreq(chart);
    case 'STEM_LEAF':return solveStem(chart);
    case 'BOX_PLOT':return solveBox(chart);
    case 'SCATTER':return solveScatter(chart);
    case 'DICE_TABLE':return solveDice(chart);
    case 'TREE':return solveTree(chart);
    default:return bad('STAT_KIND_UNSUPPORTED');
  }
}
function solveFreq(c){
  onlyKeys(c,['kind','boundaries','series','yKind','polygon','xTitle','yTitle','grid','showValues','highlightClasses','total'],'STAT_CHART_PLAN_INVALID');
  const polygonKind=c.kind==='FREQUENCY_POLYGON';
  if(!Array.isArray(c.boundaries)||c.boundaries.length<3||c.boundaries.length>13)bad('STAT_BOUNDARIES_INVALID');
  const b=c.boundaries.map(x=>parseQ(x,'STAT_BOUNDARIES_INVALID'));
  if(qcmp(b[0],ZERO)<0)bad('STAT_BOUNDARY_NEGATIVE');
  const width=qsub(b[1],b[0]);
  if(qcmp(width,ZERO)<=0)bad('STAT_BOUNDARIES_INVALID');
  for(let i=1;i<b.length;i++){const step=qsub(b[i],b[i-1]);if(qcmp(step,ZERO)<=0)bad('STAT_BOUNDARIES_INVALID');if(qcmp(step,width)!==0)bad('STAT_CLASS_WIDTH_UNEQUAL');}
  const n=b.length-1;
  if(!Array.isArray(c.series)||c.series.length<1||c.series.length>2)bad('STAT_SERIES_INVALID');
  if(!polygonKind&&c.series.length!==1)bad('STAT_HISTOGRAM_ONE_SERIES');
  if(polygonKind&&c.polygon!==undefined)bad('STAT_CHART_PLAN_INVALID');
  const anyRelative=c.series.some(s=>isPlain(s)&&s.relativeFrequencies!==undefined);
  const yKind=c.yKind===undefined?(anyRelative?'RELATIVE':'FREQUENCY'):c.yKind;
  if(yKind!=='FREQUENCY'&&yKind!=='RELATIVE')bad('STAT_Y_KIND_INVALID');
  if(yKind==='FREQUENCY'&&anyRelative)bad('STAT_SERIES_INVALID');
  if(c.total!==undefined&&c.series.length!==1)bad('STAT_SERIES_INVALID');
  const names=new Set();
  const series=c.series.map((s,i)=>{
    onlyKeys(s,['name','frequencies','relativeFrequencies','total'],'STAT_SERIES_INVALID');
    if((s.frequencies===undefined)===(s.relativeFrequencies===undefined))bad('STAT_SERIES_INVALID');
    if(c.series.length>1&&(typeof s.name!=='string'||!s.name))bad('STAT_SERIES_NAME_REQUIRED');
    const name=s.name===undefined?null:titleText(s.name,'STAT_SERIES_INVALID');
    if(name!==null){if(names.has(name))bad('STAT_SERIES_INVALID');names.add(name);}
    let freq=null,values,total=null;
    if(s.frequencies!==undefined){
      if(!Array.isArray(s.frequencies)||s.frequencies.length!==n)bad('STAT_FREQUENCY_COUNT_MISMATCH');
      freq=s.frequencies.map(f=>intIn(f,0,999,'STAT_FREQUENCY_INVALID'));
      total=freq.reduce((x,y)=>x+y,0);
      const given=s.total??(i===0?c.total:undefined);
      if(given!==undefined&&given!==total)bad('STAT_FREQUENCY_TOTAL_MISMATCH');
      if(yKind==='FREQUENCY')values=freq.map(f=>Q(BigInt(f)));
      else{if(total===0)bad('STAT_FREQUENCY_TOTAL_ZERO');values=freq.map(f=>Q(BigInt(f),BigInt(total)));}
    }else{
      if(s.total!==undefined||c.total!==undefined)bad('STAT_SERIES_INVALID');
      if(!Array.isArray(s.relativeFrequencies)||s.relativeFrequencies.length!==n)bad('STAT_FREQUENCY_COUNT_MISMATCH');
      values=s.relativeFrequencies.map(x=>{const v=parseQ(x,'STAT_FREQUENCY_INVALID');if(qcmp(v,ZERO)<0||qcmp(v,ONE)>0)bad('STAT_FREQUENCY_INVALID');return v;});
      if(qcmp(values.reduce(qadd,ZERO),ONE)!==0)bad('STAT_RELATIVE_SUM_NOT_ONE');
    }
    return {name,frequencies:freq,total,values};
  });
  const classes=[...Array(n).keys()].map(i=>({lo:b[i],hi:b[i+1],mid:qdiv(qadd(b[i],b[i+1]),Q(2n))}));
  const polygon=polygonKind||c.polygon===true;
  if(c.polygon!==undefined&&typeof c.polygon!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  let highlight=[];
  if(c.highlightClasses!==undefined){
    if(polygonKind||!Array.isArray(c.highlightClasses)||new Set(c.highlightClasses).size!==c.highlightClasses.length)bad('STAT_HIGHLIGHT_INVALID');
    highlight=c.highlightClasses.map(k=>intIn(k,0,n-1,'STAT_HIGHLIGHT_INVALID')).sort((x,y)=>x-y);
  }
  for(const k of ['grid','showValues'])if(c[k]!==undefined&&typeof c[k]!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  if(c.showValues&&series.length>1)bad('STAT_VALUES_NEED_ONE_SERIES');
  const maxV=series.flatMap(s=>s.values).reduce((x,y)=>qcmp(x,y)>=0?x:y);
  const steps=yKind==='FREQUENCY'?NICE.map(s=>Q(BigInt(s))):[Q(1n,100n),Q(1n,50n),Q(1n,20n),Q(1n,10n),Q(1n,5n),Q(1n,2n),Q(1n)];
  const step=steps.find(s=>qceil(qdiv(maxV,s))<=8n)??bad('STAT_Y_RANGE_TOO_LARGE');
  let top=qmul(step,Q(qceil(qdiv(maxV,step))));
  if(qcmp(top,maxV)===0)top=qadd(top,step);
  const ticks=[];for(let t=step;qcmp(t,top)<=0;t=qadd(t,step))ticks.push(qstr(t));
  return {schemaVersion:MODEL_VERSION,kind:c.kind,yKind,polygon,grid:c.grid===true,showValues:c.showValues===true,highlight,
    xTitle:titleText(c.xTitle,'STAT_TITLE_INVALID','계급'),yTitle:titleText(c.yTitle,'STAT_TITLE_INVALID',yKind==='FREQUENCY'?'도수(명)':'상대도수'),
    boundaries:b.map(qstr),width:qstr(width),classes:classes.map(k=>({lo:qstr(k.lo),hi:qstr(k.hi),mid:qstr(k.mid)})),
    series:series.map(s=>({name:s.name,frequencies:s.frequencies,total:s.total,values:s.values.map(qstr),
      vertices:[[qstr(qsub(classes[0].mid,width)),'0'],...classes.map((k,i)=>[qstr(k.mid),qstr(s.values[i])]),[qstr(qadd(classes[n-1].mid,width)),'0']]})),
    y:{step:qstr(step),top:qstr(top),ticks}};
}
function solveStem(c){
  onlyKeys(c,['kind','values','groups','unitText','title','key','marks'],'STAT_CHART_PLAN_INVALID');
  if((c.values===undefined)===(c.groups===undefined))bad('STAT_STEM_PLAN_INVALID');
  const raw=c.values!==undefined?[{values:c.values}]:c.groups;
  if(!Array.isArray(raw)||raw.length<1||raw.length>2)bad('STAT_STEM_PLAN_INVALID');
  const groups=raw.map(g=>{
    onlyKeys(g,['name','values'],'STAT_STEM_PLAN_INVALID');
    if(!Array.isArray(g.values)||g.values.length<1||g.values.length>60)bad('STAT_STEM_PLAN_INVALID');
    const values=g.values.map(v=>intIn(v,0,999,'STAT_STEM_VALUE_INVALID')).sort((x,y)=>x-y);
    return {name:g.name===undefined?null:titleText(g.name,'STAT_STEM_PLAN_INVALID'),values};
  });
  if(raw.length===2&&groups.some(g=>!g.name))bad('STAT_SERIES_NAME_REQUIRED');
  const all=groups.flatMap(g=>g.values),lo=Math.floor(Math.min(...all)/10),hi=Math.floor(Math.max(...all)/10);
  if(hi-lo>11)bad('STAT_STEM_TOO_MANY_STEMS');
  const stems=[];for(let s=lo;s<=hi;s++)stems.push(s);
  const unitText=c.unitText===undefined?'':titleText(c.unitText,'STAT_TITLE_INVALID','');
  const title=c.title===undefined?null:titleText(c.title,'STAT_TITLE_INVALID',null);
  let key=null;
  const first=groups[0].values[0];
  if(c.key!==undefined){
    onlyKeys(c.key,['stem','leaf'],'STAT_STEM_KEY_INVALID');
    const value=intIn(c.key.stem,0,99,'STAT_STEM_KEY_INVALID')*10+intIn(c.key.leaf,0,9,'STAT_STEM_KEY_INVALID');
    if(!all.includes(value))bad('STAT_STEM_KEY_NOT_IN_DATA');
    key={stem:c.key.stem,leaf:c.key.leaf};
  }else key={stem:Math.floor(first/10),leaf:first%10};
  key.value=key.stem*10+key.leaf;key.text=`${key.stem} | ${key.leaf}은 ${key.value}${unitText}`;
  const marks=[];
  if(c.marks!==undefined){
    if(!Array.isArray(c.marks)||c.marks.length>4)bad('STAT_STEM_MARK_INVALID');
    for(const m of c.marks){
      onlyKeys(m,['group','ranks','median'],'STAT_STEM_MARK_INVALID');
      const gi=m.group===undefined?0:intIn(m.group,0,groups.length-1,'STAT_STEM_MARK_INVALID'),n=groups[gi].values.length;
      if((m.ranks===undefined)===(m.median===undefined))bad('STAT_STEM_MARK_INVALID');
      const ranks=m.median===true?(n%2?[(n+1)/2]:[n/2,n/2+1]):(Array.isArray(m.ranks)&&m.ranks.length>=1&&m.ranks.length<=4?m.ranks.map(r=>intIn(r,1,n,'STAT_STEM_MARK_INVALID')):bad('STAT_STEM_MARK_INVALID'));
      for(const rank of ranks){if(marks.some(x=>x.group===gi&&x.rank===rank))bad('STAT_STEM_MARK_INVALID');marks.push({group:gi,rank,value:groups[gi].values[rank-1]});}
    }
  }
  return {schemaVersion:MODEL_VERSION,kind:'STEM_LEAF',title,unitText,key,stems,marks,
    groups:groups.map(g=>({name:g.name,n:g.values.length,sorted:g.values,median:qstr(median(g.values.map(v=>Q(BigInt(v))))),
      rows:stems.map(s=>({stem:s,leaves:g.values.filter(v=>Math.floor(v/10)===s).map(v=>v%10)}))}))};
}
function solveBox(c){
  onlyKeys(c,['kind','series','xTitle','step','showValues'],'STAT_CHART_PLAN_INVALID');
  if(!Array.isArray(c.series)||c.series.length<1||c.series.length>3)bad('STAT_SERIES_INVALID');
  const names=new Set();
  const series=c.series.map(s=>{
    onlyKeys(s,['name','values','summary'],'STAT_SERIES_INVALID');
    if((s.values===undefined)===(s.summary===undefined))bad('STAT_SERIES_INVALID');
    if(c.series.length>1&&!s.name)bad('STAT_SERIES_NAME_REQUIRED');
    const name=s.name===undefined?null:titleText(s.name,'STAT_SERIES_INVALID');
    if(name!==null){if(names.has(name))bad('STAT_SERIES_INVALID');names.add(name);}
    let five,n=null;
    if(s.values!==undefined){
      if(!Array.isArray(s.values)||s.values.length<4||s.values.length>60)bad('STAT_BOX_NEEDS_FOUR_VALUES');
      const sorted=s.values.map(v=>parseQ(v,'STAT_BOX_VALUE_INVALID')).sort(qcmp);n=sorted.length;five=fiveNumbers(sorted);
    }else{
      onlyKeys(s.summary,['min','q1','median','q3','max'],'STAT_BOX_SUMMARY_INVALID');
      five=Object.fromEntries(['min','q1','median','q3','max'].map(k=>[k,parseQ(s.summary[k],'STAT_BOX_SUMMARY_INVALID')]));
      const o=['min','q1','median','q3','max'];
      for(let i=1;i<o.length;i++)if(qcmp(five[o[i]],five[o[i-1]])<0)bad('STAT_BOX_SUMMARY_NOT_ORDERED');
    }
    if(qcmp(five.min,ZERO)<0)bad('STAT_VALUE_NEGATIVE');
    return {name,n,five};
  });
  const lo=series.map(s=>s.five.min).reduce((x,y)=>qcmp(x,y)<=0?x:y),hi=series.map(s=>s.five.max).reduce((x,y)=>qcmp(x,y)>=0?x:y);
  const step=c.step!==undefined?parseQ(c.step,'STAT_STEP_INVALID'):(()=>{const span=qsub(hi,lo);return Q(BigInt(NICE.find(s=>qceil(qdiv(span,Q(BigInt(s))))<=10n)??bad('STAT_RANGE_TOO_LARGE')));})();
  if(qcmp(step,ZERO)<=0)bad('STAT_STEP_INVALID');
  const tickLo=qmul(step,Q(qfloor(qdiv(lo,step)))),tickHi=qmul(step,Q(qceil(qdiv(hi,step))));
  const ticks=[];for(let t=tickLo;qcmp(t,tickHi)<=0;t=qadd(t,step)){ticks.push(qstr(t));if(ticks.length>14)bad('STAT_RANGE_TOO_LARGE');}
  if(c.showValues!==undefined&&typeof c.showValues!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  return {schemaVersion:MODEL_VERSION,kind:'BOX_PLOT',xTitle:titleText(c.xTitle,'STAT_TITLE_INVALID',''),showValues:c.showValues===true,step:qstr(step),ticks,
    series:series.map(s=>({name:s.name,n:s.n,five:Object.fromEntries(Object.entries(s.five).map(([k,v])=>[k,qstr(v)]))}))};
}
function solveScatter(c){
  onlyKeys(c,['kind','points','xRange','yRange','xStep','yStep','labelEvery','xTitle','yTitle','grid','diagonal'],'STAT_CHART_PLAN_INVALID');
  if(!Array.isArray(c.points)||c.points.length<1||c.points.length>40)bad('STAT_SCATTER_POINTS_INVALID');
  const range=(r,code)=>{if(!Array.isArray(r)||r.length!==2)bad(code);const x=r.map(v=>parseQ(v,code));if(qcmp(x[0],ZERO)<0||qcmp(x[0],x[1])>=0)bad(code);return x;};
  const xr=range(c.xRange,'STAT_RANGE_INVALID'),yr=range(c.yRange,'STAT_RANGE_INVALID');
  const stepOf=(raw,r)=>{
    const s=raw!==undefined?parseQ(raw,'STAT_STEP_INVALID'):Q(BigInt(NICE.find(k=>qceil(qdiv(qsub(r[1],r[0]),Q(BigInt(k))))<=10n)??bad('STAT_RANGE_TOO_LARGE')));
    if(qcmp(s,ZERO)<=0)bad('STAT_STEP_INVALID');
    if(qcmp(qmul(Q(qfloor(qdiv(r[0],s))),s),r[0])!==0||qcmp(qmul(Q(qfloor(qdiv(r[1],s))),s),r[1])!==0)bad('STAT_RANGE_NOT_ON_STEP');
    if(qceil(qdiv(qsub(r[1],r[0]),s))>20n)bad('STAT_RANGE_TOO_LARGE');
    return s;
  };
  const xs=stepOf(c.xStep,xr),ys=stepOf(c.yStep,yr);
  const names=new Set();
  const points=c.points.map(p=>{
    onlyKeys(p,['x','y','name'],'STAT_SCATTER_POINTS_INVALID');
    const x=parseQ(p.x,'STAT_SCATTER_POINTS_INVALID'),y=parseQ(p.y,'STAT_SCATTER_POINTS_INVALID');
    if(qcmp(x,xr[0])<0||qcmp(x,xr[1])>0||qcmp(y,yr[0])<0||qcmp(y,yr[1])>0)bad('STAT_POINT_OUTSIDE_RANGE');
    if(p.name!==undefined){if(typeof p.name!=='string'||!/^[A-Z][0-9']?$/.test(p.name)||names.has(p.name))bad('STAT_SCATTER_POINTS_INVALID');names.add(p.name);}
    return {x,y,name:p.name??null};
  });
  const every=c.labelEvery===undefined?1:intIn(c.labelEvery,1,10,'STAT_LABEL_EVERY_INVALID');
  for(const k of ['grid','diagonal'])if(c[k]!==undefined&&typeof c[k]!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  return {schemaVersion:MODEL_VERSION,kind:'SCATTER',xRange:xr.map(qstr),yRange:yr.map(qstr),xStep:qstr(xs),yStep:qstr(ys),labelEvery:every,grid:c.grid!==false,diagonal:c.diagonal===true,
    xTitle:titleText(c.xTitle,'STAT_TITLE_INVALID',''),yTitle:titleText(c.yTitle,'STAT_TITLE_INVALID',''),
    points:points.map(p=>({x:qstr(p.x),y:qstr(p.y),name:p.name,onDiagonal:qcmp(p.x,p.y)===0})),onDiagonal:points.filter(p=>qcmp(p.x,p.y)===0).length};
}
// The dice predicate: a small expression grammar (integers, the two die letters, + - *, parentheses) compared to numbers; any/all/not combine.
function exprTokens(text){
  const tokens=text.replace(/\s+/g,'').match(/\d+|[a-z]|[+\-*()]/g)||[];
  if(tokens.join('')!==text.replace(/\s+/g,''))bad('STAT_DICE_EXPR_INVALID');
  return tokens;
}
function exprEval(text,vars,env){
  const tokens=exprTokens(text);let i=0;
  const peek=()=>tokens[i],take=()=>tokens[i++];
  const factor=()=>{const t=take();
    if(t==='-')return -factor();
    if(t==='(' ){const v=expr();if(take()!==')')bad('STAT_DICE_EXPR_INVALID');return v;}
    if(/^\d+$/.test(t??''))return Number(t);
    if(vars.includes(t))return env[t];
    return bad('STAT_DICE_EXPR_INVALID');};
  const term=()=>{let v=factor();while(peek()==='*'){take();v*=factor();}return v;};
  const expr=()=>{let v=term();while(peek()==='+'||peek()==='-'){const op=take(),w=term();v=op==='+'?v+w:v-w;}return v;};
  const value=expr();if(i!==tokens.length)bad('STAT_DICE_EXPR_INVALID');
  return value;
}
function checkPredicate(p,vars,depth=0,count={n:0}){
  if(!isPlain(p)||depth>3||++count.n>8)bad('STAT_DICE_PREDICATE_INVALID');
  const keys=Object.keys(p);
  if(keys.length===1&&(keys[0]==='any'||keys[0]==='all')){
    if(!Array.isArray(p[keys[0]])||p[keys[0]].length<2)bad('STAT_DICE_PREDICATE_INVALID');
    p[keys[0]].forEach(x=>checkPredicate(x,vars,depth+1,count));return;
  }
  if(keys.length===1&&keys[0]==='not'){checkPredicate(p.not,vars,depth+1,count);return;}
  if(typeof p.expr!=='string')bad('STAT_DICE_PREDICATE_INVALID');
  exprEval(p.expr,vars,Object.fromEntries(vars.map(v=>[v,1])));
  if(Object.keys(p).sort().join()==='expr,in'){if(!Array.isArray(p.in)||!p.in.length||p.in.some(v=>!/^-?\d{1,4}$/.test(String(v))))bad('STAT_DICE_PREDICATE_INVALID');return;}
  if(Object.keys(p).sort().join()==='cmp,expr,value'&&['=','<','<=','>','>='].includes(p.cmp)&&/^-?\d{1,4}$/.test(String(p.value)))return;
  bad('STAT_DICE_PREDICATE_INVALID');
}
function predicate(p,vars,env){
  if(p.any)return p.any.some(x=>predicate(x,vars,env));
  if(p.all)return p.all.every(x=>predicate(x,vars,env));
  if(p.not)return !predicate(p.not,vars,env);
  const v=exprEval(p.expr,vars,env);
  if(p.in)return p.in.map(Number).includes(v);
  const w=Number(p.value);
  return {'=':v===w,'<':v<w,'<=':v<=w,'>':v>w,'>=':v>=w}[p.cmp];
}
function solveDice(c){
  onlyKeys(c,['kind','faces','cell','highlight','colVar','rowVar'],'STAT_CHART_PLAN_INVALID');
  const faces=c.faces===undefined?6:intIn(c.faces,2,8,'STAT_DICE_FACES_INVALID');
  const cell=c.cell===undefined?'PAIR':c.cell;
  if(!['PAIR','SUM','PRODUCT','NONE'].includes(cell))bad('STAT_DICE_CELL_INVALID');
  const colVar=c.colVar??'a',rowVar=c.rowVar??'b';
  if(!/^[a-z]$/.test(colVar)||!/^[a-z]$/.test(rowVar)||colVar===rowVar)bad('STAT_DICE_VARIABLE_INVALID');
  if(c.highlight!==undefined)checkPredicate(c.highlight,[colVar,rowVar]);
  const cells=[];
  for(let r=1;r<=faces;r++)for(let k=1;k<=faces;k++){
    const env={[colVar]:k,[rowVar]:r};
    cells.push({col:k,row:r,text:cell==='PAIR'?`(${k},${r})`:cell==='SUM'?String(k+r):cell==='PRODUCT'?String(k*r):'',highlighted:c.highlight===undefined?false:predicate(c.highlight,[colVar,rowVar],env)});
  }
  return {schemaVersion:MODEL_VERSION,kind:'DICE_TABLE',faces,cell,colVar,rowVar,highlight:c.highlight??null,cells,highlightedCount:cells.filter(x=>x.highlighted).length,total:faces*faces};
}
function solveTree(c){
  onlyKeys(c,['kind','root','showPathProbability'],'STAT_CHART_PLAN_INVALID');
  if(c.showPathProbability!==undefined&&typeof c.showPathProbability!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  onlyKeys(c.root,['label','children'],'STAT_TREE_INVALID');
  const nodes=[];
  const lab=v=>{if(typeof v!=='string'||v.length<1||v.length>6||/[\u0000-\u001f<>&"\\]/.test(v))bad('STAT_TREE_LABEL_INVALID');return v;};
  const walk=(raw,id,parent,depth,p)=>{
    if(depth>3)bad('STAT_TREE_TOO_DEEP');
    const node={id,parent,depth,label:parent===null?(raw.label===undefined?null:lab(raw.label)):lab(raw.label),p:p===null?null:p,children:[]};
    nodes.push(node);
    if(raw.children!==undefined){
      if(!Array.isArray(raw.children)||raw.children.length<2||raw.children.length>5)bad('STAT_TREE_INVALID');
      const given=raw.children.map(ch=>{onlyKeys(ch,['label','p','children'],'STAT_TREE_INVALID');return ch.p!==undefined;});
      if(given.some(g=>g!==given[0]))bad('STAT_TREE_PROBABILITY_MIXED');
      const ps=given[0]?raw.children.map(ch=>{const v=parseQ(ch.p,'STAT_TREE_PROBABILITY_INVALID');if(qcmp(v,ZERO)<=0||qcmp(v,ONE)>0)bad('STAT_TREE_PROBABILITY_INVALID');return v;}):raw.children.map(()=>null);
      if(given[0]&&qcmp(ps.reduce(qadd,ZERO),ONE)!==0)bad('STAT_TREE_BRANCH_PROBABILITY_SUM');
      raw.children.forEach((ch,i)=>{node.children.push(id+'.'+(i+1));walk(ch,id+'.'+(i+1),id,depth+1,ps[i]);});
    }
  };
  walk(c.root,'n0',null,0,null);
  const leaves=nodes.filter(n=>!n.children.length);
  if(leaves.length>12||nodes.length<3)bad(nodes.length<3?'STAT_TREE_INVALID':'STAT_TREE_TOO_LARGE');
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const withP=nodes.filter(n=>n.parent!==null);
  const hasP=withP.some(n=>n.p!==null);
  if(withP.some(n=>(n.p!==null)!==hasP))bad('STAT_TREE_PROBABILITY_MIXED');
  if(c.showPathProbability===true&&!hasP)bad('STAT_TREE_PATH_NEEDS_PROBABILITIES');
  for(const n of nodes){n.path=n.parent===null?ONE:(hasP?qmul(byId.get(n.parent).path,n.p):null);}
  // every leaf at the same depth is not required, but the path probabilities of the leaves must add up to 1.
  if(hasP&&qcmp(leaves.map(n=>n.path).reduce(qadd,ZERO),ONE)!==0)bad('STAT_TREE_BRANCH_PROBABILITY_SUM');
  return {schemaVersion:MODEL_VERSION,kind:'TREE',showPathProbability:c.showPathProbability===true,hasProbabilities:hasP,maxDepth:Math.max(...nodes.map(n=>n.depth)),
    nodes:nodes.map(n=>({id:n.id,parent:n.parent,depth:n.depth,label:n.label,p:n.p&&qstr(n.p),path:hasP&&!n.children.length?qstr(n.path):null,children:n.children})),leaves:leaves.map(n=>n.id)};
}

// --- geometry shared by the charts -------------------------------------------------------------------------------------------------------
const W=548,SAFE=12,MAPL=76,MAPR=422,ARROW_TIP=434,TITLE_X=442,AXIS_TOP=54,TICK=5,LABEL_BELOW=34;
const STYLE={
  axis:'stroke="#111" stroke-width="1.2" fill="none"',tick:'stroke="#111" stroke-width="1.2" fill="none"',grid:'stroke="#b4b4b4" stroke-width="0.8" fill="none" stroke-dasharray="3 3"',
  arrow:'fill="#111" stroke="none"',bar:'fill="#ececec" stroke="#111" stroke-width="1.2"',barHi:'fill="#b5b5b5" stroke="#111" stroke-width="1.2"',
  poly0:'stroke="#111" stroke-width="2" fill="none"',poly1:'stroke="#111" stroke-width="2" fill="none" stroke-dasharray="7 4"',dot:'fill="#111" stroke="none"',
  brk:'stroke="#111" stroke-width="1.2" fill="none"',frame:'fill="none" stroke="#111" stroke-width="1.2"',rule:'stroke="#111" stroke-width="1.2" fill="none"',
  mark:'fill="none" stroke="#111" stroke-width="1.8"',box:'fill="#ececec" stroke="#111" stroke-width="1.4"',median:'stroke="#111" stroke-width="3" fill="none"',
  whisker:'stroke="#111" stroke-width="1.4" fill="none"',cell:'fill="#fff" stroke="#111" stroke-width="1"',cellHi:'fill="#c9c9c9" stroke="#111" stroke-width="1"',
  head:'fill="#f1f1f1" stroke="#111" stroke-width="1"',diag:'stroke="#555" stroke-width="1.2" fill="none" stroke-dasharray="6 4"',branch:'stroke="#111" stroke-width="1.4" fill="none"',
  legend0:'stroke="#111" stroke-width="2" fill="none"',legend1:'stroke="#111" stroke-width="2" fill="none" stroke-dasharray="7 4"',diagonal:'stroke="#555" stroke-width="1.2" fill="none" stroke-dasharray="6 4"'
};
const L=(id,role,cls,x1,y1,x2,y2,data={},layer=30)=>({t:'line',id,role,cls,x1:r6(x1),y1:r6(y1),x2:r6(x2),y2:r6(y2),data,layer});
const rect=(id,role,cls,x,y,width,height,data={},layer=40)=>({t:'rect',id,role,cls,x:r6(x),y:r6(y),width:r6(width),height:r6(height),data,layer});
const DISPLAY='\\displaystyle ';
const math=(id,role,owner,tex,plain,ax,ay,x,y,extra={})=>({id,role,owner,kind:'MATH',tex,plain,anchor:{x:r6(x),y:r6(y),ax,ay},extra});
const textLabel=(id,role,owner,text,ax,ay,x,y,extra={})=>({id,role,owner,kind:'TEXT',text,plain:text,anchor:{x:r6(x),y:r6(y),ax,ay},extra});
function arrows(prims,{xStartPx,yAxisPx,base,tipX=ARROW_TIP,tipY=AXIS_TOP}){
  prims.push(L('x-axis','axis','axis',xStartPx,base,tipX-8,base,{axis:'x'}));
  prims.push({t:'polygon',id:'x-axis-arrow',role:'arrow',cls:'arrow',points:[[tipX,base],[tipX-9,base-4],[tipX-9,base+4]],data:{},layer:30});
  if(yAxisPx!==null){
    prims.push(L('y-axis','axis','axis',yAxisPx,base,yAxisPx,tipY+8,{axis:'y'}));
    prims.push({t:'polygon',id:'y-axis-arrow',role:'arrow',cls:'arrow',points:[[yAxisPx,tipY],[yAxisPx-4,tipY+9],[yAxisPx+4,tipY+9]],data:{},layer:30});
  }
}
const breakMark=(prims,axis,x,y)=>{
  if(axis==='x'){prims.push(L('x-axis-break-1','axis-break','brk',x-5,y+5,x-1,y-5,{axis:'x'}),L('x-axis-break-2','axis-break','brk',x+1,y+5,x+5,y-5,{axis:'x'}));}
  else prims.push(L('y-axis-break-1','axis-break','brk',x-5,y+1,x+5,y-3,{axis:'y'}),L('y-axis-break-2','axis-break','brk',x-5,y+5,x+5,y+1,{axis:'y'}));
};

// --- the charts: spec = ordered primitives + labels at anchors (positions need no label widths; the tree's branch ends are placed when labels are typeset) --------
function freqSpec(m){
  const n=m.classes.length,w=N(m.width),b0=N(m.boundaries[0]),bn=N(m.boundaries[n]),poly=m.kind==='FREQUENCY_POLYGON'||m.polygon;
  let lowU,yAxisU,breakU=null;
  if(b0===0){lowU=poly?-.75*w:0;yAxisU=0;}else{lowU=b0-(poly?1.2:.8)*w;yAxisU=lowU;breakU=lowU+.3*w;}
  const highU=bn+(poly?.8:.45)*w,PLOT_H=210,PT=AXIS_TOP+18,BASE=PT+PLOT_H,H=BASE+TICK+4+LABEL_BELOW+SAFE;
  const px=u=>r6(MAPL+(u-lowU)/(highU-lowU)*(MAPR-MAPL)),T=N(m.y.top),py=v=>r6(BASE-v/T*PLOT_H),yAxisPx=px(yAxisU);
  const prims=[],labels=[];
  const ys=m.y.ticks.map(t=>({t,v:N(t)}));
  if(m.grid){
    const gx2=px(bn+(poly?.5*w:0));
    for(const {t,v} of ys)prims.push(L(`grid-y-${t}`,'grid','grid',yAxisPx,py(v),gx2,py(v),{value:t},20));
    for(const [i,bb] of m.boundaries.entries())if(i>0)prims.push(L(`grid-x-${i}`,'grid','grid',px(N(bb)),BASE,px(N(bb)),PT,{value:bb},20));
  }
  if(m.kind==='HISTOGRAM')for(const [i,k] of m.classes.entries()){
    const v=N(m.series[0].values[i]);
    prims.push(rect(`bar-s0-${i}`,'bar',m.highlight.includes(i)?'barHi':'bar',px(N(k.lo)),py(v),px(N(k.hi))-px(N(k.lo)),BASE-py(v),{series:0,class:i,highlight:m.highlight.includes(i)?1:0},40));
  }
  arrows(prims,{xStartPx:px(lowU),yAxisPx,base:BASE});
  if(breakU!==null)breakMark(prims,'x',px(breakU),BASE);
  for(const [i,bb] of m.boundaries.entries()){
    const x=px(N(bb));
    prims.push(L(`x-tick-${i}`,'x-tick','tick',x,BASE,x,BASE+TICK,{axis:'x',value:bb}));
    labels.push(math(`x-tick-${i}-label`,'x-tick',`x-tick-${i}`,DISPLAY+qtex(P(bb)),bb,'center','top',x,BASE+TICK+4,{value:bb}));
  }
  for(const {t,v} of ys){
    prims.push(L(`y-tick-${t.replace('/','_')}`,'y-tick','tick',yAxisPx-TICK,py(v),yAxisPx,py(v),{axis:'y',value:t}));
    labels.push(math(`y-tick-${t.replace('/','_')}-label`,'y-tick',`y-tick-${t.replace('/','_')}`,DISPLAY+qtex(P(t)),t,'end','middle',yAxisPx-TICK-4,py(v),{value:t}));
  }
  if(breakU!==null)labels.push(math('origin','origin','x-axis','O','O','end','top',yAxisPx-6,BASE+4));
  labels.push(textLabel('x-title','axis-title','x-axis',m.xTitle,'start','middle',TITLE_X,BASE));
  labels.push(textLabel('y-title','axis-title','y-axis',m.yTitle,'center','bottom',yAxisPx,AXIS_TOP-4));
  if(poly)for(const [s,sr] of m.series.entries()){
    const pts=sr.vertices.map(([x,y])=>[px(N(x)),py(N(y))]);
    prims.push({t:'polyline',id:`polygon-s${s}`,role:'polygon',cls:'poly'+s,points:pts,data:{series:s},layer:50});
    sr.vertices.forEach(([x,y],k)=>prims.push({t:'circle',id:`vertex-s${s}-${k}`,role:'point',cls:'dot',cx:pts[k][0],cy:pts[k][1],r:3.2,data:{series:s,vertex:k},layer:70}));
  }
  if(m.showValues)for(const [i,k] of m.classes.entries()){
    const v=m.series[0].values[i];if(N(v)===0)continue;
    labels.push(math(`value-${i}`,'value',m.kind==='HISTOGRAM'&&!poly?`bar-s0-${i}`:`vertex-s0-${i+1}`,DISPLAY+qtex(P(v)),v,'center','bottom',px(N(k.mid)),py(N(v))-(poly?9:4),{value:v,class:i}));
  }
  if(m.series.length>1)for(const [s,sr] of m.series.entries()){
    const y=PT+14+s*30;
    prims.push(L(`legend-line-${s}`,'legend-line','legend'+s,TITLE_X,y,TITLE_X+20,y,{series:s}));
    labels.push(textLabel(`legend-${s}`,'legend',`legend-line-${s}`,sr.name,'start','middle',TITLE_X+27,y,{series:s}));
  }
  return {size:{width:W,height:H},prims,labels};
}
function stemSpec(m){
  const two=m.groups.length===2,PITCH=24,STEMW=48,PAD=14,HEAD_H=34,ROW_H=30,X0=SAFE+6;
  const maxLeaves=Math.max(1,...m.groups.flatMap(g=>g.rows.map(r=>r.leaves.length)));
  const leafW=maxLeaves*PITCH+PAD,tableW=(two?2*leafW:leafW)+STEMW,top=SAFE+(m.title?34:0)+2;
  const rows=m.stems.length,bottom=top+HEAD_H+rows*ROW_H,width=Math.max(Math.ceil(tableW+2*X0),230),x0=r6((width-tableW)/2);
  const prims=[],labels=[];
  prims.push(rect('table-frame','frame','frame',x0,top,tableW,bottom-top,{},20));
  prims.push(L('header-rule','rule','rule',x0,top+HEAD_H,x0+tableW,top+HEAD_H,{}));
  const sepL=two?x0+leafW:x0+STEMW,sepR=x0+leafW+STEMW;
  prims.push(L('stem-rule-1','rule','rule',sepL,top,sepL,bottom,{}));
  if(two)prims.push(L('stem-rule-2','rule','rule',sepR,top,sepR,bottom,{}));
  const stemCx=two?x0+leafW+STEMW/2:x0+STEMW/2;
  labels.push(textLabel('head-stem','header','table-frame','줄기','center','middle',stemCx,top+HEAD_H/2,{}));
  if(two){
    labels.push(textLabel('head-g0','header','table-frame',m.groups[0].name,'center','middle',x0+leafW/2,top+HEAD_H/2,{group:0}));
    labels.push(textLabel('head-g1','header','table-frame',m.groups[1].name,'center','middle',sepR+leafW/2,top+HEAD_H/2,{group:1}));
  }else labels.push(textLabel('head-leaf','header','table-frame','잎','center','middle',x0+STEMW+leafW/2,top+HEAD_H/2,{}));
  const leafX=(g,j)=>g===0&&two?x0+leafW-PAD-j*PITCH:(two?sepR:x0+STEMW)+PAD+j*PITCH;
  for(const [ri,s] of m.stems.entries()){
    const cy=top+HEAD_H+ROW_H*(ri+.5);
    labels.push(math(`stem-${s}`,'stem','table-frame',String(s),String(s),'center','middle',stemCx,cy,{value:String(s)}));
    for(const [gi,g] of m.groups.entries())g.rows[ri].leaves.forEach((leaf,j)=>{
      const value=s*10+leaf;
      labels.push(math(`leaf-g${gi}-${s}-${j}`,'leaf','table-frame',String(leaf),String(leaf),'center','middle',leafX(gi,j),cy,{value:String(value),group:gi,stem:s,index:j}));
    });
  }
  for(const mk of m.marks){
    const g=m.groups[mk.group],s=Math.floor(mk.value/10),ri=m.stems.indexOf(s);
    // the rank-th smallest value: its leaf index is the count of smaller values on the same stem
    const before=g.sorted.slice(0,mk.rank-1).filter(v=>Math.floor(v/10)===s).length;
    prims.push({t:'ellipse',id:`mark-g${mk.group}-r${mk.rank}`,role:'mark',cls:'mark',cx:r6(leafX(mk.group,before)),cy:r6(top+HEAD_H+ROW_H*(ri+.5)),rx:12,ry:13,data:{group:mk.group,rank:mk.rank,value:mk.value},layer:60});
  }
  if(m.title)labels.push(textLabel('title','title','table-frame',m.title,'center','top',width/2,SAFE));
  labels.push(textLabel('key','key','table-frame',m.key.text,'end','top',x0+tableW,bottom+8,{}));
  return {size:{width,height:bottom+8+30+SAFE},prims,labels};
}
function boxSpec(m){
  const ROW=m.showValues?78:56,rows=m.series.length,top=18,axisY=top+rows*ROW+6,H=axisY+TICK+4+LABEL_BELOW+SAFE;
  const lo=N(m.ticks[0]),hi=N(m.ticks[m.ticks.length-1]),step=N(m.step),dLo=lo>0?lo-.8*step:lo,breakU=lo>0?lo-.45*step:null,dHi=hi+.6*step;
  const left=m.series.some(s=>s.name)?MAPL+8:MAPL-24,px=u=>r6(left+(u-dLo)/(dHi-dLo)*(MAPR-left));
  const prims=[],labels=[];
  prims.push(L('x-axis','axis','axis',px(dLo),axisY,ARROW_TIP-8,axisY,{axis:'x'}),{t:'polygon',id:'x-axis-arrow',role:'arrow',cls:'arrow',points:[[ARROW_TIP,axisY],[ARROW_TIP-9,axisY-4],[ARROW_TIP-9,axisY+4]],data:{},layer:30});
  if(breakU!==null)breakMark(prims,'x',px(breakU),axisY);
  for(const [i,t] of m.ticks.entries()){
    prims.push(L(`x-tick-${i}`,'x-tick','tick',px(N(t)),axisY,px(N(t)),axisY+TICK,{axis:'x',value:t}));
    labels.push(math(`x-tick-${i}-label`,'x-tick',`x-tick-${i}`,DISPLAY+qtex(P(t)),t,'center','top',px(N(t)),axisY+TICK+4,{value:t}));
  }
  if(m.xTitle)labels.push(textLabel('x-title','axis-title','x-axis',m.xTitle,'start','middle',TITLE_X,axisY));
  for(const [s,sr] of m.series.entries()){
    const cy=top+ROW*s+(m.showValues?22+(ROW-22)/2:ROW/2),f=Object.fromEntries(Object.entries(sr.five).map(([k,v])=>[k,px(N(v))]));
    prims.push(L(`whisker-s${s}-lo`,'whisker','whisker',f.min,cy,f.q1,cy,{series:s}),L(`whisker-s${s}-hi`,'whisker','whisker',f.q3,cy,f.max,cy,{series:s}));
    prims.push(L(`cap-s${s}-min`,'cap','whisker',f.min,cy-8,f.min,cy+8,{series:s}),L(`cap-s${s}-max`,'cap','whisker',f.max,cy-8,f.max,cy+8,{series:s}));
    prims.push(rect(`box-s${s}`,'box','box',f.q1,cy-14,f.q3-f.q1,28,{series:s},40));
    prims.push(L(`median-s${s}`,'median','median',f.median,cy-14,f.median,cy+14,{series:s},45));
    if(sr.name)labels.push(textLabel(`name-s${s}`,'series-name',`box-s${s}`,sr.name,'end','middle',left-10,cy,{series:s}));
    if(m.showValues)for(const k of ['min','q1','median','q3','max'])labels.push(math(`value-s${s}-${k}`,'value',`box-s${s}`,DISPLAY+qtex(P(sr.five[k])),sr.five[k],'center','bottom',f[k],cy-18,{series:s,key:k,value:sr.five[k]}));
  }
  return {size:{width:W,height:H},prims,labels};
}
function scatterSpec(m){
  const xlo=N(m.xRange[0]),xhi=N(m.xRange[1]),ylo=N(m.yRange[0]),yhi=N(m.yRange[1]),xs=N(m.xStep),ys=N(m.yStep);
  const dxLo=xlo>0?xlo-.8*xs:0,dxHi=xhi+.6*xs,dyLo=ylo>0?ylo-.8*ys:0,dyHi=yhi+.5*ys,PLOT_H=250,PT=AXIS_TOP+18,BASE=PT+PLOT_H,H=BASE+TICK+4+LABEL_BELOW+SAFE;
  const px=u=>r6(MAPL+(u-dxLo)/(dxHi-dxLo)*(MAPR-MAPL)),py=v=>r6(BASE-(v-dyLo)/(dyHi-dyLo)*PLOT_H),yAxisPx=px(dxLo);
  const prims=[],labels=[];
  const ticks=(lo,hi,s)=>{const t=[];for(let k=Math.round(lo/s);k<=Math.round(hi/s);k++)t.push({v:k*s,k,idx:k-Math.round(lo/s)});return t;};
  const xt=ticks(xlo,xhi,xs),yt=ticks(ylo,yhi,ys);
  const xv=k=>qstr(qmul(Q(BigInt(k)),P(m.xStep))),yv=k=>qstr(qmul(Q(BigInt(k)),P(m.yStep)));
  if(m.grid){
    for(const t of xt)prims.push(L(`grid-x-${t.k}`,'grid','grid',px(t.v),py(ylo),px(t.v),py(yhi),{value:xv(t.k)},20));
    for(const t of yt)prims.push(L(`grid-y-${t.k}`,'grid','grid',px(xlo),py(t.v),px(xhi),py(t.v),{value:yv(t.k)},20));
  }
  arrows(prims,{xStartPx:yAxisPx,yAxisPx,base:BASE});
  if(xlo>0)breakMark(prims,'x',px(xlo-.45*xs),BASE);
  if(ylo>0)breakMark(prims,'y',yAxisPx,py(ylo-.45*ys));
  for(const t of xt){
    if(Math.round(t.k)%m.labelEvery!==0)continue;
    prims.push(L(`x-tick-${t.k}`,'x-tick','tick',px(t.v),BASE,px(t.v),BASE+TICK,{axis:'x',value:xv(t.k)}));
    labels.push(math(`x-tick-${t.k}-label`,'x-tick',`x-tick-${t.k}`,DISPLAY+qtex(P(xv(t.k))),xv(t.k),'center','top',px(t.v),BASE+TICK+4,{value:xv(t.k)}));
  }
  for(const t of yt){
    if(Math.round(t.k)%m.labelEvery!==0)continue;
    prims.push(L(`y-tick-${t.k}`,'y-tick','tick',yAxisPx-TICK,py(t.v),yAxisPx,py(t.v),{axis:'y',value:yv(t.k)}));
    labels.push(math(`y-tick-${t.k}-label`,'y-tick',`y-tick-${t.k}`,DISPLAY+qtex(P(yv(t.k))),yv(t.k),'end','middle',yAxisPx-TICK-4,py(t.v),{value:yv(t.k)}));
  }
  if(xlo>0||ylo>0)labels.push(math('origin','origin','x-axis','O','O','end','top',yAxisPx-6,BASE+4));
  if(m.xTitle)labels.push(textLabel('x-title','axis-title','x-axis',m.xTitle,'start','middle',TITLE_X,BASE));
  if(m.yTitle)labels.push(textLabel('y-title','axis-title','y-axis',m.yTitle,'center','bottom',yAxisPx,AXIS_TOP-4));
  if(m.diagonal){const t0=Math.max(xlo,ylo),t1=Math.min(xhi,yhi);prims.push(L('diagonal','diagonal','diagonal',px(t0),py(t0),px(t1),py(t1),{},35));}
  m.points.forEach((p,i)=>{
    prims.push({t:'circle',id:`pt-${i}`,role:'point',cls:'dot',cx:px(N(p.x)),cy:py(N(p.y)),r:3.6,data:{index:i},layer:70});
    if(p.name)labels.push(math(`pt-${i}-name`,'point-name',`pt-${i}`,p.name,p.name,'start','middle',px(N(p.x))+9,py(N(p.y)),{index:i,value:p.name}));
  });
  return {size:{width:W,height:H},prims,labels};
}
function diceSpec(m){
  const CELL=m.cell==='PAIR'?54:40,n=m.faces,x0=SAFE+14,y0=SAFE+14,width=x0*2+(n+1)*CELL,height=y0*2+(n+1)*CELL;
  const prims=[],labels=[];
  prims.push(rect('corner','head','head',x0,y0,CELL,CELL,{},40));
  prims.push(L('corner-diagonal','rule','rule',x0,y0,x0+CELL,y0+CELL,{},41));
  labels.push(math('corner-col','var','corner',m.colVar,m.colVar,'center','middle',x0+CELL*.72,y0+CELL*.3,{value:m.colVar,axis:'col'}));
  labels.push(math('corner-row','var','corner',m.rowVar,m.rowVar,'center','middle',x0+CELL*.28,y0+CELL*.7,{value:m.rowVar,axis:'row'}));
  for(let k=1;k<=n;k++){
    prims.push(rect(`head-col-${k}`,'head','head',x0+k*CELL,y0,CELL,CELL,{axis:'col',value:k},40),rect(`head-row-${k}`,'head','head',x0,y0+k*CELL,CELL,CELL,{axis:'row',value:k},40));
    labels.push(math(`head-col-${k}-label`,'head-value',`head-col-${k}`,String(k),String(k),'center','middle',x0+(k+.5)*CELL,y0+CELL/2,{value:String(k),axis:'col'}));
    labels.push(math(`head-row-${k}-label`,'head-value',`head-row-${k}`,String(k),String(k),'center','middle',x0+CELL/2,y0+(k+.5)*CELL,{value:String(k),axis:'row'}));
  }
  for(const c of m.cells){
    const id=`cell-${c.col}-${c.row}`;
    prims.push(rect(id,'cell',c.highlighted?'cellHi':'cell',x0+c.col*CELL,y0+c.row*CELL,CELL,CELL,{col:c.col,row:c.row,highlight:c.highlighted?1:0},40));
    if(c.text)labels.push(math(id+'-label','cell-value',id,c.text,c.text,'center','middle',x0+(c.col+.5)*CELL,y0+(c.row+.5)*CELL,{value:c.text,col:c.col,row:c.row}));
  }
  return {size:{width,height},prims,labels};
}
const TREE_COLW=150,TREE_ROW=68,TREE_X0=44,TREE_TOP=58;
function treeCenters(m){
  const byId=new Map(m.nodes.map(n=>[n.id,n])),pos=new Map();let leaf=0;
  const place=id=>{const n=byId.get(id);if(!n.children.length){pos.set(id,TREE_TOP+TREE_ROW*leaf++);return;}n.children.forEach(place);pos.set(id,(pos.get(n.children[0])+pos.get(n.children[n.children.length-1]))/2);};
  place('n0');
  return new Map(m.nodes.map(n=>[n.id,{x:r6(TREE_X0+n.depth*TREE_COLW),y:r6(pos.get(n.id))}]));
}
function treeSpec(m){
  const c=treeCenters(m),leaves=m.leaves.length,width=TREE_X0+m.maxDepth*TREE_COLW+(m.showPathProbability?190:80),height=TREE_TOP*2+(leaves-1)*TREE_ROW;
  const labels=[],prims=[];
  for(const n of m.nodes){
    const p=c.get(n.id);
    if(n.label!==null){
      const asMath=/^[A-Za-z0-9]{1,3}$/.test(n.label);
      labels.push(asMath?math(`node-${n.id}`,'node',n.id,n.label,n.label,'center','middle',p.x,p.y,{node:n.id,cx:p.x,cy:p.y,value:n.label}):textLabel(`node-${n.id}`,'node',n.id,n.label,'center','middle',p.x,p.y,{node:n.id,cx:p.x,cy:p.y,value:n.label}));
    }else prims.push({t:'circle',id:`node-${n.id}`,role:'point',cls:'dot',cx:p.x,cy:p.y,r:4,data:{node:n.id},layer:70});
    if(n.parent!==null){
      prims.push({t:'branch',id:`branch-${n.id}`,role:'branch',cls:'branch',parent:n.parent,child:n.id,data:{parent:n.parent,child:n.id},layer:30});
      if(m.hasProbabilities)labels.push({id:`branch-${n.id}-p`,role:'branch-probability',owner:`branch-${n.id}`,kind:'MATH',tex:DISPLAY+qfrac(P(n.p)),plain:n.p,anchor:{x:0,y:0,ax:'center',ay:'middle'},extra:{value:n.p,child:n.id},placement:'branch'});
    }
    if(!n.children.length&&m.showPathProbability){
      const chain=[];for(let id=n.id;id;id=m.nodes.find(x=>x.id===id).parent)chain.unshift(m.nodes.find(x=>x.id===id));
      const factors=chain.slice(1).map(x=>qfrac(P(x.p))).join('\\times ');
      labels.push({id:`path-${n.id}`,role:'path-probability',owner:`node-${n.id}`,kind:'MATH',tex:DISPLAY+factors+'='+qfrac(P(n.path)),plain:n.path,anchor:{x:0,y:0,ax:'start',ay:'middle'},extra:{value:n.path,leaf:n.id},placement:'leaf'});
    }
  }
  return {size:{width,height},prims,labels,centers:Object.fromEntries([...c.entries()]),tree:true};
}
const SPEC_BY_KIND={HISTOGRAM:freqSpec,FREQUENCY_POLYGON:freqSpec,STEM_LEAF:stemSpec,BOX_PLOT:boxSpec,SCATTER:scatterSpec,DICE_TABLE:diceSpec,TREE:treeSpec};
export const statChartSize=model=>({...SPEC_BY_KIND[model.kind](model).size});
export function statChartSpec(plan,model){
  if(plan?.capability!==FIGURE_CAPABILITY||!isPlain(plan.chart))bad('STAT_CHART_PLAN_INVALID');
  if(objectSha(solveStatChart(plan.chart))!==objectSha(model))bad('STAT_MODEL_MISMATCH');
  const spec=SPEC_BY_KIND[model.kind](model);
  return {schemaVersion:SPEC_VERSION,...spec};
}

// --- composing ----------------------------------------------------------------------------------------------------------------------------
const PLAIN_KEYS=['capability','chart','caption','sourceConditions','newVisualInformation'];
export function checkStatChartPlan(plan){
  onlyKeys(plan,PLAIN_KEYS,'STAT_CHART_PLAN_INVALID');
  if(plan.capability!==FIGURE_CAPABILITY)bad('STAT_CHART_PLAN_INVALID');
  return solveStatChart(plan.chart);
}
const fmt=n=>String(r6(n));
function printPrim(p){
  const data=Object.entries(p.data??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join(''),head=`id="${p.id}" data-role="${p.role}"${data}`,style=STYLE[p.cls];
  let tag;
  switch(p.t){
    case 'line':tag=`<line ${head} x1="${fmt(p.x1)}" y1="${fmt(p.y1)}" x2="${fmt(p.x2)}" y2="${fmt(p.y2)}" ${style}/>`;break;
    case 'rect':tag=`<rect ${head} x="${fmt(p.x)}" y="${fmt(p.y)}" width="${fmt(p.width)}" height="${fmt(p.height)}" ${style}/>`;break;
    case 'polyline':tag=`<polyline ${head} points="${p.points.map(([x,y])=>fmt(x)+','+fmt(y)).join(' ')}" ${style}/>`;break;
    case 'polygon':tag=`<polygon ${head} points="${p.points.map(([x,y])=>fmt(x)+','+fmt(y)).join(' ')}" ${style}/>`;break;
    case 'circle':tag=`<circle ${head} cx="${fmt(p.cx)}" cy="${fmt(p.cy)}" r="${p.r}" ${style}/>`;break;
    case 'ellipse':tag=`<ellipse ${head} cx="${fmt(p.cx)}" cy="${fmt(p.cy)}" rx="${p.rx}" ry="${p.ry}" ${style}/>`;break;
    default:throw Error('STAT_PRIMITIVE_UNKNOWN');
  }
  return `<g data-layer="${p.layer}">${tag}</g>`;
}
// A grid line never runs under a label: it is cut into the pieces that clear every label box (the labels are glyph outlines, the grid only a reading aid).
function cutGrid(spec,placed){
  const boxes=placed.map(item=>({x:item.box.x-3,y:item.box.y-3,width:item.box.width+6,height:item.box.height+6}));
  const out=[];
  for(const prim of spec.prims){
    if(prim.role!=='grid'){out.push(prim);continue;}
    const horizontal=prim.y1===prim.y2,lo=Math.min(horizontal?prim.x1:prim.y1,horizontal?prim.x2:prim.y2),hi=Math.max(horizontal?prim.x1:prim.y1,horizontal?prim.x2:prim.y2);
    const covers=boxes.filter(b=>horizontal?b.y<prim.y1&&prim.y1<b.y+b.height&&b.x<hi&&b.x+b.width>lo:b.x<prim.x1&&prim.x1<b.x+b.width&&b.y<hi&&b.y+b.height>lo)
      .map(b=>horizontal?[b.x,b.x+b.width]:[b.y,b.y+b.height]).sort((u,v)=>u[0]-v[0]);
    const pieces=[];let cur=lo;
    for(const [c0,c1] of covers){if(c0>cur)pieces.push([cur,c0]);cur=Math.max(cur,c1);}
    if(hi>cur)pieces.push([cur,hi]);
    const kept=pieces.filter(([a,b])=>b-a>=4);
    kept.forEach(([a,b],k)=>out.push({...prim,id:kept.length===1&&a===lo&&b===hi?prim.id:`${prim.id}~${k}`,...(horizontal?{x1:r6(a),x2:r6(b)}:{y1:r6(a),y2:r6(b)})}));
  }
  spec.prims=out;
}
// The tree: branch ends sit just outside the two node label boxes on the line between the node centres; a probability label stands beside its branch, clear of it.
function resolveTree(spec,placed){
  const boxOf=new Map(placed.filter(item=>item.label.role==='node').map(item=>[item.label.extra.node,item.box]));
  const centers=spec.centers,GAP=4;
  const clip=(a,b,box)=>{ // the point where the segment a->b leaves the (grown) box around a
    if(!box){const d=Math.hypot(b.x-a.x,b.y-a.y);return {x:a.x+(b.x-a.x)/d*7,y:a.y+(b.y-a.y)/d*7};}// a dot node: start just outside it, on the line
    const g={x:box.x-GAP,y:box.y-GAP,width:box.width+2*GAP,height:box.height+2*GAP},dx=b.x-a.x,dy=b.y-a.y;
    const t=Math.min(dx>0?(g.x+g.width-a.x)/dx:dx<0?(g.x-a.x)/dx:Infinity,dy>0?(g.y+g.height-a.y)/dy:dy<0?(g.y-a.y)/dy:Infinity);
    return {x:a.x+dx*t,y:a.y+dy*t};
  };
  const lines=new Map();
  for(const prim of spec.prims.filter(p=>p.t==='branch')){
    const a=centers[prim.parent],b=centers[prim.child],s=clip(a,b,boxOf.get(prim.parent)),e=clip(b,a,boxOf.get(prim.child));
    prim.t='line';prim.x1=r6(s.x);prim.y1=r6(s.y);prim.x2=r6(e.x);prim.y2=r6(e.y);prim.data={...prim.data,cx1:centers[prim.parent].x,cy1:centers[prim.parent].y,cx2:centers[prim.child].x,cy2:centers[prim.child].y};
    lines.set(prim.child,prim);
  }
  for(const item of placed){
    const {label,fragment}=item,{width,height}=fragment.intrinsic;
    if(label.placement==='branch'){
      const ln=lines.get(label.extra.child),mx=(ln.x1+ln.x2)/2,my=(ln.y1+ln.y2)/2,len=Math.hypot(ln.x2-ln.x1,ln.y2-ln.y1);
      // the label stands on the outer side of its branch: above a branch that rises or runs level, below one that falls (siblings never share the gap between them)
      const falls=centers[ln.data.child].y>centers[ln.data.parent].y+.5;
      let nx=-(ln.y2-ln.y1)/len,ny=(ln.x2-ln.x1)/len;if(falls?ny<0:ny>0){nx=-nx;ny=-ny;}
      const d=(width/2)*Math.abs(nx)+(height/2)*Math.abs(ny)+5;
      item.box={x:r6(mx+nx*d-width/2),y:r6(my+ny*d-height/2),width,height};
    }else if(label.placement==='leaf'){
      const c=centers[label.extra.leaf],nb=boxOf.get(label.extra.leaf);
      item.box={x:r6((nb?nb.x+nb.width:c.x)+16),y:r6(c.y-height/2),width,height};
    }
  }
}
/** Typeset every label, place it, build the SVG, run the independent observer on its bytes and the rendered layout check in Chrome. */
export async function composeStatChartFigure({plan,model,identity,typographyPolicy,browser}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:status==='COMPOSED'?'construction-candidate-svg-v1':SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=statChartSpec(plan,model);}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='STAT_MODEL_MISMATCH'?error.message:'STAT_SPEC_ERROR',{code:error.message});}
    lineage.specSha256=objectSha(JSON.parse(JSON.stringify(spec)));
    const typeset=typesetter(),font=typographyPolicy.baseFontPx,placed=[];
    for(const label of spec.labels){
      let fragment;
      try{fragment=typeset({id:label.id,owner:label.owner,factRole:['value','leaf','cell-value','path-probability','branch-probability'].includes(label.role)?'CONCLUSION':'DERIVED_INTERMEDIATE',fontPx:font,panelId:'stat-chart',...(label.kind==='MATH'?{kind:'MATH',tex:label.tex}:{kind:'TEXT',text:label.text})},identity);}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('STAT_TYPESET_ERROR',{labelId:label.id,code:error.message});}
      const {width,height}=fragment.intrinsic,{x,y,ax,ay}=label.anchor;
      placed.push({label,fragment,box:{x:r6(ax==='end'?x-width:ax==='center'?x-width/2:x),y:r6(ay==='bottom'?y-height:ay==='middle'?y-height/2:y),width,height}});
    }
    if(spec.tree)resolveTree(spec,placed);
    cutGrid(spec,placed);
    const {width,height}=spec.size;
    for(const item of placed){
      const b=item.box;
      if(b.x<SAFE||b.y<SAFE||b.x+b.width>width-SAFE||b.y+b.height>height-SAFE)throw new Stop('STAT_LABEL_OUT_OF_BOUNDS',{labelId:item.label.id,box:b,size:{width,height}});
    }
    for(let i=0;i<placed.length;i++)for(const other of placed.slice(i+1))if(overlaps(placed[i].box,other.box))throw new Stop('STAT_LABELS_TOO_CLOSE',{labels:[placed[i].label.id,other.label.id]});
    lineage.fragmentSha256s=Object.fromEntries(placed.map(item=>[item.label.id,item.fragment.fragmentSha256]));
    let body=`<rect width="${width}" height="${height}" fill="#fff"/>`;
    for(const prim of [...spec.prims].sort((a,b)=>a.layer-b.layer))body+=printPrim(prim);
    for(const {label,fragment,box} of placed){
      const extra=Object.entries(label.extra??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join('');
      body+=`<g data-layer="90"><g id="${label.id}" data-label-kind="COORDINATE_LABEL" data-label-role="${label.role}" data-priority="0" data-font-px="${font}" data-owner="${label.owner}"${extra}${label.kind==='MATH'?` data-tex="${esc(label.tex)}"`:` data-text="${esc(label.text)}"`} data-fragment-sha="${fragment.fragmentSha256}" data-box="${box.x},${box.y},${box.width},${box.height}" transform="translate(${box.x} ${box.y})">${fragment.svg}</g></g>`;
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" data-stat-chart="${FIGURE_CAPABILITY}" data-kind="${model.kind}" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="${SAFE}" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    if(process.env.APMS_DRAFT_DIR)(await import('node:fs')).writeFileSync(process.env.APMS_DRAFT_DIR+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-stat-chart-'+Date.now()+'.svg',svg);
    let response;
    try{response=await pythonWorker({chart:plan.chart,svg},{script:OBSERVER_SCRIPT});}catch(error){throw new Stop('WORKER_ERROR',{stage:'statChartAudit',code:String(error?.message??error)});}
    if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'statChartAudit',code:response?.result?.code??null});
    const audit=response.result;lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')throw new Stop('STAT_CHART_STATIC_AUDIT_FAIL',{errors});
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('STAT_CHART_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
