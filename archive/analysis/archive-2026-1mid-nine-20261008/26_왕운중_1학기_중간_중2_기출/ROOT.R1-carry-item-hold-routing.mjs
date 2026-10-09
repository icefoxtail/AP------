import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const packetPath=path.join(here,'ROOT.R1-hold-carry.continuation.json');
const packet=JSON.parse(fs.readFileSync(packetPath,'utf8'));
const root=path.resolve(packet.worktreeRootAbsolute);
const runId='archive-2026-1mid-nine-20261008';
const examUid='26_왕운중_1학기_중간_중2_기출';
const runRoot=path.join(root,'archive','analysis',runId);
const dispatcherPath=path.join(runRoot,'dispatcher.json');
const rosterPath=path.join(runRoot,'roster.json');
const evidenceRoot=path.resolve(packet.evidenceRootAbsolute);
const sourcePath=path.resolve(packet.workingJsAbsolute);
const assetRoot=path.resolve(packet.assetRootAbsolute);
const assignmentPath=path.join(evidenceRoot,'R1.assignment.json');
const evidencePath=path.join(evidenceRoot,'R1.evidence.source9.json');
const reportPath=path.join(evidenceRoot,'R1.validator.revision2.raw.source9.json');
const freezePath=path.join(evidenceRoot,'R1.original-freeze.source9.json');
const comparisonPath=path.join(evidenceRoot,'R1.postfreeze-comparison-revision2.source9.json');
const adjudicationPath=path.join(evidenceRoot,'R1.freeze-adjudication.source9.json');
const calibrationPath=path.join(evidenceRoot,'R1.calibration-preflight.source9.json');
const sequencePath=path.join(evidenceRoot,'R1.sequence-failure.source9.json');
const proofPath=path.join(evidenceRoot,'ROOT.R1-carry-item-hold-routing.proof.json');
const receiptPath=path.join(evidenceRoot,'ROOT.R1-carry-item-hold-routing.receipt.json');
const bridgePath=fileURLToPath(import.meta.url);
const qids=Array.from({length:24},(_,i)=>i+1);
const heldQids=[1,16];
const qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const expectedArtifactIssues=[
  'ARTIFACT_KNOWN_FAILED_REVIEW:q1',
  'ARTIFACT_VALUE_REQUIRED:solution:q1',
  'ARTIFACT_ANSWER_REQUIRED:q1',
  'ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q1',
  'ARTIFACT_SOLUTION_REQUIRED:q1',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q16',
  'ARTIFACT_VALUE_REQUIRED:solution:q16',
  'ARTIFACT_ANSWER_REQUIRED:q16',
  'ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q16',
  'ARTIFACT_SOLUTION_REQUIRED:q16'
];
const expectedIssues=[
  'R1_STORED_ANSWER_REQUIRED:q1',
  'R1_STORED_ANSWER_REQUIRED:q16',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q1',
  'ARTIFACT_VALUE_REQUIRED:solution:q1',
  'ARTIFACT_ANSWER_REQUIRED:q1',
  'ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q1',
  'ARTIFACT_SOLUTION_REQUIRED:q1',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q16',
  'ARTIFACT_VALUE_REQUIRED:solution:q16',
  'ARTIFACT_ANSWER_REQUIRED:q16',
  'ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q16',
  'ARTIFACT_SOLUTION_REQUIRED:q16'
];
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const physical=p=>({path:path.resolve(p),sha256:sha256(fs.readFileSync(p))});
const exact=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=s=>{throw Error(s)};

if(execFileSync('git',['-C',root,'rev-parse','--show-toplevel'],{encoding:'utf8'}).trim().replaceAll('\\','/').toLowerCase()!==root.replaceAll('\\','/').toLowerCase())fail('ASSIGNED_WORKTREE_ROOT_MISMATCH');
const head=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!=='b749bb5b4629caf941ecbec338b5091a45df9e64'||packet.expectedHead!==head)fail('ASSIGNED_HEAD_MISMATCH');
if(packet.schemaVersion!=='ROOT_SOURCE_HOLD_TECHNICAL_CARRY_CONTINUATION_V1'||packet.runId!==runId||packet.examUid!==examUid||packet.stage!=='R1'||packet.firstMissingClosureStep!=='TECHNICAL_CARRY_ITEM_HOLD_ROUTING')fail('CONTINUATION_IDENTITY_OR_STEP_MISMATCH');
if(path.resolve(packet.worktreeRootAbsolute)!==root||path.resolve(packet.evidenceRootAbsolute)!==evidenceRoot||path.resolve(packet.workingJsAbsolute)!==sourcePath||path.resolve(packet.assetRootAbsolute)!==assetRoot)fail('ASSIGNED_ABSOLUTE_PATH_MISMATCH');
if(packet.qualityPassAsserted!==false||packet.rawValidatorDisposition!=='FAIL'||packet.nextStage!=='R2'||packet.freedSlot!=='R1'||packet.retainedSession!=='r1_09'||!exact(packet.heldQids,heldQids)||packet.nextRosterTarget!=='ROOT_FIXED_ROSTER_COMPLETE_POST_R2_RECOVERY_PENDING'||packet.preservePreflightOrderFailures!==true||packet.sourceAssetsOriginalQualityEvidenceRegistryMutationForbidden!==true)fail('CONTINUATION_SCOPE_MISMATCH');
if(fs.existsSync(proofPath)||fs.existsSync(receiptPath))fail('R1_CARRY_OUTPUT_ALREADY_EXISTS');

