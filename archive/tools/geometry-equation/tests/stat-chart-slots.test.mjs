// Chrome-using (composes figures): run with --test-concurrency=1.
// stat-chart-figure-v1 SLOTS (EXT-20261109-g): a row of boxes (a count of ways, or a fixed letter), an optional title above each, the rule's sign between two neighbouring count boxes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSpec,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),error=>error.message===expected,expected);
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>(result.errors??[]).some(error=>error.startsWith(prefix));
// 24 효천 고1 q03: E _ _ _ _ _ E with the five middle places counted 5,4,3,2,1
const row={kind:'SLOTS',slots:[{fixed:'E',title:'첫째'},{count:'5',title:'둘째'},{count:'4',title:'셋째'},{count:'3',title:'넷째'},{count:'2'},{count:'1'},{fixed:'E',title:'일곱째'}]};

test('the model and the spec of a slot row',()=>{
  const m=solveStatChart(row);
  assert.equal(m.slots.length,7);assert.equal(m.join,'TIMES');
  const spec=statChartSpec(plan(row),m,{fontPx:20});
  assert.equal(spec.prims.filter(p=>p.role==='slot').length,7);
  assert.deepEqual(spec.labels.filter(l=>l.role==='slot-sign').map(l=>l.id),['slot-sign-1','slot-sign-2','slot-sign-3','slot-sign-4']);   // between two count boxes only
  assert.ok(spec.labels.filter(l=>l.role==='slot-title').every(l=>l.kind==='TEXT'&&l.weight==='MATH'));
  assert.ok(spec.labels.filter(l=>l.role==='slot-value').every(l=>l.kind==='MATH'));
  assert.equal(statChartSpec(plan({...row,join:'PLUS'}),solveStatChart({...row,join:'PLUS'}),{fontPx:20}).labels.find(l=>l.role==='slot-sign').tex,'+');
});
test('a slot row that cannot be drawn is refused',()=>{
  const s=slots=>({kind:'SLOTS',slots});
  refuse(s([{count:'3'}]),'STAT_SLOTS_INVALID');
  refuse(s(Array.from({length:9},()=>({count:'2'}))),'STAT_SLOTS_INVALID');
  refuse(s([{count:'3'},{count:'2',fixed:'E'}]),'STAT_SLOTS_INVALID');
  refuse(s([{count:'3'},{}]),'STAT_SLOTS_INVALID');
  refuse(s([{fixed:'E'},{fixed:'F'}]),'STAT_SLOTS_NO_COUNT');
  refuse(s([{count:'0'},{count:'2'}]),'STAT_SLOTS_COUNT_INVALID');
  refuse(s([{count:'12345'},{count:'2'}]),'STAT_SLOTS_COUNT_INVALID');
  refuse(s([{count:'3'},{fixed:'toolong'}]),'STAT_SLOTS_FIXED_INVALID');
  refuse(s([{count:'3',title:'가나다라마'},{count:'2'}]),'STAT_SLOTS_TITLE_INVALID');
  refuse({...s([{count:'3'},{count:'2'}]),join:'MINUS'},'STAT_SLOTS_JOIN_INVALID');
  refuse({...s([{count:'3'},{count:'2'}]),extra:1},'STAT_CHART_PLAN_INVALID');
});

test('a slot row is composed, the observer passes it and catches a changed count or a missing sign',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await composeStatChartFigure({plan:plan(wire(row)),model:solveStatChart(row),identity:assetIdentity('24_테스트|7200','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
    const svg=composed.svg;
    const audit=async(chart,text)=>(await pythonWorker({chart:wire(chart),svg:text},{script:observer})).result;
    const ok=await audit(row,svg);assert.equal(ok.status,'PASS',JSON.stringify(ok.errors));assert.deepEqual(ok.observed.counts,['5','4','3','2','1']);
    // the plan names another count: the drawn number no longer matches
    const other=wire(row);other.slots[1].count='6';assert.ok(has(await audit(other,svg),'SC_SLOT_VALUE:1'));
    // a count box turned into a fixed one, and a title the plan does not have
    const swapped=wire(row);swapped.slots[2]={fixed:'E',title:'셋째'};assert.ok(has(await audit(swapped,svg),'SC_SLOT_KIND:2'));
    const untitled=wire(row);delete untitled.slots[1].title;assert.ok(has(await audit(untitled,svg),'SC_SLOT_TITLE_UNEXPECTED:1'));
    // a sign removed from the drawing, and a box moved off its place
    const noSign=svg.replace(/<g data-layer="90"><g id="slot-sign-2"[\s\S]*?<\/svg><\/g><\/g>/,'');assert.notEqual(noSign,svg);assert.ok(has(await audit(row,noSign),'SC_SLOT_SIGNS'));
    const moved=svg.replace(/(id="slot-3" data-role="slot"[^>]*? x=")([\d.]+)/,(m,head,x)=>head+(Number(x)+9));assert.notEqual(moved,svg);assert.ok(has(await audit(row,moved),'SC_SLOT_PITCH:3'));
    // the product-rule sign is the plan's join: the same drawing read against a sum-rule plan is wrong
    assert.ok(has(await audit({...wire(row),join:'PLUS'},svg),'SC_SLOT_SIGN_TEX:'));
  }finally{await browser.close();}
});
