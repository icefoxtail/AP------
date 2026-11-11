// Independent mathematical checks against the actual source packets.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/logdeep-lesson-runtime.mjs';
const lab=await load(),v=id=>lab.api.first(id);
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const answer=(id,label)=>lab.def.lessons[id].find(l=>l.label===label).answer;
const has=(id,label,text)=>assert.ok(answer(id,label).includes(text),id+'/'+label);
const reflect=([x,y],C=0)=>[y-C,x+C];
const dist=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
const bisect=(f,a,b)=>{for(let i=0;i<80;i++){const m=(a+b)/2;if(f(a)*f(m)<=0)b=m;else a=m;}return(a+b)/2;};
const shoelace=pts=>Math.abs(pts.reduce((s,[x,y],i)=>{const q=pts[(i+1)%pts.length];return s+x*q[1]-y*q[0];},0))/2;

test('type1-0: every source vertical segment has equal length and numerical area is six',()=>{
 const q=v('type1-0');assert.equal(q.e.k,4);assert.deepEqual([q.e.x1,q.e.x2],[2,5]);
 let area=0;for(let i=0;i<1000;i++){const x=2+(i+.5)*3/1000;const d=Math.log2(q.e.k*x)-Math.log2(x);close(d,2);area+=d*3/1000;}
 close(area,6);close(q.S,area);close(q.n,2);has('type1-0','세로길이','AB');has('type1-0','곡선넓이','S=6');
});
test('type1-1: moving the cut does not change the equilateral triangle area',()=>{
 const q=v('type1-1');assert.equal(q.e.k,8);
 for(const t of [.25,1,2,5,20]){const a=[t,Math.log2(t)],b=[t,Math.log2(8*t)],c=[t+3*Math.sqrt(3)/2,(a[1]+b[1])/2];close(dist(a,b),3);close(dist(a,c),3);close(shoelace([a,b,c]),9*Math.sqrt(3)/4);}
 has('type1-1','정삼각형','9\\sqrt3');
});
test('type2-0: both nonzero roots satisfy the source equation, unlike log of x',()=>{
 const q=v('type2-0');assert.equal(q.e.c,2);
 for(const x of [-2,2])close(Math.log2(x*x),2);assert.ok(Number.isNaN(Math.log2(-2)));close((-2)*2,-4);close(q.root,2);
 has('type2-0','실근의곱','-4');has('type2-0','교점비교','$2$개와 $1$개');
});
test('type2-1: independent sign brackets and concavity give one left plus two right roots',()=>{
 const q=v('type2-1'),h=x=>Math.log2(x*x)-q.e.m*x-q.e.k;assert.deepEqual([q.e.m,q.e.k],[.4,2]);
 const roots=[bisect(h,-2,-1),bisect(h,3,4),bisect(h,14,15)];for(const x of roots)close(h(x),0,1e-8);
 [...q.left,...q.right].forEach((x,i)=>close(x,roots[i]));close(h(4),.4);assert.ok(2/(4*Math.LN2)-.4>0);assert.ok(-2/(4**2*Math.LN2)<0);
 assert.equal(q.total,3);has('type2-1','교점개수','$3$개');
});
test('type3-0: reciprocal roots, strict sum and source midpoint independently verify three claims',()=>{
 const q=v('type3-0');assert.equal(q.t,2);
 for(const t of [.001,.5,1,2,10]){const a=2**(-t),b=2**t;close(Math.abs(Math.log2(a)),t);close(Math.abs(Math.log2(b)),t);close(a*b,1);assert.ok(a+b>2);}
 close(q.x1,.25);close(q.x2,4);close((q.x1+q.x2)/2,17/8);
 for(const [label,text] of [['ㄱ곱','ㄱ은 참'],['ㄴ합','ㄴ은 참'],['ㄷ중점','ㄷ은 참']])assert.equal(answer('type3-0',label),text);
});
test('type3-1: translate both roots before multiplying distances or summing coordinates',()=>{
 const q=v('type3-1');assert.deepEqual([q.p,q.t],[2,1]);const roots=[2+2**(-1),2+2];
 roots.forEach(x=>close(Math.abs(Math.log2(x-2)),1));close((roots[0]-2)*(roots[1]-2),1);close(roots[0]+roots[1],13/2);close(q.x1,roots[0]);close(q.x2,roots[1]);
 has('type3-1','이동곱','=1');has('type3-1','좌표의합','13');
});
test('type4-0: exact first-quadrant inverse pair verifies chord, line and area',()=>{
 const q=v('type4-0'),a=[2,4],b=reflect(a);assert.equal(q.e.a,2);
 close(2**a[0],a[1]);close(Math.log2(b[0]),b[1]);close(dist(a,b),2*Math.sqrt(2));close(q.k,6);close(shoelace([[0,0],a,b]),6);
 const f=x=>2**x-x-2;assert.ok(f(0)<0);close(f(2),0);assert.ok(Math.LN2*2**2-1>0); // f is strictly convex.
 has('type4-0','상수k','k=6');has('type4-0','삼각넓이','$6$');
});
test('type4-1: numerical intersection and its reflection have the authored midpoint and sums',()=>{
 const q=v('type4-1'),k=q.e.k;assert.equal(k,6);const x=bisect(x=>2**x+x-k,0,4),a=[x,k-x],b=reflect(a);
 close(Math.log2(b[0]),b[1]);close((a[0]+b[0])/2,3);close((a[1]+b[1])/2,3);close(a[0]+b[0],6);close(a[1]+b[1],6);
 has('type4-1','교점중점','M(3,3)');has('type4-1','x좌표합','=6');has('type4-1','y좌표합','=6');
});
test('type5-0: all sampled points reflect onto the translated logarithm and crossing midpoint',()=>{
 const q=v('type5-0');assert.deepEqual([q.e.m,q.e.n,q.p,q.e.q,q.e.k],[1,2,4,-1,6]);
 for(const u of [-3,-1,0,1,2,4]){const pt=[1+u,2**u+2],[X,Y]=reflect(pt,-2);close(Math.log2(X-4)-1,Y);}
 close(q.C,-2);const xa=bisect(x=>2**(x-1)+2+x-6,-2,4),a=[xa,6-xa],b=reflect(a,-2);close((a[0]+b[0])/2,4);close((a[1]+b[1])/2,2);close(b[0]+b[1],6);
 has('type5-0','대칭축C','C=-2');has('type5-0','교점중점','M(4,2)');
});
test('type5-1: whole-curve reflection confirms the midpoint-based axis, not just two points',()=>{
 const q=v('type5-1');assert.deepEqual([q.e.m,q.e.n,q.p,q.e.q],[0,3,1,2]);
 for(const u of [-3,-1,0,1,2,4]){const [X,Y]=reflect([u,2**u+3],2);close(Math.log2(X-1)+2,Y);}
 close(q.C,2);close((0+2)/2,1);close((4+2)/2,3);has('type5-1','대칭축','C=2');
});
function trapPoints(q){return[q.e.k1,q.e.k2].map(k=>{const x=bisect(x=>2**x+x-k,-10,10);return[[x,k-x],[k-x,x]];});}
test('type6-0: actual four intersections verify height and the delta-x area identity',()=>{
 const q=v('type6-0');assert.deepEqual([q.e.k1,q.e.k2],[4,6]);const [[a,b],[c,d]]=trapPoints(q),m1=a.map((x,i)=>(x+b[i])/2),m2=c.map((x,i)=>(x+d[i])/2);
 close(dist(m1,m2),Math.sqrt(2));const dx1=Math.abs(a[0]-b[0]),dx2=Math.abs(c[0]-d[0]);close(shoelace([a,b,d,c]),dx1+dx2);
 has('type6-0','높이','h=\\sqrt2');has('type6-0','넓이공식','\\Delta x_1+\\Delta x_2');
});
test('type6-1: midpoint separation is perpendicular to each base and has the stated length',()=>{
 const q=v('type6-1');assert.deepEqual([q.e.k1,q.e.k2],[3.5,6.5]);const [[a,b],[c,d]]=trapPoints(q),m1=a.map((x,i)=>(x+b[i])/2),m2=c.map((x,i)=>(x+d[i])/2),u=m2.map((x,i)=>x-m1[i]);
 close(dist(m1,m2),3/Math.sqrt(2));close((b[0]-a[0])*u[0]+(b[1]-a[1])*u[1],0);close((d[0]-c[0])*u[0]+(d[1]-c[1])*u[1],0);close(m1[0],m1[1]);close(m2[0],m2[1]);
 has('type6-1','평행선높이','3\\sqrt2');has('type6-1','수직이등분','수직이등분선');
});
for(const [id,r2,d,a,label] of [['type7-0',10,2,3,'밑a'],['type7-1',17,3,4,'상수a']])test(id+': positive sum and difference determine coordinates, chord and logarithmic reflection',()=>{
 const q=v(id);close(q.r2,r2);close(q.d,d);const sum=Math.sqrt(2*r2-d*d),alpha=(sum-d)/2,beta=(sum+d)/2;
 assert.ok(alpha>0&&beta>alpha);close(alpha**2+beta**2,r2);close(Math.hypot(beta-alpha,alpha-beta),d*Math.sqrt(2));close(a**alpha,beta);close(Math.log(beta)/Math.log(a),alpha);close(q.e.al,alpha);close(q.e.be,beta);has(id,label,'a='+a);if(id==='type7-0')has(id,'점P','P(1,3)');
});
for(const [id,K,total] of [['type8-0',9,16],['type8-1',12,25]])test(id+': exhaustive natural-coordinate enumeration confirms every row and total',()=>{
 const q=v(id);assert.equal(q.K,K);const points=[];for(let x=1;x<=K;x++)for(let y=1;y<=K;y++)if(y<=Math.log2(x)+1e-12)points.push([x,y]);
 assert.equal(points.length,total);assert.equal(q.total,total);for(const row of q.rows){const xs=points.filter(p=>p[1]===row.y).map(p=>p[0]);assert.equal(xs.length,row.cnt);assert.equal(Math.min(...xs),row.x0);assert.equal(Math.max(...xs),K);}
 has(id,'가로줄합',String(total));
});
