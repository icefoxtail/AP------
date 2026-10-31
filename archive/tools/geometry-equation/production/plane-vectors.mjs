// (G3) Plane vectors: planeMarks.vectors and planeMarks.vectorOps, on a plane figure (no axes) or a coordinate figure (axes).
//   vectors:[{id,from,to,label?,labelAt?,side?,emphasis?,dashed?,components?,componentLabels?,factRole?}]
//     an arrow from point `from` to point `to` (id = the id of its drawn segment), named by `label` (text such as vec(a), written like any expression label). The arrow head ends exactly on `to`;
//     a point that is the end of an arrow and the start of none is drawn without its dot (the dot would sit on the head), its name stays.
//     components:true (coordinate figure only): dashed perpendiculars from `to` to the x axis and the y axis, their feet drawn without a dot, the feet numbered by componentLabels:["3","2"].
//   vectorOps:[{id,op:'SUM'|'DIFF'|'SCALE',of:[vector ids],point?,label?,labelAt?,side?,guides?,k?,emphasis?,factRole?}]
//     SUM  of two vectors from one start A (A->B, A->C): the sum arrow A->D with D=B+C-A (point D is a new construction point, or an existing point of the figure that must be that place);
//          guides PARALLELOGRAM draws the dashed sides B-D, C-D; guides TRIANGLE draws the second vector again from B (dashed arrow B->D).
//     DIFF of two vectors from one start A: the arrow C->B for A->B minus A->C.
//     SCALE of one vector A->B by the rational k (a string such as "2" or "-1/2"): the arrow A->P with P=A+k(B-A) (point P as for SUM).
// The author's rows are unfolded here, before the exact model is built, into what the existing machinery draws: displaySegments with arrow END (one per arrow), expressionLabels (one per label),
// textLabels (the component numbers) and construction nodes (VECTOR_SUM_POINT, VECTOR_SCALE_POINT, PERPENDICULAR_FOOT on helper axis lines). The rows stay in planeMarks so the
// independent observer reads them back from the final SVG.
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,31}$/;
const NODE_ID=/^[A-Za-z][A-Za-z0-9]{0,31}$/;
const PLANE_RECIPE='PLANE_FIGURE_v1';
const COORDINATE_RECIPE='SOURCE_COORDINATE_AXES_v1';
const bad=code=>{throw Error(code);};
export const VECTOR_KEYS=['id','from','to','label','labelAt','side','ownership','emphasis','dashed','components','componentLabels','factRole'];
export const VECTOR_OP_KEYS=['id','op','of','point','label','labelAt','side','ownership','guides','k','emphasis','factRole'];
export const VECTOR_OPS=['SUM','DIFF','SCALE'];
export const VECTOR_GUIDES=['PARALLELOGRAM','TRIANGLE'];
export const VECTOR_SIDES=['LEFT','RIGHT'];
export const VECTOR_EMPHASIS=['BOLD','ACCENT'];
const rows=(value,where)=>{if(value===undefined)return [];if(!Array.isArray(value))bad('MARK_FIELD_INVALID:'+where);return value;};
const keysOk=(row,allowed,where)=>{for(const key of Object.keys(row))if(!allowed.includes(key))bad('MARK_FIELD_UNKNOWN:'+where+'.'+key);};
const nodeIdOf=(base,suffix)=>'v'+String(base).replace(/[^A-Za-z0-9]/g,'').slice(0,20)+suffix;
const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};

/** k as an exact rational {numerator,denominator} (BigInt), or null: "2", "-1/2", "3/2"; never 0 or 1 (no scaling). */
export function parseScale(text){
  if(typeof text==='number'&&Number.isInteger(text))text=String(text);
  if(typeof text!=='string')return null;
  const hit=/^(-?)(\d{1,6})(?:\/(\d{1,6}))?$/.exec(text.trim());
  if(!hit)return null;
  let n=BigInt(hit[2])*(hit[1]?-1n:1n),d=BigInt(hit[3]??1);
  if(d===0n||n===0n)return null;
  const g=gcd(n,d);n/=g;d/=g;
  if(n===1n&&d===1n)return null;
  return {numerator:n,denominator:d};
}
const scalarJson=({numerator,denominator})=>denominator===1n?{kind:'integer',value:String(numerator)}:{kind:'rational',numerator:String(numerator),denominator:String(denominator)};

