import {types as utilTypes} from 'node:util';

const SOURCE_CONDITION_ROW_KEYS='condition,id,mappedTo';
const FACT_DISPLAY_MAP_KEYS='rows,schemaVersion';
const FACT_DISPLAY_ROW_KEYS='displayDisposition,expectedOwner,factId,factRole,preservedLocationRef,reason,sourceConditionId';
const FACT_ROLES=new Set(['GIVEN','DERIVED_INTERMEDIATE','CONCLUSION']);
const DISPOSITIONS=new Set(['SVG_REQUIRED','PRESERVED_ARCHIVE_BANK','OMITTED_AUXILIARY']);
const GEOMETRY_TYPES=new Set(['POINT','LINE','CIRCLE']);
const PRESERVED_FIELDS=new Set(['content','choices','answer','solution','image']);

function fail(code){throw Error(code);}

function assertJsonData(value,seen=new Set()){
  if(value===null||typeof value==='string'||typeof value==='boolean')return;
  if(typeof value==='number'){
    if(!Number.isFinite(value))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:NON_FINITE_NUMBER');
    return;
  }
  if(typeof value!=='object')fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:NON_JSON_VALUE');
  if(utilTypes.isProxy(value))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:PROXY');
  if(seen.has(value))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:CYCLIC');
  seen.add(value);
  const isArray=Array.isArray(value);
  const prototype=Object.getPrototypeOf(value);
  if(isArray){
    if(prototype!==Array.prototype)fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:ARRAY_PROTOTYPE');
    const keys=Reflect.ownKeys(value);
    if(keys.some(key=>typeof key!=='string'||(key!=='length'&&!/^(0|[1-9][0-9]*)$/.test(key))))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:ARRAY_PROPERTY');
    if(keys.length!==value.length+1)fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:SPARSE_ARRAY');
    for(let index=0;index<value.length;index++){
      const descriptor=Object.getOwnPropertyDescriptor(value,String(index));
      if(!descriptor||!descriptor.enumerable||!Object.hasOwn(descriptor,'value'))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:ARRAY_ACCESSOR_OR_HOLE');
      assertJsonData(descriptor.value,seen);
    }
  }else{
    if(prototype!==Object.prototype&&prototype!==null)fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:OBJECT_PROTOTYPE');
    for(const key of Reflect.ownKeys(value)){
      if(typeof key!=='string')fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:SYMBOL_KEY');
      const descriptor=Object.getOwnPropertyDescriptor(value,key);
      if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:ACCESSOR_OR_HIDDEN_PROPERTY');
      assertJsonData(descriptor.value,seen);
    }
  }
  seen.delete(value);
}

function requireExactKeys(value,expected,errorCode){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join(',')!==expected)fail(errorCode);
}

function requireIdentifier(value,errorCode){
  if(typeof value!=='string'||value.length===0)fail(errorCode);
  if(value.normalize('NFC')!==value)fail('FACT_DISPLAY_MAP_IDENTIFIER_NOT_NFC:'+value);
}

function sourceTargetContains(source,target){
  return typeof source.mappedTo==='string'
    ?source.mappedTo===target
    :Array.isArray(source.mappedTo)&&source.mappedTo.includes(target);
}

