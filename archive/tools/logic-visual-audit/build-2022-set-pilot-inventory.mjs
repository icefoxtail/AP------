import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadExamFile } from './lib/source.mjs';
import { relativeRepoPath, sha256 } from './lib/io.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXAM_ROOT = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h1');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const includedStages = new Set(['2mid', '2final']);
const files = [];
for (const stage of includedStages) {
  const dir = path.join(EXAM_ROOT, stage);
  for (const name of fs.readdirSync(dir).filter((entry) => entry.startsWith('22_') && entry.endsWith('.js')).sort()) {
    files.push({ stage, name, absolutePath: path.join(dir, name) });
  }
}

const rows = [];
for (const file of files) {
  const exam = loadExamFile(file.absolutePath);
  for (const question of exam.questions) {
    if (question.standardUnitKey !== 'H15-SB-01' && question.standardUnit !== '집합') continue;
    const solutionImage = typeof question.solutionImage === 'string' ? question.solutionImage : null;
    rows.push({
      questionUid: `${relativeRepoPath(ROOT, file.absolutePath)}|${exam.title}|${question.id}`,
      examId: exam.title,
      qid: question.id,
      stage: file.stage,
      sourceJsPath: relativeRepoPath(ROOT, file.absolutePath),
      sourceJsSha: sha256(fs.readFileSync(file.absolutePath)),
      standardUnitKey: question.standardUnitKey ?? null,
      standardUnit: question.standardUnit ?? null,
      subUnitKey: question.subUnitKey ?? null,
      subUnit: question.subUnit ?? null,
      content: question.content ?? '',
      choices: Array.isArray(question.choices) ? question.choices : [],
      answer: question.answer ?? null,
      solution: question.solution ?? '',
      solutionImage,
      solutionImageAlt: question.solutionImageAlt ?? null,
      solutionImageCaption: question.solutionImageCaption ?? null,
      problemImageRefs: ['problemImage', 'problemImageRef', 'image', 'imageRef', 'originalProblemImage']
        .map((key) => question[key])
        .filter((value) => typeof value === 'string' && value.length > 0),
      visualAttached: Boolean(solutionImage),
      inventoryEvidence: 'SOURCE_JS_READ_ONLY; NO_VISUAL_DECISION_INFERRED'
    });
  }
}

rows.sort((a, b) => a.questionUid.localeCompare(b.questionUid));
const byStage = Object.fromEntries([...new Set(rows.map((row) => row.stage))].sort().map((stage) => [stage, rows.filter((row) => row.stage === stage).length]));
const byExam = Object.fromEntries([...new Set(rows.map((row) => row.examId))].sort().map((examId) => [examId, rows.filter((row) => row.examId === examId).length]));
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_2022_SET_PILOT_INVENTORY',
  status: 'INVENTORY_FROZEN_BEFORE_PRODUCTION_EDIT',
  scope: '22_ 2학기 original exams, standardUnit 집합 only, 2mid + 2final.',
  exactPilotCount: rows.length,
  countsByStage: byStage,
  countsByExam: byExam,
  questionUidSetSha: sha256(rows.map((row) => row.questionUid).sort()),
  productionMutationCount: 0,
  rows,
  note: 'The companion pilot instruction estimated 48 items; source inventory resolves the exact denominator to 50 (40 from 2mid and 10 from 2final). No visual decision or production edit is performed by this inventory step.'
};
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'phase2_2022_set_pilot_inventory.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const markdown = [
  '# 2022 집합 Phase 2 파일럿 inventory',
  '',
  `- 상태: **${output.status}**`,
  `- 정확한 분모: **${output.exactPilotCount}**`,
  `- 2mid: **${byStage['2mid'] ?? 0}**`,
  `- 2final: **${byStage['2final'] ?? 0}**`,
  `- UID set SHA: \`${output.questionUidSetSha}\``,
  `- production mutation count: **${output.productionMutationCount}**`,
  '',
  '문서의 “약 48문항” 표현을 실제 JS inventory로 해소한 결과, 파일럿 분모는 50문항(중간 40 + 기말 10)이다.',
  '이 단계에서는 visualDecision을 추정하거나 production SVG/JS를 수정하지 않았다.',
  '',
  '## Stage counts',
  '',
  ...Object.entries(byStage).map(([stage, count]) => `- ${stage}: ${count}`),
  '',
  '## Evidence',
  '',
  '- [Machine-readable inventory](./phase2_2022_set_pilot_inventory.json)',
  '- [Phase 2 repair ledger](./phase2_repair_ledger.md)',
  ''
].join('\n');
fs.writeFileSync(path.join(OUT, 'phase2_2022_set_pilot_inventory.md'), markdown, 'utf8');
console.log(JSON.stringify({ status: output.status, exactPilotCount: output.exactPilotCount, countsByStage: byStage, questionUidSetSha: output.questionUidSetSha, productionMutationCount: 0 }, null, 2));
