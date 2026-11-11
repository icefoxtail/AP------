// Independent Euclidean checks of the actual source packets and exploration rules.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/space-coord-lesson-runtime.mjs';
const lab=await load(),api=lab.api;
const v=p=>Array.isArray(p)?p:[p.x,p.y,p.z];
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>Math.hypot(...a),dist=(a,b)=>norm(sub(a,b));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-9,msg||a+' ≈ '+b);
const eq=(a,b)=>{assert.equal(a.length,b.length);a.forEach((x,i)=>near(x,b[i]));};
const plain=x=>JSON.parse(JSON.stringify(x)),fval=f=>f.n/f.d;
const p=(x,y,z)=>({x,y,z});
const first=m=>api.first('mode'+m);

test('mode1: reflection gives a global lower bound, attained at the plane crossing',()=>{
 const [A,B,Bp]=first(1).geometry.pts.map(v);eq(Bp,[B[0],B[1],-B[2]]);
 const t=A[2]/(A[2]-Bp[2]),P=add(A,mul(sub(Bp,A),t));near(P[2],0);
 near(dist(A,Bp),7);near(dist(A,P)+dist(P,B),7);
 // Off the original candidate line too: reflection preserves distance everywhere.
 for(const X of [[0,0,0],[4,-2,0],P,[7,5,0]]){
  near(dist(X,B),dist(X,Bp));assert.ok(dist(A,X)+dist(X,B)>=7-1e-9);
 }
});
test('mode1: the optimum divides the projected segment in the ratio 1:2',()=>{
 const [A,B,Bp,A0,B0]=first(1).geometry.pts.map(v),t=A[2]/(A[2]-Bp[2]);
 const P=add(A,mul(sub(Bp,A),t));eq(P,[5/3,2,0]);
 near(dist(A0,P)/dist(P,B0),1/2);near(t,first(1).snap.t1);
});
test('mode2: solving the plane equation yields the correct ratio and coordinates',()=>{
 const [A,B,,,P]=first(2).geometry.pts.map(v),t=-A[2]/(B[2]-A[2]);
 const X=add(A,mul(sub(B,A),t));eq(X,[2,-3,0]);eq(X,P);
 near(dist(A,X)/dist(X,B),2);near(t,first(2).snap.t2);
});
test('mode2: one affine parameter controls all three coordinates of the segment',()=>{
 const [A,B]=first(2).geometry.pts.map(v),AB=sub(B,A);
 for(const t of [0,.25,.5,.75,1]){
  const X=add(A,mul(AB,t));near(norm(cross(sub(X,A),AB)),0);
  near(dist(A,X),t*norm(AB));near(X[2],4-6*t);
  if(t>0&&t<1)near(dist(A,X)/dist(X,B),t/(1-t));
 }
});
test('mode3: section points lie on both the given sphere and the xy plane',()=>{
 const {c,R}=first(3).geometry.sphere,C=v(c),r2=R*R-C[2]*C[2];
 near(r2,16);near(Math.sqrt(r2),4);near(Math.PI*r2,16*Math.PI);
 for(const phi of [0,Math.PI/3,Math.PI/2])near(dist(C,[4*Math.cos(phi),4*Math.sin(phi),0]),R);
});
test('mode3: a great circle, proper section, tangency and empty intersection differ',()=>{
 const {R}=first(3).geometry.sphere;
 for(const [d,kind] of [[0,'great'],[3,'circle'],[5,'point'],[6,'empty']]){
  const r2=R*R-d*d;
  if(kind==='great')near(Math.sqrt(r2),R);
  else if(kind==='circle')assert.ok(r2>0);
  else if(kind==='point'){near(r2,0);near(dist([0,0,d],[0,0,0]),R);}
  else {assert.ok(r2<0);assert.ok(dist([0,0,d],[0,0,0])>R);}
 }
});
test('mode4: the two collinear sphere points attain the global distance bounds',()=>{
 const {c,R}=first(4).geometry.sphere,C=v(c),P=v(first(4).geometry.pts[1]);
 const n=mul(sub(P,C),1/dist(P,C)),Qmin=add(C,mul(n,R)),Qmax=sub(C,mul(n,R));
 near(dist(P,Qmin),2);near(dist(P,Qmax),8);
 for(const Q of [Qmin,Qmax,[0,3,0],[0,0,-3]])assert.ok(dist(P,Q)>=2-1e-9&&dist(P,Q)<=8+1e-9);
});
test('mode4: the exact tangent point has perpendicular radius and length 4',()=>{
 const {R}=first(4).geometry.sphere,P=v(first(4).geometry.pts[1]),d=norm(P);
 const a=Math.atan2(P[2],P[0])+Math.acos(R/d),T=[R*Math.cos(a),0,R*Math.sin(a)];
 near(norm(T),3);near(dot(T,sub(P,T)),0);near(dist(P,T),4);
 near(first(4).snap.th,Math.acos(R/d)*180/Math.PI);
});
test('mode4: the contact circle has fixed center and radius 12/5',()=>{
 const {R}=first(4).geometry.sphere,P=v(first(4).geometry.pts[1]),d2=dot(P,P);
 const H=mul(P,R*R/d2),rho=Math.sqrt(R*R-dot(H,H)),u=[-3/5,0,4/5],w=[0,1,0];
 near(norm(H),9/5);near(rho,12/5);
 for(const a of [0,.7,Math.PI/2,Math.PI]){
  const T=add(H,mul(add(mul(u,Math.cos(a)),mul(w,Math.sin(a))),rho));
  near(norm(T),R);near(dot(T,sub(P,T)),0);near(dist(H,T),rho);near(dot(sub(T,H),P),0);
 }
});
test('mode4: the authored moving angle obeys the cosine law',()=>{
 const {R}=first(4).geometry.sphere,P=v(first(4).geometry.pts[1]),a=Math.atan2(P[2],P[0]);
 for(const deg of [0,60,90,180,360]){
  const theta=deg*Math.PI/180,Q=[R*Math.cos(a+theta),0,R*Math.sin(a+theta)];
  near(dist(P,Q)**2,34-30*Math.cos(theta));
 }
 near(34-30*Math.cos(Math.PI/3),19);
});
test('mode5: the first foot and reflected point have distance sqrt(61)',()=>{
 const q=first(5),P=v(q.P),A=v(q.A),B=v(q.B);
 eq(P,[3,-2,5]);eq(A,[P[0],P[1],0]);eq(B,[-P[0],P[1],P[2]]);
 near(dist(A,B)**2,61);near(q.d2,dist(A,B)**2);
});
test('mode5: all plane and axis projections/reflections preserve the required subspace',()=>{
 const P=p(3,-2,5),a=v(P),kept=[[0,1],[1,2],[0,2],[0],[1],[2],[]];
 for(let target=0;target<7;target++)for(const kind of [0,1]){
  const got=api.math.derive5(P,kind,target),M=a.map((x,i)=>kept[target].includes(i)?x:0);
  eq(v(got.M),M);
  eq(v(got.D),kind?sub(mul(M,2),a):M);
  if(kind){eq(mul(add(a,v(got.D)),.5),M);near(dist(a,M),dist(v(got.D),M));}
  for(const i of kept[target])near(v(got.D)[i],a[i]);
 }
});
test('mode5: points already on the reference subspace remain fixed',()=>{
 for(const [P,tgt] of [[p(2,3,0),0],[p(2,0,0),3],[p(0,0,0),6]]){
  for(const kind of [0,1])eq(v(api.math.derive5(P,kind,tgt).D),v(P));
 }
});
test('mode6: completing the original square gives center (2,-1,3) and R²=14-k',()=>{
 const q=first(6);eq(q.c,[2,-1,3]);near(q.K0,14);
 for(const X of [[0,0,0],[2,-1,3],[3,4,5]]){
  const [x,y,z]=X,k=8,expanded=x*x+y*y+z*z-4*x+2*y-6*z+k;
  near(expanded,dot(sub(X,q.c),sub(X,q.c))-(14-k));
 }
});
test('mode6: tangency fixes k=5 and the other plane gives area 5pi',()=>{
 const q=first(6),d=Math.abs(q.c[2]),k=dot(q.c,q.c)-d*d;
 near(k,5);near(q.k,k);near(q.R2,9);
 const dOther=Math.abs(q.c[0]),r2=d*d-dOther*dOther;near(r2,5);near(q.r2,r2);
 const H=[0,q.c[1],q.c[2]],X=add(H,[0,Math.sqrt(r2),0]);near(dist(X,q.c),d);
});
test('mode6: all three tangent constants and sphere existence boundaries are distinct',()=>{
 const q=first(6),distances=[Math.abs(q.c[2]),Math.abs(q.c[0]),Math.abs(q.c[1])];
 eq(distances.map(d=>q.K0-d*d),[5,10,13]);
 assert.ok(q.K0-8>0);near(q.K0-14,0);assert.ok(q.K0-16<0);
 // At k=14, each nonnegative square must vanish; the only point is the center.
 near(dot(sub(q.c,q.c),sub(q.c,q.c)),0);
});
test('mode7: centroid, external division and distance agree with the first source',()=>{
 const q=first(7),G=mul(add(add(q.A,q.B),q.C),1/3),Q=mul(sub(mul(q.B,q.m),mul(q.A,q.n)),1/(q.m-q.n));
 eq(G,[3,2,3]);eq(Q,[5,-6,7]);eq(q.G.map(fval),G);eq(q.Q.map(fval),Q);
 near(dist(G,Q)**2,84);near(q.d2,84);near(Math.sqrt(q.d2),2*Math.sqrt(21));
});
test('mode7: actual internal division satisfies the positive distance ratio',()=>{
 const {A,B}=first(7);
 for(const [m,n] of [[2,1],[1,1],[1,3],[3,2]]){
  const X=Array.from(api.math.div7(A,B,m,n,false),fval);
  near(norm(cross(sub(X,A),sub(B,A))),0);near(dist(A,X)/dist(X,B),m/n);
  assert.ok(dot(sub(X,A),sub(X,B))<=0);
 }
 eq(Array.from(api.math.div7(A,B,1,1,false),fval),[2,0,4]);
});
test('mode7: external division changes order and excludes equal weights',()=>{
 const {A,B}=first(7),AB=sub(B,A);
 for(const [m,n,t] of [[2,1,2],[1,2,-1],[3,2,3]]){
  const X=Array.from(api.math.div7(A,B,m,n,true),fval);
  eq(X,add(A,mul(AB,t)));near(dist(A,X)/dist(X,B),m/n);
 }
 assert.equal(api.math.div7(A,B,1,1,true),null);
 const G=mul(add(add(A,B),first(7).C),1/3),M=mul(add(B,first(7).C),.5);
 near(dist(A,G)/dist(G,M),2);
});
test('mode8: independent vector area gives the first triangle area 18',()=>{
 const q=first(8),a=q.a,u=q.u,F=[a,0,0],H=[0,a,0],P=[u,u,a-u],M=[a/2,a/2,0];
 eq(P,[2,2,4]);near(dot(sub(P,M),sub(H,F)),0);
 const area=norm(cross(sub(F,P),sub(H,P)))/2;
 near(area,18);near(q.area2,area*area);near(q.PM2,dist(P,M)**2);
});
test('mode8: moving height stays perpendicular even when Q=M or P=Q=G',()=>{
 for(const u of [0,2,3,6]){
  const F=[6,0,0],H=[0,6,0],P=[u,u,6-u],Q=[u,u,0],M=[3,3,0],model=api.math.mk8(6,u);
  near(dot(sub(P,M),sub(H,F)),0);
  near(dist(P,M)**2,dist(P,Q)**2+dist(Q,M)**2);
  near(model.PM2,dist(P,M)**2);
  if(u===3)near(dist(Q,M),0);
  if(u===6){near(dist(P,Q),0);assert.ok(dist(P,M)>0);}
 }
});
test('mode8: the original shortcut is a right angle at P, not a general moving claim',()=>{
 const q=first(8),P=[q.u,q.u,q.a-q.u],F=[q.a,0,0],H=[0,q.a,0];
 near(dot(sub(F,P),sub(H,P)),0);near(dist(P,F),6);near(dist(P,H),6);
 const other=[3,3,3];assert.notEqual(dot(sub(F,other),sub(H,other)),0);
});

