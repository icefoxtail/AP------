import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/surface-volume-lesson-runtime.mjs';
const require=createRequire(import.meta.url),api=require('../kit/apl-g7-short-measurement.js');
const copy=x=>JSON.parse(JSON.stringify(x));
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
function build(lab,id,state={}) {lab.go(id);Object.assign(lab.s,state);const before=JSON.stringify(lab.s),plans=api.registry[`g7-surface-volume/${id}`](lab,lab.s);assert.equal(JSON.stringify(lab.s),before);return plans;}
function render(lab,p,t) {const b=lab.board,paths=[],texts=[],old=b.path,oldText=b._text;b.path=function(points,o){paths.push({points:copy(points),options:o});return old.call(this,points,o);};b._text=function(x,y,str,o,screen){texts.push(String(str));return oldText.call(this,x,y,str,o,screen);};try{b.begin();p.draw(b,t,p.model);b.end();}finally{b.path=old;b._text=oldText;}return{paths,texts};}
test('rational pi arithmetic retains fractional dimensions and units exactly',()=>{
  for(const n of[1/3,2/3,5/6,231/2,7/6,64/3,845/9])near(api.rational(n)[0]/api.rational(n)[1],n);
  assert.equal(api.tex(api.value(0,1/3)),'\\frac{\\pi}{3}');
  assert.equal(api.tex(api.value(24,5/2)),'24+\\frac{5\\pi}{2}');
  assert.equal(api.tex(api.minus(api.value(3,2),api.value(5,1/2))),'-2+\\frac{3\\pi}{2}');
});
test('current prism dimensions, curved perimeters and rigid nets independently agree',async()=>{
  const lab=await load(),G=lab.api;
  const cases=[['sv1-1',{svShape:'rect',sA:9,sB:7,sH:11},63,32],['sv1-1',{svShape:'tri',sK:3,sH:8},54,36],['sv1-4',{svShape:'trap',sU:7,sH:13},40,30],['sv1-4',{svShape:'circ',sR:7,sH:12},49*Math.PI,14*Math.PI],['sv1-2',{sTh:240,sR2:7,sH2:9},98*Math.PI/3,14+28*Math.PI/3],['sv1-3',{sR3:5,sH3:7},25*Math.PI,10*Math.PI],['sv1-5',{sW:9,sRr:4,sH5:7},72+8*Math.PI,26+4*Math.PI]];
  for(const[id,s,area,perimeter]of cases){
    const p=build(lab,id,s)[0],m=p.model;near(api.numeric(m.area),area);near(api.numeric(m.perimeter),perimeter);near(api.numeric(m.surface),2*area+perimeter*m.h);near(api.numeric(m.volume),area*m.h);
    const net=api.prismGeometry(G,m);
    for(const u of[0,.37,1]){const T=G.netPose(net.net,u);net.net.pieces.forEach((f,k)=>{const moved=f.pts.map(p=>G.applyT(T[k],p));for(let i=0;i<f.pts.length;i++){const j=(i+1)%f.pts.length;near(G.len3(G.sub3(moved[i],moved[j])),G.len3(G.sub3(f.pts[i],f.pts[j])));}});}
  }
});
test('first prism unit renders original figures and all construction stops without mutating live state',async()=>{
  const lab=await load();
  for(const[w,h]of[[1440,900],[820,1180],[1024,768],[390,420]]){
    lab.board.resize(w,h);lab.setViewportWidth(w);
    for(const id of['sv1-1','sv1-2','sv1-3','sv1-4','sv1-5']){
      const plans=build(lab,id),before=JSON.stringify(lab.s);
      for(const p of plans)for(const t of[0,...p.stops,p.duration]){const r=render(lab,p,t);assert.ok(r.paths.length>0);assert.ok(!r.texts.some(x=>/NaN|undefined|Infinity/.test(x)));const f=p.frame(t,p.model);assert.ok(f.label);if(t===0)assert.equal(f.formula,'');}
      assert.equal(JSON.stringify(lab.s),before);
    }
  }
});

