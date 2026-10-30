// A sphere cut by planes through its centre (solid-figure-v1: SPHERE with cut:{kind,facing?}): the 3D model of the piece that is left.
// Only the three coordinate planes through the centre are used, so the piece is a union of the 8 octants of the ball. Its boundary is
//   - curved patches of the sphere (only their silhouette, the "limb", is drawn),
//   - flat quarter-disks on the coordinate planes (one per quadrant of a plane that separates a kept octant from a removed one),
//   - quarter circles (the rims of those quarter-disks) and straight radii on the axes (creases, where two flat faces meet at an angle).
// Everything is derived here from the radius and the cut alone, in coordinates relative to the centre. The projection (view direction and the screen's
// two axes) is handed in by solid-figure-v1.mjs so that this file has no import cycle with it.
const bad=code=>{throw Error(code);};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const SPHERE_CUT_KINDS=Object.freeze(['HALF','QUARTER','OCTANT','THREE_QUARTERS','SEVEN_EIGHTHS']);
export const SPHERE_CUT_FACING=Object.freeze(['CUT','CURVED']);
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
export const AXES=Object.freeze([[1,0,0],[0,1,0],[0,0,1]]);
/** The three coordinate planes: id is the axis they are perpendicular to, i and j the two axes inside the plane. */
export const SPHERE_PLANES=Object.freeze([{id:'X',n:0,i:1,j:2},{id:'Y',n:1,i:0,j:2},{id:'Z',n:2,i:0,j:1}]);
const sg=value=>value>0?'+':'-';
/** Octant index of the sign triple (+1/-1 each): 0 is (+,+,+), 7 is (-,-,-). */
export const octantIndex=s=>(s[0]<0?4:0)+(s[1]<0?2:0)+(s[2]<0?1:0);
export const octantSigns=i=>[i&4?-1:1,i&2?-1:1,i&1?-1:1];
export const octantName=s=>s.map(sg).join('');

// Which octants stay. The default facing "CUT" turns the cut faces toward the viewer (the viewer looks from +x, -y, +z): a half with its flat disk, a
// quarter wedge and a single octant seen into their corner, a notch cut out of the near side. "CURVED" is the same piece turned about the centre by a half turn,
// so the curved surface faces the viewer and the cut faces are behind.
const KEEP={
  HALF:s=>s[1]>0,
  QUARTER:s=>s[0]<0&&s[1]>0,
  OCTANT:s=>s[0]<0&&s[1]>0&&s[2]<0,
  THREE_QUARTERS:s=>!(s[0]>0&&s[1]<0),
  SEVEN_EIGHTHS:s=>!(s[0]>0&&s[1]<0&&s[2]>0)
};
export function octantMask(kind,facing){
  const keep=KEEP[kind];
  return [...Array(8).keys()].map(i=>{const s=octantSigns(i);return keep(facing==='CURVED'?s.map(v=>-v):s)?1:0;});
}
/** The checked author cut: {kind,facing?}. A plane that does not pass through the centre is refused. */
export function checkSphereCut(raw){
  if(!isPlain(raw)||Object.keys(raw).some(key=>!['kind','facing','offset','explode'].includes(key)))bad('SOLID_SPHERE_CUT_INVALID');
  if(raw.explode!==undefined)bad('SOLID_SPHERE_CUT_EXPLODE_UNSUPPORTED');
  if(raw.offset!==undefined&&raw.offset!==0)bad('SOLID_SPHERE_CUT_OFF_CENTRE');
  if(typeof raw.kind!=='string')bad('SOLID_SPHERE_CUT_INVALID');
  if(!SPHERE_CUT_KINDS.includes(raw.kind))bad('SOLID_SPHERE_CUT_KIND_UNSUPPORTED:'+raw.kind.slice(0,24));
  const facing=raw.facing??'CUT';
  if(!SPHERE_CUT_FACING.includes(facing))bad('SOLID_SPHERE_CUT_FACING_INVALID');
  return {kind:raw.kind,facing};
}

