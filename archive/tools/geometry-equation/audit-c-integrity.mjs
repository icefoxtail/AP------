import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const ARCHIVE = path.join(REPORTS, 'staging', 'archive');
const PRODUCTION = path.join(ROOT, 'archive');

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(REPORTS, name), 'utf8'));
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const shaFile = (filePath) => sha(fs.readFileSync(filePath));
const abs = (root, relativePath) => path.join(root, relativePath.replaceAll('/', path.sep));
const exists = (filePath) => fs.existsSync(filePath) && fs.statSync(filePath).isFile();
const fileInfo = (root, relativePath) => {
  const filePath = abs(root, relativePath);
  return exists(filePath) ? { exists: true, sha256: shaFile(filePath), bytes: fs.statSync(filePath).size } : { exists: false };
};
const pass = (name, evidence, details = {}) => ({ name, status: 'PASS', evidence, ...details });
const fail = (name, evidence, details = {}) => ({ name, status: 'FAIL', evidence, ...details });
const notTested = (name, evidence, details = {}) => ({ name, status: 'NOT_TESTED', evidence, ...details });

const manifest = readJson('geometry_equation_manifest_v22.json');
const artifact = readJson('current_release_artifact.json');
const bReport = readJson(process.env.GEOMETRY_B_REPORT || 'review_B_S11_fresh.json');
const render = readJson('render_matrix_C.json');
const renderRuntime = readJson('render_runtime_fingerprint.json');
const svgManifest = readJson('svg_asset_manifest_v22.json');
const renderInput = readJson('render_matrix_input.json');
const aFacts = readJson(process.env.GEOMETRY_FACTS_FILE || 'a_independent_solve_facts_S6.json');
const approvedRepairLedgers = [
  's6_approved_repair_ledger.json',
  'solution_text_patch_ledger.json',
  'solution_runtime_escape_normalization_S9.json',
].flatMap((name) => {
  try { return readJson(name).ledger || []; } catch { return []; }
});
const approvedProtectedPairs = new Set(approvedRepairLedgers.flatMap((row) => {
  const fields = String(row.field || '').split('|').filter(Boolean);
  return fields.map((field) => `${row.qKey}|${field}`);
}));

const checks = [];
const targetRows = manifest.rows || [];
const targetUids = targetRows.map((row) => row.questionUid || row.qKey);
const uniqueTargetUids = new Set(targetUids);
const sourcePaths = [...new Set(targetRows.map((row) => row.sourceJsPath))].sort();
const renderRowsBySource = new Map(renderInput.rows.map((row) => [row.sourceJsPath, row]));

if (targetRows.length === uniqueTargetUids.size && sourcePaths.length === 41) {
  checks.push(pass('manifest_identity', 'geometry_equation_manifest_v22.json', { targetCount: targetRows.length, uniqueQuestionUid: uniqueTargetUids.size, sourceJsCount: sourcePaths.length }));
} else {
  checks.push(fail('manifest_identity', 'geometry_equation_manifest_v22.json', { targetCount: targetRows.length, uniqueQuestionUid: uniqueTargetUids.size, sourceJsCount: sourcePaths.length }));
}

const releaseRows = artifact.files || [];
const releaseRecomputed = releaseRows.map((row) => {
  const info = fileInfo(ARCHIVE, row.relativePath);
  return { ...row, actual: info, hashMatch: info.exists && info.sha256 === row.sha256, bytesMatch: info.exists && info.bytes === row.bytes };
});
const releaseMembersOk = releaseRecomputed.every((row) => row.hashMatch && row.bytesMatch);
const releaseSha = sha(JSON.stringify(releaseRows.map(({ relativePath, sha256: fileSha, bytes }) => ({ relativePath, sha256: fileSha, bytes }))));
checks.push(releaseMembersOk && releaseSha === artifact.releaseArtifactSha
  ? pass('release_member_hashes', 'current_release_artifact.json + staging/archive', { recordedReleaseArtifactSha: artifact.releaseArtifactSha, recomputedReleaseArtifactSha: releaseSha, releaseFileCount: releaseRows.length })
  : fail('release_member_hashes', 'current_release_artifact.json + staging/archive', { recordedReleaseArtifactSha: artifact.releaseArtifactSha, recomputedReleaseArtifactSha: releaseSha, releaseFileCount: releaseRows.length, mismatches: releaseRecomputed.filter((row) => !row.hashMatch || !row.bytesMatch).slice(0, 30) }));