const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z}),sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z,cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const length=a=>Math.hypot(a.x,a.y,a.z);
function faceArea(f){let area=0;for(let i=1;i<f.pts.length-1;i++)area+=length(cross(sub(f.pts[i],f.pts[0]),sub(f.pts[i+1],f.pts[0])))/2;return area;}
const area=mesh=>mesh.faces.reduce((s,f)=>s+faceArea(f),0);
const volume=mesh=>Math.abs(mesh.faces.reduce((s,f)=>s+faceArea(f)*dot(f.n,f.c)/3,0));
const uniquePoints=mesh=>[...new Map(mesh.faces.flatMap(f=>f.pts).map(p=>[[p.x,p.y,p.z].join(','),p])).values()];
const integrate=(fn,a,b,n=6000)=>{let s=0;for(let i=0;i<n;i++)s+=fn(a+(i+.5)*(b-a)/n);return s*(b-a)/n;};

test('the actual 30/54 legacy inventory leaves exactly 28/51 with the two existing solid routes excluded',async()=>{
  const lab=await load(),excluded=new Set(['sv2-4','sv3-4']);
  assert.equal(lab.list.length,30);
  assert.equal(Object.values(lab.def.lessons).reduce((n,v)=>n+(Array.isArray(v)?v.length:1),0),54);
  const expected=Array.from(lab.list.filter(s=>!excluded.has(s.id)),s=>`g7-surface-volume/${s.id}`).sort();
  assert.deepEqual(Object.keys(api.registry).sort(),expected);assert.deepEqual(Object.keys(api.lessonInfo).sort(),expected);
  let count=0;
  for(const route of expected){
    const id=route.split('/')[1],lessons=lab.def.lessons[id],labels=Array.from(Array.isArray(lessons)?lessons:[lessons],v=>v.label||'').sort(),plans=build(lab,id);
    assert.deepEqual(plans.map(p=>p.legacyLabel).sort(),labels,route);assert.deepEqual(api.lessonInfo[route].map(p=>p.legacyLabel).sort(),labels,route);count+=plans.length;
    assert.equal(new Set(plans.map(p=>p.id)).size,plans.length);
    plans.forEach(p=>{assert.ok(p.duration>0&&p.duration<=10);assert.equal(p.frame(0,p.model).formula,'');assert.ok(p.given);});
  }
  assert.equal(count,51);assert.ok(!api.registry['g7-surface-volume/sv2-4']);assert.ok(!api.registry['g7-surface-volume/sv3-4']);
});

