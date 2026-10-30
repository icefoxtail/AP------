// Callouts (E37): a segment path, or an angle, pulled out of a plane figure and drawn again beside it, bigger, in the same picture.
// planeMarks.callouts:[{id,kind,...}] writes the pulled-out piece as extra points (the same names), segments and marks standing next to the main figure, so a short
// segment with several dimension lines, or a narrow angle with its arcs and labels, has room to be read. The main figure is unchanged.
//   kind SEGMENT: path:[ids] (2-6 displayed points) is straightened into one line, `scale` times as long (lengths only; default 1), horizontal (default) or vertical;
//                 dimensions:[...] are dimension lines between the path's own points (ids as in the main figure, offset AUTO stacks the tiers),
//                 marks:{equalLengths:[{id,count,segments:[[a,b],...]}],expressionLabels:[{id,segment:[a,b],text,...}]} mark its pieces.
//   kind ANGLE:   vertex + rays:[ids] (2-5 displayed points) is drawn again as a fan of rays of one length `radius` (model units) from the vertex, every direction unchanged
//                 (only lengths are enlarged, so every angle is the original's); angles:[{id,refs:[a,vertex,b],...}] are the angle marks of the fan (value, equal marks, labels).
//   at RIGHT (default) | LEFT | ABOVE | BELOW: the side of the main figure it stands on; gap (model units) is the clear space between them.
//   link: SEGMENT "ENDS" / ANGLE "VERTEX" joins the main figure's points to their copies with light dotted guide lines.
// The copies are real points of the picture named `<callout id>__<point id>`; its marks are the ordinary plane marks, written on the copies and checked by the same code
// (planeMarkSpec) and by the independent observer, which also reads the copies back against the main figure's own points.
import {planeMarkSpec,dimensionSites,PLANE_RECIPE,isPlaneFigure} from './plane-marks.mjs';
export const CALLOUT_KINDS=['SEGMENT'];
export const CALLOUT_SIDES=['RIGHT','LEFT','ABOVE','BELOW'];
export const CALLOUT_ORIENTATIONS=['HORIZONTAL','VERTICAL'];
export const CALLOUT_LINKS={SEGMENT:['NONE','ENDS']};
export const CALLOUT_MAX=3,CALLOUT_PATH_MAX=6;
export const CALLOUT_SCALE_MIN=0.5,CALLOUT_SCALE_MAX=4;
export const CALLOUT_SEP='__';
export const CALLOUT_ID=/^[A-Za-z][A-Za-z0-9]{0,7}$/;
const KEYS={SEGMENT:['id','kind','path','at','scale','gap','orientation','link','dimensions','marks'],marks:['equalLengths','expressionLabels']};
const bad=code=>{throw Error(code);};
const sub=(p,q)=>[p[0]-q[0],p[1]-q[1]];
const norm=v=>Math.hypot(v[0],v[1]);
const isObject=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const numberOf=value=>{const n=typeof value==='string'&&value.trim()!==''?Number(value):value;return typeof n==='number'&&Number.isFinite(n)?n:null;};
const MARK_ID_KEYS=['angles','equalLengths','parallels','expressionLabels','arcs','traces','regions','dimensions','pathLabels','textLabels','angleSums','commonSides'];

/** The callout rows of a plan ([] without any). */
export const calloutRows=plan=>Array.isArray(plan?.planeMarks?.callouts)?plan.planeMarks.callouts:[];
/** The point ids a plan's callouts draw (their copies), from the plan alone: `<callout id>__<point id>`. */
export const calloutPointIds=plan=>calloutRows(plan).flatMap(row=>isObject(row)&&typeof row.id==='string'&&Array.isArray(row.path)?row.path.filter(id=>typeof id==='string').map(id=>row.id+CALLOUT_SEP+id):[]);
/** The scoped id of a callout's own point, segment or mark. */
export const calloutScopedId=(calloutId,id)=>calloutId+CALLOUT_SEP+id;

