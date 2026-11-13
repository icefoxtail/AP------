import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {load} from './helpers/polyhedra-lesson-runtime.mjs';
const api=createRequire(import.meta.url)('../kit/apl-g7-short-polyhedra.js');
const near=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<=eps*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const distance=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z);
const plain=x=>JSON.parse(JSON.stringify(x));
const coords=p=>[p.x,p.y,p.z];
const vec=(a,b)=>[b.x-a.x,b.y-a.y,b.z-a.z];
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.hypot(...a);
const point=a=>({x:a[0],y:a[1],z:a[2]});

test('native math renderer preserves strict regular-solid corner comparisons and all proof formulas',async()=>{
  const katex=createRequire(import.meta.url)('../kit/vendor/katex/katex.min.js'),lab=await load({katex});
  for(const [p,q,sign] of [[3,3,'<'],[6,3,'='],[6,4,'>']]){
    for(const plan of build(lab,'p2-1',{phPp:p,phQq:q})){
      const source=plan.frame(plan.duration,plan.model).formula,html=lab.renderMath(source);
      assert.ok(!html.includes('$')&&!html.includes('katex-error'),'the browser renderer consumes the whole expression');
      const semantics=html.match(/<semantics>([\s\S]*?)<annotation/);
      assert.ok(semantics,'a real MathML expression is rendered');
      const visible=semantics[1].replace(/<[^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
      assert.equal(visible,`${q}×${180-360/p}°=${q*(180-360/p)}°${sign}360°`);
    }
  }
  for(const key of Object.keys(api.registry))for(const plan of build(lab,key.split('/')[1]))for(const t of [0,...plan.stops,plan.duration]){
    const source=plan.frame(t,plan.model).formula;if(!source)continue;
    const html=lab.renderMath(source);
    assert.ok(!html.includes('$')&&!html.includes('katex-error')&&html.includes('class="katex"'),`${plan.id}@${t}: formula renders completely`);
  }
});
function capture(b,p,t){
  const texts=[],paths=[],oldText=b._text,oldPath=b.path;
  b._text=function(x,y,text,...rest){if(text!=null)texts.push(String(text));return oldText.call(this,x,y,text,...rest);};
  b.path=function(points,options){paths.push({points:points.map(q=>b.toS(q)),options});return oldPath.call(this,points,options);};
  try{b.begin();p.draw(b,t,p.model);b.end();return{texts,paths};}finally{b._text=oldText;b.path=oldPath;}
}
function build(lab,id,values={}){lab.go(id);Object.assign(lab.s,plain(values));const before=JSON.stringify(lab.s),plans=api.registry[`g7-polyhedra/${id}`](lab,lab.s);assert.equal(JSON.stringify(lab.s),before);return plans;}

test('registered polyhedron questions preserve current native inputs and exact legacy labels',async()=>{
  const lab=await load(),box={window:{}};vm.createContext(box);
  for(const p of ['a','b','c'])vm.runInContext(fs.readFileSync(new URL(`../labs/g7-polyhedra/lesson-${p}.js`,import.meta.url),'utf8'),box);
  const native=box.window.APL_LESSONS['g7-polyhedra'];
  assert.equal(lab.list.length,26);assert.equal(Object.keys(api.registry).length,26);
  assert.deepEqual(Object.keys(api.registry).sort(),Array.from(lab.list,s=>`g7-polyhedra/${s.id}`).sort());
  let total=0;
  for(const[key,build]of Object.entries(api.registry)){
    const id=key.split('/')[1];lab.go(id);lab.s.phN=9;lab.s.phN8=7;lab.s.phCut=.37;lab.s.phCut2=.63;lab.s.phF=9;
    const before=JSON.stringify(lab.s),plans=build(lab,lab.s),rows=Array.isArray(native[id])?native[id]:[native[id]];
    assert.deepEqual(plans.map(p=>p.legacyLabel).sort(),Array.from(rows,r=>r.label||'').sort());
    assert.deepEqual(api.lessonInfo[key],plans.map(p=>({legacyLabel:p.legacyLabel,duration:p.duration})));
    for(const p of plans){
      total++;
      assert.ok(p.duration>0&&p.duration<10);assert.ok(p.stops.every(t=>t>=0&&t<p.duration));
      assert.equal(p.frame(0,p.model).answer,false);assert.equal(p.frame(p.duration,p.model).answer,true);
      assert.equal(JSON.stringify(p.model.s.phQ),JSON.stringify(lab.s.phQ));
    }
    assert.equal(JSON.stringify(lab.s),before);
  }
  assert.equal(total,58);
});

test('face edge and vertex groups exactly partition independent n-gon incidence counts',async()=>{
  const lab=await load();
  for(const[id,kind]of[['p1-1','prism'],['p1-2','pyr'],['p1-3','fr']])for(const n of[3,4,5,8,12]){
    lab.go(id);lab.s.phN=n;lab.s.phN8=Math.min(8,n);const d=api.bind(id,lab,lab.s),S=d.M.S,nn=d.M.n;
    const edgeSet=new Set();const incidence=new Map();
    for(const f of S.F)for(let j=0;j<f.i.length;j++){
      const edge=[f.i[j],f.i[(j+1)%f.i.length]].sort((a,b)=>a-b).join(':');edgeSet.add(edge);incidence.set(edge,(incidence.get(edge)||0)+1);
    }
    const expected=kind==='pyr'?{F:nn+1,E:2*nn,V:nn+1}:{F:nn+2,E:3*nn,V:2*nn};
    assert.equal(S.F.length,expected.F);assert.equal(edgeSet.size,expected.E);assert.equal(S.V.length,expected.V);
    assert.ok([...incidence.values()].every(n=>n===2));assert.equal(S.V.length-edgeSet.size+S.F.length,2);
    for(const target of ['F','E','V']){
      const rows=api.groups(S,target).flat();assert.equal(rows.length,expected[target]);assert.equal(new Set(rows).size,rows.length);
      assert.equal(api.countPose(S,target,0).filter(r=>r.visible).length,0);
      assert.equal(api.countPose(S,target,5.6).filter(r=>r.visible).length,expected[target]);
    }
  }
});

test('detached side rotates rigidly and its second motion is horizontal in projection',async()=>{
  const lab=await load();lab.go('p1-4');
  for(const kind of ['prism','pyr','fr'])for(const n of [3,5,8])for(const yaw of [-60,-30,20]){
    Object.assign(lab.s,{phK4:kind,phN8:n,phYaw:yaw,phPitch:34,phFace:n});const d=api.bind('p1-4',lab,lab.s),{G,M}=d,S=M.S;
    const original=S.F[M.fi].i.map(i=>S.V[i]);
    for(const u of[0,.25,.6,1]){const moved=api.facingFace(d,S,M.fi,u,0);for(let i=0;i<moved.length;i++)for(let j=0;j<i;j++)near(distance(moved[i],moved[j]),distance(original[i],original[j]));}
    const turned=api.facingFace(d,S,M.fi,1,0),shifted=api.facingFace(d,S,M.fi,1,3.4),cam=G.camOf(d.s);
    for(let i=0;i<turned.length;i++){const a=G.proj(cam,turned[i]),b=G.proj(cam,shifted[i]);near(a.y,b.y);near(b.x-a.x,3.4);near(a.d,b.d);}
    const depths=turned.map(p=>G.proj(cam,p).d);depths.forEach(x=>near(x,depths[0]));
  }
});

test('Euler application binds the current generated question and its requested missing quantity',async()=>{
  const lab=await load();lab.go('p1-7');
  for(const id of ['prism','pyr','fr','cube','octa','dodeca','icosa','tetra'])for(const ask of ['V','E','F']){
    lab.s.phQ={id,n:7,ask};const p=api.registry['g7-polyhedra/p1-7'](lab,lab.s)[1],m=p.model.M;
    assert.equal(m.ask,ask);assert.equal(m.S.V.length,m.V);assert.equal(m.S.E.length,m.E);assert.equal(m.S.F.length,m.F);assert.equal(m.V-m.E+m.F,2);
    for(const k of ['V','E','F'].filter(k=>k!==ask))assert.ok(p.given.includes(`${k}=${m[k]}`));
    assert.ok(p.given.includes(`${ask}=?`));assert.ok(p.frame(p.duration,p.model).formula.includes(`${ask}=${m[ask]}`));
  }
});

test('production Board renders each registered proof at stage boundaries without changing explorer state',async()=>{
  const lab=await load(),b=lab.board;
  for(const[width,height]of[[1440,900],[820,1180],[1024,768],[390,420]]){
    b.resize(width,height);lab.setViewportWidth(width);
    for(const[key,build]of Object.entries(api.registry)){
      lab.go(key.split('/')[1]);const before=JSON.stringify(lab.s);
      for(const p of build(lab,lab.s))for(const t of [0,...p.stops,p.duration]){
        let paths=0;const original=b.path;b.path=function(...args){paths++;return original.apply(this,args);};
        try{b.begin();p.draw(b,t,p.model);b.end();}finally{b.path=original;}
        assert.ok(paths>0,`${p.id}@${t}: missing original figure`);
        const f=p.frame(t,p.model);assert.ok(f.label&&!/undefined|NaN|Infinity/.test(f.label+f.formula));
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }
});

test('angle fans, face incidence and dual adjacency agree with measured polygons and the original solid',async()=>{
  const lab=await load(),G=lab.api;
  for(let p=3;p<=6;p++)for(let q=3;q<=6;q++){
    const polygons=api.cornerPolygons(p,q);
    assert.equal(polygons.length,q);
    polygons.forEach(poly=>{
      assert.equal(poly.length,p);
      poly.forEach((v,i)=>near(Math.hypot(v.x-poly[(i+1)%p].x,v.y-poly[(i+1)%p].y),1));
      const a=poly[1],b=poly.at(-1),angle=Math.acos(Math.max(-1,Math.min(1,(a.x*b.x+a.y*b.y)/(Math.hypot(a.x,a.y)*Math.hypot(b.x,b.y)))))*180/Math.PI;
      near(angle,180-360/p);
    });
  }
  for(const kind of ['tetra','cube','octa','dodeca','icosa']){
    const plans=build(lab,'p4-4',{phSel7:kind,phDu:.43,phQ:{k:'cube',ask:'E'}}),{S,T}=plans[0].model.M.dual;
    const centers=S.F.map(f=>point([0,1,2].map(k=>f.i.reduce((sum,i)=>sum+coords(S.V[i])[k],0)/f.i.length)));
    const sourceFace=T.V.map(v=>centers.findIndex(c=>distance(c,v)<1e-8));
    assert.equal(new Set(sourceFace).size,S.F.length);assert.ok(sourceFace.every(i=>i>=0));
    const used=new Set();
    T.E.forEach(e=>{
      const i=sourceFace[e.a],j=sourceFace[e.b],shared=S.F[i].i.filter(v=>S.F[j].i.includes(v));
      assert.equal(shared.length,2);const key=shared.slice().sort((a,b)=>a-b).join(':');assert.ok(!used.has(key));used.add(key);
    });
    assert.equal(used.size,S.E.length);
    const sourceVertices=T.F.map(f=>S.V.findIndex((_,vi)=>f.i.every(v=>S.F[sourceFace[v]].i.includes(vi))));
    assert.ok(sourceVertices.every(i=>i>=0));assert.equal(new Set(sourceVertices).size,S.V.length);
    assert.deepEqual([T.V.length,T.E.length,T.F.length],[S.F.length,S.E.length,S.V.length]);
    assert.equal(plans[0].model.M.k,kind);assert.equal(lab.s.phDu,.43);assert.deepEqual(plain(lab.s.phQ),{k:'cube',ask:'E'});
    const faces=S.F.map((_,i)=>i),edgeCounts=api.incidenceCounts(S,'E',faces),vertexCounts=api.incidenceCounts(S,'V',faces);
    assert.ok(edgeCounts.every(n=>n===2));assert.ok(vertexCounts.every(n=>n===G.PLAT[kind].q));
    near(edgeCounts.reduce((a,b)=>a+b,0),S.F.reduce((sum,f)=>sum+f.i.length,0));
  }
});

// Enumerate free hexominoes independently of the native list. Integer frame
// transport across a shared square edge determines the six cube directions;
// it uses neither the native hinge rotation nor its overlap flags.
const negate=a=>a.map(x=>-x);
function cellSignature(cells){
  const variants=[];
  for(const flip of [-1,1])for(let r=0;r<4;r++){
    const transformed=cells.map(([x0,y0])=>{let x=x0*flip,y=y0;for(let i=0;i<r;i++)[x,y]=[-y,x];return[x,y];});
    const x0=Math.min(...transformed.map(p=>p[0])),y0=Math.min(...transformed.map(p=>p[1]));
    variants.push(transformed.map(([x,y])=>[x-x0,y-y0]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(p=>p.join(',')).join(';'));
  }
  return variants.sort()[0];
}
function foldsToCube(cells){
  if(cells.length!==6)return false;
  const index=new Map(cells.map((p,i)=>[p.join(','),i])),frames=new Map([[0,{u:[1,0,0],v:[0,1,0],n:[0,0,1]}]]),todo=[0];
  for(let k=0;k<todo.length;k++){
    const i=todo[k],[x,y]=cells[i],f=frames.get(i);
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){
      const j=index.get([x+dx,y+dy].join(','));if(j==null)continue;
      const next=dx===1?{u:negate(f.n),v:f.v,n:f.u}:dx===-1?{u:f.n,v:f.v,n:negate(f.u)}:dy===1?{u:f.u,v:negate(f.n),n:f.v}:{u:f.u,v:f.n,n:negate(f.v)};
      if(frames.has(j)){if(['u','v','n'].some(key=>frames.get(j)[key].some((value,axis)=>value!==next[key][axis])))return false;}
      else{frames.set(j,next);todo.push(j);}
    }
  }
  return frames.size===6&&new Set([...frames.values()].map(f=>f.n.join(','))).size===6;
}
test('the eleven cube nets exactly match an independent enumeration of all 35 free hexominoes',async()=>{
  const lab=await load();let shapes=new Map([['0,0',[[0,0]]]]);
  for(let n=2;n<=6;n++){
    const next=new Map();
    for(const cells of shapes.values())for(const[x,y]of cells)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){
      const p=[x+dx,y+dy];if(cells.some(q=>q[0]===p[0]&&q[1]===p[1]))continue;
      const expanded=cells.concat([p]);next.set(cellSignature(expanded),expanded);
    }
    shapes=next;
  }
  assert.equal(shapes.size,35);
  const valid=[...shapes].filter(([,cells])=>foldsToCube(cells)).map(([key])=>key).sort();
  assert.equal(valid.length,11);assert.deepEqual(Array.from(lab.api.CUBE_NETS,n=>cellSignature(n.cells)).sort(),valid);
  assert.ok(lab.api.BAD_NETS.every(n=>!foldsToCube(n.cells)));
});

test('net lettering, moving point identities, outward normals and partial-fold entry geometry remain correct',async()=>{
  const lab=await load();
  for(const id of ['p3-2','p3-5','p3-6'])for(const phNm of [0,3]){
    const ps=build(lab,id,{phNm,phFold:0});
    for(const p of ps){
      const{G,M}=p.model,net=M.net,saved=JSON.stringify(lab.s),entry=capture(lab.board,p,0),closed=net.at(1),center=point([0,1,2].map(axis=>closed.flat().reduce((sum,v)=>sum+coords(v)[axis],0)/closed.flat().length));
      if(net.pt.length<=26)for(const label of net.ptName)assert.ok(entry.texts.includes(label),`${p.id}: given letter ${label} missing at t=0`);
      else{assert.ok(entry.texts.includes('기준점'),'dense nets identify the selected point without inventing letters');assert.match(p.given,/노란 기준점/);}
      for(const f of [0,.21,.64,1]){
        const faces=net.at(f);
        faces.forEach((points,i)=>points.forEach((a,j)=>points.forEach((b,k)=>near(distance(a,b),distance(net.faces[i].poly[j],net.faces[i].poly[k])))));
      }
      const source=api.netPoint(net,M.point,1);
      assert.deepEqual(Array.from(api.matchingPoints(net,M.point)).sort((a,b)=>a-b),Array.from(net.pt,(_,k)=>k).filter(k=>k!==M.point&&distance(api.netPoint(net,k,1),source)<1e-7).sort((a,b)=>a-b));
      closed.forEach((points,i)=>{
        const n=cross(vec(points[0],points[1]),vec(points[0],points[2])).map(x=>x*p.model.netSigns[i]),c=point([0,1,2].map(k=>points.reduce((sum,v)=>sum+coords(v)[k],0)/points.length));
        assert.ok(dot(n,vec(center,c))>0,`${p.id}: face ${i} points outward`);
      });
      capture(lab.board,p,9.4);assert.equal(JSON.stringify(lab.s),saved);
    }
  }
  for(const phSolid of [0,1,2])for(const phFold of [0,.42,1]){
    const p=build(lab,'p3-4',{phSolid,phNet:0,phFold,phSeed:818})[phSolid],before=JSON.stringify(lab.s),initial=api.skewPose(p.model,0),closed=api.skewPose(p.model,2.6);
    near(initial.fold,phFold);near(closed.fold,1);assert.deepEqual(plain(initial.faces),plain(p.model.M.net.at(phFold)));
    const rendered=capture(lab.board,p,0),screen=initial.faces.flat().map(v=>lab.board.toS(p.model.G.proj(p.model.G.camOf(api.skewView(p.model,initial.fold).s),v)));
    for(const q of screen)assert.ok(rendered.paths.some(path=>path.points.some(p=>Math.hypot(p.x-q.x,p.y-q.y)<1e-6)),'the actual initial net corner is drawn');
    capture(lab.board,p,9.4);assert.equal(JSON.stringify(lab.s),before);
  }
});

test('projected crossings cut the farther spatial edge, and unfolding preserves both legs of the surface path',async()=>{
  const lab=await load(),G=lab.api,sol={verts:{A:G.v3(-1,0,1),B:G.v3(1,0,1),C:G.v3(0,-1,0),D:G.v3(0,1,0)},edges:[{u:'A',v:'B',key:'AB'},{u:'C',v:'D',key:'CD'}]};
  const pieces=api.projectedEdgePieces(sol,{P:p=>({x:p.x,y:p.y}),depth:p=>p.z,b:{k:100}},G);
  assert.equal(pieces.get('AB').length,2);assert.equal(pieces.get('CD').length,1);
  assert.ok(pieces.get('AB')[0][1].x<0&&pieces.get('AB')[1][0].x>0);
  for(const a of [4,8,14])for(const r of [.1,.37,.9])for(const fold of [0,.4,1]){
    const p=build(lab,'p3-7',{phEdge:a,phAnt:r,phFold:fold})[0];
    for(const t of [0,.8,1.7,3.2]){
      const q=api.shortestGeometry(p.model,t);near(distance(q.E,q.F),a);near(distance(q.F,q.end),a);near(distance(q.A,q.P),a*Math.hypot(r,1));near(distance(q.P,q.end),a*Math.hypot(1-r,1));
    }
    const q=api.shortestGeometry(p.model,9.4);near(q.r,.5);near(distance(q.E,q.P),a/2);near(distance(q.A,q.P)+distance(q.P,q.end),distance(q.A,q.end));
  }
});

function planeHits(vertices,edges,n,d){
  const points=[],add=p=>{if(!points.some(q=>distance(p,q)<1e-7))points.push(p);};
  edges.forEach(([i,j])=>{
    const a=vertices[i],b=vertices[j],sa=dot(n,coords(a))-d,sb=dot(n,coords(b))-d;
    if(Math.abs(sa)<1e-8)add(a);if(Math.abs(sb)<1e-8)add(b);
    if(sa*sb<0&&Math.abs(sa)>1e-8&&Math.abs(sb)>1e-8){const u=sa/(sa-sb);add(point(coords(a).map((x,k)=>x+(coords(b)[k]-x)*u)));}
  });
  return points;
}
test('cube sections retain the actual plane and classify zero-area boundary contacts correctly',async()=>{
  const lab=await load();
  for(const[a,b,d]of[[45,45,0],[45,45,.7],[0,0,.2],[45,0,.1],[24,14,.37],[45,45,1],[45,45,-1],[45,0,1],[0,0,1]]){
    const p=build(lab,'p4-1',{phTa:a,phTb:b,phTd:d})[0],M=p.model.M,vertices=M.cube.V,edges=[];
    for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++)if(Math.abs(distance(vertices[i],vertices[j])-2)<1e-7)edges.push([i,j]);
    assert.equal(edges.length,12);
    const n=[Math.cos(-Math.PI/6),-Math.sin(-Math.PI/6),0],normalLength=Math.hypot(1,Math.tan(a*Math.PI/180),Math.tan(b*Math.PI/180)),offset=d*(1+Math.tan(a*Math.PI/180)+Math.tan(b*Math.PI/180))/normalLength;
    const expected=planeHits(vertices,edges,n,offset);assert.equal(M.sectionPoints.length,expected.length);
    M.sectionPoints.forEach(v=>assert.ok(expected.some(q=>distance(v,q)<1e-7)));
    M.plane.forEach(v=>near(dot(n,coords(v)),offset));
    const end=p.frame(9.4,p.model);assert.ok(!/[012]각형/.test(end.label));
    if(expected.length<3)assert.match(end.label,/넓이가 있는 다각형 단면은 생기지/);
    for(const t of [0,2.6,5.6,9.4])capture(lab.board,p,t);
  }
});

test('all 56 three-vertex sections include every plane-edge intersection and keep current labels and expansion',async()=>{
  const lab=await load(),CS=lab.api.cubeSec,letters='ABCDEFGH'.split(''),vertices=letters.map(L=>point(CS.pos(L))),edges=[];
  for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(Math.abs(distance(vertices[i],vertices[j])-2)<1e-7)edges.push([i,j]);
  let count=0;
  for(let i=0;i<6;i++)for(let j=i+1;j<7;j++)for(let k=j+1;k<8;k++){
    const tri=[letters[i],letters[j],letters[k]],n=cross(vec(vertices[i],vertices[j]),vec(vertices[i],vertices[k])),d=dot(n,coords(vertices[i])),expected=planeHits(vertices,edges,n,d);
    const ps=build(lab,'p4-3',{phC3:tri,phTe:.57,phQ:{tri:['B','D','E']}});
    for(const p of ps){
      const M=p.model.M;assert.deepEqual(Array.from(M.givenLetters),tri);assert.equal(M.sectionPoints.length,expected.length);
      M.sectionPoints.forEach(v=>assert.ok(expected.some(q=>distance(v,q)<1e-7)));
      near(api.sectionExpansion(p.model,0),.57);near(api.sectionExpansion(p.model,5.6),1);
      for(const u of [0,.37,1])CS.patchAt(M.section,u).forEach(v=>{near(dot(n,v),d);assert.ok(v.every(c=>Math.abs(c)<=1+1e-8));});
      assert.ok(p.given.includes(tri.join('·')));assert.ok(!['A·G·H','B·D·E','A·B·C'].includes(p.label));
    }
    if(i===0&&j===1&&k===2){const entry=capture(lab.board,ps[0],0);letters.forEach(L=>assert.ok(entry.texts.includes(L)));}
    count++;
  }
  assert.equal(count,56);
  const fallback=build(lab,'p4-3',{phC3:['A'],phTe:1,phQ:{tri:['B','D','E']}})[0];
  assert.match(fallback.given,/현재 생성 문제 B·D·E/);assert.deepEqual(Array.from(lab.s.phC3),['A']);
});

test('truncation vertices stay on original edges and every intermediate solid preserves independent Euler incidence',async()=>{
  const lab=await load();
  for(const kind of ['tetra','cube','octa','dodeca','icosa'])for(const ratio of [.05,.17,1/3,.45]){
    const ps=build(lab,'p4-2',{phSel6:kind,phTr:ratio,phQ:{k:'cube',ask:'F'}}),d=ps[0].model,{original:O,S}=d.M;
    near(d.M.r,ratio);assert.equal(d.M.k,kind);
    const incidence=new Map();S.F.forEach(f=>f.i.forEach((v,i)=>{const key=[v,f.i[(i+1)%f.i.length]].sort((a,b)=>a-b).join(':');incidence.set(key,(incidence.get(key)||0)+1);}));
    assert.ok([...incidence.values()].every(n=>n===2));assert.equal(S.V.length-incidence.size+S.F.length,2);
    assert.equal(S.F.filter(f=>f.cut).length,O.V.length);assert.equal(S.F.filter(f=>!f.cut).length,O.F.length);
    assert.deepEqual([S.V.length,incidence.size,S.F.length],[2*O.E.length,3*O.E.length,O.F.length+O.V.length]);
    for(const u of [.1,.4,1]){
      const pose=api.truncationPose(d,u);
      pose.V.forEach(p=>{
        const edge=O.E.find(e=>Math.abs(distance(O.V[e.a],p)+distance(p,O.V[e.b])-distance(O.V[e.a],O.V[e.b]))<1e-8);assert.ok(edge);
        const t=distance(O.V[edge.a],p)/distance(O.V[edge.a],O.V[edge.b]);near(Math.min(t,1-t),u*ratio);
      });
      pose.F.forEach(f=>{const points=f.i.map(i=>pose.V[i]),n=cross(vec(points[0],points[1]),vec(points[0],points[2]));assert.ok(norm(n)>1e-9);points.forEach(p=>near(dot(n,vec(points[0],p)),0));});
    }
    assert.equal(lab.s.phTr,ratio);assert.deepEqual(plain(lab.s.phQ),{k:'cube',ask:'F'});
  }
});

test('net boundary regression clips only the genuinely occluded interval and keeps coplanar hinges solid',()=>{
  const P=(x,y,z)=>({x,y,z}),D={P:p=>({x:p.x,y:p.y}),depth:p=>p.z};
  const rear=[P(-2,0,1),P(2,0,1),P(2,-2,1),P(-2,-2,1)],front=[P(-1,-1,0),P(1,-1,0),P(1,1,0),P(-1,1,0)];
  const edge=api.netBoundaryEdges(D,[rear,front]).find(e=>distance(e.a,rear[0])<1e-9&&distance(e.b,rear[1])<1e-9);
  assert.deepEqual(edge.segments.map(s=>s.hidden),[false,true,false]);near(edge.segments[1].lo,.25,1e-7);near(edge.segments[1].hi,.75,1e-7);
  const flat=api.netBoundaryEdges(D,[rear.map(p=>({...p,z:0})),front]);assert.ok(flat.every(e=>e.segments.every(s=>!s.hidden)));
  const paired=api.netBoundaryEdges(D,[[P(0,0,0),P(1,0,0),P(1,1,0),P(0,1,0)],[P(1,0,0),P(2,0,0),P(2,1,0),P(1,1,0)]]);
  assert.equal(paired.length,7);assert.equal(paired.filter(e=>e.faces.length===2).length,1,'a real shared hinge has only one stroke candidate');
});

function rayHidden(p,viewer,faces){
  for(const poly of faces){
    const n=cross(vec(poly[0],poly[1]),vec(poly[0],poly[2])),den=dot(n,viewer);if(Math.abs(den)<1e-10)continue;
    const t=dot(n,vec(p,poly[0]))/den;if(t<=1e-7)continue;
    const hit=point(coords(p).map((x,i)=>x+t*viewer[i]));
    if(poly.every((a,i)=>dot(cross(vec(a,poly[(i+1)%poly.length]),vec(a,hit)),n)>=-1e-8))return true;
  }
  return false;
}
test('net boundary regression agrees with independent 3D ray-plane occlusion through partial and closed folds',async()=>{
  const lab=await load(),cases=[['p3-2',0],['p3-5',0],['p3-6',0],['p3-6',1],['p3-6',2]];
  for(const[id,choice]of cases){
    const p=build(lab,id)[choice],d=p.model,net=d.M.net,before=JSON.stringify(lab.s);
    for(const fold of[0,.35,.69,1])for(const yaw of[-52,26]){
      const faces=net.at(fold),s={...d.s,phYaw:yaw,phPitch:84-56*fold},cam=d.G.camOf(s),D=d.G.scene3(lab.board,s,{}),viewer=[-cam.sy*cam.cp,-cam.cy*cam.cp,cam.sp],edges=api.netBoundaryEdges(D,faces);
      for(const edge of edges){
        near(edge.segments.reduce((s,x)=>s+x.hi-x.lo,0),1);
        for(const piece of edge.segments){
          if(piece.hi-piece.lo<1e-6)continue;
          const u=(piece.lo+piece.hi)/2,q=point(coords(edge.a).map((x,i)=>x+(coords(edge.b)[i]-x)*u));
          assert.equal(piece.hidden,rayHidden(q,viewer,faces),`${id}/${choice} fold ${fold}: independent ray-plane mismatch`);
        }
      }
      if(!fold)assert.ok(edges.every(e=>e.segments.every(s=>!s.hidden)));
      if(fold===1){
        assert.equal(edges.length,faces.reduce((s,f)=>s+f.length,0)/2);assert.ok(edges.every(e=>e.faces.length===2));
        const center=point([0,1,2].map(k=>faces.flat().reduce((sum,p)=>sum+coords(p)[k],0)/faces.flat().length));
        const visible=faces.map(poly=>{let n=cross(vec(poly[0],poly[1]),vec(poly[0],poly[2]));if(dot(n,vec(center,poly[0]))<0)n=n.map(x=>-x);return dot(n,viewer)>1e-9;});
        for(const e of edges){const hidden=e.segments.filter(s=>s.hidden).reduce((s,p)=>s+p.hi-p.lo,0);assert.ok(e.faces.some(i=>visible[i])?hidden<1e-5:hidden>1-1e-5,'closed-solid face incidence and depth occlusion agree');}
      }
    }
    assert.equal(JSON.stringify(lab.s),before);
  }
});

test('net boundary regression strokes each shared production segment once without solid panel underlays',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;let D;
  G.scene3=(...args)=>(D=scene3(...args));
  try{
    for(const[viewport,w,h]of[[1440,1439,713],[820,820,920],[1024,1023,581],[390,390,638]]){
      lab.board.resize(w,h);lab.setViewportWidth(viewport);
      for(const id of['p3-1','p3-2','p3-3','p3-5','p3-6','p3-8']){
        const plans=build(lab,id),before=JSON.stringify(lab.s);
        for(const p of plans)for(const t of[0,3.9,9.4]){
          const r=capture(lab.board,p,t);
          if(id==='p3-1'&&p.legacyLabel==='종류 수'&&t>=5.7)continue;
          assert.ok(r.paths.filter(x=>x.options.close).every(x=>x.options.color===null),'face fills cannot redraw a continuous outline under the dashed edges');
          const edges=api.netBoundaryEdges(D,p.model.M.net.at(api.netFold(p.model,t))),same=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<1e-6;
          for(const edge of edges)for(const piece of edge.segments){
            const at=u=>G.add3(edge.a,G.mul3(G.sub3(edge.b,edge.a),u)),a=lab.board.toS(D.P(at(piece.lo))),b=lab.board.toS(D.P(at(piece.hi)));
            if(Math.hypot(a.x-b.x,a.y-b.y)<.001)continue;
            const strokes=r.paths.filter(x=>x.points.length===2&&Boolean(x.options.dash)===piece.hidden&&((same(a,x.points[0])&&same(b,x.points[1]))||(same(a,x.points[1])&&same(b,x.points[0]))));
            assert.equal(strokes.length,1,`${id} ${p.legacyLabel}@${t}, width ${viewport}: repeated or missing shared edge`);
          }
        }
        assert.equal(JSON.stringify(lab.s),before);
      }
    }
  }finally{G.scene3=scene3;}
});

test('skew display regression applies native camera offsets and marks actual shared green endpoints',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;let D;
  G.scene3=(...args)=>(D=scene3(...args));
  try{
    for(const[viewport,w,h]of[[1440,1439,713],[820,820,920],[1024,1023,581],[390,390,638]]){
      lab.board.resize(w,h);lab.setViewportWidth(viewport);
      const plans=build(lab,'p3-4',{phYaw:-4,phPitch:66,phFold:1}),before=JSON.stringify(lab.s);
      for(const p of plans){
        const r=capture(lab.board,p,9.4),kind=p.model.M.net.kind,kp=kind==='cube'?38:kind==='tetra'?46:48;
        near(D.s.phYaw,kind==='cube'?-22:-28);near(D.s.phPitch,66-kp);
        assert.equal(p.model.s.phYaw,-4);assert.equal(p.model.s.phPitch,66);assert.equal(p.model.s.phFold,1);
        const {sol,ref,c}=p.model.M,skew=sol.edges.filter(e=>G.relEdges(sol,ref,e)==='skew');assert.equal(skew.length,c.nSkew);
        const degree=new Map();skew.forEach(e=>[e.u,e.v].forEach(k=>degree.set(k,(degree.get(k)||0)+1)));
        for(const[k,count]of degree)if(count>1)assert.ok(r.texts.includes(k),'the actual junction is labelled so adjacent edges cannot read as one long edge');
        if(kind==='cube')for(const[k,count]of degree)if(count===2){
          const neighbors=skew.filter(e=>e.u===k||e.v===k).map(e=>D.P(sol.verts[e.u===k?e.v:e.u])),p0=D.P(sol.verts[k]),u={x:neighbors[0].x-p0.x,y:neighbors[0].y-p0.y},v={x:neighbors[1].x-p0.x,y:neighbors[1].y-p0.y};
          assert.ok(Math.abs(u.x*v.y-u.y*v.x)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y))>.15,'the two cube edges meeting at the marked vertex are visibly non-collinear');
        }
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }finally{G.scene3=scene3;}
});

