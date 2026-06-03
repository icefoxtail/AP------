import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const textbookRoot = path.join(root, "archive", "textbook");
const bookRoot = fs.readdirSync(textbookRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(textbookRoot, entry.name))
  .find((dir) => path.basename(dir).includes("비상교육") && path.basename(dir).includes("공통수학2") && path.basename(dir).includes("교과서"));
const p = path.join(bookRoot, "generated", "reports", "visang_common2_evidence_snapshot.json");
const j = JSON.parse(fs.readFileSync(p, "utf8"));

for (const t of j.targets) {
  console.log(`\n--- ${t.file} #${t.id}`);
  console.log("before:", t.before ? JSON.stringify(t.before) : "");
  console.log("question:", JSON.stringify(t.question, null, 2));
  console.log("after:", t.after ? JSON.stringify(t.after) : "");
}

console.log("\n--- text windows");
for (const w of j.textWindows) {
  console.log(`\nPATTERN ${w.pattern} FOUND ${w.found}`);
  console.log(w.text.slice(0, 2200));
}

console.log("\n--- images sample");
console.log(j.images.slice(0, 160).join("\n"));
