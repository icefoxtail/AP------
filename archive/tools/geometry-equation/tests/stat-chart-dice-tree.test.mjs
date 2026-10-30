// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (E34): the dice table with groups of cells in two greys (highlightGroups) and with its two variables written as letters, left out or written as Hangul phrases beside
// the table (colVar / rowVar), and the probability tree with highlighted paths (heavy branches, ringed leaves), the path probabilities in one column (pathColumn) and a frame that
// widens for a product of three fractions. The independent observer re-derives all of it from the plan.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(0,100));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
// 25 연향중 2학기 중간 중2 q11: the cells where the two numbers differ by 2 (light) and by 4 (dark)
const groups={kind:'DICE_TABLE',colVar:'x',rowVar:'y',highlightGroups:[{highlight:{expr:'x-y',in:[-2,2]},tone:1},{highlight:{expr:'x-y',in:[-4,4]},tone:2}]};
const named={kind:'DICE_TABLE',cell:'SUM',colVar:'첫째 주사위',rowVar:'둘째 주사위',highlight:{expr:'a+b',in:[7]}};
const unnamed={kind:'DICE_TABLE',cell:'SUM',colVar:null,rowVar:null,highlightGroups:[{cells:[[1,6],[2,5],[3,4]],tone:2},{cells:[[6,1]],tone:1}]};
// 25 팔마중 2학기 기말 중2 q20: first to win two games; the three ways 해인 wins are drawn heavy
const treeRoot={children:[{label:'승',p:'3/4',children:[{label:'승',p:'3/4'},{label:'패',p:'1/4',children:[{label:'승',p:'3/4'},{label:'패',p:'1/4'}]}]},
  {label:'패',p:'1/4',children:[{label:'승',p:'3/4',children:[{label:'승',p:'3/4'},{label:'패',p:'1/4'}]},{label:'패',p:'1/4'}]}]};
const tree={kind:'TREE',root:treeRoot,showPathProbability:true,pathColumn:true,highlightPaths:[['승','승'],['승','패','승'],['패','승','승']]};

test('the engine derives the tones of the cell groups and the names of the variables, and a plan without them keeps its old model',()=>{
  const m=solveStatChart(groups);
  assert.equal(m.highlightedCount,12);
  assert.deepEqual(m.cells.filter(c=>c.tone===2).map(c=>[c.col,c.row]),[[5,1],[6,2],[1,5],[2,6]]);
  assert.equal(m.cells.filter(c=>c.tone===1).length,8);assert.ok(m.cells.filter(c=>!c.highlighted).every(c=>!('tone' in c)));
  assert.deepEqual(m.highlightGroups.map(g=>g.tone),[1,2]);
  const u=solveStatChart(unnamed);
  assert.deepEqual(u.cells.filter(c=>c.tone===2).map(c=>[c.col,c.row]),[[3,4],[2,5],[1,6]]);assert.equal(u.colLabel,null);assert.equal(u.rowLabel,null);
  assert.equal(u.colVar,'a');assert.equal(u.rowVar,'b','the conditions of a variable without a letter call it a / b');
  const n=solveStatChart(named);assert.equal(n.colLabel,'첫째 주사위');assert.equal(n.rowLabel,'둘째 주사위');assert.equal(n.highlightedCount,6);
  const old=solveStatChart({kind:'DICE_TABLE',highlight:{expr:'a+b',in:[7]}});
  assert.ok(!('colLabel' in old)&&!('rowLabel' in old)&&!('highlightGroups' in old)&&old.cells.every(c=>!('tone' in c)));
  assert.equal(old.highlightedCount,6);
  // a letter for one variable and a phrase for the other is fine
  const mixed=solveStatChart({kind:'DICE_TABLE',colVar:'x',rowVar:'가로 눈',highlight:{expr:'x+b',in:[4]}});
  assert.equal(mixed.rowLabel,'가로 눈');assert.equal(mixed.colLabel,undefined);assert.equal(mixed.rowVar,'b');
});

