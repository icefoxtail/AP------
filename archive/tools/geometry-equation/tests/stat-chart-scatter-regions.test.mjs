// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (E36): SCATTER reference lines (refLines: x=k, y=k, y=x), highlighted rectangles (regions) with the points they hold ringed (markPoints) and a count the engine
// makes from the points (countLabel). The observer re-derives the lines, rectangles, rings and count from the plan's points; a plan without these fields draws exactly what it always drew.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,statChartSpec,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';
import {assertAccessibleNames} from './accessible-names.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(-120));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>(result.errors??[result.code]).some(error=>error.startsWith(prefix));
// 24 연향중 2학기 기말 중3 q18-19: reading and listening scores of 15 examinees
const POINTS=[[3,2],[3,3],[4,3],[4,6],[5,6],[5,4],[6,7],[6,8],[7,8],[7,5],[8,10],[8,9],[9,8],[9,5],[10,9]].map(([x,y])=>({x:String(x),y:String(y)}));
const base={kind:'SCATTER',points:POINTS,xRange:['0','10'],yRange:['0','10'],xStep:'1',yStep:'1',labelEvery:2,xTitle:'읽기',yTitle:'듣기'};
const marked={...base,refLines:[{type:'x=k',value:'8'},{type:'y=k',value:'8'}],regions:[{xMin:'8',yMin:'8',markPoints:true,countLabel:true,countUnit:'명',tone:2}]};

test('scatter equalUnits is opt-in, preserves legacy geometry and uses one physical data unit',()=>{
  const specOf=(chart,compact=false)=>statChartSpec(plan(chart),solveStatChart(chart,{compact}));
  for(const value of [null,1,'true',{}])refuse({...base,equalUnits:value},'STAT_CHART_PLAN_INVALID');
  refuse({kind:'DICE_TABLE',faces:2,equalUnits:true},'STAT_CHART_PLAN_INVALID');
  assert.deepEqual(solveStatChart({...marked,equalUnits:false}),solveStatChart(marked));
  const legacy=specOf(marked);
  assert.deepEqual(specOf({...marked,equalUnits:false}),legacy);
  assert.equal(legacy.prims.find(p=>p.id==='x-tick-2').x1,141.283019);
  assert.equal(legacy.prims.find(p=>p.id==='y-tick-2').y1,274.380952);
  for(const chart of [
    {...marked,diagonal:true},
    {...base,xRange:['0.8','2'],yRange:['0.8','2'],xStep:'0.1',yStep:'0.1',points:[{x:'0.8',y:'0.8'},{x:'2',y:'2'}],diagonal:true},
    {...base,xRange:['0','20'],yRange:['0','2'],xStep:'1',yStep:'0.1',points:[{x:'0',y:'0'},{x:'20',y:'2'}],diagonal:true}
  ])for(const compact of [false,true]){
    const equal={...chart,equalUnits:true},model=solveStatChart(equal,{compact}),spec=specOf(equal,compact);
    assert.equal(model.equalUnits,true);
    assert.deepEqual(spec.size,specOf(chart,compact).size,'same canvas');
    const {equalUnits,...unchanged}=model;
    assert.deepEqual(unchanged,solveStatChart(chart,{compact}),'source points and derived memberships unchanged');
    const unit=(role,coord)=>{
      const ts=spec.prims.filter(p=>p.role===role),a=ts[0],b=ts.at(-1);
      return Math.abs((b[coord]-a[coord])/(Number(b.data.value)-Number(a.data.value)));
    };
    assert.ok(Math.abs(unit('x-tick','x1')/unit('y-tick','y1')-1)<1e-7);
    const diagonal=spec.prims.find(p=>p.id==='diagonal');
    assert.ok(Math.abs(Math.abs(diagonal.x2-diagonal.x1)-Math.abs(diagonal.y2-diagonal.y1))<=2e-6,'y=x is physically 45 degrees');
  }
});