test('pyramid coordinates, rigid hinges, congruent cube partition and independent section integrals agree',async()=>{
  const lab=await load(),G=lab.api;
  for(const a of[2,7,15]){
    const pieces=api.cubePyramids(G,a);
    pieces.forEach(mesh=>near(volume(mesh),a**3/3));near(pieces.reduce((s,p)=>s+volume(p),0),a**3);
    const lengths=pieces.map(mesh=>{const p=uniquePoints(mesh),out=[];for(let i=0;i<p.length;i++)for(let j=0;j<i;j++)out.push(length(sub(p[i],p[j])));return out.sort((a,b)=>a-b);});
    lengths[0].forEach((x,i)=>{near(x,lengths[1][i]);near(x,lengths[2][i]);});
    for(const q of[[.13,.72,.38],[.83,.17,.32],[.25,.31,.91],[.47,.64,.59]]){
      const p={x:q[0]*a,y:q[1]*a,z:q[2]*a};assert.equal(pieces.filter(mesh=>mesh.faces.every(f=>dot(f.n,sub(p,f.c))<=1e-8)).length,1);
    }
  }
  for(const id of['sv2-5','sv2-6','sv2-7'])for(const settings of id==='sv2-5'?[{s5A:11,s5B:4,svKind5:'frus'},{s5A:7,svKind5:'pyr'}]:[{}]){
    const plans=build(lab,id,settings),m=plans[0].model,mesh=api.pyramidMesh(G,m),net=api.pyramidGeometry(G,m);
    near(area(mesh),api.numeric(m.surface));near(volume(mesh),api.numeric(m.volume));
    const integral=m.kind.startsWith('triangle')?integrate(y=>24*(1-y/9)**2,0,m.h):integrate(y=>(m.a+(m.b-m.a)*y/m.h)**2,0,m.h);
    near(integral,api.numeric(m.volume),1e-7);
    for(const u of[0,.31,.73,1]){const T=G.netPose(net.net,u);net.net.pieces.forEach((f,k)=>{const moved=f.pts.map(p=>G.applyT(T[k],p));for(let i=0;i<f.pts.length;i++)for(let j=0;j<i;j++)near(length(sub(moved[i],moved[j])),length(sub(f.pts[i],f.pts[j])));});}
    const pose=G.netPose(net.net,1),normals=net.net.pieces.map((f,k)=>G.mulM(pose[k].R,f.n));normals.forEach(n=>near(Math.abs(dot(n,normals[0])),1));
  }
  for(const id of['sv2-3','sv4-1'])for(const settings of[{svTri:'B',s3K:2,s41K:2,svAxis:'short'},{svTri:'D',s3K:1,s41K:1,svAxis:'long'}]){
    const m=build(lab,id,settings)[0].model;near(m.r*m.r+m.h*m.h,m.l*m.l);near(api.numeric(m.volume),integrate(y=>Math.PI*(m.r*(1-y/m.h))**2,0,m.h),1e-7);
  }
  const heights=[],originalScene=G.scene3;
  G.scene3=(...args)=>{const D=originalScene(...args),originalHeight=D.height;D.height=(a,b,...rest)=>{heights.push([copy(a),copy(b)]);return originalHeight(a,b,...rest);};return D;};
  try{const p=build(lab,'sv2-6')[0];render(lab,p,0);assert.deepEqual(heights,[[{x:0,y:0,z:0},{x:0,y:9,z:0}]]);heights.length=0;render(lab,p,2);assert.equal(heights.length,0);}finally{G.scene3=originalScene;}
  for(const id of['sv2-6','sv2-7']){lab.go(id);lab.tab='problem';const plans=api.registry[`g7-surface-volume/${id}`](lab,lab.s);assert.ok(plans.every(p=>p.given.startsWith('문제 조건:')));}
});

test('spherical portions have the actual curved fraction, flat faces and independently integrated volume',async()=>{
  const lab=await load(),G=lab.api;
  const expected={full:[1,0],half:[.5,1],quarter:[.25,1],eighth:[.125,.75],threequarter:[.75,1],seveneighth:[.875,.75]};
  for(const r of[2,7])for(const[kind,[fraction,flats]]of Object.entries(expected)){
    const m=api.sphereModel(r,kind),mesh=api.sphereGeometry(G,m),faces=api.sphericalFlats(G,m);
    near(api.numeric(m.curve),4*Math.PI*r*r*fraction);near(api.numeric(m.surface),Math.PI*r*r*(4*fraction+flats));
    const polygonFlatArea=m.flatFractions.reduce((s,f)=>s+48*r*r*Math.sin(2*Math.PI*f/48)/2,0);
    near(faces.reduce((s,f)=>s+faceArea(f),0),polygonFlatArea);
    const integrated=integrate(y=>Math.PI*(r*r-y*y),-r,r)*fraction;near(api.numeric(m.volume),integrated,1e-7);
    near(area(mesh),api.numeric(m.surface),.008);near(volume(mesh),api.numeric(m.volume),.008);
    faces.forEach(f=>{near(length(f.n),1);f.pts.forEach(p=>near(dot(sub(p,f.pts[0]),f.n),0));});
  }
  for(const r of[3,8])for(const y of[0,.2*r,.7*r,r])near(api.sphereSectionArea(r,y),Math.PI*r*r-Math.PI*y*y);
  for(const kind of['threequarter','seveneighth']){
    const mesh=api.sphereGeometry(G,api.sphereModel(4,kind)),p={x:.8,y:kind==='threequarter'?0:.8,z:0};
    assert.equal(api.isOccluded(mesh,p,{x:.6,y:0,z:.8}),false,'missing quadrant leaves the cut face visible');
    assert.equal(api.isOccluded(mesh,p,{x:-Math.sqrt(.75),y:0,z:.5}),true,'opposite material can occlude a camera-facing concave cut face');
  }
});

