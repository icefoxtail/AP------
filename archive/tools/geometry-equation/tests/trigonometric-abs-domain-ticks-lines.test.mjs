import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {renderPlan} from '../production/render-plan.mjs';

// Four additive features of the trigonometric interval form (2026-11-12): |trig| curves, any exact [lo,hi] domain, stepped stacked pi ticks, coloured / vertical /
// surd reference lines and the display size full. Plans that use none of them keep their old output (golden item18 / item34 compared byte for byte when this landed).
const golden=name=>JSON.parse(fs.readFileSync(new URL(`../ops/golden/${name}/plan.json`,import.meta.url),'utf8'));
const frame=async graphPlan=>pythonWorker({action:'frame_graph',graphPlan});
const base=()=>({family:'trigonometric',function:'SIN',coefficients:['2','2','0'],phasePi:'0',absolute:true,
  sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','3'],states:['CLOSED','CLOSED']},axisTickValues:{x:[],y:[]}});
const itemOf=name=>({sourcePath:name.sourcePath,ordinal:name.ordinal});
const SUNCHEON='archive/exams/original/high/h2/1final/26_순천고_1학기_기말_고2_대수.js',GEUMDANG='archive/exams/original/high/h2/1final/26_금당고_1학기_기말_고2_대수.js';

test('feature 1: |sin 2x| frames its zeros as cusps and counts crossings on the folded curve',async()=>{
  const plan=base();plan.referenceLines=[{id:'a',slope:'1',perPi:true,intercept:'0',intersectionCount:8,endCrossing:true}];
  const ok=await frame(plan);assert.equal(ok.status,'OK',JSON.stringify(ok.result));
  const features=ok.result.graphPlan.trigIntervalFeatures;
  assert.equal(features.absolute,true);
  assert.deepEqual(features.cusps.map(row=>row.x),['1/2','1','3/2','2','5/2']);   // F=sin(2x) is zero at k/2 pi; the ends are not cusps
  assert.equal(features.lines[0].intersections.length,8);
  assert.equal(features.lines[0].perPi,true);
  // without endCrossing a line through the closed start stays refused
  const refused=await frame({...plan,referenceLines:[{id:'a',slope:'1',perPi:true,intercept:'0',intersectionCount:8}]});
  assert.notEqual(refused.status,'OK');assert.match(JSON.stringify(refused.result),/TRIG_LINE_THROUGH_INTERVAL_END:a/);
});

test('feature 1: |cos| and |tan| put cusps where the plain function is zero and keep the tan poles',async()=>{
  const cos=await frame({...base(),function:'COS',coefficients:['1','1','0'],sourceDomain:{kind:'INTERVAL_PI',rangePi:['-1','1'],states:['CLOSED','CLOSED']},keyPoints:true});
  assert.equal(cos.status,'OK',JSON.stringify(cos.result));
  assert.deepEqual(cos.result.graphPlan.trigIntervalFeatures.cusps.map(row=>row.x),['-1/2','1/2']);
  assert.deepEqual(cos.result.graphPlan.trigIntervalFeatures.keyPoints.map(row=>row.kind),['CUSP','MAXIMUM','CUSP']);   // the ends -1 and 1 are interval ends, not key points
  const tan=await frame({...base(),function:'TAN',coefficients:['1','1','0'],sourceDomain:{kind:'INTERVAL_PI',rangePi:['-1/4','5/4'],states:['CLOSED','CLOSED']}});
  assert.equal(tan.status,'OK',JSON.stringify(tan.result));
  const features=tan.result.graphPlan.trigIntervalFeatures;
  assert.deepEqual(features.cusps.map(row=>row.x),['0','1']);assert.deepEqual(features.poles.map(row=>row.x),['1/2']);
  const period=await frame({family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',absolute:true,sourceDomain:{kind:'ALL_REALS'},domain:[-4,4],viewport:[-5,5,-5,5]});
  assert.notEqual(period.status,'OK');assert.match(JSON.stringify(period.result),/TRIG_ABSOLUTE_REQUIRES_INTERVAL/);
});

test('feature 2: any exact [lo,hi] with open and closed ends frames, with a vertical line counted once',async()=>{
  const plan={family:'trigonometric',function:'SIN',coefficients:['2','1','1'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-1/2','3/2'],states:['OPEN','CLOSED']},
    referenceLines:[{id:'h',y:'2',intersectionCount:2},{id:'v',x:'1/2',intersectionCount:1}],axisTickValues:{x:[],y:[]}};
  const ok=await frame(plan);assert.equal(ok.status,'OK',JSON.stringify(ok.result));
  const graph=ok.result.graphPlan;
  assert.deepEqual(graph.intervalFeatures.endpoints.map(row=>row.state),['OPEN','CLOSED']);
  assert.ok(Math.abs(graph.domain[0]+Math.PI/2)<1e-9&&Math.abs(graph.domain[1]-3*Math.PI/2)<1e-9);
  assert.equal(graph.trigIntervalFeatures.lines[1].kind,'VERTICAL');assert.equal(graph.trigIntervalFeatures.lines[1].intersections.length,1);
  // a vertical line at the open start is not on the curve (the end is not in the interval), so a claim of 1 is refused with the engine count
  const refused=await frame({...plan,referenceLines:[{id:'v',x:'-1/2',intersectionCount:1}]});
  assert.notEqual(refused.status,'OK');assert.match(JSON.stringify(refused.result),/TRIG_LINE_INTERSECTION_COUNT_MISMATCH:v:engine finds 0/);
});

test('feature 3: the stepped pi ticks thin to what fits and keep the required ones',async()=>{
  const plan={family:'trigonometric',function:'COS',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','2'],states:['CLOSED','OPEN']},
    axisTickPi:true,axisTickPiStep:'1/6',axisTickValues:{x:['5/6','7/6'],y:['-1','1']}};
  const ok=await frame(plan);assert.equal(ok.status,'OK',JSON.stringify(ok.result));
  assert.deepEqual(ok.result.graphPlan.axisTickValues.x,['1/3','5/6','7/6','5/3']);   // 1/3 and 5/3 added, 2/3, 1 and 4/3 too close to a required tick
  assert.deepEqual(ok.result.graphPlan.axisTickPiRequired,['5/6','7/6']);
  assert.deepEqual(ok.result.graphPlan.axisTickValues.y,['-1','1']);
  // a finer step on a short interval keeps every multiple; a step without axisTickPi, or a malformed step, is refused with its code
  const fine=await frame({...plan,sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','1'],states:['CLOSED','CLOSED']},axisTickValues:{x:[],y:[]},axisTickPiStep:'1/4'});
  assert.equal(fine.status,'OK',JSON.stringify(fine.result));assert.deepEqual(fine.result.graphPlan.axisTickValues.x,['1/4','1/2','3/4']);
  const {axisTickPi,...withoutPi}=plan;const noPi=await frame(withoutPi);assert.notEqual(noPi.status,'OK');assert.match(JSON.stringify(noPi.result),/TRIG_TICK_PI_REQUIRES_PI_AXIS/);
  const bad=await frame({...plan,axisTickPiStep:'0'});assert.notEqual(bad.status,'OK');assert.match(JSON.stringify(bad.result),/TRIG_PI_TICK_STEP_INVALID/);
});

test('feature 4: reference-line colours, surd levels and the display size are checked with codes',async()=>{
  const plan={family:'trigonometric',function:'COS',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','2'],states:['CLOSED','OPEN']},axisTickValues:{x:[],y:[]},
    referenceLines:[{id:'h',y:'-sqrt(3)/2',intersectionCount:2,color:'WARM'}],displaySize:'full'};
  const ok=await frame(plan);assert.equal(ok.status,'OK',JSON.stringify(ok.result));
  assert.equal(ok.result.graphPlan.trigIntervalFeatures.lines[0].color,'WARM');assert.equal(ok.result.graphPlan.trigIntervalFeatures.lines[0].intercept,'-sqrt(3)/2');
  for(const color of ['BLUE','WARM','GREEN','ROSE','VIOLET']){const row=await frame({...plan,referenceLines:[{...plan.referenceLines[0],color}]});assert.equal(row.status,'OK',color+JSON.stringify(row.result));}
  const badColor=await frame({...plan,referenceLines:[{...plan.referenceLines[0],color:'RED'}]});assert.notEqual(badColor.status,'OK');assert.match(JSON.stringify(badColor.result),/TRIG_LINE_COLOR_INVALID:h/);
  const badSize=await frame({...plan,displaySize:'huge'});assert.notEqual(badSize.status,'OK');assert.match(JSON.stringify(badSize.result),/TRIG_DISPLAY_SIZE_INVALID/);
  const rational=await frame({...plan,referenceLines:[{...plan.referenceLines[0],y:'sqrt(4)'}]});assert.notEqual(rational.status,'OK');assert.match(JSON.stringify(rational.result),/TRIG_LINE_COEFFICIENT_INVALID:h/);
});

test('the three blocked items render: |sin| with three coloured lines, stepped stacked pi ticks with a surd level, a coloured line at full size',async()=>{
  for(const [name,source,ordinal,check] of [
    ['item154trigabslines',SUNCHEON,17,(svg)=>{
      assert.equal((svg.match(/id="intersection-n1-\d+"/g)||[]).length,4);assert.equal((svg.match(/id="intersection-n2-\d+"/g)||[]).length,8);assert.equal((svg.match(/id="intersection-n3-\d+"/g)||[]).length,12);
      for(const tone of ['#1f5fa8','#b85c00','#2e7d32'])assert.ok(svg.includes(`stroke="${tone}"`),tone);
    }],
    ['item155trigpiticks',GEUMDANG,5,(svg)=>{
      const labels=[...svg.matchAll(/data-tick-pi-value="([^"]+)"/g)].map(match=>match[1]).sort();
      assert.deepEqual(labels,['1/3','5/3','5/6','7/6']);
      assert.ok(/data-tick-display-value="5π\/6"/.test(svg));   // the stacked fraction keeps its plain text on the group
    }],
    ['item156trigq15color',SUNCHEON,15,(svg)=>{assert.ok(svg.includes('stroke="#b85c00"'));assert.equal((svg.match(/id="intersection-h-\d"/g)||[]).length,4);}]]){
    const out=fs.mkdtempSync(path.join(os.tmpdir(),'trig-abs-'));
    const result=await renderPlan({item:{sourcePath:source,ordinal},plan:golden(name),outDir:out});
    assert.equal(result.status,'ARCHIVE_BOUND',name+JSON.stringify(result).slice(0,500));
    assert.equal(result.sizeClass,'full',name);
    check(fs.readFileSync(path.join(out,'figure-solution.svg'),'utf8'));
  }
});

test('a domain from -pi/2 to 3pi/2 with a vertical line draws both end dots, the line and its colour',async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'trig-domain-'));
  const plan={capability:'trigonometric-spike-v1',graphPlan:{family:'trigonometric',function:'SIN',coefficients:['2','1','1'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-1/2','3/2'],states:['OPEN','CLOSED']},
    referenceLines:[{id:'h',y:'2',intersectionCount:2,color:'BLUE'},{id:'v',x:'1/2',intersectionCount:1,color:'ROSE'}],axisTickPi:true,axisTickPiStep:'1/4',axisTickValues:{x:[],y:['1','3']},displaySize:'full'},
    caption:'−π/2<x≤3π/2에서 y=2 sin x+1의 그래프와 직선 y=2, x=π/2를 나타낸다.',sourceConditions:[{id:'c1',condition:'구간 −π/2<x≤3π/2',mappedTo:'graphPlan'}],newVisualInformation:['구간의 두 끝점과 두 직선']};
  const result=await renderPlan({item:{sourcePath:GEUMDANG,ordinal:5},plan,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,500));assert.equal(result.sizeClass,'full');
  const svg=fs.readFileSync(path.join(out,'figure-solution.svg'),'utf8');
  assert.equal((svg.match(/id="interval-endpoint-(start|end)"/g)||[]).length,2);
  assert.ok(/id="line-v"[^>]*stroke="#b8325f"/.test(svg));assert.ok(/id="line-h"[^>]*stroke="#1f5fa8"/.test(svg));
});

test('Q11 pi window draws only declared ticks, retains the curve crop and audits the final SVG',async()=>{
  const graphPlan={family:'trigonometric',function:'COS',coefficients:['-2','2','1'],phasePi:'0',
    sourceDomain:{kind:'ALL_REALS'},displayWindowPi:['-1/4','19/12'],axisTickPi:true,
    axisTickValues:{x:['1/2','1','3/2'],y:['-1','3']},displayGuides:{x:['1/2','1','3/2'],y:['-1','3']},showOriginLabel:true};
  const framed=await frame(graphPlan);
  assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const frozen=framed.result.graphPlan;
  const model=await pythonWorker({action:'graph',graphPlan:frozen});
  assert.equal(model.status,'OK',JSON.stringify(model.result));
  let transform;
  const worker=async(payload,options)=>{
    const reply=await pythonWorker(payload,options);
    if(payload.action==='build'&&reply.status==='OK'){
      const {aspectPolicy,...rest}=reply.result.witness.coordinateModel;
      transform={...rest,displayScale:1};
    }
    return reply;
  };
  const composed=await composeConstructionCandidate({
    plan:{capability:'trigonometric-spike-v1',caption:'삼각함수 그래프의 일부',graphPlan:frozen},
    model:model.result,identity:assetIdentity('25_매산고_1학기_중간_고2_대수|11','PROBLEM_VISUAL','image'),
    typographyPolicy:{schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',baseFontPx:27.7,displayScale:.4,fontFloorCssPx:11},worker,
  });
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.doesNotMatch(composed.svg,/id="(?:period-label|interval-start-label|interval-end-label|formula)"|data-role="interval-endpoint"/);
  assert.equal([...composed.svg.matchAll(/data-label-kind="TICK_LABEL"/g)].length,5);
  assert.equal([...composed.svg.matchAll(/data-role="guide"/g)].length,5);
  const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
  const wrongLabel=composed.svg.replace('data-tick-display-value="3π/2"','data-tick-display-value="π/2"');
  assert.notEqual(wrongLabel,composed.svg);
  const response=await pythonWorker({action:'graphAudit',graphPlan:frozen,svg:wrongLabel,transform},{script:observer});
  assert.ok(response.result.errors.includes('TRIG_DISPLAY_TICK_TEXT_MISMATCH:x:3/2'),JSON.stringify(response.result));
});
