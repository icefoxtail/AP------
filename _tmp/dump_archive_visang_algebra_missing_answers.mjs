import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "archive", "exams", "textbook");
const outDir = path.join(root, "archive", "textbook", "_비상교육_고등_대수_교과서", "generated", "reports");
const outJson = path.join(outDir, "archive_visang_algebra_missing_answers_current.json");
const outMd = path.join(outDir, "archive_visang_algebra_missing_answers_current.md");

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function parseBank(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return sandbox.window.questionBank;
}

const files = fs.readdirSync(jsRoot)
  .filter((name) => name.startsWith("비상_대수") && name.endsWith(".js"))
  .map((name) => path.join(jsRoot, name))
  .sort((a, b) => rel(a).localeCompare(rel(b), "ko"));

const items = [];
for (const file of files) {
  const bank = parseBank(file);
  for (const q of bank) {
    if (String(q.answer ?? "").trim()) continue;
    items.push({
      file: rel(file),
      id: q.id,
      displayNo: q.displayNo,
      title: q.title || "",
      type: q.type || "",
      content: q.content || "",
      choices: q.choices || [],
      answer: q.answer || "",
      solution: q.solution || "",
    });
  }
}

fs.writeFileSync(outJson, JSON.stringify({ count: items.length, items }, null, 2), "utf8");
fs.writeFileSync(outMd, [
  "# 비상 대수 answer missing current",
  "",
  `- count: ${items.length}`,
  "",
  ...items.map((item) => [
    `## ${item.file} #${item.id} (${item.displayNo})`,
    "",
    item.content,
    "",
    item.choices.length ? item.choices.map((choice, i) => `${i + 1}. ${choice}`).join("\n") : "",
    "",
  ].join("\n")),
].join("\n"), "utf8");

console.log(JSON.stringify({ outJson: rel(outJson), outMd: rel(outMd), count: items.length }, null, 2));
