import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectQuestionBanks } from "../lib/js-archive-utils.mjs";
import { renderArchiveJs } from "../lib/js-archive-utils.mjs";
import { ensureDir } from "../lib/report-utils.mjs";
import { readJson, writeJson } from "../lib/report-utils.mjs";
import {
  buildSourceInventory,
  classifySourceType,
  crosscheckForQuestion,
  hasQuestionSourceCrosscheck,
  loadQuestionCrosscheckMap,
  preciseRemainingReasons,
  sourcePriority,
  updatePipelineBookSummary,
} from "../lib/source-crosscheck-utils.mjs";

function normalizeAnswer(value) {
  return String(value ?? "").trim();
}

function normalizeChoiceText(value) {
  return String(value ?? "").replace(/[^\d.+\-*/()]/g, "").trim();
}

export function solveFromJsQuestionFallback(question) {
  const content = String(question?.content || "");
  const choices = Array.isArray(question?.choices) ? question.choices : [];
  const expressionMatch = content.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);
  if (!expressionMatch || !choices.length) return "";
  const left = Number(expressionMatch[1]);
  const right = Number(expressionMatch[3]);
  const op = expressionMatch[2];
  const result = op === "+" ? left + right
    : op === "-" ? left - right
      : op === "*" ? left * right
        : right !== 0 ? left / right : NaN;
  if (!Number.isFinite(result)) return "";
  const resultText = Number.isInteger(result) ? String(result) : String(result);
  const index = choices.findIndex((choice) => normalizeChoiceText(choice) === resultText);
  return index >= 0 ? String(index + 1) : "";
}

function collectAnswerEvidence(raw) {
  const rows = [];
  const candidates = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : Array.isArray(raw?.answers) ? raw.answers : [];
  for (const item of candidates) {
    const setKey = item.setKey || item.sectionKey || item.fileKey || "";
    const id = item.id ?? item.jsId ?? item.jsIdCandidate ?? item.questionId ?? "";
    const displayNo = item.displayNo ?? item.questionNo ?? item.no ?? "";
    const answer = normalizeAnswer(item.answer ?? item.quickAnswer ?? item.value ?? item.extractedAnswer);
    if (!answer) continue;
    rows.push({
      setKey,
      id,
      displayNo,
      answer,
      source: item.source || item.report || "answer_evidence_report",
      source_type: item.source_type || classifySourceType(item.source || item.report || "", item),
      confidence: item.confidence ?? item.confidenceQuick ?? "",
      raw: item,
    });
  }
  return rows;
}

function keyFor(setKey, id, displayNo) {
  return `${setKey || ""}::${id || ""}::${displayNo || ""}`;
}

