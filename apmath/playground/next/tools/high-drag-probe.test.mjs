import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { probeNativeDrag } from './high-drag-probe.mjs';

// Browser seams model a bounded vertical drag. Production uses Playwright's
// native mouse events; these tests distinguish a valid bound from a dead handle.
function fixture({ initial=0.1, acquire=true, update=true, animate=false } = {}) {
  const lab={ s:{m:initial,step:0,playing:false}, board:{W:390,H:455,handles:[{id:'slope',x:140,y:220}],dragging:null} };
  let cursor={x:0,y:0}, origin=null, starts=0, releases=0;
  const page={ evaluate:async(fn,arg)=>vm.runInNewContext(`(${fn.toString()})(arg)`,{lab,arg}),mouse:{
    move:async(x,y)=>{cursor={x,y};if(origin&&lab.board.dragging&&update)lab.s.m=Math.max(-0.1,Math.min(0.1,origin.m+(origin.y-y)/200));},
    down:async()=>{starts++;origin={...cursor,m:lab.s.m};if(acquire){lab.board.dragging={id:'slope'};lab.s.dragging=true;}},
    up:async()=>{releases++;origin=null;lab.board.dragging=null;if(acquire)lab.s.dragging=false;}
  }};
  const canvas={scrollIntoViewIfNeeded:async()=>{},boundingBox:async()=>({x:0,y:0,width:390,height:455})};
  const settle=async()=>{if(animate){lab.s.playing=!lab.s.playing;lab.s.step++;}};
  return {lab,page,canvas,settle,counts:()=>({starts,releases})};
}

test('an upper bound tries a real opposite drag and records both outcomes', async()=>{
  const f=fixture();const r=await probeNativeDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,true);assert.equal(r.attempts.length,2);
  assert.deepEqual(r.attempts.map(x=>[x.direction,x.acquired,x.changed]),[['primary',true,false],['opposite',true,true]]);
  assert.ok(f.lab.s.m<0.1);assert.deepEqual(f.counts(),{starts:2,releases:2});
});
test('a successful initial drag is preserved without an unnecessary second drag',async()=>{
  const f=fixture({initial:0});const r=await probeNativeDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,true);assert.equal(r.attempts.length,1);assert.equal(f.lab.s.m,0.1);
});
test('an unacquired handle remains a failure without a retry',async()=>{
  const f=fixture({acquire:false});const r=await probeNativeDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,false);assert.equal(r.acquired,false);assert.equal(r.attempts.length,1);assert.equal(f.lab.s.m,0.1);
});
test('two no-op drags and unrelated reveal/play state changes cannot pass',async()=>{
  const f=fixture({update:false,animate:true});const r=await probeNativeDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,false);assert.equal(r.changed,false);assert.equal(r.attempts.length,2);assert.equal(f.lab.s.m,0.1);
  assert.equal(f.lab.s.dragging,false); // Absent initially; the shell adds it on the first native drag.
});
test('a disappearing handle fails without synthetic state or mouse calls',async()=>{
  const f=fixture();f.lab.board.handles=[];const r=await probeNativeDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,false);assert.equal(r.reason,'missing-drag-handle-or-canvas');assert.deepEqual(f.counts(),{starts:0,releases:0});
});
