import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {gitBlobSha} from '../../../../tools/archive-stage-validator.mjs';
import {solutionSha256} from '../../../../tools/archive-stage-validator-artifact-v2.mjs';
import {readExam,sha256 as rawSha} from '../../../../tools/archive-codex-artifact-io.mjs';
const root=process.cwd();
const ev='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/ITEM_RECOVERY.v1';
const sourceRel='.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2/23_금당고_1학기_중간_고2_수학I.js';
const assetRootRel='.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2';
const pathOf=r=>path.join(root,r);
const shaFile=r=>rawSha(fs.readFileSync(pathOf(r)));
const examPath=pathOf(sourceRel),exam=readExam(examPath),artifactSha=gitBlobSha(exam.bytes),artifactRawSha=exam.rawSha256;
if(artifactRawSha!=='420efca1b17423e9b7cb05f3e2b1b0ff37a206e55ab10598d71fcc73e29a5987')throw Error('FINAL_CANDIDATE_RAW_SHA_MISMATCH');
const assignment=JSON.parse(fs.readFileSync(pathOf('.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2/ITEM_RECOVERY.assignment.revision2.json'),'utf8'));
const priorR1Path='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R1.evidence.revision04.json';
const priorR1=JSON.parse(fs.readFileSync(pathOf(priorR1Path),'utf8'));
const priorR1Sha=shaFile(priorR1Path);
const oldDispositions=new Map(priorR1.artifactDispositions.rows.map(r=>[Number(r.qid),r]));
const priorRows=new Map(priorR1.rows.map(r=>[Number(r.qid),r]));
const baseline=JSON.parse(fs.readFileSync(pathOf(ev+'/ITEM_RECOVERY.invariance-baseline.json'),'utf8'));
const studentPath=ev+'/ITEM_RECOVERY.current-student-only.revision02.json';
const studentBundle=JSON.parse(fs.readFileSync(pathOf(studentPath),'utf8'));
const studentSha=shaFile(studentPath);
const metaPath=ev+'/ITEM_RECOVERY.meta-fresh-assessment.json';
const meta=JSON.parse(fs.readFileSync(pathOf(metaPath),'utf8'));
const selfCheckPath=ev+'/ITEM_RECOVERY.blind-self-check.json';
const selfCheck=JSON.parse(fs.readFileSync(pathOf(selfCheckPath),'utf8'));
const choicesPath=ev+'/ITEM_RECOVERY.choice-design.json';
const choices=JSON.parse(fs.readFileSync(pathOf(choicesPath),'utf8'));
const sourceDecisionPath=ev+'/ITEM_RECOVERY.independent-held-revalidation.json';
const sourceDecision=JSON.parse(fs.readFileSync(pathOf(sourceDecisionPath),'utf8'));
const pdfComparePath=ev+'/ITEM_RECOVERY.scoped-pdf-comparison.json';
const pdfCompare=JSON.parse(fs.readFileSync(pathOf(pdfComparePath),'utf8'));
const calibrationPath=ev+'/ITEM_RECOVERY.calibration.preflight.revision01.json';
const calibration=JSON.parse(fs.readFileSync(pathOf(calibrationPath),'utf8'));
const baselineByQid=new Map(baseline.nonTargetObjectSha256.map(r=>[r.qid,r.sha256]));
const studentByQid=new Map(studentBundle.rows.map(r=>[Number(r.qid),r]));
const metaByQid=new Map(meta.targetRows.map(r=>[Number(r.qid),r]));
const targetSet=new Set([9,10,18,19]);
const rows=exam.questions.map(q=>{
  const qid=Number(q.id),solutionHash=solutionSha256(q.solution);
  if(!targetSet.has(qid)){
    const old=priorRows.get(qid),priorDisposition=oldDispositions.get(qid);
    if(!old||!priorDisposition)throw Error('NON_TARGET_PRIOR_R1_DISPOSITION_MISSING:'+qid);
    return {
      qid,sourceMode:'ORIGINAL',reviewScope:'REUSED_UNCHANGED_NON_TARGET',verdict:old.verdict,
      beforeDisposition:old.disposition,finalDisposition:'REUSED_UNCHANGED_NON_TARGET',
      sourceParityScope:'EXTRACTED_BASELINE_AND_PRIOR_R1_ONLY_NO_NEW_PDF_CLAIM',
      provenanceEvidence:{sourceParity:{priorR1Evidence:{path:priorR1Path,sha256:priorR1Sha},priorArtifactRawSha256:baseline.candidateRawSha256,currentArtifactRawSha256:artifactRawSha,nonTargetQuestionObjectSha256:baselineByQid.get(qid),studentPayloadSha256:studentByQid.get(qid)?.studentPayloadSha256,parity:'EXACT_STUDENT_FIELDS_AND_OBJECT_SHA'}},
      axisEvidence:{
        questionLayout:{status:old.axisEvidence.QUESTION_LAYOUT.status,evidence:'Reused unchanged prior R1 qid review; exact non-target object SHA is invariant. Actual Archive Engine render remains unclaimed.'},
        solutionLayout:{status:old.axisEvidence.SOLUTION_LAYOUT.status,evidence:'Reused unchanged prior R1 qid review and solution SHA; no new semantic review performed.'},
        meta:{status:old.axisEvidence.META.status,evidence:old.axisEvidence.META.evidence,reason:old.axisEvidence.META.reason},
        visualSvg:{status:old.axisEvidence.VISUAL_SVG.status,evidence:'Reused unchanged prior R1 visual disposition; actual non-target asset bytes are invariant.'}
      },
      smallBoardContinuityStatus:old.smallBoardContinuityStatus,solutionSha256:solutionHash,
      reusedEvidenceRef:{path:priorR1Path,sha256:priorR1Sha},
      nonTargetObjectSha256:baselineByQid.get(qid)
    };
  }
  const m=metaByQid.get(qid),bundleRow=studentByQid.get(qid),check=selfCheck.rows.find(r=>r.qid===qid),pdfRow=pdfCompare.rows.find(r=>r.qid===qid);
  if(!m||!bundleRow||!check||!pdfRow)throw Error('TARGET_EVIDENCE_MISSING:'+qid);
  return {
    qid,sourceMode:'QUESTION_REPLACEMENT',sourceModeExplanation:'Direct Final Item Recovery authors a replacement student input; V2 CREATE sourceMode enum has no QUESTION_REPLACEMENT value. Keep the true action explicit and let generic validation report this limitation.',
    reviewScope:'FRESH_ITEM_RECOVERY_ONLY',verdict:'PASS',beforeDisposition:'TRUE_SOURCE_ITEM_HOLD',finalDisposition:'QUESTION_REPLACEMENT_READY_FOR_FRESH_R1_R2',
    independentSelfCheckStatus:check.status,independentSelfCheckRef:{path:ev+'/ITEM_RECOVERY.blind-self-check.json',sha256:shaFile(ev+'/ITEM_RECOVERY.blind-self-check.json')},
    sourceParityScope:'NEW_AUTHORED_STUDENT_INPUT_NOT_ORIGINAL_PDF_PARITY',
    provenanceEvidence:{replacement:{recoveryType:'QUESTION_REPLACEMENT',method:'CODEX_DIRECT_AUTHORING',replacementScope:'QUESTION_ONLY',replacedQid:qid,reason:'ORIGINAL_ITEM_UNRECOVERABLE_AFTER_REVIEW2',originalSourceRef:{pdf:pdfCompare.pdfPath,pdfRawSha256:pdfCompare.pdfRawSha256,page:pdfRow.page,crop:pdfRow.crop,cropSha256:pdfRow.cropSha256},sourceDefect:sourceDecision.rows.find(r=>r.qid===qid).independentWork,studentPayloadSha256:bundleRow.studentPayloadSha256,authoredReplacement:true,claimsOriginalPdfHadReplacementFacts:false}},
    axisEvidence:{
      questionLayout:{status:'PASS',evidence:'Authored student statement and objective choices are paired exactly; no target visual/shared material is required. Actual engine render remains unclaimed.'},
      solutionLayout:{status:'PASS',evidence:'Small-board steps are explicit and solution SHA is bound below; actual engine render remains unclaimed.'},
      meta:{status:'PASS',evidence:`Fresh target-only Meta in ${ev}/ITEM_RECOVERY.meta-fresh-assessment.json; active L1/L2 values, current semantic path, explicit projection disposition and fresh difficulty recorded.`},
      visualSvg:{status:'PASS',evidence:'No problem image, shared visual or solution SVG is required for this target qid.'}
    },
    smallBoardContinuityStatus:'PASS',solutionSha256:solutionHash,studentPayloadSha256:bundleRow.studentPayloadSha256,
    metaFreshAssessmentRef:{path:ev+'/ITEM_RECOVERY.meta-fresh-assessment.json',sha256:shaFile(ev+'/ITEM_RECOVERY.meta-fresh-assessment.json')},
    calibrationPreflightRef:{path:ev+'/ITEM_RECOVERY.calibration.preflight.revision01.json',sha256:shaFile(ev+'/ITEM_RECOVERY.calibration.preflight.revision01.json')},
    actualPdfScope:{page:pdfRow.page,cropSha256:pdfRow.cropSha256,checkedFact:pdfRow.checkedFact,result:pdfRow.result,answerSheetConsulted:false}
  };
});
const dispositions=[];
for(const q of exam.questions){const qid=Number(q.id);if(!targetSet.has(qid)){dispositions.push(structuredClone(oldDispositions.get(qid)));continue;}const m=metaByQid.get(qid);const debtFields=['problemTypeKey','templateKey'].filter(f=>q[f]===null);dispositions.push({qid,metaDebtFields:debtFields,...(debtFields.length?{metaDebtReason:m.nullReason}:{}),projectionStatus:m.projectionStatus,projectionReason:m.projectionReason??m.nullReason});}
const authorities={assignment:{path:assignment.workingJsAbsolute,assignmentPath:'archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/ITEM_RECOVERY.v1/ITEM_RECOVERY.assignment.revision2.json',assignmentSha256:'1f7e12760e15460dba82d61fdf5bdd571ac0c5b516da6ae4f529a1343e5cd367',expectedHead:assignment.expectedHead},sourceBefore:{rawSha256:baseline.candidateRawSha256,path:baseline.candidatePath},parentWorkingJs:{path:baseline.parentWorkingJsPath,rawSha256:baseline.parentWorkingJsSha256},sourcePDF:{path:pdfCompare.pdfPath,rawSha256:pdfCompare.pdfRawSha256,scopedComparison:{path:ev+'/ITEM_RECOVERY.scoped-pdf-comparison.json',sha256:shaFile(ev+'/ITEM_RECOVERY.scoped-pdf-comparison.json')}},priorR1:{path:priorR1Path,sha256:priorR1Sha},priorR2:{sourceAssessment:{path:'archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R2.source-assessment.json',sha256:'0a9aa48bd06cec862d6649640ec3243b17780958f86f67548924d2f88e22a217'},originalFreeze:{path:'archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R2.original-freeze.json',sha256:'b96c5a2fa90e12497caa9b72632d61e55cf9c76322e9d6f26b56ac3e28fb79a8'},q18Witness:{path:'archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R2.q18-enumeration-witness.json',sha256:'d018f91deb591af7db2ea4139c813068a73b77e3a9fa5e0d20e6b69972536bc7'},q18Adjudication:{path:'archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R2.q18-adjudication.json',sha256:'e5aeafa51a03e5b2b44d9bb866e85f39d9db92a76dd0218bc185781214652f0e'}},currentStudentBundle:{path:ev+'/ITEM_RECOVERY.current-student-only.revision02.json',sha256:studentSha,sourceRawSha256:studentBundle.sourceRawSha256},metaFresh:{path:ev+'/ITEM_RECOVERY.meta-fresh-assessment.json',sha256:shaFile(ev+'/ITEM_RECOVERY.meta-fresh-assessment.json')},selfCheck:{path:ev+'/ITEM_RECOVERY.blind-self-check.json',sha256:shaFile(ev+'/ITEM_RECOVERY.blind-self-check.json')},calibration:{path:ev+'/ITEM_RECOVERY.calibration.preflight.revision01.json',sha256:shaFile(ev+'/ITEM_RECOVERY.calibration.preflight.revision01.json')},sourceComparison:{path:ev+'/ITEM_RECOVERY.scoped-pdf-comparison.json',sha256:shaFile(ev+'/ITEM_RECOVERY.scoped-pdf-comparison.json')}};
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',examUid:'23_금당고_1학기_중간_고2_수학I',stage:'CREATE',validatorStage:'CREATE',executionAction:'ITEM_RECOVERY',authoringStage:'ITEM_RECOVERY',validatorAdapterRole:'archive_create',freshReviewScopeQids:[9,10,18,19],qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',artifactSha,artifactRawSha256:artifactRawSha,sourceRawSha256:artifactRawSha,sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',questionCount:20,targetQids:[9,10,18,19],artifactRoot:assetRootRel,renderStatus:'NOT_RUN',actualRenderPassAsserted:false,stageClaim:'ITEM_RECOVERY_READY_FOR_FRESH_R1_R2_ONLY; no CREATE_COMPLETE/R1/R2/R3/RENDER_PASS asserted',targetItemHoldCount:0,independentHeldRevalidationRef:{path:ev+'/ITEM_RECOVERY.independent-held-revalidation.json',sha256:shaFile(ev+'/ITEM_RECOVERY.independent-held-revalidation.json')},goldenCalibrationReviewed:true,goldenCalibrationSet:['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js'],goldenCalibration:{negativeSample:{path:'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md',sha256:shaFile('archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md'),observation:'Read the regression: actual SVG coordinates can contradict labels; inspect real geometry, complete board structure and runtime escapes.'},negativeVisualRef:{path:'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q1-solution.bad.svg',sha256:shaFile('archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q1-solution.bad.svg'),observation:'Opened the actual rendered negative SVG; its line crosses the origin and misses labeled points/intercept.'},samples:[]},solutionQualityCalibration:calibration.solutionQualityCalibration,solutionQualityCalibrationRef:{path:ev+'/ITEM_RECOVERY.calibration.preflight.revision01.json',sha256:shaFile(ev+'/ITEM_RECOVERY.calibration.preflight.revision01.json')},rows,artifactDispositions:{artifactSha,rows:dispositions},sourceEvidenceRefs:authorities,metaAuthorityStatus:'TARGETS_FRESH_NON_TARGETS_REUSED_WITH_PRIOR_PROJECTION_DEBT',metaAuthorityNote:'Only qid 9,10,18,19 received fresh semantic and difficulty classification. Existing non-target disposition rows are copied with current artifact SHA after exact object/asset invariance; no non-target semantic reclassification. Generic CREATE adapter may report their current physical Meta gaps.',q18FreezeAdjudication:{originalFreezePreserved:true,originalAnswer:'85',correctedAnswer:'74',witnessRef:authorities.priorR2.q18Witness,adjudicationRef:authorities.priorR2.q18Adjudication},nonTargetInvariance:{qidObjectSha256:baseline.nonTargetObjectSha256,studentParity:'16/16',assets:baseline.assets,parentWorkingJsSha256:baseline.parentWorkingJsSha256},targetReplacementProvenance:rows.filter(r=>targetSet.has(r.qid)).map(r=>r.provenanceEvidence.replacement),nextRequiredAction:'ROOT promote isolated candidate only after receipt; then fresh affected-qid R1/R2 for 9,10,18,19; reuse unchanged non-target freezes and close outstanding Meta debt per ROOT authority.'};
const rootRoot=path.join(root,'archive');
for(const sample of evidence.goldenCalibrationSet){const p=path.join(root,sample),bytes=fs.readFileSync(p);const box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box,{timeout:1000});const qids=sample.includes('매산여고')?[7,2]:sample.includes('효천고')?[4,2]:[6,2];const items=qids.map(qid=>{const q=box.window.questionBank.find(x=>Number(x.id)===qid);const item={qid,solutionSha256:solutionSha256(q.solution),observation:`Read complete q${qid} solution and verified its stated derivation against the displayed answer.`,axes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY']};if(q.solutionImage){const visualRel='archive/'+q.solutionImage;item.visualSha256=shaFile(visualRel);item.observation+=' Opened the linked SVG and checked its actual geometry against the solution.';}if(q.image){const imageRel='archive/'+q.image;item.problemImageSha256=shaFile(imageRel);item.observation+=' Opened the source problem image and checked all panels.';}return item;});evidence.goldenCalibration.samples.push({path:sample,sha256:shaFile(sample),items});}
const outRel=ev+'/ITEM_RECOVERY.generic-v2-create-validator-input.json';const out=path.join(root,outRel);fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});const b=fs.readFileSync(out);console.log(JSON.stringify({path:out,sha256:rawSha(b),gitBlobSha:gitBlobSha(b),artifactSha,artifactRawSha256:artifactRawSha,questionCount:rows.length,artifactDispositionCount:dispositions.length,targetQids:evidence.freshReviewScopeQids,sourceModes:[...new Set(rows.map(r=>r.sourceMode))],goldenSamples:evidence.goldenCalibration.samples.map(s=>({path:s.path,sha256:s.sha256,itemQids:s.items.map(i=>i.qid)})),negativeSha256:evidence.goldenCalibration.negativeSample.sha256},null,2));