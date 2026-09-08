import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const ARCHIVE = path.join(ROOT, "archive");
const REPORT_DIR = path.join(ROOT, "reports", "h2-s1-algebra-visual-upgrade");
const INCLUDE_KEY = /^(H15-M1-|H22-A-)/u;
const EXAM_ROOT = path.join(ARCHIVE, "exams", "original", "high", "h2");
const EXAM_NAME = /_고2_(수학I|대수)(?:c)?\.js$/u;

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const rel = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const loadExam = (file) => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 5000 });
  return context.window;
};
const text = (value) => String(value ?? "");
const normalizeChoice = (value) => {
  const source = text(value).trim();
  const match = source.match(/[①②③④⑤]/u);
  if (match) return String("①②③④⑤".indexOf(match[0]) + 1);
  if (/^[1-5]$/u.test(source)) return source;
  return source;
};
const conclusion = (solution) => {
  const matches = [...text(solution).matchAll(/(?:정답|답)\s*(?:은|는|이|:)?\s*([①②③④⑤]|[1-5])/gu)];
  return matches.at(-1)?.[1] || "";
};
const hasUnbalancedDollar = (solution) => {
  let escaped = false;
  let count = 0;
  for (const char of text(solution)) {
    if (escaped) { escaped = false; continue; }
    if (char === "\\") { escaped = true; continue; }
    if (char === "$") count += 1;
  }
  return count % 2 !== 0;
};
const jumpSignals = (solution) => [
  "계산하면", "정리하면", "대입하면", "공식에 대입하면", "경우를 세면", "조건을 이용하면",
].filter((signal) => text(solution).includes(signal));
const riskSignals = (question) => {
  const content = text(question.content);
  const tags = Array.isArray(question.tags) ? question.tags : [];
  return {
    visualTag: tags.some((tag) => ["그래프", "도형", "표"].includes(tag)),
    hasProblemImage: Boolean(question.image),
    inlineSvgInContent: /<svg[ >]/iu.test(content),
    highLevel: text(question.level) === "상",
    coordinateCue: /(좌표|교점|절편|점근선|기울기|그래프|곡선|삼각형|사각형|원|반지름|접선|넓이|길이|부등식의 해)/u.test(content),
  };
};

const rows = [];
for (const file of walk(EXAM_ROOT).filter((candidate) => EXAM_NAME.test(path.basename(candidate))).sort()) {
  const window = loadExam(file);
  for (const question of window.questionBank || []) {
    if (!INCLUDE_KEY.test(text(question.standardUnitKey))) continue;
    const solution = text(question.solution);
    const storedAnswer = text(question.answer).trim();
    const extracted = conclusion(solution);
    const normalizedAnswer = normalizeChoice(storedAnswer);
    const normalizedConclusion = normalizeChoice(extracted);
    const jumps = jumpSignals(solution);
    const risk = riskSignals(question);
    const findings = [];
    if (!solution.trim()) findings.push("SOLUTION_EMPTY");
    if (Array.isArray(question.choices) && question.choices.length > 0 && !extracted) findings.push("CONCLUSION_MISSING");
    if (extracted && normalizedAnswer !== normalizedConclusion) findings.push("ANSWER_CONCLUSION_MISMATCH");
    if (hasUnbalancedDollar(solution)) findings.push("LATEX_DOLLAR_UNBALANCED");
    if (solution.length < 180) findings.push("SHORT_SOLUTION_REVIEW");
    if (jumps.length > 0) findings.push("LOGIC_JUMP_PHRASE_REVIEW");
    rows.push({
      questionUid: `${text(window.examTitle)}::q${question.id}`,
      sourceJsPath: rel(file),
      id: Number(question.id),
      standardCourse: text(question.standardCourse),
      standardUnitKey: text(question.standardUnitKey),
      standardUnit: text(question.standardUnit),
      subUnitKey: text(question.subUnitKey),
      level: text(question.level),
      answer: storedAnswer,
      solutionLength: solution.length,
      extractedConclusion: extracted,
      normalizedAnswer,
      normalizedConclusion,
      jumpSignals: jumps,
      riskSignals: risk,
      independentSolveStatus: "PENDING",
      findings,
      staticStatus: findings.some((finding) => ["SOLUTION_EMPTY", "CONCLUSION_MISSING", "ANSWER_CONCLUSION_MISMATCH", "LATEX_DOLLAR_UNBALANCED"].includes(finding)) ? "FAIL" : "REVIEW",
      solutionDisposition: "UNFROZEN",
    });
  }
}

const counts = (items, key) => items.reduce((result, item) => {
  const value = key(item);
  result[value] = (result[value] || 0) + 1;
  return result;
}, {});
const summary = {
  schemaVersion: "apmath-h2-s1-algebra-solution-freeze-audit-v1",
  generatedAt: new Date().toISOString(),
  targetCount: rows.length,
  staticStatus: counts(rows, (row) => row.staticStatus),
  findings: Object.fromEntries([...new Set(rows.flatMap((row) => row.findings))].sort().map((finding) => [finding, rows.filter((row) => row.findings.includes(finding)).length])),
  independentSolveStatus: counts(rows, (row) => row.independentSolveStatus),
  highRiskReviewCount: rows.filter((row) => Object.values(row.riskSignals).some(Boolean)).length,
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, "solution_freeze_audit.json"), JSON.stringify({ summary, rows }, null, 2) + "\n", "utf8");
const header = "questionUid,sourceJsPath,id,standardUnitKey,answer,extractedConclusion,solutionLength,staticStatus,independentSolveStatus,solutionDisposition,findings,jumpSignals\n";
const csvEscape = (value) => `"${text(value).replaceAll('"', '""')}"`;
const csv = rows.map((row) => [row.questionUid, row.sourceJsPath, row.id, row.standardUnitKey, row.answer, row.extractedConclusion, row.solutionLength, row.staticStatus, row.independentSolveStatus, row.solutionDisposition, row.findings.join("|"), row.jumpSignals.join("|")].map(csvEscape).join(",")).join("\n");
fs.writeFileSync(path.join(REPORT_DIR, "solution_freeze_audit.csv"), header + csv + "\n", "utf8");
console.log(JSON.stringify(summary, null, 2));
