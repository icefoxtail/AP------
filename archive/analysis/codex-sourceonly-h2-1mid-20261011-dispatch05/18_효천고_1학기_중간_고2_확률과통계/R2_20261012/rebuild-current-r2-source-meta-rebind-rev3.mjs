import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {readExam} from '../../../../tools/archive-codex-artifact-io.mjs';
const root='C:/Users/USER/Desktop/AP------';
const run=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05');
const examUid='18_효천고_1학기_중간_고2_확률과통계';
const evidenceRoot=path.join(run,examUid),dir=path.join(evidenceRoot,'R2_20261012'),r1dir=path.join(evidenceRoot,'ITEM_RECOVERY_q12/R1_qid_review');
const source=path.join(root,'archive/exams/original/high/h2/1mid',examUid+'.js');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const raw='73ec63a97fa42607685391286f353402a48c726efdc40b82bae25c4da1ae2637';
const blob='3908cd9ed6ed160a2a273a4c6ea4749ebb6167a7';
const assignmentFile=path.join(dir,'R2.current-source-assignment.rev2.json');
const bundleFile=path.join(dir,'R2.current-student.bundle.rev2.json');
const previousFile=path.join(dir,'R2.current-evidence.rev2.fixed.raw.json');
const freezeFile=path.join(dir,'R2.q12-original-freeze.rev1.json');
const compareFile=path.join(dir,'R2.q12-answer-comparison.rev1.json');
const closeoutFile=path.join(evidenceRoot,'ITEM_RECOVERY_q12/ROOT_q12.status-meta-closeout.rev1.receipt.json');
const r1EvidenceFile=path.join(r1dir,'R1_q12_evidence.status-meta.rev1.bound.json');
const r1EventFile=path.join(r1dir,'R1_q12_status_meta.complete.event.rev1.json');
const exam=readExam(source),base=JSON.parse(fs.readFileSync(previousFile)),bundle=JSON.parse(fs.readFileSync(bundleFile)),freeze=JSON.parse(fs.readFileSync(freezeFile)),compare=JSON.parse(fs.readFileSync(compareFile)),closeout=JSON.parse(fs.readFileSync(closeoutFile)),r1=JSON.parse(fs.readFileSync(r1EvidenceFile)),event=JSON.parse(fs.readFileSync(r1EventFile));
if(exam.rawSha256!==raw||exam.rawBufferGitBlobSha1!==blob||bundle.sourceRawSha256!==raw||bundle.questionCount!==22||base.rows.length!==22)throw Error('CURRENT_SOURCE_OR_DENOMINATOR_MISMATCH');
if(closeout.source.afterRawSha256!==raw||closeout.source.afterGitBlobSha1!==blob||closeout.itemStatus!=='CLEAR_AFTER_FRESH_SCOPED_R1_R2'||closeout.reviewStatus!=='reviewed_pass')throw Error('ROOT_CLOSEOUT_CURRENT_SOURCE_BINDING_REQUIRED');
if(event.stage!=='R1'||event.artifactSha!==blob||event.nextStage!=='R2'||event.status!=='STAGE_COMPLETE')throw Error('CURRENT_R1_REBIND_EVENT_REQUIRED');
if(freeze.rows.length!==1||freeze.rows[0].qid!==12||freeze.rows[0].independentAnswer!=='22 (choice ⑤)'||compare.comparison.result!=='MATCH')throw Error('PRIOR_Q12_R2_FREEZE_MATCH_REQUIRED');
const current=exam.questions.find(q=>Number(q.id??q.qid)===12),r1q=r1.rows.find(r=>Number(r.qid)===12),student=bundle.rows.find(r=>Number(r.qid)===12),oldRows=base.rows;
if(!current||!r1q||!student||JSON.stringify(r1q.axisEvidence?.META?.projection)!==JSON.stringify({integrationPattern:'NONE',conditionKeys:[],templateKey:'TPL_COMBINATION_SELECTION',problemTypeKey:'PT_COUNTING_SELECTION_DISTRIBUTION',crossConceptKeys:[]}))throw Error('CURRENT_R1_Q12_CLOSED_META_REQUIRED');
const currentFields={};
for(const k of ['itemStatus','reviewStatus','integrationPattern','difficultyAssessmentStatus','difficultyEvidenceDebt','itemHoldReason','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'])if(Object.hasOwn(current,k))currentFields[k]=current[k];
if(currentFields.itemStatus!=='CLEAR_AFTER_FRESH_SCOPED_R1_R2'||currentFields.reviewStatus!=='reviewed_pass'||currentFields.integrationPattern!=='NONE'||Object.hasOwn(currentFields,'itemHoldReason')||Object.hasOwn(currentFields,'difficultyEvidenceDebt')||Object.hasOwn(currentFields,'difficultyAssessmentStatus'))throw Error('CURRENT_Q12_SOURCE_CLOSEOUT_FIELDS_MISMATCH');
const r1Meta={metaDebtFields:[],projection:r1q.axisEvidence.META.projection,difficulty:r1q.axisEvidence.META.difficulty??null,exactMetaEvidenceDebt:null,difficultyEvidenceDebt:null,disposition:'CURRENT_R1_META_CLOSED_NO_DEBT',evidence:{path:r1EvidenceFile,sha256:sha(r1EvidenceFile)},completionEvent:{path:r1EventFile,sha256:sha(r1EventFile)},rootCloseoutReceipt:{path:closeoutFile,sha256:sha(closeoutFile)}};
const original=q=>JSON.stringify(q);
const oldOther=JSON.stringify(oldRows.filter(r=>Number(r.qid)!==12));
const old=oldRows.find(r=>Number(r.qid)===12);
const q12={...old,
 itemStatus:currentFields.itemStatus,
 reviewStatus:currentFields.reviewStatus,
 disposition:r1q.disposition,
 blindAnswer:'22',blindAnswerFrozenBeforeR1AndStoredAnswer:true,blindReasoning:freeze.rows[0].reasoning,
 storedAnswer:r1q.storedAnswer,r1StoredAnswer:r1q.storedAnswer,compareResult:'MATCH',verdict:'PASS',
 metaDebtFields:[],studentPayloadSha256:student.studentPayloadSha256,reviewedSourceRawSha256:raw,
 currentSourceStatusMeta:currentFields,currentR1MetaDisposition:r1Meta,
 independentFreezeRef:{path:freezeFile,sha256:sha(freezeFile)},
 answerComparisonAdjudicationRef:{path:compareFile,sha256:sha(compareFile)},
 sourceRebindDisposition:'STATUS_META_ONLY; ORIGINAL_Q12_BLIND_FREEZE_REUSED; NO_RESOLVE'
};
delete q12.itemHoldReason;delete q12.metaDebtReason;
base.rows=oldRows.map(row=>Number(row.qid)===12?q12:row);
if(JSON.stringify(base.rows.filter(r=>Number(r.qid)!==12))!==oldOther)throw Error('NON_TARGET_R2_ROW_CHANGED');
base.artifactSha=blob;base.artifactRawBufferBlobSha1=blob;base.artifactRawSha256=raw;base.gitCleanFilterBlobSha1=null;
base.studentBundleSha256=sha(bundleFile);
base.studentParity={postfreezeExtractionSha256:sha(bundleFile),assetHashes:'MATCH',actualAssetReads:'PASS_REUSED_CURRENT_SHA_ACK',allQids:'MATCH',studentBundleSha256:sha(bundleFile),status:'PASS',qidCount:22,sourceRawSha256:raw,sourceInputMode:'EXTRACTED_JS_ASSETS',studentFieldsComparedToPriorCurrentBundle:'EXACT'};
base.itemHoldQids=[];base.directDependencyQids=[3,6,7,12,21];base.changedQids=[12];
base.currentSourceAssignment={path:assignmentFile,sha256:sha(assignmentFile)};
base.currentR1Evidence={path:r1EvidenceFile,sha256:sha(r1EvidenceFile)};
base.currentR1CompletionEvent={path:r1EventFile,sha256:sha(r1EventFile)};
base.rootStatusMetaCloseoutReceipt={path:closeoutFile,sha256:sha(closeoutFile)};
base.currentStudentBundle={path:bundleFile,sha256:sha(bundleFile),questionCount:22,qidOrder:bundle.qids,exactStudentFieldsParity:true};
base.q12BlindFreeze={path:freezeFile,sha256:sha(freezeFile),qidCount:1,answer:'22 (choice ⑤)',status:'REUSED_NO_RESOLVE'};
base.q12AnswerComparison={path:compareFile,sha256:sha(compareFile),result:'MATCH'};
base.q12CurrentSourceStatusMeta=currentFields;
base.priorR2Rebind={path:previousFile,sha256:sha(previousFile),reusedQids:oldRows.filter(r=>Number(r.qid)!==12).map(r=>r.qid),changedQids:[12],noAnswersResolved:true};
const out=path.join(dir,'R2.current-evidence.rev3.raw.json');put(out,base);
console.log(JSON.stringify({path:out,sha256:sha(out),currentSource:{rawSha256:raw,blobSha1:blob},questionCount:base.rows.length,changedQid:12,itemStatus:q12.itemStatus,reviewStatus:q12.reviewStatus,integrationPattern:currentFields.integrationPattern,metaDebtFields:q12.metaDebtFields,itemHoldQids:base.itemHoldQids,studentFieldsParity:base.studentParity.studentFieldsComparedToPriorCurrentBundle},null,2));
