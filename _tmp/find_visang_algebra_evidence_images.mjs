import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "archive", "textbook", "_비상교육_고등_대수_교과서", "generated");
const needles = [
  ["삼각함수_익힘책", ["q009", "q021", "q026", "q028", "q029", "question_009", "question_021", "question_026", "question_028", "question_029"]],
  ["수열_익힘책", ["q025", "question_025"]],
  ["지수함수와 로그함수_익힘책", ["q021", "q026", "question_021", "question_026"]],
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(base).filter((file) => /\.(png|jpg|jpeg)$/i.test(file));
for (const [unit, names] of needles) {
  console.log(`\n## ${unit}`);
  const hits = files.filter((file) => file.includes(unit) && names.some((name) => path.basename(file).includes(name)));
  for (const hit of hits.slice(0, 80)) console.log(hit);
  if (!hits.length) console.log("(no hits)");
}
