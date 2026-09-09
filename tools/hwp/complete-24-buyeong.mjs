import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/24_buyeong_2mid");
const candidatePath = path.join(work, "extraction/candidate/24_부영여고_2학기_중간_고1_기출.candidate.js");
const details = JSON.parse(await fs.readFile(path.join(work, "question-details.json"), "utf8"));
const source = await fs.readFile(candidatePath, "utf8");
const context = { window: {} };
vm.runInNewContext(source, context, { filename: candidatePath });
const unit = {
  circle: ["도형의 방정식", "H15-SA-11", "원의 방정식", "H15-SA-11-CIRCLE_EQUATION"],
  distance: ["도형의 방정식", "H15-SA-11", "원과 거리 조건", "H15-SA-11-DISTANCE_RATIO_LOCUS"],
  tangent: ["도형의 방정식", "H15-SA-11", "원과 접선", "H15-SA-11-TANGENT"],
  intersection: ["도형의 방정식", "H15-SA-11", "원과 직선·원의 교점", "H15-SA-11-INTERSECTION"],
  geometryApplication: ["도형의 방정식", "H15-SA-09", "도형의 방정식 활용", "H15-SA-09-GEOMETRY_APPLICATION"],
  translation: ["도형의 이동", "H15-SA-12", "평행이동", "H15-SA-12-TRANSLATION"],
  set: ["집합", "H15-SB-01", "집합의 연산", "H15-SB-01-SET_OPERATION"],
  proposition: ["명제", "H15-SB-02", "명제와 진리집합", "H15-SB-02-PROPOSITION_BASIC"],
  inequality: ["여러 가지 부등식", "H15-SA-08", "부등식의 풀이", "H15-SA-08-INEQUALITY_BASIC"],
  necessary: ["명제", "H15-SB-02", "필요조건과 충분조건", "H15-SB-02-NECESSARY_SUFFICIENT"],
  function: ["함수", "H15-SB-03", "함수의 뜻과 대응", "H15-SB-03-FUNCTION_RELATION"],
};
const unitFor = (id) => {
  if ([1, 4, 11].includes(id)) return unit.circle;
  if ([2, 8, "서술형1"].includes(id)) return unit.tangent;
  if ([3].includes(id)) return unit.translation;
  if ([9, 16].includes(id)) return unit.distance;
  if ([15].includes(id)) return unit.intersection;
  if ([18, "서술형3"].includes(id)) return unit.geometryApplication;
  if ([5, 12, 17, "서술형2"].includes(id)) return unit.set;
  if ([6].includes(id)) return unit.proposition;
  if ([14].includes(id)) return unit.necessary;
  if ([13, 7].includes(id)) return unit.inequality;
  return unit.function;
};
const excluded = new Set(["10", "12"]);
const questions = context.window.questionBank.filter((question) => !excluded.has(String(question.displayNo)));
questions.forEach((question, index) => { question.id = index + 1; });
for (const question of questions) {
  const key = String(question.displayNo);
  const detail = details[key];
  if (!detail || !detail.answer || !detail.solution) throw new Error(`Missing verified detail for ${key}`);
  const [category, standardUnitKey, standardUnit, subUnitKey] = unitFor(Number.isNaN(Number(key)) ? key : Number(key));
  question.category = category;
  question.originalCategory = category;
  question.standardCourse = [1, 2, 3, 4, 9, 10, 11, 15, 16, 18, "서술형1", "서술형3"].includes(Number.isNaN(Number(key)) ? key : Number(key)) ? "수학(상)" : "수학(하)";
  question.standardUnitKey = standardUnitKey;
  question.standardUnit = standardUnit;
  question.standardUnitOrder = Number(standardUnitKey.split("-").pop()) || 0;
  question.subUnitKey = subUnitKey;
  question.subUnit = standardUnit;
  question.subUnitConfidence = "candidate_evidence";
  question.subUnitClassificationDepth = "complete_candidate";
  question.answer = detail.answer;
  question.solution = detail.solution;
  question.answerStatus = "answer_filled_independent_review";
  question.solutionStatus = "solution_filled_independent_review";
  question.reviewStatus = "source_checked";
  question.reviewReason = [];
  if (question.image) {
    question.image = question.image
      .replace("assets/q018_visual.png", "assets/images/24_부영여고_2학기_중간_고1_기출/q18.png")
      .replace("assets/q021_visual.png", "assets/images/24_부영여고_2학기_중간_고1_기출/q21.png");
    question.visualAsset = question.image;
    question.imageStatus = "source_visual_asset";
    question.visualAssetStatus = "source_visual_asset";
  }
}
const title = "24_부영여고_2학기_중간_고1_기출";
const finalDir = path.join(work, "fresh-extract-final");
await fs.mkdir(finalDir, { recursive: true });
const output = `window.examTitle = ${JSON.stringify(title)};\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
await fs.writeFile(path.join(finalDir, `${title}.js`), output, "utf8");
const excludedReport = `# EXCLUDED SOURCE QUESTIONS — ${title}\n\n## q10 — REVIEW_NEEDED: source underdetermined\n\nThe source states only $6\\le\\overline{PQ}\\le14$ for arbitrary points on two symmetric circles. Those inequalities permit a range of $a$ values; they do not determine the keyed single value 21. The question is excluded rather than guessed.\n\n## q12 — REVIEW_NEEDED: source conflict\n\nThe stated set counts and overlaps do not force the keyed minimum 13; a direct construction permits a smaller union. The question is excluded rather than silently changing the source.\n`;
await fs.mkdir(path.join(finalDir, "reports"), { recursive: true });
await fs.writeFile(path.join(finalDir, "reports/EXCLUDED_QUESTIONS.md"), excludedReport, "utf8");
await fs.cp(path.join(work, "extraction/assets"), path.join(finalDir, "assets"), { recursive: true });
const imageDir = path.join(finalDir, "assets/images/24_부영여고_2학기_중간_고1_기출");
await fs.mkdir(imageDir, { recursive: true });
await fs.copyFile(path.join(work, "extraction/assets/q018_visual.png"), path.join(imageDir, "q18.png"));
await fs.copyFile(path.join(work, "extraction/assets/q021_visual.png"), path.join(imageDir, "q21.png"));
console.log(JSON.stringify({ output: path.join(finalDir, `${title}.js`), included: questions.length, excluded: [...excluded] }, null, 2));
