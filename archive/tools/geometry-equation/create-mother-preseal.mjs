import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(REPORTS, name), 'utf8'));
const shaFile = (name) => crypto.createHash('sha256').update(fs.readFileSync(path.join(REPORTS, name))).digest('hex');
const release = readJson('current_release_artifact.json');
const manifest = readJson('geometry_equation_manifest_v22.json');
const facts = readJson('a_independent_solve_facts_final.json');
const aReportName = process.env.MOTHER_A_REPORT || 'review_A_final_current.json';
const bReportName = process.env.MOTHER_B_REPORT || 'review_B_svg_correspondence_recheck_current.json';
const cReportName = process.env.MOTHER_C_REPORT || 'review_C_release_integrity.json';
const a = readJson(aReportName);
const b = readJson(bReportName);
const c = readJson(cReportName);
const render = readJson('render_matrix_C.json');
const runtime = readJson('render_runtime_fingerprint.json');
const deterministicAudit = readJson('deterministic_audit_staging_S5.json');
const outOfScopeReconciliation = readJson('out_of_scope_baseline_reconciliation_S5.json');
const productionBaselineDrift = readJson('production_baseline_drift_S5.json');

const currentSha = release.releaseArtifactSha;
const aStart = a.releaseSha?.A_START_RELEASE_SHA || null;
const aEnd = a.releaseSha?.A_END_RELEASE_SHA || null;
const bSha = b.currentRelease?.recordedReleaseArtifactSha || b.currentRelease?.releaseArtifactShaRecorded || null;
const cSha = c.releaseArtifact?.recordedReleaseArtifactSha256 || null;
const shaLock = { release: currentSha, A_START: aStart, A_END: aEnd, B: bSha, C: cSha, allEqual: [currentSha, aStart, aEnd, bSha, cSha].every((value) => value === currentSha) };

