import crypto from 'node:crypto';
import path from 'node:path';
import {fileRef,readBoundFile,objectSha,bytesSha,canonicalJson} from '../../pipeline-core/canonical.mjs';
import {normalizeSourceExamIdRegistry,questionUidV2,validateUidMigrationEvidence} from '../../pipeline-core/question-uid.mjs';
import {auditSlice} from './audit-slice.mjs';
import {planHash} from './contracts.mjs';
import {scopeFingerprint} from './fingerprint.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {sourcePolicyFingerprint,verifiedSolutionPolicyFingerprint,sourceReviewClosed,verificationClosed} from './source-policy.mjs';
import {conditionBinding,verificationBinding,validateReviewLineage} from './blinded-review.mjs';
import {compareSolutionTokenParity} from './native-solution-overlay.mjs';
import {qualifyDisplayEnvelope,compareActualDisplayEnvelope} from './display-envelope.mjs';
import {reconstruct} from './cindy-observer.mjs';
import {analyzeRenderedLayout} from '../verify-rendered-layout.mjs';

export const PHASE5_CODE_PATHS=Object.freeze([
 'archive/archive2-preview-mobile.css',
 'archive/tools/geometry-equation/production/audit-slice.mjs',
 'archive/tools/geometry-equation/production/cindy-observer.mjs',
 'archive/tools/geometry-equation/production/construction.py',
 'archive/tools/geometry-equation/production/encoding-adjudication.mjs',
 'archive/tools/geometry-equation/production/fingerprint.mjs',
 'archive/tools/geometry-equation/production/native-solution-overlay.mjs',
 'archive/tools/geometry-equation/production/phase2.mjs',
 'archive/tools/geometry-equation/production/polynomial-notation.mjs',
 'archive/tools/geometry-equation/production/qualification.mjs',
 'archive/tools/geometry-equation/production/register-source-authority.mjs',
 'archive/tools/geometry-equation/production/repair-budget.mjs',
 'archive/tools/geometry-equation/record-visual-browser-evidence.mjs',
 'archive/tools/geometry-equation/verify-rendered-layout.mjs',
 'archive/tools/geometry-equation/visual_engine/engine.py',
 'archive/tools/geometry-equation/visual_engine/label_layout.py',
 'archive/tools/geometry-equation/visual_engine/svg_composer.py',
 'archive/tools/geometry-equation/visual_engine/viewport.py',
 'archive/tools/geometry-equation/tests/construction-v1-operations.test.mjs',
 'archive/tools/geometry-equation/tests/encoding-adjudication.test.mjs',
 'archive/tools/geometry-equation/tests/phase4-cubic-quartic-spec.test.mjs',
 'archive/tools/geometry-equation/tests/polynomial-notation.test.mjs',
 'archive/tools/geometry-equation/tests/qualification.test.mjs',
 'archive/tools/geometry-equation/tests/native-solution-overlay.test.mjs',
 'archive/tools/geometry-equation/tests/repair-budget.test.mjs',
 'archive/tools/geometry-equation/tests/record-visual-browser-evidence.test.mjs',
 'archive/tools/geometry-equation/tests/source-authority-registration.test.mjs',
 'archive/tools/geometry-equation/tests/test_label_layout.py',
 'archive/tools/geometry-equation/tests/verify-rendered-layout.test.mjs',
 'archive/tools/geometry-equation/tests/test_absolute_value_overview.py',
 'archive/tools/geometry-equation/tests/test_config.py',
 'archive/tools/geometry-equation/tests/test_cubic_quartic_overview.py',
 'archive/tools/geometry-equation/tests/test_engine.py',
 'archive/tools/geometry-equation/tests/test_exponential_logarithmic_overview.py',
 'archive/tools/geometry-equation/tests/test_function_sampling.py',
 'archive/tools/geometry-equation/tests/test_geometry_model.py',
 'archive/tools/geometry-equation/tests/test_graph_overview.py',
 'archive/tools/geometry-equation/tests/test_graph_spike.py',
 'archive/tools/geometry-equation/tests/test_math_expression.py',
 'archive/tools/geometry-equation/tests/test_notation_spike.py',
 'archive/tools/geometry-equation/tests/test_past_exam_adapter.py',
 'archive/tools/geometry-equation/tests/test_piecewise_affine_overview.py',
 'archive/tools/geometry-equation/tests/test_publication.py',
 'archive/tools/geometry-equation/tests/test_rational_overview.py',
 'archive/tools/geometry-equation/tests/test_regression.py',
 'archive/tools/geometry-equation/tests/test_semantic_model.py',
 'archive/tools/geometry-equation/tests/test_sqrt_affine_overview.py',
 'archive/tools/geometry-equation/tests/test_svg_composer.py',
 'archive/tools/geometry-equation/tests/test_tikz_adapter.py',
 'archive/tools/geometry-equation/tests/test_trigonometric_overview.py',
]);

const normalizePath=value=>String(value||'').replaceAll('\\','/');
const mapQid=(archiveFile,ordinal)=>'qid_v1_'+crypto.createHash('sha256').update(archiveFile+'#'+ordinal).digest('hex');

function fail(errors,condition,code){if(!condition)errors.push(code);}

function currentSourceIdentity(root,identityMap,target){
 const errors=[];
 if(typeof target?.sourcePath!=='string'||!target.sourcePath.startsWith('archive/exams/original/')||!Number.isSafeInteger(target.sourceQuestionOrdinal)||target.sourceQuestionOrdinal<1||!['GEOMETRY','GRAPH'].includes(target.group))return{errors:['QUALIFICATION_TARGET_INVALID']};
 const sourceArchiveFile=target.sourcePath.slice('archive/exams/'.length).normalize('NFC');
 const matches=(Array.isArray(identityMap?.records)?identityMap.records:[]).filter(row=>typeof row.sourceArchiveFile==='string'&&row.sourceArchiveFile.normalize('NFC')===sourceArchiveFile&&row.sourceOrdinal===target.sourceQuestionOrdinal);
 fail(errors,matches.length===1,'QUALIFICATION_SOURCE_MAP_IDENTITY_NOT_UNIQUE');
 if(matches.length!==1)return{errors};
 const legacy=matches[0].questionUid,expectedLegacy=mapQid(sourceArchiveFile,target.sourceQuestionOrdinal);
 fail(errors,legacy===expectedLegacy&&legacy===target.legacyQuestionUid,'QUALIFICATION_LEGACY_UID_MISMATCH');
 const sourceExamId=path.posix.basename(target.sourcePath,'.js').normalize('NFC');
 const questionUid=questionUidV2(sourceExamId,target.sourceQuestionOrdinal);
 fail(errors,questionUid===target.questionUidV2,'QUALIFICATION_SOURCE_UID_MISMATCH');
 const sourceRef=fileRef(root,target.sourcePath);
 fail(errors,target.sourceRef?.path===sourceRef.path&&target.sourceRef?.bytes===sourceRef.bytes&&target.sourceRef?.sha256===sourceRef.sha256,'QUALIFICATION_SOURCE_REF_NOT_CURRENT');
 const bank=loadBank(readBoundFile(root,sourceRef).toString('utf8'));
 const questions=bank.filter(question=>question.id===target.sourceQuestionOrdinal);
 fail(errors,questions.length===1,'QUALIFICATION_SOURCE_QUESTION_NOT_UNIQUE');
 if(questions.length!==1)return{errors,sourceRef,sourceExamId,questionUid,legacy};
 const question=JSON.parse(JSON.stringify(questions[0]));
 fail(errors,objectSha(question)===target.questionObjectSha256,'QUALIFICATION_SOURCE_QUESTION_OBJECT_MISMATCH');
 const expectedImageRef=question.image?fileRef(root,'archive/'+question.image):null;
 if(expectedImageRef){
  fail(errors,target.sourceImageRef?.path===expectedImageRef.path&&target.sourceImageRef?.bytes===expectedImageRef.bytes&&target.sourceImageRef?.sha256===expectedImageRef.sha256,'QUALIFICATION_SOURCE_IMAGE_REF_MISMATCH');
  readBoundFile(root,expectedImageRef);
 }else fail(errors,target.sourceImageRef===null,'QUALIFICATION_UNEXPECTED_SOURCE_IMAGE_REF');
 return{errors,sourceRef,sourceExamId,questionUid,legacy,question};
}

