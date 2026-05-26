import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { collectQuestionBanks, readQuestionBank, renderArchiveJs } from "../lib/js-archive-utils.mjs";
import { ensureDir, listFiles, readJson, writeJson } from "../lib/report-utils.mjs";

const execFileAsync = promisify(execFile);

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function safeName(value) {
  return String(value || "book").replace(/[\\/:*?"<>|]/g, "_");
}

async function latestPatchFile(reportsDir, bookId) {
  const safeBook = safeName(bookId);
  const files = await listFiles(reportsDir, (file) => {
    const name = path.basename(file);
    return name.startsWith(`formula_correction_patch__${safeBook}__`) && name.endsWith(".json");
  });
  const ranked = [];
  for (const file of files) {
    const stat = await fs.promises.stat(file);
    ranked.push({ file, mtimeMs: stat.mtimeMs });
  }
  ranked.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return ranked[0]?.file || "";
}

function parseField(field) {
  if (field === "content") return { kind: "content" };
  if (field === "answer") return { kind: "answer" };
  const match = String(field || "").match(/^choices\[(\d+)\]$/);
  if (!match) return null;
  const index = Number(match[1]);
  if (!Number.isInteger(index) || index < 0 || index > 4) return null;
  return { kind: "choice", index };
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let start = 0;
  while (true) {
    const index = haystack.indexOf(needle, start);
    if (index === -1) return count;
    count += 1;
    start = index + needle.length;
  }
}

function replaceLiteralOnce(current, targetText, replacementText) {
  return String(current).replace(String(targetText), () => String(replacementText));
}

function validateAutoPatch(patch, currentText) {
  const reasons = [];
  const targetText = String(patch?.targetText || "");
  const replacementText = String(patch?.replacementText || "");
  const parsedField = parseField(patch?.field);
  if (patch?.needsReview === true) reasons.push("needs_review_true");
  if (patch?.confidence !== "high") reasons.push("confidence_not_high");
  if (!parsedField) reasons.push("field_not_allowed");
  if (!targetText || !replacementText) reasons.push("target_or_replacement_missing");
  if (targetText === replacementText) reasons.push("same_text");
  if (parsedField?.kind !== "answer" && targetText.length < 4) reasons.push("target_too_short");
  if (parsedField?.kind !== "answer" && /^\$?\^?\d+\$?$/.test(targetText.trim())) reasons.push("standalone_power_or_digit");
  if (parsedField?.kind !== "answer" && (!targetText.includes("$") || !replacementText.includes("$"))) reasons.push("not_formula_dollar_patch");
  if (/[가-힣]/.test(targetText) || /[가-힣]/.test(replacementText)) reasons.push("korean_text_in_patch");
  if (targetText.length > 120 || replacementText.length > 120) reasons.push("possible_full_sentence_rewrite");
  if (parsedField?.kind === "answer" && !String(patch?.evidence?.imagePath || patch?.evidence?.answerSourceImage || "").trim()) reasons.push("answer_source_missing");
  if (patch?.field === "solution") reasons.push("solution_patch_forbidden");
  const occurrenceCount = countOccurrences(currentText, targetText);
  if (occurrenceCount !== 1) reasons.push(occurrenceCount === 0 ? "target_not_found" : "target_not_exact_once");
  return { ok: reasons.length === 0, reasons, occurrenceCount };
}

function applyPatchToQuestion(question, patch) {
  const parsed = parseField(patch.field);
  if (!parsed) return { applied: false, reason: "field_not_allowed" };
  if (parsed.kind === "content") {
    const current = String(question.content || "");
    const validation = validateAutoPatch(patch, current);
    if (!validation.ok) return { applied: false, reasons: validation.reasons, occurrenceCount: validation.occurrenceCount };
    return {
      applied: true,
      nextQuestion: { ...question, content: replaceLiteralOnce(current, patch.targetText, patch.replacementText) },
    };
  }
  if (parsed.kind === "answer") {
    const current = String(question.answer || "");
    const validation = validateAutoPatch(patch, current);
    if (!validation.ok) return { applied: false, reasons: validation.reasons, occurrenceCount: validation.occurrenceCount };
    return {
      applied: true,
      nextQuestion: { ...question, answer: replaceLiteralOnce(current, patch.targetText, patch.replacementText) },
    };
  }
  const choices = Array.isArray(question.choices) ? [...question.choices] : [];
  const current = String(choices[parsed.index] || "");
  const validation = validateAutoPatch(patch, current);
  if (!validation.ok) return { applied: false, reasons: validation.reasons, occurrenceCount: validation.occurrenceCount };
  choices[parsed.index] = replaceLiteralOnce(current, patch.targetText, patch.replacementText);
  return { applied: true, nextQuestion: { ...question, choices } };
}

async function verifyChangedFiles(changedFiles) {
  const checks = [];
  for (const item of changedFiles) {
    try {
      await execFileAsync("node", ["--check", item.file], { timeout: 30000 });
      checks.push({ file: item.file, nodeCheck: "pass" });
    } catch (error) {
      checks.push({ file: item.file, nodeCheck: "fail", error: String(error.message || error).split("\n")[0] });
      continue;
    }
    try {
      const reparsed = await readQuestionBank(item.file);
      item.questionBankParse = Array.isArray(reparsed.questions) ? "pass" : "fail";
      checks[checks.length - 1].questionBankParse = item.questionBankParse;
    } catch (error) {
      item.questionBankParse = "fail";
      checks[checks.length - 1].questionBankParse = "fail";
      checks[checks.length - 1].parseError = String(error.message || error).split("\n")[0];
    }
  }
  return checks;
}

function candidateQuestionIds(rawId) {
  const value = String(rawId || "");
  const ids = [value];
  const prefix = value.match(/^(\d+)_\d+$/)?.[1];
  if (prefix && !ids.includes(prefix)) ids.push(prefix);
  return ids;
}

async function backupChangedFile(sourceFile, backupRoot, jsDir) {
  const rel = path.relative(jsDir, sourceFile);
  const dest = path.join(backupRoot, rel);
  await ensureDir(path.dirname(dest));
  await fs.promises.copyFile(sourceFile, dest);
  return dest;
}

export default async function stage12dApplyGeminiFormulaPatches(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  const stamp = dateStamp();
  if (cfg.makeGeminiFormulaPatchAutoApply !== true) {
    const report = {
      stage: "12d-apply-gemini-formula-patches",
      status: "ok",
      skipped: true,
      reason: "makeGeminiFormulaPatchAutoApply=false",
    };
    await writeJson(path.join(cfg.reportsDir, `formula_patch_apply_report__${safeName(bookId)}__${stamp}.json`), report);
    return { name: "12d-apply-gemini-formula-patches", status: "ok", skipped: true };
  }

  const patchFile = cfg.formulaCorrectionPatchFile || await latestPatchFile(cfg.reportsDir, bookId);
  if (!patchFile) {
    const report = {
      stage: "12d-apply-gemini-formula-patches",
      status: "ok",
      skipped: true,
      reason: "formula_correction_patch_missing",
    };
    await writeJson(path.join(cfg.reportsDir, `formula_patch_apply_report__${safeName(bookId)}__${stamp}.json`), report);
    return { name: "12d-apply-gemini-formula-patches", status: "ok", skipped: true };
  }

  const raw = await readJson(patchFile, {});
  const patches = Array.isArray(raw?.patches) ? raw.patches : Array.isArray(raw) ? raw : [];
  const banks = await collectQuestionBanks(cfg.jsDir);
  const bySet = new Map(banks.map((bank) => [bank.setKey, bank]));
  const backupRoot = path.join(cfg.generatedRoot, "backup", `js_before_formula_auto_apply_${stamp}`);
  const applications = [];
  const rejections = [];
  const changedBanks = new Map();

  for (const patch of patches) {
    const setKey = String(patch?.setKey || "");
    const id = String(patch?.id || "");
    const bank = bySet.get(setKey);
    if (!bank) {
      rejections.push({ setKey, id, field: patch?.field || "", status: "rejected", reasons: ["setKey_not_found"] });
      continue;
    }
    const working = changedBanks.get(setKey) || bank.questions;
    const candidateIds = candidateQuestionIds(id);
    const index = working.findIndex((question) => candidateIds.includes(String(question.id)));
    if (index < 0) {
      rejections.push({ setKey, id, field: patch?.field || "", status: "rejected", reasons: ["id_not_found"] });
      continue;
    }
    const result = applyPatchToQuestion(working[index], patch);
    if (!result.applied) {
      rejections.push({
        setKey,
        id,
        field: patch?.field || "",
        targetText: patch?.targetText || "",
        replacementText: patch?.replacementText || "",
        status: "rejected",
        reasons: result.reasons || [result.reason || "unknown"],
        occurrenceCount: result.occurrenceCount,
      });
      continue;
    }
    const nextQuestions = [...working];
    nextQuestions[index] = result.nextQuestion;
    changedBanks.set(setKey, nextQuestions);
    applications.push({
      setKey,
      id,
      field: patch.field,
      targetText: patch.targetText,
      replacementText: patch.replacementText,
      status: "applied",
    });
  }

  const changedFiles = [];
  for (const [setKey, questions] of changedBanks) {
    const bank = bySet.get(setKey);
    const backupFile = await backupChangedFile(bank.file, backupRoot, cfg.jsDir);
    await fs.promises.writeFile(bank.file, renderArchiveJs(bank.examTitle, questions), "utf8");
    changedFiles.push({ setKey, file: bank.file, backupFile });
  }
  const verificationChecks = await verifyChangedFiles(changedFiles);
  const verificationFailed = verificationChecks.some((item) => item.nodeCheck !== "pass" || item.questionBankParse !== "pass");

  const report = {
    stage: "12d-apply-gemini-formula-patches",
    mode: "APPLY_GEMINI_FORMULA_PATCH",
    createdAt: new Date().toISOString(),
    patchFile,
    jsDir: cfg.jsDir,
    backupRoot,
    patchCount: patches.length,
    appliedCount: applications.length,
    rejectedCount: rejections.length,
    changedFileCount: changedFiles.length,
    changedFiles,
    applications,
    rejections,
    verificationChecks,
    status: verificationFailed ? "manual_review" : "ok",
    note: "Only high-confidence exact-once Gemini first-pass patches were applied. Rejected patches are left for manual_review.",
  };
  const manualReview = {
    stage: "12d-apply-gemini-formula-patches",
    mode: "APPLY_GEMINI_FORMULA_PATCH",
    createdAt: report.createdAt,
    patchFile,
    itemCount: rejections.length,
    items: rejections,
    status: rejections.length ? "manual_review" : "ok",
  };
  await writeJson(path.join(cfg.reportsDir, `formula_patch_apply_report__${safeName(bookId)}__${stamp}.json`), report);
  await writeJson(path.join(cfg.reportsDir, `formula_patch_manual_review__${safeName(bookId)}__${stamp}.json`), manualReview);
  await writeJson(path.join(cfg.reportsDir, "formula_patch_apply_report.json"), report);
  await writeJson(path.join(cfg.reportsDir, "formula_patch_manual_review.json"), manualReview);
  return {
    name: "12d-apply-gemini-formula-patches",
    status: report.status,
    patchCount: patches.length,
    appliedCount: applications.length,
    rejectedCount: rejections.length,
    changedFileCount: changedFiles.length,
  };
}
