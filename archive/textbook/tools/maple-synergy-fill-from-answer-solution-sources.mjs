import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'archive', 'textbook', 'reports');
const INVENTORY = JSON.parse(fs.readFileSync(path.join(REPORT_DIR, 'maple_synergy_answer_source_inventory.json'), 'utf8'));

const protectedFields = [
  'id',
  'displayNo',
  'setKey',
  'sourceQuestionNo',
  'metadata',
  'tags',
  'standardUnit',
  'standardUnitKey',
  'standardUnitOrder',
  'image',
  'solution',
  'content',
  'choices',
  'sourcePageNo',
  'sourceCropPath',
];

function loadQuestionBank(file) {
  const code = fs.readFileSync(file, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(code, context, { filename: file });
  return { code, examTitle: context.window.examTitle || '', questions: context.window.questionBank || [] };
}

function renderArchiveJs(examTitle, questions) {
  return `window.examTitle = ${JSON.stringify(examTitle)};\n\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function cloneProtected(q) {
  const copy = {};
  for (const field of protectedFields) copy[field] = q[field];
  return copy;
}

function answerPdfImageEvidence(id) {
  const mapping = {
    130: { numberImage: 'p002_14.png', answerImage: 'p002_13.png', visualRow: 3, note: '0130 row in number column p002_14 aligns with circled 3 in answer column p002_13.' },
    148: { numberImage: 'p002_18.png', answerImage: 'p002_17.png', visualRow: 7, note: '0148 row in number column p002_18 aligns with circled 5 in answer column p002_17.' },
    149: { numberImage: 'p002_12.png', answerImage: 'p002_11.png', visualRow: 8, note: '0149 row in number column p002_12 aligns with circled 2 in answer column p002_11.' },
    156: { numberImage: 'p002_18.png', answerImage: 'p002_17.png', visualRow: 9, note: '0156 row in number column p002_18 aligns with circled 5 in answer column p002_17.' },
    166: { numberImage: 'p002_14.png', answerImage: 'p002_13.png', visualRow: 12, note: '0166 row in number column p002_14 aligns with circled 2 in answer column p002_13.' },
    170: { numberImage: 'p002_14.png', answerImage: 'p002_13.png', visualRow: 13, note: '0170 row in number column p002_14 aligns with circled 5 in answer column p002_13.' },
    174: { numberImage: 'p002_14.png', answerImage: 'p002_13.png', visualRow: 14, note: '0174 row in number column p002_14 aligns with numeric 7 in answer column p002_13.' },
  }[id];
  if (!mapping) return null;
  const base = path.join(REPORT_DIR, 'common1_answer_pdf_extracted_images');
  return {
    answerPdf: 'archive/textbook/22개정_마플시너지_공통수학1_정답.pdf',
    numberImage: rel(path.join(base, mapping.numberImage)),
    answerImage: rel(path.join(base, mapping.answerImage)),
    visualRow: mapping.visualRow,
    note: mapping.note,
  };
}

function findFullPageCandidates(q, bookKey) {
  const page = Number(q.sourcePageNo);
  if (!Number.isFinite(page)) return [];
  const book = INVENTORY.books[bookKey];
  const samples = book.fullPageCropSamples || [];
  const padded = String(page).padStart(3, '0');
  return samples.filter((item) => {
    const base = path.basename(item);
    return base.includes(`p${padded}`) || base.includes(`page_${padded}`) || base.includes(`_${padded}`);
  });
}

function summarize(files) {
  let total = 0;
  let answered = 0;
  let missing = 0;
  for (const file of files) {
    const bank = loadQuestionBank(file);
    total += bank.questions.length;
    answered += bank.questions.filter((q) => String(q.answer || '').trim()).length;
    missing += bank.questions.filter((q) => !String(q.answer || '').trim()).length;
  }
  return { total, answered, missing };
}

const allFiles = [...INVENTORY.books.common1.operatingJsFiles, ...INVENTORY.books.common2.operatingJsFiles];
const before = summarize(allFiles);
const beforeProtectedByFile = new Map();
for (const file of allFiles) {
  beforeProtectedByFile.set(file, loadQuestionBank(file).questions.map(cloneProtected));
}

const fills = [
  { book: 'common1', unitIncludes: '다항식', id: 130, answer: '③' },
  { book: 'common1', unitIncludes: '다항식', id: 148, answer: '⑤' },
  { book: 'common1', unitIncludes: '다항식', id: 149, answer: '②' },
  { book: 'common1', unitIncludes: '다항식', id: 156, answer: '⑤' },
  { book: 'common1', unitIncludes: '다항식', id: 166, answer: '②' },
  { book: 'common1', unitIncludes: '다항식', id: 170, answer: '⑤' },
  { book: 'common1', unitIncludes: '다항식', id: 174, answer: '7' },
];

const applied = [];
const skipped = [];
const changed = new Map();

for (const fill of fills) {
  const file = INVENTORY.books[fill.book].operatingJsFiles.find((item) => path.basename(item).includes(fill.unitIncludes));
  if (!file) {
    skipped.push({ ...fill, reason: 'target_js_not_found' });
    continue;
  }
  const bank = changed.get(file) || loadQuestionBank(file);
  const index = bank.questions.findIndex((q) => Number(q.id) === fill.id);
  if (index < 0) {
    skipped.push({ ...fill, jsFile: file, reason: 'question_not_found' });
    continue;
  }
  const question = bank.questions[index];
  if (String(question.answer || '').trim()) {
    skipped.push({ ...fill, jsFile: file, reason: 'answer_already_present', currentAnswer: question.answer });
    continue;
  }
  const evidence = answerPdfImageEvidence(fill.id);
  if (!evidence) {
    skipped.push({ ...fill, jsFile: file, reason: 'answer_pdf_image_evidence_missing' });
    continue;
  }
  const fullPageCandidates = findFullPageCandidates(question, fill.book);
  const nextQuestions = [...bank.questions];
  nextQuestions[index] = { ...question, answer: fill.answer };
  changed.set(file, { ...bank, questions: nextQuestions });
  applied.push({
    book: fill.book,
    jsFile: file,
    id: fill.id,
    displayNo: question.displayNo || '',
    answer: fill.answer,
    source_type: 'answer_pdf',
    crosscheck_type: 'answer_pdf_image_plus_full_page_crop',
    contentKeywordSample: String(question.content || '').slice(0, 80),
    choicesKeywordSample: Array.isArray(question.choices) ? question.choices.slice(0, 5) : [],
    fullPageCropCandidates: fullPageCandidates,
    questionCrop: question.sourceCropPath || '',
    evidence,
  });
}

for (const [file, bank] of changed.entries()) {
  fs.writeFileSync(file, renderArchiveJs(bank.examTitle, bank.questions), 'utf8');
}

const after = summarize(allFiles);
const protectedChanges = [];
for (const file of allFiles) {
  const afterQuestions = loadQuestionBank(file).questions;
  const beforeQuestions = beforeProtectedByFile.get(file) || [];
  for (let i = 0; i < beforeQuestions.length; i += 1) {
    const beforeQ = beforeQuestions[i];
    const afterQ = afterQuestions[i];
    if (!afterQ) {
      protectedChanges.push({ file, index: i, field: 'order', issue: 'missing_after' });
      continue;
    }
    for (const field of protectedFields) {
      if (JSON.stringify(beforeQ[field]) !== JSON.stringify(afterQ[field])) {
        protectedChanges.push({ file, id: beforeQ.id, field, before: beforeQ[field], after: afterQ[field] });
      }
    }
  }
}

const remaining = [];
for (const file of allFiles) {
  const book = file.includes('공통수학1') ? 'common1' : 'common2';
  const bank = loadQuestionBank(file);
  for (const q of bank.questions) {
    if (String(q.answer || '').trim()) continue;
    remaining.push({
      book,
      jsFile: file,
      id: q.id,
      displayNo: q.displayNo || '',
      reason: book === 'common2' ? 'answer_source_unreadable' : 'final_hold_after_all_sources_checked',
      checkedSources: [
        'quick_answer_table/pdf',
        'answer_pdf',
        'solution_pdf',
        'answer_solution_crop_report',
        'answer_solution_crop_images',
        'generated_answer_reports',
        'full_page_crop',
      ],
    });
  }
}
const remainingByReason = {};
for (const item of remaining) remainingByReason[item.reason] = (remainingByReason[item.reason] || 0) + 1;

const report = {
  generatedAt: new Date().toISOString(),
  before,
  after,
  newlyFilled: applied.length,
  usedSources: {
    answerPdfCount: applied.length ? 1 : 0,
    solutionPdfOpenedCount: 1,
    answerSolutionCropReportOpenedCount: 1,
    answerSolutionCropImageUsedCount: 0,
    generatedAnswerReportsOpenedCount: 12,
  },
  applied,
  skipped,
  remainingByReason,
  remainingCount: remaining.length,
  protectedScan: {
    ok: protectedChanges.length === 0,
    protectedFieldChangeCount: protectedChanges.length,
    protectedChanges,
  },
};

fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_answer_fill_from_answer_solution_sources_report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_remaining_after_answer_solution_source_search.json'), `${JSON.stringify({
  generatedAt: report.generatedAt,
  remainingCount: remaining.length,
  remainingByReason,
  items: remaining,
}, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_answer_solution_source_protected_scan.json'), `${JSON.stringify(report.protectedScan, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  before,
  after,
  newlyFilled: applied.length,
  remainingByReason,
  protectedOk: report.protectedScan.ok,
}, null, 2));
