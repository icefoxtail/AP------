import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { probeNativeDrag, probeNativeTouchDrag } from './high-drag-probe.mjs';

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

// The CDP seam delivers a single touch contact to a bounded vertical handle.
// Geometry deliberately uses a translated, half-size CSS canvas, so sending
// board coordinates as viewport coordinates cannot acquire this fixture.
function touchFixture({ initial=.1, acquire=true, update=true, release=true, deliver=true,
  animate=false, maxTouchPoints=1, failSession=false, failType='', cancelDuringMove=false, failDetach=false } = {}) {
  const lab={s:{m:initial,step:0,part:-1,revealed:false,playing:false},board:{W:390,H:455,handles:[{id:'slope',x:140,y:220,drag(){throw Error('direct drag callback is forbidden');}}],dragging:null}};
  const box={x:20,y:30,width:195,height:227.5}, sent=[];
  let contact=null, starts=0, ends=0, moves=0, detached=0, sessions=0;
  const session={
    send:async(method,payload)=>{
      assert.equal(method,'Input.dispatchTouchEvent');sent.push(structuredClone(payload));
      if(payload.type===failType)throw Error('injected '+failType+' failure');
      if(payload.type==='touchEnd'){
        assert.deepEqual(payload.touchPoints,[]);ends++;
        if(deliver&&release){contact=null;lab.board.dragging=null;lab.s.dragging=false;}
        return;
      }
      assert.equal(payload.touchPoints.length,1);const p=payload.touchPoints[0];assert.equal(p.id,1);
      if(payload.type==='touchStart'){
        starts++;
        if(deliver){contact={...p,m:lab.s.m};const h=lab.board.handles[0];
          const hit=h&&Math.hypot(p.x-(box.x+h.x*box.width/lab.board.W),p.y-(box.y+h.y*box.height/lab.board.H))<2;
          if(acquire&&hit){lab.board.dragging={id:'slope'};lab.s.dragging=true;}}
      }else{
        assert.equal(payload.type,'touchMove');moves++;
        if(deliver&&contact&&lab.board.dragging&&update)lab.s.m=Math.max(-.1,Math.min(.1,contact.m+(contact.y-p.y)/200));
        if(cancelDuringMove){lab.board.dragging=null;lab.s.dragging=false;}
      }
    },
    detach:async()=>{detached++;if(failDetach)throw Error('injected detach failure');}
  };
  const page={
    evaluate:async(fn,arg)=>vm.runInNewContext(`(${fn.toString()})(arg)`,{lab,arg,navigator:{maxTouchPoints},innerWidth:390,innerHeight:844}),
    context:()=>({newCDPSession:async p=>{assert.equal(p,page);sessions++;if(failSession)throw Error('CDP unsupported');return session;}}),
    mouse:new Proxy({}, {get(){throw Error('touch probe must not fall back to mouse');}})
  };
  const canvas={scrollIntoViewIfNeeded:async()=>{},boundingBox:async()=>box};
  const settle=async()=>{if(animate){lab.s.step++;lab.s.part++;lab.s.playing=!lab.s.playing;lab.s.revealed=!lab.s.revealed;}};
  return {lab,page,canvas,settle,box,sent,counts:()=>({starts,ends,moves,detached,sessions})};
}

