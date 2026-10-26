// graphPlan.overlays (G1): the fitted plan, the composed spec objects (line/vertical/point/segment/guide/polygon) and the semantic
// engine accept one general overlay layer. No Chrome: framing, the model spec and the semantic validation are the unit boundary.
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {planNameExpectations} from '../production/point-name-observer.mjs';

const plan={capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['-1','0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-3,3],
  viewport:[-3,3,-2,9],requiredPoints:[{id:'A',x:1,y:0}],
  overlays:{lines:[{id:'L',slope:'1',intercept:'1'},{id:'V',x:'2'}],
    points:[{id:'P',curveX:'-2'},{id:'Q',intersect:['L','V']},{id:'O',axis:'x',value:'0'}],
    segments:[{id:'S',from:'P',to:'Q'}],guides:[{id:'G',from:'P',axis:'BOTH'}],polygons:[{id:'T',points:['O','P','Q']}]}},
  caption:'그래프 위 보조 요소',pointNames:{P:'P',Q:'Q',O:'O'}};

const prepared=async()=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {framed:framed.result.graphPlan,spec:specFor({...plan,graphPlan:framed.result.graphPlan},model.result,'overlay-test')};
};

test('overlays reach the final spec objects with the exact coordinates',async()=>{
  const {framed,spec}=await prepared();
  const points=Object.fromEntries(spec.objects.filter(object=>object.kind==='POINT').map(object=>[object.id,object.at]));
  assert.deepEqual(points.P,[-2,3]);assert.deepEqual(points.Q,[2,3]);assert.deepEqual(points.O,[0,0]);
  assert.deepEqual(spec.objects.find(object=>object.id==='overlay-line-L').coefficients,[1,-1,1]);
  assert.deepEqual(spec.objects.find(object=>object.id==='overlay-line-V').coefficients,[1,0,-2]);
  assert.equal(spec.objects.find(object=>object.id==='overlay-line-L-equation').text,'y=x+1');
  assert.equal(spec.objects.find(object=>object.id==='overlay-line-V-equation').text,'x=2');
  assert.deepEqual(spec.objects.find(object=>object.id==='overlay-segment-S').from,[-2,3]);
  assert.deepEqual(spec.objects.find(object=>object.id==='overlay-guide-G-x').to,[-2,0]);
  assert.deepEqual(spec.objects.find(object=>object.id==='overlay-guide-G-y').to,[0,3]);
  assert.deepEqual(spec.objects.find(object=>object.id==='overlay-polygon-T').refs,['O','P','Q']);
  assert.equal(spec.objects.find(object=>object.id==='overlay-polygon-T').fill,'LIGHT');
  assert.equal(framed.overlaysFeatures.points.length,3);
});

test('the semantic engine accepts the overlay polygon and reads it back',async()=>{
  const {spec}=await prepared();
  const response=await pythonWorker({action:'prepare',spec});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  const primitives=response.result.prepared.primitives;
  assert.ok(primitives.some(primitive=>primitive.id==='overlay-polygon-T'));
  assert.ok(primitives.some(primitive=>primitive.id==='overlay-polygon-T-fill'&&primitive.kind==='polygon'));
});

test('overlay point names are read back by their own owner id',async()=>{
  const expectations=planNameExpectations(plan);
  assert.deepEqual(expectations.find(entry=>entry.owner==='P'),{owner:'P',name:'P'});
  assert.deepEqual(expectations.find(entry=>entry.owner==='Q'),{owner:'Q',name:'Q'});
  assert.ok(!expectations.some(entry=>entry.owner.startsWith('required-point-')));
});

test('a bad overlay is refused with its explicit code',async()=>{
  const bad={...plan,graphPlan:{...plan.graphPlan,overlays:{points:[{id:'P',curveX:'9'}]}}};
  const framed=await pythonWorker({action:'frame_graph',graphPlan:bad.graphPlan});
  assert.equal(framed.status,'ERROR');
  assert.equal(framed.result.code,'OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:P');
});
