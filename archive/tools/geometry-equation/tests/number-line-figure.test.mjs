// Chrome-using (composes number-line figure panels): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {compositePanels} from '../production/composite-candidate-svg-v1.mjs';
import {solveNumberLine,numberLineSpec,numberLinePanelSize,composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure,expandNumberLineFigure} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const O=value=>({value,state:'OPEN'}),C=value=>({value,state:'CLOSED'}),P=(mul,add,state)=>({param:{mul,add},state});
const set=(...pieces)=>({kind:'SET',pieces});
const piece=(lo,hi)=>({lo,hi});
const code=expected=>error=>error.message===expected;
const sets=model=>model.rows.map(row=>row.kind==='POINTS'?row.points.map(point=>point.value):row.pieces.map(p=>[p.lower&&[p.lower.value,p.lower.state],p.upper&&[p.upper.value,p.upper.state]]));
// 25 매산여고 1학기 기말 고1 16: x^2-x-2>0 (x<-1 or x>2) with 3x^2-2(2a-2)x+a^2-4<0 (a-2<x<(a+2)/3), drawn at a=-1.
const p275={parameter:{name:'a',value:'-1'},rows:[set(piece(null,O('-1')),piece(O('2'),null)),set(piece(P('1','-2','OPEN'),P('1/3','2/3','OPEN'))),{kind:'RESULT',integerPoints:true}]};
// 21 강남여고 1학기 기말 고1 10 at a=2: {x<-1 or x>2} intersect [a,4] = (2,4]
const p231={parameter:{name:'a',value:'2'},rows:[set(piece(null,O('-1')),piece(O('2'),null)),set(piece(P('1','0','CLOSED'),C('4'))),{kind:'RESULT'}]};
// internal division: A(-2), B(4), P divides AB internally 1:2 -> P=0
const division={rows:[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'},{id:'P',divides:{from:'A',to:'B',ratio:['1','2']}}]}]};
const figure=numberLine=>({capability:'number-line-figure-v1',numberLine,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'numberLine.rows'}],newVisualInformation:['n']});

test('the engine intersects the rows exactly, with parameter ends taken at the stated sample value',()=>{
  const m=solveNumberLineFigure(p275);
  assert.deepEqual(sets(m)[2],[[['-3','OPEN'],['-1','OPEN']]]);
  assert.deepEqual(m.rows[2].integers,['-2']);
  assert.equal(m.rows[1].pieces[0].lower.tex,'a-2');assert.equal(m.rows[1].pieces[0].upper.tex,'\\frac{a+2}{3}');
  assert.deepEqual(m.rows[1].pieces[0].upper.expr,{mul:'1/3',add:'2/3'});
  assert.deepEqual(sets(solveNumberLineFigure(p231))[2],[[['2','OPEN'],['4','CLOSED']]]);
  // rays, a closed end meeting an open one, integers of a bounded result: x^2-4x>0 with (x-1)(x-6)<0 -> 4<x<6 -> {5}
  const m3=solveNumberLineFigure({parameter:{name:'a',value:'6'},rows:[set(piece(null,O('0')),piece(O('4'),null)),set(piece(O('1'),P('1','0','OPEN'))),{kind:'RESULT',integerPoints:true}]});
  assert.deepEqual(m3.rows[2].integers,['5']);
  // x<3 and x>(a+2)/3 at a=-12: (-10/3,3), integers -3..2
  const m5=solveNumberLineFigure({parameter:{name:'a',value:'-12'},rows:[set(piece(null,O('3'))),set(piece(P('1/3','2/3','OPEN'),null)),{kind:'RESULT',integerPoints:true}]});
  assert.deepEqual(m5.rows[2].integers,['-3','-2','-1','0','1','2']);
  assert.equal(m5.rows[2].pieces[0].lower.value,'-10/3');
  // equal ends: the closed one gives way to the open one
  assert.deepEqual(sets(solveNumberLineFigure({rows:[set(piece(C('1'),C('5'))),set(piece(O('1'),C('3'))),{kind:'RESULT'}]}))[2],[[['1','OPEN'],['3','CLOSED']]]);
  // an internal division point: P=(nA+mB)/(m+n)
  const d=solveNumberLineFigure(division);
  assert.deepEqual(d.rows[0].points.map(point=>[point.id,point.value]),[['A','-2'],['B','4'],['P','0']]);
  assert.equal(solveNumberLine(division).schemaVersion,d.schemaVersion);
  const d2=solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'1'},{id:'B',value:'4'},{id:'P',divides:{from:'A',to:'B',ratio:['2','3']}}]}]});
  assert.equal(d2.rows[0].points[2].value,'11/5');assert.equal(d2.rows[0].points[2].tex,'\\frac{11}{5}');
});

