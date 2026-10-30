// Plane-figure marks (middle-school stage 1): angle arcs, equal-length ticks, parallel arrows, segment expression labels, highlighted circle arcs.
// A plan's `planeMarks` is the author's statement of facts the figure shows; this module checks each statement against the model's points
// (the SymPy snapshot) and turns it into visual-engine objects. The independent check of the FINAL SVG is plane-marks-observer-worker.py,
// which recomputes every fact from the Cindy peer's points and from the drawn primitives.
// The marks also work on a coordinate construction plan (SOURCE_COORDINATES with axes): the same facts, drawn on the same source frame.
import {regionSpec,regionPointRefs} from './plane-regions.mjs';
export const PLANE_RECIPE='PLANE_FIGURE_v1';
export const isPlaneFigure=plan=>plan?.mathPlan?.realization?.recipeId===PLANE_RECIPE;
export const COORDINATE_RECIPE='SOURCE_COORDINATE_AXES_v1';
export const isCoordinateFigure=(plan,model)=>plan?.mathPlan?.realization?.recipeId===COORDINATE_RECIPE&&model?.coordinateMode==='SOURCE_COORDINATES';
export const planeMarksAllowed=(plan,model)=>isPlaneFigure(plan)||isCoordinateFigure(plan,model);
// hiddenPointStyle "NONE" (a plane figure or a coordinate figure with axes): the points listed in hiddenPointNames are drawn with no dot and no name.
// The independent observer is told these ids from the PLAN, never from the engine, and expects no marker at them (every other point must keep its dot).
// A coordinate figure is recognised by its recipe here; phase2 also checks the model's coordinate mode and refuses the style on any other figure.
// `unmarkedPointNames` (with the default style) picks single hidden points that get no dot, the others keeping theirs (the four read points of a coordinate
// figure keep their dots while the feet of the perpendiculars that only guide the dashed segments draw none).
export const unmarkedPointIds=plan=>{
  if(!(isPlaneFigure(plan)||plan?.mathPlan?.realization?.recipeId===COORDINATE_RECIPE))return [];
  if(plan?.hiddenPointStyle==='NONE')return Array.isArray(plan.hiddenPointNames)?[...plan.hiddenPointNames]:[];
  return Array.isArray(plan?.unmarkedPointNames)?[...plan.unmarkedPointNames]:[];
};
// Texts of a plan that write point names (caption and the labels of marks/lengths), for the check that a nameless point is never named in text.
export function planNameTexts(plan,exceptPointId){
  const out=[],add=value=>{if(typeof value==='string')out.push(value);else if(value&&typeof value==='object'&&!Array.isArray(value)){add(value.text);add(value.math);}};
  add(plan?.caption);
  const marks=plan?.planeMarks&&typeof plan.planeMarks==='object'?plan.planeMarks:{};
  for(const row of Array.isArray(marks.angles)?marks.angles:[])add(row?.label);
  for(const row of Array.isArray(marks.arcs)?marks.arcs:[])add(row?.label);
  for(const row of Array.isArray(marks.regions)?marks.regions:[])add(row?.label);
  for(const row of Array.isArray(marks.expressionLabels)?marks.expressionLabels:[])add(row?.text);
  for(const row of Array.isArray(marks.dimensions)?marks.dimensions:[])add(row?.label);
  for(const row of Array.isArray(marks.pathLabels)?marks.pathLabels:[])add(row?.label);
  // A free text label anchored AT a point (at: its id) is how the figure writes that point's own label (P(a,b) beside P): it never counts against that point.
  for(const row of Array.isArray(marks.textLabels)?marks.textLabels:[])if(!(typeof row?.at==='string'&&row.at===exceptPointId))add(row?.text);
  for(const row of Array.isArray(plan?.scalarLabels)?plan.scalarLabels:[]){add(row?.prefix);add(row?.unit);}
  return out;
}
/** True when `text` writes the point id as a name (a capital letter run such as AB or an id beside non-letters); TeX commands such as \angle are ignored. */
export function textNamesPoint(text,id){
  const plain=String(text).replace(/\\[A-Za-z]+/gu,' ');
  const escaped=id.replace(/[.*+?^${}()|[\]\\]/gu,'\\$&');
  return new RegExp('(?<![a-z0-9_])'+escaped+"(?![a-z0-9_\u2032\u2033'])",'u').test(plain);
}
export const ANGLE_TOLERANCE_DEGREES=0.5;
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,31}$/;
const KEYS={planeMarks:['angles','equalLengths','parallels','expressionLabels','arcs','traces','regions','facts','dimensions','pathLabels','textLabels','angleSums','commonSides'],
  textLabels:['id','at','text','labelKind','anchor','factRole'],angleSums:['id','angles','label','at','anchor','factRole'],commonSides:['id','segment','text','labelAt','factRole'],
  dimensions:['id','from','to','label','labelKind','unit','side','style','offset','offsetPx','extension','crossArcs','value','factRole'],
  pathLabels:['id','points','label','labelKind','unit','value','factRole'],
  angles:['id','refs','side','arcs','ring','style','value','label','labelKind','labelPlacement','equalGroup','emphasisGroup','factRole','noLabel','straight'],
  equalLengths:['id','count','segments','pathMark'],parallels:['id','count','segments'],
  expressionLabels:['id','ownerSegment','text','factRole','labelKind','unit','labelAt'],
  arcs:['id','circle','center','from','to','side','label','labelKind','unit','labelPlacement','highlight','factRole'],
  traces:['id','center','radius','through','spanDeg','span','labelAt','label','labelKind','unit','factRole'],
  facts:['kind','circle','points','center','contact','tangent']};
const FACT_ROLES=['GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'];
// emphasisGroup (angles): angles of one group draw their arcs in one colour (group 1 red, 2 blue, 3 green), so an angle that belongs to two relations
// (a pair of corresponding angles AND a pair of vertical angles) shows which relation each arc belongs to; equalGroup (the arc count) is independent of it.
export const ANGLE_EMPHASIS_GROUPS=3;
export const ANGLE_LABEL_PLACEMENTS=['AUTO','LEADER'];
export const ARC_LABEL_PLACEMENTS=['AUTO','LEADER'];
export const EQUAL_PATH_MARKS=['AUTO','TICK','BRACKET'];
export const TRACE_JOIN_MAX_DEGREES=300;   // a joined trace arc (the stated intersections plus spanDeg) may sweep at most this far round its centre
// A label's `unit` (cm, m, mm) is written after a MATH label's expression; a TEXT label is plain Korean text and takes none.
export const LABEL_UNITS=['cm','m','mm','kg'];
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

