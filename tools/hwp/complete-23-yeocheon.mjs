import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_yeocheon_2mid");
const title = "23_여천고_2학기_중간_고1_기출";
const candidate = path.join(work, "extraction/candidate/23_여천고_2학기_중간_고1_기출.candidate.js");
const details = JSON.parse(await fs.readFile(path.join(work, "question-details.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(await fs.readFile(candidate, "utf8"), ctx, { filename: candidate });

const units = {
  circle: ["도형의 방정식", "H15-SA-11", "원의 방정식", "H15-SA-11-CIRCLE_EQUATION"],
  translation: ["도형의 방정식", "H15-SA-12", "도형의 이동", "H15-SA-12-TRANSLATION"],
  set: ["집합", "H15-SB-01", "집합의 연산", "H15-SB-01-SET_OPERATION"],
  proposition: ["명제", "H15-SB-02", "명제와 진리집합", "H15-SB-02-PROPOSITION_BASIC"],
  inequality: ["여러 가지 부등식", "H15-SA-08", "부등식의 풀이", "H15-SA-08-INEQUALITY_BASIC"],
  geometry: ["도형의 방정식", "H15-SA-09", "도형의 방정식 활용", "H15-SA-09-GEOMETRY_APPLICATION"],
};
const kind = {
  "1": "circle", "2": "circle", "3": "circle", "4": "circle",
  "5": "translation", "6": "translation",
  "11": "set", "12": "set", "13": "set", "14": "proposition",
  "15": "proposition", "16": "proposition", "17": "inequality", "18": "proposition",
  "서술형1": "circle", "서술형2": "geometry", "서술형3": "geometry",
};
const excluded = new Set(["7", "8", "9", "10"]);
const questions = ctx.window.questionBank.filter((item) => !excluded.has(String(item.displayNo)));

questions.forEach((question, index) => {
  const key = String(question.displayNo);
  const decision = details[key];
  if (!decision?.answer || !decision?.solution) throw new Error(`missing independently verified answer/solution for ${key}`);
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
  question.reviewStatus = "source_checked";
  question.reviewReason = [];
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
await fs.writeFile(path.join(finalDir, "reports/EXCLUDED_QUESTIONS.md"), `# EXCLUDED SOURCE QUESTIONS — ${title}\n\n- q7: REVIEW_NEEDED — the printed diagram gives the line $f(x,y)=0$ through $(-2,0)$ and $(0,2)$; its swapped graph is parallel, so the three printed boundaries do not determine a finite enclosed area.\n- q8: REVIEW_NEEDED — the repeated movement rule and printed choices could not be reconciled into one independently reproducible value for $M^2+m^2$.\n- q9: REVIEW_NEEDED — the source page refers to a rectangle figure, but the placement needed for the overlap area is not recoverable from the native page.\n- q10: REVIEW_NEEDED — under the standard set interpretation, both ④ and ⑤ are false, so the single-answer item is source-conflicted.\n\nThe four exclusions are local question decisions; q1–q6 and q11–q18 plus all three subjective questions were independently reconstructed and retained.\n`, "utf8");
await fs.writeFile(path.join(finalDir, "reports/ANSWER_SOLUTION_DECISIONS.json"), JSON.stringify({ title, included: questions.map((item) => item.displayNo), excluded: [...excluded], decisions: details }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(finalDir, "reports/BUILD_SANITY.md"), `# BUILD SANITY — ${title}\n\n- Source: native Hancom PDF generated from the original HWP.\n- Source question count: 21.\n- Included questions: ${questions.length}.\n- Excluded questions: q7, q8, q9, q10.\n- Included answer/solution blanks: 0.\n- Exclusions are local REVIEW_NEEDED decisions documented in EXCLUDED_QUESTIONS.md; the exam pipeline continued.\n- External-review ZIP is produced only after syntax, asset, source-copy, and fresh-extract checks.\n`, "utf8");
await fs.cp(path.join(work, "extraction/assets"), path.join(finalDir, "assets"), { recursive: true });
const imageDir = path.join(finalDir, `assets/images/${title}`);
await fs.mkdir(imageDir, { recursive: true });
for (const qid of [14, 21]) {
  const source = path.join(work, "extraction/assets", `q${String(qid).padStart(3, "0")}_visual.png`);
  if (await fs.stat(source).catch(() => null)) await fs.copyFile(source, path.join(imageDir, `q${String(qid).padStart(3, "0")}.png`));
}
console.log(JSON.stringify({ output: path.join(finalDir, `${title}.js`), included: questions.length, excluded: [...excluded] }, null, 2));
