// Integer / fraction / radical bases for the exponential and logarithmic families, and the two-curve inverse-pair figure.
// Chrome is used by the end-to-end renders: run with --test-concurrency=1.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {renderPlan} from '../production/render-plan.mjs';

const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const item={sourcePath:'archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js',ordinal:7,dir:'log-exp-bases'};
const exponential=(graphPlan,capability='exponential-affine-spike-v1')=>({capability,graphPlan,caption:'지수·로그 밑 실험'});
const logarithmic=(graphPlan)=>({capability:'logarithmic-affine-spike-v1',graphPlan,caption:'지수·로그 밑 실험'});
const pair=()=>({capability:'exp-log-pair-spike-v1',graphPlan:{family:'exp-log-pair',curves:[
  {id:'f',family:'logarithmic-affine',base:'3',coefficients:['2','1','0','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'}},
  {id:'g',family:'exponential-affine',base:'sqrt(3)',coefficients:['1','1','0'],sourceDomain:{kind:'ALL_REALS'}}],identityLine:true},caption:'역함수 두 곡선'});
const baseExp={family:'exponential-affine',base:'2',shiftX:'1',coefficients:['1','1','3'],sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],viewport:[-3,3,-2,12],axisTickValues:{x:[],y:[]}};
const baseLog={family:'logarithmic-affine',base:'3',coefficients:['2','1','0','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},domain:[.1,4],viewport:[-1,5,-5,5],axisTickValues:{x:[],y:[]}};

async function framed(plan){
  const f=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});
  assert.equal(f.status,'OK',JSON.stringify(f.result));
  const material={...plan,graphPlan:f.result.graphPlan};
  const m=await pythonWorker({action:'graph',graphPlan:material.graphPlan});
  assert.equal(m.status,'OK',JSON.stringify(m.result));
  const o=await pythonWorker({graphPlan:material.graphPlan,svg:m.result.svg,transform:m.result.transform},{script:observer});
  return {plan:material,model:m.result,observation:o.result};
}

async function frameError(graphPlan){
  const f=await pythonWorker({action:'frame_graph',graphPlan});
  assert.notEqual(f.status,'OK',JSON.stringify(f.result));
  return f.result.code;
}

test('exponential bases (integer, fraction, radical) and shift are recomputed exactly',async()=>{
  for(const [graphPlan,reference,monotonicity] of [
    [baseExp,{x:'1',y:'4'},'INCREASING'],
    [{...baseExp,base:'1/2'},{x:'1',y:'4'},'DECREASING'],
    [{...baseExp,base:'sqrt(3)'},{x:'1',y:'4'},'INCREASING']]){
    const {plan,observation}=await framed(exponential(graphPlan));
    assert.equal(observation.status,'PASS',JSON.stringify(observation.errors));
    assert.deepEqual(plan.graphPlan.exponentialFeatures.referencePoint,reference);
    assert.equal(plan.graphPlan.exponentialFeatures.monotonicity,monotonicity);
    assert.equal(plan.graphPlan.exponentialFeatures.horizontalAsymptote.y,'3');
  }
  const spec=specFor(exponential(baseExp).capability?{capability:'exponential-affine-spike-v1',graphPlan:(await framed(exponential(baseExp))).plan.graphPlan,caption:'x'}:null,null,'base');
  assert.ok(spec.objects.find(object=>object.id==='formula').text.includes('2^(x-1)+3'),JSON.stringify(spec.objects));
});

test('logarithm bases keep the exact open boundary and reference point',async()=>{
  for(const [base,monotonicity] of [['3','INCREASING'],['1/2','DECREASING'],['sqrt(2)','INCREASING']]){
    const {plan,observation}=await framed(logarithmic({...baseLog,base}));
    assert.equal(observation.status,'PASS',JSON.stringify(observation.errors));
    assert.equal(plan.graphPlan.logarithmicFeatures.naturalDomainBoundaryX,'0');
    assert.deepEqual(plan.graphPlan.logarithmicFeatures.referencePoint,{x:'1',y:'0',argument:'1'});
    assert.equal(plan.graphPlan.logarithmicFeatures.monotonicity,monotonicity);
  }
  const {plan}=await framed(logarithmic(baseLog));
  const spec=specFor({capability:'logarithmic-affine-spike-v1',graphPlan:plan.graphPlan,caption:'x'},null,'base');
  assert.ok(spec.objects.find(object=>object.id==='formula').text.includes('logb(3,x)'),JSON.stringify(spec.objects));
});

