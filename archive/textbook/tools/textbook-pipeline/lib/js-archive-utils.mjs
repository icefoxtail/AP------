import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { listFiles } from "./report-utils.mjs";

export const archiveAllowedFields = new Set([
  "id", "level", "category", "originalCategory", "standardCourse", "standardUnitKey",
  "standardUnit", "standardUnitOrder", "questionType", "layoutTag", "tags", "wide",
  "content", "choices", "image", "answer", "solution",
]);

export async function readQuestionBank(jsFile) {
  const code = await fs.promises.readFile(jsFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: jsFile, timeout: 5000 });
  return {
    examTitle: sandbox.window.examTitle || "",
    questions: Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [],
  };
}

export async function listArchiveJs(jsDir) {
  const files = await listFiles(jsDir, (file) => file.endsWith(".js"));
  return files.filter(isOperationalJsFile).sort((a, b) => a.localeCompare(b, "ko"));
}

export function isOperationalJsFile(file) {
  const normalized = String(file || "").replaceAll("\\", "/");
  if (!/\/generated\//i.test(normalized)) return normalized.endsWith(".js");
  if (!/\/generated\/js\/[^/].*\.js$/i.test(normalized)) return false;
  if (/\/generated\/(?:backup|review_pack|final_clean|draft_content|reports)\//i.test(normalized)) return false;
  if (/\/archive\/textbook\/generated\/js\//i.test(normalized)) return false;
  return true;
}

export function inferBookPart(jsFile) {
  return jsFile.split(path.sep).includes("workbook") ? "workbook" : "textbook";
}

export function inferSetKey(jsFile) {
  return path.basename(jsFile, ".js");
}

export async function collectQuestionBanks(jsDir) {
  const files = await listArchiveJs(jsDir);
  const banks = [];
  for (const file of files) {
    const parsed = await readQuestionBank(file);
    banks.push({ file, setKey: inferSetKey(file), bookPart: inferBookPart(file), ...parsed });
  }
  return banks;
}

export function findForbiddenFields(question) {
  return Object.keys(question).filter((key) => !archiveAllowedFields.has(key));
}

export function renderArchiveJs(examTitle, questions) {
  return `window.examTitle = ${JSON.stringify(examTitle)};\n\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
}
