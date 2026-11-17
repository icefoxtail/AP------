// Chrome-using (composes a figure): run with --test-concurrency=1.
// A probability tree whose three branches fan out of one node (23 제일고 2학기 기말 고2 확통 q23): the fractions of neighbouring branches used to touch (STAT_LABELS_TOO_CLOSE).
// Each branch label now searches the places beside its own branch (slid along it, the other side, farther off); the tree is spaced wider only when no place is left.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const chart={kind:'TREE',root:{children:[
  {label:'A',p:'1/2',children:[{label:'1',p:'1/2'},{label:'2',p:'1/2'}]},
  {label:'B',p:'1/2',children:[{label:'3',p:'1/3'},{label:'4',p:'1/3'},{label:'5',p:'1/3'}]}]},showPathProbability:true};

test('the three branch fractions out of one node get places of their own',{timeout:300000},async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('23_테스트|7200','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
    const svg=composed.svg;
    for(const id of ['n0.2.1','n0.2.2','n0.2.3'])assert.match(svg,new RegExp(`id="branch-${id}-p"`),'every branch keeps its probability label');
    const audit=(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  }finally{await browser.close();}
});
