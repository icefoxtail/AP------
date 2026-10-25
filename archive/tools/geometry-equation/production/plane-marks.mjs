// Plane-figure marks (middle-school stage 1): angle arcs, equal-length ticks, parallel arrows, segment expression labels, highlighted circle arcs.
// A plan's `planeMarks` is the author's statement of facts the figure shows; this module checks each statement against the model's points
// (the SymPy snapshot) and turns it into visual-engine objects. The independent check of the FINAL SVG is plane-marks-observer-worker.py,
// which recomputes every fact from the Cindy peer's points and from the drawn primitives.
import {regionSpec,regionPointRefs} from './plane-regions.mjs';
export const PLANE_RECIPE='PLANE_FIGURE_v1';
export const isPlaneFigure=plan=>plan?.mathPlan?.realization?.recipeId===PLANE_RECIPE;
export const ANGLE_TOLERANCE_DEGREES=0.5;
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,31}$/;
const KEYS={planeMarks:['angles','equalLengths','parallels','expressionLabels','arcs','regions','facts'],
  angles:['id','refs','side','arcs','ring','style','value','label','labelKind','equalGroup','factRole','noLabel'],
  equalLengths:['id','count','segments'],parallels:['id','count','segments'],
  expressionLabels:['id','ownerSegment','text','factRole'],
  arcs:['id','circle','center','from','to','side','label','labelKind','highlight','factRole'],
  facts:['kind','circle','points','center','contact','tangent']};
const FACT_ROLES=['GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'];
const bad=code=>{throw Error(code);};
const keysOk=(row,allowed,where)=>{for(const key of Object.keys(row))if(!allowed.includes(key))bad('MARK_FIELD_UNKNOWN:'+where+'.'+key);};
const numberOf=value=>{const n=typeof value==='string'&&value.trim()!==''?Number(value):value;return typeof n==='number'&&Number.isFinite(n)?n:null;};
const sub=(p,q)=>[p[0]-q[0],p[1]-q[1]];
const norm=v=>Math.hypot(v[0],v[1]);
export function angleBetween(a,v,c){
  const u=sub(a,v),w=sub(c,v),nu=norm(u),nw=norm(w);
  if(nu<=1e-12||nw<=1e-12)return null;
  return Math.acos(Math.max(-1,Math.min(1,(u[0]*w[0]+u[1]*w[1])/(nu*nw))))*180/Math.PI;
}
const list=(value,where)=>{if(value===undefined)return [];if(!Array.isArray(value))bad('MARK_FIELD_INVALID:'+where);return value;};