/** The id of the point a SUM / SCALE row ends at: the author's `point`, or a nameless helper point of its own. */
export const opPointId=row=>typeof row?.point==='string'?row.point:nodeIdOf(row?.id,'P');

/**
 * The arrows the rows stand for, from the rows alone: [{id,from,to,guide}] (guide: a dashed arrow that only helps). Used by the dot rule and by the observer's counterpart of this list.
 */
export function vectorArrows(marks){
  const out=[],vectors=Array.isArray(marks?.vectors)?marks.vectors:[],byId=new Map(vectors.filter(v=>v&&typeof v==='object').map(v=>[v.id,v]));
  for(const v of vectors)if(v&&typeof v==='object'&&typeof v.from==='string'&&typeof v.to==='string')out.push({id:v.id,from:v.from,to:v.to,guide:false});
  for(const op of Array.isArray(marks?.vectorOps)?marks.vectorOps:[]){
    if(!op||typeof op!=='object'||!Array.isArray(op.of))continue;
    const [a,b]=op.of.map(id=>byId.get(id));
    if(op.op==='SUM'&&a&&b){out.push({id:op.id,from:a.from,to:opPointId(op),guide:false});if(op.guides==='TRIANGLE')out.push({id:op.id+'-g1',from:a.to,to:opPointId(op),guide:true});}
    else if(op.op==='DIFF'&&a&&b)out.push({id:op.id,from:b.to,to:a.to,guide:false});
    else if(op.op==='SCALE'&&a)out.push({id:op.id,from:a.from,to:opPointId(op),guide:false});
  }
  return out;
}

/** The points that end an arrow and start none: the dot there would cover the arrow head, so the figure draws none (their name stays). */
export function vectorTipIds(plan){
  const arrows=vectorArrows(plan?.planeMarks);
  if(!arrows.length)return [];
  const tails=new Set(arrows.map(arrow=>arrow.from));
  return [...new Set(arrows.map(arrow=>arrow.to))].filter(id=>!tails.has(id));
}

/** The axis feet of a vector's tip when components is set: ids of the helper construction nodes, from the vector's id alone. */
export const componentIds=id=>({axisX:nodeIdOf(id,'Ax'),axisY:nodeIdOf(id,'Ay'),footX:nodeIdOf(id,'Fx'),footY:nodeIdOf(id,'Fy')});

const usesVectors=plan=>{const marks=plan?.planeMarks;return !!marks&&typeof marks==='object'&&(marks.vectors!==undefined||marks.vectorOps!==undefined);};

