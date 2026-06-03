import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "archive", "textbook", "generated", "js");
const ids = new Set([1,3,4,6,7,8,10,11,12,13,14,15,17,18]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

for (const file of walk(jsRoot).filter((file) => file.endsWith(".js"))) {
  const code = fs.readFileSync(file, "utf8");
  if (!code.includes("鍮꾩긽") && !code.includes("비상")) continue;
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 5000 });
  const bank = sandbox.window.questionBank;
  if (!Array.isArray(bank)) continue;
  console.log(`\nFILE ${rel(file)}`);
  for (const q of bank) {
    if (!ids.has(q.id)) continue;
    console.log(JSON.stringify({ id: q.id, content: q.content, choices: q.choices, answer: q.answer, image: q.image }, null, 2));
  }
}
