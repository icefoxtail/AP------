// Chrome-using (composes number-line figure panels): run with --test-concurrency=1.
// number-line-figure-v1 (E35): value-free letter points (a, -a, n) placed by constraints (between, mirrorOf, order) and the TICK point style. The engine reasons over the
// constraints exactly and draws the points where they hold, writing no value for them; the independent observer reads the places back from the SVG and checks the constraints.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure,figureLayout} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const compose=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:assetIdentity(`symbols-${tag}|1`,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const clone=value=>JSON.parse(JSON.stringify(value));
const N=(id,value,more)=>({id,value,...(more||{})});
const row=(points,extra={})=>({kind:'POINTS',points,...extra});
const placeOf=(model,id)=>{const point=model.rows[0].points.find(p=>p.id===id);const [n,d='1']=point.place.split('/');return Number(n)/Number(d);};

// 25 동산중 2학기 중간 중1 q13: two numbers of equal absolute value and opposite signs; the distance between their points is 10 (the numbers are not written).
const q13={axisVariable:false,rows:[row([{id:'-a',mirrorOf:'a'},N('O','0',{hideName:true}),{id:'a'}],{band:false,order:['-a','O','a'],spans:[{from:'-a',to:'a',label:'10'}]})]};
// 25 왕운중 1학기 중간 중2 q20: x=-2..2, the solutions -2,-1,0 filled and 1,2 hollow, the unknown n between 0 and 1 marked by a tick
const q20={rows:[row([N('A','-2',{hideName:true}),N('B','-1',{hideName:true}),N('C','0',{hideName:true}),N('D','1',{hideName:true,style:'HOLLOW'}),N('E','2',{hideName:true,style:'HOLLOW'}),{id:'n',between:['C','D'],style:'TICK'}],{band:false})]};

test('the engine finds places that satisfy the constraints and writes none of them',()=>{
  const m13=solveNumberLineFigure(q13);
  assert.equal(placeOf(m13,'-a'),-placeOf(m13,'a'),'a mirror pair is symmetric about 0');
  assert.ok(placeOf(m13,'-a')<0&&placeOf(m13,'a')>0);
  const letters=m13.rows[0].points.filter(point=>point.symbol);
  assert.deepEqual(letters.map(point=>[point.id,point.tex,point.text,point.hideName,point.hideValue]),[['-a','-a','-a',true,true],['a','a','a',true,true]]);
  assert.ok(letters.every(point=>!('value' in point)),'a letter point has no value');
  assert.deepEqual(m13.rows[0].order,['-a','O','a']);
  const m20=solveNumberLineFigure(q20);
  const n=placeOf(m20,'n');assert.ok(0<n&&n<1,'between 0 and 1');assert.equal(m20.rows[0].points.find(p=>p.id==='n').style,'TICK');
  // between two exact values instead of two points, and letters ordered among drawn points and each other
  const byValue=solveNumberLineFigure({rows:[row([N('A','-2'),N('B','2'),{id:'n',between:['0','1']}])]});assert.ok(placeOf(byValue,'n')>0&&placeOf(byValue,'n')<1);
  const two=solveNumberLineFigure({rows:[row([N('C','0'),N('D','1'),{id:'a',between:['C','D']},{id:'b',between:['C','D']}],{order:['a','b']})]});
  assert.ok(0<placeOf(two,'a')&&placeOf(two,'a')<placeOf(two,'b')&&placeOf(two,'b')<1);
  const chain=solveNumberLineFigure({rows:[row([{id:'a'},{id:'b'},{id:'c'}],{order:['a','b','c']})]});
  assert.ok(placeOf(chain,'a')<placeOf(chain,'b')&&placeOf(chain,'b')<placeOf(chain,'c'));
  // a mirror pair inside drawn bounds: -3 < -a < 0 < a < 1 puts a in (0,1)
  const bounded=solveNumberLineFigure({rows:[row([N('A','-3'),N('B','1'),N('O','0'),{id:'-a',mirrorOf:'a'},{id:'a'}],{order:['A','-a','O','a','B']})]});
  assert.ok(0<placeOf(bounded,'a')&&placeOf(bounded,'a')<1&&placeOf(bounded,'-a')===-placeOf(bounded,'a'));
  // two mirror pairs nest by their order; a far unbounded side steps by the spread of the drawn values
  const nested=solveNumberLineFigure({rows:[row([{id:'-b',mirrorOf:'b'},{id:'-a',mirrorOf:'a'},{id:'a'},{id:'b'},N('O','0')],{order:['-b','-a','O','a','b']})]});
  assert.ok(0<placeOf(nested,'a')&&placeOf(nested,'a')<placeOf(nested,'b'));
  const far=solveNumberLineFigure({rows:[row([N('A','0'),N('B','100'),{id:'n',between:['B','200']}])]});assert.ok(placeOf(far,'n')>100&&placeOf(far,'n')<200);
  // the model of a plan with no letter points has none of the new fields
  const plain=solveNumberLineFigure({rows:[row([N('A','1'),N('B','3')])]});
  assert.ok(plain.rows[0].points.every(point=>!('symbol' in point)&&!('place' in point))&&!('order' in plain.rows[0]));
});

