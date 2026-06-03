import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const bookRoot = path.join(root, "archive", "textbook", "_비상교육_ 고등_공통수학2(김원경)_교과서");
const generatedRoot = path.join(bookRoot, "generated");
const jsRoot = path.join(generatedRoot, "js");
const outDir = path.join(generatedRoot, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `visang_common2_rules_audit_${stamp}.json`);
const outMd = path.join(outDir, `visang_common2_rules_audit_${stamp}.md`);

const hardMojibake = /�|占|\?\?쑴|餓|野|鍮|怨|湲|吏|誤|誘/;
const placeholderPatterns = [/pending/i, /unavailable/i, /확인\s*필요/, /검토\s*필요/, /manual[_\s-]*review/i];

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

function addIssue(issues, stage, file, id, field, type, evidence = "", severity = "warn") {
  issues.push({ stage, severity, file: rel(file), id: id ?? null, field, type, evidence: String(evidence).slice(0, 240) });
}

function parseBank(file, issues) {
  try {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
    if (!Array.isArray(sandbox.window.questionBank)) {
      addIssue(issues, 1, file, null, "questionBank", "missing_questionBank_array", "window.questionBank is not an array", "error");
      return null;
    }
    return { examTitle: sandbox.window.examTitle || "", bank: sandbox.window.questionBank };
  } catch (error) {
    addIssue(issues, 1, file, null, "parse", "vm_parse_or_eval_error", error.message || error, "error");
    return null;
  }
}

function looksMojibake(value) {
  const text = String(value ?? "");
  if (hardMojibake.test(text)) return true;
  const hangul = (text.match(/[가-힣]/g) || []).length;
  const cjk = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length;
  return cjk >= 2 && cjk > hangul;
}

function isPlaceholder(value) {
  const text = String(value ?? "").trim();
  return placeholderPatterns.some((pattern) => pattern.test(text));
}

function imageCandidates(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return [];
  const normalized = imagePath.replaceAll("/", path.sep);
  return [
    path.join(root, "archive", normalized),
    path.join(root, normalized),
    path.join(generatedRoot, normalized),
    path.join(bookRoot, normalized),
    path.join(root, "archive", "textbook", normalized),
  ];
}

