import fs from "node:fs";
import path from "node:path";
import { archiveAllowedFields, readQuestionBank } from "./js-archive-utils.mjs";
import { exists, listFiles } from "./report-utils.mjs";

export const REQUIRED_RULE_ROLES = [
  "js_archive_rulebook",
  "standard_unit_master_table",
  "js_conversion_prompt",
  "integrity_review",
  "math_error_protocol",
  "js_archive_first_review",
];

const ROLE_PATTERNS = [
  ["standard_unit_master_table", [/표준단원키|standard.*unit|master.*table/i]],
  ["js_archive_rulebook", [/JS아카이브룰북|archive.*rulebook/i]],
  ["js_conversion_prompt", [/JS_변환_프롬프트|변환.*프롬프트|conversion.*prompt/i]],
  ["integrity_review", [/무결성검수|integrity/i]],
  ["math_error_protocol", [/수학.*오류.*검증|math.*error/i]],
  ["js_archive_first_review", [/1차.*검수|first.*review/i]],
];

export async function readTextExcerpt(file, max = 1200) {
  try {
    const text = await fs.promises.readFile(file, "utf8");
    return text.slice(0, max);
  } catch {
    return "";
  }
}

export function detectRuleRole(file) {
  const name = path.basename(file);
  for (const [role, patterns] of ROLE_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(name))) return role;
  }
  return "reference";
}

export async function collectRuleFiles(rulesDir) {
  const files = await listFiles(rulesDir);
  const readFiles = [];
  for (const file of files.sort((a, b) => a.localeCompare(b, "ko"))) {
    readFiles.push({
      file,
      detectedRole: detectRuleRole(file),
      excerpt: await readTextExcerpt(file),
    });
  }
  const foundRoles = new Set(readFiles.map((item) => item.detectedRole));
  return {
    rulesDir,
    readFiles,
    missingRequiredRoles: REQUIRED_RULE_ROLES.filter((role) => !foundRoles.has(role)),
  };
}

function cleanCell(value) {
  return String(value || "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/<br\s*\/?>/gi, " ")
    .trim();
}

function normalizeHint(value) {
  return String(value || "").replace(/[\s_()[\]{}.,:;'"`|-]+/g, "").toLowerCase();
}

function courseFromHeading(heading, fallbackKey = "") {
  const text = cleanCell(heading);
  const key = String(fallbackKey || "");
  if (/^M1-/.test(key)) return "M1";
  if (/^M2-/.test(key)) return "M2";
  if (/^M3-/.test(key)) return "M3";
  if (/^H22-C2-/.test(key)) return "H22-C2";
  if (/^H22-C-/.test(key)) return "H22-C";
  const m = text.match(/\b(M[123]|H22-C2|H22-C|H15-[A-Z0-9-]+)\b/);
  return m ? m[1] : text;
}

export function parseMasterTableMarkdown(text, masterTableFile = "") {
  const rows = [];
  const warnings = [];
  let currentHeading = "";
  for (const line of String(text || "").split(/\r?\n/)) {
    const heading = line.match(/^#{2,6}\s+(.+)$/);
    if (heading) {
      currentHeading = heading[1];
      continue;
    }
    if (!line.trim().startsWith("|")) continue;
    if (/^\|\s*-+/.test(line) || /\bKey\b/i.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map(cleanCell);
    if (cells.length < 3) continue;
    const [key, unit, orderRaw] = cells;
    if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)*-\d{2,3}$/.test(key) && !/^M[123]-\d{2}$/.test(key)) continue;
    const order = Number(String(orderRaw).replace(/[^\d]/g, ""));
    const standardCourse = courseFromHeading(currentHeading, key);
    const aliases = [unit, unit.replace(/\s+/g, ""), unit.split(/[·,\/]/g).map((part) => part.trim()).filter(Boolean)].flat();
    rows.push({
      standardCourse,
      standardUnitKey: key,
      standardUnit: unit,
      standardUnitOrder: Number.isFinite(order) ? order : 999,
      aliases: [...new Set(aliases.filter(Boolean))],
      unitNameHints: [...new Set(aliases.map(normalizeHint).filter(Boolean))],
      sourceHeading: currentHeading,
    });
  }
  if (!rows.length) warnings.push({ file: masterTableFile, warning: "no_master_table_rows_parsed" });
  return { rows, warnings };
}

export async function loadMasterTableFile(masterTableFile) {
  if (!masterTableFile || !(await exists(masterTableFile))) return { rows: [], warnings: [{ warning: "master_table_file_missing" }] };
  const text = await fs.promises.readFile(masterTableFile, "utf8");
  return parseMasterTableMarkdown(text, masterTableFile);
}

function sampleQuestionFields(questions) {
  return [...new Set(questions.flatMap((question) => Object.keys(question || {})))].sort();
}

export async function collectArchiveSamples(archiveRoot, limit = 5) {
  const candidates = await listFiles(archiveRoot, (file) => {
    if (!file.endsWith(".js")) return false;
    const normalized = file.replaceAll("\\", "/");
    return !/node_modules|tools\/textbook-pipeline|generated\/reports/.test(normalized);
  });
  const samples = [];
  for (const file of candidates.sort((a, b) => a.localeCompare(b, "ko"))) {
    try {
      const bank = await readQuestionBank(file);
      if (!bank.questions.length) continue;
      samples.push({
        file,
        examTitle: bank.examTitle,
        questionCount: bank.questions.length,
        observedQuestionFields: sampleQuestionFields(bank.questions.slice(0, 3)),
        imageFieldUsageExamples: bank.questions.filter((q) => q.image).slice(0, 3).map((q) => ({ id: q.id, image: q.image })),
        tagsUsageExamples: bank.questions.filter((q) => Array.isArray(q.tags) && q.tags.length).slice(0, 3).map((q) => ({ id: q.id, tags: q.tags })),
      });
      if (samples.length >= limit) break;
    } catch {
      // Ignore non-archive JS. The gate only needs valid samples.
    }
  }
  return samples;
}

export function buildArchiveShapeReference(samples) {
  return {
    sampleFiles: samples.map((sample) => sample.file),
    observedQuestionFields: [...new Set(samples.flatMap((sample) => sample.observedQuestionFields))].sort(),
    archiveCompatibleAllowedFields: [...archiveAllowedFields].sort(),
    imageFieldUsageExamples: samples.flatMap((sample) => sample.imageFieldUsageExamples).slice(0, 10),
    tagsUsageExamples: samples.flatMap((sample) => sample.tagsUsageExamples).slice(0, 10),
    windowShape: {
      examTitle: "window.examTitle",
      questionBank: "window.questionBank",
    },
  };
}