test('the layout keeps a row for the letters under the axis',()=>{
  const plain=figureLayout(solveNumberLineFigure({rows:[row([N('A','1',{hideName:true,showValue:false}),N('B','3',{hideName:true,showValue:false})])]}));
  const letters=figureLayout(solveNumberLineFigure({rows:[row([{id:'a',between:['0','1']},N('A','1',{hideName:true,showValue:false}),N('B','0',{hideName:true,showValue:false})])]}));
  assert.ok(letters.rows[0].belowRow>0&&plain.rows[0].belowRow===0);
});

test('letter points that cannot be drawn faithfully are refused with their codes',()=>{
  const plan=(points,extra={})=>solveNumberLineFigure({rows:[row(points,extra)]});
  const C=N('C','0'),D=N('D','1');
  assert.doesNotThrow(()=>plan([C,D,{id:'n',between:['C','D']}]));
  // the letter point itself: one lowercase letter, optionally with a minus sign; nothing that belongs to a value
  for(const id of ['ab','1','N','-A','--a','a1','-',''])assert.throws(()=>plan([C,{id}]),code('NUMBER_LINE_POINTS_INVALID'),id);
  for(const extra of [{name:'ㄱ'},{hideName:true},{showValue:false},{valueSide:'ABOVE'}])assert.throws(()=>plan([C,{id:'n',between:['0','1'],...extra}]),code('NUMBER_LINE_SYMBOL_INVALID'),JSON.stringify(extra));
  assert.throws(()=>plan([C,{id:'B',value:'1',between:['0','2']}]),code('NUMBER_LINE_SYMBOL_INVALID'),'a numeric point carries no constraints');
  assert.throws(()=>plan([C,{id:'n',value:'1'}]),code('NUMBER_LINE_POINTS_INVALID'),'a letter id is for a point without a value');
  assert.throws(()=>plan([C,{id:'a',value:'1',divides:{from:'C',to:'C',ratio:['1','1']}}]),code('NUMBER_LINE_POINTS_INVALID'));
  assert.throws(()=>plan([N('A','0'),{id:'B'}]),code('NUMBER_LINE_POINTS_INVALID'),'a capital letter needs a value');
  assert.throws(()=>plan([C,D,{id:'n',between:['C','D'],style:'DOT'}]),code('NUMBER_LINE_POINT_STYLE_INVALID'));
  // the constraints: between takes two points of the row or exact values; order lists points of the row; mirrorOf a letter point named a and -a
  for(const between of [['C'],['C','D','E'],'CD',[1,2],['C','C'],['n','D'],['C','x'],['C','1.5']])assert.throws(()=>plan([C,D,{id:'n',between}]),code('NUMBER_LINE_SYMBOL_BETWEEN_INVALID'),JSON.stringify(between));
  for(const order of [['n'],['n','Z'],['n','n'],'n',[1,2],['n','C','n']])assert.throws(()=>plan([C,{id:'n',between:['0','1']}],{order}),code('NUMBER_LINE_SYMBOL_ORDER_INVALID'),JSON.stringify(order));
  assert.throws(()=>plan([C,D],{order:['C','D']}),code('NUMBER_LINE_SYMBOL_ORDER_INVALID'),'order is for rows with a letter point');
  assert.throws(()=>plan([C,{id:'a',mirrorOf:'C'}]),code('NUMBER_LINE_SYMBOL_MIRROR_INVALID'),'the target must be a letter point');
  assert.throws(()=>plan([{id:'a'},{id:'-b',mirrorOf:'a'}],{order:['-b','a']}),code('NUMBER_LINE_SYMBOL_MIRROR_INVALID'),'the names must be x and -x');
  assert.throws(()=>plan([{id:'a',mirrorOf:'-a'},{id:'-a',mirrorOf:'a'}],{order:['-a','a']}),code('NUMBER_LINE_SYMBOL_MIRROR_INVALID'),'a mirror of a mirror');
  assert.throws(()=>plan([{id:'a',mirrorOf:'a'},C]),code('NUMBER_LINE_SYMBOL_MIRROR_INVALID'));
  assert.throws(()=>plan([{id:'-a',mirrorOf:'zz'},{id:'a'}],{order:['-a','a']}),code('NUMBER_LINE_SYMBOL_MIRROR_INVALID'));
  // the constraints must fix the order of every letter point
  assert.throws(()=>plan([C,D,{id:'a',between:['C','D']},{id:'b',between:['C','D']}]),code('NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS'),'a and b may be either way round');
  assert.throws(()=>plan([C,D,{id:'n'}]),code('NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS'),'no constraint at all');
  assert.throws(()=>plan([{id:'-a',mirrorOf:'a'},{id:'a'}]),code('NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS'),'which side of 0 is a?');
  assert.throws(()=>plan([{id:'a'},{id:'b'}]),code('NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS'));
  // contradictions and constraints no drawing can satisfy
  assert.throws(()=>plan([{id:'a',between:['b','c']},{id:'b'},{id:'c'}],{order:['c','b']}),code('NUMBER_LINE_SYMBOL_CONSTRAINT_CONTRADICTORY'));
  assert.throws(()=>plan([N('A','5'),N('B','1'),{id:'n',between:['A','B']}],{order:['A','B']}),code('NUMBER_LINE_SYMBOL_CONSTRAINT_CONTRADICTORY'),'the drawn values say B is left of A');
  assert.throws(()=>plan([C,N('D','1/100'),{id:'n',between:['C','D']}]),code('NUMBER_LINE_SYMBOL_CONSTRAINT_UNSATISFIABLE'),'no room between them');
  // a letter point on a graduated axis, or in a row that classifies against a set, is not supported
  assert.throws(()=>solveNumberLineFigure({rows:[row([C,D,{id:'n',between:['C','D']}],{subdivisions:[{from:'0',to:'1',parts:2}]})]}),code('NUMBER_LINE_SYMBOL_UNSUPPORTED'));
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'SET',pieces:[{lo:{value:'0',state:'OPEN'},hi:{value:'3',state:'OPEN'}}]},row([C,D,{id:'n',between:['C','D']}],{within:1})]}),code('NUMBER_LINE_SYMBOL_UNSUPPORTED'));
  // order, between and mirrorOf have no meaning on rows or points without letters
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'SET',pieces:[{lo:{value:'0',state:'OPEN'},hi:{value:'3',state:'OPEN'}}],order:['A']}]}),code('NUMBER_LINE_ROWS_INVALID'));
});

