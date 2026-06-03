import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const textbookRoot = path.join(root, "archive", "textbook");
const bookRoot = fs.readdirSync(textbookRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(textbookRoot, entry.name))
  .find((dir) => path.basename(dir).includes("비상교육") && path.basename(dir).includes("공통수학2") && path.basename(dir).includes("교과서"));
const textFile = path.join(bookRoot, "generated", "reports", "visang_common2_answer_pdf_text.txt");
const text = fs.readFileSync(textFile, "utf8");
const patterns = process.argv.slice(2);
for (const pattern of patterns) {
  console.log(`\n## ${pattern}`);
  let start = 0;
  let found = false;
  while (true) {
    const idx = text.indexOf(pattern, start);
    if (idx < 0) break;
    found = true;
    console.log(text.slice(Math.max(0, idx - 900), Math.min(text.length, idx + 2500)));
    start = idx + pattern.length;
  }
  if (!found) console.log("(not found)");
}
