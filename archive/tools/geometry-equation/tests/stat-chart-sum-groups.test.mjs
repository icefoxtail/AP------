// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (E34): classSums over classes that do not touch (classes:[0,1,2,4,5] or [[0,2],[4,5]]: one bracket per run, a stem from each down to one joining line, the sum
// under the middle of it) and unknownLabels[].relHeight (dotted outlines whose heights stand in a stated ratio). The independent observer re-derives all of it from the plan.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(0,90));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
// 23 연향중 2학기 기말 중1 q20: the class 50~55 is torn; the five visible classes (both sides of it) sum to 0.6
const torn={kind:'FREQUENCY_POLYGON',yKind:'RELATIVE',boundaries:['35','40','45','50','55','60','65'],series:[{relativeFrequencies:['0.12','0.16','0.20',null,'0.08','0.04']}],showValues:true,xTitle:'몸무게(kg)',yTitle:'상대도수',grid:true,
  classSums:[{series:0,classes:[[0,2],[4,5]],label:'0.6'},{series:0,from:3,to:3,label:'?'}]};
// three runs: a stem joins the middle one
const three={kind:'HISTOGRAM',boundaries:['0','10','20','30','40','50','60','70'],series:[{frequencies:[3,5,2,6,4,1,7]}],xTitle:'기록(회)',yTitle:'도수(명)',classSums:[{classes:[0,2,3,5,6],label:'19',unit:'명'}]};
// 23 연향중 2학기 기말 중1 q15: 2x is drawn twice as high as x
const ratio={kind:'HISTOGRAM',boundaries:['12','14','16','18','20','22','24'],series:[{frequencies:[4,6,null,5,null,2],total:50}],xTitle:'밝기(럭스)',yTitle:'도수(개)',grid:true,showValues:true,
  unknownLabels:[{class:2,label:'2x',relHeight:2},{class:4,label:'x',relHeight:1}],classSums:[{from:0,to:5,label:'50',unit:'개'}]};

test('the engine keeps the runs of a class-sum group in its model; a plain bracket keeps its old model',()=>{
  const a=solveStatChart(torn),b=solveStatChart({...torn,classSums:[{series:0,classes:[0,1,2,4,5],label:'0.6'},{series:0,from:3,to:3,label:'?'}]});
  assert.deepEqual(a.classSums.map(s=>[s.from,s.to,s.label,s.runs]),[[0,5,'0.6',[[0,2],[4,5]]],[3,3,'?',undefined]]);
  assert.deepEqual(b.classSums,a.classSums,'a list of class numbers and a list of runs are the same group');
  const merged=solveStatChart({...torn,classSums:[{classes:[0,1,2,3],label:'?'}]});     // adjacent classes make one run: a plain bracket
  assert.deepEqual(merged.classSums.map(s=>[s.from,s.to,s.runs]),[[0,3,undefined]]);
  assert.deepEqual(solveStatChart(three).classSums[0].runs,[[0,0],[2,3],[5,6]]);
  const old=solveStatChart({...torn,classSums:[{from:3,to:3,label:'?'}]});
  assert.ok(old.classSums.every(s=>!('runs' in s)&&!('members' in s)));
  // the sum counts every class of the group: the hidden class counts only when the whole group says what the hidden classes add up to
  assert.doesNotThrow(()=>solveStatChart({...torn,classSums:[{classes:[[0,2],[4,5]],label:'0.60'}]}));
  refuse({...torn,classSums:[{classes:[[0,2],[4,5]],label:'0.5'}]},'STAT_CLASS_SUM_LABEL_MISMATCH');
  assert.doesNotThrow(()=>solveStatChart({...three,classSums:[{classes:[0,2,3,5,6],label:'19',unit:'명'}]}));
  refuse({...three,classSums:[{classes:[0,2,3,5,6],label:'20',unit:'명'}]},'STAT_CLASS_SUM_LABEL_MISMATCH');
});

