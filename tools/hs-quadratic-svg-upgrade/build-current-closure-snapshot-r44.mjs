import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');
const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');
const read=name=>JSON.parse(fs.readFileSync(path.join(REPORT,name)));
const base=read('644_current_closure_snapshot_r43_v3_closed.json');
const v1=read('645_specialist_v1_expected_facts_r44.json');
const independent=read('651_independent_recheck_specialist_r44.json');
const staticVisual=read('648_specialist_candidate_visual_static_check_r44.json');
const bank=read('647_specialist_candidate_bank_manifest_r44.json');
const bankValidation=read('650_specialist_candidate_bank_validation_r44.json');
const v2=read('649_specialist_v2_artifact_only_r44.json');
const v3=read('652_specialist_v3_parity_r44.json');
const freeze=read('653_specialist_solution_freeze_ledger_r44.json');
const scopedAudit=read('659_target_scoped_visual_coverage_r44.json');
const render=read('658_specialist_local_render_review_r44.json');
const prep=read('657_current_v2_preparation_r44.json');
const machine=read('655_machine_evidence_r44.json');
const machineValidation=read('656_machine_evidence_validation_r44.json');
const scoped=read('654_scoped_candidate_bank_manifest_r44.json');
const triage=fs.readFileSync(path.join(REPORT,'03_visual_triage.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
const decisions=new Map(triage.map(row=>[`${row.questionUid.split('|')[0]}|${row.questionUid.split('|').at(-1)}`,row]));
function load(relativePath){const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(ROOT,relativePath),'utf8'),context,{filename:relativePath,timeout:10000});return JSON.parse(JSON.stringify(context.window));}
let targetRows=0; let currentTargetVisuals=0;
for(const file of scoped.candidateFiles){const exam=load(file.candidatePath);for(const question of exam.questionBank){const decision=decisions.get(`${file.sourcePath}|${question.id}`);targetRows+=1;if(question.solutionImage&&decision?.visualDecision!=='NO_VISUAL')currentTargetVisuals+=1;}}
const freshFactsThroughR44=388;
const output={
  ...base,
  schemaVersion:'HS_QUADRATIC_CURRENT_CLOSURE_SNAPSHOT_R44_V3_CLOSED',
  status:'R44_SPECIALIST_BATCH_V3_CLOSED_FULL_SCOPE_REMAINS_OPEN_NO_FINAL_PASS',
  scope:{targetQuestionCount:targetRows,sourceFileCount:59,examFileCount:59},
  r44Batch:{
    rows:v1.rows.length,
    numberLineRows:v1.rows.filter(row=>row.expectedVisualType==='number-line').length,
    cartesianRows:v1.rows.filter(row=>row.expectedVisualType==='cartesian').length,
    v1ExpectedFacts:`${v1.rows.length}/${v1.rows.length}`,
    independentRecheck:`${independent.checkedRows}/${independent.checkedRows}`,
    solutionFreeze:`${freeze.frozenRows}/${v1.rows.length} candidate rows`,
    candidateStatic:`${staticVisual.rows.filter(row=>row.status==='STATIC_CHECKED').length}/${staticVisual.rows.length}`,
    v2ArtifactOnly:`${v2.rows.length}/${v1.rows.length}`,
    v3Pass:`${v3.passCount}/${v3.rows.length}`,
    v3Fail:v3.failCount,
    localRender:`${render.rows.filter(row=>row.status==='LOCAL_RENDER_REVIEWED').length}/${render.rows.length}`,
    localRenderOverflow:render.overflowLabelCount,
    bankValidationErrors:bankValidation.errors.length,
    targetScopedAudit:scopedAudit.status,
    evidence:{
      v1:'reports/hs-quadratic-svg-upgrade-20260908/645_specialist_v1_expected_facts_r44.json',
      independentRecheck:'reports/hs-quadratic-svg-upgrade-20260908/651_independent_recheck_specialist_r44.json',
      visualManifest:'reports/hs-quadratic-svg-upgrade-20260908/646_specialist_candidate_visual_manifest_r44.json',
      static:'reports/hs-quadratic-svg-upgrade-20260908/648_specialist_candidate_visual_static_check_r44.json',
      candidateBank:'reports/hs-quadratic-svg-upgrade-20260908/647_specialist_candidate_bank_manifest_r44.json',
      bankValidation:'reports/hs-quadratic-svg-upgrade-20260908/650_specialist_candidate_bank_validation_r44.json',
      v2:'reports/hs-quadratic-svg-upgrade-20260908/649_specialist_v2_artifact_only_r44.json',
      v3:'reports/hs-quadratic-svg-upgrade-20260908/652_specialist_v3_parity_r44.json',
      solutionFreeze:'reports/hs-quadratic-svg-upgrade-20260908/653_specialist_solution_freeze_ledger_r44.json',
      render:'reports/hs-quadratic-svg-upgrade-20260908/658_specialist_local_render_review_r44.json',
      targetScopedAudit:'reports/hs-quadratic-svg-upgrade-20260908/659_target_scoped_visual_coverage_r44.json',
    },
  },
  targetScopedVisualCoverage:{currentTargetVisuals,remainingCandidateVisuals:379-currentTargetVisuals,source:'computed from 430 scoped rows and 03_visual_triage path/id keys'},
  candidateVisualProgress:{priorTargetScopedVisuals:currentTargetVisuals-v1.rows.length,r44BatchTargetRows:v1.rows.length,r44BatchOutOfScopeRows:0,currentTargetScopedVisuals:currentTargetVisuals,remainingTargetScopedVisuals:379-currentTargetVisuals,freshExpectedFactRowsThroughR44:freshFactsThroughR44,remainingFreshExpectedFactsUnderCurrentCounting:430-freshFactsThroughR44},
  currentV2Preparation:{workBatchId:prep.workBatchId,runCount:prep.runCount,preparedQuestionCount:prep.preparedQuestionCount,errors:prep.errors.length,machineEvidenceCount:machine.evidenceCount,machineEvidenceValidationErrors:machineValidation.errors.length,preparation:'reports/hs-quadratic-svg-upgrade-20260908/657_current_v2_preparation_r44.json',machineEvidence:'reports/hs-quadratic-svg-upgrade-20260908/655_machine_evidence_r44.json',machineEvidenceValidation:'reports/hs-quadratic-svg-upgrade-20260908/656_machine_evidence_validation_r44.json',wholeJobFreeze:'NOT_ATTEMPTED_MISSING_PROVIDER_RENDER_CAPTURE'},
  remainingGates:['fresh independent math A1/A2 and solution freeze for full 430 rows','fresh V1 expected facts for remaining 42 rows under current counting','artifact-only V2 and semantic V3 for remaining 38 target-scoped candidate visual rows','provider-attested FINAL_AUDIT','actual current desktop/mobile capture and independent render-review for the full required scope','source registry identity authority for 15 mismatched exam titles','DB/question-index/production promotion authority'],
  note:'R44 closes seven in-scope target rows after source-only facts, independent recheck, candidate SVG, artifact-only V2, V3 parity, solution freeze and local render. One visually triaged out-of-scope row was excluded from target-scoped progress. Target-scoped coverage is authoritative; full 1295-row candidate visual count is auxiliary.',
};
fs.writeFileSync(path.join(REPORT,'660_current_closure_snapshot_r44_v3_closed.json'),`${JSON.stringify(output,null,2)}\n`);
console.log(JSON.stringify({status:output.status,r44Rows:output.r44Batch.rows,v3Pass:output.r44Batch.v3Pass,targetRows,currentTargetScopedVisuals:currentTargetVisuals,remainingTargetScopedVisuals:379-currentTargetVisuals,remainingFreshExpectedFacts:430-freshFactsThroughR44,candidateVisualCount:bank.totalDeclaredCandidateVisualCount},null,2));