function validateTestReport(root,ref,errors){
 const report=JSON.parse(readBoundFile(root,ref));
 fail(errors,report.status==='PASS','QUALIFICATION_SOFTWARE_CHECKS_NOT_CLOSED');
 const refs=Array.isArray(report.codeRefs)?report.codeRefs:[];
 const paths=refs.map(value=>normalizePath(value.path));
 fail(errors,paths.length===PHASE5_CODE_PATHS.length&&new Set(paths).size===paths.length&&PHASE5_CODE_PATHS.every(p=>paths.includes(p)),'QUALIFICATION_CODE_INVENTORY_INCOMPLETE');
 for(const codeRef of refs){
  try{
   const current=fileRef(root,normalizePath(codeRef.path));
   if(current.sha256!==codeRef.sha256||current.bytes!==codeRef.bytes)errors.push('QUALIFICATION_CODE_REF_STALE:'+normalizePath(codeRef.path));
  }catch(error){errors.push('QUALIFICATION_CODE_REF_INVALID:'+normalizePath(codeRef.path)+':'+error.message);}
 }
 const suites=Array.isArray(report.suites)?report.suites:[];
 const suiteNames=suites.map(row=>row.name);
 fail(errors,suiteNames.length===2&&new Set(suiteNames).size===2&&suiteNames.includes('node')&&suiteNames.includes('python'),'QUALIFICATION_REQUIRED_TEST_SUITES_MISSING');
 for(const suite of suites){
  if(suite.exitCode!==0||!suite.logRef){errors.push('QUALIFICATION_TEST_SUITE_NOT_CLOSED:'+suite.name);continue;}
  let text;
  try{text=readBoundFile(root,suite.logRef).toString('utf8');}catch(error){errors.push('QUALIFICATION_TEST_LOG_INVALID:'+suite.name+':'+error.message);continue;}
  if(suite.name==='node'){
   const totals=[...text.matchAll(/ℹ\s+(tests|pass|fail)\s+(\d+)/g)];
   const values=Object.fromEntries(totals.map(([,name,value])=>[name,Number(value)]));
   if(!(values.tests>0&&values.pass===values.tests&&values.fail===0))errors.push('QUALIFICATION_NODE_LOG_NOT_ALL_PASS');
   const command=(suite.command||[]).map(String).map(normalizePath).join(' ');
   if(!command.includes('--test')||!command.includes('archive/tools/geometry-equation/tests/'))errors.push('QUALIFICATION_NODE_COMMAND_SCOPE_INVALID');
   if(PHASE5_CODE_PATHS.filter(p=>p.includes('/tests/')&&p.endsWith('.test.mjs')).some(p=>!command.includes(path.posix.basename(p))))errors.push('QUALIFICATION_NODE_TEST_INVENTORY_INCOMPLETE');
  }else if(suite.name==='python'){
   const match=/Ran\s+(\d+)\s+tests?\s+in\s+[0-9.]+s\s*\r?\n\s*OK\s*(?:\r?\n|$)/m.exec(text);
   if(!match||Number(match[1])<1)errors.push('QUALIFICATION_PYTHON_LOG_NOT_ALL_PASS');
   const command=(suite.command||[]).map(String).map(normalizePath).join(' ');
   if(!command.includes('unittest')||!command.includes('archive/tools/geometry-equation/tests'))errors.push('QUALIFICATION_PYTHON_COMMAND_SCOPE_INVALID');
  }
 }
 return{report,codeInventorySha256:objectSha(refs.map(v=>({path:normalizePath(v.path),bytes:v.bytes,sha256:v.sha256})).sort((a,b)=>a.path.localeCompare(b.path)))};
}

function readPhase2Stages(root,result){
 const stages=[];
 for(const ref of result.stages||[]){
  const {receiptSha256,...stage}=JSON.parse(readBoundFile(root,ref));
  if(objectSha(stage)!==receiptSha256)throw Error('PRESENTATION_BASE_STAGE_RECEIPT_INVALID:'+stage.stage);
  for(const output of stage.outputs||[])readBoundFile(root,output);
  stages.push(stage);
 }
 return stages;
}

function stageOutput(stages,name,predicate=()=>true){
 const stage=stages.findLast(value=>value.stage===name),output=stage?.outputs?.find(predicate);
 if(!output)throw Error('PRESENTATION_BASE_STAGE_OUTPUT_MISSING:'+name);
 return output;
}

export function archiveTargetMatchesAssetPath(targetSrc,archiveAssetPath){
 if(typeof targetSrc!=='string'||typeof archiveAssetPath!=='string'||!archiveAssetPath||archiveAssetPath.startsWith('/')||archiveAssetPath.split('/').some(part=>!part||part==='.'||part==='..'))return false;
 try{return decodeURIComponent(new URL(targetSrc,'http://archive.invalid').pathname)==='/archive/'+archiveAssetPath;}catch{return false;}
}

export function archiveAssetTargetMatches(target,targetId,archiveAssetPath){
 return target?.id===targetId&&target.loaded===true&&archiveTargetMatchesAssetPath(target.src,archiveAssetPath);
}

export function baseProtectedArchiveCaptureRowPasses(row,{targetId,sourceSha256,candidateSha256,engineSha256,archiveAssetPath}={}){
 const capture=row?.capture,target=row?.state?.targets?.find(value=>value.id===targetId),layout=row?.layouts?.find(value=>value.id===targetId);
 return row?.status==='PASS'&&row.synthetic===false&&row.runtime==='playwright-chromium'&&row.mode==='sol'&&row.viewport==='desktop'&&row.sourceSha256===sourceSha256&&row.candidateSha256===candidateSha256&&row.engineSha256===engineSha256&&Array.isArray(row.errors)&&row.errors.length===0&&capture?.status==='MEASURED'&&capture.loadedSvgCount===1&&capture.failedSvgCount===0&&capture.missingGlyphCount===0&&capture.labelCollisionCount===0&&capture.criticalCollisionCount===0&&capture.clippedTextCount===0&&capture.overflowCount===0&&archiveAssetTargetMatches(target,targetId,archiveAssetPath)&&layout?.status==='PASS'&&layout.HARD_RENDERED_COLLISION===0&&layout.CLIPPING===0&&Array.isArray(layout.errors)&&layout.errors.length===0;
}

export function isExactQ10NativeSolutionLineBreakFailure(result){
 try{
  const prefix='INDEPENDENT_VISUAL_REVIEW_FAIL:',error=String(result?.error||'');
  if(result?.status!=='UNRESOLVED'||result.identity?.questionUid!=='24_제일고_1학기_중간_고1_기출|10'||!error.startsWith(prefix))return false;
  const payload=JSON.parse(error.slice(prefix.length)),errors=payload.errors;
  const exactDistanceLine='√(4²+(-6)²)=√(16+36)=√52';
  return Array.isArray(errors)&&errors.length===1&&errors[0].includes(exactDistanceLine)&&errors[0].includes('여러 계산 단계')&&errors[0].includes('한 줄에 압축')&&errors[0].includes('별도 줄');
 }catch{return false;}
}

const Q10_HISTORICAL_BASE_SOURCE_PATH='archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js';
const Q10_HISTORICAL_BASE_SOURCE_SHA256='sha256:517448ffa8d374b4bb86b8bf95960bb7cc78e7373323e22475f2d19365c4134b';
const Q10_HISTORICAL_BASE_SVG_SHA256='sha256:8e2d318dcdd5e791c153cd638b57862b349061115c90a189ae3541637e6f9ca7';
const Q10_HISTORICAL_BASE_SOURCE_REVIEW_POLICY_SHA256='sha256:2bfde681eea96b14fcf56cfb28c2d01c9bd29e4e0d46359130d015322193c3dd';
const Q10_HISTORICAL_BASE_POLICY_REFS=Object.freeze([
 {name:'archive-capture',path:'archive/tools/geometry-equation/record-visual-browser-evidence.mjs',bytes:26499,sha256:'sha256:2fd96fb6c9324f47e47105b79751d73c9513e4d09676366632859b467f973715'},
 {name:'rendered-layout-observer',path:'archive/tools/geometry-equation/verify-rendered-layout.mjs',bytes:33383,sha256:'sha256:889d638e33f90975a989ba14576d0f860268007131b2b1433e28a803f6190e0a'}
]);
const Q10_HISTORICAL_BASE_ACTUAL_REASON='The q10 base actual-envelope policy snapshot references the exact historical Archive capture and rendered-layout helper hashes. Current q10r7 desktop Archive capture/R3 and current 390x844 legacy qpp4 mobile capture/R3 replace only that stale actual-render policy proof; the source, semantic plan, and approved SVG remain unchanged.';
const Q10_HISTORICAL_BASE_SOURCE_REVIEW_REASON='The q10 base source review is retained under its frozen Phase2 source-review policy and exact source/semantic-plan binding. The current q10r7 source review, validated independently under the current policy and unchanged semantic plan, replaces only the stale policy lineage.';

