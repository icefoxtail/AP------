import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {physical,writeFresh} from '../../../archive/tools/archive-codex-artifact-io.mjs';
import {transitionFile} from '../../../archive/tools/archive-codex-dispatcher.mjs';

const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008';
const uid='26_강남여고_1학기_중간_고2_대수';
const expectedHead='7d1cc00727a6cfde528cb0e991704f80a0fa8a68';
const expectedRaw='ee7f5dec997371cde114fab1c22bced3b9eda8bc29d9845f1f5cc554e8be973f';
const base=path.join(root,'archive/analysis',run,uid);
const runBase=path.join(root,'archive/analysis',run);
const stateFile=path.join(runBase,'dispatcher.json');
const source=path.join(root,'.tmp/archive',run,uid,`${uid}.js`);
const assetRoot=path.join(root,'.tmp/archive',run,uid);
const hashBytes=b=>createHash('sha256').update(b).digest('hex');
const readJson=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const gitHead=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(gitHead!==expectedHead)throw Error(`HEAD_DRIFT:${gitHead}`);
if(physical(source).sha256!==expectedRaw)throw Error('CURRENT_SOURCE_SHA_MISMATCH');
const state=readJson(stateFile),row=state.roster.find(r=>r.examUid===uid),job=state.jobs[uid];
if(!row||path.resolve(row.workingJsAbsolute)!==path.resolve(source)||path.resolve(row.evidenceRootAbsolute)!==path.resolve(base))throw Error('ASSIGNED_ABSOLUTE_PATH_MISMATCH');
if(job?.nextStage!=='ROOT_AFFECTED_REVIEW'||job?.rootRecovery?.status!=='AUTHORING'||JSON.stringify(job.rootRecovery.heldQids)!==JSON.stringify([1,10]))throw Error('STALE_RECOVERY_STATE_MISMATCH');
if(state.slots.R3||job.sessions.R3)throw Error('R3_SLOT_ALREADY_CLAIMED');
const reports=[
 {stage:'CREATE',event:'CREATE.item-recovery.stable-complete-event.json',report:'CREATE.item-recovery.generic-validator.raw.json',evidence:'CREATE.item-recovery.evidence.current.json',eventSha:'9e4534abcc77329088056b809b5a473f32f641adc6ec1f47ec4dd7356b6cfe8b'},
 {stage:'R1',event:'R1.recovery.stable-complete-event.json',report:'R1.recovery.generic-validator.raw.json',evidence:'R1.recovery.integrated.evidence.final.json',eventSha:'f2db648d0fda2c4d7f36169f51c050be1a0a02ba73eeb7a348319dbbefbdf515'},
 {stage:'R2',event:'R2.recovery-integrated.stable-complete-event.json',report:'R2.recovery-integrated.generic-validator.raw.json',evidence:'R2.recovery-integrated.evidence.json',eventSha:'ddeda74e0a39a2ad10141bd4adc562e7f4d2cfa087da58ce8ab78e64ea8a2ea1'}
];
const snapshots=[];
for(const x of reports){
 const eventPath=path.join(base,x.event),reportPath=path.join(base,x.report),evidencePath=path.join(base,x.evidence);
 const event=readJson(eventPath),report=readJson(reportPath),evidence=readJson(evidencePath);
 if(physical(eventPath).sha256!==x.eventSha||event.status!=='STAGE_COMPLETE'||event.stage!==x.stage||event.examUid!==uid)throw Error(`EVENT_MISMATCH:${x.stage}`);
 if(event.physicalSnapshot?.source?.sha256!==expectedRaw||event.physicalSnapshot?.evidence?.sha256!==physical(evidencePath).sha256)throw Error(`EVENT_SOURCE_OR_EVIDENCE_BINDING_MISMATCH:${x.stage}`);
 if(report.ok!==true||report.disposition!=='PASS'||report.stage!==x.stage||report.examUid!==uid||report.denominator!==25||report.rowCount!==25||report.artifactSha!==event.artifactSha||report.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||report.executionLine!=='CODEX'||report.issues?.length!==0||report.artifactContract?.active!==true||report.artifactContract?.disposition!=='PASS'||report.artifactContract?.questionCount!==25)throw Error(`GENERIC_REPORT_NOT_CURRENT_PASS:${x.stage}`);
 if(report.technicalBinding?.source?.sha256!==expectedRaw||report.technicalBinding?.evidence?.sha256!==physical(evidencePath).sha256)throw Error(`REPORT_BINDING_MISMATCH:${x.stage}`);
 if(evidence.artifactRawSha256!==expectedRaw||evidence.artifactSha!==event.artifactSha||evidence.denominator!==25||evidence.rows?.length!==25||evidence.itemHoldCount!==0||evidence.itemHolds?.length!==0||evidence.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||evidence.executionLine!=='CODEX')throw Error(`CURRENT_FULL25_EVIDENCE_NOT_CLEAR:${x.stage}`);
 snapshots.push({stage:x.stage,event:{path:eventPath,sha256:physical(eventPath).sha256},evidence:{path:evidencePath,sha256:physical(evidencePath).sha256,itemHoldCount:evidence.itemHoldCount,rowCount:evidence.rows.length},report:{path:reportPath,sha256:physical(reportPath).sha256,disposition:report.disposition,denominator:report.denominator,rowCount:report.rowCount,issues:report.issues},artifactSha:event.artifactSha});
}
const assets=JSON.parse(fs.readFileSync(path.join(base,reports[0].evidence),'utf8')).assetBindings.map(a=>{
 const p=path.resolve(assetRoot,a.ref); if(!fs.existsSync(p)||physical(p).sha256!==a.sha256)throw Error(`CURRENT_ASSET_MISMATCH:${a.ref}`);
 return {ref:a.ref,path:p,sha256:a.sha256};
});
if(assets.length!==1||assets[0].sha256!=='edcad8201e06a4ab6a7aa40c78f638f409c871ffefcdd7a34d2db9f7f16d95b9')throw Error('ASSET_ROSTER_MISMATCH');
const captureRunner=path.join(root,'.tmp/archive',run,uid,'capture-official-output-context.mjs');
if(physical(captureRunner).sha256!=='1ff02bbbb8a60626f67c1c16b48f01db2f4e1110f1c1063c04877a748b1d10b2')throw Error('APPROVED_CAPTURE_RUNNER_HASH_MISMATCH');
const engine=path.join(root,'archive/engine.html'),css=path.join(root,'archive/archive2-preview-mobile.css');
if(physical(engine).sha256!=='4f335aee010e092c25a3dd428ff1aaf2f81ec39209c0669b162f1c042fd162c5')throw Error('APPROVED_ENGINE_HASH_MISMATCH');
if(physical(css).sha256!=='f09397f04fea96ed4980f0ba3cfd0e2670811365098ddf92a5a32a67fca3cd51')throw Error('APPROVED_CSS_HASH_MISMATCH');
const retainedNames=['CREATE.CARRY_ITEM_HOLD.json','CREATE.generic-validator.fail-01.raw.json','CREATE.generic-validator.fail-02.raw.json','R1.evidence.final.json','R1.recovery.seal-attempt1.fail.json','R1.recovery.seal-attempt2.fail.json','R1.recovery.original-freeze.json','R2.original-freeze.json','R2.recovery-integrated.seal-attempt01.fail.json','R2.recovery-integrated.verify-attempt01.fail.json','R2.recovery-integrated.validator-invocation-failure01.json'];
const retained=retainedNames.filter(n=>fs.existsSync(path.join(base,n))).map(n=>({path:path.join(base,n),sha256:physical(path.join(base,n)).sha256}));
const assignment={runId:run,examUid:uid,stage:'R3',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',worktreeRootAbsolute:root,workingJsAbsolute:source,assetRootAbsolute:assetRoot,evidenceRootAbsolute:base,productionRelativePath:row.productionRelativePath,expectedHead:gitHead,artifactRawSha256:expectedRaw,validatorRawBufferBlobSha1:snapshots[2].artifactSha,gitCleanFilterBlobSha1:snapshots[2].artifactSha,allowedQids:Array.from({length:25},(_,i)=>i+1),allowedFields:['TARGETED_RELEASE','FULL_STRUCTURAL_INTEGRITY','ACTUAL_RENDER'],targetedReviewQids:[1,10],openQids:[],targetScopeBasis:'Current CREATE item-recovery plus fresh current-source R1/R2; historical held qids [1,10] remain in prior failure/freeze provenance.',currentEvidenceAndReports:snapshots,requiredAssets:assets,r1EvidenceAbsolute:snapshots[1].evidence.path,r2EvidenceAbsolute:snapshots[2].evidence.path,approvedCapture:{runnerAbsolute:captureRunner,runnerSha256:physical(captureRunner).sha256,engineAbsolute:engine,engineSha256:physical(engine).sha256,currentCssAbsolute:css,currentCssSha256:physical(css).sha256,requiredModes:['desktop-exam','desktop-answer','desktop-solution','mobile-exam','mobile-answer','mobile-solution'],sourcePolicy:'official stored output/context; no DOM injection',execution:'R3-owned actual browser render'},captureDependencies:{nodeModulesAbsolute:'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'},historicalProvenanceRetained:retained};
const assignmentPath=path.join(base,'R3.assignment.json');
if(fs.existsSync(assignmentPath))throw Error('R3_ASSIGNMENT_ALREADY_EXISTS');
writeFresh(assignmentPath,assignment);
const reportPath=path.join(base,'ROOT.quality-closure.proof.json');
if(fs.existsSync(reportPath))throw Error('CLOSURE_PROOF_ALREADY_EXISTS');
const expectedState=physical(stateFile).sha256;
const transition=transitionFile({stateFile,expectedStateSha256:expectedState,mutate:current=>{
 const currentJob=current.jobs[uid];
 if(currentJob?.nextStage!=='ROOT_AFFECTED_REVIEW'||currentJob?.rootRecovery?.status!=='AUTHORING'||JSON.stringify(currentJob.rootRecovery.heldQids)!==JSON.stringify([1,10]))throw Error('DISPATCHER_RECOVERY_CHANGED');
 if(current.slots.R3||currentJob.sessions.R3)throw Error('R3_SLOT_ALREADY_CLAIMED');
 const next=structuredClone(current),at=new Date().toISOString(),recovery=next.jobs[uid].rootRecovery;
 next.jobs[uid].nextStage='R3';
 next.jobs[uid].rootRecovery={...recovery,status:'QUALITY_CLOSED_CURRENT',r3ReleaseBlocked:false,r3ReleaseBlockedUntilFreshAffectedR1R2:false,qualityClosure:{sourceRawSha256:expectedRaw,full25:true,itemHoldCount:0,stageReports:snapshots.map(s=>({stage:s.stage,reportSha256:s.report.sha256,evidenceSha256:s.evidence.sha256,eventSha256:s.event.sha256})),proofPath:reportPath,closedAt:at}};
 next.events.push({type:'ROOT_RECOVERY_QUALITY_CLOSED_CURRENT',examUid:uid,fromNextStage:'ROOT_AFFECTED_REVIEW',nextStage:'R3',sourceRawSha256:expectedRaw,artifactSha:snapshots[2].artifactSha,qualityPassAsserted:false,zeroItemHoldVerified:true,stageReportShas:snapshots.map(s=>s.report.sha256),preservedHistoricalHeldQids:[1,10],proofPath:reportPath,at});
 next.revision++;
 return {state:next};
}});
const proof={schemaVersion:'ROOT_SOURCE3_QUALITY_CLOSED_CURRENT_V1',runId:run,examUid:uid,authority:'ROOT_DELEGATED_CURRENT_EXECUTION',worktreeRootAbsolute:root,expectedHead:gitHead,source:{path:source,sha256:expectedRaw},assetRootAbsolute:assetRoot,currentFull25StageReports:snapshots,assetSnapshots:assets,historicalPreserved:{heldQids:[1,10],records:retained},priorRecoveryStatus:'AUTHORING',newRecoveryStatus:'QUALITY_CLOSED_CURRENT',dispatcher:{path:stateFile,sha256:transition.stateRef.sha256,revision:transition.revision,nextStage:'R3',r3SlotClaimed:false},r3Assignment:{path:assignmentPath,sha256:physical(assignmentPath).sha256},captureRunner:{path:captureRunner,sha256:physical(captureRunner).sha256},approvedEngine:{path:engine,sha256:physical(engine).sha256},approvedCurrentCss:{path:css,sha256:physical(css).sha256},actualRenderPerformed:false,qualityVerdictAsserted:false};
writeFresh(reportPath,proof);
console.log(JSON.stringify({status:'QUALITY_CLOSED_CURRENT',uid,sourceSha256:expectedRaw,dispatcher:transition.stateRef,assignment:physical(assignmentPath),proof:physical(reportPath),captureRunner:physical(captureRunner),assets,stages:snapshots.map(s=>({stage:s.stage,reportSha256:s.report.sha256,disposition:s.report.disposition,denominator:s.report.denominator,itemHoldCount:s.evidence.itemHoldCount}))},null,2));


