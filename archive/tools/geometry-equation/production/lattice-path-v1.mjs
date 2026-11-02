import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {Stop,isDomainCode,esc,overlaps} from './quadratic-inequality-chain-v1.mjs';
import {PALETTE} from './palette.mjs';

// A standalone road-network / lattice shortest-path figure (lattice-path-figure-v1): a cols x rows grid of roads, named points on grid crossings, roads
// that may not be used (drawn broken), roads that must be used (drawn bold), an optional highlighted path and, on request, the number of shortest paths
// from the start to every crossing. The author states only the grid, the named points and the road lists; the engine counts the shortest (monotone)
// paths itself with a forward/backward dynamic programme over the set of "must use" roads, so a crossing's number is the number of ways to reach it that
// can still be completed into a valid path. The final answer (the number at the target) is hidden unless hideTargetCount is false.
// lattice_path_observer.py enumerates the valid paths by brute force from the same plan and checks the final SVG bytes (the numbers drawn, the roads
// drawn / broken / bold at their exact pixel positions, the points and the highlighted path); nothing this module computes is trusted.
// `absent` (G17) lists roads that do not exist (kept apart from `forbidden`: not drawn and not walkable, so a network that is not a full rectangle can be drawn) and `exclude` lists crossings the counted
// paths may not use (the crossing is removed from the walk; its 0 is written as a bold `count-excluded` label in the C1 WARM colour when `counts` asks for it). Both are opt-in: a plan without them keeps its model and SVG.
export const FIGURE_CAPABILITY='lattice-path-figure-v1';
export const MODEL_VERSION='LATTICE_PATH_MODEL_v1',SPEC_VERSION='LATTICE_PATH_SPEC_v1',SVG_VERSION='lattice-path-svg-v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('lattice-path-observer-worker.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const bad=code=>{throw Error(code);};
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const onlyKeys=(value,keys,code)=>{if(!isPlain(value)||Object.keys(value).some(key=>!keys.includes(key)))bad(code);};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};

