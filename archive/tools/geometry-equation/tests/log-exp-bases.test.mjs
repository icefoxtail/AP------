// Integer / fraction / radical bases for the exponential and logarithmic families, and the two-curve inverse-pair figure.
// Chrome is used by the end-to-end renders: run with --test-concurrency=1.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {typesetter} from '../production/typography.mjs';
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

test('Suncheon Girls Q18 names exact inverse curves while leaving the default evaluated labels intact',async()=>{
  const stock=pair();
  const curves=stock.graphPlan.curves.map(curve=>({...curve,formulaLabel:'NAME'}));
  const named={...stock,graphPlan:{...stock.graphPlan,curves}};
  const baseline=await framed(stock);
  const candidate=await framed(named);
  assert.deepEqual(candidate.model,baseline.model);
  const observed=await pythonWorker({action:'modelBinding',graphPlan:candidate.plan.graphPlan,svg:candidate.model.svg,
    transform:candidate.model.transform},{script:observer});
  assert.equal(observed.result.status,'PASS',JSON.stringify(observed.result));
  const spec=specFor(candidate.plan,candidate.model,'q18');
  assert.deepEqual(spec.objects.filter(o=>o.id.startsWith('formula-')).map(o=>[o.id,o.text,o.nearCurve]),
    [['formula-f','f(x)','f'],['formula-g','g(x)','g']]);
  const normal=specFor(baseline.plan,baseline.model,'baseline');
  assert.match(normal.objects.find(o=>o.id==='formula-g').text,/sqrt\(3\)/);
  const makeLabel=(id,glyphs)=>'<g id="formula-'+id+'">'+glyphs.map(code=>'<path data-c="'+code+'"/>').join('')+'</g>';
  const both=makeLabel('f',['66','28','78','29'])+makeLabel('g',['67','28','78','29']);
  const finalLike=candidate.model.svg.replace('</svg>',both+'</svg>');
  const check=svg=>pythonWorker({action:'graphAudit',graphPlan:candidate.plan.graphPlan,svg,transform:candidate.model.transform},{script:observer});
  assert.equal((await check(finalLike)).result.status,'PASS');
  const numeric=finalLike.replace('data-c="67"','data-c="33"');
  assert.ok((await check(numeric)).result.errors.includes('EXP_LOG_PAIR_NAME_LABEL_MISMATCH:g'));
  assert.equal(await frameError({...named.graphPlan,curves:[{...curves[0],formulaLabel:'3'},curves[1]]}),
    'EXP_LOG_PAIR_FORMULA_LABEL_INVALID:f');
});

test('shared logarithmic reference markers keep the exact y=1 tick and suppress only duplicate labels',async()=>{
  const values=['2','3','1','3','2','3','1'];
  const log=(id,base,rate)=>({id,family:'logarithmic-affine',base,coefficients:['1',rate,'1','1'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},
    formulaLabel:'NAME',referenceLabelPoint:'G',referenceLabelMode:'MARKER'});
  const raw={family:'exp-log-pair',identityLine:false,curves:[log('g','2','1/2'),log('h','4','1/4')],
    axisTickValues:{x:['1','2','4','6'],y:['1','3']},
    overlays:{points:[...values.map((y,x)=>({id:'F'+x,x:String(x),y,unnamed:true})),{id:'G',x:'0',y:'1',coordinates:false,unnamed:true}],
      segments:values.slice(1).map((_,i)=>({id:'p'+i,from:'F'+i,to:'F'+(i+1),color:'BLUE'})),names:[{id:'nf',segment:'p0',text:'f'}]}};
  const invoke=async(payload,options)=>{
    const reply=await pythonWorker(payload,options);
    assert.equal(reply.status,'OK',JSON.stringify(reply.result));return reply.result;
  };
  const {graphPlan}=await invoke({action:'frame_graph',graphPlan:raw});
  const model=await invoke({action:'graph',graphPlan});
  const identity=assetIdentity('shared-log-tick-fixture|1','SOLUTION_VISUAL','decisive-relation');
  const spec=specFor({capability:'exp-log-pair-spike-v1',caption:'두 로그와 주기함수',graphPlan},model,identity.assetId);
  const {labels}=await invoke({action:'prepare',spec});
  assert.ok(labels.some(label=>label.id==='tick-y-1-label'&&label.target==='model-y-unit'));
  assert.ok(labels.some(label=>label.id==='tick-y-3-label'));
  assert.ok(!labels.some(label=>/^(G-name|G-coordinates|reference-[gh]-value)$/.test(label.id)));
  const typeset=typesetter();
  const fragments=Object.fromEntries(labels.map(label=>[label.id,typeset({id:label.id,owner:label.target||label.id,
    factRole:'DERIVED_INTERMEDIATE',fontPx:20,...(label.math||label.kind==='POINT_NAME'?
      {kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity)]));
  const measurements=Object.fromEntries(Object.entries(fragments).map(([id,f])=>[id,[f.intrinsic.width,f.intrinsic.height]]));
  const built=await invoke({action:'build',spec,measurements,fragments});
  assert.deepEqual(built.witness.layout.unresolved,[]);
  assert.deepEqual(built.witness.layout.suppressed,[]);
  const leader=built.witness.layout.leaders.find(row=>row.ownerLabelId==='tick-y-1-label');
  assert.ok(leader);
  assert.deepEqual([leader.tickId,leader.axis,leader.value],['model-y-unit','y',1]);
  assert.deepEqual(leader.from,labels.find(label=>label.id===leader.ownerLabelId).at);
  const {aspectPolicy,...transform}=built.witness.coordinateModel;
  const audit=async(svg,action='graphAudit',frame={...transform,displayScale:.6})=>invoke({action,graphPlan,svg,transform:frame},{script:observer});
  assert.equal((await audit(model.svg,'modelBinding',model.transform)).status,'PASS');
  const observed=await audit(built.svg);
  assert.equal(observed.status,'PASS',JSON.stringify(observed.errors));
  for(const [node,code] of [
    ['<g id="G-name" data-owner="G" data-label-kind="POINT_NAME"/>','EXP_LOG_PAIR_REFERENCE_MARKER_LABEL_UNEXPECTED:G'],
    ['<g id="G-coordinates"/>','EXP_LOG_PAIR_REFERENCE_MARKER_LABEL_UNEXPECTED:G'],
    ['<g id="reference-h-value"/>','EXP_LOG_PAIR_REFERENCE_LABEL_NOT_SUPPRESSED:h'],
  ]){
    const bad=built.svg.replace('</svg>',node+'</svg>');
    assert.ok((await audit(bad)).errors.includes(code));
  }
  for(const [change,code] of [
    [p=>p.overlays.points.at(-1).x='1','EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:g'],
    [p=>p.overlays.points.at(-1).coordinates=true,'EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:g'],
    [p=>p.overlays.points.at(-1).unnamed=false,'EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:g'],
    [p=>p.curves[1].coefficients[3]='2','EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:h'],
    [p=>delete p.curves[1].referenceLabelPoint,'EXP_LOG_PAIR_REFERENCE_LABEL_MODE_INVALID:h'],
  ]){
    const bad=structuredClone(raw);change(bad);
    assert.equal(await frameError(bad),code);
  }
});
