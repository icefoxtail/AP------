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

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function findFile(filename) {
  const matches = walk(jsRoot).filter((file) => path.basename(file) === filename);
  if (matches.length !== 1) throw new Error(`Expected 1 match for ${filename}, got ${matches.length}`);
  return matches[0];
}

function load(file) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 5000 });
  return { title: sandbox.window.examTitle ?? "", bank: sandbox.window.questionBank };
}

function save(file, title, bank) {
  fs.writeFileSync(file, `window.examTitle = ${JSON.stringify(title)};\n\nwindow.questionBank = ${JSON.stringify(bank, null, 2)};\n`, "utf8");
}

const repairs = [
  {
    file: "비상_공통수학1_행렬_대단원학습평가_고1.js",
    id: 13,
    content:
      "이차정사각행렬 $A$의 $(i, j)$ 성분 $a_{ij}$가 $a_{ij}=i-j$일 때, 행렬 $A+A^2+A^3+\\cdots+A^{2030}$의 모든 성분의 합을 구하시오.",
  },
  {
    file: "비상_공통수학1_행렬_중단원학습점검_고1.js",
    id: 10,
    content:
      "행렬 $A=\\begin{pmatrix}-1&0\\\\-2&1\\end{pmatrix}$에 대하여 행렬 $A+A^2+A^3+\\cdots+A^{100}$의 모든 성분의 합을 구하시오.",
  },
  {
    file: "비상_공통수학1_행렬_익힘책_고1.js",
    id: 1,
    content:
      "$2\\times2$ 행렬 $A$의 $(i, j)$ 성분 $a_{ij}$가 $a_{ij}=\\begin{cases}i^2&(i>j)\\\\-i+j&(i\\le j)\\end{cases}$일 때, 행렬 $A$를 구하시오.",
  },
  {
    file: "비상_공통수학1_행렬_익힘책_고1.js",
    id: 10,
    content:
      "행렬 $A=\\begin{pmatrix}1&-3\\\\0&1\\end{pmatrix}$에 대하여 행렬 $A^{30}-A^{31}$의 $(1, 2)$ 성분은?",
    choices: ["-3", "0", "3", "$3^{29}$", "$3^{30}$"],
  },
];

const touched = new Map();
for (const repair of repairs) {
  const file = findFile(repair.file);
  const state = touched.get(file) ?? load(file);
  const q = state.bank.find((item) => item.id === repair.id);
  if (!q) throw new Error(`Question ${repair.id} not found in ${repair.file}`);
  q.content = repair.content;
  if (repair.choices) q.choices = repair.choices;
  touched.set(file, state);
}

for (const [file, state] of touched.entries()) {
  save(file, state.title, state.bank);
  console.log(`updated ${rel(file)}`);
}