test('q13 (a and -a, with the distance written) composes; the letters are italic names under the dots, no number stands for them',async()=>{
  const composed=await compose(q13,'q13');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.equal((svg.match(/data-label-role="point-symbol"/g)||[]).length,2);
  assert.match(svg,/data-symbol="-a"/);assert.match(svg,/data-symbol="a"/);
  assert.ok(svg.includes('data-tex="-a"')&&svg.includes('data-tex="a"'),'the names are the letters, in math type');
  assert.ok(!svg.includes('data-tex="A"'),'never an uppercase letter');
  const dots=svg.match(/<circle id="r1-pt-s[^>]*>/g);assert.equal(dots.length,2);
  assert.ok(dots.every(tag=>!/data-value=/.test(tag)),'no value in the markup of a letter dot');
  assert.equal((svg.match(/data-label-role="point-value"/g)||[]).length,1,'only the origin has a value, 0');
  const pass=await audit(svg,q13);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
});

test('q20 (five values with solution and non-solution dots and n marked by a tick between 0 and 1) composes and passes',async()=>{
  const composed=await compose(q20,'q20');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.match(svg,/data-role="tick-mark"/);assert.equal((svg.match(/data-role="tick-mark"/g)||[]).length,1);
  assert.match(svg,/id="r1-pt-sn"[^>]*data-symbol="n"[^>]*data-point-style="TICK"/);
  assert.equal((svg.match(/data-label-role="point-value"/g)||[]).length,5,'the five values are the tick labels');
  assert.ok(svg.includes('data-tex="n"'));
  const pass=await audit(svg,q20);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
});

test('tamper: letter points that break their constraints, show a value or a wrong name make the observer fail',async()=>{
  const {svg}=await compose(q13,'tamper-q13');
  const move=(id,dx)=>svg.replace(new RegExp(`(<circle id="${id}"[^>]*? cx=")([\\d.]+)`),(m,head,x)=>head+(Number(x)+dx));
  // the mirror pair no longer symmetric about 0; a dot moved across the origin (breaks the order too)
  assert.ok(has(await audit(move('r1-pt-sa',9),q13),'NL_SYMBOL_MIRROR'));
  const crossed=await audit(move('r1-pt-sa',-200),q13);assert.ok(has(crossed,'NL_SYMBOL_ORDER')&&has(crossed,'NL_SYMBOL_MIRROR'));
  // a value written for a letter point, a letter point that carries a data-value, a wrong or uppercase name, a missing label
  assert.ok(has(await audit(svg.replace('data-symbol="a"','data-symbol="a" data-value="5"'),q13),'NL_SYMBOL_DOT'));
  assert.ok(has(await audit(svg.replace('data-symbol="a"','data-symbol="b"'),q13),'NL_SYMBOL_DOT'));
  assert.ok(has(await audit(svg.replace(/(id="r1-pt-sa-symbol"[^>]*?data-tex=")a"/,'$1A"'),q13),'NL_SYMBOL_LABEL_TEXT'));
  assert.ok(has(await audit(svg.replace(/(id="r1-pt-sma-symbol"[^>]*?data-label-role=")point-symbol/,'$1point-value'),q13),'NL_SYMBOL_LABEL_COUNT'));
  assert.ok(has(await audit(svg.replace(/(id="r1-pt-sa-symbol"[^>]*?data-label-role=")point-symbol/,'$1point-value'),q13),'NL_SYMBOL_LABEL_COUNT'));
  // the plan changed: the order asks the other way, between asks for the wrong bounds, the mirror is dropped
  const reversed=clone(q13);reversed.rows[0].order=['a','O','-a'];
  assert.ok(has(await audit(svg,reversed),'NL_SYMBOL_ORDER'));
  const mirrorless=clone(q13);delete mirrorless.rows[0].points[0].mirrorOf;
  assert.equal((await audit(svg,mirrorless)).status,'PASS','a symmetric drawing satisfies a plan that asks for less');
  const {svg:svg20}=await compose(q20,'tamper-q20');
  const move20=(id,dx)=>svg20.replace(new RegExp(`(<circle id="${id}"[^>]*? cx=")([\\d.]+)`),(m,head,x)=>head+(Number(x)+dx));
  assert.ok(has(await audit(move20('r1-pt-sn',200),q20),'NL_SYMBOL_BETWEEN'));
  assert.ok(has(await audit(move20('r1-pt-sn',-200),q20),'NL_SYMBOL_BETWEEN'));
  const narrow=clone(q20);narrow.rows[0].points[5].between=['A','B'];
  assert.ok(has(await audit(svg20,narrow),'NL_SYMBOL_BETWEEN'));
  const byValue=clone(q20);byValue.rows[0].points[5].between=['0','1'];
  assert.equal((await audit(svg20,byValue)).status,'PASS');
  // the TICK mark: removed, moved, a plan that asks for a plain dot
  assert.ok(has(await audit(svg20.replace(/<g data-layer="71"><line id="r1-pt-sn-mark"[^>]*\/><\/g>/,''),q20),'NL_POINT_TICK_MARK_COUNT'));
  assert.ok(has(await audit(svg20.replace(/(id="r1-pt-sn-mark"[^>]*?x1=")([\d.]+)/,(m,head,x)=>head+(Number(x)+4)),q20),'NL_POINT_TICK_MARK_GEOMETRY'));
  const plainDot=clone(q20);delete plainDot.rows[0].points[5].style;
  assert.ok(has(await audit(svg20,plainDot),'NL_POINT_STYLE'));
  // a hollow numeric point drawn as a tick, a filled one as hollow
  const wrong=clone(q20);wrong.rows[0].points[3].style='FILLED';
  assert.ok(has(await audit(svg20,wrong),'NL_POINT_'));
});

test('a letter point beside another dot too closely is refused when composing',async()=>{
  // n between 0 and 1 on a line that runs to 100: the places are 2 px apart
  const tight={rows:[row([N('A','0',{hideName:true}),N('B','100',{hideName:true}),{id:'n',between:['A','1']}])]};
  const composed=await compose(tight,'tight');
  assert.equal(composed.status,'NUMBER_LINE_SYMBOL_TOO_CLOSE',JSON.stringify(composed.detail));
});

test('letter points draw beside surd values and a span between them passes the observer',async()=>{
  const mixed={axisVariable:false,rows:[row([N('A','sqrt(2)',{hideName:true}),N('O','0',{hideName:true}),{id:'a',between:['O','A']}],{band:false})]};
  const composed=await compose(mixed,'mixed');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal((await audit(composed.svg,mixed)).status,'PASS');
  const styles=clone(q13);styles.rows[0].points[2].style='HOLLOW';
  const hollow=await compose(styles,'hollow');
  assert.equal(hollow.status,'COMPOSED',JSON.stringify(hollow.detail));
  assert.match(hollow.svg,/id="r1-pt-sa"[^>]*data-point-style="HOLLOW"/);
  assert.equal((await audit(hollow.svg,styles)).status,'PASS');
});
