import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL, fileURLToPath} from 'node:url';

const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const runId='archive-2026-1mid-nine-20261008';
const examUid='26_왕운중_1학기_중간_중2_기출';
const heldQids=[1,16];
const expectedIssues=[
  'ARTIFACT_KNOWN_FAILED_REVIEW:q1','ARTIFACT_VALUE_REQUIRED:solution:q1','ARTIFACT_ANSWER_REQUIRED:q1','ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q1',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q16','ARTIFACT_VALUE_REQUIRED:solution:q16','ARTIFACT_ANSWER_REQUIRED:q16','ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q16'
];
const expectedRawSha='ac8667fbbbad6440389fe07647eb655301fe363e5d0dabde22ba44ae6470252d';
const expectedBlobSha='696a704a6be6763812fdda2495860ede90166faa';
const evidenceRoot=path.join(root,'archive','analysis',runId,examUid);
const runRoot=path.dirname(evidenceRoot);
const assignmentPath=path.join(evidenceRoot,'ROOT.R2-hold-carry.continuation.json');
const dispatcherPath=path.join(runRoot,'dispatcher.json');
const bridgePath=fileURLToPath(import.meta.url);
const proofPath=path.join(evidenceRoot,'ROOT.R2-carry-item-hold-routing.proof.json');
const receiptPath=path.join(evidenceRoot,'ROOT.R2-carry-item-hold-routing.receipt.json');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fileSha=file=>sha(fs.readFileSync(file));
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const exact=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=message=>{throw Error(message)};

const packet=read(assignmentPath);
const currentHead=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(packet.schemaVersion!=='ROOT_SOURCE_HOLD_TECHNICAL_CARRY_CONTINUATION_V1'||packet.runId!==runId||packet.examUid!==examUid||packet.stage!=='R2'||packet.firstMissingClosureStep!=='TECHNICAL_POST_R2_SOURCE_ITEM_HOLD_RECOVERY_ROUTING')fail('CONTINUATION_IDENTITY_OR_STEP_MISMATCH');
if(path.resolve(packet.worktreeRootAbsolute)!==path.resolve(root)||packet.expectedHead!==currentHead||packet.expectedHead!=='b749bb5b4629caf941ecbec338b5091a45df9e64')fail('ROOT_OR_HEAD_MISMATCH');
if(packet.artifactRawSha256!==expectedRawSha||packet.finalArtifactSha!==expectedBlobSha||packet.expectedDenominator!==24||packet.qualityPassAsserted!==false||!exact(packet.heldQids,heldQids)||!exact(packet.rawR2UncomparedQids,heldQids)||!exact(packet.futureFreshFullInputReviewRequiredQids,heldQids)||packet.retainedSession!=='r2_09'||packet.nextStage!=='ROOT_ITEM_RECOVERY'||packet.freedSlot!=='R2'||packet.nextRosterTarget!=='ROOT_FIXED_ROSTER_COMPLETE_POST_R2_RECOVERY_PENDING'||packet.originalSourceAssetsQualityEvidenceRegistryMutationForbidden!==true)fail('CONTINUATION_SCOPE_MISMATCH');
const sourcePath=path.resolve(packet.workingJsAbsolute);
const sourceBytes=fs.readFileSync(sourcePath);
const sourceRawSha=sha(sourceBytes);
const sourceBlob=execFileSync('git',['-C',root,'hash-object','--',sourcePath],{encoding:'utf8'}).trim();
if(sourceRawSha!==expectedRawSha||sourceBlob!==expectedBlobSha)fail('SOURCE_RAW_OR_BLOB_SHA_MISMATCH');
const assignedProofs=[];
for(const item of packet.proofs){if(!item.path||!fs.existsSync(item.path)||fileSha(item.path)!==item.sha256)fail('ASSIGNED_PROOF_SHA_MISMATCH:'+item.name);assignedProofs.push({name:item.name,path:path.resolve(item.path),sha256:item.sha256});}
const tempProofs=[];
for(const absolutePath of packet.additionalTempProofPaths){if(!fs.existsSync(absolutePath))fail('ASSIGNED_TEMP_PROOF_MISSING:'+absolutePath);tempProofs.push({path:path.resolve(absolutePath),sha256:fileSha(absolutePath)});}
if(fs.existsSync(proofPath)||fs.existsSync(receiptPath))fail('R2_CARRY_RECEIPT_ALREADY_EXISTS');

