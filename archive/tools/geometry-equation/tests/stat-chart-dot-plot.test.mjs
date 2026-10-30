// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (E34): DOT_PLOT, the data as stacks of dots over a number line (one dot per datum), with a labelled tick every step, a short tick at every other integer and,
// for an outlier far from the rest, a line cut by a break mark that keeps one unit length on both sides. The independent observer re-derives every dot from the plan.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(0,90));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
// 25 신흥중 2학기 기말 중1 q22: ten text-message counts, 114 far from the rest
const outlier={kind:'DOT_PLOT',values:[7,15,11,114,5,5,13,10,8,12],axisBreak:{from:15,to:114},xTitle:'개수(개)'};
const plain={kind:'DOT_PLOT',values:[2,3,3,4,4,4,5,7],xTitle:'횟수(회)'};

test('the engine tallies the dots, rounds each segment of the line out to the label step and keeps a plan without a break whole',()=>{
  const m=solveStatChart(outlier);
  assert.deepEqual(m.points.map(p=>[p.value,p.count]),[['5',2],['7',1],['8',1],['10',1],['11',1],['12',1],['13',1],['15',1],['114',1]]);
  assert.equal(m.total,10);assert.equal(m.maxStack,2);assert.equal(m.step,5);
  assert.deepEqual(m.segments,[{lo:0,hi:20},{lo:110,hi:115}]);assert.deepEqual(m.axisBreak,{from:15,to:114});
  const p=solveStatChart(plain);
  assert.equal(p.step,1);assert.deepEqual(p.segments,[{lo:1,hi:8}]);assert.ok(!('axisBreak' in p));
  // the same data as counts, in any order
  const counts=solveStatChart({kind:'DOT_PLOT',counts:[{value:7,count:1},{value:2,count:1},{value:4,count:3},{value:3,count:2},{value:5,count:1}],xTitle:'횟수(회)'});
  assert.deepEqual(counts.points.map(x=>[x.value,x.count]),[['2',1],['3',2],['4',3],['5',1],['7',1]]);
  assert.equal(solveStatChart({kind:'DOT_PLOT',values:['3','3',4]}).total,3);        // numeric strings are whole numbers too
  // a chosen step; the segment starts at a multiple of the step, one unit before the first datum (never below 0)
  assert.deepEqual(solveStatChart({kind:'DOT_PLOT',values:[1,2,9],step:2}).segments,[{lo:0,hi:10}]);
  assert.deepEqual(solveStatChart({kind:'DOT_PLOT',values:[0,1]}).segments,[{lo:0,hi:2}]);
  // the figure's size is known from the model
  assert.equal(statChartSize(m).width,548);assert.ok(statChartSize(p).height>statChartSize(m).height,'a taller stack needs a taller figure');
});

test('dot plots that cannot be drawn faithfully are refused with their codes',()=>{
  const values=(v,extra={})=>({kind:'DOT_PLOT',values:v,...extra});
  refuse({kind:'DOT_PLOT'},'STAT_DOT_PLOT_INVALID');
  refuse({kind:'DOT_PLOT',values:[1],counts:[{value:1,count:1}]},'STAT_DOT_PLOT_INVALID');
  refuse(values([]),'STAT_DOT_PLOT_INVALID');refuse(values('1,2'),'STAT_DOT_PLOT_INVALID');
  refuse(values(Array.from({length:61},(_,i)=>i%7)),'STAT_DOT_PLOT_INVALID');
  refuse({kind:'DOT_PLOT',counts:[{value:1,count:2},{value:1,count:1}]},'STAT_DOT_PLOT_INVALID');
  refuse({kind:'DOT_PLOT',counts:[{value:1}]},'STAT_DOT_PLOT_INVALID');
  refuse({kind:'DOT_PLOT',values:[1,2],extra:1},'STAT_CHART_PLAN_INVALID');
  for(const bad of [-1,1.5,'a',true,null,10000,'1.5'])refuse(values([2,bad,4]),'STAT_DOT_VALUE_INVALID');
  refuse(values(Array(13).fill(5)),'STAT_DOT_STACK_TOO_TALL');                                          // a stack of more than 12 dots
  refuse({kind:'DOT_PLOT',counts:[{value:3,count:13}]},'STAT_DOT_STACK_TOO_TALL');
  refuse({kind:'DOT_PLOT',counts:[{value:3,count:0}]},'STAT_DOT_STACK_TOO_TALL');
  // the break: data on both sides, none inside it, a real gap, whole numbers
  for(const bad of [{from:15,to:16},{from:114,to:200},{from:15,to:120},{from:0,to:3},{from:5,to:3},{from:1.5,to:114},{from:15},{from:15,to:114,x:1},'15'])
    refuse({...outlier,axisBreak:bad},'STAT_DOT_BREAK_INVALID');
  // the step: a whole number that leaves room for its numbers; a break whose parts would meet
  for(const bad of [0,1.5,501,'2',null])refuse(values([1,2,9],{step:bad}),'STAT_DOT_STEP_INVALID');
  refuse(values([1,400],{step:1}),'STAT_DOT_PLOT_TOO_DENSE');
  refuse(values([1,2,9,300],{step:100}),'STAT_DOT_PLOT_TOO_DENSE');
  assert.doesNotThrow(()=>solveStatChart(values([1,2,9,300],{axisBreak:{from:9,to:300}})));
  refuse(values([5,9],{axisBreak:{from:5,to:9},step:5}),'STAT_DOT_PLOT_TOO_DENSE');                    // the parts of the line (0..10 and 5..10) would overlap
  assert.throws(()=>solveStatChart(values([3,4],{xTitle:'가나다라마바사아자차카타파하가'})),code('STAT_TITLE_INVALID'));
});

