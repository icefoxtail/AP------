// Chrome-using (composes the figures): run with --test-concurrency=1.
// G16: stat-chart-figure-v1 panels in composite-panels-v1 (2 to 4 compact dot plots / scatter plots in a two-column grid, nothing else mixed in), each panel read back by the stat-chart observer.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,solveStatPanel,statChartSize,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';
import {compositePanels,compositePanelLayout,composeCompositeCandidate,compositeStackSize,isStatPanel} from '../production/composite-candidate-svg-v1.mjs';
import {FIGURE_CAPABILITY as SET_CAPABILITY} from '../production/set-diagram-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const dot=(values,marks)=>({capability:FIGURE_CAPABILITY,chart:{kind:'DOT_PLOT',values,...(marks?{marks}:{})}});
const scatter=extra=>({capability:FIGURE_CAPABILITY,chart:{kind:'SCATTER',points:[[10,90],[30,70],[50,52],[70,31],[90,8]].map(([x,y])=>({x:String(x),y:String(y)})),xRange:['0','100'],yRange:['0','100'],xStep:'20',yStep:'20',labelEvery:5,xTitle:'x',yTitle:'y',grid:false,...extra}});
const panel=(plan,caption)=>({caption:{text:caption},plan});
const composite=panels=>({capability:'composite-panels-v1',panels,caption:'통계 그림 여러 개'});
const four=[panel(dot([5,7,9,11],{meanLine:{value:'8'},deviations:true}),'처음'),panel(dot([10,14,18,22],{meanLine:{value:'16'},deviations:true}),'2배'),panel(scatter({trendArrow:{direction:'DOWN'}}),'③'),panel(scatter({}),'⑤')];
const stop=(panels,expected)=>assert.throws(()=>compositePanels(composite(panels)),error=>error.message===expected,expected);

test('stat panels form their own two-column grid of 2 to 4 compact figures, nothing else mixed in',()=>{
  const checked=compositePanels(composite(four));
  assert.equal(checked.length,4);assert.ok(checked.every(item=>isStatPanel(item.plan)));
  const layout=compositePanelLayout(checked);assert.deepEqual([layout.kind,layout.columns,layout.rows],['GRID',2,2]);
  assert.equal(compositePanels(composite(four.slice(0,2))).length,2);
  stop(four.slice(0,1),'COMPOSITE_STAT_PANEL_COUNT');stop([...four,panel(dot([1,2]),'다섯째')],'COMPOSITE_STAT_PANEL_COUNT');
  stop([four[0],{caption:{text:'벤'},plan:{capability:SET_CAPABILITY,diagram:{kind:'VENN',sets:[{id:'A'}]}}}],'COMPOSITE_SET_PANEL_MIXED_1');   // a Venn panel among them makes it the Venn grid, which takes nothing else
  stop([panel({capability:'composite-panels-v1'},'x'),four[0]],'COMPOSITE_STAT_PANEL_MIXED_1');
  stop([four[0],{caption:{text:'x'},plan:{...four[1].plan,caption:'c'}}],'PANEL_1:STAT_PANEL_PLAN_INVALID');
  stop([four[0],panel({capability:FIGURE_CAPABILITY,chart:{kind:'HISTOGRAM',boundaries:['0','10','20'],series:[{frequencies:[1,2]}]}},'x')],'PANEL_1:STAT_PANEL_KIND_UNSUPPORTED');
  stop([four[0],panel(dot([]),'x')],'PANEL_1:STAT_DOT_PLOT_INVALID');
  stop([four[0],panel(dot([1,2,3],{meanLine:{value:'5'}}),'x')],'PANEL_1:STAT_DOT_MEAN_MISMATCH');
  // a compact panel is narrow enough for the two columns of the Archive solution column, and a standalone figure is not changed by the panel code
  const sizes=checked.map(item=>statChartSize(solveStatPanel(item.plan.chart)));
  assert.ok(sizes.every(size=>size.width===420),JSON.stringify(sizes));assert.ok(compositeStackSize(sizes,0,layout).width<=848);
  assert.equal(statChartSize(solveStatChart(four[0].plan.chart)).width,548);assert.ok(!('compact' in solveStatChart(four[0].plan.chart)));
  assert.throws(()=>solveStatChart({kind:'BOX_PLOT',series:[{name:'a',values:[1,2,3,4]}]},{compact:true}),error=>error.message==='STAT_PANEL_KIND_UNSUPPORTED');
  assert.throws(()=>solveStatPanel({...scatter({pointGroups:[{points:[[10,90]],color:'BLUE',label:'범례'}]}).chart}),error=>error.message==='STAT_SCATTER_GROUP_INVALID');   // a panel has no room for a legend
});

test('four stat panels compose as one 2x2 composite whose panel bytes pass the stat-chart observer',async()=>{
  const browser=await launchBrowser();
  try{
    const checked=compositePanels(composite(four));
    const panels=checked.map(item=>({plan:item.plan,model:solveStatPanel(item.plan.chart)}));
    const {width}=compositeStackSize(panels.map(panel=>statChartSize(panel.model)),0,compositePanelLayout(checked));
    const composed=await composeCompositeCandidate({plan:{...composite(four),panels:checked.map(item=>({caption:item.caption,plan:item.plan}))},panels,
      identity:assetIdentity('25_테스트|11','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:32,displayScale:Math.min(1,320/width),fontFloorCssPx:11},browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.layout.kind,'GRID');assert.deepEqual([composed.layout.columns,composed.layout.rows],[2,2]);
    assert.equal(composed.panels.length,4);
    assert.ok(composed.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'),JSON.stringify(composed.panels.map(item=>item.staticAudit.errors)));
    assert.match(composed.svg,/data-composite="composite-panels-v1"/);
    // the observer reads each panel as a compact figure: only dot and scatter plots, and only at the panel width
    const {compositePanelBytes}=await import('../production/composite-candidate-svg-v1.mjs');
    const bytes=compositePanelBytes(composed.svg);assert.equal(bytes.length,4);
    const first=bytes[0].bytes.toString('utf8');
    const read=async(chart,svg,compact)=>(await pythonWorker({chart,svg,...(compact?{compact:true}:{})},{script:observer})).result;
    assert.equal((await read(four[0].plan.chart,first,true)).status,'PASS');
    assert.ok((await read({kind:'HISTOGRAM'},first,true)).code==='STAT_PANEL_KIND_UNSUPPORTED');
    const wide=first.replace(/width="420"/,'width="430"');
    assert.ok((await read(four[0].plan.chart,wide,true)).errors.includes('SC_PANEL_WIDTH'));
  }finally{await browser.close();}
});
