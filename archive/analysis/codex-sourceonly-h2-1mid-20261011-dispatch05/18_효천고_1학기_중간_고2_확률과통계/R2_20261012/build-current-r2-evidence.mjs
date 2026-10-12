import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root='C:/Users/USER/Desktop/AP------';
const run=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05');
const exam='18_효천고_1학기_중간_고2_확률과통계';
const dir=path.join(run,exam,'R2_20261012');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const currentBundle=path.join(dir,'R2.current-student.bundle.v2.json');
const priorEvidenceFile=path.join(dir,'R2.evidence.rev2.json');
const freezeFile=path.join(dir,'R2.q12-original-freeze.rev1.json');
const postfreezeFile=path.join(dir,'R2.q12-postfreeze-current-source.json');
const assignmentFile=path.join(dir,'R2.current-source-assignment.rev1.json');
const assetReadsFile=path.join(dir,'R2.current-asset-reads.q03-q06-q07-q21.json');
const currentRawSha='dea2930646d4426dc6838639d308bd2accd83786f43d640f11d9b891feb2e037';
const currentBlob='811978c5226a9294fbbe5f2ae6b40ad74aa4e1ca';
const r1Acceptance=path.join(run,exam,'ITEM_RECOVERY_q12/R1_qid_review/R1_q12_restored.complete.event.json');
const restoration=path.join(run,exam,'ASSET_RESTORATION_20261012/asset-restoration-receipt.json');
const bundle=JSON.parse(fs.readFileSync(currentBundle));
const freeze=JSON.parse(fs.readFileSync(freezeFile));
const disclosure=JSON.parse(fs.readFileSync(postfreezeFile));
const assetReads=JSON.parse(fs.readFileSync(assetReadsFile));
if(bundle.sourceRawSha256!==currentRawSha||bundle.questionCount!==22||freeze.rows.length!==1||freeze.rows[0].qid!==12||freeze.sourceRawSha256!==currentRawSha||disclosure.studentParity!=='EXACT')throw Error('CURRENT_Q12_R2_PROOFS_REQUIRED');
if(disclosure.currentStoredFields.answer!=='⑤'||disclosure.independentFreeze.answer!=='22 (choice ⑤)')throw Error('Q12_ANSWER_MATCH_NOT_ESTABLISHED');
const adjudication={schemaVersion:'JS_ARCHIVE_R2_QID_COMPARISON_ADJUDICATION_V1',examUid:exam,qid:12,stage:'R2',source:{rawSha256:currentRawSha,rawBufferGitBlobSha1:currentBlob},independentFreeze:{path:freezeFile,sha256:sha(freezeFile),answer:disclosure.independentFreeze.answer,reasoning:disclosure.independentFreeze.reasoning},postfreezeCurrentSource:{path:postfreezeFile,sha256:sha(postfreezeFile),studentParity:'EXACT',storedAnswer:disclosure.currentStoredFields.answer},comparison:{result:'MATCH',independentValue:22,choiceIndex:5,choiceLabel:'⑤',storedChoice:'⑤',reason:'C(5,2)=10 and P(4,2)=12, so the sum is 22; this is exactly choice ⑤.'},correctionRequired:false,originalFreezeMutated:false};
const adjudicationFile=path.join(dir,'R2.q12-answer-comparison.rev1.json');put(adjudicationFile,adjudication);

const prior=JSON.parse(fs.readFileSync(priorEvidenceFile));
const rows=structuredClone(prior.rows);
if(rows.length!==22||rows.some((r,i)=>Number(r.qid)!==i+1))throw Error('PRIOR_R2_FULL_QID_ROWS_REQUIRED');
const q12=rows.find(r=>Number(r.qid)===12);
Object.assign(q12,{
 blindAnswer:'22',
 blindAnswerFrozenBeforeR1AndStoredAnswer:true,
 blindReasoning:'서로 다른 5개에서 순서 없이 2개를 고르는 방법은 C(5,2)=10이다. 서로 다른 4개에서 순서 있게 2개를 배열하는 방법은 4×3=12이다. 합은 22이며 선택지 ⑤이다.',
 storedAnswer:'⑤',
 r1StoredAnswer:'⑤',
 compareResult:'MATCH',
 verdict:'PASS',
 independentFreezeRef:{path:freezeFile,sha256:sha(freezeFile)},
 postfreezeDisclosureRef:{path:postfreezeFile,sha256:sha(postfreezeFile)},
 answerComparisonAdjudicationRef:{path:adjudicationFile,sha256:sha(adjudicationFile)},
 adjudication:'EXACT_CHOICE_MATCH_22_EQUALS_CHOICE_⑤'
});
const assetByQid=new Map(bundle.rows.map(r=>[Number(r.qid),r.assets||[]]));
for(const qid of [3,6,7,21]){
 const row=rows.find(r=>Number(r.qid)===qid),assets=assetByQid.get(qid)||[];
 if(assets.length!==1||!assetReads.some(a=>a.ref===assets[0].ref&&a.sha256===assets[0].sha256&&a.opened===true))throw Error('RESTORED_ASSET_REVIEW_ACK_REQUIRED:q'+qid);
 row.currentStudentAssetReview={ref:assets[0].ref,sha256:assets[0].sha256,opened:true,visualDisposition:'RESTORED_PROBLEM_ASSET_PARITY_REVIEW_ONLY_NO_ANSWER_RESOLVE'};
}

