import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.resolve(process.env.GEOMETRY_ARCHIVE_ROOT || path.join(ROOT, 'archive'));
const EXAMS = path.join(ARCHIVE, 'exams');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const MANIFEST_PATH = path.join(REPORTS, 'geometry_equation_manifest.json');
const INDEX_PATH = path.join(ARCHIVE, 'question-index.js');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n').trim();
  return value ?? null;
}

function hashJson(value) {
  return sha256(JSON.stringify(stable(value)));
}

function readBank(relativePath) {
  const absolute = path.join(EXAMS, relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(absolute, 'utf8'), context, { filename: absolute, timeout: 4000 });
  return context.window.questionBank || [];
}

function loadQuestionMap(rows) {
  const files = new Set(rows.map((row) => row.sourceJsPath));
  const map = new Map();
  for (const sourcePath of files) {
    for (const question of readBank(sourcePath)) map.set(`${sourcePath}_${question.id}`, question);
  }
  return map;
}

function resolveAsset(ref) {
  if (!ref) return null;
  const absolute = path.resolve(ARCHIVE, ref.replaceAll('\\', '/'));
  const inside = absolute === ARCHIVE || absolute.startsWith(`${ARCHIVE}${path.sep}`);
  return { absolute, inside, exists: inside && fs.existsSync(absolute) };
}

