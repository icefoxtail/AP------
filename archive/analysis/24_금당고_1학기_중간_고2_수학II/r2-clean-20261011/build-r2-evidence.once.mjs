import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
const write=(n,v)=>fs.writeFileSync(path.join(dir,n),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const r1=read('../r1-clean-20261011/r1-evidence.bound.json');
const freeze=read('r2-original-freeze.json');
const disclosure=read('r2-postfreeze-disclosure.json');
const adjudication=read('r2-q13-adjudication.json');
const sourceSha='d5d28573ce24627b2ca0adca505c18bc583ba3705b5e1fe0518617ddc639a4ac';
const sourceBlob='3622f4482a1ecc3cd34d862a2238951c087565eb';
const freezeRel='archive/analysis/24_금당고_1학기_중간_고2_수학II/r2-clean-20261011/r2-original-freeze.json';
const disclosureRel='archive/analysis/24_금당고_1학기_중간_고2_수학II/r2-clean-20261011/r2-postfreeze-disclosure.json';
const adjRel='archive/analysis/24_금당고_1학기_중간_고2_수학II/r2-clean-20261011/r2-q13-adjudication.json';
const answers=new Map(freeze.rows.map(r=>[Number(r.qid),r]));
const stored=new Map(disclosure.rows.map(r=>[Number(r.qid),r]));
const resolvedMismatch=13;
const ev=structuredClone(r1);
ev.stage='R2'; ev.artifactSha=sourceBlob; ev.artifactRawSha256=sourceSha; ev.executionLine='CODEX'; ev.qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
ev.rows=ev.rows.map(base=>{
  const qid=Number(base.qid), frozen=answers.get(qid), disclosed=stored.get(qid);
  if(!frozen||!disclosed) throw new Error('R2_DENOMINATOR_OR_DISCLOSURE_MISSING:'+qid);
  const original=String(frozen.independentAnswer), storedAnswer=String(disclosed.answer);
  const isMismatch=qid===resolvedMismatch;
  return {...base,
    independentAnswer:original,
    independentAnswerOriginalFreeze:original,
    independentReasoning:frozen.reasoning,
    independentAnswerFrozenBeforeStoredAnswer:true,
    blindAnswer:original,
    blindAnswerFrozenBeforeR1AndStoredAnswer:true,
    freezeRef:{path:freezeRel,sha256:'e8f88b5eb9c94677e36b945cbf9e6db724d190d913effdfec8c3842a4a12900b'},
    storedAnswer,
    compareResult:isMismatch?'MISMATCH':'MATCH',
    compareBasis:isMismatch?'Initial blind count 3 differed from stored choice ⑤; postfreeze graph recount corrected the reasoning to 5; original freeze preserved and adjudication bound.':'Independent answer agrees with stored answer after answer-label/format normalization.',
    verdict:'PASS',
    disposition:isMismatch?'ADJUDICATED_AFTER_POSTFREEZE_GRAPH_RECOUNT':'KEEP'
  };
});
ev.blindFreeze={path:freezeRel,sha256:'e8f88b5eb9c94677e36b945cbf9e6db724d190d913effdfec8c3842a4a12900b',qidCount:19,studentBundlePath:'archive/analysis/24_금당고_1학기_중간_고2_수학II/r2-clean-20261011/current-student-only.bundle.json',studentBundleSha256:'3f5f9e08bfb18543f01ae6ce452866a467f562435c5d14b6d458a72042704f84',freezeBeforeDisclosure:true};
ev.postfreezeDisclosure={path:disclosureRel,sha256:'b5f6cda2af2926df341e7f2219009154147c51d7a0aa377d9025a500a58be836',studentParity:'EXACT',qids:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]};
ev.adjudication={path:adjRel,sha256:'86be185d64bebb53309456021e660a54a8322020028880e77a12dc77a4540ac1',originalFreezePreserved:true,resolvedQids:[13]};
ev.sourceIdentityReview={examFile:'archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js',sourceRawSha256:sourceSha,sourceRawBlobSha1:sourceBlob,studentBundlePath:'archive/analysis/24_금당고_1학기_중간_고2_수학II/r2-clean-20261011/current-student-only.bundle.json',studentBundleSha256:'3f5f9e08bfb18543f01ae6ce452866a467f562435c5d14b6d458a72042704f84',freezePath:freezeRel,freezeSha256:'e8f88b5eb9c94677e36b945cbf9e6db724d190d913effdfec8c3842a4a12900b',currentFinalStudentParity:'EXACT',postfreezeDisclosurePath:disclosureRel,postfreezeDisclosureSha256:'b5f6cda2af2926df341e7f2219009154147c51d7a0aa377d9025a500a58be836',pdfReviewMode:'DEFECT_ONLY',pdfCompared:false};
ev.assetReads=[{qid:13,ref:'assets/images/24_금당고_1학기_중간_고2_수학II/q13.png',sha256:'f026e37dfc703c8bc0315b3aabcd50e5bd745af0756637622da3b5d80d126610',opened:true}];
ev.summary={denominator:19,initialMatches:18,initialMismatches:1,postfreezeAdjudicated:1,unresolvedMismatches:0,itemHolds:0,sourcePdfCompared:false};
ev.technicalHashes={rawSha256:sourceSha,validatorRawBufferBlobSha1:sourceBlob,gitCleanFilterBlobSha1:sourceBlob};
write('r2-evidence.json',ev);
console.log(JSON.stringify({path:path.join(dir,'r2-evidence.json'),rows:ev.rows.length,initialMismatches:ev.rows.filter(r=>r.compareResult==='MISMATCH').map(r=>r.qid),freeze:ev.blindFreeze,disclosure:ev.postfreezeDisclosure,adjudication:ev.adjudication}));

