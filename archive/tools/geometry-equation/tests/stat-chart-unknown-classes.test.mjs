// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (E30): the class a problem erased drawn as a dotted outline carrying a symbol (unknownLabels), a class-sum bracket over known and erased
// classes with a stated free text (6명), and the zero end points of a polygon writing their 0 (showEndValues). The independent observer re-derives all of it.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(0,80));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
// 23 연향중 2학기 기말 중1 q15: two classes torn off (x and 2x), 50 in all
const torn={kind:'HISTOGRAM',boundaries:['12','14','16','18','20','22','24'],series:[{frequencies:[4,6,null,5,null,2],total:50}],xTitle:'밝기(럭스)',yTitle:'도수(개)',grid:true,showValues:true,
  unknownLabels:[{class:2,label:'x'},{class:4,label:'2x'}],classSums:[{from:0,to:5,label:'50',unit:'개'}]};
// 24 연향중 2학기 중간 중1 q18: the 160~170 class erased, 160 cm and over is 6 students (a stated fact: the 140~150 class is erased too and no total is given)
const stated={kind:'HISTOGRAM',boundaries:['130','140','150','160','170','180'],series:[{frequencies:[4,null,9,null,3]}],xTitle:'키(cm)',yTitle:'학생 수(명)',grid:true,showValues:true,
  unknownLabels:[{class:3,label:'x'}],classSums:[{from:3,to:4,label:'6명'}]};
// 24 향림중 2학기 기말 중1 q19: a polygon whose zero end points write their 0
const ends={kind:'FREQUENCY_POLYGON',boundaries:['10','20','30','40','50','60'],series:[{name:'배우 수',frequencies:[1,12,null,4,2],total:30}],xTitle:'나이(세)',yTitle:'도수(명)',showValues:true,showEndValues:true,classSums:[{from:2,to:2,label:'?'}]};

test('the engine keeps the symbols, the stated sums and the end values in its model, and a plan without them keeps its old model',()=>{
  const m=solveStatChart(torn);
  assert.deepEqual(m.unknown,[{class:2,label:'x'},{class:4,label:'2x'}]);
  assert.deepEqual(m.classSums.map(s=>[s.from,s.to,s.label,s.unit,s.free]),[[0,5,'50','개',undefined]]);
  const s=solveStatChart(stated);
  assert.deepEqual(s.classSums.map(x=>[x.from,x.to,x.label,x.unit,x.free]),[[3,4,'6명','',true]]);
  assert.equal(solveStatChart(ends).showEndValues,true);
  const old=solveStatChart({kind:'HISTOGRAM',boundaries:['0','10','20'],series:[{frequencies:[3,5]}]});
  assert.ok(!('unknown' in old)&&!('showEndValues' in old));
  // a free text whose leading number the engine can sum is checked: all hidden classes inside the bracket and the total stated
  const derivable=label=>solveStatChart({...torn,unknownLabels:undefined,classSums:[{from:2,to:4,label}]});
  assert.doesNotThrow(()=>derivable('38개'));                                    // class 3 (5) + the two hidden classes together (50-17=33)
  assert.throws(()=>derivable('39개'),code('STAT_CLASS_SUM_LABEL_MISMATCH'));
  assert.doesNotThrow(()=>derivable('합계'));                                    // no number: nothing to check
});

