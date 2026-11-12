// Answer-hiding curve names (production/hidden-curve-label.mjs): label {hidden:true,reason:"ANSWER",name} draws a neutral name instead of the formula.
// The publication gate is not relaxed: a figure whose every text is hidden still fails PUBLICATION_TEXT_NOT_READY.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {expandHiddenCurveLabels} from '../production/hidden-curve-label.mjs';
import {renderPlan} from '../production/render-plan.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const GOLDEN='item154hiddencurvelabelq10';
const manifest=JSON.parse(fs.readFileSync(path.join(here,'..','ops','golden.manifest.json'),'utf8'));
const entry=manifest.items.find(i=>i.dir===GOLDEN);
const plan=()=>JSON.parse(fs.readFileSync(path.join(here,'..','ops','golden',GOLDEN,'plan.json'),'utf8'));
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'hidden-label-'));
const hide=(name,id='c')=>({id,kind:'LINE',coefficients:['0','1'],domain:['-1','1'],label:{hidden:true,reason:'ANSWER',name}});
const graph=curves=>({capability:'multi-curve-figure-v1',graphPlan:{family:'multi-curve',curves,axisTickValues:{x:[],y:[]}},caption:'c'});
const codeOf=curves=>{try{expandHiddenCurveLabels(graph(curves));}catch(error){return error.message;}return null;};

test('a plan without an object label is returned as the very same object',()=>{
  const plain=graph([{id:'a',kind:'LINE',coefficients:['0','1'],domain:['-1','1'],label:'y=x'},{id:'b',kind:'LINE',coefficients:['1','1'],domain:['-1','1'],hideLabel:true}]);
  const out=expandHiddenCurveLabels(plain);
  assert.equal(out.plan,plain);assert.deepEqual(out.notes,[]);
  assert.equal(expandHiddenCurveLabels({capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial'}}).notes.length,0);
});

test('the object label becomes the string label, the reason is recorded, other fields stay',()=>{
  const out=expandHiddenCurveLabels(graph([hide('f','a'),hide('g','b'),{id:'c',kind:'LINE',coefficients:['2','1'],domain:['-1','1'],label:'y=x+2'}]));
  assert.deepEqual(out.plan.graphPlan.curves.map(c=>c.label),['f','g','y=x+2']);
  assert.deepEqual(out.notes,[{curve:'a',reason:'ANSWER',name:'f'},{curve:'b',reason:'ANSWER',name:'g'}]);
  assert.deepEqual(out.plan.graphPlan.curves[0].coefficients,['0','1']);
});

test('composite panels are expanded per panel',()=>{
  const inner=graph([hide('f','a'),hide('g','b')]);
  const out=expandHiddenCurveLabels({capability:'composite-panels-v1',panels:[{caption:{text:'p'},plan:inner},{caption:{text:'q'},plan:graph([hide('h','a'),hide('k','b')])}]});
  assert.deepEqual(out.notes.map(n=>[n.panel,n.curve,n.name]),[[0,'a','f'],[0,'b','g'],[1,'a','h'],[1,'b','k']]);
  assert.equal(out.plan.panels[0].plan.graphPlan.curves[0].label,'f');
});

test('every breach has its own code and nothing is silently accepted',()=>{
  const line=extra=>({id:'z',kind:'LINE',coefficients:['0','0'],domain:['-1','1'],...extra});
  assert.equal(codeOf([hide('f','a'),{...hide('g','b'),label:{hidden:true,reason:'ANSWER'}}]),'HIDDEN_CURVE_LABEL_INVALID:b');
  assert.equal(codeOf([hide('f','a'),{...hide('g','b'),label:{hidden:true,reason:'LOOKS_BAD',name:'g'}}]),'HIDDEN_CURVE_LABEL_INVALID:b');
  assert.equal(codeOf([hide('f','a'),{...hide('g','b'),label:{hidden:false,reason:'ANSWER',name:'g'}}]),'HIDDEN_CURVE_LABEL_INVALID:b');
  for(const bad of ['y=7','y','x(x)','ab','f_1','1','','y(x)'])assert.equal(codeOf([hide('f','a'),hide(bad,'b')]),'HIDDEN_CURVE_LABEL_NAME_INVALID:b',bad);
  for(const good of ['f','g(x)','f1','L'])assert.equal(codeOf([hide('h','a'),hide(good,'b')]),null,good);
  assert.equal(codeOf([hide('f','a'),{...hide('g','b'),hideLabel:true}]),'HIDDEN_CURVE_LABEL_CONFLICT:b');
  assert.equal(codeOf([hide('f','a'),hide('f','b')]),'HIDDEN_CURVE_NAME_DUPLICATE:f');
  assert.equal(codeOf([hide('f','a'),line({})]),'CURVE_NOT_IDENTIFIABLE:z');
  assert.equal(codeOf([hide('f','a'),line({hideLabel:true})]),'CURVE_NOT_IDENTIFIABLE:z');
  assert.equal(codeOf([hide('f','a'),line({label:'y=0'})]),null);
});

test('golden item154: renders, records the hidden formulas, same SVG as hand-written neutral names',async()=>{
  const out=tmp();
  const r=await renderPlan({item:{sourcePath:entry.sourcePath,ordinal:entry.ordinal,dir:'figure'},plan:plan(),outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  assert.deepEqual(r.hiddenFormulaLabels.map(n=>[n.curve,n.reason,n.name]),[['l1','ANSWER','f'],['l2','ANSWER','g'],['l3','ANSWER','h']]);
  const svg=fs.readFileSync(path.join(out,'figure-solution.svg'),'utf8');
  assert.match(svg,/role="img"/);
  // The same figure written by hand with string labels is the identical SVG: the option only names the intent, it adds no drawing path.
  const hand=plan();for(const [i,n] of ['f','g','h'].entries())hand.graphPlan.curves[i].label=n;
  const out2=tmp();
  const r2=await renderPlan({item:{sourcePath:entry.sourcePath,ordinal:entry.ordinal,dir:'figure'},plan:hand,outDir:out2});
  assert.equal(r2.status,'ARCHIVE_BOUND');assert.equal(r2.hiddenFormulaLabels,undefined);
  assert.equal(fs.readFileSync(path.join(out2,'figure-solution.svg'),'utf8'),svg);
});

test('the publication gate is not relaxed: every text hidden and nothing named still fails',async()=>{
  const bare=plan();
  for(const c of bare.graphPlan.curves){delete c.label;c.hideLabel=true;}
  bare.graphPlan.overlays.points[0].unnamed=true;
  const r=await renderPlan({item:{sourcePath:entry.sourcePath,ordinal:entry.ordinal,dir:'figure'},plan:bare,outDir:tmp()});
  assert.equal(r.status,'FAILED');
  assert.match(String(r.detailFull),/PUBLICATION_TEXT_NOT_READY/);
});

test('a hidden-label graph with an unnamed curve is rejected before any render',async()=>{
  const bad=plan();delete bad.graphPlan.curves[2].label;bad.graphPlan.curves[2].hideLabel=true;
  const r=await renderPlan({item:{sourcePath:entry.sourcePath,ordinal:entry.ordinal,dir:'figure'},plan:bad,outDir:tmp()});
  assert.equal(r.status,'FAILED');assert.equal(r.code,'CURVE_NOT_IDENTIFIABLE');assert.equal(r.stage,'read-plan');
});
