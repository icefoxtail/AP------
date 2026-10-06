import test from 'node:test';
import assert from 'node:assert/strict';
import {specFor} from '../production/phase2.mjs';

test('Phase 2 final graph spec samples every frozen cubic/quartic feature and ignores tail metadata rows',()=>{
  const plan={capability:'polynomial-spike-v1',caption:'3차 함수 오버뷰',graphPlan:{
    family:'polynomial',coefficients:['0','-3','0','1'],domain:[-2,2],viewport:[-2,2,-5,5],
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
  assert.equal(spec.viewport.width,384);assert.equal(spec.viewport.height,320);
  assert.match(spec.objects[1].text,/x\^3/);
});
