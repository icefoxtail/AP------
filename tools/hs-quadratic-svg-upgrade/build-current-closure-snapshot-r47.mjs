import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');
const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');
const read=name=>JSON.parse(fs.readFileSync(path.join(REPORT,name)));
const base=read('692_current_closure_snapshot_r46_v3_closed.json');
const v1=read('693_specialist_v1_expected_facts_r47.json');
const independent=read('699_independent_recheck_specialist_r47.json');
const staticVisual=read('696_specialist_candidate_visual_static_check_r47.json');
const bank=read('695_specialist_candidate_bank_manifest_r47.json');
const bankValidation=read('698_specialist_candidate_bank_validation_r47.json');
const v2=read('697_specialist_v2_artifact_only_r47.json');
const v3=read('700_specialist_v3_parity_r47.json');
const freeze=read('701_specialist_solution_freeze_ledger_r47.json');
const scopedAudit=read('707_target_scoped_visual_coverage_r47.json');
const render=read('706_specialist_local_render_review_r47.json');
const prep=read('705_current_v2_preparation_r47.json');
const machine=read('703_machine_evidence_r47.json');
const machineValidation=read('704_machine_evidence_validation_r47.json');
const scoped=read('702_scoped_candidate_bank_manifest_r47.json');
const triage=fs.readFileSync(path.join(REPORT,'03_visual_triage.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
const decisions=new Map(triage.map(row=>[`${row.questionUid.split('|')[0]}|${row.questionUid.split('|').at(-1)}`,row]));
function load(relativePath){const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(ROOT,relativePath),'utf8'),context,{filename:relativePath,timeout:10000});return JSON.parse(JSON.stringify(context.window));}
let targetRows=0;let currentTargetVisuals=0;for(const file of scoped.candidateFiles){const exam=load(file.candidatePath);for(const question of exam.questionBank){const decision=decisions.get(`${file.sourcePath}|${question.id}`);targetRows+=1;if(question.solutionImage&&decision?.visualDecision!=='NO_VISUAL')currentTargetVisuals+=1;}}
const freshFactsThroughR47=412;
const output={
  ...base,
  schemaVersion:'HS_QUADRATIC_CURRENT_CLOSURE_SNAPSHOT_R47_V3_CLOSED',
  status:'R47_SPECIALIST_BATCH_V3_CLOSED_FULL_SCOPE_REMAINS_OPEN_NO_FINAL_PASS',
  scope:{targetQuestionCount:targetRows,sourceFileCount:59,examFileCount:59},
  r47Batch:{rows:v1.rows.length,numberLineRows:v1.rows.filter(row=>row.expectedVisualType==='number-line').length,cartesianRows:v1.rows.filter(row=>row.expectedVisualType==='cartesian').length,v1ExpectedFacts:`${v1.rows.length}/${v1.rows.length}`,independentRecheck:`${independent.checkedRows}/${independent.checkedRows}`,solutionFreeze:`${freeze.frozenRows}/${v1.rows.length} candidate rows`,candidateStatic:`${staticVisual.rows.filter(row=>row.status==='STATIC_CHECKED').length}/${staticVisual.rows.length}`,v2ArtifactOnly:`${v2.rows.length}/${v1.rows.length}`,v3Pass:`${v3.passCount}/${v3.rows.length}`,v3Fail:v3.failCount,localRender:`${render.rows.filter(row=>row.status==='LOCAL_RENDER_REVIEWED').length}/${render.rows.length}`,localRenderOverflow:render.overflowLabelCount,bankValidationErrors:bankValidation.errors.length,targetScopedAudit:scopedAudit.status,evidence:{v1:'reports/hs-quadratic-svg-upgrade-20260908/693_specialist_v1_expected_facts_r47.json',independentRecheck:'reports/hs-quadratic-svg-upgrade-20260908/699_independent_recheck_specialist_r47.json',visualManifest:'reports/hs-quadratic-svg-upgrade-20260908/694_specialist_candidate_visual_manifest_r47.json',static:'reports/hs-quadratic-svg-upgrade-20260908/696_specialist_candidate_visual_static_check_r47.json',candidateBank:'reports/hs-quadratic-svg-upgrade-20260908/695_specialist_candidate_bank_manifest_r47.json',bankValidation:'reports/hs-quadratic-svg-upgrade-20260908/698_specialist_candidate_bank_validation_r47.json',v2:'reports/hs-quadratic-svg-upgrade-20260908/697_specialist_v2_artifact_only_r47.json',v3:'reports/hs-quadratic-svg-upgrade-20260908/700_specialist_v3_parity_r47.json',solutionFreeze:'reports/hs-quadratic-svg-upgrade-20260908/701_specialist_solution_freeze_ledger_r47.json',render:'reports/hs-quadratic-svg-upgrade-20260908/706_specialist_local_render_review_r47.json',targetScopedAudit:'reports/hs-quadratic-svg-upgrade-20260908/707_target_scoped_visual_coverage_r47.json'}},
  targetScopedVisualCoverage:{currentTargetVisuals:currentTargetVisuals,remainingCandidateVisuals:379-currentTargetVisuals,source:'computed from 430 scoped rows and 03_visual_triage path/id keys'},
  candidateVisualProgress:{priorTargetScopedVisuals:currentTargetVisuals-v1.rows.length,r47BatchTargetRows:v1.rows.length,r47BatchOutOfScopeRows:0,currentTargetScopedVisuals:currentTargetVisuals,remainingTargetScopedVisuals:379-currentTargetVisuals,freshExpectedFactRowsThroughR47:freshFactsThroughR47,remainingFreshExpectedFactsUnderCurrentCounting:430-freshFactsThroughR47},
  currentV2Preparation:{workBatchId:prep.workBatchId,runCount:prep.runCount,preparedQuestionCount:prep.preparedQuestionCount,errors:prep.errors.length,machineEvidenceCount:machine.evidenceCount,machineEvidenceValidationErrors:machineValidation.errors.length,preparation:'reports/hs-quadratic-svg-upgrade-20260908/705_current_v2_preparation_r47.json',machineEvidence:'reports/hs-quadratic-svg-upgrade-20260908/703_machine_evidence_r47.json',machineEvidenceValidation:'reports/hs-quadratic-svg-upgrade-20260908/704_machine_evidence_validation_r47.json',wholeJobFreeze:'NOT_ATTEMPTED_MISSING_PROVIDER_RENDER_CAPTURE'},
  remainingGates:['fresh independent math A1/A2 and solution freeze for full 430 rows','fresh V1 expected facts for remaining 18 rows under current counting','artifact-only V2 and semantic V3 for remaining 14 target-scoped candidate visual rows','provider-attested FINAL_AUDIT','actual current desktop/mobile capture and independent render-review for the full required scope','source registry identity authority for 15 mismatched exam titles','DB/question-index/production promotion authority'],
  note:'R47 closes eight in-scope target rows after source-only facts, independent recheck, candidate SVG, artifact-only V2, V3 parity, solution freeze and local render. Target-scoped coverage is authoritative; full 1295-row candidate visual count is auxiliary.',
};
fs.writeFileSync(path.join(REPORT,'708_current_closure_snapshot_r47_v3_closed.json'),`${JSON.stringify(output,null,2)}\n`);
console.log(JSON.stringify({status:output.status,r47Rows:output.r47Batch.rows,v3Pass:output.r47Batch.v3Pass,targetRows,currentTargetScopedVisuals:currentTargetVisuals,remainingTargetScopedVisuals:379-currentTargetVisuals,remainingFreshExpectedFacts:430-freshFactsThroughR47,candidateVisualCount:bank.totalDeclaredCandidateVisualCount},null,2));
