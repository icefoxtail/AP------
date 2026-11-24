// graphPlan.axisTickLabels: ticks of an axis named by a letter (a, b, c, alpha, beta) instead of their numbers, and graphPlan.axisTitles for the axis names (t, x(t)).
// One common layer (phase2.addAxisTickLabels -> engine tick layer -> verify-rendered-layout -> graph_observer.axis_tick_labels_audit): no family name decides anything.
// Chrome is used for the end-to-end renders (21_순천여고 수II q10 position graph on piecewise-polynomial; a cubic and a multi-curve line carry the same field): run with --test-concurrency=1.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {renderPlan} from '../production/render-plan.mjs';
import {hintFor} from '../ops/tools/hints.mjs';

const item={sourcePath:'archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js',ordinal:10,dir:'tick'};
// The example plan of AUTHOR_GUIDE (3-14): the position graph x(t)=t^2-5t+4 on [0,11/2], times a, b, c on the t axis.
export const POSITION_PLAN={capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients:['4','-5','1']}],breakpoints:[],
  sourceDomain:{kind:'INTERVAL',range:['0','11/2'],states:['CLOSED','CLOSED']},requiredPoints:[{id:'V',x:'5/2',y:'-9/4',marker:'NONE'}],
  axisTickValues:{x:[],y:[]},axisTickLabels:{x:{'1':'a','4':'b','11/2':'c'}},axisTitles:{x:'t',y:'x(t)'},
  overlays:{points:[{id:'O',x:'0',y:'0'},{id:'Pc',curveX:'11/2',unnamed:true},{id:'C',axis:'x',value:'11/2',unnamed:true}],segments:[{id:'sC',from:'C',to:'Pc',dashed:true}]}},
  pointNames:{O:'O'},caption:'수직선 위를 움직이는 점 P의 시각 t에서의 위치 x(t)의 그래프이다. t축 위에 시각 a, b, c가 표시되어 있다.',
  accessibilityDescription:'가로축 t와 세로축 x(t)가 있다. 아래로 볼록한 곡선이 t가 0일 때 양수에서 시작해 t축과 두 번 만나고 시각 c에서 끝난다. t축 위에는 작은 값부터 a, b, c가 차례로 표시되어 있고 c에서 곡선의 끝점까지 점선이 있다.',
  newVisualInformation:['t축 위의 시각 a, b, c와 곡선이 t축과 만나는 위치']};
const CUBIC_PLAN={capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['0','-3','0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-3,3],viewport:[-3,3,-4,4],requiredPoints:[],
  axisTickValues:{x:['-1','1','2'],y:['2']},axisTickLabels:{x:{'-1':'α','2':'β'}},axisTitles:{x:'t',y:'v(t)'}},caption:'삼차함수의 그래프'};
const MULTI_PLAN={capability:'multi-curve-figure-v1',graphPlan:{family:'multi-curve',viewport:[-1,6,-2,6],axisTickValues:{x:[],y:[]},axisTickLabels:{x:{'2':'a','5':'b'},y:{'3':'k'}},
  axisTitles:{x:'t',y:'S(t)'},curves:[{id:'c1',kind:'LINE',coefficients:['1','1'],domain:['0','5'],color:'BLUE'}]},caption:'직선의 그래프'};