/** The plan with its vector rows unfolded (see the top of this file); a plan without vector rows is returned as it is. */
export function expandPlaneVectors(input){
  if(!usesVectors(input))return input;
  const plan=JSON.parse(JSON.stringify(input)),marks=plan.planeMarks;
  if(!plan.mathPlan||!Array.isArray(plan.mathPlan.nodes))bad('PLANE_MARKS_REQUIRE_PLANE_FIGURE');
  const recipe=plan.mathPlan.realization?.recipeId;
  if(recipe!==PLANE_RECIPE&&recipe!==COORDINATE_RECIPE)bad('PLANE_MARKS_REQUIRE_PLANE_FIGURE');
  const coordinate=recipe===COORDINATE_RECIPE;
  const nodes=plan.mathPlan.nodes,nodeIds=new Set(nodes.map(n=>n.id)),pointIds=new Set(nodes.filter(n=>n.outputType==='POINT').map(n=>n.id));
  const segments=plan.displaySegments=Array.isArray(plan.displaySegments)?plan.displaySegments:[];
  const taken=new Set([...segments.map(s=>s.id),...nodeIds]);
  for(const field of Object.keys(marks))if(field!=='vectors'&&field!=='vectorOps'&&Array.isArray(marks[field]))for(const row of marks[field])if(row&&typeof row.id==='string')taken.add(row.id);
  const claim=id=>{if(typeof id!=='string'||!ID.test(id))bad('MARK_ID_INVALID:vectors');if(taken.has(id))bad('MARK_ID_DUPLICATE:'+id);taken.add(id);};
  const newNode=(node)=>{if(!NODE_ID.test(node.id)||nodeIds.has(node.id))bad('MARK_ID_DUPLICATE:'+node.id);nodeIds.add(node.id);nodes.push({factRole:'DERIVED_INTERMEDIATE',...node});};
  const addDisplayed=(id,hidden)=>{
    if(Array.isArray(plan.displayPoints)&&!plan.displayPoints.includes(id))plan.displayPoints.push(id);
    if(hidden){
      plan.hiddenPointNames=Array.isArray(plan.hiddenPointNames)?plan.hiddenPointNames:[];
      if(!plan.hiddenPointNames.includes(id))plan.hiddenPointNames.push(id);
      if(plan.hiddenPointStyle!=='NONE'){plan.unmarkedPointNames=Array.isArray(plan.unmarkedPointNames)?plan.unmarkedPointNames:[];if(!plan.unmarkedPointNames.includes(id))plan.unmarkedPointNames.push(id);}
    }
  };
  const labels=marks.expressionLabels=Array.isArray(marks.expressionLabels)?marks.expressionLabels:[];
  const free=Array.isArray(marks.textLabels)?marks.textLabels:null;
  const labelRow=(row,ownerId)=>{
    if(row.label===undefined)return;
    if(typeof row.label!=='string'||!row.label.trim())bad('MARK_FIELD_INVALID:vectors.label:'+row.id);
    if(row.side!==undefined&&!VECTOR_SIDES.includes(row.side))bad('MARK_FIELD_INVALID:vectors.side:'+row.id);
    claim(row.id+'-text');
    labels.push({id:row.id+'-text',ownerSegment:ownerId,text:row.label,...(row.labelAt!==undefined?{labelAt:row.labelAt}:{}),...(row.side?{side:row.side}:{}),...(row.ownership!==undefined?{ownership:row.ownership}:{}),...(row.factRole?{factRole:row.factRole}:{})});
  };
  const arrowSegment=(row,id,from,to,{dashed=false,emphasis}={})=>{
    if(row.emphasis!==undefined&&!VECTOR_EMPHASIS.includes(row.emphasis))bad('DISPLAY_SEGMENT_EMPHASIS_INVALID:'+row.id);
    segments.push({id,refs:[from,to],arrow:'END',...(dashed?{dashed:true}:{}),...(emphasis?{emphasis}:{})});
  };

  // ---- vectors
  const vectors=rows(marks.vectors,'vectors'),byId=new Map(),pairs=new Set();
  for(const row of vectors){
    if(!row||typeof row!=='object'||Array.isArray(row))bad('MARK_FIELD_INVALID:vectors');
    keysOk(row,VECTOR_KEYS,'vectors');claim(row.id);
    if(typeof row.from!=='string'||typeof row.to!=='string'||row.from===row.to||!pointIds.has(row.from)||!pointIds.has(row.to))bad('VECTOR_ENDPOINT_INVALID:'+row.id);
    if(Array.isArray(plan.displayPoints)&&(!plan.displayPoints.includes(row.from)||!plan.displayPoints.includes(row.to)))bad('VECTOR_ENDPOINT_INVALID:'+row.id);
    if(pairs.has(row.from+'>'+row.to))bad('VECTOR_DUPLICATE:'+row.id);
    pairs.add(row.from+'>'+row.to);byId.set(row.id,row);
    if(row.dashed!==undefined&&typeof row.dashed!=='boolean')bad('DISPLAY_SEGMENT_STYLE_INVALID:'+row.id);
    arrowSegment(row,row.id,row.from,row.to,{dashed:row.dashed===true,emphasis:row.emphasis});
    labelRow(row,row.id);
  }

  // ---- components: the feet of the tip on the two axes
  for(const row of vectors){
    if(row.components===undefined&&row.componentLabels===undefined)continue;
    if(row.components!==true)bad('MARK_FIELD_INVALID:vectors.components:'+row.id);
    if(!coordinate)bad('VECTOR_COMPONENTS_REQUIRE_AXES:'+row.id);
    const ids=componentIds(row.id);
    newNode({id:ids.axisX,op:'SOURCE_LINE',inputs:[],args:{a:{kind:'integer',value:'0'},b:{kind:'integer',value:'1'},c:{kind:'integer',value:'0'}},outputType:'LINE'});
    newNode({id:ids.axisY,op:'SOURCE_LINE',inputs:[],args:{a:{kind:'integer',value:'1'},b:{kind:'integer',value:'0'},c:{kind:'integer',value:'0'}},outputType:'LINE'});
    newNode({id:ids.footX,op:'PERPENDICULAR_FOOT',inputs:[row.to,ids.axisX],args:{},outputType:'POINT'});
    newNode({id:ids.footY,op:'PERPENDICULAR_FOOT',inputs:[row.to,ids.axisY],args:{},outputType:'POINT'});
    addDisplayed(ids.footX,true);addDisplayed(ids.footY,true);
    claim(row.id+'-cx');claim(row.id+'-cy');
    segments.push({id:row.id+'-cx',refs:[row.to,ids.footX],dashed:true},{id:row.id+'-cy',refs:[row.to,ids.footY],dashed:true});
    if(row.componentLabels!==undefined){
      if(!Array.isArray(row.componentLabels)||row.componentLabels.length!==2||row.componentLabels.some(text=>typeof text!=='string'||!text.trim()))bad('MARK_FIELD_INVALID:vectors.componentLabels:'+row.id);
      if(!free&&!Array.isArray(marks.textLabels))marks.textLabels=[];
      for(const [text,foot,key,anchor] of [[row.componentLabels[0],ids.footX,'x','S'],[row.componentLabels[1],ids.footY,'y','W']]){
        claim(row.id+'-c'+key+'-text');
        marks.textLabels.push({id:row.id+'-c'+key+'-text',at:foot,text,anchor,labelKind:'MATH'});
      }
    }
  }

  // ---- vector operations
  for(const op of rows(marks.vectorOps,'vectorOps')){
    if(!op||typeof op!=='object'||Array.isArray(op))bad('MARK_FIELD_INVALID:vectorOps');
    keysOk(op,VECTOR_OP_KEYS,'vectorOps');claim(op.id);
    if(!VECTOR_OPS.includes(op.op))bad('MARK_FIELD_INVALID:vectorOps.op:'+op.id);
    const need=op.op==='SCALE'?1:2;
    if(!Array.isArray(op.of)||op.of.length!==need||op.of.some(id=>typeof id!=='string'))bad('MARK_FIELD_INVALID:vectorOps.of:'+op.id);
    const [a,b]=op.of.map(id=>byId.get(id)??bad('VECTOR_OP_UNKNOWN_VECTOR:'+op.id+':'+id));
    if(op.guides!==undefined&&(op.op!=='SUM'||!VECTOR_GUIDES.includes(op.guides)))bad('MARK_FIELD_INVALID:vectorOps.guides:'+op.id);
    if(op.k!==undefined&&op.op!=='SCALE')bad('MARK_FIELD_INVALID:vectorOps.k:'+op.id);
    if(op.point!==undefined&&(op.op==='DIFF'||typeof op.point!=='string'))bad('MARK_FIELD_INVALID:vectorOps.point:'+op.id);
    const emphasis=op.emphasis??'ACCENT';
    if(op.op==='DIFF'){
      if(a.from!==b.from)bad('VECTOR_OP_REQUIRES_COMMON_START:'+op.id);
      arrowSegment({...op,emphasis},op.id,b.to,a.to,{emphasis});
    }else if(op.op==='SUM'){
      if(a.from!==b.from)bad('VECTOR_OP_REQUIRES_COMMON_START:'+op.id);
      const end=opPointId(op),existing=pointIds.has(end);
      if(op.point!==undefined&&!existing&&!NODE_ID.test(end))bad('MARK_ID_INVALID:vectorOps.point:'+op.id);
      if(!existing){newNode({id:end,op:'VECTOR_SUM_POINT',inputs:[a.from,a.to,b.to],args:{},outputType:'POINT'});pointIds.add(end);addDisplayed(end,op.point===undefined);}
      else if(op.point===undefined)bad('MARK_ID_DUPLICATE:'+end);
      if(end===a.to||end===b.to||end===a.from)bad('VECTOR_SUM_DEGENERATE:'+op.id);
      arrowSegment({...op,emphasis},op.id,a.from,end,{emphasis});
      if(op.guides==='PARALLELOGRAM'){
        claim(op.id+'-g1');claim(op.id+'-g2');
        segments.push({id:op.id+'-g1',refs:[a.to,end],dashed:true},{id:op.id+'-g2',refs:[b.to,end],dashed:true});
      }else if(op.guides==='TRIANGLE'){
        claim(op.id+'-g1');
        segments.push({id:op.id+'-g1',refs:[a.to,end],arrow:'END',dashed:true});
      }
    }else{
      const k=parseScale(op.k);
      if(!k)bad('VECTOR_SCALE_INVALID:'+op.id);
      const end=opPointId(op),existing=pointIds.has(end);
      if(op.point!==undefined&&!existing&&!NODE_ID.test(end))bad('MARK_ID_INVALID:vectorOps.point:'+op.id);
      if(!existing){newNode({id:end,op:'VECTOR_SCALE_POINT',inputs:[a.from,a.to],args:{k:scalarJson(k)},outputType:'POINT'});pointIds.add(end);addDisplayed(end,op.point===undefined);}
      else if(op.point===undefined)bad('MARK_ID_DUPLICATE:'+end);
      if(end===a.from)bad('VECTOR_SCALE_INVALID:'+op.id);
      arrowSegment({...op,emphasis},op.id,a.from,end,{emphasis});
    }
    labelRow(op,op.id);
  }
  // a hidden point that ends an arrow (and starts none) keeps no dot either, whichever way the plan declared it hidden
  for(const id of vectorTipIds(plan))if(plan.hiddenPointStyle!=='NONE'&&(plan.hiddenPointNames||[]).includes(id)){
    plan.unmarkedPointNames=Array.isArray(plan.unmarkedPointNames)?plan.unmarkedPointNames:[];
    if(!plan.unmarkedPointNames.includes(id))plan.unmarkedPointNames.push(id);
  }
  return plan;
}

