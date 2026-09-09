import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/24_yeocheon_2mid");
const title = "24_여천고_2학기_중간_고1_기출";
const candidatePath = path.join(work, "extraction/candidate/24_여천고_2학기_중간_고1_기출.candidate.js");
const details = JSON.parse(await fs.readFile(path.join(work, "question-details.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(await fs.readFile(candidatePath, "utf8"), ctx, { filename: candidatePath });
const u = {
  circle: ["도형의 방정식", "H15-SA-11", "원의 방정식", "H15-SA-11-CIRCLE_EQUATION"],
  tangent: ["도형의 방정식", "H15-SA-11", "원과 접선", "H15-SA-11-TANGENT"],
  distance: ["도형의 방정식", "H15-SA-11", "원과 거리 조건", "H15-SA-11-DISTANCE_RATIO_LOCUS"],
  intersection: ["도형의 방정식", "H15-SA-11", "원과 직선·원의 교점", "H15-SA-11-INTERSECTION"],
  geometry: ["도형의 방정식", "H15-SA-09", "도형의 방정식 활용", "H15-SA-09-GEOMETRY_APPLICATION"],
  translation: ["도형의 이동", "H15-SA-12", "평행이동", "H15-SA-12-TRANSLATION"],
  reflection: ["도형의 이동", "H15-SA-12", "대칭이동", "H15-SA-12-REFLECTION"],
  set: ["집합", "H15-SB-01", "집합의 연산", "H15-SB-01-SET_OPERATION"],
  setCount: ["집합", "H15-SB-01", "집합의 원소의 개수", "H15-SB-01-SET_COUNT"],
  proposition: ["명제", "H15-SB-02", "명제와 진리집합", "H15-SB-02-PROPOSITION_BASIC"],
  necessary: ["명제", "H15-SB-02", "필요조건과 충분조건", "H15-SB-02-NECESSARY_SUFFICIENT"],
  inequality: ["여러 가지 부등식", "H15-SA-08", "부등식의 풀이", "H15-SA-08-INEQUALITY_BASIC"],
};
const kind = { "1":"translation", "2":"set", "3":"reflection", "6":"necessary", "7":"set", "10":"set", "11":"geometry", "13":"inequality", "14":"necessary", "15":"setCount", "16":"inequality", "17":"circle", "18":"distance", "서술형1":"geometry", "서술형2":"circle", "서술형3":"proposition", "서술형4":"translation", "서술형5":"inequality" };
const excluded = new Set(["4", "5", "8", "9", "12"]);
const questions = ctx.window.questionBank.filter(q => !excluded.has(String(q.displayNo)));
questions.forEach((question, index) => {
  const key = String(question.displayNo);
  const detail = details[key];
  if (!detail?.answer || !detail?.solution) throw new Error(`missing detail: ${key}`);
  const [category, standardUnitKey, standardUnit, subUnitKey] = u[kind[key] || "proposition"];
  question.id = index + 1;
  question.category = category; question.originalCategory = category;
  question.standardCourse = ["1","3","11","13","16","17","18","서술형1","서술형2","서술형4"].includes(key) ? "수학(상)" : "수학(하)";
  question.standardUnitKey = standardUnitKey; question.standardUnit = standardUnit;
  question.standardUnitOrder = Number(standardUnitKey.split("-").pop()) || 0;
  question.subUnitKey = subUnitKey; question.subUnit = standardUnit;
  question.subUnitConfidence = "candidate_evidence"; question.subUnitClassificationDepth = "complete_candidate";
  question.answer = detail.answer; question.solution = detail.solution;
  question.answerStatus = "answer_filled_independent_review"; question.solutionStatus = "solution_filled_independent_review";
  question.reviewStatus = "source_checked"; question.reviewReason = [];
  if (question.image) {
    question.image = question.image.replace("assets/q007_visual.png", `assets/images/${title}/q7.png`).replace("assets/q019_visual.png", `assets/images/${title}/q19.png`);
    question.visualAsset = question.image; question.imageStatus = "source_visual_asset"; question.visualAssetStatus = "source_visual_asset";
  }
});
const finalDir = path.join(work, "fresh-extract-final");
await fs.mkdir(finalDir, { recursive: true });
await fs.writeFile(path.join(finalDir, `${title}.js`), `window.examTitle = ${JSON.stringify(title)};\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`, "utf8");
await fs.mkdir(path.join(finalDir, "reports"), { recursive: true });
await fs.writeFile(path.join(finalDir, "reports/EXCLUDED_QUESTIONS.md"), `# EXCLUDED SOURCE QUESTIONS — ${title}\n\n- q4: REVIEW_NEEDED — direct count is 28 but 28 is absent from the printed choices.\n- q5: REVIEW_NEEDED — the printed logic conditions permit B or D as the unique non-eater; no single answer is determined.\n- q8: REVIEW_NEEDED — the printed complement sets contradict $(A\\cap B)\\subseteq(A\\cup B)$.\n- q9: REVIEW_NEEDED — the proposition text in the printed view is not recoverable without guessing.\n- q12: REVIEW_NEEDED — answer choices are diagrams and were not independently adjudicated in this checkpoint.\n`, "utf8");
await fs.cp(path.join(work, "extraction/assets"), path.join(finalDir, "assets"), { recursive: true });
const imageDir = path.join(finalDir, `assets/images/${title}`); await fs.mkdir(imageDir, { recursive: true });
await fs.copyFile(path.join(work, "extraction/assets/q007_visual.png"), path.join(imageDir, "q7.png"));
await fs.copyFile(path.join(work, "extraction/assets/q019_visual.png"), path.join(imageDir, "q19.png"));
console.log(JSON.stringify({ output: path.join(finalDir, `${title}.js`), included: questions.length, excluded: [...excluded] }, null, 2));