const prepared=async(plan,mutate=graphPlan=>graphPlan)=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const graphPlan=mutate(framed.result.graphPlan);
  const model=await pythonWorker({action:'graph',graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {graphPlan,model:model.result,spec:specFor({...plan,graphPlan},model.result,'axis-tick-labels-test')};
};

test('the field reaches the spec on three families and the semantic engine accepts it',async()=>{
  for(const plan of [POSITION_PLAN,CUBIC_PLAN,MULTI_PLAN]){
    const {spec,graphPlan}=await prepared(plan);
    assert.deepEqual(spec.displayFacts.axisTickLabels,plan.graphPlan.axisTickLabels,plan.capability);
    assert.deepEqual(graphPlan.axisTickLabels,plan.graphPlan.axisTickLabels,plan.capability);
    if(plan===MULTI_PLAN)continue;   // a multi-curve spec is prepared with its curve branch tags by the composer (the end-to-end render below covers it)
    const response=await pythonWorker({action:'prepare',spec});assert.equal(response.status,'OK',plan.capability+' '+JSON.stringify(response.result));
  }
});

test('a plan without the field has no axisTickLabels in its spec',async()=>{
  const {axisTickLabels,...without}=POSITION_PLAN.graphPlan;
  const {spec}=await prepared({...POSITION_PLAN,graphPlan:without});
  assert.equal(spec.displayFacts.axisTickLabels,undefined);
});

test('bad inputs are refused with their own codes, and each code has a hint',async()=>{
  const refuse=async labels=>{try{await prepared(POSITION_PLAN,graphPlan=>({...graphPlan,axisTickLabels:labels}));}catch(error){return error.message;}return null;};
  assert.equal(await refuse({z:{'1':'a'}}),'AXIS_TICK_LABELS_INVALID');
  assert.equal(await refuse({}),'AXIS_TICK_LABELS_INVALID');
  assert.equal(await refuse({x:{}}),'AXIS_TICK_LABELS_INVALID:x');
  assert.equal(await refuse({x:{'1':'ab'}}),'AXIS_TICK_LABEL_SYMBOL_INVALID:x:1');
  assert.equal(await refuse({x:{'1':'1'}}),'AXIS_TICK_LABEL_SYMBOL_INVALID:x:1');
  assert.equal(await refuse({x:{'0':'a'}}),'AXIS_TICK_LABEL_VALUE_INVALID:x:0');
  assert.equal(await refuse({x:{'one':'a'}}),'AXIS_TICK_LABEL_VALUE_INVALID:x:one');
  assert.equal(await refuse({x:{'1':'a','1.0':'b'}}),'AXIS_TICK_LABEL_VALUE_DUPLICATE:x:1.0');
  assert.equal(await refuse({x:{'1':'a','4':'a'}}),'AXIS_TICK_LABEL_SYMBOL_DUPLICATE:x:a');
  assert.equal(await refuse({x:{'1':'a','4':'b'}}),null);
  for(const code of ['AXIS_TICK_LABELS_INVALID','AXIS_TICK_LABEL_VALUE_INVALID:x:0','AXIS_TICK_LABEL_SYMBOL_INVALID:x:1','AXIS_TICK_LABEL_TICK_MISSING:x:a','AXIS_TICK_LABELS_AXIS_HIDDEN:y']){
    assert.ok(hintFor(code).length>=1,code);assert.match(hintFor(code).join('\n'),/axisTickLabels/,code);
  }
});

const render=async(plan,name)=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),`tick-${name}-`));
  const result=await renderPlan({item,plan,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,800));
  return fs.readFileSync(path.join(out,'tick-solution.svg'),'utf8');
};
const symbolsIn=svg=>[...svg.matchAll(/<g id="(tick-[^"]+-label)"[^>]*data-tick-symbol="([^"]+)"/g)].map(match=>match[2]);
const tickLabelIds=svg=>[...svg.matchAll(/<g id="(tick-[^"]+-label)"[^>]*data-label-kind="TICK_LABEL"|<g id="(tick-[^"]+-label)"[^>]*>/g)].map(match=>match[1]??match[2]);

test('the position graph renders with the letters a, b, c on the t axis and the names t and x(t)',{timeout:600000},async()=>{
  const svg=await render(POSITION_PLAN,'position');
  assert.deepEqual(symbolsIn(svg).sort(),['a','b','c']);
  assert.equal(tickLabelIds(svg).length,3,'only the three named ticks are labelled (axisTickValues is empty)');
  for(const symbol of 'abc')assert.ok(new RegExp(`data-tick-symbol="${symbol}"[^>]*data-tick-display-value="${symbol}"|data-tick-display-value="${symbol}"[^>]*data-tick-symbol="${symbol}"`).test(svg),symbol);
  assert.match(svg,/<g id="axis-x"[^>]*data-tex="t"/);assert.match(svg,/<g id="axis-y"[^>]*data-tex="x\(t\)"/);
});

test('another family carries the same field: a cubic keeps its numeric ticks and shows alpha and beta where it names two',{timeout:600000},async()=>{
  const svg=await render(CUBIC_PLAN,'cubic');
  assert.deepEqual(symbolsIn(svg).sort(),['α','β']);
  // the numeric ticks that were not renamed stay numeric; the renamed values are not also drawn as numbers
  assert.equal(tickLabelIds(svg).length,4);
});

test('a multi-curve figure names ticks on both axes',{timeout:600000},async()=>{
  const svg=await render(MULTI_PLAN,'multi');
  assert.deepEqual(symbolsIn(svg).sort(),['a','b','k']);
});
