import fs from 'node:fs';
import path from 'node:path';
import { physical, writeFresh } from '../../../tools/archive-codex-artifact-io.mjs';
const dir=import.meta.dirname;
const examUid='24_매산여고_1학기_중간_고2_확률과통계';
const bundleFile=path.join(dir,'current-student-only.bundle.json');
const freezeFile=path.join(dir,'R2.original-freeze.json');
const disclosureFile=path.join(dir,'R2.postfreeze-disclosure.json');
const adjudicationFile=path.join(dir,'R2.postfreeze-adjudication.json');
const assetReadsFile=path.join(dir,'R2.asset-reads.json');
const freeze=JSON.parse(fs.readFileSync(freezeFile,'utf8'));
const disclosure=JSON.parse(fs.readFileSync(disclosureFile,'utf8'));
const adjudication=JSON.parse(fs.readFileSync(adjudicationFile,'utf8'));
const assetReads=JSON.parse(fs.readFileSync(assetReadsFile,'utf8'));
const corrected=new Map(adjudication.corrections.map(r=>[r.qid,r.correctedAnswer]));
const mismatch=new Map([
 [7,'Corrected the path traversal after rechecking the opened road asset: 78 total paths, choice ④.'],
 [12,'Three paired input classes plus input 7 give 5^4=625, choice ②.'],
 [16,'18 favorable permutations among 60 give 3/10, choice ③.'],
 [23,'Correct first-triple enumeration gives 147; the postfreeze solution confirms it.'],
]);
const rows=freeze.rows.map(r=>{
 const post=disclosure.rows.find(q=>q.qid===r.qid);
 let compareResult='MATCH', verdict='MATCH', disposition='Blind answer agrees with the postfreeze stored answer.';
 if(r.qid===11){compareResult='SUSPICIOUS';verdict='SUSPICIOUS_SOURCE_HOLD_PRESERVED';disposition='Independent count 44 matches choice ②, but storedAnswer is HOLD because the upstream solution incorrectly totals 40 and claims no choice matches. Preserve item hold for ROOT recovery.';}
 else if(r.qid===22){compareResult='SUSPICIOUS';verdict='SUSPICIOUS_SOURCE_HOLD_PRESERVED';disposition='StoredAnswer is HOLD; a^6=64 admits a=2 or -2 over the reals, producing different a+b. Preserve item hold.';}
 else if(mismatch.has(r.qid)){compareResult='MISMATCH';verdict='POSTFREEZE_ADJUDICATED';disposition=mismatch.get(r.qid)+' Original blind freeze is preserved; see R2.postfreeze-adjudication.json.';}
 const correctedAnswer=corrected.get(r.qid);
 return {qid:r.qid,blindAnswer:r.independentAnswer,blindAnswerFrozenBeforeR1AndStoredAnswer:true,compareResult,storedAnswer:post.answer,verdict,disposition,...(correctedAnswer!==undefined?{adjudicatedAnswer:correctedAnswer}:{})};
});
const bundle=JSON.parse(fs.readFileSync(bundleFile,'utf8'));
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R2',examUid,artifactSha:'96183c85985b5164a22288f92c124325bb33dae6',artifactRawSha256:'552df3d4c1a1c103957b1d89bf28ef0505e2b3eda0097661b2f0a546eaa197e2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',reviewerIdentity:{role:'archive_r2',reviewerId:'archive_r2_maesan_probability_20261011'},sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',studentInput:{bundle:physical(bundleFile),sourceRawSha256:bundle.sourceRawSha256,sourceRawBlobSha1:bundle.sourceRawBlobSha1,qids:bundle.qids,assetsRead:assetReads},blindFreeze:physical(freezeFile),postfreezeDisclosure:physical(disclosureFile),postfreezeAdjudication:physical(adjudicationFile),rows};
writeFresh(path.join(dir,'R2.evidence.json'),evidence);
console.log(JSON.stringify({path:path.join(dir,'R2.evidence.json'),sha256:physical(path.join(dir,'R2.evidence.json')).sha256,rows:rows.length,holds:[11,22]}));
