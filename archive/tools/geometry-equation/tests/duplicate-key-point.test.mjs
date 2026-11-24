// A requiredPoint and an overlays.points point at exactly the same coordinates (both writing them) cannot satisfy the owner-Voronoi condition; the render ladder lists the
// requiredPoint in graphPlan.coordinateBand.hide once (production/duplicate-key-point.mjs, render-plan.mjs fallback 5). Also: the hints for PUBLICATION_TEXT_NOT_READY and graph region labels.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {duplicateRequiredPointId,parseExact} from '../production/duplicate-key-point.mjs';
import {hintFor} from '../ops/tools/hints.mjs';
import {renderPlan} from '../production/render-plan.mjs';

const SOURCE='archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js';
const q4=()=>({
  capability:'piecewise-polynomial-spike-v1',
  graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients:['-1','0','1']}],breakpoints:[],sourceDomain:{kind:'INTERVAL',range:['0','1'],states:['CLOSED','CLOSED']},domain:[0,1],viewport:[0,1,-1.2,0.2],
    requiredPoints:[{id:'E0',x:'0',y:'-1'}],axisTickValues:{x:[],y:[]},
    overlays:{points:[{id:'A',curveX:'0',coordinates:true},{id:'B',curveX:'1',coordinates:true},{id:'T',curveX:'1/2'}],
      lines:[{id:'sec',slope:'1',intercept:'-1',label:'l'},{id:'tan',slope:'1',intercept:'-5/4',label:'m'}]}},
  caption:'구간 양 끝을 잇는 할선과 내부에서 그 할선에 평행한 접선의 관계를 본다.',
  sourceConditions:[{id:'source',condition:'함수 $f(x)=x^2-1$에 대하여 닫힌구간 $[0,1]$에서 평균값 정리를 만족시키는 실수 $c$의 값은? [4.0점]',mappedTo:'PRESERVED_ARCHIVE_BANK'},{id:'method',condition:'평균변화율1과2c 일치. 접점T의좌표1/2는숨겨최종c를직접제시하지않음.',mappedTo:'graphPlan'}],
  newVisualInformation:['평균변화율1과2c 일치. 접점T의좌표1/2는숨겨최종c를직접제시하지않음.']});
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'dup-key-'));
const attempts=out=>fs.readFileSync(path.join(out,'attempts.jsonl'),'utf8').trim().split('\n').map(l=>JSON.parse(l));

test('exact rational parsing: reduced fractions, decimals, nothing approximate',()=>{
  assert.deepEqual(parseExact('2/4'),parseExact('1/2'));assert.deepEqual(parseExact('0.5'),parseExact('1/2'));assert.deepEqual(parseExact('-0'),parseExact('0'));
  for(const bad of ['sqrt(2)','1/0','x','1e3','',null,undefined,1.5])assert.equal(parseExact(bad),null,String(bad));
});

test('duplicateRequiredPointId: explicit x,y and curveX on a piecewise polynomial, exact only',()=>{
  const gp=q4().graphPlan;
  assert.equal(duplicateRequiredPointId(gp,'required-point-1-coordinates'),'E0');            // A is curveX 0 -> (0,-1) = E0
  const far=structuredClone(gp);far.requiredPoints[0]={id:'E0',x:'1/2',y:'-3/4'};              // T is the curve at 1/2 but writes no coordinates
  assert.equal(duplicateRequiredPointId(far,'required-point-1-coordinates'),null);
  const off=structuredClone(gp);off.requiredPoints[0]={id:'E0',x:'0',y:'-1.0001'};             // same x, y not on the curve: not a duplicate
  assert.equal(duplicateRequiredPointId(off,'required-point-1-coordinates'),null);
  const explicit=structuredClone(gp);explicit.overlays.points=[{id:'M',x:'0',y:'-2/2',coordinates:true}];
  assert.equal(duplicateRequiredPointId(explicit,'required-point-1-coordinates'),'E0');
  const near=structuredClone(gp);near.overlays.points=[{id:'M',x:'0',y:'-0.9999999999',coordinates:true}];
  assert.equal(duplicateRequiredPointId(near,'required-point-1-coordinates'),null);            // approximation is never a match
  assert.equal(duplicateRequiredPointId(gp,'required-point-2-coordinates'),null);              // no such point
  assert.equal(duplicateRequiredPointId(gp,'A-coordinate'),null);                              // not a required-point label
});

