import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));

async function framed(graphPlan){
  const f=await pythonWorker({action:'frame_graph',graphPlan});
  assert.equal(f.status,'OK');
  return f.result.graphPlan;
}
async function modelled(plan){
  const m=await pythonWorker({action:'graph',graphPlan:plan});
  assert.equal(m.status,'OK');
  return m.result;
}
async function observed(plan,svg,transform){
  const r=await pythonWorker({graphPlan:plan,svg,transform},{script:observerScript,timeoutMs:60000});
  assert.equal(r.status,'OK');
  return r.result;
}

test('general sqrt left branch keeps the starting point and the one-sided domain',async()=>{
  const plan=await framed({family:'sqrt-affine',radicand:['4','-2'],sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[-2,2],viewport:[-3,3,-1,6]});
  assert.equal(plan.overviewPolicy,'SQRT_AFFINE_GENERAL_OVERVIEW_v1');
  assert.deepEqual(plan.sqrtFeatures.endpoint,{x:'2',y:'0'});
  assert.equal(plan.sqrtFeatures.branchDirection,'LEFT');
  assert.equal(plan.sqrtFeatures.tailDirection,'UP');
  const model=await modelled(plan);
  const audit=await observed(plan,model.svg,model.transform);
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  const spec=specFor({capability:'sqrt-affine-spike-v1',graphPlan:plan,caption:'왼쪽으로 열리는 무리함수'},model,'g4-left');
  assert.equal(spec.objects.find(object=>object.id==='formula').text,'y=sqrt(-2*x+4)');
  assert.equal(spec.axes.x,true);
  assert.equal(spec.displayFacts.sqrtFeatures.branchDirection,'LEFT');
  assert.equal(spec.displayFacts.sqrtFeaturePolicy.sourceDomainMode,'NATURAL_SQRT_AFFINE');
});

test('reflected shifted general sqrt writes domain/range labels and exact key-point coordinates',async()=>{
  const plan=await framed({family:'sqrt-affine',radicand:['-4','2'],amplitude:'1',sign:-1,offset:'3',sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[2,10],viewport:[0,12,0,5],requiredPoints:[{id:'P',x:4,y:1}],exactCoordinates:{P:['4','1']},domainRangeLabels:true});
  assert.deepEqual(plan.sqrtFeatures.endpoint,{x:'2',y:'3'});
  assert.equal(plan.sqrtFeatures.rangeDirection,'BELOW');
  const model=await modelled(plan);
  const audit=await observed(plan,model.svg,model.transform);
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  const spec=specFor({capability:'sqrt-affine-spike-v1',graphPlan:plan,caption:'무리함수와 정의역·치역'},model,'g4-reflected');
  assert.equal(spec.objects.find(object=>object.id==='formula').text,'y=-sqrt(2*x-4)+3');
  const domain=spec.objects.find(object=>object.id==='sqrt-domain-label');
  const range=spec.objects.find(object=>object.id==='sqrt-range-label');
  assert.ok(domain&&domain.math);
  assert.match(domain.text,/2\\le x/);
  assert.match(range.text,/y\\le 3/);
  const marker=spec.objects.find(object=>object.id==='required-point-1');
  const coordinate=spec.objects.find(object=>object.id==='required-point-1-coordinates');
  assert.deepEqual(marker.at,[4,1]);
  assert.deepEqual(coordinate.exact,['4','1']);
});

test('general sqrt closed interval shows both endpoints and stacked-fraction endpoint values',async()=>{
  const plan=await framed({family:'sqrt-affine',radicand:['-1','1'],amplitude:'2',offset:'3',sourceDomain:{kind:'CLOSED_INTERVAL',range:['1','5']},domain:[1,5],viewport:[0,6,2,8],requiredPoints:[{id:'A',x:5,y:7}]});
  const model=await modelled(plan);
  const audit=await observed(plan,model.svg,model.transform);
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  assert.equal(audit.overview.observedEndpointMarkers,2);
  const spec=specFor({capability:'sqrt-affine-spike-v1',graphPlan:plan,caption:'닫힌 구간의 무리함수'},model,'g4-interval');
  assert.equal(spec.objects.filter(object=>object.kind==='GRAPH_ANNOTATION').some(object=>object.id==='sqrt-source-end-label'),true);
});

test('general sqrt observer fails closed on a moved endpoint marker',async()=>{
  const plan=await framed({family:'sqrt-affine',radicand:['-4','2'],amplitude:'1',sign:-1,offset:'3',sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[2,10],viewport:[0,12,0,5]});
  const model=await modelled(plan);
  const tampered=model.svg.replace(/(data-role="domain-endpoint"[^>]*cx=")([^"]+)"/,(_,head,value)=>head+(Number(value)+20)+'"');
  const audit=await observed(plan,tampered,model.transform);
  assert.equal(audit.status,'FAIL');
  assert.ok(audit.errors.includes('SQRT_ENDPOINT_MARKER_POSITION_MISMATCH'));
});

test('exactCoordinates that do not match the numeric key point are refused',async()=>{
  const plan=await framed({family:'sqrt-affine',radicand:['-4','2'],amplitude:'1',sign:-1,offset:'3',sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[2,10],viewport:[0,12,0,5],requiredPoints:[{id:'P',x:4,y:1}],exactCoordinates:{P:['9','1']}});
  const model=await modelled(plan);
  assert.throws(()=>specFor({capability:'sqrt-affine-spike-v1',graphPlan:plan,caption:'무리함수'},model,'g4-bad-exact'),/EXACT_COORDINATES_MISMATCH/);
});
