import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const OBSERVER=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const TIMEOUT_MS=120000;
const worker=(payload,options={})=>pythonWorker(payload,{timeoutMs:TIMEOUT_MS,...options});

const plainPlan=(overrides={})=>({family:'trigonometric',function:'SIN',coefficients:['24/5','5'],ratePi:'1/6',phasePi:'0',
  sourceDomain:{kind:'INTERVAL',range:['0','12'],states:['CLOSED','CLOSED']},domain:[0,12],viewport:[0,12,0,10],
  referenceLines:[{id:'k',y:'37/5',intersectionCount:2}],axisTickValues:{x:['2','4','6','8','10'],y:[]},keyPoints:true,...overrides});

async function frame(graphPlan){return worker({action:'frame_graph',graphPlan});}
async function observe(graphPlan){
  const fitted=await frame(graphPlan);assert.equal(fitted.status,'OK',JSON.stringify(fitted.result));
  const model=await worker({action:'graph',graphPlan:fitted.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const audit=await worker({graphPlan:fitted.result.graphPlan,svg:model.result.svg,transform:model.result.transform},{script:OBSERVER});
  assert.equal(audit.status,'OK',JSON.stringify(audit.result));
  return {fitted:fitted.result.graphPlan,model:model.result,audit:audit.result};
}

test('a pi rate on a plain month interval frames exact period, crossings and key points and the observer passes',async()=>{
  const {fitted,audit}=await observe(plainPlan());
  assert.equal(fitted.overviewPolicy,'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2');
  const features=fitted.trigIntervalFeatures;
  assert.equal(features.period,'12');assert.equal(features.axisUnit,'ONE');
  assert.deepEqual(features.lines[0].intersections.map(point=>Math.round(point.x)),[1,5]);
  assert.deepEqual(features.keyPoints.map(row=>[row.x,row.kind]),[['3','MAXIMUM'],['6','MIDLINE_CROSSING'],['9','MINIMUM']]);
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('a tangent over several branches draws a dashed pole at every asymptote',async()=>{
  const {fitted,model,audit}=await observe(plainPlan({function:'TAN',coefficients:['2','1'],ratePi:'1/4',sourceDomain:{kind:'INTERVAL',range:['0','7'],states:['OPEN','OPEN']},domain:[0,7],viewport:[0,7,-8,10],referenceLines:[],keyPoints:false,axisTickValues:{x:['1','3','5'],y:[]}}));
  assert.deepEqual(fitted.trigIntervalFeatures.poles.map(row=>row.x),['2','6']);
  for(const pole of fitted.trigIntervalFeatures.poles)assert.ok(model.svg.includes(`id="trig-${pole.id}"`),pole.id);
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('the composed tangent interval samples around open poles and keeps a dashed pole on the y-axis',async()=>{
  const {fitted,model}=await observe({family:'trigonometric',function:'TAN',coefficients:['3','1','0'],phasePi:'-1/2',
    sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','2'],states:['OPEN','OPEN']},displaySize:'full',axisTickValues:{x:[],y:[]}});
  const spec=specFor({capability:'trigonometric-spike-v1',graphPlan:fitted,caption:'Tangent branches'},model,'trig-open-poles');
  const curve=spec.objects.find(object=>object.kind==='FUNCTION_GRAPH');
  assert.deepEqual(curve.breaks,[0,Math.PI,2*Math.PI]);
  const result=await worker({action:'prepare',spec});
  assert.equal(result.status,'OK',JSON.stringify(result.result));
  const {primitives}=result.result.prepared;
  assert.equal(primitives.find(row=>row.id==='y-axis').dash,'5 4');
  assert.deepEqual(primitives.filter(row=>row.role==='trig-pole').map(row=>row.dash),['5 4','5 4','5 4']);
  assert.equal(primitives.filter(row=>row.role==='interval-endpoint').length,0);
  assert.equal(primitives.filter(row=>row.role==='curve').length,2);
});

test('a pi rate keeps the single-period form exact',async()=>{
  const {fitted,audit}=await observe({family:'trigonometric',function:'SIN',coefficients:['1','0'],ratePi:'1/6',phasePi:'0',sourceDomain:{kind:'ALL_REALS'},domain:[-6,6],viewport:[-7,7,-4,4],axisTickValues:{x:[],y:[]}});
  assert.equal(fitted.overviewPolicy,'TRIGONOMETRIC_PERIODIC_OVERVIEW_v2');
  assert.equal(fitted.trigFeatures.period,'12');
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('pi-unit ticks are framed as exact multiples of pi',async()=>{
  const fitted=await frame({family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-2','2'],states:['OPEN','OPEN']},domain:[-6,6],viewport:[-7,7,-2,2],axisTickValues:{x:['-1/2','1/2'],y:[]},axisTickPi:true});
  assert.equal(fitted.status,'OK',JSON.stringify(fitted.result));
  assert.equal(fitted.result.graphPlan.overviewPolicy,'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2');
  const {audit}=await observe({family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-2','2'],states:['OPEN','OPEN']},domain:[-6,6],viewport:[-7,7,-2,2],axisTickValues:{x:['-1/2','1/2'],y:[]},axisTickPi:true});
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('the old one-period and INTERVAL_PI plans keep their v1 policy',async()=>{
  const one=await frame({family:'trigonometric',function:'COS',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'ALL_REALS'},domain:[-4,4],viewport:[-5,5,-5,5],axisTickValues:{x:[],y:[]}});
  assert.equal(one.result.graphPlan.overviewPolicy,'TRIGONOMETRIC_PERIODIC_OVERVIEW_v1');
  const many=await frame({family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','6'],states:['OPEN','OPEN']},domain:[0,19],viewport:[-1,20,-2,2],referenceLines:[{id:'k',y:'1/2',intersectionCount:6}],axisTickValues:{x:[],y:[]}});
  assert.equal(many.result.graphPlan.overviewPolicy,'TRIGONOMETRIC_INTERVAL_OVERVIEW_v1');
});

test('bad grammar and unsupported units are refused with codes',async()=>{
  const refused=async graphPlan=>{const result=await frame(graphPlan);assert.notEqual(result.status,'OK');return JSON.stringify(result.result);};
  const noRate=plainPlan({coefficients:['1','1','0']});delete noRate.ratePi;
  assert.match(await refused(noRate),/TRIG_INTERVAL_REQUIRES_RATE_PI/);
  assert.match(await refused({family:'trigonometric',function:'SIN',coefficients:['1','0'],ratePi:'1/2',phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['-2','2'],states:['OPEN','OPEN']},domain:[-6,6],viewport:[-7,7,-2,2],axisTickValues:{x:[],y:[]}}),/TRIG_RATE_PI_REQUIRES_PLAIN_INTERVAL/);
  const rationalPhase=plainPlan({phase:'1/3'});delete rationalPhase.phasePi;
  assert.match(await refused(rationalPhase),/TRIG_KEY_POINTS_REQUIRE_RATIONAL_PHASE/);
  assert.match(await refused(plainPlan({referenceLines:[{id:'k',y:'1/2',intersectionCount:9}]})),/TRIG_LINE_INTERSECTION_COUNT_MISMATCH:k:engine finds 2 intersection/);
  const tan=states=>plainPlan({function:'TAN',coefficients:['1','0'],ratePi:'1/2',sourceDomain:{kind:'INTERVAL',range:['0','1'],states},referenceLines:[],keyPoints:false});
  assert.match(await refused(tan(['OPEN','CLOSED'])),/TRIG_TAN_POLE_AT_INTERVAL_END/);
  assert.match(await refused(tan(['OPEN','OPEN'])),/TRIG_TAN_INTERVAL_NO_POLE/);
  assert.match(await refused(plainPlan({ratePi:'1/2',sourceDomain:{kind:'INTERVAL',range:['0','50'],states:['CLOSED','CLOSED']},domain:[0,50],referenceLines:[],keyPoints:false})),/TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED/);
});

test('the observer rejects a tampered curve, key point or pole',async()=>{
  const {fitted,model}=await observe(plainPlan());
  const auditOf=async svg=>{const result=await worker({graphPlan:fitted,svg,transform:model.transform},{script:OBSERVER});return result.result;};
  assert.equal((await auditOf(model.svg.replace('id="trig-key-3"','id="trig-key-x"'))).status,'FAIL');
  assert.equal((await auditOf(model.svg.replace(/(-?\d+\.\d+),/,'999,') )).status,'FAIL');
  const tan=await observe(plainPlan({function:'TAN',coefficients:['2','1'],ratePi:'1/4',sourceDomain:{kind:'INTERVAL',range:['0','7'],states:['OPEN','OPEN']},domain:[0,7],viewport:[0,7,-8,10],referenceLines:[],keyPoints:false,axisTickValues:{x:['1','3','5'],y:[]}}));
  const tampered=tan.model.svg.replace(/(id="trig-pole-1"[^>]*x1=")(-?[\d.]+)/,'$1999');
  const result=await worker({graphPlan:tan.fitted,svg:tampered,transform:tan.model.transform},{script:OBSERVER});
  assert.equal(result.result.status,'FAIL',JSON.stringify(result.result.errors));
});

test('trig v2 can hide an endpoint number and keeps the original interval geometry',async()=>{
  const graphPlan={
    family:'trigonometric',function:'SIN',coefficients:['1','0'],ratePi:'1',phasePi:'0',
    sourceDomain:{kind:'INTERVAL',range:['0','3'],states:['CLOSED','CLOSED']},
    axisTickValues:{x:[],y:[]},
    overlays:{
      points:[{id:'O',x:'0',y:'0'},{id:'A',curveX:'1/2'},{id:'B',curveX:'5/2'}],
      lines:[{id:'level',slope:'0',intercept:'1',label:'y=a',labelValues:{a:'1'}}],
      polygons:[{id:'tri',points:['O','A','B'],fill:'MEDIUM'}],
    },
  };
  const stock=await observe(graphPlan);
  const hidden=await observe({...graphPlan,hideIntervalEndLabels:['END']});
  assert.equal(stock.audit.status,'PASS',JSON.stringify(stock.audit.errors));
  assert.equal(hidden.audit.status,'PASS',JSON.stringify(hidden.audit.errors));
  assert.deepEqual(hidden.model,stock.model);
  const spec=({fitted,model})=>specFor({
    capability:'trigonometric-spike-v1',graphPlan:fitted,caption:'사인 곡선과 수평선',
  },model,'geumdang24-q14');
  const baseline=spec(stock),selected=spec(hidden);
  assert.equal(baseline.objects.find(row=>row.id==='interval-end-label')?.text,'3');
  assert.deepEqual(selected,{...baseline,objects:baseline.objects.filter(row=>row.id!=='interval-end-label')});
  assert.deepEqual(selected.displayFacts.intervalFeatures.endpoints.map(row=>[row.side,row.state]),[['START','CLOSED'],['END','CLOSED']]);
  const reject=async(svg,code)=>{
    const result=await worker({action:'graphAudit',graphPlan:hidden.fitted,svg,transform:hidden.model.transform},{script:OBSERVER});
    assert.equal(result.status,'OK',JSON.stringify(result.result));
    assert.ok(result.result.errors.includes(code),JSON.stringify(result.result));
  };
  await reject(hidden.model.svg.replace('</svg>','<text id="interval-end-label">3</text></svg>'),
    'TRIG_HIDDEN_INTERVAL_END_LABEL_PRESENT:end');
  await reject(hidden.model.svg.replace('id="interval-endpoint-end"','id="missing-point"'),
    'TRIG_INTERVAL_END_MARKER_MISMATCH:end');

  const withTwoLabels={...graphPlan,sourceDomain:{kind:'INTERVAL',range:['1/4','3'],states:['OPEN','CLOSED']}};
  const onlyEnd=await frame({...withTwoLabels,hideIntervalEndLabels:['START']});
  assert.equal(onlyEnd.status,'OK',JSON.stringify(onlyEnd.result));
  const objects=spec({fitted:onlyEnd.result.graphPlan,model:null}).objects;
  assert.deepEqual(objects.filter(row=>/^interval-(start|end)-label$/.test(row.id)).map(row=>row.id),['interval-end-label']);
});

test('trig endpoint label hiding requires a current interval and unique side tokens',async()=>{
  for(const hideIntervalEndLabels of [null,[],['END','END'],['LEFT']]){
    const result=await frame(plainPlan({hideIntervalEndLabels}));
    assert.equal(result.result.code,'TRIG_HIDE_INTERVAL_END_LABELS_INVALID',JSON.stringify(result.result));
  }
  const unsupported=await frame(plainPlan({sourceDomain:{kind:'ALL_REALS'},hideIntervalEndLabels:['END']}));
  assert.equal(unsupported.result.code,'TRIG_HIDE_INTERVAL_END_LABELS_REQUIRES_V2',JSON.stringify(unsupported.result));
});

test('Gangnam Girls Q11 crops a pi-rate cosine in ordinary x units without invented endpoints',async()=>{
  const graphPlan={family:'trigonometric',function:'COS',ratePi:'2/3',coefficients:['2','1'],phasePi:'-4/3',
    sourceDomain:{kind:'ALL_REALS'},displayWindowX:['-3/5','23/4'],
    axisTickValues:{x:['1','3','4'],y:['-1','3']},displayGuides:{y:['-1','3']},showOriginLabel:true};
  const framed=await frame(graphPlan);
  assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const fitted=framed.result.graphPlan;
  const {result:model,status}=await worker({action:'graph',graphPlan:fitted});
  assert.equal(status,'OK',JSON.stringify(model));
  const {result:audit}=await worker({action:'modelBinding',graphPlan:fitted,svg:model.svg,transform:model.transform},{script:OBSERVER});
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  assert.deepEqual(fitted.domain,[-.6,5.75]);
  assert.deepEqual(fitted.trigDisplayFeatures.extrema,['1/2','2','7/2','5']);
  // At the source typography sizes, O and the -1 tick need separate rows on the left of the y-axis.
  assert.ok(Math.abs((fitted.viewport[3]-fitted.viewport[2])-5.28)<1e-9);
  const spec=specFor({capability:'trigonometric-spike-v1',caption:'주어진 코사인 그래프',graphPlan:fitted},model,'q11');
  assert.deepEqual(spec.displayFacts.axisTickValues,graphPlan.axisTickValues);
  assert.deepEqual(spec.objects.filter(row=>row.guide).map(row=>row.from[1]),[-1,3]);
  assert.ok(!spec.objects.some(row=>/^(period|interval|formula)/.test(row.id)));
  assert.doesNotMatch(model.svg,/data-role="interval-endpoint"/);
  const tampered=model.svg.replace('</svg>','<circle id="interval-endpoint-end" cx="0" cy="0" r="3"/></svg>');
  const rejected=await worker({action:'modelBinding',graphPlan:fitted,svg:tampered,transform:model.transform},{script:OBSERVER});
  assert.ok(rejected.result.errors.includes('TRIG_DISPLAY_EXTRA_MARKUP'));
  const piTicks=await frame({...graphPlan,axisTickPi:true});
  assert.equal(piTicks.result.code,'TRIG_TICK_PI_REQUIRES_PI_AXIS');
});
