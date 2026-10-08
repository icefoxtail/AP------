import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const packetPath=path.join(here,'ROOT.R1-hold-carry.continuation.json');
const packet=JSON.parse(fs.readFileSync(packetPath,'utf8'));
const root=path.resolve(packet.worktreeRootAbsolute);
const runRoot=path.join(root,'archive','analysis',packet.runId);
const examRoot=path.join(runRoot,packet.examUid);
const dispatcherPath=path.join(runRoot,'dispatcher.json');
const rosterPath=path.join(runRoot,'roster.json');
const assignmentPath=path.join(examRoot,'R1.assignment.json');
const sourcePath=path.resolve(packet.workingJsAbsolute);
const evidencePath=path.join(examRoot,'review','R1.evidence.bound.json');
const reportPath=path.join(examRoot,'review','R1.validation.raw.json');
const proofPath=path.join(examRoot,'ROOT.R1-carry-item-hold-routing.proof.json');
const receiptPath=path.join(examRoot,'ROOT.R1-carry-item-hold-routing.receipt.json');
const bridgePath=fileURLToPath(import.meta.url);
const expectedIssues=[
  'ARTIFACT_KNOWN_FAILED_REVIEW:q19',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q20',
  'ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q20',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q21',
  'ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q21'
];
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const physical=p=>({path:path.resolve(p),sha256:sha256(fs.readFileSync(p))});
const exact=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=s=>{throw Error(s)};
const expectedQids=Array.from({length:packet.expectedDenominator},(_,i)=>i+1);
const heldQids=[19,20,21];

if(path.resolve(process.cwd())!==root)fail('WORKTREE_CWD_MISMATCH');
if(packet.schemaVersion!=='ROOT_SOURCE_HOLD_TECHNICAL_CARRY_CONTINUATION_V1'||packet.runId!=='archive-2026-1mid-nine-20261008'||packet.examUid!=='26_동산중_1학기_중간_중2_기출'||packet.stage!=='R1'||packet.firstMissingClosureStep!=='TECHNICAL_CARRY_ITEM_HOLD_ROUTING')fail('CONTINUATION_IDENTITY_OR_STEP_MISMATCH');
if(packet.qualityPassAsserted!==false||packet.nextStage!=='R2'||packet.freedSlot!=='R1'||!packet.allowTransportOnlyNotFinalMathApproval||!exact(packet.heldQids,heldQids)||!exact(packet.knownInvalidMathFreezeQids,[19])||!exact(packet.futureFreshFullInputReviewRequiredQids,heldQids))fail('CONTINUATION_SCOPE_MISMATCH');
const actualHead=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(actualHead!==packet.expectedHead)fail('EXPECTED_HEAD_MISMATCH');
if(!sourcePath.startsWith(path.join(root,'.tmp','archive',packet.runId,packet.examUid)+path.sep)||path.resolve(packet.evidenceRootAbsolute)!==examRoot)fail('ASSIGNED_PATH_MISMATCH');
if(fs.existsSync(proofPath)||fs.existsSync(receiptPath))fail('R1_CARRY_OUTPUT_ALREADY_EXISTS');