test('class-sum groups that cannot be drawn faithfully are refused with their codes',()=>{
  const sums=classSums=>({...three,classSums});
  for(const bad of [[{classes:[0],label:'3'}],[{classes:'0,2'}],[{classes:[2,0]}],[{classes:[1,1,3]}],[{classes:[[0,2],[2,4]]}],[{classes:[[3,1],[5,6]]}],[{classes:[[0,1,2],[4,5]]}],[{classes:[0,[2,3]]}],[{classes:[0,2.5]}],[{classes:[0,9]}],[{classes:[-1,2]}],
    [{classes:[0,2],from:0}],[{classes:[0,2],to:2}],[{classes:Array.from({length:25},(_,i)=>i)}]])
    refuse(sums(bad),'STAT_CLASS_SUM_INVALID');
  // no class twice: not inside two brackets of one series, nor in two groups
  refuse(sums([{classes:[0,2]},{from:2,to:3}]),'STAT_CLASS_SUM_OVERLAP');
  refuse(sums([{classes:[0,2]},{classes:[[1,1],[2,5]]}]),'STAT_CLASS_SUM_OVERLAP');
  assert.doesNotThrow(()=>solveStatChart(sums([{classes:[0,2]},{from:1,to:1},{classes:[3,5]}])));   // interleaved but sharing no class
  refuse(sums([{classes:[0,2],label:'?'}]),'STAT_CLASS_SUM_LABEL_INVALID');                    // "?" is for erased classes
  // a number needs a sum the engine can derive: a group that holds one of two erased classes cannot say what it adds up to
  const two={kind:'HISTOGRAM',boundaries:['0','10','20','30','40'],series:[{frequencies:[3,null,null,4],total:20}]};
  refuse({...two,classSums:[{classes:[0,1],label:'5'}]},'STAT_CLASS_SUM_UNKNOWN');
  assert.doesNotThrow(()=>solveStatChart({...two,classSums:[{classes:[[0,2],[3,3]],label:'20'}]}));
});

test('relHeight keeps the ratio of the outlines in the model; an outline plan without it keeps its old model',()=>{
  const m=solveStatChart(ratio);
  assert.deepEqual(m.unknown,[{class:2,label:'2x',relHeight:'2'},{class:4,label:'x',relHeight:'1'}]);
  const some=solveStatChart({...ratio,unknownLabels:[{class:2,label:'2x',relHeight:'2'},{class:4,label:'x'}]});
  assert.deepEqual(some.unknown.map(u=>u.relHeight),['2','1'],'an entry without relHeight counts as 1 once another has one');
  const old=solveStatChart({...ratio,unknownLabels:[{class:2,label:'2x'},{class:4,label:'x'}]});
  assert.ok(old.unknown.every(u=>!('relHeight' in u)));
  for(const bad of [0,-1,21,'x',true,null,'0.04','1/0'])
    refuse({...ratio,unknownLabels:[{class:2,label:'2x',relHeight:bad},{class:4,label:'x'}]},'STAT_UNKNOWN_LABEL_INVALID');
  assert.doesNotThrow(()=>solveStatChart({...ratio,unknownLabels:[{class:2,label:'3x',relHeight:'3/2'},{class:4,label:'x',relHeight:'1'}]}));
});

