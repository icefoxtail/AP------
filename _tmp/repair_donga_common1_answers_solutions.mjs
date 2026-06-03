import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "archive", "textbook", "_동아_고등_공통수학1_교과서", "generated", "js", "textbook");
const outDir = path.join(root, "archive", "textbook", "_동아_고등_공통수학1_교과서", "generated", "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `donga_common1_answer_solution_repair_${stamp}.json`);

const missingAnswers = new Map([
  ["동아_공통수학1_경우의수_단원마무리_고1.js#5", "48"],
  ["동아_공통수학1_경우의수_단원마무리_고1.js#11", "2명"],
  ["동아_공통수학1_경우의수_단원마무리_고1.js#12", "90"],
  ["동아_공통수학1_다항식_단원마무리_고1.js#13", "15"],
]);

function parse(file) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 5000 });
  return { examTitle: sandbox.window.examTitle || "", bank: sandbox.window.questionBank || [] };
}

const files = fs.readdirSync(jsRoot)
  .filter((name) => name.endsWith(".js"))
  .map((name) => path.join(jsRoot, name))
  .sort();

const changes = [];
for (const file of files) {
  const { examTitle, bank } = parse(file);
  const base = path.basename(file);
  let changed = false;

  for (const item of bank) {
    const key = `${base}#${item.id}`;
    if (!String(item.answer ?? "").trim() && missingAnswers.has(key)) {
      item.answer = missingAnswers.get(key);
      changes.push({ file: path.relative(root, file).replaceAll("\\", "/"), id: item.id, field: "answer", value: item.answer });
      changed = true;
    }

    if (!String(item.solution ?? "").trim() && String(item.answer ?? "").trim()) {
      item.solution = `[해설] 정답: ${item.answer}`;
      changes.push({ file: path.relative(root, file).replaceAll("\\", "/"), id: item.id, field: "solution", value: item.solution });
      changed = true;
    }
  }

  if (changed) {
    const output = [
      `window.examTitle = ${JSON.stringify(examTitle)};`,
      "",
      `window.questionBank = ${JSON.stringify(bank, null, 2)};`,
      "",
    ].join("\n");
    fs.writeFileSync(file, output, "utf8");
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: "동아 공통수학1 정답 PDF + existing answers",
  answerFilled: changes.filter((change) => change.field === "answer").length,
  solutionFilled: changes.filter((change) => change.field === "solution").length,
  changes,
}, null, 2), "utf8");

console.log(JSON.stringify({
  outJson: path.relative(root, outJson).replaceAll("\\", "/"),
  answerFilled: changes.filter((change) => change.field === "answer").length,
  solutionFilled: changes.filter((change) => change.field === "solution").length,
}, null, 2));
