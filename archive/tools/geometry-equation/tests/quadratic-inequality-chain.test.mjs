// Chrome-using (composes a number-line panel): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {compositePanels} from '../production/composite-candidate-svg-v1.mjs';
import {solveQuadraticInequality,expandInequalityChain,numberLineSpec,numberLinePanelSize,composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
// 22 매산고 1학기 기말 고1 11: D/4=(a+3)(a-5)<0, a=-3 checked separately -> -3<=a<5, integers -3..4.
const q11={coefficients:['-15','-2','1'],comparator:'<',variable:'a',adjoinedPoints:['-3'],integerPoints:true};
const chain=inequality=>({capability:'quadratic-inequality-chain-v1',inequality,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'inequality'}],newVisualInformation:['n']});
const code=expected=>error=>error.message===expected;
const ends=model=>[model.kind,model.lower&&[model.lower.value,model.lower.state],model.upper&&[model.upper.value,model.upper.state]];

test('the engine solves the inequality exactly: interval, ray, point, all reals, integer points',()=>{
  const m=solveQuadraticInequality(q11);
  assert.deepEqual(ends(m),['INTERVAL',['-3','CLOSED'],['5','OPEN']]);
  assert.deepEqual(m.integers,['-3','-2','-1','0','1','2','3','4']);
  assert.equal(m.integers.reduce((sum,n)=>sum+Number(n),0),4);
  // x^2-2x-1<0 -> 1-sqrt2<x<1+sqrt2, integers 0,1,2
  const surd=solveQuadraticInequality({coefficients:['-1','-2','1'],comparator:'<',integerPoints:true});
  assert.deepEqual(ends(surd),['INTERVAL',['1-sqrt(2)','OPEN'],['1+sqrt(2)','OPEN']]);
  assert.deepEqual(surd.integers,['0','1','2']);
  // a negative squared coefficient flips the comparator: 8k-3k^2<0 with k>0 -> k>8/3
  const ray=solveQuadraticInequality({coefficients:['0','8','-3'],comparator:'<',variable:'k',domain:{kind:'INTERVAL',range:['0',null],states:['OPEN','OPEN']}});
  assert.deepEqual(ends(ray),['INTERVAL',['8/3','OPEN'],null]);
  assert.equal(ray.lower.tex,'\\frac{8}{3}');
  // the domain closes an end: x^2+4x+3<0 with x>=-2 -> -2<=x<-1
  assert.deepEqual(ends(solveQuadraticInequality({coefficients:['3','4','1'],comparator:'<',domain:{kind:'INTERVAL',range:['-2',null],states:['CLOSED','OPEN']}})),['INTERVAL',['-2','CLOSED'],['-1','OPEN']]);
  assert.deepEqual(ends(solveQuadraticInequality({coefficients:['1','-2','1'],comparator:'<='})),['POINT',['1','CLOSED'],null]);
  assert.deepEqual(ends(solveQuadraticInequality({coefficients:['1','0','1'],comparator:'>'})),['ALL_REALS',null,null]);
  // two rays joined by the double root they leave out: x^2-2x+1>0 plus x=1 -> all reals
  assert.equal(solveQuadraticInequality({coefficients:['1','-2','1'],comparator:'>',adjoinedPoints:['1']}).kind,'ALL_REALS');
  assert.deepEqual(solveQuadraticInequality({coefficients:['-2','0','1'],comparator:'>',domain:{kind:'INTERVAL',range:['0',null],states:['CLOSED','OPEN']},integerPoints:{range:['0','5']}}).integers,['2','3','4','5']);
});

