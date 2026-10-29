import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {Stop,isDomainCode,esc,overlaps} from './quadratic-inequality-chain-v1.mjs';
import {sphereCutModel,arcPoint,SPHERE_PLANES,AXES as CUT_AXES} from './sphere-parts.mjs';

// A solid figure (solid-figure-v1): prisms, pyramids, pyramid frusta, cylinders, cones, cone frusta, spheres and hemispheres drawn in ONE fixed
// orthographic projection (yaw 28 deg, pitch 20 deg: a textbook "dimetric" look; circles become axis-aligned ellipses), with hidden edges dashed by
// a depth test, vertex names, length labels beside their segments and optional highlights; cone and cone-frustum vessels may stand on their point
// (orientation APEX_DOWN) with a liquid level; a round solid may sit inside a cylinder (inside); right-angle, equal-length and angle marks may be
// drawn on named points. Or the NET of such a solid (polyhedra unfolded along a spanning tree of faces, cylinder and cone nets). The engine builds
// the 3D model from the plan; solid_figure_observer.py re-derives the same model from the plan alone (never from the engine's numbers) and checks
// the final SVG: visible/hidden per edge, vertex positions, ellipse axes and tangent lines, the liquid region, marks, nesting, net face congruence
// and adjacency, label values and places. A sphere may be cut by planes through its centre (cut:{kind}: half, quarter, eighth, 3/4, 7/8; sphere-parts.mjs).
export const SOLID_CAPABILITY='solid-figure-v1';
export const SOLID_MODEL_VERSION='SOLID_FIGURE_MODEL_v2',SOLID_SPEC_VERSION='SOLID_FIGURE_SPEC_v2',SOLID_SVG_VERSION='solid-figure-svg-v2';
const OBSERVER_SCRIPT=fileURLToPath(new URL('solid_figure_observer_worker.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const bad=code=>{throw Error(code);};
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const onlyKeys=(value,keys,code)=>{if(!isPlain(value)||Object.keys(value).some(key=>!keys.includes(key)))bad(code);};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};
const finite=x=>Number.isFinite(x);
const pos=(x,code)=>{if(typeof x!=='number'||!finite(x)||!(x>0)||x>1000)bad(code);return x;};

// --- projection -------------------------------------------------------------------------------------------------------------------------------
export const YAW_DEG=28,PITCH_DEG=20;
const YAW=YAW_DEG*Math.PI/180,PITCH=PITCH_DEG*Math.PI/180;
const cY=Math.cos(YAW),sY=Math.sin(YAW),cP=Math.cos(PITCH),sP=Math.sin(PITCH);
/** World (x right, y into the picture, z up) -> screen units (x right, y up). */
export const project=p=>[p[0]*cY+p[1]*sY,-p[0]*sP*sY+p[1]*sP*cY+p[2]*cP];
const VIEW=[sY*cP,-cY*cP,sP];// unit vector from the object toward the viewer
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mulv=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(a[0],a[1],a[2]);
const unit=a=>{const l=len(a);return l===0?a:mulv(a,1/l);};
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const EX=[cY,sY,0];// world direction of the screen's horizontal
const EY=[-sP*sY,sP*cY,cP];// world direction of the screen's vertical
const CUT_FRAME={view:VIEW,ex:EX,ey:EY};

// --- the 3D model -----------------------------------------------------------------------------------------------------------------------------
const NAME=/^[A-Z]′?$/u;
// One vertex may carry several names (the corners of a net that fold onto one point): written "M,A,I" as an entry of a names list, 2 to 4 names.
const NAME_MULTI=/^[A-Z]′?(?:,[A-Z]′?){1,3}$/u;
const nameOk=x=>NAME.test(x)||NAME_MULTI.test(x);
const LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/** A names string is written letter by letter; a letter may be followed by one prime (A′, B′). '.' means "no name". */
function nameTokens(text){return String(text).match(/[A-Z]′?|\./gu)??[];}
function polygonArea2(points){let s=0;for(let i=0;i<points.length;i++){const [a,b]=[points[i],points[(i+1)%points.length]];s+=a[0]*b[1]-b[0]*a[1];}return s/2;}
function segmentsCross(a,b,c,d){
  const o=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  const d1=o(a,b,c),d2=o(a,b,d),d3=o(c,d,a),d4=o(c,d,b),eps=1e-9;
  return ((d1>eps&&d2<-eps)||(d1<-eps&&d2>eps))&&((d3>eps&&d4<-eps)||(d3<-eps&&d4>eps));
}
function isSimple(points){
  const n=points.length;
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
    if(j===i+1||(i===0&&j===n-1))continue;
    if(segmentsCross(points[i],points[(i+1)%n],points[j],points[(j+1)%n]))return false;
  }
  return Math.abs(polygonArea2(points))>1e-9;
}
function isConvex(points){
  const n=points.length;let sign=0;
  for(let i=0;i<n;i++){
    const a=points[i],b=points[(i+1)%n],c=points[(i+2)%n];
    const z=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);
    if(Math.abs(z)<1e-9)return false;
    if(sign&&Math.sign(z)!==sign)return false;
    sign=Math.sign(z);
  }
  return true;
}
function basePolygon(base){
  if(!isPlain(base))bad('SOLID_BASE_INVALID');
  onlyKeys(base,['kind','width','depth','n','side','points','plane'],'SOLID_BASE_INVALID');
  const plane=base.plane??'XY';
  if(plane!=='XY'&&plane!=='XZ')bad('SOLID_BASE_INVALID');
  let points;
  if(base.kind==='RECT'){
    const w=pos(base.width,'SOLID_PARAM_INVALID'),d=pos(base.depth,'SOLID_PARAM_INVALID');
    points=[[0,0],[w,0],[w,d],[0,d]];
  }else if(base.kind==='REGULAR'){
    const n=base.n;
    if(!Number.isInteger(n)||n<3||n>8)bad('SOLID_PARAM_INVALID');
    const side=pos(base.side,'SOLID_PARAM_INVALID'),R=side/(2*Math.sin(Math.PI/n));
    // first side horizontal along the front (the bottom of a prism seen from above), counter-clockwise
    points=[...Array(n).keys()].map(k=>{const a=-Math.PI/2-Math.PI/n+2*Math.PI*k/n;return [r6(R*Math.cos(a)),r6(R*Math.sin(a))];});
  }else if(base.kind==='POLYGON'){
    if(!Array.isArray(base.points)||base.points.length<3||base.points.length>8||base.points.some(p=>!Array.isArray(p)||p.length!==2||p.some(c=>typeof c!=='number'||!finite(c)||Math.abs(c)>1000)))bad('SOLID_BASE_INVALID');
    points=base.points.map(p=>[...p]);
    if(!isSimple(points))bad('SOLID_BASE_NOT_SIMPLE');
  }else bad('SOLID_BASE_INVALID');
  return {points,plane};
}
function letters(start,count){return [...Array(count).keys()].map(k=>LETTERS[start+k]??null);}
/** Vertex names of a polyhedron: a string / array in base,top|apex order, an object {base,top,apex}, or consecutive letters. */
function polyNames(kind,n,names){
  const clean=list=>{if(!Array.isArray(list)||list.some(x=>x!==null&&x!=='.'&&!nameOk(String(x))))bad('SOLID_NAMES_INVALID');return list.map(x=>x==='.'?null:x);};
  if(names===undefined)return {base:letters(0,n),top:kind==='PYRAMID'?[]:letters(n,n),apex:kind==='PYRAMID'?LETTERS[n]:null};
  if(typeof names==='string'||Array.isArray(names)){
    const list=clean(typeof names==='string'?nameTokens(names):names),need=kind==='PYRAMID'?n+1:2*n;
    if(list.length!==need)bad('SOLID_NAMES_INVALID');
    return kind==='PYRAMID'?{base:list.slice(0,n),top:[],apex:list[n]}:{base:list.slice(0,n),top:list.slice(n),apex:null};
  }
  onlyKeys(names,['base','top','apex'],'SOLID_NAMES_INVALID');
  const base=names.base===undefined?letters(0,n):clean(typeof names.base==='string'?nameTokens(names.base):names.base);
  const top=kind==='PYRAMID'?[]:names.top===undefined?letters(n,n):clean(typeof names.top==='string'?nameTokens(names.top):names.top);
  if(base.length!==n||(kind!=='PYRAMID'&&top.length!==n))bad('SOLID_NAMES_INVALID');
  const apex=kind==='PYRAMID'?(names.apex===undefined?LETTERS[n]:names.apex):null;
  if(apex!==null&&apex!==undefined&&!nameOk(apex))bad('SOLID_NAMES_INVALID');
  return {base,top,apex:apex??null};
}
const faceNormal=pts=>{let n=[0,0,0];for(let i=0;i<pts.length;i++)n=add(n,cross(pts[i],pts[(i+1)%pts.length]));return unit(n);};

/** One polyhedron: prism, pyramid or pyramid frustum. Faces are cycles of vertex indices oriented counter-clockwise seen from OUTSIDE. */
function buildPolyhedron(spec){
  const kind=spec.kind;
  if(kind==='REGULAR_POLYHEDRON')return buildRegular(spec);
  if(kind==='BIPYRAMID')return buildBipyramid(spec);
  const allowed={PRISM:['id','kind','base','height','names','count','cuts'],PYRAMID:['id','kind','base','height','apex','names','count','cuts'],FRUSTUM:['id','kind','base','height','topScale','foot','names','count','cuts']}[kind];
  onlyKeys(spec,allowed,'SOLID_PARAM_INVALID');
  const {points,plane}=basePolygon(spec.base);
  const n=points.length,height=pos(spec.height,'SOLID_PARAM_INVALID');
  let bottom,top,apex=null,E;
  const lift=(p,extra=0)=>plane==='XY'?[p[0],p[1],extra]:[p[0],extra,p[1]];
  if(kind==='PRISM'){
    E=plane==='XY'?[0,0,height]:[0,height,0];
    bottom=points.map(p=>lift(p));top=bottom.map(p=>add(p,E));
  }else{
    if(plane!=='XY')bad('SOLID_BASE_PLANE_UNSUPPORTED');
    if(!isConvex(points))bad('SOLID_BASE_NOT_CONVEX');
    E=[0,0,height];
    bottom=points.map(p=>lift(p));
    const centroid=points.reduce((s,p)=>[s[0]+p[0]/n,s[1]+p[1]/n],[0,0]);
    if(kind==='PYRAMID'){
      let foot=centroid;
      if(spec.apex!==undefined){
        if(!Array.isArray(spec.apex)||spec.apex.length!==2||spec.apex.some(c=>typeof c!=='number'||!finite(c)))bad('SOLID_PARAM_INVALID');
        foot=spec.apex;
      }
      apex=[foot[0],foot[1],height];
    }else{
      const k=spec.topScale;
      if(typeof k!=='number'||!(k>0)||!(k<1))bad('SOLID_PARAM_INVALID');
      let foot=centroid;
      if(spec.foot!==undefined){if(!Array.isArray(spec.foot)||spec.foot.length!==2||spec.foot.some(c=>typeof c!=='number'||!finite(c)))bad('SOLID_PARAM_INVALID');foot=spec.foot;}
      top=points.map(p=>[foot[0]+k*(p[0]-foot[0]),foot[1]+k*(p[1]-foot[1]),height]);
    }
  }
  const baseCycle=[...Array(n).keys()];
  const axis=kind==='PRISM'?unit(E):[0,0,1];
  const baseRunsUp=dot(faceNormal(bottom),axis)>0;// the cycle b0..bn-1 runs counter-clockwise about +axis
  const nm=polyNames(kind,n,spec.names);
  const vertices=[];
  // a vertex with several names keeps the first as its name (edges and labels are keyed by it) and lists all of them as aliases
  const vertexOf=(raw,p)=>typeof raw==='string'&&raw.includes(',')?{name:raw.split(',')[0],aliases:raw.split(','),p:p.map(r6)}:{name:raw,p:p.map(r6)};
  bottom.forEach((p,i)=>vertices.push(vertexOf(nm.base[i],p)));
  if(kind==='PYRAMID')vertices.push(vertexOf(nm.apex,apex));else top.forEach((p,i)=>vertices.push(vertexOf(nm.top[i],p)));
  const faces=[];
  const orient=(id,idx,expected)=>{
    const normal=faceNormal(idx.map(i=>vertices[i].p));
    faces.push({id,idx:dot(normal,expected)>=0?idx:[...idx].reverse()});
  };
  const interior=vertices.reduce((s,v)=>add(s,mulv(v.p,1/vertices.length)),[0,0,0]);
  if(kind==='PRISM'){
    const sign=baseRunsUp?1:-1;// +1 when the base cycle is counter-clockwise about +axis
    orient('bottom',baseCycle,mulv(axis,-1));orient('top',baseCycle.map(i=>i+n),axis);
    for(let i=0;i<n;i++){
      const j=(i+1)%n,d=sub(bottom[j],bottom[i]);
      orient('side'+i,[i,j,j+n,i+n],mulv(cross(d,axis),sign));
    }
  }else if(kind==='PYRAMID'){
    orient('bottom',baseCycle,[0,0,-1]);
    for(let i=0;i<n;i++){const j=(i+1)%n;orient('side'+i,[i,j,n],sub(mulv(add(add(vertices[i].p,vertices[j].p),vertices[n].p),1/3),interior));}
  }else{
    orient('bottom',baseCycle,[0,0,-1]);orient('top',baseCycle.map(i=>i+n),[0,0,1]);
    for(let i=0;i<n;i++){const j=(i+1)%n;orient('side'+i,[i,j,j+n,i+n],sub(mulv(add(add(vertices[i].p,vertices[j].p),add(vertices[i+n].p,vertices[j+n].p)),0.25),interior));}
  }
  const edges=edgesOfFaces(faces);
  // every face must be planar
  for(const face of faces){
    const pts=face.idx.map(i=>vertices[i].p),nrm=faceNormal(pts);
    if(pts.some(p=>Math.abs(dot(nrm,sub(p,pts[0])))>1e-6))bad('SOLID_FACE_NOT_PLANAR');
  }
  if(spec.cuts!==undefined){
    // planes that cut convex parts off the polyhedron: the solid that remains is what is drawn (its own vertices, faces and edges)
    if(spec.count!==undefined)bad('SOLID_COUNT_UNSUPPORTED:CUT');
    if(!isConvex(points))bad('SOLID_CUT_NOT_CONVEX');
    const cut=applyCuts({vertices,faces},spec.cuts);
    return {id:spec.id,kind,category:'POLY',vertices:cut.vertices,faces:cut.faces,edges:edgesOfFaces(cut.faces),height,cuts:cut.record};
  }
  const count=parseCount(spec.count,vertices,edges);
  return {id:spec.id,kind,category:'POLY',vertices,faces,edges,height,...(count?{count}:{})};
}

// --- regular polyhedra and bipyramids (E29) ---------------------------------------------------------------------------------------------------------
// REGULAR_POLYHEDRON {faces:4|8|12|20,side}: the tetrahedron, octahedron, dodecahedron and icosahedron with every edge `side` long, one vertical axis of symmetry
// (a 3-fold one for the tetrahedron, a 4-fold one through two opposite vertices for the octahedron, a 5-fold one for the dodecahedron and icosahedron), standing
// on z=0. A cube is a PRISM over a RECT base. Vertices, in model order (names, counting numbers and "#v<i>" follow it):
//   tetrahedron  base triangle (the first side horizontal along the front, as a REGULAR base of 3), then the apex.
//   octahedron   the square ring (a REGULAR base of 4, one level above the foot), the upper apex, the lower apex.
//   icosahedron  the upper apex, the upper ring of 5 (v1..v5, the first towards the viewer), the lower ring of 5 (v6..v10, each between two upper ones), the lower apex.
//   dodecahedron the centres of the 20 faces of that icosahedron, in the order of its faces (5 around the upper apex, 5 hanging from the upper ring, 5 standing on the lower
//                ring, 5 around the lower apex).
// Faces are called f0, f1, ... (icosahedron: 5 around the upper apex, 5 hanging from the upper ring, 5 standing on the lower ring, 5 around the lower apex; dodecahedron: one per
// vertex of the icosahedron in its order). BIPYRAMID {base (convex, plane XY),height,names?}: two pyramids on one base (the ring), each `height` high; vertices are the ring, the
// upper apex, the lower apex; faces top0.., bottom0.. (i stands on the i-th edge of the base).
const REGULAR_FACE_COUNTS=[4,8,12,20];
const ringPoints=(n,side,z)=>[...Array(n).keys()].map(k=>{const R=side/(2*Math.sin(Math.PI/n)),a=-Math.PI/2-Math.PI/n+2*Math.PI*k/n;return [R*Math.cos(a),R*Math.sin(a),z];});
function icosahedronPoints(s){
  const rho=s/(2*Math.sin(Math.PI/5)),zr=Math.sqrt(s*s-rho*rho),chord=2*rho*Math.sin(Math.PI/10),zu=Math.sqrt(s*s-chord*chord)/2,top=zu+zr;
  const upper=[...Array(5).keys()].map(k=>{const a=-Math.PI/2+2*Math.PI*k/5;return [rho*Math.cos(a),rho*Math.sin(a),zu];});
  const lower=[...Array(5).keys()].map(k=>{const a=-Math.PI/2+Math.PI/5+2*Math.PI*k/5;return [rho*Math.cos(a),rho*Math.sin(a),-zu];});
  return [[0,0,top],...upper,...lower,[0,0,-top]];
}
const ICOSAHEDRON_FACES=(()=>{
  const faces=[];
  for(let k=0;k<5;k++)faces.push([0,1+k,1+(k+1)%5]);// around the upper apex
  for(let k=0;k<5;k++)faces.push([1+k,1+(k+1)%5,6+k]);// hanging from an upper edge
  for(let k=0;k<5;k++)faces.push([6+k,6+(k+1)%5,1+(k+1)%5]);// standing on a lower edge
  for(let k=0;k<5;k++)faces.push([11,6+(k+1)%5,6+k]);// around the lower apex
  return faces;
})();
function regularGeometry(count,side){
  let points,faces;
  if(count===4){
    const h=side*Math.sqrt(2/3);
    points=[...ringPoints(3,side,0),[0,0,h]];
    faces=[[0,1,2],[0,1,3],[1,2,3],[2,0,3]];
  }else if(count===8){
    const h=side/Math.SQRT2;
    points=[...ringPoints(4,side,h),[0,0,2*h],[0,0,0]];
    faces=[];
    for(let k=0;k<4;k++)faces.push([k,(k+1)%4,4]);
    for(let k=0;k<4;k++)faces.push([k,(k+1)%4,5]);
  }else if(count===20){
    points=icosahedronPoints(side);faces=ICOSAHEDRON_FACES.map(f=>[...f]);
  }else{
    // the dodecahedron: the dual of the icosahedron (its face centres), scaled to the edge `side`
    const ico=icosahedronPoints(1),centres=ICOSAHEDRON_FACES.map(f=>mulv(add(add(ico[f[0]],ico[f[1]]),ico[f[2]]),1/3));
    const edge=len(sub(centres[0],centres.find((c,i)=>i>0&&ICOSAHEDRON_FACES[i].filter(v=>ICOSAHEDRON_FACES[0].includes(v)).length===2)));
    points=centres.map(c=>mulv(c,side/edge));
    faces=ico.map((v,vi)=>{
      const around=ICOSAHEDRON_FACES.map((f,i)=>f.includes(vi)?i:-1).filter(i=>i>=0),axis=unit(v);
      const helper=Math.abs(axis[0])<0.9?[1,0,0]:[0,1,0],e1=unit(cross(axis,helper)),e2=cross(axis,e1);
      const angle=i=>{const q=sub(points[i],mulv(axis,dot(points[i],axis)));return Math.atan2(dot(q,e2),dot(q,e1));};
      return around.sort((a,b)=>angle(a)-angle(b));
    });
  }
  const zmin=Math.min(...points.map(p=>p[2]));
  return {points:points.map(p=>[p[0],p[1],p[2]-zmin]),faces};
}
/** The vertices as objects with their names (a name may list aliases "M,A,I"), the faces oriented counter-clockwise seen from outside, every face checked planar. */
function convexPolyhedron(kind,id,points,faceCycles,faceIds,names,count){
  const total=points.length;
  const list=names===undefined?letters(0,total):(()=>{const l=typeof names==='string'?nameTokens(names):names;if(!Array.isArray(l)||l.length!==total||l.some(x=>x!==null&&x!=='.'&&!nameOk(String(x))))bad('SOLID_NAMES_INVALID');return l.map(x=>x==='.'?null:x);})();
  const vertices=points.map((p,i)=>{const raw=list[i];return typeof raw==='string'&&raw.includes(',')?{name:raw.split(',')[0],aliases:raw.split(','),p}:{name:raw,p};});
  const centre=points.reduce((s,p)=>add(s,mulv(p,1/total)),[0,0,0]);
  const faces=faceCycles.map((idx,k)=>{
    const pts=idx.map(i=>points[i]),nrm=faceNormal(pts),mid=pts.reduce((s,p)=>add(s,mulv(p,1/pts.length)),[0,0,0]);
    if(pts.some(p=>Math.abs(dot(nrm,sub(p,pts[0])))>1e-9*Math.max(1,len(pts[0]))))bad('SOLID_FACE_NOT_PLANAR');
    return {id:faceIds[k],idx:dot(nrm,sub(mid,centre))>=0?idx:[...idx].reverse()};
  });
  const edges=edgesOfFaces(faces),counted=parseCount(count,vertices,edges);
  return {id,kind,category:'POLY',vertices,faces,edges,height:Math.max(...points.map(p=>p[2])),exact:true,...(counted?{count:counted}:{})};
}
function buildRegular(spec){
  onlyKeys(spec,['id','kind','faces','side','names','count'],'SOLID_PARAM_INVALID');
  if(!REGULAR_FACE_COUNTS.includes(spec.faces))bad('SOLID_REGULAR_FACES_UNSUPPORTED:'+String(spec.faces).slice(0,8));
  const side=pos(spec.side,'SOLID_PARAM_INVALID'),{points,faces}=regularGeometry(spec.faces,side);
  // every edge is `side` long: the construction is checked, not trusted
  const solid=convexPolyhedron('REGULAR_POLYHEDRON',spec.id,points,faces,faces.map((f,k)=>'f'+k),spec.names,spec.count);
  for(const [a,b] of solid.edges)if(Math.abs(len(sub(solid.vertices[a].p,solid.vertices[b].p))-side)>1e-9*side)bad('SOLID_REGULAR_GEOMETRY_INVALID');
  if(solid.edges.length!==({4:6,8:12,12:30,20:30})[spec.faces])bad('SOLID_REGULAR_GEOMETRY_INVALID');
  return solid;
}
function buildBipyramid(spec){
  onlyKeys(spec,['id','kind','base','height','names','count'],'SOLID_PARAM_INVALID');
  if(!isPlain(spec.base))bad('SOLID_BASE_INVALID');
  const exactRing=spec.base.kind==='REGULAR'&&Number.isInteger(spec.base.n)&&spec.base.n>=3&&spec.base.n<=8&&typeof spec.base.side==='number'&&spec.base.side>0;
  const {points,plane}=basePolygon(spec.base);
  if(plane!=='XY')bad('SOLID_BASE_PLANE_UNSUPPORTED');
  if(!isConvex(points))bad('SOLID_BASE_NOT_CONVEX');
  const n=points.length,h=pos(spec.height,'SOLID_PARAM_INVALID');
  const ring=exactRing?ringPoints(n,spec.base.side,h):points.map(p=>[p[0],p[1],h]);
  const cx=ring.reduce((s,p)=>s+p[0]/n,0),cy=ring.reduce((s,p)=>s+p[1]/n,0);
  const faces=[],ids=[];
  for(let i=0;i<n;i++){faces.push([i,(i+1)%n,n]);ids.push('top'+i);}
  for(let i=0;i<n;i++){faces.push([i,(i+1)%n,n+1]);ids.push('bottom'+i);}
  return convexPolyhedron('BIPYRAMID',spec.id,[...ring,[cx,cy,2*h],[cx,cy,0]],faces,ids,spec.names,spec.count);
}
/** The distinct edges (vertex index pairs, low first) of a set of faces, sorted. */
function edgesOfFaces(faces){
  const edgeKey=new Map();
  for(const face of faces)for(let k=0;k<face.idx.length;k++){const a=face.idx[k],b=face.idx[(k+1)%face.idx.length];edgeKey.set(a<b?a+','+b:b+','+a,[Math.min(a,b),Math.max(a,b)]);}
  return [...edgeKey.values()].sort((x,y)=>x[0]-y[0]||x[1]-y[1]);
}