test('sphere inverse questions keep the radius unknown until the volume equation is solved',async()=>{
  const lab=await load();
  for(const shape of['full','half']){
    const plans=build(lab,'sv3-6',{sAR:7,svShape6:shape,svAsk:'rev'}),p=plans.find(p=>p.legacyLabel==='역으로');
    assert.ok(p.given.includes('반지름 r'));assert.ok(!/반지름\s*7/.test(p.given));assert.ok(p.given.includes(api.tex(p.model.volume)));
    for(const t of[0,.8,2.5]){const r=render(lab,p,t);assert.ok(r.texts.some(x=>x==='반지름 r'));assert.ok(!r.texts.some(x=>/반지름\s*7/.test(x)));}
    const solved=render(lab,p,3.5);assert.ok(solved.texts.some(x=>x==='반지름 7'));
    assert.ok(p.frame(p.duration,p.model).formula.includes(api.tex(p.model.surface)));
  }
});

test('both axis proofs use the same actual trapezoid instead of stale alternate sliders',async()=>{
  const lab=await load();
  for(const settings of[{svAxis2:'leg',s42J:5,s42K:2,s42A:14},{svAxis2:'base',s42A:11,s42K:1,s42J:2},{svAxis2:'base',s42A:15,s42K:2,s42J:1}]){
    const plans=build(lab,'sv4-2',settings),p=plans.find(p=>p.legacyLabel==='축 바꾸기'),m=p.model;
    assert.equal(m.a,settings.svAxis2==='leg'?settings.s42J:settings.s42A);assert.equal(m.b,m.a+3*settings.s42K);assert.equal(m.h,4*settings.s42K);
    const perp=integrate(y=>Math.PI*(m.b+(m.a-m.b)*y/m.h)**2,0,m.h);
    const base=integrate(x=>Math.PI*(x<=m.a?m.h:m.h*(m.b-x)/(m.b-m.a))**2,0,m.b);
    near(api.numeric(m.frustum.volume),perp,1e-7);near(api.numeric(m.composite.volume),base,1e-7);
    assert.ok(p.given.includes(`짧은 밑변 ${m.a}`));assert.ok(p.given.includes(`긴 밑변 ${m.b}`));
    const native=lab.scene.sv.model(copy(lab.s)),normal=plans.find(p=>p.legacyLabel==='부피');near(api.numeric(normal.model.proof.volume),lab.api.vnum(native.vol));
  }
});

test('joined bodies exclude each paired interface twice while their volumes add once',async()=>{
  const lab=await load(),G=lab.api;
  const cases=[['sv4-3',{svDbl:'B'}],['sv4-4',{svTri4:'C',s44H:11}],['sv5-6',{svTop:'cyl',s56A:12,s56H:7,s56R:4,s56Z:8}],['sv5-6',{svTop:'hemi',s56A:10,s56H:9,s56R:4}],['sv5-6',{svTop:'cone',s56A:13,s56H:6,s56R:6}],['sv6-1',{jcKind:'pyramid',jcK:2,jcH:9}],['sv6-1',{jcKind:'cone',jcK:3,jcH:7}],['sv6-1',{jcKind:'hemi',jcK:2,jcH:13}]];
  for(const[id,state]of cases){
    const p=build(lab,id,state)[0],m=p.model,native=lab.scene.sv.model(copy(lab.s));
    const meshes=m.parts.map(part=>api.componentMesh(G,part));
    near(meshes.reduce((s,mesh)=>s+volume(mesh),0),api.numeric(m.volume),.005);
    near(meshes.reduce((s,mesh)=>s+area(mesh),0)-m.joins.reduce((s,j)=>s+2*api.numeric(j.area),0),api.numeric(m.surface),.005);
    near(api.numeric(m.surface),G.vnum(native.surface||native.surf));near(api.numeric(m.volume),G.vnum(native.volume||native.vol));
    m.joins.forEach(j=>{assert.ok(j.upper!==j.lower);assert.ok(j.y>=Math.min(...meshes[j.lower].faces.flatMap(f=>f.pts.map(p=>p.y)))-1e-8);});
  }
});