/** The point (relative to the centre) of the rim arc `arc` {plane,quad} at theta in [0, pi/2]: from the plane's first axis toward its second, by the quadrant's signs. */
export function arcPoint(r,arc,theta){
  const plane=SPHERE_PLANES.find(p=>p.id===arc.plane),si=arc.quad[0]==='+'?1:-1,sj=arc.quad[1]==='+'?1:-1;
  return [0,1,2].map(k=>r*(Math.cos(theta)*AXES[plane.i][k]*si+Math.sin(theta)*AXES[plane.j][k]*sj));
}

// --- the depth test: does the ray from a point on the piece toward the viewer pass through the piece? ---------------------------------------------
/** d: the point relative to the centre; V: the unit vector toward the viewer; mask: kept octants. Exact: the ray is cut at the coordinate planes. */
export function rayHitsPiece(d,V,r,mask){
  const b=dot(d,V),c=dot(d,d)-r*r,disc=b*b-c;
  if(!(disc>1e-12))return false;
  const s=Math.sqrt(disc),lo=Math.max(-b-s,1e-7),hi=-b+s;
  if(!(hi>lo+1e-7))return false;
  const cuts=[lo];
  for(let k=0;k<3;k++){
    if(Math.abs(V[k])<1e-12)continue;
    const t=-d[k]/V[k];
    if(t>lo+1e-9&&t<hi-1e-9)cuts.push(t);
  }
  cuts.push(hi);cuts.sort((x,y)=>x-y);
  for(let i=0;i<cuts.length-1;i++){
    if(cuts[i+1]-cuts[i]<1e-7)continue;
    const tm=(cuts[i]+cuts[i+1])/2,sign=k=>d[k]+tm*V[k]>=0?1:-1;
    if(mask[octantIndex([sign(0),sign(1),sign(2)])])return true;
  }
  return false;
}
/** Contiguous {t0,t1,hidden} runs of a curve t in [0,1] (depth test at 160 samples, transitions refined by bisection). */
function visibilityRuns(hiddenAt){
  const N=160,flags=[...Array(N).keys()].map(k=>hiddenAt((k+0.5)/N)),cuts=[0];
  for(let k=1;k<N;k++)if(flags[k]!==flags[k-1]){
    let lo=(k-0.5)/N,hi=(k+0.5)/N;const fl=flags[k-1];
    for(let it=0;it<42;it++){const mid=(lo+hi)/2;if(hiddenAt(mid)===fl)lo=mid;else hi=mid;}
    cuts.push((lo+hi)/2);
  }
  cuts.push(1);
  const runs=[];let state=flags[0];
  for(let c=0;c<cuts.length-1;c++){runs.push({t0:r6(cuts[c]),t1:r6(cuts[c+1]),hidden:state});state=!state;}
  return runs;
}

/**
 * The model of the piece. radius r; cut {kind,facing?}; frame {view,ex,ey}: the unit vector from the object to the viewer and the screen's horizontal
 * and vertical axes as world vectors (so the limb circle q(phi)=r(cos phi ex + sin phi ey) projects to the circle of radius r about the centre).
 * Returns {kind,facing,mask,faces,arcs,creases,limb,radiusAxis}; all numbers rounded.
 */
