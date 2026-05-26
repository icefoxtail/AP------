import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const TEXTBOOK = path.join(ROOT, 'archive', 'textbook');
const REPORT_DIR = path.join(TEXTBOOK, 'reports');
const OCR_DIR = path.join(REPORT_DIR, 'common1_answer_pdf_rapidocr_pages');
const protectedFields = ['id', 'displayNo', 'setKey', 'sourceQuestionNo', 'metadata', 'tags', 'standardUnit', 'standardUnitKey', 'standardUnitOrder', 'image', 'solution', 'content', 'choices', 'sourcePageNo', 'sourceCropPath'];

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
  for (const field of protectedFields) out[field] = q[field];
  return out;
}

function circled(text) {
  return [...String(text || '')].find((ch) => {
    const code = ch.codePointAt(0);
    return code >= 0x2460 && code <= 0x2468;
  }) || '';
}

function normalizeAnswer(raw) {
  const text = String(raw || '').trim();
  if (!text || text.includes('해설')) return '';
  const c = circled(text);
  if (c) return c;
  const cleaned = text.replace(/[^\d+\-/]/g, '');
  if (/^[-+]?\d{1,4}$/.test(cleaned)) return cleaned;
  if (/^[-+]?\d{1,3}\/[1-9]\d{0,2}$/.test(cleaned)) return cleaned;
  return '';
}

function questionNos(text) {
  const out = [];
  for (const match of String(text || '').matchAll(/\b(0\d{3})\b/g)) out.push(match[1]);
  return out;
}

function buildAnswerMap() {
  const entries = new Map();
  const evidence = [];
  const files = walk(OCR_DIR, (file) => /^p\d+\.json$/.test(path.basename(file))).sort();
  for (const file of files) {
    const page = JSON.parse(fs.readFileSync(file, 'utf8'));
    const rows = page.rows || [];
    for (const row of rows) {
      for (const no of questionNos(row.text)) {
        const noX = row.x + (String(row.text).indexOf(no) > 0 ? row.w * 0.5 : 0);
        const nearby = rows
          .filter((candidate) => Math.abs(candidate.y - row.y) <= 13 && candidate.x > noX + 28 && candidate.x < noX + 95)
          .sort((a, b) => a.x - b.x);
        const answerRow = nearby.find((candidate) => normalizeAnswer(candidate.text));
        if (!answerRow) continue;
        const answer = normalizeAnswer(answerRow.text);
        if (!answer) continue;
        if (!entries.has(no)) {
          entries.set(no, { no, answer, page: page.page, answerText: answerRow.text, noText: row.text, noX: Math.round(noX), answerX: Math.round(answerRow.x), y: Math.round(row.y) });
        }
        evidence.push({ no, answer, page: page.page, noText: row.text, answerText: answerRow.text, x: Math.round(noX), y: Math.round(row.y) });
      }
    }
  }
  return { entries, evidence };
}

function sourceBookDir(file) {
  const marker = `${path.sep}generated${path.sep}js${path.sep}workbook${path.sep}`;
  return file.slice(0, file.indexOf(marker));
}

function questionCropExists(bookDir, q) {
  return Boolean(q.sourceCropPath && fs.existsSync(path.join(bookDir, q.sourceCropPath)));
}

function fullPageExists(bookDir, sourcePageNo) {
  const page = Number(sourcePageNo);
  if (!Number.isFinite(page)) return false;
  const name = `p${String(page).padStart(3, '0')}.png`;
  return walk(path.join(bookDir, 'generated', 'review_pack'), (file) => path.basename(file) === name && path.basename(path.dirname(file)) === 'page_full_images').length > 0;
}

function summarize(files) {
  let total = 0, answered = 0, missing = 0;
  for (const file of files) {
    for (const q of loadBank(file).questions) {
      total++;
      String(q.answer || '').trim() ? answered++ : missing++;
    }
  }
  return { total, answered, missing };
}

