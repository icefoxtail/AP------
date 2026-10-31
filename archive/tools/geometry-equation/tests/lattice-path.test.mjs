// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveLattice,latticePathSize,latticePathSpec,composeLatticePathFigure,checkLatticePathPlan,FIGURE_CAPABILITY} from '../production/lattice-path-v1.mjs';

const observer=fileURLToPath(new URL('../production/lattice-path-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(lattice,expected)=>assert.throws(()=>solveLattice(lattice),code(expected),expected);
const plan=lattice=>({capability:FIGURE_CAPABILITY,lattice,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'lattice'}],newVisualInformation:['n']});
const grid=(cols,rows,extra={})=>({grid:{cols,rows},...extra,points:{A:[0,0],B:[cols,rows],...(extra.points??{})}});
const countAt=(model,x,y)=>model.counts.find(c=>c[0]===x&&c[1]===y)?.[2];
// 18 금당고 확률과통계 q12: a 6x3 network, the road from (4,1) up to (4,2) broken
const q12=grid(6,3,{points:{P:[4,1],Q:[4,2]},forbidden:[['P','Q']],counts:true});

test('the engine counts the shortest paths exactly: binomial totals, a forbidden road, a required road',()=>{
  const plain=solveLattice(grid(6,3,{counts:true}));
  assert.equal(plain.total,84);assert.equal(countAt(plain,6,3),84);assert.equal(countAt(plain,3,1),4);assert.equal(countAt(plain,2,2),6);
  const m=solveLattice(q12);
  assert.equal(m.total,69);assert.equal(countAt(m,4,1),5);assert.equal(countAt(m,4,2),10);assert.equal(countAt(m,6,3),69);
  // the number of paths through the road P-Q is the complement: 5 ways to its foot times 3 from its head
  const through=solveLattice(grid(6,3,{points:{P:[4,1],Q:[4,2]},via:[['P','Q']],counts:true}));
  assert.equal(through.total,15);assert.equal(countAt(through,4,2),5);assert.equal(countAt(through,5,2),5);assert.equal(countAt(through,6,3),15);
  assert.equal(countAt(through,0,3),undefined);                      // a crossing that cannot reach the required road has no number
  assert.equal(84-through.total,m.total);
  // two required roads in order: 1 way to P, 3 from Q to R, 2 from S to B
  assert.equal(solveLattice(grid(4,4,{points:{P:[1,0],Q:[1,1],R:[3,2],S:[3,3]},via:[['P','Q'],['R','S']],counts:true})).total,6);
});

test('the final count is hidden by default and shown only when asked; a list of crossings narrows the numbers',()=>{
  const m=solveLattice(q12);
  assert.ok(!m.shown.some(c=>c[0]===6&&c[1]===3));assert.ok(m.shown.some(c=>c[0]===0&&c[1]===0));
  assert.ok(solveLattice({...q12,hideTargetCount:false}).shown.some(c=>c[0]===6&&c[1]===3&&c[2]===69));
  assert.deepEqual(solveLattice({...q12,counts:['P','Q']}).shown,[[4,1,5],[4,2,10]]);
  assert.equal(solveLattice(grid(2,2,{highlightPath:['A',[1,0],[1,1],[2,1],'B']})).shown.length,0);   // no numbers unless asked
});

test('a start above and right of the target counts the same shortest paths',()=>{
  const m=solveLattice({grid:{cols:3,rows:2},points:{A:[3,2],B:[0,0]},counts:true});
  assert.equal(m.total,10);assert.equal(countAt(m,1,1),3);
});

