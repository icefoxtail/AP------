// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (G16): DOT_PLOT marks: a dashed line at the mean and the median (the value is checked against the data), recoloured columns and the deviation written over each column.
// The observer re-derives all of it from the plan's data; a plan without marks draws exactly what it always drew.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(-120));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
// 25 연향중 2학기 기말 중3 q16: eight rolls of an eight-faced die (sum 32, mean 4, median 4.5, mode 5)
const base={kind:'DOT_PLOT',values:[1,2,3,4,5,5,5,7],xTitle:'나온 수'};
const marked={...base,marks:{meanLine:{value:'4'},medianLine:{value:'9/2'},highlight:[{value:5,color:'BLUE'}],deviations:true}};

test('the engine checks the mean and median against the data and keeps a plan without marks as it was',()=>{
  const m=solveStatChart(marked);
  assert.deepEqual(m.marks.meanLine,{value:'4',label:'평균 4'});assert.deepEqual(m.marks.medianLine,{value:'4.5',label:'중앙값 4.5'});
  assert.deepEqual(m.marks.highlight,[{value:'5',count:3,color:'BLUE'}]);
  assert.deepEqual(m.marks.deviations.map(d=>[d.value,d.deviation]),[['1','-3'],['2','-2'],['3','-1'],['4','0'],['5','1'],['7','3']]);
  assert.ok(!('marks' in solveStatChart(base)),'no marks key in the model of a plan that has none');
  assert.equal(solveStatChart({...base,marks:{meanLine:{value:'4',label:'평균'}}}).marks.meanLine.label,'평균');
  assert.equal(solveStatChart({...base,marks:{highlight:[{value:5,count:2,color:'ROSE'}]}}).marks.highlight[0].count,2);
  // a mean that is not a finite decimal is written as the fraction and may be given as one: 1,2,2,3,4,4,5,33 has the mean 27/4 = 6.75
  assert.equal(solveStatChart({kind:'DOT_PLOT',values:[1,2,3,4],marks:{meanLine:{value:'5/2'}}}).marks.meanLine.value,'2.5');
});

test('marks that the data or the picture cannot carry are refused with their codes',()=>{
  const g=marks=>({...base,marks});
  refuse(g({meanLine:{value:'5'}}),'STAT_DOT_MEAN_MISMATCH');refuse(g({medianLine:{value:'4'}}),'STAT_DOT_MEDIAN_MISMATCH');
  refuse(g({}),'STAT_DOT_MARKS_INVALID');refuse(g({other:1}),'STAT_DOT_MARKS_INVALID');refuse(g({meanLine:{}}),'STAT_DOT_MARKS_INVALID');refuse(g({meanLine:{value:'4',extra:1}}),'STAT_DOT_MARKS_INVALID');
  refuse(g({meanLine:{value:'4',label:'아주 아주 아주 긴 이름입니다 정말'}}),'STAT_DOT_MARKS_INVALID');refuse(g({deviations:false}),'STAT_DOT_MARKS_INVALID');
  refuse(g({highlight:[{value:6,color:'BLUE'}]}),'STAT_DOT_HIGHLIGHT_UNKNOWN_VALUE');
  for(const bad of [[],[{value:5,color:'RED'}],[{value:5}],[{value:5,color:'BLUE',count:4}],[{value:5,color:'BLUE',count:0}],[{value:5,color:'BLUE'},{value:5,color:'ROSE'}],[{value:'5',color:'BLUE'}]])refuse(g({highlight:bad}),'STAT_DOT_HIGHLIGHT_INVALID');
  // the mean of 1,2,2,3,4,4,5,33 is 6.75: past the end of the first part of a line cut between 5 and 33
  const cut={kind:'DOT_PLOT',values:[1,2,2,3,4,4,5,33],axisBreak:{from:5,to:33}};
  refuse({...cut,marks:{meanLine:{value:'6.75'}}},'STAT_DOT_MARK_OFF_AXIS');
  assert.equal(solveStatChart({...cut,marks:{medianLine:{value:'3.5'}}}).marks.medianLine.value,'3.5');
});

test('the observer passes a dot plot with marks and catches each wrong line, colour or deviation',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(7000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const bump=(svg,id,attr,delta)=>{const re=new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`);assert.ok(re.test(svg),id);return svg.replace(re,(m,head,x)=>head+(Number(x)+delta));};
    const svg=await compose(marked,1);
    const r=await audit(marked,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));
    assert.ok(/id="mean-line"/.test(svg)&&/id="median-line"/.test(svg));assert.equal((svg.match(/data-label-role="deviation"/g)||[]).length,6);
    assert.equal((svg.match(/fill="#1f5fa8"/g)||[]).length,3,'the three dots of 5 are blue');
    // the mean moved, the line shortened, the name changed, a colour dropped, a deviation changed
    assert.ok(has(await audit(marked,bump(svg,'mean-line','x1',6).replace(/(id="mean-line"[^>]*? x2=")([\d.]+)/,(m,h,x)=>h+(Number(x)+6))),'SC_DOT_MARK_PLACE:mean-line'));
    assert.ok(has(await audit(marked,bump(svg,'median-line','y2',90)),'SC_DOT_MARK_SHORT:median-line'));
    assert.ok(has(await audit({...marked,marks:{...marked.marks,meanLine:{value:'4',label:'평균 5'}}},svg),'SC_DOT_MARK_LABEL:mean-line'));
    assert.ok(has(await audit({...marked,marks:{...marked.marks,highlight:[{value:5,count:2,color:'BLUE'}]}},svg),'SC_DOT_COLOR:5:3'));
    assert.ok(has(await audit({...marked,marks:{...marked.marks,highlight:[{value:5,color:'ROSE'}]}},svg),'SC_DOT_COLOR:5:1'));
    assert.ok(has(await audit({...marked,marks:{...marked.marks,highlight:undefined}},svg),'SC_DOT_COLOR'));
    assert.ok(has(await audit(base,svg),'SC_DOT_'),'a figure drawn with marks is not the plain plan');
    assert.ok(has(await audit({...marked,marks:{...marked.marks,deviations:undefined}},svg),'SC_DOT_DEVIATION_UNEXPECTED'));
    assert.ok(has(await audit(marked,svg.replace(/(id="dev-7"[^>]*data-tex=")\\displaystyle \+3/,'$1\\displaystyle +2')),'SC_DOT_DEVIATION_VALUE:7'));
    assert.equal((await pythonWorker({chart:wire({...base,marks:{meanLine:{value:'5'}}}),svg},{script:observer})).result.code,'STAT_DOT_MEAN_MISMATCH');
    // a plan without marks still composes the same figure as before and carries none of the new elements
    const plain=await compose(base,2);
    assert.ok(!/mean-line|median-line|deviation|#1f5fa8/.test(plain));
    assert.ok(has(await audit(marked,plain),'SC_DOT_'),'the marks of the plan are missing from a plain figure');
    // two lines close together keep their names apart; a line on the same value is drawn once per mark
    const close={kind:'DOT_PLOT',values:[1,2,3,4,5,5,5,6],xTitle:'수',marks:{meanLine:{value:'31/8'},medianLine:{value:'4.5'}}};
    const svg2=await compose(close,3);assert.equal((await audit(close,svg2)).status,'PASS');
  }finally{await browser.close();}
});
