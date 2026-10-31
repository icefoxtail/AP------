// G5b: coordinateLeader on graph key points and the tick-number leader fallback for every graph family (the spec level; no Chrome).
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const CUBIC={family:'piecewise-polynomial',pieces:[{coefficients:['0','-3','0','1']}],sourceDomain:{kind:'ALL_REALS'},requiredPoints:[{id:'K',x:-1,y:2},{id:'L',x:1,y:-2}],axisTickValues:{x:[2],y:[]},overlays:{lines:[{id:'k',x:'2'}]}};

const prepare=async(graphPlan,extra={})=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const plan={capability:'piecewise-polynomial-spike-v1',caption:'삼차함수',graphPlan:framed.result.graphPlan,...extra};
  return specFor(plan,model.result,'g5b-test');
};

test('a key point listed in coordinateLeader writes its name and coordinates as one leader label; the others stay plain',async()=>{
  const plain=await prepare(CUBIC);
  assert.equal(plain.objects.find(o=>o.id==='required-point-1-coordinates').kind,'COORDINATE_LABEL');
  const spec=await prepare(CUBIC,{coordinateLeader:['K']});
  const label=spec.objects.find(o=>o.id==='required-point-1-coordinates');
  assert.equal(label.kind,'EQUATION_LABEL');assert.equal(label.ringLeader,true);assert.match(label.text,/^K\(/);
  assert.equal(spec.objects.find(o=>o.id==='required-point-1').name,null);
  const other=spec.objects.find(o=>o.id==='required-point-2-coordinates');assert.equal(other.kind,'COORDINATE_LABEL');assert.equal(other.ringLeader,undefined);
});

test('a malformed or conflicting coordinateLeader names its code',async()=>{
  for(const [value,code,extra] of [['K','COORDINATE_LEADER_INVALID',{}],[['Z'],'COORDINATE_LEADER_POINT_INVALID:Z',{}],[['K','K'],'COORDINATE_LEADER_INVALID',{}],[['K'],'COORDINATE_LEADER_PANEL_CONFLICT:K',{coordinatePanel:['K']}]]){
    await assert.rejects(()=>prepare(CUBIC,{coordinateLeader:value,...extra}),error=>String(error.message??error).includes(code),code);
  }
});

test('every graph family opts in to the tick-number leader fallback, so a vertical line through a tick cannot hide its number',async()=>{
  const spec=await prepare(CUBIC);
  assert.equal(spec.displayFacts.tickLabelFallbackCallout,true);
});
