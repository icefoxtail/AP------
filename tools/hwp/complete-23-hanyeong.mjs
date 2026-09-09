import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_hanyeong_2mid");
const title = "23_한영고_2학기_중간_고1_기출";
const candidate = path.join(work, "extraction/candidate/23_한영고_2학기_중간_고1_기출.candidate.js");
const details = JSON.parse(await fs.readFile(path.join(work, "question-details.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(await fs.readFile(candidate, "utf8"), ctx, { filename: candidate });

const units = {
  counting: ["경우의 수", "H15-SB-06", "경우의 수의 기본 원리", "H15-SB-06-COUNTING_PRINCIPLE"],
  set: ["집합", "H15-SB-01", "집합의 연산", "H15-SB-01-SET_OPERATION"],
  proposition: ["명제", "H15-SB-02", "명제와 진리집합", "H15-SB-02-PROPOSITION_BASIC"],
  inequality: ["여러 가지 부등식", "H15-SA-08", "부등식의 풀이", "H15-SA-08-INEQUALITY_BASIC"],
};
const kind = {
  "1": "counting", "2": "set", "3": "set", "4": "proposition", "5": "counting", "6": "set", "7": "proposition", "8": "set", "9": "counting", "10": "proposition", "11": "proposition", "12": "proposition", "13": "set", "14": "counting", "15": "inequality",
  "단답형1": "set", "단답형2": "set", "단답형3": "proposition", "서술형1": "inequality", "서술형2": "set", "서술형3": "counting",
};
const questions = ctx.window.questionBank;
if (!Array.isArray(questions) || questions.length !== 21) throw new Error(`expected 21 source questions, got ${questions?.length}`);
questions.forEach((question, index) => {
  const key = String(question.displayNo);
  const decision = details[key];
  if (!decision?.answer || !decision?.solution) throw new Error(`missing answer/solution for ${key}`);
  const [category, standardUnitKey, standardUnit, subUnitKey] = units[kind[key]];
  question.id = index + 1;
  question.sourceQuestionNo = key;
  question.category = category;
  question.originalCategory = category;
  question.standardCourse = "수학(하)";
  question.standardUnitKey = standardUnitKey;
  question.standardUnit = standardUnit;
  question.standardUnitOrder = Number(standardUnitKey.split("-").pop()) || 0;
  question.subUnitKey = subUnitKey;
  question.subUnit = standardUnit;
  question.subUnitConfidence = "candidate_evidence";
  question.subUnitClassificationDepth = "complete_candidate";
  question.answer = decision.answer;
  question.solution = decision.solution;
  question.answerStatus = "answer_filled_independent_review";
  question.solutionStatus = "solution_filled_independent_review";
  question.reviewStatus = key === "11" ? "source_checked_with_key_conflict" : "source_checked";
  question.reviewReason = key === "11" ? ["printed answer key conflicts with independent quadratic minimum; retained direct derivation ②"] : [];
  question.contentSource = "native_hancom_pdf_full_page";
  question.choicesSource = "native_hancom_pdf_full_page";
  if (question.visualAsset) {
    const canonical = `assets/images/${title}/q${String(question.id).padStart(3, "0")}.png`;
    question.visualAsset = canonical;
    question.image = canonical;
    question.imageStatus = "source_visual_asset";
    question.visualAssetStatus = "source_visual_asset";
  }
});

const finalDir = path.join(work, "fresh-extract-final");
await fs.mkdir(finalDir, { recursive: true });
await fs.writeFile(path.join(finalDir, `${title}.js`), `window.examTitle = ${JSON.stringify(title)};\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`, "utf8");
await fs.mkdir(path.join(finalDir, "reports"), { recursive: true });
await fs.writeFile(path.join(finalDir, "reports/EXCLUDED_QUESTIONS.md"), `# EXCLUDED SOURCE QUESTIONS — ${title}\n\n- No question was excluded from this checkpoint.\n- q11 remains included with REVIEW_NEEDED metadata because the printed answer key selects ③ while direct completion of the quadratic gives ②.\n`, "utf8");
await fs.writeFile(path.join(finalDir, "reports/ANSWER_SOLUTION_DECISIONS.json"), JSON.stringify({ title, included: questions.map((item) => item.displayNo), excluded: [], decisions: details }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(finalDir, "reports/BUILD_SANITY.md"), `# BUILD SANITY — ${title}\n\n- Source: native Hancom PDF generated from the original HWP.\n- Source question count: 21.\n- Included questions: 21.\n- Excluded questions: none.\n- q11 answer-key conflict retained as review metadata; direct derivation is included.\n- Included answer/solution blanks: 0.\n- External-review ZIP is produced only after syntax, asset, source-copy, and fresh-extract checks.\n`, "utf8");
await fs.cp(path.join(work, "extraction/assets"), path.join(finalDir, "assets"), { recursive: true });
const imageDir = path.join(finalDir, `assets/images/${title}`);
await fs.mkdir(imageDir, { recursive: true });
const visual = path.join(work, "extraction/assets/q005_visual.png");
if (await fs.stat(visual).catch(() => null)) await fs.copyFile(visual, path.join(imageDir, "q005.png"));
console.log(JSON.stringify({ output: path.join(finalDir, `${title}.js`), included: questions.length, excluded: [] }, null, 2));