// ---- free text labels (E30) -------------------------------------------------------------------------------------------------------------------
// planeMarks.textLabels:[{id,at,text,labelKind?,anchor?,factRole?}] writes a short label that no segment, angle or region owns: a quadrant name such as 제2사분면 at a
// source coordinate, the sign condition a>0, b<0, the label P(a,b) beside a point, the coordinates (-1,0) of a point the figure leaves unnamed.
// `at` is a source coordinate [x,y] (the label is centred there, anchor CENTER) or the id of a displayed point (the label stands beside it, on the side `anchor` names, or on the
// first free side without one). labelKind TEXT writes plain Korean text, MATH a formula; without labelKind a text with a Hangul syllable is TEXT, any other MATH.
export const TEXT_LABEL_ANCHORS=['CENTER','N','NE','E','SE','S','SW','W','NW'];
export const TEXT_LABEL_HANGUL=/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/u;
export const TEXT_LABEL_MATH=/^[A-Za-z0-9 (),<>=+\-.\u00B0]{1,40}$/;
export const textLabelKind=row=>row?.labelKind??(TEXT_LABEL_HANGUL.test(String(row?.text??''))?'TEXT':'MATH');
export const TEXT_LABEL_FUNCTIONS=/(?<![A-Za-z])(?:sqrt|abs|log|logb|ln|exp|sin|cos|tan|pi)(?![A-Za-z])/;
/** An angle value as the sum label writes it: 15, 37.5 (at most six decimals, no trailing zeros). */
export const angleNumberText=value=>String(Number(Number(value).toFixed(6)));
export const angleSumText=(a,b)=>angleNumberText(a)+'\u00B0+'+angleNumberText(b)+'\u00B0='+angleNumberText(a+b)+'\u00B0';
const TEXT_LABEL_COORDINATE=/^[A-Za-z]?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/;
/** The model coordinates a textLabels row stands at, when `at` is a source coordinate pair (a point id adds no frame extent: the point is already in the frame). */
export function textLabelExtentPoints(plan){
  const rows=[...(Array.isArray(plan?.planeMarks?.textLabels)?plan.planeMarks.textLabels:[]),...(Array.isArray(plan?.planeMarks?.angleSums)?plan.planeMarks.angleSums:[])],out=[];
  for(const row of rows)if(Array.isArray(row?.at)&&row.at.length===2&&row.at.every(v=>typeof v==='number'&&Number.isFinite(v)))out.push([row.at[0],row.at[1]]);
  return out;
}

// ---- dimension lines (E7) --------------------------------------------------------------------------------------------------------------------
// planeMarks.dimensions:[{id,from,to,label,labelKind?,unit?,side,style?,offset?,value?,factRole?}] writes a length between two displayed points on a line
// parallel to them, on one screen side (ABOVE, BELOW, LEFT, RIGHT: the perpendicular that points that way), as a bar (default), arrows or a brace.
export const DIMENSION_SIDES=['ABOVE','BELOW','LEFT','RIGHT'];
export const DIMENSION_STYLES=['BAR','ARROW','BRACE','INLINE'];
export const DIMENSION_FIRST_PX=24,DIMENSION_STEP_PX=44;   // the same px distances as the engine draws (the independent observer keeps its own copy)
// E32: offset "AUTO" stacks dimensions that share one line and side in tiers by themselves; extension NONE draws no extension lines; offsetPx moves the first tier
// closer to (or further from) the points; crossArcs lets the dimension line cross circular arcs; style INLINE writes the length on the segment itself (arrowheads at its
// two points, the label beside it) for a segment inside the figure.
export const DIMENSION_EXTENSIONS=['FULL','NONE'];
export const DIMENSION_OFFSET_PX_MIN=8,DIMENSION_OFFSET_PX_MAX=120,DIMENSION_MAX_TIER=3;
const dimensionDistance=(style,offset,offsetPx)=>style==='INLINE'?0:(offsetPx??DIMENSION_FIRST_PX)+DIMENSION_STEP_PX*(offset-1);
/** The tier (1..3) every dimension stands on, as {id:tier}: a number is kept, "AUTO" is the lowest tier whose rows on the same line and side do not overlap it (shorter spans first, so the
 *  longest total stands outermost). Rows that are not usable are skipped here (planeMarkSpec reports them). */
export function resolveDimensionOffsets(plan,points){
  const rows=(Array.isArray(plan?.planeMarks?.dimensions)?plan.planeMarks.dimensions:[]).filter(row=>row&&typeof row==='object'&&points[row.from]&&points[row.to]&&row.from!==row.to&&DIMENSION_SIDES.includes(row.side));
  const model=new Map(rows.map(row=>{const a=points[row.from].approximation,b=points[row.to].approximation;return [row.id,{row,a,b,length:norm(sub(b,a))}];}));
  const all=[...model.values()].filter(item=>item.length>1e-12),scale=Math.max(1e-9,...all.map(item=>item.length));
  const sameLine=(p,q)=>{
    const d=[(p.b[0]-p.a[0])/p.length,(p.b[1]-p.a[1])/p.length];
    if(Math.abs(d[0]*(q.b[1]-q.a[1])-d[1]*(q.b[0]-q.a[0]))>1e-6*q.length)return false;
    return [q.a,q.b].every(point=>Math.abs(d[0]*(point[1]-p.a[1])-d[1]*(point[0]-p.a[0]))<=1e-6*scale);
  };
  const out={};
  const groups=[];
  for(const item of all){const group=groups.find(g=>g[0].row.side===item.row.side&&sameLine(g[0],item));if(group)group.push(item);else groups.push([item]);}
  for(const group of groups){
    const base=group[0],d=[(base.b[0]-base.a[0])/base.length,(base.b[1]-base.a[1])/base.length];
    const span=item=>{const s=[item.a,item.b].map(point=>(point[0]-base.a[0])*d[0]+(point[1]-base.a[1])*d[1]);return [Math.min(...s),Math.max(...s)];};
    const taken=[];   // {tier, span}
    for(const item of group)if(Number.isInteger(item.row.offset))taken.push({tier:item.row.offset,span:span(item)});
    for(const item of [...group].filter(item=>item.row.offset==='AUTO').sort((p,q)=>p.length-q.length||String(p.row.id).localeCompare(String(q.row.id)))){
      const [lo,hi]=span(item);
      let tier=1;
      while(taken.some(other=>other.tier===tier&&hi>other.span[0]+1e-6*scale&&other.span[1]>lo+1e-6*scale))tier++;
      if(tier>DIMENSION_MAX_TIER)bad('DIMENSION_TIERS_EXCEEDED:'+item.row.id);
      taken.push({tier,span:[lo,hi]});out[item.row.id]=tier;
    }
  }
  for(const item of all)if(Number.isInteger(item.row.offset))out[item.row.id]=item.row.offset;
  return out;
}
const DIMENSION_SIDE_VECTORS={BELOW:[0,1],ABOVE:[0,-1],LEFT:[-1,0],RIGHT:[1,0]};
/** A dimension's label text and unit: a trailing `\\,cm` (thin space and unit) written inside the label is the unit, so "24\\,cm" is the label 24 with unit cm. */
export function dimensionLabelParts(row){
  let label=row?.label,unit=row?.unit;
  if(typeof label==='string'){
    const m=/^(.*?)\s*\\,\s*(cm|mm|m)$/u.exec(label);
    if(m&&m[1]!==''){if(unit!==undefined&&unit!==m[2])return {label,unit,conflict:true};label=m[1];unit=m[2];}
  }
  return {label,unit};
}
function dimensionFrame(p,q,side,offset,offsetPx,style){
  const length=Math.hypot(q[0]-p[0],q[1]-p[1]),d=[(q[0]-p[0])/length,(q[1]-p[1])/length],want=DIMENSION_SIDE_VECTORS[side];
  const score=v=>v[0]*want[0]+v[1]*want[1],candidates=[[-d[1],d[0]],[d[1],-d[0]]],n=score(candidates[0])>=score(candidates[1])?candidates[0]:candidates[1];
  return {length,d,n,dist:dimensionDistance(style,offset,offsetPx),ok:score(n)>=0.2};
}

