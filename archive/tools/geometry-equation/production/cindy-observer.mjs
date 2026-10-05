/** Independent numeric reconstruction: consumes only primitives/operations, never producer coordinates. */
import {dependency} from './dependencies.mjs';
import {objectSha} from '../../pipeline-core/canonical.mjs';
function scalar(v,depth=0) {
  if(depth>24)throw Error('SCALAR_DEPTH');
  if(v.kind==='integer' && /^(0|-?[1-9][0-9]*)$/.test(v.value))return Number(v.value);
  if(v.kind==='rational' && /^(0|-?[1-9][0-9]*)$/.test(v.numerator) && /^[1-9][0-9]*$/.test(v.denominator))return Number(v.numerator)/Number(v.denominator);
  if(v.kind==='constant' && ['pi','e'].includes(v.name))return v.name==='pi'?Math.PI:Math.E;
  if(v.kind==='expression'){
    const a=v.args.map(x=>scalar(x,depth+1));
    const ops={sqrt:()=>Math.sqrt(a[0]),neg:()=>-a[0],add:()=>a[0]+a[1],sub:()=>a[0]-a[1],mul:()=>a[0]*a[1],div:()=>a[0]/a[1],pow:()=>a[0]**a[1]};
    if(ops[v.op])return ops[v.op]();
  }
  throw Error('UNSUPPORTED_CINDY_SCALAR');
}
export function reconstruct(graph) {
  if(graph.schemaVersion!=='construction-spike-v1')throw Error('UNSUPPORTED_CINDY_GRAPH');
  const Cindy=dependency('cindyjs/build/js/Cindy.js');
  const nodes=new Map(graph.nodes.map(n=>[n.id,n]));
  if(nodes.size!==graph.nodes.length)throw Error('DUPLICATE_NODE');
  const done=new Set(),geometry=[],pointIds=[],selections=[],scalarNodes=[];
  let pending=[...nodes.values()].sort((a,b)=>a.id.localeCompare(b.id));
  while(pending.length) {
    const ready=pending.filter(n=>[...n.inputs,...(n.branch?.refs||[])].every(r=>done.has(r)));
    if(!ready.length)throw Error('CINDY_REFERENCE_OR_CYCLE');
    for(const n of ready) {
      if(!/^[A-Za-z][A-Za-z0-9]{0,31}$/.test(n.id))throw Error('INVALID_NODE_NAME');
      const base={name:n.id,args:n.inputs};
      if(n.op==='SOURCE_POINT')geometry.push({...base,type:'Free',pos:n.args.coordinates.map(scalar)});
      else if(n.op==='NORMALIZATION_ORIGIN')geometry.push({...base,type:'Free',pos:[0,0]});
      else if(n.op==='NORMALIZATION_AXIS')geometry.push({...base,type:'Free',pos:[scalar(n.args.length),0]});
      else if(n.op==='MIDPOINT')geometry.push({...base,type:'Mid'});
      else if(n.op==='LINE_THROUGH')geometry.push({...base,type:'Join'});
      else if(n.op==='PERPENDICULAR_FOOT'){
        const helper='Z'+n.id+'Perp';geometry.push({name:helper,type:'Perp',args:[n.inputs[1],n.inputs[0]]});
        geometry.push({...base,type:'Meet',args:[n.inputs[1],helper]});
      }
      else if(n.op==='CIRCLE_CENTER_RADIUS')geometry.push({...base,type:'CircleMr',radius:scalar(n.args.radius)});
      else if(['SEGMENT_LENGTH','SCALAR_SQUARE'].includes(n.op))scalarNodes.push(n);
      else if(n.op==='INTERSECTION'){
        const types=n.inputs.map(r=>nodes.get(r).outputType);
        const type=types.join(',')==='LINE,CIRCLE'?'IntersectLC':types.join(',')==='CIRCLE,CIRCLE'?'IntersectCirCir':null;
        if(!type)throw Error('UNSUPPORTED_CINDY_INTERSECTION');
        geometry.push({...base,type});
      }
      else if(n.op==='SELECT_POINT'){
        if(n.branch?.kind!=='SIDE_OF_ORIENTED_LINE' || ![-1,1].includes(n.branch.sign))throw Error('INVALID_BRANCH');
        // Expose both Cindy roots; choose by a source guard independently below.
        for(const index of [1,2])geometry.push({name:n.id+'Root'+index,type:'SelectP',args:n.inputs,index});
        selections.push(n);
        // Downstream dependent operations are deliberately outside this spike.
        if(graph.nodes.some(v=>(v.inputs.includes(n.id) || v.branch?.refs.includes(n.id)) && !['SEGMENT_LENGTH','SCALAR_SQUARE'].includes(v.op)))throw Error('UNSUPPORTED_CINDY_SELECTED_DESCENDANT');
      }
      else throw Error('UNSUPPORTED_CINDY_OPERATION');
      if(n.outputType==='POINT' && n.op!=='SELECT_POINT')pointIds.push(n.id);
      done.add(n.id);
    }
    pending=pending.filter(n=>!done.has(n.id));
  }
  const instance=Cindy({isNode:true,geometry,ports:[],scripts:{}});
  try {
    function point(id) {
      const v=instance.evalcs(id+'.xy');
      if(v.ctype!=='list' || v.value.length!==2 || v.value.some(n=>n.ctype!=='number'||Math.abs(n.value.imag)>1e-9||!Number.isFinite(n.value.real)))throw Error('CINDY_NONREAL_OR_INFINITE');
      return v.value.map(n=>n.value.real);
    }
    const points=Object.fromEntries(pointIds.map(id=>[id,point(id)]));
    for(const n of selections){
      const [p,q]=n.branch.refs.map(id=>points[id]);
      const roots=[point(n.id+'Root1'),point(n.id+'Root2')];
      const matches=roots.filter(v=>((q[0]-p[0])*(v[1]-p[1])-(q[1]-p[1])*(v[0]-p[0]))*n.branch.sign>1e-10);
      if(matches.length!==1)throw Error('AMBIGUOUS_CINDY_BRANCH');
      points[n.id]=matches[0];
    }
    const scalars={};
    for(const n of scalarNodes){
      if(n.op==='SEGMENT_LENGTH'){
        const [a,b]=n.inputs.map(id=>points[id]);
        const value=instance.evalcs('dist(['+a.join(',')+'],['+b.join(',')+'])');
        if(value.ctype!=='number'||Math.abs(value.value.imag)>1e-9||!Number.isFinite(value.value.real))throw Error('INVALID_CINDY_DISTANCE');
        scalars[n.id]=value.value.real;
      }else scalars[n.id]=scalars[n.inputs[0]]**2;
    }
    return {engine:'CindyJS',version:'0.0.5',inputSha256:objectSha(graph),points,scalars};
  } finally {instance.shutdown();}
}
export function compareReconstruction(snapshot, observation, tolerance=1e-8) {
  if(!Number.isFinite(tolerance)||tolerance<=0||tolerance>1e-8)throw Error('INVALID_OBSERVER_TOLERANCE');
  const expected=Object.keys(snapshot.points).sort(),actual=Object.keys(observation.points).sort();
  if(JSON.stringify(expected)!==JSON.stringify(actual))return {status:'FAIL',errors:['POINT_COVERAGE_MISMATCH']};
  const rows=expected.map(id=>({id,delta:Math.hypot(...snapshot.points[id].approximation.map((v,i)=>v-observation.points[id][i]))}));
  const scalarIds=Object.keys(snapshot.scalars||{}).sort();
  if(JSON.stringify(scalarIds)!==JSON.stringify(Object.keys(observation.scalars||{}).sort()))return {status:'FAIL',errors:['SCALAR_COVERAGE_MISMATCH']};
  rows.push(...scalarIds.map(id=>({id,delta:Math.abs(snapshot.scalars[id].approximation-observation.scalars[id])})));
  return {status:rows.every(r=>r.delta<=tolerance)?'PASS':'FAIL',rows,tolerance};
}
