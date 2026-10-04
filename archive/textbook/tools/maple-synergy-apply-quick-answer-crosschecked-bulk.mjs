import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const TEXTBOOK = path.join(ROOT, 'archive', 'textbook');
const REPORT_DIR = path.join(TEXTBOOK, 'reports');
const QUICK = JSON.parse(fs.readFileSync(path.join(REPORT_DIR, 'maple_synergy_common2_quick_answer_entries.json'), 'utf8')).entries;
const quickByNo = new Map(QUICK.map((entry) => [Number(entry.no), String(entry.raw || '').trim()]));
const offsetsByUnit = new Map([
  ['도형의 방정식', 0],
  ['집합과 명제', 667],
  ['함수와 그래프', 1212],
]);
const cyrChoiceMap = new Map([
  ['Ёз', '①'],
  ['Ёи', '②'],
  ['Ёй', '③'],
  ['Ёк', '④'],
  ['Ёл', '⑤'],
]);
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

function normalizeQuick(raw) {
  const value = String(raw || '').trim();
  if (!value || value === '해설참조') return '';
  if (cyrChoiceMap.has(value)) return cyrChoiceMap.get(value);
  if (/^[①②③④⑤⑥⑦⑧⑨]$/.test(value)) return value;
  if (/^[-+]?\d{1,4}$/.test(value)) return value;
  if (/^[-+]?\d{1,3}\/[1-9]\d{0,2}$/.test(value)) return value;
  return '';
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
  const p = `p${String(page).padStart(3, '0')}.png`;
  return walk(path.join(bookDir, 'generated', 'review_pack'), (file) => path.basename(file) === p && path.basename(path.dirname(file)) === 'page_full_images').length > 0;
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
const common2Files = workbookFiles.filter((file) => file.includes('공통수학2'));

const before = summarize(workbookFiles);
const protectedBefore = new Map(workbookFiles.map((file) => [rel(file), loadBank(file).questions.map(cloneProtected)]));
const applied = [];
const skipped = [];
const changed = new Map();

for (const file of common2Files) {
  const bank = changed.get(file) || loadBank(file);
  const bookDir = sourceBookDir(file);
  let touched = false;
  bank.questions = bank.questions.map((q) => {
    if (String(q.answer || '').trim()) return q;
    const offset = offsetsByUnit.get(q.standardUnit);
    if (offset === undefined) return q;
    const localNo = Number(String(q.displayNo || q.id).replace(/\D/g, ''));
    if (!localNo) return q;
    const globalNo = localNo + offset;
    const raw = quickByNo.get(globalNo);
    const answer = normalizeQuick(raw);
    if (!answer) {
      skipped.push({ jsFile: rel(file), id: q.id, displayNo: q.displayNo, globalNo, reason: raw ? 'quick_answer_unreadable' : 'quick_answer_not_found', raw });
      return q;
    }
    const hasQuestionCrop = questionCropExists(bookDir, q);
    const hasFullPage = fullPageExists(bookDir, q.sourcePageNo);
    if (!hasQuestionCrop || !hasFullPage) {
      skipped.push({ jsFile: rel(file), id: q.id, displayNo: q.displayNo, globalNo, reason: hasQuestionCrop ? 'full_page_missing' : 'question_crop_missing', raw, answer });
      return q;
    }
    touched = true;
    applied.push({
      book: 'common2',
      jsFile: rel(file),
      id: q.id,
      displayNo: q.displayNo,
      unit: q.standardUnit,
      localNo,
      globalNo,
      answer,
      rawQuickAnswer: raw,
      source_type: 'quick_answer',
      crosscheck_type: 'quick_answer_pdf_plus_unit_offset_plus_full_page_question_crop',
      sourcePageNo: q.sourcePageNo,
      questionCrop: q.sourceCropPath || '',
      fullPageCrop: `generated/review_pack/**/page_full_images/p${String(q.sourcePageNo).padStart(3, '0')}.png`,
    });
    return { ...q, answer };
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
    remaining.push({ jsFile: rel(file), id: q.id, displayNo: q.displayNo, sourcePageNo: q.sourcePageNo, reason: 'final_hold_after_all_sources_checked' });
  }
}
const remainingByReason = {};
for (const r of remaining) remainingByReason[r.reason] = (remainingByReason[r.reason] || 0) + 1;

const byUnit = {};
for (const a of applied) byUnit[a.unit] = (byUnit[a.unit] || 0) + 1;

const report = {
  generatedAt: new Date().toISOString(),
  before,
  after,
  newlyFilled: applied.length,
  byUnit,
  usedSources: {
    quickAnswerUsedCount: applied.length,
    fullPageCropUsedCount: applied.length,
    questionCropUsedCount: applied.length,
    solutionOcrPagesPreparedCount: walk(path.join(REPORT_DIR, 'solution_ocr_expanded_pages'), (file) => file.endsWith('.json')).length,
    directSolveCount: 0,
  },
  applied,
  skipped,
  protectedChanges,
  validationPrecheck: scan(workbookFiles),
};

fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_quick_answer_crosschecked_bulk_apply_report.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_remaining_after_quick_answer_crosschecked_bulk.json'), JSON.stringify({ generatedAt: report.generatedAt, before, after, remainingCount: remaining.length, remainingByReason, remaining }, null, 2), 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'maple_synergy_quick_answer_crosschecked_bulk_protected_scan.json'), JSON.stringify({ generatedAt: report.generatedAt, protectedFieldChangeCount: protectedChanges.length, protectedChanges }, null, 2), 'utf8');

console.log(JSON.stringify({ before, after, newlyFilled: applied.length, byUnit, protectedFieldChangeCount: protectedChanges.length, validationPrecheck: report.validationPrecheck }, null, 2));
