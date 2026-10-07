import {readBoundFile,objectSha} from '../../pipeline-core/canonical.mjs';
import {planHash} from './contracts.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {qualifyDisplayEnvelope,compareActualDisplayEnvelope} from './display-envelope.mjs';
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
  for(const name of ['UID_AUTHORITY','VERIFIED_SOLUTION','PLAN','SOURCE_REVIEW','MATH','MATH_REVIEW','TYPESET','MEASURE','NORMALIZE','DISPLAY_ENVELOPE_PREFLIGHT','DISPLAY_ENVELOPE','BUILD','STATIC_AUDIT','DISPLAY_ENVELOPE_AUDIT','DISPLAY_ENVELOPE_ACTUAL','DISPLAY_ENVELOPE_FINAL','ARCHIVE_BANK','CAPTURE','VISUAL_REVIEW'])if(!stages.some(s=>s.stage===name))errors.push('STAGE_MISSING:'+name);
  const plan=JSON.parse(readBoundFile(root,result.planRef));if(planHash(plan)!==plan.planSha256)errors.push('STALE_PLAN');
  if(plan.graphPlan){
    if(!stages.some(s=>s.stage==='GRAPH_OVERVIEW_FRAME'))errors.push('GRAPH_OVERVIEW_FRAME_REQUIRED');
    const staticGraph=stages.findLast(s=>s.stage==='STATIC_AUDIT'),displayGraph=stages.findLast(s=>s.stage==='DISPLAY_GRAPH_REVIEW');
    if(!staticGraph||JSON.parse(readBoundFile(root,staticGraph.outputs[0])).graph?.overview?.status!=='PASS')errors.push('GRAPH_OVERVIEW_STATIC_NOT_CLOSED');
    if(!displayGraph||JSON.parse(readBoundFile(root,displayGraph.outputs[0])).overview?.status!=='PASS')errors.push('GRAPH_OVERVIEW_ACTUAL_SIZE_NOT_CLOSED');
  }
  if(plan.sourceReviewPolicySha256!==sourcePolicyFingerprint(root))errors.push('STALE_SOURCE_REVIEW_POLICY');
  const verification=JSON.parse(readBoundFile(root,plan.verifiedSolutionRef));
  if(plan.verifiedSolutionPolicySha256!==verifiedSolutionPolicyFingerprint(root)||!validateReviewLineage(root,verification,'SOLUTION',plan.verifiedSolutionPolicySha256,plan.verificationInputSha256))errors.push('STALE_OR_UNBLINDED_SOLUTION_VERIFICATION');
  const sourceReview=stages.filter(s=>s.stage==='SOURCE_REVIEW').map(s=>JSON.parse(readBoundFile(root,s.outputs[0]))).find(r=>r.inputSha256===plan.sourceReviewInputSha256);
  const visual=JSON.parse(readBoundFile(root,result.independentVisualReviewRef));
  if(!sourceReview||!validateReviewLineage(root,sourceReview,'CONDITIONS',plan.sourceReviewPolicySha256,sourceReview.inputBindingSha256))errors.push('SOURCE_REVIEW_BLIND_FREEZE_COMPARE_REQUIRED');
  for(const record of [verification,sourceReview,visual])if(record?.output?.status!=='PASS'||record.subagentToolsEnabled!==false||!record.providerInvocationId||!record.contextId)errors.push('PROVIDER_REVIEW_NOT_BOUND');
  if(new Set([verification.contextId,sourceReview?.contextId,visual.contextId]).size!==3)errors.push('REVIEW_CONTEXT_NOT_INDEPENDENT');
  if(visual.inputPacket.finalSvgSha256!==result.finalSvgRef.sha256)errors.push('REVIEW_SVG_BINDING_MISMATCH');
  let envelope=null,profileRefs=[],actualComparison=null;
  try{
    const displayPlan=JSON.parse(readBoundFile(root,stages.findLast(s=>s.stage==='DISPLAY_ENVELOPE').outputs[0]));
    const candidateAudit=JSON.parse(readBoundFile(root,stages.findLast(s=>s.stage==='DISPLAY_ENVELOPE_AUDIT').outputs[0]));
    const finalAudit=JSON.parse(readBoundFile(root,stages.findLast(s=>s.stage==='DISPLAY_ENVELOPE_FINAL').outputs[0]));
    envelope=candidateAudit.envelope;profileRefs=candidateAudit.profileAudits||[];
    if(profileRefs.length!==4||new Set(profileRefs.map(v=>v.sizeClass)).size!==4)errors.push('DISPLAY_PROFILE_INVENTORY_NOT_COMPLETE');
    const recomputed=qualifyDisplayEnvelope(displayPlan,{root,candidateSvgRef:result.finalSvgRef,profileAudits:profileRefs});
    if(recomputed.status!=='PASS'||objectSha(recomputed)!==objectSha(envelope))errors.push('DISPLAY_ENVELOPE_AUDIT_RECOMPUTE_MISMATCH');
    if(envelope?.candidateSvgRef?.sha256!==result.finalSvgRef.sha256)errors.push('DISPLAY_ENVELOPE_FINAL_SVG_MISMATCH');
    actualComparison=compareActualDisplayEnvelope(envelope,{root,actualRef:finalAudit.actualRef});
    if(finalAudit.status!=='PASS'||actualComparison.status!=='PASS'||objectSha(actualComparison)!==objectSha(finalAudit.comparison))errors.push('DISPLAY_ENVELOPE_ACTUAL_RECOMPUTE_MISMATCH');
    const actualEvidence=JSON.parse(readBoundFile(root,finalAudit.actualRef));
    const bankStage=stages.findLast(s=>s.stage==='ARCHIVE_BANK'),candidateRef=bankStage.outputs.find(o=>o.path.endsWith('.js'));
    const bank=loadBank(readBoundFile(root,candidateRef).toString('utf8'));
    const ordinal=Number(result.identity.questionUid.split('|').at(-1)),question=bank.find(q=>q.id===ordinal);
    if(question?.solutionImage!==actualEvidence.archiveAssetPath)errors.push('ARCHIVE_BANK_DISPLAY_ENVELOPE_ASSET_MISMATCH');
    if(question?.solutionImageSize!==envelope.sizeClass)errors.push('ARCHIVE_BANK_DISPLAY_ENVELOPE_SIZE_MISMATCH');
    if(envelope.policyChange&&envelope.policyChange.to!==envelope.sizeClass)errors.push('DISPLAY_ENVELOPE_POLICY_CHANGE_NOT_EXPLICIT');
  }catch(error){errors.push('DISPLAY_ENVELOPE_AUDIT_CLOSURE:'+error.message);}
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
