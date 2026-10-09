import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));

async function makeSpec(owner='RIGHT',left=['1','1'],right=['1','-1']){
  const request={family:'piecewise-affine',sourceDomain:{kind:'CLOSED_INTERVAL',range:['-4','4']},domain:[-4,4],viewport:[-5,5,-5,5],piecewise:{breakX:'0',owner,left,right}};
  const framed=(await pythonWorker({action:'frame_graph',graphPlan:request})).result;
  const graphPlan=framed.graphPlan;
  const graph=(await pythonWorker({action:'graph',graphPlan})).result;
  const observation=(await pythonWorker({graphPlan,svg:graph.svg,transform:graph.transform},{script:observer})).result;
  return {graphPlan,graph,observation,spec:specFor({capability:'piecewise-affine-spike-v1',graphPlan,caption:'구간별 일차함수의 그래프'},graph,'piecewise-affine-fixture')};
}

test('piecewise affine overview is a distinct experimental route and fingerprint',()=>{
  assert.equal(CAPABILITIES['piecewise-affine-spike-v1'].status,'EXPERIMENTAL');
  assert.ok(CAPABILITIES['piecewise-affine-spike-v1'].requiredAudits.includes('PIECEWISE_BRANCH_OWNERSHIP'));
  const fingerprint=scopeFingerprint(root,'piecewise-affine-spike-v1');
  for(const capability of ['polynomial-spike-v1','rational-spike-v1','sqrt-affine-spike-v1','absolute-value-spike-v1'])assert.notEqual(fingerprint,scopeFingerprint(root,capability));
});

test('jump specimen keeps exact closed interval, two branch domains and owner marker states',async()=>{
  const {graphPlan,observation,spec}=await makeSpec();
  assert.equal(observation.status,'PASS',JSON.stringify(observation.errors));
  assert.deepEqual(graphPlan.domain,[-4,4]);
  const branches=spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH');
  assert.equal(branches.length,2);
  assert.deepEqual(branches.map(branch=>[branch.branch,branch.domain]),[['LEFT',[-4,0]],['RIGHT',[0,4]]]);
  assert.equal(spec.displayFacts.piecewiseFeatures.breakpoint.owner,'RIGHT');
  assert.equal(spec.displayFacts.piecewiseFeatures.markers.find(marker=>marker.id==='breakpoint-limit-open').state,'OPEN');
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  const circles=prepared.prepared.primitives.filter(primitive=>primitive.role.startsWith('piecewise-'));
  assert.equal(circles.length,4);
  assert.deepEqual(circles.map(({role,state,owner,fill})=>({role,state,owner,fill})),[
    {role:'piecewise-source-endpoint',state:'CLOSED',owner:'LEFT',fill:'#111'},
    {role:'piecewise-source-endpoint',state:'CLOSED',owner:'RIGHT',fill:'#111'},
    {role:'piecewise-breakpoint',state:'CLOSED',owner:'RIGHT',fill:'#111'},
    {role:'piecewise-breakpoint',state:'OPEN',owner:'LEFT',fill:'#fff'},
  ]);
});

test('continuous join emits only one closed breakpoint marker',async()=>{
  const {graphPlan,observation,spec}=await makeSpec('LEFT',['-1','0'],['1','0']);
  assert.equal(observation.status,'PASS',JSON.stringify(observation.errors));
  assert.equal(graphPlan.piecewiseFeatures.breakpoint.continuity,'CONTINUOUS');
  assert.equal(graphPlan.piecewiseFeatures.markers.filter(marker=>marker.kind==='BREAKPOINT').length,1);
  assert.equal(spec.displayFacts.piecewiseFeatures.markers.find(marker=>marker.kind==='BREAKPOINT').state,'CLOSED');
});
