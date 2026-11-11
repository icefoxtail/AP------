// Independent calculations of original conditions and the authored exploration cases.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/limits-lesson-runtime.mjs';
const lab=await load(),math=lab.api.math;
const first=id=>lab.api.first(id),plain=v=>JSON.parse(JSON.stringify(v));
const near=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const listNear=(a,b,eps=1e-8)=>{assert.equal(a.length,b.length);a.forEach((x,i)=>near(x,b[i],eps));};
const rational=q=>q.n/q.d;
const cubic=x=>x*x*x-3*x;
const unique=xs=>xs.toSorted((a,b)=>a-b).filter((x,i,a)=>!i||Math.abs(x-a[i-1])>1e-8);
const horizontal=t=>{
  const xs=[];
  if(t<=3){const d=Math.sqrt(3-t);for(const x of [1-d,1+d])if(x<=2+1e-10)xs.push(x);}
  if(t>=-2){const d=Math.sqrt(t+2);for(const x of [3-d,3+d])if(x>2+1e-10)xs.push(x);}
  return unique(xs);
};
const rotating=m=>{
  const xs=[];
  if(m!==0){const x=2/m;if(x<2-1e-10)xs.push(x);}
  if(m!==2){const x=2/(2-m);if(x>=2-1e-10)xs.push(x);}
  return unique(xs);
};
const numericalSlope=(f,x,side,h=1e-6)=>side<0?(f(x)-f(x-h))/h:(f(x+h)-f(x))/h;

test('continuity: independently recover both original unknowns from the three heights',()=>{
  const v=first('continuity'),L=v.left.reduce((y,q)=>y*v.c+rational(q),0);
  const offset=L-(v.m*v.c+v.n),k=L;
  near(L,2);near(offset,0);near(k,2);
  near(rational(v.dh),offset);near(rational(v.Lc),k);
  near(math.fLeft1(1),L);near(math.fRight1(offset)(1),L);
});

test('continuity: a removable hole and unequal one-sided limits are different cases',()=>{
  const left=math.fLeft1(1),right=math.fRight1(0)(1),k=.5;
  near(left,right);assert.notEqual(left,k);
  near(math.fRight1(-1.5)(1),.5);assert.notEqual(left,math.fRight1(-1.5)(1));
  for(const d of [.3,.12,.08]){
    assert.ok(Math.abs(math.fLeft1(1-d)-left)<d*1.1);
    near(math.fRight1(0)(1+d)-right,d);
  }
});

test('zero-zero: original coefficient, cancelled expression and tangent ratio agree',()=>{
  const v=first('zero-zero');
  const a=(-v.m*v.c*v.c-v.d)/v.c,b=(2*v.m*v.c+a)/v.u;
  near(a,2);near(b,4);near(v.a,a);near(rational(v.bq),b);
  near(v.f(v.c),0);near(v.g(v.c),0);
  for(const x of [.9,1.05,1.4,1.8]){
    near(v.f(x),x*x+2*x-3);near(v.g(x),x-1);
    near(v.f(x)/v.g(x),x+3);near(math.fnF2(x)/math.fnG2(x),x+3);
  }
  assert.ok(Number.isNaN(v.f(1)/v.g(1)),'the value 0/0 is not the limit');
  near((v.f(1+1e-5)-v.f(1-1e-5))/(2e-5)/v.u,b,1e-8);
});

test('product: only the zero at the discontinuity makes all three heights equal',()=>{
  const v=first('product'),r=v.p*v.c;
  near(r,1);near(v.r,r);assert.notEqual(v.Lc,v.Rc);
  near(math.hLeft3(r)(1),0);near(math.hRight3(r)(1),0);
  for(const other of [0,.4,.6,2]){
    near(math.hLeft3(other)(1),2*(1-other));near(math.hRight3(other)(1),0);
    assert.notEqual(math.hLeft3(other)(1),math.hRight3(other)(1));
  }
});

test('count: cubic discriminant and distinct repeated roots match the original counts',()=>{
  const v=first('count');
  assert.deepEqual(plain(v.jumps),[-2,2]);assert.deepEqual(plain(v.gv),[2,2]);
  for(const t of [-2.4,-2,-1.8,0,1.2,1.8,2,2.4]){
    const D=27*(4-t*t),expected=D>1e-9?3:D<-1e-9?1:2;
    assert.equal(math.count4(t),expected);
    const xs=unique(Array.from(math.roots4(t)));assert.equal(xs.length,expected);
    xs.forEach(x=>near(cubic(x),t));
  }
  listNear(unique(Array.from(math.roots4(2))),[-1,2]);
  listNear(unique(Array.from(math.roots4(-2))),[-2,1]);
  near(cubic(-1),2);near(cubic(1),-2);
});

