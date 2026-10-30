// Plane-figure region fills (middle-school stage 2a): `planeMarks.regions` colours a region that is exactly bounded by an ordered chain of
// straight edges and circular arcs between displayed points. The region is declared as shapes (a polygon, a sector, a circular segment or a free
// loop) minus holes; the fill rule is even-odd, so a hole must lie inside the shapes. Every edge must already be drawn (a displayed segment, line,
// circle or highlighted arc), because the fill only colours what the picture bounds. The independent check of the FINAL SVG is the `regions`
// section of plane-marks-observer-worker.py, which recomputes the boundary from the Cindy peer's points.
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,31}$/;
const KEYS={region:['id','fill','pattern','label','labelKind','labelName','unit','labelPlacement','labelAt','factRole','shapes','holes'],shape:['polygon','sector','segment','loop'],sector:['center','from','to','side'],loop:['start','steps'],step:['to','arc'],arc:['center','side']};
const FILLS=['LIGHT','MEDIUM'];
// A source that says 빗금친 (hatched) needs a real hatch pattern, not a second grey: PATTERNS adds diagonal strokes clipped to the region.
const PATTERNS=['HATCH'];
const LABEL_KINDS=['MATH','TEXT'];
// labelPlacement (E32): AUTO (default) writes the label inside the region where it has the most room; LEADER writes it OUTSIDE the region on a leader that starts on
// the region's outer boundary (a region cut into small cells by drawn lines, or too narrow to hold its value); AUTO_LEADER tries inside first and falls back to the leader.
export const REGION_LABEL_PLACEMENTS=['AUTO','LEADER','AUTO_LEADER'];
// labelName / unit (E32): the region's name and the unit of its value are written with it as one plain-text label, 부채꼴 AOB=40cm². The value is a short
// expression (digits, letters, pi, + - * and brackets); a unit with a power is written cm^2.
export const REGION_LABEL_UNITS=['cm','m','mm','kg','cm^2','m^2','mm^2','cm^3','m^3','mm^3'];
const REGION_VALUE=/^[0-9A-Za-z+\-*().,\s\u03C0]{1,24}$/u;
const SUPERSCRIPTS={2:'\u00B2',3:'\u00B3'};
/** The value of a region label as printed text: pi -> π, - -> the minus sign, * -> ×; a slash (a fraction) is refused because the label is one text line. */
export function regionValueText(value){
  if(typeof value!=='string'||!REGION_VALUE.test(value)||!value.trim())return null;
  return value.trim().replace(/pi/gu,'\u03C0').replace(/-/gu,'\u2212').replace(/\*/gu,'\u00D7').replace(/\s+/gu,' ');
}
export const regionUnitText=unit=>{const m=/^([a-z]+)(?:\^([23]))?$/u.exec(String(unit));return m?m[1]+(m[2]?SUPERSCRIPTS[m[2]]:''):null;};
/** The whole text of a name/unit region label: name=value+unit (a space before the unit only when the value ends in a letter), e.g. △ABC=6cm², 부채꼴 AOB=40cm². */
export function regionLabelText(row){
  const value=regionValueText(row.label);if(value===null)return null;
  const unit=row.unit===undefined?'':regionUnitText(row.unit);
  return (row.labelName===undefined?'':row.labelName+'=')+value+(unit?(/[A-Za-z\u03C0]$/u.test(value)?' ':'')+unit:'');
}
const SIDES=['MINOR','MAJOR','CCW','CW','FULL'];
const FACT_ROLES=['GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'];
const bad=code=>{throw Error(code);};
const keysOk=(row,allowed,where)=>{for(const key of Object.keys(row))if(!allowed.includes(key))bad('REGION_FIELD_UNKNOWN:'+where+'.'+key);};
const isObject=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const sub=(p,q)=>[p[0]-q[0],p[1]-q[1]];
const norm=v=>Math.hypot(v[0],v[1]);
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const ARC_STEP_DEGREES=1.5;

