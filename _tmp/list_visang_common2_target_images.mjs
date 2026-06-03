import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const textbookRoot = path.join(root, "archive", "textbook");
const bookRoot = fs.readdirSync(textbookRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(textbookRoot, entry.name))
  .find((dir) => path.basename(dir).includes("비상교육") && path.basename(dir).includes("공통수학2") && path.basename(dir).includes("교과서"));
const generatedRoot = path.join(bookRoot, "generated");

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
function pngInfo(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 24 || buf.toString("ascii", 1, 4) !== "PNG") return "";
  return `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)} ${buf.length}`;
}

const files = walk(generatedRoot).filter((file) => /\.png$/i.test(file));
const groups = {
  geometryMidQ13: files.filter((file) => path.basename(file).includes("도형의방정식_중단원학습점검") && /q13|page27|p27|page_?027|p027/i.test(path.basename(file))),
  geometryWorkbookQ15: files.filter((file) => path.basename(file).includes("도형의방정식_익힘책") && /q15|page137|p137|page_?137/i.test(path.basename(file))),
  setMidQ01: files.filter((file) => path.basename(file).includes("집합과명제_중단원학습점검") && /q01|page74|p74|page_?074/i.test(path.basename(file))),
  functionBigQ17: files.filter((file) => path.basename(file).includes("함수와그래프_대단원학습평가") && /q17|page132|p132|page_?132/i.test(path.basename(file))),
};

for (const [name, matches] of Object.entries(groups)) {
  console.log(`\n## ${name} (${matches.length})`);
  for (const file of matches.sort((a, b) => rel(a).localeCompare(rel(b), "ko"))) {
    console.log(`${rel(file)} | ${pngInfo(file)}`);
  }
}
