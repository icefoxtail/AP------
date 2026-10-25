// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,statChartSpec,composeStatChartFigure,checkStatChartPlan,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected);
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
// 25 풍덕중 2학기 기말 중1 17: classes 20..50 by 5, frequencies 2,5,6,12,10,5, histogram with its polygon
const hist={kind:'HISTOGRAM',polygon:true,boundaries:['20','25','30','35','40','45','50'],series:[{frequencies:[2,5,6,12,10,5],total:40}],xTitle:'기록(회)',yTitle:'도수(명)',grid:true};
// 25 풍덕중 2학기 기말 중1 19: two relative-frequency polygons
const two={kind:'FREQUENCY_POLYGON',yKind:'RELATIVE',boundaries:['130','140','150','160','170','180'],series:[{name:'A',relativeFrequencies:['0.15','0.2','0.3','0.25','0.1']},{name:'B',relativeFrequencies:['0.05','0.2','0.25','0.35','0.15']}],xTitle:'키(cm)',yTitle:'상대도수'};
const stem={kind:'STEM_LEAF',title:'이모티콘 사용 건수',unitText:'건',values:[10,11,12,13,21,24,26,26,28,29,31,33,38,38,38,40,43,45,53,57],marks:[{median:true}]};
const stemTwo={kind:'STEM_LEAF',groups:[{name:'A반',values:[52,67,71,74,75,88,91]},{name:'B반',values:[61,63,72,72,85,89,90,93]}],unitText:'점',marks:[{group:0,ranks:[4]},{group:1,median:true}]};
const box={kind:'BOX_PLOT',xTitle:'점수(점)',series:[{name:'A반',values:[52,58,60,63,67,70,74,75,81,88,91]},{name:'B반',summary:{min:'45',q1:'60',median:'72',q3:'85',max:'96'}}]};
const scatter={kind:'SCATTER',xTitle:'국어(점)',yTitle:'영어(점)',xRange:['30','100'],yRange:['30','100'],xStep:'10',yStep:'10',labelEvery:2,diagonal:true,
  points:[{x:60,y:100,name:'A'},{x:50,y:80,name:'B'},{x:70,y:90,name:'C'},{x:95,y:70,name:'D'},{x:80,y:40,name:'E'},{x:70,y:70},{x:40,y:40},{x:50,y:50},{x:60,y:60}]};
const dice={kind:'DICE_TABLE',highlight:{any:[{expr:'a+b',in:[2]},{expr:'a+b',in:[7]}]}};
const tree={kind:'TREE',showPathProbability:true,root:{children:[{label:'흰',p:'3/7',children:[{label:'흰',p:'2/5'},{label:'검',p:'3/5'}]},{label:'검',p:'4/7',children:[{label:'흰',p:'2/5'},{label:'검',p:'3/5'}]}]}};

