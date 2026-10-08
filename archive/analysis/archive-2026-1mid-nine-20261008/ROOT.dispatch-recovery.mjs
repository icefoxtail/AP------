import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {physical,readExam,writeFresh} from '../../tools/archive-codex-artifact-io.mjs';
import {transitionFile} from '../../tools/archive-codex-dispatcher.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run);
const row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(process.argv[2])-1];
const session=process.argv[3],heldQids=process.argv[4].split(',').map(Number),expectedRaw=process.argv[5];
if(!row||!session||!heldQids.length)throw Error('EXACT_RECOVERY_ASSIGNMENT_REQUIRED');
const exam=readExam(row.workingJsAbsolute);if(exam.rawSha256!==expectedRaw)throw Error('RECOVERY_PREIMAGE_DRIFT');
const stateFile=path.join(base,'dispatcher.json');
const result=transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>{
 if(s.slots.CREATE||s.jobs[row.examUid].nextStage!=='ROOT_ITEM_RECOVERY'||s.usedSessionIds.includes(session))throw Error('RECOVERY_SLOT_OR_STAGE_INVALID');
 if(JSON.stringify(s.jobs[row.examUid].rootRecovery.heldQids)!==JSON.stringify(heldQids))throw Error('HELD_SCOPE_DRIFT');
 const n=structuredClone(s),at=new Date().toISOString();
 n.slots.CREATE={examUid:row.examUid,sessionId:session,startedAt:at,repairReturnStage:'ROOT_AFFECTED_REVIEW',reason:'POST_R2_SOURCE_FIRST_HELD_ITEM_RECOVERY'};
 n.usedSessionIds.push(session);n.jobs[row.examUid].rootRecovery={...n.jobs[row.examUid].rootRecovery,status:'AUTHORING',sessionId:session,
  prerepairRawSha256:exam.rawSha256,r3ReleaseBlockedUntilFreshAffectedR1R2:true};
 n.events.push({type:'POST_R2_ITEM_RECOVERY_DISPATCH',examUid:row.examUid,stage:'CREATE',substage:'ITEM_RECOVERY',sessionId:session,
  heldQids,sourceFirstMinimalRepairThenDirectReplacement:true,qualityPassAsserted:false,at});n.revision++;return{state:n};}});
writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.item-recovery.dispatch.json'),{schemaVersion:'ROOT_POST_R2_HELD_ITEM_RECOVERY_DISPATCH_V1',runId:run,
 examUid:row.examUid,sessionId:session,heldQids,prerepairRawSha256:exam.rawSha256,decisionAuthority:'ROOT_DELEGATED',
 sourceFirstIndependentAssessmentBeforeUpstreamReasons:true,nonTargetInvarianceRequired:true,freshAffectedR1R2Required:true,qualityPassAsserted:false,stateRef:result.stateRef});
console.log(JSON.stringify(result));
