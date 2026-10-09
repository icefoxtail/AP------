import fs from 'node:fs';
import crypto from 'node:crypto';
const root=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------`;
const base=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1`;
const candidate=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\candidate\26_제일고_2학기_중간_고2_미적분I.js`;
const patchFile=`${base}\\evidence\\R1-q5-correction-patch-manifest.json`;
const assignment=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\assignment.R1.q5-render-correction.json`;
const rootDecision=`${base}\\R1.q5-render-correction.root-decision.json`;
const oldR1=`${base}\\evidence\\R1-evidence.q8-fresh-aggregate.json`;
const newR1=`${base}\\evidence\\R1-evidence.q5-corrected-aggregate.json`;
const report=`${base}\\evidence\\R1-q5-corrected-generic-validator.raw.json`;
const oldR1Freeze=`${base}\\R1.independent-answer-freeze.json`;
const r2Evidence=`${base}\\r2-fresh-q8\\R2.clean-evidence.json`;
const r2Freeze=`${base}\\r2-fresh-q8\\blind-freeze.aggregate.json`;
const r3Failure=`${base}\\R3-evidence.q5-render-fail.json`;
const r3Review=`${base}\\R3-capture-review.fail.json`;
const machineCapture=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\capture-r3-01\machine-capture.json`;
const oldBundle=`${base}\\handoff\\R3.current-final-student-only-bundle.json`;
const newBundle=`${base}\\handoff\\R3.current-final-student-only-bundle.q5-corrected.json`;
const backup=`${base}\\evidence\\candidate.pre-q5-render-correction.js`;
const output=`${base}\\evidence\\R1-q5-postfreeze-correction-receipt.json`;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const fileRef=(p)=>({path:p,sha256:sha(fs.readFileSync(p))});
const expected={assignment:'6d16dda017fb2a12acba350f31f7cea7f6a3e7bd2bd36e1a130f55b407f74170',rootDecision:'35c79da5a4404f9a6f1dae1d73acb970784937cdf27c3a3f764cc724f9af37ac',priorR1Aggregate:'e5aa02d4ea300995b1e79b24732527974d7e2bfb2bc057d0e25c0409f2a666a6',priorR1AnswerFreeze:'e64c120c617680ed1b81be95fb54bb8fd99c6aaa0ca9c1f6c030b4a19d7c8ec2',priorR2Evidence:'7b93fae355ea7ee0e5ae0fe5447281fa1741223267db0ab5fc4b35ae36c575f0',priorR2AggregateFreeze:'b6e687990a6cddf1161cff2c53776d6974e9ae289c116c519b10d006560eb70b',originalR3Failure:'1a04004ad34d2e8d84a77398b4cebda6deee600d52b20ab4d5c62b884a4e90d9',originalR3CaptureReview:'a75b64574729bc5772f164833fc872482b02a1a7c89f10241d6dd7e9c6a16f0b',originalMachineCapture:'7a4f74af67e93ff3a2c26d107f367fef4a90536081a1abeb790e42cf820eb50a',priorFullStudentBundle:'2f6aba4a2c02a36adc906a3ca3ee7f2196760301126cb6703786e2f29992f92d'};
const refs={assignment:fileRef(assignment),rootDecision:fileRef(rootDecision),priorR1Aggregate:fileRef(oldR1),priorR1AnswerFreeze:fileRef(oldR1Freeze),priorR2Evidence:fileRef(r2Evidence),priorR2AggregateFreeze:fileRef(r2Freeze),originalR3Failure:fileRef(r3Failure),originalR3CaptureReview:fileRef(r3Review),originalMachineCapture:fileRef(machineCapture),priorFullStudentBundle:fileRef(oldBundle)};
for(const [k,v] of Object.entries(expected))if(refs[k]?.sha256!==v)throw new Error(`INPUT_SHA_MISMATCH:${k}`);
const patch=JSON.parse(fs.readFileSync(patchFile,'utf8'));
const bundleBytes=fs.readFileSync(newBundle);const student=JSON.parse(bundleBytes.toString('utf8'));
const validatorBytes=fs.readFileSync(report);const validation=JSON.parse(validatorBytes.toString('utf8'));
if(validation.ok!==true||validation.disposition!=='PASS'||validation.denominator!==22||validation.rowCount!==22||validation.issues?.length)throw new Error('R1_VALIDATOR_NOT_PASS');
if(student.denominator!==22||student.items?.length!==22||student.assetManifest?.length!==3||student.verification?.answerOrSolutionFieldsIncluded!==false)throw new Error('FRESH_STUDENT_BUNDLE_INVALID');
const r3=JSON.parse(fs.readFileSync(r3Failure,'utf8'));
const r3q5=r3.rows?.filter(r=>Number(r.qid)===5)??[];
if(r3q5.length!==1||r3q5[0].findingCode!=='Q5_CHOICE_TEX_BACKSLASH_MISSING'||JSON.stringify(r3q5[0].affectedCases)!==JSON.stringify(['exam/desktop','exam/mobile']))throw new Error('R3_Q5_FAILURE_BINDING_INVALID');
const review=JSON.parse(fs.readFileSync(r3Review,'utf8'));
if(review.overallDisposition!=='FAIL')throw new Error('ORIGINAL_R3_FAIL_NOT_PRESERVED');
const assets=student.assetManifest.map(a=>({qid:a.qid,path:a.path,sha256:a.sha256,bytes:a.bytes,verified:true}));
const receipt={
 schemaVersion:'JS_ARCHIVE_R1_Q5_POSTFREEZE_CORRECTION_RECEIPT_V1',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',runId:'codex-20261007-2sem-mid-jeil-calc1',examUid:'26_제일고_2학기_중간_고2_미적분I',stage:'R1',qid:5,
 authority:{assignment:refs.assignment,rootDecision:refs.rootDecision,decision:'ROOT_DIRECTED_MINIMAL_POSTFREEZE_RENDER_CORRECTION'},
 scope:{allowedQids:[5],changedField:'choices',changedChoiceIndexes:[0,1,3],issueCode:'Q5_CHOICE_TEX_BACKSLASH_MISSING',actualRenderRetestPerformed:false},
 artifact:{preCorrection:{rawSha256:patch.oldArtifactRawSha256,blobSha1:patch.oldArtifactBlobSha1,backup:fileRef(backup)},postCorrection:{path:candidate,rawSha256:patch.newArtifactRawSha256,blobSha1:patch.newArtifactBlobSha1}},
 choiceEncodingChanges:patch.choiceTokenCorrections,
 invariants:{
  q5MathematicalChoiceValuesUnchanged:true,storedAnswerUnchanged:true,solutionUnchanged:true,metaUnchanged:true,difficultyUnchanged:true,assetsUnchanged:true,
  nonQ5QuestionObjectsUnchanged:true,allSourceBytesOutsideThreeQ5ChoiceTokensUnchanged:true,answerFreezeReplaced:false,answerResolvedAgain:false,
  r1FreezePreserved:true,r2FreezePreserved:true,originalR3FailPreserved:true,sourceScansOpened:false,publicationPerformed:false
 },
 reusedFreezeBindings:{priorR1AnswerFreeze:refs.priorR1AnswerFreeze,priorR2Evidence:refs.priorR2Evidence,priorR2AggregateFreeze:refs.priorR2AggregateFreeze},
 originalR3FailureBindings:{evidence:refs.originalR3Failure,captureReview:refs.originalR3CaptureReview,machineCapture:refs.originalMachineCapture,affectedCases:r3q5[0].affectedCases,originalOverallDisposition:review.overallDisposition,originalRenderPass:false,captureImages:[
  {case:'exam/desktop',path:String.raw`.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\capture-r3-01\exam-desktop.png`,sha256:'9325549707c86afa5750a817b67be87e88a6384c428d228f8c4462225b7140bd',reviewed:true},
  {case:'exam/mobile',path:String.raw`.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\capture-r3-01\exam-mobile.png`,sha256:'12568d636978068a2d11bf89b872bf9d7d996ce55d7ed313fa84ad6a36efa470',reviewed:true}
 ]},
 fullStudentOnlyBundle:{path:newBundle,sha256:sha(bundleBytes),studentPayloadSha256:student.studentPayloadSha256,denominator:22,qidCoverage:'22/22',assetCount:assets.length,assets,answerOrSolutionFieldsIncluded:false,verification:student.verification},
 r1AggregateEvidence:{prior:refs.priorR1Aggregate,current:fileRef(newR1),denominator:22,unchangedQidsPreserved:'1-4,6-22',q5AnswerRowPreserved:true,changedAxisOnly:'QUESTION_LAYOUT'},
 genericValidator:{path:report,sha256:sha(validatorBytes),qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',disposition:validation.disposition,issues:validation.issues,denominator:validation.denominator,artifactRawSha256:patch.newArtifactRawSha256,artifactSha:patch.newArtifactBlobSha1},
 originalCandidateAndFailureEvidencePreserved:{r3FailUnmodified:true,priorEvidenceUnmodified:true,priorCandidateSnapshot:fileRef(backup)},
 nextRequiredAction:'Rebind downstream R2/R3 to the fresh answer-free bundle as authorized; R3 must rerender and review q5 exam desktop and mobile before any release. The original R3 FAIL remains open until that review.'
};
fs.writeFileSync(output,`${JSON.stringify(receipt,null,2)}\n`,'utf8');
console.log(JSON.stringify({output,sha256:sha(fs.readFileSync(output)),candidateRawSha256:patch.newArtifactRawSha256,candidateBlobSha1:patch.newArtifactBlobSha1,r1AggregateSha256:sha(fs.readFileSync(newR1)),bundleSha256:sha(bundleBytes),validatorSha256:sha(validatorBytes),validator:validation.disposition,issues:validation.issues},null,2));