// Returns {objects, factRolesByLabel}; throws an Error whose message is an UPPER_SNAKE code (optionally ':detail').
export function planeMarkSpec(plan,model,points,segmentIds){
  const marks=plan.planeMarks;
  if(marks===undefined)return {objects:[],factRolesByLabel:{}};
  if(!marks||typeof marks!=='object'||Array.isArray(marks))bad('PLANE_MARKS_INVALID');
  if(!isPlaneFigure(plan))bad('PLANE_MARKS_REQUIRE_PLANE_FIGURE');
  keysOk(marks,KEYS.planeMarks,'planeMarks');
  const at=id=>{const p=points[id];if(!p)bad('MARK_TARGET_UNKNOWN:'+id);return p.approximation;};
  const used=new Set([...(plan.displaySegments||[]).map(s=>s.id),...(plan.rightAngles||[]).map(s=>s.id),...plan.mathPlan.nodes.map(n=>n.id)]);
  const claim=(id,where)=>{if(typeof id!=='string'||!ID.test(id))bad('MARK_ID_INVALID:'+where);if(used.has(id))bad('MARK_ID_DUPLICATE:'+id);used.add(id);};
  const segEnds=id=>{const s=(plan.displaySegments||[]).find(row=>row.id===id);if(!s||!segmentIds.has(id))bad('MARK_TARGET_UNKNOWN:'+id);return s.refs.map(at);};
  const objects=[],factRolesByLabel={};
  const role=(row,fallback='GIVEN')=>{const r=row.factRole??fallback;if(!FACT_ROLES.includes(r))bad('MARK_FACT_ROLE_INVALID:'+row.id);return r;};
  const labelOf=(row,measuredText,allowNone)=>{
    if(row.noLabel===true)return null;
    const label=row.label!==undefined?String(row.label):measuredText;
    if(label==null||label==='')return allowNone?null:'';
    return label;
  };

  // --- angle arcs
  const groups=new Map();
  for(const row of list(marks.angles,'angles')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:angles');
    keysOk(row,KEYS.angles,'angles');claim(row.id,'angles');
    if(!Array.isArray(row.refs)||row.refs.length!==3||row.refs.some(r=>typeof r!=='string'))bad('MARK_FIELD_INVALID:angles.refs:'+row.id);
    if(new Set(row.refs).size!==3)bad('ANGLE_MARK_DEGENERATE:'+row.id);
    const [a,v,c]=row.refs.map(at);
    const inner=angleBetween(a,v,c);
    if(inner===null||inner<1e-6||inner>180-1e-6)bad('ANGLE_MARK_DEGENERATE:'+row.id);
    const side=row.side??'INNER';
    if(!['INNER','OUTER'].includes(side))bad('MARK_FIELD_INVALID:angles.side:'+row.id);
    const measured=side==='OUTER'?360-inner:inner;
    if(inner<5)bad('ANGLE_ARC_TOO_SMALL:'+row.id);
    const declared=row.value===undefined?null:numberOf(row.value);
    if(row.value!==undefined&&(declared===null||declared<=0||declared>=360))bad('MARK_FIELD_INVALID:angles.value:'+row.id);
    if(declared!==null&&Math.abs(declared-measured)>ANGLE_TOLERANCE_DEGREES)bad('ANGLE_MARK_FACT_MISMATCH:'+row.id+':declared='+declared+':drawn='+measured.toFixed(3));
    const arcs=row.arcs??1;
    if(!Number.isInteger(arcs)||arcs<1||arcs>3)bad('ANGLE_ARC_COUNT_INVALID:'+row.id);
    const ring=row.ring??1;
    if(!Number.isInteger(ring)||ring<1||ring>3)bad('ANGLE_RING_INVALID:'+row.id);
    // Textbook look: a small filled sector by default (SECTOR); ARC keeps the stroke-only arcs.
    const style=row.style??'SECTOR';
    if(!['SECTOR','ARC'].includes(style))bad('ANGLE_MARK_STYLE_INVALID:'+row.id);
    const kind=row.labelKind??'DEGREE';
    if(!['DEGREE','NAME'].includes(kind))bad('MARK_FIELD_INVALID:angles.labelKind:'+row.id);
    // A degree label names the declared value; a mark with neither a label nor `noLabel` states nothing a student can read.
    const text=labelOf(row,declared!==null?String(row.value).replace(/\.0+$/,''):null,true);
    if(text===null&&row.noLabel!==true)bad('ANGLE_MARK_LABEL_REQUIRED:'+row.id);
    if(row.equalGroup!==undefined){
      if(!Number.isInteger(row.equalGroup)||row.equalGroup<1)bad('MARK_FIELD_INVALID:angles.equalGroup:'+row.id);
      const g=groups.get(row.equalGroup)??{measured,arcs,style,ids:[]};
      if(Math.abs(g.measured-measured)>ANGLE_TOLERANCE_DEGREES)bad('ANGLE_EQUAL_GROUP_MISMATCH:'+row.id);
      if(g.arcs!==arcs)bad('ANGLE_EQUAL_GROUP_ARC_COUNT:'+row.id);
      if(g.style!==style)bad('ANGLE_EQUAL_GROUP_STYLE_MISMATCH:'+row.id);
      g.ids.push(row.id);groups.set(row.equalGroup,g);
    }
    const object={id:row.id,kind:'ANGLE_MARK',refs:row.refs,value:measured,arcs,style,...(ring>1?{ring}:{}),...(side==='OUTER'?{outer:true}:{})};
    if(text!==null){object.labelText=text;object.labelKind=kind;factRolesByLabel[row.id+'-label']=role(row);}
    objects.push(object);
  }
  const arcCounts=new Map();
  for(const [group,g] of groups){if(arcCounts.has(g.arcs))bad('ANGLE_EQUAL_GROUP_AMBIGUOUS:'+group+'&'+arcCounts.get(g.arcs));arcCounts.set(g.arcs,group);}

  // --- equal-length ticks and parallel arrows
  for(const [field,kind,max,codeLength] of [['equalLengths','EQUAL_MARK',3,'EQUAL_MARK_LENGTH_MISMATCH'],['parallels','PARALLEL_MARK',2,'PARALLEL_MARK_NOT_PARALLEL']]){
    const counts=new Map();
    for(const row of list(marks[field],field)){
      if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:'+field);
      keysOk(row,KEYS[field],field);claim(row.id,field);
      if(!Array.isArray(row.segments)||row.segments.length<2||new Set(row.segments).size!==row.segments.length)bad('MARK_FIELD_INVALID:'+field+'.segments:'+row.id);
      if(!Number.isInteger(row.count)||row.count<1||row.count>max)bad('MARK_COUNT_INVALID:'+row.id);
      const ends=row.segments.map(segEnds);
      if(kind==='EQUAL_MARK'){
        const lengths=ends.map(([p,q])=>norm(sub(q,p)));
        if(lengths.some(l=>Math.abs(l-lengths[0])>1e-6*Math.max(1,lengths[0])))bad(codeLength+':'+row.id);
      }else{
        const units=ends.map(([p,q])=>{const d=sub(q,p),n=norm(d);return [d[0]/n,d[1]/n];});
        if(units.some(u=>Math.abs(u[0]*units[0][1]-u[1]*units[0][0])>Math.sin(ANGLE_TOLERANCE_DEGREES*Math.PI/180)))bad(codeLength+':'+row.id);
      }
      // Two groups of one kind with the same tick count could not be told apart.
      if(counts.has(row.count))bad((kind==='EQUAL_MARK'?'EQUAL_MARK_GROUP_AMBIGUOUS:':'PARALLEL_MARK_GROUP_AMBIGUOUS:')+row.id+'&'+counts.get(row.count));
      counts.set(row.count,row.id);
      objects.push({id:row.id,kind,refs:row.segments,count:row.count});
    }
  }

  // --- segment expression labels
  for(const row of list(marks.expressionLabels,'expressionLabels')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:expressionLabels');
    keysOk(row,KEYS.expressionLabels,'expressionLabels');claim(row.id,'expressionLabels');
    const [p,q]=segEnds(row.ownerSegment);
    if(typeof row.text!=='string'||!row.text.trim()||row.text.length>40)bad('MARK_FIELD_INVALID:expressionLabels.text:'+row.id);
    const mid=[(p[0]+q[0])/2,(p[1]+q[1])/2];
    objects.push({id:row.id,kind:'EQUATION_LABEL',target:row.ownerSegment,text:row.text,at:mid,lineOwned:true,
      alternateAt:[0.3,0.7].map(t=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]),gaps:[8,6,10,20,32,48],priority:1});
    factRolesByLabel[row.id]=role(row);
  }

  // --- highlighted circle arcs
  for(const row of list(marks.arcs,'arcs')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:arcs');
    keysOk(row,KEYS.arcs,'arcs');claim(row.id,'arcs');
    const circle=model.circles?.[row.circle];if(!circle)bad('MARK_TARGET_UNKNOWN:'+row.circle);
    const [cx,cy,r]=circle.approximation,center=at(row.center),start=at(row.from),end=at(row.to);
    if(Math.hypot(center[0]-cx,center[1]-cy)>1e-6*Math.max(1,r))bad('ARC_CENTER_MISMATCH:'+row.id);
    for(const [name,p] of [[row.from,start],[row.to,end]])if(Math.abs(norm(sub(p,center))-r)>1e-6*Math.max(1,r))bad('ARC_ENDPOINT_NOT_ON_CIRCLE:'+name);
    if(row.from===row.to||norm(sub(start,end))<1e-9)bad('ARC_ENDPOINTS_COINCIDE:'+row.id);
    const ccw=(((Math.atan2(end[1]-center[1],end[0]-center[0])-Math.atan2(start[1]-center[1],start[0]-center[0]))%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
    let sweep;
    if(row.side==='CCW'||row.side==='CW')sweep=row.side;
    else if(row.side===undefined||row.side==='MINOR'||row.side==='MAJOR'){
      if(Math.abs(ccw-Math.PI)<1e-9)bad('ARC_SIDE_AMBIGUOUS:'+row.id);
      const minorCcw=ccw<Math.PI;sweep=(row.side==='MAJOR')===minorCcw?'CW':'CCW';
    }else bad('MARK_FIELD_INVALID:arcs.side:'+row.id);
    const kind=row.labelKind??'DEGREE';
    if(!['DEGREE','NAME'].includes(kind))bad('MARK_FIELD_INVALID:arcs.labelKind:'+row.id);
    const object={id:row.id,kind:'CIRCULAR_ARC',centerPoint:row.center,startPoint:row.from,endPoint:row.to,sweep,highlight:row.highlight!==false};
    if(row.label!==undefined){object.labelText=String(row.label);object.labelKind=kind;factRolesByLabel[row.id+'-label']=role(row);}
    objects.push(object);
  }

  // --- facts the final SVG must show (checked only by the observer, from the drawn primitives)
  for(const row of list(marks.facts,'facts')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:facts');
    keysOk(row,KEYS.facts,'facts');
    if(row.kind==='ON_CIRCLE'){
      if(!Array.isArray(row.points)||!row.points.length)bad('MARK_FIELD_INVALID:facts.points');
      row.points.forEach(at);
      if(!model.circles?.[row.circle])bad('MARK_TARGET_UNKNOWN:'+row.circle);
      if(!(plan.displayCircles??[]).includes(row.circle))bad('FACT_TARGET_NOT_DRAWN:'+row.circle);
    }else if(row.kind==='TANGENT_PERPENDICULAR'){
      at(row.center);at(row.contact);
      if(!(plan.displayLines??[]).includes(row.tangent)&&!segmentIds.has(row.tangent))bad('FACT_TARGET_NOT_DRAWN:'+row.tangent);
    }else bad('MARK_FIELD_INVALID:facts.kind');
  }
  // --- region fills (plane-regions.mjs)
  const regionFacts=regionSpec(plan,model,points,used);
  objects.push(...regionFacts.objects);Object.assign(factRolesByLabel,regionFacts.factRolesByLabel);
  return {objects,factRolesByLabel};
}

// Every point id a plane mark draws on: each must be a displayed point.
export function planeMarkPointRefs(plan){
  const marks=plan?.planeMarks;if(!marks||typeof marks!=='object')return [];
  const refs=[];
  for(const row of Array.isArray(marks.angles)?marks.angles:[])if(Array.isArray(row?.refs))refs.push(...row.refs);
  for(const row of Array.isArray(marks.arcs)?marks.arcs:[])refs.push(row?.center,row?.from,row?.to);
  for(const row of Array.isArray(marks.facts)?marks.facts:[]){if(Array.isArray(row?.points))refs.push(...row.points);refs.push(row?.center,row?.contact);}
  return [...refs,...regionPointRefs(plan)].filter(id=>typeof id==='string');
}