// --- planes cutting a convex polyhedron ---------------------------------------------------------------------------------------------------------------
// solids[].cuts:[{through:[[edge,"1/2",name?],...],keep?}] (one or two planes, one after the other). A plane is fixed by 3 to 6 points, each the point
// at a fraction p/q (from the first named vertex towards the second) of an EDGE of the solid as it is when that cut is made (the edge is written as its
// two vertex names, "AD"); all must be coplanar. The solid keeps the side that has more of its vertices (strictly); with equally many, keep:"<vertex>"
// names a vertex that stays. A vertex of the solid on the plane stays; every edge that crosses the plane gets a new vertex there (named by the
// through entry that lies on it, otherwise unnamed), and the plane's section becomes one new face. New vertices follow the kept ones, ordered by the
// edge they lie on (the lower, then the higher index of the edge's ends in the solid before the cut). Only convex polyhedra are cut.
const MAX_CUTS=2,CUT_EPS=1e-6,CUT_AT=/^([1-9]\d?)\/([1-9]\d?)$/;
function applyCuts(poly,cuts){
  if(!Array.isArray(cuts)||cuts.length<1||cuts.length>MAX_CUTS)bad('SOLID_CUT_COUNT_INVALID');
  let current=poly;const record=[];
  cuts.forEach((cut,k)=>{const made=cutOnce(current,cut,k+1);current=made;record.push(made.record);});
  return {vertices:current.vertices,faces:current.faces,record};
}
function cutOnce(poly,cut,number){
  if(!isPlain(cut))bad('SOLID_CUT_INVALID');
  onlyKeys(cut,['through','keep'],'SOLID_CUT_INVALID');
  if(!Array.isArray(cut.through)||cut.through.length<3||cut.through.length>6)bad('SOLID_CUT_INVALID');
  const {vertices,faces}=poly;
  const indexOf=name=>vertices.findIndex(v=>v.name===name||(v.aliases?.includes(name)??false));
  const edgeSet=new Set();
  for(const f of faces)for(let k=0;k<f.idx.length;k++){const a=f.idx[k],b=f.idx[(k+1)%f.idx.length];edgeSet.add(Math.min(a,b)+','+Math.max(a,b));}
  const through=cut.through.map(entry=>{
    if(!Array.isArray(entry)||entry.length<2||entry.length>3||typeof entry[0]!=='string'||typeof entry[1]!=='string')bad('SOLID_CUT_INVALID');
    const toks=nameTokens(entry[0]);
    if(toks.length!==2||toks.join('')!==entry[0]||toks.includes('.'))bad('SOLID_CUT_INVALID');
    const a=indexOf(toks[0]),b=indexOf(toks[1]);
    if(a<0||b<0||a===b||!edgeSet.has(Math.min(a,b)+','+Math.max(a,b)))bad('SOLID_CUT_EDGE_UNKNOWN:'+entry[0]);
    const m=CUT_AT.exec(entry[1]);
    if(!m||Number(m[1])>=Number(m[2]))bad('SOLID_CUT_INVALID');
    const name=entry.length===3?entry[2]:null;
    if(name!==null&&name!=='.'&&!NAME.test(name))bad('SOLID_NAMES_INVALID');
    return {key:Math.min(a,b)+','+Math.max(a,b),edge:entry[0],at:entry[1],name:name===null||name==='.'?null:name,p:lerp(vertices[a].p,vertices[b].p,Number(m[1])/Number(m[2]))};
  });
  if(new Set(through.map(x=>x.key)).size!==through.length)bad('SOLID_CUT_INVALID');
  // the plane: the widest triple of the through points; the others must lie on it
  let normal=null,widest=0;
  for(let i=0;i<through.length;i++)for(let j=i+1;j<through.length;j++)for(let k=j+1;k<through.length;k++){
    const c=cross(sub(through[j].p,through[i].p),sub(through[k].p,through[i].p)),l=len(c);
    if(l>widest){widest=l;normal=c;}
  }
  if(normal===null||widest<1e-9)bad('SOLID_CUT_DEGENERATE');
  const n=unit(normal),d=dot(n,through[0].p);
  if(through.some(x=>Math.abs(dot(n,x.p)-d)>2*CUT_EPS))bad('SOLID_CUT_NOT_PLANAR');
  // the side that stays
  const dist=vertices.map(v=>dot(n,v.p)-d);
  const pos=dist.filter(x=>x>CUT_EPS).length,neg=dist.filter(x=>x<-CUT_EPS).length;
  if(pos===0||neg===0)bad('SOLID_CUT_NO_EFFECT');
  let keepSign;
  if(cut.keep!==undefined){
    if(typeof cut.keep!=='string')bad('SOLID_CUT_INVALID');
    const i=indexOf(cut.keep);
    if(i<0)bad('SOLID_NAME_UNKNOWN');
    if(Math.abs(dist[i])<=CUT_EPS)bad('SOLID_CUT_KEEP_INVALID');
    keepSign=Math.sign(dist[i]);
  }else if(pos!==neg)keepSign=pos>neg?1:-1;
  else bad('SOLID_CUT_KEEP_AMBIGUOUS');
  const k=dist.map(x=>keepSign*x);// positive on the side that stays
  const crossing=(a,b)=>(k[a]>CUT_EPS&&k[b]<-CUT_EPS)||(k[a]<-CUT_EPS&&k[b]>CUT_EPS);
  const crossings=[];
  for(const key of edgeSet){
    const [lo,hi]=key.split(',').map(Number);
    if(crossing(lo,hi))crossings.push({key,lo,hi,p:lerp(vertices[lo].p,vertices[hi].p,k[lo]/(k[lo]-k[hi])).map(r6)});
  }
  crossings.sort((x,y)=>x.lo-y.lo||x.hi-y.hi);
  // a through point is a vertex of the section: its edge must cross the plane (an edge lying in the plane has no such point)
  for(const x of through)if(!crossings.some(c=>c.key===x.key))bad('SOLID_CUT_INVALID');
  const kept=[...vertices.keys()].filter(i=>k[i]>=-CUT_EPS);
  const newOf=new Map(kept.map((i,j)=>[i,j])),crossOf=new Map(crossings.map((c,j)=>[c.key,kept.length+j]));
  const out=kept.map(i=>({...vertices[i],p:[...vertices[i].p]}));
  for(const c of crossings)out.push({name:through.find(x=>x.key===c.key)?.name??null,p:c.p});
  // every face is clipped to the side that stays; a face left with fewer than three corners is gone
  const clipped=[];
  for(const f of faces){
    const m=f.idx.length,cycle=[];
    for(let i=0;i<m;i++){
      const a=f.idx[i],b=f.idx[(i+1)%m],key=Math.min(a,b)+','+Math.max(a,b);
      if(k[a]>=-CUT_EPS)cycle.push(newOf.get(a));
      if(crossOf.has(key)&&crossing(a,b))cycle.push(crossOf.get(key));
    }
    if(new Set(cycle).size>=3)clipped.push({id:f.id,idx:cycle});
  }
  // the section: the new vertices and the vertices that lie on the plane, in counter-clockwise order seen from outside (from the removed side)
  const section=[...kept.filter(i=>Math.abs(k[i])<=CUT_EPS).map(i=>newOf.get(i)),...crossings.map(c=>crossOf.get(c.key))];
  if(section.length<3)bad('SOLID_CUT_DEGENERATE');
  const u=mulv(n,-keepSign),helper=Math.abs(u[0])<0.9?[1,0,0]:[0,1,0],e1=unit(cross(u,helper)),e2=cross(u,e1);
  const centre=section.reduce((sum,i)=>add(sum,mulv(out[i].p,1/section.length)),[0,0,0]);
  const angle=i=>{const q=sub(out[i].p,centre);return Math.atan2(dot(q,e2),dot(q,e1));};
  section.sort((x,y)=>angle(x)-angle(y));
  const result={vertices:out,faces:[...clipped,{id:'cut'+number,idx:section}]};
  for(const face of result.faces){
    const pts=face.idx.map(i=>out[i].p),nrm=faceNormal(pts);
    if(pts.some(q=>Math.abs(dot(nrm,sub(q,pts[0])))>1e-5))bad('SOLID_FACE_NOT_PLANAR');
  }
  result.record={number,plane:{n:n.map(r6),d:r6(d)},keepSign,through:through.map(x=>({edge:x.edge,at:x.at,name:x.name})),removed:vertices.length-kept.length,added:crossings.length};
  return result;
}
const COUNT_EDGES_MAX=20,CIRCLED_ONE=0x2460;
/** The circled number of a counting label: 1 -> the circled digit one, up to 20. */
export const circled=k=>String.fromCodePoint(CIRCLED_ONE+k-1);
/**
 * count:{vertices?,edges?,faces?} asks for counting numbers: 1, 2, ... beside the vertices and the circled numbers beside the edge midpoints.
 * Vertices are numbered in model order (the base ring, then the top ring or the apex). Edges are numbered around the base ring (edge i joins base vertex i
 * and i+1, the closing edge last), then the side edges by their base vertex, then around the top ring. Faces are not supported; a numbered vertex
 * cannot also carry a name.
 */
function parseCount(raw,vertices,edges){
  if(raw===undefined)return null;
  if(!isPlain(raw))bad('SOLID_COUNT_REQUEST_INVALID');
  onlyKeys(raw,['vertices','edges','faces'],'SOLID_COUNT_REQUEST_INVALID');
  for(const key of Object.keys(raw))if(typeof raw[key]!=='boolean')bad('SOLID_COUNT_REQUEST_INVALID');
  if(raw.faces===true)bad('SOLID_COUNT_FACES_UNSUPPORTED');
  const count={vertices:raw.vertices===true,edges:raw.edges===true};
  if(!count.vertices&&!count.edges)bad('SOLID_COUNT_REQUEST_INVALID');
  if(count.vertices&&vertices.some(v=>v.name))bad('SOLID_COUNT_NAMES_CONFLICT');
  if(count.edges&&edges.length>COUNT_EDGES_MAX)bad('SOLID_COUNT_TOO_MANY:edges');
  return count;
}
/** The edges of a polyhedron in counting order (see parseCount). */
export function countedEdges(solid){
  if(solid.kind==='REGULAR_POLYHEDRON')return [...solid.edges];// by the vertex numbers, low pair first
  const n=ringSize(solid);
  // a bipyramid: around the ring, then up to the upper apex by ring vertex, then down to the lower apex
  const slot=solid.kind==='BIPYRAMID'?([a,b])=>a<n&&b<n?[0,b===a+1?a:b]:b===n?[1,a]:[2,a]:([a,b])=>a<n&&b<n?[0,b===a+1?a:b]:a>=n&&b>=n?[2,b===a+1?a-n:b-n]:[1,a];
  return [...solid.edges].sort((x,y)=>{const u=slot(x),v=slot(y);return u[0]-v[0]||u[1]-v[1];});
}

/**
 * A solid of revolution (cylinder, cone, cone frustum), a sphere or a hemisphere standing on the plane z=0 with its axis on the z axis.
 * CONE and CONE_FRUSTUM accept orientation:"APEX_DOWN": the point (or the narrow end) rests on the base plane, the wide circle is the rim at
 * height h. r0/r1 are the radii at z=0 and z=h; radius is still the wide one (topRadius the narrow one).
 */
// A short word the author writes on the figure (labels:[{text,at}], axis:{label}): Korean syllables, letters, digits, spaces, parentheses and a middle dot, no TeX.
const WORD_LABEL=/[가-힣·]/u;// a text with a Hangul syllable is a word, not TeX
const MAX_TEXT_LABELS=6,TEXT_LABEL=/^[가-힣A-Za-z0-9 ·()]{1,12}$/u;
const textLabelOk=text=>typeof text==='string'&&TEXT_LABEL.test(text)&&text.trim()===text&&text.length>0;
/** The axis of a rotation solid (axis:true | axis:{label?}): drawn as a dash-dot line, extended beyond both ends of the solid, optionally with a word beside it. */
export const AXIS_EXTENSION=0.14;// of the solid's height, above the top and below the bottom
function parseAxis(axis,kind,nested){
  if(kind!=='CYLINDER'&&kind!=='CONE'&&kind!=='CONE_FRUSTUM')bad('SOLID_AXIS_UNSUPPORTED:'+kind);
  if(nested)bad('SOLID_AXIS_UNSUPPORTED:NESTED');
  if(axis===true)return {label:null};
  if(!isPlain(axis)||Object.keys(axis).some(k=>k!=='label'))bad('SOLID_AXIS_INVALID');
  if(axis.label!==undefined&&!textLabelOk(axis.label))bad('SOLID_LABEL_TEXT_INVALID');
  return {label:axis.label??null};
}
function buildRound(spec){
  const kind=spec.kind;
  const baseKeys={CYLINDER:['id','kind','radius','height','names'],CONE:['id','kind','radius','height','names'],CONE_FRUSTUM:['id','kind','radius','topRadius','height','names'],SPHERE:['id','kind','radius','names'],HEMISPHERE:['id','kind','radius','names']}[kind];
  onlyKeys(spec,[...baseKeys,'orientation','inside','count','cuts','cut','axis'],'SOLID_PARAM_INVALID');
  if(spec.count!==undefined)bad('SOLID_COUNT_UNSUPPORTED:'+kind);
  if(spec.cuts!==undefined)bad('SOLID_CUT_UNSUPPORTED:'+kind);
  // cut:{kind,facing?} cuts a SPHERE by planes through its centre (sphere-parts.mjs); no other round solid, and a cut sphere does not sit inside a cylinder
  if(spec.cut!==undefined&&kind!=='SPHERE')bad('SOLID_SPHERE_CUT_UNSUPPORTED:'+kind);
  if(spec.cut!==undefined&&spec.inside!==undefined)bad('SOLID_SPHERE_CUT_NEST_UNSUPPORTED');
  const r=pos(spec.radius,'SOLID_PARAM_INVALID');
  const cone=kind==='CONE'||kind==='CONE_FRUSTUM';
  const orientation=spec.orientation??'APEX_UP';
  if(orientation!=='APEX_UP'&&orientation!=='APEX_DOWN')bad('SOLID_ORIENTATION_UNSUPPORTED:'+String(orientation).slice(0,24));
  if(orientation==='APEX_DOWN'&&!cone)bad('SOLID_ORIENTATION_UNSUPPORTED:'+kind);
  let r1=kind==='CONE'?0:r,height;
  if(kind==='SPHERE'||kind==='HEMISPHERE')height=kind==='SPHERE'?2*r:r;
  else height=pos(spec.height,'SOLID_PARAM_INVALID');
  if(kind==='CONE_FRUSTUM'){r1=pos(spec.topRadius,'SOLID_PARAM_INVALID');if(!(r1<r))bad('SOLID_FRUSTUM_TOP_NOT_SMALLER');}
  const down=orientation==='APEX_DOWN';
  const r0=down?r1:r,rt=down?r:r1;// radius at z=0 and at z=h
  const names=spec.names??{};
  onlyKeys(names,['center','top','apex'],'SOLID_NAMES_INVALID');
  for(const key of Object.keys(names))if(!NAME.test(names[key]))bad('SOLID_NAMES_INVALID');
  const points=[];
  if(kind==='SPHERE'){points.push({name:names.center??null,id:'center',p:[0,0,r]});}
  else if(kind==='HEMISPHERE'){points.push({name:names.center??null,id:'center',p:[0,0,0]});}
  else{
    points.push({name:names.center??null,id:'center',p:[0,0,down&&kind==='CONE'?height:0]});
    if(kind!=='CONE')points.push({name:names.top??null,id:'top',p:[0,0,height]});
    else points.push({name:names.apex??null,id:'apex',p:[0,0,down?0:height]});
  }
  if(spec.inside!==undefined&&(typeof spec.inside!=='string'||!/^[a-z][a-z0-9]{0,7}$/.test(spec.inside)))bad('SOLID_NEST_INVALID');
  const axis=spec.axis!==undefined?parseAxis(spec.axis,kind,spec.inside!==undefined):undefined;
  return {id:spec.id,kind,category:kind==='SPHERE'||kind==='HEMISPHERE'?'SPHERE':'REV',radius:r,topRadius:r1,r0,r1:rt,orientation,height,points,inside:spec.inside??null,
    ...(spec.cut!==undefined?{cut:sphereCutModel(r,spec.cut,CUT_FRAME)}:{}),...(axis!==undefined?{axis}:{})};
}

const shiftSolid=(solid,s)=>{
  // move along the screen's horizontal (and recentre the footprint on the origin first)
  const d=mulv(EX,s);
  if(solid.category==='POLY'){for(const v of solid.vertices)v.p=solid.exact?add(v.p,d):add(v.p,d).map(r6);}
  else for(const q of solid.points)q.p=add(q.p,d).map(r6);
  solid.offset=r6(s);
};
function recentre(solid){
  if(solid.category!=='POLY')return;
  const xs=solid.vertices.map(v=>v.p[0]),ys=solid.vertices.map(v=>v.p[1]);
  const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
  for(const v of solid.vertices)v.p=solid.exact?[v.p[0]-cx,v.p[1]-cy,v.p[2]]:[r6(v.p[0]-cx),r6(v.p[1]-cy),v.p[2]];
}

// --- visibility of polyhedron edges ------------------------------------------------------------------------------------------------------------
const facePlane=(solid,face)=>{
  const pts=face.idx.map(i=>solid.vertices[i].p),n=faceNormal(pts);
  const axis=[0,1,2].sort((a,b)=>Math.abs(n[b])-Math.abs(n[a]))[0],keep=[0,1,2].filter(k=>k!==axis);
  return {pts,n,d:dot(n,pts[0]),poly:pts.map(p=>[p[keep[0]],p[keep[1]]]),keep};
};
function inside2(poly,q){
  let c=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const [xi,yi]=poly[i],[xj,yj]=poly[j];
    if((yi>q[1])!==(yj>q[1])&&q[0]<(xj-xi)*(q[1]-yi)/(yj-yi)+xi)c=!c;
  }
  return c;
}
/** True when some face (not in `skip`) lies between the point and the viewer. */
function occluded(planes,P,skip){
  for(const [id,fp] of planes){
    if(skip.has(id))continue;
    const denom=dot(fp.n,VIEW);
    if(Math.abs(denom)<1e-9)continue;
    const t=(fp.d-dot(fp.n,P))/denom;
    if(t<=1e-7)continue;
    const H=add(P,mulv(VIEW,t));
    if(inside2(fp.poly,[H[fp.keep[0]],H[fp.keep[1]]]))return true;
  }
  return false;
}
/** Per edge: contiguous runs {t0,t1,hidden} along the edge from vertex a to vertex b (depth test by rays toward the viewer). */
export function edgeRuns(solid){
  const planes=new Map(solid.faces.map(face=>[face.id,facePlane(solid,face)]));
  const runs=[];
  for(const [a,b] of solid.edges){
    const A=solid.vertices[a].p,B=solid.vertices[b].p;
    const skip=new Set(solid.faces.filter(f=>f.idx.includes(a)&&f.idx.includes(b)&&f.idx.some((x,k)=>{const y=f.idx[(k+1)%f.idx.length];return (x===a&&y===b)||(x===b&&y===a);})).map(f=>f.id));
    const hiddenAt=t=>occluded(planes,lerp(A,B,t),skip);
    const N=160,flags=[...Array(N).keys()].map(k=>hiddenAt((k+0.5)/N));
    const cuts=[0];
    for(let k=1;k<N;k++)if(flags[k]!==flags[k-1]){
      let lo=(k-0.5)/N,hi=(k+0.5)/N;const fl=flags[k-1];
      for(let it=0;it<42;it++){const mid=(lo+hi)/2;if(hiddenAt(mid)===fl)lo=mid;else hi=mid;}
      cuts.push((lo+hi)/2);
    }
    cuts.push(1);
    const edgeRunList=[];
    let state=flags[0];
    for(let c=0;c<cuts.length-1;c++){edgeRunList.push({t0:r6(cuts[c]),t1:r6(cuts[c+1]),hidden:state});state=!state;}
    runs.push({a,b,runs:edgeRunList});
  }
  return runs;
}

// --- numbers as label text --------------------------------------------------------------------------------------------------------------------
/** The exact text of a length: 5, 7.5, 5\sqrt{2}, \frac{10}{3}, 8\pi, \frac{7}{2}\pi. Null when no exact short form exists. */
export function lengthTex(L){
  const near=(x,y)=>Math.abs(x-y)<=1e-9*Math.max(1,Math.abs(y));
  const ri=Math.round(L);if(near(L,ri))return String(ri);
  const dec=Number(L.toFixed(3));if(near(L,dec))return String(dec);
  const m=Math.round(L*L);
  if(m>0&&Math.abs(L*L-m)<1e-7){let a=1,b=m;for(let k=Math.floor(Math.sqrt(m));k>1;k--)if(m%(k*k)===0){a=k;b=m/(k*k);break;}return (a>1?String(a):'')+'\\sqrt{'+b+'}';}
  for(let q=3;q<=12;q++){const p=Math.round(L*q);if(p>0&&near(L*q,p))return '\\frac{'+p+'}{'+q+'}';}
  const k=L/Math.PI,kr=Math.round(k);
  if(kr>0&&near(k,kr))return (kr>1?String(kr):'')+'\\pi';
  const kd=Number(k.toFixed(3));if(kd>0&&near(k,kd))return kd+'\\pi';
  for(let q=3;q<=12;q++){const p=Math.round(k*q);if(p>0&&near(k*q,p))return '\\frac{'+p+'}{'+q+'}\\pi';}
  return null;
}
/** The number a numeric label text stands for (units stripped), or null when it is symbolic. */
export function labelNumber(tex){
  const t=String(tex).replace(/\\,?\\mathrm\{[a-z]+\}(\^2)?/g,'').replace(/\\,/g,'').replace(/\s+/g,'');
  let m;
  if((m=/^(\d+(?:\.\d+)?)$/.exec(t)))return Number(m[1]);
  if((m=/^(\d*)\\sqrt\{(\d+)\}$/.exec(t)))return (m[1]===''?1:Number(m[1]))*Math.sqrt(Number(m[2]));
  if((m=/^\\frac\{(\d+)\}\{(\d+)\}$/.exec(t)))return Number(m[1])/Number(m[2]);
  if((m=/^(\d*(?:\.\d+)?)\\pi$/.exec(t)))return (m[1]===''?1:Number(m[1]))*Math.PI;
  if((m=/^\\frac\{(\d+)\}\{(\d+)\}\\pi$/.exec(t)))return Number(m[1])/Number(m[2])*Math.PI;
  if((m=/^(\d+(?:\.\d+)?)\^\\circ$/.exec(t)))return Number(m[1]);
  return null;
}
const SYMBOLIC=/^[A-Za-z0-9_\\{}^+\-=.() ]{1,24}$/;
// A face symbol of a net (net.faceLabels text), written as plain text: a circled number (\u2460-\u2473), a circled Hangul letter, a single Hangul syllable or jamo (\uac00, \u3134), or
// a number, syllable or jamo in parentheses ((1), (\uac00)). It names or numbers a face: it is no area, so no value is checked.
export const FACE_SYMBOL=/^(?:[\u2460-\u2473\u3260-\u327B\u3131-\u314E\uAC00-\uD7A3]|\((?:[1-9]\d?|[\u3131-\u314E\uAC00-\uD7A3])\))$/u;
function dimLabel(raw,value,unit,code,{angle=false}={}){
  // raw: undefined (auto) or a TeX string. A numeric label must equal the value; anything else is a symbol and says so.
  let tex,numeric=true;
  if(raw===undefined){
    tex=lengthTex(value);
    if(tex===null)bad('SOLID_DIM_NOT_EXPRESSIBLE:'+code);
    if(angle)tex=tex+'^\\circ';
  }else{
    if(typeof raw!=='string'||!SYMBOLIC.test(raw))bad('SOLID_DIM_LABEL_INVALID:'+code);
    tex=raw;
    const n=labelNumber(tex);
    if(n===null)numeric=false;
    else if(Math.abs(n-value)>1e-6*Math.max(1,Math.abs(value)))bad('SOLID_DIM_VALUE_MISMATCH:'+code);
  }
  const text=tex;
  return {tex:numeric&&unit&&!angle?tex+'\\,\\mathrm{'+unit+'}':tex,text,numeric,value:r6(value)};
}

