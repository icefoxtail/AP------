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
function textBoxes(lab,p,t) {
  const drawn=[],ctx=lab.board.ctx,old=ctx.fillText;
  ctx.fillText=function(text,x,y){const w=this.measureText(String(text)).width,h=Number(/([\d.]+)px/.exec(this.font)?.[1]||12),align=this.textAlign,baseline=this.textBaseline;const x0=x-(align==='center'?w/2:align==='right'||align==='end'?w:0),y0=y-(baseline==='middle'?h/2:baseline==='top'?0:h);drawn.push({text:String(text),x0,x1:x0+w,y0,y1:y0+h});return old.call(this,text,x,y);};
  try{render(lab,p,t);}finally{ctx.fillText=old;}
  return drawn;
}
function noLabelCollision(items,scope) {
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
    const a=items[i],b=items[j],overlapX=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),overlapY=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0);
    assert.ok(overlapX<=0||overlapY<=0,`${scope}: ${a.text} overlaps ${b.text}`);
  }
}

test('post-capture regression: trapezoid axis comparison fits its initial profile and first sweep',async()=>{
  const lab=await load();
  for(const[viewport,w,h]of[[1440,1439,713],[820,820,880],[1024,1023,581],[390,390,510]]){
    lab.board.resize(w,h);lab.setViewportWidth(viewport);
    for(const state of[{svAxis2:'leg',s42J:3,s42K:1},{svAxis2:'leg',s42J:9,s42K:2},{svAxis2:'base',s42A:15,s42K:2}]){
      const p=build(lab,'sv4-2',state)[2],before=JSON.stringify(lab.s);
      for(const t of[0,.5,.8,1.6,2.8,3.39])for(const path of render(lab,p,t).paths)for(const point of path.points){
        const q=lab.board.toS(point);assert.ok(q.x>=0&&q.x<=w&&q.y>=0&&q.y<=h,`${viewport}@${t}: clipped axis/profile ${JSON.stringify(q)}`);
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }
});

test('post-capture regression: unfolded frustum base labels stay distinct from radius annotations',async()=>{
  const lab=await load();
  for(const[viewport,w,h]of[[1440,1439,713],[820,820,880],[1024,1023,581],[390,390,510]]){
    lab.board.resize(w,h);lab.setViewportWidth(viewport);
    for(const state of[{svAxis2:'leg',s42J:3,s42K:1},{svAxis2:'leg',s42J:1,s42K:2},{svAxis2:'leg',s42J:9,s42K:2}]){
      const p=build(lab,'sv4-2',state)[0];
      assert.equal(textBoxes(lab,p,2.21).filter(x=>x.text.startsWith('반지름')).length,2,'both actual base radii remain visible before unfolding');
      for(const t of[6,7.3,9.8]){
        const texts=textBoxes(lab,p,t),base=texts.filter(x=>/^반지름|^[윗아랫]+면$|^\d+(?:\/\d+)?π$/.test(x.text));
        assert.ok(base.some(x=>x.text==='윗면')&&base.some(x=>x.text==='아랫면'));
        noLabelCollision(base,`${viewport}@${t}`);
      }
    }
  }
});

test('post-capture regression: separated component names and contact areas never overlap',async()=>{
  const lab=await load();
  for(const[viewport,w,h]of[[1440,1439,713],[820,820,880],[1024,1023,581],[390,390,598]]){
    lab.board.resize(w,h);lab.setViewportWidth(viewport);
    for(const[id,state]of[['sv4-3',{}],['sv4-4',{}],['sv5-6',{svTop:'cyl'}],['sv5-6',{svTop:'hemi'}],['sv6-1',{jcKind:'hemi'}],['sv6-1',{jcKind:'pyramid'}],['sv4-2',{svAxis2:'base',s42A:3,s42K:1}]]){
      const p=build(lab,id,state)[0],before=JSON.stringify(lab.s);
      for(const t of[7.3,9.8]){
        const labels=textBoxes(lab,p,t).filter(x=>x.text.startsWith('붙은 면')||/^(?:원뿔|원기둥|사각기둥|사각뿔|반구)$/.test(x.text));
        assert.ok(labels.length>=4,`${id}: actual contact/name labels exercised`);
        noLabelCollision(labels,`${id}/${viewport}@${t}`);
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }
});
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

test('visual regression: only separated smooth cut edges become net boundaries',async()=>{
  const lab=await load(),G=lab.api;
  const samePoint=(a,b)=>length(sub(a,b))<1e-6;
  const polygonNet=G.solidNet([[-2,-2],[2,-2],[2,2],[-2,2]],5,.4,null,0).net;
  for(const u of[0,.38,1])assert.equal(api.netCutBoundaries(G,polygonNet,G.netPose(polygonNet,u)),polygonNet,'non-smooth polyhedral nets retain the identical native object');
  for(const kind of['cylinder','cone'])for(const r of[2,7]){
    const h=kind==='cone'?4:9,net=G.solidNet(G.circleBase(r,32),h,kind==='cone'?0:1,Array(32).fill(true),16),before=JSON.stringify(net.net);
    for(const u of[0,.23,.61,1]){
      const poses=G.netPose(net.net,u),drawNet=api.netCutBoundaries(G,net.net,poses),actualEdges=[];
      // Count actual transformed patch edges, independently of the stored
      // parent/neighbor graph. A shared strip edge has incidence two; a cut
      // that has opened has one occurrence on either side of the gap.
      for(const k of net.lat){const f=net.net.pieces[k],p=f.pts.map(q=>G.applyT(poses[k],q));p.forEach((a,i)=>actualEdges.push([a,p[(i+1)%p.length]]));}
      let opened=0;
      for(const k of net.lat){const f=net.net.pieces[k];f.edges.forEach((e,i)=>{
        const changed=drawNet.pieces[k].edges[i];
        if(e.kind!=='s'){assert.deepEqual(changed,e);return;}
        const a=G.applyT(poses[k],f.pts[e.i]),b=G.applyT(poses[k],f.pts[(e.i+1)%f.pts.length]);
        const boundary=actualEdges.filter(([c,d])=>(samePoint(a,c)&&samePoint(b,d))||(samePoint(a,d)&&samePoint(b,c))).length===1;
        assert.equal(changed.kind,boundary?'c':'s',`${kind} u=${u}, piece ${k}`);
        if(boundary){opened++;assert.equal(changed.nb,-1);near(length(sub(a,b)),kind==='cone'?Math.hypot(r,h):h);}
        else assert.equal(changed.nb,e.nb);
      });}
      assert.equal(opened,u===0?0:2);
      assert.equal(JSON.stringify(net.net),before,'render-only boundary classification cannot mutate the native net');
    }
  }
});

test('visual regression: production Board draws both open cylinder and cone boundaries without subdivision lines',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;
  let D;
  G.scene3=(...args)=>(D=scene3(...args));
  try{
    for(const[width,height]of[[1439,713],[820,880],[1023,581],[390,598]]){
      lab.board.resize(width,height);lab.setViewportWidth(width);
      for(const[id,settings,label]of[['sv1-3',{sR3:5,sH3:7},'겉넓이'],['sv1-1',{svShape:'circ',sR:3,sH:8},'겉넓이'],['sv2-2',{},'겉넓이'],['sv2-3',{svTri:'D',s3K:2},'겉넓이'],['sv4-1',{svTri:'B',s41K:2,svAxis:'short'},'겉넓이']]){
        const p=build(lab,id,settings).find(p=>p.legacyLabel===label),before=JSON.stringify(lab.s),r=render(lab,p,p.duration),net=p.model.geometry.net,poses=G.netPose(net,1),drawNet=api.netCutBoundaries(G,net,poses);
        const close=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<1e-7;
        const exactPath=(a,b)=>r.paths.filter(path=>path.points.length===2&&((close(path.points[0],a)&&close(path.points[1],b))||(close(path.points[1],a)&&close(path.points[0],b))));
        let count=0;
        net.pieces.forEach((f,k)=>f.edges.forEach((e,i)=>{
          if(e.kind!=='s')return;
          const a=D.P(G.applyT(poses[k],f.pts[e.i])),b=D.P(G.applyT(poses[k],f.pts[(e.i+1)%f.pts.length])),paths=exactPath(a,b);
          if(drawNet.pieces[k].edges[i].kind==='c'){
            count++;assert.ok(paths.some(x=>x.options.color==='ink'&&!x.options.dash),`${id}: missing cut boundary`);
          }else assert.equal(paths.length,0,`${id}: internal smooth subdivision must remain invisible`);
        }));
        assert.equal(count,2);assert.equal(JSON.stringify(lab.s),before);
      }
    }
  }finally{G.scene3=scene3;}
});

test('visual regression: cone rotation profile and complete sweep fit four actual canvas sizes',async()=>{
  const lab=await load();
  // Canvas extents are from the reviewed 1440/820/1024/390 browser captures.
  for(const[viewport,width,height]of[[1440,1439,713],[820,820,880],[1024,1023,581],[390,390,598]]){
    lab.board.resize(width,height);lab.setViewportWidth(viewport);
    for(const settings of[{svTri:'B',s41K:1,svAxis:'long'},{svTri:'D',s41K:1,svAxis:'short'},{svTri:'D',s41K:1,svAxis:'long',svYaw:-60,svPitch:35}]){
      const plans=build(lab,'sv4-1',settings),before=JSON.stringify(lab.s);
      for(const p of plans)for(const t of[0,.5,1.1,1.8,2.199]){
        const {paths}=render(lab,p,t);assert.ok(paths.length>0);
        for(const path of paths)for(const point of path.points){const q=lab.board.toS(point);assert.ok(q.x>=0&&q.x<=width&&q.y>=0&&q.y<=height,`${p.id}@${t} ${viewport}: clipped geometry ${JSON.stringify(q)}`);}
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }
});

test('visual regression: joined boundaries clip actual ray-triangle intervals and a finite cylinder independently',async()=>{
  const lab=await load(),G=lab.api,vec=(x,y,z)=>({x,y,z});
  const D={vw:vec(0,0,1),P:p=>({x:p.x,y:p.y}),facing:n=>n.z>0};
  const edgeMesh=z=>({faces:[],edges:[{a:vec(-2,0,z),b:vec(2,0,z),f1:-1,f2:-1}]}),square={faces:[{pts:[vec(-1,-1,1),vec(1,-1,1),vec(1,1,1),vec(-1,1,1)],n:vec(0,0,1)}],edges:[]};
  const clipped=api.joinedEdgeVisibility(G,D,[edgeMesh(0),square]);
  assert.deepEqual(clipped.map(r=>r.hidden),[false,true,false]);near(clipped[1].lo,.25,1e-7);near(clipped[1].hi,.75,1e-7);
  for(const z of[1,2])assert.ok(api.joinedEdgeVisibility(G,D,[edgeMesh(z),square]).every(r=>!r.hidden),'coplanar and front edges stay solid');
  const p=build(lab,'sv5-6',{svTop:'cyl',s56A:8,s56H:4,s56R:3,s56Z:3})[0],m=p.model;
  const d=G.scene3(lab.board,m.camera,{tab:'review'}),extent=4;
  // Independent finite-cylinder ray intersection: solve the radial quadratic
  // and intersect its parameter interval with the actual height slab.
  const cylinderHit=(q,center)=>{
    const x=q.x-center.x,z=q.z-center.z,V=d.vw,A=V.x*V.x+V.z*V.z,B=2*(x*V.x+z*V.z),C=x*x+z*z-9,disc=B*B-4*A*C;
    if(disc<0)return false;
    const lo=(-B-Math.sqrt(disc))/(2*A),hi=(-B+Math.sqrt(disc))/(2*A),y0=(4-q.y)/V.y,y1=(7-q.y)/V.y;
    return Math.min(hi,y1)>Math.max(lo,y0,1e-6)+1e-5;
  };
  let hiddenAtStart=0;
  for(const u of[0,.35,1]){
    const offset=d.hx((2.6*extent+1)*u),meshes=m.parts.map((part,i)=>G.xfMesh(api.componentMesh(G,part),G.shiftT(i?offset:vec(0,0,0)))),runs=api.joinedEdgeVisibility(G,d,meshes);
    for(const r of runs.filter(r=>r.part===0&&!r.ownHidden&&r.source.a.y===4&&r.source.b.y===4)){
      const q=G.mul3(add(r.points[0],r.points[1]),.5);assert.equal(r.hidden,cylinderHit(q,offset),'box roof edge must agree with a separate finite-cylinder equation');
      if(!u&&r.hidden)hiddenAtStart++;
      if(u===1)assert.equal(r.hidden,false,'the fully separated cylinder cannot hide the box roof');
    }
  }
  assert.ok(hiddenAtStart>0,'the actual reported top-edge occlusion is exercised');
});

test('visual regression: joined production paths preserve current poses and separate cone names from caps',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;let D;
  G.scene3=(...args)=>(D=scene3(...args));
  try{
    for(const[viewport,w,h]of[[1440,1439,713],[820,820,880],[1024,1023,581],[390,390,598]]){
      lab.board.resize(w,h);lab.setViewportWidth(viewport);
      for(const[id,state]of[['sv5-6',{svTop:'cyl'}],['sv5-6',{svTop:'hemi'}],['sv4-3',{}],['sv4-4',{}],['sv6-1',{jcKind:'pyramid'}]]){
        const p=build(lab,id,state)[0],before=JSON.stringify(lab.s);
        for(const t of[0,2.5,9.8]){
          const rendered=render(lab,p,t),runs=p.model.joinedPose.edges;
          const same=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<1e-7;
          for(const run of runs){const points=run.points.map(D.P);assert.ok(rendered.paths.some(path=>path.options.color==='ink'&&Boolean(path.options.dash)===run.hidden&&path.points.length===2&&same(path.points[0],points[0])&&same(path.points[1],points[1])),`${id}@${t}: exact visible/hidden production segment missing`);}
        }
        assert.equal(JSON.stringify(lab.s),before);
      }
      const p=build(lab,'sv4-3')[0],drawn=[],old=lab.board.ctx.fillText;
      lab.board.ctx.fillText=function(text,x,y){drawn.push({text:String(text),x,y});return old.call(this,text,x,y);};
      try{render(lab,p,9.8);}finally{lab.board.ctx.fillText=old;}
      const names=drawn.filter(x=>x.text==='원뿔'),caps=drawn.filter(x=>x.text.startsWith('붙은 면'));
      assert.equal(names.length,2);assert.equal(caps.length,2);
      for(const name of names){const cap=caps.reduce((a,b)=>Math.abs(a.x-name.x)<Math.abs(b.x-name.x)?a:b);assert.ok(Math.abs(name.y-cap.y)>=24,`${viewport}: cone label overlaps its cap label`);}
    }
  }finally{G.scene3=scene3;}
});

test('visual regression: retained spherical silhouettes stay solid while cut edges retain occlusion',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;let D;
  G.scene3=(...args)=>(D=scene3(...args));
  try{
    lab.board.resize(1023,581);lab.setViewportWidth(1024);
    for(const remKind of['three','seven']){
      const p=build(lab,'sv3-7',{remR:3,remKind})[0],before=JSON.stringify(lab.s),rendered=render(lab,p,9.8),mesh=p.model.geometry,runs=api.edgeVisibility(G,D,mesh),silhouettes=(mesh.silhouetteParts||[mesh]).flatMap(part=>G.silLines(part,D.vw));
      assert.equal(runs.filter(r=>r.silhouette).length,silhouettes.length);assert.ok(silhouettes.length>0);
      assert.ok(runs.filter(r=>r.silhouette).every(r=>!r.hidden));
      const same=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<1e-7;
      for(const[a,b]of silhouettes){const x=D.P(a),y=D.P(b);assert.ok(rendered.paths.some(path=>!path.options.dash&&path.options.color==='ink'&&path.points.length===2&&same(path.points[0],x)&&same(path.points[1],y)),'retained analytic silhouette has a solid production path');}
      const away=scene3(lab.board,{svYaw:-60,svPitch:0},{tab:'review'}),occluded=api.edgeVisibility(G,away,mesh);
      assert.ok(occluded.some(r=>!r.silhouette&&r.hidden),'turning away exposes real cut-edge occlusion, which must remain dashed');
      assert.equal(JSON.stringify(lab.s),before);
    }
    const cavity=api.cavityMesh(G,{r2:6,r1:3,h2:8,h1:4});assert.equal(cavity.convexOuterSilhouette,undefined,'the exemption cannot disable real cavity occlusion');
  }finally{G.scene3=scene3;}
});

test('visual regression: removed cone-frustum cap keeps a curved outline without radial subdivision spokes',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;let bodies=[];
  G.scene3=(...args)=>{const D=scene3(...args),body=D.body;D.body=bd=>{bodies.push(bd);return body(bd);};return D;};
  try{
    for(const[viewport,w,h]of[[1440,1439,713],[820,820,880],[1024,1023,581],[390,390,598]]){
      lab.board.resize(w,h);lab.setViewportWidth(viewport);
      const p=build(lab,'sv4-2',{svAxis2:'leg',s42J:3,s42K:1}).find(p=>p.legacyLabel==='부피'),before=JSON.stringify(lab.s);
      for(const t of[4.1,5.5,7.3]){
        bodies=[];const r=render(lab,p,t),cap=bodies.find(bd=>bd.fill==='rose')?.mesh;assert.ok(cap?.rev,'the supplemental cone must carry native curved-surface metadata');
        const m=p.model.proof;near(Math.max(...cap.faces.flatMap(f=>f.pts.map(p=>p.y))),m.h2);near(Math.min(...cap.faces.flatMap(f=>f.pts.map(p=>p.y))),m.h);
        const nonRim=cap.edges.filter(e=>Math.abs(e.a.y-e.b.y)>1e-8);assert.ok(nonRim.every(e=>e.smooth),'sampling generators are not true cone edges');
        const d=scene3(lab.board,p.model.camera,{tab:'review'});assert.equal(G.silLines(cap,d.vw).length,2,'a full cone retains its two true view-dependent generators');
        const longRose=r.paths.filter(path=>path.options.color==='rose'&&!path.options.dash&&path.points.length===2&&Math.hypot(path.points[0].x-path.points[1].x,path.points[0].y-path.points[1].y)>m.h1*.6);
        assert.ok(longRose.length<=6,`${viewport}@${t}: radial cone sampling spokes leaked into production drawing`);
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }finally{G.scene3=scene3;}
});

test('visual regression: sector and half-round prism strips close at both actual horizontal extrema',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;let D;
  G.scene3=(...args)=>(D=scene3(...args));
  try{
    for(const[w,h]of[[1439,713],[820,880],[1023,581],[390,598]]){
      lab.board.resize(w,h);lab.setViewportWidth(w);
      for(const[id,state]of[['sv1-2',{sR2:4,sTh:90,sH2:7}],['sv1-2',{sR2:7,sTh:240,sH2:9}],['sv1-5',{sW:4,sRr:2,sH5:5}],['sv1-5',{sW:9,sRr:4,sH5:7}]]){
        const p=build(lab,id,state)[0],before=JSON.stringify(lab.s),drawn=render(lab,p,9.8),geometry=p.model.geometry,poses=G.netPose(geometry.net,1);
        const sidePoints=geometry.lat.flatMap(k=>geometry.net.pieces[k].pts.map(q=>D.P(G.applyT(poses[k],q)))),xs=sidePoints.map(p=>p.x),ys=sidePoints.map(p=>p.y),y0=Math.min(...ys),y1=Math.max(...ys);
        near(y1-y0,p.model.h);
        // These two extremal vertical segments follow from the actual laid-out
        // lateral surface, without consulting edge kind or parent metadata.
        for(const x of[Math.min(...xs),Math.max(...xs)])assert.ok(drawn.paths.some(path=>path.points.length===2&&path.options.color==='ink'&&!path.options.dash&&path.points.every(p=>Math.abs(p.x-x)<1e-7)&&Math.abs(Math.min(...path.points.map(p=>p.y))-y0)<1e-7&&Math.abs(Math.max(...path.points.map(p=>p.y))-y1)<1e-7),`${id}, width ${w}: open lateral-strip end`);
        assert.equal(JSON.stringify(lab.s),before);
      }
    }
  }finally{G.scene3=scene3;}
});