test('the observer passes class-sum groups and ratio outlines, and catches each one wrong',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(4000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const pass=async(chart,svg)=>{const r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));return r;};
    const bump=(svg,id,attr,delta)=>{const re=new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`);assert.ok(re.test(svg),id);return svg.replace(re,(m,head,x)=>head+(Number(x)+delta));};

    // ---- two runs on both sides of the torn class, the torn class's own "?" bracket above them
    let svg=await compose(torn,1);
    let r=await pass(torn,svg);assert.deepEqual(r.observed.sums,[[0,0,5,'0.6',[[0,2],[4,5]]],[0,3,3,'?']]);
    assert.equal((svg.match(/data-role="class-sum"/g)||[]).length,3,'two run brackets and the "?" bracket');
    assert.equal((svg.match(/data-role="class-sum-join"/g)||[]).length,1);
    assert.match(svg,/id="class-sum-0-label"[^>]*data-owner="class-sum-0-join"[^>]*data-text="0.6"/);
    // another sum, other runs, another label, a plain bracket asked for, no group asked for
    assert.equal((await audit({...torn,classSums:[{series:0,classes:[[0,2],[4,5]],label:'0.7'},torn.classSums[1]]},svg)).code,'STAT_CLASS_SUM_LABEL_MISMATCH','the plan itself must state the exact sum');
    assert.ok(has(await audit({...torn,classSums:[{series:0,classes:[[0,1],[4,5]]},torn.classSums[1]]},svg),'SC_CLASS_SUM_SET_MISMATCH'));
    assert.ok(has(await audit({...torn,classSums:[{series:0,from:0,to:2,label:'0.48'},torn.classSums[1]]},svg),'SC_CLASS_SUM_SET_MISMATCH'));
    assert.ok(has(await audit({...torn,classSums:[torn.classSums[1]]},svg),'SC_CLASS_SUM_SET_MISMATCH'));
    assert.equal((await audit({...torn,classSums:[{series:0,from:0,to:5},torn.classSums[1]]},svg)).code,'STAT_CLASS_SUM_OVERLAP','the observer refuses a plan that counts a class in two brackets');
    assert.ok(has(await audit({...torn,classSums:[{series:0,classes:[[0,2],[4,5]]},torn.classSums[1]]},svg),'SC_CLASS_SUM_LABEL_UNEXPECTED'),'the plan without a label has no label on the group');
    // the joining line: a stem moved, the line lowered, an end dropped, the join removed, the label off its middle or above the line
    assert.ok(has(await audit(torn,svg.replace(/(id="class-sum-0-join"[^>]*? points=")([\d.]+)/,(m,head,x)=>head+(Number(x)+6))),'SC_CLASS_SUM_JOIN_SHAPE'));
    assert.ok(has(await audit(torn,svg.replace(/(id="class-sum-0-join"[^>]*? points="[\d.]+,[\d.]+ [\d.]+,)([\d.]+)/,(m,head,y)=>head+(Number(y)+9))),'SC_CLASS_SUM_JOIN_SHAPE'));
    assert.ok(has(await audit(torn,svg.replace(/<g data-layer="50"><polyline id="class-sum-0-join"[^>]*\/><\/g>/,'')),'SC_CLASS_SUM_JOIN_SET'));
    assert.ok(has(await audit(torn,svg.replace(/(id="class-sum-0-label"[^>]*data-box=")([\d.]+)/,(m,head,x)=>head+(Number(x)+25))),'SC_CLASS_SUM_LABEL_NOT_CENTRED'));
    assert.ok(has(await audit(torn,svg.replace(/(id="class-sum-0-label"[^>]*data-box="[\d.]+,)([\d.]+)/,(m,head,y)=>head+(Number(y)-20))),'SC_CLASS_SUM_LABEL_NOT_BELOW'));
    // a run bracket that spans other classes
    assert.ok(has(await audit(torn,svg.replace(/(id="class-sum-0-run-2"[^>]*? points=")([\d.]+)/,(m,head,x)=>head+(Number(x)-70)).replace(/(id="class-sum-0-run-2"[^>]*? points="[\d.]+,[\d.]+ )([\d.]+)/,(m,head,x)=>head+(Number(x)-70))),'SC_CLASS_SUM_'));

    // ---- three runs: the middle one sends a stem to the joining line
    svg=await compose(three,2);
    r=await pass(three,svg);assert.deepEqual(r.observed.sums,[[0,0,6,'19',[[0,0],[2,3],[5,6]]]]);
    assert.equal((svg.match(/data-role="class-sum-stem"/g)||[]).length,1);
    assert.ok(has(await audit(three,bump(svg,'class-sum-0-stem-2','x1',5).replace(/(id="class-sum-0-stem-2"[^>]*? x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)+5))),'SC_CLASS_SUM_STEMS'));
    assert.ok(has(await audit(three,svg.replace(/<g data-layer="50"><line id="class-sum-0-stem-2"[^>]*\/><\/g>/,'')),'SC_CLASS_SUM_STEMS'));
    assert.equal((await audit({...three,classSums:[{classes:[0,2,3,5,6],label:'20',unit:'명'}]},svg)).code,'STAT_CLASS_SUM_LABEL_MISMATCH');
    assert.ok(has(await audit({...three,classSums:[{classes:[0,2,3,5,6],label:'19',unit:'회'}]},svg),'SC_CLASS_SUM_LABEL_VALUE'));

    // ---- relHeight: 2x twice as high as x, the higher one at the usual height
    svg=await compose(ratio,3);
    await pass(ratio,svg);
    const heightOf=id=>Number(new RegExp(`id="${id}"[^>]*? height="([\\d.]+)"`).exec(svg)[1]);
    assert.ok(Math.abs(heightOf('unknown-s0-2')-2*heightOf('unknown-s0-4'))<0.02,'twice as high');
    assert.ok(has(await audit({...ratio,unknownLabels:[{class:2,label:'2x',relHeight:3},{class:4,label:'x',relHeight:1}]},svg),'SC_UNKNOWN_HEIGHT'));
    assert.ok(has(await audit({...ratio,unknownLabels:[{class:2,label:'2x'},{class:4,label:'x'}]},svg),'SC_UNKNOWN_HEIGHT'));
    assert.ok(has(await audit(ratio,bump(svg,'unknown-s0-4','height',-0.5).replace(/(id="unknown-s0-4"[^>]*? y=")([\d.]+)/,(m,head,y)=>head+(Number(y)+0.5))),'SC_UNKNOWN_HEIGHT:4'));
    // an outline plan without relHeight draws exactly the old fixed height (every outline the same)
    const plain={...ratio,unknownLabels:[{class:2,label:'2x'},{class:4,label:'x'}]};
    const plainSvg=await compose(plain,4);
    assert.ok(Math.abs(Number(/id="unknown-s0-2"[^>]*? height="([\d.]+)"/.exec(plainSvg)[1])-Number(/id="unknown-s0-4"[^>]*? height="([\d.]+)"/.exec(plainSvg)[1]))<0.02);
    assert.equal((await audit(plain,plainSvg)).status,'PASS');
  }finally{await browser.close();}
});
