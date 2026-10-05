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
  const args = [auditScript, '--repo', repo];
  for (const exam of exams) args.push('--exam', exam);
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  let parsed = null;
  let parseError = null;
  try { parsed = JSON.parse(result.stdout); } catch (error) { parseError = String(error); }
  const rows = parsed?.reports || [];
  const errors = rows.flatMap((row) => row.errors || []);
  return {
    label,
    repo,
    exitCode: result.status,
    ok: result.status === 0 && parsed?.ok === true && errors.length === 0 && rows.length === exams.length,
    parseError,
    examCount: rows.length,
    expectedExamCount: exams.length,
    errorCount: errors.length,
    dbOrIndexErrors: errors.filter((error) => /DB|question-index/i.test(error)).length,
    missingAssetErrors: errors.filter((error) => /missing image|missing solution image/i.test(error)).length,
    reports: rows,
    stderr: result.stderr.trim()
  };
}

const staging = runAudit('STAGING', 'reports/geometry_equation_20260902/staging');
const production = runAudit('PRODUCTION_BASELINE', '.');
const output = {
  status: staging.ok && production.ok ? 'DETERMINISTIC_ARCHIVE_AUDIT_PASS' : 'DETERMINISTIC_ARCHIVE_AUDIT_HOLD',
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
  generatedAt: new Date().toISOString(),
  manifestPath: 'reports/geometry_equation_20260902/geometry_equation_manifest_v22.json',
  targetCount: manifest.rows.length,
  targetSourceJsCount: exams.length,
  auditScript: '.codex/skills/apmath-archive-exams/scripts/audit_archive_batch.mjs',
  staging,
  productionBaseline: production,
  promotionExecuted: false,
  interpretation: 'DB/question-index/image/JS contract audit was executed read-only for both staging and production baseline; this does not assert atomic production promotion or post-promotion parity.'
};
fs.writeFileSync(path.join(reports, 'deterministic_audit_staging_S5.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const md = [
  '# Deterministic archive audit — S5', '',
  `- 상태: **${output.status}**`,
  `- 대상: ${output.targetCount}문항 / ${output.targetSourceJsCount} source JS`,
  `- staging: ${staging.ok ? 'PASS' : 'FAIL'} — ${staging.examCount}/${staging.expectedExamCount} exams, errors ${staging.errorCount}, DB/index errors ${staging.dbOrIndexErrors}, missing assets ${staging.missingAssetErrors}`,
  `- production baseline: ${production.ok ? 'PASS' : 'FAIL'} — ${production.examCount}/${production.expectedExamCount} exams, errors ${production.errorCount}, DB/index errors ${production.dbOrIndexErrors}, missing assets ${production.missingAssetErrors}`,
  '- promotion: 실행하지 않음',
  '',
  'The audit checks JS evaluation, IDs, content/answer/solution presence, image existence, DB metadata/qCount, question-index counts, and candidate equality where applicable. It is a pre-promotion contract audit; it does not replace post-promotion parity or Mother final seal.'
].join('\n') + '\n';
fs.writeFileSync(path.join(reports, 'deterministic_audit_staging_S5.md'), md, 'utf8');
console.log(JSON.stringify({ status: output.status, targetCount: output.targetCount, staging: { ok: staging.ok, examCount: staging.examCount, errorCount: staging.errorCount }, productionBaseline: { ok: production.ok, examCount: production.examCount, errorCount: production.errorCount }, promotionExecuted: false }, null, 2));