test('dice tables that cannot be drawn faithfully are refused with their codes',()=>{
  const g=highlightGroups=>({kind:'DICE_TABLE',highlightGroups});
  refuse({...groups,highlight:{expr:'x',in:[1]}},'STAT_DICE_GROUP_INVALID');
  for(const bad of [[],'x',[{tone:1}],[{highlight:{expr:'a',in:[1]},cells:[[1,1]]}],[{highlight:{expr:'a',in:[1]},tone:3}],[{cells:[],tone:1}],[{cells:[[1,1],[1,1]]}],[{cells:[[0,1]]}],[{cells:[[7,1]]}],[{cells:[[1]]}],[{cells:[[1,1.5]]}],[{cells:'1,1'}],[{cells:[[1,1]],extra:1}],
    Array.from({length:5},(_,i)=>({cells:[[i+1,1]]}))])
    refuse(g(bad),'STAT_DICE_GROUP_INVALID');
  refuse(g([{highlight:{expr:'a',in:[1,2]}},{highlight:{expr:'b',in:[1]}}]),'STAT_DICE_GROUP_OVERLAP');                    // the cell (1,1) is in both
  refuse(g([{cells:[[1,1]]},{cells:[[1,1]],tone:2}]),'STAT_DICE_GROUP_OVERLAP');
  refuse(g([{highlight:{expr:'a+b',in:[99]}}]),'STAT_DICE_GROUP_EMPTY');
  refuse(g([{highlight:{expr:'z',in:[1]}}]),'STAT_DICE_EXPR_INVALID');
  for(const bad of ['A','ab',5,'첫째주사위가너무깁니다요','첫째  주사위','첫째 주사위 ','first',' 첫째'])refuse({kind:'DICE_TABLE',colVar:bad},'STAT_DICE_VARIABLE_INVALID');
  refuse({kind:'DICE_TABLE',colVar:'a',rowVar:'a'},'STAT_DICE_VARIABLE_INVALID');
  refuse({kind:'DICE_TABLE',colVar:'b'},'STAT_DICE_VARIABLE_INVALID');                          // the row variable defaults to b
  assert.doesNotThrow(()=>solveStatChart({kind:'DICE_TABLE',colVar:'b',rowVar:'a'}));
  assert.doesNotThrow(()=>solveStatChart({kind:'DICE_TABLE',colVar:'a',rowVar:null}));
});

test('the engine marks the leaves of the highlighted paths; trees that cannot be drawn faithfully are refused with their codes',()=>{
  const m=solveStatChart(tree);
  assert.deepEqual(m.highlightLeaves,['n0.1.1','n0.1.2.1','n0.2.1.1']);assert.equal(m.pathColumn,true);
  const old=solveStatChart({kind:'TREE',root:treeRoot,showPathProbability:true});
  assert.ok(!('highlightLeaves' in old)&&!('pathColumn' in old));
  const lit=highlightPaths=>({...tree,highlightPaths});
  for(const bad of [[],'x',[['승']],[['승','승','승']],[['승','패']],[['무','승']],[['승','승'],['승','승']],[[]],[['승','승',1]],Array.from({length:13},()=>['승','승'])])
    refuse(lit(bad),'STAT_TREE_HIGHLIGHT_INVALID');
  // two children with one label cannot be told apart by the labels
  refuse({kind:'TREE',root:{children:[{label:'승',children:[{label:'a'},{label:'b'}]},{label:'승',children:[{label:'a'},{label:'b'}]}]},highlightPaths:[['승','a']]},'STAT_TREE_HIGHLIGHT_INVALID');
  refuse({...tree,showPathProbability:undefined},'STAT_TREE_PATH_NEEDS_PROBABILITIES');          // pathColumn needs the path probabilities
  refuse({...tree,pathColumn:'yes'},'STAT_CHART_PLAN_INVALID');
  // the frame widens for a product of three fractions (the standard frame is 190 px beyond the last column)
  assert.ok(statChartSize(solveStatChart({...tree,highlightPaths:undefined,pathColumn:undefined})).width>684,'wider than the standard frame of a three-level tree');
  const plain=statChartSize(solveStatChart({kind:'TREE',root:{children:[{label:'흰',p:'1/2'},{label:'검',p:'1/2'}]},showPathProbability:true}));
  assert.equal(plain.width,44+150+190,'a tree whose labels fit keeps the standard frame');
});

