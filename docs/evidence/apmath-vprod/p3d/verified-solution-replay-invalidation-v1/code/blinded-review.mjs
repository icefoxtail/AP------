import {objectSha,bytesSha,canonicalJson,readBoundFile} from '../../pipeline-core/canonical.mjs';

const forbidden=new Set(['answer','solution','proposedplan','verifiedsolution','verification','verdict','previousplan','defects']);
export function assertStudentOnly(source){
  const visit=v=>{if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')for(const [k,c] of Object.entries(v)){if(forbidden.has(k.toLowerCase()))throw Error('BLIND_SOURCE_LEAK:'+k);visit(c);}};
  visit(source);
  if(typeof source?.content!=='string'||!Object.keys(source).every(k=>['content','choices','sourceImageRequired'].includes(k)))throw Error('INVALID_STUDENT_SOURCE');
}
export function blindClosed(record,kind){
  const p=record?.payload;if(record?.output?.status!=='PASS'||!Array.isArray(p?.uncoveredConditions)||p.uncoveredConditions.length)return false;
  if(kind==='SOLUTION')return Array.isArray(p.independentlyExtractedSourceConditions)&&p.independentlyExtractedSourceConditions.length>0&&typeof p.recomputedAnswer==='string'&&p.recomputedAnswer.length>0&&typeof p.reasoning==='string'&&p.reasoning.length>0;
  return Array.isArray(p.sourceConditions)&&p.sourceConditions.length>0&&p.sourceConditions.every(c=>typeof c.id==='string'&&typeof c.condition==='string')&&new Set(p.sourceConditions.map(c=>c.id)).size===p.sourceConditions.length;
}
export async function blindThenCompare({root,kind,source,images,comparison,policySha256,inputBindingSha256,call,freeze}){
  assertStudentOnly(source);
  if(source.sourceImageRequired&&!images.length)throw Error('BLIND_SOURCE_IMAGE_MISSING');
  const instruction=kind==='SOLUTION'
    ?'Solve only the supplied student question/images. No stored answer or solution is available. Freeze your independent answer, reasoning and every source condition. Payload {recomputedAnswer:string,reasoning:string,independentlyExtractedSourceConditions:[string],uncoveredConditions:[]}.'
    :'Extract all conditions only from the original student question and required images. No proposed plan is available. Payload {sourceConditions:[{id:string,condition:string}],uncoveredConditions:[]}.';
  const blind=await call(kind+'_SOURCE_BLIND',{instruction,visibility:'SOURCE_ONLY',source,policySha256,inputBindingSha256},images);
  const blindReceipt=freeze(kind+'_BLIND_FREEZE',blind);
  if(!blindClosed(blind,kind))throw Error(kind+'_BLIND_NOT_CLOSED');
  const blindDecisionRef=blindReceipt.outputs[0];
  // Read the committed bytes, not an in-memory editable answer/inventory.
  const frozen=JSON.parse(readBoundFile(root,blindDecisionRef));
  const compareInstruction=kind==='SOLUTION'
    ?'Compare the immutable independent decision with the now-disclosed stored answer/solution. Do not rewrite the frozen answer/reasoning. A discrepancy must be FAIL. Payload {solutionComparison:string,errors:[],uncoveredConditions:[]}.'
    :'Compare the immutable independently extracted inventory with the now-disclosed proposed plan. Do not rewrite the inventory or silently omit any condition. Original question content, choices, answer and source images remain in the protected Archive bank (sol mode uses a reminder). Payload {mappedConditions:[{sourceConditionId:string,mappedTo:string}],errors:[],uncoveredConditions:[],realizationReview:string}.';
  const compare=await call(kind+'_COMPARE',{instruction:compareInstruction,visibility:'COMPARE_ONLY',source,blindDecisionRef,independentDecision:frozen.payload,disclosed:comparison,policySha256,inputBindingSha256},images);
  const compareReceipt=freeze(kind+'_COMPARE',compare);
  const good=compare.output.status==='PASS'&&Array.isArray(compare.payload.errors)&&!compare.payload.errors.length&&Array.isArray(compare.payload.uncoveredConditions)&&!compare.payload.uncoveredConditions.length;
  if(compare.contextId===frozen.contextId)throw Error('BLIND_COMPARE_CONTEXT_REUSED');
  let payload;
  if(kind==='SOLUTION')payload={...frozen.payload,solutionComparison:compare.payload.solutionComparison??'',uncoveredConditions:compare.payload.uncoveredConditions??['COMPARE_SCHEMA_MISSING']};
  else{
    const mapping=compare.payload.mappedConditions;
    if(!Array.isArray(mapping)||mapping.length!==frozen.payload.sourceConditions.length||frozen.payload.sourceConditions.some(c=>mapping.filter(m=>m.sourceConditionId===c.id&&typeof m.mappedTo==='string').length!==1))throw Error('BLIND_CONDITION_COVERAGE_MISSING');
    payload={sourceConditions:frozen.payload.sourceConditions,mappedConditions:mapping,errors:compare.payload.errors,uncoveredConditions:compare.payload.uncoveredConditions,realizationReview:compare.payload.realizationReview??''};
  }
  return {...compare,output:{...compare.output,status:good?'PASS':'FAIL'},payload,reviewContract:'BLIND_FREEZE_COMPARE_v1',blindDecisionRef,compareRef:compareReceipt.outputs[0],policySha256,inputBindingSha256,imageShas:images.map(i=>bytesSha(Buffer.from(i.split(',')[1],'base64')))};
}
export function validateReviewLineage(root,record,kind,policySha256,inputBindingSha256){
  if(record?.reviewContract!=='BLIND_FREEZE_COMPARE_v1'||record.policySha256!==policySha256||record.inputBindingSha256!==inputBindingSha256)return false;
  try{
    const blind=JSON.parse(readBoundFile(root,record.blindDecisionRef)),compare=JSON.parse(readBoundFile(root,record.compareRef));
    if(!blindClosed(blind,kind)||compare.output.status!=='PASS'||blind.contextId===compare.contextId)return false;
    if(!Array.isArray(compare.payload.errors)||compare.payload.errors.length||!Array.isArray(compare.payload.uncoveredConditions)||compare.payload.uncoveredConditions.length)return false;
    assertStudentOnly(blind.inputPacket.source);
    if(blind.inputPacket.visibility!=='SOURCE_ONLY'||compare.inputPacket.visibility!=='COMPARE_ONLY'||blind.inputPacket.policySha256!==policySha256||blind.inputPacket.inputBindingSha256!==inputBindingSha256)return false;
    if(!blind.providerInvocationId||!compare.providerInvocationId||blind.subagentToolsEnabled!==false||compare.subagentToolsEnabled!==false)return false;
    if(compare.inputPacket.blindDecisionRef.sha256!==record.blindDecisionRef.sha256||canonicalJson(compare.inputPacket.independentDecision)!==canonicalJson(blind.payload))return false;
    if(compare.policySha256!==undefined&&compare.policySha256!==policySha256)return false;
    if(compare.inputPacket.policySha256!==policySha256||compare.inputPacket.inputBindingSha256!==inputBindingSha256)return false;
    if(kind==='SOLUTION'&&(record.payload.recomputedAnswer!==blind.payload.recomputedAnswer||record.payload.solutionComparison!==compare.payload.solutionComparison))return false;
    if(kind==='CONDITIONS'&&(canonicalJson(record.payload.sourceConditions)!==canonicalJson(blind.payload.sourceConditions)||canonicalJson(record.payload.mappedConditions)!==canonicalJson(compare.payload.mappedConditions)))return false;
    return true;
  }catch{return false;}
}
export async function reuseReviewAuthority({root,record,kind,policySha256,inputBindingSha256,closed,refresh}){
  if(typeof closed!=='function'||typeof refresh!=='function')throw Error('REPLAY_REVIEW_POLICY_REQUIRED');
  if(closed(record)&&validateReviewLineage(root,record,kind,policySha256,inputBindingSha256))return{record,reused:true,refreshResult:null};
  const refreshResult=await refresh(),fresh=refreshResult?.record??refreshResult;
  if(!closed(fresh)||!validateReviewLineage(root,fresh,kind,policySha256,inputBindingSha256))throw Error('REFRESHED_REVIEW_AUTHORITY_INVALID');
  return{record:fresh,reused:false,refreshResult};
}
export function verificationBinding({sourceRef,source,images,answer,solution,policySha256}){
  return objectSha({sourceRef,source,imageShas:images.map(i=>bytesSha(Buffer.from(i.split(',')[1],'base64'))),answer:answer??null,solution,policySha256});
}
export function conditionBinding({sourceRef,source,images,plan,policySha256}){
  return objectSha({sourceRef,source,imageShas:images.map(i=>bytesSha(Buffer.from(i.split(',')[1],'base64'))),plan,policySha256});
}
