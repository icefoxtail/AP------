import {objectSha,canonicalJson,isObject,HASH_PATTERN} from '../../pipeline-core/canonical.mjs';
import {validateScalar} from './contracts.mjs';
import {pythonWorker} from './worker.mjs';
import {reconstruct,compareReconstruction} from './cindy-observer.mjs';

export const PARAMETER_SPEC_VERSION='construction-parameter-spec-v1';
export const PARAMETER_VALUES_VERSION='construction-parameter-values-v1';
export const PARAMETER_RECOMPUTE_VERSION='construction-parameter-recompute-v1';
const CAPABILITY='construction-spike-v1';
const NAME=/^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const MAX_SLOTS=128;
// The only literal typed scalars a slot may replace; paths are relative to node.args.
const FREE_NODE_ARGS={SOURCE_POINT:[['coordinates',0],['coordinates',1]],NORMALIZATION_AXIS:[['length']],CIRCLE_CENTER_RADIUS:[['radius']]};
const EXPECTED_KINDS=['DISTANCE_EQUALS','MIDPOINT_RATIO'];

// Input errors carry `parameterInput` so recompute can report them; anything else is a defect and propagates.
function fail(code,detail=null){const error=Error(code);error.code=code;error.detail=detail;error.parameterInput=true;throw error;}
const plain=value=>isObject(value)&&Object.getPrototypeOf(value)===Object.prototype;
const exactKeys=(value,keys,code,detail)=>{if(!plain(value)||Object.keys(value).sort().join()!==[...keys].sort().join())fail(code,detail);};
const digest=value=>{try{return objectSha(value);}catch(error){fail(error.code||'PARAMETER_INPUT_NOT_CANONICAL',{cause:error.message});}};
const exactLiteral=(value,detail)=>{try{validateScalar(value);}catch(error){fail(error.message,detail);}return value;};
const isRational=value=>plain(value)&&(value.kind==='integer'||value.kind==='rational');
const rational=value=>value.kind==='integer'?{n:BigInt(value.value),d:1n}:{n:BigInt(value.numerator),d:BigInt(value.denominator)};
const compare=(a,b)=>{const left=a.n*b.d,right=b.n*a.d;return left<right?-1:left>right?1:0;};
const baseRational=literal=>{try{validateScalar(literal);}catch{return null;}return isRational(literal)?rational(literal):null;};
const pathPart=part=>typeof part==='string'||(Number.isSafeInteger(part)&&part>=0);

function checkSpec(spec){
  exactKeys(spec,['schemaVersion','baseGraphSha256','slots'],'INVALID_PARAMETER_SPEC');
  if(spec.schemaVersion!==PARAMETER_SPEC_VERSION||!HASH_PATTERN.test(spec.baseGraphSha256)||!Array.isArray(spec.slots)||spec.slots.length<1||spec.slots.length>MAX_SLOTS)fail('INVALID_PARAMETER_SPEC');
  const ids=new Set(),targets=new Set();
  for(const slot of spec.slots){
    exactKeys(slot,['id','target','domain'],'INVALID_PARAMETER_SPEC');
    const detail={slotId:typeof slot.id==='string'?slot.id:null},{target}=slot;
    if(typeof slot.id!=='string'||!NAME.test(slot.id))fail('INVALID_PARAMETER_SPEC',detail);
    if(ids.has(slot.id))fail('DUPLICATE_PARAMETER_SLOT',detail);
    ids.add(slot.id);
    if(plain(target)&&target.kind==='NODE_ARG'){
      exactKeys(target,['kind','nodeId','path'],'INVALID_PARAMETER_SPEC',detail);
      if(typeof target.nodeId!=='string'||!Array.isArray(target.path)||!target.path.length||!target.path.every(pathPart))fail('INVALID_PARAMETER_SPEC',detail);
    }else if(plain(target)&&target.kind==='CONDITION_EXPECTED'){
      exactKeys(target,['kind','conditionId'],'INVALID_PARAMETER_SPEC',detail);
      if(typeof target.conditionId!=='string')fail('INVALID_PARAMETER_SPEC',detail);
    }else fail('INVALID_PARAMETER_SPEC',detail);
    const key=canonicalJson(target);
    if(targets.has(key))fail('DUPLICATE_PARAMETER_TARGET',detail);
    targets.add(key);
    exactKeys(slot.domain,['min','max'],'INVALID_PARAMETER_SPEC',detail);
    const [min,max]=['min','max'].map(side=>{const literal=exactLiteral(slot.domain[side],detail);if(!isRational(literal))fail('INVALID_PARAMETER_DOMAIN',detail);return rational(literal);});
    if(compare(min,max)>0)fail('INVALID_PARAMETER_DOMAIN',detail);
  }
}

