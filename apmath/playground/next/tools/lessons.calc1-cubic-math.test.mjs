// Independent derivatives, polynomial factors, integration and contact counts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/cubic-lesson-runtime.mjs';
const lab=await load(),v=id=>lab.api.first(id),M=lab.api.math;
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const has=(id,label,text)=>assert.ok(lab.def.lessons[id].find(l=>l.label===label).answer.includes(text),id+'/'+label);
const f=x=>x*x*x-3*x*x+2,fp=x=>3*x*x-6*x;
const integral=(g,a,b)=>{const n=1200,h=(b-a)/n;let s=g(a)+g(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*g(a+i*h);return s*h/3;};
const bisect=(g,a,b)=>{assert.ok(g(a)*g(b)<0);for(let i=0;i<80;i++){const m=(a+b)/2;if(g(a)*g(m)<=0)b=m;else a=m;}return(a+b)/2;};

test('box: exact source coefficients give both horizontal tangent reintersections and all roots',()=>{
 const q=v('box');assert.deepEqual([q.F.a,q.F.m,q.F.d,q.F.ym],[1,1,1,0]);
 for(const x of [-2,-1,0,1,2,3,4])near(q.f(x),f(x));
 for(const x of [-1,.5,3]){near(fp(x),(f(x+1e-5)-f(x-1e-5))/2e-5,1e-7);}
 near(fp(0),0);near(fp(2),0);assert.ok(fp(-1)>0&&fp(1)<0&&fp(3)>0);
 near(f(3),f(0));near(f(-1),f(2));near(q.xC,3);near(q.xD,-1);
 for(const x of [1-Math.sqrt(3),1,1+Math.sqrt(3)])near(f(x),0);
 has('box','교점C','x_C=3');has('box','교점D','x_D=-1');has('box','세실근','1,1-\\sqrt3,1+\\sqrt3');
});
test('box: translation proves center symmetry and four consecutive equal gaps',()=>{
 for(const u of [-3,-1,-.25,.5,2.5]){near(f(1+u),u**3-3*u);near((f(1-u)+f(1+u))/2,0);}
 const xs=[-1,0,1,2,3];for(let i=1;i<xs.length;i++)near(xs[i]-xs[i-1],1);
 has('box','점대칭','I(1,0)');has('box','같은간격','모두 $h$');
});
test('box: the zero derivative is not an extremum when the sign does not change',()=>{
 for(const delta of [1,0,-.5]){
  const s={a:1,m:1,ym:0,delta},d=x=>3*((x-1)**2-delta);
  for(const x of [-1,.2,1,1.8,3])near(M.evalFp(s,x),d(x));
  if(delta>0){near(d(0),0);near(d(2),0);assert.ok(d(-.1)>0&&d(.1)<0&&d(2.1)>0);}else{for(const x of [-3,.5,1,2,5])assert.ok(d(x)>=0);if(delta===0)near(d(1),0);else assert.ok(d(1)>0);}
 }
 has('box','극점조건','\\delta\\gt0');
});
test('oblique: independent tangent equation verifies slope, repeated root and other intersection',()=>{
 const q=v('oblique');assert.deepEqual([q.F.a,q.F.m,q.F.d,q.F.ym,q.t],[1,1,2,0,0]);
 const g=x=>x**3-3*x*x-3*x+5,l=x=>-3*x+5;
 for(const x of [-1,0,.5,2,3,4]){near(q.f(x),g(x));near(g(x)-l(x),x*x*(x-3));}
 near(q.slope,-3);near(q.q,3);near(q.yQ,-4);near(g(3),l(3));
 has('oblique','재교점q','q=3');has('oblique','접선기울기','$-3$');
});
test('oblique: tangent factorization and distance relation hold with either orientation',()=>{
 for(const a of [-1,.5,2])for(const delta of [-.5,0,2])for(const t of [-1,.5,2,3]){
  const s={a,m:1,ym:2,delta},q=3*s.m-2*t,g=x=>a*((x-1)**3-3*delta*(x-1))+2,sl=3*a*((t-1)**2-delta),l=x=>g(t)+sl*(x-t);
  for(const x of [-2,0,1,3,4])near(g(x)-l(x),a*(x-t)**2*(x-q));
  near(2*t+q,3);near(Math.abs(q-1),2*Math.abs(t-1));assert.ok((q-1)*(t-1)<0);
 }
 has('oblique','중근관계','2t+q=3m');has('oblique','가로거리','=1:2');
});
test('oblique: the inflection tangent has a triple contact and no separate root',()=>{
 const s={a:1,m:1,ym:0,delta:2};
 for(const x of [-2,-1,0,1,2,3])near(M.evalF(s,x)-M.evalInflectionTangent(s,x),(x-1)**3);
 assert.deepEqual(Array.from(M.solveCubicRealRoots(1,-3,3,-1)),[1]);has('oblique','변곡접선','별도 재교점이 없음');
});
test('area: independent quadrature confirms both original areas and the curve ordering',()=>{
 const q=v('area');assert.deepEqual([q.a,q.d,q.m,q.t],[1,1,1,0]);
 for(let i=0;i<=30;i++)assert.ok(f(i/10)<=2+1e-12);
 near(integral(x=>2-f(x),0,3),27/4);near(q.S,27/4);
 const left=integral(f,1-Math.sqrt(3),1),right=integral(x=>-f(x),1,1+Math.sqrt(3));near(left,9/4);near(right,9/4);near(left+right,9/2);near(q.W,9/4);
 has('area','접선넓이','27');has('area','두넓이합','\\dfrac92');
});
test('area: general tangent-area identity is independent of contact orientation and coefficient sign',()=>{
 for(const a of [-2,.5,1])for(const t of [-1,0,2,3]){
  const m=1,delta=1,g=x=>a*((x-m)**3-3*delta*(x-m)),q=3*m-2*t,slope=3*a*((t-m)**2-delta),l=x=>g(t)+slope*(x-t),L=Math.abs(q-t);
  const S=integral(x=>Math.abs(g(x)-l(x)),Math.min(t,q),Math.max(t,q));near(S,Math.abs(a)*L**4/12,1e-7);
 }
 has('area','넓이공식','|a|');
});
test('area: central wings have equal positive area but opposite signed integrals',()=>{
 for(const a of [-1,1])for(const delta of [.5,1,2]){const d=Math.sqrt(3*delta),g=u=>a*(u**3-3*delta*u),left=integral(g,-d,0),right=integral(g,0,d);near(left,-right);near(Math.abs(left),Math.abs(a)*d**4/4);}
 near(integral(f,1-Math.sqrt(3),1+Math.sqrt(3)),0);has('area','넓이대칭','S_1=S_2');has('area','부호와넓이','$0$');
});
test('sync: source derivative area equals the independent extreme-value difference',()=>{
 const q=v('sync');assert.deepEqual([q.a,q.h,q.m,q.ym],[1,1,1,0]);near(q.fp(1),-3);near(q.f(0),2);near(q.f(2),-2);
 near(integral(x=>-fp(x),0,2),4);near(f(0)-f(2),4);near(q.dy,4);has('sync','넓이높이차','=4');
 for(const a of [-2,.5,1])for(const h of [.5,1,2]){const L=2*h,d=x=>3*a*(x*x-h*h);near(integral(x=>Math.abs(d(x)),-h,h),Math.abs(a)*L**3/2);}
 has('sync','높이공식','(\\beta-\\alpha)^3');has('sync','증감부호','증가');has('sync','기울기대응',"f'(t)");
});
test('external: the original contact equation has exactly one real root',()=>{
 const q=v('external');assert.deepEqual([q.a,q.d,q.m,q.px,q.py],[1,1,1,2,2]);
 const G=t=>f(t)+fp(t)*(2-t)-2;for(const t of [-2,0,.5,1,2,4])near(G(t),-t*(2*t*t-9*t+12));
 assert.ok(81-4*2*12<0);near(G(0),0);const contacts=M.getTangentContactsFromPoint({a:1,m:1,ym:0,delta:1},2,2);assert.equal(contacts.length,1);near(contacts[0],0);assert.equal(q.n,1);
 has('external','접선개수','$1$');has('external','접점조건',"f'(t)");
});
test('external: independent brackets find three distinct contacts between the boundaries',()=>{
 const G=t=>f(t)+fp(t)*(2-t)+2.5;near(G(1),-.5);near(G(2),.5);
 const roots=[bisect(G,-10,1),bisect(G,1,2),bisect(G,2,10)],actual=M.getTangentContactsFromPoint({a:1,m:1,ym:0,delta:1},2,-2.5);
 assert.equal(actual.length,3);actual.forEach((x,i)=>near(x,roots[i]));for(const t of roots)near(f(t)+fp(t)*(2-t),-2.5);
 assert.equal(new Set(roots.map(t=>fp(t).toFixed(7))).size,3);has('external','경계사이','$3$');
});
test('external: a boundary double root and the center triple root are counted once',()=>{
 const s={a:1,m:1,ym:0,delta:1};const G=t=>f(t)+fp(t)*(2-t)+3;
 for(const t of [-1,0,1,2,3])near(G(t),-((t-1)**2)*(2*t-5));
 const two=M.getTangentContactsFromPoint(s,2,-3);assert.equal(two.length,2);near(two[0],1);near(two[1],2.5);
 const one=M.getTangentContactsFromPoint(s,1,0);assert.equal(one.length,1);near(one[0],1);
 for(const t of [-1,0,1,2,3])near(f(t)+fp(t)*(1-t),-2*(t-1)**3);
 has('external','경계위','$2$');has('external','중심예외','$1$');
});
