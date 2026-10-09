import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const assignment=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const receiptPath=path.join(assignment.evidenceRootAbsolute,'R1.fresh.q2-image-null-normalization.correction-receipt.json');
const receipt=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
const oldPath=assignment.previousR1AggregateEvidenceAbsolute;
const oldBytes=fs.readFileSync(oldPath);if(sha(oldBytes)!==assignment.previousR1AggregateEvidenceSha256)throw new Error('PRIOR_AGGREGATE_SHA_MISMATCH');
const old=JSON.parse(oldBytes);
const bundlePath=path.join(assignment.evidenceRootAbsolute,'handoff','R1-R2.student-only-bundle.after-q2-image-null-normalization.json');
const bundleBytes=fs.readFileSync(bundlePath),bundleSha=sha(bundleBytes),bundle=JSON.parse(bundleBytes);
const candidateBytes=fs.readFileSync(assignment.workingJsAbsolute),rawSha=sha(candidateBytes);
if(rawSha!==receipt.correctedCandidate.rawSha256)throw new Error('CANDIDATE_RAW_SHA_MISMATCH');
const candidateBlob=receipt.correctedCandidate.blobSha1;
if(bundle.sourceRawSha256!==rawSha||bundle.sourceArtifactSha!==candidateBlob)throw new Error('BUNDLE_CANDIDATE_BINDING_MISMATCH');
if(bundle.questions.length!==24||bundle.qids.length!==24||bundle.assets.length!==17)throw new Error('BUNDLE_DENOMINATOR_OR_ASSET_COUNT_MISMATCH');
const out=structuredClone(old);
out.artifactSha=candidateBlob;
out.artifactRawSha256=rawSha;
out.sourceArtifactBinding={...out.sourceArtifactBinding,workingJsAbsolute:assignment.workingJsAbsolute,baselineArtifactRawSha256:assignment.artifactRawSha256,actualArtifactRawSha256:rawSha,validatorRawBufferBlobSha1:candidateBlob,gitCleanFilterBlobSha1:candidateBlob,postfreezeCorrectionReceiptPath:receiptPath,postfreezeCorrectionReceiptSha256:sha(fs.readFileSync(receiptPath))};
out.sourceIdentity={...out.sourceIdentity,routeDecisionPath:assignment.sourceIdentityRouteDecisionAbsolute,routeDecisionSha256:assignment.sourceIdentityRouteDecisionSha256,sourceRosterPath:assignment.sourceRosterAbsolute,sourceRosterSha256:assignment.sourceRosterSha256,printedIdentity:'중1',denominator:24,artifactSha:candidateBlob,artifactRawSha256:rawSha};
out.studentInput={...out.studentInput,bundlePath,bundleSha256:bundleSha,sourceArtifactRawSha256:rawSha,sourceArtifactSha:candidateBlob,qidCount:bundle.qids.length,payloadHashCount:bundle.questions.length,payloadHashFailures:0,assetCount:bundle.assets.length,assetHashFailures:0,assetsOpened:[{qid:10,ref:'assets/images/26_팔마중_2학기_중간_중1_기출/q10.png',sha256:'21cd346bfa799230787c82e2cecf9e396d8f76eab80d56e48bfa964b6131547d'},{qid:13,ref:'assets/images/26_팔마중_2학기_중간_중1_기출/q13.png',sha256:'8a20320138e0e70a1fc9f4f3c73a4551bc93838ea6b41d0f71090110a4f3defe'}],postfreezeCorrectionReceiptPath:receiptPath,postfreezeCorrectionReceiptSha256:sha(fs.readFileSync(receiptPath)),previousBundlePreserved:{path:assignment.studentBundleAbsolute,sha256:assignment.studentBundleSha256}};
out.postfreezeExtraction={...out.postfreezeExtraction,workingJsAbsolute:assignment.workingJsAbsolute,artifactSha:candidateBlob,artifactRawSha256:rawSha,qids:[2,10,13],extractedAfterFreeze:true,sourceSerializationCorrection:'q2.image property omitted',answerFreezeReused:assignment.priorR1AnswerFreezeAbsolute,answerFreezeSha256:assignment.priorR1AnswerFreezeSha256};
out.independentAnswerFreeze={...out.independentAnswerFreeze,path:assignment.priorR1AnswerFreezeAbsolute,sha256:`sha256:${assignment.priorR1AnswerFreezeSha256}`,status:'FROZEN_BEFORE_STORED_ANSWER_DISCLOSURE_AND_REUSED_AFTER_POSTFREEZE_SERIALIZATION_CORRECTION',qidCount:3,qids:[2,10,13]};
out.postfreezeTechnicalCorrection={authority:'ROOT_DELEGATED',assignmentPath:process.argv[2],assignmentSha256:sha(fs.readFileSync(process.argv[2])),rootDecisionPath:assignment.rootDecisionAbsolute,rootDecisionSha256:sha(fs.readFileSync(assignment.rootDecisionAbsolute)),receiptPath,receiptSha256:sha(fs.readFileSync(receiptPath)),targetQid:2,changedLocus:'image:null property removed',studentFieldsChanged:false,freezeReused:true,priorFailureReport:{path:assignment.failedR1ValidatorReportAbsolute,sha256:assignment.failedR1ValidatorReportSha256},baselineCandidate:{rawSha256:assignment.artifactRawSha256,blobSha1:assignment.validatorRawBufferBlobSha1},correctedCandidate:{rawSha256:rawSha,blobSha1:candidateBlob},reboundBundle:{path:bundlePath,sha256:bundleSha}};
for(const r of out.rows){
 if(r.sourceIdentity){r.sourceIdentity={...r.sourceIdentity,sourceArtifactSha:candidateBlob,artifactRawSha256:rawSha,studentBundleSha256:bundleSha};}
}
const q2=out.rows.find(r=>Number(r.qid)===2);if(!q2||q2.verdict!=='PASS'||q2.independentAnswer!=='④')throw new Error('Q2_R1_ROW_BINDING_OR_VERDICT_INVALID');
q2.sourceIdentity={...(q2.sourceIdentity||{}),sourceArtifactSha:candidateBlob,artifactRawSha256:rawSha,studentBundleSha256:bundleSha,normalizationReceiptSha256:sha(fs.readFileSync(receiptPath))};
q2.axisEvidence.QUESTION_LAYOUT.payloadSha256=bundle.questions.find(q=>q.id===2).payloadSha256;
q2.axisEvidence.QUESTION_LAYOUT.imageRefParity=(bundle.questions.find(q=>q.id===2).image===null);
q2.axisEvidence.VISUAL_SVG.questionImageRef=null;q2.axisEvidence.VISUAL_SVG.questionImageSha256=null;q2.axisEvidence.VISUAL_SVG.questionImageOpened=false;
q2.axisEvidence.VISUAL_SVG.note='No image property or referenced asset exists after the authorized serialization normalization; question remains self-contained and no solution visual is needed.';
const qids=out.rows.map(r=>Number(r.qid));if(qids.length!==24||qids.some((qid,i)=>qid!==i+1))throw new Error('FULL_R1_QID_ROSTER_INVALID');
const outPath=path.join(assignment.evidenceRootAbsolute,'R1.fresh.q2-q10-q13.evidence.after-q2-image-null-normalization.json');
fs.writeFileSync(outPath,JSON.stringify(out,null,2)+'\n','utf8');
console.log(JSON.stringify({evidencePath:outPath,evidenceSha256:sha(fs.readFileSync(outPath)),candidateRawSha256:rawSha,candidateBlobSha1:candidateBlob,bundlePath,bundleSha256:bundleSha,qidCount:out.rows.length,targetRows:out.rows.filter(r=>[2,10,13].includes(Number(r.qid))).map(r=>({qid:r.qid,independentAnswer:r.independentAnswer,storedAnswer:r.storedAnswer,verdict:r.verdict,axes:Object.fromEntries(Object.entries(r.axisEvidence||{}).map(([k,v])=>[k,v.status]))}))},null,2));