test('the engine counts the points of a region from the data and keeps a plan without the new fields as it was',()=>{
  const m=solveStatChart(marked);
  assert.deepEqual(m.refLines,[{type:'x=k',value:'8'},{type:'y=k',value:'8'}]);
  assert.deepEqual(m.regions,[{xMin:'8',xMax:'10',yMin:'8',yMax:'10',countLabel:true,countUnit:'명',markPoints:true,tone:2,inside:[10,11,12,14],count:4}]);   // (8,10) (8,9) (9,8) (10,9)
  const plain=solveStatChart(base);
  assert.ok(!('refLines' in plain)&&!('regions' in plain),'no new keys in the model of a plan that does not use them');
  assert.equal(solveStatChart({...base,regions:[{yMin:'6'}]}).regions[0].count,9);                                   // y >= 6: nine of the fifteen
  assert.equal(solveStatChart({...base,regions:[{xMax:'4'}]}).regions[0].count,4);                                  // x <= 4: (3,2) (3,3) (4,3) (4,6)
  assert.equal(solveStatChart({...base,refLines:[{type:'y=x'}]}).refLines[0].type,'y=x');
  // a long x title widens the frame (a short one leaves the size as it was)
  assert.ok(statChartSize(solveStatChart({...base,xTitle:'읽기 점수(점)'})).width>548);assert.equal(statChartSize(solveStatChart(base)).width,548);
});

test('scatter reference lines and regions that cannot be drawn faithfully are refused with their codes',()=>{
  const g=extra=>({...base,...extra});
  refuse(g({refLines:[]}),'STAT_SCATTER_GUIDE_INVALID');refuse(g({refLines:[{type:'z=k',value:'8'}]}),'STAT_SCATTER_GUIDE_INVALID');
  refuse(g({refLines:[{type:'x=k'}]}),'STAT_SCATTER_GUIDE_INVALID');refuse(g({refLines:[{type:'y=x',value:'3'}]}),'STAT_SCATTER_GUIDE_INVALID');
  refuse(g({diagonal:true,refLines:[{type:'y=x'}]}),'STAT_SCATTER_GUIDE_INVALID');
  refuse(g({refLines:[{type:'x=k',value:'8'},{type:'x=k',value:'8'}]}),'STAT_SCATTER_GUIDE_INVALID');
  refuse(g({refLines:[{type:'x=k',value:'11'}]}),'STAT_SCATTER_GUIDE_OUT_OF_RANGE');refuse(g({refLines:[{type:'y=k',value:'-1'}]}),'STAT_SCATTER_GUIDE_OUT_OF_RANGE');
  refuse(g({xStep:'2',refLines:[{type:'x=k',value:'3'}]}),'STAT_SCATTER_GUIDE_NOT_ON_STEP');
  refuse(g({refLines:[{type:'x=k',value:'8',extra:1}]}),'STAT_SCATTER_GUIDE_INVALID');
  refuse(g({regions:[]}),'STAT_SCATTER_REGION_INVALID');refuse(g({regions:[{}]}),'STAT_SCATTER_REGION_INVALID');
  refuse(g({regions:[{xMin:'8',xMax:'8'}]}),'STAT_SCATTER_REGION_INVALID');refuse(g({regions:[{xMin:'9',xMax:'3'}]}),'STAT_SCATTER_REGION_INVALID');
  refuse(g({regions:[{xMin:'8',countUnit:'명'}]}),'STAT_SCATTER_REGION_INVALID');                                    // a unit needs a count label
  refuse(g({regions:[{xMin:'8',tone:3}]}),'STAT_SCATTER_REGION_INVALID');refuse(g({regions:[{xMin:'8',markPoints:1}]}),'STAT_SCATTER_REGION_INVALID');
  refuse(g({regions:[{xMin:'8',colour:'red'}]}),'STAT_SCATTER_REGION_INVALID');
  refuse(g({regions:[{xMin:'11'}]}),'STAT_SCATTER_GUIDE_OUT_OF_RANGE');
  refuse(g({xStep:'2',regions:[{xMin:'3'}]}),'STAT_SCATTER_REGION_NOT_ON_STEP');
  refuse(g({regions:[{xMin:'0',xMax:'2'}]}),'STAT_SCATTER_REGION_EMPTY');                                           // no point in it
  refuse(g({regions:Array(4).fill({xMin:'8'})}),'STAT_SCATTER_REGION_INVALID');
});

