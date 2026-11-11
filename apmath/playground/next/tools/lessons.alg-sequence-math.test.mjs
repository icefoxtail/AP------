// Independent calculations against the production page's first source packets.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/sequence-lesson-runtime.mjs';
const lab=await load(),v=id=>lab.api.first(id),plain=x=>JSON.parse(JSON.stringify(x));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const sum=a=>a.reduce((x,y)=>x+y,0);
const range=n=>Array.from({length:n},(_,i)=>i+1);
const has=(id,label,text)=>assert.ok(lab.def.lessons[id].find(l=>l.label===label).answer.includes(text),id+'/'+label);
const seq=(a,n,f)=>{const values=[a];while(values.length<n)values.push(f(values.at(-1)));return values;};
const area=ps=>Math.abs(ps.reduce((s,p,i)=>{const q=ps[(i+1)%ps.length];return s+p[0]*q[1]-p[1]*q[0];},0))/2;

test('type1-0: the two given terms determine the center, sum and tenth term',()=>{
 const q=v('type1-0');assert.deepEqual(plain(q.g),{d:2,p:3,q:7,m:5});
 const a1=-(q.g.p+q.g.q-2)*q.g.d/2,a=n=>a1+(n-1)*q.g.d;
 close(a(3)+a(7),0);close(a(5),0);close(sum(range(9).map(a)),0);close(a(10),10);
 for(const [label,s] of [['가운데항','a_5=0'],['아홉항합','S_9=0'],['열째항','a_{10}=10']])has('type1-0',label,s);
 for(let n=1;n<10;n++)close(a(n+1)-a(n),2);
});
test('type1-1: sign changes at the first natural index beyond the zero',()=>{
 const q=v('type1-1');assert.deepEqual(plain(q.g),{A:7,k:4,d:-2});
 const d=-2*q.g.A/(2*q.g.k-1),a=n=>q.g.A+(n-1)*d,terms=range(8).map(a);
 close(d,-2);close(a(4)+a(5),0);assert.equal(terms.findIndex(x=>x<0)+1,5);close(sum(terms),0);
 has('type1-1','첫음수항','$5$');has('type1-1','여덟항합','S_8=0');
});
test('type2-0: different negative scales have the same maximum index and positive zero',()=>{
 const q=v('type2-0');assert.deepEqual([q.g.p,q.g.q],[3,7]);
 for(const d of [-.5,-2,-7]){const a1=-9*d/2,S=n=>sum(range(n).map(k=>a1+(k-1)*d));assert.ok(a1>0);close(S(3),S(7));const vals=range(20).map(S),max=Math.max(...vals);assert.deepEqual(range(20).filter(n=>S(n)===max),[5]);assert.deepEqual(range(20).filter(n=>S(n)===0),[10]);}
 has('type2-0','최대번호','n=5');has('type2-0','합의영점','k=10');
});
test('type2-1: equal consecutive maxima and the zero term are distinct targets',()=>{
 const q=v('type2-1');assert.deepEqual([q.g.p,q.g.q],[3,6]);
 const a=n=>10-2*n,S=n=>sum(range(n).map(a)),vals=range(16).map(S),max=Math.max(...vals);
 close(S(3),S(6));const ns=range(16).filter(n=>S(n)===max);assert.deepEqual(ns,[4,5]);assert.equal(sum(ns),9);assert.deepEqual(range(16).filter(n=>a(n)===0),[5]);
 has('type2-1','최대번호합','$9$');has('type2-1','영인항','k=5');
});
test('type3-0: summing absolute terms agrees with the signed-sum split',()=>{
 const q=v('type3-0');assert.deepEqual([q.g.N,q.g.T],[8,10]);const S=n=>-n*n+8*n,terms=range(10).map(n=>S(n)-S(n-1));
 assert.deepEqual(terms,[7,5,3,1,-1,-3,-5,-7,-9,-11]);close(sum(terms.map(Math.abs)),52);close(2*S(4)-S(10),52);assert.notEqual(sum(terms.map(Math.abs)),Math.abs(sum(terms)));has('type3-0','절댓값합','$52$');
});
test('type3-1: the given positive pair is not the target absolute height',()=>{
 const q=v('type3-1');assert.deepEqual([q.g.N,q.g.a,q.g.b,q.g.L],[8,3,5,9]);const S=n=>-n*(n-8);
 close(Math.abs(S(3)),15);close(Math.abs(S(5)),15);assert.deepEqual(range(50).filter(n=>n>8&&Math.abs(S(n))===9),[9]);has('type3-1','절댓값방정식','r=9');
});
test('type4-0: the actual first partial sum preserves the constant-term exception',()=>{
 const q=v('type4-0');assert.deepEqual([q.g.p,q.g.q,q.g.C],[1,2,3]);const S=n=>n*n+2*n+3,a=n=>n===1?S(1):S(n)-S(n-1);
 close(a(1),6);close(a(5),11);close(a(1)+a(5),17);assert.notEqual(a(1),2*1+1);for(let n=1;n<=10;n++)close(sum(range(n).map(a)),S(n));has('type4-0','두항합','=17');
});
test('type4-1: only zero constant keeps the first difference equal to later differences',()=>{
 const q=v('type4-1');assert.deepEqual([q.g.p,q.g.q],[1,2]);
 const valid=range(11).map(x=>x-6).filter(C=>{const S=n=>n*n+2*n+C;return(S(2)-S(1))-S(1)===(S(3)-S(2))-(S(2)-S(1));});assert.deepEqual(valid,[0]);
 for(let n=1;n<=12;n++)close(sum(range(n).map(k=>2*k+1)),n*n+2*n);has('type4-1','상수C','C=0');has('type4-1','일반항','a_n=2n+1');
});
for(const [id,P1,R,S2,P3,S3] of [['type5-0',10,2,30,40,70],['type5-1',5,3,20,45,65]])test(id+': direct geometric terms reproduce all equal-length blocks',()=>{
 const q=v(id);assert.deepEqual([q.g.P1,q.g.R,q.g.S2],[P1,R,S2]);
 for(const n of [1,2,3,5]){const r=R**(1/n),a1=P1/sum(range(n).map(k=>r**(k-1))),terms=range(3*n).map(k=>a1*r**(k-1));close(sum(terms.slice(0,n)),P1);close(sum(terms.slice(0,2*n)),S2);close(sum(terms.slice(2*n)),P3);close(sum(terms),S3);}
 has(id,id==='type5-0'?'세구간합':'전체부분합',String(S3));if(id==='type5-1')has(id,'셋째묶음',String(P3));
});
for(const [id,a1,d,n,target] of [['type6-0',1,2,6,6/13],['type6-1',2,3,8,2/13]])test(id+': direct rational sum agrees with partial fractions and endpoint indices',()=>{
 const q=v(id);assert.deepEqual([q.g.a1,q.g.d,q.g.n],[a1,d,n]);const a=k=>a1+(k-1)*d;
 close(sum(range(n).map(k=>1/(a(k)*a(k+1)))),target);close((1/a(1)-1/a(n+1))/d,target);
 for(const k of range(n))close(1/(a(k)*a(k+1)),(1/a(k)-1/a(k+1))/d);
 has(id,'분수합',id==='type6-0'?'6{13}':'2{13}');
});
for(const [id,a1,n,cycle,total] of [['type7-0',1,30,[1,3,5],90],['type7-1',2,31,[2,4,0],62]])test(id+': forward recurrence verifies boundary inclusion, period and remainder',()=>{
 const q=v(id);assert.deepEqual([q.g.a1,q.g.N],[a1,n]);const f=x=>x<4?x+2:x-4,a=seq(a1,n+6,f);
 assert.equal(f(4),0);assert.deepEqual(a.slice(0,3),cycle);for(let k=3;k<a.length;k++)assert.equal(a[k],a[k-3]);assert.equal(sum(a.slice(0,n)),total);
 if(id==='type7-0'){assert.notEqual(a[0],a[1]);assert.notEqual(a[0],a[2]);has(id,'주기','$3$');has(id,'서른항합',String(total));}else{has(id,'반복항','2,4,0');has(id,'서른한항합',String(total));}
});
for(const [id,k,expected,total] of [['type8-0',6,[4,7,11,14,22],58],['type8-1',4,[3,5,10,16],34]])test(id+': exhaustive forward natural-term search validates every inverse branch',()=>{
 const q=v(id);assert.deepEqual([q.g.t,q.g.k],[4,k]);const f=x=>x<k?2*x:x-k;
 // At each backward step either y/2 or y+k is possible, hence a1 <= 4+3k.
 const candidates=range(4+3*k).filter(x=>{const a=seq(x,4,f);return a.every(n=>Number.isInteger(n)&&n>0)&&a[3]===4;});
 assert.deepEqual(candidates,expected);assert.deepEqual(plain(q.g.a1),expected);assert.equal(sum(candidates),total);has(id,'역추적합',String(total));
 if(k===4)assert.notEqual(f(4),8);
});
test('br-tree: exhaustive forward parity recurrence gives five distinct first terms',()=>{
 const q=v('br-tree');assert.deepEqual([q.fam,q.c,q.t,q.m,q.ask],['par',5,8,3,'count']);const f=x=>x%2===0?x/2:x+5;
 // Backward branches are 2y and y-5; three steps from 8 cannot exceed 64.
 const candidates=range(64).filter(x=>seq(x,4,f).at(-1)===8);
 assert.deepEqual(candidates,[1,12,22,27,64]);assert.equal(candidates.length,5);assert.notEqual(f(6),11);has('br-tree','첫항개수','$5$');
});
test('cyc-table: sum the actual forty terms and independently separate the transient',()=>{
 const q=v('cyc-table');assert.deepEqual([q.k,q.d,q.a1,q.M],[3,2,-5,40]);const f=x=>x<=0?x+3:x-2,a=seq(-5,50,f);
 assert.deepEqual(a.slice(0,8),[-5,-2,1,-1,2,0,3,1]);assert.equal(f(0),3);
 const tail=a.slice(0,2),cycle=a.slice(2,7);for(let i=7;i<a.length;i++)assert.equal(a[i],a[i-5]);assert.equal(sum(a.slice(0,40)),30);assert.equal(sum(tail)+7*sum(cycle)+sum(cycle.slice(0,3)),30);has('cyc-table','마흔항합','S_{40}=30');
});
test('pt-tri-diff: actual intersections and determinant areas telescope to 248',()=>{
 const q=v('pt-tri-diff');assert.deepEqual([q.j,q.N],[1,25]);const S=n=>{const x=4*Math.sqrt(n),y=n;close(x*x/16,y);close(Math.sqrt(n)*x/4,y);return area([[0,0],[x,0],[x,y]]);};
 close(sum(range(24).map(n=>S(n+1)-S(n))),248);close(S(25)-S(1),248);has('pt-tri-diff','넓이차합','$248$');
});
test('pt-tri-sum: both intersections satisfy both curves and determinant areas sum to 65',()=>{
 const q=v('pt-tri-sum');assert.deepEqual([q.a,q.M],[3,4]);const areas=range(4).map(n=>{const A=[-n,0],B=[3*n+1,4*n+1];for(const [x,y] of [A,B]){close(x*x-2*n*x-3*n*n,y);close(x+n,y);}return area([[0,0],A,B]);});
 assert.deepEqual(areas,[2.5,9,19.5,34]);close(sum(areas),65);has('pt-tri-sum','삼각형합','=65');
});
test('fig-repeat: source triangle, inscribed square and converging area sum agree',()=>{
 const q=v('fig-repeat');assert.deepEqual([q.p,q.L],['p23',3]);const E=[2,0],F=[0,2],D=[3,3],triangle=area([E,F,D]);close(triangle,4);
 const b=Math.hypot(E[0]-F[0],E[1]-F[1]),h=2*triangle/b,s=b*h/(b+h),ratio=s*s/9;close(s,Math.sqrt(2));close(ratio,2/9);assert.ok(ratio>0&&ratio<1);
 const first=9-triangle;close(first,5);close(sum(range(30).map(n=>first*ratio**(n-1))),45/7);close(first/(1-ratio),45/7);has('fig-repeat','반복넓이','45');
 for(const l of lab.def.lessons['fig-repeat'])assert.ok(l.title.includes('이전 교육과정'));
});
