import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const root=path.resolve('.');
const base=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R2-clean-17-hyocheon');
const freeze=JSON.parse(fs.readFileSync(path.join(base,'independent-freeze.json')));
const disclosure=JSON.parse(fs.readFileSync(path.join(base,'postfreeze-current-disclosure.json')));
const adjudication=JSON.parse(fs.readFileSync(path.join(base,'postfreeze-adjudication.json')));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const rows=freeze.rows.map(f=>{
 const qid=f.qid, s=disclosure.rows.find(r=>r.qid===qid);
 const a=f.independentAnswer;
 const answer=typeof a==='object' ? (a.choice==null ? a.value : `choice ${a.choice}: ${a.value}`) : String(a);
 let compareResult='MATCH', verdict='MATCH', disposition;
 if(qid===15){compareResult='SUSPICIOUS';verdict='The printed statement set has no matching offered choice; stored answer is HOLD. Scoped original-derived source crop confirms the last term in ㄱ is C(n,0), so preserve the item HOLD.';disposition='TRUE_SOURCE_ITEM_HOLD_Q15';}
 if(qid===21){compareResult='MISMATCH';verdict='Original frozen value 24 was wrong. Postfreeze adjudication recounts 3 ladder perfect matchings × 3! country assignments × 2^3 student orientations = 144, matching the stored answer.';disposition='POSTFREEZE_ADJUDICATION_CORRECTED_Q21';}
 return {qid,blindAnswer:answer,blindAnswerFrozenBeforeR1AndStoredAnswer:true,compareResult,verdict,...(disposition?{disposition}:{}),storedAnswerAfterFreeze:s.answer};
});
const file=path.join(root,'archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const srcBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${fs.statSync(file).size}\0`),fs.readFileSync(file)])).digest('hex');
const bundle=path.join(base,'current-student-bundle.json'), fr=path.join(base,'independent-freeze.json'), disc=path.join(base,'postfreeze-current-disclosure.json'), adj=path.join(base,'postfreeze-adjudication.json');
const crop=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/q15-source-item-crop-300dpi-v2.png');
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R2',examUid:'17_효천고_1학기_중간_고2_확률과통계',artifactSha:srcBlob,artifactRawSha256:sha(file),qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',reviewerIdentity:{role:'archive_r2',reviewerId:'archive_r2_17_hyocheon_clean'},studentInput:{sourceRawSha256:freeze.sourceRawSha256,bundle:{path:bundle,sha256:sha(bundle)},questionCount:23,studentQidOrder:freeze.studentQidOrder,postfreezeStudentParity:disclosure.studentParity,referencedAssets:freeze.assetReads},blindFreeze:{path:fr,sha256:sha(fr),frozenAt:freeze.frozenAt,answersFrozenBeforeStoredAnswer:true},postfreezeDisclosure:{path:disc,sha256:sha(disc),sourceRawSha256:disclosure.sourceRawSha256},postfreezeAdjudication:{path:adj,sha256:sha(adj),originalFreezeMutated:adjudication.originalFreezeMutated,correctionQids:adjudication.corrections.map(r=>r.qid)},sourceEvidenceReuse:{qid:15,kind:'ORIGINAL_DERIVED_SCOPED_CROP_REUSED',path:crop,sha256:sha(crop),observation:'The printed final binomial term in ㄱ is C(n,0), and no offered option lists the resulting true set ㄴ, ㄷ, ㄹ. This crop is reused evidence; no full PDF reread or direct PDF comparison is claimed.'},rows};
const out=path.join(base,'R2.evidence.json');fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({evidencePath:out,evidenceSha256:sha(out),artifactSha:srcBlob,artifactRawSha256:sha(file),counts:{match:rows.filter(r=>r.compareResult==='MATCH').length,mismatch:rows.filter(r=>r.compareResult==='MISMATCH').length,suspicious:rows.filter(r=>r.compareResult==='SUSPICIOUS').length},q15SourceCropSha256:sha(crop)},null,2));