const MAX_COLS=10,MAX_ROWS=8,MAX_POINTS=12,MAX_VIA=3,MAX_SEGMENTS=12,MAX_PATH=40;
const POINT_ID=/^[A-Z][0-9']?$/;
const TOP_KEYS=['capability','lattice','caption','sourceConditions','newVisualInformation','sourceQuote'];
const LATTICE_KEYS=['grid','points','from','to','forbidden','via','counts','hideTargetCount','highlightPath','absent','exclude'];
const MAX_EXCLUDE=3;
// the colour of the written 0 of an excluded crossing: the C1 WARM line colour (production/palette.mjs), drawn bold; lattice_path_observer.py keeps its own copy of the value
const EXCLUDED_COLOR=PALETTE.WARM.line,EXCLUDED_TEX='\\mathbf{0}';
const isInt=v=>Number.isSafeInteger(v);
const key=(x,y)=>`${x},${y}`;

// --- solving: the exact model ---------------------------------------------------------------------------------------------------------------
function resolver(cols,rows,pointsByName){
  return (ref,code)=>{
    if(typeof ref==='string'){if(!Object.hasOwn(pointsByName,ref))bad(code);return pointsByName[ref];}
    if(Array.isArray(ref)&&ref.length===2&&isInt(ref[0])&&isInt(ref[1])){
      if(ref[0]<0||ref[0]>cols||ref[1]<0||ref[1]>rows)bad('LATTICE_POINT_OUT_OF_GRID');
      return [ref[0],ref[1]];
    }
    return bad(code);
  };
}
const normEdge=(a,b)=>(a[0]<b[0]||(a[0]===b[0]&&a[1]<b[1]))?[a[0],a[1],b[0],b[1]]:[b[0],b[1],a[0],a[1]];
const adjacent=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1;
function segmentList(raw,resolve,cols,rows,code,{notAdjacent='LATTICE_SEGMENT_NOT_ADJACENT',duplicate='LATTICE_SEGMENT_DUPLICATE'}={}){
  if(raw===undefined)return [];
  if(!Array.isArray(raw)||raw.length>MAX_SEGMENTS)bad(code);
  const seen=new Set(),out=[];
  for(const item of raw){
    if(!Array.isArray(item)||item.length!==2)bad(code);
    const a=resolve(item[0],code),b=resolve(item[1],code);
    if(!adjacent(a,b))bad(notAdjacent);
    const e=normEdge(a,b),k=e.join(',');
    if(seen.has(k))bad(duplicate);
    seen.add(k);out.push(e);
  }
  return out.sort((p,q)=>p.join(',')<q.join(',')?-1:1);
}

export function solveLattice(lat){
  onlyKeys(lat,LATTICE_KEYS,'LATTICE_PLAN_INVALID');
  onlyKeys(lat.grid,['cols','rows'],'LATTICE_GRID_INVALID');
  const {cols,rows}=lat.grid;
  if(!isInt(cols)||!isInt(rows)||cols<1||rows<1||cols>MAX_COLS||rows>MAX_ROWS)bad('LATTICE_GRID_INVALID');
  const rawPoints=lat.points??{};
  if(!isPlain(rawPoints)||Object.keys(rawPoints).length>MAX_POINTS)bad('LATTICE_POINT_INVALID');
  const pointsByName={},used=new Set();
  for(const [name,xy] of Object.entries(rawPoints)){
    if(!POINT_ID.test(name))bad('LATTICE_POINT_ID_INVALID');
    if(!Array.isArray(xy)||xy.length!==2||!isInt(xy[0])||!isInt(xy[1]))bad('LATTICE_POINT_INVALID');
    if(xy[0]<0||xy[0]>cols||xy[1]<0||xy[1]>rows)bad('LATTICE_POINT_OUT_OF_GRID');
    if(used.has(key(...xy)))bad('LATTICE_POINT_POSITION_DUPLICATE');
    used.add(key(...xy));pointsByName[name]=[xy[0],xy[1]];
  }
  const resolve=resolver(cols,rows,pointsByName);
  const forbidden=segmentList(lat.forbidden,resolve,cols,rows,'LATTICE_SEGMENT_INVALID');
  let via=segmentList(lat.via,resolve,cols,rows,'LATTICE_SEGMENT_INVALID');
  if(via.length>MAX_VIA)bad('LATTICE_VIA_TOO_MANY');
  const forbiddenSet=new Set(forbidden.map(e=>e.join(',')));
  if(via.some(e=>forbiddenSet.has(e.join(','))))bad('LATTICE_VIA_FORBIDDEN_CONFLICT');
  // absent: roads that do not exist at all (not drawn, not walkable); unlike forbidden (drawn broken) they leave a gap in the rectangle
  const absent=segmentList(lat.absent,resolve,cols,rows,'LATTICE_ABSENT_INVALID',{notAdjacent:'LATTICE_ABSENT_INVALID',duplicate:'LATTICE_ABSENT_DUPLICATE'});
  const absentSet=new Set(absent.map(e=>e.join(',')));
  if(absent.some(e=>forbiddenSet.has(e.join(','))||via.some(v=>v.join(',')===e.join(','))))bad('LATTICE_ABSENT_CONFLICT');
  const roadsAt=new Map();                                   // crossing -> number of roads that still reach it
  for(let x=0;x<=cols;x++)for(let y=0;y<=rows;y++){
    let n=0;
    for(const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]])if(nx>=0&&nx<=cols&&ny>=0&&ny<=rows&&!absentSet.has(normEdge([x,y],[nx,ny]).join(',')))n++;
    roadsAt.set(key(x,y),n);
  }
  if(absent.length){                                          // every row and every column of crossings keeps a road, so the lattice scale can be read back from the drawn roads
    for(let x=0;x<=cols;x++)if(![...Array(rows+1).keys()].some(y=>roadsAt.get(key(x,y))>0))bad('LATTICE_ABSENT_EMPTY_LINE');
    for(let y=0;y<=rows;y++)if(![...Array(cols+1).keys()].some(x=>roadsAt.get(key(x,y))>0))bad('LATTICE_ABSENT_EMPTY_LINE');
  }
  // exclude: crossings the counted paths may not pass through (their written value is 0)
  const excludeRaw=lat.exclude;
  let excluded=[];
  if(excludeRaw!==undefined){
    if(!Array.isArray(excludeRaw)||excludeRaw.length<1||excludeRaw.length>MAX_EXCLUDE)bad('LATTICE_EXCLUDE_INVALID');
    const seen=new Set();
    for(const ref of excludeRaw){
      const n=resolve(ref,'LATTICE_EXCLUDE_INVALID');
      if(seen.has(key(...n)))bad('LATTICE_EXCLUDE_DUPLICATE');
      seen.add(key(...n));excluded.push(n);
    }
    excluded.sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
  }
  const excludedSet=new Set(excluded.map(n=>key(...n)));
  const countsRaw=lat.counts??false;
  if(!(countsRaw===true||countsRaw===false||(Array.isArray(countsRaw)&&countsRaw.length>=1&&countsRaw.length<=40)))bad('LATTICE_COUNTS_INVALID');
  if(lat.hideTargetCount!==undefined&&typeof lat.hideTargetCount!=='boolean')bad('LATTICE_COUNTS_INVALID');
  const hideTarget=lat.hideTargetCount!==false;
  if(excluded.length&&countsRaw===false)bad('LATTICE_EXCLUDE_INVALID');      // an excluded crossing only changes the numbers, so the numbers must be asked for
  const needsPaths=countsRaw!==false||via.length>0;
  let start=null,target=null,counts=[],shown=[],total=null;
  if(needsPaths){
    if(!Object.hasOwn(pointsByName,lat.from??'A')&&!Array.isArray(lat.from))bad('LATTICE_ENDPOINT_INVALID');
    if(!Object.hasOwn(pointsByName,lat.to??'B')&&!Array.isArray(lat.to))bad('LATTICE_ENDPOINT_INVALID');
    start=resolve(lat.from??'A','LATTICE_ENDPOINT_INVALID');target=resolve(lat.to??'B','LATTICE_ENDPOINT_INVALID');
    const sx=Math.sign(target[0]-start[0]),sy=Math.sign(target[1]-start[1]);
    if(sx===0&&sy===0)bad('LATTICE_ENDPOINT_INVALID');
    if(absent.length&&(roadsAt.get(key(...start))===0||roadsAt.get(key(...target))===0))bad('LATTICE_ABSENT_ENDPOINT_ISOLATED');
    if(excludedSet.has(key(...start))||excludedSet.has(key(...target)))bad('LATTICE_EXCLUDE_ENDPOINT');
    if(via.some(e=>excludedSet.has(key(e[0],e[1]))||excludedSet.has(key(e[2],e[3]))))bad('LATTICE_EXCLUDE_VIA_CONFLICT');
    const lo=[Math.min(start[0],target[0]),Math.min(start[1],target[1])],hi=[Math.max(start[0],target[0]),Math.max(start[1],target[1])];
    for(const n of excluded){                                // an excluded crossing must be one the counted paths could cross and one a road reaches (else its 0 would float)
      if(n[0]<lo[0]||n[0]>hi[0]||n[1]<lo[1]||n[1]>hi[1]||roadsAt.get(key(...n))===0)bad('LATTICE_EXCLUDE_INVALID');
    }
    // a via road is walked in the direction of the shortest paths; it must lie inside the start-target rectangle
    via=via.map(e=>{
      const a=[e[0],e[1]],b=[e[2],e[3]];
      if(a[0]<lo[0]||a[1]<lo[1]||b[0]<lo[0]||b[1]<lo[1]||a[0]>hi[0]||a[1]>hi[1]||b[0]>hi[0]||b[1]>hi[1])bad('LATTICE_VIA_UNREACHABLE');
      const forward=(b[0]-a[0])*sx>0||(b[1]-a[1])*sy>0;
      return forward?e:[e[2],e[3],e[0],e[1]];
    });
    const viaBit=new Map(via.map((e,i)=>[normEdge([e[0],e[1]],[e[2],e[3]]).join(','),1<<i]));
    const full=(1<<via.length)-1,size=full+1;
    const nodes=[];
    for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)nodes.push([x,y]);
    const progress=n=>Math.abs(n[0]-start[0])+Math.abs(n[1]-start[1]);
    nodes.sort((p,q)=>progress(p)-progress(q));
    const moves=n=>{
      const out=[];
      if(sx!==0&&n[0]!==target[0])out.push([n[0]+sx,n[1]]);
      if(sy!==0&&n[1]!==target[1])out.push([n[0],n[1]+sy]);
      if(excludedSet.has(key(...n)))return [];
      return out.filter(m=>!forbiddenSet.has(normEdge(n,m).join(','))&&!absentSet.has(normEdge(n,m).join(','))&&!excludedSet.has(key(...m)));
    };
    const fwd=new Map(nodes.map(n=>[key(...n),new Array(size).fill(0)]));
    const bwd=new Map(nodes.map(n=>[key(...n),new Array(size).fill(0)]));
    fwd.get(key(...start))[0]=1;bwd.get(key(...target))[0]=1;
    for(const n of nodes)for(const m of moves(n)){
      const bit=viaBit.get(normEdge(n,m).join(','))??0;
      for(let a=0;a<size;a++)if(fwd.get(key(...n))[a]&&!(a&bit&&bit))fwd.get(key(...m))[a|bit]+=fwd.get(key(...n))[a];
    }
    for(const n of [...nodes].reverse())for(const m of moves(n)){
      const bit=viaBit.get(normEdge(n,m).join(','))??0;
      for(let s=0;s<size;s++)if(bwd.get(key(...m))[s]&&!(s&bit&&bit))bwd.get(key(...n))[s|bit]+=bwd.get(key(...m))[s];
    }
    total=fwd.get(key(...target))[full];
    if(!(total>0))bad('LATTICE_NO_PATH');
    for(const n of nodes){
      let c=0;
      for(let a=0;a<size;a++)if(fwd.get(key(...n))[a]&&bwd.get(key(...n))[full^a]>0)c+=fwd.get(key(...n))[a];
      if(c>0)counts.push([n[0],n[1],c]);
    }
    counts.sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
    // an excluded crossing is written 0 (it has no count of its own: no counted path reaches it)
    const zero=excluded.map(n=>[n[0],n[1],0]);
    if(countsRaw===true)shown=counts.filter(c=>!(hideTarget&&c[0]===target[0]&&c[1]===target[1])).concat(zero);
    else if(Array.isArray(countsRaw)){
      const want=new Set(countsRaw.map(ref=>key(...resolve(ref,'LATTICE_COUNTS_INVALID'))));
      shown=counts.filter(c=>want.has(key(c[0],c[1]))&&!(hideTarget&&c[0]===target[0]&&c[1]===target[1])).concat(zero.filter(c=>want.has(key(c[0],c[1]))));
      if(want.size!==countsRaw.length)bad('LATTICE_COUNTS_INVALID');
    }
    if(zero.length)shown.sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
  }
  for(const name of Object.keys(pointsByName))if(roadsAt.get(key(...pointsByName[name]))===0)bad('LATTICE_ABSENT_POINT_ISOLATED');   // a named point that no road reaches would float
  let path=null;
  if(lat.highlightPath!==undefined){
    if(!Array.isArray(lat.highlightPath)||lat.highlightPath.length<2||lat.highlightPath.length>MAX_PATH)bad('LATTICE_HIGHLIGHT_PATH_INVALID');
    path=lat.highlightPath.map(ref=>resolve(ref,'LATTICE_HIGHLIGHT_PATH_INVALID'));
    if(path.some(n=>excludedSet.has(key(...n))))bad('LATTICE_EXCLUDE_PATH_CONFLICT');
    const edges=new Set();
    for(let i=1;i<path.length;i++){
      if(!adjacent(path[i-1],path[i]))bad('LATTICE_HIGHLIGHT_PATH_INVALID');
      const k=normEdge(path[i-1],path[i]).join(',');
      if(absentSet.has(k))bad('LATTICE_ABSENT_CONFLICT');
      if(edges.has(k)||forbiddenSet.has(k))bad('LATTICE_HIGHLIGHT_PATH_INVALID');
      edges.add(k);
    }
  }
  return {schemaVersion:MODEL_VERSION,cols,rows,
    points:Object.keys(pointsByName).sort().map(name=>({name,x:pointsByName[name][0],y:pointsByName[name][1]})),
    start,target,forbidden,via,counts,shown,total,path,hideTargetCount:hideTarget,
    ...(absent.length?{absent}:{}),...(excluded.length?{excluded}:{})};
}

