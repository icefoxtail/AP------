import test from 'node:test';
import assert from 'node:assert/strict';
import {specFor} from '../production/phase2.mjs';

test('Phase 2 final graph spec samples every frozen cubic/quartic feature and ignores tail metadata rows',()=>{
  const plan={capability:'polynomial-spike-v1',caption:'3차 함수 오버뷰',graphPlan:{
    family:'polynomial',coefficients:['0','-3','0','1'],domain:[-2,2],viewport:[-2,2,-5,5],axisTickValues:{x:['-2','-1','1','2'],y:['-2','2']},
    requiredPoints:[{id:'source-point',x:1,y:-2}],
    overviewFeatures:[
      {id:'feature-1',kind:'POLYNOMIAL_FEATURE',x:-1,y:2,roles:['STATIONARY_EXTREMUM'],multiplicity:{root:null,derivative:1,secondDerivative:null}},
      {id:'feature-2',kind:'POLYNOMIAL_FEATURE',x:0,y:0,roles:['ROOT','INFLECTION'],multiplicity:{root:1,derivative:null,secondDerivative:1}},
      {id:'tail-left',kind:'TAIL_DIRECTION',side:'LEFT',endpointX:-2,direction:'DOWN',slopeDirection:'UP'},
      {id:'tail-right',kind:'TAIL_DIRECTION',side:'RIGHT',endpointX:2,direction:'UP',slopeDirection:'UP'}
    ]
  }};
  const spec=specFor(plan,{},'phase4-cubic-fixture');
  assert.deepEqual(spec.objects[0].criticalX,[1,-1,0]);
  assert.equal(spec.objects[0].domain,plan.graphPlan.domain);
  assert.equal(spec.viewport.width,610);assert.equal(spec.viewport.height,420);
  assert.deepEqual(spec.displayFacts.axisTickValues,plan.graphPlan.axisTickValues);
  assert.match(spec.objects[1].text,/x\^3/);
});

test('quadratic equation header preserves the full plot height and source vertex instead of consuming plot width',()=>{
  const plan={capability:'polynomial-spike-v1',caption:'이차함수',graphPlan:{
    family:'polynomial',coefficients:['-1','0','3'],domain:[-2,2],viewport:[-2,2,-1,5],overviewFeatures:[],requiredPoints:[{id:'vertex',x:0,y:-1}]
  }};
  const spec=specFor(plan,{},'quadratic-medium-profile');
  assert.equal(spec.viewport.width,512);
  assert.equal(spec.viewport.height,400);
  assert.equal(spec.viewport.height-spec.viewport.topInset,320);
  assert.equal(spec.viewport.panel,0);
  assert.deepEqual(spec.displayFacts.equationLabelCenters.formula,[256,72]);
  assert.deepEqual(spec.objects.find(object=>object.id==='required-point-1'),{id:'required-point-1',kind:'POINT',at:[0,-1]});
  const coordinate=spec.objects.find(object=>object.id==='required-point-1-coordinates');
  assert.equal(coordinate.kind,'COORDINATE_LABEL');
  assert.equal(coordinate.target,'required-point-1');
  assert.deepEqual(coordinate.exact,['0','-1']);
  const reframed=specFor({...plan,graphPlan:{...plan.graphPlan,overviewCanvasHeight:600}}, {},'quadratic-tall-overview');
  assert.equal(reframed.viewport.height,600);
  assert.equal(reframed.viewport.topInset,80);
  assert.equal(reframed.viewport.height-reframed.viewport.topInset,520);
});

test('the q13 -6 tick callout stays bound to its exact owner/value and bounded full-size offset',()=>{
 const plan={capability:'polynomial-spike-v1',caption:'꼭짓점이 (-3, -5)인 포물선',graphPlan:{
  family:'polynomial',coefficients:['-1/2','3','1/2'],domain:[-9,3],viewport:[-10,4,-7,15],overviewFeatures:[],
  requiredPoints:[{id:'V',x:-3,y:-5}],overviewCanvasHeight:600,
  tickLabelCallouts:[{axis:'x',value:'-6',offsetUser:[28,-22]}]
 }};
 const spec=specFor(plan,{},'q13-owner-callout');
 assert.deepEqual(spec.displayFacts.tickLabelCallouts,[{axis:'x',value:'-6',offsetUser:[28,-22]}]);
 assert.throws(()=>specFor({...plan,graphPlan:{...plan.graphPlan,tickLabelCallouts:[{axis:'y',value:'-6',offsetUser:[28,-22]}]}},{},'invalid-q13-callout'),/TICK_LABEL_CALLOUT_Q13_BINDING_INVALID/);
 assert.throws(()=>specFor({...plan,graphPlan:{...plan.graphPlan,tickLabelCallouts:[{axis:'x',value:'-6',offsetUser:[40,-22]}]}},{},'invalid-q13-offset'),/TICK_LABEL_CALLOUT_Q13_BINDING_INVALID/);
});
