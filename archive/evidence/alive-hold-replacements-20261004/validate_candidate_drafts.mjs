import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const cases = [
  {
    source: 'archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js',
    candidate: 'archive/exams/similar/high/h2/2final/19_순천여고_2학기_기말_고2_수학II_ALIVE대체.js',
    title: '19_순천여고_2학기_기말_고2_수학II_ALIVE대체', qids: [21],
  },
  {
    source: 'archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js',
    candidate: 'archive/exams/similar/high/h2/2final/21_매산여고_2학기_기말_고2_수학II_ALIVE대체.js',
    title: '21_매산여고_2학기_기말_고2_수학II_ALIVE대체', qids: [6, 20],
  },
  {
    source: 'archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js',
    candidate: 'archive/exams/similar/high/h2/2final/21_순천여고_2학기_기말_고2_수학II_ALIVE대체.js',
    title: '21_순천여고_2학기_기말_고2_수학II_ALIVE대체', qids: [8, 9, 10, 13, 15],
  },
];
const sha = data => `sha256:${crypto.createHash('sha256').update(data).digest('hex')}`;
const load = relative => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, { timeout: 1000 });
  return context.window;
};
const errors = [];
const rows = [];
for (const item of cases) {
  const src = load(item.source), candidate = load(item.candidate);
  if (candidate.examTitle !== item.title) errors.push(`EXAM_TITLE:${item.candidate}`);
  if (candidate.questionBank.length !== item.qids.length) errors.push(`QUESTION_COUNT:${item.candidate}`);
  if (JSON.stringify(candidate.questionBank.map(q => q.id)) !== JSON.stringify(item.qids)) errors.push(`QUESTION_ORDER:${item.candidate}`);
  const sourceIds = new Set(src.questionBank.map(q => q.id));
  for (const q of candidate.questionBank) {
    if (!sourceIds.has(q.id)) errors.push(`SOURCE_QID_MAPPING:${item.candidate}/q${q.id}`);
    if (!q.content || !q.answer || !q.solution || !Array.isArray(q.choices)) errors.push(`REQUIRED_PAYLOAD:${item.candidate}/q${q.id}`);
    if (q.questionType === '객관식') {
      if (q.choices.length !== 5 || new Set(q.choices).size !== 5) errors.push(`MCQ_CHOICE_SET:${item.candidate}/q${q.id}`);
      const index = ['①', '②', '③', '④', '⑤'].indexOf(q.answer);
      if (index < 0 || index >= q.choices.length) errors.push(`MCQ_ANSWER_INDEX:${item.candidate}/q${q.id}`);
    }
    if (q.image) {
      const imagePath = path.posix.join('archive', q.image);
      if (!fs.existsSync(path.join(root, imagePath))) errors.push(`IMAGE_MISSING:${imagePath}`);
      if (!q.image.startsWith(`assets/images/${item.title}/`)) errors.push(`ASSET_FOLDER_TITLE_MISMATCH:${q.image}`);
    }
    rows.push({ candidatePath: item.candidate, qid: q.id, questionType: q.questionType, answer: q.answer, image: q.image || null });
  }
  rows.push({ candidatePath: item.candidate, fileSha256: sha(fs.readFileSync(path.join(root, item.candidate))), sourcePath: item.source, sourceSha256: sha(fs.readFileSync(path.join(root, item.source))) });
}
const assets = rows.filter(row => row.image).map(row => ({ path: `archive/${row.image}`, sha256: sha(fs.readFileSync(path.join(root, 'archive', row.image))) }));
const report = { schemaVersion: 'ALIVE_CANDIDATE_DRAFT_TECHNICAL_CHECK_v1', status: errors.length ? 'FAIL' : 'PASS', errors, questionCount: rows.filter(row => row.qid).length, rows, assets };
const output = path.join(root, 'archive/evidence/alive-hold-replacements-20261004/candidate-technical-check.json');
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ status: report.status, errors, questionCount: report.questionCount, output })}\n`);
if (errors.length) process.exitCode = 1;