/** An equalLengths entry {"path":[ids]} (E32): displayed segments chained end to end through shared points; returns {rep: the first id, ids}. */
function equalPathEntry(entry,rowId,kind,plan,segEnds){
  if(kind!=='EQUAL_MARK')bad('PARALLEL_MARK_PATH_UNSUPPORTED:'+rowId);
  if(!entry||typeof entry!=='object'||Array.isArray(entry)||Object.keys(entry).join()!=='path'||!Array.isArray(entry.path)||entry.path.length<2||entry.path.length>6||entry.path.some(id=>typeof id!=='string')||new Set(entry.path).size!==entry.path.length)bad('EQUAL_MARK_PATH_INVALID:'+rowId);
  const refs=entry.path.map(id=>{const s=(plan.displaySegments||[]).find(row=>row.id===id);if(!s)bad('MARK_TARGET_UNKNOWN:'+id);return s.refs;});
  entry.path.forEach(segEnds);
  // the walk: the end of the first piece that the second piece shares is the joint; every later piece must contain the point the walk stands at
  const joint=refs[0].find(point=>refs[1].includes(point));
  if(joint===undefined)bad('EQUAL_MARK_PATH_NOT_CONNECTED:'+rowId+':'+entry.path[1]);
  let stand=refs[1].find(point=>point!==joint);
  for(let i=2;i<refs.length;i++){
    if(!refs[i].includes(stand))bad('EQUAL_MARK_PATH_NOT_CONNECTED:'+rowId+':'+entry.path[i]);
    stand=refs[i].find(point=>point!==stand);
  }
  return {rep:entry.path[0],ids:[...entry.path]};
}