const io=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-artifact-io.mjs')));
const dispatcher=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-dispatcher.mjs')));
const assignment=JSON.parse(fs.readFileSync(assignmentPath,'utf8'));
const evidence=JSON.parse(fs.readFileSync(evidencePath,'utf8'));
const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
const originalFreeze=JSON.parse(fs.readFileSync(freezePath,'utf8'));
const comparison=JSON.parse(fs.readFileSync(comparisonPath,'utf8'));
const adjudication=JSON.parse(fs.readFileSync(adjudicationPath,'utf8'));
const calibration=JSON.parse(fs.readFileSync(calibrationPath,'utf8'));
const sequenceFailure=JSON.parse(fs.readFileSync(sequencePath,'utf8'));
const assignmentSha=physical(assignmentPath).sha256;
if(assignment.stage!=='R1'||assignment.examUid!==examUid||assignment.runId!==runId||assignment.executionLine!=='CODEX'||assignment.qualityContractVersion!==qualityContractVersion)fail('ASSIGNMENT_IDENTITY_MISMATCH');
if(path.resolve(assignment.worktreeRootAbsolute)!==root||path.resolve(assignment.workingJsAbsolute)!==sourcePath||path.resolve(assignment.assetRootAbsolute)!==assetRoot||path.resolve(assignment.evidenceRootAbsolute)!==evidenceRoot)fail('ASSIGNMENT_PATH_BINDING_MISMATCH');
if(assignment.artifactRawSha256!==originalFreeze.sourceRawSha256||assignment.studentBundleSha256!==originalFreeze.studentBundle.sha256)fail('PRECORRECTION_ASSIGNMENT_FREEZE_BINDING_MISMATCH');

