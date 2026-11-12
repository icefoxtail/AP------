// Independent calculations from the actual first-source packets and exploration functions.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/composite-lesson-runtime.mjs';
const lab=await load(),M=lab.api.math,first=lab.api.first;
const near=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<=eps,`${a} ≈ ${b}`);
const array=(xs,ys)=>{assert.equal(xs.length,ys.length);Array.from(xs).sort((a,b)=>a-b).forEach((x,i)=>near(x,[...ys].sort((a,b)=>a-b)[i]));};
const side=(f,x,d)=>{const e=1e-6;return (f(x+d*e)-f(x))/(d*e);};
const derivative=(f,x)=>{const e=1e-5;return (f(x+e)-f(x-e))/(2*e);};

test('abs first goal: opposite one-sided slopes select the positive m',()=>{
  const p=first('abs');assert.equal(p.fam,'A');assert.equal(p.kk,0);
  const m=Math.sqrt(3/3);near(p.m,m);
  const g=M.transOf('in',m);near(side(g,0,1),0,4e-6);near(side(g,0,-1),0,4e-6);
  const example=M.transOf('in',p.mex);assert.ok(Math.abs(side(example,0,1)-side(example,0,-1))>1);
});
test('abs second goal: evaluate the selected source function at the junction',()=>{
  const p=first('abs'),result=(-1)**3-3*(-1);near(p.f(0),result);near(p.g(0),result);near(p.g0,result);
});
test('outside absolute value reflects heights and corners occur at three simple zeros',()=>{
  const f=x=>x**3-3*x,g=M.transOf('out',0);
  for(const x of [-2,-1,.5,1,2])near(g(x),f(x)<0?-f(x):f(x));
  for(const x of [-Math.sqrt(3),0,Math.sqrt(3)]){near(g(x),0);assert.ok(Math.abs(side(g,x,1)-side(g,x,-1))>5);}
});
test('nested absolute values copy the right side and retain a corner at the origin',()=>{
  const g=M.transOf('both',0);
  for(const x of [.2,1,2]){near(g(-x),g(x));near(g(x),Math.abs(x**3-3*x));}
  near(side(g,0,-1),-3,1e-5);near(side(g,0,1),3,1e-5);
});

test('scan first goal: the critical pair of horizontal lines has four distinct roots',()=>{
  const p=first('scan');assert.equal(p.t,0);assert.equal(p.N1,4);
  const xs=[-2,-1,1,2];xs.forEach(x=>near(Math.abs(x**3-3*x),2));array(M.foldedLevels(0,2),xs);
  assert.equal(p.set1.length,1);assert.equal(p.set1[0].kind,'pt');near(p.set1[0].lo,2);
});
test('scan second goal: open interval excludes both zero and tangent height',()=>{
  const p=first('scan');assert.equal(p.N2,6);assert.equal(p.set2.length,1);
  assert.equal(p.set2[0].kind,'iv');near(p.set2[0].lo,0);near(p.set2[0].hi,2);
  for(const k of [.1,1,1.999]){const xs=M.foldedLevels(0,k);assert.equal(xs.length,6);xs.forEach(x=>near(Math.abs(x**3-3*x),k));}
  assert.equal(M.foldedLevels(0,0).length,3);assert.equal(M.foldedLevels(0,2).length,4);assert.equal(M.foldedLevels(0,2.001).length,2);
});
test('zero folded height deduplicates the coincident two equations',()=>{
  array(M.foldedLevels(0,0),[-Math.sqrt(3),0,Math.sqrt(3)]);
  array(M.foldedLevels(2,0),[-1,2]);assert.equal(M.foldedLevels(0,-1).length,0);
});
test('shifted fold has two roots at level 2 and three at level 0',()=>{
  const roots=[-Math.sqrt(3),0,Math.sqrt(3),-1,2];array(M.foldedLevels(1,1),roots);
  roots.forEach(x=>near(Math.abs(x**3-3*x-1),1));
});

test('heal first goal: equality of one-sided product slopes gives r=2',()=>{
  const p=first('heal');assert.equal(p.fam,'lin');assert.equal(p.c,2);assert.equal(p.u,1);assert.equal(p.p,1);
  const right=r=>2-r,left=r=>r-2,result=2;near(right(result),left(result));near(p.r,result);near(p.g(2),0);
  for(const r of [0,1,2.5])assert.notEqual(right(r),left(r));
});
test('heal second goal: the actual product difference quotient tends to zero',()=>{
  const p=first('heal');near(p.h(2),0);
  for(const d of [-.1,-.01,.01,.1])near((p.h(2+d)-p.h(2))/d,Math.abs(d));
  near(side(p.h,2,-1),0,2e-6);near(side(p.h,2,1),0,2e-6);
});

