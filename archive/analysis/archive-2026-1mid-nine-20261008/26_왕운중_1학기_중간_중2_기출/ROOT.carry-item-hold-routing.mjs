import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL, fileURLToPath} from 'node:url';

const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const runId='archive-2026-1mid-nine-20261008';
const examUid='26_왕운중_1학기_중간_중2_기출';
const expectedRawSha='941a83cfe9b45920765adbcd970542434b7f7dc677f7d593bb82aff43aa67c3a';
const expectedBlobSha='9e244fa8fdb7d28d4425ccb86ce4ecae9044c546';
const heldQids=[1,16];
const expectedIssues=[
  'ARTIFACT_VALUE_REQUIRED:solution:q1',
  'ARTIFACT_ANSWER_REQUIRED:q1',
  'ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q1',
  'ARTIFACT_SOLUTION_REQUIRED:q1',
  'ARTIFACT_VALUE_REQUIRED:solution:q16',
  'ARTIFACT_ANSWER_REQUIRED:q16',
  'ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q16',
  'ARTIFACT_SOLUTION_REQUIRED:q16'
];
const qids=Array.from({length:24},(_,i)=>i+1);
const qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const runRoot=path.join(root,'archive','analysis',runId);
const evidenceRoot=path.join(runRoot,examUid);
const packetPath=path.join(evidenceRoot,'ROOT.hold-carry.continuation.json');
const sourcePath=path.join(root,'.tmp','archive',runId,examUid,`${examUid}.js`);
const assetRoot=path.dirname(sourcePath);
const evidencePath=path.join(evidenceRoot,'CREATE.evidence.bound.final2.json');
const reportPath=path.join(evidenceRoot,'CREATE.validator.final2.raw.json');
const preflightPath=path.join(evidenceRoot,'CREATE.archive-create-preflight.final.raw.json');
const calibrationPath=path.join(evidenceRoot,'CREATE.calibration-preflight.json');
const reuseDecisionPath=path.join(evidenceRoot,'ROOT.existing-golden-render-reuse.decision.json');
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

if(!fs.existsSync(root)||execFileSync('git',['-C',root,'rev-parse','--show-toplevel'],{encoding:'utf8'}).trim().replaceAll('\\','/').toLowerCase()!==root.toLowerCase())fail('ASSIGNED_WORKTREE_ROOT_MISMATCH');
const head=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!=='044c41a26f5bed0708ad42709ed2932be314e55a')fail('ASSIGNED_HEAD_MISMATCH');
const packet=read(packetPath),evidence=read(evidencePath),report=read(reportPath),preflight=read(preflightPath),calibration=read(calibrationPath),reuseDecision=read(reuseDecisionPath),roster=read(rosterPath);
if(fileSha(packetPath)!=='dbaa397f594c96a1360e35a4d2efbaaf42ed067bc2c2c7bd335b7e1b887e7656')fail('CONTINUATION_PACKET_SHA_MISMATCH');
if(packet.schemaVersion!=='ROOT_SOURCE_HOLD_TECHNICAL_CARRY_CONTINUATION_V1'||packet.runId!==runId||packet.examUid!==examUid||packet.stage!=='CREATE'||packet.firstMissingClosureStep!=='TECHNICAL_CARRY_ITEM_HOLD_ROUTING')fail('CONTINUATION_IDENTITY_OR_STEP_MISMATCH');
if(path.resolve(packet.worktreeRootAbsolute)!==path.resolve(root)||packet.expectedHead!==head||path.resolve(packet.workingJsAbsolute)!==sourcePath||path.resolve(packet.assetRootAbsolute)!==assetRoot||path.resolve(packet.evidenceRootAbsolute)!==evidenceRoot)fail('ASSIGNED_ABSOLUTE_PATH_MISMATCH');
if(packet.inputArtifactSha!==expectedBlobSha||packet.finalArtifactSha!==expectedBlobSha||packet.expectedDenominator!==24||!exact(packet.heldQids,heldQids)||packet.qualityPassAsserted!==false||packet.rawValidatorDisposition!=='FAIL'||packet.nextStage!=='R1'||packet.freedSlot!=='CREATE'||packet.retainedCreateSession!=='create_09'||packet.sourceAssetsOriginalQualityEvidenceRegistryMutationForbidden!==true)fail('CONTINUATION_SCOPE_MISMATCH');
const rawSha=fileSha(sourcePath),blobSha=execFileSync('git',['-C',root,'hash-object','--',sourcePath],{encoding:'utf8'}).trim();
if(rawSha!==expectedRawSha||blobSha!==expectedBlobSha)fail('SOURCE_BYTES_CHANGED');
if(packet.artifactRawSha256!==rawSha.slice(0,-1)||packet.artifactRawSha256.length!==63)fail('CONTINUATION_RAW_SHA_ADJUDICATION_NOT_PREFIX_ONLY');
const evidenceSha=fileSha(evidencePath),reportSha=fileSha(reportPath),preflightSha=fileSha(preflightPath),calibrationSha=fileSha(calibrationPath),reuseDecisionSha=fileSha(reuseDecisionPath);
const expectedProofs=new Map([
  ['CREATE.evidence.bound.final2.json',evidenceSha],
  ['CREATE.validator.final2.raw.json',reportSha],
  ['CREATE.archive-create-preflight.final.raw.json',preflightSha],
  ['CREATE.calibration-preflight.json',calibrationSha],
  ['ROOT.existing-golden-render-reuse.decision.json',reuseDecisionSha]
]);
if(packet.proofs.length!==expectedProofs.size)fail('CONTINUATION_PROOF_SET_MISMATCH');
for(const p of packet.proofs)if(expectedProofs.get(p.name)!==p.sha256||path.resolve(p.path)!==path.join(evidenceRoot,p.name)||fileSha(p.path)!==p.sha256)fail('CONTINUATION_PROOF_SHA_MISMATCH:'+p.name);

