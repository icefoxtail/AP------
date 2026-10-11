import {validSha,validTime,validRunUrl} from './archive-progress-core.mjs';

export const MAX_RETRIES=4;
export const RETRY_BASE_MS=5*60*1000;
const EVIDENCE_TYPES=new Set(['registration','release']);
const TEMP_REASONS=new Set(['API 조회 실패','증거 조회 실패','증거 다운로드 실패','현재 실행 차수 증거 없음','배포 진단 증거 없음','등록 결과 커밋 불명','Pages ZIP 다운로드 실패','배포 파일 산출물 미식별']);
const EVIDENCE_SOURCES=new Set(['trusted-git-tree','uploaded-pages-artifact','diagnostics-and-deploy-job']);
const FILE_REASONS=new Set(['Pages ZIP 크기 초과','Pages ZIP 만료','Pages ZIP 다운로드 실패','배포 파일 산출물 미식별']);
const PERMANENT_REASONS=new Set(['Pages ZIP 크기 초과','Pages ZIP 만료','증거 만료','증거 크기 초과','실행 산출물 크기 초과']);
const EXAM=/^[\w가-힣.-]{3,140}$/u;
export function runKey(kind,run){
 if(!EVIDENCE_TYPES.has(kind)||!Number.isSafeInteger(run.id)||run.id<=0||!Number.isSafeInteger(run.attempt)||run.attempt<1||!validSha(run.sha))return null;
 return `${kind}:${run.id}:${run.attempt}:${run.sha.toLowerCase()}`;
}
export function classify(value){
 if(value?.status==='verified'&&value.proof)return {status:'verified',proof:value.proof,reason:null};
 if(value?.status==='permanent'||PERMANENT_REASONS.has(value?.reason))return {status:'permanent',proof:null,reason:value.reason||'증거 만료'};
 if(value?.status==='transient')return {status:'transient',proof:null,reason:value.reason||'증거 조회 실패'};
 if(value&&typeof value==='object'&&value.schema===2)return {status:'verified',proof:value,reason:null};
 return {status:'transient',proof:null,reason:'현재 실행 차수 증거 없음'};
}
export function eligible(record,now,manual=false){
 if(record?.status==='verified'||record?.status==='permanent'||record?.fileProofState==='permanent')return false;
 if((record?.attempts||0)>=MAX_RETRIES)return false;
 return manual||!record?.nextRetryAt||Date.parse(record.nextRetryAt)<=Date.parse(now);
}
function minimizedProof(proof,examIds){
 if(!proof||proof.schema!==2||!validSha(proof.sourceSha))return null;
 const result={schema:2,run_id:proof.run_id,run_attempt:proof.run_attempt,sourceSha:proof.sourceSha,
  ...(/^[a-f0-9]{64}$/.test(proof.registry||'')?{registry:proof.registry}:{}),...(proof.actualDeployed===true?{actualDeployed:true}:{}),
  ...(proof.deploymentJobVerified===true?{deploymentJobVerified:true}:{}),
  ...(EVIDENCE_SOURCES.has(proof.evidenceSource)?{evidenceSource:proof.evidenceSource}:{}),
  ...(FILE_REASONS.has(proof.fileProofReason)?{fileProofReason:proof.fileProofReason}:{}),exams:{}};
 for(const id of examIds){const row=proof.exams?.[id];
  if(EXAM.test(id)&&validSha(row?.source)&&/^[a-f0-9]{64}$/.test(row?.assets||''))result.exams[id]={source:row.source,assets:row.assets};}
 return result;
}
export function safeRun(run){
 if(!runKey(run.kind||'registration',run)||!validTime(run.at)||!validRunUrl(run.url))return null;
 return {id:run.id,attempt:run.attempt,sha:run.sha,at:run.at,url:run.url,
  conclusion:['success','failure','cancelled'].includes(run.conclusion)?run.conclusion:'unknown',
  event:['push','workflow_dispatch','pull_request'].includes(run.event)?run.event:'unknown',
  branch:run.branch==='main'?'main':null};
}
function exactProof(proof,run,kind){
 return proof?.run_id===run.id&&proof?.run_attempt===run.attempt&&validSha(proof.sourceSha)&&
  (kind!=='release'||proof.sourceSha.toLowerCase()===run.sha.toLowerCase());
}
function proofStatus(proof,kind){
 if(kind!=='release'||proof.actualDeployed===true)return {status:'verified'};
 if(proof.deploymentJobVerified===true)return {status:'partial',fileProofState:PERMANENT_REASONS.has(proof.fileProofReason)?'permanent':'retryable'};
 return {status:'partial',fileProofState:'retryable'};
}
export function sanitizeObservation(key,r,examIds=[]){
 if(!r||r.key!==key||!['verified','partial','unverified','permanent'].includes(r.status))return null;
 const m=/^(registration|release):(\d+):(\d+):([a-f0-9]{40})$/.exec(key);
 if(!m)return null;
 const run=r.run&&safeRun({...r.run,kind:m[1]});
 if(!run||run.id!==Number(m[2])||run.attempt!==Number(m[3])||run.sha.toLowerCase()!==m[4])return null;
 const record={key,status:r.status,attempts:Number.isInteger(r.attempts)?Math.max(0,Math.min(MAX_RETRIES,r.attempts)):0,run};
 if(r.proof&&exactProof(r.proof,run,m[1])){
  record.proof=minimizedProof(r.proof,[...new Set([...Object.keys(r.proof.exams||{}),...examIds])]);
  if(!record.proof)return null;
  if(m[1]==='release'&&r.proof.deploymentJobVerified===true&&r.proof.actualDeployed!==true){
   // Old caches marked a successful deploy job as fully verified; migrate in place.
   Object.assign(record,proofStatus(r.proof,m[1]));
  }
  if(validTime(r.verifiedAt))record.verifiedAt=r.verifiedAt;
 }else if(['verified','partial'].includes(r.status))return null;
 if(Array.isArray(r.checkedExamIds))record.checkedExamIds=[...new Set(r.checkedExamIds.filter(id=>typeof id==='string'&&EXAM.test(id)))].slice(0,12000);
 if([...TEMP_REASONS,...PERMANENT_REASONS,'증거 실행/차수/SHA 불일치','배포 결과 단계 미검증'].includes(r.reason))record.reason=r.reason;
 if(validTime(r.nextRetryAt))record.nextRetryAt=r.nextRetryAt;
 if(r.retryExhausted===true)record.retryExhausted=true;
 if(record.status==='partial'&&record.proof?.deploymentJobVerified===true)record.fileProofState=proofStatus(record.proof,m[1]).fileProofState;
 return record;
}
export async function observeRun({kind,run,old,clock,manual=false,getEvidence,examIds=[],newExamIds=[]}){
 const key=runKey(kind,run);
 if(!key)return {key:null,record:null,proof:null};
 let record=sanitizeObservation(key,old,examIds)||{key,status:'unverified',attempts:0};
 const now=clock(),cached=record.proof||null;
 // A newly discovered exam is not covered merely because the run itself was verified.
 const missing=newExamIds.filter(id=>EXAM.test(id)&&!cached?.exams?.[id]&&!record.checkedExamIds?.includes(id));
 if(record.status==='verified'&&!missing.length)return {key,record,proof:cached};
 if(record.status==='verified'&&missing.length){
  // Separate backfill retry from previously verified proof; keep existing evidence.
  record={...record,status:'partial',attempts:0};
 }
 if(!eligible(record,now,manual))return {key,record,proof:cached};
 let result;
 try{result=classify(await getEvidence(run,kind,cached,missing));}
 catch(err){result={status:'transient',proof:null,reason:'API 조회 실패'};}
 const attempts=(record.attempts||0)+1,runInfo=safeRun({...run,kind});
 if(result.status==='verified'){
  const proof=result.proof;
  if(!exactProof(proof,run,kind)||cached&&proof.sourceSha.toLowerCase()!==cached.sourceSha.toLowerCase()){
   result={status:'transient',proof:null,reason:'증거 실행/차수/SHA 불일치'};
  }else{
   // Preserve old examined exams; backfill may return only the missing subset.
   const merged={...proof,exams:{...(cached?.exams||{}),...(proof.exams||{})}};
   const verdict=proofStatus(merged,kind);
   record={key,...verdict,attempts,verifiedAt:now,run:runInfo,
    proof:minimizedProof(merged,[...new Set([...examIds,...Object.keys(cached?.exams||{})])]),
    // Only positively observed or explicitly checked negative exam rows are covered.
    checkedExamIds:[...new Set([...(record.checkedExamIds||[]),...missing,...Object.keys(merged.exams||{}).filter(id=>examIds.includes(id))])].slice(0,12000),
    ...(verdict.status==='partial'?{reason:merged.fileProofReason||'파일 일치 증거 없음'}:{})};
   if(verdict.status==='partial'&&verdict.fileProofState!=='permanent'){
    if(attempts<MAX_RETRIES)record.nextRetryAt=new Date(Date.parse(now)+RETRY_BASE_MS*2**(attempts-1)).toISOString();
    else record.retryExhausted=true;
   }
   return {key,record,proof:record.proof};
  }
 }
 const reason=(TEMP_REASONS.has(result.reason)||PERMANENT_REASONS.has(result.reason)||result.reason==='증거 실행/차수/SHA 불일치'||result.reason==='배포 결과 단계 미검증')?result.reason:'증거 조회 실패';
 if(result.status==='permanent'){
  record={key,status:cached?'partial':'permanent',attempts,reason,run:runInfo,
   ...(cached?{proof:cached,fileProofState:'permanent',checkedExamIds:record.checkedExamIds||[]}: {})};
 }else{
  record={key,status:cached?'partial':'unverified',attempts,reason,run:runInfo,
   ...(cached?{proof:cached,...(record.fileProofState?{fileProofState:record.fileProofState}:{}),checkedExamIds:record.checkedExamIds||[]}:{}),
   ...(attempts<MAX_RETRIES?{nextRetryAt:new Date(Date.parse(now)+RETRY_BASE_MS*2**(attempts-1)).toISOString()}:{retryExhausted:true})};
 }
 return {key,record,proof:record.proof||null};
}
