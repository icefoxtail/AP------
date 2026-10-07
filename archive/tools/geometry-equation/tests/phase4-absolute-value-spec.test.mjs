import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));

async function prepareAbs({coefficients=['-2','2','1','1'],sourceDomain={kind:'ALL_REALS'},domain=[-5,7],viewport=[-6,8,-2,15]}={}){
  const request={family:'absolute-value',coefficients,sourceDomain,domain,viewport,requiredPoints:[]};
  const framed=(await pythonWorker({action:'frame_graph',graphPlan:request})).result;
  assert.equal(framed.policy,'ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1');
  const graphPlan=framed.graphPlan;
  const graphModel=(await pythonWorker({action:'graph',graphPlan})).result;
  const modelAudit=(await pythonWorker({graphPlan,svg:graphModel.svg,transform:graphModel.transform},{script:fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url))})).result;
  return {graphPlan,graphModel,modelAudit};
}

test('absolute-value has a distinct experimental capability and fingerprint',()=>{
  const descriptor=CAPABILITIES['absolute-value-spike-v1'];
  assert.equal(descriptor.status,'EXPERIMENTAL');
  assert.ok(descriptor.requiredAudits.includes('ABSOLUTE_VALUE_CORNER'));
  assert.ok(descriptor.requiredAudits.includes('ABSOLUTE_VALUE_ARMS'));
  const fingerprint=scopeFingerprint(root,'absolute-value-spike-v1');
  for(const capability of ['polynomial-spike-v1','rational-spike-v1','sqrt-affine-spike-v1'])assert.notEqual(fingerprint,scopeFingerprint(root,capability));
});

test('absolute-value spec preserves the exact corner, intercepts, marker, and branch cues',async()=>{
  const {graphPlan,graphModel,modelAudit}=await prepareAbs();
  assert.equal(modelAudit.status,'PASS',JSON.stringify(modelAudit.errors));
  assert.deepEqual(graphPlan.absoluteFeatures.corner,{x:'1',y:'1',state:'CLOSED'});
  const spec=specFor({capability:'absolute-value-spike-v1',graphPlan,caption:'절댓값 함수의 그래프'},graphModel,'absolute-value-phase4-fixture');
  const graph=spec.objects.find(object=>object.id==='f');
  assert.match(graph.expression,/abs\(/);assert.ok(graph.criticalX.includes(1));
  assert.deepEqual(spec.displayFacts.absoluteFeatures,graphPlan.absoluteFeatures);
  assert.equal(spec.objects.find(object=>object.id==='absolute-corner-label').kind,'EQUATION_LABEL');
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  const markers=prepared.prepared.primitives.filter(item=>item.role==='absolute-corner');
  assert.equal(markers.length,1);assert.deepEqual(markers[0].at,[prepared.coordinateModel.originX+Number(graphPlan.absoluteFeatures.corner.x)*prepared.coordinateModel.sx,prepared.coordinateModel.originY-Number(graphPlan.absoluteFeatures.corner.y)*prepared.coordinateModel.sy]);
  const interceptPlan=await prepareAbs({coefficients:['0','1','-1','2'],domain:[-6,6],viewport:[-7,7,-5,5]});
  const inverted=specFor({capability:'absolute-value-spike-v1',graphPlan:interceptPlan.graphPlan,caption:'절댓값 함수의 그래프'},interceptPlan.graphModel,'absolute-value-inverted-fixture');
  assert.deepEqual([...inverted.objects.find(object=>object.id==='f').criticalX].sort((a,b)=>a-b),[-2,0,2]);
});




\n