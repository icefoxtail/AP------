// Recompute the source problems and authored movements from distance geometry.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/hyperbola-lesson-runtime.mjs';
const lab=await load(),source=lab.api,math=source.math;
const near=(a,b,msg='')=>assert.ok(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${msg}: ${a} ≈ ${b}`);
const xy=p=>Array.isArray(p)?p:[p.x,p.y];
const distance=(a,b)=>{a=xy(a);b=xy(b);return Math.hypot(a[0]-b[0],a[1]-b[1]);};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],det=(a,b)=>a[0]*b[1]-a[1]*b[0];
const position=(a,b,y,branch=1)=>[branch*a*Math.sqrt(1+y*y/(b*b)),y];
const foot=(P,A,B,C=0)=>{const q=(A*P[0]+B*P[1]+C)/(A*A+B*B);return [P[0]-q*A,P[1]-q*B];};
function focal(id){const v=source.first(id),s=source.initial(id),P=position(v.a,v.b,s.py);return {...v,P,F:[v.c,0],Fp:[-v.c,0]};}
function tangent(a,b,y){
  const c=Math.hypot(a,b),P=position(a,b,y),n=[P[0]/(a*a),-P[1]/(b*b)],F=[c,0],Fp=[-c,0];
  const H1=foot(F,...n,-1),H2=foot(Fp,...n,-1),T=[a*a/P[0],0];
  return {a,b,c,P,n,F,Fp,H1,H2,T};
}

test('m1s1 first-source remaining focal distance is 5',()=>{
  const g=focal('m1s1');near(distance(g.P,g.Fp),g.d);near(distance(g.P,g.F),g.d-2*g.a);near(g.pf,5);
  near(distance(g.P,g.F),g.chk.pf);
});
test('m1s1 first-source perimeter includes the focal separation 2c',()=>{
  const g=focal('m1s1'),perimeter=distance(g.P,g.Fp)+distance(g.P,g.F)+distance(g.F,g.Fp);
  near(distance(g.F,g.Fp),10);near(perimeter,g.chk.per);near(perimeter,26);
});
test('m1s2 the right-angle intersection has area 16',()=>{
  const v=source.first('m1s2'),{a,b,c}=v,K=[a*Math.sqrt(a*a+2*b*b)/c,b*b/c],F=[c,0],Fp=[-c,0];
  near(K[0]**2/(a*a)-K[1]**2/(b*b),1);near(dot(sub(F,K),sub(Fp,K)),0);
  near(Math.abs(det(sub(F,K),sub(Fp,K)))/2,16);near(v.chk.S,16);
});
test('m1s3 the isosceles condition gives the remaining side 4 and perimeter 24',()=>{
  const g=focal('m1s3');near(distance(g.P,g.Fp),distance(g.F,g.Fp));near(distance(g.P,g.F),4);
  near(g.chk.pf,4);near(distance(g.P,g.Fp)+distance(g.P,g.F)+distance(g.F,g.Fp),g.chk.per);near(g.chk.per,24);
});
test('m2s1 the distance from the focus to its asymptote is b=4',()=>{
  const v=source.first('m2s1'),F=[v.c,0],H=foot(F,v.b,-v.a);
  near(v.b*H[0]-v.a*H[1],0);near(dot(sub(F,H),[v.a,v.b]),0);near(distance(F,H),v.chk.fh);near(distance(F,H),4);
});
test('m2s1 OH=a=3 follows from congruent right triangles',()=>{
  const v=source.first('m2s1'),O=[0,0],F=[v.c,0],H=foot(F,v.b,-v.a),A=[v.a,0],V=[v.a,v.b];
  near(distance(O,V),distance(O,F));near(distance(O,A),distance(O,H));near(distance(A,V),distance(H,F));
  near(distance(O,H),v.chk.oh);near(distance(O,H),3);
});
test('m2s2 a=b gives perpendicular asymptotes and eccentricity √2',()=>{
  const v=source.first('m2s2'),a=v.a,b=a,c=Math.hypot(a,b);
  near(dot([a,b],[a,-b]),0);near(Math.acos(dot([a,b],[a,-b])/(c*c))*180/Math.PI,v.chk.ang);near(c/a,Math.SQRT2);
  assert.ok(source.question('m2s2').includes('이심률'),'the preserved first problem asks eccentricity, not a later variant target');
});
test('m2s3 tangent-asymptote triangle area is 12 and radial product is 25',()=>{
  const v=source.first('m2s3'),{a,b}=v,P=[a*Math.cosh(.75),b*Math.sinh(.75)],n=[P[0]/(a*a),-P[1]/(b*b)];
  const t1=1/dot(n,[a,b]),t2=1/dot(n,[a,-b]),M1=[t1*a,t1*b],M2=[t2*a,-t2*b];
  near(dot(n,M1),1);near(dot(n,M2),1);near(Math.abs(det(M1,M2))/2,v.chk.S);near(v.chk.S,12);
  near(Math.hypot(...M1)*Math.hypot(...M2),v.chk.p);near(v.chk.p,25);
});
test('m3s1 the two asymptote distances multiply to 144/25',()=>{
  const v=source.first('m3s1'),P=[v.a*Math.cosh(.7),v.b*Math.sinh(.7)];
  const Q1=foot(P,v.b,-v.a),Q2=foot(P,v.b,v.a),product=distance(P,Q1)*distance(P,Q2);
  near(product,v.chk.v);near(product,144/25);near(v.b*v.b*P[0]**2-v.a*v.a*P[1]**2,v.a*v.a*v.b*v.b);
});
test('m3s2 the parallel-sided quadrilateral has area ab/2=6',()=>{
  const v=source.first('m3s2'),{a,b}=v,P=[a*Math.cosh(.8),b*Math.sinh(.8)];
  const alpha=(P[0]/a+P[1]/b)/2,beta=(P[0]/a-P[1]/b)/2,R1=[alpha*a,alpha*b],R2=[beta*a,-beta*b];
  near(alpha*beta,.25);near(R1[0]+R2[0],P[0]);near(R1[1]+R2[1],P[1]);near(Math.abs(det(R1,R2)),v.chk.S);near(v.chk.S,6);
});
test('m3s3 equal vertex distances are 12/5 and their product is 144/25',()=>{
  const v=source.first('m3s3'),A=[v.a,0],Q1=foot(A,v.b,-v.a),Q2=foot(A,v.b,v.a);
  const l1=distance(A,Q1),l2=distance(A,Q2);near(l1,l2);near(l1,v.chk.l);near(l1,12/5);near(l1*l2,v.chk.pr);near(l1*l2,144/25);
});
test('m4s1 tangent bisects the inner angle and the focal base in ratio 2:1',()=>{
  const v=source.first('m4s1'),g=tangent(v.a,v.b,source.initial('m4s1').py);
  near(distance(g.P,g.Fp),v.d);near(distance(g.P,g.F),v.e);near(dot(g.n,g.T),1);
  const toT=sub(g.T,g.P),toF=sub(g.F,g.P),toFp=sub(g.Fp,g.P);
  near(dot(toT,toF)/(Math.hypot(...toT)*Math.hypot(...toF)),dot(toT,toFp)/(Math.hypot(...toT)*Math.hypot(...toFp)));
  near(distance(g.Fp,g.T)/distance(g.T,g.F),v.chk.r);near(v.chk.r,2);
});
test('m4s2 reflection and midpoint connection prove OH1=3',()=>{
  const v=source.first('m4s2'),g=tangent(v.a,v.b,source.initial('m4s2').py),Fs=[2*g.H1[0]-g.F[0],2*g.H1[1]];
  near(distance(g.P,Fs),distance(g.P,g.F));near(det(sub(Fs,g.P),sub(g.Fp,g.P)),0);
  near(distance(g.Fp,Fs),2*v.a);near(distance(g.Fp,Fs),v.chk.ff);
  near(Math.hypot(...g.H1),distance(g.Fp,Fs)/2);near(Math.hypot(...g.H1),v.chk.oh);near(v.chk.oh,3);
});
test('m4s3 focal tangent distances obey the external secant product 16',()=>{
  const v=source.first('m4s3'),g=tangent(v.a,v.b,source.initial('m4s3').py),Hp=g.H1.map(x=>-x);
  near(Math.hypot(...g.H1),v.a);near(Math.hypot(...g.H2),v.a);near(det(sub(Hp,g.Fp),sub(g.H2,g.Fp)),0);
  near(distance(g.Fp,Hp),distance(g.F,g.H1));assert.ok(g.c>g.a);
  const product=distance(g.F,g.H1)*distance(g.Fp,g.H2);near(product,(g.c-g.a)*(g.c+g.a));near(product,v.chk.d);near(product,16);
});
test('q5 both definitions and the distance ratio determine a²b²=20',()=>{
  const v=source.first('q5'),c=v.c,ratio=v.p/v.q,d=4*c/(ratio*ratio-1),y=Math.sqrt(2*c*d-c*c),P=[d,y],F=[c,0],Fp=[-c,0];
  near(distance(P,F),d);near(distance(P,Fp)/d,ratio);
  const a=(distance(P,Fp)-distance(P,F))/2,b2=c*c-a*a;
  near(a,v.a);near(b2,v.b2);near(P[0]**2/(a*a)-P[1]**2/b2,1);near(a*a*b2,v.ans);near(v.ans,20);
});
test('q6 the positive root and actual similar triangles give PF=9',()=>{
  const v=source.first('q6'),a=v.a,c=v.c;
  // (u+2a)(2u+2a)=4c² => 2u²+6au+4a²-4c²=0.
  const roots=[(-6*a+Math.sqrt(4*a*a+32*c*c))/4,(-6*a-Math.sqrt(4*a*a+32*c*c))/4];
  assert.ok(roots[0]>0&&roots[1]<0);near(roots[0],9);near(roots[0],v.u);
  const {P,F,Fp,Q}=v.g,u=distance(P,F),scale=distance(Q,Fp)/distance(F,Fp);
  near(distance(P,Q),u);near(det(sub(P,Fp),sub(Q,Fp)),0);
  near(scale,distance(F,Fp)/distance(P,Fp));near(scale,distance(Q,F)/distance(P,F));near(u,9);
});
test('q7 focus identification, exclusion of the ellipse and perimeter give 13',()=>{
  const v=source.first('q7'),m=v.m,a=Math.sqrt(5)/2,c=m/2,ch=m*Math.sqrt(1+a*a);
  near(2*Math.sqrt(c*c+m*m),m*Math.sqrt(5));near(ch,c+m);near(2*ch,v.AB);
  assert.ok(m*(Math.sqrt(5)+3)/2<3*m&&3*m<v.L,'QB cannot occur on the ellipse');
  const QA=v.L-2*m,y=(v.L*v.L-QA*QA)/(4*ch),Q=[Math.sqrt(v.L*v.L-(y+ch)**2),y],A=[0,ch],B=[0,-ch];
  assert.ok(Q[0]>0&&Q[1]>m);near(Q[1]**2/(m*m)-Q[0]**2/(a*a*m*m),1);
  near(distance(Q,A),QA);near(distance(Q,B),v.L);near(QA+v.L+2*ch,v.ans);near(v.ans,13);
});

test('moving focal-distance concepts keep the absolute difference and swap its sign on the left',()=>{
  for(const branch of [1,-1])for(const y of [4,5,5.5]){
    const a=3,b=4,P=position(a,b,y,branch),far=distance(P,[-5,0]),nearF=distance(P,[5,0]);
    near(Math.abs(far-nearF),2*a);assert.equal(Math.sign(far-nearF),branch);
    const g=math.geometry(a,b,{x:P[0],y:P[1]});near(g.focusDiff,6);near(g.focalFp,far);near(g.focalP,nearF);
  }
});
test('the diameter-circle concept singles out the right-angle intersections',()=>{
  const a=3,b=4,c=5,x2=a*a*(a*a+2*b*b)/(c*c),y2=b**4/(c*c);
  near(x2+y2,c*c);near(x2/(a*a)-y2/(b*b),1);
  for(const sx of [-1,1])for(const sy of [-1,1]){const K=[sx*Math.sqrt(x2),sy*Math.sqrt(y2)];near(dot(sub([c,0],K),sub([-c,0],K)),0);}
});
test('perpendicular asymptotes require a=b for positive parameters',()=>{
  const a=3;for(const b of [4,3.5,3]){
    const value=dot([a,b],[a,-b]);near(value,a*a-b*b);assert.equal(Math.abs(value)<1e-9,b===a);
    const g=math.geometry(a,b,{x:position(a,b,2.3)[0],y:2.3});near(g.angle,Math.acos(Math.abs(value)/(a*a+b*b))*180/Math.PI);
  }
});
test('moving contact points bisect the tangent segment between asymptotes',()=>{
  for(const y of [2,3,3.5]){
    const a=3,b=4,P=position(a,b,y),g=math.geometry(a,b,{x:P[0],y:P[1]});
    near((g.M1.x+g.M2.x)/2,P[0]);near((g.M1.y+g.M2.y)/2,P[1]);near(distance(g.M1,g.P),distance(g.P,g.M2));
    near(g.M1.y,b/a*g.M1.x);near(g.M2.y,-b/a*g.M2.x);
  }
});
test('the moving tangent intercept is a²/xP and lies between the foci',()=>{
  let prior=Infinity;for(const y of [3,4,5]){
    const g=tangent(3,4,y);near(dot(g.n,g.T),1);near(g.T[0]*g.P[0],9);assert.ok(g.T[0]>0&&g.T[0]<g.c&&g.T[0]<prior);prior=g.T[0];
    const actual=math.geometry(3,4,{x:g.P[0],y:g.P[1]});near(actual.T.x,g.T[0]);
  }
});
test('the moving focal foot remains on the circle of radius a',()=>{
  for(const y of [3,4,5]){
    const g=tangent(3,4,y);near(g.H1[0]**2+g.H1[1]**2,9);near(dot(g.n,g.H1),1);near(dot(sub(g.F,g.H1),sub(g.P,g.T)),0);
  }
});
test('q5 moving P changes its hyperbola while preserving the two appropriate definitions',()=>{
  const values=[];for(const y of [5,5.5,6]){
    const g=math.geoH5(4,y),{P,F,Fp,H,a,bh}=g;near(distance(P,F),distance(P,H));near(distance(P,Fp)-distance(P,F),2*a);
    near(P[1]**2,8*P[0]-16);near(P[0]**2/(a*a)-P[1]**2/(bh*bh),1);values.push(a);
  }
  assert.ok(values[0]!==values[2],'the concept does not claim one fixed hyperbola during this movement');
});
test('q6 constructed R and Q encode difference and sum without assuming similarity',()=>{
  for(const y of [3.5,4.2,5]){
    const g=math.geoH6y(2.5,6,y);near(distance(g.P,g.R),distance(g.P,g.F));near(distance(g.P,g.Q),distance(g.P,g.F));
    near(det(sub(g.R,g.Fp),sub(g.Q,g.Fp)),0);near(distance(g.Fp,g.R),5);
    near(distance(g.Fp,g.Q),distance(g.P,g.Fp)+distance(g.P,g.F));
  }
  const g=math.geoH6y(2.5,6,3.5);assert.ok(Math.abs(g.PFp*g.FpQ-144)>1,'arbitrary exploratory P does not satisfy the extra similarity condition');
});
test('q7 moving through |y|=1 changes the applicable foci continuously',()=>{
  const a=Math.sqrt(5)/2;
  for(const y of [.5,1,1.3,1.6]){
    const g=math.geoH7(a,1,y,1),{P}=g;near(Math.abs(P[1]**2-1),P[0]**2/(a*a));
    if(y<=1){near(distance(P,g.C)+distance(P,g.D),2*a);assert.equal(g.ell,true);}
    else{near(distance(P,g.B)-distance(P,g.A),2);assert.equal(g.ell,false);}
  }
});
