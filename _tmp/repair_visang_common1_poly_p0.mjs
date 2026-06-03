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
    file: "비상_공통수학1_다항식_중단원학습점검_고1.js",
    id: 8,
    content: "$x=2+\\sqrt5$, $y=2-\\sqrt5$일 때, $x^3+y^3$의 값을 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_중단원학습점검_고1.js",
    id: 12,
    content:
      "곱셈 공식을 이용하여 다음 식의 값을 구하시오. $\\dfrac{\\sqrt{101\\times(10001-100)\\times(10^6-1)+1}}{10^4}$",
  },
  {
    file: "비상_공통수학1_나머지정리와인수분해_중단원학습점검_고1.js",
    id: 11,
    content:
      "실수 $a_0$, $a_1$, $\\cdots$, $a_{10}$에 대하여 등식 $(x^2+x-1)^5=a_0+a_1x+a_2x^2+\\cdots+a_{10}x^{10}$이 $x$에 대한 항등식일 때, $a_1+a_3+a_5+a_7+a_9$의 값을 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_대단원학습평가_고1.js",
    id: 8,
    content:
      "다항식 $x^{10}(x^2+ax+b)$를 $(x-3)^2$으로 나누었을 때, 나머지가 $3^{10}(x-3)$이다. 이때 실수 $a$, $b$의 값을 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_대단원학습평가_고1.js",
    id: 11,
    content: "인수분해를 이용하여 다음 식의 값을 구하시오. $\\dfrac{90000\\times300-1}{90301}$",
  },
  {
    file: "비상_공통수학1_다항식_대단원학습평가_고1.js",
    id: 13,
    content:
      "최고차항의 계수가 양수인 다항식 $P(x)$가 모든 실수 $x$에 대하여 $\\{P(x)\\}^2=2P(x)+x^4-2x^3+x^2-1$을 만족시킬 때, $P(x)$를 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_대단원학습평가_고1.js",
    id: 14,
    content:
      "다항식 $P(x)=x^{10}+x^7+2$를 $x-1$로 나누었을 때, 몫을 $Q(x)$라고 하자. $Q(x)$를 $x+1$로 나누었을 때, 나머지를 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_익힘책_고1.js",
    id: 3,
    content: "$a=\\sqrt3+1$, $b=\\sqrt3-1$일 때, $a^3-b^3$의 값을 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_익힘책_고1.js",
    id: 11,
    content:
      "다항식 $P(x)$를 $x-2$로 나누었을 때 몫은 $A(x)$, 나머지는 10이고, $x-8$로 나누었을 때 몫은 $B(x)$, 나머지는 -2이다. 다항식 $\\{A(x)+B(x)\\}^2$을 $x-5$로 나누었을 때, 나머지를 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_익힘책_고1.js",
    id: 13,
    content:
      "이차항의 계수가 1인 두 이차식 $P(x)$, $Q(x)$의 곱이 $x^4-5x^3+8x^2-4x$이다. $P(1)\\ne0$, $Q(0)\\ne0$일 때, $P(3)+Q(4)$의 값을 구하시오.",
  },
  {
    file: "비상_공통수학1_다항식_익힘책_고1.js",
    id: 14,
    content: "인수분해를 이용하여 다음 식의 값을 구하시오. $\\sqrt{99\\times100\\times101\\times102+1}$",
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