// Resolve one loop: validates the chain and returns {start, steps:[{to, arc?:{center, sweep, angle}}], dense:[[x,y]...]}.
function resolveLoop(loop,at,id){
  if(!isObject(loop))bad('REGION_FIELD_INVALID:loop:'+id);
  keysOk(loop,KEYS.loop,'loop');
  if(typeof loop.start!=='string')bad('REGION_FIELD_INVALID:loop.start:'+id);
  if(!Array.isArray(loop.steps)||loop.steps.length<1)bad('REGION_FIELD_INVALID:loop.steps:'+id);
  const steps=[],dense=[];
  let current=loop.start;dense.push(at(current));
  for(const step of loop.steps){
    if(!isObject(step))bad('REGION_FIELD_INVALID:step:'+id);
    keysOk(step,KEYS.step,'step');
    if(typeof step.to!=='string')bad('REGION_FIELD_INVALID:step.to:'+id);
    const from=at(current),to=at(step.to);
    const full=step.arc?.side==='FULL';
    if(full){
      // a whole circle: one point of it, back to itself (drawn as two half arcs)
      if(step.to!==current)bad('REGION_FIELD_INVALID:arc.side:'+id);
      if(typeof step.arc.center!=='string')bad('REGION_FIELD_INVALID:arc.center:'+id);
      const centre=at(step.arc.center),radius=norm(sub(from,centre));
      if(radius<=1e-9)bad('REGION_DEGENERATE_EDGE:'+id+':'+current);
      const a0=Math.atan2(from[1]-centre[1],from[0]-centre[0]),count=Math.ceil(360/ARC_STEP_DEGREES);
      for(let i=1;i<count;i++){const t=a0+2*Math.PI*i/count;dense.push([centre[0]+radius*Math.cos(t),centre[1]+radius*Math.sin(t)]);}
      dense.push(from);
      steps.push({to:step.to,arc:{center:step.arc.center,sweep:'CCW',full:true}});
      continue;
    }
    if(step.to===current||norm(sub(from,to))<1e-9)bad('REGION_DEGENERATE_EDGE:'+id+':'+current+'-'+step.to);
    if(step.arc===undefined){steps.push({to:step.to});dense.push(to);}
    else{
      if(!isObject(step.arc))bad('REGION_FIELD_INVALID:step.arc:'+id);
      keysOk(step.arc,KEYS.arc,'arc');
      if(typeof step.arc.center!=='string')bad('REGION_FIELD_INVALID:arc.center:'+id);
      const center=at(step.arc.center),radius=norm(sub(from,center));
      if(radius<=1e-9||Math.abs(norm(sub(to,center))-radius)>1e-6*Math.max(1,radius))bad('REGION_ARC_ENDPOINT_NOT_ON_CIRCLE:'+id+':'+current+'-'+step.to);
      const side=step.arc.side??'MINOR';
      if(!SIDES.includes(side))bad('REGION_FIELD_INVALID:arc.side:'+id);
      const ccw=(((Math.atan2(to[1]-center[1],to[0]-center[0])-Math.atan2(from[1]-center[1],from[0]-center[0]))%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
      let sweep;
      if(side==='CCW'||side==='CW')sweep=side;
      else{
        if(Math.abs(ccw-Math.PI)<1e-9)bad('REGION_ARC_SIDE_AMBIGUOUS:'+id+':'+current+'-'+step.to);
        const minorCcw=ccw<Math.PI;sweep=(side==='MAJOR')===minorCcw?'CW':'CCW';
      }
      const angle=sweep==='CCW'?ccw:2*Math.PI-ccw;
      const count=Math.max(8,Math.ceil(angle*180/Math.PI/ARC_STEP_DEGREES)),a0=Math.atan2(from[1]-center[1],from[0]-center[0]);
      for(let i=1;i<count;i++){const t=a0+(sweep==='CCW'?1:-1)*angle*i/count;dense.push([center[0]+radius*Math.cos(t),center[1]+radius*Math.sin(t)]);}
      dense.push(to);
      steps.push({to:step.to,arc:{center:step.arc.center,sweep}});
    }
    current=step.to;
  }
  if(current!==loop.start)bad('REGION_NOT_CLOSED:'+id+':'+current+'!='+loop.start);
  dense.pop();   // the last point repeats the start
  return {start:loop.start,steps,dense};
}

// A shape (polygon / sector / segment / loop) as an explicit loop.
function shapeLoop(shape,id){
  if(!isObject(shape))bad('REGION_FIELD_INVALID:shape:'+id);
  keysOk(shape,KEYS.shape,'shape');
  const keys=Object.keys(shape);
  if(keys.length!==1)bad('REGION_FIELD_INVALID:shape:'+id);
  const key=keys[0],value=shape[key];
  if(key==='loop')return value;
  if(key==='polygon'){
    if(!Array.isArray(value)||value.length<3||value.some(v=>typeof v!=='string')||new Set(value).size!==value.length)bad('REGION_FIELD_INVALID:polygon:'+id);
    return {start:value[0],steps:[...value.slice(1),value[0]].map(to=>({to}))};
  }
  if(!isObject(value))bad('REGION_FIELD_INVALID:'+key+':'+id);
  keysOk(value,KEYS.sector,key);
  if(['center','from','to'].some(k=>typeof value[k]!=='string'))bad('REGION_FIELD_INVALID:'+key+':'+id);
  const arc={center:value.center,...(value.side!==undefined?{side:value.side}:{})};
  if(key==='sector')return {start:value.center,steps:[{to:value.from},{to:value.to,arc},{to:value.center}]};
  if(key==='segment')return {start:value.from,steps:[{to:value.to,arc},{to:value.from}]};
  return bad('REGION_FIELD_INVALID:shape:'+id);
}

const area=dense=>{let s=0;for(let i=0;i<dense.length;i++){const a=dense[i],b=dense[(i+1)%dense.length];s+=a[0]*b[1]-b[0]*a[1];}return s/2;};
// 1 strictly inside, 0 on the boundary, -1 outside (tolerance relative to the polygon's size).
function locate(p,poly,eps){
  let inside=false;
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length],d=sub(b,a),len=norm(d);
    if(len>0){
      const t=Math.max(0,Math.min(1,((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/(len*len)));
      if(norm(sub(p,[a[0]+t*d[0],a[1]+t*d[1]]))<=eps)return 0;
    }
    if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;
  }
  return inside?1:-1;
}
function properCross(a,b,c,d,eps){
  const o1=cross(a,b,c),o2=cross(a,b,d),o3=cross(c,d,a),o4=cross(c,d,b);
  return ((o1>eps&&o2<-eps)||(o1<-eps&&o2>eps))&&((o3>eps&&o4<-eps)||(o3<-eps&&o4>eps));
}
const edgesOf=dense=>dense.map((p,i)=>[p,dense[(i+1)%dense.length]]);
const sizeOf=dense=>{const xs=dense.map(p=>p[0]),ys=dense.map(p=>p[1]);return Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys),1e-9);};

