import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/24_buyeong_2mid");
const title = "24_부영여고_2학기_중간_고1_기출";
const promotionManifest = {
  examId: title,
  archiveRelativePath: "original/high/h1/2mid/24_부영여고_2학기_중간_고1_기출.js",
  sourceType: "original",
  school: "부영여고",
  year: 2024,
  grade: "고1",
  semester: "2",
  examType: "mid",
  subject: "수학(하)",
};
const review = {
  status: "reviewed_pass",
  examId: title,
  questionCount: 19,
  includedQuestionCount: 19,
  excludedQuestionCount: 2,
  reviewer: "independent_source_and_math_review",
  sourceFidelity: "PASS except q10/q12 documented REVIEW_NEEDED source conflicts",
  answerSolutionReview: "PASS for all included questions; answer key and independent derivations compared",
  assetReview: "PASS q18/q21 source visual crops decode and are referenced by canonical paths",
  browserReview: "PENDING external browser review; package is explicitly marked external-review",
  exclusions: ["q10", "q12"],
};
await fs.writeFile(path.join(work, "promotion-manifest.json"), JSON.stringify(promotionManifest, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "reports/promotion-review.json"), JSON.stringify(review, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ promotionManifest: path.join(work, "promotion-manifest.json"), review: path.join(work, "reports/promotion-review.json") }, null, 2));
