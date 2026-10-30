// Chrome-using (composes number-line figure panels): run with --test-concurrency=1.
// number-line-figure-v1 (E30): a short label at the left of every row, point styles FILLED / HOLLOW / CROSS, and `within`: each point of a POINTS row classified
// exactly against the set of an earlier row (inside: filled and ringed, outside: crossed). The independent observer recomputes all of it from the plan.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const open=value=>({value,state:'OPEN'});
const set=(lo,hi,extra={})=>({kind:'SET',pieces:[{lo:open(lo),hi:open(hi)}],...extra});
const pts=(list,extra={})=>({kind:'POINTS',band:false,points:list.map(([id,value,more])=>({id,value,hideName:true,...(more||{})})),...extra});
// 23 금당중 2학기 중간 중1 q11: 3<x<13; the offered lengths 5, 9, 11 can be a side (inside), 3 and 15 cannot (3 is an open end, 15 is past the other).
const q11={rows:[set('3','13'),pts([['A','5'],['B','9'],['C','11']],{within:1,label:'가능'}),pts([['D','3'],['E','15']],{within:1,label:'불가능'})]};
const compose=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:assetIdentity(`rowlabels-${tag}|1`,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const rowsWith=(change)=>({rows:change(JSON.parse(JSON.stringify(q11.rows)))});

test('the engine solves the labels, styles and the within classification exactly',()=>{
  const m=solveNumberLineFigure(q11);
  assert.deepEqual(m.rows.map(row=>row.label),[undefined,'가능','불가능']);
  assert.deepEqual(m.rows[1].points.map(point=>[point.id,point.style,point.ring]),[['A',undefined,true],['B',undefined,true],['C',undefined,true]]);   // inside: filled (the default) and ringed
  assert.deepEqual(m.rows[2].points.map(point=>[point.id,point.style,point.ring]),[['D','CROSS',undefined],['E','CROSS',undefined]]);                      // outside, an open end counts as outside
  assert.equal(m.rows[1].within,1);
  // a closed end counts as inside; an explicit style wins over the default; a plan with none of the new fields has none of them in its model
  const closed=solveNumberLineFigure({rows:[{kind:'SET',pieces:[{lo:{value:'3',state:'CLOSED'},hi:open('13')}]},pts([['A','3'],['B','13'],['C','5',{style:'HOLLOW'}]],{within:1})]});
  assert.deepEqual(closed.rows[1].points.map(point=>[point.style,point.ring]),[[undefined,true],['CROSS',undefined],['HOLLOW',true]]);
  const old=solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'}]}]});
  assert.ok(old.rows[0].points.every(point=>!('style' in point)&&!('ring' in point))&&!('label' in old.rows[0])&&!('within' in old.rows[0]));
  // a SET row and a RESULT row take labels too
  const twoSets=solveNumberLineFigure({rows:[set('0','5',{label:'가'}),set('3','9',{label:'나'}),{kind:'RESULT',label:'공통'}]});
  assert.deepEqual(twoSets.rows.map(row=>row.label),['가','나','공통']);
});

test('plans that cannot be drawn faithfully are refused with their codes',()=>{
  const labelled=label=>solveNumberLineFigure({rows:[set('0','5',{label})]});
  assert.doesNotThrow(()=>labelled('가능'));assert.doesNotThrow(()=>labelled('abcdef'));
  for(const bad of ['','  ',' 가능','가능 ','일곱글자가나다','a<b','a&b','a"b','a\\b','a$b','가\n능',7,null])assert.throws(()=>labelled(bad),code('NUMBER_LINE_ROW_LABEL_INVALID'),JSON.stringify(bad));
  const styled=style=>solveNumberLineFigure({rows:[pts([['A','1',{style}],['B','2']])]});
  for(const good of ['FILLED','HOLLOW','CROSS'])assert.doesNotThrow(()=>styled(good));
  for(const bad of ['OPEN','filled','',1,null,true])assert.throws(()=>styled(bad),code('NUMBER_LINE_POINT_STYLE_INVALID'),JSON.stringify(bad));
  const within=(value,rows)=>solveNumberLineFigure({rows:rows.map(row=>row.kind==='POINTS'?{...row,within:value}:row)});
  const base=[set('3','13'),pts([['A','5'],['B','9']])];
  assert.doesNotThrow(()=>within(1,base));
  for(const bad of [0,2,3,-1,1.5,'1',true,null])assert.throws(()=>within(bad,base),code('NUMBER_LINE_WITHIN_INVALID'),JSON.stringify(bad));
  // within must name an earlier SET or RESULT row: a POINTS row, a later row and the row itself are refused
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','5'],['B','9']]),set('3','13'),pts([['C','5'],['D','9']],{within:1})]}),code('NUMBER_LINE_WITHIN_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','5'],['B','9']],{within:2}),set('3','13')]}),code('NUMBER_LINE_WITHIN_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[set('3','13',{within:1})]}),code('NUMBER_LINE_ROWS_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[set('3','13'),{kind:'RESULT',within:1}]}),code('NUMBER_LINE_ROWS_INVALID'));
});

