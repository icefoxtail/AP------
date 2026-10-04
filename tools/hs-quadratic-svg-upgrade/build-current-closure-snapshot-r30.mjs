import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const read = (name) => JSON.parse(fs.readFileSync(path.join(REPORT, name), 'utf8'));
const v1 = read('410_specialist_v1_expected_facts_r30.json');
const independent = read('416_independent_recheck_specialist_r30.json');
const staticVisual = read('413_specialist_candidate_visual_static_check_r30.json');
const bank = read('412_specialist_candidate_bank_manifest_r30.json');
const bankValidation = read('415_specialist_candidate_bank_validation_r30.json');
const v2 = read('414_specialist_v2_artifact_only_r30.json');
const v3 = read('417_specialist_v3_parity_r30.json');
const freeze = read('418_specialist_solution_freeze_ledger_r30.json');
const render = read('421_specialist_local_render_review_r30.json');
const prep = read('422_current_v2_preparation_r30d.json');
const machine = read('423_machine_evidence_r30d.json');
const machineValidation = read('424_machine_evidence_validation_r30d.json');
const output = {
  schemaVersion: 'HS_QUADRATIC_CURRENT_CLOSURE_SNAPSHOT_R30_V3_CLOSED',
  status: 'R30_SPECIALIST_BATCH_V3_CLOSED_FULL_SCOPE_REMAINS_OPEN_NO_FINAL_PASS',
  productionAuthorized: false,
  branch: 'codex/hs-quadratic-svg-upgrade',
  mainBaseline: 'origin/main@c010c3ba9f8945b2d6f9b9440543f669efb1cc22',
  scope: { targetQuestionCount: 430, sourceFileCount: 59, examFileCount: 59 },
  sourceSolutionStatus: { sourceStaticIssueRows: 0, candidateStaticIssueRows: 0, sourceSolutionIndependentRecheckRows: 11, sourceCandidateParityErrors: 0, evidence: 'reports/hs-quadratic-svg-upgrade-20260908/365_current_closure_snapshot_r26_source_solution_repaired.json' },
  visualDecisionDenominator: { NO_VISUAL: 51, KEEP_EXISTING: 0, REBUILD_EXISTING: 2, ADD_NEW_VISUAL: 377, candidateVisualTarget: 379 },
  r30Batch: {
    rows: v1.rows.length,
    numberLineRows: v1.rows.filter((row) => row.expectedVisualType === 'number-line').length,
    cartesianRows: v1.rows.filter((row) => row.expectedVisualType === 'cartesian').length,
    v1ExpectedFacts: `${v1.rows.length}/${v1.rows.length}`,
    independentRecheck: `${independent.checkedRows}/${independent.checkedRows}`,
    solutionFreeze: `${freeze.frozenRows}/${v1.rows.length} candidate rows`,
    candidateStatic: `${staticVisual.rows.filter((row) => row.status === 'STATIC_CHECKED').length}/${staticVisual.rows.length}`,
    v2ArtifactOnly: `${v2.rows.length}/${v1.rows.length}`,
    v3Pass: `${v3.passCount}/${v3.rows.length}`,
    v3Fail: v3.failCount,
    localRender: `${render.rows.filter((row) => row.status === 'LOCAL_RENDER_REVIEWED').length}/${render.rows.length}`,
    localRenderOverflow: render.overflowLabelCount,
    evidence: { v1: 'reports/hs-quadratic-svg-upgrade-20260908/410_specialist_v1_expected_facts_r30.json', independentRecheck: 'reports/hs-quadratic-svg-upgrade-20260908/416_independent_recheck_specialist_r30.json', visualManifest: 'reports/hs-quadratic-svg-upgrade-20260908/411_specialist_candidate_visual_manifest_r30.json', static: 'reports/hs-quadratic-svg-upgrade-20260908/413_specialist_candidate_visual_static_check_r30.json', candidateBank: 'reports/hs-quadratic-svg-upgrade-20260908/412_specialist_candidate_bank_manifest_r30.json', bankValidation: 'reports/hs-quadratic-svg-upgrade-20260908/415_specialist_candidate_bank_validation_r30.json', v2: 'reports/hs-quadratic-svg-upgrade-20260908/414_specialist_v2_artifact_only_r30.json', v3: 'reports/hs-quadratic-svg-upgrade-20260908/417_specialist_v3_parity_r30.json', solutionFreeze: 'reports/hs-quadratic-svg-upgrade-20260908/418_specialist_solution_freeze_ledger_r30.json', render: 'reports/hs-quadratic-svg-upgrade-20260908/421_specialist_local_render_review_r30.json' },
  },
  candidateVisualProgress: { priorUniqueCandidateVisuals: 275, r30BatchRows: 8, r30SupersededPriorCandidateRows: 0, currentUniqueCandidateVisuals: bank.totalDeclaredCandidateVisualCount, remainingCandidateVisuals: 379 - bank.totalDeclaredCandidateVisualCount, freshExpectedFactRowsThroughR30: 278, remainingFreshExpectedFactsUnderCurrentCounting: 430 - 278 },
  currentV2Preparation: { workBatchId: prep.workBatchId, runCount: prep.runCount, preparedQuestionCount: prep.preparedQuestionCount, errors: prep.errors.length, machineEvidenceCount: machine.evidenceCount, machineEvidenceValidationErrors: machineValidation.errors.length, preparation: 'reports/hs-quadratic-svg-upgrade-20260908/422_current_v2_preparation_r30d.json', machineEvidence: 'reports/hs-quadratic-svg-upgrade-20260908/423_machine_evidence_r30d.json', machineEvidenceValidation: 'reports/hs-quadratic-svg-upgrade-20260908/424_machine_evidence_validation_r30d.json', wholeJobFreeze: 'NOT_ATTEMPTED_MISSING_PROVIDER_RENDER_CAPTURE' },
  registry: { candidateEntries: 430, identityMismatchCount: 15, authorityStatus: 'PENDING_EXPLICIT_REGISTRY_AUTHORITY', evidence: 'reports/hs-quadratic-svg-upgrade-20260908/61_source_exam_id_registry_candidate_r10.json' },
  remainingGates: ['fresh independent math A1/A2 and solution freeze for full 430 rows', 'fresh V1 expected facts for remaining 152 rows under current counting', 'artifact-only V2 and semantic V3 for remaining 96 candidate visual rows', 'provider-attested FINAL_AUDIT', 'actual current desktop/mobile render capture and independent render-review for the full required scope', 'source registry identity authority for 15 mismatched exam titles', 'DB/question-index/production promotion authority'],
  note: 'R30 closes 5 function/cartesian rows and 3 inequality number-line rows. Its candidate batch is closed at row level, but full-scope PASS, SEALED, provider-attested FINAL_AUDIT, and production promotion remain forbidden until every gate is current and independently evidenced.',
};
fs.writeFileSync(path.join(REPORT, '425_current_closure_snapshot_r30_v3_closed.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.scope.targetQuestionCount, r30Rows: output.r30Batch.rows, v3Pass: output.r30Batch.v3Pass, currentUniqueCandidateVisuals: output.candidateVisualProgress.currentUniqueCandidateVisuals, remainingCandidateVisuals: output.candidateVisualProgress.remainingCandidateVisuals, remainingFreshExpectedFacts: output.candidateVisualProgress.remainingFreshExpectedFactsUnderCurrentCounting }, null, 2));
