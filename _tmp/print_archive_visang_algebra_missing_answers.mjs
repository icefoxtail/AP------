import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const report = path.join(root, "archive", "textbook", "_비상교육_고등_대수_교과서", "generated", "reports", "archive_visang_algebra_missing_answers_current.json");
const data = JSON.parse(fs.readFileSync(report, "utf8"));

for (const item of data.items) {
  console.log(`\n--- ${path.basename(item.file)} #${item.id} ${item.displayNo} choices:${item.choices.length}`);
  console.log(String(item.content).replace(/\n/g, " "));
  if (item.choices.length) {
    console.log(item.choices.map((choice, index) => `${index + 1}:${choice}`).join(" | "));
  }
}
