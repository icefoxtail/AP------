const assert = require("assert");
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const core = require("../archive/archive2-core.js");
const { catalog: canonicalCatalog } = require("./helpers/archive2-scope-harness.cjs");
const { assertCanonicalRuntimeGate, runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");

const root = path.resolve(__dirname, "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const sourceKey = (file, ordinal) => `${core.normalizeFile(file)}#${Number(ordinal)}`;
const runtime = readJson("archive/data/meta-foundation/runtime/derivative-v1.json");
const receipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
const packedCatalog = core.decodeCatalog(readJson("archive/data/archive2-catalog.json"));
const bySource = new Map(packedCatalog.records.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));
const readinessCheck = spawnSync(process.execPath, [
  "archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs",
  "--check",
], { cwd: root, encoding: "utf8" });
assert.strictEqual(readinessCheck.status, 0, readinessCheck.stdout || readinessCheck.stderr);

assert.strictEqual(runtime.packId, "DERIVATIVE");
// 하한(기준일 2026-11-02): 등록이 늘면 자연히 증가하므로 정확한 개수 대신 "줄어들지 않음"만 검사한다.
const total = runtime.records.length;
assert(total >= 380, `derivative runtime records shrank: ${total}`);
assert(runtime.taxonomyRows.length >= 68, `derivative taxonomy rows shrank: ${runtime.taxonomyRows.length}`);
// These two pack-level join counts and the per-row repair flags preserve the original
// promotion provenance (immutable, not recomputed by the generator); the current catalog join is separately recomputed below.
assert.strictEqual(runtime.counts.catalogUidDirectJoin, 241);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin, 79);
assert.strictEqual(runtime.records.filter((row) => row.catalogIdentityRepairVerified === true).length, runtime.counts.catalogSourceIdentityRepairJoin);
assert.strictEqual(runtime.counts.defaultSelectable + runtime.counts.supplementary, total);
assert.strictEqual(runtime.records.filter((row) => row.defaultSelectable === true).length, runtime.counts.defaultSelectable);
assert.strictEqual(runtime.counts.sourceHold + runtime.counts.automaticEligibleExpected + runtime.counts.supplementary, total);
assert.strictEqual(runtime.counts.currentCatalogUidDirectJoin + runtime.counts.currentCatalogSourceIdentityRepairJoin, total);
assert.strictEqual(runtime.counts.currentCatalogJoinMismatch, 0);
assert.strictEqual(new Set(runtime.records.map((row) => row.questionUid)).size, total);

let direct = 0;
let repaired = 0;
let sourceReady = 0;
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
  } else {
    sourceReady += 1;
  }
}
assert.strictEqual(direct + repaired, total);
assert.strictEqual(sourceReady + sourceHold, total);
assert.strictEqual(sourceReady, runtime.counts.automaticEligibleExpected);
assert.strictEqual(sourceHold, runtime.counts.sourceHold);
assert.strictEqual(sourceHold, runtime.counts.currentCatalogSourceHoldDirect);
assert.strictEqual(repaired, runtime.counts.currentCatalogSourceIdentityRepairJoin);

const newlyHeld = [
  {
    uid: "qid_v1_cca898b87f798e75221648cd0c5625c658a4df38e58dbff3f2eabfa0f60694c2",
    sourceFile: "original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js",
    ordinal: 1,
  },
  {
    uid: "qid_v1_4f911f72e843c87899999dd87c7c47a3c6b525e4dd4e2afc4e1dbf36f33ce034",
    sourceFile: "original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js",
    ordinal: 4,
  },
  {
    uid: "qid_v1_9c2d19cb736d8056f23b15537b7155d0a74a0eccf8c6b78dd52457a1ae2ef15e",
    sourceFile: "original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js",
    ordinal: 8,
  },
  {
    uid: "qid_v1_ec55d29b528ea5893652e91fab3f613aaf0dff6486c75b4a53a08494dc9f96b0",
    sourceFile: "original/high/h2/2final/25_순천고_2학기_기말_고2_수학II.js",
    ordinal: 11,
  },
];
const readiness = receipt.checked.currentCanonicalSourceReadinessV1;
assert.strictEqual(readiness.packs.DERIVATIVE.sourceHoldCount, sourceHold);
assert.strictEqual(readiness.packs.DERIVATIVE.automaticEligibleExpected, sourceReady);
assert.strictEqual(readiness.packs.DERIVATIVE.heldRecords.length, sourceHold);
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
  assert(readiness.packs.DERIVATIVE.heldRecords.some((row) => row.questionUid === item.uid &&
    row.sourceArchiveFile === item.sourceFile && row.sourceOrdinal === item.ordinal));
}

const corrected = runtime.records.find((row) => row.questionUid === "qid_v1_9e2e2da38b13f9a09e63058e85dc8fdc53455e898057a31193cd70ce6b7c629b");
assert.strictEqual(corrected.problemTypeKey, "PT_CONTINUITY_JUDGMENT");
assert.strictEqual(corrected.templateKey, "TPL_CONT_DIFF_DEFINITION_PROOF");
assert.deepStrictEqual(corrected.crossConceptKeys, ["CC_ABSOLUTE_VALUE_GRAPH", "CC_DIFFERENTIABILITY"]);

const combined = [
  ...readJson("archive/data/meta-foundation/runtime/geometry-equations-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/sets-propositions-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/functions-graphs-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/limit-continuity-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/integral-calculus-v1.json").records,
  ...runtime.records,
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
assert.strictEqual(receipt.checked.derivativeRuntimeRecords, total);
assert.strictEqual(receipt.checked.derivativeAutomaticEligibleExpected, sourceReady);
assert.strictEqual(receipt.checked.derivativeSourceHold, sourceHold);
console.log("PASS MathII derivative Archive2 runtime bridge");
