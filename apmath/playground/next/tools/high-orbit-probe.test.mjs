import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { probeNativeOrbit } from './high-orbit-probe.mjs';

// Native-event seams, not a replacement for the actual GitHub Chromium run.
function fixture({acquire=true,update=true,render=true,covered=false,wrongHandle=false,throwMove=false}={}){
  let down=false,moves=0,releases=0,pressed=false;
  const cv={width:390,height:455,getBoundingClientRect:()=>({left:0,top:0,width:390,height:455}),classList:{contains:()=>pressed}};
  const lab={s:{yaw:35,pitch:22,step:0,dragging:false},board:{W:390,H:455,canvas:cv,handles:[],dragging:null,onPanDrag:()=>{throw Error('Do not call the production callback from a probe');}}};
  lab.board.ctx={getImageData:()=>({data:new Uint8ClampedArray([10,20,render?Math.round(lab.s.yaw):35,255])})};
  const document={elementFromPoint:()=>covered?{}:cv};
  const page={evaluate:async(fn,arg)=>vm.runInNewContext(`(${fn.toString()})(arg)`,{lab,document,arg}),mouse:{
    move:async()=>{moves++;if(down){if(throwMove)throw Error('native movement failed');if(acquire&&update){lab.s.yaw+=20;lab.s.pitch+=5;}}},
    down:async()=>{down=true;pressed=acquire;lab.board.dragging=wrongHandle?{id:'other'}:null;},
    up:async()=>{releases++;down=false;pressed=false;lab.board.dragging=null;}
  }};
  const canvas={scrollIntoViewIfNeeded:async()=>{}};
  const settle=async()=>{lab.s.step++;lab.s.dragging=!lab.s.dragging;};
  return {lab,page,canvas,settle,counts:()=>({moves,releases})};
}
test('native empty-canvas movement must change both camera and rendered pixels',async()=>{
  const f=fixture(),r=await probeNativeOrbit(f.page,f.canvas,f.settle);
  assert.equal(r.pass,true);assert.equal(r.acquired,true);assert.equal(r.cameraChanged,true);assert.equal(r.pixelsChanged,true);assert.equal(f.counts().releases,1);
});
test('UI state changes and an acquired but inert orbit cannot pass',async()=>{
  const f=fixture({update:false}),r=await probeNativeOrbit(f.page,f.canvas,f.settle);
  assert.equal(r.acquired,true);assert.equal(r.cameraChanged,false);assert.equal(r.pass,false);
});
test('a changed camera without a redraw fails',async()=>{
  const f=fixture({render:false}),r=await probeNativeOrbit(f.page,f.canvas,f.settle);
  assert.equal(r.cameraChanged,true);assert.equal(r.pixelsChanged,false);assert.equal(r.pass,false);
});
test('a captured point handle cannot masquerade as an empty-canvas orbit',async()=>{
  const f=fixture({wrongHandle:true}),r=await probeNativeOrbit(f.page,f.canvas,f.settle);
  assert.equal(r.acquired,false);assert.equal(r.pass,false);
});
test('an overlay covering candidate points causes a failure without any pointer input',async()=>{
  const f=fixture({covered:true}),r=await probeNativeOrbit(f.page,f.canvas,f.settle);
  assert.equal(r.pass,false);assert.equal(r.reason,'no-visible-empty-orbit-canvas');assert.deepEqual(f.counts(),{moves:0,releases:0});
});
test('a native movement exception still releases the pointer',async()=>{
  const f=fixture({throwMove:true});await assert.rejects(probeNativeOrbit(f.page,f.canvas,f.settle),/native movement failed/);assert.equal(f.counts().releases,1);
});