export function validateQ10HistoricalBaseActualReplacement(root,{result,identity,solution,svgRef,baseActualRef,displayPlan,actualArchive,overlay}={}){
 const sameRef=(a,b)=>a?.path===b?.path&&a?.bytes===b?.bytes&&a?.sha256===b?.sha256;
 try{
  const uid='24_제일고_1학기_중간_고1_기출|10',identitySource=identity?.sourceRef;
  if(!root||result?.identity?.questionUid!==uid||identity?.questionUid!==uid||!isExactQ10NativeSolutionLineBreakFailure(result)||identitySource?.path!==Q10_HISTORICAL_BASE_SOURCE_PATH||identitySource.sha256!==Q10_HISTORICAL_BASE_SOURCE_SHA256||result.sourceRef?.path!==Q10_HISTORICAL_BASE_SOURCE_PATH||result.sourceRef.sha256!==Q10_HISTORICAL_BASE_SOURCE_SHA256||fileRef(root,Q10_HISTORICAL_BASE_SOURCE_PATH).sha256!==Q10_HISTORICAL_BASE_SOURCE_SHA256||svgRef?.sha256!==Q10_HISTORICAL_BASE_SVG_SHA256||!svgRef.path.endsWith('/q10-solution.svg'))return null;
  const currentSourceRef=fileRef(root,Q10_HISTORICAL_BASE_SOURCE_PATH),sourceBytes=readBoundFile(root,currentSourceRef);
  if(!sameRef(identitySource,currentSourceRef)||!sameRef(result.sourceRef,currentSourceRef)||!solution||typeof solution.solution!=='string')return null;
  if(displayPlan?.schemaVersion!=='DISPLAY_ENVELOPE_v1'||displayPlan.status!=='PLANNED'||displayPlan.questionUid!==uid||displayPlan.inputIdentity?.questionUid!==uid||objectSha(displayPlan.inputIdentity)!==displayPlan.inputIdentitySha256||!sameRef(displayPlan.inputIdentity.sourceRef,currentSourceRef)||!sameRef(displayPlan.sourceRef,currentSourceRef))return null;
  const inputSolutionRef=displayPlan.inputIdentity.solutionRef;
  if(!inputSolutionRef||!sameRef(displayPlan.solutionRef,inputSolutionRef)||readBoundFile(root,inputSolutionRef).toString('utf8')!==solution.solution)return null;
  if(!actualArchive||actualArchive.schemaVersion!=='DISPLAY_ARCHIVE_ACTUAL_v1'||actualArchive.status!=='PASS'||actualArchive.synthetic!==false||actualArchive.runtime!=='playwright-chromium'||actualArchive.questionUid!==uid||actualArchive.inputIdentitySha256!==displayPlan.inputIdentitySha256||!sameRef(actualArchive.sourceRef,currentSourceRef)||!sameRef(actualArchive.solutionRef,inputSolutionRef)||!sameRef(actualArchive.candidateSvgRef,svgRef)||actualArchive.candidateSvgSha256!==Q10_HISTORICAL_BASE_SVG_SHA256||!sameRef(overlay?.finalSvgRef,svgRef)||overlay?.finalSvgUnchanged!==true||overlay?.archiveAssetPath!==actualArchive.archiveAssetPath||overlay?.archive?.target?.id!==actualArchive.targetId)return null;
  if(!Array.isArray(displayPlan.inputIdentity.policyRefs)||!Array.isArray(actualArchive.policyRefs)||canonicalJson(displayPlan.inputIdentity.policyRefs)!==canonicalJson(actualArchive.policyRefs)||canonicalJson(displayPlan.policyRefs)!==canonicalJson(displayPlan.inputIdentity.policyRefs))return null;
  const historicalByPath=new Map(Q10_HISTORICAL_BASE_POLICY_REFS.map(value=>[value.path,value])),stalePolicyRefs=[];
  for(const item of displayPlan.inputIdentity.policyRefs){
   const historical=historicalByPath.get(item?.ref?.path);if(!item?.name||!item?.ref?.path||!item?.ref?.sha256)return null;
   const current=fileRef(root,item.ref.path);
   if(current.sha256===item.ref.sha256&&current.bytes===item.ref.bytes){readBoundFile(root,current);continue;}
   if(!historical||item.name!==historical.name||item.ref.sha256!==historical.sha256||item.ref.bytes!==historical.bytes||current.sha256===historical.sha256)return null;
   stalePolicyRefs.push({name:item.name,path:item.ref.path,historicalBytes:item.ref.bytes,historicalSha256:item.ref.sha256,currentBytes:current.bytes,currentSha256:current.sha256});
  }
  if(stalePolicyRefs.length!==Q10_HISTORICAL_BASE_POLICY_REFS.length||Q10_HISTORICAL_BASE_POLICY_REFS.some(expected=>!stalePolicyRefs.some(actual=>actual.name===expected.name&&actual.path===expected.path&&actual.historicalBytes===expected.bytes&&actual.historicalSha256===expected.sha256)))return null;
  const enginePolicy=displayPlan.inputIdentity.policyRefs.find(value=>value.name==='archive-engine');
  if(!enginePolicy||enginePolicy.ref.sha256!==displayPlan.archiveEngineSha256||enginePolicy.ref.sha256!==fileRef(root,'archive/engine.html').sha256)return null;
  const actualFileRef=fileRef(root,baseActualRef?.path||'');
  if(!sameRef(actualFileRef,baseActualRef))return null;
  const historicalActual=JSON.parse(readBoundFile(root,actualFileRef).toString('utf8'));
  if(objectSha(historicalActual)!==objectSha(actualArchive))return null;
  const rowRef=actualArchive.archiveRowRef,screenshotRef=actualArchive.screenshotRef;
  if(!rowRef||!screenshotRef||!sameRef(fileRef(root,rowRef.path),rowRef)||!sameRef(fileRef(root,screenshotRef.path),screenshotRef))return null;
  const row=JSON.parse(readBoundFile(root,rowRef)),screenshot=readBoundFile(root,screenshotRef),target=row.state?.targets?.find(value=>value.id===actualArchive.targetId);
  const expectedAssetPath='/archive/'+actualArchive.archiveAssetPath;
  const response=(row.responses||[]).find(value=>{try{return decodeURIComponent(new URL(value.url).pathname)===expectedAssetPath;}catch{return false;}});
  if(!screenshot.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||actualArchive.targetId!==result.identity.assetId||actualArchive.sizeClass!=='full'||!target?.loaded||target.sizeClass!=='full'||target.naturalWidth!==actualArchive.naturalWidth||target.naturalHeight!==actualArchive.naturalHeight||!sameRef(actualArchive.candidateSvgRef,svgRef)||canonicalJson(target.rect)!==canonicalJson(actualArchive.imageRect)||canonicalJson(target.qBoxRect)!==canonicalJson(actualArchive.qBoxRect)||canonicalJson(target.solutionMetaRect)!==canonicalJson(actualArchive.solutionMetaRect)||target.solutionMetaContentWidth!==actualArchive.solutionMetaContentWidth||decodeURIComponent(new URL(target.src,'http://archive.invalid').pathname)!==expectedAssetPath||!response||response.status!==200||response.sha256!==Q10_HISTORICAL_BASE_SVG_SHA256.slice(7))return null;
  if(row.status!=='PASS'||row.synthetic!==false||row.runtime!=='playwright-chromium'||row.browserVersion!==actualArchive.browserVersion||row.mode!=='sol'||row.sourceSha256!==currentSourceRef.sha256.slice(7)||row.engineSha256!==displayPlan.archiveEngineSha256.slice(7))return null;
  return{status:'CURRENT_OVERLAY_CAPTURE_REPLACEMENT',disposition:'CURRENT_OVERLAY_CAPTURE_REPLACEMENT',historicalBaseActualRef:baseActualRef,historicalBaseActualRefReplacedByCurrentOverlayCapture:true,reason:Q10_HISTORICAL_BASE_ACTUAL_REASON,stalePolicyRefs};
 }catch{return null;}
}

export function validateQ10HistoricalBaseSourceReviewReplacement(root,{result,identity,basePlanRef,frozenPlan,semanticPlan,baseSourceReviewRef,currentPlanRef,currentPlan,currentSourceReviewRef,source,images,overlay}={}){
 const sameRef=(a,b)=>a?.path===b?.path&&a?.bytes===b?.bytes&&a?.sha256===b?.sha256;
 try{
  const uid='24_제일고_1학기_중간_고1_기출|10';
  if(!root||result?.identity?.questionUid!==uid||identity?.questionUid!==uid||identity?.sourceRef?.path!==Q10_HISTORICAL_BASE_SOURCE_PATH||identity.sourceRef.sha256!==Q10_HISTORICAL_BASE_SOURCE_SHA256||result.sourceRef?.path!==Q10_HISTORICAL_BASE_SOURCE_PATH||result.sourceRef.sha256!==Q10_HISTORICAL_BASE_SOURCE_SHA256)return null;
  const currentSourceRef=fileRef(root,Q10_HISTORICAL_BASE_SOURCE_PATH),currentPolicy=sourcePolicyFingerprint(root);
  if(!sameRef(identity.sourceRef,currentSourceRef)||!sameRef(result.sourceRef,currentSourceRef)||!sameRef(frozenPlan?.sourceRef,currentSourceRef)||!sameRef(fileRef(root,basePlanRef?.path||''),basePlanRef)||!sameRef(basePlanRef,overlay?.basePlanRef)||!sameRef(fileRef(root,currentPlanRef?.path||''),currentPlanRef)||!sameRef(currentPlanRef,overlay?.currentPlanRef)||!sameRef(fileRef(root,baseSourceReviewRef?.path||''),baseSourceReviewRef)||!sameRef(fileRef(root,currentSourceReviewRef?.path||''),currentSourceReviewRef)||!sameRef(currentSourceReviewRef,overlay?.currentSourceReviewRef))return null;
  if(planHash(frozenPlan)!==frozenPlan.planSha256||frozenPlan.questionUid!==uid||frozenPlan.sourceReviewPolicySha256!==Q10_HISTORICAL_BASE_SOURCE_REVIEW_POLICY_SHA256||frozenPlan.sourceReviewPolicySha256===currentPolicy||overlay.currentSourcePolicySha256!==currentPolicy)return null;
  const{schemaVersion,questionUid,visualAssetKey,sourceRef:planSourceRef,solutionRef:planSolutionRef,verifiedSolutionRef,verifiedSolutionPolicySha256,verificationInputSha256,sourceReviewInputSha256,sourceReviewPolicySha256,sourceRegistryRef:priorRegistryRef,planSha256,...derivedSemanticPlan}=frozenPlan;
  if(objectSha(derivedSemanticPlan)!==objectSha(semanticPlan))return null;
  const{verificationInputSha256:currentVerificationInputSha256,...currentSemanticPlan}=currentPlan||{};
  if(objectSha(currentSemanticPlan)!==objectSha(semanticPlan))return null;
  const question=identity.question,expectedSource={content:question?.content,choices:question?.choices??null,sourceImageRequired:!!question?.image};
  if(!question||canonicalJson(source)!==canonicalJson(expectedSource)||!Array.isArray(images))return null;
  const expectedImages=[];
  for(const imagePath of [question.image].filter(Boolean)){
   const bytes=readBoundFile(root,fileRef(root,'archive/'+imagePath));
   expectedImages.push('data:image/'+(imagePath.endsWith('.svg')?'svg+xml':imagePath.endsWith('.jpg')?'jpeg':'png')+';base64,'+bytes.toString('base64'));
  }
  if(canonicalJson(images)!==canonicalJson(expectedImages))return null;
  const baseSourceReview=JSON.parse(readBoundFile(root,baseSourceReviewRef)),currentSourceReview=JSON.parse(readBoundFile(root,currentSourceReviewRef));
  const historicalPolicy=frozenPlan.sourceReviewPolicySha256,historicalBinding=conditionBinding({sourceRef:currentSourceRef,source:expectedSource,images:expectedImages,plan:semanticPlan,policySha256:historicalPolicy});
  const currentBinding=conditionBinding({sourceRef:currentSourceRef,source:expectedSource,images:expectedImages,plan:currentPlan,policySha256:currentPolicy});
  if(frozenPlan.sourceReviewInputSha256!==baseSourceReview.inputSha256||baseSourceReview.policySha256!==historicalPolicy||baseSourceReview.inputBindingSha256!==historicalBinding||!sourceReviewClosed(baseSourceReview)||!validateReviewLineage(root,baseSourceReview,'CONDITIONS',historicalPolicy,historicalBinding))return null;
  if(currentSourceReview.policySha256!==currentPolicy||currentSourceReview.inputBindingSha256!==currentBinding||!sourceReviewClosed(currentSourceReview)||!validateReviewLineage(root,currentSourceReview,'CONDITIONS',currentPolicy,currentBinding))return null;
  return{status:'CURRENT_OVERLAY_SOURCE_REVIEW_REPLACEMENT',disposition:'CURRENT_OVERLAY_SOURCE_REVIEW_REPLACEMENT',historicalBaseSourceReviewRef:baseSourceReviewRef,currentSourceReviewRef,historicalSourcePolicySha256:historicalPolicy,currentSourcePolicySha256:currentPolicy,historicalInputSha256:baseSourceReview.inputSha256,historicalInputBindingSha256:historicalBinding,currentInputSha256:currentSourceReview.inputSha256,currentInputBindingSha256:currentBinding,reason:Q10_HISTORICAL_BASE_SOURCE_REVIEW_REASON};
 }catch{return null;}
}

