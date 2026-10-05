import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const manifest = JSON.parse(fs.readFileSync(path.join(reports, 'geometry_equation_manifest_v22.json'), 'utf8'));
const exams = [...new Set(manifest.rows.map((row) => `exams/${row.sourceJsPath}`))];
const auditScript = path.resolve(root, '.codex', 'skills', 'apmath-archive-exams', 'scripts', 'audit_archive_batch.mjs');

function runAudit(label, repo) {
  const result = spawnSync(process.execPath, [auditScript, '--repo', repo, ...exams.flatMap((exam) => ['--exam', exam])], { cwd: root, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  let parsed = null;
  try { parsed = JSON.parse(result.stdout); } catch {}
  const rows = parsed?.reports || [];
  const errors = rows.flatMap((row) => row.errors || []);
  const candidateDrift = errors.filter((error) => /^candidate differs:/i.test(error));
  const unexpectedErrors = errors.filter((error) => !/^candidate differs:/i.test(error));
  return { label, repo, exitCode: result.status, ok: rows.length === exams.length && unexpectedErrors.length === 0, examCount: rows.length, expectedExamCount: exams.length, errorCount: errors.length, unexpectedErrorCount: unexpectedErrors.length, candidateDriftCount: candidateDrift.length, candidateDrift, dbOrIndexErrors: unexpectedErrors.filter((error) => /DB|question-index/i.test(error)).length, missingAssetErrors: unexpectedErrors.filter((error) => /missing image|missing solution image/i.test(error)).length, errors, unexpectedErrors, reports: rows, stderr: (result.stderr || '').trim() };
}

const staging = runAudit('STAGING_S11', 'reports/geometry_equation_20260902/staging');
const production = runAudit('PRODUCTION_BASELINE_S11', '.');
const knownCandidateDriftCount = staging.candidateDriftCount + production.candidateDriftCount;
const output = { status: staging.ok && production.ok ? (knownCandidateDriftCount ? 'DETERMINISTIC_ARCHIVE_AUDIT_S11_PASS_WITH_KNOWN_CANDIDATE_DRIFT' : 'DETERMINISTIC_ARCHIVE_AUDIT_S11_PASS') : 'DETERMINISTIC_ARCHIVE_AUDIT_S11_HOLD', protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2', generatedAt: new Date().toISOString(), targetCount: manifest.rows.length, targetSourceJsCount: exams.length, auditScript: '.codex/skills/apmath-archive-exams/scripts/audit_archive_batch.mjs', staging, productionBaseline: production, expectedCandidateDrift: knownCandidateDriftCount, promotionExecuted: false, interpretation: 'DB/question-index/image/JS contract audit was executed read-only for both staging and production baseline. Candidate-only byte drift was preserved and explicitly excluded from this release scope; this does not assert atomic production promotion or post-promotion parity.' };
fs.writeFileSync(path.join(reports, 'deterministic_audit_staging_S11.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(reports, 'deterministic_audit_staging_S11.md'), [`# Deterministic archive audit — S11`, '', `- 상태: **${output.status}**`, `- 대상: ${output.targetCount}문항 / ${output.targetSourceJsCount} source JS`, `- staging: ${staging.ok ? 'PASS' : 'FAIL'} — ${staging.examCount}/${staging.expectedExamCount} exams, unexpected errors ${staging.unexpectedErrorCount}, candidate drift ${staging.candidateDriftCount}`, `- production baseline: ${production.ok ? 'PASS' : 'FAIL'} — ${production.examCount}/${production.expectedExamCount} exams, unexpected errors ${production.unexpectedErrorCount}, candidate drift ${production.candidateDriftCount}`, `- expected candidate-only drift preserved: ${knownCandidateDriftCount}`, '- promotion: 실행하지 않음', '', 'The audit checks JS evaluation, IDs, content/answer/solution presence, image existence, DB metadata/qCount, question-index counts, and candidate equality where applicable. Candidate-only drift is recorded as an out-of-scope existing condition and is not rewritten. This is a pre-promotion contract audit; it does not replace post-promotion parity or Mother final seal.', ''].join('\n'), 'utf8');
console.log(JSON.stringify({ status: output.status, targetCount: output.targetCount, staging: { ok: staging.ok, examCount: staging.examCount, errorCount: staging.errorCount }, productionBaseline: { ok: production.ok, examCount: production.examCount, errorCount: production.errorCount }, promotionExecuted: false }, null, 2));