test('the observer passes a scatter with lines, region, rings and a count and catches each wrong one',async()=>{
  const browser=await launchBrowser();
  try{
    let n=0;
    const compose=async(chart,identity)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:identity??assetIdentity('26_테스트|'+(8000+n++),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assertAccessibleNames(composed.svg);
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const pass=async(chart,svg)=>{const r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));return r;};
    const edit=(svg,re,fn)=>{assert.ok(re.test(svg),String(re));return svg.replace(re,fn);};
    const bump=(svg,id,attr,delta)=>edit(svg,new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`),(m,head,x)=>head+(Number(x)+delta));
    const svg=await compose(marked);
    await pass(marked,svg);
    assert.equal((svg.match(/data-role="point-ring"/g)||[]).length,4,'a ring on each of the 4 points in the region');
    assert.equal((svg.match(/data-role="ref-line"/g)||[]).length,2);
    // the plan against the figure: another region, another line value, another count
    assert.ok(has(await audit({...marked,regions:[{xMin:'7',yMin:'8',markPoints:true,countLabel:true,countUnit:'명',tone:2}]},svg),'SC_SCATTER_'),'a wider region');
    assert.ok(has(await audit({...marked,refLines:[{type:'x=k',value:'7'},{type:'y=k',value:'8'}]},svg),'SC_SCATTER_REF_PLACE:0'));
    assert.ok(has(await audit({...marked,regions:[{xMin:'8',yMin:'8',markPoints:true,tone:2}]},svg),'SC_SCATTER_COUNT_LABEL_UNEXPECTED:0'),'a count the plan does not ask for');
    assert.ok(has(await audit({...marked,regions:[{xMin:'8',yMin:'8',countLabel:true,countUnit:'명',tone:2}]},svg),'SC_SCATTER_RING_SET'),'rings the plan does not ask for');
    // the drawing: a line moved, a region moved, a ring moved/removed/added, a count rewritten, a lighter tone
    assert.ok(has(await audit(marked,bump(svg,'ref-1','y1',3).replace(/(id="ref-1"[^>]*? y2=")([\d.]+)/,(m,head,y)=>head+(Number(y)+3))),'SC_SCATTER_REF_PLACE:1'));
    assert.ok(has(await audit(marked,svg.replace(/<g data-layer="36"><line id="ref-0"[^>]*\/><\/g>/,'')),'SC_SCATTER_REF_COUNT'));
    assert.ok(has(await audit(marked,bump(svg,'region-0','x',4)),'SC_SCATTER_REGION_PLACE:0'));
    assert.ok(has(await audit(marked,svg.replace(/(id="region-0"[^>]*) fill-opacity="[\d.]+"/,'$1 fill-opacity="0.12"')),'SC_SCATTER_REGION_STYLE:0'));
    assert.ok(has(await audit(marked,bump(svg,'ring-0-10','cx',5)),'SC_SCATTER_RING_PLACE:0:10'));
    assert.ok(has(await audit(marked,svg.replace(/<g data-layer="72"><circle id="ring-0-12"[^>]*\/><\/g>/,'')),'SC_SCATTER_RING_SET'));
    assert.ok(has(await audit(marked,svg.replace(/(id="region-0-count"[^>]*data-text=")4명/,'$15명')),'SC_SCATTER_COUNT_MISMATCH:0'));
    assert.ok(has(await audit(marked,svg.replace(/(id="region-0-count"[^>]*data-value=")4/,'$15')),'SC_SCATTER_COUNT_MISMATCH:0'));
    // a plain scatter plan and one with a "y=x" line (no region) pass too
    const legacyIdentity=assetIdentity('26_테스트|8999','SOLUTION_VISUAL','decisive-relation');
    const plain=await compose(base,legacyIdentity);
    await pass(base,plain);
    assert.equal(await compose({...base,equalUnits:false},legacyIdentity),plain,'false keeps every legacy rendered SVG byte');
    assert.deepEqual((await audit({...base,equalUnits:true},plain)).errors,['SC_SCATTER_EQUAL_UNITS'],'a self-consistent unequal-scale SVG is rejected for the opt-in plan');
    assert.ok(has(await audit(base,svg),'SC_SCATTER_'),'a figure with lines for a plan that has none');
    const diag={...base,refLines:[{type:'y=x'}]};
    await pass(diag,await compose(diag));
    const equal={...marked,equalUnits:true,diagonal:true},equalSvg=await compose(equal);
    await pass(equal,equalSvg);
    assert.equal((equalSvg.match(/data-role="point-ring"/g)||[]).length,4);
    assert.equal((equalSvg.match(/data-role="point"/g)||[]).length,POINTS.length);
  }finally{await browser.close();}
});