test('figures that cannot be drawn faithfully are refused with their codes',()=>{
  const row=(...p)=>set(...p),ray=piece(null,O('0'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(O('0'),O('1'))),row(piece(O('2'),O('3'))),{kind:'RESULT'}]}),code('NUMBER_LINE_RESULT_EMPTY'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(O('0'),O('4'))),{kind:'RESULT'}]}),code('NUMBER_LINE_RESULT_NEEDS_TWO_SETS'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(O('2'),O('1')))]}),code('NUMBER_LINE_PIECE_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(C('2'),C('2')))]}),code('NUMBER_LINE_PIECE_IS_A_POINT'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(null,null))]}),code('NUMBER_LINE_PIECE_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(null,O('3')),piece(O('1'),null))]}),code('NUMBER_LINE_PIECES_OVERLAP'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(null,C('1')),piece(O('1'),null))]}),code('NUMBER_LINE_PIECES_TOUCH'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(O('1'),P('1','0','OPEN')))]}),code('NUMBER_LINE_PARAMETER_MISSING'));
  assert.throws(()=>solveNumberLineFigure({parameter:{name:'a',value:'1'},rows:[row(piece(O('0'),O('1')))]}),code('NUMBER_LINE_PARAMETER_UNUSED'));
  assert.throws(()=>solveNumberLineFigure({parameter:{name:'x',value:'1'},rows:[row(piece(O('0'),P('1','0','OPEN')))]}),code('NUMBER_LINE_PARAMETER_INVALID'));
  assert.throws(()=>solveNumberLineFigure({parameter:{name:'a',value:'1'},rows:[row(piece(O('0'),P('0','3','OPEN')))]}),code('NUMBER_LINE_PARAMETER_COEFFICIENT_ZERO'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(O('0.5'),O('1')))]}),code('NUMBER_LINE_VALUE_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(O('0'),null)),{kind:'RESULT',integerPoints:true},row(piece(O('0'),null))]}),code('NUMBER_LINE_RESULT_NOT_LAST'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(piece(O('0'),null)),row(piece(O('1'),null)),{kind:'RESULT',integerPoints:true}]}),code('NUMBER_LINE_INTEGER_POINTS_NEED_RANGE'));
  assert.throws(()=>solveNumberLineFigure({rows:[{...row(piece(O('0'),C('900'))),integerPoints:true}]}),code('NUMBER_LINE_TOO_MANY_INTEGER_POINTS'));
  assert.throws(()=>solveNumberLineFigure({rows:[row(ray)],extra:1}),code('NUMBER_LINE_FIGURE_PLAN_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[]}),code('NUMBER_LINE_ROWS_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'1'},{id:'B',value:'1'}]}]}),code('NUMBER_LINE_POINTS_COINCIDE'));
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'1'},{id:'P',divides:{from:'A',to:'Q',ratio:['1','2']}}]}]}),code('NUMBER_LINE_DIVISION_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'1'},{id:'B',value:'3'},{id:'P',divides:{from:'A',to:'B',ratio:['0','2']}}]}]}),code('NUMBER_LINE_DIVISION_INVALID'));
});

