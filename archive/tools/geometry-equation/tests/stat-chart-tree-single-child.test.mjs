// Chrome-using (composes a figure): run with --test-concurrency=1.
// stat-chart-figure-v1 (G13c): a probability tree node may have ONE child when that step always happens (the professor opens a stone door, p = 1).
// The branch runs straight on at the same height as its parent; any other p, or no p, is STAT_TREE_SINGLE_CHILD_NOT_CERTAIN. The independent observer checks the same.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),error=>error.message===expected,expected);
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>(result.errors??[]).some(error=>error.startsWith(prefix));
// 26 순천고 2학기 중간 고2 확통 q23: first pick (gold 1/3, stone 2/3) -> the professor opens a stone door (always) -> after switching
const monty={kind:'TREE',root:{children:[
  {label:'황금',p:'1/3',children:[{label:'문 열기',p:'1',children:[{label:'바꿔 실패',p:'1'}]}]},
  {label:'돌멩이',p:'2/3',children:[{label:'문 열기',p:'1',children:[{label:'바꿔 성공',p:'1'}]}]}]},
  highlightPaths:[['돌멩이','문 열기','바꿔 성공']]};

test('a node with one child needs the branch probability 1',()=>{
  const m=solveStatChart(monty);
  assert.equal(m.leaves.length,2);assert.deepEqual(m.highlightLeaves,['n0.2.1.1']);
  const one=p=>({kind:'TREE',root:{children:[{label:'가',p:'1/2',children:[{label:'나',...(p===undefined?{}:{p})}]},{label:'다',p:'1/2'}]}});
  assert.doesNotThrow(()=>solveStatChart(one('1')));assert.doesNotThrow(()=>solveStatChart(one('1/1')));
  for(const p of ['1/2','2','0.5'])refuse(one(p),'STAT_TREE_SINGLE_CHILD_NOT_CERTAIN');
  refuse(one(undefined),'STAT_TREE_SINGLE_CHILD_NOT_CERTAIN');
  refuse({kind:'TREE',root:{children:[{label:'가',children:[{label:'나'}]},{label:'다'}]}},'STAT_TREE_SINGLE_CHILD_NOT_CERTAIN');
  // the root alone with one child is no tree, and six children are still too many
  refuse({kind:'TREE',root:{children:[{label:'가',p:'1'}]}},'STAT_TREE_INVALID');
  refuse({kind:'TREE',root:{children:['가','나','다','라','마','바'].map(label=>({label,p:'1/6'}))}},'STAT_TREE_INVALID');
});

test('the single-child branch is drawn straight on and the observer catches a bent one',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await composeStatChartFigure({plan:plan(wire(monty)),model:solveStatChart(monty),identity:assetIdentity('26_테스트|7100','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
    const svg=composed.svg;
    const audit=async(chart,text)=>(await pythonWorker({chart:wire(chart),svg:text},{script:observer})).result;
    const r=await audit(monty,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));
    // each single-child branch has the same y at both ends and a probability label "1"
    for(const id of ['n0.1.1','n0.1.1.1','n0.2.1','n0.2.1.1']){
      const m=new RegExp(`id="branch-${id}"[^>]*? y1="([\\d.]+)"[^>]*? y2="([\\d.]+)"`).exec(svg)||new RegExp(`id="branch-${id}"[^>]*? y2="([\\d.]+)"[^>]*? y1="([\\d.]+)"`).exec(svg);
      assert.ok(m,'branch '+id);assert.ok(Math.abs(Number(m[1])-Number(m[2]))<0.5,'level '+id);
      assert.match(svg,new RegExp(`id="branch-${id}-p"[^>]*data-tex="[^"]*1"`));
    }
    // a bent branch (the child moved down) is caught, and so is a plan that names another probability
    const bent=svg.replace(/(id="node-n0.2.1"[^>]*?data-cy=")([\d.]+)/,(m,head,y)=>head+(Number(y)+30)).replace(/(id="node-n0.2.1"[^>]*?data-box="[\d.]+,)([\d.]+)/,(m,head,y)=>head+(Number(y)+30)).replace(/(id="branch-n0.2.1"[^>]*? y2=")([\d.]+)/,(m,head,y)=>head+(Number(y)+30));
    assert.notEqual(bent,svg);assert.ok(has(await audit(monty,bent),'SC_SINGLE_CHILD_NOT_LEVEL'));
    const other=wire(monty);other.root.children[0].children[0].p='1/2';
    assert.equal((await audit(other,svg)).code,'STAT_TREE_SINGLE_CHILD_NOT_CERTAIN');
    assert.ok(!has(r,'SC_SINGLE_CHILD_NOT_LEVEL'));
  }finally{await browser.close();}
});