function extremaCandidates(c){
  const xs=[0];for(const u of [-1,1])if(u>c)xs.push(-Math.sqrt(2*(u-c)),Math.sqrt(2*(u-c)));
  return xs.sort((a,b)=>a-b);
}
const dh=(x,c)=>.75*x*(x*x+2*c-2)*(x*x+2*c+2);
function countExtrema(c){return extremaCandidates(c).filter(x=>dh(x-1e-4,c)*dh(x+1e-4,c)<0).length;}
test('original composite extrema: five distinct derivative zeros all change sign',()=>{
  const p=first('extrema');near(p.a.v,.5);near(p.c,-2);
  array(p.ext.map(x=>x.x),[-Math.sqrt(6),-Math.sqrt(2),0,Math.sqrt(2),Math.sqrt(6)]);
  for(const x of [-2.2,-1.1,.2,1.3,2.6])near(derivative(p.h,x),dh(x,-2),1e-7);
  assert.equal(countExtrema(-2),5);assert.equal(p.n,5);
});
test('moving the inner range gives the stated three extrema-count regions',()=>{
  for(const c of [-2.5,-2,-1.001,-1,-.5,0,.999,1,2,2.5])assert.equal(M.extremaCount(c),countExtrema(c),`c=${c}`);
});
test('at either critical height x=0 is a triple derivative root with a sign change',()=>{
  for(const c of [-1,1]){
    const cubic=x=>.75*x**3*(x*x+4*c);
    for(const x of [-.1,.1,2.1])near(dh(x,c),cubic(x));
    assert.notEqual(Math.sign(dh(-.001,c)),Math.sign(dh(.001,c)));
    assert.equal(extremaCandidates(c).filter(x=>x===0).length,1);
  }
});

test('original composite equation: range removes one outer root and leaves four x values',()=>{
  const p=first('solve');near(p.a.v,.5);near(p.c,-1);array(p.roots.map(r=>r.val),[-Math.sqrt(3),0,Math.sqrt(3)]);
  const xs=[-Math.sqrt(2),Math.sqrt(2),-Math.sqrt(2*(1+Math.sqrt(3))),Math.sqrt(2*(1+Math.sqrt(3)))];
  array(p.xsAll,xs);for(const x of xs){const u=x*x/2-1;near(u**3-3*u,0);near(p.gx(x),u);}
  assert.equal(p.n,4);assert.deepEqual(Array.from(p.per,x=>x.k),[0,2,2]);
});
test('tangent outer level and inner vertex are each counted once',()=>{
  const result=M.stepTwoCount(2,-1);array(result.uRoots,[-1,2]);assert.equal(result.total,3);
  array(M.innerRoots(-1,-1),[0]);array(M.innerRoots(-1,2),[-Math.sqrt(6),Math.sqrt(6)]);
  for(const x of [0,-Math.sqrt(6),Math.sqrt(6)])near((x*x/2-1)**3-3*(x*x/2-1),2);
});

test('kinkcancel first problem: triple-root coefficient comparison determines the line',()=>{
  const p=first('kinkcancel');assert.equal(p.kind,'A');assert.equal(p.x0,0);assert.equal(p.k,1);
  assert.deepEqual(Array.from(p.co,x=>x||0),[1,0,-3,0]);
  // For u=(x-a)^3 the x² coefficient -3a must be zero: a=0, g=f-x³.
  for(const x of [-2,-.2,0,1,2]){near(p.f(x),x**3-3*x);near(p.g(x),-3*x);near(p.h(x),x**3-3*x+Math.abs(x**3));}
  near(p.ans,-3);near(side(p.h,0,-1),-3,1e-5);near(side(p.h,0,1),-3,1e-5);
});
test('max identity and actual simple intersections give three corners',()=>{
  const g=M.g6(0,0),h=M.H6.max(M.f6,g);
  for(const x of [-2,-1,.2,1,2])near(h(x),(M.f6(x)+g(x)+Math.abs(M.f6(x)-g(x)))/2);
  for(const x of [-Math.sqrt(3),0,Math.sqrt(3)])assert.ok(Math.abs(side(h,x,1)-side(h,x,-1))>2);
  array(M.roots6(0,0).map(r=>r.x),[-Math.sqrt(3),0,Math.sqrt(3)]);
});
test('absolute difference is smooth at double/triple roots but not the remaining simple root',()=>{
  const tangent=M.g6(1,0),h=M.H6.abs(M.f6,tangent);
  for(const x of [-2,-.5,1,2])near(M.f6(x)-tangent(x),(x-1)**2*(x+2));
  near(side(h,1,1),0,4e-6);near(side(h,1,-1),0,4e-6);assert.ok(Math.abs(side(h,-2,1)-side(h,-2,-1))>10);
  const triple=M.H6.abs(M.f6,M.g6(0,-3));for(const x of [-2,-.3,0,.3,2])near(triple(x),Math.abs(x)**3);
  near(side(triple,0,-1),0);near(side(triple,0,1),0);
  assert.deepEqual(Array.from(M.roots6(1,0),r=>[r.x,r.mult]),[[-2,1],[1,2]]);
  assert.deepEqual(Array.from(M.roots6(0,-3),r=>[r.x,r.mult]),[[0,3]]);
});

test('original translated pieces: equal derivative values and positive p give p=2',()=>{
  const p=first('glue');assert.equal(p.a,1);assert.equal(p.b,-3);assert.equal(p.c,0);assert.equal(p.d,0);assert.equal(p.ask,'p');
  const result=6/3;near(p.p,result);near(p.ans,result);near(p.fp(0),0);near(p.fp(result),0);
  near(p.fL(0),0);near(p.fR(0),0);near(side(p.fL,0,-1),side(p.fR,0,1),7e-6);
});
test('exploration uses its own scaled cubic: p=1 joins heights but not slopes',()=>{
  const f=M.f7,gR=x=>f(x+1)-f(1);near(f(0),0);near(gR(0),0);
  for(const x of [-1,0,1,2])near(f(x),x**3/3-x*x);
  near(M.fp7(0),0);near(M.fp7(1),-1);near(side(f,0,-1),0,2e-6);near(side(gR,0,1),-1,2e-6);
});
