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

test('framing refuses no curve, duplicates, bad kinds, bad domains and an empty branch',async()=>{
  const refuse=async(mutate,code)=>{
    const plan=structuredClone(FOUR.graphPlan);mutate(plan);
    const result=await frame(plan);
    assert.notEqual(result.status,'OK');
    assert.match(JSON.stringify(result.result),new RegExp(code));
  };
  await refuse(plan=>{plan.curves=[];},'MULTI_CURVE_COUNT_INVALID');
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

test('spec binds both equation labels to their own vertical parabola',async()=>{
  const plan=structuredClone(FOUR);
  plan.graphPlan.curves=[
    {id:'f',kind:'Y_OF_X',coefficients:['0','0','-1/9'],domain:['-1','5'],label:'y=ax^2'},
    {id:'g',kind:'Y_OF_X',coefficients:['0','0','1/9'],domain:['-1','5'],label:'y=-ax^2'}
  ];
  const graphPlan=(await frame(plan.graphPlan)).result.graphPlan;
  const built=await model(graphPlan);
  const spec=specFor({...plan,graphPlan},built.result,'two-labelled-parabolas');
  assert.deepEqual(spec.objects.filter(object=>object.kind==='EQUATION_LABEL').map(object=>[object.id,object.text,object.nearCurve]),[
    ['curve-f-equation','y=ax^2','f'],
    ['curve-g-equation','y=-ax^2','g']
  ]);
});

test('the independent observer passes the model SVG and rejects a changed inventory or a moved curve',async()=>{
  const framed=(await frame(FOUR.graphPlan)).result.graphPlan;
  const built=await model(framed);assert.equal(built.status,'OK',JSON.stringify(built.result));
  const passed=await observe(framed,built.result.svg,built.result.transform);
  assert.equal(passed.status,'OK',JSON.stringify(passed.result));assert.equal(passed.result.status,'PASS',JSON.stringify(passed.result));
  assert.equal(passed.result.curveCount,4);assert.equal(passed.result.branchCount,6);
  // Byte baseline captured from the unchanged standalone multi-curve renderer before source-domain endpoint support was added.
  assert.equal(crypto.createHash('sha256').update(built.result.svg).digest('hex'),'11235c0d521d4684bca9a019cdd7d8e878278b5cc9dff35ad79a98392b231cf3');
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

test('Maesan Q14 retains its exact exponential and quadratic on one frame', async()=>{
  const plan={capability:'multi-curve-figure-v1',caption:'지수함수와 이차함수의 비교',graphPlan:{
    family:'multi-curve',viewport:[0,2.4,-.4,4.7],axisTitles:{x:'t'},
    curves:[
      {id:'exp',kind:'EXPONENTIAL',base:'2',coefficients:['1','1','0'],domain:['1','2'],label:'2^t',color:'BLUE',weight:'BOLD'},
      {id:'quad',kind:'Y_OF_X',coefficients:['0','0','1'],domain:['1','2'],label:'t^2',color:'WARM',style:'DASHED'},
    ],
    axisTickValues:{x:['1','2'],y:['4']},
    overlays:{points:[{id:'P',x:'2',y:'4',unnamed:true,coordinates:true}]},
  }};
  const send=async(payload,options)=>{
    const reply=await pythonWorker(payload,options);
    assert.equal(reply.status,'OK',JSON.stringify(reply.result));
    return reply.result;
  };
  const {graphPlan}=await send({action:'frame_graph',graphPlan:plan.graphPlan});
  const model=await send({action:'graph',graphPlan});
  const spec=specFor({...plan,graphPlan},model,'q14');
  assert.deepEqual(spec.objects.filter(row=>row.kind==='FUNCTION_GRAPH').map(row=>[row.branch,row.domain]),
    [['CURVE_exp',[1,2]],['CURVE_quad',[1,2]]]);
  assert.deepEqual(spec.objects.find(row=>row.id==='P').at,[2,4]);
  for(const [,tag,values] of model.svg.matchAll(/data-branch="(CURVE_\w+)" points="([^"]+)"/g)){
    const points=values.split(' ').map(pair=>pair.split(',').map(Number));
    const [x,y]=points.at(-1);
    const {sx,sy,originX,originY}=model.transform;
    assert.ok(Math.abs(x-(originX+2*sx))<1e-6,tag);
    assert.ok(Math.abs(y-(originY-4*sy))<1e-6,tag);
  }
  const independent=svg=>send({action:'modelBinding',graphPlan,svg,transform:model.transform},{script:observerScript});
  assert.equal((await independent(model.svg)).status,'PASS');
  const shifted=model.svg.replace(/(data-branch="CURVE_exp" points=")([-\d.]+),([-\d.]+)/,
    (_all,head,x,y)=>head+x+','+(Number(y)+3));
  assert.ok((await independent(shifted)).errors.includes('MULTI_CURVE_WRONG_CURVE:CURVE_exp'));

  for(const [change,code] of [
    [{base:'1'},'MULTI_CURVE_EXPONENTIAL_BASE_INVALID:exp'],
    [{domain:undefined},'MULTI_CURVE_DOMAIN_INVALID:exp'],
    [{coefficients:['1','-1','0'],domain:['-100','1']},'MULTI_CURVE_EXPONENTIAL_NUMERIC_SCOPE:exp'],
  ]){
    const graphPlan={...plan.graphPlan,curves:[{...plan.graphPlan.curves[0],...change},plan.graphPlan.curves[1]]};
    if(change.domain===undefined&&Object.hasOwn(change,'domain'))delete graphPlan.curves[0].domain;
    const reply=await pythonWorker({action:'frame_graph',graphPlan});
    assert.equal(reply.result.code,code,JSON.stringify(reply.result));
  }
});

test('Maesan Q24 observes exact region columns without plotting the individual integer points',async()=>{
  const graphPlan={
    family:'multi-curve',viewport:[0,7.6,-135,120],axisScale:{x:32,y:1},
    curves:[
      {id:'f',kind:'EXPONENTIAL',base:'2',coefficients:['1','1','3'],shiftX:'1',domain:['4','7']},
      {id:'g',kind:'EXPONENTIAL',base:'2',coefficients:['-1','1','15/2'],domain:['4','7']},
    ],
    axisTickValues:{x:['4','5','6','7'],y:[]},
    regions:[{id:'band',between:['f','g'],from:'4',to:'7',fill:'LIGHT',integerColumns:true}],
  };
  const call=async(payload,options)=>{
    const response=await pythonWorker(payload,options);
    assert.equal(response.status,'OK',JSON.stringify(response.result));
    return response.result;
  };
  const framed=(await call({action:'frame_graph',graphPlan})).graphPlan;
  const model=await call({action:'graph',graphPlan:framed});
  const expected=[
    {x:4,lower:'-17/2',upper:'11',count:20},{x:5,lower:'-49/2',upper:'19',count:44},
    {x:6,lower:'-113/2',upper:'35',count:92},{x:7,lower:'-241/2',upper:'67',count:188},
  ];
  assert.deepEqual(framed.multiCurveFeatures.regions[0].integerColumns,expected);
  assert.doesNotMatch(model.svg,/<circle\b|>344</);
  const spec=specFor({capability:'multi-curve-figure-v1',graphPlan:framed,caption:'두 지수함수 사이의 정수점'},model,'q24');
  const columns=spec.objects.filter(({id,kind})=>id.startsWith('region-band-guide-')&&kind==='SEGMENT');
  assert.deepEqual(columns.map(row=>[row.from[0],row.guide??false]),[[4,false],[5,true],[5,true],[6,true],[6,true],[7,false]]);
  assert.deepEqual(columns.filter(row=>row.from[0]===5).map(row=>[row.from[1],row.to[1]]),[[-24.5,0],[0,19]]);
  const audit=svg=>call({action:'modelBinding',graphPlan:framed,svg,transform:model.transform},{script:observerScript});
  assert.equal((await audit(model.svg)).status,'PASS');
  const wrongNumber=model.svg.replace('>44</text>','>344</text>');
  assert.ok((await audit(wrongNumber)).errors.includes('GRAPH_REGION_INTEGER_COLUMN_COUNT:region-band-guide-5'));
  const wrongWall=model.svg.replace(/(id="region-band-guide-7"[^>]*y2=")([^"]+)/,
    (_all,before,number)=>before+(Number(number)-3));
  assert.ok((await audit(wrongWall)).errors.includes('GRAPH_REGION_INTEGER_COLUMN_GEOMETRY:region-band-guide-7'));
  const wrongRate={...graphPlan,curves:[graphPlan.curves[0],{...graphPlan.curves[1],coefficients:['-1/128','2','15/2']}]};
  const refused=await pythonWorker({action:'frame_graph',graphPlan:wrongRate});
  assert.equal(refused.result.code,'GRAPH_REGION_INTEGER_COLUMNS_INVALID:band');
});

test('Maesan Q12 uses an exact rational base for the nonnegative sampled years',async()=>{
  const graphPlan={family:'multi-curve',viewport:[0,12,0,3],axisScale:{x:1,y:3},
    axisTickValues:{x:['10','12'],y:['1','2']},axisTitles:{x:'n',y:'비율'},
    curves:[{id:'ratio',kind:'EXPONENTIAL',base:'107/100',coefficients:['1','1','0'],domain:['0','12'],label:'r(n)'},
      {id:'double',kind:'LINE',coefficients:['2','0'],domain:['0','12'],label:'y=2'}],
  };
  const framed=await pythonWorker({action:'frame_graph',graphPlan});
  assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const selected=framed.result.graphPlan;
  assert.equal(selected.multiCurveFeatures.curves[0].base,'107/100');
  const model=await pythonWorker({action:'graph',graphPlan:selected});
  assert.equal(model.status,'OK',JSON.stringify(model.result));
  const plan={capability:'multi-curve-figure-v1',graphPlan:selected,caption:'농도 비율과 두 배 기준'};
  const spec=specFor(plan,model.result,'q12');
  const curves=spec.objects.filter(row=>row.kind==='FUNCTION_GRAPH');
  assert.deepEqual(curves.map(row=>row.domain),[[0,12],[0,12]]);
  assert.ok(curves[0].expression.includes('ln(107/100)'));
  assert.equal(spec.objects.find(row=>row.id==='curve-ratio-equation').text,'r(n)');
  const check=await pythonWorker({action:'modelBinding',graphPlan:selected,svg:model.result.svg,transform:model.result.transform},{script:observerScript});
  assert.equal(check.result.status,'PASS',JSON.stringify(check.result));
  for(const base of ['1','1.07','214/200','1/1001']){
    const curves=[{...graphPlan.curves[0],base},graphPlan.curves[1]];
    const rejected=await pythonWorker({action:'frame_graph',graphPlan:{...graphPlan,curves}});
    assert.equal(rejected.result.code,'MULTI_CURVE_EXPONENTIAL_BASE_INVALID:ratio');
  }
});
