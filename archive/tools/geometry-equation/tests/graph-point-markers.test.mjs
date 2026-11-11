// overlays.points[].marker (OPEN = hollow circle) and color, overlays.latticePoints.color on the single-curve graph path.
// The first group has no Chrome (frame -> model -> spec); the last renders the golden figure end to end through renderPlan (Chrome: run with --test-concurrency=1).
// Python tests (framing codes, model SVG shape, observer tampering): test_graph_point_markers.py.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {renderPlan} from '../production/render-plan.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const golden=JSON.parse(fs.readFileSync(new URL('../ops/golden/item151latticemarkers/plan.json',import.meta.url),'utf8'));
const ITEM={sourcePath:'archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js',ordinal:14};
const withOverlays=change=>({...golden,graphPlan:{...golden.graphPlan,overlays:change(structuredClone(golden.graphPlan.overlays))}});
const attempt=async plan=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});
  if(framed.status!=='OK')return {error:JSON.stringify(framed.result)};
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {spec:specFor({...plan,graphPlan:framed.result.graphPlan},model.result,'point-markers-test')};
};

test('the spec carries markerState OPEN and the colour on the points and the colour on every lattice dot',async()=>{
  const {spec}=await attempt(golden);
  const curvePoints=spec.objects.filter(object=>/^c\d$/.test(object.id));
  assert.equal(curvePoints.length,4);
  assert.ok(curvePoints.every(object=>object.kind==='POINT'&&object.markerState==='OPEN'&&object.color==='ROSE'));
  const origin=spec.objects.find(object=>object.id==='O');
  assert.ok(!('markerState' in origin)&&!('color' in origin),'a point with neither option keeps no extra key');
  const dots=spec.objects.filter(object=>object.id.startsWith('overlay-lattice-x')&&object.kind==='POINT');
  assert.equal(dots.length,16);
  assert.ok(dots.every(dot=>dot.color==='BLUE'&&dot.markerRadius===2.4&&!('markerState' in dot)));
});

test('without the options the spec objects are unchanged',async()=>{
  const plain=withOverlays(overlays=>{
    for(const point of overlays.points){delete point.marker;delete point.color;}
    delete overlays.latticePoints.color;return overlays;});
  const {spec}=await attempt(plain);
  for(const object of spec.objects.filter(object=>object.kind==='POINT'))assert.ok(!('markerState' in object)&&!('color' in object),object.id);
});

test('unknown colour names and markers are refused before anything is drawn',async()=>{
  const bad=await attempt(withOverlays(overlays=>{overlays.points[1].color='rose';return overlays;}));
  assert.match(bad.error,/OVERLAY_COLOR_INVALID:c1\.color/);
  const hollow=await attempt(withOverlays(overlays=>{overlays.points[1].marker='HOLLOW';return overlays;}));
  assert.match(hollow.error,/OVERLAY_POINT_MARKER_INVALID:c1/);
  const lattice=await attempt(withOverlays(overlays=>{overlays.latticePoints.color='TEAL';return overlays;}));
  assert.match(lattice.error,/OVERLAY_COLOR_INVALID:lattice\.color/);
});

test('the contract text and the author guide state the options, the codes and the do-not-rely-on-colour rule',()=>{
  const text=contractText();
  for(const word of ['points[].marker','OPEN','OVERLAY_POINT_MARKER_INVALID','OVERLAY_COLOR_INVALID:<id>.color','do not rely on colour alone'])assert.ok(text.includes(word),'contract lacks '+word);
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const word of ['점의 모양과 색','OPEN','색만으로 구별하지 않는다','OVERLAY_POINT_LOOK_MISMATCH'])assert.ok(guide.includes(word),'guide lacks '+word);
});

test('q14: the golden renders, hollow rose points on the curve and blue counted dots, observed independently',{timeout:600000},async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'point-markers-'));
  const result=await renderPlan({item:{...ITEM,dir:'fig'},plan:golden,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  const svg=fs.readFileSync(path.join(out,'fig-solution.svg'),'utf8');
  const circle=id=>svg.match(new RegExp('<circle id="'+id+'"[^>]*/>'))?.[0];
  for(const id of ['c1','c2','c4','c8']){
    const node=circle(id);assert.ok(node,id);
    assert.match(node,/fill="#fff"/);assert.match(node,/stroke="#b8325f"/);assert.match(node,/data-state="OPEN"/);assert.match(node,/r="3\.5"/);
    assert.ok(Number(node.match(/stroke-width="([\d.]+)"/)[1])>=1.4,'the ring is wide enough to read as hollow');
  }
  const dots=[...svg.matchAll(/<circle id="overlay-lattice-x\d+y\d+"[^>]*\/>/g)].map(match=>match[0]);
  assert.equal(dots.length,16);
  assert.ok(dots.every(dot=>/fill="#1f5fa8"/.test(dot)&&/stroke="#1f5fa8"/.test(dot)));
  assert.match(circle('O'),/fill="#111"/);
  assert.equal([...svg.matchAll(/<g id="overlay-lattice-count-x\d+"/g)].length,7);
  assert.ok(svg.includes('role="img"')&&/<title id="visual-title">[^<]+<\/title>/.test(svg),'the accessible title and description are still written');
});