// --- geometry --------------------------------------------------------------------------------------------------------------------------------
const SAFE=12,MX=46,MY=42,MAX_W=470,MAX_H=300,MAX_U=64;
const STYLE={
  road:'stroke="#555" stroke-width="1.6" fill="none"',
  forbidden:'stroke="#8a8a8a" stroke-width="1.6" fill="none" stroke-dasharray="2 5"',
  via:'stroke="#111" stroke-width="4" fill="none"',
  path:'stroke="#111" stroke-width="3" fill="none" stroke-dasharray="9 5"',
  point:'fill="#111" stroke="none"'
};
const unitOf=model=>Math.min(MAX_U,Math.floor(MAX_W/model.cols),Math.floor(MAX_H/model.rows));
const L=(id,role,cls,x1,y1,x2,y2,data,layer)=>({t:'line',id,role,cls,x1:r6(x1),y1:r6(y1),x2:r6(x2),y2:r6(y2),data,layer});
const math=(id,role,owner,tex,ax,ay,x,y,extra)=>({id,role,owner,kind:'MATH',tex,anchor:{x:r6(x),y:r6(y),ax,ay},extra});
function buildSpec(model){
  const u=unitOf(model),{cols,rows}=model;
  const X=i=>MX+i*u,Y=j=>MY+(rows-j)*u;
  const forb=new Set(model.forbidden.map(e=>e.join(','))),via=new Set(model.via.map(e=>normEdge([e[0],e[1]],[e[2],e[3]]).join(',')));
  const absent=new Set((model.absent??[]).map(e=>e.join(','))),excluded=new Set((model.excluded??[]).map(n=>key(...n)));
  const prims=[],labels=[];
  const road=(a,b)=>{
    const e=normEdge(a,b),k=e.join(',');
    if(absent.has(k))return;                                  // a road that does not exist is not drawn
    const role=forb.has(k)?'road-forbidden':via.has(k)?'road-via':'road',cls=role==='road-forbidden'?'forbidden':role==='road-via'?'via':'road';
    prims.push(L(`road-${e.join('-')}`,role,cls,X(e[0]),Y(e[1]),X(e[2]),Y(e[3]),{edge:e.join(',')},role==='road-via'?35:30));
  };
  for(let x=0;x<=cols;x++)for(let y=0;y<=rows;y++){if(x<cols)road([x,y],[x+1,y]);if(y<rows)road([x,y],[x,y+1]);}
  if(model.path)prims.push({t:'polyline',id:'path',role:'path',cls:'path',points:model.path.map(([x,y])=>[r6(X(x)),r6(Y(y))]),data:{vertices:model.path.map(p=>p.join(',')).join(' ')},layer:40});
  for(const p of model.points)prims.push({t:'circle',id:`point-${p.name}`,role:'point',cls:'point',cx:r6(X(p.x)),cy:r6(Y(p.y)),r:3.6,data:{name:p.name,node:`${p.x},${p.y}`},layer:70});
  for(const p of model.points){
    const outward=[];
    if(p.x===0)outward.push('L');if(p.x===cols)outward.push('R');if(p.y===0)outward.push('D');if(p.y===rows)outward.push('U');
    labels.push({...math(`name-${p.name}`,'point-name',`point-${p.name}`,p.name,'start','top',X(p.x),Y(p.y),{name:p.name}),candidates:[...outward.map(d=>[d,9]),...['DR','DL','UR','UL'].map(d=>[d,7]),...['R','L','D','U'].map(d=>[d,9])]});
  }
  for(const [x,y,c] of model.shown){
    const zero=excluded.has(key(x,y));
    labels.push({...math(`count-${x}-${y}`,zero?'count-excluded':'count',`road-node-${x}-${y}`,zero?EXCLUDED_TEX:String(c),'start','top',X(x),Y(y),{node:`${x},${y}`,count:c}),...(zero?{color:EXCLUDED_COLOR}:{}),candidates:['UL','UR','DL','DR'].map(d=>[d,5])});
  }
  return {size:{width:cols*u+2*MX,height:rows*u+2*MY},u,prims,labels};
}
export function latticePathSpec(plan,model){
  if(plan?.capability!==FIGURE_CAPABILITY||!isPlain(plan.lattice))bad('LATTICE_PLAN_INVALID');
  if(objectSha(solveLattice(plan.lattice))!==objectSha(model))bad('LATTICE_MODEL_MISMATCH');
  return {schemaVersion:SPEC_VERSION,...buildSpec(model)};
}
export const latticePathSize=model=>({...buildSpec(model).size});
export function checkLatticePathPlan(plan){
  onlyKeys(plan,TOP_KEYS,'LATTICE_PLAN_INVALID');
  if(plan.capability!==FIGURE_CAPABILITY)bad('LATTICE_PLAN_INVALID');
  return solveLattice(plan.lattice);
}