// --- vertex references --------------------------------------------------------------------------------------------------------------------------
// A figure whose source shows no vertex names writes the vertices of a polyhedron by a reference instead of inventing letters: "#b0" the i-th vertex of the
// base ring (the order of the base polygon), "#t2" the i-th of the top ring (prism, frustum), "#apex" the apex of a pyramid, "#v5" the 6th vertex of the model
// (any polyhedron: the same order as the counting numbers 1, 2, ...). "s2#b0" names the solid when the plan has several polyhedra. A reference stands wherever a
// name does (segments, dims edge/from/to, highlights polygon, marks) and works whether the vertex has a name or not. A vertex without a name is known in the model
// by its canonical key "<solid id>.<slot>" ("s1.b0"); a key is the name when there is one.
const VREF=/^([a-z][a-z0-9]{0,7})?#(?:([btv])(\d{1,2})|(apex2?))$/;
const PLAIN_KEY=/^[A-Z]′?$/u;
/** Keys written together: "AB" for plain vertex names, "s1.b0-s1.b1" (joined by '-') as soon as one is a canonical key; used in ids and data-* of the SVG. */
export const joinKeys=keys=>keys.every(k=>PLAIN_KEY.test(k))?keys.join(''):keys.join('-');
const ringSize=solid=>solid.kind==='PYRAMID'?solid.vertices.length-1:solid.kind==='BIPYRAMID'?solid.vertices.length-2:solid.vertices.length/2;
/** The slot of vertex i of a polyhedron in the reference grammar. */
function vertexSlot(solid,i){
  if(solid.kind==='REGULAR_POLYHEDRON')return 'v'+i;
  const n=ringSize(solid);
  if(solid.kind==='PYRAMID')return i<n?'b'+i:'apex';
  if(solid.kind==='BIPYRAMID')return i<n?'b'+i:i===n?'apex':'apex2';
  return i<n?'b'+i:'t'+(i-n);
}
/** The keys a polyhedron vertex answers to: its names, or the one canonical key when it has none (a solid with cuts renumbers its vertices: only names). */
const vertexKeys=(solid,i)=>{const v=solid.vertices[i];return v.name?(v.aliases??[v.name]):solid.cuts?[]:[solid.id+'.'+vertexSlot(solid,i)];};
/** The vertex index of a slot written in a reference, or null when this polyhedron has no such vertex. */
function slotIndex(solid,ring,index,apex){
  const total=solid.vertices.length,n=ringSize(solid);
  const i=Number(index);
  if(ring==='v')return i<total?i:null;
  if(solid.kind==='REGULAR_POLYHEDRON')return null;// no ring and no apex: only #v<i>
  if(apex==='apex')return solid.kind==='PYRAMID'||solid.kind==='BIPYRAMID'?n:null;
  if(apex==='apex2')return solid.kind==='BIPYRAMID'?n+1:null;
  if(ring==='b')return i<n?i:null;
  return solid.kind==='PYRAMID'||solid.kind==='BIPYRAMID'?null:i<n?n+i:null;
}
/** The reference resolver of a plan: a name is checked against the named points; a reference becomes the key of the vertex it stands for (the name when it has one). */
function vertexResolver(solids,named){
  return (x,unknown='SOLID_NAME_UNKNOWN')=>{
    if(typeof x!=='string')bad(unknown);
    if(!x.includes('#')){if(!named.has(x))bad(unknown);return x;}
    const m=VREF.exec(x);
    if(!m)bad('SOLID_VREF_INVALID:'+x.slice(0,16));
    const [,prefix,ring,index,apex]=m;
    if(prefix!==undefined){
      const owner=solids.find(s=>s.id===prefix);
      if(!owner)bad('SOLID_VREF_SOLID_UNKNOWN:'+prefix);
      if(owner.category!=='POLY')bad('SOLID_VREF_UNSUPPORTED:'+owner.kind);
      if(owner.cuts)bad('SOLID_VREF_UNSUPPORTED:CUT');
    }
    const found=[];
    for(const solid of solids){
      if(solid.category!=='POLY'||solid.cuts||(prefix!==undefined&&solid.id!==prefix))continue;
      const i=slotIndex(solid,ring,index,apex);
      if(i!==null)found.push([solid,i]);
    }
    if(!found.length)bad('SOLID_VREF_UNKNOWN:'+x.slice(0,16));
    if(found.length>1)bad('SOLID_VREF_AMBIGUOUS:'+x.slice(0,16));
    return vertexKeys(found[0][0],found[0][1])[0];
  };
}
/** An edge written as a two-letter string ("AB") or as a list of two names / references. */
function edgePair(e,code){
  if(Array.isArray(e)){if(e.length!==2)bad(code);return [e[0],e[1]];}
  if(typeof e!=='string'||e.length!==2)bad(code);
  return [...e];
}
/** Key -> the 3D point, for the names and the canonical keys of the solids of a model. */
function pointTable(solids){
  const table=new Map();
  for(const solid of solids){
    if(solid.category==='POLY')solid.vertices.forEach((v,i)=>{for(const key of vertexKeys(solid,i))table.set(key,v.p);});
    else for(const q of solid.points)if(q.name)table.set(q.name,q.p);
  }
  return table;
}

// --- solving the figure ---------------------------------------------------------------------------------------------------------------------
const MAX_SEGMENTS=10;
// highlight tints: a fill colour and its opacity (LIGHT is the original blue shade of every highlight)
const HIGHLIGHT_FILLS={LIGHT:['#7fa6e8',0.32],MEDIUM:['#7fa6e8',0.55],WARM:['#f2a65a',0.42],GREEN:['#6fcf97',0.42],ROSE:['#e98aa8',0.42],VIOLET:['#a78bdb',0.42]};
const POLY_KINDS=['PRISM','PYRAMID','FRUSTUM','REGULAR_POLYHEDRON','BIPYRAMID'],ROUND_KINDS=['CYLINDER','CONE','CONE_FRUSTUM','SPHERE','HEMISPHERE'];
const UNIT=/^(cm|mm|m|km)$/;
export function solveSolidFigure(plan){
  if(!isPlain(plan)||plan.capability!==SOLID_CAPABILITY)bad('SOLID_PLAN_INVALID');
  onlyKeys(plan,['capability','unit','solids','net','dims','highlights','segments','section','marks','labels','solidCaption','caption','sourceConditions','newVisualInformation','sourceQuote','panelWidth'],'SOLID_PLAN_INVALID');
  if((plan.solids===undefined)===(plan.net===undefined))bad('SOLID_PLAN_INVALID');
  if(plan.labels!==undefined&&plan.net!==undefined)bad('SOLID_LABELS_UNSUPPORTED:NET');
  // sourceQuote is provenance only (the item sentence the plan was written from): it never reaches the figure
  if(plan.sourceQuote!==undefined&&(typeof plan.sourceQuote!=='string'||!plan.sourceQuote.trim()||plan.sourceQuote.length>200))bad('SOLID_SOURCE_QUOTE_INVALID');
  if(plan.panelWidth!==undefined&&plan.panelWidth!==GRID_PANEL_WIDTH)bad('SOLID_PLAN_INVALID');
  if(plan.unit!==undefined&&(typeof plan.unit!=='string'||!UNIT.test(plan.unit)))bad('SOLID_UNIT_INVALID');
  const model=plan.net!==undefined?solveNet(plan):solveSolids(plan);
  // the Archive publication check reads text: a figure with no name and no length at all cannot be published
  const names=model.mode==='SOLIDS'?model.solids.reduce((sum,solid)=>sum+(solid.category==='POLY'?solid.vertices:solid.points).filter(q=>q.name).length+(solid.count?(solid.count.vertices?solid.vertices.length:0)+(solid.count.edges?solid.edges.length:0):0),0)
    :model.netKind==='POLYHEDRON'?model.faces.reduce((sum,f)=>sum+f.corners.filter(Boolean).length,0):0;
  // A figure with no name, length or label is still readable when something in it is stressed (a highlighted face, a drawn segment, a section, a mark, a cut) or when it
  // carries a caption: the author's solidCaption, or the panel caption of a composite grid (the grid sets panelWidth, and every composite panel has a caption).
  // Only a bare, uncaptioned figure is refused: there nothing tells the reader which part matters.
  const stressed=model.mode==='SOLIDS'
    ?model.highlights.length+model.segments.length+(model.section?1:0)+model.marks.rightAngles.length+model.marks.equalLengths.length+model.marks.angles.length+(model.marks.equalSlant?.length??0)+model.solids.filter(s=>s.cuts||s.cut||s.axis).length
    :(model.highlights?.length??0)+(model.segments?.length??0)+(model.rightAngles?.length??0)+(model.excluded?.length??0);
  if(names+model.dims.length+(model.faceLabels?.length??0)+(model.labels?.length??0)+stressed===0&&plan.solidCaption===undefined&&plan.panelWidth===undefined)bad('SOLID_FIGURE_NEEDS_A_LABEL');
  return plan.panelWidth===undefined?model:{...model,panelWidth:plan.panelWidth};
}
function solveSolids(plan){
  if(!Array.isArray(plan.solids)||plan.solids.length<1||plan.solids.length>3)bad('SOLID_COUNT_INVALID');
  const solids=plan.solids.map((spec,i)=>{
    if(!isPlain(spec))bad('SOLID_PARAM_INVALID');
    const withId={...spec,id:spec.id??'s'+(i+1)};
    if(typeof withId.id!=='string'||!/^[a-z][a-z0-9]{0,7}$/.test(withId.id))bad('SOLID_ID_INVALID');
    if(POLY_KINDS.includes(spec.kind))return buildPolyhedron(withId);
    if(ROUND_KINDS.includes(spec.kind))return buildRound(withId);
    return bad('SOLID_KIND_UNSUPPORTED:'+String(spec.kind).slice(0,24));
  });
  if(new Set(solids.map(s=>s.id)).size!==solids.length)bad('SOLID_ID_INVALID');
  // a round solid may sit on the same axis inside a cylinder; the plan states the host id and the solids are checked to fit
  for(const solid of solids){
    if(!solid.inside)continue;
    const host=solids.find(s=>s.id===solid.inside);
    if(!host||host===solid)bad('SOLID_NEST_UNKNOWN:'+solid.inside);
    if(host.inside)bad('SOLID_NEST_CHAIN');
    if(host.kind!=='CYLINDER')bad('SOLID_NEST_UNSUPPORTED:'+host.kind);
    if(solid.kind==='SPHERE'){if(2*solid.radius>host.height+1e-9||solid.radius>host.radius+1e-9)bad('SOLID_NEST_DOES_NOT_FIT:'+solid.id);}
    else if(solid.kind==='CONE'||solid.kind==='CONE_FRUSTUM'){if(solid.height>host.height+1e-9||Math.max(solid.r0,solid.r1)>host.radius+1e-9)bad('SOLID_NEST_DOES_NOT_FIT:'+solid.id);}
    else bad('SOLID_NEST_UNSUPPORTED:'+solid.kind);
  }
  for(const solid of solids)recentre(solid);
  // side-by-side placement on the screen's horizontal; a nested solid stays on its host's axis
  const roots=solids.filter(solid=>!solid.inside);
  const boxes=roots.map(solid=>{const pts=solidScreenPoints(solid);return {x0:Math.min(...pts.map(p=>p[0])),x1:Math.max(...pts.map(p=>p[0]))};});
  const gap=0.3*Math.max(...boxes.map(b=>b.x1-b.x0));
  let cursor=0;
  roots.forEach((solid,i)=>{
    const b=boxes[i],w=b.x1-b.x0;
    const target=cursor-b.x0;// leftmost screen x at the cursor
    shiftSolid(solid,target);cursor+=w+gap;
  });
  for(const solid of solids)if(solid.inside){
    const host=solids.find(s=>s.id===solid.inside);
    shiftSolid(solid,host.offset??0);
  }
  for(const solid of solids){
    if(solid.category==='POLY')solid.runs=edgeRuns(solid);
  }
  // names are global; points are read after the placement
  const named=new Map();
  for(const solid of solids){
    if(solid.category==='POLY')solid.vertices.forEach((v,i)=>{for(const key of vertexKeys(solid,i)){if(named.has(key))bad('SOLID_NAME_DUPLICATE:'+key);named.set(key,{solid:solid.id,p:v.p});}});
    else for(const q of solid.points){if(q.name===null||q.name===undefined)continue;if(named.has(q.name))bad('SOLID_NAME_DUPLICATE:'+q.name);named.set(q.name,{solid:solid.id,p:q.p});}
  }
  // a name or a vertex reference ("#b0", "#t2", "#apex", "#v5"; see above) becomes the key of its vertex
  const vref=vertexResolver(solids,named);
  // segments (aux) between named points
  const segments=[];
  if(plan.segments!==undefined){
    if(!Array.isArray(plan.segments)||plan.segments.length>MAX_SEGMENTS)bad('SOLID_SEGMENTS_INVALID');
    for(const s of plan.segments){
      onlyKeys(s,['from','to','style','role'],'SOLID_SEGMENTS_INVALID');
      const from=vref(s.from),to=vref(s.to);
      if(from===to)bad('SOLID_NAME_UNKNOWN');
      const style=s.style??'SOLID';
      if(!['SOLID','DASHED','AUTO'].includes(style))bad('SOLID_SEGMENTS_INVALID');
      if(s.role!==undefined&&!['ACCENT','REF'].includes(s.role))bad('SOLID_SEGMENTS_INVALID');
      segments.push({from,to,style,role:s.role??'ACCENT'});
    }
  }
  const drawnPair=(a,b)=>segments.some(s=>(s.from===a&&s.to===b)||(s.from===b&&s.to===a))||solids.some(solid=>solid.category==='POLY'&&solid.edges.some(([i,j])=>{const x=vertexKeys(solid,i),y=vertexKeys(solid,j);return (x.includes(a)&&y.includes(b))||(x.includes(b)&&y.includes(a));}));
  // auto visibility of an AUTO segment: depth test at several points
  for(const s of segments)if(s.style==='AUTO'){
    const solid=solids.find(x=>x.id===named.get(s.from).solid);
    if(solid.category!=='POLY')bad('SOLID_SEGMENTS_INVALID');
    const planes=new Map(solid.faces.map(face=>[face.id,facePlane(solid,face)]));
    const A=named.get(s.from).p,B=named.get(s.to).p;
    const hiddenSamples=[0.2,0.4,0.6,0.8].map(t=>occluded(planes,lerp(A,B,t),new Set()));
    s.hidden=hiddenSamples.filter(Boolean).length>=2;
  }
  // highlights: planar polygons of named vertices, or whole faces of a polyhedron by their face name (bottom, top, side0, ...: named vertices not needed); fill picks the tint
  const highlights=[],faceKeys=new Set();
  if(plan.highlights!==undefined){
    if(!Array.isArray(plan.highlights)||plan.highlights.length>8)bad('SOLID_HIGHLIGHT_INVALID');
    for(const h of plan.highlights){
      onlyKeys(h,['polygon','face','solid','fill'],'SOLID_HIGHLIGHT_INVALID');
      if((h.polygon===undefined)===(h.face===undefined))bad('SOLID_HIGHLIGHT_INVALID');
      const fill=h.fill??'LIGHT';
      if(typeof fill!=='string'||!Object.hasOwn(HIGHLIGHT_FILLS,fill))bad('SOLID_HIGHLIGHT_FILL_INVALID');
      const tint=fill==='LIGHT'?{}:{fill};
      if(h.face!==undefined){
        if(typeof h.face!=='string')bad('SOLID_HIGHLIGHT_INVALID');
        const polys=solids.filter(x=>x.category==='POLY'),owner=h.solid!==undefined?polys.find(x=>x.id===h.solid):polys.length===1?polys[0]:undefined;
        if(!owner)bad('SOLID_HIGHLIGHT_INVALID');// several polyhedra need the solid id; a round solid has no named faces
        if(owner.cuts)bad('SOLID_HIGHLIGHT_FACE_UNSUPPORTED:CUT');
        if(!owner.faces.some(f=>f.id===h.face))bad('SOLID_HIGHLIGHT_FACE_UNKNOWN:'+h.face.slice(0,12));
        const key=owner.id+'|'+h.face;
        if(faceKeys.has(key))bad('SOLID_HIGHLIGHT_INVALID');
        faceKeys.add(key);
        highlights.push({solid:owner.id,face:h.face,...tint});
        continue;
      }
      if(h.solid!==undefined)bad('SOLID_HIGHLIGHT_INVALID');
      if(!Array.isArray(h.polygon)||h.polygon.length<3||h.polygon.length>6||new Set(h.polygon).size!==h.polygon.length)bad('SOLID_HIGHLIGHT_INVALID');
      const keys=h.polygon.map(name=>vref(name));
      if(new Set(keys).size!==keys.length)bad('SOLID_HIGHLIGHT_INVALID');
      const pts=keys.map(key=>named.get(key).p);
      const nrm=faceNormal(pts);
      if(pts.some(p=>Math.abs(dot(nrm,sub(p,pts[0])))>1e-6)||len(nrm)<0.5)bad('SOLID_HIGHLIGHT_NOT_PLANAR');
      for(let k=0;k<keys.length;k++){const a=keys[k],b=keys[(k+1)%keys.length];if(!drawnPair(a,b))bad('SOLID_HIGHLIGHT_EDGE_NOT_DRAWN:'+joinKeys([a,b]));}
      highlights.push({polygon:keys,...tint});
    }
  }
  // marks on named points: right angles, equal-length groups and angle arcs (the plan states the fact; the model checks it in 3D)
  const marks={rightAngles:[],equalLengths:[],angles:[]};
  if(plan.marks!==undefined){
    if(!isPlain(plan.marks))bad('SOLID_MARKS_INVALID');
    onlyKeys(plan.marks,['rightAngles','equalLengths','angles','equalSlant'],'SOLID_MARKS_INVALID');
    const used=new Set(),tickCounts=new Set();// the tick counts of equal-length groups and of equal-slant groups are all different, so no two groups read as one
    const markId=(given,prefix,k)=>{const id=given??prefix+(k+1);if(typeof id!=='string'||!/^[a-zA-Z][a-zA-Z0-9-]{0,15}$/.test(id)||used.has(id))bad('SOLID_MARK_ID_INVALID:'+String(id).slice(0,24));used.add(id);return id;};
    const cosAngle=(a,v,b)=>{const u=unit(sub(a,v)),w=unit(sub(b,v));return Math.max(-1,Math.min(1,dot(u,w)));};
    const angleDeg=(a,v,b)=>Math.acos(cosAngle(a,v,b))*180/Math.PI;
    const keyOf=x=>vref(x,'SOLID_MARK_UNKNOWN:'+String(x).slice(0,24));
    const pointOf=key=>named.get(key).p;
    if(plan.marks.rightAngles!==undefined){
      if(!Array.isArray(plan.marks.rightAngles)||plan.marks.rightAngles.length>4)bad('SOLID_MARKS_INVALID');
      for(const [k,m] of plan.marks.rightAngles.entries()){
        onlyKeys(m,['id','at','refs'],'SOLID_MARKS_INVALID');
        const id=markId(m.id,'ra',k);
        if(typeof m.at!=='string'||!Array.isArray(m.refs)||m.refs.length!==2||m.refs[0]===m.refs[1]||m.refs.includes(m.at))bad('SOLID_MARKS_INVALID');
        const at=keyOf(m.at),r0=keyOf(m.refs[0]),r1=keyOf(m.refs[1]);
        if(r0===r1||at===r0||at===r1)bad('SOLID_MARKS_INVALID');
        const V=pointOf(at),A=pointOf(r0),B=pointOf(r1);
        if(Math.abs(cosAngle(A,V,B))>1e-6)bad('SOLID_MARK_NOT_RIGHT_ANGLE:'+id);
        if(!drawnPair(at,r0)||!drawnPair(at,r1))bad('SOLID_MARK_RAY_NOT_DRAWN:'+id);
        marks.rightAngles.push({id,at,refs:[r0,r1]});
      }
    }
    if(plan.marks.equalLengths!==undefined){
      if(!Array.isArray(plan.marks.equalLengths)||plan.marks.equalLengths.length>4)bad('SOLID_MARKS_INVALID');
      for(const [k,g] of plan.marks.equalLengths.entries()){
        onlyKeys(g,['id','count','segments'],'SOLID_MARKS_INVALID');
        const id=markId(g.id,'eq',k),count=g.count??1;
        if(!Number.isInteger(count)||count<1||count>3)bad('SOLID_MARKS_INVALID');
        if(tickCounts.has(count))bad('SOLID_MARK_GROUP_AMBIGUOUS:'+id);tickCounts.add(count);
        if(!Array.isArray(g.segments)||g.segments.length<2||g.segments.length>4)bad('SOLID_MARKS_INVALID');
        const segs=[];
        for(const pair of g.segments){
          const [pa,pb]=edgePair(pair,'SOLID_MARKS_INVALID');
          if(pa===pb)bad('SOLID_MARKS_INVALID');
          const a=keyOf(pa),b=keyOf(pb),label=Array.isArray(pair)?pair.join(','):pair;
          if(a===b)bad('SOLID_MARKS_INVALID');
          if(!drawnPair(a,b))bad('SOLID_MARK_SEGMENT_NOT_DRAWN:'+label);
          segs.push([a,b]);
        }
        const lengths=segs.map(([a,b])=>len(sub(named.get(a).p,named.get(b).p)));
        const ref=lengths[0];
        if(lengths.some(L=>Math.abs(L-ref)>1e-6*Math.max(1,ref)))bad('SOLID_MARK_LENGTH_MISMATCH:'+id);
        marks.equalLengths.push({id,count,segments:segs});
      }
    }
    // equalSlant: true | {solid?,count?} | a list of those: the left and the right slant (silhouette) of a cone or cone frustum get the same ticks (the two slants of a cone of revolution are as long as each other)
    if(plan.marks.equalSlant!==undefined){
      const raw=plan.marks.equalSlant,list=raw===true?[{}]:Array.isArray(raw)?raw:[raw];
      if(list.length<1||list.length>3)bad('SOLID_MARKS_INVALID');
      marks.equalSlant=[];
      const cones=solids.filter(s=>s.kind==='CONE'||s.kind==='CONE_FRUSTUM');
      for(const [k,g] of list.entries()){
        if(!isPlain(g))bad('SOLID_MARKS_INVALID');
        onlyKeys(g,['id','solid','count'],'SOLID_MARKS_INVALID');
        const id=markId(g.id,'es',k),count=g.count??1;
        if(!Number.isInteger(count)||count<1||count>3)bad('SOLID_MARKS_INVALID');
        if(tickCounts.has(count))bad('SOLID_MARK_GROUP_AMBIGUOUS:'+id);tickCounts.add(count);
        if(g.solid!==undefined&&typeof g.solid!=='string')bad('SOLID_MARKS_INVALID');
        const owner=g.solid!==undefined?cones.find(s=>s.id===g.solid):cones.length===1?cones[0]:undefined;
        if(!owner)bad('SOLID_MARK_SLANT_UNSUPPORTED:'+String(g.solid??'').slice(0,12));
        if(marks.equalSlant.some(x=>x.solid===owner.id))bad('SOLID_MARKS_INVALID');
        marks.equalSlant.push({id,solid:owner.id,count});
      }
    }
    if(plan.marks.angles!==undefined){
      if(!Array.isArray(plan.marks.angles)||plan.marks.angles.length>4)bad('SOLID_MARKS_INVALID');
      const counts=new Map();
      for(const [k,m] of plan.marks.angles.entries()){
        onlyKeys(m,['id','refs','value','arcs','equalGroup'],'SOLID_MARKS_INVALID');
        const id=markId(m.id,'an',k);
        if(!Array.isArray(m.refs)||m.refs.length!==3||new Set(m.refs).size!==3)bad('SOLID_MARKS_INVALID');
        const a=keyOf(m.refs[0]),v=keyOf(m.refs[1]),b=keyOf(m.refs[2]);
        if(new Set([a,v,b]).size!==3)bad('SOLID_MARKS_INVALID');
        const A=pointOf(a),V=pointOf(v),B=pointOf(b);
        if(!drawnPair(v,a)||!drawnPair(v,b))bad('SOLID_MARK_RAY_NOT_DRAWN:'+id);
        const measured=angleDeg(A,V,B);
        if(!(measured>5&&measured<175))bad('SOLID_MARK_ANGLE_DEGENERATE:'+id);
        if(m.value!==undefined&&(typeof m.value!=='number'||Math.abs(m.value-measured)>0.5))bad('SOLID_MARK_ANGLE_MISMATCH:'+id);
        const arcs=m.arcs??1;
        if(!Number.isInteger(arcs)||arcs<1||arcs>3)bad('SOLID_MARKS_INVALID');
        const group=m.equalGroup??('solo-'+id);
        if(typeof group!=='string')bad('SOLID_MARKS_INVALID');
        const prev=counts.get(group);
        if(prev){if(prev.arcs!==arcs)bad('SOLID_MARK_GROUP_ARC_COUNT:'+id);if(Math.abs(prev.value-measured)>0.5)bad('SOLID_MARK_GROUP_MISMATCH:'+id);}
        else{for(const [other,p] of counts)if(p.arcs===arcs)bad('SOLID_MARK_GROUP_AMBIGUOUS:'+id);counts.set(group,{arcs,value:measured});}
        marks.angles.push({id,refs:[a,v,b],value:r6(measured),arcs});
      }
    }
  }
  // axial section of a round solid
  let section=null;
  if(plan.section!==undefined){
    onlyKeys(plan.section,['solid','kind','at','fill'],'SOLID_SECTION_INVALID');
    if(plan.section.kind!=='AXIAL'&&plan.section.kind!=='LEVEL')bad('SOLID_SECTION_UNSUPPORTED');
    const target=plan.section.solid??solids.find(s=>s.category==='REV')?.id;
    const solid=solids.find(s=>s.id===target);
    if(!solid||solid.category!=='REV')bad('SOLID_SECTION_UNSUPPORTED');
    if(plan.section.kind==='AXIAL'){if(plan.section.at!==undefined||plan.section.fill!==undefined)bad('SOLID_SECTION_INVALID');section={solid:solid.id,kind:'AXIAL'};}
    else{
      // a plane parallel to the base at the fraction `at` ("1/3") of the height: the water level of a vessel
      const m=/^([1-9]\d?)\/([1-9]\d?)$/.exec(plan.section.at??'');
      if(!m||Number(m[1])>=Number(m[2]))bad('SOLID_SECTION_INVALID');
      const f=Number(m[1])/Number(m[2]),z=f*solid.height,r=solid.r0+(solid.r1-solid.r0)*f;
      if(!(r>0))bad('SOLID_SECTION_INVALID');
      if(solid.orientation==='APEX_DOWN'&&!(z*cP>r*sP))bad('SOLID_LEVEL_APEX_HIDDEN');
      // fill:"BOTTOM"|"TOP" shades the body of the solid below or above the plane (an apex-up solid: a frustum below a cone, the small cone above); an apex-down vessel already shades its liquid
      const fill=plan.section.fill;
      if(fill!==undefined){
        if(fill!=='BOTTOM'&&fill!=='TOP')bad('SOLID_SECTION_FILL_INVALID');
        if(solid.orientation==='APEX_DOWN')bad('SOLID_SECTION_FILL_UNSUPPORTED:APEX_DOWN');
      }
      section={solid:solid.id,kind:'LEVEL',at:plan.section.at,z:r6(z),r:r6(r),...(fill!==undefined?{fill}:{})};
    }
  }
  // dimensions
  const dims=[];
  const unitName=plan.unit??null;
  if(plan.dims!==undefined){
    if(!Array.isArray(plan.dims)||plan.dims.length>10)bad('SOLID_DIMS_INVALID');
    plan.dims.forEach((d,k)=>{
      onlyKeys(d,['from','to','edge','radius','height','slant','level','solid','label'],'SOLID_DIMS_INVALID');
      if((d.from===undefined)!==(d.to===undefined))bad('SOLID_DIMS_INVALID');
      if([d.edge!==undefined,d.from!==undefined,d.radius!==undefined,d.height!==undefined,d.slant!==undefined,d.level!==undefined].filter(Boolean).length!==1)bad('SOLID_DIMS_INVALID');
      const code='d'+(k+1);
      if(d.edge!==undefined||d.from!==undefined){
        let a,b;
        // the edge is a two-letter string "AB", or a list of two names / vertex references ["#b1","#t1"]; from/to take either too
        if(d.edge!==undefined)[a,b]=edgePair(d.edge,'SOLID_DIMS_INVALID');else{a=d.from;b=d.to;}
        a=vref(a);b=vref(b);
        if(a===b)bad('SOLID_NAME_UNKNOWN');
        if(!drawnPair(a,b))bad('SOLID_DIM_SEGMENT_NOT_DRAWN:'+joinKeys([a,b]));
        const value=len(sub(named.get(a).p,named.get(b).p));
        dims.push({id:'dim-'+(k+1),type:'SEGMENT',from:a,to:b,...dimLabel(d.label,value,unitName,code)});
      }else{
        const solid=solids.find(s=>s.id===(d.solid??(d.level!==undefined?section?.solid:d.radius!==undefined||d.slant!==undefined?solids.find(s2=>s2.category==='REV'||s2.category==='SPHERE')?.id:solids.find(s2=>s2.category==='REV'||s2.kind==='PYRAMID'||s2.kind==='FRUSTUM')?.id)));
        if(!solid)bad('SOLID_DIMS_INVALID');
        if(d.radius!==undefined){
          if(solid.category==='POLY')bad('SOLID_DIMS_INVALID');
          const which=d.radius;
          if(!['bottom','top','center','level'].includes(which))bad('SOLID_DIMS_INVALID');
          if(which==='center'){if(solid.category!=='SPHERE')bad('SOLID_DIMS_INVALID');}
          else if(solid.category==='SPHERE')bad('SOLID_DIMS_INVALID');
          let z,rimR;
          if(which==='center'){z=solid.kind==='SPHERE'?solid.radius:0;rimR=solid.radius;}
          else if(which==='level'){
            if(!section||section.kind!=='LEVEL'||section.solid!==solid.id)bad('SOLID_DIMS_INVALID');
            // the radius comes from the exact fraction, not the rounded section.r, so a length such as 20/3 still has an exact label
            const fm=/^([1-9]\d?)\/([1-9]\d?)$/.exec(section.at);
            const f=Number(fm[1])/Number(fm[2]);
            z=section.z;rimR=solid.r0+(solid.r1-solid.r0)*f;
          }else{
            if(which==='bottom'&&!(solid.r0>0))bad('SOLID_DIMS_INVALID');
            if(which==='top'&&!(solid.r1>0))bad('SOLID_DIMS_INVALID');
            z=which==='top'?solid.height:0;rimR=which==='top'?solid.r1:solid.r0;
          }
          // a cut sphere's radius lies along one of its seen half axes (sphere-parts.mjs picks it), not along the screen's horizontal
          if(solid.cut&&!solid.cut.radiusAxis)bad('SOLID_SPHERE_CUT_RADIUS_HIDDEN');
          dims.push({id:'dim-'+(k+1),type:'RADIUS',solid:solid.id,which,z,r:r6(rimR),...(solid.cut?{axis:solid.cut.radiusAxis}:{}),...dimLabel(d.label,rimR,unitName,code)});
        }else if(d.level!==undefined){
          if(!(d.level===true||d.level==='bottom'||d.level==='top')||!section||section.kind!=='LEVEL'||section.solid!==solid.id)bad('SOLID_DIMS_INVALID');
          // level:"top" is the part above the cutting plane (apex/top down to the section); true and "bottom" are the part below it
          const fm=/^([1-9]\d?)\/([1-9]\d?)$/.exec(section.at);
          const f=Number(fm[1])/Number(fm[2]);
          const side=d.level==='top'?'TOP':'BOTTOM';
          const value=side==='TOP'?solid.height*(1-f):solid.height*f;
          dims.push({id:'dim-'+(k+1),type:'LEVEL',side,solid:solid.id,...dimLabel(d.label,value,unitName,code)});
        }else if(d.height!==undefined){
          if(d.height!==true)bad('SOLID_DIMS_INVALID');
          if(solid.category==='SPHERE'&&solid.kind==='SPHERE')bad('SOLID_DIMS_INVALID');
          if(solid.cuts||solid.kind==='REGULAR_POLYHEDRON'||solid.kind==='BIPYRAMID')bad('SOLID_DIMS_INVALID');
          const h=solid.height;
          dims.push({id:'dim-'+(k+1),type:'HEIGHT',solid:solid.id,...dimLabel(d.label,h,unitName,code)});
        }else{
          if(d.slant!==true||(solid.kind!=='CONE'&&solid.kind!=='CONE_FRUSTUM'))bad('SOLID_DIMS_INVALID');
          const l=Math.hypot(solid.radius-solid.topRadius,solid.height);
          dims.push({id:'dim-'+(k+1),type:'SLANT',solid:solid.id,...dimLabel(d.label,l,unitName,code)});
        }
      }
    });
  }
  // a height dimension of a pyramid / frustum is the foot line from the apex (or top centre) to the base plane
  for(const d of dims)if(d.type==='HEIGHT'){
    const solid=solids.find(s=>s.id===d.solid);
    if(solid.category==='POLY'){
      if(solid.kind==='PRISM')bad('SOLID_DIMS_INVALID');
      const apexV=solid.kind==='PYRAMID'?solid.vertices[solid.vertices.length-1]:null;
      const topP=apexV?apexV.p:solid.vertices.slice(solid.vertices.length/2).reduce((s,v)=>add(s,mulv(v.p,2/solid.vertices.length)),[0,0,0]);
      d.top=topP.map(r6);d.foot=[topP[0],topP[1],0].map(r6);
    }
  }
  // text labels: a short word on a vertex, on the axis of a rotation solid, on a visible face, on a drawn edge or on the slant of a cone (labels:[{text,at}] and axis:{label})
  const labels=textLabels(plan,solids,named,vref,drawnPair);
  return {schemaVersion:SOLID_MODEL_VERSION,mode:'SOLIDS',unit:unitName,yawDeg:YAW_DEG,pitchDeg:PITCH_DEG,solids,segments,highlights,section,marks,dims,...(labels.length?{labels}:{})};
}
/**
 * The text labels of a plan: labels:[{text,at}] with at a vertex name or reference ("A", "#apex"), {axis:true,solid?}, {face:"top",solid?} (a visible face of a polyhedron),
 * {edge:["#b0","#b1"]} (a drawn edge or segment) or {slant:true,solid?} (the slant of a cone or cone frustum), plus the axis labels of solids written axis:{label}.
 * Every label stands on one target, and a target takes one label.
 */