// Returns {objects, factRolesByLabel}; throws an Error whose message is an UPPER_SNAKE code (optionally ':detail').
export function planeMarkSpec(plan,model,points,segmentIds){
  const marks=plan.planeMarks;
  if(marks===undefined)return {objects:[],factRolesByLabel:{}};
  if(!marks||typeof marks!=='object'||Array.isArray(marks))bad('PLANE_MARKS_INVALID');
  if(!planeMarksAllowed(plan,model))bad('PLANE_MARKS_REQUIRE_PLANE_FIGURE');
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
  // `unit` on a label: only a known unit, only with a MATH label (never a plain TEXT, degree or angle-name label), only with a label to carry it.
  const unitOf=(row,kind,hasLabel,where)=>{
    if(row.unit===undefined)return null;
    if(!LABEL_UNITS.includes(row.unit))bad('MARK_UNIT_INVALID:'+where+':'+row.id);
    if(kind!=='MATH')bad('MARK_UNIT_REQUIRES_MATH_LABEL:'+row.id);
    if(!hasLabel)bad('MARK_UNIT_REQUIRES_LABEL:'+row.id);
    return row.unit;
  };
  // A plain Korean label (labelKind TEXT): one line of at most 40 characters.
  const plainTextOk=(text,where,id)=>{if(typeof text!=='string'||!text.trim()||text.length>40||/[\r\n\t\\$]/.test(text))bad('MARK_FIELD_INVALID:'+where+':'+id);};

  // --- angle arcs
  const groups=new Map(),angleInfo=new Map();
  for(const row of list(marks.angles,'angles')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:angles');
    keysOk(row,KEYS.angles,'angles');claim(row.id,'angles');
    if(!Array.isArray(row.refs)||row.refs.length!==3||row.refs.some(r=>typeof r!=='string'))bad('MARK_FIELD_INVALID:angles.refs:'+row.id);
    if(new Set(row.refs).size!==3)bad('ANGLE_MARK_DEGENERATE:'+row.id);
    const [a,v,c]=row.refs.map(at);
    // straight:true (E30): the half turn from the ray VA to the ray VB on a straight line a-v-b; `side` then names the screen side (ABOVE, BELOW, LEFT, RIGHT) its semicircle faces
    if(row.straight!==undefined&&typeof row.straight!=='boolean')bad('MARK_FIELD_INVALID:angles.straight:'+row.id);
    const straight=row.straight===true;
    const inner=angleBetween(a,v,c);
    if(inner===null||inner<1e-6||(!straight&&inner>180-1e-6))bad('ANGLE_MARK_DEGENERATE:'+row.id);
    if(straight){
      if(Math.abs(inner-180)>ANGLE_TOLERANCE_DEGREES)bad('ANGLE_STRAIGHT_NOT_STRAIGHT:'+row.id);
      if(!DIMENSION_SIDES.includes(row.side))bad('ANGLE_STRAIGHT_SIDE_REQUIRED:'+row.id);
      const length=norm(sub(c,a)),d=[(c[0]-a[0])/length,-(c[1]-a[1])/length],want=DIMENSION_SIDE_VECTORS[row.side];     // model y points up, the screen's down
      const best=Math.max(...[[-d[1],d[0]],[d[1],-d[0]]].map(n=>n[0]*want[0]+n[1]*want[1]));
      if(best<0.2)bad('ANGLE_STRAIGHT_SIDE_AMBIGUOUS:'+row.id);
    }
    const side=straight?row.side:(row.side??'INNER');
    if(!straight&&!['INNER','OUTER'].includes(side))bad('MARK_FIELD_INVALID:angles.side:'+row.id);
    const measured=straight?180:side==='OUTER'?360-inner:inner;
    if(!straight&&inner<5)bad('ANGLE_ARC_TOO_SMALL:'+row.id);
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
    // DEGREE writes the value with a degree sign, NAME writes the angle by its letters (ABC -> the angle ABC) and MATH writes a symbol such as theta.
    if(!['DEGREE','NAME','MATH'].includes(kind))bad('MARK_FIELD_INVALID:angles.labelKind:'+row.id);
    // A degree label names the declared value; a mark with neither a label nor `noLabel` states nothing a student can read.
    const text=labelOf(row,declared!==null?String(row.value).replace(/\.0+$/,''):(straight?'180':null),true);
    if(text===null&&row.noLabel!==true)bad('ANGLE_MARK_LABEL_REQUIRED:'+row.id);
    angleInfo.set(row.id,{vertex:row.refs[1],value:declared});
    if(row.emphasisGroup!==undefined&&(!Number.isInteger(row.emphasisGroup)||row.emphasisGroup<1||row.emphasisGroup>ANGLE_EMPHASIS_GROUPS))bad('ANGLE_EMPHASIS_GROUP_INVALID:'+row.id);
    // labelPlacement LEADER (E12b): the label stands outside its angle on a leader from its own arc even where the angle has room for it; AUTO (default) keeps the old search.
    if(row.labelPlacement!==undefined&&!ANGLE_LABEL_PLACEMENTS.includes(row.labelPlacement))bad('ANGLE_LABEL_PLACEMENT_INVALID:'+row.id);
    if(row.labelPlacement==='LEADER'&&text===null)bad('ANGLE_LABEL_PLACEMENT_NEEDS_LABEL:'+row.id);
    if(row.equalGroup!==undefined){
      if(!Number.isInteger(row.equalGroup)||row.equalGroup<1)bad('MARK_FIELD_INVALID:angles.equalGroup:'+row.id);
      const g=groups.get(row.equalGroup)??{measured,arcs,style,ids:[]};
      if(Math.abs(g.measured-measured)>ANGLE_TOLERANCE_DEGREES)bad('ANGLE_EQUAL_GROUP_MISMATCH:'+row.id);
      if(g.arcs!==arcs)bad('ANGLE_EQUAL_GROUP_ARC_COUNT:'+row.id);
      if(g.style!==style)bad('ANGLE_EQUAL_GROUP_STYLE_MISMATCH:'+row.id);
      g.ids.push(row.id);groups.set(row.equalGroup,g);
    }
    const object={id:row.id,kind:'ANGLE_MARK',refs:row.refs,value:measured,arcs,style,...(ring>1?{ring}:{}),...(straight?{straight:true,straightSide:side}:{}),...(side==='OUTER'?{outer:true}:{}),...(row.emphasisGroup!==undefined?{emphasisGroup:row.emphasisGroup}:{}),...(row.labelPlacement==='LEADER'?{labelPlacement:'LEADER'}:{})};
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
    const kind=row.labelKind??'MATH';
    if(!['MATH','TEXT'].includes(kind))bad('MARK_FIELD_INVALID:expressionLabels.labelKind:'+row.id);
    if(kind==='TEXT')plainTextOk(row.text,'expressionLabels.text',row.id);
    const unit=unitOf(row,kind,true,'expressionLabels');
    // labelAt (E8b): START / END write the label at the first / second end of its segment (the order of the segment's refs), MID (default) at its middle.
    if(row.labelAt!==undefined&&!['START','MID','END'].includes(row.labelAt))bad('SEGMENT_LABEL_AT_INVALID:'+row.id);
    const lerp=t=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
    const mid=row.labelAt==='START'?lerp(0):row.labelAt==='END'?lerp(1):[(p[0]+q[0])/2,(p[1]+q[1])/2];
    const others=(row.labelAt==='START'?[0.06,0.15,0.3]:row.labelAt==='END'?[0.94,0.85,0.7]:[0.3,0.7]).map(lerp);
    objects.push({id:row.id,kind:'EQUATION_LABEL',target:row.ownerSegment,text:row.text,at:mid,lineOwned:true,
      alternateAt:others,gaps:[8,6,10,20,32,48],priority:1,
      ...(kind==='TEXT'?{labelKind:'TEXT'}:{}),...(unit?{unit}:{})});
    factRolesByLabel[row.id]=role(row);
  }

  // --- free text labels (E30)
  for(const row of list(marks.textLabels,'textLabels')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:textLabels');
    keysOk(row,KEYS.textLabels,'textLabels');claim(row.id,'textLabels');
    if(typeof row.text!=='string'||!row.text.trim()||row.text.length>40)bad('TEXT_LABEL_TEXT_INVALID:'+row.id);
    const kind=textLabelKind(row);
    if(!['MATH','TEXT'].includes(kind))bad('MARK_FIELD_INVALID:textLabels.labelKind:'+row.id);
    if(kind==='TEXT')plainTextOk(row.text,'textLabels.text',row.id);
    else if(!TEXT_LABEL_MATH.test(row.text)||TEXT_LABEL_FUNCTIONS.test(row.text)||TEXT_LABEL_HANGUL.test(row.text))bad('TEXT_LABEL_MATH_UNSUPPORTED:'+row.id);
    const byPoint=typeof row.at==='string';
    let place;
    if(byPoint)place=at(row.at);
    else if(Array.isArray(row.at)&&row.at.length===2&&row.at.every(v=>typeof v==='number'&&Number.isFinite(v)))place=[row.at[0],row.at[1]];
    else bad('TEXT_LABEL_AT_INVALID:'+row.id);
    if(row.anchor!==undefined&&!TEXT_LABEL_ANCHORS.includes(row.anchor))bad('TEXT_LABEL_ANCHOR_INVALID:'+row.id);
    const anchor=row.anchor??(byPoint?undefined:'CENTER');
    // A coordinate pair written beside a point must be that point's coordinates (an optional one-letter name before it is not checked here).
    const written=byPoint&&kind==='MATH'?TEXT_LABEL_COORDINATE.exec(row.text.trim()):null;
    if(written&&(Math.abs(Number(written[1])-place[0])>1e-6||Math.abs(Number(written[2])-place[1])>1e-6))bad('TEXT_LABEL_COORDINATE_MISMATCH:'+row.id+':declared=('+written[1]+','+written[2]+'):point=('+Number(place[0].toFixed(6))+','+Number(place[1].toFixed(6))+')');
    objects.push({id:row.id,kind:'EQUATION_LABEL',target:row.id,text:row.text,at:place,freeLabel:true,priority:1,...(anchor?{anchor}:{}),...(kind==='TEXT'?{labelKind:'TEXT'}:{})});
    factRolesByLabel[row.id]=role(row);
  }

  // --- angle sums (E30): the equation of two angle marks at one vertex written as a label, A°+B°=S°, built from their declared values (so it is true by construction);
  // a stated `label` (the sum, with or without °) must equal it. `at` and `anchor` place it like a free text label (default: beside the shared vertex).
  for(const row of list(marks.angleSums,'angleSums')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:angleSums');
    keysOk(row,KEYS.angleSums,'angleSums');claim(row.id,'angleSums');
    if(!Array.isArray(row.angles)||row.angles.length!==2||row.angles.some(id=>typeof id!=='string')||row.angles[0]===row.angles[1])bad('ANGLE_SUM_ANGLES_INVALID:'+row.id);
    const infos=row.angles.map(id=>angleInfo.get(id)??bad('ANGLE_SUM_ANGLES_INVALID:'+row.id+':'+id));
    if(infos[0].vertex!==infos[1].vertex)bad('ANGLE_SUM_VERTEX_MISMATCH:'+row.id);
    if(infos.some(info=>info.value===null))bad('ANGLE_SUM_NEEDS_VALUES:'+row.id);
    const sum=infos[0].value+infos[1].value;
    if(row.label!==undefined){
      const stated=typeof row.label==='string'||typeof row.label==='number'?numberOf(String(row.label).replace(/\u00B0$/u,'')):null;
      if(stated===null||Math.abs(stated-sum)>ANGLE_TOLERANCE_DEGREES)bad('ANGLE_SUM_MISMATCH:'+row.id+':declared='+row.label+':sum='+angleNumberText(sum));
    }
    const byPoint=typeof row.at==='string',target=row.at===undefined?infos[0].vertex:row.at;
    let place;
    if(typeof target==='string')place=at(target);
    else if(Array.isArray(target)&&target.length===2&&target.every(v=>typeof v==='number'&&Number.isFinite(v)))place=[target[0],target[1]];
    else bad('ANGLE_SUM_AT_INVALID:'+row.id);
    if(row.anchor!==undefined&&!TEXT_LABEL_ANCHORS.includes(row.anchor))bad('ANGLE_SUM_ANCHOR_INVALID:'+row.id);
    const anchor=row.anchor??(typeof target==='string'?undefined:'CENTER');
    objects.push({id:row.id,kind:'EQUATION_LABEL',target:row.id,text:angleSumText(infos[0].value,infos[1].value),at:place,freeLabel:true,priority:1,...(anchor?{anchor}:{})});
    factRolesByLabel[row.id]=role(row,'DERIVED_INTERMEDIATE');
  }

  // --- common sides (E30): the word 공통 (or a short text of your own) beside a drawn segment that two figures share
  for(const row of list(marks.commonSides,'commonSides')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:commonSides');
    keysOk(row,KEYS.commonSides,'commonSides');claim(row.id,'commonSides');
    const [p,q]=segEnds(row.segment);
    const text=row.text??'공통';
    plainTextOk(text,'commonSides.text',row.id);
    if(text.length>6)bad('MARK_FIELD_INVALID:commonSides.text:'+row.id);
    if(row.labelAt!==undefined&&!['START','MID','END'].includes(row.labelAt))bad('SEGMENT_LABEL_AT_INVALID:'+row.id);
    const lerp=t=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
    const mid=row.labelAt==='START'?lerp(0):row.labelAt==='END'?lerp(1):[(p[0]+q[0])/2,(p[1]+q[1])/2];
    const others=(row.labelAt==='START'?[0.06,0.15,0.3]:row.labelAt==='END'?[0.94,0.85,0.7]:[0.3,0.7]).map(lerp);
    objects.push({id:row.id,kind:'EQUATION_LABEL',target:row.segment,text,at:mid,lineOwned:true,alternateAt:others,gaps:[8,6,10,20,32,48],priority:1,labelKind:'TEXT'});
    factRolesByLabel[row.id]=role(row);
  }

  // --- dimension lines: a length between two points on a parallel line, with a bar, arrow or brace style
  const autoOffsets=resolveDimensionOffsets(plan,points);
  for(const row of list(marks.dimensions,'dimensions')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:dimensions');
    keysOk(row,KEYS.dimensions,'dimensions');claim(row.id,'dimensions');
    if(typeof row.from!=='string'||typeof row.to!=='string'||row.from===row.to)bad('MARK_FIELD_INVALID:dimensions.from:'+row.id);
    const a=at(row.from),b=at(row.to),distance=norm(sub(b,a));
    if(!(distance>1e-9))bad('DIMENSION_POINTS_COINCIDE:'+row.id);
    if(!DIMENSION_SIDES.includes(row.side))bad('DIMENSION_SIDE_INVALID:'+row.id);
    const style=row.style??'BAR';
    if(!DIMENSION_STYLES.includes(style))bad('DIMENSION_STYLE_INVALID:'+row.id);
    // offset: 1..3, or "AUTO" (the tier is derived from the other dimensions on the same line and side)
    const offset=row.offset==='AUTO'?(autoOffsets[row.id]??bad('DIMENSION_OFFSET_INVALID:'+row.id)):(row.offset??1);
    if(!Number.isInteger(offset)||offset<1||offset>3)bad('DIMENSION_OFFSET_INVALID:'+row.id);
    if(row.extension!==undefined&&!DIMENSION_EXTENSIONS.includes(row.extension))bad('DIMENSION_EXTENSION_INVALID:'+row.id);
    if(row.offsetPx!==undefined&&(typeof row.offsetPx!=='number'||!Number.isFinite(row.offsetPx)||row.offsetPx<DIMENSION_OFFSET_PX_MIN||row.offsetPx>DIMENSION_OFFSET_PX_MAX))bad('DIMENSION_OFFSET_PX_INVALID:'+row.id);
    if(row.crossArcs!==undefined&&typeof row.crossArcs!=='boolean')bad('DIMENSION_CROSS_ARCS_INVALID:'+row.id);
    if(style==='INLINE'&&(row.offset!==undefined&&row.offset!==1||row.offsetPx!==undefined||row.extension!==undefined||row.crossArcs!==undefined))bad('DIMENSION_INLINE_FIELD_INVALID:'+row.id);
    const parts=dimensionLabelParts(row);
    if(parts.conflict)bad('MARK_UNIT_INVALID:dimensions:'+row.id);
    const kind=row.labelKind??'MATH';
    if(!['MATH','TEXT'].includes(kind))bad('MARK_FIELD_INVALID:dimensions.labelKind:'+row.id);
    if(typeof parts.label!=='string'||!parts.label.trim()||parts.label.length>40)bad('DIMENSION_LABEL_REQUIRED:'+row.id);
    if(kind==='TEXT')plainTextOk(parts.label,'dimensions.label',row.id);
    const unit=unitOf({...row,unit:parts.unit},kind,true,'dimensions');
    if(row.value!==undefined){
      const declared=numberOf(row.value);
      if(declared===null||declared<=0)bad('MARK_FIELD_INVALID:dimensions.value:'+row.id);
      if(Math.abs(declared-distance)>1e-6*Math.max(1,declared))bad('DIMENSION_FACT_MISMATCH:'+row.id+':declared='+declared+':drawn='+distance.toFixed(6));
    }
    const frame=dimensionFrame(a,b,row.side,offset,row.offsetPx,style);
    if(!frame.ok)bad('DIMENSION_SIDE_AMBIGUOUS:'+row.id);
    objects.push({id:row.id,kind:'DIMENSION_LINE',refs:[row.from,row.to],side:row.side,style,offset,...(row.offsetPx!==undefined?{offsetPx:row.offsetPx}:{}),...(row.extension==='NONE'?{extension:'NONE'}:{}),...(row.offset==='AUTO'?{autoOffset:true}:{}),labelText:parts.label,...(kind==='TEXT'?{labelKind:'TEXT'}:{}),...(unit?{unit}:{})});
    factRolesByLabel[row.id+'-label']=role(row);
  }

  // --- path total-length labels (E7): one label for the length of a whole bent path (three to eight points joined by drawn segments), tied to the path by a leader
  for(const row of list(marks.pathLabels,'pathLabels')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:pathLabels');
    keysOk(row,KEYS.pathLabels,'pathLabels');claim(row.id,'pathLabels');
    if(!Array.isArray(row.points)||row.points.length<3||row.points.length>8||row.points.some(id=>typeof id!=='string')||new Set(row.points).size!==row.points.length)bad('PATH_LABEL_POINTS_INVALID:'+row.id);
    const coords=row.points.map(at),pathSegments=[];let total=0;
    for(let i=0;i+1<row.points.length;i++){
      const a=row.points[i],b=row.points[i+1];
      const hit=(plan.displaySegments||[]).find(s=>segmentIds.has(s.id)&&Array.isArray(s.refs)&&((s.refs[0]===a&&s.refs[1]===b)||(s.refs[0]===b&&s.refs[1]===a)));
      if(!hit)bad('PATH_LABEL_SEGMENT_NOT_DRAWN:'+row.id+':'+a+'-'+b);
      pathSegments.push(hit.id);total+=norm(sub(coords[i+1],coords[i]));
    }
    const parts=dimensionLabelParts(row);
    if(parts.conflict)bad('MARK_UNIT_INVALID:pathLabels:'+row.id);
    const kind=row.labelKind??'MATH';
    if(!['MATH','TEXT'].includes(kind))bad('MARK_FIELD_INVALID:pathLabels.labelKind:'+row.id);
    if(typeof parts.label!=='string'||!parts.label.trim()||parts.label.length>40)bad('PATH_LABEL_LABEL_REQUIRED:'+row.id);
    if(kind==='TEXT')plainTextOk(parts.label,'pathLabels.label',row.id);
    const unit=unitOf({...row,unit:parts.unit},kind,true,'pathLabels');
    if(row.value!==undefined){
      const declared=numberOf(row.value);
      if(declared===null||declared<=0)bad('MARK_FIELD_INVALID:pathLabels.value:'+row.id);
      if(Math.abs(declared-total)>1e-6*Math.max(1,declared))bad('PATH_LABEL_FACT_MISMATCH:'+row.id+':declared='+declared+':drawn='+total.toFixed(6));
    }
    objects.push({id:row.id,kind:'PATH_LABEL',refs:[...row.points],segments:pathSegments,labelText:parts.label,...(kind==='TEXT'?{labelKind:'TEXT'}:{}),...(unit?{unit}:{})});
    factRolesByLabel[row.id+'-label']=role(row);
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
    const kind=row.labelKind??(row.unit!==undefined?'MATH':'DEGREE');   // a unit goes with a math label: it names a length, not an angle
    // TEXT writes the label as plain Korean text (a name such as "호 AB"); DEGREE, NAME and MATH are the angle-style math labels.
    if(!['DEGREE','NAME','MATH','TEXT'].includes(kind))bad('MARK_FIELD_INVALID:arcs.labelKind:'+row.id);
    if(kind==='TEXT'&&row.label!==undefined)plainTextOk(String(row.label),'arcs.label',row.id);
    const unit=unitOf(row,kind,row.label!==undefined,'arcs');
    const object={id:row.id,kind:'CIRCULAR_ARC',centerPoint:row.center,startPoint:row.from,endPoint:row.to,sweep,highlight:row.highlight!==false};
    // labelPlacement LEADER (E32): the label stands anywhere free, outside or inside the circle, on a leader that starts on this arc (a thin arc, several arcs of one circle); AUTO (default) is unchanged
    if(row.labelPlacement!==undefined){
      if(!ARC_LABEL_PLACEMENTS.includes(row.labelPlacement))bad('ARC_LABEL_PLACEMENT_INVALID:'+row.id);
      if(row.label===undefined)bad('ARC_LABEL_PLACEMENT_NEEDS_LABEL:'+row.id);
      if(row.labelPlacement==='LEADER')object.labelPlacement='LEADER';
    }
    if(row.label!==undefined){object.labelText=String(row.label);object.labelKind=kind;if(unit)object.unit=unit;factRolesByLabel[row.id+'-label']=role(row);}
    objects.push(object);
  }

  // --- construction traces (compass arcs): a thin arc of the declared radius around each intersection it produces
  for(const row of list(marks.traces,'traces')){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:traces');
    keysOk(row,KEYS.traces,'traces');claim(row.id,'traces');
    const center=at(row.center);
    if(!row.radius||typeof row.radius!=='object'||Array.isArray(row.radius))bad('TRACE_RADIUS_INVALID:'+row.id);
    const radiusKeys=Object.keys(row.radius);
    if(radiusKeys.length!==1||!['point','segment'].includes(radiusKeys[0]))bad('TRACE_RADIUS_INVALID:'+row.id);
    let radiusPoint=null,radiusSegment=null,radius;
    if(radiusKeys[0]==='point'){
      radiusPoint=row.radius.point;
      if(typeof radiusPoint!=='string'||radiusPoint===row.center)bad('TRACE_RADIUS_INVALID:'+row.id);
      radius=norm(sub(at(radiusPoint),center));
    }else{
      radiusSegment=row.radius.segment;
      if(typeof radiusSegment!=='string')bad('TRACE_RADIUS_INVALID:'+row.id);
      const [p,q]=segEnds(radiusSegment);radius=norm(sub(q,p));
    }
    if(!(radius>1e-12))bad('TRACE_RADIUS_INVALID:'+row.id);
    if(!Array.isArray(row.through)||row.through.length<1||row.through.length>8||row.through.some(id=>typeof id!=='string'))bad('MARK_FIELD_INVALID:traces.through:'+row.id);
    if(new Set(row.through).size!==row.through.length)bad('TRACE_TARGETS_DEGENERATE:'+row.id);
    for(const id of row.through){
      if(id===row.center)bad('TRACE_TARGETS_DEGENERATE:'+row.id);
      const p=at(id);
      if(Math.abs(norm(sub(p,center))-radius)>1e-6*Math.max(1,radius))bad('TRACE_TARGET_NOT_ON_ARC:'+id);
    }
    const span=row.spanDeg===undefined?24:numberOf(row.spanDeg);
    if(span===null||span<2||span>120)bad('TRACE_SPAN_INVALID:'+row.id);
    // span JOIN (E8b): one continuous arc from the first to the last of the stated intersections (spanDeg/2 past each end) instead of a short arc around each.
    if(row.span!==undefined&&row.span!=='JOIN')bad('TRACE_SPAN_INVALID:'+row.id);
    const join=row.span==='JOIN'&&row.through.length>1;
    if(join){
      const angles=row.through.map(id=>{const p=at(id);return Math.atan2(p[1]-center[1],p[0]-center[0]);}).sort((p,q)=>p-q);
      let gap=2*Math.PI-(angles[angles.length-1]-angles[0]);
      for(let i=1;i<angles.length;i++)gap=Math.max(gap,angles[i]-angles[i-1]);
      if((2*Math.PI-gap)*180/Math.PI+span>TRACE_JOIN_MAX_DEGREES)bad('TRACE_JOIN_TOO_WIDE:'+row.id);
    }
    // labelAt (E8b): where around the circle the label stands: START / MID / END of the drawn arc (the counter-clockwise start, its middle, its other end) or a direction in degrees (0 = right, 90 = up).
    if(row.labelAt!==undefined){
      const named=['START','MID','END'].includes(row.labelAt),degrees=typeof row.labelAt==='number'&&Number.isFinite(row.labelAt);
      if(!named&&!degrees)bad('TRACE_LABEL_AT_INVALID:'+row.id);
      if(row.label===undefined)bad('TRACE_LABEL_AT_NEEDS_LABEL:'+row.id);
    }
    const label=row.label===undefined?null:String(row.label);
    const kind=row.labelKind??'MATH';
    if(!['MATH','TEXT'].includes(kind))bad('MARK_FIELD_INVALID:traces.labelKind:'+row.id);
    const unit=unitOf(row,kind,label!==null,'traces');
    // MATH: the construction order digit 1..99, or with a unit the length that radius stands for (a positive number or one letter);
    // TEXT: a plain Korean mark such as the order sign (up to 40 characters).
    if(label!==null){
      if(kind==='TEXT'){if(label.trim()===''||label.length>40||/[\r\n\t\\$]/.test(label))bad('TRACE_LABEL_INVALID:'+row.id);}
      else if(unit?!/^(?:[0-9]+(?:\.[0-9]+)?|[A-Za-z])$/.test(label)||/^0+(?:\.0+)?$/.test(label):!/^[1-9][0-9]?$/.test(label))bad('TRACE_LABEL_INVALID:'+row.id);
    }
    const object={id:row.id,kind:'TRACE_ARC',centerPoint:row.center,through:[...row.through],spanDeg:span,...(radiusPoint?{radiusPoint}:{radiusSegment}),...(join?{span:'JOIN'}:{}),...(row.labelAt!==undefined?{labelAt:row.labelAt}:{})};
    if(label!==null){object.labelText=label;if(kind==='TEXT')object.labelKind='TEXT';if(unit)object.unit=unit;factRolesByLabel[row.id+'-label']=role(row);}
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
  for(const row of Array.isArray(marks.dimensions)?marks.dimensions:[])refs.push(row?.from,row?.to);
  for(const row of Array.isArray(marks.pathLabels)?marks.pathLabels:[])if(Array.isArray(row?.points))refs.push(...row.points);
  for(const row of Array.isArray(marks.textLabels)?marks.textLabels:[])if(typeof row?.at==='string')refs.push(row.at);
  for(const row of Array.isArray(marks.angleSums)?marks.angleSums:[])if(typeof row?.at==='string')refs.push(row.at);
  for(const row of Array.isArray(marks.traces)?marks.traces:[]){refs.push(row?.center,row?.radius?.point,...(Array.isArray(row?.through)?row.through:[]));}
  for(const row of Array.isArray(marks.facts)?marks.facts:[]){if(Array.isArray(row?.points))refs.push(...row.points);refs.push(row?.center,row?.contact);}
  return [...refs,...regionPointRefs(plan)].filter(id=>typeof id==='string');
}

// ---- framing room for arc labels (E11) -------------------------------------------------------------------------------------------------
// A label on a circular arc stands OUTSIDE its circle (the layout tries the directions that point away from the centre, gap 14 px and up).
// The tight plane-figure frame leaves too little canvas there, so a plan with labelled arcs widens its model bounds until every label has
// room on the sides its arc faces. Sizes are px estimates at a conservative font (the policy font is 20 to 32 px, measured later); a plan
// without a labelled arc is returned unchanged, so every other figure keeps its frame byte for byte.
export const ARC_LABEL_FONT_ESTIMATE_PX=26;
const ARC_LABEL_FIRST_GAP_PX=18,ARC_LABEL_SAFE_PX=12,ARC_LABEL_VIEW_MARGIN_PX=32,ARC_LABEL_FACING=0.38;
export function arcLabelBoxEstimate(row){
  const text=String(row.label),font=ARC_LABEL_FONT_ESTIMATE_PX,kind=row.labelKind??(row.unit!==undefined?'MATH':'DEGREE');
  const hangul=/[ᄀ-ᇿ㄰-㆏㈀-㋿가-힯]/;
  let em;
  if(kind==='TEXT')em=[...text].reduce((sum,ch)=>sum+(hangul.test(ch)?1.05:0.6),0);
  else{
    em=[...text.replace(/\s+/g,'')].length*0.62+(kind==='DEGREE'?0.45:kind==='NAME'?0.8:0);
    if(row.unit!==undefined)em+=String(row.unit).length*0.6+(/[A-Za-z]$/.test(text)?0.25:0);
  }
  return {width:Math.ceil(em*font),height:Math.ceil(font*(kind!=='TEXT'&&/[\/^_]|sqrt/.test(text)?2.0:1.1))};
}
// Where each labelled arc's label hangs: the arc's middle (model units), the outward unit vector, the arc's own extreme points and the label size estimate.
export function arcLabelSites(plan,model,points){
  const rows=Array.isArray(plan?.planeMarks?.arcs)?plan.planeMarks.arcs:[],sites=[];
  for(const row of rows){
    if(!row||typeof row!=='object'||row.label===undefined)continue;
    try{
      const [cx,cy,r]=model.circles[row.circle].approximation,center=points[row.center].approximation,start=points[row.from].approximation,end=points[row.to].approximation;
      const a0=Math.atan2(start[1]-center[1],start[0]-center[0]);
      const ccw=(((Math.atan2(end[1]-center[1],end[0]-center[0])-a0)%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
      if(!(ccw>1e-9)||(Math.abs(ccw-Math.PI)<1e-9&&(row.side===undefined||row.side==='MINOR'||row.side==='MAJOR')))continue;
      const counter=row.side==='CCW'||(row.side!=='CW'&&(row.side==='MAJOR')!==(ccw<Math.PI));
      const span=counter?ccw:2*Math.PI-ccw,direction=counter?1:-1,middle=a0+direction*span/2;
      const extremes=[0,1,2,3].map(k=>k*Math.PI/2).filter(angle=>(((angle-a0)*direction)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)<=span).map(angle=>[cx+r*Math.cos(angle),cy+r*Math.sin(angle)]);
      sites.push({id:row.id,anchor:[cx+r*Math.cos(middle),cy+r*Math.sin(middle)],outward:[Math.cos(middle),Math.sin(middle)],extremes,...arcLabelBoxEstimate(row)});
    }catch{/* planeMarkSpec reports the real error */}
  }
  return sites;
}
// ---- joined trace arcs (E8b): the frame includes the whole arc, and room for its order label ----------------------------------------------------
// A trace arc with span JOIN (or a label with labelAt) may reach well past the displayed points, so a plane frame fitted to the points would clip it.
// Only a trace that uses one of those two new fields adds frame room; a plan with the old trace keeps its frame byte for byte.
/** The arcs a trace draws and the circle they lie on, from the displayed points (model units, angles in radians, counter-clockwise): {center,radius,arcs:[{start,sweep}],anchor}. */
function traceGeometry(plan,row,points){
  const center=points[row.center].approximation;let radius;
  if(row.radius?.point!==undefined)radius=norm(sub(points[row.radius.point].approximation,center));
  else{const s=(plan.displaySegments||[]).find(x=>x.id===row.radius?.segment);const [p,q]=s.refs.map(id=>points[id].approximation);radius=norm(sub(q,p));}
  const span=row.spanDeg===undefined?24:numberOf(row.spanDeg),pad=span*Math.PI/360,full=2*Math.PI;
  const angles=row.through.map(id=>{const p=points[id].approximation;return Math.atan2(p[1]-center[1],p[0]-center[0]);});
  let arcs;
  if(row.span==='JOIN'&&angles.length>1){
    const sorted=angles.map(a=>((a%full)+full)%full).sort((p,q)=>p-q);
    const gaps=sorted.map((a,i)=>(((sorted[(i+1)%sorted.length]-a)%full)+full)%full||full);
    const largest=gaps.indexOf(Math.max(...gaps));
    arcs=[{start:sorted[(largest+1)%sorted.length]-pad,sweep:full-gaps[largest]+2*pad}];
  }else arcs=angles.map(a=>({start:a-pad,sweep:2*pad}));
  const first=arcs[0],at=row.labelAt;
  const anchor=at==='START'?first.start:at==='END'?first.start+first.sweep:typeof at==='number'?at*Math.PI/180:(row.span==='JOIN'&&angles.length>1)||at==='MID'?first.start+first.sweep/2:angles[0];
  return {center,radius,arcs,anchor};
}
const traceExtremes=(geometry,arc)=>{
  const {center,radius}=geometry,full=2*Math.PI,out=[arc.start,arc.start+arc.sweep].map(a=>[center[0]+radius*Math.cos(a),center[1]+radius*Math.sin(a)]);
  for(let k=0;k<4;k++){const a=k*Math.PI/2;if((((a-arc.start)%full)+full)%full<=arc.sweep)out.push([center[0]+radius*Math.cos(a),center[1]+radius*Math.sin(a)]);}
  return out;
};
/** Model points a joined trace arc reaches (its ends and the axis extremes it passes), for the plane frame. */
export function traceJoinExtentPoints(plan,points){
  const rows=Array.isArray(plan?.planeMarks?.traces)?plan.planeMarks.traces:[],out=[];
  for(const row of rows){
    if(!row||typeof row!=='object'||row.span!=='JOIN'||!Array.isArray(row.through)||row.through.length<2)continue;
    try{const geometry=traceGeometry(plan,row,points);for(const arc of geometry.arcs)out.push(...traceExtremes(geometry,arc));}catch{/* planeMarkSpec reports the real error */}
  }
  return out;
}
/** The label sites of traces with a joined arc or a labelAt, in the shape arcLabelSites gives (anchor on the circle, outward unit vector, the arc's extreme points, label size). */
export function traceLabelSites(plan,points){
  const rows=Array.isArray(plan?.planeMarks?.traces)?plan.planeMarks.traces:[],sites=[];
  for(const row of rows){
    if(!row||typeof row!=='object'||row.label===undefined||(row.span!=='JOIN'&&row.labelAt===undefined)||!Array.isArray(row.through)||!row.through.length)continue;
    try{
      const geometry=traceGeometry(plan,row,points),{center,radius,anchor}=geometry;
      sites.push({id:row.id,anchor:[center[0]+radius*Math.cos(anchor),center[1]+radius*Math.sin(anchor)],outward:[Math.cos(anchor),Math.sin(anchor)],
        extremes:geometry.arcs.flatMap(arc=>traceExtremes(geometry,arc)),...arcLabelBoxEstimate({label:String(row.label),labelKind:row.labelKind??'MATH',unit:row.unit})});
    }catch{/* planeMarkSpec reports the real error */}
  }
  return sites;
}
export function arcLabelFraming(plan,model,points,bounds,canvas){
  if(!isPlaneFigure(plan))return bounds;
  const sites=[...arcLabelSites(plan,model,points),...traceLabelSites(plan,points)];
  if(!sites.length)return bounds;
  let {xMin,xMax,yMin,yMax}=bounds;
  for(const site of sites)for(const [x,y] of [site.anchor,...site.extremes]){xMin=Math.min(xMin,x);xMax=Math.max(xMax,x);yMin=Math.min(yMin,y);yMax=Math.max(yMax,y);}
  const M=ARC_LABEL_VIEW_MARGIN_PX,plotW=canvas.width-2*M,plotH=canvas.height-2*M;
  for(let pass=0;pass<80;pass++){
    const sx=Math.min(plotW/(xMax-xMin),plotH/(yMax-yMin)),left=M+(plotW-sx*(xMax-xMin))/2,top=M+(plotH-sx*(yMax-yMin))/2;
    const grow={left:0,right:0,top:0,bottom:0};
    for(const site of sites){
      const X=left+(site.anchor[0]-xMin)*sx,Y=top+(yMax-site.anchor[1])*sx,[ux,uy]=site.outward,gap=ARC_LABEL_FIRST_GAP_PX,safe=ARC_LABEL_SAFE_PX;
      if(ux>ARC_LABEL_FACING)grow.right=Math.max(grow.right,X+gap+site.width-(canvas.width-safe));
      if(ux<-ARC_LABEL_FACING)grow.left=Math.max(grow.left,safe-(X-gap-site.width));
      if(uy>ARC_LABEL_FACING)grow.top=Math.max(grow.top,safe-(Y-gap-site.height));
      if(uy<-ARC_LABEL_FACING)grow.bottom=Math.max(grow.bottom,Y+gap+site.height-(canvas.height-safe));
    }
    if(Math.max(grow.left,grow.right,grow.top,grow.bottom)<=0.05)break;
    xMin-=Math.max(grow.left,0)/sx;xMax+=Math.max(grow.right,0)/sx;yMin-=Math.max(grow.bottom,0)/sx;yMax+=Math.max(grow.top,0)/sx;
  }
  return {xMin,xMax,yMin,yMax};
}

// ---- framing room for dimension lines and their labels (E7) ------------------------------------------------------------------------------------
// A dimension line stands a fixed number of px outside its two points, with its label beyond it, so the tight plane frame has no canvas there. A plan with
// dimensions widens its model bounds on the sides they face until the lines, the labels (size estimated, as for arc labels) and a safe margin all fit; a
// plan without one is returned unchanged, so every other figure keeps its frame byte for byte.
const DIMENSION_LABEL_GAP_PX=8,DIMENSION_VIEW_SAFE_PX=14;
export function dimensionSites(plan,points){
  const rows=Array.isArray(plan?.planeMarks?.dimensions)?plan.planeMarks.dimensions:[],sites=[];
  let tiers={};try{tiers=resolveDimensionOffsets(plan,points);}catch{/* planeMarkSpec reports the real error */}
  for(const row of rows){
    if(!row||typeof row!=='object')continue;
    try{
      const a=points[row.from].approximation,b=points[row.to].approximation,parts=dimensionLabelParts(row),kind=row.labelKind??'MATH';
      sites.push({from:a,to:b,side:row.side,offset:row.offset==='AUTO'?(tiers[row.id]??1):(row.offset??1),offsetPx:row.offsetPx,style:row.style??'BAR',...arcLabelBoxEstimate({label:String(parts.label),labelKind:kind,unit:parts.unit})});
    }catch{/* planeMarkSpec reports the real error */}
  }
  return sites;
}
export function dimensionFraming(plan,model,points,bounds,canvas){
  if(!planeMarksAllowed(plan,model))return bounds;
  const sites=dimensionSites(plan,points);
  if(!sites.length)return bounds;
  let {xMin,xMax,yMin,yMax}=bounds;
  for(let pass=0;pass<80;pass++){
    const M=ARC_LABEL_VIEW_MARGIN_PX,plotW=canvas.width-2*M,plotH=canvas.height-2*M;
    const sx=Math.min(plotW/(xMax-xMin),plotH/(yMax-yMin)),left=M+(plotW-sx*(xMax-xMin))/2,top=M+(plotH-sx*(yMax-yMin))/2;
    const grow={left:0,right:0,top:0,bottom:0};
    for(const site of sites){
      const P=[left+(site.from[0]-xMin)*sx,top+(yMax-site.from[1])*sx],Q=[left+(site.to[0]-xMin)*sx,top+(yMax-site.to[1])*sx];
      if(!(Math.hypot(Q[0]-P[0],Q[1]-P[1])>1e-9))continue;
      const {n,dist}=dimensionFrame(P,Q,site.side,site.offset,site.offsetPx,site.style);
      const support=Math.abs(n[0])*site.width/2+Math.abs(n[1])*site.height/2,reach=dist+DIMENSION_LABEL_GAP_PX+support,mid=[(P[0]+Q[0])/2,(P[1]+Q[1])/2];
      const centre=[mid[0]+n[0]*reach,mid[1]+n[1]*reach];
      const corners=[[P[0]+n[0]*dist,P[1]+n[1]*dist],[Q[0]+n[0]*dist,Q[1]+n[1]*dist],
        [centre[0]-site.width/2,centre[1]-site.height/2],[centre[0]+site.width/2,centre[1]-site.height/2],[centre[0]-site.width/2,centre[1]+site.height/2],[centre[0]+site.width/2,centre[1]+site.height/2]];
      for(const [X,Y] of corners){
        grow.left=Math.max(grow.left,DIMENSION_VIEW_SAFE_PX-X);grow.right=Math.max(grow.right,X-(canvas.width-DIMENSION_VIEW_SAFE_PX));
        grow.top=Math.max(grow.top,DIMENSION_VIEW_SAFE_PX-Y);grow.bottom=Math.max(grow.bottom,Y-(canvas.height-DIMENSION_VIEW_SAFE_PX));
      }
    }
    if(Math.max(grow.left,grow.right,grow.top,grow.bottom)<=0.05)break;
    xMin-=Math.max(grow.left,0)/sx;xMax+=Math.max(grow.right,0)/sx;yMin-=Math.max(grow.bottom,0)/sx;yMax+=Math.max(grow.top,0)/sx;
  }
  return {xMin,xMax,yMin,yMax};
}