test('render ladder: the duplicate requiredPoint goes to coordinateBand.hide once and the figure binds',async()=>{
  const out=tmp();
  const r=await renderPlan({item:{sourcePath:SOURCE,ordinal:4,dir:'figure'},plan:q4(),outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  const lines=attempts(out);
  const bandAttempts=lines.filter(l=>l.variant==='bandhide');
  // Whether the duplicate collides depends on the measured text widths of the machine, so exactly one of two things happens, and each is checked on its own terms:
  //  (a) it collides: the ladder repairs it with exactly one bandhide attempt that binds, the result records the COORDINATE_BAND_HIDE_DUPLICATE fallback, and the failure that triggered it is on record;
  //  (b) it does not collide: there is no bandhide attempt and no such fallback, and the very first attempt already bound.
  const fallbacks=(r.fallback||[]).map(row=>row.to);
  if(bandAttempts.length>0){
    assert.equal(bandAttempts.length,1,'exactly one attempt of this variant');
    assert.equal(bandAttempts[0].ok,true);
    assert.ok(fallbacks.includes('COORDINATE_BAND_HIDE_DUPLICATE'),JSON.stringify(r.fallback));
    assert.ok(lines.some(l=>JSON.stringify(l).includes('MEASURED_OWNER_LAYOUT_VORONOI_BOX_FAIL')),'the failure that triggered it is on record');
  }else{
    assert.ok(!fallbacks.includes('COORDINATE_BAND_HIDE_DUPLICATE'),JSON.stringify(r.fallback));
    assert.equal(lines.find(l=>l.variant==='initial')?.ok,true,'the first attempt bound');
  }
  assert.match(fs.readFileSync(path.join(out,'figure-solution.svg'),'utf8'),/role="img"/);
});

test('an authored band that already hides the point needs no repair and no extra attempt',async()=>{
  const plan=q4();plan.graphPlan.coordinateBand={hide:['E0']};
  const out=tmp();
  const r=await renderPlan({item:{sourcePath:SOURCE,ordinal:4,dir:'figure'},plan,outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  assert.equal(attempts(out).filter(l=>l.variant==='bandhide').length,0);
});

test('PUBLICATION_TEXT_NOT_READY hint: no readable value, not a collision; the collision hint is not attached',()=>{
  const code='{"status":"RENDERED_LAYOUT_FAIL","detail":{"errors":["PUBLICATION_TEXT_NOT_READY"]}}';
  const hints=hintFor(code);
  assert.equal(hints.length,1);
  assert.match(hints[0],/no value a student can read/);
  assert.match(hints[0],/axisTickValues/);assert.match(hints[0],/coordinateBand/);assert.match(hints[0],/overlays\.points/);
  assert.match(hints[0],/Showing the answer is allowed in a solution figure/);
  assert.doesNotMatch(hints[0],/leader line|collide/);
  assert.match(hintFor('RENDERED_LAYOUT_FAIL LABEL_GEOMETRY_COLLISION:a:b')[0],/collide/);
});

test('region label hint: a graph region label is not sent to planeMarks.callouts',()=>{
  const region=JSON.stringify({status:'LAYOUT_INVENTORY_INCOMPLETE',detail:{unresolved:['region-A-label','region-B-label'],suppressed:[]}});
  const hints=hintFor(region);
  assert.match(hints[0],/region label/);assert.match(hints[0],/no leader line/);
  assert.ok(!hints.some(h=>/planeMarks\.callouts로/.test(h)));
  const plane=JSON.stringify({status:'LAYOUT_INVENTORY_INCOMPLETE',detail:{unresolved:['k1-label'],suppressed:[]}});
  assert.ok(hintFor(plane).some(h=>/planeMarks\.callouts로/.test(h)));
});
