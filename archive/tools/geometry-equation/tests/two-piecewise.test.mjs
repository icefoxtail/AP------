import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';

const CAPABILITY='piecewise-polynomial-spike-v1';
// 26 Geumdang H1 mid c q17: f(x)=-x^2 (x<0), x^2-x (x>=0); g(x)=2x+2 (x<-1), 0 (-1<=x<1), 2x-2 (x>=1) at a=2.
// The two functions are both piecewise; they meet at x=0, 1 and 2.
const TWO_PIECEWISE={family:'piecewise-polynomial',
  pieces:[{coefficients:['0','0','-1']},{coefficients:['0','-1','1']}],breakpoints:[{x:'0',y:'0'}],
  sourceDomain:{kind:'ALL_REALS'},functionName:'f',
  referenceCurves:[{id:'g',name:'g',pieces:[{coefficients:['2','2']},{coefficients:['0']},{coefficients:['-2','2']}],
    breakpoints:[{x:'-1',y:'0'},{x:'1',y:'0'}],intersectionX:['0','1','2']}],
  requiredPoints:[{id:'A',x:0,y:0},{id:'B',x:0.5,y:-0.25},{id:'C',x:-1,y:0},{id:'D',x:1,y:0}],
  exactCoordinates:{B:['1/2','-1/4']},axisTickValues:{x:[2],y:[2]}};
// f(x)=x^2 on all reals; g(x)=x but DEFINED ONLY on [2,3] (closed). x^2=x at 0 and 1 lies outside g's domain: no crossing.
const OUTSIDE_DOMAIN={family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']}],sourceDomain:{kind:'ALL_REALS'},
  referenceCurves:[{id:'g',name:'g',pieces:[{coefficients:['0','1']}],sourceDomain:{kind:'INTERVAL',range:[2,3],states:['CLOSED','CLOSED']},intersectionX:[]}],
  requiredPoints:[{id:'V',x:0,y:0}],axisTickValues:{x:[],y:[]}};
// f(x)=x^2; g(x)=1 only on [1,2] with an OPEN left end. x^2=1 has x=1 (open, not a crossing) and x=-1 (outside the domain).
const OPEN_END={family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']}],sourceDomain:{kind:'ALL_REALS'},
  referenceCurves:[{id:'g',name:'g',pieces:[{coefficients:['1']}],sourceDomain:{kind:'INTERVAL',range:[1,2],states:['OPEN','CLOSED']},intersectionX:[]}],
  requiredPoints:[{id:'V',x:0,y:0}],axisTickValues:{x:[],y:[]}};
// Four continuous pieces: f=x^2 for x<=-1, f=1 for -1<=x<=1, f=x^2 for x>=1.
const FOUR_PIECES={family:'piecewise-polynomial',
  pieces:[{coefficients:['0','0','1']},{coefficients:['1']},{coefficients:['1']},{coefficients:['0','0','1']}],
  breakpoints:[{x:'-1',y:'1'},{x:'0',y:'1'},{x:'1',y:'1'}],sourceDomain:{kind:'ALL_REALS'},
  requiredPoints:[{id:'A',x:-1,y:1},{id:'B',x:0,y:1},{id:'C',x:1,y:1}],axisTickValues:{x:[],y:[]}};

const frame=async graphPlan=>pythonWorker({action:'frame_graph',graphPlan});
const policy={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',requestedSizeClass:'full',displayScale:0.5823,cssTargetFontPx:12.25,fontFloorCssPx:11,comfortCssPx:.25,minimumBaseFontPx:21,maximumBaseFontPx:32,baseFontPx:21.1,rounding:'CEIL_TO_TENTH_BASE_PX'};

test('the author contract and guide describe a piecewise second function and its codes',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const text of ['PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID','PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS','PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS','최대 4개'])assert.ok(guide.includes(text),text);
});

test('framing: two piecewise functions are solved piece pair by piece pair and frozen',async()=>{
  const result=await frame(TWO_PIECEWISE);assert.equal(result.status,'OK',JSON.stringify(result.result));
  const features=result.result.graphPlan.piecewisePolynomialFeatures;
  assert.deepEqual(features.curveIntersections[0].points.map(point=>point.x),['0','1','2']);
  assert.deepEqual(features.curveIntersections[0].points.map(point=>point.keyPoint),['A','D',undefined]);
  assert.deepEqual(features.referenceCurves[0].corners,[{x:'-1',y:'0'},{x:'1',y:'0'}]);
  assert.deepEqual(features.referenceCurves[0].pieces.map(piece=>piece.interval),[[null,'-1'],['-1','1'],['1',null]]);
  // Four pieces are accepted; a fifth is refused explicitly.
  const four=await frame(FOUR_PIECES);assert.equal(four.status,'OK',JSON.stringify(four.result));
  const five=structuredClone(FOUR_PIECES);five.pieces.push({coefficients:['0','0','1']});five.breakpoints.push({x:'2',y:'1'});
  const refused=await frame(five);assert.notEqual(refused.status,'OK');assert.match(JSON.stringify(refused.result),/PIECEWISE_POLY_PIECE_COUNT_INVALID|PIECEWISE_POLY_DISCONTINUOUS/);
});

