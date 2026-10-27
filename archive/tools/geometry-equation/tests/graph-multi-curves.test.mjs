import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

// This wave worktree is a sparse checkout: archive/tools/past-exam-pipeline is skip-worktree, but phase2.mjs
// imports pipeline-core/v2-audit.mjs -> work-batch.mjs -> past-exam-pipeline/lib/calibration.mjs. Materialize that
// one tracked file from HEAD (exact bytes, not a source edit) so the renderer/spec can load. A full checkout has it.
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../');
const sparseDependencies=[
  'archive/tools/past-exam-pipeline/lib/calibration.mjs',
  'archive/tools/past-exam-pipeline/completion-contract.json',
  'archive/data/master_tables/js_archive_tag_master.json',
  'archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js',
  'archive/assets/images/22_효천고_2학기_기말_고2_수학II/q10.png'
];
for(const relative of sparseDependencies){
  const target=path.join(repo,relative);
  if(fs.existsSync(target))continue;
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,execFileSync('git',['show','HEAD:'+relative],{cwd:repo,maxBuffer:32*1024*1024}));
}

const {pythonWorker}=await import('../production/worker.mjs');
const {specFor}=await import('../production/phase2.mjs');

const CAPABILITY='multi-curve-figure-v1';
// 22 효천고 2학기 기말 고2 수학II q10: the region bounded by y=2-x^2, x=2-y^2, y=x^2-2, x=y^2-2.
// Four distinct nonlinear curves, two of them sideways parabolas, so this is a real 3+ source need.
const FOUR={
  capability:CAPABILITY,
  graphPlan:{
    family:'multi-curve',
    curves:[
      {id:'top',kind:'Y_OF_X',coefficients:['2','0','-1'],domain:['-1','1']},
      {id:'bottom',kind:'Y_OF_X',coefficients:['-2','0','1'],domain:['-1','1']},
      {id:'right',kind:'X_OF_Y',coefficients:['2','0','-1'],domain:['-1','1'],branch:'BOTH'},
      {id:'left',kind:'X_OF_Y',coefficients:['-2','0','1'],domain:['-1','1'],branch:'BOTH'}
    ],
    axisTickValues:{x:[],y:[]}
  },
  caption:'네 포물선으로 둘러싸인 영역'
};
const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
// The source figure also draws the reflection lines y=x and y=-x and labels the original parabola y=2-x^2. Both use the
// existing overlay lines and math EQUATION_LABEL machinery without changing any curve or its domain.
const ANNOTATED=structuredClone(FOUR);
ANNOTATED.graphPlan.curves[0].label='y=2-x^2';
ANNOTATED.graphPlan.overlays={lines:[{id:'sym1',slope:'1',intercept:'0'},{id:'sym2',slope:'-1',intercept:'0'}]};
const frame=graphPlan=>pythonWorker({action:'frame_graph',graphPlan});
const model=graphPlan=>pythonWorker({action:'graph',graphPlan});
const observe=(graphPlan,svg,transform)=>pythonWorker({graphPlan,svg,transform},{script:observerScript});

test('the contract and guide name the multi-curve capability and its error codes',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const text of ['multi-curve-figure-v1','MULTI_CURVE_COUNT_INVALID','MULTI_CURVE_NOT_QUADRATIC','CURVE_<id>_POS'])assert.ok(guide.includes(text),text);
});

test('framing: four distinct curves become six exact branches at one scale',async()=>{
  const framed=await frame(FOUR.graphPlan);assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const gp=framed.result.graphPlan,features=gp.multiCurveFeatures;
  assert.equal(gp.family,'multi-curve');assert.equal(gp.overviewPolicy,'MULTI_CURVE_OVERVIEW_v1');assert.equal(gp.equalUnits,true);assert.equal(gp.axisRatio,1);
  assert.equal(features.schemaVersion,'MULTI_CURVE_FEATURES_v1');assert.equal(features.curves.length,4);
  assert.deepEqual(features.curves.map(curve=>curve.id),['top','bottom','right','left']);
  assert.equal(features.curves[0].branches.length,1);assert.equal(features.curves[2].branches.length,2);
  assert.deepEqual(features.curves[2].branches.map(branch=>branch.side),['POSITIVE','NEGATIVE']);
  assert.deepEqual(features.curves[2].branches[0].xInterval,['1','2']);
  assert.match(features.curves[2].branches[0].expression,/^\(0\)\+\(1\)\*sqrt\(\(x-\(2\)\)\/\(-1\)\)$/);
  assert.deepEqual(features.curves[3].branches[0].xInterval,['-2','-1']);
  assert.ok(gp.plotCanvas.width===448&&gp.plotCanvas.height>=160&&gp.plotCanvas.height<=640);
  assert.equal(gp.domain[0],gp.viewport[0]);assert.equal(gp.domain[1],gp.viewport[1]);
});

test('annotations: source reflection lines and the labelled curve use the existing overlay and math label machinery',async()=>{
  const framed=(await frame(ANNOTATED.graphPlan)).result.graphPlan;
  const features=framed.overlaysFeatures;
  assert.equal(features.schemaVersion,'GRAPH_OVERLAYS_FEATURES_v1');
  assert.deepEqual(features.lines.map(line=>line.text),['y=x','y=-x']);
  assert.equal(framed.equalUnits,true);assert.equal(framed.axisRatio,1);
  assert.deepEqual(framed.curves.map(curve=>curve.id),['top','bottom','right','left']);
  const built=await model(framed);assert.equal(built.status,'OK',JSON.stringify(built.result));
  assert.match(built.result.svg,/id="overlay-line-sym1"/);
  assert.match(built.result.svg,/id="overlay-line-sym2"/);
  const observed=await observe(framed,built.result.svg,built.result.transform);
  assert.equal(observed.status,'OK',JSON.stringify(observed.result));assert.equal(observed.result.status,'PASS',JSON.stringify(observed.result));
  const spec=specFor({...ANNOTATED,graphPlan:framed},built.result,'multi-curve-annotated');
  assert.deepEqual(spec.objects.filter(object=>object.kind==='LINE').map(object=>object.id),['overlay-line-sym1','overlay-line-sym2']);
  assert.deepEqual(spec.objects.filter(object=>object.kind==='EQUATION_LABEL').map(object=>[object.id,object.text]),[
    ['curve-top-equation','y=2-x^2'],
    ['overlay-line-sym1-equation','y=x'],
    ['overlay-line-sym2-equation','y=-x']
  ]);
});