function textLabels(plan,solids,named,vref,drawnPair){
  const out=[],targets=new Set();
  const add=(text,at,target)=>{
    if(targets.has(target))bad('SOLID_LABEL_DUPLICATE_TARGET:'+target.slice(0,24));
    targets.add(target);
    out.push({id:'tl'+(out.length+1),text,at});
  };
  const rev=solids.filter(s=>s.category==='REV'),polys=solids.filter(s=>s.category==='POLY');
  const pick=(list,id,code)=>{const owner=id!==undefined?list.find(s=>s.id===id):list.length===1?list[0]:undefined;if(!owner)bad(code);return owner;};
  for(const solid of solids)if(solid.axis&&solid.axis.label!==null)add(solid.axis.label,{kind:'AXIS',solid:solid.id},'axis:'+solid.id);
  if(plan.labels===undefined)return out;
  if(!Array.isArray(plan.labels)||plan.labels.length<1||plan.labels.length>MAX_TEXT_LABELS)bad('SOLID_LABELS_INVALID');
  for(const entry of plan.labels){
    onlyKeys(entry,['text','at'],'SOLID_LABELS_INVALID');
    if(!textLabelOk(entry.text))bad('SOLID_LABEL_TEXT_INVALID');
    const at=entry.at;
    if(typeof at==='string'){
      const key=vref(at,'SOLID_LABEL_AT_UNKNOWN:'+at.slice(0,16));
      add(entry.text,{kind:'VERTEX',key},'vertex:'+key);
      continue;
    }
    if(!isPlain(at))bad('SOLID_LABEL_AT_INVALID');
    const kinds=['axis','face','edge','slant'].filter(k=>at[k]!==undefined);
    if(kinds.length!==1)bad('SOLID_LABEL_AT_INVALID');
    const kind=kinds[0];
    onlyKeys(at,kind==='edge'?['edge']:[kind,'solid'],'SOLID_LABEL_AT_INVALID');
    if(kind==='edge'){
      const [pa,pb]=edgePair(at.edge,'SOLID_LABEL_AT_INVALID'),a=vref(pa,'SOLID_LABEL_AT_UNKNOWN:'+String(pa).slice(0,16)),b=vref(pb,'SOLID_LABEL_AT_UNKNOWN:'+String(pb).slice(0,16));
      if(a===b)bad('SOLID_LABEL_AT_INVALID');
      if(!drawnPair(a,b))bad('SOLID_LABEL_EDGE_NOT_DRAWN:'+joinKeys([a,b]));
      add(entry.text,{kind:'EDGE',from:a,to:b},'edge:'+[a,b].sort().join('|'));
    }else if(kind==='axis'){
      if(at.axis!==true)bad('SOLID_LABEL_AT_INVALID');
      const owner=pick(rev,at.solid,'SOLID_LABEL_AXIS_UNSUPPORTED');
      if(owner.axis===undefined)owner.axis={label:null};// a labelled axis is drawn
      add(entry.text,{kind:'AXIS',solid:owner.id},'axis:'+owner.id);
    }else if(kind==='slant'){
      if(at.slant!==true)bad('SOLID_LABEL_AT_INVALID');
      const owner=pick(rev.filter(s=>s.kind==='CONE'||s.kind==='CONE_FRUSTUM'),at.solid,'SOLID_LABEL_SLANT_UNSUPPORTED');
      add(entry.text,{kind:'SLANT',solid:owner.id},'slant:'+owner.id);
    }else{
      if(typeof at.face!=='string')bad('SOLID_LABEL_AT_INVALID');
      const owner=pick(polys,at.solid,'SOLID_LABEL_FACE_UNSUPPORTED');
      if(owner.cuts)bad('SOLID_LABEL_FACE_UNSUPPORTED:CUT');
      const face=owner.faces.find(f=>f.id===at.face);
      if(!face)bad('SOLID_LABEL_FACE_UNKNOWN:'+at.face.slice(0,12));
      // a face is labelled inside its own outline, so it has to face the viewer (the front faces of a convex solid are wholly visible)
      if(dot(faceNormal(face.idx.map(i=>owner.vertices[i].p)),VIEW)<=0.02)bad('SOLID_LABEL_FACE_HIDDEN:'+at.face.slice(0,12));
      add(entry.text,{kind:'FACE',solid:owner.id,face:face.id},'face:'+owner.id+'|'+face.id);
    }
  }
  return out;
}
function solidScreenPoints(solid){
  if(solid.category==='POLY')return solid.vertices.map(v=>project(v.p));
  const r=solid.radius,pts=[];
  const ox=solid.offset??0;
  if(solid.cut)return cutSphereScreenPoints(solid);
  const ell=(rad,z)=>{const c=project([0,0,z]);c[0]+=ox;for(let k=0;k<24;k++){const u=2*Math.PI*k/24;pts.push([c[0]+rad*Math.cos(u),c[1]+rad*sP*Math.sin(u)]);}};
  if(solid.kind==='SPHERE'){const c=project([0,0,r]);c[0]+=ox;for(let k=0;k<24;k++){const u=2*Math.PI*k/24;pts.push([c[0]+r*Math.cos(u),c[1]+r*Math.sin(u)]);}}
  else if(solid.kind==='HEMISPHERE'){const c=project([0,0,0]);c[0]+=ox;for(let k=0;k<=12;k++){const u=Math.PI*k/12;pts.push([c[0]+r*Math.cos(u),c[1]+r*Math.sin(u)]);}ell(r,0);}
  else{
    if(solid.r0>0)ell(solid.r0,0);
    if(solid.r1>0)ell(solid.r1,solid.height);
    if(solid.r0===0||solid.r1===0){const q=project([0,0,solid.r0===0?0:solid.height]);pts.push([q[0]+ox,q[1]]);}
    if(solid.axis)pts.push(...axisEnds(solid));
  }
  return pts;
}

/** The drawn extent of a cut sphere: the stretches of its limb, its rim arcs and radii, and its centre (the whole sphere is not drawn). */
function cutSphereScreenPoints(solid){
  const r=solid.radius,ox=solid.offset??0,c=project([0,0,r]),cut=solid.cut;
  const at=q=>{const p=project(q);return [c[0]+ox+p[0],c[1]+p[1]];};
  const pts=[[c[0]+ox,c[1]]];
  for(const piece of cut.limb){
    for(let k=0;k<=24;k++){const u=piece.phi0+(piece.phi1-piece.phi0)*k/24;pts.push([c[0]+ox+r*Math.cos(u),c[1]+r*Math.sin(u)]);}
    // the extreme points of the circle (right, top, left, bottom) are the extent when they lie on a drawn stretch
    for(let u=0;u<=4*Math.PI;u+=Math.PI/2)if(u>=piece.phi0&&u<=piece.phi1)pts.push([c[0]+ox+r*Math.cos(u),c[1]+r*Math.sin(u)]);
  }
  for(const arc of cut.arcs)for(let k=0;k<=24;k++)pts.push(at(arcPoint(r,arc,Math.PI/2*k/24)));
  for(const crease of cut.creases)pts.push(at(CUT_AXES[crease.axis].map(v=>v*crease.sign*r)));
  return pts;
}

// --- nets -----------------------------------------------------------------------------------------------------------------------------------
const rot=(p,c,s)=>[p[0]*c-p[1]*s,p[0]*s+p[1]*c];
/** Local 2D coordinates of a face seen from outside (counter-clockwise): origin at its first vertex, x along its first edge. */
function flatten(pts3){
  const n=faceNormal(pts3),ex=unit(sub(pts3[1],pts3[0])),ey=cross(n,ex);
  return pts3.map(p=>{const d=sub(p,pts3[0]);return [r6(dot(d,ex)),r6(dot(d,ey))];});
}
function polyOverlap(a,b){
  const na=a.length,nb=b.length;
  for(let i=0;i<na;i++)for(let j=0;j<nb;j++)if(segmentsCross(a[i],a[(i+1)%na],b[j],b[(j+1)%nb]))return true;
  const cen=p=>p.reduce((s,q)=>[s[0]+q[0]/p.length,s[1]+q[1]/p.length],[0,0]);
  // a face strictly inside another (identical centroids included)
  const shrink=(p)=>{const c=cen(p);return p.map(q=>[c[0]+(q[0]-c[0])*0.9,c[1]+(q[1]-c[1])*0.9]);};
  return shrink(a).some(q=>inside2(b,q))||shrink(b).some(q=>inside2(a,q))||inside2(b,cen(a))||inside2(a,cen(b));
}
const NET_FILLS=['LIGHT','MEDIUM'],NET_ROLES=['ACCENT','REF'];
const sameNetSegment=(p,q)=>{
  const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-3;
  return (near(p[0],q[0])&&near(p[1],q[1]))||(near(p[0],q[1])&&near(p[1],q[0]));
};
/**
 * Faces to tint and edges to stress on a polyhedron net. A face is named (bottom, side0, ...); an edge is the `edge`-th side of a face in its cycle order
 * or the pair of corner names written on the net. A corner-name pair that finds no drawn edge, or finds several different ones, is refused.
 * A diagonal of one face (two corners of a face that are not neighbours) is stressed the same two ways: {face,diagonal:[i,j]} by corner index in the
 * face's cycle order, or {from,to} when the two names are no drawn edge but stand at two non-neighbouring corners of one face.
 */
function netEmphasis(net,faces){
  const highlights=[],segments=[];
  const byId=new Map(faces.map(f=>[f.id,f]));
  if(net.highlights!==undefined){
    if(!Array.isArray(net.highlights)||net.highlights.length<1||net.highlights.length>faces.length)bad('SOLID_NET_HIGHLIGHT_INVALID');
    for(const h of net.highlights){
      onlyKeys(h,['face','fill'],'SOLID_NET_HIGHLIGHT_INVALID');
      if(typeof h.face!=='string')bad('SOLID_NET_HIGHLIGHT_INVALID');
      if(!byId.has(h.face))bad('SOLID_NET_FACE_UNKNOWN');
      const fill=h.fill??'LIGHT';
      if(!NET_FILLS.includes(fill)||highlights.some(x=>x.face===h.face))bad('SOLID_NET_HIGHLIGHT_INVALID');
      highlights.push({face:h.face,fill});
    }
  }
  if(net.segments!==undefined){
    if(!Array.isArray(net.segments)||net.segments.length<1||net.segments.length>8)bad('SOLID_NET_SEGMENT_INVALID');
    for(const s of net.segments){
      onlyKeys(s,['face','edge','diagonal','from','to','role'],'SOLID_NET_SEGMENT_INVALID');
      const role=s.role??'ACCENT';
      if(!NET_ROLES.includes(role))bad('SOLID_NET_SEGMENT_INVALID');
      const byIndex=s.face!==undefined||s.edge!==undefined||s.diagonal!==undefined,byName=s.from!==undefined||s.to!==undefined;
      if(byIndex===byName)bad('SOLID_NET_SEGMENT_INVALID');
      let face,edge,record;
      const diagonalOf=(f,i,j)=>{
        // two corners of one face that are not neighbours in its cycle
        const n=f.idx.length;
        if(!Number.isInteger(i)||!Number.isInteger(j)||i<0||j<0||i>=n||j>=n||i===j||(i+1)%n===j||(j+1)%n===i)bad('SOLID_NET_SEGMENT_INVALID');
        return [Math.min(i,j),Math.max(i,j)];
      };
      const addDiagonal=(f,pair,rec)=>{
        const seg=[f.poly[pair[0]],f.poly[pair[1]]];
        if(segments.some(x=>x.diagonal&&sameNetSegment([byId.get(x.face).poly[x.diagonal[0]],byId.get(x.face).poly[x.diagonal[1]]],seg)))bad('SOLID_NET_SEGMENT_DUPLICATE');
        segments.push(rec);
      };
      if(s.diagonal!==undefined){
        if(typeof s.face!=='string'||s.edge!==undefined||!Array.isArray(s.diagonal)||s.diagonal.length!==2)bad('SOLID_NET_SEGMENT_INVALID');
        if(!byId.has(s.face))bad('SOLID_NET_FACE_UNKNOWN');
        const f=byId.get(s.face),pair=diagonalOf(f,s.diagonal[0],s.diagonal[1]);
        addDiagonal(f,pair,{face:s.face,diagonal:pair,role});
        continue;
      }
      if(byIndex){
        if(typeof s.face!=='string'||s.edge===undefined)bad('SOLID_NET_SEGMENT_INVALID');
        if(!byId.has(s.face))bad('SOLID_NET_FACE_UNKNOWN');
        if(!Number.isInteger(s.edge)||s.edge<0||s.edge>=byId.get(s.face).idx.length)bad('SOLID_NET_SEGMENT_INVALID');
        face=s.face;edge=s.edge;record={face,edge,role};
      }else{
        if(typeof s.from!=='string'||typeof s.to!=='string'||s.from===s.to||!NAME.test(s.from)||!NAME.test(s.to))bad('SOLID_NET_SEGMENT_INVALID');
        const found=[];
        for(const f of faces){
          const n=f.corners.length;
          for(let k=0;k<n;k++){
            const a=f.corners[k],b=f.corners[(k+1)%n];
            if((a===s.from&&b===s.to)||(a===s.to&&b===s.from))found.push({face:f.id,edge:k,seg:[f.poly[k],f.poly[(k+1)%n]]});
          }
        }
        if(!found.length){
          // no drawn edge carries the two names: a diagonal of one face does (both corners written on that face, not neighbours)
          const diagonals=[];
          for(const f of faces){
            const i=f.corners.indexOf(s.from),j=f.corners.indexOf(s.to);
            if(i<0||j<0)continue;
            const n=f.corners.length;
            if((i+1)%n===j||(j+1)%n===i)continue;
            diagonals.push({face:f,pair:[Math.min(i,j),Math.max(i,j)],seg:[f.poly[i],f.poly[j]]});
          }
          if(!diagonals.length)bad('SOLID_NET_EDGE_UNKNOWN:'+s.from+s.to);
          if(diagonals.some(x=>!sameNetSegment(x.seg,diagonals[0].seg)))bad('SOLID_NET_EDGE_AMBIGUOUS:'+s.from+s.to);
          addDiagonal(diagonals[0].face,diagonals[0].pair,{face:diagonals[0].face.id,diagonal:diagonals[0].pair,role,from:s.from,to:s.to});
          continue;
        }
        if(found.some(x=>!sameNetSegment(x.seg,found[0].seg)))bad('SOLID_NET_EDGE_AMBIGUOUS:'+s.from+s.to);
        face=found[0].face;edge=found[0].edge;record={face,edge,role,from:s.from,to:s.to};
      }
      const f=byId.get(face),seg=[f.poly[edge],f.poly[(edge+1)%f.poly.length]];
      if(segments.some(x=>{if(x.diagonal)return false;const g=byId.get(x.face);return sameNetSegment([g.poly[x.edge],g.poly[(x.edge+1)%g.poly.length]],seg);}))bad('SOLID_NET_SEGMENT_DUPLICATE');
      segments.push(record);
    }
  }
  return {highlights,segments};
}
/** The label of a face area: undefined `raw` writes the exact area, a number must equal it, anything else is a symbol; a numeric label carries the unit squared. */
function areaLabel(raw,value,unit,code){
  let tex,numeric=true,symbol=false;
  if(raw===undefined){
    tex=lengthTex(value);
    if(tex===null)bad('SOLID_FACE_LABEL_NOT_EXPRESSIBLE:'+code);
  }else if(typeof raw==='string'&&!SYMBOLIC.test(raw)&&FACE_SYMBOL.test(raw)){tex=raw;numeric=false;symbol=true;}// ASCII such as (3) stays a TeX symbol
  else{
    if(typeof raw!=='string'||!SYMBOLIC.test(raw))bad('SOLID_FACE_LABEL_INVALID:'+code);
    tex=raw;
    const n=labelNumber(tex);
    if(n===null)numeric=false;
    else if(Math.abs(n-value)>1e-6*Math.max(1,Math.abs(value)))bad('SOLID_FACE_LABEL_VALUE_MISMATCH:'+code);
  }
  return {tex:numeric&&unit?tex+'\\,\\mathrm{'+unit+'}^2':tex,text:tex,numeric,value:r6(value),...(symbol?{symbol:true}:{})};
}
/**
 * net.faceLabels:[{face,text?}] writes one label in the middle of each listed net face: the face's area, exactly (text omitted), a number that must equal
 * the area, or a symbol such as S or 2\\pi r h. `areas` maps a face id to its area in plan units.
 */