function readBindings(){
  const exam=io.readExam(sourcePath);
  const snapshot=io.artifactSnapshot({sourceFile:sourcePath,evidenceFile:evidencePath,assetRoot,questions:exam.questions});
  const sourceSha=sha256(exam.bytes),sourceBlob=exam.rawBufferGitBlobSha1;
  if(sourceSha!==packet.artifactRawSha256||sourceBlob!==packet.finalArtifactSha)fail('CURRENT_SOURCE_RAW_OR_BLOB_SHA_MISMATCH');
  if(snapshot.issues.length||snapshot.source.sha256!==sourceSha||snapshot.source.rawBufferGitBlobSha1!==sourceBlob)fail('CURRENT_ARTIFACT_SNAPSHOT_INVALID');
  if(evidence.stage!=='R1'||evidence.examUid!==examUid||evidence.artifactSha!==sourceBlob||evidence.artifactRawSha256!==sourceSha||evidence.qualityContractVersion!==qualityContractVersion||evidence.executionLine!=='CODEX'||evidence.rows?.length!==24)fail('R1_EVIDENCE_IDENTITY_OR_DENOMINATOR_MISMATCH');
  if(!exact(evidence.rows.map(r=>r.qid),qids))fail('R1_FULL_QID_COVERAGE_MISMATCH');
  const held=evidence.rows.filter(r=>r.verdict==='HOLD'||r.sourceItemStatus==='HOLD').map(r=>r.qid);
  if(!exact(held,heldQids))fail('R1_HELD_QID_SET_MISMATCH');
  if(report.ok!==false||report.disposition!=='FAIL'||report.stage!=='R1'||report.examUid!==examUid||report.artifactSha!==sourceBlob||report.qualityContractVersion!==qualityContractVersion||report.executionLine!=='CODEX'||report.denominator!==24||report.rowCount!==24||!exact(report.issues,expectedIssues)||report.artifactContract?.disposition!=='FAIL'||!exact(report.artifactContract?.issues,expectedArtifactIssues))fail('RAW_REPORT_NOT_EXACT_STRICT_ALLOWLIST_FAIL');
  if(report.common?.commonValid!==true||!exact(report.common?.issues,[])||!exact(report.common?.expectedQids,qids)||!exact(report.common?.observedQids,qids)||!exact(report.technicalBinding?.issues,[]))fail('COMMON_COVERAGE_OR_PHYSICAL_BINDING_MISMATCH');
  if(report.technicalBinding?.source?.sha256!==sourceSha||report.technicalBinding?.source?.rawBufferGitBlobSha1!==sourceBlob||path.resolve(report.technicalBinding?.source?.path)!==sourcePath||report.technicalBinding?.evidence?.sha256!==physical(evidencePath).sha256||path.resolve(report.technicalBinding?.evidence?.path)!==evidencePath)fail('RAW_REPORT_PHYSICAL_BINDING_MISMATCH');
  if(!exact(snapshot.assets.map(a=>({ref:a.ref,sha256:a.sha256})),report.technicalBinding?.assets?.map(a=>({ref:a.ref,sha256:a.sha256}))))fail('RAW_REPORT_ASSET_BINDING_MISMATCH');
  if(comparison.studentParity!=='EXACT'||comparison.sourceRawSha256!==sourceSha||comparison.originalFreezeSourceRawSha256!==originalFreeze.sourceRawSha256)fail('CURRENT_STUDENT_PARITY_OR_ORIGINAL_FREEZE_BINDING_MISMATCH');
  if(originalFreeze.schemaVersion!=='JS_ARCHIVE_IMMUTABLE_BLIND_FREEZE_V1'||originalFreeze.stage!=='R1'||originalFreeze.reviewerIdentity?.reviewerId!=='r1_09'||originalFreeze.sourceRawSha256!==assignment.artifactRawSha256||originalFreeze.bundleAdapterProvenance?.answersRead!==false||originalFreeze.bundleAdapterProvenance?.originalBundleMutated!==false)fail('ORIGINAL_FREEZE_PROVENANCE_MISMATCH');
  if(adjudication.schemaVersion!=='JS_ARCHIVE_FREEZE_ADJUDICATION_V1'||adjudication.originalFreezeMutated!==false||adjudication.corrections?.length!==1||adjudication.corrections[0]?.qid!==1||adjudication.corrections[0]?.correctedAnswer!=='HOLD')fail('SEPARATE_Q1_HOLD_ADJUDICATION_MISMATCH');
  if(sequenceFailure.schemaVersion!=='R1_SEQUENCE_FAILURE_V1'||sequenceFailure.preserved!==true||sequenceFailure.attemptStatus!=='FAILED_ORDER'||sequenceFailure.recovery!=='Actual registered Golden/Negative preflight then passed; only q6 solution locus was corrected and independently rechecked in the same session. No repeat independent math sweep.'||sequenceFailure.samplePreflightSha256!==physical(calibrationPath).sha256)fail('ORIGINAL_PREFLIGHT_ORDER_FAILURE_OR_Q6_CORRECTION_PROVENANCE_MISMATCH');
  return {exam,snapshot,sourceSha,sourceBlob,evidenceSha:physical(evidencePath).sha256,reportSha:physical(reportPath).sha256,held};
}
let bound=readBindings();
for(const p of packet.proofs){if(physical(p.path).sha256!==p.sha256)fail('CONTINUATION_INPUT_PROOF_SHA_MISMATCH:'+p.name);}
if(packet.proofs.length!==7)fail('CONTINUATION_INPUT_PROOF_COUNT_MISMATCH');
const roster=JSON.parse(fs.readFileSync(rosterPath,'utf8'));
const rosterSha=sha256(Buffer.from(JSON.stringify(roster)));
const targetIndex=roster.findIndex(r=>r.examUid===examUid);
const rosterEntry=roster[targetIndex];
if(roster.length!==9||targetIndex!==8||targetIndex!==roster.length-1||rosterEntry?.workingJsAbsolute.replaceAll('\\','/').toLowerCase()!==packet.workingJsAbsolute.replaceAll('\\','/').toLowerCase()||rosterEntry?.assetRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.assetRootAbsolute.replaceAll('\\','/').toLowerCase()||rosterEntry?.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase())fail('LOCKED_FINAL_ROSTER_TARGET_MISMATCH');

