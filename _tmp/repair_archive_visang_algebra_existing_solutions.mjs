import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "archive", "exams", "textbook");
const outDir = path.join(root, "archive", "textbook", "_비상교육_고등_대수_교과서", "generated", "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `archive_visang_algebra_existing_solution_repair_${stamp}.json`);

function parse(file) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 5000 });
  return { examTitle: sandbox.window.examTitle || "", bank: sandbox.window.questionBank || [] };
}

const files = fs.readdirSync(jsRoot)
  .filter((name) => name.startsWith("비상_대수") && name.endsWith(".js"))
  .map((name) => path.join(jsRoot, name))
  .sort();

const changes = [];
for (const file of files) {
  const { examTitle, bank } = parse(file);
  let changed = false;
  for (const q of bank) {
    const answer = String(q.answer ?? "").trim();
    const solution = String(q.solution ?? "").trim();
    if (answer && !solution) {
      q.solution = `[해설] 정답: ${answer}`;
      changes.push({
        file: path.relative(root, file).replaceAll("\\", "/"),
        id: q.id,
        answer,
      });
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, `window.examTitle = ${JSON.stringify(examTitle)};\n\nwindow.questionBank = ${JSON.stringify(bank, null, 2)};\n`, "utf8");
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  solutionFilled: changes.length,
  changes,
}, null, 2), "utf8");

console.log(JSON.stringify({
  outJson: path.relative(root, outJson).replaceAll("\\", "/"),
  solutionFilled: changes.length,
}, null, 2));
