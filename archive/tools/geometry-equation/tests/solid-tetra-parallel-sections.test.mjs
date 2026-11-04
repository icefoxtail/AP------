import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {solveSolidFigure} from '../production/solid-figure-v1.mjs';
const plan=JSON.parse(fs.readFileSync(new URL('../ops/golden/item120codextetra/plan.json',import.meta.url),'utf8'));
test('existing space divisions preserve a complete regular tetrahedron and both parallel sections',()=>{
  const m=solveSolidFigure(plan),solid=m.solids[0],pts=new Map(m.space.points.map(p=>[p.id,p.p]));
  assert.equal(solid.vertices.length,4);assert.equal(solid.edges.length,6);assert.equal(solid.faces.length,4);assert.equal(solid.cuts,undefined);
  const h=Math.max(...solid.vertices.map(v=>v.p[2]));
  for(const id of ['A','B','C'])assert.ok(Math.abs(pts.get(id)[2]-2*h/3)<1e-6);
  for(const id of ['D','E','F'])assert.ok(Math.abs(pts.get(id)[2]-h/3)<1e-6);
  assert.equal(m.highlights.length,3);assert.deepEqual(m.labels.map(x=>x.text),['(가)','(나)','(다)']);
  assert.equal(m.space.segments.length,12);
});
