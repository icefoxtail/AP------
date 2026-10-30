// E30 item 6: graphPlan.axisScale (each axis at the author's scale) and graphPlan.overlays.names (a Korean name beside a segment, a line or the
// curve). No Chrome: framing, the model, the final spec objects and the semantic engine are the unit boundary; the typeset figure and the observer
// on it are covered by tests/test_axis_scale_names.py (a real composed figure as fixture).
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const plan={capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',
  pieces:[{coefficients:['0']},{coefficients:['-2/3','1/15']},{coefficients:['2']}],breakpoints:[{x:'10',y:'0'},{x:'40',y:'2'}],
  sourceDomain:{kind:'INTERVAL',range:['0','70'],states:['CLOSED','CLOSED']},requiredPoints:[{id:'A',x:10,y:0},{id:'B',x:40,y:2}],
  axisTickValues:{x:['20','60'],y:['2']},axisTitles:{x:'x(분)',y:'y(km)'},axisScale:{x:1,y:12},
  overlays:{points:[{id:'O',x:'0',y:'0'},{id:'Z',x:'70',y:'7/3',unnamed:true}],segments:[{id:'sT',from:'O',to:'Z'}],
    names:[{id:'nR',text:'토끼',curveX:'50',labelDirection:'N'},{id:'nT',text:'거북이',segment:'sT',labelDirection:'SE'}]}},
  caption:'토끼와 거북이의 그래프가 두 점에서 만난다.',pointNames:{O:'O'}};

const prepared=async(graphPlan=plan.graphPlan)=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {framed:framed.result.graphPlan,model:model.result,spec:specFor({...plan,graphPlan:framed.result.graphPlan},model.result,'axis-scale-names-test')};
};

test('axisScale frames the figure at the author\'s proportion and the model draws it',async()=>{
  const {framed,model}=await prepared();
  assert.equal(framed.axisRatio,12);assert.equal(framed.plotCanvas.width,448);assert.deepEqual(framed.axisScale,{x:1,y:12});
  assert.ok(Math.abs(model.transform.sy/model.transform.sx-12)<1e-9,JSON.stringify(model.transform));
});

test('the spec carries the one scale on its viewport and the semantic engine accepts it',async()=>{
  const {spec}=await prepared();
  assert.notEqual(spec.viewport.equalUnits,true);
  const response=await pythonWorker({action:'prepare',spec});assert.equal(response.status,'OK',JSON.stringify(response.result));
});

test('names reach the spec as plain text labels beside their own element',async()=>{
  const {spec,framed}=await prepared();
  const curve=spec.objects.find(object=>object.id==='overlay-name-nR'),segment=spec.objects.find(object=>object.id==='overlay-name-nT');
  assert.deepEqual([curve.kind,curve.labelKind,curve.text,curve.freeLabel,curve.allowSuppress],['EQUATION_LABEL','TEXT','토끼',true,false]);
  assert.deepEqual(curve.at,[50,2]);assert.equal(curve.directions[0],'N');assert.equal(curve.target,undefined);
  assert.deepEqual([segment.kind,segment.labelKind,segment.text,segment.target,segment.lineOwned],['EQUATION_LABEL','TEXT','거북이','overlay-segment-sT',true]);
  assert.equal(segment.directions[0],'SE');assert.equal(segment.alternateAt.length,2);
  assert.equal(framed.overlaysFeatures.names.length,2);
});

test('a plan without names has no name objects and no names row',async()=>{
  const {overlays,...rest}=plan.graphPlan,withoutNames={...rest,overlays:{points:overlays.points,segments:overlays.segments}};
  const {spec,framed}=await prepared(withoutNames);
  assert.ok(!spec.objects.some(object=>object.id.startsWith('overlay-name-')));assert.equal(framed.overlaysFeatures.names,undefined);
});

test('bad inputs are refused with their own codes',async()=>{
  const refuse=async graphPlan=>{const framed=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(framed.status,'ERROR');return framed.result.code;};
  assert.equal(await refuse({...plan.graphPlan,axisScale:{x:1,y:0}}),'INVALID_AXIS_SCALE');
  assert.equal(await refuse({...plan.graphPlan,axisScale:{x:1,y:100}}),'AXIS_SCALE_RATIO_OUT_OF_RANGE');
  assert.equal(await refuse({...plan.graphPlan,axisSqueeze:true}),'AXIS_SCALE_WITH_SQUEEZE');
  assert.equal(await refuse({family:'polynomial',coefficients:['0','0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-3,3],viewport:[-3,3,-1,9],axisScale:{x:1,y:2}}),'AXIS_SCALE_UNSUPPORTED_FAMILY');
  const withNames=names=>({...plan.graphPlan,overlays:{...plan.graphPlan.overlays,names}});
  assert.equal(await refuse(withNames([{id:'n',text:'토끼$',curveX:'50'}])),'OVERLAY_NAME_TEXT_INVALID:n');
  assert.equal(await refuse(withNames([{id:'n',text:'토끼',segment:'zz'}])),'OVERLAY_NAME_TARGET_UNKNOWN:n');
  assert.equal(await refuse(withNames([{id:'n',text:'토끼',curveX:'50',segment:'sT'}])),'OVERLAY_NAME_INVALID:n');
});
