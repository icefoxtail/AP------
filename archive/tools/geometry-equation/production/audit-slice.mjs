import {readBoundFile,objectSha} from '../../pipeline-core/canonical.mjs';
import {planHash} from './contracts.mjs';
import {sourcePolicyFingerprint,verifiedSolutionPolicyFingerprint} from './source-policy.mjs';
import {validateReviewLineage} from './blinded-review.mjs';
import {resolveQuestion} from './resolve-request.mjs';
export function auditSlice(root,resultRef){
  const result=JSON.parse(readBoundFile(root,resultRef)),errors=[],stages=[];
  if(result.identityStatus!=='CANONICAL_CURRENT'||!result.sourceRegistryRef)errors.push('CANONICAL_UID_AUTHORITY_REQUIRED');
  else {try{const authority=resolveQuestion(root,{questionUid:result.identity.questionUid,sourceRegistryRef:result.sourceRegistryRef});if(authority.sourceRef.sha256!==result.sourceRef.sha256)errors.push('CANONICAL_SOURCE_MISMATCH');}catch(error){errors.push(error.message);}}
  if(result.status!=='PHASE2_SLICE_COMPLETE'||result.productionAuthorized!==false||result.qualificationStatus!=='NOT_QUALIFIED')errors.push('NOT_A_COMPLETE_EXPERIMENTAL_SLICE');
  for(const ref of result.stages||[]){
    const {receiptSha256,...stage}=JSON.parse(readBoundFile(root,ref));
    if(objectSha(stage)!==receiptSha256)errors.push('STALE_STAGE_MANIFEST');
    stage.outputs.forEach(output=>readBoundFile(root,output));stages.push(stage);
  }
  for(const name of ['UID_AUTHORITY','VERIFIED_SOLUTION','PLAN','SOURCE_REVIEW','MATH','MATH_REVIEW','TYPESET','MEASURE','NORMALIZE','BUILD','STATIC_AUDIT','ARCHIVE_BANK','CAPTURE','VISUAL_REVIEW'])if(!stages.some(s=>s.stage===name))errors.push('STAGE_MISSING:'+name);
  const plan=JSON.parse(readBoundFile(root,result.planRef));if(planHash(plan)!==plan.planSha256)errors.push('STALE_PLAN');
  if(plan.sourceReviewPolicySha256!==sourcePolicyFingerprint(root))errors.push('STALE_SOURCE_REVIEW_POLICY');
  const verification=JSON.parse(readBoundFile(root,plan.verifiedSolutionRef));
  if(plan.verifiedSolutionPolicySha256!==verifiedSolutionPolicyFingerprint(root)||!validateReviewLineage(root,verification,'SOLUTION',plan.verifiedSolutionPolicySha256,plan.verificationInputSha256))errors.push('STALE_OR_UNBLINDED_SOLUTION_VERIFICATION');
  const sourceReview=stages.filter(s=>s.stage==='SOURCE_REVIEW').map(s=>JSON.parse(readBoundFile(root,s.outputs[0]))).find(r=>r.inputSha256===plan.sourceReviewInputSha256);
  const visual=JSON.parse(readBoundFile(root,result.independentVisualReviewRef));
  if(!sourceReview||!validateReviewLineage(root,sourceReview,'CONDITIONS',plan.sourceReviewPolicySha256,sourceReview.inputBindingSha256))errors.push('SOURCE_REVIEW_BLIND_FREEZE_COMPARE_REQUIRED');
  for(const record of [verification,sourceReview,visual])if(record?.output?.status!=='PASS'||record.subagentToolsEnabled!==false||!record.providerInvocationId||!record.contextId)errors.push('PROVIDER_REVIEW_NOT_BOUND');
  if(new Set([verification.contextId,sourceReview?.contextId,visual.contextId]).size!==3)errors.push('REVIEW_CONTEXT_NOT_INDEPENDENT');
  if(visual.inputPacket.finalSvgSha256!==result.finalSvgRef.sha256)errors.push('REVIEW_SVG_BINDING_MISMATCH');
  readBoundFile(root,result.finalSvgRef);readBoundFile(root,result.sourceRef);readBoundFile(root,result.solutionRef);
  const capture=stages.findLast(s=>s.stage==='CAPTURE');
  const screenshotShas=new Set(capture.outputs.filter(o=>o.path.endsWith('.png')).map(o=>o.sha256));
  if(!screenshotShas.has(visual.inputPacket.screenshotSha256)||!screenshotShas.has(visual.inputPacket.nativeContextScreenshotSha256))errors.push('REVIEW_CAPTURE_BINDING_MISMATCH');
  if(result.actualArchive.status!=='PASS')errors.push('ACTUAL_ARCHIVE_NOT_PASS');
  const rawRows=capture.outputs.filter(o=>o.path.endsWith('desktop.json')).map(o=>JSON.parse(readBoundFile(root,o)));
  if(!rawRows.length||rawRows.some(r=>r.status!=='PASS'))errors.push('ACTUAL_CAPTURE_ROW_NOT_PASS');
  const fonts=rawRows.flatMap(r=>r.layouts.flatMap(l=>l.labelMeasurements.map(m=>m.finalViewportCssFontPx)));
  if(!fonts.length||Math.min(...fonts)<11)errors.push('FONT_GATE');
  return {status:errors.length?'FAIL':'PASS',errors,questionUid:result.identity.questionUid,minCssFont:Math.min(...fonts),finalSvgRef:result.finalSvgRef,stageCount:stages.length,resultRef,productionAuthorized:false};
}
