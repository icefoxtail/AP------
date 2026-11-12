import test from 'node:test';
import assert from 'node:assert/strict';
import {specFor} from '../production/phase2.mjs';

const cubicOverview={
  family:'polynomial',coefficients:['0','-18','-3/2','1'],sourceDomain:{kind:'ALL_REALS'},
  overviewPolicy:'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1',domain:[-5,6],viewport:[-5,6,-80,80],
  requiredPoints:[{id:'M',x:-2,y:22},{id:'N',x:3,y:-40.5}],
  exactCoordinates:{N:['3','-81/2']},axisTickValues:{x:['-2','3'],y:[]},
};

function spec(graphPlan=cubicOverview,options={}){
  return specFor({capability:'polynomial-spike-v1',caption:'삼차함수의 극대와 극소',graphPlan,...options},{},'coordinate-band-fixture');
}

test('cubic and quartic overviews hide only the selected coordinate label',()=>{
  const quartic={
    ...cubicOverview,coefficients:['4','0','-4','0','1'],
    requiredPoints:[{id:'M',x:0,y:4},{id:'N',x:Math.sqrt(2),y:0}],
    exactCoordinates:{N:['sqrt(2)','0']},
  };
  for(const graphPlan of [cubicOverview,quartic]){
    const baseline=spec(graphPlan,{coordinateLeader:['N']});
    const hidden=spec({...graphPlan,coordinateBand:{hide:['M']}},{coordinateLeader:['N']});
    const dot=hidden.objects.find(object=>object.id==='required-point-1');
    const expected=baseline.objects.filter(object=>object.id!=='required-point-1-coordinates').map(object=>object.id===dot.id?{...object,name:null}:object);
    assert.ok(baseline.objects.some(object=>object.id==='required-point-1-coordinates'));
    assert.deepEqual(hidden.objects,expected);
    assert.deepEqual(hidden.displayFacts,baseline.displayFacts);

    const named=spec({...graphPlan,coordinateBand:{hide:['M']}},{pointNames:{M:'P'}});
    assert.equal(named.objects.find(object=>object.id===dot.id).name,'P');
    assert.ok(!named.objects.some(object=>object.id==='required-point-1-coordinates'));
  }
});

test('coordinateBand refuses malformed, unknown, and contradictory inputs',()=>{
  for(const value of [null,{},[],{hide:[]},{hide:['M','M']},{hide:['M'],extra:true}]){
    assert.throws(()=>spec({...cubicOverview,coordinateBand:value}),{message:'COORDINATE_BAND_INVALID'});
  }
  const withHidden={...cubicOverview,coordinateBand:{hide:['M']}};
  assert.throws(()=>spec({...withHidden,requiredPoints:cubicOverview.requiredPoints.slice(1)}),{message:'COORDINATE_BAND_HIDE_UNKNOWN:M'});
  assert.throws(()=>spec({...withHidden,coordinateBand:{hide:['N0']}}),{message:'COORDINATE_BAND_HIDE_UNKNOWN:N0'});
  for(const options of [{coordinatePlacement:'PANEL'},{coordinatePanel:['M']},{coordinateLeader:['M']},{labelDirections:{M:'N'}},{pointNames:{M:'(-2,k)'}}]){
    assert.throws(()=>spec(withHidden,options),{message:'COORDINATE_BAND_INVALID'});
  }
  assert.throws(()=>spec({...withHidden,coefficients:['0','0','1'],overviewPolicy:'QUADRATIC_EQUAL_UNIT_OVERVIEW_v1'}),{message:'COORDINATE_BAND_INVALID'});
});
