#!/usr/bin/env node
// Rebuild the Generated Consumer projection from every main-resident Generated Lite question shard.
// Review/approval fields are copied as history only; they do not control availability.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const sourceRoot='archive/generated/lite/v1';
const consumerRoot='archive/data/generated-lite-consumer/v1';
const indexRel=`${consumerRoot}/index.json`;
const mode=process.argv.includes('--write')?'write':'check';
const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const sourceGitBlobSha=(relative,absolute,bytes)=>{
 try{
  const sha=execFileSync('git',['hash-object',`--path=${relative}`,absolute],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
  if(/^[a-f0-9]{40}$/i.test(sha))return sha;
 }catch{}
 return gitBlobSha(bytes);
};
const contentFingerprint=q=>{
 const value=JSON.stringify({content:q.content,choices:q.choices,answer:q.answer,solution:q.solution});
 let hash=14695981039346656037n;
 for(let i=0;i<value.length;i++)hash=BigInt.asUintN(64,(hash^BigInt(value.charCodeAt(i)))*1099511628211n);
 return `fnv1a64-utf16:${hash.toString(16).padStart(16,'0')}`;
};
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
 const m=name.match(/^(\d{2,4})_([^_]+)_(\d+)학기_(중간|기말)_(고\d|중\d)/);
 if(!m)return {};
 const n=Number(m[1]);return {year:n<100?2000+n:n,school:m[2],semester:Number(m[3]),term:m[4],grade:m[5]};
};
const normalizeSourceExamPath=sourcePath=>{
 const raw=String(sourcePath||'').replace(/\\/g,'/').replace(/^\.\//,'');
 if(!raw)return '';
 if(raw.startsWith('archive/'))return raw;
 const direct=raw.startsWith('exams/')?`archive/${raw}`:raw.startsWith('original/')?`archive/exams/${raw}`:'';
 if(direct&&exists(direct))return direct;
 const requested=path.basename(raw).replace(/\.js$/i,'');
 const examFiles=filesUnder('archive/exams/original');
 const exact=examFiles.filter(file=>path.basename(file).replace(/\.js$/i,'')===requested);
 const matches=exact.length?exact:examFiles.filter(file=>path.basename(file).replace(/\.js$/i,'').startsWith(requested));
 return matches.length===1?path.relative(root,matches[0]).split(path.sep).join('/'):raw;
};
const shaPattern=/^[a-f0-9]{40}$/i;
const metadataFor=(question,sidecar,index,count)=>{
 const row=(Array.isArray(sidecar)&&sidecar.length===count?sidecar[index]:null)||
  (Array.isArray(sidecar)&&question.uid?sidecar.find(x=>x?.uid===question.uid||x?.generatedQuestionUid===question.uid):null)||
  (Array.isArray(sidecar?.records)?sidecar.records.find(x=>x?.uid===question.uid||x?.generatedQuestionUid===question.uid):null)||
  (sidecar&&typeof sidecar==='object'&&(!sidecar.uid&&!sidecar.generatedQuestionUid||sidecar.uid===question.uid||sidecar.generatedQuestionUid===question.uid)?sidecar:null)||{};
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
 const priorConsumerShards=new Map(),priorConsumerByUid=new Map();
 for(const row of current.records){
  if(!row.shard||row.localOrdinal==null)continue;
  const rel=`archive/${row.shard}`;
  if(!rel.startsWith(`${consumerRoot}/`)||!exists(rel))continue;
  if(!priorConsumerShards.has(rel)){
   try{const doc=readJson(rel);priorConsumerShards.set(rel,new Map((doc.records||[]).map(item=>[`${item.generatedUid}\n${item.localOrdinal}`,item])));}catch{}
  }
  const record=priorConsumerShards.get(rel)?.get(`${row.uid}\n${row.localOrdinal}`);
  if(record)priorConsumerByUid.set(row.uid,record);
  if(record?.sourceShard)previousBySource.set(`${record.sourceShard}\n${row.localOrdinal}`,row);
 }
 const disabled=new Set([...(current.userDisabledUids||[]),...(current.withdrawnUids||[])]);
 const manifests=new Map();
 for(const file of filesUnder('alive/06_EXECUTION'))if(path.basename(file)==='GPT_QID9_EXAM_MANIFEST.json'){
  try{
   const doc=JSON.parse(fs.readFileSync(file,'utf8'));
   const sourceExamPath=normalizeSourceExamPath(doc.sourceExamPath||doc.originalSourceExam||doc.originalSourceArchiveFile||doc.sourceArchiveFile||'');
   const identity=sourceExamInfo(sourceExamPath);
   const sourceExamBlobSha=doc.sourceExamBlobSha||doc.sourceBlobSha||'';
   const sourceExamQuestionCount=Number(doc.sourceQidCount)||0;
   for(const q of doc.qidLedger||[])for(const uid of q.uids||[])manifests.set(uid,{
    ...identity,school:doc.school||identity.school,year:Number(doc.year)||identity.year,grade:doc.grade||identity.grade,
    subject:doc.subject||doc.standardCourse,sourceQid:q.sourceQid??q.qid,sourceExamPath,
    sourceExamBlobSha:q.sourceExamBlobSha||sourceExamBlobSha,sourceExamQuestionCount
   });
  }catch{}
 }
 const candidates=[],errors=[],sourceFiles=filesUnder(sourceRoot).filter(file=>file.includes(`${path.sep}shards${path.sep}`)&&file.endsWith('.js'));
 for(const abs of sourceFiles){
  const source=path.relative(root,abs).split(path.sep).join('/'),bytes=fs.readFileSync(abs),sourceSha=sourceGitBlobSha(source,abs,bytes);
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
   const qid=Number.isInteger(m.sourceQid)?m.sourceQid:Number.isInteger(m.sourceQuestionNo)?m.sourceQuestionNo:Number.isInteger(m.source?.qid)?m.source.qid:Number.isInteger(raw.sourceQid)?raw.sourceQid:Number.isInteger(manifest.sourceQid)?manifest.sourceQid:knownConsumer?.sourceQid??null;
   const sourceExamPath=normalizeSourceExamPath(m.sourceArchiveFile||m.sourceExamPath||m.sourceExam||m.source?.exam||m.source?.sourceExamPath||manifest.sourceExamPath||knownConsumer?.sourceExamPath||'');
   const sourceIdentity=sourceExamInfo(sourceExamPath);
   const uid=raw.uid||knownConsumer?.uid||m.uid||m.generatedQuestionUid||`ALITE-MAIN-${sha256(Buffer.from(`${source}\n${raw.id??i+1}\n${raw.content||''}`)).slice(0,24)}`;
   const prior=previous.get(uid);
   const uidManifest=manifests.get(uid)||manifest;
   const school=m.sourceSchoolMarker||m.source?.school||raw.school||uidManifest.school||sourceIdentity.school||prior?.school||'미분류';
   const year=Number(m.year)||Number(raw.year)||uidManifest.year||sourceIdentity.year||prior?.year||0;
   const grade=m.grade||raw.grade||uidManifest.grade||sourceIdentity.grade||prior?.grade||'미분류';
   const subject=m.standardCourse||raw.standardCourse||uidManifest.subject||prior?.subject||'미분류';
   const sourceQidFinal=qid??(Number.isInteger(raw.sourceQid)?raw.sourceQid:Number.isInteger(raw.id)?raw.id:i+1);
   const bucket=raw.subUnitKey||raw.meta?.subUnitKey||m.subUnitKey||m.l2||prior?.l2||'UNCLASSIFIED';
   const folder=/^[A-Za-z0-9_-]+$/.test(bucket)?bucket:`UNCLASSIFIED-${sha256(Buffer.from(bucket)).slice(0,10)}`;
   const defaultConsumerRel=`${consumerRoot}/shards/${folder}/${path.basename(source,'.js')}.json`;
   const consumerRel=prior?.shard?`archive/${prior.shard}`:defaultConsumerRel;
   const examSha=m.sourceExamBlobSha||m.sourceBlobSha||m.source?.sourceExamBlobSha||m.source?.sourceBlobSha||manifest.sourceExamBlobSha||prior?.sourceExamBlobSha||'';
   const sourceExamQuestionCount=Number(m.sourceExamQuestionCount)||manifest.sourceExamQuestionCount||Number(prior?.sourceExamQuestionCount)||0;
   const question=normalizeQuestion({...structuredClone(raw),uid});
   const issues=issueFor(question);
   if(examSha&&!shaPattern.test(examSha))issues.push('SOURCE_EXAM_BLOB_SHA_INVALID');
   candidates.push({uid,source,sourceSha,sourceOrdinal:i+1,sourceQuestion:raw,question,metadata:m,meta:metaFor(raw,m),sourceExamPath,sourceExamBlobSha:examSha,sourceExamQuestionCount,sourceQid:sourceQidFinal,school,year,grade,subject,l2:bucket,folder,consumerRel,prior,qualityStatus:qualityState(raw,m,prior),issues});
   if(Array.isArray(sidecar)&&!knownConsumer){
    stagedMetadata[i]={...(stagedMetadata[i]||{}),uid:raw.uid||((stagedMetadata[i]?.metaProjectionOrigin==='MAIN_SOURCE_QUESTION_JS')?uid:(stagedMetadata[i]?.uid||uid)),sourceQid:stagedMetadata[i]?.sourceQid??sourceQidFinal,sourceArchiveFile:stagedMetadata[i]?.sourceArchiveFile||sourceExamPath||undefined,sourceBlobSha:stagedMetadata[i]?.sourceBlobSha||examSha||undefined,sourceSchoolMarker:stagedMetadata[i]?.sourceSchoolMarker||school,meta:stagedMetadata[i]?.meta||metaFor(raw,m),metaProjectionOrigin:stagedMetadata[i]?.metaProjectionOrigin||'MAIN_SOURCE_QUESTION_JS',reviewApprovalStatus:stagedMetadata[i]?.reviewApprovalStatus||qualityState(raw,m,prior)};
   }else{
    if(!sidecar&&!knownConsumer)stagedMetadata.push({uid,sourceQid:sourceQidFinal,sourceArchiveFile:sourceExamPath||undefined,sourceBlobSha:examSha||undefined,sourceSchoolMarker:school,meta:metaFor(raw,m),metaProjectionOrigin:'MAIN_SOURCE_QUESTION_JS',reviewApprovalStatus:qualityState(raw,m,prior),studentSupplyEligible:raw.studentSupplyEligible??null,consumerSelectable:raw.consumerSelectable??null});
   }
  }
  if(!sidecar&&stagedMetadata.length){
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
  const replacedUids=new Set(items.map(item=>item.uid));
  const doc={...existingConsumer,schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',school:existingConsumer.school||school,batchId:existingConsumer.batchId||`MAIN_SOURCE_${path.basename(sourceShard,'.js')}`,sourceKind:'generated',sourceShard,sourceShardGitSha:items[0].sourceSha,records:(existingConsumer.records||[]).filter(row=>!replacedUids.has(row.generatedUid))};
  for(const c of items){
   const row=c.prior?structuredClone(c.prior):{};
   const meta=c.meta||{};
   const metaSha=sha256(Buffer.from(JSON.stringify(meta)));
   const sourceChanged=!c.prior||c.prior.sourceShardGitSha!==c.sourceSha;
   const sourceMetaChanged=!!c.prior?.sourceMetaSha256&&c.prior.sourceMetaSha256!==metaSha;
   const technicalStatus=sourceChanged?(c.issues.length?'ERROR':'READY'):(c.prior.technicalStatus||'READY');
   const technicalIssues=sourceChanged?c.issues:(Array.isArray(c.prior.technicalIssues)?c.prior.technicalIssues:[]);
   Object.assign(row,{uid:c.uid,school:c.school,year:c.year,grade:c.grade,subject:c.subject,sourceQid:c.sourceQid,l2:c.l2,l2Label:c.question.subUnit||c.metadata.subUnit||c.metadata.l2Label||row.l2Label||'',shard:consumerRel.replace(/^archive\//,''),localOrdinal:c.prior?.localOrdinal||c.sourceQuestion.id||c.sourceOrdinal,sourceKind:'generated',sourceShard:c.source,sourceShardGitSha:c.sourceSha,sourceExamPath:c.sourceExamPath||row.sourceExamPath||'',sourceExamBlobSha:c.sourceExamBlobSha||row.sourceExamBlobSha||'',sourceExamQuestionCount:c.sourceExamQuestionCount||undefined,consumerSelectable:c.prior?.consumerSelectable??c.metadata.consumerSelectable??c.sourceQuestion.consumerSelectable??true,technicalStatus,technicalIssues,mainSourceAvailable:true,qualityStatus:c.prior?.qualityStatus??c.qualityStatus,reviewStatus:c.prior?.reviewStatus??c.metadata.reviewApprovalStatus??c.metadata.reviewStatus??c.sourceQuestion.reviewStatus??'NOT_REVIEWED',approval:c.prior?.approval??c.metadata.reviewApprovalStatus??c.metadata.reviewStatus??c.sourceQuestion.reviewStatus??'NOT_REVIEWED',meta,sourceMetaSha256:metaSha});
   row.userDisabled=disabled.has(c.uid);
   const currentQuestionFingerprint=contentFingerprint(c.question);
   if(sourceChanged&&c.prior&&Object.hasOwn(c.prior,'contentFingerprint'))row.contentFingerprint=currentQuestionFingerprint;
   if(sourceMetaChanged){delete row.metaFinalSha256;delete row.metaVerification;}
   else if(c.prior?.sourceShardGitSha&&c.prior.sourceShardGitSha!==c.sourceSha&&row.metaVerification){delete row.metaVerification;}
   if(c.metadata.reviewEvidenceBinding&&!row.reviewApprovalReceipt)row.reviewApprovalReceipt=c.metadata.reviewEvidenceBinding.path;
   const priorConsumerRecord=existingConsumerByUid.get(c.uid)||{};
   const question=sourceChanged?structuredClone(c.question):structuredClone(priorConsumerRecord.question||c.question);
   if(row.metaProjection&&!question.metaProjection)question.metaProjection=structuredClone(row.metaProjection);
   const consumerRecord={...structuredClone(priorConsumerRecord),generatedUid:c.uid,localOrdinal:row.localOrdinal,sourceKind:'generated',sourceExamPath:row.sourceExamPath,sourceExamBlobSha:row.sourceExamBlobSha,sourceExamQuestionCount:row.sourceExamQuestionCount,sourceQid:c.sourceQid,sourceShard:c.source,sourceShardGitSha:c.sourceSha,l2:c.l2,reviewStatus:row.reviewStatus,approval:row.approval,consumerSelectable:row.consumerSelectable,technicalStatus:row.technicalStatus,technicalIssues:row.technicalIssues,meta,sourceMetaSha256:metaSha,question};
   if(sourceChanged&&(Object.hasOwn(priorConsumerRecord,'contentFingerprint')||Object.hasOwn(c.prior||{},'contentFingerprint')))consumerRecord.contentFingerprint=currentQuestionFingerprint;
   if(row.metaProjection&&!consumerRecord.metaProjection)consumerRecord.metaProjection=structuredClone(row.metaProjection);
   doc.records.push(consumerRecord);
   newRows.push(row);
  }
  const consumerBytes=jsonBytes(doc),consumerAbs=path.join(root,consumerRel);
  const consumerSha=gitBlobSha(consumerBytes);
  for(const row of newRows.filter(r=>r.shard===consumerRel.replace(/^archive\//,''))){row.consumerShardGitSha=consumerSha;row.shardGitBlobSha=consumerSha;row.consumerShardSha256=sha256(consumerBytes);}
  if(mode==='write'){fs.mkdirSync(path.dirname(consumerAbs),{recursive:true});fs.writeFileSync(consumerAbs,consumerBytes);}
  else if(!exists(consumerRel)||!fs.readFileSync(consumerAbs).equals(consumerBytes))errors.push({source:consumerRel,code:'CONSUMER_SHARD_STALE'});
 }
 const represented=new Set(newRows.map(row=>row.uid)),rebuiltByUid=new Map(newRows.map(row=>[row.uid,row]));
 const preserved=current.records.filter(row=>!represented.has(row.uid)&&!disabled.has(row.uid)&&!String(row.sourceShard||'').startsWith(`${sourceRoot}/`));
 const existingUpdates=current.records.filter(row=>rebuiltByUid.has(row.uid)).map(row=>rebuiltByUid.get(row.uid));
 const newRegistrations=newRows.filter(row=>!previous.has(row.uid));
 const records=[...preserved,...existingUpdates,...newRegistrations];
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