function netFaceLabels(net,areas,unit){
  if(net.faceLabels===undefined)return [];
  const list=net.faceLabels;
  if(!Array.isArray(list)||list.length<1||list.length>areas.size)bad('SOLID_FACE_LABEL_INVALID');
  const seen=new Set(),out=[];
  list.forEach((entry,k)=>{
    onlyKeys(entry,['face','text'],'SOLID_FACE_LABEL_INVALID');
    if(typeof entry.face!=='string')bad('SOLID_FACE_LABEL_INVALID');
    if(!areas.has(entry.face))bad('SOLID_NET_FACE_UNKNOWN');
    if(seen.has(entry.face))bad('SOLID_FACE_LABEL_INVALID');
    seen.add(entry.face);
    out.push({face:entry.face,...areaLabel(entry.text,areas.get(entry.face),unit,'f'+(k+1))});
  });
  return out;
}
const NET_RIGHT_ANGLES_MAX=6;
/** net.rightAngles:[{face,corner}] marks the corner (an index in the face's cycle order) of a net face where the two edges are perpendicular. */
function netRightAngles(net,faces){
  if(net.rightAngles===undefined)return [];
  const list=net.rightAngles;
  if(!Array.isArray(list)||list.length<1||list.length>NET_RIGHT_ANGLES_MAX)bad('SOLID_NET_RIGHT_ANGLE_INVALID');
  const byId=new Map(faces.map(f=>[f.id,f])),seen=new Set(),out=[];
  for(const m of list){
    onlyKeys(m,['face','corner'],'SOLID_NET_RIGHT_ANGLE_INVALID');
    if(typeof m.face!=='string')bad('SOLID_NET_RIGHT_ANGLE_INVALID');
    if(!byId.has(m.face))bad('SOLID_NET_FACE_UNKNOWN');
    const f=byId.get(m.face),n=f.poly.length;
    if(!Number.isInteger(m.corner)||m.corner<0||m.corner>=n)bad('SOLID_NET_RIGHT_ANGLE_INVALID');
    const key=m.face+':'+m.corner;
    if(seen.has(key))bad('SOLID_NET_RIGHT_ANGLE_INVALID');
    seen.add(key);
    const cosAt=i=>{const V=f.poly[i],A=f.poly[(i+n-1)%n],B=f.poly[(i+1)%n],u=[A[0]-V[0],A[1]-V[1]],w=[B[0]-V[0],B[1]-V[1]];return (u[0]*w[0]+u[1]*w[1])/(Math.hypot(...u)*Math.hypot(...w));};
    // the message lists the corners of that face that are right angles (corner indices follow the face's cycle order)
    if(Math.abs(cosAt(m.corner))>1e-6)bad('SOLID_NET_RIGHT_ANGLE_NOT_RIGHT:'+m.face+':'+m.corner+':right_at='+[...Array(n).keys()].filter(i=>Math.abs(cosAt(i))<=1e-6).join(','));
    out.push({face:m.face,corner:m.corner});
  }
  return out;
}
/** net.excluded:["bottom","top"] (a cylinder net) or ["base"] (a cone net): circles that are not part of the surface are drawn dashed and grey. */
function netExcluded(net,parts){
  if(net.excluded===undefined)return [];
  const list=net.excluded;
  if(!Array.isArray(list)||list.length<1||list.length>parts.length||list.some(x=>typeof x!=='string'||!parts.includes(x))||new Set(list).size!==list.length)bad('SOLID_NET_EXCLUDED_INVALID');
  return parts.filter(x=>list.includes(x));
}
const polygonArea=poly=>Math.abs(polygonArea2(poly));
function solveNet(plan){
  const net=plan.net;
  if(plan.dims!==undefined||plan.highlights!==undefined||plan.segments!==undefined||plan.section!==undefined)bad('SOLID_PLAN_INVALID');
  onlyKeys(net,['solid','root','joins','corners','dims','highlights','segments','kind','radius','height','slant','faceLabels','rightAngles','excluded','edgeLabels'],'SOLID_NET_INVALID');
  const unit=plan.unit??null;
  if(net.kind==='CYLINDER'||net.kind==='CONE'){
    if(net.highlights!==undefined||net.segments!==undefined)bad('SOLID_NET_EMPHASIS_UNSUPPORTED:'+net.kind);
    if(net.edgeLabels!==undefined)bad('SOLID_EDGE_LABEL_UNSUPPORTED:'+net.kind);
    if(net.rightAngles!==undefined)bad('SOLID_NET_RIGHT_ANGLE_UNSUPPORTED:'+net.kind);
    const r=pos(net.radius,'SOLID_PARAM_INVALID');
    const dims=[];
    if(net.kind==='CYLINDER'){
      const h=pos(net.height,'SOLID_PARAM_INVALID'),W=2*Math.PI*r;
      const shapes={rect:{x:0,y:0,w:r6(W),h},bottom:{cx:r6(W/2),cy:r6(-r),r},top:{cx:r6(W/2),cy:r6(h+r),r}};
      for(const [k,d] of (net.dims??[]).entries()){
        onlyKeys(d,['part','label'],'SOLID_DIMS_INVALID');
        const code='d'+(k+1);
        const spec={'rect-width':W,'rect-height':h,'radius-top':r,'radius-bottom':r}[d.part];
        if(spec===undefined)bad('SOLID_DIMS_INVALID');
        dims.push({id:'dim-'+(k+1),type:'NETPART',part:d.part,...dimLabel(d.label,spec,unit,code)});
      }
      const faceLabels=netFaceLabels(net,new Map([['rect',W*h],['bottom',Math.PI*r*r],['top',Math.PI*r*r]]),unit),excluded=netExcluded(net,['bottom','top']);
      return {schemaVersion:SOLID_MODEL_VERSION,mode:'NET',unit,netKind:'CYLINDER',radius:r,height:h,shapes,dims,...(faceLabels.length?{faceLabels}:{}),...(excluded.length?{excluded}:{})};
    }
    const l=net.slant!==undefined?pos(net.slant,'SOLID_PARAM_INVALID'):Math.hypot(r,pos(net.height,'SOLID_PARAM_INVALID'));
    if(!(l>r))bad('SOLID_CONE_SLANT_TOO_SHORT');
    const theta=360*r/l;
    const shapes={sector:{radius:l,angleDeg:r6(theta)},base:{cx:0,cy:r6(-(l+r)),r}};
    for(const [k,d] of (net.dims??[]).entries()){
      onlyKeys(d,['part','label'],'SOLID_DIMS_INVALID');
      const code='d'+(k+1);
      const value={slant:l,arc:2*Math.PI*r,radius:r,angle:theta}[d.part];
      if(value===undefined)bad('SOLID_DIMS_INVALID');
      dims.push({id:'dim-'+(k+1),type:'NETPART',part:d.part,...dimLabel(d.label,value,unit,code,{angle:d.part==='angle'})});
    }
    const faceLabels=netFaceLabels(net,new Map([['sector',Math.PI*r*l],['base',Math.PI*r*r]]),unit),excluded=netExcluded(net,['base']);
    return {schemaVersion:SOLID_MODEL_VERSION,mode:'NET',unit,netKind:'CONE',radius:r,slant:r6(l),shapes,dims,...(faceLabels.length?{faceLabels}:{}),...(excluded.length?{excluded}:{})};
  }
  if(net.kind!==undefined)bad('SOLID_NET_UNSUPPORTED:'+String(net.kind).slice(0,24));
  if(!isPlain(net.solid)||!POLY_KINDS.includes(net.solid.kind))bad('SOLID_NET_INVALID');
  if(net.solid.kind==='REGULAR_POLYHEDRON'||net.solid.kind==='BIPYRAMID')bad('SOLID_NET_UNSUPPORTED:'+net.solid.kind);
  if(net.solid.cuts!==undefined)bad('SOLID_NET_UNSUPPORTED:CUT');
  const solid=buildPolyhedron({...net.solid,id:'s1'});
  const faceById=new Map(solid.faces.map(f=>[f.id,f]));
  if(typeof net.root!=='string'||!faceById.has(net.root))bad('SOLID_NET_FACE_UNKNOWN');
  if(!Array.isArray(net.joins)||net.joins.length!==solid.faces.length-1)bad('SOLID_NET_NOT_A_TREE');
  const shared=(fa,fb)=>{
    const common=fa.idx.filter(i=>fb.idx.includes(i));
    if(common.length!==2)return null;
    // the edge must be consecutive in both cycles; fa traverses it a->b, fb b->a
    const n=fa.idx.length;
    for(let k=0;k<n;k++){const a=fa.idx[k],b=fa.idx[(k+1)%n];if(common.includes(a)&&common.includes(b))return [a,b];}
    return null;
  };
  const placed=new Map();
  const flat=new Map(solid.faces.map(f=>[f.id,flatten(f.idx.map(i=>solid.vertices[i].p))]));
  placed.set(net.root,{poly:flat.get(net.root).map(p=>[...p]),parent:null});
  const pending=net.joins.map(j=>{if(!Array.isArray(j)||j.length!==2||!faceById.has(j[0])||!faceById.has(j[1]))bad('SOLID_NET_FACE_UNKNOWN');return j;});
  const joinsOut=[];
  let guard=0;
  while(pending.length&&guard++<20){
    const k=pending.findIndex(([p,c])=>placed.has(p)&&!placed.has(c));
    if(k<0)bad('SOLID_NET_NOT_A_TREE');
    const [pid,cid]=pending.splice(k,1)[0];
    const fp=faceById.get(pid),fc=faceById.get(cid),edge=shared(fp,fc);
    if(!edge)bad('SOLID_NET_FACES_NOT_ADJACENT:'+pid+','+cid);
    const [a,b]=edge,parentPoly=placed.get(pid).poly,pa=parentPoly[fp.idx.indexOf(a)],pb=parentPoly[fp.idx.indexOf(b)];
    const local=flat.get(cid),ca=local[fc.idx.indexOf(a)],cb=local[fc.idx.indexOf(b)];
    // the child traverses the shared edge b->a; map ca->pa, cb->pb by a rotation + translation
    const ang=Math.atan2(pb[1]-pa[1],pb[0]-pa[0])-Math.atan2(cb[1]-ca[1],cb[0]-ca[0]),c=Math.cos(ang),s=Math.sin(ang);
    const rc=rot(ca,c,s);
    const poly=local.map(q=>{const r=rot(q,c,s);return [r6(r[0]-rc[0]+pa[0]),r6(r[1]-rc[1]+pa[1])];});
    placed.set(cid,{poly,parent:pid});
    joinsOut.push({parent:pid,child:cid,edge:[a,b]});
  }
  if(pending.length||placed.size!==solid.faces.length)bad('SOLID_NET_NOT_A_TREE');
  const ids=[...placed.keys()];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)if(polyOverlap(placed.get(ids[i]).poly,placed.get(ids[j]).poly))bad('SOLID_NET_FACES_OVERLAP:'+ids[i]+','+ids[j]);
  // corner names
  const corners={};
  for(const f of solid.faces){
    const given=net.corners?.[f.id];
    if(given!==undefined){
      const list=typeof given==='string'?[...given]:given;
      if(!Array.isArray(list)||list.length!==f.idx.length||list.some(x=>x!==null&&!NAME.test(String(x))))bad('SOLID_NAMES_INVALID');
      corners[f.id]=list;
    }else corners[f.id]=f.idx.map(i=>solid.vertices[i].name);
  }
  if(net.corners)for(const key of Object.keys(net.corners))if(!faceById.has(key))bad('SOLID_NET_FACE_UNKNOWN');
  const dims=[];
  for(const [k,d] of (net.dims??[]).entries()){
    onlyKeys(d,['face','edge','label'],'SOLID_DIMS_INVALID');
    if(!faceById.has(d.face)||!Number.isInteger(d.edge)||d.edge<0||d.edge>=faceById.get(d.face).idx.length)bad('SOLID_DIMS_INVALID');
    const f=faceById.get(d.face),a=f.idx[d.edge],b=f.idx[(d.edge+1)%f.idx.length];
    const value=len(sub(solid.vertices[a].p,solid.vertices[b].p));
    dims.push({id:'dim-'+(k+1),type:'NETEDGE',face:d.face,edge:d.edge,...dimLabel(d.label,value,unit,'d'+(k+1))});
  }
  // net.edgeLabels:[{face,edge,text?}] write at an edge of a face like dims do (text omitted: the exact length; a TeX text: a number that must equal the length or a symbol),
  // or a word (Hangul, up to 12 characters: "밑변") that only names the edge
  if(net.edgeLabels!==undefined){
    const list=net.edgeLabels;
    if(!Array.isArray(list)||list.length<1||list.length>10)bad('SOLID_EDGE_LABEL_INVALID');
    for(const [k,e] of list.entries()){
      onlyKeys(e,['face','edge','text'],'SOLID_EDGE_LABEL_INVALID');
      if(typeof e.face!=='string'||!faceById.has(e.face))bad(typeof e.face==='string'?'SOLID_NET_FACE_UNKNOWN':'SOLID_EDGE_LABEL_INVALID');
      if(!Number.isInteger(e.edge)||e.edge<0||e.edge>=faceById.get(e.face).idx.length)bad('SOLID_EDGE_LABEL_INVALID');
      const f=faceById.get(e.face),a=f.idx[e.edge],b=f.idx[(e.edge+1)%f.idx.length];
      const value=len(sub(solid.vertices[a].p,solid.vertices[b].p)),id='dim-'+(dims.length+1);
      if(typeof e.text==='string'&&WORD_LABEL.test(e.text)){
        if(!textLabelOk(e.text))bad('SOLID_EDGE_LABEL_INVALID');
        dims.push({id,type:'NETEDGE',face:e.face,edge:e.edge,tex:e.text,text:e.text,numeric:false,value:r6(value),word:true});
      }else{
        if(e.text!==undefined&&typeof e.text!=='string')bad('SOLID_EDGE_LABEL_INVALID');
        dims.push({id,type:'NETEDGE',face:e.face,edge:e.edge,...dimLabel(e.text,value,unit,'e'+(k+1))});
      }
    }
  }
  const faces=solid.faces.map(f=>({id:f.id,idx:f.idx,poly:placed.get(f.id).poly,corners:corners[f.id]}));
  const {highlights,segments}=netEmphasis(net,faces);
  if(net.excluded!==undefined)bad('SOLID_NET_EXCLUDED_UNSUPPORTED:POLYHEDRON');
  const faceLabels=netFaceLabels(net,new Map(faces.map(f=>[f.id,polygonArea(f.poly)])),unit),rightAngles=netRightAngles(net,faces);
  return {schemaVersion:SOLID_MODEL_VERSION,mode:'NET',unit,netKind:'POLYHEDRON',solid:{kind:solid.kind,vertices:solid.vertices,faces:solid.faces},root:net.root,joins:joinsOut,
    faces,dims,...(highlights.length?{highlights}:{}),...(segments.length?{segments}:{}),...(faceLabels.length?{faceLabels}:{}),...(rightAngles.length?{rightAngles}:{})};
}

// --- layout and spec ----------------------------------------------------------------------------------------------------------------------------
const WIDTH=480,MARGIN_X=62,MARGIN_Y=50,SAFE=10,MAX_FIG_H=300,MAX_SCALE=70;
// A solid panel of a composite grid (composite-panels-v1 with two columns) is narrower: two of them plus the 8 unit gap stay at 776 SVG units (the narrowest plane canvas pair: a Korean caption row still fits 44 units at the measured base font),
// the width the Archive solution column keeps its 11 CSS px label floor at. The composite sets it (plan.panelWidth); an author never writes it.
export const GRID_PANEL_WIDTH=384;
const GRID_MARGIN_X=40;
function figureExtent(model){
  const pts=[];
  if(model.mode==='SOLIDS'){for(const solid of model.solids)pts.push(...solidScreenPoints(solid));}
  else if(model.netKind==='POLYHEDRON'){for(const f of model.faces)pts.push(...f.poly);}
  else if(model.netKind==='CYLINDER'){const s=model.shapes;pts.push([s.rect.x,s.rect.y],[s.rect.x+s.rect.w,s.rect.y+s.rect.h],[s.bottom.cx-s.bottom.r,s.bottom.cy-s.bottom.r],[s.bottom.cx+s.bottom.r,s.bottom.cy+s.bottom.r],[s.top.cx-s.top.r,s.top.cy-s.top.r],[s.top.cx+s.top.r,s.top.cy+s.top.r]);}
  else{
    const {sector,base}=model.shapes,half=sector.angleDeg/2*Math.PI/180;
    pts.push([0,0]);
    for(let k=0;k<=24;k++){const a=-Math.PI/2-half+2*half*k/24;pts.push([sector.radius*Math.cos(a),sector.radius*Math.sin(a)]);}
    pts.push([base.cx-base.r,base.cy-base.r],[base.cx+base.r,base.cy+base.r]);
  }
  return {x0:Math.min(...pts.map(p=>p[0])),x1:Math.max(...pts.map(p=>p[0])),y0:Math.min(...pts.map(p=>p[1])),y1:Math.max(...pts.map(p=>p[1]))};
}
/** Scale, origin and size of the panel; known from the model alone (the Archive policy is measured before anything is composed). */
export function figureFrame(model){
  const e=figureExtent(model),bw=e.x1-e.x0,bh=e.y1-e.y0;
  const grid=model.panelWidth!==undefined,W=grid?model.panelWidth:WIDTH,MX=grid?GRID_MARGIN_X:MARGIN_X;
  const scale=r6(Math.min((W-2*MX)/bw,MAX_FIG_H/bh,MAX_SCALE));
  const height=Math.ceil(bh*scale+2*MARGIN_Y);
  return {scale,width:W,height,origin:[r6(W/2-scale*(e.x0+e.x1)/2),r6(height/2+scale*(e.y0+e.y1)/2)],extent:e};
}
export const figurePanelSize=model=>{const f=figureFrame(model);return {width:f.width,height:f.height};};

const ELL_SAMPLES=36;
/**
 * The figure before typesetting: every primitive in px with its role, then the label requests (anchor, preferred direction). Deterministic.
 * Primitives: {t:'line'|'arc'|'circle'|'poly'|'path',...}.
 */