test('holes and notches have the stated actual boundaries, wall lengths, area changes and ray occlusion',async()=>{
  const lab=await load(),G=lab.api;
  for(const kind of['ct','cb','st','sb']){
    const M={a:10,h:8,q:2,size:2,d:5,kind},m=api.holeModel(kind==='ct'?'sv5-1':'sv5-2',M),mesh=api.holeMesh(G,m);
    near(area(mesh),api.numeric(m.surface),.001);near(volume(mesh),10*10*8-(m.round?Math.PI*4:4)*m.d,.001);
    for(const u of[0,.31,.7,1]){const wall=api.unrolledWall(G,m,u);near(area(wall.mesh),api.numeric(m.wall),.001);if(!m.round)wall.points.slice(1).forEach((p,i)=>near(Math.hypot(p[0]-wall.points[i][0],p[1]-wall.points[i][1]),m.size));}
    const end=api.unrolledWall(G,m,1).points;near(end.at(-1)[0]-end[0][0],api.numeric(m.perimeter));
  }
  const blind=api.holeMesh(G,api.holeModel('sv5-2',{a:10,h:8,size:2,d:5,kind:'cb'}));
  assert.equal(api.isOccluded(blind,{x:0,y:3,z:0},{x:0,y:1,z:0}),false,'open aperture exposes the floor from directly above');
  assert.equal(api.isOccluded(blind,{x:0,y:3,z:0},{x:0,y:.5,z:Math.sqrt(.75)}),true,'the near hole wall hides the floor at a shallow view');
  assert.equal(api.isOccluded(blind,{x:4,y:0,z:0},{x:0,y:1,z:0}),true,'the intact box roof occludes its bottom');
  for(const count of[1,4,8])for(const p of[1,3]){
    const m=api.notchModel('sv5-3',{a:10,p,cnt:count}),mesh=G.boxMinusBoxes(m.bounds,m.boxes);near(area(mesh),600);near(volume(mesh),1000-count*p**3);assert.equal(api.removedFaces(m.bounds,m.boxes).length,3*count);
  }
  for(const kind of['mid','thru','groove']){
    const m=api.notchModel('sv5-4',{a:10,p:3,q:2,c:5,w:4,z:3,kind}),mesh=G.boxMinusBoxes(m.bounds,m.boxes),removed=api.removedFaces(m.bounds,m.boxes);
    near(removed.reduce((s,f)=>s+faceArea(f),0),api.numeric(m.removed));near(mesh.faces.filter(f=>f.tag==='in').reduce((s,f)=>s+faceArea(f),0),api.numeric(m.added));near(area(mesh),api.numeric(m.surface));
  }
});

