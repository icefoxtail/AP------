const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = 'C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const dir = 'archive/analysis/archive-2026-1mid-nine-20261008/26_강남여고_1학기_중간_고2_대수';
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const physical = p => ({path:path.join(root,p),sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex')});
const old = read(`${dir}/R2.evidence.json`);
const oldFreeze = read(`${dir}/R2.original-freeze.json`);
const oldAdj = read(`${dir}/R2.freeze-adjudication.json`);
const oldPost = read(`${dir}/R2.postfreeze-qids-01-25.json`);
const oldAssetReads = read(`${dir}/R2.asset-reads.json`);
const recoveryAssignment = read(`${dir}/R2.scope-1,10@recovery-01.assignment.json`);
const recoveryFreeze = read(`${dir}/R2.scope-1,10@recovery-01.immutable-freeze.json`);
const recoveryAnswers = read(`${dir}/R2.scope-1,10@recovery-01.independent-answers.json`);
const rootPreimage = read(`${dir}/ROOT.recovery.non-target-preimage.json`);
const integrity = read(`${dir}/R1.recovery.non-target-current-integrity.json`);
const studentParity = read(`${dir}/R1.recovery.student-parity.json`);
const currentR1 = read(`${dir}/R1.recovery.integrated.evidence.final.json`);
const currentR1Report = read(`${dir}/R1.recovery.generic-validator.raw.json`);
const oldRows = new Map(old.rows.map(row => [Number(row.qid),row]));
const frozenRows = new Map(recoveryFreeze.rows.map(row => [Number(row.qid),row]));
const answerRows = new Map(recoveryAnswers.map(row => [Number(row.qid),row]));
const r1Rows = new Map(currentR1.rows.map(row => [Number(row.qid),row]));
const parityRows = new Map(studentParity.rows.map(row => [Number(row.qid),row]));
const objectRows = new Map(integrity.rows.map(row => [Number(row.qid),row]));
const recoveryQids = [1,10];
const unchangedQids = [2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
if(recoveryAssignment.expectedHead !== '2546400b50bb3762f286d66714a3c82d164410ce' || recoveryAssignment.artifactRawSha256 !== 'ee7f5dec997371cde114fab1c22bced3b9eda8bc29d9845f1f5cc554e8be973f') throw new Error('RECOVERY_ASSIGNMENT_IDENTITY_MISMATCH');
if(recoveryFreeze.sourceRawSha256 !== recoveryAssignment.artifactRawSha256 || recoveryFreeze.studentBundle.sha256 !== recoveryAssignment.studentBundleSha256) throw new Error('RECOVERY_FREEZE_BINDING_MISMATCH');
if(recoveryFreeze.rows.length !== 2 || JSON.stringify(recoveryFreeze.studentQidOrder) !== JSON.stringify(recoveryQids)) throw new Error('RECOVERY_FREEZE_SCOPE_MISMATCH');
if(currentR1.artifactRawSha256 !== recoveryAssignment.artifactRawSha256 || currentR1.artifactSha !== recoveryAssignment.validatorRawBufferBlobSha1 || currentR1Report.ok !== true || currentR1.itemHoldCount !== 0) throw new Error('CURRENT_R1_PASS_BINDING_REQUIRED');
if(rootPreimage.verdict !== 'TECHNICAL_HASH_ONLY_NO_QUALITY_JUDGMENT' || integrity.scope.canonicalObjectParity !== 'EXACT' || integrity.rows.length !== 23 || integrity.rows.some(row=>row.match!==true)) throw new Error('UNCHANGED_OBJECT_INVARIANCE_REQUIRED');
if(studentParity.coverage.currentQuestionCount !== 25 || studentParity.coverage.answersOrSolutionsRead !== false || studentParity.rows.length !== 25 || studentParity.rows.some(row=>row.studentFieldParity!=='EXACT')) throw new Error('CURRENT_FULL_STUDENT_PARITY_REQUIRED');
for(const qid of unchangedQids){
  const prior=oldRows.get(qid),r1=r1Rows.get(qid),proof=objectRows.get(qid),parity=parityRows.get(qid);
  if(!prior||!r1||!proof?.match||!parity||prior.compareResult!=='MATCH'||prior.verdict!=='PASS'||prior.itemStatus==='HOLD'||String(prior.storedAnswer)!==String(r1.storedAnswer)) throw new Error('UNCHANGED_DECISION_REUSE_MISMATCH:q'+qid);
}
for(const qid of recoveryQids){
  const frozen=frozenRows.get(qid),r1=r1Rows.get(qid),answer=answerRows.get(qid);
  if(!frozen||!r1||!answer||frozen.independentAnswer!==answer.independentAnswer||frozen.independentAnswer!==r1.storedAnswer||r1.itemStatus!=='PASS') throw new Error('RECOVERY_ANSWER_COMPARE_MISMATCH:q'+qid);
}
const postfreeze = {
  schemaVersion:'JS_ARCHIVE_R2_BOUNDED_RECOVERY_DISCLOSURE_V1',
  disposition:'VERIFIED_BOUNDED_QID_DISCLOSURE_WITH_EXACT_UNCHANGED_SCOPE_REUSE',
  examUid:recoveryAssignment.examUid,
  method:'Fresh recovery qids are compared after their immutable freeze against current R1 stored-answer fields. Unchanged qids reuse the prior full25 R2 freeze and postfreeze decisions under ROOT canonical-object preimage plus current R1 exact object/student parity proofs.',
  canonicalPostfreezeHelper:{invoked:false,reason:'The canonical helper requires the full current bank qid denominator; its qid-limited mode correctly rejects this two-qid recovery subset. No helper success is claimed.'},
  currentArtifact:{path:recoveryAssignment.workingJsAbsolute,rawSha256:recoveryAssignment.artifactRawSha256,rawBufferBlobSha1:recoveryAssignment.validatorRawBufferBlobSha1,gitCleanFilterBlobSha1:recoveryAssignment.gitCleanFilterBlobSha1},
  recoveryFreeze:{...physical(`${dir}/R2.scope-1,10@recovery-01.immutable-freeze.json`),sourceRawSha256:recoveryFreeze.sourceRawSha256,studentBundle:{path:recoveryFreeze.studentBundle.path,sha256:recoveryFreeze.studentBundle.sha256},reviewerIdentity:recoveryFreeze.reviewerIdentity,qids:recoveryFreeze.studentQidOrder},
  recoveryRows:recoveryQids.map(qid=>({qid,studentPayloadSha256:parityRows.get(qid).studentPayloadSha256,currentStudentPayloadSha256:parityRows.get(qid).currentStudentPayloadSha256,studentFieldParity:parityRows.get(qid).studentFieldParity,independentAnswer:frozenRows.get(qid).independentAnswer,currentR1StoredAnswer:r1Rows.get(qid).storedAnswer,compareResult:'MATCH'})),
  unchangedScope:{qids:unchangedQids,quantity:unchangedQids.length,canonicalObjectParity:'EXACT',studentPayloadParity:'EXACT',priorR2AnswerDecisionReuse:'EXACT',storedAnswerFieldParity:'EXACT',priorFull25Freeze:physical(`${dir}/R2.original-freeze.json`),priorPostfreeze:physical(`${dir}/R2.postfreeze-qids-01-25.json`),priorR2Evidence:physical(`${dir}/R2.evidence.json`),rootNonTargetPreimage:physical(`${dir}/ROOT.recovery.non-target-preimage.json`),currentObjectIntegrity:physical(`${dir}/R1.recovery.non-target-current-integrity.json`),currentStudentParity:physical(`${dir}/R1.recovery.student-parity.json`),exactObjectRows:integrity.rows.map(row=>({qid:row.qid,canonicalObjectSha256:row.currentCanonicalObjectSha256,match:row.match}))},
  currentR1Disclosure:{evidence:physical(`${dir}/R1.recovery.integrated.evidence.final.json`),genericReport:physical(`${dir}/R1.recovery.generic-validator.raw.json`),status:currentR1Report.disposition,denominator:currentR1Report.denominator,itemHoldCount:currentR1.itemHoldCount},
  preservedOriginalFreeze:{...physical(`${dir}/R2.original-freeze.json`),sourceRawSha256:oldFreeze.sourceRawSha256,unmodified:true},
  preservedOriginalAdjudication:{...physical(`${dir}/R2.freeze-adjudication.json`),originalFreezeMutated:oldAdj.originalFreezeMutated===false},
  reusedAssetReads:oldAssetReads
};
const rows = old.rows.map(prior=>{
  const qid=Number(prior.qid);
  if(recoveryQids.includes(qid)){
    const frozen=frozenRows.get(qid),a=answerRows.get(qid),r1=r1Rows.get(qid);
    return {qid,blindAnswer:frozen.independentAnswer,blindAnswerFrozenBeforeR1AndStoredAnswer:true,compareResult:'MATCH',verdict:'PASS',disposition:r1.finalDisposition,itemStatus:'PASS',holdReason:null,answerCardinality:1,independentReason:frozen.reasoning,storedAnswer:r1.storedAnswer,adjudicationApplied:false,currentRecoveryFreeze:{path:recoveryFreeze.studentBundle.path,freezePath:recoveryAssignment.evidenceRootAbsolute+'/R2.scope-1,10@recovery-01.immutable-freeze.json',freezeSha256:postfreeze.recoveryFreeze.sha256,boundedDisclosurePath:recoveryAssignment.evidenceRootAbsolute+'/R2.recovery-integrated.bounded-disclosure.json'},currentStudentPayloadSha256:parityRows.get(qid).currentStudentPayloadSha256};
  }
  const proof=objectRows.get(qid);
  return {...prior,reusedDecisionProvenance:{scope:'EXACT_UNCHANGED_ORIGINAL_R2_DECISION_REUSE',originalFreeze:postfreeze.unchangedScope.priorFull25Freeze,originalPostfreeze:postfreeze.unchangedScope.priorPostfreeze,originalR2Evidence:postfreeze.unchangedScope.priorR2Evidence,currentCanonicalObjectSha256:proof.currentCanonicalObjectSha256,currentCanonicalObjectParity:'EXACT',currentStudentParity:'EXACT'}};
});
const evidence = {
  schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R2',examUid:recoveryAssignment.examUid,
  qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',
  artifactSha:recoveryAssignment.validatorRawBufferBlobSha1,artifactRawSha256:recoveryAssignment.artifactRawSha256,
  validatorRawBufferBlobSha1:recoveryAssignment.validatorRawBufferBlobSha1,gitCleanFilterBlobSha1:recoveryAssignment.gitCleanFilterBlobSha1,
  denominator:25,questionCount:25,source:currentR1.source,reviewerIdentity:{role:'archive_r2',reviewerId:'r2_03'},
  recoveryIntegrated:true,source3PostRecovery:true,
  sourceIdentity:{path:recoveryAssignment.workingJsAbsolute,rawSha256:recoveryAssignment.artifactRawSha256,rawBufferBlobSha1:recoveryAssignment.validatorRawBufferBlobSha1},
  originalFull25R2:{evidence:physical(`${dir}/R2.evidence.json`),freeze:physical(`${dir}/R2.original-freeze.json`),freezeAdjudication:physical(`${dir}/R2.freeze-adjudication.json`),postfreeze:physical(`${dir}/R2.postfreeze-qids-01-25.json`),originalValidator:physical(`${dir}/R2.generic-validator.raw.json`),priorItemHolds:[1,10],supersededByFreshRecoveryScope:[1,10],unchangedDecisionQids:unchangedQids},
  recoveryFreeze:postfreeze.recoveryFreeze,boundedPostfreezeDisclosure:null,
  currentStudentParity:{schemaVersion:studentParity.schemaVersion,proof:physical(`${dir}/R1.recovery.student-parity.json`),currentQuestionCount:25,exactQids:studentParity.coverage.exactStudentParityQids,answersOrSolutionsRead:studentParity.coverage.answersOrSolutionsRead},
  unchangedObjectInvariance:{rootPreimage:physical(`${dir}/ROOT.recovery.non-target-preimage.json`),currentIntegrity:physical(`${dir}/R1.recovery.non-target-current-integrity.json`),qids:unchangedQids,canonicalObjectParity:'EXACT'},
  currentR1:{evidence:physical(`${dir}/R1.recovery.integrated.evidence.final.json`),genericReport:physical(`${dir}/R1.recovery.generic-validator.raw.json`),status:currentR1Report.disposition,denominator:currentR1Report.denominator,itemHoldCount:currentR1.itemHoldCount},
  source:currentR1.source,assetBindings:currentR1.assetBindings,artifactDispositions:currentR1.artifactDispositions,
  rows,itemHoldCount:0,itemHolds:[],r2Coverage:{denominator:25,independentAnswerRows:25,comparedRows:25,freshRecoveryFreezeQids:recoveryQids,exactUnchangedDecisionReuseQids:unchangedQids,studentParity:'EXACT_COMPOSITE_CURRENT_SCOPE',canonicalPostfreezeHelperInvoked:false,heldQids:[]},
  renderStatus:'NOT_RUN_R3',nextRequiredStage:'R3'
};
const parityOut=path.join(root,dir,'R2.recovery-integrated.bounded-disclosure.json');
const evidenceOut=path.join(root,dir,'R2.recovery-integrated.evidence.json');
fs.writeFileSync(parityOut,JSON.stringify(postfreeze,null,2)+'\n',{flag:'wx'});
evidence.boundedPostfreezeDisclosure=physical(`${dir}/R2.recovery-integrated.bounded-disclosure.json`);
fs.writeFileSync(evidenceOut,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({boundedDisclosure:{path:parityOut,sha256:physical(`${dir}/R2.recovery-integrated.bounded-disclosure.json`).sha256},evidence:{path:evidenceOut,sha256:physical(`${dir}/R2.recovery-integrated.evidence.json`).sha256},qidCount:rows.length,heldQids:[],freshRecoveryQids:recoveryQids,reusedUnchangedQids:unchangedQids.length,sourceRawSha256:recoveryAssignment.artifactRawSha256}));