export function sphereCutModel(r,rawCut,frame){
  const {kind,facing}=checkSphereCut(rawCut),mask=octantMask(kind,facing),V=frame.view;
  const kept=s=>mask[octantIndex(s)]===1;
  // quarter-disks and their rims: one per (plane, quadrant); a boundary face when exactly one of the two octants it separates stays
  const faces=[],arcs=[];
  for(const plane of SPHERE_PLANES)for(const si of [1,-1])for(const sj of [1,-1]){
    const above=[0,0,0],below=[0,0,0];
    above[plane.i]=below[plane.i]=si;above[plane.j]=below[plane.j]=sj;above[plane.n]=1;below[plane.n]=-1;
    const keepAbove=kept(above),keepBelow=kept(below);
    if(keepAbove===keepBelow)continue;
    const id=plane.id+sg(si)+sg(sj),outward=AXES[plane.n].map(v=>keepAbove?-v:v).map(v=>v===0?0:v);
    const e1=AXES[plane.i].map(v=>v*si),e2=AXES[plane.j].map(v=>v*sj);
    const at=theta=>[0,1,2].map(k=>r*(Math.cos(theta)*e1[k]+Math.sin(theta)*e2[k]));
    // a point inside the quarter-disk stands for it in the depth test
    const sample=[0,1,2].map(k=>0.45*r*(e1[k]+e2[k]));
    const visible=dot(outward,V)>1e-9&&!rayHitsPiece(sample,V,r,mask);
    faces.push({id,plane:plane.id,quad:sg(si)+sg(sj),outward,visible});
    arcs.push({id,plane:plane.id,quad:sg(si)+sg(sj),runs:visibilityRuns(u=>rayHitsPiece(at(u*Math.PI/2),V,r,mask))});
  }
  // radii on the axes: a crease where one or three of the four octants around the half axis stay
  const creases=[];
  for(let k=0;k<3;k++)for(const s of [1,-1]){
    const plane=SPHERE_PLANES.find(p=>p.n===k);
    let count=0;
    for(const a of [1,-1])for(const b of [1,-1]){const o=[0,0,0];o[k]=s;o[plane.i]=a;o[plane.j]=b;if(kept(o))count++;}
    if(count!==1&&count!==3)continue;
    const at=u=>AXES[k].map(v=>v*s*r*u);
    creases.push({id:sg(s)+'XYZ'[k],axis:k,sign:s,runs:visibilityRuns(u=>rayHitsPiece(at(u),V,r,mask))});
  }
  // the limb: the circle of the sphere that the view just grazes; a stretch of it is drawn where the octant it lies in stays
  const {ex,ey}=frame,cross=[];
  for(let k=0;k<3;k++){
    const a=Math.atan2(-ex[k],ey[k]);
    for(const phi of [a,a+Math.PI]){const n=((phi%(2*Math.PI))+2*Math.PI)%(2*Math.PI);cross.push(n);}
  }
  cross.sort((x,y)=>x-y);
  const limb=[];
  for(let i=0;i<cross.length;i++){
    const a=cross[i],b=i+1<cross.length?cross[i+1]:cross[0]+2*Math.PI,mid=(a+b)/2;
    const q=[0,1,2].map(k=>Math.cos(mid)*ex[k]+Math.sin(mid)*ey[k]),s=q.map(v=>v>=0?1:-1);
    if(kept(s))limb.push({phi0:r6(a),phi1:r6(b),octant:octantName(s)});
  }
  // the radius a length label can lie on: a half axis that belongs to the piece and is seen, the most horizontal on the screen (the right one when equal)
  let radiusAxis=null,best=null;
  for(let k=0;k<3;k++)for(const s of [1,-1]){
    const plane=SPHERE_PLANES.find(p=>p.n===k);
    let any=false;
    for(const a of [1,-1])for(const b of [1,-1]){const o=[0,0,0];o[k]=s;o[plane.i]=a;o[plane.j]=b;if(kept(o))any=true;}
    if(!any)continue;
    if([0.25,0.5,0.75].some(u=>rayHitsPiece(AXES[k].map(v=>v*s*r*u),V,r,mask)))continue;
    const horizontal=Math.abs(dot(AXES[k].map(v=>v*s),frame.ex)),right=dot(AXES[k].map(v=>v*s),frame.ex)>0?1:0;
    const score=[r6(horizontal),right];
    if(!best||score[0]>best[0]+1e-9||(Math.abs(score[0]-best[0])<=1e-9&&score[1]>best[1])){best=score;radiusAxis={axis:k,sign:s};}
  }
  return {kind,facing,mask,faces,arcs,creases,limb,radiusAxis};
}
