import {isDeepStrictEqual} from 'node:util';
import {HASH_PATTERN,nonempty,objectSha,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {assertStudentOnly,blindClosed} from './blinded-review.mjs';

export const SOURCE_INVENTORY_COMPARISON_VERSION='SOURCE_INVENTORY_COMPARISON_v1';
export const SOURCE_INVENTORY_NORMALIZATION_POLICY=Object.freeze({version:'NFC_ONLY_v1',form:'NFC',scope:'complete condition text only; no trimming, whitespace rewriting, token or mathematical normalization'});
const REQUIRED_DEBTS=Object.freeze(['SOURCE_LOCATION_UNVERIFIED','SEMANTIC_EQUIVALENCE_NOT_VERIFIED','EXTRACTION_COMPLETENESS_NOT_VERIFIED','INDEPENDENCE_NOT_VERIFIED','PHYSICAL_SOURCE_IMAGE_BINDING_UNVERIFIED']);
const FORBIDDEN_KEYS=new Set(['answer','solution','proposedplan','verifiedsolution','verification','verdict','previousplan','defects','comparepacket','compareinput','disclosed','independentdecision']);
const fail=code=>{throw new Error(code);};
const isPlainRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;

function rejectLeakedKeys(value){
  const walk=item=>{
    if(Array.isArray(item)){for(const child of item)walk(child);return;}
    if(item&&typeof item==='object')for(const [key,child] of Object.entries(item)){
      if(FORBIDDEN_KEYS.has(key.toLowerCase()))fail('BLIND_SOURCE_LEAK:'+key);
      walk(child);
    }
  };
  walk(value);
}
function exactKeys(value,keys,code){
  if(!isPlainRecord(value)||Object.keys(value).length!==keys.length||keys.some(key=>!Object.hasOwn(value,key)))fail(code);
}
function validateSource(source){
  try{assertStudentOnly(source);}catch(error){throw error;}
  exactKeys(source,['content','choices','sourceImageRequired'],'INVALID_STUDENT_SOURCE');
  if(typeof source.content!=='string'||!(source.choices===null||(Array.isArray(source.choices)&&source.choices.every(x=>typeof x==='string')))||typeof source.sourceImageRequired!=='boolean')fail('INVALID_STUDENT_SOURCE');
}
function validateRows(record){
  const rows=record.payload.sourceConditions;
  if(!Array.isArray(rows)||rows.length===0)fail('INVALID_CONDITION_INVENTORY');
  const ids=new Set(),normalizedIds=new Set();
  return rows.map((row,index)=>{
    exactKeys(row,['id','condition'],'INVALID_CONDITION_ROW');
    if(!nonempty(row.id)||!nonempty(row.condition)||ids.has(row.id))fail('INVALID_CONDITION_ROW');
    const normalizedId=row.id.normalize('NFC');
    if(normalizedIds.has(normalizedId))fail('INVALID_CONDITION_ROW');
    ids.add(row.id);normalizedIds.add(normalizedId);
    return {index,id:row.id,condition:row.condition,normalizedCondition:row.condition.normalize('NFC')};
  });
}
function validateFrozenRecord(root,ref,side){
  const refSnapshot={path:ref?.path,bytes:ref?.bytes,sha256:ref?.sha256};
  let bytes;
  try{bytes=readBoundFile(root,refSnapshot);}catch(error){throw error;}
  let record;
  try{record=JSON.parse(bytes.toString('utf8'));}catch{fail('MALFORMED_FROZEN_JSON');}
  if(!isPlainRecord(record))fail('INVALID_FROZEN_RECORD');
  rejectLeakedKeys(record);
  if(record.output?.status!=='PASS')fail('BLIND_RECORD_NOT_CLOSED');
  if(!isPlainRecord(record.payload))fail('BLIND_RECORD_NOT_CLOSED');
  const rows=validateRows(record);
  if(!Array.isArray(record.payload.uncoveredConditions)||record.payload.uncoveredConditions.length!==0||!blindClosed(record,'CONDITIONS'))fail('BLIND_RECORD_NOT_CLOSED');
  exactKeys(record.inputPacket,['instruction','visibility','source','policySha256','inputBindingSha256'],'INVALID_SOURCE_INPUT_PACKET');
  const packet=record.inputPacket;
  if(!nonempty(packet.instruction)||packet.visibility!=='SOURCE_ONLY')fail('INVALID_SOURCE_INPUT_PACKET');
  validateSource(packet.source);
  if(typeof packet.policySha256!=='string'||!HASH_PATTERN.test(packet.policySha256)||typeof packet.inputBindingSha256!=='string'||!HASH_PATTERN.test(packet.inputBindingSha256)||typeof record.inputSha256!=='string'||!HASH_PATTERN.test(record.inputSha256))fail('INVALID_SOURCE_INPUT_HASH');
  if(objectSha(packet)!==record.inputSha256)fail('INPUT_HASH_MISMATCH');
  if(!Array.isArray(record.imageShas)||record.imageShas.some(hash=>typeof hash!=='string'||!HASH_PATTERN.test(hash)))fail('INVALID_IMAGE_BINDING');
  const metadata={};
  const debts=[];
  for(const field of ['model','contextId','providerInvocationId']){
    const value=record[field];metadata[field]=nonempty(value)?value:null;
    if(metadata[field]===null)debts.push(`${side.toUpperCase()}_${field.replace(/[A-Z]/g,m=>'_'+m).toUpperCase()}_UNVERIFIED`);
  }
  metadata.subagentToolsEnabled=typeof record.subagentToolsEnabled==='boolean'?record.subagentToolsEnabled:null;
  if(metadata.subagentToolsEnabled===null)debts.push(`${side.toUpperCase()}_SUBAGENT_TOOLS_STATE_UNVERIFIED`);
  return {ref:refSnapshot,source:structuredClone(packet.source),rows,metadata,debts,provenance:{inputSha256:record.inputSha256,policySha256:packet.policySha256,inputBindingSha256:packet.inputBindingSha256,imageShas:[...record.imageShas]}};
}
function sortedMultiset(rows){return rows.map(row=>row.normalizedCondition).sort((a,b)=>a<b?-1:a>b?1:0);}
function publicRow(row){return {index:row.index,id:row.id,condition:row.condition};}

/**
 * Compare the normalized complete condition-text multisets of two bound,
 * frozen CONDITIONS_SOURCE_BLIND records. This synchronous diagnostic does
 * not establish source completeness, mathematical equivalence, locations,
 * independent extraction, or production suitability.
 */
export function compareFrozenSourceConditionInventories({root,leftRef,rightRef}){
  const left=validateFrozenRecord(root,leftRef,'left'),right=validateFrozenRecord(root,rightRef,'right');
  if(!isDeepStrictEqual(left.source,right.source))fail('SOURCE_INPUT_MISMATCH');
  if(!isDeepStrictEqual(left.provenance.imageShas,right.provenance.imageShas))fail('SOURCE_IMAGE_BINDING_MISMATCH');
  if(left.provenance.policySha256!==right.provenance.policySha256)fail('SOURCE_POLICY_MISMATCH');
  if(left.source.sourceImageRequired&&left.provenance.imageShas.length===0)fail('REQUIRED_IMAGE_BINDING_MISSING');
  const unusedRight=new Set(right.rows.map((_,index)=>index)),matched=[],onlyLeft=[];
  for(const row of left.rows){
    const index=right.rows.findIndex((candidate,i)=>unusedRight.has(i)&&candidate.normalizedCondition===row.normalizedCondition);
    if(index<0)onlyLeft.push({...publicRow(row),normalizedCondition:row.normalizedCondition});
    else{
      unusedRight.delete(index);const other=right.rows[index];
      matched.push({left:publicRow(row),right:publicRow(other),normalizedCondition:row.normalizedCondition,normalizationApplied:row.condition!==row.normalizedCondition||other.condition!==other.normalizedCondition});
    }
  }
  const onlyRight=right.rows.filter((_,index)=>unusedRight.has(index)).map(row=>({...publicRow(row),normalizedCondition:row.normalizedCondition,reason:'UNRESOLVED_TEXTUAL_INVENTORY_DIFFERENCE'}));
  for(const row of onlyLeft)row.reason='UNRESOLVED_TEXTUAL_INVENTORY_DIFFERENCE';
  const debts=[...REQUIRED_DEBTS,...left.debts,...right.debts];
  if(left.metadata.contextId!==null&&left.metadata.contextId===right.metadata.contextId||left.metadata.providerInvocationId!==null&&left.metadata.providerInvocationId===right.metadata.providerInvocationId)debts.push('REUSED_CONTEXT_OR_INVOCATION_METADATA');
  return {
    schemaVersion:SOURCE_INVENTORY_COMPARISON_VERSION,
    normalizationPolicy:{...SOURCE_INVENTORY_NORMALIZATION_POLICY},
    comparisonStatus:onlyLeft.length||onlyRight.length?'UNRESOLVED_INVENTORY_DIFFERENCES':'TEXTUALLY_AGREED',
    left:{ref:{...left.ref},source:structuredClone(left.source),provenance:{...left.provenance,imageShas:[...left.provenance.imageShas]},metadata:{...left.metadata}},
    right:{ref:{...right.ref},source:structuredClone(right.source),provenance:{...right.provenance,imageShas:[...right.provenance.imageShas]},metadata:{...right.metadata}},
    matched,onlyLeft,onlyRight,
    normalizedConditionsSha:{left:objectSha(sortedMultiset(left.rows)),right:objectSha(sortedMultiset(right.rows))},
    evidenceStatus:'EVIDENCE_DEBT',debts:[...new Set(debts)],productionAuthorized:false
  };
}
