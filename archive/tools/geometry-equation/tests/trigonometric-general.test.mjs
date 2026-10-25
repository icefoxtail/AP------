import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';

const OBSERVER=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));

const plainPlan=(overrides={})=>({family:'trigonometric',function:'SIN',coefficients:['24/5','5'],ratePi:'1/6',phasePi:'0',
  sourceDomain:{kind:'INTERVAL',range:['0','12'],states:['CLOSED','CLOSED']},domain:[0,12],viewport:[0,12,0,10],
  referenceLines:[{id:'k',y:'37/5',intersectionCount:2}],axisTickValues:{x:['2','4','6','8','10'],y:[]},keyPoints:true,...overrides});

async function frame(graphPlan){return pythonWorker({action:'frame_graph',graphPlan});}
async function observe(graphPlan){
  const fitted=await frame(graphPlan);assert.equal(fitted.status,'OK',JSON.stringify(fitted.result));
  const model=await pythonWorker({action:'graph',graphPlan:fitted.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const audit=await pythonWorker({graphPlan:fitted.result.graphPlan,svg:model.result.svg,transform:model.result.transform},{script:OBSERVER});
  assert.equal(audit.status,'OK',JSON.stringify(audit.result));
  return {fitted:fitted.result.graphPlan,model:model.result,audit:audit.result};
}

test('a pi rate on a plain month interval frames exact period, crossings and key points and the observer passes',async()=>{
  const {fitted,audit}=await observe(plainPlan());
  assert.equal(fitted.overviewPolicy,'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2');
  const features=fitted.trigIntervalFeatures;
  assert.equal(features.period,'12');assert.equal(features.axisUnit,'ONE');
  assert.deepEqual(features.lines[0].intersections.map(point=>Math.round(point.x)),[1,5]);
  assert.deepEqual(features.keyPoints.map(row=>[row.x,row.kind]),[['3','MAXIMUM'],['6','MIDLINE_CROSSING'],['9','MINIMUM']]);
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('a tangent over several branches draws a dashed pole at every asymptote',async()=>{
  const {fitted,model,audit}=await observe(plainPlan({function:'TAN',coefficients:['2','1'],ratePi:'1/4',sourceDomain:{kind:'INTERVAL',range:['0','7'],states:['OPEN','OPEN']},domain:[0,7],viewport:[0,7,-8,10],referenceLines:[],keyPoints:false,axisTickValues:{x:['1','3','5'],y:[]}}));
  assert.deepEqual(fitted.trigIntervalFeatures.poles.map(row=>row.x),['2','6']);
  for(const pole of fitted.trigIntervalFeatures.poles)assert.ok(model.svg.includes(`id="trig-${pole.id}"`),pole.id);
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('a pi rate keeps the single-period form exact',async()=>{
  const {fitted,audit}=await observe({family:'trigonometric',function:'SIN',coefficients:['1','0'],ratePi:'1/6',phasePi:'0',sourceDomain:{kind:'ALL_REALS'},domain:[-6,6],viewport:[-7,7,-4,4],axisTickValues:{x:[],y:[]}});
  assert.equal(fitted.overviewPolicy,'TRIGONOMETRIC_PERIODIC_OVERVIEW_v2');
  assert.equal(fitted.trigFeatures.period,'12');
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('pi-unit ticks are framed as exact multiples of pi',async()=>{
  const fitted=await frame({family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-2','2'],states:['OPEN','OPEN']},domain:[-6,6],viewport:[-7,7,-2,2],axisTickValues:{x:['-1/2','1/2'],y:[]},axisTickPi:true});
  assert.equal(fitted.status,'OK',JSON.stringify(fitted.result));
  assert.equal(fitted.result.graphPlan.overviewPolicy,'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2');
  const {audit}=await observe({family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-2','2'],states:['OPEN','OPEN']},domain:[-6,6],viewport:[-7,7,-2,2],axisTickValues:{x:['-1/2','1/2'],y:[]},axisTickPi:true});
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('the old one-period and INTERVAL_PI plans keep their v1 policy',async()=>{
  const one=await frame({family:'trigonometric',function:'COS',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'ALL_REALS'},domain:[-4,4],viewport:[-5,5,-5,5],axisTickValues:{x:[],y:[]}});
  assert.equal(one.result.graphPlan.overviewPolicy,'TRIGONOMETRIC_PERIODIC_OVERVIEW_v1');
  const many=await frame({family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','6'],states:['OPEN','OPEN']},domain:[0,19],viewport:[-1,20,-2,2],referenceLines:[{id:'k',y:'1/2',intersectionCount:6}],axisTickValues:{x:[],y:[]}});
  assert.equal(many.result.graphPlan.overviewPolicy,'TRIGONOMETRIC_INTERVAL_OVERVIEW_v1');
});

test('bad grammar and unsupported units are refused with codes',async()=>{
  const refused=async graphPlan=>{const result=await frame(graphPlan);assert.notEqual(result.status,'OK');return JSON.stringify(result.result);};
  const noRate=plainPlan({coefficients:['1','1','0']});delete noRate.ratePi;
  assert.match(await refused(noRate),/TRIG_INTERVAL_REQUIRES_RATE_PI/);
  assert.match(await refused({family:'trigonometric',function:'SIN',coefficients:['1','0'],ratePi:'1/2',phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-2','2'],states:['OPEN','OPEN']},domain:[-6,6],viewport:[-7,7,-2,2],axisTickValues:{x:[],y:[]}}),/TRIG_RATE_PI_REQUIRES_PLAIN_INTERVAL/);
  const rationalPhase=plainPlan({phase:'1/3'});delete rationalPhase.phasePi;
  assert.match(await refused(rationalPhase),/TRIG_KEY_POINTS_REQUIRE_RATIONAL_PHASE/);
  assert.match(await refused(plainPlan({referenceLines:[{id:'k',y:'1/2',intersectionCount:9}]})),/TRIG_LINE_INTERSECTION_COUNT_MISMATCH:k:engine finds 2 intersection/);
  assert.match(await refused(plainPlan({function:'TAN',coefficients:['1','0'],ratePi:'1/2',sourceDomain:{kind:'INTERVAL',range:['0','1'],states:['OPEN','OPEN']},referenceLines:[],keyPoints:false})),/TRIG_TAN_POLE_AT_INTERVAL_END/);
  assert.match(await refused(plainPlan({ratePi:'1/2',sourceDomain:{kind:'INTERVAL',range:['0','50'],states:['CLOSED','CLOSED']},domain:[0,50],referenceLines:[],keyPoints:false})),/TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED/);
});

test('the observer rejects a tampered curve, key point or pole',async()=>{
  const {fitted,model}=await observe(plainPlan());
  const auditOf=async svg=>{const result=await pythonWorker({graphPlan:fitted,svg,transform:model.transform},{script:OBSERVER});return result.result;};
  assert.equal((await auditOf(model.svg.replace('id="trig-key-3"','id="trig-key-x"'))).status,'FAIL');
  assert.equal((await auditOf(model.svg.replace(/(-?\d+\.\d+),/,'999,') )).status,'FAIL');
  const tan=await observe(plainPlan({function:'TAN',coefficients:['2','1'],ratePi:'1/4',sourceDomain:{kind:'INTERVAL',range:['0','7'],states:['OPEN','OPEN']},domain:[0,7],viewport:[0,7,-8,10],referenceLines:[],keyPoints:false,axisTickValues:{x:['1','3','5'],y:[]}}));
  const tampered=tan.model.svg.replace(/(id="trig-pole-1"[^>]*x1=")(-?[\d.]+)/,'$1999');
  const result=await pythonWorker({graphPlan:tan.fitted,svg:tampered,transform:tan.model.transform},{script:OBSERVER});
  assert.equal(result.result.status,'FAIL',JSON.stringify(result.result.errors));
});