export default async function stage10c(cfg) {
  const banks = await collectQuestionBanks(cfg.jsDir);
  const inventory = await readJson(path.join(cfg.reportsDir, "source_inventory_report.json"), null)
    || await buildSourceInventory(cfg);
  const { report: questionSourceReport, map: questionSourceMap } = await loadQuestionCrosscheckMap(cfg);
  const evidenceReports = cfg.answerEvidenceReports || [
    "answer_source_map.json",
    "quick_answer_extraction_report.json",
    "quick_answer_table_report.json",
    "answer_source_ocr_report.json",
    "answer_solution_extraction_report.json",
    "answer_solution_crop_report.json",
    "text1_answer_extraction_report.json",
    "text1_answer_solution_extraction_report.json",
  ];
  const evidence = [];
  const loadedReports = [];
  for (const name of evidenceReports) {
    const file = path.join(cfg.reportsDir, name);
    const raw = await readJson(file, null);
    if (!raw) continue;
    const rows = collectAnswerEvidence(raw).map((row) => ({ ...row, reportFile: name }));
    loadedReports.push({ file: name, evidenceCount: rows.length });
    evidence.push(...rows);
  }
  for (const name of [...(inventory.generatedAnswerReports || []), ...(inventory.generatedSolutionReports || [])]) {
    const file = path.isAbsolute(name) ? name : path.join(cfg.workspaceRoot || process.cwd(), name);
    const raw = await readJson(file, null);
    if (!raw) continue;
    const rows = collectAnswerEvidence(raw).map((row) => ({
      ...row,
      reportFile: path.basename(file),
      source_type: classifySourceType(file, row.raw),
    }));
    loadedReports.push({ file: name, evidenceCount: rows.length });
    evidence.push(...rows);
  }

  const evidenceByKey = new Map();
  for (const row of evidence) {
    const keys = [
      keyFor(row.setKey, row.id, row.displayNo),
      keyFor(row.setKey, row.id, ""),
      keyFor(row.setKey, "", row.displayNo),
    ];
    for (const key of keys) {
      if (!evidenceByKey.has(key)) evidenceByKey.set(key, []);
      evidenceByKey.get(key).push(row);
    }
  }

  const candidates = [];
  const fallbackCandidates = [];
  const mismatches = [];
  const missing = [];
  const applied = [];
  const answerSourceCrosschecked = [];
  const changedBanks = new Map();
  let questionCount = 0;
  let existingAnswerCount = 0;

  for (const bank of banks) {
    for (const question of bank.questions) {
      questionCount += 1;
      if (normalizeAnswer(question.answer)) {
        existingAnswerCount += 1;
        continue;
      }
      const displayNo = question.displayNo || question.questionNo || "";
      const questionSource = crosscheckForQuestion(questionSourceMap, bank.setKey, question);
      const questionSourceOk = hasQuestionSourceCrosscheck(questionSource);
      const matched = evidenceByKey.get(keyFor(bank.setKey, question.id, displayNo))
        || evidenceByKey.get(keyFor(bank.setKey, question.id, ""))
        || evidenceByKey.get(keyFor(bank.setKey, "", displayNo))
        || [];
      const uniqueAnswers = [...new Set(matched.map((item) => item.answer).filter(Boolean))];
      if (!matched.length) {
        const fallbackAnswer = (cfg.solveFromJsQuestionFallback && cfg.allowDirectSolveAfterSourceSearch === true)
          ? solveFromJsQuestionFallback(question)
          : "";
        if (fallbackAnswer) {
          fallbackCandidates.push({
            setKey: bank.setKey,
            id: question.id,
            displayNo,
            currentAnswer: normalizeAnswer(question.answer),
            answer: fallbackAnswer,
            source: "solve_from_js_question",
            source_type: "direct_solve",
            directSolvePolicy: "last_resort_after_full_source_search",
            status: cfg.answerFillMode === "apply_unambiguous" ? "applied" : "candidate_only_not_applied",
          });
          if (cfg.answerFillMode === "apply_unambiguous") {
            const working = changedBanks.get(bank.setKey) || bank.questions;
            const index = working.findIndex((item) => String(item.id) === String(question.id));
            if (index >= 0) {
              const nextQuestions = [...working];
              nextQuestions[index] = { ...nextQuestions[index], answer: fallbackAnswer };
              changedBanks.set(bank.setKey, nextQuestions);
              applied.push({ setKey: bank.setKey, id: question.id, displayNo, answer: fallbackAnswer, source: "solve_from_js_question", source_type: "direct_solve", status: "applied" });
            }
          }
        } else {
          const reason = questionSourceOk ? "answer_source_not_found_after_full_search" : (questionSource?.reason || "final_hold_after_all_sources_checked");
          missing.push({
            setKey: bank.setKey,
            id: question.id,
            displayNo,
            reason: preciseRemainingReasons.has(reason) ? reason : "final_hold_after_all_sources_checked",
            checkedSources: [
              "quick_answer_table_report",
              "quick_answer_pdf",
              "answer_pdf",
              "solution_pdf",
              "answer_solution_crop_report",
              "answer_solution_crop_image",
              "answer_candidate_pages",
              "generated_answer_solution_reports",
              "full_page_solution_crosscheck",
              "direct_solve_last_resort",
            ],
            questionSourceCrosschecked: questionSourceOk,
            fullPageCropCandidates: questionSource?.fullPageCropCandidates || [],
            questionCropCandidates: questionSource?.questionCropCandidates || [],
          });
        }
      } else if (uniqueAnswers.length === 1 && questionSourceOk) {
        const sortedMatched = [...matched].sort((a, b) => sourcePriority(a.source_type) - sourcePriority(b.source_type));
        const best = sortedMatched[0] || matched[0];
        const sourceType = classifySourceType(best?.source || best?.reportFile || "", best?.raw || best);
        const candidate = {
          setKey: bank.setKey,
          id: question.id,
          displayNo,
          currentAnswer: normalizeAnswer(question.answer),
          answer: uniqueAnswers[0],
          evidenceCount: matched.length,
          source: best?.source || best?.reportFile || "answer_source",
          source_type: sourceType,
          fullPageCropCandidates: questionSource?.fullPageCropCandidates || [],
          questionCropCandidates: questionSource?.questionCropCandidates || [],
          crosscheckBasis: "answer source + full page/question crop question source crosscheck",
          status: cfg.answerFillMode === "apply_unambiguous" ? "applied" : "candidate_only_not_applied",
        };
        candidates.push(candidate);
        answerSourceCrosschecked.push(candidate);
        if (cfg.answerFillMode === "apply_unambiguous") {
          const working = changedBanks.get(bank.setKey) || bank.questions;
          const index = working.findIndex((item) => String(item.id) === String(question.id));
          if (index >= 0) {
            const nextQuestions = [...working];
            nextQuestions[index] = { ...nextQuestions[index], answer: uniqueAnswers[0] };
            changedBanks.set(bank.setKey, nextQuestions);
            applied.push({ setKey: bank.setKey, id: question.id, displayNo, answer: uniqueAnswers[0], source: candidate.source, source_type: sourceType, status: "applied" });
          }
        }
      } else if (uniqueAnswers.length === 1 && !questionSourceOk) {
        missing.push({
          setKey: bank.setKey,
          id: question.id,
          displayNo,
          reason: questionSource?.reason || "crop_js_mismatch",
          evidenceCount: matched.length,
          checkedSources: ["answer evidence exists but full page/question crop crosscheck failed"],
        });
      } else {
        mismatches.push({
          setKey: bank.setKey,
          id: question.id,
          displayNo,
          answers: uniqueAnswers,
          evidenceCount: matched.length,
          reason: "answer_mismatch",
        });
      }
    }
  }

  if (cfg.answerFillMode === "apply_unambiguous" && changedBanks.size) {
    const backupRoot = path.join(cfg.generatedRoot, "backup", `js_before_answer_apply_${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`);
    for (const bank of banks) {
      const nextQuestions = changedBanks.get(bank.setKey);
      if (!nextQuestions) continue;
      const backupFile = path.join(backupRoot, path.relative(cfg.jsDir, bank.file));
      await ensureDir(path.dirname(backupFile));
      await fs.promises.copyFile(bank.file, backupFile);
      await fs.promises.writeFile(bank.file, renderArchiveJs(bank.examTitle, nextQuestions), "utf8");
    }
  }

  const answerReport = {
    stage: "10C-answer-fill-and-verify",
    mode: cfg.answerFillMode || "evidence_only_report_first",
    writePolicy: "answer_only_when_enabled_and_unambiguous",
    changedFieldsAllowed: ["answer"],
    forbiddenChanges: ["content", "choices", "solution", "id", "displayNo", "setKey", "tags", "standardUnit"],
    questionCount,
    existingAnswerCount,
    evidenceReportCount: loadedReports.length,
    evidenceCount: evidence.length,
    sourcePriority: ["quick_answer", "answer_pdf", "solution_pdf", "answer_solution_crop", "crop_answer_crosscheck", "generated_answer_report", "direct_solve"],
    questionSourceCrosscheckReport: path.join(cfg.reportsDir, "question_source_crosscheck_report.json"),
    answerSourceCrosscheckedCount: answerSourceCrosschecked.length,
    candidateCount: candidates.length,
    fallbackCandidateCount: fallbackCandidates.length,
    mismatchCount: mismatches.length,
    missingEvidenceCount: missing.length,
    appliedCount: applied.length,
    fallbackPolicy: "all answer sources first; direct_solve only when allowDirectSolveAfterSourceSearch=true",
    status: missing.length || mismatches.length ? "manual_review" : "ok",
  };

  await writeJson(path.join(cfg.reportsDir, "answer_report.json"), answerReport);
  await writeJson(path.join(cfg.reportsDir, "answer_source_crosscheck_report.json"), {
    stage: "10C-answer-fill-and-verify",
    sourcePriority: answerReport.sourcePriority,
    inventorySummary: {
      quickAnswerSourceCount: inventory.quickAnswerSourceCount || 0,
      answerPdfSourceCount: inventory.answerPdfSourceCount || 0,
      solutionPdfSourceCount: inventory.solutionPdfSourceCount || 0,
      answerSolutionCropCount: inventory.answerSolutionCropCount || 0,
    },
    questionSourceCrosscheckedCount: questionSourceReport.crosscheckedCount || 0,
    itemCount: answerSourceCrosschecked.length,
    items: answerSourceCrosschecked,
    status: answerSourceCrosschecked.length ? "ok" : "manual_review",
  });
  await writeJson(path.join(cfg.reportsDir, "answer_candidate_report.json"), {
    stage: "10C-answer-fill-and-verify",
    loadedReports,
    itemCount: candidates.length + fallbackCandidates.length,
    items: [...candidates, ...fallbackCandidates],
    status: candidates.length || fallbackCandidates.length ? "manual_review" : "empty",
  });
  await writeJson(path.join(cfg.reportsDir, "answer_apply_report.json"), {
    stage: "10C-answer-fill-and-verify",
    mode: cfg.answerFillMode || "evidence_only_report_first",
    itemCount: applied.length,
    items: applied,
    status: applied.length ? "ok" : "empty",
  });
  await writeJson(path.join(cfg.reportsDir, "answer_mismatch_report.json"), {
    stage: "10C-answer-fill-and-verify",
    itemCount: mismatches.length,
    items: mismatches,
    status: mismatches.length ? "manual_review" : "ok",
  });
  await writeJson(path.join(cfg.reportsDir, "answer_missing_evidence_report.json"), {
    stage: "10C-answer-fill-and-verify",
    itemCount: missing.length,
    items: missing,
    status: missing.length ? "manual_review" : "ok",
  });
  await writeJson(path.join(cfg.reportsDir, "answer_manual_review_report.json"), {
    stage: "10C-answer-fill-and-verify",
    itemCount: missing.length,
    items: missing,
    status: missing.length ? "manual_review" : "ok",
  });
  const remainingByReason = {};
  for (const item of [...missing, ...mismatches]) {
    const reason = item.reason || "final_hold_after_all_sources_checked";
    remainingByReason[reason] = (remainingByReason[reason] || 0) + 1;
  }
  const sourceCounts = {
    answer_from_quick_answer_count: applied.filter((item) => item.source_type === "quick_answer").length,
    answer_from_answer_pdf_count: applied.filter((item) => item.source_type === "answer_pdf").length,
    answer_from_solution_pdf_count: applied.filter((item) => item.source_type === "solution_pdf").length,
    answer_from_answer_solution_crop_count: applied.filter((item) => item.source_type === "answer_solution_crop").length,
    answer_from_crop_crosscheck_count: applied.filter((item) => item.source_type === "crop_answer_crosscheck").length,
    answer_from_direct_solve_count: applied.filter((item) => item.source_type === "direct_solve").length,
  };
  await writeJson(path.join(cfg.reportsDir, "answer_fill_from_sources_report.json"), {
    stage: "10C-answer-fill-and-verify",
    itemCount: applied.length,
    sourceCounts,
    items: applied,
    status: applied.length ? "ok" : "empty",
  });
  await writeJson(path.join(cfg.reportsDir, "remaining_manual_review_after_full_source_search.json"), {
    stage: "10C-answer-fill-and-verify",
    itemCount: missing.length + mismatches.length,
    remaining_by_precise_reason: remainingByReason,
    allowedReasonsOnly: Object.keys(remainingByReason).every((reason) => preciseRemainingReasons.has(reason)),
    items: [...missing, ...mismatches],
    status: missing.length || mismatches.length ? "manual_review" : "ok",
  });
  await updatePipelineBookSummary(cfg, {
    full_page_crop_count: inventory.fullPageCropCount || 0,
    question_crop_count: inventory.questionCropCount || 0,
    quick_answer_source_count: inventory.quickAnswerSourceCount || 0,
    answer_pdf_source_count: inventory.answerPdfSourceCount || 0,
    solution_pdf_source_count: inventory.solutionPdfSourceCount || 0,
    answer_solution_crop_count: inventory.answerSolutionCropCount || 0,
    answer_source_crosschecked_count: answerSourceCrosschecked.length,
    ...sourceCounts,
    remaining_by_precise_reason: remainingByReason,
  });

  return {
    name: "10C-answer-fill-and-verify",
    status: answerReport.status,
    questionCount,
    candidateCount: candidates.length,
    fallbackCandidateCount: fallbackCandidates.length,
    fallbackAppliedCount: applied.filter((item) => item.source === "solve_from_js_question").length,
    answerSourceCrosscheckedCount: answerSourceCrosschecked.length,
    mismatchCount: mismatches.length,
    appliedCount: applied.length,
  };
}

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

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  stage10c({
    workspaceRoot: path.resolve(args.workspaceRoot || args["workspace-root"] || cwd),
    materialRoot: args.materialRoot ? path.resolve(args.materialRoot) : "",
    generatedRoot: path.resolve(args.generatedRoot || args["generated-root"] || "generated"),
    jsDir: path.resolve(args.jsDir || args["js-dir"] || "generated/js"),
    reportsDir: path.resolve(args.reportsDir || args["reports-dir"] || "generated/reports"),
    answerFillMode: args.answerFillMode || args["answer-fill-mode"] || "evidence_only_report_first",
    solveFromJsQuestionFallback: args.solveFromJsQuestionFallback === "true",
    allowDirectSolveAfterSourceSearch: args.allowDirectSolveAfterSourceSearch === "true",
  }).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
