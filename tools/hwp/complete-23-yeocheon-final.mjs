import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_yeocheon_2final");
const title = "23_여천고_2학기_기말_고1_기출";
const candidate = path.join(work, "extraction/candidate/23_여천고_2학기_기말_고1_기출.candidate.js");
const details = JSON.parse(await fs.readFile(path.join(work, "question-details.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(await fs.readFile(candidate, "utf8"), ctx, { filename: candidate });
const units = {
  function: ["함수", "H15-SB-03", "함수의 뜻과 대응", "H15-SB-03-FUNCTION_RELATION"],
  set: ["집합", "H15-SB-01", "집합의 연산", "H15-SB-01-SET_OPERATION"],
  proposition: ["명제", "H15-SB-02", "명제와 진리집합", "H15-SB-02-PROPOSITION_BASIC"],
  rational: ["유리함수", "H15-SB-04", "유리함수의 그래프", "H15-SB-04-RATIONAL_GRAPH"],
  irrational: ["무리함수", "H15-SB-05", "무리함수의 그래프", "H15-SB-05-IRRATIONAL_GRAPH"],
  counting: ["경우의 수", "H15-SB-06", "경우의 수의 기본 원리", "H15-SB-06-COUNTING_PRINCIPLE"],
  inequality: ["여러 가지 부등식", "H15-SA-08", "부등식의 풀이", "H15-SA-08-INEQUALITY_BASIC"],
  geometry: ["도형의 방정식", "H15-SA-09", "도형의 방정식 활용", "H15-SA-09-GEOMETRY_APPLICATION"],
};
const kind = {
  "1": "function", "2": "function", "3": "function", "4": "function", "5": "function", "6": "function", "7": "rational", "8": "rational", "9": "rational", "10": "irrational", "11": "irrational", "12": "irrational", "13": "counting", "14": "counting", "15": "counting", "16": "counting", "17": "function", "18": "counting", "단답형1": "rational", "단답형2": "set", "서술형1": "rational", "서술형2": "irrational", "서술형3": "counting",
};
const excluded = new Set(["5", "11"]);
const questions = ctx.window.questionBank.filter((item) => !excluded.has(String(item.displayNo)));
questions.forEach((question, index) => {
  const key = String(question.displayNo);
  const decision = details[key];
  if (!decision?.answer || !decision?.solution) throw new Error(`missing answer/solution for ${key}`);
  const sourceId = question.id;
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
    const canonical = `assets/images/${title}/q${String(sourceId).padStart(3, "0")}.png`;
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
await fs.writeFile(path.join(finalDir, "reports/EXCLUDED_QUESTIONS.md"), `# EXCLUDED SOURCE QUESTIONS — ${title}\n\n- q5: REVIEW_NEEDED — literal evaluation of the printed inverse-composition expression yields a value absent from the choices; the printed key cannot be reconciled independently.\n- q11: REVIEW_NEEDED — the rational-to-radical graph option raster does not provide enough unambiguous axis/endpoint evidence for a source-safe choice.\n\nThese are local question exclusions. The other 21 source questions were retained with independently reconstructed answers and solutions.\n`, "utf8");
await fs.writeFile(path.join(finalDir, "reports/ANSWER_SOLUTION_DECISIONS.json"), JSON.stringify({ title, included: questions.map((item) => item.displayNo), excluded: [...excluded], decisions: details }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(finalDir, "reports/BUILD_SANITY.md"), `# BUILD SANITY — ${title}\n\n- Source: native Hancom PDF generated from the original HWP.\n- Source question count: 23 (18 objective, 2 short-answer, 3 subjective).\n- Included questions: 21.\n- Excluded questions: q5, q11.\n- Included answer/solution blanks: 0.\n- External-review ZIP is produced only after syntax, asset, source-copy, and fresh-extract checks.\n`, "utf8");
await fs.cp(path.join(work, "extraction/assets"), path.join(finalDir, "assets"), { recursive: true });
const imageDir = path.join(finalDir, `assets/images/${title}`);
await fs.mkdir(imageDir, { recursive: true });
for (const qid of [12]) {
  const source = path.join(work, "extraction/assets", `q${String(qid).padStart(3, "0")}_visual.png`);
  if (await fs.stat(source).catch(() => null)) await fs.copyFile(source, path.join(imageDir, `q${String(qid).padStart(3, "0")}.png`));
}
console.log(JSON.stringify({ output: path.join(finalDir, `${title}.js`), included: questions.length, excluded: [...excluded] }, null, 2));
