// G6b: the composed spec for circle fill and circle regions (a FILL_REGION of one true arc and the chord), the coordinate band's hide list, the one-scale canvas of an
// exponential/logarithmic graph with a circle, and hideLabels. No Chrome: framing, the model spec and the semantic validation are the unit boundary.
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const PARABOLA={family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']}],sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],requiredPoints:[{id:'O',x:0,y:0}],axisTickValues:{x:[],y:[]},
  overlays:{circles:[{id:'C',center:['0','0'],radiusSquared:'2',fill:'LIGHT'}],lines:[{id:'L',slope:'7/10',intercept:'0'}],
    points:[{id:'P',intersect:['L','C'],pick:'MAX_X'},{id:'A',curveX:'1',onCircle:'C'}],
    circleRegions:[{id:'S',circle:'C',from:'A',to:'P',side:'BELOW',fill:'MEDIUM'}]}};
const LOG={family:'logarithmic-affine',base:'27',coefficients:['-1','1','0','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},domain:[0.1,3.4],viewport:[-0.5,3.5,-2,2],axisTickValues:{x:[],y:[]},
  overlays:{circles:[{id:'C',center:['5/3','0'],radiusSquared:'17/9'}],points:[{id:'P',intersect:['curve','C'],pick:'MIN_X'},{id:'Q',intersect:['curve','C'],pick:'MAX_X'},{id:'M',x:'5/3',y:'0'}],segments:[{id:'PQ',from:'P',to:'Q'}]}};

const prepare=async(capability,graphPlan,extra={})=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const ids=[...(graphPlan.requiredPoints??[]).map(point=>point.id),...(graphPlan.overlays?.points??[]).map(point=>point.id)];
  const plan={capability,caption:'원과 곡선',graphPlan:framed.result.graphPlan,pointNames:Object.fromEntries(ids.map(id=>[id,id])),...extra};
  return {framed:framed.result.graphPlan,spec:specFor(plan,model.result,'g6b-test')};
};

test('circle fill and circle region reach the spec as a CIRCLE fill and a one-arc FILL_REGION',async()=>{
  const {spec}=await prepare('piecewise-polynomial-spike-v1',PARABOLA);
  assert.equal(spec.objects.find(object=>object.id==='overlay-circle-C').fill,'LIGHT');
  const centre=spec.objects.find(object=>object.id==='overlay-circle-C-center');
  assert.deepEqual([centre.kind,centre.marker,centre.name],['POINT','NONE',null]);
  const region=spec.objects.find(object=>object.id==='overlay-circle-region-S');
  assert.equal(region.kind,'FILL_REGION');assert.equal(region.fill,'MEDIUM');
  const loop=region.loops[0];assert.equal(loop.start,'A');
  assert.deepEqual(loop.steps.map(step=>step.to),['P','A']);assert.equal(loop.steps[0].arc.center,'overlay-circle-C-center');assert.ok(['CCW','CW'].includes(loop.steps[0].arc.sweep));
});

test('a circle without fill carries no fill field',async()=>{
  const plan=structuredClone(PARABOLA);delete plan.overlays.circles[0].fill;delete plan.overlays.circleRegions;
  const {spec}=await prepare('piecewise-polynomial-spike-v1',plan);
  assert.equal('fill' in spec.objects.find(object=>object.id==='overlay-circle-C'),false);
  assert.equal(spec.objects.some(object=>object.id.startsWith('overlay-circle-region')),false);
});

test('coordinateBand.hide keeps the dot and name but drops the band row',async()=>{
  const base=structuredClone(PARABOLA);delete base.overlays.circleRegions;delete base.overlays.circles[0].fill;
  const shown=await prepare('piecewise-polynomial-spike-v1',base);
  assert.ok(shown.spec.objects.some(object=>object.id==='required-point-1-coordinate-panel'));
  const hidden=await prepare('piecewise-polynomial-spike-v1',{...base,coordinateBand:{hide:['O']}});
  assert.equal(hidden.spec.objects.some(object=>object.id==='required-point-1-coordinate-panel'),false);
  const dot=hidden.spec.objects.find(object=>object.id==='required-point-1');assert.deepEqual(dot.at,[0,0]);assert.ok(dot.name);
});

test('coordinateBand claims fail closed',async()=>{
  const base=structuredClone(PARABOLA);delete base.overlays.circleRegions;delete base.overlays.circles[0].fill;
  for(const [band,code] of [[{hide:['Z']},'COORDINATE_BAND_HIDE_UNKNOWN:Z'],[{hide:[]},'COORDINATE_BAND_INVALID'],[{hide:['O','O']},'COORDINATE_BAND_INVALID'],[{show:['O']},'COORDINATE_BAND_INVALID'],['O','COORDINATE_BAND_INVALID']]){
    await assert.rejects(()=>prepare('piecewise-polynomial-spike-v1',{...base,coordinateBand:band}),error=>String(error.message).includes(code),code);
  }
});

test('a logarithmic graph with a circle is composed on the one-scale canvas and hideLabels drops its automatic labels',async()=>{
  const {framed,spec}=await prepare('logarithmic-affine-spike-v1',{...LOG,hideLabels:['formula','reference','boundary']});
  assert.equal(framed.equalUnits,true);assert.equal(spec.viewport.equalUnits,true);
  assert.equal(spec.viewport.width,512);assert.equal(spec.viewport.height,framed.plotCanvas.height+64);assert.equal(spec.viewport.panel,0);
  const ids=spec.objects.map(object=>object.id);
  for(const hidden of ['formula','reference-value','log-domain-boundary-label'])assert.equal(ids.includes(hidden),false,hidden);
  const shown=await prepare('logarithmic-affine-spike-v1',LOG);
  for(const label of ['formula','reference-value','log-domain-boundary-label'])assert.ok(shown.spec.objects.some(object=>object.id===label),label);
});

test('hideLabels claims fail closed',async()=>{
  for(const labels of [[],['bogus'],['formula','formula'],'formula'])await assert.rejects(()=>prepare('logarithmic-affine-spike-v1',{...LOG,hideLabels:labels}),error=>String(error.message).includes('HIDE_LABELS_INVALID'),JSON.stringify(labels));
});