function pngInfo(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 24 || buf.toString("ascii", 1, 4) !== "PNG") {
    return { bytes: buf.length, isPng: false, width: null, height: null };
  }
  return { bytes: buf.length, isPng: true, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const issues = [];
const files = [];
const jsFiles = walk(jsRoot).filter((file) => file.endsWith(".js")).sort((a, b) => rel(a).localeCompare(rel(b), "ko"));

for (const file of jsFiles) {
  const summary = { file: rel(file), syntaxPass: false, questionCount: 0, imageRefs: 0, stage1Issues: 0, stage2Issues: 0, stage3Issues: 0 };
  try {
    execFileSync("node", ["--check", file], { stdio: "pipe" });
    summary.syntaxPass = true;
  } catch (error) {
    addIssue(issues, 1, file, null, "syntax", "node_check_failed", error.stderr || error.message || error, "error");
  }
  const parsed = parseBank(file, issues);
  if (!parsed) {
    files.push(summary);
    continue;
  }
  if (!parsed.examTitle.trim()) addIssue(issues, 1, file, null, "examTitle", "examTitle_missing", "blank examTitle", "error");
  if (looksMojibake(parsed.examTitle)) addIssue(issues, 2, file, null, "examTitle", "examTitle_mojibake_suspected", parsed.examTitle, "error");
  summary.questionCount = parsed.bank.length;
  const ids = new Set();
  for (const [index, q] of parsed.bank.entries()) {
    const id = typeof q?.id === "number" ? q.id : index + 1;
    if (ids.has(id)) addIssue(issues, 1, file, id, "id", "duplicate_id", `duplicate id ${id}`, "error");
    ids.add(id);
    if (typeof q?.id !== "number") addIssue(issues, 1, file, id, "id", "id_missing_or_not_number", q?.id, "error");
    if (typeof q?.id === "number" && q.id !== index + 1) addIssue(issues, 1, file, id, "id", "id_sequence_gap", `expected ${index + 1}, got ${q.id}`);

    const content = String(q?.content ?? "");
    const answer = String(q?.answer ?? "");
    const solution = String(q?.solution ?? "");
    const choices = q?.choices;
    const objective = Array.isArray(choices) && choices.length > 0 || /객관|선택/.test(String(q?.questionType ?? q?.type ?? ""));

    if (!content.trim()) addIssue(issues, 2, file, id, "content", "content_missing", "blank content", "error");
    if (content.trim() && content.trim().length < 8) addIssue(issues, 2, file, id, "content", "content_too_short", content);
    if (looksMojibake(content)) addIssue(issues, 2, file, id, "content", "content_mojibake_suspected", content, "error");
    if (isPlaceholder(content)) addIssue(issues, 2, file, id, "content", "content_placeholder_suspected", content, "error");
    if (!Array.isArray(choices)) addIssue(issues, 2, file, id, "choices", "choices_not_array", typeof choices, "error");
    if (objective && Array.isArray(choices) && choices.length !== 5) addIssue(issues, 2, file, id, "choices", "objective_choices_not_5", `choices length ${choices.length}`, "error");
    if (Array.isArray(choices)) choices.forEach((choice, choiceIndex) => {
      if (!String(choice ?? "").trim()) addIssue(issues, 2, file, id, "choices", "choice_blank", `choice ${choiceIndex + 1}`, "error");
      if (looksMojibake(choice)) addIssue(issues, 2, file, id, "choices", "choice_mojibake_suspected", choice, "error");
    });
    if (!answer.trim() || isPlaceholder(answer)) addIssue(issues, 2, file, id, "answer", "answer_missing", answer || "blank answer", "error");
    if (looksMojibake(answer)) addIssue(issues, 2, file, id, "answer", "answer_mojibake_suspected", answer, "error");
    if (!solution.trim() || isPlaceholder(solution)) addIssue(issues, 2, file, id, "solution", "solution_missing", solution || "blank solution", "error");
    if (looksMojibake(solution)) addIssue(issues, 2, file, id, "solution", "solution_mojibake_suspected", solution, "error");
    if (q?.image) {
      summary.imageRefs += 1;
      const resolved = imageCandidates(q.image).find((candidate) => fs.existsSync(candidate));
      if (!resolved) addIssue(issues, 3, file, id, "image", "image_path_missing", q.image, "error");
      else {
        const info = pngInfo(resolved);
        if (!info.isPng) addIssue(issues, 3, file, id, "image", "image_not_png", rel(resolved), "error");
        if (info.isPng && (info.width < 80 || info.height < 40)) addIssue(issues, 3, file, id, "image", "image_tiny", `${rel(resolved)} ${info.width}x${info.height}`, "error");
        if (String(q.image).startsWith("assets/") && !String(q.image).startsWith("assets/images/")) {
          addIssue(issues, 3, file, id, "image", "image_tag_not_archive_assets_images", q.image, "warn");
        }
      }
    }
  }
  summary.stage1Issues = issues.filter((issue) => issue.file === rel(file) && issue.stage === 1).length;
  summary.stage2Issues = issues.filter((issue) => issue.file === rel(file) && issue.stage === 2).length;
  summary.stage3Issues = issues.filter((issue) => issue.file === rel(file) && issue.stage === 3).length;
  files.push(summary);
}

const countBy = (keyFn) => issues.reduce((acc, issue) => {
  const key = keyFn(issue);
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  scope: "비상 공통수학2 generated/js 1-2-3 rules audit",
  filesChecked: files.length,
  questions: files.reduce((sum, file) => sum + file.questionCount, 0),
  imageRefs: files.reduce((sum, file) => sum + file.imageRefs, 0),
  issueCount: issues.length,
  errorIssueCount: issues.filter((issue) => issue.severity === "error").length,
  warnIssueCount: issues.filter((issue) => issue.severity === "warn").length,
  stageCounts: countBy((issue) => `stage${issue.stage}`),
  issueTypeCounts: countBy((issue) => issue.type),
  fieldCounts: countBy((issue) => issue.field),
  files,
  issues,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");
fs.writeFileSync(outMd, [
  "# 비상 공통수학2 1/2/3차 rules 검수",
  "",
  `- 검사 파일: ${report.filesChecked}`,
  `- 총 문항: ${report.questions}`,
  `- 이미지 참조: ${report.imageRefs}`,
  `- 전체 이슈: ${report.issueCount} (error ${report.errorIssueCount}, warn ${report.warnIssueCount})`,
  `- 단계별: ${JSON.stringify(report.stageCounts)}`,
  `- 타입별: ${JSON.stringify(report.issueTypeCounts)}`,
  "",
  "| file | questions | imageRefs | 1차 | 2차 | 3차 |",
  "|---|---:|---:|---:|---:|---:|",
  ...files.map((file) => `| ${file.file} | ${file.questionCount} | ${file.imageRefs} | ${file.stage1Issues} | ${file.stage2Issues} | ${file.stage3Issues} |`),
  "",
  "## 문제 항목",
  "",
  ...issues.slice(0, 1000).map((issue) => `- [${issue.severity}] ${issue.stage}차 ${issue.file} #${issue.id ?? "-"} ${issue.field}/${issue.type}: ${issue.evidence}`),
  issues.length > 1000 ? `- ... ${issues.length - 1000} more` : "",
].join("\n"), "utf8");

console.log(JSON.stringify({
  outJson: rel(outJson),
  outMd: rel(outMd),
  filesChecked: report.filesChecked,
  questions: report.questions,
  imageRefs: report.imageRefs,
  issueCount: report.issueCount,
  errorIssueCount: report.errorIssueCount,
  warnIssueCount: report.warnIssueCount,
  stageCounts: report.stageCounts,
  issueTypeCounts: report.issueTypeCounts,
  fieldCounts: report.fieldCounts,
}, null, 2));
