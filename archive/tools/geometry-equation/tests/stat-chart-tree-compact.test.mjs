import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {solveStatChart,composeStatChartFigure} from '../production/stat-chart-v1.mjs';
const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const chart={kind:'TREE',leafLayout:'COMPACT',root:{children:[{label:'0',children:['1','2','3','4','5'].map(label=>({label}))},{label:'2',children:['1','3','4','5'].map(label=>({label}))},{label:'4',children:['1','2','3','5'].map(label=>({label}))}]}};
const plan={capability:'stat-chart-figure-v1',chart,caption:'일의 자리 다음 십의 자리',sourceConditions:[{id:'c1',condition:'0부터5까지 서로 다른 두 카드',mappedTo:'chart'}],newVisualInformation:['일의 자리별 십의 자리 선택']};
test('compact count trees preserve every leaf and keep legacy and compact bounds',()=>{
  assert.equal(solveStatChart(chart).leaves.length,13);
  const {leafLayout,...legacy}=chart;
  assert.throws(()=>solveStatChart(legacy),/STAT_TREE_TOO_LARGE/);
  assert.throws(()=>solveStatChart({...chart,leafLayout:'OTHER'}),/STAT_TREE_COMPACT_INVALID/);
  assert.throws(()=>solveStatChart({...chart,showPathProbability:true}),/STAT_TREE_COMPACT_INVALID/);
  assert.throws(()=>solveStatChart({...chart,root:{children:Array.from({length:4},(_,i)=>({label:String(i),children:Array.from({length:5},(_,j)=>({label:String(j)}))}))}}),/STAT_TREE_TOO_LARGE/);
});
test('all thirteen leaves render and the observer catches a missing branch and changed leaf',async()=>{
  const c=await composeStatChartFigure({plan,model:solveStatChart(chart),identity:assetIdentity('23_테스트|24','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11}});
  assert.equal(c.status,'COMPOSED',JSON.stringify(c.detail));
  const audit=async svg=>(await pythonWorker({chart,svg},{script:observer})).result;
  assert.equal((await audit(c.svg)).status,'PASS');
  const missing=c.svg.replace(/<line[^>]*id="branch-n0.3.4"[^>]*\/>/,'');
  assert.notEqual(missing,c.svg);assert.ok((await audit(missing)).errors.some(e=>e.startsWith('SC_BRANCH_SET')));
  const wrong=c.svg.replace(/<g id="node-n0.3.4"[^>]*>/,tag=>tag.replace('data-tex="5"','data-tex="0"'));
  assert.notEqual(wrong,c.svg);assert.ok((await audit(wrong)).errors.some(e=>e.startsWith('SC_NODE_LABEL')));
});