export function solidFigureSpec(plan,model){
  if(plan?.capability!==SOLID_CAPABILITY)bad('SOLID_PLAN_INVALID');
  if(objectSha(solveSolidFigure(plan))!==objectSha(model))bad('SOLID_MODEL_MISMATCH');
  const frame=figureFrame(model),S=frame.scale,[OX,OY]=frame.origin;
  const X=u=>r6(OX+S*u),Y=v=>r6(OY-S*v),pt=q=>[X(q[0]),Y(q[1])];
  const prims=[],labels=[];
  const line=(id,role,a,b,extra={})=>{prims.push({t:'line',id,role,x1:a[0],y1:a[1],x2:b[0],y2:b[1],...extra});};
  if(model.mode==='SOLIDS')spec3d(plan,model,{S,X,Y,pt,prims,labels,line,frame});
  else specNet(plan,model,{S,X,Y,pt,prims,labels,line,frame});
  return {schemaVersion:SOLID_SPEC_VERSION,size:{width:frame.width,height:frame.height},frame:{scale:S,origin:frame.origin},prims,labels};
}
function ellipseOf(S,solid,rad,z){
  const c=project([0,0,z]);// the solid's axis is shifted along the screen horizontal by its offset
  return {cx:c[0]+(solid.offset??0),cy:c[1],a:rad,b:rad*sP};
}
const heightDimX=(solid,X)=>r6(Math.max(SAFE+2,Math.min(...solid.vertices.map(v=>X(project(v.p)[0])))-26));
function spec3d(plan,model,ctx){
  const {S,X,Y,pt,prims,labels,line}=ctx;
  const named=pointTable(model.solids);
  const arcPrim=(id,role,e,u0,u1,vis,attrs={})=>prims.push({t:'arc',id,role,cx:X(e.cx),cy:Y(e.cy),rx:r6(S*e.a),ry:r6(S*e.b),u0:r6(u0),u1:r6(u1),vis,...attrs});
  const outline=[];// polylines for label obstacles are derived from prims later
  const fillFirst=[];
  for(const h of model.highlights){
    if(h.face!==undefined){
      const owner=model.solids.find(x=>x.id===h.solid),face=owner.faces.find(f=>f.id===h.face);
      fillFirst.push({t:'poly',id:`highlight-${h.solid}-${h.face}`,role:'highlight-face',solid:h.solid,face:h.face,fill:h.fill??'LIGHT',points:face.idx.map(i=>pt(project(owner.vertices[i].p)))});
    }else fillFirst.push({t:'poly',id:'highlight-'+joinKeys(h.polygon),role:'highlight-face',points:h.polygon.map(n=>pt(project(named.get(n)))),polygon:joinKeys(h.polygon),fill:h.fill??'LIGHT'});
  }
  prims.push(...fillFirst);
  void outline;
  for(const solid of model.solids){
    const sid=solid.id;
    if(solid.category==='POLY'){
      for(const {a,b,runs} of solid.runs){
        const va=solid.vertices[a],vb=solid.vertices[b];
        const nm=(v,i)=>v.name??('v'+i);
        runs.forEach((run,k)=>{
          const p0=pt(project(lerp(va.p,vb.p,run.t0))),p1=pt(project(lerp(va.p,vb.p,run.t1)));
          if(Math.hypot(p1[0]-p0[0],p1[1]-p0[1])<0.4)return;
          line(`${sid}-edge-${nm(va,a)}${nm(vb,b)}-${k+1}`,'edge',p0,p1,{solid:sid,edge:nm(va,a)+nm(vb,b),vis:run.hidden?'hidden':'solid',t0:run.t0,t1:run.t1});
        });
      }
    }else if(solid.category==='REV')specRev(solid,ctx,arcPrim);
    else if(solid.cut)specCutSphere(solid,ctx,arcPrim);
    else specSphere(solid,ctx,arcPrim);
  }
  for(const [k,s] of model.segments.entries()){
    const a=pt(project(named.get(s.from))),b=pt(project(named.get(s.to)));
    line(`segment-${joinKeys([s.from,s.to])}`,'segment',a,b,{edge:joinKeys([s.from,s.to]),vis:s.style==='AUTO'?(s.hidden?'hidden':'solid'):s.style==='DASHED'?'hidden':'solid',accent:s.role,style:s.style});
    void k;
  }
  // the axis of a rotation solid: a dash-dot line a little longer than the solid
  for(const solid of model.solids)if(solid.axis){
    const [a,b]=axisEnds(solid);
    line(solid.id+'-axis','axis-line',pt(a),pt(b),{solid:solid.id});
  }
  // marks: a right angle is a small square in the plane of its two (truly perpendicular) edges, projected; an angle is an arc in its own plane.
  for(const m of model.marks.rightAngles){
    const V=named.get(m.at),A=named.get(m.refs[0]),B=named.get(m.refs[1]);
    const e1=unit(sub(A,V)),e2=unit(sub(B,V)),pV=project(V),q1=project(add(V,e1)),q2=project(add(V,e2));
    const l1=Math.hypot(q1[0]-pV[0],q1[1]-pV[1]),l2=Math.hypot(q2[0]-pV[0],q2[1]-pV[1]);
    if(l1<1e-9||l2<1e-9)bad('SOLID_MARK_ANGLE_DEGENERATE:'+m.id);
    const kWorld=Math.min(0.4*Math.min(len(sub(A,V)),len(sub(B,V))),20/(S*Math.max(l1,l2)));
    if(kWorld*S*Math.min(l1,l2)<3)bad('SOLID_MARK_ANGLE_DEGENERATE:'+m.id);
    const pts=[add(V,mulv(e1,kWorld)),add(V,mulv(add(e1,e2),kWorld)),add(V,mulv(e2,kWorld))].map(q=>pt(project(q)));
    prims.push({t:'polyline',id:m.id,role:'right-angle-mark',points:pts,mark:m.id,at:m.at,refs:joinKeys(m.refs)});
  }
  for(const g of model.marks.equalLengths){
    for(const [a,b] of g.segments){
      const pa=pt(project(named.get(a))),pb=pt(project(named.get(b)));
      const dx=pb[0]-pa[0],dy=pb[1]-pa[1],l=Math.hypot(dx,dy);
      if(l<1e-9)continue;
      const ux=dx/l,uy=dy/l,nx=-uy,ny=ux,mx=(pa[0]+pb[0])/2,my=(pa[1]+pb[1])/2;
      for(let i=0;i<g.count;i++){
        const shift=(i-(g.count-1)/2)*5,c=[mx+ux*shift,my+uy*shift];
        line(`${g.id}-${joinKeys([a,b])}-${i+1}`,'equal-mark',[c[0]-nx*5.5,c[1]-ny*5.5],[c[0]+nx*5.5,c[1]+ny*5.5],{mark:g.id,markEdge:joinKeys([a,b]),markIndex:i+1,markCount:g.count});
      }
    }
  }
  // equal slants: the same ticks on the left and the right silhouette line of the cone (found among the drawn lines, so the ticks sit on what is drawn)
  for(const g of model.marks.equalSlant??[]){
    for(const side of ['LEFT','RIGHT']){
      const sil=prims.find(p=>p.t==='line'&&p.role==='silhouette'&&p.solid===g.solid&&p.side===side);
      const dx=sil.x2-sil.x1,dy=sil.y2-sil.y1,l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux,mx=(sil.x1+sil.x2)/2,my=(sil.y1+sil.y2)/2;
      for(let i=0;i<g.count;i++){
        const shift=(i-(g.count-1)/2)*5,c=[mx+ux*shift,my+uy*shift];
        line(`${g.id}-${g.solid}-${side.toLowerCase()}-${i+1}`,'slant-mark',[r6(c[0]-nx*5.5),r6(c[1]-ny*5.5)],[r6(c[0]+nx*5.5),r6(c[1]+ny*5.5)],{solid:g.solid,side,mark:g.id,markIndex:i+1,markCount:g.count});
      }
    }
  }
  for(const m of model.marks.angles){
    const [a,vid,b]=m.refs,V=named.get(vid),A=named.get(a),B=named.get(b);
    const e1=unit(sub(A,V)),e2=unit(sub(B,V));
    const c=Math.max(-1,Math.min(1,dot(e1,e2))),theta=Math.acos(c),w=unit(sub(e2,mulv(e1,c)));
    const p1=project(add(V,e1)),p2=project(add(V,e2)),pv=project(V);
    const l1=Math.hypot(p1[0]-pv[0],p1[1]-pv[1]),l2=Math.hypot(p2[0]-pv[0],p2[1]-pv[1]);
    if(len(w)<1e-9||l1<1e-9||l2<1e-9)bad('SOLID_MARK_ANGLE_DEGENERATE:'+m.id);
    for(let ring=0;ring<m.arcs;ring++){
      const wantPx=20+5*ring;
      const kWorld=Math.min(0.36*Math.min(len(sub(A,V)),len(sub(B,V))),wantPx/(S*Math.max(l1,l2)));
      if(kWorld*S*Math.min(l1,l2)<3)bad('SOLID_MARK_ANGLE_DEGENERATE:'+m.id);
      const pts=[];
      for(let k=0;k<=24;k++){const t=theta*k/24;pts.push(pt(project(add(V,mulv(add(mulv(e1,Math.cos(t)),mulv(w,Math.sin(t))),kWorld)))));}
      prims.push({t:'polyline',id:m.id+'-arc-'+(ring+1),role:'angle-mark',points:pts,mark:m.id,refs:joinKeys(m.refs),index:ring+1,count:m.arcs});
    }
  }
  if(model.section?.kind==='AXIAL'){
    const solid=model.solids.find(s=>s.id===model.section.solid);
    const pts=sectionPolygon(solid);
    prims.push({t:'poly',id:'section-'+solid.id,role:'section',solid:solid.id,points:pts.map(q=>pt(project(q))),polygon:'axial'});
  }else if(model.section?.kind==='LEVEL'){
    const solid=model.solids.find(s=>s.id===model.section.solid),e=ellipseOf(S,solid,model.section.r,model.section.z);
    if(model.section.fill)prims.push({t:'poly',id:'body-'+solid.id,role:'body-fill',solid:solid.id,side:model.section.fill,points:bodyHull(solid,model.section).map(pt)});
    prims.push({t:'ellipse',id:'level-'+solid.id,role:'level-fill',solid:solid.id,cx:X(e.cx),cy:Y(e.cy),rx:r6(S*e.a),ry:r6(S*e.b)});
    if(solid.orientation==='APEX_DOWN'){
      // The liquid fills the similar (smaller) vessel below the level: its projected outline is shaded and its two inner sides are drawn, so the
      // smaller cone/frustum inside the vessel is visible.
      const liquid=liquidRegion(S,solid,model.section.z,model.section.r);
      prims.push({t:'poly',id:solid.id+'-liquid',role:'liquid-region',solid:solid.id,points:liquid.points.map(pt)});
      for(const [k,[a,b]] of liquid.sides.entries())line(solid.id+'-liquid-side-'+(k+1),'liquid-edge',pt(a),pt(b),{solid:solid.id,liquid:1});
    }
    arcPrim(solid.id+'-level-back','ellipse-arc',e,0,Math.PI,'solid',{solid:solid.id,circle:'level',half:'BACK'});
    arcPrim(solid.id+'-level-front','ellipse-arc',e,Math.PI,2*Math.PI,'solid',{solid:solid.id,circle:'level',half:'FRONT'});
  }
  // dimension lines (radius, height) are drawn; segment dims label an existing segment
  for(const d of model.dims){
    if(d.type==='RADIUS'){
      const solid=model.solids.find(s=>s.id===d.solid);
      if(solid.cut){
        const scr=cutScreen(solid,pt),tip=CUT_AXES[d.axis.axis].map(v=>v*d.axis.sign*solid.radius);
        line(d.id+'-line','dim-line',scr([0,0,0]),scr(tip),{solid:solid.id,dim:d.id,kind:'RADIUS',vis:'solid'});
        continue;
      }
      const c=project([solid.offset?EX[0]*solid.offset:0,solid.offset?EX[1]*solid.offset:0,d.z]);
      const rim=[c[0]+d.r,c[1]];// screen-horizontal radius: ends at the ellipse's right extreme
      line(d.id+'-line','dim-line',pt(c),pt(rim),{solid:solid.id,dim:d.id,kind:'RADIUS',vis:'solid'});
    }else if(d.type==='HEIGHT'){
      const solid=model.solids.find(s=>s.id===d.solid);
      if(solid.category==='POLY'){
        // A pyramid/frustum is narrow at mid-height: keep the dashed height axis inside, draw the dimension line outside the silhouette
        // (with extension lines to the apex and the base-centre level) so the length never has to sit between two edges.
        const top=pt(project(d.top)),foot=pt(project(d.foot));
        line(d.id+'-axis','height-axis',foot,top,{solid:solid.id,dim:d.id,kind:'HEIGHT',vis:'hidden'});
        const x=heightDimX(solid,X);
        line(d.id+'-line','dim-line',[x,foot[1]],[x,top[1]],{solid:solid.id,dim:d.id,kind:'HEIGHT',vis:'solid'});
        line(d.id+'-ext-top','dim-ext',[x,top[1]],top,{solid:solid.id,dim:d.id,kind:'HEIGHT',vis:'solid'});
        line(d.id+'-ext-bottom','dim-ext',[x,foot[1]],foot,{solid:solid.id,dim:d.id,kind:'HEIGHT',vis:'solid'});
      }
      else{
        const bottom=solid.kind==='HEMISPHERE'?[0,0,0]:[0,0,0],top=[0,0,solid.height];
        const sh=mulv(EX,solid.offset??0);
        line(d.id+'-line','dim-line',pt(project(add(bottom,sh))),pt(project(add(top,sh))),{solid:solid.id,dim:d.id,kind:'HEIGHT',vis:'hidden'});
      }
    }else if(d.type==='LEVEL'){
      const solid=model.solids.find(s=>s.id===d.solid),sh=mulv(EX,solid.offset??0);
      const [z0,z1]=d.side==='TOP'?[model.section.z,solid.height]:[0,model.section.z];
      line(d.id+'-line','dim-line',pt(project(add([0,0,z0],sh))),pt(project(add([0,0,z1],sh))),{solid:solid.id,dim:d.id,kind:'LEVEL',vis:'hidden'});
    }else if(d.type==='SLANT'){
      const solid=model.solids.find(s=>s.id===d.solid);
      void solid;
    }
  }
  // label requests
  const centroidScreen=(()=>{const pts=model.solids.flatMap(solidScreenPoints);return [pts.reduce((s,p)=>s+p[0],0)/pts.length,pts.reduce((s,p)=>s+p[1],0)/pts.length];})();
  const vertexSpot=new Map();// key of a vertex or named point -> {here,dir}: where a word written on it stands (open side of the corner)
  for(const solid of model.solids){
    if(solid.category==='POLY'){
      // the open side of a vertex: away from the edges that meet there
      const outward=(i)=>{
        const here=project(solid.vertices[i].p);let dir=[0,0];
        for(const [a,b] of solid.edges){
          const other=a===i?b:b===i?a:-1;if(other<0)continue;
          const q=project(solid.vertices[other].p),d=[q[0]-here[0],q[1]-here[1]],l=Math.hypot(d[0],d[1]);
          if(l>1e-9){dir[0]-=d[0]/l;dir[1]-=d[1]/l;}
        }
        let l=Math.hypot(dir[0],dir[1]);
        if(l<0.35){dir=[here[0]-centroidScreen[0],here[1]-centroidScreen[1]];l=Math.hypot(dir[0],dir[1])||1;}
        return {here,dir:[r6(dir[0]/l),r6(dir[1]/l)]};
      };
      solid.vertices.forEach((v,i)=>{
        for(const key of vertexKeys(solid,i))vertexSpot.set(key,()=>outward(i));
        if(!v.name)return;
        const {here,dir}=outward(i);
        const text=v.aliases?v.aliases.join(','):v.name;
        labels.push({id:'name-'+v.name,role:'vertex-name',owner:'vertex-'+v.name,kind:'MATH',tex:text,plain:text,value:text,anchor:pt(here),dir});
      });
      if(solid.count?.vertices){
        const spots=solid.vertices.map(v=>pt(project(v.p)));
        solid.vertices.forEach((v,i)=>{
          const {here,dir}=outward(i),n=String(i+1);
          labels.push({id:`count-v-${solid.id}-${n}`,role:'count-vertex',owner:`count-vertex-${solid.id}-${n}`,kind:'MATH',tex:n,plain:n,value:n,countKind:'vertex',countN:i+1,solid:solid.id,anchor:pt(here),dir,near:{own:spots[i],others:spots.filter((q,j)=>j!==i),margin:COUNT_MARGIN}});
        });
      }
      if(solid.count?.edges){
        const list=countedEdges(solid);
        const ends=list.map(([a,b])=>[pt(project(solid.vertices[a].p)),pt(project(solid.vertices[b].p))]);
        const mids=ends.map(([a,b])=>[r6((a[0]+b[0])/2),r6((a[1]+b[1])/2)]);
        list.forEach((e,k)=>{
          const n=String(k+1),text=circled(k+1);
          labels.push({id:`count-e-${solid.id}-${n}`,role:'count-edge',owner:`count-edge-${solid.id}-${n}`,kind:'TEXT',text,plain:text,value:n,countKind:'edge',countN:k+1,solid:solid.id,segment:ends[k],near:{own:mids[k],others:mids.filter((q,j)=>j!==k),margin:COUNT_MARGIN}});
        });
      }
    }else{
      for(const q of solid.points){
        if(!q.name)continue;
        const here=project(q.p),up=q.p[2]>solid.height/2;
        let dir=up?[0,1]:[0,-1];
        if(solid.cut){
          // the centre of a cut sphere is a corner: its name sits away from the radii (creases) that meet there
          const scr=cutScreen(solid,pt),o=scr([0,0,0]);let sum=[0,0];
          for(const crease of solid.cut.creases){const t=scr(CUT_AXES[crease.axis].map(v=>v*crease.sign*solid.radius)),l=Math.hypot(t[0]-o[0],t[1]-o[1]);sum=[sum[0]+(t[0]-o[0])/l,sum[1]+(t[1]-o[1])/l];}
          const l=Math.hypot(sum[0],sum[1]);
          if(l>0.35)dir=[r6(-sum[0]/l),r6(sum[1]/l)];// screen y points down in the figure, up in the label request
        }
        labels.push({id:'name-'+q.name,role:'vertex-name',owner:'point-'+q.name,kind:'MATH',tex:q.name,plain:q.name,value:q.name,anchor:pt(here),dir});
        vertexSpot.set(q.name,()=>({here,dir}));
      }
    }
  }
  for(const d of model.dims){
    const label={id:d.id+'-label',role:'dim',owner:d.id,kind:'MATH',tex:d.tex,plain:d.text,value:String(d.value),numeric:d.numeric,dim:d.id};
    if(d.type==='SEGMENT'){
      const a=pt(project(named.get(d.from))),b=pt(project(named.get(d.to)));
      labels.push({...label,segment:[a,b],segmentOf:joinKeys([d.from,d.to])});
    }else if(d.type==='RADIUS'){
      const solid=model.solids.find(s=>s.id===d.solid);
      if(solid.cut){
        const scr=cutScreen(solid,pt);
        labels.push({...label,segment:[scr([0,0,0]),scr(CUT_AXES[d.axis.axis].map(v=>v*d.axis.sign*solid.radius))],segmentOf:'radius'});
        continue;
      }
      const c=project([EX[0]*(solid.offset??0),EX[1]*(solid.offset??0),d.z]);
      labels.push({...label,segment:[pt(c),pt([c[0]+d.r,c[1]])],segmentOf:'radius'});
    }else if(d.type==='HEIGHT'){
      const solid=model.solids.find(s=>s.id===d.solid);
      if(solid.category==='POLY'){const top=pt(project(d.top)),foot=pt(project(d.foot)),x=heightDimX(solid,X);labels.push({...label,segment:[[x,foot[1]],[x,top[1]]],segmentOf:'height'});}
      else{const sh=mulv(EX,solid.offset??0);labels.push({...label,segment:[pt(project(add([0,0,0],sh))),pt(project(add([0,0,solid.height],sh)))],segmentOf:'height'});}
    }else if(d.type==='LEVEL'){
      const solid=model.solids.find(s=>s.id===d.solid),sh=mulv(EX,solid.offset??0);
      const [z0,z1]=d.side==='TOP'?[model.section.z,solid.height]:[0,model.section.z];
      labels.push({...label,segment:[pt(project(add([0,0,z0],sh))),pt(project(add([0,0,z1],sh)))],segmentOf:'level'});
    }else if(d.type==='SLANT'){
      const solid=model.solids.find(s=>s.id===d.solid);
      const seg=slantSegment(S,solid);
      const p0=pt(seg[0]),p1=pt(seg[1]),cs=pt(centroidScreen),n=[-(p1[1]-p0[1]),p1[0]-p0[0]];
      const mid=[(p0[0]+p1[0])/2,(p0[1]+p1[1])/2],side=Math.sign(n[0]*(mid[0]-cs[0])+n[1]*(mid[1]-cs[1]))||1;
      labels.push({...label,segment:[p0,p1],segmentOf:'slant',preferredSide:side});
    }
  }
  // text labels: a word on a vertex (its open side), on the axis / an edge / a cone's slant (beside the segment, with a leader when there is no room) or inside a visible face
  for(const tl of model.labels??[]){
    const label={id:'text-'+tl.id,role:'text-label',owner:'text-'+tl.id,kind:'TEXT',text:tl.text,plain:tl.text,value:tl.text,textId:tl.id,atKind:tl.at.kind};
    const at=tl.at;
    if(at.kind==='VERTEX'){
      const {here,dir}=vertexSpot.get(at.key)();
      labels.push({...label,place:'VERTEX',target:at.key,anchor:pt(here),dir});
    }else if(at.kind==='FACE'){
      const solid=model.solids.find(s=>s.id===at.solid),face=solid.faces.find(f=>f.id===at.face);
      labels.push({...label,place:'FACE',target:at.solid+'|'+at.face,region:face.idx.map(i=>pt(project(solid.vertices[i].p)))});
    }else if(at.kind==='EDGE'){
      const a=pt(project(named.get(at.from))),b=pt(project(named.get(at.to)));
      labels.push({...label,place:'SEGMENT',target:joinKeys([at.from,at.to]),segment:[a,b]});
    }else if(at.kind==='AXIS'){
      const solid=model.solids.find(s=>s.id===at.solid),[a,b]=axisEnds(solid);
      labels.push({...label,place:'SEGMENT',target:at.solid,segment:[pt(a),pt(b)]});
    }else{
      const solid=model.solids.find(s=>s.id===at.solid),seg=slantSegment(S,solid),p0=pt(seg[0]),p1=pt(seg[1]),cs=pt(centroidScreen),n=[-(p1[1]-p0[1]),p1[0]-p0[0]];
      const mid=[(p0[0]+p1[0])/2,(p0[1]+p1[1])/2],side=Math.sign(n[0]*(mid[0]-cs[0])+n[1]*(mid[1]-cs[1]))||1;
      labels.push({...label,place:'SEGMENT',target:at.solid,segment:[p0,p1],preferredSide:side});
    }
  }
}
/** The two ends (screen units, y up) of the drawn axis of a rotation solid: the solid's own axis, a little beyond its bottom and its top. */
function axisEnds(solid){
  const ext=AXIS_EXTENSION*solid.height,sh=mulv(EX,solid.offset??0);
  return [project(add([0,0,-ext],sh)),project(add([0,0,solid.height+ext],sh))];
}
/** The slant (generator) of a cone or cone frustum on its right-hand silhouette, in screen units (the same segment the slant length is written beside). */
function slantSegment(S,solid){
  const apex=apexOf(solid);
  if(solid.kind==='CONE'){const rim=ellipseOf(S,solid,solid.r0===0?solid.r1:solid.r0,solid.r0===0?solid.height:0);return [apex,tangentPoints(rim,apex)[1]];}
  return [tangentPoints(ellipseOf(S,solid,solid.r0,0),apex)[1],tangentPoints(ellipseOf(S,solid,solid.r1,solid.height),apex)[1]];
}
/** Convex hull (counter-clockwise, monotone chain) of screen points. */
function convexHull(points){
  const pts=[...points].sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
  const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lower=[],upper=[];
  for(const p of pts){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}
  for(const p of [...pts].reverse()){while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}
  return [...lower.slice(0,-1),...upper.slice(0,-1)];
}
const BODY_SAMPLES=72;
/**
 * The projected outline (screen units) of the part of a solid of revolution on one side of its level plane: the convex hull of the two circles that bound it
 * (the base and the level circle below; the level circle and the top circle or the apex above), each circle sampled every 5 degrees.
 */
function bodyHull(solid,section){
  const ox=solid.offset??0,pts=[];
  const ring=(rad,z)=>{const c=project([0,0,z]);for(let k=0;k<BODY_SAMPLES;k++){const u=2*Math.PI*k/BODY_SAMPLES;pts.push([c[0]+ox+rad*Math.cos(u),c[1]+rad*sP*Math.sin(u)]);}};
  if(section.fill==='BOTTOM'){ring(solid.r0,0);ring(section.r,section.z);}
  else{
    ring(section.r,section.z);
    if(solid.r1>0)ring(solid.r1,solid.height);else{const c=project([0,0,solid.height]);pts.push([c[0]+ox,c[1]]);}
  }
  return convexHull(pts).map(q=>[r6(q[0]),r6(q[1])]);
}
function apexOf(solid){
  // the screen point of the (virtual) apex of a cone or cone frustum; an apex-down vessel has it on the base plane
  const z=solid.r1===solid.r0?0:-solid.r0*solid.height/(solid.r1-solid.r0);
  const c=project([0,0,z]);return [c[0]+(solid.offset??0),c[1]];
}
/** The two tangent points (left, right) from a point on the axis of an axis-aligned ellipse (sin u = b/d, d may be negative below). */
function tangentPoints(e,apex){
  const d=apex[1]-e.cy;
  if(Math.abs(d)<=e.b+1e-9)return [[e.cx-e.a,e.cy],[e.cx+e.a,e.cy]];
  const s=e.b/d,cu=Math.sqrt(Math.max(0,1-s*s));
  return [[e.cx-e.a*cu,e.cy+e.b*s],[e.cx+e.a*cu,e.cy+e.b*s]];
}
function sectionPolygon(solid){
  const sh=mulv(EX,solid.offset??0),r0=solid.r0,r1=solid.r1,h=solid.height;
  const p=(s,z)=>add([s*EX[0],s*EX[1],z],sh);
  if(r0===0)return [p(0,0),p(r1,h),p(-r1,h)];
  if(r1===0)return [p(-r0,0),p(r0,0),p(0,h)];
  return [p(-r0,0),p(r0,0),p(r1,h),p(-r1,h)];
}
const LIQUID_SAMPLES=28;
/** Tangent parameters and points (screen units) from a point on the axis of an axis-aligned ellipse. */
function tangentParams(e,apex){
  const d=apex[1]-e.cy;
  if(Math.abs(d)<=e.b+1e-9)bad('SOLID_SILHOUETTE_DEGENERATE');
  const sinU=e.b/d,cu=Math.sqrt(Math.max(0,1-sinU*sinU));
  const uR=Math.atan2(sinU,cu),uL=Math.atan2(sinU,-cu);
  const at=u=>[e.cx+e.a*Math.cos(u),e.cy+e.b*Math.sin(u)];
  return {uR,uL,right:at(uR),left:at(uL)};
}
/**
 * The projected outline of the liquid held by an apex-down vessel up to the level circle (z, rl): the convex hull of the vessel's bottom
 * (a point for a cone, the small circle of a frustum) and the level circle, i.e. the near arc of the bottom and the far arc of the level
 * joined by their common tangents. Returns the boundary points (screen units) and the two inner sides of the liquid body.
 */
