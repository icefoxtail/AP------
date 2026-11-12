import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {load} from './helpers/surface-volume-lesson-runtime.mjs';
const require=createRequire(import.meta.url),g=require('../kit/apl-g7-short-solids.js');
const near=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<eps*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);

test('all production frusta: equal central angle, preserved arc lengths, surface and independent volume integration',async()=>{
 const lab=await load();lab.G=lab.api;lab.go('sv2-4');
 for(const fam of ['A','B','C'])for(let k=2;k<=5;k++)for(let j=1;j<k;j++){
  Object.assign(lab.s,{svTri4:fam,s4K:k,s4J:j});
  const before=JSON.stringify(lab.s), original=lab.scene.sv.model({...lab.s}),m=g.frustumModel(original);
  near(m.theta*m.R2,2*Math.PI*m.r2);near(m.theta*m.R1,2*Math.PI*m.r1);
  near(.5*m.theta*(m.R2**2-m.R1**2),Math.PI*m.ring);
  near(Math.PI*m.surface,lab.api.vnum(original.surf));
  let volume=0,lateral=0;const n=3000;
  for(let z=0;z<n;z++){
   const h=(z+.5)*m.hf/n,r=m.r2-(m.r2-m.r1)*h/m.hf;
   volume+=Math.PI*r*r*m.hf/n;
   lateral+=2*Math.PI*r*Math.hypot(m.hf,m.r2-m.r1)/n;
  }
  near(volume,Math.PI*m.volume/3,1e-7);near(lateral,Math.PI*m.ring);
  const plans=g.registry['g7-surface-volume/sv2-4'](lab,lab.s);assert.equal(plans.length,2);
  assert.equal(JSON.stringify(lab.s),before,'proof model must not modify live conditions');
  for(const p of plans){assert.ok(p.duration<=10);for(const t of [0,.8,2,3.1,4.1,5.7,6.5,9]){lab.board.begin();p.draw(lab.board,t,p.model);lab.board.end();}}
 }
});

test('hinge unfolding preserves all polygonal face edges throughout motion',async()=>{
 const lab=await load(),G=lab.api;lab.go('sv2-4');const m=g.frustumModel(lab.scene.sv.model({...lab.s})),{sn}=g.netGeometry(G,m);
 const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
 for(const t of [0,.17,.4,.7,1]){
  const poses=G.netPose(sn.net,t);
  sn.net.pieces.forEach((pc,i)=>pc.pts.forEach((a,j)=>{
   const b=pc.pts[(j+1)%pc.pts.length];near(length(a,b),length(G.applyT(poses[i],a),G.applyT(poses[i],b)));
  }));
 }
});

test('all tank bodies and heights: mass conservation, monotone immersion and exact full containment',async()=>{
 const lab=await load();lab.G=lab.api;lab.go('sv3-4');
 for(const body of ['sph','cone','cyl'])for(const r of [2,3,7,15])for(const k of [0,3,8]){
  Object.assign(lab.s,{s8R:r,s8K:k,svBody:body});
  const native=lab.scene.sv.model({...lab.s}),m=g.tankModel(native);
  near(m.numerator*Math.PI/3,lab.api.vnum(native.over));
  near(m.remaining*Math.PI/3,lab.api.vnum(native.remain));
  let prev=-1;
  for(let i=0;i<=100;i++){
   const p=g.tankPose(m,9*i/100);assert.ok(p.displacement>=prev-1e-9);prev=p.displacement;
   near(p.displacement+p.remaining,m.tank);assert.ok(p.bottom>=0);assert.ok(p.remaining>=-1e-9);
   const d=Math.max(0,Math.min(m.height,m.h-p.bottom));let independent=0;const n=1000;
   for(let q=0;q<n;q++) {const y=d*(q+.5)/n,rsq=body==='sph'?r*r-(y-r)**2:body==='cone'?r*r*(1-y/m.h)**2:r*r;independent+=Math.max(0,rsq)*d/n;}
   near(p.displacement,independent,1.1e-6);
  }
  near(g.tankPose(m,0).displacement,0);near(g.tankPose(m,9).displacement,m.numerator/3);
  const snapshot=JSON.stringify(lab.s),plans=g.registry['g7-surface-volume/sv3-4'](lab,lab.s);assert.equal(plans.length,2);
  for(const p of plans)for(const t of [0,1.1,3.1,5.1,6.8,9]){lab.board.begin();p.draw(lab.board,t,p.model);lab.board.end();}
  assert.equal(JSON.stringify(lab.s),snapshot);
 }
});

test('target order follows actual exploration goal and invalid containment is rejected',async()=>{
 const lab=await load();lab.G=lab.api;lab.go('sv2-4');lab.s.svMode='vol';assert.equal(g.registry['g7-surface-volume/sv2-4'](lab,lab.s)[0].id,'frustum-volume');
 lab.go('sv3-4');lab.s.svTankMode='over';assert.equal(g.registry['g7-surface-volume/sv3-4'](lab,lab.s)[0].id,'tank-over');
 assert.throws(()=>g.tankModel({r:3,h:5,body:'sph'}));assert.throws(()=>g.frustumModel({r2:6,r1:4,h2:8,h1:4,R2:10,R1:5}));
});