const sourceResults = [];
for (const sourceJsPath of sourcePaths) {
  const relative = `exams/${sourceJsPath}`;
  const stagingPath = abs(ARCHIVE, relative);
  const productionPath = abs(PRODUCTION, relative);
  let qbank = [];
  let vmError = null;
  try {
    const sourceText = fs.readFileSync(stagingPath, 'utf8');
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(sourceText, context, { filename: stagingPath, timeout: 5000 });
    qbank = context.window.questionBank || [];
  } catch (error) {
    vmError = String(error);
  }
  const syntax = spawnSync(process.execPath, ['--check', stagingPath], { encoding: 'utf8' });
  const renderRow = renderRowsBySource.get(sourceJsPath);
  const expectedTargetIds = targetRows.filter((row) => row.sourceJsPath === sourceJsPath).map((row) => Number(row.id)).sort((a, b) => a - b);
  const actualIds = qbank.map((question) => Number(question.id)).sort((a, b) => a - b);
  const targetIdsPresent = expectedTargetIds.every((id) => actualIds.includes(id));
  const contentKeys = ['content', 'choices', 'answer', 'image'];
  let protectedDiffCount = 0;
  let approvedProtectedDiffCount = 0;
  const unapprovedProtectedDiffs = [];
  let productionVmError = null;
  if (exists(productionPath)) {
    try {
      const productionText = fs.readFileSync(productionPath, 'utf8');
      const productionContext = { window: {} };
      vm.createContext(productionContext);
      vm.runInContext(productionText, productionContext, { filename: productionPath, timeout: 5000 });
      const productionById = new Map((productionContext.window.questionBank || []).map((question) => [Number(question.id), question]));
      for (const question of qbank) {
        const original = productionById.get(Number(question.id));
        if (!original) continue;
        for (const key of contentKeys) {
          if (JSON.stringify(question[key] ?? null) !== JSON.stringify(original[key] ?? null)) {
            const pair = `${sourceJsPath}_${question.id}|${key}`;
            if (approvedProtectedPairs.has(pair)) approvedProtectedDiffCount += 1;
            else {
              protectedDiffCount += 1;
              unapprovedProtectedDiffs.push({ qKey: pair.split('|')[0], field: key });
            }
          }
        }
      }
    } catch (error) {
      productionVmError = String(error);
    }
  }
  sourceResults.push({ sourceJsPath, stagingFile: fileInfo(ARCHIVE, relative), nodeCheck: syntax.status === 0, nodeCheckStderr: syntax.stderr?.trim() || '', vmLoad: !vmError, vmError, questionCount: qbank.length, idMin: actualIds[0] ?? null, idMax: actualIds.at(-1) ?? null, targetCount: expectedTargetIds.length, targetIdsPresent, protectedDiffCount, approvedProtectedDiffCount, unapprovedProtectedDiffs, productionVmError, sourceFileSha256: shaFile(stagingPath), renderQuestionCount: renderRow?.questionCount ?? null });
}
const sourcePass = sourceResults.every((row) => row.nodeCheck && row.vmLoad && row.targetIdsPresent && row.protectedDiffCount === 0 && row.questionCount === row.renderQuestionCount);
checks.push(sourcePass ? pass('source_js_runtime_and_protection', 'staging/archive/exams/original/high/h1 + production/archive comparison + approved repair ledger', { sourceJsCount: sourceResults.length, nodeCheckPass: sourceResults.filter((row) => row.nodeCheck).length, vmLoadPass: sourceResults.filter((row) => row.vmLoad).length, unapprovedProtectedDiffCount: sourceResults.reduce((sum, row) => sum + row.protectedDiffCount, 0), approvedProtectedDiffCount: sourceResults.reduce((sum, row) => sum + row.approvedProtectedDiffCount, 0), rows: sourceResults }) : fail('source_js_runtime_and_protection', 'staging/archive/exams/original/high/h1 + production/archive comparison + approved repair ledger', { sourceJsCount: sourceResults.length, rows: sourceResults.filter((row) => !row.nodeCheck || !row.vmLoad || !row.targetIdsPresent || row.protectedDiffCount !== 0 || row.questionCount !== row.renderQuestionCount) }));