/**
 * The facts of the vector rows against the model's points (`at` gives a point's model coordinates): the arrows exist, a stated end point is where the construction puts it,
 * a sum is not degenerate, the tip of a component vector is off both axes. Throws the error code on the first violation.
 */
export function checkVectorFacts(plan,at){
  const marks=plan.planeMarks;
  if(!usesVectors(plan))return;
  const segs=new Map((plan.displaySegments||[]).map(s=>[s.id,s]));
  const close=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1])<=1e-9*Math.max(1,Math.abs(p[0]),Math.abs(p[1]),Math.abs(q[0]),Math.abs(q[1]));
  const cross=(u,v)=>u[0]*v[1]-u[1]*v[0];
  const sub=(p,q)=>[p[0]-q[0],p[1]-q[1]];
  for(const arrow of vectorArrows(marks)){
    const s=segs.get(arrow.id);
    if(!s||s.arrow!=='END'||s.refs[0]!==arrow.from||s.refs[1]!==arrow.to)bad('VECTOR_PLAN_NOT_EXPANDED:'+arrow.id);
    if(close(at(arrow.from),at(arrow.to)))bad('VECTOR_ENDPOINT_INVALID:'+arrow.id);
  }
  const byId=new Map(rows(marks.vectors,'vectors').map(v=>[v.id,v]));
  for(const row of rows(marks.vectors,'vectors')){
    if(row.components!==true)continue;
    const tip=at(row.to);
    if(Math.abs(tip[0])<=1e-9||Math.abs(tip[1])<=1e-9)bad('VECTOR_COMPONENT_DEGENERATE:'+row.id);
    const ids=componentIds(row.id);
    for(const [foot,want] of [[ids.footX,[tip[0],0]],[ids.footY,[0,tip[1]]]])if(!close(at(foot),want))bad('VECTOR_COMPONENT_MISMATCH:'+row.id);
  }
  for(const op of rows(marks.vectorOps,'vectorOps')){
    const vs=op.of.map(id=>byId.get(id));
    if(op.op==='SUM'){
      const [A,B,C]=[vs[0].from,vs[0].to,vs[1].to].map(at),D=at(opPointId(op));
      if(Math.abs(cross(sub(B,A),sub(C,A)))<=1e-9*Math.max(1,Math.hypot(...sub(B,A))*Math.hypot(...sub(C,A))))bad('VECTOR_SUM_DEGENERATE:'+op.id);
      if(!close(D,[B[0]+C[0]-A[0],B[1]+C[1]-A[1]]))bad('VECTOR_SUM_POINT_MISMATCH:'+op.id);
    }else if(op.op==='SCALE'){
      const k=parseScale(op.k),[A,B]=[vs[0].from,vs[0].to].map(at),P=at(opPointId(op)),f=Number(k.numerator)/Number(k.denominator);
      if(!close(P,[A[0]+f*(B[0]-A[0]),A[1]+f*(B[1]-A[1])]))bad('VECTOR_SCALE_MISMATCH:'+op.id);
    }else if(op.op==='DIFF'){
      if(close(at(vs[0].to),at(vs[1].to)))bad('VECTOR_ENDPOINT_INVALID:'+op.id);
    }
  }
}
