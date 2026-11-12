import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/vector-ops-lesson-runtime.mjs';
const lab=await load(),M=lab.api.math;
const P=(x,y)=>({x,y}),add=(a,b)=>P(a.x+b.x,a.y+b.y),sub=(a,b)=>P(a.x-b.x,a.y-b.y),mul=(a,t)=>P(a.x*t,a.y*t),dot=(a,b)=>a.x*b.x+a.y*b.y,cross=(a,b)=>a.x*b.y-a.y*b.x,len=a=>Math.hypot(a.x,a.y),dist=(a,b)=>len(sub(a,b));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const eq=(a,b)=>{close(a.x,b.x);close(a.y,b.y);};
const area=(a,b,c)=>Math.abs(cross(sub(b,a),sub(c,a)))/2;
const initial=id=>lab.api.initial(id),point=(s,k)=>P(s[k+'x'],s[k+'y']);

test('first-source sum, midpoint and triangle-translation answers match the actual coordinates',()=>{
 const s=initial('1-A'),a=point(s,'A'),b=point(s,'B'),mid=mul(add(a,b),.5);
 eq(a,P(4,2));eq(b,P(2,4));eq(mid,P(3,3));close(len(add(a,b)),6*Math.SQRT2);close(len(mid),3*Math.SQRT2);
 for(const t of [0,.2,1])eq(sub(add(mul(a,t),b),mul(a,t)),b);
});
test('all registered sum and difference variants satisfy independent coordinate calculations',()=>{
 for(const id of ['1-A','2-A'])for(const q of M.oldPools[id]){
  const [ax,ay,bx,by]=q,I=M.oldBuild[id](q),a=P(ax,ay),b=P(bx,by);
  close(dist(a,b)**2,(ax-bx)**2+(ay-by)**2);close(len(add(a,b))**2,(ax+bx)**2+(ay+by)**2);
  assert.equal(I.patch.Ax,ax);assert.equal(I.patch.By,by);
 }
});
test('circumcenter sum lies on all three altitudes, including a diameter and an equilateral triangle',()=>{
 for(const angles of [[90,210,330],[0,120,230],[0,180,108]]){
  const ps=angles.map(t=>P(4*Math.cos(t*Math.PI/180),4*Math.sin(t*Math.PI/180))),h=ps.reduce(add,P(0,0));
  for(let i=0;i<3;i++)close(dot(sub(h,ps[i]),sub(ps[(i+1)%3],ps[(i+2)%3])),0);
  if(angles[1]===180)eq(h,ps[2]);if(angles[0]===90)close(len(h),0);
 }
 for(const q of M.oldPools['1-B'])for(const a of q)close(Math.hypot(...a),5);
});
test('the first difference source is equilateral, with sum twice its perpendicular median',()=>{
 const s=initial('2-A'),a=point(s,'A'),b=point(s,'B'),mid=mul(add(a,b),.5);
 close(len(a),4);close(len(b),4);close(dist(a,b),4);close(dot(mid,sub(b,a)),0);close(2*len(mid),4*Math.sqrt(3));
});
test('locus identity includes both diameter endpoints and degenerates to a single point',()=>{
 for(const [a,b]of [[P(-4,0),P(4,0)],[P(1,1),P(7,9)],[P(1,1),P(1,1)]]){
  const m=mul(add(a,b),.5),r=dist(a,b)/2;
  for(const t of [0,.4,Math.PI,5]){
   const p=add(m,P(r*Math.cos(t),r*Math.sin(t))),pa=sub(a,p),pb=sub(b,p);
   close(len(add(pa,pb)),len(sub(pa,pb)));close(dot(pa,pb),0);
  }
 }
});
test('registered coefficient domains produce the stated segment and both polygon areas',()=>{
 const [seg,tri,par]=M.oldPools['2-C'];
 close(seg.k*Math.hypot(seg.A[0]-seg.Bp[0],seg.A[1]-seg.Bp[1]),10);
 close(Math.abs(tri.A[0]*tri.Bp[1]-tri.A[1]*tri.Bp[0])/2,12);
 close(Math.abs(par.A[0]*par.Bp[1]-par.A[1]*par.Bp[0]),11);
 for(const q of M.oldPools['2-C']){
  const a=P(...q.A),b=P(...q.Bp),k=q.k||1;
  for(const t of [0,.2,.8,1])close(cross(sub(add(mul(a,k*t),mul(b,k*(1-t))),mul(a,k)),sub(b,a)),0);
 }
 close(cross(P(4,0),P(2,0)),0);
});
test('every line-domain cue keeps alpha+beta=k, while triangle cues keep nonnegative barycentric weights',()=>{
 for(const q of lab.video.lessonList(lab.def.lessons['2-C'])){
  const c=lab.video.compileLesson(q),base={nums:{},sets:{},step:0,part:null};
  for(let t=0;t<=c.length;t+=.5){
   const st=lab.video.stateAt(c,t,base),n=st.nums,se=st.sets;
   if(se.lvoS_region==='line')close(n.lvoN_la+n.lvoN_lb,n.lvoN_lk);
   if(se.lvoS_region==='triangle'){assert.ok(n.lvoN_la>=0&&n.lvoN_lb>=0);assert.ok(n.lvoN_la+n.lvoN_lb<=1+1e-9);}
  }
 }
});
test('all original circle-distance variants, internal points and coincident centers satisfy extrema',()=>{
 const cases=[[4,3,2],[1,0,2.5],[0,0,2],...M.oldPools['3-A']];
 for(const [x,y,r]of cases){const c=P(x,y),d=len(c),u=d?mul(c,1/d):P(1,0);close(len(add(c,mul(u,r))),d+r);close(len(sub(c,mul(u,r))),Math.abs(d-r));}
 close((5+2)*(5-2),21);
});
test('midpoint cancellation reduces every two-fixed-point circle variant to twice one distance',()=>{
 for(const [ax,ay,bx,by,cx,cy,r]of M.oldPools['3-B']){
  const a=P(ax,ay),b=P(bx,by),n=mul(add(a,b),.5),c=P(cx,cy),d=dist(c,n);
  for(const t of [0,.7,2.1,4]){const p=add(c,P(r*Math.cos(t),r*Math.sin(t)));close(len(add(sub(a,p),sub(b,p))),2*dist(p,n));assert.ok(dist(p,n)>=Math.abs(d-r)-1e-8);}
 }
});
test('two-circle extrema land on the actual circles and attain all separation/containment/intersection bounds',()=>{
 const cases=[[P(-3,0),P(3,0),1.5,1.5],[P(-1.3,0),P(1.3,0),2,2],[P(0,0),P(.5,0),3,1],[P(0,0),P(0,0),3,1],[P(0,0),P(0,0),2,2],[P(0,0),P(5,0),3,2]];
 for(const [c1,c2,r1,r2]of cases){const d=dist(c1,c2),ex=M.circleExtrema(c1,c2,r1,r2),minimum=Math.max(0,d-r1-r2,Math.abs(r1-r2)-d);
  for(const pair of [ex.far,ex.near]){close(dist(pair[0],c1),r1);close(dist(pair[1],c2),r2);}
  close(dist(...ex.far),d+r1+r2);close(dist(...ex.near),minimum);close(M.circleMin(d,r1,r2),minimum);
 }
});
test('weighted-zero-vector areas independently match vertex weights and registered partial-area answers',()=>{
 const a=P(0,4.8),b=P(-5.2,-3),c=P(5.4,-3),whole=area(a,b,c);
 for(const [al,be,ga,total]of [[2,3,5,10],...M.oldPools['4-A']]){
  const sum=al+be+ga,p=mul(add(add(mul(a,al),mul(b,be)),mul(c,ga)),1/sum);
  close(area(p,b,c)/whole,al/sum);close(area(p,c,a)/whole,be/sum);close(area(p,a,b)/whole,ga/sum);
  close(len(add(add(mul(sub(a,p),al),mul(sub(b,p),be)),mul(sub(c,p),ga))),0);
  if(al===1&&be===2&&ga===3)close(total*area(p,a,b)/whole,18);
 }
});
test('anchored-vector E and P positions give the original ratio and every registered variant area ratio',()=>{
 const a=P(0,4.8),b=P(-5.2,-3),c=P(5.4,-3),whole=area(a,b,c);
 for(const [k,m,n]of [[10,3,5],...M.oldPools['4-B']]){
  const e=mul(add(mul(b,m),mul(c,n)),1/(m+n)),p=add(a,mul(sub(e,a),(m+n)/k));
  close(dist(b,e)/dist(e,c),n/m);close(dist(a,p)/dist(a,e),(m+n)/k);
  close(area(p,b,c)/whole,(k-m-n)/k);close(area(p,c,a)/whole,m/k);close(area(p,a,b)/whole,n/k);
  assert.ok(k>m+n);
 }
});
test('all twelve registered hexagon pairs agree with independent endpoint-vector sums',()=>{
 for(const pair of M.hexPairs)for(const side of [2,4,6]){
  const info=M.hex(pair,side),a=M.hexPoint(pair[0][0]),b=M.hexPoint(pair[0][1]),c=M.hexPoint(pair[1][0]),d=M.hexPoint(pair[1][1]);
  const sum=add(sub(b,a),sub(d,c));close(len(sum)*side/2,info.len);
  if(info.end)eq(add(a,sum),M.hexPoint(info.end));
 }
 const first=lab.api.first('hex5');assert.deepEqual(Array.from(first.pair),['AB','CD']);close(first.len,4);assert.equal(first.end,'O');
});
test('moving-circle first source produces center interval [4,5] and all three original target types',()=>{
 const p=lab.api.first('rng6');eq(p.C,P(-3,4));eq(p.w,P(6,0));close(p.r,2);
 const d0=dist(P(0,0),p.C),d1=dist(P(0,0),add(p.C,p.w));close(d0,5);close(d1,5);
 const t=-dot(p.C,p.w)/dot(p.w,p.w),foot=add(p.C,mul(p.w,t));close(t,.5);close(len(foot),4);
 close(p.L.M,7);close(p.L.m,2);close(p.val,14);close(lab.api.packet('rng6',0,'M+m').val,9);close(lab.api.packet('rng6',0,'M-m').val,5);
});
test('moving-circle general minimum handles every original set, zero translation, crossing and an enclosing radius',()=>{
 for(const c of [...M.rngSets,{C:P(1,0),w:P(0,0),r:3},{C:P(-2,0),w:P(4,0),r:1},{C:P(2,0),w:P(1,0),r:5}]){
  const x=M.rng(c.C,c.w,c.r),center=add(c.C,mul(c.w,x.nearT)),near=add(center,mul(x.nearUnit,c.r));
  close(len(near),x.m);close(dist(near,center),c.r);
  const endpoint=Math.max(len(c.C),len(add(c.C,c.w)));close(x.M,endpoint+c.r);
  for(let i=0;i<=12;i++)for(let j=0;j<24;j++){const v=add(add(c.C,mul(c.w,i/12)),P(c.r*Math.cos(j*Math.PI/12),c.r*Math.sin(j*Math.PI/12)));assert.ok(len(v)>=x.m-1e-8&&len(v)<=x.M+1e-8);}
 }
});