if(evidence.stage!=='CREATE'||evidence.examUid!==examUid||evidence.executionLine!=='CODEX'||evidence.qualityContractVersion!==qualityContractVersion||evidence.artifactSha!==expectedBlobSha||evidence.artifactRawSha256!==expectedRawSha||!exact(evidence.itemHoldQids,heldQids)||!exact(evidence.rows.map(r=>r.qid).sort((a,b)=>a-b),qids))fail('CREATE_EVIDENCE_BINDING_OR_COVERAGE_MISMATCH');
if(!exact(evidence.rows.filter(r=>r.itemStatus==='HOLD').map(r=>r.qid).sort((a,b)=>a-b),heldQids)||evidence.rows.filter(r=>r.itemStatus!=='HOLD').length!==22)fail('CREATE_ITEM_HOLD_SCOPE_MISMATCH');
if(preflight.schemaVersion!=='JS_ARCHIVE_CREATE_PREFLIGHT_V1'||preflight.status!=='CARRY_ITEM_HOLD'||preflight.questionCount!==24||preflight.itemHoldCount!==2||!exact(preflight.holds.map(h=>h.qid),heldQids)||!exact(preflight.findings,[])||preflight.semanticApproval!==false||preflight.sourceMutation!==false||preflight.artifactRawSha256!==expectedRawSha||preflight.artifactSha!==expectedBlobSha)fail('CREATE_PREFLIGHT_SCOPE_MISMATCH');
if(report.ok!==false||report.disposition!=='FAIL'||report.stage!=='CREATE'||report.examUid!==examUid||report.artifactSha!==expectedBlobSha||report.qualityContractVersion!==qualityContractVersion||report.executionLine!=='CODEX'||report.denominator!==24||report.rowCount!==24||!exact(report.issues,expectedIssues)||report.artifactContract?.disposition!=='FAIL'||!exact(report.artifactContract?.issues,expectedIssues))fail('RAW_V2_FAIL_NOT_EXACT_ALLOWLISTED');
if(report.common?.commonValid!==true||!exact(report.common?.issues,[])||!exact(report.common?.expectedQids,qids)||!exact(report.common?.observedQids,qids)||!exact(report.technicalBinding?.issues,[])||report.technicalBinding?.source?.sha256!==rawSha||report.technicalBinding?.source?.rawBufferGitBlobSha1!==blobSha||path.resolve(report.technicalBinding?.source?.path)!==sourcePath||report.technicalBinding?.evidence?.sha256!==evidenceSha||path.resolve(report.technicalBinding?.evidence?.path)!==evidencePath)fail('COMMON_COVERAGE_OR_PHYSICAL_BINDING_MISMATCH');
const boundAssets=report.technicalBinding?.assets;
if(!Array.isArray(boundAssets)||boundAssets.length!==2||!exact(boundAssets.map(a=>a.ref).sort(),[
  `assets/images/${examUid}/q13.png`,
  `assets/images/${examUid}/q23.png`
].sort()))fail('CURRENT_STUDENT_ASSET_REF_SET_MISMATCH');
const currentAssetFiles=fs.readdirSync(path.join(assetRoot,'assets'),{recursive:true}).filter(p=>fs.statSync(path.join(assetRoot,'assets',p)).isFile()).map(p=>path.resolve(assetRoot,'assets',p)).sort();
const boundAssetPaths=boundAssets.map(a=>path.resolve(a.path)).sort();
if(!boundAssetPaths.every(p=>inside(assetRoot,p)&&currentAssetFiles.includes(p)))fail('BOUND_ASSET_OUTSIDE_OR_MISSING_FROM_CURRENT_ROOT');
const currentAssets=currentAssetFiles.map(p=>({path:p,sha256:fileSha(p),role:boundAssetPaths.includes(p)?'CURRENT_STUDENT_ASSET_BINDING':'EXISTING_UNBOUND_ASSET_ROOT_FILE'}));
for(const a of boundAssets)if(fileSha(a.path)!==a.sha256)fail('BOUND_ASSET_SHA_MISMATCH:'+a.ref);
const inputWitnesses=packet.inputs.map(i=>{if(!fs.existsSync(i.path)||fileSha(i.path)!==i.sha256||fs.statSync(i.path).size!==i.size)fail('LOCKED_SOURCE_INPUT_SHA_OR_SIZE_MISMATCH');return {path:path.resolve(i.path),sha256:i.sha256,size:i.size,role:'LOCKED_SOURCE_EVIDENCE_ONLY'};});
if(inputWitnesses.length!==4)fail('LOCKED_SOURCE_INPUT_COUNT_MISMATCH');
if(calibration.examUid!==examUid||calibration.stage!=='CREATE'||calibration.executionLine!=='CODEX'||calibration.qualityContractVersion!==qualityContractVersion||calibration.solutionQualityCalibration?.sampleReadBeforeWork!==true||calibration.solutionQualityCalibration?.calibrationStatus!=='PASS'||calibration.solutionQualityCalibration?.calibrationOrder!=='SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE')fail('REGISTERED_PREWORK_CALIBRATION_NOT_BOUND');
if(calibration.solutionQualityCalibration?.visualReuse?.disposition!=='REUSED_PRIOR_AUTHORIZED_CHROME_RASTER_OWN_VISUAL_READ'||calibration.solutionQualityCalibration?.visualReuse?.priorChromeExecutionClaimedByCurrentWorker!==false||reuseDecision.decisionAuthority!=='ROOT_DELEGATED'||reuseDecision.examUid!==examUid||reuseDecision.currentWorkerVisualReadStatus!=='PENDING'||reuseDecision.reportedBrowserDenial?.length===0)fail('AUTHORIZED_RASTER_REUSE_OR_BROWSER_REFUSAL_NOT_BOUND');
const rosterCanonicalSha=sha(Buffer.from(JSON.stringify(roster)));
if(roster.length!==9||sha(Buffer.from(JSON.stringify(roster)))!==rosterCanonicalSha)fail('LOCKED_ROSTER_NOT_NINE');
const rosterIndex=roster.findIndex(r=>r.examUid===examUid),rosterEntry=roster[rosterIndex];
if(rosterIndex!==8||rosterIndex!==roster.length-1||rosterEntry?.workingJsAbsolute.replaceAll('\\','/').toLowerCase()!==packet.workingJsAbsolute.replaceAll('\\','/').toLowerCase()||rosterEntry?.assetRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.assetRootAbsolute.replaceAll('\\','/').toLowerCase()||rosterEntry?.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase()!==packet.evidenceRootAbsolute.replaceAll('\\','/').toLowerCase())fail('LOCKED_ROSTER_TARGET_MISMATCH');
if(fs.existsSync(proofPath)||fs.existsSync(receiptPath))fail('CARRY_RECEIPT_ALREADY_EXISTS');

