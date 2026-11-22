// NORMAL_CURVE, two things that kept ~57 확률과통계 해설 그림 from rendering (2026-11-22):
// 1. the x axis name stays inside the safe area (the arrow tip and the name moved left: the name of the 25 순천고 q5 figure stood at x = 520 + 18 in a 548-wide figure with 12 px of margin);
// 2. a labelled tail beyond about 3 sd (0.0013) is under 2 px high at the usual bell height, so no leader dot fits in it: such a figure alone draws its bell taller (260 instead of 140 px)
//    and the dot goes where the tail holds 1 px of room. The independent observer accepts exactly the two heights. Chrome-using: run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
// 22 순천고 q14: N(108, 9^2), P(X >= 135) = 0.0013, three sd out
const thin={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'108',sd:'9',label:'X'}],ticks:[{x:'108'},{x:'135'}],shades:[{from:'135',to:null,color:'BLUE'}],areaLabels:[{shade:0,text:'0.0013'}]};
// the same with a tail two sd out: nothing changes
const wide={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'108',sd:'9',label:'X'}],ticks:[{x:'108'},{x:'126'}],shades:[{from:'126',to:null,color:'BLUE'}],areaLabels:[{shade:0,text:'0.0228'}]};
// the same thin tail without a value on it: nothing to point into, nothing changes
const unlabelled={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'108',sd:'9',label:'X'}],ticks:[{x:'108'},{x:'135'}],shades:[{from:'135',to:null,color:'BLUE'}]};

test('only a labelled thin tail makes the bell taller: the size follows the model, so the measured size and the drawing agree',()=>{
  const h=chart=>statChartSize(solveStatChart(chart)).height;
  assert.equal(h(thin)-h(wide),120,'the bell is 260 instead of 140 px high');
  assert.equal(h(unlabelled),h(wide),'an unlabelled thin tail keeps the usual height');
});