export function currentPlanSolutionBindingClosed(currentPlan,semanticPlan,currentVerifiedSolution,recomputedVerificationInputSha256){
 if(!currentPlan||typeof currentPlan!=='object'||!semanticPlan||typeof semanticPlan!=='object'||!currentVerifiedSolution||typeof currentVerifiedSolution.inputBindingSha256!=='string'||typeof recomputedVerificationInputSha256!=='string')return false;
 const{verificationInputSha256,...currentSemanticPlan}=currentPlan;
 return typeof verificationInputSha256==='string'&&verificationInputSha256===currentVerifiedSolution.inputBindingSha256&&verificationInputSha256===recomputedVerificationInputSha256&&objectSha(currentSemanticPlan)===objectSha(semanticPlan);
}

export function validateNativeSolutionMobileR3Review(root,{reviewRef,overlayRef,desktopReviewRef,overlay,identity,finalSvgRef}){
 const sameRef=(a,b)=>a?.path===b?.path&&a?.bytes===b?.bytes&&a?.sha256===b?.sha256;
 const samePathSha=(a,b)=>a?.path===b?.path&&a?.sha256===b?.sha256;
 const fail=()=>{throw Error('PRESENTATION_MOBILE_R3_REVIEW_NOT_CLOSED');};
 const currentRef=ref=>{if(!ref?.path||typeof ref.sha256!=='string')fail();let actual;try{actual=fileRef(root,ref.path);}catch{fail();}if(ref.path!==actual.path||ref.sha256!==actual.sha256||ref.bytes!==undefined&&ref.bytes!==actual.bytes)fail();readBoundFile(root,actual);return actual;};
 if(!reviewRef||!overlayRef||!desktopReviewRef||!overlay||!identity||!finalSvgRef)fail();
 currentRef(reviewRef);currentRef(overlayRef);currentRef(desktopReviewRef);
 const review=JSON.parse(readBoundFile(root,reviewRef));
 const cssRef=fileRef(root,'archive/archive2-preview-mobile.css'),engineRef=fileRef(root,'archive/engine.html');
 currentRef(cssRef);currentRef(engineRef);
 const reviewerIdentity=review.reviewerIdentity;
 const reviewerIdentityBound=typeof reviewerIdentity==='string'&&reviewerIdentity.length>0||reviewerIdentity&&typeof reviewerIdentity==='object'&&(typeof reviewerIdentity.agentId==='string'&&reviewerIdentity.agentId.length>0||typeof reviewerIdentity.taskId==='string'&&reviewerIdentity.taskId.length>0);
 const requiredChecks=['sourceParity','answerParity','mathTokenParity','unchangedSvg','actualLegacyMobileSol','singleColumnFullWidth','cssBound','mobileSolutionLineBreaks'];
 const desktopReview=JSON.parse(readBoundFile(root,desktopReviewRef));
 const currentSourceRef=currentRef(identity.sourceRef),currentCandidateRef=currentRef(overlay.candidateRef),currentSvgRef=currentRef(finalSvgRef);
 const currentDesktopRowRef=currentRef(overlay.archive.rowRef),currentDesktopScreenshotRef=currentRef(overlay.archive.screenshotRef),currentDesktopContextScreenshotRef=currentRef(overlay.archive.nativeContextScreenshotRef);
 if(review.schemaVersion!=='PHASE5_NATIVE_SOLUTION_OVERLAY_R3_MOBILE_REVIEW_v1'||review.status!=='PASS'||review.reviewerRole!=='archive_r3'||!reviewerIdentityBound||review.reviewType!=='INDEPENDENT_VISUAL_RECHECK'||review.questionUid!==overlay.questionUid||!samePathSha(review.desktopOverlayRef,overlayRef)||!samePathSha(review.desktopReviewRef,desktopReviewRef)||!samePathSha(review.desktopCandidateRef,currentCandidateRef)||!samePathSha(review.desktopArchiveRowRef,currentDesktopRowRef)||!samePathSha(review.sourceRef,currentSourceRef)||!samePathSha(review.candidateRef,currentCandidateRef)||!samePathSha(review.finalSvgRef,currentSvgRef)||review.mobileContext!=='LEGACY_ENGINE_QPP4'||review.mobileViewport?.width!==390||review.mobileViewport?.height!==844||review.errors?.length||!Array.isArray(review.observations)||!review.observations.length||requiredChecks.some(key=>review.checks?.[key]!=='PASS')||Object.values(review.checks||{}).some(value=>value!=='PASS')||desktopReview.schemaVersion!=='PHASE5_NATIVE_SOLUTION_OVERLAY_R3_REVIEW_v1'||desktopReview.status!=='PASS'||desktopReview.reviewerRole!=='archive_r3'||desktopReview.questionUid!==overlay.questionUid||!samePathSha(desktopReview.archiveRowRef,currentDesktopRowRef)||!samePathSha(desktopReview.screenshotRef,currentDesktopScreenshotRef)||!samePathSha(desktopReview.nativeContextScreenshotRef,currentDesktopContextScreenshotRef))fail();
 const captureRecordRef=currentRef(review.captureRecordRef),captureRecord=JSON.parse(readBoundFile(root,captureRecordRef));
 const mobileMatrixRef=currentRef(review.mobileMatrixRef),mobileRowRef=currentRef(review.mobileRowRef),mobileScreenshotRef=currentRef(review.mobileScreenshotRef),nativeContextScreenshotRef=currentRef(review.nativeContextScreenshotRef);
 const matrix=JSON.parse(readBoundFile(root,mobileMatrixRef)),row=JSON.parse(readBoundFile(root,mobileRowRef));
 const captureRefsMatch=sameRef(captureRecord.matrixRef,mobileMatrixRef)&&sameRef(captureRecord.mobileRowRef,mobileRowRef)&&sameRef(captureRecord.screenshotRef,mobileScreenshotRef)&&sameRef(captureRecord.nativeContextScreenshotRef,nativeContextScreenshotRef)&&sameRef(captureRecord.candidateRef,currentCandidateRef)&&sameRef(captureRecord.sourceRef,currentSourceRef)&&sameRef(captureRecord.finalSvgRef,currentSvgRef)&&sameRef(captureRecord.cssRef,cssRef);
 if(captureRecord.schemaVersion!=='PHASE5_Q10_LEGACY_MOBILE_CAPTURE_v1'||captureRecord.status!=='READY_FOR_R3_REVIEW'||captureRecord.mobileContext!=='LEGACY_ENGINE_QPP4'||!captureRefsMatch||!samePathSha(review.mobileMatrixRef,mobileMatrixRef)||!samePathSha(review.mobileRowRef,mobileRowRef)||!samePathSha(review.mobileScreenshotRef,mobileScreenshotRef)||!samePathSha(review.nativeContextScreenshotRef,nativeContextScreenshotRef)||!samePathSha(review.cssRef,cssRef)||review.cssResponseSha256!==cssRef.sha256.slice(7))fail();
 const targetId=overlay.archive.target.id,archiveAssetPath=overlay.archiveAssetPath;
 const imagePath=decodeURIComponent(new URL(overlay.archive.target.src,'http://archive.invalid').pathname),matrixSources=matrix.sources||[],matrixRows=matrix.rows||[];
 if(matrix.schemaVersion!=='GEOMETRY_ARCHIVE_RENDER_MATRIX_v1'||matrix.runtime!=='actual archive/engine.html'||matrix.synthetic!==false||matrix.engineSha256!==engineRef.sha256.slice(7)||matrixSources.length!==1||matrixRows.length!==1)fail();
 const source=matrixSources[0],matrixRow=matrixRows[0],asset=source.assets?.length===1?source.assets[0]:null;
 const matrixUrl=new URL(matrixRow.urlPath,'http://archive.invalid');
 if(source.sourcePath!==currentSourceRef.path||source.sourceSha256!==currentSourceRef.sha256.slice(7)||source.candidatePath!==currentCandidateRef.path||source.candidateSha256!==currentCandidateRef.sha256.slice(7)||source.protectedFieldParity!=='PASS'||!asset||asset.id!==targetId||asset.path!==currentSvgRef.path||asset.archivePath!==archiveAssetPath||asset.sha256!==currentSvgRef.sha256.slice(7)||matrixRow.id!==targetId||matrixRow.mode!=='sol'||matrixRow.viewport!=='mobile'||matrixRow.width!==390||matrixRow.height!==844||matrixUrl.pathname!=='/archive/engine.html'||matrixUrl.searchParams.get('mode')!=='sol'||matrixUrl.searchParams.get('qpp')!=='4'||matrixUrl.searchParams.has('archive2Context'))fail();
 const rowUrl=new URL(row.url),target=row.state?.targets?.find(value=>value.id===targetId);
 if(row.status!=='PASS'||row.synthetic!==false||row.runtime!=='playwright-chromium'||row.mode!=='sol'||row.viewport!=='mobile'||row.sourceSha256!==currentSourceRef.sha256.slice(7)||row.candidateSha256!==currentCandidateRef.sha256.slice(7)||row.engineSha256!==engineRef.sha256.slice(7)||rowUrl.pathname!=='/archive/engine.html'||rowUrl.searchParams.get('mode')!=='sol'||rowUrl.searchParams.get('qpp')!=='4'||rowUrl.searchParams.has('archive2Context')||row.errors?.length||row.capture?.status!=='MEASURED'||row.capture.missingGlyphCount!==0||row.capture.clippedTextCount!==0||row.capture.overflowCount!==0||row.capture.criticalCollisionCount!==0||row.capture.observedCriticalCollisionCount!==1||!target?.loaded||decodeURIComponent(new URL(target.src,'http://archive.invalid').pathname)!=='/archive/'+archiveAssetPath||imagePath!=='/archive/'+archiveAssetPath)fail();
 const qBox=target.qBoxRect,contentWidth=target.solutionMetaContentWidth,imageRect=target.rect;
 if(!qBox||!Number.isFinite(qBox.width)||qBox.width<320||!Number.isFinite(contentWidth)||contentWidth<300||!Number.isFinite(imageRect?.width)||imageRect.width<240||!review.measurements?.qBoxRect||Math.abs(review.measurements.qBoxRect.width-qBox.width)>.25||Math.abs(review.measurements.solutionMetaContentWidth-contentWidth)>.25||Math.abs(review.measurements.imageRect?.width-imageRect.width)>.25||review.measurements.cssNetworkStatus!==200||!String(review.measurements.gridColumns||'').includes('minmax(0, 1fr)'))fail();
 const cssResponse=(row.responses||[]).find(value=>{try{return decodeURIComponent(new URL(value.url).pathname)==='/archive/archive2-preview-mobile.css';}catch{return false;}});
 if(!cssResponse||cssResponse.status!==200||cssResponse.sha256!==cssRef.sha256.slice(7)||captureRecord.cssResponseSha256!==cssRef.sha256.slice(7)||captureRecord.cssRef?.sha256!==cssRef.sha256)fail();
 const layout=row.layouts?.find(value=>value.id===targetId),mask=layout?.tickKnockoutEvidence?.find(value=>value.id==='tick-x--1-label-knockout-background');
 if(layout?.status!=='PASS'||layout.svgSha256!==currentSvgRef.sha256.slice(7)||mask?.status!=='PASS'||mask.svgSha256!==currentSvgRef.sha256.slice(7))fail();
 return{status:'PASS',mobileReviewRef:reviewRef,mobileMatrixRef,mobileRowRef,mobileScreenshotRef,nativeContextScreenshotRef,cssRef,qBoxWidthCssPx:qBox.width,solutionMetaContentWidthCssPx:contentWidth};
}

