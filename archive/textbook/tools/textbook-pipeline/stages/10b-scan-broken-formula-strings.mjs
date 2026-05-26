import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listArchiveJs, readQuestionBank } from "../lib/js-archive-utils.mjs";
import { writeJson } from "../lib/report-utils.mjs";

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

async function inputJsFiles(input) {
  if (!input) return [];
  try {
    const stat = await fs.promises.stat(input);
    if (stat.isFile() && input.endsWith(".js")) return [input];
    if (stat.isDirectory()) return listArchiveJs(input);
  } catch {
    return [];
  }
  return [];
}

function inferSetKey(file) {
  return path.basename(file, ".js");
}

function riskTokens(text, patterns) {
  const tokens = new Set();
  for (const pattern of patterns) {
    for (const match of String(text || "").matchAll(pattern)) tokens.add(match[0]);
  }
  return [...tokens];
}

function hasUnclosedDollar(text) {
  return (String(text || "").match(/\$/g) || []).length % 2 === 1;
}

function hasMultilineDollar(text) {
  let inMath = false;
  for (const char of String(text || "")) {
    if (char === "$") inMath = !inMath;
    else if (char === "\n" && inMath) return true;
  }
  return false;
}

function malformedLatexTokens(text) {
  const value = String(text || "");
  const tokens = [];
  for (const match of value.matchAll(/\\(?:frac|dfrac|sqrt)\b/g)) {
    const token = match[0];
    const rest = value.slice(match.index + token.length).trimStart();
    if (token === "\\sqrt") {
      if (!rest.startsWith("{") && !rest.startsWith("[")) tokens.push(token);
    } else if (!rest.startsWith("{")) {
      tokens.push(token);
    }
  }
  return tokens;
}

