// Graph shaded regions (graphPlan.regions): the phase2 spec, the engine's prepared fill path and the independent graph observer on the
// runPhase2 model SVG. No Chrome: publication composition is covered by the archive/candidate suites; this file keeps the graph contract
// (boundary re-computation, fill path, order, label) fail-closed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const OBSERVER=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const CAPABILITY='piecewise-polynomial-spike-v1';
const planWith=regions=>({family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']}],breakpoints:[],
  sourceDomain:{kind:'INTERVAL',range:['-2','2'],states:['CLOSED','CLOSED']},formula:'x^2',
  requiredPoints:[{id:'O',x:0,y:0}],axisTickValues:{x:[],y:[]},regions});
const REGION={id:'S1',upper:'f',lower:'axis',from:'1/5',to:'1',fill:'LIGHT',label:'S_1'};
const LINE_PLAN={family:'piecewise-polynomial',pieces:[{coefficients:['0','-4','1']},{coefficients:['0','4','-1']},{coefficients:['0','-4','1']}],
  breakpoints:[{x:'0',y:'0'},{x:'4',y:'0'}],sourceDomain:{kind:'INTERVAL',range:['-1','5'],states:['CLOSED','CLOSED']},formula:'abs(x^2-4x)',
  referenceLines:[{id:'a',y:'2',intersectionX:['2-sqrt(6)','2-sqrt(2)','2+sqrt(2)','2+sqrt(6)']}],
  requiredPoints:[{id:'O',x:0,y:0},{id:'M',x:2,y:4},{id:'P',x:4,y:0}],axisTickValues:{x:[],y:[]},
  regions:[{id:'S1',upper:'f',lower:'a',from:'2-sqrt(2)',to:'2',fill:'MEDIUM',label:'S_1'}]};