test('inputs the engine cannot draw faithfully are refused with explicit codes',()=>{
  refuse({grid:{cols:0,rows:2}},'LATTICE_GRID_INVALID');
  refuse({grid:{cols:11,rows:2}},'LATTICE_GRID_INVALID');
  refuse({grid:{cols:3,rows:3},tilt:1},'LATTICE_PLAN_INVALID');
  refuse({grid:{cols:3,rows:3},points:{a:[0,0]}},'LATTICE_POINT_ID_INVALID');
  refuse({grid:{cols:3,rows:3},points:{A:[4,0]}},'LATTICE_POINT_OUT_OF_GRID');
  refuse({grid:{cols:3,rows:3},points:{A:[1,1],B:[1,1]}},'LATTICE_POINT_POSITION_DUPLICATE');
  refuse(grid(3,3,{forbidden:[['A','B']]}),'LATTICE_SEGMENT_NOT_ADJACENT');
  refuse(grid(3,3,{forbidden:[[[0,0],[1,0]],[[1,0],[0,0]]]}),'LATTICE_SEGMENT_DUPLICATE');
  refuse(grid(3,3,{forbidden:[['A','Z']]}),'LATTICE_SEGMENT_INVALID');
  refuse(grid(3,3,{forbidden:[[[0,0],[1,0]]],via:[[[0,0],[1,0]]],counts:true}),'LATTICE_VIA_FORBIDDEN_CONFLICT');
  refuse(grid(3,3,{via:[[[0,0],[0,1]],[[1,0],[1,1]],[[2,0],[2,1]],[[3,0],[3,1]]],counts:true}),'LATTICE_VIA_TOO_MANY');
  refuse({grid:{cols:5,rows:5},points:{A:[0,0],B:[2,2]},via:[[[3,3],[3,4]]],counts:true},'LATTICE_VIA_UNREACHABLE');
  refuse(grid(3,3,{forbidden:[[[0,0],[1,0]],[[0,0],[0,1]]],counts:true}),'LATTICE_NO_PATH');
  refuse(grid(3,3,{counts:'yes'}),'LATTICE_COUNTS_INVALID');
  refuse({grid:{cols:3,rows:3},points:{A:[0,0]},counts:true},'LATTICE_ENDPOINT_INVALID');
  refuse(grid(3,3,{highlightPath:['A',[2,0]]}),'LATTICE_HIGHLIGHT_PATH_INVALID');                     // not neighbouring crossings
  refuse(grid(3,3,{highlightPath:['A',[1,0],'A',[1,0]]}),'LATTICE_HIGHLIGHT_PATH_INVALID');           // a road used twice
  refuse(grid(3,3,{forbidden:[[[0,0],[1,0]]],highlightPath:['A',[1,0]]}),'LATTICE_HIGHLIGHT_PATH_INVALID');
  assert.throws(()=>checkLatticePathPlan({...plan(q12),extra:1}),code('LATTICE_PLAN_INVALID'));
  assert.throws(()=>checkLatticePathPlan({...plan(q12),capability:'x'}),code('LATTICE_PLAN_INVALID'));
});

test('the size follows the grid and the spec is bound to the model',()=>{
  const m=solveLattice(q12);
  const s=latticePathSize(m);assert.ok(Number.isInteger(s.width)&&Number.isInteger(s.height));assert.ok(s.width>s.height);
  assert.ok(latticePathSize(solveLattice(grid(6,4))).height>s.height);
  assert.throws(()=>latticePathSpec(plan(grid(6,3,{counts:true})),m),code('LATTICE_MODEL_MISMATCH'));
});

