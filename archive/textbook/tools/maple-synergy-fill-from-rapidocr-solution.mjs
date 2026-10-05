import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const TEXTBOOK_DIR = path.join(ROOT, 'archive', 'textbook');
const REPORT_DIR = path.join(TEXTBOOK_DIR, 'reports');

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

function walk(dir, predicate = () => true, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function loadQuestionBank(file) {
  const code = fs.readFileSync(file, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(code, context, { filename: file });
  return { code, examTitle: context.window.examTitle || '', questions: context.window.questionBank || [] };
}

function renderArchiveJs(examTitle, questions) {
  return `window.examTitle = ${JSON.stringify(examTitle)};\n\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
}

function cloneProtected(q) {
  const copy = {};
  for (const field of protectedFields) copy[field] = q[field];
  return copy;
}

function bookKeyFromFile(file) {
  if (file.includes('공통수학1')) return 'common1';
  if (file.includes('공통수학2')) return 'common2';
  return 'unknown';
}

function sourceBookDir(file) {
  const marker = `${path.sep}generated${path.sep}js${path.sep}workbook${path.sep}`;
  return file.slice(0, file.indexOf(marker));
}

function questionCropAbs(bookDir, q) {
  if (!q.sourceCropPath) return '';
  const candidate = path.join(bookDir, q.sourceCropPath);
  return fs.existsSync(candidate) ? candidate : '';
}

function findFullPageCandidates(bookDir, pageNo) {
  const page = Number(pageNo);
  if (!Number.isFinite(page)) return [];
  const padded = String(page).padStart(3, '0');
  const review = path.join(bookDir, 'generated', 'review_pack');
  const candidates = walk(review, (file) => {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) return false;
    const base = path.basename(file).toLowerCase();
    const parent = path.basename(path.dirname(file)).toLowerCase();
    const looksFullPage = parent.includes('page_full') || parent.includes('full_page') || base.includes('page_full') || base.includes('_full');
    const looksPage = base.includes(`page${page}`) || base.includes(`p${padded}`) || base.includes(`page_${padded}`) || base.includes(`_${padded}`);
    return looksFullPage && looksPage;
  });
  return candidates.slice(0, 12);
}

function summarize(files) {
  let total = 0;
  let answered = 0;
  let missing = 0;
  let emptyContent = 0;
  for (const file of files) {
    const bank = loadQuestionBank(file);
    total += bank.questions.length;
    answered += bank.questions.filter((q) => String(q.answer || '').trim()).length;
    missing += bank.questions.filter((q) => !String(q.answer || '').trim()).length;
    emptyContent += bank.questions.filter((q) => !String(q.content || '').trim()).length;
  }
  return { total, answered, missing, emptyContent };
}

function countContentImageAndBadPatterns(files) {
  let contentImagePathOrImg = 0;
  let badContentPattern = 0;
  let badAnswerPattern = 0;
  const badAnswers = [];
  for (const file of files) {
    const bank = loadQuestionBank(file);
    for (const q of bank.questions) {
      const content = String(q.content || '');
      const answer = String(q.answer || '');
      if (/<img\b/i.test(content) || /\.(png|jpe?g|webp|gif|svg)/i.test(content)) contentImagePathOrImg += 1;
      if (/[�聽Û]/.test(content) || /\?\?/.test(content)) badContentPattern += 1;
      if (/[�聽Û]/.test(answer) || /\?\?/.test(answer)) {
        badAnswerPattern += 1;
        badAnswers.push({ file: rel(file), id: q.id, displayNo: q.displayNo, answer });
      }
    }
  }
  return { contentImagePathOrImg, badContentPattern, badAnswerPattern, badAnswers };
}

const workbookFiles = walk(TEXTBOOK_DIR, (file) =>
  file.endsWith('.js') &&
  file.includes(`${path.sep}generated${path.sep}js${path.sep}workbook${path.sep}`) &&
  file.includes('22개정_마플시너지_공통수학')
).sort();

const geometryFile = workbookFiles.find((file) => file.includes('공통수학2') && file.includes('도형의 방정식'));
if (!geometryFile) throw new Error('common2 geometry workbook file not found');

const before = summarize(workbookFiles);
const beforeProtectedByFile = new Map();
for (const file of workbookFiles) {
  beforeProtectedByFile.set(file, loadQuestionBank(file).questions.map(cloneProtected));
}

const fills = [
  {
    file: geometryFile,
    id: 5,
    answer: '⑤',
    source_type: 'solution_pdf',
    solutionPdfPage: 2,
    ocrJson: path.join(REPORT_DIR, 'solution_ocr_target_pages', 'p002.json'),
    ocrImage: path.join(REPORT_DIR, 'solution_ocr_target_pages', 'p002.png'),
    evidenceNote: 'Solution OCR page 2 maps 0005 to A(0,2), D(15,8), B(2,2), C(7,8), and final BC=sqrt(61); JS choice 5 is $\\sqrt{61}$.'
  },
  {
    file: geometryFile,
    id: 74,
    answer: '④',
    source_type: 'solution_pdf',
    solutionPdfPage: 26,
    ocrJson: path.join(REPORT_DIR, 'solution_ocr_target_pages', 'p026.json'),
    ocrImage: path.join(REPORT_DIR, 'solution_ocr_target_pages', 'p026.png'),
    evidenceNote: 'Solution OCR page 26 locates 0074 in the same geometry answer block and shows the answer token ④ beside the worked solution; full page/question crop links JS sourcePageNo 20 q0074.'
  },
];

const applied = [];
const skipped = [];
const changed = new Map();

for (const fill of fills) {
  const bank = changed.get(fill.file) || loadQuestionBank(fill.file);
  const index = bank.questions.findIndex((q) => Number(q.id) === fill.id);
  if (index < 0) {
    skipped.push({ id: fill.id, jsFile: rel(fill.file), reason: 'question_not_found' });
    continue;
  }
  const question = bank.questions[index];
  if (String(question.answer || '').trim()) {
    skipped.push({ id: fill.id, jsFile: rel(fill.file), reason: 'answer_already_present', currentAnswer: question.answer });
    continue;
  }
  if (!fs.existsSync(fill.ocrJson) || !fs.existsSync(fill.ocrImage)) {
    skipped.push({ id: fill.id, jsFile: rel(fill.file), reason: 'solution_ocr_evidence_missing', ocrJson: rel(fill.ocrJson), ocrImage: rel(fill.ocrImage) });
    continue;
  }
  if (fill.id === 5 && !(Array.isArray(question.choices) && question.choices[4] && question.choices[4].includes('sqrt{61}'))) {
    skipped.push({ id: fill.id, jsFile: rel(fill.file), reason: 'choices_keyword_crosscheck_failed' });
    continue;
  }

  const bookDir = sourceBookDir(fill.file);
  const fullPageCropCandidates = findFullPageCandidates(bookDir, question.sourcePageNo).map(rel);
  const questionCrop = questionCropAbs(bookDir, question);
  const nextQuestions = [...bank.questions];
  nextQuestions[index] = { ...question, answer: fill.answer };
  changed.set(fill.file, { ...bank, questions: nextQuestions });
  applied.push({
    book: bookKeyFromFile(fill.file),
    jsFile: rel(fill.file),
    id: question.id,
    displayNo: question.displayNo || '',
    sourcePageNo: question.sourcePageNo ?? null,
    answer: fill.answer,
    source_type: fill.source_type,
    crosscheck_type: 'solution_pdf_rapidocr_plus_full_page_question_crop',
    questionCrop: questionCrop ? rel(questionCrop) : question.sourceCropPath || '',
    fullPageCropCandidates,
    solutionPdfPage: fill.solutionPdfPage,
    solutionOcrJson: rel(fill.ocrJson),
    solutionOcrImage: rel(fill.ocrImage),
    contentKeywordSample: String(question.content || '').slice(0, 120),
    choicesKeywordSample: Array.isArray(question.choices) ? question.choices.slice(0, 5) : [],
    evidenceNote: fill.evidenceNote,
  });
}

for (const [file, bank] of changed.entries()) {
  fs.writeFileSync(file, renderArchiveJs(bank.examTitle, bank.questions), 'utf8');
}

const after = summarize(workbookFiles);
const protectedChanges = [];
for (const file of workbookFiles) {
  const beforeQuestions = beforeProtectedByFile.get(file) || [];
  const afterQuestions = loadQuestionBank(file).questions;
  if (beforeQuestions.length !== afterQuestions.length) {
    protectedChanges.push({ file: rel(file), field: 'question_count', before: beforeQuestions.length, after: afterQuestions.length });
  }
  for (let i = 0; i < beforeQuestions.length; i += 1) {
    const beforeQ = beforeQuestions[i];
    const afterQ = afterQuestions[i];
    if (!afterQ) continue;
    for (const field of protectedFields) {
      if (JSON.stringify(beforeQ[field]) !== JSON.stringify(afterQ[field])) {
        protectedChanges.push({ file: rel(file), id: beforeQ.id, field, before: beforeQ[field], after: afterQ[field] });
      }
    }
  }
}

const remaining = [];
for (const file of workbookFiles) {
  const book = bookKeyFromFile(file);
  const bank = loadQuestionBank(file);
  for (const q of bank.questions) {
    if (String(q.answer || '').trim()) continue;
    remaining.push({
      book,
      jsFile: rel(file),
      id: q.id,
      displayNo: q.displayNo || '',
      sourcePageNo: q.sourcePageNo ?? null,
      questionCrop: q.sourceCropPath || '',
      reason: 'final_hold_after_all_sources_checked',
      checkedSources: [
        'quick_answer_table_report/pdf',
        'answer_pdf',
        'solution_pdf_rapidocr',
        'answer_solution_crop_report',
        'answer_solution_crop_images',
        'generated_answer_reports',
        'full_page_crop',
        'question_crop',
      ],
    });
  }
}
const remainingByReason = {};
for (const item of remaining) remainingByReason[item.reason] = (remainingByReason[item.reason] || 0) + 1;

const validationPrecheck = countContentImageAndBadPatterns(workbookFiles);
const report = {
  generatedAt: new Date().toISOString(),
  before,
  after,
  newlyFilled: applied.length,
  usedSources: {
    solutionPdfPageCount: new Set(applied.map((item) => item.solutionPdfPage)).size,
    solutionPdfOcrJsonCount: new Set(applied.map((item) => item.solutionOcrJson)).size,
    fullPageCropUsedCount: applied.filter((item) => item.fullPageCropCandidates.length > 0).length,
    questionCropUsedCount: applied.filter((item) => item.questionCrop).length,
    answerSolutionCropUsedCount: 0,
    generatedAnswerReportsUsedCount: 0,
    directSolveCount: 0,
  },
  applied,
  skipped,
  protectedChanges,
  validationPrecheck,
};

fs.writeFileSync(
  path.join(REPORT_DIR, 'maple_synergy_answer_fill_from_rapidocr_solution_report.json'),
  JSON.stringify(report, null, 2),
  'utf8',
);
fs.writeFileSync(
  path.join(REPORT_DIR, 'maple_synergy_remaining_after_rapidocr_solution_search.json'),
  JSON.stringify({ generatedAt: report.generatedAt, before, after, remainingCount: remaining.length, remainingByReason, remaining }, null, 2),
  'utf8',
);
fs.writeFileSync(
  path.join(REPORT_DIR, 'maple_synergy_rapidocr_solution_protected_scan.json'),
  JSON.stringify({ generatedAt: report.generatedAt, protectedFieldChangeCount: protectedChanges.length, protectedChanges }, null, 2),
  'utf8',
);

console.log(JSON.stringify({
  before,
  after,
  newlyFilled: applied.length,
  protectedFieldChangeCount: protectedChanges.length,
  validationPrecheck,
}, null, 2));
