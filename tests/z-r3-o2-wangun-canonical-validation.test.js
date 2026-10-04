const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const examFile = "archive/exams/original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js";
const physicalEvidenceFile = "archive/data/r3-intake/m2/25_왕운중_1학기_중간_중2_기출.r3-r32.physical-evidence.json";
const sourceRepairFile = "archive/data/r3-intake/m2/25_왕운중_1학기_중간_중2_기출.r3-r32.source-repair.json";
const expectedHolds = [1, 3, 6, 9, 11, 14, 15];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sha256(bytes) {
  return "sha256:" + crypto.createHash("sha256").update(bytes).digest("hex");
}

async function run() {
  const { validatePhysicalEvidence } = await import("../archive/tools/review-evidence-gate.mjs");
  const report = validatePhysicalEvidence({ examFile, evidenceFile: physicalEvidenceFile, stage: "R3" });
  console.log("O2_R3_CANONICAL_GATE");
  console.log(JSON.stringify(report, null, 2));

  assert.equal(report.ok, true);
  assert.deepEqual(report.issues, []);
  assert.equal(report.stage, "R3");
  assert.equal(report.questionCount, 23);
  assert.equal(report.itemHoldCount, 0);
  assert.deepEqual(report.itemHoldQids, []);

  const physical = readJson(physicalEvidenceFile);
  const sourceRepair = readJson(sourceRepairFile);
  const examBlob = execFileSync("git", ["hash-object", examFile], { encoding: "utf8" }).trim();
  assert.equal(physical.finalArtifactGitBlob, examBlob);
  assert.equal(physical.examSha256, report.examSha256);
  assert.equal(sha256(fs.readFileSync(sourceRepairFile)), physical.sourceRepairEvidenceSha256);
  assert.equal(physical.sourceRepair.evidenceSha256, physical.sourceRepairEvidenceSha256);
  assert.deepEqual(physical.openQids, []);
  assert.equal(physical.candidateDisposition, "R3_PASS");
  assert.equal(physical.summary.lockedScopeMutationCount, 0);
  const metaSidecar = readJson("archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.create.meta-v2.metadata.json");
  assert.equal(metaSidecar.examGitBlob, examBlob);

  assert.equal(sourceRepair.status, "SOURCE_PIXEL_REPAIRED");
  assert.equal(sourceRepair.sourceAuthority.pdfSha256, "sha256:6ed6c336ced01cc1f74bbf364228b2efef34b7b8ce9eb6034e6d1c8641181871");
  assert.deepEqual(sourceRepair.scope.repairQids, expectedHolds);
  assert.equal(sourceRepair.scopeVerification.lockedScopeMutationCount, 0);
  assert.deepEqual(sourceRepair.scopeVerification.unapprovedFieldChanges, []);
  assert.equal(sourceRepair.scopeVerification.q7Unchanged, true);
  assert.equal(sourceRepair.scopeVerification.q7SolutionSha256Before, sourceRepair.scopeVerification.q7SolutionSha256After);

  const examSource = fs.readFileSync(examFile, "utf8");
  const sandbox = { window: {} };
  const vm = require("node:vm");
  vm.runInNewContext(examSource, sandbox, { filename: examFile, timeout: 5000 });
  const questions = sandbox.window.questionBank;
  const imageQuestions = questions.filter((question) => question.image);
  assert.deepEqual(Array.from(imageQuestions, (question) => question.id).sort((a, b) => a - b), [14, 15]);
  const sourceImages = new Map(physical.sourceAuthority.linkedProblemImages.map((image) => [image.qid, image]));
  for (const question of imageQuestions) {
    const linked = sourceImages.get(question.id);
    assert.ok(linked, "Missing source image evidence for q" + question.id);
    assert.equal(question.image, linked.path);
    const assetPath = "archive/" + question.image;
    const bytes = fs.readFileSync(assetPath);
    assert.equal(sha256(bytes), linked.assetSha256);
    assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
    assert.ok(bytes.readUInt32BE(16) > 0);
    assert.ok(bytes.readUInt32BE(20) > 0);
  }

  const r1Receipt = readJson("archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review1.json");
  const r1Validator = readJson("archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review1.validator.json");
  const r2Receipt = readJson("archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review2.json");
  const r2Validator = readJson("archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review2.validator.json");
  for (const receipt of [r1Receipt, r2Receipt]) {
    assert.equal(receipt.finalArtifactSha, "c8adc68629f98b9a9448b01cabd00283972e8035");
    assert.equal(receipt.itemHoldCount, 7);
    assert.deepEqual(receipt.itemHoldQids, expectedHolds);
  }
  assert.equal(r1Receipt.reviewDecision, "PASS_WITH_ITEM_HOLDS");
  assert.equal(r2Receipt.reviewDecision, "PASS_WITH_ITEM_HOLDS");
  const r1EvidencePath = "archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review1.physical-evidence.json";
  const r1ValidatorPath = "archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review1.validator.json";
  const r2EvidencePath = "archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review2.physical-evidence.json";
  const r2ValidatorPath = "archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review2.validator.json";
  const r2DecisionPath = "archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review2.recheck-decision.json";
  const gitBlob = (file) => execFileSync("git", ["hash-object", file], { encoding: "utf8" }).trim();
  assert.equal(r1Receipt.evidenceSha, gitBlob(r1EvidencePath));
  assert.equal(r1Receipt.validatorReceiptSha, gitBlob(r1ValidatorPath));
  assert.equal(r2Receipt.evidenceSha, gitBlob(r2EvidencePath));
  assert.equal(r2Receipt.validatorReceiptSha, gitBlob(r2ValidatorPath));
  assert.equal(r2Receipt.recheckDecisionSha, gitBlob(r2DecisionPath));
  assert.equal(physical.sourceAuthority.review2ReceiptBlob, gitBlob("archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.review2.json"));
  assert.equal(physical.sourceAuthority.review2ValidatorBlob, gitBlob(r2ValidatorPath));
  assert.equal(r1Validator.result.ok, true);
  assert.equal(r2Validator.result.ok, true);
  assert.equal(r1Validator.result.itemHoldCount, 7);
  assert.equal(r2Validator.result.itemHoldCount, 7);
  assert.ok(r1Validator.workflowRunId > 0 && r1Validator.workflowJobId > 0);
  assert.equal(r2Validator.targetedCanonicalGate, "PASS");
  assert.ok(r2Validator.workflowRunId > 0 && r2Validator.workflowJobId > 0);

  console.log(JSON.stringify({
    marker: "O2_R3_CANONICAL_GATE",
    finalArtifactGitBlob: examBlob,
    finalArtifactSha256: report.examSha256,
    itemHoldCount: report.itemHoldCount,
    openQids: physical.openQids,
    q7Unchanged: sourceRepair.scopeVerification.q7Unchanged,
    sourceImageQids: imageQuestions.map((question) => question.id),
    preservedR1R2HoldCount: 7
  }));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
