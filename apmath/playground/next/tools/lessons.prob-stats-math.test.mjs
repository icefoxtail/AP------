// Independent arithmetic from the actual seeded original packets and models.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/stats-lesson-runtime.mjs';
const lab=await load({forbidUnseeded:true}),api=lab.api,M=api.math,plain=x=>JSON.parse(JSON.stringify(x));
const near=(a,b,msg,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,msg||a+' ≈ '+b);
const sum=a=>a.reduce((s,x)=>s+x,0),value=f=>f.n/f.d;
const table={.5:.191,1:.341,1.5:.433,2:.477,2.5:.494,3:.499};
const area=z=>Math.sign(z)*(table[Math.abs(z)]||0);
const density=(x,m,s)=>Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
const coin=(m,k)=>Array.from({length:2**m},(_,i)=>i.toString(2).replaceAll('0','').length===k?1:0).reduce((s,x)=>s+x,0)/2**m;
const trapezoid=(L,x1,x2,h,u,v)=>{
 const f=x=>x<=x1?h*x/x1:x<=x2?h:h*(L-x)/(L-x2);
 const breaks=[u,...[x1,x2].filter(x=>x>u&&x<v),v];
 return breaks.slice(1).reduce((s,x,i)=>s+(x-breaks[i])*(f(x)+f(breaks[i]))/2,0);
};
const expected={dist:{scale:19,aff:28},binom:{le:841,ge:841,btw:993},std:{'A-left':158,'A-cross':976,'A-right':22,B:624},sym:{T1:30,T2:136},pdf:{pdf:169},mean:{O1:4,'O2-ge':999,'O2-le':933,'O2-btw':840},ci:{P1:8.5,P2:4}};