test('conical cavities add their inner surface and subtract their genuinely removed volume',async()=>{
  const lab=await load(),G=lab.api;
  for(const state of[{s55K:3,s55J:1},{s55K:5,s55J:4}]){
    const p=build(lab,'sv5-5',state)[0],m=p.model,mesh=api.cavityMesh(G,m,96);
    near(area(mesh),api.numeric(m.surface),.001);near(volume(mesh),api.numeric(m.volume),.002);
    const expected=Math.PI*(m.r2*m.R2+(m.r2*m.r2-m.r1*m.r1)+m.r1*m.R1);near(api.numeric(m.surface),expected);
    assert.equal(api.isOccluded(mesh,{x:m.r1/2,y:m.h1/2,z:0},{x:0,y:-1,z:0}),false,'inner cone is visible through the actual bottom opening');
    assert.ok(mesh.edges.every(e=>e.f1<mesh.faces.length&&e.f2<mesh.faces.length));
  }
  const parts=[G.boxMesh(0,1,0,1,0,1),G.boxMesh(3,4,0,1,0,1)],combined=api.mergeMeshes(parts);
  combined.edges.slice(parts[0].edges.length).forEach(e=>{assert.ok(e.f1>=parts[0].faces.length);assert.ok(e.f2>=parts[0].faces.length);});
});

test('overflow uses actual height and body, with exact submerged-volume conservation',async()=>{
  const lab=await load();
  for(const r of[2,7])for(const k of[0,5])for(const body of['sph','cone','cyl']){
    const p=build(lab,'sv3-3',{s8R:r,s8K:k,svBody:body})[0],m=p.model,H=body==='sph'?2*r:m.h;
    assert.equal(m.h,2*r+k);assert.equal(m.body,body);near(api.displaced(r,m.h,body,H),api.numeric(m.volume));
    for(const d of[0,.3*H,.8*H,H]){const integrated=integrate(y=>Math.PI*(body==='sph'?2*r*y-y*y:body==='cone'?r*r*(1-y/m.h)**2:r*r),0,d);near(api.displaced(r,m.h,body,d),integrated,1e-7);}
    if(k)assert.ok(!p.frame(5.8,m).formula.includes('1:2:3'));
  }
});

test('all new families draw their initial givens and construction stops through the production Board',async()=>{
  const lab=await load(),old=new Set(['sv1-1','sv1-2','sv1-3','sv1-4','sv1-5']);
  for(const[w,h]of[[1440,900],[820,1180],[1024,768],[390,420]]){
    lab.board.resize(w,h);lab.setViewportWidth(w);
    for(const route of Object.keys(api.registry)){
      const id=route.split('/')[1];if(old.has(id))continue;
      const plans=build(lab,id),before=JSON.stringify(lab.s);
      for(const p of plans)for(const t of[0,...p.stops,p.duration]){
        const r=render(lab,p,t),f=p.frame(t,p.model);assert.ok(r.paths.length>0,`${p.id}@${t}: empty diagram`);assert.ok(!r.texts.some(x=>/NaN|Infinity|undefined|\\(?:frac|pi|times|sqrt)/.test(x)),`${p.id}@${t}: invalid canvas text`);assert.ok(!/NaN|Infinity|undefined/.test(f.label+f.formula));
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }
});

test('peer regression: inverse sphere equations pass through the actual math renderer',async()=>{
  const window={katex:require('../kit/vendor/katex/katex.min.js')};
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-core.js',import.meta.url),'utf8'),{
    window,URLSearchParams,location:{search:''},document:{documentElement:{setAttribute(){}}}
  });
  const lab=await load();
  for(const shape of['full','half'])for(const r of[3,7,11]){
    const p=build(lab,'sv3-6',{sAR:r,svShape6:shape,svAsk:'rev'}).find(p=>p.legacyLabel==='역으로');
    for(const t of[.8,1.2,1.999]){
      const html=window.APLab.renderMath(p.frame(t,p.model).formula),mathml=html.match(/<semantics>([\s\S]*?)<annotation/);
      assert.ok(mathml,'the volume equation must produce real KaTeX MathML, not raw TeX');
      assert.ok(!html.includes('$')&&!html.includes('katex-error'));
      assert.ok(mathml[1].includes(`<mfrac><mn>${shape==='full'?4:2}</mn><mn>3</mn></mfrac>`));
      assert.ok(mathml[1].includes('<msup><mi>r</mi><mn>3</mn></msup>'),'the radius stays an unknown in the first equation');
      near(api.numeric(p.model.volume),(shape==='full'?4:2)*Math.PI*r**3/3);
    }
  }
});

