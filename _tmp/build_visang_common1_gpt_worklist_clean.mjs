import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const generated = path.join(root, "archive", "textbook", "generated");
const jsRoot = path.join(generated, "js");
const freshRoot = path.join(generated, "review_pack", "by_unit_fresh");
const reportsDir = path.join(generated, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(reportsDir, `visang_common1_gpt_worklist_clean_${stamp}.json`);
const outMd = path.join(reportsDir, `visang_common1_gpt_worklist_clean_${stamp}.md`);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function parseBank(jsFile) {
  const code = fs.readFileSync(jsFile, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: jsFile, timeout: 5000 });
  if (!Array.isArray(sandbox.window.questionBank)) throw new Error(`questionBank not array: ${jsFile}`);
  return sandbox.window.questionBank;
}

function hasMojibake(text) {
  return /�|占|揶|癒|釉|野|疫|獄|癰|鍮꾩긽|怨듯넻|섑븰|숈뒿|以묐떒|寃|援ы븯/.test(String(text ?? ""));
}

function isSimpleObjectiveAnswer(answer) {
  const s = String(answer ?? "").trim();
  return /^[1-5](\s*,\s*[1-5])*$/.test(s) || /^[①②③④⑤](\s*,\s*[①②③④⑤])*$/.test(s);
}

function issueTypesForQuestion(q) {
  const issues = [];
  const content = String(q.content ?? "");
  const answer = String(q.answer ?? "");
  const solution = String(q.solution ?? "");
  const choices = Array.isArray(q.choices) ? q.choices : null;
  if (!content.trim()) issues.push("content_missing");
  if (content.trim() && hasMojibake(content)) issues.push("content_mojibake_or_ocr_suspected");
  if (!choices) issues.push("choices_not_array");
  if (choices && choices.length > 0 && choices.length !== 5) issues.push("objective_choices_not_5");
  if (!answer.trim()) issues.push("answer_missing");
  if (answer.trim() && choices && choices.length === 5 && !isSimpleObjectiveAnswer(answer)) issues.push("objective_answer_format_suspected");
  if (answer.trim() && hasMojibake(answer)) issues.push("answer_mojibake_or_ocr_suspected");
  if (!solution.trim()) issues.push("solution_missing");
  return issues;
}

const cropIndexRows = [];
for (const cropIndexFile of walk(freshRoot).filter((file) => path.basename(file) === "crop_index.json")) {
  const unitDir = path.dirname(cropIndexFile);
  const unit = path.basename(unitDir);
  const rows = JSON.parse(fs.readFileSync(cropIndexFile, "utf8"));
  for (const row of rows) {
    cropIndexRows.push({ ...row, unit, cropIndexFile: rel(cropIndexFile), unitDir: rel(unitDir) });
  }
}

const cropBySetAndId = new Map();
for (const row of cropIndexRows) {
  cropBySetAndId.set(`${row.setKey}::${row.jsId}`, row);
}

const jsFiles = walk(jsRoot)
  .filter((file) => file.endsWith(".js") && path.basename(file).includes("비상_공통수학1"))
  .sort((a, b) => rel(a).localeCompare(rel(b), "ko"));

const files = [];
const items = [];
for (const jsFile of jsFiles) {
  const setKey = path.basename(jsFile, ".js");
  const bank = parseBank(jsFile);
  const fileItems = [];
  for (const q of bank) {
    const id = q.id;
    const issueTypes = issueTypesForQuestion(q);
    if (!issueTypes.length) continue;
    const crop = cropBySetAndId.get(`${setKey}::${id}`) || null;
    const item = {
      targetFile: rel(jsFile),
      setKey,
      id,
      displayNo: crop?.displayNo ?? null,
      pageNo: crop?.pageNo ?? null,
      issueTypes,
      contentPreview: String(q.content ?? "").slice(0, 260),
      choices: Array.isArray(q.choices) ? q.choices : null,
      answer: q.answer ?? "",
      solution: q.solution ?? "",
      evidence: {
        unit: crop?.unit ?? null,
        cropIndexFile: crop?.cropIndexFile ?? null,
        cropImagePath: crop?.cropImagePath ?? null,
        sourceCropPath: crop?.sourceCropPath ?? null,
        status: crop?.status ?? null,
      },
      gptInstruction: "Use full-page/source evidence first when available; use crop as close-up evidence. Do not invent content.",
    };
    items.push(item);
    fileItems.push(item);
  }
  files.push({
    targetFile: rel(jsFile),
    setKey,
    questionCount: bank.length,
    problemItemCount: fileItems.length,
    issueTypeCounts: fileItems.flatMap((item) => item.issueTypes).reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}),
  });
}

const issueTypeCounts = items.flatMap((item) => item.issueTypes).reduce((acc, type) => {
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  scope: "비상 공통수학1 중앙 generated/js 15개",
  rule: "clean worklist; normal question marks and circled objective answers are not OCR issues",
  filesChecked: jsFiles.length,
  problemItems: items.length,
  issueTypeCounts,
  files,
  items,
};

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");

const lines = [
  "# Visang Common Math 1 Clean GPT Worklist",
  "",
  `- Generated: ${report.generatedAt}`,
  `- Files checked: ${report.filesChecked}`,
  `- Problem items: ${report.problemItems}`,
  "",
  "## Issue Counts",
  "",
  ...Object.entries(issueTypeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => `- ${type}: ${count}`),
  "",
  "## GPT Target Items",
  "",
  ...items.map((item) => [
    `### ${item.targetFile} #${item.id}${item.displayNo ? ` (${item.displayNo})` : ""}`,
    `- Issues: ${item.issueTypes.join(", ")}`,
    `- Page: ${item.pageNo ?? "unknown"}`,
    `- Crop: ${item.evidence.sourceCropPath ?? "missing crop map"}`,
    `- Content preview: ${item.contentPreview.replace(/\s+/g, " ")}`,
    `- Answer: ${String(item.answer).replace(/\s+/g, " ") || "(blank)"}`,
    `- Solution: ${String(item.solution).trim() ? "(present)" : "(blank)"}`,
    "",
  ].join("\n")),
];

fs.writeFileSync(outMd, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ outJson: rel(outJson), outMd: rel(outMd), filesChecked: jsFiles.length, problemItems: items.length, issueTypeCounts }, null, 2));