test('x axis name inside the safe area, thin tail pointed into by a leader, observer PASS; the bell height is one of the two the observer allows',async()=>{
  const browser=await launchBrowser();
  try{
    let n=0;
    const compose=async chart=>{
      const composed=await composeStatChartFigure({plan:plan(chart),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(9000+n++),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart,svg},{script:observer})).result;
    const svg=await compose(thin);
    assert.ok(/id="area-0-leader"/.test(svg)&&/id="area-0-dot"/.test(svg),'the 0.0013 stands outside with a leader and a dot');
    const width=Number(svg.match(/viewBox="0 0 ([\d.]+)/)[1]),xBox=svg.match(/id="x-label"[^>]*data-box="([^"]+)"/)[1].split(',').map(Number);
    assert.ok(xBox[0]+xBox[2]<=width-12,'the x axis name keeps the 12 px margin');
    assert.equal(Number(svg.match(/id="x-axis"[^>]*? y1="([\d.]+)"/)[1]),58+260,'the axis stands under a 260 px bell');
    // the observer: the height is one of the two allowed; a bell drawn at any other height is refused
    assert.equal((await audit(thin,svg)).status,'PASS');
    const wrong=svg.replace(/(id="curve-X"[^>]*points=")([^"]*)"/,(m,head,pts)=>head+pts.split(' ').map(p=>{const [x,y]=p.split(',').map(Number);return `${x},${(318-(318-y)*0.8).toFixed(3)}`;}).join(' ')+'"');
    assert.notEqual((await audit(thin,wrong)).status,'PASS','a bell 208 px high is not drawn by this engine');
    // a plain figure keeps the old height
    const plain=await compose(wide);
    assert.equal(Number(plain.match(/id="x-axis"[^>]*? y1="([\d.]+)"/)[1]),58+140);
    assert.equal((await audit(wide,plain)).status,'PASS');
  }finally{await browser.close();}
});

// 22 팔마고 기말 q13: ticks one unit apart on a 16-unit window. Numbers less than 5 px apart read as one number (65 and 67.6 as "6567.6"), so the number that would touch the one before it stands one row lower under its own tick;
// numbers 5 px or more apart stay in one row as they always were. The independent observer refuses a row with numbers nearer than 5 px.
const close={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'10',sd:'2',meanLine:true}],ticks:[{x:'8'},{x:'9'},{x:'10'},{x:'11'},{x:'12'}],shades:[{from:'8',to:'9',color:'WARM'},{from:'9',to:'11',color:'BLUE'},{from:'11',to:'12',color:'WARM'}]};
const composeClose=async(browser,fontPx,chart=close)=>{
  const composed=await composeStatChartFigure({plan:plan(chart),model:solveStatChart(chart),identity:assetIdentity('26_테스트|9500','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:fontPx,displayScale:1,fontFloorCssPx:11},browser});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  return composed.svg;
};
const tickBox=(svg,i)=>boxOf(svg,`x-tick-${i}-label`);
test('numbers 1 to 4 px apart take two rows (each centred under its tick); numbers 5 px or more apart keep one row',async()=>{
  const browser=await launchBrowser();
  try{
    const rows=svg=>[0,1,2,3,4].map(i=>tickBox(svg,i)[1]);
    const gap=svg=>tickBox(svg,3)[0]-(tickBox(svg,2)[0]+tickBox(svg,2)[2]);
    const near=await composeClose(browser,24.4);   // 10 and 11 are 3.5 px apart
    assert.ok(gap(near)<5&&gap(near)>=1,'a gap of 1 to 4 px: '+gap(near));
    const crowded=rows(near);
    assert.deepEqual([crowded[0]===crowded[1],crowded[1]===crowded[2],crowded[2]===crowded[4],crowded[3]>crowded[2]],[true,true,true,true],'only the number 11 that touches the 10 stands one row lower (the numbers 8 and 9 are narrow and clear): '+crowded);
    const fits=await composeClose(browser,22);    // 5.9 px apart
    assert.ok(gap(fits)>=5,'a gap of 5 px or more: '+gap(fits));
    assert.equal(new Set(rows(fits)).size,1,'numbers 5 px or more apart stay in one row: '+rows(fits));
    const spaced=rows(await composeClose(browser,24.4,{...close,span:'2.5'}));
    assert.equal(new Set(spaced).size,1,'with room between the numbers they all stand in one row: '+spaced);
    // the observer: numbers that stand in one row less than 5 px apart are refused (the lower numbers put back into the first row)
    const y0=tickBox(near,0)[1];
    let jammed=near;for(const i of [3])jammed=jammed.replace(new RegExp(`(<g id="x-tick-${i}-label"[^>]*data-box="[^,]+,)${tickBox(near,i)[1]}(,[^"]*"[^>]*transform="translate\([^ ]+ )${tickBox(near,i)[1]}\)`),`$1${y0}$2${y0})`);
    assert.notEqual(jammed,near,'the lower numbers were moved');
    const refused=(await pythonWorker({chart:close,svg:jammed},{script:observer})).result;
    assert.ok((refused.errors??[]).some(e=>/^SC_NORMAL_TICK_NUMBERS_CLOSE/.test(String(e))),JSON.stringify(refused));
    const ok=(await pythonWorker({chart:close,svg:fits},{script:observer})).result;
    assert.equal(ok.status,'PASS',JSON.stringify(ok));
  }finally{await browser.close();}
});
function boxOf(svg,id){return svg.match(new RegExp(`<g id="${id}"[^>]*data-box="([^"]+)"`))[1].split(',').map(Number);}

// 2026-11-22: the name Z is the standard normal variable (44 plans called a N(30, 4) or N(108, 9^2) curve Z: the axis showed 30 and 40 while the name said standard normal)
const named=(label,curve={})=>({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'30',sd:'4',label,...curve}],ticks:[{x:'30'},{x:'38'}],shades:[{from:'38',to:null,color:'BLUE'}]});
const CODE='STAT_NORMAL_CURVE_NAME_Z_NOT_STANDARD';
test('a curve named Z that is not N(0, 1) is refused, with numbers or letters for the mean and the sd',()=>{
  assert.throws(()=>solveStatChart(named('Z')),error=>error.message===CODE);
  assert.throws(()=>solveStatChart(named('Z',{mean:'0'})),error=>error.message===CODE,'mean 0 but sd 4');
  assert.throws(()=>solveStatChart(named('Z',{sd:'1'})),error=>error.message===CODE,'sd 1 but mean 30');
  assert.throws(()=>solveStatChart({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'m',sd:'σ',label:'Z'}],ticks:[{z:'0'},{z:'1'}]}),error=>error.message===CODE,'letters');
  assert.throws(()=>solveStatChart({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'0',sd:'σ',label:'Z'}],ticks:[{z:'0'},{z:'1'}]}),error=>error.message===CODE,'sd a letter');
});
test('the standard normal curve may be called Z; any other name, the z row and the unnamed curve are untouched',()=>{
  const standard={kind:'NORMAL_CURVE',curves:[{id:'Z',mean:'0',sd:'1',label:'Z'}],ticks:[{x:'0'},{x:'2'}],zAxis:true,shades:[{from:'0',to:'2',color:'BLUE'}],areaLabels:[{shade:0,text:'0.4772'}]};
  assert.equal(solveStatChart(standard).kind,'NORMAL_CURVE');
  assert.equal(solveStatChart({...standard,curves:[{id:'Z',mean:'0.0',sd:'1.0',label:'Z'}]}).kind,'NORMAL_CURVE','0.0 and 1.0 are the same numbers');
  for(const label of ['X','H','Y'])assert.equal(solveStatChart(named(label)).kind,'NORMAL_CURVE',label);
  assert.equal(solveStatChart({...named('X'),zAxis:true}).zAxis,true,'the z row of an X curve keeps its z');
  assert.equal(solveStatChart(named(undefined)).kind,'NORMAL_CURVE');
  assert.equal(solveStatChart({kind:'NORMAL_CURVE',curves:[{id:'A',mean:'0',sd:'1',label:'Z'},{id:'B',mean:'0',sd:'2',label:'X'}],ticks:[{x:'0'}]}).curves.length,2,'two curves: only the one called Z must be standard');
});
test('the independent observer refuses the same plan',async()=>{
  const result=(await pythonWorker({chart:named('Z'),svg:'<svg xmlns="http://www.w3.org/2000/svg"/>'},{script:observer})).result;
  assert.ok((result.errors??[result.code]).some(error=>String(error).startsWith(CODE)),JSON.stringify(result));
});

