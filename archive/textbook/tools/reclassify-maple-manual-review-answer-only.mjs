import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const bookDirs = [
  'archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook',
  'archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook',
];

const directAnswers = new Map([
  ['마플_마플시너지 공통수학1_경우의 수_문제집대단원_고1.js#38', '30'],
  ['마플_마플시너지 공통수학1_경우의 수_문제집대단원_고1.js#75', '144'],
  ['마플_마플시너지 공통수학1_경우의 수_문제집대단원_고1.js#97', '720'],
  ['마플_마플시너지 공통수학1_다항식_문제집대단원_고1.js#157', '3'],
]);
const verifyOnly = process.argv.includes('--verify-only');

const protectedFields = [
  'id',
  'level',
  'category',
  'originalCategory',
  'standardCourse',
  'standardUnitKey',
  'standardUnit',
  'standardUnitOrder',
  'questionType',
  'layoutTag',
  'tags',
  'wide',
  'content',
  'choices',
  'image',
  'solution',
  'displayNo',
  'sourcePageNo',
  'sourceCropPath',
];

function loadQuestionBank(file) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return ctx.window.questionBank;
}

function isEmpty(value) {
  return !value || !String(value).trim();
}

function cloneProtected(q) {
  const out = {};
  for (const field of protectedFields) out[field] = q[field];
  return out;
}

function normalizeText(q) {
  return `${q.content || ''}\n${Array.isArray(q.choices) ? q.choices.join('\n') : ''}`;
}

function classify(q, applied) {
  const text = normalizeText(q);
  if (applied) return 'pure_calculation_or_objective_answer_added';
  if (isEmpty(q.content)) return 'content_empty';
  if (/그림|도형|그래프|표|벤 다이어그램|좌표평면|오른쪽|도로망|영역|정사각형|삼각형|원|접선|직선 도로/.test(text)) {
    return 'image_required';
  }
  if (/OCR|�|□|친\[|진\[|뚀|NORMAL|TOUGH|해설|내신|모의고/.test(text)) {
    return 'final_hold';
  }
  return 'answer_source_remap_required';
}

function replaceAnswerInObject(source, id, answer) {
  const idNeedle = new RegExp(`\\n  \\{\\r?\\n    "id": ${id},`);
  const match = idNeedle.exec(source);
  if (!match) throw new Error(`Cannot find object for id ${id}`);
  const start = match.index + 1;
  const end = source.indexOf('\n  },', start);
  if (end < 0) throw new Error(`Cannot find object end for id ${id}`);
  const block = source.slice(start, end);
  const updated = block.replace(/("answer":\s*")([^"]*)(")/, `$1${answer}$3`);
  if (updated === block) throw new Error(`Cannot replace answer for id ${id}`);
  return source.slice(0, start) + updated + source.slice(end);
}

const jsFiles = [];
for (const dir of bookDirs) {
  const absDir = path.join(root, dir);
  for (const name of fs.readdirSync(absDir).filter((f) => f.endsWith('.js'))) {
    jsFiles.push(path.join(absDir, name));
  }
}

const beforeByFile = new Map();
const beforeTotals = { questions: 0, answered: 0, missing: 0 };
for (const file of jsFiles) {
  const bank = loadQuestionBank(file);
  beforeByFile.set(file, bank.map((q) => ({ id: q.id, answer: q.answer, protected: cloneProtected(q) })));
  beforeTotals.questions += bank.length;
  beforeTotals.answered += bank.filter((q) => !isEmpty(q.answer)).length;
  beforeTotals.missing += bank.filter((q) => isEmpty(q.answer)).length;
}

const applied = [];
for (const file of jsFiles) {
  const name = path.basename(file);
  let source = fs.readFileSync(file, 'utf8');
  const bank = loadQuestionBank(file);
  for (const q of bank) {
    const key = `${name}#${q.id}`;
    const answer = directAnswers.get(key);
    if (!answer || !isEmpty(q.answer)) continue;
    source = replaceAnswerInObject(source, q.id, answer);
    applied.push({ file: path.relative(root, file), id: q.id, displayNo: q.displayNo, answer });
  }
  if (!verifyOnly && applied.some((row) => path.basename(row.file) === name)) fs.writeFileSync(file, source, 'utf8');
}

const afterTotals = { questions: 0, answered: 0, missing: 0 };
const categories = {
  pure_calculation_or_objective_answer_added: [],
  image_required: [],
  answer_source_remap_required: [],
  content_empty: [],
  final_hold: [],
};
const protectedViolations = [];

for (const file of jsFiles) {
  const bank = loadQuestionBank(file);
  const beforeRows = beforeByFile.get(file);
  afterTotals.questions += bank.length;
  afterTotals.answered += bank.filter((q) => !isEmpty(q.answer)).length;
  afterTotals.missing += bank.filter((q) => isEmpty(q.answer)).length;

  for (const q of bank) {
    const before = beforeRows.find((row) => row.id === q.id);
    for (const field of protectedFields) {
      if (JSON.stringify(before.protected[field]) !== JSON.stringify(q[field])) {
        protectedViolations.push({ file: path.relative(root, file), id: q.id, field });
      }
    }
    if (!isEmpty(q.answer) && isEmpty(before.answer)) {
      categories.pure_calculation_or_objective_answer_added.push({
        file: path.relative(root, file),
        id: q.id,
        displayNo: q.displayNo,
        answer: q.answer,
      });
      continue;
    }
    if (isEmpty(q.answer)) {
      const category = classify(q, false);
      categories[category].push({
        file: path.relative(root, file),
        id: q.id,
        displayNo: q.displayNo,
        contentPreview: String(q.content || '').slice(0, 140),
      });
    }
  }
}

const report = {
  createdAt: new Date().toISOString(),
  scope: '22개정_마플시너지_공통수학1/2 generated JS workbook',
  beforeTotals,
  afterTotals,
  answerIncrease: afterTotals.answered - beforeTotals.answered,
  applied,
  categoryCounts: Object.fromEntries(Object.entries(categories).map(([key, rows]) => [key, rows.length])),
  categories,
  protectedFields,
  protectedViolations,
  status: protectedViolations.length ? 'protected_violation' : 'ok',
};

const reportPath = path.join(
  root,
  'archive/textbook/reports/maple_synergy_manual_review_reclassification_20260526.json',
);
if (!verifyOnly) fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  mode: verifyOnly ? 'verify-only' : 'apply',
  report: path.relative(root, reportPath),
  beforeAnswered: beforeTotals.answered,
  afterAnswered: afterTotals.answered,
  answerIncrease: report.answerIncrease,
  categoryCounts: report.categoryCounts,
  protectedViolations: protectedViolations.length,
}, null, 2));