test('skew display regression preserves reference edge identity and single strokes through an actual half-fold',async()=>{
  const lab=await load(),G=lab.api,scene3=G.scene3;let D;
  G.scene3=(...args)=>(D=scene3(...args));
  try{
    for(const[viewport,w,h]of[[1440,1439,713],[820,820,920],[1024,1023,581],[390,390,638]]){
      lab.board.resize(w,h);lab.setViewportWidth(viewport);
      const plans=build(lab,'p3-4',{phFold:0,phYaw:-4,phPitch:66}),before=JSON.stringify(lab.s);
      for(const p of plans)for(const t of[1.2,1.55,1.9]){
        const rendered=capture(lab.board,p,t),pose=api.skewPose(p.model,t),faces=pose.faces,edges=api.netBoundaryEdges(D,faces),same=(a,b)=>distance(a,b)<1e-7,screenSame=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<1e-6;
        if(t===1.55){near(pose.fold,.5);assert.ok(edges.some(e=>e.segments.some(s=>s.hidden&&s.hi-s.lo>1e-4)),'the regression must exercise real partial-fold occlusion');}
        assert.ok(rendered.paths.filter(x=>x.options.close).every(x=>x.options.color===null));
        const references=[];faces.forEach((ps,i)=>ps.forEach((a,j)=>{if(p.model.M.net.edgeKey(i,j)===p.model.M.ref.key)references.push([a,ps[(j+1)%ps.length]]);}));
        for(const edge of edges){
          const reference=references.some(([a,b])=>(same(edge.a,a)&&same(edge.b,b))||(same(edge.a,b)&&same(edge.b,a)));
          for(const piece of edge.segments){
            const at=u=>G.add3(edge.a,G.mul3(G.sub3(edge.b,edge.a),u)),a=lab.board.toS(D.P(at(piece.lo))),b=lab.board.toS(D.P(at(piece.hi)));
            if(Math.hypot(a.x-b.x,a.y-b.y)<.001)continue;
            const paths=rendered.paths.filter(path=>path.points.length===2&&path.options.color===(reference?'amber':'muted')&&Boolean(path.options.dash)===piece.hidden&&((screenSame(a,path.points[0])&&screenSame(b,path.points[1]))||(screenSame(a,path.points[1])&&screenSame(b,path.points[0]))));
            assert.equal(paths.length,1,`${p.legacyLabel}@${t}: current reference or partial-fold edge was dropped or redrawn`);
          }
        }
      }
      assert.equal(JSON.stringify(lab.s),before);
    }
  }finally{G.scene3=scene3;}
});