const out=structuredClone(prior);
out.examUid=exam;out.runId='codex-sourceonly-h2-1mid-20261011-dispatch05';out.stage='R2';
out.qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';out.executionLine='CODEX';
out.artifactSha=currentBlob;out.artifactRawBufferBlobSha1=currentBlob;out.artifactRawSha256=currentRawSha;
out.gitCleanFilterBlobSha1=null;
out.studentBundleSha256=sha(currentBundle);
out.studentParity={postfreezeExtractionSha256:sha(currentBundle),assetHashes:'MATCH',actualAssetReads:'PASS',allQids:'MATCH',studentBundleSha256:sha(currentBundle),status:'PASS',qidCount:22,sourceRawSha256:currentRawSha,sourceInputMode:'EXTRACTED_JS_ASSETS',pdfComparison:'NOT_PERFORMED_NO_SOURCE_DEPENDENT_DEFECT'};
out.sourceInputMode='EXTRACTED_JS_ASSETS';out.pdfReviewMode='DEFECT_ONLY';
out.rows=rows;
out.directDependencyQids=[3,6,7,12,21];out.changedQids=[12];out.itemHoldQids=[12];
out.currentSourceAssignment={path:assignmentFile,sha256:sha(assignmentFile)};
out.q12ReplacementAcceptanceEvent={path:r1Acceptance,sha256:sha(r1Acceptance)};
out.assetRestorationReceipt={path:restoration,sha256:sha(restoration)};
out.currentAssetReads={path:assetReadsFile,sha256:sha(assetReadsFile),assets:assetReads};
out.q12BlindFreeze={path:freezeFile,sha256:sha(freezeFile),qidCount:1,status:'FROZEN_BEFORE_STORED_ANSWER_DISCLOSURE'};
out.q12PostfreezeDisclosure={path:postfreezeFile,sha256:sha(postfreezeFile),qidCount:1,studentParity:'EXACT'};
out.q12AnswerComparisonAdjudication={path:adjudicationFile,sha256:sha(adjudicationFile),result:'MATCH'};
out.priorR2Reuse={path:priorEvidenceFile,sha256:sha(priorEvidenceFile),reusedQids:rows.filter(r=>![3,6,7,12,21].includes(Number(r.qid))).map(r=>r.qid),restoredAssetQids:[3,6,7,21],answersResolvedForRestoredAssetQids:false};
out.historicalFailurePreserved={prefreezeStopPath:path.join(dir,'R2.prefreeze-stop.json'),prefreezeStopSha256:sha(path.join(dir,'R2.prefreeze-stop.json')),oldFullFreezePath:path.join(dir,'R2.original-freeze.json'),oldFullFreezeSha256:sha(path.join(dir,'R2.original-freeze.json'))};
out.freeze={path:path.join(dir,'R2.original-freeze.json'),status:'HISTORICAL_22_OF_22_PRE_REPLACEMENT_PRESERVED',sha256:sha(path.join(dir,'R2.original-freeze.json')),qidCount:22};
out.postfreezeDisclosure={path:postfreezeFile,status:'QID_12_CURRENT_SOURCE_AFTER_CLEAN_FREEZE',sha256:sha(postfreezeFile),sourceRawSha256:currentRawSha256(),qidCount:1};
function currentRawSha256(){return currentRawSha;}
const outFile=path.join(dir,'R2.current-evidence.rev1.raw.json');put(outFile,out);
console.log(JSON.stringify({evidencePath:outFile,evidenceSha256:sha(outFile),qidCount:out.rows.length,reusedQids:out.priorR2Reuse.reusedQids,directDependencyQids:out.directDependencyQids,itemHoldQids:out.itemHoldQids,adjudicationPath:adjudicationFile,adjudicationSha256:sha(adjudicationFile)},null,2));