test('no fake intersections outside a reference piece domain, and open ends are excluded',async()=>{
  const outside=await frame(OUTSIDE_DOMAIN);assert.equal(outside.status,'OK',JSON.stringify(outside.result));
  assert.deepEqual(outside.result.graphPlan.piecewisePolynomialFeatures.curveIntersections[0].points,[]);
  const open=await frame(OPEN_END);assert.equal(open.status,'OK',JSON.stringify(open.result));
  assert.deepEqual(open.result.graphPlan.piecewisePolynomialFeatures.curveIntersections[0].points,[]);
  assert.deepEqual(open.result.graphPlan.piecewisePolynomialFeatures.referenceCurves[0].sourceInterval,
    {lo:'1',hi:'2',startState:'OPEN',endState:'CLOSED',startY:'1',endY:'1'});
  const fake=structuredClone(OUTSIDE_DOMAIN);fake.referenceCurves[0].intersectionX=['0','1'];
  const refused=await frame(fake);assert.notEqual(refused.status,'OK');assert.match(JSON.stringify(refused.result),/PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds 0/);
  const atOpen=structuredClone(OPEN_END);atOpen.referenceCurves[0].intersectionX=['1'];
  const refusedOpen=await frame(atOpen);assert.notEqual(refusedOpen.status,'OK');assert.match(JSON.stringify(refusedOpen.result),/PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds 0/);
});

test('a piecewise reference curve fails closed: corners, continuity, domain, formula and piece count',async()=>{
  const refuse=async(mutate,code)=>{const plan=structuredClone(TWO_PIECEWISE);mutate(plan);const result=await frame(plan);assert.notEqual(result.status,'OK',code);assert.match(JSON.stringify(result.result),new RegExp(code));};
  // An unmarked reference corner.
  await refuse(plan=>{plan.requiredPoints=plan.requiredPoints.filter(point=>point.id!=='C');},'PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS:g:-1');
  // A jump at a reference breakpoint.
  await refuse(plan=>{plan.referenceCurves[0].pieces[1].coefficients=['1'];plan.referenceCurves[0].breakpoints[0].y='1';},'PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS:g:-1');
  // A breakpoint value that both pieces do not give.
  await refuse(plan=>{plan.referenceCurves[0].breakpoints[0].y='1';},'PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_VALUE_MISMATCH:g:-1');
  // An interval source with a breakpoint outside it.
  await refuse(plan=>{plan.referenceCurves[0].sourceDomain={kind:'INTERVAL',range:[0,3],states:['CLOSED','CLOSED']};},'PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_OUTSIDE_SOURCE_INTERVAL:g');
  // A malformed domain.
  await refuse(plan=>{plan.referenceCurves[0].sourceDomain={kind:'INTERVAL',range:[3,0]};},'PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID:g');
  // Five reference pieces.
  await refuse(plan=>{const g=plan.referenceCurves[0];g.pieces.push({coefficients:['0']},{coefficients:['0']});g.breakpoints.push({x:'2',y:'2'},{x:'3',y:'0'});},'PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID:g');
  // A formula that is not the reference function.
  await refuse(plan=>{plan.referenceCurves[0].formula='x^2';},'PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH:g');
  // Both forms at once and a bad name are refused.
  await refuse(plan=>{plan.referenceCurves[0].coefficients=['0','0','1'];},'PIECEWISE_POLY_REFERENCE_CURVES_INVALID');
  await refuse(plan=>{plan.referenceCurves[0].name='G';},'PIECEWISE_POLY_REFERENCE_CURVES_INVALID');
});

