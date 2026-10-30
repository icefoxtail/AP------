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
/** An axis title of a frequency chart: at most 14 characters as before, or up to 28 with a single space to break at into two lines of at most 14 each (E34). */
const titleLines=text=>{
  if(text.length<=14)return [text];
  if(/^ | $|  /.test(text))return null;
  let best=null;
  for(let i=0;i<text.length;i++)if(text[i]===' '){const a=text.slice(0,i),b=text.slice(i+1);if(a.length<=14&&b.length<=14){const d=Math.abs(a.length-b.length);if(!best||d<best.d)best={d,lines:[a,b]};}}
  return best&&best.lines;
};
const axisTitle=(v,fallback)=>typeof v==='string'&&v.length>14&&v.length<=28&&!/[\u0000-\u001f<>&"\\]/.test(v)&&titleLines(v)!==null?v:titleText(v,'STAT_TITLE_INVALID',fallback);
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
    case 'DOT_PLOT':return solveDot(chart);
    default:return bad('STAT_KIND_UNSUPPORTED');
  }
}
// Histogram / frequency polygon. Beyond the plain data it takes the marks a solution figure needs, each one checked here against the data and re-derived by the observer:
//  - a class frequency may be null (the problem tore or erased it: the bar and polygon vertex are simply not drawn there); `total` then fixes what the hidden classes add up to;
//  - restoredClasses: a bar the figure rebuilds from the total (dashed outline; its value is not written unless showRestoredValues);
//  - highlightClasses: bars of a histogram, or the points of every series of a polygon-only chart (an entry is a class or {class,tone:1|2});
//  - highlightPoints: single polygon points {series,class,tone?,showValue?}; classSums: a bracket under the axis over classes from..to with their summed frequency (classes:[[0,2],[4,5]]: one bracket per run of classes that need not touch, joined under the axis, E34);
//  - unknownLabels: [{class,label,relHeight?}] a hidden class of a histogram drawn as a dotted outline carrying a symbol (2x), the outlines standing in the ratio of their relHeight (E34); showEndValues: a polygon's two end points write their 0;
//  - a classSums label that is not a plain number (6명, 합계) is a stated fact: it is written as given and checked only where the engine can sum the bracket exactly.
function solveFreq(c){
  onlyKeys(c,['kind','boundaries','series','yKind','polygon','xTitle','yTitle','grid','showValues','highlightClasses','total','highlightPoints','classSums','restoredClasses','showRestoredValues','hideValues','unknownLabels','showEndValues'],'STAT_CHART_PLAN_INVALID');
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
    let freq=null,values,total=null,hasTotal=false,hiddenSum=null;
    if(s.frequencies!==undefined){
      if(!Array.isArray(s.frequencies)||s.frequencies.length!==n)bad('STAT_FREQUENCY_COUNT_MISMATCH');
      freq=s.frequencies.map(f=>f===null?null:intIn(f,0,999,'STAT_FREQUENCY_INVALID')); // null: the problem does not show this class
      const known=freq.filter(f=>f!==null),knownSum=known.reduce((x,y)=>x+y,0);
      if(!known.length)bad('STAT_FREQUENCY_INVALID');
      const given=s.total??(i===0?c.total:undefined);
      hasTotal=given!==undefined;
      if(known.length===n){
        total=knownSum;
        if(given!==undefined&&given!==total)bad('STAT_FREQUENCY_TOTAL_MISMATCH');
      }else if(given!==undefined){ // hidden classes: the stated total must leave them a non-negative sum, which is then what they add up to
        if(!Number.isInteger(given)||given<knownSum)bad('STAT_FREQUENCY_TOTAL_MISMATCH');
        total=given;
      }
      if(yKind==='FREQUENCY'){
        values=freq.map(f=>f===null?null:Q(BigInt(f)));
        if(total!==null&&known.length<n)hiddenSum=Q(BigInt(total-knownSum));
      }else{
        if(total===null)bad('STAT_UNKNOWN_NEEDS_TOTAL');
        if(total===0)bad('STAT_FREQUENCY_TOTAL_ZERO');
        values=freq.map(f=>f===null?null:Q(BigInt(f),BigInt(total)));
        if(known.length<n)hiddenSum=Q(BigInt(total-knownSum),BigInt(total));
      }
    }else{
      if(s.total!==undefined||c.total!==undefined)bad('STAT_SERIES_INVALID');
      if(!Array.isArray(s.relativeFrequencies)||s.relativeFrequencies.length!==n)bad('STAT_FREQUENCY_COUNT_MISMATCH');
      values=s.relativeFrequencies.map(x=>{if(x===null)return null;const v=parseQ(x,'STAT_FREQUENCY_INVALID');if(qcmp(v,ZERO)<0||qcmp(v,ONE)>0)bad('STAT_FREQUENCY_INVALID');return v;});
      const known=values.filter(v=>v!==null),sum=known.reduce(qadd,ZERO);
      if(!known.length)bad('STAT_FREQUENCY_INVALID');
      if(known.length===n){if(qcmp(sum,ONE)!==0)bad('STAT_RELATIVE_SUM_NOT_ONE');}
      else{if(qcmp(sum,ONE)>0)bad('STAT_RELATIVE_SUM_NOT_ONE');hiddenSum=qsub(ONE,sum);} // relative frequencies add up to 1, so what the hidden classes hold is known
    }
    return {name,frequencies:freq,total,values,hasTotal,hiddenSum};
  });
  const classes=[...Array(n).keys()].map(i=>({lo:b[i],hi:b[i+1],mid:qdiv(qadd(b[i],b[i+1]),Q(2n))}));
  const polygon=polygonKind||c.polygon===true;
  if(c.polygon!==undefined&&typeof c.polygon!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  for(const k of ['grid','showValues','showRestoredValues'])if(c[k]!==undefined&&typeof c[k]!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  const toneOf=(v,code)=>{if(v===undefined)return 1;if(v!==1&&v!==2)bad(code);return v;};
  let highlight=[],tone2=[];
  if(c.highlightClasses!==undefined){
    if(!Array.isArray(c.highlightClasses))bad('STAT_HIGHLIGHT_INVALID');
    const seen=new Set(),picked=[];
    for(const e of c.highlightClasses){
      let ks,tone=1;
      if(isPlain(e)){ // {class,tone} or a whole group {classes:[...],tone}: one emphasis colour for the group
        onlyKeys(e,['class','classes','tone'],'STAT_HIGHLIGHT_INVALID');
        if((e.class===undefined)===(e.classes===undefined))bad('STAT_HIGHLIGHT_INVALID');
        ks=e.class!==undefined?[intIn(e.class,0,n-1,'STAT_HIGHLIGHT_INVALID')]:(Array.isArray(e.classes)&&e.classes.length?e.classes.map(k=>intIn(k,0,n-1,'STAT_HIGHLIGHT_INVALID')):bad('STAT_HIGHLIGHT_INVALID'));
        tone=toneOf(e.tone,'STAT_HIGHLIGHT_INVALID');
      }else ks=[intIn(e,0,n-1,'STAT_HIGHLIGHT_INVALID')];
      for(const k of ks){
        if(seen.has(k))bad('STAT_HIGHLIGHT_INVALID');
        seen.add(k);
        if(series.some(s=>s.values[k]===null))bad('STAT_HIGHLIGHT_UNKNOWN_CLASS'); // a hidden class has no bar or point to mark
        picked.push({k,tone});
      }
    }
    picked.sort((x,y)=>x.k-y.k);highlight=picked.map(x=>x.k);tone2=picked.filter(x=>x.tone===2).map(x=>x.k);
  }
  if(c.showValues&&series.length>1)bad('STAT_VALUES_NEED_ONE_SERIES');
  let hidden=[];
  if(c.hideValues!==undefined){ // showValues writes every value; these classes keep theirs unwritten (the value is what the problem asks for)
    if(c.showValues!==true||!Array.isArray(c.hideValues)||!c.hideValues.length||new Set(c.hideValues).size!==c.hideValues.length)bad('STAT_HIDE_VALUES_INVALID');
    hidden=c.hideValues.map(k=>intIn(k,0,n-1,'STAT_HIDE_VALUES_INVALID')).sort((x,y)=>x-y);
  }
  // polygon points that carry a mark: the points of every series at a highlighted class (polygon-only chart) and the single points the plan names
  const marks=[];
  if(polygonKind)for(const k of highlight)for(let s=0;s<series.length;s++)marks.push({series:s,class:k,tone:tone2.includes(k)?2:1,showValue:false});
  if(c.highlightPoints!==undefined){
    if(!polygon||!Array.isArray(c.highlightPoints)||c.highlightPoints.length<1||c.highlightPoints.length>12)bad('STAT_HIGHLIGHT_POINT_INVALID');
    for(const e of c.highlightPoints){
      onlyKeys(e,['series','class','tone','showValue'],'STAT_HIGHLIGHT_POINT_INVALID');
      const s=e.series===undefined?0:intIn(e.series,0,series.length-1,'STAT_HIGHLIGHT_POINT_INVALID'),k=intIn(e.class,0,n-1,'STAT_HIGHLIGHT_POINT_INVALID'),tone=toneOf(e.tone,'STAT_HIGHLIGHT_POINT_INVALID');
      if(e.showValue!==undefined&&typeof e.showValue!=='boolean')bad('STAT_HIGHLIGHT_POINT_INVALID');
      if(series[s].values[k]===null)bad('STAT_HIGHLIGHT_UNKNOWN_CLASS');
      if(marks.some(x=>x.series===s&&x.class===k))bad('STAT_HIGHLIGHT_POINT_INVALID');
      if(e.showValue===true&&c.showValues===true)bad('STAT_HIGHLIGHT_POINT_INVALID'); // showValues already writes every value of the one series
      marks.push({series:s,class:k,tone,showValue:e.showValue===true});
    }
  }
  marks.sort((x,y)=>x.series-y.series||x.class-y.class);
  let restored=[];
  if(c.restoredClasses!==undefined){
    if(c.kind!=='HISTOGRAM'||polygon)bad('STAT_RESTORED_UNSUPPORTED'); // the restored bar is a bar of a histogram without its polygon
    if(!Array.isArray(c.restoredClasses)||!c.restoredClasses.length||new Set(c.restoredClasses).size!==c.restoredClasses.length)bad('STAT_RESTORED_INVALID');
    restored=c.restoredClasses.map(k=>intIn(k,0,n-1,'STAT_RESTORED_INVALID')).sort((x,y)=>x-y);
    if(restored.some(k=>series[0].values[k]===null))bad('STAT_RESTORED_INVALID'); // a restored class has its value (the figure draws it), a hidden one has none
    if(!series[0].hasTotal)bad('STAT_RESTORED_NEEDS_TOTAL'); // what is restored comes from a stated total, which the engine then checks
  }
  // unknownLabels: a class the problem erased (null) of a histogram drawn as a dotted outline with a symbol in it (the value is not drawn: a symbol is not a number)
  const unknown=[];
  if(c.unknownLabels!==undefined){
    if(c.kind!=='HISTOGRAM'||polygon)bad('STAT_UNKNOWN_LABEL_UNSUPPORTED');
    if(!Array.isArray(c.unknownLabels)||c.unknownLabels.length<1||c.unknownLabels.length>n)bad('STAT_UNKNOWN_LABEL_INVALID');
    for(const e of c.unknownLabels){
      onlyKeys(e,['class','label','relHeight'],'STAT_UNKNOWN_LABEL_INVALID');
      const k=intIn(e.class,0,n-1,'STAT_UNKNOWN_LABEL_INVALID');
      if(unknown.some(u=>u.class===k))bad('STAT_UNKNOWN_LABEL_INVALID');
      if(series[0].values[k]!==null)bad('STAT_UNKNOWN_LABEL_CLASS_KNOWN'); // only a class whose bar the problem does not show can carry a symbol
      if(typeof e.label!=='string'||!/^[A-Za-z0-9+\-= ()?]{1,10}$/.test(e.label)||e.label!==e.label.trim())bad('STAT_UNKNOWN_LABEL_INVALID');
      // relHeight (opt-in): the outline's height relative to the other outlines (2x drawn twice as high as x); the highest outline keeps the usual height, the others are scaled down to it
      let rel=null;
      if(e.relHeight!==undefined){rel=parseQ(e.relHeight,'STAT_UNKNOWN_LABEL_INVALID');if(qcmp(rel,Q(1n,20n))<0||qcmp(rel,Q(20n))>0)bad('STAT_UNKNOWN_LABEL_INVALID');}
      unknown.push({class:k,label:e.label,rel});
    }
    unknown.sort((x,y)=>x.class-y.class);
    if(unknown.some(u=>u.rel!==null))for(const u of unknown)u.rel=u.rel??ONE;
  }
  if(c.showEndValues!==undefined&&(typeof c.showEndValues!=='boolean'||(c.showEndValues&&(!polygon||series.length!==1))))bad('STAT_SHOW_END_VALUES_UNSUPPORTED');
  // class sums: the exact sum of the series' values over from..to; a numeric label must equal it (hidden classes count only when one bracket holds all of them and the total says what they add up to)
  const sums=[];
  if(c.classSums!==undefined){
    if(!Array.isArray(c.classSums)||c.classSums.length<1||c.classSums.length>6)bad('STAT_CLASS_SUM_INVALID');
    for(const e of c.classSums){
      onlyKeys(e,['series','from','to','classes','label','unit'],'STAT_CLASS_SUM_INVALID');
      const s=e.series===undefined?0:intIn(e.series,0,series.length-1,'STAT_CLASS_SUM_INVALID');
      // one bracket over classes from..to, or (classes) a group of runs that need not touch: [0,1,2,4,5] or [[0,2],[4,5]] (adjacent runs merge); every run gets its bracket, joined under the axis
      let runs;
      if(e.classes!==undefined){
        if(e.from!==undefined||e.to!==undefined||!Array.isArray(e.classes)||e.classes.length<2||e.classes.length>24)bad('STAT_CLASS_SUM_INVALID');
        const pairs=e.classes.every(x=>Array.isArray(x));
        const raw=pairs?e.classes.map(x=>x.length===2?[intIn(x[0],0,n-1,'STAT_CLASS_SUM_INVALID'),intIn(x[1],0,n-1,'STAT_CLASS_SUM_INVALID')]:bad('STAT_CLASS_SUM_INVALID')):e.classes.map(k=>{const v=intIn(k,0,n-1,'STAT_CLASS_SUM_INVALID');return [v,v];});
        runs=[];
        for(const [a,b] of raw){
          if(b<a||(runs.length&&a<=runs.at(-1)[1]))bad('STAT_CLASS_SUM_INVALID'); // ascending, no class twice
          if(runs.length&&a===runs.at(-1)[1]+1)runs.at(-1)[1]=b;else runs.push([a,b]);
        }
      }else{
        const from=intIn(e.from,0,n-1,'STAT_CLASS_SUM_INVALID'),to=intIn(e.to,0,n-1,'STAT_CLASS_SUM_INVALID');
        if(to<from)bad('STAT_CLASS_SUM_INVALID');
        runs=[[from,to]];
      }
      const from=runs[0][0],to=runs.at(-1)[1],members=runs.flatMap(([a,b])=>[...Array(b-a+1).keys()].map(i=>a+i));
      if(sums.some(x=>x.series===s&&x.members.some(k=>members.includes(k))))bad('STAT_CLASS_SUM_OVERLAP');
      const unit=e.unit===undefined?'':(typeof e.unit==='string'&&/^[가-힣A-Za-z%]{1,3}$/.test(e.unit)?e.unit:bad('STAT_CLASS_SUM_UNIT_INVALID'));
      const label=e.label===undefined||e.label===null?null:typeof e.label==='number'?String(e.label):e.label;
      const sr=series[s],inside=members.map(k=>sr.values[k]),hidden=inside.filter(v=>v===null).length,known=inside.filter(v=>v!==null).reduce(qadd,ZERO);
      let text=null,free=false;
      if(label!==null){
        if(typeof label!=='string')bad('STAT_CLASS_SUM_LABEL_INVALID');
        if(label==='?'){if(!hidden)bad('STAT_CLASS_SUM_LABEL_INVALID');text='?';} // the sum of hidden classes, still to be found
        else{
          // a plain number is the exact sum; any other text (6명, 합계) is a stated fact written as given, checked only where the sum is derivable
          free=!/^\d{1,6}(?:\.\d{1,4})?$/.test(label);
          if(free&&(!/^[0-9A-Za-z가-힣+=.%() -]{1,12}$/.test(label)||label!==label.trim()||e.unit!==undefined))bad('STAT_CLASS_SUM_LABEL_INVALID');
          let want=known,derivable=true;
          if(hidden){
            const allHidden=sr.values.flatMap((v,k)=>v===null?[k]:[]);
            derivable=!(sr.hiddenSum===null||allHidden.some(k=>!members.includes(k)));
            if(derivable)want=qadd(known,sr.hiddenSum);
          }
          if(!free&&!derivable)bad('STAT_CLASS_SUM_UNKNOWN');
          const number=free?/^(\d{1,6}(?:\.\d{1,4})?)(?=\D)/.exec(label)?.[1]??null:label;
          if(number!==null&&derivable&&qcmp(parseQ(number,'STAT_CLASS_SUM_LABEL_INVALID'),want)!==0)bad('STAT_CLASS_SUM_LABEL_MISMATCH');
          text=label; // written as the author gave it (0.30 stays 0.30); a number it starts with equals the exact sum whenever the engine can derive it
        }
      }
      sums.push({series:s,from,to,label:text,unit,...(free?{free:true}:{}),...(runs.length>1?{runs}:{}),members});
    }
    sums.sort((x,y)=>x.series-y.series||x.from-y.from);
    for(const x of sums)delete x.members;
  }
  const maxV=series.flatMap(s=>s.values).filter(v=>v!==null).reduce((x,y)=>qcmp(x,y)>=0?x:y);
  const steps=yKind==='FREQUENCY'?NICE.map(s=>Q(BigInt(s))):[Q(1n,100n),Q(1n,50n),Q(1n,20n),Q(1n,10n),Q(1n,5n),Q(1n,2n),Q(1n)];
  const step=steps.find(s=>qceil(qdiv(maxV,s))<=8n)??bad('STAT_Y_RANGE_TOO_LARGE');
  let top=qmul(step,Q(qceil(qdiv(maxV,step))));
  if(qcmp(top,maxV)===0)top=qadd(top,step);
  const ticks=[];for(let t=step;qcmp(t,top)<=0;t=qadd(t,step))ticks.push(qstr(t));
  return {schemaVersion:MODEL_VERSION,kind:c.kind,yKind,polygon,grid:c.grid===true,showValues:c.showValues===true,highlight,
    ...(tone2.length?{highlightTone2:tone2}:{}),...(marks.length?{marks}:{}),...(restored.length?{restored,showRestoredValues:c.showRestoredValues===true}:{}),...(hidden.length?{hideValues:hidden}:{}),...(sums.length?{classSums:sums}:{}),...(unknown.length?{unknown:unknown.map(u=>({class:u.class,label:u.label,...(u.rel!==null?{relHeight:qstr(u.rel)}:{})}))}:{}),...(c.showEndValues===true?{showEndValues:true}:{}),
    xTitle:axisTitle(c.xTitle,'계급'),yTitle:axisTitle(c.yTitle,yKind==='FREQUENCY'?'도수(명)':'상대도수'),
    boundaries:b.map(qstr),width:qstr(width),classes:classes.map(k=>({lo:qstr(k.lo),hi:qstr(k.hi),mid:qstr(k.mid)})),
    series:series.map(s=>({name:s.name,frequencies:s.frequencies,total:s.total,values:s.values.map(v=>v===null?null:qstr(v)),
      vertices:[[qstr(qsub(classes[0].mid,width)),'0'],...classes.map((k,i)=>s.values[i]===null?null:[qstr(k.mid),qstr(s.values[i])]),[qstr(qadd(classes[n-1].mid,width)),'0']],
      ...(s.hiddenSum!==null?{hiddenSum:qstr(s.hiddenSum)}:{})})),
    y:{step:qstr(step),top:qstr(top),ticks}};
}
// A stem-and-leaf leaf is a whole number 0..999 (stem = tens, leaf = ones) or a letter leaf {symbol:'a',stem:1,order:3}: a value the problem names with a letter
// instead of giving it. The engine never invents the letter's value; the author fixes only its place in the row (order = 1-based position among that stem's leaves
// in ascending order), and the engine refuses a place the row cannot hold. Ranks (marks) count positions in that ascending order, so a letter leaf can be ranked.
// The key text "1 | 4는 14분": the particle after the leaf digit follows how that digit is read. 영 일 삼 육 칠 팔 end in a final consonant (은); 이 사 오 구 do not (는).
const LEAF_PARTICLE=['은','은','는','은','는','는','은','은','은','는'];
const STEM_SYMBOL=/^[a-z]$/,MAX_STEM_MARKS=16; // circled leaves of one plan (a rank entry may list as many)
const stemRow=(g,s)=>{ // the leaves (ones digits, or {symbol}) of stem s in ascending order, the letter leaves put where the author says
  const row=g.numbers.filter(v=>Math.floor(v/10)===s).map(v=>v%10);
  const letters=g.symbols.filter(x=>x.stem===s).sort((x,y)=>x.order-y.order);
  letters.forEach((x,i)=>{if((i&&letters[i-1].order===x.order)||x.order-1>row.length)bad('STAT_STEM_SYMBOL_ORDER_CONFLICT');row.splice(x.order-1,0,{symbol:x.symbol});});
  return row;
};
function solveStem(c){
  onlyKeys(c,['kind','values','groups','unitText','title','key','marks','classGroups','rankLabels'],'STAT_CHART_PLAN_INVALID');
  if((c.values===undefined)===(c.groups===undefined))bad('STAT_STEM_PLAN_INVALID');
  const raw=c.values!==undefined?[{values:c.values}]:c.groups;
  if(!Array.isArray(raw)||raw.length<1||raw.length>2)bad('STAT_STEM_PLAN_INVALID');
  const groups=raw.map(g=>{
    onlyKeys(g,['name','values'],'STAT_STEM_PLAN_INVALID');
    if(!Array.isArray(g.values)||g.values.length<1||g.values.length>60)bad('STAT_STEM_PLAN_INVALID');
    const numbers=[],symbols=[];
    for(const v of g.values){
      if(isPlain(v)){
        onlyKeys(v,['symbol','stem','order'],'STAT_STEM_SYMBOL_INVALID');
        if(typeof v.symbol!=='string'||!STEM_SYMBOL.test(v.symbol))bad('STAT_STEM_SYMBOL_INVALID');
        symbols.push({symbol:v.symbol,stem:intIn(v.stem,0,99,'STAT_STEM_SYMBOL_INVALID'),order:intIn(v.order,1,60,'STAT_STEM_SYMBOL_INVALID')});
      }else numbers.push(intIn(v,0,999,'STAT_STEM_VALUE_INVALID'));
    }
    numbers.sort((x,y)=>x-y);
    return {name:g.name===undefined?null:titleText(g.name,'STAT_STEM_PLAN_INVALID'),numbers,symbols};
  });
  if(raw.length===2&&groups.some(g=>!g.name))bad('STAT_SERIES_NAME_REQUIRED');
  const letters=groups.flatMap(g=>g.symbols.map(x=>x.symbol));
  if(new Set(letters).size!==letters.length)bad('STAT_STEM_SYMBOL_DUPLICATE');
  const all=groups.flatMap(g=>g.numbers),rowStems=[...all.map(v=>Math.floor(v/10)),...groups.flatMap(g=>g.symbols.map(x=>x.stem))],lo=Math.min(...rowStems),hi=Math.max(...rowStems);
  if(hi-lo>11)bad('STAT_STEM_TOO_MANY_STEMS');
  const stems=[];for(let s=lo;s<=hi;s++)stems.push(s);
  const unitText=c.unitText===undefined?'':titleText(c.unitText,'STAT_TITLE_INVALID','');
  const title=c.title===undefined?null:titleText(c.title,'STAT_TITLE_INVALID',null);
  const rows=groups.map(g=>stems.map(s=>({stem:s,leaves:stemRow(g,s)})));
  // every leaf of a group in ascending order (a whole number is its full value; a letter leaf stays {symbol}): rank r is entry r-1
  const ordered=rows.map(rs=>rs.flatMap(r=>r.leaves.map(l=>typeof l==='number'?r.stem*10+l:l)));
  let key=null;
  const first=ordered[0].find(v=>typeof v==='number');
  if(c.key!==undefined){
    onlyKeys(c.key,['stem','leaf'],'STAT_STEM_KEY_INVALID');
    const value=intIn(c.key.stem,0,99,'STAT_STEM_KEY_INVALID')*10+intIn(c.key.leaf,0,9,'STAT_STEM_KEY_INVALID');
    if(!all.includes(value))bad('STAT_STEM_KEY_NOT_IN_DATA');
    key={stem:c.key.stem,leaf:c.key.leaf};
  }else if(first===undefined)bad('STAT_STEM_KEY_INVALID');
  else key={stem:Math.floor(first/10),leaf:first%10};
  key.value=key.stem*10+key.leaf;key.text=`${key.stem} | ${key.leaf}${LEAF_PARTICLE[key.leaf]} ${key.value}${unitText}`;
  const marks=[];
  if(c.marks!==undefined){
    if(!Array.isArray(c.marks)||c.marks.length>MAX_STEM_MARKS)bad('STAT_STEM_MARK_INVALID');
    for(const m of c.marks){
      onlyKeys(m,['group','ranks','median','rank'],'STAT_STEM_MARK_INVALID');
      const gi=m.group===undefined?0:intIn(m.group,0,groups.length-1,'STAT_STEM_MARK_INVALID'),n=ordered[gi].length;
      if(['ranks','median','rank'].filter(k=>m[k]!==undefined).length!==1)bad('STAT_STEM_MARK_INVALID');
      const ranks=m.median===true?(n%2?[(n+1)/2]:[n/2,n/2+1]):m.rank!==undefined?[intIn(m.rank,1,n,'STAT_STEM_MARK_INVALID')]:(Array.isArray(m.ranks)&&m.ranks.length>=1&&m.ranks.length<=MAX_STEM_MARKS?m.ranks.map(r=>intIn(r,1,n,'STAT_STEM_MARK_INVALID')):bad('STAT_STEM_MARK_INVALID'));
      for(const rank of ranks){
        if(marks.some(x=>x.group===gi&&x.rank===rank))bad('STAT_STEM_MARK_INVALID');
        const at=ordered[gi][rank-1];
        marks.push(typeof at==='number'?{group:gi,rank,value:at}:{group:gi,rank,value:null,symbol:at.symbol});
      }
    }
  }
  if(marks.length>MAX_STEM_MARKS)bad('STAT_STEM_MARK_INVALID');
  // rankLabels: the order number of every circled leaf counted from the largest (or smallest) value of its group is written above its circle
  let rankLabels=null;
  if(c.rankLabels!==undefined){
    if(c.rankLabels!=='FROM_LARGEST'&&c.rankLabels!=='FROM_SMALLEST'||!marks.length)bad('STAT_STEM_RANK_LABELS_INVALID');
    rankLabels=c.rankLabels;
  }
  // the median of a group that holds a letter leaf is a number only when the middle leaf (or both middle leaves) are whole numbers
  const medianOf=(g,i)=>{
    if(!g.symbols.length)return qstr(median(g.numbers.map(v=>Q(BigInt(v)))));
    const n=ordered[i].length,mid=(n%2?[(n+1)/2]:[n/2,n/2+1]).map(r=>ordered[i][r-1]);
    return mid.every(v=>typeof v==='number')?qstr(median(mid.map(v=>Q(BigInt(v))))):null;
  };
  // class groups: a value interval [from,to) inside one stem's row is bracketed under its leaves and its frequency written below. The frequency is counted here, never
  // taken from the author: a stated label must equal it. A letter leaf counts only when its place in the row settles it (between its whole-number neighbours).
  const classGroups=[];
  if(c.classGroups!==undefined){
    const wholeNumber=v=>typeof v==='string'&&/^\d{1,3}$/.test(v)?Number(v):v;
    if(!Array.isArray(c.classGroups)||c.classGroups.length<1||c.classGroups.length>8)bad('STAT_STEM_CLASS_INVALID');
    for(const cl of c.classGroups){
      onlyKeys(cl,['group','from','to','label'],'STAT_STEM_CLASS_INVALID');
      const group=cl.group===undefined?0:intIn(cl.group,0,groups.length-1,'STAT_STEM_CLASS_INVALID'),from=intIn(wholeNumber(cl.from),0,999,'STAT_STEM_CLASS_INVALID'),to=intIn(wholeNumber(cl.to),1,1000,'STAT_STEM_CLASS_INVALID');
      const stem=Math.floor(from/10);
      if(to<=from||Math.floor((to-1)/10)!==stem)bad('STAT_STEM_CLASS_UNSUPPORTED');
      const row=stems.includes(stem)?rows[group][stems.indexOf(stem)].leaves:[],clo=from-10*stem,chi=to-10*stem,inside=[];
      row.forEach((leaf,j)=>{
        let isIn;
        if(typeof leaf==='number')isIn=leaf>=clo&&leaf<chi;
        else{ // a letter leaf lies between the whole-number leaves on either side of it
          const left=row.slice(0,j).filter(v=>typeof v==='number').at(-1)??0,right=row.slice(j+1).find(v=>typeof v==='number')??9;
          if(left>=clo&&right<chi)isIn=true;else if(right<clo||left>=chi)isIn=false;else bad('STAT_STEM_CLASS_UNDETERMINED');
        }
        if(isIn)inside.push(j);
      });
      if(!inside.length)bad('STAT_STEM_CLASS_EMPTY');
      if(inside.at(-1)-inside[0]+1!==inside.length)bad('STAT_STEM_CLASS_UNDETERMINED');
      if(classGroups.some(x=>x.group===group&&x.from<to&&from<x.to))bad('STAT_STEM_CLASS_OVERLAP');
      let label=null;
      if(cl.label!==undefined){
        label=typeof cl.label==='number'?String(cl.label):cl.label;
        if(typeof label!=='string'||!/^\d{1,3}$/.test(label)||Number(label)!==inside.length)bad('STAT_STEM_CLASS_COUNT_MISMATCH');
      }
      classGroups.push({group,from,to,stem,first:inside[0],last:inside.at(-1),count:inside.length,label});
    }
    classGroups.sort((x,y)=>x.group-y.group||x.from-y.from);
  }
  return {schemaVersion:MODEL_VERSION,kind:'STEM_LEAF',title,unitText,key,stems,marks,
    groups:groups.map((g,i)=>({name:g.name,n:ordered[i].length,sorted:g.symbols.length?ordered[i]:g.numbers,median:medianOf(g,i),rows:rows[i]})),
    ...(classGroups.length?{classGroups}:{}),...(rankLabels?{rankLabels}:{})};
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
// Dot plot (E34): the data as stacks of dots over a number line, one dot per datum. values [whole numbers] (or counts [{value,count}]); the engine tallies them, picks the label step
// (every integer between the labelled ticks gets a short tick) and gives the line a segment that runs a unit beyond the data on each side. axisBreak {from,to}: the data have a
// gap (an outlier far from the rest): values are all <= from or >= to, and the line is cut there by a break mark so that both parts keep one unit length.
const DOT_MAX_POINTS=60,DOT_MAX_STACK=12,DOT_MIN_UNIT_PX=6.2,DOT_STEPS=[1,2,5,10,20,50,100],DOT_MAPL=40,DOT_MAPR=422,DOT_MAX_TICKS=14;
const dotSegments=(points,br,step)=>{
  const groups=br?[points.filter(p=>p.v<=br.from),points.filter(p=>p.v>=br.to)]:[points];
  return groups.map(g=>{const lo=Math.max(0,Math.floor((g[0].v-1)/step)*step),hi=Math.ceil((g.at(-1).v+1)/step)*step;return {lo,hi};});
};
// where the line is cut the two end numbers next to the break need room: the gap is half the width of each (14.5 px a digit) and 8 px
const dotGapPx=segments=>segments.length>1?14.5*(String(segments[0].hi).length+String(segments[1].lo).length)/2+8:0;
const dotUnitPx=segments=>(DOT_MAPR-DOT_MAPL-dotGapPx(segments))/segments.reduce((t,g)=>t+g.hi-g.lo,0);
function solveDot(c){
  onlyKeys(c,['kind','values','counts','step','xTitle','axisBreak'],'STAT_CHART_PLAN_INVALID');
  if((c.values===undefined)===(c.counts===undefined))bad('STAT_DOT_PLOT_INVALID');
  const whole=v=>{const n=typeof v==='string'&&/^\d{1,4}$/.test(v)?Number(v):v;return intIn(n,0,9999,'STAT_DOT_VALUE_INVALID');};
  const tally=new Map();
  if(c.values!==undefined){
    if(!Array.isArray(c.values)||c.values.length<1||c.values.length>DOT_MAX_POINTS)bad('STAT_DOT_PLOT_INVALID');
    for(const raw of c.values){const v=whole(raw);tally.set(v,(tally.get(v)??0)+1);}
  }else{
    if(!Array.isArray(c.counts)||c.counts.length<1||c.counts.length>DOT_MAX_POINTS)bad('STAT_DOT_PLOT_INVALID');
    for(const e of c.counts){
      onlyKeys(e,['value','count'],'STAT_DOT_PLOT_INVALID');
      if(e.value===undefined||e.count===undefined)bad('STAT_DOT_PLOT_INVALID');
      const v=whole(e.value),k=intIn(e.count,1,DOT_MAX_STACK,'STAT_DOT_STACK_TOO_TALL');
      if(tally.has(v))bad('STAT_DOT_PLOT_INVALID');
      tally.set(v,k);
    }
  }
  const points=[...tally.entries()].map(([v,count])=>({v,count})).sort((a,b)=>a.v-b.v);
  if(points.some(p=>p.count>DOT_MAX_STACK))bad('STAT_DOT_STACK_TOO_TALL');
  const total=points.reduce((t,p)=>t+p.count,0);
  if(total>DOT_MAX_POINTS)bad('STAT_DOT_PLOT_INVALID');
  let br=null;
  if(c.axisBreak!==undefined){
    onlyKeys(c.axisBreak,['from','to'],'STAT_DOT_BREAK_INVALID');
    const from=intIn(c.axisBreak.from,0,9999,'STAT_DOT_BREAK_INVALID'),to=intIn(c.axisBreak.to,0,9999,'STAT_DOT_BREAK_INVALID');
    if(to-from<2||points.some(p=>p.v>from&&p.v<to)||!points.some(p=>p.v<=from)||!points.some(p=>p.v>=to))bad('STAT_DOT_BREAK_INVALID');
    br={from,to};
  }
  // the labelled ticks must leave room for their numbers: a step is wide enough when it is more than the longest number of the line (14.5 px a digit and 6 px between) apart
  const fits=step=>{
    const seg=dotSegments(points,br,step),unit=dotUnitPx(seg);
    return (seg.length<2||seg[0].hi<seg[1].lo)&&seg.every(g=>g.hi-g.lo>=step&&(g.hi-g.lo)/step+1<=DOT_MAX_TICKS&&(step*unit>=14.5*String(g.hi).length+6||(g.hi-g.lo)/step<1))&&unit>=DOT_MIN_UNIT_PX;
  };
  let step;
  if(c.step!==undefined){step=intIn(c.step,1,500,'STAT_DOT_STEP_INVALID');if(!fits(step))bad('STAT_DOT_PLOT_TOO_DENSE');}
  else{step=DOT_STEPS.find(fits)??bad('STAT_DOT_PLOT_TOO_DENSE');}
  const segments=dotSegments(points,br,step);
  return {schemaVersion:MODEL_VERSION,kind:'DOT_PLOT',step,xTitle:titleText(c.xTitle,'STAT_TITLE_INVALID',''),total,maxStack:Math.max(...points.map(p=>p.count)),
    points:points.map(p=>({value:String(p.v),count:p.count})),segments,...(br?{axisBreak:br}:{})};
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
// highlightGroups [{highlight: condition | cells: [[col,row]...], tone: 1|2}] (E34): groups of cells in different greys (a cell in two groups is refused). colVar / rowVar: a lowercase letter
// (written in the corner and used in conditions), null (nothing written) or a Hangul phrase (written beside the table); one that is not a letter is called a (across) or b (down) in conditions.
function solveDice(c){
  onlyKeys(c,['kind','faces','cell','highlight','highlightGroups','colVar','rowVar'],'STAT_CHART_PLAN_INVALID');
  const faces=c.faces===undefined?6:intIn(c.faces,2,8,'STAT_DICE_FACES_INVALID');
  const cell=c.cell===undefined?'PAIR':c.cell;
  if(!['PAIR','SUM','PRODUCT','NONE'].includes(cell))bad('STAT_DICE_CELL_INVALID');
  const nameOf=(v,fallback)=>{
    if(v===undefined)return {letter:fallback,show:'LETTER'};
    if(v===null)return {letter:fallback,show:'NONE'};
    if(typeof v==='string'&&/^[a-z]$/.test(v))return {letter:v,show:'LETTER'};
    if(typeof v==='string'&&/^[가-힣][가-힣 ]{0,7}$/u.test(v)&&!/ {2}| $/.test(v))return {letter:fallback,show:'TEXT',text:v};
    return bad('STAT_DICE_VARIABLE_INVALID');
  };
  const col=nameOf(c.colVar,'a'),row=nameOf(c.rowVar,'b'),colVar=col.letter,rowVar=row.letter;
  if(colVar===rowVar)bad('STAT_DICE_VARIABLE_INVALID');
  if(c.highlight!==undefined&&c.highlightGroups!==undefined)bad('STAT_DICE_GROUP_INVALID');
  if(c.highlight!==undefined)checkPredicate(c.highlight,[colVar,rowVar]);
  let groups=null;
  if(c.highlightGroups!==undefined){
    if(!Array.isArray(c.highlightGroups)||c.highlightGroups.length<1||c.highlightGroups.length>4)bad('STAT_DICE_GROUP_INVALID');
    groups=c.highlightGroups.map(g=>{
      onlyKeys(g,['highlight','cells','tone'],'STAT_DICE_GROUP_INVALID');
      if((g.highlight===undefined)===(g.cells===undefined))bad('STAT_DICE_GROUP_INVALID');
      const tone=g.tone===undefined?1:g.tone;
      if(tone!==1&&tone!==2)bad('STAT_DICE_GROUP_INVALID');
      if(g.highlight!==undefined){checkPredicate(g.highlight,[colVar,rowVar]);return {tone,highlight:g.highlight};}
      if(!Array.isArray(g.cells)||g.cells.length<1||g.cells.length>faces*faces)bad('STAT_DICE_GROUP_INVALID');
      const seen=new Set();
      for(const e of g.cells){
        if(!Array.isArray(e)||e.length!==2)bad('STAT_DICE_GROUP_INVALID');
        const a=intIn(e[0],1,faces,'STAT_DICE_GROUP_INVALID'),b=intIn(e[1],1,faces,'STAT_DICE_GROUP_INVALID');
        if(seen.has(a*100+b))bad('STAT_DICE_GROUP_INVALID');
        seen.add(a*100+b);
      }
      return {tone,cells:g.cells.map(e=>[e[0],e[1]])};
    });
  }
  const cells=[];
  for(let r=1;r<=faces;r++)for(let k=1;k<=faces;k++){
    const env={[colVar]:k,[rowVar]:r};
    let highlighted=c.highlight===undefined?false:predicate(c.highlight,[colVar,rowVar],env),tone=0;
    if(groups){
      const hit=groups.filter(g=>g.highlight?predicate(g.highlight,[colVar,rowVar],env):g.cells.some(e=>e[0]===k&&e[1]===r));
      if(hit.length>1)bad('STAT_DICE_GROUP_OVERLAP');
      highlighted=hit.length===1;tone=highlighted?hit[0].tone:0;
    }
    cells.push({col:k,row:r,text:cell==='PAIR'?`(${k},${r})`:cell==='SUM'?String(k+r):cell==='PRODUCT'?String(k*r):'',highlighted,...(groups&&highlighted?{tone}:{})});
  }
  if(groups&&groups.some(g=>!cells.some(x=>x.highlighted&&x.tone===g.tone&&(g.highlight?predicate(g.highlight,[colVar,rowVar],{[colVar]:x.col,[rowVar]:x.row}):g.cells.some(e=>e[0]===x.col&&e[1]===x.row)))))bad('STAT_DICE_GROUP_EMPTY');
  return {schemaVersion:MODEL_VERSION,kind:'DICE_TABLE',faces,cell,colVar,rowVar,...(col.show!=='LETTER'?{colLabel:col.show==='TEXT'?col.text:null}:{}),...(row.show!=='LETTER'?{rowLabel:row.show==='TEXT'?row.text:null}:{}),
    highlight:c.highlight??null,...(groups?{highlightGroups:groups}:{}),cells,highlightedCount:cells.filter(x=>x.highlighted).length,total:faces*faces};
}
function solveTree(c){
  onlyKeys(c,['kind','root','showPathProbability','highlightPaths','pathColumn'],'STAT_CHART_PLAN_INVALID');
  if(c.showPathProbability!==undefined&&typeof c.showPathProbability!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  // pathColumn (E34): the path probabilities stand in one column right of the deepest leaf instead of each beside its own leaf (for leaves of different depths, whose wide labels would meet the deeper branches)
  if(c.pathColumn!==undefined&&typeof c.pathColumn!=='boolean')bad('STAT_CHART_PLAN_INVALID');
  if(c.pathColumn===true&&c.showPathProbability!==true)bad('STAT_TREE_PATH_NEEDS_PROBABILITIES');
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
  // highlightPaths [[label, label, ...]] (E34): each path names the labels from the root's child down to a leaf; its branches are drawn heavy and its leaf is ringed
  const lit=[];
  if(c.highlightPaths!==undefined){
    if(!Array.isArray(c.highlightPaths)||c.highlightPaths.length<1||c.highlightPaths.length>12)bad('STAT_TREE_HIGHLIGHT_INVALID');
    for(const path of c.highlightPaths){
      if(!Array.isArray(path)||path.length<1||path.length>3||path.some(x=>typeof x!=='string'))bad('STAT_TREE_HIGHLIGHT_INVALID');
      let cur=byId.get('n0');
      for(const label of path){const next=cur.children.map(id=>byId.get(id)).filter(n=>n.label===label);if(next.length!==1)bad('STAT_TREE_HIGHLIGHT_INVALID');cur=next[0];}
      if(cur.children.length||lit.includes(cur.id))bad('STAT_TREE_HIGHLIGHT_INVALID');
      lit.push(cur.id);
    }
    lit.sort((a,b)=>leaves.findIndex(n=>n.id===a)-leaves.findIndex(n=>n.id===b));
  }
  return {schemaVersion:MODEL_VERSION,kind:'TREE',showPathProbability:c.showPathProbability===true,hasProbabilities:hasP,maxDepth:Math.max(...nodes.map(n=>n.depth)),...(lit.length?{highlightLeaves:lit}:{}),...(c.pathColumn===true?{pathColumn:true}:{}),
    nodes:nodes.map(n=>({id:n.id,parent:n.parent,depth:n.depth,label:n.label,p:n.p&&qstr(n.p),path:hasP&&!n.children.length?qstr(n.path):null,children:n.children})),leaves:leaves.map(n=>n.id)};
}

// --- text widths for the frame: a figure whose legend, axis title or leaf labels need more room than the standard frame grows (E34) ---------------------------------
// The size of the figure must be known before it is composed (the Archive measures that size), so the room labels need is worked out from the model with the same
// typesetter and the policy's font size that composing uses. Without a policy the smallest base font (20 px) is assumed.
let measureTypeset=null;
const DEFAULT_FONT_PX=20,MEASURE_IDENTITY={visualAssetKey:'sha256:stat-chart-measure'};
function labelSize(label,fontPx){
  try{
    measureTypeset??=typesetter();
    return measureTypeset({id:'measure',owner:'measure',factRole:'DERIVED_INTERMEDIATE',fontPx,panelId:'stat-chart',...(label.kind==='MATH'?{kind:'MATH',tex:label.tex}:{kind:'TEXT',text:label.text})},MEASURE_IDENTITY).intrinsic;
  }catch(error){return {width:0,height:0};}   // a label that cannot be typeset is refused by composing with its own code
}
const textWidth=(text,fontPx)=>labelSize({kind:'TEXT',text},fontPx).width;

// --- geometry shared by the charts -------------------------------------------------------------------------------------------------------
const W=548,SAFE=12,MAPL=76,MAPR=422,ARROW_TIP=434,TITLE_X=442,AXIS_TOP=54,TICK=5,LABEL_BELOW=34;
const STYLE={
  axis:'stroke="#111" stroke-width="1.2" fill="none"',tick:'stroke="#111" stroke-width="1.2" fill="none"',grid:'stroke="#b4b4b4" stroke-width="0.8" fill="none" stroke-dasharray="3 3"',
  arrow:'fill="#111" stroke="none"',bar:'fill="#ececec" stroke="#111" stroke-width="1.2"',barHi:'fill="#b5b5b5" stroke="#111" stroke-width="1.2"',
  poly0:'stroke="#111" stroke-width="2" fill="none"',poly1:'stroke="#111" stroke-width="2" fill="none" stroke-dasharray="7 4"',dot:'fill="#111" stroke="none"',
  brk:'stroke="#111" stroke-width="1.2" fill="none"',frame:'fill="none" stroke="#111" stroke-width="1.2"',rule:'stroke="#111" stroke-width="1.2" fill="none"',
  mark:'fill="none" stroke="#111" stroke-width="1.8"',box:'fill="#ececec" stroke="#111" stroke-width="1.4"',median:'stroke="#111" stroke-width="3" fill="none"',
  whisker:'stroke="#111" stroke-width="1.4" fill="none"',cell:'fill="#fff" stroke="#111" stroke-width="1"',cellHi:'fill="#c9c9c9" stroke="#111" stroke-width="1"',
  cellHi2:'fill="#9b9b9b" stroke="#111" stroke-width="1"',head:'fill="#f1f1f1" stroke="#111" stroke-width="1"',diag:'stroke="#555" stroke-width="1.2" fill="none" stroke-dasharray="6 4"',branch:'stroke="#111" stroke-width="1.4" fill="none"',branchHi:'stroke="#111" stroke-width="3" fill="none"',
  legend0:'stroke="#111" stroke-width="2" fill="none"',legend1:'stroke="#111" stroke-width="2" fill="none" stroke-dasharray="7 4"',diagonal:'stroke="#555" stroke-width="1.2" fill="none" stroke-dasharray="6 4"',
  barHi2:'fill="#8e8e8e" stroke="#111" stroke-width="1.2"',barR:'fill="#ececec" stroke="#111" stroke-width="1.2" stroke-dasharray="5 3"',barHiR:'fill="#b5b5b5" stroke="#111" stroke-width="1.2" stroke-dasharray="5 3"',
  barHi2R:'fill="#8e8e8e" stroke="#111" stroke-width="1.2" stroke-dasharray="5 3"',markRing:'fill="none" stroke="#111" stroke-width="1.8"',markDisc:'fill="#111" stroke="none"',
  sum0:'stroke="#111" stroke-width="1.2" fill="none"',sum1:'stroke="#111" stroke-width="1.2" fill="none" stroke-dasharray="4 3"',
  barU:'fill="none" stroke="#111" stroke-width="1.2" stroke-dasharray="1.5 3.5"'
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
// A class-sum bracket sits under the x tick labels: the first row's bottom line is SUM_Y0 below the axis, each further row (brackets that would overlap) SUM_PITCH lower; its text hangs beneath it.
const SUM_Y0=36,SUM_PITCH=44,SUM_INSET=2.5,SUM_ARM=5,SUM_TEXT_H=33,SUM_TEXT_GAP=3;
const SUM_JOIN_DROP=10; // a group of class runs (classSums[].classes): each run's bracket sends a stem this far down to one joining line, the label hangs beneath it
const UNKNOWN_BAR_FRACTION=0.4; // a hidden class drawn as a dotted outline this fraction of the plot high: a place-holder, not a value
const MARK_R={1:8,2:6};
function freqSpec(m,ctx){
  const fontPx=ctx?.fontPx??DEFAULT_FONT_PX;
  const n=m.classes.length,w=N(m.width),b0=N(m.boundaries[0]),bn=N(m.boundaries[n]),poly=m.kind==='FREQUENCY_POLYGON'||m.polygon;
  const marks=m.marks??[],sums=m.classSums??[],restored=m.restored??[],tone2=m.highlightTone2??[];
  let lowU,yAxisU,breakU=null;
  if(b0===0){lowU=poly?-.75*w:0;yAxisU=0;}else{lowU=b0-(poly?1.2:.8)*w;yAxisU=lowU;breakU=lowU+.3*w;}
  // each class sum goes in the first row where no earlier bracket of the figure overlaps its classes
  // (a figure with a group of runs puts the plain brackets first and the groups below them, so a group's joining line never runs through a plain bracket's label)
  const groups=sums.some(sm=>sm.runs),pitch=SUM_PITCH+(groups?SUM_JOIN_DROP:0),rowOf=sums.map(()=>null);
  [...sums.keys()].sort((a,b)=>(groups?(sums[a].runs?1:0)-(sums[b].runs?1:0):0)||a-b).forEach(k=>{const sm=sums[k];let r=0;while(sums.some((o,j)=>rowOf[j]===r&&j!==k&&o.from<=sm.to&&sm.from<=o.to))r++;rowOf[k]=r;});
  const sumRows=rowOf.length?Math.max(...rowOf)+1:0;
  // axis titles longer than 14 characters break into two lines (a y title adds a line of room above the axis); the legend and the x title may widen the frame
  const xLines=titleLines(m.xTitle),yLines=titleLines(m.yTitle),lineH=Math.ceil(1.5*fontPx),top=AXIS_TOP+(yLines.length-1)*lineH;
  const right=Math.max(...xLines.map(line=>TITLE_X+textWidth(line,fontPx)),...(m.series.length>1?m.series.map(sr=>TITLE_X+27+textWidth(sr.name,fontPx)):[0])),extraWidth=Math.max(0,Math.ceil(right+SAFE)-W);
  const highU=bn+(poly?.8:.45)*w,PLOT_H=210,PT=top+18,BASE=PT+PLOT_H,H=sumRows?BASE+SUM_Y0+(sumRows-1)*pitch+(groups?SUM_JOIN_DROP:0)+SUM_TEXT_GAP+SUM_TEXT_H+SAFE:BASE+TICK+4+LABEL_BELOW+SAFE;
  const px=u=>r6(MAPL+(u-lowU)/(highU-lowU)*(MAPR-MAPL)),T=N(m.y.top),py=v=>r6(BASE-v/T*PLOT_H),yAxisPx=px(yAxisU);
  const prims=[],labels=[];
  const ys=m.y.ticks.map(t=>({t,v:N(t)}));
  if(m.grid){
    const gx2=px(bn+(poly?.5*w:0));
    for(const {t,v} of ys)prims.push(L(`grid-y-${t}`,'grid','grid',yAxisPx,py(v),gx2,py(v),{value:t},20));
    for(const [i,bb] of m.boundaries.entries())if(i>0)prims.push(L(`grid-x-${i}`,'grid','grid',px(N(bb)),BASE,px(N(bb)),PT,{value:bb},20));
  }
  if(m.kind==='HISTOGRAM')for(const [i,k] of m.classes.entries()){
    if(m.series[0].values[i]===null)continue; // a hidden class has no bar
    const v=N(m.series[0].values[i]),tone=m.highlight.includes(i)?(tone2.includes(i)?2:1):0,rebuilt=restored.includes(i);
    prims.push(rect(`bar-s0-${i}`,'bar',['bar','barHi','barHi2'][tone]+(rebuilt?'R':''),px(N(k.lo)),py(v),px(N(k.hi))-px(N(k.lo)),BASE-py(v),{series:0,class:i,highlight:tone,...(rebuilt?{restored:1}:{})},40));
  }
  const maxRel=Math.max(...(m.unknown??[]).map(u=>u.relHeight===undefined?1:N(u.relHeight)),1e-9);
  for(const u of m.unknown??[]){ // a dotted outline in the hidden class's place with its symbol inside (never a bar: no value is drawn)
    const k=m.classes[u.class],x0=px(N(k.lo)),x1=px(N(k.hi)),h=u.relHeight===undefined?UNKNOWN_BAR_FRACTION*PLOT_H:UNKNOWN_BAR_FRACTION*PLOT_H*N(u.relHeight)/maxRel;
    prims.push(rect(`unknown-s0-${u.class}`,'bar-unknown','barU',x0,BASE-h,x1-x0,h,{series:0,class:u.class},40));
    labels.push(math(`unknown-${u.class}-label`,'unknown-label',`unknown-s0-${u.class}`,DISPLAY+u.label,u.label,'center','middle',(x0+x1)/2,BASE-h/2,{class:u.class}));
  }
  arrows(prims,{xStartPx:px(lowU),yAxisPx,base:BASE,tipY:top});
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
  xLines.forEach((line,j)=>labels.push(textLabel(j?`x-title-${j+1}`:'x-title','axis-title','x-axis',line,'start','middle',TITLE_X,BASE+(j-(xLines.length-1)/2)*lineH)));
  yLines.forEach((line,j)=>{ // a y title wider than the room left of the axis starts at the frame's edge instead of overhanging it
    const wide=yAxisPx-textWidth(line,fontPx)/2<SAFE;
    labels.push(textLabel(j?`y-title-${j+1}`:'y-title','axis-title','y-axis',line,wide?'start':'center','bottom',wide?SAFE:yAxisPx,top-4-(yLines.length-1-j)*lineH));
  });
  const at=(s,k)=>[px(N(m.series[s].vertices[k][0])),py(N(m.series[s].vertices[k][1]))]; // the drawn place of a (known) polygon vertex
  if(poly)for(const [s,sr] of m.series.entries()){
    const pts=sr.vertices.map(v=>v===null?null:[px(N(v[0])),py(N(v[1]))]);
    // a hidden class breaks the polygon: one polyline per run of consecutive known vertices (a lone vertex is only its dot)
    const runs=[];let run=[];
    for(const p of [...pts,null]){if(p)run.push(p);else{if(run.length)runs.push(run);run=[];}}
    runs.filter(r=>r.length>=2).forEach((r,j)=>prims.push({t:'polyline',id:j?`polygon-s${s}~${j}`:`polygon-s${s}`,role:'polygon',cls:'poly'+s,points:r,data:{series:s},layer:50}));
    pts.forEach((p,k)=>{if(p)prims.push({t:'circle',id:`vertex-s${s}-${k}`,role:'point',cls:'dot',cx:p[0],cy:p[1],r:3.2,data:{series:s,vertex:k},layer:70});});
  }
  for(const mk of marks){ // a marked polygon point: a ring (tone 1) or a larger solid dot (tone 2) on its vertex
    const [cx,cy]=at(mk.series,mk.class+1);
    prims.push({t:'circle',id:`mark-s${mk.series}-c${mk.class}`,role:'point-mark',cls:mk.tone===1?'markRing':'markDisc',cx,cy,r:MARK_R[mk.tone],data:{series:mk.series,class:mk.class,tone:mk.tone},layer:65});
  }
  // value labels: the default place is centred above the bar top / polygon vertex; resolveValueLabels() moves a label only when that place touches a line or another label
  const ringed=(s,k)=>marks.some(x=>x.series===s&&x.class===k&&x.tone===1);
  const valueLabel=(id,owner,s,i,extra)=>{
    const v=m.series[s].values[i],[ax,ay]=at(s,i+1),gap=poly?(ringed(s,i)?MARK_R[1]+5.8:9):4;
    labels.push({...math(id,'value',owner,DISPLAY+qtex(P(v)),v,'center','bottom',ax,ay-gap,extra),place:{x:ax,y:ay,gap}});
  };
  if(m.showValues)for(const [i,k] of m.classes.entries()){
    const v=m.series[0].values[i];if(v===null||N(v)===0)continue;
    if(restored.includes(i)&&!m.showRestoredValues||(m.hideValues??[]).includes(i))continue; // the value of a restored bar, or of a class the plan hides, is what the problem asks for
    valueLabel(`value-${i}`,m.kind==='HISTOGRAM'&&!poly?`bar-s0-${i}`:`vertex-s0-${i+1}`,0,i,{value:v,class:i});
  }
  if(m.showEndValues)for(const k of [0,n+1]){ // the two zero-frequency end points of a polygon write their 0, placed like a value label
    const [ax,ay]=at(0,k),gap=9;
    labels.push({...math(`end-value-${k?'last':'first'}`,'end-value',`vertex-s0-${k}`,DISPLAY+'0','0','center','bottom',ax,ay-gap,{vertex:k}),place:{x:ax,y:ay,gap}});
  }
  for(const mk of marks)if(mk.showValue)valueLabel(`value-s${mk.series}-c${mk.class}`,`vertex-s${mk.series}-${mk.class+1}`,mk.series,mk.class,{value:m.series[mk.series].values[mk.class],class:mk.class,series:mk.series});
  // legend entries stand 30 apart; a font so large that two lines would touch (the frame grew, so the policy's font did) spaces them by its own line height
  const legendHeight=m.series.length>1?labelSize({kind:'TEXT',text:'수영'},fontPx).height:0,legendPitch=legendHeight<=30?30:Math.ceil(legendHeight)+1;
  if(m.series.length>1)for(const [s,sr] of m.series.entries()){
    const y=PT+14+s*legendPitch;
    prims.push(L(`legend-line-${s}`,'legend-line','legend'+s,TITLE_X,y,TITLE_X+20,y,{series:s}));
    labels.push(textLabel(`legend-${s}`,'legend',`legend-line-${s}`,sr.name,'start','middle',TITLE_X+27,y,{series:s}));
  }
  sums.forEach((sm,k)=>{ // a bracket under the axis labels from the left edge of class `from` to the right edge of class `to`; its sum is written beneath
    const yb=BASE+SUM_Y0+rowOf[k]*pitch,id=`class-sum-${k}`;
    if(sm.runs){ // a group of runs: one bracket per run, a stem from each down to one joining line, the sum written under the middle of it
      const spans=sm.runs.map(([a,b])=>({a,b,xl:px(N(m.boundaries[a]))+SUM_INSET,xr:px(N(m.boundaries[b+1]))-SUM_INSET}));
      spans.forEach((sp,j)=>prims.push({t:'polyline',id:`${id}-run-${j+1}`,role:'class-sum',cls:'sum'+sm.series,points:[[sp.xl,yb-SUM_ARM],[sp.xl,yb],[sp.xr,yb],[sp.xr,yb-SUM_ARM]],data:{series:sm.series,from:sp.a,to:sp.b,group:k,run:j+1},layer:50}));
      const xc=spans.map(sp=>(sp.xl+sp.xr)/2),yj=yb+SUM_JOIN_DROP;
      prims.push({t:'polyline',id:`${id}-join`,role:'class-sum-join',cls:'sum'+sm.series,points:[[xc[0],yb],[xc[0],yj],[xc.at(-1),yj],[xc.at(-1),yb]],data:{series:sm.series,from:sm.from,to:sm.to,group:k},layer:50});
      xc.slice(1,-1).forEach((x,j)=>prims.push(L(`${id}-stem-${j+2}`,'class-sum-stem','sum'+sm.series,x,yb,x,yj,{group:k,run:j+2},50)));
      if(sm.label!==null)labels.push(textLabel(`${id}-label`,'class-sum',`${id}-join`,sm.label+sm.unit,'center','top',(xc[0]+xc.at(-1))/2,yj+SUM_TEXT_GAP,{series:sm.series,from:sm.from,to:sm.to,group:k}));
      return;
    }
    const xl=px(N(m.boundaries[sm.from]))+SUM_INSET,xr=px(N(m.boundaries[sm.to+1]))-SUM_INSET;
    prims.push({t:'polyline',id,role:'class-sum',cls:'sum'+sm.series,points:[[xl,yb-SUM_ARM],[xl,yb],[xr,yb],[xr,yb-SUM_ARM]],data:{series:sm.series,from:sm.from,to:sm.to},layer:50});
    if(sm.label!==null)labels.push(textLabel(`${id}-label`,'class-sum',id,sm.label+sm.unit,'center','top',(xl+xr)/2,yb+SUM_TEXT_GAP,{series:sm.series,from:sm.from,to:sm.to}));
  });
  const newer=marks.length||sums.length||restored.length||tone2.length||(m.unknown??[]).length||m.showEndValues||m.series.some(sr=>sr.vertices.includes(null)); // a plan using none of the newer fields keeps its figure exactly
  return {size:{width:W+extraWidth,height:H},prims,labels,valueClearance:newer?2.5:0};
}
function stemSpec(m){
  const classes=m.classGroups??[],two=m.groups.length===2,PITCH=24,STEMW=48,PAD=14,HEAD_H=34,LBL=m.rankLabels?18:0,ROW_H=(classes.length?54:30)+LBL,RAISE=classes.length?10:0,X0=SAFE+6; // RAISE: leaves sit above the row middle so a class bracket and its count fit under them; LBL: room above each row for the order numbers of circled leaves
  const rowCy=ri=>top+HEAD_H+ROW_H*(ri+.5)-RAISE+LBL/2;
  const maxLeaves=Math.max(1,...m.groups.flatMap(g=>g.rows.map(r=>r.leaves.length)));
  const leafW=maxLeaves*PITCH+PAD,tableW=(two?2*leafW:leafW)+STEMW,top=SAFE+(m.title?34:0)+2;
  const rows=m.stems.length,trim=classes.some(k=>k.stem===m.stems.at(-1))?0:2*RAISE,bottom=top+HEAD_H+rows*ROW_H-trim,width=Math.max(Math.ceil(tableW+2*X0),230),x0=r6((width-tableW)/2);
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
    const cy=rowCy(ri);
    labels.push(math(`stem-${s}`,'stem','table-frame',String(s),String(s),'center','middle',stemCx,cy,{value:String(s)}));
    for(const [gi,g] of m.groups.entries())g.rows[ri].leaves.forEach((leaf,j)=>{
      if(typeof leaf==='object')labels.push(math(`leaf-g${gi}-${s}-${j}`,'leaf','table-frame',leaf.symbol,leaf.symbol,'center','middle',leafX(gi,j),cy,{symbol:leaf.symbol,group:gi,stem:s,index:j}));
      else labels.push(math(`leaf-g${gi}-${s}-${j}`,'leaf','table-frame',String(leaf),String(leaf),'center','middle',leafX(gi,j),cy,{value:String(s*10+leaf),group:gi,stem:s,index:j}));
    });
  }
  for(const mk of m.marks){
    // the rank-th smallest leaf: walk the rows (ascending stems) until rank leaves have been passed; that row and place is where the circle goes
    let left=mk.rank,ri=0;
    while(left>m.groups[mk.group].rows[ri].leaves.length){left-=m.groups[mk.group].rows[ri].leaves.length;ri++;}
    const data=mk.symbol===undefined?{group:mk.group,rank:mk.rank,value:mk.value}:{group:mk.group,rank:mk.rank,symbol:mk.symbol};
    prims.push({t:'ellipse',id:`mark-g${mk.group}-r${mk.rank}`,role:'mark',cls:'mark',cx:r6(leafX(mk.group,left-1)),cy:r6(rowCy(ri)),rx:12,ry:13,data,layer:60});
    if(m.rankLabels){
      const order=m.rankLabels==='FROM_LARGEST'?m.groups[mk.group].n-mk.rank+1:mk.rank,id=`mark-g${mk.group}-r${mk.rank}`;
      labels.push(math(`${id}-order`,'rank-number',id,String(order),String(order),'center','bottom',leafX(mk.group,left-1),rowCy(ri)-13-2,{group:mk.group,rank:mk.rank,order}));
    }
  }
  for(const cl of classes){ // a bracket under the leaves of the class, its frequency centred below it
    const ri=m.stems.indexOf(cl.stem),xa=leafX(cl.group,cl.first),xb=leafX(cl.group,cl.last),xl=Math.min(xa,xb)-10,xr=Math.max(xa,xb)+10,yb=rowCy(ri)+17,id=`class-g${cl.group}-${cl.from}-${cl.to}`;
    prims.push({t:'polyline',id,role:'class-bracket',cls:'rule',points:[[xl,yb-5],[xl,yb],[xr,yb],[xr,yb-5]],data:{group:cl.group,from:cl.from,to:cl.to},layer:50});
    if(cl.label!==null)labels.push(math(`${id}-count`,'class-count',id,cl.label,cl.label,'center','top',(xl+xr)/2,yb+3,{group:cl.group,from:cl.from,to:cl.to,value:cl.label}));
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
function diceSpec(m,ctx){
  const fontPx=ctx?.fontPx??DEFAULT_FONT_PX,CELL=m.cell==='PAIR'?54:40,n=m.faces;
  // a variable written beside the table (a Hangul phrase) takes a band above the columns or left of the rows; letters stand in the corner
  const colText=typeof m.colLabel==='string',rowText=typeof m.rowLabel==='string',lineH=Math.ceil(1.5*fontPx);
  const x0=SAFE+14+(rowText?Math.ceil(textWidth(m.rowLabel,fontPx))+10:0),y0=SAFE+14+(colText?lineH+6:0),width=x0+(n+1)*CELL+SAFE+14,height=y0+(n+1)*CELL+SAFE+14;
  const colLetter=m.colLabel===undefined,rowLetter=m.rowLabel===undefined;
  const prims=[],labels=[];
  prims.push(rect('corner','head','head',x0,y0,CELL,CELL,{},40));
  if(colLetter||rowLetter)prims.push(L('corner-diagonal','rule','rule',x0,y0,x0+CELL,y0+CELL,{},41));
  if(colLetter)labels.push(math('corner-col','var','corner',m.colVar,m.colVar,'center','middle',x0+CELL*.72,y0+CELL*.3,{value:m.colVar,axis:'col'}));
  if(rowLetter)labels.push(math('corner-row','var','corner',m.rowVar,m.rowVar,'center','middle',x0+CELL*.28,y0+CELL*.7,{value:m.rowVar,axis:'row'}));
  if(colText)labels.push(textLabel('name-col','var-name','corner',m.colLabel,'center','bottom',x0+CELL+n*CELL/2,y0-4,{value:m.colLabel,axis:'col'}));
  if(rowText)labels.push(textLabel('name-row','var-name','corner',m.rowLabel,'end','middle',x0-8,y0+CELL+n*CELL/2,{value:m.rowLabel,axis:'row'}));
  for(let k=1;k<=n;k++){
    prims.push(rect(`head-col-${k}`,'head','head',x0+k*CELL,y0,CELL,CELL,{axis:'col',value:k},40),rect(`head-row-${k}`,'head','head',x0,y0+k*CELL,CELL,CELL,{axis:'row',value:k},40));
    labels.push(math(`head-col-${k}-label`,'head-value',`head-col-${k}`,String(k),String(k),'center','middle',x0+(k+.5)*CELL,y0+CELL/2,{value:String(k),axis:'col'}));
    labels.push(math(`head-row-${k}-label`,'head-value',`head-row-${k}`,String(k),String(k),'center','middle',x0+CELL/2,y0+(k+.5)*CELL,{value:String(k),axis:'row'}));
  }
  for(const c of m.cells){
    const id=`cell-${c.col}-${c.row}`;
    prims.push(rect(id,'cell',c.highlighted?(c.tone===2?'cellHi2':'cellHi'):'cell',x0+c.col*CELL,y0+c.row*CELL,CELL,CELL,{col:c.col,row:c.row,highlight:c.highlighted?(c.tone??1):0},40));
    if(c.text)labels.push(math(id+'-label','cell-value',id,c.text,c.text,'center','middle',x0+(c.col+.5)*CELL,y0+(c.row+.5)*CELL,{value:c.text,col:c.col,row:c.row}));
  }
  return {size:{width,height},prims,labels};
}
const TREE_COLW=150,TREE_ROW=68,TREE_X0=44,TREE_TOP=58;
// A tree that uses the E34 marks (highlighted paths, a path column) spaces its leaves wider, and wider still with a larger font, so that the stacked fractions of neighbouring branches keep apart.
const treeRow=(m,fontPx)=>m.pathColumn||m.highlightLeaves?Math.ceil(TREE_ROW*1.15*Math.max(1,fontPx/20)):TREE_ROW;
function treeCenters(m,rowH=TREE_ROW){
  const byId=new Map(m.nodes.map(n=>[n.id,n])),pos=new Map();let leaf=0;
  const place=id=>{const n=byId.get(id);if(!n.children.length){pos.set(id,TREE_TOP+rowH*leaf++);return;}n.children.forEach(place);pos.set(id,(pos.get(n.children[0])+pos.get(n.children[n.children.length-1]))/2);};
  place('n0');
  return new Map(m.nodes.map(n=>[n.id,{x:r6(TREE_X0+n.depth*TREE_COLW),y:r6(pos.get(n.id))}]));
}
function treeSpec(m,ctx){
  const fontPx=ctx?.fontPx??DEFAULT_FONT_PX;
  const rowH=treeRow(m,fontPx),c=treeCenters(m,rowH),leaves=m.leaves.length,width0=TREE_X0+m.maxDepth*TREE_COLW+(m.showPathProbability?190:80),height=TREE_TOP*2+(leaves-1)*rowH;
  const labels=[],prims=[],byIdNode=new Map(m.nodes.map(n=>[n.id,n])),lit=new Set(m.highlightLeaves??[]),litBranch=new Set();
  for(const id of lit)for(let cur=byIdNode.get(id);cur&&cur.parent!==null;cur=byIdNode.get(cur.parent))litBranch.add(cur.id);
  const pathTex=n=>{const chain=[];for(let id=n.id;id;id=byIdNode.get(id).parent)chain.unshift(byIdNode.get(id));return DISPLAY+chain.slice(1).map(x=>qfrac(P(x.p))).join('\\times ')+'='+qfrac(P(n.path));};
  // a frame too narrow for a leaf's label and its path probability (a product of three fractions is wide) grows to hold them
  let need=0;
  if(m.showPathProbability){
    const leafNodes=m.nodes.filter(x=>!x.children.length),nodeWidth=n=>n.label===null?0:labelSize(/^[A-Za-z0-9]{1,3}$/.test(n.label)?{kind:'MATH',tex:n.label}:{kind:'TEXT',text:n.label},fontPx).width;
    const pathWidth=n=>labelSize({kind:'MATH',tex:pathTex(n)},fontPx).width;
    if(m.pathColumn)need=Math.max(...leafNodes.map(n=>TREE_X0+n.depth*TREE_COLW+nodeWidth(n)/2))+16+Math.max(...leafNodes.map(pathWidth))+SAFE;
    else for(const n of leafNodes)need=Math.max(need,TREE_X0+n.depth*TREE_COLW+nodeWidth(n)/2+16+pathWidth(n)+SAFE);
  }
  const width=Math.max(width0,Math.ceil(need));
  for(const n of m.nodes){
    const p=c.get(n.id);
    if(n.label!==null){
      const asMath=/^[A-Za-z0-9]{1,3}$/.test(n.label);
      labels.push(asMath?math(`node-${n.id}`,'node',n.id,n.label,n.label,'center','middle',p.x,p.y,{node:n.id,cx:p.x,cy:p.y,value:n.label}):textLabel(`node-${n.id}`,'node',n.id,n.label,'center','middle',p.x,p.y,{node:n.id,cx:p.x,cy:p.y,value:n.label}));
    }else prims.push({t:'circle',id:`node-${n.id}`,role:'point',cls:'dot',cx:p.x,cy:p.y,r:4,data:{node:n.id},layer:70});
    if(lit.has(n.id))prims.push({t:'ellipse',id:`leaf-ring-${n.id}`,role:'leaf-ring',cls:'markRing',cx:p.x,cy:p.y,rx:9,ry:9,data:{leaf:n.id},layer:65});
    if(n.parent!==null){
      prims.push({t:'branch',id:`branch-${n.id}`,role:'branch',cls:litBranch.has(n.id)?'branchHi':'branch',parent:n.parent,child:n.id,data:{parent:n.parent,child:n.id,...(litBranch.has(n.id)?{highlight:1}:{})},layer:30});
      if(m.hasProbabilities)labels.push({id:`branch-${n.id}-p`,role:'branch-probability',owner:`branch-${n.id}`,kind:'MATH',tex:DISPLAY+qfrac(P(n.p)),plain:n.p,anchor:{x:0,y:0,ax:'center',ay:'middle'},extra:{value:n.p,child:n.id},placement:'branch'});
    }
    if(!n.children.length&&m.showPathProbability){
      labels.push({id:`path-${n.id}`,role:'path-probability',owner:`node-${n.id}`,kind:'MATH',tex:pathTex(n),plain:n.path,anchor:{x:0,y:0,ax:'start',ay:'middle'},extra:{value:n.path,leaf:n.id},placement:'leaf'});
    }
  }
  return {size:{width,height},prims,labels,centers:Object.fromEntries([...c.entries()]),tree:true,...(m.pathColumn?{pathColumn:true}:{})};
}
// The dot plot: the line along the bottom (a break mark where the plan cuts it), a labelled tick every `step`, a short tick at every other integer, and the dots: the first one
// DOT_FIRST above the line, the others one pitch (a diameter and DOT_GAP) apart; the dot radius follows the length of a unit so that neighbours never touch.
const DOT_FIRST=7,DOT_GAP=1.5,DOT_MAX_R=5.5,DOT_MINOR=3;
function dotSpec(m,ctx){
  const fontPx=ctx?.fontPx??DEFAULT_FONT_PX,segs=m.segments,gap=dotGapPx(segs);
  const unit=dotUnitPx(segs),r=r6(Math.min(DOT_MAX_R,.45*unit)),pitch=2*r+DOT_GAP;
  const stackH=DOT_FIRST+m.maxStack*pitch+10,BASE=r6(SAFE+20+stackH),H=Math.ceil(BASE+TICK+4+LABEL_BELOW+SAFE);
  const right=m.xTitle?TITLE_X+textWidth(m.xTitle,fontPx):0,extraWidth=Math.max(0,Math.ceil(right+SAFE)-W);
  const px=v=>{const k=segs.findIndex(g=>v>=g.lo&&v<=g.hi);return r6(DOT_MAPL+(k?(segs[0].hi-segs[0].lo)*unit+gap:0)+(v-segs[k].lo)*unit);};
  const prims=[],labels=[];
  arrows(prims,{xStartPx:SAFE+14,yAxisPx:null,base:BASE});
  if(segs.length>1)breakMark(prims,'x',r6((px(segs[0].hi)+px(segs[1].lo))/2),BASE);
  for(const g of segs)for(let v=g.lo;v<=g.hi;v++){
    const x=px(v);
    if(v%m.step===0){
      prims.push(L(`x-tick-${v}`,'x-tick','tick',x,BASE,x,BASE+TICK,{axis:'x',value:String(v)}));
      labels.push(math(`x-tick-${v}-label`,'x-tick',`x-tick-${v}`,DISPLAY+String(v),String(v),'center','top',x,BASE+TICK+4,{value:String(v)}));
    }else prims.push(L(`x-minor-${v}`,'x-minor','tick',x,BASE,x,BASE+DOT_MINOR,{axis:'x',value:String(v)}));
  }
  for(const p of m.points)for(let j=0;j<p.count;j++)prims.push({t:'circle',id:`dot-${p.value}-${j+1}`,role:'dot',cls:'dot',cx:px(Number(p.value)),cy:r6(BASE-DOT_FIRST-r-j*pitch),r,data:{value:p.value,index:j+1},layer:70});
  if(m.xTitle)labels.push(textLabel('x-title','axis-title','x-axis',m.xTitle,'start','middle',TITLE_X,BASE));
  return {size:{width:W+extraWidth,height:H},prims,labels};
}
const SPEC_BY_KIND={HISTOGRAM:freqSpec,FREQUENCY_POLYGON:freqSpec,STEM_LEAF:stemSpec,BOX_PLOT:boxSpec,SCATTER:scatterSpec,DICE_TABLE:diceSpec,TREE:treeSpec,DOT_PLOT:dotSpec};
export const statChartSize=(model,ctx)=>({...SPEC_BY_KIND[model.kind](model,ctx).size});
export function statChartSpec(plan,model,ctx){
  if(plan?.capability!==FIGURE_CAPABILITY||!isPlain(plan.chart))bad('STAT_CHART_PLAN_INVALID');
  if(objectSha(solveStatChart(plan.chart))!==objectSha(model))bad('STAT_MODEL_MISMATCH');
  const spec=SPEC_BY_KIND[model.kind](model,ctx);
  return {schemaVersion:SPEC_VERSION,...spec};
}

// --- value labels: a label that would touch a polygon line, a dot or ring, an axis, a bracket or another label is moved to the nearest free place around its point ---
const strokeOf=cls=>{const st=STYLE[cls]??'',mm=/stroke-width="([\d.]+)"/.exec(st);return !mm||/stroke="none"/.test(st)?0:Number(mm[1]);};
const rectDist=(x,y,b)=>Math.hypot(Math.max(b.x-x,0,x-b.x-b.width),Math.max(b.y-y,0,y-b.y-b.height));
const rectGap=(a,b)=>Math.hypot(Math.max(b.x-(a.x+a.width),0,a.x-(b.x+b.width)),Math.max(b.y-(a.y+a.height),0,a.y-(b.y+b.height)));
function segHitsRect(a,c,b){ // Liang-Barsky: does the segment a-c meet the closed rectangle b
  let t0=0,t1=1;const dx=c[0]-a[0],dy=c[1]-a[1];
  for(const [p,q] of [[-dx,a[0]-b.x],[dx,b.x+b.width-a[0]],[-dy,a[1]-b.y],[dy,b.y+b.height-a[1]]]){
    if(p===0){if(q<0)return false;continue;}
    const t=q/p;
    if(p<0){if(t>t1)return false;if(t>t0)t0=t;}else{if(t<t0)return false;if(t<t1)t1=t;}
  }
  return true;
}
const pointSegDist=(p,a,c)=>{const dx=c[0]-a[0],dy=c[1]-a[1],len2=dx*dx+dy*dy,t=len2?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len2)):0;return Math.hypot(p[0]-(a[0]+t*dx),p[1]-(a[1]+t*dy));};
const segRectDist=(a,c,b)=>{
  if(segHitsRect(a,c,b))return 0;
  const corners=[[b.x,b.y],[b.x+b.width,b.y],[b.x+b.width,b.y+b.height],[b.x,b.y+b.height]];
  return Math.min(rectDist(a[0],a[1],b),rectDist(c[0],c[1],b),...corners.map(p=>pointSegDist(p,a,c)));
};
function obstacles(prims){ // every line, polyline, dot and bar edge a label must stay clear of (grid lines are cut around labels instead)
  const out=[];
  for(const p of prims){
    if(p.role==='grid')continue;
    const pad=strokeOf(p.cls)/2;
    if(p.t==='line')out.push({segs:[[[p.x1,p.y1],[p.x2,p.y2]]],pad});
    else if(p.t==='polyline')out.push({segs:p.points.slice(1).map((q,i)=>[p.points[i],q]),pad});
    else if(p.t==='polygon')out.push({segs:p.points.map((q,i)=>[q,p.points[(i+1)%p.points.length]]),pad});
    else if(p.t==='circle')out.push({circle:[p.cx,p.cy,p.r],pad});
    else if(p.t==='rect'&&p.role==='bar'){const c=[[p.x,p.y],[p.x+p.width,p.y],[p.x+p.width,p.y+p.height],[p.x,p.y+p.height]];out.push({segs:c.map((q,i)=>[q,c[(i+1)%4]]),pad});}
  }
  return out;
}
function resolveValueLabels(spec,placed){
  const items=placed.filter(item=>item.label.place);
  if(!items.length)return;
  const obs=obstacles(spec.prims),{width,height}=spec.size,PREFER=spec.valueClearance??0;
  for(const item of items){
    const {x:ax,y:ay,gap}=item.label.place,{width:w,height:h}=item.box,others=placed.filter(o=>o!==item).map(o=>o.box);
    const clearance=box=>{ // the smallest gap to anything it must not touch; negative when it touches or leaves the figure
      if(box.x<SAFE||box.y<SAFE||box.x+box.width>width-SAFE||box.y+box.height>height-SAFE)return -1;
      let s=Infinity;
      for(const o of obs){
        if(o.circle)s=Math.min(s,rectDist(o.circle[0],o.circle[1],box)-o.circle[2]-o.pad);
        else for(const [a,c] of o.segs)s=Math.min(s,segRectDist(a,c,box)-o.pad);
      }
      for(const other of others)s=Math.min(s,overlaps(box,other)?-1:rectGap(box,other));
      return s;
    };
    const cands=[item.box];
    for(const g of [gap,gap+6,gap+12,gap+20]){
      const d=g*.72;
      cands.push({x:ax-w/2,y:ay-g-h},{x:ax-d-w,y:ay-d-h},{x:ax+d,y:ay-d-h},{x:ax+g,y:ay-h/2},{x:ax-g-w,y:ay-h/2},{x:ax-w/2,y:ay+g},{x:ax+d,y:ay+d},{x:ax-d-w,y:ay+d});
    }
    const boxes=cands.map(c=>({x:r6(c.x),y:r6(c.y),width:w,height:h}));
    const scores=boxes.map(clearance);
    // the default place stays when it is free (PREFER is 0 for a chart that uses none of the newer marks, so its old figure is unchanged); otherwise the first candidate with room, else the roomiest one
    let pick=scores[0]>PREFER?0:scores.findIndex(s=>s>=2.5);
    if(pick<0){const best=Math.max(...scores);pick=best>0.3?scores.indexOf(best):-1;}
    if(pick<0)throw new Stop('STAT_VALUE_LABEL_NO_ROOM',{labelId:item.label.id});
    item.box=boxes[pick];
  }
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
  // one column for the path probabilities: right of the leaf label that reaches furthest
  const columnX=spec.pathColumn?r6(Math.max(...spec.labels.filter(l=>l.placement==='leaf').map(l=>{const nb=boxOf.get(l.extra.leaf),c=centers[l.extra.leaf];return (nb?nb.x+nb.width:c.x);}))+16):0;
  for(const prim of spec.prims.filter(p=>p.role==='leaf-ring')){ // a ring round the label of a highlighted leaf (round the dot of an unlabelled one)
    const nb=boxOf.get(prim.data.leaf);
    if(nb){prim.cx=r6(nb.x+nb.width/2);prim.cy=r6(nb.y+nb.height/2);prim.rx=r6(nb.width/2+8);prim.ry=r6(nb.height/2+6);}
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
      item.box={x:r6(spec.pathColumn?columnX:(nb?nb.x+nb.width:c.x)+16),y:r6(c.y-height/2),width,height};
    }
  }
}
/** Typeset every label, place it, build the SVG, run the independent observer on its bytes and the rendered layout check in Chrome. */
export async function composeStatChartFigure({plan,model,identity,typographyPolicy,browser,minSize}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:status==='COMPOSED'?'construction-candidate-svg-v1':SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=statChartSpec(plan,model,{fontPx:typographyPolicy.baseFontPx});}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='STAT_MODEL_MISMATCH'?error.message:'STAT_SPEC_ERROR',{code:error.message});}
    if(minSize)spec.size={width:Math.max(spec.size.width,minSize.width),height:Math.max(spec.size.height,minSize.height)};   // the size the Archive measured (never smaller than the labels need)
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
    resolveValueLabels(spec,placed);
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