test('the engine derives midpoints, polygon vertices with the zero end classes, relative frequencies and the axis exactly',()=>{
  const m=solveStatChart(hist);
  assert.deepEqual(m.classes.map(k=>k.mid),['22.5','27.5','32.5','37.5','42.5','47.5']);
  assert.deepEqual(m.series[0].vertices,[['17.5','0'],['22.5','2'],['27.5','5'],['32.5','6'],['37.5','12'],['42.5','10'],['47.5','5'],['52.5','0']]);
  assert.deepEqual([m.y.step,m.y.top],['2','14']);
  const r=solveStatChart({...hist,yKind:'RELATIVE'});
  assert.deepEqual(r.series[0].values,['0.05','0.125','0.15','0.3','0.25','0.125']);
  assert.equal(solveStatChart({...hist,yKind:'RELATIVE',yTitle:undefined}).yTitle,'상대도수');
  const t=solveStatChart(two);
  assert.deepEqual(t.series[1].vertices[0],['125','0']);assert.deepEqual(t.series[1].vertices.at(-1),['185','0']);
  assert.deepEqual(t.y.ticks.at(-1),'0.4');
});
test('quartiles follow the curriculum: the median of each half, the middle value left out when n is odd',()=>{
  const five=values=>solveStatChart({kind:'BOX_PLOT',series:[{values}]}).series[0].five;
  assert.deepEqual(five([2,4,5,7,8,10,12]),{min:'2',q1:'4',median:'7',q3:'10',max:'12'});
  assert.deepEqual(five([1,3,5,7,9,11]),{min:'1',q1:'3',median:'6',q3:'9',max:'11'});
  assert.deepEqual(five([10,20,30,40]),{min:'10',q1:'15',median:'25',q3:'35',max:'40'});
  assert.deepEqual(five([4,'1.5',9,6,12,3,8,'2.5']),{min:'1.5',q1:'2.75',median:'5',q3:'8.5',max:'12'});
});
test('stem and leaf, dice table, tree and scatter derive their numbers',()=>{
  const s=solveStatChart(stem);
  assert.deepEqual(s.stems,[1,2,3,4,5]);assert.deepEqual(s.groups[0].rows.map(r=>r.leaves.length),[4,6,5,3,2]);
  assert.equal(s.groups[0].median,'30');assert.deepEqual(s.marks.map(x=>[x.rank,x.value]),[[10,29],[11,31]]);
  assert.equal(s.key.text,'1 | 0은 10건');
  assert.equal(solveStatChart(dice).highlightedCount,7);
  assert.equal(solveStatChart({kind:'DICE_TABLE',highlight:{all:[{expr:'a',cmp:'<=',value:2},{expr:'b',cmp:'<=',value:2}]}}).highlightedCount,4);
  assert.equal(solveStatChart({kind:'DICE_TABLE',highlight:{any:[{expr:'b-a',in:[0]},{expr:'b-2*a',in:[0]}]}}).highlightedCount,9);
  assert.equal(solveStatChart({kind:'DICE_TABLE',cell:'SUM',highlight:{not:{expr:'a*b',cmp:'<',value:'12'}}}).highlightedCount,solveStatChart({kind:'DICE_TABLE',cell:'SUM',highlight:{expr:'a*b',cmp:'>=',value:12}}).highlightedCount);
  const t=solveStatChart(tree);
  assert.deepEqual(t.nodes.filter(n=>n.path).map(n=>[n.id,n.path]),[['n0.1.1','6/35'],['n0.1.2','9/35'],['n0.2.1','8/35'],['n0.2.2','12/35']]);
  assert.equal(solveStatChart(scatter).onDiagonal,4);
});
test('charts that cannot be drawn faithfully are refused with their codes',()=>{
  refuse({...hist,boundaries:['20','25','31','35']},'STAT_CLASS_WIDTH_UNEQUAL');
  refuse({...hist,boundaries:['20','20','25']},'STAT_BOUNDARIES_INVALID');
  refuse({...hist,series:[{frequencies:[2,5,6,12,10]}]},'STAT_FREQUENCY_COUNT_MISMATCH');
  refuse({...hist,series:[{frequencies:[2,5,6,12,10,5],total:41}]},'STAT_FREQUENCY_TOTAL_MISMATCH');
  refuse({...two,series:[{name:'A',relativeFrequencies:['0.15','0.2','0.3','0.25','0.2']},two.series[1]]},'STAT_RELATIVE_SUM_NOT_ONE');
  refuse({...two,series:[two.series[0],{...two.series[1],name:'A'}]},'STAT_SERIES_INVALID');
  refuse({...hist,series:[hist.series[0],hist.series[0]]},'STAT_HISTOGRAM_ONE_SERIES');
  refuse({...hist,highlightClasses:[9]},'STAT_HIGHLIGHT_INVALID');
  refuse({kind:'STEM_LEAF',values:[]},'STAT_STEM_PLAN_INVALID');
  refuse({kind:'STEM_LEAF',values:[12,'x']},'STAT_STEM_VALUE_INVALID');
  refuse({kind:'STEM_LEAF',values:[12,15],marks:[{ranks:[3]}]},'STAT_STEM_MARK_INVALID');
  refuse({kind:'BOX_PLOT',series:[{values:[1,2,3]}]},'STAT_BOX_NEEDS_FOUR_VALUES');
  refuse({kind:'BOX_PLOT',series:[{summary:{min:'5',q1:'3',median:'6',q3:'8',max:'9'}}]},'STAT_BOX_SUMMARY_NOT_ORDERED');
  refuse({...scatter,points:[{x:20,y:50}]},'STAT_POINT_OUTSIDE_RANGE');
  refuse({...scatter,xStep:'15'},'STAT_RANGE_NOT_ON_STEP');
  refuse({kind:'DICE_TABLE',highlight:{expr:'a+c',in:[2]}},'STAT_DICE_EXPR_INVALID');
  refuse({kind:'DICE_TABLE',highlight:{expr:'a+b',cmp:'!=',value:2}},'STAT_DICE_PREDICATE_INVALID');
  refuse({kind:'TREE',root:{children:[{label:'a',p:'1/2'},{label:'b',p:'1/3'}]}},'STAT_TREE_BRANCH_PROBABILITY_SUM');
  refuse({kind:'TREE',root:{children:[{label:'a',p:'1/2'},{label:'b'}]}},'STAT_TREE_PROBABILITY_MIXED');
  refuse({kind:'TREE',showPathProbability:true,root:{children:[{label:'a'},{label:'b'}]}},'STAT_TREE_PATH_NEEDS_PROBABILITIES');
  refuse({kind:'PIE'},'STAT_KIND_UNSUPPORTED');
  assert.throws(()=>checkStatChartPlan({...plan(hist),extra:1}),code('STAT_CHART_PLAN_INVALID'));
  assert.deepEqual(statChartSize(solveStatChart(hist)),{width:548,height:statChartSize(solveStatChart(hist)).height});
  assert.throws(()=>statChartSpec(plan(hist),{...solveStatChart(hist),polygon:false}),code('STAT_MODEL_MISMATCH'));
});

