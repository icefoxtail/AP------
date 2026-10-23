import test from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {compositePanels,compositeHeaderLabels,compositeSharedRowCount,compositeStackSize} from '../production/composite-candidate-svg-v1.mjs';

const line={id:'L',slope:'3',intercept:'-13/4',through:['T'],tangentAt:'T'};
const panel=(math,coefficients,points,exact,lines=[line])=>({caption:{math,text:'일 때'},plan:{capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients,domain:[-4,4],viewport:[-4,4,-6,6],sourceDomain:{kind:'ALL_REALS'},requiredPoints:points,exactCoordinates:exact,axisTickValues:{x:[],y:[]},lines}}});
const three=()=>({capability:'composite-panels-v1',panels:[
  panel('a=-1',['-3','2','1'],[{id:'V',x:-1,y:-4},{id:'T',x:.5,y:-1.75}],{T:['1/2','-7/4']}),
  panel('a=0',['-1','0','1'],[{id:'V',x:0,y:-1},{id:'T',x:1.5,y:1.25}],{T:['3/2','5/4']}),
  panel('a=1',['3','-2','1'],[{id:'V',x:1,y:2},{id:'T',x:2.5,y:4.25}],{T:['5/2','17/4']})]});
const framed=async checked=>{const models=[],plans=[];for(const item of checked){const f=await pythonWorker({action:'frame_graph',graphPlan:item.plan.graphPlan});const plan={...item.plan,caption:'c',graphPlan:f.result.graphPlan};plans.push({...item,plan});models.push((await pythonWorker({action:'graph',graphPlan:plan.graphPlan})).result);}return {plans,models};};

test('three panels move each formula to its caption row and write an identical line once above the stack',async()=>{
  const checked=compositePanels(three());
  assert.deepEqual(checked.map(item=>item.plan.graphPlan.compositeHeader),Array(3).fill({formula:'CAPTION',sharedLines:['L']}));
  assert.equal(compositeSharedRowCount(checked),1);
  const {plans,models}=await framed(checked);
  const specs=plans.map((item,i)=>specFor(item.plan,models[i],'asset'));
  for(const spec of specs){
    assert.deepEqual([spec.viewport.height,spec.viewport.topInset],[284,0]);// plot 220 + 64 margins
    assert.deepEqual(spec.objects.filter(object=>object.kind==='EQUATION_LABEL').map(object=>object.id),[]);
    assert.ok(spec.objects.some(object=>object.id==='line-L'&&object.kind==='LINE'));
  }
  const header=await compositeHeaderLabels(plans,models,'asset');
  assert.deepEqual(header.formulas.map(label=>label.text),['y=(x+1)^(2)−4','y=x^(2)−1','y=(x−1)^(2)+2']);
  assert.deepEqual(header.shared.map(label=>label.tex),['y=3x-{\\displaystyle\\frac{13}{4}}']);
  assert.ok(compositeStackSize(specs.map(spec=>spec.viewport),1).height*0.5823<=640);
});

test('a line that differs between panels stays in each panel band; two panels keep their own formula header',async()=>{
  const plan=three();plan.panels[2].plan.graphPlan.lines=[{id:'L',slope:'3',intercept:'-1',through:[]}];
  assert.deepEqual(compositePanels(plan).map(item=>item.plan.graphPlan.compositeHeader.sharedLines),[[],[],[]]);
  const two={capability:'composite-panels-v1',panels:three().panels.slice(0,2)};
  assert.deepEqual(compositePanels(two).map(item=>item.plan.graphPlan.compositeHeader),[undefined,undefined]);
  two.panels[0].plan.graphPlan.compositeHeader={formula:'CAPTION',sharedLines:[]};
  assert.throws(()=>compositePanels(two),error=>error.detail?.reason==='PANEL_COMPOSITE_HEADER_0');
  const cubic=three();cubic.panels[1].plan.graphPlan.coefficients=['0','0','0','1'];
  assert.throws(()=>compositePanels(cubic),error=>error.detail?.reason==='PANEL_NOT_THREE_PANEL_COMPATIBLE_1');
  const checked=compositePanels(plan),{plans,models}=await framed(checked);
  assert.deepEqual(specFor(plans[2].plan,models[2],'asset').objects.filter(object=>object.kind==='EQUATION_LABEL').map(object=>object.id),['line-L-equation']);
  assert.throws(()=>specFor({...plans[0].plan,graphPlan:{...plans[0].plan.graphPlan,compositeHeader:{formula:'CAPTION',sharedLines:['M']}}},models[0],'asset'),/COMPOSITE_HEADER_INVALID/);
});
