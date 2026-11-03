import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// G18a-3: hideLabels / formulaTex of a single rational or square-root curve, as drawing objects (Python framing and model only, no Chrome).
const {pythonWorker}=await import('../production/worker.mjs');
const {specFor}=await import('../production/phase2.mjs');

const specOf=async(capability,graphPlan)=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const built=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(built.status,'OK',JSON.stringify(built.result));
  return specFor({capability,caption:'c',graphPlan:framed.result.graphPlan},built.result,'g18a-labels');
};
const RATIONAL={family:'rational',numerator:['-4','-4'],denominator:['-1','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-5,7],viewport:[-5,7,-12,6],axisTickValues:{x:[],y:[]}};
const SQRT={family:'sqrt-affine',radicand:['1','1'],amplitude:'2',offset:'-1',sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[-1,8],viewport:[-2,9,-3,8],axisTickValues:{x:[],y:[]},domainRangeLabels:true};
const ids=spec=>spec.objects.map(object=>object.id);

test('guide names hideLabels and formulaTex',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const text of ['formulaTex','FORMULA_TEX_NOT_THE_FUNCTION','HIDE_LABELS_INVALID'])assert.ok(guide.includes(text),text);
});

test('rational: formula in the author form, asymptote texts hidden, dashed lines kept in the model',async()=>{
  const shown=await specOf('rational-spike-v1',RATIONAL);
  assert.deepEqual(ids(shown),['f','formula','horizontal-asymptote-label','vertical-asymptote-label']);
  assert.equal(shown.objects.find(object=>object.id==='formula').text,'y=(-4*x-4)/(x-1)');
  const hidden=await specOf('rational-spike-v1',{...RATIONAL,formulaTex:'-\\frac{8}{x-1}-4',hideLabels:['asymptotes']});
  assert.deepEqual(ids(hidden),['f','formula']);
  assert.equal(hidden.objects.find(object=>object.id==='formula').text,'y=-8/(x-1)-4');
  const none=await specOf('rational-spike-v1',{...RATIONAL,hideLabels:['formula','asymptotes']});
  assert.deepEqual(ids(none),['f']);
});

test('sqrt: formula hidden or in the author form, start texts hidden',async()=>{
  const shown=await specOf('sqrt-affine-spike-v1',SQRT);
  assert.ok(ids(shown).includes('formula')&&ids(shown).includes('sqrt-domain-label')&&ids(shown).includes('sqrt-range-label'));
  const hidden=await specOf('sqrt-affine-spike-v1',{...SQRT,formulaTex:'2\\sqrt{x+1}-1',hideLabels:['start']});
  assert.equal(hidden.objects.find(object=>object.id==='formula').text,'y=2sqrt(x+1)-1');
  assert.ok(!ids(hidden).includes('sqrt-domain-label')&&!ids(hidden).includes('sqrt-range-label'));
  const none=await specOf('sqrt-affine-spike-v1',{...SQRT,hideLabels:['formula']});
  assert.ok(!ids(none).includes('formula')&&ids(none).includes('sqrt-domain-label'));
});