test('the other spellings of the standard normal variable are refused the same way, an axis called z needs the standard curve (a letter curve in sigma units may call it z)',()=>{
  for(const label of ['z','Z(0,1)','Z (0, 1)','z(0,1)','N(0,1)'])assert.throws(()=>solveStatChart(named(label)),error=>error.message===CODE,label);
  assert.throws(()=>solveStatChart({...named('X'),xLabel:'z'}),error=>error.message==='STAT_NORMAL_XLABEL_Z_NOT_STANDARD','xLabel z on N(30, 4^2)');
  assert.throws(()=>solveStatChart({...named('X'),xLabel:'Z'}),error=>error.message==='STAT_NORMAL_XLABEL_Z_NOT_STANDARD','xLabel Z on N(30, 4^2)');
  const standard={kind:'NORMAL_CURVE',curves:[{id:'Z',mean:'0',sd:'1',label:'Z'}],ticks:[{x:'0'},{x:'2'}],shades:[{from:'0',to:'2',color:'BLUE'}]};
  for(const label of ['Z','z','Z(0,1)','N(0,1)'])assert.equal(solveStatChart({...standard,curves:[{id:'Z',mean:'0',sd:'1',label}],xLabel:'z'}).xLabel,'z',label);
  assert.equal(solveStatChart(standard).xLabel,'x','the default axis name is still x');
  const framed={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'m',sd:'σ',label:'X'}],ticks:[{z:'0'},{z:'1'}],xLabel:'z'};
  assert.equal(solveStatChart(framed).xLabel,'z','sigma units, z ticks: the axis is a z axis');
  assert.equal(solveStatChart({...named('X'),xLabel:'x'}).xLabel,'x');
  assert.equal(solveStatChart({...named('X'),xLabel:'h'}).xLabel,'h');
});
test('the observer refuses the other spellings and the z axis of a real-unit curve',async()=>{
  for(const chart of [named('z'),named('N(0,1)'),{...named('X'),xLabel:'z'}]){
    const result=(await pythonWorker({chart,svg:'<svg xmlns="http://www.w3.org/2000/svg"/>'},{script:observer})).result;
    assert.ok((result.errors??[result.code]).some(error=>/^STAT_NORMAL_(CURVE_NAME|XLABEL)_Z_NOT_STANDARD/.test(String(error))),JSON.stringify(result));
  }
});

// the axis runs to 490 (arrow tip 512) as it always did; only a name that does not fit between the tip and the safe margin shortens it to 482 (tip 500)
test('the axis keeps its length when the axis name fits and is shortened only when it does not; the observer allows exactly these two',async()=>{
  const browser=await launchBrowser();
  try{
    const axisEnd=async fontPx=>{
      const composed=await composeStatChartFigure({plan:plan(split),model:solveStatChart(split),identity:assetIdentity('26_테스트|9600','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:fontPx,displayScale:1,fontFloorCssPx:11},browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
      const svg=composed.svg;
      return {x2:Number(svg.match(/id="x-axis"[^>]*? x2="([\d.]+)"/)[1]),svg};
    };
    const usual=await axisEnd(20),big=await axisEnd(30);
    assert.equal(usual.x2,504,'512 - 8');assert.equal(big.x2,492,'500 - 8');
    const wrong=usual.svg.replace(/(id="x-axis"[^>]*? x2=")504/,'$1498');
    assert.notEqual((await pythonWorker({chart:split,svg:wrong},{script:observer})).result.status,'PASS','an axis length that is neither of the two');
  }finally{await browser.close();}
});
// 23 팔마고 q9
const split={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'50',sd:'2',label:'X'}],ticks:['47','50','52'],shades:[{from:'47',to:'50'},{from:'50',to:'52'}]};