function liquidRegion(S,solid,z,rl){
  const apex=apexOf(solid),e=ellipseOf(S,solid,rl,z),lv=tangentParams(e,apex);
  const at=(ell,u)=>[ell.cx+ell.a*Math.cos(u),ell.cy+ell.b*Math.sin(u)];
  const far=[];for(let k=0;k<=LIQUID_SAMPLES;k++)far.push(at(e,lv.uR+(lv.uL+2*Math.PI-lv.uR)*k/LIQUID_SAMPLES));
  if(solid.r0===0)return {points:[apex,...far],sides:[[apex,lv.right],[apex,lv.left]]};
  const e0=ellipseOf(S,solid,solid.r0,0),bv=tangentParams(e0,apex);
  const near=[];for(let k=0;k<=LIQUID_SAMPLES;k++)near.push(at(e0,bv.uL+2*Math.PI+(bv.uR-bv.uL)*k/LIQUID_SAMPLES));
  return {points:[...near,...far],sides:[[bv.right,lv.right],[lv.left,bv.left]]};
}
function specRev(solid,ctx,arcPrim){
  const {S,pt,prims,line}=ctx;
  const sid=solid.id,h=solid.height;
  const cone=solid.kind==='CONE'||solid.kind==='CONE_FRUSTUM';
  if(!cone){
    // cylinder: the base ellipse's back half hidden, the top ellipse whole; verticals at x = +-r
    const bot=ellipseOf(S,solid,solid.r0,0),top=ellipseOf(S,solid,solid.r1,h);
    arcPrim(sid+'-base-front','ellipse-arc',bot,Math.PI,2*Math.PI,'solid',{solid:sid,circle:'bottom',half:'FRONT'});
    arcPrim(sid+'-base-back','ellipse-arc',bot,0,Math.PI,'hidden',{solid:sid,circle:'bottom',half:'BACK'});
    arcPrim(sid+'-top-back','ellipse-arc',top,0,Math.PI,'solid',{solid:sid,circle:'top',half:'BACK'});
    arcPrim(sid+'-top-front','ellipse-arc',top,Math.PI,2*Math.PI,'solid',{solid:sid,circle:'top',half:'FRONT'});
    for(const sgn of [-1,1])line(`${sid}-side-${sgn<0?'left':'right'}`,'silhouette',pt([bot.cx+sgn*bot.a,bot.cy]),pt([top.cx+sgn*top.a,top.cy]),{solid:sid,side:sgn<0?'LEFT':'RIGHT',vis:'solid'});
    return;
  }
  const apex=apexOf(solid);
  // A cylinder's base is split at its horizontal extremes (front half visible, back half hidden); a cone/frustum base is split at the points where
  // the silhouette leaves it, so the visible run ends exactly at the tangent. A rim seen from above (a cylinder top, an apex-down opening) is whole.
  if(solid.r0>0){
    const bot=ellipseOf(S,solid,solid.r0,0);
    if(solid.r1>=solid.r0){
      // apex below (or a cylinder, where the split is at the extremes): the visible front run lies between the two tangencies
      if(solid.r1===solid.r0){
        arcPrim(sid+'-base-front','ellipse-arc',bot,Math.PI,2*Math.PI,'solid',{solid:sid,circle:'bottom',half:'FRONT'});
        arcPrim(sid+'-base-back','ellipse-arc',bot,0,Math.PI,'hidden',{solid:sid,circle:'bottom',half:'BACK'});
      }else{
        const tp=tangentParams(bot,apex);
        arcPrim(sid+'-base-front','ellipse-arc',bot,tp.uL+2*Math.PI,tp.uR+2*Math.PI,'solid',{solid:sid,circle:'bottom',half:'FRONT'});
        arcPrim(sid+'-base-back','ellipse-arc',bot,tp.uR+2*Math.PI,tp.uL+4*Math.PI,'hidden',{solid:sid,circle:'bottom',half:'BACK'});
      }
    }else{
      const tp=tangentParams(bot,apex);
      arcPrim(sid+'-base-front','ellipse-arc',bot,tp.uL,tp.uR+2*Math.PI,'solid',{solid:sid,circle:'bottom',half:'FRONT'});
      arcPrim(sid+'-base-back','ellipse-arc',bot,tp.uR,tp.uL,'hidden',{solid:sid,circle:'bottom',half:'BACK'});
    }
  }
  if(solid.r1>0){
    const top=ellipseOf(S,solid,solid.r1,h);
    arcPrim(sid+'-top-back','ellipse-arc',top,0,Math.PI,'solid',{solid:sid,circle:'top',half:'BACK'});
    arcPrim(sid+'-top-front','ellipse-arc',top,Math.PI,2*Math.PI,'solid',{solid:sid,circle:'top',half:'FRONT'});
  }
  if(solid.r0===0||solid.r1===0){
    const rim=ellipseOf(S,solid,solid.r0===0?solid.r1:solid.r0,solid.r0===0?h:0);
    const [bl,br]=tangentPoints(rim,apex);
    line(`${sid}-side-left`,'silhouette',pt(apex),pt(bl),{solid:sid,side:'LEFT',vis:'solid'});
    line(`${sid}-side-right`,'silhouette',pt(apex),pt(br),{solid:sid,side:'RIGHT',vis:'solid'});
  }else{
    const bot=ellipseOf(S,solid,solid.r0,0),top=ellipseOf(S,solid,solid.r1,h);
    const [bl,br]=tangentPoints(bot,apex),[tl,tr]=tangentPoints(top,apex);
    line(`${sid}-side-left`,'silhouette',pt(bl),pt(tl),{solid:sid,side:'LEFT',vis:'solid'});
    line(`${sid}-side-right`,'silhouette',pt(br),pt(tr),{solid:sid,side:'RIGHT',vis:'solid'});
  }
}
function specSphere(solid,ctx,arcPrim){
  const {S,X,Y,prims}=ctx;
  const sid=solid.id,r=solid.radius,sh=solid.offset??0;
  if(solid.kind==='SPHERE'){
    const c=project([0,0,r]),cx=c[0]+sh;
    const eq={cx,cy:c[1],a:r,b:r*sP};
    arcPrim(sid+'-outline-upper','sphere-outline',{cx,cy:c[1],a:r,b:r},0,Math.PI,'solid',{solid:sid,part:'UPPER'});
    arcPrim(sid+'-outline-lower','sphere-outline',{cx,cy:c[1],a:r,b:r},Math.PI,2*Math.PI,'solid',{solid:sid,part:'LOWER'});
    arcPrim(sid+'-equator-front','ellipse-arc',eq,Math.PI,2*Math.PI,'solid',{solid:sid,circle:'equator',half:'FRONT'});
    arcPrim(sid+'-equator-back','ellipse-arc',eq,0,Math.PI,'hidden',{solid:sid,circle:'equator',half:'BACK'});
  }else{
    const c=project([0,0,0]),cx=c[0]+sh;
    const base={cx,cy:c[1],a:r,b:r*sP};
    arcPrim(sid+'-outline-upper','sphere-outline',{cx,cy:c[1],a:r,b:r},0,Math.PI,'solid',{solid:sid,part:'UPPER'});
    arcPrim(sid+'-base-front','ellipse-arc',base,Math.PI,2*Math.PI,'solid',{solid:sid,circle:'bottom',half:'FRONT'});
    arcPrim(sid+'-base-back','ellipse-arc',base,0,Math.PI,'hidden',{solid:sid,circle:'bottom',half:'BACK'});
  }
  void X;void Y;void S;void prims;
}
/** World vector relative to the centre of a cut sphere -> px (the solid's own shift along the screen's horizontal included). */
function cutScreen(solid,pt){
  const c=project([0,0,solid.radius]),shift=solid.offset??0;
  return q=>{const p=project(q);return pt([c[0]+shift+p[0],c[1]+p[1]]);};
}
const CUT_FACE_STEPS=24,CUT_ARC_SAMPLES=16;
/** The projected ellipse of a circle through the screen vectors p1, p2 (screen units, y up) of two perpendicular radii, at scale S: SVG arc radii, tilt (deg) and sweep. */
function projectedEllipse(S,r,p1,p2){
  const a=S*r*p1[0],b=S*r*p2[0],c=-S*r*p1[1],d=-S*r*p2[1];// svg coordinates: y grows down
  const m11=a*a+b*b,m22=c*c+d*d,m12=a*c+b*d,tr=m11+m22,diff=m11-m22,root=Math.hypot(diff,2*m12);
  return {rx:r6(Math.sqrt((tr+root)/2)),ry:r6(Math.sqrt(Math.max(0,(tr-root)/2))),rot:r6(0.5*Math.atan2(2*m12,diff)*180/Math.PI),sweep:a*d-b*c>0?1:0};
}
/**
 * A sphere cut by planes through its centre: the flat faces that face the viewer (one filled path per plane and side), the stretches of the limb
 * circle that belong to the piece, the rim arcs of the cut faces and the radii where cut faces meet, each cut where the depth test changes
 * (solid in front, dashed behind), and a dot at a named centre.
 */