test('ivt: opposite first-problem endpoint signs establish an interior root',()=>{
  const v=first('ivt'),evaluate=x=>(x*x*x-3*x-1)/2;
  near(evaluate(v.a),-1.5);near(evaluate(v.bb),.5);
  near(rational(v.fa),evaluate(v.a));near(rational(v.fb),evaluate(v.bb));
  assert.ok(evaluate(v.a)*evaluate(v.bb)<0);
  assert.ok(v.a<v.root&&v.root<v.bb);near(evaluate(v.root),0);
  near(math.fn5(1),-1.5);near(math.fn5(2),.5);
});

test('ivt: same negative endpoint signs still permit two interior roots',()=>{
  near(math.fn5(-1.6),-.148);near(math.fn5(0),-.5);near(math.fn5(-1),.5);
  assert.ok(math.fn5(-1.6)*math.fn5(-1)<0&&math.fn5(-1)*math.fn5(0)<0);
  const inside=Array.from(math.ROOTS5).filter(x=>-1.6<x&&x<0);
  assert.equal(inside.length,2);inside.forEach(x=>near((x*x*x-3*x-1)/2,0));
});

test('count-move: independent quadratic roots enforce the open and closed endpoints',()=>{
  const C=math.EXP6.hor;
  for(const t of [-2.01,-2,-1.99,-1.01,-1,-.99,1.99,2,2.01,2.99,3,3.01]){
    listNear(Array.from(math.cross6(C.pieces,'hor',t)),horizontal(t));
  }
  const expected=[[-2,1,2,3],[-1,3,2,2],[2,2,3,3],[3,3,2,1]];
  assert.deepEqual(plain(C.evs.map(e=>[e.p,e.L,e.M,e.R])),expected);
  assert.ok(horizontal(2).includes(2),'closed endpoint is counted');
  assert.ok(!horizontal(-1).includes(2),'open endpoint is excluded');
});

test('count-move: all four genuine jumps determine the original monic quartic',()=>{
  const v=first('count-move'),zeros=[-2,-1,2,3];
  const H=t=>zeros.reduce((p,z)=>p*(t-z),1);
  assert.equal(v.n,4);assert.equal(v.ask,'prod');assert.equal(v.k,0);
  near(H(0),12);near(v.ans.val,H(v.k));
  for(const z of zeros){
    const e=v.C.evs.find(e=>e.p===z);assert.ok(e);
    assert.ok(e.L!==e.M||e.M!==e.R);near(H(z),0);
    for(const direction of [-1,1])assert.ok(Math.abs(horizontal(z+direction*1e-8).length*H(z+direction*1e-8))<1e-5);
  }
});

test('count-move: independent line intersections confirm parallel and vertex events',()=>{
  const C=math.EXP6.rot;
  for(const m of [-.5,0,.5,.99,1,1.01,1.5,2,2.5])listNear(Array.from(math.cross6(C.pieces,'rot',m)),rotating(m));
  assert.deepEqual(plain(C.evs.map(e=>[e.p,e.L,e.M,e.R])),[[0,1,0,0],[1,0,1,2],[2,2,1,1]]);
  listNear(rotating(1),[2]);
});

test('zero-pole: the first cubic has the required double zero and finite nonzero limit',()=>{
  const v=first('zero-pole'),r=v.p-v.L;
  near(r,-1);assert.deepEqual(plain(v.froots),[1,1,-1]);
  const f=x=>(x-1)*(x-1)*(x+1);
  near(f(v.k),1);near(v.ans.val,f(v.k));
  for(const x of [-1,0,.9,1.1,2])near(math.prodAt(v.froots,x),f(x));
  for(const x of [.9,1.1])near(f(x)/((x-1)*(x-1)),x+1);
  near(math.lim7(v.froots,v.droots,1).val,2);
  near((f(1+1e-4)+f(1-1e-4)-2*f(1))/(2e-8),2,1e-8);
});

test('zero-pole: matching, deficient and excess multiplicities give distinct limits',()=>{
  for(const z of [1,3]){const L=math.lim7([1,3],[1,3],z);assert.equal(L.ok,true);near(L.val,1);}
  assert.equal(math.lim7([1,4.5],[1,3],3).ok,false);
  assert.equal(math.lim7([2,3.5],[2,2],2).ok,false);
  const doubled=math.lim7([2,2],[2,2],2);assert.equal(doubled.ok,true);near(doubled.val,1);
  const excess=math.lim7([1,1],[1,3],1);assert.equal(excess.ok,true);near(excess.val,0);
  assert.equal(math.lim7([1,1],[1,3],3).ok,false);
  for(const x of [.99,1.01])near(math.prodAt([1,1],x)/math.prodAt([1,3],x),(x-1)/(x-3));
});

