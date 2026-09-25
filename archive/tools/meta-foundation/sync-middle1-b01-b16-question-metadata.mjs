#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const json=(x)=>JSON.stringify(x,null,2)+'\n';
const sha=(x)=>crypto.createHash('sha256').update(x).digest('hex');
const input=read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const mapping=read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const paths=read(`${global}/B01_B16_ARCHIVE2_PATH_MAPPING.json`);
const identity=read('archive/data/question_identity_map.json');
const labelMaster=read('archive/data/master_tables/js_archive_tag_master.json');
const sourcePath='archive/data/question_metadata.json';
const originalText=fs.readFileSync(path.join(root,sourcePath),'utf8');
const branchHeadText=execFileSync('git',['show',`HEAD:${sourcePath}`],{cwd:root,maxBuffer:100*1024*1024}).toString('utf8');
const metadata=JSON.parse(originalText);
const originalRecords=new Map(metadata.records.map((r)=>[r.questionUid,JSON.stringify(r)]));
const idByUid=new Map(identity.records.map((r)=>[r.questionUid,r]));
const inByUid=new Map(input.rows.map((r)=>[r.questionUid,r]));
const mapByUid=new Map(mapping.uidMappings.map((r)=>[r.questionUid,r]));
const pathByUid=new Map(paths.records.map((r)=>[r.questionUid,r]));
const labelByKey=new Map(labelMaster.map((r)=>[r.key,r]));
const qualityByUid=new Map();
const basicParentBySubUnit=new Map([
  ['M1-04-COORDINATE_PLANE',['M1-1','좌표평면과 그래프','좌표와 그래프']],
  ['M1-06-PLANE_FIGURE_MEASURE',['M1-2','평면도형','다각형']],
  ['M1-06-POLYGON_CIRCLE',['M1-2','평면도형','다각형']]
]);
for(let b=1;b<=16;b++){
  const exam=input.batches.find((r)=>r.batchNo===b);
  const p=path.join(root,exam.artifactPath,'SOURCE_QUALITY.jsonl');
  for(const line of fs.readFileSync(p,'utf8').split(/\r?\n/).filter(Boolean)){const q=JSON.parse(line);if(qualityByUid.has(q.questionUid))throw new Error(`Quality duplicate ${q.questionUid}`);qualityByUid.set(q.questionUid,q);}
}
const changed=[];const failures=[];let directPath=0,rpmHold=0,semanticHold=0,routeOut=0,qualityHold=0;
const curriculumFor=(file)=>{const year=Number(path.basename(file).slice(0,2));if(!Number.isInteger(year)||year<19||year>30)throw new Error(`Unknown exam year ${file}`);return year>=25?'2022':'2015';};
const approvalRoot=`${global}/B01_B16_CANONICAL_MAPPING.json`;
for(const record of metadata.records){
  const ledger=inByUid.get(record.questionUid);
  if(!ledger)continue;
  const id=idByUid.get(record.questionUid),m=mapByUid.get(record.questionUid),rpm=pathByUid.get(record.questionUid),quality=qualityByUid.get(record.questionUid);
  if(!id||!rpm||!quality)throw new Error(`Missing UID join ${record.questionUid}`);
  if(id.sourceArchiveFile!==record.sourceArchiveFile||id.sourceOrdinal!==record.sourceOrdinal||id.sourceFingerprint!==record.sourceFingerprint||ledger.sourceFingerprint!==record.sourceFingerprint)throw new Error(`Identity fingerprint mismatch ${record.questionUid}`);
  if(quality.sourceFingerprint!==ledger.sourceFingerprint)throw new Error(`Quality fingerprint mismatch ${record.questionUid}`);
  const before=JSON.stringify(record);
  const batch=input.batches.find((r)=>r.batchNo===ledger.batchNo);
  const evidence=[...new Set([...(record.approvalEvidence||[]),approvalRoot,`${batch.artifactPath}/CONSENSUS.jsonl`,`${batch.artifactPath}/DIFFICULTY_FINAL.jsonl`])];
  record.approvalEvidence=evidence;
  record.metadataRevision='meta-foundation:MIDDLE1@1.0.0:B01-B16';
  record.metaFoundationPackVersion='1.0.0';
  record.standardCourse='중1 수학';
  record.curriculum=curriculumFor(ledger.sourceArchiveFile);
  if(m){
    if(m.standardUnitKey!==ledger.standardUnitKey||m.subUnitKey!==ledger.subUnitKey)throw new Error(`Mapped L1/L2 ${record.questionUid}`);
    record.standardUnitKey=ledger.standardUnitKey;
    record.subUnitKey=ledger.subUnitKey;
    record.standardUnit=labelByKey.get(ledger.standardUnitKey)?.labelKo||record.standardUnit;
    record.subUnit=labelByKey.get(ledger.subUnitKey)?.labelKo||record.subUnit;
    record.conceptClusterKey=ledger.subUnitKey;
    record.problemTypeKey=m.finalProblemTypeKey;
    record.templateKey=m.finalTemplateKey;
    record.crossConceptKeys=m.finalCrossConceptKeys;
    record.conditionKeys=m.conditionKeys;
    record.integrationPattern=m.integrationPattern;
    record.difficultyBucket=ledger.difficultyBucket;
    record.difficultyConfidence=ledger.difficultyConfidence;
    record.difficultyBoundaryFlag=ledger.difficultyBoundaryFlag;
    record.legacyLevelCompatibility=ledger.legacyLevelCompatibility;
    record.foundationTaxonomyStatus='CONFIRMED';
    record.rpmPathStatus=rpm.rpmPathStatus;
    if(rpm.rpmPathStatus==='DIRECT'){
      Object.assign(record,rpm.rpmPath);
      directPath++;
    }else{
      for(const f of ['curriculumKey','courseKey','L1','L2','L3','L4'])delete record[f];
      const basicParent=quality.disposition==='HOLD_RESOLVED_NO_SOURCE_MUTATION'
        ? basicParentBySubUnit.get(record.subUnitKey) : null;
      if(basicParent){
        Object.assign(record,{curriculumKey:record.curriculum,courseKey:basicParent[0],L1:basicParent[1],L2:basicParent[2]});
      }
      record.curriculumApplicability=basicParent?'DEFAULT_SCOPE':'HOLD';record.defaultSelectable=Boolean(basicParent);
      record.rpmPathHoldReason=rpm.semanticReason;
      rpmHold++;
    }
    const isQualityHold=quality.runtimeSelectableBeforeRepair===false || quality.disposition==='SOLUTION_REPAIR_REQUIRED';
    if(isQualityHold)qualityHold++;
    const basicSelectable=!isQualityHold&&(rpm.rpmPathStatus==='DIRECT'||Boolean(record.L1&&record.L2));
    record.reviewStatus=basicSelectable?'reviewed_pass':'reviewed_hold';
    record.tagConfidence='independent_semantic_consensus';
    record.tagStatus='meta_foundation_final';
    record.metadataStatus=record.reviewStatus==='reviewed_pass'?'approved_full':'approved_full_with_selectability_hold';
    record.fieldStatus={...record.fieldStatus,standardUnit:'approved_source',subUnit:'approved_source',problemType:'approved_semantic',template:'approved_semantic',crossConcept:'approved_semantic',condition:'approved_semantic',integrationPattern:'approved_semantic',difficulty:'approved_blind_recheck'};
    record.metaFoundationHoldReason=quality.disposition==='SOLUTION_REPAIR_REQUIRED'?quality.issueType:(basicSelectable?null:rpm.semanticReason);
  }else{
    for(const f of ['curriculumKey','courseKey','L1','L2','L3','L4'])delete record[f];
    record.problemTypeKey='';record.templateKey='';record.crossConceptKeys=[];record.conditionKeys=[];record.integrationPattern='NONE';
    record.difficultyBucket=ledger.difficultyBucket;
    record.difficultyConfidence=ledger.difficultyConfidence;
    record.difficultyBoundaryFlag=ledger.difficultyBoundaryFlag;
    record.legacyLevelCompatibility=ledger.legacyLevelCompatibility;
    record.curriculumApplicability='HOLD';record.defaultSelectable=false;
    record.foundationTaxonomyStatus='HOLD';record.rpmPathStatus='SEMANTIC_HOLD_OR_ROUTE_OUT';
    record.reviewStatus=ledger.reviewStatus==='ROUTE_OUT'?'route_out':'reviewed_hold';
    record.tagConfidence='independent_semantic_consensus';record.tagStatus='meta_foundation_explicit_hold';
    record.metadataStatus=record.reviewStatus==='route_out'?'route_out':'source_hold';
    record.metaFoundationHoldReason=ledger.reviewStatus==='ROUTE_OUT'?'CROSS_GRADE_ROUTE_OUT':quality.issueType;
    if(ledger.reviewStatus==='ROUTE_OUT')routeOut++;else semanticHold++;
  }
  if(!['NORMAL','BORDERLINE_ACCEPTABLE','STRONG_CONFLICT','UNKNOWN'].includes(record.legacyLevelCompatibility))failures.push(`legacyCompatibility:${record.questionUid}`);
  if(JSON.stringify(record)===before)failures.push(`unchangedTarget:${record.questionUid}`);
  changed.push(record.questionUid);
}
const targetSet=new Set(input.rows.map((r)=>r.questionUid));
const nonTargetChanges=metadata.records.filter((r)=>!targetSet.has(r.questionUid)&&JSON.stringify(r)!==originalRecords.get(r.questionUid));
if(changed.length!==input.counts.uniqueUid||new Set(changed).size!==changed.length||nonTargetChanges.length)failures.push(`scope:${changed.length}/${input.counts.uniqueUid};outside=${nonTargetChanges.length}`);
metadata.metadataRevision='archive-metadata-v1-phase1b-20260825+MIDDLE1-B01-B16@1.0.0';
metadata.middle1Promotion={schemaVersion:'m1-b01-b16-question-metadata-promotion-v1',packVersion:'1.0.0',uidDenominator:changed.length,sourceBranch:'codex/meta-foundation/middle1',sourceHead:input.sourceHead,scope:'B01-B16_ONLY',mappingArtifact:approvalRoot};
const resultText=json(metadata);
const receipt={schemaVersion:'m1-b01-b16-question-metadata-sync-receipt-v1',uidDenominator:input.counts.uniqueUid,updatedUidCount:changed.length,nonTargetRecordChangeCount:nonTargetChanges.length,sourceHead:input.sourceHead,
  directArchive2PathCount:directPath,explicitRpmPathHoldCount:rpmHold,semanticHoldCount:semanticHold,routeOutCount:routeOut,solutionQualityHoldCount:qualityHold,
  beforeSha256:sha(branchHeadText),afterSha256:sha(resultText),failures,questionUids:changed};
const dryRun=process.argv.includes('--dry-run');
if(!dryRun&&!failures.length){fs.writeFileSync(path.join(root,sourcePath),resultText);fs.writeFileSync(path.join(root,`${global}/B01_B16_QUESTION_METADATA_SYNC_RECEIPT.json`),json(receipt));}
console.log(JSON.stringify({dryRun,updatedUidCount:changed.length,nonTargetRecordChangeCount:nonTargetChanges.length,directArchive2PathCount:directPath,explicitRpmPathHoldCount:rpmHold,semanticHoldCount:semanticHold,routeOutCount:routeOut,solutionQualityHoldCount:qualityHold,failureCount:failures.length,failures:failures.slice(0,10)},null,2));
if(failures.length)process.exitCode=1;