test('spec: one REF_ branch per reference piece, f(x) and g(x) labels',async()=>{
  const framed=(await frame(TWO_PIECEWISE)).result.graphPlan;
  const plan={capability:CAPABILITY,caption:'a=2',graphPlan:framed,coordinatePlacement:'PANEL'};
  const model=await pythonWorker({action:'graph',graphPlan:framed});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const spec=specFor(plan,model.result,'two-piecewise-fixture');
  const curves=spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH'&&object.branch.startsWith('REF_'));
  assert.deepEqual(curves.map(curve=>curve.branch),['REF_g_1','REF_g_2','REF_g_3']);
  // The two functions are named beside their own curves (the band is too far from the plot to tell them apart).
  const refName=spec.objects.find(object=>object.id==='ref-curve-g-equation');
  assert.equal(refName.kind,'GRAPH_ANNOTATION');assert.equal(refName.text,'g(x)');
  const mainName=spec.objects.find(object=>object.id==='main-curve-name');
  assert.equal(mainName.kind,'GRAPH_ANNOTATION');assert.equal(mainName.text,'f(x)');
  assert.equal(spec.objects.some(object=>object.id==='formula'),false);
  assert.equal(spec.objects.filter(object=>/^intersection-g-/.test(object.id)).length,1);
});

test('spec: a reference domain end is a hollow/filled dot at its own point',async()=>{
  const framed=(await frame(OPEN_END)).result.graphPlan;
  const plan={capability:CAPABILITY,caption:'정의역',graphPlan:framed,coordinatePlacement:'PANEL'};
  const model=await pythonWorker({action:'graph',graphPlan:framed});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const spec=specFor(plan,model.result,'two-piecewise-fixture');
  assert.deepEqual(spec.displayFacts.referenceIntervalFeatures,[{id:'g',lo:'1',hi:'2',startState:'OPEN',endState:'CLOSED',startY:'1',endY:'1'}]);
});

test('L1 composes the two-piecewise figure; the observer recomputes domains and catches tampering',{timeout:900000},async()=>{
  const identity=assetIdentity('26_금당고_1학기_중간_고1_기출_c|17','SOLUTION_VISUAL');
  const framed=(await frame(TWO_PIECEWISE)).result.graphPlan,plan={capability:CAPABILITY,caption:'a=2일 때 두 그래프가 세 점에서 만난다.',graphPlan:framed,coordinatePlacement:'PANEL'};
  const model=await pythonWorker({action:'graph',graphPlan:framed});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const composed=await composeConstructionCandidate({plan,model:model.result,identity,typographyPolicy:policy});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
  for(const branch of ['REF_g_1','REF_g_2','REF_g_3'])assert.match(composed.svg,new RegExp('data-branch="'+branch+'"'));
  // A reference curve on [1,2] with an OPEN left end: its own end dots are drawn hollow/filled and the observer checks them.
  const openFramed=(await frame(OPEN_END)).result.graphPlan,openPlan={capability:CAPABILITY,caption:'정의역',graphPlan:openFramed,coordinatePlacement:'PANEL'};
  const openModel=await pythonWorker({action:'graph',graphPlan:openFramed});assert.equal(openModel.status,'OK',JSON.stringify(openModel.result));
  const openComposed=await composeConstructionCandidate({plan:openPlan,model:openModel.result,identity,typographyPolicy:policy});
  assert.equal(openComposed.status,'COMPOSED',JSON.stringify(openComposed.detail));
  assert.match(openComposed.svg,/id="ref-endpoint-g-start"[^>]*fill="#fff"/);
  assert.match(openComposed.svg,/id="ref-endpoint-g-end"[^>]*fill="#111"/);
  // A frozen crossing whose y value is not the curve is caught by the observer.
  const tampered=structuredClone(framed);tampered.piecewisePolynomialFeatures.curveIntersections[0].points[2].yValue+=0.5;
  const badModel=await pythonWorker({action:'graph',graphPlan:tampered});
  const bad=await composeConstructionCandidate({plan:{...plan,graphPlan:tampered},model:badModel.result,identity,typographyPolicy:policy}).catch(error=>({status:'THROWN',detail:String(error.message)}));
  assert.notEqual(bad.status,'COMPOSED',JSON.stringify(bad.detail));assert.match(JSON.stringify(bad.detail),/PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH:g/);
  // A reference polyline drawn past its own piece interval is caught without trusting the frozen draw interval.
  const stretched=structuredClone(framed);stretched.piecewisePolynomialFeatures.referenceCurves[0].pieces[1].drawInterval=[-2,1.5];
  const stretchModel=await pythonWorker({action:'graph',graphPlan:stretched});
  const badStretch=await composeConstructionCandidate({plan:{...plan,graphPlan:stretched},model:stretchModel.result,identity,typographyPolicy:policy}).catch(error=>({status:'THROWN',detail:String(error.message)}));
  assert.notEqual(badStretch.status,'COMPOSED',JSON.stringify(badStretch.detail));assert.match(JSON.stringify(badStretch.detail),/PIECEWISE_POLY_REFERENCE_(PIECE_CROSSES_ITS_INTERVAL|CURVE_COVERAGE_FAIL)/);
});