function scan(files) {
  let contentImagePathOrImg = 0, badContentPattern = 0, badAnswerPattern = 0;
  const badAnswers = [];
  for (const file of files) {
    for (const q of loadBank(file).questions) {
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

const workbookFiles = [
  ...walk(path.join(TEXTBOOK, '22개정_마플시너지_공통수학1', 'generated', 'js', 'workbook'), (file) => file.endsWith('.js')),
  ...walk(path.join(TEXTBOOK, '22개정_마플시너지_공통수학2', 'generated', 'js', 'workbook'), (file) => file.endsWith('.js')),
].sort();
const common1Files = workbookFiles.filter((file) => file.includes('공통수학1'));

const { entries, evidence } = buildAnswerMap();
const before = summarize(workbookFiles);
const protectedBefore = new Map(workbookFiles.map((file) => [rel(file), loadBank(file).questions.map(cloneProtected)]));
const changed = new Map();
const applied = [];
const skipped = [];

for (const file of common1Files) {
  const bank = loadBank(file);
  const bookDir = sourceBookDir(file);
  let touched = false;
  bank.questions = bank.questions.map((q) => {
    if (String(q.answer || '').trim()) return q;
    const no = String(q.displayNo || '').padStart(4, '0');
    const entry = entries.get(no);
    if (!entry) {
      skipped.push({ jsFile: rel(file), id: q.id, displayNo: q.displayNo, reason: 'answer_ocr_entry_not_found' });
      return q;
    }
    const hasQuestionCrop = questionCropExists(bookDir, q);
    const hasFullPage = fullPageExists(bookDir, q.sourcePageNo);
    if (!hasQuestionCrop || !hasFullPage) {
      skipped.push({ jsFile: rel(file), id: q.id, displayNo: q.displayNo, reason: hasQuestionCrop ? 'full_page_missing' : 'question_crop_missing', answer: entry.answer });
      return q;
    }
    touched = true;
    applied.push({
      book: 'common1',
      jsFile: rel(file),
      id: q.id,
      displayNo: q.displayNo,
      unit: q.standardUnit,
      sourcePageNo: q.sourcePageNo,
      answer: entry.answer,
      source_type: 'answer_pdf_ocr',
      crosscheck_type: 'answer_pdf_rapidocr_table_plus_full_page_question_crop',
      answerPdfPage: entry.page,
      rawAnswerText: entry.answerText,
      questionCrop: q.sourceCropPath || '',
      fullPageCrop: `generated/review_pack/**/page_full_images/p${String(q.sourcePageNo).padStart(3, '0')}.png`,
    });
    return { ...q, answer: entry.answer };
  });
  if (touched) changed.set(file, bank);
}

for (const [file, bank] of changed) fs.writeFileSync(file, renderBank(bank.examTitle, bank.questions), 'utf8');

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
    remaining.push({ jsFile: rel(file), id: q.id, displayNo: q.displayNo, unit: q.standardUnit, sourcePageNo: q.sourcePageNo, reason: 'final_hold_after_all_sources_checked' });
  }
}
const remainingByReason = {};
const remainingByUnit = {};
for (const r of remaining) {
  remainingByReason[r.reason] = (remainingByReason[r.reason] || 0) + 1;
  remainingByUnit[r.unit] = (remainingByUnit[r.unit] || 0) + 1;
}
const byUnit = {};
for (const a of applied) byUnit[a.unit] = (byUnit[a.unit] || 0) + 1;

const report = {
  generatedAt: new Date().toISOString(),
  answerMapCount: entries.size,
  evidenceCount: evidence.length,
  before,
  after,
  newlyFilled: applied.length,
  byUnit,
  usedSources: {
    answerPdfOcrPageCount: walk(OCR_DIR, (file) => /^p\d+\.json$/.test(path.basename(file))).length,
    answerPdfOcrUsedCount: applied.length,
    fullPageCropUsedCount: applied.length,
    questionCropUsedCount: applied.length,
    directSolveCount: 0,
  },
  applied,
  skipped,
  protectedChanges,
  validationPrecheck: scan(workbookFiles),
};

fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_common1_answer_pdf_ocr_apply_report.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_common1_answer_pdf_ocr_candidates.json'), JSON.stringify({ generatedAt: report.generatedAt, answerMapCount: entries.size, evidence }, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_remaining_after_common1_answer_pdf_ocr.json'), JSON.stringify({ generatedAt: report.generatedAt, before, after, remainingCount: remaining.length, remainingByReason, remainingByUnit, remaining }, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_common1_answer_pdf_ocr_protected_scan.json'), JSON.stringify({ generatedAt: report.generatedAt, protectedFieldChangeCount: protectedChanges.length, protectedChanges }, null, 2), 'utf8');

console.log(JSON.stringify({ before, after, newlyFilled: applied.length, byUnit, protectedFieldChangeCount: protectedChanges.length, validationPrecheck: report.validationPrecheck, skippedCount: skipped.length }, null, 2));
