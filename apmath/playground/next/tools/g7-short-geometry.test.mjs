import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/circle-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const g = require('../kit/apl-g7-short-scenes.js');
const near = (a,b,eps=1e-7) => assert.ok(Math.abs(a-b) <= eps, `${a} != ${b}`);

test('four transported quadrants conserve every edge and meet at one exact centre', () => {
  for (const a of [6,8,10,12,14,16]) {
    const m=g.starModel(a), C={x:1.9*a,y:.5*a};
    for (const t of [0,.17,.5,.93,1]) {
      const moved=g.starPositions(m,C,t);
      moved.forEach((p,i)=>{
        near(g.polygonArea(p.points),g.polygonArea(m.pieces[i].points),1e-8);
        p.points.forEach((v,j)=>near(Math.hypot(v.x-p.center.x,v.y-p.center.y),j?m.r:0));
      });
    }
    const final=g.starPositions(m,C,1);
    final.forEach(p=>{near(p.center.x,C.x);near(p.center.y,C.y)});
    near(final.reduce((s,p)=>s+p.a1-p.a0,0),2*Math.PI);
    // Exact circular area versus independent fine polygon integration.
    near(g.polygonArea(m.star),m.area,a*a*.00005);
    near(g.polygonArea(m.square)-m.pieces.reduce((s,p)=>s+g.polygonArea(p.points),0),g.polygonArea(m.star),1e-7);
    near(final.reduce((s,p)=>s+m.r*(p.a1-p.a0),0),m.perimeter);
  }
});

test('leaf pieces partition a square and exactly one additional leaf, not two',()=>{
  for(const a of [1,2,3,6,12,20]){
    const m=g.leafModel(a), A=g.polygonArea(m.onlyA), B=g.polygonArea(m.onlyB), L=g.polygonArea(m.leaf);
    near(A+B+L,a*a,a*a*.00001);
    near(L,(Math.PI/2-1)*a*a,a*a*.0001);
    near((A+L)+(B+L)-a*a,L,a*a*.00001);
  }
});

test('reference plans bind to production scene values and do not mutate the source',async()=>{
  const lab=await load();
  lab.go('f1-star');
  for(const a of [6,10,16]){
    lab.s[lab.scene.csKeys.K('a')]=a;
    const before=JSON.stringify(lab.s), plans=g.registry['g7-circle-sector/f1-star'](lab,lab.s);
    assert.equal(plans.length,2); assert.equal(JSON.stringify(lab.s),before);
    for(const p of plans){assert.equal(p.model.a,a);assert.ok(p.duration<=10);assert.ok(p.frame(p.duration,p.model).formula);}
    const actual=lab.scene.csModel(lab.s);
    near(actual.outer.reduce((s,p,i)=>{const q=actual.outer[(i+1)%actual.outer.length];return s+p.x*q.y-q.x*p.y;},0)/2,a*a);
  }
  lab.go('f3-leaf-area');lab.s.f3a=8;
  const p=g.registry['g7-circle-sector/f3-leaf-area'](lab,lab.s)[0];assert.equal(p.model.a,8);
  for (const t of [0,.8,2.6,4,5.4,7.1,8.8]) {lab.board.begin();p.draw(lab.board,t,p.model);lab.board.end();}
});

test('invalid or unsupported values remain unconverted, never guessed',()=>{
  assert.throws(()=>g.starModel(0));assert.throws(()=>g.leafModel(NaN));
  assert.deepEqual(g.registry['g7-circle-sector/f1-star']({scene:{}},{}),[]);
  assert.deepEqual(g.registry['g7-circle-sector/f3-leaf-area']({}, {f3a:1.23}),[]);
});
