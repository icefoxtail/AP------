const assert = require("assert");
const fs = require("fs");
const path = require("path");
const C = require("../archive/archive2-core.js");

const root = path.resolve(__dirname, "..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const readText = (p) => fs.readFileSync(path.join(root, p), "utf8");
const sourceKey = (file, ordinal) => C.normalizeFile(file) + "#" + Number(ordinal);

const runtime = readJson("archive/data/meta-foundation/runtime/limit-continuity-v1.json");
const receipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
const catalog = C.decodeCatalog(readJson("archive/data/archive2-catalog.json"));

assert.strictEqual(runtime.packId, "LIMIT_CONTINUITY");
assert.strictEqual(runtime.records.length, 189);
assert.strictEqual(runtime.records.filter((r) => r.standardUnitKey === "H15-M2-01").length, 104);
assert.strictEqual(runtime.records.filter((r) => r.standardUnitKey === "H15-M2-02").length, 85);
assert.strictEqual(new Set(runtime.records.map((r) => r.questionUid)).size, 189);
assert.strictEqual(new Set(runtime.records.map((r) => sourceKey(r.sourceArchiveFile, r.sourceOrdinal))).size, 189);
assert.strictEqual(runtime.records.filter((r) => r.catalogIdentityRepairVerified === true).length, 3);
assert.strictEqual(runtime.counts.catalogUidDirectJoin, 186);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin, 3);
assert.strictEqual(runtime.counts.automaticEligibleExpected, 85);
assert.strictEqual(runtime.counts.difficultyDeferred, 104);

const bySource = new Map(catalog.records.map((r) => [sourceKey(r.sourceFile, r.sourceOrdinal), r]));
let direct = 0;
let repaired = 0;
let eligibleLimit = 0;
let eligibleContinuity = 0;

for (const overlay of runtime.records) {
  const base = bySource.get(sourceKey(overlay.sourceArchiveFile, overlay.sourceOrdinal));
  assert(base, "catalog source row missing: " + overlay.sourceArchiveFile + "#" + overlay.sourceOrdinal);
  const identityRepair = base.questionUid !== overlay.questionUid;
  if (identityRepair) {
    assert.strictEqual(base.questionUid, "");
    assert.strictEqual(overlay.catalogIdentityRepairVerified, true);
    repaired += 1;
  } else {
    direct += 1;
  }
  const merged = {
    ...base,
    ...overlay,
    sourceFile: base.sourceFile,
    sourceOrdinal: base.sourceOrdinal,
    sourceQuestionNo: base.sourceQuestionNo,
    effectiveBrowseGrade: base.effectiveBrowseGrade,
    identityStatus: identityRepair ? "VERIFIED" : base.identityStatus,
    sourceStatus: identityRepair ? "VERIFIED" : base.sourceStatus,
    sourceFingerprint: base.sourceFingerprint,
    rawQuestionHash: base.rawQuestionHash,
    approvedSourceFingerprint: base.approvedSourceFingerprint,
    gradeConflict: base.gradeConflict,
    taxonomyStatus: "CONFIRMED",
    metadataConflicts: [],
    reviewStatus: "reviewed_pass"
  };
  const gate = C.eligibility(merged);
  if (overlay.standardUnitKey === "H15-M2-01") {
    assert.strictEqual(gate.ok, false);
    assert(gate.reasons.includes("difficulty"));
    if (gate.ok) eligibleLimit += 1;
  } else {
    assert.strictEqual(gate.ok, true, overlay.questionUid + ": " + gate.reasons.join(","));
    eligibleContinuity += 1;
  }
}

assert.strictEqual(direct, 186);
assert.strictEqual(repaired, 3);
assert.strictEqual(eligibleLimit, 0);
assert.strictEqual(eligibleContinuity, 85);

assert.strictEqual(C.finderCourseGrade("수학II", "2015"), "고2");
assert.strictEqual(C.finderCourseGrade("수학II", "2022"), "고3");
assert(C.finderCourseKeys(runtime.taxonomyRows, { grade: "고2", curriculumKey: "2015" }).has("수학II"));

const workspace = readText("archive/archive2-workspace.js");
assert(/finderCourseGrade\(courseKey,\s*curriculumKey\)/.test(workspace));
assert(/courseGrade\(r\.courseKey,\s*r\.curriculumKey\)/.test(workspace));

const bridge = readText("archive/meta-foundation-runtime.js");
assert(bridge.includes("data/meta-foundation/runtime/limit-continuity-v1.json"));
assert(bridge.includes("catalogIdentityRepairVerified"));
assert(bridge.includes("META_FOUNDATION_MULTI/runtime-bridge-v3:"));

const combined = [
  ...readJson("archive/data/meta-foundation/runtime/geometry-equations-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/sets-propositions-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/functions-graphs-v1.json").records,
  ...runtime.records
];
assert.strictEqual(combined.length, 1463);
assert.strictEqual(new Set(combined.map((r) => r.questionUid)).size, 1463);
assert.strictEqual(new Set(combined.map((r) => sourceKey(r.sourceArchiveFile, r.sourceOrdinal))).size, 1463);

assert.strictEqual(receipt.status, "PASS_LIMIT_CONTINUITY_189_CATALOG_JOIN");
assert.strictEqual(receipt.checked.combinedRuntimeRecords, 1463);
assert.strictEqual(receipt.checked.combinedUniqueUid, 1463);
assert.strictEqual(receipt.checked.combinedUniqueSourceIdentity, 1463);
assert.strictEqual(receipt.checked.limitContinuityCatalogJoin, 189);
assert.strictEqual(receipt.checked.limitContinuityAutomaticEligibleExpected, 85);
assert(receipt.invariants.includes("Archive2 Finder and Compose grade routing treat 2015 수학II as 고2."));

console.log("PASS MathII limit/continuity Archive2 runtime bridge");
