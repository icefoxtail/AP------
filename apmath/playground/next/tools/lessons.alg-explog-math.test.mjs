// Independent calculations against the first actual source packets.
// No expected value is taken from a generated lesson caption or source answer string.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/explog-lesson-runtime.mjs';
const lab=await load();
const source=id=>lab.api.first(id);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const roots=(A,n)=>n%2?1:A<0?0:A===0?1:2;
function bisect(fn,lo,hi){let sign=fn(lo);assert.ok(sign*fn(hi)<=0);for(let i=0;i<80;i++){let mid=(lo+hi)/2;if(sign*fn(mid)>0)lo=mid;else hi=mid;}return (lo+hi)/2;}
function lattice(k){let count=0;for(let x=1;x<=k;x++)for(let y=1;y<=10;y++)if(y<=Math.log2(x)+1+1e-12)count++;return count;}
function integerSolutions(n,p){const d=n*n-4*p;if(d<=0)return [];return [(n-Math.sqrt(d))/2,(n+Math.sqrt(d))/2];}
test('t1a: negative values and odd/even real roots',()=>{
 const v=source('t1a').fig, f=k=>(k-v.r1)*(k-v.r2);assert.deepEqual([v.r1,v.r2,v.k0],[2,6,4]);
 const ks=range(1,50).filter(k=>roots(f(k),4)===0);assert.deepEqual(ks,[3,4,5]);assert.equal(ks.reduce((a,b)=>a+b,0),12);assert.equal(roots(f(4),3)+roots(f(4),4),1);
});
test('t1b: all five root counts distinguish three signs',()=>{
 const v=source('t1b').fig;assert.deepEqual([v.r1,v.r2],[1,7]);const ks=range(1,50).filter(k=>range(2,6).reduce((sum,n)=>sum+roots((k-v.r1)*(k-v.r2),n),0)===5);assert.deepEqual(ks,[1,7]);
});
test('t2a: the translation preserves the line and paired intersections',()=>{
 const v=source('t2a').fig;assert.deepEqual([v.dx,v.dy,v.m],[2,4,2]);for(const x of [-2,0,1,3])near((v.m*x+1)+v.dy,v.m*(x+v.dx)+1);near(Math.hypot(v.dx,v.dy),2*Math.sqrt(5));near(2**0,2*0+1);near(2**(2-v.dx)+v.dy,2*2+1);
});
test('t2b: area from a coordinate transform and constant parallel sections',()=>{
 const v=source('t2b').fig;assert.deepEqual([v.dx,v.c1,v.c2],[3,1,3]);const section=Math.hypot(v.dx,v.dx),height=(v.c2-v.c1)/Math.sqrt(2);near(section*height,6);
 // In coordinates (x,c=y-x), the Jacobian determinant is one and each x interval has length 3.
 let integral=0;for(let i=0;i<1000;i++)integral+=v.dx*(v.c2-v.c1)/1000;near(integral,6);
});
test('t3a: inverse symmetry gives k and triangle area',()=>{
 const v=source('t3a').fig;assert.deepEqual([v.base,v.s],[2,0]);const x=bisect(u=>2**u-u-2,0,4),y=2**x;near(x,2);near(y,4);near(x+y,6);near(Math.abs(x*x-y*y)/2,6);near(Math.hypot(x-y,y-x),2*Math.sqrt(2));
});
test('t3b: shifted inverse equations share reflected intersections',()=>{
 const v=source('t3b').fig;assert.deepEqual([v.base,v.s,v.k],[2,1,8]);const x=bisect(u=>2**(u-1)+1+u-8,-2,5),y=8-x;near(x,3);near(y,5);near(Math.log2(y-1)+1,x);near(Math.hypot(x-y,y-x),2*Math.sqrt(2));
});
test('t4a: reciprocal x coordinates and unique positive height',()=>{
 const v=source('t4a').fig;assert.equal(v.base,2);const z=(15+Math.sqrt(225+64))/8;near(z,4);near(z-1/z,15/4);near(z*(1/z),1);near(Math.log2(z),2);
});
test('t4b: asymptote exclusion and product of exponential values',()=>{
 const v=source('t4b').fig;assert.deepEqual([v.k,v.t],[4,2]);const ts=range(1,8).filter(t=>[v.k-t,v.k+t].filter(u=>u>0).length===2);assert.deepEqual(ts,[1,2,3]);assert.equal(ts.reduce((a,b)=>a+b,0),6);near(Math.log2(v.k-v.t)+Math.log2(v.k+v.t),Math.log2(12));assert.equal([0,8].filter(u=>u>0).length,1);
});
test('t5a: midpoint is a full two-coordinate scaling',()=>{
 const v=source('t5a').fig;assert.deepEqual([v.py,v.r],[3,2]);const P=[1,v.py],Q=P.map(c=>v.r*c);assert.deepEqual(Q,[2,6]);const a=P[1]**(1/P[0]),b=Q[1]**(1/Q[0]);near(a+b*b,9);assert.ok(1<b&&b<a);
});
test('t5b: positivity removes the zero root',()=>{
 const v=source('t5b').fig;assert.equal(v.r,2);const valid=[0,2].filter(y=>y>0&&y*y===2*y);assert.deepEqual(valid,[2]);assert.equal(valid[0]+2*valid[0],6);
});
test('t6a: exact slope values and positive weighted average',()=>{
 const v=source('t6a').fig;assert.deepEqual([v.x1,v.x2],[1,3]);const f=x=>Math.log2(x+1),P=f(1),Q=f(3)/3,R=(f(3)-f(1))/2;assert.ok(P>Q&&Q>R);near(P/R,2);near(Q,P/3+2*R/3);
 for(const x of [.2,.7,1.2])for(const y of [2,3,4]){const p=f(x)/x,q=f(y)/y,r=(f(y)-f(x))/(y-x);assert.ok(p>q&&q>r);}
});
test('t6b: rectangle and trapezoid use the same width',()=>{
 const v=source('t6b').fig;assert.deepEqual([v.x1,v.x2],[1,3]);const width=v.x2-v.x1,trap=width*(2**v.x1+2**v.x2)/2,mid=width*2**((v.x1+v.x2)/2);near(trap,10);near(mid,8);near(trap-mid,2);
});
test('t7a: right boundary producing fourteen lattice points is unique',()=>{
 const v=source('t7a').fig;assert.equal(v.N,14);assert.deepEqual(range(1,12).filter(k=>lattice(k)===14),[6]);assert.equal(lattice(5),11);
});
test('t7b: row and column counts agree',()=>{
 const v=source('t7b').fig;assert.equal(v.k,6);assert.equal(lattice(6),14);const rows=range(1,3).map(y=>range(1,6).filter(x=>x>=2**(y-1)).length);assert.deepEqual(rows,[6,5,3]);assert.equal(rows.reduce((a,b)=>a+b,0),14);
});
test('t8a: a bijective exponential substitution preserves both roots',()=>{
 const v=source('t8a').fig;assert.deepEqual([v.s,v.p],[6,8]);const ts=integerSolutions(v.s,v.p),xs=ts.map(Math.log2);assert.deepEqual(ts,[2,4]);near(xs.reduce((a,b)=>a+b,0),3);near(ts.reduce((a,b)=>a+b*b,0),20);for(const x of xs)near(4**x-6*2**x+8,0);
});
test('t8b: both t roots must exceed one, not just zero',()=>{
 const v=source('t8b').fig;assert.deepEqual([v.s,v.p],[5,6]);const ps=range(-20,20).filter(p=>{const rs=integerSolutions(5,p);return rs.length===2&&rs.every(t=>t>1);});assert.deepEqual(ps,[5,6]);const rs=integerSolutions(5,6);near(rs[0]*rs[1],6);assert.equal(25-4*6,1);assert.deepEqual(integerSolutions(5,4),[1,4]);
});
test('t9a: closed right endpoint and open left endpoint change height counts',()=>{
 const v=source('t9a').v;assert.deepEqual(JSON.parse(JSON.stringify(v)),{a:0,b:1,c:2,q:5});const count=t=>Number(t>0&&t<4)+Number(t<=3);assert.deepEqual([-.1,0,.1,3,3.1,4,4.1].map(count),[1,1,2,2,1,0,0]);assert.equal(0+3+4,7);
});
test('t9b: W-shaped absolute value includes positive u only',()=>{
 const v=source('t9b').v;assert.deepEqual([v.fam,v.a,v.b],['exp',3,1]);const count=t=>{if(t<0)return 0;let candidates=[];for(const a of [-1,1])for(const b of [-1,1]){const u=3+a*(1+b*t);if(u>0&&Math.abs(Math.abs(u-3)-1)===t)candidates.push(u);}return new Set(candidates).size;};assert.deepEqual([-.5,0,.5,1,1.5,2,3].map(count),[0,2,4,3,2,1,1]);assert.equal(0+1+2,3);
});
test('t10a: equal distances determine u before area determines t',()=>{
 const packet=source('t10a');assert.equal(packet.ask,'at');assert.equal(packet.v.t0,3);const u=2,t=6/(u*u/2),a=u**(1/t);near(t,3);near(Math.hypot(t,u*u-u),Math.hypot(t,u));near(a*t,3*Math.cbrt(2));
});
test('t10b: equilateral height and log base are consistent',()=>{
 const v=source('t10b').v;assert.deepEqual([v.p,v.shape],[4,'eq']);const side=2*(v.p-1),height=side*Math.sqrt(3)/2,a=v.p**(1/height);near(a,4**(Math.sqrt(3)/9));near(Math.log(4)/Math.log(a),3*Math.sqrt(3));near(Math.hypot(3,height),6);
});
test('t11a: reflected path meets y=x at an interior point',()=>{
 const v=source('t11a').v;assert.deepEqual([v.a,v.b],[0,2]);const A=[0,1],B=[2,4],Bprime=[4,2],P=[4/3,4/3],distance=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);near(distance(A,P)+distance(B,P),Math.sqrt(17));near(distance(A,Bprime),Math.sqrt(17));for(const t of [.1,1,2,3,5])assert.ok(distance(A,[t,t])+distance(B,[t,t])>=Math.sqrt(17)-1e-10);
});
