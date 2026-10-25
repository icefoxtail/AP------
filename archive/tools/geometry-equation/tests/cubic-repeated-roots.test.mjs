// Cubic/quartic graphs with repeated real roots (중근): exact multiplicities, tangency/crossing in the final polyline, and a two-cubic
// composite. Chrome is used by the end-to-end render: run with --test-concurrency=1.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {renderPlan} from '../production/render-plan.mjs';
import {compositePanels} from '../production/composite-candidate-svg-v1.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const sourcePath='archive/exams/original/high/h1/1mid/24_매산고_1학기_중간_고1_기출.js';
const graphPlan=coefficients=>({family:'polynomial',coefficients,sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],viewport:[-2,2,-2,2],requiredPoints:[],axisTickValues:{x:[],y:[]}});
const frame=async coefficients=>{const f=await pythonWorker({action:'frame_graph',graphPlan:graphPlan(coefficients)},{timeoutMs:120000});assert.equal(f.status,'OK',JSON.stringify(f.result));return f.result.graphPlan;};
const audit=async(plan,svg,transform)=>{const r=await pythonWorker({graphPlan:plan,svg,transform},{script:observerScript,timeoutMs:120000});return r.result;};

test('the cubic/quartic contract documents repeated roots and the two-cubic composite',()=>{
  const text=contractText();
  assert.ok(text.includes('Repeated real roots keep their exact multiplicity'));
  assert.ok(text.includes('Two cubic/quartic cases are also a two-panel composite'));
  assert.ok(text.includes('UNSUPPORTED_CUBIC_QUARTIC_REPEATED_ROOT_IMPRECISE'));
});

test('repeated roots keep exact multiplicity, touch or cross, and pass the independent observer',{timeout:120000},async()=>{
  for(const [coefficients,expected] of [[['2','-3','0','1'],[[-2,1],[1,2]]],[['-1/4','-3/4','0','1'],[[-0.5,2],[1,1]]]]){
    const framed=await frame(coefficients);
    const roots=framed.overviewFeatures.filter(row=>row.kind==='POLYNOMIAL_FEATURE'&&row.roles.includes('ROOT')).map(row=>[row.x,row.multiplicity.root]);
    assert.deepEqual(roots,expected,JSON.stringify(roots));
    assert.equal(framed.overviewFeaturePolicy.repeatedSourceRootPolicy,'EXACT_MULTIPLICITY');
    assert.equal(framed.overviewFeaturePolicy.tangencyPolicy,'TOUCHES_AXIS_EVEN_CROSSES_ODD');
    const model=await pythonWorker({action:'graph',graphPlan:framed},{timeoutMs:120000});
    assert.equal(model.status,'OK',JSON.stringify(model.result));
    const observed=await audit(framed,model.result.svg,model.result.transform);
    assert.equal(observed.status,'PASS',JSON.stringify(observed.errors));
    assert.deepEqual(observed.overview.rootMultiplicities.map(row=>row.multiplicity),expected.map(row=>row[1]));
    // The final composed figure is audited on the same 610x420 overview plot (406x356) the model now uses.
    const v=framed.viewport,sx=406/(v[1]-v[0]),sy=356/(v[3]-v[2]);
    const finalObserved=await audit(framed,model.result.svg,{originX:32-v[0]*sx,originY:32+v[3]*sy,sx,sy,displayScale:1});
    assert.equal(finalObserved.status,'PASS',JSON.stringify(finalObserved.errors));
  }
});

test('a tampered polyline that crosses at the double root fails the observer',{timeout:120000},async()=>{
  const framed=await frame(['2','-3','0','1']),model=await pythonWorker({action:'graph',graphPlan:framed},{timeoutMs:120000});
  const transform=model.result.transform,svg=model.result.svg;
  const curve=svg.match(/<polyline id="curve-0"[^>]*points="([^"]+)"/);
  assert.ok(curve,'the model has one curve polyline');
  const pairs=curve[1].split(' ').map(point=>point.split(',').map(Number));
  const rootX=transform.originX+1*transform.sx;
  const tampered=pairs.map(([x,y])=>[x,rootX<x&&x<=rootX+30?y+8:y]);
  const mutated=svg.replace(curve[0],curve[0].replace(curve[1],tampered.map(([x,y])=>`${x},${y}`).join(' ')));
  const observed=await audit(framed,mutated,transform);
  assert.equal(observed.status,'FAIL');
  assert.ok(observed.errors.includes('OVERVIEW_EVEN_ROOT_CROSSES_AXIS'),JSON.stringify(observed.errors));
});

test('two cubic panels are accepted and get a formula header band (idempotent re-validation)',()=>{
  const panel=coefficients=>({caption:{text:'a=-1일 때'},plan:{capability:'polynomial-spike-v1',graphPlan:{...graphPlan(coefficients),requiredPoints:[]}}});
  const plan={capability:'composite-panels-v1',panels:[panel(['2','-3','0','1']),panel(['-1/4','-3/4','0','1'])]};
  const checked=compositePanels(plan);
  assert.equal(checked.length,2);
  for(const item of checked){assert.equal(item.plan.graphPlan.overviewHeaderBand,true);assert.equal(item.plan.graphPlan.compositeHeader,undefined);}
  const again=compositePanels({...plan,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))});
  assert.equal(again.length,2);
  const quadratic=coefficients=>({caption:{math:'k=-2'},plan:{capability:'polynomial-spike-v1',graphPlan:{...graphPlan(coefficients)}}});
  const twoQuadratic=compositePanels({capability:'composite-panels-v1',panels:[quadratic(['1','0','1']),quadratic(['2','0','1'])]});
  for(const item of twoQuadratic){assert.equal(item.plan.graphPlan.overviewHeaderBand,undefined);assert.equal(item.plan.graphPlan.compositeHeader,undefined);}
});

test('the two-case repeated-root figure renders to ARCHIVE_BOUND',{timeout:600000},async()=>{
  const plan={capability:'composite-panels-v1',panels:[
    {caption:{math:'a=-1',text:'일 때'},plan:{capability:'polynomial-spike-v1',graphPlan:{...graphPlan(['2','-3','0','1']),requiredPoints:[{id:'P1',x:-2,y:0},{id:'P2',x:1,y:0}]}}},
    {caption:{math:'a=1/8',text:'일 때'},plan:{capability:'polynomial-spike-v1',graphPlan:{...graphPlan(['-1/4','-3/4','0','1']),requiredPoints:[{id:'P1',x:-0.5,y:0},{id:'P2',x:1,y:0}],exactCoordinates:{P1:['-1/2','0']}}}}
  ],caption:'a=-1일 때는 x=1에서, a=1/8일 때는 x=-1/2에서 그래프가 x축에 접한다.',sourceConditions:[{id:'c1',condition:'중근',mappedTo:['panel-1','panel-2']}],newVisualInformation:['중근에서 x축에 접하는 두 경우']};
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'cubic-repeated-'));
  const result=await renderPlan({item:{sourcePath,ordinal:17,dir:'q17'},plan,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,800));
  assert.equal(result.panels,2);
  const svg=fs.readFileSync(path.join(out,'q17-solution.svg'),'utf8');
  assert.match(svg,/data-composite="composite-panels-v1"/);
  assert.equal((svg.match(/id="p\d-panel"/g)??[]).length,2);
});
