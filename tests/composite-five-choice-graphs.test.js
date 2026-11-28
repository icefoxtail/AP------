'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const source = pathToFileURL(path.join(__dirname, '..', 'archive', 'tools', 'geometry-equation', 'production', 'composite-candidate-svg-v1.mjs')).href;

const fivePanels = () => [
  ['-2', '4', '-1'], ['6', '4', '1'], ['-6', '-4', '-1'], ['2', '-4', '1'], ['-2', '-4', '-1']
].map((coefficients, index) => ({
  caption: {text: '①②③④⑤'[index]},
  plan: {capability:'polynomial-spike-v1', graphPlan:{family:'polynomial',coefficients,domain:[-5,5],viewport:[-5,5,-8,8],sourceDomain:{kind:'ALL_REALS'},requiredPoints:[],axisTickValues:{x:[],y:[]}}}
}));

test('five quadratic choice panels form a two-column grid without widening ordinary graph stacks', async () => {
  const {compositePanels, compositePanelLayout} = await import(source);
  const plan={capability:'composite-panels-v1',choiceGrid:true,panels:fivePanels(),caption:'포물선 5개 선택지'};
  const checked=compositePanels(plan);
  assert.equal(checked.length,5);
  assert.deepEqual(compositePanelLayout(checked,plan),{kind:'GRID',columns:2,rows:3});
  assert.ok(checked.every(panel=>panel.plan.graphPlan.compositeHeader.formula==='CAPTION'));

  assert.throws(()=>compositePanels({...plan,choiceGrid:false}),/COMPOSITE_PLAN_INVALID/);
  assert.throws(()=>compositePanels({...plan,panels:plan.panels.slice(0,4)}),/COMPOSITE_PLAN_INVALID/);
});
