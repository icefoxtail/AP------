'use strict';
/**
 * Generated Meta retention gate (post-2026-10-09 cutover).
 * Legacy UID exemption means "not re-certified", not "advanced Meta PASS".
 * Node: node archive/tools/generated-meta-retention-gate.cjs
 */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');

const sortValue=v=>Array.isArray(v)?v.map(sortValue):v&&typeof v==='object'
  ?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sortValue(v[k])])):v;
const canonical=v=>JSON.stringify(sortValue(v));
const sha256=v=>crypto.createHash('sha256').update(canonical(v)).digest('hex');
const nonempty=v=>typeof v==='string'&&v.trim()!==''&&v===v.trim();
const sha64=v=>typeof v==='string'&&/^[a-f0-9]{64}$/i.test(v);
const uniqueStrings=a=>Array.isArray(a)&&a.every(nonempty)&&new Set(a).size===a.length;
const META_FIELDS=['rpmL1','rpmL2','rpmL3','rpmL4'];
function validateMeta(meta){
 const issues=[];
 if(!meta||typeof meta!=='object'||Array.isArray(meta))return ['META_OBJECT_MISSING'];
 for(const key of META_FIELDS)if(!nonempty(meta[key]))issues.push(key+':MISSING_CANONICAL_KEY');
 if(!['RPM_LOCKED','GENERATED_EXT_L4'].includes(meta.rpmL4Namespace))issues.push('rpmL4Namespace:INVALID');
 if(!uniqueStrings(meta.crossConceptKeys))issues.push('crossConceptKeys:MISSING_OR_INVALID');
 if(!uniqueStrings(meta.conditionKeys))issues.push('conditionKeys:MISSING_OR_INVALID');
 if(!nonempty(meta.integrationPattern))issues.push('integrationPattern:MISSING');
 if(!Number.isInteger(meta.difficultyBucket)||meta.difficultyBucket<1||meta.difficultyBucket>5)
  issues.push('difficultyBucket:INVALID_1_TO_5');
 if(!['하','중','상'].includes(meta.level))issues.push('level:INVALID');
 for(const field of ['problemTypeKey','templateKey']){
  if(nonempty(meta[field]))continue;
  if(meta[field]!==null||!nonempty(meta.metaDebt?.[field]))
   issues.push(field+':MAPPING_OR_EVIDENCED_HOLD_REQUIRED');
 }
 if(meta.rpmL4Namespace==='GENERATED_EXT_L4'&&!nonempty(meta.generatedL4RegistryRef))
  issues.push('generatedL4RegistryRef:MISSING');
 return issues;
}
function validateProjection({uid,indexMeta,consumerMeta,questionMeta,sourceMeta,approvedMeta,digests,evidence}){
 const issues=validateMeta(approvedMeta);
 if(!nonempty(uid))issues.push('UID_MISSING');
 for(const [key,value] of Object.entries({indexMeta,consumerMeta,questionMeta,sourceMeta})){
  if(canonical(value)!==canonical(approvedMeta))issues.push(key+':META_PARITY_MISMATCH');
 }
 const actual=sha256(approvedMeta);
 for(const [key,value] of Object.entries(digests||{}))
  if(!sha64(value)||value.toLowerCase()!==actual)issues.push(key+':META_SHA_MISMATCH');
 for(const [key,value] of Object.entries(evidence||{}))
  if(!sha64(value))issues.push(key+':META_REVIEW_EVIDENCE_REQUIRED');
 return issues;
}
function contained(root,rel,prefix){
 if(typeof rel!=='string'||!rel.startsWith(prefix)||rel.includes('\\')||rel.split('/').includes('..'))
  throw Error('UNSAFE_REPO_PATH:'+String(rel));
 const full=path.resolve(root,rel);
 if(!full.startsWith(path.resolve(root,prefix)+path.sep))throw Error('OUT_OF_SCOPE_PATH:'+rel);
 return full;
}
function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function audit(root){
 const consumerPrefix='archive/data/generated-lite-consumer/v1/';
 const sourcePrefix='archive/generated/lite/v1/';
 const idx=readJson(path.join(root,consumerPrefix,'index.json'));
 const cutover=readJson(path.join(root,consumerPrefix,'meta-retention-cutover-20261009.json'));
 const errors=[];
 if(cutover.schemaVersion!=='GENERATED_META_RETENTION_CUTOVER_V1'||cutover.legacyCount!==323||
   cutover.legacyUids?.length!==323||new Set(cutover.legacyUids).size!==323)
  errors.push('LEGACY_CUTOVER_ROSTER_INVALID');
 if(!Array.isArray(idx.records)||idx.approvedCount!==idx.records?.length)
  errors.push('CONSUMER_APPROVED_COUNT_INVALID');
 const legacy=new Set(cutover.legacyUids||[]);
 const holds=new Set(idx.excludedHoldUids||[]);
 const seen=new Set();
 const shardCache=new Map(),sourceCache=new Map(),metaCache=new Map();
 let exempt=0,checked=0;
 for(const row of idx.records||[]){
  const uid=row.uid;
  if(!nonempty(uid)||seen.has(uid)){errors.push(String(uid)+':DUPLICATE_OR_INVALID_UID');continue;}
  seen.add(uid);
  if(holds.has(uid))errors.push(uid+':HOLD_EXPOSED');
  if(legacy.has(uid)){exempt++;continue;}
  checked++;
  const issue=(code)=>errors.push(uid+':'+code);
  try{
   if(row.sourceKind!=='generated'||row.consumerSelectable!==true)
    issue('NEW_UID_NOT_APPROVED_SELECTABLE');
   if(!nonempty(row.reviewApprovalBasis)||!nonempty(row.approval))
    issue('NEW_UID_APPROVAL_MISSING');
   const shardRel='archive/'+row.shard;
   const shardFile=contained(root,shardRel,consumerPrefix);
   let shard=shardCache.get(shardRel);
   if(!shard){shard=readJson(shardFile);shardCache.set(shardRel,shard);}
   const matches=(shard.records||[]).filter(x=>x.generatedUid===uid&&x.localOrdinal===row.localOrdinal);
   if(matches.length!==1){issue('CONSUMER_UID_ORDINAL_NOT_UNIQUE');continue;}
   const record=matches[0],q=record.question||{};
   if(q.uid!==uid||record.l2!==row.l2||q.subUnitKey!==row.l2)
    issue('UID_OR_STORAGE_BUCKET_MISMATCH');
   const sourceRel=record.sourceShard;
   const sourceFile=contained(root,sourceRel,sourcePrefix);
   let source=sourceCache.get(sourceRel);
   if(!source){
    const sandbox={window:{}};
    vm.runInNewContext(fs.readFileSync(sourceFile,'utf8'),sandbox,{timeout:2000,filename:sourceRel});
    if(!Array.isArray(sandbox.window.questionBank))throw Error('SOURCE_QUESTION_BANK_INVALID');
    source=sandbox.window.questionBank;
    sourceCache.set(sourceRel,source);
   }
   const sourceQs=source.filter(x=>x.uid===uid);
   if(sourceQs.length!==1){issue('SOURCE_UID_NOT_UNIQUE');continue;}
   const metaRel=sourceRel.replace('/shards/','/metadata/').replace(/\.js$/,'.json');
   if(metaRel===sourceRel)throw Error('SOURCE_METADATA_PATH_UNRESOLVED');
   const metaFile=contained(root,metaRel,sourcePrefix);
   let metadata=metaCache.get(metaRel);
   if(!metadata){metadata=readJson(metaFile);metaCache.set(metaRel,metadata);}
   const approved=(Array.isArray(metadata)?metadata:[]).filter(x=>x.uid===uid);
   if(approved.length!==1){issue('APPROVED_META_UID_NOT_UNIQUE');continue;}
   const m=approved[0];
   const checks=validateProjection({
    uid,indexMeta:row.meta,consumerMeta:record.meta,
    questionMeta:q.meta,sourceMeta:sourceQs[0].meta,approvedMeta:m.meta,
    digests:{index:row.metaFinalSha256,consumer:record.metaFinalSha256,
      question:q.metaFinalSha256,source:sourceQs[0].metaFinalSha256,
      authority:m.metaFinalSha256},
    evidence:{index:row.metaReviewEvidenceSha256,consumer:record.metaReviewEvidenceSha256,
      authority:m.metaReviewEvidenceSha256}
   });
   for(const item of checks)issue(item);
   if(q.difficultyBucket!==m.meta?.difficultyBucket||q.level!==m.meta?.level||
      q.standardUnitKey!==sourceQs[0].standardUnitKey||q.subUnitKey!==sourceQs[0].subUnitKey)
    issue('SOURCE_QUESTION_STANDARD_OR_DIFFICULTY_MISMATCH');
   if(m.meta?.rpmL4Namespace==='GENERATED_EXT_L4'){
    const ref=contained(root,m.meta.generatedL4RegistryRef,sourcePrefix);
    if(!fs.existsSync(ref))issue('GENERATED_EXT_L4_REGISTRY_MISSING');
   }
  }catch(e){issue('INSPECTION_ERROR:'+e.message);}
 }
 return {status:errors.length?'FAIL':'PASS_NEW_UID_SCOPE_ONLY',
   legacyExemptNotRecertified:exempt,newUidChecked:checked,total:seen.size,
   failures:errors.length,errors};
}
if(require.main===module){
 const result=audit(path.resolve(__dirname,'../..'));
 console.log(JSON.stringify(result,null,2));
 if(result.failures)process.exitCode=1;
}
module.exports={validateMeta,validateProjection,audit,sha256};