// Locate the literal a slot may replace, or reject it: only SOURCE_POINT coordinates, NORMALIZATION_AXIS.length,
// CIRCLE_CENTER_RADIUS.radius and DISTANCE_EQUALS/MIDPOINT_RATIO.expected are free.
function resolve(graph,slot){
  const {target}=slot,detail={slotId:slot.id};
  if(target.kind==='CONDITION_EXPECTED'){
    const audit=(graph.conditionAudits??[]).find(row=>isObject(row)&&row.id===target.conditionId);
    if(!audit||!EXPECTED_KINDS.includes(audit.kind)||!Object.hasOwn(audit,'expected'))fail('PARAMETER_TARGET_NOT_FREE',detail);
    return {holder:audit,key:'expected'};
  }
  const owner=graph.nodes.find(row=>isObject(row)&&row.id===target.nodeId);
  const allowed=owner&&Object.hasOwn(FREE_NODE_ARGS,owner.op)?FREE_NODE_ARGS[owner.op]:[];
  if(!allowed.some(path=>path.length===target.path.length&&path.every((part,index)=>part===target.path[index])))fail('PARAMETER_TARGET_NOT_FREE',detail);
  let holder=owner.args;
  for(const part of target.path.slice(0,-1))holder=holder?.[part];
  const key=target.path.at(-1);
  if((!isObject(holder)&&!Array.isArray(holder))||!Object.hasOwn(holder,key))fail('PARAMETER_TARGET_NOT_FREE',detail);
  return {holder,key};
}

/** Pure and synchronous: substitute the declared literal slots and return the derived graph with its seeds and lineage. */
export function applyConstructionParameters({baseGraph,parameterSpec,values}={}){
  if(!plain(baseGraph)||!Array.isArray(baseGraph.nodes))fail('INVALID_BASE_GRAPH');
  checkSpec(parameterSpec);
  const baseGraphSha256=digest(baseGraph);
  if(baseGraphSha256!==parameterSpec.baseGraphSha256)fail('STALE_PARAMETER_BASE');
  exactKeys(values,['schemaVersion','parameterSpecSha256','values'],'INVALID_PARAMETER_VALUES');
  if(values.schemaVersion!==PARAMETER_VALUES_VERSION||!HASH_PATTERN.test(values.parameterSpecSha256)||!plain(values.values))fail('INVALID_PARAMETER_VALUES');
  const parameterSpecSha256=digest(parameterSpec);
  if(values.parameterSpecSha256!==parameterSpecSha256)fail('STALE_PARAMETER_VALUES');
  const {slots}=parameterSpec,located=slots.map(slot=>resolve(baseGraph,slot));
  for(const id of Object.keys(values.values))if(!slots.some(slot=>slot.id===id))fail('UNKNOWN_PARAMETER_SLOT',{slotId:id});
  for(const slot of slots)if(!Object.hasOwn(values.values,slot.id))fail('PARAMETER_VALUES_INCOMPLETE',{slotId:slot.id});
  // Validate every value (format, kind, exact BigInt domain) before touching any literal; unchanged means exactly equal.
  const unchanged=slots.map((slot,index)=>{
    const detail={slotId:slot.id},value=exactLiteral(values.values[slot.id],detail);
    if(!isRational(value))fail('PARAMETER_VALUE_KIND_UNSUPPORTED',detail);
    const exact=rational(value);
    if(compare(exact,rational(slot.domain.min))<0||compare(exact,rational(slot.domain.max))>0)fail('PARAMETER_OUT_OF_RANGE',detail);
    const current=baseRational(located[index].holder[located[index].key]);
    return current!==null&&compare(current,exact)===0;
  });
  const derivedGraph=structuredClone(baseGraph),changedSlots=[],unchangedSlots=[],seedNodes=new Set(),seedConditions=new Set();
  slots.forEach((slot,index)=>{
    if(unchanged[index]){unchangedSlots.push(slot.id);return;}
    const {holder,key}=resolve(derivedGraph,slot);
    holder[key]=structuredClone(values.values[slot.id]);
    changedSlots.push(slot.id);
    if(slot.target.kind==='NODE_ARG')seedNodes.add(slot.target.nodeId);else seedConditions.add(slot.target.conditionId);
  });
  // Nodes, edges, operations, branches and order must be untouched: equal once the slot positions are masked.
  const masked=graph=>{const copy=structuredClone(graph);for(const slot of slots){const {holder,key}=resolve(copy,slot);holder[key]=null;}return canonicalJson(copy);};
  if(masked(baseGraph)!==masked(derivedGraph))fail('DERIVED_GRAPH_STRUCTURE_CHANGED');
  return {derivedGraph,changedSlots,unchangedSlots,seedNodeIds:[...seedNodes].sort(),seedConditionIds:[...seedConditions].sort(),lineage:{baseGraphSha256,parameterSpecSha256,valuesSha256:digest(values),derivedGraphSha256:digest(derivedGraph)}};
}

const outcome=(status,fields={})=>({schemaVersion:PARAMETER_RECOMPUTE_VERSION,status,capability:CAPABILITY,engineCode:null,detail:null,lineage:null,impact:null,peer:{status:'NOT_RUN'},downstream:null,...fields,productionAuthorized:false,qualification:'NOT_RUN'});
const tryDigest=value=>{try{return objectSha(value);}catch{return null;}};

