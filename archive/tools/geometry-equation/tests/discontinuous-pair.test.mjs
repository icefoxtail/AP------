import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {expandDiscontinuousPair} from '../production/discontinuous-pair-v1.mjs';
import {compositePanels} from '../production/composite-candidate-svg-v1.mjs';

const plan=()=>({capability:'piecewise-discontinuous-spike-v1',caption:'c',graphPlan:{family:'piecewise-discontinuous',layout:'STACKED',
  pieces:[{coefficients:['0','1'],domain:[-2,0]},{coefficients:['1'],domain:[0,2],start:'OPEN'}],
  referenceCurves:[{id:'g',pieces:[{coefficients:['2','-1'],domain:[-2,1],end:'OPEN'},{coefficients:['0'],domain:[1,2]}]}],
  limitArrows:[{curve:'f',at:'0',side:'RIGHT',toY:'1'},{curve:'g',at:'1',side:'LEFT',toY:'1'},{at:'0',side:'LEFT',toY:'0'}],
  requiredPoints:[],axisTickValues:{x:[],y:[]}}});
const code=(fn)=>{try{fn();}catch(error){return error.message;}return null;};

test('a pair becomes a two-panel composite with one x window and arrows routed by function',()=>{
  const out=expandDiscontinuousPair(plan());
  assert.equal(out.capability,'composite-panels-v1');assert.equal(out.caption,'c');
  assert.deepEqual(out.panels.map(panel=>panel.caption.math),['y=f(x)','y=g(x)']);
  assert.deepEqual(out.panels.map(panel=>panel.plan.graphPlan.xWindow),[[-2,2],[-2,2]]);
  assert.deepEqual(out.panels[0].plan.graphPlan.limitArrows,[{at:'0',side:'RIGHT',toY:'1'},{at:'0',side:'LEFT',toY:'0'}]);
  assert.deepEqual(out.panels[1].plan.graphPlan.limitArrows,[{at:'1',side:'LEFT',toY:'1'}]);
  for(const panel of out.panels){assert.equal(panel.plan.graphPlan.referenceCurves,undefined);assert.equal(panel.plan.graphPlan.layout,undefined);}
  assert.equal(compositePanels(out).length,2);
});
test('explicit xWindow wins; a missing or unsupported layout and bad curves are refused',()=>{
  const p=plan();p.graphPlan.xWindow=[-3,3];assert.deepEqual(expandDiscontinuousPair(p).panels[1].plan.graphPlan.xWindow,[-3,3]);
  const odd=plan();odd.graphPlan.layout='SIDE';assert.match(code(()=>expandDiscontinuousPair(odd)),/PIECEWISE_DISCONTINUOUS_PAIR_LAYOUT_UNSUPPORTED:SIDE/);
  const none=plan();delete none.graphPlan.layout;assert.match(code(()=>expandDiscontinuousPair(none)),/PAIR_LAYOUT_REQUIRED/);
  const same=plan();same.graphPlan.referenceCurves[0].id='f';assert.match(code(()=>expandDiscontinuousPair(same)),/PAIR_CURVES_INVALID/);
  const two=plan();two.graphPlan.referenceCurves.push({id:'h',pieces:[]});assert.match(code(()=>expandDiscontinuousPair(two)),/PAIR_CURVES_INVALID/);
  const arrow=plan();arrow.graphPlan.limitArrows[0].curve='h';assert.match(code(()=>expandDiscontinuousPair(arrow)),/PAIR_ARROW_CURVE_UNKNOWN/);
  const field=plan();field.graphPlan.formula='x';assert.match(code(()=>expandDiscontinuousPair(field)),/PAIR_FIELD_UNKNOWN:formula/);
});
test('the golden pair plan (item31g7) expands to eight pieces per function with a shared window',()=>{
  const golden=JSON.parse(fs.readFileSync(new URL('../ops/golden/item31g7/plan.json',import.meta.url),'utf8'));
  const out=expandDiscontinuousPair(golden);
  assert.deepEqual(out.panels.map(panel=>panel.plan.graphPlan.pieces.length),[8,8]);
  assert.deepEqual(out.panels.map(panel=>panel.plan.graphPlan.limitArrows.length),[1,2]);
  assert.equal(out.panels[0].plan.graphPlan.xWindow[0],-2);
});

test('SHARED keeps one plan with the second curve as sharedCurve and demands a distinct line style',()=>{
  const p=plan();p.graphPlan.layout='SHARED';
  assert.equal(code(()=>expandDiscontinuousPair(p)),'PAIR_SHARED_CURVES_INDISTINCT');
  p.graphPlan.referenceCurves[0].style='DASHED';
  const out=expandDiscontinuousPair(p);
  assert.equal(out.capability,'piecewise-discontinuous-spike-v1');assert.equal(out.graphPlan.sharedCurve.id,'g');assert.equal(out.graphPlan.sharedCurve.style,'DASHED');
  assert.deepEqual(out.graphPlan.limitArrows,[{at:'0',side:'RIGHT',toY:'1'},{at:'0',side:'LEFT',toY:'0'}]);
  assert.deepEqual(out.graphPlan.sharedCurve.limitArrows,[{at:'1',side:'LEFT',toY:'1'}]);
  assert.equal(out.graphPlan.referenceCurves,undefined);assert.equal(out.graphPlan.layout,undefined);
});
