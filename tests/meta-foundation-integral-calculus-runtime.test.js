const assert = require("assert");
const fs = require("fs");
const path = require("path");
const core = require("../archive/archive2-core.js");
const { catalog: canonicalCatalog } = require("./helpers/archive2-scope-harness.cjs");
const { assertCanonicalRuntimeGate, runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");

const root = path.resolve(__dirname, "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const sourceKey = (file, ordinal) => `${core.normalizeFile(file)}#${Number(ordinal)}`;
const runtime = readJson("archive/data/meta-foundation/runtime/integral-calculus-v1.json");
const receipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
const packedCatalog = core.decodeCatalog(readJson("archive/data/archive2-catalog.json"));
const bySource = new Map(packedCatalog.records.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));

assert.strictEqual(runtime.packId, "INTEGRAL_CALCULUS");
// 하한(기준일 2026-11-02): 등록이 늘면 자연히 증가하므로 정확한 개수 대신 "줄어들지 않음"만 검사한다.
const total = runtime.records.length;
assert(total >= 184, `integral runtime records shrank: ${total}`);
assert(runtime.taxonomyRows.length >= 19, `integral taxonomy rows shrank: ${runtime.taxonomyRows.length}`);
// These join fields record the promotion-time identity repair and remain immutable provenance.
assert.strictEqual(runtime.counts.catalogUidDirectJoin, 53);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin, 73);
assert.strictEqual(runtime.records.filter((row) => row.catalogIdentityRepairVerified === true).length, runtime.counts.catalogSourceIdentityRepairJoin);
const supplementaryRows = runtime.records.filter((row) => row.curriculumApplicability === "SUPPLEMENTARY_OUTSIDE_CORE");
assert(supplementaryRows.every((row) => row.defaultSelectable === false), "supplementary rows must not be default selectable");
assert.strictEqual(runtime.records.filter((row) => row.defaultSelectable === true).length, runtime.counts.defaultSelectable);
assert.strictEqual(runtime.counts.defaultSelectable + supplementaryRows.length, total);
assert.strictEqual(runtime.counts.currentCatalogUidDirectJoin + runtime.counts.currentCatalogSourceIdentityRepairJoin, total);
assert.strictEqual(runtime.counts.currentCatalogJoinMismatch, 0);
assert.strictEqual(new Set(runtime.records.map((row) => row.questionUid)).size, total);
assert.strictEqual(new Set(runtime.records.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, total);

let direct = 0;
let repaired = 0;
let sourceReady = 0;
let supplementary = 0;
let sourceHold = 0;
for (const overlay of runtime.records) {
  const base = bySource.get(sourceKey(overlay.sourceArchiveFile, overlay.sourceOrdinal));
  assert(base, `catalog source row missing: ${overlay.sourceArchiveFile}#${overlay.sourceOrdinal}`);
  const repair = base.questionUid !== overlay.questionUid;
  if (repair) {
    assert.strictEqual(base.questionUid, "");
    assert.strictEqual(overlay.catalogIdentityRepairVerified, true);
    repaired += 1;
  } else {
    direct += 1;
  }

  const gate = assertCanonicalRuntimeGate(overlay, canonicalCatalog);
  if (!repair && base.sourceStatus !== "VERIFIED") {
    assert.strictEqual(gate.ok, false);
    assert(gate.reasons.includes("source_release"));
    sourceHold += 1;
  } else if (overlay.curriculumApplicability === "SUPPLEMENTARY_OUTSIDE_CORE") {
    assert.strictEqual(gate.ok, false);
    assert.strictEqual(overlay.defaultSelectable, false);
    supplementary += 1;
  } else {
    sourceReady += 1;
  }
}
assert.strictEqual(direct + repaired, total);
// Held rows are classified before supplementary rows, so a supplementary row that is also source-held counts as held.
assert.strictEqual(sourceReady + supplementary + sourceHold, total);
assert.strictEqual(sourceReady, runtime.counts.automaticEligibleExpected);
assert.strictEqual(sourceHold, runtime.counts.sourceHold);
assert.strictEqual(sourceHold, runtime.counts.currentCatalogSourceHoldDirect);
assert.strictEqual(repaired, runtime.counts.currentCatalogSourceIdentityRepairJoin);

const newlyHeld = [
  {
    uid: "qid_v1_fdbdc3c04c56296f58ddadbb62db84955ea4c0779794d1566809361a6b594733",
    sourceFile: "original/high/h2/2final/25_강남여고_2학기_기말_고2_수학II.js",
    ordinal: 8,
  },
  {
    uid: "qid_v1_270ac66cc08e7941dd71c418f722164d182f5285278af46ffce06e66906625de",
    sourceFile: "original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js",
    ordinal: 15,
  },
  {
    uid: "qid_v1_c0e0bbe1bccefdf25af668b8ded54844a09bc0f16c6531d68f479c43b0a9f92c",
    sourceFile: "original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js",
    ordinal: 21,
  },
];
const readiness = receipt.checked.currentCanonicalSourceReadinessV1;
assert.strictEqual(readiness.packs.INTEGRAL_CALCULUS.sourceHoldCount, sourceHold);
assert.strictEqual(readiness.packs.INTEGRAL_CALCULUS.automaticEligibleExpected, sourceReady);
assert.strictEqual(readiness.packs.INTEGRAL_CALCULUS.heldRecords.length, sourceHold);
for (const item of newlyHeld) {
  const base = bySource.get(sourceKey(item.sourceFile, item.ordinal));
  assert(base);
  assert.strictEqual(base.questionUid, item.uid);
  assert.strictEqual(base.identityStatus, "VERIFIED");
  assert.strictEqual(base.sourceIntegrityStatus, "VERIFIED");
  assert.strictEqual(base.sourceStatus, "HOLD");
  assert.notStrictEqual(base.sourceFingerprint, base.approvedSourceFingerprint);
  const overlay = runtime.records.find((row) => row.questionUid === item.uid);
  assert(overlay);
  const gate = assertCanonicalRuntimeGate(overlay, canonicalCatalog);
  assert(gate.reasons.includes("source_release"));
  assert(readiness.packs.INTEGRAL_CALCULUS.heldRecords.some((row) => row.questionUid === item.uid &&
    row.sourceArchiveFile === item.sourceFile && row.sourceOrdinal === item.ordinal));
}

const combined = [
  ...readJson("archive/data/meta-foundation/runtime/geometry-equations-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/sets-propositions-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/functions-graphs-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/limit-continuity-v1.json").records,
  ...runtime.records,
  ...readJson("archive/data/meta-foundation/runtime/derivative-v1.json").records,
];
// 하한(기준일 2026-11-02): 여섯 팩 합계. 등록이 늘면 자연히 증가한다.
assert(combined.length >= 2122, `combined runtime records shrank: ${combined.length}`);
const byPack = receipt.checked.existingRuntimeRecordsByPack;
assert.strictEqual(combined.length, ["GEOMETRY_EQUATIONS", "SETS_PROPOSITIONS", "FUNCTIONS_GRAPHS", "LIMIT_CONTINUITY", "INTEGRAL_CALCULUS", "DERIVATIVE"]
  .reduce((sum, id) => sum + byPack[id], 0));
assert.strictEqual(new Set(combined.map((row) => row.questionUid)).size, combined.length);
assert.strictEqual(new Set(combined.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, combined.length);
assert.strictEqual(receipt.checked.combinedRuntimeRecords, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueUid, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueSourceIdentity, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedRuntimeCatalogJoin, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedRuntimeCatalogJoinMismatch, 0);
assert.strictEqual(receipt.checked.integralCalculusRuntimeRecords, total);
assert.strictEqual(receipt.checked.integralCalculusAutomaticEligibleExpected, sourceReady);
assert.strictEqual(receipt.checked.integralCalculusSourceHold, sourceHold);
console.log("PASS MathII integral Archive2 runtime bridge");
