import test from 'node:test';
import assert from 'node:assert/strict';
import {inferNestedAngleOver,resolveAngleOver} from '../production/plane-marks.mjs';

// vertex B at the origin; rays BA 120 degrees, BE 75, BD 30, BC -20: ABC encloses ABD, ABD encloses EBD
const P={B:[0,0],A:[-0.5,0.866],D:[0.866,0.5],C:[0.94,-0.342],E:[0.259,0.966]};
const at=id=>{if(!P[id])throw Error('unknown '+id);return P[id];};
const row=(id,refs,more={})=>({id,refs,label:id,style:'ARC',...more});

test('a whole angle that encloses another angle at its vertex gets over, the enclosed one is left alone',()=>{
  const rows=[row('a1',['A','B','D']),row('a2',['A','B','C'])];
  const out=inferNestedAngleOver(rows,at);
  assert.notEqual(out,rows);
  assert.deepEqual(out.map(r=>r.over),[undefined,['a1']]);
  assert.deepEqual(rows.map(r=>r.over),[undefined,undefined],'the input rows are not changed');
  const rings=resolveAngleOver(out,at);
  assert.deepEqual(rings,{a2:{ring:2}});
});

test('a chain of three nested angles is ringed outward',()=>{
  const rows=[row('a1',['E','B','D']),row('a2',['A','B','D']),row('a3',['A','B','C'])];
  const out=inferNestedAngleOver(rows,at);
  assert.deepEqual(out.map(r=>r.over),[undefined,['a1'],['a1','a2']]);
  const rings=resolveAngleOver(out,at);
  assert.equal(rings.a3.ring>rings.a2.ring,true);
});

test('rows the author already ringed, other vertices, outer or straight angles and angles that only touch are left as written',()=>{
  const authored=[row('a1',['A','B','D']),row('a2',['A','B','C'],{ring:2})];
  assert.equal(inferNestedAngleOver(authored,at),authored);
  const elsewhere=[row('a1',['A','B','D']),row('a2',['D','C','A'])];
  assert.equal(inferNestedAngleOver(elsewhere,at),elsewhere);
  const apart=[row('a1',['D','B','C']),row('a2',['A','B','E'])];   // two wedges side by side at B
  assert.equal(inferNestedAngleOver(apart,at),apart);
  const outer=[row('a1',['A','B','D']),row('a2',['A','B','C'],{side:'OUTER'})];
  assert.equal(inferNestedAngleOver(outer,at),outer);
  const withOver=[row('a1',['A','B','D']),row('a2',['A','B','C'],{over:['a1']})];
  assert.equal(inferNestedAngleOver(withOver,at),withOver);
});

test('an unknown point never throws out of the inference',()=>{
  const rows=[row('a1',['A','B','Z']),row('a2',['A','B','C'])];
  assert.equal(inferNestedAngleOver(rows,at),rows);
});
