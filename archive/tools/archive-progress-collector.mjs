import {validSha,validRunUrl,validTime} from './archive-progress-core.mjs';
const root='https://github.com/icefoxtail/AP------/';
export const examIds=files=>[...new Set(files.flatMap(f=>{
  if(/^archive\/exams\/.+\.js$/.test(f))return [f.split('/').at(-1).replace(/\.js$/,'')];
  const match=/^archive\/assets\/images\/([^/]+)\//.exec(f);return match?[match[1]]:[];
}))];
export async function paged(api,uri,perPage=100,maxPages=5){
 const all=[];
 for(let page=1;page<=maxPages;page++){
  const data=await api(uri+(uri.includes('?')?'&':'?')+'per_page='+perPage+'&page='+page);
  if(!Array.isArray(data))throw Error('Malformed API page '+page);
  all.push(...data);
  if(data.length<perPage)return {items:all,complete:true};
 }
 return {items:all,complete:false};
}
export async function mergedPRs(api,historyPages){
 const {items:pulls,complete:completePulls}=await paged(api,'/pulls?state=closed&sort=updated&direction=desc',100,historyPages);
 const merged=pulls.filter(p=>p.merged_at&&p.merge_commit_sha),results=[],incompletePRs=[];
 for(const p of merged){
  let files=[];let complete=false;
  try{
   const paginated=await paged(api,'/pulls/'+p.number+'/files',100,30);
   files=paginated.items;
   complete=paginated.complete && (!Number.isInteger(p.changed_files)||p.changed_files===files.length);
  }catch(error){console.warn('PR file inventory incomplete',p.number,String(error));}
  if(!complete){incompletePRs.push(p.number);continue;}
  const exams=examIds(files.map(f=>f.filename));
  if(exams.length)results.push({number:p.number,exams,mergeSha:p.merge_commit_sha,headSha:p.head?.sha,
    at:p.merged_at,url:p.html_url});
 }
 return {prs:results,incompletePRs,completePulls,oldestObservedAt:pulls.at(-1)?.updated_at||null};
}
export async function runs(api,workflow,pages){
 const list=[];
 for(let page=1;page<=pages;page++){
  const result=await api('/actions/workflows/'+workflow+'/runs?per_page=60&status=completed&page='+page);
  const rows=result.workflow_runs||[];list.push(...rows);
  if(rows.length<60)break;
 }
 return list.map(x=>({id:x.id,attempt:x.run_attempt,event:x.event,conclusion:x.conclusion,sha:x.head_sha,
  at:x.updated_at,url:x.html_url,prs:x.pull_requests||[],branch:x.head_branch}));
}
export function selectProof(artifacts,run){
 const expected='archive-progress-'+run.id+'-'+run.attempt;
 return (artifacts||[]).find(a=>a.name===expected&&!a.expired)||null;
}
export function parseProof(raw,run,kind){
 let value;
 try{value=JSON.parse(raw);}catch{return null;}
 if(value?.schema!==2 || value.run_id!==run.id || value.run_attempt!==run.attempt || !validSha(value.sourceSha) ||
    !/^[a-f0-9]{64}$/.test(value.registry||'') || typeof value.exams!=='object' || Array.isArray(value.exams) ||
    Object.keys(value.exams||{}).length>12000)return null;
 if(kind==='release' && (value.actualDeployed!==true || value.evidenceSource!=='uploaded-pages-artifact'))return null;
 for(const [id,e] of Object.entries(value.exams)){
  if(!/^[\w가-힣.-]{3,140}$/u.test(id)||!/^[a-f0-9]{40}$/.test(e?.source||'')||!/^[a-f0-9]{64}$/.test(e?.assets||''))return null;
 }
 return value;
}
export function checksFromRuns(regRuns){
 return regRuns.filter(x=>x.event==='pull_request').flatMap(r=>r.prs.map(p=>({
  pr:p.number,conclusion:r.conclusion,sha:r.sha,at:r.at,url:r.url,attempt:r.attempt})));
}
