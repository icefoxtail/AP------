import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {readExam,sha256,writeFresh,cleanFilterHash} from '../../tools/archive-codex-artifact-io.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run);
const row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[2],exam=readExam(row.workingJsAbsolute);
if(exam.rawSha256!=='2e3c6e27f34ca7e3ef559ea5f636132b09d9f1c3c483afaf074dccb48e4cf891')throw Error('RECOVERY_PREIMAGE_DRIFT');
const heldQids=[1,10],invariance=exam.questions.filter(q=>!heldQids.includes(Number(q.id)))
 .map(q=>({qid:Number(q.id),canonicalObjectSha256:sha256(Buffer.from(JSON.stringify(q)))}));
const invariantRef=writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.recovery.non-target-preimage.json'),{
 schemaVersion:'ROOT_NON_TARGET_RECOVERY_PREIMAGE_V1',examUid:row.examUid,sourceRawSha256:exam.rawSha256,
 heldQids,nonTargetRows:invariance,verdict:'TECHNICAL_HASH_ONLY_NO_QUALITY_JUDGMENT'});
const assignment={...row,runId:run,stage:'CREATE',substage:'POST_R2_ITEM_RECOVERY',executionLine:'CODEX',
 qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',worktreeRootAbsolute:root,
 expectedHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),artifactRawSha256:exam.rawSha256,
 validatorRawBufferBlobSha1:exam.rawBufferGitBlobSha1,
 gitCleanFilterBlobSha1:cleanFilterHash({root,productionPath:row.productionRelativePath,bytes:exam.bytes}),
 allowedQids:heldQids,allowedFields:['HELD_ITEM_RECOVERY_ONLY'],nonTargetPreimage:invariantRef,
 sourceFirstIndependentAssessmentRequired:true,upstreamReasonBeforeSourceAssessmentForbidden:true,
 minimalSourceRepairFirst:true,directReplacementOnlyForConfirmedTrueHold:true,
 sameFinalNamingAndRelativeReferencesRequired:true,freshAffectedR1R2RequiredAfterStudentChange:true,
 qualityPassAsserted:false};
console.log(JSON.stringify(writeFresh(path.join(row.evidenceRootAbsolute,'CREATE.item-recovery.assignment.json'),assignment)));
