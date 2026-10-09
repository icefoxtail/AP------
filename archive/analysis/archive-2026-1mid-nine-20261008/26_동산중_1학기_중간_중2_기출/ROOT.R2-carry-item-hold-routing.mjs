import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL, fileURLToPath} from 'node:url';

const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const runId='archive-2026-1mid-nine-20261008';
const examUid='26_동산중_1학기_중간_중2_기출';
const nextRosterTarget='26_왕운중_1학기_중간_중2_기출';
const heldQids=[19,20,21];
const freshFullInputReviewQids=[19,20,21];
const rawR2UncomparedQids=[20,21];
const expectedIssues=['R2_COMPARE_REQUIRED:q20','R2_VERDICT_REQUIRED:q20','R2_COMPARE_REQUIRED:q21','R2_VERDICT_REQUIRED:q21'];
const expectedRawSha='82c9f8a8a39ba22b644a18f9786cf50b90c1573edbb3b621fe0d4df1a3023186';
const expectedBlobSha='ae7cc2a4e77727d779c39fcc62f8d5393f193bc4';
const runRoot=path.join(root,'archive','analysis',runId);
const evidenceRoot=path.join(runRoot,examUid);
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
if(packet.schemaVersion!=='ROOT_SOURCE_HOLD_TECHNICAL_CARRY_CONTINUATION_V1'||packet.runId!==runId||packet.examUid!==examUid||packet.stage!=='R2'||packet.firstMissingClosureStep!=='TECHNICAL_POST_R2_SOURCE_ITEM_HOLD_RECOVERY_ROUTING')fail('CONTINUATION_IDENTITY_OR_STEP_MISMATCH');
if(path.resolve(packet.worktreeRootAbsolute)!==path.resolve(root)||packet.expectedHead!==execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim())fail('ROOT_OR_HEAD_MISMATCH');
if(packet.artifactRawSha256!==expectedRawSha||packet.finalArtifactSha!==expectedBlobSha||packet.expectedDenominator!==24||packet.qualityPassAsserted!==false||!exact(packet.heldQids,heldQids)||!exact(packet.rawR2UncomparedQids,rawR2UncomparedQids)||packet.q19R2Disposition!=='CURRENT_TEXT_MATH_MATCH_ONLY_ORIGINAL_DIAGRAM_FIDELITY_HOLD_NOT_RELEASED'||!exact(packet.knownInvalidOriginalR1MathFreezeQids,[19])||!exact(packet.futureFreshFullInputReviewRequiredQids,freshFullInputReviewQids)||packet.retainedSession!=='r2_08'||packet.nextStage!=='ROOT_ITEM_RECOVERY'||packet.freedSlot!=='R2'||packet.nextRosterTarget!==nextRosterTarget||packet.nextRosterDependency!=='R1_COMPLETE_REQUIRED')fail('CONTINUATION_SCOPE_MISMATCH');
const sourcePath=path.resolve(packet.workingJsAbsolute),sourceBytes=fs.readFileSync(sourcePath),sourceRawSha=sha(sourceBytes),sourceBlob=execFileSync('git',['-C',root,'hash-object','--',sourcePath],{encoding:'utf8'}).trim();
if(sourceRawSha!==expectedRawSha||sourceBlob!==expectedBlobSha)fail('SOURCE_RAW_OR_BLOB_SHA_MISMATCH');
const proofRows=[];
for(const item of packet.proofs){if(!item.path||!fs.existsSync(item.path)||fileSha(item.path)!==item.sha256)fail('ASSIGNED_PROOF_SHA_MISMATCH:'+item.name);proofRows.push({name:item.name,path:path.resolve(item.path),sha256:item.sha256});}
for(const [name,expected] of [['ROOT.R2-hold-carry.continuation.json','a156bdb418317f6194dc77a1253a9daadc7c924a9859e5f594e22ea6f11e7b19'],['R2.assignment.json','70c2c65032531494816e3b8326fceeb31de70331a72cd8329312958b5b9aca78'],['R2.evidence.json','58a45ad91972575b5a071ecfaee98a0d3028fe07de0f572815207929b7b0915e'],['R2.generic-validation.json','eb9ae387bbba3177335316aad64f61302adabb0c8cac1afe5cce1a187dee2a9a'],['R2.original-freeze.json','1d4cd12fbf9e420ba013fc7016e84a4ea63245e901b829cc1be2b5c71fc0318e'],['R2.postfreeze-solvable-scope.json','10a72a4b80c5ce030a07c0af3b048c2c1d3eeb079330dc6ec917e39be7dfd7f3'],['review/R1.q19-input-repair-assessment.json','c1d82976210f9f4e676cec4fc9b0679e47515d51355508ef54c53bb6fca2b1df'],['ROOT.R1-carry-item-hold-routing.receipt.json','3d50b4f666347702d7a6f7ff8ffc382e9876f709bdc022b93650fca45b2a658b']]){
  const file=path.join(evidenceRoot,name),actual=fileSha(file);
  if(actual!==expected)fail('EXPECTED_EVIDENCE_SHA_MISMATCH:'+name);
  if(!proofRows.some(row=>row.name===name))proofRows.push({name,path:file,sha256:actual});
}
const reportPath=path.join(evidenceRoot,'R2.generic-validation.json'),report=read(reportPath),r2EvidencePath=path.join(evidenceRoot,'R2.evidence.json'),r2Evidence=read(r2EvidencePath);
if(report.ok!==false||report.disposition!=='FAIL'||report.stage!=='R2'||report.examUid!==examUid||report.artifactSha!==expectedBlobSha||report.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||report.executionLine!=='CODEX'||report.denominator!==24||report.rowCount!==24||!exact(report.issues,expectedIssues)||report.artifactContract?.disposition!=='PASS'||!exact(report.artifactContract?.issues,[])||report.common?.commonValid!==true||!exact(report.common?.issues,[])||report.technicalBinding?.source?.sha256!==expectedRawSha||report.technicalBinding?.source?.rawBufferGitBlobSha1!==expectedBlobSha||report.technicalBinding?.evidence?.sha256!==fileSha(r2EvidencePath)||!exact(report.technicalBinding?.issues,[]))fail('R2_RAW_REPORT_NOT_EXACT_ALLOWLISTED_FAIL');
const expectedQids=Array.from({length:24},(_,index)=>index+1);
if(r2Evidence.stage!=='R2'||r2Evidence.examUid!==examUid||r2Evidence.artifactSha!==expectedBlobSha||r2Evidence.artifactRawSha256!==expectedRawSha||r2Evidence.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||r2Evidence.executionLine!=='CODEX'||!exact(r2Evidence.rows.map(row=>row.qid),expectedQids))fail('R2_EVIDENCE_IDENTITY_OR_DENOMINATOR_MISMATCH');
const q19=r2Evidence.rows.find(row=>row.qid===19),q20=r2Evidence.rows.find(row=>row.qid===20),q21=r2Evidence.rows.find(row=>row.qid===21);
if(q19?.compareResult!=='MATCH'||q19?.verdict!=='PASS_MATCH'||q20?.independentDecisionStatus!=='UNDETERMINED'||q20?.compareResult||q20?.verdict||q21?.independentDecisionStatus!=='UNDETERMINED'||q21?.compareResult||q21?.verdict)fail('R2_HELD_QID_SEMANTIC_BOUNDARY_MISMATCH');
const q19Assessment=read(path.join(evidenceRoot,'review','R1.q19-input-repair-assessment.json'));
if(q19Assessment.disposition!=='NO_SAFE_ORIGINAL_PIXEL_REPAIR_SOURCE_HOLD'||q19Assessment.visualAssessment?.cleanupPossible!==false||q19Assessment.visualAssessment?.printedPixelInvarianceProven!==false||q19Assessment.sourceInventory?.cleanUnmarkedFullPageOrOriginalScanLocated!==false||q19Assessment.assetOutcome?.newAssetCreated!==false)fail('Q19_SOURCE_FIDELITY_HOLD_NOT_PROVEN');
const freezePath=path.join(evidenceRoot,'R2.original-freeze.json'),postfreezePath=path.join(evidenceRoot,'R2.postfreeze-solvable-scope.json'),r1ReceiptPath=path.join(evidenceRoot,'ROOT.R1-carry-item-hold-routing.receipt.json');
const bridgeSha=fileSha(bridgePath),rosterPath=path.join(runRoot,'roster.json'),roster=read(rosterPath),rosterCanonicalSha=sha(Buffer.from(JSON.stringify(roster)));
if(roster.length!==9||sha(Buffer.from(JSON.stringify(roster)))!==rosterCanonicalSha)fail('LOCKED_ROSTER_INVALID');
const rosterIndex=roster.findIndex(row=>row.examUid===examUid),nextRoster=roster[rosterIndex+1],sourceRoster=roster[rosterIndex];
if(rosterIndex!==7||nextRoster?.examUid!==nextRosterTarget||sourceRoster.workingJsAbsolute.replaceAll('\\','/').toLowerCase()!==packet.workingJsAbsolute.replaceAll('\\','/').toLowerCase()||sourceRoster.assetRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.assetRootAbsolute.replaceAll('\\','/').toLowerCase()||sourceRoster.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase())fail('TARGET_OR_ROSTER_SOURCE_IDENTITY_MISMATCH');
if(fs.existsSync(proofPath)||fs.existsSync(receiptPath))fail('R2_CARRY_RECEIPT_ALREADY_EXISTS');
const dispatcher=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-dispatcher.mjs')));
const stateBefore=read(dispatcherPath),stateBeforeSha=fileSha(dispatcherPath),sourceJobBefore=stateBefore.jobs?.[examUid];
if(stateBefore.runId!==runId||!exact(stateBefore.roster,roster)||stateBefore.rosterSha256!==rosterCanonicalSha||sourceJobBefore?.nextStage!=='R2'||sourceJobBefore?.sessions?.R2!=='r2_08'||stateBefore.slots.R2?.examUid!==examUid||stateBefore.slots.R2?.sessionId!=='r2_08'||stateBefore.slots.CREATE?.examUid!==nextRosterTarget||stateBefore.slots.CREATE?.sessionId!=='create_09'||stateBefore.slots.R1!==null||stateBefore.slots.R3!==null||stateBefore.jobs[nextRosterTarget]?.nextStage!=='CREATE'||stateBefore.jobs[nextRosterTarget]?.sessions?.CREATE!=='create_09')fail('DISPATCHER_TARGET_OR_CONCURRENT_SLOT_MISMATCH');
const otherJobsBefore=structuredClone(stateBefore.jobs);delete otherJobsBefore[examUid];
const otherSlotsBefore=Object.fromEntries(Object.entries(stateBefore.slots).filter(([stage])=>stage!=='R2'));
const identity={
  schemaVersion:'JS_ARCHIVE_CODEX_R2_ITEM_HOLD_ROUTING_PROOF_V1',runId,examUid,stage:'R2',
  completedStep:'R2_FULL_QID_FREEZE_AND_COMPARISON_WITH_SOURCE_ITEM_HOLDS',firstMissingClosureStep:packet.firstMissingClosureStep,
  qualityPassAsserted:false,qualityStageDisposition:'FAIL_PRESERVED',carryStatus:'CARRY_ITEM_HOLD',
  authority:{current:'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md §§20,25',decision:'ROOT_DELEGATED'},
  source:{path:sourcePath,rawSha256:sourceRawSha,rawBufferGitBlobSha1:sourceBlob},
  assignment:{path:assignmentPath,sha256:fileSha(assignmentPath),expectedHead:packet.expectedHead,heldQids,rawR2UncomparedQids,freshFullInputReviewQids},
  originalR2Result:{evidencePath:r2EvidencePath,evidenceSha256:fileSha(r2EvidencePath),freezePath:freezePath,freezeSha256:fileSha(freezePath),postfreezeComparisonPath:postfreezePath,postfreezeComparisonSha256:fileSha(postfreezePath),rawReportPath:reportPath,rawReportSha256:fileSha(reportPath),disposition:'FAIL',issues:expectedIssues,qualityPassAsserted:false,coverage:{expected:24,observed:expectedQids}},
  qidDispositions:{q19:{currentTextMath:'MATCH',sourceFidelity:'HOLD_NOT_RELEASED',originalR1MathFreezeValid:false,sourceRecovery:'FAILED_PRINTED_TOPOLOGY_OVERLAPPED_BY_HANDWRITING'},q20:{r2IndependentDecision:'UNDETERMINED',storedAnswerExposedPrefreeze:false,comparisonAndVerdict:'REQUIRED'},q21:{r2IndependentDecision:'UNDETERMINED',storedAnswerExposedPrefreeze:false,comparisonAndVerdict:'REQUIRED'},combinedRecoveryScope:heldQids},
  q19SourceFidelityAssessment:{path:path.join(evidenceRoot,'review','R1.q19-input-repair-assessment.json'),sha256:fileSha(path.join(evidenceRoot,'review','R1.q19-input-repair-assessment.json')),disposition:q19Assessment.disposition,cleanupPossible:false,printedPixelInvarianceProven:false,cleanOriginalScanLocated:false},
  preservedPriorCarry:{path:r1ReceiptPath,sha256:fileSha(r1ReceiptPath),disposition:'R1_CARRY_ITEM_HOLD_PRESERVED'},
  lockedRoster:{path:rosterPath,sha256:fileSha(rosterPath),canonicalSha256:rosterCanonicalSha,targetIndex:rosterIndex,nextRosterTarget,nextRosterDependency:'R1_COMPLETE_REQUIRED'},
  dispatcher:{path:dispatcherPath,stateBeforeSha256:stateBeforeSha,revisionBefore:stateBefore.revision,retainedR2Session:'r2_08',freedSlot:'R2',preservedConcurrentCreate:{examUid:stateBefore.slots.CREATE.examUid,sessionId:stateBefore.slots.CREATE.sessionId}},
  untouchedJobsBeforeSha256:sha(Buffer.from(JSON.stringify(otherJobsBefore))),untouchedSlotsBeforeSha256:sha(Buffer.from(JSON.stringify(otherSlotsBefore))),
  assignedInputProofs:proofRows,bridge:{path:bridgePath,sha256:bridgeSha}
};
const proofSha=sha(Buffer.from(JSON.stringify(identity))),proof={...identity,receiptProofSha256:proofSha};
fs.writeFileSync(proofPath,JSON.stringify(proof,null,2)+'\n',{flag:'wx'});