// --- composing ---------------------------------------------------------------------------------------------------------------------------------
const fmt=n=>String(r6(n));
function printPrim(p){
  const data=Object.entries(p.data??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join(''),head=`id="${p.id}" data-role="${p.role}"${data}`,style=STYLE[p.cls];
  let tag;
  switch(p.t){
    case 'line':tag=`<line ${head} x1="${fmt(p.x1)}" y1="${fmt(p.y1)}" x2="${fmt(p.x2)}" y2="${fmt(p.y2)}" ${style}/>`;break;
    case 'polyline':tag=`<polyline ${head} points="${p.points.map(([x,y])=>fmt(x)+','+fmt(y)).join(' ')}" ${style}/>`;break;
    case 'circle':tag=`<circle ${head} cx="${fmt(p.cx)}" cy="${fmt(p.cy)}" r="${p.r}" ${style}/>`;break;
    default:throw Error('LATTICE_PRIMITIVE_UNKNOWN');
  }
  return `<g data-layer="${p.layer}">${tag}</g>`;
}
const grow=(b,m)=>({x:b.x-m,y:b.y-m,width:b.width+2*m,height:b.height+2*m});
function segmentHitsRect(x1,y1,x2,y2,b){
  let t0=0,t1=1;const dx=x2-x1,dy=y2-y1;
  for(const [p,q] of [[-dx,x1-b.x],[dx,b.x+b.width-x1],[-dy,y1-b.y],[dy,b.y+b.height-y1]]){
    if(p===0){if(q<0)return false;}
    else{const r=q/p;if(p<0){if(r>t1)return false;if(r>t0)t0=r;}else{if(r<t0)return false;if(r<t1)t1=r;}}
  }
  return t0<=t1;
}
const circleHitsRect=(cx,cy,r,b)=>{const x=Math.min(Math.max(cx,b.x),b.x+b.width),y=Math.min(Math.max(cy,b.y),b.y+b.height);return Math.hypot(x-cx,y-cy)<=r;};
function primitiveHit(box,prims){
  for(const prim of prims){
    if(prim.t==='circle'){if(circleHitsRect(prim.cx,prim.cy,prim.r,box))return prim.id;continue;}
    const pts=prim.t==='line'?[[prim.x1,prim.y1],[prim.x2,prim.y2]]:prim.points;
    for(let i=0;i<pts.length-1;i++)if(segmentHitsRect(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],box))return prim.id;
  }
  return null;
}
// a candidate box beside the anchor point: L/R/U/D straight out, DR/DL/UR/UL on the diagonal (the roads run along the axes, so a diagonal box clears them)
function candidateBox(dir,gap,x,y,w,h){
  const cx=dir.includes('R')?x+gap:dir.includes('L')?x-gap-w:x-w/2,cy=dir.includes('D')?y+gap:dir.includes('U')?y-gap-h:y-h/2;
  return {x:r6(cx),y:r6(cy),width:w,height:h};
}
/** Typeset every label, place it at the first candidate that stays inside the figure, off every line and off every placed label, build the SVG, run the observer and the rendered layout check. */
export async function composeLatticePathFigure({plan,model,identity,typographyPolicy,browser}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:status==='COMPOSED'?'construction-candidate-svg-v1':SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=latticePathSpec(plan,model);}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='LATTICE_MODEL_MISMATCH'?error.message:'LATTICE_SPEC_ERROR',{code:error.message});}
    lineage.specSha256=objectSha(JSON.parse(JSON.stringify(spec)));
    const typeset=typesetter(),font=typographyPolicy.baseFontPx,{width,height}=spec.size,placed=[];
    for(const label of spec.labels){
      let fragment;
      try{fragment=typeset({id:label.id,owner:label.owner,factRole:'DERIVED_INTERMEDIATE',fontPx:font,panelId:'lattice-path',kind:'MATH',tex:label.tex},identity);}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('LATTICE_TYPESET_ERROR',{labelId:label.id,code:error.message});}
      const w=fragment.intrinsic.width,h=fragment.intrinsic.height,{x,y}=label.anchor;
      let chosen=null;
      for(const [dir,gap] of label.candidates){
        const box=candidateBox(dir,gap,x,y,w,h);
        if(box.x<SAFE||box.y<SAFE||box.x+w>width-SAFE||box.y+h>height-SAFE)continue;
        if(placed.some(o=>overlaps(grow(box,2),o.box)))continue;
        if(primitiveHit(grow(box,1.5),spec.prims)!==null)continue;
        chosen=box;break;
      }
      if(chosen===null)throw new Stop('LATTICE_LABEL_NO_ROOM',{labelId:label.id,size:{width,height}});
      placed.push({label,fragment,box:chosen});
    }
    lineage.fragmentSha256s=Object.fromEntries(placed.map(item=>[item.label.id,item.fragment.fragmentSha256]));
    let body=`<rect width="${width}" height="${height}" fill="#fff"/>`;
    for(const prim of [...spec.prims].sort((a,b)=>a.layer-b.layer))body+=printPrim(prim);
    for(const {label,fragment,box} of placed){
      const extra=Object.entries(label.extra??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join('');
      body+=`<g data-layer="90"><g id="${label.id}" data-label-kind="COORDINATE_LABEL" data-label-role="${label.role}" data-priority="0" data-font-px="${font}" data-owner="${label.owner}"${extra} data-tex="${esc(label.tex)}"${label.color?` color="${label.color}"`:''} data-fragment-sha="${fragment.fragmentSha256}" data-box="${box.x},${box.y},${box.width},${box.height}" transform="translate(${box.x} ${box.y})">${fragment.svg}</g></g>`;
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" data-lattice-path="${FIGURE_CAPABILITY}" data-cols="${model.cols}" data-rows="${model.rows}" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="${SAFE}" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    if(process.env.APMS_DRAFT_DIR)(await import('node:fs')).writeFileSync(process.env.APMS_DRAFT_DIR+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-lattice-path-'+Date.now()+'.svg',svg);
    let response;
    try{response=await pythonWorker({lattice:plan.lattice,svg},{script:OBSERVER_SCRIPT});}catch(error){throw new Stop('WORKER_ERROR',{stage:'latticePathAudit',code:String(error?.message??error)});}
    if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'latticePathAudit',code:response?.result?.code??null});
    const audit=response.result;lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')throw new Stop('LATTICE_PATH_STATIC_AUDIT_FAIL',{errors});
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('LATTICE_PATH_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
