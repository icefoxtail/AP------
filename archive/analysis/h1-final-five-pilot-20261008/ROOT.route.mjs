import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {physical,writeFresh,readExam} from '../../tools/archive-codex-artifact-io.mjs';
import {transitionFile,claimSlot,resumeSlot,acceptStage} from '../../tools/archive-codex-dispatcher.mjs';
import {consumeStableCompletion} from '../../tools/archive-codex-stage-kit.mjs';
import {disclosePostfreeze} from '../../tools/archive-student-bundle.mjs';
import {buildStageState} from '../../tools/archive-stage-runtime-v2.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../../..'),run=path.basename(dir),roster=JSON.parse(fs.readFileSync(path.join(dir,'ROOT.roster.json'))),stateFile=path.join(dir,'ROOT.dispatcher.json');
const [action,uid,stage,arg,extra]=process.argv.slice(2),row=roster.rows.find(r=>r.examUid===uid);if(!row)throw Error('OUTSIDE_ROSTER');
const temp=path.join(root,'.tmp/archive',run,uid),ev=path.join(root,'archive/analysis',uid,run),source=path.join(temp,uid+'.js');
if(action==='claim'||action==='resume'){console.log(JSON.stringify(transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>action==='claim'?claimSlot(s,{stage,examUid:uid,sessionId:arg}):resumeSlot(s,{stage,examUid:uid,sessionId:arg,reason:extra})})));}
else if(action==='accept'){
 const eventFile=path.resolve(root,arg),eventSha256=extra,event=JSON.parse(fs.readFileSync(eventFile));if(event.examUid!==uid||event.stage!==stage)throw Error('EVENT_SCOPE_MISMATCH');
 const sp=path.join(ev,'ROOT.state.json');let state=fs.existsSync(sp)?JSON.parse(fs.readFileSync(sp)):buildStageState({stage:'CREATE',qualityContractVersion:roster.qualityContractVersion,executionLine:'CODEX'});
 const consumed=consumeStableCompletion({root,eventFile,expectedEventSha256:eventSha256,state});
 const result=transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>acceptStage(s,{root,eventFile,eventSha256})});
 const report=JSON.parse(fs.readFileSync(event.rawReport.path));writeFresh(path.join(ev,`ROOT.${stage}.intake.json`),{uid,stage,session:event.reviewerIdentity.reviewerId,reportPath:path.relative(root,event.rawReport.path).replaceAll('\\','/'),reportSha256:event.rawReport.sha256,artifactSha:event.artifactSha,questionCount:report.artifactContract.questionCount,...consumed});fs.writeFileSync(sp,JSON.stringify(consumed.consumed.state,null,2)+'\n');console.log(JSON.stringify(result));
}
else if(action==='accept-dispatcher-rebind'){
 const eventFile=path.resolve(root,arg),event=JSON.parse(fs.readFileSync(eventFile));if(event.examUid!==uid||event.stage!==stage)throw Error('EVENT_REBIND_SCOPE_MISMATCH');
 console.log(JSON.stringify(transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>acceptStage(s,{root,eventFile,eventSha256:extra})})));
}
else if(action==='extract'){
 if(!['R1','R2'].includes(stage))throw Error('BLIND_STAGE_REQUIRED');const exam=readExam(source),output=path.join(temp,`${stage}.student-bundle.json`);
 execFileSync('node',[path.join(dir,'ROOT.safe-student-extractor.mjs'),source,temp,output],{cwd:root,stdio:'pipe'});
 const bundleValue=JSON.parse(fs.readFileSync(output)),requiredStudentAssets=[...new Map(bundleValue.rows.flatMap(r=>r.assets).map(a=>[a.ref,a])).values()];
 const packet={runId:run,examUid:uid,stage,executionLine:'CODEX',qualityContractVersion:roster.qualityContractVersion,worktreeRootAbsolute:root.replaceAll('\\','/'),expectedHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),workingJsAbsolute:source.replaceAll('\\','/'),workingJsPrefreezePermission:'HASH_ONLY_NO_TEXT_OR_PARSE',studentBundleAbsolute:output.replaceAll('\\','/'),studentBundleSha256:physical(output).sha256,studentBundleSchemaVersion:bundleValue.schemaVersion,studentAccessor:'rows[].student',assetAccessor:'rows[].assets',requiredStudentAssets,expectedSourceRawSha256:exam.rawSha256,questionCount:exam.questions.length,assetRootAbsolute:temp.replaceAll('\\','/'),evidenceRootAbsolute:ev.replaceAll('\\','/'),preFreezeInputMode:'STUDENT_ONLY_ALL_ASSETS',postFreezeAccess:'ROOT will supply source/answer-bearing evidence only after immutable freeze receipt',nextRosterTarget:roster.rows[row.rosterIndex+1]?.examUid||'NONE'};
 const assignment=path.join(ev,`ROOT.assignment.${stage}.prefreeze.json`);console.log(JSON.stringify({assignment:writeFresh(assignment,packet),sourceRawSha256:exam.rawSha256,questionCount:exam.questions.length,bundle:physical(output)}));
}
else if(action==='disclose'){
 if(!['R1','R2'].includes(stage))throw Error('BLIND_STAGE_REQUIRED');const freezeFile=path.resolve(root,arg);if(physical(freezeFile).sha256!==extra)throw Error('DELIVERED_ORIGINAL_FREEZE_SHA_REQUIRED');
 const freeze=JSON.parse(fs.readFileSync(freezeFile));if(freeze.stage!==stage||freeze.reviewerIdentity?.role!=='archive_'+stage.toLowerCase())throw Error('ACTUAL_BLIND_REVIEWER_REQUIRED');
 const active=JSON.parse(fs.readFileSync(stateFile)).slots[stage];if(active?.examUid!==uid||active?.sessionId!==freeze.reviewerIdentity.reviewerId)throw Error('FREEZE_STAGE_OWNER_MISMATCH');
 const bundle=path.join(temp,`${stage}.student-bundle.json`),output=path.join(temp,`${stage}.postfreeze.json`),disclosed=disclosePostfreeze({sourceFile:source,studentBundleFile:bundle,freezeFile,freezeSha256:extra,output});
 const packet={runId:run,examUid:uid,stage,executionLine:'CODEX',qualityContractVersion:roster.qualityContractVersion,worktreeRootAbsolute:root.replaceAll('\\','/'),workingJsAbsolute:source.replaceAll('\\','/'),assetRootAbsolute:temp.replaceAll('\\','/'),evidenceRootAbsolute:ev.replaceAll('\\','/'),productionPath:row.productionPath,originalFreeze:physical(freezeFile),disclosure:disclosed.ref,currentSourceRawSha256:readExam(source).rawSha256,pdfAbsolute:row.pdfAbsolute,expectedPdfSha256:row.sha256,sourceCompanions:row.sourceCompanions,upstreamEvidenceRootAbsolute:ev.replaceAll('\\','/'),nextRosterTarget:roster.rows[row.rosterIndex+1]?.examUid||'NONE'};
 const assigned=writeFresh(path.join(ev,`ROOT.assignment.${stage}.postfreeze.json`),packet);console.log(JSON.stringify({assignment:assigned,originalFreeze:physical(freezeFile),disclosure:disclosed.ref,studentParity:'EXACT'}));
}
else throw Error('CLAIM_RESUME_ACCEPT_EXTRACT_DISCLOSE_REQUIRED');
