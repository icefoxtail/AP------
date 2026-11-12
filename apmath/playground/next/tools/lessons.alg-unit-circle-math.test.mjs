// Independent geometry/trigonometry against actual original source functions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/unit-circle-lesson-runtime.mjs';
const lab=await load(),math=lab.api.math,PI=Math.PI,TAU=2*PI;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const nearList=(a,b)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));};
const value=fr=>fr.n/fr.d;
const source=id=>lab.api.first(id);
const trig=(fn,x)=>fn==='sin'?Math.sin(x):fn==='cos'?Math.cos(x):Math.tan(x);
const within=(interval,x)=>{
  if(Math.abs(x-interval.u)<1e-9)return interval.left;
  if(Math.abs(x-interval.v)<1e-9)return interval.right;
  return x>interval.u&&x<interval.v;
};
const specialRoots=t=>Array.from({length:24},(_,i)=>i*PI/12).filter(x=>Math.abs(Math.sin(x)-t)<1e-10||Math.abs(Math.cos(x)-t)<1e-10);

test('coords: unit radius, special coordinates, signed quadrants and tangent ratio',()=>{
  const p=math.unitPoint(PI/6);
  near(p.x,Math.sqrt(3)/2);near(p.y,.5);near(p.x*p.x+p.y*p.y,1);
  const q=math.unitPoint(2*PI/3);
  near(q.x,-.5);near(q.y,Math.sqrt(3)/2);assert.ok(q.x<0&&q.y>0&&q.y/q.x<0);
  const sign=math.quadrant(2*PI/3);
  assert.deepEqual([sign.cos,sign.sin,sign.tan],['−','+','−']);
  near(math.value('tan',PI/4),1);
  for(const t of [PI/6,PI/4,2*PI/3,5*PI/4])near(math.value('tan',t),Math.sin(t)/Math.cos(t));
});

test('wave: coordinate periods and tangent singularities are different',()=>{
  for(const t of [.2,.7,2.1]){
    for(const fn of ['sin','cos'])near(math.value(fn,t+TAU),math.value(fn,t));
    near(math.value('tan',t+PI),math.value('tan',t));
  }
  for(const t of [PI/2,3*PI/2])assert.ok(!Number.isFinite(math.value('tan',t)));
  assert.ok(Number.isFinite(math.value('tan',PI/2-1e-5)),'large finite values near an asymptote stay finite');
  nearList([0,PI/2,PI,3*PI/2,TAU].map(t=>math.value('sin',t)),[0,1,0,-1,0]);
  nearList([0,PI/2,PI,3*PI/2,TAU].map(t=>math.value('cos',t)),[1,0,-1,0,1]);
});

for(const [fn,k,expected] of [['sin',.5,[PI/6,5*PI/6]],['cos',.5,[PI/3,5*PI/3]],['tan',1,[PI/4,5*PI/4]]]){
  test(`equation: ${fn} roots respect one half-open turn`,()=>{
    const roots=math.roots(lab.api.initial('equation'),fn,k,0,TAU,false);
    nearList(roots,expected);
    for(const x of roots){assert.ok(x>=0&&x<TAU);near(trig(fn,x),k);}
    if(fn==='cos')nearList(math.roots(lab.api.initial('equation'),'cos',1,0,TAU,false),[0]);
  });
}

test('equation: common solutions require the intersection of both root sets',()=>{
  const s=lab.api.initial('equation'),k=Math.SQRT1_2;
  const sin=math.roots(s,'sin',k,0,TAU,false),cos=math.roots(s,'cos',k,0,TAU,false);
  const both=sin.filter(a=>cos.some(b=>Math.abs(a-b)<1e-9));
  nearList(both,[PI/4]);
  assert.equal(new Set([...sin,...cos].map(x=>x.toFixed(8))).size,3,'union is a different set');
});

for(const [fn,k,op,bounds,closed] of [
  ['sin',.5,'gt',[[PI/6,5*PI/6]],[false,false]],
  ['cos',.5,'le',[[PI/3,5*PI/3]],[true,true]],
  ['tan',1,'gt',[[PI/4,PI/2],[5*PI/4,3*PI/2]],[false,false]]
]){
  test(`inequality: ${fn} interval endpoints and representative values`,()=>{
    const s={...lab.api.initial('inequality'),k,op},intervals=math.intervals(s,fn,0,TAU,false);
    assert.equal(intervals.length,bounds.length);
    intervals.forEach((iv,i)=>{nearList([iv.u,iv.v],bounds[i]);assert.deepEqual([iv.left,iv.right],closed);assert.equal(iv.singleton,false);});
    for(let i=0;i<24;i++){
      const x=i*PI/12,undefinedTan=fn==='tan'&&Math.abs(Math.cos(x))<1e-10;
      const y=trig(fn,x),expected=!undefinedTan&&(op==='gt'?y>k+1e-9:y<=k+1e-9);
      assert.equal(intervals.some(iv=>within(iv,x)),expected,`${fn}, x=${i}π/12`);
    }
  });
}

test('sinus: independent coefficient recovery matches the first source question',()=>{
  const v=source('sinus');
  assert.deepEqual([v.M,v.m,v.ask],[3,-1,'a+b+c']);
  const M=v.M,m=v.m,T=2*PI/3;
  const a=(M-m)/2,c=(M+m)/2,b=TAU/T;
  near(a,2);near(b,3);near(c,1);near(a+b+c,6);near(v.ans,a+b+c);
  near(a*Math.sin(b*PI/6)+c,M);near(a*Math.sin(b*PI/2)+c,m);
});

