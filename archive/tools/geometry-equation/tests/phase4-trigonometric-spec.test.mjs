import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));

async function make(functionName,coefficients,phasePi,sourceDomain){
  const request={family:'trigonometric',function:functionName,coefficients,phasePi,sourceDomain,domain:[-4,4],viewport:[-5,5,-5,5]};
  const plan=(await pythonWorker({action:'frame_graph',graphPlan:request})).result.graphPlan;
  const graph=(await pythonWorker({action:'graph',graphPlan:plan})).result;
  const observation=(await pythonWorker({graphPlan:plan,svg:graph.svg,transform:graph.transform},{script:observer})).result;
  const spec=specFor({capability:'trigonometric-spike-v1',graphPlan:plan,caption:'삼각함수의 한 주기 그래프'},graph,'trig-overview-fixture');
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  return {plan,graph,observation,spec,prepared};
}

test('trigonometric route is distinct and periodic capability remains experimental',()=>{
  assert.equal(CAPABILITIES['trigonometric-spike-v1'].status,'EXPERIMENTAL');
  assert.ok(CAPABILITIES['trigonometric-spike-v1'].requiredAudits.includes('TRIG_TAN_POLE_BRANCHES'));
  const fingerprint=scopeFingerprint(root,'trigonometric-spike-v1');
  for(const capability of ['polynomial-spike-v1','rational-spike-v1','absolute-value-spike-v1','piecewise-affine-spike-v1','exponential-affine-spike-v1','logarithmic-affine-spike-v1'])assert.notEqual(fingerprint,scopeFingerprint(root,capability));
});

test('sine and cosine specs preserve exact amplitude phase period and feature markers',async()=>{
  const sine=await make('SIN',['2','1','0'],'1/2',{kind:'ALL_REALS'});
  assert.equal(sine.observation.status,'PASS',JSON.stringify(sine.observation.errors));
  assert.equal(sine.plan.trigFeatures.phasePi,'1/2');assert.equal(sine.plan.trigFeatures.cycleCenterPi,'-1/2');
  assert.equal(sine.plan.trigFeatures.periodPiMultiple,'2');assert.equal(sine.spec.objects[0].expression.includes('sin('),true);
  assert.equal(sine.spec.objects.find(object=>object.id==='period-label').text,'T=2π');
  assert.equal(sine.prepared.prepared.primitives.filter(primitive=>primitive.role==='trig-feature').length,5);
  const cosine=await make('COS',['-1','-2','3'],'1/4',{kind:'ALL_REALS'});
  assert.equal(cosine.observation.status,'PASS',JSON.stringify(cosine.observation.errors));
  assert.equal(cosine.plan.trigFeatures.centerBehavior,'MINIMUM');
  assert.equal(cosine.spec.objects[0].expression.includes('cos('),true);
});

test('tangent spec preserves its exact pole-to-pole branch and dashed cues',async()=>{
  const tangent=await make('TAN',['1','1','0'],'1/4',{kind:'ALL_REALS_WITH_TAN_POLES'});
  assert.equal(tangent.observation.status,'PASS',JSON.stringify(tangent.observation.errors));
  assert.deepEqual(tangent.plan.trigFeatures.poles.map(pole=>pole.xPiMultiple),['-3/4','1/4']);
  assert.equal(tangent.spec.objects.find(object=>object.id==='period-label').text,'T=π');
  assert.equal(tangent.prepared.prepared.primitives.filter(primitive=>primitive.role==='trig-pole').length,2);
  assert.ok(tangent.prepared.prepared.primitives.filter(primitive=>primitive.role==='trig-pole').every(primitive=>primitive.dash==='5 4'));
  assert.ok(tangent.prepared.prepared.primitives.some(primitive=>primitive.role==='trig-reference'));
});
