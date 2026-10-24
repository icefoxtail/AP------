import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';

const CAPABILITY='piecewise-polynomial-spike-v1';
// 25 Maesan H1 final c q18: f(x)=(x-2)^2/4-5/4 opens up and g(x)=-(x-1)^2/2+1 opens down; they cross at x=-1/3 and x=3, and f<=g between them.
const TWO={family:'piecewise-polynomial',pieces:[{coefficients:['-1/4','-1','1/4']}],sourceDomain:{kind:'ALL_REALS'},functionName:'f',formula:'x^2/4-x-1/4',
  referenceCurves:[{id:'g',name:'g',coefficients:['1/2','1','-1/2'],intersectionX:['-1/3','3']}],
  requiredPoints:[{id:'A',x:2,y:'-5/4'},{id:'B',x:1,y:1}],exactCoordinates:{A:['2','-5/4'],B:['1','1']},axisTickValues:{x:[],y:[]}};
// x^2 and -x^2+3 cross at x=+-sqrt(6)/2 (a surd crossing), both vertices on the axis.
const SURD={family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']}],sourceDomain:{kind:'ALL_REALS'},
  referenceCurves:[{id:'g',coefficients:['3','0','-1'],intersectionX:['-sqrt(6)/2','sqrt(6)/2']}],
  requiredPoints:[{id:'O',x:0,y:0},{id:'V',x:0,y:3}],axisTickValues:{x:[],y:[]}};

const frame=async graphPlan=>pythonWorker({action:'frame_graph',graphPlan});
const policy={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',requestedSizeClass:'full',displayScale:0.5823,cssTargetFontPx:12.25,fontFloorCssPx:11,comfortCssPx:.25,minimumBaseFontPx:21,maximumBaseFontPx:32,baseFontPx:21.1,rounding:'CEIL_TO_TENTH_BASE_PX'};

test('the author contract names referenceCurves, its error codes and the guide describes it',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const text of ['referenceCurves','PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS','PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC','functionName'])assert.ok(guide.includes(text),text);
});

test('framing: every crossing of the function with a reference curve is recomputed exactly and frozen, vertices are key points',async()=>{
  const two=await frame(TWO);assert.equal(two.status,'OK',JSON.stringify(two.result));
  const features=two.result.graphPlan.piecewisePolynomialFeatures;
  assert.equal(features.referenceCurves.length,1);assert.deepEqual(features.referenceCurves[0].coefficients,['1/2','1','-1/2']);
  assert.deepEqual(features.curveIntersections[0].points.map(point=>point.x),['-1/3','3']);
  assert.ok(Math.abs(features.curveIntersections[0].points[0].yValue-1/9)<1e-12&&Math.abs(features.curveIntersections[0].points[1].yValue+1)<1e-12);
  const surd=await frame(SURD);assert.equal(surd.status,'OK',JSON.stringify(surd.result));
  assert.deepEqual(surd.result.graphPlan.piecewisePolynomialFeatures.curveIntersections[0].points.map(point=>point.x),['-sqrt(6)/2','sqrt(6)/2']);
});

test('the engine refuses a wrong crossing list, an unmarked vertex, a non quadratic curve, a stray key point and too many curves',async()=>{
  const refuse=async(mutate,code)=>{const plan=structuredClone(TWO);mutate(plan);const result=await frame(plan);assert.notEqual(result.status,'OK');assert.match(JSON.stringify(result.result),new RegExp(code));};
  await refuse(plan=>{plan.referenceCurves[0].intersectionX=['3'];},'PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds 2');
  await refuse(plan=>{plan.referenceCurves[0].intersectionX=['-1/3','3','5'];},'PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds 2');
  await refuse(plan=>{plan.requiredPoints=[plan.requiredPoints[0]];delete plan.exactCoordinates.B;},'PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS:g');
  await refuse(plan=>{plan.referenceCurves[0].coefficients=['1','1','0'];},'PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC:g');
  await refuse(plan=>{plan.referenceCurves[0].coefficients=['-1/4','-1','1/4'];plan.referenceCurves[0].intersectionX=[];plan.requiredPoints=[plan.requiredPoints[0]];delete plan.exactCoordinates.B;},'PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE');
  await refuse(plan=>{plan.requiredPoints.push({id:'C',x:0,y:5});},'PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:C');
  await refuse(plan=>{plan.referenceCurves.push({id:'h',coefficients:['0','0','1'],intersectionX:[]},{id:'k',coefficients:['0','0','2'],intersectionX:[]});},'PIECEWISE_POLY_REFERENCE_CURVES_INVALID');
  await refuse(plan=>{plan.referenceCurves[0].id='g g';},'PIECEWISE_POLY_REFERENCE_CURVES_INVALID');
  await refuse(plan=>{plan.referenceCurves[0].name='G';},'PIECEWISE_POLY_REFERENCE_CURVES_INVALID');
  await refuse(plan=>{plan.functionName='x';},'PIECEWISE_POLY_FUNCTION_NAME_INVALID');
});

test('spec: the curve is a REF_ branch with its own equation label and the crossings are dots',async()=>{
  const framed=(await frame(TWO)).result.graphPlan,plan={capability:CAPABILITY,caption:'두 포물선',graphPlan:framed,coordinatePlacement:'PANEL'};
  const model=await pythonWorker({action:'graph',graphPlan:framed});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const spec=specFor(plan,model.result,'reference-curves-fixture');
  const curve=spec.objects.find(object=>object.id==='f-ref-g');assert.equal(curve.branch,'REF_g');assert.equal(curve.expression,'-(1/2)*x^2+x+(1/2)');
  assert.equal(spec.objects.find(object=>object.id==='ref-curve-g-equation').text,'g(x)=-x^2/2+x+1/2');
  assert.equal(spec.objects.find(object=>object.id==='formula').text,'f(x)=x^2/4-x-1/4');
  assert.equal(spec.objects.filter(object=>/^intersection-g-/.test(object.id)).length,2);
});

test('L1 composes both fixtures and the graph observer checks the reference curve, its crossings and its dots',{timeout:900000},async()=>{
  const identity=assetIdentity('25_매산고_1학기_기말_고1_기출c|18','SOLUTION_VISUAL');
  for(const graphPlan of [TWO,SURD]){
    const framed=(await frame(graphPlan)).result.graphPlan,plan={capability:CAPABILITY,caption:'두 포물선의 교점',graphPlan:framed,coordinatePlacement:'PANEL'};
    const model=await pythonWorker({action:'graph',graphPlan:framed});assert.equal(model.status,'OK',JSON.stringify(model.result));
    const composed=await composeConstructionCandidate({plan,model:model.result,identity,typographyPolicy:policy});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
    assert.match(composed.svg,/data-branch="REF_g"/);
    // A frozen crossing inventory that differs from the exact recomputation is caught by the observer.
    const tampered=structuredClone(framed);tampered.piecewisePolynomialFeatures.curveIntersections[0].points[0].yValue+=.5;
    const bad=await composeConstructionCandidate({plan:{...plan,graphPlan:tampered},model:(await pythonWorker({action:'graph',graphPlan:tampered})).result,identity,typographyPolicy:policy}).catch(error=>({status:'THROWN',detail:String(error.message)}));
    assert.notEqual(bad.status,'COMPOSED',JSON.stringify(bad.detail));assert.match(JSON.stringify(bad.detail),/PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH:g/);
  }
});
