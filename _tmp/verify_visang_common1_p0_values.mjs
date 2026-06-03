import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "archive", "textbook", "generated", "js");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function findFile(filename) {
  const matches = walk(jsRoot).filter((file) => path.basename(file) === filename);
  if (matches.length !== 1) throw new Error(`Expected 1 match for ${filename}, got ${matches.length}`);
  return matches[0];
}

function loadQuestion(filename, id) {
  const file = findFile(filename);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  const q = sandbox.window.questionBank.find((item) => item.id === id);
  if (!q) throw new Error(`Missing id ${id} in ${filename}`);
  return q;
}

const checks = [
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 1, ["4≤x+y<7"]],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 7, ["징검다리"]],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 12, ["{}_nP_3", "n\\ge3"]],
  ["비상_공통수학1_경우의수_중단원학습점검_고1.js", 10, ["건물 B와 건물 C"]],
  ["비상_공통수학1_경우의수_익힘책_고1.js", 8, ["{}_{n+2}C_3", "n\\ge2"]],
  ["비상_공통수학1_경우의수_익힘책_고1.js", 11, ["7인승 자동차", "3열"]],
  ["비상_공통수학1_다항식_중단원학습점검_고1.js", 8, ["2+\\sqrt5", "2-\\sqrt5"]],
  ["비상_공통수학1_다항식_중단원학습점검_고1.js", 12, ["\\dfrac", "10^4"]],
  ["비상_공통수학1_나머지정리와인수분해_중단원학습점검_고1.js", 11, ["a_{10}", "x^{10}"]],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 8, ["x^{10}", "3^{10}(x-3)"]],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 11, ["90000\\times300-1", "90301"]],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 13, ["\\{P(x)\\}^2"]],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 14, ["x^{10}+x^7+2"]],
  ["비상_공통수학1_다항식_익힘책_고1.js", 3, ["\\sqrt3+1", "\\sqrt3-1"]],
  ["비상_공통수학1_다항식_익힘책_고1.js", 11, ["\\{A(x)+B(x)\\}^2"]],
  ["비상_공통수학1_다항식_익힘책_고1.js", 13, ["P(1)\\ne0", "Q(0)\\ne0"]],
  ["비상_공통수학1_다항식_익힘책_고1.js", 14, ["99\\times100\\times101\\times102+1"]],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 15, ["0\\le x\\le15"]],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 17, ["4\\le x\\le5", "3k+4\\le0"]],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 18, ["3a-3\\le0", "2<x\\le3"]],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 3, ["k\\ne0"]],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 7, ["0\\le k\\le1"]],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 12, ["1<x<4"]],
  ["비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js", 3, ["|2x-7|\\ge5", "x^2+6x+10\\le0"]],
  ["비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js", 8, ["|x-1|+2|x-2|\\le4"]],
  ["비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js", 4, ["1\\le x\\le6", "0\\le x\\le2"]],
  ["비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js", 9, ["-2\\le x\\le1"]],
  ["비상_공통수학1_행렬_대단원학습평가_고1.js", 13, ["A+A^2+A^3", "A^{2030}"]],
  ["비상_공통수학1_행렬_중단원학습점검_고1.js", 10, ["A+A^2+A^3", "A^{100}"]],
  ["비상_공통수학1_행렬_익힘책_고1.js", 1, ["i^2&(i>j)", "-i+j&(i\\le j)"]],
  ["비상_공통수학1_행렬_익힘책_고1.js", 10, ["A^{30}-A^{31}", "(1, 2)"]],
];

let count = 0;
for (const [filename, id, needles] of checks) {
  const q = loadQuestion(filename, id);
  const haystack = `${q.content}\n${(q.choices ?? []).join("\n")}`;
  for (const needle of needles) {
    if (!haystack.includes(needle)) {
      throw new Error(`Missing ${JSON.stringify(needle)} in ${filename} #${id}: ${haystack}`);
    }
    count += 1;
  }
}

const q10 = loadQuestion("비상_공통수학1_행렬_익힘책_고1.js", 10);
if (JSON.stringify(q10.choices) !== JSON.stringify(["-3", "0", "3", "$3^{29}$", "$3^{30}$"])) {
  throw new Error(`Unexpected choices for matrix workbook #10: ${JSON.stringify(q10.choices)}`);
}

console.log(`verified ${checks.length} questions / ${count} content tokens`);
