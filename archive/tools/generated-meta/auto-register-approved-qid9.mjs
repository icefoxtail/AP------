#!/usr/bin/env node
// Automatic, approval-gated QID9 production registration. No candidate gets student access.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
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
const q23VisualManifest='archive/analysis/palma-mock-builder-20261010/Q23_VISUAL/Q23_VISUAL_MANIFEST.json';
const q21ParameterRpmResolutionPath=uid=>uid==='ALITE-PALMA25-2MID-Q21-C1'
 ?'archive/analysis/palma-mock-builder-20261010/Q21_C1_RPM_RECORD_RESOLUTION.json'
 :`archive/analysis/palma-mock-builder-20261010/Q21_RPM_RECORD_RESOLUTION/${uid}.json`;
const q22B2RpmResolutionPath='archive/analysis/palma-mock-builder-20261010/Q22_B2_RPM_RECORD_RESOLUTION.json';
const read=rel=>fs.readFileSync(path.join(root,rel));
const json=rel=>JSON.parse(read(rel).toString('utf8'));
const buf=x=>Buffer.from(JSON.stringify(x,null,2)+'\n','utf8');
const hex=b=>sha256Bytes(b);
const exists=rel=>fs.existsSync(path.join(root,rel));
const write=(rel,bytes)=>{const full=path.join(root,rel);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);};
const label=s=>String(s||'').split('|').at(-1);
const requireTrue=(v,code)=>{if(!v)throw Error(code);};
const dedup=a=>[...new Set(a)];
let latestSummary={schemaVersion:'PALMA_QID9_APPROVED_PROJECTION_CHECK_V1',status:'NOT_STARTED'};

