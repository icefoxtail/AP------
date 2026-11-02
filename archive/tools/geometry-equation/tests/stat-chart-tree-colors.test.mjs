// Chrome-using (composes the figure): run with --test-concurrency=1.
// G16: probability tree highlightPaths entries with a palette colour ({path,color}), and up to six spans on a number-line POINTS row.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';
import {solveNumberLineFigure} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>(result.errors??[result.code]).some(error=>error.startsWith(prefix));
const root={children:[{label:'서웅합격',p:'6/7',children:[{label:'지호합격',p:'1/3'},{label:'지호불합격',p:'2/3'}]},{label:'서웅불합격',p:'1/7',children:[{label:'지호합격',p:'1/3'},{label:'지호불합격',p:'2/3'}]}]};
const colored={kind:'TREE',root,highlightPaths:[{path:['서웅합격','지호합격'],color:'BLUE'},{path:['서웅불합격','지호불합격'],color:'WARM'},{path:['서웅합격','지호불합격'],color:'GREEN'},{path:['서웅불합격','지호합격'],color:'GREEN'}]};

test('a highlighted path may carry a palette colour; the old list form is unchanged',()=>{
  const m=solveStatChart(colored);
  assert.equal(m.highlightLeaves.length,4);assert.deepEqual(Object.values(m.highlightColors).sort(),['BLUE','GREEN','GREEN','WARM']);
  const old=solveStatChart({kind:'TREE',root,highlightPaths:[['서웅합격','지호합격']]});
  assert.ok(!('highlightColors' in old));
  assert.deepEqual(solveStatChart({kind:'TREE',root,highlightPaths:[{path:['서웅합격','지호합격']}]}).highlightLeaves,old.highlightLeaves,'an object without a colour is the plain highlight');
  for(const bad of [{path:['서웅합격','지호합격'],color:'RED'},{path:['서웅합격','지호합격'],extra:1},{color:'BLUE'},{path:['없음'],color:'BLUE'}])
    assert.throws(()=>solveStatChart({kind:'TREE',root,highlightPaths:[bad]}),code('STAT_TREE_HIGHLIGHT_INVALID'));
});

test('the observer checks every branch and leaf ring colour of a coloured tree',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await composeStatChartFigure({plan:plan(wire(colored)),model:solveStatChart(colored),identity:assetIdentity('26_테스트|9001','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
    const svg=composed.svg;
    const audit=async(chart,s)=>(await pythonWorker({chart:wire(chart),svg:s},{script:observer})).result;
    assert.equal((await audit(colored,svg)).status,'PASS');
    assert.equal((svg.match(/stroke="#2e7d32"/g)||[]).length,4,'two green leaf branches and two green rings');
    assert.ok(has(await audit({...colored,highlightPaths:colored.highlightPaths.map((e,i)=>i===0?{...e,color:'ROSE'}:e)},svg),'SC_'),'another colour');
    assert.ok(has(await audit({...colored,highlightPaths:colored.highlightPaths.map(e=>({path:e.path}))},svg),'SC_BRANCH_COLOR'),'a plain highlight does not draw colours');
    assert.ok(has(await audit(colored,svg.replace(/stroke="#1f5fa8"/,'stroke="#111"')),'SC_'),'a branch or ring that lost its colour');
    const plain=await composeStatChartFigure({plan:plan({kind:'TREE',root,highlightPaths:[['서웅합격','지호합격']]}),model:solveStatChart({kind:'TREE',root,highlightPaths:[['서웅합격','지호합격']]}),identity:assetIdentity('26_테스트|9002','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    assert.ok(!/#1f5fa8|#2e7d32|#b85c00/.test(plain.svg),'the old plan draws no colour');
  }finally{await browser.close();}
});

test('a number-line POINTS row takes up to six spans',()=>{
  const row=spans=>({rows:[{kind:'POINTS',points:[{id:'P',value:'0'},{id:'A',value:'2'},{id:'B',value:'1'},{id:'C',value:'-1'},{id:'D',value:'3'}],spans}]});
  const arrows=[['P','A'],['A','B'],['B','P'],['P','C'],['C','D'],['A','D']].map(([from,to])=>({from,to,style:'ARROW',side:'ABOVE'}));
  assert.doesNotThrow(()=>solveNumberLineFigure(row(arrows)));
  assert.doesNotThrow(()=>solveNumberLineFigure(row(arrows.slice(0,4))));
  assert.throws(()=>solveNumberLineFigure(row([...arrows,{from:'B',to:'D',style:'ARROW',side:'ABOVE'}])),code('NUMBER_LINE_SPANS_INVALID'));
});
