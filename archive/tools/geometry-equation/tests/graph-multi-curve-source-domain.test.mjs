import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const CAPABILITY='multi-curve-figure-v1';
const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const q16=(q)=>({
  capability:CAPABILITY,
  caption:q==='0'?'q=0':'q=-3',
  graphPlan:{
    family:'multi-curve',
    viewport:[-2,1.5,-1,5],
    curves:[
      {id:'rational',kind:'RATIONAL',numerator:q==='0'?['1','0']:['1','-3'],denominator:['0','1'],domain:{from:'-2',to:'1/3',toState:'OPEN'},abs:true},
      {id:'radical',kind:'SQRT',radicand:['-1/3','1'],domain:['1/3','3/2']}
    ],
    axisTickValues:{x:[1/3],y:[]}
  }
});
const cases=[q16('0'),q16('-3')];
const frame=graphPlan=>pythonWorker({action:'frame_graph',graphPlan});
const model=graphPlan=>pythonWorker({action:'graph',graphPlan});
const observe=(graphPlan,svg,transform)=>pythonWorker({graphPlan,svg,transform},{script:observerScript});
const fixture=async plan=>{
  const framed=await frame(plan.graphPlan);assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const graphPlan=framed.result.graphPlan,built=await model(graphPlan);assert.equal(built.status,'OK',JSON.stringify(built.result));
  const passed=await observe(graphPlan,built.result.svg,built.result.transform);
  assert.equal(passed.status,'OK',JSON.stringify(passed.result));assert.equal(passed.result.status,'PASS',JSON.stringify(passed.result));
  return {graphPlan,model:built.result};
};
const marker=(svg,id)=>{
  const found=svg.match(new RegExp(`<circle\\b(?=[^>]*\\bid="${id}")[^>]*/>`));
  assert.ok(found,'missing marker '+id);return found[0];
};

test('Q16 source model keeps the exact pole split, open rational end and closed square-root start in both cases',async()=>{
  for(const plan of cases){
    const {graphPlan,model:built}=await fixture(plan),features=graphPlan.multiCurveFeatures.curves;
    const rational=features.find(row=>row.id==='rational'),radical=features.find(row=>row.id==='radical');
    assert.deepEqual(rational.branches.map(row=>row.side),['LEFT','RIGHT']);
    assert.deepEqual(rational.branches.map(row=>row.xInterval),[['-2','0'],['0','1/3']]);
    assert.deepEqual(rational.domainStates,['NONE','OPEN']);
    assert.equal(rational.interval[1],'1/3');
    assert.deepEqual(radical.start,{x:'1/3',y:'0',drawn:true});
    assert.doesNotMatch(built.svg,/id="asymptote-rational-v"|data-branch="ASYM_rational_V"/,'the x=0 pole is separated into two branches and not redrawn over the y-axis');
    assert.match(built.svg,/id="domain-endpoint-rational-to"[^>]*data-state="OPEN"/);
    assert.match(built.svg,/id="curve-radical-start"[^>]*fill="#111"/);
    const spec=specFor({...plan,graphPlan},built,`q16-${plan.caption}`);
    const branchObjects=spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH'&&object.branch.startsWith('CURVE_'));
    assert.deepEqual(branchObjects.map(object=>object.branch).sort(),['CURVE_radical','CURVE_rational_L','CURVE_rational_R']);
    assert.ok(spec.displayFacts.multiCurveMarks.some(mark=>mark.kind==='SOURCE_ENDPOINT'&&mark.curve==='rational'&&mark.which==='to'&&mark.state==='OPEN'));
  }
  const negative=(await fixture(cases[1])).model.svg;
  const open=marker(negative,'domain-endpoint-rational-to'),closed=marker(negative,'curve-radical-start');
  const openXY=[open.match(/cx="([^"]+)"/)[1],open.match(/cy="([^"]+)"/)[1]];
  const closedXY=[closed.match(/cx="([^"]+)"/)[1],closed.match(/cy="([^"]+)"/)[1]];
  assert.deepEqual(openXY,closedXY,'q=-3 has separate rational-open and sqrt-closed owners at (1/3,0)');
  assert.match(closed,/r="2\.4"/,'the filled start remains visible inside the open ring');
});