test('framing refuses fewer than three curves, duplicates, bad kinds, bad domains and an empty branch',async()=>{
  const refuse=async(mutate,code)=>{
    const plan=structuredClone(FOUR.graphPlan);mutate(plan);
    const result=await frame(plan);
    assert.notEqual(result.status,'OK');
    assert.match(JSON.stringify(result.result),new RegExp(code));
  };
  await refuse(plan=>{plan.curves=[plan.curves[0],plan.curves[1]];},'MULTI_CURVE_COUNT_INVALID');
  await refuse(plan=>{plan.curves[3].id='top';},'MULTI_CURVE_ID_INVALID');
  await refuse(plan=>{plan.curves[0].kind='CIRCLE';},'MULTI_CURVE_KIND_INVALID:top');
  await refuse(plan=>{plan.curves[0].coefficients=['2','1','0'];},'MULTI_CURVE_NOT_QUADRATIC:top');
  await refuse(plan=>{plan.curves[0].domain=['1','-1'];},'MULTI_CURVE_DOMAIN_INVALID:top');
  await refuse(plan=>{plan.curves[0].branch='BOTH';},'MULTI_CURVE_BRANCH_INVALID:top');
  await refuse(plan=>{plan.curves[0].label='\\frac{1}{2}';},'MULTI_CURVE_LABEL_INVALID:top');
  await refuse(plan=>{plan.curves[2].branch='SIDEWAYS';},'MULTI_CURVE_BRANCH_INVALID:right');
  await refuse(plan=>{plan.curves[2].branch='POSITIVE';plan.curves[2].domain=['-1','0'];},'MULTI_CURVE_BRANCH_EMPTY:right');
  await refuse(plan=>{plan.extra=true;},'MULTI_CURVE_FIELD_UNKNOWN');
});

test('spec: each exact branch is a FUNCTION_GRAPH with the CURVE_ tag the observer reads back',async()=>{
  const framed=(await frame(FOUR.graphPlan)).result.graphPlan;
  const built=await model(framed);assert.equal(built.status,'OK',JSON.stringify(built.result));
  const spec=specFor({...FOUR,graphPlan:framed},built.result,'multi-curve-fixture');
  assert.equal(spec.viewport.equalUnits,true);
  assert.equal(spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH').length,6);
  const top=spec.objects.find(object=>object.id==='f-top');
  assert.equal(top.expression,'-x^2+2');assert.equal(top.branch,'CURVE_top');
  const right=spec.objects.find(object=>object.id==='f-right-positive');
  assert.equal(right.branch,'CURVE_right_POS');assert.deepEqual(right.domain,[1,2]);
  const left=spec.objects.find(object=>object.id==='f-left-negative');
  assert.equal(left.branch,'CURVE_left_NEG');assert.deepEqual(left.domain,[-2,-1]);
});

test('the independent observer passes the model SVG and rejects a changed inventory or a moved curve',async()=>{
  const framed=(await frame(FOUR.graphPlan)).result.graphPlan;
  const built=await model(framed);assert.equal(built.status,'OK',JSON.stringify(built.result));
  const passed=await observe(framed,built.result.svg,built.result.transform);
  assert.equal(passed.status,'OK',JSON.stringify(passed.result));assert.equal(passed.result.status,'PASS',JSON.stringify(passed.result));
  assert.equal(passed.result.curveCount,4);assert.equal(passed.result.branchCount,6);
  const outDir=path.join(repo,'.tmp/wave-b-20261026');fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,'q10-model.svg'),built.result.svg);
  const modelSvg=built.result.svg;
  fs.writeFileSync(path.join(outDir,'q10-model-result.json'),JSON.stringify({status:passed.result.status,errors:passed.result.errors,curveCount:passed.result.curveCount,branchCount:passed.result.branchCount,transform:built.result.transform,svgSha256:crypto.createHash('sha256').update(modelSvg).digest('hex'),svgBytes:Buffer.byteLength(modelSvg)},null,1)+'\n');

  const inventory=structuredClone(framed);inventory.multiCurveFeatures.curves[2].branches[0].xInterval=['1','1/2'];
  const badInventory=await observe(inventory,built.result.svg,built.result.transform);
  assert.equal(badInventory.status,'OK');assert.equal(badInventory.result.status,'FAIL');
  assert.match(JSON.stringify(badInventory.result.errors),/MULTI_CURVE_INVENTORY_MISMATCH/);

  const moved=structuredClone(framed);
  moved.curves[0].coefficients=['2','0','-2'];moved.multiCurveFeatures.curves[0].coefficients=['2','0','-2'];
  const badCurve=await observe(moved,built.result.svg,built.result.transform);
  assert.equal(badCurve.status,'OK');assert.equal(badCurve.result.status,'FAIL');
  assert.match(JSON.stringify(badCurve.result.errors),/MULTI_CURVE_WRONG_CURVE:CURVE_top/);
});
