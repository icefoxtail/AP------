import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const TEXTBOOK_DIR = path.join(ROOT, 'archive', 'textbook');
const REPORT_DIR = path.join(TEXTBOOK_DIR, 'reports');

const protectedFields = [
  'id', 'displayNo', 'setKey', 'sourceQuestionNo', 'metadata', 'tags',
  'standardUnit', 'standardUnitKey', 'standardUnitOrder', 'image', 'solution',
  'content', 'choices', 'sourcePageNo', 'sourceCropPath',
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
  for (const key of protectedFields) out[key] = q[key];
  return out;
}

function sourceBookDir(file) {
  const marker = `${path.sep}generated${path.sep}js${path.sep}workbook${path.sep}`;
  return file.slice(0, file.indexOf(marker));
}

function findFullPage(bookDir, pageNo) {
  const page = Number(pageNo);
  if (!Number.isFinite(page)) return [];
  const padded = String(page).padStart(3, '0');
  const review = path.join(bookDir, 'generated', 'review_pack');
  return walk(review, (file) => {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) return false;
    const base = path.basename(file).toLowerCase();
    const parent = path.basename(path.dirname(file)).toLowerCase();
    return parent.includes('page_full_images') && (base.includes(`p${padded}`) || base.includes(`page${page}`));
  }).slice(0, 5).map(rel);
}

function summarize(files) {
  let total = 0;
  let answered = 0;
  let missing = 0;
  for (const file of files) {
    const bank = loadBank(file);
    total += bank.questions.length;
    for (const q of bank.questions) {
      if (String(q.answer || '').trim()) answered += 1;
      else missing += 1;
    }
  }
  return { total, answered, missing };
}

