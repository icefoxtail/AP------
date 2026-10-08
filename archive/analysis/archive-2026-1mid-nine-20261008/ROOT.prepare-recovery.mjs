import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {readExam,sha256,writeFresh,cleanFilterHash,physical} from '../../tools/archive-codex-artifact-io.mjs';
import {studentAssetRefs} from '../../tools/archive-student-bundle.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim(),run='archive-2026-1mid-nine-20261008';
const base=path.join(root,'archive/analysis',run),row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(process.argv[2])-1];
const held=process.argv[3].split(',').map(Number),expected=process.argv[4],exam=readExam(row.workingJsAbsolute);
if(exam.rawSha256!==expected)throw Error('RECOVERY_PREIMAGE_DRIFT');
const nonTargets=exam.questions.filter(q=>!held.includes(Number(q.id))).map(q=>({qid:Number(q.id),canonicalObjectSha256:sha256(Buffer.from(JSON.stringify(q)))}));
const refs=[...new Set(exam.questions.flatMap(q=>studentAssetRefs(q)))];
const assets=refs.map(ref=>({ref,...physical(path.join(row.assetRootAbsolute,ref))}));
const preimage=writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.recovery.non-target-preimage.json'),{
 schemaVersion:'ROOT_NON_TARGET_RECOVERY_PREIMAGE_V1',examUid:row.examUid,sourceRawSha256:exam.rawSha256,heldQids:held,nonTargetRows:nonTargets,assets,verdict:'TECHNICAL_HASH_ONLY'});
const packet={...row,runId:run,stage:'CREATE',substage:'POST_R2_ITEM_RECOVERY',executionLine:'CODEX',
 qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',worktreeRootAbsolute:root,
 expectedHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),artifactRawSha256:exam.rawSha256,
 validatorRawBufferBlobSha1:exam.rawBufferGitBlobSha1,gitCleanFilterBlobSha1:cleanFilterHash({root,productionPath:row.productionRelativePath,bytes:exam.bytes}),
 allowedQids:held,allowedFields:['HELD_ITEM_RECOVERY_ONLY'],nonTargetPreimage:preimage,
 sourceFirstIndependentAssessmentRequired:true,upstreamReasonsBeforeSourceAssessmentForbidden:true,
 difficultyProposalBeforePriorDifficultyExposureRequired:true,minimalSourceRepairFirst:true,
 directReplacementOnlyForConfirmedTrueHold:true,nonTargetInvarianceRequired:true,freshAffectedR1R2RequiredAfterStudentChange:true,qualityPassAsserted:false};
console.log(JSON.stringify(writeFresh(path.join(row.evidenceRootAbsolute,'CREATE.item-recovery.assignment.json'),packet)));
