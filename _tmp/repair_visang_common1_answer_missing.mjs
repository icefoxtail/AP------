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
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 6, "120"],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 7, "21"],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 9, "21"],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 11, "18"],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 13, "432"],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 14, "11"],
  ["비상_공통수학1_경우의수_대단원학습평가_고1.js", 15, "30"],
  ["비상_공통수학1_경우의수_중단원학습점검_고1.js", 6, "72"],
  ["비상_공통수학1_경우의수_중단원학습점검_고1.js", 7, "60"],
  ["비상_공통수학1_경우의수_중단원학습점검_고1.js", 8, "120"],
  ["비상_공통수학1_경우의수_중단원학습점검_고1.js", 9, "432"],
  ["비상_공통수학1_경우의수_중단원학습점검_고1.js", 11, "36"],
  ["비상_공통수학1_나머지정리와인수분해_중단원학습점검_고1.js", 11, "0"],
  ["비상_공통수학1_나머지정리와인수분해_중단원학습점검_고1.js", 12, "a=6, b=-8"],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 11, "299"],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 12, "a=3, b=1"],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 13, "$P(x)=x^2-x+1$"],
  ["비상_공통수학1_다항식_대단원학습평가_고1.js", 14, "1"],
  ["비상_공통수학1_다항식_중단원학습점검_고1.js", 9, "-3"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 6, "$a>3$"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 7, "$a=2$, $b=-9$"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 9, "$\\dfrac32$"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 10, "최댓값: 3, 최솟값: $\\dfrac35$"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 12, "4"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 13, "$a=-2$, $b=-4$"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 16, "$k\\le0$ 또는 $k\\ge8$"],
  ["비상_공통수학1_방정식과부등식_대단원학습평가_고1.js", 17, "$k\\ge3$"],
  ["비상_공통수학1_복소수와이차방정식_중단원학습점검_고1.js", 8, "3"],
  ["비상_공통수학1_복소수와이차방정식_중단원학습점검_고1.js", 9, "-4"],
  ["비상_공통수학1_복소수와이차방정식_중단원학습점검_고1.js", 11, "$a=4$, $b=-2$"],
  ["비상_공통수학1_복소수와이차방정식_중단원학습점검_고1.js", 12, "0"],
  ["비상_공통수학1_복소수와이차방정식_중단원학습점검_고1.js", 13, "$2x^2+x+1=0$"],
  ["비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js", 9, "$0\\le a\\le4$"],
  ["비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js", 10, "$-2<a<1$"],
  ["비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js", 11, "$2-\\dfrac{\\sqrt2}{2}$ m"],
  ["비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js", 12, "$a\\ge1$"],
  ["비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js", 7, "$(1, 1)$"],
  ["비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js", 9, "8"],
  ["비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js", 10, "$a=4$, $b=-2$"],
  ["비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js", 11, "$\\dfrac{40}{3}$"],
  ["비상_공통수학1_행렬_대단원학습평가_고1.js", 7, "$x=1$, $y=6$, $z=2$"],
  ["비상_공통수학1_행렬_대단원학습평가_고1.js", 8, "-1"],
  ["비상_공통수학1_행렬_대단원학습평가_고1.js", 12, "$p=2$, $q=3$"],
  ["비상_공통수학1_행렬_대단원학습평가_고1.js", 13, "-2"],
  ["비상_공통수학1_행렬_중단원학습점검_고1.js", 4, "⑴ $\\begin{pmatrix}1\\\\17\\end{pmatrix}$ ⑵ $\\begin{pmatrix}1&-17\\\\0&-8\\end{pmatrix}$"],
  ["비상_공통수학1_행렬_중단원학습점검_고1.js", 6, "$\\begin{pmatrix}2&2\\\\6&0\\end{pmatrix}$"],
  ["비상_공통수학1_행렬_중단원학습점검_고1.js", 7, "$x=3$, $y=-2$"],
  ["비상_공통수학1_행렬_중단원학습점검_고1.js", 11, "회사 A: 275000원, 회사 B: 265000원"],
  ["비상_공통수학1_경우의수_익힘책_고1.js", 8, "5"],
  ["비상_공통수학1_경우의수_익힘책_고1.js", 10, "135"],
  ["비상_공통수학1_경우의수_익힘책_고1.js", 14, "360"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 6, "1"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 7, "5"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 9, "-12"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 10, "18"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 11, "16"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 12, "$x^2+x+2$"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 13, "9"],
  ["비상_공통수학1_다항식_익힘책_고1.js", 15, "$a=1$, $b=5$, $c=5$"],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 6, "10"],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 7, "최댓값: 0, 최솟값: $-\\dfrac94$"],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 9, "$k=-\\dfrac12$ 또는 $k=4$"],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 10, "4"],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 11, "24"],
  ["비상_공통수학1_방정식과부등식_익힘책_고1.js", 12, "$7\\le a\\le8$"],
  ["비상_공통수학1_행렬_익힘책_고1.js", 8, "4"],
];

const touched = new Map();
for (const [filename, id, answer] of repairs) {
  const file = findFile(filename);
  const state = touched.get(file) ?? load(file);
  const q = state.bank.find((item) => item.id === id);
  if (!q) throw new Error(`Question ${id} not found in ${filename}`);
  if (String(q.answer ?? "").trim()) throw new Error(`Answer already present for ${filename} #${id}: ${q.answer}`);
  q.answer = answer;
  touched.set(file, state);
}

for (const [file, state] of touched.entries()) {
  save(file, state.title, state.bank);
  console.log(`updated ${rel(file)}`);
}

console.log(`filled ${repairs.length} answers`);
