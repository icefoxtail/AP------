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
const thin={kind:'NORMAL_CURVE',curves:[{id:'Z',mean:'108',sd:'9',label:'Z'}],ticks:[{x:'108'},{x:'135'}],shades:[{from:'135',to:null,color:'BLUE'}],areaLabels:[{shade:0,text:'0.0013'}]};
// the same with a tail two sd out: nothing changes
const wide={kind:'NORMAL_CURVE',curves:[{id:'Z',mean:'108',sd:'9',label:'Z'}],ticks:[{x:'108'},{x:'126'}],shades:[{from:'126',to:null,color:'BLUE'}],areaLabels:[{shade:0,text:'0.0228'}]};
// the same thin tail without a value on it: nothing to point into, nothing changes
const unlabelled={kind:'NORMAL_CURVE',curves:[{id:'Z',mean:'108',sd:'9',label:'Z'}],ticks:[{x:'108'},{x:'135'}],shades:[{from:'135',to:null,color:'BLUE'}]};

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
    const wrong=svg.replace(/(id="curve-Z"[^>]*points=")([^"]*)"/,(m,head,pts)=>head+pts.split(' ').map(p=>{const [x,y]=p.split(',').map(Number);return `${x},${(318-(318-y)*0.8).toFixed(3)}`;}).join(' ')+'"');
    assert.notEqual((await audit(thin,wrong)).status,'PASS','a bell 208 px high is not drawn by this engine');
    // a plain figure keeps the old height
    const plain=await compose(wide);
    assert.equal(Number(plain.match(/id="x-axis"[^>]*? y1="([\d.]+)"/)[1]),58+140);
    assert.equal((await audit(wide,plain)).status,'PASS');
  }finally{await browser.close();}
});

// 22 팔마고 기말 q13: ticks one unit apart on a 16-unit window: the numbers 10 and 11 would touch, so every second number stands one row lower under its own tick
const close={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'10',sd:'2',meanLine:true}],ticks:[{x:'8'},{x:'9'},{x:'10'},{x:'11'},{x:'12'}],shades:[{from:'8',to:'9',color:'WARM'},{from:'9',to:'11',color:'BLUE'},{from:'11',to:'12',color:'WARM'}]};
test('ticks whose numbers would touch take two rows, each number still centred under its own tick; spaced ticks keep one row',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async chart=>{
      const composed=await composeStatChartFigure({plan:plan(chart),model:solveStatChart(chart),identity:assetIdentity('26_테스트|9500','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:24.4,displayScale:1,fontFloorCssPx:11},browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const ys=svg=>[0,1,2,3,4].map(i=>boxOf(svg,`x-tick-${i}-label`)[1]);
    const crowded=ys(await compose(close));
    assert.deepEqual([crowded[0]===crowded[2],crowded[2]===crowded[4],crowded[1]===crowded[3],crowded[1]>crowded[0]],[true,true,true,true],'ticks 0,2,4 in the first row, 1 and 3 one row lower: '+crowded);
    const spaced=ys(await compose({...close,span:'2.5',ticks:[{x:'8'},{x:'9'},{x:'10'},{x:'11'},{x:'12'}]}));
    assert.equal(new Set(spaced).size,1,'with room between the numbers they all stand in one row: '+spaced);
  }finally{await browser.close();}
});
function boxOf(svg,id){return svg.match(new RegExp(`<g id="${id}"[^>]*data-box="([^"]+)"`))[1].split(',').map(Number);}
