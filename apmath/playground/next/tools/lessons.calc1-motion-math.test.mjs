// Independent kinematics and signed/absolute integration checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/motion-lesson-runtime.mjs';
const lab=await load(),M=lab.api.math,first=id=>lab.api.first(id);
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),a+' != '+b);
const X=(t,p=1)=>t**3-3*t*t+3*(1-p)*t;
const V=(t,p=1)=>3*t*t-6*t+3*(1-p);
const D=(f,t)=>(f(t+1e-5)-f(t-1e-5))/2e-5;
function simpson(f,a,b,n=12000){const h=(b-a)/n;let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);return sum*h/3;}
test('first source packets and all eleven independent original goals remain bound',()=>{
  assert.deepEqual(Object.fromEntries(lab.list.map(sc=>[sc.id,lab.video.lessonList(lab.def.lessons[sc.id]).filter(l=>!l.chapters[0].cues[0].set.lmoConcept).length])),{disp:2,turn:2,origin:3,chase:2,trap:2});
  for(const sc of lab.list)assert.equal(first(sc.id).first,true);
  assert.match(lab.api.question('origin'),/0, 2|0,2/);assert.match(lab.api.question('chase'),/다시 만날 때까지/);
});
test('actual exploration position velocity and acceleration satisfy differentiation',()=>{
  for(const p of [-.25,0,.25,1,2])for(const t of [0,.2,.5,1,1.5,2,3,4]){
    close(M.posX(t,p),X(t,p));close(M.velV(t,p),V(t,p));close(D(x=>M.posX(x,p),t),M.velV(t,p));close(D(x=>M.velV(x,p),t),M.accA(t));
  }
});
test('first displacement is zero even after a nonzero excursion',()=>{
  const v=first('disp');close(v.xf(0),0);close(v.xf(2),-4);close(v.xf(3),0);
  close(v.xf(3)-v.xf(0),0);close(simpson(t=>3*t*t-6*t,0,3),0);
  for(const t of [0,1,2,3]){close(v.xf(t),X(t));close(v.vf(t),V(t));}
});
test('splitting the actual distance at its sign change gives eight',()=>{
  const back=-(X(2)-X(0)),forward=X(3)-X(2);
  close(back,4);close(forward,4);close(back+forward,8);
  close(M.motion(3,1).dist,8);close(M.motion(3,1).disp,0);close(first('disp').S,4);
  close(simpson(t=>Math.abs(V(t)),0,3),8);
});
test('two signed areas remain correct before and after returning to the origin',()=>{
  for(const t of [1,2,2.5,3,4]){
    const expectedBack=t<=2?-X(t):4,expectedForward=t<=2?0:X(t)+4,q=M.motion(t,1);
    close(q.back,expectedBack);close(q.fwd,expectedForward);close(q.disp,X(t));close(q.dist,expectedForward+expectedBack);
  }
});
test('distance bounds displacement and matches independent quadrature in each model',()=>{
  for(const p of [-.25,0,.25,1,2])for(const t of [.5,1,2,3,4]){
    const q=M.motion(t,p);
    assert.ok(q.dist+1e-8>=Math.abs(q.disp));
    close(q.disp,X(t,p));close(q.dist,simpson(u=>Math.abs(V(u,p)),0,t),2e-6);
    if(p<=0)close(q.dist,q.disp);
  }
});
test('original first velocity reverses at one positive root and excludes departure',()=>{
  const v=first('turn');assert.equal(v.n,1);
  assert.deepEqual(Array.from(v.roots),[2]);
  for(const t of [0,.5,1,2,3])close(v.v1(t),3*t*(t-2));
  assert.ok(v.v1(1.9)<0&&v.v1(2.1)>0);
  assert.deepEqual(Array.from(M.turnsOf(1,4)),[2]);
});
test('double and absent roots do not reverse while two positive simple roots do',()=>{
  const v=first('turn');
  for(const t of [0,.9,1,1.1,2])close(v.v2(t),3*(t-1)**2);
  assert.ok(v.v2(.9)>0&&v.v2(1.1)>0);
  assert.deepEqual(Array.from(M.turnsOf(0,4)),[]);assert.deepEqual(Array.from(M.turnsOf(-.25,4)),[]);
  assert.deepEqual(Array.from(M.turnsOf(.25,4)),[.5,1.5]);
  assert.deepEqual([.25,1,2].map(t=>Math.sign(M.velV(t,.25))),[1,-1,1]);
  for(const t of [0,1,2,4])assert.ok(M.velV(t,-.25)>=.75);
});
test('speed maximum is three at time one on the stated closed interval',()=>{
  const v=first('origin');close(v.tmax,1);close(v.vmax,3);
  for(let j=0;j<=100;j++){const t=j/50;close(Math.abs(v.vf(t)),3-3*(t-1)**2);assert.ok(Math.abs(v.vf(t))<=3);}
  close(v.vf(0),0);close(v.vf(2),0);close(Math.abs(v.vf(1)),3);
});
test('distance from the origin peaks at time two on zero through three',()=>{
  const v=first('origin');
  close(v.xmin,-4);close(v.xf(2),-4);close(v.xf(0),0);close(v.xf(3),0);
  for(let j=0;j<=150;j++){const t=j/50;assert.ok(v.xf(t)<=1e-10);assert.ok(Math.abs(v.xf(t))<=4+1e-10);}
});
test('positive return root is three and extending the interval invalidates old maxima',()=>{
  const v=first('origin');
  for(const t of [0,.5,1,2,3,4])close(v.xf(t),t*t*(t-3));
  close(v.T,3);close(v.xf(4),16);close(v.vf(4),24);
  assert.ok(Math.abs(v.xf(4))>4&&Math.abs(v.vf(4))>3);
});
test('two-point source positions integrate their velocities with the same initial position',()=>{
  const v=first('chase');
  for(const t of [0,.2,.5,1,1.5,2]){
    close(v.xP(t),-(t**3)+3*t*t);close(v.xQ(t),1.5*t*t);
    close(D(v.xP,t),v.vP(t));close(D(v.xQ,t),v.vQ(t));
    close(v.xP(t)-v.xQ(t),t*t*(1.5-t));
  }
});
test('gap maximum and reunion are distinct and use the bounded first-reunion interval',()=>{
  const v=first('chase');close(v.t1,1);close(v.t2,1.5);
  close(v.vP(1),v.vQ(1));assert.ok(v.xP(1)>v.xQ(1));
  close(v.xP(1.5),v.xQ(1.5));assert.notEqual(v.vP(1.5),v.vQ(1.5));
  for(let j=0;j<=150;j++){const t=j/100,gap=v.xP(t)-v.xQ(t);assert.ok(gap>=-1e-10&&gap<=.5+1e-10);}
});
test('varying the allowed coefficient preserves the two-to-three ratio before k=2',()=>{
  for(const k of [-.5,0,.5,1,1.5,1.9]){
    const t1=2-k,t2=3-1.5*k;
    close(M.vP4(t1)-M.vQ4(t1,k),0);
    close(M.xP4(t2)-M.xQ4(t2,k),0);close(t1/t2,2/3);
    assert.ok(t1>0&&t1<t2);
    assert.ok(M.vP4(t1*.9)-M.vQ4(t1*.9,k)>0);
    assert.ok(M.vP4(t1*1.1)-M.vQ4(t1*1.1,k)<0);
  }
  close(2-.5,1.5);close(3-1.5*.5,2.25);
});
test('the coefficient boundary has no positive reunion',()=>{
  for(const t of [.1,.5,1,2,4]){
    close(M.vP4(t)-M.vQ4(t,2),-3*t*t);
    close(M.xP4(t)-M.xQ4(t,2),-(t**3));
    assert.ok(M.xP4(t)<M.xQ4(t,2));
  }
});
test('position zero velocity zero and acceleration zero describe different events',()=>{
  const v=first('trap');
  for(const t of [0,1,2,3,4]){close(v.xf(t),X(t));close(v.vf(t),V(t));}
  close(M.accA(1),0);close(V(1),-3);assert.ok(V(.9)<0&&V(1.1)<0);
  close(V(2),0);assert.ok(V(1.9)<0&&V(2.1)>0);
  close(X(3),0);close(V(3),9);assert.ok(V(2.9)>0&&V(3.1)>0);
});