test('unsupported bases are refused with explicit codes',async()=>{
  for(const [base,code] of [['a','EXPONENTIAL_BASE_GRAMMAR_REQUIRED'],['1','EXPONENTIAL_BASE_OUT_OF_RANGE'],['0','EXPONENTIAL_BASE_OUT_OF_RANGE'],['sqrt(4)','EXPONENTIAL_BASE_RADICAL_NOT_SQUARE_FREE'],['sqrt(2+sqrt(3))','EXPONENTIAL_BASE_GRAMMAR_REQUIRED'],['2.5','EXPONENTIAL_BASE_GRAMMAR_REQUIRED']])
    assert.equal(await frameError({...baseExp,base}),code,base);
  assert.equal(await frameError({...baseLog,base:'log2'}),'LOGARITHMIC_BASE_GRAMMAR_REQUIRED');
});

test('two-curve inverse pair is drawn with its dashed identity line',async()=>{
  const {plan,model,observation}=await framed(pair());
  assert.equal(observation.status,'PASS',JSON.stringify(observation.errors));
  assert.equal(plan.graphPlan.expLogPairFeatures.curves.length,2);
  assert.ok(model.svg.includes('id="identity-line"'));
  assert.ok(model.svg.includes('data-branch="REF_f"'));
  assert.ok(model.svg.includes('data-branch="REF_g"'));
  assert.ok(model.svg.includes('id="asymptote-g"'));
  assert.ok(model.svg.includes('id="boundary-f"'));
});

test('observer rejects tampered pair curve, identity line, asymptote, marker and features',async()=>{
  const {plan,model}=await framed(pair());
  const mutate=(needle,change)=>model.svg.replace(needle,change);
  const curve=model.svg.match(/<polyline id="curve-g-0"[^>]*points="([^"]+)"/)[1].split(' ')[1];
  const curveChanged=model.svg.replace(curve,curve.replace(',',',').replace(/(-?\d+(?:\.\d+)?)$/,number=>(Number(number)+2).toString()));
  let o=await pythonWorker({graphPlan:plan.graphPlan,svg:curveChanged,transform:model.transform},{script:observer});
  assert.ok(o.result.errors.some(code=>code.startsWith('EXP_LOG_PAIR_WRONG_CURVE')),JSON.stringify(o.result.errors));
  o=await pythonWorker({graphPlan:plan.graphPlan,svg:mutate('id="identity-line"','id="identity-line" data-tamper="1"').replace(/id="identity-line"([^>]*)y1="([^"]+)"/, (all,rest,y1)=>`id="identity-line"${rest}y1="${Number(y1)+6}"`),transform:model.transform},{script:observer});
  assert.ok(o.result.errors.includes('EXP_LOG_PAIR_IDENTITY_LINE_POSITION_MISMATCH'),JSON.stringify(o.result.errors));
  const tampered=JSON.parse(JSON.stringify(plan.graphPlan));tampered.expLogPairFeatures.curves[0].monotonicity='DECREASING';
  o=await pythonWorker({graphPlan:tampered,svg:model.svg,transform:model.transform},{script:observer});
  assert.ok(o.result.errors.includes('EXP_LOG_PAIR_FEATURE_INVENTORY_MISMATCH:f'),JSON.stringify(o.result.errors));
});

test('base exponential and pair reach ARCHIVE_BOUND through renderPlan',{timeout:600000},async()=>{
  for(const [name,plan] of [['base-exp',exponential(baseExp)],['pair',pair()]]){
    const out=fs.mkdtempSync(path.join(os.tmpdir(),`log-exp-bases-${name}-`));
    const r=await renderPlan({item:{...item,dir:name},plan:plan,outDir:out});
    assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r).slice(0,900));
    assert.ok(fs.existsSync(path.join(out,`${name}-solution.svg`)));
  }
});