test('sinus: amplitude, translation, period and restricted extrema agree',()=>{
  for(const a of [1,2])for(const b of [1,2,3])for(const c of [0,1]){
    const f=x=>a*Math.sin(b*x)+c;
    near(f(.37+TAU/b),f(.37));near(f(PI/(2*b))-c,a);near(f(3*PI/(2*b)),c-a);
  }
  // Direct endpoint/turning-point comparison, independent of the source extrema iterator.
  const f=x=>2*Math.sin(2*x)+1;
  for(const [t,candidates] of [[PI/6,[0,PI/6]],[PI/4,[0,PI/4]],[3*PI/4,[0,PI/4,3*PI/4]]]){
    const ys=candidates.map(f),actual=math.extOn(2,2,1,t);
    near(actual.M,Math.max(...ys));near(actual.m,Math.min(...ys));
  }
  const E=math.extOn(2,2,1,3*PI/4);near(E.M,3);near(E.m,-1);
});

test('conv: original quadrant fixes the missing coordinate and transformed sum',()=>{
  const v=source('conv');
  assert.equal(v.quad,2);assert.equal(v.given,'sin');near(value(v.P.y),3/5);
  const sin=3/5,cos=-Math.sqrt(1-sin*sin),theta=Math.atan2(sin,cos);
  near(cos,-4/5);near(value(v.P.x),cos);
  const first=Math.cos(PI-theta),second=Math.tan(PI+theta);
  near(first,4/5);near(second,-3/4);near(first+second,1/20);
  near(value(v.ans),first+second);
});

test('conv: all five source transformations match the angle geometry',()=>{
  for(const mode of ['neg','pi-','pi+','h-','h+'])for(const theta of [PI/6,PI/3,2*PI/3,7*PI/6]){
    const md=math.transforms[mode],q=md.q(Math.cos(theta),Math.sin(theta)),phi=md.phi(theta);
    nearList(q,[Math.cos(phi),Math.sin(phi)]);near(q[0]*q[0]+q[1]*q[1],1);
    if(mode==='neg')nearList(q,[Math.cos(theta),-Math.sin(theta)]);
    if(mode==='pi-')nearList(q,[-Math.cos(theta),Math.sin(theta)]);
    if(mode==='pi+')nearList(q,[-Math.cos(theta),-Math.sin(theta)]);
    if(mode==='h-')nearList(q,[Math.sin(theta),Math.cos(theta)]);
    if(mode==='h+')nearList(q,[-Math.sin(theta),Math.cos(theta)]);
  }
});

test('twocurve: the earliest nonnegative intersections form the original trapezoid',()=>{
  const v=source('twocurve');assert.equal(v.m,2);assert.equal(v.h,1);assert.equal(v.kind,'area');
  const first=(fn,k)=>{
    const a=fn==='sin'?Math.asin(k):Math.acos(k);
    const angles=(fn==='sin'?[a,PI-a]:[a,-a]).map(t=>(t+TAU)%TAU);
    return Math.min(...angles)*6/PI;
  };
  const pts=[[first('sin',.5),1],[first('cos',.5),1],[first('sin',-.5),-1],[first('cos',-.5),-1]];
  pts.forEach((p,i)=>nearList(p,v.pts['ABCD'[i]]));
  let cross=0;pts.forEach((p,i)=>{const q=pts[(i+1)%4];cross+=p[0]*q[1]-p[1]*q[0];});
  near(Math.abs(cross)/2,4);near(v.ans,Math.abs(cross)/2);
});

test('twocurve: the upper midpoint and lower separation survive height changes',()=>{
  for(const k of [.3,.5,.7,Math.SQRT1_2]){
    const pts=math.twoPts(k),a=Math.asin(k);
    nearList(pts.A,[a,k]);nearList(pts.B,[PI/2-a,k]);
    nearList(pts.C,[PI+a,-k]);nearList(pts.D,[PI/2+a,-k]);
    near((pts.A[0]+pts.B[0])/2,PI/4);near(pts.C[0]-pts.D[0],PI/2);
    if(k===Math.SQRT1_2)near(pts.A[0],pts.B[0]);
  }
});

test('rootsum: direct special-angle enumeration counts unions and open endpoints',()=>{
  for(const t of [.5,-.5,0,Math.SQRT1_2,-Math.SQRT1_2,1,-1,1.1]){
    const expected=specialRoots(t),actual=math.allRoots(t);
    nearList(actual.dist,expected);near(actual.sum,expected.reduce((a,b)=>a+b,0));
    assert.ok(actual.dist.every(x=>x>=0&&x<TAU));
  }
  assert.equal(math.allRoots(Math.SQRT1_2).dist.length,3);
  assert.equal(math.allRoots(1).dist.length,2);
  near(math.allRoots(.5).sum,3*PI);near(math.allRoots(-.5).sum,5*PI);
});

test('rootsum: exactly three roots require the two crossing heights and give p+q',()=>{
  const v=source('rootsum');assert.equal(v.type,'B');assert.equal(v.agg,'max');
  const overlapAngles=[PI/4,5*PI/4];
  const sums=overlapAngles.map(x=>{
    near(Math.sin(x),Math.cos(x));
    const roots=specialRoots(Math.sin(x));assert.equal(roots.length,3);
    return roots.reduce((a,b)=>a+b,0);
  });
  nearList(sums,[11*PI/4,15*PI/4]);near(Math.max(...sums)/PI,15/4);
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  assert.equal(gcd(15,4),1);assert.equal(v.ans,15+4);
});
