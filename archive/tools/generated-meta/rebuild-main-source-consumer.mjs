#!/usr/bin/env node
// Rebuild the Generated Consumer projection from every main-resident Generated Lite question shard.
// Review/approval fields are copied as history only; they do not control availability.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const sourceRoot='archive/generated/lite/v1';
const consumerRoot='archive/data/generated-lite-consumer/v1';
const indexRel=`${consumerRoot}/index.json`;
const mode=process.argv.includes('--write')?'write':'check';
const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const jsonBytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n','utf8');
const readJson=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
const exists=rel=>fs.existsSync(path.join(root,rel));
const filesUnder=dir=>{
 const out=[];
 const walk=abs=>{for(const entry of fs.readdirSync(abs,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  const full=path.join(abs,entry.name);if(entry.isDirectory())walk(full);else out.push(full);
 }};
 if(exists(dir))walk(path.join(root,dir));return out;
};
const normalizeQuestion=q=>{
 const copy=structuredClone(q);
 for(const key of ['image','solutionImage'])if(typeof copy[key]==='string'&&copy[key].startsWith('archive/'))copy[key]=copy[key].slice('archive/'.length);
 return copy;
};
const sourceExamInfo=sourcePath=>{
 const name=path.basename(sourcePath||'');
 const m=name.match(/^(\d{2,4})_([^_]+).*?(고\d|중\d)/);
 if(!m)return {};
 const n=Number(m[1]);return {year:n<100?2000+n:n,school:m[2],grade:m[3]};
};
const shaPattern=/^[a-f0-9]{40}$/i;
const metadataFor=(question,sidecar,index,count)=>{
 const row=(Array.isArray(sidecar)&&sidecar.length===count?sidecar[index]:null)||
  (Array.isArray(sidecar)&&question.uid?sidecar.find(x=>x?.uid===question.uid||x?.generatedQuestionUid===question.uid):null)||{};
 return row&&typeof row==='object'?row:{};
};
const metadataPathFor=source=>source.replace('/shards/','/metadata/').replace(/\.js$/i,'.json');
const metaFor=(q,m)=>q.meta||m.meta||m.metaProjection||Object.fromEntries(
 ['rpmL1','rpmL2','rpmL3','rpmL4','rpmPrimaryRecordId','rpmL4Namespace','rpmDraftAuthorityRef','rpmDraftAuthoritySha256','generatedL4RegistryRef','generatedL4RegistrySha256','problemTypeKey','templateKey','secondaryConceptKeys','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','level','standardCourse','standardUnitKey','subUnitKey'].filter(k=>q[k]!==undefined||m[k]!==undefined).map(k=>[k,q[k]??m[k]])
);
const qualityState=(q,m,old)=>old?.reviewStatus??m.reviewApprovalStatus??m.reviewStatus??q.reviewStatus??'NOT_REVIEWED';
const issueFor=(q)=>{
 const issues=[];
 if(typeof q.content!=='string'||!q.content.trim())issues.push('QUESTION_TEXT_MISSING');
 if(!Array.isArray(q.choices))issues.push('CHOICES_NOT_ARRAY');
 if(q.answer===undefined||q.answer===null||String(q.answer).trim()==='')issues.push('ANSWER_MISSING');
 if(typeof q.solution!=='string'||!q.solution.trim())issues.push('SOLUTION_MISSING');
 for(const key of ['image','solutionImage']){
  const ref=q[key];if(!ref)continue;
  if(typeof ref!=='string'||ref.includes('..')||ref.startsWith('/')||!(/^(?:archive\/)?assets\//.test(ref))){issues.push(`${key.toUpperCase()}_PATH_INVALID`);continue;}
  const rel=ref.startsWith('archive/')?ref:`archive/${ref}`;
  if(!exists(rel))issues.push(`${key.toUpperCase()}_FILE_MISSING:${ref}`);
  else if(/\.svg$/i.test(ref)){
   const svg=fs.readFileSync(path.join(root,rel),'utf8');
   if(!/<svg\b/i.test(svg)||!/<\/svg\s*>/i.test(svg))issues.push(`${key.toUpperCase()}_SVG_INVALID:${ref}`);
  }
 }
 return issues;
};
const main=()=>{
 const current=readJson(indexRel);
 if(current.schemaVersion!=='ALIVE_GENERATED_CONSUMER_INDEX_V1'||!Array.isArray(current.records))throw Error('CONSUMER_INDEX_SCHEMA_INVALID');
 const previous=new Map(current.records.map(row=>[row.uid,row]));
 const previousBySource=new Map(current.records.filter(row=>row.sourceShard&&row.localOrdinal!=null).map(row=>[`${row.sourceShard}\n${row.localOrdinal}`,row]));
 const disabled=new Set([...(current.userDisabledUids||[]),...(current.withdrawnUids||[])]);
 const manifests=new Map();
 for(const file of filesUnder('alive/06_EXECUTION'))if(path.basename(file)==='GPT_QID9_EXAM_MANIFEST.json'){
  try{const doc=JSON.parse(fs.readFileSync(file,'utf8'));for(const q of doc.qidLedger||[])for(const uid of q.uids||[])manifests.set(uid,{school:'금당고',year:2025,grade:'고1',subject:'공통수학2',sourceQid:q.sourceQid??q.qid,sourceExamPath:doc.sourceExamPath,sourceExamBlobSha:q.sourceExamBlobSha||doc.sourceBlobSha});}catch{}
 }
 const candidates=[],errors=[],sourceFiles=filesUnder(sourceRoot).filter(file=>file.includes(`${path.sep}shards${path.sep}`)&&file.endsWith('.js'));
 for(const abs of sourceFiles){
  const source=path.relative(root,abs).split(path.sep).join('/'),bytes=fs.readFileSync(abs),sourceSha=gitBlobSha(bytes);
  let questions;
  try{const sandbox={window:{}};vm.runInNewContext(bytes.toString('utf8'),sandbox,{timeout:2000,filename:source});questions=sandbox.window.questionBank||sandbox.window.generatedLiteQuestions;if(!Array.isArray(questions))throw Error('QUESTION_BANK_NOT_ARRAY');}
  catch(error){errors.push({source,code:'SOURCE_PARSE_ERROR',detail:String(error.message||error)});continue;}
  const sidecarRel=metadataPathFor(source);let sidecar=null;
  if(exists(sidecarRel)){try{sidecar=readJson(sidecarRel);}catch(error){errors.push({source:sidecarRel,code:'SOURCE_METADATA_PARSE_ERROR',detail:String(error.message||error)});}}
  const stagedMetadata=Array.isArray(sidecar)?structuredClone(sidecar):[];
  for(let i=0;i<questions.length;i++){
   const raw=questions[i];if(!raw||typeof raw!=='object'){errors.push({source,localOrdinal:i+1,code:'QUESTION_NOT_OBJECT'});continue;}
   const m=metadataFor(raw,sidecar,i,questions.length),manifest=manifests.get(raw.uid||m.uid||m.generatedQuestionUid)||{};
   const old=previous.get(raw.uid||m.uid||m.generatedQuestionUid)||previousBySource.get(`${source}\n${raw.id??i+1}`)||null;
   const knownConsumer=old;
   const qid=Number.isInteger(m.sourceQid)?m.sourceQid:Number.isInteger(m.sourceQuestionNo)?m.sourceQuestionNo:Number.isInteger(raw.sourceQid)?raw.sourceQid:Number.isInteger(manifest.sourceQid)?manifest.sourceQid:knownConsumer?.sourceQid??null;
   const sourceExamPath=m.sourceArchiveFile||m.sourceExamPath||m.sourceExam||manifest.sourceExamPath||knownConsumer?.sourceExamPath||'';
   const sourceIdentity=sourceExamInfo(sourceExamPath);
   const uid=raw.uid||m.uid||m.generatedQuestionUid||knownConsumer?.uid||`ALITE-MAIN-${sha256(Buffer.from(`${source}\n${raw.id??i+1}\n${raw.content||''}`)).slice(0,24)}`;
   const prior=previous.get(uid);
   const uidManifest=manifests.get(uid)||manifest;
   const school=prior?.school||m.sourceSchoolMarker||raw.school||uidManifest.school||sourceIdentity.school||'미분류';
   const year=prior?.year||Number(m.year)||Number(raw.year)||uidManifest.year||sourceIdentity.year||0;
   const grade=prior?.grade||m.grade||raw.grade||uidManifest.grade||sourceIdentity.grade||'미분류';
   const subject=prior?.subject||m.standardCourse||raw.standardCourse||uidManifest.subject||'미분류';
   const sourceQidFinal=qid??(Number.isInteger(raw.sourceQid)?raw.sourceQid:Number.isInteger(raw.id)?raw.id:i+1);
   const bucket=raw.subUnitKey||raw.meta?.subUnitKey||m.subUnitKey||m.l2||prior?.l2||'UNCLASSIFIED';
   const folder=/^[A-Za-z0-9_-]+$/.test(bucket)?bucket:`UNCLASSIFIED-${sha256(Buffer.from(bucket)).slice(0,10)}`;
   const consumerRel=`${consumerRoot}/shards/${folder}/${path.basename(source,'.js')}.json`;
   const examSha=m.sourceBlobSha||m.sourceExamBlobSha||manifest.sourceExamBlobSha||prior?.sourceExamBlobSha||'';
   const question=normalizeQuestion({...structuredClone(raw),uid});
   const issues=issueFor(question);
   if(examSha&&!shaPattern.test(examSha))issues.push('SOURCE_EXAM_BLOB_SHA_INVALID');
   candidates.push({uid,source,sourceSha,sourceOrdinal:i+1,sourceQuestion:raw,question,metadata:m,meta:metaFor(raw,m),sourceExamPath,sourceExamBlobSha:examSha,sourceQid:sourceQidFinal,school,year,grade,subject,l2:bucket,folder,consumerRel,prior,qualityStatus:qualityState(raw,m,prior),issues});
   if(Array.isArray(sidecar)){
    stagedMetadata[i]={...(stagedMetadata[i]||{}),uid:stagedMetadata[i]?.uid||uid,sourceQid:stagedMetadata[i]?.sourceQid??sourceQidFinal,sourceArchiveFile:stagedMetadata[i]?.sourceArchiveFile||sourceExamPath||undefined,sourceBlobSha:stagedMetadata[i]?.sourceBlobSha||examSha||undefined,sourceSchoolMarker:stagedMetadata[i]?.sourceSchoolMarker||school,meta:stagedMetadata[i]?.meta||metaFor(raw,m),metaProjectionOrigin:stagedMetadata[i]?.metaProjectionOrigin||'MAIN_SOURCE_QUESTION_JS',reviewApprovalStatus:stagedMetadata[i]?.reviewApprovalStatus||qualityState(raw,m,prior)};
   }else{
    if(!sidecar)stagedMetadata.push({uid,sourceQid:sourceQidFinal,sourceArchiveFile:sourceExamPath||undefined,sourceBlobSha:examSha||undefined,sourceSchoolMarker:school,meta:metaFor(raw,m),metaProjectionOrigin:'MAIN_SOURCE_QUESTION_JS',reviewApprovalStatus:qualityState(raw,m,prior),studentSupplyEligible:raw.studentSupplyEligible??null,consumerSelectable:raw.consumerSelectable??null});
   }
  }
  if(!sidecar){
   const sidecarBytes=jsonBytes(stagedMetadata),sidecarAbs=path.join(root,sidecarRel);
   if(mode==='write'){fs.mkdirSync(path.dirname(sidecarAbs),{recursive:true});fs.writeFileSync(sidecarAbs,sidecarBytes);}
   else if(!exists(sidecarRel)||!fs.readFileSync(sidecarAbs).equals(sidecarBytes))errors.push({source:sidecarRel,code:'SOURCE_METADATA_PROJECTION_STALE'});
  }
 }
 const byUid=new Map();for(const c of candidates){if(disabled.has(c.uid))continue;if(!byUid.has(c.uid))byUid.set(c.uid,[]);byUid.get(c.uid).push(c);}
 const chosen=[];
 for(const [uid,dupes] of byUid){
  const old=previous.get(uid),matching=dupes.find(c=>c.source===old?.sourceShard),pick=matching||dupes.sort((a,b)=>a.source.localeCompare(b.source))[0];
  const fingerprints=new Set(dupes.map(c=>sha256(Buffer.from(JSON.stringify({content:c.question.content,choices:c.question.choices,answer:c.question.answer,solution:c.question.solution,image:c.question.image,solutionImage:c.question.solutionImage})))));
  if(fingerprints.size>1&&!matching){const detail={uid,code:'DUPLICATE_UID_BODY_CONFLICT',sources:[...new Set(dupes.map(c=>c.source))]};errors.push(detail);pick.issues.push('DUPLICATE_UID_BODY_CONFLICT');}
  chosen.push(pick);
 }
 chosen.sort((a,b)=>a.source.localeCompare(b.source)||a.sourceOrdinal-b.sourceOrdinal);
 const groups=new Map();
 for(const c of chosen){if(!groups.has(c.consumerRel))groups.set(c.consumerRel,[]);groups.get(c.consumerRel).push(c);}
 const newRows=[];
 for(const [consumerRel,items] of groups){
  const sourceShard=items[0].source,school=items[0].school;
  const existingConsumer=exists(consumerRel)?readJson(consumerRel):{};
  const existingConsumerByUid=new Map((existingConsumer.records||[]).map(row=>[row.generatedUid,row]));
  const doc={schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',school,batchId:`MAIN_SOURCE_${path.basename(sourceShard,'.js')}`,sourceKind:'generated',sourceShard,sourceShardGitSha:items[0].sourceSha,records:[]};
  for(const c of items){
   const row=c.prior?structuredClone(c.prior):{};
   const meta=c.meta||{};
   Object.assign(row,{uid:c.uid,school:c.school,year:c.year,grade:c.grade,subject:c.subject,sourceQid:c.sourceQid,l2:c.l2,l2Label:c.question.subUnit||c.metadata.subUnit||c.metadata.l2Label||row.l2Label||'',shard:consumerRel.replace(/^archive\//,''),localOrdinal:c.prior?.localOrdinal||c.sourceQuestion.id||c.sourceOrdinal,sourceKind:'generated',sourceShard:c.source,sourceShardGitSha:c.sourceSha,sourceExamPath:c.sourceExamPath||row.sourceExamPath||'',sourceExamBlobSha:c.sourceExamBlobSha||row.sourceExamBlobSha||'',consumerSelectable:c.issues.length===0,technicalStatus:c.issues.length?'ERROR':'READY',technicalIssues:c.issues,mainSourceAvailable:true,qualityStatus:c.qualityStatus,reviewStatus:c.prior?.reviewStatus||c.metadata.reviewApprovalStatus||c.metadata.reviewStatus||c.sourceQuestion.reviewStatus||'NOT_REVIEWED',approval:c.prior?.approval||c.metadata.reviewApprovalStatus||c.metadata.reviewStatus||c.sourceQuestion.reviewStatus||'NOT_REVIEWED',meta,sourceMetaSha256:sha256(Buffer.from(JSON.stringify(meta)))});
   row.userDisabled=disabled.has(c.uid);
   if(c.issues.length)row.consumerSelectable=false;
   if(!row.userDisabled&&!c.issues.length)row.consumerSelectable=true;
   const currentMetaSha=c.prior?.metaFinalSha256;
   const sourceMetaHash=sha256(Buffer.from(JSON.stringify(meta)));
   if(!currentMetaSha||!c.prior?.sourceShardGitSha||c.prior.sourceShardGitSha!==c.sourceSha){delete row.metaFinalSha256;delete row.metaVerification;}
   if(c.metadata.reviewEvidenceBinding&&!row.reviewApprovalReceipt)row.reviewApprovalReceipt=c.metadata.reviewEvidenceBinding.path;
   doc.records.push({...structuredClone(existingConsumerByUid.get(c.uid)||{}),generatedUid:c.uid,localOrdinal:row.localOrdinal,sourceKind:'generated',sourceExamPath:row.sourceExamPath,sourceExamBlobSha:row.sourceExamBlobSha,sourceQid:c.sourceQid,sourceShard:c.source,sourceShardGitSha:c.sourceSha,l2:c.l2,reviewStatus:row.reviewStatus,consumerSelectable:row.consumerSelectable,technicalStatus:row.technicalStatus,technicalIssues:row.technicalIssues,meta,question:c.question});
   newRows.push(row);
  }
  const consumerBytes=jsonBytes(doc),consumerAbs=path.join(root,consumerRel);
  const consumerSha=gitBlobSha(consumerBytes);
  for(const row of newRows.filter(r=>r.shard===consumerRel.replace(/^archive\//,''))){row.consumerShardGitSha=consumerSha;row.shardGitBlobSha=consumerSha;row.consumerShardSha256=sha256(consumerBytes);}
  if(mode==='write'){fs.mkdirSync(path.dirname(consumerAbs),{recursive:true});fs.writeFileSync(consumerAbs,consumerBytes);}
  else if(!exists(consumerRel)||!fs.readFileSync(consumerAbs).equals(consumerBytes))errors.push({source:consumerRel,code:'CONSUMER_SHARD_STALE'});
 }
 const represented=new Set(newRows.map(row=>row.uid));
 const preserved=current.records.filter(row=>!represented.has(row.uid)&&!disabled.has(row.uid)&&!String(row.sourceShard||'').startsWith(`${sourceRoot}/`));
 const records=[...preserved,...newRows];
 const ids=records.map(row=>row.uid);
 if(new Set(ids).size!==ids.length)errors.push({code:'DUPLICATE_CONSUMER_UID'});
 const counts={};for(const row of records)counts[row.school]=(counts[row.school]||0)+1;
 const output={...current,schemaVersion:'ALIVE_GENERATED_CONSUMER_INDEX_V1',scope:'MAIN_RESIDENT_GENERATED_QUESTION_JS',sourceKind:'generated',availabilityPolicy:'MAIN_SOURCE_AVAILABLE_REVIEW_STATUS_INDEPENDENT',userDisabledUids:[...disabled].sort(),recordCount:records.length,approvedCount:records.length,approvedBySchool:counts,records,sourceSync:{schemaVersion:'MAIN_GENERATED_SOURCE_SYNC_V1',sourceShardCount:sourceFiles.length,uniqueQuestionUidCount:chosen.length,recordCount:records.length,duplicateUidCount:candidates.length-chosen.length,errorCount:errors.length,errors:errors.slice(0,200)}};
 const indexBytes=jsonBytes(output),indexAbs=path.join(root,indexRel);
 if(mode==='write'){fs.writeFileSync(indexAbs,indexBytes);}
 else if(!fs.readFileSync(indexAbs).equals(indexBytes))errors.push({source:indexRel,code:'CONSUMER_INDEX_STALE'});
 if(errors.length&&mode==='check')throw Error(`CHECK_FAILED:${JSON.stringify({sourceShardCount:sourceFiles.length,questionCount:candidates.length,uniqueUidCount:chosen.length,errors:errors.slice(0,30)})}`);
 process.stdout.write(JSON.stringify({status:errors.length?'PASS_WITH_TECHNICAL_ERRORS':'PASS',mode,sourceShardCount:sourceFiles.length,questionCount:candidates.length,uniqueUidCount:chosen.length,registeredCount:records.length,geumdangCount:records.filter(r=>r.school==='금당고').length,geumdangUids:records.filter(r=>r.school==='금당고'&&r.uid.startsWith('ALITE-GEUMDANG25-2FINAL-')).length,technicalErrorCount:records.filter(r=>r.technicalStatus==='ERROR').length,diagnosticCount:errors.length,sourceSyncErrors:errors.slice(0,30)},null,2)+'\n');
};
try{main();}catch(error){process.stderr.write(`${error.stack||error.message}\n`);process.exitCode=1;}
