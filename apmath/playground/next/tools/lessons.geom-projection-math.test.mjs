// Independently derive lengths, areas and plane angles from the native source
// coordinates and problem conditions. No screenshot or visual QA claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/projection-lesson-runtime.mjs';
const { api } = await load({ sourceOnly: true });
const near = (a, b, msg = '') => assert.ok(Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} ≈ ${b}`);
const sub = (a,b) => ({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const add = (a,b) => ({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
const scale = (a,t) => ({x:a.x*t,y:a.y*t,z:a.z*t});
const dot = (a,b) => a.x*b.x+a.y*b.y+a.z*b.z;
const cross = (a,b) => ({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const norm = a => Math.hypot(a.x,a.y,a.z), distance = (a,b) => norm(sub(a,b));
const normal = (a,b,c) => cross(sub(b,a),sub(c,a));
const area = (a,b,c) => norm(normal(a,b,c))/2;
const cosNormals = (a,b) => Math.abs(dot(a,b))/(norm(a)*norm(b));
const floor = p => ({x:p.x,y:0,z:p.z});
const polygon = ps => norm(ps.reduce((sum,p,i) => add(sum,cross(p,ps[(i+1)%ps.length])),{x:0,y:0,z:0}))/2;
const midpoint = (a,b) => scale(add(a,b),.5);
const rad = degrees => degrees*Math.PI/180;

test('mode1: height 3 and area 12 follow from actual right sections; only one direction contracts', () => {
  const first=api.first('mode1'),g=first.check;
  near(distance(g.B,g.C),8);near(distance(g.A,g.M),6);
  near(dot(sub(g.C,g.B),sub(g.A,g.M)),0);near(dot(sub(g.C,g.B),sub(g.Ap,g.M)),0);
  near(g.Ap.y,0);near(g.Ap.x,g.A.x);near(g.Ap.z,g.A.z);
  near(distance(g.Ap,g.M),3);near(first.check.height,3);
  near(area(g.B,g.C,g.A),24);near(area(g.B,g.C,g.Ap),12);near(first.check.ans,12);
  for(const theta of [0,30,60,75,85]){
    const q=api.geometry('mode1',{th:theta},true);
    near(distance(q.B,q.C),8);near(distance(q.A,q.M),6);
    near(distance(q.Ap,q.M),6*Math.cos(rad(theta)));
    near(area(q.B,q.C,q.Ap)/area(q.B,q.C,q.A),Math.cos(rad(theta)));
  }
});

test('mode2: cylinder and plane constraints give axes 12,6 and area 18π; inverse cosine has a strict boundary', () => {
  const first=api.first('mode2');
  for(const theta of [0,30,60,75,85]){
    const g=api.geometry('mode2',{th:theta},true),co=Math.cos(rad(theta));
    for(const [i,p]of g.ell.entries()){
      near(p.x*p.x+p.z*p.z,9);near(p.y,(p.x+3)*Math.tan(rad(theta)));
      near(g.base[i].x,p.x);near(g.base[i].z,p.z);near(g.base[i].y,0);
    }
    const major=distance(g.low,g.high),minor=distance(g.ell[20],g.ell[60]);
    near(major,6/co);near(minor,6);near(polygon(g.base)/polygon(g.ell),co);
    const center=midpoint(g.low,g.high),u=scale(sub(g.high,g.low),1/major),v={x:0,y:0,z:1};
    for(const p of g.ell){const q=sub(p,center);near((dot(q,u)/(major/2))**2+(dot(q,v)/(minor/2))**2,1);}
    if(theta===60){near(major,first.check.major);near(minor,first.check.minor);near(Math.PI*major*minor/4,18*Math.PI);near(first.check.ans,18*Math.PI);}
  }
  assert.ok(Math.cos(rad(85))>0);near(Math.cos(rad(90)),0);
});

test('mode3: the actual cube planes have cosine 1/√3 and their intersection is parallel to BD, not EG', () => {
  const g=api.first('mode3').check,n=normal(g.B,g.D,g.E),bottom=normal(g.E,g.F,g.H);
  for(const pair of [[g.B,g.D],[g.D,g.E],[g.E,g.B]])near(distance(...pair),4*Math.SQRT2);
  near(area(g.B,g.D,g.E),8*Math.sqrt(3));near(area(g.F,g.E,g.H),8);
  near(cosNormals(n,bottom),1/Math.sqrt(3));near(g.ans,1/Math.sqrt(3));
  const line=cross(n,bottom),bd=sub(g.D,g.B),eg=sub(g.G,g.E);
  near(norm(cross(line,bd)),0);assert.ok(norm(cross(line,eg))>1);
  near(dot(sub(g.M,g.E),bd),0);near(dot(sub(g.Mp,g.E),bd),0);
  near(distance(g.E,g.M),2*Math.SQRT2);near(distance(g.M,g.Mp),4);near(distance(g.E,g.Mp),2*Math.sqrt(6));
  near(distance(g.E,g.M)/distance(g.E,g.Mp),g.ans);
});

test('mode4: parallel-ray intersection and common perpendicular projection give the shadow formula', () => {
  for(const [board,sun]of [[30,60],[45,60],[10,30],[60,85]]){
    const g=api.geometry('mode4',{board,sun},true),n=g.ray,project=p=>sub(p,scale(n,dot(sub(p,g.center),n)));
    near(norm(n),1);
    for(const [i,p]of g.disk.entries()){
      const q=g.shadow[i];near(q.y,0);near(norm(cross(sub(q,p),n)),0);
      near(distance(project(p),project(q)),0);
    }
    const ratio=polygon(g.shadow)/polygon(g.disk),expected=Math.sin(rad(board+sun))/Math.sin(rad(sun));
    near(ratio,expected);near(Math.PI*g.r*g.r,12);
    near(polygon(g.disk.map(project)),polygon(g.shadow.map(project)));
    if(board===30){near(12*ratio,8*Math.sqrt(3));near(api.first('mode4').check.ans,12*ratio);}
    else if(board===45){assert.ok(Math.abs(12*ratio-12/Math.cos(rad(board)))>.1,'nonperpendicular rays cannot use the special inverse-cosine shortcut');}
  }
});

test('mode5: all 15 registered subtriangles divide their face into thirds and project by a separate third', () => {
  assert.equal(api.variants[5].length,15);
  for(const [i,v]of api.variants[5].entries()){
    const p=api.first('mode5',i),g=p.check;
    assert.equal(g.sub,v.sub);near(g.e,v.e);
    for(const [a,b]of [[g.A,g.B],[g.A,g.C],[g.A,g.D],[g.B,g.C],[g.B,g.D],[g.C,g.D]])near(distance(a,b),v.e);
    const centroid=scale(add(add(g.B,g.C),g.D),1/3);near(distance(g.G,centroid),0);
    const whole=area(g.B,g.C,g.D),parts=[[g.G,g.B,g.C],[g.G,g.C,g.D],[g.G,g.B,g.D]].map(ps=>area(...ps));
    for(const S of parts)near(S,whole/3);near(parts.reduce((a,b)=>a+b,0),whole);
    near(whole,v.e*v.e*Math.sqrt(3)/4);near(area(...g.triP),area(...g.tri)/3);
    near(cosNormals(normal(g.B,g.C,g.D),normal(g.A,g.B,g.C)),1/3);
    near(distance(g.O,g.M)/distance(g.D,g.M),1/3);near(distance(g.D,g.M),distance(g.A,g.M));
    near(area(...g.triP),p.check.ans);near(p.check.ans,(v.e/6)**2*Math.sqrt(3));
    for(const [j,P]of g.tri.entries())near(distance(g.triP[j],floor(P)),0);
  }
  near(api.first('mode5',0).check.ans,4*Math.sqrt(3));near(api.first('mode5',2).check.ans,Math.sqrt(3));near(api.first('mode5',3).check.ans,Math.sqrt(3));
  const g=api.geometry('mode5'),moving=g.tri.map((p,i)=>midpoint(p,g.triP[i]));
  assert.ok(Math.abs(area(...moving)-(area(...g.tri)+area(...g.triP))/2)>.1,'press progress is not a linear area ratio');
});

test('mode6: all 9 variants and moving N agree with actual plane normals and a right section', () => {
  const expected=[Math.sqrt(6)/3,Math.sqrt(6)/3,Math.sqrt(6)/3,Math.sqrt(6)/3,2*Math.SQRT2/3,2*Math.SQRT2/3,7/9,7/9,7/11];
  assert.equal(api.variants[6].length,expected.length);
  for(const [i,v]of api.variants[6].entries()){
    const g=api.first('mode6',i).check;
    near(distance(g.B,g.C),v.a);near(distance(g.C,g.N),v.cn);near(distance(g.P,midpoint(g.B,g.D)),0);
    near(dot(sub(g.C,g.P),sub(g.D,g.B)),0);near(dot(sub(g.N,g.P),sub(g.D,g.B)),0);
    near(dot(sub(g.N,g.C),sub(g.P,g.C)),0);
    const nc=normal(g.B,g.D,g.N),floorN=normal(g.B,g.D,g.C),co=cosNormals(nc,floorN);
    near(co,expected[i]);near(co,g.ans);near(area(g.B,g.D,g.C)/area(g.B,g.D,g.N),co);
    near(distance(g.N,g.P)**2,v.a*v.a/2+v.cn*v.cn);
  }
  let prev=2;
  for(const cn of [0,1,3,6]){
    const g=api.geometry('mode6',{cn},true),co=cosNormals(normal(g.B,g.D,g.N),normal(g.B,g.D,g.C));
    near(co,3*Math.SQRT2/Math.sqrt(18+cn*cn));assert.ok(co<prev);prev=co;
    if(cn===0)near(co,1);if(cn===6)near(co,1/Math.sqrt(3));
  }
});

test('mode7: both registered faces, moving feet and zero-area ACD projection satisfy orthogonality', () => {
  assert.equal(api.variants[7].length,12);
  for(const [i,v]of api.variants[7].entries()){
    const g=api.first('mode7',i).check,n=normal(g.A,g.B,g.M),cd=sub(g.D,g.C);
    assert.equal(g.face,v.face);near(g.e,v.e);
    near(distance(g.M,midpoint(g.C,g.D)),0);near(dot(cd,sub(g.M,g.A)),0);near(dot(cd,sub(g.M,g.B)),0);
    near(distance(g.Cp,g.M),0);near(distance(g.Dp,g.M),0);
    near(cosNormals(normal(g.A,g.B,g.X),n),Math.sqrt(6)/3);
    near(distance(g.A,g.M),v.e*Math.sqrt(3)/2);near(distance(g.K,g.M),v.e/Math.SQRT2);
    near(area(g.A,g.B,g.Xp),v.e*v.e*Math.SQRT2/4);near(g.ans,area(g.A,g.B,g.M));
  }
  near(api.first('mode7',0).check.ans,9*Math.SQRT2);near(api.first('mode7',2).check.ans,4*Math.SQRT2);
  let last=2;
  for(const mt of [0,25,50,75,100]){
    const g=api.geometry('mode7',{mt},true),n=normal(g.A,g.B,g.M),projection=P=>sub(P,scale(n,dot(sub(P,g.A),n)/dot(n,n)));
    near(distance(g.Cp,projection(g.C)),0);near(distance(g.Dp,projection(g.D)),0);
    const co=cosNormals(normal(g.A,g.B,g.C),n);assert.ok(co<last);last=co;
    near(area(g.A,g.B,g.Cp)/area(g.A,g.B,g.C),co);
    if(mt===50){near(co,Math.sqrt(6)/3);near(area(g.A,g.Cp,g.Dp),0);}
    else {assert.ok(area(g.A,g.Cp,g.Dp)>.1);if(mt!==0)assert.ok(distance(g.Cp,g.M)>.1);}
    if(mt===0)near(co,1);if(mt===100)near(co,1/3);
  }
});