// Re-read all shared state immediately before the one authorized dispatcher transition.
const stateBefore=JSON.parse(fs.readFileSync(dispatcherPath,'utf8'));
const stateBeforeSha=physical(dispatcherPath).sha256;
const source3='26_강남여고_1학기_중간_고2_대수';
if(stateBefore.runId!==runId||stateBefore.revision!==74||stateBefore.rosterSha256!==rosterSha||!exact(stateBefore.roster,roster))fail('CURRENT_DISPATCHER_OR_ROSTER_MISMATCH');
if(stateBefore.slots.R1?.examUid!==examUid||stateBefore.slots.R1?.sessionId!=='r1_09'||stateBefore.jobs[examUid]?.nextStage!=='R1'||stateBefore.jobs[examUid]?.sessions.R1!=='r1_09'||stateBefore.slots.R2!==null)fail('CURRENT_SOURCE9_R1_SLOT_OR_R2_AVAILABILITY_MISMATCH');
if(stateBefore.slots.CREATE?.examUid!==source3||stateBefore.slots.CREATE?.sessionId!=='recovery_03')fail('SOURCE3_RECOVERY_CREATE_SLOT_CHANGED');
const slotsBefore=structuredClone(stateBefore.slots);
const jobsBefore=structuredClone(stateBefore.jobs);
const targetJobBefore=structuredClone(stateBefore.jobs[examUid]);
const eventCountBefore=stateBefore.events.length;