function validateNativeSolutionPresentationClosure(root,closureRef,target,resultRef,result,identity,registryRef){
 const closure=JSON.parse(readBoundFile(root,closureRef));
 if(closure.schemaVersion!=='PHASE5_NATIVE_SOLUTION_PRESENTATION_CLOSURE_v1'||closure.status!=='PASS'||closure.questionUid!==target.questionUidV2||closure.baseResultRef?.path!==resultRef.path||closure.baseResultRef?.sha256!==resultRef.sha256||!closure.overlayRef||!closure.r3ReviewRef||!closure.mobileReviewRef)throw Error('PRESENTATION_CLOSURE_BINDING_INVALID');
 if(target.questionUidV2!=='24_제일고_1학기_중간_고1_기출|10'||!isExactQ10NativeSolutionLineBreakFailure(result))throw Error('PRESENTATION_BASE_FAILURE_SCOPE_INVALID');
 const baseFailure=JSON.parse(String(result.error).slice('INDEPENDENT_VISUAL_REVIEW_FAIL:'.length));
 const overlay=JSON.parse(readBoundFile(root,closure.overlayRef));
 if(overlay.schemaVersion!=='PHASE5_NATIVE_SOLUTION_PRESENTATION_OVERLAY_v1'||overlay.status!=='READY_FOR_R3_REVIEW'||overlay.questionUid!==target.questionUidV2||overlay.baseResultRef?.path!==resultRef.path||overlay.baseResultRef?.sha256!==resultRef.sha256||overlay.baseResultStatus!==result.status||overlay.baseResultError!==result.error||overlay.sourceRegistryRef?.path!==registryRef.path||overlay.sourceRegistryRef?.sha256!==registryRef.sha256||overlay.sourceRef?.path!==identity.sourceRef.path||overlay.sourceRef?.sha256!==identity.sourceRef.sha256||overlay.finalSvgUnchanged!==true||overlay.r3ReviewRequired!==true||overlay.productionAuthorized!==false)throw Error('PRESENTATION_OVERLAY_BINDING_INVALID');
 const stages=readPhase2Stages(root,result),required=['UID_AUTHORITY','VERIFIED_SOLUTION','PLAN','SOURCE_REVIEW','MATH','MATH_REVIEW','TYPESET','MEASURE','NORMALIZE','DISPLAY_ENVELOPE_PREFLIGHT','DISPLAY_ENVELOPE','BUILD','STATIC_AUDIT','DISPLAY_ENVELOPE_AUDIT','DISPLAY_ENVELOPE_ACTUAL','DISPLAY_ENVELOPE_FINAL','ARCHIVE_BANK','CAPTURE','VISUAL_REVIEW'];
 if(required.some(name=>!stages.some(stage=>stage.stage===name)))throw Error('PRESENTATION_BASE_PHASE2_GATES_MISSING');
 const originalVisual=JSON.parse(readBoundFile(root,stageOutput(stages,'VISUAL_REVIEW')));
 if(originalVisual.output?.status!=='FAIL'||originalVisual.purpose!=='REVIEW_FINAL_VISUAL'||!originalVisual.providerInvocationId||!originalVisual.contextId||originalVisual.subagentToolsEnabled!==false||canonicalJson(originalVisual.payload||{})!==canonicalJson(baseFailure))throw Error('PRESENTATION_ORIGINAL_FAIL_NOT_PRESERVED');
 const basePlanRef=stageOutput(stages,'PLAN',ref=>ref.path.endsWith('/plan.json'));
 if(basePlanRef.path!==overlay.basePlanRef?.path||basePlanRef.sha256!==overlay.basePlanRef?.sha256)throw Error('PRESENTATION_BASE_PLAN_REF_MISMATCH');
 const frozenPlan=JSON.parse(readBoundFile(root,basePlanRef));
 if(planHash(frozenPlan)!==frozenPlan.planSha256||frozenPlan.questionUid!==target.questionUidV2||frozenPlan.sourceRef?.sha256!==identity.sourceRef.sha256)throw Error('PRESENTATION_BASE_PLAN_STALE');
 const{schemaVersion,questionUid,visualAssetKey,sourceRef:planSourceRef,solutionRef:planSolutionRef,verifiedSolutionRef,verifiedSolutionPolicySha256,verificationInputSha256,sourceReviewInputSha256,sourceReviewPolicySha256,sourceRegistryRef:priorRegistryRef,planSha256,...semanticPlan}=frozenPlan;
 const currentPlan=JSON.parse(readBoundFile(root,overlay.currentPlanRef));
 if(overlay.currentScopeFingerprint!==scopeFingerprint(root,semanticPlan.capability)||overlay.currentSourcePolicySha256!==sourcePolicyFingerprint(root))throw Error('PRESENTATION_CURRENT_PLAN_OR_CODE_BINDING_INVALID');
 const currentSourceReview=JSON.parse(readBoundFile(root,overlay.currentSourceReviewRef));
 const solution=identity.question,sourceOnly={content:solution.content,choices:solution.choices??null,sourceImageRequired:!!solution.image},images=[];
 for(const imagePath of [solution.image].filter(Boolean)){const bytes=readBoundFile(root,fileRef(root,'archive/'+imagePath));images.push('data:image/'+(imagePath.endsWith('.svg')?'svg+xml':imagePath.endsWith('.jpg')?'jpeg':'png')+';base64,'+bytes.toString('base64'));}
 const sourcePolicy=sourcePolicyFingerprint(root),conditionInput=conditionBinding({sourceRef:identity.sourceRef,source:sourceOnly,images,plan:currentPlan,policySha256:sourcePolicy});
 if(!sourceReviewClosed(currentSourceReview)||!validateReviewLineage(root,currentSourceReview,'CONDITIONS',sourcePolicy,conditionInput))throw Error('PRESENTATION_CURRENT_SOURCE_REVIEW_NOT_CLOSED');
 const currentSolutionReview=JSON.parse(readBoundFile(root,overlay.currentSolutionReviewRef)),solutionPolicy=verifiedSolutionPolicyFingerprint(root);
 const solutionInput=verificationBinding({sourceRef:identity.sourceRef,source:sourceOnly,images,answer:solution.answer,solution:solution.solution,policySha256:solutionPolicy});
 if(!currentPlanSolutionBindingClosed(currentPlan,semanticPlan,currentSolutionReview,solutionInput))throw Error('PRESENTATION_CURRENT_PLAN_OR_CODE_BINDING_INVALID');
 if(!verificationClosed(currentSolutionReview)||!validateReviewLineage(root,currentSolutionReview,'SOLUTION',solutionPolicy,solutionInput))throw Error('PRESENTATION_CURRENT_SOLUTION_REVIEW_NOT_CLOSED');
 const currentMath=JSON.parse(readBoundFile(root,overlay.currentMathReviewRef)),currentPeer=reconstruct(semanticPlan.mathPlan);
 if(currentMath.status!=='PASS'||!currentMath.peer||objectSha(currentMath.peer)!==objectSha(currentPeer))throw Error('PRESENTATION_CURRENT_MATH_REVIEW_NOT_CLOSED');
 const staticAudit=JSON.parse(readBoundFile(root,stageOutput(stages,'STATIC_AUDIT')));
 const svgRef=stageOutput(stages,'BUILD',ref=>ref.path.endsWith('.svg'));
 if(originalVisual.inputPacket?.finalSvgSha256!==svgRef.sha256||originalVisual.inputPacket?.screenshotSha256==null||originalVisual.inputPacket?.nativeContextScreenshotSha256==null)throw Error('PRESENTATION_ORIGINAL_VISUAL_REVIEW_BINDING_INVALID');
 const baseCaptureStage=stages.findLast(stage=>stage.stage==='CAPTURE');
 const baseCapturePngShas=new Set((baseCaptureStage?.outputs||[]).filter(ref=>ref.path.endsWith('.png')).map(ref=>ref.sha256));
 if(!baseCapturePngShas.has(originalVisual.inputPacket.screenshotSha256)||!baseCapturePngShas.has(originalVisual.inputPacket.nativeContextScreenshotSha256))throw Error('PRESENTATION_ORIGINAL_REVIEW_CAPTURE_MISMATCH');
 const baseActualRef=stageOutput(stages,'DISPLAY_ENVELOPE_ACTUAL',ref=>ref.path.endsWith('/actual-archive.json'));
 const actualArchive=JSON.parse(readBoundFile(root,baseActualRef));
 const displayPlan=JSON.parse(readBoundFile(root,stageOutput(stages,'DISPLAY_ENVELOPE')));
 const displayAudit=JSON.parse(readBoundFile(root,stageOutput(stages,'DISPLAY_ENVELOPE_AUDIT')));
 const displayFinal=JSON.parse(readBoundFile(root,stageOutput(stages,'DISPLAY_ENVELOPE_FINAL')));
 const sameRef=(a,b)=>a?.path===b?.path&&a?.bytes===b?.bytes&&a?.sha256===b?.sha256;
 if(!sameRef(svgRef,overlay.finalSvgRef)||staticAudit.status!=='PASS'||staticAudit.finalSvgSha256!==svgRef.sha256||!sameRef(displayAudit.candidateSvgRef,svgRef)||!sameRef(displayFinal.candidateSvgRef,svgRef)||!sameRef(actualArchive.candidateSvgRef,svgRef)||actualArchive.status!=='PASS'||displayFinal.status!=='PASS'||!sameRef(displayFinal.actualRef,baseActualRef))throw Error('PRESENTATION_BASE_STATIC_OR_ACTUAL_SVG_GATE_FAIL');
 let historicalBaseActualReplacement=null;
 try{
  const recomputedEnvelope=qualifyDisplayEnvelope(displayPlan,{root,candidateSvgRef:svgRef,profileAudits:displayAudit.profileAudits||[]});
  if(recomputedEnvelope.status!=='PASS'||objectSha(recomputedEnvelope)!==objectSha(displayAudit.envelope))throw Error('PRESENTATION_BASE_DISPLAY_ENVELOPE_RECOMPUTE_FAIL');
  const selectedProfile=displayAudit.profileAudits?.find(value=>value.sizeClass===recomputedEnvelope.sizeClass);
  if(!selectedProfile)throw Error('PRESENTATION_BASE_SELECTED_PROFILE_MISSING');
  const selectedMeasurement=JSON.parse(readBoundFile(root,selectedProfile.measurementRef));
  if(!sameRef(selectedMeasurement.candidateSvgRef,svgRef)||selectedMeasurement.synthetic!==false||selectedMeasurement.runtime!=='playwright-chromium'||analyzeRenderedLayout({...selectedMeasurement.rawCapture,svgSha256:svgRef.sha256.slice(7)}).status!=='PASS')throw Error('PRESENTATION_BASE_SELECTED_PROFILE_RENDER_RECHECK_FAIL');
  const recomputedActual=compareActualDisplayEnvelope(recomputedEnvelope,{root,actualRef:baseActualRef});
  if(recomputedActual.status!=='PASS'||objectSha(recomputedActual)!==objectSha(displayFinal.comparison))throw Error('PRESENTATION_BASE_ACTUAL_ENVELOPE_RECOMPUTE_FAIL');
 }catch(error){
  const stalePath=String(error?.message||'').startsWith('STALE_FILE:')?String(error.message).slice('STALE_FILE:'.length):null;
  if(!Q10_HISTORICAL_BASE_POLICY_REFS.some(value=>value.path===stalePath))throw error;
  historicalBaseActualReplacement=validateQ10HistoricalBaseActualReplacement(root,{result,identity,solution,svgRef,baseActualRef,displayPlan,actualArchive,overlay});
  if(!historicalBaseActualReplacement)throw error;
  const expectedRecordedPolicyRefs=historicalBaseActualReplacement.stalePolicyRefs.map(({name,path,historicalSha256,currentSha256})=>({name,path,historicalSha256,currentSha256}));
  if(!sameRef(closure.historicalBaseActualRef,baseActualRef)||closure.historicalBaseActualRefReplacedByCurrentOverlayCapture!==true||closure.historicalBaseActualDisposition!=='CURRENT_OVERLAY_CAPTURE_REPLACEMENT'||closure.historicalBaseActualReason!==Q10_HISTORICAL_BASE_ACTUAL_REASON||canonicalJson(closure.historicalBaseActualStalePolicyRefs)!==canonicalJson(expectedRecordedPolicyRefs))throw Error('PRESENTATION_HISTORICAL_BASE_ACTUAL_REPLACEMENT_NOT_RECORDED');
 }
 const baseSolution=JSON.parse(readBoundFile(root,stageOutput(stages,'VERIFIED_SOLUTION'))),baseSourceReviewRef=stageOutput(stages,'SOURCE_REVIEW'),baseSourceReview=JSON.parse(readBoundFile(root,baseSourceReviewRef)),baseMath=JSON.parse(readBoundFile(root,stageOutput(stages,'MATH_REVIEW')));
 const baseSolutionInput=verificationBinding({sourceRef:identity.sourceRef,source:sourceOnly,images,answer:solution.answer,solution:solution.solution,policySha256:verifiedSolutionPolicyFingerprint(root)});
 const baseSourceInput=conditionBinding({sourceRef:identity.sourceRef,source:sourceOnly,images,plan:semanticPlan,policySha256:frozenPlan.sourceReviewPolicySha256});
 if(frozenPlan.verifiedSolutionPolicySha256!==verifiedSolutionPolicyFingerprint(root)||frozenPlan.verificationInputSha256!==baseSolution.inputBindingSha256||baseSolution.output?.status!=='PASS'||!verificationClosed(baseSolution)||!validateReviewLineage(root,baseSolution,'SOLUTION',verifiedSolutionPolicyFingerprint(root),baseSolutionInput)||baseMath.status!=='PASS')throw Error('PRESENTATION_BASE_MATH_OR_SOURCE_GATE_FAIL');
 if(frozenPlan.sourceReviewInputSha256!==baseSourceReview.inputSha256||!sourceReviewClosed(baseSourceReview))throw Error('PRESENTATION_BASE_MATH_OR_SOURCE_GATE_FAIL');
 let historicalBaseSourceReviewReplacement=null;
 if(frozenPlan.sourceReviewPolicySha256===sourcePolicy){
  if(baseSourceReview.policySha256!==sourcePolicy||!validateReviewLineage(root,baseSourceReview,'CONDITIONS',sourcePolicy,baseSourceInput))throw Error('PRESENTATION_BASE_MATH_OR_SOURCE_GATE_FAIL');
 }else{
  historicalBaseSourceReviewReplacement=validateQ10HistoricalBaseSourceReviewReplacement(root,{result,identity,basePlanRef,frozenPlan,semanticPlan,baseSourceReviewRef,currentPlanRef:overlay.currentPlanRef,currentPlan,currentSourceReviewRef:overlay.currentSourceReviewRef,source:sourceOnly,images,overlay});
  if(!historicalBaseSourceReviewReplacement)throw Error('PRESENTATION_BASE_MATH_OR_SOURCE_GATE_FAIL');
  if(canonicalJson(closure.historicalBaseSourceReviewReplacement)!==canonicalJson(historicalBaseSourceReviewReplacement))throw Error('PRESENTATION_HISTORICAL_BASE_SOURCE_REVIEW_REPLACEMENT_NOT_RECORDED');
 }
 const baseArchiveBank=JSON.parse(readBoundFile(root,stageOutput(stages,'ARCHIVE_BANK',ref=>ref.path.endsWith('/protected-parity.json'))));
 const baseCaptureRow=JSON.parse(readBoundFile(root,stageOutput(stages,'CAPTURE',ref=>ref.path.endsWith('/'+result.identity.assetId+'-sol-desktop.json'))));
 const baseCandidateSha=stageOutput(stages,'ARCHIVE_BANK',ref=>ref.path.endsWith('.js')).sha256.slice(7),engineRef=fileRef(root,'archive/engine.html');
 if(baseArchiveBank.status!=='PASS'||!baseProtectedArchiveCaptureRowPasses(baseCaptureRow,{targetId:result.identity.assetId,sourceSha256:identity.sourceRef.sha256.slice(7),candidateSha256:baseCandidateSha,engineSha256:engineRef.sha256.slice(7),archiveAssetPath:actualArchive.archiveAssetPath}))throw Error('PRESENTATION_BASE_PROTECTED_ARCHIVE_CAPTURE_FAIL');
 if(!sameRef(svgRef,overlay.finalSvgRef))throw Error('PRESENTATION_UNCHANGED_SVG_SHA_MISMATCH');
 readBoundFile(root,svgRef);
 const baseCandidateRef=stageOutput(stages,'ARCHIVE_BANK',ref=>ref.path.endsWith('.js'));
 if(baseCandidateRef.path!==overlay.baseCandidateRef?.path||baseCandidateRef.sha256!==overlay.baseCandidateRef?.sha256)throw Error('PRESENTATION_BASE_CANDIDATE_REF_MISMATCH');
 const sourceBank=loadBank(readBoundFile(root,identity.sourceRef).toString('utf8')),sourceQuestion=sourceBank.find(q=>q.id===target.sourceQuestionOrdinal);
 const baseBank=loadBank(readBoundFile(root,baseCandidateRef).toString('utf8')),baseQuestion=baseBank.find(q=>q.id===target.sourceQuestionOrdinal);
 const candidateBank=loadBank(readBoundFile(root,overlay.candidateRef).toString('utf8')),candidateQuestion=candidateBank.find(q=>q.id===target.sourceQuestionOrdinal);
 if(!sourceQuestion||!baseQuestion||!candidateQuestion||baseQuestion.content!==sourceQuestion.content||baseQuestion.answer!==sourceQuestion.answer||baseQuestion.solution!==sourceQuestion.solution||candidateQuestion.content!==sourceQuestion.content||candidateQuestion.answer!==sourceQuestion.answer||candidateQuestion.choices?.length!==sourceQuestion.choices?.length||canonicalJson(candidateQuestion.choices??null)!==canonicalJson(sourceQuestion.choices??null)||candidateQuestion.image!==sourceQuestion.image||candidateQuestion.solutionImage!==baseQuestion.solutionImage||candidateQuestion.solutionImageSize!==baseQuestion.solutionImageSize||candidateQuestion.solutionImageAlt!==baseQuestion.solutionImageAlt)throw Error('PRESENTATION_STUDENT_FIELDS_OR_ASSET_CHANGED');
 for(let index=0;index<baseBank.length;index++){const before={...baseBank[index]},after={...candidateBank[index]};if(before.id===target.sourceQuestionOrdinal){delete before.solution;delete after.solution;}if(canonicalJson(before)!==canonicalJson(after))throw Error('PRESENTATION_UNEXPECTED_CANDIDATE_FIELD_CHANGE');}
 const patch=JSON.parse(readBoundFile(root,overlay.solutionPatchRef));
 if(patch.schemaVersion!=='PHASE5_NATIVE_SOLUTION_PATCH_v1'||patch.questionUid!==target.questionUidV2||patch.baseSolutionSha256!==bytesSha(Buffer.from(sourceQuestion.solution,'utf8'))||candidateQuestion.solution!==patch.patchedSolution||overlay.baseSolutionSha256!==patch.baseSolutionSha256||overlay.patchedSolutionSha256!==bytesSha(Buffer.from(candidateQuestion.solution,'utf8')))throw Error('PRESENTATION_SOLUTION_PATCH_BINDING_INVALID');
 const tokenParity=compareSolutionTokenParity(sourceQuestion.solution,candidateQuestion.solution);
 if(tokenParity.status!=='PASS'||objectSha(tokenParity)!==objectSha(overlay.tokenParity))throw Error('PRESENTATION_SOLUTION_TOKEN_PARITY_FAIL');
 const candidateSuffix='/'+identity.sourceExamId+'/visual-engine/production/native-solution-overlay/'+identity.sourceExamId+'.js';
 if(!overlay.candidateRef?.path?.startsWith('.tmp/archive/')||!overlay.candidateRef.path.endsWith(candidateSuffix))throw Error('PRESENTATION_CANDIDATE_PATH_INVALID');
 const capture=overlay.archive,row=JSON.parse(readBoundFile(root,capture.rowRef));
 readBoundFile(root,capture.screenshotRef);readBoundFile(root,capture.nativeContextScreenshotRef);
 if(capture.status!=='PASS'||capture.synthetic!==false||capture.runtime!=='playwright-chromium'||capture.engineRef?.sha256!==engineRef.sha256||row.status!=='PASS'||row.synthetic!==false||row.runtime!=='playwright-chromium'||row.mode!=='sol'||row.viewport!=='desktop'||row.engineSha256!==engineRef.sha256.slice(7)||row.candidateSha256!==overlay.candidateRef.sha256.slice(7)||row.sourceSha256!==identity.sourceRef.sha256.slice(7)||!row.capture||row.capture.synthetic===true||!row.state?.targets?.some(t=>archiveAssetTargetMatches(t,overlay.archive.target.id,overlay.archiveAssetPath)))throw Error('PRESENTATION_ACTUAL_ARCHIVE_CAPTURE_INVALID');
 const review=JSON.parse(readBoundFile(root,closure.r3ReviewRef));
 const expectedReview={overlayRef:closure.overlayRef,candidateRef:overlay.candidateRef,finalSvgRef:svgRef,rowRef:capture.rowRef,screenshotRef:capture.screenshotRef,nativeContextScreenshotRef:capture.nativeContextScreenshotRef};
 const requiredReviewChecks=['sourceParity','answerParity','mathTokenParity','unchangedSvg','actualArchiveSol','nativeSolutionLineBreaks'];
 const reviewerIdentity=review.reviewerIdentity;
 const reviewerIdentityBound=typeof reviewerIdentity==='string'&&reviewerIdentity.length>0||reviewerIdentity&&typeof reviewerIdentity==='object'&&(typeof reviewerIdentity.agentId==='string'&&reviewerIdentity.agentId.length>0||typeof reviewerIdentity.taskId==='string'&&reviewerIdentity.taskId.length>0);
 if(review.schemaVersion!=='PHASE5_NATIVE_SOLUTION_OVERLAY_R3_REVIEW_v1'||review.status!=='PASS'||review.reviewerRole!=='archive_r3'||!reviewerIdentityBound||review.reviewType!=='INDEPENDENT_VISUAL_RECHECK'||review.questionUid!==target.questionUidV2||review.baseResultRef?.path!==resultRef.path||review.baseResultRef?.sha256!==resultRef.sha256||review.sourceSha256!==identity.sourceRef.sha256||review.errors?.length||!Array.isArray(review.observations)||!review.observations.length||review.overlayRef?.path!==expectedReview.overlayRef.path||review.overlayRef?.sha256!==expectedReview.overlayRef.sha256||review.candidateRef?.path!==expectedReview.candidateRef.path||review.candidateRef?.sha256!==expectedReview.candidateRef.sha256||review.candidateSha256!==overlay.candidateRef.sha256||review.finalSvgSha256!==svgRef.sha256||review.archiveRowRef?.path!==expectedReview.rowRef.path||review.archiveRowRef?.sha256!==expectedReview.rowRef.sha256||review.archiveRowSha256!==expectedReview.rowRef.sha256||review.screenshotRef?.path!==expectedReview.screenshotRef.path||review.screenshotRef?.sha256!==expectedReview.screenshotRef.sha256||review.screenshotSha256!==expectedReview.screenshotRef.sha256||review.nativeContextScreenshotRef?.path!==expectedReview.nativeContextScreenshotRef.path||review.nativeContextScreenshotRef?.sha256!==expectedReview.nativeContextScreenshotRef.sha256||review.nativeContextScreenshotSha256!==expectedReview.nativeContextScreenshotRef.sha256||requiredReviewChecks.some(key=>review.checks?.[key]!=='PASS')||Object.values(review.checks||{}).some(value=>value!=='PASS'))throw Error('PRESENTATION_R3_REVIEW_NOT_CLOSED');
 const mobile=validateNativeSolutionMobileR3Review(root,{reviewRef:closure.mobileReviewRef,overlayRef:closure.overlayRef,desktopReviewRef:closure.r3ReviewRef,overlay,identity,finalSvgRef:svgRef});
 const fonts=(row.layouts||[]).flatMap(layout=>layout.labelMeasurements||[]).map(value=>value.finalViewportCssFontPx).filter(Number.isFinite);
 const replacementEvidenceRefs=historicalBaseActualReplacement?{desktopOverlayRef:closure.overlayRef,desktopArchiveRowRef:capture.rowRef,desktopScreenshotRef:capture.screenshotRef,desktopContextScreenshotRef:capture.nativeContextScreenshotRef,desktopR3ReviewRef:closure.r3ReviewRef,mobileR3ReviewRef:mobile.mobileReviewRef,mobileMatrixRef:mobile.mobileMatrixRef,mobileRowRef:mobile.mobileRowRef,mobileScreenshotRef:mobile.mobileScreenshotRef,mobileContextScreenshotRef:mobile.nativeContextScreenshotRef,mobileCssRef:mobile.cssRef}:null;
 const historicalReplacement=historicalBaseActualReplacement?{...historicalBaseActualReplacement,currentOverlayCaptureReplacement:replacementEvidenceRefs}:null;
 return{status:'PASS',planRef:overlay.currentPlanRef,finalSvgRef:svgRef,overlayRef:closure.overlayRef,r3ReviewRef:closure.r3ReviewRef,mobileReviewRef:mobile.mobileReviewRef,mobileCssRef:mobile.cssRef,mobileQBoxWidth:mobile.qBoxWidthCssPx,mobileContentWidth:mobile.solutionMetaContentWidthCssPx,historicalBaseActualReplacement:historicalReplacement,historicalBaseSourceReviewReplacement,minCssFont:fonts.length?Math.min(...fonts):null};
}