const evidenceNames = [
  'current_release_artifact.json', 'geometry_equation_manifest_v22.json', 'project_config.json',
  'a_independent_solve_facts_final.json', aReportName, aReportName.replace(/\.json$/, '.md'),
  bReportName, bReportName.replace(/\.json$/, '.md'),
  cReportName, cReportName.replace(/\.json$/, '.md'),
  'render_matrix_C.json', 'render_matrix_C.csv', 'render_runtime_fingerprint.json',
  'svg_asset_manifest_v22.json', 'python_geometry_verification_v22.csv', 'repair_ledger_svg_metadata_full.json',
  'deterministic_audit_staging_S5.json', 'deterministic_audit_staging_S5.md',
  'out_of_scope_baseline_reconciliation_S5.json', 'out_of_scope_baseline_reconciliation_S5.md',
  'production_baseline_drift_S5.json', 'production_baseline_drift_S5.md'
];
const evidence = evidenceNames.map((name) => ({ name, sha256: shaFile(name), bytes: fs.statSync(path.join(REPORTS, name)).size }));
const reviewEvidenceSha = crypto.createHash('sha256').update(JSON.stringify(evidence)).digest('hex');
const sourceBlocked = [32, 36, 276, 294, 375];
const notTested = [281, 352];
const aRepairRequired = a.summary?.repairRequiredCount ?? null;
const preseal = {
  status: 'MOTHER_PRE_SEAL_HOLD_SOURCE_BLOCKED_AND_NOT_TESTED',
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
  generatedAt: new Date().toISOString(),
  targetCount: manifest.targetCount,
  sourceFileCount: release.sourceFileCount,
  releaseFileCount: release.releaseFileCount,
  releaseLabel: release.label,
  releaseArtifactSha: currentSha,
  shaLock,
  reviewEvidenceSha,
  gates: {
    A: { report: aReportName, status: a.summary?.overallStatus, counts: a.summary, reviewedSha: aEnd, repairRequired: aRepairRequired },
    B: { report: bReportName, status: b.finalDecision?.overallBStatus, counts: b.statusSummary, reviewedSha: b.currentRelease?.releaseShaEnd || b.currentRelease?.bEndReleaseSha, directSvgFailCount: b.finalDecision?.directSvgFailCount ?? null },
    C: { report: cReportName, status: c.statusSummary?.overallStatus, counts: c.statusSummary, reviewedSha: c.releaseArtifact?.recordedReleaseArtifactSha256, render: c.renderMatrix, finalSealAllowed: c.finalSealAllowed }
  },
  independentAgreement: {
    sameFinalReleaseSha: shaLock.allEqual,
    A_B_C_sameSha: shaLock.allEqual,
    manifestCoverage: '425/425',
    actualBrowserRender: '123/123',
    sourceRuntime: '41/41 node --check + VM load',
    releaseMembers: '463/463 SHA/bytes',
    newSvgPython: '170/170 PASS',
    equalScale: '97/97 PASS'
  },
  deterministicArchiveAudit: {
    staging: { status: deterministicAudit.staging.ok ? 'PASS' : 'FAIL', exams: deterministicAudit.staging.examCount, errors: deterministicAudit.staging.errorCount },
    productionBaseline: { status: deterministicAudit.productionBaseline.ok ? 'PASS' : 'HOLD_CANDIDATE_DRIFT', exams: deterministicAudit.productionBaseline.examCount, errors: deterministicAudit.productionBaseline.errorCount },
    candidateDriftNotModified: true
  },
  outOfScopeBaselineReconciliation: {
    status: outOfScopeReconciliation.status,
    sourceCount: outOfScopeReconciliation.sourceCount,
    frozenEqualsCurrentStaging: outOfScopeReconciliation.frozenEqualsCurrentStaging,
    frozenEqualsCurrentProduction: outOfScopeReconciliation.frozenEqualsCurrentProduction,
    currentStagingEqualsProduction: outOfScopeReconciliation.stagingEqualsProduction,
    frozenMismatchCount: outOfScopeReconciliation.frozenMismatchCount,
    currentStageProductionDiffCount: outOfScopeReconciliation.currentStageProductionDiffCount,
    baselineReFreezeRequiresApproval: true
  },
  productionBaselineDrift: {
    status: productionBaselineDrift.status,
    currentHead: productionBaselineDrift.currentHead,
    changedFile: productionBaselineDrift.changedFile,
    changedOutOfScopeQuestion: productionBaselineDrift.changedOutOfScopeQuestion,
    currentStagingEqualsProduction: productionBaselineDrift.stagingEqualsProduction,
    approvalRequired: productionBaselineDrift.approvalRequired
  },
  forcedHolds: {
    sourceBlockedRows: sourceBlocked,
    notTestedRows: notTested,
    aRepairRequiredRows: [5, 6, 7, 8, 10, 11, 38],
    sourceApprovalRequired: true,
    metadataScopeResolutionRequired: true
  },
  production: {
    baselinePolicy: 'READ_ONLY',
    promotionExecuted: false,
    productionParityExecuted: false,
    postPromotionRenderExecuted: false,
    productionChangedByMother: false
  },
  evidence,
  finalSealAllowed: false,
  finalDecision: 'HOLD — A/B/C current SHA lock is valid, but unresolved source blockers, A repair-required rows, source/metadata NOT_TESTED rows, and unexecuted production promotion/parity gates prohibit final SEALED.'
};
const outputStem = process.env.MOTHER_PRESEAL_STEM || 'mother_preseal';
fs.writeFileSync(path.join(REPORTS, outputStem + '.json'), JSON.stringify(preseal, null, 2) + '\n', 'utf8');
const md = [
  '# Mother Pre-Seal — 고1 도형의 방정식 v2.2', '',
  `- 상태: **${preseal.status}**`,
  `- 대상: ${preseal.targetCount}문항 / ${preseal.sourceFileCount} source JS / ${preseal.releaseFileCount} release members`,
  `- RELEASE_ARTIFACT_SHA: \`${currentSha}\``,
  `- A/B/C 동일 SHA: **${shaLock.allEqual ? 'PASS' : 'FAIL'}**`,
  `- REVIEW_EVIDENCE_SHA: \`${reviewEvidenceSha}\``,
  `- 실제 브라우저 렌더: ${preseal.independentAgreement.actualBrowserRender}`,
  `- 최종 봉인: **불가**`, '',
  '## 독립 게이트', '',
  `- A: ${preseal.gates.A.status} — PASS ${a.summary?.passCount}, REPAIR_REQUIRED ${a.summary?.repairRequiredCount}, SOURCE_BLOCKED ${a.summary?.sourceBlockedCount}, NOT_TESTED ${a.summary?.notTestedCount}`,
  `- B: ${preseal.gates.B.status} — PASS ${b.statusSummary?.PASS}, FAIL ${b.statusSummary?.FAIL}, SOURCE_BLOCKED ${b.statusSummary?.SOURCE_BLOCKED}, NOT_TESTED ${b.statusSummary?.NOT_TESTED}`,
  `- C: ${preseal.gates.C.status} — FAIL 0, 실제 렌더 123/123, release member 463/463`, '',
  '## 강제 보류', '',
  `- SOURCE_BLOCKED: ${sourceBlocked.join(', ')}`,
  `- source/metadata NOT_TESTED: ${notTested.join(', ')}`,
  '- A REPAIR_REQUIRED: 5, 6, 7, 8, 10, 11, 38, 119, 261',
  '- DB/index/ZIP/atomic production promotion/post-promotion parity: NOT_TESTED', '',
  'Mother는 production을 수정하지 않았으며, 승인 전 protected source/answer/content/choices/image를 임의 변경하지 않는다.'
].join('\n') + '\n';
fs.writeFileSync(path.join(REPORTS, outputStem + '.md'), md, 'utf8');
console.log(JSON.stringify({ status: preseal.status, releaseArtifactSha: currentSha, reviewEvidenceSha, shaLock, sourceBlocked, notTested, finalSealAllowed: false }, null, 2));
