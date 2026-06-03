import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const targets = [
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/비상_공통수학2_도형의방정식_중단원학습점검_고1.js", 13],
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/비상_공통수학2_집합과명제_대단원학습평가_고1.js", 10],
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/비상_공통수학2_집합과명제_대단원학습평가_고1.js", 18],
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/비상_공통수학2_집합과명제_대단원학습평가_고1.js", 19],
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/비상_공통수학2_집합과명제_중단원학습점검_고1.js", 1],
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/비상_공통수학2_함수와그래프_대단원학습평가_고1.js", 17],
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/비상_공통수학2_함수와그래프_대단원학습평가_고1.js", 19],
  ["archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/workbook/비상_공통수학2_도형의방정식_익힘책_고1.js", 15],
];

function parse(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return sandbox.window.questionBank;
}

for (const [relFile, id] of targets) {
  const file = path.join(root, relFile);
  const q = parse(file).find((item) => item.id === id);
  console.log(`\n--- ${path.basename(file)} #${id}`);
  console.log(JSON.stringify({
    title: q.title,
    questionType: q.questionType,
    type: q.type,
    content: q.content,
    choices: q.choices,
    answer: q.answer,
    solution: q.solution,
    image: q.image,
    tags: q.tags,
  }, null, 2));
}