// Bind the just-read dispatcher bytes immediately before the atomic transition.
if(fileSha(dispatcherPath)!==stateBeforeSha)fail('DISPATCHER_CHANGED_BEFORE_ATOMIC_TRANSITION');
const transition=dispatcher.transitionFile({stateFile:dispatcherPath,expectedStateSha256:stateBeforeSha,mutate:current=>{
  if(current.runId!==runId||current.revision!==stateBefore.revision||current.rosterSha256!==rosterCanonicalSha||current.jobs[examUid]?.nextStage!=='R2'||current.jobs[examUid]?.sessions?.R2!=='r2_08'||current.slots.R2?.examUid!==examUid||current.slots.R2?.sessionId!=='r2_08')fail('DISPATCHER_CHANGED_DURING_R2_CARRY');
  if(current.slots.CREATE?.examUid!==nextRosterTarget||current.slots.CREATE?.sessionId!=='create_09'||current.slots.R1!==null||current.slots.R3!==null)fail('CONCURRENT_SLOT_CHANGED_DURING_R2_CARRY');
  const next=structuredClone(current),job=next.jobs[examUid],at=new Date().toISOString(),elapsedMs=Math.max(0,Date.parse(at)-Date.parse(next.slots.R2.startedAt));
  job.nextStage='ROOT_ITEM_RECOVERY';
  job.rootRecovery={status:'WAIT_AUTHOR_SLOT',heldQids,sourceFirstMinimalRepairOrDirectReplacementByCREATE:true,freshFullInputReviewRequiredQids:freshFullInputReviewQids,r3ReleaseBlocked:true,standingAuthority:'CURRENT §20/§25',qualityPassAsserted:false};
  job.history.push({stage:'R2',sessionId:'r2_08',eventSha256:proofSha,elapsedMs,at,disposition:'CARRY_ITEM_HOLD_ROUTED',qualityPassAsserted:false,artifactSha:expectedBlobSha,receiptProofSha256:proofSha,heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues,q19CurrentTextMath:'MATCH_ONLY_SOURCE_FIDELITY_HOLD'});
  next.slots.R2=null;
  next.events.push({type:'ROOT_POST_R2_TRUE_HOLD_RECOVERY_QUEUED',examUid,stage:'R2',sessionId:'r2_08',receiptProofSha256:proofSha,artifactSha:expectedBlobSha,qualityPassAsserted:false,carryStatus:'CARRY_ITEM_HOLD',heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues,freedSlot:'R2',nextStage:'ROOT_ITEM_RECOVERY',nextRosterTarget,nextRosterDependency:'R1_COMPLETE_REQUIRED',at});
  next.revision++;
  return {state:next};
}});
const stateAfter=read(dispatcherPath),jobsAfter=structuredClone(stateAfter.jobs);delete jobsAfter[examUid];
const slotsAfter=Object.fromEntries(Object.entries(stateAfter.slots).filter(([stage])=>stage!=='R2'));
if(!exact(jobsAfter,otherJobsBefore)||!exact(slotsAfter,otherSlotsBefore)||stateAfter.slots.R2!==null||stateAfter.jobs[examUid]?.nextStage!=='ROOT_ITEM_RECOVERY'||stateAfter.jobs[examUid]?.sessions?.R2!=='r2_08'||stateAfter.jobs[examUid]?.rootRecovery?.status!=='WAIT_AUTHOR_SLOT'||stateAfter.revision!==stateBefore.revision+1)fail('POST_TRANSITION_SCOPE_OR_SLOT_INVARIANCE_FAILURE');
const receipt={...proof,receiptType:'JS_ARCHIVE_CODEX_R2_ITEM_HOLD_ROUTING_V1',qualityStageDisposition:'FAIL_PRESERVED',stageTransition:{from:'R2',to:'ROOT_ITEM_RECOVERY',freedSlot:'R2',retainedSessionId:'r2_08',nextRosterTarget,nextRosterDependency:'R1_COMPLETE_REQUIRED',nextDispatch:transition.nextDispatch},dispatcherAfter:{path:dispatcherPath,sha256:fileSha(dispatcherPath),revision:stateAfter.revision,transitionEvent:stateAfter.events.at(-1)},preservedConcurrentSlots:otherSlotsBefore};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'ROOT_ITEM_RECOVERY_QUEUED',proofPath,proofSha256:fileSha(proofPath),receiptPath,receiptSha256:fileSha(receiptPath),bridgePath,bridgeSha256:bridgeSha,dispatcherPath,dispatcherSha256:fileSha(dispatcherPath),revisionBefore:stateBefore.revision,revisionAfter:stateAfter.revision,sourceRawSha256:sourceRawSha,sourceBlobSha1:sourceBlob,rawR2ReportSha256:fileSha(reportPath),rawValidatorDisposition:'FAIL',issues:expectedIssues,qualityPassAsserted:false,heldQids,freshFullInputReviewQids,freedSlot:'R2',retainedSessionId:'r2_08',preservedConcurrentSlots:otherSlotsBefore,nextRosterTarget,nextRosterDependency:'R1_COMPLETE_REQUIRED',nextDispatch:transition.nextDispatch},null,2));