test('the observer passes dot plots (with and without a cut line) and catches each wrong dot, tick, break or stack',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(6000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const pass=async(chart,svg)=>{const r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));return r;};
    const bump=(svg,id,attr,delta)=>{const re=new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`);assert.ok(re.test(svg),id);return svg.replace(re,(m,head,x)=>head+(Number(x)+delta));};

    // ---- no break: every integer is labelled, the stack of 4 over the value 4 stands one dot above the next
    let svg=await compose(plain,1);
    let r=await pass(plain,svg);assert.deepEqual(r.observed.values,{2:1,3:2,4:3,5:1,7:1});assert.equal(r.observed.dots,8);assert.equal(r.observed.step,1);
    assert.equal((svg.match(/data-role="dot"/g)||[]).length,8);assert.ok(!/data-role="x-minor"|data-role="axis-break"/.test(svg));
    assert.ok(has(await audit({...plain,values:[2,3,3,4,4,4,5,6]},svg),'SC_DOT_'),'a datum moved to another value');
    assert.ok(has(await audit({...plain,values:[2,3,3,4,4,5,5,7]},svg),'SC_DOT_COUNT'),'a different tally');
    assert.ok(has(await audit({...plain,values:[2,3,3,4,4,4,5,7,7]},svg),'SC_DOT_'),'one datum more than drawn');
    assert.ok(has(await audit(plain,bump(svg,'dot-4-3','cy',-3)),'SC_DOT_STACK:4'));
    assert.ok(has(await audit(plain,bump(svg,'dot-3-1','cx',2)),'SC_DOT_X:3'));
    assert.ok(has(await audit(plain,bump(svg,'dot-5-1','r',1)),'SC_DOT_RADIUS:5'));
    assert.ok(has(await audit(plain,svg.replace(/<g data-layer="70"><circle id="dot-4-3"[^>]*\/><\/g>/,'')),'SC_DOT_COUNT:4'));
    assert.ok(has(await audit(plain,svg.replace(/(id="dot-7-1"[^>]*?) data-index="1"/,'$1 data-index="2"')),'SC_DOT_INDEX:7'));
    assert.ok(has(await audit({...plain,xTitle:'횟수(번)'},svg),'SC_TITLE_MISMATCH'));
    assert.ok(has(await audit({...plain,step:2},svg),'SC_DOT_STEP_MISMATCH'));
    assert.ok(has(await audit(plain,svg.replace(/(id="x-tick-5-label"[^>]*data-tex=")\\displaystyle 5/,'$1\\displaystyle 6')),'SC_TICK_VALUE_MISMATCH'));
    assert.ok(has(await audit(plain,bump(svg,'x-tick-5','x1',4).replace(/(id="x-tick-5"[^>]*? x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)+4))),'SC_AXIS_NOT_LINEAR'));

    // ---- the cut line: step 5 with short ticks between, the parts 0..20 and 110..115 and the break mark between them
    svg=await compose(outlier,2);
    r=await pass(outlier,svg);assert.equal(r.observed.step,5);assert.equal(r.observed.dots,10);
    assert.equal((svg.match(/data-role="axis-break"/g)||[]).length,2);
    assert.equal((svg.match(/data-role="x-minor"/g)||[]).length,(21-5)+(6-2),'every integer that is not a labelled tick');
    assert.ok(has(await audit({...outlier,axisBreak:undefined,values:[7,15,11,14,5,5,13,10,8,12]},svg),'SC_AXIS_BREAK_MISMATCH'));
    assert.ok(has(await audit(outlier,svg.replace(/<g data-layer="30"><line id="x-axis-break-1"[^>]*\/><\/g>/,'')),'SC_AXIS_BREAK_MISMATCH'));
    assert.ok(has(await audit(outlier,svg.replace(/<g data-layer="30"><line id="x-minor-7"[^>]*\/><\/g>/,'')),'SC_DOT_MINOR_SET'));
    assert.ok(has(await audit(outlier,bump(svg,'x-minor-8','x1',3).replace(/(id="x-minor-8"[^>]*? x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)+3))),'SC_DOT_MINOR_PLACE:8'));
    assert.ok(has(await audit(outlier,bump(svg,'dot-114-1','cx',-8)),'SC_DOT_X:114'));
    // the second part is as long a unit as the first: moving the far part's ticks closer is caught
    assert.ok(has(await audit(outlier,svg.replace(/(id="x-tick-115"[^>]*? x[12]=")([\d.]+)/g,(m,head,x)=>head+(Number(x)-6))),'SC_DOT_UNIT_DIFFERS'));
    assert.ok(has(await audit({...outlier,axisBreak:{from:15,to:114},values:[7,15,11,114,5,5,13,10,8,12,200]},svg),'SC_'));
    // a segment that ends where the plan says it should not
    assert.ok(has(await audit({...outlier,values:[7,15,11,114,5,5,13,10,8,22],axisBreak:{from:22,to:114}},svg),'SC_DOT_'));
  }finally{await browser.close();}
});
