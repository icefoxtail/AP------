import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readExam,sha256,physical,writeFresh,inside,artifactSnapshot,cleanFilterHash} from './archive-codex-artifact-io.mjs';
import {solutionSha256,QUALITY_CONTRACT_V2} from './archive-stage-validator-artifact-v2.mjs';
import {consumeValidationPass,buildStageState} from './archive-stage-runtime-v2.mjs';
import {normalizeStudentBundle,STUDENT_FIELDS,studentAssetRefs,disclosePostfreeze} from './archive-student-bundle.mjs';

export function bindEvidence({sourceFile,evidence,reviewedSourceRawSha256,root,productionPath,assetRoot,reviewedCurrentAssets=[]}){
  const exam=readExam(sourceFile),out=structuredClone(evidence);
  if(out.qualityContractVersion!==QUALITY_CONTRACT_V2||out.executionLine!=='CODEX')throw Error('CODEX_CURRENT_EVIDENCE_REQUIRED');
  if(out.artifactSha!==exam.rawBufferGitBlobSha1&&out.artifactSha!==exam.rawSha256&&reviewedSourceRawSha256!==exam.rawSha256)throw Error('CURRENT_SOURCE_REVIEW_AUTHORIZATION_REQUIRED');
  out.artifactSha=exam.rawBufferGitBlobSha1;out.artifactRawSha256=exam.rawSha256;
  out.technicalHashes={rawSha256:exam.rawSha256,validatorRawBufferBlobSha1:exam.rawBufferGitBlobSha1,gitCleanFilterBlobSha1:root&&productionPath?cleanFilterHash({root,productionPath,bytes:exam.bytes}):null};
  if(out.artifactDispositions)out.artifactDispositions.artifactSha=exam.rawBufferGitBlobSha1;
  const byId=new Map(exam.questions.map(q=>[Number(q.id),q])),missingReviewedFields=[];
  for(const row of out.rows||[]){const q=byId.get(Number(row.qid));if(!q)throw Error('EVIDENCE_UNKNOWN_QID:'+row.qid);row.solutionSha256=solutionSha256(q.solution);
    if(['CREATE','R1'].includes(out.stage)&&row.smallBoardContinuityStatus===undefined){const status=row.solutionLayout?.smallBoardContinuityStatus??row.axisEvidence?.SOLUTION_LAYOUT?.smallBoardContinuityStatus;if(status!==undefined)row.smallBoardContinuityStatus=status;else missingReviewedFields.push({qid:row.qid,field:'smallBoardContinuityStatus'});}}
  const assetBindingChanges=[];
  if(out.currentAssetBindings!==undefined){if(!assetRoot||!Array.isArray(out.currentAssetBindings))throw Error('DECLARED_CURRENT_ASSET_BINDING_SCHEMA_REQUIRED');for(const binding of out.currentAssetBindings){if(binding.kind!=='CURRENT_ASSET'||!binding.ref?.startsWith('assets/images/'))throw Error('HISTORICAL_OR_UNKNOWN_BINDING_NOT_REWRITTEN');const current=physical(inside(assetRoot,binding.ref));if(binding.sha256!==current.sha256){if(!reviewedCurrentAssets.some(r=>r.ref===binding.ref&&r.sha256===current.sha256&&r.reviewed===true))throw Error('CHANGED_ASSET_REVIEW_AUTHORIZATION_REQUIRED:'+binding.ref);assetBindingChanges.push({ref:binding.ref,previousSha256:binding.sha256,currentSha256:current.sha256});binding.sha256=current.sha256;}}}
  if(assetBindingChanges.length)out.assetBindingCorrectionProvenance=assetBindingChanges;
  return {evidence:out,missingReviewedFields,assetBindingChanges,semanticVerdictCreated:false};
}
const studentFields=STUDENT_FIELDS;
export function freezeAnswers({studentBundleFile,answers,assetReads=[],stage,reviewerIdentity,expectedSourceRawSha256,output}){
  if(!['R1','R2'].includes(stage)||!reviewerIdentity?.reviewerId||reviewerIdentity.role!=='archive_'+stage.toLowerCase())throw Error('BLIND_STAGE_REVIEWER_REQUIRED');
  const bundle=normalizeStudentBundle(JSON.parse(fs.readFileSync(studentBundleFile)),{inputFile:studentBundleFile,expectedSourceRawSha256});
  const qids=bundle.rows.map(r=>Number(r.qid));if(new Set(qids).size!==qids.length||qids.some(q=>!Number.isInteger(q)))throw Error('BUNDLE_QID_INVALID');
  if(!Array.isArray(answers)||answers.length!==qids.length||new Set(answers.map(r=>r.qid)).size!==qids.length||answers.some(r=>!qids.includes(r.qid)||r.independentAnswer===undefined||typeof r.reasoning!=='string'||!r.reasoning.trim()))throw Error('FULL_INDEPENDENT_FREEZE_REQUIRED');
  for(const row of bundle.rows){if(Object.keys(row.student||{}).some(k=>!studentFields.has(k)))throw Error('STUDENT_BUNDLE_FORBIDDEN_FIELD');
    const required=new Set(studentAssetRefs(row.student));
    for(const ref of required)if(!(row.assets||[]).some(a=>a.ref===ref))throw Error('STUDENT_ASSET_BUNDLE_INCOMPLETE:'+ref);
    for(const a of row.assets||[]){if(sha256(fs.readFileSync(a.path))!==a.sha256)throw Error('STUDENT_ASSET_SHA_CHANGED:'+a.ref);if(!assetReads.some(r=>r.ref===a.ref&&r.sha256===a.sha256&&r.opened===true))throw Error('ACTUAL_ASSET_READ_ACK_REQUIRED:'+a.ref);}}
  const value={schemaVersion:'JS_ARCHIVE_IMMUTABLE_BLIND_FREEZE_V1',stage,reviewerIdentity,frozenAt:new Date().toISOString(),sourceRawSha256:bundle.sourceRawSha256,studentBundle:physical(studentBundleFile),bundleAdapterProvenance:bundle.adapterProvenance,studentQidOrder:bundle.qids,rows:structuredClone(answers),assetReads};
  return {freeze:value,ref:writeFresh(output,value)};
}
export function recordAdjudication({freezeFile,corrections,output}){
  const original=JSON.parse(fs.readFileSync(freezeFile));if(!Array.isArray(corrections)||!corrections.length||corrections.some(r=>!original.rows.some(q=>q.qid===r.qid)||!r.reason||r.correctedAnswer===undefined))throw Error('ADJUDICATION_LOCI_REQUIRED');
  const value={schemaVersion:'JS_ARCHIVE_FREEZE_ADJUDICATION_V1',originalFreeze:physical(freezeFile),createdAt:new Date().toISOString(),corrections:corrections.map(r=>({...r,originalAnswer:original.rows.find(q=>q.qid===r.qid).independentAnswer})),originalFreezeMutated:false};return {adjudication:value,ref:writeFresh(output,value)};
}
export function sealCompletion({root,sourceFile,evidenceFile,reportFile,assetRoot,reviewerIdentity,nextRosterTarget,extraFiles=[],output}){
  const report=JSON.parse(fs.readFileSync(reportFile)),evidence=JSON.parse(fs.readFileSync(evidenceFile)),exam=readExam(sourceFile),stage=report.stage;
  if(report.executionLine!=='CODEX'||report.qualityContractVersion!==QUALITY_CONTRACT_V2||report.validatorMode!==stage+'_V2'||report.common?.commonValid!==true||report.artifactSha!==exam.rawBufferGitBlobSha1||evidence.artifactSha!==report.artifactSha||report.artifactContract?.active!==true||report.artifactContract?.disposition!=='PASS'||report.artifactContract?.issues?.length||report.artifactContract?.questionCount!==exam.questions.length||report.issues?.length||evidence.stage!==stage||evidence.examUid!==report.examUid)throw Error('CURRENT_FINAL_STAGE_REPORT_REQUIRED');
  if(reviewerIdentity?.role!=='archive_'+String(stage).toLowerCase()||!reviewerIdentity.reviewerId||typeof nextRosterTarget!=='string'||!nextRosterTarget.trim())throw Error('STAGE_HANDOFF_IDENTITY_AND_NEXT_ROSTER_REQUIRED');
  const current=artifactSnapshot({sourceFile,evidenceFile,assetRoot,questions:exam.questions});if(current.issues.length||JSON.stringify(report.technicalBinding)!==JSON.stringify(current))throw Error('VALIDATOR_PHYSICAL_SNAPSHOT_STALE');
  const consumed=consumeValidationPass({state:buildStageState({stage,workComplete:true,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'}),validationReport:report});
  for(const file of [sourceFile,evidenceFile,reportFile,...extraFiles])inside(root,path.resolve(file));
  const event={schemaVersion:'JS_ARCHIVE_CODEX_STABLE_STAGE_COMPLETE_V1',status:'STAGE_COMPLETE',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,examUid:report.examUid,stage,reviewerIdentity,sealedAt:new Date().toISOString(),artifactSha:exam.rawBufferGitBlobSha1,physicalSnapshot:current,rawReport:physical(reportFile),extraProofs:extraFiles.map(physical),nextStage:consumed.state.stage,freedSlot:stage,nextRosterTarget,completionBasis:'GENERIC_STAGE_PASS_ONLY',actualRenderPassAsserted:false};return {event,ref:writeFresh(output,event)};
}
export function verifyCompletion({root,eventFile,expectedEventSha256}){
  if(!/^[a-f0-9]{64}$/.test(expectedEventSha256||'')||physical(eventFile).sha256!==expectedEventSha256)throw Error('SEALED_EVENT_SHA_REQUIRED');
  const event=JSON.parse(fs.readFileSync(eventFile));if(event.schemaVersion!=='JS_ARCHIVE_CODEX_STABLE_STAGE_COMPLETE_V1'||event.executionLine!=='CODEX'||event.qualityContractVersion!==QUALITY_CONTRACT_V2||event.status!=='STAGE_COMPLETE')throw Error('STABLE_COMPLETION_EVENT_REQUIRED');
  const refs=[event.physicalSnapshot.source,event.physicalSnapshot.evidence,...event.physicalSnapshot.assets,event.rawReport,...event.extraProofs];for(const ref of refs){inside(root,ref.path);if(physical(ref.path).sha256!==ref.sha256)throw Error('SEALED_STAGE_FILE_CHANGED:'+ref.path);}
  const report=JSON.parse(fs.readFileSync(event.rawReport.path));if(report.examUid!==event.examUid||report.stage!==event.stage||report.artifactSha!==event.artifactSha||JSON.stringify(report.technicalBinding)!==JSON.stringify(event.physicalSnapshot))throw Error('SEALED_EVENT_REPORT_BINDING_INVALID');
  const consumed=consumeValidationPass({state:buildStageState({stage:event.stage,workComplete:true,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'}),validationReport:report});if(event.nextStage!==consumed.state.stage||event.freedSlot!==event.stage||event.reviewerIdentity?.role!=='archive_'+event.stage.toLowerCase()||!event.reviewerIdentity.reviewerId||!event.nextRosterTarget)throw Error('SEALED_HANDOFF_INVALID');
  return {ok:true,eventRef:physical(eventFile),examUid:event.examUid,stage:event.stage,nextStage:event.nextStage,freedSlot:event.freedSlot,nextRosterTarget:event.nextRosterTarget};
}
export function consumeStableCompletion({root,eventFile,expectedEventSha256,state}){
  const verified=verifyCompletion({root,eventFile,expectedEventSha256}),event=JSON.parse(fs.readFileSync(eventFile));
  const consumed=consumeValidationPass({state:buildStageState({...state,workComplete:true}),validationReport:JSON.parse(fs.readFileSync(event.rawReport.path))});
  return {verified,consumed,nextRosterTarget:event.nextRosterTarget,freedSlot:event.freedSlot};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const [command,...argv]=process.argv.slice(2),a={},proof=[];for(let i=0;i<argv.length;i++){const k=argv[i];if(!['--root','--exam','--evidence','--output','--reviewed-source-sha','--expected-source-sha','--production-path','--bundle','--answers','--asset-reads','--reviewed-assets','--stage','--reviewer','--freeze','--freeze-sha','--qids','--corrections','--report','--asset-root','--next-roster','--proof','--event','--event-sha','--state'].includes(k))throw Error('UNKNOWN_ARGUMENT:'+k);if(k==='--proof')proof.push(argv[++i]);else a[k.slice(2)]=argv[++i];}
  const root=path.resolve(a.root||'.'),resolve=p=>inside(root,p),json=p=>JSON.parse(fs.readFileSync(resolve(p)));let result;
  if(command==='bind'){const bound=bindEvidence({sourceFile:resolve(a.exam),evidence:json(a.evidence),reviewedSourceRawSha256:a['reviewed-source-sha'],root,productionPath:a['production-path'],assetRoot:a['asset-root']?resolve(a['asset-root']):undefined,reviewedCurrentAssets:a['reviewed-assets']?json(a['reviewed-assets']):[]});result={ref:writeFresh(resolve(a.output),bound.evidence),missingReviewedFields:bound.missingReviewedFields,assetBindingChanges:bound.assetBindingChanges};}
  else if(command==='freeze'){if(!a['expected-source-sha'])throw Error('ASSIGNMENT_CURRENT_SOURCE_SHA_REQUIRED');result=freezeAnswers({studentBundleFile:resolve(a.bundle),answers:json(a.answers),assetReads:a['asset-reads']?json(a['asset-reads']):[],stage:a.stage,reviewerIdentity:{role:'archive_'+String(a.stage).toLowerCase(),reviewerId:a.reviewer},expectedSourceRawSha256:a['expected-source-sha'],output:resolve(a.output)});}
  else if(command==='adjudicate')result=recordAdjudication({freezeFile:resolve(a.freeze),corrections:json(a.corrections),output:resolve(a.output)});
  else if(command==='postfreeze')result=disclosePostfreeze({sourceFile:resolve(a.exam),studentBundleFile:resolve(a.bundle),freezeFile:resolve(a.freeze),freezeSha256:a['freeze-sha'],qids:a.qids?a.qids.split(',').map(Number):undefined,output:resolve(a.output)});
  else if(command==='seal')result=sealCompletion({root,sourceFile:resolve(a.exam),evidenceFile:resolve(a.evidence),reportFile:resolve(a.report),assetRoot:resolve(a['asset-root']||'archive'),reviewerIdentity:{role:'archive_'+String(a.stage).toLowerCase(),reviewerId:a.reviewer},nextRosterTarget:a['next-roster'],extraFiles:proof.map(resolve),output:resolve(a.output)});
  else if(command==='verify-complete')result=verifyCompletion({root,eventFile:resolve(a.event),expectedEventSha256:a['event-sha']});
  else if(command==='intake'){const consumed=consumeStableCompletion({root,eventFile:resolve(a.event),expectedEventSha256:a['event-sha'],state:json(a.state)});result=a.output?{ref:writeFresh(resolve(a.output),consumed)}:consumed;}
  else throw Error('COMMAND_REQUIRED:bind|freeze|adjudicate|seal|verify-complete|intake');
  console.log(JSON.stringify(result.ref?{ref:result.ref,missingReviewedFields:result.missingReviewedFields}:result,null,2));
}