const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
test('every chart composes, the independent observer passes it, and it catches a wrong bar, vertex, tick, quartile, leaf, cell, probability or point',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const p=plan(chart),model=solveStatChart(chart);
      let composed=await composeStatChartFigure({plan:p,model,identity:assetIdentity('25_테스트|'+n,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
      assert.equal(composed.schemaVersion,'construction-candidate-svg-v1');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart,svg},{script:observer})).result;
    const bump=(svg,id,attr,delta)=>{const re=new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`);assert.ok(re.test(svg),id);return svg.replace(re,(m,head,x)=>head+(Number(x)+delta));};
    // histogram + polygon
    let svg=await compose(hist,1);
    assert.equal((await audit(hist,svg)).status,'PASS');
    assert.ok(has(await audit(hist,bump(svg,'bar-s0-3','height',-12)),'SC_BAR_HEIGHT:3'));
    assert.ok(has(await audit(hist,bump(svg,'bar-s0-2','x',6)),'SC_BAR_X_RANGE:2'));
    assert.ok(has(await audit(hist,bump(svg,'vertex-s0-4','cy',9)),'SC_POLYGON_DOT:0:4'));
    assert.ok(has(await audit(hist,svg.replace(/(id="polygon-s0"[^>]*points="[^"]*?)(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)( [^"]*")/,(m,a,x,y,z)=>a+x+','+(Number(y)+10)+z)),'SC_POLYGON_VERTEX'));
    assert.ok(has(await audit(hist,svg.replace(/(id="y-tick-6-label"[^>]*data-tex="\\displaystyle )6/,'$17')),'SC_TICK_VALUE_MISMATCH:y-tick-6'));
    assert.ok(has(await audit(hist,svg.replace('data-role="bar" data-series="0" data-class="1" data-highlight="0"','data-role="bar" data-series="0" data-class="1" data-highlight="1"')),'SC_BAR_HIGHLIGHT:1'));
    assert.ok(has(await audit({...hist,series:[{frequencies:[2,5,6,12,10,6]}]},svg),'SC_BAR_HEIGHT:5'));
    // two relative-frequency polygons
    svg=await compose(two,2);
    const pass=await audit(two,svg);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
    assert.ok(has(await audit(two,bump(svg,'vertex-s1-3','cy',8)),'SC_POLYGON_DOT:1:3'));
    assert.ok(has(await audit({...two,series:[two.series[0],{name:'C',relativeFrequencies:two.series[1].relativeFrequencies}]},svg),'SC_LEGEND_NAMES'));
    // stem and leaf, back to back
    svg=await compose(stem,3);
    assert.equal((await audit(stem,svg)).status,'PASS');
    assert.ok(has(await audit(stem,svg.replace(/(id="leaf-g0-2-5"[^>]*data-tex=")9/,'$18')),'SC_LEAVES_MISMATCH:g0:2'));
    assert.ok(has(await audit({...stem,marks:[{ranks:[9,11]}]},svg),'SC_MARK_SET_MISMATCH'));
    svg=await compose(stemTwo,4);
    const st=await audit(stemTwo,svg);assert.equal(st.status,'PASS',JSON.stringify(st.errors));
    // box plot
    svg=await compose(box,5);
    const bp=await audit(box,svg);assert.equal(bp.status,'PASS',JSON.stringify(bp.errors));
    assert.ok(has(await audit(box,bump(svg,'box-s0','x',9)),'SC_BOX_RANGE:0'));
    assert.ok(has(await audit(box,bump(bump(svg,'median-s1','x1',6),'median-s1','x2',6)),'SC_MEDIAN:1'));
    assert.ok(has(await audit({...box,series:[{name:'A반',values:[52,58,60,63,67,70,74,75,81,88,92]},box.series[1]]},svg),'SC_CAP:cap-s0-max'));
    // scatter
    svg=await compose(scatter,6);
    const sc=await audit(scatter,svg);assert.equal(sc.status,'PASS',JSON.stringify(sc.errors));assert.equal(sc.observed.onDiagonal,4);
    assert.ok(has(await audit(scatter,bump(svg,'pt-3','cx',10)),'SC_POINT_POSITION:3'));
    assert.ok(has(await audit(scatter,bump(svg,'pt-6','cy',10)),'SC_POINT_POSITION:6'));
    // dice table
    svg=await compose(dice,7);
    const dt=await audit(dice,svg);assert.equal(dt.status,'PASS',JSON.stringify(dt.errors));assert.equal(dt.observed.highlighted,7);
    assert.ok(has(await audit(dice,svg.replace('data-col="4" data-row="3" data-highlight="1"','data-col="4" data-row="3" data-highlight="0"')),'SC_CELL_HIGHLIGHT:4,3'));
    assert.ok(has(await audit({kind:'DICE_TABLE',highlight:{any:[{expr:'a+b',in:[2]},{expr:'a+b',in:[8]}]}},svg),'SC_CELL_HIGHLIGHT'));
    // tree
    svg=await compose(tree,8);
    const tr=await audit(tree,svg);assert.equal(tr.status,'PASS',JSON.stringify(tr.errors));
    assert.ok(has(await audit(tree,svg.replace(/(id="branch-n0.1.2-p"[^>]*data-tex="\\displaystyle \\frac\{)3(\}\{5\})/,'$14$2')),'SC_BRANCH_PROBABILITY:n0.1.2'));
    assert.ok(has(await audit(tree,svg.replace(/(id="path-n0.2.1"[^>]*data-tex="[^"]*=\\frac\{)8/,'$19')),'SC_PATH_PROBABILITY:n0.2.1'));
  }finally{await browser.close();}
});

test('render-plan routes a stat-chart plan and reports an unfaithful chart at its stage with the engine code',async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'stat-chart-'));
  const r=await renderPlan({item:{sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'},plan:plan({...hist,boundaries:['20','25','31','35']}),outDir:out});
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'stat-chart');assert.equal(r.capability,FIGURE_CAPABILITY);assert.match(r.detail,/STAT_CLASS_WIDTH_UNEQUAL/);
});
