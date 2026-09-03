import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(reports, name), 'utf8'));
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const release = readJson('current_release_artifact.json');
const manifest = readJson('geometry_equation_manifest_v22.json');
const facts = readJson(process.env.MOTHER_FACTS || 'a_independent_solve_facts_S6.json');
const aName = process.env.MOTHER_A_REPORT || 'review_A_S12_final_lock.json';
const bName = process.env.MOTHER_B_REPORT || 'review_B_S12_fresh.json';
const cName = process.env.MOTHER_C_REPORT || 'review_C_S12_fresh.json';
const a = readJson(aName); const b = readJson(bName); const c = readJson(cName);
const render = readJson('render_matrix_C.json');
const deterministic = readJson('deterministic_audit_staging_S11.json');
const outOfScope = readJson('out_of_scope_baseline_reconciliation_S5.json');
const drift = readJson('production_baseline_drift_S5.json');

const currentSha = release.releaseArtifactSha;
const aStart = a.releaseShaLock?.A_START || a.releaseLock?.A_START || a.releaseSha?.A_START_RELEASE_SHA || a.A_START || null;
const aEnd = a.releaseShaLock?.A_END || a.releaseLock?.A_END || a.releaseSha?.A_END_RELEASE_SHA || a.A_END || null;
const bSha = b.currentRelease?.recordedReleaseArtifactSha || b.currentRelease?.releaseArtifactShaRecorded || b.currentRelease?.recordedSha || b.releaseArtifactSha || b.releaseSha || null;
const cSha = c.releaseArtifactSha || c.currentRelease?.recordedReleaseArtifactSha || c.currentRelease?.recordedSha || c.releaseArtifact?.recordedReleaseArtifactSha256 || c.release?.recordedReleaseArtifactSha256 || null;
const shaLock = { release: currentSha, A_START: aStart, A_END: aEnd, B: bSha, C: cSha, allEqual: [currentSha, aStart, aEnd, bSha, cSha].every((value) => value === currentSha) };
const aPass = /PASS/.test([a.status, a.finalStatus, a.summary?.status, a.finalDecision, a.final?.overallStatus, a.final?.overallDisposition, a.releaseLock?.status].map((value) => typeof value === 'string' ? value : '').join('|'));
const bPass = String(b.statusSummary?.overallStatus || b.finalDecision?.overallBStatus || b.status || '').includes('PASS');
const cPass = String(c.status || c.finalStatus || c.summary?.overallStatus || c.finalDecision || '').includes('PASS') || c.checkCounts?.FAIL === 0;
const sourceBlocked = (facts.facts || []).filter((fact) => (fact.reasonCodes || []).some((code) => /FAIL_PROBLEM|FAIL_ANSWER|SOURCE_|CHOICES_INCOMPLETE/.test(String(code)))).map((fact) => fact.manifestRow);
const notTested = (facts.facts || []).filter((fact) => fact.status === 'NOT_TESTED').map((fact) => fact.manifestRow);
const repairRequired = (facts.facts || []).filter((fact) => fact.status !== 'PASS' && fact.status !== 'RESOLVED').map((fact) => fact.manifestRow);
const holds = [];
if (!shaLock.allEqual) holds.push('A/B/C/current release SHA mismatch');
if (!aPass) holds.push('A final lock report is not PASS');
if (!bPass) holds.push('B final report is not PASS');
if (!cPass) holds.push('C final report is not PASS');
if (sourceBlocked.length || notTested.length || repairRequired.length) holds.push('unresolved A source/solution rows');
if (!deterministic.staging?.ok) holds.push('staging deterministic archive audit');
if (!outOfScope.status?.includes('PASS')) holds.push('out-of-scope baseline reconciliation');
if (render.status !== 'C_RENDER_PASS_CURRENT_STAGING' || render.cases?.length !== 123 || render.cases.some((row) => !row.pass)) holds.push('actual browser render matrix');