function validateFactDisplayMap(plan){
  if(!plan.mathPlan)fail('UNSUPPORTED_FACT_DISPLAY_MAP_SCOPE');
  const conditions=plan.sourceConditions;
  const conditionById=new Map(conditions.map(condition=>[condition.id,condition]));
  const mapDescriptor=Object.getOwnPropertyDescriptor(plan,'factDisplayMap');
  const factMap=mapDescriptor.value;
  requireExactKeys(factMap,FACT_DISPLAY_MAP_KEYS,'INVALID_FACT_DISPLAY_MAP_SCHEMA');
  if(factMap.schemaVersion!=='VISUAL_FACT_DISPLAY_MAP_v1')fail('UNSUPPORTED_FACT_DISPLAY_MAP_VERSION');
  if(!Array.isArray(factMap.rows)||factMap.rows.length===0)fail('FACT_DISPLAY_MAP_ROWS_REQUIRED');
  const nodes=plan.mathPlan.nodes;
  if(!Array.isArray(nodes))fail('UNSUPPORTED_FACT_DISPLAY_MAP_SCOPE:NODES_REQUIRED');
  const nodesById=new Map();
  for(const node of nodes){
    if(!node||typeof node!=='object'||Array.isArray(node))continue;
    if(typeof node.id==='string'){
      const matches=nodesById.get(node.id)||[];
      matches.push(node);nodesById.set(node.id,matches);
    }
  }

  const rowsSeen=new Set(),rolesByFact=new Map(),dispositionsByFact=new Map(),coveredSourceIds=new Set(),sourceMappedTargets=new Set();
  for(const condition of conditions){requireIdentifier(condition.id,'INVALID_FACT_DISPLAY_SOURCE_CONDITION_ID');}
  for(const condition of conditions){
    const targets=typeof condition.mappedTo==='string'?[condition.mappedTo]:condition.mappedTo;
    for(const target of targets)sourceMappedTargets.add(target);
  }
  for(const row of factMap.rows){
    requireExactKeys(row,FACT_DISPLAY_ROW_KEYS,'INVALID_FACT_DISPLAY_ROW_SCHEMA');
    const {sourceConditionId,factId,factRole,displayDisposition,expectedOwner,preservedLocationRef,reason}=row;
    if(sourceConditionId!==null){
      requireIdentifier(sourceConditionId,'INVALID_FACT_DISPLAY_SOURCE_CONDITION_ID');
      if(!conditionById.has(sourceConditionId))fail('UNKNOWN_FACT_DISPLAY_SOURCE_CONDITION:'+sourceConditionId);
    }
    requireIdentifier(factId,'INVALID_FACT_DISPLAY_FACT_ID');
    if(!FACT_ROLES.has(factRole))fail('INVALID_FACT_DISPLAY_FACT_ROLE:'+String(factRole));
    if(!DISPOSITIONS.has(displayDisposition))fail('INVALID_FACT_DISPLAY_DISPOSITION:'+String(displayDisposition));

    const rowIdentity=JSON.stringify([sourceConditionId,factId,displayDisposition]);
    if(rowsSeen.has(rowIdentity))fail('DUPLICATE_FACT_DISPLAY_ROW');
    rowsSeen.add(rowIdentity);
    const priorRole=rolesByFact.get(factId);
    if(priorRole!==undefined&&priorRole!==factRole)fail('CONTRADICTORY_FACT_DISPLAY_ROLES:'+factId);
    rolesByFact.set(factId,factRole);
    const dispositions=dispositionsByFact.get(factId)||new Set();
    dispositions.add(displayDisposition);dispositionsByFact.set(factId,dispositions);

    if(displayDisposition==='SVG_REQUIRED'){
      if(expectedOwner!==factId)fail('FACT_DISPLAY_EXPECTED_OWNER_MISMATCH:'+factId);
      if(preservedLocationRef!==null||reason!==null)fail('INVALID_FACT_DISPLAY_CONDITIONAL_FIELDS:SVG_REQUIRED');
      if(sourceConditionId===null&&!['DERIVED_INTERMEDIATE','CONCLUSION'].includes(factRole))fail('SOURCE_CONDITION_REQUIRED_FOR_GIVEN_FACT:'+factId);
      if(sourceConditionId!==null){
        const source=conditionById.get(sourceConditionId);
        if(!sourceTargetContains(source,factId))fail('LEGACY_MAPPING_TARGET_MISMATCH:'+sourceConditionId+':'+factId);
        coveredSourceIds.add(sourceConditionId);
      }
      const matches=nodesById.get(factId)||[];
      if(matches.length===0)fail('UNKNOWN_FACT_DISPLAY_CONSTRUCTION_NODE:'+factId);
      if(matches.length!==1)fail('DUPLICATE_CONSTRUCTION_NODE_ID:'+factId);
      const node=matches[0];
      if(!GEOMETRY_TYPES.has(node.outputType))fail('UNSUPPORTED_FACT_DISPLAY_NODE_TYPE:'+factId+':'+String(node.outputType));
      if(!FACT_ROLES.has(node.factRole)||node.factRole!==factRole)fail('FACT_DISPLAY_NODE_ROLE_MISMATCH:'+factId);
    }else if(displayDisposition==='PRESERVED_ARCHIVE_BANK'){
      if(sourceConditionId===null||factId!==sourceConditionId)fail('PRESERVED_ARCHIVE_BANK_SOURCE_ID_REQUIRED');
      if(expectedOwner!==null||reason!==null)fail('INVALID_FACT_DISPLAY_CONDITIONAL_FIELDS:PRESERVED_ARCHIVE_BANK');
      requireExactKeys(preservedLocationRef,'field,kind','INVALID_PRESERVED_ARCHIVE_LOCATION');
      if(preservedLocationRef.kind!=='PRESERVED_ARCHIVE_BANK'||!PRESERVED_FIELDS.has(preservedLocationRef.field))fail('INVALID_PRESERVED_ARCHIVE_LOCATION');
      const source=conditionById.get(sourceConditionId);
      if(!sourceTargetContains(source,'PRESERVED_ARCHIVE_BANK'))fail('PRESERVED_ARCHIVE_BANK_MAPPING_REQUIRED:'+sourceConditionId);
      coveredSourceIds.add(sourceConditionId);
    }else{
      if(sourceConditionId!==null)fail('OMITTED_AUXILIARY_SOURCE_LINKED:'+factId);
      if(expectedOwner!==null||preservedLocationRef!==null||typeof reason!=='string'||!reason.trim())fail('INVALID_FACT_DISPLAY_CONDITIONAL_FIELDS:OMITTED_AUXILIARY');
      if(factRole!=='DERIVED_INTERMEDIATE')fail('OMITTED_AUXILIARY_NOT_DERIVED:'+factId);
      if(sourceMappedTargets.has(factId))fail('OMITTED_AUXILIARY_SOURCE_LINKED:'+factId);
      const matches=nodesById.get(factId)||[];
      if(matches.length===0)fail('UNKNOWN_FACT_DISPLAY_CONSTRUCTION_NODE:'+factId);
      if(matches.length!==1)fail('DUPLICATE_CONSTRUCTION_NODE_ID:'+factId);
      const node=matches[0];
      if(!GEOMETRY_TYPES.has(node.outputType))fail('UNSUPPORTED_FACT_DISPLAY_NODE_TYPE:'+factId+':'+String(node.outputType));
      if(node.factRole!=='DERIVED_INTERMEDIATE')fail('FACT_DISPLAY_NODE_ROLE_MISMATCH:'+factId);
    }
  }
  for(const [factId,dispositions] of dispositionsByFact){
    if(dispositions.has('SVG_REQUIRED')&&dispositions.has('OMITTED_AUXILIARY'))fail('SVG_REQUIRED_OMITTED_CONFLICT:'+factId);
  }
  for(const condition of conditions)if(!coveredSourceIds.has(condition.id))fail('SOURCE_CONDITION_DISPLAY_COVERAGE_MISSING:'+condition.id);
}

