import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {physical,writeFresh} from '../../tools/archive-codex-artifact-io.mjs';
import {transitionFile} from '../../tools/archive-codex-dispatcher.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run);
const roster=JSON.parse(fs.readFileSync(path.join(base,'roster.json'))),row=roster[Number(process.argv[2])-1];
const heldQids=process.argv[3].split(',').map(Number),file=path.join(base,'dispatcher.json');
if(!row||!heldQids.length||heldQids.some(q=>!Number.isInteger(q)||q<1))throw Error('EXACT_RECOVERY_SCOPE_REQUIRED');
const result=transitionFile({stateFile:file,expectedStateSha256:physical(file).sha256,mutate:s=>{
 const n=structuredClone(s);if(n.jobs[row.examUid].nextStage!=='R3')throw Error('POST_R2_STAGE_REQUIRED');
 n.jobs[row.examUid].nextStage='ROOT_ITEM_RECOVERY';n.jobs[row.examUid].rootRecovery={
 status:'WAIT_AUTHOR_SLOT',heldQids,r3ReleaseBlocked:true,standingAuthority:'CURRENT §20/§25'};
 n.events.push({type:'ROOT_POST_R2_TRUE_HOLD_RECOVERY_QUEUED',examUid:row.examUid,heldQids,
 sourceBytesChanged:false,qualityPassAsserted:false,at:new Date().toISOString()});
 n.revision++;return {state:n};}});
writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.item-recovery.queued.json'),{
 schemaVersion:'ROOT_POST_R2_ITEM_RECOVERY_QUEUE_V1',runId:run,examUid:row.examUid,heldQids,
 decisionAuthority:'ROOT_DELEGATED',sourceFirstMinimalRepairThenDirectReplacement:true,
 freshAffectedReviewsRequiredAfterStudentChange:true,qualityPassAsserted:false,stateRef:result.stateRef});
console.log(JSON.stringify(result));