// --- edges must already be drawn: displayed segments / lines / circles / highlighted arcs
function drawnCover(plan,model,points,at){
  const segments=(plan.displaySegments||[]).map(s=>s.refs.map(r=>at(r)));
  const lines=(plan.displayLines||[]).map(id=>model.lines?.[id]?.approximation).filter(Array.isArray);
  const circles=(plan.displayCircles||[]).map(id=>model.circles?.[id]?.approximation).filter(Array.isArray);
  const marks=(plan.planeMarks?.arcs||[]).map(a=>{
    const circle=model.circles?.[a.circle]?.approximation;if(!circle)return null;
    try{return {resolved:resolveLoop({start:a.from,steps:[{to:a.to,arc:{center:a.center,side:a.side}},{to:a.from}]},at,'mark').steps[0].arc,center:at(a.center),from:at(a.from),to:at(a.to),r:circle[2]};}catch{return null;}
  }).filter(Boolean);
  return {segments,lines,circles,marks};
}
function lineEdgeDrawn(a,b,cover){
  const len=norm(sub(b,a)),eps=1e-6*Math.max(1,len),d=sub(b,a);
  for(const [l0,l1,l2] of cover.lines){const h=Math.hypot(l0,l1);if(h>0&&Math.abs(l0*a[0]+l1*a[1]+l2)/h<=eps&&Math.abs(l0*b[0]+l1*b[1]+l2)/h<=eps)return true;}
  const spans=[];
  for(const [p,q] of cover.segments){
    const e=sub(q,p),el=norm(e);if(el<=0)continue;
    const dist=pt=>Math.abs((pt[0]-p[0])*e[1]-(pt[1]-p[1])*e[0])/el;
    if(dist(a)>eps||dist(b)>eps)continue;
    const t=pt=>((pt[0]-a[0])*d[0]+(pt[1]-a[1])*d[1])/(len*len);
    const t0=t(p),t1=t(q);spans.push([Math.min(t0,t1),Math.max(t0,t1)]);
  }
  spans.sort((x,y)=>x[0]-y[0]);
  let reach=0;
  for(const [lo,hi] of spans){if(lo>reach+1e-6)break;reach=Math.max(reach,hi);}
  return reach>=1-1e-6;
}
function arcEdgeDrawn(from,to,arc,at,cover){
  const center=at(arc.center),r=norm(sub(from,center)),eps=1e-6*Math.max(1,r);
  if(cover.circles.some(c=>Math.hypot(c[0]-center[0],c[1]-center[1])<=eps&&Math.abs(c[2]-r)<=eps))return true;
  if(arc.full)return false;
  const angle=p=>Math.atan2(p[1]-center[1],p[0]-center[0]),two=2*Math.PI,mod=x=>((x%two)+two)%two;
  return cover.marks.some(m=>{
    if(Math.hypot(m.center[0]-center[0],m.center[1]-center[1])>eps||Math.abs(m.r-r)>eps)return false;
    const dir=m.resolved.sweep==='CCW'?1:-1,span=mod(dir*(angle(m.to)-angle(m.from)))||two;
    const t=p=>mod(dir*(angle(p)-angle(m.from)));
    // both ends and the middle of the region's arc lie within the drawn arc
    const dirR=arc.sweep==='CCW'?1:-1,spanR=mod(dirR*(angle(to)-angle(from)))||two,mid=angle(from)+dirR*spanR/2;
    return t(from)<=span+1e-9&&t(to)<=span+1e-9&&t([center[0]+Math.cos(mid),center[1]+Math.sin(mid)])<=span+1e-9;
  });
}