// Re-read shared state immediately before the only authorized dispatcher mutation.
const stateBefore=read(dispatcherPath),stateBeforeSha=fileSha(dispatcherPath),jobBefore=stateBefore.jobs?.[examUid];
if(stateBefore.runId!==runId||stateBefore.rosterSha256!==rosterCanonicalSha||!exact(stateBefore.roster,roster)||stateBefore.slots?.CREATE?.examUid!==examUid||stateBefore.slots?.CREATE?.sessionId!=='create_09'||stateBefore.slots?.R1!==null||jobBefore?.nextStage!=='CREATE'||jobBefore?.sessions?.CREATE!=='create_09'||jobBefore?.history?.length!==0)fail('CURRENT_DISPATCHER_NO_LONGER_SOURCE9_CREATE_READY');
if(stateBefore.usedSessionIds.includes('create_10')||stateBefore.usedSessionIds.includes('r1_09'))fail('EXPECTED_FRESH_SESSION_IDS_ALREADY_USED');
const unaffectedSlots=structuredClone(stateBefore.slots),unaffectedJobs=structuredClone(stateBefore.jobs);
delete unaffectedSlots.CREATE;
delete unaffectedJobs[examUid];
const bridgeSha=fileSha(bridgePath);
const identity={
  schemaVersion:'JS_ARCHIVE_CODEX_CARRY_ITEM_HOLD_ROUTING_PROOF_V1',runId,examUid,stage:'CREATE',
  completedStep:'CREATE_COMPLETE_WITH_SOURCE_ITEM_HOLDS',firstMissingClosureStep:'TECHNICAL_CARRY_ITEM_HOLD_ROUTING',
  qualityPassAsserted:false,qualityStageDisposition:'FAIL_PRESERVED',carryStatus:'CARRY_ITEM_HOLD',
  source:{path:sourcePath,rawSha256:rawSha,rawBufferGitBlobSha1:blobSha},
  continuationPacketRawShaAdjudication:{packetPath,packetSha256:fileSha(packetPath),originalPacketRawSha256:packet.artifactRawSha256,originalLength:packet.artifactRawSha256.length,verifiedCurrentRawSha256:rawSha,verifiedLength:rawSha.length,relation:'ORIGINAL_PACKET_VALUE_IS_EXACT_PREFIX_MISSING_FINAL_HEX_NIBBLE',authority:'RAW_SOURCE_BYTES_AND_CURRENT_RAW_V2_PHYSICAL_BINDING_AGREE; ORIGINAL PACKET PRESERVED'},
  sourceInputs:inputWitnesses,sourceEvidenceOnlyPolicy:{inputsAreSourceEvidenceOnly:true,studentAnswerOrSolutionNotUsedToClaimQualityPass:true},
  currentAssets:{root:assetRoot,files:currentAssets,boundRefs:boundAssets.map(a=>({ref:a.ref,path:path.resolve(a.path),sha256:a.sha256}))},
  evidence:{path:evidencePath,sha256:evidenceSha,qualityContractVersion,executionLine:'CODEX',expectedQids:qids,observedQids:evidence.rows.map(r=>r.qid).sort((a,b)=>a-b),heldQids},
  preflight:{path:preflightPath,sha256:preflightSha,status:'CARRY_ITEM_HOLD',findings:[],heldQids},
  rawValidatorReport:{path:reportPath,sha256:reportSha,validatorMode:'CREATE_V2_CODEX',disposition:'FAIL',issues:expectedIssues,commonDisposition:'PASS',commonQidCount:24,technicalBindingIssues:[]},
  calibration:{path:calibrationPath,sha256:calibrationSha,status:'PASS_PREWORK_CALIBRATION',sampleReadBeforeWork:true,visualDisposition:'REUSED_PRIOR_AUTHORIZED_CHROME_RASTER_OWN_VISUAL_READ',priorChromeExecutionClaimedByCurrentWorker:false},
  browserHistory:{decisionPath:reuseDecisionPath,decisionSha256:reuseDecisionSha,originalBrowserRefusalPreserved:true,newRenderingClaimed:false,targetExamRender:'NOT_RUN'},
  lockedRoster:{path:rosterPath,sha256:fileSha(rosterPath),canonicalSha256:rosterCanonicalSha,examIndex:rosterIndex,rosterCount:roster.length,nextNewRosterTarget:null},
  dispatcher:{path:dispatcherPath,stateBeforeSha256:stateBeforeSha,revisionBefore:stateBefore.revision,retainedCreateSession:'create_09',unaffectedSlotsBefore:unaffectedSlots,unaffectedJobsBefore:unaffectedJobs},
  nextRequiredAction:{stage:'R1',target:examUid,reviewMode:'fresh current-student-only bundle extraction by ROOT before R1/R2',heldQids,qualityStatus:'FAIL_PRESERVED'},
  afterRosterCreateAction:{authority:'ROOT_DIRECTED',examUid:'26_강남여고_1학기_중간_고2_대수',reason:'source3 post-R2 item recovery; not a new exam assignment'},
  authority:{current:'docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md §§20,25'},
  bridge:{path:bridgePath,sha256:bridgeSha}
};
const proofSha=sha(Buffer.from(JSON.stringify(identity)));
const proof={...identity,receiptProofSha256:proofSha};
fs.writeFileSync(proofPath,JSON.stringify(proof,null,2)+'\n',{flag:'wx'});

