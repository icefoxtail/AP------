// E31 (7): a composite stack may hold straight-line graph panels (piecewise-polynomial-spike-v1: one linear piece, overlays) beside the quadratic ones. No Chrome: the stack
// validation is the unit boundary; the composed figure of two such panels was checked by a real render (25 왕의중 1학기 기말 중2 q23: y=-8 and y=-8x, the first quadrant tinted).
import test from 'node:test';import assert from 'node:assert/strict';
import {compositePanels} from '../production/composite-candidate-svg-v1.mjs';

const linePanel=(coefficients,caption)=>({caption:{text:caption},plan:{capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients}],sourceDomain:{kind:'ALL_REALS'},
  domain:[-6,6],viewport:[-6,6,-10,4],axisTickValues:{x:[],y:[]},overlays:{quadrants:[{id:'q1',quadrant:1,label:'제1사분면',fill:'LIGHT'}]}}}});
const quadraticPanel=caption=>({caption:{text:caption},plan:{capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['0','0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-3,3],viewport:[-3,3,-1,9]}}});
const refusal=plan=>{try{compositePanels(plan);}catch(error){return error.detail?.reason??String(error.message);}return null;};

test('two straight-line panels are a valid stack and each gets its own plot height limit',()=>{
  const checked=compositePanels({capability:'composite-panels-v1',panels:[linePanel(['-8'],'a=-1일 때'),linePanel(['0','-8'],'a=7일 때')]});
  assert.equal(checked.length,2);
  assert.ok(checked.every(item=>item.plan.capability==='piecewise-polynomial-spike-v1'&&Number.isFinite(item.plan.graphPlan.plotHeightLimit)));
  assert.equal(checked[0].plan.graphPlan.compositeHeader,undefined);
});

test('a line panel and a quadratic panel may share a stack',()=>{
  assert.equal(compositePanels({capability:'composite-panels-v1',panels:[quadraticPanel('이차'),linePanel(['1','2'],'일차')]}).length,2);
});

test('three panels still need quadratic panels (the shared formula header is a quadratic grammar)',()=>{
  assert.equal(refusal({capability:'composite-panels-v1',panels:[linePanel(['1'],'가'),linePanel(['2'],'나'),linePanel(['3'],'다')]}),'PANEL_NOT_THREE_PANEL_COMPATIBLE_0');
});

test('another capability is still not a graph panel',()=>{
  const other=linePanel(['1'],'가');other.plan.capability='sqrt-affine-spike-v1';
  assert.equal(refusal({capability:'composite-panels-v1',panels:[other,linePanel(['2'],'나')]}),'PANEL_PLAN_0');
});