// Returns {objects, factRolesByLabel}; errors are REGION_* codes.
export function regionSpec(plan,model,points,usedIds){
  const regions=plan.planeMarks?.regions;
  if(regions===undefined)return {objects:[],factRolesByLabel:{}};
  if(!Array.isArray(regions))bad('REGION_FIELD_INVALID:regions');
  const at=id=>{const p=points[id];if(!p)bad('REGION_BOUNDARY_UNKNOWN:'+id);return p.approximation;};
  const cover=drawnCover(plan,model,points,at);
  const objects=[],factRolesByLabel={};
  for(const row of regions){
    if(!isObject(row))bad('REGION_FIELD_INVALID:regions');
    keysOk(row,KEYS.region,'regions');
    if(typeof row.id!=='string'||!ID.test(row.id))bad('REGION_ID_INVALID');
    if(usedIds.has(row.id))bad('REGION_ID_DUPLICATE:'+row.id);usedIds.add(row.id);
    const fill=row.fill??'LIGHT';
    if(!FILLS.includes(fill))bad('REGION_FILL_UNSUPPORTED:'+row.id+':'+fill);
    if(!Array.isArray(row.shapes)||!row.shapes.length)bad('REGION_FIELD_INVALID:shapes:'+row.id);
    const holeRows=row.holes??[];
    if(!Array.isArray(holeRows))bad('REGION_FIELD_INVALID:holes:'+row.id);
    const resolve=shape=>resolveLoop(shapeLoop(shape,row.id),at,row.id);
    const shapes=row.shapes.map(resolve),holes=holeRows.map(resolve),all=[...shapes,...holes];
    const scale=Math.max(...all.map(l=>sizeOf(l.dense))),eps=1e-7*scale;
    for(const loop of all){
      const edges=edgesOf(loop.dense);
      for(let i=0;i<edges.length;i++)for(let j=i+2;j<edges.length;j++){
        if(i===0&&j===edges.length-1)continue;
        if(properCross(edges[i][0],edges[i][1],edges[j][0],edges[j][1],eps*scale))bad('REGION_SELF_INTERSECTING:'+row.id);
      }
      if(Math.abs(area(loop.dense))<1e-9*scale*scale)bad('REGION_DEGENERATE:'+row.id);
    }
    for(let a=0;a<all.length;a++)for(let b=a+1;b<all.length;b++)
      for(const [p,q] of edgesOf(all[a].dense))for(const [r,s] of edgesOf(all[b].dense))
        if(properCross(p,q,r,s,eps*scale))bad('REGION_LOOPS_CROSS:'+row.id);
    // shapes are disjoint (the fill rule would cancel an overlap), holes lie inside the shapes
    const probes=loop=>[...loop.dense,...edgesOf(loop.dense).map(([p,q])=>[(p[0]+q[0])/2,(p[1]+q[1])/2])];
    for(let a=0;a<shapes.length;a++)for(let b=0;b<shapes.length;b++){
      if(a!==b&&probes(shapes[a]).some(p=>locate(p,shapes[b].dense,eps)===1))bad('REGION_SHAPES_OVERLAP:'+row.id);
    }
    for(const hole of holes){
      const ok=probes(hole).every(p=>shapes.some(s=>locate(p,s.dense,eps)>=0));
      if(!ok)bad('REGION_HOLE_OUTSIDE:'+row.id);
    }
    // every boundary edge is already drawn
    for(const loop of all){
      let current=loop.start;
      for(const step of loop.steps){
        const from=at(current),to=at(step.to);
        const drawn=step.arc?arcEdgeDrawn(from,to,step.arc,at,cover):lineEdgeDrawn(from,to,cover);
        if(!drawn)bad('REGION_BOUNDARY_UNKNOWN:'+row.id+':'+current+'-'+step.to);
        current=step.to;
      }
    }
    const object={id:row.id,kind:'FILL_REGION',fill,loops:all.map(l=>({start:l.start,steps:l.steps}))};
    if(row.pattern!==undefined){
      if(!PATTERNS.includes(row.pattern))bad('REGION_PATTERN_UNSUPPORTED:'+row.id+':'+row.pattern);
      object.pattern=row.pattern;
    }
    if(row.label!==undefined){
      if(typeof row.label!=='string'||!row.label.trim()||row.label.length>40)bad('REGION_FIELD_INVALID:label:'+row.id);
      const named=row.labelName!==undefined||row.unit!==undefined;
      const kind=row.labelKind??(named?'TEXT':'MATH');
      if(!LABEL_KINDS.includes(kind))bad('REGION_FIELD_INVALID:labelKind:'+row.id);
      const role=row.factRole??'GIVEN';if(!FACT_ROLES.includes(role))bad('REGION_FIELD_INVALID:factRole:'+row.id);
      if(named){
        // name=value+unit as one plain-text label in the weight of a math label (E32)
        if(kind!=='TEXT')bad('REGION_LABEL_NAME_REQUIRES_TEXT:'+row.id);
        if(row.labelName!==undefined&&(typeof row.labelName!=='string'||!row.labelName.trim()||row.labelName.length>20||/[\r\n\t\\$=]/u.test(row.labelName)))bad('REGION_LABEL_NAME_INVALID:'+row.id);
        if(row.unit!==undefined&&!REGION_LABEL_UNITS.includes(row.unit))bad('MARK_UNIT_INVALID:regions:'+row.id);
        const text=regionLabelText(row);
        if(text===null||text.length>40)bad('REGION_LABEL_VALUE_UNSUPPORTED:'+row.id);
        object.labelText=text;object.labelKind='TEXT';object.labelWeight='MATH';
      }else{object.labelText=row.label;object.labelKind=kind;}
      factRolesByLabel[row.id+'-label']=role;
      if(row.labelPlacement!==undefined){
        if(!REGION_LABEL_PLACEMENTS.includes(row.labelPlacement))bad('REGION_LABEL_PLACEMENT_INVALID:'+row.id);
        if(row.labelPlacement!=='AUTO')object.labelPlacement=row.labelPlacement;
      }
      if(row.labelAt!==undefined){
        // labelAt: the place the label stands (inside the region; for LEADER the place outside it), a source coordinate [x,y] or a displayed point
        let place;
        if(typeof row.labelAt==='string'){const p=points[row.labelAt];if(!p)bad('REGION_LABEL_AT_INVALID:'+row.id);place=p.approximation;}
        else if(Array.isArray(row.labelAt)&&row.labelAt.length===2&&row.labelAt.every(v=>typeof v==='number'&&Number.isFinite(v)))place=[row.labelAt[0],row.labelAt[1]];
        else bad('REGION_LABEL_AT_INVALID:'+row.id);
        if(row.labelPlacement!=='LEADER'){
          let inside=false;
          for(const loop of all){const state=locate(place,loop.dense,eps);if(state===0)bad('REGION_LABEL_AT_OUTSIDE:'+row.id);if(state===1)inside=!inside;}
          if(!inside)bad('REGION_LABEL_AT_OUTSIDE:'+row.id);
        }
        object.labelAt=[place[0],place[1]];
      }
    }
    else if(row.labelKind!==undefined)bad('REGION_FIELD_INVALID:labelKind:'+row.id);
    else if(row.labelName!==undefined||row.unit!==undefined||row.labelPlacement!==undefined||row.labelAt!==undefined)bad('REGION_LABEL_FIELDS_NEED_LABEL:'+row.id);
    objects.push(object);
  }
  return {objects,factRolesByLabel};
}