for(const [id,kinds] of Object.entries(expected))for(const [kind,answer] of Object.entries(kinds))test(id+'/'+kind+': original source conditions independently yield '+answer,()=>{
 const q=api.packet(id,kind);near(q.ans,answer);
 if(id==='dist'){
  const p=q.w.map(w=>w/q.T),mean=sum(p.map((p,i)=>p*(i+1))),variance=sum(p.map((p,i)=>p*(i+1-mean)**2));
  near(sum(p),1);near(p[4],1-sum(p.slice(0,4)));near(mean,q.S1/q.T);
  near(sum(p.map((p,i)=>p*(i+1)**2)),q.S2/q.T);
  near(kind==='scale'?variance/p[4]**2:q.c*q.c*variance,answer);
 }else if(id==='binom'){
  const p=q.t/6*coin(q.m1,q.k1)+(6-q.t)/6*coin(q.m2,q.k2);
  near(p,q.pa/q.pb);near(q.N*p,q.mu);near(q.N*p*(1-p),q.sig**2);
  const lo=q.form==='ge'||q.form==='btw'?q.mu-q.z1*q.sig:-Infinity;
  const hi=q.form==='le'?q.mu+q.z1*q.sig:q.form==='btw'?q.mu+q.z2*q.sig:Infinity;
  if(Number.isFinite(lo))near((lo-q.mu)/q.sig,-q.z1);
  if(Number.isFinite(hi))near((hi-q.mu)/q.sig,q.form==='le'?q.z1:q.z2);
  near((q.form==='btw'?area(q.z1)+area(q.z2):.5+area(q.z1))*1000,answer);
 }else if(id==='std'){
  if(kind==='B'){
   const sigma=(q.c1-q.c2)/(q.z1+q.z2),mean=q.c1-q.z1*sigma;
   near(sigma,q.sig);near(mean,q.m);near((q.d1-mean)/sigma,-q.za);near((q.d2-mean)/sigma,q.zb);
   near((area(q.za)+area(q.zb))*1000,answer);
  }else{
   near((q.a-q.m)/q.sig,q.z1);near((q.b-q.m)/q.sig,q.z2);
   near((area(q.z2)-area(q.z1))*1000,answer);
   assert.ok(q.a<q.b);if(kind==='A-left')assert.ok(q.b<q.m);if(kind==='A-cross')assert.ok(q.a<q.m&&q.b>q.m);if(kind==='A-right')assert.ok(q.a>q.m);
  }
 }else if(id==='sym'){
  if(kind==='T1'){
   const m=q.S/2,sigma=q.d/q.z;near(m,q.m1);near(sigma,q.sig);
   near(q.b,m);near(q.a,m-q.d/2);near(2*m-(q.b+q.d),m-q.d);near(2*m-(q.a+q.d),q.a);
   near(area(q.d/sigma),q.T);near(m+sigma,answer);
   for(const x of [m-q.d,m,m+q.d]){near(density(x,m,sigma),density(q.S-x,m,sigma));near(density(x,m-q.d,sigma),density(x+q.d,m,sigma));}
  }else{
   const intersection=(q.m1+q.m2)/2;near(intersection,q.a);
   near(density(intersection,q.m1,q.sig),density(intersection,q.m2,q.sig));
   near((q.m1-q.m2)/q.sig,-2*q.z0);near((q.a-q.m2)/q.sig,-q.z0);
   near((area(2*q.z0)-area(q.z0))*1000,answer);
  }
 }else if(id==='pdf'){
  const h=value(q.h),k=value(q.k);
  near(trapezoid(q.L,q.x1,q.x2,h,0,q.L),1);near(q.L*k-1,1);assert.ok(k>=h);
  const fpart=trapezoid(q.L,q.x1,q.x2,h,q.u,q.v),prob=k*(q.v-q.u)-fpart;
  near(fpart,101/108);near(prob,61/108);near(prob,q.q/q.p);near(value(q.pk),prob);near(q.p+q.q,answer);
 }else if(id==='mean'){
  if(kind==='O1'){
   const m=sum(q.cards)/q.cards.length,v=sum(q.cards.map(x=>(x-m)**2))/q.cards.length;
   near(m,q.mean);near(v,q.var);near(q.a*q.a*v/q.n,q.target);near(Math.sqrt(q.target*q.n/v),answer);assert.ok(q.a>0);
   // Enumerate all 5^4 independent ordered draws, rather than reuse convolution.
   let means=[0];for(let i=0;i<q.n;i++)means=means.flatMap(total=>q.cards.map(x=>total+x));
   means=means.map(x=>x/q.n);near(sum(means)/means.length,m);near(sum(means.map(x=>(x-m)**2))/means.length,v/q.n);
   const pmf=M.cardMeanDistribution(q.cards,q.n);near(sum(pmf.map(p=>p.p)),1);
   for(const p of pmf)near(p.p,means.filter(x=>Math.abs(x-p.x)<1e-12).length/means.length);
  }else{
   const se=q.sig/Math.sqrt(q.n);near(se,q.r);
   const prob=q.form==='btw'?area(q.z1)+area(q.z2):.5+area(q.z1);
   near(prob*1000,answer);near((q.m-q.z1*q.r-q.m)/se,-q.z1);
   if(q.form==='btw')near((q.m+q.z2*q.r-q.m)/se,q.z2);
  }
 }else if(id==='ci'){
  if(kind==='P1'){
   const half=q.z*q.sig/Math.sqrt(q.n);near(q.hi-q.lo,2*half);near(q.lo+2*half,answer);near(q.w,2*half);
  }else{
   const bound=(2*q.z*q.sig/q.len)**2,min=Math.ceil(bound-1e-10);
   near(min,answer);assert.ok(2*q.z*q.sig/Math.sqrt(min)<=q.len+1e-10);
   assert.ok(2*q.z*q.sig/Math.sqrt(min-1)>q.len);
  }
 }
});

