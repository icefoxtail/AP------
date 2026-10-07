/** Independent numeric reconstruction: consumes only primitives/operations, never producer coordinates. */
import {dependency} from './dependencies.mjs';
import {objectSha} from '../../pipeline-core/canonical.mjs';
function numericEnvelope(value) {
  if(!Number.isFinite(value)||Math.abs(value)>1e6||(value!==0&&Math.abs(value)<1e-9))throw Error('UNSUPPORTED_CINDY_NUMERIC_ENVELOPE');
  return value;
}
export function scalar(v,depth=0) {
  if(depth>24)throw Error('SCALAR_DEPTH');
  if(v.kind==='integer' && /^(0|-?[1-9][0-9]*)$/.test(v.value)){
    const exact=BigInt(v.value);
    if(exact>1000000n||exact< -1000000n)throw Error('UNSUPPORTED_CINDY_EXACT_INTEGER');
    return numericEnvelope(Number(exact));
  }
  if(v.kind==='rational' && /^(0|-?[1-9][0-9]*)$/.test(v.numerator) && /^[1-9][0-9]*$/.test(v.denominator)){
    const n=BigInt(v.numerator),d=BigInt(v.denominator);
    // Deliberately conservative peer scope: preserve operand precision before
    // division, and reject ratios too sensitive for the numeric branch policy.
    if(n>1000000000n||n< -1000000000n||d>1000000000n)throw Error('UNSUPPORTED_CINDY_EXACT_RATIONAL');
    return numericEnvelope(Number(n)/Number(d));
  }
  if(v.kind==='constant' && ['pi','e'].includes(v.name))return v.name==='pi'?Math.PI:Math.E;
  if(v.kind==='expression'){
    const a=v.args.map(x=>scalar(x,depth+1));
    const ops={sqrt:()=>Math.sqrt(a[0]),neg:()=>-a[0],add:()=>a[0]+a[1],sub:()=>a[0]-a[1],mul:()=>a[0]*a[1],div:()=>a[0]/a[1],pow:()=>a[0]**a[1]};
    if(Object.hasOwn(ops,v.op)){
      const result=numericEnvelope(ops[v.op]());
      if(['sub','add'].includes(v.op)&&result!==0&&Math.abs(result)<=1e-9*Math.max(1,...a.map(Math.abs)))throw Error('UNSUPPORTED_CINDY_CANCELLATION');
      return result;
    }
  }
  throw Error('UNSUPPORTED_CINDY_SCALAR');
}
export function reconstruct(graph) {
  if(graph.schemaVersion!=='construction-spike-v1')throw Error('UNSUPPORTED_CINDY_GRAPH');
  const Cindy=dependency('cindyjs/build/js/Cindy.js');
  const nodes=new Map(graph.nodes.map(n=>[n.id,n]));
  if(nodes.size!==graph.nodes.length)throw Error('DUPLICATE_NODE');
  const done=new Set(),geometry=[],pointIds=[],selections=[],angleBisectors=[],scalarNodes=[],pointSetIds=[],lineLineSets=new Set(),geometryNames=new Set();
  const addGeometry=value=>{if(geometryNames.has(value.name))throw Error('DUPLICATE_CINDY_GEOMETRY:'+value.name);geometryNames.add(value.name);geometry.push(value);};
  let pending=[...nodes.values()].sort((a,b)=>a.id.localeCompare(b.id));
  while(pending.length) {
    const ready=pending.filter(n=>[...n.inputs,...(n.branch?.refs||[])].every(r=>done.has(r)));
    if(!ready.length)throw Error('CINDY_REFERENCE_OR_CYCLE');
    for(const n of ready) {
      if(!/^[A-Za-z][A-Za-z0-9]{0,31}$/.test(n.id))throw Error('INVALID_NODE_NAME');
      const base={name:n.id,args:n.inputs};
      if(n.op==='SOURCE_POINT')addGeometry({...base,type:'Free',pos:n.args.coordinates.map(scalar)});
      else if(n.op==='NORMALIZATION_ORIGIN')addGeometry({...base,type:'Free',pos:[0,0]});
      else if(n.op==='NORMALIZATION_AXIS')addGeometry({...base,type:'Free',pos:[scalar(n.args.length),0]});
      else if(n.op==='MIDPOINT')addGeometry({...base,type:'Mid'});
      else if(n.op==='LINE_THROUGH')addGeometry({...base,type:'Join'});
      else if(n.op==='PARALLEL_THROUGH')addGeometry({...base,type:'Para',args:[n.inputs[1],n.inputs[0]]});
      else if(n.op==='ANGLE_BISECTOR'){
        const [first,vertex,last]=n.inputs,rayA='Z'+n.id+'RayA',rayB='Z'+n.id+'RayB',set='Z'+n.id+'Bisectors';
        addGeometry({name:rayA,type:'Join',args:[vertex,first]});addGeometry({name:rayB,type:'Join',args:[vertex,last]});
        addGeometry({name:set,type:'AngleBisector',args:[rayA,rayB,vertex]});addGeometry({...base,type:'SelectL',args:[set],index:1});angleBisectors.push({node:n,set,first,vertex,last});
      }
      else if(n.op==='PERPENDICULAR_FOOT'){
        const helper='Z'+n.id+'Perp';addGeometry({name:helper,type:'Perp',args:[n.inputs[1],n.inputs[0]]});
        addGeometry({...base,type:'Meet',args:[n.inputs[1],helper]});
      }
      else if(n.op==='CIRCLE_CENTER_RADIUS')addGeometry({...base,type:'CircleMr',radius:scalar(n.args.radius)});
      else if(n.op==='CIRCLE_THROUGH_3')addGeometry({...base,type:'CircleBy3'});
      else if(n.op==='CIRCLE_THROUGH_POINT')addGeometry({...base,type:'CircleMP'});
      else if(n.op==='TANGENT_AT_POINT')addGeometry({...base,type:'PolarOfPoint',args:[n.inputs[1],n.inputs[0]]});
      else if(['SEGMENT_LENGTH','SCALAR_SQUARE','SCALAR_RATIO'].includes(n.op))scalarNodes.push(n);
      else if(n.op==='LINE_INTERSECTION')addGeometry({...base,type:'Meet'});
      else if(n.op==='INTERSECTION'){
        const types=n.inputs.map(r=>nodes.get(r).outputType);
        const type=types.join(',')==='LINE,CIRCLE'?'IntersectLC':types.join(',')==='CIRCLE,LINE'?'IntersectLC':types.join(',')==='CIRCLE,CIRCLE'?'IntersectCirCir':types.join(',')==='LINE,LINE'?'Meet':null;
        if(!type)throw Error('UNSUPPORTED_CINDY_INTERSECTION');
        if(types.join(',')==='CIRCLE,LINE')addGeometry({...base,type,args:[n.inputs[1],n.inputs[0]]});else addGeometry({...base,type});
        if(type==='Meet')lineLineSets.add(n.id);else pointSetIds.push(n.id);
      }
      else if(n.op==='SELECT_POINT'){
        if(n.branch?.kind!=='SIDE_OF_ORIENTED_LINE' || ![-1,1].includes(n.branch.sign))throw Error('INVALID_BRANCH');
        // Expose both roots and a provisional branch-selected point. The final
        // Cindy pass pins its index from the independently checked side test.
        for(const index of [1,2])addGeometry({name:n.id+'Root'+index,type:'SelectP',args:n.inputs,index});
        addGeometry({...base,type:'SelectP',index:1});selections.push(n);pointSetIds.push(n.inputs[0]);
      }
      else throw Error('UNSUPPORTED_CINDY_OPERATION');
      if(n.outputType==='POINT')pointIds.push(n.id);
      done.add(n.id);
    }
    pending=pending.filter(n=>!done.has(n.id));
  }
  for(const id of pointSetIds){
    for(const index of [1,2]){
      const name=id+'Root'+index;
      if(!geometryNames.has(name))addGeometry({name,type:'SelectP',args:[id],index});
    }
  }
  let activeGeometry;
  function instanceFor(){
    activeGeometry=geometry.map(value=>({...value,...(value.args?{args:[...value.args]}:{}),...(value.pos?{pos:[...value.pos]}:{})}));
    return Cindy({isNode:true,geometry:activeGeometry,ports:[],scripts:{}});
  }
  let instance=instanceFor();
  try {
    function point(id) {
      const v=instance.evalcs(id+'.xy');
      if(v.ctype!=='list' || v.value.length!==2 || v.value.some(n=>n.ctype!=='number'||Math.abs(n.value.imag)>1e-9||!Number.isFinite(n.value.real)))throw Error('CINDY_NONREAL_OR_INFINITE:'+id);
      return v.value.map(n=>n.value.real);
    }
    function lineVector(name){
      const value=instance.evalcs(name+'.homog');
      if(value.ctype!=='list'||value.value.length!==3||value.value.some(n=>n.ctype!=='number'||Math.abs(n.value.imag)>1e-9||!Number.isFinite(n.value.real)))throw Error('CINDY_LINE_NOT_FINITE');
      return value.value.map(n=>n.value.real);
    }
    function pointSet(name){
      return [point(name+'Root1'),point(name+'Root2')];
    }
    const points=Object.fromEntries(pointIds.map(id=>[id,point(id)]));
    for(const n of selections){
      const [p,q]=n.branch.refs.map(id=>points[id]);
      const roots=[point(n.id+'Root1'),point(n.id+'Root2')];
      const matches=roots.map((v,index)=>({v,index:index+1,cross:((q[0]-p[0])*(v[1]-p[1])-(q[1]-p[1])*(v[0]-p[0]))*n.branch.sign})).filter(row=>row.cross>1e-10);
      if(matches.length!==1)throw Error('AMBIGUOUS_CINDY_BRANCH');
      const selected=geometry.find(value=>value.name===n.id);selected.index=matches[0].index;selected.param=matches[0].index-1;
    }
    for(const row of angleBisectors){
      const p=points[row.vertex],a=points[row.first],b=points[row.last],u=[a[0]-p[0],a[1]-p[1]],v=[b[0]-p[0],b[1]-p[1]],nu=Math.hypot(...u),nv=Math.hypot(...v);
      if(nu<=1e-10||nv<=1e-10)throw Error('DEGENERATE_CINDY_ANGLE_RAY');
      const mode=row.node.args.mode,d=[u[0]/nu+(mode==='INTERNAL'?1:-1)*v[0]/nv,u[1]/nu+(mode==='INTERNAL'?1:-1)*v[1]/nv];
      if(Math.hypot(...d)<=1e-10)throw Error('DEGENERATE_CINDY_ANGLE_BISECTOR');
      const expected=[-d[1],d[0],d[1]*p[0]-d[0]*p[1]],setObject=activeGeometry.find(value=>value.name===row.set),candidates=setObject?.results?.value;
      if(!Array.isArray(candidates)||candidates.length!==2)throw Error('CINDY_ANGLE_BISECTOR_SET_INVALID');
      const residual=candidate=>{
        if(candidate.ctype!=='list'||candidate.value.length!==3||candidate.value.some(value=>value.ctype!=='number'||Math.abs(value.value.imag)>1e-9))return Infinity;
        const values=candidate.value.map(value=>value.value.real),magnitude=Math.hypot(...values),targetMagnitude=Math.hypot(...expected);
        if(magnitude<=1e-12||targetMagnitude<=1e-12)return Infinity;
        const normalized=values.map(value=>value/magnitude),target=expected.map(value=>value/targetMagnitude);
        return Math.min(Math.hypot(...normalized.map((value,index)=>value-target[index])),Math.hypot(...normalized.map((value,index)=>value+target[index])));
      };
      const deltas=candidates.map(residual),index=deltas[0]<=deltas[1]?1:2;
      if(!Number.isFinite(deltas[index-1])||deltas[index-1]>1e-7||Math.abs(deltas[0]-deltas[1])<1e-8)throw Error('AMBIGUOUS_CINDY_ANGLE_BISECTOR_KIND');
      const selected=geometry.find(value=>value.name===row.node.id);selected.index=index;selected.param=index-1;
    }
    if(selections.length||angleBisectors.length){instance.shutdown();instance=instanceFor();}
    const finalPoints=Object.fromEntries(pointIds.map(id=>[id,point(id)]));
    const pointSets=Object.fromEntries([...new Set(pointSetIds)].map(id=>[id,pointSet(id)]));
    const scalars={};
    for(const n of scalarNodes){
      if(n.op==='SEGMENT_LENGTH'){
        const [a,b]=n.inputs.map(id=>finalPoints[id]);
        const value=instance.evalcs('dist(['+a.join(',')+'],['+b.join(',')+'])');
        if(value.ctype!=='number'||Math.abs(value.value.imag)>1e-9||!Number.isFinite(value.value.real))throw Error('INVALID_CINDY_DISTANCE');
        scalars[n.id]=value.value.real;
      }else if(n.op==='SCALAR_SQUARE')scalars[n.id]=scalars[n.inputs[0]]**2;
      else if(n.op==='SCALAR_RATIO'){
        const denominator=scalars[n.inputs[1]];if(Math.abs(denominator)<=1e-12)throw Error('CINDY_SCALAR_DIVISION_ZERO');scalars[n.id]=scalars[n.inputs[0]]/denominator;
      }
    }
    const lines={},circles={};
    for(const n of graph.nodes){
      if(n.outputType==='LINE')lines[n.id]=lineVector(n.id);
      if(n.outputType==='CIRCLE'){
        const matrix=instance.evalcs(n.id+'.matrix');
        if(matrix.ctype!=='list'||matrix.value.length!==3||matrix.value.some(row=>row.ctype!=='list'||row.value.length!==3||row.value.some(value=>value.ctype!=='number'||Math.abs(value.value.imag)>1e-9)))throw Error('CINDY_CIRCLE_MATRIX_INVALID');
        const q=matrix.value.map(row=>row.value.map(value=>value.value.real)),scale=q[0][0];
        if(Math.abs(scale)<=1e-12||Math.abs(q[1][1]-scale)>1e-7*Math.max(1,Math.abs(scale))||Math.abs(q[0][1])>1e-7*Math.max(1,Math.abs(scale)))throw Error('CINDY_NONCIRCLE_CONIC');
        const h=-q[0][2]/scale,k=-q[1][2]/scale,r2=h*h+k*k-q[2][2]/scale;
        if(!Number.isFinite(r2)||r2<=0)throw Error('CINDY_CIRCLE_NOT_REAL');
        circles[n.id]={center:[h,k],radius:Math.sqrt(r2)};
      }
    }
    for(const id of lineLineSets)pointSets[id]=[finalPoints[id]];
    const conditionAudits=(graph.conditionAudits||[]).map(condition=>{
      const refs=condition.refs,kind=condition.kind,tolerance=1e-8;let observed,expected,checks,valid=false;
      if(kind==='INCIDENCE_POINT_ON_LINE'){
        const [px,py]=finalPoints[refs[0]],[a,b,c]=lines[refs[1]];observed=a*px+b*py+c;checks=['POINT_ON_LINE'];valid=Math.abs(observed)<=tolerance;
      }else if(kind==='DISTANCE_EQUALS'){
        const distance=Math.hypot(...finalPoints[refs[0]].map((value,index)=>value-finalPoints[refs[1]][index]));expected=scalar(condition.expected);observed=distance;checks=['EXACT_POINT_DISTANCE'];valid=Math.abs(distance-expected)<=tolerance;
      }else if(kind==='EQUAL_DISTANCE'){
        const d1=Math.hypot(...finalPoints[refs[0]].map((value,index)=>value-finalPoints[refs[1]][index])),d2=Math.hypot(...finalPoints[refs[2]].map((value,index)=>value-finalPoints[refs[3]][index]));observed=d1-d2;checks=['DISTANCES_EQUAL'];valid=Math.abs(observed)<=tolerance;
      }else if(kind==='MIDPOINT_RATIO'){
        const [start,middle,end]=refs.map(id=>finalPoints[id]),expectedRatio=scalar(condition.expected),dx=end[0]-start[0],dy=end[1]-start[1],cross=dx*(middle[1]-start[1])-dy*(middle[0]-start[0]),dot=(middle[0]-start[0])*(middle[0]-end[0])+(middle[1]-start[1])*(middle[1]-end[1]),d1=Math.hypot(middle[0]-start[0],middle[1]-start[1]),d2=Math.hypot(middle[0]-end[0],middle[1]-end[1]);
        if(d2<=tolerance)throw Error('CINDY_MIDPOINT_RATIO_ZERO_DENOMINATOR');observed=d1/d2;expected=expectedRatio;checks=['COLLINEAR','BETWEEN_ENDPOINTS','DISTANCE_RATIO'];valid=Math.abs(cross)<=tolerance&&dot<=tolerance&&Math.abs(observed-expected)<=tolerance;
      }else if(kind==='PARALLEL'||kind==='PERPENDICULAR'){
        const [a,b]=refs.map(id=>lines[id]);observed=kind==='PARALLEL'?a[0]*b[1]-a[1]*b[0]:a[0]*b[0]+a[1]*b[1];checks=[kind==='PARALLEL'?'DIRECTION_VECTORS_PARALLEL':'DIRECTION_VECTORS_PERPENDICULAR'];valid=Math.abs(observed)<=tolerance;
      }else if(kind==='CIRCLE_MEMBERSHIP'){
        const circleData=circles[refs[0]],[px,py]=finalPoints[refs[1]];observed=Math.hypot(px-circleData.center[0],py-circleData.center[1])-circleData.radius;checks=['POINT_ON_CIRCLE'];valid=Math.abs(observed)<=tolerance;
      }else if(kind==='TANGENCY_AT_POINT'){
        const circleData=circles[refs[0]],[px,py]=finalPoints[refs[1]],[a,b,c]=lines[refs[2]],radial=[px-circleData.center[0],py-circleData.center[1]];const radiusResidual=Math.hypot(...radial)-circleData.radius,lineResidual=a*px+b*py+c,perpendicularResidual=a*radial[1]-b*radial[0];observed=Math.hypot(radiusResidual,lineResidual,perpendicularResidual);checks=['POINT_ON_CIRCLE','TANGENT_CONTAINS_CONTACT','TANGENT_PERPENDICULAR_TO_RADIUS'];valid=Math.abs(radiusResidual)<=tolerance&&Math.abs(lineResidual)<=tolerance&&Math.abs(perpendicularResidual)<=tolerance;
      }else if(kind==='ORIENTED_SIDE'){
        const [p,q,target]=refs.map(id=>finalPoints[id]);observed=((q[0]-p[0])*(target[1]-p[1])-(q[1]-p[1])*(target[0]-p[0]))*condition.sign;checks=['STRICT_ORIENTED_HALF_PLANE'];valid=observed>tolerance;
      }else throw Error('CINDY_UNSUPPORTED_CONDITION_AUDIT:'+kind);
      if(!valid)throw Error('CINDY_CONDITION_AUDIT_FAIL:'+condition.id+':'+kind);
      return {id:condition.id,sourceConditionId:condition.sourceConditionId,kind,status:'PASS',checks,observed,...(expected!==undefined?{expected}:{})};
    });
    return {engine:'CindyJS',version:'0.0.5',verificationKind:'NUMERIC_PEER_NOT_EXACT_PROOF',numericPolicy:'CINDY_SAFE_ENVELOPE_v1',inputSha256:objectSha(graph),points:finalPoints,scalars,lines,circles,pointSets,conditionAudits};
  } finally {instance.shutdown();}
}
export function compareReconstruction(snapshot, observation, tolerance=1e-8) {
  if(!Number.isFinite(tolerance)||tolerance<=0||tolerance>1e-8)throw Error('INVALID_OBSERVER_TOLERANCE');
  for(const value of Object.values(snapshot.points))if(value.exact)value.exact.forEach(v=>scalar(v));
  for(const value of Object.values(snapshot.scalars||{}))if(value.exact)scalar(value.exact);
  const expected=Object.keys(snapshot.points).sort(),actual=Object.keys(observation.points).sort();
  if(JSON.stringify(expected)!==JSON.stringify(actual))return {status:'FAIL',errors:['POINT_COVERAGE_MISMATCH']};
  const rows=expected.map(id=>({id,delta:Math.hypot(...snapshot.points[id].approximation.map((v,i)=>v-observation.points[id][i]))}));
  const scalarIds=Object.keys(snapshot.scalars||{}).sort();
  if(JSON.stringify(scalarIds)!==JSON.stringify(Object.keys(observation.scalars||{}).sort()))return {status:'FAIL',errors:['SCALAR_COVERAGE_MISMATCH']};
  rows.push(...scalarIds.map(id=>({id,delta:Math.abs(snapshot.scalars[id].approximation-observation.scalars[id])})));
  const lineIds=Object.keys(snapshot.lines||{}).sort();
  if(JSON.stringify(lineIds)!==JSON.stringify(Object.keys(observation.lines||{}).sort()))return {status:'FAIL',errors:['LINE_COVERAGE_MISMATCH']};
  for(const id of lineIds){
    const left=snapshot.lines[id].approximation,right=observation.lines[id],ln=Math.hypot(...left),rn=Math.hypot(...right);
    const delta=ln<=1e-12||rn<=1e-12?Infinity:Math.min(Math.hypot(...left.map((value,index)=>value/ln-right[index]/rn)),Math.hypot(...left.map((value,index)=>value/ln+right[index]/rn)));
    rows.push({id,delta});
  }
  const circleIds=Object.keys(snapshot.circles||{}).sort();
  if(JSON.stringify(circleIds)!==JSON.stringify(Object.keys(observation.circles||{}).sort()))return {status:'FAIL',errors:['CIRCLE_COVERAGE_MISMATCH']};
  for(const id of circleIds){const left=snapshot.circles[id].approximation,right=observation.circles[id];rows.push({id,delta:Math.hypot(left[0]-right.center[0],left[1]-right.center[1],left[2]-right.radius)});}
  const setIds=Object.keys(snapshot.pointSets||{}).sort();
  if(JSON.stringify(setIds)!==JSON.stringify(Object.keys(observation.pointSets||{}).sort()))return {status:'FAIL',errors:['POINT_SET_COVERAGE_MISMATCH']};
  for(const id of setIds){
    const left=snapshot.pointSets[id],right=observation.pointSets[id];if(left.length!==right.length)return {status:'FAIL',errors:['POINT_SET_CARDINALITY_MISMATCH:'+id]};
    const unmatched=[...right];for(const point of left){let best=-1,bestDelta=Infinity;for(let index=0;index<unmatched.length;index++){const delta=Math.hypot(...point.approximation.map((value,i)=>value-unmatched[index][i]));if(delta<bestDelta){bestDelta=delta;best=index;}}if(best<0)return {status:'FAIL',errors:['POINT_SET_MEMBER_MISMATCH:'+id]};rows.push({id:id+':member',delta:bestDelta});unmatched.splice(best,1);}
  }
  const conditions=snapshot.conditionAudits||[],peerConditions=observation.conditionAudits||[];
  if(JSON.stringify(conditions.map(value=>value.id).sort())!==JSON.stringify(peerConditions.map(value=>value.id).sort()))return {status:'FAIL',errors:['CONDITION_AUDIT_COVERAGE_MISMATCH']};
  const peerById=new Map(peerConditions.map(value=>[value.id,value]));
  for(const condition of conditions){const peer=peerById.get(condition.id);if(peer.kind!==condition.kind||peer.sourceConditionId!==condition.sourceConditionId||peer.status!==condition.status||JSON.stringify(peer.checks)!==JSON.stringify(condition.checks))return {status:'FAIL',errors:['CONDITION_AUDIT_PEER_MISMATCH:'+condition.id]};}
  return {status:rows.every(r=>r.delta<=tolerance)?'PASS':'FAIL',rows,tolerance};
}
