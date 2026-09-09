import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_jungang_2final");
const title = "23_중앙여고_2학기_기말_고1_기출";
const candidate = path.join(work, "extraction/candidate/23_중앙여고_2학기_기말_고1_기출.candidate.js");
const details = JSON.parse(await fs.readFile(path.join(work, "question-details.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(await fs.readFile(candidate, "utf8"), ctx, { filename: candidate });
const units = {
  function: ["함수", "H15-SB-03", "함수의 뜻과 대응", "H15-SB-03-FUNCTION_RELATION"], rational: ["유리함수", "H15-SB-04", "유리함수의 그래프", "H15-SB-04-RATIONAL_GRAPH"], irrational: ["무리함수", "H15-SB-05", "무리함수의 그래프", "H15-SB-05-IRRATIONAL_GRAPH"], set: ["집합", "H15-SB-01", "집합의 연산", "H15-SB-01-SET_OPERATION"], counting: ["경우의 수", "H15-SB-06", "경우의 수의 기본 원리", "H15-SB-06-COUNTING_PRINCIPLE"], translation: ["도형의 이동", "H15-SA-12", "도형의 이동", "H15-SA-12-TRANSLATION"], geometry: ["도형의 방정식", "H15-SA-09", "도형의 방정식 활용", "H15-SA-09-GEOMETRY_APPLICATION"],
};
const kind = { "1": "function", "2": "rational", "3": "counting", "4": "set", "5": "irrational", "6": "translation", "7": "rational", "8": "function", "9": "irrational", "10": "rational", "11": "function", "12": "counting", "13": "counting", "14": "function", "15": "counting", "16": "irrational", "17": "counting", "18": "irrational", "19": "counting", "20": "rational", "서술형1": "rational", "서술형2": "irrational", "서술형3": "counting", "서술형4": "geometry" };
const excluded = new Set(["7", "서술형2"]);
const questions = ctx.window.questionBank.filter((item) => !excluded.has(String(item.displayNo)));
questions.forEach((question, index) => {
  const key = String(question.displayNo); const decision = details[key];
  if (!decision?.answer || !decision?.solution) throw new Error(`missing answer/solution for ${key}`);
  const sourceId = question.id; const [category, standardUnitKey, standardUnit, subUnitKey] = units[kind[key]];
  question.id = index + 1; question.sourceQuestionNo = key; question.category = category; question.originalCategory = category; question.standardCourse = "수학(하)"; question.standardUnitKey = standardUnitKey; question.standardUnit = standardUnit; question.standardUnitOrder = Number(standardUnitKey.split("-").pop()) || 0; question.subUnitKey = subUnitKey; question.subUnit = standardUnit; question.subUnitConfidence = "candidate_evidence"; question.subUnitClassificationDepth = "complete_candidate"; question.answer = decision.answer; question.solution = decision.solution; question.answerStatus = "answer_filled_independent_review"; question.solutionStatus = "solution_filled_independent_review"; question.reviewStatus = key === "9" ? "source_checked_with_key_conflict" : "source_checked"; question.reviewReason = key === "9" ? ["printed answer key conflicts with direct domain/inverse derivation; retained direct result ④"] : []; question.contentSource = "native_hancom_pdf_full_page"; question.choicesSource = "native_hancom_pdf_full_page";
  if (question.visualAsset) { const canonical = `assets/images/${title}/q${String(sourceId).padStart(3, "0")}.png`; question.visualAsset = canonical; question.image = canonical; question.imageStatus = "source_visual_asset"; question.visualAssetStatus = "source_visual_asset"; }
});
const finalDir = path.join(work, "fresh-extract-final"); await fs.mkdir(finalDir, { recursive: true });
await fs.writeFile(path.join(finalDir, `${title}.js`), `window.examTitle = ${JSON.stringify(title)};\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`, "utf8");
await fs.mkdir(path.join(finalDir, "reports"), { recursive: true });
await fs.writeFile(path.join(finalDir, "reports/EXCLUDED_QUESTIONS.md"), `# EXCLUDED SOURCE QUESTIONS — ${title}\n\n- q7: REVIEW_NEEDED — direct sign analysis gives 7 admissible natural values, conflicting with the printed answer key.\n- 서술형2: REVIEW_NEEDED — graph labels and intersection coordinates are not sufficiently recoverable for an independent constant-sum derivation.\n\nq9 remains included with a direct-derivation key conflict recorded in the JS review metadata.\n`, "utf8");
await fs.writeFile(path.join(finalDir, "reports/ANSWER_SOLUTION_DECISIONS.json"), JSON.stringify({ title, included: questions.map((item) => item.displayNo), excluded: [...excluded], decisions: details }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(finalDir, "reports/BUILD_SANITY.md"), `# BUILD SANITY — ${title}\n\n- Source: native Hancom PDF generated from the original HWP.\n- Source question count: 24.\n- Included questions: 22.\n- Excluded questions: q7, 서술형2.\n- q9 key conflict retained as review metadata.\n- Included answer/solution blanks: 0.\n- External-review ZIP is produced only after syntax, asset, source-copy, and fresh-extract checks.\n`, "utf8");
await fs.cp(path.join(work, "extraction/assets"), path.join(finalDir, "assets"), { recursive: true });
const imageDir = path.join(finalDir, `assets/images/${title}`); await fs.mkdir(imageDir, { recursive: true });
for (const qid of [5, 20, 24]) { const source = path.join(work, "extraction/assets", `q${String(qid).padStart(3, "0")}_visual.png`); if (await fs.stat(source).catch(() => null)) await fs.copyFile(source, path.join(imageDir, `q${String(qid).padStart(3, "0")}.png`)); }
console.log(JSON.stringify({ output: path.join(finalDir, `${title}.js`), included: questions.length, excluded: [...excluded] }, null, 2));