test('dist: all original probability presets, affine shifts and zero scaling preserve probability mass',()=>{
 for(const p of Object.values(M.KSHAPES)){
  near(sum(p),1);assert.ok(p.every(x=>x>=0));const mean=sum(p.map((p,i)=>p*(i+1))),v=sum(p.map((p,i)=>p*(i+1-mean)**2));
  for(const [a,b] of [[1,3],[2,0],[-1,6],[0,2]]){
   const y=p.map((p,i)=>({p,y:a*(i+1)+b})),ey=sum(y.map(z=>z.p*z.y)),vy=sum(y.map(z=>z.p*(z.y-ey)**2));
   near(ey,a*mean+b);near(vy,a*a*v);
  }
 }
 near(sum(M.KSHAPES.mid.map((p,i)=>p*(i-2)**2)),.8);
 near(sum(M.KSHAPES.ends.map((p,i)=>p*(i-2)**2)),3.4);
 const s=api.initial('dist');M.setKP(s,0,.8);near(sum(s.kp),1);near(s.kp[0],.8);assert.ok(s.kp.every(p=>p>=0));
});
test('binom: actual discrete masses and continuity-correction interval have the stated meaning',()=>{
 for(const [n,p] of [[4,.5],[20,.5],[100,.5],[20,.1],[150,.1]]){
  const mass=Array.from({length:n+1},(_,k)=>M.PS.binomPmf(n,p,k));
  near(sum(mass),1,undefined,1e-10);near(sum(mass.map((v,k)=>v*k)),n*p,undefined,1e-8);
  near(sum(mass.map((v,k)=>v*(k-n*p)**2)),n*p*(1-p),undefined,1e-8);
 }
 const info=M.lInfo({...api.initial('binom'),ln:40,lp:.5,lz1:-1,lz2:1});
 near(info.a,17);near(info.b,23);near(info.a-.5,16.5);near(info.b+.5,23.5);
 // Seven unit-width bars occupy exactly [16.5,23.5].
 near((info.b+.5)-(info.a-.5),7);
});
test('std: change of variables preserves normal areas and the provided rounded table',()=>{
 for(const [m,s] of [[5,2],[8,2],[5,4]]){
  for(const z of [-2,-1,0,1,2])near(density(m+s*z,m,s)*s,density(z,0,1));
  near(M.normPdf(m,s)(3),density(3,m,s));
 }
 for(const [z,t] of Object.entries(table)){
  const end=+z,N=2000,h=end/N;
  let integral=density(0,0,1)+density(end,0,1);
  for(let i=1;i<N;i++)integral+=(i%2?4:2)*density(h*i,0,1);
  near(t,Math.round(integral*h/3*1000)/1000);
 }
});
test('sym: native intersections satisfy equal heights for equal and unequal standard deviations',()=>{
 for(const [m1,s1,m2,s2,n] of [[14,4,26,4,1],[16,3,20,6,2],[20,3,20,6,2]]){
  const roots=M.intersections(m1,s1,m2,s2);assert.equal(roots.length,n);
  roots.forEach(x=>near(density(x,m1,s1),density(x,m2,s2)));
  if(s1===s2)near(roots[0],(m1+m2)/2);
  if(m1===m2)near(roots[0]+roots[1],2*m1);
 }
 assert.equal(M.intersections(20,3,20,3).length,0,'identical curves are not a finite intersection set');
});
test('pdf: nonnegativity and total area are independent requirements for the original candidates',()=>{
 const [L,x1,x2]=[6,3,5];
 near(trapezoid(L,x1,x2,.2,0,L),.8);
 near(trapezoid(L,x1,x2,.25,0,L),1);
 for(const k of [1/3,.4,.2]){
  const integralG=6*k-1,minimumG=k-.25;
  if(k===1/3){near(integralG,1);assert.ok(minimumG>0);}
  if(k===.4){near(integralG,1.4);assert.ok(minimumG>0);}
  if(k===.2){near(integralG,.2);assert.ok(minimumG<0);}
 }
 near(M.fInt(2,5,6,3,5,.25),trapezoid(6,3,5,.25,2,5));
});
test('mean: original populations and n=4,16,64 have the stated theoretical moments',()=>{
 for(const [key,mean,variance] of [['uni',5,8],['bi',5,16],['skew',3.2,5.56]]){
  const p=M.OPOP[key].p,m=sum(p.map((p,i)=>p*M.OVALS[i])),v=sum(p.map((p,i)=>p*(M.OVALS[i]-m)**2));
  near(m,mean);near(v,variance);near(M.popStat(p).sd,Math.sqrt(v));
  for(const n of [4,16,64])near(Math.sqrt(v/n),Math.sqrt(v)/Math.sqrt(n));
  near(Math.sqrt(v/16)/Math.sqrt(v/4),.5);near(Math.sqrt(v/64)/Math.sqrt(v/16),.5);
 }
});
test('ci: sample-size and confidence changes affect width without changing the fixed population mean',()=>{
 const width=(n,z)=>2*z*10/Math.sqrt(n);
 near(width(4,1.96),19.6);near(width(16,1.96),9.8);near(width(64,1.96),4.9);
 assert.ok(width(25,1.645)<width(25,1.96));assert.ok(width(25,1.96)<width(25,2.58));
 near(M.PM,50);near(M.PSIG,10);
});

