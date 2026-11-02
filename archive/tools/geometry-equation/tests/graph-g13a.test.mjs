// G13a: the spec objects of right-angle squares and equal-angle arcs on a graph, and the vertical asymptote label place. No Chrome: framing, the model spec and the
// semantic engine's primitives are the unit boundary.
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const prepare=async plan=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const full={...plan,graphPlan:framed.result.graphPlan};return {framed:framed.result.graphPlan,spec:specFor(full,model.result,'g13a-test')};
};
const parabola=extra=>({capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients:['4','0','-1']}],sourceDomain:{kind:'ALL_REALS'},axisTickValues:{x:[],y:[]},
  requiredPoints:[{id:'V',x:'0',y:'4',marker:'NONE'}],coordinateBand:{hide:['V']},
  overlays:{points:[{id:'A',axis:'x',value:'-2'},{id:'B',axis:'x',value:'2'},{id:'P',curveX:'1'},{id:'Q',axis:'x',value:'7-3*sqrt(5)'}],
    angles:[{at:'P',from:'A',to:'Q'},{at:'P',from:'Q',to:'B'}],equalAngles:[{angles:[0,1],color:'BLUE'}],
    segments:[{id:'PQ',from:'P',to:'Q'}]}},caption:'g13a',...extra});

test('equal angles become coloured sector-and-arc angle marks on the overlay points, and no square id is declared',async()=>{
  const {spec}=await prepare(parabola());
  const marks=spec.objects.filter(object=>object.kind==='ANGLE_MARK');
  assert.deepEqual(marks.map(mark=>mark.id),['overlay-angle-ang1','overlay-angle-ang2']);
  assert.deepEqual(marks[0].refs,['A','P','Q']);assert.deepEqual(marks[1].refs,['Q','P','B']);
  assert.deepEqual([marks[0].color,marks[1].color,marks[0].arcs,marks[0].style,marks[0].arcScale],['BLUE','BLUE',1,'SECTOR','PROPORTIONAL']);
  assert.ok(Math.abs(marks[0].value-marks[1].value)<1e-9);
  assert.equal(spec.displayFacts.squareAngleIds,undefined);
  const response=await pythonWorker({action:'prepare',spec});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const primitive=id=>response.result.prepared.primitives.find(row=>row.id===id);
  assert.equal(primitive('overlay-angle-ang1-arc-1').stroke,'#1f5fa8');assert.equal(primitive('overlay-angle-ang2-sector').fill,'#7fa6e8');
});

test('a right angle is a square of the graph size drawn between its two legs',async()=>{
  const plan=parabola();delete plan.graphPlan.overlays.angles;delete plan.graphPlan.overlays.equalAngles;
  plan.graphPlan.overlays.points.push({id:'R',x:'0',y:'0'},{id:'S',x:'0',y:'3'});plan.graphPlan.overlays.rightAngles=[{at:'R',from:['B','S']}];
  const {spec}=await prepare(plan);
  const mark=spec.objects.find(object=>object.id==='overlay-rightangle-ra1');
  assert.deepEqual([mark.kind,mark.refs,mark.value,mark.squareSize],['ANGLE_MARK',['B','R','S'],90,16]);
  assert.deepEqual(spec.displayFacts.squareAngleIds,['overlay-rightangle-ra1']);
  const response=await pythonWorker({action:'prepare',spec});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const square=response.result.prepared.primitives.find(row=>row.id==='overlay-rightangle-ra1');
  assert.equal(square.points.length,3);
  const [first,corner,last]=square.points;
  const leg=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);assert.ok(Math.abs(leg(first,corner)-16)<1e-6&&Math.abs(leg(corner,last)-16)<1e-6);
});

test('lines that are not perpendicular are refused with their code',async()=>{
  const bad=parabola();delete bad.graphPlan.overlays.angles;delete bad.graphPlan.overlays.equalAngles;
  bad.graphPlan.overlays.lines=[{id:'l1',slope:'1',intercept:'0'},{id:'l2',slope:'-2',intercept:'1'}];bad.graphPlan.overlays.rightAngles=[{lines:['l1','l2']}];
  const framed=await pythonWorker({action:'frame_graph',graphPlan:bad.graphPlan});
  assert.equal(framed.status,'ERROR');assert.equal(framed.result.code,'GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR:ra1');
});

test('verticalAsymptoteLabelAt puts the label beside the dashed line, and NONE draws none',async()=>{
  const rational=place=>({capability:'rational-spike-v1',graphPlan:{family:'rational',numerator:['-2','3'],denominator:['2','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-9,3],viewport:[-9,3,-6,10],axisTickValues:{x:[],y:[]},
    ...(place?{verticalAsymptoteLabelAt:place}:{})},caption:'g13a'});
  const label=async place=>(await prepare(rational(place))).spec.objects.find(object=>object.id==='vertical-asymptote-label');
  const before=await label(undefined);assert.equal(before.directions,undefined);   // without the field: the old place, no direction
  const left=await label('BOTTOM_LEFT');assert.deepEqual([left.text,left.directions[0],left.at[0]],['x=-2','W',-2]);assert.ok(left.at[1]<0);
  const right=await label('TOP_RIGHT');assert.deepEqual([right.directions[0]],['E']);assert.ok(right.at[1]>0);
  assert.equal(await label('NONE'),undefined);
});