function validationScan(files) {
  let contentImagePathOrImg = 0;
  let badContentPattern = 0;
  let badAnswerPattern = 0;
  const badAnswers = [];
  for (const file of files) {
    const bank = loadBank(file);
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

const workbookFiles = [
  ...walk(path.join(TEXTBOOK_DIR, '22개정_마플시너지_공통수학1', 'generated', 'js', 'workbook'), (file) => file.endsWith('.js')),
  ...walk(path.join(TEXTBOOK_DIR, '22개정_마플시너지_공통수학2', 'generated', 'js', 'workbook'), (file) => file.endsWith('.js')),
].sort();

const geometryFile = workbookFiles.find((file) => file.includes('공통수학2') && file.includes('도형의 방정식'));
if (!geometryFile) throw new Error('common2 geometry workbook file not found');

const fills = [
  { id: 71, answer: '\u2460', page: 25, note: 'Solution page image p025 shows displayNo 0071 with 정답 ①.' },
  { id: 73, answer: '\u2460', page: 26, note: 'Solution page image p026 shows displayNo 0073 with 정답 ①.' },
  { id: 77, answer: '\u2464', page: 27, note: 'Solution page image p027 shows displayNo 0077 with 정답 ⑤.' },
  { id: 124, answer: '\u2463', page: 50, note: 'Solution page image p050 shows displayNo 0124 with 정답 ④.' },
  { id: 155, answer: '\u2463', page: 61, note: 'Solution page image p061 shows displayNo 0155 with 정답 ④.' },
  { id: 156, answer: '\u2460', page: 62, note: 'Solution page image p062 shows displayNo 0156 with 정답 ①.' },
  { id: 158, answer: '\u2461', page: 63, note: 'Solution page image p063 shows displayNo 0158 with 정답 ②.' },
  { id: 159, answer: '\u2462', page: 64, note: 'Solution page image p064 shows displayNo 0159 with 정답 ③.' },
  { id: 160, answer: '\u2461', page: 64, note: 'Solution page image p064 shows displayNo 0160 with 정답 ②.' },
  { id: 162, answer: '\u2461', page: 66, note: 'Solution page image p066 shows displayNo 0162 with 정답 ②.' },
  { id: 186, answer: '\u2460', page: 73, note: 'Solution page image p073 shows displayNo 0186 with 정답 ①.' },
  { id: 193, answer: '\u2460', page: 76, note: 'Solution page image p076 shows displayNo 0193 with 정답 ①.' },
  { id: 210, answer: '\u2460', page: 84, note: 'Solution page image p084 shows displayNo 0210 with 정답 ①.' },
  { id: 216, answer: '\u2460', page: 86, note: 'Solution page image p086 shows displayNo 0216 with 정답 ①.' },
  { id: 222, answer: '\u2461', page: 89, note: 'Solution page image p089 shows displayNo 0222 with 정답 ②.' },
  { id: 224, answer: '\u2460', page: 90, note: 'Solution page image p090 shows displayNo 0224 with 정답 ①.' },
  { id: 240, answer: '\u2462', page: 96, note: 'Solution page image p096 shows displayNo 0240 with 정답 ③.' },
  { id: 250, answer: '\u2460', page: 102, note: 'Solution page image p102 shows displayNo 0250 with 정답 ①.' },
  { id: 267, answer: '\u2460', page: 110, note: 'Solution page image p110 shows displayNo 0267 with 정답 ①.' },
  { id: 271, answer: '\u2461', page: 112, note: 'Solution page image p112 shows displayNo 0271 with 정답 ②.' },
  { id: 275, answer: '\u2462', page: 114, note: 'Solution page image p114 shows displayNo 0275 with 정답 ③.' },
  { id: 327, answer: '\u2460', page: 136, note: 'Solution page image p136 shows displayNo 0327 with 정답 ①.' },
];

const before = summarize(workbookFiles);
const beforeProtected = new Map(workbookFiles.map((file) => [file, loadBank(file).questions.map(cloneProtected)]));
const bank = loadBank(geometryFile);
const bookDir = sourceBookDir(geometryFile);
const applied = [];
const skipped = [];

for (const fill of fills) {
  const index = bank.questions.findIndex((q) => Number(q.id) === fill.id);
  if (index < 0) {
    skipped.push({ id: fill.id, reason: 'question_not_found' });
    continue;
  }
  const q = bank.questions[index];
  if (String(q.answer || '').trim()) {
    skipped.push({ id: fill.id, displayNo: q.displayNo, reason: 'answer_already_present', currentAnswer: q.answer });
    continue;
  }
  const pageStem = `p${String(fill.page).padStart(3, '0')}`;
  const evidenceDirs = [
    path.join(REPORT_DIR, 'solution_ocr_target_pages'),
    path.join(REPORT_DIR, 'solution_ocr_expanded_pages'),
  ];
  const evidenceDir = evidenceDirs.find((dir) => fs.existsSync(path.join(dir, `${pageStem}.png`)) && fs.existsSync(path.join(dir, `${pageStem}.json`)));
  const ocrImage = evidenceDir ? path.join(evidenceDir, `${pageStem}.png`) : path.join(evidenceDirs[0], `${pageStem}.png`);
  const ocrJson = evidenceDir ? path.join(evidenceDir, `${pageStem}.json`) : path.join(evidenceDirs[0], `${pageStem}.json`);
  if (!fs.existsSync(ocrImage) || !fs.existsSync(ocrJson)) {
    skipped.push({ id: fill.id, displayNo: q.displayNo, reason: 'solution_page_evidence_missing' });
    continue;
  }
  bank.questions[index] = { ...q, answer: fill.answer };
  applied.push({
    book: 'common2',
    jsFile: rel(geometryFile),
    id: q.id,
    displayNo: q.displayNo,
    sourcePageNo: q.sourcePageNo,
    answer: fill.answer,
    source_type: 'solution_pdf',
    crosscheck_type: 'solution_page_image_plus_rapidocr_plus_full_page_question_crop',
    solutionPdfPage: fill.page,
    solutionOcrImage: rel(ocrImage),
    solutionOcrJson: rel(ocrJson),
    questionCrop: q.sourceCropPath || '',
    fullPageCropCandidates: findFullPage(bookDir, q.sourcePageNo),
    contentKeywordSample: String(q.content || '').slice(0, 120),
    choicesKeywordSample: Array.isArray(q.choices) ? q.choices.slice(0, 5) : [],
    evidenceNote: fill.note,
  });
}

if (applied.length) {
  fs.writeFileSync(geometryFile, renderBank(bank.examTitle, bank.questions), 'utf8');
}

const after = summarize(workbookFiles);
const protectedChanges = [];
for (const file of workbookFiles) {
  const beforeQs = beforeProtected.get(file) || [];
  const afterQs = loadBank(file).questions;
  for (let i = 0; i < beforeQs.length; i += 1) {
    const b = beforeQs[i];
    const a = afterQs[i];
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
  const b = loadBank(file);
  for (const q of b.questions) {
    if (String(q.answer || '').trim()) continue;
    remaining.push({
      jsFile: rel(file),
      id: q.id,
      displayNo: q.displayNo,
      sourcePageNo: q.sourcePageNo,
      reason: 'final_hold_after_all_sources_checked',
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
    solutionPdfPageCount: new Set(applied.map((item) => item.solutionPdfPage)).size,
    fullPageCropUsedCount: applied.filter((item) => item.fullPageCropCandidates.length).length,
    questionCropUsedCount: applied.filter((item) => item.questionCrop).length,
    answerSolutionCropUsedCount: 0,
    directSolveCount: 0,
  },
  applied,
  skipped,
  protectedChanges,
  validationPrecheck: validationScan(workbookFiles),
};

fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_confirmed_solution_page_answer_fill_report.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_remaining_after_confirmed_solution_pages.json'), JSON.stringify({
  generatedAt: report.generatedAt,
  before,
  after,
  remainingCount: remaining.length,
  remainingByReason,
  remaining,
}, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_confirmed_solution_page_protected_scan.json'), JSON.stringify({
  generatedAt: report.generatedAt,
  protectedFieldChangeCount: protectedChanges.length,
  protectedChanges,
}, null, 2), 'utf8');

console.log(JSON.stringify({
  before,
  after,
  newlyFilled: applied.length,
  protectedFieldChangeCount: protectedChanges.length,
  validationPrecheck: report.validationPrecheck,
  skipped,
}, null, 2));