export function regionPointRefs(plan){
  const regions=plan?.planeMarks?.regions;if(!Array.isArray(regions))return [];
  const refs=[];
  const visitLoop=loop=>{if(!isObject(loop))return;refs.push(loop.start);for(const s of Array.isArray(loop.steps)?loop.steps:[]){refs.push(s?.to);refs.push(s?.arc?.center);}};
  for(const row of regions){
    if(!isObject(row))continue;
    for(const shape of [...(Array.isArray(row.shapes)?row.shapes:[]),...(Array.isArray(row.holes)?row.holes:[])]){
      if(!isObject(shape))continue;
      if(Array.isArray(shape.polygon))refs.push(...shape.polygon);
      for(const key of ['sector','segment'])if(isObject(shape[key]))refs.push(shape[key].center,shape[key].from,shape[key].to);
      visitLoop(shape.loop);
    }
  }
  return refs.filter(id=>typeof id==='string');
}

// Sampled boundary points of every region (arcs can bulge past the displayed points): the figure's frame must contain them.
export function regionExtentPoints(plan,points){
  const regions=plan?.planeMarks?.regions;if(!Array.isArray(regions))return [];
  const at=id=>{const p=points[id];if(!p)throw Error('x');return p.approximation;};
  const out=[];
  for(const row of regions){
    try{
      for(const shape of [...(row.shapes||[]),...(row.holes||[])])out.push(...resolveLoop(shapeLoop(shape,row?.id),at,row?.id).dense);
    }catch{/* planeMarkSpec reports the real error */}
  }
  return out;
}
