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
const sha256Bytes=v=>crypto.createHash('sha256').update(v).digest('hex');
const gitBlobSha=v=>crypto.createHash('sha1').update(`blob ${v.length}\0`).update(v).digest('hex');
const nonempty=v=>typeof v==='string'&&v.trim()!==''&&v===v.trim();
const sha64=v=>typeof v==='string'&&/^[a-f0-9]{64}$/i.test(v);
const uniqueStrings=a=>Array.isArray(a)&&a.every(nonempty)&&new Set(a).size===a.length;
const META_FIELDS=['rpmL1','rpmL2','rpmL3','rpmL4'];
function validateMeta(meta){
 const issues=[];
 if(!meta||typeof meta!=='object'||Array.isArray(meta))return ['META_OBJECT_MISSING'];
 for(const key of META_FIELDS)if(!nonempty(meta[key]))issues.push(key+':MISSING_CANONICAL_KEY');
 if(!['RPM_LOCKED','RPM_EXISTING_DRAFT','GENERATED_EXT_L4'].includes(meta.rpmL4Namespace))issues.push('rpmL4Namespace:INVALID');
 if(meta.rpmL4Namespace==='RPM_EXISTING_DRAFT'){
  if(!nonempty(meta.rpmPrimaryRecordId))issues.push('rpmPrimaryRecordId:DRAFT_RPM_RECORD_REQUIRED');
  if(!nonempty(meta.rpmDraftAuthorityRef)||!meta.rpmDraftAuthorityRef.startsWith('archive/data/meta-foundation/'))
   issues.push('rpmDraftAuthorityRef:SOURCE_REQUIRED');
  if(!sha64(meta.rpmDraftAuthoritySha256))issues.push('rpmDraftAuthoritySha256:INVALID');
 }
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
function validateReviewBinding(root,binding,uid,expectedMetaSha,expectedStatus){
 const issues=[];
 if(!binding||typeof binding!=='object'||!nonempty(binding.path)||!sha64(binding.sha256))return ['REVIEW_EVIDENCE_BINDING_MISSING'];
 try{
 const evidencePrefix=['alive/06_EXECUTION/','archive/analysis/'].find(prefix=>binding.path.startsWith(prefix));
 if(!evidencePrefix)return ['REVIEW_EVIDENCE_PATH_OUT_OF_SCOPE'];
 const evidenceFile=contained(root,binding.path,evidencePrefix);
  const bytes=fs.readFileSync(evidenceFile);
  if(sha256Bytes(bytes).toLowerCase()!==binding.sha256.toLowerCase())issues.push('REVIEW_EVIDENCE_BYTES_MISMATCH');
  const doc=JSON.parse(bytes.toString('utf8'));
  if(doc.schemaVersion!=='GENERATED_META_REVIEW_EVIDENCE_V1'||!Array.isArray(doc.items))return [...issues,'REVIEW_EVIDENCE_SCHEMA_INVALID'];
  const matches=doc.items.filter(x=>x?.uid===uid);
  if(matches.length!==1)return [...issues,'REVIEW_EVIDENCE_UID_NOT_UNIQUE'];
  const item=matches[0];
  if(!['REVIEW_PASS','REVIEW_APPROVED','USER_DIRECTED_OPERATING_APPROVED'].includes(item.reviewStatus))issues.push('REVIEW_EVIDENCE_STATUS_NOT_APPROVED');
  if(binding.reviewStatus!==item.reviewStatus||item.reviewStatus!==expectedStatus)issues.push('REVIEW_EVIDENCE_STATUS_MISMATCH');
  if(item.metaFinalSha256!==expectedMetaSha)issues.push('REVIEW_EVIDENCE_META_SHA_MISMATCH');
 }catch(e){issues.push('REVIEW_EVIDENCE_INSPECTION_ERROR:'+e.message);}
 return issues;
}
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
 const historicalRows=cutover.historicalMetaEvidenceCompatibility||[];
 const historicalEvidenceCompat=new Map(historicalRows.map(item=>[item?.uid,item]));
 if(historicalEvidenceCompat.size!==historicalRows.length||
   [...historicalEvidenceCompat.keys()].some(uid=>legacy.has(uid))||
   !Number.isInteger(cutover.historicalMetaEvidenceCompatibilityCount)||historicalEvidenceCompat.size!==cutover.historicalMetaEvidenceCompatibilityCount||
   historicalRows.some(item=>!nonempty(item?.uid)||!sha64(item?.metaFinalSha256)||!sha64(item?.metaReviewEvidenceSha256)||!(/^[a-f0-9]{40}$/i.test(item?.sourceShardGitSha||''))))
  errors.push('HISTORICAL_EVIDENCE_COMPAT_ROSTER_INVALID');
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
   const sourceBytes=fs.readFileSync(sourceFile);
   const sourceBlob=gitBlobSha(sourceBytes);
   if(row.sourceShardGitSha!==sourceBlob||record.sourceShardGitSha!==sourceBlob)
    issue('SOURCE_SHARD_BYTES_SHA_MISMATCH');
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
   const expectedReviewStatus=row.reviewStatus||row.approval;
   const reviewBinding=m.reviewEvidenceBinding||null;
   if(reviewBinding){
    for(const item of validateReviewBinding(root,reviewBinding,uid,sha256(m.meta),expectedReviewStatus))issue(item);
    if(bindingDigestMismatch(row,record,q,sourceQs[0],m,reviewBinding))issue('REVIEW_EVIDENCE_BINDING_PROJECTION_MISMATCH');
   }else{
    const prior=historicalEvidenceCompat.get(uid);
    if(!prior||prior.metaFinalSha256!==sha256(m.meta)||prior.metaReviewEvidenceSha256!==m.metaReviewEvidenceSha256||prior.sourceShardGitSha!==sourceBlob)
     issue('REVIEW_EVIDENCE_BINDING_MISSING_OR_HISTORICAL_BYTES_CHANGED');
   }
   if(q.difficultyBucket!==m.meta?.difficultyBucket||q.level!==m.meta?.level||
      q.standardUnitKey!==sourceQs[0].standardUnitKey||q.subUnitKey!==sourceQs[0].subUnitKey)
    issue('SOURCE_QUESTION_STANDARD_OR_DIFFICULTY_MISMATCH');
   if(m.meta?.rpmL4Namespace==='RPM_EXISTING_DRAFT'){
    const ref=contained(root,m.meta.rpmDraftAuthorityRef,'archive/data/meta-foundation/');
    if(!fs.existsSync(ref))issue('RPM_DRAFT_SOURCE_MISSING');
    else if(crypto.createHash('sha256').update(fs.readFileSync(ref)).digest('hex').toLowerCase()!==
      m.meta.rpmDraftAuthoritySha256.toLowerCase())issue('RPM_DRAFT_AUTHORITY_BYTES_MISMATCH');
   }
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
function bindingDigestMismatch(row,record,q,sourceQuestion,approved,binding){
 const stable={path:binding.path,sha256:binding.sha256.toLowerCase(),reviewStatus:binding.reviewStatus,uid:row.uid};
 return [row.metaReviewEvidence,record.metaReviewEvidence,q.metaReviewEvidence,sourceQuestion.metaReviewEvidence]
  .some(value=>canonical(value)!==canonical(stable));
}
if(require.main===module){
 const result=audit(path.resolve(__dirname,'../..'));
 console.log(JSON.stringify(result,null,2));
 if(result.failures)process.exitCode=1;
}
module.exports={validateMeta,validateProjection,validateReviewBinding,audit,sha256};
