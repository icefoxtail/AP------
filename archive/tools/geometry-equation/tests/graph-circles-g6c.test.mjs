// G6c: the composed spec for a circleRegion bounded by drawn-curve pieces and circle arcs (a FILL_REGION whose curve step passes through the sampled vertices),
// and the exact touching point of the circle and the curve. No Chrome: framing, the model spec and the semantic validation are the unit boundary.
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const PARABOLA={family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']}],sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],requiredPoints:[{id:'V',x:0,y:0}],coordinateBand:{hide:['V']},axisTickValues:{x:[],y:[]},
  overlays:{circles:[{id:'C',center:['0','2'],radiusSquared:'4'}],
    points:[{id:'T',intersect:['curve','C'],pick:'TANGENT',unnamed:true},{id:'P',intersect:['curve','C'],pick:'MAX_X'}],
    circleRegions:[{id:'S1',fill:'LIGHT',label:'S_1',boundary:[{curve:'curve',fromX:'0',toX:'sqrt(3)'},{arc:'C',from:'P',to:'T',sweep:'MINOR'}]}]}};

const prepare=async graphPlan=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const plan={capability:'piecewise-polynomial-spike-v1',caption:'원과 포물선',graphPlan:framed.result.graphPlan,pointNames:{P:'P'}};
  return {framed:framed.result.graphPlan,spec:specFor(plan,model.result,'g6c-test')};
};

test('a boundary circleRegion reaches the spec as a FILL_REGION with a curve step through the sampled vertices and a true arc',async()=>{
  const {spec}=await prepare(PARABOLA);
  const region=spec.objects.find(object=>object.id==='overlay-circle-region-S1');
  assert.equal(region.kind,'FILL_REGION');assert.equal(region.labelText,'S_1');
  const [curve,arc]=region.loops[0].steps;
  assert.ok(curve.via.length>=90);assert.equal(curve.arc,undefined);
  assert.equal(arc.arc.sweep,'CW');assert.equal(arc.to,region.loops[0].start);
  const junction=spec.objects.find(object=>object.id===region.loops[0].start);assert.equal(junction.kind,'POINT');assert.equal(junction.marker,'NONE');
});

test('the touching point is the exact vertex of the parabola',async()=>{
  const {framed}=await prepare(PARABOLA);
  const point=framed.overlaysFeatures.points.find(row=>row.id==='T');assert.deepEqual([point.xExact,point.yExact],['0','0']);
});

test('a refused boundary names its code',async()=>{
  const open=structuredClone(PARABOLA);open.overlays.circleRegions[0].boundary[1].to='P';open.overlays.circleRegions[0].boundary[1].from='T';
  const framed=await pythonWorker({action:'frame_graph',graphPlan:open});
  assert.notEqual(framed.status,'OK');assert.ok(JSON.stringify(framed.result).includes('OVERLAY_CIRCLE_REGION_BOUNDARY_NOT_CLOSED'),JSON.stringify(framed.result));
});