const reportPath=path.join(evidenceRoot,'R2.generic-rebound-raw.json');
const evidencePath=path.join(evidenceRoot,'R2.evidence.rebound.json');
const report=read(reportPath),evidence=read(evidencePath);
if(report.ok!==false||report.disposition!=='FAIL'||report.stage!=='R2'||report.examUid!==examUid||report.artifactSha!==expectedBlobSha||report.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||report.executionLine!=='CODEX'||report.denominator!==24||report.rowCount!==24||!exact(report.issues,expectedIssues)||report.common?.commonValid!==true||!exact(report.common?.issues,[])||report.technicalBinding?.source?.sha256!==expectedRawSha||report.technicalBinding?.source?.rawBufferGitBlobSha1!==expectedBlobSha||report.technicalBinding?.evidence?.sha256!==fileSha(evidencePath)||!exact(report.technicalBinding?.issues,[]))fail('R2_RAW_REPORT_NOT_EXACT_ALLOWLISTED_FAIL');
const qids=Array.from({length:24},(_,i)=>i+1);
if(evidence.stage!=='R2'||evidence.examUid!==examUid||evidence.artifactSha!==expectedBlobSha||evidence.currentSourceRawSha256!==expectedRawSha||evidence.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||evidence.executionLine!=='CODEX'||!exact(evidence.rows.map(row=>row.qid),qids)||!exact(evidence.artifactDispositions.rows.map(row=>row.qid),qids)||evidence.artifactDispositions.artifactSha!==expectedBlobSha)fail('R2_EVIDENCE_BINDING_OR_DENOMINATOR_MISMATCH');
const q1=evidence.rows.find(row=>row.qid===1),q16=evidence.rows.find(row=>row.qid===16);
if(q1?.blindAnswer!=='UNDETERMINED'||q1?.verdict!=='HOLD'||q1?.compareResult!=='SUSPICIOUS'||q16?.blindAnswer!=='UNDETERMINED'||q16?.verdict!=='HOLD'||q16?.compareResult!=='SUSPICIOUS')fail('HELD_QID_STATUS_MISMATCH');
const freezePath=path.resolve(packet.additionalTempProofPaths.find(p=>p.endsWith('R2.original-freeze.json')));
const postfreezePath=path.resolve(packet.additionalTempProofPaths.find(p=>p.endsWith('R2.postfreeze-solvable.json')));
const adjudicationPath=path.resolve(packet.additionalTempProofPaths.find(p=>p.endsWith('R2.adjudication.json')));
const freeze=read(freezePath),postfreeze=read(postfreezePath),adjudication=read(adjudicationPath);
if(freeze.sourceRawSha256!==expectedRawSha||freeze.reviewerIdentity?.reviewerId!=='r2_09'||freeze.bundleAdapterProvenance?.answersRead!==false||freeze.rows.find(row=>row.qid===1)?.independentAnswer!=='UNDETERMINED'||freeze.rows.find(row=>row.qid===16)?.independentAnswer!=='UNDETERMINED'||postfreeze.originalFreeze?.sha256!==fileSha(freezePath)||postfreeze.studentParity!=='EXACT'||adjudication.originalFreezeMutated!==false||!exact(adjudication.corrections.map(row=>row.qid),[3,6,22]))fail('ORIGINAL_FREEZE_OR_SEPARATE_ADJUDICATION_BINDING_MISMATCH');

const assetRoot=path.resolve(packet.assetRootAbsolute);
if(assetRoot!==path.resolve(path.dirname(sourcePath))||!path.isAbsolute(packet.workingJsAbsolute)||!path.isAbsolute(packet.assetRootAbsolute)||!path.isAbsolute(packet.evidenceRootAbsolute))fail('ASSIGNED_ABSOLUTE_PATH_BINDING_MISMATCH');
const assets=report.technicalBinding.assets.map(asset=>{
  const absolute=path.resolve(asset.path);
  if(!absolute.startsWith(assetRoot+path.sep)||!fs.existsSync(absolute)||fileSha(absolute)!==asset.sha256)fail('ASSET_SHA_OR_ROOT_MISMATCH:'+asset.ref);
  return {ref:asset.ref,path:absolute,sha256:asset.sha256};
});
const projectionDebt={artifactSha:evidence.artifactDispositions.artifactSha,rows:evidence.artifactDispositions.rows.map(row=>({qid:row.qid,metaDebtFields:row.metaDebtFields,metaDebtReason:row.metaDebtReason}))};

