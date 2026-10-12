import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {readExam} from '../../../../tools/archive-codex-artifact-io.mjs';
const root='C:/Users/USER/Desktop/AP------';
const dir=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R2_20261012');
const r1dir=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/ITEM_RECOVERY_q12/R1_qid_review');
const source=path.join(root,'archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const currentRaw='dea2930646d4426dc6838639d308bd2accd83786f43d640f11d9b891feb2e037';
const currentBlob='811978c5226a9294fbbe5f2ae6b40ad74aa4e1ca';
const baseFile=path.join(dir,'R2.current-evidence.rev1.bound.json');
const bundleFile=path.join(dir,'R2.current-student.bundle.v2.json');
const freezeFile=path.join(dir,'R2.q12-original-freeze.rev1.json');
const postFile=path.join(dir,'R2.q12-postfreeze-current-source.json');
const compareFile=path.join(dir,'R2.q12-answer-comparison.rev1.json');
const r1EvidenceFile=path.join(r1dir,'R1_q12_evidence.restored.rev1.bound.json');
const r1EventFile=path.join(r1dir,'R1_q12_restored.complete.event.json');
const exam=readExam(source),base=JSON.parse(fs.readFileSync(baseFile)),bundle=JSON.parse(fs.readFileSync(bundleFile)),freeze=JSON.parse(fs.readFileSync(freezeFile)),post=JSON.parse(fs.readFileSync(postFile)),comparison=JSON.parse(fs.readFileSync(compareFile)),r1=JSON.parse(fs.readFileSync(r1EvidenceFile)),event=JSON.parse(fs.readFileSync(r1EventFile));
if(exam.rawSha256!==currentRaw||exam.rawBufferGitBlobSha1!==currentBlob||base.artifactSha!==currentBlob||base.artifactRawSha256!==currentRaw)throw Error('REV2_CURRENT_SOURCE_BINDING_REQUIRED');
if(bundle.sourceRawSha256!==currentRaw||bundle.questionCount!==22||post.studentParity!=='EXACT'||post.source.rawSha256!==currentRaw)throw Error('REV2_CURRENT_STUDENT_PARITY_REQUIRED');
if(freeze.sourceRawSha256!==currentRaw||freeze.rows.length!==1||freeze.rows[0].qid!==12||comparison.comparison.result!=='MATCH'||comparison.qid!==12)throw Error('REV2_Q12_FREEZE_COMPARISON_REQUIRED');
if(event.status!=='STAGE_COMPLETE'||event.stage!=='R1'||event.artifactSha!==currentBlob)throw Error('CURRENT_R1_Q12_ACCEPTANCE_REQUIRED');
const oldRows=base.rows,oldOther=JSON.stringify(oldRows.filter(r=>Number(r.qid)!==12));
const q12=oldRows.find(r=>Number(r.qid)===12),r1q=r1.rows.find(r=>Number(r.qid)===12),student=bundle.rows.find(r=>Number(r.qid)===12),frozen=freeze.rows[0];
if(!q12||!r1q||!student||r1q.reviewedSourceRawSha256!==currentRaw||r1q.itemStatus!=='HOLD')throw Error('CURRENT_R1_Q12_ROW_REQUIRED');
const r1MetaReason=r1q.metaDebtReason||r1q.axisEvidence?.META?.reason;
if(!r1MetaReason||r1q.axisEvidence?.META?.projection?.integrationPattern!=='SEQUENTIAL')throw Error('CURRENT_R1_INTEGRATION_PATTERN_DISPOSITION_REQUIRED');
const fresh={
 ...q12,
 itemStatus:'HOLD',
 disposition:'R2_ACCEPTED_Q12_DIRECT_REPLACEMENT; TEMPORARY_ITEMSTATUS_HOLD_PENDING_ROOT_STATUS_ONLY_CLOSEOUT',
 blindAnswer:'22',
 blindAnswerFrozenBeforeR1AndStoredAnswer:true,
 blindReasoning:frozen.reasoning,
 storedAnswer:post.currentStoredFields.answer,
 r1StoredAnswer:r1q.storedAnswer,
 compareResult:'MATCH',
 verdict:'PASS',
 itemHoldReason:undefined,
 metaDebtFields:[],
 metaDebtReason:undefined,
 currentR1MetaDisposition:{
  metaDebtFields:['integrationPattern'],
  projection:r1q.axisEvidence.META.projection,
  metaDebtField:'integrationPattern',
  metaDebtReason:r1MetaReason,
  preservedDifficultyEvidenceDebt:r1q.exactMetaEvidenceDebt??null,
  evidence:{path:r1EvidenceFile,sha256:sha(r1EvidenceFile)},
  acceptanceEvent:{path:r1EventFile,sha256:sha(r1EventFile)}
 },
 studentPayloadSha256:student.studentPayloadSha256,
 reviewedSourceRawSha256:currentRaw,
 independentFreezeRef:{path:freezeFile,sha256:sha(freezeFile)},
 postfreezeDisclosureRef:{path:postFile,sha256:sha(postFile)},
 answerComparisonAdjudicationRef:{path:compareFile,sha256:sha(compareFile)},
 adjudication:'EXACT_CHOICE_MATCH_22_EQUALS_CHOICE_⑤',
 statusOnlyCloseoutPending:true
};
delete fresh.itemHoldReason;
delete fresh.metaDebtReason;
base.rows=oldRows.map(r=>Number(r.qid)===12?fresh:r);
if(JSON.stringify(base.rows.filter(r=>Number(r.qid)!==12))!==oldOther)throw Error('NON_TARGET_R2_ROW_CHANGED');
const out=path.join(dir,'R2.current-evidence.rev2.fixed.raw.json');put(out,base);
console.log(JSON.stringify({output:out,sha256:sha(out),qidCount:base.rows.length,changedQid:12,itemStatus:fresh.itemStatus,disposition:fresh.disposition,metaDebtFields:fresh.metaDebtFields,metaDebtReason:fresh.metaDebtReason},null,2));
