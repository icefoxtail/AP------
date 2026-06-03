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
    file: "비상_공통수학1_경우의수_대단원학습평가_고1.js",
    id: 1,
    content: "부등식 $4\\le x+y<7$을 만족시키는 자연수 $x$, $y$의 순서쌍 $(x, y)$의 개수는?",
    choices: ["6", "8", "10", "12", "14"],
    answer: "④",
  },
  {
    file: "비상_공통수학1_다항식_대단원학습평가_고1.js",
    id: 6,
    content:
      "다항식 $P(x)$를 $2x-1$로 나누었을 때 몫을 $Q(x)$, 나머지를 $R$라고 하자. $P(x)$를 $x-\\dfrac12$로 나누었을 때, 몫과 나머지를 차례로 구한 것은?",
    choices: ["$\\dfrac12Q(x)$, $\\dfrac12R$", "$\\dfrac12Q(x)$, $R$", "$Q(x)$, $R$", "$2Q(x)$, $R$", "$2Q(x)$, $2R$"],
    answer: "④",
  },
  {
    file: "비상_공통수학1_방정식과부등식_대단원학습평가_고1.js",
    id: 1,
    content:
      "복소수 $(1-i)a^2+(2i-5)a+4+i$의 실수 부분이 $0$이 되도록 하는 모든 실수 $a$의 값의 합은?",
    choices: ["1", "2", "3", "4", "5"],
    answer: "⑤",
  },
  {
    file: "비상_공통수학1_행렬_대단원학습평가_고1.js",
    id: 6,
    content:
      "세 행렬 $A=\\begin{pmatrix}1\\\\6\\end{pmatrix}$, $B=\\begin{pmatrix}4&-2\\end{pmatrix}$, $C=\\begin{pmatrix}0&-2\\\\-1&9\\end{pmatrix}$에 대하여 다음 중 행렬의 곱셈이 불가능한 것을 모두 고르면?",
    choices: ["$AB$", "$AC$", "$BC$", "$CA$", "$CB$"],
    answer: "②, ⑤",
  },
  {
    file: "비상_공통수학1_행렬_대단원학습평가_고1.js",
    id: 10,
    content:
      "다음 [표 1]은 지유와 서하의 1학년 1학기 두 과목 가, 나에 대한 등급이고, [표 2]는 그 두 과목의 학점이다. 학점이 다른 두 과목의 등급 평균은 $\\dfrac{\\{(등급)\\times(학점)\\}의 합}{(학점의 합)}$으로 계산한다고 한다. 네 행렬 $A=\\begin{pmatrix}2&3\\\\1&4\\end{pmatrix}$, $B=\\begin{pmatrix}2&1\\\\3&4\\end{pmatrix}$, $C=\\begin{pmatrix}4\\\\3\\end{pmatrix}$, $D=\\begin{pmatrix}4&3\\end{pmatrix}$에 대하여 서하의 두 과목의 등급 평균을 의미하는 것은?",
    choices: ["행렬 $\\dfrac17AB$의 $(2, 2)$ 성분", "행렬 $\\dfrac17AC$의 $(2, 1)$ 성분", "행렬 $\\dfrac17BC$의 $(1, 1)$ 성분", "행렬 $\\dfrac17CD$의 $(2, 1)$ 성분", "행렬 $\\dfrac17DB$의 $(1, 1)$ 성분"],
    answer: "②",
  },
  {
    file: "비상_공통수학1_경우의수_익힘책_고1.js",
    id: 1,
    content: "서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 눈의 수의 차가 2 또는 4가 되는 경우의 수는?",
    choices: ["8", "10", "12", "14", "16"],
    answer: "③",
  },
  {
    file: "비상_공통수학1_경우의수_익힘책_고1.js",
    id: 6,
    content: "6개의 문자 C, H, A, N, G, E를 일렬로 나열할 때, 모음끼리는 이웃하지 않게 나열하는 방법의 수는?",
    choices: ["480", "500", "520", "540", "560"],
    answer: "①",
  },
  {
    file: "비상_공통수학1_다항식_익힘책_고1.js",
    id: 5,
    content:
      "다음 나눗셈의 몫과 나머지를 차례로 구한 것은? $(3x^3+2x^2+8x+1)\\div(x^2+2)$",
    choices: ["$3x+2$, $x-4$", "$3x+2$, $2x-3$", "$3x+4$, $2x-1$", "$3x+6$, $-4x+2$", "$3x+7$, $4x-3$"],
    answer: "②",
  },
  {
    file: "비상_공통수학1_다항식_익힘책_고1.js",
    id: 8,
    content:
      "다항식 $P(x)=x^3-kx^2-5x+k^2-3$이 $x-2$로 나누어떨어지도록 하는 모든 실수 $k$의 값의 합은?",
    choices: ["0", "2", "4", "6", "8"],
    answer: "③",
  },
  {
    file: "비상_공통수학1_방정식과부등식_익힘책_고1.js",
    id: 1,
    content: "두 복소수 $\\alpha=2-i$, $\\beta=2+i$에 대하여 $\\alpha^2\\beta+\\beta^2\\alpha$의 값은?",
    choices: ["12", "14", "16", "18", "20"],
    answer: "⑤",
  },
  {
    file: "비상_공통수학1_행렬_익힘책_고1.js",
    id: 10,
    content:
      "행렬 $A=\\begin{pmatrix}1&-3\\\\0&1\\end{pmatrix}$에 대하여 행렬 $A^{30}-A^{31}$의 $(1, 2)$ 성분은?",
    choices: ["-3", "0", "3", "$3^{29}$", "$3^{30}$"],
    answer: "③",
  },
  {
    file: "비상_공통수학1_행렬_익힘책_고1.js",
    id: 11,
    content: "두 이차정사각행렬 $A$, $B$에 대하여 다음 중 항상 옳은 것은?",
    choices: [
      "실수 $k$에 대하여 $A=\\begin{pmatrix}a_{11}&a_{12}\\\\a_{21}&a_{22}\\end{pmatrix}$이면 $kA=\\begin{pmatrix}ka_{11}&a_{12}\\\\a_{21}&a_{22}\\end{pmatrix}$이다.",
      "$A=\\begin{pmatrix}a_{11}&a_{12}\\\\a_{21}&a_{22}\\end{pmatrix}$, $B=\\begin{pmatrix}b_{11}&b_{12}\\\\b_{21}&b_{22}\\end{pmatrix}$이면 $AB=\\begin{pmatrix}a_{11}b_{11}&a_{12}b_{12}\\\\a_{21}b_{21}&a_{22}b_{22}\\end{pmatrix}$이다.",
      "$AB=BA$이다.",
      "$AB=O$이면 $A=O$이거나 $B=O$이다.",
      "$A-B=O$이면 $B-A=O$이다.",
    ],
    answer: "⑤",
  },
  {
    file: "비상_공통수학1_행렬_익힘책_고1.js",
    id: 13,
    content:
      "다음 [표 1]은 어느 회사에서 생산하는 두 제품 A, B의 제품 한 개당 제조 원가와 판매가이고, [표 2]는 올해 상반기와 하반기의 두 제품 A, B의 판매량이다. 두 행렬 $P=\\begin{pmatrix}3&1\\\\4&2\\end{pmatrix}$, $Q=\\begin{pmatrix}10&12\\\\8&13\\end{pmatrix}$에 대하여 $PQ=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$라고 하자. 제품의 판매가에서 제조 원가를 뺀 금액을 제품의 판매 이익금이라고 할 때, 올해 하반기에 판매된 두 제품의 판매 이익금의 합을 나타낸 것은? (단, 판매 이익금의 단위는 천만 원이다.)",
    choices: ["$b-a$", "$c-a$", "$d-c$", "$d-b$", "$d-a$"],
    answer: "④",
  },
];

const touched = new Map();
for (const repair of repairs) {
  const file = findFile(repair.file);
  const state = touched.get(file) ?? load(file);
  const q = state.bank.find((item) => item.id === repair.id);
  if (!q) throw new Error(`Question ${repair.id} not found in ${repair.file}`);
  q.content = repair.content;
  q.choices = repair.choices;
  q.answer = repair.answer;
  touched.set(file, state);
}

for (const [file, state] of touched.entries()) {
  save(file, state.title, state.bank);
  console.log(`updated ${rel(file)}`);
}
