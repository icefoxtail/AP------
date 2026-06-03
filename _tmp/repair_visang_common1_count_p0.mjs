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

function load(file) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 5000 });
  return { title: sandbox.window.examTitle ?? "", bank: sandbox.window.questionBank };
}

function save(file, title, bank) {
  const output = `window.examTitle = ${JSON.stringify(title)};\n\nwindow.questionBank = ${JSON.stringify(bank, null, 2)};\n`;
  fs.writeFileSync(file, output, "utf8");
}

function findFile(filename) {
  const matches = walk(jsRoot).filter((file) => path.basename(file) === filename);
  if (matches.length !== 1) throw new Error(`Expected 1 match for ${filename}, got ${matches.length}`);
  return matches[0];
}

const repairs = [
  {
    file: "비상_공통수학1_경우의수_대단원학습평가_고1.js",
    id: 1,
    content: "부등식 4≤x+y<7을 만족시키는 자연수 x, y의 순서쌍 (x, y)의 개수는?",
  },
  {
    file: "비상_공통수학1_경우의수_대단원학습평가_고1.js",
    id: 7,
    content:
      "다음 그림과 같이 6개의 돌을 놓아 만든 징검다리가 있다. 한 번에 한 칸 또는 두 칸을 건널 수 있다고 할 때, 출발 지점에서 도착 지점까지 가는 방법의 수를 구하시오.",
  },
  {
    file: "비상_공통수학1_경우의수_대단원학습평가_고1.js",
    id: 12,
    content:
      "등식 ${}_nP_3=5\\times{}_{n+1}P_2-3\\times{}_nP_2$를 만족시키는 자연수 $n$의 값을 구하시오. (단, $n\\ge3$)",
  },
  {
    file: "비상_공통수학1_경우의수_중단원학습점검_고1.js",
    id: 10,
    content:
      "다음 그림은 어느 건물들 사이의 산책로를 나타낸 것이다. 건물 B와 건물 C 사이에 산책로를 추가하여 건물 A에서 건물 D까지 가는 방법의 수가 64가 되도록 할 때, 추가해야 하는 산책로의 수를 구하시오. (단, 같은 지점은 두 번 이상 지나지 않고, 산책로는 서로 만나지 않는다.)",
  },
  {
    file: "비상_공통수학1_경우의수_익힘책_고1.js",
    id: 8,
    content:
      "등식 ${}_{n+2}C_3-2\\times{}_nC_2={}_{n+1}C_{n-1}$을 만족시키는 자연수 $n$의 값을 구하시오. (단, $n\\ge2$)",
  },
  {
    file: "비상_공통수학1_경우의수_익힘책_고1.js",
    id: 11,
    content:
      "오른쪽 그림과 같은 7인승 자동차에 운전을 할 수 있는 A, B와 운전을 할 수 없는 C, D, E, F, G가 함께 타고 여행을 가려고 한다. 운전석에는 A 또는 B만 앉을 수 있고, C, D는 3열에 앉는다고 할 때, 7명이 이 자동차에 앉는 방법의 수를 구하시오.",
  },
];

const touched = new Map();
for (const repair of repairs) {
  const file = findFile(repair.file);
  const state = touched.has(file) ? touched.get(file) : load(file);
  const q = state.bank.find((item) => item.id === repair.id);
  if (!q) throw new Error(`Question ${repair.id} not found in ${repair.file}`);
  q.content = repair.content;
  touched.set(file, state);
}

for (const [file, state] of touched.entries()) {
  save(file, state.title, state.bank);
  console.log(`updated ${rel(file)}`);
}
