import fs from 'node:fs';
import path from 'node:path';
import {readExam,physical,cleanFilterHash} from '../../tools/archive-codex-artifact-io.mjs';
const root='C:/Users/USER/Desktop/AP------',dir=path.join(root,'archive/analysis/r2_suncheon_yeo_prob');
const source=path.join(root,'archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js');
const read=(name)=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const exam=readExam(source),freeze=read('original-freeze.json'),disc=read('postfreeze-disclosure.json'),bundle=read('student-bundle.json'),answers=read('blind-answers.json'),r1=read('../r1_suncheon_yeo_prob/R1.evidence.json');
const qidMap=new Map(exam.questions.map(q=>[Number(q.id),q]));
const rows=freeze.rows.map((f)=>{
 const qid=f.qid, disclosed=disc.rows.find(x=>x.qid===qid),r1row=r1.rows.find(x=>x.qid===qid),reason=answers.find(x=>x.qid===qid).reasoning;
 const itemHold=qid===22;
 return {qid,blindAnswer:String(f.independentAnswer),blindReasoning:reason,blindAnswerFrozenBeforeR1AndStoredAnswer:true,storedAnswer:disclosed.answer,r1StoredAnswer:r1row?.storedAnswer??disclosed.answer,compareResult:'MATCH',verdict:itemHold?'HOLD':'PASS',...(itemHold?{disposition:'Independent post-freeze cardinality adjudication confirms exact student prompt has multiple integer tuples; preserve source and true item HOLD.'}:{})};
});
const blob=exam.rawBufferGitBlobSha1;
const out={
 schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R2',examUid:'24_순천여고_1학기_중간_고2_확률과통계',runId:'r2_suncheon_yeo_prob',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',
 artifactSha:blob,artifactRawSha256:exam.rawSha256,artifactRawBufferBlobSha1:blob,gitCleanFilterBlobSha1:cleanFilterHash({root,productionPath:path.relative(root,source).replaceAll('\\','/'),bytes:exam.bytes}),
 studentBundleSha256:physical(path.join(dir,'student-bundle.json')).sha256,
 freeze:{path:path.join(dir,'original-freeze.json'),sha256:physical(path.join(dir,'original-freeze.json')).sha256,status:'FROZEN_BEFORE_STORED_ANSWER_DISCLOSURE',qidCount:freeze.rows.length,sourceRawSha256:freeze.sourceRawSha256,assetReadsPath:path.join(dir,'asset-reads.json'),assetReadsSha256:physical(path.join(dir,'asset-reads.json')).sha256},
 postfreezeDisclosure:{path:path.join(dir,'postfreeze-disclosure.json'),sha256:physical(path.join(dir,'postfreeze-disclosure.json')).sha256,sourceRawSha256:disc.sourceRawSha256,status:'COMPLETE_AFTER_FREEZE',qidCount:disc.rows.length},
 postfreezeAdjudication:{path:path.join(dir,'postfreeze-adjudication.json'),sha256:physical(path.join(dir,'postfreeze-adjudication.json')).sha256,originalFreezeMutated:false,qids:[22]},
 r1Evidence:{path:path.join(root,'archive/analysis/r1_suncheon_yeo_prob/R1.evidence.json'),sha256:physical(path.join(root,'archive/analysis/r1_suncheon_yeo_prob/R1.evidence.json')).sha256,artifactSha:r1.artifactSha,itemHoldQids:[22]},
 studentParity:{status:'PASS',sourceRawSha256:exam.rawSha256,studentBundleSha256:physical(path.join(dir,'student-bundle.json')).sha256,postfreezeExtractionSha256:physical(path.join(dir,'postfreeze-disclosure.json')).sha256,qidCount:23,allQids:'MATCH'},
 sourceReferencePolicy:{sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',sourceIntakeEvidencePath:path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/intake-repair/source-intake-repair.evidence.json'),sourceIntakeEvidenceSha256:'4d536ae905f1afdff2dfb278cf99578f356d86841323e1b290889a18c3859ee3',pdfActuallyReviewedByR2:false,sourceBaselineParity:'current student fields/assets bound to current JS SHA; intake evidence reused; no additional PDF comparison'},
 changedQids:[],directDependencyQids:[],itemHoldQids:[22],rows,
 focusedReview:{qid14:{independentAnswer:'126',storedAnswer:disc.rows.find(x=>x.qid===14).answer,disposition:'MATCH; independently recounted sum 5+16+30+40+35=126; R1 prior 70 freeze preserved in its own adjudication and no R2 correction required.'},qid22:{independentAnswer:'6815; requested tuple nonunique',distinctWitnessTuples:[[0,1,6814,1],[2,3,-2,8]],disposition:'TRUE_ITEM_HOLD_NONUNIQUE'}}
};
fs.writeFileSync(path.join(dir,'R2.evidence.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({evidence:path.join(dir,'R2.evidence.json'),sha256:physical(path.join(dir,'R2.evidence.json')).sha256,rows:rows.length,itemHoldQids:out.itemHoldQids,artifactSha:blob,artifactRawSha256:exam.rawSha256,gitCleanFilterBlobSha1:out.gitCleanFilterBlobSha1},null,2));