function scanText(text, field) {
  const value = String(text || "");
  const riskTypes = new Set();
  const tokens = new Set();
  const add = (type, found = []) => {
    if (!found.length) return;
    riskTypes.add(type);
    for (const token of found) tokens.add(token);
  };

  add("combination_plain_notation", riskTokens(value, [/\bnCr\b/gi, /\bnC[23]\b/g, /\b\d+C\d+\b/g]));
  add("permutation_plain_notation", riskTokens(value, [/\bnPr\b/gi, /\bnP[23]\b/g, /\b\d+P\d+\b/g]));
  add("bare_exponent", riskTokens(value, [/[A-Za-z0-9\uAC00-\uD7A3)]\s*\^\s*(?!\{)[A-Za-z0-9(]/g]));
  add("unicode_script_notation", riskTokens(value, [/[\u00B2\u00B3\u00B9\u2070\u2074-\u2079\u2080-\u2089\u2099\u1D63]/g]));
  add("broken_ocr_character", riskTokens(value, [/[#@`\uFFFD\u00DB\u00DC\u00DD\u00DE]/g]));
  if (hasUnclosedDollar(value)) add("unclosed_dollar_formula", ["$"]);
  add("latex_escape_risk", malformedLatexTokens(value));
  if (/<img\b/i.test(value)) add("content_img_tag", riskTokens(value, [/<img\b[^>]*>/gi]));
  if (/(?:page_full_images|page[_-]?crop|question[_-]?crop|crop_images|original_question_full|by_js_id|\.png|\.jpe?g)/i.test(value)) {
    add("image_only_content_path", riskTokens(value, [/(?:page_full_images|page[_-]?crop|question[_-]?crop|crop_images|original_question_full|by_js_id)[^\s"'<>)]*/gi, /[^\s"'<>)]*\.(?:png|jpe?g)/gi]));
  }
  if (/\\text\{[^}]*[\uAC00-\uD7A3][^}]*\}/.test(value)) add("korean_inside_text_command", riskTokens(value, [/\\text\{[^}]*[\uAC00-\uD7A3][^}]*\}/g]));
  if (hasMultilineDollar(value)) add("multiline_dollar_formula", ["$...\\n...$"]);
  if (field.startsWith("choices[") && riskTypes.size) riskTypes.add("choices_formula_risk");

  return { riskTypes: [...riskTypes], riskTokens: [...tokens] };
}

function priorityFor(riskTypes) {
  return riskTypes.some((risk) => [
    "broken_ocr_character",
    "content_img_tag",
    "image_only_content_path",
    "unclosed_dollar_formula",
    "multiline_dollar_formula",
  ].includes(risk)) ? "high" : "medium";
}

async function scan({ bookId, input, outDir, limit = 0 }) {
  const files = await inputJsFiles(input);
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const items = [];
  let scannedQuestions = 0;
  const inputWarnings = [];

  if (!files.length) {
    inputWarnings.push({ input, reason: "input_js_missing_or_empty" });
  }

  for (const file of files) {
    let parsed;
    try {
      parsed = await readQuestionBank(file);
    } catch (error) {
      inputWarnings.push({ input: file, reason: `js_parse_error:${error.message}` });
      continue;
    }
    const setKey = inferSetKey(file);
    for (const question of parsed.questions) {
      scannedQuestions += 1;
      const rows = [{ field: "content", text: question.content || "" }];
      if (Array.isArray(question.choices)) {
        question.choices.forEach((choice, index) => rows.push({ field: `choices[${index}]`, text: choice || "" }));
      }
      for (const row of rows) {
        const detected = scanText(row.text, row.field);
        if (!detected.riskTypes.length) continue;
        items.push({
          bookId,
          id: String(question.id ?? ""),
          setKey,
          field: row.field,
          currentText: String(row.text || ""),
          riskTypes: detected.riskTypes,
          riskTokens: detected.riskTokens,
          priority: priorityFor(detected.riskTypes),
          needsFormulaRepairTarget: true,
          source: "broken_formula_string_scan",
        });
      }
    }
  }

  const limitedItems = Number.isFinite(limit) && limit > 0 ? items.slice(0, limit) : items;
  const createdAt = new Date().toISOString();
  const report = {
    bookId,
    createdAt,
    mode: "BROKEN_FORMULA_STRING_SCAN",
    input,
    scannedQuestions,
    itemCount: limitedItems.length,
    discoveredItemCount: items.length,
    inputWarnings,
    items: limitedItems,
    status: inputWarnings.length && !files.length ? "empty" : "ok",
  };
  const summary = {
    bookId,
    createdAt,
    scannedQuestions,
    riskItemCount: limitedItems.length,
    contentRiskCount: limitedItems.filter((item) => item.field === "content").length,
    choicesRiskCount: limitedItems.filter((item) => item.field.startsWith("choices[")).length,
    imageOnlyContentCount: limitedItems.filter((item) => item.riskTypes.includes("content_img_tag") || item.riskTypes.includes("image_only_content_path")).length,
    inputWarnings,
  };
  const reportFile = path.join(outDir, `broken_formula_string_scan__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `broken_formula_string_summary__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(summaryFile, summary);
  return { status: "ok", reportFile, summaryFile, report, summary };
}

export default async function stage10bScanBrokenFormulaStrings(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  const input = cfg.contentChoicesScanInput || cfg.jsDir || "";
  const outDir = cfg.contentChoicesScanOutDir || cfg.reportsDir || path.join(process.cwd(), "reports");
  return scan({ bookId, input, outDir, limit: Number(cfg.contentChoicesScanLimit || 0) });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const bookId = args["book-id"] || args.bookId || "book";
  const input = path.resolve(args.input || "");
  const outDir = path.resolve(args.out || "reports");
  const limit = args.limit ? Number(args.limit) : 0;
  scan({ bookId, input, outDir, limit }).then(({ report, reportFile, summaryFile }) => {
    console.log(JSON.stringify({ status: report.status, riskItemCount: report.itemCount, reportFile, summaryFile }, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