/** Where the whole offsets set goes so that its box stands on side `at` of the main figure's box with `gap` between them: the translation of the offsets' origin. */
function place(offsets,at,gap,bounds){
  const xs=offsets.map(o=>o[0]),ys=offsets.map(o=>o[1]);
  const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys),w=maxx-minx,h=maxy-miny;
  const cx=(bounds.xMin+bounds.xMax)/2,cy=(bounds.yMin+bounds.yMax)/2;
  const bx0=at==='RIGHT'?bounds.xMax+gap:at==='LEFT'?bounds.xMin-gap-w:cx-w/2;
  const by0=at==='ABOVE'?bounds.yMax+gap:at==='BELOW'?bounds.yMin-gap-h:cy-h/2;
  return [bx0-minx,by0-miny];
}

/**
 * The checked callouts of a plan, with every copy placed: [{id,kind,row,prefix,order,local,pieces,guides,scale,subPlan,subPoints,segmentIds}].
 * `points` are the displayed points of the main figure (id -> {approximation}); `bounds` {xMin,xMax,yMin,yMax} is the main figure's box (displayed points and extras, before any callout);
 * `hidden` the ids the plan draws without a name. Throws an UPPER_SNAKE code.
 */
export function calloutEntries(plan,points,bounds,hidden=new Set()){
  const rows=plan?.planeMarks?.callouts;
  if(rows===undefined)return [];
  if(!Array.isArray(rows)||!rows.length||rows.length>CALLOUT_MAX)bad('CALLOUTS_INVALID');
  if(!isPlaneFigure(plan))bad('CALLOUT_REQUIRES_PLANE_FIGURE');
  const taken=new Set([...(plan.displaySegments||[]).map(s=>s.id),...(plan.rightAngles||[]).map(s=>s.id),...plan.mathPlan.nodes.map(n=>n.id)]);
  for(const key of MARK_ID_KEYS)for(const row of Array.isArray(plan.planeMarks[key])?plan.planeMarks[key]:[])if(row&&typeof row.id==='string')taken.add(row.id);
  const seen=new Set();
  return rows.map(row=>{
    if(!isObject(row)||typeof row.id!=='string'||!CALLOUT_ID.test(row.id))bad('CALLOUT_ID_INVALID');
    const cid=row.id,prefix=cid+CALLOUT_SEP;
    if(seen.has(cid)||[...taken].some(id=>id===cid||id.startsWith(prefix)))bad('CALLOUT_ID_DUPLICATE:'+cid);
    seen.add(cid);
    if(!CALLOUT_KINDS.includes(row.kind))bad('CALLOUT_KIND_INVALID:'+cid);
    for(const key of Object.keys(row))if(!KEYS[row.kind].includes(key))bad('CALLOUT_FIELD_INVALID:'+cid+'.'+key);
    const at=row.at??'RIGHT';
    if(!CALLOUT_SIDES.includes(at))bad('CALLOUT_AT_INVALID:'+cid);
    const link=row.link??'NONE';
    if(!CALLOUT_LINKS[row.kind].includes(link))bad('CALLOUT_LINK_INVALID:'+cid);
    const main=id=>{
      if(typeof id!=='string'||!points[id])bad('MARK_TARGET_UNKNOWN:'+id);
      if(hidden.has(id))bad('CALLOUT_POINT_HIDDEN:'+cid+':'+id);
      return points[id].approximation;
    };
    const span=Math.max(bounds.xMax-bounds.xMin,bounds.yMax-bounds.yMin,1e-9);
    const gap=row.gap===undefined?0.3*span:numberOf(row.gap);
    if(gap===null||!(gap>0)||gap>10*span)bad('CALLOUT_GAP_INVALID:'+cid);
    const entry={id:cid,kind:row.kind,row,prefix,at,link,local:{},order:[],pieces:[],guides:[]};
    // ---- the geometry of the copies
    if(row.kind==='SEGMENT'){
      const path=row.path;
      if(!Array.isArray(path)||path.length<2||path.length>CALLOUT_PATH_MAX||path.some(id=>typeof id!=='string')||new Set(path).size!==path.length)bad('CALLOUT_PATH_INVALID:'+cid);
      const coords=path.map(main),lengths=coords.slice(1).map((p,i)=>norm(sub(p,coords[i])));
      if(lengths.some(length=>!(length>1e-9)))bad('CALLOUT_PATH_DEGENERATE:'+cid);
      const scale=row.scale===undefined?1:numberOf(row.scale);
      if(scale===null||scale<CALLOUT_SCALE_MIN||scale>CALLOUT_SCALE_MAX)bad('CALLOUT_SCALE_INVALID:'+cid);
      const orientation=row.orientation??'HORIZONTAL';
      if(!CALLOUT_ORIENTATIONS.includes(orientation))bad('CALLOUT_ORIENTATION_INVALID:'+cid);
      // the pulled-out line runs the way the path runs on the page: left to right when the path's end is to the right of its start (horizontal), downwards when it goes down (vertical)
      const chord=sub(coords[coords.length-1],coords[0]);
      const direction=orientation==='HORIZONTAL'?[chord[0]>=0?1:-1,0]:[0,chord[1]<=0?-1:1];
      const offsets=[[0,0]];let run=0;
      for(const length of lengths){run+=length*scale;offsets.push([direction[0]*run,direction[1]*run]);}
      const shift=place(offsets,at,gap,bounds);
      path.forEach((id,i)=>{entry.local[id]=[offsets[i][0]+shift[0],offsets[i][1]+shift[1]];});
      entry.order=[...path];entry.scale=scale;entry.mainLengths=lengths;
      entry.pieces=path.slice(1).map((id,i)=>({id:'s'+(i+1),from:path[i],to:id,mainLength:lengths[i]}));
      if(link==='ENDS')entry.guides=[path[0],path[path.length-1]].map((id,i)=>({id:'g'+(i+1),mainPoint:id,mainAt:coords[i?path.length-1:0]}));
    }
    // ---- the marks, written with the main figure's ids and moved onto the copies
    entry.segmentIds=new Set(entry.pieces.map(piece=>prefix+piece.id));
    const pieceOf=(pair,where,id)=>{
      if(!Array.isArray(pair)||pair.length!==2||pair.some(v=>typeof v!=='string'))bad('CALLOUT_SEGMENT_UNKNOWN:'+cid+'.'+where+':'+id);
      const piece=entry.pieces.find(p=>(p.from===pair[0]&&p.to===pair[1])||(p.from===pair[1]&&p.to===pair[0]));
      if(!piece)bad('CALLOUT_SEGMENT_UNKNOWN:'+cid+'.'+where+':'+id);
      return prefix+piece.id;
    };
    const inside=(id,where,rowId)=>{if(typeof id!=='string'||!(id in entry.local))bad('CALLOUT_TARGET_UNKNOWN:'+cid+'.'+where+':'+rowId);return prefix+id;};
    const marks={};
    const list=(value,where)=>{if(value===undefined)return [];if(!Array.isArray(value))bad('CALLOUT_FIELD_INVALID:'+cid+'.'+where);return value;};
    const object=(value,where)=>{if(!isObject(value))bad('CALLOUT_FIELD_INVALID:'+cid+'.'+where);return value;};
    const dimensions=list(row.dimensions,'dimensions').map(d=>{
      object(d,'dimensions');
      const from=inside(d.from,'dimensions',d.id),to=inside(d.to,'dimensions',d.id);
      if(d.from===d.to)bad('CALLOUT_TARGET_UNKNOWN:'+cid+'.dimensions:'+d.id);
      const out={...d,id:prefix+d.id,from,to};
      if(d.value!==undefined){
        // a declared value is the length on the page (the main figure's path between the two points); the copy is `scale` times as long
        const i=entry.order.indexOf(d.from),j=entry.order.indexOf(d.to),declared=numberOf(d.value);
        const main=entry.mainLengths.slice(Math.min(i,j),Math.max(i,j)).reduce((s,v)=>s+v,0);
        if(declared===null||declared<=0)bad('MARK_FIELD_INVALID:dimensions.value:'+d.id);
        if(Math.abs(declared-main)>1e-6*Math.max(1,declared))bad('CALLOUT_DIMENSION_FACT_MISMATCH:'+cid+'.'+d.id+':declared='+declared+':main='+Number(main.toFixed(6)));
        out.value=declared*entry.scale;
      }
      return out;
    });
    if(dimensions.length)marks.dimensions=dimensions;
    const extra=row.marks===undefined?{}:object(row.marks,'marks');
    for(const key of Object.keys(extra))if(!KEYS.marks.includes(key))bad('CALLOUT_FIELD_INVALID:'+cid+'.marks.'+key);
    const equal=list(extra.equalLengths,'marks.equalLengths').map(e=>{
      object(e,'marks.equalLengths');
      return {...e,id:prefix+e.id,segments:list(e.segments,'marks.equalLengths.segments').map(pair=>pieceOf(pair,'marks.equalLengths',e.id))};
    });
    if(equal.length)marks.equalLengths=equal;
    const labels=list(extra.expressionLabels,'marks.expressionLabels').map(x=>{
      object(x,'marks.expressionLabels');
      const {segment,...rest}=x;
      return {...rest,id:prefix+x.id,ownerSegment:pieceOf(segment,'marks.expressionLabels',x.id)};
    });
    if(labels.length)marks.expressionLabels=labels;
    // ---- the scoped plan the ordinary mark code checks: its points are the copies, its segments the pieces
    entry.subPoints=Object.fromEntries(Object.entries(entry.local).map(([id,at2])=>[prefix+id,{approximation:at2}]));
    entry.subPlan={mathPlan:{realization:{recipeId:PLANE_RECIPE},nodes:Object.keys(entry.local).map(id=>({id:prefix+id}))},
      displaySegments:entry.pieces.map(piece=>({id:prefix+piece.id,refs:[prefix+piece.from,prefix+piece.to]})),planeMarks:marks};
    return entry;
  });
}

