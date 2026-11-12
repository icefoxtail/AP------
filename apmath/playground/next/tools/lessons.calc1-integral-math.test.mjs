// Independent calculus, area and symmetry checks against production source data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/integral-lesson-runtime.mjs';
const lab = await load(), S = lab.api;
const near = (a,b,eps=1e-8) => assert.ok(Math.abs(a-b)<=eps*Math.max(1,Math.abs(a),Math.abs(b)), `${a} != ${b}`);
const D = (f,x) => (f(x+1e-5)-f(x-1e-5))/2e-5;
function integral(f,a,b,n=400) { const h=(b-a)/n; let y=f(a)+f(b); for(let k=1;k<n;k++)y+=(k%2?4:2)*f(a+k*h);return y*h/3; }
const xs=[-2,-1,0,.5,1,1.5,2,3,4];

test('signed: actual primitive has cubic and square terms and differentiates to the source function', () => {
  const p=S.first('signed'), P=S.native.primitive(p.co);
  assert.equal(P.length,4); assert.deepEqual(Array.from(P,q=>q.v),[1/3,-1,0,0]);
  assert.equal(S.native.poly(P), '\\dfrac{1}{3}x^3-x^2');
  for(const x of xs) { near(D(S.P1,x),S.F1(x),1e-7);near(S.native.eval(P,x),x**3/3-x*x); }
  lab.go('signed');lab.tab='review';
  const steps=lab.scene.steps(lab.s,lab).join('\n');
  assert.ok(steps.includes('F(x)=\\dfrac{1}{3}x^3-x^2'));
  assert.ok(!steps.includes('F(x)=\\dfrac{1}{3}x^2-x$'));
  near(integral(p.f,0,3),0);near(-integral(p.f,0,2),4/3);near(integral(p.f,2,3),4/3);
  near(p.S.v,8/3);near(integral(p.f,2,0),4/3);
  const forward=S.polynomialStats(S.P1,[0,2],0,2),reverse=S.polynomialStats(S.P1,[0,2],2,0);
  near(forward.signed,-reverse.signed);near(forward.totalArea,reverse.totalArea);
});

test('sixth: total area, half-area equation and cubic scaling use the actual parabola', () => {
  const p=S.first('sixth');near(integral(p.f,0,3),9/2);near(p.S0.v,9/2);
  near(integral(x=>p.f(x)-p.m*x,0,3-p.m),9/4);near((3-p.m)**3,27/2);near(p.cube.v,27/2);
  for(const L of [.5,1.5,3])near(integral(x=>x*(L-x),0,L),L**3/6);
  near(integral(x=>x*(1.5-x),0,1.5)/integral(x=>x*(3-x),0,3),1/8);
});

test('cubic: the equality condition is necessary as well as sufficient and a lobe area is two', () => {
  const p=S.first('cubic');
  for(const beta of [-.5,0,.5,1,1.5,2,2.5]) {
    near(integral(S.F3(beta),-1,3),16/3*(beta-1));
    for(const x of xs)near(D(S.P3(beta),x),S.F3(beta)(x),1e-7);
  }
  near(p.be,1);near(integral(p.f,-1,1),2);near(-integral(p.f,1,3),2);near(p.S.v,2);
  for(const u of [.2,.8,1.5,2])near(p.f(1+u),-p.f(1-u));
});

test('difference: native functions, tangency, area and the extra interior sign changes agree', () => {
  const p=S.first('diff');
  for(const x of xs)near(p.F(x)-p.G(x),x*x*(x-1)/2);
  near(p.F(0),p.G(0));near(D(p.F,0),D(p.G,0));near(p.F(1),p.G(1));
  near(integral(x=>p.G(x)-p.F(x),0,1),1/24);near(p.S.v,1/24);
  const m=-11/20,h=x=>S.F4(x)-S.G4(m)(x),r1=(1-Math.sqrt(3/5))/2,r2=(1+Math.sqrt(3/5))/2;
  for(const x of [0,r1,r2])near(h(x),0);
  assert.deepEqual([r1/2,(r1+r2)/2,(r2+1)/2].map(x=>Math.sign(h(x))),[1,-1,1]);
  const area=integral(h,0,r1)-integral(h,r1,r2)+integral(h,r2,1);
  near(S.diffStats(m).totalArea,area);assert.ok(area>Math.abs(integral(h,0,1)));
});

