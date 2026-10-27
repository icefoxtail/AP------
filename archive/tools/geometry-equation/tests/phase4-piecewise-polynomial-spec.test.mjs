import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {CAPABILITIES,assetIdentity} from '../production/contracts.mjs';
import {scopeFingerprint} from '../production/fingerprint.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const CAPABILITY='piecewise-polynomial-spike-v1';
// The same three fixtures as tests/test_piecewise_polynomial.py: the reference item, |x^2-4x| with a touching line, and an interval given by pieces.
const Q22={family:'piecewise-polynomial',pieces:[{coefficients:['-6','3','1']},{coefficients:['6','1','-1']},{coefficients:['-6','3','1']}],breakpoints:[{x:'-3',y:'-6'},{x:'2',y:'4'}],sourceDomain:{kind:'ALL_REALS'},formula:'abs(x^2+x-6)+2x',referenceLines:[{id:'k',y:'5',intersectionX:['(-3-sqrt(53))/2','(1-sqrt(5))/2','(1+sqrt(5))/2','(-3+sqrt(53))/2']}],requiredPoints:[{id:'A',x:-3,y:-6},{id:'B',x:0.5,y:6.25},{id:'C',x:2,y:4}],exactCoordinates:{B:['1/2','25/4']},axisTickValues:{x:[],y:[]}};
const ABS_QUAD={family:'piecewise-polynomial',pieces:[{coefficients:['0','-4','1']},{coefficients:['0','4','-1']},{coefficients:['0','-4','1']}],breakpoints:[{x:'0',y:'0'},{x:'4',y:'0'}],sourceDomain:{kind:'ALL_REALS'},formula:'abs(x^2-4x)',referenceLines:[{id:'a',y:'4',intersectionX:['2-2*sqrt(2)','2','2+2*sqrt(2)']},{id:'b',y:'2',intersectionX:['2-sqrt(6)','2-sqrt(2)','2+sqrt(2)','2+sqrt(6)']}],requiredPoints:[{id:'O',x:0,y:0},{id:'M',x:2,y:4},{id:'P',x:4,y:0}],axisTickValues:{x:[],y:[]}};
const INTERVAL={family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']},{coefficients:['2','-1']}],breakpoints:[{x:'1',y:'1'}],sourceDomain:{kind:'INTERVAL',range:['-2','3'],states:['CLOSED','OPEN']},referenceLines:[{id:'h',y:'1/2',intersectionX:['-sqrt(2)/2','sqrt(2)/2','3/2']},{id:'m',y:'-1/2',intersectionX:['5/2'],labelIntersections:true}],requiredPoints:[{id:'O',x:0,y:0},{id:'C',x:1,y:1}],axisTickValues:{x:[],y:[]}};
// A velocity-time graph on [0,3]: v(t)=2|t-1|-2, three signed areas 1,1,1. The horizontal axis is t, not x.
const VELOCITY={family:'piecewise-polynomial',pieces:[{coefficients:['0','-2']},{coefficients:['-4','2']}],breakpoints:[{x:'1',y:'-2'}],sourceDomain:{kind:'INTERVAL',range:['0','3'],states:['CLOSED','CLOSED']},formula:'2*abs(x-1)-2',axisVariable:'t',valueVariable:'v',functionName:'v',regions:[{id:'S1',upper:'axis',lower:'f',from:'0',to:'1',label:'S_1'},{id:'S2',upper:'axis',lower:'f',from:'1',to:'2',label:'S_2'},{id:'S3',upper:'f',lower:'axis',from:'2',to:'3',fill:'MEDIUM',label:'S_3'}],requiredPoints:[{id:'A',x:1,y:-2},{id:'B',x:2,y:0},{id:'C',x:3,y:2}],axisTickValues:{x:[],y:[]}};

async function framed(graphPlan,extra={}){
  const frame=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(frame.status,'OK',JSON.stringify(frame.result));
  const plan={capability:CAPABILITY,caption:'구간별 이차함수와 수평선',graphPlan:frame.result.graphPlan,...extra};
  const model=await pythonWorker({action:'graph',graphPlan:plan.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {plan,model:model.result};
}

test('piecewise polynomial is a distinct experimental capability with its own fingerprint',()=>{
  assert.equal(CAPABILITIES[CAPABILITY].status,'EXPERIMENTAL');
  assert.ok(CAPABILITIES[CAPABILITY].requiredAudits.includes('PIECEWISE_POLY_LINE_INTERSECTIONS'));
  const fingerprint=scopeFingerprint(root,CAPABILITY);
  for(const capability of ['polynomial-spike-v1','piecewise-affine-spike-v1','absolute-value-spike-v1'])assert.notEqual(fingerprint,scopeFingerprint(root,capability));
});

test('the author contract carries the capability as a literal fragment (the packet contract is built from those)',()=>{
  const source=fs.readFileSync(new URL('../production/phase2.mjs',import.meta.url),'utf8');
  const fragments=[...source.matchAll(/extendedContract\+='([^']*)';/g)].map(match=>match[1]).join('');
  for(const text of ['piecewise-polynomial-spike-v1','family:"piecewise-polynomial"','breakpoints','referenceLines','intersectionX','labelIntersections','PIECEWISE_POLY_INTERSECTION_MISMATCH','PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS','exactCoordinates'])assert.ok(fragments.includes(text),text);
  assert.ok(source.includes("'trigonometric-spike-v1','piecewise-polynomial-spike-v1'].includes(plan.capability)"));
});

test('spec: three main-curve pieces, the formula header, y=c in the band and one dot per crossing',async()=>{
  const {plan,model}=await framed(Q22);
  const spec=specFor(plan,model,'piecewise-polynomial-fixture');
  const pieces=spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH');
  assert.deepEqual(pieces.map(piece=>piece.branch),['PIECE_1','PIECE_2','PIECE_3']);
  assert.deepEqual(pieces.map(piece=>piece.expression),['x^2+3*x-6','-x^2+x+6','x^2+3*x-6']);
  assert.deepEqual(pieces[1].domain,[-3,2]);
  assert.equal(spec.objects.find(object=>object.id==='formula').text,'y=abs(x^2+x-6)+2x');
  assert.deepEqual(spec.objects.find(object=>object.id==='line-k').coefficients,[0,-1,5]);
  const dots=spec.objects.filter(object=>object.id.startsWith('intersection-k-'));
  assert.equal(dots.length,4);assert.ok(dots.every(dot=>dot.name===null&&dot.at[1]===5));
  assert.equal(spec.displayFacts.formulaPlacement,'HEADER_BAND');assert.equal(spec.viewport.equalUnits,true);
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  const curves=prepared.prepared.primitives.filter(primitive=>primitive.role==='curve');
  assert.equal(curves.length,3);assert.ok(curves.every(curve=>curve.token==='mainCurve'));
  assert.equal(prepared.labels.find(label=>label.id==='formula').tex,'y=\\left|x^{2}+x-6\\right|+2x');
});

test('spec: a crossing at a marked key point is drawn once; an interval plan has no header and keeps its end dots',async()=>{
  const abs=await framed(ABS_QUAD),absSpec=specFor(abs.plan,abs.model,'piecewise-polynomial-fixture');
  assert.deepEqual(absSpec.objects.filter(object=>object.id.startsWith('intersection-a-')).map(object=>object.id),['intersection-a-1','intersection-a-3']);
  const interval=await framed(INTERVAL),spec=specFor(interval.plan,interval.model,'piecewise-polynomial-fixture');
  assert.equal(spec.objects.some(object=>object.id==='formula'),false);
  assert.equal(spec.displayFacts.equationLabelCenters.formula,undefined);
  assert.deepEqual(spec.objects.find(object=>object.id==='intersection-m-1-coordinates').exact,['5/2','-1/2']);
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  assert.deepEqual(prepared.prepared.primitives.filter(primitive=>primitive.role==='interval-endpoint').map(primitive=>[primitive.id,primitive.fill]),[['interval-endpoint-start','#111'],['interval-endpoint-end','#fff']]);
});

test('spec: axisVariable renames only the horizontal axis and the written labels',async()=>{
  const {plan,model}=await framed(VELOCITY);
  assert.equal(plan.graphPlan.axisVariable,'t');
  const spec=specFor(plan,model,'piecewise-polynomial-velocity-fixture');
  assert.equal(spec.displayFacts.axisVariable,'t');
  assert.equal(spec.displayFacts.valueVariable,'v');
  assert.equal(spec.objects.find(object=>object.id==='formula').text,'v(t)=2*abs(t-1)-2');
  assert.deepEqual(spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH').map(object=>object.expression),['-2*x','2*x-4']);
  assert.deepEqual(spec.objects.filter(object=>object.kind==='GRAPH_REGION').map(object=>object.id),['region-S1','region-S2','region-S3']);
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  assert.equal(prepared.labels.find(label=>label.id==='axis-x').text,'t');
  assert.equal(prepared.labels.find(label=>label.id==='axis-y').text,'v');
  const formulaTex=prepared.labels.find(label=>label.id==='formula').tex;
  assert.match(formulaTex,/^v\(t\)=/);
  assert.equal(/x/.test(formulaTex),false);
  const invalid=await pythonWorker({action:'frame_graph',graphPlan:{...VELOCITY,axisVariable:'y'}});
  assert.equal(invalid.status,'ERROR');
  assert.match(invalid.result.code,/INVALID_AXIS_VARIABLE/);
  const invalidValue=await pythonWorker({action:'frame_graph',graphPlan:{...VELOCITY,valueVariable:'x'}});
  assert.equal(invalidValue.status,'ERROR');
  assert.match(invalidValue.result.code,/INVALID_VALUE_VARIABLE/);
});

test('L1 composes all three fixtures and the final SVG passes the static and graph observers',{timeout:600000},async()=>{
  const identity=assetIdentity('20_순천고_1학기_중간_고1_기출|22','SOLUTION_VISUAL');
  const policy={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',requestedSizeClass:'full',displayScale:0.5823,cssTargetFontPx:12.25,fontFloorCssPx:11,comfortCssPx:.25,minimumBaseFontPx:21,maximumBaseFontPx:32,baseFontPx:21.1,rounding:'CEIL_TO_TENTH_BASE_PX'};
  // The band carries the key points the layout cannot place at the dot (what the runner's band fallback does).
  for(const [graphPlan,coordinatePanel] of [[Q22,['B']],[ABS_QUAD,['M']],[INTERVAL,['O','C']]]){
    const {plan,model}=await framed(graphPlan,{coordinatePanel});
    const composed=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
    assert.ok(!/\\(?:frac|left|sqrt)/.test(composed.svg.replace(/<svg[^>]*data-mml-node[\s\S]*?<\/svg>/g,'').replace(/data-[a-z-]+="[^"]*"/g,'')),'no raw TeX in SVG text');
  }
});
