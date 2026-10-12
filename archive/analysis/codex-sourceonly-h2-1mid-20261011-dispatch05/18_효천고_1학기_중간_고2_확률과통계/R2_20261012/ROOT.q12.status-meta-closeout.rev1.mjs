import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const examUid = "18_효천고_1학기_중간_고2_확률과통계";
const jsPath = path.join(root, "archive/exams/original/high/h2/1mid/" + examUid + ".js");
const receiptPath = path.join(root, "archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/" + examUid + "/ITEM_RECOVERY_q12/ROOT_q12.status-meta-closeout.rev1.receipt.json");
const expectedBeforeSha = "dea2930646d4426dc6838639d308bd2accd83786f43d640f11d9b891feb2e037";
const refs = [
  ["archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/" + examUid + "/ITEM_RECOVERY_q12/R1_qid_review/R1_q12_evidence.restored.rev1.bound.json", "993f69830805d54203313cd73fccca9379054c5adea53130aa7fd94b1d340e79"],
  ["archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/" + examUid + "/ITEM_RECOVERY_q12/R1_qid_review/R1_q12_restored.complete.event.json", "6728617048c45df33f1c7e0dadce5f2c1d44327397fcb10c7fcd87488c149ad4"],
  ["archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/" + examUid + "/R2_20261012/R2.current-evidence.rev2.fixed.raw.json", "b18d528e012c9a553d67496584b17231aad7dcbcf41c24027eb35dec1e3719e3"],
  ["archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/" + examUid + "/R2_20261012/R2.generic.raw.rev2.fixed.json", "257a0501dac30473e206edbd68aaccb77d426a91f9da5e23079884c09193078a"],
  ["archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/" + examUid + "/R2_20261012/R2.complete.event.current.rev2.json", "7dcd9d6b733f596eda587a06b82410b13f1943b1e38814564d523450ef8ef4f8"],
  ["archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/" + examUid + "/ITEM_RECOVERY_q12/R1_qid_review/R1_q12_meta_difficulty_adjudication.after-R2.json", "4a80b33cfbc1da16adf5490b91bd9f9b43d93044f6b65b37e7d95d88f70ffef2"]
];

function sha256Bytes(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}
for (const [rel, expected] of refs) {
  const actual = sha256Bytes(fs.readFileSync(path.join(root, rel)));
  if (actual !== expected) throw new Error("EVIDENCE_SHA_MISMATCH:" + rel + ":" + actual);
}
function parseQuestions(text) {
  const ctx = { window: {} };
  vm.runInNewContext(text, ctx, { timeout: 2000 });
  if (!Array.isArray(ctx.window.questionBank)) throw new Error("QUESTION_BANK_PARSE_FAIL");
  return JSON.parse(JSON.stringify(ctx.window.questionBank));
}
function q12row(rows) {
  const found = rows.filter(q => Number(q.questionNumber ?? q.id) === 12);
  if (found.length !== 1 || found[0].sourceQid !== 12) throw new Error("Q12_ROW_IDENTITY_FAIL");
  return found[0];
}
function replaceOne(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0 || text.indexOf(needle, first + needle.length) >= 0) throw new Error("EXPECTED_SINGLE_TEXT:" + label);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}
function removeFieldLine(text, key, expectedValue) {
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const needle = '"' + key + '": "' + expectedValue + '",';
  const matches = lines.filter(line => line.trim() === needle);
  if (matches.length !== 1) throw new Error("EXPECTED_SINGLE_FIELD_LINE:" + key);
  const index = lines.findIndex(line => line.trim() === needle);
  lines.splice(index, 1);
  return lines.join(nl);
}
function sourceTextOffset(lines, index, text) {
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  return lines.slice(0, index).join(nl).length + (index > 0 ? nl.length : 0);
}

const beforeBytes = fs.readFileSync(jsPath);
const beforeText = beforeBytes.toString("utf8");
const beforeSha = sha256Bytes(beforeBytes);
if (beforeSha !== expectedBeforeSha) throw new Error("SOURCE_SHA_MISMATCH:" + beforeSha);
const beforeRows = parseQuestions(beforeText);
const beforeQ12 = q12row(beforeRows);
if (beforeQ12.questionUid !== "qid_v1_9389b4e77fa367305d5ed640d8eeb8f3c6d9edccc9214e894a3acf2034a8cced") throw new Error("Q12_UID_MISMATCH");
if (beforeQ12.itemStatus !== "HOLD" || beforeQ12.reviewStatus !== "HOLD") throw new Error("Q12_NOT_PENDING_HOLD");
if (beforeQ12.integrationPattern !== "SEQUENTIAL") throw new Error("Q12_META_EXPECTATION_MISMATCH");

const sourceLines = beforeText.split(/\r?\n/);
const start = sourceLines.findIndex((line, i) => line.trim() === '"id": 12,' && sourceLines[i + 1]?.trim() === '"questionNumber": 12,');
if (start < 0) throw new Error("Q12_SOURCE_BLOCK_NOT_FOUND");
let close = start + 1;
while (close < sourceLines.length && sourceLines[close] !== "  },") close++;
if (close >= sourceLines.length) throw new Error("Q12_SOURCE_BLOCK_END_NOT_FOUND");
const blockStart = sourceTextOffset(sourceLines, start, beforeText);
const blockEnd = sourceTextOffset(sourceLines, close, beforeText);
let block = beforeText.slice(blockStart, blockEnd);