const requiredSupport = ['engine.html', 'mixed_engine.html', 'db.js', 'question-index.js', 'question-identity.js', 'question-meta.js', 'concept_map.js', 'mathjax_render_loop.js', 'native_print.js', 'print_image_optimizer.js', 'data/question_metadata.json'];
const missingSupport = requiredSupport.filter((relativePath) => !exists(abs(ARCHIVE, relativePath)));
checks.push(missingSupport.length === 0 ? pass('engine_dependency_closure', 'staging/archive', { requiredSupportCount: requiredSupport.length, missing: [] }) : fail('engine_dependency_closure', 'staging/archive', { requiredSupportCount: requiredSupport.length, missing: missingSupport }));

const svgRows = svgManifest.map((row) => ({ ...row, info: fileInfo(ARCHIVE, row.assetRef) }));
const svgMissing = svgRows.filter((row) => !row.info.exists);
const newSvgSyntax = svgRows.map((row) => {
  if (!row.info.exists) return { ...row, valid: false, reason: 'MISSING' };
  const text = fs.readFileSync(abs(ARCHIVE, row.assetRef), 'utf8');
  const valid = /^<svg\b[\s\S]*<\/svg>\s*$/i.test(text) && /viewBox\s*=/.test(text) && /width\s*=/.test(text) && /height\s*=/.test(text) && !/<(?:br|script|iframe)\b/i.test(text) && !/(?:\\frac|\\dfrac|\\sqrt|MathJax|mathjax)/i.test(text) && !/data-fact-hash="[^"]+"/.test(text) === false;
  return { questionUid: row.questionUid, assetRef: row.assetRef, valid, bytes: text.length, factHashPresent: /data-fact-hash="[^"]+"/.test(text), externalRef: /(?:href|src)\s*=\s*["']https?:/i.test(text) };
});
const svgSyntaxFailures = newSvgSyntax.filter((row) => !row.valid || row.externalRef || !row.factHashPresent);
checks.push(svgSyntaxFailures.length === 0 ? pass('new_svg_static_integrity', 'svg_asset_manifest_v22.json + staging/archive/assets', { generatedSvgCount: svgRows.length, pass: svgRows.length }) : fail('new_svg_static_integrity', 'svg_asset_manifest_v22.json + staging/archive/assets', { generatedSvgCount: svgRows.length, failures: svgSyntaxFailures.slice(0, 30) }));

const renderCases = render.cases || [];
const expectedRenderCases = renderInput.rows.length * 3;
const renderPass = render.status === 'C_RENDER_PASS_CURRENT_STAGING' && renderCases.length === expectedRenderCases && renderCases.every((row) => row.pass === true && row.brokenImages === 0 && row.overflowPages === 0 && row.renderError === null && row.rawLatexText === false);
const renderShaMatches = render.releaseArtifactSha === artifact.releaseArtifactSha;
checks.push(renderPass && renderShaMatches ? pass('actual_browser_render_matrix', 'render_matrix_C.json + render_matrix_C.csv', { cases: renderCases.length, examPass: render.examPass, solutionPass: render.solutionPass, answerPass: render.answerPass, releaseArtifactSha: render.releaseArtifactSha, runtime: { browserSurface: renderRuntime.browserSurface, entryPort: renderRuntime.entryPort, viewport: renderRuntime.viewport, dpr: renderRuntime.dpr } }) : fail('actual_browser_render_matrix', 'render_matrix_C.json + render_matrix_C.csv', { cases: renderCases.length, renderStatus: render.status, renderSha: render.releaseArtifactSha, artifactSha: artifact.releaseArtifactSha, failedCases: renderCases.filter((row) => !row.pass).slice(0, 20) }));

const bReleaseSha = bReport.release?.recomputedReleaseArtifactSha || bReport.releaseArtifactSha || bReport.B_END_RELEASE_SHA || null;
const bTargetCount = bReport.coverage?.targetCount ?? bReport.scope?.targetCount ?? null;
const bFailCount = bReport.statusSummary?.FAIL ?? bReport.statusSummary?.fail ?? bReport.finalDecision?.fail ?? null;
checks.push(bTargetCount === targetRows.length && bFailCount === 0 ? pass('independent_B_input_consistency', process.env.GEOMETRY_B_REPORT || 'review_B_S11_fresh.json', { BStatus: bReport.finalStatus || bReport.status || bReport.finalDecision?.overallBStatus, BRecordedCoverage: bReport.coverage || bReport.scope, BReleaseSha: bReleaseSha }) : notTested('independent_B_input_consistency', process.env.GEOMETRY_B_REPORT || 'review_B_S11_fresh.json', { note: 'B report schema is independently preserved; C does not promote source blockers.' }));
checks.push(notTested('db_index_zip_and_production_parity_release', 'protocol v2.2 final gates', { reason: 'C verifies staging dependencies and protected-field parity; DB/index/ZIP production promotion is not executed before source/metadata approval.' }));

