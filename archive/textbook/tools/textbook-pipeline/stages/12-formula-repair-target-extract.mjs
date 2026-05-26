import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function safeName(value) {
  return String(value || "book").replace(/[\\/:*?"<>|]/g, "_");
}

async function exists(file) {
  try {
    await fs.promises.access(file, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readJson(file) {
  return JSON.parse((await fs.promises.readFile(file, "utf8")).replace(/^\uFEFF/, ""));
}

async function writeJson(file, value) {
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function selectReport(reportsDir, reportName) {
  const exact = path.join(reportsDir, reportName);
  if (await exists(exact)) return { requested: reportName, file: exact, selected: true, reason: "exact" };
  let entries = [];
  try {
    entries = await fs.promises.readdir(reportsDir, { withFileTypes: true });
  } catch {
    return { requested: reportName, file: exact, selected: false, reason: "reports_dir_missing" };
  }
  const stem = reportName.replace(/\.json$/i, "");
  const candidates = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".json")) continue;
    if (entry.name === reportName || entry.name.startsWith(`${stem}__`) || entry.name.startsWith(`${stem}_`)) {
      const full = path.join(reportsDir, entry.name);
      const stat = await fs.promises.stat(full);
      candidates.push({ file: full, mtimeMs: stat.mtimeMs });
    }
  }
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  if (candidates[0]) return { requested: reportName, file: candidates[0].file, selected: true, reason: "latest_matching" };
  return { requested: reportName, file: exact, selected: false, reason: "missing" };
}

async function selectReviewIndex(reportsDir) {
  const exact = await selectReport(reportsDir, "review_index.json");
  if (exact.selected) return exact;
  const draftReviewIndex = path.resolve(reportsDir, "..", "draft_content", "review", "review_index.json");
  if (await exists(draftReviewIndex)) {
    return { requested: "review_index.json", file: draftReviewIndex, selected: true, reason: "draft_content_review_index" };
  }
  return exact;
}

function asArray(raw) {
  if (Array.isArray(raw)) return raw;
  for (const key of ["targets", "items", "rows", "entries", "questions", "risks", "reviewItems", "manualReview", "manual_review"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return raw && typeof raw === "object" ? [raw] : [];
}

function stringValue(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function sourceImageFrom(item) {
  return stringValue(item.pageFullImagePath, item.page_full_image, item.sourceImage, item.imagePath, item.pageImage, item.fullImage);
}

function questionCropFrom(item) {
  return stringValue(item.questionCropPath, item.questionCrop, item.cropPath, item.sourceCropPath, item.cropFile);
}

function answerSourceImageFrom(item) {
  return stringValue(item.answerSourceImage, item.answerCropPath, item.answerCrop, item.answerImage, item.answerTableImage, item.sourceAnswerImage);
}

const formulaReasonRegex = /수식|첨자|지수|분수|조합|순열|latex|escape|루트|행렬|부등호|formula|subscript|superscript|fraction|combination|permutation|sqrt|matrix|inequality/i;
const plainCombinationRegex = /(?:\b[a-zA-Z]\s*[CP]\s*(?:\d+|[a-zA-Z])\b|\b\d+\s*[CP]\s*(?:\d+|[a-zA-Z])\b)/;
const unicodeScriptRegex = /[²³¹⁰⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉ₙᵣ]/;
const bareCaretRegex = /[A-Za-z0-9가-힣)]\s*\^\s*[A-Za-z0-9({]/;
const latexEscapeRegex = /(?:\\(?:frac|dfrac|sqrt)|[_^{}]|\\[a-zA-Z]+)/;
const imageOnlyRegex = /<img\b|page_full_images|question[_-]?crops|crop_images|\.png|\.jpe?g/i;

function riskTypesFor(item, text, field) {
  const risks = new Set();
  const reason = stringValue(item.reviewReason, item.reason, item.message, item.note, item.notes, item.riskReason);
  if (item.formulaRisk === true) risks.add("formula_risk_flag");
  if (item.rulebookRisk === true) risks.add("rulebook_risk_flag");
  if (item.formulaPatternRisk === true) risks.add("formula_pattern_risk_flag");
  if (item.needsReview === true && formulaReasonRegex.test(reason)) risks.add("formula_review_reason");
  if (plainCombinationRegex.test(text)) risks.add(/P/.test(text) ? "permutation_plain_notation" : "combination_plain_notation");
  if (unicodeScriptRegex.test(text)) risks.add("unicode_script_notation");
  if (bareCaretRegex.test(text)) risks.add("bare_caret_exponent");
  if (latexEscapeRegex.test(text)) risks.add("latex_escape_risk");
  if (imageOnlyRegex.test(text)) risks.add("image_only_content_risk");
  if (/^choices(?:\[\d+\])?$/.test(field) && risks.size) risks.add("choices_formula_risk");
  const riskType = stringValue(item.riskType, item.type, item.category);
  if (formulaReasonRegex.test(riskType)) risks.add("formula_notation_risk");
  for (const risk of Array.isArray(item.riskTypes) ? item.riskTypes : []) {
    if (risk) risks.add(String(risk));
  }
  return [...risks];
}

function normalizeField(field) {
  const value = stringValue(field);
  if (value === "choices") return "";
  if (value === "answer" || value === "content") return value;
  const match = value.match(/^choices\[(\d+)\]$/);
  if (match) return `choices[${match[1]}]`;
  return value;
}

function isAllowedTargetField(field) {
  return field === "content" || field === "answer" || /^choices\[\d+\]$/.test(field);
}

function targetKey({ setKey, id }) {
  return `${setKey || ""}::${id || ""}`;
}

function buildReviewEvidence(items) {
  const byKey = new Map();
  for (const item of items) {
    const key = targetKey({ setKey: stringValue(item.setKey), id: stringValue(item.id, item.questionId) });
    if (!key.includes("::") || key.endsWith("::")) continue;
    const evidence = {
      sourceImage: sourceImageFrom(item),
      questionCrop: questionCropFrom(item),
      pageNo: item.pageNo ?? "",
    };
    if (evidence.sourceImage || evidence.questionCrop || evidence.pageNo !== "") byKey.set(key, evidence);
  }
  return byKey;
}

function mergeReviewEvidence(row, reviewEvidence) {
  const evidence = reviewEvidence.get(targetKey(row));
  if (!evidence) return row;
  return {
    ...row,
    sourceImage: row.sourceImage || evidence.sourceImage,
    questionCrop: row.questionCrop || evidence.questionCrop,
    pageNo: row.pageNo ?? evidence.pageNo,
  };
}

function isHighRisk(riskTypes) {
  return riskTypes.some((risk) => [
    "broken_ocr_character",
    "unclosed_dollar_formula",
    "image_only_content_risk",
    "content_img_tag",
    "image_only_content_path",
    "formula_risk_flag",
    "rulebook_risk_flag",
    "formula_review_reason",
    "answer_candidate_mismatch",
  ].includes(risk));
}

function candidateRows(item, sourceReport) {
  const rows = [];
  const base = {
    id: stringValue(item.id, item.questionId, item.jsId, item.sourceQuestionNo),
    setKey: stringValue(item.setKey, item.sectionKey, item.fileKey, item.unitKey),
    sourceImage: sourceImageFrom(item),
    questionCrop: questionCropFrom(item),
    answerSourceImage: answerSourceImageFrom(item),
    sourceReport,
    requiresAnswerSource: item.requiresAnswerSource === true,
  };
  const explicitField = normalizeField(item.field);
  const explicitText = stringValue(item.currentText, item.currentAnswer, item.text, item.value, item.contentText, item.beforeText);
  if (explicitText) rows.push({ ...base, field: explicitField || "content", currentText: explicitText, raw: item });
  const content = stringValue(item.content);
  if (content && (!explicitText || content !== explicitText)) rows.push({ ...base, field: "content", currentText: content, raw: item });
  if (Array.isArray(item.choices)) {
    item.choices.forEach((choice, index) => {
      const value = typeof choice === "string" ? choice : stringValue(choice?.text, choice?.value, choice?.content);
      if (value) rows.push({ ...base, field: `choices[${index}]`, currentText: value, raw: item });
    });
  }
  const answer = stringValue(item.answer, item.currentAnswer);
  if (answer && (!explicitText || answer !== explicitText)) rows.push({ ...base, field: "answer", currentText: answer, raw: item });
  return rows;
}

async function extract({ bookId, reportsDir, outDir, limit }) {
  const reportNames = [
    "review_index.json",
    "broken_formula_string_scan.json",
    "answer_string_risk_scan.json",
    "formula_uncertain_report.json",
    "rulebook_risk_report.json",
    "answer_mismatch_report.json",
    "content_choices_report.json",
    "content_choices_extraction_report.json",
    "manual_review_report.json",
    "structure_guard_report.json",
  ];
  const missingInputs = [];
  const loadedInputs = [];
  const targets = [];
  const seen = new Set();
  let reviewEvidence = new Map();

  for (const reportName of reportNames) {
    const selected = reportName === "review_index.json" ? await selectReviewIndex(reportsDir) : await selectReport(reportsDir, reportName);
    if (!selected.selected) {
      missingInputs.push({ file: reportName, reason: selected.reason });
      continue;
    }
    let raw;
    try {
      raw = await readJson(selected.file);
    } catch (error) {
      missingInputs.push({ file: reportName, selectedFile: selected.file, reason: `read_error:${error.message}` });
      continue;
    }
    const items = asArray(raw);
    loadedInputs.push({ file: reportName, selectedFile: selected.file, itemCount: items.length, reason: selected.reason });
    if (reportName === "review_index.json") reviewEvidence = buildReviewEvidence(items);
    for (const item of items) {
      for (const sourceRow of candidateRows(item, path.basename(selected.file))) {
        const row = mergeReviewEvidence(sourceRow, reviewEvidence);
        row.field = normalizeField(row.field);
        if (!isAllowedTargetField(row.field)) continue;
        if (row.field === "solution") continue;
        const riskTypes = riskTypesFor(item, row.currentText, row.field);
        if (!riskTypes.length && item.needsFormulaRepairTarget !== true) continue;
        const requiresAnswerSource = row.field === "answer" || row.requiresAnswerSource === true;
        const imageMissing = requiresAnswerSource ? !row.answerSourceImage : !row.sourceImage && !row.questionCrop;
        const key = `${row.id}::${row.setKey}::${row.field}::${row.currentText}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const highRisk = isHighRisk(riskTypes);
        const priority = highRisk ? "high" : "medium";
        targets.push({
          bookId,
          id: row.id,
          setKey: row.setKey,
          field: row.field,
          currentText: row.currentText,
          sourceReport: row.sourceReport,
          riskTypes,
          riskTokens: Array.isArray(item.riskTokens) ? item.riskTokens : [],
          sourceImage: row.sourceImage,
          questionCrop: row.questionCrop,
          pageNo: row.pageNo ?? "",
          answerSourceImage: row.answerSourceImage || "",
          requiresAnswerSource,
          priority,
          needsGemini: highRisk && !imageMissing && (row.field !== "answer" || Boolean(row.answerSourceImage)),
          imageMissing,
          geminiEligibilityReason: highRisk
            ? (imageMissing ? "high_risk_but_source_image_missing" : "high_risk_with_source_image")
            : "not_high_risk_false_positive_or_low_priority",
        });
      }
    }
  }

  const limitedTargets = Number.isFinite(limit) && limit > 0 ? targets.slice(0, limit) : targets;
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const result = {
    bookId,
    createdAt: new Date().toISOString(),
    mode: "FORMULA_REPAIR_TARGET_EXTRACT",
    targets: limitedTargets,
    missingInputs,
    loadedInputs,
    summary: {
      targetCount: limitedTargets.length,
      discoveredTargetCount: targets.length,
      imageMissingCount: limitedTargets.filter((item) => item.imageMissing).length,
      highPriorityCount: limitedTargets.filter((item) => item.priority === "high").length,
      needsGeminiCount: limitedTargets.filter((item) => item.needsGemini).length,
      limit: Number.isFinite(limit) && limit > 0 ? limit : null,
    },
  };
  const targetsFile = path.join(outDir, `formula_repair_targets__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `formula_repair_targets_summary__${safeBook}__${stamp}.json`);
  await writeJson(targetsFile, result);
  await writeJson(summaryFile, { ...result.summary, bookId, createdAt: result.createdAt, missingInputs, loadedInputs, targetsFile });
  return { status: "ok", targetsFile, summaryFile, result };
}

export default async function stage12FormulaRepairTargetExtract(cfg = {}) {
  if (cfg.makeFormulaRepairTargets === false) {
    return { status: "ok", skipped: true, reason: "makeFormulaRepairTargets=false" };
  }
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  const reportsDir = cfg.reportsDir || path.join(process.cwd(), "reports");
  const outDir = cfg.formulaRepairOutDir || reportsDir;
  return extract({ bookId, reportsDir, outDir, limit: Number(cfg.formulaRepairLimit || 0) });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const bookId = args["book-id"] || args.bookId || "book";
  const reportsDir = path.resolve(args["reports-dir"] || args.reportsDir || "reports");
  const outDir = path.resolve(args.out || reportsDir);
  const limit = args.limit ? Number(args.limit) : 0;
  extract({ bookId, reportsDir, outDir, limit }).then(({ targetsFile, summaryFile, result }) => {
    console.log(JSON.stringify({ status: "ok", targetCount: result.summary.targetCount, targetsFile, summaryFile }, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}