function verifyLegacyConditionBindings(plan){
  if(!plan.mathPlan)return;
  if(!Array.isArray(plan.sourceConditions))throw Error('SOURCE_CONDITIONS_REQUIRED_FOR_TYPED_AUDIT');
  const sourceIds=new Set();
  const validMappedTo=value=>(typeof value==='string'&&value.trim().length>0)||(Array.isArray(value)&&value.length>0&&value.every(item=>typeof item==='string'&&item.trim().length>0)&&new Set(value).size===value.length);
  for(const source of plan.sourceConditions){if(!source||Object.keys(source).sort().join(',')!==SOURCE_CONDITION_ROW_KEYS||typeof source.id!=='string'||!source.id||typeof source.condition!=='string'||!source.condition||!validMappedTo(source.mappedTo)||sourceIds.has(source.id))throw Error('INVALID_SOURCE_CONDITION_BINDING');sourceIds.add(source.id);}
  for(const audit of plan.mathPlan.conditionAudits||[]){if(!sourceIds.has(audit.sourceConditionId))throw Error('CONDITION_AUDIT_SOURCE_BINDING_REQUIRED:'+audit.id);}
}

export function verifyConstructionConditionBindings(plan){
  if(utilTypes.isProxy(plan))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:PROXY_ROOT');
  const mapDescriptor=Object.getOwnPropertyDescriptor(plan,'factDisplayMap');
  if(!mapDescriptor){verifyLegacyConditionBindings(plan);return;}
  if(!Object.hasOwn(mapDescriptor,'value'))fail('INVALID_FACT_DISPLAY_MAP_JSON_DATA:ACCESSOR_FACT_DISPLAY_MAP');
  assertJsonData(plan);
  verifyLegacyConditionBindings(plan);
  validateFactDisplayMap(plan);
}
