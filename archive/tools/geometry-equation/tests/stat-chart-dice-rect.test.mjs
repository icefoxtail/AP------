// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (G16): a rectangular DICE_TABLE (colFaces across, rowFaces down, 1 to 8 values each) and cell EXPR (cellExpr "2a+b": a the column value, b the row value, whole numbers).
// The observer re-derives the cells, their texts and the headers from the plan; a plan without the new fields draws what it always drew.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(0,120));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>(result.errors??[result.code]).some(error=>error.startsWith(prefix));
// 25 팔마중 2학기 기말 중2 q23: spinners with 1..8 and 1..3, the sum 5 or 9; q12: 100-won and 50-won coins, the amount in units of 50 won is 2a+b
const wide={kind:'DICE_TABLE',colFaces:[1,2,3,4,5,6,7,8],rowFaces:[1,2,3],cell:'SUM',highlightGroups:[{highlight:{expr:'a+b',in:[5]},tone:1},{highlight:{expr:'a+b',in:[9]},tone:2}]};
const coins={kind:'DICE_TABLE',colFaces:[1,2,3],rowFaces:[1,2,3],cell:'EXPR',cellExpr:'2a+b',colVar:'백원 개수',rowVar:'오십원 개수',highlightGroups:[{highlight:{expr:'2a+b',in:[5]},tone:1},{highlight:{expr:'2a+b',in:[7]},tone:2}]};

test('the engine builds a rectangular table and evaluates the cell expression',()=>{
  const m=solveStatChart(wide);
  assert.deepEqual(m.cols,[1,2,3,4,5,6,7,8]);assert.deepEqual(m.rows,[1,2,3]);assert.equal(m.total,24);assert.ok(!('faces' in m));
  assert.equal(m.highlightedCount,6);assert.deepEqual(m.cells.filter(c=>c.tone===1).map(c=>[c.col,c.row]).sort(),[[2,3],[3,2],[4,1]]);
  const c=solveStatChart(coins);
  assert.deepEqual(c.cells.map(x=>x.text),['3','5','7','4','6','8','5','7','9']);assert.equal(c.cellExpr,'2a+b');
  assert.equal(solveStatChart({kind:'DICE_TABLE',colFaces:[2,4],rowFaces:[3],cell:'EXPR',cellExpr:'a*(b-1)+3'}).cells[1].text,'11');
  // implicit multiplication works in conditions too, and the square table keeps its old model and size
  assert.equal(solveStatChart({kind:'DICE_TABLE',faces:3,highlight:{expr:'2a+b',in:[5]}}).highlightedCount,2);
  const sq=solveStatChart({kind:'DICE_TABLE',faces:6,cell:'SUM'});assert.equal(sq.faces,6);assert.ok(!('cols' in sq)&&!('cellExpr' in sq));
  assert.equal(statChartSize(sq).width,statChartSize(solveStatChart({kind:'DICE_TABLE',colFaces:[1,2,3,4,5,6],rowFaces:[1,2,3,4,5,6],cell:'SUM'})).width);
  assert.ok(statChartSize(solveStatChart(wide)).height<statChartSize(sq).height,'three rows are lower than six');
});

test('rectangular tables and cell expressions that cannot be drawn faithfully are refused with their codes',()=>{
  const r=extra=>({kind:'DICE_TABLE',colFaces:[1,2,3],rowFaces:[1,2],...extra});
  refuse({kind:'DICE_TABLE',faces:3,colFaces:[1,2],rowFaces:[1,2]},'STAT_DICE_FACES_INVALID');refuse({kind:'DICE_TABLE',colFaces:[1,2]},'STAT_DICE_FACES_INVALID');refuse({kind:'DICE_TABLE',rowFaces:[1,2]},'STAT_DICE_FACES_INVALID');
  for(const bad of [[],[1,1],[0,1],[1,100],[1.5],['1'],[1,2,3,4,5,6,7,8,9],'12',null])refuse(r({colFaces:bad}),'STAT_DICE_FACES_INVALID');
  refuse(r({cell:'EXPR'}),'STAT_DICE_CELL_INVALID');refuse(r({cellExpr:'a+b'}),'STAT_DICE_CELL_INVALID');refuse(r({cell:'SUM',cellExpr:'a+b'}),'STAT_DICE_CELL_INVALID');
  refuse(r({cell:'EXPR',cellExpr:7}),'STAT_DICE_CELL_INVALID');refuse(r({cell:'EXPR',cellExpr:'a+b+a+b+a+b+a+b+a+b+a'}),'STAT_DICE_CELL_INVALID');
  for(const bad of ['a+c','a/b','a+','x','2a+z'])refuse(r({cell:'EXPR',cellExpr:bad}),'STAT_DICE_EXPR_INVALID');
  refuse(r({highlightGroups:[{cells:[[1,3]]}]}),'STAT_DICE_GROUP_INVALID');refuse(r({highlightGroups:[{cells:[[4,1]]}]}),'STAT_DICE_GROUP_INVALID');   // a cell that is not in the table
  assert.doesNotThrow(()=>solveStatChart(r({highlightGroups:[{cells:[[3,2]]}]})));
});

test('the observer passes rectangular and expression tables and catches each wrong cell, text or header',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(9100+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const svg=await compose(wide,1);
    let r=await audit(wide,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));assert.deepEqual(r.observed,{highlighted:6,total:24});
    assert.ok(has(await audit({...wide,rowFaces:[1,2,3,4]},svg),'SC_'),'a row more than drawn');
    assert.ok(has(await audit({...wide,colFaces:[1,2,3,4,5,6,7,9]},svg),'SC_'),'another header value');
    assert.ok(has(await audit({...wide,highlightGroups:[{highlight:{expr:'a+b',in:[5]},tone:1},{highlight:{expr:'a+b',in:[8]},tone:2}]},svg),'SC_CELL_HIGHLIGHT'));
    assert.ok(has(await audit(wide,svg.replace(/(id="cell-3-2-label"[^>]*data-tex=")5/,'$16')),'SC_CELL_TEXT:3,2'));
    assert.ok(has(await audit({kind:'DICE_TABLE',faces:6},svg),'SC_'),'a square plan is not this figure');
    const svg2=await compose(coins,2);
    r=await audit(coins,svg2);assert.equal(r.status,'PASS',JSON.stringify(r.errors));assert.deepEqual(r.observed,{highlighted:4,total:9});
    assert.ok(has(await audit({...coins,cellExpr:'2a+b+1'},svg2),'SC_CELL_TEXT'),'another expression');
    assert.ok(has(await audit({...coins,cellExpr:undefined,cell:'SUM'},svg2),'SC_CELL_TEXT'),'the sum is not 2a+b');
    assert.ok(has(await audit({...coins,cellExpr:undefined},svg2),'STAT_DICE_CELL_INVALID'));
    // a headers moved by one cell is caught by place, not only by value
    assert.ok(has(await audit(coins,svg2.replace(/(id="head-col-1"[^>]*? x=")([\d.]+)/,(m,h,x)=>h+(Number(x)+54))),'SC_HEADER_PLACE:col1'));
    assert.ok(has(await audit({...coins,colFaces:[3,2,1]},svg2),'SC_'),'the order of the headers matters');
  }finally{await browser.close();}
});