test('ratio-limit: original lengths, symmetry, perpendicular foot and rationalization agree',()=>{
  const v=first('ratio-limit');near(v.mv,1);near(v.ans.val,2);
  for(const t of [.02,.08,.5,.8,1]){
    const d=Math.sqrt(1+4*t),alpha=(1+d)/2,beta=(1-d)/2,g=math.geo8('len0',1,t);
    listNear(Array.from(g.A),[alpha,alpha*alpha]);listNear(Array.from(g.B),[beta,beta*beta]);
    listNear(Array.from(g.C),[-alpha,alpha*alpha]);listNear(Array.from(g.H),[beta,alpha*alpha]);
    near(alpha*alpha,alpha+t);near(beta*beta,beta+t);
    near(g.AH,alpha-beta);near(g.CH,alpha+beta);near(g.AH-g.CH,-2*beta);
    near(g.ratio,(g.AH-g.CH)/t);near(g.ratio,4/(d+1));near(g.ratio,2/alpha);
  }
  near(math.geo8('len0',1,1e-10).ratio,2,1e-8);near(math.lim8('len0',1),2);
});

test('ratio-limit: determinant area matches the shared-base formula',()=>{
  for(const m of [.5,1,2])for(const t of [.02,.6,1]){
    const g=math.geo8('area0',m,t),area=Math.abs(g.A[0]*g.B[1]-g.A[1]*g.B[0])/2;
    near(g.S,area);near(area,t*Math.sqrt(m*m+4*t)/2);near(g.ratio,area/t);
  }
  near(math.lim8('area0',1),.5);near(math.geo8('area0',1,1e-10).ratio,.5,1e-8);
});

test('ratio-limit: the Euclidean chord length determines the quadratic intercept growth',()=>{
  for(const t of [.8,1.2,2,2.5]){
    const g=math.geo8('inf',1,t);
    near(Math.hypot(g.A[0]-g.B[0],g.A[1]-g.B[1]),2*t);
    near(g.k,t*t/2-1/4);near(g.ratio,.5-1/(4*t*t));
    near(g.A[1],g.A[0]+g.k);near(g.B[1],g.B[0]+g.k);
  }
  near(math.lim8('inf',1),.5);near(math.geo8('inf',1,1e5).ratio,.5,1e-9);
});

test('window-max: the first absolute maximum has exactly the two stated corners',()=>{
  const v=first('window-max'),G=t=>t<-2?-cubic(t):t<=0?2:cubic(t+2);
  for(const t of [-3,-2.1,-2,-1.8,-1.4,-1,-.1,0,.1,1])near(math.win9(v.c,2,t,true).v,G(t));
  assert.deepEqual(plain(v.ks),[-2,0]);near(v.ans.val,-2+0);
  near(numericalSlope(G,-2,-1),-9,1e-4);near(numericalSlope(G,-2,1),0);
  near(numericalSlope(G,0,-1),0);near(numericalSlope(G,0,1),9,1e-4);
  listNear(Array.from(math.kinks9(v.c,2,true,-4,3),k=>k.t),[-2,0],1e-5);
});

test('window-max: an entering stationary point can produce a smooth candidate change',()=>{
  const G=t=>math.win9([0,-3,0,1],2,t,false).v;
  for(const t of [-3.2,-3.1])near(G(t),cubic(t+2));
  for(const t of [-3,-2.9,-2.8])near(G(t),2);
  near(numericalSlope(G,-3,-1),0,1e-4);near(numericalSlope(G,-3,1),0,1e-4);
  const corners=Array.from(math.kinks9([0,-3,0,1],2,false,-4,3),k=>k.t);
  assert.ok(!corners.some(x=>Math.abs(x+3)<1e-5));
});

test('window-max: increasing the width to three shifts only the right corner',()=>{
  const c=[0,-3,0,1],G=t=>t<-2?-cubic(t):t<=-1?2:cubic(t+3);
  for(const t of [-3,-2,-1.8,-1.5,-1,-.5,0])near(math.win9(c,3,t,true).v,G(t));
  listNear(Array.from(math.kinks9(c,3,true,-4,3),k=>k.t),[-2,-1],1e-5);
  near(numericalSlope(G,-2,-1),-9,1e-4);near(numericalSlope(G,-2,1),0);
  near(numericalSlope(G,-1,-1),0);near(numericalSlope(G,-1,1),9,1e-4);
});
