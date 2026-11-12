// Independent checks for original questions and the authored exploration cases.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/quartic-lesson-runtime.mjs';
const lab=await load(),math=lab.api.math;
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,a+' != '+b);
const original=x=>x**4/4-x**3+2;
const originalPrime=x=>x*x*(x-3);
const first=id=>lab.api.first(id);
function integratePolynomial(coefficients,lo,hi){
  return coefficients.reduce((sum,c,i)=>sum+c/(i+1)*(hi**(i+1)-lo**(i+1)),0);
}
function simpson(f,a,b,n=2000){
  const h=(b-a)/n;let v=f(a)+f(b);
  for(let i=1;i<n;i++)v+=(i%2?4:2)*f(a+i*h);
  return v*h/3;
}
test('all first packets and original target counts are preserved',()=>{
  assert.deepEqual(Object.fromEntries(lab.list.map(sc=>[sc.id,lab.video.lessonList(lab.def.lessons[sc.id]).filter(l=>!l.chapters[0].cues[0].set.lqtConcept).length])),{triple:2,sym:2,area:1,sync:1,fold:2});
  for(const sc of lab.list)assert.equal(first(sc.id).first,true);
  assert.match(lab.api.question('triple'),/삼중근/);assert.match(lab.api.question('sym'),/대칭/);
  assert.match(lab.api.question('area'),/둘러싸인/);assert.match(lab.api.question('sync'),/대소/);
  assert.match(lab.api.question('fold'),/미분가능하지/);
});
test('triple original polynomial and derivative agree independently',()=>{
  const v=first('triple');
  for(const x of [-1,0,.5,1,2,3,4,5]){close(v.f(x),original(x));close(math.evalFp(v.st,x),originalPrime(x));}
  close(v.be,3);close(v.yMin,-19/4);close(v.f(v.q),2);
  assert.ok(originalPrime(-.1)<0&&originalPrime(.1)<0);
  assert.ok(originalPrime(2.9)<0&&originalPrime(3.1)>0);
});
test('triple ratio and height formulas hold with either leading sign',()=>{
  for(const a of [.25,-.25,1/3])for(const alpha of [-1,0,1]){
    const q=alpha+4,beta=(alpha+3*q)/4,c=2;
    const f=x=>a*(x-alpha)**3*(x-q)+c;
    const fp=x=>a*(x-alpha)**2*(4*x-alpha-3*q);
    close(fp(beta),0);close((beta-alpha)/(q-beta),3);
    close(Math.abs(f(beta)-c),27*Math.abs(a));
    const st={a,alpha,spanL:beta-alpha,lambda:0,y0:c};
    close(math.evalF(st,beta),f(beta));close(math.evalF(st,q),c);
  }
});
test('second inflection is x=2 and the ratio refers to horizontal coordinates',()=>{
  const second=x=>3*x*(x-2);
  close(second(0),0);close(second(2),0);
  assert.ok(second(1.9)<0&&second(2.1)>0);close(original(2),-2);
  close((2-0)/(3-2),2);
  const lineAB=2+(-19/4-2)*2/3;assert.notEqual(original(2),lineAB);
});
test('splitting the repeated derivative root removes the triple contact',()=>{
  const s={...first('triple').st,lambda:.25},eps=.001;
  close(math.getRoots(s).gamma,.75);
  assert.ok(math.evalFp(s,-eps)<0&&math.evalFp(s,eps)>0);
  assert.equal(math.isLeft(s),false);assert.equal(math.isRight(s),false);
});
test('symmetric original intersections and height difference are exact',()=>{
  const v=first('sym'),f=x=>((x-1)**2-4)**2/4-2;
  for(const x of [-1,0,1,2,3])close(v.f(x),f(x));
  close(v.f(1),2);close(v.f(-1),-2);close(v.f(3),-2);
  close(v.dy,4);for(const x of [1-2*Math.SQRT2,1+2*Math.SQRT2])close(v.f(x),v.f(1));
});
test('one to root-two needs the symmetric squared factor',()=>{
  for(const [a,h,g,c] of [[.25,2,1,-2],[2,1,0,1],[1/9,3,-1,2]]){
    const s={a,alpha:g-h,spanL:2*h,lambda:.5,y0:c};
    close(math.evalF(s,g)-c,a*h**4);
    for(const x of [g-Math.SQRT2*h,g+Math.SQRT2*h])close(math.evalF(s,x),math.evalF(s,g));
  }
  const asymmetric={...first('sym').st,lambda:.3};
  assert.equal(math.isSym(asymmetric),false);
  assert.ok(Math.abs(math.evalF(asymmetric,-1)-math.evalF(asymmetric,3))>1);
});
test('original double-contact area is independently 128/15',()=>{
  const v=first('area');
  assert.equal(v.kind,'sym');
  const integral=integratePolynomial([9/4,3,-1/2,-1,1/4],-1,3);
  close(integral,128/15);close(math.area3(v),integral);
  close(simpson(x=>v.f(x)+2,-1,3),integral);
});
test('triple-contact area uses 1/20 and double contact uses 1/30',()=>{
  const a=.25,L=4;
  close(integratePolynomial([0,0,0,4*a,-a],0,L),64/5);
  close(integratePolynomial([0,0,a*L*L,-2*a*L,a],0,L),128/15);
  close(a*L**5/20,64/5);close(a*L**5/30,128/15);
});
test('doubling contact separation scales area by 32 in the actual family',()=>{
  const a={...first('area').st,spanL:2},b={...a,spanL:4};
  const sa=simpson(x=>math.evalF(a,x)-a.y0,a.alpha,a.alpha+a.spanL);
  const sb=simpson(x=>math.evalF(b,x)-b.y0,b.alpha,b.alpha+b.spanL);
  close(sa,4/15);close(sb,128/15);close(sb/sa,32);
});
test('source derivative areas reproduce the given comparison independently',()=>{
  const v=first('sync');
  const coefficients=[3/5,-13/5,-11/5,1];
  for(const x of [-1,0,.2,1,2,3]){
    const expected=(x+1)*(x-1/5)*(x-3);close(v.fp(x),expected);
  }
  const s1=integratePolynomial(coefficients,-1,1/5),s2=-integratePolynomial(coefficients,1/5,3);
  close(s1,612/625);close(s2,17836/1875);close(v.s1,s1);close(v.s2,s2);
  assert.ok(s1<s2);assert.ok(v.f(-1)>v.f(3));close(v.f(-1)-v.f(3),128/15);
});
test('net derivative area and symmetric equal minima stay linked',()=>{
  for(const lambda of [.3,.5,.7]){
    const s={...first('sync').st,lambda},r=math.getRoots(s),areas=math.getDerivativeAreas(s);
    close(areas.s1-areas.s2,math.evalF(s,r.beta)-math.evalF(s,r.alpha));
    if(lambda===.5){close(areas.s1,areas.s2);close(math.evalF(s,-1),math.evalF(s,3));}
    else assert.ok(Math.abs(areas.s1-areas.s2)>1);
  }
});
test('three distinct derivative roots have the authored sign changes',()=>{
  const s=first('sync').st,r=math.getRoots(s);
  assert.deepEqual([r.alpha-1,(r.alpha+r.gamma)/2,(r.gamma+r.beta)/2,r.beta+1].map(x=>Math.sign(math.evalFp(s,x))),[-1,1,-1,1]);
});
test('fold crossings distinguish double triple and simple roots at all five heights',()=>{
  const s=first('fold').st;
  for(const [k,roots,cusps] of [[-5,0,0],[-19/4,1,0],[0,2,2],[2,2,1],[3,2,2]]){
    const xs=math.findCrossings(s,k);assert.equal(xs.length,roots,'height '+k);
    xs.forEach(x=>close(original(x),k));
    assert.equal(xs.filter(x=>!math.stationaryCrossing(s,x,k)).length,cusps,'cusps at '+k);
  }
  assert.deepEqual(Array.from(math.findCrossings(s,2)).map(x=>Math.round(x)),[0,4]);
});
test('absolute value slopes are zero at triple contact and opposite at simple root',()=>{
  const h=1e-6,g=x=>Math.abs(original(x)-2);
  close((g(h)-g(0))/h,0,1e-8);close((g(-h)-g(0))/-h,0,1e-8);
  close((g(4+h)-g(4))/h,16,2e-5);close((g(4-h)-g(4))/-h,-16,2e-5);
  close(originalPrime(4),16);
});
test('reflected display is g+k and not the actual g height',()=>{
  close(Math.abs(original(3)-2),27/4);
  close(2+Math.abs(original(3)-2),35/4);
  close(Math.abs(original(0)-2),0);close(2+Math.abs(original(0)-2),2);
});
