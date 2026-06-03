import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "archive", "textbook", "generated", "js");
const worklistPath = path.join(root, "archive", "textbook", "generated", "reports", "visang_common1_gpt_worklist_clean_20260603_072213.json");
const extractionPath = path.join(root, "archive", "textbook", "generated", "reports", "text1_answer_solution_extraction_report.json");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function findFile(targetFile) {
  const full = path.join(root, targetFile);
  if (fs.existsSync(full)) return full;
  const base = path.basename(targetFile);
  const matches = walk(jsRoot).filter((file) => path.basename(file) === base);
  if (matches.length !== 1) throw new Error(`Expected 1 match for ${targetFile}, got ${matches.length}`);
  return matches[0];
}

function load(file) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 5000 });
  return { title: sandbox.window.examTitle ?? "", bank: sandbox.window.questionBank };
}

function save(file, title, bank) {
  fs.writeFileSync(file, `window.examTitle = ${JSON.stringify(title)};\n\nwindow.questionBank = ${JSON.stringify(bank, null, 2)};\n`, "utf8");
}

function normalizeText(text) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .replace(/([A-Za-z0-9가-힣)\]}])\s*#/g, "$1^3")
    .replace(/([A-Za-z0-9가-힣)\]}])\s*@/g, "$1^2")
    .replace(/([A-Za-z0-9가-힣)\]}])\s*\$/g, "$1^4")
    .replace(/\^ /g, "^")
    .trim();
}

const worklist = JSON.parse(fs.readFileSync(worklistPath, "utf8"));
const extraction = JSON.parse(fs.readFileSync(extractionPath, "utf8"));
const extractionByKey = new Map(extraction.map((item) => [`${item.setKey}::${item.displayNo}`, item]));
const targets = worklist.items.filter((item) => item.issueTypes.includes("solution_missing"));

const touched = new Map();
const stats = { filled: 0, fromRawBlock: 0, fromAnswerOnly: 0 };
for (const item of targets) {
  const file = findFile(item.targetFile);
  const state = touched.get(file) ?? load(file);
  const q = state.bank.find((entry) => entry.id === item.id);
  if (!q) throw new Error(`Question ${item.id} not found in ${item.targetFile}`);
  if (String(q.solution ?? "").trim()) continue;

  const extracted = extractionByKey.get(`${item.setKey}::${item.displayNo}`);
  const raw = normalizeText(extracted?.rawBlockText ?? extracted?.extractedSolution ?? "");
  const answer = normalizeText(q.answer ?? item.answer ?? "");

  if (raw && raw.length >= 2) {
    q.solution = `[해설] ${raw}`;
    stats.fromRawBlock += 1;
  } else {
    q.solution = `[해설] 정답: ${answer || "정답은 위와 같다."}`;
    stats.fromAnswerOnly += 1;
  }
  stats.filled += 1;
  touched.set(file, state);
}

for (const [file, state] of touched.entries()) {
  save(file, state.title, state.bank);
  console.log(`updated ${rel(file)}`);
}

console.log(JSON.stringify(stats, null, 2));
