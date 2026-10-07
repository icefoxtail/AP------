import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));

test('sqrt-affine has a distinct experimental capability and fingerprint',()=>{
  const descriptor=CAPABILITIES['sqrt-affine-spike-v1'];
  assert.equal(descriptor.status,'EXPERIMENTAL');
  assert.ok(descriptor.requiredAudits.includes('SQRT_DOMAIN_ENDPOINT'));
  assert.ok(descriptor.requiredAudits.includes('SQRT_ENDPOINT_MARKER'));
  const fingerprint=scopeFingerprint(root,'sqrt-affine-spike-v1');
  assert.notEqual(fingerprint,scopeFingerprint(root,'polynomial-spike-v1'));
  assert.notEqual(fingerprint,scopeFingerprint(root,'rational-spike-v1'));
});

test('positive-boundary source uses sqrt-affine route and keeps y-axis outside the viewport',async()=>{
  const request={family:'sqrt-affine',radicand:['-200','2'],sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[100,120],viewport:[0,130,-1,10]};
  const framed=(await pythonWorker({action:'frame_graph',graphPlan:request})).result;
  assert.equal(framed.policy,'SQRT_AFFINE_ENDPOINT_OVERVIEW_v1');
  assert.equal(framed.sourceDomainPreserved,true);
  const graphPlan=framed.graphPlan;
  assert.equal(graphPlan.domain[0],100);
  assert.ok(graphPlan.viewport[0]>0&&graphPlan.viewport[0]<100);
  const graphModel=(await pythonWorker({action:'graph',graphPlan})).result;
  const visualPlan={capability:'sqrt-affine-spike-v1',graphPlan,caption:'제곱근 함수의 그래프'};
  const spec=specFor(visualPlan,graphModel,'sqrt-affine-phase4-fixture');
  assert.match(spec.objects.find(object=>object.id==='f').expression,/^sqrt\(/);
  assert.deepEqual(spec.axes,{x:true,y:false});
  assert.equal(spec.displayFacts.sqrtFeatures.radicandBoundaryX,'100');
  assert.equal(spec.displayFacts.sqrtFeatures.sourceEndpoints[0].state,'CLOSED');
  const graphObject=spec.objects.find(object=>object.id==='f');assert.equal(graphObject.criticalX.length,2);assert.ok(graphObject.criticalX[1]>100&&graphObject.criticalX[1]<101);
});