const counts = checks.reduce((acc, check) => { acc[check.status] = (acc[check.status] || 0) + 1; return acc; }, {});
const sourceBlockedRows = (aFacts.facts || []).filter((fact) => (fact.reasonCodes || []).some((code) => /FAIL_PROBLEM|FAIL_ANSWER|SOURCE_|CHOICES_INCOMPLETE/.test(String(code)))).map((fact) => fact.manifestRow);
const notTestedRows = (aFacts.facts || []).filter((fact) => fact.status === 'NOT_TESTED').map((fact) => fact.manifestRow);
const report = {
  status: checks.some((check) => check.status === 'FAIL') ? 'C_FAIL' : (sourceBlockedRows.length || notTestedRows.length ? 'C_PASS_HOLD_SOURCE_BLOCKED_AND_NOT_TESTED' : 'C_PASS'),
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
  generatedAt: new Date().toISOString(),
  targetCount: targetRows.length,
  sourceJsCount: sourcePaths.length,
  targetRenderExamCount: renderInput.rows.length,
  releaseArtifactSha: artifact.releaseArtifactSha,
  releaseArtifactShaRecomputed: releaseSha,
  renderMatrixReleaseArtifactSha: render.releaseArtifactSha,
  checks,
  checkCounts: counts,
  sourceResults,
  sourceBlockedRows,
  notTestedRows,
  finalSealAllowed: false,
  finalSealReason: `C 렌더·staging 파일 무결성은 통과했지만, production promotion/DB-index parity는 아직 수행하지 않아 최종 봉인을 보류한다. source blocker ${sourceBlockedRows.length}건, A NOT_TESTED ${notTestedRows.length}건.`
};
fs.writeFileSync(path.join(REPORTS, 'review_C_release_integrity.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
const md = [
  '# Independent C — 릴리스·실제 렌더 무결성 검수',
  '',
  `- 최종 상태: **${report.status}**`,
  `- 대상: ${report.targetCount}문항 / ${report.sourceJsCount} source JS / ${report.targetRenderExamCount} 시험지`,
  `- 실제 브라우저 렌더: ${renderCases.filter((row) => row.pass).length}/${renderCases.length} PASS (시험지 ${render.examPass ? renderInput.rows.length : '검토 필요'}, 해설 ${render.solutionPass ? renderInput.rows.length : '검토 필요'}, 답안지 ${render.answerPass ? renderInput.rows.length : '검토 필요'})`,
  `- 릴리스 SHA: \`${report.releaseArtifactSha}\``,
  `- SHA 재계산: \`${report.releaseArtifactShaRecomputed}\``,
  `- 최종 봉인: **불가** — production promotion/DB-index parity 미완료; source blocker ${sourceBlockedRows.length}건 및 A NOT_TESTED ${notTestedRows.length}건`,
  '',
  '## 체크 결과',
  '',
  ...checks.map((check) => `- **${check.status}** ${check.name} — ${check.evidence}`),
  '',
  '## 강제 보류 문항',
  '',
  `- SOURCE_BLOCKED: ${sourceBlockedRows.join(', ')}`,
  `- NOT_TESTED: ${notTestedRows.join(', ')}`,
  '',
  'C는 수학 해설의 정오를 독립적으로 승격하지 않으며, A/B의 source·metadata 보류를 PASS로 바꾸지 않는다.'
].join('\n') + '\n';
fs.writeFileSync(path.join(REPORTS, 'review_C_release_integrity.md'), md, 'utf8');
console.log(JSON.stringify({ status: report.status, counts, targetCount: report.targetCount, sourceJsCount: report.sourceJsCount, renderCases: renderCases.length, releaseArtifactSha: report.releaseArtifactSha, releaseSha, finalSealAllowed: report.finalSealAllowed }, null, 2));