/** The model points the copies stand at, for the plane frame. */
export const calloutExtentPoints=entries=>entries.flatMap(entry=>Object.values(entry.local).map(at=>[at[0],at[1]]));

/** The dimension sites of every callout's own dimension lines (the frame leaves room for them like for the main figure's). */
export const calloutDimensionSites=entries=>entries.flatMap(entry=>dimensionSites(entry.subPlan,entry.subPoints));

/**
 * The spec objects of the callouts: the copies (a point with the main point's display name, so the picture shows the same name), the pieces, the guide lines, and the marks
 * the ordinary plane-mark code builds on the copies. Returns {objects,factRolesByLabel}.
 */
export function calloutSpec(plan,model,entries,pointNames){
  const objects=[],factRolesByLabel={};
  for(const entry of entries){
    const {prefix}=entry;
    for(const [id,at] of Object.entries(entry.local)){
      objects.push({id:prefix+id,kind:'POINT',at:[at[0],at[1]],name:pointNames.tex(id)});
      const node=plan.mathPlan.nodes.find(n=>n.id===id);
      factRolesByLabel[prefix+id+'-name']=node?.factRole??'GIVEN';
    }
    for(const piece of entry.pieces)objects.push({id:prefix+piece.id,kind:'SEGMENT',from:[...entry.local[piece.from]],to:[...entry.local[piece.to]]});
    for(const guide of entry.guides)objects.push({id:prefix+guide.id,kind:'SEGMENT',from:[...guide.mainAt],to:[...entry.local[guide.mainPoint]],guide:true});
    const built=planeMarkSpec(entry.subPlan,model,entry.subPoints,entry.segmentIds);
    objects.push(...built.objects);Object.assign(factRolesByLabel,built.factRolesByLabel);
  }
  return {objects,factRolesByLabel};
}
