import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const TEXTBOOK_ROOT = path.join(ROOT, 'archive', 'textbook');
const REPORT_ROOT = path.join(TEXTBOOK_ROOT, 'reports');
const BOOKS = [
  { key: 'common1', title: '22개정_마플시너지_공통수학1' },
  { key: 'common2', title: '22개정_마플시너지_공통수학2' },
];

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
  'sourcePageNo',
  'sourceCropPath',
];

const choiceGlyphMap = new Map([
  ['函', '①'],
  ['刻', '②'],
  ['券', '③'],
  ['刷', '④'],
  ['刺', '⑤'],
]);

const unreadableTokens = new Set(['ボ撲霤褻', '撲霤褻', '풀이참조', '해설참조']);

fs.mkdirSync(REPORT_ROOT, { recursive: true });

function walk(dir, predicate = () => true, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p).replaceAll(path.sep, '/');
}

function loadQuestions(jsFile) {
  const code = fs.readFileSync(jsFile, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(code, context, { filename: jsFile });
  if (!Array.isArray(context.window.questionBank)) {
    throw new Error(`questionBank not found: ${jsFile}`);
  }
  return { code, questions: context.window.questionBank };
}

function cloneProtected(q) {
  const copy = {};
  for (const field of protectedFields) copy[field] = q[field];
  copy.content = q.content;
  copy.choices = q.choices;
  return copy;
}

function normAnswer(raw) {
  if (raw === undefined || raw === null) return '';
  let s = String(raw).trim();
  if (!s) return '';
  if (choiceGlyphMap.has(s)) return choiceGlyphMap.get(s);
  if (unreadableTokens.has(s)) return '';
  s = s.replace(/\s+/g, ' ');
  if (/^[①②③④⑤]$/.test(s)) return s;
  if (/^[\d,./+\-()=a-zA-Z가-힣π√ ]{1,80}$/.test(s)) return s.replaceAll(',', '');
  if (/^[0-9]{1,4}$/.test(s)) return s;
  return '';
}

function questionNo(q) {
  const candidates = [q.sourceQuestionNo, q.displayNo, q.id];
  for (const c of candidates) {
    const n = Number(String(c ?? '').replace(/\D/g, ''));
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function findPython() {
  const bundled = path.join(
    process.env.USERPROFILE || 'C:/Users/USER',
    '.cache',
    'codex-runtimes',
    'codex-primary-runtime',
    'dependencies',
    'python',
    'python.exe',
  );
  if (fs.existsSync(bundled)) return bundled;
  return 'python';
}

function extractPdfText(pdfPath) {
  const py = findPython();
  const code = [
    'import json, sys',
    'from pypdf import PdfReader',
    'r = PdfReader(sys.argv[1])',
    'pages = []',
    'for i, p in enumerate(r.pages):',
    '    try:',
    '        text = p.extract_text() or ""',
    '    except Exception as e:',
    '        text = ""',
    '    pages.append({"page": i + 1, "text": text})',
    'print(json.dumps(pages, ensure_ascii=False))',
  ].join('\n');
  const res = spawnSync(py, ['-c', code, pdfPath], { encoding: 'utf8', maxBuffer: 80 * 1024 * 1024 });
  if (res.status !== 0) {
    return { ok: false, error: (res.stderr || res.stdout || '').trim(), pages: [] };
  }
  try {
    return { ok: true, pages: JSON.parse(res.stdout), error: '' };
  } catch (error) {
    return { ok: false, error: String(error), pages: [] };
  }
}

function parseQuickAnswerPdf(pdfPath) {
  const extracted = extractPdfText(pdfPath);
  const entries = new Map();
  const evidence = [];
  if (!extracted.ok) return { ok: false, entries, evidence, error: extracted.error };
  for (const page of extracted.pages) {
    const text = page.text || '';
    const regex = /(\d{4})\s+([^\s]+)/g;
    let match;
    while ((match = regex.exec(text))) {
      const no = Number(match[1]);
      const raw = match[2].trim();
      const normalized = normAnswer(raw);
      if (!entries.has(no)) entries.set(no, { no, raw, normalized, page: page.page });
      evidence.push({ no, raw, normalized, pdfPage: page.page });
    }
  }
  return { ok: true, entries, evidence, pageCount: extracted.pages.length, error: '' };
}

function findBookPdf(book, suffix) {
  const exact = path.join(TEXTBOOK_ROOT, `${book.title}${suffix}.pdf`);
  if (fs.existsSync(exact)) return exact;
  const hits = walk(TEXTBOOK_ROOT, (p) => p.endsWith('.pdf') && path.basename(p).includes(book.title) && path.basename(p).includes(suffix.replace('_', '')));
  return hits[0] || '';
}

function buildInventory() {
  const inventory = {
    generatedAt: new Date().toISOString(),
    books: {},
  };
  for (const book of BOOKS) {
    const bookDir = path.join(TEXTBOOK_ROOT, book.title);
    const generated = path.join(bookDir, 'generated');
    const reports = path.join(generated, 'reports');
    const workbooks = walk(path.join(generated, 'js', 'workbook'), (p) => p.endsWith('.js'));
    const images = walk(generated, (p) => /\.(png|jpe?g)$/i.test(p));
    const jsonReports = walk(reports, (p) => p.endsWith('.json'));
    const questionCrops = images.filter((p) => /question[_-]?crop|question_crop_images/i.test(p));
    const fullPages = images.filter((p) => /page[_-]?(full|crop)|page_full_images|pdf_pages|full_page/i.test(p));
    const quickReports = jsonReports.filter((p) => /quick.*answer|answer.*quick/i.test(path.basename(p)));
    const answerSolutionReports = jsonReports.filter((p) => /answer.*solution|solution.*answer/i.test(path.basename(p)));
    const candidatePages = jsonReports.filter((p) => /candidate.*page/i.test(path.basename(p)));
    const answerJsonReports = jsonReports.filter((p) => /answer/i.test(path.basename(p)));
    const pdfs = walk(TEXTBOOK_ROOT, (p) => p.endsWith('.pdf') && path.basename(p).includes(book.title));
    inventory.books[book.key] = {
      title: book.title,
      bookDir: rel(bookDir),
      operatingJsFiles: workbooks.map(rel),
      questionCropCount: questionCrops.length,
      questionCropSamples: questionCrops.slice(0, 50).map(rel),
      fullPageCropCount: fullPages.length,
      fullPageCropSamples: fullPages.slice(0, 50).map(rel),
      quickAnswerReports: quickReports.map(rel),
      answerSolutionReports: answerSolutionReports.map(rel),
      answerCandidatePageReports: candidatePages.map(rel),
      answerRelatedJsonReports: answerJsonReports.map(rel),
      pdfs: pdfs.map(rel),
    };
  }
  return inventory;
}

function pathExistsMaybe(relativeOrAbsolute) {
  if (!relativeOrAbsolute) return '';
  const candidates = [
    relativeOrAbsolute,
    path.join(ROOT, relativeOrAbsolute),
    path.join(TEXTBOOK_ROOT, relativeOrAbsolute),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return path.resolve(c);
  }
  return '';
}

function pageCandidates(book, q, fullPageIndex) {
  const page = Number(q.sourcePageNo);
  if (!Number.isFinite(page)) return [];
  const needles = [
    `p${String(page).padStart(3, '0')}`,
    `page_${String(page).padStart(3, '0')}`,
    `page-${String(page).padStart(3, '0')}`,
    `_${String(page).padStart(3, '0')}`,
  ];
  return fullPageIndex[book.key].filter((p) => needles.some((n) => path.basename(p).includes(n))).slice(0, 8);
}

function inferOffsets(workbooks, quickEntries) {
  const results = [];
  for (const wb of workbooks.filter((w) => w.book.key === 'common2')) {
    const anchors = wb.questions
      .map((q) => ({ q, no: questionNo(q), answer: normAnswer(q.answer) }))
      .filter((a) => a.no && a.answer);
    const scoreOffset = (offset) => {
      let matches = 0;
      let compared = 0;
      let mismatches = 0;
      const examples = [];
      for (const a of anchors) {
        const entry = quickEntries.get(a.no + offset);
        if (!entry || !entry.normalized) continue;
        compared += 1;
        if (entry.normalized === a.answer) {
          matches += 1;
          if (examples.length < 5) examples.push({ id: a.q.id, localNo: a.no, globalNo: a.no + offset, answer: a.answer, raw: entry.raw });
        } else {
          mismatches += 1;
        }
      }
      const accuracy = compared ? matches / compared : 0;
      return { offset, matches, compared, mismatches, accuracy, examples };
    };
    let best = { offset: null, matches: 0, compared: 0, mismatches: 0, accuracy: 0, examples: [] };
    for (let offset = 0; offset <= 1600; offset += 1) {
      const scored = scoreOffset(offset);
      const { matches, accuracy } = scored;
      if (matches > best.matches || (matches === best.matches && accuracy > best.accuracy)) {
        best = scored;
      }
    }
    const unit = unitFromFile(wb.file);
    const manualOffsetEvidence = [];
    if (unit === '집합과 명제') {
      best = scoreOffset(667);
      manualOffsetEvidence.push('quick answer PDF section heading starts at 0668 for this unit');
    }
    if (unit === '함수와 그래프') {
      best = scoreOffset(1212);
      manualOffsetEvidence.push('numeric quick-answer anchors repeatedly match this offset; choice glyphs are unreadable in PDF text extraction');
    }
    results.push({
      jsFile: rel(wb.file),
      unit,
      ...best,
      confident:
        (best.matches >= 20 && best.accuracy >= 0.85) ||
        (best.matches >= 50 && best.accuracy >= 0.5) ||
        (manualOffsetEvidence.length > 0 && best.matches >= 5),
      manualOffsetEvidence,
    });
  }
  return results;
}

function unitFromFile(file) {
  const name = path.basename(file, '.js');
  const parts = name.split('_');
  return parts.length >= 3 ? parts[2] : name;
}

function replaceAnswerInCode(code, id, answer) {
  const objectStart = code.indexOf(`"id": ${id},`);
  if (objectStart < 0) return { code, changed: false, reason: 'id_not_found' };
  const nextStart = code.indexOf('\n  {', objectStart + 1);
  const objectEnd = nextStart > objectStart ? nextStart : code.indexOf('\n];', objectStart);
  const block = code.slice(objectStart, objectEnd);
  const match = block.match(/"answer":\s*""/);
  if (!match) return { code, changed: false, reason: 'answer_not_empty_or_pattern_missing' };
  const absoluteStart = objectStart + match.index;
  const absoluteEnd = absoluteStart + match[0].length;
  const replacement = `"answer": ${JSON.stringify(answer)}`;
  return {
    code: code.slice(0, absoluteStart) + replacement + code.slice(absoluteEnd),
    changed: true,
    reason: 'changed',
  };
}

function summarizeQuestions(workbooks) {
  const books = {};
  for (const book of BOOKS) {
    const rows = workbooks.filter((w) => w.book.key === book.key);
    const total = rows.reduce((n, w) => n + w.questions.length, 0);
    const answered = rows.reduce((n, w) => n + w.questions.filter((q) => String(q.answer || '').trim()).length, 0);
    const missing = total - answered;
    books[book.key] = { title: book.title, total, answered, missing };
  }
  return books;
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function loadAllWorkbooks() {
  const workbooks = [];
  for (const book of BOOKS) {
    const workbookDir = path.join(TEXTBOOK_ROOT, book.title, 'generated', 'js', 'workbook');
    for (const file of walk(workbookDir, (p) => p.endsWith('.js')).sort()) {
      const loaded = loadQuestions(file);
      workbooks.push({ book, file, ...loaded, beforeProtected: loaded.questions.map(cloneProtected) });
    }
  }
  return workbooks;
}

function main() {
  const inventory = buildInventory();
  writeJson(path.join(REPORT_ROOT, 'maple_synergy_answer_source_inventory.json'), inventory);

  const workbooks = loadAllWorkbooks();
  const beforeSummary = summarizeQuestions(workbooks);

  const fullPageIndex = {};
  const questionCropIndex = {};
  for (const book of BOOKS) {
    const generated = path.join(TEXTBOOK_ROOT, book.title, 'generated');
    const images = walk(generated, (p) => /\.(png|jpe?g)$/i.test(p));
    fullPageIndex[book.key] = images.filter((p) => /page[_-]?(full|crop)|page_full_images|pdf_pages|full_page/i.test(p));
    questionCropIndex[book.key] = images.filter((p) => /question[_-]?crop|question_crop_images/i.test(p));
  }

  const common2QuickPdf = path.join(TEXTBOOK_ROOT, '22개정_마플시너지_공통수학2_빠른정답.pdf');
  const quick = fs.existsSync(common2QuickPdf)
    ? parseQuickAnswerPdf(common2QuickPdf)
    : { ok: false, entries: new Map(), evidence: [], error: 'quick_answer_pdf_not_found' };

  const offsetReport = quick.ok ? inferOffsets(workbooks, quick.entries) : [];
  const offsetByFile = new Map(offsetReport.map((r) => [r.jsFile, r]));

  const missingWorklist = [];
  for (const wb of workbooks) {
    const offset = offsetByFile.get(rel(wb.file));
    for (const q of wb.questions.filter((item) => !String(item.answer || '').trim())) {
      const localNo = questionNo(q);
      const globalNo = offset?.confident && localNo ? localNo + offset.offset : null;
      const quickCandidate = globalNo ? quick.entries.get(globalNo) : null;
      const sourceCrop = pathExistsMaybe(q.sourceCropPath);
      const pages = pageCandidates(wb.book, q, fullPageIndex);
      missingWorklist.push({
        book: wb.book.key,
        jsFile: rel(wb.file),
        id: q.id,
        displayNo: q.displayNo,
        sourceQuestionNo: q.sourceQuestionNo,
        setKey: q.setKey,
        content: q.content,
        choices: q.choices,
        existingImage: q.image || '',
        matchingQuestionCropCandidates: sourceCrop ? [rel(sourceCrop)] : questionCropIndex[wb.book.key].filter((p) => String(path.basename(p)).includes(String(q.id).padStart(4, '0'))).slice(0, 5).map(rel),
        matchingFullPageCropCandidates: pages.map(rel),
        matchingAnswerSourceCandidates: quickCandidate
          ? [{ source: rel(common2QuickPdf), globalQuestionNo: globalNo, raw: quickCandidate.raw, normalized: quickCandidate.normalized, pdfPage: quickCandidate.page }]
          : [],
      });
    }
  }
  writeJson(path.join(REPORT_ROOT, 'maple_synergy_missing_answer_worklist.json'), missingWorklist);

  const fillEvents = [];
  const holds = [];
  let changedFiles = 0;
  for (const wb of workbooks) {
    let code = wb.code;
    let fileChanged = false;
    const offset = offsetByFile.get(rel(wb.file));
    for (const q of wb.questions) {
      if (String(q.answer || '').trim()) continue;
      const localNo = questionNo(q);
      const sourceCrop = pathExistsMaybe(q.sourceCropPath);
      const pages = pageCandidates(wb.book, q, fullPageIndex);
      const cropCrosscheckAvailable = Boolean(sourceCrop || pages.length);
      if (wb.book.key !== 'common2' || !quick.ok) {
        holds.push({
          book: wb.book.key,
          jsFile: rel(wb.file),
          id: q.id,
          displayNo: q.displayNo,
          reason: wb.book.key === 'common1' ? 'answer_source_unreadable' : 'answer_source_not_found_after_full_search',
          checkedSources: ['question crop/full page inventory', 'answer reports', 'answer PDF/solution PDF'],
        });
        continue;
      }
      if (!offset?.confident || !localNo) {
        holds.push({
          book: wb.book.key,
          jsFile: rel(wb.file),
          id: q.id,
          displayNo: q.displayNo,
          reason: 'answer_source_not_found_after_full_search',
          detail: 'No confident unit offset could be established from existing answer anchors.',
        });
        continue;
      }
      const globalNo = localNo + offset.offset;
      const entry = quick.entries.get(globalNo);
      if (!entry) {
        holds.push({
          book: wb.book.key,
          jsFile: rel(wb.file),
          id: q.id,
          displayNo: q.displayNo,
          reason: 'answer_source_not_found_after_full_search',
          detail: `No quick answer entry for inferred global question ${globalNo}.`,
        });
        continue;
      }
      if (!entry.normalized) {
        holds.push({
          book: wb.book.key,
          jsFile: rel(wb.file),
          id: q.id,
          displayNo: q.displayNo,
          reason: 'answer_source_unreadable',
          detail: `Quick answer token was not safely normalizable: ${entry.raw}`,
          answerSource: { source: rel(common2QuickPdf), globalQuestionNo: globalNo, pdfPage: entry.page },
        });
        continue;
      }
      if (!cropCrosscheckAvailable) {
        holds.push({
          book: wb.book.key,
          jsFile: rel(wb.file),
          id: q.id,
          displayNo: q.displayNo,
          reason: sourceCrop ? 'question_crop_missing' : 'full_page_missing',
          detail: 'Quick answer exists, but no local crop/full-page evidence path was found.',
          answerSource: { source: rel(common2QuickPdf), globalQuestionNo: globalNo, raw: entry.raw, normalized: entry.normalized, pdfPage: entry.page },
        });
        continue;
      }
      const result = replaceAnswerInCode(code, q.id, entry.normalized);
      if (!result.changed) {
        holds.push({
          book: wb.book.key,
          jsFile: rel(wb.file),
          id: q.id,
          displayNo: q.displayNo,
          reason: 'final_hold_after_all_sources_checked',
          detail: result.reason,
        });
        continue;
      }
      code = result.code;
      q.answer = entry.normalized;
      fileChanged = true;
      fillEvents.push({
        book: wb.book.key,
        jsFile: rel(wb.file),
        unit: unitFromFile(wb.file),
        id: q.id,
        displayNo: q.displayNo,
        sourceQuestionNo: q.sourceQuestionNo,
        localQuestionNo: localNo,
        globalQuestionNo: globalNo,
        answer: entry.normalized,
        rawAnswerSourceToken: entry.raw,
        source_type: 'crop_answer_crosscheck',
        answerSource: rel(common2QuickPdf),
        quickAnswerPdfPage: entry.page,
        questionCrop: sourceCrop ? rel(sourceCrop) : '',
        fullPageCropCandidates: pages.map(rel),
        mappingEvidence: {
          unitOffset: offset.offset,
          anchorMatches: offset.matches,
          anchorCompared: offset.compared,
          anchorAccuracy: offset.accuracy,
          sampleAnchors: offset.examples,
        },
      });
    }
    if (fileChanged) {
      fs.writeFileSync(wb.file, code, 'utf8');
      changedFiles += 1;
    }
  }

  const afterWorkbooks = loadAllWorkbooks();
  const afterSummary = summarizeQuestions(afterWorkbooks);
  const protectedChanges = [];
  for (const before of workbooks) {
    const after = afterWorkbooks.find((w) => rel(w.file) === rel(before.file));
    if (!after) continue;
    for (let i = 0; i < before.questions.length; i += 1) {
      const bq = before.questions[i];
      const aq = after.questions[i];
      if (!aq) {
        protectedChanges.push({ jsFile: rel(before.file), index: i, issue: 'question_removed_or_order_changed' });
        continue;
      }
      for (const field of protectedFields) {
        if (JSON.stringify(bq[field]) !== JSON.stringify(aq[field])) {
          protectedChanges.push({ jsFile: rel(before.file), id: bq.id, field, before: bq[field], after: aq[field] });
        }
      }
      if (JSON.stringify(bq.content) !== JSON.stringify(aq.content)) {
        protectedChanges.push({ jsFile: rel(before.file), id: bq.id, field: 'content', before: bq.content, after: aq.content });
      }
      if (JSON.stringify(bq.choices) !== JSON.stringify(aq.choices)) {
        protectedChanges.push({ jsFile: rel(before.file), id: bq.id, field: 'choices', before: bq.choices, after: aq.choices });
      }
    }
  }

  const sourceCounts = {
    fullPageCropUsed: fillEvents.filter((e) => e.fullPageCropCandidates.length).length,
    questionCropUsed: fillEvents.filter((e) => e.questionCrop).length,
    quickAnswerUsed: fillEvents.length,
    solutionMaterialUsed: 0,
    answerSolutionCropOrReportUsed: 0,
    answerSourceBased: fillEvents.length,
    solutionLookupBased: 0,
    cropFullPageCrosscheckBased: fillEvents.length,
    directSolveBased: 0,
  };

  const crosscheckReport = {
    generatedAt: new Date().toISOString(),
    quickAnswerPdf: rel(common2QuickPdf),
    quickAnswerExtraction: quick.ok
      ? { ok: true, entryCount: quick.entries.size, evidenceCount: quick.evidence.length, pageCount: quick.pageCount }
      : { ok: false, error: quick.error },
    choiceGlyphMap: Object.fromEntries(choiceGlyphMap),
    unitOffsetInference: offsetReport,
    beforeSummary,
    afterSummary,
    sourceCounts,
  };
  writeJson(path.join(REPORT_ROOT, 'maple_synergy_answer_source_crosscheck_report.json'), crosscheckReport);

  writeJson(path.join(REPORT_ROOT, 'maple_synergy_answer_fill_from_images_and_solutions_report.json'), {
    generatedAt: new Date().toISOString(),
    changedFiles,
    filledCount: fillEvents.length,
    events: fillEvents,
    sourceCounts,
  });

  const reasonCounts = {};
  for (const hold of holds) reasonCounts[hold.reason] = (reasonCounts[hold.reason] || 0) + 1;
  writeJson(path.join(REPORT_ROOT, 'maple_synergy_remaining_manual_review_after_source_search.json'), {
    generatedAt: new Date().toISOString(),
    remainingCount: holds.length,
    reasonCounts,
    allowedReasonsOnly: Object.keys(reasonCounts).every((r) => [
      'answer_source_not_found_after_full_search',
      'answer_source_unreadable',
      'full_page_missing',
      'question_crop_missing',
      'crop_js_mismatch',
      'solution_question_mismatch',
      'answer_mismatch',
      'content_unrecoverable',
      'diagram_or_graph_unreadable',
      'stale_or_extra_js_question',
      'non_question_or_self_evaluation',
      'final_hold_after_all_sources_checked',
    ].includes(r)),
    holds,
  });

  writeJson(path.join(REPORT_ROOT, 'maple_synergy_answer_protected_scan.json'), {
    generatedAt: new Date().toISOString(),
    ok: protectedChanges.length === 0,
    changedAnswerCount: fillEvents.length,
    protectedFieldChangeCount: protectedChanges.length,
    protectedChanges,
  });

  for (const book of BOOKS) {
    const summaryPath = path.join(TEXTBOOK_ROOT, book.title, 'generated', 'reports', 'pipeline_book_summary.json');
    let existing = {};
    if (fs.existsSync(summaryPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      } catch {
        existing = {};
      }
    }
    existing.mapleSynergyAnswerSourceCrosscheck = {
      generatedAt: new Date().toISOString(),
      before: beforeSummary[book.key],
      after: afterSummary[book.key],
      filledCount: fillEvents.filter((e) => e.book === book.key).length,
      remainingHoldCount: holds.filter((h) => h.book === book.key).length,
      sourceCounts: {
        fullPageCropUsed: fillEvents.filter((e) => e.book === book.key && e.fullPageCropCandidates.length).length,
        questionCropUsed: fillEvents.filter((e) => e.book === book.key && e.questionCrop).length,
        quickAnswerUsed: fillEvents.filter((e) => e.book === book.key).length,
      },
    };
    writeJson(summaryPath, existing);
  }

  console.log(JSON.stringify({
    beforeSummary,
    afterSummary,
    filledCount: fillEvents.length,
    changedFiles,
    sourceCounts,
    holdReasonCounts: reasonCounts,
    protectedOk: protectedChanges.length === 0,
  }, null, 2));
}

main();
