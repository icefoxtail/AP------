import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const SOURCE_STATIC = JSON.parse(fs.readFileSync(path.join(REPORT, '742_current_source_solution_static_audit_r49.json'), 'utf8'));
const COVERAGE = JSON.parse(fs.readFileSync(path.join(REPORT, '743_full_scope_evidence_coverage_audit_r49.json'), 'utf8'));
const TARGET_VISUAL = JSON.parse(fs.readFileSync(path.join(REPORT, '740_target_scoped_visual_coverage_r49.json'), 'utf8'));
const CANDIDATE_VALIDATION = JSON.parse(fs.readFileSync(path.join(REPORT, '765_rebased_candidate_bank_validation_r60.json'), 'utf8'));
const VISUAL_MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '766_full_target_visual_manifest_r60_rebased.json'), 'utf8'));
const RENDER = JSON.parse(fs.readFileSync(path.join(REPORT, '763_full_target_local_render_review_r60.json'), 'utf8'));
const FREEZE = JSON.parse(fs.readFileSync(path.join(REPORT, '767_full_scope_solution_freeze_r60.json'), 'utf8'));
const PRIOR_CLOSURE = JSON.parse(fs.readFileSync(path.join(REPORT, '741_current_closure_snapshot_r49_v3_closed.json'), 'utf8'));
const BROWSER_SPOTCHECK = JSON.parse(fs.readFileSync(path.join(REPORT, '769_browser_spotcheck_r61.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '768_final_audit_r60.json');

const checks = [
  { id: 'DENOMINATOR_430', expected: 430, actual: COVERAGE.scope.targetRows, ok: COVERAGE.scope.targetRows === 430 },
  { id: 'SOURCE_STATIC_ISSUES_ZERO', expected: 0, actual: SOURCE_STATIC.counts?.issueRows, ok: SOURCE_STATIC.counts?.issueRows === 0 },
  { id: 'FULL_SCOPE_V1_430', expected: 430, actual: COVERAGE.available.v1SourceIdRows, ok: COVERAGE.available.v1SourceIdRows === 430 && COVERAGE.missing.v1SourceIdRows === 0 },
  { id: 'FULL_SCOPE_INDEPENDENT_430', expected: 430, actual: COVERAGE.available.independentMathRows, ok: COVERAGE.available.independentMathRows === 430 && COVERAGE.missing.independentMathRows === 0 },
  { id: 'TARGET_VISUAL_DECISION_COVERAGE_379', expected: 379, actual: TARGET_VISUAL.counts?.targetRowsWithTargetDecisionAndVisual, ok: TARGET_VISUAL.counts?.targetRowsWithTargetDecisionAndVisual === 379 && TARGET_VISUAL.counts?.targetRowsWithTargetDecisionWithoutVisual === 0 && TARGET_VISUAL.counts?.decisionMissing === 0 },
  { id: 'FULL_VISUAL_MANIFEST_379', expected: 379, actual: VISUAL_MANIFEST.targetVisualRows, ok: VISUAL_MANIFEST.targetVisualRows === 379 && VISUAL_MANIFEST.missingCaseIds === 0 },
  { id: 'CANDIDATE_SOURCE_PARITY', expected: 0, actual: CANDIDATE_VALIDATION.errors?.length, ok: CANDIDATE_VALIDATION.errors?.length === 0 && CANDIDATE_VALIDATION.solutionDriftFromCurrentSource === 0 },
  { id: 'SOLUTION_FREEZE_430', expected: 430, actual: FREEZE.frozenRows, ok: FREEZE.frozenRows === 430 && FREEZE.blockedRows === 0 && FREEZE.residualFailCount === 0 },
  { id: 'V3_PARITY_379', expected: 379, actual: FREEZE.gateSnapshot?.v3ParityPassRows, ok: FREEZE.gateSnapshot?.v3ParityPassRows === 379 && FREEZE.gateSnapshot?.v3ParityFailRows === 0 },
  { id: 'FULL_LOCAL_RENDER_379', expected: 379, actual: RENDER.rows.length, ok: RENDER.rows.length === 379 && RENDER.overflowLabelCount === 0 },
];

const passedLocalChecks = checks.filter((check) => check.ok).length;
const failedLocalChecks = checks.filter((check) => !check.ok);
const residualFailCount = (FREEZE.residualFailCount ?? 0) + failedLocalChecks.length;
const output = {
  schemaVersion: 'HS_QUADRATIC_FINAL_AUDIT_R60',
  status: failedLocalChecks.length === 0 ? 'FINAL_AUDIT_PRESEALED_NO_PROVIDER_PASS' : 'FINAL_AUDIT_BLOCKED_LOCAL_CHECK_FAILURE',
  productionAuthorized: false,
  sealed: false,
  finalPass: false,
  scope: {
    targetQuestionCount: 430,
    sourceFileCount: 59,
    targetVisualQuestionCount: 379,
    visualNeedMissingCount: TARGET_VISUAL.counts?.targetRowsWithTargetDecisionWithoutVisual ?? null,
    residualFailCount,
  },
  localChecks: {
    total: checks.length,
    passed: passedLocalChecks,
    failed: failedLocalChecks.length,
    rows: checks,
  },
  evidence: {
    sourceStatic: 'reports/hs-quadratic-svg-upgrade-20260908/742_current_source_solution_static_audit_r49.json',
    fullScopeCoverage: 'reports/hs-quadratic-svg-upgrade-20260908/743_full_scope_evidence_coverage_audit_r49.json',
    targetVisualCoverage: 'reports/hs-quadratic-svg-upgrade-20260908/740_target_scoped_visual_coverage_r49.json',
    candidateValidation: 'reports/hs-quadratic-svg-upgrade-20260908/765_rebased_candidate_bank_validation_r60.json',
    fullVisualManifest: 'reports/hs-quadratic-svg-upgrade-20260908/766_full_target_visual_manifest_r60_rebased.json',
    solutionFreeze: 'reports/hs-quadratic-svg-upgrade-20260908/767_full_scope_solution_freeze_r60.json',
    localRender: 'reports/hs-quadratic-svg-upgrade-20260908/763_full_target_local_render_review_r60.json',
    browserSpotcheck: 'reports/hs-quadratic-svg-upgrade-20260908/769_browser_spotcheck_r61.json',
  },
  externalGates: {
    providerAttestedFinalAudit: 'PENDING_PROVIDER_ATTESTATION',
    actualBrowserDesktopMobileCapture: 'SPOTCHECK_ONLY_FULL_SCOPE_NOT_ATTESTED',
    browserSpotcheckRows: BROWSER_SPOTCHECK.rows.length,
    questionUidV2SourceExamRegistry: 'PENDING_EXPLICIT_REGISTRY_AUTHORITY',
    registryIdentityMismatchCount: PRIOR_CLOSURE.registry?.identityMismatchCount ?? null,
    dbQuestionIndexPromotion: 'NOT_AUTHORIZED_IN_CANDIDATE_ONLY_BRANCH',
  },
  openActions: [
    'Run the configured provider-attested FINAL_AUDIT in the approved pipeline-core runtime.',
    'Run full-scope browser desktop/mobile capture; current browser evidence is a two-row high-risk spot-check only.',
    'Bind the 15 identity-mismatch entries to the approved QUESTION_UID_v2 source-exam registry; do not invent mappings from titles.',
    'After provider audit and authority review, independently decide whether DB/question-index/production promotion is authorized.',
  ],
  note: 'All local candidate-only correctness, visual-decision, V1/independent, V3, freeze, and local render checks are recorded. This report intentionally does not convert local evidence into final PASS or SEALED.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, sealed: output.sealed, finalPass: output.finalPass, targetQuestionCount: output.scope.targetQuestionCount, targetVisualQuestionCount: output.scope.targetVisualQuestionCount, visualNeedMissingCount: output.scope.visualNeedMissingCount, residualFailCount: output.scope.residualFailCount, localChecks: `${passedLocalChecks}/${checks.length}` }, null, 2));
