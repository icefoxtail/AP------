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
    file: "비상_공통수학1_방정식과부등식_대단원학습평가_고1.js",
    id: 15,
    content:
      "어느 샌드위치 가게에서 샌드위치 한 개의 가격이 3000원일 때 하루에 200개씩 팔리고, 이 샌드위치 한 개의 가격을 100x원 인하할 때마다 하루 판매량은 10x개씩 늘어난다고 한다. 샌드위치 가격을 인하했을 때, 샌드위치의 하루 판매 금액을 $f(x)$원이라고 하자. (단, $0\\le x\\le15$) ⑴ $f(x)$를 $x$에 대한 식으로 나타내시오. ⑵ $f(x)$의 최댓값과 최솟값을 구하시오.",
  },
  {
    file: "비상_공통수학1_방정식과부등식_대단원학습평가_고1.js",
    id: 17,
    content:
      "$x$의 값의 범위가 $4\\le x\\le5$일 때, 이차부등식 $x^2-4x-3k+4\\le0$이 성립하도록 하는 실수 $k$의 값의 범위를 구하시오.",
  },
  {
    file: "비상_공통수학1_방정식과부등식_대단원학습평가_고1.js",
    id: 18,
    content:
      "연립부등식 $\\begin{cases}x^2+x-6>0\\\\x^2-(a+2)x+3a-3\\le0\\end{cases}$의 해가 $2<x\\le3$이 되도록 하는 실수 $a$의 값의 범위를 구하시오.",
  },
  {
    file: "비상_공통수학1_방정식과부등식_익힘책_고1.js",
    id: 3,
    content:
      "이차방정식 $x^2-5kx+2k=0$의 두 근의 비가 $2:3$일 때, 실수 $k$의 값을 구하시오. (단, $k\\ne0$)",
  },
  {
    file: "비상_공통수학1_방정식과부등식_익힘책_고1.js",
    id: 7,
    content:
      "$x$에 대한 이차함수 $y=2x^2-4kx+2k^2+k$의 그래프와 직선 $y=x+1$의 두 교점의 $x$좌표를 각각 $a$, $b$라고 하자. $0\\le k\\le1$일 때, $(2a-1)(2b-1)$의 최댓값과 최솟값을 구하시오.",
  },
  {
    file: "비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js",
    id: 3,
    content:
      "다음 부등식을 푸시오. ⑴ $|2x-7|\\ge5$ ⑵ $-2x^2+3x-1>0$ ⑶ $x^2+6x+10\\le0$",
  },
  {
    file: "비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1.js",
    id: 8,
    content:
      "부등식 $|x-1|+2|x-2|\\le4$를 만족시키는 실수 $x$의 최댓값을 구하시오.",
  },
  {
    file: "비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js",
    id: 4,
    content:
      "다음 $x$의 값의 범위에서 이차함수의 최댓값과 최솟값을 구하시오. ⑴ $y=-x^2+6x-8$ $(1\\le x\\le6)$ ⑵ $y=3x^2+x-5$ $(0\\le x\\le2)$",
  },
  {
    file: "비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1.js",
    id: 9,
    content:
      "$x$의 값의 범위가 $-2\\le x\\le1$일 때, 두 이차함수 $y=x^2+2x+4$, $y=x^2-6x+k$의 최솟값은 서로 같다. 이때 실수 $k$의 값을 구하시오.",
  },
];

const touched = new Map();
for (const repair of repairs) {
  const file = findFile(repair.file);
  const state = touched.get(file) ?? load(file);
  const q = state.bank.find((item) => item.id === repair.id);
  if (!q) throw new Error(`Question ${repair.id} not found in ${repair.file}`);
  q.content = repair.content;
  touched.set(file, state);
}

for (const [file, state] of touched.entries()) {
  save(file, state.title, state.bank);
  console.log(`updated ${rel(file)}`);
}