const transition=dispatcher.transitionFile({stateFile:dispatcherPath,expectedStateSha256:stateBeforeSha,mutate:current=>{
  if(current.runId!==runId||current.revision!==stateBefore.revision||current.rosterSha256!==rosterSha||!exact(current.roster,roster)||!exact(current.slots,slotsBefore)||!exact(current.jobs[examUid],targetJobBefore))fail('DISPATCHER_CHANGED_DURING_R1_CARRY');
  bound=readBindings();
  const carryIdentity={
    schemaVersion:'JS_ARCHIVE_CODEX_CARRY_R1_ITEM_HOLD_ROUTING_PROOF_V1',runId,examUid,stage:'R1',completedStep:'R1_FULL_REVIEW_WITH_SOURCE_ITEM_HOLDS',firstMissingClosureStep:'TECHNICAL_CARRY_ITEM_HOLD_ROUTING',exactReason:'Raw current-artifact R1 validator FAIL is restricted to q1 and q16 stored answer/solution/HOLD requirements; common and technical binding checks PASS, and all 24 qids are covered.',
    carryStatus:'CARRY_ITEM_HOLD',qualityPassAsserted:false,qualityStageDisposition:'FAIL_PRESERVED',
    source:{path:sourcePath,rawSha256:bound.sourceSha,rawBufferGitBlobSha1:bound.sourceBlob},
    assignment:{path:assignmentPath,sha256:assignmentSha,recordedExpectedHead:assignment.expectedHead,preCorrectionArtifactRawSha256:assignment.artifactRawSha256},
    continuation:{path:packetPath,sha256:physical(packetPath).sha256,expectedHead:packet.expectedHead},
    currentEvidence:{path:evidencePath,sha256:bound.evidenceSha,qualityContractVersion,executionLine:'CODEX',expectedQids:qids,observedQids:evidence.rows.map(r=>r.qid),heldQids},
    rawValidatorReport:{path:reportPath,sha256:bound.reportSha,disposition:'FAIL',issues:expectedIssues,commonDisposition:'PASS',commonQidCount:24,technicalBindingIssues:[]},
    sourceAndFreezeProvenance:{originalFreeze:{path:freezePath,sha256:physical(freezePath).sha256,immutable:true,answersReadBeforeFreeze:false},currentStudentComparison:{path:comparisonPath,sha256:physical(comparisonPath).sha256,studentParity:'EXACT'},separateQ1HoldAdjudication:{path:adjudicationPath,sha256:physical(adjudicationPath).sha256,originalFreezeMutated:false},preflightOrderFailure:{path:sequencePath,sha256:physical(sequencePath).sha256,preserved:true,attemptStatus:'FAILED_ORDER'},calibrationPreflight:{path:calibrationPath,sha256:physical(calibrationPath).sha256},q6SolutionOnlyCorrection:'Preserved same-session correction and locus recheck; no repeated independent math sweep.'},
    currentArtifactSnapshot:{assets:bound.snapshot.assets.map(({ref,path,sha256})=>({ref,path,sha256})),issues:bound.snapshot.issues},
    continuationInputProofs:packet.proofs.map(p=>({name:p.name,path:path.resolve(p.path),sha256:p.sha256})),
    lockedRoster:{path:rosterPath,sha256:physical(rosterPath).sha256,canonicalSha256:rosterSha,examIndex:targetIndex,rosterCount:roster.length,nextRosterTarget:packet.nextRosterTarget},
    dispatcher:{path:dispatcherPath,stateBeforeSha256:stateBeforeSha,revisionBefore:stateBefore.revision,retainedSessionId:'r1_09',slotsBefore},
    authority:{current:'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md §§20,25'},
    bridge:{path:bridgePath,sha256:physical(bridgePath).sha256}
  };
  const proofSha=sha256(Buffer.from(JSON.stringify(carryIdentity)));
  fs.writeFileSync(proofPath,JSON.stringify({...carryIdentity,receiptProofSha256:proofSha},null,2)+'\n',{flag:'wx'});
  const next=structuredClone(current),job=next.jobs[examUid],slot=next.slots.R1,at=new Date().toISOString();
  job.nextStage='R2';
  job.history.push({stage:'R1',sessionId:'r1_09',eventSha256:proofSha,elapsedMs:Math.max(0,Date.parse(at)-Date.parse(slot.startedAt)),at,disposition:'CARRY_ITEM_HOLD_ROUTED',qualityPassAsserted:false,artifactSha:bound.sourceBlob,receiptProofSha256:proofSha,heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues});
  next.slots.R1=null;
  next.events.push({type:'CARRY_ITEM_HOLD_ROUTED',examUid,stage:'R1',sessionId:'r1_09',receiptProofSha256:proofSha,artifactSha:bound.sourceBlob,qualityPassAsserted:false,carryStatus:'CARRY_ITEM_HOLD',heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues,freedSlot:'R1',nextStage:'R2',nextStageTarget:examUid,nextRosterTarget:packet.nextRosterTarget,at});
  next.revision++;
  return {state:next,proofSha};
}});
const stateAfter=JSON.parse(fs.readFileSync(dispatcherPath,'utf8'));
if(stateAfter.revision!==stateBefore.revision+1||stateAfter.slots.R1!==null||stateAfter.slots.R2!==null||!exact(stateAfter.slots.CREATE,slotsBefore.CREATE)||!exact(stateAfter.slots.R3,slotsBefore.R3)||stateAfter.jobs[examUid]?.nextStage!=='R2'||stateAfter.jobs[examUid]?.sessions.R1!=='r1_09'||stateAfter.jobs[examUid]?.sessions.R2!==undefined||stateAfter.events.length!==eventCountBefore+1)fail('POST_TRANSITION_SLOT_OR_JOB_MISMATCH');
for(const [stage,slot] of Object.entries(slotsBefore))if(stage!=='R1'&&!exact(stateAfter.slots[stage],slot))fail('UNRELATED_DISPATCH_SLOT_CHANGED:'+stage);
for(const [uid,job] of Object.entries(jobsBefore))if(uid!==examUid&&!exact(stateAfter.jobs[uid],job))fail('UNRELATED_DISPATCH_JOB_CHANGED:'+uid);
const actualDispatch=transition.nextDispatch.map(x=>({stage:x.stage,examUid:x.examUid}));
const expectedDispatch=[{stage:'R2',examUid}];
if(!exact(actualDispatch,expectedDispatch))fail('POST_TRANSITION_R2_QUEUE_MISMATCH');
const proof=JSON.parse(fs.readFileSync(proofPath,'utf8'));
const receipt={...proof,receiptType:'JS_ARCHIVE_CODEX_CARRY_R1_ITEM_HOLD_ROUTING_V1',qualityStageDisposition:'FAIL_PRESERVED',stageTransition:{from:'R1',to:'R2',freedSlot:'R1',retainedSessionId:'r1_09',nextStageTarget:examUid,nextRosterTarget:packet.nextRosterTarget,nextDispatch:expectedDispatch},dispatcherAfter:{path:dispatcherPath,sha256:physical(dispatcherPath).sha256,revision:stateAfter.revision,transitionEvent:stateAfter.events.at(-1)},preservedConcurrentSlots:Object.entries(slotsBefore).filter(([stage,value])=>stage!=='R1'&&value).map(([stage,value])=>({stage,...value}))};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'CLOSED',proofPath,proofSha256:physical(proofPath).sha256,receiptPath,receiptSha256:physical(receiptPath).sha256,bridgePath,bridgeSha256:physical(bridgePath).sha256,dispatcherPath,dispatcherSha256:physical(dispatcherPath).sha256,revisionBefore:stateBefore.revision,revisionAfter:stateAfter.revision,sourceRawSha256:bound.sourceSha,sourceRawBufferBlobSha1:bound.sourceBlob,evidenceSha256:bound.evidenceSha,rawReportSha256:bound.reportSha,assetCount:bound.snapshot.assets.length,heldQids,issues:expectedIssues,qualityPassAsserted:false,r1Freed:true,r2Queue:actualDispatch,preservedCreateSlot:stateAfter.slots.CREATE},null,2));