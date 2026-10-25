import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const CAPABILITY='piecewise-discontinuous-spike-v1';
// y=(x+1)^2-2 on [-3,1) with its in-piece vertex V(-1,-2), then y=x on [1,3] (filled at x=1): a jump at x=1.
const PLAN={family:'piecewise-discontinuous',pieces:[{coefficients:['-1','2','1'],domain:['-3','1'],end:'OPEN'},{coefficients:['0','1'],domain:['1','3'],start:'CLOSED'}],
  referenceLines:[{id:'k',y:'-1',intersectionX:['-2','0']}],requiredPoints:[{id:'V',x:-1,y:-2}],axisTickValues:{x:[],y:[]}};
// A staircase on [0,3]: the engine expands the step block into half-open constant pieces.
const STEP={family:'piecewise-discontinuous',step:{values:['1','2','1'],xFrom:0,xTo:3},requiredPoints:[],axisTickValues:{x:[],y:[]}};

async function framed(graphPlan){
  const frame=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(frame.status,'OK',JSON.stringify(frame.result));
  const plan={capability:CAPABILITY,caption:'불연속 조각함수',graphPlan:frame.result.graphPlan};
  const model=await pythonWorker({action:'graph',graphPlan:plan.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {plan,model:model.result};
}

test('piecewise discontinuous is a distinct experimental capability with its own fingerprint',()=>{
  assert.equal(CAPABILITIES[CAPABILITY].status,'EXPERIMENTAL');
  for(const audit of ['PIECEWISE_DISCONTINUOUS_ENDPOINT_STATES','PIECEWISE_DISCONTINUOUS_JUMPS','PIECEWISE_DISCONTINUOUS_LINE_INTERSECTIONS'])assert.ok(CAPABILITIES[CAPABILITY].requiredAudits.includes(audit),audit);
  const fingerprint=scopeFingerprint(root,CAPABILITY);
  for(const capability of ['piecewise-polynomial-spike-v1','piecewise-affine-spike-v1','polynomial-spike-v1'])assert.notEqual(fingerprint,scopeFingerprint(root,capability));
});

test('the author contract carries the discontinuity rules as literal fragments',()=>{
  const source=fs.readFileSync(new URL('../production/phase2.mjs',import.meta.url),'utf8');
  const fragments=[...source.matchAll(/extendedContract\+='([^']*)';/g)].map(match=>match[1]).join('');
  for(const text of ['piecewise-discontinuous-spike-v1','family:"piecewise-discontinuous"','jumpValues','PIECEWISE_DISCONTINUITY_UNDECLARED','PIECEWISE_DOMAIN_OVERLAP','PIECEWISE_ENDPOINT_STATE_INVALID','PIECEWISE_TOO_MANY_PIECES','STEP_INTERVAL_INVALID','PIECEWISE_REFERENCE_LINE_CONTAINS_A_PIECE','PIECEWISE_INTERSECTION_MISMATCH','PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS'])assert.ok(fragments.includes(text),text);
  assert.ok(source.includes("'piecewise-discontinuous-spike-v1'"));
});

test('spec: one FUNCTION_GRAPH per piece, endpoint states as display facts and the line equation',async()=>{
  const {plan,model}=await framed(PLAN);
  const spec=specFor(plan,model,'piecewise-discontinuous-fixture');
  const pieces=spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH');
  assert.deepEqual(pieces.map(piece=>piece.branch),['PIECE_1','PIECE_2']);
  assert.deepEqual(pieces.map(piece=>piece.expression),['x^2+2*x-1','x']);
  assert.deepEqual(pieces.map(piece=>piece.domain),[[-3,1],[1,3]]);
  assert.equal(spec.objects.some(object=>object.id==='formula'),false);
  assert.deepEqual(spec.objects.find(object=>object.id==='line-k').coefficients,[0,-1,-1]);
  assert.equal(spec.objects.find(object=>object.id==='line-k-equation').text,'y=-1');
  const markers=spec.displayFacts.discontinuousEndpointFeatures.markers;
  assert.deepEqual(markers.map(marker=>[marker.x,marker.y,marker.state]),[['-3','2','CLOSED'],['1','1','CLOSED'],['1','2','OPEN'],['3','3','CLOSED']]);
  assert.deepEqual(spec.objects.filter(object=>object.id.startsWith('intersection-k-')).map(object=>object.id),['intersection-k-1','intersection-k-2']);
  assert.ok(spec.objects.find(object=>object.id==='required-point-1'));
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  assert.deepEqual(prepared.prepared.primitives.filter(primitive=>primitive.role==='discontinuous-endpoint').map(primitive=>[primitive.id,primitive.fill,primitive.state]),[['discontinuous-endpoint-1','#111','CLOSED'],['discontinuous-endpoint-2','#111','CLOSED'],['discontinuous-endpoint-3','#fff','OPEN'],['discontinuous-endpoint-4','#111','CLOSED']]);
  assert.equal(prepared.prepared.primitives.some(primitive=>primitive.role==='interval-endpoint'),false);
});

test('spec: a step block expands to half-open constant pieces',async()=>{
  const {plan,model}=await framed(STEP);
  const spec=specFor(plan,model,'piecewise-discontinuous-step');
  assert.deepEqual(spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH').map(object=>[object.expression,object.domain]),[['1',[0,1]],['2',[1,2]],['1',[2,3]]]);
  assert.deepEqual(spec.displayFacts.discontinuousEndpointFeatures.markers.map(marker=>marker.state),['CLOSED','OPEN','CLOSED','CLOSED','OPEN','CLOSED']);
});