export function qualifyVisualEngine(root,{registryRef,rosterRef,migrationsRef,resultRefs,testReportRef,presentationCorrectionRefs=[]}){
 const errors=[],rows=[];
 const registryRaw=JSON.parse(readBoundFile(root,registryRef));
 const registry=normalizeSourceExamIdRegistry(registryRaw),registration=registryRaw.registration;
 if(registration?.schemaVersion!=='SOURCE_EXAM_REGISTRATION_DECISION_v1'||registration.status!=='REGISTERED_CURRENT_SOURCE_IDENTITIES'||registration.decision?.authority!=='DIRECT_USER_INSTRUCTION'||registration.decision?.scope!=='CURRENT_SOURCE_IDENTITY_REGISTRATION_ONLY')errors.push('SOURCE_REGISTRATION_DECISION_NOT_CLOSED');
 if(registration?.identityMapRef?.path==='archive/data/question_identity_map.json'){
  const identityMap=JSON.parse(readBoundFile(root,registration.identityMapRef));
  const currentIdentityMapRef=fileRef(root,'archive/data/question_identity_map.json');
  fail(errors,registration.identityMapRef.bytes===currentIdentityMapRef.bytes&&registration.identityMapRef.sha256===currentIdentityMapRef.sha256,'SOURCE_IDENTITY_MAP_REF_NOT_CURRENT');
  if(identityMap.schemaVersion!=='question-identity-map-v1'||identityMap.identityAlgorithm?.version!=='qid_v1'||!Array.isArray(identityMap.records))errors.push('SOURCE_IDENTITY_MAP_INVALID');
  if(registration.registrySha256!==objectSha(registry))errors.push('SOURCE_REGISTRATION_REGISTRY_SHA_MISMATCH');
  const roster=JSON.parse(readBoundFile(root,rosterRef)),migrations=JSON.parse(readBoundFile(root,migrationsRef));
  if(!Array.isArray(roster)||!Array.isArray(migrations)||!Array.isArray(resultRefs))throw Error('QUALIFICATION_INPUT_INVALID');
  if(!Array.isArray(presentationCorrectionRefs))throw Error('PRESENTATION_CORRECTION_REFS_INVALID');
  fail(errors,registration.rosterSha256===objectSha(roster)&&registration.migrationsSha256===objectSha(migrations),'SOURCE_REGISTRATION_SCOPE_SHA_MISMATCH');
  const groups={GEOMETRY:roster.filter(v=>v.group==='GEOMETRY').length,GRAPH:roster.filter(v=>v.group==='GRAPH').length};
  fail(errors,roster.length===10&&groups.GEOMETRY===6&&groups.GRAPH===4&&groups.GEOMETRY+groups.GRAPH===roster.length,'QUALIFICATION_DENOMINATOR_NOT_BOUNDED_PHASE5_COHORT');
  fail(errors,registry.entries.length===roster.length&&migrations.length===roster.length&&resultRefs.length===roster.length,'QUALIFICATION_EVIDENCE_CARDINALITY_MISMATCH');
  const uidSet=new Set(roster.map(v=>v.questionUidV2));
  fail(errors,uidSet.size===roster.length,'QUALIFICATION_ROSTER_DUPLICATE');
  const migrationByUid=new Map();
  for(const migration of migrations){
   if(migrationByUid.has(migration.questionUidV2))errors.push('QUALIFICATION_MIGRATION_DUPLICATE');
   migrationByUid.set(migration.questionUidV2,migration);
  }
  const results=new Map();
  for(const ref of resultRefs){
   const result=JSON.parse(readBoundFile(root,ref)),uid=result.identity?.questionUid;
   if(!uidSet.has(uid))errors.push('QUALIFICATION_RESULT_OUT_OF_ROSTER');
   if(results.has(uid))errors.push('QUALIFICATION_DUPLICATE_RESULT');
   results.set(uid,{result,ref});
  }
  fail(errors,presentationCorrectionRefs.length===1,'QUALIFICATION_PRESENTATION_CORRECTION_COHORT_INVALID');
  const correctionByUid=new Map();
  for(const ref of presentationCorrectionRefs){
   const closure=JSON.parse(readBoundFile(root,ref));
   if(closure?.schemaVersion!=='PHASE5_NATIVE_SOLUTION_PRESENTATION_CLOSURE_v1'||typeof closure.questionUid!=='string'||correctionByUid.has(closure.questionUid))errors.push('QUALIFICATION_PRESENTATION_CORRECTION_REF_INVALID');
   else correctionByUid.set(closure.questionUid,ref);
  }
  for(const target of roster){
   const rowErrors=[],uid=target.questionUidV2;
   const identity=currentSourceIdentity(root,identityMap,target);rowErrors.push(...identity.errors);
   const entry=registry.entries.find(value=>value.questionUidV2===uid&&value.status==='ACTIVE');
   if(!entry||entry.sourcePath!==target.sourcePath||entry.sourceQuestionOrdinal!==target.sourceQuestionOrdinal||entry.sourceSha256!==identity.sourceRef?.sha256||entry.sourceIdentityKey!=='source-file:'+target.sourcePath.slice('archive/exams/'.length).normalize('NFC')||entry.sourceExamId!==identity.sourceExamId||entry.canonicalSourceExamId!==identity.sourceExamId||entry.legacyQuestionUid!==identity.legacy)rowErrors.push('QUALIFICATION_SOURCE_REGISTRY_DERIVATION_MISMATCH');
   if(identity.sourceRef)readBoundFile(root,identity.sourceRef);
   const migration=migrationByUid.get(uid);
   const migrationAudit=validateUidMigrationEvidence(migration,{questionUidV2:uid,legacyQuestionUid:identity.legacy,sourcePath:target.sourcePath,sourceSha256:identity.sourceRef?.sha256});
   rowErrors.push(...migrationAudit.errors);
   const bound=results.get(uid);let audit=null,presentation=null;
   if(!bound)rowErrors.push('QUALIFICATION_RESULT_MISSING');
   else{
    const {result,ref}=bound;
    const correctionRef=correctionByUid.get(uid);
    if(correctionRef){
     try{presentation=validateNativeSolutionPresentationClosure(root,correctionRef,target,ref,result,identity,registryRef);}
     catch(error){rowErrors.push('PRESENTATION_CORRECTION_NOT_CLOSED:'+error.message);}
    }
    const presentationPass=presentation?.status==='PASS';
    if((result.status!=='PHASE2_SLICE_COMPLETE'||result.productionAuthorized!==false||result.qualificationStatus!=='NOT_QUALIFIED')&&!presentationPass)rowErrors.push('CANONICAL_SLICE_NOT_COMPLETE');
    const registryCurrent=result.sourceRegistryRef?.sha256===registryRef.sha256&&result.sourceRegistryRef?.path===registryRef.path;
    if(result.identity?.questionUid!==uid||(!registryCurrent&&!presentationPass))rowErrors.push('QUALIFICATION_REGISTRY_BINDING_MISMATCH');
    if(result.sourceRef?.sha256!==identity.sourceRef?.sha256||result.sourceRef?.path!==target.sourcePath)rowErrors.push('QUALIFICATION_SOURCE_SHA_MISMATCH');
    const planRef=result.planRef??presentation?.planRef;
    if(!planRef)rowErrors.push('QUALIFICATION_PLAN_REF_MISSING');
    else{
     const plan=JSON.parse(readBoundFile(root,planRef));
     const expectedCapability=target.group==='GEOMETRY'?'construction-spike-v1':'polynomial-spike-v1';
     if(plan.capability!==expectedCapability||(target.group==='GEOMETRY')!==Boolean(plan.mathPlan)||(target.group==='GRAPH')!==Boolean(plan.graphPlan))rowErrors.push('QUALIFICATION_GROUP_PLAN_MISMATCH');
     if(!presentationPass&&result.fingerprint!==scopeFingerprint(root,plan.capability))rowErrors.push('QUALIFICATION_IMPLEMENTATION_FINGERPRINT_STALE');
     if(result.status==='PHASE2_SLICE_COMPLETE'&&!presentationPass){
      audit=auditSlice(root,ref);rowErrors.push(...audit.errors);
     }
    }
    if(result.repairLedger?.length>3)rowErrors.push('QUALIFICATION_REPAIR_BUDGET_EXCEEDED');
   }
   rows.push({questionUid:uid,group:target.group,status:rowErrors.length?'FAIL':'PASS',errors:rowErrors,resultRef:bound?.ref??null,presentationCorrectionRef:correctionByUid.get(uid)??null,finalSvgRef:presentation?.finalSvgRef??bound?.result.finalSvgRef??null,minCssFont:audit?.minCssFont??null});
  }
 }else errors.push('SOURCE_IDENTITY_MAP_REF_REQUIRED');
 const testEvidence=validateTestReport(root,testReportRef,errors);
 if(rows.some(row=>row.status!=='PASS'))errors.push('QUALIFICATION_ITEM_DEBT');
 return{schemaVersion:'VISUAL_ENGINE_PHASE5_COHORT_QUALIFICATION_v1',status:errors.length?'FAIL':'PASS',errors,denominator:{GEOMETRY:6,GRAPH:4,total:10},qualified:{GEOMETRY:rows.filter(r=>r.group==='GEOMETRY'&&r.status==='PASS').length,GRAPH:rows.filter(r=>r.group==='GRAPH'&&r.status==='PASS').length},requiredTotal:10,qualifiedTotal:rows.filter(r=>r.status==='PASS').length,registryRef,rosterRef,migrationsRef,testReportRef,resultRefs,presentationCorrectionRefs,testCodeInventorySha256:testEvidence.codeInventorySha256,rows,productionAuthorized:false,generalEngineReadiness:false};
}

