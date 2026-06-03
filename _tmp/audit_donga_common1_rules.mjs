import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const bookRoot = path.join(root, "archive", "textbook", "_동아_고등_공통수학1_교과서");
const generatedRoot = path.join(bookRoot, "generated");
const jsRoot = path.join(generatedRoot, "js");
const outDir = path.join(generatedRoot, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `donga_common1_rules_audit_${stamp}.json`);
const outMd = path.join(outDir, `donga_common1_rules_audit_${stamp}.md`);

const mojibakeFragments = ["占", "�", "鍮", "怨", "??쑴", "餓", "野", "湲", "吏", "誤", "誘", "??"];
const placeholderPatterns = [/pending/i, /unavailable/i, /확인\s*필요/, /검토\s*필요/, /manual[_\s-]*review/i, /^\s*[-–—]?\s*$/];

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

function addIssue(issues, file, id, field, type, evidence = "") {
  issues.push({ file: rel(file), id: id ?? null, field, type, evidence: String(evidence).slice(0, 240) });
}

function parseBank(file, code, issues) {
  try {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: file, timeout: 5000 });
    if (!Array.isArray(sandbox.window.questionBank)) {
      addIssue(issues, file, null, "questionBank", "missing_questionBank_array", "window.questionBank is not an array");
      return null;
    }
    return sandbox.window.questionBank;
  } catch (error) {
    addIssue(issues, file, null, "parse", "vm_parse_or_eval_error", error.message || error);
    return null;
  }
}

function hasMojibake(value) {
  const text = String(value ?? "");
  if (mojibakeFragments.some((fragment) => text.includes(fragment))) return true;
  const cjk = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length;
  const hangul = (text.match(/[가-힣]/g) || []).length;
  return cjk >= 2 && cjk > hangul;
}

function isPlaceholder(value) {
  const text = String(value ?? "").trim();
  return placeholderPatterns.some((pattern) => pattern.test(text));
}

