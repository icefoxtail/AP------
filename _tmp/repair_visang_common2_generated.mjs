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

const jsRoot = path.join(bookRoot, "generated", "js");
const reportsDir = path.join(bookRoot, "generated", "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");

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

function parseFile(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  if (!Array.isArray(sandbox.window.questionBank)) throw new Error(`questionBank missing: ${rel(file)}`);
  return {
    examTitle: sandbox.window.examTitle || "",
    questionBank: sandbox.window.questionBank,
  };
}

function writeFile(file, examTitle, questionBank) {
  const body = [
    `window.examTitle = ${JSON.stringify(examTitle)};`,
    "",
    `window.questionBank = ${JSON.stringify(questionBank, null, 2)};`,
    "",
  ].join("\n");
  fs.writeFileSync(file, body, "utf8");
}

function renumber(bank) {
  bank.forEach((q, index) => {
    q.id = index + 1;
  });
}

function findFile(kind, unit, title) {
  const file = walk(jsRoot).filter((candidate) => candidate.endsWith(".js")).find((candidate) => {
    const base = path.basename(candidate);
    return rel(candidate).includes(`/js/${kind}/`) && base.includes(unit) && base.includes(title);
  });
  if (!file) throw new Error(`file not found: ${kind} ${unit} ${title}`);
  return file;
}

function byId(bank, id) {
  const q = bank.find((item) => item.id === id);
  if (!q) throw new Error(`id not found: ${id}`);
  return q;
}

function selfEval(q) {
  q.answer = "자기평가";
  q.solution = "[해설] 자기평가 문항입니다.";
}

const touched = [];
const details = [];

function editFile(file, editFn) {
  const parsed = parseFile(file);
  const beforeCount = parsed.questionBank.length;
  editFn(parsed.questionBank);
  renumber(parsed.questionBank);
  for (const q of parsed.questionBank) {
    if (!String(q.solution ?? "").trim()) {
      if (String(q.answer ?? "").trim() === "자기평가") {
        q.solution = "[해설] 자기평가 문항입니다.";
      } else {
        q.solution = `[해설] 정답: ${String(q.answer ?? "").trim()}`;
      }
    }
  }
  writeFile(file, parsed.examTitle, parsed.questionBank);
  touched.push(rel(file));
  details.push({ file: rel(file), beforeCount, afterCount: parsed.questionBank.length });
}

editFile(findFile("textbook", "도형의방정식", "중단원"), (bank) => {
  const idx = bank.findIndex((q) => q.id === 13 && !String(q.content ?? "").trim() && !String(q.answer ?? "").trim());
  if (idx >= 0) bank.splice(idx, 1);
});

editFile(findFile("workbook", "도형의방정식", "익힘책"), (bank) => {
  const idx = bank.findIndex((q) => q.id === 15 && !String(q.content ?? "").trim() && !String(q.answer ?? "").trim());
  if (idx >= 0) bank.splice(idx, 1);
});

editFile(findFile("textbook", "집합과명제", "중단원"), (bank) => {
  const q = byId(bank, 1);
  q.content = [
    "다음 중 집합인 것을 고르시오.",
    "(1) 음악을 좋아하는 학생의 모임",
    "(2) 짝수인 소수의 모임",
    "(3) 맛있는 간식의 모임",
  ].join("\n");
  q.choices = [];
  q.answer = "(2)";
  q.solution = "[해설] 집합은 대상을 분명하게 정할 수 있는 모임이다. (1), (3)은 기준이 분명하지 않고, (2)는 원소가 분명하므로 집합이다.";
});

editFile(findFile("textbook", "집합과명제", "대단원"), (bank) => {
  const q10 = byId(bank, 10);
  q10.answer = "ㅁ";
  q10.solution = [
    "[해설] [1단계] 명제는 거짓이고 역은 참이므로 오른쪽으로 이동한다.",
    "[2단계] 명제는 거짓이고 역은 참이므로 오른쪽으로 이동한다.",
    "[3단계] 명제는 참이고 역은 거짓이므로 왼쪽으로 이동한다.",
    "따라서 도착하는 지점은 ㅁ이다.",
  ].join(" ");
  selfEval(byId(bank, 18));
  selfEval(byId(bank, 19));
});

editFile(findFile("textbook", "함수와그래프", "대단원"), (bank) => {
  const q17 = byId(bank, 17);
  q17.answer = "(1) a>0, b<0, c>0 (2) 제2사분면";
  q17.solution = [
    "[해설] 무리함수의 그래프는 y=√(ax) (a>0)의 그래프를 x축의 방향으로 -b만큼, y축의 방향으로 c만큼 평행이동한 것이므로 a>0, b<0, c>0이다.",
    "유리함수 y=a/(x+b)-c의 점근선은 x=-b, y=-c이고, 이 부호에 따른 그래프는 제2사분면을 지나지 않는다.",
  ].join(" ");
  selfEval(byId(bank, 18));
  selfEval(byId(bank, 19));
});

for (const file of walk(jsRoot).filter((candidate) => candidate.endsWith(".js"))) {
  if (touched.includes(rel(file))) continue;
  editFile(file, () => {});
}

const report = {
  generatedAt: new Date().toISOString(),
  scope: "비상 공통수학2 generated/js repair before archive promotion",
  touchedFiles: [...new Set(touched)].sort((a, b) => a.localeCompare(b, "ko")),
  details,
};

fs.mkdirSync(reportsDir, { recursive: true });
const out = path.join(reportsDir, `visang_common2_generated_repair_${stamp}.json`);
fs.writeFileSync(out, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ out: rel(out), touchedFiles: report.touchedFiles.length }, null, 2));
