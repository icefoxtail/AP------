import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root='C:/Users/USER/Desktop/AP------';
const run=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05');
const exam='18_효천고_1학기_중간_고2_확률과통계';
const evidence=path.join(run,exam),r2=path.join(evidence,'R2_20261012');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const oldBundle=JSON.parse(fs.readFileSync(path.join(r2,'R2.current-student.bundle.v2.json')));
const currentBundle=JSON.parse(fs.readFileSync(path.join(r2,'R2.current-student.bundle.rev2.json')));
if(oldBundle.qids.join(',')!==currentBundle.qids.join(',')||JSON.stringify(oldBundle.rows.map(r=>r.student))!==JSON.stringify(currentBundle.rows.map(r=>r.student)))throw Error('STATUS_META_ONLY_STUDENT_PARITY_FAIL');
const rootReceipt=path.join(evidence,'ITEM_RECOVERY_q12/ROOT_q12.status-meta-closeout.rev1.receipt.json');
const r1Evidence=path.join(evidence,'ITEM_RECOVERY_q12/R1_qid_review/R1_q12_evidence.status-meta.rev1.bound.json');
const r1Event=path.join(evidence,'ITEM_RECOVERY_q12/R1_qid_review/R1_q12_status_meta.complete.event.rev1.json');
const priorR2Evidence=path.join(r2,'R2.current-evidence.rev2.fixed.raw.json');
const priorR2Event=path.join(r2,'R2.complete.event.current.rev2.json');
const answerFreeze=path.join(r2,'R2.q12-original-freeze.rev1.json');
const answerCompare=path.join(r2,'R2.q12-answer-comparison.rev1.json');
const assignment={
 schemaVersion:'JS_ARCHIVE_CODEX_CURRENT_SOURCE_ASSIGNMENT_V1',runId:'codex-sourceonly-h2-1mid-20261011-dispatch05',stage:'R2',examUid:exam,
 worktreeRootAbsolute:root,workingJsAbsolute:path.join(root,'archive/exams/original/high/h2/1mid',exam+'.js'),assetRootAbsolute:path.join(root,'archive'),evidenceRootAbsolute:evidence,
 expectedCurrentSource:{rawSha256:'73ec63a97fa42607685391286f353402a48c726efdc40b82bae25c4da1ae2637',rawBufferGitBlobSha1:'3908cd9ed6ed160a2a273a4c6ea4749ebb6167a7'},
 sourceOrigin:'ROOT_QID_STATUS_META_CLOSEOUT_Q12',changeScope:{qids:[12],fields:['itemStatus','reviewStatus','integrationPattern','difficultyAssessmentStatus','difficultyEvidenceDebt','itemHoldReason'],studentBodyChanged:false,answerReviewDisposition:'REUSE_EXISTING_Q12_BLIND_FREEZE_NO_RESOLVE'},
 rootCloseoutReceipt:{path:rootReceipt,sha256:sha(rootReceipt)},
 currentR1Evidence:{path:r1Evidence,sha256:sha(r1Evidence)},
 currentR1CompletionEvent:{path:r1Event,sha256:sha(r1Event)},
 previousR2Evidence:{path:priorR2Evidence,sha256:sha(priorR2Evidence),preserveImmutable:true},
 previousR2CompletionEvent:{path:priorR2Event,sha256:sha(priorR2Event),preserveImmutable:true},
 q12BlindFreeze:{path:answerFreeze,sha256:sha(answerFreeze),answer:'22 (choice ⑤)',reuseWithoutResolving:true},
 q12Comparison:{path:answerCompare,sha256:sha(answerCompare),result:'MATCH'},
 currentStudentBundle:{path:path.join(r2,'R2.current-student.bundle.rev2.json'),sha256:sha(path.join(r2,'R2.current-student.bundle.rev2.json')),questionCount:22,qidOrder:currentBundle.qids,exactParityWithPreviousStudentFields:true},
 currentAssetReads:{path:path.join(r2,'R2.current-asset-reads.q03-q06-q07-q21.json'),sha256:sha(path.join(r2,'R2.current-asset-reads.q03-q06-q07-q21.json')),reuseExistingReads:true},
 nextRosterTarget:'NONE'
};
const out=path.join(r2,'R2.current-source-assignment.rev2.json');put(out,assignment);console.log(JSON.stringify({path:out,sha256:sha(out),currentSource:assignment.expectedCurrentSource,studentFieldsExact:true},null,2));