test('sets that are not one interval, and malformed inequalities, are refused with their codes',()=>{
  assert.throws(()=>solveQuadraticInequality({coefficients:['1','0','1'],comparator:'<'}),code('INEQUALITY_SOLUTION_EMPTY'));
  assert.throws(()=>solveQuadraticInequality({coefficients:['-6','1','1'],comparator:'>'}),code('INEQUALITY_SOLUTION_NOT_ONE_INTERVAL'));
  assert.throws(()=>solveQuadraticInequality({...q11,adjoinedPoints:['7']}),code('INEQUALITY_ADJOINED_POINT_NOT_ADJACENT'));
  assert.throws(()=>solveQuadraticInequality({...q11,domain:{kind:'INTERVAL',range:['0',null],states:['OPEN','OPEN']}}),code('INEQUALITY_ADJOINED_POINT_OUTSIDE_DOMAIN'));
  assert.throws(()=>solveQuadraticInequality({coefficients:['0','8','-3'],comparator:'<',domain:{kind:'INTERVAL',range:['0',null],states:['OPEN','OPEN']},integerPoints:true}),code('INEQUALITY_INTEGER_POINTS_NEED_RANGE'));
  assert.throws(()=>solveQuadraticInequality({coefficients:['-1000','0','1'],comparator:'<',integerPoints:true}),code('INEQUALITY_TOO_MANY_INTEGER_POINTS'));
  assert.throws(()=>solveQuadraticInequality({coefficients:['1','2','0'],comparator:'<'}),code('INEQUALITY_NOT_QUADRATIC'));
  assert.throws(()=>solveQuadraticInequality({...q11,comparator:'=<'}),code('INVALID_INEQUALITY_COMPARATOR'));
  assert.throws(()=>solveQuadraticInequality({...q11,variable:'y'}),code('INVALID_AXIS_VARIABLE'));
  assert.throws(()=>solveQuadraticInequality({...q11,coefficients:['-15','-2.5','1']}),code('INVALID_INEQUALITY_COEFFICIENT'));
  assert.throws(()=>solveQuadraticInequality({...q11,endpoints:['-3','5']}),code('INEQUALITY_PLAN_INVALID'));
});

test('exact values are written stacked (TeX) and in the exactValue grammar, never with a slash in TeX',()=>{
  const m=solveQuadraticInequality({coefficients:['-1','2','4'],comparator:'<'});// 4x^2+2x-1<0 -> (-1-sqrt5)/4<x<(-1+sqrt5)/4
  assert.deepEqual([m.lower.value,m.lower.tex],['(-1-sqrt(5))/4','-\\frac{1+\\sqrt{5}}{4}']);
  assert.deepEqual([m.upper.value,m.upper.tex],['(-1+sqrt(5))/4','\\frac{-1+\\sqrt{5}}{4}']);
  const half=solveQuadraticInequality({coefficients:['-1','0','4'],comparator:'<='});
  assert.deepEqual([half.lower.tex,half.upper.tex],['-\\frac{1}{2}','\\frac{1}{2}']);
  assert.ok([m,half].every(model=>[model.lower.tex,model.upper.tex].every(tex=>!tex.includes('/'))));
});

test('the chain expands to a graph panel in the solution variable over a number-line panel',()=>{
  const composite=expandInequalityChain(chain(q11));
  assert.equal(composite.capability,'composite-panels-v1');
  const [graph,line]=composite.panels;
  assert.deepEqual(graph.plan.graphPlan.coefficients,['-15','-2','1']);
  assert.equal(graph.plan.graphPlan.axisVariable,'a');
  assert.deepEqual(graph.plan.graphPlan.requiredPoints,[{id:'A',x:-3,y:0},{id:'B',x:5,y:0},{id:'V',x:1,y:-16}]);
  assert.deepEqual(line.plan,{capability:'number-line-v1',numberLine:q11});
  const surd=expandInequalityChain(chain({coefficients:['-1','-2','1'],comparator:'<'})).panels[0].plan.graphPlan;
  assert.deepEqual(surd.exactCoordinates,{A:['1-sqrt(2)','0'],B:['1+sqrt(2)','0']});
  assert.equal(surd.axisVariable,undefined);
  // a finite domain becomes the graph's source interval and keeps only the key points it holds
  const finite=expandInequalityChain(chain({coefficients:['-15','-2','1'],comparator:'<',variable:'a',domain:{kind:'INTERVAL',range:['0','6'],states:['CLOSED','CLOSED']}})).panels[0].plan.graphPlan;
  assert.deepEqual(finite.sourceDomain,{kind:'INTERVAL',range:['0','6'],states:['CLOSED','CLOSED']});
  assert.deepEqual(finite.requiredPoints.map(point=>point.id),['B','V']);
  assert.throws(()=>expandInequalityChain(chain({coefficients:['-6','1','1'],comparator:'>'})),code('INEQUALITY_SOLUTION_NOT_ONE_INTERVAL'));
  assert.throws(()=>expandInequalityChain({...chain(q11),graphCaption:{math:'y=D/4'}}),code('CHAIN_CAPTION_INVALID'));
  assert.throws(()=>expandInequalityChain({...chain(q11),panels:[]}),code('CHAIN_PLAN_INVALID'));
  // compositePanels accepts the number line only as the last of two panels
  assert.equal(compositePanels(composite)[1].plan.capability,'number-line-v1');
  assert.throws(()=>compositePanels({...composite,panels:[composite.panels[1],composite.panels[0]]}),error=>error.detail?.reason==='NUMBER_LINE_PANEL_PLACEMENT_0');
});

