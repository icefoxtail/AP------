const HEX=/^[a-f0-9]{40}$/i;
const EXAM=/^[\w가-힣.-]{3,140}$/u;
const RUN=/^https:\/\/github\.com\/icefoxtail\/AP------\/(?:actions\/runs\/\d+(?:\/attempts\/\d+)?|pull\/\d+)$/;
const ISO=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const REASONS=new Set(['현재 실행 차수 증거 없음','등록 결과 커밋 불명','등록 결과 원격 반영 미증명','배포 산출물 증거 없음','PR 파일 목록 불완전',
 'API 조회 실패','증거 조회 실패','증거 다운로드 실패','증거 만료','증거 크기 초과','증거 실행/차수/SHA 불일치','배포 진단 증거 없음',
 'Pages ZIP 크기 초과','Pages ZIP 만료','Pages ZIP 다운로드 실패','배포 파일 산출물 미식별','배포 결과 단계 미검증','시험지·에셋·등록 데이터 불일치','파일 일치 증거 없음']);
export const validSha=x=>typeof x==='string'&&HEX.test(x);
export const validRunUrl=x=>typeof x==='string'&&RUN.test(x);
export const validTime=x=>typeof x==='string'&&ISO.test(x)&&Number.isFinite(Date.parse(x))&&new Date(x).toISOString().slice(0,19)===x.slice(0,19);
const instant=x=>validTime(x)?Date.parse(x):-1;
const score={미확인:0,완료:2,통과:2,실패:2,불일치:3};
const newer=(a,b)=>{
 if(!b)return a;
 if(!a)return b;
 const timeA=instant(a.at),timeB=instant(b.at);
 if(timeA!==timeB)return timeB>timeA?b:a;
 const attA=a.attempt||1,attB=b.attempt||1;
 if(attA!==attB)return attB>attA?b:a;
 if(a.run===b.run)return (score[b.result]||0)>(score[a.result]||0)?b:a;
 // A newly observed run at the same completion timestamp is not a prior run.
 return b.run!==a.run&&b.run>a.run?b:a;
};
const clean=(r,result,sha=r?.sha,stage,reason)=>{
 if(!validRunUrl(r?.url)||!validTime(r?.at)||!validSha(sha))return null;
 return {result,sha,run:r.url,at:r.at,...(stage?{stage}:{}),
  ...(reason&&REASONS.has(reason)?{reason}:{}),
  ...(Number.isInteger(r.attempt)&&r.attempt>0?{attempt:r.attempt}:{})};
};
const prior=item=>{
 if(!item||!['완료','통과','실패','미확인','불일치'].includes(item.result)||!validSha(item.sha)||
  !validRunUrl(item.run)||!validTime(item.at)||item.stage&&!['등록','배포','배포 작업','등록 PR 검사','파일 일치'].includes(item.stage))return null;
 return {result:item.result,sha:item.sha,run:item.run,at:item.at,
  ...(item.stage?{stage:item.stage}:{}),...(REASONS.has(item.reason)?{reason:item.reason}:{}),
  ...(Number.isInteger(item.attempt)&&item.attempt>0?{attempt:item.attempt}:{})};
};
const fresh=id=>({exam:id,check:null,main:null,registration:null,deployment:null,deploymentJob:null,lastSuccessfulRelease:null,lastFailure:null});
const has=(p,id)=>!!(p?.exams?.[id]?.source&&p.exams[id].assets&&p.registry);
const same=(a,b,id)=>has(a,id)&&has(b,id)&&a.registry===b.registry&&a.exams[id].source===b.exams[id].source&&a.exams[id].assets===b.exams[id].assets;
export const present=v=>v?.result||'미확인';
export async function reconcile(previous,data,ancestor){
 const entries={};
 for(const [id,item]of Object.entries(previous?.entries||{})){
  if(!EXAM.test(id))continue;
  const e=entries[id]=fresh(id);
  for(const name of ['check','main','registration','deployment','deploymentJob','lastSuccessfulRelease','lastFailure'])e[name]=prior(item?.[name]);
 }
 const prs=(data.prs||[]).filter(p=>validSha(p.mergeSha)&&validSha(p.headSha)&&validRunUrl(p.url)&&validTime(p.at)&&Number.isInteger(p.number));
 for(const p of prs)for(const id of p.exams||[]){
  if(!EXAM.test(id))continue;
  const e=entries[id]||=fresh(id),item=clean({sha:p.mergeSha,url:p.url,at:p.at},'완료');
  if(e.main&&newer(e.main,item)===item&&e.main.sha!==item.sha){e.check=null;e.registration=null;e.deployment=null;e.deploymentJob=null;}
  e.main=newer(e.main,item);
 }
 for(const p of prs)for(const id of p.exams||[]){
  const e=entries[id];if(!e||e.main?.sha!==p.mergeSha)continue;
  const checks=(data.checks||[]).filter(c=>c.pr===p.number&&c.sha===p.headSha&&validRunUrl(c.url)&&validTime(c.at));
  const latest=checks.reduce((a,b)=>newer(a,b),null);
  if(latest)e.check=['success','failure'].includes(latest.conclusion)?clean(latest,latest.conclusion==='success'?'통과':'실패'):null;
  else if(e.check?.sha!==p.headSha)e.check=null;
 }
 const cache=new Map();
 async function after(a,b){
  if(!validSha(a)||!validSha(b))return false;
  if(a===b)return true;
  const key=a+':'+b;
  if(!cache.has(key))cache.set(key,await ancestor(a,b).catch(()=>false));
  return cache.get(key);
 }
 const sorted=a=>[...(a||[])].sort((x,y)=>instant(x.at)-instant(y.at)||(x.attempt||0)-(y.attempt||0));
 for(const e of Object.values(entries)){
  if(!e.main)continue;
  const registrations=[];
  for(const r of sorted(data.registrations)){
   if(!validTime(r.at)||instant(r.at)<instant(e.main.at)||!(await after(e.main.sha,r.registeredSha||r.inputSha)))continue;
   const related=r.inputSha===e.main.sha||(r.exams||[]).includes(e.exam)||!!r.proof?.exams?.[e.exam];
   if(r.conclusion==='failure'){
    if(!related)continue;
    const item=clean(r,'실패',r.sha,'등록');
    if(item){e.lastFailure=newer(e.lastFailure,item);e.registration=newer(e.registration,item);}
    continue;
   }
   if(r.conclusion!=='success')continue;
   const verified=validSha(r.registeredSha)&&has(r.proof,e.exam)&&r.proof.sourceSha===r.registeredSha&&
    r.proof.run_id===r.id&&r.proof.run_attempt===r.attempt&&await after(e.main.sha,r.registeredSha);
   if(verified){
    const item=clean(r,'완료',r.registeredSha,'등록');
    if(item){e.registration=newer(e.registration,item);registrations.push(r);}
   }else if(related){
    const reason=REASONS.has(r.proofReason)?r.proofReason:'현재 실행 차수 증거 없음';
    const item=clean(r,'미확인',r.inputSha,'등록',reason);
    if(item)e.registration=newer(e.registration,item);
   }
  }
  for(const d of sorted(data.releases)){
   if(!validTime(d.at)||instant(d.at)<instant(e.main.at)||!validSha(d.sha)||!(await after(e.main.sha,d.sha)))continue;
   if(d.conclusion==='failure'){
    const item=clean(d,'실패',d.sha,'배포 작업');
    if(item){e.lastFailure=newer(e.lastFailure,item);e.deploymentJob=newer(e.deploymentJob,item);
     e.deployment=newer(e.deployment,clean(d,'실패',d.sha,'파일 일치'));}
    continue;
   }
   if(d.conclusion!=='success')continue;
   const workOk=d.proof?.run_id===d.id&&d.proof?.run_attempt===d.attempt&&d.proof?.sourceSha===d.sha&&d.proof?.deploymentJobVerified===true;
   const job=clean(d,workOk?'완료':'미확인',d.sha,'배포 작업',workOk?null:'배포 결과 단계 미검증');
   if(job)e.deploymentJob=newer(e.deploymentJob,job);
   const exact=d.proof?.actualDeployed===true&&workOk;
   const matching=exact&&registrations.some(r=>validSha(r.registeredSha)&&has(r.proof,e.exam)&&same(r.proof,d.proof,e.exam)&&r.proof.sourceSha===r.registeredSha);
   let state='미확인',reason=REASONS.has(d.proof?.fileProofReason)?d.proof.fileProofReason:'파일 일치 증거 없음';
   if(exact&&registrations.some(r=>has(r.proof,e.exam))){
    state=matching?'완료':'불일치';reason=matching?null:'시험지·에셋·등록 데이터 불일치';
   }
   const match=clean(d,state,d.sha,'파일 일치',reason);
   if(match)e.deployment=newer(e.deployment,match);
   if(state==='완료')e.lastSuccessfulRelease=newer(e.lastSuccessfulRelease,clean(d,'완료',d.sha,'파일 일치'));
  }
 }
 const incomplete=[...new Set((data.incompletePRs||[]).filter(n=>Number.isInteger(n)&&n>0))];
 return {schema:1,updatedAt:validTime(data.now)?data.now:previous?.updatedAt||null,
  coverage:'GitHub PR/Actions only; Library/GPT completion not observed',
  history:{complete:data.completePulls===true,scope:data.scope||'recent',oldestObservedAt:validTime(data.oldestObservedAt)?data.oldestObservedAt:null},
  inventoryComplete:incomplete.length===0,...(incomplete.length?{incompletePRs:incomplete}:{}),
  entries:Object.fromEntries(Object.entries(entries).sort(([a],[b])=>a.localeCompare(b,'ko')))};
}
