// Independent Euclidean checks on the actual source coordinates and 3D draws.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/space-lesson-runtime.mjs';
const lab=await load(),M=lab.api.math;
const V=(x,y,z)=>({x,y,z}),sub=(a,b)=>V(a.x-b.x,a.y-b.y,a.z-b.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>V(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const norm=a=>Math.hypot(a.x,a.y,a.z),dist=(a,b)=>norm(sub(a,b));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const point=(a,b)=>{for(const k of ['x','y','z'])close(a[k],b[k]);};
const cosine=(o,a,b)=>dot(sub(a,o),sub(b,o))/(dist(a,o)*dist(b,o));
const g1=M.geometryAt(1),g3=M.geometryAt(3),g4=M.geometryAt(4);

test('both original tetrahedral drawings have six equal edges of length six',()=>{
  for(const g of [g1,g3])for(const [a,b] of ['AB','AC','AD','BC','BD','CD'])close(dist(g[a],g[b]),6);
});
test('opposite tetrahedron edges are perpendicular as directions although they do not intersect',()=>{
  const ab=sub(g1.B,g1.A),cd=sub(g1.D,g1.C),w=sub(g1.C,g1.A),n=cross(ab,cd);
  close(dot(ab,cd),0);assert.ok(Math.abs(dot(w,n))>1);
  close(dot(sub(g1.A,g1.M),cd),0);close(dot(sub(g1.B,g1.M),cd),0);
});
test('midpoint common perpendicular equals the independently computed skew-line distance',()=>{
  point(g1.N,V((g1.A.x+g1.B.x)/2,(g1.A.y+g1.B.y)/2,(g1.A.z+g1.B.z)/2));
  point(g1.M,V((g1.C.x+g1.D.x)/2,(g1.C.y+g1.D.y)/2,(g1.C.z+g1.D.z)/2));
  const mn=sub(g1.N,g1.M),ab=sub(g1.B,g1.A),cd=sub(g1.D,g1.C),n=cross(ab,cd);
  close(dot(mn,ab),0);close(dot(mn,cd),0);close(norm(mn),3*Math.SQRT2);
  close(Math.abs(dot(sub(g1.C,g1.A),n))/norm(n),norm(mn));
});
test('camera rotation changes projected angles while leaving all source 3D coordinates invariant',()=>{
  const a=M.projPt({yaw:.2,pitch:.4},g1.A),b=M.projPt({yaw:1,pitch:.1},g1.A);
  assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>1);point(M.geometryAt(1).A,g1.A);
  close(dot(sub(g1.B,g1.A),sub(g1.D,g1.C)),0);
});
test('original double-Pythagoras lengths and right vertices match the source question',()=>{
  const g=M.geometryAt(2);close(dist(g.P,g.O),4);close(dist(g.O,g.H),3);close(dist(g.P,g.A),7);
  close(dot(sub(g.P,g.O),sub(g.H,g.O)),0);close(dot(sub(g.P,g.H),sub(g.A,g.H)),0);
  close(dist(g.P,g.H),5);close(dist(g.A,g.H),2*Math.sqrt(6));
});
test('varying the original height keeps perpendiculars but does not keep PA equal to seven',()=>{
  for(const h of [1.5,2,4,6]){
    const g=M.geometryAt(2,{h2:h}),line=sub(g.A,g.H);
    close(dot(sub(g.O,g.H),line),0);close(dot(sub(g.P,g.H),line),0);
    close(dist(g.P,g.H)**2,h*h+9);close(dist(g.P,g.A)**2,h*h+33);close(dist(g.A,g.H)**2,24);
  }
});
test('dihedral section vectors are perpendicular to the common edge and have cosine one-third',()=>{
  const bc=sub(g3.C,g3.B);close(dot(sub(g3.A,g3.M),bc),0);close(dot(sub(g3.D,g3.M),bc),0);
  close(dist(g3.A,g3.M),3*Math.sqrt(3));close(dist(g3.D,g3.M),3*Math.sqrt(3));
  close(cosine(g3.M,g3.A,g3.D),1/3);
});
test('the regular tetrahedron altitude lands on the base centroid and has length two-root-six',()=>{
  const c=V((g3.D.x+g3.B.x+g3.C.x)/3,(g3.D.y+g3.B.y+g3.C.y)/3,(g3.D.z+g3.B.z+g3.C.z)/3);
  point(g3.G,c);close(dist(g3.A,g3.G),2*Math.sqrt(6));close(dist(g3.G,g3.M),Math.sqrt(3));
});
test('folding preserves triangle altitudes but not the centroid claim or cosine sign',()=>{
  for(const theta of [20,60,90,120,150]){
    const g=M.geometryAt(3,{th:theta}),a=theta*Math.PI/180,L=3*Math.sqrt(3);
    close(dist(g.A,g.M),L);close(dist(g.D,g.M),L);close(dist(g.A,g.G),L*Math.sin(a));
    close(g.G.x-g.M.x,L*Math.cos(a));close(cosine(g.M,g.A,g.D),Math.cos(a));
    if(theta===90)point(g.G,g.M);if(theta>90)assert.ok(g.G.x<g.M.x);
  }
});
test('the cuboid source satisfies all three original cosine targets and their product',()=>{
  close(dist(g4.E,g4.F),3);close(dist(g4.F,g4.G),4);close(dist(g4.A,g4.E),5);close(dist(g4.A,g4.G),5*Math.SQRT2);
  const beta=cosine(g4.G,g4.A,g4.E),gamma=cosine(g4.G,g4.E,g4.H),alpha=cosine(g4.G,g4.A,g4.H);
  close(beta,1/Math.SQRT2);close(gamma,3/5);close(alpha,3/(5*Math.SQRT2));close(alpha,beta*gamma);
});
test('each cube edge has four meeting three parallel four skew other edges from independent coordinates',()=>{
  for(const edge of M.CUBE_EDGES){
    const d=sub(M.CUBE[edge[1]],M.CUBE[edge[0]]),counts={meet:0,par:0,skew:0};
    for(const other of M.CUBE_EDGES){
      if([...edge].sort().join('')===[...other].sort().join(''))continue;
      const v=sub(M.CUBE[other[1]],M.CUBE[other[0]]);
      if([...edge].some(k=>other.includes(k)))counts.meet++;
      else if(norm(cross(d,v))<1e-8)counts.par++;
      else{assert.ok(Math.abs(dot(sub(M.CUBE[other[0]],M.CUBE[edge[0]]),cross(d,v)))>1);counts.skew++;}
    }
    assert.deepEqual(counts,{meet:4,par:3,skew:4});
    const actual=M.lists5(edge);for(const k of Object.keys(counts))assert.equal(actual[k].length,counts[k]);
  }
  const first=lab.api.first('mode5');assert.equal(first.edge,'AB');assert.equal(first.X,4);assert.equal(first.Y,2);assert.equal(first.val,6);
});
test('exactly two faces have a normal parallel to any selected cube edge',()=>{
  const faces=['ABCD','EFGH','ABFE','BCGF','CDHG','DAEH'];
  for(const edge of M.CUBE_EDGES){
    const d=sub(M.CUBE[edge[1]],M.CUBE[edge[0]]);let count=0;
    for(const f of faces){const p=M.CUBE[f[0]],n=cross(sub(M.CUBE[f[1]],p),sub(M.CUBE[f[2]],p));if(norm(cross(n,d))<1e-8)count++;}
    assert.equal(count,2);assert.equal(M.lists5(edge).perp.length,2);
  }
});
test('actual native three-point exploration loses a plane direction exactly when R reaches PQ',()=>{
  for(const rv of [-1.2,0,1.7]){
    lab.go('mode5');Object.assign(lab.s,{k5:'pts',rv});const f=lab.draw();
    const get=n=>f.space.find(q=>(q.name==='point'||q.name==='handle')&&q.options.label===n).points[0];
    const p=get('P'),q=get('Q'),r=get('R'),area=norm(cross(sub(q,p),sub(r,p)));
    close(area/dist(q,p),Math.abs(rv));assert.equal(area<1e-8,rv===0);
  }
});
test('the skew pair AB CG cannot share a plane and the rotating plane can be parallel to CG',()=>{
  const c=M.CUBE,u=sub(c.B,c.A),v=sub(c.G,c.C);assert.ok(Math.abs(dot(sub(c.C,c.A),cross(u,v)))>1);
  assert.equal(M.skewInfo({phi:90}).par,true);
  for(const phi of [0,20,70,130])assert.equal(M.skewInfo({phi}).par,false);
});
test('the original square-pyramid projection gives both cosine and sine values',()=>{
  const first=lab.api.first('mode6'),g=M.pyrGeo(3,5);assert.equal(first.ask,'cos');close(first.ans.val,3*Math.SQRT2/5);
  close(dist(g.A,g.B),5);close(dist(g.B,g.C),6);close(dist(g.B,g.O),3*Math.SQRT2);close(dist(g.A,g.O),Math.sqrt(7));
  close(cosine(g.B,g.A,g.O),3*Math.SQRT2/5);close(dist(g.A,g.O)/dist(g.A,g.B),Math.sqrt(7)/5);
});
test('square-pyramid impossible and degenerate boundary states remain mathematically distinct',()=>{
  const impossible=M.pyrGeo(3,4),edge=M.pyrGeo(3,3*Math.SQRT2),valid=M.pyrGeo(3,5);
  assert.equal(impossible.ok,false);assert.equal(impossible.degenerate,false);assert.ok(impossible.h2<0);
  assert.equal(edge.ok,false);assert.equal(edge.degenerate,true);close(edge.h,0);point(edge.A,edge.O);
  assert.equal(valid.ok,true);assert.equal(valid.degenerate,false);
});
test('pyramid height and line-plane angle increase with allowed lateral edge length',()=>{
  let last=0;
  for(const length of [4.3,5,6,7]){const g=M.pyrGeo(3,length),angle=Math.acos(g.BO/g.l);close(g.h*g.h,length*length-18);assert.ok(angle>last);last=angle;}
});
test('all five original line-pair presets have their independently computed acute angles',()=>{
  for(const [key,expected] of [['A',.5],['B',1/3],['C',Math.SQRT1_2],['D',1/Math.sqrt(3)],['P',.6]]){
    const g=M.geo7(key,0),a=sub(g.L1[1],g.L1[0]),b=sub(g.L2[1],g.L2[0]);
    close(Math.abs(dot(a,b))/(norm(a)*norm(b)),expected);close(g.cosv,expected);
  }
  const first=lab.api.first('mode7');assert.equal(first.key,'A');close(first.ans.val,.5);
});
test('translating a line keeps its direction and reaches the source intersection',()=>{
  for(const key of ['A','B','C','D','P']){
    const base=M.geo7(key,0);
    for(const t of [0,.2,.5,1]){const g=M.geo7(key,t);point(sub(g.L2c[1],g.L2c[0]),sub(base.L2[1],base.L2[0]));close(g.cosv,base.cosv);}
    if(key==='B')point(base.X,M.CUBE.O);else{assert.equal(base.X,null);assert.ok(M.geo7(key,1).X);}
  }
});
test('the original 3-4-5 problem has foot H while the reversed hypotenuse has foot O',()=>{
  const first=lab.api.first('mode8');assert.equal(first.foot,'H');close(first.oh,3);close(first.ph,4);close(first.po,5);
  for(const [oh,ph,po,foot] of [[3,4,5,'H'],[3,5,4,'O']]){
    const g=M.geo8(oh,ph,po);close(dist(g.O,g.H),oh);close(dist(g.P,g.H),ph);close(dist(g.P,g.O),po);
    point(V(g.P.x,0,g.P.z),g[foot]);
  }
});
test('native first and second three-perpendicular cases keep all required orthogonal directions',()=>{
  for(const st8 of [1,2]){
    lab.go('mode8');Object.assign(lab.s,{st8,h8:3.2,px8:.7,pz8:2.8});const f=lab.draw();
    const get=n=>f.space.find(q=>(q.name==='point'||q.name==='handle')&&q.options.label===n).points[0];
    const p=get('P'),o=get('O'),h=get('H'),l=V(1,0,0);
    close(dot(sub(p,o),l),0);close(dot(sub(o,h),l),0);close(dot(sub(p,h),l),0);close(dot(sub(p,o),sub(h,o)),0);
    close(dist(p,h)**2,dist(p,o)**2+dist(o,h)**2);
  }
});
test('native third-statement counterexample retains two perpendiculars but loses plane normality',()=>{
  for(const pz8 of [.9,1.2,M.OZ3]){
    lab.go('mode8');Object.assign(lab.s,{st8:3,h8:2.4,pz8});const f=lab.draw();
    const get=n=>f.space.find(q=>(q.name==='point'||q.name==='handle')&&q.options.label===n).points[0];
    const p=get('P'),o=get('O'),h=get('H'),l=V(1,0,0);
    close(dot(sub(p,h),l),0);close(dot(sub(o,h),l),0);
    const extra=Math.abs(dot(sub(p,o),sub(h,o)))<1e-8;assert.equal(extra,pz8===M.OZ3);
    const foot=V(p.x,0,p.z);if(extra)point(foot,o);else{assert.ok(dist(foot,o)>.1);point(get('O′'),foot);}
  }
});
test('original perpendicular-plane coordinates justify both section perpendiculars and cosine-square one-fifth',()=>{
  const first=lab.api.first('mode9'),g=M.geo9(30,45),pa=sub(g.A,g.P);
  close(first.a,30);close(first.b,45);close(first.ans.val,1/5);
  close(dot(sub(g.K,g.M),pa),0);close(dot(sub(g.B,g.M),pa),0);close(dot(sub(g.B,g.K),sub(g.M,g.K)),0);
  close(dist(g.K,g.P),2);close(dist(g.B,g.K),2);close(dist(g.M,g.K),1);close(cosine(g.M,g.B,g.K)**2,1/5);
});
test('all registered angle choices and continuous exploration satisfy the perpendicular-plane ratio',()=>{
  for(const a of [20,30,45,60,70])for(const b of [20,30,45,60]){
    const g=M.geo9(a,b),bk=dist(g.B,g.K),km=dist(g.M,g.K),ratio=Math.tan(b*Math.PI/180)/Math.sin(a*Math.PI/180);
    close(bk/km,ratio);close(cosine(g.M,g.B,g.K)**2,1/(1+ratio*ratio));
    if([30,45,60].includes(a)&&[30,45,60].includes(b))close(M.cos2of(a,b).val,1/(1+ratio*ratio));
  }
});