test('inverse: increasing source curve and the two areas make the rectangle difference', () => {
  const p=S.first('inverse');
  for(const x of xs) { near(p.f(x),x**3/4+x/2);assert.ok(3*x*x/4+.5>0); }
  near(p.fa.v,3/4);near(p.fb.v,3);near(p.ans.v,21/4);
  // Integrating x f'(x) gives the horizontal-slice inverse area without solving a cubic.
  for(const [a,b] of [[1,2],[1,1.5],[.5,1.5]]) {
    const direct=integral(S.F5,a,b),inverse=integral(x=>x*(3*x*x/4+.5),a,b);
    near(direct+inverse,b*S.F5(b)-a*S.F5(a));
  }
});

test('area A/B: first source slope and the moving wall have independently checked signed integrals', () => {
  const p=S.first('areaab');near(p.m,-.5);near(integral(S.f6(p),0,p.w),3);
  near(integral(x=>S.f6(p)(x)-S.l6(p,p.m)(x),0,p.w),0);
  const ar=S.areas6(p,p.m,p.w);near(ar.A,ar.B);assert.ok(ar.al>0&&ar.al<p.w);
  near(S.f6(p)(ar.al),S.l6(p,p.m)(ar.al));
  for(const t of [.3,1,2,3,3.4]) {
    const h=x=>S.f6(S.V6)(x)-S.l6(S.V6,-.5)(x);
    near(S.G6(S.V6,-.5,t),integral(h,0,t));near(D(x=>S.G6(S.V6,-.5,x),t),h(t),1e-7);
  }
  near(S.G6(S.V6,-.5,3),0);
  assert.match(lab.def.lessons.areaab[0].answer,/m=-\\frac12/);
});

test('symmetry: all three existing question types and exploration transformations preserve their stated integral', () => {
  const a=S.first('symint',0).v,b=S.first('symint',1).v,c=S.first('symint',2).v;
  for(const x of xs) { near(a.E(x),a.E(-x));near(a.O(x),-a.O(-x));near(a.f(x),a.E(x)+a.O(x)); }
  near(integral(a.f,-2,2),8);near(a.ans,8);
  for(const u of [.1,.7,1.3,2])near(b.f(1+u)+b.f(1-u),8);
  near(integral(b.f,-1,3),16);near(b.ans,16);
  let whole=0;for(let x=-3;x<2;x++)whole+=integral(c.g,x,x+1);
  near(whole,10);near(c.ans,10);
  for(const q of [-1,1.5,3])for(const h of [.5,1.8,2])near(integral(x=>(x-1)**3-3*(x-1)+q,1-h,1+h),2*h*q);
  for(const start of [-1.5,0,.5,1,2.5])near(S.primitivePeriod(2,start+2)-S.primitivePeriod(2,start),8/3);
});

test('Riemann: representative widths, offset interval, exact sums and convergence brackets are checked', () => {
  const p=S.first('riemann',0),shift=S.first('riemann',2);
  near(integral(p.f,0,2),3);near(p.ans,3/2);
  near(integral(shift.f,1,3),13/3);near(shift.ans,13/3);
  for(const n of [1,6,24,30,60]) {
    const {dx,up,lo}=S.sums8(n),upper=16/n**3*n*(n+1)*(2*n+1)/6,lower=16/n**3*(n-1)*n*(2*n-1)/6;
    near(dx,4/n);near(up,upper);near(lo,lower);near(up-lo,16/n);
    assert.ok(lo<=16/3 && up>=16/3);
  }
  const finite=n=>Array.from({length:n},(_,i)=>p.f(2*(i+1)/n)/n).reduce((a,b)=>a+b,0);
  assert.ok(Math.abs(finite(500)-1.5)<Math.abs(finite(20)-1.5));
});