test('the independent observer rejects endpoint ownership, state, fill, coordinate, and inventory tampering',async()=>{
  const {graphPlan,model:built}=await fixture(cases[1]);
  const open=marker(built.svg,'domain-endpoint-rational-to'),closed=marker(built.svg,'curve-radical-start');
  const casesToReject=[
    ['missing open endpoint',built.svg.replace(open,'')],
    ['duplicate open endpoint',built.svg.replace(open,open+open)],
    ['closed rational endpoint',built.svg.replace(open,open.replace('fill="#fff"','fill="#111"'))],
    ['wrong owner',built.svg.replace(open,open.replace('data-curve="rational"','data-curve="radical"'))],
    ['moved open endpoint',built.svg.replace(open,open.replace(/cx="([^"]+)"/,(_match,value)=>`cx="${Number(value)+1}"`))],
    ['open square-root start',built.svg.replace(closed,closed.replace('fill="#111"','fill="#fff"'))],
    ['missing rational pole branch',built.svg.replace(/<polyline\b(?=[^>]*data-branch="CURVE_rational_R")[^>]*\/>/,'')]
  ];
  for(const [label,svg] of casesToReject){
    const result=await observe(graphPlan,svg,built.transform);
    assert.equal(result.result.status,'FAIL',label+': '+JSON.stringify(result.result));
  }
  const swapped=structuredClone(graphPlan);swapped.curves[0].domainStates=['NONE','CLOSED'];
  const stateTamper=await observe(swapped,built.svg,built.transform);
  assert.equal(stateTamper.result.status,'FAIL');assert.match(JSON.stringify(stateTamper.result.errors),/INVENTORY_MISMATCH|ENDPOINT/);
  const missingFeature=structuredClone(graphPlan);missingFeature.multiCurveFeatures.curves[0].branches.pop();
  const featureTamper=await observe(missingFeature,built.svg,built.transform);
  assert.equal(featureTamper.result.status,'FAIL');assert.match(JSON.stringify(featureTamper.result.errors),/INVENTORY_MISMATCH|PRIMITIVE_INVENTORY/);
});

test('invalid source states and open natural square-root starts remain rejected',async()=>{
  for(const [mutate,code] of [
    [plan=>{plan.curves[0].domain.toState='SIDEWAYS';},'MULTI_CURVE_DOMAIN_STATE_INVALID:rational'],
    [plan=>{plan.curves[0].domain={from:'0',to:'1/3',fromState:'CLOSED',toState:'OPEN'};},'MULTI_CURVE_DOMAIN_INVALID:rational'],
    [plan=>{plan.curves[1].domain={from:'1/3',to:'3/2',fromState:'OPEN'};},'MULTI_CURVE_DOMAIN_STATE_INVALID:radical']
  ]){
    const plan=structuredClone(cases[1].graphPlan);mutate(plan);
    const result=await frame(plan);assert.notEqual(result.status,'OK');assert.match(JSON.stringify(result.result),new RegExp(code));
  }
});

test('an open rational source endpoint at the pole draws one one-sided branch without a finite pole marker',async()=>{
  const graphPlan={
    family:'multi-curve',
    viewport:[4,8,-6,5],
    curves:[
      {id:'rational',kind:'RATIONAL',numerator:['13','-2'],denominator:['-6','1'],domain:{from:'6',to:'8',fromState:'OPEN',toState:'CLOSED'}},
      {id:'radical',kind:'SQRT',radicand:['6','-1'],amplitude:'-1',offset:'-2',domain:{from:'4',to:'6',toState:'CLOSED'}}
    ],
    axisTickValues:{x:[],y:[]}
  };
  const {graphPlan:framed,model:built}=await fixture({graphPlan});
  const rational=framed.multiCurveFeatures.curves.find(row=>row.id==='rational');
  assert.deepEqual(rational.domainStates,['OPEN','CLOSED']);
  assert.deepEqual(rational.branches.map(row=>row.side),['RIGHT']);
  assert.deepEqual(rational.branches[0].xInterval,['6','8']);
  assert.doesNotMatch(built.svg,/id="domain-endpoint-rational-from"/,'the open pole has no finite endpoint marker');
  assert.match(built.svg,/id="domain-endpoint-rational-to"[^>]*data-state="CLOSED"/,'the finite closed endpoint remains marked');
  assert.match(built.svg,/id="curve-radical-start"[^>]*fill="#111"/,'the co-located square-root endpoint remains owned and filled');
  assert.match(built.svg,/id="domain-endpoint-radical-to"[^>]*data-state="CLOSED"/,'the square-root source endpoint retains its closed state');
  assert.doesNotMatch(built.svg,/data-branch="CURVE_rational_L"/);
  assert.match(built.svg,/data-branch="CURVE_rational_R"/);
  assert.match(built.svg,/data-branch="ASYM_rational_V"/,'the visible off-axis vertical asymptote remains drawn at the open pole');

  const spec=specFor({capability:CAPABILITY,graphPlan:framed},built,'open-rational-pole');
  const rationalObjects=spec.objects.filter(object=>object.kind==='FUNCTION_GRAPH'&&object.branch.startsWith('CURVE_rational'));
  assert.deepEqual(rationalObjects.map(object=>object.branch),['CURVE_rational_R']);
  const marks=spec.displayFacts.multiCurveMarks;
  assert.equal(marks.some(mark=>mark.kind==='SOURCE_ENDPOINT'&&mark.curve==='rational'&&mark.which==='from'&&mark.x===6),false,'the source-domain inventory retains no finite rational marker at the pole');
  assert.ok(marks.some(mark=>mark.kind==='SOURCE_ENDPOINT'&&mark.curve==='radical'&&mark.which==='to'&&mark.state==='CLOSED'),'the square-root endpoint remains owned in the source-domain inventory');

  const bogusCx=built.transform.originX+built.transform.sx*6,bogusCy=built.transform.originY+built.transform.sy*2;
  const withBogusPoleMarker=built.svg.replace('</svg>',`<circle id="domain-endpoint-rational-from" data-role="source-domain-endpoint" data-curve="rational" data-endpoint="from" data-state="OPEN" cx="${bogusCx}" cy="${bogusCy}" r="4" fill="#fff" stroke="black" stroke-width="1"/></svg>`);
  const rejected=await observe(framed,withBogusPoleMarker,built.transform);
  assert.equal(rejected.result.status,'FAIL','the independent observer rejects a fabricated finite pole marker');
  assert.match(JSON.stringify(rejected.result.errors),/MULTI_CURVE_DOMAIN_ENDPOINT_INVENTORY_MISMATCH/);

  const closedAtPole=structuredClone(graphPlan);
  closedAtPole.curves[0].domain.fromState='CLOSED';
  const invalid=await frame(closedAtPole);
  assert.notEqual(invalid.status,'OK');
  assert.match(JSON.stringify(invalid.result),/MULTI_CURVE_DOMAIN_INVALID:rational/);
  const observerClosedAtPole=structuredClone(framed);
  observerClosedAtPole.curves[0].domainStates=['CLOSED','CLOSED'];
  const independentlyRejected=await observe(observerClosedAtPole,built.svg,built.transform);
  assert.notEqual(independentlyRejected.result.status,'PASS');
  assert.match(JSON.stringify(independentlyRejected.result.errors),/MULTI_CURVE_DOMAIN_INVALID:rational/);

  const scaled=structuredClone(graphPlan);
  scaled.curves[0].numerator=['13/10','-1/5'];
  scaled.curves[0].denominator=['-3/5','1/10'];
  const scaledFixture=await fixture({graphPlan:scaled});
  const scaledSpec=specFor({capability:CAPABILITY,graphPlan:scaledFixture.graphPlan},scaledFixture.model,'scaled-open-rational-pole');
  assert.equal(scaledSpec.displayFacts.multiCurveMarks.some(mark=>mark.kind==='SOURCE_ENDPOINT'&&mark.curve==='rational'&&mark.which==='from'),false,'exact rational pole detection does not depend on floating-point equality');
  assert.doesNotMatch(scaledFixture.model.svg,/id="domain-endpoint-rational-from"/);
});
