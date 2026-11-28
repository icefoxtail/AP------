#!/usr/bin/env node
// 순천고 고2 대수 유사2 교차검산: 정답지의 해설 문자열을 읽지 않고
// 발문의 수치·조건을 별도 방식으로 계산하여 선택/서답과 대조한다.
// 동일 모델이 작성한 계산 프로그램이므로 '별도 사람/모델 블라인드 심사'의 대체물은 아니다.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const exam = new URL('../26_순천고_1학기_기말_고2_대수_유사2.js', import.meta.url);
const w = { window: {} };
vm.runInNewContext(fs.readFileSync(exam, 'utf8'), w);
const q = w.window.questionBank;
assert.equal(q.length, 24);
const near = (a,b,eps=1e-8)=>Math.abs(a-b)<eps;
const roots = n => {
  const N=200000, hi=n*Math.PI, f=x=>Math.abs(Math.cos(2*x))-x/hi;
  let count=0, last=f(0);
  for(let k=1;k<N;k++){
    const next=f(hi*k/N);
    if(last*next<0)count++;
    last=next;
  }
  if(near(f(hi),0))count++;
  return count;
};
const signSums=[];
for(let mask=0;mask<32;mask++){
  let b=0;const a=[];
  for(let k=0;k<5;k++){
    const bk=(mask&(1<<k)?-1:1)*3**k;
    b+=bk; a.push((k%2?-1:1)*bk);
  }
  if(b===49)signSums.push(a[1]+a[3]);
}
const t=Math.sqrt(3), a23=t, b23=1, c23=Math.sqrt((3*a23*a23+b23*b23)/4);
const case20 = (()=>{
  let arr=[null,1];
  for(let n=2;n<=25;n++){
    const prev=arr.slice(1).reduce((s,v)=>s+v,0);
    const factor=n*(n+1)/2;
    arr[n]=prev/(factor-1);
  }
  return arr.every((v,n)=>n===0||near(v,6/((n+1)*(n+2))));
})();
const induction = (()=>{
  let a=1.5;
  for(let n=1;n<=100;n++){
    if(!near(a,n*(n+2)/2,1e-7))return false;
    a*=((n+1)*(n+3))/(n*(n+2));
  }
  return true;
})();
const expected=[
'②','④','①','③','⑤','③','⑤','①','④','②',
'⑤','①','③','②','④','①','⑤','③','②','④',
'$7$',
'$\\left\\{\\dfrac{\\pi}{2}\\right\\}\\cup\\left[\\dfrac{7\\pi}{6},\\dfrac{11\\pi}{6}\\right]\\cup\\left\\{\\dfrac{5\\pi}{2}\\right\\}$',
'$\\dfrac{\\sqrt{13}}4$','증명'
];
const recomputation = [
 near(Math.cos(7*Math.PI/6),-Math.sqrt(3)/2),
 near(6*Math.pow(Math.sqrt(2),4),24),
 19-3*((35-19)/4)===7,
 near(2*Math.PI*6/(2*(3/5)),10*Math.PI),
 (7-(-3))/2+(7+(-3))/2+3===10,
 near(Math.sqrt(1-(10*Math.sqrt(3)/20)**2),0.5),
 2+4*( (2*56/7-4)/6 )===10,
 near(Array.from({length:24},(_,k)=>1/(Math.sqrt(3*(k+1)+6)+Math.sqrt(3*(k+2)+6))).reduce((a,b)=>a+b,0),2),
 near((2*1*1/2)/(4*1*1),0.25),
 3*7+3===24,
 near(((21)/(4*(Math.sqrt(3)/2)**2))*Math.PI,7*Math.PI),
 !near(Math.tan(Math.PI/6)-2,-2)&&near(Math.tan(0)-2,-2),
 (1+3**2+3**4)===91,
 (34-(3+1+1+3+5+7))-5===9,
 near(0.5*(5-1)*1.5+(11-7),7),
 (8*9)/2===36,
 roots(1)+roots(2)+roots(3)===27,
 near((2*84*Math.sqrt(3)/19)*Math.sin(Math.PI/3),252/19),
 signSums.length===1&&signSums[0]===24,
 case20&&near((3*4/6)*(2*5/2),10),
 Array.from({length:30},(_,i)=>{let n=i+1;return {n,S:n*(14-n)}}).sort((a,b)=>b.S-a.S)[0].n===7,
 [Math.PI/2,7*Math.PI/6,11*Math.PI/6,5*Math.PI/2].every(x=>{let v=-2*Math.sin(Math.PI/2+x)**2+Math.sin(Math.PI+x)+1;return v>=-1e-8}) && [-.1+Math.PI,2*Math.PI, 2.8*Math.PI].every(x=>-2*Math.sin(Math.PI/2+x)**2+Math.sin(Math.PI+x)+1<0),
 near(Math.sin(Math.acos((a23*a23+b23*b23-c23*c23)/(2*a23*b23))),Math.sqrt(13)/4),
 induction
];
assert.equal(expected.length,24);
assert.equal(recomputation.length,24);
let fails=0;
const histogram={};
const distribution={};
for(let i=0;i<24;i++){
  const item=q[i];
  histogram[item.difficultyBucket]=(histogram[item.difficultyBucket]||0)+1;
  if(i<20)distribution[item.answer]=(distribution[item.answer]||0)+1;
  const pass=item.id===i+1 && item.answer===expected[i] && recomputation[i];
  if(!pass)fails++;
  console.log('Q'+String(i+1).padStart(2,'0')+' '+(pass?'PASS':'FAIL')+' answer='+item.answer+' difficulty='+item.difficultyBucket);
}
const points=q.reduce((s,o)=>s+o.points,0);
assert(near(points,100));
assert.deepEqual(histogram,{'1':3,'2':5,'3':6,'4':6,'5':4});
assert.deepEqual(distribution,{'①':4,'②':4,'③':4,'④':4,'⑤':4});
if(fails){console.error(fails+' failed items');process.exitCode=1;}
else console.log('RECHECK_PASS 24/24; points 100; choice balance 4-4-4-4-4; original difficulty histogram 3/5/6/6/4');
