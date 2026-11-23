// Tree node names longer than 6 characters (stat-chart-figure-v1 TREE): one line when no wider than 6 em, else two lines broken at a space, each no wider than 6 em; wider is refused.
// The frame grows with the policy font only where the names need it. Chrome-using: run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {checkStatChartPlan,composeStatChartFigure,statChartSize} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const identity=assetIdentity('25_테스트|2','SOLUTION_VISUAL','decisive-relation');
const policy={baseFontPx:28.6,displayScale:0.4,fontFloorCssPx:11};   // the font the Archive gives a figure about 550 px wide
const tree=(first,second,extra={})=>({capability:'stat-chart-figure-v1',chart:{kind:'TREE',root:{children:[{label:first,p:'1/2',children:[{label:'모두 1',p:'4/9'},{label:'그 외',p:'5/9'}]},{label:second,p:'1/2',children:[{label:'모두 1',p:'1/9'},{label:'그 외',p:'8/9'}]}]},...extra},caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const plain=(a,b)=>({capability:'stat-chart-figure-v1',chart:{kind:'TREE',root:{children:[{label:a,children:[{label:b},{label:'그 외'}]},{label:'주사위 B',children:[{label:b},{label:'그 외'}]}]}},caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const run=async(plan,browser,fontPolicy=policy)=>{const model=checkStatChartPlan(plan);return composeStatChartFigure({plan,model,identity,typographyPolicy:fontPolicy,browser,minSize:statChartSize(model,{fontPx:fontPolicy.baseFontPx})});};
const audit=async(plan,svg)=>(await pythonWorker({chart:plan.chart,svg},{script:observer})).result;
const nodeLabel=(svg,id)=>{const m=svg.match(new RegExp(`<g id="${id}"[^>]*>`));return m?m[0]:null;};

test('a name of 7 to 14 characters with a space is two lines, the observer reads the lines back and the layout holds',async()=>{
  const browser=await launchBrowser();
  try{
    const plan=tree('동전 앞면이 나옴','주사위 B');
    const composed=await run(plan,browser);
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
    const wrapped=nodeLabel(composed.svg,'node-n0.1');
    assert.match(wrapped,/data-text="동전 앞면이 나옴"/);assert.match(wrapped,/data-lines="[^"]+;[^"]+"/);
    assert.doesNotMatch(nodeLabel(composed.svg,'node-n0.2'),/data-lines/);   // a short name stays one line
    // the observer holds the rule with its own constant: a tampered line list, or a name drawn too wide on one line, is caught
    const tampered=await audit(plan,composed.svg.replace(/data-lines="[^"]+"/,'data-lines="0,0,1,1"'));
    assert.ok(tampered.errors.some(code=>code.startsWith('SC_NODE_LINES:')),JSON.stringify(tampered.errors));
    const oneLine=await audit(plan,composed.svg.replace(/(<g id="node-n0\.1"[^>]*?) data-lines="[^"]+"/,'$1').replace(/(<g id="node-n0\.1"[^>]*data-box=")([\d.]+),([\d.]+),[\d.]+,/,'$1$2,$3,400,'));
    assert.ok(oneLine.errors.includes('SC_NODE_LABEL_TOO_WIDE:n0.1'),JSON.stringify(oneLine.errors));
  }finally{await browser.close();}
});

test('a name wider than 6 em with no space to break at, or longer than 14 characters, is refused',async()=>{
  const browser=await launchBrowser();
  try{
    const wide=await run(tree('일곱글자이름이','주사위 B'),browser);
    assert.equal(wide.status,'STAT_TREE_LABEL_TOO_WIDE',JSON.stringify(wide.detail));
    assert.throws(()=>checkStatChartPlan(tree('열다섯글자이름이넘어가는라벨이','주사위 B')),error=>error.message==='STAT_TREE_LABEL_INVALID');
    assert.throws(()=>checkStatChartPlan(tree('가<나','주사위 B')),error=>error.message==='STAT_TREE_LABEL_INVALID');   // the character rule is unchanged
  }finally{await browser.close();}
});

test('a 6-character name is one line as before, and at the policy font the frame grows to hold it (it overflowed the right edge before)',async()=>{
  const browser=await launchBrowser();
  try{
    const plan=plain('앞면','여섯글자이름');
    const composed=await run(plan,browser);
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.doesNotMatch(composed.svg,/data-lines/);
    assert.equal((await audit(plan,composed.svg)).status,'PASS');
    assert.ok(statChartSize(checkStatChartPlan(plan),{fontPx:28.6}).width>=statChartSize(checkStatChartPlan(plan),{fontPx:20}).width);
  }finally{await browser.close();}
});

test('a tree whose names are all short has the same size at every font it had before (columns and rows keep their constants)',()=>{
  const model=checkStatChartPlan(tree('주사위 A','주사위 B',{showPathProbability:true}));
  assert.deepEqual(statChartSize(model,{fontPx:20}),statChartSize(model));
});
