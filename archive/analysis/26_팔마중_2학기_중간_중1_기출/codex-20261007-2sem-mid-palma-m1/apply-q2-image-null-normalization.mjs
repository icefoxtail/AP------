import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import path from 'node:path';
const assignmentPath=process.argv[2];
const root=JSON.parse(fs.readFileSync(assignmentPath,'utf8'));
const decision=JSON.parse(fs.readFileSync(root.rootDecisionAbsolute,'utf8'));
const candidate=root.workingJsAbsolute;
const old=fs.readFileSync(candidate);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
if(sha(old)!==root.artifactRawSha256||blob(old)!==root.validatorRawBufferBlobSha1)throw new Error('BASELINE_CANDIDATE_SHA_MISMATCH');
const baselineBundle=JSON.parse(fs.readFileSync(root.studentBundleAbsolute,'utf8'));
if(sha(fs.readFileSync(root.studentBundleAbsolute))!==root.studentBundleSha256)throw new Error('BASELINE_BUNDLE_SHA_MISMATCH');
const beforeBox={window:{}};vm.createContext(beforeBox);vm.runInContext(old.toString('utf8'),beforeBox,{filename:candidate,timeout:5000});
const beforeBank=beforeBox.window.questionBank||beforeBox.window.questions;
if(!Array.isArray(beforeBank)||beforeBank.length!==24)throw new Error('BASELINE_QID_DENOMINATOR_MISMATCH');
const beforeQ2=beforeBank.find(q=>Number(q.id)===2);
if(beforeQ2?.image!==null)throw new Error('Q2_IMAGE_NOT_NULL');
const s=old.toString('utf8');
const q2Match=/"id"\s*:\s*2\s*,/.exec(s); const q3Match=q2Match?/"id"\s*:\s*3\s*,/.exec(s.slice(q2Match.index+q2Match[0].length)):null; const q2Start=q2Match?.index??-1; const q3Start=q3Match?q2Match.index+q2Match[0].length+q3Match.index:-1;
if(q2Start<0||q3Start<0)throw new Error('TARGET_QID_LOCUS_NOT_FOUND');
const span=s.slice(q2Start,q3Start); const matches=[...span.matchAll(/"image"\s*:\s*null\s*,/g)];
if(matches.length!==1)throw new Error(`EXPECTED_ONE_Q2_NULL_IMAGE_PROPERTY_GOT_${matches.length}`);
const m=matches[0]; const correctedSpan=span.slice(0,m.index)+span.slice(m.index+m[0].length);
const corrected=s.slice(0,q2Start)+correctedSpan+s.slice(q3Start);
const next=Buffer.from(corrected,'utf8');
fs.writeFileSync(candidate,next);
const afterBox={window:{}};vm.createContext(afterBox);vm.runInContext(next.toString('utf8'),afterBox,{filename:candidate,timeout:5000});
const afterBank=afterBox.window.questionBank||afterBox.window.questions;
if(!Array.isArray(afterBank)||afterBank.length!==24)throw new Error('CORRECTED_QID_DENOMINATOR_MISMATCH');
for(let i=0;i<24;i++){
  const a=beforeBank[i],b=afterBank[i];
  const fields=new Set([...Object.keys(a),...Object.keys(b)]);
  for(const f of fields){if(i===1&&f==='image')continue;if(JSON.stringify(a[f])!==JSON.stringify(b[f]))throw new Error(`UNAUTHORIZED_FIELD_CHANGE_Q${i+1}:${f}`);}
}
if(afterBank[1].image!==undefined)throw new Error('Q2_IMAGE_PROPERTY_NOT_OMITTED');
for(const [qid,ref,expected] of [[10,'assets/images/26_팔마중_2학기_중간_중1_기출/q10.png','21cd346bfa799230787c82e2cecf9e396d8f76eab80d56e48bfa964b6131547d'],[13,'assets/images/26_팔마중_2학기_중간_중1_기출/q13.png','8a20320138e0e70a1fc9f4f3c73a4551bc93838ea6b41d0f71090110a4f3defe']]){
 const q=afterBank.find(x=>Number(x.id)===qid);if(q.image!==ref)throw new Error(`ASSET_REFERENCE_CHANGED_Q${qid}`);
 const bytes=fs.readFileSync(path.resolve(root.assetRootAbsolute,ref));if(sha(bytes)!==expected)throw new Error(`ASSET_HASH_CHANGED_Q${qid}`);
}
const receipt={schemaVersion:'JS_ARCHIVE_R1_POSTFREEZE_TECHNICAL_CORRECTION_V1',qualityContractVersion:root.qualityContractVersion,executionLine:'CODEX',examUid:root.examUid,stage:'R1',decisionAuthority:'ROOT_DELEGATED',assignmentPath,assignmentSha256:sha(fs.readFileSync(assignmentPath)),rootDecisionPath:root.rootDecisionAbsolute,rootDecisionSha256:sha(fs.readFileSync(root.rootDecisionAbsolute)),allowedLocus:decision.allowedSerializationLocus,correction:decision.correction,targetQid:2,baselineCandidate:{absolutePath:root.workingJsAbsolute,rawSha256:sha(old),blobSha1:blob(old),preservedCopy:root.evidenceRootAbsolute+'\\R1.fresh.q2-q10-q13.candidate.before-q2-image-null-normalization.js'},correctedCandidate:{absolutePath:candidate,rawSha256:sha(next),blobSha1:blob(next)},changeProof:{removedProperty:'q2.image:null',newRepresentation:'property omitted; no referenced image',q2StudentContentChoicesUnchanged:true,q2AnswerSolutionMetaDifficultyUnchanged:true,allOtherQidsUnchanged:true,referencedAssetBytesUnchanged:true,independentAnswerFreezeReused:root.priorR1AnswerFreezeAbsolute,answerFreezeSha256:root.priorR1AnswerFreezeSha256,sourceScansOpened:false},originalFailureReport:{path:root.failedR1ValidatorReportAbsolute,sha256:root.failedR1ValidatorReportSha256},priorAggregate:{path:root.previousR1AggregateEvidenceAbsolute,sha256:root.previousR1AggregateEvidenceSha256},priorBundle:{path:root.studentBundleAbsolute,sha256:root.studentBundleSha256,preserved:true},createdAtUtc:new Date().toISOString()};
const receiptPath=path.join(root.evidenceRootAbsolute,'R1.fresh.q2-image-null-normalization.correction-receipt.json');
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({receiptPath,receiptSha256:sha(fs.readFileSync(receiptPath)),candidateRawSha256:sha(next),candidateBlobSha1:blob(next),q2ImagePropertyOmitted:true,onlyAuthorizedLocusChanged:true},null,2));


