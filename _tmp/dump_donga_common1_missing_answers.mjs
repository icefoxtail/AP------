import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "archive", "textbook", "_동아_고등_공통수학1_교과서", "generated", "js");
const outDir = path.join(root, "archive", "textbook", "_동아_고등_공통수학1_교과서", "generated", "reports");
const outJson = path.join(outDir, "donga_common1_missing_answers_current.json");

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

function parseBank(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return sandbox.window.questionBank;
}

const items = [];
for (const file of walk(jsRoot).filter((file) => file.endsWith(".js")).sort()) {
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
    });
  }
}

fs.writeFileSync(outJson, JSON.stringify({ count: items.length, items }, null, 2), "utf8");
for (const item of items) {
  console.log(`\n--- ${path.basename(item.file)} #${item.id}`);
  console.log(String(item.content).replace(/\n/g, " "));
  if (item.choices.length) console.log(item.choices.map((choice, index) => `${index + 1}:${choice}`).join(" | "));
}
console.log(JSON.stringify({ outJson: rel(outJson), count: items.length }));
