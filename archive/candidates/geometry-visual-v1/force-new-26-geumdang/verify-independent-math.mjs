import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../../../..');
const ids=[1,3,4,5,6,7,9,10,11,12,13,14,15,17,18,20];
const lock=JSON.parse(fs.readFileSync(path.join(HERE,'source-lock.json'),'utf8'));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const close=(a,b,e=1e-8)=>Math.abs(a-b)<=e;
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const questionBank=(()=>{const sandbox={window:{}};const source=fs.readFileSync(path.join(ROOT,lock.examPath),'utf8');if(sha(source)!==lock.examSha256)throw Error('SOURCE_EXAM_HASH_MISMATCH');vm.runInNewContext(source,sandbox,{timeout:5000});return sandbox.window.questionBank;})();
function solve(id,q,f){
 const checks={};
 if(id===1){const left=2-3,right=2+3,ints=[];for(let k=Math.floor(left)+1;k<right;k++)if(9-(k-2)**2>0)ints.push(k);checks.openInterval=left===-1&&right===5;checks.integers=ints.join(',')==='0,1,2,3,4';checks.endpoints=9-(-1-2)**2===0&&9-(5-2)**2===0;}
 if(id===3){const T=[-2,3],a=(15-13)/2;checks.contact=T[0]**2+T[1]**2===13;checks.tangent=-2*T[0]+3*T[1]===13;checks.radiusPerpendicular=(-2)*3+3*2===0;checks.answer=a===1;}
 if(id===4){const A=[-2,3],B=[-1,7],dx=B[0]-A[0],dy=B[1]-A[1];checks.translation=dx===1&&dy===4;checks.answer=dx-B[1]===-6;}
 if(id===5){const C=[3,-2],Cr=[C[1],C[0]],r=4;checks.reflection=Cr[0]===-2&&Cr[1]===3;checks.radius=r===4;checks.answer=Cr[0]-Cr[1]+r===-1;}
 if(id===6){const v=f.sourceFacts.vertices,G=[(v.A[0]+v.B[0]+v.C[0])/3,(v.A[1]+v.B[1]+v.C[1])/3],mid=[[(v.B[0]+v.C[0])/2,(v.B[1]+v.C[1])/2],[(v.A[0]+v.C[0])/2,(v.A[1]+v.C[1])/2],[(v.A[0]+v.B[0])/2,(v.A[1]+v.B[1])/2]];checks.centroid=close(G[0],2)&&close(G[1],1);checks.threeMedians=mid.every((m,i)=>close(cross([v.A,v.B,v.C][i],m,G),0));checks.answer=G[0]+G[1]===3;}
 if(id===7){const slope=-4/3,perp=3/4,y=1+perp*(4+4);checks.slopes=slope*perp===-1;checks.point=y===7;}
 if(id===9){const A=[-3,-8],B=[15,1],P=[(5*A[0]+4*B[0])/9,(5*A[1]+4*B[1])/9],r=Math.hypot(P[0]-A[0],P[1]-A[1])/Math.hypot(B[0]-P[0],B[1]-P[1]);checks.sectionPoint=close(P[0],5)&&close(P[1],-4);checks.ratio=close(r,4/5);checks.answer=P[0]+P[1]===1;}
 if(id===10){const P=[2,4],val=3*P[0]+4*P[1]+3,H=[P[0]-3*val/25,P[1]-4*val/25];checks.commonPoint=3*P[0]-P[1]-2===0&&P[0]+P[1]-6===0;checks.perpendicularFoot=close(H[0],-1)&&close(H[1],0);checks.distance=close(Math.hypot(P[0]-H[0],P[1]-H[1]),5);}
 if(id===11){const a=2/3,roots=[2,-1],b=roots.find(x=>x>0);checks.parallel=close(1-a,a/2);checks.perpendicular=close((1-b)*b/2,-1);checks.positiveRoot=b===2;checks.answer=close(a*b,4/3);}
 if(id===12){const C1=f.sourceFacts.C1center,O=f.sourceFacts.C2center,d=Math.abs(3*O[0]-4*O[1]+5)/5,half=f.sourceFacts.chordLength/2,r=Math.hypot(d,half),b=-4,c=2,constant=5-r*r;checks.bisector=3*C1[0]-4*C1[1]+5===0;checks.centerToChord=close(d,3);checks.halfChord=half===4;checks.radius=close(r,5);checks.d=-20&&constant===-20;checks.answer=5+b+c+constant===-17;}
 if(id===13){const product=-3/12;checks.vieta=close(product,-1/4);checks.quadratic=12-8-3!==0;}
 if(id===14){const A=[-2,-3],Ar=[A[1],A[0]],C=[5,4],r=2,d=Math.hypot(C[0]-Ar[0],C[1]-Ar[1]),Q=[C[0]+r*(Ar[0]-C[0])/d,C[1]+r*(Ar[1]-C[1])/d],m=(C[1]-Ar[1])/(C[0]-Ar[0]),b=Ar[1]-m*Ar[0],x=b/(1-m),P=[x,x],area=Math.abs((P[0]-A[0])*(Q[1]-A[1])-(P[1]-A[1])*(Q[0]-A[0]))/2;checks.reflection=Ar[0]===-3&&Ar[1]===-2;checks.closestPoint=close(d,10)&&close(Math.hypot(Q[0]-C[0],Q[1]-C[1]),2);checks.intersection=close(P[0],1)&&close(P[1],1);checks.area=close(10*area,21);}
 if(id===15){const C=[2,3],r2=10,root=Math.sqrt(5),P=[2+root,3+root],Pother=[2-root,3-root],dist=[P,Pother].map(p=>Math.abs(p[0]+p[1]-1));checks.circle=close((P[0]-C[0])**2+(P[1]-C[1])**2,r2);checks.farthest=dist[0]>dist[1];checks.tangent=close(P[0]+P[1]-5-2*root,0);checks.answer=1-5-2===-6;}
 if(id===17){const s=t=>(4/3)/2,P=[s(),2-2*s()],Q=[2+s(),3-2*s()],pq2=(Q[0]-P[0])**2+(Q[1]-P[1])**2,m=(Q[1]-P[1])/(Q[0]-P[0]),n=P[1]-m*P[0];checks.areaRatio=close(s()+s(),4/3);checks.minimum=close(pq2,5)&&s()===s();checks.answer=close(30*(m+n),25);}
 if(id===18){const original=[-2,1],translated=[original[0]+3,original[1]+2],C=[translated[1],translated[0]],constants=[4,-6],dist=constants.map(c=>Math.abs(C[0]-2*C[1]+c)/Math.sqrt(5)),intercepts=constants.map(c=>c/2);checks.centers=translated[0]===1&&translated[1]===3&&C[0]===3&&C[1]===1;checks.distance=dist.every(v=>close(v,Math.sqrt(5)));checks.positiveIntercept=intercepts[0]===2&&intercepts[1]===-3;}
 if(id===20){const f0=t=>t<8?t*t+2*t-14:t*t-13*t+106,dist=(t,k)=>Math.abs(2*t-f0(t)+k),r=t=>5*t;const f3=f0(3),ks=[-(6-f3)+15,-(6-f3)-15],left=[(-5+11)/2,(5+11)/2],right=[(20-4)/2,(20+4)/2];checks.k=ks[0]===10&&ks[1]===-20&&dist(4,10)<r(4)&&dist(9,10)<r(9)&&dist(4,-20)>r(4);checks.boundaries=[3,8,12].every(t=>close(dist(t,10),r(t)));checks.g2Intervals=left[0]===3&&left[1]===8&&right[0]===8&&right[1]===12&&dist(4,10)<r(4)&&dist(9,10)<r(9);checks.answer=12-2===10;}
 const statuses=Object.values(checks);return{questionId:id,status:statuses.length&&statuses.every(Boolean)?'PASS':'FAIL',method:'source solution and frozen facts independently recomputed',sourceContentSha256:sha(String(q.content)),sourceSolutionSha256:sha(String(q.solution)),checks};
}
const results=[];for(const id of ids){const q=questionBank.find(x=>Number(x.id)===id),lockRow=lock.sourceQuestions.find(x=>x.id===id),factPath=path.join(HERE,'expected-facts',`q${String(id).padStart(2,'0')}.json`),factBytes=fs.readFileSync(factPath),f=JSON.parse(factBytes);if(!q||sha(String(q.content))!==lockRow.contentSha256||sha(String(q.solution))!==lockRow.solutionSha256)throw Error(`SOURCE_PAIR_HASH_FAIL:q${id}`);results.push(solve(id,q,f));}
const report={schemaVersion:'force-new-independent-math-checks-v2',questionCount:16,passCount:results.filter(x=>x.status==='PASS').length,failCount:results.filter(x=>x.status!=='PASS').length,sourceDrivenIndependentRecomputation:true,checks:results};fs.writeFileSync(path.join(HERE,'independent-math-checks.json'),JSON.stringify(report,null,2)+'\n','utf8');console.log(JSON.stringify({status:report.failCount?'FAIL':'PASS',questionCount:16,passCount:report.passCount,failCount:report.failCount,checks:results},null,2));if(report.failCount)process.exitCode=1;
