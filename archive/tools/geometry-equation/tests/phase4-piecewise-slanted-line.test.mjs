import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';

const CAPABILITY='piecewise-polynomial-spike-v1';
// 26 Hyocheon H1 mid q26: h = f, g, f with f=-(x+1)^2, g=x^2-5 and the line y=-5/2x-6 (sample m=-5/2): all three crossings are key points.
const SLANT={family:'piecewise-polynomial',pieces:[{coefficients:['-1','-2','-1']},{coefficients:['-5','0','1']},{coefficients:['-1','-2','-1']}],breakpoints:[{x:'-2',y:'-1'},{x:'1',y:'-4'}],sourceDomain:{kind:'ALL_REALS'},referenceLines:[{id:'m',slope:'-5/2',intercept:'-6',intersectionX:['-2','-1/2','5/2']}],requiredPoints:[{id:'A',x:-2,y:-1},{id:'B',x:1,y:-4},{id:'C',x:0,y:-5},{id:'D',x:-0.5,y:-4.75},{id:'E',x:2.5,y:-12.25}],exactCoordinates:{D:['-1/2','-19/4'],E:['5/2','-49/4']},axisTickValues:{x:[],y:[]}};
// 25 Maesan H1 final q15: x^2-2|x|+1 and y=x+7/8, four surd crossings drawn as plain dots.
const WSHAPE={family:'piecewise-polynomial',pieces:[{coefficients:['1','2','1']},{coefficients:['1','-2','1']}],breakpoints:[{x:'0',y:'1'}],sourceDomain:{kind:'ALL_REALS'},formula:'x^2-2abs(x)+1',referenceLines:[{id:'k',slope:'1',intercept:'7/8',intersectionX:['(-1-sqrt(2)/2)/2','(-1+sqrt(2)/2)/2','(3-sqrt(34)/2)/2','(3+sqrt(34)/2)/2']}],requiredPoints:[{id:'A',x:0,y:1},{id:'B',x:-1,y:0},{id:'C',x:1,y:0}],axisTickValues:{x:[],y:[]}};

async function framed(graphPlan,extra={}){
  const frame=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(frame.status,'OK',JSON.stringify(frame.result));
  const plan={capability:CAPABILITY,caption:'구간별 이차함수와 기울어진 직선',graphPlan:frame.result.graphPlan,...extra};
  const model=await pythonWorker({action:'graph',graphPlan:plan.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {plan,model:model.result};
}

test('the author contract names the slanted line, its error codes and the sample-value rule',()=>{
  const source=fs.readFileSync(new URL('../production/phase2.mjs',import.meta.url),'utf8');
  const fragments=[...source.matchAll(/extendedContract\+='([^']*)';/g)].map(match=>match[1]).join('');
  for(const text of ['SLANTED line y=m*x+c','{id,slope,intercept,intersectionX}','ONE sample value','PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED','PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO','PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID','PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE'])assert.ok(fragments.includes(text),text);
});

test('spec: the slanted line is y=m*x+q with its equation in the band; crossings that are key points are drawn once, the others at their exact height',async()=>{
  const slant=await framed(SLANT,{coordinatePlacement:'PANEL'}),spec=specFor(slant.plan,slant.model,'piecewise-slanted-fixture');
  assert.deepEqual(spec.objects.find(object=>object.id==='line-m').coefficients,[-2.5,-1,-6]);
  assert.equal(spec.objects.find(object=>object.id==='line-m-equation').text,'y=-5/2*x-6');
  assert.equal(spec.objects.filter(object=>object.id.startsWith('intersection-m-')).length,0,'all three crossings are marked key points');
  const w=await framed(WSHAPE),wspec=specFor(w.plan,w.model,'piecewise-slanted-fixture');
  assert.deepEqual(wspec.objects.find(object=>object.id==='line-k').coefficients,[1,-1,0.875]);
  assert.equal(wspec.objects.find(object=>object.id==='line-k-equation').text,'y=x+7/8');
  const dots=wspec.objects.filter(object=>object.id.startsWith('intersection-k-'));
  assert.equal(dots.length,4);
  for(const dot of dots)assert.ok(Math.abs(dot.at[1]-(dot.at[0]+0.875))<1e-12,'the dot is on the line, not on a horizontal level');
  const prepared=(await pythonWorker({action:'prepare',spec:wspec})).result;
  assert.equal(prepared.labels.find(label=>label.id==='line-k-equation').tex,'y=x+{\\displaystyle\\frac{7}{8}}');
});

test('the engine refuses a slanted line that its own recomputation does not support',async()=>{
  const bad=structuredClone(SLANT);bad.referenceLines[0].intersectionX=['-2','5/2'];
  const frame=await pythonWorker({action:'frame_graph',graphPlan:bad});
  assert.notEqual(frame.status,'OK');assert.match(JSON.stringify(frame.result),/PIECEWISE_POLY_INTERSECTION_MISMATCH:m/);
  const labelled=structuredClone(SLANT);labelled.referenceLines[0].labelIntersections=true;
  const refusedLabel=await pythonWorker({action:'frame_graph',graphPlan:labelled});
  assert.match(JSON.stringify(refusedLabel.result),/PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED/);
});

test('L1 composes both slanted fixtures and the final SVG passes the static and graph observers',{timeout:600000},async()=>{
  const identity=assetIdentity('20_순천고_1학기_중간_고1_기출|22','SOLUTION_VISUAL');
  const policy={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',requestedSizeClass:'full',displayScale:0.5823,cssTargetFontPx:12.25,fontFloorCssPx:11,comfortCssPx:.25,minimumBaseFontPx:21,maximumBaseFontPx:32,baseFontPx:21.1,rounding:'CEIL_TO_TENTH_BASE_PX'};
  for(const [graphPlan,extra] of [[SLANT,{coordinatePlacement:'PANEL'}],[WSHAPE,{coordinatePlacement:'PANEL'}]]){
    const {plan,model}=await framed(graphPlan,extra);
    const composed=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
    assert.equal(composed.graphAudit?.status??'PASS','PASS');
  }
});