const dispatcher=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-dispatcher.mjs')));
const stateBefore=read(dispatcherPath),stateBeforeSha=fileSha(dispatcherPath),jobBefore=stateBefore.jobs?.[examUid];
if(stateBefore.runId!==runId||stateBefore.revision!==79||jobBefore?.nextStage!=='R2'||jobBefore?.sessions?.R2!=='r2_09'||stateBefore.slots.R2?.examUid!==examUid||stateBefore.slots.R2?.sessionId!=='r2_09')fail('DISPATCHER_R2_BINDING_MISMATCH');
if(stateBefore.slots.CREATE?.examUid!=='26_강남여고_1학기_중간_고2_대수'||stateBefore.slots.CREATE?.sessionId!=='recovery_03'||stateBefore.slots.R1?.examUid!=='26_강남여고_1학기_중간_고2_대수'||stateBefore.slots.R1?.sessionId!=='r1_03'||stateBefore.slots.R3!==null)fail('LIVE_CONCURRENT_RECOVERY_SLOT_MISMATCH');
const otherJobsBefore=structuredClone(stateBefore.jobs);delete otherJobsBefore[examUid];
const otherSlotsBefore=Object.fromEntries(Object.entries(stateBefore.slots).filter(([stage])=>stage!=='R2'));
const rosterPath=path.join(runRoot,'roster.json');
const originalReport={path:reportPath,sha256:fileSha(reportPath),disposition:'FAIL',issues:expectedIssues,qualityPassAsserted:false,coverage:{expected:24,observed:qids}};
const authority={current:'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md §§20,25',decision:'ROOT_DELEGATED'};
const payload={
  schemaVersion:'JS_ARCHIVE_CODEX_R2_ITEM_HOLD_ROUTING_PROOF_V1',runId,examUid,stage:'R2',
  completedStep:'R2_FULL_QID_FREEZE_AND_COMPARISON_WITH_SOURCE_ITEM_HOLDS',firstMissingClosureStep:packet.firstMissingClosureStep,
  qualityPassAsserted:false,qualityStageDisposition:'FAIL_PRESERVED',carryStatus:'CARRY_ITEM_HOLD',authority,
  source:{path:sourcePath,rawSha256:sourceRawSha,rawBufferGitBlobSha1:sourceBlob},
  assignment:{path:assignmentPath,sha256:fileSha(assignmentPath),expectedHead:currentHead,heldQids,rawR2UncomparedQids:heldQids,freshFullInputReviewRequiredQids:heldQids},
  originalR2Result:{evidencePath:evidencePath,evidenceSha256:fileSha(evidencePath),freezePath,freezeSha256:fileSha(freezePath),postfreezeComparisonPath:postfreezePath,postfreezeComparisonSha256:fileSha(postfreezePath),adjudicationPath,adjudicationSha256:fileSha(adjudicationPath),rawReport:originalReport,coverage:{expected:24,observed:qids}},
  qidDispositions:{q1:{independentDecision:'UNDETERMINED',sourceAnswerAndSolutionBlank:true,comparisonAndVerdict:'UNRESOLVED_HOLD',storedAnswerExposedPrefreeze:false},q16:{independentDecision:'UNDETERMINED',sourceAnswerAndSolutionBlank:true,comparisonAndVerdict:'UNRESOLVED_HOLD',storedAnswerExposedPrefreeze:false},q3q6q22:{separateAdjudicationsPreserved:true,adjudicationPath,sha256:fileSha(adjudicationPath),originalFreezeMutated:false}},
  existingProjectionDebt:{path:evidencePath,sha256:fileSha(evidencePath),artifactDispositions:projectionDebt,semanticReclassification:false},
  assignedProofs,tempProofs,assets,
  lockedRoster:{path:rosterPath,sha256:fileSha(rosterPath),targetIndex:8,nextRosterTarget:packet.nextRosterTarget,nextRosterDependency:packet.nextRosterTarget},
  dispatcher:{path:dispatcherPath,stateBeforeSha256:stateBeforeSha,revisionBefore:stateBefore.revision,retainedR2Session:'r2_09',freedSlot:'R2',preservedConcurrentSlots:otherSlotsBefore},
  untouchedJobsBeforeSha256:sha(Buffer.from(JSON.stringify(otherJobsBefore))),untouchedSlotsBeforeSha256:sha(Buffer.from(JSON.stringify(otherSlotsBefore))),
  sourceFirstMinimalRepairThenDirectReplacementRequired:true,futureFreshAffectedR1R2ReviewRequiredQids:heldQids,
  bridge:{path:bridgePath,sha256:fileSha(bridgePath)}
};
const proofDigest=sha(Buffer.from(JSON.stringify(payload)));
const proof={...payload,receiptProofSha256:proofDigest};
fs.writeFileSync(proofPath,JSON.stringify(proof,null,2)+'\n',{flag:'wx'});

