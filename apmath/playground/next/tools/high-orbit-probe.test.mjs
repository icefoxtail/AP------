import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { probeNativeOrbit, classifyOrbitCapability, currentOrbitFacts, REQUIRED_ORBIT_SCENES } from './high-orbit-probe.mjs';

const camera = { controlKeys: ['yaw', 'pitch'], yawParam: true, pitchParam: true, yaw: -28, pitch: 22, declaredOrbit: true, handler: true };
test('the reviewed 3D inventory remains a positive camera-and-pixels requirement', () => {
  for (const [lab, scenes] of Object.entries(REQUIRED_ORBIT_SCENES)) for (const id of scenes) {
    const actual = classifyOrbitCapability(lab, id, camera);
    assert.equal(actual.status, 'REQUIRED', `${lab}:${id}`);
    assert.equal(actual.requiredBySceneContract, true);
  }
});
test('all seven 2D pan locks and the flat square have explicit non-3D evidence', () => {
  for (const id of ['dist', 'binom', 'std', 'sym', 'pdf', 'mean', 'ci']) {
    assert.equal(classifyOrbitCapability('prob-stats', id, { controlKeys: ['n'], declaredOrbit: true, handler: true, yaw: null, pitch: null }).status, 'NOT_APPLICABLE');
  }
  assert.equal(classifyOrbitCapability('common-poly-solid', 'sq', { ...camera, controlKeys: ['a1', 'b1', 'gap1'] }).status, 'NOT_APPLICABLE');
});
test('a known 3D scene cannot disappear behind missing controls, params, handler or non-finite state', () => {
  for (const delta of [{ controlKeys: [] }, { yawParam: false }, { pitchParam: false }, { yaw: null }, { pitch: NaN }, { declaredOrbit: false }, { handler: false }]) {
    assert.equal(classifyOrbitCapability('common-poly-solid', 'cube', { ...camera, ...delta }).status, 'INVALID', JSON.stringify(delta));
  }
});
test('an unknown callback is not silently classified as a 2D exception', () => {
  assert.equal(classifyOrbitCapability('new-lab', 's', { handler: true, declaredOrbit: true }).status, 'INVALID');
  assert.equal(classifyOrbitCapability('new-lab', 's', camera).status, 'REQUIRED');
  assert.equal(classifyOrbitCapability('new-lab', 's', { controlKeys: [], handler: false, declaredOrbit: false }).status, 'NOT_APPLICABLE');
});
test('capability facts come from the current scene controls and keep declaration separate from value validity', () => {
  const lab = { scene: { controls: s => s.flat ? ['a'] : ['yaw', 'pitch'] }, params: { yaw: {}, pitch: {} }, s: { flat: true, yaw: NaN, pitch: 22 }, def: { board: { orbit() {} } }, board: { onPanDrag() {} } };
  const read = () => vm.runInNewContext(`(${currentOrbitFacts.toString()})()`, { lab });
  const flat = read(); assert.deepEqual([...flat.controlKeys], ['a']); assert.equal(flat.yaw, null); assert.equal(flat.yawParam, true);
  lab.s.flat = false; assert.deepEqual([...read().controlKeys], ['yaw', 'pitch']);
});

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
