import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const textbookRoot = path.join(root, "archive", "textbook");
const bookRoot = fs.readdirSync(textbookRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(textbookRoot, entry.name))
  .find((dir) => path.basename(dir).includes("비상교육") && path.basename(dir).includes("공통수학2") && path.basename(dir).includes("교과서"));

if (!bookRoot) throw new Error("비상 공통수학2 교과서 폴더를 찾지 못했습니다.");

const generatedRoot = path.join(bookRoot, "generated");
const jsRoot = path.join(generatedRoot, "js");
const reportText = path.join(generatedRoot, "reports", "visang_common2_answer_pdf_text.txt");

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

function parseBank(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return sandbox.window.questionBank;
}

function jsFiles() {
  return walk(jsRoot).filter((file) => file.endsWith(".js")).sort((a, b) => rel(a).localeCompare(rel(b), "ko"));
}

function findJs(kind, unit, title) {
  const file = jsFiles().find((candidate) => {
    const base = path.basename(candidate);
    return rel(candidate).includes(`/js/${kind}/`) && base.includes(unit) && base.includes(title);
  });
  if (!file) throw new Error(`JS not found: ${kind} ${unit} ${title}`);
  return file;
}

const targets = [
  { kind: "textbook", unit: "도형의방정식", title: "중단원", id: 13 },
  { kind: "textbook", unit: "집합과명제", title: "대단원", id: 10 },
  { kind: "textbook", unit: "집합과명제", title: "대단원", id: 18 },
  { kind: "textbook", unit: "집합과명제", title: "대단원", id: 19 },
  { kind: "textbook", unit: "집합과명제", title: "중단원", id: 1 },
  { kind: "textbook", unit: "함수와그래프", title: "대단원", id: 17 },
  { kind: "textbook", unit: "함수와그래프", title: "대단원", id: 19 },
  { kind: "workbook", unit: "도형의방정식", title: "익힘책", id: 15 },
];

const found = targets.map((target) => {
  const file = findJs(target.kind, target.unit, target.title);
  const bank = parseBank(file);
  const q = bank.find((item) => item.id === target.id);
  const before = bank.find((item) => item.id === target.id - 1);
  const after = bank.find((item) => item.id === target.id + 1);
  return {
    ...target,
    file: rel(file),
    before: before && { id: before.id, content: before.content, answer: before.answer },
    question: q && {
      id: q.id,
      questionType: q.questionType,
      type: q.type,
      content: q.content,
      choices: q.choices,
      answer: q.answer,
      solution: q.solution,
      image: q.image,
    },
    after: after && { id: after.id, content: after.content, answer: after.answer },
  };
});

const allImages = walk(generatedRoot)
  .filter((file) => /\.(png|jpg|jpeg)$/i.test(file))
  .map((file) => rel(file))
  .filter((file) => /도형|집합|함수|q0?1|q0?10|q0?13|q0?15|q0?17|q0?18|q0?19|page|p\d+/i.test(file));

const answerText = fs.existsSync(reportText) ? fs.readFileSync(reportText, "utf8") : "";
const patterns = ["54~56쪽", "94~96쪽", "130~132쪽", "136~137쪽", "10 [1단계]", "17 ⑴", "01 ⑵"];
const textWindows = patterns.map((pattern) => {
  const idx = answerText.indexOf(pattern);
  return {
    pattern,
    found: idx >= 0,
    text: idx >= 0 ? answerText.slice(Math.max(0, idx - 700), Math.min(answerText.length, idx + 2200)) : "",
  };
});

const out = {
  bookRoot: rel(bookRoot),
  targets: found,
  imageCount: allImages.length,
  images: allImages.slice(0, 500),
  textWindows,
};

const outPath = path.join(generatedRoot, "reports", "visang_common2_evidence_snapshot.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(JSON.stringify({
  out: rel(outPath),
  bookRoot: rel(bookRoot),
  targets: found.length,
  imageCount: allImages.length,
}, null, 2));