if(fileSha(dispatcherPath)!==stateBeforeSha)fail('DISPATCHER_CHANGED_BEFORE_ATOMIC_TRANSITION');
const transition=dispatcher.transitionFile({stateFile:dispatcherPath,expectedStateSha256:stateBeforeSha,mutate:current=>{
  if(current.runId!==runId||current.revision!==stateBefore.revision||current.jobs[examUid]?.nextStage!=='R2'||current.jobs[examUid]?.sessions?.R2!=='r2_09'||current.slots.R2?.examUid!==examUid||current.slots.R2?.sessionId!=='r2_09')fail('DISPATCHER_CHANGED_DURING_R2_CARRY');
  if(current.slots.CREATE?.examUid!=='26_강남여고_1학기_중간_고2_대수'||current.slots.CREATE?.sessionId!=='recovery_03'||current.slots.R1?.examUid!=='26_강남여고_1학기_중간_고2_대수'||current.slots.R1?.sessionId!=='r1_03'||current.slots.R3!==null)fail('LIVE_RECOVERY_SLOT_CHANGED_DURING_R2_CARRY');
  const next=structuredClone(current),job=next.jobs[examUid],at=new Date().toISOString(),elapsedMs=Math.max(0,Date.parse(at)-Date.parse(next.slots.R2.startedAt));
  job.nextStage='ROOT_ITEM_RECOVERY';
  job.rootRecovery={status:'WAIT_AUTHOR_SLOT',heldQids,sourceFirstMinimalRepairThenDirectReplacementByCREATE:true,freshFullInputReviewRequiredQids:heldQids,qualityPassAsserted:false,standingAuthority:'CURRENT §20/§25'};
  job.history.push({stage:'R2',sessionId:'r2_09',eventSha256:proofDigest,elapsedMs,at,disposition:'CARRY_ITEM_HOLD_ROUTED',qualityPassAsserted:false,artifactSha:expectedBlobSha,receiptProofSha256:proofDigest,heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues});
  next.slots.R2=null;
  next.events.push({type:'ROOT_POST_R2_TRUE_HOLD_RECOVERY_QUEUED',examUid,stage:'R2',sessionId:'r2_09',receiptProofSha256:proofDigest,artifactSha:expectedBlobSha,qualityPassAsserted:false,carryStatus:'CARRY_ITEM_HOLD',heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues,freedSlot:'R2',nextStage:'ROOT_ITEM_RECOVERY',nextRosterTarget:packet.nextRosterTarget,nextRosterDependency:packet.nextRosterTarget,at});
  next.revision++;
  return {state:next};
}});
const stateAfter=read(dispatcherPath),jobsAfter=structuredClone(stateAfter.jobs);delete jobsAfter[examUid];
const slotsAfter=Object.fromEntries(Object.entries(stateAfter.slots).filter(([stage])=>stage!=='R2'));
if(!exact(jobsAfter,otherJobsBefore)||!exact(slotsAfter,otherSlotsBefore)||stateAfter.slots.R2!==null||stateAfter.jobs[examUid]?.nextStage!=='ROOT_ITEM_RECOVERY'||stateAfter.jobs[examUid]?.sessions?.R2!=='r2_09'||stateAfter.jobs[examUid]?.rootRecovery?.status!=='WAIT_AUTHOR_SLOT'||stateAfter.revision!==stateBefore.revision+1)fail('POST_TRANSITION_SCOPE_OR_SLOT_INVARIANCE_FAILURE');
const receipt={...proof,receiptType:'JS_ARCHIVE_CODEX_R2_ITEM_HOLD_ROUTING_V1',qualityStageDisposition:'FAIL_PRESERVED',stageTransition:{from:'R2',to:'ROOT_ITEM_RECOVERY',freedSlot:'R2',retainedSessionId:'r2_09',nextRosterTarget:packet.nextRosterTarget,nextDispatch:transition.nextDispatch},dispatcherAfter:{path:dispatcherPath,sha256:fileSha(dispatcherPath),revision:stateAfter.revision,transitionEvent:stateAfter.events.at(-1)},preservedConcurrentSlots:otherSlotsBefore};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'ROOT_ITEM_RECOVERY_QUEUED',proofPath,proofSha256:fileSha(proofPath),receiptPath,receiptSha256:fileSha(receiptPath),bridgePath,bridgeSha256:fileSha(bridgePath),dispatcherPath,dispatcherSha256:fileSha(dispatcherPath),revisionBefore:stateBefore.revision,revisionAfter:stateAfter.revision,sourceRawSha256:sourceRawSha,sourceBlobSha1:sourceBlob,rawR2ReportSha256:fileSha(reportPath),rawValidatorDisposition:'FAIL',issues:expectedIssues,qualityPassAsserted:false,heldQids,freshFullInputReviewRequiredQids:heldQids,freedSlot:'R2',retainedSessionId:'r2_09',preservedConcurrentSlots:otherSlotsBefore,nextRosterTarget:packet.nextRosterTarget,nextDispatch:transition.nextDispatch},null,2));
