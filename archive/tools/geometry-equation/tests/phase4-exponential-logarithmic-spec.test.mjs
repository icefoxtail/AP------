import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));

async function preparedSpec(capability,request,caption){
  const plan=(await pythonWorker({action:'frame_graph',graphPlan:request})).result.graphPlan;
  const graph=(await pythonWorker({action:'graph',graphPlan:plan})).result;
  const observation=(await pythonWorker({graphPlan:plan,svg:graph.svg,transform:graph.transform},{script:observer})).result;
  const spec=specFor({capability,graphPlan:plan,caption},graph,'transcendental-overview-fixture');
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  return {plan,graph,observation,spec,prepared};
}

test('exponential and logarithmic overview routes have separate capabilities and fingerprints',()=>{
  for(const capability of ['exponential-affine-spike-v1','logarithmic-affine-spike-v1'])assert.equal(CAPABILITIES[capability].status,'EXPERIMENTAL');
  const exponential=scopeFingerprint(root,'exponential-affine-spike-v1'),logarithmic=scopeFingerprint(root,'logarithmic-affine-spike-v1');
  assert.notEqual(exponential,logarithmic);
  for(const capability of ['polynomial-spike-v1','rational-spike-v1','sqrt-affine-spike-v1','absolute-value-spike-v1','piecewise-affine-spike-v1']){
    assert.notEqual(exponential,scopeFingerprint(root,capability));assert.notEqual(logarithmic,scopeFingerprint(root,capability));
  }
});

test('exponential spec publishes a reference point and horizontal asymptote',async()=>{
  const result=await preparedSpec('exponential-affine-spike-v1',{family:'exponential-affine',coefficients:['1','1','0'],sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],viewport:[-3,3,-2,12]},'Exponential function overview');
  assert.equal(result.observation.status,'PASS',JSON.stringify(result.observation.errors));
  assert.deepEqual(result.plan.exponentialFeatures.referencePoint,{x:'0',y:'1'});
  assert.ok(result.spec.objects.find(object=>object.id==='f').expression.includes('exp('));
  assert.ok(result.prepared.prepared.primitives.some(primitive=>primitive.role==='exponential-asymptote'));
  assert.ok(result.prepared.prepared.primitives.some(primitive=>primitive.role==='exponential-reference'&&primitive.state==='CLOSED'));
});

test('logarithmic spec preserves natural domain, exact reference and boundary cue',async()=>{
  const result=await preparedSpec('logarithmic-affine-spike-v1',{family:'logarithmic-affine',coefficients:['1','1','0','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},domain:[.1,4],viewport:[-1,5,-5,5]},'Natural logarithm overview');
  assert.equal(result.observation.status,'PASS',JSON.stringify(result.observation.errors));
  assert.deepEqual(result.plan.logarithmicFeatures.referencePoint,{x:'1',y:'0',argument:'1'});
  assert.ok(result.plan.domain[0]>0);
  assert.ok(result.spec.objects.find(object=>object.id==='f').expression.includes('log('));
  assert.ok(result.spec.objects.some(object=>object.id==='reference-value'&&object.kind==='EQUATION_LABEL'));
  assert.ok(result.prepared.prepared.primitives.some(primitive=>primitive.role==='logarithmic-domain-boundary'&&primitive.dash==='5 4'));
  assert.ok(result.prepared.prepared.primitives.some(primitive=>primitive.role==='logarithmic-reference'&&primitive.state==='CLOSED'));
});