test('touch acquires the CSS-positioned handle, sends six moves, changes the model and releases',async()=>{
  const f=touchFixture({initial:0});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,true);assert.equal(r.status,'PASS');assert.equal(r.input,'touch');assert.equal(r.released,true);assert.equal(r.held,true);
  assert.equal(r.attempts.length,1);assert.deepEqual(f.sent.map(x=>x.type),['touchStart',...Array(6).fill('touchMove'),'touchEnd']);
  assert.deepEqual(r.attempts[0].from,{x:90,y:140});assert.equal(f.lab.s.m,.1);assert.equal(f.lab.s.dragging,false);
  assert.deepEqual(f.counts(),{starts:1,ends:1,moves:6,detached:1,sessions:1});
});
test('touch retries only the opposite direction after an acquired unchanged boundary drag',async()=>{
  const f=touchFixture();const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,true);assert.deepEqual(r.attempts.map(x=>[x.direction,x.acquired,x.held,x.changed,x.released]),[['primary',true,true,false,true],['opposite',true,true,true,true]]);
  assert.ok(f.lab.s.m<.1);assert.deepEqual(f.counts(),{starts:2,ends:2,moves:12,detached:1,sessions:1});
});
test('touch input that is dispatched but not delivered cannot acquire or pass',async()=>{
  const f=touchFixture({deliver:false});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,false);assert.equal(r.status,'FAIL');assert.equal(r.reason,'touch-handle-not-acquired');assert.equal(r.attempts.length,1);
  assert.deepEqual(f.sent.map(x=>x.type),['touchStart','touchEnd']);assert.equal(f.lab.s.m,.1);
});
test('touch acquisition failure does not retry or send moves',async()=>{
  const f=touchFixture({acquire:false});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,false);assert.equal(r.acquired,false);assert.equal(r.released,true);assert.equal(r.attempts.length,1);assert.equal(f.counts().moves,0);
});
test('touch no-ops remain failures despite unrelated lesson/reveal animation',async()=>{
  const f=touchFixture({update:false,animate:true});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,false);assert.equal(r.reason,'touch-model-unchanged');assert.equal(r.changed,false);assert.equal(r.attempts.length,2);assert.equal(f.lab.s.m,.1);
});
test('touch release failure fails even when the model changed',async()=>{
  const f=touchFixture({initial:0,release:false});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.changed,true);assert.equal(r.pass,false);assert.equal(r.reason,'touch-drag-not-released');assert.equal(r.attempts.length,1);
});
test('touch cancellation during motion fails even if an early move changed the model',async()=>{
  const f=touchFixture({initial:0,cancelDuringMove:true});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.changed,true);assert.equal(r.released,true);assert.equal(r.held,false);assert.equal(r.pass,false);assert.equal(r.reason,'touch-drag-lost-during-move');
});
test('touch move transport error still ends the contact and never masks the error with a retry',async()=>{
  const f=touchFixture({failType:'touchMove'});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.pass,false);assert.equal(r.reason,'touch-input-error');assert.equal(r.released,true);assert.equal(r.attempts.length,1);
  assert.equal(f.sent.at(-1).type,'touchEnd');assert.equal(f.counts().detached,1);
});
test('touch start or end transport failures cannot pass',async()=>{
  for(const failType of ['touchStart','touchEnd']){
    const f=touchFixture({initial:0,failType});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
    assert.equal(r.pass,false);assert.equal(r.reason,failType==='touchStart'?'touch-input-error':'touch-end-error');
    assert.equal(f.sent.at(-1).type,'touchEnd');assert.equal(f.counts().detached,1);
  }
});
test('touch absence or unsupported CDP is a failure, not a skip or mouse fallback',async()=>{
  for(const options of [{maxTouchPoints:0},{failSession:true}]){
    const f=touchFixture(options);const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
    assert.equal(r.pass,false);assert.equal(r.status,'FAIL');assert.equal(r.reason,options.failSession?'touch-cdp-unavailable':'touch-capability-unavailable');assert.equal(f.sent.length,0);
  }
});
test('missing, pre-acquired and invalid/offscreen touch handles fail without input',async()=>{
  for(const mode of ['missing','preexisting','invalid','offscreen']){
    const f=touchFixture();
    if(mode==='missing')f.lab.board.handles=[];
    if(mode==='preexisting')f.lab.board.dragging={id:'slope'};
    if(mode==='invalid')f.lab.board.W=0;
    if(mode==='offscreen')f.box.y=900;
    const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');assert.equal(r.pass,false);assert.equal(f.sent.length,0);assert.equal(f.counts().detached,1);
  }
});
test('touch session cleanup failure is reported honestly after an otherwise successful gesture',async()=>{
  const f=touchFixture({initial:0,failDetach:true});const r=await probeNativeTouchDrag(f.page,f.canvas,f.settle,'slope');
  assert.equal(r.acquired,true);assert.equal(r.changed,true);assert.equal(r.released,true);assert.equal(r.pass,false);assert.equal(r.reason,'touch-session-detach-error');assert.match(r.cleanupError,/detach failure/);
});