test('peer regression: displayed composite perimeters multiply the whole sum by the height',async()=>{
  // Evaluate the displayed arithmetic independently of the stored result.
  const evaluate=source=>{
    const expression=source.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'(($1)/($2))').replace(/\\times/g,'*').replace(/\\pi/g,'P').replace(/([\d)])P/g,'$1*P');
    assert.match(expression,/^[\dP+\-*/().\s]+$/);
    return Function('P',`"use strict"; return (${expression});`)(Math.PI);
  };
  const lab=await load(),cases=[
    ['sv1-2',{sR2:4,sTh:90,sH2:7},(8+2*Math.PI)*7],
    ['sv1-2',{sR2:7,sTh:240,sH2:9},(14+28*Math.PI/3)*9],
    ['sv1-5',{sW:4,sRr:2,sH5:5},(12+2*Math.PI)*5],
    ['sv1-5',{sW:9,sRr:4,sH5:7},(26+4*Math.PI)*7]
  ];
  for(const[id,state,expected]of cases){
    const p=build(lab,id,state)[0];
    for(const t of[5.2,5.6,6.799]){
      const math=p.frame(t,p.model).formula.match(/\$([^$]+)\$/)?.[1];assert.ok(math);
      const sides=math.split('=').filter(Boolean).map(evaluate);assert.equal(sides.length,2);
      sides.forEach(side=>near(side,expected));
    }
  }
});

test('peer regression: marked radii start at the actual circle center through every net pose',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3,netPose=G.netPose;
  let radii=[];
  G.scene3=(...args)=>{
    const D=scene3(...args),radius=D.radius;
    D.radius=(a,b,text,...rest)=>{radii.push({a:copy(a),b:copy(b),text});return radius(a,b,text,...rest);};
    return D;
  };
  const cases=[
    ['sv1-2',{sR2:1,sTh:30,sH2:3}],['sv1-2',{sR2:4,sTh:90,sH2:7}],['sv1-2',{sR2:7,sTh:240,sH2:9}],
    ['sv1-5',{sW:4,sRr:2,sH5:5}],['sv1-5',{sW:9,sRr:4,sH5:7}],['sv1-5',{sW:2,sRr:1,sH5:3}],
    ['sv1-1',{svShape:'circ',sR:7,sH:9}]
  ];
  try{
    for(const width of[390,1440]){
      lab.board.resize(width,650);lab.setViewportWidth(width);
      for(const[id,state]of cases){
        const p=build(lab,id,state)[0],net=api.prismGeometry(G,p.model),before=JSON.stringify(lab.s);
        for(const u of[0,.25,.5,.89,1]){
          // Keep the initial dimension label visible while supplying every
          // production net pose, including the fully unfolded endpoint.
          G.netPose=(n)=>netPose(n,u);radii=[];render(lab,p,0);
          assert.equal(radii.length,1);const mark=radii[0],T=netPose(net.net,u)[net.bot],at=q=>G.applyT(T,q),A=net.A.map(at);
          const arc=p.model.base.shape==='sector'?A.slice(1):p.model.base.shape==='halfround'?A.slice(1,-1):A;
          const origin=p.model.base.shape==='sector'?A[0]:p.model.base.shape==='halfround'?G.mul3(add(A[1],A.at(-2)),.5):G.mul3(add(A[0],A[A.length/2]),.5);
          near(length(sub(mark.a,origin)),0);near(length(sub(mark.b,mark.a)),p.model.base.r);
          assert.ok(arc.some(q=>length(sub(q,mark.b))<1e-8),'the radius ends on the actual circular arc');
          assert.equal(mark.text,`반지름 ${p.model.base.r}`);
        }
        assert.equal(JSON.stringify(lab.s),before);
      }
    }
  }finally{G.scene3=scene3;G.netPose=netPose;}
});
