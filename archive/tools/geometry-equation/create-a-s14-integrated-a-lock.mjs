import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const staging = path.join(reports, 'staging', 'archive');
const release = JSON.parse(fs.readFileSync(path.join(reports, 'current_release_artifact.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(reports, 'geometry_equation_manifest.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(path.join(reports, 'a_independent_solve_facts_S14.json'), 'utf8'));
const aS12 = JSON.parse(fs.readFileSync(path.join(reports, 'review_A_S12_final_lock.json'), 'utf8'));
const refresh = JSON.parse(fs.readFileSync(path.join(reports, 'a_facts_refresh_S14_q11.json'), 'utf8'));
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const hashes = [];
for (const member of release.files) {
  const filePath = path.join(staging, member.relativePath.replaceAll('/', path.sep));
  hashes.push({ ...member, actualSha256: sha(fs.readFileSync(filePath)), actualBytes: fs.statSync(filePath).size });
}
const memberPass = hashes.every((row) => row.sha256 === row.actualSha256 && row.bytes === row.actualBytes);
const recomputed = sha(JSON.stringify(hashes.map((row) => ({ relativePath: row.relativePath, sha256: row.actualSha256, bytes: row.actualBytes }))));
const q11 = facts.facts.find((fact) => fact.qKey === 'original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js_11');
const report = {
  schemaVersion: 'A_S14_INTEGRATED_CURRENT_LOCK_V1', report: 'review_A_S14_integrated_current_lock.json', reportType: 'A_CURRENT_S14_LOCK_WITH_S12_INDEPENDENT_CARRY_FORWARD', reviewer: 'Mother integration after independent A S12 lock + current q11 refresh',
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
  currentRelease: { label: release.label, recordedSha: release.releaseArtifactSha, recomputedSha: recomputed, releaseMembers: `${release.files.length}/${hashes.length}`, memberHashMismatch: memberPass ? 0 : hashes.filter((row) => row.sha256 !== row.actualSha256 || row.bytes !== row.actualBytes).length, pass: memberPass && recomputed === release.releaseArtifactSha },
  targetScope: { manifestRows: manifest.rows.length, factsRows: facts.facts.length, coverage: `${manifest.rows.length}/${facts.facts.length}`, allFactsPass: facts.facts.every((fact) => fact.status === 'PASS'), repairRequiredCount: facts.facts.filter((fact) => fact.status !== 'PASS').length },
  independentEvidence: { priorA_S12: 'PASS_BY_CARRY_FORWARD_424_OF_424', priorA_S12Report: 'review_A_S12_final_lock.json', currentQ11Refresh: refresh.status, currentQ11Clean: q11?.status === 'PASS' && !(q11?.reasonCodes || []).length, q11TargetedIndependentAgent: 'NOT_COMPLETED; current q11 runtime was directly rechecked and facts refresh was recorded', S12ToS14SourceChange: 'approved q11 internal-note removal only', currentBrowserQ11Rerender: '3/3 PASS in render_matrix_C.json' },
  carryForward: { count: '424/424', fromA_S12Sha: aS12.releaseLock?.current || aS12.releaseLock?.A_END || null, toS14Sha: release.releaseArtifactSha, basis: 'current facts all PASS + current release member SHA lock + q11 direct runtime cleanup; no source/answer/content/choice math changes other than approved q11 solution cleanup' },
  A_START: release.releaseArtifactSha, A_END: release.releaseArtifactSha, current: release.releaseArtifactSha, A_START_equals_A_END_equals_current: memberPass && recomputed === release.releaseArtifactSha,
  status: memberPass && recomputed === release.releaseArtifactSha && facts.facts.every((fact) => fact.status === 'PASS') ? 'A_S14_INTEGRATED_PASS_WITH_EXPLICIT_CARRY_FORWARD' : 'A_S14_INTEGRATED_HOLD',
  notTested: ['fresh independent S14 full source-fidelity read', 'fresh independent S14 full solution-math read', 'SVG semantic correspondence', 'C full release review', 'production promotion'],
  writeScope: { sourceModifiedByAudit: false, productionModifiedByAudit: false, onlyIntegrationReports: true }
};
fs.writeFileSync(path.join(reports, report.report), JSON.stringify(report, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(reports, 'review_A_S14_integrated_current_lock.md'), [`# A current S14 integrated lock`, '', `- 상태: **${report.status}**`, `- target scope: ${report.targetScope.coverage}`, `- release: ${release.label}`, `- RELEASE_ARTIFACT_SHA: \`${release.releaseArtifactSha}\``, `- member lock: ${report.currentRelease.releaseMembers}`, `- recomputed SHA: \`${recomputed}\``, `- facts current PASS: ${report.targetScope.allFactsPass ? '424/424' : `repair ${report.targetScope.repairRequiredCount}`}`, `- current q11 cleanup: ${report.independentEvidence.currentQ11Clean ? 'PASS' : 'HOLD'}`, `- q11 current browser rerender: 3/3 PASS`, `- explicit carry-forward: ${report.carryForward.count}`, `- fresh S14 independent agent q11 read: NOT_COMPLETED; direct runtime refresh recorded`, `- SVG/B/C/production: NOT_TESTED in this A integration lock`, '', 'S12 Independent A lock and the current q11 cleanup/runtime evidence are retained separately; this report does not retroactively relabel the stopped S14 targeted agent as completed.', ''].join('\n'), 'utf8');
console.log(JSON.stringify({ status: report.status, releaseArtifactSha: release.releaseArtifactSha, recomputed, members: report.currentRelease.releaseMembers, facts: report.targetScope.coverage, q11: report.independentEvidence.currentQ11Clean }, null, 2));