test('the figure expands to a one-panel composite; a quadratic-inequality number line still dispatches to its own solver',()=>{
  const composite=expandNumberLineFigure({...figure(p275),numberLineCaption:{text:'공통 범위'}});
  assert.equal(composite.capability,'composite-panels-v1');
  const [panel]=compositePanels(composite);
  assert.deepEqual(panel.plan,{capability:'number-line-v1',numberLine:p275});
  assert.throws(()=>expandNumberLineFigure({...figure(p275),panels:[]}),code('NUMBER_LINE_FIGURE_PLAN_INVALID'));
  assert.throws(()=>expandNumberLineFigure({...figure({rows:[]})}),code('NUMBER_LINE_ROWS_INVALID'));
  assert.throws(()=>compositePanels({...composite,chain:undefined}),error=>error.detail?.reason==='PANELS');
  assert.equal(solveNumberLine({coefficients:['-15','-2','1'],comparator:'<'}).kind,'INTERVAL');
});

test('the figure spec: one shared scale, a row per set, labels for every end and integer',()=>{
  const model=solveNumberLineFigure(p275),spec=numberLineSpec({capability:'number-line-v1',numberLine:p275},model);
  assert.deepEqual(spec.size,numberLinePanelSize(model));assert.ok(Number.isInteger(spec.size.height));
  assert.equal(spec.rows.length,3);
  assert.deepEqual(spec.rows[2].dots.filter(dot=>dot.role==='endpoint').map(dot=>[dot.id,dot.value,dot.state]),[['r3-end-1-lo','-3','OPEN'],['r3-end-1-hi','-1','OPEN']]);
  assert.deepEqual(spec.rows[2].dots.filter(dot=>dot.role==='integer').map(dot=>dot.value),['-2']);
  // the same value sits at the same x in every row (one scale)
  assert.equal(spec.rows[0].dots.find(dot=>dot.value==='-1').x,spec.rows[2].dots.find(dot=>dot.value==='-1').x);
  assert.ok(spec.labels.some(label=>label.role==='note'&&label.plain==='a=-1'));
  assert.deepEqual(spec.labels.filter(label=>label.role==='set').map(label=>label.plain),['x<-1','x>2','a-2<x<(a+2)/3','a-2<x<-1']);
  assert.ok(spec.labels.every(label=>label.kind!=='MATH'||!label.tex.includes('/')));
  assert.throws(()=>numberLineSpec({capability:'number-line-v1',numberLine:p275},{...model,variable:'y'}),code('NUMBER_LINE_MODEL_MISMATCH'));
});

test('the figure composes, and the independent observer catches a wrong dot, band, label or integer',async()=>{
  const plan={capability:'number-line-v1',numberLine:p275},model=solveNumberLineFigure(p275);
  const identity=assetIdentity('25_매산여고_1학기_기말_고1_기출c|16','SOLUTION_VISUAL','decisive-relation');
  const composed=await composeNumberLinePanel({plan,model,identity,typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11}});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
  const audit=async(svg,numberLine=p275)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
  const pass=await audit(composed.svg);
  assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  assert.deepEqual(pass.observed.rows[2].integers,['-2']);
  const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
  // a hollow end drawn filled; a dot moved; the band stopping short; an integer dot moved or removed
  assert.ok(has(await audit(composed.svg.replace(/(id="r3-end-1-hi"[^>]*?)fill="#fff"/,'$1fill="#111"')),'NL_ENDPOINT_STATE:r3-end-1-hi'));
  assert.ok(has(await audit(composed.svg.replace(/(id="r2-end-1-lo"[^>]*?cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+7))),'NL_ENDPOINT_POSITION:r2-end-1-lo'));
  assert.ok(has(await audit(composed.svg.replace(/(id="r3-band-1"[^>]*?x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)-15))),'NL_BAND_UPPER_EXTENT'));
  assert.ok(has(await audit(composed.svg.replace(/(id="r3-int-m2"[^>]*?cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+9))),'NL_INTEGER_POSITION:-2'));
  assert.ok(has(await audit(composed.svg.replace(/<g data-layer="70"><circle id="r3-int-m2"[^>]*\/><\/g>/,'')),'NL_INTEGER_POINTS_MISMATCH'));
  // a label that reads another number or another relation than the set
  assert.ok(has(await audit(composed.svg.replace('data-tex="\\displaystyle a-2&lt;x&lt;\\frac{a+2}{3}"','data-tex="\\displaystyle a-2&lt;x&lt;\\frac{a+3}{3}"')),'NL_SET_LABEL_MISMATCH'));
  assert.ok(has(await audit(composed.svg.replace('data-tex="\\displaystyle x&gt;2"','data-tex="\\displaystyle x\\ge 2"')),'NL_SET_LABEL_MISMATCH'));
  // the same drawing checked against other inputs: the observer solves them itself
  assert.ok(has(await audit(composed.svg,{...p275,parameter:{name:'a',value:'0'}}),'NL_'));
  assert.ok(has(await audit(composed.svg,{...p275,rows:[p275.rows[0],set(piece(P('1','-2','CLOSED'),P('1/3','2/3','OPEN'))),p275.rows[2]]}),'NL_ENDPOINT_STATE'));
});