for(const mode of [5,6,7,8])test('mode'+mode+': an actual changed-number packet remains mathematically coherent',()=>{
 const q=api.variant('mode'+mode,1);assert.notDeepEqual(plain(q),plain(first(mode)));
 if(mode===5){
  const axes=[2,0,1],P=v(q.P),A=P.slice(),B=P.slice();A[axes[q.f]]=0;B[axes[q.s]]*=-1;
  eq(A,v(q.A));eq(B,v(q.B));near(dist(A,B)**2,q.d2);
 }else if(mode===6){
  const distances=[Math.abs(q.c[2]),Math.abs(q.c[0]),Math.abs(q.c[1])];
  near(q.k,dot(q.c,q.c)-distances[q.tp]**2);near(q.R2,distances[q.tp]**2);
  near(q.r2,q.R2-distances[q.op]**2);assert.ok(q.r2>0);
 }else if(mode===7){
  const G=mul(add(add(q.A,q.B),q.C),1/3),Q=add(q.A,mul(sub(q.B,q.A),q.m/(q.m-q.n)));
  eq(G,q.G.map(fval));eq(Q,q.Q.map(fval));near(dist(G,Q)**2,q.d2);
 }else{
  const P=[q.u,q.u,q.a-q.u],F=[q.a,0,0],H=[0,q.a,0],area=norm(cross(sub(F,P),sub(H,P)))/2;
  near(area*area,q.area2);near(q.u/(q.a-q.u),q.m/q.n);
 }
});