const assignment=JSON.parse(fs.readFileSync(assignmentPath,'utf8'));
const assignmentSha=physical(assignmentPath).sha256;
if(assignment.stage!=='R1'||assignment.examUid!==packet.examUid||assignment.runId!==packet.runId||assignment.executionLine!=='CODEX'||assignment.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006')fail('ASSIGNMENT_IDENTITY_MISMATCH');
if(path.resolve(assignment.workingJsAbsolute)!==sourcePath||path.resolve(assignment.assetRootAbsolute)!==path.resolve(packet.assetRootAbsolute)||path.resolve(assignment.evidenceRootAbsolute)!==examRoot)fail('ASSIGNMENT_PATH_BINDING_MISMATCH');

const io=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-artifact-io.mjs')));
const dispatcher=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-dispatcher.mjs')));
function readBindings(){
  const exam=io.readExam(sourcePath);
  const evidence=JSON.parse(fs.readFileSync(evidencePath,'utf8'));
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
  const snapshot=io.artifactSnapshot({sourceFile:sourcePath,evidenceFile:evidencePath,assetRoot:packet.assetRootAbsolute,questions:exam.questions});
  const sourceSha=sha256(exam.bytes),sourceBlob=exam.rawBufferGitBlobSha1;
  if(sourceSha!==packet.artifactRawSha256||sourceBlob!==packet.finalArtifactSha||sourceSha!==packet.artifactRawSha256)fail('SOURCE_RAW_OR_BLOB_SHA_MISMATCH');
  if(snapshot.issues.length||snapshot.source.sha256!==sourceSha||snapshot.source.rawBufferGitBlobSha1!==sourceBlob)fail('CURRENT_ARTIFACT_SNAPSHOT_INVALID');
  if(!exact(snapshot.assets.map(a=>({ref:a.ref,sha256:a.sha256})),report.technicalBinding?.assets?.map(a=>({ref:a.ref,sha256:a.sha256}))))fail('RAW_REPORT_ASSET_BINDING_MISMATCH');
  const evidenceSha=physical(evidencePath).sha256,reportSha=physical(reportPath).sha256;
  if(evidenceSha!==packet.proofs.find(x=>x.name==='review/R1.evidence.bound.json')?.sha256||reportSha!==packet.proofs.find(x=>x.name==='review/R1.validation.raw.json')?.sha256)fail('BOUND_EVIDENCE_OR_REPORT_SHA_MISMATCH');
  if(evidence.stage!=='R1'||evidence.examUid!==packet.examUid||evidence.artifactSha!==packet.finalArtifactSha||evidence.artifactRawSha256!==sourceSha||evidence.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||evidence.executionLine!=='CODEX'||evidence.rows?.length!==24)fail('R1_EVIDENCE_IDENTITY_OR_DENOMINATOR_MISMATCH');
  if(!exact(evidence.rows.map(r=>r.qid),expectedQids))fail('R1_FULL_QID_COVERAGE_MISMATCH');
  const heldRows=evidence.rows.filter(r=>r.verdict==='HOLD'||r.sourceItemStatus==='HOLD').map(r=>r.qid);
  if(!exact(heldRows,heldQids))fail('R1_HELD_QID_SET_MISMATCH');
  const q19=evidence.rows.find(r=>r.qid===19),q20=evidence.rows.find(r=>r.qid===20),q21=evidence.rows.find(r=>r.qid===21);
  if(q19?.freezeScopeValidForMath!==false||q19?.axisEvidence?.QUESTION_LAYOUT?.disposition!=='SOURCE_VISUAL_OMITTED'||q20?.independentAnswer!=='UNDETERMINED'||q21?.independentAnswer!=='UNDETERMINED')fail('HELD_SCOPE_PROVENANCE_MISMATCH');
  if(report.ok!==false||report.disposition!=='FAIL'||report.stage!=='R1'||report.examUid!==packet.examUid||report.artifactSha!==packet.finalArtifactSha||report.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||report.executionLine!=='CODEX'||report.denominator!==24||report.rowCount!==24||!exact(report.issues,expectedIssues)||report.artifactContract?.disposition!=='FAIL'||!exact(report.artifactContract?.issues,expectedIssues))fail('RAW_REPORT_NOT_EXACT_HELD_ALLOWLIST_FAIL');
  if(report.common?.commonValid!==true||!exact(report.common?.issues,[])||!exact(report.common?.expectedQids,expectedQids)||!exact(report.common?.observedQids,expectedQids)||!exact(report.technicalBinding?.issues,[])||report.technicalBinding?.source?.sha256!==sourceSha||report.technicalBinding?.source?.rawBufferGitBlobSha1!==sourceBlob||report.technicalBinding?.evidence?.sha256!==evidenceSha)fail('COMMON_COVERAGE_OR_PHYSICAL_BINDING_MISMATCH');
  return {evidence,report,snapshot,sourceSha,sourceBlob,evidenceSha,reportSha,heldRows};
}
let bound=readBindings();
for(const p of packet.proofs){const actual=physical(p.path).sha256;if(actual!==p.sha256)fail('CONTINUATION_PROOF_SHA_MISMATCH:'+p.name);}
const roster=JSON.parse(fs.readFileSync(rosterPath,'utf8'));
const rosterSha=sha256(Buffer.from(JSON.stringify(roster)));
const targetIndex=roster.findIndex(r=>r.examUid===packet.examUid);
if(targetIndex<0||roster.length!==9||roster[targetIndex+1]?.examUid!==packet.nextRosterTarget||packet.nextRosterDependency!=='CREATE_COMPLETE_REQUIRED')fail('LOCKED_ROSTER_OR_NEXT_TARGET_MISMATCH');
const rosterTarget=roster[targetIndex];
if(path.resolve(rosterTarget.workingJsAbsolute)!==sourcePath||path.resolve(rosterTarget.assetRootAbsolute)!==path.resolve(packet.assetRootAbsolute)||path.resolve(rosterTarget.evidenceRootAbsolute)!==examRoot)fail('ROSTER_SOURCE_PATH_MISMATCH');

const stateBefore=JSON.parse(fs.readFileSync(dispatcherPath,'utf8'));
const stateBeforeSha=physical(dispatcherPath).sha256;
if(stateBefore.runId!==packet.runId||stateBefore.revision!==68||stateBefore.rosterSha256!==rosterSha||!exact(stateBefore.roster,roster))fail('DISPATCHER_OR_LOCKED_ROSTER_MISMATCH');
if(stateBefore.slots.R1?.examUid!==packet.examUid||stateBefore.slots.R1?.sessionId!=='r1_08'||stateBefore.jobs[packet.examUid]?.nextStage!=='R1'||stateBefore.jobs[packet.examUid]?.sessions.R1!=='r1_08'||stateBefore.slots.R2!==null)fail('R1_SLOT_OR_R2_AVAILABILITY_MISMATCH');
if(stateBefore.slots.CREATE?.examUid!==packet.nextRosterTarget||stateBefore.slots.CREATE?.sessionId!=='create_09')fail('CONCURRENT_CREATE_OWNER_MISMATCH');
const slotsBefore=structuredClone(stateBefore.slots);
const targetJobBefore=structuredClone(stateBefore.jobs[packet.examUid]);

const transition=dispatcher.transitionFile({stateFile:dispatcherPath,expectedStateSha256:stateBeforeSha,mutate:current=>{
  if(current.runId!==packet.runId||current.revision!==stateBefore.revision||current.rosterSha256!==rosterSha||!exact(current.roster,roster))fail('DISPATCHER_OR_ROSTER_CHANGED_DURING_CARRY');
  if(!exact(current.slots,slotsBefore)||!exact(current.jobs[packet.examUid],targetJobBefore))fail('TARGET_OR_CONCURRENT_SLOT_CHANGED_DURING_CARRY');
  if(current.slots.R1?.examUid!==packet.examUid||current.slots.R1?.sessionId!=='r1_08'||current.jobs[packet.examUid]?.nextStage!=='R1'||current.slots.R2!==null)fail('R1_SLOT_CHANGED_DURING_CARRY');
  bound=readBindings();
  const carryIdentity={schemaVersion:'JS_ARCHIVE_CODEX_CARRY_R1_ITEM_HOLD_ROUTING_PROOF_V1',runId:packet.runId,examUid:packet.examUid,stage:'R1',completedStep:packet.completedStep,firstMissingClosureStep:packet.firstMissingClosureStep,exactReason:packet.exactReason,carryStatus:'CARRY_ITEM_HOLD',qualityPassAsserted:false,source:{path:sourcePath,rawSha256:bound.sourceSha,rawBufferGitBlobSha1:bound.sourceBlob},assignment:{path:assignmentPath,sha256:assignmentSha,recordedExpectedHead:assignment.expectedHead},currentContinuation:{path:packetPath,sha256:physical(packetPath).sha256,expectedHead:packet.expectedHead},evidence:{path:evidencePath,sha256:bound.evidenceSha},rawValidatorReport:{path:reportPath,sha256:bound.reportSha,disposition:'FAIL',issues:expectedIssues,commonDisposition:'PASS',commonQidCount:24},currentArtifactSnapshot:{assets:bound.snapshot.assets.map(({ref,path,sha256})=>({ref,path,sha256})),issues:bound.snapshot.issues},freezeStatus:{originalFailedRunPreserved:true,knownInvalidMathFreezeQids:[19],futureFreshFullInputReviewRequiredQids:heldQids,q19OriginalDiagramPixelRecovery:packet.q19OriginalDiagramPixelRecovery},fullQidCoverage:{expected:24,observed:bound.evidence.rows.map(r=>r.qid)},heldQids,lockedRoster:{path:rosterPath,sha256:rosterSha,targetIndex,nextRosterTarget:packet.nextRosterTarget,nextRosterDependency:packet.nextRosterDependency},dispatcher:{path:dispatcherPath,stateBeforeSha256:stateBeforeSha,revisionBefore:stateBefore.revision,retainedSessionId:'r1_08',slotsBefore},authority:{current:'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md §§20,25'},bridge:{path:bridgePath,sha256:physical(bridgePath).sha256}};
  const proofSha=sha256(Buffer.from(JSON.stringify(carryIdentity)));
  fs.writeFileSync(proofPath,JSON.stringify({...carryIdentity,receiptProofSha256:proofSha},null,2)+'\n',{flag:'wx'});
  const next=structuredClone(current),job=next.jobs[packet.examUid],slot=next.slots.R1;
  job.nextStage='R2';
  const at=new Date().toISOString(),elapsedMs=Math.max(0,Date.parse(at)-Date.parse(slot.startedAt));
  job.history.push({stage:'R1',sessionId:'r1_08',eventSha256:proofSha,elapsedMs,at,disposition:'CARRY_ITEM_HOLD_ROUTED',qualityPassAsserted:false,artifactSha:packet.finalArtifactSha,receiptProofSha256:proofSha,heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues});
  next.slots.R1=null;
  next.events.push({type:'CARRY_ITEM_HOLD_ROUTED',examUid:packet.examUid,stage:'R1',sessionId:'r1_08',receiptProofSha256:proofSha,artifactSha:packet.finalArtifactSha,qualityPassAsserted:false,carryStatus:'CARRY_ITEM_HOLD',heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues,freedSlot:'R1',nextStage:'R2',nextStageTarget:packet.examUid,nextRosterTarget:packet.nextRosterTarget,nextRosterDependency:packet.nextRosterDependency,at});
  next.revision++;
  return {state:next,proofSha};
}});

const stateAfter=JSON.parse(fs.readFileSync(dispatcherPath,'utf8'));
if(stateAfter.slots.R1!==null||!exact(stateAfter.slots.CREATE,slotsBefore.CREATE)||stateAfter.slots.R2!==slotsBefore.R2||stateAfter.slots.R3!==slotsBefore.R3||stateAfter.jobs[packet.examUid]?.nextStage!=='R2'||stateAfter.jobs[packet.examUid]?.sessions.R1!=='r1_08')fail('POST_TRANSITION_SLOT_OR_JOB_MISMATCH');
const actualDispatch=transition.nextDispatch.map(x=>({stage:x.stage,examUid:x.examUid}));
const expectedDispatch=[{stage:'R2',examUid:packet.examUid}];
if(!exact(actualDispatch,expectedDispatch))fail('POST_TRANSITION_DISPATCH_PLAN_MISMATCH');
const proof=JSON.parse(fs.readFileSync(proofPath,'utf8'));
const receipt={...proof,receiptType:'JS_ARCHIVE_CODEX_CARRY_R1_ITEM_HOLD_ROUTING_V1',qualityStageDisposition:'FAIL_PRESERVED',stageTransition:{from:'R1',to:'R2',freedSlot:'R1',retainedSessionId:'r1_08',nextStageTarget:packet.examUid,nextRosterTarget:packet.nextRosterTarget,nextRosterDependency:packet.nextRosterDependency,nextDispatch:expectedDispatch},dispatcherAfter:{path:dispatcherPath,sha256:physical(dispatcherPath).sha256,revision:stateAfter.revision,transitionEvent:stateAfter.events.at(-1)},preservedConcurrentSlots:Object.entries(slotsBefore).filter(([stage,value])=>stage!=='R1'&&value).map(([stage,value])=>({stage,...value}))};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'CLOSED',receiptPath,receiptSha256:physical(receiptPath).sha256,proofPath,proofSha256:physical(proofPath).sha256,bridgePath,bridgeSha256:physical(bridgePath).sha256,dispatcherPath,dispatcherSha256:physical(dispatcherPath).sha256,revision:stateAfter.revision,sourceRawSha256:bound.sourceSha,sourceRawBufferBlobSha1:bound.sourceBlob,evidenceSha256:bound.evidenceSha,rawReportSha256:bound.reportSha,assignmentSha256:assignmentSha,assetCount:bound.snapshot.assets.length,heldQids,issues:expectedIssues,qualityPassAsserted:false,nextDispatch:actualDispatch},null,2));
