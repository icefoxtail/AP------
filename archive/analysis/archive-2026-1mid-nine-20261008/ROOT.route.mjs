import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {readExam,sha256,physical,writeFresh,inside,cleanFilterHash} from '../../tools/archive-codex-artifact-io.mjs';
import {STUDENT_FIELDS,studentAssetRefs,normalizeStudentBundle} from '../../tools/archive-student-bundle.mjs';
import {claimSlot,acceptStage,transitionFile,planDispatch} from '../../tools/archive-codex-dispatcher.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run),roster=JSON.parse(fs.readFileSync(path.join(base,'roster.json')));
const [command,target,stage,extra]=process.argv.slice(2),row=roster.find(r=>r.examUid===target||String(r.rosterIndex+1)===target),stateFile=path.join(base,'dispatcher.json');
if(command==='plan'){console.log(JSON.stringify(planDispatch(JSON.parse(fs.readFileSync(stateFile)))));}
else if(command==='claim'){console.log(JSON.stringify(transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>claimSlot(s,{stage,examUid:row.examUid,sessionId:extra})}))); }
else if(command==='accept'){console.log(JSON.stringify(transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>{
 const event=JSON.parse(fs.readFileSync(inside(root,target))),slot=s.slots[event.stage];
 if(slot&&event.reviewerIdentity?.reviewerId==='/root/'+slot.sessionId){
  const normalized=structuredClone(s),canonical=event.reviewerIdentity.reviewerId;
  normalized.slots[event.stage].sessionId=canonical;
  if(!normalized.usedSessionIds.includes(canonical))normalized.usedSessionIds.push(canonical);
  normalized.events.push({type:'ROOT_CANONICAL_SESSION_ALIAS_NORMALIZATION',examUid:event.examUid,
   stage:event.stage,shortSessionId:slot.sessionId,canonicalSessionId:canonical,
   sameActualSpawnSession:true,sourceOrEvidenceBytesChanged:false,qualityPassAsserted:false,at:new Date().toISOString()});
  // The authoritative completion verifier must pass before transitionFile can persist this normalization.
  return acceptStage(normalized,{root,eventFile:inside(root,target),eventSha256:stage});
 }
 return acceptStage(s,{root,eventFile:inside(root,target),eventSha256:stage});
}}))); }
else if(command==='bundle'||command==='scope-bundle'||command==='source-assessment-bundle'){
 if(!row||!(command==='source-assessment-bundle'?stage==='CREATE':['R1','R2'].includes(stage)))throw Error('STUDENT_STAGE_REQUIRED');
 const exam=readExam(row.workingJsAbsolute),rows=exam.questions.map(q=>{
  const student=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
  const refs=new Set(studentAssetRefs(student)),assets=[];
  for(const ref of refs){const file=inside(row.assetRootAbsolute,ref),bytes=fs.readFileSync(file);assets.push({ref,path:file,sha256:sha256(bytes)});
   if(ref.endsWith('.svg'))for(const m of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(path.posix.normalize(path.posix.join(path.posix.dirname(ref),m[1])));}
  return {qid:Number(q.id),student,assets};
 });
 const bundle=normalizeStudentBundle({schemaVersion:'ROOT_CURRENT_STUDENT_ONLY_V1',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:rows.length,rows},{expectedSourceRawSha256:exam.rawSha256});
 let activeBundle=bundle;
 if(command!=='bundle'){
  const wanted=extra.split('@')[0].split(',').map(Number);if(wanted.some(q=>!bundle.qids.includes(q)))throw Error('AFFECTED_SCOPE_INVALID');
  activeBundle=normalizeStudentBundle({schemaVersion:'ROOT_AFFECTED_CURRENT_STUDENT_ONLY_V1',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:wanted.length,rows:bundle.rows.filter(r=>wanted.includes(r.qid))},{expectedSourceRawSha256:exam.rawSha256});
 }
 const suffix=command!=='bundle'?'.scope-'+extra:'.student';
 const bundleFile=path.join(row.assetRootAbsolute,stage+suffix+'.json'),bundleRef=writeFresh(bundleFile,activeBundle);
 const safe={runId:run,examUid:row.examUid,stage,executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',worktreeRootAbsolute:root,workingJsAbsolute:row.workingJsAbsolute,assetRootAbsolute:row.assetRootAbsolute,evidenceRootAbsolute:row.evidenceRootAbsolute,productionRelativePath:row.productionRelativePath,expectedHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),artifactRawSha256:exam.rawSha256,validatorRawBufferBlobSha1:exam.rawBufferGitBlobSha1,gitCleanFilterBlobSha1:cleanFilterHash({root,productionPath:row.productionRelativePath,bytes:exam.bytes}),allowedQids:bundle.qids,allowedFields:['STUDENT_PREFREEZE_ONLY'],studentBundleAbsolute:bundleFile,studentBundleSha256:bundleRef.sha256,requiredAssets:[...new Map(bundle.rows.flatMap(r=>r.assets).map(a=>[a.ref,a])).values()]};
 safe.allowedQids=activeBundle.qids;safe.requiredAssets=[...new Map(activeBundle.rows.flatMap(r=>r.assets).map(a=>[a.ref,a])).values()];
 if(command!=='bundle')safe.affectedScopeOnly=true;
 safe.sourceInputMode='EXTRACTED_JS_ASSETS';safe.pdfReviewMode='DEFECT_ONLY';
 if(command==='source-assessment-bundle')safe.substage='STUDENT_ONLY_SOURCE_DEFECT_ASSESSMENT';
 console.log(JSON.stringify({assignment:writeFresh(path.join(row.evidenceRootAbsolute,stage+(command!=='bundle'?'.scope-'+extra:'')+'.assignment.json'),safe),bundle:bundleRef,sourceRawSha256:exam.rawSha256,qids:activeBundle.qids,assetCount:safe.requiredAssets.length}));
}else throw Error('COMMAND_REQUIRED');