const dispatcherModule=await import(pathToFileURL(path.join(root,'archive','tools','archive-codex-dispatcher.mjs')));
const transition=dispatcherModule.transitionFile({stateFile:dispatcherPath,expectedStateSha256:stateBeforeSha,mutate:current=>{
  if(current.runId!==runId||current.rosterSha256!==rosterCanonicalSha||current.revision!==stateBefore.revision||current.slots.CREATE?.examUid!==examUid||current.slots.CREATE?.sessionId!=='create_09'||current.slots.R1!==null)fail('DISPATCHER_CHANGED_DURING_CARRY');
  if(current.jobs?.[examUid]?.nextStage!=='CREATE'||current.jobs?.[examUid]?.sessions?.CREATE!=='create_09'||current.jobs?.[examUid]?.history?.length!==0)fail('SOURCE9_CREATE_JOB_CHANGED_DURING_CARRY');
  const next=structuredClone(current),job=next.jobs[examUid],at=new Date().toISOString(),elapsedMs=Math.max(0,Date.parse(at)-Date.parse(next.slots.CREATE.startedAt));
  job.nextStage='R1';
  job.history.push({stage:'CREATE',sessionId:'create_09',eventSha256:proofSha,elapsedMs,at,disposition:'CARRY_ITEM_HOLD_ROUTED',qualityPassAsserted:false,artifactSha:blobSha,receiptProofSha256:proofSha,heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues});
  next.slots.CREATE=null;
  next.events.push({type:'CARRY_ITEM_HOLD_ROUTED',examUid,stage:'CREATE',sessionId:'create_09',receiptProofSha256:proofSha,artifactSha:blobSha,qualityPassAsserted:false,carryStatus:'CARRY_ITEM_HOLD',heldQids,rawValidatorDisposition:'FAIL',issues:expectedIssues,freedSlot:'CREATE',nextStage:'R1',nextStageTarget:examUid,nextRosterTarget:null,nextRosterDependency:'ROOT_DIRECTED_POST_R2_RECOVERY_ONLY',at});
  next.revision++;
  return {state:next};
}});
const stateAfter=read(dispatcherPath),nextDispatch=transition.nextDispatch.map(x=>({stage:x.stage,examUid:x.examUid}));
if(!exact(nextDispatch,[{stage:'R1',examUid}]))fail('POST_TRANSITION_R1_QUEUE_MISMATCH');
if(stateAfter.jobs[examUid]?.nextStage!=='R1'||stateAfter.slots.CREATE!==null||stateAfter.slots.R1!==null||stateAfter.revision!==stateBefore.revision+1)fail('POST_TRANSITION_TARGET_OR_SLOT_STATE_MISMATCH');
for(const [stage,slot] of Object.entries(unaffectedSlots))if(stage!=='CREATE'&&!exact(stateAfter.slots[stage],slot))fail('UNRELATED_SLOT_CHANGED:'+stage);
for(const [uid,job] of Object.entries(unaffectedJobs))if(!exact(stateAfter.jobs[uid],job))fail('UNRELATED_JOB_CHANGED:'+uid);
const receipt={...proof,receiptType:'JS_ARCHIVE_CODEX_CARRY_ITEM_HOLD_ROUTING_V1',qualityStageDisposition:'FAIL_PRESERVED',stageTransition:{from:'CREATE',to:'R1',freedSlot:'CREATE',retainedSessionId:'create_09',nextStageTarget:examUid,nextNewRosterTarget:null,nextDispatch,postRosterCreateAction:'ROOT_DIRECTED_RECOVERY_SOURCE3'},dispatcherAfter:{path:dispatcherPath,sha256:fileSha(dispatcherPath),revision:stateAfter.revision,transitionEvent:stateAfter.events.at(-1)}};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'TRANSPORT_READY',qualityPassAsserted:false,rawValidatorDisposition:'FAIL',issues:expectedIssues,source:{path:sourcePath,rawSha256:rawSha,rawBufferGitBlobSha1:blobSha},evidence:{path:evidencePath,sha256:evidenceSha},rawReport:{path:reportPath,sha256:reportSha},preflight:{path:preflightPath,sha256:preflightSha},calibration:{path:calibrationPath,sha256:calibrationSha},reuseDecision:{path:reuseDecisionPath,sha256:reuseDecisionSha,targetExamRender:'NOT_RUN'},assets:currentAssets,proof:{path:proofPath,sha256:fileSha(proofPath)},receipt:{path:receiptPath,sha256:fileSha(receiptPath)},bridge:{path:bridgePath,sha256:bridgeSha},dispatcher:{path:dispatcherPath,sha256:fileSha(dispatcherPath),revisionBefore:stateBefore.revision,revisionAfter:stateAfter.revision},freedCreateSlot:true,r1Queue:nextDispatch,afterRosterCreateAction:'ROOT_DIRECTED_RECOVERY_SOURCE3'},null,2));
