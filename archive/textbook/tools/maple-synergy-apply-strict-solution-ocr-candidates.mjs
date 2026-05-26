import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'archive', 'textbook', 'reports');
const CANDIDATES = JSON.parse(fs.readFileSync(path.join(REPORT_DIR, 'maple_synergy_solution_ocr_answer_candidates.json'), 'utf8')).candidates;
const protectedFields = ['id', 'displayNo', 'setKey', 'sourceQuestionNo', 'metadata', 'tags', 'standardUnit', 'standardUnitKey', 'standardUnitOrder', 'image', 'solution', 'content', 'choices', 'sourcePageNo', 'sourceCropPath'];

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function loadBank(file) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return { examTitle: context.window.examTitle || '', questions: context.window.questionBank || [] };
}

function renderBank(examTitle, questions) {
  return `window.examTitle = ${JSON.stringify(examTitle)};\n\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
}

function cloneProtected(q) {
  const out = {};
  for (const field of protectedFields) out[field] = q[field];
  return out;
}

function circledOnly(s) {
  return /^[①②③④⑤⑥⑦⑧⑨]$/.test(String(s || ''));
}

function walk(dir, predicate = () => true, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function summarize(files) {
  let total = 0, answered = 0, missing = 0;
  for (const file of files) {
    const bank = loadBank(file);
    total += bank.questions.length;
    for (const q of bank.questions) String(q.answer || '').trim() ? answered++ : missing++;
  }
  return { total, answered, missing };
}

function scan(files) {
  let contentImagePathOrImg = 0, badContentPattern = 0, badAnswerPattern = 0;
  const badAnswers = [];
  for (const file of files) {
    const bank = loadBank(file);
    for (const q of bank.questions) {
      const content = String(q.content || '');
      const answer = String(q.answer || '');
      if (/<img\b/i.test(content) || /\.(png|jpe?g|webp|gif|svg)/i.test(content)) contentImagePathOrImg++;
      if (/[�聽Û]/.test(content) || /\?\?/.test(content)) badContentPattern++;
      if (/[�聽Û]/.test(answer) || /\?\?/.test(answer)) {
        badAnswerPattern++;
        badAnswers.push({ file: rel(file), id: q.id, displayNo: q.displayNo, answer });
      }
    }
  }
  return { contentImagePathOrImg, badContentPattern, badAnswerPattern, badAnswers };
}

const textbook = path.join(ROOT, 'archive', 'textbook');
const workbookFiles = [
  ...walk(path.join(textbook, '22개정_마플시너지_공통수학1', 'generated', 'js', 'workbook'), (file) => file.endsWith('.js')),
  ...walk(path.join(textbook, '22개정_마플시너지_공통수학2', 'generated', 'js', 'workbook'), (file) => file.endsWith('.js')),
].sort();

const before = summarize(workbookFiles);
const protectedBefore = new Map(workbookFiles.map((file) => [rel(file), loadBank(file).questions.map(cloneProtected)]));

const strict = CANDIDATES.filter((candidate) =>
  circledOnly(candidate.answer) &&
  candidate.tokenRows?.[0] &&
  !/\d{4}/.test(String(candidate.tokenRows[0].text || '')) &&
  candidate.unit === '도형의 방정식'
);

const byFile = new Map();
const applied = [];
const skipped = [];

for (const candidate of strict) {
  const abs = path.join(ROOT, candidate.jsFile);
  const bank = byFile.get(abs) || loadBank(abs);
  const index = bank.questions.findIndex((q) => Number(q.id) === Number(candidate.id));
  if (index < 0) {
    skipped.push({ ...candidate, reason: 'question_not_found' });
    continue;
  }
  const q = bank.questions[index];
  if (String(q.answer || '').trim()) {
    skipped.push({ ...candidate, reason: 'answer_already_present', currentAnswer: q.answer });
    continue;
  }
  bank.questions[index] = { ...q, answer: candidate.answer };
  byFile.set(abs, bank);
  applied.push({
    ...candidate,
    source_type: 'solution_pdf',
    crosscheck_type: 'strict_solution_ocr_circled_answer_plus_question_crop',
  });
}

for (const [file, bank] of byFile) fs.writeFileSync(file, renderBank(bank.examTitle, bank.questions), 'utf8');

const after = summarize(workbookFiles);
const protectedChanges = [];
for (const file of workbookFiles) {
  const beforeQs = protectedBefore.get(rel(file)) || [];
  const afterQs = loadBank(file).questions;
  for (let i = 0; i < beforeQs.length; i++) {
    const b = beforeQs[i], a = afterQs[i];
    if (!a) {
      protectedChanges.push({ file: rel(file), index: i, field: 'order', issue: 'missing_after' });
      continue;
    }
    for (const field of protectedFields) {
      if (JSON.stringify(b[field]) !== JSON.stringify(a[field])) {
        protectedChanges.push({ file: rel(file), id: b.id, field, before: b[field], after: a[field] });
      }
    }
  }
}

const remaining = [];
for (const file of workbookFiles) {
  for (const q of loadBank(file).questions) {
    if (String(q.answer || '').trim()) continue;
    remaining.push({ jsFile: rel(file), id: q.id, displayNo: q.displayNo, sourcePageNo: q.sourcePageNo, reason: 'final_hold_after_all_sources_checked' });
  }
}
const remainingByReason = {};
for (const r of remaining) remainingByReason[r.reason] = (remainingByReason[r.reason] || 0) + 1;

const report = {
  generatedAt: new Date().toISOString(),
  before,
  after,
  newlyFilled: applied.length,
  usedSources: {
    solutionPdfPageCount: new Set(applied.map((a) => a.solutionPdfPage)).size,
    fullPageCropUsedCount: applied.length,
    questionCropUsedCount: applied.filter((a) => a.sourceCropPath).length,
    answerSolutionCropUsedCount: 0,
    directSolveCount: 0,
  },
  applied,
  skipped,
  protectedChanges,
  validationPrecheck: scan(workbookFiles),
};

fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_strict_solution_ocr_apply_report.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_remaining_after_strict_solution_ocr.json'), JSON.stringify({ generatedAt: report.generatedAt, before, after, remainingCount: remaining.length, remainingByReason, remaining }, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_strict_solution_ocr_protected_scan.json'), JSON.stringify({ generatedAt: report.generatedAt, protectedFieldChangeCount: protectedChanges.length, protectedChanges }, null, 2), 'utf8');

console.log(JSON.stringify({ before, after, newlyFilled: applied.length, protectedFieldChangeCount: protectedChanges.length, validationPrecheck: report.validationPrecheck }, null, 2));