const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
test('the figure composes, the brute-force observer passes it, and it catches a changed number, road, style, point, path or the shown answer',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(lattice,n)=>{
      const composed=await composeLatticePathFigure({plan:plan(lattice),model:solveLattice(lattice),identity:assetIdentity('18_테스트|'+n,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(lattice,svg)=>(await pythonWorker({lattice,svg},{script:observer})).result;
    const edit=(svg,re,fn)=>{const m=re.exec(svg);assert.ok(m,String(re));return svg.replace(m[0],fn(m[0]));};
    const svg=await compose(q12,1);
    const pass=await audit(q12,svg);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
    assert.ok(!/id="count-6-3"/.test(svg));                              // the answer is not drawn
    // one digit changed in a number
    const wrong=edit(svg,/<g id="count-4-2"[^>]*>/,tag=>tag.replace('data-tex="10"','data-tex="11"').replace('data-count="10"','data-count="11"'));
    assert.ok(has(await audit(q12,wrong),'LP_COUNT_MISMATCH:4,2'));
    // a number claiming another crossing
    assert.ok(has(await audit(q12,edit(svg,/<g id="count-4-2"[^>]*>/,tag=>tag.replace('data-node="4,2"','data-node="3,2"'))),'LP_COUNT_'));
    // the broken road drawn solid, drawn as a plain road, a road missing
    assert.ok(has(await audit(q12,edit(svg,/<line id="road-4-1-4-2"[^>]*>/,tag=>tag.replace(/ stroke-dasharray="[^"]*"/,''))),'LP_FORBIDDEN_NOT_BROKEN'));
    assert.ok(has(await audit(q12,edit(svg,/<line id="road-4-1-4-2"[^>]*>/,tag=>tag.replace('road-forbidden','road'))),'LP_ROAD_STYLE_MISMATCH'));
    assert.ok(has(await audit(q12,edit(svg,/<g data-layer="30"><line id="road-0-0-0-1"[^>]*\/><\/g>/,()=>'')),'LP_ROAD_MISSING'));
    // the plan hides the final count: a figure that wrote it is caught
    const shown=await compose({...q12,hideTargetCount:false},2);
    assert.ok(/id="count-6-3"/.test(shown));
    assert.ok(has(await audit(q12,shown),'LP_TARGET_COUNT_SHOWN:6,3'));
    // a point moved, and a plan asking for another forbidden road than the one drawn
    assert.ok(has(await audit(q12,edit(svg,/<circle id="point-P"[^>]*>/,tag=>tag.replace(/cx="[\d.]+"/,'cx="150"'))),'LP_POINT_MISPLACED:P'));
    assert.ok(has(await audit({...q12,forbidden:[[[3,1],[3,2]]]},svg),'LP_'));
    // a via road is bold; a highlighted path is read back vertex by vertex
    const via=grid(6,3,{points:{P:[4,1],Q:[4,2]},via:[['P','Q']],counts:true});
    const viaSvg=await compose(via,3);assert.equal((await audit(via,viaSvg)).status,'PASS');
    assert.ok(has(await audit({...via,via:[[[3,1],[3,2]]]},viaSvg),'LP_'));
    const pathed=grid(5,2,{points:{B:[5,0],C:[5,2],D:[0,2]},highlightPath:['A',[0,1],[1,1],[1,2],[2,2],[3,2],[3,1],[4,1],[4,0],'B']});
    const pathSvg=await compose(pathed,4);
    assert.equal((await audit(pathed,pathSvg)).status,'PASS');
    assert.ok(has(await audit({...pathed,highlightPath:['A',[0,1],[1,1],[1,2],[2,2],[3,2],[3,1],[4,1],[5,1],'B']},pathSvg),'LP_PATH_MISMATCH'));
  }finally{await browser.close();}
});

test('renderPlan draws the figure end to end and refuses a plan the engine cannot count',async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'lattice-'));
  const r=await renderPlan({item:{sourcePath:'archive/exams/original/high/h2/1mid/18_금당고_1학기_중간_고2_확률과통계.js',ordinal:12,dir:'t'},plan:plan(q12),outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  assert.ok(fs.readFileSync(path.join(out,'t-solution.svg'),'utf8').includes('data-lattice-path="lattice-path-figure-v1"'));
  const none=await renderPlan({item:{sourcePath:'archive/exams/original/high/h2/1mid/18_금당고_1학기_중간_고2_확률과통계.js',ordinal:12,dir:'t'},plan:plan(grid(3,3,{forbidden:[[[0,0],[1,0]],[[0,0],[0,1]]],counts:true})),outDir:out});
  assert.equal(none.status,'FAILED');assert.match(String(none.detail),/LATTICE_NO_PATH/);
});