function specCutSphere(solid,ctx,arcPrim){
  const {S,pt,prims,line}=ctx,sid=solid.id,r=solid.radius,cut=solid.cut,sh=solid.offset??0;
  const scr=cutScreen(solid,pt),c0=project([0,0,r]);
  const centre=scr([0,0,0]);
  // faces: the quarter-disks that stand on one plane, face the same way and touch along a radius are one fill (a half-disk, three quarters, a whole disk),
  // so no seam runs through it and a label may lie across it
  const groups=new Map();
  for(const face of cut.faces){
    if(!face.visible)continue;
    const key=face.plane+face.outward.join(',');
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(face);
  }
  const quadrant={'++':0,'-+':1,'--':2,'+-':3};
  for(const list of groups.values()){
    const plane=SPHERE_PLANES.find(pl=>pl.id===list[0].plane),have=new Set(list.map(f=>quadrant[f.quad]));
    const runs=[];
    if(have.size===4)runs.push([0,4]);
    else for(const k of [...have].sort())if(!have.has((k+3)%4)){let n=1;while(have.has((k+n)%4))n++;runs.push([k,n]);}
    for(const [k0,n] of runs){
      const ids=[...Array(n).keys()].map(m=>list.find(f=>quadrant[f.quad]===(k0+m)%4).id);
      const at=psi=>scr([0,1,2].map(k=>r*(Math.cos(psi)*CUT_AXES[plane.i][k]+Math.sin(psi)*CUT_AXES[plane.j][k])));
      const steps=CUT_FACE_STEPS*n,psi0=Math.PI/2*k0,points=n===4?[]:[centre];
      for(let m=0;m<(n===4?steps:steps+1);m++)points.push(at(psi0+Math.PI/2*n*m/steps));
      let area=0;for(let i=0;i<points.length;i++){const [a,b]=[points[i],points[(i+1)%points.length]];area+=a[0]*b[1]-b[0]*a[1];}
      if(area<0)points.reverse();
      prims.push({t:'cutface',id:'cut-face-'+sid+'-'+ids.join('-'),role:'cut-face',solid:sid,faces:ids.join(' '),points});
    }
  }
  cut.limb.forEach((piece,k)=>arcPrim(`${sid}-limb-${k+1}`,'sphere-limb',{cx:c0[0]+sh,cy:c0[1],a:r,b:r},piece.phi0,piece.phi1,'solid',{solid:sid,part:'LIMB',octant:piece.octant}));
  for(const arc of cut.arcs){
    const plane=SPHERE_PLANES.find(p=>p.id===arc.plane),si=arc.quad[0]==='+'?1:-1,sj=arc.quad[1]==='+'?1:-1;
    const p1=project(CUT_AXES[plane.i].map(v=>v*si)),p2=project(CUT_AXES[plane.j].map(v=>v*sj)),ellipse=projectedEllipse(S,r,p1,p2);
    arc.runs.forEach((run,k)=>{
      const at=t=>scr(arcPoint(r,arc,Math.PI/2*t)),p0=at(run.t0),p1x=at(run.t1);
      if(Math.hypot(p1x[0]-p0[0],p1x[1]-p0[1])<0.4)return;
      const samples=[...Array(CUT_ARC_SAMPLES+1).keys()].map(m=>at(run.t0+(run.t1-run.t0)*m/CUT_ARC_SAMPLES));
      prims.push({t:'earc',id:`${sid}-rim-${arc.id}-${k+1}`,role:'cut-arc',solid:sid,arc:arc.id,t0:run.t0,t1:run.t1,vis:run.hidden?'hidden':'solid',p0,p1:p1x,samples,...ellipse});
    });
  }
  for(const crease of cut.creases){
    const at=t=>scr(CUT_AXES[crease.axis].map(v=>v*crease.sign*r*t));
    crease.runs.forEach((run,k)=>{
      const a=at(run.t0),b=at(run.t1);
      if(Math.hypot(b[0]-a[0],b[1]-a[1])<0.4)return;
      line(`${sid}-crease-${crease.id}-${k+1}`,'cut-crease',a,b,{solid:sid,edge:crease.id,vis:run.hidden?'hidden':'solid',t0:run.t0,t1:run.t1});
    });
  }
  if(solid.points.some(q=>q.name))prims.push({t:'dot',id:'centre-'+sid,role:'center-dot',solid:sid,cx:centre[0],cy:centre[1],r:2.4});
}
/** A circle (plan units) as a polygon in px, for the region a face label must stay inside. */
const circleRegion=(c,pt)=>[...Array(36).keys()].map(k=>{const u=2*Math.PI*k/36;return pt([c.cx+c.r*Math.cos(u),c.cy+c.r*Math.sin(u)]);});
function specNet(plan,model,ctx){
  const {S,pt,prims,labels,line}=ctx;
  const fold='hidden';
  // one label in the middle of a net face (net.faceLabels): it must lie wholly inside the region of its face
  const faceLabel=(fl,region)=>labels.push({id:'face-label-'+fl.face,role:'face-label',owner:'face-'+fl.face,...(fl.symbol?{kind:'TEXT',text:fl.text,tight:true}:{kind:'MATH',tex:fl.tex}),plain:fl.text,value:String(fl.value),numeric:fl.numeric,faceOf:fl.face,region});
  if(model.netKind==='POLYHEDRON'){
    const byId=new Map(model.faces.map(f=>[f.id,f]));
    const joinOf=new Map();
    for(const j of model.joins){joinOf.set(j.parent+'|'+j.edge.join(','),j);}
    const foldEdges=new Set();
    for(const j of model.joins){
      const fp=byId.get(j.parent),fc=byId.get(j.child);
      foldEdges.add(j.parent+':'+Math.min(...j.edge)+'-'+Math.max(...j.edge));foldEdges.add(j.child+':'+Math.min(...j.edge)+'-'+Math.max(...j.edge));
      void fp;void fc;
    }
    for(const f of model.faces)prims.push({t:'poly',id:'net-face-'+f.id,role:'net-face',face:f.id,points:f.poly.map(pt)});
    for(const h of model.highlights??[])prims.push({t:'poly',id:'net-highlight-'+h.face,role:'net-highlight',face:h.face,fill:h.fill,points:byId.get(h.face).poly.map(pt)});
    // a stressed edge is found by the drawn line it lies on: one shared line for a fold, the face's own line for a cut edge
    const lineKey=(f,k)=>{const n=f.idx.length,a=f.idx[k],b=f.idx[(k+1)%n],lo=Math.min(a,b),hi=Math.max(a,b);return lo+'-'+hi+(foldEdges.has(f.id+':'+lo+'-'+hi)?'-fold':'-'+f.id);};
    const stressed=new Map((model.segments??[]).filter(s=>!s.diagonal).map(s=>[lineKey(byId.get(s.face),s.edge),s.role]));
    const drawn=new Set();
    for(const f of model.faces){
      const n=f.idx.length;
      for(let k=0;k<n;k++){
        const a=f.idx[k],b=f.idx[(k+1)%n],key=f.id+':'+Math.min(a,b)+'-'+Math.max(a,b),isFold=foldEdges.has(key);
        const pairKey=Math.min(a,b)+'-'+Math.max(a,b)+(isFold?'-fold':'-'+f.id);
        if(isFold&&drawn.has(pairKey))continue;
        drawn.add(pairKey);
        line(`net-edge-${f.id}-${k}`,'net-edge',pt(f.poly[k]),pt(f.poly[(k+1)%n]),{face:f.id,edgeIndex:k,vis:isFold?fold:'solid',fold:isFold?1:0,...(stressed.has(pairKey)?{accent:stressed.get(pairKey)}:{})});
      }
    }
    // a stressed face diagonal is one more drawn line, on top of the edges (it ends on two corners of its face)
    for(const s of (model.segments??[]).filter(x=>x.diagonal)){
      const f=byId.get(s.face),[i,j]=s.diagonal;
      line(`net-diagonal-${f.id}-${i}-${j}`,'net-diagonal',pt(f.poly[i]),pt(f.poly[j]),{face:f.id,diagonal:i+'-'+j,vis:'solid',accent:s.role});
    }
    const cen=model.faces.flatMap(f=>f.poly);const mean=[cen.reduce((s,p)=>s+p[0],0)/cen.length,cen.reduce((s,p)=>s+p[1],0)/cen.length];
    // corner names: corners that coincide in the net are one place (a name is written once there); the name sits where no edge runs
    const corners=[];
    for(const f of model.faces){
      const n=f.poly.length;
      f.poly.forEach((p,k)=>{
        const prev=f.poly[(k+n-1)%n],next=f.poly[(k+1)%n];
        corners.push({p,name:f.corners[k],face:f.id,index:k,around:[prev,next]});
      });
    }
    const clusters=[];
    for(const c of corners){
      const px=pt(c.p);
      const home=clusters.find(g=>Math.hypot(g.px[0]-px[0],g.px[1]-px[1])<0.35);
      if(home)home.members.push(c);else clusters.push({px,members:[c]});
    }
    for(const g of clusters){
      const dirs=[];
      for(const c of g.members)for(const other of c.around){
        const d=[other[0]-c.p[0],other[1]-c.p[1]],l=Math.hypot(d[0],d[1]),u=[d[0]/l,d[1]/l];
        if(!dirs.some(v=>Math.hypot(v[0]-u[0],v[1]-u[1])<1e-3))dirs.push(u);
      }
      let dx=-dirs.reduce((sum,v)=>sum+v[0],0),dy=-dirs.reduce((sum,v)=>sum+v[1],0),l=Math.hypot(dx,dy);
      if(l<0.3){dx=g.members[0].p[0]-mean[0];dy=g.members[0].p[1]-mean[1];l=Math.hypot(dx,dy)||1;}
      const written=new Set();
      for(const c of g.members){
        if(!c.name||written.has(c.name))continue;
        written.add(c.name);
        labels.push({id:`corner-${c.face}-${c.index}`,role:'vertex-name',owner:`corner-${c.face}-${c.index}`,kind:'MATH',tex:c.name,plain:c.name,value:c.name,face:c.face,index:c.index,anchor:g.px,dir:[r6(dx/l),r6(dy/l)]});
      }
    }
    for(const d of model.dims){
      const f=byId.get(d.face),n=f.poly.length,a=f.poly[d.edge],b=f.poly[(d.edge+1)%n];
      labels.push({id:d.id+'-label',role:'dim',owner:d.id,...(d.word?{kind:'TEXT',text:d.text}:{kind:'MATH',tex:d.tex}),plain:d.text,value:String(d.value),numeric:d.numeric,dim:d.id,segment:[pt(a),pt(b)],segmentOf:'net-edge:'+d.face+':'+d.edge});
    }
    // a right angle at a corner of a face: a small square inside the face, its legs along the two edges
    for(const m of model.rightAngles??[]){
      const f=byId.get(m.face),n=f.poly.length,V=f.poly[m.corner],A=f.poly[(m.corner+n-1)%n],B=f.poly[(m.corner+1)%n];
      const la=Math.hypot(A[0]-V[0],A[1]-V[1]),lb=Math.hypot(B[0]-V[0],B[1]-V[1]),k=Math.min(0.3*Math.min(la,lb),14/S);
      if(k*S<4)bad('SOLID_NET_RIGHT_ANGLE_TOO_SMALL:'+m.face+':'+m.corner);
      const ua=[(A[0]-V[0])/la,(A[1]-V[1])/la],ub=[(B[0]-V[0])/lb,(B[1]-V[1])/lb];
      const pts=[[V[0]+ua[0]*k,V[1]+ua[1]*k],[V[0]+(ua[0]+ub[0])*k,V[1]+(ua[1]+ub[1])*k],[V[0]+ub[0]*k,V[1]+ub[1]*k]].map(pt);
      prims.push({t:'polyline',id:`net-ra-${m.face}-${m.corner}`,role:'net-right-angle',points:pts,face:m.face,corner:m.corner});
    }
    for(const fl of model.faceLabels??[])faceLabel(fl,byId.get(fl.face).poly.map(pt));
    return;
  }
  const circle=(id,part,c)=>prims.push({t:'circle',id,role:'net-circle',part,cx:ctx.X(c.cx),cy:ctx.Y(c.cy),r:r6(S*c.r),...((model.excluded??[]).includes(part)?{excluded:true}:{})});
  if(model.netKind==='CYLINDER'){
    const {rect,bottom,top}=model.shapes;
    const x0=rect.x,x1=rect.x+rect.w,y0=rect.y,y1=rect.y+rect.h;
    prims.push({t:'poly',id:'net-rect',role:'net-face',face:'rect',points:[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(pt)});
    line('net-rect-bottom','net-edge',pt([x0,y0]),pt([x1,y0]),{face:'rect',vis:'hidden',fold:1,part:'bottom'});
    line('net-rect-top','net-edge',pt([x0,y1]),pt([x1,y1]),{face:'rect',vis:'hidden',fold:1,part:'top'});
    line('net-rect-left','net-edge',pt([x0,y0]),pt([x0,y1]),{face:'rect',vis:'solid',fold:0,part:'left'});
    line('net-rect-right','net-edge',pt([x1,y0]),pt([x1,y1]),{face:'rect',vis:'solid',fold:0,part:'right'});
    circle('net-circle-bottom','bottom',bottom);circle('net-circle-top','top',top);
    for(const d of model.dims){
      const seg={'rect-width':[[x0,y1],[x1,y1]],'rect-height':[[x1,y0],[x1,y1]],'radius-top':[[top.cx,top.cy],[top.cx+top.r,top.cy]],'radius-bottom':[[bottom.cx,bottom.cy],[bottom.cx+bottom.r,bottom.cy]]}[d.part];
      if(d.part.startsWith('radius'))line(d.id+'-line','dim-line',pt(seg[0]),pt(seg[1]),{dim:d.id,kind:d.part,vis:'solid'});
      labels.push({id:d.id+'-label',role:'dim',owner:d.id,kind:'MATH',tex:d.tex,plain:d.text,value:String(d.value),numeric:d.numeric,dim:d.id,segment:[pt(seg[0]),pt(seg[1])],segmentOf:'net-part:'+d.part});
    }
    for(const fl of model.faceLabels??[])faceLabel(fl,fl.face==='rect'?[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(pt):circleRegion(fl.face==='bottom'?bottom:top,pt));
    return;
  }
  // cone
  const {sector,base}=model.shapes,half=sector.angleDeg/2*Math.PI/180,L=sector.radius;
  const p1=[L*Math.cos(-Math.PI/2-half),L*Math.sin(-Math.PI/2-half)],p2=[L*Math.cos(-Math.PI/2+half),L*Math.sin(-Math.PI/2+half)];
  prims.push({t:'sector',id:'net-sector',role:'net-face',face:'sector',apex:pt([0,0]),p1:pt(p1),p2:pt(p2),radius:r6(S*L),large:sector.angleDeg>180?1:0,angleDeg:sector.angleDeg});
  circle('net-circle-base','base',base);
  for(const d of model.dims){
    let seg;
    if(d.part==='slant')seg=[[0,0],p2];
    else if(d.part==='radius')seg=[[base.cx,base.cy],[base.cx+base.r,base.cy]];
    else if(d.part==='arc')seg=[[-0.12*L,-L],[0.12*L,-L]];// the tangent at the arc's middle (the arc is symmetric about the vertical)
    else seg=[[0,0],[0,-L*0.35]];
    if(d.part==='radius')line(d.id+'-line','dim-line',pt(seg[0]),pt(seg[1]),{dim:d.id,kind:'radius',vis:'solid'});
    if(d.part==='slant')line(d.id+'-line','dim-line',pt(seg[0]),pt(seg[1]),{dim:d.id,kind:'slant',vis:'solid'});
    labels.push({id:d.id+'-label',role:'dim',owner:d.id,kind:'MATH',tex:d.tex,plain:d.text,value:String(d.value),numeric:d.numeric,dim:d.id,segment:[pt(seg[0]),pt(seg[1])],segmentOf:'net-part:'+d.part,inside:d.part==='angle'});
  }
  for(const fl of model.faceLabels??[]){
    const arc=[...Array(33).keys()].map(k=>{const a=-Math.PI/2-half+2*half*k/32;return pt([L*Math.cos(a),L*Math.sin(a)]);});
    faceLabel(fl,fl.face==='sector'?[pt([0,0]),...arc]:circleRegion(base,pt));
  }
}

// --- composing ----------------------------------------------------------------------------------------------------------------------------------
const arcPoints=(p,n=ELL_SAMPLES)=>{const pts=[];for(let k=0;k<=n;k++){const u=p.u0+(p.u1-p.u0)*k/n;pts.push([p.cx+p.rx*Math.cos(u),p.cy-p.ry*Math.sin(u)]);}return pts;};
function obstacleSegments(spec){
  const segs=[];
  const poly=(pts,closed)=>{for(let i=0;i<pts.length-(closed?0:1);i++)segs.push([pts[i],pts[(i+1)%pts.length]]);};
  for(const p of spec.prims){
    if(p.t==='line')segs.push([[p.x1,p.y1],[p.x2,p.y2]]);
    else if(p.t==='arc')poly(arcPoints(p),false);
    else if(p.t==='circle'){const pts=[];for(let k=0;k<ELL_SAMPLES;k++){const u=2*Math.PI*k/ELL_SAMPLES;pts.push([p.cx+p.r*Math.cos(u),p.cy-p.r*Math.sin(u)]);}poly(pts,true);}
    else if(p.t==='poly'&&(p.role==='net-face'||p.role==='liquid-region'||p.role==='body-fill'))poly(p.points,true);
    else if(p.t==='polyline')poly(p.points,false);
    else if(p.t==='earc')poly(p.samples,false);
    // the outline of a filled cut face is geometry the rendered layout check keeps labels off
    else if(p.t==='cutface')poly(p.points,true);
    else if(p.t==='sector'){
      // The drawn arc runs from p1 to p2 with sweep-flag 0 (the short way round in screen coordinates): keep the signed angle difference.
      const pts=[p.apex],a=Math.atan2(p.p1[1]-p.apex[1],p.p1[0]-p.apex[0]),b=Math.atan2(p.p2[1]-p.apex[1],p.p2[0]-p.apex[0]),d=b-a;
      for(let k=0;k<=ELL_SAMPLES*2;k++)pts.push([p.apex[0]+p.radius*Math.cos(a+d*k/(ELL_SAMPLES*2)),p.apex[1]+p.radius*Math.sin(a+d*k/(ELL_SAMPLES*2))]);
      poly(pts,true);
    }
  }
  return segs;
}
function segmentHitsBox(a,b,box,pad){
  const x0=box.x-pad,y0=box.y-pad,x1=box.x+box.width+pad,y1=box.y+box.height+pad;
  const inside=p=>p[0]>=x0&&p[0]<=x1&&p[1]>=y0&&p[1]<=y1;
  if(inside(a)||inside(b))return true;
  const edges=[[[x0,y0],[x1,y0]],[[x1,y0],[x1,y1]],[[x1,y1],[x0,y1]],[[x0,y1],[x0,y0]]];
  return edges.some(([c,d])=>{
    const o=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
    return (o(a,b,c)*o(a,b,d)<0)&&(o(c,d,a)*o(c,d,b)<0);
  });
}
// a counting number's centre stays within COUNT_FAR px of its own vertex or edge midpoint (the observer's bound is 48; one half px less here, so a rounding never crosses it)
const BOX_PAD=2.2,COUNT_MARGIN=4,COUNT_FAR=47.5;
/**
 * Place every label near its anchor: names on the open side of their corner, lengths beside their segment, never over a stroke or another label.
 * A label that finds no place because the labels placed before it took the room around it goes first on the next try (a few tries); the fewest-failures try is kept.
 */
/** The centre of area of a simple polygon (px). */
function polygonCentroid(poly){
  let a=0,cx=0,cy=0;
  for(let i=0;i<poly.length;i++){const [p,q]=[poly[i],poly[(i+1)%poly.length]],w=p[0]*q[1]-q[0]*p[1];a+=w;cx+=(p[0]+q[0])*w;cy+=(p[1]+q[1])*w;}
  return Math.abs(a)<1e-9?[poly.reduce((s,p)=>s+p[0],0)/poly.length,poly.reduce((s,p)=>s+p[1],0)/poly.length]:[cx/(3*a),cy/(3*a)];
}
const rankOf=l=>l.role==='vertex-name'||l.role==='count-vertex'||l.place==='VERTEX'?0:l.role==='count-edge'?2:1;
function placeLabels(spec,fragments,errors){
  let order=[...spec.labels].sort((a,b)=>rankOf(a)-rankOf(b)),best=null;
  for(let attempt=0;attempt<6;attempt++){
    const result=placeLabelsOnce(spec,fragments,order);
    if(!best||result.failed.length<best.failed.length)best=result;
    if(!result.failed.length)break;
    const failed=new Set(result.failed);
    order=[...order.filter(l=>failed.has(l.id)),...order.filter(l=>!failed.has(l.id))];
  }
  errors.push(...best.failed);
  return best.placed;
}
function placeLabelsOnce(spec,fragments,order){
  const obstacles=obstacleSegments(spec),placed=[],failedIds=[];
  const {width,height}=spec.size,SAFE_MARGIN=SAFE;
  const free=(box,ignoreOwn)=>{
    if(box.x<SAFE_MARGIN||box.y<SAFE_MARGIN||box.x+box.width>width-SAFE_MARGIN||box.y+box.height>height-SAFE_MARGIN)return false;
    if(placed.some(p=>overlaps({x:p.box.x-BOX_PAD,y:p.box.y-BOX_PAD,width:p.box.width+2*BOX_PAD,height:p.box.height+2*BOX_PAD},box)))return false;
    return !obstacles.some(([a,b])=>segmentHitsBox(a,b,box,BOX_PAD)&&!(ignoreOwn&&false));
  };
  // a counting number stays nearer to its own vertex or edge midpoint than to any other by a margin, so no number can be read as another's
  const nearest=(label,box)=>{
    if(!label.near)return true;
    const cx=box.x+box.width/2,cy=box.y+box.height/2,own=Math.hypot(cx-label.near.own[0],cy-label.near.own[1]);
    return own<=COUNT_FAR&&label.near.others.every(o=>own+label.near.margin<Math.hypot(cx-o[0],cy-o[1]));
  };
  for(const label of order){
    const frag=fragments.get(label.id),{width:w,height:h}=frag.intrinsic;
    let chosen=null;
    const candidates=[];
    if(label.role==='face-label'||label.place==='FACE'){
      // inside the face, nearest its centre of area first: rings of growing radius; the box has to stand clear of every stroke, so a box whose centre is inside is wholly inside
      const c=polygonCentroid(label.region);
      candidates.push({x:c[0]-w/2,y:c[1]-h/2});
      for(let dist=3;dist<=120;dist+=3){
        const n=Math.max(8,Math.ceil(2*Math.PI*dist/4));
        for(let k=0;k<n;k++){const ang=2*Math.PI*k/n;candidates.push({x:c[0]+Math.cos(ang)*dist-w/2,y:c[1]-Math.sin(ang)*dist-h/2});}
      }
    }else if(label.role==='vertex-name'||label.role==='count-vertex'||label.place==='VERTEX'){
      const base=Math.atan2(label.dir[1],label.dir[0]);
      for(const dist of [5,8,12,17,24])for(const da of [0,0.5,-0.5,1.0,-1.0,1.6,-1.6,2.3,-2.3,Math.PI]){
        const a=base+da,dx=Math.cos(a),dy=-Math.sin(a);
        const cx=label.anchor[0]+dx*(dist+Math.abs(dx)*w/2),cy=label.anchor[1]+dy*(dist+Math.abs(dy)*h/2);
        candidates.push({x:cx-w/2,y:cy-h/2});
      }
    }else{
      const [a,b]=label.segment,dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
      const sides=label.preferredSide?[label.preferredSide,-label.preferredSide]:[1,-1];
      for(const side of sides)for(const dist of [3,6,10,15,21])for(const frac of [0.5,0.4,0.6,0.3,0.7,0.2,0.8]){
        const mx=a[0]+dx*frac,my=a[1]+dy*frac;
        // the box edge (not its centre) stands `dist` px from the segment
        const ext=Math.abs(nx)*w/2+Math.abs(ny)*h/2;
        const cx=mx+side*nx*(dist+ext),cy=my+side*ny*(dist+ext);
        candidates.push({x:cx-w/2,y:cy-h/2,side});
      }
      if(label.inside){candidates.unshift({x:(a[0]+b[0])/2-w/2,y:(a[1]+b[1])/2-h/2+30});}
    }
    // a counting number that found no place beside its edge or vertex may stand anywhere around its own target, nearest first (tried after the others, so a figure that
    // had a place keeps it)
    if(label.near)for(let dist=2;dist<=COUNT_FAR;dist+=1.5){
      const n=Math.max(8,Math.ceil(2*Math.PI*dist/3));
      for(let k=0;k<n;k++){const ang=2*Math.PI*k/n;candidates.push({x:label.near.own[0]+Math.cos(ang)*dist-w/2,y:label.near.own[1]-Math.sin(ang)*dist-h/2});}
    }
    for(const c of candidates){const box={x:r6(c.x),y:r6(c.y),width:w,height:h};if(free(box)&&nearest(label,box)&&(!label.region||inside2(label.region,[box.x+w/2,box.y+h/2]))){chosen=box;break;}}
    let leader=null;
    if(!chosen&&(label.role==='dim'||label.place==='SEGMENT'||label.place==='VERTEX')){
      // no room beside the segment (or the vertex): the label goes to the nearest free place and a thin leader line joins it to the middle of its segment (to the vertex)
      const [a,b]=label.place==='VERTEX'?[label.anchor,label.anchor]:label.segment,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
      search:for(const dist of [24,34,46,60,76])for(let k=0;k<16;k++){
        const ang=k*Math.PI/8,dx=Math.cos(ang),dy=Math.sin(ang);
        const box={x:r6(mx+dx*(dist+Math.abs(dx)*w/2)-w/2),y:r6(my+dy*(dist+Math.abs(dy)*h/2)-h/2),width:w,height:h};
        if(!free(box))continue;
        const nx=Math.max(box.x,Math.min(mx,box.x+box.width)),ny=Math.max(box.y,Math.min(my,box.y+box.height));
        if(placed.some(p=>segmentHitsBox([nx,ny],[mx,my],p.box,1)))continue;
        if(obstacles.some(([c,d])=>segmentsCross([nx,ny],[mx,my],c,d)))continue;// a leader never crosses a stroke
        chosen=box;leader=[[r6(nx),r6(ny)],[r6(mx),r6(my)]];obstacles.push(leader);break search;
      }
    }
    if(!chosen){failedIds.push(label.id);continue;}
    placed.push({label,fragment:frag,box:chosen,leader});
  }
  return {placed,failed:failedIds};
}
const strokeFor=p=>p.vis==='hidden'?' stroke-dasharray="5 4"':p.role==='axis-line'?' stroke-dasharray="10 3 2 3"':'';
function renderPrims(spec,model){
  let body='';
  const f=spec.frame;
  // fills first
  for(const p of spec.prims.filter(p=>p.t==='poly'&&p.role==='net-face'))body+=`<g data-layer="10"><polygon id="${p.id}" data-role="net-face" data-face="${p.face}" fill="#f4f6fa" stroke="none" points="${p.points.map(q=>q.join(',')).join(' ')}"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='sector'))body+=`<g data-layer="10"><path id="${p.id}" data-role="net-face" data-face="sector" data-angle="${p.angleDeg}" data-radius-px="${p.radius}" fill="#f4f6fa" stroke="#111" stroke-width="1.6" d="M ${p.apex.join(' ')} L ${p.p1.join(' ')} A ${p.radius} ${p.radius} 0 ${p.large} 0 ${p.p2.join(' ')} Z"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='circle'))body+=`<g data-layer="12"><circle id="${p.id}" data-role="net-circle" data-part="${p.part}"${p.excluded?' data-excluded="1"':''} fill="${p.excluded?'#fff':'#f4f6fa'}" stroke="${p.excluded?'#888':'#111'}" stroke-width="1.6"${p.excluded?' stroke-dasharray="5 4"':''} cx="${p.cx}" cy="${p.cy}" r="${p.r}"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='poly'&&p.role==='net-highlight'))body+=`<g data-layer="20"><polygon id="${p.id}" data-role="net-highlight" data-face="${p.face}" data-fill="${p.fill}" fill="#7fa6e8" fill-opacity="${p.fill==='MEDIUM'?0.55:0.32}" stroke="none" points="${p.points.map(q=>q.join(',')).join(' ')}"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='poly'&&p.role==='highlight-face')){
    const [color,opacity]=HIGHLIGHT_FILLS[p.fill??'LIGHT'];
    body+=`<g data-layer="20"><polygon id="${p.id}" data-role="highlight-face"${p.polygon?` data-polygon="${p.polygon}"`:` data-solid="${p.solid}" data-face="${p.face}"`}${p.fill&&p.fill!=='LIGHT'?` data-fill="${p.fill}"`:''} fill="${color}" fill-opacity="${opacity}" stroke="none" points="${p.points.map(q=>q.join(',')).join(' ')}"/></g>`;
  }
  for(const p of spec.prims.filter(p=>p.t==='poly'&&p.role==='body-fill'))body+=`<g data-layer="20"><polygon id="${p.id}" data-role="body-fill" data-solid="${p.solid}" data-side="${p.side}" fill="#7fa6e8" fill-opacity="0.32" stroke="none" points="${p.points.map(q=>q.join(',')).join(' ')}"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='poly'&&p.role==='liquid-region'))body+=`<g data-layer="20"><polygon id="${p.id}" data-role="liquid-region" data-solid="${p.solid}" fill="#7fa6e8" fill-opacity="0.32" stroke="none" points="${p.points.map(q=>q.join(',')).join(' ')}"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='ellipse'))body+=`<g data-layer="20"><ellipse id="${p.id}" data-role="level-fill" data-solid="${p.solid}" fill="#7fa6e8" fill-opacity="0.32" stroke="none" cx="${p.cx}" cy="${p.cy}" rx="${p.rx}" ry="${p.ry}"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='cutface'))body+=`<g data-layer="20"><path id="${p.id}" data-role="cut-face" data-solid="${p.solid}" data-faces="${p.faces}" fill="#7fa6e8" fill-opacity="0.32" stroke="none" d="M ${p.points.map(q=>q.join(' ')).join(' L ')} Z"/></g>`;
  for(const p of spec.prims.filter(p=>p.t==='poly'&&p.role==='section'))body+=`<g data-layer="20"><polygon id="${p.id}" data-role="section" data-section="axial" data-solid="${p.solid}" fill="#7fa6e8" fill-opacity="0.32" stroke="#2457b8" stroke-width="1.6" stroke-dasharray="6 3" points="${p.points.map(q=>q.join(',')).join(' ')}"/></g>`;
  for(const p of spec.prims){
    if(p.t==='line'){
      const accent=p.accent==='ACCENT'?' stroke="#c0392b"':'';
      const w=p.role==='dim-line'||p.role==='dim-ext'||p.role==='axis-line'?1.1:p.role==='segment'||p.role==='net-diagonal'||(p.role==='net-edge'&&p.accent)?2.4:p.role==='silhouette'?1.7:1.6;
      const attrs=[`id="${p.id}"`,`data-role="${p.role}"`,p.solid?`data-solid="${p.solid}"`:'',p.edge?`data-edge="${p.edge}"`:'',p.vis?`data-vis="${p.vis}"`:'',p.t0!==undefined?`data-t0="${p.t0}" data-t1="${p.t1}"`:'',p.side?`data-side="${p.side}"`:'',p.dim?`data-dim="${p.dim}" data-kind="${p.kind}"`:'',p.mark?`data-mark="${p.mark}"${p.markEdge?` data-edge="${p.markEdge}"`:''} data-mark-index="${p.markIndex}" data-mark-count="${p.markCount}"`:'',p.face&&p.diagonal===undefined?`data-face="${p.face}" data-edge-index="${p.edgeIndex??''}" data-fold="${p.fold}"`:'',p.diagonal!==undefined?`data-face="${p.face}" data-diagonal="${p.diagonal}"`:'',p.part?`data-part="${p.part}"`:'',p.style?`data-style="${p.style}"`:'',(p.role==='net-edge'||p.role==='net-diagonal')&&p.accent?`data-accent="${p.accent}"`:''].filter(Boolean).join(' ');
      body+=`<g data-layer="40"><line ${attrs} stroke="${p.accent==='ACCENT'?'#c0392b':'#111'}" stroke-width="${w}"${strokeFor(p)} fill="none" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"/></g>`;
      void accent;
    }else if(p.t==='arc'){
      const A=[p.cx+p.rx*Math.cos(p.u0),p.cy-p.ry*Math.sin(p.u0)].map(r6),B=[p.cx+p.rx*Math.cos(p.u1),p.cy-p.ry*Math.sin(p.u1)].map(r6);
      const large=(p.u1-p.u0)>Math.PI+1e-9?1:0;
      body+=`<g data-layer="40"><path id="${p.id}" data-role="${p.role}" data-solid="${p.solid}" ${p.circle?`data-circle="${p.circle}" data-half="${p.half}"`:`data-part="${p.part}"`} data-vis="${p.vis}"${p.octant?` data-octant="${p.octant}"`:''} stroke="#111" stroke-width="1.6"${strokeFor(p)} fill="none" d="M ${A.join(' ')} A ${p.rx} ${p.ry} 0 ${large} 0 ${B.join(' ')}"/></g>`;
    }else if(p.t==='earc'){
      body+=`<g data-layer="40"><path id="${p.id}" data-role="${p.role}" data-solid="${p.solid}" data-arc="${p.arc}" data-t0="${p.t0}" data-t1="${p.t1}" data-vis="${p.vis}" stroke="#111" stroke-width="1.6"${strokeFor(p)} fill="none" d="M ${p.p0.join(' ')} A ${p.rx} ${p.ry} ${p.rot} 0 ${p.sweep} ${p.p1.join(' ')}"/></g>`;
    }else if(p.t==='dot'){
      body+=`<g data-layer="45"><circle id="${p.id}" data-role="${p.role}" data-solid="${p.solid}" fill="#111" cx="${p.cx}" cy="${p.cy}" r="${p.r}"/></g>`;
    }else if(p.t==='polyline'){
      const attrs=[`id="${p.id}"`,`data-role="${p.role}"`,p.mark?`data-mark="${p.mark}"`:'',p.at?`data-at="${p.at}"`:'',p.refs?`data-refs="${p.refs}"`:'',p.role==='net-right-angle'?`data-face="${p.face}" data-corner="${p.corner}"`:'',p.index!==undefined?`data-mark-index="${p.index}" data-mark-count="${p.count}"`:''].filter(Boolean).join(' ');
      body+=`<g data-layer="55"><polyline ${attrs} stroke="#111" stroke-width="1.2" fill="none" points="${p.points.map(q=>q.join(',')).join(' ')}"/></g>`;
    }
  }
  void f;void model;
  return body;
}
/** Typeset every label, place it, build the SVG, run the independent observer on its bytes and the rendered layout check in Chrome. */
export async function composeSolidFigurePanel({plan,model,identity,typographyPolicy,browser}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:SOLID_SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false,qualification:'NOT_RUN'});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=solidFigureSpec(plan,model);}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='SOLID_MODEL_MISMATCH'?error.message:'SOLID_SPEC_ERROR',{code:error.message});}
    lineage.specSha256=objectSha(spec);
    const typeset=typesetter(),font=typographyPolicy.baseFontPx,fragments=new Map();
    for(const label of spec.labels){
      try{fragments.set(label.id,typeset({id:label.id,owner:label.owner,factRole:label.role==='dim'?'CONCLUSION':'DERIVED_INTERMEDIATE',fontPx:font,panelId:'solid',...(label.kind==='TEXT'?{kind:'TEXT',text:label.text,...(label.tight?{tight:true}:{})}:{kind:'MATH',tex:label.tex})},identity));}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('SOLID_TYPESET_ERROR',{labelId:label.id,code:error.message});}
    }
    const failed=[];
    const placed=placeLabels(spec,fragments,failed);
    if(failed.length)throw new Stop('SOLID_LABELS_NO_ROOM',{labels:failed});
    lineage.fragmentSha256s=Object.fromEntries(placed.map(item=>[item.label.id,item.fragment.fragmentSha256]));
    const {width,height}=spec.size;
    let body=`<rect width="${width}" height="${height}" fill="#fff"/>`+renderPrims(spec,model);
    for(const {label,leader} of placed)if(leader)body+=`<g data-layer="40"><line id="leader-${label.id}" data-role="leader" data-owner-label="${label.id}" data-label="${label.id}" stroke="#555" stroke-width="0.9" fill="none" x1="${leader[0][0]}" y1="${leader[0][1]}" x2="${leader[1][0]}" y2="${leader[1][1]}"/></g>`;
    for(const {label,fragment,box,leader} of placed){
      body+=`<g data-layer="90"><g id="${label.id}" data-label-kind="${label.role==='dim'?'EQUATION_LABEL':label.role==='face-label'?'AREA_LABEL':'COORDINATE_LABEL'}" data-label-role="${label.role}" data-priority="0" data-font-px="${font}"${leader?' data-leader="1"':''} data-owner="${label.owner}" data-value="${esc(label.value)}"${label.numeric!==undefined?` data-numeric="${label.numeric?1:0}"`:''}${label.dim?` data-dim="${label.dim}"`:''}${label.segmentOf?` data-segment="${esc(label.segmentOf)}"`:''}${label.face?` data-face="${label.face}" data-corner="${label.index}"`:''}${label.countKind?` data-count="${label.countKind}" data-count-n="${label.countN}" data-solid="${label.solid}"`:''}${label.faceOf?` data-face-of="${label.faceOf}"`:''}${label.textId?` data-text-id="${label.textId}" data-at-kind="${label.atKind}" data-target="${esc(label.target)}"`:''} ${label.kind==='TEXT'?`data-text="${esc(label.text)}"`:`data-tex="${esc(label.tex)}"`} data-fragment-sha="${fragment.fragmentSha256}" transform="translate(${box.x} ${box.y})">${fragment.svg}</g></g>`;
    }
    const dataAttrs=` data-solid-figure="${SOLID_CAPABILITY}" data-mode="${model.mode}" data-scale="${spec.frame.scale}" data-origin="${spec.frame.origin.join(' ')}"${model.mode==='SOLIDS'?` data-yaw="${YAW_DEG}" data-pitch="${PITCH_DEG}"`:''}${model.unit?` data-unit="${model.unit}"`:''}`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img"${dataAttrs} data-publication-profile="fragment-publication-spike-v1" data-safe-margin="${SAFE}" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    if(process.env.APMS_DRAFT_DIR)(await import('node:fs')).writeFileSync(process.env.APMS_DRAFT_DIR+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-solid-'+Date.now()+'.svg',svg);
    let response;
    try{response=await pythonWorker({solidFigure:plan,svg},{script:OBSERVER_SCRIPT,timeoutMs:30000});}catch(error){throw new Stop('WORKER_ERROR',{stage:'solidFigureAudit',code:String(error?.message??error)});}
    if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'solidFigureAudit',code:response?.result?.code??null});
    const audit=response.result;lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')throw new Stop('SOLID_STATIC_AUDIT_FAIL',{errors});
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}),{textFreeFigure:spec.labels.length===0});}finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('SOLID_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}

// --- the author plan ----------------------------------------------------------------------------------------------------------------------------
const CAPTION_TEXT=/^.{1,24}$/;
/**
 * {capability:'solid-figure-v1',solids|net,dims?,highlights?,segments?,section?,unit?,solidCaption?:{text},caption,sourceConditions,newVisualInformation}
 * -> the one-panel composite-panels-v1 it stands for. The model is built here first, so a plan that cannot be drawn is refused before anything is.
 */
export function expandSolidFigure(plan){
  const model=solveSolidFigure(plan);
  const cap=plan.solidCaption;
  if(cap!==undefined&&(!isPlain(cap)||Object.keys(cap).some(k=>k!=='text')||typeof cap.text!=='string'||!CAPTION_TEXT.test(cap.text)))bad('SOLID_CAPTION_INVALID');
  if(plan.panelWidth!==undefined)bad('SOLID_PLAN_INVALID');
  const {caption,sourceConditions,newVisualInformation,solidCaption,sourceQuote,...figure}=plan;void solidCaption;
  return {capability:'composite-panels-v1',chain:SOLID_CAPABILITY,panels:[{caption:cap??{text:model.mode==='NET'?'전개도':'입체도형'},plan:figure}],caption,sourceConditions,newVisualInformation,...(sourceQuote!==undefined?{sourceQuote}:{})};
}