test('a figure with row labels, crosses and rings composes; the observer recomputes every one from the plan',async()=>{
  const composed=await compose(q11,'q11');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.equal((svg.match(/data-label-role="row-label"/g)||[]).length,2);
  assert.ok(svg.includes('data-text="가능"')&&svg.includes('data-text="불가능"'));
  assert.equal((svg.match(/data-role="point-ring"/g)||[]).length,3,'one ring per point inside the set');
  assert.equal((svg.match(/data-point-style="CROSS"/g)||[]).length,2);assert.equal((svg.match(/data-role="cross"/g)||[]).length,4,'two strokes per crossed point');
  const pass=await audit(svg,q11);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // the axes of every row start to the right of the label column: the labelled figure has a narrower map than an unlabelled one
  const bare=await compose({rows:q11.rows.map(row=>{const {label,...rest}=row;return rest;})},'q11bare');
  assert.equal(bare.status,'COMPOSED',JSON.stringify(bare.detail));
  const mapLeft=text=>Number(/data-px-left="([\d.]+)"/.exec(text)[1]);
  assert.ok(mapLeft(svg)>mapLeft(bare.svg)+20);
});

test('tamper: a wrong or moved row label, a wrong point style, a missing or extra ring and a changed cross make the observer fail',async()=>{
  const {svg}=await compose(q11,'q11t');
  // the row label
  assert.ok(has(await audit(svg.replace('data-text="가능"','data-text="가눙"'),q11),'NL_ROW_LABEL_TEXT'));
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[1].label='가';return rows;})),'NL_ROW_LABEL_TEXT'));
  assert.ok(has(await audit(svg,rowsWith(rows=>{delete rows[1].label;return rows;})),'NL_ROW_LABEL_UNEXPECTED'));
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[0].label='범위';return rows;})),'NL_ROW_LABEL_COUNT'));
  assert.ok(has(await audit(svg.replace(/(id="r2-row-label"[^>]*?transform="translate\()([\d.]+) ([\d.]+)/,(m,head,x,y)=>head+x+' '+(Number(y)+15)),q11),'NL_ROW_LABEL_NOT_ON_AXIS'));
  assert.ok(has(await audit(svg.replace(/(id="r2-row-label"[^>]*?transform="translate\()([\d.]+)/,(m,head,x)=>head+(Number(x)+90)),q11),'NL_ROW_LABEL_NOT_LEFT_OF_AXIS'));
  // the point styles: a filled point where the plan says outside, a hollow one, a stray ring, a missing ring, a missing or moved cross stroke
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[2].points[0].style='FILLED';return rows;})),'NL_POINT_NOT_FILLED'));
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[2].points[0].style='HOLLOW';return rows;})),'NL_POINT_STYLE'));
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[1].points[0].style='CROSS';return rows;})),'NL_POINT_STYLE'));
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[1].within=undefined;delete rows[1].within;return rows;})),'NL_POINT_RING_UNEXPECTED'));
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[2].points=[{id:'D',value:'5',hideName:true},{id:'E',value:'15',hideName:true}];return rows;})),'NL_POINT_'));   // 5 is inside: it must be filled and ringed
  assert.ok(has(await audit(svg.replace(/<g data-layer="68"><circle id="r2-pt-A-ring"[^>]*\/><\/g>/,''),q11),'NL_POINT_RING:A'));
  assert.ok(has(await audit(svg.replace(/<g data-layer="71"><line id="r3-pt-D-cross-2"[^>]*\/><\/g>/,''),q11),'NL_POINT_CROSS_STROKES:D'));
  assert.ok(has(await audit(svg.replace(/(id="r3-pt-D-cross-1"[^>]*?x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)+3)),q11),'NL_POINT_CROSS_GEOMETRY:D'));
  assert.ok(has(await audit(svg.replace(/(id="r2-pt-B-ring"[^>]*?r=")([\d.]+)/,'$110'),q11),'NL_POINT_RING:B'));
  // within is exact: moving the set's end across a point changes what is inside
  assert.ok(has(await audit(svg,rowsWith(rows=>{rows[0].pieces[0].hi=open('10');return rows;})),'NL_POINT_'));
});

test('a plan without the new fields draws exactly as before; HOLLOW points keep the open-end look',async()=>{
  const plain={rows:[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'}]}]};
  const composed=await compose(plain,'plain');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(!/data-point-style|data-role="point-ring"|data-role="cross"|row-label/.test(composed.svg));
  assert.equal((await audit(composed.svg,plain)).status,'PASS');
  const styles={rows:[pts([['A','1',{style:'HOLLOW'}],['B','3',{style:'CROSS'}],['C','5']])]};
  const hollow=await compose(styles,'styles');
  assert.equal(hollow.status,'COMPOSED',JSON.stringify(hollow.detail));
  assert.match(hollow.svg,/id="r1-pt-A"[^>]*data-state="OPEN"[^>]*data-point-style="HOLLOW"[^>]*fill="#fff"/);
  const result=await audit(hollow.svg,styles);assert.equal(result.status,'PASS',JSON.stringify(result.errors));
});
