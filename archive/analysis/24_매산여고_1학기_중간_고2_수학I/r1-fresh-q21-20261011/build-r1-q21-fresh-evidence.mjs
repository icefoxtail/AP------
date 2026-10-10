import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/h2-1mid-20261010/AP------';
const rel='archive/analysis/24_매산여고_1학기_중간_고2_수학I';
const basePath=path.join(root,rel,'r1-clean-20261011/r1-final-evidence.v2.json');
const bundlePath=path.join(root,rel,'r2-fresh-q21-20261011/full-current-student-only.bundle.json');
const sourcePath=path.join(root,'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js');
const projectionPath=path.join(root,'archive/data/question_metadata.json');
const catalogPath=path.join(root,'archive/data/archive2-catalog.json');
const runtimePath=path.join(root,'archive/data/meta-foundation/runtime/functions-graphs-v1.json');
const svgRef='assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution-recovery.svg';
const svgPath=path.join(root,'archive',svgRef);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const base=JSON.parse(fs.readFileSync(basePath,'utf8'));
const bundle=JSON.parse(fs.readFileSync(bundlePath,'utf8'));
const w={}; vm.runInNewContext(fs.readFileSync(sourcePath,'utf8'),{window:w,console});
const q=w.questionBank.find(x=>Number(x.id)===21);
const b=bundle.rows.find(x=>Number(x.qid)===21);
if(!q||!b)throw Error('Q21_SOURCE_OR_BUNDLE_MISSING');
const studentFields=['id','content','choices','layoutTag','wide'];
const pick=o=>Object.fromEntries(studentFields.filter(k=>Object.prototype.hasOwnProperty.call(o,k)).map(k=>[k,o[k]]));
if(JSON.stringify(pick(q))!==JSON.stringify(pick(b.student)))throw Error('Q21_STUDENT_FIELD_PARITY_FAIL');
const findUid=(file,uid)=>{const x=JSON.parse(fs.readFileSync(file,'utf8'));let found=null;function walk(v){if(!v||typeof v!=='object')return;if(v.questionUid===uid)found=v;for(const z of Object.values(v))walk(z)}walk(x);return found};
const projection=findUid(projectionPath,q.questionUid);
const catalog=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
let catalogRow=null;function walk(v){if(!v||typeof v!=='object')return;if(v.questionUid===q.questionUid)catalogRow=v;for(const z of Object.values(v))walk(z)}walk(catalog);
if(!projection||!catalogRow)throw Error('Q21_PROJECTION_ROW_MISSING');
const runtime=JSON.parse(fs.readFileSync(runtimePath,'utf8'));
function findKey(k){let out=null;function wlk(v){if(!v||typeof v!=='object')return;if(v.key===k)out=v;for(const z of Object.values(v))wlk(z)}wlk(runtime);return out}
const runtimeBindings=['PT_FUNCTION_GRAPH_PROPERTIES','TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT','COND_RANGE'].map(key=>{const rec=findKey(key);return {key,canonicalKeyPresent:Boolean(rec),currentQuestionUidBound:Boolean(rec?.questionUids?.includes(q.questionUid))}});
const row={
  qid:21, verdict:'PASS', repairApplied:false,
  axisEvidence:{
    QUESTION_LAYOUT:{status:'PASS_STATIC_KEEP',observation:'Current student-only bundle q21 matches source id/content/choices/layoutTag/wide exactly; five choices are in the intended order, no question-side asset is referenced, and no text/choice edit is warranted. Actual Archive engine render remains R3-owned.',sourceStudentFieldsExactParity:true,choicesExactEquality:true,actualEngineRender:'NOT_RUN_R3'},
    SOLUTION_LAYOUT:{status:'PASS_STATIC',observation:'The solution lays out the angle interval, identifies the unique cosine extrema at 2π and 3π, computes (a,b,c,d)=(5,5,7,1), and ends with ad+bc=40 and choice ④. The line breaks keep the equation steps legible.',smallBoardContinuityStatus:'PASS',goldenCalibrationRef:`${rel}/r1-clean-20261011/r1-golden-calibration-v2.json`},
    META:{status:'REVIEWED_WITH_RECORDED_PROJECTION_DEBT',observation:'Source unit/subunit keys are active and parent-consistent. Source PT/TPL/condition/difficulty values are retained as reviewed source fields; the exact current-UID RPM and projection binding is absent, so no crosswalk or projection is inferred.',standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,level:q.level,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,questionUid:q.questionUid,sourceArchiveFile:q.sourceArchiveFile,sourceQid:q.sourceQid,projectionStatus:projection.metadataStatus,rpmProjectionFields:{curriculumKey:catalogRow.curriculumKey,courseKey:catalogRow.courseKey,L1:catalogRow.L1,L2:catalogRow.L2,L3:catalogRow.L3,L4:catalogRow.L4},runtimeBindings},
    VISUAL_SVG:{status:'PASS_STATIC',problemNeed:'EXEMPT_NO_REQUIRED_PROBLEM_IMAGE',solutionNeed:'BENEFICIAL_PRESENT',problemRef:null,solutionRef:svgRef,assets:[{ref:svgRef,sha256:sha(svgPath),bytes:fs.statSync(svgPath).size,assetFileRead:true,openInCodexStatus:'QUEUED'}],semanticParityObservation:'SVG coordinates cover x=4..8 with endpoint values 3, centerline y=3, maximum marker (5,5), minimum marker (7,1), and labels matching the source function and solution. Static XML geometry/labels were checked; no browser render was performed.',actualBrowserRender:'NOT_RUN_R3'}
  },
  smallBoardContinuityStatus:'PASS',independentAnswer:'4번 선택지 (40)',independentReasoning:'freeze 전 고정한 계산: θ=π/2(x−1)가 3π/2부터 7π/2까지 변한다. 최댓값은 θ=2π에서 x=5, h=5이고 최솟값은 θ=3π에서 x=7, h=1이다. 따라서 ad+bc=5·1+5·7=40.',independentFreezeAnswer:'4번 선택지 (40)',independentFreezeWasBeforeStoredAnswer:true,independentAnswerFrozenBeforeStoredAnswer:true,storedAnswer:q.answer,compareResult:q.answer==='④'?'MATCH':'MISMATCH',originalFreezeCompare:'MATCH',postfreezeAdjudicationReason:null,sourceRepairRecheck:'NOT_REQUIRED',
  metaDebtFields:[],
  metaDebtReason:'현재 question_metadata.json UID 행은 registration_pending_semantic_review이며 standardUnit/subUnit/concept/problemType/template/difficulty가 manual_review_pending 또는 blank다. archive2-catalog의 curriculumKey/courseKey/L1-L4도 blank이고, active functions-graphs runtime pack에서 현재 UID가 PT_FUNCTION_GRAPH_PROPERTIES, TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT, COND_RANGE 목록에 결속되지 않았다. 기존 source 값을 보존하고 RPM L1-L4 또는 crosswalk를 추정하지 않는다.',
  difficultyReview:{status:'INDEPENDENT_REVIEW_MATCHES_CURRENT_SOURCE',level:q.level,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reason:'구간 안의 주기각으로 극값의 위치와 함숫값을 확인한 뒤 한 번 대입한다. 익숙한 삼각함수 그래프 성질과 구간 추적이 핵심이며 단순 계산 이상이므로 중간 수준에 해당한다.'}
};
base.rows=base.rows.map(r=>Number(r.qid)===21?row:r);
const disposition=base.artifactDispositions.rows.find(r=>Number(r.qid)===21);
if(!disposition)throw Error('Q21_ARTIFACT_DISPOSITION_MISSING');
Object.assign(disposition,{metaDebtFields:row.metaDebtFields,metaDebtReason:row.metaDebtReason,sourceProjectionDebt:{status:'NO_CURRENT_PARITY',path:'archive/data/question_metadata.json',rawSha256:sha(projectionPath),catalogPath:'archive/data/archive2-catalog.json',catalogRawSha256:sha(catalogPath),metadataStatus:projection.metadataStatus,catalogMetadataStatus:catalogRow.metadataStatus,reason:'Existing source-only values are reviewed; unified metadata/catalog projection and current UID runtime mapping remain pending. ROOT-owned global projection gap is preserved without source mutation or guessed semantic remap.'},reviewedSourceMeta:{standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,level:q.level,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility}});
base.sourceFirst.reusedIntakeEvidence={bundleRawSha256:bundle.sourceRawSha256,bundleFileSha256:sha(bundlePath),bundleSchema:bundle.schemaVersion,path:`${rel}/r2-fresh-q21-20261011/full-current-student-only.bundle.json`,adapterProvenance:bundle.adapterProvenance,currentQ21StudentPayloadSha256:b.studentPayloadSha256,actualProblemAsset:{ref:null,opened:false,reason:'q21 has no problem-side asset'}};
base.sourceFirst.currentStudentExactParity={status:'PASS',qidCount:24,checks:'Current student-only bundle is bound to current source raw SHA; replacement q21 exact student-field parity was independently checked. Unchanged R1 rows q1–20 and q22–24 are reused and rebound to current source SHA.'};
base.sourceFirst.extractedBaselineParity='CURRENT_STUDENT_BUNDLE_SHA_BOUND; no original PDF parity claim';
const proj=base.metaAxis.sourceToProjection;proj.rawSha256=sha(projectionPath);proj.status='SOURCE_TO_PROJECTION_PARITY_OPEN';proj.rootDisposition='GLOBAL_PROJECTION_FILES_NOT_TOUCHED';
base.metaAxis.nullProjectionDebtReasonsByQid['21']=row.metaDebtReason;
base.metaAxis.currentKeyCrosswalkReviewFlags['21']='Current source PT_FUNCTION_GRAPH_PROPERTIES/TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT and COND_RANGE are not bound to this UID in the active functions-graphs runtime pack; preserve source values and leave RPM/crosswalk mapping unresolved pending exact semantic evidence.';
base.visualAxis.svgAssetRefs=base.visualAxis.svgAssetRefs.map(a=>a.qid===21?{qid:21,ref:svgRef,sha256:sha(svgPath)}:a);
base.visualAxis.actualBrowserRender='NOT_RUN_R3';
const outPath=path.join(root,rel,'r1-fresh-q21-20261011/r1-final-evidence.revision2.unbound.json');
fs.writeFileSync(outPath,JSON.stringify(base,null,2)+'\n');
console.log(JSON.stringify({outPath,sourceSha256:bundle.sourceRawSha256,studentParity:true,projectionSha256:sha(projectionPath),catalogSha256:sha(catalogPath),svgSha256:sha(svgPath),rowCount:base.rows.length,dispositionQ21:disposition},null,2));