function git(root,args,options={}){
 return execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024,...options}).trim();
}
function normalizeTextEol(bytes){return Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n').replace(/\r/g,'\n'),'utf8');}
function trackedBlob(root,rel){
 const full=path.join(root,rel),working=fs.readFileSync(full);
 const headBlob=git(root,['rev-parse',`HEAD:${rel}`]);
 const canonical=execFileSync('git',['cat-file','blob',headBlob],{cwd:root,maxBuffer:32*1024*1024});
 requireTrue(gitBlobSha(canonical)===headBlob,'APPROVED_INPUT_GIT_BLOB_INVALID:'+rel);
 requireTrue(normalizeTextEol(working).equals(normalizeTextEol(canonical)),'APPROVED_INPUT_WORKTREE_DRIFT:'+rel);
 return {blobSha1:headBlob,bytes:canonical,sha256:hex(canonical)};
}
function canonicalOrWorkingBytes(root,rel){
 let tracked=false;
 try{execFileSync('git',['rev-parse',`HEAD:${rel}`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']});tracked=true;}catch{}
 if(tracked)return trackedBlob(root,rel);
 const bytes=read(rel);return {bytes,sha256:hex(bytes),blobSha1:gitBlobSha(bytes)};
}
function historicalBlob(root,sha){
 requireTrue(/^[0-9a-f]{40}$/i.test(sha||''),'HISTORICAL_SOURCE_BLOB_SHA_INVALID');
 const bytes=execFileSync('git',['cat-file','blob',sha],{cwd:root,maxBuffer:32*1024*1024});
 requireTrue(gitBlobSha(bytes).toLowerCase()===sha.toLowerCase(),'HISTORICAL_SOURCE_BLOB_BYTES_INVALID:'+sha);
 return bytes;
}
function exactSorted(values){return [...values].sort();}
function sameValues(a,b){return JSON.stringify(exactSorted(a))===JSON.stringify(exactSorted(b));}

export function eligibleApprovedQids(manifest){
 return (manifest.qidLedger||[]).filter(row=>row?.reviewStatus===approve||row?.reviewStatus==='GPT_OPEN_BOOK_REVIEW_PASS');
}
export function canonicalIntegrationPattern(value){
 if(value==='CONDITION_COMPOSITE'||value==='CONDITION_INTERSECTION')return 'INTERDEPENDENT';
 return value||'NONE';
}
export function isAllowedGeneratedMetaProjectionRepair(uid,before,after){
 const q18=/^ALITE-PALMA25-2MID-Q18-[ABC][123]$/.test(uid);
 const q23c2=uid==='ALITE-PALMA25-2MID-Q23-C2';
 const q23c3=uid==='ALITE-PALMA25-2MID-Q23-C3';
 if(!q18&&!q23c2&&!q23c3||!before||!after)return false;
 const allowed=new Set(q18
  ?['generatedL4RegistrySha256','generatedL4RegistryGitBlobSha1']
  :q23c2
   ?['rpmL4','rpmL4Label','rpmL4Namespace','rpmDraftAuthorityRef','rpmDraftAuthoritySha256','rpmAuthorityRef','rpmAuthoritySha256','generatedL4RegistryRef','generatedL4RegistrySha256','generatedL4RegistryGitBlobSha1']
   :['generatedL4RegistrySha256','generatedL4RegistryGitBlobSha1']);
 const strip=value=>{
  const result=structuredClone(value);
  for(const field of allowed)delete result[field];
  return result;
 };
 return metaSha256(strip(before))===metaSha256(strip(after));
}
export function unknownApprovedQid9Manifests(manifests,supportedPath){
 return manifests.filter(entry=>entry.path!==supportedPath&&eligibleApprovedQids(entry.value).length>0)
  .map(entry=>({manifestPath:entry.path,approvedQidCount:eligibleApprovedQids(entry.value).length}));
}
export function missingApprovedUids(expectedUids,index){
 const rows=index?.records||[],counts=new Map();
 for(const row of rows)if(typeof row?.uid==='string')counts.set(row.uid,(counts.get(row.uid)||0)+1);
 return expectedUids.filter(uid=>counts.get(uid)!==1);
}
export function resolveQ21ParameterRpmRecord({records,uid,declaredRecordIds,standardUnitKey,subUnitKey,rpmL3,rpmL4,templateKey}){
 const fail=()=>{throw Error('Q21_PARAMETER_RPM_EXACT_ACTIVE_RECORD_NOT_UNIQUE:'+uid);};
 if(!/^ALITE-PALMA25-2MID-Q21-C[123]$/.test(uid)||JSON.stringify(declaredRecordIds)!==JSON.stringify(['H1-RPM-247'])||
   standardUnitKey!=='H22-C2-06'||subUnitKey!=='H22-C2-06-CORE'||rpmL3!=='필요조건·충분조건'||rpmL4!=='매개변수'||templateKey!=='TPL_NEC_SUFF_INTERVAL_PARAMETER')fail();
 const declared=records.filter(row=>row.id==='H1-RPM-247'&&row.standardUnitKey===standardUnitKey&&row.subUnitKey===subUnitKey&&row.rpmPath?.l3===rpmL3);
 const matches=records.filter(row=>row.id==='H1-RPM-248'&&row.standardUnitKey===standardUnitKey&&row.subUnitKey===subUnitKey&&
   row.rpmPath?.l3===rpmL3&&row.rpmPath?.l4===rpmL4&&row.mappingStatus==='FAMILY_ACTIVE'&&row.bindingStatus==='ACTIVE'&&
   (row.templateCandidates||[]).some(candidate=>candidate.templateKey===templateKey));
 if(declared.length!==1||declared[0].rpmPath?.l4!=='조건 관계'||matches.length!==1)fail();
 return {record:matches[0],evidence:{
   schemaVersion:'GENERATED_RPM_RECORD_DISAMBIGUATION_V1',uid,
   declaredRecordIds:[...declaredRecordIds],declaredRecordL4:declared[0].rpmPath.l4,
   selectedRecordId:matches[0].id,selectedRecordL4:matches[0].rpmPath.l4,
   standardUnitKey,subUnitKey,rpmL3,rpmL4,templateKey,
   selectionBasis:'EXACT_ACTIVE_UNIT_SUBUNIT_L3_L4_AND_TEMPLATE',
   reason:'The approved question uses the interval-parameter template. Declared source record 247 binds the same unit and L3 to 조건 관계; the exact active parameter family is record 248.'
 }};
}
export function resolveQ22B2RpmRecord({records,uid,declaredRecordIds,standardUnitKey,subUnitKey,rpmL3,rpmL4}){
 const fail=()=>{throw Error('Q22_B2_RPM_EXACT_ACTIVE_RECORD_NOT_UNIQUE');};
 if(uid!=='ALITE-PALMA25-2MID-Q22-B2'||JSON.stringify(declaredRecordIds)!==JSON.stringify(['H1-RPM-217','H1-RPM-218'])||
   standardUnitKey!=='H22-C2-03'||subUnitKey!=='H22-C2-03-CIRCLE_EQUATION'||rpmL3!=='원의 방정식'||rpmL4!=='일반형에서 원 찾기')fail();
 const exact=records.filter(row=>row.standardUnitKey===standardUnitKey&&row.subUnitKey===subUnitKey&&row.rpmPath?.l3===rpmL3&&row.rpmPath?.l4===rpmL4);
 const declared=records.filter(row=>declaredRecordIds.includes(row.id)&&row.standardUnitKey===standardUnitKey&&row.subUnitKey===subUnitKey&&row.rpmPath?.l3===rpmL3);
 if(exact.length!==1||exact[0].id!=='H1-RPM-218'||exact[0].mappingStatus!=='DIRECT_ACTIVE'||exact[0].bindingStatus!=='ACTIVE'||
   declared.length!==2||!declared.some(row=>row.id==='H1-RPM-217'&&row.rpmPath?.l4==='중심과 반지름'))fail();
 return {record:exact[0],evidence:{schemaVersion:'GENERATED_RPM_RECORD_DISAMBIGUATION_V1',uid,
  declaredRecordIds:[...declaredRecordIds],selectedRecordId:exact[0].id,selectedRecordL4:exact[0].rpmPath.l4,
  standardUnitKey,subUnitKey,rpmL3,rpmL4,selectionBasis:'EXACT_ACTIVE_UNIT_SUBUNIT_L3_L4',
  reason:'The approved Q22-B2 package asks for the general-form circle equation. Active record 218 is the unique exact L4; declared record 217 is the center/radius leaf, so both declared IDs are retained while record 218 is selected.'
 }};
}
export function verifySourceProjectionBinding({uid,sourcePath,historicalSourceBlobSha1,latestCurrentSourceBlobSha1,indexRow,consumerDocument,consumerRecord,sourceMetadata,reviewEvidence,readHistoricalBlob}){
 const fail=code=>{throw Error(`${code}:${uid}`);};
 const historical=[indexRow?.sourceExamBlobSha,indexRow?.approvedSourceSnapshotBlobSha1,
  consumerDocument?.sourceExamBlobSha,consumerDocument?.approvedSourceSnapshot?.gitBlobSha1,
  consumerRecord?.sourceExamBlobSha,consumerRecord?.approvedSourceSnapshotBlobSha1,
  sourceMetadata?.sourceBlobSha,sourceMetadata?.approvedSourceBlobSha,sourceMetadata?.approvedHistoricalSourceExamBlobSha1,
  reviewEvidence?.approvedSourceSnapshot?.gitBlobSha1];
 if(!/^[0-9a-f]{40}$/i.test(historicalSourceBlobSha1||'')||historical.some(sha=>String(sha||'').toLowerCase()!==historicalSourceBlobSha1.toLowerCase()))fail('SOURCE_HISTORICAL_APPROVAL_BINDING_MISMATCH');
 const paths=[consumerDocument?.sourceExamPath,consumerRecord?.sourceExamPath,sourceMetadata?.sourceArchiveFile,
  reviewEvidence?.approvedSourceSnapshot?.path,reviewEvidence?.currentSource?.path];
 if(paths.some(value=>value!==sourcePath))fail('SOURCE_OBSERVED_PATH_BINDING_MISMATCH');
 const observed=[indexRow?.currentSourceExamBlobSha1,consumerDocument?.currentSourceExamBlobSha1,
  consumerRecord?.currentSourceExamBlobSha1,sourceMetadata?.currentSourceExamBlobSha1,reviewEvidence?.currentSource?.gitBlobSha1];
 if(!/^[0-9a-f]{40}$/i.test(latestCurrentSourceBlobSha1||'')||observed.some(sha=>String(sha||'').toLowerCase()!==String(observed[0]||'').toLowerCase())||! /^[0-9a-f]{40}$/i.test(observed[0]||''))fail('SOURCE_OBSERVED_PROJECTION_MISMATCH');
 let observedBytes;
 try{observedBytes=readHistoricalBlob(observed[0]);}catch{fail('SOURCE_OBSERVED_BLOB_MISSING');}
 if(!Buffer.isBuffer(observedBytes))fail('SOURCE_OBSERVED_BLOB_MISSING');
 if(gitBlobSha(observedBytes).toLowerCase()!==observed[0].toLowerCase())fail('SOURCE_OBSERVED_BLOB_SHA_MISMATCH');
 return {observedSourceBlobSha1:observed[0],latestCurrentSourceBlobSha1,sourceChangedSinceProjection:observed[0].toLowerCase()!==latestCurrentSourceBlobSha1.toLowerCase()};
}
export function verifyApprovedQuestionBodyParity({uid,approvedPackageItem,sourceQuestion,consumerQuestion}){
 const fail=()=>{throw Error('APPROVED_PACKAGE_BODY_PARITY_MISMATCH:'+uid);};
 if(!approvedPackageItem||approvedPackageItem.uid!==uid||sourceQuestion?.uid!==uid||consumerQuestion?.uid!==uid||
  approvedPackageItem.stem!==sourceQuestion.content||approvedPackageItem.stem!==consumerQuestion.content||
  JSON.stringify(approvedPackageItem.choices)!==JSON.stringify(sourceQuestion.choices)||JSON.stringify(approvedPackageItem.choices)!==JSON.stringify(consumerQuestion.choices)||
  approvedPackageItem.answer!==sourceQuestion.answer||approvedPackageItem.answer!==consumerQuestion.answer||
  approvedPackageItem.solution!==sourceQuestion.solution||approvedPackageItem.solution!==consumerQuestion.solution)fail();
 return true;
}
export function verifyExplicitPackageApproval({root,manifest,manifestRow,receipt,receiptPath,packagePath}){
 const fail=code=>{throw Error(`${code}:Q${manifestRow?.qid??'?'}`);};
 const receiptGit=trackedBlob(root,receiptPath),packageGit=trackedBlob(root,packagePath);
 if(receiptGit.sha256!==manifestRow.approvalEvidenceSha256)fail('APPROVAL_RECEIPT_SHA_MISMATCH');
 const basis=manifestRow.approvalBasis;
 if(manifestRow.reviewStatus!==approve||!basis||basis!==receipt.approvalBasis||receipt.status!==approve)fail('APPROVAL_RECEIPT_STATUS_OR_BASIS_MISMATCH');
 const sourcePath=manifest.originalSourceExam||receipt.source?.path;
 if(!sourcePath||receipt.source?.path!==sourcePath)fail('APPROVAL_SOURCE_PATH_MISMATCH');
 const sourceSha=receipt.source?.gitBlobSha1;
 if(!sourceSha||manifest.sourceBlobSha!==sourceSha)fail('APPROVAL_HISTORICAL_SOURCE_SHA_MISMATCH');
 historicalBlob(root,sourceSha);
 const expectedUidSet=receipt.scope?.uids;
 if(!Array.isArray(expectedUidSet)||receipt.scope.uidCount!==expectedUidSet.length||new Set(expectedUidSet).size!==expectedUidSet.length)fail('APPROVAL_UID_SCOPE_INVALID');
 const receiptPackage=(receipt.packages||[]).find(row=>row.sourceQid===manifestRow.qid);
 if(!receiptPackage||receiptPackage.path!==packagePath||receiptPackage.sha256!==packageGit.sha256||receiptPackage.gitBlobSha1!==packageGit.blobSha1)fail('APPROVED_PACKAGE_BYTES_MISMATCH');
 const pkg=JSON.parse(packageGit.bytes.toString('utf8'));
 if(pkg.sourceQid!==manifestRow.qid||pkg.sourceExamPath!==sourcePath||pkg.sourceGitBlobSha!==sourceSha||!Array.isArray(pkg.items)||pkg.items.length!==9)fail('APPROVED_PACKAGE_SOURCE_OR_SCOPE_MISMATCH');
 const itemUids=pkg.items.map(item=>item.uid);
 if(new Set(itemUids).size!==9||!sameValues(itemUids,receiptPackage.uids)||!sameValues(itemUids,manifestRow.uids||[]))fail('APPROVED_PACKAGE_UIDS_MISMATCH');
 if(!sameValues(expectedUidSet,(receipt.packages||[]).flatMap(row=>row.uids||[])))fail('APPROVAL_RECEIPT_PACKAGE_SCOPE_MISMATCH');
 if(manifestRow.approvedPackageSha256&&manifestRow.approvedPackageSha256!==packageGit.sha256)fail('MANIFEST_APPROVED_PACKAGE_SHA_MISMATCH');
 if(manifestRow.approvedPackageGitBlobSha1&&manifestRow.approvedPackageGitBlobSha1!==packageGit.blobSha1)fail('MANIFEST_APPROVED_PACKAGE_GIT_BLOB_MISMATCH');
 return {receiptGit,packageGit,pkg,sourcePath,sourceHistoricalBlobSha:sourceSha,basis,approvalStatus:approve};
}
function safeRepoFile(root,rel,labelName){
 const normalized=String(rel||'').replaceAll('\\','/');
 requireTrue(normalized===rel&&!normalized.startsWith('/')&&!normalized.split('/').includes('..'),labelName+'_PATH_INVALID');
 const full=path.resolve(root,normalized),base=path.resolve(root)+path.sep;
 requireTrue(full.startsWith(base),labelName+'_PATH_OUT_OF_ROOT');
 return full;
}
function externalVisualManifests(root){
 const base=path.join(root,'archive','analysis','palma-mock-builder-20261010');
 if(!fs.existsSync(base))return [];
 const found=[];
 const visit=dir=>{
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
   const full=path.join(dir,entry.name);
   if(entry.isDirectory())visit(full);
   else if(entry.isFile()&&entry.name.toLowerCase().endsWith('.json')){
    try{const value=JSON.parse(fs.readFileSync(full,'utf8'));if(value?.schemaVersion==='PALMA_QID9_VISUAL_ASSET_MANIFEST_V1')found.push({path:path.relative(root,full).replaceAll('\\','/'),value});}catch{}
   }
  }
 };
 visit(base);return found;
}
function qid9Manifests(root){
 const base=path.join(root,'alive','06_EXECUTION','H1_SCHOOL_EXPANSION');
 if(!fs.existsSync(base))return [];
 const found=[];
 const visit=dir=>{
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
   const full=path.join(dir,entry.name);
   if(entry.isDirectory())visit(full);
   else if(entry.isFile()&&entry.name==='GPT_QID9_EXAM_MANIFEST.json'){
    try{found.push({path:path.relative(root,full).replaceAll('\\','/'),value:JSON.parse(fs.readFileSync(full,'utf8'))});}catch{throw Error('QID9_MANIFEST_JSON_INVALID:'+path.relative(root,full));}
   }
  }
 };
 visit(base);return found;
}
function visualNeed(decision){
 const value=typeof decision==='string'?decision:decision?.need||decision?.disposition;
 if(['REQUIRED','BENEFICIAL','EXEMPT','NO_VISUAL'].includes(value))return value;
 if(value==='VISUAL_REQUIRED'||value==='SOLUTION_SVG_REQUIRED')return 'REQUIRED';
 if(value==='VISUAL_OPTIONAL'||/BENEFICIAL/.test(String(value||'')))return 'BENEFICIAL';
 if(value==='VISUAL_EXEMPT')return 'EXEMPT';
 if(value==='NO_VISUAL')return 'NO_VISUAL';
 return null;
}
function assetForSurface({root,row,surface,uid,sourceQid,approval}){
 const decision=row?.[surface+'Decision'];
 const need=visualNeed(decision);
 requireTrue(!!need,'VISUAL_DECISION_MISSING:'+uid+':'+surface);
 const asset=row?.[surface+'Asset']||(surface==='solution'?row?.asset||((row.sourceSvgPath||row.sourceSvgSha256)?row:null):null);
 const reason=typeof decision==='object'?decision.reason:null;
 requireTrue(need==='NO_VISUAL'||need==='EXEMPT'?!!reason:true,'VISUAL_DECISION_REASON_MISSING:'+uid+':'+surface);
 if(need==='REQUIRED'||need==='BENEFICIAL'){
  requireTrue(asset&&typeof asset.sourceSvgPath==='string'&&typeof asset.consumerAssetPath==='string','VISUAL_ASSET_BINDING_REQUIRED:'+uid+':'+surface);
  const expectedPath=`assets/generated-lite/palma-speed-pilot/${uid}-${surface}.svg`;
  requireTrue(asset.consumerAssetPath===expectedPath,'VISUAL_CONSUMER_ASSET_PATH_MISMATCH:'+uid+':'+surface);
  const sourcePath=String(asset.sourceSvgPath).replaceAll('\\','/');
  requireTrue(sourcePath.startsWith('alive/')||sourcePath.startsWith('archive/'),'VISUAL_SOURCE_ASSET_PATH_INVALID:'+uid+':'+surface);
  safeRepoFile(root,sourcePath,'VISUAL_SOURCE_ASSET');
  const canonical=canonicalOrWorkingBytes(root,sourcePath),bytes=canonical.bytes,sha=canonical.sha256,blob=canonical.blobSha1;
  requireTrue(sha===String(asset.sourceSvgSha256||'').toLowerCase(),'VISUAL_SOURCE_ASSET_SHA_MISMATCH:'+uid+':'+surface);
  requireTrue(blob===String(asset.sourceSvgGitBlobSha1||'').toLowerCase(),'VISUAL_SOURCE_ASSET_GIT_BLOB_MISMATCH:'+uid+':'+surface);
  requireTrue(typeof asset.renderer==='string'&&typeof asset.renderStatus==='string','VISUAL_BACKEND_EVIDENCE_REQUIRED:'+uid+':'+surface);
  requireTrue(typeof asset.visualEvidencePath==='string'&&typeof asset.visualEvidenceSha256==='string','VISUAL_PHYSICAL_EVIDENCE_REQUIRED:'+uid+':'+surface);
  safeRepoFile(root,asset.visualEvidencePath,'VISUAL_EVIDENCE');
  const evidence=canonicalOrWorkingBytes(root,asset.visualEvidencePath);
  requireTrue(evidence.sha256===String(asset.visualEvidenceSha256||'').toLowerCase(),'VISUAL_EVIDENCE_SHA_MISMATCH:'+uid+':'+surface);
  const alt=asset.alt||asset.studentAlt||row[surface+'Alt'];
  requireTrue(typeof alt==='string'&&alt.trim(),'VISUAL_STUDENT_ALT_REQUIRED:'+uid+':'+surface);
  return {need,reason,sourcePath,consumerPath:expectedPath,sourceBytes:bytes,sourceSha256:sha,sourceGitBlobSha1:blob,renderer:asset.renderer,renderStatus:asset.renderStatus,visualEvidencePath:asset.visualEvidencePath,visualEvidenceSha256:asset.visualEvidenceSha256,alt,size:asset.size||'medium'};
 }
 requireTrue(!asset,'UNEXPECTED_VISUAL_ASSET_FOR_NO_VISUAL:'+uid+':'+surface);
 return {need,reason,sourcePath:null,consumerPath:null,sourceBytes:null,sourceSha256:null,sourceGitBlobSha1:null,renderer:null,renderStatus:null,visualEvidencePath:null,visualEvidenceSha256:null,alt:null,size:null};
}
function packageVisualNeed(ci,surface){
 if(surface==='problem')return visualNeed(ci.problemVisual?.visualNecessity||ci.problemVisual?.disposition||ci.visualDecision?.problem);
 return visualNeed(ci.solutionVisual?.visualNecessity||ci.solutionVisual?.disposition||ci.visualDecision?.solution);
}
function packageAssetBinding({root,ci,surface,uid,need}){
 const sourcePath=surface==='problem'?ci.image:ci.solutionImage;
 if(need==='REQUIRED'||need==='BENEFICIAL'){
  requireTrue(typeof sourcePath==='string'&&sourcePath.length>0,'PACKAGE_VISUAL_ASSET_MISSING:'+uid+':'+surface);
  const expectedPath=`assets/generated-lite/palma-speed-pilot/${uid}-${surface}.svg`;
  const normalized=String(sourcePath).replaceAll('\\','/');
  requireTrue(normalized.startsWith('alive/')||normalized.startsWith('archive/'),'PACKAGE_VISUAL_SOURCE_PATH_INVALID:'+uid+':'+surface);
  if(surface==='solution'&&ci.solutionVisual?.path)requireTrue(ci.solutionVisual.path===normalized,'PACKAGE_SOLUTION_VISUAL_PATH_MISMATCH:'+uid);
  safeRepoFile(root,normalized,'PACKAGE_VISUAL_SOURCE');
  const canonical=canonicalOrWorkingBytes(root,normalized),bytes=canonical.bytes;
  const alt=surface==='problem'?ci.imageAlt:ci.solutionImageAlt;
  requireTrue(typeof alt==='string'&&alt.trim(),'PACKAGE_VISUAL_ALT_REQUIRED:'+uid+':'+surface);
  return {need,reason:ci[surface==='problem'?'problemVisual':'solutionVisual']?.benefitReason||ci.visualDecision?.reason||'PACKAGE_BOUND_VISUAL_ASSET',sourcePath:normalized,consumerPath:expectedPath,sourceBytes:bytes,sourceSha256:canonical.sha256,sourceGitBlobSha1:canonical.blobSha1,renderer:ci.solutionVisual?.backend||null,renderStatus:ci.solutionVisual?.renderStatus||'PACKAGE_RENDER_STATUS_UNVERIFIED',visualEvidencePath:null,visualEvidenceSha256:null,alt,size:ci.solutionImageSize||ci.imageSize||'medium'};
 }
 requireTrue(!sourcePath,'PACKAGE_VISUAL_ASSET_WITHOUT_NEED:'+uid+':'+surface);
 return {need,reason:ci[surface==='problem'?'problemVisual':'solutionVisual']?.benefitReason||ci.visualDecision?.reason||'PACKAGE_VISUAL_DISPOSITION',sourcePath:null,consumerPath:null,sourceBytes:null,sourceSha256:null,sourceGitBlobSha1:null,renderer:null,renderStatus:null,visualEvidencePath:null,visualEvidenceSha256:null,alt:null,size:null};
}
function auditNewProjection({root,index,expectedUids,approvedPackageItems,visualBindings,sourceExamPath,currentSourceBlobSha1,historicalSourceBlobSha1,approval}){
 const incomplete=new Set(missingApprovedUids(expectedUids,index));
 const missingIndex=missingApprovedUids(expectedUids,index);
 const missingAssets=[],structuralFailures=[],sourceObservationDriftUids=[],observedSourceBlobSha1s=new Set();
 const recordByUid=new Map((index.records||[]).map(row=>[row.uid,row]));
 for(const uid of expectedUids){
  const qid=Number(uid.match(/Q(\d+)-/)?.[1]);
  if(qid<17||qid>23)continue;
  const fail=(reason)=>{incomplete.add(uid);structuralFailures.push({uid,reason});};
  const row=recordByUid.get(uid);
  if(!row)continue;
  if(row.sourceKind!=='generated'||row.consumerSelectable!==true||row.reviewStatus!==approve||row.metaVerification?.status!=='VERIFIED_CURRENT_SOURCE')fail('INDEX_APPROVED_META_BINDING_MISSING');
  if(row.sourceExamBlobSha!==historicalSourceBlobSha1||row.approvedSourceSnapshotBlobSha1!==historicalSourceBlobSha1)fail('INDEX_HISTORICAL_SOURCE_BINDING_MISSING');
  if(row.approvedPackageSha256!==approval.packages?.find(p=>p.sourceQid===qid)?.sha256)fail('INDEX_PACKAGE_APPROVAL_BINDING_MISSING');
  const consumerRel='archive/'+row.shard;
  if(!exists(consumerRel)){fail('CONSUMER_SHARD_MISSING');continue;}
  let consumer;
  try{consumer=json(consumerRel);}catch{fail('CONSUMER_SHARD_INVALID');continue;}
  const matches=(consumer.records||[]).filter(entry=>entry.generatedUid===uid);
  if(matches.length!==1){fail('CONSUMER_UID_NOT_UNIQUE');continue;}
  const entry=matches[0],q=entry.question;
  if(!q||q.uid!==uid||entry.consumerSelectable===false||entry.reviewStatus!==approve)fail('CONSUMER_APPROVAL_OR_UID_BINDING_MISSING');
  if(entry.sourceExamBlobSha!==historicalSourceBlobSha1||consumer.sourceExamBlobSha!==historicalSourceBlobSha1)fail('CONSUMER_HISTORICAL_SOURCE_BINDING_MISSING');
  if(consumer.approvedSourceSnapshot?.gitBlobSha1!==historicalSourceBlobSha1)fail('CONSUMER_HISTORICAL_SOURCE_BINDING_MISSING');
  if(entry.metaFinalSha256!==row.metaFinalSha256||q?.metaFinalSha256!==row.metaFinalSha256||!row.meta||!q?.meta||metaSha256(q.meta)!==row.metaFinalSha256)fail('CONSUMER_META_PROJECTION_MISMATCH');
  const sourceRel=entry.sourceShard;
  let sourceFileValid=false;
  try{safeRepoFile(root,sourceRel,'GENERATED_SOURCE_SHARD');sourceFileValid=sourceRel.startsWith('archive/generated/lite/v1/')&&exists(sourceRel);}catch{}
  if(!sourceRel||consumer.sourceShard!==sourceRel||!sourceFileValid){fail('GENERATED_SOURCE_SHARD_MISSING_OR_CONSUMER_PATH_MISMATCH');continue;}
  let source;
  try{const sandbox={window:{}};vm.runInNewContext(read(sourceRel).toString('utf8'),sandbox,{timeout:2000,filename:sourceRel});source=sandbox.window.questionBank;}catch{fail('GENERATED_SOURCE_SHARD_INVALID');continue;}
  const sourceRows=Array.isArray(source)?source.filter(question=>question.uid===uid):[];
  if(sourceRows.length!==1){fail('GENERATED_SOURCE_UID_NOT_UNIQUE');continue;}
  const sourceQuestion=sourceRows[0];
  if(sourceQuestion.metaFinalSha256!==row.metaFinalSha256||metaSha256(sourceQuestion.meta)!==row.metaFinalSha256)fail('SOURCE_META_PROJECTION_MISMATCH');
  try{verifyApprovedQuestionBodyParity({uid,approvedPackageItem:approvedPackageItems.get(uid),sourceQuestion,consumerQuestion:q});}
  catch{fail('APPROVED_PACKAGE_BODY_PARITY_MISMATCH');}
  if(sourceQuestion.content!==q?.content||JSON.stringify(sourceQuestion.choices)!==JSON.stringify(q?.choices)||sourceQuestion.answer!==q?.answer||sourceQuestion.solution!==q?.solution||sourceQuestion.image!==q?.image||sourceQuestion.solutionImage!==q?.solutionImage)fail('SOURCE_CONSUMER_STUDENT_BODY_MISMATCH');
  if(/^ALITE-PALMA25-2MID-Q21-C[123]$/.test(uid)){
   const resolution=sourceQuestion.meta?.rpmRecordResolution;
   const resolutionPath=q21ParameterRpmResolutionPath(uid);
   const resolutionBytes=exists(resolutionPath)?canonicalOrWorkingBytes(root,resolutionPath):null;
   if(!resolution||resolution.path!==resolutionPath||!resolutionBytes||resolution.sha256!==resolutionBytes.sha256||resolution.gitBlobSha1!==resolutionBytes.blobSha1||resolution.selectedRecordId!=='H1-RPM-248'||JSON.stringify(resolution.declaredRecordIds)!==JSON.stringify(['H1-RPM-247']))fail('Q21_PARAMETER_RPM_RESOLUTION_META_BINDING_MISMATCH');
   const resolutionDoc=json(resolutionPath);
   if(resolutionDoc.uid!==uid||resolutionDoc.selectedRecordId!=='H1-RPM-248'||JSON.stringify(resolutionDoc.declaredRecordIds)!==JSON.stringify(['H1-RPM-247'])||resolutionDoc.selectionBasis!=='EXACT_ACTIVE_UNIT_SUBUNIT_L3_L4_AND_TEMPLATE')fail('Q21_PARAMETER_RPM_RESOLUTION_EVIDENCE_MISMATCH');
  }
  if(uid==='ALITE-PALMA25-2MID-Q22-B2'){
   const resolution=sourceQuestion.meta?.rpmRecordResolution;
   const resolutionBytes=exists(q22B2RpmResolutionPath)?canonicalOrWorkingBytes(root,q22B2RpmResolutionPath):null;
   if(!resolution||resolution.path!==q22B2RpmResolutionPath||!resolutionBytes||resolution.sha256!==resolutionBytes.sha256||resolution.gitBlobSha1!==resolutionBytes.blobSha1||resolution.selectedRecordId!=='H1-RPM-218'||JSON.stringify(resolution.declaredRecordIds)!==JSON.stringify(['H1-RPM-217','H1-RPM-218']))fail('Q22_B2_RPM_RESOLUTION_META_BINDING_MISMATCH');
   const resolutionDoc=json(q22B2RpmResolutionPath);
   if(resolutionDoc.uid!==uid||resolutionDoc.selectedRecordId!=='H1-RPM-218'||JSON.stringify(resolutionDoc.declaredRecordIds)!==JSON.stringify(['H1-RPM-217','H1-RPM-218'])||resolutionDoc.selectionBasis!=='EXACT_ACTIVE_UNIT_SUBUNIT_L3_L4')fail('Q22_B2_RPM_RESOLUTION_EVIDENCE_MISMATCH');
  }
  const metadataRel=sourceRel.replace('/shards/','/metadata/').replace(/\.js$/,'.json');
  if(metadataRel===sourceRel||!exists(metadataRel)){fail('SOURCE_METADATA_MISSING');continue;}
  const authority=json(metadataRel).find(record=>record.uid===uid);
  if(!authority||authority.sourceBlobSha!==historicalSourceBlobSha1||authority.approvedSourceBlobSha!==historicalSourceBlobSha1||authority.metaFinalSha256!==row.metaFinalSha256)fail('SOURCE_METADATA_APPROVAL_OR_META_BINDING_MISMATCH');
  const reviewEvidenceRef=sourceQuestion.metaReviewEvidence?.path;
  let reviewEvidenceDoc;
  try{reviewEvidenceDoc=json(reviewEvidenceRef);}catch{fail('APPROVAL_REVIEW_EVIDENCE_MISSING_OR_INVALID');continue;}
  let sourceObservation;
  try{sourceObservation=verifySourceProjectionBinding({uid,sourcePath:sourceExamPath,
   historicalSourceBlobSha1,latestCurrentSourceBlobSha1:currentSourceBlobSha1,indexRow:row,consumerDocument:consumer,
   consumerRecord:entry,sourceMetadata:authority,reviewEvidence:reviewEvidenceDoc,readHistoricalBlob:sha=>historicalBlob(root,sha)});}
  catch(error){fail(error.message||'SOURCE_OBSERVED_PROJECTION_MISMATCH');continue;}
  observedSourceBlobSha1s.add(sourceObservation.observedSourceBlobSha1);
  if(sourceObservation.sourceChangedSinceProjection)sourceObservationDriftUids.push(uid);
  const binding=visualBindings.get(uid);
  if(!binding){fail('VISUAL_TWO_AXIS_TRIAGE_MISSING');continue;}
  for(const surface of ['problem','solution']){
   const visual=binding[surface],field=surface==='problem'?'image':'solutionImage';
   if(visual.need==='REQUIRED'||visual.need==='BENEFICIAL'){
    const pathRef=sourceQuestion[field],assetRel=visual.consumerPath;
    const physicalRel='archive/'+assetRel;
    const copiedAsset=exists(physicalRel)?canonicalOrWorkingBytes(root,physicalRel):null;
    if(pathRef!==assetRel||!copiedAsset||(copiedAsset.sha256!==visual.sourceSha256&&copiedAsset.blobSha1!==visual.sourceGitBlobSha1)){missingAssets.push({uid,surface,path:assetRel||null});fail('STUDENT_VISUAL_ASSET_MISSING_OR_MISMATCH');}
   }else if(sourceQuestion[field])fail('UNTRIAGED_OR_EXEMPT_STUDENT_VISUAL_PRESENT');
  }
  for(const [rel,ref,sha] of [['reviewEvidence',reviewEvidenceRef,sourceQuestion.metaReviewEvidenceSha256]]){
   const evidence=typeof ref==='string'&&exists(ref)?canonicalOrWorkingBytes(root,ref):null;
   if(!evidence||evidence.sha256!==sha)fail('APPROVAL_REVIEW_EVIDENCE_MISSING_OR_MISMATCH');
  }
 }
 return {missingApprovedUids:[...incomplete].sort(),missingIndexUids:missingIndex,missingAssets,structuralFailures,
  observedSourceBlobSha1s:[...observedSourceBlobSha1s].sort(),sourceObservationDriftUids:sourceObservationDriftUids.sort()};
}
const main=()=>{
 const mode=process.argv.includes('--write')?'write':'check';
 const manifest=json(DIR+'GPT_QID9_EXAM_MANIFEST.json');
 const allApprovedRows=eligibleApprovedQids(manifest);
 requireTrue(allApprovedRows.every(row=>Number.isInteger(row.qid)&&row.qid>=1&&row.qid<=23),'UNSUPPORTED_APPROVED_QID9_SCOPE:'+allApprovedRows.filter(row=>row.qid<1||row.qid>23).map(row=>row.qid).join('|'));
 const manifestRows=allApprovedRows;
 const expectedApprovedUids=manifestRows.flatMap(row=>row.uids||[]);
 requireTrue(manifestRows.length===23&&sameValues(manifestRows.map(row=>row.qid),Array.from({length:23},(_,index)=>index+1))&&expectedApprovedUids.length===207&&new Set(expectedApprovedUids).size===207,'PALMA_APPROVED_UID_DENOMINATOR_INVALID');
 latestSummary={schemaVersion:'PALMA_QID9_APPROVED_PROJECTION_CHECK_V1',mode,status:'PREFLIGHT',approvedUidCount:expectedApprovedUids.length,registeredUidCount:0,missingApprovedUids:[...expectedApprovedUids],missingIndexUids:[...expectedApprovedUids],indexTotal:null};
 const sourcePath=manifest.originalSourceExam;
 const currentSource=trackedBlob(root,sourcePath);
 latestSummary.sourceExamPath=sourcePath;latestSummary.currentSourceBlobSha1=currentSource.blobSha1;latestSummary.approvedHistoricalSourceBlobSha1=manifest.sourceBlobSha;
 const explicitApprovals=new Map();
 for(const row of manifestRows.filter(entry=>entry.qid>=17&&entry.qid<=23)){
  const receiptPath=row.approvalEvidence;
  const packagePath=DIR+`GPT_QID9_Q${String(row.qid).padStart(2,'0')}_PACKAGE.json`;
  requireTrue(typeof receiptPath==='string'&&receiptPath.startsWith(DIR),'EXPLICIT_APPROVAL_RECEIPT_REQUIRED:Q'+row.qid);
  const receiptBytes=trackedBlob(root,receiptPath).bytes;
  const receipt=JSON.parse(receiptBytes.toString('utf8'));
  const verified=verifyExplicitPackageApproval({root,manifest,manifestRow:row,receipt,receiptPath,packagePath});
  explicitApprovals.set(row.qid,{...verified,receiptPath,receipt,packagePath});
 }
 const approvedPackageItems=new Map();
 for(const approval of explicitApprovals.values())for(const item of approval.pkg.items){
  requireTrue(!approvedPackageItems.has(item.uid),'APPROVED_PACKAGE_UID_DUPLICATE:'+item.uid);
  approvedPackageItems.set(item.uid,item);
 }
 const crossBytes=read(CROS),cross=json(CROS),crossHash=hex(crossBytes);
 const compiledConcept=json('archive/data/meta-foundation/compiled/concept_registry.json');
 const condRegistry=json('archive/data/meta-foundation/compiled/condition_registry.json');
 const knownCross=new Set(compiledConcept.concepts.filter(x=>x.status==='ACTIVE').map(x=>x.conceptKey));
 const knownCond=new Set(condRegistry.conditions.filter(x=>x.status==='ACTIVE').map(x=>x.conditionKey));
 let index=json(INDEX);
 const sourceData={};let updated=0,skipped=0,done=0;
 requireTrue(index.approvedCount===index.records.length,'INDEX_COUNT_DRIFT');
 requireTrue(new Set(index.records.map(x=>x.uid)).size===index.records.length,'INDEX_DUPLICATE_UID');
  const unknownApprovedSources=unknownApprovedQid9Manifests(qid9Manifests(root),DIR+'GPT_QID9_EXAM_MANIFEST.json');
  requireTrue(unknownApprovedSources.length===0,'UNSUPPORTED_APPROVED_QID9_SOURCE:'+JSON.stringify(unknownApprovedSources));
 latestSummary={schemaVersion:'PALMA_QID9_APPROVED_PROJECTION_CHECK_V1',mode,status:'RUNNING',sourceExamPath:sourcePath,currentSourceBlobSha1:currentSource.blobSha1,approvedHistoricalSourceBlobSha1:manifest.sourceBlobSha,approvedUidCount:expectedApprovedUids.length,registeredUidCount:expectedApprovedUids.length-missingApprovedUids(expectedApprovedUids,index).length,missingApprovedUids:missingApprovedUids(expectedApprovedUids,index),missingIndexUids:missingApprovedUids(expectedApprovedUids,index),indexTotal:index.records.length,approvalReceiptPath:manifestRows.find(row=>row.qid===17)?.approvalEvidence||null,approvalReceiptSha256:manifestRows.find(row=>row.qid===17)?.approvalEvidenceSha256||null};
 const preexistingMissing=missingApprovedUids(expectedApprovedUids.filter(uid=>Number(uid.match(/Q(\d+)-/)?.[1])<17),index);
 requireTrue(preexistingMissing.length===0,'PREEXISTING_APPROVED_UID_GAP:'+preexistingMissing.slice(0,8).join('|'));
 const externalVisualRows=new Map();
 for(const entry of externalVisualManifests(root)){
  const vmf=entry.value;
  requireTrue(vmf.sourceExamBlobSha1===manifest.sourceBlobSha,'VISUAL_MANIFEST_SOURCE_SNAPSHOT_MISMATCH:'+entry.path);
  const boundReceipt=explicitApprovals.get(17)?.receiptPath;
   const receiptSha256=vmf.packageApprovalReceiptCanonicalSha256||vmf.packageApprovalReceiptSha256;
   requireTrue(vmf.packageApprovalReceiptPath===boundReceipt&&String(receiptSha256||'').toLowerCase()===explicitApprovals.get(17)?.receiptGit.sha256&&
    String(vmf.packageApprovalReceiptGitBlobSha1||'').toLowerCase()===explicitApprovals.get(17)?.receiptGit.blobSha1,'VISUAL_MANIFEST_APPROVAL_BINDING_MISMATCH:'+entry.path);
  requireTrue(Array.isArray(vmf.items),'VISUAL_MANIFEST_ITEMS_REQUIRED:'+entry.path);
  for(const row of vmf.items){
   requireTrue(row&&/^ALITE-PALMA25-2MID-Q(?:17|18|19|20|23)-[ABC][123]$/.test(row.uid||''),'VISUAL_MANIFEST_UID_OUT_OF_SCOPE:'+entry.path);
   requireTrue(Number(row.sourceQid)===Number(row.uid.match(/Q(\d+)-/)?.[1]),'VISUAL_MANIFEST_QID_UID_MISMATCH:'+row.uid);
   requireTrue(!externalVisualRows.has(row.uid),'VISUAL_MANIFEST_DUPLICATE_UID:'+row.uid);
   externalVisualRows.set(row.uid,row);
  }
 }
 const externalVisualUids=expectedApprovedUids.filter(uid=>{
  const n=Number(uid.match(/Q(\d+)-/)?.[1]);return n>=17&&n<=20||n===23;
 });
 const missingVisualRows=externalVisualUids.filter(uid=>!externalVisualRows.has(uid));
 const visualBindings=new Map();
 for(const qid of [17,18,19,20,21,22,23]){
  const approval=explicitApprovals.get(qid),pkg=approval.pkg;
  for(const ci of pkg.items){
   const uid=ci.uid,ext=externalVisualRows.get(uid);
   let problem,solution;
   if([17,18,19,20,23].includes(qid)){
    if(ext){
     problem=assetForSurface({root,row:ext,surface:'problem',uid,sourceQid:qid,approval});
     solution=assetForSurface({root,row:ext,surface:'solution',uid,sourceQid:qid,approval});
    }else if(mode==='write')throw Error('VISUAL_TWO_AXIS_TRIAGE_REQUIRED:'+uid);
   }else{
    const problemNeed=packageVisualNeed(ci,'problem'),solutionNeed=packageVisualNeed(ci,'solution');
    requireTrue(!!problemNeed&&!!solutionNeed,'PACKAGE_VISUAL_TWO_AXIS_DECISION_MISSING:'+uid);
    problem=packageAssetBinding({root,ci,surface:'problem',uid,need:problemNeed});
    solution=packageAssetBinding({root,ci,surface:'solution',uid,need:solutionNeed});
   }
   if(problem&&solution)visualBindings.set(uid,{problem,solution});
  }
 }
 const visualCounts={problem:{REQUIRED:0,BENEFICIAL:0,EXEMPT:0,NO_VISUAL:0},solution:{REQUIRED:0,BENEFICIAL:0,EXEMPT:0,NO_VISUAL:0}};
 for(const binding of visualBindings.values())for(const surface of ['problem','solution'])visualCounts[surface][binding[surface].need]++;
 const approved=manifestRows.filter(row=>row.qid>=17&&row.qid<=23);
 for(const item of approved){
  const n=item.qid,ns=String(n).padStart(2,'0'),base=DIR+'GPT_QID9_Q'+ns+'_PACKAGE.json';
  requireTrue(exists(base),'APPROVED_PACKAGE_MISSING:'+n);
  const approval=explicitApprovals.get(n);
  requireTrue(!!approval,'EXPLICIT_APPROVAL_NOT_BOUND:Q'+n);
  const {pkg,basis,approvalStatus,receiptGit,packageGit,receiptPath}=approval;
  requireTrue(pkg.sourceQid===n&&pkg.items.length===9&&new Set(pkg.items.map(x=>x.uid)).size===9,'QID9_PACKAGE_SCOPE_INVALID:'+n);
  const sourceExam=pkg.sourceExamPath;
  const sourceHistoricalSha=pkg.sourceGitBlobSha;
   const sourceSha=sourceHistoricalSha;
   const currentSourceSha=currentSource.blobSha1;
  requireTrue(sourceExam===sourcePath&&historicalBlob(root,sourceHistoricalSha),'SOURCE_HISTORICAL_SNAPSHOT_UNVERIFIED:'+n);
  for(const [ordinal,ci] of pkg.items.entries()){
   const slot=SLOTS[ordinal],uid=ci.uid,m=ci.meta||{};
    requireTrue(ci.slot===slot&&uid==='ALITE-PALMA25-2MID-Q'+ns+'-'+slot,'QID9_UID_OR_SLOT_MISMATCH:'+uid);
    const objective=Array.isArray(ci.choices)&&ci.choices.length===5&&new Set(ci.choices).size===5;
    const descriptive=Array.isArray(ci.choices)&&ci.choices.length===0&&ci.answerRole==='DESCRIPTIVE_NO_CHOICES';
    requireTrue(objective||descriptive,'QID9_ANSWER_SHAPE_INVALID:'+uid);
    requireTrue((objective?['①','②','③','④','⑤'].includes(ci.answer):typeof ci.answer==='string'&&ci.answer.trim().length>0)&&ci.stem&&ci.solution,'QID9_STUDENT_FIELDS_INCOMPLETE:'+uid);
   const standardUnitKey=m.standardUnitKey||ci.standardUnitKey;
   const subUnitKey=m.subUnitKey||ci.subUnitKey;
   requireTrue(standardUnitKey&&subUnitKey,'QID9_STANDARD_UNIT_UNKNOWN:'+uid);
   const family=ci.rpmExactView||m;
    const rpmL1=family.rpmL1,rpmL2=family.rpmL2,rpmL3=family.rpmL3,sourceRpmL4=family.rpmL4;
    const generatedL4Id=m.generatedExtL4Id||ci.generatedExtL4Id||null;
    requireTrue(rpmL1&&rpmL2&&rpmL3&&sourceRpmL4,'RPM_META_SOURCE_REQUIRED:'+uid);
    const namespace=String(sourceRpmL4).startsWith('EXT-')||generatedL4Id?'GENERATED_EXT_L4':'RPM_EXISTING_DRAFT';
    const rpmL4=namespace==='GENERATED_EXT_L4'?(String(sourceRpmL4).startsWith('EXT-')?sourceRpmL4:generatedL4Id):sourceRpmL4;
    const generatedL4RegistryRef=m.generatedL4RegistryRef||ci.generatedL4RegistryRef||
     (namespace==='GENERATED_EXT_L4'?SRCROOT+subUnitKey+'/extension-l4/registry.json':null);
    const declaredRpmIds=dedup([ci.rpmCanonicalRecordId,m.rpmRecordId,m.rpmPrimaryL3RecordId,...(m.rpmRecordIds||[]),m.sourceRpmL3Evidence?.evidenceRecordId].filter(Boolean));
    let rpmId=declaredRpmIds[0]||null;
   let found=cross.records.filter(row=>row.standardUnitKey===standardUnitKey&&row.subUnitKey===subUnitKey&&row.rpmPath.l3===label(rpmL3)&&
     (namespace==='GENERATED_EXT_L4'||row.rpmPath.l4===label(rpmL4)));
    let tpl=m.templateKey||ci.activeTemplateKey||(/^ALITE-PALMA25-2MID-Q21-C[123]$/.test(uid)?'TPL_NEC_SUFF_INTERVAL_PARAMETER':null);
     let rpmResolutionEvidence=null,record;
     if(/^ALITE-PALMA25-2MID-Q21-C[123]$/.test(uid)){
       const resolved=resolveQ21ParameterRpmRecord({records:cross.records,uid,declaredRecordIds:declaredRpmIds,standardUnitKey,subUnitKey,rpmL3:label(rpmL3),rpmL4:label(rpmL4),templateKey:tpl});
      record=resolved.record;rpmResolutionEvidence=resolved.evidence;rpmId=record.id;
       const resolutionDoc={...rpmResolutionEvidence,approvalBasis:basis,
       approvedPackage:{path:base,sha256:packageGit.sha256,gitBlobSha1:packageGit.blobSha1},
       approvalReceipt:{path:receiptPath,sha256:receiptGit.sha256,gitBlobSha1:receiptGit.blobSha1},
       authority:{path:CROS,sha256:crossHash},manifestDeclaredRecordIds:item.rpmRecordIds||[]};
       const resolutionPath=q21ParameterRpmResolutionPath(uid),resolutionBytes=buf(resolutionDoc),resolutionSha=hex(resolutionBytes),resolutionBlob=gitBlobSha(resolutionBytes);
       if(mode==='write')write(resolutionPath,resolutionBytes);
       else requireTrue(exists(resolutionPath)&&canonicalOrWorkingBytes(root,resolutionPath).bytes.equals(resolutionBytes),'Q21_PARAMETER_RPM_RESOLUTION_EVIDENCE_REQUIRED_OR_DRIFTED:'+uid);
       rpmResolutionEvidence={path:resolutionPath,sha256:resolutionSha,gitBlobSha1:resolutionBlob,declaredRecordIds:declaredRpmIds,selectedRecordId:record.id,selectionBasis:rpmResolutionEvidence.selectionBasis};
     }else if(uid==='ALITE-PALMA25-2MID-Q22-B2'){
       const resolved=resolveQ22B2RpmRecord({records:cross.records,uid,declaredRecordIds:declaredRpmIds,standardUnitKey,subUnitKey,rpmL3:label(rpmL3),rpmL4:label(rpmL4)});
       record=resolved.record;rpmResolutionEvidence=resolved.evidence;rpmId=record.id;
       const resolutionDoc={...rpmResolutionEvidence,approvalBasis:basis,
        approvedPackage:{path:base,sha256:packageGit.sha256,gitBlobSha1:packageGit.blobSha1},
        approvalReceipt:{path:receiptPath,sha256:receiptGit.sha256,gitBlobSha1:receiptGit.blobSha1},
        authority:{path:CROS,sha256:crossHash},manifestDeclaredRecordIds:item.rpmRecordIds||[],packageDeclaredRecordIds:m.rpmRecordIds||[]};
       const resolutionBytes=buf(resolutionDoc),resolutionSha=hex(resolutionBytes),resolutionBlob=gitBlobSha(resolutionBytes);
       if(mode==='write')write(q22B2RpmResolutionPath,resolutionBytes);
       else requireTrue(exists(q22B2RpmResolutionPath)&&canonicalOrWorkingBytes(root,q22B2RpmResolutionPath).bytes.equals(resolutionBytes),'Q22_B2_RPM_RESOLUTION_EVIDENCE_REQUIRED_OR_DRIFTED');
       rpmResolutionEvidence={path:q22B2RpmResolutionPath,sha256:resolutionSha,gitBlobSha1:resolutionBlob,declaredRecordIds:declaredRpmIds,selectedRecordId:record.id,selectionBasis:rpmResolutionEvidence.selectionBasis};
    }else{
       if(declaredRpmIds.length)found=found.filter(row=>declaredRpmIds.includes(row.id));
      requireTrue(found.length===1,'RPM_PRIMARY_LOOKUP_NOT_UNIQUE:'+uid);
      record=found[0];rpmId=record.id;
    }
    const ptRaw=m.problemTypeKey||m.pt||ci.activeProblemTypeKey||record.problemTypeKey;
    tpl=tpl||record.templateKey;
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
      const registry=json(registryRef),field=family==='crossConcepts'?'crossConceptDefinitions':'conditionDefinitions';
      const candidates=registry[family]||registry[field]||[];
      const matches=candidates.filter(row=>(row.id||row.key)===key&&/ACTIVE/.test(String(row.status||''))&&
        ((row.exampleUids||[]).includes(uid)||row.evidenceUid===uid||(row.scopeUids||[]).includes(uid)));
      if(matches.length!==1)return false;
      const row=matches[0];
      if(row.reviewStatus==='USER_DIRECTED_QUALITY_APPROVED')return row.approvalBasis===basis&&row.approvalReceiptPath===receiptPath&&
        row.approvalReceiptSha256===receiptGit.sha256&&row.approvalReceiptGitBlobSha1===receiptGit.blobSha1&&
        row.approvedPackagePath===base&&row.approvedPackageSha256===packageGit.sha256&&row.approvedPackageGitBlobSha1===packageGit.blobSha1;
      return true;
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
    const sourceIntegrationPattern=m.integrationPattern||ci.integrationPattern||'NONE';
    const projectedIntegrationPattern=canonicalIntegrationPattern(sourceIntegrationPattern);
    const generatedL4SourceBinding=namespace==='GENERATED_EXT_L4'?canonicalOrWorkingBytes(root,generatedL4RegistryRef):null;
    if(namespace==='GENERATED_EXT_L4')requireTrue(!!generatedL4SourceBinding,'GENERATED_L4_REGISTRY_BYTES_REQUIRED:'+uid);
    requireTrue(namespace!=='GENERATED_EXT_L4'||generatedL4RegistryRef&&exists(generatedL4RegistryRef),'GENERATED_L4_REGISTRY_REQUIRED:'+uid);
    const meta={
    rpmL1,rpmL2,rpmL3,rpmL4,rpmL4Namespace:namespace,rpmPrimaryRecordId:rpmId,
     ...(sourceRpmL4!==rpmL4?{rpmL4Label:sourceRpmL4}:{}),
     ...(rpmResolutionEvidence?{rpmDeclaredRecordIds:declaredRpmIds,rpmRecordResolution:rpmResolutionEvidence}:{}),
    ...(namespace==='GENERATED_EXT_L4'?{
      rpmAuthorityRef:CROS,rpmAuthoritySha256:crossHash,
       generatedL4RegistryRef,generatedL4RegistrySha256:generatedL4SourceBinding.sha256,
       generatedL4RegistryGitBlobSha1:generatedL4SourceBinding.blobSha1
    }:{
      rpmDraftAuthorityRef:CROS,rpmDraftAuthoritySha256:crossHash
    }),
    secondaryConceptKeys:[],crossConceptKeys:crossConcept,conditionKeys:condition,
    crossConceptRegistryRef:crossRegistry,conditionRegistryRef:conditionRegistry,
    sourceKind:'generated',
     integrationPattern:projectedIntegrationPattern,
    difficultyBucket:ci.difficultyBucket,level:ci.level,problemTypeKey:pt,templateKey:tpl,
    ...(labels.length?{conditionEvidenceLabels:labels}:{}),
    ...(n===6&&slot==='B1'?{conditionRuleModifiers:['EVEN_INTEGER']}:{}),
    ...(missing.length?{crossConceptEvidenceLabels:missing}:{}),
    standardCourse:'공통수학2',standardUnitKey,subUnitKey
   };
   const category={ 'H22-C2-01':'평면좌표','H22-C2-02':'직선의 방정식','H22-C2-03':'원의 방정식','H22-C2-04':'도형의 이동','H22-C2-05':'집합','H22-C2-06':'명제'}[standardUnitKey];
    const subLabel={'H22-C2-01-GEOMETRY_APPLICATION':'도형의 방정식 활용','H22-C2-02-LINE_EQUATION':'직선의 방정식','H22-C2-02-RELATION':'두 직선의 관계','H22-C2-03-INTERSECTION':'원과 직선·원의 관계','H22-C2-03-TANGENT':'원과 접선','H22-C2-03-CIRCLE_EQUATION':'원의 방정식','H22-C2-04-CORE':'도형의 이동 핵심 개념','H22-C2-05-CORE':'집합 핵심 개념','H22-C2-06-CORE':'명제 핵심 개념'}[subUnitKey];
   requireTrue(category&&subLabel,'UNIT_MASTER_MAPPING_REQUIRED:'+uid);
   const qa=gate.validateMeta(meta);
   if(qa.length)throw Error('META_PRECHECK:'+uid+':'+qa.join('|'));
   const fullName='palma-2025-2mid-qid9-q'+ns+'-'+slot;
   const sourcePath=SRCROOT+subUnitKey+'/shards/'+fullName+'.js';
   const metadataPath=SRCROOT+subUnitKey+'/metadata/'+fullName+'.json';
   const consumerPath='archive/data/generated-lite-consumer/v1/shards/'+subUnitKey+'/'+fullName+'.json';
   const reviewPath=DIR+'AUTO_REGISTER_EVIDENCE/'+fullName+'.json';
   const digest=metaSha256(meta);
    const visual=visualBindings.get(uid);
    if(mode==='check'&&!visual){skipped++;continue;}
    requireTrue(!!visual,'VISUAL_TWO_AXIS_TRIAGE_REQUIRED:'+uid);
    const copyAsset=entry=>{
     if(!entry.consumerPath)return;
     const physicalRel='archive/'+entry.consumerPath;
     const target=path.join(root,physicalRel);
     if(fs.existsSync(target)){const existing=canonicalOrWorkingBytes(root,physicalRel);requireTrue(existing.sha256===entry.sourceSha256||existing.blobSha1===entry.sourceGitBlobSha1,'VISUAL_CONSUMER_ASSET_BYTES_CONFLICT:'+uid+':'+entry.consumerPath);}
     else if(mode==='write')write(physicalRel,entry.sourceBytes);
    };
    copyAsset(visual.problem);copyAsset(visual.solution);
    const existing=index.records.find(x=>x.uid===uid);
    const existingCount=index.records.filter(x=>x.uid===uid).length;
    requireTrue(existingCount===0||existingCount===1,'EXISTING_UID_DUPLICATE:'+uid);
     const existingRepair=!!existing&&isAllowedGeneratedMetaProjectionRepair(uid,existing.meta,meta);
    if(existing?.metaFinalSha256===digest && existing.metaVerification?.status==='VERIFIED_CURRENT_SOURCE'){
    requireTrue(existing.shard===consumerPath.replace(/^archive\//,''),'EXISTING_UID_SHARD_DRIFT:'+uid);
    skipped++;continue;
   }
     requireTrue(!existing||existingRepair,'EXISTING_APPROVED_UID_REQUIRES_PINPOINT_REPAIR:'+uid);
     if(mode==='check'){
      requireTrue(!existingRepair,'EXISTING_APPROVED_META_PROJECTION_REPAIR_REQUIRED:'+uid);
      skipped++;continue;
     }
   const seed={
    id:1,uid,level:ci.level,difficultyBucket:ci.difficultyBucket,
    category,originalCategory:category,standardCourse:'공통수학2',standardUnitKey,
    standardUnit:category,standardUnitOrder:Number(standardUnitKey.slice(-2)),
    subUnitKey,subUnit:subLabel,subUnitConfidence:'candidate_evidence',
    subUnitClassificationDepth:'complete_candidate',
     questionType:objective?'객관식':'서술형',layoutTag:'grid',tags:[objective?'객관식':'서술형',category],wide:false,
    content:ci.stem,choices:ci.choices,answer:ci.answer,solution:ci.solution,
     ...(visual.problem.consumerPath?{image:visual.problem.consumerPath,imageAlt:visual.problem.alt,imageSize:visual.problem.size}:{}),
     ...(visual.solution.consumerPath?{solutionImage:visual.solution.consumerPath,solutionImageAlt:visual.solution.alt,solutionImageSize:visual.solution.size}:{}),
    sourceType:'generated',sourceKind:'generated',sourceQid:n,slot,purposeGroup:slot[0]
   };
   const evidence={
    schemaVersion:'GENERATED_META_REVIEW_EVIDENCE_V1',
      sourceIntegrationPattern,projectedIntegrationPattern,
     approvalReceiptPath:receiptPath,approvalReceiptSha256:receiptGit.sha256,approvalReceiptGitBlobSha1:receiptGit.blobSha1,
     approvedPackagePath:base,approvedPackageSha256:packageGit.sha256,approvedPackageGitBlobSha1:packageGit.blobSha1,
     approvedSourceSnapshot:{path:sourceExam,gitBlobSha1:sourceHistoricalSha},currentSource:{path:sourceExam,gitBlobSha1:currentSourceSha},visualBindings:{
      problem:{need:visual.problem.need,sourcePath:visual.problem.sourcePath,consumerPath:visual.problem.consumerPath,sha256:visual.problem.sourceSha256,gitBlobSha1:visual.problem.sourceGitBlobSha1,renderStatus:visual.problem.renderStatus,evidencePath:visual.problem.visualEvidencePath,evidenceSha256:visual.problem.visualEvidenceSha256},
      solution:{need:visual.solution.need,sourcePath:visual.solution.sourcePath,consumerPath:visual.solution.consumerPath,sha256:visual.solution.sourceSha256,gitBlobSha1:visual.solution.sourceGitBlobSha1,renderStatus:visual.solution.renderStatus,evidencePath:visual.solution.visualEvidencePath,evidenceSha256:visual.solution.visualEvidenceSha256}
     },items:[{uid,reviewStatus:approvalStatus,metaFinalSha256:digest,approvalBasis:basis,scopeUids:[uid]}]
   };
    if(existingRepair){
     const sandbox={window:{}};vm.runInNewContext(read(sourcePath).toString('utf8'),sandbox,{timeout:2000,filename:sourcePath});
     const sourceRows=(sandbox.window.questionBank||[]).filter(question=>question.uid===uid);
     const consumerRows=(json(consumerPath).records||[]).filter(entry=>entry.generatedUid===uid);
     requireTrue(sourceRows.length===1&&consumerRows.length===1,'EXISTING_APPROVED_PROJECTION_UID_NOT_UNIQUE:'+uid);
     verifyApprovedQuestionBodyParity({uid,approvedPackageItem:ci,sourceQuestion:sourceRows[0],consumerQuestion:consumerRows[0].question});
    }
   write(reviewPath,buf(evidence));
   const sourceBytes=Buffer.from('window.examTitle = '+JSON.stringify('PALMA_2025_QID9_'+ns+'_'+slot)+';\nwindow.questionBank = '+JSON.stringify([seed],null,2)+';\n','utf8');
    if(!existingRepair)write(sourcePath,sourceBytes);
    if(!existingRepair)write(metadataPath,buf([{
     uid,qid:1,sourceQid:n,slot,sourceArchiveFile:sourceExam,sourceBlobSha:sourceSha,approvedSourceBlobSha:sourceHistoricalSha,
    sourceSchoolMarker:'팔마고',reviewApprovalStatus:approvalStatus,
     sourceCandidatePath:base,sourceCandidateSha256:packageGit.sha256,sourceCandidateGitBlobSha1:packageGit.blobSha1,
     approvalReceiptPath:receiptPath,approvalReceiptSha256:receiptGit.sha256,approvalReceiptGitBlobSha1:receiptGit.blobSha1,
     currentSourceExamBlobSha1:currentSourceSha,approvedHistoricalSourceExamBlobSha1:sourceHistoricalSha
   }]));
    const sourceShardSha=gitBlobSha(sourceBytes);
    const prepared={schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',school:'팔마고',batchId:'PALMA25_QID9_AUTO_'+ns,
     sourceShard:sourcePath,sourceShardGitSha:sourceShardSha,sourceExamPath:sourceExam,sourceExamBlobSha:sourceSha,currentSourceExamBlobSha1:currentSourceSha,
     approvedSourceSnapshot:{path:sourceExam,gitBlobSha1:sourceHistoricalSha},approvedPackage:{path:base,sha256:packageGit.sha256,gitBlobSha1:packageGit.blobSha1},
     approvalReceipt:{path:receiptPath,sha256:receiptGit.sha256,gitBlobSha1:receiptGit.blobSha1},records:[]};
    if(!existingRepair)write(consumerPath,buf(prepared));
   const proposed={
     uid,school:'팔마고',year:2025,grade:'고1',subject:'공통수학2',sourceQid:n,
     sourceKind:'generated',l1:standardUnitKey,l2:subUnitKey,
     shard:consumerPath.replace(/^archive\//,''),localOrdinal:1,
      approval:approvalStatus==='REVIEW_PASS'?'REVIEW_APPROVED':approvalStatus,reviewStatus:approvalStatus,reviewApprovalBasis:basis,consumerSelectable:true,
      approvedSourceSnapshotBlobSha1:sourceHistoricalSha,approvedPackageSha256:packageGit.sha256,approvedPackageGitBlobSha1:packageGit.blobSha1,
      sourceExamBlobSha:sourceHistoricalSha,currentSourceExamBlobSha1:currentSourceSha,
      approvalReceiptSha256:receiptGit.sha256,approvalReceiptGitBlobSha1:receiptGit.blobSha1
   };
   const paths={sourceShard:sourcePath,sourceMetadata:metadataPath,consumerShard:consumerPath,consumerIndex:INDEX};
   const expectedSha256=Object.fromEntries(Object.entries(paths).map(([key,rel])=>[key,hex(read(rel))]));
   let result;
   try{result=registerApprovedGeneratedMeta({
    root,uid,meta,approval:{status:approvalStatus},
    reviewEvidence:{path:reviewPath,sha256:hex(read(reviewPath)),reviewStatus:approvalStatus},
    paths,expectedSha256,
       ...(existingRepair?{}:{newRegistration:{indexRow:proposed,sourceExamPath:sourceExam,sourceExamBlobSha:sourceSha,currentSourceBlobSha1:currentSourceSha,
       approvedSourceSnapshot:{sourcePath:sourceExam,sourceBlobSha1:sourceHistoricalSha,currentSourceBlobSha1:currentSourceSha,
        approvalReceiptPath:receiptPath,approvalReceiptSha256:receiptGit.sha256,approvalReceiptGitBlobSha1:receiptGit.blobSha1,
        approvedPackagePath:base,approvedPackageSha256:packageGit.sha256,approvedPackageGitBlobSha1:packageGit.blobSha1}}})
   });}catch(error){throw Error(`${uid}:${error.message||String(error)}`);}
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
  latestSummary.retentionGate={failures:checked.failures,errors:checked.errors};
  requireTrue(checked.failures===0,'GENERATED_RETENTION_GATE_FAIL:'+checked.errors.slice(0,6).join('|'));
 }
 const finalIndex=json(INDEX);
 const audit=auditNewProjection({root,index:finalIndex,expectedUids:expectedApprovedUids,approvedPackageItems,visualBindings,sourceExamPath:sourcePath,currentSourceBlobSha1:currentSource.blobSha1,historicalSourceBlobSha1:manifest.sourceBlobSha,approval:explicitApprovals.get(17).receipt});
 const missingVisualDecisionUids=expectedApprovedUids.filter(uid=>{
  const qid=Number(uid.match(/Q(\d+)-/)?.[1]);return qid>=17&&qid<=23&&!visualBindings.has(uid);
 });
 const closureMissing=[...new Set([...audit.missingApprovedUids,...missingVisualRows,...missingVisualDecisionUids])].sort();
 latestSummary={
  schemaVersion:'PALMA_QID9_APPROVED_PROJECTION_CHECK_V1',mode,status:closureMissing.length===0?'PASS':'FAIL',
  approvedUidCount:expectedApprovedUids.length,registeredUidCount:expectedApprovedUids.length-audit.missingIndexUids.length,
  missingApprovedUids:closureMissing,missingIndexUids:audit.missingIndexUids,missingVisualDecisionUids,
  missingVisualAssets:audit.missingAssets,structuralFailures:audit.structuralFailures,
  sourceExamPath:sourcePath,currentSourceBlobSha1:currentSource.blobSha1,approvedHistoricalSourceBlobSha1:manifest.sourceBlobSha,
  sourceProjectionObservation:{latestCurrentSourceBlobSha1:currentSource.blobSha1,observedSourceBlobSha1s:audit.observedSourceBlobSha1s,
   sourceChangedSinceProjection:audit.sourceObservationDriftUids.length>0,driftedUids:audit.sourceObservationDriftUids},
  approvalReceiptPath:explicitApprovals.get(17).receiptPath,approvalReceiptSha256:explicitApprovals.get(17).receiptGit.sha256,
  visualTriage:{uidCount:visualBindings.size,problem:visualCounts.problem,solution:visualCounts.solution},
  registered:updated,alreadyRegistered:skipped,indexTotal:finalIndex.records.length,consumerIndexApprovedCount:finalIndex.approvedCount,
  studentRenderStatus:'NOT_RUN_BY_PROJECTION_COMPILER',...(latestSummary.retentionGate?{retentionGate:latestSummary.retentionGate}:{})
 };
 console.log(JSON.stringify(latestSummary));
 if(closureMissing.length)process.exitCode=1;
};
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url))){
 try{main()}catch(e){latestSummary={...latestSummary,status:'FAIL',error:e.message||String(e),detail:e.stack||undefined};console.error(JSON.stringify(latestSummary));process.exitCode=1;}
}