async function frame(graphPlan){
  const response=await pythonWorker({action:'frame_graph',graphPlan});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  return response.result.graphPlan;
}
async function model(graphPlan){
  const response=await pythonWorker({action:'graph',graphPlan});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  return response.result;
}
async function graphAudit(graphPlan,svg,transform){
  const {aspectPolicy,...frame}=transform;
  const response=await pythonWorker({graphPlan,svg,transform:frame},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  return response.result;
}
async function fullPlan(graphPlan){
  const framed=await frame(graphPlan);
  return {plan:{capability:CAPABILITY,caption:'그래프 영역을 색칠했다.',graphPlan:framed},framed};
}
const regionPath=(svg,id)=>new RegExp('<path\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)?.[0];
const redraw=(svg,id,change)=>{const tag=regionPath(svg,id);const d=/\sd="([^"]*)"/.exec(tag);return svg.replace(tag,tag.replace(d[0],' d="'+change(d[1])+'"'));};

test('framing freezes exact boundary rows for a curve/axis region, clipped to [from,to]',async()=>{
  const fitted=await frame(planWith([REGION]));
  const row=fitted.piecewisePolynomialFeatures.regions[0];
  assert.deepEqual(Object.keys(row).sort(),['domain','fill','from','id','label','lower','lowerRows','to','upper','upperRows']);
  assert.deepEqual(row.domain,[0.2,1]);assert.deepEqual(row.upperRows,[{coefficients:['0','0','1'],interval:['1/5','1']}]);
  assert.deepEqual(row.lowerRows,[{coefficients:['0','0','0'],interval:['1/5','1']}]);
  const line=(await frame(LINE_PLAN)).piecewisePolynomialFeatures.regions[0];
  assert.deepEqual(line.lowerRows,[{coefficients:['2','0','0'],interval:['2-sqrt(2)','2']}]);
});

test('a crossing, an unknown boundary and a bad fill are refused with explicit codes',async()=>{
  const cases=[
    [planWith([{...REGION,from:'-1',to:'1'}]),'GRAPH_REGION_BOUNDARIES_CROSS:S1'],
    [planWith([{...REGION,upper:'h'}]),'GRAPH_REGION_BOUNDARY_UNKNOWN:S1:h'],
    [planWith([{...REGION,fill:'HATCH'}]),'GRAPH_REGION_FILL_UNSUPPORTED:S1'],
    [planWith([{...REGION,id:'1bad'}]),'GRAPH_REGION_ID_INVALID'],
    [planWith([REGION,{...REGION}]),'GRAPH_REGION_ID_DUPLICATE:S1'],
  ];
  for(const [graphPlan,code] of cases){
    const response=await pythonWorker({action:'frame_graph',graphPlan});
    assert.notEqual(response.status,'OK',code);
    assert.ok(String(response.result?.code).startsWith(code),`${code} expected, got ${response.result?.code}`);
  }
});

test('phase2 turns every frozen region into one GRAPH_REGION object and the engine samples it beneath the curves',async()=>{
  const {plan,framed}=await fullPlan(planWith([REGION]));
  const graphModel=await model(framed);
  const spec=specFor(plan,graphModel,'graph-region-fixture');
  const region=spec.objects.find(object=>object.id==='region-S1');
  assert.ok(region);assert.equal(region.kind,'GRAPH_REGION');assert.equal(region.fill,'LIGHT');
  assert.deepEqual(region.upper,[{expression:'x^2',domain:[0.2,1]}]);assert.deepEqual(region.lower,[{expression:'0',domain:[0.2,1]}]);
  const prepared=await pythonWorker({action:'prepare',spec});
  assert.equal(prepared.status,'OK',JSON.stringify(prepared.result));
  const primitive=prepared.result.prepared.primitives.find(row=>row.id==='region-S1');
  assert.ok(primitive);assert.equal(primitive.layer,10);assert.match(primitive.d,/^M[-\d.]+ [-\d.]+ L/);assert.equal(primitive.fillRule,'evenodd');
  assert.ok(prepared.result.labels.some(label=>label.id==='region-S1-label'));
});

test('the runPhase2 model passes the independent graph observer and a moved fill, a wrong fill or a missing region fails it',async()=>{
  const {framed}=await fullPlan(planWith([REGION]));
  const graphModel=await model(framed);
  const report=await graphAudit(framed,graphModel.svg,graphModel.transform);
  assert.equal(report.status,'PASS',JSON.stringify(report.errors));
  assert.deepEqual(report.regions.map(row=>[row.id,row.fill,row.samples]),[['S1','LIGHT',9]]);
  const moved=redraw(graphModel.svg,'region-S1',d=>d.replace(/L([-\d.]+),([-\d.]+)/g,(_,x,y)=>`L${x},${Number(y)-3}`));
  assert.ok((await graphAudit(framed,moved,graphModel.transform)).errors.includes('GRAPH_REGION_BOUNDARY_MISMATCH:S1'));
  const wrongFill=graphModel.svg.replace(regionPath(graphModel.svg,'region-S1'),regionPath(graphModel.svg,'region-S1').replace('#e4e7ec','#c7ccd5'));
  assert.ok((await graphAudit(framed,wrongFill,graphModel.transform)).errors.includes('GRAPH_REGION_FILL_MISMATCH:S1'));
  const missing=graphModel.svg.replace(regionPath(graphModel.svg,'region-S1'),'');
  assert.ok((await graphAudit(framed,missing,graphModel.transform)).errors.includes('GRAPH_REGION_MISSING:S1'));
});

test('a curve/line region is drawn between the intersections and passes the observer',async()=>{
  const {framed}=await fullPlan(LINE_PLAN);
  const graphModel=await model(framed);
  const report=await graphAudit(framed,graphModel.svg,graphModel.transform);
  assert.equal(report.status,'PASS',JSON.stringify(report.errors));
  assert.ok(Math.abs(report.regions[0].from-(2-Math.SQRT2))<1e-9);assert.ok(Math.abs(report.regions[0].to-2)<1e-12);
});
