import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {physical,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
import {verifyCompletion} from '../../tools/archive-codex-stage-kit.mjs';
import {transitionFile} from '../../tools/archive-codex-dispatcher.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim(),run='archive-2026-1mid-nine-20261008';
const base=path.join(root,'archive/analysis',run),row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(process.argv[2])-1];
const planPath=inside(root,process.argv[3]);if(physical(planPath).sha256!==process.argv[4])throw Error('EXACT_PLAN_REQUIRED');
const plan=JSON.parse(fs.readFileSync(planPath)),source=physical(row.workingJsAbsolute),stateFile=path.join(base,'dispatcher.json');
if(plan.examUid!==row.examUid||plan.stages.length!==3)throw Error('EXACT_TARGET_THREE_STAGES_REQUIRED');
const bindings=plan.stages.map(p=>{const eventFile=inside(root,p.path);verifyCompletion({root,eventFile,expectedEventSha256:p.sha256});const event=JSON.parse(fs.readFileSync(eventFile)),report=JSON.parse(fs.readFileSync(event.rawReport.path));
 if(event.examUid!==row.examUid||event.stage!==p.stage||event.physicalSnapshot.source.sha256!==source.sha256||report.disposition!=='PASS'||report.denominator!==report.rowCount||report.issues.length)throw Error('CURRENT_FULL_STAGE_PASS_REQUIRED');
 return {stage:p.stage,event:physical(eventFile),evidence:event.physicalSnapshot.evidence,report:event.rawReport,assets:event.physicalSnapshot.assets,qids:report.common.observedQids,artifactSha:event.artifactSha};});
if(JSON.stringify(bindings.map(b=>b.stage).sort())!==JSON.stringify(['CREATE','R1','R2'])||bindings.some(b=>JSON.stringify(b.qids)!==JSON.stringify(bindings[0].qids)))throw Error('FULL_DENOMINATOR_PARITY_REQUIRED');
const assets=bindings[2].assets;for(const asset of assets)if(physical(asset.path).sha256!==asset.sha256)throw Error('CURRENT_ASSET_DRIFT');
const originalPacket=JSON.parse(fs.readFileSync(path.join(base,'26_강남여고_1학기_중간_고2_대수/R3.assignment.json'))),approved={...originalPacket.approvedCapture};
const runner=path.join(row.assetRootAbsolute,'capture-official-output-context.mjs');fs.copyFileSync(approved.runnerAbsolute,runner,fs.constants.COPYFILE_EXCL);approved.runnerAbsolute=runner;
for(const [file,sha] of [[runner,approved.runnerSha256],[approved.engineAbsolute,approved.engineSha256],[approved.currentCssAbsolute,approved.currentCssSha256]])if(physical(file).sha256!==sha)throw Error('APPROVED_ENGINE_ROUTE_DRIFT');
const currentHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const result=transitionFile({stateFile,expectedStateSha256:physical(stateFile).sha256,mutate:s=>{const n=structuredClone(s),job=n.jobs[row.examUid];
 if(!job.rootRecovery||!['ROOT_ITEM_RECOVERY','ROOT_AFFECTED_REVIEW'].includes(job.nextStage)||n.slots.R3)throw Error('RECOVERY_ROUTING_PRECONDITION');
 for(const binding of bindings)if(!n.events.some(e=>e.eventSha256===binding.event.sha256&&e.examUid===row.examUid))throw Error('STAGE_NOT_YET_ACCEPTED');
 job.nextStage='R3';job.rootRecovery={...job.rootRecovery,status:'QUALITY_CLOSED_CURRENT',r3ReleaseBlockedUntilFreshAffectedR1R2:false,currentSourceRawSha256:source.sha256,remainingItemHoldCount:0};
 n.events.push({type:'ROOT_CURRENT_RECOVERY_FULL_STAGE_CLOSURE',examUid:row.examUid,bindings,source,qualityVerdictsReusedFromWorkers:true,at:new Date().toISOString()});n.revision++;return n;}});
const proofs=bindings.flatMap(b=>[b.event,b.evidence,b.report]);
const packet={schemaVersion:'ROOT_CURRENT_R3_ABSOLUTE_ASSIGNMENT_V1',runId:run,examUid:row.examUid,stage:'R3',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',worktreeRootAbsolute:root,expectedHead:currentHead,
 workingJsAbsolute:row.workingJsAbsolute,assetRootAbsolute:row.assetRootAbsolute,evidenceRootAbsolute:row.evidenceRootAbsolute,productionRelativePath:row.productionRelativePath,artifactRawSha256:source.sha256,validatorRawBufferBlobSha1:bindings[0].artifactSha,
 qids:bindings[0].qids,allowedQids:bindings[0].qids,targetedReviewQids:plan.targetedReviewQids,requiredAssets:assets,proofs,approvedCapture:approved,captureDependencies:originalPacket.captureDependencies,sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',
 sourcePolicy:'Actual official engine render; all desktop/mobile exam/answer/solution cases; no DOM injection',rootRoutingState:result.stateRef,additionalProofs:plan.additionalProofs||[]};
console.log(JSON.stringify({assignment:writeFresh(path.join(row.evidenceRootAbsolute,'R3.assignment.json'),packet),state:result.stateRef}));
