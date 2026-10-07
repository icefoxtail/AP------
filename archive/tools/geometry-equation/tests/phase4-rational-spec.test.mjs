import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));

async function prepareRational({numerator,denominator,caption}){
  const request={family:'rational',numerator,denominator,domain:[-4,4],viewport:[-4,4,-4,4],sourceDomain:{kind:'ALL_REALS'}};
  const framed=(await pythonWorker({action:'frame_graph',graphPlan:request})).result;
  assert.equal(framed.policy,'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1');
  assert.equal(framed.sourceDomainPreserved,true);
  const graphPlan=framed.graphPlan;
  const graphModel=(await pythonWorker({action:'graph',graphPlan})).result;
  const spec=specFor({capability:'rational-spike-v1',graphPlan,caption},graphModel,'rational-phase4-fixture');
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  return {framed,graphModel,spec,prepared};
}

test('rational is an explicit experimental capability with its own fingerprinted observer contract',()=>{
  const descriptor=CAPABILITIES['rational-spike-v1'];
  assert.equal(descriptor.status,'EXPERIMENTAL');
  assert.ok(descriptor.requiredAudits.includes('RATIONAL_POLE_HOLE'));
  assert.ok(descriptor.requiredAudits.includes('RATIONAL_ASYMPTOTES'));
  assert.notEqual(scopeFingerprint(root,'rational-spike-v1'),scopeFingerprint(root,'polynomial-spike-v1'));
});

test('pole plan materializes separate exact pole and horizontal-asymptote cues',async()=>{
  const {graphModel,spec,prepared}=await prepareRational({numerator:['1','1'],denominator:['-1','1'],caption:'합성 유리함수 그래프'});
  assert.match(spec.objects.find(obj=>obj.id==='f').expression,/\)\/\(/);
  assert.equal(spec.displayFacts.rationalGraphFeatures.singularity.kind,'VERTICAL_POLE');
  const asymptotes=prepared.prepared.primitives.filter(item=>item.role==='asymptote');
  assert.deepEqual(asymptotes.map(item=>item.id).sort(),['rational-asymptote-horizontal','rational-asymptote-vertical']);
  assert.ok(asymptotes.every(item=>item.dash));
  assert.match(graphModel.svg,/data-axis="vertical"/);
  assert.match(graphModel.svg,/data-axis="horizontal"/);
});

test('cancelled denominator root materializes a white open hole and preserves its exclusion',async()=>{
  const {graphModel,spec,prepared}=await prepareRational({numerator:['-1','1'],denominator:['-1','1'],caption:'합성 유리함수의 뚫린 점'});
  assert.equal(spec.displayFacts.rationalGraphFeatures.singularity.kind,'REMOVABLE_HOLE');
  assert.equal(spec.displayFacts.rationalGraphPolicy.holeMarkerRadiusIntrinsicPx,4);
  assert.equal(spec.displayFacts.rationalGraphPolicy.minimumHoleMarkerDiameterCssPx,4.5);
  assert.ok(spec.objects.some(obj=>obj.id==='removable-hole-label'&&obj.text==='뚫린 점'));
  const marker=prepared.prepared.primitives.find(item=>item.role==='hole');
  assert.ok(marker);assert.equal(marker.fill,'#fff');
  assert.match(graphModel.svg,/data-role="hole"[^>]*fill="white"/);
  assert.equal(spec.objects.find(obj=>obj.id==='f').breaks[0],1);
});
