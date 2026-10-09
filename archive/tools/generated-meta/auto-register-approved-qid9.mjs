#!/usr/bin/env node
// Automatic, approval-gated QID9 production registration. No candidate gets student access.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {registerApprovedGeneratedMeta,metaSha256,sha256Bytes,gitBlobSha} from './register-approved-generated-meta.mjs';
import gate from '../generated-meta-retention-gate.cjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const DIR='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/';
const INDEX='archive/data/generated-lite-consumer/v1/index.json';
const CROS='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json';
const SRCROOT='archive/generated/lite/v1/2022/H1/';
const SLOTS=['A1','A2','A3','B1','B2','B3','C1','C2','C3'];
const approve='USER_DIRECTED_QUALITY_APPROVED';
const read=rel=>fs.readFileSync(path.join(root,rel));
const json=rel=>JSON.parse(read(rel).toString('utf8'));
const buf=x=>Buffer.from(JSON.stringify(x,null,2)+'\n','utf8');
const hex=b=>sha256Bytes(b);
const exists=rel=>fs.existsSync(path.join(root,rel));
const write=(rel,bytes)=>{const full=path.join(root,rel);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);};
const label=s=>String(s||'').split('|').at(-1);
const requireTrue=(v,code)=>{if(!v)throw Error(code);};
const dedup=a=>[...new Set(a)];
const main=()=>{
 const mode=process.argv.includes('--write')?'write':'check';
 const manifest=json(DIR+'GPT_QID9_EXAM_MANIFEST.json');
 const crossBytes=read(CROS),cross=json(CROS),crossHash=hex(crossBytes);
 const compiledConcept=json('archive/data/meta-foundation/compiled/concept_registry.json');
 const condRegistry=json('archive/data/meta-foundation/compiled/condition_registry.json');
 const knownCross=new Set(compiledConcept.concepts.filter(x=>x.status==='ACTIVE').map(x=>x.conceptKey));
 const knownCond=new Set(condRegistry.conditions.filter(x=>x.status==='ACTIVE').map(x=>x.conditionKey));
 let index=json(INDEX);
 const sourceData={};let updated=0,skipped=0,done=0;
 // User-directed Q05-Q08 remains unchanged. Newly GPT-reviewed Q13-Q16
 // may be registered from their published, UID-scoped open-book receipt.
 const completed=[13,14,15,16].filter(n=>{
   const base=DIR+'GPT_QID9_Q'+String(n).padStart(2,'0')+'_PACKAGE.json';
   if(!exists(base))return false;
   const p=json(base);
   return p.qualityReview?.result==='PASS'&&p.qualityReview?.scope==='A1-C3_9_OF_9'&&
     p.qualityReview?.reviewLedger&&exists(p.qualityReview.reviewLedger)&&
     p.items?.length===9&&p.items.every(z=>z.reviewStatus==='GPT_OPEN_BOOK_REVIEW_PASS');
 });
 const approved=[...manifest.qidLedger.filter(e=>e.qid>=5 && e.reviewStatus===approve),
   ...completed.map(qid=>({qid,reviewStatus:'REVIEW_APPROVED',
     qualityApprovalBasis:'GPT_OPEN_BOOK_REVIEW_PASS_20261009_PALMA_Q13_Q16_36'}))];
 requireTrue(index.approvedCount===index.records.length,'INDEX_COUNT_DRIFT');
 requireTrue(new Set(index.records.map(x=>x.uid)).size===index.records.length,'INDEX_DUPLICATE_UID');
 for(const item of approved){
  const n=item.qid,ns=String(n).padStart(2,'0'),base=DIR+'GPT_QID9_Q'+ns+'_PACKAGE.json';
  requireTrue(exists(base),'APPROVED_PACKAGE_MISSING:'+n);
  const pkg=json(base),basis=item.qualityApprovalBasis||item.approvalBasis;
  const approvalStatus=item.reviewStatus==='REVIEW_APPROVED'?'REVIEW_APPROVED':approve;
  requireTrue(approvalStatus==='REVIEW_APPROVED'?
    basis==='GPT_OPEN_BOOK_REVIEW_PASS_20261009_PALMA_Q13_Q16_36':
    String(basis||'').startsWith('USER_DIRECTED_QUALITY_APPROVED'),'APPROVAL_BASIS_UNVERIFIED:'+n);
  requireTrue(pkg.sourceQid===n&&pkg.items.length===9&&new Set(pkg.items.map(x=>x.uid)).size===9,'QID9_PACKAGE_SCOPE_INVALID:'+n);
  const sourceExam=pkg.sourceExamPath||pkg.sourceArchiveFile||manifest.originalSourceExam;
  const sourceSha=pkg.sourceGitBlobSha||manifest.sourceBlobSha;
  requireTrue(exists(sourceExam)&&gitBlobSha(read(sourceExam))===sourceSha,'SOURCE_ORIGINAL_SHA_MISMATCH:'+n);
  for(const [ordinal,ci] of pkg.items.entries()){
   const slot=SLOTS[ordinal],uid=ci.uid,m=ci.meta||{};
   requireTrue(ci.slot===slot&&uid==='ALITE-PALMA25-2MID-Q'+ns+'-'+slot,'QID9_UID_OR_SLOT_MISMATCH:'+uid);
   requireTrue(Array.isArray(ci.choices)&&ci.choices.length===5&&new Set(ci.choices).size===5,'QID9_CHOICES_INVALID:'+uid);
   requireTrue(['①','②','③','④','⑤'].includes(ci.answer)&&ci.stem&&ci.solution,'QID9_STUDENT_FIELDS_INCOMPLETE:'+uid);
   const standardUnitKey=m.standardUnitKey||ci.standardUnitKey;
   const subUnitKey=m.subUnitKey||ci.subUnitKey;
   requireTrue(standardUnitKey&&subUnitKey,'QID9_STANDARD_UNIT_UNKNOWN:'+uid);
   const family=ci.rpmExactView||m;
   const rpmL1=family.rpmL1,rpmL2=family.rpmL2,rpmL3=family.rpmL3,rpmL4=family.rpmL4;
   requireTrue(rpmL1&&rpmL2&&rpmL3&&rpmL4,'RPM_META_SOURCE_REQUIRED:'+uid);
   const namespace=String(rpmL4).startsWith('EXT-')?'GENERATED_EXT_L4':'RPM_EXISTING_DRAFT';
   let rpmId=ci.rpmCanonicalRecordId||m.rpmRecordId||m.rpmPrimaryL3RecordId||m.rpmRecordIds?.[0]||m.sourceRpmL3Evidence?.evidenceRecordId||null;
   let found=cross.records.filter(row=>row.standardUnitKey===standardUnitKey&&row.subUnitKey===subUnitKey&&row.rpmPath.l3===label(rpmL3)&&
     (namespace==='GENERATED_EXT_L4'||row.rpmPath.l4===label(rpmL4)));
   if(rpmId)found=found.filter(row=>row.id===rpmId);
   requireTrue(found.length===1,'RPM_PRIMARY_LOOKUP_NOT_UNIQUE:'+uid);
   const record=found[0];rpmId=record.id;
   const ptRaw=m.problemTypeKey||m.pt||ci.activeProblemTypeKey||record.problemTypeKey;
   const tpl=m.templateKey||ci.activeTemplateKey||record.templateKey;
   const taxonomy=json('archive/data/meta-foundation/compiled/taxonomy_registry.json');
   const template=taxonomy.templates.find(row=>row.templateKey===tpl&&row.status==='ACTIVE');
   const pt=template?.parentProblemTypeKey||ptRaw;
   const ptRow=taxonomy.problemTypes.find(row=>row.problemTypeKey===pt&&row.status==='ACTIVE');
   requireTrue(!!ptRow&&!!template&&ptRow.ownerPack===record.ownerPack,'ACTIVE_PT_TPL_REQUIRED:'+uid);
   let crossConcept=[...(m.crossConceptKeys||ci.crossConceptKeys||[])];
   const missing=m.crossConceptUnmappedEvidenceLabels||[];
   if(missing.length){
    requireTrue(missing.length===1&&missing[0]==='삼각형의 외심'&&rpmL4.includes('외심')||missing.length===1&&missing[0]==='삼각형의 외심'&&ci.stem.includes('외심'),'CROSS_CONCEPT_UNRESOLVED:'+uid);
    crossConcept.push('CC_CIRCUMCIRCLE');
   }
   if(n===7&&['C2','C3'].includes(slot))crossConcept.push('CC_PERPENDICULAR');
   if(n===7&&slot==='C1')crossConcept.push('CC_CIRCLE_TANGENCY');
   if(n===6&&['C1','C3'].includes(slot))crossConcept.push('CC_PYTHAGOREAN');
   crossConcept=dedup(crossConcept);
   const extensionValid=(family,key,registryRef)=>{
     if(!key.startsWith('EXT-')||!registryRef||!registryRef.startsWith('archive/generated/lite/v1/')||!exists(registryRef))return false;
     const candidates=json(registryRef)[family]||[];
     return candidates.filter(row=>row.id===key&&/ACTIVE/.test(String(row.status||''))&&
       Array.isArray(row.exampleUids)&&row.exampleUids.includes(uid)).length===1;
   };
   const crossRegistry=m.crossConceptRegistryRef||m.generatedMetaRegistryRef||null;
   const conditionRegistry=m.conditionRegistryRef||m.generatedMetaRegistryRef||null;
   for(const k of crossConcept)
     requireTrue(knownCross.has(k)||extensionValid('crossConcepts',k,crossRegistry),
       'CROSS_CONCEPT_NOT_REGISTERED:'+uid+':'+k);
   let condition=dedup(m.conditionKeys||ci.conditionKeys||[]);
   const labels=ci.conditionWorkingLabels||[];
   if(labels.length||n===7&&['C1','C2','C3'].includes(slot)){
    if(/정수|짝수/.test(ci.stem))condition.push('COND_INTEGER');
    if(/양의|양수|>0/.test(ci.stem))condition.push('COND_POSITIVE');
    if(/음의/.test(ci.stem))condition.push('COND_NEGATIVE');
    if(/-4.*4|범위/.test(ci.stem)||labels.some(x=>/범위/.test(x)))condition.push('COND_RANGE');
   }
   condition=dedup(condition);
   for(const k of condition)
     requireTrue(knownCond.has(k)||extensionValid('conditions',k,conditionRegistry),
       'CONDITION_NOT_REGISTERED:'+uid+':'+k);
   const meta={
    rpmL1,rpmL2,rpmL3,rpmL4,rpmL4Namespace:namespace,rpmPrimaryRecordId:rpmId,
    ...(namespace==='GENERATED_EXT_L4'?{
      rpmAuthorityRef:CROS,rpmAuthoritySha256:crossHash,
      generatedL4RegistryRef:m.generatedL4RegistryRef,generatedL4RegistrySha256:hex(read(m.generatedL4RegistryRef))
    }:{
      rpmDraftAuthorityRef:CROS,rpmDraftAuthoritySha256:crossHash
    }),
    secondaryConceptKeys:[],crossConceptKeys:crossConcept,conditionKeys:condition,
    crossConceptRegistryRef:crossRegistry,conditionRegistryRef:conditionRegistry,
    sourceKind:'generated',
    integrationPattern:(m.integrationPattern||ci.integrationPattern)==='CONDITION_COMPOSITE'?'INTERDEPENDENT':
      (m.integrationPattern||ci.integrationPattern||'NONE'),
    difficultyBucket:ci.difficultyBucket,level:ci.level,problemTypeKey:pt,templateKey:tpl,
    ...(labels.length?{conditionEvidenceLabels:labels}:{}),
    ...(n===6&&slot==='B1'?{conditionRuleModifiers:['EVEN_INTEGER']}:{}),
    ...(missing.length?{crossConceptEvidenceLabels:missing}:{}),
    standardCourse:'공통수학2',standardUnitKey,subUnitKey
   };
   const category={ 'H22-C2-02':'직선의 방정식','H22-C2-03':'원의 방정식','H22-C2-04':'도형의 이동','H22-C2-05':'집합','H22-C2-06':'명제'}[standardUnitKey];
   const subLabel={'H22-C2-02-LINE_EQUATION':'직선의 방정식','H22-C2-03-INTERSECTION':'원과 직선·원의 관계','H22-C2-04-CORE':'도형의 이동 핵심 개념','H22-C2-05-CORE':'집합 핵심 개념','H22-C2-06-CORE':'명제 핵심 개념'}[subUnitKey];
   requireTrue(category&&subLabel,'UNIT_MASTER_MAPPING_REQUIRED:'+uid);
   const qa=gate.validateMeta(meta);
   if(qa.length)throw Error('META_PRECHECK:'+uid+':'+qa.join('|'));
   const fullName='palma-2025-2mid-qid9-q'+ns+'-'+slot;
   const sourcePath=SRCROOT+subUnitKey+'/shards/'+fullName+'.js';
   const metadataPath=SRCROOT+subUnitKey+'/metadata/'+fullName+'.json';
   const consumerPath='archive/data/generated-lite-consumer/v1/shards/'+subUnitKey+'/'+fullName+'.json';
   const reviewPath=DIR+'AUTO_REGISTER_EVIDENCE/'+fullName+'.json';
   const digest=metaSha256(meta);
   const existing=index.records.find(x=>x.uid===uid);
   if(existing?.metaFinalSha256===digest && existing.metaVerification?.status==='VERIFIED_CURRENT_SOURCE'){
    requireTrue(existing.shard===consumerPath.replace(/^archive\//,''),'EXISTING_UID_SHARD_DRIFT:'+uid);
    skipped++;continue;
   }
   if(mode==='check')throw Error('APPROVED_ITEM_NOT_AUTOREGISTERED:'+uid);
   const seed={
    id:1,uid,level:ci.level,difficultyBucket:ci.difficultyBucket,
    category,originalCategory:category,standardCourse:'공통수학2',standardUnitKey,
    standardUnit:category,standardUnitOrder:Number(standardUnitKey.slice(-2)),
    subUnitKey,subUnit:subLabel,subUnitConfidence:'candidate_evidence',
    subUnitClassificationDepth:'complete_candidate',
    questionType:'객관식',layoutTag:'grid',tags:['객관식',category],wide:false,
    content:ci.stem,choices:ci.choices,answer:ci.answer,solution:ci.solution,
    sourceType:'generated',sourceKind:'generated',sourceQid:n,slot,purposeGroup:slot[0]
   };
   const evidence={
    schemaVersion:'GENERATED_META_REVIEW_EVIDENCE_V1',
    items:[{uid,reviewStatus:approvalStatus,metaFinalSha256:digest,approvalBasis:basis,scopeUids:[uid]}]
   };
   write(reviewPath,buf(evidence));
   const sourceBytes=Buffer.from('window.examTitle = '+JSON.stringify('PALMA_2025_QID9_'+ns+'_'+slot)+';\nwindow.questionBank = '+JSON.stringify([seed],null,2)+';\n','utf8');
   write(sourcePath,sourceBytes);
   write(metadataPath,buf([{
    uid,qid:1,sourceQid:n,slot,sourceArchiveFile:sourceExam,sourceBlobSha:sourceSha,
    sourceSchoolMarker:'팔마고',reviewApprovalStatus:approvalStatus,
    sourceCandidatePath:base,sourceCandidateSha256:hex(read(base))
   }]));
   const currentSourceSha=gitBlobSha(sourceBytes);
   const prepared={schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',school:'팔마고',batchId:'PALMA25_QID9_AUTO_'+ns,
    sourceShard:sourcePath,sourceExamPath:sourceExam,sourceExamBlobSha:sourceSha,records:[]};
   if(existing){
    prepared.records.push({
      generatedUid:uid,sourceKind:'generated',sourceExamPath:sourceExam,sourceExamBlobSha:sourceSha,
      sourceQid:n,sourceShard:sourcePath,sourceShardGitSha:currentSourceSha,
      localOrdinal:1,l2:subUnitKey,slot,purposeGroup:slot[0],consumerSelectable:true,question:structuredClone(seed)
    });
    existing.shard=consumerPath.replace(/^archive\//,'');
    existing.localOrdinal=1;
    existing.l2=subUnitKey;
    existing.sourceShard=sourcePath;
    existing.sourceShardGitSha=currentSourceSha;
    existing.approval=approvalStatus;
    existing.reviewStatus=approvalStatus;
    existing.reviewApprovalBasis=basis;
    existing.consumerSelectable=true;
    delete existing.metaProjection;
    delete existing.metaBrowsePath;
   }
   write(consumerPath,buf(prepared));
   if(existing)write(INDEX,buf(index));
   const proposed={
     uid,school:'팔마고',year:2025,grade:'고1',subject:'공통수학2',sourceQid:n,
     sourceKind:'generated',l1:standardUnitKey,l2:subUnitKey,
     shard:consumerPath.replace(/^archive\//,''),localOrdinal:1,
     approval:approvalStatus,reviewStatus:approvalStatus,reviewApprovalBasis:basis,consumerSelectable:true
   };
   const paths={sourceShard:sourcePath,sourceMetadata:metadataPath,consumerShard:consumerPath,consumerIndex:INDEX};
   const expectedSha256=Object.fromEntries(Object.entries(paths).map(([key,rel])=>[key,hex(read(rel))]));
   const result=registerApprovedGeneratedMeta({
    root,uid,meta,approval:{status:approvalStatus},
    reviewEvidence:{path:reviewPath,sha256:hex(read(reviewPath)),reviewStatus:approvalStatus},
    paths,expectedSha256,
    ...(!existing?{newRegistration:{indexRow:proposed,sourceExamPath:sourceExam,sourceExamBlobSha:sourceSha}}:{})
   });
   requireTrue(result.status==='REGISTERED','REGISTER_RESULT_NOT_REGISTERED:'+uid);
   sourceData[uid]=result.metaFinalSha256;
   index=json(INDEX);
   updated++;done++;
  }
 }
 if(mode==='write'){
  const finalIndex=json(INDEX);
  requireTrue(finalIndex.approvedCount===finalIndex.records.length,'INDEX_COUNT_MISMATCH_AFTER');
  requireTrue(new Set(finalIndex.records.map(x=>x.uid)).size===finalIndex.records.length,'DUPLICATE_AFTER');
  const checked=gate.audit(root);
  requireTrue(checked.failures===0,'GENERATED_RETENTION_GATE_FAIL:'+checked.errors.slice(0,6).join('|'));
 }
 console.log(JSON.stringify({status:'PASS',approvedSourceQids:approved.map(x=>x.qid),registered:updated,alreadyRegistered:skipped,total:mode==='write'?json(INDEX).records.length:index.records.length}));
};
try{main()}catch(e){console.error(e.stack||e.message);process.exitCode=1}