export function sealQualifiedVisualEngine(root,qualificationRef){
 const qualification=JSON.parse(readBoundFile(root,qualificationRef));
 const current=qualifyVisualEngine(root,qualification);
 if(objectSha(current)!==objectSha(qualification))throw Error('PHASE5_QUALIFICATION_NOT_CURRENT');
 if(qualification?.schemaVersion!=='VISUAL_ENGINE_PHASE5_COHORT_QUALIFICATION_v1'||qualification.status!=='PASS'||qualification.errors.length||qualification.qualifiedTotal!==10||qualification.qualified.GEOMETRY!==6||qualification.qualified.GRAPH!==4)throw Error('PHASE5_COHORT_QUALIFICATION_REQUIRED');
 return{schemaVersion:'VISUAL_ENGINE_PHASE5_COHORT_RECORD_v1',state:'PHASE5_COHORT_QUALIFIED',active:false,phase:5,qualificationRef,qualificationSha256:objectSha(qualification),qualifiedTotal:qualification.qualifiedTotal,scope:{capabilities:['construction-spike-v1','quadratic-polynomial-layout-v1'],sourceRegistryRef:qualification.registryRef,qualificationRosterRef:qualification.rosterRef},productionPublication:false,generalEngineReadiness:'NOT_ESTABLISHED',limits:'This record closes only the bound 10-item Phase 5 cohort. It does not mark the general visual engine ACTIVE or code-ready.'};
}