test('the number-line spec: ends, band, the 0 tick only clear of every end, integer labels ALL or ENDS',()=>{
  const plan={capability:'number-line-v1',numberLine:q11},model=solveQuadraticInequality(q11),spec=numberLineSpec(plan,model);
  assert.deepEqual(spec.size,numberLinePanelSize(model));
  assert.ok(Number.isInteger(spec.size.height));
  assert.deepEqual(spec.dots.filter(dot=>dot.role==='endpoint').map(dot=>[dot.id,dot.state]),[['endpoint-lower','CLOSED'],['endpoint-upper','OPEN']]);
  assert.deepEqual([spec.band.x1,spec.band.x2],[spec.dots[0].x,spec.dots[1].x]);
  assert.deepEqual(spec.ticks.map(tick=>tick.value),['0']);
  assert.equal(spec.integerLabels,'ALL');
  assert.equal(spec.labels.find(label=>label.role==='header').tex,'\\displaystyle -3\\le a<5');
  const many={coefficients:['17','-18','1'],comparator:'<',variable:'k',integerPoints:true},manySpec=numberLineSpec({capability:'number-line-v1',numberLine:many},solveQuadraticInequality(many));
  assert.equal(manySpec.integerLabels,'ENDS');
  assert.deepEqual(manySpec.labels.filter(label=>label.role==='integer').map(label=>label.value),['2','16']);
  assert.equal(manySpec.dots.filter(dot=>dot.role==='integer').length,15);
  const ray={coefficients:['0','8','-3'],comparator:'<',variable:'k',domain:{kind:'INTERVAL',range:['0',null],states:['OPEN','OPEN']}},raySpec=numberLineSpec({capability:'number-line-v1',numberLine:ray},solveQuadraticInequality(ray));
  assert.equal(raySpec.band.to,'+oo');assert.equal(raySpec.band.x2,raySpec.axis.x2-2);
  assert.throws(()=>numberLineSpec(plan,{...model,integers:['0']}),code('NUMBER_LINE_MODEL_MISMATCH'));
});

test('the number-line panel composes, and the independent observer catches a wrong end, dot, band or header',async()=>{
  const plan={capability:'number-line-v1',numberLine:q11},model=solveQuadraticInequality(q11);
  const identity=assetIdentity('22_매산고_1학기_기말_고1_기출|11','SOLUTION_VISUAL','decisive-relation');
  const composed=await composeNumberLinePanel({plan,model,identity,typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11}});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
  const audit=async(svg,numberLine=q11)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
  const pass=await audit(composed.svg);
  assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  assert.deepEqual(pass.observed.integers,['-3','-2','-1','0','1','2','3','4']);
  const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
  // the closed end drawn hollow
  assert.ok(has(await audit(composed.svg.replace(/(id="endpoint-lower"[^>]*?)fill="#111"/,'$1fill="#fff"')),'NL_ENDPOINT_STATE:endpoint-lower'));
  // an integer dot moved, and one taken away
  assert.ok(has(await audit(composed.svg.replace(/(id="integer-2"[^>]*?cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+9))),'NL_INTEGER_POSITION:2'));
  assert.ok(has(await audit(composed.svg.replace(/<g data-layer="70"><circle id="integer-4"[^>]*\/><\/g>/,'')),'NL_INTEGER_POINTS_MISMATCH'));
  // the band stopping short, and a header that claims a different interval
  assert.ok(has(await audit(composed.svg.replace(/(id="solution-band"[^>]*?x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)-20))),'NL_BAND_UPPER_EXTENT'));
  assert.ok(has(await audit(composed.svg.replace('data-tex="\\displaystyle -3\\le a&lt;5"','data-tex="\\displaystyle -3&lt;a&lt;5"')),'NL_HEADER_MISMATCH'));
  // the same drawing checked against another inequality (a<=5): the observer solves it itself
  assert.ok(has(await audit(composed.svg,{...q11,comparator:'<='}),'NL_ENDPOINT_STATE:endpoint-upper'));
});