test('unknown classes, stated sums and end values that cannot be drawn faithfully are refused with their codes',()=>{
  const some=extra=>({...torn,...extra});
  refuse(some({unknownLabels:[{class:0,label:'x'}]}),'STAT_UNKNOWN_LABEL_CLASS_KNOWN');
  refuse(some({unknownLabels:[]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:'x'}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:[{class:2,label:'x'},{class:2,label:'y'}]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:[{class:6,label:'x'}]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:[{class:2.5,label:'x'}]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:[{class:2,label:''}]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:[{class:2,label:' x'}]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:[{class:2,label:'x/2'}]}),'STAT_UNKNOWN_LABEL_INVALID');
  assert.doesNotThrow(()=>solveStatChart(some({unknownLabels:[{class:2,label:'?'},{class:4,label:'?'}]})));
  refuse(some({unknownLabels:[{class:2,label:'가'}]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({unknownLabels:[{class:2,label:'x',value:3}]}),'STAT_UNKNOWN_LABEL_INVALID');
  refuse(some({kind:'FREQUENCY_POLYGON',classSums:undefined}),'STAT_UNKNOWN_LABEL_UNSUPPORTED');
  refuse(some({polygon:true}),'STAT_UNKNOWN_LABEL_UNSUPPORTED');
  refuse({...ends,showEndValues:'yes'},'STAT_SHOW_END_VALUES_UNSUPPORTED');
  refuse({...torn,unknownLabels:undefined,showEndValues:true},'STAT_SHOW_END_VALUES_UNSUPPORTED');         // a histogram without its polygon has no end points
  refuse({...ends,series:[{name:'A',frequencies:[1,2,3,4,5]},{name:'B',frequencies:[2,3,4,5,6]}],showValues:false,classSums:undefined},'STAT_SHOW_END_VALUES_UNSUPPORTED');
  // class sums: a bare number needs a sum the engine can derive; free text states a fact but takes no unit and only plain characters
  refuse({...stated,unknownLabels:undefined,classSums:[{from:3,to:4,label:'6'}]},'STAT_CLASS_SUM_UNKNOWN');
  refuse({...stated,classSums:[{from:3,to:4,label:'6명',unit:'명'}]},'STAT_CLASS_SUM_LABEL_INVALID');
  refuse({...stated,classSums:[{from:3,to:4,label:'여섯명이나되는학생들입니다'}]},'STAT_CLASS_SUM_LABEL_INVALID');
  refuse({...stated,classSums:[{from:3,to:4,label:'6 <명'}]},'STAT_CLASS_SUM_LABEL_INVALID');
  refuse({...stated,classSums:[{from:3,to:4,label:' 6명'}]},'STAT_CLASS_SUM_LABEL_INVALID');
});

test('the observer passes the dotted outlines, the stated sum and the end values, and catches each one wrong',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(3000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const pass=async(chart,svg)=>{const r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));return r;};
    const bump=(svg,id,attr,delta)=>{const re=new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`);assert.ok(re.test(svg),id);return svg.replace(re,(m,head,x)=>head+(Number(x)+delta));};

    // ---- the torn classes: two dotted outlines with their symbols, no bar, the bracket of all six classes
    let svg=await compose(torn,1);
    let r=await pass(torn,svg);assert.deepEqual(r.observed.unknown,[[2,'x'],[4,'2x']]);
    assert.equal((svg.match(/data-role="bar-unknown"/g)||[]).length,2);assert.equal((svg.match(/data-label-role="unknown-label"/g)||[]).length,2);
    assert.ok(!/id="bar-s0-2"|id="bar-s0-4"/.test(svg),'a symbol is not a bar');
    assert.match(svg,/id="unknown-s0-2"[^>]*stroke-dasharray="1\.5 3\.5"/);
    // a different symbol, a missing outline, a stray outline, a moved, tall or solid one, a label elsewhere
    assert.ok(has(await audit({...torn,unknownLabels:[{class:2,label:'y'},torn.unknownLabels[1]]},svg),'SC_UNKNOWN_LABEL_VALUE:2'));
    assert.ok(has(await audit({...torn,unknownLabels:[torn.unknownLabels[0]]},svg),'SC_UNKNOWN_SET_MISMATCH'));
    assert.ok(has(await audit({...torn,unknownLabels:undefined},svg),'SC_UNKNOWN_SET_MISMATCH'));
    assert.ok(has(await audit(torn,svg.replace(/<g data-layer="40"><rect id="unknown-s0-4"[^>]*\/><\/g>/,'')),'SC_UNKNOWN_SET_MISMATCH'));
    assert.ok(has(await audit(torn,bump(svg,'unknown-s0-2','x',8)),'SC_UNKNOWN_X_RANGE:2'));
    assert.ok(has(await audit(torn,bump(svg,'unknown-s0-2','height',30)),'SC_UNKNOWN_HEIGHT:2'));
    assert.ok(has(await audit(torn,svg.replace(/(id="unknown-s0-4"[^>]*?) stroke-dasharray="[^"]*"/,'$1')),'SC_UNKNOWN_STYLE:4'));
    assert.ok(has(await audit(torn,svg.replace(/(id="unknown-s0-4"[^>]*?)fill="none"/,'$1fill="#ececec"')),'SC_UNKNOWN_STYLE:4'));
    assert.ok(has(await audit(torn,svg.replace(/(id="unknown-2-label"[^>]*data-box=")([\d.]+)/,(m,head,x)=>head+(Number(x)+30))),'SC_UNKNOWN_LABEL_NOT_CENTRED:2'));
    // an unknown class must be a class the plan hides
    assert.equal((await audit({...torn,series:[{frequencies:[4,6,3,5,null,2],total:50}]},svg)).code,'STAT_UNKNOWN_LABEL_CLASS_KNOWN');

    // ---- the stated sum: written exactly as given, over its own classes
    svg=await compose(stated,2);
    r=await pass(stated,svg);assert.deepEqual(r.observed.sums,[[0,3,4,'6명']]);
    assert.match(svg,/id="class-sum-0-label"[^>]*data-text="6명"/);
    assert.ok(has(await audit({...stated,classSums:[{from:3,to:4,label:'7명'}]},svg),'SC_CLASS_SUM_LABEL_VALUE:0-3-4'));
    assert.ok(has(await audit({...stated,classSums:[{from:2,to:4,label:'6명'}]},svg),'SC_CLASS_SUM_SET_MISMATCH'));
    const word=await compose({...stated,classSums:[{from:3,to:4,label:'합계'}]},3);
    await pass({...stated,classSums:[{from:3,to:4,label:'합계'}]},word);
    assert.ok(has(await audit({...stated,classSums:[{from:3,to:4,label:'합계'}]},svg),'SC_CLASS_SUM_LABEL_VALUE:0-3-4'));

    // ---- the polygon's zero end points write their 0 near themselves, nowhere else
    svg=await compose(ends,4);
    await pass(ends,svg);
    assert.equal((svg.match(/data-label-role="end-value"/g)||[]).length,2);
    assert.match(svg,/id="end-value-first"[^>]*data-owner="vertex-s0-0"/);assert.match(svg,/id="end-value-last"[^>]*data-owner="vertex-s0-6"/);
    assert.ok(has(await audit({...ends,showEndValues:undefined},svg),'SC_END_VALUES_UNEXPECTED'));
    const without=await compose({...ends,showEndValues:undefined},5);
    assert.ok(has(await audit(ends,without),'SC_END_VALUE_SET_MISMATCH'));
    assert.ok(has(await audit(ends,svg.replace(/(id="end-value-first"[^>]*?data-tex=")\\displaystyle 0/,'$1\\displaystyle 1')),'SC_END_VALUE_VALUE:0'));
    assert.ok(has(await audit(ends,svg.replace(/(id="end-value-last"[^>]*data-box=")([\d.]+)/,(m,head,x)=>head+(Number(x)+120))),'SC_END_VALUE_FAR_FROM_POINT:6'));
    assert.ok(has(await audit(ends,svg.replace('data-owner="vertex-s0-6"','data-owner="vertex-s0-5"')),'SC_END_VALUE_OWNER:6'));
  }finally{await browser.close();}
});