test('a parameter end is written with the parameter and a constant one without; a value-only plan has no note',async()=>{
  const identity=assetIdentity('21_강남여고_1학기_기말_고1_기출|10','SOLUTION_VISUAL','decisive-relation');
  const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
  const plan={capability:'number-line-v1',numberLine:p231},model=solveNumberLineFigure(p231);
  const composed=await composeNumberLinePanel({plan,model,identity,typographyPolicy:policy});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
  assert.equal((await audit(composed.svg,p231)).status,'PASS');
  // the end the plan makes depend on a, rewritten as the constant 2 in its label, is caught
  const constant=composed.svg.replace(/(id="r2-end-1-lo-label"[^>]*?data-tex=")[^"]*"/,'$1\\displaystyle 2"');
  assert.notEqual(constant,composed.svg);
  assert.ok((await audit(constant,p231)).errors.some(error=>error.startsWith('NL_ENDPOINT_PARAMETER_TEXT')));
  // two value rows, no parameter: no note
  const plain={rows:[set(piece(O('-4'),O('3'))),set(piece(C('-3'),O('4'))),{kind:'RESULT'}]};
  const plainComposed=await composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine:plain},model:solveNumberLineFigure(plain),identity,typographyPolicy:policy});
  assert.equal(plainComposed.status,'COMPOSED',JSON.stringify(plainComposed.detail));
  assert.ok(!plainComposed.svg.includes('data-label-role="note"'));
  assert.equal((await audit(plainComposed.svg,plain)).status,'PASS');
});

test('an internal division point is drawn on the number line and the observer recomputes it',async()=>{
  const identity=assetIdentity('division-fixture|1','SOLUTION_VISUAL','decisive-relation');
  const plan={capability:'number-line-v1',numberLine:division},model=solveNumberLineFigure(division);
  const composed=await composeNumberLinePanel({plan,model,identity,typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11}});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const audit=async(svg,numberLine=division)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
  const pass=await audit(composed.svg);
  assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
  // the observer divides itself: the same drawing against ratio 2:1 puts P elsewhere
  const other={rows:[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'},{id:'P',divides:{from:'A',to:'B',ratio:['2','1']}}]}]};
  assert.ok(has(await audit(composed.svg,other),'NL_POINT_POSITION:P'));
  assert.ok(has(await audit(composed.svg.replace(/(id="r1-pt-P"[^>]*?cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+10))),'NL_POINT_POSITION:P'));
  assert.ok(has(await audit(composed.svg.replace(/(id="r1-ratio-P-first"[^>]*?data-tex=")1"/,'$12"')),'NL_RATIO_VALUE'));
});

test('labels that do not fit are refused with their codes, never squeezed',async()=>{
  const identity=assetIdentity('crowd-fixture|1','SOLUTION_VISUAL','decisive-relation');
  const crowded={parameter:{name:'a',value:'1'},rows:[set(piece(P('1','0','OPEN'),P('1','1/10','OPEN')))]};
  const composed=await composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine:crowded},model:solveNumberLineFigure(crowded),identity,typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11}});
  assert.equal(composed.status,'NUMBER_LINE_LABELS_TOO_CLOSE');
});
