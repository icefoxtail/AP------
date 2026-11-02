import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

// G18a-2: the drawing spec of a multi-curve figure with LINE / RATIONAL / SQRT curves, their looks, asymptote marks, start dots and an inverse pair.
// Python framing and the model figure only (no Chrome): the spec the engine draws is checked here, the figure itself by tests/test_graph_g18a_multi.py.
const {pythonWorker}=await import('../production/worker.mjs');
const {specFor}=await import('../production/phase2.mjs');

const PLAN={
  capability:'multi-curve-figure-v1',
  graphPlan:{family:'multi-curve',viewport:[-4,5,-3,4],axisTickValues:{x:[],y:[]},curves:[
    {id:'f',kind:'RATIONAL',numerator:['3','2'],denominator:['-5','4'],domain:['-4','5'],color:'BLUE',weight:'BOLD',label:'y=f(x)'},
    {id:'g',inverseOf:'f',color:'WARM',style:'DASHED',hideLabels:['asymptotes']},
    {id:'s',kind:'SQRT',radicand:['1','1'],amplitude:'2',offset:'-1',domain:['-1','3'],hideLabels:['start']}]},
  caption:'c'
};
const specOf=async plan=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const built=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(built.status,'OK',JSON.stringify(built.result));
  return specFor({...plan,graphPlan:framed.result.graphPlan},built.result,'g18a-multi');
};

test('guide and contract name the G18a kinds and codes',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const text of ['inverseOf','MULTI_CURVE_WINDOW_REQUIRED','MULTI_CURVE_INVERSE_UNSUPPORTED','hideLabels','"RATIONAL"'])assert.ok(guide.includes(text),text);
});

test('spec: every side of a rational and every curve carries its tag and look; the pole splits the rational',async()=>{
  const spec=await specOf(PLAN);const graphs=spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH');
  assert.deepEqual(graphs.map(object=>object.branch),['CURVE_f_L','CURVE_f_R','CURVE_g_L','CURVE_g_R','CURVE_s']);
  const left=graphs[0];assert.equal(left.expression,'(2*x+3)/(4*x-5)');assert.deepEqual(left.domain,[-4,1.25]);
  assert.equal(left.color,'BLUE');assert.equal(left.curveWeight,'BOLD');assert.equal(left.curveStyle,undefined);
  assert.equal(graphs[2].color,'WARM');assert.equal(graphs[2].curveStyle,'DASHED');assert.equal(graphs[2].curveWeight,undefined);
  assert.equal(graphs[4].expression,'(-1)+(2)*sqrt(x+1)');
});

test('spec: asymptote marks, labels and the start dot follow hideLabels',async()=>{
  const spec=await specOf(PLAN);const ids=spec.objects.map(object=>object.id);
  assert.deepEqual(spec.displayFacts.multiCurveMarks.map(mark=>[mark.curve,mark.axis,mark.value]),[['f','vertical',1.25],['f','horizontal',0.5],['g','vertical',0.5],['g','horizontal',1.25]]);
  // f shows its asymptote values, g hides them; f has the given name label, g and s write their own formula
  assert.ok(ids.includes('curve-f-asymptote-x')&&ids.includes('curve-f-asymptote-y'));
  assert.ok(!ids.includes('curve-g-asymptote-x')&&!ids.includes('curve-g-asymptote-y'));
  assert.equal(spec.objects.find(object=>object.id==='curve-f-equation').text,'y=f(x)');
  assert.match(spec.objects.find(object=>object.id==='curve-s-equation').text,/^y=2\*sqrt\(x\+1\)-1$/);
  // the start dot stays, its coordinates are hidden
  assert.ok(ids.includes('curve-s-start'));assert.ok(!ids.includes('curve-s-start-coordinates'));
});

test('a plan without the new keys keeps the old objects and no marks',async()=>{
  const spec=await specOf({capability:'multi-curve-figure-v1',caption:'c',graphPlan:{family:'multi-curve',axisTickValues:{x:['-1','1'],y:['-1','1']},curves:[
    {id:'a',kind:'Y_OF_X',coefficients:['2','0','-1'],domain:['-1','1']},{id:'b',kind:'Y_OF_X',coefficients:['-2','0','1'],domain:['-1','1']}]}});
  assert.equal(spec.displayFacts.multiCurveMarks,undefined);
  assert.deepEqual(spec.objects.map(object=>Object.keys(object).filter(key=>['color','curveStyle','curveWeight'].includes(key)).length),[0,0]);
});
