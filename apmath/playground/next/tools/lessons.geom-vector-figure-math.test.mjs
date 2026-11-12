// Independent computations from the actual first packets and original conditions.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/vector-figure-lesson-runtime.mjs';
const lab=await load(),api=lab.api;
const v=p=>Array.isArray(p)?p:[p.x,p.y],p=(x,y)=>({x,y});
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>Math.hypot(...a),dist=(a,b)=>norm(sub(a,b)),cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-9,msg||a+' ≈ '+b);
const eq=(a,b)=>{assert.equal(a.length,b.length);a.forEach((x,i)=>near(x,b[i]));};
const angleCos=(u,v)=>Math.abs(dot(u,v))/(norm(u)*norm(v));

test('m1: noncollinear position vectors uniquely determine k=3/5',()=>{
 const q=api.first('m1'),a=q.mn/q.md,k=1-a,P=add(mul(q.A,a),mul(q.B,k));
 near(cross(q.A,q.B),-20);assert.notEqual(cross(q.A,q.B),0);
 near(k,3/5);near(k,q.val);eq(P,[8/5,14/5]);near(cross(sub(P,q.A),sub(q.B,q.A)),0);
});
test('m1: the first length ratio is 3:2 and external ratios use absolute lengths',()=>{
 const q=api.first('m1'),AB=sub(q.B,q.A),P=add(q.A,mul(AB,3/5));
 near(dist(q.A,P)/dist(P,q.B),3/2);assert.equal(q.rt,'3:2');
 for(const t of [-.5,0,.5,1,1.5]){
  const X=add(q.A,mul(AB,t));near(cross(sub(X,q.A),AB),0);
  near(dist(q.A,X),Math.abs(t)*norm(AB));near(dist(X,q.B),Math.abs(1-t)*norm(AB));
  if(t>0&&t<1)assert.ok(dot(sub(X,q.A),sub(X,q.B))<0);
 }
});
test('m2: area scales with the square of the coefficient sum',()=>{
 const q=api.first('m2'),S=q.S;
 near(S,4);near((q.k2*q.k2-q.k1*q.k1)*S,12);near(q.val,12);
 // Native exploration uses A=(3.2,.4), B=(.8,2.6); the review triangle is schematic.
 const A=[3.2,.4],B=[.8,2.6];near(Math.abs(cross(A,B))/2,S);
 for(const k of [.5,1,2])near(Math.abs(cross(mul(A,k),mul(B,k)))/2,k*k*S);
 near(Math.abs(cross(A,B)),8);
});
test('m2: the five original predicates distinguish boundaries, interiors and free points',()=>{
 const inside=(preset,m,n)=>api.math.regionContains({preset2:preset,m2:m,n2:n});
 for(const [name,m,n,yes] of [
  ['seg1',.7,.3,true],['seg1',.7,.4,false],['seg2',1.2,.8,true],['seg2',.7,.3,false],
  ['tri1',.2,.3,true],['tri1',.8,.7,false],['para',1,1,true],['para',1.2,.2,false],
  ['trap',.8,.7,true],['trap',.2,.2,false],['trap',1.2,1.2,false],['trap',1,0,true],['trap',2,0,true]
 ])assert.equal(inside(name,m,n),yes,name+' '+m+','+n);
 for(const name of ['seg1','seg2','tri1','para','trap'])assert.equal(inside(name,-.2,1.2),false);
});
test('m2: fixed nonnegative coefficient sums produce entire parallel segments',()=>{
 const A=[3.2,.4],B=[.8,2.6],AB=sub(B,A);
 for(const k of [1,2])for(const t of [0,.3,1]){
  const X=add(mul(A,k*(1-t)),mul(B,k*t));
  near(cross(sub(X,mul(A,k)),AB),0);
  near(dist(mul(A,k),X),k*t*norm(AB));
 }
});
test('m3: one nonzero normal and all its nonzero multiples are perpendicular',()=>{
 const q=api.first('m3');eq(q.u,[3,2]);eq(q.n,[2,-3]);
 near(dot(q.u,q.n),0);assert.ok(norm(q.n)>0);
 for(const k of [-2,.5,3])near(dot(q.u,mul(q.n,k)),0);
});
test('m3: a single parameter determines both coordinates and k=6',()=>{
 const q=api.first('m3'),t=(q.xp-q.A[0])/q.u[0],P=add(q.A,mul(q.u,t));
 near(t,2);near(t,q.t);eq(P,[7,6]);near(q.k,P[1]);
 for(const u of [-1,0,2]){const X=add(q.A,mul(q.u,u));near(2*(X[0]-1)-3*(X[1]-2),0);}
});
test('m4: the midpoint identity is equivalent to the whole diameter circle',()=>{
 const q=api.first('m4'),M=mul(add(q.A,q.B),.5),R=dist(q.A,q.B)/2;
 eq(M,[0,1]);near(R*R,13);near(q.d2,52);
 for(const X of [[0,0],[2,-3],q.A,q.B,[4,1]])near(dot(sub(X,q.A),sub(X,q.B)),dist(X,M)**2-R*R);
 for(const theta of [0,.5,2,Math.PI]){
  const X=add(M,[R*Math.cos(theta),R*Math.sin(theta)]);
  near(dot(sub(X,q.A),sub(X,q.B)),0);
 }
});
test('m4: circumference and area use radius squared 13, not diameter squared 52',()=>{
 const q=api.first('m4'),r=dist(q.A,q.B)/2;
 near(2*Math.PI*r,2*Math.sqrt(13)*Math.PI);near(Math.PI*r*r,13*Math.PI);
 near(dist(q.A,q.M),r);
});
test('m4: diameter endpoints satisfy the dot product without defining an angle',()=>{
 const q=api.first('m4');
 for(const X of [q.A,q.B]){
  const u=sub(X,q.A),w=sub(X,q.B);
  near(dot(u,w),0);near(norm(u)*norm(w),0);
  assert.ok(Number.isNaN(dot(u,w)/(norm(u)*norm(w))));
 }
});
test('m4: the tangent at A has equation 3x+2y+11=0',()=>{
 const q=api.first('m4'),d=[-2,3],AB=sub(q.B,q.A);
 near(dot(AB,d),0);
 for(const t of [-2,0,3]){
  const X=add(q.A,mul(d,t));near(3*X[0]+2*X[1]+11,0);
  near(dot(sub(X,q.A),AB),0);
 }
});
test('cnd5: the first nonzero normal yields line 3x+4y=11',()=>{
 const q=api.first('cnd5'),A=v(q.A),b=v(q.b);
 near(dot(b,A),11);near(norm(b),5);
 for(const t of [-2,0,1]){const X=add(A,mul([4,-3],t));near(dot(sub(X,A),b),0);near(3*X[0]+4*X[1],11);}
});
test('cnd5: the first norm condition is the circle (x+4)²+(y-2)²=1',()=>{
 const q=api.first('cnd5'),C=v(q.C);eq(C,[-4,2]);near(q.r,1);
 for(const theta of [0,Math.PI/2,Math.PI]){
  const Q=add(C,[Math.cos(theta),Math.sin(theta)]);near(dist(Q,C),q.r);near((Q[0]+4)**2+(Q[1]-2)**2,1);
 }
});
test('cnd5: independent perpendicular projection and radial point attain minimum 2',()=>{
 const q=api.first('cnd5'),A=v(q.A),b=v(q.b),C=v(q.C),signed=dot(b,sub(C,A))/norm(b);
 const H=sub(C,mul(b,signed/norm(b))),d=Math.abs(signed),Q=add(C,mul(sub(H,C),q.r/d));
 near(d,3);eq(H,[-11/5,22/5]);eq(Q,[-17/5,14/5]);near(dist(H,Q),2);
 eq(v(q.g.H),H);eq(v(q.g.P0),H);eq(v(q.g.Q0),Q);near(q.ans,2);
 // The triangle inequality gives the lower bound for arbitrary admissible points.
 for(const t of [-1,0,2])for(const theta of [0,.7,2]){
  const X=add(A,mul([4,-3],t)),Y=add(C,[Math.cos(theta),Math.sin(theta)]);
  assert.ok(dist(X,Y)>=d-q.r-1e-9);
 }
});
test('cnd5: tangency and intersection use actual common points rather than the foot',()=>{
 for(const [cx,kind] of [[2,'exterior'],[1,'tangent'],[.5,'intersect']]){
  const g=api.math.geom(p(0,0),p(1,0),p(cx,0),1);
  assert.equal(g.relation,kind);near(g.min,Math.max(0,cx-1));
  near(g.P0.x,0);near(dist(v(g.Q0),[cx,0]),1);
  near(dist(v(g.P0),v(g.Q0)),g.min);
  if(cx<1){near(g.P0.y,Math.sqrt(1-cx*cx));assert.ok(dist(v(g.P0),v(g.H))>0);}
 }
});
test('cnd5: zero normal imposes no restriction on P and has minimum zero',()=>{
 const g=api.math.geom(p(0,0),p(0,0),p(1,0),1);
 assert.equal(g.plane,true);assert.equal(g.H,null);assert.equal(g.d,null);assert.equal(g.t,null);
 for(const X of [[0,0],[1,-1],[2,0]])near(dot(X,[0,0]),0);
 eq(v(g.P0),[2,0]);eq(v(g.P0),v(g.Q0));near(g.min,0);
});
test('cnd5: every original first-problem dataset has a verified exterior minimum',()=>{
 for(const q of api.math.firstConditions){
  const d=Math.abs(dot(sub(q.C,q.A),q.b))/norm(q.b);
  assert.ok(d>q.r);
  const g=api.math.geom(p(...q.A),p(...q.b),p(...q.C),q.r);
  near(g.min,d-q.r);near(dot(sub(v(g.P0),q.A),q.b),0);
  near(dist(v(g.Q0),q.C),q.r);near(dist(v(g.P0),v(g.Q0)),d-q.r);
 }
});
test('ang6: the first symmetric equations share the stated intersection',()=>{
 const q=api.first('ang6'),X=v(q.X),u=v(q.d1),w=v(q.d2);
 eq(X,[2,1]);eq(v(q.p1),[-1,0]);eq(v(q.p2),[3,4]);
 near(cross(sub(X,v(q.p1)),u),0);near(cross(sub(X,v(q.p2)),w),0);
 near((X[0]+1)/3,X[1]);near(X[0]-3,(X[1]-4)/3);
});
test('ang6: the first acute cosine is exactly 3/5',()=>{
 const q=api.first('ang6'),u=v(q.d1),w=v(q.d2);
 near(dot(u,w),6);near(norm(u)*norm(w),10);near(angleCos(u,w),3/5);near(q.cosN/q.cosD,3/5);
});
test('ang6: reversal and nonzero scaling preserve the smaller line angle',()=>{
 const q=api.first('ang6'),u=v(q.d1),w=v(q.d2),c=angleCos(u,w);
 for(const a of [-2,.5,3])for(const b of [-1,.5,2])near(angleCos(mul(u,a),mul(w,b)),c);
 const phi=Math.acos(dot(u,mul(w,-1))/(norm(u)*norm(w)));
 assert.ok(phi>Math.PI/2);near(Math.cos(Math.PI-phi),c);
});
test('ang6: perpendicular, parallel and zero-direction cases have distinct meanings',()=>{
 const u=[3,1];near(dot(u,[-1,3]),0);near(angleCos(u,[-1,3]),0);
 near(cross(u,[3,1]),0);near(angleCos(u,[3,1]),1);near(angleCos(u,[-3,-1]),1);
 assert.ok(Number.isNaN(angleCos(u,[0,0])));
});
test('ang6: all original direction pairs are nonzero and have exact rational cosines',()=>{
 for(const [u,w] of api.math.anglePairs){
  assert.ok(norm(u)>0&&norm(w)>0);assert.ok(angleCos(u,w)>0&&angleCos(u,w)<1);
  near(norm(u)*norm(w),Math.round(norm(u)*norm(w)));
 }
});

for(const mode of [1,2,3,4])test('m'+mode+': all original changed-number packets satisfy their source conditions',()=>{
 for(const data of api.math.firstPool[mode]){
  const q=api.math.generators[mode](data);
  if(mode===1){
   const k=1-q.mn/q.md,P=add(mul(q.A,q.mn/q.md),mul(q.B,k));
   assert.notEqual(cross(q.A,q.B),0);near(k,q.val);near(cross(sub(P,q.A),sub(q.B,q.A)),0);
   near(dist(q.A,P)/dist(P,q.B),k/(1-k));
  }else if(mode===2)near(q.val,(q.k2*q.k2-q.k1*q.k1)*q.S);
  else if(mode===3){const t=(q.xp-q.A[0])/q.u[0];near(q.k,q.A[1]+t*q.u[1]);near(dot(q.u,q.n),0);}
  else {eq(q.M,mul(add(q.A,q.B),.5));near(q.d2,dist(q.A,q.B)**2);}
 }
});