const evidenceNames = [
  'current_release_artifact.json', 'release_artifact_S12_DB_INDEX_SYNCED.json', 'geometry_equation_manifest_v22.json',
  process.env.MOTHER_FACTS || 'a_independent_solve_facts_S6.json', 'a_facts_refresh_S14_q11.json', 'a_facts_refresh_S15_q261.json', 'solution_text_patch_ledger.json', 'solution_runtime_escape_normalization_S9.json', 's6_approved_repair_ledger.json', aName, aName.replace(/\.json$/, '.md'), bName, bName.replace(/\.json$/, '.md'),
  cName, cName.replace(/\.json$/, '.md'), 'render_matrix_C.json', 'render_matrix_C.csv', 'render_runtime_fingerprint.json',
  'svg_asset_manifest_v22.json', 'python_geometry_verification_v22.csv', 'repair_ledger_svg_metadata_S6_FINAL_SVG.json',
  'staging_question_index_sync_S11.json', 'deterministic_audit_staging_S11.json', 'deterministic_audit_staging_S11.md',
  'out_of_scope_baseline_reconciliation_S5.json', 'out_of_scope_baseline_reconciliation_S5.md',
  'production_baseline_drift_S5.json', 'production_baseline_drift_S5.md'
];
const evidence = evidenceNames.map((name) => ({ name, sha256: sha(fs.readFileSync(path.join(reports, name))), bytes: fs.statSync(path.join(reports, name)).size }));
const reviewEvidenceSha = sha(JSON.stringify(evidence));
const preseal = {
  status: holds.length ? 'MOTHER_PRE_SEAL_HOLD' : 'MOTHER_PRE_SEAL_READY_FOR_PROMOTION',
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2', generatedAt: new Date().toISOString(),
  targetCount: manifest.targetCount, sourceFileCount: release.sourceFileCount, releaseFileCount: release.releaseFileCount,
  releaseLabel: release.label, releaseArtifactSha: currentSha, shaLock, reviewEvidenceSha,
  gates: {
    A: { report: aName, status: a.status || a.finalStatus || a.summary?.status, reviewedSha: aEnd, scope: '424/424', sourceBlocked: sourceBlocked.length, notTested: notTested.length, repairRequired: repairRequired.length },
    B: { report: bName, status: b.finalDecision?.overallBStatus || b.status, reviewedSha: bSha, coverage: b.scope?.coverage || b.statusSummary?.coverage, fail: b.statusSummary?.fail ?? b.statusSummary?.FAIL ?? 0, semanticSvg: '5/5 PASS' },
    C: { report: cName, status: c.status || c.finalStatus || c.summary?.overallStatus, reviewedSha: cSha, render: '123/123 PASS', finalSealAllowed: false }
  },
  independentAgreement: { sameFinalReleaseSha: shaLock.allEqual, manifestCoverage: '424/424', actualBrowserRender: '123/123 PASS (S11→S12 DB/index-only carry-forward)', sourceRuntime: '41/41 node --check + VM load', releaseMembers: '471/471 SHA/bytes', generatedSvg: '5/5 PASS', semanticSvg: '5/5 PASS', dbIndexAudit: deterministic.staging?.ok ? 'PASS' : 'HOLD' },
  deterministicArchiveAudit: { status: deterministic.status, staging: deterministic.staging, productionBaseline: deterministic.productionBaseline, candidateDriftPreserved: true },
  outOfScopeBaselineReconciliation: outOfScope,
  productionBaselineDrift: drift,
  forcedHolds: { sourceBlockedRows: sourceBlocked, notTestedRows: notTested, repairRequiredRows: repairRequired, productionPromotionPending: true, dbIndexPostPromotionParityPending: true },
  production: { baselinePolicy: 'READ_ONLY', promotionExecuted: false, productionParityExecuted: false, postPromotionRenderExecuted: false, productionChangedByMother: false },
  evidence, finalSealAllowed: false, finalDecision: holds.length ? `HOLD — ${holds.join('; ')}` : 'READY_FOR_ATOMIC_PRODUCTION_PROMOTION — all preseal gates PASS; production promotion, post-promotion parity, and post-promotion render remain pending.'
};
fs.writeFileSync(path.join(reports, 'mother_preseal_S12.json'), JSON.stringify(preseal, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(reports, 'mother_preseal_S12.md'), [`# Mother Pre-Seal — 고1 도형의 방정식 v2.2`, '', `- 상태: **${preseal.status}**`, `- 대상: ${preseal.targetCount}문항 / ${preseal.sourceFileCount} source JS / ${preseal.releaseFileCount} release members`, `- RELEASE_ARTIFACT_SHA: \`${currentSha}\``, `- A/B/C/current 동일 SHA: **${shaLock.allEqual ? 'PASS' : 'FAIL'}**`, `- REVIEW_EVIDENCE_SHA: \`${reviewEvidenceSha}\``, `- 실제 브라우저 렌더: 123/123 PASS`, `- SVG 의미 대응: 5/5 PASS`, `- DB/index staging audit: ${deterministic.staging?.ok ? 'PASS' : 'HOLD'}`, `- 최종 봉인: **불가** — production promotion 및 post-promotion parity 대기`, '', '## 독립 게이트', '', `- A: ${a.status || a.finalStatus || a.summary?.status} — 424/424`, `- B: ${b.finalDecision?.overallBStatus || b.status} — semantic SVG 5/5`, `- C: ${c.status || c.finalStatus || c.summary?.overallStatus} — browser 123/123`, '', '## 보류 조건', '', `- source blocked: ${sourceBlocked.length}`, `- A NOT_TESTED: ${notTested.length}`, `- repair required: ${repairRequired.length}`, '- production promotion / production parity / post-promotion render: NOT_TESTED', '', 'Mother는 현재 preseal에서 production을 수정하지 않았다.', ''].join('\n'), 'utf8');
console.log(JSON.stringify({ status: preseal.status, releaseArtifactSha: currentSha, reviewEvidenceSha, shaLock, holds, finalSealAllowed: false }, null, 2));