function pathExistsFromImage(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return true;
  const normalized = imagePath.replaceAll("/", path.sep);
  const candidates = [
    path.join(root, normalized),
    path.join(generatedRoot, normalized),
    path.join(bookRoot, normalized),
    path.join(root, "archive", "textbook", normalized),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

const jsFiles = walk(jsRoot).filter((file) => file.endsWith(".js")).sort((a, b) => rel(a).localeCompare(rel(b), "ko"));
const issues = [];
const files = [];

for (const file of jsFiles) {
  const code = fs.readFileSync(file, "utf8");
  const fileSummary = { file: rel(file), syntaxPass: false, questionCount: 0, imageRefs: 0, issueCount: 0 };

  try {
    execFileSync("node", ["--check", file], { stdio: "pipe" });
    fileSummary.syntaxPass = true;
  } catch (error) {
    addIssue(issues, file, null, "syntax", "node_check_failed", error.stderr || error.message || error);
  }

  const bank = parseBank(file, code, issues);
  if (!bank) {
    files.push(fileSummary);
    continue;
  }

  fileSummary.questionCount = bank.length;
  const ids = new Set();
  for (const [index, q] of bank.entries()) {
    const id = typeof q?.id === "number" ? q.id : index + 1;
    if (ids.has(id)) addIssue(issues, file, id, "id", "duplicate_id", `duplicate id ${id}`);
    ids.add(id);
    if (typeof q?.id !== "number") addIssue(issues, file, id, "id", "id_missing_or_not_number", q?.id);
    if (typeof q?.id === "number" && q.id !== index + 1) addIssue(issues, file, id, "id", "id_sequence_gap", `expected ${index + 1}, got ${q.id}`);

    const content = String(q?.content ?? "");
    const answer = String(q?.answer ?? "");
    const solution = String(q?.solution ?? "");
    const choices = q?.choices;

    if (!content.trim()) addIssue(issues, file, id, "content", "content_missing", "blank content");
    if (content.trim() && content.trim().length < 8) addIssue(issues, file, id, "content", "content_too_short", content);
    if (hasMojibake(content)) addIssue(issues, file, id, "content", "content_mojibake_suspected", content);
    if (isPlaceholder(content)) addIssue(issues, file, id, "content", "content_placeholder_suspected", content);

    if (!Array.isArray(choices)) addIssue(issues, file, id, "choices", "choices_not_array", typeof choices);
    if (Array.isArray(choices) && choices.length && choices.length !== 5) addIssue(issues, file, id, "choices", "objective_choices_not_5", `choices length ${choices.length}`);
    if (Array.isArray(choices)) {
      choices.forEach((choice, choiceIndex) => {
        if (!String(choice ?? "").trim()) addIssue(issues, file, id, "choices", "choice_blank", `choice ${choiceIndex + 1}`);
        if (hasMojibake(choice)) addIssue(issues, file, id, "choices", "choice_mojibake_suspected", choice);
      });
    }

    if (!answer.trim() || isPlaceholder(answer)) addIssue(issues, file, id, "answer", "answer_missing", answer || "blank answer");
    if (hasMojibake(answer)) addIssue(issues, file, id, "answer", "answer_mojibake_suspected", answer);
    if (!solution.trim() || isPlaceholder(solution)) addIssue(issues, file, id, "solution", "solution_missing", solution || "blank solution");
    if (hasMojibake(solution)) addIssue(issues, file, id, "solution", "solution_mojibake_suspected", solution);
    if (q?.image) {
      fileSummary.imageRefs += 1;
      if (!pathExistsFromImage(q.image)) addIssue(issues, file, id, "image", "image_path_missing", q.image);
    }
  }

  fileSummary.issueCount = issues.filter((issue) => issue.file === rel(file)).length;
  files.push(fileSummary);
}

const issueTypeCounts = issues.reduce((acc, issue) => {
  acc[issue.type] = (acc[issue.type] || 0) + 1;
  return acc;
}, {});
const fieldCounts = issues.reduce((acc, issue) => {
  acc[issue.field] = (acc[issue.field] || 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  scope: "동아 공통수학1 generated/js rules audit",
  filesChecked: files.length,
  totalQuestions: files.reduce((sum, file) => sum + file.questionCount, 0),
  totalImageRefs: files.reduce((sum, file) => sum + file.imageRefs, 0),
  issueCount: issues.length,
  fieldCounts,
  issueTypeCounts,
  files,
  issues,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");
fs.writeFileSync(outMd, [
  "# 동아 공통수학1 rules 전수검사",
  "",
  `- 검사 JS 파일: ${report.filesChecked}`,
  `- 총 문항: ${report.totalQuestions}`,
  `- 이미지 참조: ${report.totalImageRefs}`,
  `- 문제 수: ${report.issueCount}`,
  `- 필드별: ${JSON.stringify(report.fieldCounts)}`,
  `- 타입별: ${JSON.stringify(report.issueTypeCounts)}`,
  "",
  "## 파일별",
  "",
  "| file | questions | imageRefs | issues | syntax |",
  "|---|---:|---:|---:|---|",
  ...files.map((file) => `| ${file.file} | ${file.questionCount} | ${file.imageRefs} | ${file.issueCount} | ${file.syntaxPass ? "pass" : "fail"} |`),
  "",
  "## 문제 항목",
  "",
  ...issues.slice(0, 500).map((issue) => `- ${issue.file} #${issue.id ?? "-"} ${issue.field}/${issue.type}: ${issue.evidence}`),
  issues.length > 500 ? `- ... ${issues.length - 500} more` : "",
].join("\n"), "utf8");

console.log(JSON.stringify({
  outJson: rel(outJson),
  outMd: rel(outMd),
  filesChecked: report.filesChecked,
  totalQuestions: report.totalQuestions,
  totalImageRefs: report.totalImageRefs,
  issueCount: report.issueCount,
  fieldCounts: report.fieldCounts,
  issueTypeCounts: report.issueTypeCounts,
}, null, 2));
