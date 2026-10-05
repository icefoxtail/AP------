import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listArchiveJs, readQuestionBank } from "../lib/js-archive-utils.mjs";
import { readJson, writeJson } from "../lib/report-utils.mjs";

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

function scanAnswer(answer) {
  const value = String(answer ?? "").trim();
  const riskTypes = new Set();
  const tokens = new Set();
  const add = (type, found = []) => {
    if (!found.length) return;
    riskTypes.add(type);
    for (const token of found) tokens.add(token);
  };

  if (!value) add("answer_empty");
  if (/^[①②③④⑤]$/.test(value) || /^\d번$/.test(value)) add("answer_nonstandard_choice_marker", [value]);
  if (/^[①②③④⑤]/.test(value)) add("answer_nonstandard_choice_marker", riskTokens(value, [/[①②③④⑤]/g]));
  if (/^[1-5](?:\s*,\s*[1-5]|\s*\/\s*[1-5]|\s+and\s+[1-5])+$/i.test(value)) add("multiple_answer_structure_risk", [value]);
  if (/^(?:[6-9]|\d{2,})$/.test(value)) add("answer_choice_range_risk", [value]);
  add("combination_plain_notation", riskTokens(value, [/\bnCr\b/gi, /\bnC[23]\b/g, /\b\d+C\d+\b/g]));
  add("permutation_plain_notation", riskTokens(value, [/\bnPr\b/gi, /\bnP[23]\b/g, /\b\d+P\d+\b/g]));
  add("bare_exponent", riskTokens(value, [/[A-Za-z0-9\uAC00-\uD7A3)]\s*\^\s*(?!\{)[A-Za-z0-9(]/g]));
  add("unicode_script_notation", riskTokens(value, [/[\u00B2\u00B3\u00B9\u2070\u2074-\u2079\u2080-\u2089\u2099\u1D63]/g]));
  add("broken_ocr_character", riskTokens(value, [/[#@`\uFFFD\u00DB\u00DC\u00DD\u00DE]/g]));
  add("latex_escape_risk", malformedLatexTokens(value));
  if (hasUnclosedDollar(value)) add("unclosed_dollar_formula", ["$"]);
  return { riskTypes: [...riskTypes], riskTokens: [...tokens] };
}

function priorityFor(riskTypes) {
  return riskTypes.some((risk) => ["answer_empty", "broken_ocr_character", "unclosed_dollar_formula"].includes(risk)) ? "high" : "medium";
}

function asArray(raw) {
  if (Array.isArray(raw)) return raw;
  for (const key of ["items", "mismatches", "rows", "answers", "targets"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

function keyFor(setKey, id, displayNo = "") {
  return `${setKey || ""}::${id || ""}::${displayNo || ""}`;
}

async function loadMismatchKeys(reportsDir) {
  const mismatchRaw = await readJson(path.join(reportsDir, "answer_mismatch_report.json"), null);
  const candidateRaw = await readJson(path.join(reportsDir, "answer_candidate_report.json"), null);
  const mismatchKeys = new Set();
  for (const item of asArray(mismatchRaw)) {
    const setKey = item.setKey || item.sectionKey || "";
    const id = item.id || item.questionId || "";
    const displayNo = item.displayNo || "";
    mismatchKeys.add(keyFor(setKey, id, displayNo));
    mismatchKeys.add(keyFor(setKey, id, ""));
  }
  for (const item of asArray(candidateRaw)) {
    if (item.status && !/mismatch|conflict/i.test(String(item.status))) continue;
    if (!/mismatch|conflict/i.test(JSON.stringify(item))) continue;
    const setKey = item.setKey || item.sectionKey || "";
    const id = item.id || item.questionId || "";
    const displayNo = item.displayNo || "";
    mismatchKeys.add(keyFor(setKey, id, displayNo));
    mismatchKeys.add(keyFor(setKey, id, ""));
  }
  return mismatchKeys;
}

async function scan({ bookId, input, reportsDir, outDir, limit = 0 }) {
  const files = await inputJsFiles(input);
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const mismatchKeys = reportsDir ? await loadMismatchKeys(reportsDir) : new Set();
  const items = [];
  const inputWarnings = [];
  let scannedQuestions = 0;

  if (!files.length) inputWarnings.push({ input, reason: "input_js_missing_or_empty" });

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
      const displayNo = question.displayNo || question.questionNo || "";
      const currentAnswer = String(question.answer ?? "").trim();
      const detected = scanAnswer(currentAnswer);
      const hasMismatch = mismatchKeys.has(keyFor(setKey, question.id, displayNo)) || mismatchKeys.has(keyFor(setKey, question.id, ""));
      if (hasMismatch) {
        detected.riskTypes.push("answer_candidate_mismatch");
        detected.riskTokens.push(currentAnswer || "answerCandidate");
      }
      if (!detected.riskTypes.length) continue;
      items.push({
        bookId,
        id: String(question.id ?? ""),
        setKey,
        field: "answer",
        currentAnswer,
        riskTypes: [...new Set(detected.riskTypes)],
        riskTokens: [...new Set(detected.riskTokens)],
        priority: priorityFor(detected.riskTypes),
        needsFormulaRepairTarget: true,
        requiresAnswerSource: true,
        source: "answer_string_risk_scan",
      });
    }
  }

  const limitedItems = Number.isFinite(limit) && limit > 0 ? items.slice(0, limit) : items;
  const createdAt = new Date().toISOString();
  const report = {
    bookId,
    createdAt,
    mode: "ANSWER_STRING_RISK_SCAN",
    input,
    reportsDir,
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
    answerRiskCount: limitedItems.length,
    emptyAnswerCount: limitedItems.filter((item) => item.riskTypes.includes("answer_empty")).length,
    choiceAnswerFormatRiskCount: limitedItems.filter((item) => item.riskTypes.includes("answer_nonstandard_choice_marker") || item.riskTypes.includes("answer_choice_range_risk")).length,
    formulaAnswerRiskCount: limitedItems.filter((item) => item.riskTypes.some((risk) => /formula|combination|permutation|exponent|script|latex|dollar/.test(risk))).length,
    mismatchCount: limitedItems.filter((item) => item.riskTypes.includes("answer_candidate_mismatch")).length,
    inputWarnings,
  };
  const reportFile = path.join(outDir, `answer_string_risk_scan__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `answer_string_risk_summary__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(summaryFile, summary);
  return { status: "ok", reportFile, summaryFile, report, summary };
}

export default async function stage10cScanAnswerStringRisk(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  const input = cfg.answerStringScanInput || cfg.jsDir || "";
  const reportsDir = cfg.answerStringScanReportsDir || cfg.reportsDir || "";
  const outDir = cfg.answerStringScanOutDir || cfg.reportsDir || path.join(process.cwd(), "reports");
  return scan({ bookId, input, reportsDir, outDir, limit: Number(cfg.answerStringScanLimit || 0) });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const bookId = args["book-id"] || args.bookId || "book";
  const input = path.resolve(args.input || "");
  const reportsDir = args["reports-dir"] || args.reportsDir ? path.resolve(args["reports-dir"] || args.reportsDir) : "";
  const outDir = path.resolve(args.out || reportsDir || "reports");
  const limit = args.limit ? Number(args.limit) : 0;
  scan({ bookId, input, reportsDir, outDir, limit }).then(({ report, reportFile, summaryFile }) => {
    console.log(JSON.stringify({ status: report.status, answerRiskCount: report.itemCount, reportFile, summaryFile }, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
