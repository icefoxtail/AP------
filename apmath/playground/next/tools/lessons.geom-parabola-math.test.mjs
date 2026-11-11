// Recompute source answers from the conditions and elementary distance/algebra.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/parabola-lesson-runtime.mjs';
const lab=await load(),source=lab.api,math=source.math;
const near=(a,b,msg='')=>assert.ok(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${msg}: ${a} ≈ ${b}`);
const xy=p=>Array.isArray(p)?p:[p.x,p.y];
const distance=(a,b)=>{a=xy(a);b=xy(b);return Math.hypot(a[0]-b[0],a[1]-b[1]);};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
function chord(p,degrees){
  const angle=degrees*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
  const a=2*p/(1-c),b=2*p/(1+c);
  return {A:[p+a*c,a*s],B:[p-b*c,-b*s],F:[p,0],a,b,angle};
}
function tangentShape(p,x){
  const y=Math.sqrt(4*p*x),P=[x,y],F=[p,0],H=[-p,y],T=[-x,0],K=[0,y/2];
  return {p,x,y,P,F,H,T,K};
}

test('m1s1 coordinate: PF=6 and the focus-directrix definition give x=4',()=>{
  const v=source.first('m1s1'),{p,d}=v.q,x=d-p,y=Math.sqrt(4*p*x);
  near(distance([x,y],[p,0]),d);near(x,v.val[0]);near(x,4);near(y,v.st.py);
});
test('m1s1 perimeter: the third side is 4√3',()=>{
  const v=source.first('m1s1'),{p,d}=v.q,x=d-p,y=Math.sqrt(4*p*x),P=[x,y],F=[p,0],H=[-p,y];
  near(distance(F,H)**2,4*p*d);near(distance(P,F)+distance(P,H)+distance(F,H),v.val[1]);near(v.val[1],12+4*Math.sqrt(3));
});
test('m1s2 equilateral condition gives x=3p and all three sides 4p',()=>{
  const v=source.first('m1s2'),p=v.q.p;
  // (x+p)^2=FH²=4p²+4px => (x+p)(x-3p)=0; x≥0.
  const x=3*p,P=[x,Math.sqrt(4*p*x)],F=[p,0],H=[-p,P[1]];
  for(const d of [distance(P,F),distance(P,H),distance(F,H)])near(d,4*p);
  near(v.val[0],x);near(v.val[1],4*p);near(x,6);near(4*p,8);
});
test('m1s3 minimum and minimizer meet both triangle-inequality equality conditions',()=>{
  const v=source.first('m1s3'),{p,ax,ay}=v.q,A=[ax,ay],F=[p,0],P=[ay*ay/(4*p),ay];
  assert.ok(-p<=P[0]&&P[0]<=ax);near(distance(P,F)+distance(P,A),ax+p);
  for(const y of [-6,-2,0,2,4,6]){const Q=[y*y/(4*p),y];assert.ok(distance(Q,F)+distance(Q,A)>=ax+p-1e-9);}
  near(v.val[0],7);near(v.val[1],P[0]);near(v.val[2],P[1]);
});
test('m2s1 reciprocal lengths give b=8/3 and positive chord slope √3',()=>{
  const v=source.first('m2s1'),{p,a}=v.q,b=p*a/(a-p),c=(a-b)/(a+b),s=Math.sqrt(1-c*c),m=s/c;
  near(v.val[0],b);near(b,8/3);near(v.val[1],m);near(m,Math.sqrt(3));
  const A=[p+a*c,a*s],B=[p-b*c,-b*s];for(const P of [A,B])near(P[1]**2,4*p*P[0]);
  near((A[1]-B[1])/(A[0]-B[0]),m);
});
test('m2s2 a:b=2:1 determines both lengths and cosine independently',()=>{
  const v=source.first('m2s2'),{p,r}=v.q,b=p*(r+1)/r,a=r*b;
  near(1/a+1/b,1/p);near(v.val[0],a);near(v.val[1],b);near(v.val[2],(r-1)/(r+1));
  near(a,6);near(b,3);near((a-b)/(a+b),1/3);
});
test('m2s3 latus rectum and its directrix rectangle have lengths 8 and area 32',()=>{
  const v=source.first('m2s3'),p=v.q.p,A=[p,2*p],B=[p,-2*p];
  near(A[1]**2,4*p*A[0]);near(B[1]**2,4*p*B[0]);
  near(v.val[0],distance(A,B));near(v.val[1],distance(A,B)*2*p);near(v.val[0],8);near(v.val[1],32);
});
test('m3s1 a focal-chord diameter circle is tangent to the directrix',()=>{
  const v=source.first('m3s1'),p=v.q.p,a=v.q.a,b=p*a/(a-p),c=(a-b)/(a+b),s=Math.sqrt(1-c*c);
  const A=[p+a*c,a*s],B=[p-b*c,-b*s],M=[(A[0]+B[0])/2,(A[1]+B[1])/2];
  const R=distance(A,B)/2,d=M[0]+p;near(R,d);near(R,v.val[0]);near(R,16/3);
});
test('m3s2 tangent intersection is (-2,4√3/3) and satisfies both tangent equations',()=>{
  const v=source.first('m3s2'),{p,deg}=v.q,g=chord(p,deg),Q=[-p,(g.A[1]+g.B[1])/2];
  for(const P of [g.A,g.B])near(P[1]*Q[1],2*p*(Q[0]+P[0]));
  near(Q[0],v.val[0]);near(Q[1],v.val[1]);near(Q[1],4*Math.sqrt(3)/3);
});
test('m3s2 the two tangent rays are perpendicular at Q',()=>{
  const {p,deg}=source.first('m3s2').q,g=chord(p,deg),Q=[-p,(g.A[1]+g.B[1])/2];
  near(dot(sub(g.A,Q),sub(g.B,Q)),0);near((2*p/g.A[1])*(2*p/g.B[1]),-1);
});
test('m3s2 QF is perpendicular to the focal chord at F',()=>{
  const {p,deg}=source.first('m3s2').q,g=chord(p,deg),Q=[-p,(g.A[1]+g.B[1])/2];
  near(dot(sub(Q,g.F),sub(g.A,g.B)),0);near((Q[1]/(Q[0]-p))*Math.tan(g.angle),-1);
});
test('m3s3 slope 1 makes the focal-chord circle radius 8',()=>{
  const v=source.first('m3s3'),g=chord(v.q.p,v.q.deg);
  near((g.A[1]-g.B[1])/(g.A[0]-g.B[0]),1);near(distance(g.A,g.B)/2,v.val[0]);near(v.val[0],8);
});
test('m4s1 four equal sides give perimeter 20 and perpendicular diagonals',()=>{
  const v=source.first('m4s1'),g=tangentShape(v.q.p,v.q.x1),vertices=[g.T,g.F,g.P,g.H];
  const sides=vertices.map((P,i)=>distance(P,vertices[(i+1)%4]));for(const s of sides)near(s,5);
  near(sides.reduce((a,b)=>a+b,0),v.val[0]);near(dot(sub(g.P,g.T),sub(g.H,g.F)),0);near(v.val[1],90);
});
test('m4s2 tangent slope 1 makes a square of side 4 and area 16',()=>{
  const v=source.first('m4s2'),p=v.q.p,y=2*p,x=y*y/(4*p),g=tangentShape(p,x);
  near(2*p/y,1);const vertices=[g.T,g.F,g.P,g.H];
  for(let i=0;i<4;i++){near(distance(vertices[i],vertices[(i+1)%4]),4);near(dot(sub(vertices[(i+1)%4],vertices[i]),sub(vertices[(i+3)%4],vertices[i])),0);}
  near(distance(g.T,g.F)**2,v.val[0]);near(v.val[0],16);
});
test('m4s3 the pedal point is on the tangent and its focal normal',()=>{
  const v=source.first('m4s3'),g=tangentShape(v.q.p,v.q.x1);
  near(g.y*g.K[1],2*g.p*(g.K[0]+g.x));near(dot(sub(g.K,g.F),sub(g.P,g.T)),0);
  near(g.K[0],0);near(g.K[1],v.val[0]);near(g.K[1],2*Math.sqrt(3));
});
test('m4s3 focal distance and its square agree with similarity and distance formula',()=>{
  const v=source.first('m4s3'),g=tangentShape(v.q.p,v.q.x1),FK=distance(g.F,g.K),FP=distance(g.F,g.P);
  near(FK,4);near(FK,v.val[1]);near(FK*FK,16);near(FK*FK,v.val[2]);near(FK*FK,g.p*FP);
  near(g.p/FK,FK/FP);
});
test('q5 solves the shared-focus original using both conic definitions',()=>{
  const v=source.first('q5'),cos=v.n/v.d,c=v.a/(1+2*cos),r=2*v.a-2*c;
  const P=[c-r*cos,r*Math.sqrt(1-cos*cos)],F=[c,0],Fp=[-c,0],k=r-P[0];
  near(distance(P,F)+distance(P,Fp),2*v.a);near(distance(P,Fp),distance(F,Fp));
  near(dot(sub(Fp,F),sub(P,F))/(distance(Fp,F)*distance(P,F)),cos);
  near(distance(P,F),P[0]+k);near(c,v.c);near(k,v.k);near(c+k,v.ans);near(v.ans,5);
});
test('q6 original minimizer and ellipse extrema give M²+m²=26',()=>{
  const v=source.first('q6'),{p,k}=v,P0=[k*k/(4*p)-p,0],O=[0,0],A=[0,k];
  assert.ok(-2*p<P0[0]&&P0[0]<0);near(distance(O,P0)+distance(P0,A),2*p);near(P0[0],v.x0);
  const M=k/2+p,m=k/2-p;near(v.M,M);near(v.m,m);
  for(const Q of [[0,M],[0,m]])near(distance(O,Q)+distance(Q,A),2*p);
  near(M*M+m*m,v.ans);near(v.ans,26);
});

test('moving definition and equality-availability concepts retain the exact hypotheses',()=>{
  const p=2;for(const y of [4,5,5.5,6]){const P=[y*y/(4*p),y];near(distance(P,[p,0]),P[0]+p);}
  const A=[1.5,4],Pstar=[2,4],F=[2,0];assert.ok(Pstar[0]>A[0]);
  near(A[0]+p,3.5);near(distance(Pstar,F)+distance(Pstar,A),4.5);
  // Equality in AH>=3.5 forces y=4, whose unique parabola point is outside HA.
  // Therefore 3.5 is a valid lower bound but cannot be attained.
  assert.ok(distance(Pstar,F)+distance(Pstar,A)>A[0]+p);
});
test('authored chord rotations obey the reciprocal, cosine and shortest-chord identities',()=>{
  for(const degrees of [60,70.52877936550931,75,90]){
    const p=2,g=math.getFocalChordPoints(p,degrees*Math.PI/180),independent=chord(p,degrees);
    near(g.a,independent.a);near(g.b,independent.b);
    for(const P of [g.A,g.B])near(P.y**2,4*p*P.x);
    near(1/g.a+1/g.b,1/p);near((g.a-g.b)/(g.a+g.b),Math.cos(degrees*Math.PI/180));
    near(distance(g.A,g.B),4*p/Math.sin(degrees*Math.PI/180)**2);assert.ok(distance(g.A,g.B)>=4*p-1e-9);
    if(degrees===90)near(distance(g.A,g.B),4*p);
  }
});
test('moving tangent, rhombus and pedal-locus concepts preserve their geometry',()=>{
  for(const y of [4,5,5.5]){
    const p=2,x=y*y/(4*p),g=tangentShape(p,x),m=2*p/y;
    near(g.P[1]-m*g.P[0],-m*g.T[0]);near(g.K[0],0);near(g.K[1],y/2);
    const points=[g.T,g.F,g.P,g.H];for(let i=0;i<4;i++)near(distance(points[i],points[(i+1)%4]),x+p);
    near(dot(sub(g.P,g.T),sub(g.H,g.F)),0);near(distance(g.F,g.K)**2,p*(x+p));
  }
});
test('q5 moving point keeps both definitions without importing the original isosceles condition',()=>{
  for(const degrees of [60,70,80]){
    const a=5,c=3,b=4,P=[a*Math.cos(degrees*Math.PI/180),b*Math.sin(degrees*Math.PI/180)],g=math.geo5(a,c,P);
    near(P[0]*P[0]/(a*a)+P[1]*P[1]/(b*b),1);near(distance(P,g.F)+distance(P,g.Fp),10);
    near(distance(P,g.F),distance(P,g.Q));near(P[1]**2,4*g.pp*(P[0]-g.vx));assert.ok(g.pp>0);
  }
});
test('translated focus and minimum-path concepts obey 0<k<2p',()=>{
  const p=3,k=4;assert.ok(0<k&&k<2*p);
  for(const y of [2,1,0]){
    const g=math.geo6(p,k,y);near((g.P[1]-k)**2,4*p*(g.P[0]+p));near(distance(g.P,g.A),distance(g.P,g.H));
    assert.ok(distance(g.O,g.P)+distance(g.P,g.A)>=2*p-1e-9);
    if(y===0)near(distance(g.O,g.P)+distance(g.P,g.A),6);
  }
  near(-p+p,0);near(-p-p,-6);near(k,4);
});