function independentStream(seed){
 let s=BigInt(seed>>>0);
 return ()=>{s=(1664525n*s+1013904223n)%4294967296n;return (Number(s)+.5)/4294967296;};
}
test('seeded categorical sampling matches the original population and preserves split-batch continuation',()=>{
 for(const pop of ['uni','bi','skew']){
  const s={...api.initial('mean'),opop:pop,on:4},expected=[],u=independentStream(s.oseed),p=M.OPOP[pop].p;
  for(let k=0;k<100;k++){
   let total=0;for(let j=0;j<4;j++){const r=u();let cumulative=0,selected=9;for(let i=0;i<p.length;i++){cumulative+=p[i];if(r<cumulative){selected=M.OVALS[i];break;}}total+=selected;}
   expected.push(total/4);
  }
  const split=plain(s);api.samples.mean(s,100);api.samples.mean(split,40);api.samples.mean(split,60);
  assert.deepEqual(plain(s.omeans),expected);assert.deepEqual(plain(split),plain(s));
  assert.ok(s.omeans.every(x=>x>=1&&x<=9));near(s.olast.mean,sum(s.olast.vals)/4);
  const changed={...api.initial('mean'),opop:pop,on:4,oseed:123};api.samples.mean(changed,100);
  assert.notDeepEqual(plain(changed.omeans),expected);
 }
});
test('seeded normal samples use the original Box–Muller law and confidence event',()=>{
 const s=api.initial('ci'),u=independentStream(s.pseed),expected=[];
 for(let i=0;i<120;i++){
  const z=Math.sqrt(-2*Math.log(u()))*Math.cos(2*Math.PI*u()),x=50+2*z,half=1.96*2;
  expected.push({x,lo:x-half,hi:x+half,hit:Math.abs(z)<=1.96});
 }
 const split=plain(s);api.samples.confidence(s,120,true);api.samples.confidence(split,70,true);api.samples.confidence(split,50,true);
 assert.deepEqual(plain(s),plain(split));assert.equal(s.ptot,120);assert.equal(s.prows.length,100);
 assert.equal(s.phit,expected.filter(r=>r.hit).length);
 expected.slice(-100).forEach((e,i)=>{const row=s.prows[i];near(row.x,e.x);near(row.lo,e.lo);near(row.hi,e.hi);assert.equal(row.hit,e.hit);});
 const noRows=api.initial('ci');api.samples.confidence(noRows,120,false);
 assert.equal(noRows.ptot,s.ptot);assert.equal(noRows.phit,s.phit);assert.equal(noRows.pseed,s.pseed);assert.equal(noRows.prows.length,0);
});
test('sampling snapshots are deterministic, rewindable and isolated from mutable manual samples',()=>{
 for(const id of ['mean','ci']){
  const s=api.initial(id),before=plain(s),hundred=plain(api.samples.snapshot(id,s,100)),one=plain(api.samples.snapshot(id,s,1));
  api.samples.snapshot(id,s,700);assert.deepEqual(plain(api.samples.snapshot(id,s,100)),hundred);assert.deepEqual(plain(s),before);
  const manual=plain(s);if(id==='mean')api.samples.mean(manual,100);else api.samples.confidence(manual,100,true);
  assert.deepEqual(plain(id==='mean'?manual.omeans:manual.prows),id==='mean'?hundred.omeans:hundred.prows);
  assert.equal(id==='mean'?one.omeans.length:one.ptot,1);
 }
 assert.equal(lab.randomCalls(),0,'all original first/new/sampling paths avoid unseeded Math.random');
});