block = replaceOne(block, '"integrationPattern": "SEQUENTIAL",', '"integrationPattern": "NONE",', "integrationPattern");
block = replaceOne(block, '"itemStatus": "HOLD",', '"itemStatus": "CLEAR_AFTER_FRESH_SCOPED_R1_R2",', "itemStatus");
block = removeFieldLine(block, "itemHoldReason", "Direct q12 replacement authored; item HOLD remains until qid-specific R1 and R2 review pass.");
block = removeFieldLine(block, "difficultyAssessmentStatus", "FRESH_REVIEW_PENDING");
block = removeFieldLine(block, "difficultyEvidenceDebt", "Fresh replacement candidate: bucket 2, high confidence; independent qid-specific R1/R2 review is pending.");
block = replaceOne(block, '"reviewStatus": "HOLD",', '"reviewStatus": "reviewed_pass",', "reviewStatus");

const afterText = beforeText.slice(0, blockStart) + block + beforeText.slice(blockEnd);
const afterRows = parseQuestions(afterText);
const afterQ12 = q12row(afterRows);
const expectedChanged = ["difficultyAssessmentStatus", "difficultyEvidenceDebt", "integrationPattern", "itemHoldReason", "itemStatus", "reviewStatus"];
const actualChanged = [...new Set([...Object.keys(beforeQ12), ...Object.keys(afterQ12)])].filter(k => JSON.stringify(beforeQ12[k]) !== JSON.stringify(afterQ12[k])).sort();
if (JSON.stringify(actualChanged) !== JSON.stringify(expectedChanged)) throw new Error("UNEXPECTED_Q12_FIELDS_CHANGED:" + JSON.stringify(actualChanged));
if (beforeRows.length !== afterRows.length || beforeRows.some((q, i) => Number(q.questionNumber ?? q.id) !== 12 && JSON.stringify(q) !== JSON.stringify(afterRows[i]))) throw new Error("NON_TARGET_QID_CHANGED");
for (const field of ["content", "choices", "answer", "solution", "questionUid", "sourceQid", "sourceProvenance"]) {
  if (JSON.stringify(beforeQ12[field]) !== JSON.stringify(afterQ12[field])) throw new Error("Q12_SOURCE_OR_STUDENT_FIELD_CHANGED:" + field);
}
if (afterQ12.itemStatus !== "CLEAR_AFTER_FRESH_SCOPED_R1_R2" || afterQ12.reviewStatus !== "reviewed_pass" || afterQ12.integrationPattern !== "NONE") throw new Error("Q12_CLOSEOUT_NOT_APPLIED");

fs.writeFileSync(jsPath, afterText, "utf8");
const afterBytes = fs.readFileSync(jsPath);
const afterSha = sha256Bytes(afterBytes);
const gitBlobSha = execFileSync("git", ["hash-object", "--", jsPath], { cwd: root, encoding: "utf8" }).trim();
const receipt = {
  receiptType: "ROOT_QID_STATUS_AND_META_CLOSEOUT",
  examUid,
  qid: 12,
  questionUid: afterQ12.questionUid,
  reason: "Fresh qid-scoped R1 and blind R2 acceptance matched the current replacement; R1 adjudicated the exact active integrationPattern tuple as NONE and closed the supported bucket-2/high difficulty assessment.",
  source: { path: path.relative(root, jsPath).replaceAll(path.sep, "/"), beforeRawSha256: beforeSha, afterRawSha256: afterSha, afterGitBlobSha1: gitBlobSha },
  stageEvidence: refs.map(([p, sha256]) => ({ path: p, sha256 })),
  changedFields: actualChanged,
  q12StudentAndSourceFieldsPreserved: ["content", "choices", "answer", "solution", "questionUid", "sourceQid", "sourceProvenance"],
  nonTargetRowsByteSemanticParity: true,
  itemStatus: afterQ12.itemStatus,
  reviewStatus: afterQ12.reviewStatus,
  metadataCorrection: { field: "integrationPattern", before: "SEQUENTIAL", after: "NONE", registryBasis: "Exact active H15-PS-01 combination/PT/TPL/empty-CrossConcept/empty-Condition tuple exists only with NONE; q12-only R1 adjudication." },
  difficultyCloseout: { oldFieldsRemoved: ["difficultyAssessmentStatus", "difficultyEvidenceDebt"], currentAssessmentRetained: { difficultyBucket: afterQ12.difficultyBucket, difficultyConfidence: afterQ12.difficultyConfidence, difficultyBoundaryFlag: afterQ12.difficultyBoundaryFlag, legacyLevelCompatibility: afterQ12.legacyLevelCompatibility } },
  priorFailuresAndFreezesPreserved: true,
  createdAt: "2026-10-12"
};
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ receiptPath, receiptSha256: sha256Bytes(fs.readFileSync(receiptPath)), beforeRawSha256: beforeSha, afterRawSha256: afterSha, afterGitBlobSha1: gitBlobSha, changedFields: actualChanged }, null, 2));