import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  ...fs.readdirSync(path.join(root, "archive", "exams", "original", "high", "h2", "1mid")).filter((name) => name.endsWith(".js")).map((name) => path.join(root, "archive", "exams", "original", "high", "h2", "1mid", name)),
  ...fs.readdirSync(path.join(root, "archive", "exams", "original", "high", "h2", "1final")).filter((name) => name.endsWith(".js")).map((name) => path.join(root, "archive", "exams", "original", "high", "h2", "1final", name)),
];
const orphan = /^\s*"assets\/images\/[^\r\n]+\/q\d+-solution\.svg","[^"]*","[^"]*","full","asset_verified",\r?\n/m;
const malformed = /^(\s*"solutionImage":\s*"[^"]+"),"[^"]*","[^"]*","full","asset_verified",\r?\n/m;
const malformedWholeLine = /^\s*"solutionImage":.*"full","asset_verified",\s*$/gm;
let repaired = 0;
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(orphan, "").replace(malformedWholeLine, "").replace(malformed, "$1,\n");
  if (after !== before) { fs.writeFileSync(file, after, "utf8"); repaired++; }
}
console.log(JSON.stringify({ repaired }));