/** Re-run base and derived in full through the existing SymPy worker, apply the Cindy peer, and report the impact closure. */
export async function recomputeConstructionParameters({baseGraph,parameterSpec,values,worker=pythonWorker,signal}={}){
  let applied;
  try{applied=applyConstructionParameters({baseGraph,parameterSpec,values});}
  catch(error){if(!error.parameterInput)throw error;return outcome(error.code,{detail:error.detail});}
  const {derivedGraph}=applied,lineage={...applied.lineage,baseSnapshotSha256:null,derivedSnapshotSha256:null,peerComparisonSha256:null};
  const seeded=applied.seedNodeIds.length+applied.seedConditionIds.length>0;
  const downstream=seeded?{layout:'INVALIDATED_NOT_RUN',svg:'INVALIDATED_NOT_RUN',render:'NOT_RUN',review:'NOT_RUN'}:'NOT_INVALIDATED';
  const done=(status,fields={})=>outcome(status,{lineage:{...lineage},downstream,...fields});
  const execute=async(graph,phase)=>{
    try{return {response:await worker({action:'construction',graph},{signal})};}
    catch(error){if(signal?.aborted)throw error;return {failure:{phase,code:String(error?.message??error)}};}
  };
  const base=await execute(baseGraph,'base');
  if(base.failure)return done('WORKER_ERROR',{detail:base.failure});
  if(base.response.status!=='OK')return done('BASE_CONSTRUCTION_NOT_OK',{engineCode:base.response.result?.code??null});
  lineage.baseSnapshotSha256=objectSha(base.response.result);
  const derived=await execute(derivedGraph,'derived');
  if(derived.failure)return done('WORKER_ERROR',{detail:derived.failure});
  // An engine ERROR (degeneracy, ambiguous branch, failed audit) is mathematics and is never relabelled UNSUPPORTED.
  if(derived.response.status!=='OK')return done(derived.response.status==='ERROR'?'MATH_INVALID':'WORKER_UNSUPPORTED',{engineCode:derived.response.result?.code??null});
  const baseModel=base.response.result,derivedModel=derived.response.result;
  lineage.derivedSnapshotSha256=objectSha(derivedModel);
  let comparison;
  try{comparison=compareReconstruction(derivedModel,reconstruct(derivedGraph));}
  catch(error){
    const code=String(error?.message??error),unsupported=code.startsWith('UNSUPPORTED_CINDY_');
    return done(unsupported?'UNSUPPORTED_NUMERIC_SCOPE':'PEER_MISMATCH',{peer:{status:unsupported?'UNSUPPORTED_NUMERIC_SCOPE':'ERROR',code}});
  }
  lineage.peerComparisonSha256=tryDigest(comparison);
  if(comparison.status!=='PASS'){
    const failedIds=(comparison.rows??[]).filter(row=>!(row.delta<=comparison.tolerance)).map(row=>row.id);
    return done('PEER_MISMATCH',{peer:{status:'FAIL'},detail:comparison.errors?{errors:comparison.errors}:{failedIds}});
  }
  const peer={status:'PASS'};
  if(canonicalJson([baseModel.transcript,baseModel.order])!==canonicalJson([derivedModel.transcript,derivedModel.order]))return done('DEPENDENCY_STRUCTURE_CHANGED',{peer});
  // Authority for dependencies is the engine transcript (inputs plus SELECT_POINT branch refs), walked backwards from the seeds.
  const seeds=new Set(applied.seedNodeIds),dependents=new Map(),reached=new Set(),pending=[...seeds];
  for(const {nodeId,dependencies} of derivedModel.transcript)for(const dependency of dependencies)dependents.set(dependency,[...(dependents.get(dependency)??[]),nodeId]);
  while(pending.length)for(const next of dependents.get(pending.pop())??[])if(!reached.has(next)){reached.add(next);pending.push(next);}
  const own=(map,id)=>Object.hasOwn(map,id)?map[id]:null;
  const output=(model,id)=>canonicalJson([own(model.points,id),own(model.scalars,id),own(model.lines,id),own(model.circles,id),own(model.pointSets,id)]);
  const affected=derivedModel.order.filter(id=>reached.has(id)&&!seeds.has(id)),unaffected=derivedModel.order.filter(id=>!reached.has(id)&&!seeds.has(id));
  const broken=unaffected.filter(id=>output(baseModel,id)!==output(derivedModel,id));
  if(broken.length)return done('UNAFFECTED_NODE_CHANGED:'+broken[0],{detail:{nodeIds:broken},peer});
  const affectedChanged=affected.filter(id=>output(baseModel,id)!==output(derivedModel,id));
  const touched=new Set([...seeds,...reached]);
  const recheckedConditions=(derivedGraph.conditionAudits??[]).filter(audit=>audit.refs.some(ref=>touched.has(ref))||applied.seedConditionIds.includes(audit.id)).map(audit=>audit.id);
  return done('RECOMPUTED',{peer,impact:{seedNodeIds:applied.seedNodeIds,seedConditionIds:applied.seedConditionIds,affectedNodeIds:affected,affectedChanged,affectedSameValue:affected.filter(id=>!affectedChanged.includes(id)),unaffectedNodeIds:unaffected,recheckedConditions}});
}