function svgIssues(asset) {
  if (!asset?.exists) return asset ? ['ASSET_MISSING'] : [];
  const text = fs.readFileSync(asset.absolute, 'utf8');
  const issues = [];
  if (!/^\s*<svg[\s>]/i.test(text)) issues.push('SVG_ROOT_MISSING');
  if (!/<\/svg>\s*$/i.test(text)) issues.push('SVG_CLOSE_MISSING');
  for (const [code, pattern] of [
    ['SVG_FORBIDDEN_BR', /<br\b/i],
    ['SVG_FORBIDDEN_LATEX', /\\frac|\\sqrt|\$[^$]*\$/],
    ['SVG_FORBIDDEN_MATHJAX', /mathjax|MathJax/i],
    ['SVG_EXTERNAL_RESOURCE', /(?:href|xlink:href)\s*=\s*["'](?:https?:|data:|\/\/)/i],
    ['SVG_EMPTY_TEXT', /<text[^>]*>\s*<\/text>/i],
  ]) if (pattern.test(text)) issues.push(code);
  if (!/viewBox\s*=\s*["'][^"']+["']/i.test(text)) issues.push('SVG_VIEWBOX_MISSING');
  return issues;
}

function getIssues(row, question) {
  const issues = [];
  if (!question) return ['QUESTION_BANK_MISSING'];
  const content = String(question.content || '').trim();
  const solution = String(question.solution || '').trim();
  const solutionForStructure = solution.replaceAll('\\n', '\n');
  const answer = String(question.answer || '').trim();
  const choices = Array.isArray(question.choices) ? question.choices : [];
  if (!content) issues.push('CONTENT_MISSING');
  if (!answer || answer === '?' || answer === '？') issues.push('ANSWER_MISSING_OR_PLACEHOLDER');
  if (!solution) issues.push('SOLUTION_MISSING');
  if (String(question.questionType || '').includes('객관') && choices.length !== 5 && !question.image) issues.push('OBJECTIVE_CHOICES_NOT_5');
  if (solution.length < 180) issues.push('UPGRADE_SOLUTION_TOO_SHORT');
  if (!/\n/.test(solutionForStructure) || solutionForStructure.split(/\n/).filter(Boolean).length < 4) issues.push('UPGRADE_SOLUTION_FEW_STEPS');
  for (const token of ['확인 필요', '직접불가', '[????]', '????', 'unavailable', 'pending']) {
    if ([content, answer, solution, JSON.stringify(choices)].some((text) => text.includes(token))) issues.push('PLACEHOLDER_LITERAL');
  }
  if (row.visualRequirement === 'VISUAL_REQUIRED' && !question.solutionImage) issues.push('SOLUTION_VISUAL_MISSING');
  if (question.solutionImage) issues.push(...svgIssues(resolveAsset(question.solutionImage)));
  return [...new Set(issues)];
}

function rowForCsv(row, question, issues) {
  const image = resolveAsset(question?.solutionImage);
  const upgradeRequired = issues.some((issue) => issue.startsWith('UPGRADE_') || issue === 'SOLUTION_VISUAL_MISSING');
  const hardFail = issues.some((issue) => !issue.startsWith('UPGRADE_') && issue !== 'SOLUTION_VISUAL_MISSING');
  return {
    questionUid: row.questionUid,
    qKey: row.qKey,
    sourceJsPath: row.sourceJsPath,
    id: row.id,
    mappedUnitKey: row.mappedUnitKey,
    subUnitKey: row.subUnitKey,
    solutionLength: question?.solution?.length || 0,
    visualRequirement: row.visualRequirement,
    solutionImageRef: question?.solutionImage || '',
    solutionImageStatus: image ? (image.exists ? 'EXISTS' : 'MISSING') : 'NONE',
    issueCodes: issues.join('|'),
    builderAction: hardFail ? 'BLOCK_AND_REVIEW' : upgradeRequired ? 'UPGRADE_REQUIRED' : 'AUDIT_ONLY',
    selfCheckStatus: hardFail ? 'FAIL' : upgradeRequired ? 'UPGRADE_REQUIRED' : 'PASS_BASELINE',
  };
}

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, rows) {
  const keys = Object.keys(rows[0] || {});
  const lines = [keys.join(',')];
  for (const row of rows) lines.push(keys.map((key) => csvEscape(row[key])).join(','));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const rows = manifest.rows;
  const questions = loadQuestionMap(rows);
  const ledger = [];
  const visual = [];
  const batches = [];
  for (let index = 0; index < rows.length; index += 5) {
    const batchRows = rows.slice(index, index + 5);
    let batchFail = 0;
    let batchUpgrade = 0;
    for (const row of batchRows) {
      const question = questions.get(row.qKey);
      const issues = getIssues(row, question);
      const result = rowForCsv(row, question, issues);
      ledger.push(result);
      visual.push({
        questionUid: row.questionUid,
        qKey: row.qKey,
        mappedUnitKey: row.mappedUnitKey,
        standardUnitKey: row.standardUnitKey,
        subUnitKey: row.subUnitKey,
        visualRequirement: row.visualRequirement,
        visualRequirementStatus: row.visualRequirementStatus,
        existingSolutionImage: question?.solutionImage || '',
        existingSolutionImageStatus: row.solutionImageStatus,
        issueCodes: issues.filter((issue) => issue.includes('VISUAL') || issue.startsWith('SVG_')).join('|'),
        action: issues.includes('SOLUTION_VISUAL_MISSING') ? 'CREATE_SVG' : row.solutionImageStatus === 'EXISTS' ? 'VERIFY_EXISTING_SVG' : 'REVIEW_OR_EXEMPT',
      });
      if (result.selfCheckStatus === 'FAIL') batchFail += 1;
      if (result.selfCheckStatus === 'UPGRADE_REQUIRED') batchUpgrade += 1;
    }
    batches.push({
      batchNo: Math.floor(index / 5) + 1,
      firstQuestionUid: batchRows[0]?.questionUid || '',
      lastQuestionUid: batchRows.at(-1)?.questionUid || '',
      questionCount: batchRows.length,
      failCount: batchFail,
      upgradeRequiredCount: batchUpgrade,
      passBaselineCount: batchRows.length - batchFail - batchUpgrade,
      status: batchFail ? 'FAIL' : batchUpgrade ? 'UPGRADE_REQUIRED' : 'PASS_BASELINE',
    });
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    manifestSha: sha256(fs.readFileSync(MANIFEST_PATH)),
    targetCount: rows.length,
    batchCount: batches.length,
    questionBankResolvedCount: rows.filter((row) => questions.has(row.qKey)).length,
    hardFailCount: ledger.filter((row) => row.selfCheckStatus === 'FAIL').length,
    upgradeRequiredCount: ledger.filter((row) => row.selfCheckStatus === 'UPGRADE_REQUIRED').length,
    baselinePassCount: ledger.filter((row) => row.selfCheckStatus === 'PASS_BASELINE').length,
    solutionImageExistsCount: ledger.filter((row) => row.solutionImageStatus === 'EXISTS').length,
    solutionImageMissingCount: ledger.filter((row) => row.solutionImageStatus === 'MISSING').length,
    solutionImageNoneCount: ledger.filter((row) => row.solutionImageStatus === 'NONE').length,
    issueCounts: Object.fromEntries([...new Set(ledger.flatMap((row) => row.issueCodes ? row.issueCodes.split('|') : []))].sort().map((issue) => [issue, ledger.filter((row) => row.issueCodes.split('|').includes(issue)).length])),
  };
  fs.writeFileSync(path.join(REPORTS, 'builder_self_check_summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(REPORTS, 'batch_self_check.csv'), JSON.stringify(batches, null, 2) + '\n', 'utf8');
  writeCsv(path.join(REPORTS, 'solution_upgrade_ledger.csv'), ledger);
  writeCsv(path.join(REPORTS, 'visual_requirement_matrix.csv'), visual);
  fs.writeFileSync(path.join(REPORTS, 'batch_self_check.json'), JSON.stringify(batches, null, 2) + '\n', 'utf8');
  const md = [
    '# Builder SELF_CHECK 보고서\n\n',
    '- 상태: `UPGRADE_REQUIRED`\n',
    `- 대상: ${summary.targetCount}\n`,
    `- 배치: ${summary.batchCount}\n`,
    `- hard FAIL: ${summary.hardFailCount}\n`,
    `- 업그레이드 필요: ${summary.upgradeRequiredCount}\n`,
    `- 기존 기준 통과: ${summary.baselinePassCount}\n`,
    `- 기존 SVG 존재: ${summary.solutionImageExistsCount}\n`,
    `- SVG 미보유: ${summary.solutionImageNoneCount}\n\n`,
    'SELF_CHECK는 최종 독립 PASS가 아니며, 다음 단계의 제작·독립 검수를 위한 초기 상태다.\n\n',
    '## 이슈별 문항 수\n\n',
    '| issue | count |\n|---|---:|\n',
  ];
  for (const [issue, count] of Object.entries(summary.issueCounts)) md.push(`| ${issue} | ${count} |\n`);
  md.push('\n## 다음 단계\n\n');
  md.push('- `UPGRADE_REQUIRED`: 학생용 해설 보강 및 SVG 제작/예외 판정\n');
  md.push('- `BLOCK_AND_REVIEW`: 독립 수학 검수에서 원문·정답·해설을 우선 확인\n');
  md.push('- `AUDIT_ONLY`: 기존 산출물도 독립 A/B/C 검수에서 다시 확인\n');
  fs.writeFileSync(path.join(REPORTS, 'builder_self_check.md'), md.join(''), 'utf8');
  console.log(JSON.stringify(summary, null, 2));
}

main();