test('the observer passes grouped cells, named variables and highlighted paths, and catches each one wrong',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(7000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const pass=async(chart,svg)=>{const r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));return r;};
    const boxOf=(svg,id)=>new RegExp(`id="${id}"[^>]*data-box="([\\d.]+),([\\d.]+),([\\d.]+),([\\d.]+)"`).exec(svg).slice(1).map(Number);

    // ---- two greys: the light cells carry data-highlight 1, the dark ones 2
    let svg=await compose(groups,1);
    let r=await pass(groups,svg);assert.equal(r.observed.highlighted,12);
    assert.equal((svg.match(/data-highlight="2"/g)||[]).length,4);assert.equal((svg.match(/data-highlight="1"/g)||[]).length,8);
    assert.match(svg,/id="cell-5-1"[^>]*data-highlight="2"[^>]*fill="#9b9b9b"/);assert.match(svg,/id="cell-3-1"[^>]*data-highlight="1"[^>]*fill="#c9c9c9"/);
    assert.ok(has(await audit({...groups,highlightGroups:[{highlight:{expr:'x-y',in:[-2,2]},tone:2},{highlight:{expr:'x-y',in:[-4,4]},tone:1}]},svg),'SC_CELL_HIGHLIGHT'),'tones swapped');
    assert.ok(has(await audit({...groups,highlightGroups:[groups.highlightGroups[0]]},svg),'SC_CELL_HIGHLIGHT'),'a group missing from the plan');
    assert.ok(has(await audit({kind:'DICE_TABLE',colVar:'x',rowVar:'y',highlight:{expr:'x-y',in:[-4,-2,2,4]}},svg),'SC_CELL_HIGHLIGHT'),'one condition for both greys');
    assert.ok(has(await audit(groups,svg.replace('id="cell-5-1" data-role="cell" data-col="5" data-row="1" data-highlight="2"','id="cell-5-1" data-role="cell" data-col="5" data-row="1" data-highlight="1"')),'SC_CELL_HIGHLIGHT:5,1'));
    assert.ok(has(await audit(groups,svg.replace(/(id="cell-6-2"[^>]*?)fill="#9b9b9b"/,'$1fill="#c9c9c9"')),'SC_CELL_HIGHLIGHT:6,2'));
    // groups by listed cells and no variable written: the corner is empty and has no diagonal
    svg=await compose(unnamed,2);
    await pass(unnamed,svg);
    assert.ok(!/id="corner-diagonal"|data-label-role="var"/.test(svg));
    assert.ok(has(await audit({...unnamed,colVar:'a'},svg),'SC_VARIABLE_LABELS'));
    assert.ok(has(await audit({...unnamed,highlightGroups:[{cells:[[1,6],[2,5],[3,4]],tone:2},{cells:[[5,2]],tone:1}]},svg),'SC_CELL_HIGHLIGHT'));
    assert.equal((await audit({...unnamed,highlightGroups:[{cells:[[1,6]]},{cells:[[1,6]],tone:2}]},svg)).code,'STAT_DICE_GROUP_OVERLAP');

    // ---- Hangul phrases beside the table: over the columns and left of the rows
    svg=await compose(named,3);
    await pass(named,svg);
    assert.match(svg,/id="name-col"[^>]*data-text="첫째 주사위"/);assert.match(svg,/id="name-row"[^>]*data-text="둘째 주사위"/);
    assert.ok(!/id="corner-diagonal"|data-label-role="var"/.test(svg));
    const [cx,cy,cw,ch]=boxOf(svg,'name-col'),[rx,ry,rw,rh]=boxOf(svg,'name-row');
    assert.ok(cy+ch<=Number(/id="corner"[^>]*? y="([\d.]+)"/.exec(svg)[1])+0.01,'the column name is above the table');
    assert.ok(rx+rw<=Number(/id="corner"[^>]*? x="([\d.]+)"/.exec(svg)[1])+0.01,'the row name is left of the table');
    assert.ok(has(await audit({...named,colVar:'둘째 주사위'},svg),'SC_VARIABLE_NAMES'));
    assert.ok(has(await audit({...named,rowVar:null},svg),'SC_VARIABLE_NAMES'));
    assert.ok(has(await audit({...named,colVar:null},svg),'SC_VARIABLE_NAMES'));
    assert.ok(has(await audit(named,svg.replace(/(id="name-col"[^>]*data-box=")([\d.]+)/,(m,head,x)=>head+(Number(x)+40))),'SC_VARIABLE_NAME_PLACE:col'));
    assert.ok(has(await audit(named,svg.replace(/(id="name-row"[^>]*data-box="[\d.]+,)([\d.]+)/,(m,head,y)=>head+(Number(y)+40))),'SC_VARIABLE_NAME_PLACE:row'));
    // a letter for the columns and a phrase for the rows
    const mixed={kind:'DICE_TABLE',colVar:'x',rowVar:'가로 눈',highlight:{expr:'x+b',in:[4]}};
    svg=await compose(mixed,4);
    await pass(mixed,svg);
    assert.ok(/id="corner-diagonal"/.test(svg)&&/id="corner-col"/.test(svg)&&!/id="corner-row"/.test(svg));

    // ---- the tree: heavy branches and rings on the winning paths, the products in one column right of the deepest leaf
    svg=await compose(tree,5);
    r=await pass(tree,svg);assert.deepEqual(r.observed.highlighted,['n0.1.1','n0.1.2.1','n0.2.1.1']);
    assert.equal((svg.match(/data-role="leaf-ring"/g)||[]).length,3);
    assert.equal((svg.match(/data-highlight="1"/g)||[]).length,7,'the union of the branches of the three paths');
    const lefts=['n0.1.1','n0.1.2.1','n0.1.2.2','n0.2.1.1','n0.2.1.2','n0.2.2'].map(id=>boxOf(svg,`path-${id}`)[0]);
    assert.ok(Math.max(...lefts)-Math.min(...lefts)<0.01,'one column');
    assert.ok(has(await audit({...tree,highlightPaths:[['승','승']]},svg),'SC_BRANCH_HIGHLIGHT'));
    assert.ok(has(await audit({...tree,highlightPaths:[['승','승'],['승','패','승'],['패','승','승'],['패','패']]},svg),'SC_LEAF_RING_SET'));
    assert.ok(has(await audit({...tree,highlightPaths:undefined},svg),'SC_LEAF_RING_SET'));
    assert.ok(has(await audit({...tree,highlightPaths:[['승','승'],['승','패','패'],['패','승','승']]},svg),'SC_BRANCH_HIGHLIGHT'));
    assert.ok(has(await audit(tree,svg.replace(/(id="branch-n0.1.1"[^>]*?)stroke-width="3"/,'$1stroke-width="1.4"')),'SC_BRANCH_HIGHLIGHT:n0.1.1'));
    assert.ok(has(await audit(tree,svg.replace(/(id="branch-n0.2.2"[^>]*? data-parent)/,'$1').replace(/(id="branch-n0.2.2"[^>]*?)stroke-width="1.4"/,'$1stroke-width="3"')),'SC_BRANCH_HIGHLIGHT:n0.2.2'));
    assert.ok(has(await audit(tree,svg.replace(/(id="leaf-ring-n0.1.1"[^>]*? cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+9))),'SC_LEAF_RING_PLACE:n0.1.1'));
    assert.ok(has(await audit(tree,svg.replace(/(id="leaf-ring-n0.1.1"[^>]*? rx=")([\d.]+)/,'$12')),'SC_LEAF_RING_PLACE:n0.1.1'));
    assert.ok(has(await audit(tree,svg.replace(/(id="path-n0.1.2.1"[^>]*data-box=")([\d.]+)/,(m,head,x)=>head+(Number(x)-60))),'SC_PATH_COLUMN'));
    assert.equal((await audit({...tree,pathColumn:true,showPathProbability:false},svg)).code,'STAT_TREE_PATH_NEEDS_PROBABILITIES');
    // a plan without the new marks draws the old tree: no rings, thin branches
    const plainTree={kind:'TREE',root:{children:[{label:'흰',p:'3/7'},{label:'검',p:'4/7'}]}};
    const plainSvg=await compose(plainTree,6);
    assert.ok(!/leaf-ring|data-highlight/.test(plainSvg));await pass(plainTree,plainSvg);
  }finally{await browser.close();}
});
