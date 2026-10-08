import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const runId='archive-2026-1mid-nine-20261008';
const examUid='26_동산중_1학기_중간_중2_기출';
const nextRosterTarget='26_왕운중_1학기_중간_중2_기출';
const heldQids=[19,20,21];
const expectedIssues=[
  'ARTIFACT_KNOWN_FAILED_REVIEW:q19',
  'ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q19',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q20',
  'ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q20',
  'ARTIFACT_KNOWN_FAILED_REVIEW:q21',
  'ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q21'
];
const qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const runRoot=path.join(root,'archive','analysis',runId);
const evidenceRoot=path.join(runRoot,examUid);
const packetPath=path.join(evidenceRoot,'ROOT.hold-carry.continuation.json');
const evidencePath=path.join(evidenceRoot,'CREATE.evidence.json');
const reportPath=path.join(evidenceRoot,'CREATE.generic-validator.json');
const dispatcherPath=path.join(runRoot,'dispatcher.json');
const rosterPath=path.join(runRoot,'roster.json');
const bridgePath=fileURLToPath(import.meta.url);
const proofPath=path.join(evidenceRoot,'ROOT.carry-item-hold-routing.proof.json');
const receiptPath=path.join(evidenceRoot,'ROOT.carry-item-hold-routing.receipt.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const fileSha=p=>sha(fs.readFileSync(p));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const exact=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=m=>{throw Error(m)};
const inside=(base,p)=>{const rel=path.relative(path.resolve(base),path.resolve(p));return rel!==''&&!rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel)};
const expectedRawSha='82c9f8a8a39ba22b644a18f9786cf50b90c1573edbb3b621fe0d4df1a3023186';
const expectedBlobSha='ae7cc2a4e77727d779c39fcc62f8d5393f193bc4';
const expectedAssetBindings=[
  {ref:'assets/images/26_동산중_1학기_중간_중2_기출/q23.png',sha256:'d3a2bb1fb85db755cfa0c9aa23c2203e777f3f2df77a353180bc4647a1176f8b'},
  {ref:'assets/images/26_동산중_1학기_중간_중2_기출/q24.png',sha256:'7ce0a861de4c893ba3e897fef72992508d98cb4efbe330f58938ea5e2fe21013'}
];
const packet=read(packetPath),evidence=read(evidencePath),report=read(reportPath),roster=read(rosterPath);
if(packet.schemaVersion!=='ROOT_SOURCE_HOLD_TECHNICAL_CARRY_CONTINUATION_V1'||packet.runId!==runId||packet.stage!=='CREATE'||packet.examUid!==examUid||packet.firstMissingClosureStep!=='TECHNICAL_CARRY_ITEM_HOLD_ROUTING') fail('CONTINUATION_IDENTITY_OR_STEP_MISMATCH');
if(path.resolve(packet.worktreeRootAbsolute)!==path.resolve(root)||packet.expectedHead!==execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()) fail('ROOT_OR_HEAD_MISMATCH');
if(packet.inputArtifactSha!==expectedBlobSha||packet.finalArtifactSha!==expectedBlobSha||packet.artifactRawSha256!==expectedRawSha||packet.qualityPassAsserted!==false||!exact(packet.heldQids,heldQids)||packet.expectedDenominator!==24||packet.nextStage!=='R1'||packet.freedSlot!=='CREATE'||packet.nextRosterTarget!==nextRosterTarget||packet.sourceTeacherMarkedEvidenceNotStudentInput!==true) fail('CONTINUATION_SCOPE_MISMATCH');
const sourcePath=path.resolve(packet.workingJsAbsolute),assetRoot=path.resolve(packet.assetRootAbsolute),evidenceRootPacket=path.resolve(packet.evidenceRootAbsolute);
if(!inside(root,sourcePath)||!inside(root,assetRoot)||!inside(root,evidenceRootPacket)||evidenceRootPacket!==path.resolve(evidenceRoot)) fail('ASSIGNED_PATH_OUTSIDE_OR_MISMATCH');
if(sourcePath!==path.resolve(root,'.tmp','archive',runId,examUid,`${examUid}.js`)||assetRoot!==path.dirname(sourcePath)) fail('WORKING_JS_OR_ASSET_ROOT_IDENTITY_MISMATCH');
const sourceRawSha=fileSha(sourcePath),sourceBlob=execFileSync('git',['-C',root,'hash-object','--',sourcePath],{encoding:'utf8'}).trim();
if(sourceRawSha!==expectedRawSha||sourceBlob!==expectedBlobSha) fail('SOURCE_RAW_OR_BLOB_SHA_MISMATCH');
const packetSha=fileSha(packetPath),evidenceSha=fileSha(evidencePath),reportSha=fileSha(reportPath);
if(packetSha!=='e95ed8424ea4d63deb095e99cc6449b1629d7f14aa4b2f85f5362e260e319248') fail('CONTINUATION_PACKET_SHA_MISMATCH');
for(const proof of packet.proofs){if(!proof.path||!fs.existsSync(proof.path)||fileSha(proof.path)!==proof.sha256)fail('PACKET_PROOF_SHA_MISMATCH:'+proof.name);}
const expectedQids=Array.from({length:24},(_,i)=>i+1),rowQids=evidence.rows?.map(row=>row.qid).sort((a,b)=>a-b);
if(evidence.stage!=='CREATE'||evidence.examUid!==examUid||evidence.artifactSha!==expectedBlobSha||evidence.artifactRawSha256!==expectedRawSha||evidence.qualityContractVersion!==qualityContractVersion||evidence.executionLine!=='CODEX'||evidence.itemHoldCount!==heldQids.length||!exact(rowQids,expectedQids)) fail('EVIDENCE_IDENTITY_OR_DENOMINATOR_MISMATCH');
if(!exact(evidence.rows.filter(row=>row.verdict==='HOLD').map(row=>row.qid).sort((a,b)=>a-b),heldQids)||evidence.rows.filter(row=>row.verdict!=='HOLD').length!==21) fail('EVIDENCE_HOLD_ROW_SCOPE_MISMATCH');
if(report.ok!==false||report.disposition!=='FAIL'||report.stage!=='CREATE'||report.examUid!==examUid||report.artifactSha!==expectedBlobSha||report.qualityContractVersion!==qualityContractVersion||report.executionLine!=='CODEX'||report.denominator!==24||report.rowCount!==24||!exact(report.issues,expectedIssues)||report.artifactContract?.disposition!=='FAIL'||!exact(report.artifactContract?.issues,expectedIssues)) fail('RAW_REPORT_NOT_EXACT_ALLOWLISTED_HOLD_FAIL');
if(report.common?.commonValid!==true||!exact(report.common?.issues,[])||!exact(report.common?.expectedQids,expectedQids)||!exact(report.common?.observedQids,expectedQids)||!exact(report.technicalBinding?.issues,[])||report.technicalBinding?.source?.sha256!==sourceRawSha||report.technicalBinding?.source?.rawBufferGitBlobSha1!==sourceBlob||path.resolve(report.technicalBinding?.source?.path)!==sourcePath||report.technicalBinding?.evidence?.sha256!==evidenceSha||path.resolve(report.technicalBinding?.evidence?.path)!==path.resolve(evidencePath)) fail('COMMON_COVERAGE_OR_PHYSICAL_BINDING_MISMATCH');
const assetBindings=report.technicalBinding?.assets;
if(!Array.isArray(assetBindings)||assetBindings.length!==expectedAssetBindings.length||!exact(assetBindings.map(({ref,sha256})=>({ref,sha256})),expectedAssetBindings)) fail('ASSET_BINDING_SET_MISMATCH');
const assets=assetBindings.map(a=>{const p=path.resolve(a.path);if(!inside(assetRoot,p)||!fs.existsSync(p)||fileSha(p)!==a.sha256)fail('ASSET_PATH_OR_SHA_MISMATCH:'+a.ref);return {ref:a.ref,path:p,sha256:fileSha(p),role:'CURRENT_STUDENT_ASSET_BINDING'};});
const actualAssetFiles=fs.readdirSync(path.join(assetRoot,'assets'),{recursive:true}).filter(p=>fs.statSync(path.join(assetRoot,'assets',p)).isFile()).map(p=>path.resolve(assetRoot,'assets',p)).sort();
const boundAssetPaths=assetBindings.map(a=>path.resolve(a.path)).sort();
if(!boundAssetPaths.every(p=>actualAssetFiles.includes(p))) fail('REPORT_BOUND_ASSET_MISSING_FROM_ASSIGNED_ASSET_ROOT');
const unreferencedAssetRootFiles=actualAssetFiles.filter(p=>!boundAssetPaths.includes(p)).map(p=>({path:p,sha256:fileSha(p),role:'EXISTING_UNBOUND_ROOT_FILE_EXCLUDED_FROM_CURRENT_STUDENT_BINDINGS'}));
const sourceInputs=packet.inputs.map(i=>{if(!fs.existsSync(i.path)||fileSha(i.path)!==i.sha256||fs.statSync(i.path).size!==i.size)fail('SOURCE_EVIDENCE_INPUT_SHA_OR_SIZE_MISMATCH:'+i.path);return {path:path.resolve(i.path),sha256:i.sha256,size:i.size,role:'SOURCE_EVIDENCE_ONLY_NOT_STUDENT_INPUT'};});
const rosterCanonicalSha=sha(Buffer.from(JSON.stringify(roster)));
if(roster.length!==9||sha(Buffer.from(JSON.stringify(roster)))!==rosterCanonicalSha)fail('LOCKED_ROSTER_UNAVAILABLE');
const stateBefore=read(dispatcherPath);
if(stateBefore.runId!==runId||!exact(stateBefore.roster,roster)||stateBefore.rosterSha256!==rosterCanonicalSha||rosterCanonicalSha!==sha(Buffer.from(JSON.stringify(stateBefore.roster)))) fail('LOCKED_ROSTER_MISMATCH');
const rosterIndex=roster.findIndex(r=>r.examUid===examUid),nextRoster=roster[rosterIndex+1],sourceRoster=roster[rosterIndex];
if(rosterIndex!==7||nextRoster?.examUid!==nextRosterTarget||sourceRoster.workingJsAbsolute.replaceAll('\\','/').toLowerCase()!==packet.workingJsAbsolute.replaceAll('\\','/').toLowerCase()||sourceRoster.assetRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.assetRootAbsolute.replaceAll('\\','/').toLowerCase()||sourceRoster.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase()) fail('TARGET_OR_ROSTER_SOURCE_IDENTITY_MISMATCH');
if(stateBefore.revision!==63||stateBefore.slots.CREATE?.examUid!==examUid||stateBefore.slots.CREATE?.sessionId!=='create_08'||stateBefore.jobs[examUid]?.nextStage!=='CREATE'||stateBefore.jobs[examUid]?.sessions?.CREATE!=='create_08'||stateBefore.jobs[examUid]?.history?.length!==0) fail('CREATE_SLOT_OR_JOB_IDENTITY_MISMATCH');
if(stateBefore.slots.R1!==null||stateBefore.slots.R2!==null||stateBefore.slots.R3?.examUid!=='26_팔마고_1학기_중간_고3_미적분2'||stateBefore.slots.R3?.sessionId!=='r3_07') fail('NON_TARGET_ACTIVE_SLOT_IDENTITY_MISMATCH');
if(stateBefore.usedSessionIds.includes('create_09')||stateBefore.usedSessionIds.includes('r1_08')) fail('EXPECTED_NEXT_SESSION_ID_ALREADY_USED');
if(fs.existsSync(proofPath)||fs.existsSync(receiptPath)) fail('CARRY_RECEIPT_ALREADY_EXISTS');
const stateBeforeSha=fileSha(dispatcherPath),bridgeSha=fileSha(bridgePath);
const identity={
  schemaVersion:'JS_ARCHIVE_CODEX_CARRY_ITEM_HOLD_ROUTING_PROOF_V1',runId,examUid,stage:'CREATE',
  completedStep:'CREATE_COMPLETE_COVERAGE_WITH_ITEM_HOLDS',firstMissingClosureStep:packet.firstMissingClosureStep,
  qualityPassAsserted:false,qualityStageDisposition:'FAIL_PRESERVED',carryStatus:'CARRY_ITEM_HOLD',
  source:{path:sourcePath,rawSha256:sourceRawSha,rawBufferGitBlobSha1:sourceBlob},
  sourceEvidenceInputs:sourceInputs,sourceEvidenceOnlyPolicy:{teacherMarkedEvidenceNotStudentInput:true,studentAnswerHintsProvidedPrefreeze:false},
  evidence:{path:evidencePath,sha256:evidenceSha,stage:'CREATE',rowCount:24,observedQids:expectedQids,heldQids,unheldCreateRows:21},
  rawValidatorReport:{path:reportPath,sha256:reportSha,disposition:'FAIL',issues:expectedIssues,commonDisposition:'PASS',commonQidCount:24,technicalBindingIssues:[]},
  currentStudentAssetBindings:assets,
  unreferencedAssetRootFiles,
  fullQidCoverage:{expected:24,observed:expectedQids},heldQids,unheldCreateQids:expectedQids.filter(qid=>!heldQids.includes(qid)),
  lockedRoster:{path:rosterPath,sha256:fileSha(rosterPath),canonicalSha256:rosterCanonicalSha,examIndex:rosterIndex,nextRosterTarget},
  dispatcher:{path:dispatcherPath,stateBeforeSha256:stateBeforeSha,revisionBefore:stateBefore.revision,retainedCreateSession:'create_08',preservedActiveR3:{examUid:stateBefore.slots.R3.examUid,sessionId:stateBefore.slots.R3.sessionId}},
  authority:{current:'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md §§20,25'},
  bridge:{path:bridgePath,sha256:bridgeSha}
};
const proofSha=sha(Buffer.from(JSON.stringify(identity)));
const proof={...identity,receiptProofSha256:proofSha};
fs.writeFileSync(proofPath,JSON.stringify(proof,null,2)+'\n',{flag:'wx'});
const dispatcherModule=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-dispatcher.mjs')));
const transition=dispatcherModule.transitionFile({stateFile:dispatcherPath,expectedStateSha256:stateBeforeSha,mutate:current=>{
  if(current.runId!==runId||current.rosterSha256!==rosterCanonicalSha||current.revision!==stateBefore.revision||current.slots.CREATE?.examUid!==examUid||current.slots.CREATE?.sessionId!=='create_08')fail('DISPATCHER_CHANGED_DURING_CARRY');
  if(current.slots.R1!==null||current.slots.R2!==null||current.slots.R3?.examUid!==stateBefore.slots.R3.examUid||current.slots.R3?.sessionId!==stateBefore.slots.R3.sessionId)fail('NON_TARGET_ACTIVE_SLOTS_CHANGED_DURING_CARRY');
  const next=structuredClone(current),job=next.jobs[examUid];
  if(job.nextStage!=='CREATE'||job.sessions.CREATE!=='create_08'||job.history.length!==0)fail('CREATE_JOB_CHANGED_DURING_CARRY');
  const at=new Date().toISOString(),elapsedMs=Math.max(0,Date.parse(at)-Date.parse(next.slots.CREATE.startedAt));
  job.nextStage='R1';
  job.history.push({stage:'CREATE',sessionId:'create_08',eventSha256:proofSha,elapsedMs,at,disposition:'CARRY_ITEM_HOLD_ROUTED',qualityPassAsserted:false,artifactSha:sourceBlob,receiptProofSha256:proofSha,heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues});
  next.slots.CREATE=null;
  next.events.push({type:'CARRY_ITEM_HOLD_ROUTED',examUid,stage:'CREATE',sessionId:'create_08',receiptProofSha256:proofSha,artifactSha:sourceBlob,qualityPassAsserted:false,carryStatus:'CARRY_ITEM_HOLD',heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues,freedSlot:'CREATE',nextStage:'R1',nextStageTarget:examUid,nextRosterTarget,at});
  next.revision++;
  return {state:next};
}});
const stateAfter=read(dispatcherPath),nextDispatch=transition.nextDispatch.map(x=>({stage:x.stage,examUid:x.examUid}));
const expectedDispatch=[{stage:'CREATE',examUid:nextRosterTarget},{stage:'R1',examUid}];
if(!exact(nextDispatch,expectedDispatch)) fail('POST_TRANSITION_DISPATCH_PLAN_MISMATCH');
if(stateAfter.jobs[examUid]?.nextStage!=='R1'||stateAfter.slots.CREATE!==null||stateAfter.slots.R1!==null||stateAfter.slots.R2!==null||stateAfter.slots.R3?.examUid!==stateBefore.slots.R3.examUid||stateAfter.slots.R3?.sessionId!==stateBefore.slots.R3.sessionId)fail('POST_TRANSITION_SLOT_OR_R3_MUTATION');
const receipt={...proof,receiptType:'JS_ARCHIVE_CODEX_CARRY_ITEM_HOLD_ROUTING_V1',qualityStageDisposition:'FAIL_PRESERVED',stageTransition:{from:'CREATE',to:'R1',freedSlot:'CREATE',retainedSessionId:'create_08',nextStageTarget:examUid,nextRosterTarget,nextDispatch},dispatcherAfter:{path:dispatcherPath,sha256:fileSha(dispatcherPath),revision:stateAfter.revision,transitionEvent:stateAfter.events.at(-1)}};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'TRANSPORT_READY',proofPath,proofSha256:fileSha(proofPath),receiptPath,receiptSha256:fileSha(receiptPath),bridgePath,bridgeSha256:bridgeSha,dispatcherPath,dispatcherSha256:fileSha(dispatcherPath),revisionBefore:stateBefore.revision,revisionAfter:stateAfter.revision,sourceRawSha256:sourceRawSha,sourceBlobSha1:sourceBlob,evidenceSha256:evidenceSha,rawReportSha256:reportSha,rosterSha256:fileSha(rosterPath),currentStudentAssetBindings:assets,sourceEvidenceInputCount:sourceInputs.length,coverage:{expected:24,observed:24,unheldQids:21,heldQids},rawValidatorDisposition:'FAIL',issues:expectedIssues,qualityPassAsserted:false,nextDispatch},null,2));
