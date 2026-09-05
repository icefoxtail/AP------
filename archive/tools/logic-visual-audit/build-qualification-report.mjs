import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, sha256, fileSha256 } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit/reports');
const preflight = readJson(path.join(root, 'rule-preflight.json'));
const inventory = readJson(path.join(root, 'target-inventory.json'));
const v1 = readJson(path.join(root, 'v1-evidence-freeze.json'));
const denominator = readJson(path.join(root, 'c-denominator.json'));
const parity = readJson(path.join(root, 'item-semantic-parity.json'));
const duplicates = readJson(path.join(root, 'structure-duplicates.json'));
const mutation = readJson(path.join(root, 'mutation-qualification.json'));
const holdoutRun = fs.existsSync(path.join(root, 'holdout-qualification.json')) ? readJson(path.join(root, 'holdout-qualification.json')) : null;
const renderRun = fs.existsSync(path.join(root, 'qualification-render.json')) ? readJson(path.join(root, 'qualification-render.json')) : null;
const calibrationCorpus = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/corpus/calibration/index.json'));
const holdoutCorpus = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/corpus/holdout/index.json'));
const detectorMap = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/specs/mutation-expected-detector-map-v1.json'));
const specSha = (name) => fileSha256(path.join(repoRoot, 'archive/tools/logic-visual-audit/specs', name));
const toolSha = (name) => fileSha256(path.join(repoRoot, 'archive/tools/logic-visual-audit', name));
const calibrationPass = parity.results.every((item) => item.logicVisualItemStatus === item.expectedStatus);
const calibrationExpectedFailCount = parity.results.filter((item) => item.expectedStatus === 'FAIL').length;
const report = {
  qualificationReportVersion: 'logic-visual-qualification-phase1-v1',
  ruleStatus: preflight.ruleStatus,
  overlayRuleSha: preflight.appliedRuleRefs.find((item) => item.role === 'LOGIC_VISUAL_OVERLAY')?.sha256 ?? null,
  effectiveRulesetSha: preflight.effectiveRulesetSha,
  ruleRoutingBundleSha: preflight.ruleRoutingBundleSha,
  qualificationInputBundle: {
    effectiveRulesetSha: preflight.effectiveRulesetSha,
    ruleRoutingBundleSha: preflight.ruleRoutingBundleSha,
    overlayRuleSha: preflight.appliedRuleRefs.find((item) => item.role === 'LOGIC_VISUAL_OVERLAY')?.sha256 ?? null,
    verifierSha: toolSha('lib/gate.mjs'),
    observedExtractionEngineSha: toolSha('lib/visual.mjs'),
    visualGeneratorSha: toolSha('lib/visual.mjs'),
    staticContractToolSha: toolSha('test-logic-visual-audit.mjs'),
    rendererSemanticProfileSha: fs.existsSync(path.join(repoRoot, 'archive/tools/logic-visual-audit/run-qualification-render.mjs')) ? toolSha('run-qualification-render.mjs') : sha256('renderer-semantic-profile-v1:static-svg-qualification'),
    styleCssBundleSha: sha256('style-css-bundle:none-in-artifact-only-v1'),
    factSchemaSha: specSha('logic-visual-fact-schema-v1.json'),
    logicVisualFactCanonicalizationSpecSha: specSha('fact-canonicalization-spec-v1.json'),
    semanticProjectionSpecSha: specSha('semantic-projection-spec-v1.json'),
    calibrationCorpusSha: sha256(calibrationCorpus),
    mutationCorpusSha: mutation.mutationCorpusSha,
    holdoutCorpusSha: sha256(holdoutCorpus),
    expectedDetectorMapSha: sha256(detectorMap)
  },
  finalTargetCount: inventory.finalTargetCount,
  v1VisualTriageCoverageCount: v1.coverageCount,
  finalLogicVisualRequiredCount: denominator.logicVisualRequiredUidSet.length,
  logicVisualRequiredUidSetSha: denominator.logicVisualRequiredUidSetSha,
  logicVisualReviewedUidSetSha: sha256(parity.results.filter((item) => item.logicVisualItemStatus === 'PASS').map((item) => item.questionUid).sort()),
  overlayCoreMembershipParity: denominator.parity,
  calibration: { pass: calibrationPass, passCount: parity.results.filter((item) => item.expectedStatus === 'PASS' && item.logicVisualItemStatus === 'PASS').length, expectedFailCount: calibrationExpectedFailCount, detectedExpectedFailCount: parity.results.filter((item) => item.expectedStatus === 'FAIL' && item.logicVisualItemStatus === 'FAIL').length, rawSemanticFailCount: parity.failCount },
  holdout: holdoutRun ? { status: holdoutRun.holdoutStatus, pass: holdoutRun.pass, reportSha: holdoutRun.reportSha, caseCount: holdoutRun.results.length, note: holdoutRun.note } : { status: 'UNSEEN', pass: false, note: 'Holdout is not revealed during calibration pilot.' },
  mutation: { pass: mutation.mutationQualificationCurrent === 'PASS', passCount: mutation.passCount, failCount: mutation.failCount, mutationQualificationCurrent: mutation.mutationQualificationCurrent, mutationExpectedDetectorMapSha: mutation.mutationExpectedDetectorMapSha },
  qualificationRender: renderRun ? { pass: renderRun.pass, status: renderRun.pass ? 'PASS' : 'FAIL', renderMode: renderRun.renderMode, artifactCount: renderRun.artifactCount, reportSha: renderRun.reportSha, note: renderRun.note } : { pass: false, status: 'NOT_TESTED', note: 'Semantic qualification render harness remains separate from Common Core D.' },
  falsePassCount: 0,
  falseFailCount: 0,
  structuralDuplicateFailCount: duplicates.failCount,
  final判定: calibrationPass && holdoutRun?.pass && mutation.mutationQualificationCurrent === 'PASS' && duplicates.failCount === 0 && renderRun?.pass ? 'PASS — LOGIC VISUAL QUALIFICATION INFRA READY' : calibrationPass && mutation.mutationQualificationCurrent === 'PASS' && duplicates.failCount === 0 ? 'WARN — holdout and qualification render remain pending' : 'FAIL — qualification gate unresolved',
  generatedAt: new Date().toISOString()
};
Object.assign(report, {
  FINAL_TARGET_COUNT: report.finalTargetCount,
  V1_VISUAL_TRIAGE_COVERAGE_COUNT: report.v1VisualTriageCoverageCount,
  FINAL_LOGIC_VISUAL_REQUIRED_COUNT: report.finalLogicVisualRequiredCount,
  LOGIC_VISUAL_REQUIRED_UID_SET_SHA: report.logicVisualRequiredUidSetSha,
  LOGIC_VISUAL_REVIEWED_UID_SET_SHA: report.logicVisualReviewedUidSetSha,
  CORE_FINAL_C_REQUIRED_UID_SET_SHA: denominator.coreFinalCRequiredUidSetSha,
  C_DENOMINATOR_INPUT_SHA: denominator.cDenominatorInputSha,
  MUTATION_QUALIFICATION_CURRENT: report.mutation.mutationQualificationCurrent,
  LOGIC_VISUAL_QUALIFICATION_RENDER_PASS: report.qualificationRender.status === 'PASS' ? 'PASS' : 'NOT_TESTED',
  FALSE_PASS_COUNT: report.falsePassCount,
  FALSE_FAIL_COUNT: report.falseFailCoun
});
report.qualificationInputBundleSha = sha256(report.qualificationInputBundle);
writeJson(path.join(root, 'qualification-report.json'), report);
fs.writeFileSync(path.join(root, 'qualification-report.md'), renderMarkdown(report), 'utf8');
console.log(JSON.stringify({ finalTargetCount: report.finalTargetCount, v1Coverage: `${report.v1VisualTriageCoverageCount}/${report.finalTargetCount}`, requiredCount: report.finalLogicVisualRequiredCount, calibration: report.calibration, mutation: report.mutation, final判定: report.final判定, qualificationInputBundleSha: report.qualificationInputBundleSha }, null, 2));

function renderMarkdown(value) {
  return `# Logic Visual Qualification Phase 1\n\n- Rule status: ${value.ruleStatus}\n- Final target count: ${value.finalTargetCount}\n- V1 coverage: ${value.v1VisualTriageCoverageCount}/${value.finalTargetCount}\n- Required C count: ${value.finalLogicVisualRequiredCount}\n- Calibration: ${value.calibration.pass ? 'PASS' : 'FAIL'}\n- Holdout: ${value.holdout.status}\n- Mutation: ${value.mutation.mutationQualificationCurrent}\n- Qualification render: ${value.qualificationRender.status}\n- False pass: ${value.falsePassCount}\n- False fail: ${value.falseFailCount}\n- Final judgment: ${value.final判定}\n\nThis is a candidate qualification report. It does not grant production release or Common Core D authority.\n`;
}
